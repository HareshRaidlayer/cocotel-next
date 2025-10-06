"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

const countries = [
  { name: "United States", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "Malaysia", code: "+1" },
  { name: "Indonesia", code: "+49" },
 { name: "Philippines", code: "+63" },
];

const RegisterPage = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0].code);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountryName =
    countries.find((country) => country.code === selectedCountry)?.name || "";

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center relative flex items-start justify-end pt-6 sm:pt-8 px-4 sm:px-8"
      style={{
        backgroundImage:
          "url('https://www.cocotel.com/frontend/images/upload/banner/Beach1.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-green-700 opacity-40 z-0"></div>

      {/* Register Card */}
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-[736px] mt-6 sm:mt-[30px] relative z-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Sign up/Register
        </h2>

        <form className="space-y-6">
          {/* First Name & Last Name */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full p-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md transition"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full p-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md transition"
              />
            </div>
          </div>

          {/* Email & Country Code */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="text"
                className="w-full p-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md transition"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">
                Country Code
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded border shadow-sm text-sm font-medium text-green-700 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 hover:shadow-md transition"
                >
                  {selectedCountryName} ({selectedCountry}){" "}
                  <FiChevronDown className="ml-1" />
                </button>
                {showDropdown && (
                  <ul className="absolute z-20 mt-2 bg-white border rounded shadow w-full max-h-48 overflow-y-auto">
                    {countries.map((country) => (
                      <li
                        key={country.name}
                        onClick={() => {
                          setSelectedCountry(country.code);
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-green-100 text-sm text-green-700 cursor-pointer"
                      >
                        {country.name} ({country.code})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Phone & Password */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                className="w-full p-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md transition"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="text"
                className="w-full p-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md transition"
              />
            </div>
          </div>
          {/* Confirm Password & T&C */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md transition"
              />
            </div>
            <div className="w-full sm:w-1/2 flex items-start sm:items-center pt-1 sm:pt-6">
              <input type="checkbox" className="mr-2 mt-1 sm:mt-0" />
              <label className="text-sm leading-snug">
                I agree to the{" "}
                <link href="#" className="text-green-600 font-medium">
                  Terms and Conditions
                </link>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow hover:shadow-lg transition"
          >
            Register
          </button>
          <div className="flex items-center space-x-1 justify-center">
            <p className="text-black">Already have an account?</p>
            <link href="/login" className="text-green-600 hover:underline">
              Login
            </link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
