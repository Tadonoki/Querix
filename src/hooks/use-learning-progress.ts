"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { challenges, lessons } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";

export type LearningProgress = {
  completedLessons: string[];
  completedChallenges: string[];
  lastOpenedLesson: string;
  lastActivityDate: string | null;
  streakCount: number;
};

const emptyProgress: LearningProgress = {
  completedLessons: [],
  completedChallenges: [],
  lastOpenedLesson: lessons[0]?.slug ?? "",
  lastActivityDate: null,
  streakCount: 0
};

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useLearningProgress() {
  const { isAuthenticated, ready: authReady } = useAuth();
  const [progress, setProgress] = useState<LearningProgress>(emptyProgress);
  const [ready, setReady] = useState(false);

  const setProgressAndNotify = useCallback((newProgress: LearningProgress) => {
    setProgress(newProgress);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<LearningProgress>("querix-progress-update", {
          detail: newProgress
        })
      );
    }
  }, []);

  // Sync state across hooks on progress changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleProgressUpdate(e: Event) {
      const customEvent = e as CustomEvent<LearningProgress>;
      if (customEvent.detail) {
        setProgress(customEvent.detail);
      }
    }

    window.addEventListener("querix-progress-update", handleProgressUpdate);
    return () => {
      window.removeEventListener("querix-progress-update", handleProgressUpdate);
    };
  }, []);

  // Fetch initial progress when auth status changes
  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!isAuthenticated) {
      setProgressAndNotify(emptyProgress);
      setReady(true);
      return;
    }

    let active = true;
    async function fetchProgress() {
      try {
        const res = await fetch("/api/progress");
        if (res.ok && active) {
          const data = await res.json();
          setProgressAndNotify(data.progress);
        }
      } catch (err) {
        console.error("Failed to fetch learning progress", err);
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    fetchProgress();
    return () => {
      active = false;
    };
  }, [isAuthenticated, authReady, setProgressAndNotify]);

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

  const markLessonComplete = useCallback(
    async (slug: string) => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const res = await fetch("/api/progress/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, today: localDateKey() })
        });
        if (res.ok) {
          const data = await res.json();
          setProgressAndNotify(data.progress);
        }
      } catch (err) {
        console.error("Failed to mark lesson complete", err);
      }
    },
    [isAuthenticated, setProgressAndNotify]
  );

  const setLastOpenedLesson = useCallback(
    async (slug: string) => {
      if (!isAuthenticated) {
        return;
      }

      // Optimistic local update
      setProgress((current) => {
        if (current.lastOpenedLesson === slug) {
          return current;
        }
        const updated = { ...current, lastOpenedLesson: slug };
        return updated;
      });

      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lastOpenedLesson: slug })
        });
      } catch (err) {
        console.error("Failed to update last opened lesson", err);
      }
    },
    [isAuthenticated]
  );

  const markChallengeComplete = useCallback(
    async (id: string) => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const res = await fetch("/api/progress/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            challengeId: id,
            onlyMarkComplete: true,
            today: localDateKey()
          })
        });
        if (res.ok) {
          const data = await res.json();
          setProgressAndNotify(data.progress);
        }
      } catch (err) {
        console.error("Failed to mark challenge complete", err);
      }
    },
    [isAuthenticated, setProgressAndNotify]
  );

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
      markChallengeComplete,
      setProgressAndNotify // Expose this so submissions can update progress directly
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
      setLastOpenedLesson,
      setProgressAndNotify
    ]
  );
}
