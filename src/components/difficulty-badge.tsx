import { Badge } from "@/components/ui/badge";
import { Difficulty } from "@/lib/data";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant={difficulty === "Mudah" ? "success" : "warning"}>
      {difficulty}
    </Badge>
  );
}
