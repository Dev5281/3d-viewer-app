# Troubleshooting Upload Issues on Vercel

## Current Error: `ERR_FAILED` / "No response from server"

This means the request isn't reaching the server. Here's how to diagnose and fix it:

## Step 1: Verify Server is Deployed and Running

1. **Check Health Endpoint:**
   - Visit: `https://3d-viewer-app.vercel.app/api/health`
   - Should return: `{"status":"ok","vercel":true,...}`
   - If this fails, your server isn't deployed correctly

2. **Check Vercel Dashboard:**
   - Go to your **server project** on Vercel
   - Check **Deployments** tab - should show "Ready" status
   - If not, redeploy the server

## Step 2: Check File Size

**Vercel Hobby (Free) Plan Limitation:**
- Maximum request body size: **4.5MB**
- If your GLB file is larger than 4.5MB, the request will fail with `ERR_FAILED`

**To check your file size:**
1. Right-click your GLB file → Properties
2. Check the file size
3. If > 4.5MB, you need to:
   - Use a smaller/compressed GLB file
   - Upgrade to Vercel Pro (allows larger files)
   - Use a different hosting service (Railway, Render)

## Step 3: Check Server Logs

1. Go to Vercel Dashboard → Your Server Project
2. Click **Functions** tab
3. Click on a function execution
4. Check **Logs** for errors

Look for:
- `Multer error` - file upload issue
- `Upload error` - processing issue
- `CORS` messages - should show "Origin allowed"
- Any stack traces or error messages

## Step 4: Test Upload Endpoint

1. Visit: `https://3d-viewer-app.vercel.app/api/upload/test`
2. Should return: `{"message":"Upload endpoint is reachable",...}`
3. If this fails, the route isn't configured correctly

## Step 5: Verify Server Redeployment

Make sure you've redeployed the server after making changes:

1. **If using Git:**
   ```bash
   git add .
   git commit -m "Update server"
   git push origin main
   ```
   Wait for Vercel to auto-deploy

2. **Manual Redeploy:**
   - Vercel Dashboard → Server Project → Deployments
   - Click "..." → "Redeploy"

## Common Issues and Solutions

### Issue: File > 4.5MB
**Solution:** 
- Compress your GLB file using a tool like [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)
- Or upgrade to Vercel Pro
- Or use Railway/Render for backend

### Issue: Server not responding
**Solution:**
- Check server is deployed (visit `/api/health`)
- Check Vercel function logs for errors
- Verify `vercel.json` is correct
- Make sure `server/src/server.js` exports the app correctly

### Issue: CORS errors
**Solution:**
- Already fixed in latest code
- Make sure server is redeployed
- Check browser console for CORS messages

### Issue: Timeout
**Solution:**
- Large files may timeout
- Check `vercel.json` has `maxDuration: 60`
- Consider using chunked uploads for large files

## Quick Diagnostic Checklist

- [ ] Server health endpoint works: `/api/health`
- [ ] File size < 4.5MB (for Vercel Hobby)
- [ ] Server logs show requests arriving
- [ ] Server redeployed after latest changes
- [ ] `VITE_API_URL` ends with `/api`
- [ ] Frontend redeployed after env var change

## Next Steps

1. **Test with a small file first** (< 1MB) to verify the endpoint works
2. **Check server logs** in Vercel dashboard
3. **Verify file size** - if > 4.5MB, that's the issue
4. **Share server logs** if issue persists

