import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl:
    databaseUrl.includes("neon.tech") || databaseUrl.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined
});

export async function query(text: string, params?: unknown[]) {
  return await pool.query(text, params);
}
