import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Tag, Clock, Star, Gift, Users, Sparkles, ChevronRight } from "lucide-react";

export default function Offers() {
  const { t, lang } = useLanguage();
  const [, navigate] = useLocation();

  const offers = [
    {
      badge: t("offers.badge_popular"),
      badgeColor: "bg-[#F97316] text-white",
      title: t("offers.honeymoon_title"),
      subtitle: "Romantic Escape",
      desc: t("offers.honeymoon_desc"),
      price: "2.800.000",
      originalPrice: "3.500.000",
      discount: "-20%",
      duration: lang === "en" ? "2 nights" : "2 đêm",
      includes: lang === "en"
        ? ["Deluxe Balcony Room", "Breakfast for 2", "Romantic dinner", "Flowers & Wine", "Late check-out 14:00"]
        : ["Phòng Deluxe Balcony", "Bữa sáng cho 2", "Bữa tối lãng mạn", "Hoa & Rượu vang", "Late check-out 14:00"],
      color: "from-pink-50 to-rose-50",
      border: "border-pink-200",
      icon: <Star className="w-8 h-8 text-pink-500" />,
    },
    {
      badge: t("offers.badge_family"),
      badgeColor: "bg-[#0D9488] text-white",
      title: t("offers.family_title"),
      subtitle: "Family Fun Package",
      desc: t("offers.family_desc"),
      price: "3.200.000",
      originalPrice: "4.000.000",
      discount: "-20%",
      duration: lang === "en" ? "2 nights" : "2 đêm",
      includes: lang === "en"
        ? ["Junior Suite (4 guests)", "Buffet breakfast for family", "Imperial Citadel tour for 4", "Free bicycles", "Children under 12 free"]
        : ["Phòng Junior Suite (4 người)", "Bữa sáng buffet cho cả nhà", "Tour Đại Nội cho 4", "Xe đạp miễn phí", "Trẻ em dưới 12 miễn phí"],
      color: "from-teal-50 to-cyan-50",
      border: "border-teal-200",
      icon: <Users className="w-8 h-8 text-[#0D9488]" />,
    },
    {
      badge: t("offers.badge_savings"),
      badgeColor: "bg-amber-500 text-white",
      title: t("offers.weekend_title"),
      subtitle: "Weekend Getaway",
      desc: t("offers.weekend_desc"),
      price: "1.500.000",
      originalPrice: "1.900.000",
      discount: "-21%",
      duration: lang === "en" ? "2 nights" : "2 đêm",
      includes: lang === "en"
        ? ["Superior Room", "Breakfast for 2", "Spa voucher 200k", "Free Wi-Fi", "Free parking"]
        : ["Phòng Superior", "Bữa sáng cho 2", "Voucher Spa 200k", "Wi-Fi miễn phí", "Bãi đỗ xe miễn phí"],
      color: "from-amber-50 to-yellow-50",
      border: "border-amber-200",
      icon: <Gift className="w-8 h-8 text-amber-500" />,
    },
    {
      badge: t("offers.badge_longstay"),
      badgeColor: "bg-purple-500 text-white",
      title: t("offers.business_title"),
      subtitle: "Extended Stay",
      desc: t("offers.business_desc"),
      price: "1.200.000",
      originalPrice: "1.700.000",
      discount: "-29%",
      duration: lang === "en" ? "5+ nights" : "5+ đêm",
      includes: lang === "en"
        ? ["Deluxe Room", "Daily breakfast", "Free laundry", "Meeting room 2h/day", "Airport transfer"]
        : ["Phòng Deluxe", "Bữa sáng mỗi ngày", "Giặt ủi miễn phí", "Phòng họp 2h/ngày", "Đưa đón sân bay"],
      color: "from-purple-50 to-violet-50",
      border: "border-purple-200",
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
    },
  ];

  const flashDeals = [
    { title: t("offers.flash_friday"), desc: t("offers.flash_friday_desc"), expires: t("offers.flash_friday_expires"), color: "bg-red-500" },
    { title: "Early Bird", desc: t("offers.early_bird_desc"), expires: t("offers.early_bird_expires"), color: "bg-[#0D9488]" },
    { title: "Last Minute", desc: t("offers.last_minute_desc"), expires: t("offers.last_minute_expires"), color: "bg-[#F97316]" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Page Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <Tag className="w-3.5 h-3.5" /> {t("offers.special_tag")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("offers.title")}</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">
            {t("offers.hero_desc")}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-20 space-y-10">

        {/* Flash Deals */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-800">{t("offers.flash_title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flashDeals.map((deal) => (
              <div key={deal.title} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                <div className={`${deal.color} text-white text-xs font-bold px-2.5 py-1 rounded-lg shrink-0`}>{deal.expires}</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{deal.title}</h3>
                  <p className="text-xs text-gray-500">{deal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Packages */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">{t("offers.packages_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.title} className={`bg-gradient-to-br ${offer.color} rounded-3xl p-6 border ${offer.border} hover:shadow-lg transition-all`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    {offer.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${offer.badgeColor}`}>{offer.badge}</span>
                    <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full font-medium">{offer.duration}</span>
                  </div>
                </div>

                <div className="mb-1 text-xs text-gray-500 font-medium tracking-wide uppercase">{offer.subtitle}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{offer.desc}</p>

                {/* Includes */}
                <ul className="space-y-1.5 mb-5">
                  {offer.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-[#0D9488] flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#F97316]">{offer.price}</span>
                      <span className="text-sm text-gray-500">VND/{lang === "en" ? "night" : "đêm"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">{offer.originalPrice} VND</span>
                      <span className="text-xs font-bold text-green-600">{offer.discount}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/rooms")}
                    className="flex items-center gap-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    {t("offers.book_now")} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Note */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-sm text-gray-500 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#0D9488]/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-[#0D9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p>{t("offers.note")}</p>
        </div>
      </main>
    </div>
  );
}
