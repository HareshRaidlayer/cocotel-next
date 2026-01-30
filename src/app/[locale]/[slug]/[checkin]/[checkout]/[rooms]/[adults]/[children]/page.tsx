import Header from "@/components/common/Header";
import Footer from "../../../../../../Footer";
import fs from "fs";
import path from "path";
import HotelPageClient from "../../../../../HotelPageClient";
import { notFound } from "next/navigation";

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
    slug: string;
    checkin: string;
    checkout: string;
    rooms: string;
    adults: string;
    children: string;
  }>;
}

export default async function HotelSearchPage({ params }: PageProps) {
  const { locale, slug, checkin, checkout, rooms, adults, children } = await params;
  
  if (!slug) {
    notFound();
  }
  
  const footerData = await getFooterData(locale);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HotelPageClient 
        locale={locale}
        slug={slug}
        checkin={checkin}
        checkout={checkout}
        roomCount={parseInt(rooms)}
        adults={parseInt(adults)}
        childrenCount={parseInt(children)}
      />
      <Footer data={footerData} />
    </div>
  );
}