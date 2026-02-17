"use client";

import React, { useState, useEffect,useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { signIn, useSession, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import PhoneInput from "react-phone-number-input";
import { loginUser, registerUser } from '@/lib/api-auth';

import { fetchFromAPI } from "@/lib/api";
import { useLocale } from '@/lib/locale-context';
import { useCurrency } from '@/lib/currency-context';

interface Country {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  currencyRate: number;
  image: string;
}

// Define the Language interface
interface Language {
  code: string;
  name: string;
  locale: string;
}
interface LanguageApiItem {
  sectionData: {
    language: {
      languagecode: string;
      languagename: string;
      is_active?: boolean;
      tag?: string;
    };
  };
}

// Define the Country interface
interface Country {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  image: string;
}
interface CountryApiItem {
  sectionData: {
    country: {
      countrycode: string;
      countryname: string;
      currency: string;
      currencysymbol: string;
      image: string;
      is_active?: boolean;
      tag?: string;
    };
  };
}


const Header = () => {
  const { locale, setLocale, t } = useLocale();
  const { selectedCountry, setSelectedCountry, countries } = useCurrency();
  const { data: session } = useSession();
  const APP_NAME = 'app3534482538357';
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', password: '', email: '' });
  const [loginError, setLoginError] = useState('');
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [registerError, setRegisterError] = useState('');
  // const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [phone, setPhone] = useState<string | undefined>();
    const wrapperRef = useRef<HTMLDivElement>(null);
  
    const handleRegisterClick = () => {
      if (wrapperRef.current) {
        wrapperRef.current.classList.add('active');
      }
    };
  
    const handleLoginClick = () => {
      if (wrapperRef.current) {
        wrapperRef.current.classList.remove('active');
      }
    };

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
    setLoginError('');
    try {
      const loginResult = await loginUser({
        name: loginForm.email || '',
        password: loginForm.password,
      });
      
      if (loginResult.success) {
        await signIn('credentials', {
          email: loginForm.email,
          password: loginForm.password,
          redirect: false,
        });
        setShowLoginModal(false);
        setLoginForm({ name: '', password: '', email: '' });
        toast.success('Login successful!');
      } else {
        setLoginError(loginResult.message || 'Login failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError('');
    try {
      const registerResult = await registerUser({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        phone: phone,
      });
      
      if (registerResult.success) {
        setShowLoginModal(false);
        setRegisterForm({ name: '', email: '', password: '' });
        setPhone(undefined);
        toast.success('Registration successful!');
      } else {
        setRegisterError(registerResult.message || 'Registration failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setRegisterError(errorMessage);
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
          const formattedLanguages = (languageRes as LanguageApiItem[]).map(
  (lang) => ({
    code: lang.sectionData.language.languagecode,
    name: lang.sectionData.language.languagename,
    locale: lang.sectionData.language.languagecode,
  })
);
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
  }, [locale]);

  // Update selected language when locale changes
  useEffect(() => {
    if (languages.length > 0) {
      const currentLanguage = languages.find(l => l.locale === locale) || languages[0];
      setSelectedLanguage(currentLanguage);
    }
  }, [locale, languages]);

  // Handle country change
  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

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
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium text-white bg-[#4CAA42] hover:bg-green-600"
            >
              {selectedCountry ? `${selectedCountry.currency} - ${selectedCountry.symbol}` : 'Currency'} <FiChevronDown />
            </button>
            {showCountryDropdown && (
              <ul className="absolute right-0 mt-2 bg-white border rounded shadow w-56 z-50">
                <div className="bg-[#4CAA42] rounded-t-[5px] text-white font-semibold p-2 flex items-center justify-between">
                  <span>Currency</span>
                  <div
                    onClick={() => setShowCountryDropdown(false)}
                    className="bg-white text-[#4CAA42] cursor-pointer text-sm font-bold p-1 rounded-full"
                  >
                    <RxCross2 />
                  </div>
                </div>
                {countries.map((country) => (
                  <li
                    key={country.code}
                    onClick={() => handleCountryChange(country)}
                    className="px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer flex items-center gap-2"
                  >
                    <Image src={country.image} alt={country.name} width={20} height={15} className="object-cover" />
                    {country.name} - {country.symbol}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
              <ul className="absolute z-100 mt-2 bg-white border rounded shadow w-40 right-0">
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
                        className="block px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer truncate"
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
          
          <div ref={wrapperRef} className="wrapper">
            <button onClick={() => setShowLoginModal(false)} className="text-white hover:text-gray-300 absolute z-10 right-3 top-3">
                <FiX size={24} />
              </button>
              <span className="bg-animate"></span>
              <span className="bg-animate2"></span>

              <div className="form-box login">
                  <h2 className="animation" style={{ "--i": 0, "--j": 21 } as React.CSSProperties}>Login</h2>
                  <form onSubmit={handleLogin}>
                      
                      <div className="input-box animation" style={{ "--i": 2, "--j": 23 } as React.CSSProperties}>
                          <input 
                            type="email" 
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required 
                          />
                          <label>Email</label>
                          <i className='bx bxs-envelope'></i>
                      </div>
                      <div className="input-box animation" style={{ "--i": 3, "--j": 24 } as React.CSSProperties}>
                          <input 
                            type="password" 
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required 
                          />
                          <label>Password</label>
                          <i className='bx bxs-lock-alt' ></i>
                      </div>
                      {loginError && (
                        <div className="text-red-500 text-sm mt-1 animation px-2" style={{ "--i": 3, "--j": 24 } as React.CSSProperties}>
                          {loginError}
                        </div>
                      )}
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white w-full animation disabled:opacity-50" 
                        style={{ "--i": 4, "--j": 25 } as React.CSSProperties}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </button>
                      
                  </form>
                  <div className="mt-4 text-white flex justify-center items-center animation" style={{ "--i": 6, "--j": 27 } as React.CSSProperties}>
                    <button title="Google login" onClick={handleGoogleLogin} className=" flex items-center justify-center gap-2  py-2 " >
                      <Image
                          src="/logo/google-icon.svg"
                          alt="Google Login"
                          width={40}
                          height={40}
                          className="object-contain animation"
                          loading="lazy"
                      />
                    </button>
                    {/* <p className="mx-5">OR</p> */}
                    <button title="Facebook login" onClick={handleFacebookLogin} className=" ms-6 flex items-center justify-center gap-2  py-2" >
                      <Image
                          src="/logo/Facebook-Icon.svg"
                          alt="Facebool Login"
                          width={40}
                          height={40}
                          className="object-contain animation"
                          loading="lazy"
                      />
                    </button>
                  </div>
                  <div className="logreg-link animation" style={{ "--i": 5, "--j": 26 } as React.CSSProperties}>
                          <Link href="#" className="text-blue-500">Forgot Your Password?</Link>
                          <p>Dont have an account?  
                          <Link href="javascript:void(0)" onClick={handleRegisterClick} className="register-link"> Sign up</Link></p>
                      </div>
              </div>
              <div className="info-text login">
                  <Image
                      src="/logo/footer.svg"
                      alt="Cocotel Logo"
                      width={200}
                      height={54}
                      className="object-contain animation"
                      loading="lazy"
                      style={{ "--i": 0, "--j": 22 } as React.CSSProperties}
                  />
                  <h2 className="animation " style={{ "--i": 1, "--j": 21 } as React.CSSProperties}>Welcome back!</h2>
              </div>

              <div className="form-box register ">
                  <h2 className="animation" style={{ "--i": 17, "--j": 0 } as React.CSSProperties}>Sign up</h2>
                  <form onSubmit={handleRegister}>
                      <div className="input-box animation" style={{ "--i": 18, "--j": 1 } as React.CSSProperties} >
                          <input 
                            type="text" 
                            value={registerForm.name}
                            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                            required 
                          />
                          <label>Username</label>
                          <i className='bx bxs-user'></i>
                      </div>
                      <div className="input-box animation" style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
                          <input 
                            type="email" 
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            required 
                          />
                          <label>Email</label>
                          <i className='bx bxs-envelope' ></i>
                      </div>
                      
                      <div className="phone-input-box animation" style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
                          <PhoneInput
                              international
                              defaultCountry="IN"
                              value={phone}
                              onChange={setPhone}
                              className="flex "
                          />
                          <label>Phone Number</label>
                      </div>
                      <div className="input-box animation" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
                          <input 
                            type="password" 
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            required 
                          />
                          <label>Password</label>
                          <i className='bx bxs-lock-alt' ></i>
                      </div>
                      {registerError && (
                        <div className="text-red-500 text-sm mt-1 px-2 animation" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
                          {registerError}
                        </div>
                      )}
                      <div className=" form-check animation mb-2" style={{ "--i": 21, "--j": 4 } as React.CSSProperties}>
                          <input type="checkbox" required checked/>  I agree to the <Link className='text-blue-500' href="#"> Terms and Conditions</Link>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white w-full animation disabled:opacity-50" 
                        style={{ "--i": 21, "--j": 4 } as React.CSSProperties}
                      >
                        {isLoading ? 'Signing up...' : 'Sign up'}
                      </button>
                      <div className="logreg-link animation" style={{ "--i": 22, "--j": 5 } as React.CSSProperties}>
                          <p>Already have an account?
                          <Link href="javascript:void(0)" onClick={handleLoginClick} className="login-link"> Login</Link></p>
                      </div>
                  </form>
              </div>

              <div className="info-text register">
                  <Image
                      src="/logo/footer.svg"
                      alt="Cocotel Logo"
                      width={200}
                      height={54}
                      className="object-contain animation"
                      loading="lazy"
                      style={{ "--i": 17, "--j": 0 } as React.CSSProperties}
                  />
                  <h2 className="animation" style={{ "--i": 17, "--j": 0 } as React.CSSProperties}>Welcome!</h2>
              </div>
          </div>
        </div>
      )}

      
    </header>
    
  );
};

export default Header;