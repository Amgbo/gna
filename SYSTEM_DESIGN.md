# GNA Hostels - System Design Document

## 1. Architecture Overview

### Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: Next.js 15+ (React 19) + Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JWT + OAuth 2.0 (Google)
- **Payment**: Stripe/Paystack/Flutterwave integration
- **Deployment**: Docker + Kubernetes (future)

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│ Frontend Layer (Next.js / React)                        │
│ - Student Portal (Search, Booking, Reviews)            │
│ - Landlord Dashboard (Manage Hostels, Rooms)           │
│ - Admin Panel (Verification, Discounts)                │
└────────────────────────┬────────────────────────────────┘
                         │ REST API / JSON
┌────────────────────────▼────────────────────────────────┐
│ Backend Layer (Express + TypeScript)                    │
│ - Auth Service (JWT, OAuth, Password Reset)            │
│ - Hostel Service (CRUD, Verification)                  │
│ - Booking Service (Reservations, Payments)             │
│ - User Service (Profiles, Roles)                       │
└────────────────────────┬────────────────────────────────┘
                         │ Query / Transactions
┌────────────────────────▼────────────────────────────────┐
│ Data Layer (PostgreSQL)                                 │
│ - Users, Roles, OAuth Identities                       │
│ - Hostels, Rooms, Beds, Amenities                      │
│ - Bookings, Payments, Academic Terms                   │
│ - Reviews, Images, Discounts, Notifications            │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Core Entities & Relationships

### Entity Diagram
```
users (Students/Landlords/Admins)
├── oauth_identities (Google OAuth)
├── hostels (many) [landlord_id FK]
│   ├── rooms (many) [hostel_id FK]
│   │   ├── beds (many) [room_id FK]
│   │   ├── room_amenities (many-to-many)
│   │   └── images (many) [room_id FK]
│   ├── hostel_amenities (many-to-many)
│   ├── images (many) [hostel_id FK]
│   ├── reviews (many) [hostel_id FK]
│   └── discounts (many) [hostel_id FK]
├── bookings (many) [student_id FK]
│   ├── academic_term_id FK
│   ├── booking_items (many) [booking_id FK]
│   │   └── room_id/bed_id FKs
│   └── payments (many) [booking_id FK]
├── reviews (many) [student_id FK]
├── favorites (many) [user_id FK]
├── notifications (many) [user_id FK]
└── roles [role FK]

academic_terms (Semesters/Years)
└── bookings (many) [academic_term_id FK]

amenities (Catalog)
├── hostel_amenities (many-to-many)
└── room_amenities (many-to-many)

maintenance_logs [room_id/bed_id FKs]
```

### Key Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | Auth & profiles | id, email, role, account_status |
| `roles` | RBAC | code (STUDENT, LANDLORD, ADMIN) |
| `hostels` | Listings | id, landlord_id, hostel_status, is_verified |
| `rooms` | Room inventory | id, hostel_id, price_per_semester, verified_by/verified_at |
| `beds` | Bed availability | id, room_id, bed_status |
| `academic_terms` | **NEW** | year, term (1=sem1, 2=sem2) |
| `bookings` | **UPDATED** | id, student_id, academic_term_id, booking_status |
| `booking_items` | Line items | booking_id, room_id, bed_id (flexible room/bed booking) |
| `payments` | Transactions | booking_id, amount, payment_status |
| `reviews` | Feedback | hostel_id, student_id, rating (1-5) |
| `discounts` | Promotions | code, discount_scope (GLOBAL/HOSTEL/ROOM) |

---

## 3. Authentication & Authorization Flow

### OAuth 2.0 (Google Sign-In)
```
1. User clicks "Sign in with Google" on login/register page
2. GoogleLogin component (React) opens Google consent screen
3. Google returns ID token to frontend
4. Frontend POSTs token to `/api/auth/google`
5. Backend verifies token with Google, extracts email/name
6. Backend checks if user exists:
   - YES: Create/update oauth_identity, return JWT
   - NO: Create new user + oauth_identity, return JWT
7. Frontend stores JWT in localStorage
8. All subsequent requests include JWT in Authorization header
```

### JWT-Based Requests
```
Header: Authorization: Bearer <jwt_token>

Backend validates JWT:
- Verify signature
- Check expiration
- Extract user_id from payload
- Check user role and permissions
```

### Role-Based Access Control (RBAC)
```
STUDENT (Default)
├── Browse hostels, filter by price/distance
├── Search hostels by name/location
├── View hostel details, images, reviews
├── Create bookings (academic_term_id required)
├── View own bookings, payments, reviews
├── Leave reviews for booked hostels
├── Add hostels to favorites
└── Manage own profile

LANDLORD
├── All STUDENT permissions
├── Create/edit hostels (pending approval)
├── Upload hostel/room images
├── Manage rooms (create, edit availability)
├── View bookings for own hostels
├── View revenue analytics
├── Respond to reviews
└── Manage amenities for hostels

ADMIN
├── All permissions
├── Verify/reject hostels
├── Verify/reject individual rooms
├── Manage academic terms
├── Apply platform-wide discounts
├── View user audit logs
├── Suspend/delete users or hostels
├── Generate reports
└── Manage payment issues
```

---

## 4. API Endpoints (RESTful)

### Authentication Routes (`/api/auth`)
```
POST   /api/auth/register         - Create student account
POST   /api/auth/login            - Email/password login
POST   /api/auth/google           - Google OAuth sign-in (NEW)
POST   /api/auth/refresh-token    - Refresh expired JWT
POST   /api/auth/logout           - Invalidate token (optional)
POST   /api/auth/forgot-password  - Request reset email
POST   /api/auth/reset-password   - Reset password with token
```

### User Routes (`/api/users`)
```
GET    /api/users/me              - Get logged-in user profile
PATCH  /api/users/me              - Update own profile
PUT    /api/users/:id/role        - Admin: change user role
PUT    /api/users/:id/status      - Admin: suspend/activate user
```

### Hostel Routes (`/api/hostels`)
```
GET    /api/hostels               - List all active hostels (PAGINATED + SORTED)
  Query params:
    - page=1, limit=20
    - sort=price_asc|price_desc|distance_asc|distance_desc
    - price_min=0, price_max=10000
    - distance_max=5 (km)
    - search=query (name/address)

GET    /api/hostels/:id           - Get hostel details + rooms
POST   /api/hostels               - Landlord: create hostel
PATCH  /api/hostels/:id           - Landlord: update own hostel
DELETE /api/hostels/:id           - Landlord: soft-delete hostel

PUT    /api/hostels/:id/verify    - Admin: verify hostel
PUT    /api/hostels/:id/reject    - Admin: reject hostel
GET    /api/hostels/:id/stats     - Landlord: revenue stats
```

### Room Routes (`/api/rooms`)
```
GET    /api/hostels/:hostel_id/rooms - List rooms in hostel
POST   /api/hostels/:hostel_id/rooms - Landlord: create room
PATCH  /api/rooms/:id              - Landlord: update room
DELETE /api/rooms/:id              - Landlord: soft-delete room
PUT    /api/rooms/:id/verify       - Admin: verify individual room

GET    /api/rooms/:id/availability - Get bed availability
```

### Booking Routes (`/api/bookings`)
```
GET    /api/bookings               - Student: list own bookings
GET    /api/bookings/:id           - Get booking details
POST   /api/bookings               - Student: create booking
  Body:
    {
      "academic_term_id": "uuid",
      "hostel_id": "uuid",
      "room_id": "uuid",
      "bed_id": "uuid" (optional),
      "check_in_date": "2026-09-01",
      "check_out_date": "2027-05-31"
    }

PATCH  /api/bookings/:id           - Student/Landlord: update booking
PUT    /api/bookings/:id/cancel    - Student/Landlord: cancel booking
GET    /api/hostels/:id/bookings   - Landlord: view bookings for own hostel
```

### Payment Routes (`/api/payments`)
```
POST   /api/payments/initialize    - Start payment flow
GET    /api/payments/:id           - Get payment status
POST   /api/payments/webhook       - Webhook for payment provider (Stripe/Paystack)
```

### Review Routes (`/api/reviews`)
```
GET    /api/reviews?hostel_id=:id  - Get reviews for hostel
POST   /api/reviews                - Student: post review (must have completed booking)
PATCH  /api/reviews/:id            - Student: update own review
DELETE /api/reviews/:id            - Student: delete own review

PUT    /api/reviews/:id/approve    - Admin: approve review
PUT    /api/reviews/:id/reject     - Admin: reject review
```

### Academic Terms Routes (`/api/academic-terms`)
```
GET    /api/academic-terms         - List all active terms
POST   /api/academic-terms         - Admin: create term
PUT    /api/academic-terms/:id     - Admin: update term
GET    /api/academic-terms/current - Get current active term
```

### Discount Routes (`/api/discounts`)
```
GET    /api/discounts              - List active discounts
POST   /api/discounts/apply        - Apply discount code to booking
POST   /api/discounts              - Admin: create discount
PUT    /api/discounts/:id          - Admin: update discount
```

---

## 5. Data Flow Diagrams

### Hostel Search & Booking Flow
```
1. Student visits home page
   └─> Frontend fetches GET /api/hostels (page=1, limit=20)
       └─> Backend queries hostels with is_active=true, hostel_status=ACTIVE
           └─> Returns paginated results with distance_from_campus

2. Student filters: price 500-2000, distance < 3km
   └─> Frontend fetches GET /api/hostels?price_min=500&price_max=2000&distance_max=3&sort=price_asc
       └─> Backend applies filters + sorting
           └─> Returns filtered results

3. Student clicks hostel card
   └─> Frontend fetches GET /api/hostels/:id
       └─> Backend returns hostel details + rooms + amenities + images
           └─> Frontend displays HostelCard with room options

4. Student selects room, clicks "Book Now"
   └─> Frontend shows booking form (check-in/out dates, academic term)
       └─> User submits POST /api/bookings
           └─> Backend creates booking in PENDING status
               - Sets reservation_expires_at to 24h later
               - Reserves beds/room temporarily
           └─> Frontend redirects to payment

5. Student makes payment
   └─> Frontend calls POST /api/payments/initialize
       └─> Backend redirects to Stripe/Paystack checkout
           └─> Payment provider returns with status
               └─> Webhook updates booking payment_status to PAID
                   └─> Booking status → CONFIRMED
```

### Landlord Hostel Verification Flow
```
1. Landlord creates hostel
   └─> POST /api/hostels
       └─> Backend creates hostel with hostel_status=PENDING_APPROVAL
           └─> Notification sent to admins

2. Admin reviews hostel
   └─> Admin dashboard shows pending hostels
       └─> Admin clicks "Verify" or "Reject"
           └─> PUT /api/hostels/:id/verify or /reject
               └─> Backend updates is_verified=true/false
                   └─> Notification sent to landlord

3. If rooms require individual verification
   └─> Landlord creates room
       └─> Backend creates room with verified_by=NULL
           └─> Admin reviews room via /api/rooms/:id/verify
               └─> Backend updates verified_by, verified_at
```

### Payment & Booking Lifecycle
```
Booking States:
  PENDING
    ↓ (payment initialized)
  AWAITING_PAYMENT
    ↓ (payment received)
  CONFIRMED
    ↓ (check-in date reached)
  CHECKED_IN
    ↓ (check-out date reached)
  CHECKED_OUT
    ↓ (completion)
  COMPLETED
  
  OR at any time → CANCELLED

Payment States:
  PENDING → PROCESSING → PAID (or FAILED/REFUNDED)
```

---

## 6. Security Measures

### Authentication
- ✅ JWT signed with HS256 or RS256
- ✅ Access tokens expire in 15min, refresh tokens in 7 days
- ✅ OAuth 2.0 for Google sign-in with server-side token verification
- ✅ Password hashing with bcrypt (salt rounds: 12)

### Authorization
- ✅ Middleware validates JWT on protected routes
- ✅ RBAC checks user role against endpoint requirements
- ✅ Soft deletes with deleted_at timestamp (data preservation)

### Data Protection
- ✅ HTTPS enforced in production
- ✅ CORS configured to allow only frontend origin
- ✅ SQL injection prevented via parameterized queries
- ✅ Rate limiting (TODO: helmet + express-rate-limit)

### Input Validation
- ✅ Email validation (regex constraint in DB)
- ✅ Price/amount constraints (CHECK constraints)
- ✅ Enum types for statuses (room_status, booking_status, etc.)
- ✅ Check constraints for date ranges, counts

---

## 7. Performance Considerations

### Database Indexes
- ✅ idx_users_email_active (unique, soft-delete aware)
- ✅ idx_hostels_status, idx_hostels_distance_from_campus (for filtering)
- ✅ idx_bookings_student_id, idx_bookings_status (for lookups)
- ✅ idx_bookings_student_term_unique (prevent duplicate bookings per term)
- ✅ Full-text search indexes on hostel name/description (gin_trgm_ops)

### Query Optimization
- ✅ Pagination (limit 20 results per page)
- ✅ Eager loading of relations (rooms, amenities, images)
- ✅ Indexed filter columns (price, distance, status)

### Caching (Future)
- Redis for JWT blacklist (logout)
- Redis for hostel search results (5min TTL)
- Frontend component-level caching (React.memo, useMemo)

---

## 8. Scalability & Deployment

### Backend Scaling
```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                   ┌────────┴────────┐
                   │                 │
              ┌────▼──┐         ┌────▼──┐
              │ Node 1 │ ... │ Node N │
              └────┬──┘         └────┬──┘
                   │                 │
                   └────────┬────────┘
                     ┌──────▼──────┐
                     │ PostgreSQL  │
                     │ (read reps) │
                     └─────────────┘
```

### Docker Compose (Development)
```yaml
services:
  postgres:
    image: postgres:16
    env_file: .env

  backend:
    build: ./backend
    ports: 5000:5000
    depends_on: postgres
    env_file: .env

  frontend:
    build: ./frontend
    ports: 3000:3000
    env_file: .env
```

### Kubernetes (Production)
- Containerized backend + frontend
- StatefulSet for PostgreSQL
- Horizontal Pod Autoscaler for backend
- Ingress for routing + SSL/TLS

---

## 9. Error Handling & Logging

### HTTP Status Codes
```
200 OK - Successful request
201 Created - Resource created
204 No Content - Successful with no response body
400 Bad Request - Invalid input
401 Unauthorized - Missing/invalid JWT
403 Forbidden - User lacks permission
404 Not Found - Resource doesn't exist
409 Conflict - Duplicate booking in term, or stale data
422 Unprocessable Entity - Validation error
500 Internal Server Error - Server bug
503 Service Unavailable - Database down
```

### Error Response Format
```json
{
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "Student already has an active booking for this term",
    "details": {
      "student_id": "uuid",
      "academic_term_id": "uuid"
    }
  }
}
```

### Logging Strategy
- Request/response logs with timestamps
- Error stack traces for debugging
- Audit trail for admin actions (user updates, deletions)
- Payment transaction logs for reconciliation

---

## 10. Feature Roadmap

### Phase 1: Core (Current)
- ✅ User auth (email, OAuth)
- ✅ Hostel CRUD
- ✅ Booking flow
- ✅ Payment integration (stub)
- [ ] Pagination + sorting
- [ ] RBAC middleware

### Phase 2: Enhancement
- [ ] Email verification workflow
- [ ] Password reset flow
- [ ] Hostel verification workflow
- [ ] Review moderation
- [ ] Discount management

### Phase 3: Advanced
- [ ] Landlord analytics dashboard
- [ ] Admin reporting
- [ ] Notification system (in-app + email)
- [ ] Image optimization (CDN)
- [ ] Elasticsearch for full-text search

### Phase 4: Scale
- [ ] Mobile app (React Native)
- [ ] Real-time booking updates (WebSocket)
- [ ] Recommendation engine (ML)
- [ ] Multi-currency support
- [ ] WhatsApp/SMS notifications

---

## 11. Testing Strategy

### Unit Tests
- Auth middleware (JWT validation)
- Service layers (hostel, booking, payment)
- Validation helpers

### Integration Tests
- End-to-end booking flow
- Payment webhook handling
- Database transactions

### E2E Tests
- Login → Search → Book → Pay
- Landlord verification workflow
- Admin approval flow

---

## 12. Known Limitations & TODOs

- [ ] Email sending not yet implemented
- [ ] SMS notifications pending
- [ ] Payment webhook handler needs error retry logic
- [ ] Deployment scripts incomplete
- [ ] CI/CD pipeline not configured
- [ ] Load testing not performed
- [ ] Security audit pending

---

