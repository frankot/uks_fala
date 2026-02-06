import Image from "next/image";

export default function About() {
  return (
    <section id="o-nas" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-center gap-16 md:grid-cols-12 md:gap-12">
          {/* Left — text (takes more space, asymmetric) */}
          <div className="md:col-span-7 md:pr-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-coral-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                O klubie
              </span>
            </div>

            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
              Pływanie to nasza pasja
              <span className="block text-deep-500">
                — i&nbsp;przekazujemy ją dalej
              </span>
            </h2>

            <div className="mt-8 space-y-5">
              <p className="text-[17px] leading-[1.75] text-sand-600">
                UKS Fala Nieporęt to klub sportowy działający przy basenie OSiR
                w&nbsp;Nieporęcie. Od ponad dekady uczymy dzieci i&nbsp;młodzież
                pływania — od pokonywania lęku przed wodą, przez doskonalenie
                techniki, aż po przygotowanie do startów w&nbsp;zawodach.
              </p>
              <p className="text-[17px] leading-[1.75] text-sand-600">
                Łączymy naukę pływania z&nbsp;wychowaniem przez sport. Każde
                dziecko rozwija się we własnym tempie, a&nbsp;nasi trenerzy dbają
                o&nbsp;to, by postępy przychodziły z&nbsp;radością i&nbsp;w&nbsp;pełnym
                bezpieczeństwie.
              </p>
            </div>

            {/* Credential strip */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-full bg-deep-50 px-4 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-deep-800">
                  Polski Związek Pływacki
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-full bg-sand-100 px-4 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sand-800">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-sand-800">
                  Licencjonowany klub
                </span>
              </div>
            </div>
          </div>

          {/* Right — image composition */}
          <div className="relative md:col-span-5">
            {/* Main image placeholder */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-deep-50">
              <Image
                src="/fala-about.jpg"
                alt="Dzieci na zajęciach pływania"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Overlapping accent card */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-deep-800 p-5 shadow-xl shadow-deep-900/20 md:-left-12">
              <p className="font-editorial text-3xl font-bold text-white">
                10<span className="text-pool-400">+</span>
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-deep-200">
                lat z&nbsp;młodymi pływakami
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
