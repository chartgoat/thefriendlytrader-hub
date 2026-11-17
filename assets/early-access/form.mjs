// The early access box on the home page. It sends the address and the words beside the box to our own server.
import { SIGNUP_URL, SAID, looksLikeEmail, signupBody, replyFor } from "./core.mjs";

const form = document.querySelector("#early-access");
const note = document.querySelector("#early-note");

if (form && note) {
  const email = form.elements.email;
  const trap = form.elements.alt_contact;
  const button = form.querySelector('button[type="submit"]');
  // The words on the page are what the visitor agrees to, so they are read from the page, not kept twice.
  const consentText = note.textContent.replace(/\s+/g, " ").trim();
  const opened = performance.now();
  let busy = false;

  const say = (text, state) => {
    note.textContent = text;
    if (state) note.dataset.state = state;
    else delete note.dataset.state;
  };

  email.addEventListener("input", () => {
    if (note.dataset.state === "error") say(consentText);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!looksLikeEmail(email.value)) {
      say(SAID.badEmail, "error");
      email.focus();
      return;
    }
    busy = true;
    button.disabled = true;
    let reply;
    try {
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(signupBody({ email: email.value, consentText, trap: trap.value, elapsedMs: performance.now() - opened, search: location.search })),
      });
      reply = replyFor(response.status, await response.json().catch(() => null));
    } catch {
      reply = { ok: false, text: SAID.offline };
    }
    busy = false;
    button.disabled = false;
    if (!reply.ok) {
      say(reply.text, "error");
      return;
    }
    form.hidden = true;
    say(reply.text, "done");
    // The demo's own "Get early access" button has nothing left to do for this visitor.
    document.documentElement.classList.add("g-early-done");
    // One event for our ads, with no address in it. The Pixel is absent under Global Privacy Control.
    if (typeof window.fbq === "function") window.fbq("track", "CompleteRegistration", { content_name: "Early access" });
  });
}
