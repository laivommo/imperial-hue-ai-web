import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { MapPin, BedDouble, Star, Calendar, Users, Search, Sparkles, Building2, Bike, Heart, ChevronRight, ArrowRight, Wifi, Coffee, Shield, Award } from "lucide-react";
import type { Room } from "../../../drizzle/schema";
import SiteHeader from "@/components/SiteHeader";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { ReturningVisitorBanner } from "@/components/ReturningVisitorBanner";
import { useExitIntent } from "@/hooks/useExitIntent";
import { useVisitorProfile } from "@/hooks/useVisitorProfile";
import { useLanguage } from "@/contexts/LanguageContext";

// Header is now handled by SiteHeader component

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ onSearch }: { onSearch: (guests: number, checkIn: string, checkOut: string) => void }) {
  const { t } = useLanguage();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const handleSearch = () => {
    onSearch(guests, checkIn, checkOut);
    const el = document.getElementById("rooms-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
      {/* Hero background image */}
      <img
        src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&h=900&fit=crop&q=85"
        alt="The Imperial Hue Hotel Room"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Hero content */}
      <div className="relative h-full flex flex-col justify-end pb-0">
        {/* Search box - overlapping hero and content below */}
        <div className="mx-4 md:mx-auto md:max-w-4xl mb-0">
          <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-6">
            {/* AI prompt line */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#0D9488]" />
              </div>
              <span className="text-gray-700 font-medium text-sm md:text-base">{t("hero.chat_placeholder")}</span>
            </div>

            {/* Search fields */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:divide-x md:divide-gray-200">
              {/* Check-in */}
              <div className="flex-1 md:pr-4">
                <label className="block text-xs text-gray-400 mb-1 font-medium">{t("hero.checkin")}</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-sm text-gray-700 font-medium outline-none bg-transparent"
                    placeholder={t("hero.select_date")}
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="flex-1 md:px-4">
                <label className="block text-xs text-gray-400 mb-1 font-medium">{t("hero.checkout")}</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-sm text-gray-700 font-medium outline-none bg-transparent"
                    placeholder={t("hero.select_date")}
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="flex-1 md:pl-4 relative">
                <label className="block text-xs text-gray-400 mb-1 font-medium">{t("hero.guests")}</label>
                <button
                  onClick={() => setShowGuestPicker(!showGuestPicker)}
                  className="flex items-center gap-2 text-sm text-gray-700 font-medium w-full"
                >
                  <Users className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <span>{t("hero.guests_format").replace("{adults}", guests.toString()).replace("{rooms}", "1")}</span>
                  <ChevronRight className="w-3 h-3 ml-auto rotate-90" />
                </button>
                {showGuestPicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-10 w-48">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t("hero.guests")}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-lg font-medium">−</button>
                        <span className="w-6 text-center text-sm font-semibold">{guests}</span>
                        <button onClick={() => setGuests(Math.min(8, guests + 1))} className="w-7 h-7 rounded-full border border-[#0D9488] text-[#0D9488] flex items-center justify-center text-lg font-medium">+</button>
                      </div>
                    </div>
                    <button onClick={() => setShowGuestPicker(false)} className="mt-3 w-full bg-[#0D9488] text-white text-xs py-1.5 rounded-lg font-medium">{t("common.confirm")}</button>
                  </div>
                )}
              </div>

              {/* Search button */}
              <div className="md:pl-4 flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  {t("hero.search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero text overlay - positioned in middle-left */}
      <div className="absolute left-6 md:left-16 bottom-52 md:bottom-56 text-white">
        <div className="inline-block bg-[#0D9488] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider uppercase">
          {t("hero.welcome")}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-lg">The Imperial Hue</h1>
        <p className="text-base md:text-lg text-white/90 mb-4 drop-shadow">{t("hero.tagline")}</p>
        <div className="flex items-center gap-4 text-sm text-white/80">
          <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> Comfortable Rooms</span>
          <span className="text-white/50">|</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Prime Location</span>
          <span className="text-white/50">|</span>
          <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-[#F97316] text-[#F97316]" /> 3-Star Comfort</span>
        </div>
      </div>
    </section>
  );
}

// ─── Why Guests Love Us ────────────────────────────────────────────────────────
function WhyUsSection() {
  const { t } = useLanguage();
  const features = [
    { icon: <Building2 className="w-8 h-8 text-[#0D9488]" />, title: t("features.f1_title"), desc: t("features.f1_desc") },
    { icon: <BedDouble className="w-8 h-8 text-[#0D9488]" />, title: t("features.f2_title"), desc: t("features.f2_desc") },
    { icon: <Bike className="w-8 h-8 text-[#0D9488]" />, title: t("features.f3_title"), desc: t("features.f3_desc") },
    { icon: <Heart className="w-8 h-8 text-[#0D9488]" />, title: t("features.f4_title"), desc: t("features.f4_desc") },
  ];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">{t("features.title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-sm md:text-base">{f.title}</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Room Card ─────────────────────────────────────────────────────────────────
function RoomCard({ room, onNavigate, showTooltip, onTrackView, pricingSummary }: { room: Room; onNavigate: (id: number) => void; showTooltip?: boolean; onTrackView?: (room: Room) => void; pricingSummary?: { multiplier: number; isHighSeason: boolean; isDiscount: boolean } | null }) {
  const { t, lang } = useLanguage();
  const amenities: string[] = (() => { try { return JSON.parse(room.amenities || "[]"); } catch { return []; } })();
  const sizeMap: Record<string, number> = { "Phòng Superior": 22, "Phòng Deluxe": 28, "Phòng Deluxe Balcony": 30, "Phòng Premier": 32, "Phòng Junior Suite": 40, "Phòng Imperial Suite": 55 };
  const bedLabels: Record<string, Record<string, string>> = {
    vi: { "Phòng Superior": "1 giường Queen", "Phòng Deluxe": "1 giường King", "Phòng Deluxe Balcony": "1 giường King", "Phòng Premier": "1 giường King", "Phòng Junior Suite": "1 giường King", "Phòng Imperial Suite": "1 giường King" },
    en: { "Phòng Superior": "1 Queen bed", "Phòng Deluxe": "1 King bed", "Phòng Deluxe Balcony": "1 King bed", "Phòng Premier": "1 King bed", "Phòng Junior Suite": "1 King bed", "Phòng Imperial Suite": "1 King bed" },
  };
  const size = sizeMap[room.name] || 25;
  const bed = (bedLabels[lang] || bedLabels.vi)[room.name] || (lang === "en" ? "1 King bed" : "1 giường King");

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group relative">
      {/* AI Tooltip */}
      {showTooltip && (
        <div className="absolute top-3 right-3 z-10 bg-white rounded-xl shadow-lg p-3 max-w-[200px] flex items-start gap-2">
          <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-gray-700 leading-snug">{t("rooms.tooltip")}</p>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={room.image || `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop`}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-800 text-base">{room.name}</h3>
          {pricingSummary && pricingSummary.multiplier !== 100 ? (
            <div className="flex flex-col items-end">
              <span className="text-xs line-through text-gray-400">{room.price.toLocaleString("vi-VN")}</span>
              <span className="text-[#F97316] font-bold text-sm whitespace-nowrap">{Math.round(room.price * pricingSummary.multiplier / 100).toLocaleString("vi-VN")} VND {t("common.per_night")}</span>
            </div>
          ) : (
            <span className="text-[#F97316] font-bold text-sm whitespace-nowrap">{room.price.toLocaleString("vi-VN")} VND {t("common.per_night")}</span>
          )}
        </div>

        {/* Room info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {room.capacity} {t("common.guests")}</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            {size} m²
          </span>
          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {bed}</span>
        </div>

        {/* Link */}
        <button
          onClick={() => { onTrackView?.(room); onNavigate(room.id); }}
          className="flex items-center gap-1 text-[#F97316] hover:text-[#EA580C] font-semibold text-sm transition-colors group/link"
        >
          {t("rooms.view_detail")}
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ─── Rooms Section ─────────────────────────────────────────────────────────────
function RoomsSection({ filterGuests }: { filterGuests: number }) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { trackRoomView } = useVisitorProfile();
  const roomsQuery = trpc.rooms.list.useQuery();
  const pricingQuery = trpc.pricing.getSummary.useQuery();
  const pricingSummary = pricingQuery.data ?? null;
  const rooms = (roomsQuery.data || []).filter((r) => filterGuests <= 1 || r.capacity >= filterGuests);

  return (
    <section id="rooms-section" className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{t("rooms.title")}</h2>
            <p className="text-gray-500 text-sm md:text-base">{t("rooms.subtitle")}</p>
          </div>
          {/* Hue palace watermark - decorative */}
          <div className="hidden md:block opacity-10">
            <svg viewBox="0 0 200 120" className="w-48 h-28" fill="#F97316">
              <rect x="10" y="80" width="180" height="8" rx="2"/>
              <rect x="20" y="60" width="160" height="20" rx="2"/>
              <path d="M30 60 L100 20 L170 60" />
              <rect x="50" y="30" width="100" height="30" rx="2" fill="none" stroke="#F97316" strokeWidth="2"/>
              <path d="M80 20 L100 5 L120 20" />
            </svg>
          </div>
        </div>

        {roomsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, idx) => (
              <RoomCard
                key={room.id}
                room={room}
                onNavigate={(id) => navigate(`/room/${id}`)}
                showTooltip={idx === 2}
                onTrackView={(r) => trackRoomView({ id: r.id, name: r.name, price: r.price, image: r.image || '' })}
                pricingSummary={pricingSummary}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Amenities Bar ─────────────────────────────────────────────────────────────
function AmenitiesBar() {
  const { t } = useLanguage();
  const items = [
    { icon: <Award className="w-6 h-6 text-[#F97316]" />, title: t("trust.best_price"), desc: t("trust.best_price_desc") },
    { icon: <svg className="w-6 h-6 text-[#F97316]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: t("trust.free_cancel"), desc: t("trust.free_cancel_desc") },
    { icon: <Coffee className="w-6 h-6 text-[#F97316]" />, title: t("trust.breakfast"), desc: t("trust.breakfast_desc") },
    { icon: <Wifi className="w-6 h-6 text-[#F97316]" />, title: t("trust.wifi"), desc: t("trust.wifi_desc") },
  ];

  return (
    <section className="py-8 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#F97316]/20 flex items-center justify-center shrink-0 bg-[#F97316]/5">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Mobile Bottom Nav ─────────────────────────────────────────────────────────
function MobileBottomNav() {
  const { t } = useLanguage();
  const [active, setActive] = useState("home");
  const [, navigate] = useLocation();

  const tabs = [
    { id: "home", label: t("nav.home"), icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, action: () => navigate("/") },
    { id: "rooms", label: t("nav.rooms"), icon: <BedDouble className="w-5 h-5" />, action: () => navigate("/rooms") },
    { id: "offers", label: t("nav.offers"), icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, action: () => {} },
    { id: "gallery", label: "Gallery", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>, action: () => {} },
    { id: "contact", label: t("nav.contact"), icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, action: () => {} },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActive(tab.id); tab.action(); }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${active === tab.id ? "text-[#F97316]" : "text-gray-400"}`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── AI Chat Bubble ─────────────────────────────────────────────────────────────
function AIChatBubble() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatMutation = trpc.ai.chat.useMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || message;
    if (!msg.trim()) return;
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await chatMutation.mutateAsync({ message: msg });
      setMessages((prev) => [...prev, { role: "assistant", content: res.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t("chat.error") }]);
    } finally {
      setLoading(false);
    }
  };

  const shortcuts = [
    { icon: <Search className="w-4 h-4 text-[#F97316]" />, label: t("chat.q1"), sub: t("chat.q1_sub"), msg: t("chat.q1_msg") },
    { icon: <svg className="w-4 h-4 text-[#0D9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, label: t("chat.q2"), sub: t("chat.q2_sub"), msg: t("chat.q2_msg") },
    { icon: <svg className="w-4 h-4 text-[#F97316]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, label: t("chat.q3"), sub: t("chat.q3_sub"), msg: t("chat.q3_msg") },
    { icon: <svg className="w-4 h-4 text-[#0D9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: t("chat.q4"), sub: t("chat.q4_sub"), msg: t("chat.q4_msg") },
  ];

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header with robot */}
          <div className="bg-[#0D9488] p-4 relative">
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="flex items-center gap-3">
              {/* Robot avatar */}
              <div className="w-16 h-16 relative">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 60 60" className="w-12 h-12">
                    <circle cx="30" cy="30" r="28" fill="#1a1a2e"/>
                    <circle cx="30" cy="26" r="14" fill="#2d2d4e"/>
                    <circle cx="23" cy="24" r="5" fill="#00d4ff"/>
                    <circle cx="37" cy="24" r="5" fill="#00d4ff"/>
                    <circle cx="23" cy="24" r="2.5" fill="white"/>
                    <circle cx="37" cy="24" r="2.5" fill="white"/>
                    <path d="M24 33 Q30 38 36 33" stroke="#F97316" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <rect x="14" y="18" width="4" height="8" rx="2" fill="#F97316"/>
                    <rect x="42" y="18" width="4" height="8" rx="2" fill="#F97316"/>
                    <rect x="22" y="8" width="16" height="4" rx="2" fill="#2d2d4e"/>
                    <circle cx="30" cy="7" r="3" fill="#F97316"/>
                  </svg>
                </div>
              </div>
              <div className="text-white">
                <div className="font-bold text-base">{t("returning.welcome")} 👋</div>
                <div className="text-sm text-white/80">{t("returning.kept")} <span className="text-[#F97316] font-semibold">{t("returning.best_price")}</span> {t("returning.for_you")}</div>
              </div>
            </div>
          </div>

          {/* Special offer card */}
          <div className="px-4 pt-3">
            <div className="bg-[#FFF7ED] border border-[#F97316]/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#FFF0D9] transition-colors">
              <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 text-sm">{t("chat.special_offer_for_you")}</div>
                <div className="text-[#F97316] text-xs font-medium">{t("chat.view_offers")}</div>
              </div>
            </div>
          </div>

          {/* Shortcuts */}
          {messages.length === 0 && (
            <div className="px-4 pt-3 space-y-2">
              {shortcuts.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.msg)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">{s.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">{s.label}</div>
                    <div className="text-xs text-gray-400">{s.sub}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="px-4 pt-3 max-h-48 overflow-y-auto space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-700"}`}>
                    {m.role === "assistant" ? (
                      <span dangerouslySetInnerHTML={{ __html: m.content }} />
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm text-gray-400">Đang trả lời...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input */}
          <div className="p-4">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#0D9488] transition-colors">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={t("chat.placeholder")}
                className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
              <button
                onClick={() => sendMessage()}
                className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center text-white hover:bg-[#0B7A6E] transition-colors shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-16 h-16 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform bg-white border-2 border-[#F97316]"
        style={{ display: open ? "none" : "flex" }}
      >
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F97316] rounded-full text-white text-[10px] font-bold flex items-center justify-center">1</span>
        {/* Robot face */}
        <svg viewBox="0 0 60 60" className="w-10 h-10">
          <circle cx="30" cy="30" r="28" fill="#1a1a2e"/>
          <circle cx="30" cy="26" r="14" fill="#2d2d4e"/>
          <circle cx="23" cy="24" r="5" fill="#00d4ff"/>
          <circle cx="37" cy="24" r="5" fill="#00d4ff"/>
          <circle cx="23" cy="24" r="2.5" fill="white"/>
          <circle cx="37" cy="24" r="2.5" fill="white"/>
          <path d="M24 33 Q30 38 36 33" stroke="#F97316" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <rect x="14" y="18" width="4" height="8" rx="2" fill="#F97316"/>
          <rect x="42" y="18" width="4" height="8" rx="2" fill="#F97316"/>
          <circle cx="30" cy="7" r="3" fill="#F97316"/>
        </svg>
      </button>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { t } = useLanguage();
  const [filterGuests, setFilterGuests] = useState(0);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const { triggered: exitTriggered } = useExitIntent({ delayMs: 5000 });
  const { profile } = useVisitorProfile();

  // Show exit-intent popup when triggered
  useEffect(() => {
    if (exitTriggered) setShowExitPopup(true);
  }, [exitTriggered]);

  const handleSearch = (guests: number) => {
    setFilterGuests(guests);
  };

  const lastViewedRoom = profile.viewedRooms[0]
    ? { id: profile.viewedRooms[0].id, name: profile.viewedRooms[0].name, price: profile.viewedRooms[0].price }
    : null;

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <SiteHeader />
      <div className="pt-16">
        <HeroSection onSearch={handleSearch} />
        <WhyUsSection />
        <RoomsSection filterGuests={filterGuests} />
        <AmenitiesBar />
      </div>
      <AIChatBubble />
      <MobileBottomNav />
      {/* P1: Returning Visitor Banner */}
      <ReturningVisitorBanner profile={profile} />
      {/* P1: Exit-Intent Popup */}
      {showExitPopup && (
        <ExitIntentPopup
          onClose={() => setShowExitPopup(false)}
          lastViewedRoom={lastViewedRoom}
        />
      )}
    </div>
  );
}
