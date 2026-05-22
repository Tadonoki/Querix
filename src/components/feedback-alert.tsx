import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { ValidationResult } from "@/lib/mock-sql";

export function FeedbackAlert({ feedback }: { feedback: ValidationResult }) {
  const success = feedback.status === "success";

  return (
    <Alert variant={success ? "success" : "destructive"}>
      <div className="flex gap-3">
        {success ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        ) : (
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        )}
        <div>
          <AlertTitle>{feedback.title}</AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
