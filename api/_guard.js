// Shared protection for the serverless functions. Files starting with "_" are not
// exposed as routes by Vercel.

// Reject browser requests coming from other websites. Requests without an Origin
// header (same-origin GETs, curl) are allowed; the real protection for those is the
// rate limit and the input validation in each function.
export function isForeignOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    return new URL(origin).host !== req.headers.host;
  } catch {
    return true;
  }
}

export function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

// Best-effort fixed-window throttle per IP. Serverless instances are short-lived and
// not shared, so this stops bursts and casual abuse, not a distributed attack.
export function createRateLimiter({ windowMs, max }) {
  const hitsByIp = new Map();
  return function isLimited(req) {
    const now = Date.now();
    const ip = clientIp(req);
    const hits = (hitsByIp.get(ip) || []).filter((t) => now - t < windowMs);
    hits.push(now);
    hitsByIp.set(ip, hits);
    if (hitsByIp.size > 5000) hitsByIp.clear(); // keep memory bounded
    return hits.length > max;
  };
}

// Common checks: method, origin, rate limit. Returns true if the request was rejected.
export function rejectRequest(req, res, isLimited) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return true;
  }
  if (isForeignOrigin(req)) {
    res.status(403).json({ error: "Forbidden" });
    return true;
  }
  if (isLimited && isLimited(req)) {
    res.setHeader("Retry-After", "60");
    res.status(429).json({ error: "Too many requests. Please slow down and try again shortly." });
    return true;
  }
  return false;
}
