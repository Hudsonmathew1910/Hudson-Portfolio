import { createRateLimiter, rejectRequest } from "./_guard.js";

const HEROS_CHAT_URL = "https://hero-s-ai.alwaysdata.net/api/v1/chat/completions";
const MAX_MESSAGES = 40;
const MAX_CONTENT_LENGTH = 50000; // system prompt carries the full data.json (~20 KB)
const ALLOWED_ROLES = new Set(["system", "user", "assistant"]);
const isLimited = createRateLimiter({ windowMs: 60 * 1000, max: 15 });

export default async function handler(req, res) {
  if (rejectRequest(req, res, isLimited)) return;

  const apiKey = process.env.HEROS_API_KEY;
  if (!apiKey) {
    console.error("HEROS_API_KEY is not set");
    return res.status(500).json({ error: "Server is not configured" });
  }

  // Only forward a conversation; the model and settings are fixed server-side
  // so the proxy can't be repurposed for arbitrary requests.
  const messages = req.body && req.body.messages;
  const isValid =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages.every(
      (m) =>
        m &&
        ALLOWED_ROLES.has(m.role) &&
        typeof m.content === "string" &&
        m.content.length <= MAX_CONTENT_LENGTH
    );

  if (!isValid) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    const herosResponse = await fetch(HEROS_CHAT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "baymax-4.5",
        messages: messages.map(({ role, content }) => ({ role, content })),
        temperature: 0.7,
        extra_body: { type: "text", search: false }
      })
    });

    const data = await herosResponse.json();
    return res.status(herosResponse.status).json(data);
  } catch (error) {
    console.error("Hero API Proxy Error:", error);
    return res.status(500).json({ error: "Failed to connect to Hero AI" });
  }
}
