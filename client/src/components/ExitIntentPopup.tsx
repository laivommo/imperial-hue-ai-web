import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface ExitIntentPopupProps {
  onClose: () => void;
  lastViewedRoom?: { id: number; name: string; price: number } | null;
}

const COUNTDOWN_SECONDS = 600; // 10 minutes

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function ExitIntentPopup({ onClose, lastViewedRoom }: ExitIntentPopupProps) {
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleClaim = () => {
    handleClose();
    if (lastViewedRoom) {
      navigate(`/room/${lastViewedRoom.id}`);
    } else {
      navigate("/rooms");
    }
  };

  const discountedPrice = lastViewedRoom
    ? Math.round((lastViewedRoom.price * 0.85) / 1000) * 1000
    : null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Top gradient banner */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5 text-white">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
          >
            ×
          </button>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">⏰</span>
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
              Ưu đãi giới hạn
            </span>
          </div>
          <h2 className="text-2xl font-bold leading-tight">
            Khoan đã! Chúng tôi có<br />
            <span className="text-orange-300">ưu đãi đặc biệt</span> cho bạn
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {lastViewedRoom ? (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 mb-1">Phòng bạn đang xem</p>
              <p className="font-bold text-gray-900 text-lg">{lastViewedRoom.name}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-gray-400 line-through text-sm">
                  {lastViewedRoom.price.toLocaleString("vi-VN")} VND
                </span>
                <span className="text-orange-500 font-bold text-xl">
                  {discountedPrice?.toLocaleString("vi-VN")} VND
                </span>
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  -15%
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 mb-1">Ưu đãi đặc biệt hôm nay</p>
              <p className="font-bold text-gray-900 text-lg">Giảm 15% tất cả phòng</p>
              <p className="text-sm text-gray-500 mt-1">Áp dụng khi đặt phòng trong hôm nay</p>
            </div>
          )}

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-sm text-gray-500">Ưu đãi hết hạn sau:</span>
            <div className="bg-gray-900 text-white font-mono font-bold text-xl px-4 py-2 rounded-lg tracking-widest">
              {formatTime(countdown)}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleClaim}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors text-base shadow-lg shadow-orange-200"
          >
            Nhận ưu đãi ngay →
          </button>

          <button
            onClick={handleClose}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            Không, tôi không cần ưu đãi
          </button>
        </div>
      </div>
    </div>
  );
}
