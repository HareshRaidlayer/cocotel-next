import { NextResponse } from "next/server";
import { fetchFromAPI, submitBookingData } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingid = searchParams.get("bookingid");
    const status = searchParams.get("status");

    console.log("GCash redirect - bookingid:", bookingid, "status:", status);

    if (!bookingid) {
      return NextResponse.redirect(`/`);
    }

    const bookingRes = await fetchFromAPI<Record<string, unknown>[]>({
      appName: "app3534482538357",
      moduleName: "bookings",
      query: {
        "sectionData.bookings.booking_id": bookingid,
      },
      limit: 1,
    });

    if (!bookingRes || bookingRes.length === 0) {
      return NextResponse.redirect(`/`);
    }

    const bookingDoc = bookingRes[0] as { _id: string; sectionData?: { bookings?: Record<string, unknown> }; companyId: string };
    const booking = bookingDoc?.sectionData?.bookings;

    if (!booking) {
      return NextResponse.redirect(`/`);
    }

    if (status === "FAILED") {
      booking.pay_status = "Failed";
      await submitBookingData({
        appName: "app3534482538357",
        moduleName: "bookings",
        body: {
          _id: bookingDoc._id,
          sectionData: { bookings: booking },
          companyId: bookingDoc.companyId,
        },
      });
      return NextResponse.redirect(`/cardinvoice/${bookingid}`);
     // return NextResponse.redirect(`${process.env.BASE_URL_API || 'http://localhost:3000'}/cardinvoice/${bookingid}`);
    }

    if (booking.pay_status !== "Booking Done") {
      const changeStatusRes = await fetch(`/api/changestatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bid: bookingid, payment_type: "gcash" }),
      });

      await changeStatusRes.json();
    }

    return NextResponse.redirect(`/cardinvoice/${bookingid}`);
  } catch (error) {
    console.error("GCash redirect error:", error);
    return NextResponse.redirect(`/`);
  }
}

export async function POST(req: Request) {
  return GET(req);
}
