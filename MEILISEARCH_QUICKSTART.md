# Meilisearch Integration - Quick Start Guide

## 🚀 What's Been Implemented

Your Next.js hotel booking website now has **fast, intelligent search** powered by Meilisearch! Here's what you get:

### ✨ Features
- **Lightning-fast search** (sub-millisecond response times)
- **Autocomplete suggestions** as users type
- **Typo tolerance** (finds "Manilla" when searching for "Manila")
- **Geo-search** capabilities for location-based results
- **Advanced filtering** by amenities, tags, price, etc.
- **Faceted search** with dynamic filters
- **SEO-friendly URLs** with search parameters

### 🏗️ Architecture
```
[User Browser] → [SearchBar Component] → [Next.js API] → [Meilisearch] → [MongoDB]
```

## 📁 Files Created/Modified

### New Files:
- `src/lib/meilisearch.ts` - Meilisearch client configuration
- `src/lib/hotel-search.ts` - Search service with all functionality
- `src/app/api/search/hotels/route.ts` - Hotel search API endpoint
- `src/app/api/search/autocomplete/route.ts` - Autocomplete API endpoint
- `src/app/admin/page.tsx` - Admin panel for data sync
- `scripts/sync-data.js` - Data synchronization script
- `MEILISEARCH_SETUP.md` - Complete server setup guide

### Modified Files:
- `src/components/SearchBar.jsx` - Added autocomplete and search functionality
- `src/app/hotellist/page.tsx` - Integrated search results display
- `.env` - Added Meilisearch configuration
- `package.json` - Added sync scripts

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
# Run the installation script
npm run install-meilisearch

# Or manually install
npm install meilisearch
```

### 2. Configure Environment Variables
Update your `.env` file:
```env
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_MASTER_KEY=your-secure-master-key
```

### 3. Start Meilisearch Server
```bash
# Download and run Meilisearch
curl -L https://install.meilisearch.com | sh
./meilisearch --master-key your-secure-master-key
```

### 4. Sync Your Data
Option A - Using Admin Panel:
1. Start your Next.js app: `npm run dev`
2. Visit: `http://localhost:3000/admin`
3. Click "Sync Data"

Option B - Using Script:
```bash
npm run sync-search
```

### 5. Test the Search
1. Go to your homepage
2. Start typing in the search bar
3. See autocomplete suggestions appear
4. Perform a search and see results on `/hotellist`

## 🔧 How It Works

### Search Flow:
1. **User types** in SearchBar component
2. **Autocomplete API** (`/api/search/autocomplete`) provides suggestions
3. **User submits search** → redirects to `/hotellist` with query parameters
4. **Hotel List page** calls search API (`/api/search/hotels`)
5. **Meilisearch** returns ranked, filtered results
6. **Results displayed** with highlighting and filters

### Data Sync Process:
1. **Fetch hotels** from your MongoDB via existing API
2. **Transform data** into searchable format
3. **Index in Meilisearch** with proper attributes
4. **Configure search settings** (ranking, filters, etc.)

## 🎯 Search Capabilities

### What Users Can Search:
- Hotel names
- Cities and locations
- Provinces/states
- Amenities (pool, wifi, etc.)
- Descriptions
- Classifications (resort, hotel, etc.)

### Advanced Features:
- **Typo tolerance**: "Boracy" finds "Boracay"
- **Partial matching**: "Man" finds "Manila"
- **Geo-search**: Find hotels within radius
- **Faceted filters**: Filter by country, amenities, etc.
- **Ranking**: Most relevant results first

## 🌐 Production Deployment

### Server Setup:
1. Follow the complete guide in `MEILISEARCH_SETUP.md`
2. Install Meilisearch on your Ubuntu server
3. Configure as systemd service
4. Set up SSL with Nginx reverse proxy
5. Update environment variables for production

### Environment Variables for Production:
```env
MEILISEARCH_HOST=https://your-search-domain.com
MEILISEARCH_MASTER_KEY=your-production-master-key
```

## 🔍 Testing Your Implementation

### 1. Basic Search Test:
- Search for "Manila" → should show Manila hotels
- Search for "Manilla" (typo) → should still show Manila hotels

### 2. Autocomplete Test:
- Type "Bor" → should suggest "Boracay" hotels
- Type "El Pueblo" → should suggest "El Pueblo De Hermano"

### 3. Filter Test:
- Search with country filter → only shows hotels from that country
- Use amenity filters → results update accordingly

### 4. Performance Test:
- Search should return results in < 50ms
- Autocomplete should respond in < 20ms

## 📊 Monitoring & Maintenance

### Health Checks:
```bash
# Check if Meilisearch is running
curl http://localhost:7700/health

# Check index status
curl -H "Authorization: Bearer your-master-key" \
  http://localhost:7700/indexes/hotels/stats
```

### Regular Tasks:
- **Data Sync**: Run weekly or when hotel data changes
- **Index Optimization**: Monitor search performance
- **Backup**: Regular backups of search index

## 🚨 Troubleshooting

### Common Issues:

1. **Search not working**:
   - Check if Meilisearch is running
   - Verify environment variables
   - Check browser console for API errors

2. **No autocomplete suggestions**:
   - Ensure data is synced
   - Check network requests in browser dev tools
   - Verify API endpoints are accessible

3. **Slow search performance**:
   - Check server resources
   - Optimize Meilisearch settings
   - Consider index optimization

### Debug Commands:
```bash
# Check Meilisearch logs
journalctl -u meilisearch -f

# Test API endpoints
curl http://localhost:3000/api/search/hotels?q=manila
curl http://localhost:3000/api/search/autocomplete?q=man
```

## 🎉 You're All Set!

Your hotel search is now powered by Meilisearch! Users will experience:
- ⚡ **Instant search results**
- 🎯 **Smart autocomplete**
- 🔍 **Typo-tolerant search**
- 📍 **Location-based results**
- 🎛️ **Advanced filtering**

For any issues, refer to the detailed setup guide in `MEILISEARCH_SETUP.md` or check the troubleshooting section above.