import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google';
import ClientLayout from "@/components/common/clientLayout"; // New Client Component
import { LocaleProvider } from "@/lib/locale-context";
import AuthProvider from "@/components/AuthProvider";
import "../../public/css/style.css";
import "../../public/css/login.css";
import "react-phone-number-input/style.css";
import GoogleOneTap from "@/components/GoogleOneTap";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // optional weights
  display: 'swap', // recommended for performance
});

export const metadata: Metadata = {
  title: 'Cocotel Hotels - Best Hotel Booking in Philippines, Indonesia & Australia',
  description: 'Book luxury hotels and resorts in Philippines, Indonesia, and Australia with Cocotel. Best prices, exclusive deals, and premium accommodations across Southeast Asia and Oceania.',
  keywords: [
    'hotel booking Philippines', 'hotels Indonesia', 'hotels Australia',
    'Manila hotels', 'Bali hotels', 'Sydney hotels', 'resort booking',
    'luxury hotels Southeast Asia', 'beach resorts Philippines',
    'Jakarta hotels', 'Melbourne hotels', 'Cebu hotels', 'Boracay resorts',
    'hotel deals Asia Pacific', 'accommodation booking'
  ],
  authors: [{ name: 'Cocotel International' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://cocotel.com',
    languages: {
      'en': 'https://cocotel.com/en',
      'id': 'https://cocotel.com/id',
      'tl': 'https://cocotel.com/ph'
    }
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Cocotel Hotels - Premium Hotel Booking in Philippines, Indonesia & Australia',
    description: 'Discover luxury hotels and exclusive resort deals across Philippines, Indonesia, and Australia. Book with Cocotel for the best rates and premium experiences.',
    url: 'https://cocotel.com',
    siteName: 'Cocotel Hotels',
    images: [
      {
        url: 'https://cocotel.com/images/cocotel-hotels-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Cocotel Hotels - Luxury Accommodations in Asia Pacific',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cocotel Hotels - Best Hotel Booking in Asia Pacific',
    description: 'Book luxury hotels in Philippines, Indonesia & Australia with exclusive deals and premium service.',
    images: ['https://cocotel.com/images/cocotel-hotels-twitter.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="no-referrer-when-downgrade" />
        {/* Google Analytics */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        /> */}
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Cocotel Hotels",
              "description": "Premium hotel booking service for Philippines, Indonesia, and Australia",
              "url": "https://cocotel.com",
              "logo": "https://cocotel.com/logo/footer.svg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+63-917-307-7462",
                "contactType": "customer service",
                "areaServed": ["PH", "ID", "AU"]
              },
              "areaServed": [
                {"@type": "Country", "name": "Philippines"},
                {"@type": "Country", "name": "Indonesia"},
                {"@type": "Country", "name": "Australia"}
              ],
              "serviceType": "Hotel Booking"
            })
          }}
        />
      </head>
      <body className={poppins.className}>
        <AuthProvider>
          <LocaleProvider>
            <ClientLayout>{children}</ClientLayout>
            <GoogleOneTap />
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}