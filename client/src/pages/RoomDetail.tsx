import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Users, Wifi, Coffee, Tv, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { Room } from "../../../drizzle/schema";

export default function RoomDetail() {
  const [, params] = useRoute("/room/:id");
  const [, navigate] = useLocation();
  const roomId = params?.id ? parseInt(params.id) : null;
  const [isWishlisted, setIsWishlisted] = useState(false);

  const roomQuery = trpc.rooms.getById.useQuery(
    { id: roomId! },
    { enabled: !!roomId }
  );

  const room = roomQuery.data;

  if (roomQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Phòng không tìm thấy</div>
      </div>
    );
  }

  const amenities = room.amenities ? JSON.parse(room.amenities) : [];

  const getAmenityIcon = (amenity: string) => {
    const iconProps = { size: 24, className: "text-[#0D9488]" };
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi {...iconProps} />;
      case "tv":
        return <Tv {...iconProps} />;
      case "coffee":
        return <Coffee {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#0D9488]">
            The Imperial Hue
          </a>
          <button className="text-gray-600 hover:text-gray-900">← Quay lại</button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden mb-6">
              {room.image ? (
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0D9488] to-[#F97316]">
                  <span className="text-white text-lg">No Image</span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
              >
                <Heart
                  size={24}
                  className={isWishlisted ? "fill-[#F97316] text-[#F97316]" : "text-gray-400"}
                />
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{room.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {room.description || "Phòng được thiết kế với phong cách hiện đại, thoải mái và đầy đủ tiện nghi. Đây là lựa chọn hoàn hảo cho kỳ nghỉ của bạn tại Huế."}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tiện ích</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#0D9488] bg-opacity-10 rounded-lg flex items-center justify-center mb-3">
                      {getAmenityIcon(amenity)}
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{amenity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Giá mỗi đêm</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#F97316]">
                    {room.price.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-gray-600">VND</span>
                </div>
              </div>

              {/* Capacity */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-[#0D9488]" />
                  <span className="text-gray-700">
                    Sức chứa: <strong>{room.capacity} khách</strong>
                  </span>
                </div>
              </div>

              {/* Booking Info */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
                />
              </div>

              {/* Book Button */}
              <button
                onClick={() => navigate(`/booking/${roomId}`)}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 rounded-lg transition-colors mb-3"
              >
                Đặt phòng ngay
              </button>

              <button className="w-full border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white font-bold py-3 rounded-lg transition-colors">
                Hỏi thêm thông tin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-16">
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
