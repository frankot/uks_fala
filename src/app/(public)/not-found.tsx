import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Nie znaleziono strony — UKS Fala",
};

/**
 * Boundary for `notFound()` thrown by the public pages — a news, coach or offer
 * slug that no longer exists. Navigation and Footer come from the (public)
 * layout, so only the body is rendered here; the root `app/not-found.tsx`
 * handles URLs that match no route at all and brings its own chrome.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
