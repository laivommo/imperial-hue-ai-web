import { useEffect, useRef, useState } from "react";

interface UseExitIntentOptions {
  /** Delay in ms before the hook becomes active (default: 3000ms) */
  delayMs?: number;
  /** Session storage key to track if popup was already shown */
  storageKey?: string;
}

/**
 * Detects when the user is about to leave the page:
 * - Mouse moves above the viewport top edge (desktop)
 * - Page visibility changes to hidden (mobile tab switch)
 * - Back button navigation (popstate)
 *
 * Only fires once per session (controlled by sessionStorage).
 */
export function useExitIntent(options: UseExitIntentOptions = {}) {
  const { delayMs = 3000, storageKey = "exit_intent_shown" } = options;
  const [triggered, setTriggered] = useState(false);
  const isActive = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't show if already shown this session
    if (sessionStorage.getItem(storageKey)) return;

    // Activate after delay (user has been on page long enough)
    timer.current = setTimeout(() => {
      isActive.current = true;
    }, delayMs);

    const handleMouseLeave = (e: MouseEvent) => {
      if (!isActive.current) return;
      // Trigger when mouse moves above the top of the viewport
      if (e.clientY <= 0) {
        fire();
      }
    };

    const handleVisibilityChange = () => {
      if (!isActive.current) return;
      if (document.visibilityState === "hidden") {
        fire();
      }
    };

    const fire = () => {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
      setTriggered(true);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [delayMs, storageKey]);

  const reset = () => {
    sessionStorage.removeItem(storageKey);
    setTriggered(false);
  };

  return { triggered, reset };
}
