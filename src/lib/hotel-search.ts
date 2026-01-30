import client, { HOTEL_INDEX } from './meilisearch';
import { fetchFromAPI } from './api';
import type { ApiResponseItem, AmenityApiItem, TagApiItem } from '@/types/hotel';

export interface SearchableHotel {
  id: string;
  name: string;
  companyName: string;
  city: string;
  province: string;
  country: string;
  address: string;
  description: string;
  amenities: string[];
  amenityNames: string[];
  tags: string[];
  tagNames: string[];
  latitude: number;
  longitude: number;
  classification: string;
  status: string;
  promo_active: boolean;
  primary_image: string;
  gallery_images: string[];
  slug: string;
  locationKeywords: string;
}

export interface SearchFilters {
  country?: string;
  province?: string;
  city?: string;
  amenities?: string[];
  tags?: string[];
  priceRange?: { min: number; max: number };
  classification?: string;
  location?: { lat: number; lng: number; radius: number };
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
  sort?: string[];
}

class HotelSearchService {
  private index = client.index(HOTEL_INDEX);

  async initializeIndex() {
    try {
      // Create index if it doesn't exist
      await client.createIndex(HOTEL_INDEX, { primaryKey: 'id' });
      
      // Configure searchable attributes with better location search
      await this.index.updateSearchableAttributes([
        'name',
        'companyName', 
        'city',
        'province',
        'country',
        'address',
        'description',
        'amenityNames',
        'tagNames',
        'classification',
        'locationKeywords'
      ]);

      // Configure filterable attributes
      await this.index.updateFilterableAttributes([
        'country',
        'province', 
        'city',
        'amenities',
        'tags',
        'classification',
        'status',
        'promo_active',
        'latitude',
        'longitude'
      ]);

      // Configure sortable attributes
      await this.index.updateSortableAttributes([
        'name',
        'city',
        'province'
      ]);

      // Configure ranking rules for better search relevance
      await this.index.updateRankingRules([
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness'
      ]);

      console.log('Meilisearch index initialized successfully');
    } catch (error) {
      console.error('Error initializing Meilisearch index:', error);
    }
  }

  async syncHotelsFromMongoDB() {
    try {
      console.log('Syncing hotels from MongoDB to Meilisearch...');
      
      // Fetch hotels from MongoDB
      // const hotelsData = await fetchFromAPI({
      const hotelsData = await fetchFromAPI<ApiResponseItem[]>({
        appName: "app3534482538357",
        moduleName: "company",
        query: {
          "sectionData.Company.is_deleted": false,
          "sectionData.Company.main_status": "Open",
        },
      });

      // Fetch amenities for mapping
      // const amenitiesData = await fetchFromAPI({
      const amenitiesData = await fetchFromAPI<AmenityApiItem[]>({

        appName: "app3534482538357", 
        moduleName: "amenities",
        query: {},
      });

      // Fetch tags for mapping
      // const tagsData = await fetchFromAPI({
      const tagsData = await fetchFromAPI<TagApiItem[]>({

        appName: "app3534482538357",
        moduleName: "tag", 
        query: {
          "sectionData.tag.is_active": true,
        },
      });

      // Create lookup maps
      // const amenityMap = new Map();
      const amenityMap = new Map<string, string>();
      amenitiesData.forEach(item => {
        amenityMap.set(item._id, item.sectionData.amenities.title);
      });

      // const tagMap = new Map();
      const tagMap = new Map<string, string>();
      tagsData.forEach(item => {
        tagMap.set(item._id, item.sectionData.tags.tag_name);
      });

      // Transform hotels for Meilisearch
      const searchableHotels: SearchableHotel[] = hotelsData.map(item => {
  const company = item.sectionData.Company;

  const amenityIds = company.amenities || [];
  const amenityNames = amenityIds
    .map((id: string) => amenityMap.get(id))
    .filter((v): v is string => Boolean(v));

  const tagIds = company.tag || [];
  const tagNames = tagIds
    .map((id: string) => tagMap.get(id))
    .filter((v): v is string => Boolean(v));

  return {
    id: item._id,
    name: company.web_title ?? company.companyName ?? company.name ?? 'Unknown Hotel',
    companyName: company.companyName ?? company.name ?? 'Unknown Company',
    city: company.web_city?.trim() ?? company.city ?? '',
    province: company.web_province ?? company.province ?? '',
    country: company.country ?? 'PH',
    address: `${company.address_line1 ?? ''} ${company.address_line2 ?? ''}`.trim(),
    description: company.description
      ? company.description.replace(/<[^>]*>/g, '')
      : '',
    amenities: amenityIds,
    amenityNames,
    tags: tagIds,
    tagNames,
    latitude: Number(company.latitude ?? 0),
    longitude: Number(company.longitude ?? 0),
    classification: company.prop_classification ?? 'Hotel',
    status: company.main_status ?? 'Open',
    promo_active: company.promo_active ?? false,
    primary_image: company.primary_image ?? '',
    gallery_images: company.gallery_image
      ? company.gallery_image.split(',')
      : [],
    slug: company.slug ?? '',
    locationKeywords: `${company.web_city ?? company.city ?? ''} ${
      company.web_province ?? company.province ?? ''
    } ${company.country ?? 'PH'} ${company.address_line1 ?? ''} airport near`.toLowerCase(),
  };
});
// const searchableHotels: SearchableHotel[] = hotelsData.map(item => {
//   const company = item.sectionData.Company;

//   const amenityIds = company.hotelamenities || [];
//   const amenityNames = amenityIds
//     .map((id: string) => amenityMap.get(id))
//     .filter((v): v is string => Boolean(v));

//   const tagIds = company.hoteltag || [];
//   const tagNames = tagIds
//     .map((id: string) => tagMap.get(id))
//     .filter((v): v is string => Boolean(v));

//   return {
//     id: item._id,
//     name: company.web_title ?? company.companyName ?? company.name ?? 'Unknown Hotel',
//     companyName: company.companyName ?? company.name ?? 'Unknown Company',
//     city: company.web_city?.trim() ?? company.city ?? '',
//     province: company.web_province ?? company.province ?? '',
//     country: company.country ?? 'PH',
//     address: `${company.address_line1 ?? ''} ${company.address_line2 ?? ''}`.trim(),
//     description: company.description
//       ? company.description.replace(/<[^>]*>/g, '')
//       : '',
//     amenities: amenityIds,
//     amenityNames,
//     tags: tagIds,
//     tagNames,
//     latitude: Number(company.latitude ?? 0),
//     longitude: Number(company.longitude ?? 0),
//     classification: company.prop_classification ?? 'Hotel',
//     status: company.main_status ?? 'Open',
//     promo_active: company.promo_active ?? false,
//     primary_image: company.primary_image ?? '',
//     gallery_images: company.gallery_image
//       ? company.gallery_image.split(',')
//       : [],
//     slug: company.slug ?? '',
//     locationKeywords: `${company.web_city ?? company.city ?? ''} ${
//       company.web_province ?? company.province ?? ''
//     } ${company.country ?? 'PH'} ${company.address_line1 ?? ''} airport near`.toLowerCase(),
//   };
// });


      // Add documents to Meilisearch
      const result = await this.index.addDocuments(searchableHotels);
      console.log(`Synced ${searchableHotels.length} hotels to Meilisearch. Task ID: ${result.taskUid}`);
      
      return result;
    } catch (error) {
      console.error('Error syncing hotels to Meilisearch:', error);
      throw error;
    }
  }

  async searchHotels(query: string, options: SearchOptions = {}) {
    try {
      const { limit = 20, offset = 0, filters, sort } = options;
      
      // Build filter string
      const filterArray: string[] = [];
      
      if (filters) {
        if (filters.country) {
          filterArray.push(`country = "${filters.country}"`);
        }
        if (filters.province) {
          filterArray.push(`province = "${filters.province}"`);
        }
        if (filters.city) {
          filterArray.push(`city = "${filters.city}"`);
        }
        if (filters.amenities && filters.amenities.length > 0) {
          const amenityFilters = filters.amenities.map(amenity => `amenities = "${amenity}"`);
          filterArray.push(`(${amenityFilters.join(' OR ')})`);
        }
        if (filters.tags && filters.tags.length > 0) {
          const tagFilters = filters.tags.map(tag => `tags = "${tag}"`);
          filterArray.push(`(${tagFilters.join(' OR ')})`);
        }
        if (filters.classification) {
          filterArray.push(`classification = "${filters.classification}"`);
        }
        // Always filter for active hotels
        filterArray.push('status = "Open"');
      }

      // Geo-search filter
      if (filters?.location) {
        const { lat, lng, radius } = filters.location;
        filterArray.push(`_geoRadius(${lat}, ${lng}, ${radius})`);
      }

      const searchParams: Record<string, unknown> = {
        limit,
        offset,
        attributesToHighlight: ['name', 'city', 'province', 'description'],
        attributesToCrop: ['description'],
        cropLength: 100,
      };

      if (filterArray.length > 0) {
        searchParams.filter = filterArray;
      }

      if (sort && sort.length > 0) {
        searchParams.sort = sort;
      }

      const results = await this.index.search(query, searchParams);
      
      return {
        hits: results.hits,
        totalHits: results.estimatedTotalHits,
        processingTimeMs: results.processingTimeMs,
        query: results.query,
        limit: results.limit,
        offset: results.offset,
      };
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  }

  async getAutocompleteSuggestions(query: string, limit: number = 8) {
    try {
      // Search for both hotels and locations
      const results = await this.index.search(query, {
        limit: limit * 2,
        attributesToRetrieve: ['name', 'city', 'province', 'country', 'classification', 'slug'],
        attributesToHighlight: ['name', 'city', 'province'],
      });

      // const suggestions = [];
//       const suggestions: {
//   id: string;
//   name: string;
//   location: string;
//   type: 'hotel' | 'location';
//   highlighted: any;
// }[] = [];
const suggestions: {
  id: string;
  name: string;
  location: string;
  type: 'hotel' | 'location';
  slug?: string;
  highlighted: Record<string, unknown>;
}[] = [];


      const seenLocations = new Set();

      // Add hotel suggestions
      results.hits.slice(0, Math.floor(limit / 2)).forEach(hit => {
        suggestions.push({
          id: hit.id,
          name: hit.name,
          location: `${hit.city}, ${hit.province}`,
          type: 'hotel',
          slug: hit.slug,
          highlighted: hit._formatted ?? {}
        });
      });

      // Add unique location suggestions
      results.hits.forEach(hit => {
        const locationKey = `${hit.city}, ${hit.province}`;
        if (!seenLocations.has(locationKey) && suggestions.length < limit) {
          seenLocations.add(locationKey);
          suggestions.push({
            id: `location-${hit.city}-${hit.province}`,
            name: hit.city,
            location: `${hit.city}, ${hit.province}`,
            type: 'location',
            highlighted: { name: hit.city, city: hit.city }
          });
        }
      });

      return suggestions.slice(0, limit);
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      return [];
    }
  }

  async getHotelsByLocation(lat: number, lng: number, radius: number = 10000) {
    try {
      const results = await this.index.search('', {
        filter: [`_geoRadius(${lat}, ${lng}, ${radius})`],
        sort: [`_geoPoint(${lat}, ${lng}):asc`],
        limit: 50
      });

      return results.hits;
    } catch (error) {
      console.error('Error getting hotels by location:', error);
      return [];
    }
  }

  async getFacets() {
    try {
      const results = await this.index.search('', {
        facets: ['country', 'province', 'city', 'classification', 'amenityNames', 'tagNames'],
        limit: 0
      });

      return results.facetDistribution;
    } catch (error) {
      console.error('Error getting facets:', error);
      return {};
    }
  }
}

export const hotelSearchService = new HotelSearchService();