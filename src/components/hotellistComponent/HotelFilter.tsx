"use client";

import { Star, Coffee, XCircle, Building2 } from "lucide-react";

export default function HotelFilterUI() {
  return (
    <aside className="bg-white rounded-lg shadow-sm p-5 space-y-6 text-sm">

      {/* ⭐ Hotel Star Rating */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-yellow-500" />
          <h3 className="font-semibold">Hotel star rating</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="flex items-center gap-1 px-3 py-1 rounded-full border hover:bg-blue-50"
            >
              <Star className="w-3 h-3 text-yellow-500" />
              {star} Star
            </button>
          ))}
        </div>
      </div>

      <hr className="border border-green-400"/>

      {/* ⭐ Review Score */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold">Review score</h3>
        </div>

        <div className="space-y-2">
          {[
            "Excellent 9.0+",
            "Very good 8.0+",
            "Good 7.0+",
            "Any",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input type="radio" name="reviewScore" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <hr  className="border border-green-400"/>

      {/* 🏨 Categories */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold">Categories</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            "Hotel",
            "Resort",
            "Cottage",
            "Guesthouse",
            "Vacation rental",
            "Hostel",
            "Bed & breakfast",
          ].map((cat) => (
            <button
              key={cat}
              className="px-3 py-1 border border-green-400 rounded-full hover:bg-blue-50"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <hr className="border border-green-400"/>

      {/* ❌ Cancellations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-4 h-4 text-red-500" />
          <h3 className="font-semibold">Cancellations</h3>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" />
          <span>Free cancellation</span>
        </label>
      </div>

      <hr className="border border-green-400"/>

      {/* 🍽 Meals Included */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Coffee className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold">Meals included</h3>
        </div>

        <div className="space-y-2">
          {[
            "Any",
            "Bed and breakfast",
            "Half board",
            "Full board",
            "All inclusive",
          ].map((meal) => (
            <label
              key={meal}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input type="radio" name="meals" />
              <span>{meal}</span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}
