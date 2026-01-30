// scripts/sync-to-server.js
const { MeiliSearch } = require('meilisearch');

// Production client only (no local MeiliSearch needed)
const prodClient = new MeiliSearch({
  host: 'http://34.10.72.174:7700',
  apiKey: 'sIJwee6Nmr8tquBN0xlqeLJq/zf3vzFlF4DzqHefb08=',
});

async function syncData() {
  try {
    console.log('🔄 Checking production server...');
    
    const health = await prodClient.health();
    console.log('✅ Server status:', health.status);
    
    const indexes = await prodClient.getIndexes();
    console.log('✅ Found', indexes.results.length, 'indexes');
    
    console.log('🎉 Production server is ready!');
  } catch (error) {
    console.error('❌ Server check failed:', error.message);
  }
}

syncData();