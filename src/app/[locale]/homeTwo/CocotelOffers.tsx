"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react"; // Recommended: use lucide-react for icons (install if needed)

export default function CocotelOffers() {
	return (
		<section className="container mx-auto mt-6 md:mt-10 w-full p-2 xl:p-0">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="relative rounded-2xl h-60 overflow-hidden p-2 md:p-8 flex items-center gap-4 z-0">
					{/* Background Image */}
					<Image
						src="/images/offers-banner-2.png"
						alt="offers banner"
						fill
						priority={false}
						className="object-cover object-center -z-10"
					/>

					{/* Content goes here */}
					<div className="relative z-10 text-white">
						{/* your content */}
					</div>
				</div>

				<div className="relative rounded-2xl h-60 overflow-hidden p-2 md:p-8 flex items-center gap-4 z-0">
					{/* Background Image */}
					<Image
						src="/images/offers-banner-2.png"
						alt="offers banner"
						fill
						priority={false}
						className="object-cover object-center -z-10"
					/>

					{/* Content goes here */}
					<div className="relative z-10 text-white">
						{/* your content */}
					</div>
				</div>
			</div>
		</section>
	);
}
