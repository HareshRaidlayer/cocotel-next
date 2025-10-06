import Image from "next/image";
import Link from "next/link";

interface Hotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: number;
  discountPrice: number;
  image: string;
  province: string;
  rating: number;
  reviews: number;
  sectionData?: {
    Company?: {
      slug?: string;
    };
  };
}

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link
      href={`/hotel/${hotel.sectionData?.Company?.slug || hotel.slug}`}
      data-id={`${hotel.id}`}
      className="block rounded-2xl overflow-hidden hotel-card transition bg-white h-full"
    >
      {/* Image */}
      <div className="relative">
        <Image
          src={hotel.image}
          alt={hotel.name}
          width={400}
          height={200}
          className="w-full h-40 sm:h-52 md:h-60 object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-[-12px] right-3 bg-[#4CAA42] text-white text-[10px] sm:text-xs md:text-sm font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded">
          New Hotels
        </span>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col h-full">
        {/* Location + Rating */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <p className="text-[10px] sm:text-xs md:text-sm text-green-600 w-full sm:w-1/2 truncate">
            {hotel.location}
          </p>

          <div className="flex items-center">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Image
                  key={i}
                  src={
                    i < Math.floor(hotel.rating)
                      ? "/images/full-star.svg"
                      : "/images/half-star.svg"
                  }
                  alt="star"
                  width={12}
                  height={12}
                  className="object-cover"
                  loading="lazy"
                  // priority
                />
              ))}
            </span>
            <span className="text-gray-500 text-[10px] sm:text-xs md:text-sm ml-1">
              {hotel.rating} ({hotel.reviews})
            </span>
          </div>
        </div>

        {/* Hotel name */}
        <h3 className="mt-1 font-semibold text-sm sm:text-lg md:text-2xl line-clamp-2">
          {hotel.name}
        </h3>

        {/* Prices */}
        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm line-through mt-1">
          ₱ 3080 Per Night
        </p>
        <p className="text-red-500 font-semibold text-base sm:text-xl md:text-2xl mt-1 animate-slide-up">
          ₱ 4,400 Per Night
        </p>
        {/* <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm line-through mt-1">
          ${hotel.price} Per Night
        </p>
        <p className="text-red-500 font-semibold text-base sm:text-xl md:text-2xl mt-1 animate-slide-up">
          ${hotel.discountPrice} Per Night
        </p> */}
      </div>
    </Link>
  );
}
