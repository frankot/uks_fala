import { CARD_WIDTHS, cldSrcSet, cldUrl } from "@/lib/cloudinary-image";

type CmsImageProps = {
  src: string;
  alt: string;
  /** Wartość atrybutu `sizes` — musi odpowiadać realnej szerokości kontenera. */
  sizes: string;
  className?: string;
  /** Szerokości wariantów w `srcSet`. */
  widths?: number[];
  /** Największy wariant, użyty jako `src` dla przeglądarek bez `srcSet`. */
  fallbackWidth?: number;
  /** Dla zdjęcia będącego LCP — ładowane od razu, z wysokim priorytetem. */
  priority?: boolean;
};

/**
 * Zdjęcie z CMS-u (Cloudinary). Dla adresów spoza Cloudinary — np. danych
 * fallbackowych z Unsplasha w `src/lib/queries/*` — degraduje się do zwykłego
 * `<img>` bez `srcSet`, zachowując lazy-loading.
 */
export default function CmsImage({
  src,
  alt,
  sizes,
  className,
  widths = CARD_WIDTHS,
  fallbackWidth,
  priority = false,
}: CmsImageProps) {
  const srcSet = cldSrcSet(src, widths);
  const largest = fallbackWidth ?? widths[widths.length - 1];

  return (
    // Świadomie omijamy optymalizator Next: transformacje i wybór formatu
    // robi CDN Cloudinary (patrz src/lib/cloudinary-image.ts).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cldUrl(src, largest)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
