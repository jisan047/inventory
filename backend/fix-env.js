const fs = require('fs');
const path = require('path');

console.log('🔧 MongoDB Connection String Fixer\n');

const envPath = path.join(__dirname, '.env');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Creating .env file...\n');
  
  const defaultEnv = `PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=change_this_to_a_random_32_character_string_in_production
ADMIN_EMAIL=admin@inventory.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
`;
  
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ Created .env file. Please add your MongoDB connection string.');
  process.exit(0);
}

// Read .env file
let envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

console.log('Current .env file:');
console.log('-'.repeat(50));

let foundMongoUri = false;
let needsFix = false;

const newLines = lines.map(line => {
  if (line.startsWith('MONGODB_URI=')) {
    foundMongoUri = true;
    const uri = line.substring('MONGODB_URI='.length).trim();
    
    console.log('\nCurrent MONGODB_URI:');
    console.log(uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'));
    
    // Check if database name is missing
    if (!uri.includes('/inventory') && !uri.includes('/?') && uri.includes('mongodb+srv://')) {
      needsFix = true;
      console.log('\n⚠️  Database name missing!');
      
      // Fix the connection string
      let fixedUri = uri;
      
      // Remove ?appName=... if present
      fixedUri = fixedUri.replace(/\?appName=[^&]*/, '');
      
      // Add /inventory before ? or at the end
      if (fixedUri.includes('?')) {
        fixedUri = fixedUri.replace('?', '/inventory?');
      } else if (fixedUri.endsWith('/')) {
        fixedUri = fixedUri + 'inventory?retryWrites=true&w=majority';
      } else if (!fixedUri.includes('/')) {
        // No slash at all, add it
        const match = fixedUri.match(/(mongodb\+srv:\/\/[^@]+@[^/]+)(.*)/);
        if (match) {
          fixedUri = match[1] + '/inventory?retryWrites=true&w=majority';
        }
      } else {
        // Has slash but no database name
        fixedUri = fixedUri.replace(/(mongodb\+srv:\/\/[^@]+@[^/]+)\//, '$1/inventory?retryWrites=true&w=majority');
      }
      
      // Ensure retryWrites and w=majority are present
      if (!fixedUri.includes('retryWrites')) {
        if (fixedUri.includes('?')) {
          fixedUri += '&retryWrites=true&w=majority';
        } else {
          fixedUri += '?retryWrites=true&w=majority';
        }
      }
      
      console.log('\n✅ Fixed MONGODB_URI:');
      console.log(fixedUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'));
      console.log('\n⚠️  Please verify the password is correct!');
      
      return 'MONGODB_URI=' + fixedUri;
    } else if (uri.includes('/inventory')) {
      console.log('\n✅ Database name is present');
    }
    
    return line;
  }
  return line;
});

if (!foundMongoUri) {
  console.log('❌ MONGODB_URI not found in .env file');
  console.log('Please add: MONGODB_URI=your_connection_string');
  process.exit(1);
}

if (needsFix) {
  console.log('\n' + '='.repeat(50));
  console.log('Would you like to update the .env file? (This will modify your .env file)');
  console.log('Please review the fixed connection string above.');
  console.log('\nTo apply the fix manually:');
  console.log('1. Open backend/.env');
  console.log('2. Find MONGODB_URI line');
  console.log('3. Make sure it includes /inventory before the ?');
  console.log('4. Format: ...mongodb.net/inventory?retryWrites=true&w=majority');
  console.log('\nExample:');
  console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory?retryWrites=true&w=majority');
} else {
  console.log('\n✅ Connection string format looks correct!');
  console.log('If you\'re still getting connection errors, check:');
  console.log('1. IP whitelist in MongoDB Atlas (0.0.0.0/0 must be Active)');
  console.log('2. Username and password are correct');
  console.log('3. Wait 5 minutes after adding IP whitelist');
}

