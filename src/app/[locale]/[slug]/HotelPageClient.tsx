"use client";
import Image from "next/image";
import {
	MapPin,
	ChevronRight,
	X,
	ChevronLeft,
	Camera,
	ShieldCheck,
	Wifi,
	ParkingCircle,
	Utensils,
	Dumbbell,
	CigaretteOff,
	Users,
	BedDouble,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { fetchFromAPI } from "@/lib/api";
import { ApiResponseItem } from "@/types/hotel";

type Room = {
	id: number;
	name: string;
	size: string;
	capacity: string;
	beds: string;
	view?: string;
	description: string;
	amenities: string[];
	priceFrom: number;
	images: string[];
	currentImageIndex: number;
	tag?: string;
};

interface HotelPageClientProps {
  locale: string;
  slug: string;
  checkin?: string;
  checkout?: string;
  roomCount: number;
  adults: number;
  //children: number;
}


export default function HotelPageClient({ locale, slug ,checkin,
  checkout,
  roomCount,
  adults}: HotelPageClientProps) {
	const [activeTab, setActiveTab] = useState("rooms");
	const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
	const [hotelData, setHotelData] = useState<ApiResponseItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [rooms, setRooms] = useState<Room[]>([]);

	const router = useRouter();

	const handleBookNow = () => {
		const params = new URLSearchParams();
		if (checkin) params.set('checkin', checkin);
		if (checkout) params.set('checkout', checkout);
		params.set('rooms', String(roomCount || 1));
		params.set('adults', String(adults || 1));
		//params.set('children', String(children || 0));
		params.set('openModal', '1');

		router.push(`/${locale}/${slug}/booking?${params.toString()}`);
	};

	useEffect(() => {
		const fetchHotelData = async () => {
			try {
				const companiesRes = await fetchFromAPI<ApiResponseItem[]>({
					appName: "app3534482538357",
					moduleName: "company",
					query: {
						"sectionData.Company.slug": slug,
						"sectionData.Company.is_deleted": false
					},
					limit: 1,
				});

				if (companiesRes && Array.isArray(companiesRes) && companiesRes.length > 0) {
					setHotelData(companiesRes[0]);
				}

				// Mock rooms data
				setRooms([
					{
						id: 1,
						name: "Superior Day-Use Room",
						size: "35m² (376 ft²)",
						capacity: "2 persons",
						beds: "1× Double bed",
						view: "City View",
						description: "The unit has 1 bed. This is a Day Use offer from 09:00-18:00 with a maximum of 6 hours use.",
						amenities: ["Wireless Internet", "Wake-Up Service", "Air Conditioning", "Bath Or Shower", "Cable Channels", "Coffee Or Tea Maker", "Flat-Screen TV", "Free Toiletries", "Alarm Clock", "Desk", "Hair Dryer"],
						priceFrom: 99,
						images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200", "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200"],
						currentImageIndex: 0,
						tag: "Day Use Only",
					},
					{
						id: 2,
						name: "Corner Room",
						size: "23m² (247 ft²)",
						capacity: "2 persons",
						beds: "1 King-size bed",
						view: "City View",
						description: "Spacious corner room with excellent natural light and panoramic city views.",
						amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-Screen TV", "Minibar", "Safe", "Work Desk", "Private Bathroom"],
						priceFrom: 120,
						images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200", "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200"],
						currentImageIndex: 0,
					},
					{
			id: 3,
			name: "Rooftop Premier Twin Room with Pool Access",
			size: "23m² (247 ft²)",
			capacity: "2 persons",
			beds: "2 Single beds",
			view: "Pool View",
			description:
				"Modern twin room located on the rooftop level with direct access to the pool area. Includes premium amenities.",
			amenities: [
				"Free Wi-Fi",
				"Pool Access",
				"Air Conditioning",
				"TV",
				"Coffee Maker",
			],
			priceFrom: 145,
			images: [
				"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
				"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
				"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
			],
			currentImageIndex: 0,
		},
				]);

			} catch (error) {
				console.error("Error fetching hotel data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchHotelData();
	}, [slug]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
					<p className="mt-4 text-gray-600">Loading hotel details...</p>
				</div>
			</div>
		);
	}

	if (!hotelData) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-800 mb-4">Hotel Not Found</h1>
					<p className="text-gray-600">The hotel you&apos;re looking for doesn&apos;t exist.</p>
				</div>
			</div>
		);
	}

	const company = hotelData.sectionData.Company;
	const galleryImages = company.gallery_image ? company.gallery_image.split(',') : [company.primary_image];
	const cleanDescription = company.description?.replace(/<[^>]*>/g, '') || '';

	return (
		<main className="max-w-7xl mx-auto px-4 py-6">
			{/* Hotel Title & Rating */}
			<div className="mb-6 flex justify-between items-center">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold">{company.web_title || company.name}</h1>
					<div className="flex items-center gap-1 text-green-600 mt-1">
						<MapPin className="w-4 h-4" />
						<span>
							{company.web_city || company.city}, {company.web_province || company.province}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-lg bg-green-600 p-1 font-semibold text-white rounded-tr-md rounded-tl-md rounded-br-md">5.0</span>
					<div>
						<p className="text-sm font-medium text-gray-700">Very good</p>
						<p className="text-xs text-gray-500">0 reviews</p>
					</div>
				</div>
			</div>

			{/* Gallery */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
				<div className="md:col-span-2 row-span-2 relative h-80 md:h-[500px]">
					<Image
						src={company.primary_image || galleryImages[0]}
						alt="Hotel view"
						fill
						className="object-cover"
						onError={(e) => {
							e.currentTarget.src = "/images/defualtimg.webp";
						}}
					/>
				</div>
				{galleryImages.slice(1, 5).map((img, index) => (
					<div key={index} className="relative h-40 md:h-60">
						<Image
							src={img}
							alt={`Hotel view ${index + 2}`}
							fill
							className="object-cover"
							onError={(e) => {
								e.currentTarget.src = "/images/defualtimg.webp";
							}}
						/>
					</div>
				))}
			</div>

			{/* Summary & Quick Info */}
			<div className="grid md:grid-cols-4 gap-4">
				{/* Left - Description & Tabs */}
				<div className="md:col-span-3 space-y-8">
					<section>
						<h2 className="text-2xl font-bold mb-4">
							{company.web_title || company.name}
						</h2>
						<p className="text-gray-700 leading-relaxed">
							{cleanDescription}
						</p>
					</section>

					{/* Tabs Navigation */}
					<section>
						<div className="border-b border-gray-200">
							<nav className="flex gap-8 overflow-x-auto">
								{[
									{ id: "rooms", label: "Rooms" },
									{ id: "amenities", label: "Amenities" },
									{ id: "location", label: "Location" },
									{ id: "knowMore", label: "Know More" },
									{ id: "otherDetails", label: "Other Details" },
								].map((tab) => (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`py-4 px-2 font-medium whitespace-nowrap transition-colors ${
											activeTab === tab.id
												? "text-green-600 border-b-2 border-green-600"
												: "text-gray-600 hover:text-gray-900"
										}`}
									>
										{tab.label}
									</button>
								))}
							</nav>
						</div>

						{/* Tab Content */}
						<div className="mt-6">
							{/* Rooms Tab */}
							{activeTab === "rooms" && (
								<div className="space-y-8">
									<h2 className="text-2xl md:text-3xl font-bold">
										Available Rooms
									</h2>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{rooms.map((room) => (
											<div
												key={room.id}
												className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 cursor-pointer"
											>
												<div
													className="relative h-50 md:h-44 overflow-hidden"
													onClick={() => setSelectedRoom(room)}
												>
													<Image
														src={room.images[0]}
														alt={room.name}
														fill
														className="object-cover group-hover:scale-110 transition-transform duration-500"
													/>

													{room.tag && (
														<div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
															{room.tag}
														</div>
													)}
													<div className="flex items-center justify-center absolute w-full bottom-0 left-0 bg-black/20 text-white p-2 text-xs font-medium">
														<Camera className="me-2" /> <span>See Details</span>
													</div>
												</div>

												<div className="p-5 space-y-3">
													<h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
														{room.name}
													</h3>

													<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
														<span>{room.capacity}</span>
														<span>•</span>
														<span>{room.beds}</span>
														{room.view && (
															<>
																<span>•</span>
																<span>{room.view}</span>
															</>
														)}
													</div>

													<div>
														{room.priceFrom && (
															<>
																<p className="text-green-600 mb-2 text-xl font-semibold">
																	${room.priceFrom}{" "}
																	<span className="text-gray-500 text-sm">
																		per night
																	</span>
																</p>
																<Button name="Book Now" onClick={() => handleBookNow()} />
															</>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{activeTab === "amenities" && (
								<div className="space-y-4">
									<h2 className="text-2xl font-bold">
										Popular facilities & amenities
									</h2>
									<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
										{[
											{ icon: Dumbbell, label: "Fitness" },
											{ icon: Utensils, label: "Restaurant" },
											{ icon: Wifi, label: "Free Wi-Fi" },
											{ icon: ParkingCircle, label: "Parking" },
											{ icon: CigaretteOff, label: "Non-smoking rooms" },
											{ icon: BedDouble, label: "Family rooms" },
											{ icon: ShieldCheck, label: "24-hour front desk" },
											{ icon: Users, label: "Concierge" },
										].map((item, i) => (
											<div
												key={i}
												className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
											>
												<item.icon className="w-6 h-6 text-green-600" />
												<span>{item.label}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{activeTab === "location" && (
								<div className="space-y-4">
									<h2 className="text-2xl font-bold">Location</h2>
									<div className="bg-gray-100 rounded-lg p-4">
										<div className="flex items-start gap-3">
											<MapPin className="w-6 h-6 text-green-600 mt-1" />
											<div>
												<h3 className="font-semibold">Address</h3>
												<p className="text-gray-700">
													{company.address_line1} {company.address_line2}, {company.web_city || company.city}, {company.web_province || company.province}
												</p>
											</div>
										</div>
									</div>
								</div>
							)}

							{activeTab === "knowMore" && (
								<div className="space-y-6">
									<h2 className="text-2xl font-bold">Know More</h2>
									<div className="prose max-w-none">
										<p className="text-gray-700">{cleanDescription}</p>
									</div>
								</div>
							)}

							{activeTab === "otherDetails" && (
								<div className="space-y-6">
									<h2 className="text-2xl font-bold">Other Details</h2>
									<div>
										<h3 className="font-bold text-lg mb-3">Hotel Information</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="p-3 bg-gray-50 rounded">
												<span className="font-medium">Classification:</span> {company.prop_classification}
											</div>
											<div className="p-3 bg-gray-50 rounded">
												<span className="font-medium">Status:</span> {company.main_status}
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</section>
				</div>

				{/* Right Sidebar */}
				<div className="space-y-6">
					<div className="bg-white p-6 rounded-xl shadow-lg border sticky top-6">
						<div className="text-center mb-4">
							<div className="text-3xl font-bold text-green-600">8.4</div>
							<div className="text-sm text-gray-600">
								Very good • 5,446 reviews
							</div>
						</div>
						<div className="bg-white p-5 rounded-xl shadow border">
							<h3 className="font-semibold mb-3">Verified reviews</h3>
							<p className="text-sm text-gray-600">Reviews coming soon...</p>
						</div>
					</div>
				</div>
			</div>

			{/* Modal for Room Details */}
			{selectedRoom && (
				<div
					className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
					onClick={() => setSelectedRoom(null)}
				>
					<div
						className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full hover:bg-gray-100 transition shadow"
							onClick={() => setSelectedRoom(null)}
						>
							<X className="w-6 h-6 text-gray-800" />
						</button>
{/* Image Gallery Section */}
						<div className="relative p-4">
							{/* Main large image */}
							<div className="relative h-64 md:h-96 bg-gray-100 ">
								<Image
									src={selectedRoom.images[selectedRoom.currentImageIndex || 0]}
									alt={`${selectedRoom.name} - view ${selectedRoom.currentImageIndex || 1}`}
									fill
									className="object-cover rounded-t-2xl"
									priority
								/>
							</div>

							{/* Thumbnail strip + arrows */}
							{selectedRoom.images.length > 1 && (
								<div className="p-4 bg-black/50 border-t">
									<div className="relative flex items-center">
										{/* Left arrow */}
										<button
											className="absolute left-0 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
											onClick={() => {
												const newIndex =
													(selectedRoom.currentImageIndex || 0) - 1;
												if (newIndex >= 0) {
													setSelectedRoom({
														...selectedRoom,
														currentImageIndex: newIndex,
													});
												}
											}}
											disabled={(selectedRoom.currentImageIndex || 0) === 0}
										>
											<ChevronLeft className="w-6 h-6 text-gray-700" />
										</button>

										{/* Thumbnails */}
										<div className="flex gap-3 overflow-x-auto px-10 py-2 scrollbar-thin scrollbar-thumb-gray-400">
											{selectedRoom.images.map((imgSrc, idx) => (
												<div
													key={idx}
													className={`flex-shrink-0 w-20 h-16 md:w-24 md:h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
														(selectedRoom.currentImageIndex || 0) === idx
															? "border-green-600 scale-105"
															: "border-transparent hover:border-green-400"
													}`}
													onClick={() =>
														setSelectedRoom({
															...selectedRoom,
															currentImageIndex: idx,
														})
													}
												>
													<Image
														src={imgSrc}
														alt={`Thumbnail ${idx + 1}`}
														width={96}
														height={80}
														className="object-cover w-full h-full"
													/>
												</div>
											))}
										</div>

										{/* Right arrow */}
										<button
											className="absolute right-0 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
											onClick={() => {
												const current = selectedRoom.currentImageIndex || 0;
												const newIndex = current + 1;
												if (newIndex < selectedRoom.images.length) {
													setSelectedRoom({
														...selectedRoom,
														currentImageIndex: newIndex,
													});
												}
											}}
											disabled={
												(selectedRoom.currentImageIndex || 0) ===
												selectedRoom.images.length - 1
											}
										>
											<ChevronRight className="w-6 h-6 text-gray-700" />
										</button>
									</div>
								</div>
							)}
						</div>
						
						<div className="p-6 md:p-8">
							<h2 className="text-2xl md:text-3xl font-bold mb-4">
								{selectedRoom.name}
							</h2>

							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm md:text-base">
								<div>
									<span className="font-semibold">Size:</span>{" "}
									{selectedRoom.size}
								</div>
								<div>
									<span className="font-semibold">Guests:</span>{" "}
									{selectedRoom.capacity}
								</div>
								<div>
									<span className="font-semibold">Bed:</span>{" "}
									{selectedRoom.beds}
								</div>
								{selectedRoom.view && (
									<div>
										<span className="font-semibold">View:</span>{" "}
										{selectedRoom.view}
									</div>
								)}
							</div>

							<p className="text-gray-700 leading-relaxed mb-8">
								{selectedRoom.description}
							</p>

							<h3 className="text-xl font-bold mb-4">Room Amenities</h3>
							<ul className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
								{selectedRoom.amenities.map((amenity, idx) => (
									<li
										key={idx}
										className="flex items-center gap-2 text-gray-700"
									>
										<span className="text-green-600 text-lg">✔</span>
										{amenity}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
