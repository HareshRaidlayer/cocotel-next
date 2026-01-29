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
import { useState } from "react";
import Button from "@/components/ui/Button";

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

export default function HotelPageClient() {
	const [activeTab, setActiveTab] = useState("rooms");
	const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

	// Sample room data – expand with your real hotel rooms
	const rooms = [
		{
			id: 1,
			name: "Superior Day-Use Room",
			size: "35m² (376 ft²)",
			capacity: "2 persons",
			beds: "1× Double bed",
			view: "City View",
			description:
				"The unit has 1 bed. This is a Day Use offer from 09:00-18:00 with a maximum of 6 hours use. Kindly note that this is not an overnight stay. Guests are allowed to stay in the room for a maximum of 6 hours between 09:00 and 18:00.",
			amenities: [
				"Wireless Internet",
				"Wake-Up Service",
				"Air Conditioning",
				"Bath Or Shower",
				"Bath",
				"Cable Channels",
				"Coffee Or Tea Maker",
				"Flat-Screen TV",
				"Free Toiletries",
				"Alarm Clock",
				"Desk",
				"Hair Dryer",
			],
			priceFrom: 99,
			images: [
				"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
				"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
				"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
			],
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
			description:
				"Spacious corner room with excellent natural light and panoramic city views. Perfect for business travelers or short stays.",
			amenities: [
				"Free Wi-Fi",
				"Air Conditioning",
				"Flat-Screen TV",
				"Minibar",
				"Safe",
				"Work Desk",
				"Private Bathroom",
			],
			priceFrom: 120,
			images: [
				"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
				"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
				"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
			],
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
		{
			id: 4,
			name: "Standard Twin Room",
			size: "23m² (247 ft²)",
			capacity: "2 persons",
			beds: "2 Single beds",
			view: "City View",
			description:
				"Comfortable and affordable twin room ideal for friends or colleagues.",
			amenities: ["Free Wi-Fi", "Air Conditioning", "TV", "Private Bath"],
			priceFrom: 105,
			images: [
				"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
				"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
				"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
			],
			currentImageIndex: 0,
		},
	];

	return (
		<main className="max-w-7xl mx-auto px-4 py-6">
			{/* Hotel Title & Rating */}
			<div className="mb-6 flex justify-between items-center">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold">Belmont Hotel Manila</h1>
					<div className="flex items-center gap-1 text-green-600 mt-1">
						<MapPin className="w-4 h-4" />
						<span>
							5.7 miles (9.1 km) from downtown Manila • Newport City, Pasay
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

			{/* Gallery – unchanged */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
				<div className="md:col-span-2 row-span-2 relative h-80 md:h-[500px]">
					<Image
						src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
						alt="Hotel view"
						fill
						className="object-cover"
					/>
				</div>
				<div className="relative h-40 md:h-60">
					<Image
						src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
						alt="Room"
						fill
						className="object-cover"
					/>
				</div>
				<div className="relative h-40 md:h-60">
					<Image
						src="https://images.unsplash.com/photo-1578683015146-bda8d4e92bfe?w=800"
						alt="Bedroom"
						fill
						className="object-cover"
					/>
				</div>
				<div className="relative h-40 md:h-60">
					<Image
						src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
						alt="Bathroom"
						fill
						className="object-cover"
					/>
				</div>
				<div className="relative h-40 md:h-60">
					<Image
						src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
						alt="View"
						fill
						className="object-cover"
					/>
				</div>
			</div>

			{/* Summary & Quick Info */}
			<div className="grid md:grid-cols-4 gap-4">
				{/* Left - Description & Tabs */}
				<div className="md:col-span-3 space-y-8">
					<section>
						<h2 className="text-2xl font-bold mb-4">
							Relax and recharge at this superb 4-star hotel
						</h2>
						<p className="text-gray-700 leading-relaxed">
							Belmont Hotel Manila, a great place to stay in Manila, the
							Philippines! This superb 4-star hotel is located 5.7 miles (9.1
							km) from the downtown area of Manila. Previous guests of the hotel
							have rated their stay an average of 8.4 out of 10 in 5,349
							reviews.
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
							{/* Enhanced Rooms Tab */}
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
																	{" "}
																	${room.priceFrom}{" "}
																	<span className="text-gray-500 text-sm">
																		per night
																	</span>
																</p>

																<Button name="Book Now" />
															</>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Other tabs unchanged – add your existing content here */}
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

									<div className="mt-8 space-y-6">
										<div>
											<h3 className="font-bold text-lg mb-3">General</h3>
											<ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
												<li className="flex items-center gap-2">
													<ShieldCheck className="w-5 h-5 text-green-600" />
													<span>24-hour security</span>
												</li>
												<li className="flex items-center gap-2">
													<ShieldCheck className="w-5 h-5 text-green-600" />
													<span>Air conditioning</span>
												</li>
												<li className="flex items-center gap-2">
													<ShieldCheck className="w-5 h-5 text-green-600" />
													<span>Elevator</span>
												</li>
											</ul>
										</div>

										<div>
											<h3 className="font-bold text-lg mb-3">Activities</h3>
											<ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
												<li className="flex items-center gap-2">
													<ShieldCheck className="w-5 h-5 text-green-600" />
													<span>Swimming pool</span>
												</li>
												<li className="flex items-center gap-2">
													<ShieldCheck className="w-5 h-5 text-green-600" />
													<span>Spa & wellness center</span>
												</li>
											</ul>
										</div>
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
													Newport City, Pasay, Metro Manila, Philippines
												</p>
												<p className="text-sm text-gray-600 mt-1">
													5.7 miles (9.1 km) from downtown Manila
												</p>
											</div>
										</div>
									</div>

									<div className="bg-white border rounded-lg overflow-hidden">
										<div className="aspect-video bg-gray-200 flex items-center justify-center">
											<p className="text-gray-500">
												Map placeholder - Integrate Google Maps or similar
											</p>
										</div>
									</div>

									<div className="space-y-3">
										<h3 className="font-bold text-lg">Nearby Landmarks</h3>
										<ul className="space-y-2">
											<li className="flex justify-between items-center p-3 bg-gray-50 rounded">
												<span>
													Ninoy Aquino International Airport Terminal 3
												</span>
												<span className="text-sm text-gray-600">0.3 km</span>
											</li>
											<li className="flex justify-between items-center p-3 bg-gray-50 rounded">
												<span>Resorts World Manila</span>
												<span className="text-sm text-gray-600">0.5 km</span>
											</li>
											<li className="flex justify-between items-center p-3 bg-gray-50 rounded">
												<span>SM Mall of Asia</span>
												<span className="text-sm text-gray-600">3.2 km</span>
											</li>
											<li className="flex justify-between items-center p-3 bg-gray-50 rounded">
												<span>Cultural Center of the Philippines</span>
												<span className="text-sm text-gray-600">4.5 km</span>
											</li>
										</ul>
									</div>
								</div>
							)}

							{activeTab === "knowMore" && (
								<div className="space-y-6">
									<h2 className="text-2xl font-bold">Know More</h2>

									<div>
										<h3 className="font-bold text-lg mb-3">
											About the Property
										</h3>
										<p className="text-gray-700 leading-relaxed mb-4">
											Belmont Hotel Manila is a premier 4-star accommodation
											located in the heart of Newport City, Pasay. The hotel
											offers a perfect blend of comfort, convenience, and luxury
											for both business and leisure travelers.
										</p>
										<p className="text-gray-700 leading-relaxed">
											With its strategic location near the airport and major
											shopping destinations, guests enjoy easy access to
											Manila&apos;s top attractions while experiencing
											world-class hospitality and modern amenities.
										</p>
									</div>

									<div>
										<h3 className="font-bold text-lg mb-3">House Rules</h3>
										<div className="space-y-2">
											<div className="flex justify-between p-3 bg-gray-50 rounded">
												<span className="font-medium">Check-in</span>
												<span>From 2:00 PM</span>
											</div>
											<div className="flex justify-between p-3 bg-gray-50 rounded">
												<span className="font-medium">Check-out</span>
												<span>Until 12:00 PM</span>
											</div>
											<div className="flex justify-between p-3 bg-gray-50 rounded">
												<span className="font-medium">Pets</span>
												<span>Not allowed</span>
											</div>
											<div className="flex justify-between p-3 bg-gray-50 rounded">
												<span className="font-medium">Smoking</span>
												<span>No smoking rooms available</span>
											</div>
										</div>
									</div>

									<div>
										<h3 className="font-bold text-lg mb-3">
											Important Information
										</h3>
										<ul className="space-y-2 text-gray-700">
											<li className="flex gap-2">
												<span className="text-green-600">•</span>
												<span>
													Valid ID and credit card required at check-in
												</span>
											</li>
											<li className="flex gap-2">
												<span className="text-green-600">•</span>
												<span>
													Early check-in and late check-out subject to
													availability
												</span>
											</li>
											<li className="flex gap-2">
												<span className="text-green-600">•</span>
												<span>Extra bed charges may apply</span>
											</li>
										</ul>
									</div>
								</div>
							)}

							{activeTab === "otherDetails" && (
								<div className="space-y-6">
									<h2 className="text-2xl font-bold">Other Details</h2>

									<div>
										<h3 className="font-bold text-lg mb-3">Payment Options</h3>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
											<div className="p-3 bg-gray-50 rounded text-center">
												Visa
											</div>
											<div className="p-3 bg-gray-50 rounded text-center">
												Mastercard
											</div>
											<div className="p-3 bg-gray-50 rounded text-center">
												American Express
											</div>
											<div className="p-3 bg-gray-50 rounded text-center">
												Cash
											</div>
										</div>
									</div>

									<div>
										<h3 className="font-bold text-lg mb-3">Languages Spoken</h3>
										<div className="flex flex-wrap gap-2">
											<span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
												English
											</span>
											<span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
												Filipino
											</span>
											<span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
												Mandarin
											</span>
										</div>
									</div>

									<div>
										<h3 className="font-bold text-lg mb-3">
											Cancellation Policy
										</h3>
										<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
											<p className="text-gray-700 mb-2">
												<strong>Free cancellation</strong> until 24 hours before
												check-in
											</p>
											<p className="text-sm text-gray-600">
												After this period, cancellations will incur a charge
												equivalent to the first night&apos;s stay.
											</p>
										</div>
									</div>

									<div>
										<h3 className="font-bold text-lg mb-3">
											Additional Services
										</h3>
										<ul className="space-y-3">
											<li className="flex items-center justify-between p-3 bg-gray-50 rounded">
												<span>Airport shuttle service</span>
												<span className="text-sm text-green-600">
													Available
												</span>
											</li>
											<li className="flex items-center justify-between p-3 bg-gray-50 rounded">
												<span>Laundry service</span>
												<span className="text-sm text-green-600">
													Available
												</span>
											</li>
											<li className="flex items-center justify-between p-3 bg-gray-50 rounded">
												<span>Room service</span>
												<span className="text-sm text-green-600">24/7</span>
											</li>
											<li className="flex items-center justify-between p-3 bg-gray-50 rounded">
												<span>Concierge service</span>
												<span className="text-sm text-green-600">
													Available
												</span>
											</li>
										</ul>
									</div>
								</div>
							)}
						</div>
					</section>
				</div>

				{/* Right Sidebar – unchanged */}
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
							{/* ... reviews ... */}
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
						{/* Close button */}
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

						{/* Rest of modal content */}
						<div className="p-6 md:p-8">
							<h2 className="text-2xl md:text-3xl font-bold mb-4">
								{selectedRoom.name}
							</h2>

							{/* Key Features */}
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

							{/* Amenities */}
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
