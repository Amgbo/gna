# OAuth & Security Setup Guide

This guide covers setting up Google OAuth, database schema updates, and security features for gna hostels.

## 1. Google OAuth Setup

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g., "gna-hostels")
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `http://localhost:3000` (development frontend)
     - `http://localhost:3000/register`
     - `http://localhost:3000/login`
     - `https://yourdomain.com` (production frontend)
   - Copy your **Client ID** and **Client Secret**

### Configure Environment Variables

**Backend** (`backend/.env`):
```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 2. Database Schema Update

Apply the enhanced schema with OAuth support:

```bash
# In pgAdmin or psql:
psql $DATABASE_URL -f backend/sql/schema.sql
```

New tables created:
- `oauth_identities`: Stores OAuth provider connections per user
  - Columns: `user_id`, `provider` (google, github, etc.), `provider_user_id`, `access_token`, `refresh_token`
  - Unique index on `(provider, provider_user_id)`

Modified tables:
- `users`: `password` field is now nullable (OAuth users won't have passwords)

## 3. Security Features Implemented

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&)

Frontend shows real-time validation checklist during registration.

### Rate Limiting

Implemented on all auth endpoints:
- **Auth endpoints** (login, register): 5 requests per 15 minutes
- **OAuth endpoints**: 10 requests per 15 minutes
- **General API**: 100 requests per 15 minutes

Add to `backend/src/server.ts`:
```typescript
import { authLimiter } from "./middlewares/rateLimiter";

// Apply to auth routes
router.use("/auth", authLimiter);
```

### SQL Injection Prevention
- All queries use parameterized statements with `$1`, `$2` placeholders
- pg driver automatically escapes parameters

### Password Hashing
- bcryptjs with 10 salt rounds
- Never stored in plain text

### JWT Tokens
- Signed with JWT_SECRET (minimum 8 characters)
- 7-day expiration
- Stores userId and role claims

## 4. Registration Flow

### Email/Password Registration
```
1. User enters name, email, password
2. Frontend validates password against requirements
3. Frontend sends POST /api/auth/register
4. Backend validates with Zod schema
5. Backend checks if email exists (case-insensitive)
6. Backend hashes password with bcryptjs
7. Backend creates user in database
8. Backend generates JWT token
9. Frontend stores token in localStorage
10. User redirected to home page
```

### Google OAuth Registration
```
1. User clicks "Sign up with Google"
2. Google OAuth dialog opens
3. User selects Google account
4. Frontend receives Google ID token
5. Frontend sends POST /api/auth/google with token
6. Backend verifies token with Google Auth Library
7. Backend extracts email, name, googleUserId
8. If OAuth identity exists: return existing user
9. If email exists: link OAuth to existing account
10. If new: create user + OAuth identity record
11. Backend generates JWT token
12. Frontend stores token in localStorage
13. User redirected to home page
```

## 5. Installation & Dependencies

### Backend Dependencies Added
```bash
npm install express-rate-limit google-auth-library
```

### Frontend Dependencies Added
```bash
npm install @react-oauth/google
```

### Install and Run

```bash
# Backend
cd backend
npm install
npm run build
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 6. Testing the Auth Flow

### Test Email/Password Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "MyPassword123!"
  }'
```

### Test Email/Password Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "MyPassword123!"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 7. Production Deployment

### Database
- Use managed PostgreSQL service (RDS, DigitalOcean, Supabase)
- Ensure SSL/TLS connections enabled
- Backup automatically configured

### Environment Variables
- Store in production secrets manager (not in code)
- Examples: Render Secrets, Vercel Environment Variables, AWS Secrets Manager

### OAuth URLs
- Update Google OAuth URIs to production domain
- Add production frontend URL to authorized redirect URIs
- Test with actual domain before going live

### Rate Limiting
- Consider increasing limits if legitimate traffic exceeds thresholds
- Use Redis for distributed rate limiting across multiple servers

## 8. Security Checklist

- [x] Password requirements enforced (8 chars, uppercase, number, special)
- [x] Rate limiting on auth endpoints
- [x] SQL injection prevention (parameterized queries)
- [x] Password hashing with bcryptjs
- [x] JWT tokens with expiration
- [x] OAuth token verification
- [x] Nullable password field (OAuth support)
- [ ] HTTPS/SSL enabled on production
- [ ] CORS configured for trusted domains
- [ ] Email verification (optional future feature)
- [ ] Password reset flow (optional future feature)
- [ ] 2FA support (optional future feature)

## 9. Troubleshooting

### "Google token invalid"
- Check GOOGLE_CLIENT_ID matches frontend token
- Verify token is not expired
- Ensure Google API enabled in Google Cloud Console

### "Rate limit exceeded"
- Wait 15 minutes for rate limit window to reset
- Increase limits in rateLimiter.ts if needed

### "Email already in use"
- User already registered with that email
- For OAuth: system automatically links to existing email if found

### OAuth button not showing
- Check NEXT_PUBLIC_GOOGLE_CLIENT_ID is set in frontend .env.local
- If empty, OAuth provider is skipped (email/password only)

## 10. Future Enhancements

- [ ] GitHub OAuth support
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Social profile data sync (avatar, name updates)
- [ ] Refreshable OAuth tokens
- [ ] Session management (logout, invalidate tokens)
- [ ] 2FA/MFA support
- [ ] Account linking (connect multiple OAuth providers)
