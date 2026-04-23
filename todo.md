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
- [ ] Implement exit-intent detection (optional for MVP)
- [ ] Add returning visitor greeting message

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
