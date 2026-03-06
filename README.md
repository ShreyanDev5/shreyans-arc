# Shreyan's Arc

Interactive DSA roadmap and progress tracker built with React, TypeScript, Vite, and Firebase.

## Features

- Infinite canvas roadmap with pan, zoom, and optional node dragging
- Topic-based question lists with progress tracking
- Local guest progress storage and Firebase sync for signed-in users

## Development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the Firebase values.
3. Start the app with `npm run dev`.

## Build

- `npm run build`
- `npm run preview`

## Environment Variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Project Structure

- `src/App.tsx`: app shell, canvas interaction, auth sync
- `src/components`: UI components
- `src/data`: roadmap content and layout metadata
- `src/lib/firebase.ts`: Firebase setup

Deployment notes are in `DEPLOYMENT.md`.
