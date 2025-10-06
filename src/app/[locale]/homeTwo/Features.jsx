"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaStar, FaAngleLeft, FaAngleRight } from "react-icons/fa";
// import { LeftRatting } from "/images/raring-left.svg";
// import { RightRatting } from "/images/raring-right.svg";

const Features = ({ locale = "ph", content }) => {
  // Validate content
  if (!content || !content.features || !Array.isArray(content.features.tours)) {
    console.warn("Invalid or missing features data for locale:", locale);
    return null;
  }

  const { title, subtitle, tours } = content.features;
  const currencySymbol = locale === "in" ? "IDR" : "PHP";

  const [currentSlides, setCurrentSlides] = useState(tours.map(() => 0));
  const [quickViewIndex, setQuickViewIndex] = useState(null); // index of tour for quick view
  const [currentSlide, setCurrentSlide] = useState(0); // image index inside quick view

  const handlePrev = (index) => {
    setCurrentSlides((prev) =>
      prev.map((slide, i) =>
        i === index ? (slide > 0 ? slide - 1 : tours[i].src.length - 1) : slide
      )
    );
  };

  const handleNext = (index) => {
    setCurrentSlides((prev) =>
      prev.map((slide, i) =>
        i === index ? (slide < tours[i].src.length - 1 ? slide + 1 : 0) : slide
      )
    );
  };

  const openQuickView = (index) => {
    setQuickViewIndex(index);
    setCurrentSlide(0);
  };

  const closeQuickView = () => {
    setQuickViewIndex(null);
  };

  const quickPrev = () => {
    if (quickViewIndex === null) return;
    setCurrentSlide((prev) =>
      prev > 0 ? prev - 1 : tours[quickViewIndex].src.length - 1
    );
  };

  const quickNext = () => {
    if (quickViewIndex === null) return;
    setCurrentSlide((prev) =>
      prev < tours[quickViewIndex].src.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <section className="container mx-auto mt-12">
      
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600">
          {title}
        </h2>
        <p className="text-center mb-8 font-normal text-gray-800">{subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {tours.map((tour, index) => (
            <div key={index} className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative linear-gradient-top-custom">
                <Image
                  src={tour.src[currentSlides[index]]}
                  alt={tour.title}
                  width={380}
                  height={207}
                  className="w-full h-[200px] object-cover"
                />

                {/* Quick View Button */}
                <button
                  onClick={() => openQuickView(index)}
                  className="absolute bottom-8 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md hover:bg-opacity-70 text-sm"
                >
                  Quick View
                </button>
                <div className="absolute bottom-0 right-0 bg-green-600 text-white px-3 py-1 text-xs font-semibold">
                  save   {currencySymbol} {tour.originalPrice}
                </div>

                <div className="absolute top-2 right-0 flex justify-between items-center w-full z-10 p-1">
                  <div className="flex items-center ">
                    <Image src="/images/rating-left.svg" alt="Left Rating" width={22} height={22} />
                      <span className="text-white text-base font-bold text-shadow-md">5</span>
                      <Image src="/images/rating-right.svg" alt="Right Rating" width={22} height={22} />
                      <span className="text-white ms-3 text-sm font-semibold text-shadow-md">3 reviews</span>
                  </div>
                  <div className="bg-white shadow-xl rounded-full text-xs text-black px-2 py-1 font-medium">
                  {tour.discount}
                  </div>
                </div>

                <button
                  className="absolute left-2 top-1/2 h-7 w-7 text-white transform -translate-y-1/2 bg-gray-800/50 flex items-center justify-center rounded-full shadow-md hover:bg-gray-500/50 border border-white"
                  onClick={() => handlePrev(index)}
                >
                  <FaAngleLeft/>
                </button>
                <button
                  className="absolute right-2 top-1/2 h-7 w-7 text-white transform -translate-y-1/2 bg-gray-800/50 flex items-center justify-center rounded-full shadow-md hover:bg-gray-500/50 border border-white"
                  onClick={() => handleNext(index)}
                >
                  <FaAngleRight/>
                </button>
              </div>

              <div className="p-4">
                <p className="text-gray-800 font-semibold mb-2 line-clamp-2 cursor-pointer">{tour.title}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex flex-col items-start">
                    
                    <span className="text-xs text-gray-500">{tour.city}, {tour.country} </span>
                  </div>
                  <div className="flex justify-end items-center">
                    <span className="text-gray-800 font-medium bg-green-100 px-2 py-1 rounded-md text-sm">
                      {tour.category}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-xl text-green-600 font-bold">
                      <span className="text-sm text-gray-800 font-medium">From {currencySymbol}</span> {tour.price}
                    </p>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick View Popup */}
        {quickViewIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-50"
              onClick={closeQuickView}
            >
              &times;
            </button>

            {/* Main image */}
            <div className="relative flex items-center justify-center flex-1 w-full px-8">
              <button
                className="absolute left-4 text-white text-4xl bg-black/50 rounded-full p-2 hover:bg-black/70"
                onClick={quickPrev}
              >
                &#10094;
              </button>
              <Image
                src={tours[quickViewIndex].src[currentSlide]}
                alt={tours[quickViewIndex].title}
                width={1000}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <button
                className="absolute right-4 text-white text-4xl bg-black/50 rounded-full p-2 hover:bg-black/70"
                onClick={quickNext}
              >
                &#10095;
              </button>
            </div>

            {/* Popup Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto px-4 pb-4 mt-4">
              {tours[quickViewIndex].src.map((img, i) => (
                <div
                  key={i}
                  className="cursor-pointer"
                  onClick={() => setCurrentSlide(i)}
                >
                  <Image
                    src={img}
                    alt={tours[quickViewIndex].title}
                    width={120}
                    height={90}
                    className={`rounded-lg object-cover border ${
                      currentSlide === i ? "border-blue-500" : "border-gray-300"
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

export default Features;
