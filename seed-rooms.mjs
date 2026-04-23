import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL.split('@')[1].split('/')[0],
  user: process.env.DATABASE_URL.split('://')[1].split(':')[0],
  password: process.env.DATABASE_URL.split(':')[2].split('@')[0],
  database: process.env.DATABASE_URL.split('/').pop(),
});

const rooms = [
  {
    name: 'Phòng Superior',
    description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản. Thích hợp cho khách du lịch cá nhân hoặc cặp đôi.',
    price: 1200000,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop',
    amenities: JSON.stringify(['WiFi', 'TV', 'Coffee Machine']),
  },
  {
    name: 'Phòng Deluxe',
    description: 'Phòng cao cấp với view đẹp và tiện nghi đầy đủ. Lý tưởng cho các cặp đôi hoặc gia đình nhỏ.',
    price: 1500000,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1611432591437-7bc12d7d42d6?w=500&h=400&fit=crop',
    amenities: JSON.stringify(['WiFi', 'TV', 'Coffee Machine', 'Bathtub']),
  },
  {
    name: 'Phòng Deluxe Balcony',
    description: 'Phòng deluxe với ban công riêng, view thành phố Huế. Hoàn hảo cho kỳ nghỉ lãng mạn.',
    price: 1700000,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1618883182384-a83a8e7b9b47?w=500&h=400&fit=crop',
    amenities: JSON.stringify(['WiFi', 'TV', 'Coffee Machine', 'Balcony', 'Bathtub']),
  },
  {
    name: 'Phòng Premier',
    description: 'Phòng hạng nhất với thiết kế sang trọng và tiện nghi cao cấp. Thích hợp cho khách VIP.',
    price: 1900000,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=400&fit=crop',
    amenities: JSON.stringify(['WiFi', 'TV', 'Coffee Machine', 'Balcony', 'Bathtub', 'Minibar']),
  },
  {
    name: 'Phòng Junior Suite',
    description: 'Phòng suite với phòng khách riêng. Lý tưởng cho gia đình hoặc nhóm bạn.',
    price: 2300000,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1590080876-a371a6b6d7c5?w=500&h=400&fit=crop',
    amenities: JSON.stringify(['WiFi', 'TV', 'Coffee Machine', 'Balcony', 'Bathtub', 'Minibar', 'Living Room']),
  },
  {
    name: 'Phòng Imperial Suite',
    description: 'Phòng suite hạng nhất với 2 phòng ngủ và phòng khách. Lý tưởng cho gia đình lớn hoặc nhóm.',
    price: 3200000,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1591088398332-8c5ebbf1911c?w=500&h=400&fit=crop',
    amenities: JSON.stringify(['WiFi', 'TV', 'Coffee Machine', 'Balcony', 'Bathtub', 'Minibar', 'Living Room', 'Kitchen']),
  },
];

for (const room of rooms) {
  await connection.execute(
    'INSERT INTO rooms (name, description, price, capacity, image, amenities) VALUES (?, ?, ?, ?, ?, ?)',
    [room.name, room.description, room.price, room.capacity, room.image, room.amenities]
  );
}

console.log('✅ Seeded 6 rooms successfully!');
await connection.end();
