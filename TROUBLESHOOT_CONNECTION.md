# Troubleshooting MongoDB Atlas Connection

If you've added 0.0.0.0/0 and still getting errors, try these steps:

## Step 1: Verify IP Whitelist Status

1. Go to MongoDB Atlas → Network Access
2. Check that `0.0.0.0/0` shows status **"Active"** (green checkmark)
3. If it shows "Pending", wait 2-3 more minutes
4. If it's not there, add it again

## Step 2: Check Your Connection String Format

Your `.env` file should have the connection string in this format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory?retryWrites=true&w=majority
```

**Common Issues:**

### Issue 1: Password with Special Characters
If your password has special characters like `@`, `#`, `%`, `&`, you need to URL encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`
- `=` → `%3D`

**Example:**
If password is `mypass@123`, use `mypass%40123` in connection string

**Easier Solution:** Change your MongoDB password to one without special characters

### Issue 2: Missing Database Name
Make sure `/inventory` is in the connection string before the `?`

✅ Correct: `...mongodb.net/inventory?retryWrites=true&w=majority`
❌ Wrong: `...mongodb.net?retryWrites=true&w=majority`

### Issue 3: Extra Spaces or Quotes
Make sure there are no spaces or quotes around the connection string in `.env`

✅ Correct: `MONGODB_URI=mongodb+srv://...`
❌ Wrong: `MONGODB_URI="mongodb+srv://..."` (no quotes)
❌ Wrong: `MONGODB_URI = mongodb+srv://...` (no spaces around =)

## Step 3: Verify Database User

1. Go to MongoDB Atlas → Database Access
2. Make sure your database user exists
3. Check user has "Atlas admin" or "Read and write to any database" role
4. Verify username and password are correct

## Step 4: Test Connection String

Try this test to see the exact error:

1. Create a test file `test-connection.js` in backend folder:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing connection...');
console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@')); // Hide password

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connection successful!');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ Connection failed:');
  console.error(err.message);
  process.exit(1);
});
```

2. Run it:
```bash
cd backend
node test-connection.js
```

This will show you the exact error message.

## Step 5: Common Solutions

### Solution 1: Recreate Database User
1. MongoDB Atlas → Database Access
2. Delete the existing user
3. Create a new user with a simple password (no special characters)
4. Update your `.env` with new credentials

### Solution 2: Check Connection String from Atlas
1. MongoDB Atlas → Clusters → Click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" driver
4. Copy the connection string exactly as shown
5. Replace `<password>` with your actual password
6. Add `/inventory` before the `?` to specify database name

### Solution 3: Wait and Retry
- Sometimes MongoDB Atlas needs 3-5 minutes to fully activate changes
- Wait 5 minutes, then restart your server

### Solution 4: Check Firewall/Antivirus
- Some firewalls or antivirus software block MongoDB connections
- Temporarily disable to test (remember to re-enable!)

## Step 6: Verify .env File Location

Make sure your `.env` file is in the `backend` folder, not the root folder:

```
inventory/
├── backend/
│   ├── .env          ← Should be here
│   ├── server.js
│   └── ...
└── frontend/
```

## Step 7: Check for Typos

Double-check:
- ✅ No typos in username
- ✅ No typos in password
- ✅ No typos in cluster name
- ✅ Database name is `/inventory` (or whatever you want)
- ✅ Connection string starts with `mongodb+srv://`

## Still Not Working?

Share the exact error message you're getting now, and I can help debug further!

