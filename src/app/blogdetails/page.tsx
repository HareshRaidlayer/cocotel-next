'use client';
import React from 'react';
import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaTag } from 'react-icons/fa';

const Page = () => {
  return (
    <section className="py-10 px-4 max-w-6xl mx-auto space-y-10">
      {/* First Row: Image + Text */}
      <div className=" md:flex-row gap-6 items-start">
        {/* Image Section */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/blog/blog1.png"
            alt="Vision Mission"
            fill
            className="object-cover"
            priority
          />
        </div>

      {/* Text Section */}
<div className="w-full md:w-1/2 space-y-4">
  {/* Row: Category + Date */}
  <div className="flex items-center flex-wrap gap-4 mt-6">
    {/* Category */}
    <h3 className="text-white text-xs sm:text-sm md:text-base uppercase tracking-wide font-semibold bg-[#4baa42] px-3 py-1 rounded-md inline-block">
      Event venue
    </h3>

    {/* Date */}
    <div className="flex items-center gap-2 text-gray-600 font-mono text-sm">
      <FaCalendarAlt />
      <h4>February 16, 2023</h4>
    </div>
  </div>

  {/* Title */}
  
</div>
<p className='w-full mt-4 font-semibold text-gray-800'>   
  Valentine’s is a day that has a special meaning for every couple that you must spend. There’s nothing wrong with spending a day that falls on February 14th with your lover. You can start by taking him around the beach, exploring the island, and having dinner together. Valentine’s Dinner that filled with beautiful ornaments, delicious food, and small surprises that can make your partner love you even more.  </p>

      </div>

      {/* Second Section: Image with caption and content */}
      <div className="flex flex-col">
      <h1 className='text-center font-bold text-2xl '>BEACH TOUR

      </h1>
        {/* Image Section */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/blog/blog2.jpg"
            alt="Blog 2"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Image Caption */}
        <p className="text-sm text-gray-500 italic">Picture by: Tessa Rampersad</p>

        {/* Heading + Paragraph */}
        <h2 className="text-2xl font-semibold mt-6 text-gray-800">
          The Christmas holidays are almost here!
        </h2>
        <p className="text-base text-gray-700 leading-relaxed">
          Have you prepared a vacation plan with your family? Since Christmas is a big day once a year, you must prepare for a fun holiday. Let’s look at the following recommendations for activities during the Christmas holidays!
        </p>
      </div>

      <div>
        {/* Third Section: Image with caption and content */}
        <div className="flex flex-col">
            <h1 className='text-center font-bold text-2xl '>CAMPING AND CAMPFIRE
            </h1>
          {/* Image Section */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mt-4">
            <Image
              src="/blog/blog3.jpg"
              alt="Blog 3"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Image Caption */}
          <p className="text-sm text-gray-500 italic">
          Picture by: Brooks Rice</p>
          <p className="text-base text-gray-700 leading-relaxed mt-6">
          Telling stories with your family while circling the bonfire is sure to be an unforgettable moment during your Christmas vacation. You can enjoy the beauty of nature while getting away from your saturation in the city bustle with camping and campfire. The best self-healing method you can do to spend your Christmas holidays! </p>
        </div>
      </div>

      <div>
        {/* Third Section: Image with caption and content */}
        <div className="flex flex-col">
            <h1 className='text-center font-bold text-2xl '>GARDENING AND FARMING

            </h1>
          {/* Image Section */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mt-4">
            <Image
              src="/blog/blog4.jpg"
              alt="Blog 3"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Image Caption */}
          <p className="text-sm text-gray-500 italic">
          Picture by: Mark Stosberg</p>
          <p className="text-base text-gray-700 leading-relaxed mt-6">
          There’s nothing wrong with returning to nature after struggling with the same routine. Spending time on a gardening holiday with your beloved family is fun. Teaching children how to plant and harvest plantation products directly from the tree and tips and tricks for taking care of plants will surely be an unforgettable Christmas holiday!
</p>
        </div>
      </div>

      <div>
        {/* Third Section: Image with caption and content */}
        <div className="flex flex-col">
            <h1 className='text-center font-bold text-2xl '>STAYCATION


            </h1>
          {/* Image Section */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mt-4">
            <Image
              src="/blog/blog5.jpg"
              alt="Blog 3"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Image Caption */}
          <p className="text-base text-gray-700 leading-relaxed ">
          Staycation is a holiday style that is currently trending. You can try spending time with your family at the hotel or resort you want and leave your boring routine for a moment. Although it’s a bit so-so because you and your family stay and don’t explore various places, many people feel relaxed when they know how to spend their time.</p>
          <p className="text-base text-gray-700 leading-relaxed mt-4">
          There are various kinds of facilities offered by hotels and resorts that you can visit—starting from swimming pools, spas, relaxation, and natural views that can spoil your eyes. What’s more, you can enjoy all these facilities while spending quality time during the Christmas holidays with your family.</p>

          <p className='font-bold text-[20px] text-gray-700 leading-relaxed mt-12'>Whatever activities you choose to spend the Christmas holidays with your family, Cocotel will always be ready to bring unforgettable vacations for you. Starting from the comfortable resort with various facilities that you can choose from and many unique day tours, we can guarantee that you will enjoy your Christmas holidays without worry.
          </p>

          <p className='font-semibold text-[20px] text-black text-center justify-center mt-12 '>May your Christmas holidays become unforgettable memories and <br />
          escape the ordinary!</p>
        </div>


        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2 mt-6">
        <FaTag className="text-xs" />
  <h3 className="font-semibold text-gray-800 mr-2">Tags:</h3>

  <div className="flex flex-wrap gap-2">
    <div className="flex items-center gap-1 border border-black px-3 py-1 rounded-md text-sm text-gray-800">
      Top Holiday Destinations
    </div>
    <div className="flex items-center gap-1 border border-black px-3 py-1 rounded-md text-sm text-gray-800">
      Celebrating Christmas
    </div>
    <div className="flex items-center gap-1 border border-black px-3 py-1 rounded-md text-sm text-gray-800">
      Beach Resort
    </div>
  </div>
</div>

      </div>
    </section>
  );
};

export default Page;
