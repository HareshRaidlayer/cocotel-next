import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { ApiResponseItem, RoomApiItem } from "@/types/hotel";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      checkin,
      checkout,
      hotelid,
      roomid,
      noofguest,
      noofchild = 0,
      noofroom = 1
    } = body;

    if (!checkin || !checkout || !hotelid || !roomid || !noofguest) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check date difference
    const diff = new Date(checkout).getTime() - new Date(checkin).getTime();
    const datediff = Math.abs(Math.round(diff / (1000 * 60 * 60 * 24)));

    if (datediff < 1) {
      return NextResponse.json(
        { 
          error: "Please choose different check in and checkout date",
          type: "date_error"
        },
        { status: 400 }
      );
    }

    console.log('Check availability request:', {
      checkin,
      checkout, 
      hotelid,
      roomid,
      noofguest,
      noofchild,
      noofroom
    });

    // Get hotel data to check booking engine
    const hotels = await fetchFromAPI<ApiResponseItem[]>({
      appName: "app3534482538357",
      moduleName: "company",
      query: {
        "_id": hotelid,
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

    const bookingEngine = hotel.sectionData.Company.booking_engine || "1";
    console.log('Hotel booking engine:', bookingEngine, 'for hotel:', hotel.sectionData.Company.web_title);

    let availableroom;
    let roomAvailable = false;

    if (bookingEngine === "0") {
      // EZEE booking engine
      const ezeeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/availability/ezee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn: checkin,
          checkOut: checkout,
          hotelId: hotelid,
          roomId: roomid,
          adults: noofguest,
          children: noofchild,
          rooms: noofroom
        })
      });

      if (!ezeeResponse.ok) {
        return NextResponse.json(
          { error: "Failed to check availability" },
          { status: 500 }
        );
      }

      availableroom = await ezeeResponse.json();

      if (!availableroom || availableroom.length === 0) {
        return NextResponse.json(
          { 
            error: `Room not available for ${noofguest} Guests and ${noofchild} Child.`,
            type: "availability"
          },
          { status: 400 }
        );
      }

      // Check room availability logic from Laravel
      let allZero = true;
      const datesWithZeroRooms: string[] = [];

      for (const room of availableroom) {
        if (room.min_ava_rooms !== undefined && room.min_ava_rooms === 0) {
          if (room.available_rooms) {
            for (const [date, roomCount] of Object.entries(room.available_rooms)) {
              if (roomCount === 0) {
                datesWithZeroRooms.push(date);
              } else {
                allZero = false;
              }
            }
          }
        } else {
          allZero = false;
        }
      }

      if (allZero) {
        return NextResponse.json(
          { 
            error: "Room not available on this date, you may choose another date for availability",
            type: "availability"
          },
          { status: 400 }
        );
      }

      if (datesWithZeroRooms.length > 0) {
        return NextResponse.json(
          { 
            error: `Room not available on these dates: ${datesWithZeroRooms.join(', ')}`,
            type: "availability"
          },
          { status: 400 }
        );
      }

      roomAvailable = true;

    } else {
      // OneDay booking engine
      console.log('Using OneDay booking engine for hotel:', hotelid);
      
      const internalResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/availability/internal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn: checkin,
          checkOut: checkout,
          hotelId: hotelid,
          adults: noofguest,
          roomId: roomid
        })
      });

      if (!internalResponse.ok) {
        console.error('Internal API failed:', internalResponse.status);
        // For now, assume room is available if API fails
        return NextResponse.json({
          success: true,
          message: "Room availability check temporarily unavailable, proceeding with booking",
          data: []
        });
      }

      availableroom = await internalResponse.json();

      // Check if requested room is available
      for (const room of availableroom) {
        if (room._id === roomid) {
          roomAvailable = true;
          break;
        }
      }

      if (!roomAvailable && availableroom.length > 0) {
        return NextResponse.json(
          { 
            error: "SOLD OUT",
            message: "Room not available on the date you choose!",
            type: "availability"
          },
          { status: 400 }
        );
      }

      // If no rooms returned but no error, assume available
      roomAvailable = true;
    }

    return NextResponse.json({
      success: true,
      message: "Room is available",
      data: availableroom
    });

  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}