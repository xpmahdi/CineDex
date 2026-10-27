# 🎬 CineDex — Full-Stack TV Show Discovery & Watch Tracker

<p align="center">
  <img src="https://static.tvmaze.com/uploads/images/original_untouched/173/433430.jpg" alt="CineDex Hero Banner" width="100%" style="border-radius: 12px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <a href="https://cinedex-frontend.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_Cloud-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render" alt="Render" />
</p>

---

## 🌟 Project Overview
CineDex is a production-ready, cloud-native full-stack application engineered for television enthusiasts to discover top-rated series, organize watchlists, curate favorite and disliked titles, and automatically compute screen time metrics in real time. The platform completely decouples a static, zero-runtime frontend deployed across the Vercel Edge Network from an asynchronous Python backend built with FastAPI and hosted on Render, backed by a serverless relational PostgreSQL database on Neon Cloud.

---

## 🚀 Key Features
* **Dynamic Cinematic Spotlight:** Features an auto-rotating carousel highlighting spotlight releases with synchronized backdrops, ratings, and high-resolution posters.
* **Smart Screen Time Calculation:** An integrated time tracker engine that calculates total watch time in days, hours, and minutes based on total episode counts of loved series.
* **Triage Lists:** Clean categorization allowing users to organize series into Discover, Watchlist (plan to watch), Loved (watched/favorites), and Hated categories.
* **Full Internationalization (i18n):** Real-time language switching between English (LTR) and Persian (RTL) with adaptive layout mirroring and complete UI localization.
* **Instant Filtering & Pagination:** In-memory client-side search engine providing zero-latency filtering combined with clean pagination controls.
* **Multi-CDN Image Reliability:** Resilient fallback pipelines pulling stable artwork from TVMaze and Amazon CDNs to eliminate hotlinking errors.

---

## 🏗️ Architecture & Technology Stack
* **Frontend:** HTML5, Modern Vanilla JavaScript (ES6+), Tailwind CSS, Font Awesome — deployed on **Vercel Edge Network**.
* **Backend API:** Python 3.11, FastAPI, Uvicorn, Pydantic, CORS Middleware — containerized and hosted on **Render**.
* **Database:** Relational 3NF PostgreSQL schema hosted on **Neon Serverless PostgreSQL**.
* **Networking:** Secure HTTPS transport with optimized headers and zero cross-origin resource sharing latency.

---

## 📡 API Endpoints
* `GET /health` — Health check endpoint verifying backend connectivity and database status.
* `GET /shows` — Retrieves the full catalog of television series including titles, overviews, seasons, episode counts, ratings, and media poster paths.
* `GET /shows/{id}` — Returns detailed metadata for a single specific television show.

---

## ⚡ Local Setup & Execution

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "DATABASE_URL=postgresql://user:pass@ep-xyz.neon.tech/cinedex?sslmode=require" > .env
uvicorn main:app --reload --port 8000
