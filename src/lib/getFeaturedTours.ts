import { fetchFromAPI } from "@/lib/api";
import type { ApiResponseItem } from "@/types/hotel";

export interface TourCard {
  title: string;
  city: string;
  country?: string;
  src: string[]; // gallery images
  primaryImage: string; // primary image
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
}

const countryMap: Record<string, string> = {
  ph: "PH",
  id: "ID",
  aus: "AUS",
};

export async function getFeaturedTours(locale: string) {
  const countryCode = countryMap[locale] ?? "PH";
  const currencySymbol = countryCode === "ID" ? "IDR" : "PHP";

  const res = await fetchFromAPI({
    appName: "app3534482538357",
    moduleName: "company",
    query: {
      "sectionData.Company.country": countryCode,
      "sectionData.Company.is_deleted": false,
    },
    limit: 4,
  });

  if (!Array.isArray(res)) {
    return null;
  }

  const companies = res as ApiResponseItem[];

  const tours: TourCard[] = companies.map((company) => {
    const data = company.sectionData.Company;

    // Handle gallery images with proper validation
    let galleryImages: string[] = [];
    if (data.gallery_image && data.gallery_image.trim()) {
      galleryImages = data.gallery_image
        .split(",")
        .map(img => img.trim())
        .filter(img => img && img !== 'null' && img !== 'undefined');
    }
    
    // Handle primary image with validation
    let primaryImage = "/images/defualtimg.webp";
    if (data.primary_image && data.primary_image.trim() && data.primary_image !== 'null' && data.primary_image !== 'undefined') {
      primaryImage = data.primary_image.trim();
    }

    return {
      title: data.name ?? "Hotel",
      city: data.web_city ?? "",
      country: data.country,
      src: galleryImages, // gallery images for quick view
      primaryImage: primaryImage, // primary image for main card
      price: "2,500",
      originalPrice: "500",
      discount: "20% OFF",
      category: "Resort",
    };
  });

  return {
    tours,
    countryCode,
    currencySymbol,
  };
}
