// types/hotel.ts
export interface Hotel {
  id: number;
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
