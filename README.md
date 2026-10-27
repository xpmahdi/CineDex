# 🎬 CineDex — DevOps-Driven Full-Stack TV Show Discovery & Watch Tracker

<p align="center">
  <img src="https://media.wired.com/photos/5926a8cef3e2356fd800a08d/3:2/w_2560%2Cc_limit/Dexter.jpg" alt="Dexter Morgan Banner" width="100%" style="border-radius: 12px; max-height: 420px; object-fit: cover;" />
</p>

<p align="center">
  A cloud-native, DevOps-driven full-stack application built with containerized micro-services, Kubernetes orchestration, and automated CI/CD pipelines.
</p>

<p align="center">
  <a href="https://cinedex-frontend.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?style=for-the-badge&logo=kubernetes" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions" alt="CI/CD" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_Cloud-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
</p>

---

## 🌟 Project Overview
CineDex is a production-grade, DevOps-centric full-stack platform built for television tracking and automated catalog ingestion. Beyond core product capabilities (watchlist curation, screen time computation, and bilingual support), the application is engineered around modern Infrastructure as Code (IaC) and cloud-native practices—featuring multi-stage containerization, declarative Kubernetes cluster management, automated linting, container scanning, and zero-downtime deployment workflows.

---

## 🚀 Key Functional Features
* **Dynamic Cinematic Spotlight:** Auto-rotating carousel highlighting spotlight releases with synchronized backdrops, ratings, and media posters.
* **Smart Screen Time Engine:** Real-time computation of cumulative watch time (days, hours, minutes) based on episode runtimes of completed titles.
* **Triage Lists:** Structured pipelines supporting **Watchlist**, **Loved**, and **Hated** classifications.
* **Bilingual Support (i18n):** Instant switching between English (`LTR`) and Persian (`RTL`) with layout mirroring and interface translation.
* **Resilient Media Engine:** Multi-CDN fallback hierarchy (TVMaze and Amazon CDNs) avoiding hotlinking blocks and rate limits.

---

## 🛠️ DevOps & Infrastructure Architecture

```text
                                  ┌────────────────────────┐
                                  │   GitHub Repository    │
                                  └───────────┬────────────┘
                                              │ Push / PR
                                              ▼
                             ┌─────────────────────────────────┐
                             │    GitHub Actions (CI / CD)     │
                             │  • Flake8 & Pytest Validation   │
                             │  • Multi-stage Docker Builds    │
                             │  • Image Vulnerability Scanning │
                             │  • Automated Deploy to Edge/K8s │
                             └────────┬───────────────┬────────┘
                                      │               │
                    Deploy Artifacts  ▼               ▼ Push Images
           ┌────────────────────────────┐   ┌────────────────────────────┐
           │     Vercel Edge Network    │   │  Container Registry (GHCR) │
           │     (Global CDN Frontend)  │   └──────────────┬─────────────┘
           └────────────────────────────┘                  │
                                                           ▼ Pull & Rollout
                                            ┌────────────────────────────┐
                                            │      Kubernetes Cluster    │
                                            │  • Ingress Controller      │
                                            │  • Deployments & Pods      │
                                            │  • ClusterIP & DNS         │
                                            │  • ConfigMaps & Secrets    │
                                            │  • Liveness/Readiness      │
                                            └──────────────┬─────────────┘
                                                           │ TLS Connection
                                                           ▼
                                            ┌────────────────────────────┐
                                            │   Neon Cloud PostgreSQL    │
                                            │   (Serverless 3NF Storage) │
                                            └────────────────────────────┘
