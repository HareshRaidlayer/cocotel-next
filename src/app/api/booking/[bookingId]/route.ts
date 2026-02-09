import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;

    const bookingRes = await fetchFromAPI<Record<string, unknown>[]>({
      appName: "app3534482538357",
      moduleName: "bookings",
      query: {
        "sectionData.bookings.booking_id": bookingId,
      },
      limit: 1,
    });

    if (!bookingRes || bookingRes.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingDoc = bookingRes[0] as { sectionData?: { bookings?: unknown } };
    const booking = bookingDoc?.sectionData?.bookings;

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Fetch booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
