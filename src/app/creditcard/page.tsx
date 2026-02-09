"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    Xendit: {
      setPublishableKey: (key: string) => void;
      card: {
        createToken: (data: unknown, callback: (err: unknown, token: unknown) => void) => void;
      };
    };
  }
}

function CreditCardForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [xenditLoaded, setXenditLoaded] = useState(false);

  const bookingid = searchParams?.get("bookingid");
  const amount = searchParams?.get("amount");

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardExpMonth: "",
    cardExpYear: "",
    cardCvn: "",
  });

  useEffect(() => {
    if (!bookingid || !amount) {
      setError("Missing booking information");
    }
  }, [bookingid, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!xenditLoaded) {
      setError("Payment system not loaded. Please refresh the page.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      window.Xendit.setPublishableKey(process.env.NEXT_PUBLIC_XENDIT_PUBLIC_KEY || "");

      const tokenData = {
        amount: Math.round(Number(amount)),
        card_number: formData.cardNumber.replace(/\s/g, ""),
        card_exp_month: formData.cardExpMonth,
        card_exp_year: formData.cardExpYear,
        card_cvn: formData.cardCvn,
        is_multiple_use: false,
        should_authenticate: true,
        currency: "PHP",
      };

      window.Xendit.card.createToken(tokenData, async (err: unknown, tokenResponse: unknown) => {
        const token = tokenResponse as Record<string, unknown>;
        if (err) {
          setError((err as Error).message || "Card validation failed");
          setLoading(false);
          return;
        }

        if (token.status === "CAPTURED" || token.status === "VERIFIED") {
          const response = await fetch("/api/payment/creditcard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingid,
              tokenid: token.id,
              amount: Number(amount),
              currency: "PHP",
              card_cvn: formData.cardCvn,
              authid: token.authentication_id as string,
            }),
          });

          const result = await response.json();

          if (result.success) {
            router.push(`/cardinvoice/${bookingid}`);
          } else {
            setError(result.error || "Payment failed");
          }
        } else if (token.status === "IN_REVIEW") {
          window.open(token.payer_authentication_url as string, "_blank");
          setError("Please complete 3DS verification in the new window");
        } else {
          setError(`${token.status}: ${(token.failure_reason as string) || "Card verification failed"}`);
        }

        setLoading(false);
      });
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment processing failed");
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim().substring(0, 19);
  };

  if (error && !bookingid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
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
    <>
      <Script
        src="https://js.xendit.co/v1/xendit.min.js"
        onLoad={() => setXenditLoaded(true)}
      />
      
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Credit Card Payment</h1>
            
            <div className="mb-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Booking ID: <span className="font-semibold">{bookingid}</span></p>
              <p className="text-lg font-bold text-gray-800 mt-2">Amount: ₱{Number(amount).toLocaleString()}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border rounded px-3 py-2"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardExpMonth}
                    onChange={(e) => setFormData({ ...formData, cardExpMonth: e.target.value.replace(/\D/g, "").substring(0, 2) })}
                    placeholder="MM"
                    className="w-full border rounded px-3 py-2"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardExpYear}
                    onChange={(e) => setFormData({ ...formData, cardExpYear: e.target.value.replace(/\D/g, "").substring(0, 4) })}
                    placeholder="YYYY"
                    className="w-full border rounded px-3 py-2"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardCvn}
                    onChange={(e) => setFormData({ ...formData, cardCvn: e.target.value.replace(/\D/g, "").substring(0, 4) })}
                    placeholder="123"
                    className="w-full border rounded px-3 py-2"
                    maxLength={4}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !xenditLoaded}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


export default function CreditCardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CreditCardForm />
    </Suspense>
  );
}
