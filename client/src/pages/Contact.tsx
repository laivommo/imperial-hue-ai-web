import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  const contactInfo = [
    { icon: <Phone className="w-5 h-5 text-[#0D9488]" />, label: "Điện thoại", value: "+84 234 382 2222", sub: "Hỗ trợ 24/7" },
    { icon: <Mail className="w-5 h-5 text-[#0D9488]" />, label: "Email", value: "info@imperialhue.vn", sub: "Phản hồi trong 2 giờ" },
    { icon: <MapPin className="w-5 h-5 text-[#0D9488]" />, label: "Địa chỉ", value: "123 Lê Lợi, Vĩnh Ninh", sub: "TP. Huế, Thừa Thiên Huế" },
    { icon: <Clock className="w-5 h-5 text-[#0D9488]" />, label: "Giờ làm việc", value: "Lễ tân 24/7", sub: "Check-in từ 14:00 | Check-out 12:00" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Page Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <Phone className="w-3.5 h-3.5" /> Luôn sẵn sàng hỗ trợ
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Liên hệ với chúng tôi</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">
            Đội ngũ The Imperial Hue luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ để được tư vấn và đặt phòng nhanh chóng.
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
              <h3 className="font-bold text-gray-800 text-sm mb-3">Theo dõi chúng tôi</h3>
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
                <p className="text-xs text-gray-500 mt-0.5">123 Lê Lợi, TP. Huế</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0D9488] font-medium mt-1 inline-block hover:underline"
                >
                  Xem trên Google Maps →
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Gửi thành công!</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 2 giờ làm việc.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="mt-5 text-[#0D9488] text-sm font-medium hover:underline"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Gửi tin nhắn</h2>
                  <p className="text-sm text-gray-500 mb-6">Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Họ và tên *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Số điện thoại</label>
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
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Chủ đề</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 transition-all bg-white"
                      >
                        <option value="">Chọn chủ đề...</option>
                        <option value="booking">Đặt phòng & Giá cả</option>
                        <option value="service">Dịch vụ & Tiện nghi</option>
                        <option value="event">Tổ chức sự kiện</option>
                        <option value="feedback">Góp ý & Phản hồi</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nội dung *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Mô tả chi tiết yêu cầu của bạn..."
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
                          Gửi tin nhắn
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
