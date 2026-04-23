import { drizzle } from "drizzle-orm/mysql2";
import { rooms } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL!);

const roomData = [
  {
    name: "Phòng Superior",
    description: "Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản. Thích hợp cho khách du lịch cá nhân hoặc cặp đôi muốn tận hưởng không gian ấm cúng tại trung tâm Huế.",
    price: 1200000,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Minibar"]),
  },
  {
    name: "Phòng Deluxe",
    description: "Phòng cao cấp với view đẹp và tiện nghi đầy đủ. Lý tưởng cho các cặp đôi hoặc gia đình nhỏ muốn trải nghiệm lưu trú thoải mái.",
    price: 1500000,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=450&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Minibar", "Bồn tắm"]),
  },
  {
    name: "Phòng Deluxe Balcony",
    description: "Phòng deluxe với ban công riêng, view thành phố Huế tuyệt đẹp. Hoàn hảo cho kỳ nghỉ lãng mạn và những buổi sáng thư giãn.",
    price: 1700000,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=450&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Ban công", "Bồn tắm", "Minibar"]),
  },
  {
    name: "Phòng Premier",
    description: "Phòng hạng nhất với thiết kế sang trọng và tiện nghi cao cấp. Thích hợp cho khách VIP và doanh nhân cần không gian làm việc riêng tư.",
    price: 1900000,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Ban công", "Bồn tắm", "Minibar"]),
  },
  {
    name: "Phòng Junior Suite",
    description: "Phòng suite với phòng khách riêng rộng rãi. Lý tưởng cho gia đình có trẻ em hoặc nhóm bạn muốn có không gian sinh hoạt chung thoải mái.",
    price: 2300000,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=450&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Ban công", "Bồn tắm", "Minibar", "Phòng khách"]),
  },
  {
    name: "Phòng Imperial Suite",
    description: "Phòng suite hạng nhất với 2 phòng ngủ và phòng khách riêng biệt. Lý tưởng cho gia đình lớn hoặc nhóm du lịch muốn trải nghiệm đẳng cấp nhất.",
    price: 3200000,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=450&fit=crop",
    amenities: JSON.stringify(["WiFi", "TV", "Điều hòa", "Ban công", "Bồn tắm", "Minibar", "Phòng khách"]),
  },
];

async function fixRooms() {
  console.log("🔧 Fixing rooms - deleting all and re-inserting...");
  
  // Delete all existing rooms
  await db.delete(rooms);
  console.log("✅ Deleted all existing rooms");
  
  // Re-insert clean data
  for (const room of roomData) {
    await db.insert(rooms).values(room);
    console.log(`✅ Inserted: ${room.name}`);
  }
  
  console.log("✅ Done! 6 rooms inserted cleanly.");
  process.exit(0);
}

fixRooms().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
