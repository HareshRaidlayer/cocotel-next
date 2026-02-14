import { notFound, redirect } from "next/navigation";
import Header from "@/components/common/Header";
import SubHeader from "@/components/common/subHeaderSearch";
import Footer from "../Footer";
import fs from "fs";
import path from "path";
import HotelPageClient from "../[slug]/HotelPageClient";
import PathBasedBookingPage from "./booking-page";

async function getFooterData(locale: string = "ph") {
  try {
    const filePath = path.join(process.cwd(), "src/app/content", locale, "hometwo.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);
    return data.footer || {};
  } catch (err) {
    console.error(`Error reading footer data for locale ${locale}:`, err);
    return {};
  }
}

interface PageProps {
  params: Promise<{
    locale: string;
    params: string[];
  }>;
}

export default async function DynamicRoutePage({ params }: PageProps) {
  const { locale, params: routeParams } = await params;
  
  if (!routeParams || routeParams.length === 0) {
    notFound();
  }

  const footerData = await getFooterData(locale);

  // Pattern 1: Hotel slug only - /ph/rsam-beach-resort-by-cocotel
  if (routeParams.length === 1) {
    const slug = routeParams[0];
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SubHeader />
        <HotelPageClient
          locale={locale}
          slug={slug}
          roomCount={1}
          adults={1}
        />
        <Footer data={footerData} />
      </div>
    );
  }

  // Pattern 2: Hotel slug with booking params - /ph/rsam-beach-resort-by-cocotel/roomid/hotelid/rooms/checkin/checkout/guests/children/breakfast/firstname/lastname/email/phone
  if (routeParams.length >= 9 && routeParams[0].includes('-')) {
    const [slug, roomid, hotelid, rooms, checkin, checkout, guests, children, breakfast, ...userDetails] = routeParams;
    
    // If we have user details (firstname, lastname, email, phone), redirect to booking
    if (userDetails.length >= 4) {
      const [firstname, lastname, email, phone] = userDetails;
      const bookingUrl = `/${locale}/booking?roomid=${roomid}&hotelid=${hotelid}&noofroom=${rooms}&checkin=${checkin}&checkout=${checkout}&no_of_guests=${guests}&noofchild=${children}&withbreakfast=${breakfast}&firstname=${firstname}&lastname=${lastname}&email=${decodeURIComponent(email)}&phone=${phone}&popup=0`;
      redirect(bookingUrl);
    }
    
    // Otherwise show hotel details with params
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SubHeader />
        <HotelPageClient
          locale={locale}
          slug={slug}
          checkin={checkin}
          checkout={checkout}
          roomCount={Number(rooms)}
          adults={Number(guests)}
          childrenCount={Number(children)}
        />
        <Footer data={footerData} />
      </div>
    );
  }

  // Pattern 3: Hotel slug with booking params - /ph/rsam-beach-resort-by-cocotel/23-03-2026/25-03-2026/1/2/0
  if (routeParams.length === 6 && routeParams[0].includes('-')) {
    const [slug, checkin, checkout, rooms, guests, children] = routeParams;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SubHeader />
        <HotelPageClient
          locale={locale}
          slug={slug}
          checkin={checkin}
          checkout={checkout}
          roomCount={Number(rooms)}
          adults={Number(guests)}
          childrenCount={Number(children)}
        />
        <Footer data={footerData} />
      </div>
    );
  }

  // Pattern 4: Booking page with popup open - /ph/3/3/1/23-03-2026/25-03-2026/2/0/0
  if ((routeParams.length === 8 || routeParams.length === 9) && !isNaN(Number(routeParams[0]))) {
    return <PathBasedBookingPage params={params} />;
  }

  // Pattern 5: Booking page with user details - /ph/3/3/2/2026-03-23/2026-03-25/2/0/0/jayashri/patil/test@gmail.com/9582587425
  if (routeParams.length === 13 && !isNaN(Number(routeParams[0]))) {
    return <PathBasedBookingPage params={params} />;
  }

  // Pattern 6: Booking page with popup closed - /ph/3/3/2/2026-03-23/2026-03-25/2/0/0/jayashri/patil/test@gmail.com/9582587425/1
  if (routeParams.length === 14 && !isNaN(Number(routeParams[0]))) {
    return <PathBasedBookingPage params={params} />;
  }

  // Pattern 7: Hotel list page - /ph/hotellist (redirect to /hotellist with query params)
  if (routeParams.length === 1 && routeParams[0] === 'hotellist') {
    notFound(); // Let Next.js handle the proper hotellist route
  }

  // If no pattern matches, return 404
  notFound();
}