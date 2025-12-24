"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from '@/lib/locale-context';
import {
	FaTrophy,
	FaGlobe,
	FaMoneyBillWave,
	FaSmile,
	FaArrowRight,
	FaPhone,
} from "react-icons/fa";

const WhyUs = () => {
	const { t } = useLocale();

	const cards = [
		{
			title: t('whyUs.card1.title'),
			icon: <FaTrophy className="text-orange-600" size={48} />,
			desc: t('whyUs.card1.desc'),
		},
		{
			title: t('whyUs.card2.title'),
			icon: <FaGlobe className="text-yellow-600" size={36} />,
			desc: t('whyUs.card2.desc'),
		},
		{
			title: t('whyUs.card3.title'),
			icon: <FaMoneyBillWave className="text-teal-600" size={36} />,
			desc: t('whyUs.card3.desc'),
		},
		{
			title: t('whyUs.card4.title'),
			icon: <FaSmile className="text-pink-600" size={36} />,
			desc: t('whyUs.card4.desc'),
		},
		{
			title: t('whyUs.card5.title'),
			icon: <FaArrowRight className="text-purple-700" size={48} />,
			desc: t('whyUs.card5.desc'),
		},
		{
			title: t('whyUs.card6.title'),
			icon: <FaPhone className="text-sky-600" size={36} />,
			desc: t('whyUs.card6.desc'),
		},
	];

	// Order matching the image: Top row - card 0 & card 4 | Bottom row - card 2, card 1, card 3, card 5
	const topCards = [cards[0], cards[4]];
	const bottomCards = [cards[2], cards[1], cards[3], cards[5]];

	return (
		<section className="container mx-auto py-12 px-4">
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
				className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600"
			>
				{t('whyUs.title')}
			</motion.h2>
			<motion.p
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
				className="text-center mb-12 font-normal text-gray-800 max-w-3xl mx-auto"
			>
				{t('whyUs.subtitle')}
			</motion.p>

			{/* Top Row - 2 larger cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				{topCards.map((card, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: index * 0.4 }}
						className={`relative rounded-3xl p-8 text-center overflow-hidden shadow-lg  flex flex-col items-center justify-start ${
							index === 0 ? "bg-orange-100" : "bg-purple-100"
						}`}
					>
						{/* White circle with icon centered */}
						<div className=" w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
							{card.icon}
						</div>

						<h3
							className={`relative z-10 text-2xl font-bold mt-5 ${
								index === 0 ? "text-red-700" : "text-gray-900"
							}`}
						>
							{card.title}
						</h3>
						<p className="relative z-10 text-gray-800 mt-5 text-base md:text-lg leading-relaxed px-4">
							{card.desc}
						</p>
					</motion.div>
				))}
			</div>

			{/* Bottom Row - 4 smaller cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				{bottomCards.map((card, index) => {
					const bgColors = ["bg-teal-100", "bg-yellow-100", "bg-pink-100", "bg-sky-100"];
					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.5 }}
							className={`relative rounded-3xl p-6 text-center overflow-hidden shadow-lg  flex flex-col items-center justify-start ${bgColors[index]}`}
						>
							{/* White circle with icon centered */}
							<div className=" w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center">
								{card.icon}
							</div>

							<h3 className="relative z-10 text-lg font-bold mt-10 text-gray-900">
								{card.title}
							</h3>
							<p className="relative z-10 text-gray-800 mt-4 text-sm leading-relaxed px-3">
								{card.desc}
							</p>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
};

export default WhyUs;