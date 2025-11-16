# Free Deployment Guide

This guide will help you deploy the Inventory Management System completely free using:
- **Backend**: Render, Railway, or Fly.io (Free Tier)
- **Frontend**: Vercel or Netlify (Free Tier)
- **Database**: SQLite (file-based, no setup needed!)
- **File Storage**: Local storage or Cloudinary (free tier for images)

## ✅ No Database Setup Required!

Since we're using **SQLite**, there's no need to set up MongoDB Atlas or any external database. The database file (`inventory.db`) will be created automatically when the server starts!

## Step 1: Prepare Your Code for Deployment

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com) and create a new repository
   - Push your code to GitHub
   - Make sure `.gitignore` excludes:
     - `node_modules/`
     - `.env`
     - `*.db` (SQLite database files)
     - `uploads/` (or use Cloudinary for images)

2. **Update .gitignore** (if needed)
   - Make sure `backend/.gitignore` includes `*.db` to avoid committing database files

## Step 2: Deploy Backend to Render

1. **Go to Render**
   - Visit [Render](https://render.com) and sign up/login (free account)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository with your code

3. **Configure Backend Service**
   - **Name**: `inventory-backend` (or any name you prefer)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables** (in Render dashboard):
   ```
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
   ADMIN_EMAIL=admin@inventory.com
   ADMIN_PASSWORD=your_secure_password_here
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
   
   **Note**: No `MONGODB_URI` needed! SQLite database will be created automatically.

5. **Create the Service**
   - Click "Create Web Service"
   - Wait for deployment (takes 5-10 minutes)
   - Note your backend URL (e.g., `https://inventory-backend.onrender.com`)

6. **Verify Deployment**
   - The SQLite database (`inventory.db`) will be created automatically
   - Admin user will be created automatically on first start
   - Check logs to see "SQLite database initialized" and "Admin user created successfully"

## Alternative: Deploy Backend to Railway

1. **Go to Railway**
   - Visit [Railway](https://railway.app) and sign up/login
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Add Environment Variables** (same as Render above)

4. **Deploy**
   - Railway will automatically deploy
   - Your backend will be live at: `https://your-app-name.up.railway.app`

## Step 3: Deploy Frontend to Vercel

1. **Update Frontend Environment Variables**
   - In your `frontend` folder, create/update `.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   - Replace `your-backend-url` with your actual Render/Railway backend URL

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com) and sign up/login
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

3. **Add Environment Variable** (in Vercel dashboard):
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (takes 2-5 minutes)
   - Your app will be live at: `https://your-app-name.vercel.app`

## Alternative: Deploy Frontend to Netlify

1. **Build the Frontend Locally** (optional)
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://www.netlify.com) and sign up/login
   - Drag and drop the `frontend/build` folder to Netlify
   - Or connect your GitHub repository:
     - Click "Add new site" → "Import an existing project"
     - Select your repository
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/build`

3. **Add Environment Variable** (in Netlify dashboard):
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`

4. **Redeploy** after adding environment variables

## Step 4: Handle Image Uploads

**Option A: Use Cloudinary (Recommended for Production)**

1. Sign up at [Cloudinary](https://cloudinary.com) (free tier available)
2. Get your Cloudinary credentials
3. Install Cloudinary in backend:
   ```bash
   cd backend
   npm install cloudinary multer-storage-cloudinary
   ```
4. Update `backend/routes/products.js` to use Cloudinary instead of local storage
5. Add Cloudinary credentials to Render/Railway environment variables

**Option B: Use Local Storage (Free Tier Limitation)**

- Images stored in `backend/uploads/` folder
- On Render free tier: Files persist but may be lost on service restart
- On Railway: Files persist better
- **Recommendation**: Use Cloudinary for production

## Step 5: Update CORS Settings

Make sure your backend allows requests from your frontend domain. The `backend/server.js` already has CORS configured, but you can update it:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

Set `FRONTEND_URL` environment variable to your frontend URL for better security.

## Step 6: Database Persistence

### SQLite Database File

- **Location**: `backend/inventory.db` (created automatically)
- **Persistence**: 
  - **Render**: Database persists between deployments but may reset on service restart (free tier)
  - **Railway**: Better persistence, database file is maintained
  - **Fly.io**: Good persistence with volumes

### Backup Your Database

1. **Download database file** from your hosting platform
2. **Or use a backup script** to periodically backup `inventory.db`
3. **Or use a database backup service** (for production)

### For Production (Recommended)

Consider using a managed database service if you need:
- Guaranteed persistence
- Automatic backups
- Better performance at scale

Options:
- **Supabase** (PostgreSQL, free tier)
- **PlanetScale** (MySQL, free tier)
- **Railway PostgreSQL** (free tier)

## Step 7: Access Your Application

1. Visit your frontend URL (Vercel/Netlify)
2. Login with your admin credentials (set in environment variables)
3. Start managing your inventory!

## Troubleshooting

### Backend Issues

- **Database Not Created**: Check server logs, ensure SQLite package is installed
- **Port Error**: Render/Railway automatically assigns a port, use `process.env.PORT` (already configured)
- **Build Fails**: Check build logs in dashboard, ensure `better-sqlite3` is in dependencies
- **Admin User Not Created**: Check logs, admin is created automatically on first start

### Frontend Issues

- **API Connection Error**: Verify `REACT_APP_API_URL` is set correctly
- **CORS Error**: Update CORS settings in backend or set `FRONTEND_URL` environment variable
- **Build Fails**: Check build logs in Vercel/Netlify dashboard

### Common Issues

- **Images Not Loading**: Use Cloudinary or check file paths
- **Database Resets**: On Render free tier, database may reset on service restart. Consider Railway or use Cloudinary for images
- **Environment Variables Not Working**: Make sure to redeploy after adding variables

## Free Tier Limitations

### Render (Backend)
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free
- Database file persists but may reset on restart

### Railway (Backend - Alternative)
- $5 free credit monthly (usually enough for small apps)
- Better database persistence
- No spin-down delays
- More reliable for production

### Vercel (Frontend)
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for this use case

### SQLite Database
- ✅ No setup required
- ✅ Works immediately
- ✅ Perfect for small shops
- ⚠️  May need backup strategy for production

## Cost Summary

✅ **Total Cost: $0/month** (with Render free tier)

Or use Railway which gives $5 free credit monthly (usually enough for small apps).

All services offer free tiers that are sufficient for a small shop inventory system!

## Support

If you encounter any issues:
1. Check the service logs (Render/Railway/Vercel dashboards)
2. Verify all environment variables are set correctly
3. Check CORS settings match your frontend URL
4. Ensure SQLite database file is being created (check logs)

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render/Railway
- [ ] Environment variables set (JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, FRONTEND_URL)
- [ ] Frontend deployed to Vercel/Netlify
- [ ] REACT_APP_API_URL set to backend URL
- [ ] Test login with admin credentials
- [ ] Database file created (check backend logs)
- [ ] Images working (consider Cloudinary for production)

Happy deploying! 🚀
