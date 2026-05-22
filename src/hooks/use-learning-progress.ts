"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { challenges, lessons } from "@/lib/data";

export type LearningProgress = {
  completedLessons: string[];
  completedChallenges: string[];
  lastOpenedLesson: string;
  lastActivityDate: string | null;
  streakCount: number;
};

const STORAGE_KEY = "querix-progress";
const DAY_MS = 24 * 60 * 60 * 1000;

const emptyProgress: LearningProgress = {
  completedLessons: [],
  completedChallenges: [],
  lastOpenedLesson: lessons[0]?.slug ?? "",
  lastActivityDate: null,
  streakCount: 0
};

const legacyChallengeIdMap: Record<string, string> = {
  "laporan-marketing": "challenge-select",
  "pelanggan-jakarta": "challenge-where",
  "produk-termahal": "challenge-order-by",
  "pesanan-terbaru": "challenge-limit",
  "total-pelanggan-kota": "challenge-group-by"
};

function uniqueValidItems(items: unknown, validIds: string[]) {
  if (!Array.isArray(items)) {
    return [];
  }

  const validSet = new Set(validIds);
  return Array.from(
    new Set(items.filter((item): item is string => typeof item === "string"))
  ).filter((item) => validSet.has(item));
}

function normalizeCompletedChallenges(items: unknown) {
  if (!Array.isArray(items)) {
    return [];
  }

  const validChallengeIds = new Set(challenges.map((challenge) => challenge.id));
  const migrated = items
    .filter((item): item is string => typeof item === "string")
    .map((item) => legacyChallengeIdMap[item] ?? item)
    .filter((item) => validChallengeIds.has(item));

  return Array.from(new Set(migrated));
}

function isDateKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKeyToTime(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function daysBetween(previousDate: string, nextDate: string) {
  return Math.round(
    (dateKeyToTime(nextDate) - dateKeyToTime(previousDate)) / DAY_MS
  );
}

function normalizeStreak(lastActivityDate: string | null, streakCount = 0) {
  if (!lastActivityDate) {
    return 0;
  }

  const dayGap = daysBetween(lastActivityDate, localDateKey());
  if (dayGap < 0 || dayGap > 1) {
    return 0;
  }

  return Math.max(1, streakCount);
}

function normalizeProgress(progress: Partial<LearningProgress>) {
  const lessonSlugs = lessons.map((lesson) => lesson.slug);
  const lastOpenedLesson = lessonSlugs.includes(progress.lastOpenedLesson ?? "")
    ? progress.lastOpenedLesson ?? emptyProgress.lastOpenedLesson
    : emptyProgress.lastOpenedLesson;
  const lastActivityDate = isDateKey(progress.lastActivityDate)
    ? progress.lastActivityDate
    : null;

  return {
    completedLessons: uniqueValidItems(progress.completedLessons, lessonSlugs),
    completedChallenges: normalizeCompletedChallenges(
      progress.completedChallenges
    ),
    lastOpenedLesson,
    lastActivityDate,
    streakCount: normalizeStreak(lastActivityDate, progress.streakCount)
  };
}

function readProgress() {
  if (typeof window === "undefined") {
    return emptyProgress;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return emptyProgress;
    }

    return normalizeProgress({
      ...emptyProgress,
      ...(JSON.parse(stored) as Partial<LearningProgress>)
    });
  } catch {
    return emptyProgress;
  }
}

function applyActivityStreak(progress: LearningProgress) {
  const today = localDateKey();

  if (progress.lastActivityDate === today) {
    return {
      ...progress,
      lastActivityDate: today,
      streakCount: Math.max(progress.streakCount, 1)
    };
  }

  if (
    progress.lastActivityDate &&
    daysBetween(progress.lastActivityDate, today) === 1
  ) {
    return {
      ...progress,
      lastActivityDate: today,
      streakCount: progress.streakCount + 1
    };
  }

  return {
    ...progress,
    lastActivityDate: today,
    streakCount: 1
  };
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(readProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, ready]);

  const completedLessonCount = progress.completedLessons.length;
  const completedChallengeCount = progress.completedChallenges.length;
  const totalLearningItems = lessons.length + challenges.length;
  const completedLearningItems = completedLessonCount + completedChallengeCount;

  const lessonProgress = Math.round(
    (completedLessonCount / Math.max(lessons.length, 1)) * 100
  );

  const challengeProgress = Math.round(
    (completedChallengeCount / Math.max(challenges.length, 1)) * 100
  );

  const overallProgress = Math.round(
    (completedLearningItems / Math.max(totalLearningItems, 1)) * 100
  );

  const markLessonComplete = useCallback(async (slug: string) => {
    setProgress((current) =>
      applyActivityStreak({
        ...current,
        completedLessons: current.completedLessons.includes(slug)
          ? current.completedLessons
          : [...current.completedLessons, slug],
        lastOpenedLesson: slug
      })
    );
  }, []);

  const setLastOpenedLesson = useCallback((slug: string) => {
    setProgress((current) => {
      if (current.lastOpenedLesson === slug) {
        return current;
      }

      return {
        ...current,
        lastOpenedLesson: slug
      };
    });
  }, []);

  const markChallengeComplete = useCallback(async (id: string) => {
    setProgress((current) =>
      applyActivityStreak({
        ...current,
        completedChallenges: current.completedChallenges.includes(id)
          ? current.completedChallenges
          : [...current.completedChallenges, id]
      })
    );
  }, []);

  return useMemo(
    () => ({
      progress,
      ready,
      completedLessonCount,
      completedChallengeCount,
      lessonProgress,
      challengeProgress,
      overallProgress,
      markLessonComplete,
      setLastOpenedLesson,
      markChallengeComplete
    }),
    [
      challengeProgress,
      completedChallengeCount,
      completedLessonCount,
      lessonProgress,
      markChallengeComplete,
      markLessonComplete,
      overallProgress,
      progress,
      ready,
      setLastOpenedLesson
    ]
  );
}
