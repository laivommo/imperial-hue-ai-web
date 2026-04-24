import { useCallback, useEffect, useState } from "react";

export interface ViewedRoom {
  id: number;
  name: string;
  price: number;
  image: string;
  viewedAt: number; // timestamp ms
}

export interface VisitorProfile {
  visitCount: number;
  firstVisit: number; // timestamp ms
  lastVisit: number;  // timestamp ms
  viewedRooms: ViewedRoom[];
  /** True if this is NOT the first visit */
  isReturning: boolean;
}

const STORAGE_KEY = "imperial_visitor_profile";

const defaultProfile = (): VisitorProfile => ({
  visitCount: 0,
  firstVisit: Date.now(),
  lastVisit: Date.now(),
  viewedRooms: [],
  isReturning: false,
});

function loadProfile(): VisitorProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    return JSON.parse(raw) as VisitorProfile;
  } catch {
    return defaultProfile();
  }
}

function saveProfile(profile: VisitorProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage may be unavailable in private mode
  }
}

/**
 * Manages visitor profile in localStorage.
 * Tracks visit count, last visit time, and recently viewed rooms.
 */
export function useVisitorProfile() {
  const [profile, setProfile] = useState<VisitorProfile>(() => {
    const p = loadProfile();
    const isReturning = p.visitCount > 0;
    const updated: VisitorProfile = {
      ...p,
      visitCount: p.visitCount + 1,
      lastVisit: Date.now(),
      isReturning,
    };
    saveProfile(updated);
    return updated;
  });

  const trackRoomView = useCallback((room: Omit<ViewedRoom, "viewedAt">) => {
    setProfile(prev => {
      // Avoid duplicates — move to front if already exists
      const filtered = prev.viewedRooms.filter(r => r.id !== room.id);
      const updated: VisitorProfile = {
        ...prev,
        viewedRooms: [
          { ...room, viewedAt: Date.now() },
          ...filtered,
        ].slice(0, 5), // keep last 5
      };
      saveProfile(updated);
      return updated;
    });
  }, []);

  return { profile, trackRoomView };
}
