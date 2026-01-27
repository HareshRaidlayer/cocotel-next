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
      ? selectedAmenities.filter(id => id !== amenityId)
      : [...selectedAmenities, amenityId];
    onAmenityChange(newSelected);
  };

  const handleTagToggle = (tagId: string) => {
    const newSelected = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagChange(newSelected);
  };

  // Update parent whenever price changes
  useEffect(() => {
    if (onPriceChange) onPriceChange(price);
  }, [price, onPriceChange]);

  return (
    <aside className="bg-white rounded-lg shadow-sm p-5 space-y-6 text-sm">

      {/*  Price Slider */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md">
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
          {/* ₹ */}
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {price.toLocaleString()}
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

//         <div className="flex flex-wrap gap-2">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <button
//               key={star}
//               className="flex items-center gap-1 px-3 py-1 rounded-full border hover:bg-blue-50"
//             >
//               <Star className="w-3 h-3 text-yellow-500" />
//               {star} Star
//             </button>
//           ))}
//         </div>
//       </div>

//       <hr className="border border-green-400"/>

//       {/* ⭐ Review Score */}
//       <div>
//         <div className="flex items-center gap-2 mb-3">
//           <Star className="w-4 h-4 text-blue-600" />
//           <h3 className="font-semibold">Review score</h3>
//         </div>

//         <div className="space-y-2">
//           {[
//             "Excellent 9.0+",
//             "Very good 8.0+",
//             "Good 7.0+",
//             "Any",
//           ].map((item) => (
//             <label
//               key={item}
//               className="flex items-center gap-2 cursor-pointer"
//             >
//               <input type="radio" name="reviewScore" />
//               <span>{item}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       <hr  className="border border-green-400"/>

//       {/* 🏨 Categories */}
//       <div>
//         <div className="flex items-center gap-2 mb-3">
//           <Building2 className="w-4 h-4 text-indigo-600" />
//           <h3 className="font-semibold">Categories</h3>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {[
//             "Hotel",
//             "Resort",
//             "Cottage",
//             "Guesthouse",
//             "Vacation rental",
//             "Hostel",
//             "Bed & breakfast",
//           ].map((cat) => (
//             <button
//               key={cat}
//               className="px-3 py-1 border border-green-400 rounded-full hover:bg-blue-50"
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       <hr className="border border-green-400"/>

//       {/* ❌ Cancellations */}
//       <div>
//         <div className="flex items-center gap-2 mb-3">
//           <XCircle className="w-4 h-4 text-red-500" />
//           <h3 className="font-semibold">Cancellations</h3>
//         </div>

//         <label className="flex items-center gap-2 cursor-pointer">
//           <input type="checkbox" />
//           <span>Free cancellation</span>
//         </label>
//       </div>

//       <hr className="border border-green-400"/>

//       {/* 🍽 Meals Included */}
//       <div>
//         <div className="flex items-center gap-2 mb-3">
//           <Coffee className="w-4 h-4 text-green-600" />
//           <h3 className="font-semibold">Meals included</h3>
//         </div>

//         <div className="space-y-2">
//           {[
//             "Any",
//             "Bed and breakfast",
//             "Half board",
//             "Full board",
//             "All inclusive",
//           ].map((meal) => (
//             <label
//               key={meal}
//               className="flex items-center gap-2 cursor-pointer"
//             >
//               <input type="radio" name="meals" />
//               <span>{meal}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//     </aside>
//   );
// }

