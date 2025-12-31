"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; // Recommended: use lucide-react for icons (install if needed)

export default function CocotelOffers() {
	return (
		<section className="container mx-auto mt-10 w-full p-2 xl:p-0">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="relative rounded-2xl bg-green-600 overflow-hidden p-8 flex items-center gap-4  z-0">
					{/* Background shape */}
					<Image
						src="/images/offer-shape.png"
						alt=""
						fill
						className="absolute inset-0 z-[-1] object-cover opacity-10"
					/>
					<div className="relative w-36 h-32 rounded-xl overflow-hidden border border-2 border-white hidden md:block">
						<Image
							src="/images/wp6904639-palawan-wallpapers.webp"
							alt="COUPON DEALS"
							fill
							className="object-cover "
						/>

						{/* <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-3">
							<h3 className="text-white text-sm font-semibold">COUPON DEALS</h3>
						</div> */}
					</div>

					{/* Content */}
					<div className="">
						<h4 className="text-white mb-1 text-2xl font-bold">
							COCOTEL OFFERS
						</h4>
						<p className="text-white text-sm font-normal mb-2">
							Exclusive promos, booking date deals, and spcial offers
						</p>
						
						<div className="flex items-center gap-8">
							<span className="text-sm text-white font-semibold">Starting at Jan 5</span>
							<ArrowRight className="h-4 w-4 text-white" />
							<span className="text-sm text-white font-semibold">expired Aug 5</span>
						</div>
						<a href="#"
							className="mt-4 inline-flex items-center gap-3 rounded bg-white px-4 py-2 font-medium text-green-800 transition-colors hover:bg-green-300 "
						>
							AVAIL TODAY
							<ArrowRight className="h-5 w-5" />
						</a>
					</div>
				</div>

				<div className="relative rounded-2xl bg-green-600 overflow-hidden p-8 flex items-center gap-4  z-0 ">
					{/* Background shape */}
					<Image
						src="/images/offer-shape.png"
						alt=""
						fill
						className="absolute inset-0 z-[-1] object-cover opacity-10"
						loading="lazy"
					/>
					<div className="relative w-36 h-32 rounded-xl overflow-hidden border border-2 border-white hidden md:block">
						<Image
							src="/images/wp6904639-palawan-wallpapers.webp"
							alt="COUPON DEALS"
							fill
							className="object-cover "
							loading="lazy"
						/>

						{/* <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-3">
							<h3 className="text-white text-sm font-semibold">COUPON DEALS</h3>
						</div> */}
					</div>

					{/* Content */}
					<div className="">
						<h4 className="text-white mb-1 text-2xl font-bold">
							COCOTEL OFFERS
						</h4>
						<p className="text-white text-sm font-normal mb-2">
							Exclusive promos deals
						</p>
						
						<div className="flex items-center gap-8">
							<span className="text-sm text-white font-semibold">Starting at Nov 1</span>
							<ArrowRight className="h-4 w-4 text-white" />
							<span className="text-sm text-white font-semibold">expired Dec 1</span>
						</div>
						<a href="#"
							className="mt-4 inline-flex items-center gap-3 rounded bg-white px-4 py-2 font-medium text-green-800 transition-colors hover:bg-green-300 "
						>
							AVAIL TODAY
							<ArrowRight className="h-5 w-5" />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
