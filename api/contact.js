// Sends contact-form messages straight to Hudson's inbox via Resend (https://resend.com).
// Env vars (in .env locally and in Vercel → Settings → Environment Variables):
//   RESEND_API_KEY    required
//   CONTACT_TO_EMAIL  optional, defaults to hudsonmathew2004@gmail.com
//   CONTACT_FROM      optional, defaults to Resend's test sender (works until you verify a domain)
import { createRateLimiter, rejectRequest } from "./_guard.js";

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_TO = "hudsonmathew2004@gmail.com";
const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 5 messages per 10 minutes per visitor (best-effort, see _guard.js)
const isLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export default async function handler(req, res) {
  if (rejectRequest(req, res, null)) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service is not configured" });
  }

  const body = req.body || {};

  // Honeypot: real visitors never see or fill this field
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  const field = (key) => (typeof body[key] === "string" ? body[key].trim() : "");
  const name = field("name");
  const email = field("email");
  const subject = field("subject") || "New message from your portfolio";
  const message = field("message");

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill in your name, email and message." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  for (const [key, max] of Object.entries(LIMITS)) {
    if (field(key).length > max) {
      return res.status(400).json({ error: `Your ${key} is too long (max ${max} characters).` });
    }
  }

  // Throttle after validation so typos don't use up a visitor's attempts
  if (isLimited(req)) {
    return res.status(429).json({ error: "Too many messages. Please try again in a few minutes." });
  }

  const text = `New message from your portfolio contact form

Name: ${name}
Email: ${email}
Subject: ${subject}

${message}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;color:#1a1a1a">
      <h2 style="margin:0 0 16px;color:#5d6834">New portfolio message</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Subject</td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <div style="white-space:pre-wrap;line-height:1.6;padding:16px;background:#f6f5ef;border-left:3px solid #798645">${escapeHtml(message)}</div>
      <p style="color:#888;font-size:12px;margin-top:16px">Reply to this email to answer ${escapeHtml(name)} directly.</p>
    </div>`;

  try {
    const resendResponse = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
        reply_to: email,
        subject: `[Portfolio] ${subject} (${name})`,
        text,
        html
      })
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("Resend error:", resendResponse.status, detail);
      return res.status(502).json({ error: "Could not send your message right now." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact send error:", error);
    return res.status(500).json({ error: "Could not send your message right now." });
  }
}
