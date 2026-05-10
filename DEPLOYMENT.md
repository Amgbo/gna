# Deployment Guide

This document covers production deployment for the Student Hostels platform.

## Prerequisites

- Backend built: `npm run build -w backend` passes without errors
- Frontend built: `npm run build -w frontend` passes without errors
- Environment files prepared with production values

## Environment Variables

### Backend (`backend/.env` or system env)
```bash
# PostgreSQL connection string (use production database)
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/hostel"

# Server port (default 5000)
PORT=5000

# JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-generated-secret-key-here"

# Optional: log level
LOG_LEVEL="info"
```

### Frontend (`frontend/.env.local` or system env)
```bash
# Backend API URL (production)
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
```

## Database Setup (Production)

1. **Create PostgreSQL database** on your hosted provider:
   - AWS RDS, DigitalOcean, Azure Database, or similar
   - PostgreSQL 12+ recommended
   - Enable SSL/TLS connections

2. **Apply schema**:
   ```bash
   psql "$DATABASE_URL" -f backend/sql/schema.sql
   ```

3. **Seed initial data** (optional):
   ```bash
   npx tsx backend/scripts/seed.ts
   ```

4. **Backup strategy**: Set up automated backups through your database provider

## Backend Deployment

### Option 1: Docker (Recommended)

Create `backend/Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

Build and deploy:
```bash
npm run build -w backend
docker build -t hostel-backend:latest backend/
docker run -e DATABASE_URL="..." -e JWT_SECRET="..." -p 5000:5000 hostel-backend:latest
```

### Option 2: Traditional Node.js Hosting

**Render.com (easiest):**
1. Push code to GitHub
2. Create new Web Service on Render
3. Set build command: `npm install && npm run build -w backend`
4. Set start command: `npm start -w backend`
5. Add environment variables in Render dashboard
6. Deploy

**Railway.app:**
1. Connect GitHub repo
2. Set `NIXPACKS_PAKAGES=postgresql` (for CLI)
3. Add environment variables
4. Deploy

**Fly.io, AWS EC2, DigitalOcean App Platform:** Similar steps with each provider's docs

### Option 3: PM2 on Linux Server

```bash
# SSH into server
ssh user@your-server.com

# Clone repo
git clone https://github.com/yourusername/hostel.git
cd hostel/backend

# Install & build
npm install
npm run build

# Start with PM2
pm2 start dist/server.js --name "hostel-backend"
pm2 save
pm2 startup

# Check logs
pm2 logs hostel-backend
```

## Frontend Deployment

### Option 1: Vercel (Easiest)

1. Push code to GitHub
2. Import project on Vercel
3. Set root directory: `.`
4. Configure build:
   - Build command: `npm run build -w frontend`
   - Output directory: `frontend/.next`
5. Add `NEXT_PUBLIC_API_URL` environment variable
6. Deploy

### Option 2: Netlify

```bash
npm run build -w frontend
# Deploy the frontend/.next folder or use Netlify CLI
netlify deploy --prod --dir=frontend/
```

### Option 3: Docker + Any Host

Create `frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -w frontend

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package.json ./frontend/
EXPOSE 3000
CMD ["npm", "start", "-w", "frontend"]
```

## SSL/TLS Certificates

Most hosting platforms (Vercel, Render, Railway) provide free SSL via Let's Encrypt.

If self-hosting with a domain:
```bash
# Using Let's Encrypt + Certbot
sudo apt update && sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
# Certificates placed in /etc/letsencrypt/live/yourdomain.com/
```

## Reverse Proxy Setup (Nginx)

If running both backend and frontend on one server:

`/etc/nginx/sites-enabled/hostel.conf`:
```nginx
upstream backend {
  server 127.0.0.1:5000;
}

upstream frontend {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  # API routes
  location /api {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
  }
}
```

Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Monitoring & Logging

### Backend Logs
- PM2: `pm2 logs hostel-backend`
- Docker: `docker logs container-id`
- Render: Check Logs tab in dashboard
- Railway: Live logs in dashboard

### Database Monitoring
- Set up automated backups
- Monitor connection count
- Set up query performance alerts (varies by provider)

### Frontend Error Tracking (Optional)
Add Sentry or similar:
```bash
npm install @sentry/nextjs
```

## Performance Optimization

### Backend
- Enable gzip compression (Express middleware)
- Use connection pooling (already done with pg Pool)
- Cache hostels list (Redis optional)

### Frontend
- Static generation with `next export` for faster builds
- Image optimization (Next.js built-in)
- Code splitting (Next.js automatic)

## Backup & Recovery

### Database Backups
- PostgreSQL managed services handle this automatically
- Manual backup: `pg_dump $DATABASE_URL | gzip > backup.sql.gz`
- Restore: `gunzip backup.sql.gz && psql $DATABASE_URL < backup.sql`

### Code Backups
- GitHub repo serves as code backup
- Tag releases: `git tag -a v1.0.0 -m "Production release"`

## Health Checks

Frontend can check backend health:
```bash
curl https://yourdomain.com/api/health
# Response: { "status": "ok" }
```

Set up monitoring to ping `/api/health` periodically.

## Rollback Strategy

1. Keep previous version available (e.g., `backend-v1.0.1`)
2. Use blue-green deployment or feature flags
3. Database migration: test schema changes on staging first

## Scaling

### Database
- Use read replicas for high traffic
- Implement caching layer (Redis)

### Backend
- Run multiple instances behind load balancer
- Use container orchestration (Kubernetes, Docker Swarm)

### Frontend
- CDN for static assets (Cloudflare, AWS CloudFront)
- Server-side caching headers

## Security Checklist

- [ ] HTTPS/SSL enabled on all endpoints
- [ ] Environment secrets not in code (use .env or secrets manager)
- [ ] Database user has minimal required permissions
- [ ] CORS configured correctly
- [ ] Input validation on all endpoints (Zod)
- [ ] Rate limiting (optional: implement with express-rate-limit)
- [ ] Regular security updates (npm audit)
- [ ] Database backups encrypted
- [ ] Logs stored securely

## Support & Troubleshooting

**502 Bad Gateway:** Backend not running or unreachable
- Check backend health: `curl https://api.yourdomain.com/api/health`
- Check logs for crashes

**CORS errors:** Check `NEXT_PUBLIC_API_URL` matches deployed backend URL

**Database connection errors:** Verify `DATABASE_URL`, network access, SSL settings

**Slow queries:** Check PostgreSQL slow query log, add indexes as needed
