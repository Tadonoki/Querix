import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProgressCard({
  title,
  value,
  detail
}: {
  title: string;
  value: number;
  detail: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-bold text-primary">{value}%</p>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
        <Progress value={value} className="mt-4" />
      </CardContent>
    </Card>
  );
}
