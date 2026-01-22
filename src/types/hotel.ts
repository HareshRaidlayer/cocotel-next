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

  image: string;        // ✅ Primary image (card image)
  gallery?: string[];   // ✅ Gallery images (quick view slider)

  category?: string;
  distance?: string;
  breakfast?: boolean;
  parking?: string;
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
}

export interface ApiResponseItem {
  _id: string; 
  sectionData: {
    
    Company: CompanyData;
  };
}

