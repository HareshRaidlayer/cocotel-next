// src/app/api/availability/internal/route.ts
import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { ApiResponseItem, RoomApiItem } from "@/types/hotel";
/**
 * POST /api/availability/internal
 * Replaces Laravel checkavailablity()
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      checkIn,
      checkOut,
      hotelId,
      adults,
      roomId,
    } = body;

    if (!checkIn || !checkOut || !hotelId || !adults) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* -----------------------------------------
       1️⃣ Get hotel data (replaces gethoteldata)
    ----------------------------------------- */
    const hotels = await fetchFromAPI<ApiResponseItem[]>({
      appName: "app3534482538357",
      moduleName: "company",
      query: {
        "_id": hotelId,
        "sectionData.Company.is_deleted": false,
      },
    });

    const hotel = hotels?.[0];

    if (!hotel) {
      return NextResponse.json(
        { error: "Hotel not found" },
        { status: 404 }
      );
    }

    const hotelCode = hotel.sectionData.Company.pms_hotel_code;

    /* -----------------------------------------
       2️⃣ Call external availability API
    ----------------------------------------- */
    const startDate = new Date(checkIn).toISOString().split("T")[0];
    const endDate = new Date(checkOut).toISOString().split("T")[0];

    const availabilityUrl =
      `https://apic.1day.io/api/property/${hotelCode}/availability` +
      `?start_date=${startDate}` +
      `&end_date=${endDate}` +
      `&no_of_guest=${adults}`;

    console.log('OneDay API URL:', availabilityUrl);

    const availabilityRes = await fetch(availabilityUrl, {
      headers: {
        "x-api-key": process.env.ONEDAY_API_KEY || "",
      },
      cache: "no-store",
    });

    console.log('OneDay API Response Status:', availabilityRes.status);

    if (!availabilityRes.ok) {
      console.error('OneDay API Error:', availabilityRes.status, availabilityRes.statusText);
      // Return empty array instead of throwing error
      return NextResponse.json([]);
    }

    const availabilityJson = await availabilityRes.json();

    /* -----------------------------------------
       3️⃣ Map available room IDs → room records
           (replaces getRoombycode)
    ----------------------------------------- */
    const availableRoomIds: string[] = [];

    if (availabilityJson?.data) {
      for (const room of availabilityJson.data) {
        if (room?.id) {
          availableRoomIds.push(room.id);
        }
      }
    }

    if (availableRoomIds.length === 0) {
      return NextResponse.json([]);
    }

    const rooms = await fetchFromAPI<RoomApiItem[]>({
      appName: "app3534482538357",
      moduleName: "rooms",
      query: {
        "sectionData.rooms.room_type_code": { $in: availableRoomIds },
        "sectionData.rooms.is_deleted": "0",
      },
    });

    return NextResponse.json(rooms ?? []);
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
