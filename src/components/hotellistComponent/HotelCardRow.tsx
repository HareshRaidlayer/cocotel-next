// src/components/hotellistComponent/HotelCardRow.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Hotel } from "@/types/hotel";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";

interface ExtendedHotel extends Omit<Hotel, 'amenities'> {
  images?: string[];
  description?: string;
  amenities?: { name: string; icon: string }[];
}

interface Props {
  hotel: ExtendedHotel;
  searchParams?: {
    checkin?: string | null;
    checkout?: string | null;
    rooms?: string | null;
    adults?: string | null;
    children?: string | null;
  };
}

export default function HotelCardRow({ hotel, searchParams }: Props) {
  const images = hotel.images && hotel.images.length > 0
    ? hotel.images
    : hotel.image ? [hotel.image] : ["/images/defualtimg.webp"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const handleBookNow = () => {
    console.log("Book Now clicked for hotel:", hotel.name, "with searchParams:", searchParams);
    const country = 'ph';
    // if (searchParams?.checkin && searchParams?.checkout && searchParams?.rooms && searchParams?.adults && searchParams?.children) {
    //   // Navigate to clean path-based URL: /ph/roomid/hotelid/rooms/checkin/checkout/adults/children/breakfast?openModal=1
    //   const bookingUrl = `/${country}/8732400417742/${hotel.id}/${searchParams.rooms}/${searchParams.checkin}/${searchParams.checkout}/${searchParams.adults}/${searchParams.children}/0?openModal=1`;
    //   router.push(bookingUrl);
    // } else {
    router.push(`/${country}/${hotel.slug}`);
    // }
  };
  // const handleBookNow = () => {
  //   const checkin = searchParams?.checkin || '';
  //   const checkout = searchParams?.checkout || '';
  //   const rooms = searchParams?.rooms || '1';
  //   const adults = searchParams?.adults || '1';
  //   const children = searchParams?.children || '0';

  //   // Use the correct hotel slug and pass room/hotel IDs as query params
  //   const bookingUrl = `/ph/${hotel.slug}/booking?openModal=true&checkin=${checkin}&checkout=${checkout}&rooms=${rooms}&adults=${adults}&children=${children}&roomid=8732400417742&hotelid=${hotel.id}`;
  //   router.push(bookingUrl);
  // };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const cleanDescription = hotel.description
    ? DOMPurify.sanitize(hotel.description, {
      FORBID_TAGS: ["font"],
      FORBID_ATTR: ["style"],
    })
    : "";

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 mb-4 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left: Image Slider */}
        <div className="md:col-span-5 relative bg-gray-50">
          <div className="relative h-72 overflow-hidden">
            {images.length > 0 ? (
              images.map((src, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${idx === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <Image
                    src={src}
                    alt={`${hotel.name} - ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No photo available
              </div>
            )}
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-transparent hover:bg-green-600/20 p-2 rounded-full transition"
                aria-label="Previous"
              >
                <svg width="20" height="30" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.82998 14C5.68059 14.0005 5.53298 13.9675 5.398 13.9035C5.26302 13.8394 5.1441 13.746 5.04998 13.63L0.219981 7.62997C0.0728989 7.45104 -0.00750732 7.2266 -0.00750732 6.99497C-0.00750732 6.76335 0.0728989 6.5389 0.219981 6.35997L5.21998 0.359971C5.38972 0.155754 5.63363 0.0273295 5.89806 0.00294976C6.16248 -0.02143 6.42576 0.060232 6.62998 0.22997C6.8342 0.399709 6.96262 0.64362 6.987 0.908047C7.01138 1.17247 6.92972 1.43575 6.75998 1.63997L2.28998 6.99997L6.60998 12.36C6.73226 12.5068 6.80994 12.6855 6.83382 12.875C6.8577 13.0646 6.82678 13.257 6.74473 13.4295C6.66267 13.6021 6.53291 13.7475 6.3708 13.8486C6.20869 13.9497 6.02101 14.0022 5.82998 14Z" fill="#4CAA42" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-transparent hover:bg-green-600/20 p-2 rounded-full transition"
                aria-label="Next"
              >
                <svg width="20" height="30" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.17002 0C1.31941 -0.000520706 1.46702 0.0325059 1.602 0.096521C1.73698 0.160536 1.8559 0.253959 1.95002 0.369971L6.78002 6.36997C6.9271 6.5489 7.00751 6.77335 7.00751 7.00497C7.00751 7.2366 6.9271 7.46104 6.78002 7.63997L1.78002 13.64C1.61028 13.8442 1.36637 13.9727 1.10194 13.997C0.837515 14.0214 0.574244 13.9397 0.370021 13.77C0.165799 13.6003 0.0373795 13.3564 0.0129998 13.092C-0.0113799 12.8275 0.0702838 12.5643 0.240021 12.36L4.71002 6.99997L0.390019 1.63997C0.267743 1.49316 0.190058 1.31453 0.16618 1.125C0.142302 0.935429 0.173224 0.743031 0.255274 0.570489C0.337329 0.397946 0.467088 0.252503 0.629198 0.151417C0.791308 0.0503314 0.978989 -0.00216538 1.17002 0Z" fill="#4CAA42" />
                </svg>
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? "bg-green-600 scale-125" : "bg-gray-400"
                      }`}
                    aria-label={`Image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Content */}
        <div className="md:col-span-7 p-4 md:p-6 flex flex-col">
          <div className="flex flex-col gap-2">
            {/* Title */}
            <h3 className="text-xl md:text-xl font-semibold text-black">
              {hotel.name}
            </h3>

            {/* Location + Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-green-700 font-medium text-sm">
                {hotel.location}
              </p>

              {hotel.rating && (
                <div className="flex items-center gap-3">
                  <span className="text-lg bg-green-600 p-1 font-semibold text-white rounded-tr-md rounded-tl-md rounded-br-md">
                    {hotel.rating.toFixed(1)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Very good</p>
                    <p className="text-xs text-gray-500">
                      {hotel.reviews || 0} reviews
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {hotel.description && (
              <div
                className="hotel-description text-gray-700 text-sm leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: cleanDescription }}
              />
            )}
          </div>

          {/* Amenities + Price */}
          <div className="mt-auto pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Amenities */}
              <div>
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Amenities</p>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                      {hotel.amenities.map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center text-center"
                          title={item.name}
                        >
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="object-contain"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price */}
              {/* {hotel.price && (
                <div className="text-right">
                  <h4 className="text-xl md:text-2xl font-semibold text-green-600">
                    ₱{hotel.price.toLocaleString()}
                  </h4>
                  <Button
                    name="Book Now"
                    className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                  />Book Now
                </div>
              )} */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold text-gray-900 mr-5">
                  <span className="text-xs text-gray-500">From</span>{" "}
                  {hotel.price.toLocaleString()}{" "}
                  <span className="text-xs text-gray-500">PHP</span>
                </p>
                <Button
                  name="Book Now"
                  onClick={handleBookNow}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
