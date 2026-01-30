// scripts/test-connection.js
const { MeiliSearch } = require('meilisearch');

async function testConnection() {
  try {
    console.log('🔍 Testing MeiliSearch connection...');
    console.log('Host: http://34.10.72.174:7700');
    
    const client = new MeiliSearch({
      host: 'http://34.10.72.174:7700',
      apiKey: 'sIJwee6Nmr8tquBN0xlqeLJq/zf3vzFlF4DzqHefb08=',
    });

    // Test connection
    const health = await client.health();
    console.log('✅ Health check:', health);

    // Test getting indexes
    const indexes = await client.getIndexes();
    console.log('✅ Indexes:', indexes.results.length, 'found');

    console.log('🎉 MeiliSearch connection test PASSED!');
    
  } catch (error) {
    console.error('❌ Connection test FAILED:', error.message);
  }
}

testConnection();