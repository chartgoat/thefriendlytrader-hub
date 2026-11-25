import { traders } from "./traders.mjs";
import { COACH_ID, cardHTML, classFrom, refreshCard } from "./coach-card.mjs";
const coach = new URL(location.href).searchParams.get("ref");
if (traders.has(coach)) {
  document.querySelector("#inviter").textContent = traders.get(coach) + " invited you";
  document.querySelector("#signup").href = "/?ref=ct-app-" + encodeURIComponent(coach);
}
// A listed coach's invitation also shows their card, the same one as their page (/app/<coach-id>/, app/coaches.json).
// Anyone else, or no one, keeps the invitation exactly as it was.
if (coach && COACH_ID.test(coach)) showCard(coach).catch(() => {});

async function showCard(id) {
  const res = await fetch("/app/coaches.json");
  if (!res.ok) return;
  const card = (await res.json())?.coaches?.[id];
  if (!card) return;
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "/app/coach.css";
  await new Promise((done) => { style.onload = style.onerror = done; document.head.append(style); });
  const at = document.querySelector("#inviter");
  at.insertAdjacentHTML("afterend", cardHTML(card, { heading: "h2", appStore: false, classId: classFrom(location.search) }));
  document.querySelector("main").classList.add("has-coach");
  refreshCard(document.querySelector(".cc"), id);
}
