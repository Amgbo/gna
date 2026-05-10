# TODO - Hostel Booking Platform Refactor & UX Cleanup

## Backend
- [x] Refactor `backend/src/routes/hostels.ts` to cleanly separate list vs single-hostel handlers and extract query helpers.

- [ ] Refactor `backend/src/routes/bookings.ts` to extract list/details/creation logic into smaller helper functions.


## Frontend
- [ ] Migrate hostel/detail pages (`frontend/app/hostel/[id]/page.tsx`) to use `frontend/lib/api.ts` (`apiFetch`) for all API calls.
- [ ] Migrate booking pages (`frontend/app/bookings/[id]/page.tsx` and `frontend/app/bookings/page.tsx`) to use `apiFetch`.
- [ ] Migrate dashboard pages to use `apiFetch` and add consistent loading/empty/error states.
- [ ] Apply consistent page layout using existing UI components (`SectionHeader`, `GlassCard`, `StatusBadge`, `LoadingSkeleton`).

## Verification
- [ ] Run backend `npm run` (dev/start or typecheck) and ensure no runtime route wiring issues.
- [ ] Run frontend `next build` (or `npm run lint`) to ensure types/layout changes compile.

