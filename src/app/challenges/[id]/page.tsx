import { notFound } from "next/navigation";
import { ChallengeDetailClient } from "@/components/challenges/challenge-detail-client";
import { challenges, getChallengeById } from "@/lib/data";

export function generateStaticParams() {
  return challenges.map((challenge) => ({
    id: challenge.slug
  }));
}

export default async function ChallengeDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  return <ChallengeDetailClient challenge={challenge} />;
}
