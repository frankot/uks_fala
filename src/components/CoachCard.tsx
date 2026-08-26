import Image from "next/image";
import Link from "next/link";

export type CoachCardData = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  imageUrl: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type CoachCardProps = {
  coach: CoachCardData;
  className?: string;
};

export default function CoachCard({ coach, className = "" }: CoachCardProps) {
  return (
    <Link
      href={`/trenerzy/${coach.slug}`}
      className={`group block overflow-hidden rounded-3xl bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-900/8 ${className}`.trim()}
    >
      {/* Photo or initial placeholder */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-deep-700 to-deep-900">
        {coach.imageUrl ? (
          <Image
            src={coach.imageUrl}
            alt={coach.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <span className="font-editorial text-6xl font-bold text-white/20 select-none">
            {getInitials(coach.name)}
          </span>
        )}
        {/* Decorative wave */}
        <svg
          className="absolute -bottom-px left-0 block h-8 w-full text-white"
          viewBox="0 0 400 30"
          preserveAspectRatio="none"
        >
          <path
            d="M0,15 C100,30 200,0 300,15 C350,22 380,25 400,20 L400,30 L0,30 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="px-7 pb-7 pt-6 -mt-[3px]">
        <h3 className="text-lg font-bold text-sand-950">{coach.name}</h3>
        <p className="mt-1 text-[13px] font-semibold text-deep-500">
          {coach.role}
        </p>
        <p className="mt-4 line-clamp-5 text-[15px] leading-[1.7] text-sand-500">
          {coach.bio}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-deep-600 transition-colors group-hover:text-deep-800">
          Poznaj trenera
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
