# Deployment Guide for Shreyan's Arc

This guide provides step-by-step instructions to deploy your Vite + React project.

## Recommended Platform: Vercel

**Vercel** is the best choice for this project because it has zero-configuration support for Vite and React, provides a global CDN, and offers a generous free tier.

### Prerequisites
1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account (you can sign up with GitHub).
3.  Your project pushed to a GitHub repository.

### Step-by-Step Instructions

1.  **Push to GitHub**
    If you haven't already, push your local code to a GitHub repository:
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    # Create a new repo on GitHub, then run the commands shown there, e.g.:
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/shreyans-arc.git
    git push -u origin main
    ```

2.  **Import into Vercel**
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Find your `shreyans-arc` repository and click **"Import"**.

3.  **Configure Project**
    Vercel will automatically detect that this is a **Vite** project.
    *   **Framework Preset**: `Vite` (should be auto-selected).
    *   **Root Directory**: `./` (default).
    *   **Build Command**: `vite build` (default).
    *   **Output Directory**: `dist` (default).

4.  **Environment Variables**
    Your `vite.config.ts` references `GEMINI_API_KEY`. Even if not currently used in `src`, it's best to define it to avoid build warnings or future runtime errors.
    *   Expand the **"Environment Variables"** section.
    *   Key: `GEMINI_API_KEY`
    *   Value: `your_actual_api_key_here`
    *   Click **Add**.

    > **Note on Firebase**: Your `src/lib/firebase.ts` currently contains hardcoded configuration. This works fine, but for better security in the future, consider moving these values to Environment Variables (e.g., `VITE_FIREBASE_API_KEY`) and accessing them via `import.meta.env`.

5.  **Deploy**
    *   Click **"Deploy"**.
    *   Vercel will build your project. Wait for a minute.
    *   Once done, you'll get a live URL (e.g., `https://shreyans-arc.vercel.app`).

### Optional: `vercel.json` Configuration
Vercel usually handles Single Page Applications (SPAs) automatically. However, if you encounter 404 errors when refreshing on non-root pages, create a `vercel.json` file in your root directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Alternative: Netlify

**Netlify** is another excellent choice with similar features.

1.  **Push to GitHub** (same as above).
2.  **Log in to Netlify** and click **"Add new site"** -> **"Import an existing project"**.
3.  **Select GitHub** and choose your repository.
4.  **Build Settings**:
    *   **Build command**: `vite build`
    *   **Publish directory**: `dist`
5.  **Environment Variables**:
    *   Click **"Show advanced"** -> **"New variable"**.
    *   Add `GEMINI_API_KEY` and its value.
6.  **Deploy Site**.

**Important for Netlify**:
To prevent 404s on refresh, create a file named `_redirects` (no extension) in your `public` folder with this content:
```
/*  /index.html  200
```

---

## Alternative: Cloudflare Pages

Great for performance and completely free bandwidth.

1.  Log in to **Cloudflare Dashboard** -> **Workers & Pages**.
2.  Click **Create Application** -> **Pages** -> **Connect to Git**.
3.  Select your repo.
4.  **Build Settings**:
    *   **Framework preset**: `Vite`
    *   **Build command**: `vite build`
    *   **Build output directory**: `dist`
5.  Add Environment Variables if needed.
6.  **Save and Deploy**.

---

## Pre-Deployment Checklist

1.  **Test the Build Locally**:
    Run this command to ensure your project builds without errors before uploading:
    ```bash
    npm run build
    ```
    If this fails, the deployment will fail. Fix any TypeScript errors (e.g., type mismatches) first.

2.  **Check `.gitignore`**:
    Ensure `node_modules`, `.env`, and `dist` are in your `.gitignore` file so they aren't pushed to GitHub.

3.  **Firebase Domain**:
    After deploying, go to your **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized Domains** and add your new Vercel/Netlify domain (e.g., `shreyans-arc.vercel.app`) to allow Google Sign-In to work.
