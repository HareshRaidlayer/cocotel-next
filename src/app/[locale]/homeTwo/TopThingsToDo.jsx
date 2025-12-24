"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
const TopThingsToDo = ({ data }) => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.04, // letter delay
			},
		},
	};

	const letterVariants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	if (!data) return null;

	return (
		<section className="container mx-auto bg-white mt-10 p-2 xl:p-0">
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
				className="text-center mb-8 font-normal text-gray-800"
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
