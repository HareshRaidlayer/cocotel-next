"use client";

import { useState, useEffect } from "react";
import { AmenityApiItem, TagApiItem } from "@/types/hotel";

interface Props {
	amenities: AmenityApiItem[];
	tags: TagApiItem[];
	selectedAmenities: string[];
	selectedTags: string[];
	onAmenityChange: (ids: string[]) => void;
	onTagChange: (ids: string[]) => void;
	onPriceChange?: (price: number) => void; // optional callback to parent
}

export default function HotelFilterUI({
	amenities,
	tags,
	selectedAmenities,
	selectedTags,
	onAmenityChange,
	onTagChange,
	onPriceChange,
}: Props) {
	const [price, setPrice] = useState(20000); // max default

	const handleAmenityToggle = (amenityId: string) => {
		const newSelected = selectedAmenities.includes(amenityId)
			? selectedAmenities.filter((id) => id !== amenityId)
			: [...selectedAmenities, amenityId];
		onAmenityChange(newSelected);
	};

	const handleTagToggle = (tagId: string) => {
		const newSelected = selectedTags.includes(tagId)
			? selectedTags.filter((id) => id !== tagId)
			: [...selectedTags, tagId];
		onTagChange(newSelected);
	};

	// Update parent whenever price changes
	useEffect(() => {
		if (onPriceChange) onPriceChange(price);
	}, [price, onPriceChange]);

  return (
    // <aside className="bg-white rounded-lg shadow-sm p-5 space-y-6 text-sm">
    <aside
      className="
    sticky 
    top-24 
    bg-white 
    rounded-lg 
    shadow-sm 
    p-5 
    space-y-6 
    text-sm
    max-h-[calc(100vh-6rem)]
    overflow-y-auto
  "
    >
      {/*  Price Slider */}
      {/* <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md">
        <h3 className="font-semibold text-sm sm:text-base mb-4">
          Your budget (per night)
        </h3>

					<input
						type="range"
						min={0}
						max={20000}
						value={price}
						onChange={(e) => setPrice(Number(e.target.value))}
						className="w-full accent-white cursor-pointer"
					/>

        <div className="flex justify-between text-xs font-medium mt-3">
          <span>0</span>
          
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {price.toLocaleString()}
          </span>
        </div>
      </div>  ₹ */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white shadow-sm border border-gray-100">
        <h3 className="font-semibold text-sm sm:text-base mb-4 text-gray-800">
          Your budget (per night)
        </h3>

        {/* Slider */}
        <input
          type="range"
          min={0}
          max={20000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="
      w-full
      cursor-pointer
      accent-green-600
    "
        />

        {/* Price */}
        <div className="flex justify-between text-xs font-medium mt-3 text-gray-500">
          <span>0</span>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            ₹{price.toLocaleString()}
          </span>
        </div>
      </div>

				<hr className="border border-gray-200" />

				{/* Amenities */}
				<div>
					<h3 className="font-semibold mb-2">Amenities filters</h3>
					<div className="space-y-2 max-h-60 overflow-y-auto">
						{amenities.map((amenity) => (
							<label
								key={amenity._id}
								className="flex items-center gap-2 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={selectedAmenities.includes(amenity._id)}
									onChange={() => handleAmenityToggle(amenity._id)}
								/>
								<span>{amenity.sectionData.amenities.amenity_name}</span>
							</label>
						))}
					</div>
				</div>

				<hr className="border border-gray-200" />

      {/*  Tags */}
      <div>
        <h3 className="font-semibold mb-2">Tag filters</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tags.map((tag) => (
            <label
              key={tag._id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag._id)}
                onChange={() => handleTagToggle(tag._id)}
              />
              <span>{tag.sectionData.tag.title}</span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}
