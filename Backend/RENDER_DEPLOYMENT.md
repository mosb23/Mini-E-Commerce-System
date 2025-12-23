# Render Deployment Guide

## Fixing the "gunicorn: command not found" Error

The error occurs because Render is not correctly detecting your Python project. Follow these steps to fix it:

## Step 1: Configure Render Service Settings

In your Render dashboard, go to your backend service and update these settings:

### Root Directory
- **Root Directory**: `Backend`
  - This tells Render where your Python project is located

### Build Command
- **Build Command**: 
  ```bash
  pip install -r requirements.txt && python manage.py migrate --noinput
  ```
  - This installs dependencies and runs migrations

### Start Command
- **Start Command**: 
  ```bash
  gunicorn ecommerce.wsgi:application
  ```
  - This starts your Django app with Gunicorn

### Environment Variables

Add these environment variables in Render:

1. **ALLOWED_HOSTS**
   - **Key**: `ALLOWED_HOSTS`
   - **Value**: `your-backend-name.onrender.com,localhost,127.0.0.1`
   - Replace `your-backend-name` with your actual Render service name

2. **DEBUG** (Optional, recommended for production)
   - **Key**: `DEBUG`
   - **Value**: `False`
   - Set to `False` for production, `True` for development

3. **SECRET_KEY** (Recommended for production)
   - **Key**: `SECRET_KEY`
   - **Value**: Generate a new secret key (you can use Django's `python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)

4. **FRONTEND_URL** (For CORS)
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-url.onrender.com`
   - Replace with your actual frontend Render URL

### Python Version
- **Python Version**: `3.13.4` (or your preferred version)

## Step 2: Alternative - Using render.yaml

If you prefer, you can use the `render.yaml` file I created. In Render:

1. Go to your service settings
2. Enable "Auto-Deploy" from the render.yaml file
3. Render will automatically use the configuration from `render.yaml`

## Step 3: Verify Deployment

After updating the settings:

1. **Trigger a new deployment** (Render will auto-deploy if you have auto-deploy enabled)
2. Check the build logs to ensure:
   - ✅ Python dependencies are being installed
   - ✅ Migrations are running
   - ✅ Gunicorn is found and starting

## Common Issues and Solutions

### Issue: "gunicorn: command not found"
**Solution**: Make sure:
- Root Directory is set to `Backend`
- Build Command installs requirements: `pip install -r requirements.txt`
- Gunicorn is in `requirements.txt` (it is ✅)

### Issue: "ModuleNotFoundError"
**Solution**: Ensure all dependencies are in `requirements.txt` and build command installs them

### Issue: CORS errors from frontend
**Solution**: 
- Add `FRONTEND_URL` environment variable with your frontend URL
- Make sure `ALLOWED_HOSTS` includes your Render backend domain

### Issue: Database errors
**Solution**: 
- SQLite works on Render, but data is ephemeral (lost on restart)
- For production, consider using Render PostgreSQL database

## Quick Checklist

- [ ] Root Directory set to `Backend`
- [ ] Build Command: `pip install -r requirements.txt && python manage.py migrate --noinput`
- [ ] Start Command: `gunicorn ecommerce.wsgi:application`
- [ ] ALLOWED_HOSTS environment variable set
- [ ] FRONTEND_URL environment variable set (if deploying frontend)
- [ ] DEBUG set to False (for production)
- [ ] Gunicorn is in requirements.txt ✅

## Testing Your Deployment

Once deployed, test your API:

```bash
# Test products endpoint
curl https://your-backend-name.onrender.com/api/products/

# Test orders endpoint
curl https://your-backend-name.onrender.com/api/orders/
```

If you get responses, your backend is working! 🎉

