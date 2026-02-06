"use client";
import Image from "next/image";
import {
	MapPin,
	ChevronRight,
	X,
	ChevronLeft,
	Camera,
	ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import BookingButton from "@/components/BookingButton";
import { fetchFromAPI } from "@/lib/api";
import { ApiResponseItem, RoomApiItem, RoomGalleryApiItem, AmenityApiItem, GalleryItem } from "@/types/hotel";
import { getRoomPrice } from "@/utils/roomPrice";

type Room = {
	_id: string;      // Mongo ID (IMPORTANT)
	id: number;
	name: string;
	size: string;
	capacity: string;
	extraperson: string;
	beds: string;
	view?: string;
	description: string;
	amenities: string[];
	price?: number;
	rate_week_day_lean?: number;
	rate_week_end_lean?: number;
	rate_week_day_peak?: number;
	rate_week_end_peak?: number;

	images: string[];
	currentImageIndex: number;
	tag?: string;
};

interface HotelPageClientProps {
	locale: string;
	slug: string;
	checkin?: string;
	checkout?: string;
	roomCount?: number;
	adults?: number;
	children?: number;
	childrenCount?: number;
}

export default function HotelPageClient({ locale, slug, checkin, checkout, roomCount, adults, children, childrenCount }: HotelPageClientProps) {
	const [activeTab, setActiveTab] = useState("rooms");
	const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
	const [hotelData, setHotelData] = useState<ApiResponseItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [rooms, setRooms] = useState<Room[]>([]);
	const [hotelGalleryImages, setHotelGalleryImages] = useState<string[]>([]);
	type Amenity = {
		id: string;
		title: string;
		icon?: string;
	};

	const [amenities, setAmenities] = useState<Amenity[]>([]);


	const NO_IMAGE = "https://www.cocotel.com/public/no-image.png";

	const normalizeRoomImageUrl = (img?: string) => {
		if (!img || img === "NULL") return NO_IMAGE;

		let path = img;

		// 1If full URL → extract pathname
		if (path.startsWith("http")) {
			try {
				path = new URL(path).pathname;
			} catch { }
		}

		//  Decode once (fix %2520 → %20 → space)
		try {
			path = decodeURIComponent(path);
		} catch {
			// ignore malformed encoding
		}

		// Normalize ../admin → admin
		path = path.replace(/^\/?\.\.\/admin\//, "admin/");

		// Remove duplicate public/
		path = path.replace(/^\/?public\/+/, "");

		// Remove leading slashes
		path = path.replace(/^\/+/, "");

		//  Ensure admin/
		if (!path.startsWith("admin/")) {
			path = `admin/${path}`;
		}

		//  Encode ONCE (correct)
		return encodeURI(`https://www.cocotel.com/public/${path}`);
	};

	const normalizeGalleryImage = (img?: string) => {
		if (!img || img === "NULL") return NO_IMAGE;

		const url = img.trim();

		// Already CDN
		if (url.startsWith("https://img.cocotel.com/")) {
			return encodeURI(url);
		}

		// ../admin/frontend → CDN
		if (url.includes("/../admin/frontend/")) {
			const path = url.split("/../admin/frontend/")[1];
			return encodeURI(`https://img.cocotel.com/frontend/${path}`);
		}

		// admin/frontend → CDN
		if (url.includes("/admin/frontend/")) {
			const path = url.split("/admin/frontend/")[1];
			return encodeURI(`https://img.cocotel.com/frontend/${path}`);
		}

		// relative frontend
		if (url.startsWith("frontend/")) {
			return encodeURI(`https://img.cocotel.com/${url}`);
		}

		// fallback
		return NO_IMAGE;
	};

	const router = useRouter();

	const handleBookNow = (room?: Room) => {
		// Use the passed room or the selected room
		const roomToBook = room || selectedRoom;

		// Set default dates if not provided
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const formatDate = (date: Date) => date.toISOString().split('T')[0];

		// Create path-based URL structure with popup=1
		const pathUrl = `/${locale}/${roomToBook?._id}/${hotelData?._id}/${roomCount || 1}/${checkin || formatDate(today)}/${checkout || formatDate(tomorrow)}/${adults || 1}/${children || childrenCount || 0}/0/1`;

		router.push(pathUrl);
	};

	useEffect(() => {
		const fetchHotelData = async () => {
			try {
				//  Fetch hotel
				const companiesRes = await fetchFromAPI<ApiResponseItem[]>({
					appName: "app3534482538357",
					moduleName: "company",
					query: {
						"sectionData.Company.slug": slug,
						"sectionData.Company.is_deleted": false,
					},
					limit: 1,
				});

				if (!companiesRes || companiesRes.length === 0) {
					setLoading(false);
					return;
				}

				const company = companiesRes[0];
				setHotelData(company);
				//
				// Fetch hotel gallery images
				const hotelGalleryRes = await fetchFromAPI<GalleryItem[]>({
					appName: "app3534482538357",
					moduleName: "gallerys",
					query: {
						"sectionData.gallerys.hotel_id": company._id,
						"sectionData.gallerys.is_deleted": "0",
						"sectionData.gallerys.is_status": "0",
					},
					limit: 100,
				});

				// Normalize images
				const galleryImages = hotelGalleryRes
					.map(g => normalizeGalleryImage(g.sectionData.gallerys.gallery_image))
					.filter(Boolean);
				console.log('galleryImages:', galleryImages);
				//  Fallback to primary image
				setHotelGalleryImages(
					galleryImages.length > 0
						? galleryImages
						: [normalizeGalleryImage(company.sectionData.Company.primary_image)]
				);

				const amenityIds = company.sectionData.Company.amenities || [];

				if (amenityIds.length > 0) {
					const amenitiesRes = await fetchFromAPI<AmenityApiItem[]>({
						appName: "app3534482538357",
						moduleName: "amenities",
						query: {
							"_id": { "$in": amenityIds },
							"sectionData.amenities.is_deleted": "0",
							"sectionData.amenities.is_status": "0",
						},
						limit: 200,
					});

					const mappedAmenities: Amenity[] = amenitiesRes.map(a => {
						const data = a.sectionData.amenities;
						return {
							id: a._id,
							title: data.title,
							icon: data.icon_new || data.icon
								? normalizeRoomImageUrl(data.icon_new || data.icon)
								: undefined,
						};
					});

					setAmenities(mappedAmenities);
				}
				// 2️⃣ Fetch rooms
				const roomsRes = await fetchFromAPI<RoomApiItem[]>({
					appName: "app3534482538357",
					moduleName: "rooms",
					query: {
						"sectionData.rooms.hotel_id": company._id,
						"sectionData.rooms.is_deleted": "0",
						"sectionData.rooms.is_status": "0",

					},
					limit: 50,
				});
				// const rooms = roomsRes[0];
				const roomIds = roomsRes.map(r => r._id);
				// 3️⃣ Fetch room gallery
				const galleryRes = await fetchFromAPI<RoomGalleryApiItem[]>({
					appName: "app3534482538357",
					moduleName: "room_gallery",
					query: {
						"sectionData.room_gallery.room_id": { "$in": roomIds },
						"sectionData.room_gallery.is_deleted": "0",
						"sectionData.room_gallery.is_status": "0",
					},
					limit: 500,
				});

				// 4️⃣ Build gallery map

				const galleryMap: Record<string, string[]> = {};

				galleryRes.forEach((g) => {
					const gData = g.sectionData.room_gallery;
					const roomId = gData.room_id;

					if (!roomId) return;

					if (!galleryMap[roomId]) {
						galleryMap[roomId] = [];
					}

					galleryMap[roomId].push(
						normalizeRoomImageUrl(gData.room_gallery_image)
					);
				});


				// 5️⃣ Map rooms → UI format
				const mappedRooms: Room[] = roomsRes.map((r) => {
					const room = r.sectionData.rooms;
					const roomId = r._id;

					const galleryImages = galleryMap[roomId] || [];

					const images =
						galleryImages.length > 0
							? galleryImages
							: [normalizeRoomImageUrl(room.primary_image)];

					return {
						_id: r._id,                      // ✅ KEEP THIS
						id: Number(room.web_rooms_id),
						name: room.title,
						size: "",
						capacity: `${room.max_adults} Allowed`,
						extraperson: `${room.extraPerson} Extra Person`,
						beds: "Standard Bed",
						description: room.description?.replace(/<[^>]*>/g, "") || "",
						amenities: [
							"Air Conditioning",
							"Private Bathroom",
							"Free Wi-Fi",
						],
						price: Number(room.price || 0),
						rate_week_day_lean: Number(room.rate_week_day_lean || 0),
						rate_week_end_lean: Number(room.rate_week_end_lean || 0),
						rate_week_day_peak: Number(room.rate_week_day_peak || 0),
						rate_week_end_peak: Number(room.rate_week_end_peak || 0),
						images,
						currentImageIndex: 0,
					};
				});

				console.log("Mapped rooms:", mappedRooms);
				setRooms(mappedRooms);
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

	const cleanDescription = company.description?.replace(/<[^>]*>/g, '') || '';
	//const termsandconditions = company.terms_conditions?.replace(/<[^>]*>/g, '') || '';
	const cleanTermsHTML = (html?: string) => {
		if (!html) return "";

		return html
			// remove <font ...> but keep inner text
			.replace(/<font[^>]*>/gi, "")
			.replace(/<\/font>/gi, "")
			// remove empty tags
			.replace(/<p>\s*<\/p>/gi, "")
			.trim();
	};
	const termsandconditionsHTML = cleanTermsHTML(
		company.terms_conditions
	);

	return (
		<main className="max-w-7xl mx-auto px-4 py-6">
			{/* Booking Form - Hidden inputs for BookingButton */}
			<div className="hidden">
				<input id="checkin" type="date" defaultValue={checkin || new Date().toISOString().split('T')[0]} />
				<input id="checkout" type="date" defaultValue={checkout || new Date(Date.now() + 86400000).toISOString().split('T')[0]} />
				<input id="guests" type="number" defaultValue={adults || 1} />
				<input id="children" type="number" defaultValue={children || childrenCount || 0} />
			</div>

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
				{/* Main Image */}
				<div className="md:col-span-2 row-span-2 relative h-80 md:h-[500px]">
					<Image
						src={hotelGalleryImages[0]}
						alt="Hotel view"
						fill
						className="object-cover"
						priority
					/>
				</div>

				{/* Thumbnails */}
				{hotelGalleryImages.slice(1, 5).map((img, index) => (
					<div key={index} className="relative h-40 md:h-60">
						<Image
							src={img}
							alt={`Hotel view ${index + 2}`}
							fill
							className="object-cover"
							onError={(e) => {
								(e.target as HTMLImageElement).src = "/images/defualtimg.webp";
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
										className={`py-4 px-2 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
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
														<span>{room.extraperson}</span>
														{room.view && (
															<>
																<span>•</span>
																<span>{room.view}</span>
															</>
														)}
													</div>

													<div>


														{/* {room.priceFrom && ( */}
														<>
															<p className="text-green-600 mb-2 text-xl font-semibold">
																{/* ${room.priceFrom}{" "} */}
																₱ {getRoomPrice(room, checkin).toLocaleString()}
																<span className="text-gray-500 text-sm ml-2">
																	per night
																</span>
															</p>
															<BookingButton
																hotelId={hotelData._id}
																roomId={room._id}
																className="bg-green-600 text-sm font-medium hover:bg-green-700 text-white p-3 md:px-6 md:py-3 rounded-md flex items-center justify-center transition w-full md:w-auto"
																onBookingSuccess={() => handleBookNow(room)}
															>
																Book Now
															</BookingButton>
														</>
														{/* )} */}
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

										{amenities.map((item) => (
											<div
												key={item.id}
												className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
											>
												{item.icon ? (
													<Image
														src={item.icon}
														alt={item.title}
														width={24}
														height={24}
														className="object-contain"
													/>
												) : (
													<ShieldCheck className="w-6 h-6 text-green-600" />
												)}
												<span>{item.title}</span>
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
									{company.google_map_url && (
										<div className="rounded-lg overflow-hidden border">
											<div
												className="w-full h-[450px]"
												dangerouslySetInnerHTML={{ __html: company.google_map_url }}
											/>
										</div>
									)}
								</div>
							)}

							{activeTab === "knowMore" && (
								<div className="space-y-6">
									<h2 className="text-2xl font-bold">Know More</h2>
									{/* <div className="prose max-w-none">
										<p className="text-gray-700">{termsandconditions}</p>
									</div> */}
									<div
										className="prose max-w-none text-gray-700"
										dangerouslySetInnerHTML={{ __html: termsandconditionsHTML }}
									/>
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
								<div className="p-2 bg-black/90 border-t">
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
													className={`flex-shrink-0 w-20 h-16 md:w-24 md:h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${(selectedRoom.currentImageIndex || 0) === idx
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
