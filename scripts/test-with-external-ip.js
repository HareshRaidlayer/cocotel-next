// scripts/test-with-external-ip.js
// Replace EXTERNAL_IP with the IP from 'curl ifconfig.me'
const { MeiliSearch } = require('meilisearch');

const EXTERNAL_IP = '34.10.72.174'; // Get this from: curl ifconfig.me

async function testConnection() {
  try {
    console.log('🔍 Testing MeiliSearch connection...');
    console.log(`Host: http://${EXTERNAL_IP}:7700`);
    
    const client = new MeiliSearch({
      host: `http://${EXTERNAL_IP}:7700`,
      apiKey: 'sIJwee6Nmr8tquBN0xlqeLJq/zf3vzFlF4DzqHefb08=',
    });

    const health = await client.health();
    console.log('✅ Health check:', health);

    const indexes = await client.getIndexes();
    console.log('✅ Indexes:', indexes.results.length, 'found');
    
    console.log('🎉 MeiliSearch connection test PASSED!');
    
  } catch (error) {
    console.error('❌ Connection test FAILED:', error.message);
  }
}

testConnection();