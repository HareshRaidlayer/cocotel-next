import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google';
import ClientLayout from "@/components/common/clientLayout"; // New Client Component
import "../../public/css/style.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // optional weights
  display: 'swap', // recommended for performance
});

export const metadata: Metadata = {
  title: 'Hotel Booking - Find Your Perfect Stay',
  description: 'Book hotels with ease. Explore top destinations, compare prices, and find the best deals for your next stay.',
  keywords: ['hotel booking', 'travel', 'accommodation', 'hotels', 'vacation'],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Hotel Booking - Find Your Perfect Stay',
    description: 'Discover and book hotels worldwide with the best prices and deals.',
    url: 'https://cocotel.com',
    siteName: 'Hotel Booking',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Hotel Booking Hero Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* <Header /> */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}