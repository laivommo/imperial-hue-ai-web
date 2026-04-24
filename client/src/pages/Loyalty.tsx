import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import SiteHeader from "@/components/SiteHeader";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star, Gift, Trophy, TrendingUp, Clock, CheckCircle,
  Crown, Shield, Award,
} from "lucide-react";
import { getLoginUrl } from "@/const";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("vi-VN");
}

export default function LoyaltyPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [redeemId, setRedeemId] = useState<number | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const TIER_CONFIG = {
    bronze: {
      label: "Bronze",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: Shield,
      minPoints: 0,
      nextTier: "silver",
      nextPoints: 5000,
      perks: [t("loyalty.perk_earn_1x"), t("loyalty.perk_birthday_10"), t("loyalty.perk_early_checkin")],
    },
    silver: {
      label: "Silver",
      color: "text-slate-500",
      bg: "bg-slate-50",
      border: "border-slate-200",
      icon: Award,
      minPoints: 5000,
      nextTier: "gold",
      nextPoints: 15000,
      perks: [t("loyalty.perk_earn_1x"), t("loyalty.perk_birthday_15"), t("loyalty.perk_early_checkin_priority"), t("loyalty.perk_late_checkout_14")],
    },
    gold: {
      label: "Gold",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: Trophy,
      minPoints: 15000,
      nextTier: "platinum",
      nextPoints: 50000,
      perks: [t("loyalty.perk_earn_2x"), t("loyalty.perk_birthday_20"), t("loyalty.perk_room_upgrade"), t("loyalty.perk_late_checkout_16"), t("loyalty.perk_free_minibar")],
    },
    platinum: {
      label: "Platinum",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: Crown,
      minPoints: 50000,
      nextTier: null,
      nextPoints: null,
      perks: [t("loyalty.perk_earn_2x"), t("loyalty.perk_birthday_30"), t("loyalty.perk_suite_upgrade"), t("loyalty.perk_flexible_checkin"), t("loyalty.perk_concierge"), t("loyalty.perk_free_spa")],
    },
  } as const;

  const REWARDS = [
    { id: 1, name: t("loyalty.reward_discount_100k"), points: 1000, icon: "💰" },
    { id: 2, name: t("loyalty.reward_breakfast"), points: 2500, icon: "☕" },
    { id: 3, name: t("loyalty.reward_room_upgrade"), points: 4000, icon: "🛏️" },
    { id: 4, name: t("loyalty.reward_airport_transfer"), points: 3000, icon: "🚗" },
    { id: 5, name: t("loyalty.reward_spa_60"), points: 6000, icon: "💆" },
    { id: 6, name: t("loyalty.reward_free_night"), points: 15000, icon: "🏨" },
  ];

  const guestEmail = user?.email ?? "";

  const { data: loyaltyData, isLoading, refetch } = trpc.loyalty.getAccount.useQuery(
    { guestEmail },
    { enabled: !!guestEmail }
  );

  const redeemMutation = trpc.loyalty.redeem.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setRedeemSuccess(result.message);
        setRedeemId(null);
        refetch();
        setTimeout(() => setRedeemSuccess(null), 4000);
      }
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{t("loyalty.title")}</h1>
          <p className="text-gray-500 mb-8">{t("loyalty.login_desc")}</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors">
            {t("loyalty.login_now")}
          </a>
        </div>
      </div>
    );
  }

  const account = loyaltyData?.account;
  const transactions = loyaltyData?.transactions ?? [];
  const tierKey = (account?.tier ?? "bronze") as keyof typeof TIER_CONFIG;
  const tier = TIER_CONFIG[tierKey];
  const TierIcon = tier.icon;

  const progressToNext = tier.nextPoints
    ? Math.min(100, Math.round(((account?.totalEarned ?? 0) - tier.minPoints) / (tier.nextPoints - tier.minPoints) * 100))
    : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Imperial Rewards</h1>
          <p className="text-gray-500">{t("loyalty.subtitle")}</p>
        </div>

        {redeemSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center gap-3 text-emerald-700">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{redeemSuccess}</span>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !account ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center text-gray-500">
              <Star className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium mb-1">{t("loyalty.no_account")}</p>
              <p className="text-sm">{t("loyalty.no_account_desc")}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Tier Card */}
            <div className={`rounded-2xl border-2 p-6 ${tier.bg} ${tier.border}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm">
                    <TierIcon className={`w-8 h-8 ${tier.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">{t("loyalty.tier")}</p>
                    <h2 className={`text-2xl font-bold ${tier.color}`}>{tier.label}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{account.guestName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-0.5">{t("loyalty.current_points")}</p>
                  <p className="text-3xl font-bold text-gray-800">{account.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t("loyalty.total_earned")}: {account.totalEarned.toLocaleString()} {t("loyalty.points_unit")}</p>
                </div>
              </div>

              {/* Progress to next tier */}
              {tier.nextTier && (
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>{tier.label}</span>
                    <span>{TIER_CONFIG[tier.nextTier as keyof typeof TIER_CONFIG].label} ({(tier.nextPoints! - account.totalEarned).toLocaleString()} {t("loyalty.points_more")})</span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${tierKey === 'bronze' ? 'bg-amber-500' : tierKey === 'silver' ? 'bg-slate-400' : 'bg-yellow-500'}`}
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Perks */}
              <div className="mt-4 flex flex-wrap gap-2">
                {tier.perks.map((perk, i) => (
                  <span key={i} className="text-xs bg-white/70 px-2.5 py-1 rounded-full text-gray-600 border border-white/50">
                    ✓ {perk}
                  </span>
                ))}
              </div>
            </div>

            {/* Rewards Grid */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-teal-600" />
                {t("loyalty.redeem_rewards")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {REWARDS.map(reward => {
                  const canRedeem = (account?.points ?? 0) >= reward.points;
                  const isRedeeming = redeemId === reward.id;
                  return (
                    <Card key={reward.id} className={`border-0 shadow-sm transition-all ${canRedeem ? 'hover:shadow-md' : 'opacity-60'}`}>
                      <CardContent className="p-4">
                        <div className="text-3xl mb-3">{reward.icon}</div>
                        <p className="font-semibold text-gray-800 text-sm mb-1">{reward.name}</p>
                        <p className="text-teal-600 font-bold text-lg mb-3">{reward.points.toLocaleString()} {t("loyalty.points_unit")}</p>
                        {isRedeeming ? (
                          <div className="space-y-2">
                            <p className="text-xs text-gray-500">{t("loyalty.confirm_redeem")} {reward.points.toLocaleString()} {t("loyalty.points_unit")}?</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-teal-600 hover:bg-teal-700 text-xs"
                                onClick={() => redeemMutation.mutate({
                                  guestEmail,
                                  points: reward.points,
                                  description: `Redeem: ${reward.name}`,
                                })}
                                disabled={redeemMutation.isPending}
                              >
                                {redeemMutation.isPending ? t("loyalty.processing") : t("loyalty.confirm")}
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setRedeemId(null)}>
                                {t("loyalty.cancel")}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className={`w-full text-xs ${canRedeem ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            onClick={() => canRedeem && setRedeemId(reward.id)}
                            disabled={!canRedeem}
                          >
                            {canRedeem ? t("loyalty.redeem_now") : `${t("loyalty.need_more")} ${(reward.points - (account?.points ?? 0)).toLocaleString()} ${t("loyalty.points_unit")}`}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                {t("loyalty.history")}
              </h3>
              {transactions.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-8 text-center text-gray-400 text-sm">
                    {t("loyalty.no_transactions")}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-50">
                      {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'earn' || tx.type === 'bonus' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                              {tx.type === 'earn' || tx.type === 'bonus'
                                ? <TrendingUp className="w-4 h-4 text-emerald-600" />
                                : <Gift className="w-4 h-4 text-orange-500" />
                              }
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                              <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                            </div>
                          </div>
                          <span className={`font-bold text-sm ${tx.points > 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                            {tx.points > 0 ? '+' : ''}{tx.points.toLocaleString()} {t("loyalty.points_unit")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
