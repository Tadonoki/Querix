import { query } from "@/lib/db";
import { lessons } from "@/lib/data";

function getYesterdayDateKey(todayStr: string) {
  const [year, month, day] = todayStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function updateProgressActivityAndGetProgress(
  userId: string,
  today: string,
  lastOpenedLessonSlug?: string
) {
  // Get current progress
  const progressRes = await query(
    `SELECT last_activity_date, streak_count, last_opened_lesson_slug FROM user_progress WHERE user_id = $1`,
    [userId]
  );

  let newStreak = 1;
  const yesterday = getYesterdayDateKey(today);

  if (progressRes.rows.length > 0) {
    const row = progressRes.rows[0];
    let lastActiveDateStr: string | null = null;
    if (row.last_activity_date) {
      const dateObj = new Date(row.last_activity_date);
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      lastActiveDateStr = `${y}-${m}-${d}`;
    }

    if (lastActiveDateStr === today) {
      newStreak = row.streak_count ?? 1;
    } else if (lastActiveDateStr === yesterday) {
      newStreak = (row.streak_count ?? 0) + 1;
    } else {
      newStreak = 1;
    }
  }

  // Upsert progress activity
  await query(
    `INSERT INTO user_progress (user_id, last_activity_date, streak_count, last_opened_lesson_slug)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE
     SET last_activity_date = EXCLUDED.last_activity_date,
         streak_count = EXCLUDED.streak_count,
         last_opened_lesson_slug = COALESCE(EXCLUDED.last_opened_lesson_slug, user_progress.last_opened_lesson_slug),
         updated_at = NOW()`,
    [userId, today, newStreak, lastOpenedLessonSlug || null]
  );

  // Fetch updated info
  const finalProgressRes = await query(
    `SELECT last_opened_lesson_slug, last_activity_date, streak_count FROM user_progress WHERE user_id = $1`,
    [userId]
  );

  const lessonsRes = await query(
    `SELECT lesson_slug FROM completed_lessons WHERE user_id = $1`,
    [userId]
  );

  const challengesRes = await query(
    `SELECT challenge_id FROM completed_challenges WHERE user_id = $1`,
    [userId]
  );

  const completedLessons = lessonsRes.rows.map((r) => r.lesson_slug);
  const completedChallenges = challengesRes.rows.map((r) => r.challenge_id);

  let lastOpened = lastOpenedLessonSlug || lessons[0]?.slug || "apa-itu-sql";
  let finalLastActivityDate: string | null = today;
  let finalStreak = newStreak;

  if (finalProgressRes.rows.length > 0) {
    const row = finalProgressRes.rows[0];
    if (row.last_opened_lesson_slug) {
      lastOpened = row.last_opened_lesson_slug;
    }
    if (row.last_activity_date) {
      const dateObj = new Date(row.last_activity_date);
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      finalLastActivityDate = `${y}-${m}-${d}`;
    }
    finalStreak = row.streak_count ?? 0;
  }

  return {
    completedLessons,
    completedChallenges,
    lastOpenedLesson: lastOpened,
    lastActivityDate: finalLastActivityDate,
    streakCount: finalStreak
  };
}
