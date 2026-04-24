import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Phòng nghỉ", href: "/rooms" },
  { label: "Tiện nghi", href: "/amenities" },
  { label: "Ưu đãi", href: "/offers" },
  { label: "Khám phá Huế", href: "/explore" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

export default function SiteHeader() {
  const [location, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full border-2 border-[#F97316] flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
              <rect x="4" y="28" width="32" height="4" rx="1" fill="#F97316"/>
              <rect x="8" y="20" width="24" height="8" rx="1" fill="#F97316" opacity="0.8"/>
              <path d="M12 20 L20 8 L28 20" fill="#F97316" opacity="0.9"/>
              <rect x="16" y="12" width="8" height="8" rx="1" fill="white"/>
              <rect x="18" y="14" width="4" height="4" rx="0.5" fill="#F97316"/>
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-xs text-gray-400 font-medium tracking-widest uppercase">The</div>
            <div className="text-lg font-bold text-[#0D9488] leading-none tracking-wide">Imperial Hue</div>
            <div className="text-[10px] text-[#F97316] tracking-widest uppercase font-medium">Boutique Hotel</div>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  isActive
                    ? "text-[#0D9488] border-b-2 border-[#0D9488]"
                    : "text-gray-600 hover:text-[#0D9488]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Admin link — only visible to admin users */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/crm")}
              className={`hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                location.startsWith("/admin")
                  ? "bg-teal-50 text-[#0D9488]"
                  : "text-gray-500 hover:text-[#0D9488] hover:bg-teal-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </button>
          )}

          <button className="hidden md:flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            VI <ChevronRight className="w-3 h-3 rotate-90" />
          </button>
          <button
            onClick={() => navigate("/rooms")}
            className="hidden md:block bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Đặt phòng ngay
          </button>
          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 bg-[#F97316] rounded-full flex items-center justify-center text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <button
                key={item.label}
                onClick={() => { navigate(item.href); setMenuOpen(false); }}
                className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-[#0D9488]/10 text-[#0D9488]" : "text-gray-700 hover:bg-gray-50 hover:text-[#0D9488]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {/* Admin link in mobile menu */}
          {isAdmin && (
            <button
              onClick={() => { navigate("/admin/crm"); setMenuOpen(false); }}
              className={`flex items-center gap-2 w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                location.startsWith("/admin") ? "bg-teal-50 text-[#0D9488]" : "text-gray-700 hover:bg-gray-50 hover:text-[#0D9488]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </button>
          )}
          <button
            onClick={() => { navigate("/rooms"); setMenuOpen(false); }}
            className="w-full mt-2 bg-[#F97316] text-white text-sm font-semibold py-3 rounded-xl"
          >
            Đặt phòng ngay
          </button>
        </div>
      )}
    </header>
  );
}
