"use client";

import React from "react";
import Image from "next/image";

interface Tour {
  src: string;
  title: string;
}

interface AttractionsProps {
  data: {
    title: string;
    subtitle: string;
    tours: Tour[];
  };
}

const Attractions: React.FC<AttractionsProps> = ({ data }) => {
  // Validate data
  if (!data || !data.tours || !Array.isArray(data.tours)) {
    console.warn("Invalid or missing attractions data");
    return null;
  }

  const { title, subtitle, tours } = data;

  return (
    <section className="container mx-auto mt-12">
      <div className="">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600">
          {title}
        </h2>
        <p className="text-center mb-8 font-normal text-gray-800">{subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tours.map((tour, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden">
              {/* Number Badge */}
              <div className="absolute top-0 left-0 bg-red-500 text-white rounded-br-2xl w-[40px] h-[40px] flex items-center justify-center text-lg font-bold">
                {index + 1}
              </div>

              {/* Image */}
              <Image
                src={tour.src || "/fallback-image.jpg"}
                alt={tour.title}
                width={321}
                height={199}
                className="object-cover w-full h-[199px]"
              />

              {/* Title inside image */}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 text-center">
                <p className="text-white font-bold text-sm md:text-base">{tour.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-right mt-4">
          <a href="#" className="text-blue-600 hover:underline">
            See all attractions →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Attractions;