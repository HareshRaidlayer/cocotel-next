"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Features from "@/app/[locale]/homeTwo/Features";

type Promo = {
	id: string;
	image: string;
	title: string;
	subtitle: string;
	badge?: string;
	details: {
		promoCode: string;
		bookingDates: string;
		travelDates: string;
		discountWeekday: string;
		discountWeekend: string;
	};
};

type HotelTour = {
	title: string;
	city: string;
	country: string;
	src: string[];
	price: string;
	originalPrice: string;
	discount: string;
	category: string;
	primaryImage: string;
	slug: string;
};

const promos: Promo[] = [
	{
		id: "mega-sale",
		image: "/promocode/promo-1.png",
		title: "Mega Sale",
		subtitle: "Up to 60% off",
		details: {
			promoCode: "MEGA60",
			bookingDates: "Jan 1 - Jan 31",
			travelDates: "Feb 1 - Feb 28",
			discountWeekday: "60%",
			discountWeekend: "50%",
		},
	},
	{
		id: "the-lalit",
		image: "/promocode/promo-2.png",
		title: "The Lalit",
		subtitle: "Up to 15% off",
		details: {
			promoCode: "LALIT15",
			bookingDates: "Feb 1 - Feb 28",
			travelDates: "Mar 1 - Mar 31",
			discountWeekday: "15%",
			discountWeekend: "10%",
		},
	},
	{
		id: "minor-hotels",
		image: "/promocode/promo-3.png",
		title: "Minor Hotels",
		subtitle: "Luxury Deals",
		details: {
			promoCode: "LALIT15",
			bookingDates: "Feb 1 - Feb 28",
			travelDates: "Mar 1 - Mar 31",
			discountWeekday: "15%",
			discountWeekend: "10%",
		},
	},
	{
		id: "premium-resorts",
		image: "/promocode/promo-4.png",
		title: "Premium Resorts",
		subtitle: "Exclusive Deals",
		details: {
			promoCode: "PREMIUM20",
			bookingDates: "Mar 1 - Mar 31",
			travelDates: "Apr 1 - Apr 30",
			discountWeekday: "20%",
			discountWeekend: "15%",
		},
	},
];

const hotelsByPromo: Record<string, HotelTour[]> = {
	"mega-sale": [
		{
			title: "Grand Luxury Hotel & Spa",
			city: "Manila",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "2,500",
			originalPrice: "1,500",
			discount: "60% OFF",
			category: "5-Star Hotel",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "grand-luxury-hotel-spa",
		},
		{
			title: "Seaside Paradise Resort",
			city: "Boracay",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "3,200",
			originalPrice: "1,800",
			discount: "55% OFF",
			category: "Beach Resort",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "seaside-paradise-resort",
		},
		{
			title: "Mountain View Lodge",
			city: "Tagaytay",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "1,800",
			originalPrice: "900",
			discount: "50% OFF",
			category: "Mountain Resort",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "mountain-view-lodge",
		},
		{
			title: "Urban Comfort Inn",
			city: "Quezon City",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "1,200",
			originalPrice: "600",
			discount: "50% OFF",
			category: "City Hotel",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "urban-comfort-inn",
		},
	],
	"the-lalit": [
		{
			title: "The Lalit Grand Palace",
			city: "Makati",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "4,500",
			originalPrice: "675",
			discount: "15% OFF",
			category: "Luxury Hotel",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "the-lalit-grand-palace",
		},
		{
			title: "The Lalit Beach Resort",
			city: "El Nido",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "5,200",
			originalPrice: "780",
			discount: "15% OFF",
			category: "Beach Resort",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "the-lalit-beach-resort",
		},
		{
			title: "The Lalit City Center",
			city: "BGC",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "3,800",
			originalPrice: "570",
			discount: "15% OFF",
			category: "Business Hotel",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "the-lalit-city-center",
		},
	],
	"minor-hotels": [
		{
			title: "Anantara Luxury Resort",
			city: "Cebu",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "5,800",
			originalPrice: "1,450",
			discount: "25% OFF",
			category: "Luxury Resort",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "anantara-luxury-resort",
		},
		{
			title: "NH Collection Manila",
			city: "BGC",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "4,200",
			originalPrice: "1,260",
			discount: "30% OFF",
			category: "Business Hotel",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "nh-collection-manila",
		},
		{
			title: "Oaks Sydney Hotel",
			city: "Davao",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "3,800",
			originalPrice: "1,140",
			discount: "30% OFF",
			category: "City Hotel",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "oaks-sydney-hotel",
		},
		{
			title: "Tivoli Garden Resort",
			city: "Palawan",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "4,600",
			originalPrice: "1,150",
			discount: "25% OFF",
			category: "Garden Resort",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "tivoli-garden-resort",
		},
	],
	"premium-resorts": [
		{
			title: "Amanpulo Private Island",
			city: "Pamalican",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "12,000",
			originalPrice: "4,200",
			discount: "35% OFF",
			category: "Private Resort",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "amanpulo-private-island",
		},
		{
			title: "Shangri-La Boracay",
			city: "Boracay",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "8,500",
			originalPrice: "3,400",
			discount: "40% OFF",
			category: "Luxury Resort",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "shangri-la-boracay",
		},
		{
			title: "The Peninsula Manila",
			city: "Makati",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "7,200",
			originalPrice: "2,520",
			discount: "35% OFF",
			category: "5-Star Hotel",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "the-peninsula-manila",
		},
		{
			title: "El Nido Resorts",
			city: "El Nido",
			country: "PH",
			src: ["/images/hotel-placeholder.jpg", "/images/hotel-placeholder.jpg"],
			price: "9,800",
			originalPrice: "3,430",
			discount: "35% OFF",
			category: "Island Resort",
			primaryImage: "/images/hotel-placeholder.jpg",
			slug: "el-nido-resorts",
		},
	],
};

export default function PromotionsSection() {
	const [activeTab, setActiveTab] = useState<string | null>("mega-sale");

	const handlePromoClick = (promoId: string) => {
		setActiveTab(activeTab === promoId ? null : promoId);
	};

	const activePromo = promos.find((p) => p.id === activeTab);

	return (
		<div className="mb-16">
			{/* Promotion Cards */}
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
							className={`relative rounded-xl overflow-hidden shadow-md group cursor-pointer aspect-[320/180] min-w-0 transition-all ${
								activeTab === promo.id ? "ring-4 ring-green-500 scale-105" : ""
							}`}
						>
							<Image
								src={promo.image}
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
						<p className="text-lg">
							Click on a promotion card to view available hotels
						</p>
					</div>
				)}
				{/* Hotels List using Features component */}
				{activeTab && hotelsByPromo[activeTab] && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
					>
						<div className="mb-4">
							<h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-green-700">
								Available Hotels for {activePromo?.title}
							</h2>

							{activePromo && (
								<div className="bg-green-200 rounded-xl shadow p-4 mt-2 mb-6 w-full mx-auto border border-green-100">
									<h3 className="text-lg font-semibold text-green-700 mb-2">
										Offer Details
									</h3>
									<ul className="text-gray-700 text-sm space-y-1">
										<li>
											<span className="font-medium">Promo Code:</span>{" "}
											{activePromo.details.promoCode}
										</li>
										<li>
											<span className="font-medium">Booking Dates:</span>{" "}
											{activePromo.details.bookingDates}
										</li>
										<li>
											<span className="font-medium">Travel Dates:</span>{" "}
											{activePromo.details.travelDates}
										</li>
										<li>
											<span className="font-medium">Discount (Weekday):</span>{" "}
											{activePromo.details.discountWeekday}
										</li>
										<li>
											<span className="font-medium">Discount (Weekend):</span>{" "}
											{activePromo.details.discountWeekend}
										</li>
									</ul>
								</div>
							)}
						</div>
						<Features
							tours={hotelsByPromo[activeTab]}
							title={""}
							subtitle={""}
							currencySymbol="PHP"
							gridCols="lg:grid-cols-4"
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
								// Add your subscribe logic here (e.g. API call)
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
