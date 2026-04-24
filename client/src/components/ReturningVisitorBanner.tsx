import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import type { VisitorProfile } from "../hooks/useVisitorProfile";

interface ReturningVisitorBannerProps {
  profile: VisitorProfile;
}

export function ReturningVisitorBanner({ profile }: ReturningVisitorBannerProps) {
  const { t, lang } = useLanguage();
  const [, navigate] = useLocation();
  const [dismissed, setDismissed] = useState(false);

  if (!profile.isReturning || dismissed) return null;

  const lastRoom = profile.viewedRooms[0];
  const daysSince = Math.floor((Date.now() - profile.lastVisit) / (1000 * 60 * 60 * 24));

  const greeting =
    daysSince === 0
      ? t("returning.welcome")
      : daysSince === 1
      ? (lang === "en" ? "Welcome back after 1 day! 👋" : "Chào mừng bạn quay lại sau 1 ngày! 👋")
      : (lang === "en" ? `Welcome back after ${daysSince} days! 👋` : `Chào mừng bạn quay lại sau ${daysSince} ngày! 👋`);

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-24 md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-base">
              🏨
            </div>
            <span className="text-white font-semibold text-sm">{greeting}</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/70 hover:text-white text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <p className="text-gray-600 text-sm mb-3">
            {t("returning.best_price_kept")}{" "}
            <span className="text-orange-500 font-semibold">{t("returning.best_price")}</span>{" "}
            {t("returning.for_you")}
          </p>

          {lastRoom ? (
            <div
              className="flex items-center gap-3 bg-orange-50 rounded-xl p-3 cursor-pointer hover:bg-orange-100 transition-colors mb-3"
              onClick={() => {
                setDismissed(true);
                navigate(`/room/${lastRoom.id}`);
              }}
            >
              <img
                src={lastRoom.image}
                alt={lastRoom.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&h=100&fit=crop";
                }}
              />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{t("returning.room_viewed")}</p>
                <p className="font-semibold text-gray-900 text-sm truncate">{lastRoom.name}</p>
                <p className="text-orange-500 text-xs font-medium">
                  {lastRoom.price.toLocaleString("vi-VN")} VND/{lang === "en" ? "night" : "đêm"} →
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setDismissed(true);
                navigate("/rooms");
              }}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              {t("returning.view_rooms")}
            </button>
            <button
              onClick={() => {
                setDismissed(true);
                navigate("/offers");
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              {t("returning.new_offers")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
