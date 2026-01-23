// app/page.tsx
import Header from "@/components/common/Header";
import Footer from "../[locale]/Footer";
import fs from "fs";
import path from "path";
import HotelPageClient from "./HotelPageClient";

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

export default async function HotelPage() {
  const footerData = await getFooterData();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HotelPageClient />
      <Footer data={footerData} />
    </div>
  );
}
