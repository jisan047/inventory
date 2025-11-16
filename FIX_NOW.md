# 🔧 FIX YOUR CONNECTION STRING NOW

## Your Current Connection String (WRONG):
```
mongodb+srv://jisan:PASSWORD@cluster0.xx4n7de.mongodb.net/?appName=Cluster0
```

## What It Should Be (CORRECT):
```
mongodb+srv://jisan:PASSWORD@cluster0.xx4n7de.mongodb.net/inventory?retryWrites=true&w=majority
```

## Steps to Fix:

1. **Open `backend/.env` file** in a text editor (Notepad, VS Code, etc.)

2. **Find this line:**
   ```
   MONGODB_URI=mongodb+srv://jisan:YOUR_PASSWORD@cluster0.xx4n7de.mongodb.net/?appName=Cluster0
   ```

3. **Replace it with:**
   ```
   MONGODB_URI=mongodb+srv://jisan:YOUR_PASSWORD@cluster0.xx4n7de.mongodb.net/inventory?retryWrites=true&w=majority
   ```

   **Important:** Replace `YOUR_PASSWORD` with your actual MongoDB password!

4. **Save the file**

5. **Test the connection:**
   ```bash
   cd backend
   node debug-connection.js
   ```

## Key Changes:
- ❌ Remove: `/?appName=Cluster0`
- ✅ Add: `/inventory?retryWrites=true&w=majority`

The `/inventory` part tells MongoDB which database to use.

## Also Check IP Whitelist:

Even after fixing the connection string, you might still get IP errors. Make sure:

1. Go to: https://cloud.mongodb.com/v2#/security/network/whitelist
2. `0.0.0.0/0` must be listed
3. Status must be **"Active"** (green checkmark), NOT "Pending"
4. If it's "Pending", wait 5 minutes
5. If it's not there, add it again

## After Fixing:

Run this to test:
```bash
cd backend
node debug-connection.js
```

You should see:
- ✅ Database name is present
- ✅ Connection successful

