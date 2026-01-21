"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useLocale } from '@/lib/locale-context';
import Head from "next/head";
import { fetchFromAPI } from "@/lib/api";
import SearchBar from "@/components/SearchBar";

const locations = {
  ph: ["Manila", "Cebu", "Boracay"],
  id: ["Bali", "Jakarta", "Yogyakarta"],
  aus: ["Sydney", "Melbourne", "Brisbane"],
};

const Hero = ({ data }) => {
  const { t } = useLocale();
  const router = useRouter(); // Initialize useRouter
  const [countries, setCountries] = useState([]);
  const [activeCountry, setActiveCountry] = useState("ph");
  const [sectionOne, setSectionOne] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        /* 1️⃣ Fetch homesection */
        const homeRes = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "homesection",
          limit: 1,
        });

        const sectionOneData =
          homeRes?.[0]?.sectionData?.homesection?.sectionOne?.[0];

        if (!sectionOneData) return;

        // save banner data
        setSectionOne(sectionOneData);

        if (!sectionOneData.sectiononecountry?.length) return;

        const allowedCountryIds = sectionOneData.sectiononecountry;


        /* 2️⃣ Fetch countries */
        const countryRes = await fetchFromAPI({
        appName: "app3534482538357",
        moduleName: "country",
        query: {
          _id: { $in: allowedCountryIds },
          "sectionData.country.is_active": true,
        },
      }, {
        next: { 
          revalidate: 86400     // or 24 hours
        }
      });

        /* 3️⃣ Format for UI */
        const formattedCountries = countryRes.map((item) => ({
          id: item._id,
          code: item.sectionData.country.countrycode.toLowerCase(),
          name: item.sectionData.country.countryname,
          flag: item.sectionData.country.image,
        }));

        setCountries(formattedCountries);
      } catch (err) {
        console.error("Error loading countries", err);
      }
    };

    fetchCountries();
  }, []);


  useEffect(() => {
    const path = window.location.pathname.replace("/", "");
    if (path) setActiveCountry(path);
  }, []);

  const handleCountryClick = (code) => {
    setActiveCountry(code);
    router.push(`/${code}`);
  };

  return (
    <>
      <Head>
        <link rel="preload" href={data.video} as="video" />

        <link rel="preload" href={`/images/${data.videoPoster}`} as="image" />

      </Head>
      <section className="container mx-auto mt-0 md:mt-5 relative h-80 md:h-[480px] lg:h-[380px] rounded-none md:rounded-xl">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover rounded-none md:rounded-xl"
          src={data.video}
          poster={`/images/${data.videoPoster}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          loading="lazy"
        />

        {/* Overlay */}

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 text-shadow-c-lg">
            {sectionOne?.sectiononebannerheading || "Just Unpacked!"}{/* {t('hero.title')}  */}
          </h1>
          <p className="text-sm font-medium lg:text-md max-w-5xl mb-3 text-shadow-c-lg">
            {sectionOne?.sectiononebannersubheading || "no text"} {/* {t('hero.subtitle')} */}
          </p>

          {/* Search Bar */}
          <SearchBar 
            countries={countries}
            activeCountry={activeCountry}
            onCountryClick={handleCountryClick}
          />
        </div>
      </section>
      
      {/* Mobile Search */}
      <section className="container mx-auto">
        <SearchBar 
          countries={countries}
          activeCountry={activeCountry}
          onCountryClick={handleCountryClick}
          isMobile={true}
        />
      </section>
      <section className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-around bg-white border-b border-green-500 text-green-600 pt-0 md:pt-5 pb-5 px-2 lg:px-0">
          <div className="flex items-start space-x-2 p-2 sm:p-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              <path d="M10 4a1 1 0 011 1v6a1 1 0 11-2 0V5a1 1 0 011-1z" />
            </svg>
            <span className="text-sm font-semibold">{t('hero.feature1')}</span>
          </div>
          <div className="flex items-start space-x-2 p-2 sm:p-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 011 1v8a1 1 0 11-2 0V3a1 1 0 011-1zm5 5a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z" />
            </svg>
            <span className="text-sm font-semibold">{t('hero.feature2')}</span>
          </div>
          <div className="flex items-start space-x-2 p-2 sm:p-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9a1 1 0 100 2h6a1 1 0 100-2H7z" />
            </svg>
            <span className="text-sm font-semibold">{t('hero.feature3')}</span>
          </div>
          <div className="flex items-start space-x-2 p-2 sm:p-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12z" />
            </svg>
            <span className="text-sm font-semibold">{t('hero.feature4')}</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;