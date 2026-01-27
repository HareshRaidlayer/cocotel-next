import { NextRequest, NextResponse } from 'next/server';
import { hotelSearchService } from '@/lib/hotel-search';
import type { SearchOptions } from '@/lib/hotel-search';
import { fallbackSearchService } from '@/lib/fallback-search';

// Check if Meilisearch is available
async function isMeilisearchAvailable() {
  try {
    const response = await fetch(`${process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700'}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.MEILISEARCH_MASTER_KEY || ''}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.log('Meilisearch not available:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const country = searchParams.get('country');
    const province = searchParams.get('province');
    const city = searchParams.get('city');
    const amenities = searchParams.get('amenities')?.split(',').filter(Boolean);
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const classification = searchParams.get('classification');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = parseInt(searchParams.get('radius') || '10000');

    const filters: Record<string, unknown> = {};
    if (country) filters.country = country;
    if (province) filters.province = province;
    if (city) filters.city = city;
    if (amenities) filters.amenities = amenities;
    if (tags) filters.tags = tags;
    if (classification) filters.classification = classification;
    if (lat && lng) {
      filters.location = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius
      };
    }
const options: SearchOptions = {
  limit,
  offset,
  filters,
};
    // Try Meilisearch first, fallback to simple search
    const useMeilisearch = await isMeilisearchAvailable();
    
    let results;
    if (useMeilisearch) {
      // results = await hotelSearchService.searchHotels(query, {
      //   limit,
      //   offset,
      //   filters
      // });
      results = await hotelSearchService.searchHotels(query, options);
    } else {
      console.log('Using fallback search (Meilisearch not available)');
      results = await fallbackSearchService.searchHotels(query, options);
      // results = await fallbackSearchService.searchHotels(query, {
      //   limit,
      //   offset,
      //   filters
      // });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'sync') {
      const useMeilisearch = await isMeilisearchAvailable();
      
      if (!useMeilisearch) {
        return NextResponse.json(
          { error: 'Meilisearch is not available. Please start Meilisearch server.' },
          { status: 503 }
        );
      }
      
      await hotelSearchService.initializeIndex();
      const result = await hotelSearchService.syncHotelsFromMongoDB();
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Search API POST error:', error);
    return NextResponse.json(
      { error: `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}