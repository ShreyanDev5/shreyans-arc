# 🌌 Shreyan's Arc

An interactive, premium **Data Structures & Algorithms (DSA) Roadmap** and progress tracker. Build your algorithmic foundations and prepare for technical interviews with a gorgeous, fluid, and gamified roadmap.

Built with **React 19**, **TypeScript**, **Vite**, and **Firebase**.

---

## ✨ Features

- **🗺️ Interactive Infinite Canvas** — Smooth panning, zooming, and customizable drag-and-drop node layout editing.
- **📈 Pattern-Based Tracking** — Handpicked, essential questions categorized by core patterns (Easy, Medium, Hard).
- **💾 Auto-Degrading Guest Mode** — Zero-setup required! Runs instantly in guest mode, storing progress locally in your browser (`localStorage`).
- **☁️ Firebase Cloud Sync** — Authenticate securely with Google to sync and save your progress across any device.
- **⚡ Reactive Connections** — Watch your learning path unlock and glow in real-time as you master each topic.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/ShreyanDev5/shreyans-arc.git
cd shreyans-arc
npm install
```

### 2. Configure (Optional)
If you want to enable cloud sync across devices, configure Firebase:
1. Copy `.env.example` to `.env`
2. Fill in your Firebase Project Configuration keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
...
```
*Note: If no `.env` is detected, the app automatically runs in local-first **Guest Mode**.*

### 3. Run Locally
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🛠️ Build & Deployment

### Production Bundle
```bash
# Build the optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

### Deployment
Refer to [DEPLOYMENT.md](file:///c:/Projects/shreyans-arc/DEPLOYMENT.md) for detailed guidelines on launching the project on platforms like Vercel.

---

## 📂 Project Structure

```
├── public/              # Static assets (logo, favicon)
├── src/
│   ├── components/      # UI Modals, Sidebar, and SVG Canvas layers
│   ├── data/            # Layout configurations and questions database
│   ├── lib/             # Third-party integrations (Firebase setup)
│   ├── App.tsx          # Main Canvas coordinator, state management, and events
│   ├── index.tsx        # React entry-point
│   └── vite-env.d.ts    # TypeScript definitions
├── index.html           # Main HTML document and Tailwind play configuration
├── package.json         # Dependencies & scripts
└── tsconfig.json        # TypeScript configuration
```

---
*Inspired by NeetCode.io · Good luck crushing those technical interviews! 🚀*
