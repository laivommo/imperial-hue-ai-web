import { getLoginUrl } from "@/const";
import { useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

type AuthUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

type UseAuthResult = {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  refresh: () => void;
  logout: () => Promise<void>;
};

// Since we removed Manus OAuth, we'll return a mock unauthenticated state for now
// so that the rest of the application (which might still be checking useAuth)
// doesn't crash. Admin areas are protected by AdminGuard and their own password check.
export function useAuth(options?: UseAuthOptions): UseAuthResult {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};

  const state = useMemo<Pick<UseAuthResult, "user" | "loading" | "error" | "isAuthenticated">>(() => {
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    };
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
  ]);

  return {
    ...state,
    refresh: () => {},
    logout: async () => {},
  };
}
