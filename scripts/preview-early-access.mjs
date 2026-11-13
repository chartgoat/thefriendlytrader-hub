// Local preview of the site with a stand-in for the sign-up server, so the early access box and the
// unsubscribe page can be tried end to end without touching the real list. Nothing here is published:
// GitHub Pages serves the files as they are, and this script only changes what it hands the browser.
//
//   node scripts/preview-early-access.mjs            http://127.0.0.1:5540
//   PORT=5541 node scripts/preview-early-access.mjs
//
// The stand-in follows the server's contract: 200 {"ok":true} for a good address, 400 invalid_email,
// 429 after three tries for one address, a silent 200 for the hidden trap field or a too-fast submit.
// GET /__signups shows what it holds (addresses included: this is a local test, use made-up ones).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 5540);
const REAL = "https://grbywbmbiewrxqbfsxpf.supabase.co";
const HERE = `http://127.0.0.1:${PORT}`;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4", ".vtt": "text/vtt", ".xml": "application/xml", ".txt": "text/plain" };

const signups = new Map();
const tries = new Map();
const dropped = [];

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
};

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; if (raw.length > 16384) req.destroy(); });
    req.on("end", () => { try { resolve(JSON.parse(raw)); } catch { resolve(null); } });
  });
}

async function server(req, res, route) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "method_not_allowed" });
  const body = await readBody(req);
  if (!body || typeof body !== "object") return json(res, 400, { ok: false, error: "bad_request" });
  if (route === "early-access") {
    const email = String(body.email || "").trim();
    if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)) return json(res, 400, { ok: false, error: "invalid_email" });
    if (!body.consentText || body.consentVersion !== "web-early-access-v1") return json(res, 400, { ok: false, error: "invalid_consent" });
    if (body.website || !(body.elapsedMs >= 1500)) { dropped.push({ email, why: body.website ? "trap" : "too fast" }); return json(res, 200, { ok: true }); }
    const key = email.toLowerCase();
    tries.set(key, (tries.get(key) || 0) + 1);
    if (tries.get(key) > 3) return json(res, 429, { ok: false, error: "rate_limited" });
    const id = signups.get(key)?.id || String(signups.size + 1);
    signups.set(key, { id, email, consentText: body.consentText, ref: body.ref || null, unsubscribed: signups.get(key)?.unsubscribed || false, keys: Object.keys(body).sort() });
    return json(res, 200, { ok: true });
  }
  if (route === "unsubscribe") {
    const row = [...signups.values()].find((r) => r.id === String(body.id));
    if (!row || body.token !== `preview-token-${row.id}-0000`) return json(res, 403, { ok: false, error: "invalid_token" });
    row.unsubscribed = true;
    return json(res, 200, { ok: true });
  }
  return json(res, 404, { ok: false, error: "not_found" });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, HERE);
  const fn = url.pathname.match(/^\/functions\/v1\/email-signup\/([a-z-]+)$/);
  if (fn) return server(req, res, fn[1]);
  if (url.pathname === "/__signups") return json(res, 200, { signups: [...signups.values()], dropped });
  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end("Not found"); }
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  const headers = { "content-type": type, "cache-control": "no-store" };
  if (/\.(html|mjs)$/.test(file)) {
    res.writeHead(200, headers);
    // Whatever name the browser used for this server (localhost or 127.0.0.1) stands in for the real one.
    return res.end(fs.readFileSync(file, "utf8").replaceAll(REAL, `http://${req.headers.host || `127.0.0.1:${PORT}`}`));
  }
  const size = fs.statSync(file).size;
  const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || "");
  if (range) {
    const start = Number(range[1]), end = range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { ...headers, "content-range": `bytes ${start}-${end}/${size}`, "content-length": end - start + 1, "accept-ranges": "bytes" });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...headers, "content-length": size, "accept-ranges": "bytes" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`Early access preview with a stand-in server: ${HERE}`));
