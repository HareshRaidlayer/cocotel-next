import Header from "@/components/common/Header";
import Footer from "../[locale]/Footer";
import PromotionsSection from "@/components/PromotionsSection";
import fs from "fs";
import path from "path";

async function getFooterData(locale: string = "ph") {
  try {
    const filePath = path.join(process.cwd(), "src/app/content", locale, "hometwo.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);
    return data.footer || null;
  } catch (err) {
    console.error(`Error reading footer data for locale ${locale}:`, err);
    // Try fallback to ph locale
    if (locale !== "ph") {
      try {
        const fallbackPath = path.join(process.cwd(), "src/app/content", "ph", "hometwo.json");
        const fallbackData = fs.readFileSync(fallbackPath, "utf-8");
        const parsed = JSON.parse(fallbackData);
        return parsed.footer || null;
      } catch (fallbackErr) {
        console.error("Fallback to ph locale also failed:", fallbackErr);
      }
    }
    return null;
  }
}

export default async function AccommodationPromotions() {
  const footerData = await getFooterData();
	return (
		<section className="">
            <Header />
			<div
				className="flex justify-center items-center relative bg-cover bg-center bg-no-repeat text-white w-full h-[300px] sm:h-[300px] lg:h-[350px] mx-auto px-4 sm:px-6 lg:px-8"
				style={{
					backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/events/event_banner.png')`,
				}}
			>
				<div className="relative text-center">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
						Offers made for your getaway
					</h1>
				</div>
			</div>

			{/* promo cards */}
			<PromotionsSection />
			{footerData && <Footer data={footerData} />}
		</section>
	);
}