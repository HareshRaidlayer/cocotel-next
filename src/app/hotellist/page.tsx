"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HotelListMain from "@/components/hotellistComponent/HotelListMain";
import { fetchFromAPI } from "@/lib/api";
import { Hotel, ApiResponseItem, AmenityApiItem, TagApiItem, MeiliHotelHit, MeiliSearchResponse } from "@/types/hotel";

const ITEMS_PER_PAGE = 12;
// interface Props {
//   hotels: Hotel[];
//   amenities: AmenityApiItem[];
//   tags: TagApiItem[];
//   selectedAmenities: string[];
//   selectedTags: string[];
//   onAmenityChange: (ids: string[]) => void;
//   onTagChange: (ids: string[]) => void;
// }

function HotelListContent() {
  const searchParams = useSearchParams();
  const [initialLoading, setInitialLoading] = useState(true);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [searchResults, setSearchResults] = useState<MeiliSearchResponse<MeiliHotelHit> | null>(null);


  // const [searchResults, setSearchResults] = useState<Record<string, unknown> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [amenities, setAmenities] = useState<AmenityApiItem[]>([]);
  const [tags, setTags] = useState<TagApiItem[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Transform Meilisearch hit to Hotel format
  // const transformSearchHitToHotel = (hit: Record<string, unknown>): Hotel => {
  const transformSearchHitToHotel = (hit: MeiliHotelHit): Hotel => {

    return {
      id: hit.id,
      name: hit.name,
      location: `${hit.address}, ${hit.province}`,
      price: 0,
      rating: 5,
      reviews: 0,
      discount: "40% OFF",
      description: hit.description,
      save: hit.promo_active ? "Best Deal" : "",
      image: hit.primary_image?.trim() || "/images/hotel-placeholder.jpg",
      gallery: hit.gallery_images ?? [],
      category: hit.classification || "Hotel",
      distance: hit.city?.trim() || "",
      breakfast: hit.description?.toLowerCase().includes("breakfast") || false,
      parking: hit.description?.toLowerCase().includes("parking")
        ? "Available"
        : "Not available",
      hotelamenities: hit.amenities ?? [],
      hoteltag: hit.tags ?? [],
    };
  };

  // Filter hotels based on selected amenities and tags
  const filteredHotels = useMemo(() => {
    const hotelsToFilter = isSearchMode && searchResults ? 
      // searchResults.hits.map((hit: Record<string, unknown>) => transformSearchHitToHotel(hit)) : 
      searchResults.hits.map((hit) =>
  transformSearchHitToHotel(hit)
)
:
      allHotels;

    return hotelsToFilter.filter((hotel: Hotel) => {
      // Check amenities filter - ALL selected amenities must be present
      if (selectedAmenities.length > 0) {
        const hotelAmenities = hotel.hotelamenities || [];
        const hasAllAmenities = selectedAmenities.every(amenityId =>
          hotelAmenities.includes(amenityId)
        );
        if (!hasAllAmenities) return false;
      }

      // Check tags filter - ALL selected tags must be present
      if (selectedTags.length > 0) {
        const hotelTags = hotel.hoteltag || [];
        const hasAllTags = selectedTags.every(tagId =>
          hotelTags.includes(tagId)
        );
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [allHotels, searchResults, selectedAmenities, selectedTags, isSearchMode]);

  const handleAmenityChange = (ids: string[]) => {
    setSelectedAmenities(ids);
    setCurrentPage(1);
  };

  const handleTagChange = (ids: string[]) => {
    setSelectedTags(ids);
  };

  // Perform search using Meilisearch
  const performSearch = useCallback(async () => {
    if (!searchParams) return;
    
    const query = searchParams.get('q') || '';
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const province = searchParams.get('province');
    
    if (!query && !country && !city && !province) {
      setIsSearchMode(false);
      return;
    }

    try {
      setIsSearchMode(true);
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (country) params.set('country', country);
      if (city) params.set('city', city);
      if (province) params.set('province', province);
      params.set('limit', '100'); // Get more results for client-side filtering

      const response = await fetch(`/api/search/hotels?${params.toString()}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setIsSearchMode(false);
    }
  }, [searchParams]);


  useEffect(() => {
    performSearch();
  }, [performSearch]);

  //hotellist fetch
  useEffect(() => {
    async function loadHotels() {
      try {
        const data = await fetchFromAPI<ApiResponseItem[]>({
          appName: "app3534482538357",
          moduleName: "company",
          query: {
            "sectionData.Company.is_deleted": false,
            "sectionData.Company.main_status": "Open",
          },
        });

        const mappedHotels: Hotel[] = data.map((item) => {
          const c = item.sectionData.Company;

          return {
            id: item._id,
            name: c.web_title || c.companyName,
            location: `${c.address_line1}, ${c.web_province}`,
            price: 2300,
            rating: 4.5,
            reviews: 0,
            discount: "25% OFF",
            description: c.description,
            save: c.promo_active ? "Best Deal" : "",
            image: c.primary_image?.trim() || "/images/hotel-placeholder.jpg",
            gallery: c.gallery_image?.split(",") ?? [],
            category: c.prop_classification || "Hotel",
            distance: c.web_city?.trim() || "",
            breakfast: c.description?.toLowerCase().includes("breakfast") || false,
            parking: c.description?.toLowerCase().includes("parking")
              ? "Available"
              : "Not available",
            hotelamenities: c.hotelamenities || [],
            hoteltag: c.hoteltag || [],
          };
        });

        setAllHotels(mappedHotels);
      } catch (error) {
        console.error("Hotel fetch error:", error);
      } finally {
        setInitialLoading(false);
      }
    }

    loadHotels();
  }, []);

  useEffect(() => {
    async function loadFilters() {
      try {
        const amenityData = await fetchFromAPI<AmenityApiItem[]>({
          appName: "app3534482538357",
          moduleName: "amenities",
          query: {},
        });

        const tagData = await fetchFromAPI<TagApiItem[]>({
          appName: "app3534482538357",
          moduleName: "tag",
          query: {
            "sectionData.tag.is_active": true,
          },
        });

        setAmenities(amenityData);
        setTags(tagData);
      } catch (err) {
        console.error("Filter fetch error", err);
      }
    }

    loadFilters();
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredHotels.length / ITEMS_PER_PAGE)
  );

  const hotelsToShow = filteredHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const getPaginationPages = (current: number, total: number) => {
    const pages: (number | "...")[] = [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push("...");

    pages.push(total);

    return pages;
  };

  // ✅ Skeleton loader (FAST UI)
  if (initialLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <div
            key={i}
            className="h-72 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search Results Info */}
      {/* {isSearchMode && searchResults && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Search Results
            </h2>
            <p className="text-green-700">
              Found {searchResults.totalHits} hotels in {searchResults.processingTimeMs}ms
              {searchParams && searchParams.get('q') && (
                <span> for &ldquo;{searchParams.get('q')}&rdquo;</span>
              )}
            </p>
          </div>
        </div>
      )} */}

      <HotelListMain
        hotels={hotelsToShow}
        amenities={amenities}
        tags={tags}
        selectedAmenities={selectedAmenities}
        selectedTags={selectedTags}
        onAmenityChange={handleAmenityChange}
        onTagChange={handleTagChange}
      />

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-5 mb-5 flex-wrap">
        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        {getPaginationPages(currentPage, totalPages).map((page, i) =>
          page === "..." ? (
            <span
              key={`dots-${i}`}
              className="px-3 py-2 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}-${i}`}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-md border text-sm ${page === currentPage
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default function HotelListPage() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-72 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    }>
      <HotelListContent />
    </Suspense>
  );
}
