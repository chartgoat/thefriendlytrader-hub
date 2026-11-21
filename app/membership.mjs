import {plans} from "./checkouts.mjs";
import {traders} from "./traders.mjs";
const params=new URL(location.href).searchParams, coach=params.get("ref"), plan=params.get("plan");
const handle=Object.hasOwn(plans,coach) && Object.hasOwn(plans[coach],plan) && plans[coach][plan];
const slot=document.querySelector("#checkout");
if (!handle || !traders.has(coach)) {
  slot.textContent="This membership invitation is unavailable.";
} else {
  document.querySelector("#by").textContent="Referred by "+traders.get(coach);
  const frame=document.createElement("div");
  frame.dataset.whopCheckoutPlanId=plan;
  frame.dataset.whopCheckoutAffiliateCode=handle;
  slot.replaceChildren(frame);
  const script=document.createElement("script");
  script.src="https://js.whop.com/static/checkout/loader.js";
  script.onerror=()=>{slot.textContent="Checkout couldn’t load. Refresh to try again.";};
  document.head.append(script);
}
