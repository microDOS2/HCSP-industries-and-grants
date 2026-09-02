// ═══ Chart kit (window.CH) + §0/§3 core charts: league, grid price context, umbrella, payback ═══
window.CH = (() => {
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MONO = 'Menlo, Consolas, monospace', SERIF = '"et-book", Palatino, Georgia, serif';
  function svg(body, W, H) {
    return d3.select(body).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .style("width", "100%").style("height", "auto").style("display", "block");
  }
  function halo(sel, w = 4) {
    sel.attr("paint-order", "stroke").attr("stroke", "#ffffff").attr("stroke-width", w).attr("stroke-linejoin", "round");
    return sel;
  }
  // Drill binder: any element → dark card, traces to sources.js
  function drill(sel, get) {
    sel.attr("data-drill-keep", "").style("cursor", "pointer")
      .on("click", e => { e.stopPropagation(); const d = get(); U.showDrill({ ...d, x: e.clientX, y: e.clientY }); });
    return sel;
  }
  // One-shot IntersectionObserver entrance; reduced motion → final frame immediately
  function enter(host, fn) {
    if (REDUCE) { fn(); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { io.disconnect(); fn(); }
    }), { threshold: 0.18 });
    io.observe(host);
  }
  function srcStr(ids) { return window.KSTR ? KSTR(ids) : (ids || []).join(" "); }
  return { REDUCE, MONO, SERIF, svg, halo, drill, enter, srcStr };
})();

/* ────────────────────────────────────────────────────────────
   1 · League table hero — fifteen industries, weighted score /10,
   tier-colored, payback annotation (Ch. 3.1.1 v2)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("league-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Fifteen industries, one physics filter — and the ranking is still an economics verdict",
    sub: "WEIGHTED SIX-CRITERION SCORE /10 · COLOR = TIER · RIGHT COLUMN = MODELED PAYBACK · CLICK ANY BAR FOR THE RATIONALE",
    src: "Research compilation — cross-verified composites of dimension studies D1–D10 + v2 dimensions V2D3/V2D5 (2026-09), v2 league table",
  });
  const W = 880, rowH = 30, padT = 30, H = padT + rowH * RPT.league.length + 46;
  const mL = 236, mR = 210;
  const x = d3.scaleLinear().domain([0, 10]).range([mL, W - mR]);
  const svg = CH.svg(body, W, H);
  const tierCol = { 1: "#2251ff", 2: "#1233b8", 3: "#42566a", 4: "#8595a6" };
  const tierName = { 1: "TIER 1 · PURSUE NOW", 2: "TIER 2 · DEVELOP", 3: "TIER 3 · CONDITIONAL", 4: "TIER 4 · WEAK FIT" };

  // axis
  [0, 2, 4, 6, 8, 10].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 6).attr("y2", H - 40)
      .attr("stroke", v ? "#eef1f6" : "#dbe2ea");
    svg.append("text").attr("x", x(v)).attr("y", padT - 12).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#8595a6").text(v);
  });

  const rows = svg.selectAll("g.row").data(RPT.league).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);
  rows.append("text").attr("x", mL - 10).attr("y", rowH / 2 - 2)
    .attr("text-anchor", "end").attr("font-family", CH.SERIF).attr("font-weight", 700)
    .attr("font-size", 12).attr("fill", "#051c2c")
    .text(d => { const s = d.rank + ". " + d.name; return s.length > 29 ? s.slice(0, 28).replace(/[ ,;–—(/]+$/, "") + " …" : s; });
  rows.append("text").attr("x", mL - 10).attr("y", rowH / 2 + 11)
    .attr("text-anchor", "end").attr("font-family", CH.MONO).attr("font-size", 8.5)
    .attr("fill", d => d.tier === 1 ? "#2251ff" : "#8595a6").text(d => tierName[d.tier]);

  const bars = rows.append("rect")
    .attr("x", x(0)).attr("y", rowH / 2 - 8.5).attr("height", 17).attr("rx", 2)
    .attr("fill", d => tierCol[d.tier]).attr("width", 0);
  CH.drill(bars, () => ({})); // placeholder replaced below (needs row datum)
  rows.select("rect").each(function () {});
  bars.each(function (d) {
    CH.drill(d3.select(this), () => ({
      title: `RANK ${d.rank} · ${tierName[d.tier]}`, value: d.score.toFixed(2).replace(/0$/, "") + " / 10",
      sub: d.why + " Payback: " + d.payback + ".",
      source: CH.srcStr(d.src),
    }));
  });

  const vals = rows.append("text")
    .attr("x", d => x(d.score) + 7).attr("y", rowH / 2 + 4)
    .attr("font-family", CH.MONO).attr("font-size", 12).attr("font-weight", 700)
    .attr("fill", d => tierCol[d.tier]).style("opacity", 0)
    .text(d => d.score % 1 ? d.score.toFixed(2).replace(/0$/, "") : d.score.toFixed(1));
  CH.halo(vals);
  vals.each(function (d) {
    CH.drill(d3.select(this), () => ({
      title: `RANK ${d.rank} · ${d.name.toUpperCase().slice(0, 40)}`, value: d.score + " / 10",
      sub: d.why, source: CH.srcStr(d.src),
    }));
  });

  const pb = rows.append("text")
    .attr("x", x(10) + 14).attr("y", rowH / 2 + 3.5)
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", "#42566a")
    .text(d => { const s = "PAYBACK " + d.payback.toUpperCase(); return s.length > 33 ? s.slice(0, 32) + " …" : s; });
  CH.halo(pb);
  pb.each(function (d) {
    CH.drill(d3.select(this), () => ({
      title: "MODELED PAYBACK · " + d.name.toUpperCase().slice(0, 34), value: d.payback,
      sub: "Payback is a stream-selection variable, not a technology variable. " + d.why,
      source: CH.srcStr(d.src),
    }));
  });

  // the cliff annotation: between the last Tier-3 row (4.75) and the Tier-4 tail (<4.5)
  const cliffIdx = RPT.league.findIndex(d => d.tier === 4);
  const cliffY = padT + (cliffIdx > 0 ? cliffIdx : 11) * rowH;
  const cliff = svg.append("g").style("opacity", 0);
  cliff.append("line").attr("x1", x(0) + 4).attr("x2", W - mR + 130).attr("y1", cliffY).attr("y2", cliffY)
    .attr("stroke", "#c22f4e").attr("stroke-dasharray", "3 4").attr("stroke-width", 1);
  const ct = cliff.append("text").attr("x", x(4.35)).attr("y", cliffY + 12)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#c22f4e")
    .text("THE CLIFF: BELOW 4.5, PHYSICS BINDS");
  CH.halo(ct);
  CH.drill(cliff.select("line"), () => ({
    title: "THE 4.5 CLIFF", value: "Tier 3 → Tier 4",
    sub: "Every market scoring 6.0 or above sits high on feed concentration or disposal-price protection; every market below 4.5 fails both. Produced water's +1.25 v2 revision still leaves it in the conditional zone — a real niche, not a basin-scale play.",
    source: CH.srcStr(["K70", "K100"]),
  }));

  CH.enter(host, () => {
    bars.transition().duration(750).delay((d, i) => i * 55).attr("width", d => x(d.score) - x(0));
    vals.transition().delay((d, i) => 500 + i * 55).duration(300).style("opacity", 1);
    cliff.transition().delay(900).duration(400).style("opacity", 1);
  });
  if (CH.REDUCE) bars.attr("width", d => x(d.score) - x(0)), vals.style("opacity", 1), cliff.style("opacity", 1);
})();

/* ────────────────────────────────────────────────────────────
   2 · Grid power price context by region vs the water value (Ch. 1.2.3 / 8.4)
   Prices the startup/auxiliary draw and the value of exported energy —
   operating energy itself is negligible per the manufacturer (self-fueling loop).
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("energy-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Grid power price context — startup/auxiliary draw and the value of exported energy",
    sub: "REGIONAL GRID PRICE $/M³-EQUIVALENT (75–95 KW STARTUP/AUXILIARY SPEC × REGIONAL POWER PRICE) · DASHED = RECOVERED-WATER VALUE ~$3.5/M³ · OPERATING ENERGY NEGLIGIBLE PER MANUFACTURER (SELF-FUELING LOOP) · CLICK BARS",
    src: "Industry & official — EIA (2025), Eurostat (H2-2025), EPA WaterSense (2024); broker relays for CN/IN/MEA power prices",
  });
  const W = 880, rowH = 38, padT = 34, H = padT + rowH * RPT.energy_floor.length + 50;
  const mL = 250, mR = 30;
  const x = d3.scaleLinear().domain([0, 60]).range([mL, W - mR]);
  const svg = CH.svg(body, W, H);
  const wv = RPT.water_value.v;

  [0, 10, 20, 30, 40, 50, 60].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 8).attr("y2", H - 44).attr("stroke", "#eef1f6");
    svg.append("text").attr("x", x(v)).attr("y", padT - 14).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#8595a6").text("$" + v);
  });

  // the gap band: water value → lowest floor
  const gap = svg.append("g").style("opacity", 0);
  gap.append("rect").attr("x", x(wv)).attr("y", padT - 4).attr("width", x(10.8) - x(wv)).attr("height", H - 44 - padT)
    .attr("fill", "rgba(194,47,78,.07)");
  gap.append("text").attr("x", x(wv) + 7).attr("y", H - 56).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", "#c22f4e")
    .text("WATER SALES ALONE CAN'T CARRY THE BUSINESS");
  CH.drill(gap.select("rect"), () => ({
    title: "WHY DESTRUCTION PRICING", value: "$3.5/m³ water value",
    sub: "Recovered water earns ~$3.5/m³ — a byproduct credit that can never carry the business on its own. The product must be priced as destruction, not water; energy export adds revenue on concentrated feeds. HCSP operating energy cost itself is negligible per the manufacturer (self-fueling hydrogen loop).",
    source: CH.srcStr(["K31", "K25", "K1"]),
  }));

  const rows = svg.selectAll("g.r").data(RPT.energy_floor).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);
  rows.append("text").attr("x", mL - 12).attr("y", 14).attr("text-anchor", "end")
    .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5).attr("fill", "#051c2c")
    .text(d => d.region.length > 30 ? d.region.slice(0, 29).replace(/[ ,;–—-]+$/, "") + " …" : d.region);
  rows.append("text").attr("x", mL - 12).attr("y", 26).attr("text-anchor", "end")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#8595a6")
    .text(d => d.idx ? `REGIONAL INDEX ${d.idx}/25` : "—");

  const barsG = rows.append("g");
  barsG.each(function (d) {
    const g = d3.select(this);
    const bx = g.append("rect").attr("x", x(d.lo)).attr("y", 3).attr("height", 16).attr("rx", 2)
      .attr("fill", d.lo <= 15 ? "#2251ff" : d.lo <= 25 ? "#1233b8" : "#42566a")
      .attr("width", 0).attr("data-x0", x(d.lo)).attr("data-x1", x(d.hi));
    const lb = g.append("text").attr("x", x(d.hi) + 8).attr("y", 15)
      .attr("font-family", CH.MONO).attr("font-size", 11).attr("font-weight", 700).attr("fill", "#051c2c")
      .style("opacity", 0).text(`$${d.lo.toFixed(1)}–${d.hi.toFixed(1)}`);
    CH.halo(lb);
    const note = g.append("text").attr("x", x(d.hi) + 8).attr("y", 27)
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", "#8595a6").style("opacity", 0)
      .text(d.note.length > 52 ? d.note.slice(0, 51).replace(/[ ,;–—-]+$/, "") + " …" : d.note);
    CH.halo(note);
    [bx, lb].forEach(s => CH.drill(s, () => ({
      title: d.region.toUpperCase(), value: `$${d.lo.toFixed(1)}–${d.hi.toFixed(1)} /m³-equiv`,
      sub: "Grid price context, not an operating-cost floor: 75–95 kW startup/auxiliary spec (180–228 kWh/m³-equivalent) × regional industrial power price. HCSP operating energy cost is negligible per the manufacturer (self-fueling loop) — the prices shown matter for auxiliary draw and for valuing exported kWh on concentrated feeds. " + d.note,
      source: CH.srcStr(d.src),
    })));
    g.datum(Object.assign({}, d, { _bx: bx, _lb: lb, _nt: note }));
  });

  // water-value dashed line
  const wl = svg.append("g");
  wl.append("line").attr("x1", x(wv)).attr("x2", x(wv)).attr("y1", padT - 8).attr("y2", H - 44)
    .attr("stroke", "#2251ff").attr("stroke-width", 1.6).attr("stroke-dasharray", "5 4");
  const wt = wl.append("text").attr("x", x(wv) + 8).attr("y", padT - 2).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", "#2251ff")
    .text("WATER VALUE ≈ $3.5/M³");
  CH.halo(wt);
  CH.drill(wl.select("line"), () => ({
    title: "RECOVERED-WATER VALUE", value: "≈ $3.53 /m³",
    sub: RPT.water_value.note + ". The distilled output is a byproduct credit; water sales alone cannot carry the business — destruction pricing and energy export do.",
    source: CH.srcStr(RPT.water_value.src),
  }));

  CH.enter(host, () => {
    barsG.selectAll("rect").transition().duration(800).delay((d, i) => i * 60)
      .attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    barsG.selectAll("text").transition().delay((d, i) => 500 + i * 60).duration(300).style("opacity", 1);
    gap.transition().delay(700).duration(500).style("opacity", 1);
  });
  if (CH.REDUCE) {
    barsG.selectAll("rect").attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    barsG.selectAll("text").style("opacity", 1); gap.style("opacity", 1);
  }
})();

/* ────────────────────────────────────────────────────────────
   3 · Destruction pricing umbrella — log $/gal ladder (Ch. 4.1.2 / 8.2)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("umbrella-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "A $2–5/gal service band sits beneath a $5–50/gal incumbent umbrella",
    sub: "LOG SCALE $/GAL · BLUE = HCSP COST & PRICE BANDS · INK = INCUMBENT PATHWAYS · CLICK ANY BAND FOR BASIS",
    src: "Company disclosure & official — disposal pricing guides (2025), 374Water investor materials (vendor-flagged), report Ch. 8.2 model [derived]",
  });
  const W = 880, rowH = 36, padT = 40, H = padT + rowH * RPT.umbrella.length + 44;
  const mL = 236, mR = 26;
  const x = d3.scaleLog().domain([0.05, 60]).range([mL, W - mR]);
  const svg = CH.svg(body, W, H);

  [0.1, 0.5, 1, 2, 5, 10, 20, 50].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 8).attr("y2", H - 40).attr("stroke", "#eef1f6");
    svg.append("text").attr("x", x(v)).attr("y", padT - 14).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#8595a6").text("$" + v);
  });

  const rows = svg.selectAll("g.r").data(RPT.umbrella).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);
  rows.append("text").attr("x", mL - 12).attr("y", 13).attr("text-anchor", "end")
    .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5)
    .attr("fill", d => d.cls === "inc" ? "#051c2c" : "#2251ff")
    .text(d => d.name.length > 34 ? d.name.slice(0, 33).replace(/[ ,;–—-]+$/, "") + " …" : d.name);

  rows.each(function (d) {
    const g = d3.select(this);
    const col = d.cls === "inc" ? "#42566a" : d.cls === "hcsp2" ? "#2251ff" : "#7d9bff";
    const bar = g.append("rect").attr("x", x(d.lo)).attr("y", 2).attr("height", 15).attr("rx", 2)
      .attr("fill", col).attr("opacity", d.cls === "hcsp" ? 0.85 : 1).attr("width", 0)
      .attr("data-x0", x(d.lo)).attr("data-x1", x(d.hi));
    // end caps
    [d.lo, d.hi].forEach(v => {
      g.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", 0).attr("y2", 17)
        .attr("stroke", col).attr("stroke-width", 1.6).style("opacity", 0).attr("class", "cap");
    });
    const lab = g.append("text")
      .attr("x", x(d.hi) + 60 > W - 20 ? x(d.lo) - 8 : x(d.hi) + 8).attr("y", 14)
      .attr("text-anchor", x(d.hi) + 60 > W - 20 ? "end" : "start")
      .attr("font-family", CH.MONO).attr("font-size", 10.5).attr("font-weight", 700).attr("fill", "#051c2c")
      .style("opacity", 0)
      .text(d.hi >= 50 ? `$${d.lo}–${d.hi}+` : d.hi < 1 ? `$${d.lo.toFixed(2)}–${d.hi.toFixed(2)}` : `$${d.lo}–${d.hi}`);
    CH.halo(lab);
    [bar, lab].forEach(s => CH.drill(s, () => ({
      title: d.name.toUpperCase(), value: `$${d.lo}–${d.hi}${d.hi >= 50 ? "+" : ""} /gal`,
      sub: d.note, source: CH.srcStr(d.src),
    })));
  });

  // ceiling marker: Michigan AFFF $28
  const cm = svg.append("g").style("opacity", 0);
  cm.append("line").attr("x1", x(28)).attr("x2", x(28)).attr("y1", padT + 6 * rowH - 6).attr("y2", padT + 7 * rowH + 22)
    .attr("stroke", "#c22f4e").attr("stroke-width", 1.4);
  cm.append("text").attr("x", 866).attr("y", H - 12).attr("text-anchor", "end")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#c22f4e")
    .text("MICHIGAN PAID $28/GAL TO LANDFILL AFFF (2020)");
  CH.drill(cm.select("text"), () => ({
    title: "THE PANIC-BUYING CEILING", value: "$28 /gal",
    sub: "The ceiling panic-buying sets when destruction capacity is scarce — landfilling, not destruction; CERCLA liability persists.",
    source: CH.srcStr(["K10"]),
  }));

  CH.enter(host, () => {
    rows.selectAll("rect").transition().duration(800).delay((d, i) => i * 55)
      .attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    rows.selectAll("text.cap, line.cap").transition().delay((d, i) => 480 + i * 55).duration(250).style("opacity", 1);
    rows.selectAll("text").filter(function () { return d3.select(this).attr("text-anchor") == null; })
      .transition().delay((d, i) => 480 + i * 55).duration(250).style("opacity", 1);
    cm.transition().delay(900).duration(400).style("opacity", 1);
  });
  if (CH.REDUCE) {
    rows.selectAll("rect").attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    rows.selectAll("line.cap, text").style("opacity", 1); cm.style("opacity", 1);
  }
})();

/* ────────────────────────────────────────────────────────────
   4 · Payback by vertical — the cliff (Ch. 8.3)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("payback-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Payback is a cliff: months where the baseline is destruction-priced, years where it is not",
    sub: "MODELED SIMPLE PAYBACK, YEARS · US COST BASIS · BLUE = DESTRUCTION-PRICED BASELINE · INK = DISPOSAL-PRICED · HATCHED RED = NO EQUIPMENT PAYBACK · MANUFACTURER COST INPUTS PENDING — ADDRESSABLE-SAVINGS BASIS",
    src: "Research compilation — report Ch. 8.3 payback model (2026-09), per-vertical baselines from priced disposal tariffs",
  });
  const W = 880, rowH = 40, padT = 40, H = padT + rowH * RPT.payback.length + 46;
  const mL = 250, mR = 40;
  const x = d3.scaleLinear().domain([0, 6.6]).range([mL, W - mR]);
  const svg = CH.svg(body, W, H);

  [0, 1, 2, 3, 4, 5, 6].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 8).attr("y2", H - 42).attr("stroke", "#eef1f6");
    svg.append("text").attr("x", x(v)).attr("y", padT - 14).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#8595a6").text(v + " YR");
  });
  // Tier-1 bar line at 1.5 yr
  svg.append("line").attr("x1", x(1.5)).attr("x2", x(1.5)).attr("y1", padT - 8).attr("y2", H - 42)
    .attr("stroke", "#2251ff").attr("stroke-width", 1.4).attr("stroke-dasharray", "5 4");
  const barLbl = svg.append("text").attr("x", x(1.5) + 6).attr("y", padT - 2)
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", "#2251ff")
    .text("THE TIER-1 BAR · <1.5 YR");
  CH.halo(barLbl);

  const rows = svg.selectAll("g.r").data(RPT.payback).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);
  rows.append("text").attr("x", mL - 12).attr("y", 14).attr("text-anchor", "end")
    .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5).attr("fill", "#051c2c")
    .text(d => d.name.length > 36 ? d.name.slice(0, 35).replace(/[ ,;–—-]+$/, "") + " …" : d.name);

  rows.each(function (d, i) {
    const g = d3.select(this);
    if (d.kind === "gap") {
      // draw the gap itself: red hatch + ? — no interpolation, no hiding
      const gw = 216;
      const gapG = g.append("g");
      gapG.append("rect").attr("x", mL).attr("y", 2).attr("width", gw).attr("height", 15)
        .attr("fill", "rgba(194,47,78,.08)").attr("stroke", "#c22f4e").attr("stroke-dasharray", "4 3").attr("stroke-width", 1);
      const q = gapG.append("text").attr("x", mL + 10).attr("y", 13)
        .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", "#c22f4e")
        .text("? NO STANDALONE EQUIPMENT PAYBACK");
      CH.drill(gapG.select("rect"), () => ({
        title: d.name.toUpperCase(), value: "Service model only",
        sub: d.basis + ". The physics forecloses an equipment sale: dilute runoff cannot approach autothermal operation, so energy cost exceeds any disposal saving.",
        source: CH.srcStr(d.src),
      }));
      return;
    }
    const col = d.kind === "destruction" ? "#2251ff" : "#42566a";
    const bar = g.append("rect").attr("x", x(d.lo)).attr("y", 3).attr("height", 15).attr("rx", 2)
      .attr("fill", col).attr("width", 0).attr("data-x0", x(d.lo)).attr("data-x1", x(d.hi));
    const fmt = v => v < 1 ? Math.round(v * 12) + " MO" : (v % 1 ? v.toFixed(1) : v) + " YR";
    // stagger near-equal labels
    const lift = (i > 0 && Math.abs(d.hi - (RPT.payback[i - 1].hi || 99)) < 0.5) ? -12 : 0;
    const lab = g.append("text").attr("x", x(d.hi) + 8).attr("y", 15 + lift)
      .attr("font-family", CH.MONO).attr("font-size", 10.5).attr("font-weight", 700).attr("fill", "#051c2c")
      .style("opacity", 0).text(`${fmt(d.lo)}–${fmt(d.hi)}`);
    CH.halo(lab);
    const basis = g.append("text").attr("x", x(d.hi) + 8).attr("y", 27 + lift)
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", "#8595a6").style("opacity", 0)
      .text(d.basis.length > 56 ? d.basis.slice(0, 55).replace(/[ ,;–—-]+$/, "") + " …" : d.basis);
    CH.halo(basis);
    [bar, lab].forEach(s => CH.drill(s, () => ({
      title: d.name.toUpperCase(), value: `${fmt(d.lo)}–${fmt(d.hi)}`,
      sub: d.basis + ". " + (d.kind === "destruction"
        ? "The displaced baseline is destruction-priced — the sales conversation concerns capacity and permitting speed, not price."
        : "The baseline is disposal-priced — the decision hinges on regulatory compulsion, grant funding, or crisis pricing."),
      source: CH.srcStr(d.src),
    })));
  });

  CH.enter(host, () => {
    rows.selectAll("rect[data-x0]").transition().duration(800).delay((d, i) => i * 60)
      .attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    rows.selectAll("text").transition().delay((d, i) => 520 + i * 60).duration(300).style("opacity", 1);
  });
  if (CH.REDUCE) {
    rows.selectAll("rect[data-x0]").attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    rows.selectAll("text").style("opacity", 1);
  }
})();

/* ────────────────────────────────────────────────────────────
   5 · THE SAVINGS LADDER (v3 signature) — incumbent remediation cost $/gal,
   log scale, HCSP conservative energy bound as reference band (hcsp_v3_savings_ladder.md)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("savings-chart");
  if (!host) return;
  const SM = RPT.savings_meta;
  const compByKey = {};
  RPT.league.forEach(d => { compByKey[d.key] = d; });
  const body = U.frame(host, {
    title: "The Savings Ladder — what incumbents charge to make each gallon disappear",
    sub: "INCUMBENT REMEDIATION COST $/GAL · LOG SCALE · BLUE BAND = CONSERVATIVE ENERGY BOUND $0.07–0.09/GAL (SELF-FUELING LOOP) · DASHED OUTLINE = LOW CONFIDENCE · CLICK ANY BAR FOR VALUE + BASIS + DATED SOURCE",
    src: "Research compilation — report v3 addendum (2026-09), all values previously sourced in the dim research · " + CH.srcStr(["K150"]),
  });
  const data = RPT.savings_ladder;
  const W = 880, rowH = 38, padT = 46, H = padT + rowH * data.length + 48;
  const mL = 268, mR = 30;
  const x = d3.scaleLog().domain([0.005, 100]).range([mL, W - mR]);
  const svg = CH.svg(body, W, H);
  const fv = v => v < 0.1 ? v.toFixed(3) : v < 1 ? v.toFixed(2) : String(v);
  const band$ = d => "$" + fv(d.lo) + "–" + fv(d.hi) + (d.plus ? "+" : "");

  // axis ticks (log)
  [0.01, 0.1, 1, 10, 100].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 8).attr("y2", H - 44).attr("stroke", "#eef1f6");
    svg.append("text").attr("x", x(v)).attr("y", padT - 14).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#8595a6").text("$" + v);
  });

  // ── HCSP conservative energy-bound reference band (geometry unchanged) ──
  const fl = svg.append("g").style("opacity", 0);
  fl.append("rect").attr("x", x(SM.floor.lo)).attr("y", padT - 6)
    .attr("width", x(SM.floor.hi) - x(SM.floor.lo)).attr("height", H - 44 - padT + 6)
    .attr("fill", "rgba(34,81,255,.10)");
  [SM.floor.lo, SM.floor.hi].forEach(v => {
    fl.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 6).attr("y2", H - 44)
      .attr("stroke", "#2251ff").attr("stroke-width", 1.2).attr("stroke-dasharray", "4 3");
  });
  const flLab = fl.append("text").attr("x", x(0.05)).attr("y", H - 24).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", "#2251ff")
    .text("CONSERVATIVE BOUND $0.07–0.09/GAL");
  CH.halo(flLab);
  fl.append("text").attr("x", x(0.05)).attr("y", H - 12).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", "#7d9bff")
    .text("(SELF-FUELING LOOP · MFR PRICING TBD)");
  CH.drill(fl.select("rect"), () => ({
    title: "THE REFERENCE CONTRAST", value: "$0.07–0.09 /gal (conservative bound)",
    sub: "Manufacturer-stated negligible net energy in operation (self-fueling hydrogen loop); the band is a conservative bound computed from the briefing's 75–95 kW startup/auxiliary spec at 10 m³/day — against " + SM.field_band + ". " + SM.pending,
    source: CH.srcStr(["K22", "K54", "K150"]),
  }));

  // ── rows ──
  const rows = svg.selectAll("g.r").data(data).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);

  rows.append("text").attr("x", mL - 12).attr("y", 13).attr("text-anchor", "end")
    .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5).attr("fill", "#051c2c")
    .text(d => {
      const s = d.srank + ". " + d.vertical;
      if (s.length <= 32) return s;
      const cut = s.slice(0, 32); const sp = cut.lastIndexOf(" ");
      return (sp > 18 ? cut.slice(0, sp) : cut).replace(/[ ,;–—(/]+$/, "") + " …";
    });
  rows.append("text").attr("x", mL - 12).attr("y", 26).attr("text-anchor", "end")
    .attr("font-family", CH.MONO).attr("font-size", 8.5)
    .attr("fill", d => {
      const c = compByKey[d.key]; if (!c) return "#8595a6";
      return d.srank < c.rank ? "#2251ff" : d.srank > c.rank ? "#8595a6" : "#42566a";
    })
    .text(d => {
      const c = compByKey[d.key]; if (!c) return "—";
      const dv = c.rank - d.srank;
      return "COMPOSITE #" + c.rank + " " + (dv > 0 ? "▲" + dv : dv < 0 ? "▼" + (-dv) : "=");
    });

  rows.each(function (d) {
    const g = d3.select(this);
    const col = d.srank <= 3 ? "#2251ff" : "#42566a";
    if (d.na) {
      // N/A row: hatched gap, drawn not hidden (semantic red = missing data)
      const gw = 300;
      const gapG = g.append("g");
      gapG.append("rect").attr("x", mL).attr("y", 3).attr("width", gw).attr("height", 15)
        .attr("fill", "rgba(194,47,78,.07)").attr("stroke", "#c22f4e").attr("stroke-dasharray", "4 3").attr("stroke-width", 1);
      gapG.append("text").attr("x", mL + 10).attr("y", 14)
        .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", "#c22f4e")
        .text("N/A — OFFTAKER, NO REMEDIATION STREAM");
      CH.drill(gapG.select("rect"), () => ({
        title: "SAVINGS #" + d.srank + " · " + d.vertical.toUpperCase(), value: "N/A — offtaker",
        sub: d.note + " The credible play is inverted: HCSP plants at waste-rich hosts sell power, cooling, and reclaimed water across the fence.",
        source: CH.srcStr(d.src.concat(["K150"])),
      }));
      return;
    }
    const bar = g.append("rect").attr("x", x(d.lo)).attr("y", 3).attr("height", 15).attr("rx", 2)
      .attr("fill", col).attr("opacity", d.lowConf ? 0.45 : 1)
      .attr("stroke", d.lowConf ? col : "none").attr("stroke-dasharray", d.lowConf ? "3 2" : null)
      .attr("stroke-width", d.lowConf ? 1 : 0)
      .attr("width", 0).attr("data-x0", x(d.lo)).attr("data-x1", x(d.hi));
    [d.lo, d.hi].forEach(v => {
      g.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", 1).attr("y2", 18)
        .attr("stroke", col).attr("stroke-width", 1.6).style("opacity", 0).attr("class", "cap");
    });
    const txt = band$(d) + (d.lowConf ? " · LOW CONF" : "");
    const rightFits = x(d.hi) + 10 + txt.length * 6.4 <= W - 6;
    const lab = g.append("text")
      .attr("x", rightFits ? x(d.hi) + 8 : x(d.lo) - 8)
      .attr("y", 14)
      .attr("text-anchor", rightFits ? "start" : "end")
      .attr("font-family", CH.MONO).attr("font-size", 10.5).attr("font-weight", 700).attr("fill", "#051c2c")
      .style("opacity", 0).text(txt);
    CH.halo(lab);
    const c = compByKey[d.key];
    [bar, lab].forEach(s => CH.drill(s, () => ({
      title: "SAVINGS #" + d.srank + " · " + d.vertical.toUpperCase().slice(0, 44),
      value: band$(d) + " /gal",
      sub: d.note + (c ? " Composite lens: #" + c.rank + " (" + c.score + "/10) — " + (d.srank < c.rank ? "elevated" : d.srank > c.rank ? "demoted" : "unchanged") + " under the savings lens. " : "") + (d.lowConf ? "Flagged LOW CONFIDENCE (sparse data). " : "") + SM.qualifier + ".",
      source: CH.srcStr(d.src.concat(["K150"])),
    })));
  });

  CH.enter(host, () => {
    rows.selectAll("rect[data-x0]").transition().duration(800).delay((d, i) => i * 55)
      .attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    rows.selectAll("line.cap").transition().delay((d, i) => 480 + i * 55).duration(250).style("opacity", 1);
    rows.selectAll("text").filter(function () { return d3.select(this).style("opacity") === "0"; })
      .transition().delay((d, i) => 480 + i * 55).duration(250).style("opacity", 1);
    fl.transition().delay(850).duration(450).style("opacity", 1);
  });
  if (CH.REDUCE) {
    rows.selectAll("rect[data-x0]").attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    rows.selectAll("line.cap, text").style("opacity", 1);
    fl.style("opacity", 1);
  }
})();
