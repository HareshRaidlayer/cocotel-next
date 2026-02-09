"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function GCashForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const processPayment = async () => {
      const bookingid = searchParams?.get("bookingid");
      const amount = searchParams?.get("amount");

      if (!bookingid || !amount) {
        setError("Missing booking information");
        return;
      }

      try {
        const response = await fetch("/api/payment/gcash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingid })
        });

        const result = await response.json();

        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        } else {
          setError(result.error || "Failed to process payment");
        }
      } catch (err) {
        console.error("Payment error:", err);
        setError("Failed to process payment. Please try again.");
      }
    };

    processPayment();
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h1>
        <p className="text-gray-600">Redirecting to GCash...</p>
      </div>
    </div>
  );
}

export default function GCashPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GCashForm />
    </Suspense>
  );
}
