"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import Features from "@/app/[locale]/homeTwo/Features";
import { fetchFromAPI } from "@/lib/api";

type PromoHotel = {
  id: string;
  name: string;
  slug: string;
  image: string;
  location: string;
  price: number;
};

type Promo = {
  id: string;
  code: string;
  title: string;
  image: string;
  discountWeekday: number;
  discountWeekend: number;
  discountTypeWeekday: "percentage" | "fixed";
  discountTypeWeekend: "percentage" | "fixed";
  startDate: string;
  endDate: string;
  bookStartDate: string;
  bookEndDate: string;
  hotels: PromoHotel[];
};

export default function PromotionsSection() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const promoCodes = await fetchFromAPI<Record<string, unknown>[]>({
          appName: "app3534482538357",
          moduleName: "newpromocodes",
          query: {
            "sectionData.newpromocodes.is_status": "0",
            "sectionData.newpromocodes.is_deleted": "0",
          },
        });

        if (!promoCodes || promoCodes.length === 0) {
          setLoading(false);
          return;
        }

        const promoDetails = await fetchFromAPI<Record<string, unknown>[]>({
          appName: "app3534482538357",
          moduleName: "newpromodetails",
          query: {
            "sectionData.newpromodetails.is_status": "0",
            "sectionData.newpromodetails.is_deleted": "0",
          },
        });

        const hotels = await fetchFromAPI<Record<string, unknown>[]>({
          appName: "app3534482538357",
          moduleName: "company",
          query: {},
        });

        const promosWithHotels = promoCodes.map((promo) => {
          const promoData = (promo.sectionData as Record<string, unknown>).newpromocodes as Record<string, unknown>;
          const promoId = promo._id as string;

          const details = promoDetails.filter((detail) => {
            const detailData = (detail.sectionData as Record<string, unknown>).newpromodetails as Record<string, unknown>;
            return detailData.newpromocodeid === promoId;
          });

          const hotelIds = new Set<string>();
          details.forEach((detail) => {
            const detailData = (detail.sectionData as Record<string, unknown>).newpromodetails as Record<string, unknown>;
            const ids = detailData.hotelid as string[];
            ids?.forEach((id) => hotelIds.add(String(id)));
          });

          const promoHotels = hotels
            .filter((hotel) => hotelIds.has(String(hotel._id)))
            .map((hotel) => {
              const hotelData = (hotel.sectionData as Record<string, unknown>).Company as Record<string, unknown>;

              let primaryImage = "/images/defualtimg.webp";
              if (hotelData.primary_image && String(hotelData.primary_image).trim() &&
                hotelData.primary_image !== "null" && hotelData.primary_image !== "undefined") {
                primaryImage = String(hotelData.primary_image).trim();
              }

              return {
                id: hotel._id as string,
                name: (hotelData.web_title || hotelData.companyName) as string,
                slug: hotelData.slug as string,
                image: primaryImage,
                location: hotelData.web_city as string,
                price: Number(hotelData.web_price || 2500),
              };
            });

          return {
            id: promoId,
            code: promoData.promo_code as string,
            title: promoData.promo_title as string,
            image: promoData.image as string,
            discountWeekday: Number(promoData.discount_in_percentage_weekday || 0) || Number(promoData.discount_in_price_weekday || 0),
            discountWeekend: Number(promoData.discount_in_percentage_weekend || 0) || Number(promoData.discount_in_price_weekend || 0),
            discountTypeWeekday: Number(promoData.discount_in_percentage_weekday || 0) > 0 ? "percentage" as const : "fixed" as const,
            discountTypeWeekend: Number(promoData.discount_in_percentage_weekend || 0) > 0 ? "percentage" as const : "fixed" as const,
            startDate: promoData.startdate as string,
            endDate: promoData.enddate as string,
            bookStartDate: promoData.bookstartdate as string,
            bookEndDate: promoData.bookenddate as string,
            hotels: promoHotels,
          };
        });

        console.log("Promos with hotels:", promosWithHotels.map(p => ({ code: p.code, hotelCount: p.hotels.length })));
        setPromos(promosWithHotels);
        if (promosWithHotels.length > 0) {
          setActiveTab(promosWithHotels[0].id);
        }
      } catch (err) {
        console.error("Error fetching promos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const handlePromoClick = (promoId: string) => {
    setActiveTab(activeTab === promoId ? null : promoId);
  };

  const activePromo = promos.find((p) => p.id === activeTab);

  const calculateDiscountedPrice = (originalPrice: number, discount: number, discountType: string) => {
    if (discountType === "percentage") {
      return originalPrice - (originalPrice * discount) / 100;
    }
    return originalPrice - discount;
  };

  if (loading) {
    return <div className="text-center py-12">Loading promotions...</div>;
  }

  if (promos.length === 0) {
    return <div className="text-center py-12">No active promotions available</div>;
  }

  return (
    <div className="mb-16">
      <div className="container mx-auto mt-10 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl font-bold text-center mb-6 text-green-600"
        >
          Find The Best Promotions That Suit Your Needs
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {promos.map((promo, i) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => handlePromoClick(promo.id)}
              className={`relative rounded-xl overflow-hidden shadow-md group cursor-pointer aspect-[320/180] min-w-0 transition-all ${activeTab === promo.id ? "ring-4 ring-green-500 scale-105" : ""
                }`}
            >
              <Image
                src={promo.image && promo.image !== "NULL" ? promo.image : "/promocode/promo-1.png"}
                alt={promo.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {activeTab === promo.id && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Active
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {!activeTab && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Click on a promotion card to view available hotels</p>
          </div>
        )}

        {activeTab && activePromo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-green-700">
                Available Hotels for {activePromo.title}
              </h2>

              <div className="bg-green-200 rounded-xl shadow p-4 mt-2 mb-6 w-full mx-auto border border-green-100">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Offer Details</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>
                    <span className="font-medium">Promo Code:</span> {activePromo.code}
                  </li>
                  <li>
                    <span className="font-medium">Booking Dates:</span> {activePromo.bookStartDate} - {activePromo.bookEndDate}
                  </li>
                  <li>
                    <span className="font-medium">Travel Dates:</span> {activePromo.startDate} - {activePromo.endDate}
                  </li>
                  <li>
                    <span className="font-medium">Discount (Weekday):</span>{" "}
                    {activePromo.discountTypeWeekday === "percentage"
                      ? `${activePromo.discountWeekday}%`
                      : `₱${activePromo.discountWeekday}`}
                  </li>
                  <li>
                    <span className="font-medium">Discount (Weekend):</span>{" "}
                    {activePromo.discountTypeWeekend === "percentage"
                      ? `${activePromo.discountWeekend}%`
                      : `₱${activePromo.discountWeekend}`}
                  </li>
                </ul>
              </div>
            </div>

            <Features
              tours={activePromo.hotels.map((hotel) => {
                const originalPrice = hotel.price;
                const discountedPrice = calculateDiscountedPrice(
                  originalPrice,
                  activePromo.discountWeekday,
                  activePromo.discountTypeWeekday
                );
                const savingsAmount = originalPrice - discountedPrice;

                return {
                  title: hotel.name,
                  city: hotel.location || "Philippines",
                  country: "PH",
                  src: [],
                  primaryImage: hotel.image,
                  price: discountedPrice.toFixed(0),
                  originalPrice: savingsAmount.toFixed(0),
                  discount: activePromo.discountTypeWeekday === "percentage"
                    ? `${activePromo.discountWeekday}% OFF`
                    : `₱${activePromo.discountWeekday} OFF`,
                  category: "Hotel",
                  slug: hotel.slug,
                };
              })}
              title=""
              subtitle=""
              currencySymbol="PHP"
              gridCols="lg:grid-cols-4"
              searchParams={{}}
            />
          </motion.div>
        )}

        <div className="mt-16 py-12 bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-lg border border-green-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-green-700 mb-3"
            >
              Subscribe to Our Email List
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-green-600 text-lg mb-8"
            >
              Subscribe to our exclusive promotions
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed! (demo)");
              }}
            >
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full sm:w-56 px-5 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white shadow-sm text-gray-700 placeholder-gray-400"
                required
              />

              <input
                type="tel"
                placeholder="Mobile No"
                className="w-full sm:w-56 px-5 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white shadow-sm text-gray-700 placeholder-gray-400"
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full sm:w-64 px-5 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white shadow-sm text-gray-700 placeholder-gray-400"
                required
              />

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Subscribe
              </button>
            </motion.form>

            <p className="mt-6 text-sm text-gray-500">
              We respect your privacy — you can unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
