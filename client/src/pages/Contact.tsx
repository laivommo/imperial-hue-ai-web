import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  const contactInfo = [
    { icon: <Phone className="w-5 h-5 text-[#0D9488]" />, label: t("contact.phone"), value: "+84 234 382 2222", sub: t("contact.support_247") },
    { icon: <Mail className="w-5 h-5 text-[#0D9488]" />, label: t("contact.email"), value: "info@imperialhue.vn", sub: t("contact.reply_2h") },
    { icon: <MapPin className="w-5 h-5 text-[#0D9488]" />, label: t("contact.address"), value: "123 Le Loi, Vinh Ninh", sub: t("contact.city_hue") },
    { icon: <Clock className="w-5 h-5 text-[#0D9488]" />, label: t("contact.hours"), value: t("contact.reception_247"), sub: t("contact.checkin_checkout_time") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Page Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <Phone className="w-3.5 h-3.5" /> {t("contact.always_ready")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("contact.title")}</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">
            {t("contact.hero_desc")}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info) => (
              <div key={info.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                  {info.icon}
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">{info.label}</div>
                  <div className="font-semibold text-gray-800 text-sm">{info.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{info.sub}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm mb-3">{t("contact.follow_us")}</h3>
              <div className="flex gap-3">
                {[
                  { name: "Facebook", color: "bg-blue-600", icon: "f" },
                  { name: "Instagram", color: "bg-gradient-to-br from-purple-500 to-pink-500", icon: "in" },
                  { name: "TikTok", color: "bg-black", icon: "tt" },
                  { name: "Zalo", color: "bg-blue-500", icon: "z" },
                ].map((social) => (
                  <button
                    key={social.name}
                    className={`${social.color} text-white w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold hover:opacity-80 transition-opacity`}
                    title={social.name}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-44 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488]/5 to-[#F97316]/5" />
              <div className="text-center relative z-10 px-4">
                <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">The Imperial Hue</p>
                <p className="text-xs text-gray-500 mt-0.5">123 Le Loi, Hue City</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0D9488] font-medium mt-1 inline-block hover:underline"
                >
                  {t("contact.view_on_maps")}
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{t("contact.success_title")}</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">{t("contact.success_desc")}</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="mt-5 text-[#0D9488] text-sm font-medium hover:underline"
                  >
                    {t("contact.send_another")}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{t("contact.send_message")}</h2>
                  <p className="text-sm text-gray-500 mb-6">{t("contact.form_desc")}</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("contact.fullname")} *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder={t("contact.fullname_placeholder")}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("contact.phone")}</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="0901 234 567"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("contact.subject")}</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 transition-all bg-white"
                      >
                        <option value="">{t("contact.select_subject")}</option>
                        <option value="booking">{t("contact.subject_booking")}</option>
                        <option value="service">{t("contact.subject_service")}</option>
                        <option value="event">{t("contact.subject_event")}</option>
                        <option value="feedback">{t("contact.subject_feedback")}</option>
                        <option value="other">{t("contact.subject_other")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("contact.message")} *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={t("contact.message_placeholder")}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t("contact.send_message")}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
