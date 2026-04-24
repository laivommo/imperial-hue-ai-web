import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Clock, Star, Camera, Utensils, Bike } from "lucide-react";

export default function Explore() {
  const { t } = useLanguage();

  const attractions = [
    {
      name: t("explore.citadel"),
      category: t("explore.cat_history"),
      distance: "0.5 km",
      time: t("explore.hours_3_4"),
      rating: 4.9,
      desc: t("explore.citadel_desc"),
      img: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&h=250&fit=crop",
      tag: t("explore.must_visit"),
      tagColor: "bg-red-500",
    },
    {
      name: t("explore.perfume_river_bridge"),
      category: t("explore.cat_nature"),
      distance: "0.3 km",
      time: t("explore.hours_1_2"),
      rating: 4.8,
      desc: t("explore.perfume_river_desc"),
      img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop",
      tag: t("explore.featured"),
      tagColor: "bg-[#0D9488]",
    },
    {
      name: t("explore.tuduc"),
      category: t("explore.cat_history"),
      distance: "7 km",
      time: t("explore.hours_2_3"),
      rating: 4.7,
      desc: t("explore.tuduc_desc"),
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      tag: t("explore.architecture"),
      tagColor: "bg-amber-500",
    },
    {
      name: t("explore.thienmu"),
      category: t("explore.cat_spiritual"),
      distance: "4 km",
      time: t("explore.hours_1_2"),
      rating: 4.8,
      desc: t("explore.thienmu_desc"),
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      tag: t("explore.cat_spiritual"),
      tagColor: "bg-purple-500",
    },
  ];

  const foods = [
    { name: t("explore.bun_bo"), desc: t("explore.bun_bo_desc"), icon: "🍜", where: t("explore.bun_bo_where") },
    { name: t("explore.com_hen"), desc: t("explore.com_hen_desc"), icon: "🍚", where: t("explore.com_hen_where") },
    { name: t("explore.banh_khoai"), desc: t("explore.banh_khoai_desc"), icon: "🥞", where: t("explore.banh_khoai_where") },
    { name: t("explore.che_hue"), desc: t("explore.che_hue_desc"), icon: "🍮", where: t("explore.che_hue_where") },
  ];

  const activities = [
    { icon: <Bike className="w-6 h-6 text-[#0D9488]" />, title: t("explore.act_bike"), desc: t("explore.act_bike_desc") },
    { icon: <Camera className="w-6 h-6 text-[#0D9488]" />, title: t("explore.act_photo"), desc: t("explore.act_photo_desc") },
    { icon: <Utensils className="w-6 h-6 text-[#0D9488]" />, title: t("explore.act_cooking"), desc: t("explore.act_cooking_desc") },
    { icon: <Star className="w-6 h-6 text-[#0D9488]" />, title: t("explore.act_cruise"), desc: t("explore.act_cruise_desc") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Page Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <MapPin className="w-3.5 h-3.5" /> {t("explore.ancient_capital")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("explore.title")}</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">
            {t("explore.hero_desc")}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-20 space-y-12">

        {/* Attractions */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-xl font-bold text-gray-800">{t("explore.top_attractions")}</h2>
            <span className="text-xs text-gray-400 ml-auto">{t("explore.near_hotel")}</span>
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
            <h2 className="text-xl font-bold text-gray-800">{t("explore.local_cuisine")}</h2>
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
            <h2 className="text-xl font-bold text-gray-800">{t("explore.experiences")}</h2>
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t("explore.hotel_location")}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488]/5 to-[#F97316]/5" />
            <div className="text-center relative z-10">
              <div className="w-14 h-14 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-gray-800">The Imperial Hue Boutique Hotel</p>
              <p className="text-sm text-gray-500 mt-1">{t("explore.hotel_address")}</p>
              <p className="text-xs text-[#0D9488] mt-2 font-medium">{t("explore.hotel_nearby")}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
