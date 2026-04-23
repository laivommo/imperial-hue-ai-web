import SiteHeader from "@/components/SiteHeader";
import { MapPin, Clock, Star, Camera, Utensils, Bike } from "lucide-react";

const attractions = [
  {
    name: "Đại Nội Huế",
    category: "Di tích lịch sử",
    distance: "0.5 km",
    time: "3-4 giờ",
    rating: 4.9,
    desc: "Kinh thành Huế – trung tâm quyền lực của triều Nguyễn, được UNESCO công nhận là Di sản Thế giới.",
    img: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&h=250&fit=crop",
    tag: "Phải đến",
    tagColor: "bg-red-500",
  },
  {
    name: "Sông Hương & Cầu Tràng Tiền",
    category: "Thiên nhiên",
    distance: "0.3 km",
    time: "1-2 giờ",
    rating: 4.8,
    desc: "Dòng sông thơ mộng chảy qua lòng thành phố, biểu tượng của xứ Huế mộng mơ.",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop",
    tag: "Nổi bật",
    tagColor: "bg-[#0D9488]",
  },
  {
    name: "Lăng Tự Đức",
    category: "Di tích lịch sử",
    distance: "7 km",
    time: "2-3 giờ",
    rating: 4.7,
    desc: "Lăng tẩm đẹp nhất trong hệ thống lăng mộ triều Nguyễn, kiến trúc hài hoà với thiên nhiên.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    tag: "Kiến trúc",
    tagColor: "bg-amber-500",
  },
  {
    name: "Chùa Thiên Mụ",
    category: "Tâm linh",
    distance: "4 km",
    time: "1-2 giờ",
    rating: 4.8,
    desc: "Ngôi chùa cổ kính nhất Huế với tháp Phước Duyên 7 tầng soi bóng xuống sông Hương.",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    tag: "Tâm linh",
    tagColor: "bg-purple-500",
  },
];

const foods = [
  { name: "Bún bò Huế", desc: "Món ăn đặc trưng nhất của Huế với nước dùng đậm đà, sợi bún to và thịt bò tươi ngon.", icon: "🍜", where: "Chợ Đông Ba, Bà Tuấn" },
  { name: "Cơm hến", desc: "Cơm trộn hến sông Hương, rau thơm và gia vị đặc biệt – hương vị khó quên của xứ Huế.", icon: "🍚", where: "Cồn Hến, Vỹ Dạ" },
  { name: "Bánh khoái", desc: "Bánh chiên giòn nhân tôm thịt, chấm với nước lèo đặc biệt của Huế.", icon: "🥞", where: "Phố Đi Bộ Nguyễn Đình Chiểu" },
  { name: "Chè Huế", desc: "Hơn 20 loại chè với hương vị ngọt thanh, đặc biệt là chè hạt sen và chè bột lọc.", icon: "🍮", where: "Chợ Đông Ba, Hàng Bè" },
];

const activities = [
  { icon: <Bike className="w-6 h-6 text-[#0D9488]" />, title: "Đạp xe khám phá", desc: "Thuê xe đạp miễn phí tại khách sạn, khám phá các con phố cổ và làng nghề truyền thống." },
  { icon: <Camera className="w-6 h-6 text-[#0D9488]" />, title: "Chụp ảnh áo dài", desc: "Thuê áo dài truyền thống và chụp ảnh tại Đại Nội, cầu Tràng Tiền – kỷ niệm đáng nhớ." },
  { icon: <Utensils className="w-6 h-6 text-[#0D9488]" />, title: "Lớp học nấu ăn Huế", desc: "Tham gia lớp học nấu các món đặc sản Huế cùng đầu bếp địa phương tại nhà hàng khách sạn." },
  { icon: <Star className="w-6 h-6 text-[#0D9488]" />, title: "Tour thuyền sông Hương", desc: "Ngắm hoàng hôn trên sông Hương, thưởng thức nhã nhạc cung đình Huế trên thuyền rồng." },
];

export default function Explore() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Page Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <MapPin className="w-3.5 h-3.5" /> Cố đô Huế
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Khám phá Huế</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">
            Huế – nơi lưu giữ hồn cốt của văn hoá Việt. Từ kinh thành ngàn năm đến dòng sông thơ mộng, mỗi góc phố đều kể một câu chuyện.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-20 space-y-12">

        {/* Attractions */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-xl font-bold text-gray-800">Điểm tham quan nổi bật</h2>
            <span className="text-xs text-gray-400 ml-auto">Gần khách sạn</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {attractions.map((place) => (
              <div key={place.name} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={place.img}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop"; }}
                  />
                  <span className={`absolute top-3 left-3 ${place.tagColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{place.tag}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{place.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {place.rating}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {place.distance}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {place.time}</span>
                    <span className="text-[#0D9488]">{place.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{place.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Foods */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Utensils className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-xl font-bold text-gray-800">Ẩm thực đặc sản Huế</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {foods.map((food) => (
              <div key={food.name} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-[#F97316]/20 transition-all">
                <div className="text-4xl mb-3">{food.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1">{food.name}</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{food.desc}</p>
                <div className="flex items-center gap-1 text-xs text-[#0D9488]">
                  <MapPin className="w-3 h-3" /> {food.where}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activities */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Bike className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-xl font-bold text-gray-800">Hoạt động trải nghiệm</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activities.map((act) => (
              <div key={act.title} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                  {act.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{act.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map placeholder */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Vị trí khách sạn</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488]/5 to-[#F97316]/5" />
            <div className="text-center relative z-10">
              <div className="w-14 h-14 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-gray-800">The Imperial Hue Boutique Hotel</p>
              <p className="text-sm text-gray-500 mt-1">123 Lê Lợi, Phường Vĩnh Ninh, TP. Huế</p>
              <p className="text-xs text-[#0D9488] mt-2 font-medium">Cách Đại Nội 500m • Cách sông Hương 300m</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
