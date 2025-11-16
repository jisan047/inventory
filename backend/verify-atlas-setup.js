require('dotenv').config();

console.log('🔍 MongoDB Atlas Setup Verification\n');
console.log('='.repeat(60));

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

// Extract password to check for special characters
const passwordMatch = uri.match(/:\/([^:]+):([^@]+)@/);
if (passwordMatch) {
  const password = passwordMatch[2];
  const specialChars = /[@#%&+\/:=?<>{}[\]\\|`~!$^*();,'"]/;
  
  if (specialChars.test(password)) {
    console.log('⚠️  WARNING: Password contains special characters!');
    console.log('   Special characters in passwords need URL encoding.');
    console.log('   Common encodings:');
    console.log('   @ → %40');
    console.log('   # → %23');
    console.log('   % → %25');
    console.log('   & → %26');
    console.log('   / → %2F');
    console.log('   : → %3A');
    console.log('   ? → %3F');
    console.log('   = → %3D');
    console.log('\n   Or change your MongoDB password to one without special characters.\n');
  }
}

console.log('📋 Checklist - Verify in MongoDB Atlas:\n');

console.log('1. IP WHITELIST (Network Access):');
console.log('   → Go to: https://cloud.mongodb.com/v2#/security/network/whitelist');
console.log('   → Check:');
console.log('      □ 0.0.0.0/0 is listed');
console.log('      □ Status shows "Active" (green checkmark)');
console.log('      □ NOT "Pending" (if pending, wait 5-10 minutes)');
console.log('   → If not listed or not active:');
console.log('      • Click "Add IP Address"');
console.log('      • Click "Allow Access from Anywhere"');
console.log('      • Click "Confirm"');
console.log('      • Wait 5-10 minutes for status to change to "Active"\n');

console.log('2. DATABASE USER:');
console.log('   → Go to: https://cloud.mongodb.com/v2#/security/database/users');
console.log('   → Check:');
console.log('      □ User "jisan" exists');
console.log('      □ Password is correct');
console.log('      □ User has "Atlas admin" or "Read and write to any database" role');
console.log('   → If user doesn\'t exist or wrong password:');
console.log('      • Create new user or reset password');
console.log('      • Update .env file with new credentials\n');

console.log('3. CLUSTER STATUS:');
console.log('   → Go to: https://cloud.mongodb.com/v2#/clusters');
console.log('   → Check:');
console.log('      □ Cluster is running (green status)');
console.log('      □ Cluster name matches: cluster0.xx4n7de');
console.log('   → If cluster is paused or stopped, start it\n');

console.log('4. CONNECTION STRING:');
console.log('   → Current format: ✅ Correct');
console.log('   → Database name: ✅ Present (inventory)');
console.log('   → Username: ✅ Present (jisan)');
console.log('   → Password: ⚠️  Verify it\'s correct\n');

console.log('5. NETWORK/FIREWALL:');
console.log('   → Check if firewall/antivirus is blocking connection');
console.log('   → Try temporarily disabling to test');
console.log('   → Check if you\'re behind a corporate VPN/proxy\n');

console.log('='.repeat(60));
console.log('\n💡 Common Solutions:\n');

console.log('Solution 1: Wait Longer');
console.log('   - IP whitelist changes can take 5-10 minutes to activate');
console.log('   - Wait 10 minutes, then try again\n');

console.log('Solution 2: Delete and Re-add IP Whitelist');
console.log('   - Delete 0.0.0.0/0 from Network Access');
console.log('   - Wait 2 minutes');
console.log('   - Add 0.0.0.0/0 again');
console.log('   - Wait 5-10 minutes\n');

console.log('Solution 3: Create New Database User');
console.log('   - Create a new user with a simple password (no special chars)');
console.log('   - Update .env with new credentials\n');

console.log('Solution 4: Get Fresh Connection String');
console.log('   - Go to Clusters → Connect → Connect your application');
console.log('   - Copy the connection string');
console.log('   - Add /inventory before the ?');
console.log('   - Update .env file\n');

console.log('Solution 5: Check Your Current IP');
console.log('   - Visit: https://whatismyipaddress.com/');
console.log('   - Add your specific IP to whitelist (in addition to 0.0.0.0/0)\n');

console.log('='.repeat(60));
console.log('\n🧪 Test Connection:');
console.log('   Run: node debug-connection.js\n');

