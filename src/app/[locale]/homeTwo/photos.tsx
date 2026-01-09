"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { fetchFromAPI } from "@/lib/api";

interface Tour {
  src: string;
  title: string;
}

interface PageData {
  title: string;
  subtitle: string;
  tours: Tour[];
}
interface TopGalleryItem {
  _id: string;
  sectionData: {
    topgallery: {
      title?: string;
      image?: string;
      country?: string;
      is_active?: boolean;
    };
  };
}

type TopGalleryQuery = {
  "sectionData.topgallery.is_active": boolean;
  "sectionData.topgallery.country"?: string;
};

const Photos = () => {
  const params = useParams();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const locale = params?.locale || "ph";
        const localeStr = Array.isArray(locale) ? locale[0] : locale;
        const requestedCountryCode = localeStr.toUpperCase(); // e.g. 'ID', 'PH', 'AUS'

        console.log('Resolving country for code:', requestedCountryCode);

        // 1) Resolve country document by countrycode
        const countryRes = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "country",
          query: {
            "sectionData.country.countrycode": requestedCountryCode,
            "sectionData.country.is_active": true,
          },
          limit: 1,
        });

        const countryDoc = Array.isArray(countryRes) && countryRes.length ? countryRes[0] : null;
        const countryName = countryDoc?.sectionData?.country?.countryname || (requestedCountryCode === 'ID' ? 'Indonesia' : 'Philippines');
        const countryId = countryDoc?._id;

        console.log('Country resolved:', countryDoc?._id, countryName);

        // 2) Query topgallery by country _id (if we found one), otherwise query active topgallery items
        // const topgalleryQuery: any = {
        //   "sectionData.topgallery.is_active": true,
        // };
        const topgalleryQuery: TopGalleryQuery = {
  "sectionData.topgallery.is_active": true,
};
        if (countryId) topgalleryQuery["sectionData.topgallery.country"] = countryId;

        const topRes = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "topgallery",
          query: topgalleryQuery,
          limit: 20,
        });

        console.log('Topgallery result count:', Array.isArray(topRes) ? topRes.length : 0);

        if (Array.isArray(topRes) && topRes.length) {
          // Map results to tours and ensure we always have at least 6 items by padding with fallbacks
          // const mappedTours = topRes.map((item: any, index: number) => ({
          //   title: item.sectionData?.topgallery?.title || `Photo ${index + 1}`,
          //   src: item.sectionData?.topgallery?.image || "/fallback-image.jpg",
          // }));
          const mappedTours = (topRes as TopGalleryItem[]).map(
  (item, index: number) => ({
    title: item.sectionData?.topgallery?.title || `Photo ${index + 1}`,
    src: item.sectionData?.topgallery?.image || "/fallback-image.jpg",
  })
);

          const fallbackImgs = [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
            "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          ];

          const tours = [...mappedTours];
          let i = 0;
          while (tours.length < 6) {
            tours.push({ title: `Photo ${tours.length + 1}`, src: fallbackImgs[i % fallbackImgs.length] });
            i++;
          }

          const formattedData = {
            title: `Photos of ${countryName}`,
            subtitle: `See pictures of the best destinations and attractions in ${countryName}`,
            tours,
          };

          console.log('Formatted photos data:', formattedData);
          setData(formattedData);
        } else {
          console.log('No topgallery found for country, using fallback images');
        }
      } catch (err) {
        console.error("Photos fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [params?.locale]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!data || data.tours.length < 6) {
    return null;
  }

  const { title, subtitle, tours } = data;
  const visibleTours = tours.slice(0, 6);

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
    <section className="container mx-auto mt-1 md:mt-1 p-2 xl:p-0">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="text-center mb-8 font-normal text-gray-800"
      >
        {subtitle}
      </motion.p>

      <div className="relative">
        <div className="relative overflow-hidden rounded-lg border-4 border-brown-800">
          <Image
            src={visibleTours[0].src || "/fallback-image.jpg"}
            alt={visibleTours[0].title}
            width={896}
            height={479}
            className="w-full h-[479px] object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-2 rounded">
            {visibleTours.map((tour, index) => (
              <div
                key={index}
                className="cursor-pointer w-[120px] h-[75px] rounded-lg overflow-hidden border"
                onClick={() => openPopup(index)}
              >
                <Image
                  src={tour.src || "/fallback-image.jpg"}
                  alt={tour.title}
                  width={120}
                  height={8}
                  loading="lazy"
                  className={`object-cover h-full w-full ${currentSlide === index
                      ? "border-2 border-blue-500"
                      : "border border-gray-300"
                    }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <button
            type="button"
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-50"
            onClick={closePopup}
          >
            &times;
          </button>

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
                  className={`rounded-lg object-cover border ${currentSlide === index
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