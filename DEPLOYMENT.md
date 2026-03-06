# Deployment Guide

## Vercel

1. Import the repository into Vercel.
2. Keep the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add the Firebase environment variables from `.env.example`.
4. Deploy.

## Required Environment Variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## After Deploying

1. Add your production domain to Firebase Authentication authorized domains.
2. Run `npm run build` locally if you want to verify the production build before pushing changes.
