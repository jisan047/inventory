// Quick script to help debug MongoDB Atlas connection
console.log('🔍 MongoDB Atlas Connection Troubleshooting\n');
console.log('Please verify the following in MongoDB Atlas:\n');

console.log('1. Network Access (IP Whitelist):');
console.log('   - Go to: https://cloud.mongodb.com/v2#/security/network/whitelist');
console.log('   - Check that 0.0.0.0/0 is listed');
console.log('   - Status must be "Active" (green checkmark)');
console.log('   - If "Pending", wait 3-5 minutes\n');

console.log('2. Database Access (User Credentials):');
console.log('   - Go to: https://cloud.mongodb.com/v2#/security/database/users');
console.log('   - Verify your user exists');
console.log('   - Check username and password are correct');
console.log('   - User should have "Atlas admin" or "Read and write" role\n');

console.log('3. Connection String Format:');
console.log('   Your .env file should have:');
console.log('   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/inventory?retryWrites=true&w=majority');
console.log('   ⚠️  Make sure /inventory is BEFORE the ? (this is the database name)\n');

console.log('4. Common Issues:');
console.log('   - Password with special characters needs URL encoding');
console.log('   - IP whitelist takes 2-5 minutes to activate');
console.log('   - Connection string must have database name (/inventory)');
console.log('   - No spaces or quotes around connection string in .env\n');

console.log('5. Test Your Connection:');
console.log('   Run: node test-connection.js\n');

console.log('6. Still Not Working?');
console.log('   - Wait 5 minutes after adding IP whitelist');
console.log('   - Try creating a new database user with simple password');
console.log('   - Copy connection string fresh from Atlas dashboard');
console.log('   - Check firewall/antivirus isn\'t blocking connection\n');

