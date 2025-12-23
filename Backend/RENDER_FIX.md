# Fix "gunicorn: command not found" Error

## The Problem
Render is not installing Python dependencies, so gunicorn is not available.

## Solution: Update Render Dashboard Settings

Go to your Render service dashboard and update these settings:

### 1. Root Directory
- **Must be set to**: `Backend`
- This tells Render where your Python project is located

### 2. Build Command
Use this EXACT command:
```bash
pip install -r requirements.txt && python manage.py migrate --noinput
```

**Important**: Make sure there are NO extra spaces or characters.

### 3. Start Command
Use this EXACT command:
```bash
gunicorn ecommerce.wsgi:application
```

**Important**: Do NOT include `cd Backend` in the start command if Root Directory is already set to `Backend`.

### 4. Verify Python Version
- Go to "Environment" tab
- Make sure Python is detected (should show Python 3.13.4 or similar)
- If not, add environment variable:
  - Key: `PYTHON_VERSION`
  - Value: `3.13.4`

## Step-by-Step Fix

1. **Go to Render Dashboard** → Your Backend Service
2. **Click "Settings"** tab
3. **Scroll to "Build & Deploy"** section
4. **Set Root Directory**: `Backend`
5. **Set Build Command**: 
   ```
   pip install -r requirements.txt && python manage.py migrate --noinput
   ```
6. **Set Start Command**: 
   ```
   gunicorn ecommerce.wsgi:application
   ```
7. **Click "Save Changes"**
8. **Go to "Manual Deploy"** → Click "Deploy latest commit"

## Alternative: If Root Directory Doesn't Work

If setting Root Directory to `Backend` doesn't work, try:

**Build Command**:
```bash
cd Backend && pip install -r requirements.txt && python manage.py migrate --noinput
```

**Start Command**:
```bash
cd Backend && gunicorn ecommerce.wsgi:application
```

And set **Root Directory** to: `.` (current directory, which is the repo root)

## Verify Build Logs

After deploying, check the build logs. You should see:
```
Collecting gunicorn==23.0.0
Installing collected packages: gunicorn
Successfully installed gunicorn-23.0.0
```

If you DON'T see this, the build command isn't running correctly.

## Common Mistakes to Avoid

❌ **Wrong**: Build command includes `cd Backend` when Root Directory is already `Backend`
❌ **Wrong**: Start command includes `cd Backend` when Root Directory is already `Backend`
❌ **Wrong**: Root Directory is `.` but build command doesn't include `cd Backend`
❌ **Wrong**: Using `python3` instead of `python` (Render uses `python`)
❌ **Wrong**: Build command is empty or missing

✅ **Correct**: Root Directory = `Backend`, Build Command = `pip install -r requirements.txt && python manage.py migrate --noinput`, Start Command = `gunicorn ecommerce.wsgi:application`

## Still Not Working?

If it still doesn't work, try this alternative build command that's more explicit:

```bash
python -m pip install --upgrade pip && pip install -r requirements.txt && python manage.py migrate --noinput
```

This ensures pip is up to date before installing dependencies.

