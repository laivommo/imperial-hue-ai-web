import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";

const SESSION_KEY = "imperial_admin_auth";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const verifyMutation = trpc.admin.verifyPassword.useMutation({
    onSuccess: () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAuthenticated(true);
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Mật khẩu không đúng. Vui lòng thử lại.");
    },
  });

  useEffect(() => {
    // Check if already authenticated in this session
    const stored = sessionStorage.getItem(SESSION_KEY);
    setIsAuthenticated(stored === "1");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    verifyMutation.mutate({ password });
  };

  // Still checking session storage
  if (isAuthenticated === null) return null;

  // Authenticated — render children
  if (isAuthenticated) return <>{children}</>;

  // Show login screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D9488]/10 via-white to-[#F97316]/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D9488] to-[#0f766e] px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Khu vực Admin</h1>
            <p className="text-teal-100 text-sm mt-1">The Imperial Hue — Boutique Hotel</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <p className="text-gray-500 text-sm text-center mb-6">
              Nhập mật khẩu quản trị để tiếp tục
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mật khẩu Admin
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={verifyMutation.isPending}
                className="w-full bg-[#0D9488] hover:bg-[#0f766e] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {verifyMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Đăng nhập Admin
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Chỉ dành cho nhân viên được ủy quyền.
              <br />Truy cập trái phép sẽ bị ghi lại.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-4">
          <a href="/" className="text-sm text-gray-500 hover:text-[#0D9488] transition-colors">
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
