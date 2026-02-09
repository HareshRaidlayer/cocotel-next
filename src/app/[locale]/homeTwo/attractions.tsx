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
interface BlogItem {
	_id: string;
	sectionData: {
		blog: {
			title?: string;
			image?: string;
		};
	};
}


const Attractions: React.FC = () => {
	const params = useParams();
	const locale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale || "ph";

	const [data, setData] = useState<{
		title: string;
		subtitle: string;
		tours: Tour[];
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Map locale to country code
				const countryCodeMap: { [key: string]: string } = {
					ph: "PH",
					id: "ID",
					aus: "AUS"
				};
				const countryCode = countryCodeMap[locale.toLowerCase()] || "PH";

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
				const countryName = countryRes[0].sectionData.country.countryname;

				// Fetch blogs with "top attraction" tag
				const blogs = await fetchFromAPI({
					appName: "app3534482538357",
					moduleName: "blog",
					query: {
						"sectionData.blog.country": countryId,
						"sectionData.blog.is_active": true,
						"sectionData.blog.tags": "top attraction",
					},
					sortBy: "sectionData.blog.order",
					order: "asc",
					limit: 8,
				});

				// Format data
				setData({
					title: `Top Attractions in ${countryName}`,
					subtitle: `Discover the most amazing attractions in ${countryName}`,
					tours: Array.isArray(blogs)
	? (blogs as BlogItem[]).map((item) => ({
			title: item.sectionData?.blog?.title || "Untitled",
			src: item.sectionData?.blog?.image || "/fallback-image.jpg",
	  }))
	: [],
					// tours: Array.isArray(blogs)
					// 	? blogs.map((item: any) => ({
					// 			title: item?.sectionData?.blog?.title || "Untitled",
					// 			src: item?.sectionData?.blog?.image || "/fallback-image.jpg",
					// 	  }))
					// 	: [],
				});
			} catch (error) {
				console.error("Error fetching attractions:", error);
				setData(null);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [locale]);

	if (loading) return <div className="text-center py-8">Loading...</div>;
	if (!data || !data.tours.length) return null;

	const { title, subtitle, tours } = data;

	return (
		<section className="container mx-auto mt-5 md:mt-12 p-2 xl:p-0">
			<div className="">
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

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					{tours.map((tour, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.2 }}
							className="relative group rounded-lg overflow-hidden"
						>
							{/* Number Badge */}
							<div className="glassy absolute top-0 left-0 bg-red-500 text-white rounded-br-2xl w-[40px] h-[40px] flex items-center justify-center text-lg font-bold">
								{index + 1}
							</div>

							{/* Image */}
							<Image
								src={tour.src || "/fallback-image.jpg"}
								alt={tour.title}
								width={321}
								height={199}
								className="object-cover w-full h-[199px]"
								loading="lazy"

							/>

							{/* Title inside image */}
							<div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 text-center">
								<p className="text-white font-bold text-sm md:text-base">
									{tour.title}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				<div className="text-right mt-4">
					<a href="/hotellist" className="text-blue-600 hover:underline">
						See all attractions →
					</a>
				</div>
			</div>
		</section>
	);
};

export default Attractions;