# Shreyan's Arc ⚡

A premium, interactive Data Structures and Algorithms (DSA) roadmap and progress tracker. Designed with a focus on aesthetics, interactivity, and effective learning flow.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)

## 🌟 Features

### 🗺️ Interactive Infinite Canvas
- **Pan & Zoom**: Navigate the massive roadmap with intuitive drag-to-pan and scroll-to-zoom controls.
- **Touch Support**: Full mobile support with pinch-to-zoom and touch panning.
- **Draggable Nodes**: Customize your view by dragging nodes (enable in Settings).

### 📊 Smart Progress Tracking
- **Granular Tracking**: Mark individual questions as solved.
- **Visual Feedback**:
    - **Node Progress**: Each topic node shows a progress bar and completion percentage.
    - **Global Progress**: Sidebar displays your overall roadmap completion.
    - **Visual Cues**: Nodes glow green when fully completed.

### ☁️ Cloud Sync & Guest Mode
- **Firebase Integration**: Sign in with Google to sync your progress across all your devices.
- **Guest Mode**: Start immediately without logging in; progress is saved locally to your browser.

### 🎨 Premium Aesthetics
- **Dark Mode First**: Sleek, high-contrast dark theme designed for long study sessions.
- **Smooth Animations**: 60fps transitions, hover effects, and modal interactions.
- **Responsive Design**: Optimized for everything from large desktop monitors to mobile phones.

### ⚡ Performance & Engine
- **Optimized Mobile Performance**: Custom touch handling for 60fps panning and zooming on mobile devices.
- **Dynamic Layout Engine**: Node-based architecture with smart connection lines that adapt to layout changes.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN for rapid prototyping)
- **Backend/Auth**: Firebase (Authentication & Firestore)
- **Icons**: Lucide React / Custom SVGs

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd shreyan's-arc
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    - Create a project in the [Firebase Console](https://console.firebase.google.com/).
    - Enable **Authentication** (Google Provider).
    - Enable **Firestore Database**.
    - Copy your web app configuration keys.
    - Open `src/lib/firebase.ts` and replace the placeholder config with your actual keys.

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 📖 Usage Guide

1.  **Navigation**:
    - **Pan**: Click and drag anywhere on the background (or use two fingers on trackpad).
    - **Zoom**: Scroll wheel or pinch gesture.
    - **Reset**: Click the "Reset View" button in the sidebar to return to the default centered view.

2.  **Tracking Progress**:
    - Click on a **Topic Node** (e.g., "Arrays & Hashing") to open the question list.
    - Check the box next to a question to mark it as solved.
    - Click the **LeetCode** link to go directly to the problem.

3.  **Settings**:
    - Open the Settings panel (gear icon) to toggle:
        - **Allow Pan/Zoom**: Lock the view if you prefer a static layout.
        - **Allow Node Dragging**: Enable this to rearrange the graph layout manually.

## 📂 Project Structure

```
shreyan's-arc/
├── src/
│   ├── components/       # React components (Nodes, Modals, Sidebar)
│   ├── data/            # Static data (Roadmap structure, Questions)
│   ├── lib/             # Utilities (Firebase config)
│   ├── App.tsx          # Main canvas & state logic
│   └── index.tsx        # Entry point
├── index.html           # HTML root & Tailwind CDN
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
└── vercel.json          # Vercel configuration
```

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy this app is with [Vercel](https://vercel.com).

1.  **Push your code to GitHub.**
2.  **Import the project into Vercel.**
3.  **Environment Variables**:
    - Add your Firebase configuration keys as environment variables in Vercel (or hardcode them in `src/lib/firebase.ts` if this is a personal project, though env vars are recommended).
4.  **Deploy**: Vercel will automatically detect Vite and build the project.

### Manual Build

To build the project for production:

```bash
npm run build
```

The output will be in the `dist` folder, ready to be served by any static host.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
