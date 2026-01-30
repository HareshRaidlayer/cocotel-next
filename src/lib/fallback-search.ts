import { fetchFromAPI } from './api';

type SearchOptions = {
  limit?: number;
  offset?: number;
};

export class FallbackSearchService {
  // async searchHotels(query = '', options = {}) {
  async searchHotels(query = '', options: SearchOptions = {}) {

    try {
      console.log('Using fallback search for query:', query);
      
      // Fetch all hotels from MongoDB
      const hotelsData = await fetchFromAPI({
        appName: "app3534482538357",
        moduleName: "company",
        query: {
          "sectionData.Company.is_deleted": false,
          "sectionData.Company.main_status": "Open",
        },
      });

      if (!hotelsData || !Array.isArray(hotelsData)) {
        console.warn('No hotels data received from API');
        return {
          hits: [],
          totalHits: 0,
          processingTimeMs: 0,
          query,
          limit: options.limit || 20,
          offset: options.offset || 0,
        };
      }

      // Simple text search
      let filtered = hotelsData;
      
      if (query && query.trim()) {
        const searchText = query.toLowerCase().trim();
        filtered = hotelsData.filter(item => {
          const company = item?.sectionData?.Company;
          if (!company) return false;
          
          return (
            company.name?.toLowerCase().includes(searchText) ||
            company.companyName?.toLowerCase().includes(searchText) ||
            company.web_title?.toLowerCase().includes(searchText) ||
            company.web_city?.toLowerCase().includes(searchText) ||
            company.web_province?.toLowerCase().includes(searchText) ||
            company.address_line1?.toLowerCase().includes(searchText)
          );
        });
      }

      // Transform to expected format
      const hits = filtered.map(item => {
        const company = item?.sectionData?.Company || {};
        return {
          id: item._id,
          name: company.web_title || company.companyName || company.name || 'Unnamed Hotel',
          companyName: company.companyName || company.name || '',
          city: company.web_city?.trim() || company.city || '',
          province: company.web_province || company.province || '',
          country: company.country || 'PH',
          address: `${company.address_line1 || ''} ${company.address_line2 || ''}`.trim(),
          description: company.description || '',
          amenities: company.amenities ? company.amenities.split(',').filter(Boolean) : [],
          tags: company.collection ? company.collection.split(',').filter(Boolean) : [],
          latitude: parseFloat(company.latitude) || 0,
          longitude: parseFloat(company.longitude) || 0,
          classification: company.prop_classification || 'Hotel',
          status: company.main_status || 'Open',
          promo_active: company.promo_active || false,
          primary_image: company.primary_image || '',
          gallery_images: company.gallery_image ? company.gallery_image.split(',').filter(Boolean) : [],
          slug: company.slug || ''
        };
      });

      return {
        hits: hits.slice(0, options.limit || 20),
        totalHits: hits.length,
        processingTimeMs: 50,
        query,
        limit: options.limit || 20,
        offset: options.offset || 0,
      };
    } catch (error) {
      console.error('Fallback search error:', error);
      return {
        hits: [],
        totalHits: 0,
        processingTimeMs: 0,
        query,
        limit: 0,
        offset: 0,
      };
    }
  }

  // async getAutocompleteSuggestions(query, limit = 5) {
  async getAutocompleteSuggestions(query: string, limit = 5) {

    try {
      const results = await this.searchHotels(query, { limit });
      return results.hits.map(hit => ({
        id: hit.id,
        name: hit.name,
        location: `${hit.city}, ${hit.province}`,
        type: 'hotel',
        slug: hit.slug,
        highlighted: { name: hit.name, city: hit.city }
      }));
    } catch (error) {
      console.error('Fallback autocomplete error:', error);
      return [];
    }
  }
}

export const fallbackSearchService = new FallbackSearchService();