import { Suspense } from "react";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SchedulePage from "./SchedulePage";

export const metadata: Metadata = {
  title: "Plan zajęć — UKS Fala Nieporęt",
  description:
    "Sprawdź harmonogram treningów wszystkich grup pływackich UKS Fala. Wybierz grupę i zarezerwuj miejsce online.",
};

export default function ZajeciaPage() {
  return (
    <>
      <Navigation />
      <main>
        <Suspense fallback={<div className="h-screen bg-sand-50" />}>
          <SchedulePage />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
