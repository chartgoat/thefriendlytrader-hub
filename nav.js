// The Friendly Trader — cross-app navigator
// Drop into any app with: <script defer src="https://thefriendlytrader.com/nav.js"></script>
// Renders a floating chip top-right that expands into a 4-app switcher.
// Self-contained, shadow DOM isolated, no dependencies.

(function () {
  if (window.__friendlyTraderNavLoaded) return;
  window.__friendlyTraderNavLoaded = true;

  var TOOLS = [
    {
      key: "swj-intelligence",
      name: "SWJ Intelligence",
      desc: "Breadth, internals, Fear & Greed",
      url: "https://friendly-trader.com",
      match: ["friendly-trader.com"],
    },
    {
      key: "friendly-screener",
      name: "Friendly Screener",
      desc: "Daily stock screening",
      url: "https://friendlyscreener.com",
      match: ["friendlyscreener.com", "stock-screener-elite.replit.app", "screener.stockswithjosh.com", "app.stockswithjosh.com"],
    },
    {
      key: "friendly-options",
      name: "Friendly Options",
      desc: "Pick contracts, analyze trades, and read the flow",
      url: "https://thefriendlytrader.com/options",
      match: ["options.stockswithjosh.com", "thefriendlytrader.com/options"],
    },
    {
      key: "situtrader",
      name: "SituTrader",
      desc: "Best-setup sectors",
      url: "https://situtrader-production.up.railway.app/best-setup-sectors",
      match: ["situtrader-production.up.railway.app", "situtrader.up.railway.app"],
    },
    {
      key: "goat-scalper",
      name: "Goat Scalper",
      desc: "Discord scalping signals",
      url: "https://goatdiscordscalper-production.up.railway.app/",
      match: ["goatdiscordscalper-production.up.railway.app", "goatdiscordscalper.up.railway.app"],
    },
    {
      key: "tradesync",
      name: "TradeSync",
      desc: "Signals, watchlists, and price alerts",
      url: "https://systemized-tradealert-system-production.up.railway.app/signals",
      match: ["systemized-tradealert-system-production.up.railway.app", "systemized-tradealert-system.up.railway.app"],
    },
    {
      key: "swj-portfolio",
      name: "SWJ Portfolio",
      desc: "Portfolio Challenge positions",
      url: "https://swj-portfolio-production.up.railway.app",
      match: ["swj-portfolio-production.up.railway.app", "swj-portfolio.up.railway.app"],
    },
    {
      key: "leaderboard",
      name: "Leaderboard",
      desc: "Crowned Trader rankings and signals",
      url: "https://leaderboard.stockswithjosh.com",
      match: ["leaderboard.stockswithjosh.com"],
    },
  ];

  var HUB_URL = "https://thefriendlytrader.com/hub/";
  var HOST = (location && location.host) || "";

  // Only these emails (case-insensitive) see the chip.
  // Non-admin Whop members on the screener / SWJ Intelligence get nothing.
  var ALLOWED_EMAILS = [
    "stockcryptobots@gmail.com",
    "clancywbond@gmail.com",
  ];

  // Hosts where the chip renders unconditionally (no /api/me gate).
  // These apps are internal-only — they have no auth and no public Whop members,
  // so server-side gating would just hide the chip forever. Per product decision,
  // they're allowed to show the cross-app navigator without a credential check.
  var UNGATED_HOSTS = [
    "situtrader-production.up.railway.app",
    "situtrader.up.railway.app",
    "goatdiscordscalper-production.up.railway.app",
    "goatdiscordscalper.up.railway.app",
    "systemized-tradealert-system-production.up.railway.app",
    "systemized-tradealert-system.up.railway.app",
  ];

  function isUngatedHost() {
    for (var i = 0; i < UNGATED_HOSTS.length; i++) {
      if (HOST.indexOf(UNGATED_HOSTS[i]) !== -1) return true;
    }
    return false;
  }

  function currentTool() {
    for (var i = 0; i < TOOLS.length; i++) {
      for (var j = 0; j < TOOLS[i].match.length; j++) {
        if (HOST.indexOf(TOOLS[i].match[j]) !== -1) return TOOLS[i].key;
      }
    }
    return null;
  }

  // Returns true if the current viewer is an admin.
  // For UNGATED_HOSTS (Railway apps, no auth available), always true.
  // Otherwise the ONLY trusted source is /api/me on the current origin (server-validated
  // session from the Whop OAuth backend). Two accepted shapes:
  //   1. SWJ Intelligence-style: { email: "..." } or { user: { email: "..." } } — match against ALLOWED_EMAILS.
  //   2. Friendly Screener-style: { loggedIn: true, role: "admin", ... } — match by role.
  // No localStorage / window-flag bypass — that would let any visitor toggle the chip from the console.
  async function isAdmin() {
    if (isUngatedHost()) return true;

    try {
      var res = await fetch("/api/me", { credentials: "include", cache: "no-store" });
      if (!res.ok) return false;
      var me = await res.json();
      if (!me || me.loggedIn === false) return false;

      // Shape 1: email allowlist
      var email = (me.email || (me.user && me.user.email)) || null;
      if (email) {
        email = String(email).toLowerCase().trim();
        if (ALLOWED_EMAILS.indexOf(email) !== -1) return true;
      }

      // Shape 2: role-based (Screener returns role: "admin" for super admins)
      var role = (me.role || (me.user && me.user.role)) || null;
      if (role && String(role).toLowerCase() === "admin") return true;

      return false;
    } catch (e) {
      return false;
    }
  }

  async function mount() {
    if (window.self !== window.top) return; // hide inside iframes (e.g., Replit Preview)

    // Email gate — only the 2 admin emails see the chip
    var allowed = await isAdmin();
    if (!allowed) return;

    var host = document.createElement("div");
    host.setAttribute("data-ft-nav", "");
    host.style.cssText =
      "position:fixed;top:16px;right:16px;z-index:2147483647;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;";
    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

    var style = document.createElement("style");
    style.textContent =
      ":host,*{box-sizing:border-box}" +
      ".chip{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(10,10,10,0.92);color:#f0c651;border:1px solid rgba(212,175,55,0.35);border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em;cursor:pointer;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 4px 16px rgba(0,0,0,0.4);user-select:none;transition:border-color 180ms ease,background 180ms ease}" +
      ".chip:hover{background:rgba(20,20,20,0.95);border-color:rgba(212,175,55,0.6)}" +
      ".chip svg{width:12px;height:12px}" +
      ".panel{position:absolute;top:44px;right:0;min-width:280px;background:rgba(10,10,10,0.96);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:8px;box-shadow:0 8px 32px rgba(0,0,0,0.5);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity 160ms ease,transform 160ms ease}" +
      ".panel.open{opacity:1;transform:translateY(0);pointer-events:auto}" +
      ".panel-head{padding:8px 10px 10px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:6px}" +
      ".panel-title{font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#d4af37;margin:0 0 2px}" +
      ".panel-sub{font-size:11px;color:rgba(255,255,255,0.5);margin:0}" +
      ".item{display:flex;flex-direction:column;gap:2px;padding:10px;border-radius:8px;text-decoration:none;color:rgba(255,255,255,0.94);font-size:12px;transition:background 140ms ease}" +
      ".item:hover{background:rgba(255,255,255,0.05)}" +
      ".item.current{background:rgba(212,175,55,0.10)}" +
      ".item-name{font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px}" +
      ".item-desc{font-size:11px;color:rgba(255,255,255,0.5)}" +
      ".item .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#d4af37}" +
      ".item.current .item-name::after{content:'current';margin-left:auto;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(212,175,55,0.7);font-weight:500}" +
      ".item-name{display:flex;justify-content:space-between;align-items:center}" +
      ".divider{height:1px;background:rgba(255,255,255,0.06);margin:6px 4px}" +
      ".home{display:flex;align-items:center;gap:8px;padding:10px;border-radius:8px;text-decoration:none;color:#f0c651;font-size:12px;font-weight:600;letter-spacing:0.04em;transition:background 140ms ease}" +
      ".home:hover{background:rgba(212,175,55,0.10)}" +
      ".home svg{width:13px;height:13px}" +
      "@media (max-width:480px){.panel{min-width:260px;right:-8px}}";
    root.appendChild(style);

    var chip = document.createElement("button");
    chip.className = "chip";
    chip.setAttribute("aria-haspopup", "true");
    chip.setAttribute("aria-expanded", "false");
    chip.type = "button";
    chip.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>' +
      "<span>The Friendly Trader</span>";
    root.appendChild(chip);

    var panel = document.createElement("div");
    panel.className = "panel";
    panel.setAttribute("role", "menu");

    var head = document.createElement("div");
    head.className = "panel-head";
    head.innerHTML =
      '<p class="panel-title">The Friendly Trader</p>' +
      '<p class="panel-sub">Jump between your tools.</p>';
    panel.appendChild(head);

    var here = currentTool();
    TOOLS.forEach(function (t) {
      var a = document.createElement("a");
      a.className = "item" + (t.key === here ? " current" : "");
      a.href = t.url;
      a.setAttribute("role", "menuitem");
      a.innerHTML =
        '<span class="item-name"><span><span class="dot"></span> ' +
        t.name +
        "</span></span>" +
        '<span class="item-desc">' +
        t.desc +
        "</span>";
      panel.appendChild(a);
    });

    var div = document.createElement("div");
    div.className = "divider";
    panel.appendChild(div);

    var home = document.createElement("a");
    home.className = "home";
    home.href = HUB_URL;
    home.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 12 9-9 9 9"/><path d="M5 10v10h14V10"/></svg>' +
      "<span>Hub Home</span>";
    panel.appendChild(home);

    root.appendChild(panel);

    function setOpen(open) {
      if (open) {
        panel.classList.add("open");
        chip.setAttribute("aria-expanded", "true");
      } else {
        panel.classList.remove("open");
        chip.setAttribute("aria-expanded", "false");
      }
    }

    chip.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!panel.classList.contains("open"));
    });

    document.addEventListener("click", function (e) {
      if (!host.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    document.documentElement.appendChild(host);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
