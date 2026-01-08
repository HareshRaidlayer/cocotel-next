"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { fetchFromAPI } from "@/lib/api";

const TopThingsToDo = () => {
	const params = useParams();
	const locale = params?.locale?.toLowerCase() || "ph";

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				/* 1️⃣ Resolve country by locale */
				const countryCode = locale === "id" ? "ID" : "PH";

				const countryRes = await fetchFromAPI({
					appName: "app3534482538357",
					moduleName: "country",
					query: {
						"sectionData.country.countrycode": countryCode,
						"sectionData.country.is_active": true,
					},
					limit: 1,
				});

				if (!countryRes || !countryRes.length) {
					setLoading(false);
					return;
				}

				const countryId = countryRes[0]._id;

				/* 2️⃣ Fetch blogs by country + tag */
				const blogs = await fetchFromAPI({
					appName: "app3534482538357",
					moduleName: "blog",
					query: {
						"sectionData.blog.country": countryId,
						"sectionData.blog.is_active": true,
						"sectionData.blog.tags": "top things to do",
					},
					sort: { "sectionData.blog.order": 1 },
					limit: 8,
				});

				/* 3️⃣ Format UI data */
				setData({
					title:
						countryCode === "ID"
							? "Top Things to Do in Indonesia"
							: "Top Things to Do in Philippines",
					subtitle:
						countryCode === "ID"
							? "Discover amazing destinations in Indonesia"
							: "Explore beautiful places in the Philippines",
					tours: Array.isArray(blogs)
						? blogs.map((item) => ({
							title: item?.sectionData?.blog?.title || "Untitled",
							src:
								item?.sectionData?.blog?.image ||
								"/placeholder-image.jpg",
						}))
						: [],
				});
			} catch (error) {
				console.error("Error fetching Top Things to Do:", error);
				setData(null);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [locale]);

	if (loading) return <div className="text-center py-8">Loading...</div>;
	if (!data || !data.tours.length) return null;

	return (
		<section className="container mx-auto bg-white mt-4 md:mt-10 p-2 xl:p-0">
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
				className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600"
			>
				{data.title}
			</motion.h2>
			<motion.p
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
				className="text-center mb-4 md:mb-8 font-normal text-gray-800"
			>
				{data.subtitle}
			</motion.p>

			{/* Tour Places */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
				{data.tours.map((tour, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: index * 0.2 }}
						className="relative group rounded-lg linear-gradient-bottom-custom overflow-hidden"
					>
						<Image
							src={tour.src}
							alt={tour.title}
							width={420}
							height={200}
							className="rounded-lg object-cover w-full h-[150px]"
							loading="lazy"
							quality={75}
							placeholder="blur"
							blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
						/>
						<p className="absolute bottom-0 left-0 w-full  text-white text-center py-2 font-semibold z-10">
							{tour.title}
						</p>
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default TopThingsToDo;
