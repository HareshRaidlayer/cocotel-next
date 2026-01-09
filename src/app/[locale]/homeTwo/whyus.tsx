"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { fetchFromAPI } from "@/lib/api";
import { useLocale } from '@/lib/locale-context';
import Image from "next/image";

interface WhyUsCard {
  title: string;
  desc: string;
  icon: string;
  bg: string;
}

interface WhyUsItem {
  whyuscountry: string;
  whyuslanguage: string;
  whyusisactive: boolean;
  whyustitle?: string;
  whyusdescription?: string;
  whyusimage_one?: string;
  whyustext?: string;
}

interface HomeSection {
  sectionData?: {
    homesection?: {
      whyUs?: WhyUsItem[];
    };
  };
}

const WhyUs = () => {
  const params = useParams();
  const { locale } = useLocale();
  
  const [data, setData] = useState<{
    title: string;
    subtitle: string;
    cards: WhyUsCard[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get country from URL locale
        const countryCodeMap: { [key: string]: string } = {
          ph: "PH",
          id: "ID", 
          aus: "AUS"
        };
        
        const urlLocale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale || "ph";
        const countryCode = countryCodeMap[urlLocale.toLowerCase()] || "PH";
        
        // Get language from locale context (independent of URL)
        const languageCode = locale || "en";

        // Fetch country data
        const countryRes = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "country",
          query: {
            "sectionData.country.countrycode": countryCode,
            "sectionData.country.is_active": true,
          },
          limit: 1,
        });

        if (!countryRes || !Array.isArray(countryRes) || countryRes.length === 0) {
          setLoading(false);
          return;
        }

        const countryId = countryRes[0]._id;

        // Fetch language data
        const languageRes = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "language",
          query: {
            "sectionData.language.languagecode": languageCode,
            "sectionData.language.is_active": true,
          },
          limit: 1,
        });

        if (!languageRes || !Array.isArray(languageRes) || languageRes.length === 0) {
          setLoading(false);
          return;
        }

        const languageId = languageRes[0]._id;

        // Fetch homesection data
        const homesectionRes = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "homesection",
          query: {},
          limit: 10,
        });

        if (!homesectionRes || !Array.isArray(homesectionRes) || homesectionRes.length === 0) {
          setLoading(false);
          return;
        }

        // Find whyUs data from all homesection records
        // let whyUsData: any[] = [];
        // homesectionRes.forEach((section: any) => {
        //   if (section?.sectionData?.homesection?.whyUs) {
        //     whyUsData = [...whyUsData, ...section.sectionData.homesection.whyUs];
        //   }
        // });
        let whyUsData: WhyUsItem[] = [];

(homesectionRes as HomeSection[]).forEach((section) => {
  if (section?.sectionData?.homesection?.whyUs) {
    whyUsData = [
      ...whyUsData,
      ...section.sectionData.homesection.whyUs,
    ];
  }
});

        
        // Filter whyUs items for current country and language
        const filteredWhyUs = whyUsData.filter(
  (item) =>
    item.whyuscountry === countryId &&
    item.whyuslanguage === languageId &&
    item.whyusisactive
);

        // const filteredWhyUs = whyUsData.filter((item: any) => 
        //   item.whyuscountry === countryId && 
        //   item.whyuslanguage === languageId && 
        //   item.whyusisactive
        // );

        // Background color mapping
        const bgColors = [
          "bg-green-100",
          "bg-purple-100", 
          "bg-teal-100",
          "bg-pink-100",
          "bg-yellow-100",
          "bg-sky-100"
        ];

        // Format data
        setData({
          title: `Why Choose ${countryRes[0].sectionData.country.countryname}`,
          subtitle: "Discover what makes us the perfect choice for your travel needs",
         cards: filteredWhyUs.map((item, index: number) => ({
  title: item.whyustitle || "Untitled",
  desc: item.whyusdescription || "No description",
  icon: item.whyusimage_one || "/images/icon-1.png",
  bg:
    item.whyustext && item.whyustext.startsWith("#")
      ? item.whyustext
      : bgColors[index % bgColors.length],
}))

        });
      } catch (error) {
        console.error("Error fetching WhyUs data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.locale, locale]); // Re-fetch when URL locale or language changes

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!data || !data.cards.length) return null;

  const { title, subtitle, cards } = data;

  return (
    <section className="container mx-auto py-8 md:py-12 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mb-8 md:mb-12 font-normal text-gray-800 max-w-3xl mx-auto"
      >
        {subtitle}
      </motion.p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            className={`vendor-card rounded-3xl shadow-lg px-2 pt-0 pb-8 text-center`}
            style={{ backgroundColor: card.bg.includes('#') ? card.bg : undefined }}
          >
            <div className="vendor-card__logo mb-6 flex  items-center justify-center">
              {/* {React.cloneElement(card.icon, { size: 40 })} */}
              <Image
                  src={card.icon}
                  alt={card.title}
                  width={100}
                  height={100}
                  className=" "
                  
                />
            </div>
            <h3 className="title text-lg font-bold mt-5 text-gray-900">
              {card.title}
            </h3>
			        <p className="relative z-10 text-gray-800 mt-5 text-sm leading-relaxed px-3">
              {card.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyUs;