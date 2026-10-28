// ═══ Chart kit (window.CH) + §0/§3 core charts: league, grid price context, umbrella, time to earn back the cost ═══
window.CH = (() => {
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MONO = 'Menlo, Consolas, monospace', SERIF = '"et-book", Palatino, Georgia, serif';
  const _svgs = []; // registry of every chart svg, for the font-floor engine
  function svg(body, W, H) {
    const s = d3.select(body).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .style("width", "100%").style("height", "auto").style("display", "block");
    _svgs.push(s.node());
    return s;
  }
  /* ── Readability floor: enforce minimum RENDERED font sizes on every chart.
     Axis/tick/annotation text ≥12px rendered, bold numeric value labels ≥14px
     (≥11px allowed at ≤768px viewports). Because the svgs are viewBox-scaled,
     the floor is expressed in rendered px and converted per chart via the
     current render scale; re-applied on viewport resize (debounced). ── */
  function fitText() {
    const vw = window.innerWidth || 1680;
    const floorBase = vw <= 768 ? 11 : 12;
    const floorVal = vw <= 768 ? 11 : 14;
    _svgs.forEach(node => {
      if (!node.isConnected) return;
      const vb = (node.getAttribute("viewBox") || "").split(/\s+/);
      const vbW = +vb[2] || 880;
      const rw = node.getBoundingClientRect().width || vbW;
      const scale = rw / vbW;
      node.querySelectorAll("text").forEach(t => {
        let base = +t.getAttribute("data-fs0");
        if (!base) { base = parseFloat(t.getAttribute("font-size")) || 10; t.setAttribute("data-fs0", base); }
        const bold = +(t.getAttribute("font-weight") || 400) >= 700;
        const hasNum = /\d/.test(t.textContent || "");
        const floor = (bold && hasNum ? floorVal : floorBase) / scale;
        t.setAttribute("font-size", Math.max(base, Math.min(floor, 22)).toFixed(1));
      });
    });
  }
  let _fitRaf = 0;
  function fitTextSoon() { cancelAnimationFrame(_fitRaf); _fitRaf = requestAnimationFrame(fitText); }
  addEventListener("resize", fitTextSoon, { passive: true });
  if (document.readyState === "complete") setTimeout(fitText, 60);
  else addEventListener("load", () => setTimeout(fitText, 60));
  // Wrap a long label into ≤2 tspans at word boundaries instead of truncating.
  function wrap2(t, str, maxChars) {
    if (str.length <= maxChars) { t.text(str); return; }
    const words = str.split(" ");
    let l1 = "", l2 = "";
    words.forEach(w => {
      if (!l2 && (l1 + " " + w).trim().length <= maxChars) l1 = (l1 + " " + w).trim();
      else l2 = (l2 + " " + w).trim();
    });
    if (l2.length > maxChars) l2 = l2.slice(0, maxChars - 1).replace(/[ ,;–—(/-]+$/, "") + " …";
    t.text(l1);
    t.append("tspan").attr("x", t.attr("x")).attr("dy", "1.15em").text(l2);
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
  // HTML variant: every K-anchor rendered as a clickable link to the original source (new tab)
  function srcLink(ids) { return window.KLINK ? KLINK(ids) : srcStr(ids); }
  return { REDUCE, MONO, SERIF, svg, halo, drill, enter, srcStr, srcLink, fitText, fitTextSoon, wrap2 };
})();

/* ────────────────────────────────────────────────────────────
   1 · Ranking hero — fifteen industries, weighted score /10,
   tier-colored, time to earn back the cost annotation (Ch. 3.1.1 v2)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("league-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Fifteen industries, one physics filter — and the ranking is still an economics verdict",
    sub: "WEIGHTED SIX-CRITERION SCORE /10 · COLOR = TIER · RIGHT COLUMN = NET TIME TO EARN BACK THE COST (PENDING MANUFACTURER COST MODEL) · CLICK ANY BAR FOR THE RATIONALE",
    src: "Research compilation — cross-checked composites from the report's industry studies (D1–D10) and the v2 industry chapter (2026-09)",
  });
  const W = 880, rowH = 50, padT = 32, H = padT + rowH * RPT.league.length + 46;
  const mL = 236, mR = 210;
  const x = d3.scaleLinear().domain([0, 10]).range([mL, W - mR]);
  const svg = CH.svg(body, W, H);
  const tierCol = { 1: "#2251ff", 2: "#1233b8", 3: "#42566a", 4: "#42566a" };
  const tierName = { 1: "TIER 1 · PURSUE NOW", 2: "TIER 2 · DEVELOP", 3: "TIER 3 · CONDITIONAL", 4: "TIER 4 · WEAK FIT" };

  // axis
  [0, 2, 4, 6, 8, 10].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 6).attr("y2", H - 40)
      .attr("stroke", v ? "#eef1f6" : "#dbe2ea");
    svg.append("text").attr("x", x(v)).attr("y", padT - 12).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#42566a").text(v);
  });

  const rows = svg.selectAll("g.row").data(RPT.league).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);
  rows.append("text").attr("x", mL - 10).attr("y", rowH / 2 - 13)
    .attr("text-anchor", "end").attr("font-family", CH.SERIF).attr("font-weight", 700)
    .attr("font-size", 12.5).attr("fill", "#051c2c")
    .each(function (d) { CH.wrap2(d3.select(this), d.rank + ". " + d.name, 24); });
  rows.append("text").attr("x", mL - 10).attr("y", rowH / 2 + 20)
    .attr("text-anchor", "end").attr("font-family", CH.MONO).attr("font-size", 8.5)
    .attr("fill", d => d.tier === 1 ? "#2251ff" : "#42566a").text(d => tierName[d.tier]);

  const bars = rows.append("rect")
    .attr("x", x(0)).attr("y", rowH / 2 - 8.5).attr("height", 17).attr("rx", 2)
    .attr("fill", d => tierCol[d.tier]).attr("width", 0);
  CH.drill(bars, () => ({})); // placeholder replaced below (needs row datum)
  rows.select("rect").each(function () {});
  bars.each(function (d) {
    CH.drill(d3.select(this), () => ({
      title: `RANK ${d.rank} · ${tierName[d.tier]}`, value: d.score.toFixed(2).replace(/0$/, "") + " / 10",
      sub: d.why + " Net time to earn back the cost: " + d.payback + " (savings before our costs are known — pending the manufacturer cost model).",
      source: CH.srcLink(d.src),
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
      sub: d.why, source: CH.srcLink(d.src),
    }));
  });

  const pb = rows.append("text")
    .attr("x", x(10) + 14).attr("y", rowH / 2 + 3.5)
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", "#42566a")
    .text(d => { const s = d.payback.toUpperCase(); return s.length > 30 ? s.slice(0, 29).replace(/[ ,;–—(/-]+$/, "") + " …" : s; });
  pb.style("font-style", d => /^pending/i.test(d.payback) ? "italic" : "normal");
  CH.halo(pb);
  pb.each(function (d) {
    CH.drill(d3.select(this), () => ({
      title: "NET TIME TO EARN BACK THE COST · " + d.name.toUpperCase().slice(0, 34), value: d.payback,
      sub: "Net time to earn back the cost is pending the manufacturer cost model — rankings here use savings before our costs are known, measured against documented existing-supplier costs. Time to earn back the cost is a stream-selection variable, not a technology variable. " + d.why,
      source: CH.srcLink(d.src),
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
    source: CH.srcLink(["K70", "K100"]),
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
    sub: "REGIONAL GRID PRICE $/M³-EQUIVALENT (75–95 KW STARTUP POWER SPEC × REGIONAL POWER PRICE) · DASHED = RECOVERED-WATER VALUE ~$3.5/M³ · OPERATING ENERGY NEGLIGIBLE PER MANUFACTURER (SELF-FUELING LOOP) · CLICK BARS",
    src: "Industry & official — EIA (2025), Eurostat (H2-2025), EPA WaterSense (2024); broker relays for China, India, and Middle East power prices",
  });
  const W = 880, rowH = 50, padT = 34, H = padT + rowH * RPT.energy_floor.length + 50;
  const mL = 250, mR = 30;
  const x = d3.scaleLinear().domain([0, 60]).range([mL, W - mR]);
  const svg = CH.svg(body, W, H);
  const wv = RPT.water_value.v;

  [0, 10, 20, 30, 40, 50, 60].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 8).attr("y2", H - 44).attr("stroke", "#eef1f6");
    svg.append("text").attr("x", x(v)).attr("y", padT - 14).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#42566a").text("$" + v);
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
    source: CH.srcLink(["K31", "K25", "K1"]),
  }));

  const rows = svg.selectAll("g.r").data(RPT.energy_floor).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);
  rows.append("text").attr("x", mL - 12).attr("y", 10).attr("text-anchor", "end")
    .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5).attr("fill", "#051c2c")
    .each(function (d) { CH.wrap2(d3.select(this), d.region, 26); });
  rows.append("text").attr("x", mL - 12).attr("y", 43).attr("text-anchor", "end")
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", "#42566a")
    .text(d => d.idx ? `ATTRACTIVENESS SCORE ${d.idx}/25` : "—");

  const barsG = rows.append("g");
  barsG.each(function (d) {
    const g = d3.select(this);
    const bx = g.append("rect").attr("x", x(d.lo)).attr("y", 6).attr("height", 18).attr("rx", 2)
      .attr("fill", d.lo <= 15 ? "#2251ff" : d.lo <= 25 ? "#1233b8" : "#42566a")
      .attr("width", 0).attr("data-x0", x(d.lo)).attr("data-x1", x(d.hi));
    const lbTxt = `$${d.lo.toFixed(1)}–${d.hi.toFixed(1)}`;
    const lbRight = x(d.hi) + 8 + lbTxt.length * 8.8 <= W - 4;
    const lb = g.append("text").attr("x", lbRight ? x(d.hi) + 8 : x(d.lo) - 8).attr("y", 20)
      .attr("text-anchor", lbRight ? "start" : "end")
      .attr("font-family", CH.MONO).attr("font-size", 11.5).attr("font-weight", 700).attr("fill", "#051c2c")
      .style("opacity", 0).text(lbTxt);
    CH.halo(lb);
    const noteTxt = d.note.length > 46 ? d.note.slice(0, 45).replace(/[ ,;–—-]+$/, "") + " …" : d.note;
    const noteRight = x(d.hi) + 8 + noteTxt.length * 7.4 <= W - 6;
    const note = g.append("text").attr("x", noteRight ? x(d.hi) + 8 : W - 6).attr("y", 35)
      .attr("text-anchor", noteRight ? "start" : "end")
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#42566a").style("opacity", 0)
      .text(noteTxt);
    CH.halo(note);
    [bx, lb].forEach(s => CH.drill(s, () => ({
      title: d.region.toUpperCase(), value: `$${d.lo.toFixed(1)}–${d.hi.toFixed(1)} /m³-equiv`,
      sub: "Grid price context, not an operating-cost floor: the 75–95 kW startup power spec (180–228 kilowatt-hours per cubic meter, kWh/m³) × the regional industrial power price. HCSP operating energy cost is negligible per the manufacturer (self-fueling loop) — the prices shown matter for the startup draw and for valuing each exported kilowatt-hour on concentrated feeds. " + d.note,
      source: CH.srcLink(d.src),
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
    source: CH.srcLink(RPT.water_value.src),
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
    title: "The existing supplier umbrella runs $1–2/gal to $15–50+/gal — HCSP's own cost and pricing are TBD",
    sub: "LOG SCALE $/GAL · INK = EXISTING SUPPLIER PATHWAYS (PUBLIC MARKET DATA) · BLUE HATCH = HCSP — TBD, MANUFACTURER COST MODEL PENDING · CLICK ANY BAND FOR BASIS",
    src: "Company disclosure & official — disposal pricing guides (2025), 374Water investor materials (vendor-flagged), report Ch. 8.2 model [derived]",
  });
  const W = 880, rowH = 40, padT = 40, H = padT + rowH * RPT.umbrella.length + 44;
  const mL = 236, mR = 26;
  const x = d3.scaleLog().domain([0.05, 60]).range([mL, W - mR]);
  const svg = CH.svg(body, W, H);

  [0.1, 0.5, 1, 2, 5, 10, 20, 50].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 8).attr("y2", H - 40).attr("stroke", "#eef1f6");
    svg.append("text").attr("x", x(v)).attr("y", padT - 14).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#42566a").text("$" + v);
  });

  const rows = svg.selectAll("g.r").data(RPT.umbrella).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);
  rows.append("text").attr("x", mL - 12).attr("y", 8).attr("text-anchor", "end")
    .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5)
    .attr("fill", d => d.cls === "inc" ? "#051c2c" : "#2251ff")
    .each(function (d) { CH.wrap2(d3.select(this), d.name, 26); });

  rows.each(function (d) {
    const g = d3.select(this);
    const col = d.cls === "inc" ? "#42566a" : d.cls === "hcsp2" ? "#2251ff" : "#7d9bff";
    if (d.tbd) {
      // HCSP cost/price rows: no figure attached — hatched TBD band, pending manufacturer cost model
      const tbdG = g.append("g").attr("class", "tbd").style("opacity", 0);
      const trect = tbdG.append("rect").attr("x", mL).attr("y", 2).attr("width", W - mR - mL).attr("height", 15).attr("rx", 2)
        .attr("fill", "rgba(34,81,255,.06)").attr("stroke", col).attr("stroke-dasharray", "4 3").attr("stroke-width", 1);
      const tlab = tbdG.append("text").attr("x", mL + 10).attr("y", 13)
        .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", col)
        .text("TBD — MANUFACTURER COST MODEL PENDING");
      CH.halo(tlab);
      CH.drill(trect, () => ({ title: d.name.toUpperCase(), value: "TBD — pending", sub: d.note, source: CH.srcLink(d.src) }));
      CH.drill(tlab, () => ({ title: d.name.toUpperCase(), value: "TBD — pending", sub: d.note, source: CH.srcLink(d.src) }));
      return;
    }
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
      sub: d.note, source: CH.srcLink(d.src),
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
    sub: "The ceiling panic-buying sets when destruction capacity is scarce — landfilling, not destruction; under the US Superfund cleanup law (CERCLA), the polluter stays liable.",
    source: CH.srcLink(["K10"]),
  }));

  CH.enter(host, () => {
    rows.selectAll("rect[data-x0]").transition().duration(800).delay((d, i) => i * 55)
      .attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    rows.selectAll("text.cap, line.cap").transition().delay((d, i) => 480 + i * 55).duration(250).style("opacity", 1);
    rows.selectAll("text").filter(function () { return d3.select(this).attr("text-anchor") == null; })
      .transition().delay((d, i) => 480 + i * 55).duration(250).style("opacity", 1);
    rows.selectAll("g.tbd").transition().delay(300).duration(400).style("opacity", 1);
    cm.transition().delay(900).duration(400).style("opacity", 1);
  });
  if (CH.REDUCE) {
    rows.selectAll("rect[data-x0]").attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
    rows.selectAll("line.cap, text").style("opacity", 1); rows.selectAll("g.tbd").style("opacity", 1); cm.style("opacity", 1);
  }
})();

/* ────────────────────────────────────────────────────────────
   4 · Time to earn back the cost by industry — the cliff (Ch. 8.3)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("payback-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The savings cliff: savings before our costs are known vs existing supplier cost — net time to earn back the cost pending",
    sub: "SAVINGS BEFORE OUR COSTS ARE KNOWN · DISPLACED EXISTING-SUPPLIER BASELINES FROM PRICED DISPOSAL TARIFFS · BLUE = DESTRUCTION-PRICED BASELINE · INK = DISPOSAL-PRICED · TIME TO EARN BACK THE COST PENDING MANUFACTURER COST MODEL — NO EARN-BACK YEARS ARE STATED · CLICK ANY ROW",
    src: "Research compilation — report Ch. 8.3 (2026-09), per-industry baselines from priced disposal tariffs",
  });
  const W = 880, rowH = 46, padT = 40, H = padT + rowH * RPT.payback.length + 46;
  const mL = 250, mR = 40;
  const svg = CH.svg(body, W, H);

  // framing note where the year axis used to be
  const fn = svg.append("text").attr("x", mL).attr("y", padT - 14).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", "#2251ff")
    .text("YEARS TO EARN BACK THE COST REQUIRE HCSP COST INPUTS — WITHHELD UNTIL THE MANUFACTURER PUBLISHES A COST MODEL");
  CH.halo(fn);

  const rows = svg.selectAll("g.r").data(RPT.payback).join("g")
    .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);
  rows.append("text").attr("x", mL - 12).attr("y", 10).attr("text-anchor", "end")
    .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5).attr("fill", "#051c2c")
    .each(function (d) { CH.wrap2(d3.select(this), d.name, 28); });

  rows.each(function (d) {
    const g = d3.select(this);
    if (d.kind === "gap") {
      // draw the gap itself: red hatch + ? — no interpolation, no hiding
      const gw = 216;
      const gapG = g.append("g");
      gapG.append("rect").attr("x", mL).attr("y", 2).attr("width", gw).attr("height", 15)
        .attr("fill", "rgba(194,47,78,.08)").attr("stroke", "#c22f4e").attr("stroke-dasharray", "4 3").attr("stroke-width", 1);
      const q = gapG.append("text").attr("x", mL + 10).attr("y", 13)
        .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", "#c22f4e")
        .text("? NO EQUIPMENT CASE");
      CH.drill(gapG.select("rect"), () => ({
        title: d.name.toUpperCase(), value: "Service model only",
        sub: d.basis + ". The physics rules out an equipment sale: dilute runoff never reaches the point where the system makes its own heat from the waste, so energy cost exceeds any disposal saving.",
        source: CH.srcLink(d.src),
      }));
      return;
    }
    const col = d.kind === "destruction" ? "#2251ff" : "#42566a";
    // pending chip: savings before our costs are known, net time to earn back the cost withheld
    const chipW = 216;
    const chipG = g.append("g").style("opacity", 0);
    const chip = chipG.append("rect").attr("x", mL).attr("y", 2).attr("width", chipW).attr("height", 15).attr("rx", 2)
      .attr("fill", d.kind === "destruction" ? "rgba(34,81,255,.08)" : "rgba(66,86,106,.08)")
      .attr("stroke", col).attr("stroke-dasharray", "4 3").attr("stroke-width", 1);
    const cl = chipG.append("text").attr("x", mL + 10).attr("y", 13)
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", col)
      .text("EARN-BACK TIME PENDING");
    CH.halo(cl);
    const basis = g.append("text").attr("x", mL + chipW + 12).attr("y", 13)
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#42566a").style("opacity", 0)
      .text(d.basis.length > 52 ? d.basis.slice(0, 51).replace(/[ ,;–—-]+$/, "") + " …" : d.basis);
    CH.halo(basis);
    [chip, cl, basis].forEach(s => CH.drill(s, () => ({
      title: d.name.toUpperCase(), value: "Net earn-back time: pending",
      sub: "Savings before our costs are known — displaced existing supplier baseline: " + d.basis + ". Net time to earn back the cost cannot be stated without HCSP cost inputs; it is pending the manufacturer cost model. " + (d.kind === "destruction"
        ? "The displaced baseline is destruction-priced — the sales conversation concerns capacity and permitting speed, not price."
        : "The baseline is disposal-priced — the decision hinges on regulatory compulsion, grant funding, or crisis pricing."),
      source: CH.srcLink(d.src),
    })));
  });

  CH.enter(host, () => {
    rows.selectAll("g").filter(function () { return this.childElementCount > 1; })
      .transition().duration(500).delay((d, i) => i * 60).style("opacity", 1);
    rows.selectAll("text").transition().delay((d, i) => 300 + i * 60).duration(300).style("opacity", 1);
  });
  if (CH.REDUCE) {
    rows.selectAll("g").style("opacity", 1);
    rows.selectAll("text").style("opacity", 1);
  }
})();

/* ────────────────────────────────────────────────────────────
   5 · THE SAVINGS LADDER (v3 signature) — what existing suppliers charge to clean it up $/gal,
   log scale, HCSP reference reduced to a qualitative pending note (hcsp_v3_savings_ladder.md)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("savings-chart");
  if (!host) return;
  const SM = RPT.savings_meta;
  const compByKey = {};
  RPT.league.forEach(d => { compByKey[d.key] = d; });
  const body = U.frame(host, {
    title: "The Savings Ladder — what existing suppliers charge to make each gallon disappear",
    sub: "WHAT EXISTING SUPPLIERS CHARGE TO CLEAN IT UP — UNIT & AXIS TOGGLES BELOW (REMEMBERED UNTIL YOU CLOSE THE TAB) · HCSP REFERENCE: SELF-FUELING LOOP, COST MODEL PENDING — NO $/GAL ATTACHED · DASHED OUTLINE = LOW CONFIDENCE · CLICK ANY BAR FOR VALUE + BASIS + DATED SOURCE",
    src: "Research compilation — report v3 addendum (2026-09), all values previously sourced in the dim research · " + CH.srcStr(["K150"]),
  });
  const GAL2M3 = 264.172; // 1 US gallon = 0.00378541 m³ → $/gal × 264.172 = $/m³
  let unit = "gal", axis = "log";
  try {
    unit = sessionStorage.getItem("hcsp-sav-unit") || "gal";
    axis = sessionStorage.getItem("hcsp-sav-axis") || "log";
  } catch (e) {}
  const data = RPT.savings_ladder;
  const W = 880, rowH = 52, padT = 50, H = padT + rowH * data.length + 48;
  const mL = 268, mR = 30;

  // ── unit / axis toggles (per-session only) ──
  const tg = document.createElement("div");
  tg.className = "unit-toggle";
  tg.innerHTML = `<span class="ut-lab">UNITS</span>
    <button type="button" data-u="gal">$/GAL</button><button type="button" data-u="m3">$/M³</button>
    <span class="ut-lab ut-gap">AXIS</span>
    <button type="button" data-a="log">LOG</button><button type="button" data-a="lin">LINEAR</button>`;
  body.parentNode.insertBefore(tg, body);
  function syncTg() {
    tg.querySelectorAll("button").forEach(b => {
      b.classList.toggle("on", (b.dataset.u && b.dataset.u === unit) || (b.dataset.a && b.dataset.a === axis));
    });
  }
  tg.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.u) unit = b.dataset.u; else axis = b.dataset.a;
    try {
      sessionStorage.setItem("hcsp-sav-unit", unit);
      sessionStorage.setItem("hcsp-sav-axis", axis);
    } catch (e) {}
    syncTg(); render(true);
  }));

  function render(instant) {
    body.innerHTML = "";
    const cv = v => unit === "m3" ? v * GAL2M3 : v;
    const x = (axis === "log" ? d3.scaleLog().domain([cv(0.005), cv(100)]) : d3.scaleLinear().domain([0, cv(100)]))
      .range([mL, W - mR]);
    const svg = CH.svg(body, W, H);
    const fv = v => {
      if (unit === "m3") { const w = v * GAL2M3; return w >= 1000 ? Math.round(w).toLocaleString("en-US") : String(Math.round(w * 10) / 10); }
      return v < 0.1 ? v.toFixed(3) : v < 1 ? v.toFixed(2) : String(v);
    };
    const band$ = d => "$" + fv(d.lo) + "–" + fv(d.hi) + (d.plus ? "+" : "");
    const unitLab = unit === "m3" ? "/m³" : "/gal";

    // axis ticks
    (axis === "log" ? [0.01, 0.1, 1, 10, 100] : [0, 20, 40, 60, 80, 100]).forEach(v => {
      svg.append("line").attr("x1", x(cv(v))).attr("x2", x(cv(v))).attr("y1", padT - 8).attr("y2", H - 44).attr("stroke", "#eef1f6");
      svg.append("text").attr("x", x(cv(v))).attr("y", padT - 14).attr("text-anchor", "middle")
        .attr("font-family", CH.MONO).attr("font-size", 10).attr("fill", "#42566a")
        .text(v === 0 ? "$0" : "$" + fv(v));
    });
    // axis caption (above the tick row so it never collides with the last tick)
    svg.append("text").attr("x", W - mR).attr("y", padT - 30).attr("text-anchor", "end")
      .attr("font-family", CH.MONO).attr("font-size", 10).attr("font-weight", 700).attr("fill", "#42566a")
      .text((unit === "m3" ? "$/M³ (×264.172)" : "$/GAL") + " · " + (axis === "log" ? "LOG" : "LINEAR"));

    // ── HCSP reference: no $/gal band — cost model pending (qualitative note only) ──
    const fl = svg.append("g").style("opacity", 0);
    fl.append("rect").attr("x", mL).attr("y", H - 32).attr("width", W - mR - mL).attr("height", 22).attr("rx", 2)
      .attr("fill", "rgba(34,81,255,.06)").attr("stroke", "#2251ff").attr("stroke-width", 1).attr("stroke-dasharray", "4 3");
    const flLab = fl.append("text").attr("x", (mL + W - mR) / 2).attr("y", H - 18).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", "#2251ff")
      .text("HCSP: SELF-FUELING LOOP · COST MODEL PENDING — NO $/GAL ATTACHED");
    CH.halo(flLab);
    CH.drill(fl.select("rect"), () => ({
      title: "THE REFERENCE CONTRAST", value: "TBD — cost model pending",
      sub: "HCSP is self-fueling once started (manufacturer-stated negligible net energy, self-fueling hydrogen loop) — but no manufacturer cost model has been published, so no $/gal figure is attached to HCSP. The market reference points are " + SM.field_band + ". " + SM.pending,
      source: CH.srcLink(["K22", "K54", "K150"]),
    }));

    // ── rows ──
    const rows = svg.selectAll("g.r").data(data).join("g")
      .attr("transform", (d, i) => `translate(0,${padT + i * rowH})`);

    rows.append("text").attr("x", mL - 12).attr("y", 10).attr("text-anchor", "end")
      .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5).attr("fill", "#051c2c")
      .each(function (d) { CH.wrap2(d3.select(this), d.srank + ". " + d.vertical, 24); });
    rows.append("text").attr("x", mL - 12).attr("y", 44).attr("text-anchor", "end")
      .attr("font-family", CH.MONO).attr("font-size", 8.5)
      .attr("fill", d => {
        const c = compByKey[d.key]; if (!c) return "#42566a";
        return d.srank < c.rank ? "#2251ff" : "#42566a";
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
          .text("N/A — BUYER OF THE OUTPUT, NO STREAM");
        CH.drill(gapG.select("rect"), () => ({
          title: "SAVINGS #" + d.srank + " · " + d.vertical.toUpperCase(), value: "N/A — buyer of the output",
          sub: d.note + " The credible play is inverted: HCSP plants at waste-rich hosts sell power, cooling, and reclaimed water across the fence.",
          source: CH.srcLink(d.src.concat(["K150"])),
        }));
        return;
      }
      const bar = g.append("rect").attr("x", x(cv(d.lo))).attr("y", 3).attr("height", 15).attr("rx", 2)
        .attr("fill", col).attr("opacity", d.lowConf ? 0.45 : 1)
        .attr("stroke", d.lowConf ? col : "none").attr("stroke-dasharray", d.lowConf ? "3 2" : null)
        .attr("stroke-width", d.lowConf ? 1 : 0)
        .attr("width", 0).attr("data-x0", x(cv(d.lo))).attr("data-x1", x(cv(d.hi)));
      [d.lo, d.hi].forEach(v => {
        g.append("line").attr("x1", x(cv(v))).attr("x2", x(cv(v))).attr("y1", 1).attr("y2", 18)
          .attr("stroke", col).attr("stroke-width", 1.6).style("opacity", 0).attr("class", "cap");
      });
      const txt = band$(d) + (d.lowConf ? " · LOW CONFIDENCE" : "");
      const rightFits = x(cv(d.hi)) + 10 + txt.length * 8.8 <= W - 6;
      const lab = g.append("text")
        .attr("x", rightFits ? x(cv(d.hi)) + 8 : x(cv(d.lo)) - 8)
        .attr("y", 14)
        .attr("text-anchor", rightFits ? "start" : "end")
        .attr("font-family", CH.MONO).attr("font-size", 10.5).attr("font-weight", 700).attr("fill", "#051c2c")
        .style("opacity", 0).text(txt);
      CH.halo(lab);
      const c = compByKey[d.key];
      [bar, lab].forEach(s => CH.drill(s, () => ({
        title: "SAVINGS #" + d.srank + " · " + d.vertical.toUpperCase().slice(0, 44),
        value: band$(d) + " " + unitLab,
        sub: d.note + (c ? " Composite lens: #" + c.rank + " (" + c.score + "/10) — " + (d.srank < c.rank ? "elevated" : d.srank > c.rank ? "demoted" : "unchanged") + " under the savings lens. " : "") + (d.lowConf ? "Flagged LOW CONFIDENCE (sparse data). " : "") + SM.qualifier + ".",
        source: CH.srcLink(d.src.concat(["K150"])),
      })));
    });

    const final = () => {
      rows.selectAll("rect[data-x0]").attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
      rows.selectAll("line.cap, text").style("opacity", 1);
      fl.style("opacity", 1);
    };
    if (instant || CH.REDUCE) final();
    else CH.enter(host, () => {
      rows.selectAll("rect[data-x0]").transition().duration(800).delay((d, i) => i * 55)
        .attr("width", function () { return (+d3.select(this).attr("data-x1")) - (+d3.select(this).attr("data-x0")); });
      rows.selectAll("line.cap").transition().delay((d, i) => 480 + i * 55).duration(250).style("opacity", 1);
      rows.selectAll("text").filter(function () { return d3.select(this).style("opacity") === "0"; })
        .transition().delay((d, i) => 480 + i * 55).duration(250).style("opacity", 1);
      fl.transition().delay(850).duration(450).style("opacity", 1);
    });
    CH.fitTextSoon();
  }
  syncTg();
  render(false);

  // modal "view as table" data
  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.table["savings-chart"] = {
    cols: ["Savings rank", "Industry", "Existing supplier cost $/gal", "$/m³ (×264.172)", "Confidence", "Basis"],
    rows: data.map(d => [
      "#" + d.srank, d.vertical,
      d.na ? "N/A — buyer of the output" : "$" + d.lo + "–" + d.hi + (d.plus ? "+" : ""),
      d.na ? "—" : "$" + (d.lo * GAL2M3).toFixed(2) + "–" + (d.hi * GAL2M3).toFixed(2) + (d.plus ? "+" : ""),
      d.lowConf ? "Low" : "Standard", d.note,
    ]),
  };
})();
