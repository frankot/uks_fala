import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Nie znaleziono strony — UKS Fala",
};

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main>
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
