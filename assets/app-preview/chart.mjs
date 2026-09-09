import { candles, plan, price } from "./core.mjs";
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export function attachChart(svg, state, onTakeover) {
  if (!svg) return;
  const W = 340,
    H = Math.max(
      235,
      Math.round((svg.clientHeight / Math.max(1, svg.clientWidth)) * 340),
    ),
    plot = { x: 8, y: 13, w: 266, h: H - 45 };
  let all = candles(state.symbol, state.timeframe),
    visible = [],
    mapping,
    drag = null,
    pointers = new Map(),
    pinch = null;
  const readout = svg.closest(".chart-card").querySelector(".chart-readout");
  const tooltip = svg.parentElement.querySelector(".chart-data");
  function draw() {
    const count = clamp(Math.round(state.chart.count), 16, 100);
    state.chart.count = count;
    state.chart.offset = clamp(
      Math.round(state.chart.offset),
      0,
      all.length - count,
    );
    const end = all.length - state.chart.offset;
    visible = all.slice(end - count, end);
    const p = plan(
      state.symbol,
      state.direction,
      state.screen === "aplus" ? "scalp" : state.mode,
    );
    const showLevels = ["stops", "aplus", "macd"].includes(state.screen);
    const values = visible.flatMap((b) => [b.high, b.low]);
    if (showLevels) values.push(p.stop, p.target, p.entry, p.target2);
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
        [p.stop, p.entry, p.target, p.target2].some(
          (level) => Math.abs(y(level) - cy) < 15,
        );
      out += `<line x1="8" y1="${cy}" x2="276" y2="${cy}" stroke="var(--app-elev)" stroke-width="1"/>`;
      if (!nearLevel)
        out += `<text x="282" y="${cy + 3}" fill="var(--app-dim)" font-size="9">${v.toFixed(2)}</text>`;
    }
    if (showLevels) {
      out += `<rect x="8" y="${Math.min(y(p.entry), y(p.target))}" width="266" height="${Math.abs(y(p.target) - y(p.entry))}" fill="#16875f" opacity=".045"/><rect x="8" y="${Math.min(y(p.entry), y(p.stop))}" width="266" height="${Math.abs(y(p.stop) - y(p.entry))}" fill="#cd343c" opacity=".06"/>`;
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
      [
        [p.target2, "T2", "#128463"],
        [p.target, "T1", "#128463"],
        [p.entry, "Entry", "var(--app-text)"],
        [p.stop, "Stop", "#cd343c"],
      ].forEach(([v, label, c]) => {
        out += `<line x1="8" x2="276" y1="${y(v)}" y2="${y(v)}" stroke="${c}" stroke-width="1" stroke-dasharray="${label === "Stop" ? "" : "4 3"}" opacity=".8"/><rect x="282" y="${y(v) - 7}" width="57" height="14" rx="3" fill="${label === "Entry" ? "var(--app-elev)" : c}"/><text x="285" y="${y(v) + 3}" fill="${label === "Entry" ? "var(--app-text)" : "white"}" font-size="8">${label} ${v.toFixed(2)}</text>`;
      });
    }
    [0, Math.floor(count / 2), count - 1].forEach(
      (i) =>
        (out += `<text x="${plot.x + mapping.dx * (i + 0.5)}" y="${H - 14}" text-anchor="${i === 0 ? "start" : i === count - 1 ? "end" : "middle"}" fill="var(--app-dim)" font-size="9">Bar ${visible[i].time + 1}</text>`),
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
  return { draw };
}
