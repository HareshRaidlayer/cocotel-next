import { hotelSearchService } from '../src/lib/hotel-search.js';

async function syncData() {
  try {
    console.log('🚀 Starting Meilisearch data sync...');
    
    // Initialize the index
    console.log('📋 Initializing Meilisearch index...');
    await hotelSearchService.initializeIndex();
    
    // Sync hotel data
    console.log('🏨 Syncing hotel data from MongoDB...');
    const result = await hotelSearchService.syncHotelsFromMongoDB();
    
    console.log('✅ Data sync completed successfully!');
    console.log(`Task ID: ${result.taskUid}`);
    
    // Wait a bit for indexing to complete
    console.log('⏳ Waiting for indexing to complete...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🎉 All done! Your Meilisearch index is ready.');
    
  } catch (error) {
    console.error('❌ Error during data sync:', error);
    process.exit(1);
  }
}

syncData();