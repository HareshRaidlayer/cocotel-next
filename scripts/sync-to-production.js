// scripts/sync-to-production.js
const { MeiliSearch } = require('meilisearch');
require('dotenv').config();

// Local MeiliSearch client
const localClient = new MeiliSearch({
  host: 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY || '',
});

// Production MeiliSearch client
const productionClient = new MeiliSearch({
  host: process.env.PRODUCTION_MEILISEARCH_HOST,
  apiKey: process.env.PRODUCTION_MEILISEARCH_MASTER_KEY,
});

async function syncToProduction() {
  try {
    console.log('Starting sync to production...');
    
    // Get all indexes from local
    const localIndexes = await localClient.getIndexes();
    
    for (const indexInfo of localIndexes.results) {
      const indexName = indexInfo.uid;
      console.log(`Syncing index: ${indexName}`);
      
      // Get documents from local index
      const localIndex = localClient.index(indexName);
      const documents = await localIndex.getDocuments({ limit: 10000 });
      
      // Create/update production index
      const productionIndex = productionClient.index(indexName);
      
      if (documents.results.length > 0) {
        await productionIndex.addDocuments(documents.results);
        console.log(`✓ Synced ${documents.results.length} documents to ${indexName}`);
      }
      
      // Sync settings
      const settings = await localIndex.getSettings();
      await productionIndex.updateSettings(settings);
      console.log(`✓ Synced settings for ${indexName}`);
    }
    
    console.log('✅ Sync completed successfully!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Add production environment variables to your .env file:
// PRODUCTION_MEILISEARCH_HOST=http://YOUR_SERVER_IP:7700
// PRODUCTION_MEILISEARCH_MASTER_KEY=your_production_master_key

syncToProduction();