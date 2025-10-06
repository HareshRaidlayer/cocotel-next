"use client";

import { useState, useEffect } from "react";
import HotelCard from "@/components/homeComponnent/HotelCard";
import { getFeaturedHotels, Hotel } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface HotelListProps {
  initialHotels: Hotel[];
  provinces: string[];
}

export default function HotelList({ initialHotels, provinces }: HotelListProps) {
  const [hotels, setHotels] = useState<Hotel[]>(
    initialHotels.filter((hotel) => hotel.province === "Batangas")
  );
  const [selectedProvince, setSelectedProvince] = useState("Batangas");

  useEffect(() => {
    async function fetchHotels() {
      try {
        const data = await getFeaturedHotels(selectedProvince);
        setHotels(data.filter((hotel) => hotel.province === selectedProvince));
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
      }
    }
    fetchHotels();
  }, [selectedProvince]);

  return (
    <div>
      {/* Province filter buttons */}
      <div className="overflow-x-auto scrollbar-hide mb-6">
        <div className="flex gap-3 min-w-max">
          {provinces.map((province) => (
            <button
              key={province}
              onClick={() => setSelectedProvince(province)}
              className={`province-btn ${
                selectedProvince === province ? "province-btn-active" : ""
              }`}
            >
              {province}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop / Tablet → Grid */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {hotels.length > 0 ? (
          hotels.map((hotel, index) => (
            <div
              key={hotel.id}
              className="wow animate__animated animate__fadeInUp h-full"
              data-wow-delay={`${index * 0.2}s`}
            >
              <HotelCard hotel={hotel} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No hotels found for {selectedProvince}
          </p>
        )}
      </div>

      {/* Mobile → Slider */}
      <div className="sm:hidden">
        {hotels.length > 0 ? (
          <Swiper
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              320: { slidesPerView: 2 },
              480: { slidesPerView: 2.2 },
              640: { slidesPerView: 3 },
            }}
          >
            {hotels.map((hotel, index) => (
              <SwiperSlide key={hotel.id} className="h-full">
                <div
                  className="wow animate__animated animate__fadeInUp h-full"
                  data-wow-delay={`${index * 0.2}s`}
                >
                  <HotelCard hotel={hotel} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-gray-500">No hotels found for {selectedProvince}</p>
        )}
      </div>

      {/* Single View All button (Mobile only) */}
      <div className="sm:hidden mt-6 flex justify-center">
        <button className="btn-viewall-green">View All</button>
      </div>
    </div>
  );
}
