import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wifi, Coffee, Car, Dumbbell, Waves, Utensils, Shield, Clock, Star, MapPin, Wind, Tv } from "lucide-react";

export default function Amenities() {
  const { t } = useLanguage();

  const amenityGroups = [
    {
      title: t("amenities.room_amenities"),
      icon: <Star className="w-6 h-6 text-[#0D9488]" />,
      items: [
        { icon: <Wifi className="w-5 h-5" />, name: t("amenities.wifi"), desc: t("amenities.wifi_desc") },
        { icon: <Wind className="w-5 h-5" />, name: t("amenities.ac"), desc: t("amenities.ac_desc") },
        { icon: <Tv className="w-5 h-5" />, name: t("amenities.tv"), desc: t("amenities.tv_desc") },
        { icon: <Shield className="w-5 h-5" />, name: t("amenities.safe"), desc: t("amenities.safe_desc") },
      ],
    },
    {
      title: t("amenities.dining"),
      icon: <Utensils className="w-6 h-6 text-[#0D9488]" />,
      items: [
        { icon: <Coffee className="w-5 h-5" />, name: t("amenities.breakfast"), desc: t("amenities.breakfast_desc") },
        { icon: <Utensils className="w-5 h-5" />, name: t("amenities.restaurant"), desc: t("amenities.restaurant_desc") },
        { icon: <Coffee className="w-5 h-5" />, name: t("amenities.cafe"), desc: t("amenities.cafe_desc") },
        { icon: <Clock className="w-5 h-5" />, name: t("amenities.room_service"), desc: t("amenities.room_service_desc") },
      ],
    },
    {
      title: t("amenities.wellness"),
      icon: <Dumbbell className="w-6 h-6 text-[#0D9488]" />,
      items: [
        { icon: <Waves className="w-5 h-5" />, name: t("amenities.pool"), desc: t("amenities.pool_desc") },
        { icon: <Dumbbell className="w-5 h-5" />, name: t("amenities.gym"), desc: t("amenities.gym_desc") },
        { icon: <Star className="w-5 h-5" />, name: t("amenities.spa"), desc: t("amenities.spa_desc") },
        { icon: <Waves className="w-5 h-5" />, name: t("amenities.sauna"), desc: t("amenities.sauna_desc") },
      ],
    },
    {
      title: t("amenities.services"),
      icon: <MapPin className="w-6 h-6 text-[#0D9488]" />,
      items: [
        { icon: <Car className="w-5 h-5" />, name: t("amenities.airport"), desc: t("amenities.airport_desc") },
        { icon: <Car className="w-5 h-5" />, name: t("amenities.parking"), desc: t("amenities.parking_desc") },
        { icon: <MapPin className="w-5 h-5" />, name: t("amenities.tours"), desc: t("amenities.tours_desc") },
        { icon: <Shield className="w-5 h-5" />, name: t("amenities.reception"), desc: t("amenities.reception_desc") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Page Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                <Star className="w-3.5 h-3.5" /> {t("amenities.standard")}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("amenities.title")}</h1>
              <p className="text-gray-500 text-sm md:text-base max-w-lg">
                {t("amenities.subtitle")}
              </p>
            </div>
            {/* Stats */}
            <div className="flex gap-6 md:gap-8">
              {[
                { value: "30+", label: t("nav.amenities") },
                { value: "24/7", label: t("amenities.support") },
                { value: "4.8★", label: t("amenities.rating") },
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
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("amenities.cta_title")}</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">{t("amenities.cta_desc")}</p>
          <a
            href="/rooms"
            className="inline-block bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            {t("amenities.cta_btn")}
          </a>
        </div>
      </main>
    </div>
  );
}
