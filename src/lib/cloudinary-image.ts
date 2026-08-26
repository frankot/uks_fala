/**
 * Zdjęcia z CMS-u trafiają do bazy jako surowy `secure_url` z Cloudinary
 * (patrz `src/lib/upload.ts`) — czyli oryginał, nawet kilkaset KB, bez
 * żadnej transformacji. Renderowanie go wprost w `<img src>` oznacza, że
 * kafelek 290×180 px ściąga plik 4000 px szerokości.
 *
 * Wstrzykujemy więc transformacje w URL i budujemy `srcSet`. Cloudinary
 * serwuje wtedy AVIF/WebP (`f_auto`) w rozmiarze dobranym do kontenera,
 * ze swojego CDN-u — bez angażowania optymalizatora obrazów Next
 * (a więc i bez zużywania limitu optymalizacji na Vercelu).
 */

const CLOUDINARY_UPLOAD = "/image/upload/";

export function isCloudinary(url: string): boolean {
  return url.includes("res.cloudinary.com") && url.includes(CLOUDINARY_UPLOAD);
}

/**
 * `c_limit` nigdy nie powiększa i nie kadruje — przy węższym oryginale
 * po prostu odda go bez zmian, więc kompozycja zdjęcia zostaje nietknięta.
 */
export function cldUrl(url: string, width: number): string {
  if (!isCloudinary(url)) return url;
  return url.replace(
    CLOUDINARY_UPLOAD,
    `${CLOUDINARY_UPLOAD}f_auto,q_auto,c_limit,w_${width}/`,
  );
}

export function cldSrcSet(url: string, widths: number[]): string | undefined {
  if (!isCloudinary(url)) return undefined;
  return widths.map((w) => `${cldUrl(url, w)} ${w}w`).join(", ");
}

/** Szerokości pod typowe konteksty w serwisie. */
export const CARD_WIDTHS = [320, 480, 640, 960];
export const GALLERY_WIDTHS = [320, 480, 640, 800];
export const WIDE_WIDTHS = [640, 960, 1280, 1600];
