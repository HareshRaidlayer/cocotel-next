import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

import Header from "../../components/common/Header";
import Hero from "./homeTwo/Hero";
import Features from "./homeTwo/Features";
import CocotelOffers from "./homeTwo/CocotelOffers";
import TopThingsToDo from "./homeTwo/TopThingsToDo";
import Attractions from "./homeTwo/attractions";
import WhyUs from "./homeTwo/whyus";
import Photos from "./homeTwo/photos";
import DiscoverSection from "./homeTwo/discoverWhat";
import { getFeaturedTours } from "@/lib/getFeaturedTours";

import Footer from "./Footer";

async function getData(locale: string) {
  try {
    const filePath = path.join(process.cwd(), "src/app/content", locale, "hometwo.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    const requiredSections = ["topThingsToDo", "features", "attractions", "photos", "header", "hero", "footer"];
    const missingSections = requiredSections.filter((section) => !data[section]);
    if (missingSections.length > 0) {
      console.warn(`Missing sections in JSON for locale ${locale}: ${missingSections.join(", ")}`);
    }

    if (data.photos && (!data.photos.tours || !Array.isArray(data.photos.tours) || data.photos.tours.length < 6)) {
      console.warn(`Photos section for locale ${locale} must have at least 6 tours`);
    }

    if (
      data.footer &&
      (!data.footer.logo ||
        !data.footer.socials ||
        !data.footer.contacts ||
        !data.footer.navSections ||
        !data.footer.copyright)
    ) {
      console.warn(`Footer section for locale ${locale} is missing required fields`);
    }

    return data;
  } catch (err) {
    console.error(`Error reading or parsing JSON for locale ${locale}:`, err);
    return null;
  }
}

// Page component with explicit type
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const featured = await getFeaturedTours(locale);

  if (!featured) notFound();

  const { tours, countryCode, currencySymbol } = featured;

  // Fetch data
  const data = await getData(locale);

  if (!data) {
    notFound(); // 404 if JSON not found
  }

  return (
    <div>
      <Header />
      <Hero data={data.hero}/>
      <TopThingsToDo />
      {/* <TopThingsToDo data={data.topThingsToDo} /> */}
      <CocotelOffers/>
      {/* <CocotelOffers2/> */}
      <Features
        tours={tours}
        title={
          countryCode === "ID"
            ? "Featured Hotels in Indonesia"
            : "Featured Hotels in Philippines"
        }
        subtitle={
          countryCode === "ID"
            ? "Discover amazing accommodations across Indonesia"
            : "Explore the best hotels in the Philippines"
        }
        currencySymbol={currencySymbol}
        searchParams={undefined}
      />
      {/* <Features /> */}
      <DiscoverSection/>
      <Attractions />
      <WhyUs />
      <Photos />
      
      <Footer data={data.footer} />
    </div>
  );
};

// export default Home;