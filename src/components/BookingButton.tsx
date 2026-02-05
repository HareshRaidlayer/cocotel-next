"use client";

import { useState } from "react";
import Swal from "sweetalert2";

interface BookingButtonProps {
  hotelId: string;
  roomId: string;
  className?: string;
  children: React.ReactNode;
  onBookingSuccess?: () => void; // Callback when room is available
}

export default function BookingButton({
  hotelId,
  roomId,
  className = "",
  children,
  onBookingSuccess
}: BookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    // Get booking details from form or use defaults
    const checkinInput = document.getElementById('checkin') as HTMLInputElement;
    const checkoutInput = document.getElementById('checkout') as HTMLInputElement;
    const guestsInput = document.getElementById('guests') as HTMLInputElement;
    const childrenInput = document.getElementById('children') as HTMLInputElement;

    // Use defaults if inputs not found
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const checkin = checkinInput?.value || today;
    const checkout = checkoutInput?.value || tomorrow;
    const guests = guestsInput?.value || '1';
    const children = childrenInput?.value || '0';

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkin,
          checkout,
          hotelid: hotelId,
          roomid: roomId,
          noofguest: parseInt(guests),
          noofchild: parseInt(children),
          noofroom: 1
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Room is available, call the original booking function
        if (onBookingSuccess) {
          onBookingSuccess();
        }
      } else {
        // Show error message
        // setError(result.error || "Room not available");
        setError(result.message || result.error || "Room not available");

        let title = result.error || "Error";
        const  text = result.message || "Something went wrong. Please try again.";

        if (result.type === "availability") {
          title = "Room Not Available";
        }

        if (result.type === "date_error") {
          title = "Invalid Dates";
        }

        Swal.fire({
          icon: "warning",
          title,
          text,
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Something went wrong. Please try again.");

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleBooking}
        disabled={loading}
        className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Checking...' : children}
      </button>
      {error && (
        <div className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}