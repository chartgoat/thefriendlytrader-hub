// The unsubscribe page. Nothing happens until the button is pressed, so a mail scanner opening the link changes nothing.
import { UNSUBSCRIBE_URL, unsubscribeParts } from "./core.mjs";

const title = document.querySelector("#unsub-title");
const line = document.querySelector("#unsub-line");
const button = document.querySelector("#unsub-go");
const parts = unsubscribeParts(location.search);

const show = (heading, text, keepButton) => {
  title.textContent = heading;
  line.textContent = text;
  button.hidden = !keepButton;
};

if (!parts) {
  show("This link is missing its code.", "Open the unsubscribe link at the bottom of the email again.", false);
} else {
  button.hidden = false;
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      const response = await fetch(UNSUBSCRIBE_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parts),
      });
      const body = await response.json().catch(() => null);
      if (response.ok && body?.ok === true) {
        show("You're unsubscribed.", "You won't get more emails from this list.", false);
        return;
      }
      if (response.status === 400 || response.status === 403 || response.status === 404) {
        show("This link didn't work.", "Open the unsubscribe link at the bottom of the email again.", false);
        return;
      }
      show("That didn't go through.", "Try again in a minute.", true);
    } catch {
      show("That didn't go through.", "Check your connection and try again.", true);
    }
    button.disabled = false;
  });
}
