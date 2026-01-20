"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Hotel } from "@/types/hotel";

interface Props {
  hotel: Hotel;
}

export default function HotelCardRow({ hotel }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm flex gap-4 p-4">
      <div className="relative w-40 h-28 rounded overflow-hidden">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold">{hotel.name}</h3>
        <p className="text-sm text-gray-500">{hotel.location}</p>
        <p className="text-sm text-green-600 mt-1">
          ⭐ {hotel.rating} ({hotel.reviews} reviews)
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-green-600">
          PHP {hotel.price.toLocaleString()}
        </p>
        <Button name="View Deal" />
      </div>
    </div>
  );
}
