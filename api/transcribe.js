export const config = {
  api: {
    bodyParser: false, // Disables body parsing so raw multipart audio stream flows through
  },
};

import { createRateLimiter, rejectRequest } from "./_guard.js";

const HEROS_TRANSCRIBE_URL = "https://hero-s-ai.alwaysdata.net/api/transcribe";
const MAX_AUDIO_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB
const isLimited = createRateLimiter({ windowMs: 60 * 1000, max: 10 });

export default async function handler(req, res) {
  if (rejectRequest(req, res, isLimited)) return;

  const apiKey = process.env.HEROS_API_KEY;
  if (!apiKey) {
    console.error("HEROS_API_KEY is not set");
    return res.status(500).json({ error: "Server is not configured" });
  }

  const contentType = req.headers["content-type"] || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return res.status(400).json({ error: "Expected multipart/form-data" });
  }

  try {
    // Read raw incoming audio stream chunks
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_AUDIO_BYTES) {
        return res.status(413).json({ error: "Audio too large" });
      }
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const herosResponse = await fetch(HEROS_TRANSCRIBE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": contentType, // Preserves multipart boundary
      },
      body: buffer,
    });

    const data = await herosResponse.json();
    return res.status(herosResponse.status).json(data);
  } catch (error) {
    console.error("Hero Transcribe Proxy Error:", error);
    return res.status(500).json({ error: "Failed to transcribe audio" });
  }
}
