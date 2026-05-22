import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-querix-paper">
          <LoadingSpinner className="h-6 w-6 text-secondary" />
        </main>
      }
    >
      <AuthForm mode="signup" />
    </Suspense>
  );
}
