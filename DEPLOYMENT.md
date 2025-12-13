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
   - **Value**: `https://your-backend-url.com/api` (replace with your actual backend URL)
   - **Environment**: Production, Preview, Development (select all)

4. Redeploy your application after adding the environment variable

## Backend Deployment

### Option 1: Railway (Recommended)

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

- **CORS Errors**: Update CORS settings in `server/src/server.js` to allow your Vercel domain
- **File Upload Issues**: Check file size limits and storage configuration
- **Connection Refused**: Verify `VITE_API_URL` is set correctly in Vercel

