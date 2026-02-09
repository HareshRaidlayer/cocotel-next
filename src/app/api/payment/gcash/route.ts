import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { bookingid } = await req.json();

    if (!bookingid) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch booking from DB
    const bookingRes = await fetchFromAPI<Record<string, unknown>[]>({
      appName: "app3534482538357",
      moduleName: "bookings",
      query: {
        "sectionData.bookings.booking_id": bookingid,
      },
      limit: 1,
    });

    if (!bookingRes || bookingRes.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingDoc = bookingRes[0] as { _id: string; sectionData?: { bookings?: Record<string, unknown> }; companyId: string };
    const booking = bookingDoc?.sectionData?.bookings;

    if (!booking) {
      console.error('Booking structure:', bookingDoc);
      return NextResponse.json(
        { error: "Invalid booking data" },
        { status: 500 }
      );
    }

    // 2️⃣ Trusted amount from DB
    const amount = Math.round(Number(booking.amount));

    // Optional: country logic (if needed later)
    // const countryId = booking.country_id;

    // 3️⃣ Xendit payload
    const payload = {
      reference_id: bookingid,
      currency: "PHP",
      amount,
      checkout_method: "ONE_TIME_PAYMENT",
      channel_code: "PH_GCASH",
      //callback_url: "/gcpaymentfail/${bookingid}",
      //  callback_url:"https://crmapi.conscor.com/api/v1/dynamic/app5288280373534/1733314649460",
      callback_url: `${process.env.BASE_URL_API}/gcashredirect?bookingid=${bookingid}`,
      channel_properties: {
        success_redirect_url: `${process.env.BASE_URL_API}/gcashredirect?bookingid=${bookingid}`,
        failure_redirect_url: `${process.env.BASE_URL_API}/gcpaymentfail/${bookingid}`,
      },
      metadata: {
        hotel_id: booking.hotel_id,
        room_type_id: booking.room_type_id,
      },
    };

    // 4️⃣ Call Xendit
    const xenditRes = await fetch(
      "https://api.xendit.co/ewallets/charges",
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

    if (!result.actions?.desktop_web_checkout_url) {
      return NextResponse.json(
        { error: "GCash charge failed", result },
        { status: 500 }
      );
    }

    // 5️⃣ Return checkout URL
    return NextResponse.json({
      checkoutUrl: result.actions.desktop_web_checkout_url,
    });
  } catch (error) {
    console.error("GCash API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
