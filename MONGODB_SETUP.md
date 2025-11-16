# MongoDB Setup Guide

You're getting a connection error because MongoDB isn't running locally. Here are two options:

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database) ⭐

This is the easiest and recommended option. No installation needed!

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or log in if you have one)

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to you)
4. Click "Create"

### Step 3: Create Database User
1. Under "Database Access" → Click "Add New Database User"
2. Choose "Password" authentication
3. Enter a username (e.g., `inventoryuser`)
4. Enter a password (save this password!)
5. Set privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Under "Network Access" → Click "Add IP Address"
2. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
3. Click "Confirm"

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" as driver
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Step 6: Update Your .env File
1. Open `backend/.env`
2. Replace the `MONGODB_URI` line with:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/inventory?retryWrites=true&w=majority
   ```
3. Replace:
   - `YOUR_USERNAME` with your database username
   - `YOUR_PASSWORD` with your database password
   - `YOUR_CLUSTER` with your cluster name
4. Make sure to add `/inventory` before the `?` to specify the database name

**Example:**
```
MONGODB_URI=mongodb+srv://inventoryuser:mypassword123@cluster0.abc123.mongodb.net/inventory?retryWrites=true&w=majority
```

### Step 7: Restart Your Server
```bash
# Stop the server (Ctrl+C) and restart
cd backend
npm start
```

You should see: "MongoDB connected" ✅

---

## Option 2: Install MongoDB Locally

If you prefer to run MongoDB on your computer:

### Windows:
1. Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Install MongoDB Compass (optional GUI tool)

### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
# Follow official guide: https://www.mongodb.com/docs/manual/installation/
```

After installation, MongoDB will run on `localhost:27017` and your current `.env` file will work.

---

## Troubleshooting

### Still Getting Connection Error?
1. **Check your connection string** - Make sure there are no extra spaces
2. **Verify password** - Special characters in password might need URL encoding
3. **Check network access** - MongoDB Atlas must allow your IP (0.0.0.0/0 for anywhere)
4. **Wait a few minutes** - New MongoDB Atlas clusters can take 2-3 minutes to be ready

### Password Has Special Characters?
If your password has special characters like `@`, `#`, `%`, etc., you need to URL encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`
- etc.

Or better: use a password without special characters for easier setup.

### Test Connection
You can test your connection string using MongoDB Compass or by running:
```bash
node -e "require('mongoose').connect('YOUR_CONNECTION_STRING').then(() => console.log('Connected!')).catch(e => console.error(e))"
```

---

## Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (FREE tier)
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] `.env` file updated with connection string
- [ ] Server restarted
- [ ] See "MongoDB connected" message

---

**Recommendation:** Use MongoDB Atlas (Option 1) - it's free, cloud-based, and easier to set up!

