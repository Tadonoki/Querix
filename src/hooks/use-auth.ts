"use client";

import { useCallback, useMemo } from "react";
import { authClient } from "@/lib/auth-client";

type AuthSession = ReturnType<typeof authClient.useSession>["data"];
export type AuthUser = NonNullable<AuthSession>["user"];

function authErrorMessage(message: string | undefined, fallback: string) {
  if (!message) {
    return fallback;
  }

  if (
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("password") ||
    message.toLowerCase().includes("credential")
  ) {
    return "Password minimal 8 karakter";
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
          ),
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
          authErrorMessage(response.error.message, "Pendaftaran gagal.")
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
