"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LoadingLinkButton } from "@/components/loading-link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResultTable } from "@/components/result-table";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import {
  getChallengePath,
  getNextLesson,
  getRelatedChallengeForLesson,
  Lesson
} from "@/lib/data";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function LessonDetailClient({ lesson }: { lesson: Lesson }) {
  const [marking, setMarking] = useState(false);
  const { progress, markLessonComplete, setLastOpenedLesson } =
    useLearningProgress();
  const completed = progress.completedLessons.includes(lesson.slug);
  const nextLesson = useMemo(() => getNextLesson(lesson.slug), [lesson.slug]);
  const relatedChallenge = useMemo(
    () => getRelatedChallengeForLesson(lesson),
    [lesson]
  );

  useEffect(() => {
    setLastOpenedLesson(lesson.slug);
  }, [lesson.slug, setLastOpenedLesson]);

  async function handleMarkComplete() {
    setMarking(true);
    try {
      await wait(650);
      await markLessonComplete(lesson.slug);
    } finally {
      setMarking(false);
    }
  }

  return (
    <main className="max-lg:max-w-full max-lg:overflow-x-hidden bg-querix-paper py-10 lg:py-14">
      <div className="container grid gap-6 max-lg:w-full max-lg:max-w-full max-lg:min-w-0 lg:grid-cols-[0.72fr_0.28fr] lg:gap-8">
        <section className="space-y-6 max-lg:min-w-0 max-lg:max-w-full lg:space-y-8">
          <Button asChild variant="ghost" className="px-0">
            <Link href="/learn">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke Materi
            </Link>
          </Button>

          <div className="rounded-lg border bg-white p-6 shadow-soft max-lg:w-full max-lg:max-w-full max-lg:min-w-0 lg:p-8">
            <div className="mb-4 flex flex-wrap gap-2">
              <DifficultyBadge difficulty={lesson.difficulty} />
              <Badge variant="outline" className="max-lg:max-w-full max-lg:break-words">
                {lesson.topic}
              </Badge>
              {completed ? <Badge variant="success">Selesai</Badge> : null}
            </div>
            <h1 className="text-3xl font-bold tracking-normal text-primary max-lg:break-words sm:text-4xl lg:text-5xl">
              {lesson.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-lg:break-words lg:text-xl lg:leading-9">
              {lesson.concept}
            </p>
          </div>

          <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
            <CardHeader>
              <CardTitle>Penjelasan Pemula</CardTitle>
              <CardDescription className="max-lg:break-words">
                {lesson.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-8 text-foreground max-lg:break-words lg:text-lg lg:leading-9">
                {lesson.beginnerExplanation}
              </p>
            </CardContent>
          </Card>

          <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
            <CardHeader>
              <CardTitle>Pola Dasar</CardTitle>
            </CardHeader>
            <CardContent className="max-lg:min-w-0">
              <pre className="overflow-x-auto rounded-lg bg-slate-950 p-5 text-sm leading-7 text-slate-100 max-lg:max-w-full max-lg:overscroll-x-contain lg:p-6 lg:text-base lg:leading-8">
                <code>{lesson.syntax}</code>
              </pre>
            </CardContent>
          </Card>

          <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
            <CardHeader>
              <CardTitle>Contoh Query</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-lg:min-w-0">
              <pre className="overflow-x-auto rounded-lg bg-slate-950 p-5 text-sm leading-7 text-slate-100 max-lg:max-w-full max-lg:overscroll-x-contain lg:p-6 lg:text-base lg:leading-8">
                <code>{lesson.example}</code>
              </pre>
              <ResultTable
                columns={lesson.exampleColumns}
                rows={lesson.exampleRows}
              />
            </CardContent>
          </Card>

          <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
            <CardHeader>
              <CardTitle>Kesalahan yang Sering Terjadi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground lg:text-base lg:leading-7">
                {lesson.commonMistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-warning" />
                    <span className="max-lg:min-w-0 max-lg:break-words">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4 max-lg:min-w-0 max-lg:max-w-full lg:sticky lg:top-28 lg:self-start">
          <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
            <CardHeader>
              <CardTitle className="text-base">Langkah Berikutnya</CardTitle>
              <CardDescription className="max-lg:break-words">
                Tandai materi selesai atau lanjut ke latihan SQL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant={completed ? "outline" : "default"}
                onClick={handleMarkComplete}
                disabled={marking}
              >
                {marking ? (
                  <LoadingSpinner />
                ) : (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                )}
                {marking
                  ? "Menyimpan progres..."
                  : completed
                    ? "Sudah Selesai"
                    : "Tandai Selesai"}
              </Button>
              {relatedChallenge ? (
                <LoadingLinkButton
                  href={getChallengePath(relatedChallenge)}
                  variant="secondary"
                  className="w-full"
                  loadingText="Memuat latihan..."
                  requireAuth
                >
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  Latihan Sekarang
                </LoadingLinkButton>
              ) : null}
            </CardContent>
          </Card>

          {completed ? (
            <Card className="border-green-200 bg-green-50 max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-green-800">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  Materi selesai
                </CardTitle>
                <CardDescription className="text-green-800/80 max-lg:break-words">
                  Bagus, kamu sudah menyimpan progres materi ini. Lanjutkan
                  saat ritmenya masih enak.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {nextLesson ? (
                  <LoadingLinkButton
                    href={`/learn/${nextLesson.slug}`}
                    className="w-full"
                    loadingText="Memuat materi..."
                    requireAuth
                  >
                    Lanjut ke Materi Berikutnya
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </LoadingLinkButton>
                ) : (
                  <LoadingLinkButton
                    href="/learn"
                    className="w-full"
                    loadingText="Memuat materi..."
                  >
                    Kembali ke Daftar Materi
                  </LoadingLinkButton>
                )}
                {relatedChallenge ? (
                  <LoadingLinkButton
                    href={getChallengePath(relatedChallenge)}
                    variant="secondary"
                    className="w-full"
                    loadingText="Memuat tantangan..."
                    requireAuth
                  >
                    Mulai Tantangan Terkait
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  </LoadingLinkButton>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
