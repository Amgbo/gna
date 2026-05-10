# Student Hostels Platform

A modern full-stack web application for students to browse, compare, and book verified student accommodation near campus.

## Tech Stack

**Backend:**
- Node.js + Express.js (TypeScript)
- PostgreSQL + pg driver (raw SQL queries)
- JWT authentication (jsonwebtoken, bcryptjs)
- Zod for validation

**Frontend:**
- Next.js 14 (App Router, Server & Client Components)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React icons

## Project Structure

```
host/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Express app entry
│   │   ├── config/
│   │   │   ├── db.ts              # PostgreSQL pool
│   │   │   ├── env.ts             # Environment validation
│   │   │   └── prisma.ts          # (deprecated)
│   │   ├── middlewares/
│   │   │   ├── auth.ts            # JWT verification middleware
│   │   │   └── errorHandler.ts    # Error handling
│   │   ├── routes/
│   │   │   ├── auth.ts            # POST /register, /login, GET /me
│   │   │   ├── hostels.ts         # GET /api/hostels, GET /api/hostels/:id
│   │   │   └── bookings.ts        # POST /api/bookings (protected)
│   │   └── types/
│   │       └── user.ts            # User role types
│   ├── sql/
│   │   └── schema.sql             # PostgreSQL schema
│   ├── scripts/
│   │   └── seed.ts                # Database seeding (idempotent)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts
│   │   ├── page.tsx               # Homepage
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Registration page
│   │   └── hostel/[id]/page.tsx   # Hostel details page
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation bar
│   │   ├── HostelCard.tsx          # Hostel listing card
│   │   ├── SearchAndResults.tsx   # Search form + results grid
│   │   └── BookButton.tsx          # Protected booking button
│   ├── types/
│   │   └── hostel.ts              # Hostel & Room types
│   ├── globals.css                # Global styles + Tailwind
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.mjs
└── package.json                    # Root package.json (monorepo)
```

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### 2. Environment Setup

Create `backend/.env`:
```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hostel"
PORT=5000
JWT_SECRET="your-secret-key-min-8-chars"
```

Create `frontend/.env.local` (optional, defaults work for local dev):
```bash
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Apply Database Schema
```bash
# Option 1: Using psql
psql "$DATABASE_URL" -f backend/sql/schema.sql

# Option 2: Copy-paste backend/sql/schema.sql into pgAdmin Query Editor
```

### 5. Seed Sample Data
```bash
cd backend
npm run seed
```

This creates:
- 1 landlord user (`landlord@example.com`, password: `password123`)
- 1 student user (`student@example.com`, password: `password123`)
- 2 sample hostels (Oak Hall, Maple Suites) with 3 rooms

### 6. Start Development Servers

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in (returns JWT)
- `GET /api/auth/me` - Get current user profile (requires token)

### Hostels (Public)
- `GET /api/hostels` - List all hostels with optional filters
  - Query params: `q`, `roomType`, `verified`, `minPrice`, `maxPrice`, `maxDistance`, `sort`
- `GET /api/hostels/:id` - Get single hostel with rooms

### Bookings (Protected)
- `POST /api/bookings` - Create a booking for authenticated student
  - Body: `{ roomId: string }`
  - Returns: `{ id, roomId, status: "PENDING" }`

## Features

### Homepage
- Premium hero section with trust stats
- Live hostel search with advanced filters
- Featured hostel listings as cards
- Clean, responsive design

### Search & Filters
- **Text search** — by hostel name, address, or description
- **Room type** — SINGLE or SHARED
- **Price range** — min and max per semester
- **Distance** — max km from campus
- **Verified only** — toggle to show verified hostels
- **Sorting** — by price (low/high) or distance (near/far)

### Hostel Details
- Hostel name, address, distance, description
- List of available rooms with type, price, available beds
- Book button (protected) to reserve a bed

### Authentication
- Student registration (defaults to STUDENT role)
- JWT-based login with 7-day expiration
- Protected booking endpoint

## Development

### Build Backend
```bash
npm run build -w backend
```

### Build Frontend
```bash
npm run build -w frontend
```

### Run Backend Tests (if added later)
```bash
npm run test -w backend
```

## Database Schema

### Users
- `id` (UUID, PK)
- `email` (text, unique lowercase)
- `password` (hashed with bcryptjs)
- `name` (text)
- `role` (ENUM: STUDENT, LANDLORD, ADMIN)
- `created_at`, `updated_at` (timestamps)

### Hostels
- `id` (UUID, PK)
- `name`, `description`, `address` (text)
- `distance_from_campus` (float)
- `amenities` (JSONB)
- `landlord_id` (FK → users.id)
- `is_verified` (boolean)
- `created_at`, `updated_at` (timestamps)

### Rooms
- `id` (UUID, PK)
- `hostel_id` (FK → hostels.id)
- `type` (ENUM: SINGLE, SHARED)
- `price_per_semester` (numeric 10,2)
- `total_beds`, `available_beds` (integers)
- `created_at`, `updated_at` (timestamps)

### Bookings
- `id` (UUID, PK)
- `student_id` (FK → users.id)
- `room_id` (FK → rooms.id)
- `status` (ENUM: PENDING, PAID, CANCELLED)
- `created_at`, `updated_at` (timestamps)

## Deployment

### Backend (Node.js)
1. Set environment variables in production
2. Build: `npm run build -w backend`
3. Start: `npm start -w backend`
4. Recommended: Use PM2, Docker, or a Node.js hosting service (Render, Railway, Fly.io)

### Frontend (Next.js)
1. Build: `npm run build -w frontend`
2. Start: `npm start -w frontend`
3. Recommended: Deploy to Vercel, Netlify, or Docker

### Database
1. Create PostgreSQL database on managed service (AWS RDS, DigitalOcean, Azure)
2. Run schema: `psql $DATABASE_URL_PROD -f backend/sql/schema.sql`
3. Optionally seed with production data

## Troubleshooting

**Backend won't start:**
- Check `DATABASE_URL` in `.env` is correct
- Verify PostgreSQL is running and accessible
- Check port 5000 is not in use

**Frontend can't reach backend:**
- Verify backend is running on http://localhost:5000
- Check `NEXT_PUBLIC_API_URL` env variable
- Ensure CORS is enabled (it is by default)

**Database schema errors:**
- Use pgAdmin to verify tables exist
- Re-run schema.sql if needed (tables use `IF NOT EXISTS`)

**Seed failed - "relation does not exist":**
- Apply schema first, then run seed

## Future Enhancements

- [ ] Pagination for large hostel lists
- [ ] Filter for minimum available beds
- [ ] Hostel image uploads
- [ ] Student dashboard (my bookings, profile)
- [ ] Landlord dashboard (manage hostels)
- [ ] Admin dashboard (verify hostels, manage users)
- [ ] Email notifications on booking
- [ ] Payment integration
- [ ] Reviews and ratings
- [ ] Advanced search with map view
