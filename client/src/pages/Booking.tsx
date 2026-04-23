import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Booking() {
  const [, params] = useRoute("/booking/:roomId");
  const [, navigate] = useLocation();
  const roomId = params?.roomId ? parseInt(params.roomId) : null;

  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [showAISupport, setShowAISupport] = useState(false);
  const [pauseTimer, setPauseTimer] = useState<NodeJS.Timeout | null>(null);

  const roomQuery = trpc.rooms.getById.useQuery(
    { id: roomId! },
    { enabled: !!roomId }
  );

  const bookingMutation = trpc.bookings.create.useMutation();

  // AI Support Trigger - show after 10 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAISupport(true);
    }, 10000);

    setPauseTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) : value,
    }));

    // Reset AI support timer on input
    if (pauseTimer) clearTimeout(pauseTimer);
    setShowAISupport(false);
    const newTimer = setTimeout(() => {
      setShowAISupport(true);
    }, 10000);
    setPauseTimer(newTimer);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId) {
      toast.error("Phòng không hợp lệ");
      return;
    }

    if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await bookingMutation.mutateAsync({
        roomId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        checkIn: new Date(formData.checkIn),
        checkOut: new Date(formData.checkOut),
        guests: formData.guests,
      });

      toast.success("Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
      navigate("/");
    } catch (error) {
      toast.error("Lỗi khi đặt phòng. Vui lòng thử lại.");
    }
  };

  if (roomQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!roomQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Phòng không tìm thấy</div>
      </div>
    );
  }

  const room = roomQuery.data;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Đặt phòng</h1>
          <p className="text-lg text-gray-600">{room.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Guest Info */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên khách hàng
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
              placeholder="Nhập tên của bạn"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Check-in
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Check-out
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
                required
              />
            </div>
          </div>

          {/* Guests */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số khách
            </label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} khách
                </option>
              ))}
            </select>
          </div>

          {/* AI Support Notification */}
          {showAISupport && (
            <div className="mb-6 p-4 bg-[#0D9488] bg-opacity-10 border-l-4 border-[#0D9488] rounded">
              <p className="text-[#0D9488] font-semibold">
                💡 Bạn cần hỗ trợ? Chúng tôi có thể giúp bạn hoàn tất đặt phòng!
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Nhấn nút chat ở góc dưới phải để trao đổi với AI Assistant của chúng tôi.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={bookingMutation.isPending}
            className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {bookingMutation.isPending ? "Đang xử lý..." : "Xác nhận đặt phòng"}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full mt-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </form>

        {/* Price Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt giá</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Giá phòng/đêm:</span>
              <span className="font-semibold">{room.price.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600">Số đêm:</span>
              <span className="font-semibold">
                {formData.checkIn && formData.checkOut
                  ? Math.ceil(
                      (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 0}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-bold text-gray-900">Tổng cộng:</span>
              <span className="font-bold text-[#F97316]">
                {formData.checkIn && formData.checkOut
                  ? (
                      room.price *
                      Math.ceil(
                        (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    ).toLocaleString("vi-VN")
                  : 0}{" "}
                VND
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
