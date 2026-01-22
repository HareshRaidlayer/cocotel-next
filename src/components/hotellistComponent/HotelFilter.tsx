"use client";

import { useState } from "react";

export default function HotelFilterUI() {
  const [price, setPrice] = useState(20000);

  return (
    <aside
      className="
        w-full 
        lg:max-w-xs 
        bg-white 
        border border-gray-200 
        rounded-2xl 
        p-4 sm:p-5 
        text-xs sm:text-sm 
        space-y-8 
        shadow-sm
      "
    >
      {/* 💰 Budget Filter */}
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
          <span>₹0</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            ₹{price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 🧾 Amenities */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          Amenities
        </h3>

        {/* ✅ Single column always */}
        <div className="space-y-3">
          {[
            "TV",
            "Air Condition",
            "Purified Water Refill",
            "Shampoo",
            "Body Wash",
            "Beach Front",
            "Swimming Pool",
            "Beach",
            "Hot and Cold Shower",
            "Free Wi-Fi",
            "Restaurant Nearby",
            "Pets",
            "Breakfast",
            "Parking",
            "Function Room",
            "Island Tour",
            "Toiletries",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700 group-hover:text-green-600 transition">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 🏷 Tags */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          Tags
        </h3>

        <div className="flex flex-wrap gap-2">
          {[
            "Beach",
            "Nature",
            "Resorts",
            "Farms",
            "Culture",
            "City",
            "Islands",
            "Swimming Pool",
          ].map((tag) => (
            <label
              key={tag}
              className="
                flex items-center gap-2 
                px-3 py-1.5 
                border rounded-full 
                text-xs 
                cursor-pointer 
                hover:border-green-500 
                hover:text-green-600 
                transition
              "
            >
              <input
                type="checkbox"
                className="h-3 w-3 text-green-600 focus:ring-green-500"
              />
              {tag}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}



// "use client";

// import { Star, Coffee, XCircle, Building2 } from "lucide-react";

// export default function HotelFilterUI() {
//   return (
//     <aside className="bg-white rounded-lg shadow-sm p-5 space-y-6 text-sm">

//       {/* ⭐ Hotel Star Rating */}
//       <div>
//         <div className="flex items-center gap-2 mb-3">
//           <Star className="w-4 h-4 text-yellow-500" />
//           <h3 className="font-semibold">Hotel star rating</h3>
//         </div>

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
