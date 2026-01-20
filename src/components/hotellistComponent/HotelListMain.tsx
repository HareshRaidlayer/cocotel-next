"use client";

import { useState } from "react";
import HotelFilterUI from "./HotelFilter";
import HotelCardBlock from "./HotelCardBlock";
import HotelCardRow from "./HotelCardRow";
import { Hotel } from "@/types/hotel";
import { useLocale } from '@/lib/locale-context';
import Header from "../common/Header";
import SubHeader from "../common/subHeaderSearch";
import { Star, MapPin, Coffee, ParkingCircle, TrendingUp, TrendingDown, Flame } from "lucide-react";


interface Props {
    hotels: Hotel[];
    sortOptions?: { label: string; value: string }[]; // Optional prop
}

export default function HotelListMain({ hotels, sortOptions }: Props) {
    const { t } = useLocale();
    const [view, setView] = useState<"card" | "list">("card");
    // const [selectedSort, setSelectedSort] = useState(sortOptions?.[0]?.value || "");
    const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);



    const options = [
        {
            label: "Popular",
            value: "popular",
            icon: Flame,
        },
        {
            label: "Top-rated",
            value: "topRated",
            icon: Star,
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

    const [selectedSort, setSelectedSort] = useState(options[0].value);
    const [open, setOpen] = useState(false);


    const getGallery = (index: number) => {
        const hotel = hotels[index];
        return hotel.gallery && hotel.gallery.length > 0
            ? hotel.gallery
            : [hotel.image];
    };
    const handleSortChange = (value: string) => {
        setSelectedSort(value);
        // Here you can implement sorting logic based on value
    };

    const openQuickView = (index: number) => {
        setQuickViewIndex(index);
        setCurrentSlide(0);
    };

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
            <Header />
            <SubHeader />
            {/* top header green section */}
            <section className="container mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-around bg-white border-b border-green-500 text-green-600 pt-0 md:pt-5 pb-5 px-2 lg:px-0">
                    <div className="flex items-start space-x-2 p-2 sm:p-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                            <path d="M10 4a1 1 0 011 1v6a1 1 0 11-2 0V5a1 1 0 011-1z" />
                        </svg>
                        <span className="text-sm font-semibold">{t('hero.feature1')}</span>
                    </div>
                    <div className="flex items-start space-x-2 p-2 sm:p-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 011 1v8a1 1 0 11-2 0V3a1 1 0 011-1zm5 5a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z" />
                        </svg>
                        <span className="text-sm font-semibold">{t('hero.feature2')}</span>
                    </div>
                    <div className="flex items-start space-x-2 p-2 sm:p-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9a1 1 0 100 2h6a1 1 0 100-2H7z" />
                        </svg>
                        <span className="text-sm font-semibold">{t('hero.feature3')}</span>
                    </div>
                    <div className="flex items-start space-x-2 p-2 sm:p-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12z" />
                        </svg>
                        <span className="text-sm font-semibold">{t('hero.feature4')}</span>
                    </div>
                </div>
            </section>

            <div className="bg-gray-50 min-h-screen py-8" >
                <div className="max-w-screen-2xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* FILTER (ONLY ONCE) */}
                    <HotelFilterUI />

                    {/* CONTENT */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-white mb-5 text-green-600 pt-5 pb-5 px-2 lg:px-0 gap-4">
                            {/* LEFT: VIEW TOGGLE */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setView("card")}
                                    className={`border px-3 py-2 rounded-md ${view === "card" ? "bg-green-600 text-white" : ""
                                        }`}
                                >
                                    ▦
                                </button>

                                <button
                                    onClick={() => setView("list")}
                                    className={`border px-3 py-2 rounded-md ${view === "list" ? "bg-green-600 text-white" : ""
                                        }`}
                                >
                                    ☰
                                </button>
                            </div>


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
                                                        setSelectedSort(opt.value);
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
                        {view === "card" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {/* {hotels.map((hotel) => (
                                    <HotelCardBlock key={hotel.id} hotel={hotel} />
                                ))} */}
                                {hotels.map((hotel, index) => (
                                    <HotelCardBlock
                                        key={hotel.id}
                                        hotel={hotel}
                                        onQuickView={() => openQuickView(index)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {hotels.map((hotel) => (
                                    <HotelCardRow key={hotel.id} hotel={hotel} />
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

                        <img
                            src={getGallery(quickViewIndex)[currentSlide]}
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

                            <img
                                key={i}
                                src={img}
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
