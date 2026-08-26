// Serwowane z cache; edycje w CMS publikują się od razu przez revalidatePath
// w src/lib/actions/*. Godzina to tylko siatka bezpieczeństwa.
export const revalidate = 3600;

import { Suspense } from "react";
import type { Metadata } from "next";
import { getScheduleData } from "@/lib/queries/schedule";
import SchedulePage from "./SchedulePage";

export const metadata: Metadata = {
  title: "Plan zajęć — UKS Fala Nieporęt",
  description:
    "Sprawdź harmonogram treningów wszystkich grup pływackich UKS Fala. Wybierz grupę i zarezerwuj miejsce online.",
};

export default async function ZajeciaPage() {
  const data = await getScheduleData();

  return (
    <Suspense fallback={<div className="h-screen bg-sand-50" />}>
      <SchedulePage data={data} />
    </Suspense>
  );
}
