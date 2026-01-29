// Simple script to sync data with Meilisearch
async function syncData() {
  try {
    console.log('Syncing data with Meilisearch...');
    
    const response = await fetch('http://localhost:3000/api/search/hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'sync' }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Sync successful:', result);
    } else {
      const error = await response.json();
      console.error('Sync failed:', error);
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

syncData();