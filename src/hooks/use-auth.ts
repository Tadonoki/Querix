"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AUTH_EVENT,
  LocalAuthUser,
  createLocalEmailUser,
  readLocalAuthUser,
  saveLocalAuthUser
} from "@/lib/local-auth";

export type MockUser = LocalAuthUser;

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      setUser(readLocalAuthUser());
      setReady(true);
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener(AUTH_EVENT, syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(AUTH_EVENT, syncUser);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    void password;

    const nextUser = createLocalEmailUser({ email });
    saveLocalAuthUser(nextUser);
    return nextUser;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      void password;

      const nextUser = createLocalEmailUser({ email, name });
      saveLocalAuthUser(nextUser);
      return nextUser;
    },
    []
  );

  const logout = useCallback(async () => {
    saveLocalAuthUser(null);
  }, []);

  return useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout
    }),
    [login, logout, ready, signup, user]
  );
}
