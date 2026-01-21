import HotelListMain from "@/components/hotellistComponent/HotelListMain";

export default function HotelListPage() {
    const hotels = [
        {
            id: 1,
            name: "Cocotel Sample Hotel & Resort",
            location: "Manila, Philippines",
            price: 2500,
            rating: 5,
            reviews: 3,
            discount: "20% OFF",
            save: "Save PHP 500",
            image: "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/232821121.jpg",
            gallery: [
      "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/232821121.jpg",
      "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/710475569.jpg"
    ],
            category: "5 star hotel",
            distance: "3 km from center",
            breakfast: true,
            parking: "Valet parking"
        },
        {
            id: 2,
            name: "Cocotel Beach Resort",
            location: "Cebu, Philippines",
            price: 3200,
            rating: 4.5,
            reviews: 10,
            discount: "15% OFF",
            save: "Save PHP 700",
            image: "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/710475569.jpg",
            gallery: [
      "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/232821121.jpg",
      "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/710475569.jpg"
    ],
            category: "5 star hotel",
            distance: "3 km from center",
            breakfast: true,
            parking: "Valet parking"
        },
        {
            id: 3,
            name: "Cocotel Beach Resort",
            location: "Cebu, Philippines",
            price: 3200,
            rating: 4.5,
            reviews: 10,
            discount: "15% OFF",
            save: "Save PHP 700",
            image: "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/710475569.jpg",
            gallery: [
      "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/232821121.jpg",
      "https://bstatic.tshiftcdn.com/xdata/images/hotel/max500/710475569.jpg"
    ],
            category: "5 star hotel",
            distance: "3 km from center",
            breakfast: true,
            parking: "Valet parking"
        }
    ];

    return <HotelListMain hotels={hotels} />;
}
