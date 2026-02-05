"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HotelListMain from "@/components/hotellistComponent/HotelListMain";
import { fetchFromAPI } from "@/lib/api";
import { Hotel, ApiResponseItem, AmenityApiItem, TagApiItem } from "@/types/hotel";
import { getMinRoomPriceByHotelId } from "@/utils/roomPrice";

const ITEMS_PER_PAGE = 12;

function HotelListContent() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [amenities, setAmenities] = useState<AmenityApiItem[]>([]);
  const [tags, setTags] = useState<TagApiItem[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('q'); // Main search parameter
  const country = searchParams?.get('country');
  const checkin = searchParams?.get('checkin');
  const checkout = searchParams?.get('checkout');
  const rooms = searchParams?.get('rooms');
  const adults = searchParams?.get('adults');
  const children = searchParams?.get('children');

  console.log('Search params:', { searchQuery, country, checkin, checkout, rooms, adults, children });

  // Filter hotels based on selected amenities, tags, and search parameters
  const filteredHotels = useMemo(() => {
    return allHotels.filter(hotel => {
      // Search filter - more flexible matching
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        const hotelName = hotel.name.toLowerCase();
        const hotelLocation = hotel.location.toLowerCase();
        const hotelDescription = (hotel.description || '').toLowerCase();
        
        // Check if search term matches any part of hotel name, location, or description
        const matchesName = hotelName.includes(searchTerm);
        const matchesLocation = hotelLocation.includes(searchTerm);
        const matchesDescription = hotelDescription.includes(searchTerm);
        
        // Also check for partial word matches
        const searchWords = searchTerm.split(' ').filter(word => word.length > 2);
        const matchesWords = searchWords.some(word => 
          hotelName.includes(word) || 
          hotelLocation.includes(word) || 
          hotelDescription.includes(word)
        );
        
        if (!matchesName && !matchesLocation && !matchesDescription && !matchesWords) {
          return false;
        }
      }
      
      // Check amenities filter - ALL selected amenities must be present
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenityId =>
          hotel.amenities?.includes(amenityId)
        );
        if (!hasAllAmenities) return false;
      }

      // Check tags filter - ALL selected tags must be present
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tagId =>
          hotel.tag?.includes(tagId)
        );
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [allHotels, selectedAmenities, selectedTags, searchQuery]);

  const handleAmenityChange = (ids: string[]) => {
    setSelectedAmenities(ids);
    setCurrentPage(1);
  };

  const handleTagChange = (ids: string[]) => {
    setSelectedTags(ids);
    setCurrentPage(1);
  };

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

       const mappedHotels: Hotel[] = await Promise.all(
  data.map(async (item) => {
    const c = item.sectionData.Company;

    // 🔥 get min room price here
    const minRoomPrice = await getMinRoomPriceByHotelId(item._id);

    return {
      id: item._id,
      name: c.web_title || c.companyName || c.name || "Unknown Hotel",
      location: `${c.address_line1 || c.address || ""}, ${
        c.web_province || c.province || c.city || ""
      }`.replace(/^,\s*|,\s*$/g, ""),
      price: minRoomPrice > 0 ? minRoomPrice : 0,

      rating: 5,
      reviews: 0,
      discount: "20% OFF",
      description: c.description || c.web_description || "",
      save: c.promo_active ? "Best Deal" : "",
      image: c.primary_image?.trim() || "/images/hotel-placeholder.jpg",
      gallery: c.gallery_image?.split(",") ?? [],
      category: c.prop_classification || "Hotel",
      distance: c.web_city?.trim() || c.city?.trim() || "",
      breakfast: c.description?.toLowerCase().includes("breakfast"),
      parking: c.description?.toLowerCase().includes("parking")
        ? "Available"
        : "Not available",
      amenities: c.amenities ?? [],
      tag: c.tag ?? [],
      slug: c.slug || "",
    };
  })
); // ✅ THIS was missing


        console.log('Loaded hotels:', mappedHotels.length, mappedHotels.slice(0, 2));

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
           query: {
            "sectionData.amenities.is_status": "0",
            "sectionData.amenities.is_deleted": "0",
          },
        });

        const tagData = await fetchFromAPI<TagApiItem[]>({
          appName: "app3534482538357",
          moduleName: "tags",
          query: {
           // "sectionData.tag.is_active": true,
            "sectionData.tags.is_status": "0",
            "sectionData.tags.is_deleted": "0",
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
      <HotelListMain
        hotels={hotelsToShow}
        amenities={amenities}
        tags={tags}
        selectedAmenities={selectedAmenities}
        selectedTags={selectedTags}
        onAmenityChange={handleAmenityChange}
        onTagChange={handleTagChange}
        searchParams={{
          checkin,
          checkout,
          rooms,
          adults,
          children
        }}
      />

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-5 mb-5 flex-wrap">
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
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <HotelListContent />
    </Suspense>
  );
}