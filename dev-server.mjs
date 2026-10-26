// Local development server: serves the static site and runs the Vercel
// functions in /api with the key from .env, the same way Vercel does in
// production. No dependencies needed.  Usage: npm run dev
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(".");
const PORT = Number(process.env.PORT) || 3000;

// Load .env into process.env (KEY=value, optional quotes)
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/);
    if (!match || line.trim().startsWith("#")) continue;
    process.env[match[1]] ??= match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}
if (!process.env.HEROS_API_KEY) {
  console.warn("Warning: HEROS_API_KEY is not set in .env — Huddy will not work.");
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// Files that are never served, matching .vercelignore
const BLOCKED = /^\/(\.env|\.git|\.vercel|AI\/|api\/|_backup\/|My Photos\/|dev-server\.mjs|.*\.py$)/;

// Apply the same response headers Vercel will (CSP, caching...) from vercel.json
const vercelHeaderRules = (() => {
  try {
    const config = JSON.parse(readFileSync("vercel.json", "utf8"));
    return (config.headers || []).map((rule) => ({
      pattern: new RegExp("^" + rule.source.replace(/\(\.\*\)/g, ".*") + "$"),
      headers: rule.headers
    }));
  } catch {
    return [];
  }
})();

function applyVercelHeaders(pathname, res) {
  for (const rule of vercelHeaderRules) {
    if (rule.pattern.test(pathname)) {
      for (const { key, value } of rule.headers) {
        if (key !== "Strict-Transport-Security") res.setHeader(key, value); // HTTPS-only
      }
    }
  }
}

async function sendNotFound(res) {
  try {
    const page = await readFile(join(ROOT, "404.html"));
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }).end(page);
  } catch {
    res.writeHead(404).end("Not found");
  }
}

// Add the Vercel helpers (res.status().json(), parsed req.body) to Node's req/res
async function runFunction(name, req, res) {
  const file = join(ROOT, "api", `${name}.js`);
  if (!existsSync(file)) {
    res.writeHead(404).end("Not found");
    return;
  }
  const mod = await import(pathToFileURL(file).href);

  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
    return res;
  };

  const parseBody = mod.config?.api?.bodyParser !== false;
  if (parseBody && (req.headers["content-type"] || "").includes("application/json")) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    try {
      req.body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  await mod.default(req, res);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(url.pathname);
    applyVercelHeaders(pathname, res);

    // Files starting with "_" (shared helpers) are not routes, same as on Vercel
    const apiMatch = pathname.match(/^\/api\/([a-z][\w-]*)$/);
    if (apiMatch) {
      await runFunction(apiMatch[1], req, res);
      return;
    }

    const filePath = normalize(join(ROOT, pathname === "/" ? "index.html" : pathname));
    if (!filePath.startsWith(ROOT) || BLOCKED.test(pathname)) {
      await sendNotFound(res);
      return;
    }
    const content = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(content);
  } catch (err) {
    if (err.code === "ENOENT" || err.code === "EISDIR") {
      await sendNotFound(res);
    } else {
      console.error(err);
      if (!res.headersSent) res.writeHead(500);
      res.end("Server error");
    }
  }
}).listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
