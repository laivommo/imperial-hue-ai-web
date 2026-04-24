import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateRoomName } from "@/lib/roomNames";
import { toast } from "sonner";
import UpsellPopup from "@/components/UpsellPopup";
import { Tag, TrendingDown, TrendingUp, Sparkles } from "lucide-react";

export default function Booking() {
  const { t, lang } = useLanguage();
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
  const [showUpsell, setShowUpsell] = useState(false);
  const [completedBookingId, setCompletedBookingId] = useState<number | null>(null);

  const roomQuery = trpc.rooms.getById.useQuery(
    { id: roomId! },
    { enabled: !!roomId }
  );

  // Dynamic pricing - only when dates are selected
  const checkInDate = useMemo(() => formData.checkIn ? new Date(formData.checkIn) : null, [formData.checkIn]);
  const checkOutDate = useMemo(() => formData.checkOut ? new Date(formData.checkOut) : null, [formData.checkOut]);

  const pricingQuery = trpc.pricing.getPrice.useQuery(
    { roomId: roomId!, checkIn: checkInDate!, checkOut: checkOutDate! },
    { enabled: !!roomId && !!checkInDate && !!checkOutDate && checkOutDate > checkInDate }
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
      toast.error(t("booking.invalid_room"));
      return;
    }

    if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      toast.error(t("booking.fill_all_fields"));
      return;
    }

    try {
      const result = await bookingMutation.mutateAsync({
        roomId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        checkIn: new Date(formData.checkIn),
        checkOut: new Date(formData.checkOut),
        guests: formData.guests,
      });

      toast.success(t("booking.success_message"));
      if ((result as any)?.bookingId) {
        setCompletedBookingId((result as any).bookingId);
        setShowUpsell(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(t("booking.error_message"));
    }
  };

  if (roomQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t("common.loading")}</div>
      </div>
    );
  }

  if (!roomQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t("booking.room_not_found")}</div>
      </div>
    );
  }

  const room = roomQuery.data;
  const pricing = pricingQuery.data;
  const hasDiscount = pricing && pricing.multiplier < 100;
  const hasSurcharge = pricing && pricing.multiplier > 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Upsell Popup */}
      {showUpsell && completedBookingId && (
        <UpsellPopup
          bookingId={completedBookingId}
          guestName={formData.guestName}
          roomName={translateRoomName(room.name, lang)}
          checkIn={formData.checkIn}
          checkOut={formData.checkOut}
          guests={formData.guests}
          onClose={() => { setShowUpsell(false); navigate("/"); }}
        />
      )}
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("booking.title")}</h1>
          <p className="text-lg text-gray-600">{translateRoomName(room.name, lang)}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Guest Info */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("booking.guest_name")}
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
              placeholder={t("booking.guest_name_placeholder")}
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
              {t("booking.guests")}
            </label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D9488]"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {t("booking.guest_unit")}
                </option>
              ))}
            </select>
          </div>

          {/* AI Support Notification */}
          {showAISupport && (
            <div className="mb-6 p-4 bg-[#0D9488] bg-opacity-10 border-l-4 border-[#0D9488] rounded">
              <p className="text-[#0D9488] font-semibold">
                {t("booking.ai_support_title")}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {t("booking.ai_support_desc")}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={bookingMutation.isPending}
            className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {bookingMutation.isPending ? t("booking.submitting") : t("booking.confirm_booking")}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full mt-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors"
          >
            {t("booking.go_back")}
          </button>
        </form>

        {/* Dynamic Price Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t("booking.price_summary")}</h3>

          {/* Dynamic pricing badge */}
          {pricing && pricing.appliedRule && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-4 text-sm font-medium ${
              hasDiscount ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {hasDiscount ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              <Tag className="w-3.5 h-3.5" />
              <span>{pricing.appliedRule}</span>
              <span className="ml-auto font-bold">
                {hasDiscount ? `-${100 - pricing.multiplier}%` : `+${pricing.multiplier - 100}%`}
              </span>
            </div>
          )}

          {pricingQuery.isLoading && formData.checkIn && formData.checkOut && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{t("booking.calculating_price")}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("booking.base_price_night")}:</span>
              <span className={`font-semibold ${pricing && pricing.multiplier !== 100 ? 'line-through text-gray-400' : ''}`}>
                {room.price.toLocaleString("vi-VN")} VND
              </span>
            </div>

            {pricing && pricing.multiplier !== 100 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t("booking.dynamic_price")}/{t("booking.night")}:</span>
                <span className={`font-bold ${hasDiscount ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {pricing.finalPrice.toLocaleString("vi-VN")} VND
                </span>
              </div>
            )}

            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600">{t("booking.num_nights")}:</span>
              <span className="font-semibold">
                {pricing ? pricing.nights : (
                  formData.checkIn && formData.checkOut
                    ? Math.max(0, Math.ceil(
                        (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ))
                    : 0
                )}
              </span>
            </div>

            <div className="flex justify-between text-lg">
              <span className="font-bold text-gray-900">{t("booking.total")}:</span>
              <span className="font-bold text-[#F97316]">
                {pricing ? pricing.totalFinal.toLocaleString("vi-VN") : (
                  formData.checkIn && formData.checkOut
                    ? (
                        room.price *
                        Math.max(0, Math.ceil(
                          (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ))
                      ).toLocaleString("vi-VN")
                    : 0
                )}{" "}
                VND
              </span>
            </div>

            {pricing && hasDiscount && (
              <div className="flex justify-between text-sm text-emerald-600 font-medium">
                <span>{t("booking.savings")}:</span>
                <span>-{(pricing.totalBase - pricing.totalFinal).toLocaleString("vi-VN")} VND</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
