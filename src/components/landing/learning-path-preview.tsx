import { Check } from "lucide-react";
import { learningPath } from "@/lib/data";

export function LearningPathPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-4">
      {learningPath.map((item, index) => (
        <div
          key={item}
          className="rounded-lg border bg-white p-4 shadow-soft lg:min-h-[148px] lg:p-5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground lg:h-9 lg:w-9 lg:text-base">
            {index + 1}
          </div>
          <p className="mt-4 font-semibold lg:text-lg">{item}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground lg:text-sm">
            <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            Terstruktur
          </div>
        </div>
      ))}
    </div>
  );
}
