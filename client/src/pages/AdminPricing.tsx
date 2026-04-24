import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tag, TrendingUp, TrendingDown, Plus, Trash2, Edit2, Check, X,
  Sparkles, LayoutDashboard, Users, ShoppingBag, Star
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

function getRuleTypeLabels(lang: string): Record<string, string> {
  return {
    seasonal: lang === "en" ? "Seasonal" : "Theo mùa",
    weekday: lang === "en" ? "Weekday" : "Ngày thường",
    occupancy: lang === "en" ? "Occupancy" : "Tỷ lệ lấp đầy",
    lastminute: lang === "en" ? "Last Minute" : "Phút chót",
    earlybird: lang === "en" ? "Early Bird" : "Đặt sớm",
  };
}

const RULE_TYPE_COLORS: Record<string, string> = {
  seasonal: "bg-purple-100 text-purple-700",
  weekday: "bg-blue-100 text-blue-700",
  occupancy: "bg-orange-100 text-orange-700",
  lastminute: "bg-red-100 text-red-700",
  earlybird: "bg-green-100 text-green-700",
};

function getSidebarItems(lang: string) {
  return [
    { label: "CRM Dashboard", href: "/admin/crm", icon: LayoutDashboard },
    { label: lang === "en" ? "Guests" : "Khách hàng", href: "/admin/crm", icon: Users },
    { label: "Dynamic Pricing", href: "/admin/pricing", icon: Tag },
    { label: "Upsell & Loyalty", href: "/admin/pricing", icon: Star },
  ];
}

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

interface RuleForm {
  id?: number;
  name: string;
  ruleType: string;
  multiplier: number;
  startDate: string;
  endDate: string;
  priority: number;
  isActive: boolean;
}

const DEFAULT_FORM: RuleForm = {
  name: "",
  ruleType: "seasonal",
  multiplier: 120,
  startDate: "",
  endDate: "",
  priority: 5,
  isActive: true,
};

export default function AdminPricing() {
  const { lang } = useLanguage();
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"pricing" | "upsell" | "loyalty">("pricing");
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState<RuleForm>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  const rulesQuery = trpc.pricing.getRules.useQuery();
  const upsellQuery = trpc.upsell.getServices.useQuery();
  const leaderboardQuery = trpc.loyalty.getLeaderboard.useQuery();

  const upsertMutation = trpc.pricing.upsertRule.useMutation({
    onSuccess: () => {
      toast.success(editingId ? (lang === "en" ? "Rule updated" : "Đã cập nhật quy tắc") : (lang === "en" ? "New rule added" : "Đã thêm quy tắc mới"));
      rulesQuery.refetch();
      setShowForm(false);
      setEditForm(DEFAULT_FORM);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.pricing.deleteRule.useMutation({
    onSuccess: () => {
      toast.success(lang === "en" ? "Rule deleted" : "Đã xóa quy tắc");
      rulesQuery.refetch();
    },
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const handleEdit = (rule: any) => {
    setEditingId(rule.id);
    setEditForm({
      id: rule.id,
      name: rule.name,
      ruleType: rule.ruleType,
      multiplier: rule.multiplier,
      startDate: rule.startDate ? new Date(rule.startDate).toISOString().split("T")[0] : "",
      endDate: rule.endDate ? new Date(rule.endDate).toISOString().split("T")[0] : "",
      priority: rule.priority,
      isActive: rule.isActive,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!editForm.name) { toast.error(lang === "en" ? "Please enter rule name" : "Vui lòng nhập tên quy tắc"); return; }
    upsertMutation.mutate({
      id: editingId ?? undefined,
      name: editForm.name,
      ruleType: editForm.ruleType as any,
      multiplier: editForm.multiplier,
      startDate: editForm.startDate ? new Date(editForm.startDate) : null,
      endDate: editForm.endDate ? new Date(editForm.endDate) : null,
      priority: editForm.priority,
      isActive: editForm.isActive,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-3 shrink-0">
        <div className="px-3 mb-6">
          <button onClick={() => navigate("/")} className="text-sm font-bold text-teal-600 hover:text-teal-700">← The Imperial Hue</button>
        </div>
        <nav className="space-y-1">
          {getSidebarItems(lang).map(item => {
            const Icon = item.icon;
            const isActive = item.href === "/admin/pricing";
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Revenue Management</h1>
              <p className="text-gray-500 text-sm mt-0.5">{lang === "en" ? "Manage dynamic pricing, upsell & loyalty" : "Quản lý giá động, upsell và loyalty"}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {(["pricing", "upsell", "loyalty"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "pricing" ? "Pricing Rules" : tab === "upsell" ? "Upsell Services" : "Loyalty Leaderboard"}
              </button>
            ))}
          </div>

          {/* ─── Pricing Rules Tab ─── */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{rulesQuery.data?.length ?? 0} {lang === "en" ? "pricing rules configured" : "quy tắc giá đang cấu hình"}</p>
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 gap-1.5"
                  onClick={() => { setEditForm(DEFAULT_FORM); setEditingId(null); setShowForm(true); }}
                >
                  <Plus className="w-4 h-4" /> {lang === "en" ? "Add Rule" : "Thêm quy tắc"}
                </Button>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <Card className="border-2 border-teal-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{editingId ? (lang === "en" ? "Edit Rule" : "Chỉnh sửa quy tắc") : (lang === "en" ? "Add New Rule" : "Thêm quy tắc mới")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === "en" ? "Rule Name *" : "Tên quy tắc *"}</label>
                        <Input
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          placeholder={lang === "en" ? "e.g. Lunar New Year 2027" : "VD: Tết Nguyên Đán 2027"}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === "en" ? "Rule Type" : "Loại quy tắc"}</label>
                        <select
                          value={editForm.ruleType}
                          onChange={e => setEditForm(f => ({ ...f, ruleType: e.target.value }))}
                          className="w-full h-10 px-3 border border-input rounded-md text-sm bg-background"
                        >
                          {Object.entries(getRuleTypeLabels(lang)).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">
                          {lang === "en" ? "Price Multiplier (%) — 100 = base price" : "Hệ số giá (%) — 100 = giá gốc"}
                        </label>
                        <Input
                          type="number"
                          min={1}
                          max={500}
                          value={editForm.multiplier}
                          onChange={e => setEditForm(f => ({ ...f, multiplier: parseInt(e.target.value) || 100 }))}
                        />
                        <p className={`text-xs mt-1 font-medium ${editForm.multiplier > 100 ? 'text-amber-600' : editForm.multiplier < 100 ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {editForm.multiplier > 100 ? `+${editForm.multiplier - 100}% (${lang === "en" ? "price increase" : "tăng giá"})` : editForm.multiplier < 100 ? `-${100 - editForm.multiplier}% (${lang === "en" ? "discount" : "giảm giá"})` : (lang === "en" ? "Base price" : "Giá gốc")}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === "en" ? "Start Date" : "Ngày bắt đầu"}</label>
                        <Input
                          type="date"
                          value={editForm.startDate}
                          onChange={e => setEditForm(f => ({ ...f, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === "en" ? "End Date" : "Ngày kết thúc"}</label>
                        <Input
                          type="date"
                          value={editForm.endDate}
                          onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === "en" ? "Priority (higher = more priority)" : "Độ ưu tiên (cao hơn = ưu tiên hơn)"}</label>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          value={editForm.priority}
                          onChange={e => setEditForm(f => ({ ...f, priority: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.isActive}
                            onChange={e => setEditForm(f => ({ ...f, isActive: e.target.checked }))}
                            className="w-4 h-4 accent-teal-600"
                          />
                          <span className="text-sm font-medium text-gray-700">{lang === "en" ? "Enable Rule" : "Kích hoạt quy tắc"}</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 gap-1.5"
                        onClick={handleSave}
                        disabled={upsertMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
                        {upsertMutation.isPending ? (lang === "en" ? "Saving..." : "Đang lưu...") : (lang === "en" ? "Save Rule" : "Lưu quy tắc")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setShowForm(false); setEditForm(DEFAULT_FORM); setEditingId(null); }}
                      >
                        <X className="w-4 h-4" /> {lang === "en" ? "Cancel" : "Hủy"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rules list */}
              {rulesQuery.isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-50">
                      {rulesQuery.data?.map(rule => (
                        <div key={rule.id} className={`flex items-center gap-4 px-5 py-4 ${!rule.isActive ? 'opacity-50' : ''}`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-800 text-sm">{rule.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${RULE_TYPE_COLORS[rule.ruleType] ?? 'bg-gray-100 text-gray-600'}`}>
                                {getRuleTypeLabels(lang)[rule.ruleType] ?? rule.ruleType}
                              </span>
                              {!rule.isActive && <span className="text-xs text-gray-400">{lang === "en" ? "Off" : "Tắt"}</span>}
                            </div>
                            <p className="text-xs text-gray-400">
                              {lang === "en" ? "Priority" : "Độ ưu tiên"}: {rule.priority}
                              {rule.startDate && rule.endDate && ` · ${new Date(rule.startDate).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN")} – ${new Date(rule.endDate).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN")}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`text-right`}>
                              <p className={`text-lg font-bold ${rule.multiplier > 100 ? 'text-amber-600' : rule.multiplier < 100 ? 'text-emerald-600' : 'text-gray-600'}`}>
                                {rule.multiplier > 100 ? <TrendingUp className="inline w-4 h-4 mr-1" /> : <TrendingDown className="inline w-4 h-4 mr-1" />}
                                {rule.multiplier}%
                              </p>
                              <p className="text-xs text-gray-400">
                                {rule.multiplier > 100 ? `+${rule.multiplier - 100}%` : `-${100 - rule.multiplier}%`}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(rule)}>
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => deleteMutation.mutate({ id: rule.id })}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* ─── Upsell Services Tab ─── */}
          {activeTab === "upsell" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{upsellQuery.data?.length ?? 0} {lang === "en" ? "active upsell services" : "dịch vụ upsell đang hoạt động"}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upsellQuery.isLoading ? (
                  [...Array(6)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />)
                ) : (
                  upsellQuery.data?.map(svc => (
                    <Card key={svc.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm mb-0.5">{svc.name}</p>
                            <p className="text-xs text-gray-500 mb-2">{svc.description}</p>
                            <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{svc.category}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-teal-600 text-sm">{formatVND(svc.price)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ─── Loyalty Leaderboard Tab ─── */}
          {activeTab === "loyalty" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{lang === "en" ? "Top 10 guests with most loyalty points" : "Top 10 khách hàng tích điểm nhiều nhất"}</p>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-50">
                    {leaderboardQuery.isLoading ? (
                      [...Array(5)].map((_, i) => <div key={i} className="h-14 mx-5 my-2 bg-gray-100 rounded-xl animate-pulse" />)
                    ) : leaderboardQuery.data?.length === 0 ? (
                      <div className="py-10 text-center text-gray-400 text-sm">{lang === "en" ? "No loyalty data yet" : "Chưa có dữ liệu loyalty"}</div>
                    ) : (
                      leaderboardQuery.data?.map((acc, idx) => {
                        const tierColors: Record<string, string> = {
                          bronze: "text-amber-700 bg-amber-50",
                          silver: "text-slate-500 bg-slate-50",
                          gold: "text-yellow-600 bg-yellow-50",
                          platinum: "text-purple-600 bg-purple-50",
                        };
                        return (
                          <div key={acc.id} className="flex items-center gap-4 px-5 py-3.5">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">{acc.guestName}</p>
                              <p className="text-xs text-gray-400">{acc.guestEmail}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800 text-sm">{acc.points.toLocaleString()} {lang === "en" ? "pts" : "điểm"}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[acc.tier] ?? 'bg-gray-100 text-gray-600'}`}>
                                {acc.tier.charAt(0).toUpperCase() + acc.tier.slice(1)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
