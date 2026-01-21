"use client";

import { useState } from "react";
import { Search, Calendar, Users, Plus, Minus } from "lucide-react";

export default function SearchSubHeader() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [openGuests, setOpenGuests] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  return (
    <div className="bg-[#4CAA42] py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3">

          {/* 1️⃣ LOCATION SEARCH */}
          <div className="bg-white h-[56px] rounded-lg flex items-center px-4 w-[32%] shadow">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Holiday Inn Express Gurugram Sector..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* 2️⃣ CHECK-IN / CHECK-OUT */}
          <div className="bg-white h-[56px] rounded-lg flex items-center px-4 w-[26%] shadow divide-x">
            <div className="flex items-center gap-2 pr-3 w-1/2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="text-sm outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 pl-3 w-1/2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="text-sm outline-none w-full"
              />
            </div>
          </div>

          {/* 3️⃣ ROOMS & GUESTS */}
          <div className="relative bg-white h-[56px] rounded-lg flex items-center px-4 w-[22%] shadow">
            <Users className="w-5 h-5 text-gray-500 mr-2" />

            <button
              onClick={() => setOpenGuests(!openGuests)}
              className="text-left w-full"
            >
              <div className="text-sm font-medium">
                {adults} adults
              </div>
              <div className="text-xs text-gray-400">
                {rooms} room
              </div>
            </button>

            {/* DROPDOWN */}
            {openGuests && (
              <div className="absolute top-[64px] left-0 w-[320px] bg-white rounded-xl shadow-xl p-4">
                <GuestRow label="Room" value={rooms} setValue={setRooms} min={1} />
                <GuestRow label="Adults" value={adults} setValue={setAdults} min={1} />
                <GuestRow label="Children" value={children} setValue={setChildren} min={0} />

                <p className="text-xs text-gray-500 mt-3">
                  Search for 1 room to see all multi-bedroom properties that can fit your entire group
                </p>
              </div>
            )}
          </div>

          {/* 4️⃣ SEARCH BUTTON */}
          <button className="h-[56px] px-10 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg">
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------- */
/* GUEST COUNTER ROW */
/* ------------------- */
function GuestRow({
  label,
  value,
  setValue,
  min
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
}) {
  return (
    <div className="flex justify-between items-center py-2">
      <div>
        <p className="font-medium">{label}</p>
        {label === "Adults" && <p className="text-xs text-gray-400">Ages 18+</p>}
        {label === "Children" && <p className="text-xs text-gray-400">Ages 0–17</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setValue(Math.max(min, value - 1))}
          className="w-8 h-8 border rounded-full flex items-center justify-center"
        >
          <Minus size={14} />
        </button>

        <span className="w-4 text-center">{value}</span>

        <button
          onClick={() => setValue(value + 1)}
          className="w-8 h-8 border rounded-full flex items-center justify-center"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
