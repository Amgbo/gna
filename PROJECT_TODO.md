# Hostel Booking Platform - TODO

## Phase 1: Core Foundation
- [x] Create monorepo with backend and frontend folders
- [x] Define PostgreSQL schema for User, Hostel, Room, Booking
- [x] Set up Express server with TypeScript strict mode
- [x] Add auth routes: register/login with JWT + bcrypt
- [x] Add GET /api/hostels with price and distance filtering
- [x] Set up Next.js frontend with Tailwind and Navbar
- [x] Build HostelCard and Home page fetch flow

## Phase 2: Database and Data Flow
- [ ] Apply PostgreSQL schema and first migration
- [ ] Seed PostgreSQL with sample users/hostels/rooms
- [ ] Add API pagination for hostel listing
- [ ] Add sorting support (price ascending/descending, distance)

## Phase 3: Authentication and Security
- [ ] Add JWT auth middleware and protected routes
- [ ] Implement role-based access control (Student/Landlord/Admin)
- [ ] Store password reset and email verification workflows
- [ ] Add rate-limiting and helmet security middleware

## Phase 4: Feature Expansion
- [ ] Add hostel details page and room selection flow
- [ ] Implement booking creation and payment status updates
- [ ] Add landlord dashboard for managing hostels and rooms
- [ ] Add admin panel for hostel verification

## Phase 5: Quality and Deployment
- [ ] Add unit tests for routes and services
- [ ] Add frontend integration tests
- [ ] Add Docker setup for backend, frontend, and PostgreSQL
- [ ] Set up CI pipeline (lint, typecheck, test, build)
- [ ] Deploy backend and frontend environments
