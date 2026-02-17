"use client";

import { useState } from "react";
import HotelFilterUI from "./HotelFilter";
import Features from "@/app/[locale]/homeTwo/Features";
import HotelCardRow from "./HotelCardRow"
import { Filter, LayoutGrid, List, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { Hotel, AmenityApiItem, TagApiItem } from "@/types/hotel";


interface Props {
    hotels: Hotel[];
    amenities: AmenityApiItem[];
    tags: TagApiItem[];
    selectedAmenities: string[];
    selectedTags: string[];
    onAmenityChange: (ids: string[]) => void;
    onTagChange: (ids: string[]) => void;
    onPriceChange: (price: number) => void;
    onSortChange: (sort: string) => void;
    selectedSort: string;
    searchParams?: {
        checkin?: string | null;
        checkout?: string | null;
        rooms?: string | null;
        adults?: string | null;
        children?: string | null;
    };
}

export default function HotelListMain({
    hotels,
    amenities,
    tags,
    selectedAmenities,
    selectedTags,
    onAmenityChange,
    onTagChange,
    onPriceChange,
    onSortChange,
    selectedSort,
    searchParams
}: Props) {
    const [view, setView] = useState<"card" | "list">("card");
    const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const options = [
        {
            label: "Default",
            value: "default",
            icon: List,
        },
        {
            label: "Price (Highest first)",
            value: "priceHigh",
            icon: TrendingUp,
        },
        {
            label: "Price (Lowest first)",
            value: "priceLow",
            icon: TrendingDown,
        },
    ];

    const [open, setOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const filteredHotels = hotels;
    const showNoResults = filteredHotels.length === 0;

    // console.log('HotelListMain - Hotels received:', hotels.length, 'Hotels:', hotels.map(h => h.name));


    const getGallery = (index: number) => {
        const hotel = filteredHotels[index];
        return hotel.gallery && hotel.gallery.length > 0
            ? hotel.gallery
            : [hotel.image];
    };
    // const handleSortChange = (value: string) => {
    //     setSelectedSort(value);

    // };

    // const openQuickView = (index: number) => {
    //     setQuickViewIndex(index);
    //     setCurrentSlide(0);
    // };

    const closeQuickView = () => {
        setQuickViewIndex(null);
    };

    const quickPrev = () => {
        if (quickViewIndex === null) return;
        const gallery = getGallery(quickViewIndex);

        setCurrentSlide((prev) =>
            prev > 0 ? prev - 1 : gallery.length - 1
        );
    };


    const quickNext = () => {
        if (quickViewIndex === null) return;
        const gallery = getGallery(quickViewIndex);

        setCurrentSlide((prev) =>
            prev < gallery.length - 1 ? prev + 1 : 0
        );
    };


    return (
        <div>
            <div className="bg-gray-50 min-h-screen py-8" >
                <div className="max-w-screen-2xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* FILTER (ONLY ONCE) */}
                    <div className="hidden lg:block">
                        <HotelFilterUI
                            amenities={amenities}
                            tags={tags}
                            selectedAmenities={selectedAmenities}
                            selectedTags={selectedTags}
                            onAmenityChange={onAmenityChange}
                            onTagChange={onTagChange}
                            onPriceChange={onPriceChange}
                        />
                    </div>

                    {/* Mobile Filter Sidebar */}
                    {filterOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setFilterOpen(false)} />
                            <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                                <div className="p-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Filters</h2>
                                        <button onClick={() => setFilterOpen(false)} className="text-2xl">&times;</button>
                                    </div>
                                </div>
                                <HotelFilterUI
                                    amenities={amenities}
                                    tags={tags}
                                    selectedAmenities={selectedAmenities}
                                    selectedTags={selectedTags}
                                    onAmenityChange={onAmenityChange}
                                    onTagChange={onTagChange}
                                    onPriceChange={onPriceChange}
                                />

                            </div>
                        </div>
                    )}

                    {/* CONTENT */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-white mb-5 text-green-600 pt-5 pb-5 px-2 lg:px-0 gap-4">
                            {/* LEFT: VIEW TOGGLE & FILTER BUTTON */}
                            <div className="flex gap-2">
                                {/* Filters button (mobile) */}
                                <button
                                    onClick={() => setFilterOpen(true)}
                                    className="
      lg:hidden
      flex items-center justify-center gap-2
      border
      px-4 py-2.5
      rounded-md
      bg-green-600
      text-white
      text-sm
      shadow-sm
      hover:bg-green-700
      active:scale-95
    "
                                >
                                    <Filter size={18} />
                                    <span className="hidden sm:inline">Filters</span>
                                </button>

                                {/* Card View */}
                                <button
                                    onClick={() => setView("card")}
                                    className={`
      hidden md:flex
      items-center justify-center
      border
      w-10 h-10
      rounded-md
      transition
      ${view === "card" ? "bg-green-600 text-white" : "bg-white text-gray-700"}
      hover:bg-green-50
    `}
                                    aria-label="Card view"
                                >
                                    <LayoutGrid size={20} />
                                </button>

                                {/* List View */}
                                <button
                                    onClick={() => setView("list")}
                                    className={`
      hidden md:flex
      items-center justify-center
      border
      w-10 h-10
      rounded-md
      transition
      ${view === "list" ? "bg-green-600 text-white" : "bg-white text-gray-700"}
      hover:bg-green-50
    `}
                                    aria-label="List view"
                                >
                                    <List size={20} />
                                </button>
                            </div>

                            {/* <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterOpen(true)}
                                    className="lg:hidden border px-3 py-2 rounded-md bg-green-600 text-white"
                                >
                                    🔍 Filters
                                </button>
                                <button
                                    onClick={() => setView("card")}
                                    className={`border hidden md:block px-3 py-2 rounded-md ${view === "card" ? "bg-green-600 text-white" : ""
                                        }`}
                                >
                                    ▦
                                </button>

                                <button
                                    onClick={() => setView("list")}
                                    className={`border hidden md:block px-3 py-2 rounded-md ${view === "list" ? "bg-green-600 text-white" : ""
                                        }`}
                                >
                                    ☰
                                </button>
                            </div> */}


                            {/* CENTER: TITLE */}
                            <div className="flex-1 text-center">
                                <h1 className="text-2xl font-semibold text-green-700">
                                    Top-rated hotels & places to stay in the Philippines
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Refine the results by using the filters
                                </p>
                            </div>


                            {/* RIGHT: SORT */}
                            {/* <div className="flex justify-end relative">
                                <select
                                    className="border px-4 py-2 rounded-md bg-white shadow-sm"
                                    value={selectedSort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                >
                                    {options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div> */}

                            <div className="relative">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center justify-between gap-2 border px-4 py-2 rounded-md bg-white shadow-sm w-56"
                                >
                                    {(() => {
                                        const active = options.find(o => o.value === selectedSort);
                                        const Icon = active?.icon;
                                        return (
                                            <div className="flex items-center gap-2">
                                                {Icon && <Icon size={16} />}
                                                <span>{active?.label}</span>
                                            </div>
                                        );
                                    })()}
                                    <span className="text-gray-400">▾</span>
                                </button>

                                {open && (
                                    <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-56 z-50">
                                        {options.map(opt => {
                                            const Icon = opt.icon;
                                            return (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => {
                                                        onSortChange(opt.value);
                                                        setOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <Icon size={16} />
                                                    <span>{opt.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>



                        </div>


                        {/* VIEW CONTENT */}
                        {showNoResults ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels found</h3>
                                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                            </div>
                        ) : view === "card" ? (
                            <Features
                                tours={filteredHotels.map(hotel => ({
                                    title: hotel.name,
                                    city: hotel.location.split(',')[0] || hotel.location,
                                    country: "PH",
                                    src: hotel.gallery && hotel.gallery.length > 0
                                        ? hotel.gallery.filter(img => img && img.trim() && img !== 'null' && img !== 'undefined')
                                        : [],
                                    primaryImage: hotel.image && hotel.image.trim() && hotel.image !== 'null' && hotel.image !== 'undefined'
                                        ? hotel.image
                                        : "/images/defualtimg.webp",
                                    price: String(hotel.price || 0),
                                    originalPrice: "500",
                                    discount: hotel.discount || "15% OFF",
                                    category: hotel.category || "Hotel",
                                    slug: hotel.slug || ""
                                }))}
                                title=""
                                subtitle=""
                                currencySymbol="PHP"
                                gridCols="xl:grid-cols-3"
                                searchParams={searchParams}
                            />
                        ) : (
                            <div className="space-y-4">
                                {filteredHotels.map((hotel) => (
                                    <HotelCardRow
                                        key={hotel.id}
                                        hotel={{
                                            ...hotel,
                                            images: hotel.image ? [hotel.image] : [],
                                            amenities: undefined
                                        }}
                                        searchParams={searchParams}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {quickViewIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
                    <button
                        className="absolute top-4 right-4 text-white text-3xl"
                        onClick={closeQuickView}
                    >
                        &times;
                    </button>

                    <div className="relative flex items-center justify-center w-full px-8">
                        <button
                            className="absolute left-4 text-white text-4xl bg-black/50 rounded-full p-2"
                            onClick={quickPrev}
                        >
                            &#10094;
                        </button>

                        <Image
                            src={getGallery(quickViewIndex)[currentSlide]}
                            alt="Hotel gallery image"
                            width={800}
                            height={600}
                            className="max-h-[80vh] object-contain"
                        />

                        <button
                            className="absolute right-4 text-white text-4xl bg-black/50 rounded-full p-2"
                            onClick={quickNext}
                        >
                            &#10095;
                        </button>
                    </div>

                    <div className="flex gap-2 mt-4 overflow-x-auto px-4">
                        {getGallery(quickViewIndex).map((img, i) => (

                            <Image
                                key={i}
                                src={img}
                                alt={`Hotel gallery thumbnail ${i + 1}`}
                                width={80}
                                height={80}
                                className={`h-20 cursor-pointer border rounded ${currentSlide === i ? "border-green-500" : "border-gray-300"
                                    }`}
                                onClick={() => setCurrentSlide(i)}
                            />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
