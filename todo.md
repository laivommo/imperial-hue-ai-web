# The Imperial Hue - AI Hotel Experience (MVP)

## Database & Backend Setup
- [x] Create Rooms table with fields: id, name, description, price, capacity, image, amenities
- [x] Create Bookings table with fields: id, guestName, guestEmail, roomId, checkIn, checkOut, guests, status
- [x] Create database migrations and apply to database
- [x] Write database query helpers in server/db.ts

## Backend API (tRPC Procedures)
- [x] Create rooms.list procedure to fetch all rooms with filters
- [x] Create rooms.getById procedure to fetch single room details
- [x] Create bookings.create procedure to create new booking
- [x] Create bookings.list procedure for admin to view all bookings
- [x] Create ai.chat procedure to handle AI conversations with LLM integration
- [x] Implement AI context to understand natural language queries and recommend rooms
- [x] Create system.notifyOwner integration for booking confirmations

## Frontend - Layout & Navigation
- [x] Set up global theme with Teal (#0D9488) and Orange (#F97316) colors
- [x] Import and apply Be Vietnam Pro font globally
- [x] Create responsive layout shell with header and footer
- [x] Set up routing structure in App.tsx

## Hero Section
- [x] Design and build Hero Section with background image
- [x] Create AI natural language search input with placeholder text
- [x] Add date picker for check-in/check-out (with fallback UI)
- [x] Add guest count selector
- [x] Implement search button that filters rooms

## Room Gallery
- [x] Create Room Card component with image, name, price, capacity
- [x] Build room amenities display (icons + text)
- [x] Implement grid layout (responsive: 1 col mobile, 2 cols tablet, 3 cols desktop)
- [x] Add hover tooltip with AI-generated suggestions
- [ ] Implement room filtering based on search criteria
- [x] Add click handler to navigate to room details page

## Room Details Page
- [x] Create room detail page layout
- [ ] Build image gallery with multiple photos
- [x] Display full room description
- [x] Show complete amenities list with icons
- [x] Display pricing and availability
- [x] Add booking button that opens booking form

## Booking Form
- [x] Create booking form modal/page
- [x] Add form fields: guest name, email, check-in, check-out, guest count
- [x] Implement form validation
- [x] Add AI support trigger when user pauses on form
- [x] Submit booking and show confirmation
- [x] Trigger owner notification after successful booking

## AI Agent Chatbot
- [x] Create floating bubble component at bottom-right
- [x] Build expandable chat interface
- [x] Implement message history display
- [x] Create message input with send button
- [x] Integrate LLM for natural language understanding
- [x] Implement room recommendation logic based on queries
- [x] Add context awareness (current search filters, selected room, etc.)
- [x] Handle edge cases and provide helpful fallback responses

## Trigger Points & Smart Notifications
- [x] Implement "X people viewing this room" badge on room cards
- [x] Add AI support notification when user pauses on booking form
- [x] Implement exit-intent detection - useExitIntent hook + ExitIntentPopup component
- [x] Add returning visitor greeting message - useVisitorProfile hook + ReturningVisitorBanner

## Mobile Optimization
- [x] Make all components responsive (mobile-first approach)
- [x] Create sticky AI search bar at bottom of mobile screen
- [x] Optimize touch targets and spacing for mobile
- [ ] Test on various screen sizes (320px, 375px, 768px, 1024px)
- [x] Ensure form inputs are mobile-friendly

## Testing & Quality Assurance
- [x] Write vitest tests for backend procedures
- [ ] Test room search and filtering functionality
- [ ] Test booking form submission
- [ ] Test AI chatbot responses
- [ ] Test owner notification system
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile device testing

## Deployment & Handover
- [x] Create initial checkpoint
- [x] Generate demo data (sample rooms, bookings)
- [x] Test full user flow end-to-end
- [ ] Prepare demo for client presentation
- [ ] Document API endpoints and usage
- [ ] Create user guide for admin/owner features

## Redesign theo ảnh thiết kế
- [x] Làm lại Header: logo icon kiến trúc Huế, nav links, nút "Đặt phòng ngay", nút ngôn ngữ VI
- [x] Làm lại Hero Section: ảnh phòng full-width, search box nổi với icon sparkle, date/guest picker layout mới
- [x] Làm lại Features bar: 4 cột icon + text bên dưới hero
- [x] Làm lại Room Card: ảnh lớn, tên+giá cùng hàng, diện tích/giường info, link "Xem chi tiết" màu cam
- [x] Làm lại AI Chatbot: robot avatar dễ thương, panel với shortcuts menu
- [x] Thêm Mobile bottom navigation bar: Home, Rooms, Offers, Gallery, Contact
- [x] Cập nhật màu sắc: nền trắng sáng, accent Teal #0D9488 và Orange #F97316
- [x] Fix ảnh phòng không hiển thị
- [x] Fix bản ghi phòng trùng lặp trong database

## Bug Fixes
- [x] Fix route /rooms trả về 404 - đã tạo trang Rooms.tsx và đăng ký route trong App.tsx
- [x] Fix lỗi path "/" bị escape sai trong App.tsx (path={"\\"} → path="/")

## Menu Pages - Nội dung minh hoạ
- [x] Tạo trang /amenities (Tiện nghi) với danh sách tiện ích khách sạn
- [x] Tạo trang /offers (Ưu đãi) với các gói khuyến mãi
- [x] Tạo trang /explore (Khám phá Huế) với điểm tham quan và ẩm thực
- [x] Tạo trang /about (Giới thiệu) với thông tin khách sạn
- [x] Tạo trang /contact (Liên hệ) với form liên hệ và bản đồ
- [x] Tạo shared SiteHeader component để tái sử dụng trên tất cả trang
- [x] Cập nhật navigation links trong tất cả trang để trỏ đúng route
- [x] Đăng ký tất cả routes mới trong App.tsx

## AI Chatbot Optimization
- [ ] Test AI Chatbot với các câu hỏi mẫu trong trình duyệt
- [ ] Tối ưu system prompt để câu trả lời ngắn gọn, súc tích hơn
- [ ] Cải thiện cách render câu trả lời (bỏ markdown thô, dùng HTML đẹp)
- [ ] Giới hạn độ dài câu trả lời tối đa

## P1 Features - AI Agent Enhancements

### Structured Data (Schema.org SEO)
- [x] Thêm JSON-LD LodgingBusiness schema vào index.html
- [x] Thêm SEO meta tags (title, description, OG, Twitter Card, canonical)
- [x] Thêm BreadcrumbList schema cho navigation
- [x] Thêm WebSite schema với SearchAction

### Exit-Intent Detection & Popup
- [x] Tạo hook useExitIntent để detect chuột di chuyển ra khỏi viewport
- [x] Tạo ExitIntentPopup component với ưu đãi khẩn cấp và countdown timer 10 phút
- [x] Tích hợp dữ liệu phòng đang xem vào popup (cá nhân hóa theo context)
- [x] Thêm logic chỉ hiển thị 1 lần/session (sessionStorage)

### Returning Visitor Recognition
- [x] Tạo hook useVisitorProfile để lưu/đọc profile từ localStorage
- [x] Lưu lịch sử xem phòng, ngày truy cập, số lần ghé thăm
- [x] Tạo ReturningVisitorBanner component chào đích danh khách quay lại
- [x] Hiển thị lại phòng đã xem lần trước trong banner
- [ ] Tích hợp vào AI Chatbot để chatbot nhớ sở thích của khách (P2)

## P2 - CRM Guest Profile Dashboard

### Database & Backend
- [x] Thêm bảng guestProfiles vào schema (email, name, phone, totalStays, totalSpend, tags, notes)
- [x] Thêm bảng behaviorEvents vào schema (sessionId, eventType, pageUrl, roomId, duration)
- [x] Tạo migration SQL và áp dụng vào database
- [x] Tạo CRM API procedures: guests.list, guests.getById, guests.update, guests.addNote
- [x] Tạo analytics procedures: bookings.stats, guests.stats, revenue.summary
- [x] Tự động tạo/cập nhật guestProfile khi có booking mới

### CRM Dashboard Frontend
- [x] Tạo trang /admin/crm với DashboardLayout (sidebar navigation)
- [x] Xây dựng Overview Dashboard: tổng khách, doanh thu, tỷ lệ lấp đầy, booking mới
- [x] Xây dựng trang Danh sách khách hàng với search, filter theo tags, sort
- [x] Xây dựng trang Chi tiết khách hàng: thông tin, lịch sử đặt phòng, ghi chú
- [x] Xây dựng trang Quản lý đặt phòng: danh sách, filter theo trạng thái, ngày
- [x] Thêm biểu đồ doanh thu theo tháng (Recharts)
- [x] Thêm biểu đồ tỷ lệ phòng được đặt
- [x] Thêm nút "Thêm ghi chú" cho từng khách
- [x] Bảo vệ route /admin/* chỉ cho admin truy cập
- [x] Thêm link "Admin" vào header cho owner

## P3 - Dynamic Pricing + AI Upsell + Loyalty Program

### Dynamic Pricing Engine
- [x] Thêm bảng pricingRules vào schema (roomId, ruleType, multiplier, startDate, endDate, minOccupancy)
- [x] Tạo migration SQL và áp dụng vào database
- [x] Viết hàm calculateDynamicPrice(roomId, checkIn, checkOut) trong server/db.ts
- [x] Tạo procedure pricing.getPrice để tính giá động theo ngày/mùa/occupancy
- [x] Tạo procedure pricing.getRules (admin) để xem/quản lý pricing rules
- [x] Tạo procedure pricing.upsertRule (admin) để thêm/sửa pricing rule
- [x] Hiển thị giá động trên Room Card và Room Detail (badge "Giá ưu đãi", "Cao điểm")
- [x] Hiển thị breakdown giá trong Booking Form (giá gốc, hệ số, tổng)

### AI Upsell System
- [x] Thêm bảng upsellServices vào schema (name, description, price, category, icon)
- [x] Thêm bảng upsellOffers vào schema (bookingId, serviceId, status, offeredAt, acceptedAt)
- [x] Tạo migration SQL và áp dụng vào database
- [x] Seed dữ liệu mẫu upsell services (spa, airport transfer, breakfast, room upgrade...)
- [x] Tạo procedure upsell.getRecommendations(bookingId) dùng LLM để gợi ý dịch vụ phù hợp
- [x] Tạo procedure upsell.acceptOffer(offerId) để khách chấp nhận upsell
- [x] Hiển thị Upsell Popup sau khi booking thành công (3 gợi ý AI)
- [x] Thêm Upsell section trong Booking Confirmation page
- [x] Hiển thị upsell revenue trong CRM Dashboard

### Loyalty Program
- [x] Thêm bảng loyaltyAccounts vào schema (userId/guestEmail, points, tier, totalEarned)
- [x] Thêm bảng loyaltyTransactions vào schema (accountId, type, points, description, bookingId)
- [x] Tạo migration SQL và áp dụng vào database
- [x] Logic tích điểm: 1 điểm / 10.000 VND chi tiêu, bonus x2 cho VIP
- [x] Tạo procedure loyalty.getAccount để xem điểm và lịch sử
- [x] Tạo procedure loyalty.getRewards để xem danh sách phần thưởng có thể đổi
- [x] Tạo procedure loyalty.redeemPoints để đổi điểm lấy ưu đãi
- [x] Tự động cộng điểm khi booking được xác nhận
- [x] Tạo trang /loyalty (My Rewards) cho khách đã đăng nhập
- [x] Hiển thị loyalty widget trên header (điểm + hạng thành viên)
- [x] Thêm Loyalty section trong CRM Dashboard (top members, points distribution)
