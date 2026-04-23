import SiteHeader from "@/components/SiteHeader";
import { Star, Heart, Award, Users, MapPin } from "lucide-react";

const values = [
  { icon: <Heart className="w-6 h-6 text-[#F97316]" />, title: "Tận tâm phục vụ", desc: "Mỗi khách hàng là một người thân. Chúng tôi lắng nghe và đáp ứng từng nhu cầu nhỏ nhất." },
  { icon: <Star className="w-6 h-6 text-[#F97316]" />, title: "Chất lượng nhất quán", desc: "Tiêu chuẩn 3 sao được duy trì nghiêm ngặt trong từng chi tiết, từ phòng nghỉ đến ẩm thực." },
  { icon: <MapPin className="w-6 h-6 text-[#F97316]" />, title: "Bản sắc địa phương", desc: "Chúng tôi tự hào mang văn hoá Huế vào từng trải nghiệm – từ kiến trúc đến ẩm thực." },
  { icon: <Award className="w-6 h-6 text-[#F97316]" />, title: "Đổi mới liên tục", desc: "Ứng dụng công nghệ AI để cá nhân hoá trải nghiệm, đặt phòng thông minh hơn mỗi ngày." },
];

const team = [
  { name: "Nguyễn Minh Tuấn", role: "Tổng Giám đốc", desc: "15 năm kinh nghiệm trong ngành khách sạn cao cấp tại Việt Nam và quốc tế.", initials: "NT" },
  { name: "Trần Thị Lan Anh", role: "Giám đốc Dịch vụ", desc: "Chuyên gia về trải nghiệm khách hàng, từng làm việc tại Sofitel và Intercontinental.", initials: "LA" },
  { name: "Lê Quang Huy", role: "Bếp trưởng", desc: "Đầu bếp chuyên về ẩm thực cung đình Huế, tốt nghiệp Le Cordon Bleu Paris.", initials: "QH" },
  { name: "Phạm Thị Thu Hà", role: "Trưởng phòng Marketing", desc: "Chuyên gia digital marketing, xây dựng thương hiệu The Imperial Hue trên toàn quốc.", initials: "TH" },
];

const milestones = [
  { year: "2015", event: "Thành lập The Imperial Hue Boutique Hotel với 30 phòng" },
  { year: "2017", event: "Mở rộng lên 60 phòng, đạt chứng nhận 3 sao quốc gia" },
  { year: "2019", event: "Nhận giải thưởng 'Khách sạn Boutique tốt nhất miền Trung'" },
  { year: "2022", event: "Ra mắt nhà hàng The Garden, phục vụ ẩm thực cung đình Huế" },
  { year: "2024", event: "Tích hợp AI Agent – trợ lý du lịch thông minh đầu tiên tại Huế" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      <SiteHeader />

      {/* Hero */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <Users className="w-3.5 h-3.5" /> Câu chuyện của chúng tôi
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Giới thiệu về<br />The Imperial Hue</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed">
            Được thành lập năm 2015 với tình yêu dành cho mảnh đất cố đô, The Imperial Hue Boutique Hotel là nơi giao thoa giữa nét cổ kính của kinh thành Huế và sự tiện nghi hiện đại. Chúng tôi không chỉ cung cấp chỗ nghỉ ngơi – chúng tôi tạo ra những kỷ niệm khó quên.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-20 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "9+", label: "Năm kinh nghiệm" },
            { value: "60", label: "Phòng nghỉ" },
            { value: "15k+", label: "Lượt khách" },
            { value: "4.8★", label: "Đánh giá trung bình" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center hover:shadow-md transition-all">
              <div className="text-3xl font-bold text-[#F97316] mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <section className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Câu chuyện hình thành</h2>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3">
            <p>The Imperial Hue ra đời từ ước mơ của những người con xứ Huế muốn giới thiệu vẻ đẹp của quê hương đến bạn bè trong nước và quốc tế. Tọa lạc ngay trung tâm thành phố, cách Đại Nội chỉ 500 mét, khách sạn được thiết kế lấy cảm hứng từ kiến trúc cung đình triều Nguyễn.</p>
            <p>Với 60 phòng nghỉ được trang bị đầy đủ tiện nghi hiện đại, nhà hàng phục vụ ẩm thực cung đình Huế và đội ngũ nhân viên nhiệt tình, The Imperial Hue đã trở thành điểm đến yêu thích của hàng nghìn du khách mỗi năm.</p>
            <p>Năm 2024, chúng tôi tiên phong ứng dụng AI Agent vào dịch vụ khách sạn – giúp khách hàng tìm phòng, đặt dịch vụ và khám phá Huế một cách thông minh và cá nhân hoá hơn bao giờ hết.</p>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-[#F97316]/20 transition-all">
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
          <h2 className="text-xl font-bold text-gray-800 mb-5">Hành trình phát triển</h2>
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
          <h2 className="text-xl font-bold text-gray-800 mb-5">Đội ngũ lãnh đạo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-5 border border-gray-100 text-center hover:shadow-md transition-all">
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
