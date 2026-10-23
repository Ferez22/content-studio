import { site } from "@/lib/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactRequest = {
  name: string;
  email: string;
  company: string;
  website: string;
  message: string;
  locale: string;
  token: string;
  fax: string;
};

const field = (body: Record<string, unknown>, key: string, max: number) => {
  const value = body[key];
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= max ? trimmed : null;
};

const parse = (body: unknown): ContactRequest | null => {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const parsed = {
    name: field(record, "name", 100),
    email: field(record, "email", 254),
    company: field(record, "company", 100),
    website: field(record, "website", 200),
    message: field(record, "message", 5000),
    locale: field(record, "locale", 5),
    token: field(record, "token", 2048),
    fax: field(record, "fax", 200),
  };
  if (Object.values(parsed).some((value) => value === null)) return null;
  return parsed as ContactRequest;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const verifyTurnstile = async (secret: string, token: string, ip: string | null) => {
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form }
  );
  const result = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    "error-codes"?: string[];
    hostname?: string;
  };
  if (!response.ok || result.success !== true) {
    // e.g. invalid-input-secret = wrong secret for this site key; see Cloudflare's error code list.
    console.error("Contact form: Turnstile rejected the token", response.status, result["error-codes"], result.hostname);
    return false;
  }
  return true;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const data = parse(body);
  if (!data) return Response.json({ ok: false }, { status: 400 });

  // Honeypot filled: answer like a success so bots learn nothing, send nothing.
  if (data.fax) return Response.json({ ok: true });

  if (!data.name || !data.message || !EMAIL_PATTERN.test(data.email)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Trimmed because pasted dashboard values often carry a trailing space or newline.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  if (!turnstileSecret || !brevoApiKey) {
    console.error("Contact form: TURNSTILE_SECRET_KEY or BREVO_API_KEY is not set");
    return Response.json({ ok: false }, { status: 500 });
  }

  if (!data.token) return Response.json({ ok: false }, { status: 403 });
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;
  try {
    if (!(await verifyTurnstile(turnstileSecret, data.token, ip))) {
      return Response.json({ ok: false }, { status: 403 });
    }
  } catch (error) {
    console.error("Contact form: Turnstile verification failed", error);
    return Response.json({ ok: false }, { status: 502 });
  }

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company || "-"],
    ["Website", data.website || "-"],
    ["Language", data.locale || "-"],
  ];
  const textContent = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.message}`;
  const htmlContent = `<table>${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Qartmina website", email: site.email },
        to: [{ email: site.email, name: "Qartmina" }],
        replyTo: { email: data.email, name: data.name.replace(/[\r\n]/g, " ") },
        subject: `Website contact: ${data.name.replace(/[\r\n]/g, " ")}`,
        textContent,
        htmlContent,
      }),
    });
    if (!response.ok) {
      console.error("Contact form: Brevo error", response.status, await response.text());
      return Response.json({ ok: false }, { status: 502 });
    }
  } catch (error) {
    console.error("Contact form: Brevo request failed", error);
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
