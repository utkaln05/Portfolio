# Utkal Nikam — Portfolio

A premium, AI-powered portfolio built with **Next.js 15**, **MongoDB Atlas**, and **Tailwind CSS**. Features a live site editor dashboard with password-protected access, contact form with message storage, and real-time data updates.

## ✨ Features

- 🎨 **5 custom button styles** — Neo-Glow, Cyber Shimmer, Neo-Brutalist, Aero Glass, Magnetic Slide
- 🗄️ **MongoDB Atlas** — portfolio data & contact messages stored in the cloud
- 🔐 **Dashboard editor** at `/dashboard` — edit anything live, syncs globally
- 📬 **Contact form** — saves messages to MongoDB, viewable in dashboard
- 🌙 **Dark mode** — default, premium dark aesthetic
- ⚡ **Turbopack** — lightning-fast dev builds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free tier works)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```





```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002)

## 🛠️ Dashboard

Navigate to `/dashboard` and enter your `DASHBOARD_PASSWORD` to:
- Edit all portfolio content (name, bio, skills, projects, experience)
- Choose your button style
- View contact form messages
- Changes sync to MongoDB instantly — no redeploy needed

**Keyboard shortcut:** Press `Shift + E` to jump to the dashboard.

## 📦 Deploy to Vercel

1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add environment variables: `MONGODB_URI` and `DASHBOARD_PASSWORD`
4. Deploy ✅

> **Important:** In MongoDB Atlas → Network Access → Add `0.0.0.0/0` to allow Vercel connections.

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── contact/route.ts    # Save/fetch contact messages
│   │   └── portfolio/route.ts  # Save/fetch portfolio data
│   ├── dashboard/page.tsx      # Password-protected editor
│   └── page.tsx                # Main portfolio page
├── components/                  # UI sections (Hero, About, Skills, etc.)
├── context/
│   └── PortfolioContext.tsx     # Global state + MongoDB data fetching
└── lib/
    └── mongodb.ts               # MongoDB connection singleton
```

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | React framework with App Router |
| MongoDB Atlas | Database for portfolio data & messages |
| Tailwind CSS | Styling |
| Radix UI | Accessible component primitives |
| Lucide React | Icons |
| TypeScript | Type safety |
