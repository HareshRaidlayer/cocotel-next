"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react"; // Recommended: use lucide-react for icons (install if needed)

export default function CocotelOffers() {
	return (
		<section className="container mx-auto mt-6 md:mt-10 w-full p-2 xl:p-0">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="relative rounded-2xl bg-[#299e60] overflow-hidden p-8 flex items-center gap-4  z-0">
					{/* Background shape */}
					<Image
						src="/images/offer-shape.png"
						alt=""
						fill
						className="absolute inset-0 z-[-1] object-cover opacity-10"
					/>
					<div className="flex items-center justify-between  gap-10 ">
						<Image
							src="/images/cocotel-offers-3.png"
							alt="COUPON DEALS"
							width={150}
							height={100}
							className=" w-50 h-auto"
						/>
					{/* Content */}
					<div className="">
						<Image
							src="/images/offers-icon-7.png"
							alt="COUPON DEALS"
							height={100}
							width={100}
							className=" "
						/>
						<h4 className="text-white mb-1 text-2xl font-bold">
							SALACIA PROMO CODE
						</h4>
						
						<div className="flex items-center gap-2">
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
				</div>

				<div className="relative rounded-2xl bg-[#299e60] overflow-hidden p-8 flex items-center gap-4  z-0">
					{/* Background shape */}
					<Image
						src="/images/offer-shape.png"
						alt=""
						fill
						className="absolute inset-0 z-[-1] object-cover opacity-10"
					/>
					<div className="flex items-center justify-between  gap-10 ">
						<Image
							src="/images/cocotel-offers-1.png"
							alt="COUPON DEALS"
							width={150}
							height={100}
							className=" w-50 h-auto"
						/>
					{/* Content */}
					<div className="">
						<Image
							src="/images/offers-icon-8.png"
							alt="COUPON DEALS"
							height={100}
							width={100}
							className=" "
						/>
						<h4 className="text-white mb-1 text-2xl font-bold">
							SALACIA PROMO CODE
						</h4>
						
						<div className="flex items-center gap-2">
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
				</div>
			</div>
		</section>
	);
}
