"use client";

import { BookOpen } from "lucide-react";
import { LessonCard, LessonStatus } from "@/components/learn/lesson-card";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { getLessonsByLevel } from "@/lib/data";

function resolveStatus(
  slug: string,
  completedLessons: string[],
  lastOpenedLesson: string
): LessonStatus {
  if (completedLessons.includes(slug)) {
    return "Selesai";
  }

  if (lastOpenedLesson === slug) {
    return "Sedang dipelajari";
  }

  return "Belum mulai";
}

export function LearnPageClient() {
  const { progress } = useLearningProgress();
  const lessonsByLevel = getLessonsByLevel();

  return (
    <main className="bg-querix-paper py-10 lg:py-14">
      <div className="container space-y-10 lg:space-y-12">
        <section className="max-w-4xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground lg:h-14 lg:w-14">
            <BookOpen className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-primary sm:text-4xl lg:text-5xl">
            Materi SQL Terstruktur
          </h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground lg:mt-4 lg:max-w-3xl lg:text-xl lg:leading-9">
            Mulai dari SELECT paling dasar, lanjut ke agregasi, lalu masuk ke
            contoh kasus yang sering ditemui calon Data Analyst.
          </p>
        </section>

        {Object.entries(lessonsByLevel).map(([level, levelLessons]) => (
          <section key={level}>
            <div className="mb-5 flex items-center justify-between gap-4 lg:mb-6">
              <h2 className="text-2xl font-bold tracking-normal text-primary lg:text-3xl">
                {level}
              </h2>
              <p className="text-sm text-muted-foreground lg:text-base">
                {levelLessons.length} materi
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {levelLessons.map((lesson) => (
                <LessonCard
                  key={lesson.slug}
                  lesson={lesson}
                  status={resolveStatus(
                    lesson.slug,
                    progress.completedLessons,
                    progress.lastOpenedLesson
                  )}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
