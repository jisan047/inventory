# Fix: ERR_CONNECTION_REFUSED Error

## Problem
You're getting `net::ERR_CONNECTION_REFUSED` when trying to login after deployment.

## Root Cause
The frontend is trying to connect to `http://localhost:5000/api` because the `REACT_APP_API_URL` environment variable is not set in your deployment platform (Vercel/Netlify).

## Solution

### Step 1: Get Your Backend URL
1. Go to your backend deployment platform (Render/Railway)
2. Find your backend service URL (e.g., `https://inventory-backend.onrender.com`)
3. Copy the full URL (without `/api` at the end)

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your project

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Environment Variable**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     - Replace `your-backend-url` with your actual backend URL
     - **Important**: Include `/api` at the end
   - **Environment**: Select **Production**, **Preview**, and **Development** (or just Production if you only deploy to production)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a new deployment

### Step 3: Set Environment Variable in Netlify

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://www.netlify.com)
   - Select your site

2. **Navigate to Site Settings**
   - Go to **Site settings** → **Environment variables**

3. **Add Environment Variable**
   - Click **Add a variable**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     - Replace `your-backend-url` with your actual backend URL
     - **Important**: Include `/api` at the end
   - **Scopes**: Select **All scopes** (or just Production)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **Trigger deploy** → **Deploy site**
   - Or push a new commit to trigger a new deployment

### Step 4: Verify Backend is Running

1. **Check Backend Status**
   - Go to your backend platform (Render/Railway)
   - Check if the service is running (should show "Live" or "Active")
   - Check the logs for any errors

2. **Test Backend URL**
   - Open your browser
   - Visit: `https://your-backend-url.onrender.com/api/auth/login`
   - You should see an error (that's normal - it means the server is responding)
   - If you see "Cannot GET /api/auth/login", the backend is working
   - If you see connection error, the backend is down

### Step 5: Verify Environment Variable is Set

After redeploying, you can verify the environment variable is working:

1. **Check Browser Console**
   - Open your deployed frontend
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for any API errors or check the Network tab to see what URL is being called

2. **Check Build Logs**
   - In Vercel/Netlify, check the build logs
   - The environment variable should be available during build

## Common Mistakes

### ❌ Wrong: Missing `/api` suffix
```
REACT_APP_API_URL=https://inventory-backend.onrender.com
```

### ✅ Correct: Includes `/api` suffix
```
REACT_APP_API_URL=https://inventory-backend.onrender.com/api
```

### ❌ Wrong: Using `localhost` in production
```
REACT_APP_API_URL=http://localhost:5000/api
```

### ✅ Correct: Using deployed backend URL
```
REACT_APP_API_URL=https://inventory-backend.onrender.com/api
```

### ❌ Wrong: Forgetting to redeploy
- Environment variables only take effect after redeployment
- Always redeploy after adding/changing environment variables

## Testing Locally vs Production

### Local Development
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- No environment variable needed (defaults to localhost)

### Production Deployment
- Backend runs on Render/Railway (e.g., `https://inventory-backend.onrender.com`)
- Frontend runs on Vercel/Netlify (e.g., `https://your-app.vercel.app`)
- **Must** set `REACT_APP_API_URL` environment variable

## Quick Checklist

- [ ] Backend is deployed and running (check Render/Railway dashboard)
- [ ] Backend URL is accessible (test in browser)
- [ ] `REACT_APP_API_URL` is set in Vercel/Netlify
- [ ] Environment variable includes `/api` suffix
- [ ] Environment variable uses `https://` (not `http://`)
- [ ] Frontend has been redeployed after setting environment variable
- [ ] CORS is configured in backend (check `FRONTEND_URL` in backend env vars)

## Still Having Issues?

1. **Check Backend Logs**
   - Look for CORS errors
   - Check if database is initialized
   - Verify admin user was created

2. **Check Frontend Network Tab**
   - Open DevTools → Network tab
   - Try to login
   - See what URL the request is going to
   - Check the error message

3. **Verify CORS Settings**
   - In backend environment variables, set:
     ```
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Redeploy backend after setting this

4. **Test Backend Directly**
   - Try accessing: `https://your-backend-url.onrender.com/api/products`
   - Should return JSON (even if empty array)

## Example Configuration

### Backend (Render/Railway) Environment Variables:
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
ADMIN_EMAIL=admin@inventory.com
ADMIN_PASSWORD=your_secure_password_here
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel/Netlify) Environment Variables:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

Replace:
- `your-backend-url` with your actual Render/Railway backend URL
- `your-frontend-url` with your actual Vercel/Netlify frontend URL

