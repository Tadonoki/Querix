"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, DatabaseZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";

type AuthMode = "login" | "signup";
type LoadingAction = "email" | null;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function safeRedirect(rawRedirect: string | null) {
  if (
    !rawRedirect ||
    !rawRedirect.startsWith("/") ||
    rawRedirect.startsWith("//")
  ) {
    return "/dashboard";
  }

  return rawRedirect;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = safeRedirect(
    searchParams.get("redirect") ?? searchParams.get("next")
  );
  const { ready, isAuthenticated, login, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const isLogin = mode === "login";
  const authSwitchHref = `${isLogin ? "/signup" : "/login"}?redirect=${encodeURIComponent(
    redirectTarget
  )}`;

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, ready, redirectTarget, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingAction("email");
    setError(null);

    try {
      await wait(350);

      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }

      router.push(redirectTarget);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Proses auth gagal. Coba lagi sebentar."
      );
      setLoadingAction(null);
    }
  }

  return (
    <main className="bg-querix-paper py-10 lg:py-14">
      <div className="container grid min-h-[calc(100vh-10rem)] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <section className="max-w-2xl">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground lg:h-14 lg:w-14">
            <DatabaseZap className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary lg:text-base">
            Akses Querix
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-primary sm:text-4xl lg:text-5xl">
            {isLogin ? "Masuk ke akun Querix" : "Buat akun Querix"}
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground lg:text-xl lg:leading-9">
            {isLogin
              ? "Lanjutkan belajar SQL dengan progress yang tersimpan di akun kamu."
              : "Mulai belajar SQL dari nol dengan pengalaman yang sederhana dan ramah pemula."}
          </p>
        </section>

        <Card className="mx-auto w-full max-w-md lg:max-w-lg">
          <CardHeader>
            <CardTitle>{isLogin ? "Masuk" : "Daftar Gratis"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Gunakan email dan password untuk membuka dashboard belajar."
                : "Buat akun untuk menyimpan progress belajar."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin ? (
                <div className="space-y-2">
                  <label
                    className="text-sm font-semibold text-foreground lg:text-base"
                    htmlFor="name"
                  >
                    Nama
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nama kamu"
                    disabled={loadingAction !== null}
                    required
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-foreground lg:text-base"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@email.com"
                  disabled={loadingAction !== null}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-foreground lg:text-base"
                  htmlFor="password"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  disabled={loadingAction !== null}
                  required
                />
              </div>

              <Button
                className="w-full"
                type="submit"
                disabled={loadingAction !== null}
              >
                {loadingAction === "email" ? <LoadingSpinner /> : null}
                {loadingAction === "email"
                  ? isLogin
                    ? "Memproses login..."
                    : "Memproses pendaftaran..."
                  : isLogin
                    ? "Masuk"
                    : "Daftar"}
                {loadingAction !== "email" ? (
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                ) : null}
              </Button>
            </form>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800 lg:text-base lg:leading-7">
                {error}
              </p>
            ) : null}

            <p className="text-center text-sm text-muted-foreground lg:text-base">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <Link
                href={authSwitchHref}
                className="font-semibold text-secondary hover:underline"
              >
                {isLogin ? "Daftar gratis" : "Masuk"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
