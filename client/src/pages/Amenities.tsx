import SiteHeader from "@/components/SiteHeader";
import { Wifi, Coffee, Car, Dumbbell, Waves, Utensils, Shield, Clock, Star, MapPin, Wind, Tv } from "lucide-react";

const amenityGroups = [
  {
    title: "Phòng nghỉ",
    icon: <Star className="w-6 h-6 text-[#0D9488]" />,
    items: [
      { icon: <Wifi className="w-5 h-5" />, name: "Wi-Fi tốc độ cao", desc: "Miễn phí toàn khách sạn, tốc độ 100Mbps" },
      { icon: <Wind className="w-5 h-5" />, name: "Điều hoà trung tâm", desc: "Điều chỉnh nhiệt độ riêng từng phòng" },
      { icon: <Tv className="w-5 h-5" />, name: "Smart TV 43 inch", desc: "Hỗ trợ Netflix, YouTube và truyền hình cáp" },
      { icon: <Shield className="w-5 h-5" />, name: "Két an toàn", desc: "Két điện tử trong phòng cho mỗi phòng" },
    ],
  },
  {
    title: "Ẩm thực",
    icon: <Utensils className="w-6 h-6 text-[#0D9488]" />,
    items: [
      { icon: <Coffee className="w-5 h-5" />, name: "Bữa sáng miễn phí", desc: "Buffet đặc sản Huế mỗi sáng từ 6:30 – 10:00" },
      { icon: <Utensils className="w-5 h-5" />, name: "Nhà hàng The Garden", desc: "Phục vụ ẩm thực Huế và quốc tế từ 11:00 – 22:00" },
      { icon: <Coffee className="w-5 h-5" />, name: "Café & Bar Imperial", desc: "Cà phê, cocktail và đồ uống từ 7:00 – 23:00" },
      { icon: <Clock className="w-5 h-5" />, name: "Room Service 24/7", desc: "Đặt đồ ăn và đồ uống tại phòng bất kỳ lúc nào" },
    ],
  },
  {
    title: "Thể thao & Sức khoẻ",
    icon: <Dumbbell className="w-6 h-6 text-[#0D9488]" />,
    items: [
      { icon: <Waves className="w-5 h-5" />, name: "Hồ bơi ngoài trời", desc: "Hồ bơi 25m, mở cửa từ 6:00 – 21:00" },
      { icon: <Dumbbell className="w-5 h-5" />, name: "Phòng gym hiện đại", desc: "Trang thiết bị đầy đủ, mở cửa 24/7" },
      { icon: <Star className="w-5 h-5" />, name: "Spa & Massage", desc: "Liệu pháp thư giãn truyền thống Huế" },
      { icon: <Waves className="w-5 h-5" />, name: "Sauna & Steam Room", desc: "Phòng xông hơi khô và ướt" },
    ],
  },
  {
    title: "Dịch vụ & Tiện ích",
    icon: <MapPin className="w-6 h-6 text-[#0D9488]" />,
    items: [
      { icon: <Car className="w-5 h-5" />, name: "Đưa đón sân bay", desc: "Xe riêng đưa đón sân bay Phú Bài" },
      { icon: <Car className="w-5 h-5" />, name: "Bãi đỗ xe miễn phí", desc: "Bãi đỗ xe có mái che cho khách lưu trú" },
      { icon: <MapPin className="w-5 h-5" />, name: "Tour tham quan Huế", desc: "Đặt tour tham quan Đại Nội, lăng tẩm, sông Hương" },
      { icon: <Shield className="w-5 h-5" />, name: "Lễ tân 24/7", desc: "Hỗ trợ check-in/check-out và tư vấn du lịch" },
    ],
  },
];

export default function Amenities() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Page Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                <Star className="w-3.5 h-3.5" /> Tiêu chuẩn 3 sao
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tiện nghi & Dịch vụ</h1>
              <p className="text-gray-500 text-sm md:text-base max-w-lg">
                Trải nghiệm đầy đủ tiện nghi hiện đại kết hợp nét duyên dáng văn hoá Huế, mang đến kỳ nghỉ thoải mái và đáng nhớ.
              </p>
            </div>
            {/* Stats */}
            <div className="flex gap-6 md:gap-8">
              {[
                { value: "30+", label: "Tiện nghi" },
                { value: "24/7", label: "Hỗ trợ" },
                { value: "4.8★", label: "Đánh giá" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-[#F97316]">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Amenity Groups */}
      <main className="max-w-7xl mx-auto px-4 py-10 pb-20 space-y-10">
        {amenityGroups.map((group) => (
          <section key={group.title}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                {group.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{group.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-[#0D9488]/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] mb-3 group-hover:bg-[#0D9488] group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#0D9488] to-[#0f766e] rounded-3xl p-8 md:p-10 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Sẵn sàng trải nghiệm?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">Đặt phòng ngay hôm nay và tận hưởng toàn bộ tiện nghi cao cấp tại The Imperial Hue.</p>
          <a
            href="/rooms"
            className="inline-block bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Xem phòng & Đặt ngay
          </a>
        </div>
      </main>
    </div>
  );
}
