import { drizzle } from "drizzle-orm/mysql2";
import { rooms } from "./drizzle/schema";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL!);

const sampleRooms = [
  {
    name: "Phòng Superior",
    description: "Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản. Thích hợp cho khách du lịch cá nhân hoặc cặp đôi muốn tận hưởng không gian ấm cúng tại trung tâm Huế.",
    price: 1200000,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Minibar"]),
  },
  {
    name: "Phòng Deluxe",
    description: "Phòng cao cấp với view đẹp và tiện nghi đầy đủ. Lý tưởng cho các cặp đôi hoặc gia đình nhỏ muốn trải nghiệm lưu trú thoải mái.",
    price: 1500000,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1611432591437-7bc12d7d42d6?w=500&h=400&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Minibar", "Bồn tắm"]),
  },
  {
    name: "Phòng Deluxe Balcony",
    description: "Phòng deluxe với ban công riêng, view thành phố Huế tuyệt đẹp. Hoàn hảo cho kỳ nghỉ lãng mạn và những buổi sáng thư giãn.",
    price: 1700000,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1618883182384-a83a8e7b9b47?w=500&h=400&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Ban công", "Bồn tắm", "Minibar"]),
  },
  {
    name: "Phòng Premier",
    description: "Phòng hạng nhất với thiết kế sang trọng và tiện nghi cao cấp. Thích hợp cho khách VIP và doanh nhân cần không gian làm việc riêng tư.",
    price: 1900000,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=400&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Ban công", "Bồn tắm", "Minibar", "Bàn làm việc"]),
  },
  {
    name: "Phòng Junior Suite",
    description: "Phòng suite với phòng khách riêng rộng rãi. Lý tưởng cho gia đình có trẻ em hoặc nhóm bạn muốn có không gian sinh hoạt chung thoải mái.",
    price: 2300000,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1590080876-a371a6b6d7c5?w=500&h=400&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Ban công", "Bồn tắm", "Minibar", "Phòng khách"]),
  },
  {
    name: "Phòng Imperial Suite",
    description: "Phòng suite hạng nhất với 2 phòng ngủ và phòng khách riêng biệt. Lý tưởng cho gia đình lớn hoặc nhóm du lịch muốn trải nghiệm đẳng cấp nhất.",
    price: 3200000,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1591088398332-8c5ebbf1911c?w=500&h=400&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Ban công", "Bồn tắm", "Minibar", "Phòng khách", "Bếp nhỏ"]),
  },
];

async function seed() {
  console.log("🌱 Seeding rooms...");
  for (const room of sampleRooms) {
    await db.insert(rooms).values(room).onDuplicateKeyUpdate({ set: { name: room.name } });
  }
  console.log("✅ Seeded 6 rooms successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
