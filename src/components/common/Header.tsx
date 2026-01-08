"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiMenu, FiShoppingCart, FiUser } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { fetchFromAPI } from "@/lib/api";
import { useLocale } from '@/lib/locale-context';

// Define the Language interface
interface Language {
  code: string;
  name: string;
  locale: string;
}

const Header = () => {
  const { locale, setLocale, t } = useLocale();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartItems = ["Item 1", "Item 2", "Item 3"];
  const userOptions = [
    { label: t('header.login'), href: '/login' },
    { label: t('header.profile'), href: '/profile' },
    { label: t('header.settings'), href: '/settings' },
    { label: t('header.logout'), href: '/logout' }
  ];

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languageRes = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "language",
          query: {
            "sectionData.language.is_active": true,
            "sectionData.language.tag": "show"
          },
        });

        if (languageRes && Array.isArray(languageRes)) {
          const formattedLanguages = languageRes.map((lang: any) => ({
            code: lang.sectionData.language.languagecode,
            name: lang.sectionData.language.languagename,
            locale: lang.sectionData.language.languagecode
          }));
          setLanguages(formattedLanguages);
          
          // Set current language
          const currentLang = formattedLanguages.find((l: Language) => l.locale === locale) || formattedLanguages[0];
          setSelectedLanguage(currentLang);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  // Update selected language when locale changes
  useEffect(() => {
    if (languages.length > 0) {
      const currentLanguage = languages.find(l => l.locale === locale) || languages[0];
      setSelectedLanguage(currentLanguage);
    }
  }, [locale, languages]);

  // Handle language change
  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    setLocale(language.locale);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto py-3 flex items-center justify-between px-2 xl:px-0">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo/logo.png" alt="Logo" width={185} height={54} className="object-cover w-28 md:w-[185px]" priority />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex space-x-10 font-semibold text-green-600">
          <li>
            <Link href="/" className="hover:underline">{t('header.home')}</Link>
          </li>
          <li>
            <Link href="/events" className="hover:underline">{t('header.events')}</Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">{t('header.partner')}</Link>
          </li>
        </ul>

        {/* Right Buttons */}
        <div className="flex items-center space-x-4">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium text-white bg-[#4CAA42] hover:bg-green-600"
            >
              {selectedLanguage?.name || 'Language'} <FiChevronDown />
            </button>
            {showLanguageDropdown && (
              <ul className="absolute right-0 mt-2 bg-white border rounded shadow w-44 z-50">
                <div className="bg-[#4CAA42] rounded-t-[5px] text-white font-semibold p-2 flex items-center justify-between">
                  <span>{t('header.language')}</span>
                  <div
                    onClick={() => setShowLanguageDropdown(false)}
                    className="bg-white text-[#4CAA42] cursor-pointer text-sm font-bold p-1 rounded-full"
                  >
                    <RxCross2 />
                  </div>
                </div>
                {languages.map((language) => (
                  <li
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className="px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer flex items-center gap-2"
                  >
                    {language.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCartDropdown(!showCartDropdown)}
              className="flex items-center px-1 py-1 rounded text-sm font-medium text-green-700 hover:text-green-900"
            >
              <FiShoppingCart className="ml-1 text-lg" />
            </button>
            {showCartDropdown && (
              <ul className="absolute z-50 mt-2 bg-white border rounded shadow w-40 right-0">
                <div className="bg-[#4CAA42] text-white rounded-t-[5px] font-semibold p-2 flex items-center justify-between">
                  <span>{t('header.cart')}</span>
                  <div
                    onClick={() => setShowCartDropdown(false)}
                    className="bg-white text-[#4CAA42] cursor-pointer text-sm font-bold p-1 rounded-full"
                  >
                    <RxCross2 />
                  </div>
                </div>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <li
                      key={item}
                      className="px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-green-700">{t('header.cartEmpty')}</li>
                )}
              </ul>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="bg-[#4CAA42] text-white cursor-pointer text-lg font-bold p-1 rounded-full"
            >
              <FiUser />
            </button>
            {showUserDropdown && (
              <ul className="absolute z-50 mt-2 bg-white border rounded shadow w-40 right-0">
                <div className="bg-[#4CAA42] rounded-t-[5px] text-white font-bold p-2 flex items-center justify-between">
                  <span>{t('header.account')}</span>
                  <div
                    onClick={() => setShowUserDropdown(false)}
                    className="bg-white text-[#4CAA42] cursor-pointer text-sm font-bold p-1 rounded-full"
                  >
                    <RxCross2 />
                  </div>
                </div>
                {userOptions.map((option) => (
                  <li key={option.label}>
                    <Link
                      href={option.href}
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer"
                    >
                      {option.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            className="lg:hidden text-2xl ml-3"
            onClick={() => setShowMobileMenu(true)}
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* Mobile Menu with fade animation */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col transition-opacity duration-300 opacity-100">
          <div className="flex items-center justify-between p-2 border-b">
            <Link href="/">
              <Image src="/logo/logo.png" alt="Logo" width={140} height={40} className="w-28" />
            </Link>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="text-2xl"
            >
              <RxCross2 />
            </button>
          </div>
          <ul className="flex flex-col space-y-4 p-6 font-medium text-blue-600">
            <li>
              <Link href="/" onClick={() => setShowMobileMenu(false)}>
                {t('header.home')}
              </Link>
            </li>
            <li>
              <Link href="/events" onClick={() => setShowMobileMenu(false)}>
                {t('header.events')}
              </Link>
            </li>
            <li>
              <Link href="#" onClick={() => setShowMobileMenu(false)}>
                {t('header.partner')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;