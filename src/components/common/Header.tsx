"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { login } from '@/lib/api-auth';
import { signIn, useSession, signOut } from 'next-auth/react';

import { useLocale } from '@/lib/locale-context';

// Define the Country interface
interface Country {
  code: string;
  name: string;
  locale: string;
}
const currency = [
  { code: "ph", name: "Filipino", locale: "ph" },
  { code: "id", name: "Indonesian",  locale: "id" },
  { code: "en", name: "English", locale: "en" },
];

const Header = () => {
  const { locale, setLocale, t } = useLocale();
  const { data: session } = useSession();
  const APP_NAME = 'app3534482538357';
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(currency[0]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const cartItems = ["Item 1", "Item 2", "Item 3"];
  type UserOption = {
    label: string;
    href?: string;
    action?: () => void | Promise<void>;
  };

  const handleLogout = async () => {
    // Clear local storage for regular login
    localStorage.removeItem(`${APP_NAME}_accessToken`);
    localStorage.removeItem(`${APP_NAME}_refreshToken`);
    localStorage.removeItem(`${APP_NAME}_user`);
    localStorage.removeItem(`${APP_NAME}_accessTokenExpiry`);
    localStorage.removeItem(`${APP_NAME}_refreshTokenExpiry`);
    
    // Sign out from NextAuth (Google/Facebook)
    await signOut({ callbackUrl: '/' });
  };

  const userOptions: UserOption[] = session ? [
    { label: session.user?.name || 'User', href: '/profile' },
    { label: t('header.settings'), href: '/settings' },
    { label: t('header.logout'), action: handleLogout }
  ] : [
    { label: t('header.login'), action: () => setShowLoginModal(true) }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginForm, APP_NAME);
      setShowLoginModal(false);
      setLoginForm({ name: '', password: '' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleFacebookLogin = () => {
    signIn('facebook', { callbackUrl: '/' });
  };

  useEffect(() => {
    const currentCountry = currency.find(c => c.locale === locale) || currency[0];
    setSelectedCountry(currentCountry);
  }, [locale]);

  // Handle country change
  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setLocale(country.locale);
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
          {/* Country Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium text-white bg-[#4CAA42] hover:bg-green-600"
            >
              {selectedCountry.name} <FiChevronDown />
            </button>
            {showCountryDropdown && (
              <ul className="absolute right-0 mt-2 bg-white border rounded shadow w-44 z-50">
                <div className="bg-[#4CAA42] rounded-t-[5px] text-white font-semibold p-2 flex items-center justify-between">
                  <span>{t('header.currency')}</span>
                  <div
                    onClick={() => setShowCountryDropdown(false)}
                    className="bg-white text-[#4CAA42] cursor-pointer text-sm font-bold p-1 rounded-full"
                  >
                    <RxCross2 />
                  </div>
                </div>
                {currency.map((country) => (
                  <li
                    key={country.code}
                    onClick={() => handleCountryChange(country)}
                    className="px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer flex items-center gap-2"
                  >
                    {country.name}
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
                    {option.href ? (
                      <Link
                        href={option.href}
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer"
                      >
                        {option.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          option.action?.();
                          setShowUserDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer"
                      >
                        {option.label}
                      </button>
                    )}
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

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Login</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={loginForm.name}
                onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="mt-4 space-y-2">
              <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                <FaGoogle /> Login with Google
              </button>
              <button onClick={handleFacebookLogin} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                <FaFacebook /> Login with Facebook
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Dont have an account?{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                }}
                className="text-green-600 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Register</h2>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Register
              </button>
            </form>
            <div className="mt-4 space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                <FaGoogle /> Register with Google
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                <FaFacebook /> Register with Facebook
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setShowLoginModal(true);
                }}
                className="text-green-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;