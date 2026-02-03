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
  slug?: string;
  terms_conditions?:string;
  image: string;        // Primary image (card image)
  gallery?: string[];   // Gallery images (quick view slider)
  primary_image?:string; 
  category?: string;
  distance?: string;
  breakfast?: boolean;
  parking?: string;
  amenities?: string[]; // Array of amenity IDs
  tag?: string[];       // Array of tag IDs
}

// Room API Response Types
export interface RoomApiItem {
  _id: string;
  sectionData: {
    rooms: {
      web_rooms_id: string;
      title: string;
      description?: string;
      max_adults: number;
      extraPerson:number;
      price?: number;
      rate_week_day_lean?: number;
      rate_week_end_lean?: number;
      rate_week_day_peak?: number;
      rate_week_end_peak?: number;
      primary_image?: string;
      hotel_id: string;
      is_deleted: string;
      is_status: string;
    };
  };
}

// Room Gallery API Response Types
export interface RoomGalleryApiItem {
  _id: string;
  sectionData: {
    room_gallery: {
      room_id: string;
      room_gallery_image: string;
      is_deleted: string;
      is_status: string;
    };
  };
}

// Amenity API Response Types
export interface AmenityApiItem {
  _id: string;
  sectionData: {
    amenities: {
      title: string;
      icon?: string;
      icon_new?: string;
      is_status: string;
      is_deleted: string;
    };
  };
}

// ✅ API Response Types
export interface CompanyData {
  web_hotel_code: string;
  hotel_code: string;
  web_title?: string;
  companyName: string;
  name?: string;
  address_line1: string;
  address_line2?: string;
  address?: string;
  web_province: string;
  province?: string;
  web_city?: string;
  web_description?: string;
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
  amenities?: string[];
  tag?: string[];
  google_map_url?:string;
  terms_conditions?:string;
}

export interface ApiResponseItem {
  _id: string; 
  sectionData: {
    
    Company: CompanyData;
  };
}

// Amenity API item
export interface LegacyAmenityApiItem {
  _id: string;
  sectionData: {
    amenities: {
      title: string;
      associateto: string;
      amenity_type: string;
      category: string;
      available_24_7: boolean;
      additional_cost: boolean;
      is_status?:string;
      is_deleted?:string;
    };
  };
}

// Tag API item
export interface TagApiItem {
  _id: string;
  sectionData: {
    tags: {
      tag_name: string;
      is_active: boolean;
      bgcolor: string;
      textcolor: string;
      image: string;
      is_status?:string;
      is_deleted?:string;
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


// Room API Response Types
export interface GalleryItem {
  _id: string;
  sectionData: {
    gallerys: {
      web_rooms_id: string;
      title: string;
      gallery_image?: string;
      primary_image?: string;
      hotel_id: string;
      is_deleted: string;
      is_status: string;
    };
  };
}
