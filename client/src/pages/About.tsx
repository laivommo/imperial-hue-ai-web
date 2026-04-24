import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Heart, Award, Users, MapPin } from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: <Heart className="w-6 h-6 text-[#F97316]" />, title: t("about.value1_title"), desc: t("about.value1_desc") },
    { icon: <Star className="w-6 h-6 text-[#F97316]" />, title: t("about.value2_title"), desc: t("about.value2_desc") },
    { icon: <MapPin className="w-6 h-6 text-[#F97316]" />, title: t("about.value3_title"), desc: t("about.value3_desc") },
    { icon: <Award className="w-6 h-6 text-[#F97316]" />, title: t("about.value4_title"), desc: t("about.value4_desc") },
  ];

  const team = [
    { name: t("about.team1_name"), role: t("about.team1_role"), desc: t("about.team1_desc"), initials: "NT" },
    { name: t("about.team2_name"), role: t("about.team2_role"), desc: t("about.team2_desc"), initials: "LA" },
    { name: t("about.team3_name"), role: t("about.team3_role"), desc: t("about.team3_desc"), initials: "QH" },
    { name: t("about.team4_name"), role: t("about.team4_role"), desc: t("about.team4_desc"), initials: "TH" },
  ];

  const milestones = [
    { year: "2015", event: t("about.milestone_2015") },
    { year: "2017", event: t("about.milestone_2017") },
    { year: "2019", event: t("about.milestone_2019") },
    { year: "2022", event: t("about.milestone_2022") },
    { year: "2024", event: t("about.milestone_2024") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <Users className="w-3.5 h-3.5" /> {t("about.story")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("about.hero_title")}</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed">
            {t("about.hero_desc")}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-20 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "9+", label: t("about.stat_years") },
            { value: "60", label: t("about.stat_rooms") },
            { value: "15k+", label: t("about.stat_guests") },
            { value: "4.8\u2605", label: t("about.stat_rating") },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center hover:shadow-md transition-all">
              <div className="text-3xl font-bold text-[#F97316] mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <section className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t("about.story_title")}</h2>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3">
            <p>{t("about.story_p1")}</p>
            <p>{t("about.story_p2")}</p>
            <p>{t("about.story_p3")}</p>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">{t("about.values")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-[#F97316]/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center mb-3">
                  {v.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">{t("about.timeline_title")}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-0">
            {milestones.map((m, idx) => (
              <div key={m.year} className={`flex gap-4 ${idx < milestones.length - 1 ? "pb-6" : ""}`}>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#0D9488] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {m.year.slice(2)}
                  </div>
                  {idx < milestones.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 mt-2" />}
                </div>
                <div className="pt-2 pb-2">
                  <span className="text-xs font-bold text-[#F97316]">{m.year}</span>
                  <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">{t("about.team_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 text-center hover:shadow-md transition-all">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0f766e] flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {member.initials}
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{member.name}</h3>
                <p className="text-xs text-[#F97316] font-medium mb-2">{member.role}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
