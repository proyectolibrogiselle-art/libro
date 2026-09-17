// ==============================================================================
// CARMENIBANEZ.CL - NEXT.JS CONFIGURATION
// Production Build V1.0.3 - Environment Variables Active
// Timestamp: 2026-09-17T17:35:00-03:00
// ==============================================================================

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
