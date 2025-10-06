
"use client";

import React, { useState, useEffect, Suspense } from "react";
import SearchBar from "@/components/homeComponnent/SearchBar";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { getFeaturedHotels, Hotel } from "@/lib/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


interface ExtendedHotel extends Hotel {
  sectionData?: {
    Company?: {
      name?: string;
      city?: string;
      province?: string;
      country?: string;
      description?: string;
      gallery_image?: string;
      amenities?: string;
      promo_active?: number | string;
      price?: number;
      discountPrice?: number;
      primary_image?: string;
    };
  };
}

const ImageWithErrorBoundary: React.FC<{
  src: string;
  alt: string;
  layout: "fill" | "responsive";
  objectFit: "cover" | "contain";
  className?: string;
}> = ({ src, alt, layout, objectFit, className }) => {
  const [imageSrc, setImageSrc] = useState<string>(
    "/images/fallback-image.jpg"
  );
  const [hasError, setHasError] = useState(false);
  const fallbackImage = "/images/fallback-image.jpg";

  useEffect(() => {
    setHasError(false);
    console.log(`Attempting to load image: ${src}`);
    if (
      !src ||
      typeof src !== "string" ||
      src.trim() === "" ||
      !src.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/) ||
      src === "undefined" ||
      src === "null"
    ) {
      console.warn(`Invalid image URL: ${src}, using fallback`);
      setImageSrc(fallbackImage);
      setHasError(true);
    } else {
      setImageSrc(src.trim());
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Failed to load image: ${imageSrc}, switching to fallback`);
      setImageSrc(fallbackImage);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      layout={layout}
      objectFit={objectFit}
      className={className}
      sizes="(max-width: 768px) 100vw, 50vw"
      unoptimized
      onError={handleError}
      onLoad={() => console.log(`Image loaded successfully: ${imageSrc}`)}
    />
  );
};

// Client component that uses useSearchParams
const ExplorePageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const province = searchParams.get("province") || undefined;

  const [hotels, setHotels] = useState<ExtendedHotel[]>([]);
  const [currentImage, setCurrentImage] = useState<{ [key: string]: number }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 5;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const fetched = await getFeaturedHotels(
          province
        );
        console.log("Fetched hotels:", JSON.stringify(fetched, null, 2));
        setHotels(fetched as ExtendedHotel[]);
        const initState = fetched.reduce((acc, h) => {
          acc[h.id] = 0;
          return acc;
        }, {} as { [key: string]: number });
        setCurrentImage(initState);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to load hotels.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [province]);

  const handleNext = (id: string, images: string[]) =>
    setCurrentImage((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % images.length,
    }));

  const handlePrev = (id: string, images: string[]) =>
    setCurrentImage((prev) => ({
      ...prev,
      [id]: prev[id] === 0 ? images.length - 1 : prev[id] - 1,
    }));

  const getGalleryImages = (g?: string, primary?: string) => {
    const images: string[] = [];
    if (
      primary &&
      typeof primary === "string" &&
      primary.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/)
    ) {
      images.push(primary.trim());
    }
    if (g && typeof g === "string") {
      images.push(
        ...g
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/))
      );
    }
    return images.length > 0 ? images : ["/images/fallback-image.jpg"];
  };

  const getAmenities = (a?: string) => {
    const map: Record<string, string> = {
      "12": "Swimming Pool",
      "13": "WiFi",
      "18": "Pets",
      "19": "Parking",
      "22": "Toiletries",
      "27": "Restaurant",
      "31": "Spa",
    };
    return a && typeof a === "string"
      ? a
          .split(",")
          .map((id) => map[id] || id)
          .filter(Boolean)
      : [];
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, string> = {
      "Swimming Pool": "/images/swimming-pool.svg",
      WiFi: "/images/wifi.svg",
      Pets: "/images/pets.svg",
      Parking: "/images/parking.svg",
      Toiletries: "/images/toiletries.svg",
      Restaurant: "/images/restaurant.svg",
      Spa: "/images/spa.svg",
    };
    return iconMap[amenity] || "/images/fallback-icon.svg";
  };

  const getDescription = (d?: string) => {
    if (!d || typeof d !== "string") return "No description available.";
    const clean = d.replace(/<[^>]+>| /g, "").trim();
    if (!clean) return "No description available.";
    return clean.length > 150
      ? clean.slice(0, clean.lastIndexOf(" ", 150)) + "..."
      : clean;
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationButtons = () => {
    const buttons: React.JSX.Element[] = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-md"
      >
        <FiChevronLeft size={16} className="sm:size-20" />
      </button>
    );

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-105 shadow-sm"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span
            key="start-ellipsis"
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 text-sm sm:text-base"
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 shadow-sm text-sm sm:text-base ${
            currentPage === i
              ? "bg-blue-600 text-white border-none"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-600 hover:text-white"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span
            key="end-ellipsis"
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 text-sm sm:text-base"
          >
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-105 shadow-sm text-sm sm:text-base"
        >
          {totalPages}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-md"
      >
        <FiChevronRight size={16} className="sm:size-20" />
      </button>
    );

    return buttons;
  };

  if (loading)
    return <div className="text-center p-4 sm:p-6">Loading hotels...</div>;
  if (error)
    return <div className="text-center p-4 sm:p-6 text-red-500">{error}</div>;
  if (hotels.length === 0)
    return <div className="text-center p-4 sm:p-6">No hotels found.</div>;

  return (
    <section className="container mx-auto mt-40">
      {/* Search Bar */}
      <SearchBar />

      {/* Add spacing below search bar */}
      <div className="h-6 sm:h-12 md:h-16 lg:h-20" />

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center md:text-left mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-[#212529]">
        Our Hotels & Resorts
      </h1>

      {/* Hotel Cards */}
      <div className="mt-2 sm:mt-4 md:mt-6 lg:mt-8 flex">
        <div className="w-3/4">
          {currentHotels.map((hotel) => {
            const images = getGalleryImages(
              hotel.sectionData?.Company?.gallery_image,
              hotel.sectionData?.Company?.primary_image
            );
            console.log(`Hotel ${hotel.name} images:`, images);
            const amenities = getAmenities(
              hotel.sectionData?.Company?.amenities
            );
            const desc = getDescription(
              hotel.sectionData?.Company?.description
            );
            const imgIndex = currentImage[hotel.id] || 0;

            return (
              <div
                key={hotel.id}
                className="bg-white w-full rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex flex-col md:flex-row overflow-hidden mb-4 sm:mb-6"
              >
                <div className="relative w-full sm:w-[40%] h-[160px] sm:h-[200px] md:h-[240px] lg:h-[300px]">
                  <ImageWithErrorBoundary
                    src={images[imgIndex]}
                    alt={hotel.name || "Hotel Image"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none"
                  />
                  <button
                    onClick={() => handlePrev(hotel.id, images)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <FiChevronLeft size={16} className="sm:size-20" />
                  </button>
                  <button
                    onClick={() => handleNext(hotel.id, images)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <FiChevronRight size={16} className="sm:size-20" />
                  </button>
                </div>

                <div className="w-full sm:flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                      {hotel.name || "Unknown Hotel"}
                    </h2>
                    <div className="flex items-center mt-1 flex-wrap">
                      {[...Array(Math.floor(hotel.rating || 0))].map((_, i) => (
                        <Image
                          key={i}
                          src="/images/full-star.svg"
                          alt="Star"
                          width={12}
                          height={12}
                          className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                          onError={() =>
                            console.warn("Failed to load full-star.svg")
                          }
                        />
                      ))}
                      {(hotel.rating || 0) % 1 !== 0 && (
                        <Image
                          src="/images/half-star.svg"
                          alt="Half Star"
                          width={12}
                          height={12}
                          className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                          onError={() =>
                            console.warn("Failed to load half-star.svg")
                          }
                        />
                      )}
                      <span className="text-xs sm:text-sm md:text-base text-gray-600 ml-2">
                        {hotel.rating || "N/A"}
                      </span>
                      <span className="text-xs sm:text-sm md:text-base text-green-600 ml-2">
                        {hotel.location || "Unknown Location"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 mt-1 sm:mt-2 md:mt-3">
                      {desc}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between mt-3 sm:mt-4">
                    <div>
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1 sm:mb-2 md:mb-3">
                        Amenities
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-5 flex-wrap">
                        {amenities.length > 0 ? (
                          amenities.map((a, i) => (
                            <div key={i} className="relative group">
                              <Image
                                src={getAmenityIcon(a)}
                                alt={a}
                                width={16}
                                height={16}
                                className="sm:w-6 sm:h-6 md:w-8 md:h-8 hover:scale-110 transition-transform duration-200"
                                onError={() =>
                                  console.warn(
                                    `Failed to load amenity icon: ${a}`
                                  )
                                }
                              />
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                {a}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs sm:text-sm md:text-base text-gray-600">
                            No amenities available
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right mt-3 sm:mt-0">
                      {hotel.sectionData?.Company?.promo_active == 1 && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          Flash Sale
                        </span>
                      )}
                      <div className="flex justify-start sm:justify-end mt-1">
                        <div className="text-xs sm:text-sm md:text-lg text-gray-400 line-through">
                          $ {hotel.price || 0}
                        </div>
                        <div className="text-xs sm:text-sm md:text-lg font-bold text-yellow-500 ml-1">
                          {hotel.price && hotel.discountPrice
                            ? Math.round(
                                (1 - hotel.discountPrice / hotel.price) * 100
                              )
                            : 0}
                          %
                        </div>
                      </div>
                      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-600">
                        $ {hotel.discountPrice || 0}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-1/4"></div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 sm:mt-6 md:mt-8 space-x-1 sm:space-x-2">
        {getPaginationButtons()}
      </div>
    </section>
  );
};

// Main page component with Suspense boundary
const ExplorePage = () => {
  return (
    <Suspense
      fallback={<div className="text-center p-4 sm:p-6">Loading...</div>}
    >
      <ExplorePageContent />
    </Suspense>
  );
};

export default ExplorePage;
