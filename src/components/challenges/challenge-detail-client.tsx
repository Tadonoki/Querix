"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Play,
  RotateCcw,
  Send
} from "lucide-react";
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
import { DifficultyBadge } from "@/components/difficulty-badge";
import { FeedbackAlert } from "@/components/feedback-alert";
import { ResultTable } from "@/components/result-table";
import { SchemaExplorer } from "@/components/schema-explorer";
import { SqlEditor } from "@/components/sql-editor";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import {
  Challenge,
  getChallengePath,
  getNextChallenge,
  getRelatedLessonForChallenge
} from "@/lib/data";
import {
  getExpectedResultForChallenge,
  QueryResult,
  ValidationResult,
  runMockQuery,
  validateChallenge
} from "@/lib/mock-sql";

type LoadingAction = "run" | "submit" | null;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function runQuery(query: string, challengeId: string) {
  void challengeId;
  return runMockQuery(query);
}

function localDateKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function submitAnswer(query: string, challenge: Challenge) {
  const res = await fetch("/api/progress/challenges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      challengeId: challenge.id,
      query,
      today: localDateKey()
    })
  });

  if (!res.ok) {
    throw new Error("Gagal mengirim jawaban.");
  }

  return await res.json();
}

export function ChallengeDetailClient({ challenge }: { challenge: Challenge }) {
  const [query, setQuery] = useState(challenge.starterQuery);
  const [result, setResult] = useState<QueryResult>(() =>
    runMockQuery(challenge.starterQuery)
  );
  const [feedback, setFeedback] = useState<ValidationResult | null>(null);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const { progress, markChallengeComplete, setProgressAndNotify } = useLearningProgress();

  const completed = progress.completedChallenges.includes(challenge.id);
  const expectedResult = useMemo(
    () => getExpectedResultForChallenge(challenge),
    [challenge]
  );
  const nextChallenge = useMemo(
    () => getNextChallenge(challenge.id),
    [challenge.id]
  );
  const relatedLesson = useMemo(
    () => getRelatedLessonForChallenge(challenge),
    [challenge]
  );

  async function handleRun() {
    setLoadingAction("run");
    try {
      const [nextResult] = await Promise.all([
        runQuery(query, challenge.id),
        wait(650)
      ]);

      setResult(nextResult);
      setFeedback(null);
    } catch {
      const validation = validateChallenge(query, challenge);
      setResult(
        validation.status === "success" ? expectedResult : runMockQuery(query)
      );
      setFeedback(null);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleSubmit() {
    setLoadingAction("submit");
    try {
      const [payload] = await Promise.all([
        submitAnswer(query, challenge),
        wait(750)
      ]);

      setFeedback(payload.feedback);
      setResult(payload.result);

      if (payload.feedback.status === "success" && payload.progress) {
        setProgressAndNotify(payload.progress);
      }
    } catch {
      const validation = validateChallenge(query, challenge);
      setFeedback(validation);

      if (validation.status === "success") {
        setResult(expectedResult);
        await markChallengeComplete(challenge.id);
      } else {
        setResult(runMockQuery(query));
      }
    } finally {
      setLoadingAction(null);
    }
  }

  function handleReset() {
    setQuery(challenge.starterQuery);
    setResult(runMockQuery(challenge.starterQuery));
    setFeedback(null);
  }

  return (
    <main className="max-lg:max-w-full max-lg:overflow-x-hidden bg-querix-paper py-10 lg:py-14">
      <div className="container space-y-6 max-lg:w-full max-lg:max-w-full max-lg:min-w-0 lg:space-y-8">
        <Button asChild variant="ghost" className="px-0">
          <Link href="/challenges">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke Tantangan
          </Link>
        </Button>

        <div className="grid gap-6 max-lg:w-full max-lg:max-w-full max-lg:min-w-0 xl:grid-cols-[0.42fr_0.58fr] xl:gap-8">
          <section className="space-y-5 max-lg:min-w-0 max-lg:max-w-full lg:space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-soft max-lg:w-full max-lg:max-w-full max-lg:min-w-0 lg:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <DifficultyBadge difficulty={challenge.difficulty} />
                <Badge variant="outline" className="max-lg:max-w-full max-lg:break-words">
                  {challenge.topic}
                </Badge>
                {completed ? (
                  <Badge variant="success" className="gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Selesai
                  </Badge>
                ) : null}
              </div>
              <h1 className="text-3xl font-bold tracking-normal text-primary max-lg:break-words lg:text-5xl">
                {challenge.title}
              </h1>
              <p className="mt-4 text-base leading-8 text-muted-foreground max-lg:break-words lg:text-lg lg:leading-9">
                {challenge.story}
              </p>
            </div>

            <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
              <CardHeader>
                <CardTitle>Tugas</CardTitle>
                <CardDescription className="max-lg:break-words">
                  {challenge.task}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="rounded-lg border bg-yellow-50 p-4 text-sm leading-6 text-yellow-900 max-lg:break-words lg:p-5 lg:text-base lg:leading-7">
                  {challenge.expectedInfo}
                </p>
              </CardContent>
            </Card>

            <SchemaExplorer highlightTable={challenge.table} />

            <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-warning" aria-hidden="true" />
                  Petunjuk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm leading-6 text-muted-foreground lg:text-base lg:leading-7">
                  {challenge.hints.map((hint) => (
                    <li key={hint} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-warning" />
                      <span className="max-lg:min-w-0 max-lg:break-words">{hint}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-5 max-lg:min-w-0 max-lg:max-w-full lg:space-y-6">
            <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
              <CardHeader>
                <CardTitle>Editor SQL</CardTitle>
                <CardDescription className="max-lg:break-words">
                  Jalankan query untuk melihat hasil mock, lalu submit jawaban
                  untuk mendapat feedback.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-lg:min-w-0">
                <SqlEditor value={query} onChange={setQuery} height="390px" />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={handleRun}
                    variant="secondary"
                    disabled={loadingAction !== null}
                  >
                    {loadingAction === "run" ? (
                      <LoadingSpinner />
                    ) : (
                      <Play className="h-4 w-4" aria-hidden="true" />
                    )}
                    {loadingAction === "run"
                      ? "Menjalankan query..."
                      : "Jalankan Query"}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loadingAction !== null}
                  >
                    {loadingAction === "submit" ? (
                      <LoadingSpinner />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                    {loadingAction === "submit"
                      ? "Memeriksa jawaban..."
                      : "Submit Jawaban"}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={loadingAction !== null}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {feedback ? <FeedbackAlert feedback={feedback} /> : null}

            {feedback?.status === "error" ? (
              <Card className="border-amber-200 bg-amber-50 max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-amber-900">
                    <Lightbulb className="h-5 w-5" aria-hidden="true" />
                    Petunjuk cepat
                  </CardTitle>
                  <CardDescription className="text-amber-900/80 max-lg:break-words">
                    Tenang, ini masih latihan. Cek bagian yang diminta lalu coba
                    jalankan lagi.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm leading-6 text-amber-900">
                    {challenge.hints.slice(0, 2).map((hint) => (
                      <li key={hint}>- {hint}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            {feedback?.status === "success" ? (
              <Card className="border-green-200 bg-green-50 max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-green-800">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    Jawaban benar
                  </CardTitle>
                  <CardDescription className="text-green-800/80 max-lg:break-words">
                    Progres tantangan sudah disimpan. Kamu bisa lanjut latihan
                    atau kembali melihat daftar tantangan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 max-lg:min-w-0 sm:grid-cols-3">
                  {nextChallenge ? (
                    <LoadingLinkButton
                      href={getChallengePath(nextChallenge)}
                      loadingText="Memuat tantangan..."
                      className="sm:w-full"
                      requireAuth
                    >
                      Tantangan Berikutnya
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </LoadingLinkButton>
                  ) : (
                    <Button disabled>Tantangan Berikutnya</Button>
                  )}
                  <LoadingLinkButton
                    href="/challenges"
                    variant="outline"
                    loadingText="Memuat daftar..."
                    className="sm:w-full"
                  >
                    Kembali Daftar Tantangan
                  </LoadingLinkButton>
                  {relatedLesson ? (
                    <LoadingLinkButton
                      href={`/learn/${relatedLesson.slug}`}
                      variant="secondary"
                      loadingText="Memuat materi..."
                      className="sm:w-full"
                      requireAuth
                    >
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                      Pelajari Materi Terkait
                    </LoadingLinkButton>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
              <CardHeader>
                <CardTitle>Hasil Query</CardTitle>
                <CardDescription className="max-lg:break-words">
                  {loadingAction === "run"
                    ? "Menjalankan query..."
                    : loadingAction === "submit"
                      ? "Memeriksa jawaban..."
                      : result.message}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-lg:min-w-0">
                {loadingAction ? (
                  <div className="flex min-h-[160px] items-center justify-center rounded-lg border bg-white text-sm font-semibold text-primary max-lg:max-w-full lg:min-h-[190px] lg:text-base">
                    <LoadingSpinner className="mr-2 text-secondary" />
                    {loadingAction === "run"
                      ? "Menjalankan query..."
                      : "Memeriksa jawaban..."}
                  </div>
                ) : (
                  <ResultTable columns={result.columns} rows={result.rows} />
                )}
              </CardContent>
            </Card>

            <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
              <CardHeader>
                <CardTitle>Expected Result</CardTitle>
                <CardDescription className="max-lg:break-words">
                  Contoh hasil yang perlu kamu kejar dari tantangan ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="max-lg:min-w-0">
                <ResultTable
                  columns={expectedResult.columns}
                  rows={expectedResult.rows}
                />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
