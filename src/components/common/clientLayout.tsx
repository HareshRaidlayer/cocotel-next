// src/components/common/clientLayout.tsx
"use client";

import { useState, useEffect, createContext, ReactNode } from "react";
import Loader from "@/components/Loader"; // Adjust path if needed
import { CurrencyProvider } from "@/lib/currency-context";

// Define the context type for TypeScript test
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value
export const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
});

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fallback: Hide loader after 3 seconds (adjust as needed for your site's load time)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Hide loader when all assets (e.g., video, images, fonts) are fully loaded
    const handleLoad = () => {
      setIsLoading(false);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <CurrencyProvider>
        {isLoading && <Loader />}
        <main className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
          {children}
        </main>
      </CurrencyProvider>
    </LoadingContext.Provider>
  );
}