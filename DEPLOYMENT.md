# 🚀 AI-Powered Resume Analyzer - Cloud Deployment Guide

This guide details how to deploy the **FastAPI Backend** and **React Frontend** to production using 100% free cloud tiers (**Render** + **Vercel**).

---

## 🏗️ Architecture Overview

```
[ User Browser ] 
       │
       ├────► Frontend (React + Vite) on Vercel / Render Static
       │      URL: https://resume-analyzer.vercel.app
       │
       └────► Backend (FastAPI + PyMuPDF + Gemini 2.5) on Render
              URL: https://resume-analyzer-backend.onrender.com
```

---

## ⚡ Option 1: 1-Click Blueprints via Render (Recommended)

Render can deploy both the FastAPI Backend and the Vite Frontend together automatically using the provided `render.yaml`.

1. Push your code to GitHub: `https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer`.
2. Open [Render.com](https://dashboard.render.com/) and click **New +** ➔ **Blueprint**.
3. Connect your GitHub repository.
4. Render will detect `render.yaml` and create two services:
   - **`resume-analyzer-backend`** (Python Web Service)
   - **`resume-analyzer-frontend`** (Static Site)
5. Click **Apply**. Render will build and link both services automatically!

---

## ⚡ Option 2: Render (Backend) + Vercel (Frontend)

If you prefer using **Vercel** for the frontend and **Render** for the backend:

### Step 1: Deploy Backend to Render
1. Go to [Render Dashboard](https://dashboard.render.com/) ➔ **New +** ➔ **Web Service**.
2. Connect your GitHub repo: `Shivansh-mishraji/AI-Powered-Resume-Analyzer`.
3. Configure the following settings:
   - **Name:** `resume-ai-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
4. Click **Deploy Web Service**.
5. Once deployed, copy your backend URL (e.g., `https://resume-ai-backend.onrender.com`).

---

### Step 2: Deploy Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) ➔ **Add New...** ➔ **Project**.
2. Import your GitHub repository: `Shivansh-mishraji/AI-Powered-Resume-Analyzer`.
3. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
4. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://resume-ai-backend.onrender.com` (Your Render backend URL from Step 1)
5. Click **Deploy**.
6. Vercel will build and assign your live production URL (e.g., `https://ai-powered-resume-analyzer.vercel.app`).

---

## 🧪 Verification & Testing
Once deployed:
1. Open your live frontend URL.
2. Verify the top right status pill shows `● API Online`.
3. Upload a test PDF resume and test analysis with and without Gemini API key.
4. Verify PDF report export and team modal attribution.

---

## 👥 Maintained by Engineering Team
- **Shivansh Mishra** (`Backend & AI Lead`)
- **Harshvardhan Sisodiya** (`Frontend & UI/UX Lead`)
- **Vishal Patel** (`QA Lead & Security`)
- **Sujeet Kannaujiya** (`Research & Technical Documentation`)
