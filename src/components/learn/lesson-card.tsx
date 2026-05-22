import { ArrowRight, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { LoadingLinkButton } from "@/components/loading-link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Lesson } from "@/lib/data";

export type LessonStatus = "Belum mulai" | "Sedang dipelajari" | "Selesai";

function StatusBadge({ status }: { status: LessonStatus }) {
  const Icon =
    status === "Selesai" ? CheckCircle2 : status === "Sedang dipelajari" ? Clock3 : Circle;
  const variant =
    status === "Selesai"
      ? "success"
      : status === "Sedang dipelajari"
        ? "accent"
        : "muted";

  return (
    <Badge variant={variant} className="gap-1.5">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status}
    </Badge>
  );
}

export function LessonCard({
  lesson,
  status
}: {
  lesson: Lesson;
  status: LessonStatus;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={lesson.difficulty} />
          <StatusBadge status={status} />
        </div>
        <CardTitle className="leading-6 lg:leading-7">{lesson.shortTitle}</CardTitle>
        <CardDescription>{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-sm font-semibold text-secondary lg:text-base">{lesson.topic}</p>
      </CardContent>
      <CardFooter>
        <LoadingLinkButton
          href={`/learn/${lesson.slug}`}
          variant="outline"
          className="w-full"
          loadingText="Memuat materi..."
          requireAuth
        >
          Buka Materi
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </LoadingLinkButton>
      </CardFooter>
    </Card>
  );
}
