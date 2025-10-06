"use client";
import React, { useState, useEffect } from "react";
import { apiGetData } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import parse from "html-react-parser";
import Link from "next/link";

// Define the interface for the raw hotel data from the API
interface RawHotelData {
  _id: string;
  sectionData?: {
    Company?: {
      web_title?: string;
      name?: string;
      description?: string;
      slug?: string;
      primary_image?: string;
      gallery_image?: string;
      city?: string;
      province?: string;
      country?: string;
    };
  };
}

// Define the interface for the mapped hotel data used in the component
interface MappedHotel {
  id: string;
  title: string;
  description: string;
  slug?: string;
  image: string;
  location: string;
}

const DiscoverNew = () => {
  const [hotels, setHotels] = useState<MappedHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const data: RawHotelData[] = await apiGetData({
          dbName: "hanahotelnew",
          collectionName: "company",
          query: { "sectionData.Company.is_deleted": false },
          limit: 5,
          cacheKey: "discover-new-hotels",
        });

        const mappedHotels: MappedHotel[] = data.map((hotel) => {
          const company = hotel.sectionData?.Company || {};

          const galleryImages = company.gallery_image
            ? company.gallery_image.split(",").map((img) => img.trim())
            : [];

          return {
            id: hotel._id,
            title: company.web_title || company.name || "Unknown Hotel",
            description: company.description || "No description available",
            slug: company.slug,
            image:
              company.primary_image ||
              (galleryImages.length > 0
                ? galleryImages[0]
                : "/placeholder.jpg"),
            location: `${company.city || ""}, ${company.province || ""}, ${company.country || ""
              }`
              .replace(/, ,/g, ",")
              .trim(),
          };
        });

        setHotels(mappedHotels);
      } catch (err: unknown) {
        console.error("Error fetching hotels:", err);
        if (err instanceof Error) {
          setError(`Failed to load hotels: ${err.message}`);
        } else {
          setError("Failed to load hotels. An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;
  if (hotels.length === 0)
    return <div className="text-center py-8">No hotels found.</div>;

  return (
    <div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        className="mySwiper"
      >
        {hotels.map((hotel) => (
          <SwiperSlide key={hotel.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative w-full h-[400px]">
                <Image
                  src={hotel.image}
                  alt={hotel.title}
                  fill
                  className="rounded-tl-[20px] rounded-bl-[20px] rounded-tr-[20px] lg:rounded-tr-none rounded-br-[20px] lg:rounded-br-none object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                  // priority
                />
              </div>
              <div className="p-8 h-full">
                <p className="text-xl text-black-600 mb-3">
                  Discover Something New
                </p>
                <h2 className="text-3xl font-bold text-black mb-4">
                  {hotel.title}
                </h2>
                {/* Changed the outer <p> tag to a <div> */}
                <div className="text-gray-700 mb-6 whitespace-pre-line">
                  {parse(hotel.description)}
                </div>
                {/* <Link href={`/hotel/${hotel.slug}`} className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"> */}
                <Link
                  href={`/hotel/${hotel.slug}`}
                  className="text-[17px] bg-[#4CAA42] text-white px-[38px] py-[15px] rounded-md hover:bg-[#279c1a] transition"
                >
                  Explore More
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DiscoverNew;