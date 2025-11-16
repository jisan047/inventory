# Inventory Management System

A complete inventory management system built with Node.js, Express, React, and SQLite. Perfect for small shops to manage products, track inventory, and generate cash memos.

## Features

- 🔐 **Admin Authentication** - Secure login system for admin users only
- 📦 **Product Management** - Add, edit, delete products with name, description, price, and images
- 📊 **Inventory Tracking** - Automatic inventory deduction when products are sold
- 🧾 **Cash Memo Generation** - Generate cash memos with customer phone number and discount
- 📈 **Dashboard** - View statistics including total products, sales, revenue, and low stock items
- 🖼️ **Image Upload** - Upload product images with automatic storage
- 💾 **SQLite Database** - File-based database, no server setup needed!

## Tech Stack

- **Backend**: Node.js, Express.js, SQLite (better-sqlite3)
- **Frontend**: React.js, React Router
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Database**: SQLite (file-based, no setup required)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- **No database setup needed!** SQLite works out of the box.

## Local Setup

### 1. Clone or Download the Project

```bash
cd inventory
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=admin@inventory.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
```

**Note**: No MongoDB connection string needed! SQLite database will be created automatically.

### 3. Start the Server

Start the backend server:

```bash
npm start
```

The SQLite database (`inventory.db`) and admin user will be created automatically!

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional, defaults to localhost:5000):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The application will open at `http://localhost:3000`

### 5. Login

- Email: `admin@inventory.com` (or whatever you set in `.env`)
- Password: `admin123` (or whatever you set in `.env`)

## Project Structure

```
inventory/
├── backend/
│   ├── models/          # MongoDB models (User, Product, Sale)
│   ├── routes/          # API routes (auth, products, sales)
│   ├── middleware/      # Authentication middleware
│   ├── uploads/         # Product images storage
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── utils/       # API utilities
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/init` - Initialize admin user
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)

### Sales
- `GET /api/sales` - Get all sales (requires auth)
- `GET /api/sales/:id` - Get single sale (requires auth)
- `POST /api/sales` - Create sale/cash memo (requires auth)

## Free Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to free hosting platforms.

**Note**: With SQLite, deployment is even easier - no database setup required! The database file is created automatically.

## Security Notes

- Change the default admin credentials after first login
- Use a strong JWT_SECRET in production
- Never commit `.env` files to version control
- Backup your `inventory.db` file regularly (it contains all your data)

## License

MIT License - feel free to use this project for your shop!

