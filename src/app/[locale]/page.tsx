import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import type { NextPage } from "next"; // Import NextPage for typing

import Header from "../../components/common/Header";
import Hero from "./homeTwo/Hero";
import Features from "./homeTwo/Features";
import CocotelOffers from "./homeTwo/CocotelOffers";
import TopThingsToDo from "./homeTwo/TopThingsToDo";
import Attractions from "./homeTwo/attractions";
import WhyUs from "./homeTwo/whyus";
import Photos from "./homeTwo/photos";
import DiscoverSection from "./homeTwo/discoverWhat";

import Footer from "./Footer";

// Define the params type to match Next.js expectations
interface PageProps {
  params: Promise<{ locale: string }>; // Use Promise to match Next.js type
}

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
const Home: NextPage<PageProps> = async ({ params }) => {
  // Await params to resolve the Promise
  const { locale } = await params;

  // Fetch data
  const data = await getData(locale);

  if (!data) {
    notFound(); // 404 if JSON not found
  }

  return (
    <div>
      <Header />
      <Hero data={data.hero}/>
      <TopThingsToDo data={data.topThingsToDo} />
      <CocotelOffers/>
      <Features content={data} locale={locale} />
      <DiscoverSection/>
      <Attractions />
      <WhyUs />
      <Photos />
      
      <Footer data={data.footer} />
    </div>
  );
};

export default Home;