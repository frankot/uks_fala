import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Image uploads go through a server action, and Next caps those bodies at
      // 1 MB by default — smaller than the 2 MB file limit the CMS advertises,
      // so every photo between the two failed with an opaque 500. Sized just
      // above MAX_UPLOAD_BYTES to leave room for multipart overhead, and kept
      // under Vercel's hard 4.5 MB request cap, which config cannot raise.
      bodySizeLimit: "3mb",
    },
  },
  // The plan zajęć moved from /zajecia to /grafik — keep links already shared
  // (Facebook posts, parent chats, search results) working.
  async redirects() {
    return [{ source: "/zajecia", destination: "/grafik", permanent: true }];
  },
  images: {
    // AVIF first, WebP as the fallback — both are re-encoded once and cached.
    formats: ["image/avif", "image/webp"],
    // Cloudinary URLs carry a version segment, so a long TTL never serves stale
    // art: editing an image in the CMS produces a new URL.
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
