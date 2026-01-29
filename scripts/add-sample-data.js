// scripts/add-sample-data.js
const { MeiliSearch } = require('meilisearch');

const client = new MeiliSearch({
  host: 'http://34.10.72.174:7700',
  apiKey: 'sIJwee6Nmr8tquBN0xlqeLJq/zf3vzFlF4DzqHefb08=',
});

async function addSampleData() {
  try {
    console.log('🏨 Adding sample hotel data...');
    
    const hotelsIndex = client.index('hotels');
    
    const sampleHotels = [
      {
        id: 1,
        name: 'RSAM Beach Resort by Cocotel',
        location: 'Siargao, Philippines',
        price: 5833,
        rating: 4.5,
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant'],
        description: 'Beautiful beachfront resort with modern amenities'
      },
      {
        id: 2,
        name: 'Cocotel Urban Resort',
        location: 'Manila, Philippines',
        price: 3500,
        rating: 4.2,
        amenities: ['WiFi', 'Gym', 'Restaurant', 'Parking'],
        description: 'Modern urban resort in the heart of the city'
      },
      {
        id: 3,
        name: 'Cocotel Mountain Lodge',
        location: 'Baguio, Philippines',
        price: 2800,
        rating: 4.7,
        amenities: ['WiFi', 'Fireplace', 'Mountain View', 'Restaurant'],
        description: 'Cozy mountain retreat with stunning views'
      }
    ];

    await hotelsIndex.addDocuments(sampleHotels);
    console.log('✅ Sample hotels added successfully');

    // Configure search settings
    await hotelsIndex.updateSettings({
      searchableAttributes: ['name', 'location', 'description', 'amenities'],
      filterableAttributes: ['price', 'rating', 'location'],
      sortableAttributes: ['price', 'rating'],
    });
    console.log('✅ Search settings configured');

    // Test search
    const searchResults = await hotelsIndex.search('beach');
    console.log('🔍 Search test results:', searchResults.hits.length, 'hotels found');

    console.log('🎉 Sample data setup completed!');
    
  } catch (error) {
    console.error('❌ Failed to add sample data:', error.message);
  }
}

addSampleData();