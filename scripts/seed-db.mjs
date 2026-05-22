import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import Module from "node:module";
import ts from "typescript";
import pg from "pg";

const require = createRequire(import.meta.url);
const { Pool } = pg;
const rootDir = process.cwd();
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (typeof request === "string" && request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(rootDir, "src", request.slice(2)),
      parent,
      isMain,
      options
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX
    }
  });

  module._compile(output.outputText, filename);
};

function loadEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function json(value) {
  return JSON.stringify(value);
}

function uuidFromString(value) {
  const hash = crypto.createHash("sha1").update(value).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16) +
      hash.slice(18, 20),
    hash.slice(20, 32)
  ].join("-");
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function ensureTables(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      challenge_id TEXT NOT NULL,
      level TEXT NOT NULL,
      title TEXT NOT NULL,
      short_title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      topic TEXT NOT NULL,
      concept TEXT NOT NULL,
      beginner_explanation TEXT NOT NULL,
      syntax TEXT NOT NULL,
      example TEXT NOT NULL,
      example_columns JSONB NOT NULL DEFAULT '[]'::jsonb,
      example_rows JSONB NOT NULL DEFAULT '[]'::jsonb,
      common_mistakes JSONB NOT NULL DEFAULT '[]'::jsonb,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      story TEXT NOT NULL,
      task TEXT NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      table_name TEXT NOT NULL,
      required_columns JSONB NOT NULL DEFAULT '[]'::jsonb,
      expected_info TEXT NOT NULL,
      starter_query TEXT NOT NULL,
      hints JSONB NOT NULL DEFAULT '[]'::jsonb,
      success_feedback TEXT NOT NULL,
      expected_result_columns JSONB,
      expected_result_rows JSONB,
      expected_result_message TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getColumns(client, tableName) {
  const result = await client.query(
    `
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
    `,
    [tableName]
  );

  return new Map(
    result.rows.map((row) => [
      row.column_name,
      { dataType: row.data_type, udtName: row.udt_name }
    ])
  );
}

function pickExistingColumns(values, columns) {
  return Object.entries(values)
    .filter(([column]) => columns.has(column))
    .map(([column, value]) => {
      const metadata = columns.get(column);
      const nextValue =
        metadata?.udtName === "uuid" && typeof value === "string"
          ? isUuid(value)
            ? value
            : uuidFromString(value)
          : value;

      return [column, nextValue];
    });
}

async function upsertRow(client, tableName, values, columns) {
  const entries = pickExistingColumns(values, columns);

  if (!columns.has("id")) {
    throw new Error(`Table ${tableName} must have an id column for idempotent seeding.`);
  }

  if (entries.length === 0) {
    return;
  }

  const conflictColumn = columns.has("slug") ? "slug" : "id";
  const conflictValue = entries.find(([column]) => column === conflictColumn)?.[1];
  const columnNames = entries.map(([column]) => column);
  const params = entries.map(([, value]) => value);

  if (conflictValue === undefined) {
    throw new Error(`Table ${tableName} must have ${conflictColumn} values.`);
  }

  const updateEntries = entries.filter(
    ([column]) => column !== "id" && column !== "created_at" && column !== conflictColumn
  );

  if (columns.has("updated_at")) {
    updateEntries.push(["updated_at", new Date()]);
  }

  if (updateEntries.length > 0) {
    const updateSet = updateEntries.map(
      ([column], index) => `${column} = $${index + 1}`
    );
    const updateParams = updateEntries.map(([, value]) => value);
    const updateResult = await client.query(
      `
        UPDATE ${tableName}
        SET ${updateSet.join(", ")}
        WHERE ${conflictColumn} = $${updateParams.length + 1}
      `,
      [...updateParams, conflictValue]
    );

    if (updateResult.rowCount > 0) {
      return;
    }
  }

  const placeholders = columnNames.map((_, index) => `$${index + 1}`);

  await client.query(
    `
      INSERT INTO ${tableName} (${columnNames.join(", ")})
      VALUES (${placeholders.join(", ")})
    `,
    params
  );
}

async function getIdMapBySourceKey(client, tableName, columns) {
  const keyColumn = columns.has("slug") ? "slug" : "id";
  const result = await client.query(`SELECT id, ${keyColumn} AS source_key FROM ${tableName}`);
  return new Map(result.rows.map((row) => [row.source_key, row.id]));
}

async function deleteStaleRows(client, tableName, columns, sourceKeys) {
  const keyColumn = columns.has("slug") ? "slug" : "id";
  const metadata = columns.get(keyColumn);
  const keys = sourceKeys.map((key) =>
    metadata?.udtName === "uuid" && typeof key === "string" && !isUuid(key)
      ? uuidFromString(key)
      : key
  );

  await client.query(
    `
      DELETE FROM ${tableName}
      WHERE NOT (${keyColumn} = ANY($1))
    `,
    [keys]
  );
}

function validateMapping(lessons, challenges) {
  if (lessons.length !== 18) {
    throw new Error(`Expected 18 lessons, found ${lessons.length}.`);
  }

  if (challenges.length !== 18) {
    throw new Error(`Expected 18 challenges, found ${challenges.length}.`);
  }

  const challengeIds = new Set(challenges.map((challenge) => challenge.id));
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const duplicateChallengeIds = lessons
    .map((lesson) => lesson.challengeId)
    .filter((id, index, ids) => ids.indexOf(id) !== index);

  if (duplicateChallengeIds.length > 0) {
    throw new Error(`Duplicate lesson challenge mapping: ${duplicateChallengeIds.join(", ")}.`);
  }

  for (const lesson of lessons) {
    if (!challengeIds.has(lesson.challengeId)) {
      throw new Error(`Lesson ${lesson.id} maps to missing challenge ${lesson.challengeId}.`);
    }
  }

  for (const challenge of challenges) {
    if (!lessonIds.has(challenge.lessonId)) {
      throw new Error(`Challenge ${challenge.id} maps to missing lesson ${challenge.lessonId}.`);
    }
  }
}

async function main() {
  loadEnvLocal();

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Add it to .env.local or your environment.");
  }

  const { lessons, challenges } = require(path.join(rootDir, "src/lib/data.ts"));
  const { getExpectedResultForChallenge } = require(
    path.join(rootDir, "src/lib/mock-sql.ts")
  );

  validateMapping(lessons, challenges);

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl:
      databaseUrl.includes("neon.tech") || databaseUrl.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await ensureTables(client);

    const lessonColumns = await getColumns(client, "lessons");
    const challengeColumns = await getColumns(client, "challenges");

    for (const [index, lesson] of lessons.entries()) {
      await upsertRow(
        client,
        "lessons",
        {
          id: lesson.id,
          slug: lesson.slug,
          challenge_id: lesson.challengeId,
          level: lesson.level,
          title: lesson.title,
          short_title: lesson.shortTitle,
          description: lesson.description,
          difficulty: lesson.difficulty,
          topic: lesson.topic,
          concept: lesson.concept,
          beginner_explanation: lesson.beginnerExplanation,
          syntax: lesson.syntax,
          example: lesson.example,
          example_columns: json(lesson.exampleColumns),
          example_rows: json(lesson.exampleRows),
          common_mistakes: json(lesson.commonMistakes),
          sort_order: index + 1
        },
        lessonColumns
      );
    }

    const lessonIdBySourceKey = await getIdMapBySourceKey(
      client,
      "lessons",
      lessonColumns
    );
    const lessonDbIdBySourceId = new Map(
      lessons.map((lesson) => [
        lesson.id,
        lessonIdBySourceKey.get(lessonColumns.has("slug") ? lesson.slug : lesson.id)
      ])
    );

    for (const [index, challenge] of challenges.entries()) {
      const expectedResult = getExpectedResultForChallenge(challenge);
      const lessonId =
        challengeColumns.get("lesson_id")?.udtName === "uuid"
          ? lessonDbIdBySourceId.get(challenge.lessonId)
          : challenge.lessonId;

      if (!lessonId) {
        throw new Error(`Could not resolve database id for ${challenge.lessonId}.`);
      }

      await upsertRow(
        client,
        "challenges",
        {
          id: challenge.id,
          lesson_id: lessonId,
          slug: challenge.slug,
          title: challenge.title,
          description: challenge.description,
          story: challenge.story,
          task: challenge.task,
          topic: challenge.topic,
          difficulty: challenge.difficulty,
          table_name: challenge.table,
          required_columns: json(challenge.requiredColumns),
          expected_info: challenge.expectedInfo,
          starter_query: challenge.starterQuery,
          hints: json(challenge.hints),
          success_feedback: challenge.successFeedback,
          expected_result_columns: json(expectedResult.columns),
          expected_result_rows: json(expectedResult.rows),
          expected_result_message: expectedResult.message,
          sort_order: index + 1
        },
        challengeColumns
      );
    }

    const challengeIdBySourceKey = await getIdMapBySourceKey(
      client,
      "challenges",
      challengeColumns
    );
    const challengeDbIdBySourceId = new Map(
      challenges.map((challenge) => [
        challenge.id,
        challengeIdBySourceKey.get(
          challengeColumns.has("slug") ? challenge.slug : challenge.id
        )
      ])
    );

    for (const [index, lesson] of lessons.entries()) {
      const challengeId =
        lessonColumns.get("challenge_id")?.udtName === "uuid"
          ? challengeDbIdBySourceId.get(lesson.challengeId)
          : lesson.challengeId;

      if (!challengeId) {
        throw new Error(`Could not resolve database id for ${lesson.challengeId}.`);
      }

      await upsertRow(
        client,
        "lessons",
        {
          id: lesson.id,
          slug: lesson.slug,
          challenge_id: challengeId,
          level: lesson.level,
          title: lesson.title,
          short_title: lesson.shortTitle,
          description: lesson.description,
          difficulty: lesson.difficulty,
          topic: lesson.topic,
          concept: lesson.concept,
          beginner_explanation: lesson.beginnerExplanation,
          syntax: lesson.syntax,
          example: lesson.example,
          example_columns: json(lesson.exampleColumns),
          example_rows: json(lesson.exampleRows),
          common_mistakes: json(lesson.commonMistakes),
          sort_order: index + 1
        },
        lessonColumns
      );
    }

    await deleteStaleRows(
      client,
      "challenges",
      challengeColumns,
      challenges.map((challenge) =>
        challengeColumns.has("slug") ? challenge.slug : challenge.id
      )
    );
    await deleteStaleRows(
      client,
      "lessons",
      lessonColumns,
      lessons.map((lesson) => (lessonColumns.has("slug") ? lesson.slug : lesson.id))
    );

    await client.query("COMMIT");

    const lessonCount = await client.query("SELECT COUNT(*)::int AS count FROM lessons");
    const challengeCount = await client.query(
      "SELECT COUNT(*)::int AS count FROM challenges"
    );

    console.log(`Seeded ${lessons.length} lessons and ${challenges.length} challenges.`);
    console.log(`Database now has ${lessonCount.rows[0].count} lessons.`);
    console.log(`Database now has ${challengeCount.rows[0].count} challenges.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
