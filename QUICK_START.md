# Quick Start - 5 Minutes Setup

## 1. Install Dependencies (2 minutes)

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 2. Configure Backend (1 minute)

**Create `backend/.env`:**
```env
PORT=5000
JWT_SECRET=change_this_to_a_random_32_character_string
ADMIN_EMAIL=admin@inventory.com
ADMIN_PASSWORD=admin123
```

**No database setup needed!** SQLite will create the database automatically.

## 3. Run (2 minutes)

**Terminal 1:**
```bash
cd backend
npm start
```

You should see:
```
SQLite database initialized
Admin user created successfully
Server running on port 5000
```

**Terminal 2:**
```bash
cd frontend
npm start
```

## 4. Login

- Open: http://localhost:3000
- Email: `admin@inventory.com`
- Password: `admin123`

## Done! 🎉

You're ready to:
- Add products
- Make sales
- Generate cash memos
- Track inventory

**For free hosting deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

**No MongoDB connection issues!** SQLite works immediately. 🚀
