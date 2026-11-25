// A Crown Trader's page (/app/<coach-id>/, made by scripts/crown-links/generate.mjs). A class link,
// /app/<coach-id>?class=<class-id>&at=<start in epoch seconds>, books that class: the id, and its start when the link
// has one, ride along to the website's booking. Prices come up to date from the live catalog.
import { arrivalFrom, bookingURL, refreshCard } from "./coach-card.mjs";

const card = document.querySelector(".cc");
const id = card?.dataset.coach;
const { classId, at } = arrivalFrom(location.search);
if (card && classId) card.querySelector(".cc-book").href = bookingURL(id, classId, at);
if (card) refreshCard(card, id);
