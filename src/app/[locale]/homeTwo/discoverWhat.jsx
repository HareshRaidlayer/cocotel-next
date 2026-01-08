"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { fetchFromAPI } from "@/lib/api";

const DiscoverSection = () => {
	const { t } = useLocale();
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const res = await fetchFromAPI({
					appName: "app3534482538357",
					moduleName: "tag",
					query: {
						"sectionData.tag.is_active": true,
						"sectionData.tag.tags": { $in: ["Home"] },
					},
					limit: 8,
				});

				setBlogs(res || []);
			} catch (err) {
				console.error("Blog fetch error", err);
			} finally {
				setLoading(false);
			}
		};

		fetchBlogs();
	}, []);


	const categories = blogs.map((item) => ({
		title: item.sectionData.tag.title,
		icon: `
      <img 
        src="${item.sectionData.tag.image}" 
        alt="${item.sectionData.tag.title}" 
        style="width:40px;height:40px;"
      />
    `,
		bgColor: item.sectionData.tag.bgcolor || "#ffffff",
		textColor: item.sectionData.tag.textcolor || "#000000",
		link: "/",
	}));

	if (loading) return null;

	return (
		<section className="container mx-auto bg-white text-center mt-5 md:mt-10 p-2 xl:p-0">
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
				className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600"
			>
				{t("discover.title")}
			</motion.h2>

			<motion.p
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
				className="text-center mb-4 font-normal text-gray-800"
			>
				{t("discover.subtitle")}
			</motion.p>

			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
				{categories.map((item, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: index * 0.2 }}
					>
						<Link
							href={item.link}
							className="group bg-white rounded-xl shadow-xl px-5 py-8
              flex flex-col items-center justify-center
              transition-all duration-500
              hover:scale-105 hover:-translate-y-1 hover:shadow-md"
							style={{
								"--hover-bg": item.bgColor,
								"--hover-color": item.textColor,
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.backgroundColor = item.bgColor)
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.backgroundColor = "white")
							}
						>
							{item.icon && (
								<div
									className="w-10 h-10 mb-3 text-gray-400 transition-colors duration-300"
									style={{ color: "inherit" }}
									dangerouslySetInnerHTML={{ __html: item.icon }}
									ref={(el) => {
										if (el) {
											el.parentElement.addEventListener(
												"mouseenter",
												() => (el.style.color = item.textColor)
											);
											el.parentElement.addEventListener(
												"mouseleave",
												() => (el.style.color = "#9ca3af")
											);
										}
									}}
								/>
							)}

							<span
								className="text-gray-800 font-medium transition-colors duration-300 h-[40px]"
								ref={(el) => {
									if (el) {
										el.parentElement.addEventListener(
											"mouseenter",
											() => (el.style.color = item.textColor)
										);
										el.parentElement.addEventListener(
											"mouseleave",
											() => (el.style.color = "#1f2937")
										);
									}
								}}
							>
								{item.title}
							</span>
						</Link>
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default DiscoverSection;
