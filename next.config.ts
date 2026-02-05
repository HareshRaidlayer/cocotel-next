import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hel1.your-objectstorage.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: "https",
        hostname: "img.cocotel.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.cocotel.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cocotel.com.ph",
        pathname: "/**",
      },

      
    ],
    unoptimized: true,
  },
};

export default nextConfig;
