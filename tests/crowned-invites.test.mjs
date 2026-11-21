import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {traders} from "../app/traders.mjs";
import {invitedNextSteps} from "../app/signup-next.mjs";
import {signupBody} from "../assets/early-access/core.mjs";
import {plans} from "../app/checkouts.mjs";
const association=JSON.parse(readFileSync(new URL("../.well-known/apple-app-site-association",import.meta.url)));
test("all roster links reach both signup sources and an app invitation",()=>{
  assert.equal(traders.size,12);
  for(const [id] of traders) for(const source of ["web","app"]){
    const search="?ref=ct-"+source+"-"+id;
    assert.equal(signupBody({search}).ref,"ct-"+source+"-"+id);
    assert.equal(invitedNextSteps(search)[0].url,"/app/?ref="+id);
  }
  assert.equal(association.applinks.details[0].components[0]["/"],"/app/");
});
test("only provider-mapped plans are offered and Daniel retains his existing deal",()=>{
  for(const [coach] of traders){
    const steps=invitedNextSteps("?ref=ct-web-"+coach);
    for(const {url} of steps.filter(s=>s.url.includes("membership.html"))){
      const p=new URL(url,"https://thefriendlytrader.com").searchParams;
      assert.ok(plans[coach][p.get("plan")]);
    }
  }
  assert.ok(invitedNextSteps("?ref=ct-web-daniel").some(s=>s.url==="/daniel/"));
  assert.deepEqual(invitedNextSteps("?ref=ct-web-undefined"),[]);
});
