import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { updateProgressActivityAndGetProgress } from "@/lib/progress";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, today } = await req.json();
    if (!slug || !today) {
      return NextResponse.json(
        { error: "slug and today are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // 1. Insert into completed_lessons
    const id = crypto.randomUUID();
    await query(
      `INSERT INTO completed_lessons (id, user_id, lesson_slug)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, lesson_slug) DO NOTHING`,
      [id, userId, slug]
    );

    // 2. Update streak & get updated progress
    const progress = await updateProgressActivityAndGetProgress(userId, today, slug);

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("POST /api/progress/lessons error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
