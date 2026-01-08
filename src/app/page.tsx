import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

import Header from "../components/common/Header";
import Hero from "./[locale]/homeTwo/Hero";
import Features from "./[locale]/homeTwo/Features";
import TopThingsToDo from "./[locale]/homeTwo/TopThingsToDo";
import CocotelOffers from "./[locale]//homeTwo/CocotelOffers";
import WhyUs from "./[locale]/homeTwo/whyus";
import Attractions from "./[locale]/homeTwo/attractions";
import Photos from "./[locale]/homeTwo/photos";
import Footer from "./[locale]/Footer";
import DiscoverSection from "./[locale]/homeTwo/discoverWhat";

export const metadata = {
  title: "Hotel Booking - Find Your Perfect Stay",
  description: "Book hotels with ease. Explore top destinations, compare prices, and find the best deals for your next stay.",
  icons: {
    icon: "/favicon.ico",
  },
};

async function getData() {
  try {
    const filePath = path.join(process.cwd(), "src/app/content/ph/hometwo.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // Validate required sections
    const requiredSections = ["topThingsToDo", "features", "attractions", "photos", "header", "hero", "footer"];
    const missingSections = requiredSections.filter((section) => !data[section]);
    if (missingSections.length > 0) {
      console.warn(`Missing sections in JSON for locale ph: ${missingSections.join(", ")}`);
    }

    // Validate photos section
    if (data.photos && (!data.photos.tours || !Array.isArray(data.photos.tours) || data.photos.tours.length < 6)) {
      console.warn(`Photos section for locale ph must have at least 6 tours`);
    }

    // Validate footer section
    if (
      data.footer &&
      (!data.footer.logo ||
        !data.footer.socials ||
        !data.footer.contacts ||
        !data.footer.navSections ||
        !data.footer.copyright)
    ) {
      console.warn(`Footer section for locale ph is missing required fields`);
    }

    return data;
  } catch (err) {
    console.error(`Error reading or parsing JSON for locale ph:`, err);
    return null;
  }
}

export default async function Home() {
  const data = await getData();

  if (!data) {
    notFound();
  }

  return (
    <div>
      <Header />
      <Hero data={data.hero}/>
      <TopThingsToDo />
      <CocotelOffers/>
      <Features content={data} locale="ph" />
      <Attractions />
      <DiscoverSection/>
      <WhyUs />
      <Photos />
      {/* <Photos data={data.photos} /> */}
      
      <Footer data={data.footer} />
    </div>
  );
}