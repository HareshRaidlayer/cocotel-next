import { NextResponse } from "next/server";
import { fetchFromAPI, submitBookingData } from "@/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookingid: string }> }
) {
  try {
    const { bookingid } = await params;

    console.log("GCash payment failed - bookingid:", bookingid);

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

    if (bookingRes && bookingRes.length > 0) {
      const bookingDoc = bookingRes[0] as { _id: string; sectionData?: { bookings?: Record<string, unknown> }; companyId: string };
      const booking = bookingDoc?.sectionData?.bookings;

      if (booking) {
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
      }
    }

    return NextResponse.redirect(`/cardinvoice/${bookingid}`);
  } catch (error) {
    console.error("GCash payment fail error:", error);
    return NextResponse.redirect(`/`);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingid: string }> }
) {
  return GET(req, { params });
}
