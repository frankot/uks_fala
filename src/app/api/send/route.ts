import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, phone, group, frequency, message } = await req.json();

  if (!name || !email || !group || !frequency) {
    return NextResponse.json({ error: "Brakujące pola" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Formularz UKS Fala <formularz@uksfala.com.pl>",
    to: ["biuro@uksfala.com.pl"],
    subject: `Rezerwacja miejsca — ${group}`,
    html: `
      <h2>Nowe zgłoszenie rezerwacji</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Imię i nazwisko</td><td style="padding:8px;background:#faf9f7">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">E-mail</td><td style="padding:8px;background:#faf9f7">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Telefon</td><td style="padding:8px;background:#faf9f7">${phone || "—"}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Wybrana grupa</td><td style="padding:8px;background:#faf9f7">${group}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Treningi / tydzień</td><td style="padding:8px;background:#faf9f7">${frequency}×</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Wiadomość</td><td style="padding:8px;background:#faf9f7">${message || "—"}</td></tr>
      </table>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Błąd wysyłki" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
