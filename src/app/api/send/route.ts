import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import {
  CLUB_EMAIL,
  FROM_EMAIL,
  TO_EMAILS,
  renderRows,
  resend,
} from "@/lib/email";
import { getValidGroupNames } from "@/lib/queries/schedule";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

/** Both public forms post here; `type` picks which shape is expected. */
const BaseSchema = z.object({
  name: z.string().min(1, "Podaj imię i nazwisko").max(100),
  email: z.email("Nieprawidłowy adres e-mail").max(200),
  phone: z.string().max(30).default(""),
  message: z.string().max(2000).default(""),
});

const ReservationSchema = BaseSchema.extend({
  type: z.literal("rezerwacja"),
  group: z.string().min(1).max(50),
  /** Count of chosen training days — the price tier, 1–3 per week. */
  frequency: z.coerce.number().int().min(1).max(3),
  /** Human-readable day list ("Poniedziałek, Środa") for the club to read. */
  days: z.string().max(200).default(""),
});

const ContactSchema = BaseSchema.extend({
  type: z.literal("kontakt"),
  childAge: z.string().max(100).default(""),
  message: z.string().min(1, "Napisz wiadomość").max(2000),
});

const PayloadSchema = z.discriminatedUnion("type", [
  ReservationSchema,
  ContactSchema,
]);

/**
 * Hidden input no sighted user can reach. Bots fill every field they find, so a
 * non-empty value is a bot — answered with a normal success so it learns nothing.
 */
const HONEYPOT_FIELD = "company";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

function trimStrings(value: unknown): unknown {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        trimStrings(v),
      ]),
    );
  }
  return value;
}

/**
 * Collapses a double-clicked submit into one delivery. Resend dedupes on this
 * key for 24h, so the window is coarsened to a minute: the same enquiry sent
 * twice in quick succession is one e-mail, a genuine follow-up an hour later
 * still arrives.
 */
function idempotencyKey(payload: z.infer<typeof PayloadSchema>): string {
  const minute = Math.floor(Date.now() / 60_000);
  const digest = createHash("sha256")
    .update(
      JSON.stringify([payload.type, payload.email, payload.message, minute]),
    )
    .digest("hex")
    .slice(0, 32);
  return `uks-fala/${payload.type}/${digest}`;
}

function clubEmail(payload: z.infer<typeof PayloadSchema>) {
  if (payload.type === "rezerwacja") {
    return {
      // Subjects are plain text, not HTML — escaping here would turn "Konik & Co"
      // into "Konik &amp; Co" in the club's inbox.
      subject: `Rezerwacja miejsca — ${payload.group}`,
      heading: "Nowe zgłoszenie rezerwacji",
      rows: [
        ["Imię i nazwisko", payload.name],
        ["E-mail", payload.email],
        ["Telefon", payload.phone || "—"],
        ["Wybrana grupa", payload.group],
        ["Wybrane dni", payload.days || "—"],
        ["Treningi / tydzień", `${payload.frequency}×`],
        ["Wiadomość", payload.message || "—"],
      ] as Array<[string, string]>,
    };
  }

  return {
    subject: `Wiadomość z formularza — ${payload.name}`,
    heading: "Nowa wiadomość z formularza kontaktowego",
    rows: [
      ["Imię i nazwisko", payload.name],
      ["E-mail", payload.email],
      ["Telefon", payload.phone || "—"],
      ["Wiek dziecka", payload.childAge || "—"],
      ["Wiadomość", payload.message],
    ] as Array<[string, string]>,
  };
}

function confirmationEmail(payload: z.infer<typeof PayloadSchema>) {
  const intro =
    payload.type === "rezerwacja"
      ? `Dziękujemy za zgłoszenie rezerwacji do grupy <strong>${payload.group}</strong>. Odezwiemy się najszybciej jak to możliwe, żeby potwierdzić miejsce.`
      : "Dziękujemy za wiadomość. Odpowiadamy zwykle w ciągu 24 godzin w dni robocze.";

  const { rows } = clubEmail(payload);

  return {
    subject: "Otrzymaliśmy Twoje zgłoszenie — UKS Fala",
    html: `
      <h2 style="font-family:system-ui,sans-serif">Dziękujemy!</h2>
      <p style="font-family:system-ui,sans-serif;line-height:1.6">${intro}</p>
      <p style="font-family:system-ui,sans-serif;line-height:1.6">Poniżej kopia przesłanych informacji:</p>
      <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:system-ui,sans-serif">
        ${renderRows(rows)}
      </table>
      <p style="font-family:system-ui,sans-serif;line-height:1.6;color:#666;font-size:14px">
        To wiadomość automatyczna — możesz na nią odpowiedzieć, trafi do nas.<br />
        UKS Fala Nieporęt · ${CLUB_EMAIL} · +48 530 077 078
      </p>
    `,
  };
}

export async function POST(req: Request) {
  const limit = rateLimit(`send:${getClientIp(req)}`, RATE_LIMIT);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let raw: unknown;
  try {
    raw = trimStrings(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowy format danych" },
      { status: 400 },
    );
  }

  const body = (raw ?? {}) as Record<string, unknown>;

  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD]) {
    return NextResponse.json({ ok: true });
  }

  // Older clients posted reservations with no discriminator.
  const parsed = PayloadSchema.safeParse({
    ...body,
    type: body.type ?? "rezerwacja",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Brakujące pola" },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  if (payload.type === "rezerwacja") {
    const validGroups = await getValidGroupNames();
    if (!validGroups.includes(payload.group)) {
      return NextResponse.json({ error: "Nieznana grupa" }, { status: 400 });
    }
  }

  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping email send.", {
      type: payload.type,
      email: payload.email,
    });
    return NextResponse.json(
      {
        ok: true,
        placeholder: true,
        message:
          "Brak konfiguracji wysyłki e-mail. Zgłoszenie nie zostało wysłane.",
      },
      { status: 202 },
    );
  }

  const { subject, heading, rows } = clubEmail(payload);

  const { error } = await resend.emails.send(
    {
      from: FROM_EMAIL,
      to: TO_EMAILS,
      subject,
      // Replying in the club's mailbox reaches the parent, not the no-reply sender.
      replyTo: payload.email,
      html: `
        <h2 style="font-family:system-ui,sans-serif">${heading}</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:system-ui,sans-serif">
          ${renderRows(rows)}
        </table>
      `,
    },
    { idempotencyKey: idempotencyKey(payload) },
  );

  if (error) {
    console.error("Resend error (club notification):", error);
    return NextResponse.json({ error: "Błąd wysyłki" }, { status: 500 });
  }

  // The enquiry already reached the club, so a failed acknowledgement is logged
  // rather than reported — telling the parent it failed would be wrong.
  const confirmation = confirmationEmail(payload);
  const { error: confirmationError } = await resend.emails.send(
    {
      from: FROM_EMAIL,
      to: [payload.email],
      subject: confirmation.subject,
      replyTo: CLUB_EMAIL,
      html: confirmation.html,
    },
    { idempotencyKey: `${idempotencyKey(payload)}/confirmation` },
  );

  if (confirmationError) {
    console.error("Resend error (sender confirmation):", confirmationError);
  }

  return NextResponse.json({ ok: true });
}
