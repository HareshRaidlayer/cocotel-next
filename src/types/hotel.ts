// types/hotel.ts
export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  discount?: string;
  description?: string;
  save?: string;
  latitude?:string;
  longitude?:string;

  image: string;        // Primary image (card image)
  gallery?: string[];   // Gallery images (quick view slider)

  category?: string;
  distance?: string;
  breakfast?: boolean;
  parking?: string;
  hotelamenities?: string[]; // Array of amenity IDs
  hoteltag?: string[];       //Array of tag IDs
}

// ✅ API Response Types
export interface CompanyData {
  web_hotel_code: string;
  web_title?: string;
  companyName: string;
  name?: string;
  address_line1: string;
  address_line2?: string;
  web_province: string;
  province?: string;
  web_city?: string;
  city?: string;
  country?: string;
  description?: string;
  promo_active?: boolean;
  primary_image: string;
  gallery_image?: string;
  prop_classification?: string;
  is_deleted: boolean;
  main_status: string;
  latitude?: string;
  longitude?: string;
  slug?: string;
  hotelamenities?: string[];
  hoteltag?: string[];
}

export interface ApiResponseItem {
  _id: string; 
  sectionData: {
    
    Company: CompanyData;
  };
}

// Amenity API item
export interface AmenityApiItem {
  _id: string;
  sectionData: {
    amenities: {
      amenity_name: string;
      associateto: string;
      amenity_type: string;
      category: string;
      available_24_7: boolean;
      additional_cost: boolean;
    };
  };
}

// Tag API item
export interface TagApiItem {
  _id: string;
  sectionData: {
    tag: {
      title: string;
      is_active: boolean;
      bgcolor: string;
      textcolor: string;
      image: string;
    };
  };
}

export interface MeiliHotelHit {
  id: string;
  name: string;
  address?: string;
  province?: string;
  description?: string;
  promo_active?: boolean;
  primary_image?: string;
  gallery_images?: string[];
  classification?: string;
  city?: string;
  latitude?:string;
  longitude?:string;
  amenities?: string[];
  tags?: string[];
  
}

export interface MeiliSearchResponse<T> {
  hits: T[];
  totalHits: number;
  processingTimeMs: number;
  query?: string;
}

