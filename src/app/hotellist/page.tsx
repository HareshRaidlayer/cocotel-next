"use client";

import { useEffect, useState, useMemo } from "react";
import HotelListMain from "@/components/hotellistComponent/HotelListMain";
import { fetchFromAPI } from "@/lib/api";
import { Hotel, ApiResponseItem, AmenityApiItem, TagApiItem } from "@/types/hotel";

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

export default function HotelListPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [amenities, setAmenities] = useState<AmenityApiItem[]>([]);
  const [tags, setTags] = useState<TagApiItem[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter hotels based on selected amenities and tags
  const filteredHotels = useMemo(() => {
    return allHotels.filter(hotel => {
      // Check amenities filter - ALL selected amenities must be present
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenityId =>
          hotel.hotelamenities?.includes(amenityId)
        );
        if (!hasAllAmenities) return false;
      }

      // Check tags filter - ALL selected tags must be present
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tagId =>
          hotel.hoteltag?.includes(tagId)
        );
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [allHotels, selectedAmenities, selectedTags]);

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

        const mappedHotels: Hotel[] = data.map((item) => {
          const c = item.sectionData.Company;

          return {
            id: item._id,
            name: c.web_title || c.companyName,
            location: `${c.address_line1}, ${c.web_province}`,
            price: 0,
            rating: 5,
            reviews: 0,
            discount: "20% OFF",
            description: c.description,
            save: c.promo_active ? "Best Deal" : "",
            image: c.primary_image?.trim() || "/images/hotel-placeholder.jpg",
            // image: c.primary_image,
            gallery: c.gallery_image?.split(",") ?? [],
            category: c.prop_classification || "Hotel",
            distance: c.web_city?.trim() || "",
            breakfast: c.description?.toLowerCase().includes("breakfast"),
            parking: c.description?.toLowerCase().includes("parking")
              ? "Available"
              : "Not available",
            hotelamenities: c.hotelamenities ?? [],
            hoteltag: c.hoteltag ?? [],
          };
        });

        setAllHotels(mappedHotels);
      } catch (error) {
        console.error("Hotel fetch error:", error);
      } finally {
        setInitialLoading(false); // ✅ only once
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
              key={`dots-${i}`}   // ✅ unique key
              className="px-3 py-2 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}-${i}`} // ✅ unique key
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


      {/* <div className="flex justify-center gap-2 mt-10 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 border rounded ${
              currentPage === page
                ? "bg-green-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div> */}
    </>
  );
}
