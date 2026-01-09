"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchFromAPI } from "@/lib/api";

interface PromoItem {
	_id: string;
	sectionData: {
		promocode: {
			promoname: string;
			DiscountValue: string;
			DiscountIn: string;
			image: string;
			tags: string[];
			is_active: boolean;
		};
	};
}

export default function CocotelOffers() {
	const [offers, setOffers] = useState<PromoItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOffers = async () => {
			try {
				const res = await fetchFromAPI({
					appName: "app3534482538357",
					moduleName: "promocode",
					query: {
						"sectionData.promocode.is_active": true,
						"sectionData.promocode.tags": { $in: ["Home"] },
					},
					limit: 2,
				});
				setOffers((res as PromoItem[]) || []);

			} catch (error) {
				console.error("Failed to fetch offers", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOffers();
	}, []);

	if (loading || offers.length === 0) return null;
	return (
		<section className="container mx-auto mt-6 md:mt-10 w-full p-2 xl:p-0">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{offers.map((item) => {
					const promo = item.sectionData.promocode;

					return (
						<div
							key={item._id}
							className="relative rounded-2xl h-60 overflow-hidden p-2 md:p-8 flex items-center gap-4 z-0"
						>
							{/* Background Image */}
							<Image
								src={promo.image || "/images/offers-banner-2.png"}
								alt={promo.promoname}
								fill
								priority={false}
								className="object-cover object-center -z-10"
							/>

							{/* Content goes here (unchanged UI placeholder) */}
							<div className="relative z-10 text-white">
								{/* your content */}
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
// 	return (
// 		<section className="container mx-auto mt-6 md:mt-10 w-full p-2 xl:p-0">
// 			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// 				<div className="relative rounded-2xl h-60 overflow-hidden p-2 md:p-8 flex items-center gap-4 z-0">
// 					{/* Background Image */}
// 					<Image
// 						src="/images/offers-banner-2.png"
// 						alt="offers banner"
// 						fill
// 						priority={false}
// 						className="object-cover object-center -z-10"
// 					/>

// 					{/* Content goes here */}
// 					<div className="relative z-10 text-white">
// 						{/* your content */}
// 					</div>
// 				</div>

// 				<div className="relative rounded-2xl h-60 overflow-hidden p-2 md:p-8 flex items-center gap-4 z-0">
// 					{/* Background Image */}
// 					<Image
// 						src="/images/offers-banner-2.png"
// 						alt="offers banner"
// 						fill
// 						priority={false}
// 						className="object-cover object-center -z-10"
// 					/>

// 					{/* Content goes here */}
// 					<div className="relative z-10 text-white">
// 						{/* your content */}
// 					</div>
// 				</div>
// 			</div>
// 		</section>
// 	);
// }
