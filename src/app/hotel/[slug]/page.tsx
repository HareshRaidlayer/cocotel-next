"use client";

import Image from "next/image";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Define the type for the props this component will eventually receive
interface HotelProps {
  id: string;
  name: string;
  slug: string;
  location: string;
  province: string;
  price: number;
  discountPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  amenities: string[];
}

// Mapping for amenity names to their image paths
const amenityIcons: Record<string, string> = {
  "Free Wi-Fi": "/images/uil_wifi.svg",
  "Pets": "/images/Pets.svg",
  "Swimming Pool": "/images/swimmer.svg",
  "Toiletries": "/images/Toiletries.svg",
  "Parking": "/images/Parking.svg",
};

export default function HotelHeroSection() {
  const [activeTab, setActiveTab] = useState("Home");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomImagesIndex, setRoomImagesIndex] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  // Hardcoded data for now, but ready to be replaced by dynamic data later.
  // This object will eventually be passed as a prop to this component.
  const hotel: HotelProps = {
    id: "some_id_123",
    name: "Shoreland Beach Resort by Cocotel",
    slug: "shoreland-beach-resort-by-cocotel",
    location: "Nasugbu",
    province: "Batangas, Philippines",
    price: 52,
    discountPrice: 94,
    rating: 4.1,
    reviews: 530,
    image: "/hotel/hotel1.png",
    description: "AS Ilaya Resort and Events Place is an ideal destination for those seeking relaxation and fun with their loved ones. The establishment provides comfortable accommodations and a large swimming pool. The rooms are spacious and well-maintained, while the surrounding greenery creates a tranquil atmosphere.",
    amenities: ["Free Wi-Fi", "Pets", "Swimming Pool", "Toiletries", "Parking"],
  };

  const tabs = ["Home", "Amenities", "ROOM", "Location", "Know More", "FAQ"];

  const mobileImages = [
    "/hotel/hotel1.png",
    "/hotel/hotel2.jpg",
    "/hotel/hotel3.jpg",
    "/hotel/hotel4.jpg",
    "/hotel/hotel5.jpg",
  ];

  const roomImages = [
    "/hotel/room1.png",
    "/hotel/room2.png",
    "/hotel/room3.png",
    "/hotel/room4.png",
  ];

  const faqData = [
    {
      question: "Do you allow early check in?",
      answer:
        "Early check-in cannot be guaranteed and is subject to availability of the room.",
    },
    {
      question: "Is Wi-Fi available in the resort?",
      answer: "Yes.",
    },
    {
      question: "Are kids and seniors allowed?",
      answer: "Yes.",
    },
    {
      question: "Are pets allowed?",
      answer:
        "Pets are allowed but they should be in a cage, and are friendly/safe to other guests",
    },
  ];

  const handleMainPrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? mobileImages.length - 1 : prev - 1
    );
  };

  const handleMainNext = () => {
    setCurrentImageIndex((prev) =>
      prev === mobileImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleRoomPrev = () => {
    setRoomImagesIndex((prev) =>
      prev === 0 ? roomImages.length - 1 : prev - 1
    );
  };

  const handleRoomNext = () => {
    setRoomImagesIndex((prev) =>
      prev === roomImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleFaqClick = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    let sectionId = "";
    switch (tabName) {
      case "Amenities":
        sectionId = "amenities-section";
        break;
      case "ROOM":
        sectionId = "rooms-section";
        break;
      case "Know More":
        sectionId = "know-more-section";
        break;
      case "FAQ":
        sectionId = "faq-section";
        break;
      default:
        return;
    }

    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-10">
      {/* 👉 Image Gallery - Desktop */}
      <section className="hidden lg:flex gap-3 mb-12">
        <div className="relative w-[604px] h-[476px]">
          <Image
            src={hotel.image}
            alt="Main Hotel View"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[2, 3, 4, 5].map((num) => (
            <div key={num} className="relative w-[294px] h-[230px]">
              <Image
                src={`/hotel/hotel${num}.jpg`}
                alt={`Hotel View ${num}`}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          ))}
        </div>
      </section>

      {/* 👉 Image Gallery - Mobile */}
      <section className="relative lg:hidden w-full h-[300px] mb-8">
        <Image
          src={mobileImages[currentImageIndex]}
          alt="Hotel Mobile View"
          fill
          className="object-cover rounded-t-md"
        />
        <button
          onClick={handleMainPrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleMainNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full"
        >
          <FaChevronRight />
        </button>
      </section>

      {/* 👉 Tabs */}
      <div className="flex flex-wrap gap-10 text-[20px] font-semibold border-b pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`relative pb-1 transition-colors duration-200 ${
              activeTab === tab
                ? "text-green-600 font-bold"
                : "text-gray-800 hover:text-green-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-600 rounded"></span>
            )}
          </button>
        ))}
      </div>

      {/* 👉 Title & Side Content */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 border-b pb-6 mb-6">
        {/* 📝 Left: Hotel Info */}
        <div className="flex-1">
          <h1 className="text-[32px] sm:text-[36px] lg:text-[48px]  leading-tight mb-3 font-semibold">
            {hotel.name}
          </h1>
          <h2 className="text-green-600 text-[20px] sm:text-[22px] lg:text-[24px]  font-light mb-4">
            {hotel.location}, {hotel.province}
          </h2>
          <p className="text-[16px]   text-gray-700 leading-6 max-w-2xl">
            {hotel.description}
          </p>
        </div>

        {/* ⭐ Right: Rating & Price */}
        <div className="w-full lg:w-[260px] flex flex-col justify-between">
          <div className="flex items-center mb-4">
            {[...Array(Math.floor(hotel.rating))].map((_, i) => (
              <Image
                key={i}
                src="/images/full-star.svg"
                alt="Star"
                width={20}
                height={20}
              />
            ))}
            {hotel.rating % 1 !== 0 && (
              <Image
                src="/images/half-star.svg"
                alt="Half Star"
                width={20}
                height={20}
              />
            )}
            <span className="ml-3 text-gray-800 text-sm font-medium">
              {hotel.rating} / 5 ({hotel.reviews} Review)
            </span>
          </div>

          <div className="text-right mt-auto">
            <h4 className="text-sm text-gray-600">start-from</h4>
            <h1 className="text-green-600 text-2xl font-bold">
              $ {hotel.price}
            </h1>
            <h4 className="text-sm text-gray-600">/room /night</h4>
            <button className="mt-3 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
              See Rooms
            </button>
          </div>
        </div>
      </div>

      {/* 👉 Amenities */}
      <div id="amenities-section">
        <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold leading-tight mb-8">
          Amenities
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 border-b pb-6 mb-6">
          {hotel.amenities && hotel.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3">
              <Image
                src={amenityIcons[amenity]}
                alt={amenity}
                width={40}
                height={40}
              />
              <h3 className="text-[18px] font-bold text-black">{amenity}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* 👉 Hotel Room Section */}
      <section
        id="rooms-section"
        className="bg-[#e9ffe6] p-6 rounded-md border-green-600 mt-12"
      >
        <div className="flex flex-col">
          {/* Align heading with image */}
          <h1 className="text-[36px] font-semibold ml-3 text-center lg:text-left">
            Family Room
          </h1>

          <div className="flex flex-col lg:flex-row gap-6 mt-4 lg:mt-0">
            {/* Image Gallery */}
            <div className="relative p-3 rounded-lg w-full max-w-[500px] mx-auto">
              <div className="relative w-full h-[250px] sm:h-[321px] rounded-t-md overflow-hidden">
                <Image
                  src={roomImages[roomImagesIndex]}
                  alt="Room View"
                  fill
                  className="object-cover rounded-t-md"
                />
                <button
                  onClick={handleRoomPrev}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={handleRoomNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full"
                >
                  <FaChevronRight size={20} />
                </button>
              </div>

              <div className="w-full bg-white px-5 py-3 rounded-b-md shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-800">
                  <Image
                    src="/hotel/room_user.png"
                    alt="Guests"
                    width={19}
                    height={19}
                  />
                  <span>4 Allowed, 2 Extra</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-800 mt-3">
                  <Image src="/hotel/ac.png" alt="AC" width={19} height={19} />
                  <span>AC</span>
                </div>
              </div>
            </div>

            {/* Details and Price */}
            <div className="flex flex-col lg:flex-row justify-between w-full mt-8 lg:mt-20 gap-10">
              <ul className="list-disc pl-5 text-gray-800 text-[18px] sm:text-[20px] leading-7 flex-1 mx-auto lg:mx-0 max-w-[600px] lg:max-w-none">
                <li>Room with 2 Queen Beds.</li>
                <li>Good for 4 adults and 1 kid below 3 years old.</li>
                <li>Room size/location: 22 sqm. /ground floor.</li>
                <li>Air-conditioned room.</li>
                <li>Private bathroom.</li>
              </ul>
              <div className="text-center lg:text-right min-w-[160px] mx-auto lg:mx-0">
                <p className="text-sm text-gray-700 font-medium">Price</p>
                <p className="text-sm text-red-400 font-bold blink-animation">
                  30% OFF
                </p>
                <p className="text-3xl font-bold text-green-700">$ {hotel.price}</p>
                <p className="text-sm line-through text-gray-500 mb-2">
                  $ {hotel.discountPrice}
                </p>
                <p className="text-sm text-gray-600 mb-4">/room /night</p>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                  Book this room
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Know more section */}
      <section
        id="know-more-section"
        className="bg-white py-10 px-4 sm:px-6 lg:px-12"
      >
        <div className="space-y-10 border-t">
          {/* Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mt-4">
              Know More
            </h1>
          </div>

          {/* Reservation & Check-In */}
          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-4">
              Reservation & Check-In:
            </h4>
            <ul className="list-disc pl-6 text-gray-800 text-base sm:text-lg leading-7 space-y-2">
              <li>Check-In Time: 2:00 PM</li>
              <li>Check-Out Time: 12:00 NN</li>
              <li>Breakfast: Not included</li>
              <li>
                Voucher & ID: Present Hotel Voucher/Confirmation letter and
                matching ID upon check-in
              </li>
              <li>Valid ID: Must match booking details.</li>
              <li>
                Extra Bed: Subject to availability, additional charges may
                apply.
              </li>
              <li>Children (0-3 y/o): Free if sharing bed.</li>
              <li>Corkage Fee: May apply; inquire at check-in.</li>
            </ul>
          </div>

          {/* Front Office */}
          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-4">
              Front Office:
            </h4>
            <ul className="list-disc pl-6 text-gray-800 text-base sm:text-lg leading-7 space-y-2">
              <li>Hours: 7:00 AM - 9:00 PM</li>
              <li>Accepting Guests: 7:00 AM - 9:00 PM</li>
            </ul>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-4">
              Cancellation Policy:
            </h4>
            <ul className="list-disc pl-6 text-gray-800 text-base sm:text-lg leading-7 space-y-2">
              <li>Bookings: Non-Refundable, Non-Cancellable, Non-Rebookable</li>
              <li>No-shows: 100% charged</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 👉 FAQ Section */}
      <section id="faq-section" className="py-10">
        <div className="border-t">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl mt-6 font-semibold text-gray-800">
              Frequently Asked Questions
            </h1>
          </div>

          {/* Dynamically render FAQ items */}
          {faqData.map((item, index) => (
            <div key={index} className="border-b">
              <h4
                onClick={() => handleFaqClick(index)}
                className={`flex justify-between items-center cursor-pointer p-4 transition-colors duration-300 ${
                  openFAQIndex === index ? "bg-[#e9ffe6]" : ""
                }`}
              >
                <span className="text-lg font-semibold text-gray-800">
                  {item.question}
                </span>
                <span>
                  {openFAQIndex === index ? (
                    <FaChevronUp size={20} className="text-green-600" />
                  ) : (
                    <FaChevronDown size={20} className="text-green-600" />
                  )}
                </span>
              </h4>
              <div
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                  openFAQIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="p-4 text-gray-700">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}