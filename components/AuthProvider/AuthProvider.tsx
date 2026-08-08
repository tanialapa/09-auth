"use client";

import { useEffect, type ReactNode } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    let isActive = true;

    async function verifySession() {
      try {
        const isSessionValid = await checkSession();

        if (!isSessionValid) {
          if (isActive) clearIsAuthenticated();
          return;
        }

        const user = await getMe();
        if (isActive) setUser(user);
      } catch {
        if (isActive) clearIsAuthenticated();
      }
    }

    void verifySession();

    return () => {
      isActive = false;
    };
  }, [clearIsAuthenticated, setUser]);

  return children;
}
