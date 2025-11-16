require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Detailed MongoDB Connection Debugging\n');
console.log('='.repeat(50));

// Check if .env file is loaded
console.log('\n1. Checking .env file:');
if (!process.env.MONGODB_URI) {
  console.log('   ❌ MONGODB_URI not found in .env file!');
  console.log('   Make sure you have a .env file in the backend folder');
  process.exit(1);
} else {
  console.log('   ✅ MONGODB_URI found in .env');
}

// Check connection string format
const uri = process.env.MONGODB_URI;
console.log('\n2. Connection String Analysis:');
console.log('   URI starts with mongodb+srv:', uri.startsWith('mongodb+srv://') ? '✅' : '❌');
console.log('   Has username:', uri.includes('@') && !uri.includes('<password>') ? '✅' : '❌');
console.log('   Has password:', uri.match(/:\w+@/) || uri.match(/:[^@]+@/) ? '✅' : '❌');
console.log('   Has database name:', uri.includes('/inventory?') || uri.includes('/inventory&') ? '✅' : '❌');

if (!uri.includes('/inventory')) {
  console.log('\n   ⚠️  WARNING: Database name missing!');
  console.log('   Your connection string should include /inventory before the ?');
  console.log('   Example: ...mongodb.net/inventory?retryWrites=true&w=majority');
}

// Mask password for display
const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
console.log('\n3. Connection String (password hidden):');
console.log('   ' + maskedUri);

// Extract components
try {
  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
  if (match) {
    console.log('\n4. Connection String Components:');
    console.log('   Username:', match[1]);
    console.log('   Password:', match[2].length > 0 ? '*** (' + match[2].length + ' chars)' : '❌ MISSING');
    console.log('   Cluster:', match[3]);
    console.log('   Database:', match[4]);
  } else {
    console.log('\n4. ⚠️  Could not parse connection string format');
  }
} catch (e) {
  console.log('\n4. ⚠️  Error parsing connection string');
}

// Test connection
console.log('\n5. Testing Connection:');
console.log('   Attempting to connect...\n');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000, // 10 second timeout
})
.then(() => {
  console.log('   ✅ SUCCESS! Connected to MongoDB!');
  console.log('   Database:', mongoose.connection.db.databaseName);
  console.log('   Host:', mongoose.connection.host);
  mongoose.connection.close();
  process.exit(0);
})
.catch((err) => {
  console.log('   ❌ CONNECTION FAILED!\n');
  console.log('   Error Details:');
  console.log('   - Type:', err.name);
  console.log('   - Message:', err.message);
  
  if (err.message.includes('IP')) {
    console.log('\n   💡 SOLUTION: IP Whitelist Issue');
    console.log('   1. Go to: https://cloud.mongodb.com/v2#/security/network/whitelist');
    console.log('   2. Make sure 0.0.0.0/0 is added');
    console.log('   3. Status must be "Active" (green), not "Pending"');
    console.log('   4. Wait 5 minutes after adding IP');
  } else if (err.message.includes('authentication') || err.message.includes('bad auth')) {
    console.log('\n   💡 SOLUTION: Authentication Issue');
    console.log('   1. Check username and password in connection string');
    console.log('   2. Go to: https://cloud.mongodb.com/v2#/security/database/users');
    console.log('   3. Verify user exists and password is correct');
    console.log('   4. If password has special chars, URL encode them');
  } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
    console.log('\n   💡 SOLUTION: Network/DNS Issue');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify cluster name in connection string');
    console.log('   3. Try copying connection string fresh from Atlas');
  } else {
    console.log('\n   💡 Check the error message above for clues');
  }
  
  process.exit(1);
});

