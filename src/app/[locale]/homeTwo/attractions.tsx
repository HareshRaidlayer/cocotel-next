"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Tour {
	src: string;
	title: string;
}

interface AttractionsProps {
	data: {
		title: string;
		subtitle: string;
		tours: Tour[];
	};
}

const Attractions: React.FC<AttractionsProps> = ({ data }) => {
	// Validate data
	if (!data || !data.tours || !Array.isArray(data.tours)) {
		console.warn("Invalid or missing attractions data");
		return null;
	}

	const { title, subtitle, tours } = data;

	return (
		<section className="container mx-auto mt-12 p-2 xl:p-0">
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
					<a href="#" className="text-blue-600 hover:underline">
						See all attractions →
					</a>
				</div>
			</div>
		</section>
	);
};

export default Attractions;
