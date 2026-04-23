import { useState } from "react";
import { Users, Wifi, Coffee, Tv } from "lucide-react";
import type { Room } from "../../../drizzle/schema";

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  viewingCount?: number;
  onNavigate?: (roomId: number) => void;
}

export function RoomCard({ room, onSelect, viewingCount = 0, onNavigate }: RoomCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const amenities = room.amenities ? JSON.parse(room.amenities) : [];

  const getAmenityIcon = (amenity: string) => {
    const iconProps = { size: 16, className: "text-[#0D9488]" };
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
    <div
      className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {room.image ? (
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0D9488] to-[#F97316]">
            <span className="text-white text-sm">No Image</span>
          </div>
        )}

        {/* Viewing Badge */}
        {viewingCount > 0 && (
          <div className="absolute top-2 right-2 bg-[#F97316] text-white px-3 py-1 rounded-full text-xs font-semibold">
            🔥 {viewingCount} người đang xem
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{room.name}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-bold text-[#F97316]">
            {room.price.toLocaleString("vi-VN")}
          </span>
          <span className="text-sm text-gray-600">VND/đêm</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <Users size={16} className="text-[#0D9488]" />
          <span className="text-sm">{room.capacity} khách</span>
        </div>

        {/* Amenities */}
        <div className="flex gap-2 mb-4">
          {amenities.slice(0, 3).map((amenity: string, idx: number) => (
            <div key={idx} className="flex items-center gap-1">
              {getAmenityIcon(amenity)}
              <span className="text-xs text-gray-600">{amenity}</span>
            </div>
          ))}
        </div>

        {/* Select Button */}
        <button
          onClick={() => {
            onSelect(room);
            if (onNavigate) onNavigate(room.id);
          }}
          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Xem chi tiết
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border-2 border-[#0D9488] rounded-lg p-3 shadow-lg z-10 w-48 text-sm">
          <p className="text-gray-800 font-semibold">
            Phòng này thường hết chỗ vào cuối tuần, bạn có muốn xem lịch trống không?
          </p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-[#0D9488]"></div>
        </div>
      )}
    </div>
  );
}
