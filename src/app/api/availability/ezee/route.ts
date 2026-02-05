// src/app/api/availability/ezee/route.ts
import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { ApiResponseItem, RoomApiItem } from "@/types/hotel";
/**
 * POST /api/availability/ezee
 * Replaces Laravel ezeecheckavailablity()
 */

interface EzeeRoomItem {
  roomtypeunkid: string;
  available_rooms: number;
  min_ava_rooms: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      checkIn,
      checkOut,
      hotelId,
      roomId,
      adults,
      children,
      rooms,
    } = body;

    if (
      !checkIn ||
      !checkOut ||
      !hotelId ||
      !roomId ||
      adults === undefined ||
      children === undefined ||
      !rooms
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ------------------------------------------------
       Get hotel data (replaces gethoteldata)
    ------------------------------------------------ */
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
    const hotelApiKey = hotel.sectionData.Company.hotel_api_key;

    /* ------------------------------------------------
        Get room + hotel data (roomAndHotelData)
    ------------------------------------------------ */
    const roomData = await fetchFromAPI<RoomApiItem[]>({
      appName: "app3534482538357",
      moduleName: "rooms",
      query: {
        "_id": roomId,
        "sectionData.rooms.is_deleted": "0",
      },
    });

    const room = roomData?.[0];
    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    const roomTypeCode =
      room.sectionData.rooms.room_type_code;

    /* ------------------------------------------------
        Build EZEE API URL
    ------------------------------------------------ */
    const startDate = new Date(checkIn).toISOString().split("T")[0];
    const endDate = new Date(checkOut).toISOString().split("T")[0];

    // const params = new URLSearchParams({
    //   request_type: "RoomList",
    //   HotelCode: hotelCode,
    //   APIKey: hotelApiKey,
    //   check_in_date: startDate,
    //   check_out_date: endDate,
    //   num_nights: "",
    //   number_adults: String(adults),
    //   number_children: String(children),
    //   num_rooms: String(rooms),
    //   promotion_code: "",
    //   property_configuration_info: "0",
    //   showtax: "0",
    //   show_only_available_rooms: "0",
    //   language: "en",
    //   roomtypeunkid: roomTypeCode,
    //   packagefor: "DESKTOP",
    //   promotionfor: "DESKTOP",
    // });

    const params = new URLSearchParams({
      request_type: "RoomList",
      HotelCode: hotelCode ?? "",
      APIKey: hotelApiKey ?? "",
      check_in_date: startDate,
      check_out_date: endDate,
      num_nights: "",
      number_adults: String(adults),
      number_children: String(children),
      num_rooms: String(rooms),
      promotion_code: "",
      property_configuration_info: "0",
      showtax: "0",
      show_only_available_rooms: "0",
      language: "en",
      roomtypeunkid: roomTypeCode ?? "",
      packagefor: "DESKTOP",
      promotionfor: "DESKTOP",
    });

    const ezeeUrl =
      "https://live.ipms247.com/booking/reservation_api/listing.php?" +
      params.toString();

    /* ------------------------------------------------
       Call EZEE API
    ------------------------------------------------ */
    const ezeeRes = await fetch(ezeeUrl, {
      cache: "no-store",
    });

    if (!ezeeRes.ok) {
      throw new Error("EZEE API request failed");
    }

    const ezeeJson = await ezeeRes.json();

    /* ------------------------------------------------
        Map response
    ------------------------------------------------ */
    const roomAvailability: EzeeRoomItem[] = [];

    if (Array.isArray(ezeeJson)) {
      for (const r of ezeeJson as EzeeRoomItem[]) {
        //for (const r of ezeeJson) {
        if (
          r.roomtypeunkid &&
          r.available_rooms &&
          r.min_ava_rooms !== undefined
        ) {
          roomAvailability.push({
            roomtypeunkid: r.roomtypeunkid,
            available_rooms: r.available_rooms,
            min_ava_rooms: r.min_ava_rooms,
          });
        }
      }
    }

    return NextResponse.json(roomAvailability);
  } catch (error) {
    console.error("EZEE availability error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
