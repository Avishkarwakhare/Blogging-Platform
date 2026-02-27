# 🚀 Step-by-Step Deployment Guide

Welcome to your first deployment! We will deploy your backend to **Render** and your frontend to **Vercel**. Both have excellent free tiers.

---

## Phase 1: Prepare Database (MongoDB Atlas)

1.  **Log in** to your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
2.  **Create a New Cluster** (if you haven't already). Use the Free Tier (M0).
3.  **Database Access**: Create a database user with a password. Remember this password!
4.  **Network Access**: Click "Add IP Address" -> Select **"Allow Access from Anywhere"** (0.0.0.0/0). *Important for cloud deployment.*
5.  **Connection String**: Click "Connect" -> "Connect your application" -> Copy the `mongodb+srv://...` URI. Replace `<password>` with your user password.

---

## Phase 2: Backend Deployment (Render)

1.  **Push to GitHub**: Make sure your code is on a GitHub repository.
2.  **Login to Render**: [render.com](https://render.com/).
3.  **New Web Service**: Click "New" -> "Web Service".
4.  **Connect Repo**: Select your `markblog` repository.
5.  **Settings**:
    - **Name**: `markblog-backend`
    - **Environment**: `Node`
    - **Build Command**: `cd backend && npm install`
    - **Start Command**: `cd backend && npm start`
6.  **Environment Variables**: Click "Advanced" -> "Add Environment Variable":
    - `MONGO_URI`: (Your connection string from Phase 1)
    - `JWT_SECRET`: (Any random long string)
    - `OPENROUTER_API_KEY`: (Your key)
    - `NODE_ENV`: `production`
    - `PORT`: `4000`
7.  **Deploy**: Click "Create Web Service". Wait for it to build. Once done, copy your Render URL (e.g., `https://markblog-backend.onrender.com`).

---

## Phase 3: Frontend Deployment (Vercel)

1.  **Login to Vercel**: [vercel.com](https://vercel.com/).
2.  **Add New Project**: Select your `markblog` repository.
3.  **Configure Project**:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `frontend`
4.  **Environment Variables**:
    - `VITE_API_BASE_URL`: Paste your Render URL followed by `/api` (e.g., `https://markblog-backend.onrender.com/api`)
5.  **Deploy**: Click "Deploy". Wait for it to finish. Copy your live Vercel URL (e.g., `https://markblog-frontend.vercel.app`).

---

## Phase 4: Final Connection (CORS)

1.  Go back to your **Render Backend** settings.
2.  Add a new environment variable:
    - `FRONTEND_URL`: (Paste your Vercel URL, e.g., `https://markblog-frontend.vercel.app`)
3.  The backend will automatically redeploy.

---

## ✅ You're Live!
Your blog should now be accessible at your Vercel URL.

**Important Reminders:**
- Always use environment variables for keys.
- Never commit your `.env` files to GitHub.
- If you see a "White Screen", check the browser console (Right-click -> Inspect -> Console).
