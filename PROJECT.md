# Lawyer Platform — Next.js Rebuild

## Goal
Rebuild the lawyer platform (currently React + Vite) as a Next.js full-stack app. Consolidate frontend + backend into a single Vercel deployment with API routes, better SSR/SEO, and seamless Vercel integration. Same user-facing features: auth, lawyer matching, consultation booking, admin dashboard.

## Stack
- **Framework**: Next.js 14+ (App Router, React 18)
- **Styling**: Tailwind CSS + Radix UI (preserve current design system)
- **Database**: MongoDB (kept from backend)
- **Auth**: JWT (NextAuth.js v5 OR manual JWT + cookies)
- **Deployment**: Vercel (single repo, auto-deploy on push)
- **Language**: TypeScript
- **Email**: Nodemailer (if SMTP is configured via env)

## Accounts (resolved via vault)
- **GitHub**: backup6 (repo: backup6/lawyer-platform)
- **Vercel**: backup6 (linked to same GitHub account)
- **MongoDB**: existing credentials (if kept) OR migrate to MongoDB Atlas
- **Google OAuth**: yaashjainn@gmail.com (if social login needed)
- **SMTP**: existing backend config (preserve)

## Scope
- [ ] Create Next.js 14 project structure (app/ directory, API routes)
- [ ] Migrate React pages from frontend/src/pages → app/ with layouts
- [ ] Migrate Redux state → TanStack Query or Zustand (simpler than Redux for this scale)
- [ ] Migrate API calls (axios → fetch or axios in client, API routes handle backend)
- [ ] Create /api/* route handlers to replace backend Express routes (or proxy to existing backend on localhost)
- [ ] Set up NextAuth.js or manual JWT auth via cookies
- [ ] Migrate Tailwind + Radix config
- [ ] Preserve i18n (i18next) setup
- [ ] Remove vite.config.ts, package.json scripts (use next dev/build)
- [ ] Set up .env.local for dev, .env.production for Vercel
- [ ] Test all flows: login, lawyer search, consultation booking, admin panel
- [ ] Deploy to Vercel + verify live

## Deploy
**Target**: Vercel (`vercel --prod`).  
**Domain**: lawyer-platform-vercel.app (or custom if configured).  
**Build command**: `next build`  
**Output**: `.next/` folder.

## Definition of done
- Builds clean (`next build`), 0 TypeScript errors
- Lighthouse ≥ 95 all metrics (or ≥ 90 if API calls are heavy)
- Live at lawyer-platform-vercel.app or configured URL
- Auth flow works (login, register, persist session)
- Lawyer search + filtering works
- Consultation booking works
- Admin dashboard loads and functions
- All routes 404 → index (SPA routing) ✓

## Status log (newest first)
- 2026-08-29 13:30 UTC — Next.js 14 scaffold complete, build clean, old code in _archive/ for reference — Phase 2: feature migration
- 2026-08-29 — React + Vite rebuild attempted (agy timeout), switched to full Next.js migration
