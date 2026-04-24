import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MapPin, BedDouble, Star, Users, ArrowRight, Calendar,
  ChevronRight, Search, SlidersHorizontal, Wifi, Coffee, Shield, Award
} from "lucide-react";
import type { Room } from "../../../drizzle/schema";
import SiteHeader from "@/components/SiteHeader";

// Header replaced by SiteHeader component

// ─── Room Card ─────────────────────────────────────────────────────────────────
function RoomCard({ room, onNavigate, showTooltip }: { room: Room; onNavigate: (id: number) => void; showTooltip?: boolean }) {
  const { t } = useLanguage();
  const sizeMap: Record<string, number> = {
    "Phòng Superior": 22, "Phòng Deluxe": 28, "Phòng Deluxe Balcony": 30,
    "Phòng Premier": 32, "Phòng Junior Suite": 40, "Phòng Imperial Suite": 55
  };
  const { lang } = useLanguage();
  const bedMap: Record<string, Record<string, string>> = {
    vi: { "Phòng Superior": "1 giường Queen", "Phòng Deluxe": "1 giường King", "Phòng Deluxe Balcony": "1 giường King", "Phòng Premier": "1 giường King", "Phòng Junior Suite": "1 giường King", "Phòng Imperial Suite": "1 giường King" },
    en: { "Phòng Superior": "1 Queen bed", "Phòng Deluxe": "1 King bed", "Phòng Deluxe Balcony": "1 King bed", "Phòng Premier": "1 King bed", "Phòng Junior Suite": "1 King bed", "Phòng Imperial Suite": "1 King bed" },
  };
  const size = sizeMap[room.name] || 25;
  const bed = (bedMap[lang] || bedMap.vi)[room.name] || (lang === "en" ? "1 King bed" : "1 giường King");

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group relative">
      {/* AI Tooltip */}
      {showTooltip && (
        <div className="absolute top-3 right-3 z-10 bg-white rounded-xl shadow-lg p-3 max-w-[200px] flex items-start gap-2">
          <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-gray-700 leading-snug">{t("rooms_page.ai_tooltip")}</p>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={room.image || `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop`}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop`;
          }}
        />
        {/* Viewers badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          {Math.floor(Math.random() * 8) + 2} {t("rooms_page.people_viewing")}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-800 text-base">{room.name}</h3>
          <span className="text-[#F97316] font-bold text-sm whitespace-nowrap">{room.price.toLocaleString("vi-VN")} VND {t("common.per_night")}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {room.capacity} {t("common.guests")}</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            {size} m²
          </span>
          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {bed}</span>
        </div>
        <button
          onClick={() => onNavigate(room.id)}
          className="flex items-center gap-1 text-[#F97316] hover:text-[#EA580C] font-semibold text-sm transition-colors group/link"
        >
          {t("rooms.view_detail")}
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ─── Footer Bar ────────────────────────────────────────────────────────────────
function FooterBar() {
  const { t } = useLanguage();
  const perks = [
    { icon: <Award className="w-6 h-6 text-[#F97316]" />, title: t("trust.best_price"), sub: t("trust.best_price_desc") },
    { icon: <svg className="w-6 h-6 text-[#F97316]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: t("trust.free_cancel"), sub: t("trust.free_cancel_desc") },
    { icon: <Coffee className="w-6 h-6 text-[#F97316]" />, title: t("trust.breakfast"), sub: t("trust.breakfast_desc") },
    { icon: <Wifi className="w-6 h-6 text-[#F97316]" />, title: t("trust.wifi"), sub: t("trust.wifi_desc") },
  ];
  return (
    <div className="bg-gray-50 border-t border-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {perks.map((p) => (
          <div key={p.title} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center shrink-0">{p.icon}</div>
            <div>
              <div className="font-semibold text-gray-800 text-sm">{p.title}</div>
              <div className="text-xs text-gray-500">{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile Bottom Nav ─────────────────────────────────────────────────────────
function MobileBottomNav() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const tabs = [
    { id: "home", label: "Home", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, action: () => navigate("/") },
    { id: "rooms", label: "Rooms", icon: <BedDouble className="w-5 h-5" />, action: () => navigate("/rooms") },
    { id: "offers", label: "Offers", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, action: () => {} },
    { id: "gallery", label: "Gallery", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>, action: () => {} },
    { id: "contact", label: "Contact", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, action: () => {} },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={tab.action}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${tab.id === "rooms" ? "text-[#F97316]" : "text-gray-400"}`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Main Rooms Page ────────────────────────────────────────────────────────────
export default function Rooms() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  const { data: rooms = [], isLoading } = trpc.rooms.list.useQuery();

  const filtered = rooms
    .filter((r) => {
      const matchName = r.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCapacity = capacityFilter ? r.capacity >= capacityFilter : true;
      return matchName && matchCapacity;
    })
    .sort((a, b) => {
      if (priceSort === "asc") return a.price - b.price;
      if (priceSort === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />
      {/* Page Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("rooms_page.title")}</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-md">
              {t("rooms_page.subtitle")}
            </p>
          </div>
          {/* Hue architecture decorative */}
          <div className="hidden md:block opacity-10">
            <svg viewBox="0 0 200 80" className="w-48 h-20 text-[#F97316]" fill="currentColor">
              <rect x="10" y="60" width="180" height="8" rx="2"/>
              <rect x="20" y="45" width="160" height="15" rx="2"/>
              <path d="M30 45 L100 10 L170 45"/>
              <rect x="60" y="25" width="80" height="20" rx="1"/>
              <rect x="80" y="15" width="40" height="10" rx="1"/>
              <rect x="90" y="8" width="20" height="7" rx="1"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-xs">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder={t("rooms_page.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder:text-gray-400"
            />
          </div>

          {/* Capacity filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 hidden sm:inline">{t("rooms_page.guests_label")}:</span>
            {[null, 2, 4].map((cap) => (
              <button
                key={String(cap)}
                onClick={() => setCapacityFilter(cap)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${capacityFilter === cap ? "bg-[#0D9488] text-white border-[#0D9488]" : "border-gray-200 text-gray-600 hover:border-[#0D9488] hover:text-[#0D9488]"}`}
              >
                {cap === null ? t("rooms_page.filter_all") : `${cap}+ ${t("common.guests")}`}
              </button>
            ))}
          </div>

          {/* Price sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-500 hidden sm:inline">{t("rooms_page.sort_label")}:</span>
            <button
              onClick={() => setPriceSort(priceSort === "asc" ? "desc" : priceSort === "desc" ? null : "asc")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${priceSort ? "bg-[#F97316] text-white border-[#F97316]" : "border-gray-200 text-gray-600 hover:border-[#F97316] hover:text-[#F97316]"}`}
            >
              {t("rooms_page.price")} {priceSort === "asc" ? "↑" : priceSort === "desc" ? "↓" : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BedDouble className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("rooms_page.no_rooms")}</h3>
            <p className="text-gray-400 text-sm">{t("rooms_page.try_other")}</p>
            <button
              onClick={() => { setSearchQuery(""); setCapacityFilter(null); setPriceSort(null); }}
              className="mt-4 text-[#0D9488] text-sm font-medium hover:underline"
            >
              {t("rooms_page.clear_filter")}
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} {t("rooms_page.rooms_found")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((room, idx) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onNavigate={(id) => navigate(`/room/${id}`)}
                  showTooltip={idx === 2}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <FooterBar />
      <MobileBottomNav />
    </div>
  );
}
