import NodeCache from "node-cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "w5K4iw1tRCTbnOrkprhs";
// Initialize cache
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

// Define API response interface
export interface ApiHotel {
  _id?: string;
  sectionData?: {
    Company?: {
      name?: string;
      city?: string;
      slug?: string;
      province?: string;
      country?: string;
      description?: string;
      gallery_image?: string;
      amenities?: string;
      promo_active?: number | string;
      price?: number | string;
      discountPrice?: number | string;
      primary_image?: string;
      rating?: number | string;
      reviews?: number | string;
    };
  };
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  discountPrice: number;
  image: string;
  province: string;
  rating: number;
  reviews: number;
  sectionData?: ApiHotel["sectionData"];
}
interface ApiRequest {
  dbName: string;
  collectionName: string;
  query?: Record<string, unknown>;
  projection?: Record<string, unknown>;
  limit?: number;
  skip?: number;
  order?: "ascending" | "descending";
  lookups?: Array<Record<string, unknown>>;
  cacheKey?: string; // Optional for caching
}

export async function getFeaturedHotels(province?: string): Promise<Hotel[]> {
  // const cacheKey = province ? `hotels_${province}` : "hotels_all"; // This line was removed as it was unused.

  // ⚠️ disable cache for random selection (or else it will always return the same 3)
  // const cachedData = cache.get<Hotel[]>(cacheKey);
  // if (cachedData) {
  //   return cachedData;
  // }

  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        dbName: "hanahotelnew",
        collectionName: "company",
        ...(province && {
          query: { "sectionData.Company.province": province },
        }),
        limit: 0, // ensure we fetch all hotels
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dataRes = await response.json();
    const data: ApiHotel[] | ApiHotel = dataRes?.data;

    if (!data) {
      console.warn("No data returned from API");
      return [];
    }

    const hotels: Hotel[] = (Array.isArray(data) ? data : [data]).map(
      (item: ApiHotel) => {
        const company = item.sectionData?.Company || {};
        const primaryImage =
          typeof company.primary_image === "string" &&
          company.primary_image.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/)
            ? company.primary_image.trim()
            : "";
        const galleryImages =
          typeof company.gallery_image === "string"
            ? company.gallery_image
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) =>
                  s.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/)
                )
            : [];
        const image =
          primaryImage ||
          (galleryImages.length > 0
            ? galleryImages[0]
            : "https://www.cocotel.com/fallback-image.jpg");

        return {
          id: item._id || "unknown",
          slug: company.slug || "unknown",
          name: company.name || "Unknown Hotel",
          location:
            [company.city, company.province, company.country]
              .filter(Boolean)
              .join(", ")
              .replace(/, , /g, ", ")
              .trim() || "Unknown Location",
          price: Number(company.price) || 0,
          discountPrice: Number(company.discountPrice) || 0,
          image,
          province: company.province || "",
          rating: Number(company.rating) || 0,
          reviews: Number(company.reviews) || 0,
          sectionData: {
            Company: {
              name: company.name,
              slug: company.slug,
              city: company.city,
              province: company.province,
              country: company.country,
              description: company.description,
              gallery_image: company.gallery_image,
              amenities: company.amenities,
              promo_active: Number(company.promo_active) || 0,
              price: Number(company.price) || 0,
              discountPrice: Number(company.discountPrice) || 0,
              primary_image: company.primary_image,
            },
          },
        };
      }
    );

    // 🔀 Shuffle hotels
    // const shuffled = hotels.sort(() => 0.5 - Math.random());

    // // 🎯 Pick first 3
    // const randomThree = shuffled.slice(0, 3);
    const randomThree = hotels.slice(0, 3);

    return randomThree;
  } catch (error) {
    console.error("Error fetching featured hotels:", error);
    return [];
  }
}

export async function apiGetData<T>({
  dbName,
  collectionName,
  query = {},
  projection = {},
  limit = 1000,
  skip = 0,
  order, // <-- Removed the default value here
  lookups = [],
  cacheKey,
}: ApiRequest): Promise<T[]> {
  if (cacheKey) {
    const cachedData = cache.get<T[]>(cacheKey);
    if (cachedData) {
      console.log(`Returning cached data for key: ${cacheKey}`);
      return cachedData;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        dbName,
        collectionName,
        query,
        projection,
        limit,
        skip,
        order, // <-- `order` will now be `undefined` if not provided, which is valid.
        lookups,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dataRes = await response.json();
    const data: T[] = Array.isArray(dataRes.data)
      ? dataRes.data
      : [dataRes.data];

    if (cacheKey) cache.set(cacheKey, data);

    return data;
  } catch (error) {
    console.error("API request error:", error);
    return [];
  }
}

// Get restricted province list
export async function getProvinces(): Promise<string[]> {
  try {
    const companies = await apiGetData<ApiHotel>({
      dbName: "hanahotelnew",
      collectionName: "company",
      projection: { "sectionData.Company.province": 1 },
      cacheKey: "provinces",
    });

    // Allowed provinces
    const allowedProvinces = [
      "Batangas",
      "Oriental Mindoro",
      "Cebu",
      "Siargao",
      "Palawan",
      "Laguna",
      "Metro Manila",
    ];

    // Extract and filter
    const provinces = companies
      .map((c) => c.sectionData?.Company?.province)
      .filter((p): p is string => p !== undefined && allowedProvinces.includes(p));
    // Return unique sorted provinces
    return [...new Set(provinces)].sort();
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
}

// export async function getProvinces(): Promise<string[]> {
//   try {
//     const companies = await apiGetData<ApiHotel>({
//       dbName: "hanahotelnew",
//       collectionName: "company",
//       projection: { "sectionData.Company.province": 1 },
//       cacheKey: "provinces",
//     });

//     // Extract provinces
//     const provinces = companies
//       .map((c) => c.sectionData?.Company?.province)
//       .filter((p): p is string => Boolean(p));

//     // Return unique sorted provinces
//     return [...new Set(provinces)].sort();
//   } catch (error) {
//     console.error("Error fetching provinces:", error);
//     return [];
//   }
// }

// export async function getHotelBySlug(slug: string) {
//   try {
//     // fetch hotel
//     const response = await fetch(`${API_BASE_URL}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": API_KEY,
//       },
//       body: JSON.stringify({
//         dbName: "hanahotelnew",
//         collectionName: "company",
//         query: { "sectionData.Company.slug": slug },
//         projection: {},
//         limit: 1,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const dataRes = await response.json();
//     const item: ApiHotel | undefined = Array.isArray(dataRes?.data)
//       ? dataRes.data[0]
//       : dataRes?.data;

//     if (!item) return null;

//     const company = item.sectionData?.Company || {};

//     // ✅ step 1: parse amenity IDs
//     const amenityIds = typeof company.amenities === "string"
//       ? company.amenities.split(",").map((id: string) => id.trim())
//       : [];

//     // ✅ step 2: fetch amenities details
//     let amenitiesDetails: { id: string; name: string; icon: string }[] = [];

//     if (amenityIds.length > 0) {
//       const amenityRes = await fetch(`${API_BASE_URL}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": API_KEY,
//         },
//         body: JSON.stringify({
//           dbName: "hanahotelnew",
//           collectionName: "amenities",
//           query: { _id: { $in: amenityIds } }, // filter amenities by ID list
//           projection: { "sectionData.amenities.amenity_name": 1, "sectionData.amenities.icon": 1 },
//         }),
//       });

//       if (amenityRes.ok) {
//         const amenityJson = await amenityRes.json();
//         amenitiesDetails = (amenityJson?.data || []).map((a: any) => ({
//           id: a._id,
//           name: a.sectionData?.amenities?.amenity_name || "",
//           icon: a.sectionData?.amenities?.icon || "",
//         }));
//       }
//     }

//     // ✅ step 3: map into hotel object
//     const hotel: Hotel = {
//       id: item._id || "unknown",
//       slug: company.slug || "unknown",
//       name: company.name || "Unknown Hotel",
//       location:
//         [company.city, company.province, company.country]
//           .filter(Boolean)
//           .join(", ")
//           .replace(/, , /g, ", ")
//           .trim() || "Unknown Location",
//       price: Number(company.price) || 0,
//       discountPrice: Number(company.discountPrice) || 0,
//       image: company.primary_image || "https://www.cocotel.com/fallback-image.jpg",
//       province: company.province || "",
//       rating: Number(company.rating) || 0,
//       reviews: Number(company.reviews) || 0,
//       sectionData: {
//         Company: {
//           name: company.name,
//           slug: company.slug,
//           city: company.city,
//           province: company.province,
//           country: company.country,
//           description: company.description,
//           gallery_image: company.gallery_image,
//           amenities: amenitiesDetails, // ✅ enriched with name + icon
//           promo_active: Number(company.promo_active) || 0,
//           price: Number(company.price) || 0,
//           discountPrice: Number(company.discountPrice) || 0,
//           primary_image: company.primary_image,
//         },
//       },
//     };
//     console.log('responseDate:',hotel);
//     return hotel;
//   } catch (error) {
//     console.error("Error fetching hotel by slug:", error);
//     return null;
//   }
// }