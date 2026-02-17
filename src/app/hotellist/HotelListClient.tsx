"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HotelListMain from "@/components/hotellistComponent/HotelListMain";
import { Hotel, AmenityApiItem, TagApiItem } from "@/types/hotel";


const ITEMS_PER_PAGE = 12;

interface HotelListClientProps {
  initialHotels: Hotel[];
  amenities: AmenityApiItem[];
  tags: TagApiItem[];
}

function HotelListClientComponent({ initialHotels, amenities, tags }: HotelListClientProps) {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sortBy, setSortBy] = useState("default");

  const searchQuery = searchParams?.get('q');
  const checkin = searchParams?.get('checkin');
  const checkout = searchParams?.get('checkout');
  const rooms = searchParams?.get('rooms');
  const adults = searchParams?.get('adults');
  const children = searchParams?.get('children');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAmenities, selectedTags, maxPrice, sortBy, searchQuery]);

  const filteredHotels = useMemo(() => {
    let filtered = initialHotels.filter(hotel => {
      if (maxPrice < 20000 && hotel.price > maxPrice) return false;
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        const hotelName = hotel.name.toLowerCase();
        const hotelLocation = hotel.location.toLowerCase();
        const hotelDescription = (hotel.description || '').toLowerCase();

        const matchesName = hotelName.includes(searchTerm);
        const matchesLocation = hotelLocation.includes(searchTerm);
        const matchesDescription = hotelDescription.includes(searchTerm);

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

      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenityId =>
          hotel.amenities?.includes(amenityId)
        );
        if (!hasAllAmenities) return false;
      }

      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tagId =>
          hotel.tag?.includes(tagId)
        );
        if (!hasAllTags) return false;
      }

      return true;
    });

    // Apply sorting
    if (sortBy === "priceHigh") {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "priceLow") {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return filtered;
  }, [initialHotels, selectedAmenities, selectedTags, searchQuery, maxPrice, sortBy]);

  const handleAmenityChange = (ids: string[]) => {
    setSelectedAmenities(ids);
  };

  const handleTagChange = (ids: string[]) => {
    setSelectedTags(ids);
  };

  const handlePriceChange = (price: number) => {
    setMaxPrice(price);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / ITEMS_PER_PAGE));
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
        onPriceChange={handlePriceChange}
        onSortChange={handleSortChange}
        selectedSort={sortBy}
        searchParams={{ checkin, checkout, rooms, adults, children }}
      />

      <div className="flex justify-center gap-2 mt-5 mb-5 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(currentPage - 1);
          }}
          className="px-4 py-2 border rounded disabled:opacity-40 hover:bg-gray-100 transition"
        >
          Prev
        </button>

        {getPaginationPages(currentPage, totalPages).map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              key={`page-${page}-${i}`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(page as number);
              }}
              className={`px-3 py-2 rounded-md border text-sm transition ${page === currentPage
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
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(currentPage + 1);
          }}
          className="px-4 py-2 border rounded disabled:opacity-40 hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default HotelListClientComponent;
