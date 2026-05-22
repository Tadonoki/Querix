import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { lessons } from "@/lib/data";

const emptyProgress = {
  completedLessons: [],
  completedChallenges: [],
  lastOpenedLesson: lessons[0]?.slug ?? "apa-itu-sql",
  lastActivityDate: null,
  streakCount: 0
};

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({
        progress: emptyProgress,
        isAuthenticated: false
      });
    }

    const userId = session.user.id;

    // 1. Fetch user progress metadata
    const progressRes = await query(
      `SELECT last_opened_lesson_slug, last_activity_date, streak_count FROM user_progress WHERE user_id = $1`,
      [userId]
    );

    // 2. Fetch completed lessons
    const lessonsRes = await query(
      `SELECT lesson_slug FROM completed_lessons WHERE user_id = $1`,
      [userId]
    );

    // 3. Fetch completed challenges
    const challengesRes = await query(
      `SELECT challenge_id FROM completed_challenges WHERE user_id = $1`,
      [userId]
    );

    const completedLessons = lessonsRes.rows.map((r) => r.lesson_slug);
    const completedChallenges = challengesRes.rows.map((r) => r.challenge_id);

    let lastOpenedLesson = lessons[0]?.slug ?? "apa-itu-sql";
    let lastActivityDate: string | null = null;
    let streakCount = 0;

    if (progressRes.rows.length > 0) {
      const row = progressRes.rows[0];
      if (row.last_opened_lesson_slug) {
        lastOpenedLesson = row.last_opened_lesson_slug;
      }
      if (row.last_activity_date) {
        // format date as YYYY-MM-DD
        const dateObj = new Date(row.last_activity_date);
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");
        lastActivityDate = `${y}-${m}-${d}`;
      }
      streakCount = row.streak_count ?? 0;
    }

    return NextResponse.json({
      progress: {
        completedLessons,
        completedChallenges,
        lastOpenedLesson,
        lastActivityDate,
        streakCount
      },
      isAuthenticated: true
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lastOpenedLesson } = await req.json();
    if (!lastOpenedLesson) {
      return NextResponse.json(
        { error: "lastOpenedLesson is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Upsert user progress with the last opened lesson
    await query(
      `INSERT INTO user_progress (user_id, last_opened_lesson_slug)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE
       SET last_opened_lesson_slug = EXCLUDED.last_opened_lesson_slug,
           updated_at = NOW()`,
      [userId, lastOpenedLesson]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/progress error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
