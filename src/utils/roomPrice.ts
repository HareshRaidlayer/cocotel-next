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

export function getRoomPrice(
  room: Room,
  checkin?: string | Date
): number {
  // 1️⃣ Manual override (calendar price)
  if (room.price && Number(room.price) > 0) {
    return Number(room.price);
  }

  // 2️⃣ Use checkin date or today's date
  const date = checkin ? new Date(checkin) : new Date();
  const peak = onSeason(date);
  const weekend = isWeekend(date);

  if (peak && weekend) return room.rate_week_end_peak ?? 0;
  if (peak && !weekend) return room.rate_week_day_peak ?? 0;
  if (!peak && weekend) return room.rate_week_end_lean ?? 0;

  return room.rate_week_day_lean ?? 0;
}
