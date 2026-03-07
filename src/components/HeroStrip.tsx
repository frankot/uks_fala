import Link from "next/link";

interface HeroStripProps {
  backHref: string;
  backLabel: string;
  tag: string;
  tagColor?: "pool" | "coral";
  title: string;
  subtitle?: string;
  description?: string;
}

export default function HeroStrip({
  backHref,
  backLabel,
  tag,
  tagColor = "pool",
  title,
  subtitle,
  description,
}: HeroStripProps) {
  const tagColors = {
    pool: {
      line: "bg-pool-400",
      text: "text-pool-400",
      subtitle: "text-pool-300",
    },
    coral: {
      line: "bg-coral-400",
      text: "text-coral-500",
      subtitle: "text-coral-300",
    },
  };
  const c = tagColors[tagColor];

  return (
    <div className="relative overflow-hidden bg-deep-900 pt-28 pb-16">
      <div className="grain absolute inset-0" />
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pool-500/10 blur-[80px]" />
      <div className="absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-coral-500/10 blur-[60px]" />
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-deep-200/50 transition-colors hover:text-deep-200"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {backLabel}
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className={`h-px w-10 ${c.line}`} />
          <span
            className={`text-[12px] font-bold uppercase tracking-[0.2em] ${c.text}`}
          >
            {tag}
          </span>
        </div>
        <h1 className="font-editorial mt-3 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.02em] text-white">
          {title}
          {subtitle && (
            <span className={`block ${c.subtitle}`}>{subtitle}</span>
          )}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-deep-200/60">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
