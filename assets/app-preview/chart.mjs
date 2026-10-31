import { candles, activePlan, patternLevels, price } from "./core.mjs";
import { fixtures } from "./ui.mjs";
const PATTERN_LINE = { Move: "var(--app-green)", Confirm: "var(--app-text)", Line: "var(--app-text)", Entry: "var(--app-text)", Retest: "var(--app-retest)", Fail: "#cd343c" };
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export function attachChart(svg, state, onTakeover, onLevel) {
  if (!svg) return;
  let W = 340, H = 235, plot, axisWidth;
  let all = candles(state.symbol, state.timeframe),
    visible = [],
    mapping,
    drag = null,
    pointers = new Map(),
    pinch = null;
  const readout = svg.closest(".chart-card").querySelector(".chart-readout");
  const tooltip = svg.parentElement.querySelector(".chart-data");
  function draw() {
    // Mac charts use the available window width without scaling up axis text.
    W = state.platform === "macos" ? Math.max(340, Math.round(svg.clientWidth)) : 340;
    H = Math.max(235, Math.round(svg.clientHeight / Math.max(1, svg.clientWidth) * W));
    axisWidth = 84;
    plot = { x: 8, y: 13, w: W - axisWidth - 16, h: H - 45 };
    const count = clamp(Math.round(state.chart.count), 16, 100);
    state.chart.count = count;
    state.chart.offset = clamp(
      Math.round(state.chart.offset),
      0,
      all.length - count,
    );
    const end = all.length - state.chart.offset;
    visible = all.slice(end - count, end);
    const p = activePlan(state);
    const showLevels = ["stops", "aplus", "macd", "patterns", "screener"].includes(state.screen);
    const values = visible.flatMap((b) => [b.high, b.low]);
    const levels = state.screen === "patterns"
      ? patternLevels(fixtures.patterns.find((f) => f.symbol === state.symbol)?.status, p).map(([v, label]) => [v, label, PATTERN_LINE[label]])
      : [
        ...(state.screen==="aplus"?[[p.target3,"T3","var(--app-green)"]]:[]),
        [p.target2, "T2", "var(--app-green)"],
        [p.target, "T1", "var(--app-green)"],
        [p.entry, "Entry", "var(--app-text)"],
        [p.stop, "Stop", "#cd343c"],
      ];
    if (showLevels) values.push(...levels.map(([v]) => v));
    const min = Math.min(...values),
      max = Math.max(...values),
      pad = (max - min) * 0.1;
    const lo = min - pad,
      hi = max + pad,
      dx = plot.w / count;
    const y = (v) => plot.y + ((hi - v) / (hi - lo)) * plot.h;
    mapping = { y, dx, lo, hi };
    let out = `<defs><clipPath id="plot-area"><rect x="${plot.x}" y="${plot.y}" width="${plot.w}" height="${plot.h}"/></clipPath></defs>`;
    for (let i = 0; i < 5; i++) {
      const v = lo + ((hi - lo) * i) / 4,
        cy = y(v);
      const nearLevel =
        showLevels &&
        levels.some(([level]) => Math.abs(y(level) - cy) < 15);
      out += `<line x1="8" y1="${cy}" x2="${W - axisWidth - 6}" y2="${cy}" stroke="var(--app-elev)" stroke-width="1"/>`;
      if (!nearLevel)
        out += `<text x="${W - axisWidth}" y="${cy + 3}" fill="var(--app-dim)" font-size="12">${v.toFixed(2)}</text>`;
    }
    if (showLevels) {
      const zones = levels.map(([, label]) => label);
      if (zones.some((label) => label === "T1" || label === "Move"))
        out += `<rect x="8" y="${Math.min(y(p.entry), y(p.target))}" width="${plot.w}" height="${Math.abs(y(p.target) - y(p.entry))}" fill="#16875f" opacity=".045"/>`;
      if (zones.some((label) => label === "Stop" || label === "Fail"))
        out += `<rect x="8" y="${Math.min(y(p.entry), y(p.stop))}" width="${plot.w}" height="${Math.abs(y(p.stop) - y(p.entry))}" fill="#cd343c" opacity=".06"/>`;
    }
    out += '<g clip-path="url(#plot-area)">';
    visible.forEach((b, i) => {
      const x = plot.x + dx * (i + 0.5),
        up = b.close >= b.open,
        color = up ? "var(--app-green)" : "#cd343c";
      out += `<line x1="${x}" x2="${x}" y1="${y(b.high)}" y2="${y(b.low)}" stroke="${color}" stroke-width="1.2"/><rect x="${x - dx * 0.3}" y="${Math.min(y(b.open), y(b.close))}" width="${Math.max(1, dx * 0.6)}" height="${Math.max(1, Math.abs(y(b.open) - y(b.close)))}" rx=".4" fill="${color}"/>`;
    });
    out += "</g>";
    if (showLevels) {
      levels.forEach(([v, label, c]) => {
        const quiet = ["Entry", "Confirm", "Line"].includes(label);
        out += `<line x1="8" x2="${W - axisWidth - 6}" y1="${y(v)}" y2="${y(v)}" stroke="${c}" stroke-width="1" stroke-dasharray="${label === "Stop" || label === "Fail" ? "" : "4 3"}" opacity=".8"/><rect x="${W - axisWidth}" y="${y(v) - 7}" width="${axisWidth-1}" height="16" rx="3" fill="${quiet ? "var(--app-elev)" : c}"/><text x="${W - axisWidth + 3}" y="${y(v) + 3}" fill="${quiet ? "var(--app-text)" : label === "Retest" ? "var(--app-bg)" : "white"}" font-size="11">${label} ${v.toFixed(2)}</text>`;
      });
    }
    if(state.screen==="stops")for(const [key,value,name] of [["stop",p.stop,"stop"],["target",p.target,"first target"],["target2",p.target2,"second target"],["entry",p.entry,"entry"]]){
      out+=`<rect data-level="${key}" x="8" y="${y(value)-8}" width="${plot.w}" height="16" fill="transparent" pointer-events="all" role="button" tabindex="0" aria-label="Explain ${name} line"/>`;
    }
    [0, Math.floor(count / 2), count - 1].forEach(
      (i) =>
        (out += `<text x="${plot.x + mapping.dx * (i + 0.5)}" y="${H - 14}" text-anchor="${i === 0 ? "start" : i === count - 1 ? "end" : "middle"}" fill="var(--app-dim)" font-size="12">Bar ${visible[i].time + 1}</text>`),
    );
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = out;
    readout.textContent = `${count} bars · ${state.chart.offset ? "Earlier" : "Latest"}`;
  }
  function move(e) {
    const r = svg.getBoundingClientRect(),
      x = ((e.clientX - r.left) / r.width) * W;
    const i = clamp(
        Math.floor((x - plot.x) / mapping.dx),
        0,
        visible.length - 1,
      ),
      b = visible[i];
    tooltip.hidden = false;
    tooltip.textContent = `Bar ${b.time + 1}  O ${b.open.toFixed(2)}  H ${b.high.toFixed(2)}  L ${b.low.toFixed(2)}  C ${b.close.toFixed(2)}`;
  }
  svg.addEventListener("pointerdown", (e) => {
    onTakeover();
    svg.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        count: state.chart.count,
      };
      drag = null;
    } else drag = { x: e.clientX, offset: state.chart.offset };
    move(e);
  });
  svg.addEventListener("pointermove", (e) => {
    if (pointers.has(e.pointerId))
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      state.chart.count = clamp(
        (pinch.count * pinch.distance) / Math.max(1, distance),
        16,
        100,
      );
      draw();
    } else if (drag && pointers.has(e.pointerId)) {
      state.chart.offset =
        drag.offset +
        ((e.clientX - drag.x) / svg.getBoundingClientRect().width) *
          state.chart.count;
      draw();
    }
    move(e);
  });
  const end = (e) => {
    if(e.type==="pointerup" && state.screen==="stops" && pointers.size===1 && drag && Math.abs(e.clientX-drag.x)<5 && onLevel){
      const rect=svg.getBoundingClientRect(), cy=(e.clientY-rect.top)/rect.height*H,p=activePlan(state);
      const near=[["stop",p.stop],["target",p.target],["target2",p.target2],["entry",p.entry]].sort((a,b)=>Math.abs(mapping.y(a[1])-cy)-Math.abs(mapping.y(b[1])-cy))[0];
      if(Math.abs(mapping.y(near[1])-cy)<12)onLevel(near[0]);
    }
    pointers.delete(e.pointerId);
    drag = null;
    pinch = null;
  };
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);
  svg.addEventListener("pointerleave", () => {
    tooltip.hidden = true;
  });
  svg.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      onTakeover();
      state.chart.count = clamp(
        state.chart.count + (e.deltaY > 0 ? 5 : -5),
        16,
        100,
      );
      draw();
    },
    { passive: false },
  );
  svg.addEventListener("keydown", (e) => {
    if(["Enter"," "].includes(e.key)&&e.target.dataset.level&&onLevel){e.preventDefault();onTakeover();onLevel(e.target.dataset.level);return;}

    if (["ArrowLeft", "ArrowRight", "+", "=", "-", "0"].includes(e.key)) {
      e.preventDefault();
      onTakeover();
      if (e.key === "ArrowLeft") state.chart.offset += 5;
      if (e.key === "ArrowRight") state.chart.offset -= 5;
      if (e.key === "+" || e.key === "=") state.chart.count -= 5;
      if (e.key === "-") state.chart.count += 5;
      if (e.key === "0") state.chart = { offset: 0, count: 42 };
      draw();
    }
  });
  draw();
  const resizeObserver = new ResizeObserver(draw);
  resizeObserver.observe(svg);
  return { draw, destroy: () => resizeObserver.disconnect() };
}
