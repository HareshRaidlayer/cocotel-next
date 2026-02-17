"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchFromAPI } from './api';

interface CountryApiItem {
  sectionData: {
    country: {
      countrycode: string;
      countryname: string;
      currency: string;
      currencysymbol: string;
      currencyrate: string;
      image: string;
    };
  };
}

interface Country {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  currencyRate: number;
  image: string;
}

interface CurrencyContextType {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  convertPrice: (phpPrice: number) => number;
  formatPrice: (phpPrice: number | string) => string;
  countries: Country[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countryRes = await fetchFromAPI({
          appName: "app3534482538357",
          moduleName: "country",
          query: {
            "sectionData.country.is_active": true,
          },
        });

        if (countryRes && Array.isArray(countryRes)) {
          const formattedCountries = countryRes.map((item: CountryApiItem) => ({
            code: item.sectionData.country.countrycode,
            name: item.sectionData.country.countryname,
            currency: item.sectionData.country.currency,
            symbol: item.sectionData.country.currencysymbol,
            currencyRate: parseFloat(item.sectionData.country.currencyrate),
            image: item.sectionData.country.image,
          }));
          setCountries(formattedCountries);
          
          // Set Philippines as default
          const philippines = formattedCountries.find((c: Country) => c.code === 'PH');
          setSelectedCountry(philippines || formattedCountries[0]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const convertPrice = (phpPrice: number): number => {
    if (!selectedCountry) return phpPrice;
    return phpPrice * selectedCountry.currencyRate;
  };

  const formatPrice = (phpPrice: number | string): string => {
    // Convert string to number, remove commas if present
    let numPrice = typeof phpPrice === 'string' ? parseFloat(phpPrice.replace(/,/g, '')) : phpPrice;
    
    // Handle NaN or invalid values
    if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
      return '₱0';
    }
    
    // Ensure it's a valid number
    numPrice = Number(numPrice);
    
    if (!selectedCountry || selectedCountry.code === 'PH') {
      return `₱${Math.round(numPrice).toLocaleString('en-US')}`;
    }
    
    const converted = convertPrice(numPrice);
    return `${selectedCountry.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider value={{ selectedCountry, setSelectedCountry, convertPrice, formatPrice, countries }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
