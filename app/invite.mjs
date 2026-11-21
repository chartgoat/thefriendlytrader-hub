import { traders } from "./traders.mjs";
const coach = new URL(location.href).searchParams.get("ref");
if (traders.has(coach)) {
  document.querySelector("#inviter").textContent = traders.get(coach) + " invited you";
  document.querySelector("#signup").href = "/?ref=ct-app-" + encodeURIComponent(coach);
}
