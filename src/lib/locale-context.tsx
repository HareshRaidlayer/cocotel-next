"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations = {
  en: {
    "header.home": "Home",
    "header.events": "Events at Cocotel",
    "header.partner": "Partner With Us",
    "header.currency": "Currency",
    "header.cart": "Cart",
    "header.account": "Account",
    "header.profile": "Profile",
    "header.settings": "Settings",
    "header.logout": "Logout",
    "header.cartEmpty": "Cart is empty",
    "hero.title": "Just Unpacked!",
    "hero.subtitle": "Unlock your adventure with Cocotel. Explore our collection of hotels and resorts in beachside, cityscape, and mountain settings. Book now with No queues, no crowds—all discounted.",
    "hero.feature1": "Wide Selection of Hotel Booking",
    "hero.feature2": "Best Price Guarantee",
    "hero.feature3": "Easy Booking & Cancellation",
    "hero.feature4": "Comprehensive Destination Guides",
    "topThings.title": "Top Things To Do",
    "topThings.viewAll": "View All",
    "features.title": "Why Choose Us",
    "discover.title": "Discover Amazing Places",
    "discover.subtitle": "Unlock your adventure with Cocotel. Explore our collection of hotels and resorts in beachside, cityscape, and mountain settings. Book now with no queues, no crowds—all discounted.",
    "attractions.title": "Popular Attractions",
    "attractions.viewMore": "View More",
    "whyUs.title": "Why Choose The #1 Hotel Booking Platform",
    "whyUs.subtitle": "Plan your dream trip with confidence",
    "whyUs.card1.title": "Philippines' Top Travel Platform",
    "whyUs.card1.desc": "Trusted by thousands of travelers and recognized for excellence, we make it easy to explore the Philippines from coast to coast.",
    "whyUs.card2.title": "Everything You Need in One Place",
    "whyUs.card2.desc": "From island-hopping tours and hotel stays to transport, car rentals, and travel guides.",
    "whyUs.card3.title": "Best Price Guarantee",
    "whyUs.card3.desc": "Get the lowest prices on all our services. If you find a better deal, we'll match it—no questions asked.",
    "whyUs.card4.title": "Flexible & Secure Booking",
    "whyUs.card4.desc": "Enjoy flexible booking options and free cancellations on most services, giving you the confidence to plan with ease.",
    "whyUs.card5.title": "Curated by Local Experts",
    "whyUs.card5.desc": "Our team of Filipino travel specialists ensures every service meets the highest standards and reflects the best of what the Philippines has to offer.",
    "whyUs.card6.title": "24/7 Support in Your Language",
    "whyUs.card6.desc": "We're here for you anytime, in your language. Our support team is available 24/7 to make sure your trip goes smoothly.",
    "whyUs.feature1": "Best Prices",
    "whyUs.feature2": "24/7 Support",
    "whyUs.feature3": "Easy Booking",
    "whyUs.feature4": "Secure Payment",
    "photos.title": "Photo Gallery",
    "photos.viewAll": "View All Photos",
    "footer.quickLinks": "Quick Links",
    "footer.contact": "Contact Us",
    "footer.followUs": "Follow Us",
    "footer.allRightsReserved": "All rights reserved"
  },
  id: {
    "header.home": "Beranda",
    "header.events": "Acara di Cocotel",
    "header.partner": "Bermitra Dengan Kami",
    "header.currency": "Mata Uang",
    "header.cart": "Keranjang",
    "header.account": "Akun",
    "header.profile": "Profil",
    "header.settings": "Pengaturan",
    "header.logout": "Keluar",
    "header.cartEmpty": "Keranjang kosong",
    "hero.title": "Baru Dibuka!",
    "hero.subtitle": "Buka petualangan Anda dengan Cocotel. Jelajahi koleksi hotel dan resort kami di tepi pantai, pemandangan kota, dan pegunungan. Pesan sekarang tanpa antrian, tanpa kerumunan—semua dengan diskon.",
    "hero.feature1": "Pilihan Luas Pemesanan Hotel",
    "hero.feature2": "Jaminan Harga Terbaik",
    "hero.feature3": "Pemesanan & Pembatalan Mudah",
    "hero.feature4": "Panduan Destinasi Lengkap",
    "topThings.title": "Hal Terbaik Yang Harus Dilakukan",
    "topThings.viewAll": "Lihat Semua",
    "features.title": "Mengapa Memilih Kami",
    "discover.title": "Temukan Tempat Menakjubkan",
    "discover.subtitle": "Buka petualangan Anda dengan Cocotel. Jelajahi koleksi hotel dan resort kami di tepi pantai, pemandangan kota, dan pegunungan. Pesan sekarang tanpa antrian, tanpa kerumunan—semua dengan diskon.",
    "attractions.title": "Atraksi Populer",
    "attractions.viewMore": "Lihat Lebih Banyak",
    "whyUs.title": "Mengapa Memilih Platform Pemesanan Hotel #1",
    "whyUs.subtitle": "Rencanakan perjalanan impian Anda dengan percaya diri",
    "whyUs.card1.title": "Platform Perjalanan Terbaik Indonesia",
    "whyUs.card1.desc": "Dipercaya oleh ribuan wisatawan dan diakui keunggulannya, kami memudahkan Anda menjelajahi Indonesia dari ujung ke ujung.",
    "whyUs.card2.title": "Semua Yang Anda Butuhkan di Satu Tempat",
    "whyUs.card2.desc": "Dari tur island-hopping dan penginapan hotel hingga transportasi, sewa mobil, dan panduan perjalanan.",
    "whyUs.card3.title": "Jaminan Harga Terbaik",
    "whyUs.card3.desc": "Dapatkan harga terendah untuk semua layanan kami. Jika Anda menemukan penawaran yang lebih baik, kami akan menyamakannya—tanpa pertanyaan.",
    "whyUs.card4.title": "Pemesanan Fleksibel & Aman",
    "whyUs.card4.desc": "Nikmati opsi pemesanan yang fleksibel dan pembatalan gratis untuk sebagian besar layanan, memberikan Anda kepercayaan diri untuk merencanakan dengan mudah.",
    "whyUs.card5.title": "Dikurasi oleh Ahli Lokal",
    "whyUs.card5.desc": "Tim spesialis perjalanan Indonesia kami memastikan setiap layanan memenuhi standar tertinggi dan mencerminkan yang terbaik dari Indonesia.",
    "whyUs.card6.title": "Dukungan 24/7 dalam Bahasa Anda",
    "whyUs.card6.desc": "Kami siap membantu Anda kapan saja, dalam bahasa Anda. Tim dukungan kami tersedia 24/7 untuk memastikan perjalanan Anda berjalan lancar.",
    "whyUs.feature1": "Harga Terbaik",
    "whyUs.feature2": "Dukungan 24/7",
    "whyUs.feature3": "Pemesanan Mudah",
    "whyUs.feature4": "Pembayaran Aman",
    "photos.title": "Galeri Foto",
    "photos.viewAll": "Lihat Semua Foto",
    "footer.quickLinks": "Tautan Cepat",
    "footer.contact": "Hubungi Kami",
    "footer.followUs": "Ikuti Kami",
    "footer.allRightsReserved": "Semua hak dilindungi"
  },
  ph: {
    "header.home": "Tahanan",
    "header.events": "Mga Kaganapan sa Cocotel",
    "header.partner": "Makipag-partner Sa Amin",
    "header.currency": "Pera",
    "header.cart": "Cart",
    "header.account": "Account",
    "header.profile": "Profile",
    "header.settings": "Mga Setting",
    "header.logout": "Mag-logout",
    "header.cartEmpty": "Walang laman ang cart",
    "hero.title": "Bagong Bukas!",
    "hero.subtitle": "Buksan ang inyong pakikipagsapalaran sa Cocotel. Galugarin ang aming koleksyon ng mga hotel at resort sa tabi ng dagat, tanawin ng lungsod, at bundok. Mag-book na ngayon nang walang pila, walang siksikan—lahat may diskwento.",
    "hero.feature1": "Malawakang Pagpipilian ng Hotel Booking",
    "hero.feature2": "Garantisadong Pinakamababang Presyo",
    "hero.feature3": "Madaling Pag-book at Pagkansela",
    "hero.feature4": "Kumpletong Gabay sa mga Destinasyon",
    "topThings.title": "Mga Nangungunang Bagay Na Gagawin",
    "topThings.viewAll": "Tingnan Lahat",
    "features.title": "Bakit Kami Piliin",
    "discover.title": "Tuklasin Ang Mga Kahanga-hangang Lugar",
    "discover.subtitle": "Buksan ang inyong pakikipagsapalaran sa Cocotel. Galugarin ang aming koleksyon ng mga hotel at resort sa tabi ng dagat, tanawin ng lungsod, at bundok. Mag-book na ngayon nang walang pila, walang siksikan—lahat may diskwento.",
    "attractions.title": "Mga Sikat na Atraksyon",
    "attractions.viewMore": "Tingnan Pa",
    "whyUs.title": "Bakit Piliin Ang #1 Hotel Booking Platform",
    "whyUs.subtitle": "Planuhin ang inyong pangarap na biyahe nang may kumpiyansa",
    "whyUs.card1.title": "Nangungunang Travel Platform ng Pilipinas",
    "whyUs.card1.desc": "Pinagkakatiwalaan ng libu-libong mga manlalakbay at kinikilala sa kahusayan, ginagawa naming madali ang paggalugad sa Pilipinas mula sa baybayin hanggang baybayin.",
    "whyUs.card2.title": "Lahat ng Kailangan Ninyo sa Isang Lugar",
    "whyUs.card2.desc": "Mula sa mga island-hopping tour at hotel stays hanggang sa transportasyon, car rentals, at travel guides.",
    "whyUs.card3.title": "Garantisadong Pinakamababang Presyo",
    "whyUs.card3.desc": "Makakuha ng pinakamababang presyo sa lahat ng aming serbisyo. Kung makahanap kayo ng mas magandang deal, itutugma namin ito—walang tanong.",
    "whyUs.card4.title": "Flexible at Secure na Booking",
    "whyUs.card4.desc": "Mag-enjoy sa flexible booking options at libreng cancellations sa karamihan ng mga serbisyo, na nagbibigay sa inyo ng kumpiyansa na magplano nang madali.",
    "whyUs.card5.title": "Curated ng mga Local Expert",
    "whyUs.card5.desc": "Ang aming team ng mga Filipino travel specialist ay nagsisiguro na ang bawat serbisyo ay nakakatugon sa pinakamataas na pamantayan at sumasalamin sa pinakamahusay na mayroon ang Pilipinas.",
    "whyUs.card6.title": "24/7 Support sa Inyong Wika",
    "whyUs.card6.desc": "Nandito kami para sa inyo anumang oras, sa inyong wika. Ang aming support team ay available 24/7 para masiguro na magiging maayos ang inyong biyahe.",
    "whyUs.feature1": "Pinakamababang Presyo",
    "whyUs.feature2": "24/7 na Suporta",
    "whyUs.feature3": "Madaling Pag-book",
    "whyUs.feature4": "Secure na Bayad",
    "photos.title": "Gallery ng mga Larawan",
    "photos.viewAll": "Tingnan Lahat ng Larawan",
    "footer.quickLinks": "Mga Mabilis na Link",
    "footer.contact": "Makipag-ugnayan Sa Amin",
    "footer.followUs": "Sundan Kami",
    "footer.allRightsReserved": "Lahat ng karapatan ay nakalaan"
  }
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    const savedLocale = sessionStorage.getItem('locale') || 'en';
    setLocaleState(savedLocale);
  }, []);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    sessionStorage.setItem('locale', newLocale);
  };

  const t = (key: string) => {
    return translations[locale as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};