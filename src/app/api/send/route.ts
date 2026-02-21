import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  group: string;
  frequency: string | number;
  message?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy format danych" }, { status: 400 });
  }

  const { name, email, phone, group, frequency, message } = body;

  if (!name || !email || !group || !frequency) {
    return NextResponse.json({ error: "Brakujące pola" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Nieprawidłowy adres e-mail" }, { status: 400 });
  }

  if (
    name.length > 100 ||
    email.length > 200 ||
    (phone && phone.length > 30) ||
    group.length > 50 ||
    (message && message.length > 2000)
  ) {
    return NextResponse.json({ error: "Przekroczono maksymalną długość pola" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Formularz UKS Fala <formularz@uksfala.com.pl>",
    to: ["biuro@uksfala.com.pl"],
    subject: `Rezerwacja miejsca — ${escapeHtml(group)}`,
    html: `
      <h2>Nowe zgłoszenie rezerwacji</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Imię i nazwisko</td><td style="padding:8px;background:#faf9f7">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">E-mail</td><td style="padding:8px;background:#faf9f7">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Telefon</td><td style="padding:8px;background:#faf9f7">${escapeHtml(phone || "—")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Wybrana grupa</td><td style="padding:8px;background:#faf9f7">${escapeHtml(group)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Treningi / tydzień</td><td style="padding:8px;background:#faf9f7">${escapeHtml(String(frequency))}×</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Wiadomość</td><td style="padding:8px;background:#faf9f7">${escapeHtml(message || "—")}</td></tr>
      </table>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Błąd wysyłki" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
