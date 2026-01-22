// app/page.tsx
import Image from "next/image";
import { Star, Wifi, ParkingCircle, Utensils, Dumbbell, CigaretteOff, Users, BedDouble, MapPin, ChevronRight, ShieldCheck } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "../[locale]/Footer";

export default function HotelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hotel Title & Rating */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Belmont Hotel Manila</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-semibold">8.4</span>
            <span className="text-gray-600">• Very good • 5,446 reviews</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span>5.7 miles (9.1 km) from downtown Manila • Newport City, Pasay</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
          {/* Main big photo */}
          <div className="md:col-span-2 row-span-2 relative h-80 md:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
              alt="Hotel view"
              fill
              className="object-cover"
            />
          </div>
          {/* Small photos */}
          <div className="relative h-40 md:h-60">
            <Image
              src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
              alt="Room"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-40 md:h-60">
            <Image
              src="https://images.unsplash.com/photo-1578683015146-bda8d4e92bfe?w=800"
              alt="Bedroom"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-40 md:h-60">
            <Image
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
              alt="Bathroom"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-40 md:h-60">
            <Image
              src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
              alt="View"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Summary & Quick Info */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left - Description & Summary */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Relax and recharge at this superb 4-star hotel</h2>
              <p className="text-gray-700 leading-relaxed">
                Belmont Hotel Manila, a great place to stay in Manila, the Philippines! This superb 4-star hotel is located 5.7 miles (9.1 km) from the downtown area of Manila. Previous guests of the hotel have rated their stay an average of 8.4 out of 10 in 5,349 reviews.
              </p>
              <button className="text-blue-600 font-medium mt-2 hover:underline">Read more</button>
            </section>

            {/* Rooms Grid */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Rooms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Corner Room", size: "23m²/247 ft² • 2 persons", beds: "1 King-size bed" },
                  { name: "Rooftop Premier Twin Room with Pool Access", size: "23m²/247 ft² • 2 persons", beds: "2 Single beds" },
                  { name: "Rooftop Premier Queen Room with Pool Access", size: "23m²/247 ft² • 2 persons", beds: "1 Queen bed" },
                  { name: "Connecting Family Room", size: "46m²/495 ft² • Family", beds: "1 King + 1 Single" },
                  { name: "Standard Twin Room", size: "23m²/247 ft² • 2 persons", beds: "2 Single beds" },
                ].map((room, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                    <div className="relative h-48">
                      <Image
                        src={`https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80`}
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{room.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{room.size}</p>
                      <p className="text-sm text-gray-500">{room.beds}</p>
                      <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                        See details & prices →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Facilities */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Popular facilities & amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { icon: Dumbbell, label: "Fitness" },
                  { icon: Utensils, label: "Restaurant" },
                  { icon: Wifi, label: "Free Wi-Fi" },
                  { icon: ParkingCircle, label: "Parking" },
                  { icon: CigaretteOff, label: "Non-smoking rooms" },
                  { icon: BedDouble, label: "Family rooms" },
                  { icon: ShieldCheck, label: "24-hour front desk" },
                  { icon: Users, label: "Concierge" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-6 h-6 text-blue-600" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar - Booking / Info Card (sticky on desktop) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border sticky top-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600">8.4</div>
                <div className="text-sm text-gray-600">Very good • 5,446 reviews</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Category</span>
                  <span className="font-medium">5-star hotel</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Location</span>
                  <span className="font-medium">5.7 mi from center</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Breakfast</span>
                  <span className="font-medium">Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Parking</span>
                  <span className="font-medium text-green-600">Available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Wi-Fi</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                Check availability →
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                You&apos;ll be redirected to secure booking
              </p>
            </div>

            {/* Small verified reviews preview */}
            <div className="bg-white p-5 rounded-xl shadow border">
              <h3 className="font-semibold mb-3">Verified reviews</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Joanne • Family</p>
                  <p className="text-gray-700">Perfect! Very close to terminal 3, no need to rush...</p>
                </div>
                <div>
                  <p className="font-medium">Kimberly • Couple</p>
                  <p className="text-gray-700">Just right across Terminal 3. Very convenient...</p>
                </div>
              </div>
              <button className="text-blue-600 text-sm mt-2 hover:underline">
                See all 5,446 reviews →
              </button>
            </div>
          </div>
        </div>
      </main>

     
    </div>
  );
}