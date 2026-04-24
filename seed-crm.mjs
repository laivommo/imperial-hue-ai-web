import { createConnection } from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const conn = await createConnection(dbUrl);

// Clear existing CRM data
await conn.execute('DELETE FROM guestProfiles');
await conn.execute('DELETE FROM bookings');

// Seed guest profiles
const guests = [
  { email: 'nguyen.thi.mai@gmail.com', name: 'Nguyễn Thị Mai', phone: '0901234567', totalStays: 3, totalSpend: 6900000, tags: '["VIP","Returning"]', notes: '[2026-01-15] Khách thích phòng view biển, hay đặt vào cuối tuần' },
  { email: 'tran.van.hung@gmail.com', name: 'Trần Văn Hùng', phone: '0912345678', totalStays: 1, totalSpend: 2300000, tags: '["Mới"]', notes: '' },
  { email: 'le.thi.hoa@yahoo.com', name: 'Lê Thị Hoa', phone: '0923456789', totalStays: 5, totalSpend: 15000000, tags: '["VIP","Loyal"]', notes: '[2026-02-10] Khách VIP, luôn đặt phòng Suite. Thích hoa tươi trong phòng.\n[2026-03-20] Đã gửi ưu đãi đặc biệt 20%' },
  { email: 'pham.minh.duc@outlook.com', name: 'Phạm Minh Đức', phone: '0934567890', totalStays: 2, totalSpend: 4600000, tags: '["Returning"]', notes: '[2026-03-01] Khách hay đi công tác, cần hóa đơn VAT' },
  { email: 'hoang.thi.lan@gmail.com', name: 'Hoàng Thị Lan', phone: '0945678901', totalStays: 4, totalSpend: 9200000, tags: '["VIP","Returning"]', notes: '[2026-04-01] Thường đặt phòng cho gia đình 4 người' },
  { email: 'vo.thanh.son@gmail.com', name: 'Võ Thanh Sơn', phone: '0956789012', totalStays: 1, totalSpend: 3200000, tags: '["Mới"]', notes: '' },
  { email: 'dang.thi.thu@gmail.com', name: 'Đặng Thị Thu', phone: '0967890123', totalStays: 7, totalSpend: 21000000, tags: '["VIP","Loyal","Top Spender"]', notes: '[2026-01-05] Khách hàng thân thiết nhất. Luôn đặt Imperial Suite.\n[2026-03-15] Đã tặng quà sinh nhật' },
  { email: 'bui.van.nam@gmail.com', name: 'Bùi Văn Nam', phone: '0978901234', totalStays: 2, totalSpend: 4600000, tags: '["Returning"]', notes: '' },
];

for (const g of guests) {
  const firstVisit = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  const lastVisit = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  await conn.execute(
    'INSERT INTO guestProfiles (email, name, phone, totalStays, totalSpend, tags, notes, firstVisit, lastVisit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [g.email, g.name, g.phone, g.totalStays, g.totalSpend, g.tags, g.notes || null, firstVisit, lastVisit]
  );
  console.log(`Added guest: ${g.name}`);
}

// Seed bookings
const bookings = [
  { roomId: 1, guestName: 'Nguyễn Thị Mai', guestEmail: 'nguyen.thi.mai@gmail.com', guestPhone: '0901234567', checkIn: '2026-04-20', checkOut: '2026-04-22', guests: 2, totalPrice: 2600000, status: 'confirmed' },
  { roomId: 2, guestName: 'Trần Văn Hùng', guestEmail: 'tran.van.hung@gmail.com', guestPhone: '0912345678', checkIn: '2026-04-25', checkOut: '2026-04-27', guests: 2, totalPrice: 2300000, status: 'pending' },
  { roomId: 3, guestName: 'Lê Thị Hoa', guestEmail: 'le.thi.hoa@yahoo.com', guestPhone: '0923456789', checkIn: '2026-05-01', checkOut: '2026-05-05', guests: 2, totalPrice: 9200000, status: 'confirmed' },
  { roomId: 1, guestName: 'Phạm Minh Đức', guestEmail: 'pham.minh.duc@outlook.com', guestPhone: '0934567890', checkIn: '2026-04-28', checkOut: '2026-04-30', guests: 1, totalPrice: 2600000, status: 'pending' },
  { roomId: 4, guestName: 'Hoàng Thị Lan', guestEmail: 'hoang.thi.lan@gmail.com', guestPhone: '0945678901', checkIn: '2026-05-10', checkOut: '2026-05-12', guests: 4, totalPrice: 4600000, status: 'confirmed' },
  { roomId: 5, guestName: 'Đặng Thị Thu', guestEmail: 'dang.thi.thu@gmail.com', guestPhone: '0967890123', checkIn: '2026-04-30', checkOut: '2026-05-03', guests: 2, totalPrice: 9600000, status: 'confirmed' },
  { roomId: 2, guestName: 'Bùi Văn Nam', guestEmail: 'bui.van.nam@gmail.com', guestPhone: '0978901234', checkIn: '2026-04-15', checkOut: '2026-04-17', guests: 2, totalPrice: 2300000, status: 'cancelled' },
  { roomId: 3, guestName: 'Võ Thanh Sơn', guestEmail: 'vo.thanh.son@gmail.com', guestPhone: '0956789012', checkIn: '2026-05-15', checkOut: '2026-05-18', guests: 2, totalPrice: 6900000, status: 'pending' },
  // Historical bookings for chart
  { roomId: 1, guestName: 'Nguyễn Thị Mai', guestEmail: 'nguyen.thi.mai@gmail.com', guestPhone: '0901234567', checkIn: '2026-02-10', checkOut: '2026-02-12', guests: 2, totalPrice: 2600000, status: 'confirmed' },
  { roomId: 2, guestName: 'Lê Thị Hoa', guestEmail: 'le.thi.hoa@yahoo.com', guestPhone: '0923456789', checkIn: '2026-02-20', checkOut: '2026-02-22', guests: 2, totalPrice: 2300000, status: 'confirmed' },
  { roomId: 3, guestName: 'Đặng Thị Thu', guestEmail: 'dang.thi.thu@gmail.com', guestPhone: '0967890123', checkIn: '2026-03-05', checkOut: '2026-03-08', guests: 2, totalPrice: 6900000, status: 'confirmed' },
  { roomId: 4, guestName: 'Hoàng Thị Lan', guestEmail: 'hoang.thi.lan@gmail.com', guestPhone: '0945678901', checkIn: '2026-03-15', checkOut: '2026-03-17', guests: 4, totalPrice: 4600000, status: 'confirmed' },
  { roomId: 5, guestName: 'Phạm Minh Đức', guestEmail: 'pham.minh.duc@outlook.com', guestPhone: '0934567890', checkIn: '2026-03-25', checkOut: '2026-03-27', guests: 1, totalPrice: 6400000, status: 'confirmed' },
];

for (const b of bookings) {
  const checkIn = new Date(b.checkIn);
  const checkOut = new Date(b.checkOut);
  await conn.execute(
    'INSERT INTO bookings (roomId, guestName, guestEmail, guestPhone, checkIn, checkOut, guests, totalPrice, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [b.roomId, b.guestName, b.guestEmail, b.guestPhone, checkIn, checkOut, b.guests, b.totalPrice, b.status]
  );
  console.log(`Added booking: ${b.guestName} - Room ${b.roomId}`);
}

await conn.end();
console.log('CRM seed complete!');
