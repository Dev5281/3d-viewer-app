# Diagnostic Checklist for Upload Issues

Please provide the following information:

## 1. Server Deployment Status
- [ ] Has the server been redeployed on Vercel after the latest changes?
- [ ] What is the deployment status? (Ready/Failed/Building)
- [ ] When was the last deployment? (timestamp)

## 2. Health Endpoint Test
Visit: `https://3d-viewer-app.vercel.app/api/health`
- [ ] Does it return JSON with `{"status":"ok",...}`?
- [ ] Or does it return an error/404?

## 3. Browser Network Tab Details
When you try to upload, check the Network tab:
- [ ] What is the exact URL of the OPTIONS request?
- [ ] What is the Status Code? (200/404/500/etc)
- [ ] What are the Response Headers? (especially CORS headers)
- [ ] What is the Request Method? (should be OPTIONS)
- [ ] What is the Request URL? (should be `/api/upload`)

## 4. Browser Console Errors
- [ ] What exact error message do you see?
- [ ] Copy the full error text

## 5. Server Logs
From Vercel Dashboard → Server Project → Functions → Logs:
- [ ] Do you see any log entries when you try to upload?
- [ ] Do you see "OPTIONS preflight request" messages?
- [ ] Any error messages?

## 6. File Details
- [ ] What is the file size? (in MB)
- [ ] What is the file extension? (.glb/.gltf)
- [ ] Does it work locally?

## 7. Environment Variables
From Vercel Dashboard → Frontend Project → Settings → Environment Variables:
- [ ] What is the value of `VITE_API_URL`?
- [ ] Does it end with `/api`?

