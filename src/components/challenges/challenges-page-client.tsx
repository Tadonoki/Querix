"use client";

import { Target } from "lucide-react";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { challenges } from "@/lib/data";

export function ChallengesPageClient() {
  const { progress } = useLearningProgress();

  return (
    <main className="bg-querix-paper py-10 lg:py-14">
      <div className="container space-y-8 lg:space-y-10">
        <section className="max-w-4xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground lg:h-14 lg:w-14">
            <Target className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-primary sm:text-4xl lg:text-5xl">
            Tantangan SQL
          </h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground lg:mt-4 lg:max-w-3xl lg:text-xl lg:leading-9">
            Latihan dibuat dari skenario kerja sederhana agar kamu terbiasa
            membaca kebutuhan bisnis lalu mengubahnya menjadi query.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              completed={progress.completedChallenges.includes(challenge.id)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
