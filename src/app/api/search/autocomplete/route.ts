import { NextRequest, NextResponse } from 'next/server';
import { hotelSearchService } from '@/lib/hotel-search';
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
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Try Meilisearch first, fallback to simple search
    const useMeilisearch = await isMeilisearchAvailable();
    
    let results;
    if (useMeilisearch) {
      results = await hotelSearchService.getAutocompleteSuggestions(query, limit);
    } else {
      console.log('Using fallback autocomplete (Meilisearch not available)');
      results = await fallbackSearchService.getAutocompleteSuggestions(query, limit);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Autocomplete API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}