// A Crown Trader's page (/app/<coach-id>/, made by scripts/crown-links/generate.mjs). A class link,
// /app/<coach-id>?class=<class-id>, books that class: the id rides along to the website's booking. Prices come up to
// date from the live catalog.
import { bookingURL, classFrom, refreshCard } from "./coach-card.mjs";

const card = document.querySelector(".cc");
const id = card?.dataset.coach;
const classId = classFrom(location.search);
if (card && classId) card.querySelector(".cc-book").href = bookingURL(id, classId);
if (card) refreshCard(card, id);
