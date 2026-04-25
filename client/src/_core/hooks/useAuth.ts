import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// Since we removed Manus OAuth, we'll return a mock unauthenticated state for now
// so that the rest of the application (which might still be checking useAuth)
// doesn't crash. Admin areas are protected by AdminGuard and their own password check.
export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};

  const state = useMemo(() => {
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

    window.location.href = redirectPath
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
