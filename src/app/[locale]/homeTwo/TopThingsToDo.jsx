"use client";
import React from "react";
import Image from "next/image";
import Link from 'next/link';
const TopThingsToDo = ({ data }) => {
  if (!data) return null;

  return (
    <section className="container mx-auto bg-white mt-10">
     
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600">
          {data.title}
        </h2>
        <p className="text-center mb-8 font-normal text-gray-800">{data.subtitle}</p>

        {/* Tour Places */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {data.tours.map((tour, index) => (
            <div key={index} className="relative group rounded-lg linear-gradient-bottom-custom overflow-hidden">
              <Image
                src={tour.src}
                alt={tour.title}
                width={420}
                height={200}
                className="rounded-lg object-cover w-full h-[150px]"
              />
              <p className="absolute bottom-0 left-0 w-full  text-white text-center py-2 font-semibold z-10">
                {tour.title}
              </p>
            </div>
          ))}
        </div>

    </section>
  );
};

export default TopThingsToDo;
