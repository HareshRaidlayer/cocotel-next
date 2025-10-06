'use client'
import React from 'react';
import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const Page = () => {
  return (
    <section className="w-full">
<div
  className="relative bg-cover bg-center bg-no-repeat text-white w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] flex items-center px-4"
  style={{ backgroundImage: "url('/blog/blogbanner.jpeg')" }}
>
  <div className="flex flex-col justify-center items-center text-center h-full max-w-5xl mx-auto py-10">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
      DISCOVER YOUR PERFECT EVENTS
    </h1>
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 md:mt-6">
      Where Every Occasion Matters at Cocotel
    </h2>
    <p className="text-sm sm:text-base mt-4 md:mt-6 max-w-2xl mx-auto leading-relaxed px-2">
      Your special moments deserve the best. At Cocotel, we offer stunning venues and tailored packages for all events—grand gatherings, intimate weddings, corporate galas, and family reunions. 
    </p>
    <button className="mt-6 sm:mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-sm sm:text-base transition-colors duration-300 ease-in-out">
      I want to see more
    </button>
  </div>
</div>

      {/* Blog Section */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <h1 className="text-[30px] sm:text-[36px] md:text-[38px] font-semibold text-[#212529] mb-6">
    Our Latest Blog
  </h1>

  {/* Wrap card in a div to center and control width */}
  <div className=" max-w-5xl ">
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full md:w-1/2 h-[220px] md:h-auto">
        <Image
          src="/blog/blog1.png"
          alt="Vision Mission"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-2/3 bg-green-50 p-4 md:p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-white text-xs sm:text-sm uppercase tracking-wide font-semibold bg-[#4baa42] px-3 py-1  inline-block">
            Event venue
          </h3>

          <h2 className="text-gray-900 text-lg sm:text-xl mt-3 font-semibold leading-snug">
            Romantic Valentine’s Dinner with Your Lover
          </h2>

          <div className="flex items-center gap-2 text-gray-600 mt-2 font-mono text-xs sm:text-sm">
            <FaCalendarAlt />
            <h4>February 16, 2023</h4>
          </div>

          <p className="text-black text-sm mt-3 leading-relaxed line-clamp-3">
            Valentine’s is a day that has a special meaning for every couple. You can start by taking them around the beach, exploring the island, and having dinner together. Filled with beautiful ornaments, delicious food, and small surprises.
          </p>

          {/* Read More */}
          <div className="flex items-center gap-3 text-green-700 font-medium mt-4 cursor-pointer group">
            <span>Read More</span>
            <div className="w-[33px] h-[33px] bg-green-700 rounded-full flex items-center justify-center transition duration-300 group-hover:bg-white border border-green-700">
              <HiArrowRight className="w-5 h-5 text-white group-hover:text-green-700 transition duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </section>
  );
};

export default Page;
