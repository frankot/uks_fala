// Serwowane z cache; edycje w CMS publikują się od razu przez revalidatePath
// w src/lib/actions/*. Godzina to tylko siatka bezpieczeństwa.
export const revalidate = 3600;

import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import HeroStrip from "@/components/HeroStrip";
import { getScheduleData } from "@/lib/queries/schedule";
import SchedulePage from "./SchedulePage";

export const metadata: Metadata = {
  title: "Plan zajęć — UKS Fala Nieporęt",
  description:
    "Sprawdź harmonogram treningów wszystkich grup pływackich UKS Fala. Wybierz grupę i zarezerwuj miejsce online.",
};

export default async function ZajeciaPage() {
  const data = await getScheduleData();

  // No groups published yet. SchedulePage assumes at least one exists (it reads
  // `GROUPS.find(...)!` for the active group), and inventing a demo timetable
  // here would put fictional lesson times on a live domain.
  if (data.groups.length === 0) {
    return (
      <div className="min-h-screen bg-sand-50">
        <HeroStrip
          backHref="/"
          backLabel="Strona główna"
          tag="Harmonogram"
          title="Plan zajęć"
          subtitle="UKS Fala"
        />
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
          <div className="rounded-2xl border border-sand-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <h2 className="font-editorial text-[1.8rem] font-bold leading-tight text-sand-950">
              Harmonogram w przygotowaniu
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.7] text-sand-500">
              Plan zajęć na najbliższy semestr nie został jeszcze opublikowany.
              Skontaktuj się z nami, a dobierzemy grupę odpowiednią dla Twojego
              dziecka.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="tel:+48530077078"
                className="flex h-13 w-full items-center justify-center rounded-xl bg-coral-500 px-6 text-[15px] font-bold text-white transition-all hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/20 sm:w-auto"
              >
                +48 530 077 078
              </a>
              <Link
                href="/#kontakt"
                className="flex h-13 w-full items-center justify-center rounded-xl border-2 border-sand-200 px-6 text-[15px] font-bold text-sand-700 transition-colors hover:border-sand-300 hover:bg-sand-100 sm:w-auto"
              >
                Napisz do nas
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="h-screen bg-sand-50" />}>
      <SchedulePage data={data} />
    </Suspense>
  );
}
