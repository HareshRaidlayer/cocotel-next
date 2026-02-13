import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { isWeekend, onSeason } from "@/utils/roomPrice";

export async function POST(req: Request) {
  try {
    const { promocode, hotelid, roomid, checkin, checkout, noofday, email } = await req.json();

    if (!promocode) {
      return NextResponse.json({ status: 0, message: "Please add promocode first" });
    }

    const promoRes = await fetchFromAPI<Record<string, unknown>[]>({
      appName: "app3534482538357",
      moduleName: "newpromocodes",
      query: {
        "sectionData.newpromocodes.promo_code": promocode.toUpperCase(),
        "sectionData.newpromocodes.is_status": "0",
        "sectionData.newpromocodes.is_deleted": "0",
      },
      limit: 1,
    });
console.log("Promo Res:", promoRes);
    if (!promoRes || promoRes.length === 0) {
      return NextResponse.json({ status: 0, message: "Promocode not available" });
    }

    const promoData = ((promoRes[0] as Record<string, unknown>).sectionData as Record<string, unknown>).newpromocodes as Record<string, unknown>;
    const currentDate = new Date().toISOString().split('T')[0];
    const bookstartDate = (promoData.bookstartdate as string).split('T')[0];
    const bookendDate = (promoData.bookenddate as string).split('T')[0];
    const startDate = (promoData.startdate as string).split('T')[0];
    const endDate = (promoData.enddate as string).split('T')[0];
    const minNights = Number(promoData.min_nights || 1);
    const isOneTime = Number(promoData.is_one_time || 0);

    if (isOneTime === 0 && email) {
      const usedPromo = await fetchFromAPI<Record<string, unknown>[]>({
        appName: "app3534482538357",
        moduleName: "bookings",
        query: {
          "sectionData.bookings.promocode": promocode,
          "sectionData.bookings.email": email,
        },
        limit: 1,
      });

      if (usedPromo && usedPromo.length > 0) {
        return NextResponse.json({ status: 0, message: "This promo already used" });
      }
    }

    if (!(
      (checkin >= startDate && checkin <= endDate) ||
      (checkout >= startDate && checkout <= endDate)
    ) || !(currentDate >= bookstartDate && currentDate <= bookendDate)) {
      return NextResponse.json({ status: 0, message: "Promocode not available for this date" });
    }

    if (noofday < minNights) {
      return NextResponse.json({ status: 0, message: `This promo requires minimum ${minNights} nights` });
    }

    const promoDetailRes = await fetchFromAPI<Record<string, unknown>[]>({
      appName: "app3534482538357",
      moduleName: "newpromodetails",
      query: {
        "sectionData.newpromodetails.newpromocodeid": promoRes[0]._id,
        "sectionData.newpromodetails.is_status": "0",
        "sectionData.newpromodetails.is_deleted": "0",
      },
    });

    if (!promoDetailRes || promoDetailRes.length === 0) {
      return NextResponse.json({ status: 0, message: "Promocode not available for this hotel or room" });
    }

    let isValid = false;
    for (const detail of promoDetailRes) {
      const detailData = ((detail as Record<string, unknown>).sectionData as Record<string, unknown>).newpromodetails as Record<string, unknown>;
      const hotelIds = detailData.hotelid as string[];
      const roomIds = detailData.roomid as string[];

      if (hotelIds.includes(hotelid) && roomIds.includes(roomid)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      return NextResponse.json({ status: 0, message: "Promocode not available for this hotel or room" });
    }

    return NextResponse.json({
      status: 1,
      data: {
        discount_in_percentage_weekday: Number(promoData.discount_in_percentage_weekday || 0),
        discount_in_percentage_weekend: Number(promoData.discount_in_percentage_weekend || 0),
        discount_in_price_weekday: Number(promoData.discount_in_price_weekday || 0),
        discount_in_price_weekend: Number(promoData.discount_in_price_weekend || 0),
        is_for_holiday: Number(promoData.is_for_holiday || 0),
      },
    });
  } catch (error) {
    console.error("Promo code error:", error);
    return NextResponse.json({ status: 0, message: "Internal server error" }, { status: 500 });
  }
}
