import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The plan zajęć moved from /zajecia to /grafik — keep links already shared
  // (Facebook posts, parent chats, search results) working.
  async redirects() {
    return [{ source: "/zajecia", destination: "/grafik", permanent: true }];
  },
  images: {
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
