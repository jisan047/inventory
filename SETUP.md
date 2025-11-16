# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- **No database setup needed!** SQLite works out of the box.

## Step-by-Step Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Backend

Create `backend/.env` file:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
ADMIN_EMAIL=admin@inventory.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
```

**Note**: No MongoDB connection string needed! SQLite database will be created automatically.

Replace:
- `your_super_secret_jwt_key_at_least_32_characters_long` with a secure random string

### 3. Configure Frontend (Optional)

Create `frontend/.env` file (optional, defaults to localhost:5000):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Create Uploads Directory

```bash
cd backend
mkdir uploads
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Wait for: "SQLite database initialized" and "Admin user created successfully"

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

**Login Credentials:**
- Email: `admin@inventory.com` (or what you set in `.env`)
- Password: `admin123` (or what you set in `.env`)

## Troubleshooting

### Database Issues
- SQLite database (`inventory.db`) is created automatically
- If you get database errors, delete `inventory.db` and restart the server
- The database file is in the `backend` folder

### Port Already in Use
- Change `PORT` in `backend/.env` to a different port (e.g., 5001)
- Update `REACT_APP_API_URL` in `frontend/.env` accordingly

### Admin User Not Created
- Admin user is created automatically on first server start
- Check backend console logs for "Admin user created successfully"
- If not created, delete `inventory.db` and restart the server

### Images Not Uploading
- Make sure `backend/uploads` directory exists
- Check file permissions

## Next Steps

- Change default admin password after first login
- Add your products
- Start making sales!

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

