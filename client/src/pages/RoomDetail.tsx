import { useState, type ReactElement } from "react";
import { useRoute, useLocation } from "wouter";
import { Users, Wifi, Coffee, Tv, Wind, Star, MapPin, ChevronRight, Calendar, ArrowLeft, BedDouble } from "lucide-react";
import { trpc } from "@/lib/trpc";

const amenityIcons: Record<string, ReactElement> = {
  WiFi: <Wifi className="w-5 h-5" />,
  TV: <Tv className="w-5 h-5" />,
  "Điều hòa": <Wind className="w-5 h-5" />,
  Minibar: <Coffee className="w-5 h-5" />,
  "Bồn tắm": <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6C9 4.34 10.34 3 12 3c1.66 0 3 1.34 3 3v4M3 10h18v4c0 3.31-2.69 6-6 6H9c-3.31 0-6-2.69-6-6v-4z"/></svg>,
  "Ban công": <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  "Phòng khách": <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/></svg>,
};

export default function RoomDetail() {
  const [, params] = useRoute("/room/:id");
  const [, navigate] = useLocation();
  const roomId = params?.id ? parseInt(params.id) : null;
  const [liked, setLiked] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const roomQuery = trpc.rooms.getById.useQuery(
    { id: roomId! },
    { enabled: !!roomId }
  );
  const room = roomQuery.data;

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  })();

  if (roomQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Không tìm thấy phòng này.</p>
        <button onClick={() => navigate("/")} className="text-[#0D9488] font-semibold hover:underline">← Quay lại trang chủ</button>
      </div>
    );
  }

  const amenities: string[] = (() => { try { return JSON.parse(room.amenities || "[]"); } catch { return []; } })();
  const sizeMap: Record<string, number> = { "Phòng Superior": 22, "Phòng Deluxe": 28, "Phòng Deluxe Balcony": 30, "Phòng Premier": 32, "Phòng Junior Suite": 40, "Phòng Imperial Suite": 55 };
  const bedMap: Record<string, string> = { "Phòng Superior": "1 giường Queen", "Phòng Deluxe": "1 giường King", "Phòng Deluxe Balcony": "1 giường King", "Phòng Premier": "1 giường King", "Phòng Junior Suite": "1 giường King", "Phòng Imperial Suite": "1 giường King" };
  const size = sizeMap[room.name] || 25;
  const bed = bedMap[room.name] || "1 giường King";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600 hover:text-[#0D9488] transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:block">Quay lại</span>
          </button>
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#F97316] flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                <rect x="4" y="28" width="32" height="4" rx="1" fill="#F97316"/>
                <rect x="8" y="20" width="24" height="8" rx="1" fill="#F97316" opacity="0.8"/>
                <path d="M12 20 L20 8 L28 20" fill="#F97316" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-bold text-[#0D9488]">The Imperial Hue</span>
          </a>
          <button
            onClick={() => navigate(`/booking/${roomId}`)}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Đặt phòng ngay
          </button>
        </div>
      </header>

      <div className="pt-16">
        {/* Hero image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={room.image || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=700&fit=crop"}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setLiked(!liked)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <svg className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Room info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title + Price */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
                  <span className="text-[#F97316] font-bold text-xl whitespace-nowrap">
                    {room.price.toLocaleString("vi-VN")} VND
                    <span className="text-sm font-normal text-gray-400">/đêm</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {room.capacity} khách</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    {size} m²
                  </span>
                  <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> {bed}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Trung tâm Huế</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-5 h-5 ${s <= 4 ? "fill-[#F97316] text-[#F97316]" : "text-gray-300"}`} />
                ))}
                <span className="text-sm text-gray-500 ml-1">(4.0 / 5 · 128 đánh giá)</span>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Mô tả phòng</h2>
                <p className="text-gray-600 leading-relaxed">{room.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tiện ích</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488]">
                        {amenityIcons[a] || <Star className="w-5 h-5" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div className="bg-[#FFF7ED] rounded-2xl p-5 border border-[#F97316]/20">
                <h3 className="font-bold text-gray-800 mb-3">Chính sách phòng</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {["Nhận phòng: 14:00 | Trả phòng: 12:00", "Miễn phí hủy phòng trước 48 giờ", "Bữa sáng buffet miễn phí", "Wi-Fi miễn phí tốc độ cao"].map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[#F97316] shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking widget */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
                <div className="text-2xl font-bold text-[#F97316] mb-1">{room.price.toLocaleString("vi-VN")} VND</div>
                <div className="text-sm text-gray-400 mb-5">mỗi đêm</div>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-medium">Check-in</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0D9488] transition-colors">
                      <Calendar className="w-4 h-4 text-[#0D9488]" />
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="flex-1 text-sm outline-none text-gray-700 bg-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-medium">Check-out</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0D9488] transition-colors">
                      <Calendar className="w-4 h-4 text-[#0D9488]" />
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="flex-1 text-sm outline-none text-gray-700 bg-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-medium">Số khách</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#0D9488] bg-white"
                    >
                      {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} khách</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price summary */}
                {nights > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>{room.price.toLocaleString("vi-VN")} × {nights} đêm</span>
                      <span>{(room.price * nights).toLocaleString("vi-VN")} VND</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200">
                      <span>Tổng cộng</span>
                      <span className="text-[#F97316]">{(room.price * nights).toLocaleString("vi-VN")} VND</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/booking/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                  className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3.5 rounded-xl transition-colors text-base"
                >
                  Đặt phòng ngay
                </button>
                <button className="w-full mt-2 border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5 font-semibold py-3 rounded-xl transition-colors text-sm">
                  Hỏi thêm thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2">© 2026 The Imperial Hue. All rights reserved.</p>
          <p className="text-gray-400 text-sm">Địa chỉ: 123 Đường Trần Hưng Đạo, Huế | Điện thoại: 0234 123 456</p>
        </div>
      </footer>
    </div>
  );
}
