import Link from "next/link";
import CmsImage from "@/components/CmsImage";

export interface SeasonalOfferCardItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  locationName: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
  ageRange: string | null;
  price: string | null;
  images: string[];
  featured: boolean;
}

export function formatOfferDateRange(
  startDate: Date | string | null,
  endDate: Date | string | null,
) {
  if (!startDate && !endDate) return "Termin wkrótce";
  const formatter = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (startDate && endDate) {
    return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`;
  }
  return formatter.format(new Date(startDate ?? endDate ?? ""));
}

interface Props {
  offer: SeasonalOfferCardItem;
  basePath: "/obozy" | "/polkolonie";
  accent?: "pool" | "coral";
}

export default function SeasonalOfferCard({
  offer,
  basePath,
  accent = "pool",
}: Props) {
  const accentClasses =
    accent === "coral"
      ? "bg-coral-50 text-coral-600"
      : "bg-pool-50 text-pool-600";

  return (
    <Link
      href={`${basePath}/${offer.slug}`}
      className="group overflow-hidden rounded-[1.75rem] border border-sand-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-900/8"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-pool-100 via-sand-100 to-deep-100">
        {offer.images[0] ? (
          <CmsImage
            src={offer.images[0]}
            alt={offer.title}
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-deep-300">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 20h18" />
              <path d="M4 20a8 8 0 0 1 16 0" />
              <path d="M12 4v8" />
              <path d="M8 8l4-4 4 4" />
            </svg>
          </div>
        )}
        {offer.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-coral-600 shadow-sm backdrop-blur">
            Wyróżnione
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${accentClasses}`}>
            {formatOfferDateRange(offer.startDate, offer.endDate)}
          </span>
          {offer.price && (
            <span className="rounded-full bg-sand-100 px-3 py-1 text-[12px] font-bold text-sand-600">
              {offer.price}
            </span>
          )}
        </div>

        <h2 className="font-editorial mt-4 text-[1.45rem] font-bold leading-tight tracking-[-0.02em] text-sand-950 transition-colors group-hover:text-deep-700">
          {offer.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-sand-500">
          {offer.summary}
        </p>

        <div className="mt-5 space-y-2 border-t border-sand-100 pt-5 text-[13px] text-sand-600">
          <div className="flex items-center gap-2">
            <span className="text-pool-500">●</span>
            <span>{offer.locationName}</span>
          </div>
          {offer.ageRange && (
            <div className="flex items-center gap-2">
              <span className="text-coral-500">●</span>
              <span>{offer.ageRange}</span>
            </div>
          )}
        </div>

        <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-deep-700">
          Zobacz szczegóły
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
