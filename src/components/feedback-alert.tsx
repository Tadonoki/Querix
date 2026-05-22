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
    <Alert variant={success ? "success" : "destructive"} className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
      <div className="flex gap-3 max-lg:min-w-0">
        {success ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        ) : (
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        )}
        <div className="max-lg:min-w-0">
          <AlertTitle className="max-lg:break-words">{feedback.title}</AlertTitle>
          <AlertDescription className="max-lg:break-words">
            {feedback.message}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
