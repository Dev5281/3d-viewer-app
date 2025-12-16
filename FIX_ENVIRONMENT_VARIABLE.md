# Fix VITE_API_URL Environment Variable

## Problem
Your frontend is making requests to `/upload` and `/settings` instead of `/api/upload` and `/api/settings`.

This happens when `VITE_API_URL` is set to `https://3d-viewer-app.vercel.app` instead of `https://3d-viewer-app.vercel.app/api`.

## Solution

### Step 1: Update Environment Variable in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your **FRONTEND project** (not the backend)
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` or create it if it doesn't exist
5. Set the value to: `https://3d-viewer-app.vercel.app/api`
   - **CRITICAL**: Must end with `/api`
6. Make sure it's enabled for **Production**, **Preview**, and **Development**
7. Click **Save**

### Step 2: Redeploy Frontend

**IMPORTANT**: Environment variable changes require a redeploy to take effect!

1. Go to your frontend project in Vercel
2. Click on **Deployments** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**
5. Wait for deployment to complete (~1-2 minutes)

### Step 3: Verify

1. Open your deployed frontend in a browser
2. Open browser DevTools (F12) → Console tab
3. Look for: `API Base URL: https://3d-viewer-app.vercel.app/api`
4. Try uploading a file
5. Check Network tab - requests should go to `/api/upload` not `/upload`

## Quick Check

To verify your current `VITE_API_URL` value:

1. Open browser console on your deployed frontend
2. Type: `console.log(import.meta.env.VITE_API_URL)`
3. It should show: `https://3d-viewer-app.vercel.app/api`

If it shows `https://3d-viewer-app.vercel.app` (without `/api`), you need to update it.

## Temporary Fix

I've added automatic `/api` appending in the code, but you should still fix the environment variable properly to avoid confusion.

