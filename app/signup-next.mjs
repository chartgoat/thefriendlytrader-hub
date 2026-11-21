import {traders} from "./traders.mjs";
import {plans} from "./checkouts.mjs";
export function invitedNextSteps(search) {
  const match = /^ct-(?:web|app)-([a-z0-9-]+)$/.exec(new URLSearchParams(search).get("ref") ?? "");
  const coach = match?.[1];
  if (!traders.has(coach)) return [];
  const choices = [{title:"Get the iPhone app",url:"/app/?ref="+coach}];
  if (coach==="daniel") choices.push({title:"Friendly Tools with Daniel",url:"/daniel/"});
  const names = {plan_io9G63wKwKbEB:"Trader monthly membership",plan_0jiK0r8Agdru8:"Trader weekly membership"};
  for (const [plan,name] of Object.entries(names)) {
    if (plans[coach]?.[plan]) choices.push({title:name,url:"/app/membership.html?"+new URLSearchParams({ref:coach,plan})});
  }
  return choices;
}
