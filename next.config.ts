import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hel1.your-objectstorage.com',
        port: '', // Leave empty if no port
        pathname: '/**', // Allows any path; adjust as needed (e.g., '/images/**')
      },
    ],
  },
};

export default nextConfig;
