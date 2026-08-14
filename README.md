# <img src="public/logo_readme_v7.svg" width="30" height="30" align="center" alt="Logo" /> Shreyan's Arc

An interactive Data Structures & Algorithms (DSA) roadmap and progress tracker featuring 58 curated problems across 17 core patterns.

[Live Demo](https://shreyans-arc.vercel.app)

![Shreyan's Arc Preview](public/readme_home_page.png)

## Features

- **Interactive Canvas:** Pan, zoom, and drag nodes to navigate the visual roadmap.
- **58 Curated Problems:** Handpicked questions categorized across 17 essential DSA patterns.
- **Guest Mode:** Track completion offline instantly with automatic `localStorage` persistence.
- **Cloud Sync:** Sign in with Google to sync progress across devices in real time via Firestore.
- **Direct Practice:** Instant modal with problem difficulty and one-click links to LeetCode.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Backend / Auth:** Firebase (Auth, Cloud Firestore)
- **AI Tooling:** Antigravity
- **Deployment:** Vercel

## Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/ShreyanDev5/shreyans-arc.git
cd shreyans-arc
npm install
```

### 2. Environment Setup (Optional)

The app runs in **Guest Mode** by default. To enable Google Sign-In and Cloud Sync, copy the template and add your Firebase credentials:

- **PowerShell / Bash:** `cp .env.example .env`
- **Command Prompt:** `copy .env.example .env`

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Run Locally

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
```
Production assets are generated in `/dist`.

## Acknowledgments

- Inspired by [NeetCode.io](https://neetcode.io).
