import { Suspense } from "react";
import HotelListClient from "./HotelListClient";
import { fetchFromAPI } from "@/lib/api";
import { Hotel, ApiResponseItem, AmenityApiItem, TagApiItem, RoomApiItem } from "@/types/hotel";
import Header from "@/components/common/Header";
import SubHeader from "@/components/common/subHeaderSearch";

// Force dynamic rendering to avoid build timeout
export const dynamic = 'force-dynamic';

// Server Component - fetch data here
export default async function HotelListPage() {
  // Fetch hotels and rooms in parallel
  const [data, allRooms] = await Promise.all([
    fetchFromAPI<ApiResponseItem[]>({
      appName: "app3534482538357",
      moduleName: "company",
      query: {
        "sectionData.Company.is_deleted": false,
        "sectionData.Company.main_status": "Open",
      },
    }),
    fetchFromAPI<RoomApiItem[]>({
      appName: "app3534482538357",
      moduleName: "rooms",
      query: {
        "sectionData.rooms.is_deleted": "0",
        "sectionData.rooms.is_status": "0",
      },
    }),
  ]);

  // Create a map of hotel_id -> min price
  const hotelPriceMap = new Map<string, number>();
  allRooms.forEach((room) => {
    const r = room.sectionData.rooms;
    const hotelId = r.hotel_id;
    // Parse string to number properly
    const priceStr = r.rate_week_day_peak;
    const price = priceStr ? parseFloat(String(priceStr).replace(/,/g, '')) : 0;

    if (price > 0) {
      const currentMin = hotelPriceMap.get(hotelId) ?? Infinity;
      if (price < currentMin) {
        hotelPriceMap.set(hotelId, price);
      }
    }
  });

  // Map hotels with prices from the map
  const hotels: Hotel[] = data.map((item) => {
    const c = item.sectionData.Company;
    return {
      id: item._id,
      name: c.web_title || c.companyName || c.name || "Unknown Hotel",
      location: `${c.address_line1 || c.address || ""}, ${c.web_province || c.province || c.city || ""
        }`.replace(/^,\s*|,\s*$/g, ""),
      price: hotelPriceMap.get(item._id) || 0,
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
  });

  // Fetch filters on server
  const [amenities, tags] = await Promise.all([
    fetchFromAPI<AmenityApiItem[]>({
      appName: "app3534482538357",
      moduleName: "amenities",
      query: {
        "sectionData.amenities.is_status": "0",
        "sectionData.amenities.is_deleted": "0",
      },
    }),
    fetchFromAPI<TagApiItem[]>({
      appName: "app3534482538357",
      moduleName: "tags",
      query: {
        "sectionData.tags.is_status": "0",
        "sectionData.tags.is_deleted": "0",
      },
    }),
  ]);

  return (
    <div>
      <Header />
      <SubHeader />
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
        <HotelListClient
          key="hotel-list-stable"
          initialHotels={hotels}
          amenities={amenities}
          tags={tags}
        />
      </Suspense>
    </div>
  );
}