"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BookingData {
  booking_id: string;
  transaction_id: string;
  hotel_name: string;
  hotel_code: string;
  room_type_name: string;
  room_type_code: string;
  is_breakfast: boolean;
  booking_date: string;
  no_of_days: number;
  no_of_guests: number;
  no_of_rooms: number;
  amount: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  updated_at: string;
}

export default function CardInvoicePage() {
  const params = useParams();
  const bookingId = params?.bookingId as string;
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/booking/${bookingId}`);
        const data = await res.json();
        if (data.success) {
          setBookingData(data.booking);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    window.location.href = `/email?booking_id=${bookingId}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!bookingData) {
    return <div className="min-h-screen flex items-center justify-center">Booking not found</div>;
  }

  const departureDate = new Date(bookingData.booking_date);
  departureDate.setDate(departureDate.getDate() + bookingData.no_of_days);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Cocotel" width="200" />
          <div className="text-center">
            <button onClick={handleEmail} className="bg-green-600 text-white px-4 py-2 rounded mr-2">
              Email
            </button>
            <button onClick={handlePrint} className="bg-green-600 text-white px-4 py-2 rounded">
              Print
            </button>
            <h1 className="text-3xl font-bold text-blue-600 mt-4">Hotel Voucher</h1>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="bg-green-600 text-white text-xl p-2 mb-4">Your Booking Confirmation</h2>
          <h3 className="text-lg mb-2">
            Dear {bookingData.first_name} {bookingData.last_name},
          </h3>
          <p>Thank you for booking your hotel with Cocotel.</p>
          <p className="font-bold">Your itinerary booking number is: {bookingData.booking_id}</p>
          <p className="mt-2">
            If any issues arise with your reservation before and during your trip, please contact us immediately
          </p>
        </div>

        <div className="mb-6">
          <h2 className="bg-green-600 text-white text-xl p-2 mb-4">Your Booking Details</h2>
          <table className="w-full border border-gray-300">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-bold">Transaction Number</td>
                <td className="p-2">{bookingData.transaction_id}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">Hotel Name</td>
                <td className="p-2">{bookingData.hotel_name} ({bookingData.hotel_code})</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">Room Name</td>
                <td className="p-2">{bookingData.room_type_name} ({bookingData.room_type_code})</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">With Breakfast</td>
                <td className="p-2">{bookingData.is_breakfast ? "Yes" : "No"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">Booking Date</td>
                <td className="p-2">{new Date(bookingData.updated_at).toLocaleDateString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">Arrival Date</td>
                <td className="p-2">{bookingData.booking_date}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">Departure Time</td>
                <td className="p-2">{departureDate.toISOString().split('T')[0]}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">Total Days</td>
                <td className="p-2">{bookingData.no_of_days}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">Total Guests</td>
                <td className="p-2">{bookingData.no_of_guests}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-bold">Rooms</td>
                <td className="p-2">{bookingData.no_of_rooms}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Total Price</td>
                <td className="p-2">₱{bookingData.amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-400">
                <th className="p-2 text-left" colSpan={3}>Booking Reference Number</th>
              </tr>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Mobile Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">{bookingData.first_name} {bookingData.last_name}</td>
                <td className="p-2">{bookingData.email}</td>
                <td className="p-2">{bookingData.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
