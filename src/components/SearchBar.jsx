"use client";

import React, { useState, useRef } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import { format } from "date-fns";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

const locations = {
  ph: ["Manila", "Cebu", "Boracay"],
  id: ["Bali", "Jakarta", "Yogyakarta"],
  aus: ["Sydney", "Melbourne", "Brisbane"],
};

const SearchBar = ({ countries, activeCountry, onCountryClick, isMobile = false }) => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const calendarRef = useRef(null);
  const guestsRef = useRef(null);
  const locationRef = useRef(null);

  const filteredLocations = locations[activeCountry]?.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${isMobile ? 'sm:hidden' : 'hidden sm:block'}`}>
      <div>
        <div className="flex flex-col bg-white rounded-xl shadow-xl gap-3">
          {/* Country Tabs */}
          <div className={`flex ${isMobile ? 'justify-center space-x-1 p-2' : 'space-x-4 p-4 md:p-6'} bg-green-100/50 rounded-t-xl`}>
            {countries.map((c) => (
              <button
                  key={c.id}
                  onClick={() => onCountryClick(c.code)}
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg text-base font-medium transition country-button-shdow ${
                    activeCountry === c.code
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-white text-gray-700 hover:bg-green-600 hover:text-white"
                  }`}
                  variants={tabVariants}
                >
                  <Image src={c.flag} alt={c.name} width={20} height={20} />
                  {c.name}
                </button>
            ))}
          </div>

          {/* Search Fields */}
          <div className={`bg-white flex flex-col md:flex-row flex-wrap items-center gap-3 ${isMobile ? 'pb-5 px-4' : 'pb-6 px-4 md:px-6'} rounded-xl`}>
            {/* Location Dropdown */}
            <div
              className={`relative flex items-center border border-green-500 rounded-lg px-3 py-3 flex-1 ${
                isMobile ? 'w-full' : 'min-w-[140px] md:min-w-[180px]'
              }`}
              ref={locationRef}
            >
              <FaMapMarkerAlt className="text-gray-500 w-4 h-4 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setLocationOpen(true);
                }}
                onFocus={() => setLocationOpen(true)}
                placeholder="Search Location"
                className="w-full outline-none text-sm font-semibold text-gray-700"
              />
              {locationOpen && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg z-50 w-full max-h-48 overflow-y-auto">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setSearchQuery(loc);
                        setLocationOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-100 transition"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
              {locationOpen && filteredLocations.length === 0 && searchQuery && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg z-50 w-full p-4 text-sm text-gray-500">
                  No locations found
                </div>
              )}
            </div>

            {/* Check-in/out DatePicker */}
            <div
              className={`relative flex items-center border border-green-500 rounded-lg px-3 py-3 flex-1 ${
                isMobile ? 'w-full' : 'min-w-[180px] md:min-w-[220px]'
              }`}
              ref={calendarRef}
            >
              <FaCalendarAlt className="text-gray-500 w-4 h-4 mr-2" />
              <button
                type="button"
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="w-full text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, "dd MMM")} - ${format(dateRange.to, "dd MMM")}`
                  : "Check in – out"}
              </button>
              {calendarOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-50 shadow-2xl rounded-lg p-4 border border-gray-200 w-[min(600px,100vw)] z-[9999]">
                  <DatePicker
                    selected={dateRange.from}
                    onChange={(dates) => {
                      const [start, end] = dates;
                      setDateRange({ from: start, to: end });
                      if (start && end) setCalendarOpen(false);
                    }}
                    startDate={dateRange.from}
                    endDate={dateRange.to}
                    selectsRange
                    inline
                    monthsShown={2}
                    minDate={new Date()}
                    className="border-none bg-gray-50 text-gray-900"
                    calendarClassName="bg-gray-50 text-gray-900"
                    dayClassName={() => "text-gray-900 hover:bg-green-100"}
                    wrapperClassName="w-full"
                  />
                </div>
              )}
            </div>

            {/* Guests & Rooms */}
            <div
              className={`relative flex items-center border border-green-500 rounded-lg px-3 py-3 flex-1 ${
                isMobile ? 'w-full' : 'min-w-[150px] md:min-w-[190px]'
              }`}
              ref={guestsRef}
            >
              <FaUser className="text-gray-500 w-4 h-4 mr-2" />
              <button
                type="button"
                onClick={() => setGuestsOpen(!guestsOpen)}
                className="w-full text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                {adults} Adult{adults > 1 ? "s" : ""}, {children} Child, {rooms} rooms
              </button>
              {guestsOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg z-50 p-4 w-64">
                  {/* Adults */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 text-start w-1/2">Adults</span>
                    <div className="w-1/2 flex items-center space-x-3">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="p-2 rounded-full border text-white bg-green-600 hover:bg-green-700"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="text-sm w-5 text-gray-700 font-semibold">{adults}</span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="p-2 rounded-full border text-white bg-green-600 hover:bg-green-700"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 text-start w-1/2">Children</span>
                    <div className="flex items-center w-1/2 space-x-3">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="p-2 rounded-full border text-white bg-green-600 hover:bg-green-700"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="text-sm w-5 text-gray-700 font-semibold">{children}</span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="p-2 rounded-full border text-white bg-green-600 hover:bg-green-700"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-start w-1/2">Rooms</span>
                    <div className="flex items-center w-1/2 space-x-3">
                      <button
                        onClick={() => setRooms(Math.max(0, rooms - 1))}
                        className="p-2 rounded-full border text-white bg-green-600 hover:bg-green-700"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="text-sm w-5 text-gray-700 font-semibold">{rooms}</span>
                      <button
                        onClick={() => setRooms(rooms + 1)}
                        className="p-2 rounded-full border text-white bg-green-600 hover:bg-green-700"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button className="bg-green-600 text-sm font-medium hover:bg-green-700 text-white p-3 md:px-6 md:py-3 rounded-md flex items-center justify-center transition w-full md:w-auto">
              <FaSearch className="w-4 h-4 mr-2" />
              Search Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;