import { ArrowRight, CheckCircle2 } from "lucide-react";
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
import { Challenge, getChallengePath } from "@/lib/data";

export function ChallengeCard({
  challenge,
  completed = false
}: {
  challenge: Challenge;
  completed?: boolean;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <Badge variant="outline">{challenge.topic}</Badge>
          {completed ? (
            <Badge variant="success" className="gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Selesai
            </Badge>
          ) : null}
        </div>
        <CardTitle className="leading-6 lg:leading-7">{challenge.title}</CardTitle>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-sm leading-6 text-muted-foreground lg:text-base lg:leading-7">
          {challenge.task}
        </p>
      </CardContent>
      <CardFooter>
        <LoadingLinkButton
          href={getChallengePath(challenge)}
          variant="outline"
          className="w-full"
          loadingText="Memuat tantangan..."
          requireAuth
        >
          Buka Tantangan
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </LoadingLinkButton>
      </CardFooter>
    </Card>
  );
}
