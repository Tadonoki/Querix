import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({
  icon: Icon,
  label,
  value,
  tone = "blue"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "blue" | "yellow" | "green" | "indigo";
}) {
  const toneClass = {
    blue: "bg-blue-50 text-secondary",
    yellow: "bg-yellow-50 text-yellow-700",
    green: "bg-green-50 text-green-700",
    indigo: "bg-violet-50 text-primary"
  }[tone];

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5 lg:gap-5 lg:p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-md lg:h-14 lg:w-14 ${toneClass}`}>
          <Icon className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground lg:text-base">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground lg:text-3xl">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
