"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
const getPrimaryImageSrc = (tour) => {
  // For main card view - show primary image only
  if (tour.primaryImage && tour.primaryImage.trim() && tour.primaryImage !== 'null' && tour.primaryImage !== 'undefined') {
    return tour.primaryImage;
  }
  return "/images/defualtimg.webp";
};

const getGalleryImageSrc = (tour, slideIndex = 0) => {
  // For quick view - show gallery images
  if (tour.src && Array.isArray(tour.src) && tour.src.length > 0) {
    const validImages = tour.src.filter(img => img && img.trim() && img !== 'null' && img !== 'undefined');
    if (validImages.length > 0) {
      return validImages[slideIndex] || validImages[0];
    }
  }
  return "/images/defualtimg.webp";
};

const Features = ({ tours, title, subtitle, currencySymbol, gridCols = "lg:grid-cols-4", searchParams }) => {
	const [currentSlides, setCurrentSlides] = useState(
		tours.map(() => 0)
	);
	const [quickViewIndex, setQuickViewIndex] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const router = useRouter();

	if (!tours?.length) return null;

	const handleBookNow = (tour) => {
		const country = tour.country?.toLowerCase() || 'ph';
		const slug = tour.slug;
		if (slug) {
			// Check if we have search parameters (from search results)
			if (searchParams?.checkin && searchParams?.checkout && searchParams?.rooms && searchParams?.adults && searchParams?.children) {
				// Redirect to hotel details with booking parameters
				router.push(`/${country}/${slug}/${searchParams.checkin}/${searchParams.checkout}/${searchParams.rooms}/${searchParams.adults}/${searchParams.children}`);
			} else {
				// Redirect to simple hotel details (from homepage or hotel list without search)
				router.push(`/${country}/${slug}`);
			}
		}
	};

	const handlePrev = (index) => {
		setCurrentSlides((prev) =>
			prev.map((slide, i) =>
				i === index ? (slide > 0 ? slide - 1 : tours[i].src.length - 1) : slide
			)
		);
	};

	const handleNext = (index) => {
		setCurrentSlides((prev) =>
			prev.map((slide, i) =>
				i === index ? (slide < tours[i].src.length - 1 ? slide + 1 : 0) : slide
			)
		);
	};
		const openQuickView = (index) => {
		setQuickViewIndex(index);
		setCurrentSlide(0);
	};

	const closeQuickView = () => {
		setQuickViewIndex(null);
	};

	const quickPrev = () => {
		if (quickViewIndex === null) return;
		setCurrentSlide((prev) =>
			prev > 0 ? prev - 1 : tours[quickViewIndex].src.length - 1
		);
	};

	const quickNext = () => {
		if (quickViewIndex === null) return;
		setCurrentSlide((prev) =>
			prev < tours[quickViewIndex].src.length - 1 ? prev + 1 : 0
		);
	};
// const Features = () => {
// 	const params = useParams();
// 	const [tours, setTours] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [currentSlides, setCurrentSlides] = useState([]);
// 	const [quickViewIndex, setQuickViewIndex] = useState(null);
// 	const [currentSlide, setCurrentSlide] = useState(0);

// 	// Get country from URL locale
// 	const urlLocale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale || "ph";
// 	const countryCodeMap = {
// 		ph: "PH",
// 		id: "ID",
// 		aus: "AUS"
// 	};
// 	const countryCode = countryCodeMap[urlLocale.toLowerCase()] || "PH";
// 	const currencySymbol = countryCode === "ID" ? "IDR" : "PHP";

// 	// Dynamic titles based on country
// 	const title = countryCode === "ID" ? "Featured Hotels in Indonesia" : "Featured Hotels in Philippines";
// 	const subtitle = countryCode === "ID" ? "Discover amazing accommodations across Indonesia" : "Explore the best hotels in the Philippines";

// 	useEffect(() => {
// 		const fetchCompanies = async () => {
// 			try {
// 				const companiesRes = await fetchFromAPI({
// 					appName: "app3534482538357",
// 					moduleName: "company",
// 					query: {
// 						"sectionData.Company.country": countryCode,
// 						"sectionData.Company.is_deleted": false
// 					},
// 					limit: 4,
// 				});

// 				if (companiesRes && Array.isArray(companiesRes)) {
// 					const formattedTours = companiesRes.map((company) => {
// 						const companyData = company.sectionData.Company;
// 						const galleryImages = companyData.gallery_image ? companyData.gallery_image.split(',') : [companyData.primary_image];
						
// 						return {
// 							title: companyData.name || companyData.web_title || "Hotel",
// 							city: companyData.web_city || companyData.city || "",
// 							country: companyData.country || countryCode,
// 							src: galleryImages.filter(img => img && img.trim()),
// 							price: "2,500",
// 							originalPrice: "500",
// 							discount: "20% OFF",
// 							category: "Resort"
// 						};
// 					});
// 					setTours(formattedTours);
// 					setCurrentSlides(formattedTours.map(() => 0));
// 				}
// 			} catch (error) {
// 				console.error("Error fetching companies:", error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchCompanies();
// 	}, [countryCode]);

// 	if (loading) return <div className="text-center py-8">Loading...</div>;
// 	if (!tours.length) return null;

// 	const handlePrev = (index) => {
// 		setCurrentSlides((prev) =>
// 			prev.map((slide, i) =>
// 				i === index ? (slide > 0 ? slide - 1 : tours[i].src.length - 1) : slide
// 			)
// 		);
// 	};

// 	const handleNext = (index) => {
// 		setCurrentSlides((prev) =>
// 			prev.map((slide, i) =>
// 				i === index ? (slide < tours[i].src.length - 1 ? slide + 1 : 0) : slide
// 			)
// 		);
// 	};

// 	const openQuickView = (index) => {
// 		setQuickViewIndex(index);
// 		setCurrentSlide(0);
// 	};

// 	const closeQuickView = () => {
// 		setQuickViewIndex(null);
// 	};

// 	const quickPrev = () => {
// 		if (quickViewIndex === null) return;
// 		setCurrentSlide((prev) =>
// 			prev > 0 ? prev - 1 : tours[quickViewIndex].src.length - 1
// 		);
// 	};

// 	const quickNext = () => {
// 		if (quickViewIndex === null) return;
// 		setCurrentSlide((prev) =>
// 			prev < tours[quickViewIndex].src.length - 1 ? prev + 1 : 0
// 		);
// 	};

	return (
		<section className="container mx-auto mt-5 md:mt-12 p-2 xl:p-0">
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

			<div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
				{tours.map((tour, index) => (
					<div
						key={index}
						className="relative  bg-white rounded-lg shadow-lg overflow-hidden"
					>
						<div className="relative  linear-gradient-top-custom">
							<Image
								src={getPrimaryImageSrc(tour)}
								alt={tour.title || "Hotel"}
								width={380}
								height={207}
								className="w-full h-[200px] object-cover"
								loading="lazy"
								onError={(e) => {
									e.target.src = "/images/defualtimg.webp";
								}}
							/>

							{/* Quick View Button */}
							<button
								onClick={() => openQuickView(index)}
								className="absolute bottom-8 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md hover:bg-opacity-70 text-sm"
							>
								Quick View
							</button>
							<div className="absolute bottom-0 right-0 bg-green-600 text-white px-3 py-1 text-xs font-semibold">
								save {currencySymbol} {tour.originalPrice}
							</div>

							<div className="absolute top-2 right-0 flex justify-between items-center w-full z-10 p-1">
								<div className="flex items-center ">
									<Image
										src="/images/rating-left.svg"
										alt="Left Rating"
										width={22}
										height={22}
										loading="lazy"
									/>
									<span className="text-white text-base font-bold text-shadow-md">
										5
									</span>
									<Image
										src="/images/rating-right.svg"
										alt="Right Rating"
										width={22}
										height={22}
										loading="lazy"
									/>
									<span className="text-white ms-3 text-sm font-semibold text-shadow-md">
										3 reviews
									</span>
								</div>
								<div className="bg-white shadow-xl rounded-full text-xs text-black px-2 py-1 font-medium">
									{tour.discount}
								</div>
							</div>

							<button
								className="absolute left-2 top-1/2 h-7 w-7 text-white transform -translate-y-1/2 bg-gray-800/50 flex items-center justify-center rounded-full shadow-md hover:bg-gray-500/50 border border-white"
								onClick={() => handlePrev(index)}
							>
								<FaAngleLeft />
							</button>
							<button
								className="absolute right-2 top-1/2 h-7 w-7 text-white transform -translate-y-1/2 bg-gray-800/50 flex items-center justify-center rounded-full shadow-md hover:bg-gray-500/50 border border-white"
								onClick={() => handleNext(index)}
							>
								<FaAngleRight />
							</button>
						</div>

						<div className="p-4">
							<p className="text-gray-800 font-semibold mb-2 line-clamp-2 cursor-pointer">
								{tour.title}
							</p>
							<div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
								<div className="flex flex-col items-start">
									<span className="text-xs text-gray-500">
										{tour.city}, {tour.country}{" "}
									</span>
								</div>
								<div className="flex justify-end items-center">
								<span className="text-gray-800 font-medium bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm">
										{tour.category}
									</span>
								</div>
							</div>
							<div className="mt-4 flex justify-between items-center">
								<div>
									<p className="text-xl text-green-600 font-bold">
										<span className="text-sm text-gray-800 font-medium">
											From {currencySymbol}
										</span>{" "}
										{tour.price}
									</p>
								</div>
								<button 
									onClick={() => handleBookNow(tour)}
									className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
								>
									Book Now
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Quick View Popup */}
			{quickViewIndex !== null && (
				<div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
					<button
						type="button"
						className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-50"
						onClick={closeQuickView}
					>
						&times;
					</button>

					{/* Main image */}
					<div className="relative flex items-center justify-center flex-1 w-full px-8">
						<button
							className="absolute left-4 text-white text-4xl bg-black/50 rounded-full p-2 hover:bg-black/70"
							onClick={quickPrev}
						>
							&#10094;
						</button>
						<Image
							src={getGalleryImageSrc(tours[quickViewIndex], currentSlide)}
							alt={tours[quickViewIndex]?.title || "Hotel"}
							width={1000}
							height={600}
							className="max-w-full max-h-[80vh] object-contain"
							loading="lazy"
							onError={(e) => {
								e.target.src = "/images/defualtimg.webp";
							}}
						/>
						<button
							className="absolute right-4 text-white text-4xl bg-black/50 rounded-full p-2 hover:bg-black/70"
							onClick={quickNext}
						>
							&#10095;
						</button>
					</div>

					{/* Popup Thumbnails */}
					<div className="flex space-x-2 overflow-x-auto px-4 pb-4 mt-4">
						{tours[quickViewIndex]?.src?.filter(img => img && img.trim() && img !== 'null' && img !== 'undefined').map((img, i) => (
							<div
								key={i}
								className="cursor-pointer"
								onClick={() => setCurrentSlide(i)}
							>
								<Image
									src={img}
									alt={tours[quickViewIndex]?.title || "Hotel"}
									width={120}
									height={90}
									loading="lazy"
									onError={(e) => {
										e.target.src = "/images/defualtimg.webp";
									}}
									className={`rounded-lg object-cover border ${
										currentSlide === i ? "border-green-600" : "border-gray-300"
									}`}
								/>
							</div>
						)) || []}
					</div>
				</div>
			)}
		</section>
	);
};

export default Features;