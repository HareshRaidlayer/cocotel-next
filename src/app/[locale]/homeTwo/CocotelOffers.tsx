"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function CocotelOffers() {
	return (
		<section className="container mx-auto relative mt-10 w-full min-h-[250px] overflow-hidden rounded-none sm:rounded-3xl">
			{/* Background Image */}
			<Image
				src="/images/wp6904653-palawan-wallpapers.jpg"
				alt="Cocotel Offers"
				fill
				className="object-cover scale-110 blur-sm"
				priority
			/>

			{/* Overlay */}
			<div className="absolute inset-0 bg-black/30" />

			{/* Content */}
			<div className="relative z-10 px-2 md:px-10 py-10 max-w-7xl mx-auto">
				<div className="grid lg:grid-cols-1 gap-12 items-center">
					{/* Left Main Card */}
					{/* <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/20 text-center rounded-2xl shadow-xl p-4 max-w-md"
                    >
                        <h2 className="text-2xl font-bold text-green-600 text-shadow-c-lg">
                        COCOTEL OFFERS
                        </h2>
                        <p className="mt-2 text-white">
                        Exclusive promos, booking date deals and special offers for you
                        </p>

                        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition">
                        AVAIL TODAY
                        </button>
                    </motion.div> */}
					{/* <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 w-72 text-center border border-white/50">
						<div className="mb-2 rounded-xl overflow-hidden">
							<Image
								src="/images/wp6904639-palawan-wallpapers.jpg"
								alt="cocotel"
								width={300}
								height={150}
								className="object-cover w-full"
							/>
						</div>

						<h3 className="text-2xl font-bold text-gray-800">COCOTEL OFFERS</h3>
					</div> */}

					{/* Right Floating Cards */}
					<div className="relative grid grid-cols-4 gap-2">
						{offers.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.15 }}
								className="relative h-28 rounded-xl overflow-hidden border border-2 border-white "
							>
								<Image
									src={item.image}
									alt={item.title}
									fill
									className="object-cover "
								/>

								<div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-3">
									<h3 className="text-white text-sm font-semibold">
										{item.title}
									</h3>
								</div>
							</motion.div>
						))}
						<div className=" col-span-4 text-center">
							<p className="text-base text-white mt-2">
								Exclusive promos, booking date deals and special offers for you
							</p>
							<button className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition">
								AVAIL TODAY
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

const offers = [
	{
		title: "COCOTEL OFFERS",
		image: "/images/wp6904639-palawan-wallpapers.jpg",
	},
	{
		title: "COUPON DEALS",
		image: "/images/offer-grid.jpg",
	},
	{
		title: "COCOTEL OFFERS",
		image: "/images/wp6904639-palawan-wallpapers.jpg",
	},
	{
		title: "COUPON DEALS",
		image: "/images/offer-grid.jpg",
	},
];
