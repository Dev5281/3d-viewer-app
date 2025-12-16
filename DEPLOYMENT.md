# Deployment Guide

This project consists of two parts that need to be deployed separately:

1. **Frontend (Client)** - Deploy on Vercel
2. **Backend (Server)** - Deploy on Railway, Render, Heroku, or similar

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `Dev5281/3d-viewer-app`
4. **IMPORTANT**: Click "Configure Project" and set:
   - **Root Directory**: Click "Edit" → Select `client` folder → Click "Continue"
5. Vercel will auto-detect Vite. Verify these settings:
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
6. Click "Deploy"

### Step 2: Set Environment Variables in Vercel

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add the following variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.vercel.app/api` (replace with your actual backend URL)
   - **IMPORTANT**: The value MUST end with `/api` (e.g., `https://3d-viewer-app.vercel.app/api`)
   - **Environment**: Production, Preview, Development (select all)

4. **CRITICAL**: After adding/updating the environment variable, you MUST redeploy your application for the changes to take effect
5. To verify, check the browser console - API calls should go to `/api/upload` and `/api/settings`, not `/upload` or `/settings`

## Backend Deployment

### Option 1: Vercel (Serverless Functions)

**Important**: Deploy the server as a separate Vercel project from the frontend.

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `Dev5281/3d-viewer-app`
4. **IMPORTANT**: Click "Configure Project" and set:
   - **Root Directory**: Click "Edit" → Select `server` folder → Click "Continue"
5. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (or `npm install` if needed)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
6. Add environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `FRONTEND_URL` - Your frontend Vercel URL (e.g., `https://your-client.vercel.app`)
7. Deploy!
8. Copy the deployed URL (e.g., `https://your-server.vercel.app`)

**Note**: The `server/vercel.json` file configures the serverless functions. Make sure it's committed to your repo.

### Redeploying the Server on Vercel

After making changes to your server code, you need to redeploy. Here are the methods:

#### Method 1: Automatic Redeploy (Recommended - Git Integration)

If your Vercel project is connected to GitHub:

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Update server CORS configuration"
   git push origin main
   ```

2. **Vercel will automatically detect the push and redeploy** - you'll see the deployment in your Vercel dashboard

3. **Wait for deployment to complete** (usually 1-2 minutes)

4. **Verify deployment:**
   - Check your Vercel dashboard for deployment status
   - Visit `https://your-server.vercel.app/api/health` to verify it's working

#### Method 2: Manual Redeploy from Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your **server project** (not the frontend project)
3. Click on the **"Deployments"** tab
4. Find the latest deployment and click the **"..."** (three dots) menu
5. Click **"Redeploy"**
6. Confirm the redeployment
7. Wait for the deployment to complete

#### Method 3: Using Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to your server directory:**
   ```bash
   cd server
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

#### After Redeployment

1. **Test the health endpoint:**
   - Visit: `https://your-server.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"...","environment":"production","vercel":true}`

2. **Check CORS is working:**
   - Open browser console on your frontend
   - Try uploading a file
   - Should not see CORS errors

3. **Verify environment variables:**
   - Go to Project Settings → Environment Variables
   - Ensure `MONGO_URI` and `FRONTEND_URL` are set correctly
   - If you updated them, redeploy again

### Option 2: Railway (Recommended for file uploads)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect it's a Node.js project
6. Set the **Root Directory** to `server`
7. Add environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `PORT` - Railway will set this automatically
8. Deploy!

### Option 2: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `3d-viewer-app-backend`
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `PORT` - Render will set this automatically
6. Deploy!

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set root directory: `heroku config:set PROJECT_PATH=server`
5. Add environment variables:
   ```bash
   heroku config:set MONGO_URI=your_mongodb_uri
   ```
6. Deploy: `git subtree push --prefix server heroku main`

## MongoDB Setup

### Option 1: MongoDB Atlas (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use `0.0.0.0/0` for all IPs)
5. Get your connection string
6. Use it as `MONGO_URI` in your backend environment variables

### Option 2: Local MongoDB

Only works if you're running the backend locally. For production, use MongoDB Atlas.

## Important Notes

1. **CORS**: Make sure your backend allows requests from your Vercel domain
2. **File Uploads**: Backend services like Railway/Render have ephemeral file systems. Consider using cloud storage (AWS S3, Cloudinary) for uploaded files
3. **Environment Variables**: Never commit `.env` files to Git
4. **API URL**: After deploying the backend, update `VITE_API_URL` in Vercel with your backend URL

## Testing

After deployment:
1. Frontend should be accessible at: `https://your-app.vercel.app`
2. Backend API should be accessible at: `https://your-backend-url.com/api`
3. Test the upload functionality

## Troubleshooting

### CORS Errors

If you see CORS errors like:
```
Access to XMLHttpRequest at 'https://your-backend.vercel.app/api/...' from origin 'https://your-frontend.vercel.app' has been blocked by CORS policy
```

**Solution**: The server has been updated to automatically allow all Vercel domains. Make sure:
1. Your backend is deployed and running
2. The `VITE_API_URL` environment variable in your frontend Vercel project is set to: `https://your-backend-url.vercel.app/api` (note the `/api` at the end)
3. Redeploy both frontend and backend after making changes

### Common Issues

- **CORS Errors**: The server now automatically allows all `.vercel.app` domains. If you still see errors, check that `VITE_API_URL` includes `/api` at the end
- **File Upload Issues**: Check file size limits and storage configuration. On Vercel, files are converted to base64 data URLs
- **Connection Refused**: Verify `VITE_API_URL` is set correctly in Vercel. It should be `https://your-backend-url.vercel.app/api` (with `/api`)
- **404 Errors on API routes**: Make sure your backend `vercel.json` is configured correctly and the routes include `/api` prefix

