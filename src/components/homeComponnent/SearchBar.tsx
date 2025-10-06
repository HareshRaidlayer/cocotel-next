"use client";

import React, { useState, useEffect, useRef } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Image from "next/image";
import { addDays, format } from "date-fns";
import { FiSearch, FiCalendar, FiUsers } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { apiGetData } from "@/lib/api";

// Define the interface for the raw data from the API
interface RawSearchHotel {
  _id: string;
  slug: string;
  name: string;
}

// Define the interface for the mapped data used in the component's state
interface MappedSearchHotel {
  id: string;
  slug: string;
  title: string;
}

const SearchBox = () => {
  const [location, setLocation] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchDetails, setSearchDetails] = useState<MappedSearchHotel[]>([]);
  const [adults, setAdults] = useState(1);
  const [child, setChild] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const locationRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchHotels() {
      try {
        // Assert the data type here
        const data: RawSearchHotel[] = await apiGetData({
          dbName: "hanahotelnew",
          collectionName: "company",
          query: { "sectionData.Company.is_deleted": false },
          projection: {
            _id: "$_id",
            slug: "$sectionData.Company.slug",
            name: "$sectionData.Company.name",
          },
          cacheKey: "search-hotels",
        });

        const mappedHotels = data.map((hotel) => ({
          id: hotel._id,
          slug: hotel.slug,
          title: hotel.name || "Unknown Hotel",
        }));

        setSearchDetails(mappedHotels);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      }
    }
    fetchHotels();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (locationRef.current && !locationRef.current.contains(target)) {
        setShowLocationDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        setShowDatePicker(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(target)) {
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlug) {
      alert("Please select a location.");
      return;
    }

    // Format dates for URL (e.g., DD-MM-YYYY)
    const formattedCheckIn = format(state[0].startDate, "dd-MM-yyyy");
    const formattedCheckOut = format(state[0].endDate, "dd-MM-yyyy");

    // Construct the URL with query parameters for /explore
    const queryParams = new URLSearchParams({
      slug: selectedSlug,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      adults: adults.toString(),
      rooms: rooms.toString(),
      child: child.toString(),
    }).toString();

    const url = `/explore?${queryParams}`;

    // Redirect to the /explore route
    router.push(url);

    console.log("Guests:", adults, "Child:", child, "Rooms:", rooms);
  };

  const filteredLocations =
    location.trim() === ""
      ? searchDetails
      : searchDetails.filter((loc) =>
          loc.title.toLowerCase().includes(location.toLowerCase())
        );

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 custom-margin">
      <form
        onSubmit={handleSearch}
        className="search-hotel-form bg-white/90 backdrop-blur-md flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4"
      >
        {/* Location */}
        <div className="ms-0 lg:ms-3 flex-1 relative w-full lg:w-auto" ref={locationRef}>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowLocationDropdown(true);
            }}
            onFocus={() => {
              setShowLocationDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="text-sm text-black font-medium w-full p-2 cursor-pointer rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 pl-8 placeholder-black"
          />
          <Image
            src="/images/location.svg"
            alt="Location"
            width={14}
            height={14}
            className="object-cover absolute left-2 top-2.5 text-green-600"
            priority
          />
          {showLocationDropdown && filteredLocations.length > 0 && (
            <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredLocations.map((loc) => (
                <li
                  key={loc.id}
                  onClick={() => {
                    setLocation(loc.title);
                    setSelectedSlug(loc.slug);
                    setShowLocationDropdown(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                >
                  {loc.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date Range */}
        <div className="flex-1 relative w-full lg-w-auto" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full text-sm p-2 cursor-pointer rounded-md text-left focus:outline-none focus:ring-1 focus:ring-green-500 pl-8"
          >
            <span className="text-black font-medium">
              {`${format(state[0].startDate, "dd MMM yyyy")} - ${format(
                state[0].endDate,
                "dd MMM yyyy"
              )}`}
            </span>
            <FiCalendar className="absolute left-2 top-2.5 text-green-600" />
          </button>
          {showDatePicker && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  const { startDate, endDate } = item.selection;
                  setState([
                    {
                      startDate: startDate || new Date(),
                      endDate: endDate || new Date(),
                      key: "selection",
                    },
                  ]);
                  if (
                    startDate &&
                    endDate &&
                    startDate.getTime() !== endDate.getTime()
                  ) {
                    setShowDatePicker(false);
                  }
                }}
                moveRangeOnFirstSelection={false}
                ranges={state}
                minDate={new Date()}
                className="p-4"
              />
            </div>
          )}
        </div>

        {/* Guests and Rooms */}
        <div className="relative flex-1 w-full lg-w-auto" ref={guestsRef}>
          <button
            type="button"
            onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
            className="w-full cursor-pointer text-sm text-black font-medium p-2 rounded-md text-left focus:outline-none focus:ring-1 focus:ring-green-500 pl-8"
          >
            <span>{`${adults} Adults - ${child} Child - ${rooms} Room`}</span>
            <FiUsers className="absolute left-2 top-2.5 text-green-600" />
          </button>
          {showGuestsDropdown && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span>Adults</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 bg-gray-200 text-green-600 rounded-full font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 bg-gray-200 text-green-600 rounded-full font-bold hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span>Child</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setChild(Math.max(0, child - 1))}
                      className="w-8 h-8 bg-gray-200 text-green-600 rounded-full font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{child}</span>
                    <button
                      type="button"
                      onClick={() => setChild(child + 1)}
                      className="w-8 h-8 bg-gray-200 text-green-600 rounded-full font-bold hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rooms</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className="w-8 h-8 bg-gray-200 text-green-600 rounded-full font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{rooms}</span>
                    <button
                      type="button"
                      onClick={() => setRooms(rooms + 1)}
                      className="w-8 h-8 bg-gray-200 text-green-600 rounded-full font-bold hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuestsDropdown(false)}
                  className="w-full mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-[#4CAA42] text-white p-3 rounded-full w-full lg:w-auto h-[50px] lg:h-[90px] px-8 hover:bg-green-600 transition"
        >
          <FiSearch className="inline mr-2" /> Search
        </button>
      </form>
    </div>
  );
};

export default SearchBox;