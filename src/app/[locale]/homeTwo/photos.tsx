"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from 'next/link';

interface Tour {
  src: string;
  title: string;
}

interface PhotosProps {
  data: {
    title: string;
    subtitle: string;
    tours: Tour[];
  };
}

const Photos: React.FC<PhotosProps> = ({ data }) => {
  // Move hooks to the top
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Validate data
  if (!data || !data.tours || !Array.isArray(data.tours) || data.tours.length < 6) {
    console.warn("Invalid or missing photos data");
    return null;
  }

  const { title, subtitle, tours } = data;
  const visibleTours = tours.slice(0, 6); // First 6 for homepage thumbnails

  const openPopup = (index: number) => {
    setSelectedImage(index);
    setCurrentSlide(index);
  };

  const closePopup = () => {
    setSelectedImage(null);
    setCurrentSlide(0);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : tours.length - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < tours.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="container mx-auto mt-12">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600">
          {title}
        </h2>
        <p className="text-center mb-8 font-normal text-gray-800">{subtitle}</p>

        <div className="relative">
          <div className="relative overflow-hidden rounded-lg border-4 border-brown-800">
            <Image
              src={visibleTours[0].src || "/fallback-image.jpg"}
              alt={visibleTours[0].title}
              width={896}
              height={479}
              className="w-full h-[479px] object-cover"
            />
            {/* Homepage Thumbnails (6 only) */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-2 rounded">
              {visibleTours.map((tour, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => openPopup(index)}
                >
                  <Image
                    src={tour.src || "/fallback-image.jpg"}
                    alt={tour.title}
                    width={120}
                    height={90}
                    className={`rounded-lg object-cover border ${
                      currentSlide === index
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="text-right mt-4">
            <Link href="#" className="text-blue-600 hover:underline">
              See all photos →
            </Link>
          </div>
        </div>

        {/* Popup */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-50"
              onClick={closePopup}
            >
              &times;
            </button>

            {/* Main image */}
            <div className="relative flex items-center justify-center flex-1 w-full px-8">
              <button
                className="absolute left-4 text-white text-4xl bg-black/50 rounded-full p-2 hover:bg-black/70"
                onClick={handlePrev}
              >
                &#10094;
              </button>
              <Image
                src={tours[currentSlide].src || "/fallback-image.jpg"}
                alt={tours[currentSlide].title}
                width={1000}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <button
                className="absolute right-4 text-white text-4xl bg-black/50 rounded-full p-2 hover:bg-black/70"
                onClick={handleNext}
              >
                &#10095;
              </button>
            </div>

            {/* Popup Thumbnails (all tours) */}
            <div className="flex space-x-2 overflow-x-auto px-4 pb-4">
              {tours.map((tour, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => setCurrentSlide(index)}
                >
                  <Image
                    src={tour.src || "/fallback-image.jpg"}
                    alt={tour.title}
                    width={120}
                    height={90}
                    className={`rounded-lg object-cover border ${
                      currentSlide === index
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
    </section>
  );
};

export default Photos;