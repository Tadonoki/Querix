import { notFound } from "next/navigation";
import { LessonDetailClient } from "@/components/learn/lesson-detail-client";
import { getLessonBySlug, lessons } from "@/lib/data";

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    slug: lesson.slug
  }));
}

export default async function LessonDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  return <LessonDetailClient lesson={lesson} />;
}
