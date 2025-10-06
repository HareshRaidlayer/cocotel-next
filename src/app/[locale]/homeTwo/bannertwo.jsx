"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FaPlay,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"; // your calendar component
import { cn } from "@/lib/utils";

const Banner = () => {
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const calendarRef = useRef(null);

  const formatDate = (date) => (date ? format(date, "MMM dd, yyyy") : "");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative p-20 mx-auto">
      {/* Top-right SVG */}
      <div className="absolute top-0 right-0 z-10">
        <Image
          src="/images/Ellipse 2.svg"
          alt="Top Right Decoration"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
        {/* Left Section */}
        <div className="text-left max-w-lg">
          <h1 className="text-5xl lg:text-6xl font-bold text-green-700 mb-8 leading-tight">
            Find the top
            <br />
            Hotels nearby.
          </h1>
          <p className="text-gray-600 mb-6">
            We bring you not only a stay option, but an experience in your budget to enjoy the luxury.
          </p>
          <div className="flex space-x-4">
            <button className="bg-[#C8F3C3] text-[#4CAA42] px-6 py-3 rounded-md transition font-medium">
              Discover Now
            </button>
            <button className="border-2 border-green-500 text-green-700 px-6 py-3 rounded-md flex items-center hover:bg-green-50 transition font-medium">
              <FaPlay className="mr-2" /> Watch our story
            </button>
          </div>
        </div>

        {/* Right Section with Images */}
        <div className="relative flex justify-center">
          <Image
            src="/images/main.png"
            alt="Large Hotel"
            width={461}
            height={532}
            className="rounded-lg relative z-10"
          />
          {/* Big Rounded Image */}
          <div className="absolute top-[250px] -left-16 z-20 w-[140px] h-[140px] rounded-full border-4 overflow-hidden">
            <Image
              src="/images/bigrounded.png"
              alt="Rounded Image 1"
              fill
              className="object-cover rounded-full"
            />
          </div>
          {/* Small Rounded Image */}
          <div className="absolute top-20 -left-12 z-30 w-[86px] h-[86px] rounded-full border-4 overflow-hidden">
            <Image
              src="/images/smallrounded.png"
              alt="Rounded Image 2"
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-[7rem] left-1/2 transform -translate-x-1/2 z-40 w-full px-4">
        <div className="flex flex-wrap lg:flex-nowrap items-center bg-white rounded-xl shadow-xl p-6 gap-3 max-w-5xl mx-auto">
          {/* Location */}
          <div className="flex items-center border rounded-lg px-3 py-2 flex-1 min-w-[180px]">
            <FaMapMarkerAlt className="text-gray-500 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Check-in/out Calendar */}
          <div className="relative flex items-center border rounded-lg px-3 py-2 flex-1 min-w-[220px]" ref={calendarRef}>
            <FaCalendarAlt className="text-gray-500 w-4 h-4 mr-2" />
            <button
              type="button"
              onClick={() => setCalendarOpen(!calendarOpen)}
              className={cn(
                "w-full text-left text-sm text-gray-700 outline-none",
                !dateRange?.from && "text-gray-500"
              )}
            >
              {dateRange?.from
                ? dateRange?.to
                  ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
                  : formatDate(dateRange.from)
                : "Check in – out"}
            </button>
            {calendarOpen && (
              <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg z-50 p-2">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  initialFocus
                  className="border-none"
                />
              </div>
            )}
          </div>

          {/* Guests & Rooms */}
          <div className="flex items-center border rounded-lg px-3 py-2 flex-1 min-w-[180px]">
            <FaUser className="text-gray-500 w-4 h-4 mr-2" />
            <select
              value={`${adults},${children}`}
              onChange={(e) => {
                const [a, c] = e.target.value.split(",").map(Number);
                setAdults(a);
                setChildren(c);
              }}
              className="w-full outline-none text-sm text-gray-700"
            >
              {Array.from({ length: 5 }, (_, i) => i + 1).map((adult) =>
                Array.from({ length: 4 }, (_, j) => j).map((child) => (
                  <option key={`${adult},${child}`} value={`${adult},${child}`}>
                    {adult} Adult{adult > 1 ? "s" : ""},{" "}
                    {child} Child{child !== 1 ? "ren" : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Search Button */}
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full flex items-center justify-center transition">
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
