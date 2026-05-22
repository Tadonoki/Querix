import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { updateProgressActivityAndGetProgress } from "@/lib/progress";
import { getChallengeById, getRelatedLessonForChallenge } from "@/lib/data";
import {
  getExpectedResultForChallenge,
  runMockQuery,
  validateChallenge
} from "@/lib/mock-sql";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId, query: userQuery, onlyMarkComplete, today } = await req.json();
    if (!challengeId || !today) {
      return NextResponse.json(
        { error: "challengeId and today are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const challenge = getChallengeById(challengeId);

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const relatedLesson = getRelatedLessonForChallenge(challenge);

    if (onlyMarkComplete) {
      const id = crypto.randomUUID();
      await query(
        `INSERT INTO completed_challenges (id, user_id, challenge_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, challenge_id) DO NOTHING`,
        [id, userId, challenge.id]
      );

      const progress = await updateProgressActivityAndGetProgress(
        userId,
        today,
        relatedLesson?.slug
      );

      return NextResponse.json({ success: true, progress });
    }

    // Standard submission
    if (typeof userQuery !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    // 1. Perform controlled backend validation
    const feedback = validateChallenge(userQuery, challenge);
    const expectedResult = getExpectedResultForChallenge(challenge);
    const queryResult =
      feedback.status === "success" ? expectedResult : runMockQuery(userQuery);

    // 2. Save submission to Neon database
    const submissionId = crypto.randomUUID();
    await query(
      `INSERT INTO submissions (id, user_id, challenge_id, query, status, feedback_message, result)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        submissionId,
        userId,
        challenge.id,
        userQuery,
        feedback.status,
        feedback.message,
        JSON.stringify(queryResult)
      ]
    );

    // 3. If correct, mark complete and update progress
    if (feedback.status === "success") {
      const id = crypto.randomUUID();
      await query(
        `INSERT INTO completed_challenges (id, user_id, challenge_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, challenge_id) DO NOTHING`,
        [id, userId, challenge.id]
      );
    }

    // 4. Update streak / activity and get final progress
    const progress = await updateProgressActivityAndGetProgress(
      userId,
      today,
      relatedLesson?.slug
    );

    return NextResponse.json({
      feedback,
      result: queryResult,
      progress
    });
  } catch (error) {
    console.error("POST /api/progress/challenges error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
