"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpenCheck,
  Flame,
  Play,
  Trophy
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LoadingLinkButton } from "@/components/loading-link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useAuth } from "@/hooks/use-auth";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { challenges, lessons, progressTopics } from "@/lib/data";

function topicProgress(
  topic: string,
  completedLessons: string[],
  completedChallenges: string[]
) {
  const lessonHits = lessons.filter(
    (lesson) => lesson.topic.includes(topic) && completedLessons.includes(lesson.slug)
  ).length;
  const challengeHits = challenges.filter(
    (challenge) =>
      challenge.topic.includes(topic) && completedChallenges.includes(challenge.id)
  ).length;

  return Math.min(100, Math.max(18, (lessonHits + challengeHits) * 28));
}

export function DashboardClient() {
  const router = useRouter();
  const { user, ready, isAuthenticated } = useAuth();
  const {
    progress,
    completedLessonCount,
    completedChallengeCount,
    lessonProgress,
    overallProgress
  } = useLearningProgress();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, ready, router]);

  if (!ready || !isAuthenticated) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-querix-paper px-4">
        <div className="rounded-lg border bg-white p-6 text-center shadow-soft">
          <LoadingSpinner className="mx-auto h-6 w-6 text-secondary" />
          <p className="mt-3 text-sm font-semibold text-primary">
            Menyiapkan dashboard...
          </p>
        </div>
      </main>
    );
  }

  const chartData = progressTopics.map((item) => ({
    topic: item.topic,
    progress: topicProgress(
      item.topic,
      progress.completedLessons,
      progress.completedChallenges
    )
  }));

  const continueLesson =
    lessons.find((lesson) => lesson.slug === progress.lastOpenedLesson) ??
    lessons[0];
  const recommended = challenges.slice(0, 3);

  return (
    <main className="bg-querix-paper py-10 lg:py-14">
      <div className="container space-y-8 lg:space-y-10">
        <section className="flex flex-col gap-5 rounded-lg border bg-white p-6 shadow-soft md:flex-row md:items-center md:justify-between lg:p-8">
          <div>
            <p className="text-sm font-semibold text-secondary lg:text-base">
              Halo, {user?.name}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-primary lg:text-5xl">
              Dashboard Belajar
            </h1>
            <p className="mt-2 text-muted-foreground lg:text-lg">Beginner SQL Learner</p>
          </div>
          <LoadingLinkButton
            href={`/learn/${continueLesson.slug}`}
            size="lg"
            loadingText="Memuat materi..."
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Lanjut Belajar
          </LoadingLinkButton>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <KpiCard
            icon={BookOpenCheck}
            label="Materi selesai"
            value={`${completedLessonCount} / ${lessons.length} materi`}
            tone="indigo"
          />
          <KpiCard
            icon={Trophy}
            label="Tantangan selesai"
            value={`${completedChallengeCount} / ${challenges.length} tantangan`}
            tone="yellow"
          />
          <KpiCard
            icon={BarChart3}
            label="Progress belajar"
            value={`${overallProgress}%`}
            tone="blue"
          />
          <KpiCard
            icon={Flame}
            label="Streak latihan"
            value={`${progress.streakCount} hari`}
            tone="green"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Lanjutkan: {continueLesson.title}</CardTitle>
              <CardDescription>
                Ambil lagi ritme belajar dari materi terakhir yang kamu buka.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border bg-blue-50/45 p-4 lg:p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground lg:text-base">
                      Progress materi
                    </p>
                    <p className="mt-1 text-3xl font-bold text-primary lg:text-4xl">
                      {lessonProgress}%
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground lg:text-base">
                    {completedLessonCount} materi selesai
                  </p>
                </div>
                <Progress value={lessonProgress} className="mt-4" />
              </div>
              <LoadingLinkButton
                href={`/learn/${continueLesson.slug}`}
                className="w-full"
                loadingText="Memuat materi..."
              >
                Lanjut Belajar
              </LoadingLinkButton>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress per Topik</CardTitle>
              <CardDescription>
                Gambaran topik yang sudah kamu sentuh dari materi dan tantangan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] lg:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="topic" tickLine={false} axisLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
                      formatter={(value) => [`${value}%`, "Progress"]}
                    />
                    <Bar dataKey="progress" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-3 lg:mb-6">
            <Award className="h-5 w-5 text-secondary lg:h-6 lg:w-6" aria-hidden="true" />
            <h2 className="text-2xl font-bold tracking-normal text-primary lg:text-3xl">
              Tantangan pemula yang direkomendasikan
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {recommended.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                completed={progress.completedChallenges.includes(challenge.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
