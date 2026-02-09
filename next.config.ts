import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Image optimization formats
    formats: ['image/webp', 'image/avif'],
    // Quality settings
    qualities: [75, 90],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Remote patterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Minimize layout shift
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-avatar', '@radix-ui/react-dialog'],
  },
  // Turbopack configuration (Next.js 16 default)
  turbopack: {},
  // Increase static page generation timeout
  staticPageGenerationTimeout: 120,
  // Production optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
