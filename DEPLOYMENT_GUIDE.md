# Deployment Guide - Sweet Shop Management System

This guide covers deploying your frontend to **Vercel** and backend to a Node.js hosting service.

---

## Part 1: Backend Deployment (Choose One)

### Option A: Deploy to Railway (Recommended - Easiest)

#### Step 1: Prepare Backend for Railway

1. Ensure your `backend/.env` file is configured correctly:
```env
DATABASE_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV="production"
```

2. Create `backend/.gitignore` (if missing) to exclude node_modules:
```
node_modules/
dist/
.env.local
*.log
```

3. Push your code to GitHub:
```powershell
cd D:\test\Sweet_Shop_management_System
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Set Up Railway Project

1. Go to https://railway.app and sign up (free tier available)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your **dineshkkatariya96/Sweet_Shop_Management_System** repo
4. Choose the **backend** folder as the root directory
5. Railway will auto-detect it's a Node.js project

#### Step 3: Configure Environment Variables on Railway

1. In Railway Dashboard → **Variables**
2. Add these environment variables:
   - `DATABASE_URL`: Railway will provide a PostgreSQL database — use its connection string
   - `JWT_SECRET`: Set a strong secret (e.g., `your-super-secret-key-2024`)
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (Railway assigns port dynamically, but set for compatibility)

#### Step 4: Get Your Backend URL

- After deployment, Railway shows your backend URL (e.g., `https://sweet-shop-backend-prod.railway.app`)
- Save this URL — you'll need it for the frontend

---

### Option B: Deploy to Render

1. Go to https://render.com and sign up
2. Click **New** → **Web Service**
3. Connect your GitHub repo, select `backend` folder
4. Set Environment:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run prisma:generate && npm run prisma:migrate`
   - **Start Command**: `npm run dev` (or `node dist/app.js` if you compile)
5. Add environment variables (DATABASE_URL, JWT_SECRET, NODE_ENV)
6. Deploy — get the service URL (e.g., `https://sweet-shop-backend.onrender.com`)

---

### Option C: Deploy to Heroku (Paid)

1. Install Heroku CLI and login
2. Create app: `heroku create sweet-shop-backend`
3. Set env vars: `heroku config:set DATABASE_URL="..."`
4. Push: `git push heroku main`

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

1. **Update `frontend/.env`** with your **production backend URL**:
```env
VITE_API_BASE_URL=https://sweet-shop-backend-prod.railway.app/api
```
(Replace with your actual backend URL from Part 1)

2. **Verify `frontend/vite.config.ts`** is correctly configured:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
  }
})
```

3. **Check `frontend/package.json`** has build script:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Push Frontend to GitHub

```powershell
cd D:\test\Sweet_Shop_management_System\frontend
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Select **Sweet_Shop_Management_System** repository
4. **Configure Project:**
   - **Framework**: Vite
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables** (important!):
   - Click **Environment Variables**
   - Add: `VITE_API_BASE_URL` = `https://sweet-shop-backend-prod.railway.app/api`
   - (Use your actual backend URL)

6. Click **Deploy**

7. Your site will be available at:
   - `https://your-project-name.vercel.app` (auto-generated)
   - Or custom domain if you configure one

---

## Part 3: Update Backend CORS for Production

After getting your Vercel frontend URL, update backend CORS:

**`backend/src/app.ts`** (add before routes):
```typescript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://your-vercel-app.vercel.app', // production
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

Redeploy backend after this change.

---

## Part 4: Database Setup

### For Railway:
- Railway auto-provisions a PostgreSQL database
- Get the connection string from Railway dashboard
- Set as `DATABASE_URL` environment variable
- Prisma will create tables automatically

### For Other Hosting:
- Provision a PostgreSQL database separately (e.g., ElephantSQL free tier)
- Get connection string: `postgresql://user:pass@host:port/dbname`
- Set as `DATABASE_URL` in environment variables

---

## Part 5: Verification Checklist

- [ ] Backend deployed and running (test with curl or Postman)
- [ ] Database tables created (verify in Prisma Studio or DB admin panel)
- [ ] Frontend deployed to Vercel
- [ ] Frontend can reach backend API (check Network tab in browser DevTools)
- [ ] Login/Register works end-to-end
- [ ] Sweet list loads and displays items
- [ ] Purchase functionality works
- [ ] Admin panel accessible

---

## Part 6: Troubleshooting

### "CORS error" on frontend
- Backend CORS doesn't include your Vercel URL
- Solution: Update `backend/src/app.ts` CORS config and redeploy

### "API not responding" (frontend error)
- Check `VITE_API_BASE_URL` is correct in Vercel env vars
- Verify backend is running: visit `https://backend-url/` in browser
- Backend might be asleep (free tiers pause after inactivity) — wake it up

### "Database connection failed"
- Verify `DATABASE_URL` is set in backend environment variables
- Check PostgreSQL credentials and network access (Railway allows all by default)
- Run migrations manually if needed: connect to prod DB and run migrations

### "Build fails on Vercel"
- Check build logs: Vercel dashboard → Deployments → failed deployment → Logs
- Common issues: missing dependencies, env vars not set during build
- Solution: ensure all imports are correct, run `npm install` locally to verify

---

## Useful Commands

```powershell
# Test backend locally before deploying
cd backend
npm run dev

# Test frontend against production backend locally
# Update frontend/.env to production URL, then:
cd frontend
npm run dev
# Visit http://localhost:5173

# View Vercel deployments
vercel --help

# View Railway logs
# (Use Railway Dashboard web UI)
```

---

## Summary

| Service | Link | What It Does |
|---------|------|-------------|
| **Vercel** | https://vercel.app | Hosts frontend (React app) |
| **Railway** | https://railway.app | Hosts backend (Node/Express API) + PostgreSQL DB |
| **GitHub** | https://github.com | Version control (required for Vercel/Railway integration) |

**Next Steps:**
1. Deploy backend to Railway/Render (get URL)
2. Update frontend `.env` with backend URL
3. Deploy frontend to Vercel
4. Test login/register/purchase flow end-to-end
5. Monitor logs and debug issues

Good luck! 🚀
