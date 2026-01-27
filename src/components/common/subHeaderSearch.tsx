"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState,  useEffect } from "react";
// import { Search, Calendar, Users, Plus, Minus } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation";
import { fetchFromAPI } from "@/lib/api";

export default function SearchSubHeader() {
    const router = useRouter(); // Initialize useRouter
    const [countries, setCountries] = useState<any[]>([]);
    const [activeCountry, setActiveCountry] = useState("ph");
  
    useEffect(() => {
      const fetchCountries = async () => {
        try {
          /* 1️⃣ Fetch homesection */
          const homeRes: unknown[] = await fetchFromAPI({
            appName: "app3534482538357",
            moduleName: "homesection",
            limit: 1,
          });
  
          const sectionOneData =
            ((homeRes?.[0] as any)?.sectionData?.homesection?.sectionOne?.[0]) as any;
  
          if (!sectionOneData) return;
  
          // save banner data
  
          if (!sectionOneData.sectiononecountry?.length) return;
  
          const allowedCountryIds = sectionOneData.sectiononecountry;
  
  
          /* 2️⃣ Fetch countries */
          const countryRes: unknown[] = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "country",
          query: {
            _id: { $in: allowedCountryIds },
            "sectionData.country.is_active": true,
          },
        });
  
          /* 3️⃣ Format for UI */
          const formattedCountries = countryRes.map((item: any) => ({
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
  
    const handleCountryClick = (code: string) => {
      setActiveCountry(code);
      router.push(`/${code}`);
    };

  return (
    <div className="bg-green-600 py-4  md:sticky md:top-0 md:z-50 w-full">
      <SearchBar 
        countries={countries}
        activeCountry={activeCountry}
        onCountryClick={handleCountryClick}
      />
       <section className="container mx-auto px-2">
        <SearchBar 
          countries={countries}
          activeCountry={activeCountry}
          onCountryClick={handleCountryClick}
          isMobile={true}
        />
      </section>
    </div>
  );
}
