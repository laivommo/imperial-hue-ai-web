import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const conn = await mysql.createConnection(DATABASE_URL);

// Seed pricing rules
const pricingRules = [
  { name: "Tết Nguyên Đán 2026", ruleType: "seasonal", roomId: null, multiplier: 200, startDate: "2026-01-28", endDate: "2026-02-05", priority: 10, isActive: true },
  { name: "Lễ 30/4 - 1/5", ruleType: "seasonal", roomId: null, multiplier: 170, startDate: "2026-04-29", endDate: "2026-05-02", priority: 9, isActive: true },
  { name: "Hè cao điểm (Jun-Aug)", ruleType: "seasonal", roomId: null, multiplier: 140, startDate: "2026-06-01", endDate: "2026-08-31", priority: 8, isActive: true },
  { name: "Festival Huế 2026", ruleType: "seasonal", roomId: null, multiplier: 160, startDate: "2026-04-25", endDate: "2026-05-03", priority: 9, isActive: true },
  { name: "Ưu đãi đặt sớm (30+ ngày)", ruleType: "earlybird", roomId: null, multiplier: 85, priority: 5, isActive: true },
  { name: "Giá phút chót (≤3 ngày)", ruleType: "lastminute", roomId: null, multiplier: 90, priority: 6, isActive: true },
  { name: "Giảm giá ngày thường (T2-T5)", ruleType: "weekday", roomId: null, multiplier: 90, priority: 3, isActive: true },
];

for (const rule of pricingRules) {
  try {
    await conn.execute(
      `INSERT INTO pricingRules (name, ruleType, roomId, multiplier, startDate, endDate, priority, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [rule.name, rule.ruleType, rule.roomId ?? null, rule.multiplier, rule.startDate ?? null, rule.endDate ?? null, rule.priority, rule.isActive ? 1 : 0]
    );
    console.log("Added pricing rule:", rule.name);
  } catch (e) {
    console.log("Skip (exists):", rule.name, e.message);
  }
}

// Seed upsell services
const upsellServices = [
  { name: "Nâng cấp phòng Suite", description: "Nâng lên phòng Suite rộng rãi hơn với view đẹp hơn", price: 500000, category: "room_upgrade", icon: "ArrowUpCircle" },
  { name: "Bữa sáng cho 2 người", description: "Bữa sáng buffet tại nhà hàng The Imperial cho 2 người", price: 280000, category: "food_beverage", icon: "Coffee" },
  { name: "Gói Spa Thư Giãn 60 phút", description: "Massage toàn thân với tinh dầu thảo mộc Huế truyền thống", price: 650000, category: "spa", icon: "Sparkles" },
  { name: "Đưa đón sân bay", description: "Xe riêng đưa đón sân bay Phú Bài, khứ hồi", price: 350000, category: "transport", icon: "Car" },
  { name: "Tour Hoàng Thành Huế", description: "Tour tham quan Hoàng Thành Huế có hướng dẫn viên, 3 tiếng", price: 450000, category: "activity", icon: "MapPin" },
  { name: "Hoa & Champagne trong phòng", description: "Bình hoa tươi và chai champagne chào đón trong phòng", price: 380000, category: "amenity", icon: "Gift" },
  { name: "Bữa tối lãng mạn tại phòng", description: "Dinner for 2 phục vụ tại phòng với nến và hoa", price: 850000, category: "food_beverage", icon: "UtensilsCrossed" },
  { name: "Thuê xe đạp khám phá Huế", description: "Thuê 2 xe đạp trong 1 ngày để khám phá thành phố", price: 200000, category: "activity", icon: "Bike" },
];

for (const svc of upsellServices) {
  try {
    await conn.execute(
      `INSERT INTO upsellServices (name, description, price, category, icon, isActive)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [svc.name, svc.description, svc.price, svc.category, svc.icon]
    );
    console.log("Added upsell service:", svc.name);
  } catch (e) {
    console.log("Skip (exists):", svc.name, e.message);
  }
}

await conn.end();
console.log("P3 seed complete!");
