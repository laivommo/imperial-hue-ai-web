import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { RoomCard } from "@/components/RoomCard";
import { AIChat } from "@/components/AIChat";
import type { Room } from "../../../drizzle/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const roomsQuery = trpc.rooms.list.useQuery();
  const rooms = roomsQuery.data || [];

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleNavigateToRoom = (roomId: number) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop')",
          }}
        ></div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          {/* Logo & Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              The Imperial Hue
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Trải nghiệm lưu trú cao cấp tại trung tâm Huế
            </p>
            <p className="text-lg text-[#F97316] font-semibold">
              ⭐⭐⭐ Boutique Hotel
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
            <p className="text-gray-700 font-semibold mb-4 text-center">
              Chào bạn, bạn đang tìm kiếm một kỳ nghỉ như thế nào?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Check-in */}
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-[#0D9488]" />
                <input
                  type="date"
                  value={checkIn ? checkIn.toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setCheckIn(e.target.value ? new Date(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
                  placeholder="Check-in"
                />
              </div>

              {/* Check-out */}
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-[#0D9488]" />
                <input
                  type="date"
                  value={checkOut ? checkOut.toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setCheckOut(e.target.value ? new Date(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
                  placeholder="Check-out"
                />
              </div>

              {/* Guests */}
              <div className="flex items-center gap-2">
                <Users size={20} className="text-[#0D9488]" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} khách
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-lg transition-colors">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Room Gallery Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Các phòng của chúng tôi
            </h2>
            <p className="text-lg text-gray-600">
              Chọn phòng phù hợp với nhu cầu của bạn
            </p>
          </div>

          {roomsQuery.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Đang tải phòng...</div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Không có phòng nào</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onSelect={handleSelectRoom}
                  onNavigate={handleNavigateToRoom}
                  viewingCount={Math.floor(Math.random() * 5)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Vị trí trung tâm</h3>
              <p className="text-gray-600">
                Nằm giữa lòng thành phố Huế, gần các điểm du lịch nổi tiếng
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F97316] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Phòng sạch sẽ</h3>
              <p className="text-gray-600">
                Tất cả phòng được vệ sinh kỹ lưỡng theo tiêu chuẩn quốc tế
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Dịch vụ tốt</h3>
              <p className="text-gray-600">
                Đội ngũ nhân viên chuyên nghiệp, luôn sẵn sàng hỗ trợ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F97316] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Giá cạnh tranh</h3>
              <p className="text-gray-600">
                Mức giá phù hợp với chất lượng dịch vụ cao
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat */}
      <AIChat checkIn={checkIn || undefined} checkOut={checkOut || undefined} guests={guests} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2">© 2026 The Imperial Hue. All rights reserved.</p>
          <p className="text-gray-400">
            Địa chỉ: 123 Đường Trần Hưng Đạo, Huế | Điện thoại: 0234 123 456
          </p>
        </div>
      </footer>
    </div>
  );
}
