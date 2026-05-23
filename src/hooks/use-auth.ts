"use client";

import { useCallback, useMemo } from "react";
import { authClient } from "@/lib/auth-client";

type AuthSession = ReturnType<typeof authClient.useSession>["data"];
export type AuthUser = NonNullable<AuthSession>["user"];

function authErrorMessage(
  message: string | undefined,
  fallback: string,
  isSignup = false
) {
  if (!message) {
    return fallback;
  }

  const lowerMessage = message.toLowerCase();

  if (isSignup) {
    if (
      lowerMessage.includes("invalid") ||
      lowerMessage.includes("password") ||
      lowerMessage.includes("credential")
    ) {
      return "Password minimal 8 karakter";
    }
  } else {
    // For login, mapping credentials or validation/invalid errors to "Email atau password salah."
    if (
      lowerMessage.includes("invalid") ||
      lowerMessage.includes("password") ||
      lowerMessage.includes("credential") ||
      lowerMessage.includes("user")
    ) {
      return "Email atau password salah.";
    }
  }

  return message;
}

export function useAuth() {
  const session = authClient.useSession();
  const user = session.data?.user ?? null;

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password
      });

      if (response.error) {
        throw new Error(
          authErrorMessage(
            response.error.message,
            "Email atau password salah.",
            false
          )
        );
      }

      await session.refetch();
      return response.data?.user ?? null;
    },
    [session]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (response.error) {
        throw new Error(
          authErrorMessage(response.error.message, "Pendaftaran gagal.", true)
        );
      }

      await session.refetch();
      return response.data?.user ?? null;
    },
    [session]
  );

  const logout = useCallback(async () => {
    await authClient.signOut();
    await session.refetch();
  }, [session]);

  return useMemo(
    () => ({
      user,
      ready: !session.isPending,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout
    }),
    [login, logout, session.isPending, signup, user]
  );
}
