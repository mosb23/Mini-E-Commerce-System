# Fix CORS Error - Frontend Can't Connect to Backend

## The Problem
Your frontend is getting "Failed to fetch" because the backend is blocking CORS requests from your frontend domain.

## Solution: Add Frontend URL to Backend Environment Variables

### Step 1: Get Your Frontend URL
Your frontend Render URL should look like:
```
https://mini-ecommerce-frontend.onrender.com
```
(Check your Render dashboard for the exact URL)

### Step 2: Update Backend Environment Variables in Render

Go to your **Backend** service in Render dashboard:

1. Click on your backend service
2. Go to "Environment" tab
3. Add/Update these environment variables:

#### Required Variables:

1. **FRONTEND_URL**
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-name.onrender.com`
   - Replace with your actual frontend Render URL
   - **Important**: No trailing slash, just the domain

2. **ALLOWED_HOSTS**
   - **Key**: `ALLOWED_HOSTS`
   - **Value**: `mini-e-commerce-system.onrender.com,localhost,127.0.0.1`
   - Replace `mini-e-commerce-system.onrender.com` with your actual backend domain

3. **DEBUG** (Optional but recommended)
   - **Key**: `DEBUG`
   - **Value**: `False`
   - Set to False for production

### Step 3: Redeploy Backend

After adding the environment variables:
1. Go to "Manual Deploy" → "Deploy latest commit"
2. Wait for deployment to complete

### Step 4: Verify

After redeployment:
1. Open your frontend URL
2. Check browser console (F12)
3. You should see API calls succeeding instead of CORS errors

## Example Configuration

If your URLs are:
- Backend: `https://mini-e-commerce-system.onrender.com`
- Frontend: `https://mini-ecommerce-frontend.onrender.com`

Then set:
- `FRONTEND_URL` = `https://mini-ecommerce-frontend.onrender.com`
- `ALLOWED_HOSTS` = `mini-e-commerce-system.onrender.com,localhost,127.0.0.1`

## Troubleshooting

### Still getting CORS errors?
1. Make sure FRONTEND_URL has NO trailing slash
2. Make sure it uses `https://` not `http://`
3. Check browser console for exact error message
4. Verify backend was redeployed after adding environment variables

### Check Backend Logs
In Render dashboard → Backend service → Logs, you should see requests coming through without CORS errors.

