import Header from "@/components/common/Header";
import Footer from "../[locale]/Footer";
import fs from "fs";
import path from "path";
import HotelPageClient from "../[locale]/[slug]/HotelPageClient";
import SubHeader from "@/components/common/subHeaderSearch";
import { notFound } from "next/navigation";

async function getFooterData(locale: string = "en") {
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
  searchParams: Promise<{
    country?: string;
    slug?: string;
  }>;
}

export default async function HotelPage({ searchParams }: PageProps) {
  const { slug } = await searchParams;
  
  if (!slug) {
    notFound();
  }
  
  const footerData = await getFooterData();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SubHeader />
      <HotelPageClient locale="ph" slug={slug} />
      <Footer data={footerData} />
    </div>
  );
}
