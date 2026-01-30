import Header from "@/components/common/Header";
import Footer from "../Footer";
import fs from "fs";
import path from "path";
import HotelPageClient from "./HotelPageClient";
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
  }>;
  searchParams: Promise<{
    checkin?: string;
    checkout?: string;
    roomCount?: string;
    adults?: string;
    //children?: string;
  }>;
}

export default async function HotelPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;

  const {
    checkin,
    checkout,
    roomCount = "1",
    adults = "1",
   // children = "0",
  } = await searchParams;
  
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
        roomCount={Number(roomCount)}
        adults={Number(adults)}
        //children={Number(children)}
      />
      {/* <HotelPageClient locale={locale} slug={slug} /> */}
      <Footer data={footerData} />
    </div>
  );
}
