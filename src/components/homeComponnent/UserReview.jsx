"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";

const hotels = [
  {
    id: 1,
    title: "Rold and Roub Suite by Cocotel ",
    address1: " Puerto Galera",
    address2: "Oriental Mindoro",
    country: "Philippines",
    image:
      "https://hel1.your-objectstorage.com/hana/app3534482538357/company/Rold___Roub_Home_Suites-9931.webp",
    description: `Welcome to Casa Marco Suites, our latest #CocotelCollections addition!
      Nestled in a serene location, this boutique hotel combines elegance and comfort
      with modern amenities. Enjoy the tranquil garden, refreshing pool, and delicious
      in-house dining. Perfect for a romantic getaway or a relaxing retreat.`,
  },
  {
    id: 2,
    title: "Club Monet Beachfront Resort by Cocotel ",
    address1: " Cabangan",
    address2: "",
    country: "Philippines",
    image:
      "https://hel1.your-objectstorage.com/hana/app3534482538357/company/Ronaldo_s_Inn-9048.webp",
    description: `It is a Hello from Yello! Hotel, our vibrant new spot in Cebu!
      This lively hotel features a contemporary design and colourful decor.
      Enjoy modern comforts, stunning city views from the rooftop bar, and easy access
      to local attractions. Ideal for both business and leisure travellers.`,
  },
];

const UserReview = () => {
  return (
    <div className="px-3 sm:px-6">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
      >
        {hotels.map((hotel) => (
          <SwiperSlide key={hotel.id}>
            <div className="grid grid-cols-1 lg:grid-cols-3 items-center bg-white shadow-md rounded-lg overflow-hidden">

              {/* Left Content */}
              <div className="p-4 sm:p-6 md:p-8 h-full col-span-1 lg:col-span-2 order-2 lg:order-1">

                {/* Title */}
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium text-black mb-3 sm:mb-4">
                  {hotel.title}
                </h2>

                {/* Location + Stars */}
                <div className="flex flex-wrap items-center mt-1">
                  <span className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Image
                        key={i}
                        src={
                          i < Math.floor(5)
                            ? "/images/full-star.svg"
                            : "/images/half-star.svg"
                        }
                        alt="star"
                        className="object-cover"
                        width={12}
                        height={12}
                        loading="lazy"
                        // priority
                      />
                    ))}
                  </span>
                  <span className="text-gray-600 text-xs sm:text-sm ml-3 sm:ml-5">
                    {hotel.address1}, {hotel.address2}, {hotel.country}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 whitespace-pre-line leading-relaxed">
                  {hotel.description}
                </p>

                {/* User Review */}
                <div className="mt-4 sm:mt-5 flex items-center gap-3">
                  <Image
                    src="https://www.cocotel.com/frontend/images/review.png"
                    alt="user"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm sm:text-lg md:text-xl font-bold">
                      Patricia Jane Francisco
                    </p>
                    <p className="text-xs sm:text-sm font-normal text-gray-500">
                      2 months ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="col-span-1 order-1 lg:order-2">
                <Image
                  src={hotel.image}
                  alt={hotel.title}
                  width={600}
                  height={400}
                  className="rounded-t-lg lg:rounded-none object-cover w-full h-52 sm:h-72 md:h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UserReview;
