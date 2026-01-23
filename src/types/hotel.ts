// types/hotel.ts
export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  discount?: string;
  save?: string;

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
  address_line1: string;
  web_province: string;
  web_city?: string;
  description?: string;
  promo_active?: boolean;
  primary_image: string;
  gallery_image?: string;
  prop_classification?: string;
  is_deleted: boolean;
  main_status: string;
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


