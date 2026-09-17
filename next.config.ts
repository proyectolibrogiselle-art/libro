// ==============================================================================
// CARMENIBANEZ.CL - NEXT.JS CONFIGURATION
// Vercel Hard Redeploy Trigger: 2026-09-17T17:15:00-03:00
// Build ID & Cache Buster: v1.0.1-prod-build
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
