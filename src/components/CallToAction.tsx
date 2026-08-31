"use client";

import { useEffect, useState } from "react";
import {
  CONTACT_ID,
  CONTACT_FORM_ID,
  scrollToContact,
} from "@/lib/scroll-to-contact";

const EMPTY_FORM = {
  name: "",
  email: "",
  childAge: "",
  message: "",
  // Honeypot — hidden from real users, so a value here means a bot.
  company: "",
};

export default function CallToAction() {
  // Arriving from another page lands on the browser's own anchor jump, which leaves
  // the form mostly below the fold — reposition it once the card has laid out.
  useEffect(() => {
    if (window.location.hash !== `#${CONTACT_ID}`) return;
    const frame = requestAnimationFrame(() => scrollToContact("auto"));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Mirrors the submit/status pattern in grafik/SchedulePage.tsx.
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "kontakt" }),
      });
      if (res.ok) {
        setStatus("ok");
        setForm(EMPTY_FORM);
      } else {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? "");
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div
          id={CONTACT_ID}
          className="relative scroll-mt-24 overflow-hidden rounded-[2rem] bg-deep-900"
        >
          {/* Grain */}
          <div className="grain absolute inset-0 rounded-[2rem]" />
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 h-[40vh] w-[40vh] rounded-full bg-coral-500/15 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-[30vh] w-[30vh] rounded-full bg-pool-500/10 blur-[80px]" />

          <div className="relative z-10 grid lg:grid-cols-2">
            {/* Left — copy */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-pool-400" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-400">
                  Kontakt
                </span>
              </div>

              <h2 className="font-editorial text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
                Zapisz dziecko
                <span className="block text-pool-300">na zajęcia pływania</span>
              </h2>
              <p className="mt-5 max-w-md text-[17px] leading-[1.7] text-deep-200/60">
                Nowy semestr startuje już wkrótce. Skontaktuj się z&nbsp;nami,
                żeby dobrać odpowiednią grupę i&nbsp;zarezerwować miejsce. Do
                naszych grup możesz dołączyć przez cały rok!
              </p>

              {/* Contact methods */}
              <div className="mt-10 space-y-5">
                <a
                  href="tel:+48530077078"
                  className="group flex items-center gap-4 text-white transition-colors hover:text-coral-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] transition-colors group-hover:bg-coral-500/20">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-deep-300/50">
                      Zadzwoń
                    </p>
                    <p className="text-lg font-bold">+48 530 077 078</p>
                  </div>
                </a>

                <a
                  href="mailto:biuro@uksfala.com.pl"
                  className="group flex items-center gap-4 text-white transition-colors hover:text-coral-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] transition-colors group-hover:bg-coral-500/20">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-deep-300/50">
                      Napisz
                    </p>
                    <p className="text-lg font-bold">biuro@uksfala.com.pl</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-deep-300/50">
                      Basen OSiR Nieporęt
                    </p>
                    <p className="text-lg font-bold">
                      Stanisławów Pierwszy, ul. Koncertowa 4
                    </p>
                    <p className="text-[14px] text-deep-200/60">05-126 Nieporęt</p>
                  </div>
                </div>
              </div>

              {/* Dane klubu */}
              <div className="mt-10 border-t border-white/8 pt-6">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-deep-300/50">
                  Dane klubu
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-deep-200/60">
                  Uczniowski Klub Sportowy Fala Nieporęt
                  <br />
                  Stanisławów Pierwszy, ul. Koncertowa 4, 05-126 Nieporęt
                  <br />
                  NIP 536 19 22 255 &middot; REGON 363628020
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div
              id={CONTACT_FORM_ID}
              className="m-4 rounded-2xl bg-white p-8 sm:p-10 lg:m-6 lg:p-12"
            >
              <h3 className="font-editorial text-2xl font-bold text-sand-950">
                Napisz do nas
              </h3>
              <p className="mt-2 text-[15px] text-sand-500">
                Odpowiadamy w ciągu 24h w dni robocze.
              </p>

              <div aria-live="polite">
                {status === "ok" ? (
                  <div className="mt-8 rounded-xl bg-pool-100 p-6 text-center">
                    <svg
                      className="mx-auto mb-3 text-deep-600"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p className="font-editorial text-xl font-bold text-deep-800">
                      Wysłano!
                    </p>
                    <p className="mt-1 text-[15px] text-deep-600">
                      Potwierdzenie trafiło na Twój e-mail. Odpiszemy najszybciej
                      jak to możliwe.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                        placeholder="Anna Kowalska"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                        placeholder="anna@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="child-age" className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                        Wiek dziecka
                      </label>
                      <input
                        type="text"
                        id="child-age"
                        name="child-age"
                        value={form.childAge}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, childAge: e.target.value }))
                        }
                        className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                        placeholder="np. 6 lat"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                        Wiadomość *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        className="mt-2 block w-full resize-none rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                        placeholder="Chciałabym zapisać dziecko na zajęcia..."
                      />
                    </div>

                    {/* Honeypot — off-screen and untabbable, so only bots fill it. */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label htmlFor="cta-company">Nie wypełniaj tego pola</label>
                      <input
                        id="cta-company"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.company}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, company: e.target.value }))
                        }
                      />
                    </div>

                    {status === "error" && (
                      <p className="rounded-xl bg-coral-50 px-4 py-3 text-[14px] text-coral-600">
                        {errorMessage ||
                          "Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na biuro@uksfala.com.pl"}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-coral-500 text-[15px] font-bold text-white transition-all hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "sending" ? "Wysyłanie…" : "Wyślij wiadomość"}
                      {status !== "sending" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
