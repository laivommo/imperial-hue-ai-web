import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import {
  Users, BookOpen, TrendingUp, Clock, Search, Eye, ChevronLeft,
  Phone, Mail, Calendar, Star, MessageSquare, Home, ArrowLeft,
  CheckCircle, XCircle, AlertCircle, DollarSign, BarChart2, SortAsc, Filter,
  Settings, Lock, LogOut
} from "lucide-react";
import { toast } from "sonner";

type Tab = "overview" | "guests" | "bookings" | "loyalty" | "settings";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVND(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ₫`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ₫`;
  return `${amount.toLocaleString("vi-VN")} ₫`;
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Đã xác nhận</Badge>;
  if (status === "cancelled") return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Đã hủy</Badge>;
  return <Badge className="bg-amber-100 text-amber-700 border-amber-200"><AlertCircle className="w-3 h-3 mr-1" />Chờ xác nhận</Badge>;
}

// ─── Settings Tab ─────────────────────────────────────────────────────
function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = trpc.admin.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Doi mat khau thanh cong!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      sessionStorage.removeItem("imperial_admin_auth");
    },
    onError: (err) => {
      toast.error(err.message || "Doi mat khau that bai");
    },
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mat khau moi khong khop");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Mat khau moi phai co it nhat 8 ky tu");
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("imperial_admin_auth");
    window.location.reload();
  };

  return (
    <div className="max-w-lg space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="w-4 h-4 text-teal-600" />
            Doi mat khau Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mat khau hien tai</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Nhap mat khau hien tai..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mat khau moi</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="It nhat 8 ky tu..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Xac nhan mat khau moi</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhap lai mat khau moi..." required />
            </div>
            <Button type="submit" disabled={changePasswordMutation.isPending} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              {changePasswordMutation.isPending ? "Dang luu..." : "Doi mat khau"}
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-3">Sau khi doi mat khau, ban se can dang nhap lai voi mat khau moi.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LogOut className="w-4 h-4 text-red-500" />
            Phien lam viec
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">Ket thuc phien lam viec admin hien tai.</p>
          <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Dang xuat Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const { data: stats, isLoading } = trpc.crm.stats.useQuery();

  if (isLoading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (!stats) return <div className="text-center text-gray-500 py-12">Không có dữ liệu</div>;

  // Calculate new bookings this month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const newBookingsThisMonth = stats.recentBookings.find(r => r.month === currentMonth)?.count ?? 0;
  // Occupancy rate (confirmed / total)
  const occupancyRate = stats.totalBookings > 0
    ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100)
    : 0;

  const statCards = [
    { label: "Tổng khách hàng", value: stats.totalGuests, icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Booking tháng này", value: newBookingsThisMonth, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Doanh thu xác nhận", value: formatVND(stats.totalRevenue), icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Tỷ lệ xác nhận", value: `${occupancyRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  // Prepare chart data
  const chartData = stats.recentBookings.map(r => ({
    month: r.month,
    "Đặt phòng": r.count,
    "Doanh thu (triệu)": Math.round(r.revenue / 1_000_000),
  }));

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-teal-600" />
                Số đặt phòng theo tháng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="Đặt phòng" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Doanh thu theo tháng (triệu ₫)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Doanh thu (triệu)" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Occupancy / Booking Status Pie Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-teal-600" />
                Tỷ lệ trạng thái đặt phòng
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Đã xác nhận', value: stats.confirmedBookings },
                      { name: 'Chờ xác nhận', value: stats.pendingBookings },
                      { name: 'Đã hủy', value: stats.totalBookings - stats.confirmedBookings - stats.pendingBookings },
                    ].filter(d => d.value > 0)}
                    cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    dataKey="value"
                  >
                    <Cell fill="#0D9488" />
                    <Cell fill="#F97316" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-teal-600 shrink-0" />Đã xác nhận: <b>{stats.confirmedBookings}</b></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />Chờ xác nhận: <b>{stats.pendingBookings}</b></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400 shrink-0" />Đã hủy: <b>{stats.totalBookings - stats.confirmedBookings - stats.pendingBookings}</b></div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center text-gray-500">
            <BarChart2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>Chưa có dữ liệu đặt phòng để hiển thị biểu đồ</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Guest Detail Modal ───────────────────────────────────────────────────────

function GuestDetail({ guestId, onBack }: { guestId: number; onBack: () => void }) {
  const [note, setNote] = useState("");
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.crm.guests.getById.useQuery({ id: guestId });
  const addNoteMutation = trpc.crm.guests.addNote.useMutation({
    onSuccess: () => {
      utils.crm.guests.getById.invalidate({ id: guestId });
      setNote("");
    },
  });

  if (isLoading) return (
    <div className="space-y-4">
      <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
      <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  );

  if (!data) return <div className="text-center text-gray-500 py-12">Không tìm thấy khách hàng</div>;

  const { guest, bookingHistory } = data;
  const tags = guest.tags ? JSON.parse(guest.tags) as string[] : [];

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
        <ChevronLeft className="w-4 h-4" />
        Quay lại danh sách
      </button>

      {/* Guest Info Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {guest.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-800">{guest.name}</h2>
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{guest.email}</div>
                {guest.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{guest.phone}</div>}
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />Lần đầu: {formatDate(guest.firstVisit)} — Lần cuối: {formatDate(guest.lastVisit)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">{guest.totalStays}</p>
              <p className="text-xs text-gray-500">Lần đặt phòng</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{formatVND(guest.totalSpend)}</p>
              <p className="text-xs text-gray-500">Tổng chi tiêu</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{guest.totalStays > 2 ? "VIP" : guest.totalStays > 0 ? "Thường" : "Mới"}</p>
              <p className="text-xs text-gray-500">Phân loại</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            Ghi chú nội bộ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {guest.notes ? (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-line">{guest.notes}</div>
          ) : (
            <p className="text-sm text-gray-400 italic">Chưa có ghi chú</p>
          )}
          <div className="flex gap-2">
            <Textarea
              placeholder="Thêm ghi chú mới..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="text-sm resize-none"
              rows={2}
            />
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 shrink-0"
              disabled={!note.trim() || addNoteMutation.isPending}
              onClick={() => addNoteMutation.mutate({ id: guestId, note })}
            >
              Lưu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Booking History */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600" />
            Lịch sử đặt phòng ({bookingHistory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookingHistory.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4">Chưa có lịch sử đặt phòng</p>
          ) : (
            <div className="space-y-2">
              {bookingHistory.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Phòng #{b.roomId}</p>
                    <p className="text-gray-500 text-xs">{formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.guests} khách</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={b.status} />
                    {b.totalPrice && <p className="text-xs text-gray-500 mt-1">{formatVND(b.totalPrice)}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Guests Tab ───────────────────────────────────────────────────────────────

type SortOption = "lastVisit" | "totalStays" | "totalSpend" | "name";
const TAGS = ["VIP", "Loyal", "Returning", "Mới", "Top Spender"];

function GuestsTab() {
  const [search, setSearch] = useState("");
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("lastVisit");

  // Debounce search
  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((window as any)._searchTimer);
    (window as any)._searchTimer = setTimeout(() => setDebouncedSearch(val), 400);
  };

  const { data: allGuests, isLoading } = trpc.crm.guests.list.useQuery({ search: debouncedSearch || undefined });

  // Client-side tag filter and sort
  const guests = allGuests
    ? allGuests
        .filter(g => {
          if (!tagFilter) return true;
          const tags = g.tags ? JSON.parse(g.tags) as string[] : [];
          return tags.includes(tagFilter);
        })
        .sort((a, b) => {
          if (sortBy === "name") return a.name.localeCompare(b.name);
          if (sortBy === "totalStays") return b.totalStays - a.totalStays;
          if (sortBy === "totalSpend") return b.totalSpend - a.totalSpend;
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        })
    : undefined;

  if (selectedGuestId !== null) {
    return <GuestDetail guestId={selectedGuestId} onBack={() => setSelectedGuestId(null)} />;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm theo tên, email, số điện thoại..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Tag filter + Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <button
            onClick={() => setTagFilter(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!tagFilter ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            Tất cả
          </button>
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${tagFilter === tag ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <SortAsc className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="text-xs border rounded-lg px-2 py-1 text-gray-600 bg-white"
          >
            <option value="lastVisit">Lần ghé gần nhất</option>
            <option value="totalStays">Số lần đặt phòng</option>
            <option value="totalSpend">Chi tiêu cao nhất</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
      </div>

      {/* Guest List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !guests || guests.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>{debouncedSearch ? "Không tìm thấy khách hàng phù hợp" : "Chưa có khách hàng nào trong CRM"}</p>
            <p className="text-xs text-gray-400 mt-1">Khách hàng sẽ được tự động thêm khi đặt phòng</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {guests.map(guest => {
            const tags = guest.tags ? JSON.parse(guest.tags) as string[] : [];
            return (
              <Card
                key={guest.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedGuestId(guest.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold shrink-0">
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">{guest.name}</span>
                        {tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs py-0">{tag}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{guest.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-teal-600">{guest.totalStays} lần</p>
                      <p className="text-xs text-gray-500">{formatVND(guest.totalSpend)}</p>
                    </div>
                    <Eye className="w-4 h-4 text-gray-300 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────────────────────

function BookingsTab() {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const utils = trpc.useUtils();
  const { data: allBookings, isLoading } = trpc.crm.bookings.list.useQuery({ status: statusFilter });

  // Client-side date filter
  const bookings = allBookings?.filter(b => {
    if (!dateFrom && !dateTo) return true;
    const checkIn = new Date(b.checkIn).getTime();
    if (dateFrom && checkIn < new Date(dateFrom).getTime()) return false;
    if (dateTo && checkIn > new Date(dateTo).getTime()) return false;
    return true;
  });;
  const updateStatusMutation = trpc.crm.bookings.updateStatus.useMutation({
    onSuccess: () => {
      utils.crm.bookings.list.invalidate();
      utils.crm.stats.invalidate();
    },
  });

  const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "cancelled", label: "Đã hủy" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Filter tabs + Date range */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="text-xs border rounded-lg px-2 py-1 text-gray-600 bg-white"
          />
          <span className="text-xs text-gray-400">→</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="text-xs border rounded-lg px-2 py-1 text-gray-600 bg-white"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(""); setDateTo(""); }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center text-gray-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>Không có đặt phòng nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {bookings.map(booking => (
            <Card key={booking.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 text-sm">{booking.guestName}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{booking.guestEmail}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Home className="w-3 h-3" />Phòng #{booking.roomId}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{booking.guests} khách</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {booking.totalPrice && (
                      <p className="text-sm font-bold text-orange-500">{formatVND(booking.totalPrice)}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(booking.createdAt)}</p>
                    {/* Quick status actions */}
                    {booking.status === "pending" && (
                      <div className="flex gap-1 mt-2 justify-end">
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: booking.id, status: "confirmed" })}
                          className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                          disabled={updateStatusMutation.isPending}
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: booking.id, status: "cancelled" })}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          disabled={updateStatusMutation.isPending}
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── Loyalty Tab ──────────────────────────────────────────────────────────────
function LoyaltyTab() {
  const topMembersQ = trpc.loyalty.getLeaderboard.useQuery();
  const members = topMembersQ.data ?? [];

  const TIER_LABELS: Record<string, string> = {
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    platinum: "Platinum",
  };
  const TIER_COLORS: Record<string, string> = {
    bronze: "bg-amber-100 text-amber-800",
    silver: "bg-slate-100 text-slate-700",
    gold: "bg-yellow-100 text-yellow-800",
    platinum: "bg-purple-100 text-purple-800",
  };

  // Points distribution by tier
  const tierCounts = members.reduce((acc: Record<string, number>, m: any) => {
    acc[m.tier] = (acc[m.tier] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(tierCounts).map(([tier, count]) => ({
    name: TIER_LABELS[tier] ?? tier,
    value: count,
  }));
  const PIE_COLORS = ["#92400e", "#64748b", "#ca8a04", "#7c3aed"];

  if (topMembersQ.isLoading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["bronze","silver","gold","platinum"].map(tier => {
          const count = tierCounts[tier] ?? 0;
          return (
            <Card key={tier}>
              <CardContent className="p-4 text-center">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-2 ${TIER_COLORS[tier]}`}>
                  <Star className="w-3 h-3" />
                  {TIER_LABELS[tier]}
                </div>
                <div className="text-2xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500">thành viên</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Phân bổ hạng thành viên</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_: any, idx: number) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Chưa có dữ liệu</div>
            )}
          </CardContent>
        </Card>

        {/* Top members leaderboard */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Top thành viên tích điểm</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {members.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Chưa có thành viên</div>
            ) : (
              <div className="divide-y">
                {members.slice(0, 8).map((m: any, idx: number) => (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{m.guestName || m.guestEmail}</div>
                      <div className="text-xs text-gray-400 truncate">{m.guestEmail}</div>
                    </div>
                    <Badge className={`text-xs ${TIER_COLORS[m.tier] ?? ""}`}>{TIER_LABELS[m.tier] ?? m.tier}</Badge>
                    <div className="text-sm font-semibold text-teal-600 whitespace-nowrap">{m.points.toLocaleString()} đ</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// ─── Main CRM Page ────────────────────────────────────────────────────────────

export default function AdminCRM() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Yêu cầu đăng nhập</h2>
          <p className="text-gray-500 mb-4">Vui lòng đăng nhập để truy cập bảng điều khiển admin</p>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => window.location.href = getLoginUrl()}>
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-500 mb-4">Trang này chỉ dành cho admin khách sạn</p>
          <Button variant="outline" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as Tab, label: "Tổng quan", icon: BarChart2 },
    { id: "guests" as Tab, label: "Khách hàng", icon: Users },
    { id: "bookings" as Tab, label: "Đặt phòng", icon: BookOpen },
    { id: "loyalty" as Tab, label: "Loyalty", icon: Star },
    { id: "settings" as Tab, label: "Cài đặt", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Be_Vietnam_Pro',sans-serif]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation("/")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Trang chủ</span>
              </button>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800 text-sm">CRM Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0).toUpperCase() ?? "A"}
              </div>
              <span className="text-sm text-gray-600 hidden sm:inline">{user.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-teal-600 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "guests" && <GuestsTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "loyalty" && <LoyaltyTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
