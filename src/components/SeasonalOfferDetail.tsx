import Link from "next/link";
import { formatOfferDateRange } from "./SeasonalOfferCard";

export interface SeasonalOfferDetailItem {
  title: string;
  summary: string;
  locationName: string;
  locationAddress: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  ageRange: string | null;
  price: string | null;
  priceNote: string | null;
  accommodation: string | null;
  meals: string | null;
  transport: string | null;
  program: string;
  included: string | null;
  signupInfo: string | null;
  signupUrl: string | null;
  images: string[];
}

interface Props {
  offer: SeasonalOfferDetailItem;
  backHref: "/obozy" | "/polkolonie";
  backLabel: string;
  tag: string;
  accent?: "pool" | "coral";
}

const SIGNUP_BUTTON_CLASS =
  "mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-coral-500 px-5 text-[13px] font-bold uppercase tracking-wider text-white transition-all hover:bg-coral-600";

function SignupButton({ href }: { href: string }) {
  // Paths and anchors stay in-app; anything else is a link out of the site, and
  // http(s) targets get their own tab so the offer page is not lost.
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={SIGNUP_BUTTON_CLASS}>
        Zarezerwuj miejsce
      </Link>
    );
  }

  const opensNewTab = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
      className={SIGNUP_BUTTON_CLASS}
    >
      Zarezerwuj miejsce
    </a>
  );
}

function TextBlock({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  return (
    <section className="rounded-[1.5rem] border border-sand-200 bg-white p-6 shadow-sm">
      <h2 className="font-editorial text-2xl font-bold tracking-[-0.02em] text-sand-950">
        {title}
      </h2>
      <div className="mt-4 space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[15px] leading-[1.8] text-sand-600">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="border-b border-white/10 py-4 last:border-b-0">
      <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-deep-300/50">
        {label}
      </dt>
      <dd className="mt-1 text-[15px] font-semibold leading-snug text-white">
        {value}
      </dd>
    </div>
  );
}

export default function SeasonalOfferDetail({
  offer,
  backHref,
  backLabel,
  tag,
  accent = "pool",
}: Props) {
  const accentText = accent === "coral" ? "text-coral-300" : "text-pool-300";
  const accentBg = accent === "coral" ? "bg-coral-500" : "bg-pool-500";
  const dateRange = formatOfferDateRange(offer.startDate, offer.endDate);
  // Admins paste a signup form link (Google Forms etc.) per offer; without one
  // the button falls back to that offer type's listing page.
  const signupHref = offer.signupUrl?.trim() || backHref;

  return (
    <article className="bg-sand-50">
      <header className="relative overflow-hidden bg-deep-900 pt-28 pb-16">
        <div className="grain absolute inset-0" />
        <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-pool-500/10 blur-[100px]" />
        <div className="absolute -bottom-24 left-10 h-[320px] w-[320px] rounded-full bg-coral-500/10 blur-[90px]" />
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-deep-200/50 transition-colors hover:text-deep-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {backLabel}
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className={`h-px w-10 ${accentBg}`} />
                <span className={`text-[12px] font-bold uppercase tracking-[0.2em] ${accentText}`}>
                  {tag}
                </span>
              </div>
              <h1 className="font-editorial mt-4 max-w-4xl text-[clamp(2.4rem,6vw,4.8rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white">
                {offer.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.75] text-deep-200/65">
                {offer.summary}
              </p>
            </div>

            <dl className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.06] p-6 backdrop-blur-md">
              <InfoRow label="Termin" value={dateRange} />
              <InfoRow label="Miejsce" value={offer.locationName} />
              <InfoRow label="Wiek" value={offer.ageRange} />
              <InfoRow label="Cena" value={offer.price} />
            </dl>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-6">
            <TextBlock title="Program" body={offer.program} />
            <TextBlock title="Co zawiera oferta" body={offer.included} />
            <TextBlock title="Zakwaterowanie" body={offer.accommodation} />
            <TextBlock title="Wyżywienie" body={offer.meals} />
            <TextBlock title="Transport" body={offer.transport} />
            <TextBlock title="Zapisy i informacje organizacyjne" body={offer.signupInfo} />
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-deep-900 text-white shadow-xl shadow-deep-900/15">
              <div className="grain absolute inset-0" />
              <div className="relative p-6">
                <h2 className="font-editorial text-2xl font-bold">
                  Najważniejsze informacje
                </h2>
                <dl className="mt-4 divide-y divide-white/10">
                  <InfoRow label="Termin" value={dateRange} />
                  <InfoRow label="Miejsce" value={offer.locationName} />
                  <InfoRow label="Adres" value={offer.locationAddress} />
                  <InfoRow label="Wiek" value={offer.ageRange} />
                  <InfoRow label="Cena" value={offer.price} />
                </dl>
                {offer.priceNote && (
                  <p className="mt-4 rounded-2xl bg-white/[0.06] p-4 text-[13px] leading-relaxed text-deep-200/70">
                    {offer.priceNote}
                  </p>
                )}
                <SignupButton href={signupHref} />
              </div>
            </div>
          </aside>
        </div>

        {offer.images.length > 0 && (
          <div className="mt-10 space-y-4">
            <img
              src={offer.images[0]}
              alt={offer.title}
              className="min-h-[360px] w-full rounded-[2rem] object-cover shadow-xl shadow-deep-900/10 lg:min-h-[560px]"
            />
            {offer.images.length > 1 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {offer.images.slice(1, 4).map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    alt={`${offer.title} — zdjęcie ${index + 2}`}
                    className="h-56 w-full rounded-[1.5rem] object-cover shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
