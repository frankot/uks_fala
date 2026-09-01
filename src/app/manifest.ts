import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UKS Fala Nieporęt",
    short_name: "UKS Fala",
    description:
      "Nauka pływania dla dzieci i młodzieży w Nieporęcie — szkoła pływania, sekcja sportowa, obozy.",
    lang: "pl",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a2540",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
