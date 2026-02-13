import { fetchFromAPI } from "@/lib/api";
import { ApiResponseItem, RoomApiItem } from "@/types/hotel";

export type Room = {
  price?: number | string;
  rate_week_day_lean?: number;
  rate_week_end_lean?: number;
  rate_week_day_peak?: number;
  rate_week_end_peak?: number;
};

export function isWeekend(date: Date) {
  const day = date.getDay(); // 0=Sun, 6=Sat
  return day === 5 || day === 6; // Fri & Sat
}

export function onSeason(date: Date) {
  const month = date.getMonth() + 1; // 1-12
  return [11, 12, 3, 4, 5].includes(month); // peak months
}

export async function isHoliday(date: Date): Promise<boolean> {
  const dateStr = date.toISOString().split('T')[0];
  try {
    const holidays = await fetchFromAPI<Record<string, unknown>[]>({
      appName: "app3534482538357",
      moduleName: "nationalholidays",
      query: {
        "sectionData.nationalholidays.date": dateStr,
        "sectionData.nationalholidays.is_deleted": "0",
      },
      limit: 1,
    });
    return holidays && holidays.length > 0;
  } catch {
    return false;
  }
}

// export function getRoomPrice(
//   room: Room,
//   checkin?: string | Date
// ): number {
//   // 1️⃣ Manual override (calendar price)
//   if (room.price && Number(room.price) > 0) {
//     return Number(room.price);
//   }

//   // 2️⃣ Use checkin date or today's date
//   const date = checkin ? new Date(checkin) : new Date();
//   const peak = onSeason(date);
//   const weekend = isWeekend(date);

//   if (peak && weekend) return room.rate_week_end_peak ?? 0;
//   if (peak && !weekend) return room.rate_week_day_peak ?? 0;
//   if (!peak && weekend) return room.rate_week_end_lean ?? 0;

//   return room.rate_week_day_lean ?? 0;
// }
export function getRoomPrice(
  room: Room | null | undefined,
  checkin?: string | Date
): number {
  if (!room) return 0;

  // Manual override
  if (room.price && Number(room.price) > 0) {
    return Number(room.price);
  }

  const date = checkin ? new Date(checkin) : new Date();
  const peak = onSeason(date);
  const weekend = isWeekend(date);

  if (peak && weekend) return Number(room.rate_week_end_peak ?? 0);
  if (peak && !weekend) return Number(room.rate_week_day_peak ?? 0);
  if (!peak && weekend) return Number(room.rate_week_end_lean ?? 0);

  return Number(room.rate_week_day_lean ?? 0);
}

export async function getMinRoomPriceByHotelId(
  hotelId: string
): Promise<number> {
  const rooms = await fetchFromAPI<RoomApiItem[]>({
    appName: "app3534482538357",
    moduleName: "rooms",
    query: {
      "sectionData.rooms.hotel_id": hotelId,
      "sectionData.rooms.is_deleted": "0",
      "sectionData.rooms.is_status": "0",
    },
  });

  if (!rooms || rooms.length === 0) return 0;

  const prices: number[] = [];

  rooms.forEach((room) => {
    const r = room.sectionData.rooms;

    // choose ONE rate column minimum
    const price = Number(r.rate_week_day_peak ?? 0);

    if (price > 0) {
      prices.push(price);
    }
  });

  return prices.length ? Math.min(...prices) : 0;
}