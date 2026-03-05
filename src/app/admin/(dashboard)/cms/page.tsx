import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAllNewsAdmin } from "@/lib/queries/news";
import { getAllAchievementsAdmin } from "@/lib/queries/achievements";
import GrafikTab from "./_components/GrafikTab";
import AktualnosciTab from "./_components/AktualnosciTab";
import OsiagnieciaTab from "./_components/OsiagnieciaTab";

const TABS = [
  { key: "grafik", label: "Grafik" },
  { key: "aktualnosci", label: "Aktualnosci" },
  { key: "osiagniecia", label: "Osiagniecia" },
];

export default async function CmsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "grafik" } = await searchParams;

  const groups =
    tab === "grafik"
      ? await prisma.group.findMany({
          include: { slots: true, prices: true },
          orderBy: { sortOrder: "asc" },
        })
      : [];

  const news = tab === "aktualnosci" ? await getAllNewsAdmin() : [];
  const achievements =
    tab === "osiagniecia" ? await getAllAchievementsAdmin() : [];

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold text-sand-900">CMS</h1>
        <p className="mt-1 text-[14px] text-sand-500">
          Zarządzaj trescia strony
        </p>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-0 border-b border-sand-200">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/cms?tab=${t.key}`}
            className={`px-4 py-2.5 text-[13px] font-bold transition-colors ${
              tab === t.key
                ? "border-b-2 border-coral-500 text-sand-900"
                : "text-sand-500 hover:text-sand-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "grafik" && (
        <GrafikTab groups={JSON.parse(JSON.stringify(groups))} />
      )}
      {tab === "aktualnosci" && (
        <AktualnosciTab news={JSON.parse(JSON.stringify(news))} />
      )}
      {tab === "osiagniecia" && (
        <OsiagnieciaTab
          achievements={JSON.parse(JSON.stringify(achievements))}
        />
      )}
    </div>
  );
}
