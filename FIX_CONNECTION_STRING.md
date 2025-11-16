# Fix Your MongoDB Connection String

Your connection string is missing the database name. Here's how to fix it:

## Current (Wrong) Format:
```
mongodb+srv://skjishan047_db_user:PASSWORD@inventory.zyjhc4i.mongodb.net/?appName=inventory
```

## Correct Format:
```
mongodb+srv://skjishan047_db_user:PASSWORD@inventory.zyjhc4i.mongodb.net/inventory?retryWrites=true&w=majority
```

## Steps to Fix:

1. **Open `backend/.env` file**

2. **Find the line with `MONGODB_URI=`**

3. **Replace it with this format:**
   ```env
   MONGODB_URI=mongodb+srv://skjishan047_db_user:YOUR_PASSWORD@inventory.zyjhc4i.mongodb.net/inventory?retryWrites=true&w=majority
   ```
   
   **Important:** Replace `YOUR_PASSWORD` with your actual MongoDB password

4. **Key changes:**
   - Add `/inventory` BEFORE the `?` (this is the database name)
   - Replace `?appName=inventory` with `?retryWrites=true&w=majority`

5. **Save the file**

6. **Test again:**
   ```bash
   cd backend
   node test-connection.js
   ```

## If Your Password Has Special Characters:

If your password contains `@`, `#`, `%`, `&`, etc., you need to URL encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`
- `=` → `%3D`

**Or easier:** Change your MongoDB password to one without special characters.

## Also Check IP Whitelist:

1. Go to MongoDB Atlas → Network Access
2. Make sure `0.0.0.0/0` is listed
3. Status must be **"Active"** (green checkmark), NOT "Pending"
4. If it's "Pending", wait 3-5 minutes
5. If it's not there, add it again and wait

## Get Fresh Connection String from Atlas:

1. Go to MongoDB Atlas → Clusters
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" driver
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Add `/inventory` before the `?` to specify database name

Example:
```
mongodb+srv://skjishan047_db_user:<password>@inventory.zyjhc4i.mongodb.net/?retryWrites=true&w=majority
```

Becomes:
```
mongodb+srv://skjishan047_db_user:yourpassword@inventory.zyjhc4i.mongodb.net/inventory?retryWrites=true&w=majority
```

