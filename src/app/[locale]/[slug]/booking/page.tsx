"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import SearchSubHeader from "@/components/common/subHeaderSearch";
import { useSearchParams, useRouter } from "next/navigation";

/* ===================== MODAL (UNCHANGED) ===================== */
function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4">Traveller Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input placeholder="First Name" className="border rounded px-3 py-2" />
          <input placeholder="Last Name" className="border rounded px-3 py-2" />
          <input placeholder="Email" className="border rounded px-3 py-2" />
          <input placeholder="Phone" className="border rounded px-3 py-2" />
        </div>

        <div className="mt-6 text-center">
          <button className="bg-green-600 text-white px-6 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== PAGE ===================== */
export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     if (searchParams.get("openModal")) setShowModal(true);
//   }, [searchParams]);

useEffect(() => {
  const openModal = searchParams?.get("openModal");
  if (openModal) {
    setShowModal(true);
  }
}, [searchParams]);


  const handleClose = () => {
    setShowModal(false);
    router.replace(window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Header />
      <SearchSubHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <h1 className="text-3xl font-bold">Order details</h1>
        <p className="text-gray-600 mt-1">
          This details to send e-ticket and refund or reschedule needs
        </p>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* CUSTOMER INFO */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="First Name" className="border rounded px-3 py-2" />
                <input placeholder="Last Name" className="border rounded px-3 py-2" />
                <input placeholder="Phone" className="border rounded px-3 py-2 md:col-span-2" />
                <input placeholder="Email Address" className="border rounded px-3 py-2 md:col-span-2" />
              </div>
            </div>

            {/* ROOM DETAILS */}
            <div className="bg-white rounded-lg shadow p-6 border border-red-500">
              <h2 className="text-2xl font-bold">TRIPLE DELUXE ROOM</h2>

              <ul className="list-disc pl-5 text-sm text-gray-700 mt-4 space-y-1">
                <li>Room with 1 Double Bed and 1 Single Bed</li>
                <li>Good for 3 adults and 1 kid below 5 years old</li>
                <li>Extra person: Php500 (no mattress)</li>
                <li>Room size: 27 sqm</li>
                <li>Air-conditioned room</li>
                <li>Television</li>
                <li>Private bathroom</li>
                <li>Bath Towels</li>
                <li>Basic Toiletries: Shampoo, body wash</li>
              </ul>

              <div className="flex justify-between border-t mt-6 pt-4 text-sm">
                <span>Guest : <strong>2</strong></span>
                <span>Rooms : <strong>1</strong></span>
              </div>
            </div>

            {/* PAYMENT SUMMARY */}
            <div className="bg-white rounded-lg shadow p-6 border border-green-500">
              <h2 className="text-2xl font-bold">Total Payment Summary</h2>

              <div className="mt-4 text-green-600 text-3xl font-bold">
                ₱ 6042.99
              </div>
              <p className="text-sm text-gray-500">Incl. of all taxes</p>

              <div className="flex gap-4 mt-4">
                <input
                  placeholder="PROMO CODE"
                  className="border rounded px-3 py-2 flex-1"
                />
                <button className="bg-green-600 text-white px-6 rounded">
                  Apply Promo Code
                </button>
              </div>

              <div className="mt-6 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>03-Feb-2026</span>
                  <span>₱ 5833</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Gateway Charges</span>
                  <span>₱ 209.99</span>
                </div>
                <div className="flex justify-between font-bold text-green-700 border-t pt-3">
                  <span>Total Payment</span>
                  <span>₱ 6042.99</span>
                </div>
              </div>
            </div>

            {/* REFUNDABLE */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Refundable Booking</h2>

              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
                <input type="radio" name="refund" defaultChecked />
                <div>
                  <p className="font-semibold">Refundable Booking</p>
                  <p className="text-sm text-gray-500">
                    Added Fee to Room Price
                  </p>
                </div>
                <span className="ml-auto font-bold">$0.0</span>
              </label>

              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer mt-3">
                <input type="radio" name="refund" />
                <p className="font-semibold">Non-refundable Booking</p>
              </label>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>

              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
                <input type="radio" name="pay" defaultChecked />
                <p className="font-semibold">Credit / Debit Card</p>
              </label>

              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer mt-3">
                <input type="radio" name="pay" />
                <p className="font-semibold">GCash</p>
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="bg-white rounded-lg shadow p-6 h-fit sticky top-6">
            <h3 className="font-bold text-lg">
              RSAM Beach Resort by Cocotel
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Tue, 03 February 2026 – Wed, 04 February 2026
            </p>

            <div className="text-sm text-gray-600 mt-3">
              Nights: 1 &nbsp; Bed: 1
            </div>

            <div className="mt-4 text-red-500 text-xl font-bold">
              ₱ 6042.99
            </div>
          </aside>
        </div>
      </main>

      <BookingModal open={showModal} onClose={handleClose} />
    </div>
  );
}
