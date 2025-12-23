# Frontend Deployment Guide

## Changes Made for Render Backend Deployment

The frontend has been updated to use environment variables for the API URL, allowing it to work with both local development and production (Render) backends.

### What Changed

1. **API Configuration** (`src/api/api.js`):
   - Now uses `process.env.REACT_APP_API_URL` instead of hardcoded localhost URL
   - Falls back to `http://127.0.0.1:8000/api/` if environment variable is not set

### Setup Instructions

#### For Local Development

1. Create a `.env` file in the `frontend` directory:
```bash
cd frontend
```

2. Create `.env` file with:
```
REACT_APP_API_URL=http://127.0.0.1:8000/api/
```

#### For Production (Render Deployment)

1. **Option 1: Using .env.production file**
   - Create a `.env.production` file in the `frontend` directory:
   ```
   REACT_APP_API_URL=https://your-backend-name.onrender.com/api/
   ```
   - Replace `your-backend-name` with your actual Render backend service name
   - When you run `npm run build`, React will automatically use `.env.production`

2. **Option 2: Using Render Environment Variables (Recommended)**
   - In your Render dashboard, go to your frontend service
   - Navigate to "Environment" section
   - Add a new environment variable:
     - **Key**: `REACT_APP_API_URL`
     - **Value**: `https://your-backend-name.onrender.com/api/`
   - Replace `your-backend-name` with your actual Render backend service name

### Important Notes

- **Environment Variable Naming**: React requires environment variables to start with `REACT_APP_` to be accessible in the code
- **HTTPS**: Make sure your Render backend URL uses `https://` (not `http://`)
- **Trailing Slash**: Keep the trailing `/api/` at the end of the URL
- **Rebuild Required**: After changing environment variables, you need to rebuild the React app:
  ```bash
  npm run build
  ```

### Example Render Backend URLs

Your deployed backend URL:
```
REACT_APP_API_URL=https://mini-e-commerce-system.onrender.com/api/
```

**Note**: The default fallback URL in `api.js` is now set to your Render backend. For local development, create a `.env` file with:
```
REACT_APP_API_URL=http://127.0.0.1:8000/api/
```

### Verifying the Configuration

After deployment, check the browser console to see which API URL is being used. The API calls will show in the Network tab of browser DevTools.

