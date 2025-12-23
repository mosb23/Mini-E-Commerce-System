# Frontend Render Deployment Guide

## Fix "react-scripts: not found" Error

The error occurs because Render is not building from the correct directory. Follow these steps:

## Step 1: Configure Render Static Site Settings

In your Render dashboard, go to your frontend Static Site service and update these settings:

### Root Directory
- **Root Directory**: `frontend`
  - This tells Render where your React project is located

### Build Command
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
  - This installs dependencies and builds the React app

### Publish Directory
- **Publish Directory**: `build`
  - This is where React creates the production build files

### Environment Variables

Add this environment variable:

1. **REACT_APP_API_URL**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://mini-e-commerce-system.onrender.com/api/`
   - This connects your frontend to your backend API

## Step 2: Alternative Configuration (If Root Directory Doesn't Work)

If setting Root Directory to `frontend` doesn't work, try:

**Root Directory**: `.` (root of repo)

**Build Command**:
```bash
cd frontend && npm install && npm run build
```

**Publish Directory**: `frontend/build`

## Step 3: Verify Build

After updating settings:

1. **Trigger a new deployment**
2. Check the build logs - you should see:
   ```
   Installing dependencies...
   Creating an optimized production build...
   Build successful!
   ```

## Quick Checklist

- [ ] Root Directory set to `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `build`
- [ ] Environment Variable `REACT_APP_API_URL` set to `https://mini-e-commerce-system.onrender.com/api/`
- [ ] `react-scripts` version is `5.0.1` in package.json ✅ (Fixed)

## Common Issues

### Issue: "react-scripts: not found"
**Solution**: 
- Make sure Root Directory is set to `frontend`
- Or use build command: `cd frontend && npm install && npm run build`

### Issue: Build succeeds but site doesn't load
**Solution**: 
- Check Publish Directory is set to `build` (not `frontend/build` if Root Directory is `frontend`)

### Issue: API calls failing
**Solution**: 
- Verify `REACT_APP_API_URL` environment variable is set correctly
- Check browser console for CORS errors (might need to update backend CORS settings)

## Testing Your Deployment

Once deployed, your frontend should be available at:
```
https://your-frontend-name.onrender.com
```

Test that it connects to your backend by:
1. Opening the site
2. Checking browser console (F12)
3. Looking for API calls to `https://mini-e-commerce-system.onrender.com/api/`

