// The rules behind the early access box and the unsubscribe page. No page access here, so the tests can run them.

// Our own sign-up server. The pages may reach this address and no other (see each page's connect-src).
export const SERVER = "https://grbywbmbiewrxqbfsxpf.supabase.co/functions/v1/email-signup";
export const SIGNUP_URL = `${SERVER}/early-access`;
export const UNSUBSCRIBE_URL = `${SERVER}/unsubscribe`;

// The version of the words beside the box. New words need a new version here and on the server.
export const CONSENT_VERSION = "web-early-access-v1";

export const SAID = {
  done: "You're in. Watch your inbox on Sunday, November 22.",
  badEmail: "That email doesn't look right. Check it and try again.",
  tooMany: "Too many tries from here today. Try again tomorrow.",
  failed: "That didn't go through. Try again in a minute.",
  offline: "That didn't go through. Check your connection and try again.",
};

// A quick check before sending. The server has the real rules.
export function looksLikeEmail(value) {
  const email = String(value ?? "").trim();
  return email.length <= 254 && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
}

// Which teaser sent the visitor: ?ref=name on the link. Anything but a short plain tag is dropped.
export function refFrom(search) {
  const ref = (new URLSearchParams(search).get("ref") || "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(ref) ? ref : "";
}

// Everything the sign-up sends: the address, the words agreed to, and nothing about the visitor's device.
export function signupBody({ email, consentText, trap, elapsedMs, search }) {
  const body = {
    email: String(email).trim(),
    consentVersion: CONSENT_VERSION,
    consentText: String(consentText).replace(/\s+/g, " ").trim(),
    website: String(trap ?? ""),
    elapsedMs: Math.max(0, Math.round(Number(elapsedMs) || 0)),
  };
  const ref = refFrom(search);
  if (ref) body.ref = ref;
  return body;
}

// What to tell the visitor for a given answer from the server.
export function replyFor(status, body) {
  if (status === 200 && body?.ok === true) return { ok: true, text: SAID.done };
  if (status === 400 && body?.error === "invalid_email") return { ok: false, text: SAID.badEmail };
  if (status === 429) return { ok: false, text: SAID.tooMany };
  return { ok: false, text: SAID.failed };
}

// The unsubscribe link carries a row number and a signature, never an email address.
export function unsubscribeParts(search) {
  const params = new URLSearchParams(search);
  const id = (params.get("i") || "").trim();
  const token = (params.get("t") || "").trim();
  if (!/^[A-Za-z0-9-]{1,64}$/.test(id) || !/^[A-Za-z0-9_-]{16,128}$/.test(token)) return null;
  return { id, token };
}
