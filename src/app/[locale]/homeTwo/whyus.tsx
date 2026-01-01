"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from '@/lib/locale-context';
import Image from "next/image";


const WhyUs = () => {
  const { t } = useLocale();

  const cards = [
    { title: t('whyUs.card1.title'), desc: t('whyUs.card1.desc'), icon: "/images/icon-1.png", bg: "bg-green-100" },
    { title: t('whyUs.card2.title'), desc: t('whyUs.card2.desc'), icon: "/images/icon-2.png", bg: "bg-purple-100" },
    { title: t('whyUs.card3.title'), desc: t('whyUs.card3.desc'), icon: "/images/icon-3.png", bg: "bg-teal-100" },
    { title: t('whyUs.card4.title'), desc: t('whyUs.card4.desc'), icon: "/images/icon-4.png", bg: "bg-pink-100" },
    { title: t('whyUs.card5.title'), desc: t('whyUs.card5.desc'), icon: "/images/icon-5.png", bg: " bg-yellow-100" },
    { title: t('whyUs.card6.title'), desc: t('whyUs.card6.desc'), icon: "/images/icon-6.png", bg: "bg-sky-100" },
  ];

  const bottomCards = [cards[0], cards[1], cards[2], cards[3], cards[4], cards[5]]; // Money, Globe, Smile, Phone

  return (
    <section className="container mx-auto py-8 md:py-12 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600"
      >
        {t('whyUs.title')}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mb-8 md:mb-12 font-normal text-gray-800 max-w-3xl mx-auto"
      >
        {t('whyUs.subtitle')}
      </motion.p>

      {/* Bottom Row - 4 smaller cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bottomCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            className={`vendor-card ${card.bg} rounded-3xl shadow-lg px-2 pt-0 pb-8  text-center`}
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