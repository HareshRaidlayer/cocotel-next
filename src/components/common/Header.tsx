"use client";

import React, { useState, useEffect,useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { login } from '@/lib/api-auth';
import { signIn, useSession, signOut } from 'next-auth/react';
import Button from "@/components/ui/Button";
import PhoneInput from "react-phone-number-input";

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
  const [loginForm, setLoginForm] = useState({ name: '', password: '', email: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
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
    try {
      const result = await login(loginForm, APP_NAME);
      console.log('Login successful:', result);
      setShowLoginModal(false);
      setLoginForm({ name: '', password: '', email: '' });
      alert('Login successful!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      // You can create a register API call here
      console.log('Register form:', registerForm);
      alert('Registration functionality to be implemented');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
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
          
          <div ref={wrapperRef} className="wrapper">
            <button onClick={() => setShowLoginModal(false)} className="text-white hover:text-gray-300 absolute z-10 right-3 top-3">
                <FiX size={24} />
              </button>
              <span className="bg-animate"></span>
              <span className="bg-animate2"></span>

              <div className="form-box login">
                  <h2 className="animation" style={{ "--i": 0, "--j": 21 } as React.CSSProperties}>Login</h2>
                  <form onSubmit={handleLogin}>
                      <div className="input-box animation" style={{ "--i": 1, "--j": 22 } as React.CSSProperties}>
                          <input 
                            type="text" 
                            value={loginForm.name}
                            onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                            required 
                          />
                          <label>Username</label>
                          <i className='bx bxs-user'></i>
                      </div>
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
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white w-full animation disabled:opacity-50" 
                        style={{ "--i": 4, "--j": 25 } as React.CSSProperties}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </button>
                      <div className="logreg-link animation" style={{ "--i": 5, "--j": 26 } as React.CSSProperties}>
                          <Link href="#" className="text-blue-500">Forgot Your Password?</Link>
                          <p>Dont have an account?  
                          <Link href="javascript:void(0)" onClick={handleRegisterClick} className="register-link"> Sign up</Link></p>
                      </div>
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
                  <form action="#">
                      <div className="input-box animation" style={{ "--i": 18, "--j": 1 } as React.CSSProperties} >
                          <input type="text" required />
                          <label>Username</label>
                          <i className='bx bxs-user'></i>
                      </div>
                      <div className="input-box animation" style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
                          <input type="text" required />
                          <label>Email</label>
                          <i className='bx bxs-envelope' ></i>
                      </div>
                      {/* <div
                          className="select-box animation"
                          style={{ "--i": 19, "--j": 2 } as React.CSSProperties}
                          >
                          <select required>
                              <option value="+91">India (+91)</option>
                              <option value="+1">USA (+1)</option>
                              <option value="+44">UK (+44)</option>
                              <option value="+61">Australia (+61)</option>
                          </select>
                          <label>Country Code</label>
                      </div>
                      <div className="input-box animation" style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
                          <input type="number" required />
                          <label>Phone</label>
                          <i className='bx bxs-envelope' ></i>
                      </div> */}
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
                          <input type="password" required />
                          <label>Password</label>
                          <i className='bx bxs-lock-alt' ></i>
                      </div>
                      <div className=" form-check animation mb-2" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
                          <input type="checkbox" required checked/>  I agree to the <Link className='text-blue-500' href="#"> Terms and Conditions</Link>
                      </div>
                      {/* <button className="px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white w-full animation" style={{ "--i": 21, "--j": 4 } as React.CSSProperties} type="submit" >Sign up</button> */}
                      <Button className="w-full animation" name="Sign up"  style={{ "--i": 21, "--j": 4 } as React.CSSProperties}/>
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