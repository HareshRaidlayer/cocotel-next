import Header from "@/components/common/Header";
import Footer from "../[locale]/Footer";
import PartnerWithUsClient from "./PartnerWithUsClient";
import { fetchFromAPI } from "@/lib/api";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

interface PartnerSection {
  sectionOne: Array<{
    sectiononebannerheading: string;
    sectiononebannersubheading: string;
    sectiononebannerimage: string;
  }>;
  sectiontwo: Array<{
    sectiontwobannerheading: string;
    sectiontwosubheading: string;
  }>;
  sectionthree: Array<{
    sectionthreetitle: string;
    sectionthreedescription: string;
    sectionthreeimage: string;
    sectionthreeisactive: boolean;
  }>;
  sectionfour: Array<{
    sectionfourtitle: string;
    sectionfourdescription: string;
    sectionfourimage: string;
    sectionfourisactive: boolean;
  }>;
}

async function getFooterData(locale: string = "ph") {
  try {
    const filePath = path.join(process.cwd(), "src/app/content", locale, "hometwo.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);
    return data.footer || null;
  } catch {
    return null;
  }
}

async function getPartnerData(): Promise<PartnerSection | null> {
  try {
    const data = await fetchFromAPI({
      appName: "app3534482538357",
      moduleName: "partnersection",
      limit: 1,
    });

    if (data && Array.isArray(data) && data.length > 0) {
      return data[0].sectionData.partnersection;
    }
    return null;
  } catch (error) {
    console.error("Error fetching partner data:", error);
    return null;
  }
}

export default async function PartnerWithUsPage() {
  const [footerData, partnerData] = await Promise.all([
    getFooterData(),
    getPartnerData(),
  ]);

  return (
    <>
      <Header />
      <PartnerWithUsClient partnerData={partnerData} />
      {footerData && <Footer data={footerData} />}
    </>
  );
}
