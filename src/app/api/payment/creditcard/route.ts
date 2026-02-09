import { NextResponse } from "next/server";
import { fetchFromAPI, submitBookingData } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { bookingid, tokenid, amount, currency, card_cvn, authid } = await req.json();

    if (!bookingid || !tokenid || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const externalId = `card_${Date.now()}_${bookingid.replace("BK-", "")}`;

    const payload = {
      token_id: tokenid,
      external_id: externalId,
      authentication_id: authid,
      amount: Math.round(Number(amount)),
      card_cvn: card_cvn,
      currency: currency || "PHP",
    };

    console.log("Xendit charge payload:", payload);

    const xenditRes = await fetch(
      "https://api.xendit.co/credit_card_charges",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(process.env.XENDIT_SECRET_KEY + ":").toString("base64"),
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await xenditRes.json();
    console.log("Xendit response:", result);

    if (result.status === "CAPTURED" || result.status === "VERIFIED") {
      const bookingRes = await fetchFromAPI<Record<string, unknown>[]>({
        appName: "app3534482538357",
        moduleName: "bookings",
        query: {
          "sectionData.bookings.booking_id": bookingid,
        },
        limit: 1,
      });

      if (bookingRes && bookingRes.length > 0) {
        const bookingDoc = bookingRes[0] as { _id: string; sectionData?: { bookings?: Record<string, unknown> }; companyId: string };
        const booking = bookingDoc?.sectionData?.bookings;

        if (booking) {
          booking.pay_status = "success";
          booking.transaction_id = result.id;

          await submitBookingData({
            appName: "app3534482538357",
            moduleName: "bookings",
            body: {
              _id: bookingDoc._id,
              sectionData: {
                bookings: booking
              },
              companyId: bookingDoc.companyId
            }
          });
        }
      }

      const changeStatusRes = await fetch(`/api/changestatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bid: bookingid, payment_type: "card" }),
      });

      const changeStatusResult = await changeStatusRes.json();

      return NextResponse.json({
        success: changeStatusResult.status === 1,
        status: result.status,
        transaction_id: result.id,
      });
    } else {
      return NextResponse.json(
        {
          error: result.failure_reason || "Payment failed",
          status: result.status,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Credit card payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
