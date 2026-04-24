import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, Sparkles, CheckCircle, ChevronRight, Coffee, Car, Zap, Gift, MapPin, Bike, UtensilsCrossed, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UpsellPopupProps {
  bookingId: number;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee,
  Car,
  Sparkles,
  Gift,
  MapPin,
  Bike,
  UtensilsCrossed,
  ArrowUpCircle,
  Zap,
};

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

const CATEGORY_LABELS: Record<string, string> = {
  room_upgrade: "Nâng cấp phòng",
  food_beverage: "Ăn uống",
  spa: "Spa & Thư giãn",
  transport: "Di chuyển",
  activity: "Hoạt động",
  amenity: "Tiện ích",
};

const CATEGORY_COLORS: Record<string, string> = {
  room_upgrade: "bg-purple-100 text-purple-700",
  food_beverage: "bg-orange-100 text-orange-700",
  spa: "bg-pink-100 text-pink-700",
  transport: "bg-blue-100 text-blue-700",
  activity: "bg-green-100 text-green-700",
  amenity: "bg-teal-100 text-teal-700",
};

export default function UpsellPopup({
  bookingId,
  guestName,
  roomName,
  checkIn,
  checkOut,
  guests,
  onClose,
}: UpsellPopupProps) {
  const [accepted, setAccepted] = useState<Set<number>>(new Set());
  const [declined, setDeclined] = useState<Set<number>>(new Set());
  const [showThankYou, setShowThankYou] = useState(false);

  const { data: recommendations, isLoading } = trpc.upsell.getRecommendations.useQuery({
    bookingId,
    guestName,
    roomName,
    checkIn,
    checkOut,
    guests,
  });

  const createOffersMutation = trpc.upsell.createOffers.useMutation();
  const respondMutation = trpc.upsell.respond.useMutation();

  const handleAccept = async (serviceId: number, index: number) => {
    setAccepted(prev => { const next = new Set(prev); next.add(serviceId); return next; });

    // Create offer if not already created
    if (recommendations) {
      await createOffersMutation.mutateAsync({
        bookingId,
        serviceIds: [serviceId],
        aiReasons: [(recommendations[index] as any)?.aiReason ?? ""],
      });
    }
  };

  const handleDecline = (serviceId: number) => {
    setDeclined(prev => { const next = new Set(prev); next.add(serviceId); return next; });
  };

  const handleDone = () => {
    if (accepted.size > 0) {
      setShowThankYou(true);
      setTimeout(onClose, 2500);
    } else {
      onClose();
    }
  };

  if (showThankYou) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Tuyệt vời!</h3>
          <p className="text-gray-500 text-sm">
            Đã thêm {accepted.size} dịch vụ vào booking của bạn. Chúng tôi sẽ chuẩn bị sẵn sàng khi bạn đến!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-teal-500 to-teal-700 rounded-t-3xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-teal-100 text-xs font-medium">AI Gợi ý đặc biệt</p>
              <h3 className="font-bold text-lg">Nâng tầm trải nghiệm của bạn</h3>
            </div>
          </div>
          <p className="text-teal-100 text-sm">
            Chào {guestName}! Dựa trên booking của bạn, AI đề xuất những dịch vụ sau:
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : !recommendations || recommendations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Không có gợi ý nào lúc này</p>
            </div>
          ) : (
            recommendations.map((svc: any, index: number) => {
              const isAccepted = accepted.has(svc.id);
              const isDeclined = declined.has(svc.id);
              const IconComp = ICON_MAP[svc.icon] ?? Gift;

              return (
                <div
                  key={svc.id}
                  className={`rounded-2xl border-2 p-4 transition-all ${
                    isAccepted
                      ? "border-emerald-200 bg-emerald-50"
                      : isDeclined
                      ? "border-gray-100 bg-gray-50 opacity-50"
                      : "border-gray-100 hover:border-teal-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isAccepted ? "bg-emerald-100" : "bg-teal-50"
                    }`}>
                      <IconComp className={`w-5 h-5 ${isAccepted ? "text-emerald-600" : "text-teal-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{svc.name}</p>
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-0.5 ${CATEGORY_COLORS[svc.category] ?? "bg-gray-100 text-gray-600"}`}>
                            {CATEGORY_LABELS[svc.category] ?? svc.category}
                          </span>
                        </div>
                        <p className="text-teal-600 font-bold text-sm shrink-0">{formatVND(svc.price)}</p>
                      </div>
                      {svc.aiReason && (
                        <p className="text-xs text-gray-500 mt-1.5 italic">
                          ✨ {svc.aiReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isAccepted && !isDeclined && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-xs h-8"
                        onClick={() => handleAccept(svc.id, index)}
                      >
                        Thêm vào booking
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 text-gray-400"
                        onClick={() => handleDecline(svc.id)}
                      >
                        Bỏ qua
                      </Button>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="flex items-center gap-2 mt-3 text-emerald-600 text-xs font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Đã thêm vào booking
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <Button
            className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-xl"
            onClick={handleDone}
          >
            {accepted.size > 0 ? `Hoàn tất (${accepted.size} dịch vụ đã chọn)` : "Bỏ qua, tiếp tục"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Bạn có thể thêm dịch vụ sau khi đến khách sạn
          </p>
        </div>
      </div>
    </div>
  );
}
