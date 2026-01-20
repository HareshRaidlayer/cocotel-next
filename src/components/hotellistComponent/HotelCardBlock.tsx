"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Hotel } from "@/types/hotel";
import { Star, MapPin, Coffee, ParkingCircle } from "lucide-react";

interface Props {
    hotel: Hotel;
    onQuickView: () => void;
}

export default function HotelCardBlock({ hotel, onQuickView }: Props) {
    return (
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-[200px]">
                <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                />
                {/* ⭐ RATING + DISCOUNT */}
                <div className="absolute top-2 right-0 flex justify-between items-center w-full z-10 px-2">
                    <div className="flex items-center">
                        <Image src="/images/rating-left.svg" alt="" width={22} height={22} />
                        <span className="text-white text-base font-bold drop-shadow-md">
                            {hotel.rating}
                        </span>
                        <Image src="/images/rating-right.svg" alt="" width={22} height={22} />
                        <span className="text-white ms-3 text-sm font-semibold drop-shadow-md">
                            {hotel.reviews} reviews
                        </span>
                    </div>

                    <div className="bg-white shadow-xl rounded-full text-xs text-black px-2 py-1 font-medium">
                        {hotel.discount}
                    </div>
                </div>
                {/* Quick View */}
                <button
                    onClick={onQuickView}
                    className="absolute bottom-8 right-2 bg-black/60 text-white px-3 py-1 rounded-md text-sm hover:bg-black/80"
                >
                    Quick View
                </button>

                <div className="absolute bottom-0 right-0 bg-green-600 text-white px-3 py-1 text-xs">
                    {hotel.save}
                </div>
            </div>

            {/* <div className="p-4"> */}

           <div className="p-4">
    {/* HOTEL NAME */}
    <h3 className="font-semibold text-center text-base text-green-700 line-clamp-2">
        {hotel.name}
    </h3>

    {/* DETAILS GRID */}
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-5 text-sm">
        {/* CATEGORY */}
        <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
                <Star className="w-4 h-4 text-green-500" />
            </div>
            <div className="leading-tight">
                <p className="text-gray-600 text-xs">Category</p>
                <p className="text-green-700 font-medium text-xs">
                    {hotel.category}
                </p>
            </div>
        </div>

        {/* LOCATION */}
        <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
                <MapPin className="w-4 h-4 text-green-500" />
            </div>
            <div className="leading-tight">
                <p className="text-gray-600 text-xs">Location</p>
                <p className="text-green-700 font-medium text-xs">
                    {hotel.distance}
                </p>
            </div>
        </div>

        {/* BREAKFAST */}
        <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
                <Coffee className="w-4 h-4 text-green-500" />
            </div>
            <div className="leading-tight">
                <p className="text-gray-600 text-xs">Breakfast</p>
                <p className="text-green-700 font-medium text-xs">
                    {hotel.breakfast ? "Available" : "Not available"}
                </p>
            </div>
        </div>

        {/* PARKING */}
        <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
                <ParkingCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="leading-tight">
                <p className="text-gray-600 text-xs">Parking</p>
                <p className="text-green-700 font-medium text-xs">
                    {hotel.parking}
                </p>
            </div>
        </div>
    </div>

    {/* LOCATION TEXT */}
    <p className="mt-3 text-xs text-gray-500">{hotel.location}</p>

    {/* PRICE + BUTTON */}
    <div className="flex justify-between items-center mt-4">
        <p className="text-lg font-bold text-gray-900">
            <span className="text-xs text-gray-500">From</span>{" "}
            {hotel.price.toLocaleString()}{" "}
            <span className="text-xs text-gray-500">USD</span>
        </p>
        <Button name="Book Now" />
    </div>
</div>



            {/* </div> */}
        </div>
    );
}
