import { Resend } from "resend";

/**
 * Resend client, or null when RESEND_API_KEY is unset — local dev and preview
 * builds run without a key and the send route degrades to a logged no-op rather
 * than crashing the form.
 */
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Sender must be on a domain verified in Resend (uksfala.com.pl), otherwise the
 * API rejects the send. Recipients are comma-separated so the club can add a
 * second inbox without a code change.
 */
export const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ??
  "Formularz UKS Fala <formularz@uksfala.com.pl>";

export const TO_EMAILS = (
  process.env.CONTACT_TO_EMAIL ?? "biuro@uksfala.com.pl"
)
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);

/** Bare address used in copy and as the reply target on auto-replies. */
export const CLUB_EMAIL = TO_EMAILS[0] ?? "biuro@uksfala.com.pl";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Renders `[label, value]` pairs as the bordered table used in both e-mails. */
export function renderRows(rows: Array<[string, string]>): string {
  return rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">${escapeHtml(label)}</td><td style="padding:8px;background:#faf9f7">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
}
