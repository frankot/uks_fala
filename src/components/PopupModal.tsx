"use client";

import { useCallback, useEffect, useState } from "react";

interface Props {
  title: string;
  content: string;
  delaySeconds: number;
  /** Changes whenever the admin edits the popup — a new version shows again. */
  version: string;
}

export default function PopupModal({
  title,
  content,
  delaySeconds,
  version,
}: Props) {
  const storageKey = `uks-fala-popup:${version}`;
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const close = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // sessionStorage can be unavailable (private mode) — closing still works
    }
    // unmount after the fade-out finishes
    setTimeout(() => setMounted(false), 200);
  }, [storageKey]);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(storageKey) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;

    const timer = setTimeout(() => {
      setMounted(true);
      // next frame, so the entry transition actually runs
      requestAnimationFrame(() => setVisible(true));
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [delaySeconds, storageKey]);

  useEffect(() => {
    if (!mounted) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);

    // Lock background scroll. `scrollbar-gutter: stable` (globals.css) keeps the
    // viewport width constant; where it is unsupported, pad by the scrollbar
    // width instead so the page does not shift sideways.
    const gutterReserved =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("scrollbar-gutter", "stable");
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (!gutterReserved && scrollbarWidth > 0) {
      const currentPadding = parseFloat(
        getComputedStyle(document.body).paddingRight,
      );
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [mounted, close]);

  if (!mounted) return null;

  const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "popup-title" : undefined}
    >
      <div
        className="absolute inset-0 bg-deep-950/50 backdrop-blur-[2px]"
        onClick={close}
      />

      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-200 ${
          visible ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.98]"
        }`}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-deep-700 via-deep-400 to-pool-400" />

        <button
          type="button"
          onClick={close}
          aria-label="Zamknij"
          className="absolute right-4 top-5 rounded-full p-2 text-sand-500 transition-colors hover:bg-sand-100 hover:text-sand-800"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-7 pb-7 pt-8 sm:px-9 sm:pb-9">
          {title && (
            <h2
              id="popup-title"
              className="pr-10 text-[1.5rem] font-bold leading-tight text-deep-900"
            >
              {title}
            </h2>
          )}

          {paragraphs.length > 0 && (
            <div
              className={`space-y-3 text-[15px] leading-relaxed text-sand-700 ${
                title ? "mt-4" : "pr-10"
              }`}
            >
              {paragraphs.map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={close}
              className="rounded-xl bg-deep-700 px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-deep-800"
            >
              Rozumiem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
