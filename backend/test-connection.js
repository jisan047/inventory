require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...\n');

// Hide password in connection string for security
const connectionString = process.env.MONGODB_URI || 'Not set';
const maskedString = connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');

console.log('Connection String:', maskedString);
console.log('Database:', connectionString.includes('/inventory') ? 'inventory' : 'Not specified');
console.log('');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory', {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB connection established!');
  console.log('✅ You can now start your server with: npm start');
  mongoose.connection.close();
  process.exit(0);
})
.catch((err) => {
  console.error('❌ CONNECTION FAILED!\n');
  console.error('Error Type:', err.name);
  console.error('Error Message:', err.message);
  console.error('');
  
  if (err.message.includes('IP')) {
    console.error('💡 SOLUTION: Check MongoDB Atlas Network Access');
    console.error('   1. Go to MongoDB Atlas → Network Access');
    console.error('   2. Make sure 0.0.0.0/0 is added and status is "Active"');
    console.error('   3. Wait 2-3 minutes after adding IP');
  } else if (err.message.includes('authentication')) {
    console.error('💡 SOLUTION: Check your username and password');
    console.error('   1. Go to MongoDB Atlas → Database Access');
    console.error('   2. Verify username and password are correct');
    console.error('   3. If password has special characters, URL encode them');
  } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
    console.error('💡 SOLUTION: Check your connection string');
    console.error('   1. Verify cluster name is correct');
    console.error('   2. Check internet connection');
    console.error('   3. Try copying connection string from Atlas again');
  } else {
    console.error('💡 Check the error message above for clues');
  }
  
  console.error('');
  process.exit(1);
});

