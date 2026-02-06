import type { Metadata } from "next";
import { Source_Serif_4, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "UKS Fala Nieporęt — Szkoła Pływania i Sekcja Sportowa",
  description:
    "Nauka pływania dla dzieci i młodzieży w Nieporęcie. Szkoła pływania, sekcja sportowa, obozy. Doświadczeni trenerzy, bezpieczeństwo, indywidualne podejście.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${outfit.variable} ${sourceSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
