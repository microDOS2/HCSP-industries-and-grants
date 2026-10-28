// ═══ v2 charts: scale ladder (cost curve), the point where the system powers itself, where the heat goes (three outputs at once) ═══

/* ────────────────────────────────────────────────────────────
   12 · The scale ladder — net energy across four rungs (log capacity
   axis); the fully loaded cost panel is withheld — HCSP cost figures
   came from a modeled stack, manufacturer cost model pending
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("scale-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Scale fixes energy first, capital second — but nothing above 306 t/d has ever operated",
    sub: "FOUR RUNGS, DILUTE-FEED BASE CASE (COD 5–20 G/L) · LOG CAPACITY AXIS · M³/DAY ↔ GALLONS/DAY TOGGLE BELOW · ENERGY BAND = SINGLE LARGE TRAIN → MANY PARALLEL UNITS · COST PANEL WITHHELD — MANUFACTURER COST MODEL PENDING · CLICK RUNGS",
    src: "Research compilation — report v2 Ch. 11.2 model [derived] · Industry & official — Los Alamos lab cost model (OSTI 3001291), DOE scaling methodology (NETL), European refiners' review (Concawe 25-6)",
  });
  // ── capacity unit toggle (per-session only): m³/day ↔ US gpd (×264.172) ──
  let capU = "m3d";
  try { capU = sessionStorage.getItem("hcsp-scale-unit") || "m3d"; } catch (e) {}
  const tg = document.createElement("div");
  tg.className = "unit-toggle";
  tg.innerHTML = `<span class="ut-lab">CAPACITY UNITS</span>
    <button type="button" data-u="m3d">M³/DAY</button><button type="button" data-u="gpd">GAL/DAY (US)</button>`;
  body.parentNode.insertBefore(tg, body);
  const syncTg = () => tg.querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.u === capU));
  tg.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    capU = b.dataset.u;
    try { sessionStorage.setItem("hcsp-scale-unit", capU); } catch (e) {}
    syncTg(); render(true);
  }));
  const capLab = m3d => capU === "gpd" ? `${Math.round(m3d * 264.172).toLocaleString("en-US")} GPD` : `${m3d.toLocaleString("en-US")} M³/DAY`;
  syncTg();

  function render(instant) {
  body.innerHTML = "";
  const W = 880, H = 496;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkMd = "#42566a", inkLo = "#42566a", blue = "#2251ff", neg = "#c22f4e";
  const mL = 84, mR = 30;
  const x = d3.scaleLog().domain([8, 2400]).range([mL, W - mR]);
  const D = RPT.scale_ladder;

  // panel geometry: energy on top, cost below
  const p1 = { y0: 46, y1: 200, dom: [0, 260], unit: "NET KWH/M³" };
  const p2 = { y0: 258, y1: 412, dom: [0, 340], unit: "FULLY LOADED COST — TBD, MANUFACTURER COST MODEL PENDING" };
  const yS = (p, v) => p.y1 - (v - p.dom[0]) / (p.dom[1] - p.dom[0]) * (p.y1 - p.y0);

  // panel frames + y gridlines (cost panel: no $ axis — HCSP cost model pending)
  [[p1, [0, 50, 100, 150, 200, 250]], [p2, []]].forEach(([p, ticks]) => {
    svg.append("line").attr("x1", mL).attr("x2", W - mR).attr("y1", p.y1).attr("y2", p.y1).attr("stroke", ink).attr("stroke-width", 1.2);
    ticks.forEach(v => {
      svg.append("line").attr("x1", mL).attr("x2", W - mR).attr("y1", yS(p, v)).attr("y2", yS(p, v)).attr("stroke", v ? "#eef1f6" : "#dbe2ea");
      svg.append("text").attr("x", mL - 8).attr("y", yS(p, v) + 3).attr("text-anchor", "end")
        .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo).text(v);
    });
    const ut = svg.append("text").attr("x", mL + 2).attr("y", p.y0 - 8).attr("text-anchor", "start")
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", inkMd).text(p.unit);
    CH.halo(ut);
  });

  // log-x ticks
  [10, 100, 1000, 1900].forEach(v => {
    [p1, p2].forEach(p => {
      svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", p.y0).attr("y2", p.y1)
        .attr("stroke", "#f4f6fa").attr("stroke-width", 1);
    });
  });

  // interpolated band (log-x linear between rungs) — energy only; cost band removed (pending)
  function bandPath(p, key) {
    const pts = D.map(d => [x(d.m3d), yS(p, d[key][0]), yS(p, d[key][1])]);
    let dstr = `M${pts[0][0]},${pts[0][2]}`;
    for (let i = 1; i < pts.length; i++) dstr += ` L${pts[i][0]},${pts[i][2]}`;
    for (let i = pts.length - 1; i >= 0; i--) dstr += ` L${pts[i][0]},${pts[i][1]}`;
    return dstr + " Z";
  }
  const b1 = svg.append("path").attr("d", bandPath(p1, "kwh")).attr("fill", "rgba(34,81,255,.13)").attr("stroke", blue).attr("stroke-width", 1).attr("stroke-dasharray", "3 3").style("opacity", 0);
  // cost panel: hatched pending band in place of modeled figures
  const b2 = svg.append("g").style("opacity", 0);
  b2.append("rect").attr("x", mL).attr("y", p2.y0 + 18).attr("width", W - mR - mL).attr("height", p2.y1 - p2.y0 - 36).attr("rx", 3)
    .attr("fill", "rgba(66,86,106,.05)").attr("stroke", inkMd).attr("stroke-width", 1).attr("stroke-dasharray", "4 3");
  const b2t = b2.append("text").attr("x", (mL + W - mR) / 2).attr("y", (p2.y0 + p2.y1) / 2 - 4).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 11).attr("font-weight", 700).attr("fill", inkMd)
    .text("COST FIGURES WITHHELD — MANUFACTURER COST MODEL PENDING");
  CH.halo(b2t);
  const b2s = b2.append("text").attr("x", (mL + W - mR) / 2).attr("y", (p2.y0 + p2.y1) / 2 + 12).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo)
    .text("EARLIER $/M³ FIGURES HERE CAME FROM A MODELED STACK, NOT THE MANUFACTURER — NO $/M³ IS ATTACHED TO HCSP");
  CH.halo(b2s);
  CH.drill(b2.select("rect"), () => ({
    title: "FULLY LOADED COST — ALL RUNGS", value: "TBD — pending",
    sub: "Scale moves net energy (top panel); what it does to cost cannot be stated until the manufacturer publishes a cost model. Literature cost figures for the SCWO technology class (e.g., the Los Alamos lab's $2–3/m³ design bound for a system that makes its own heat) are design studies, not HCSP prices.",
    source: CH.srcLink(["K70", "K72"]),
  }));

  // rung markers + labels
  const rungEls = [];
  D.forEach((d, i) => {
    const g = svg.append("g").style("opacity", 0);
    // energy panel marker
    g.append("rect").attr("x", x(d.m3d) - 5).attr("y", yS(p1, d.kwh[1])).attr("width", 10)
      .attr("height", yS(p1, d.kwh[0]) - yS(p1, d.kwh[1])).attr("fill", blue).attr("opacity", 0.9).attr("rx", 2);
    const eLab = g.append("text").attr("x", x(d.m3d) + 12).attr("y", yS(p1, (d.kwh[0] + d.kwh[1]) / 2) + 3)
      .attr("font-family", CH.MONO).attr("font-size", 10).attr("font-weight", 700).attr("fill", blue)
      .text(`${d.kwh[0]}–${d.kwh[1]}`);
    CH.halo(eLab);
    // cost panel marker: pending chip (no $/m³ attached to HCSP)
    g.append("rect").attr("x", x(d.m3d) - 5).attr("y", (p2.y0 + p2.y1) / 2 - 30).attr("width", 10)
      .attr("height", 60).attr("fill", "none").attr("stroke", inkMd).attr("stroke-width", 1).attr("stroke-dasharray", "3 2").attr("rx", 2);
    const cLab = g.append("text").attr("x", x(d.m3d) + 12).attr("y", (p2.y0 + p2.y1) / 2 + 3)
      .attr("font-family", CH.MONO).attr("font-size", 10).attr("font-weight", 700).attr("fill", inkMd)
      .text("TBD");
    CH.halo(cLab);
    // rung name under bottom axis (last two rungs staggered down to avoid collision)
    const yOff = i >= 2 ? (i - 2) * 26 : 0;
    const capexTxt = `${(i === 3 ? "Regional hub" : d.name).toUpperCase()} · COST TBD`;
    const half = capexTxt.length * 5.1 / 2 + 6;
    const xc = Math.max(mL + half, Math.min(x(d.m3d), W - mR - half));
    const nm = g.append("text").attr("x", xc).attr("y", p2.y1 + 18 + yOff).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", ink)
      .text(capLab(d.m3d));
    CH.halo(nm);
    const cx = g.append("text").attr("x", xc).attr("y", p2.y1 + 32 + yOff).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo).text(capexTxt);
    CH.halo(cx);
    if (i >= 2) g.append("line").attr("x1", x(d.m3d)).attr("x2", xc).attr("y1", p2.y1 + 4).attr("y2", p2.y1 + 12 + yOff)
      .attr("stroke", inkLo).attr("stroke-width", 0.8).attr("opacity", 0.5);
    CH.drill(g, () => ({
      title: `${d.m3d.toLocaleString("en-US")} M³/DAY · ${d.name.toUpperCase()}`,
      value: `Net energy ${d.kwh[0]}–${d.kwh[1]} kWh/m³ · cost TBD`,
      sub: `Net energy ${d.kwh[0]}–${d.kwh[1]} kWh/m³ on dilute feed (energy-balance model output, not a cost). purchase cost and $/m³: TBD — manufacturer cost model pending. ` + d.note,
      source: CH.srcLink(d.src),
    }));
    rungEls.push(g);
  });

  // crossover annotation on the energy panel
  const xo = svg.append("g").style("opacity", 0);
  xo.append("line").attr("x1", x(1000)).attr("x2", x(1000)).attr("y1", yS(p1, 0)).attr("y2", yS(p1, 0) + 0).attr("stroke", blue);
  const xot = xo.append("text").attr("x", x(30)).attr("y", p1.y0 + 12)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", blue).attr("font-weight", 700)
    .text("ABOVE ~35–40 G/L COD THE ENERGY LINE INVERTS TO NET EXPORT — SCALE STOPS MATTERING FOR ENERGY →");
  CH.halo(xot);
  const xot2 = xo.append("text").attr("x", x(30)).attr("y", p1.y0 + 25)
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkLo)
    .text("SEE THE POINT WHERE THE SYSTEM POWERS ITSELF CHART BELOW · MAKING ITS OWN HEAT FROM THE WASTE FLIPS THE SIGN; THE LADDER ONLY MOVES THE STARTING POINT");
  CH.halo(xot2);
  CH.drill(xo, () => ({
    title: "WHY FEED STRENGTH DECIDES", value: "net-zero ~35–40 g/L COD",
    sub: "Scale moves the starting point — how much a dilute stream costs to process; feed strength moves the slope — whether the process consumes or produces energy at all. " + RPT.scale_meta.limit,
    source: CH.srcLink(["K73", "K76"]),
  }));

  // scale-up honesty marker on cost panel
  const lim = svg.append("g").style("opacity", 0);
  const lt = lim.append("text").attr("x", x(1900)).attr("y", p2.y0 - 26).attr("text-anchor", "end")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", neg).attr("font-weight", 700)
    .text("⚠ LARGEST TRAIN EVER RUN: 306 TONS/DAY — EVERYTHING ABOVE IS ESTIMATED DESIGN ECONOMICS");
  CH.halo(lt);
  CH.drill(lim, () => ({
    title: "SCALE-UP HONESTY", value: "306 t/d max, ever",
    sub: RPT.scale_meta.limit + " " + RPT.scale_meta.exponent,
    source: CH.srcLink(["K76", "K74", "K75"]),
  }));

  // module-cost reading note
  const rd = svg.append("text").attr("x", mL + 4).attr("y", p2.y1 - 10).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkMd)
    .text("MODULE COST IS TBD (MANUFACTURER COST MODEL PENDING) — PART I SITS ONLY UNDER DESTRUCTION-PRICED UMBRELLAS");
  CH.halo(rd);

  const final = () => { b1.style("opacity", 1); b2.style("opacity", 1); rungEls.forEach(g => g.style("opacity", 1)); xo.style("opacity", 1); lim.style("opacity", 1); };
  if (instant || CH.REDUCE) final();
  else CH.enter(host, () => {
    b1.transition().duration(700).style("opacity", 1);
    b2.transition().delay(150).duration(700).style("opacity", 1);
    rungEls.forEach((g, i) => g.transition().delay(300 + i * 160).duration(350).style("opacity", 1));
    xo.transition().delay(900).duration(400).style("opacity", 1);
    lim.transition().delay(1050).duration(400).style("opacity", 1);
  });
  CH.fitTextSoon();
  }
  render(false);
})();

/* ────────────────────────────────────────────────────────────
   13 · The point where the system powers itself — net kWhₑ/m³ vs feed COD,
   net-zero line, export region, measured stream markers
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("crossover-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The point where the system powers itself decides which industries pay: net-zero at ~35–40 g/L COD, export from ~60",
    sub: "NET ELECTRICITY, KWH PER M³ (POSITIVE = IMPORTED, NEGATIVE = EXPORTED) × FEED STRENGTH, G/L COD (HOW MUCH ORGANIC WASTE IS IN THE WATER) · HUB LINE = US NATIONAL-LAB MODEL WITH A STEAM POWER CYCLE · DASHED BAND = 10 M³/DAY MODULE, NO POWER CYCLE · CLICK MARKERS",
    src: "Industry & official — Los Alamos lab model (2022), European refiners' review (2025), Australian water utilities (2025) · stream strengths: measured values, each dated",
  });
  const W = 880, H = 566;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkMd = "#42566a", inkLo = "#42566a", blue = "#2251ff", neg = "#c22f4e";
  const mL = 74, mR = 26, top = 40, bot = 372;
  const x = d3.scaleLinear().domain([0, 200]).range([mL, W - mR]);
  const y = d3.scaleLinear().domain([260, -80]).range([top, bot]);
  const X0 = RPT.crossover;

  // y grid + labels
  [-60, 0, 50, 100, 150, 200, 250].forEach(v => {
    svg.append("line").attr("x1", mL).attr("x2", W - mR).attr("y1", y(v)).attr("y2", y(v)).attr("stroke", v ? "#eef1f6" : "#dbe2ea");
    svg.append("text").attr("x", mL - 8).attr("y", y(v) + 3).attr("text-anchor", "end")
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo).text(v > 0 ? "+" + v : v);
  });
  // x grid
  [0, 40, 60, 100, 150, 200].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", top).attr("y2", bot).attr("stroke", "#f4f6fa");
    svg.append("text").attr("x", x(v)).attr("y", bot + 16).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", inkLo).text(v);
  });
  svg.append("text").attr("x", (mL + W - mR) / 2).attr("y", bot + 34).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 10).attr("fill", inkMd).text("FEED STRENGTH · G/L (COD)");
  svg.append("text").attr("x", 18).attr("y", (top + bot) / 2).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 10).attr("fill", inkMd)
    .attr("transform", `rotate(-90 18 ${(top + bot) / 2})`).text("NET ELECTRICITY · KWH/M³");

  // export region: right of 60 g/L, below zero
  const ex = svg.append("g").style("opacity", 0);
  ex.append("rect").attr("x", x(X0.export_from)).attr("y", y(0)).attr("width", x(200) - x(X0.export_from)).attr("height", y(-80) - y(0))
    .attr("fill", "rgba(34,81,255,.08)");
  const ext = ex.append("text").attr("x", x(128)).attr("y", y(-68)).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", blue)
    .text("EXPORT REGION — THE PLANT BECOMES A SMALL UTILITY");
  CH.halo(ext);
  CH.drill(ex.select("rect"), () => ({
    title: "EXPORT REGION", value: "≥60 g/L COD",
    sub: "Meaningful export (≥10 kilowatt-hours of electricity per cubic meter) from ~60 g/L; ~−60 kWh/m³ at 150 g/L — worth ~$5/m³ at $0.086/kWh. " + X0.ceiling,
    source: CH.srcLink(X0.src),
  }));

  // net-zero line
  svg.append("line").attr("x1", mL).attr("x2", W - mR).attr("y1", y(0)).attr("y2", y(0))
    .attr("stroke", ink).attr("stroke-width", 1.6);
  const nzl = svg.append("text").attr("x", mL + 6).attr("y", y(0) + 16)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", ink)
    .text("NET-ZERO — PAYS ITS OWN ENERGY");
  CH.halo(nzl);
  // threshold markers
  [X0.net_zero, X0.export_from].forEach((v, i) => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", top).attr("y2", bot)
      .attr("stroke", blue).attr("stroke-width", 1.2).attr("stroke-dasharray", "5 4").attr("opacity", i ? 0.9 : 0.6);
  });
  const t1 = svg.append("text").attr("x", x(X0.net_zero)).attr("y", top - 8).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", blue).text("NET-ZERO ~35–40");
  CH.halo(t1);
  const t2 = svg.append("text").attr("x", x(X0.export_from) + 10).attr("y", top - 8).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", blue).text("EXPORT ≥60 G/L");
  CH.halo(t2);

  // module band (approaches zero, never crosses)
  const mb = X0.module_band;
  let mbd = `M${x(mb[0][0])},${y(mb[0][1])}`;
  for (let i = 1; i < mb.length; i++) mbd += ` L${x(mb[i][0])},${y(mb[i][1])}`;
  for (let i = mb.length - 1; i >= 0; i--) mbd += ` L${x(mb[i][0])},${y(mb[i][2])}`;
  mbd += " Z";
  const mband = svg.append("path").attr("d", mbd).attr("fill", "rgba(66,86,106,.10)")
    .attr("stroke", inkMd).attr("stroke-width", 1).attr("stroke-dasharray", "3 3").style("opacity", 0);
  const mbl = svg.append("text").attr("x", x(58)).attr("y", y(150)).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkMd)
    .text("10 M³/DAY MODULE, NO POWER CYCLE — APPROACHES ZERO, NEVER CROSSES");
  CH.halo(mbl);
  CH.drill(mband, () => ({
    title: "MODULE WITHOUT A POWER CYCLE", value: "130–250 → ~0 kWh/m³",
    sub: "A 10 m³/day module can approach but not profitably cross the zero line; a hub with a steam power-recovery stage crosses at ~35–40 g/L and exports thereafter. Scale without concentration buys cheaper imports; concentration without scale forfeits the conversion hardware.",
    source: CH.srcLink(["K73", "K104", "K70"]),
  }));

  // hub line
  const hl = X0.hub_line;
  const hubPath = svg.append("path")
    .attr("d", `M${x(hl[0][0])},${y(hl[0][1])} L${x(hl[1][0])},${y(hl[1][1])}`)
    .attr("fill", "none").attr("stroke", blue).attr("stroke-width", 2.6).attr("stroke-linecap", "round");
  const hubDot = svg.append("circle").attr("cx", x(150)).attr("cy", y(-56.25)).attr("r", 4.5)
    .attr("fill", blue).attr("stroke", "#fff").attr("stroke-width", 1.6).style("opacity", 0);
  const hubLab = svg.append("text").attr("x", x(150)).attr("y", y(-56.25) - 12).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", blue)
    .text("−60 KWH/M³ AT 150 G/L ≈ $5/M³ CREDIT").style("opacity", 0);
  CH.halo(hubLab);
  CH.drill(hubPath, () => ({
    title: "HUB WITH POWER RECOVERY (US NATIONAL-LAB MODEL)", value: "+18 → −60 kWh/m³",
    sub: "Net electricity falls from +18 kWh/m³ imported to −60 exported as feed rises 0→~160 g/L COD, with a steam power cycle converting 37.8% of recovered heat into power. Independent brackets: self-sufficiency demonstrated >60 g/L; electricity generation judged possible >100 g/L; theoretical floor for making its own heat ~20–30 g/L organics.",
    source: CH.srcLink(["K73", "K76"]),
  }));

  // stream markers on a rail below the plot, staggered labels beneath it
  const railY = bot + 52;
  svg.append("line").attr("x1", mL).attr("x2", W - mR).attr("y1", railY).attr("y2", railY).attr("stroke", inkLo).attr("stroke-width", 1);
  const streams = X0.streams.slice().sort((a, b) => a.cod[0] - b.cod[0]);
  const rows = []; // greedy stagger: last label end-x per row
  streams.forEach((s, i) => {
    const above = s.side === "above";
    const col = above ? blue : inkLo;
    const g = svg.append("g").style("opacity", 0);
    // range tick
    g.append("line").attr("x1", x(s.cod[0])).attr("x2", x(Math.max(s.cod[1], s.cod[0] + 1.5))).attr("y1", railY + 5).attr("y2", railY + 5)
      .attr("stroke", col).attr("stroke-width", 3).attr("stroke-linecap", "round");
    g.append("line").attr("x1", x(s.cod[0])).attr("x2", x(s.cod[0])).attr("y1", railY + 1).attr("y2", railY + 9).attr("stroke", col).attr("stroke-width", 1);
    g.append("line").attr("x1", x(s.cod[1])).attr("x2", x(s.cod[1])).attr("y1", railY + 1).attr("y2", railY + 9).attr("stroke", col).attr("stroke-width", 1);
    // label placement: staggered rows below the rail
    const label = s.name.toUpperCase() + " " + (s.cod[0] === s.cod[1] ? s.cod[0] : s.cod[0] + "–" + s.cod[1]);
    const wpx = label.length * 10.4 + 12;
    const cxm = x((s.cod[0] + s.cod[1]) / 2);
    let li = 0;
    for (;;) {
      if (!rows[li] || cxm - wpx / 2 > rows[li] + 6) { rows[li] = cxm + wpx / 2; break; }
      li++;
    }
    const ly = railY + 26 + li * 21;
    g.append("line").attr("x1", cxm).attr("x2", cxm).attr("y1", railY + 9).attr("y2", ly - 4)
      .attr("stroke", col).attr("stroke-width", 0.8).attr("opacity", 0.55);
    const lt = g.append("text").attr("x", Math.max(mL + wpx / 2, Math.min(cxm, W - mR - wpx / 2))).attr("y", ly)
      .attr("text-anchor", "middle").attr("font-family", CH.MONO).attr("font-size", 7.8)
      .attr("font-weight", above ? 700 : 400).attr("fill", col).text(label);
    CH.halo(lt);
    CH.drill(g, () => ({
      title: s.name.toUpperCase(), value: (s.cod[0] === s.cod[1] ? s.cod[0] : s.cod[0] + "–" + s.cod[1]) + " g/L COD",
      sub: (above ? "Above the point where the system powers itself — the feed pays the plant. " : "Below the point where the system powers itself — screening rejects this as a direct feed. ") + s.note,
      source: CH.srcLink(s.src),
    }));
    if (CH.REDUCE) g.style("opacity", 1);
    else g.transition().delay(700 + i * 90).duration(300).style("opacity", 1);
  });
  svg.append("text").attr("x", mL).attr("y", railY + 26 + 4 * 21 + 12)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo)
    .text("MEASURED STREAM STRENGTH (COD) — BLUE MARKERS CLEAR THE POINT WHERE THE SYSTEM POWERS ITSELF; GREY NEVER WILL");

  CH.enter(host, () => {
    ex.transition().duration(500).style("opacity", 1);
    const len = hubPath.node().getTotalLength();
    hubPath.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
      .transition().duration(1100).ease(d3.easeCubicInOut).attr("stroke-dashoffset", 0)
      .on("end", function () { d3.select(this).attr("stroke-dasharray", null); });
    mband.transition().delay(400).duration(500).style("opacity", 1);
    hubDot.transition().delay(1150).duration(250).style("opacity", 1);
    hubLab.transition().delay(1250).duration(250).style("opacity", 1);
  });
  if (CH.REDUCE) { ex.style("opacity", 1); mband.style("opacity", 1); hubDot.style("opacity", 1); hubLab.style("opacity", 1); }
})();

/* ────────────────────────────────────────────────────────────
   14 · Where the heat goes when making three useful things at once — 16.1 MW_th gross
   → 6.5 preheat → 9.6 surplus → 1.4 MW_e + 4.9 MW_c, plus the
   per-MWh_th monetization hierarchy
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("heat-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The heat-allocation cascade: 60% of reaction heat never leaves the plant — the rest is a revenue stack",
    sub: "1,000 M³/DAY PLANT · 100 G/L COD FEED · 80% HEAT RECOVERY · FLOW WIDTH = MW OF HEAT · CLICK ANY NODE OR FLOW",
    src: "Industry & official — peer-reviewed energy study (2021): 13.88 kJ of heat per gram of COD · heat-recovery 70–85% · Cádiz pilot check · district-cooling tariff benchmarks",
  });
  const T = RPT.trigen;
  const W = 880, H = 600;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkMd = "#42566a", inkLo = "#42566a", blue = "#2251ff", blueSoft = "#7d9bff", neg = "#c22f4e";
  const S = 11.5; // px per MW

  const cas = svg.append("g");
  const nodes = [], flows = [];

  // node geometry
  const NX = { gross: 66, surplus: 330, turbine: 560, out: 736 };
  const yTop = 56;
  const gH = T.gross * S;                       // 16.1 → 185px
  const gY = yTop + 40;
  const surH = T.surplus * S;                   // 9.6
  const preH = T.preheat * S;                   // 6.5
  const surY = gY;                              // surplus occupies top of gross
  const preY = gY + surH + 14;                  // preheat ribbon exits lower
  const turbH = surH;
  const powH = T.power * S;                     // 1.4
  const coolHeatH = T.cooling_heat * S;         // 8.2
  const coolH = T.cooling * S;                  // 4.9

  function ribbon(x1, y1a, y1b, x2, y2a, y2b, col, op) {
    // vertical-span to vertical-span flow ribbon
    const mx = (x1 + x2) / 2;
    return cas.append("path").attr("d",
      `M${x1},${y1a} C${mx},${y1a} ${mx},${y2a} ${x2},${y2a} L${x2},${y2b} C${mx},${y2b} ${mx},${y1b} ${x1},${y1b} Z`)
      .attr("fill", col).attr("opacity", op);
  }
  function node(x, y, w, h, fill, stroke) {
    return cas.append("rect").attr("x", x).attr("y", y).attr("width", w).attr("height", h)
      .attr("fill", fill).attr("stroke", stroke || ink).attr("stroke-width", 1.4).attr("rx", 2);
  }
  function lab(x, y, txt, { anchor = "start", size = 9, col = ink, bold = true, serif = false, nohalo = false } = {}) {
    const t = cas.append("text").attr("x", x).attr("y", y).attr("text-anchor", anchor)
      .attr("font-family", serif ? CH.SERIF : CH.MONO).attr("font-size", size)
      .attr("font-weight", bold ? 700 : 400).attr("fill", col).text(txt);
    if (!nohalo) CH.halo(t);
    return t;
  }

  // ── flows (drawn first, under nodes) ──
  // gross → surplus (top slice)
  flows.push(ribbon(NX.gross + 26, gY, gY + surH, NX.surplus, surY, surY + surH, "rgba(34,81,255,.30)"));
  // gross → preheat (bottom slice, recirculated downward)
  const preBlockY = gY + gH + 30;
  flows.push(ribbon(NX.gross + 26, gY + surH, gY + gH, NX.surplus - 40, preBlockY, preBlockY + preH, "rgba(66,86,106,.22)"));
  // surplus → turbine
  flows.push(ribbon(NX.surplus + 26, surY, surY + surH, NX.turbine, surY, surY + turbH, "rgba(34,81,255,.30)"));
  // turbine → power out (top slice)
  flows.push(ribbon(NX.turbine + 26, surY, surY + powH, NX.out, surY, surY + powH, "rgba(34,81,255,.45)"));
  // turbine → cooling heat (bottom slice) → absorption → cooling out
  const chY = surY + powH + 16;
  flows.push(ribbon(NX.turbine + 26, surY + powH, surY + turbH, NX.out, chY, chY + coolHeatH, "rgba(125,155,255,.35)"));

  // ── nodes ──
  const n1 = node(NX.gross, gY, 26, gH, "#eef1f5");
  lab(NX.gross + 13, gY - 14, "GROSS REACTION HEAT", { anchor: "middle", size: 8.5 });
  lab(NX.gross + 13, gY - 3, T.gross.toFixed(1) + " MW OF HEAT", { anchor: "middle", size: 11, col: blue });
  lab(NX.gross + 13, gY + gH / 2, "13.88", { anchor: "middle", size: 10, col: inkMd });
  lab(NX.gross + 13, gY + gH / 2 + 13, "KJ PER G COD", { anchor: "middle", size: 7.5, col: inkMd, bold: false });
  nodes.push({ el: n1, d: { title: "GROSS REACTION HEAT", value: "16.1 MW of heat", sub: "Oxidation releases ~13.88 kJ of heat per gram of COD; at 1,000 m³/day and 100 g/L the chemical inflow is 16.1 MW of heat. At 200 g/L the surplus climbs to 22–27 MW of heat — up to ~16 MW of cooling.", source: CH.srcLink(["K80"]) } });

  const n2 = node(NX.surplus, surY, 26, surH, "rgba(34,81,255,.16)", blue);
  lab(NX.surplus + 13, surY - 14, "EXPORTABLE SURPLUS", { anchor: "middle", size: 8.5, col: blue });
  lab(NX.surplus + 13, surY - 3, "9.6 MW OF HEAT (6.4–11.2)", { anchor: "middle", size: 10, col: blue });
  nodes.push({ el: n2, d: { title: "EXPORTABLE SURPLUS", value: "9.6 MW of heat (range 6.4–11.2)", sub: "The band reflects heat-recovery efficiency of 70–85%; experimental systems validated 78.8–79%. The Cádiz 1 t/h pilot recovered 118 kW = 71% of feed chemical energy — scaling to ~4.9 MW here, inside the model's band.", source: CH.srcLink(["K81", "K82"]) } });

  // preheat block (internal, recirculated)
  const n3 = node(NX.surplus - 40, preBlockY, 150, preH, "rgba(66,86,106,.10)", inkMd);
  const preLab = lab(NX.surplus + 35, preBlockY + preH / 2 - 4, "PREHEAT 6.5 MW OF HEAT", { anchor: "middle", size: 8, col: inkMd });
  preLab.append("tspan").attr("x", NX.surplus + 35).attr("dy", "1.35em").text("— RECIRCULATED");
  lab(NX.surplus + 35, preBlockY + preH + 14, "THE PRICE OF OPERATION THAT MAKES ITS OWN HEAT FROM THE WASTE · ~60% OF GROSS", { anchor: "middle", size: 7.5, col: inkLo, bold: false });
  // dashed return arrow to gross bar
  cas.append("path").attr("d", `M${NX.surplus - 40},${preBlockY + preH / 2} C${NX.gross - 60},${preBlockY} ${NX.gross - 60},${gY + gH - 20} ${NX.gross},${gY + gH - 10}`)
    .attr("fill", "none").attr("stroke", inkMd).attr("stroke-width", 1.2).attr("stroke-dasharray", "4 3");
  cas.append("path").attr("d", "M-4,-4 L5,0 L-4,4 Z").attr("fill", inkMd)
    .attr("transform", `translate(${NX.gross - 1},${gY + gH - 10}) rotate(180)`);
  nodes.push({ el: n3, d: { title: "INTERNAL PREHEAT DUTY", value: "6.5 MW of heat", sub: "Preheating 41.7 t/h of feedwater from ambient to 400 °C / 25 MPa demands ~32.3 MW of heat gross, of which a well-designed heat-recovery train recovers 70–85% — 6.5 MW of the reaction heat is spoken for before anything can be sold.", source: CH.srcLink(["K80", "K81"]) } });

  const n4 = node(NX.turbine, surY, 26, turbH, "#fff", ink);
  lab(NX.turbine + 13, surY - 14, "EXTRACTION TURBINE", { anchor: "middle", size: 8.5 });
  lab(NX.turbine + 13, surY + turbH + 14, "HIGH-TEMP SLICE → POWER · REST → 150–180 °C", { anchor: "middle", size: 7.5, col: inkLo, bold: false });
  nodes.push({ el: n4, d: { title: "OPTIMAL CASCADE SPLIT", value: "1.4 MW of power + 8.2 MW of heat onward", sub: "An extraction turbine takes the high-temperature slice for ~1.4 MW of electricity; the remaining ~8.2 MW of heat at 150–180 °C drives a heat-powered ammonia chiller. Cooling harvests the low-temperature tail where power efficiency collapses below 8–10%.", source: CH.srcLink(["K83", "K104"]) } });

  // outputs
  const n5 = node(NX.out, surY, 108, powH + 12, blue, blue);
  lab(NX.out - 10, surY + powH / 2 + 9, "1.4 MW ELECTRIC POWER", { anchor: "end", size: 9, col: blue });
  nodes.push({ el: n5, d: { title: "POWER OUTPUT", value: "1.4 MW of electricity", sub: "Worth $15–20 per megawatt-hour of surplus heat at a 15–20% efficient small steam turbine and $0.10/kWh industrial power — the top of the earnings hierarchy unless chilled water sells retail.", source: CH.srcLink(["K83"]) } });

  const n6 = node(NX.out, chY, 108, coolHeatH, "rgba(125,155,255,.18)", blueSoft);
  lab(NX.out + 54, chY + coolHeatH / 2 - 6, "4.9 MW COOLING", { anchor: "middle", size: 9.5, col: blue });
  lab(NX.out + 54, chY + coolHeatH / 2 + 8, "≈ 1,392 REFRIGERATION TONS", { anchor: "middle", size: 7.6, col: blue, bold: false });
  lab(NX.out + 54, chY + coolHeatH / 2 + 20, "+ ~900 M³/DAY WATER", { anchor: "middle", size: 7.2, col: inkMd, bold: false });
  nodes.push({ el: n6, d: { title: "COOLING + WATER OUTPUTS", value: "4.9 MW of cooling ≈ 1,392 refrigeration tons", sub: "8.2 MW of heat at 150–180 °C drives an ammonia-water heat chiller returning 0.6 units of cooling per unit of heat. Lithium-bromide chillers are the default for above-freezing chilled water (0.7–0.8 units per unit of heat); ammonia only for sub-zero duty. Field-measured efficiency ran 0.28–0.45 — underwrite conservatively. The outputs replace power and cooling the neighbor would otherwise buy; they are not a primary supply.", source: CH.srcLink(["K84", "K86"]) } });

  // flow value labels
  lab((NX.gross + 26 + NX.surplus) / 2, gY + surH + 16, "9.6", { anchor: "middle", size: 8.5, col: blue });
  lab((NX.surplus - 40 + NX.gross + 26) / 2, preBlockY - 8, "6.5", { anchor: "middle", size: 8.5, col: inkMd });
  lab((NX.turbine + 26 + NX.out) / 2, surY - 6, "1.4", { anchor: "middle", size: 8.5, col: blue });
  lab((NX.turbine + 26 + NX.out) / 2, chY + 12, "8.2 →", { anchor: "middle", size: 8.5, col: blueSoft });

  // value plaque
  const vp = cas.append("g");
  vp.append("rect").attr("x", NX.turbine - 40).attr("y", preBlockY).attr("width", 250).attr("height", preH + 8)
    .attr("fill", "#fff").attr("stroke", blue).attr("stroke-width", 1.6).attr("rx", 3);
  lab(NX.turbine + 85, preBlockY + 20, "≈ $1.15M/YR AT 8,000 HRS/YR", { anchor: "middle", size: 11, col: blue });
  lab(NX.turbine + 85, preBlockY + 36, "VS $0.79M/YR IF ALL-COOLING", { anchor: "middle", size: 8, col: inkMd });
  lab(NX.turbine + 85, preBlockY + 50, "ENGINEERED, NOT ASSUMED", { anchor: "middle", size: 7.5, col: inkLo, bold: false });
  nodes.push({ el: vp, d: { title: "CASCADE VALUE", value: "$1.15M/yr", sub: "Base case 1,000 m³/day, 100 g/L COD, 80% recovery, 9.6 MW of surplus heat, 8,000 operating hours. Making cooling and power together can underperform making them separately unless operation follows the local tariff structure — the value stack must be engineered into the operating strategy.", source: CH.srcLink(["K83"]) } });

  // ── monetization hierarchy (bottom panel) ──
  const hy = 500;
  svg.append("line").attr("x1", 66).attr("x2", W - 40).attr("y1", hy - 26).attr("y2", hy - 26).attr("stroke", "#dbe2ea");
  lab(66, hy - 34, "WHAT ONE MEGAWATT-HOUR OF SURPLUS HEAT IS WORTH — THE EARNINGS HIERARCHY", { size: 8.5, col: inkMd });
  const hx = d3.scaleLinear().domain([0, 52]).range([290, W - 190]);
  const hRows = [
    { r: T.hierarchy[2], col: blue, note: "COOLING LEAPFROGS POWER ONLY HERE" },   // district — longest, first
    { r: T.hierarchy[0], col: inkMd, note: "THE DEFAULT TOP OF THE STACK" },       // power
    { r: T.hierarchy[1], col: inkLo, note: "HALF TO TWO-THIRDS THE POWER RATE" },  // cooling
  ];
  hRows.forEach((h, i) => {
    const yy = hy + i * 28;
    const g = svg.append("g").style("opacity", 0);
    const lo = parseFloat(h.r.val.replace(/[~$]/g, "").split("–")[0]), hi = parseFloat(h.r.val.replace(/[~$]/g, "").split("–")[1] || h.r.val.replace(/[~$]/g, ""));
    g.append("text").attr("x", 66).attr("y", yy + 11).attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", ink)
      .text(h.r.form.toUpperCase().slice(0, 26));
    g.append("rect").attr("x", hx(0)).attr("y", yy).attr("width", hx(hi) - hx(0)).attr("height", 13).attr("fill", h.col).attr("opacity", 0.85).attr("rx", 2);
    if (lo !== hi) g.append("rect").attr("x", hx(lo)).attr("y", yy).attr("width", hx(hi) - hx(lo)).attr("height", 13).attr("fill", h.col).attr("rx", 2);
    const vt = g.append("text").attr("x", hx(hi) + 8).attr("y", yy + 11)
      .attr("font-family", CH.MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", h.col === inkLo ? inkMd : h.col)
      .text(h.r.val + " /" + h.r.per);
    CH.halo(vt);
    CH.drill(g, () => ({ title: h.r.form.toUpperCase(), value: h.r.val + " /" + h.r.per, sub: h.r.note, source: CH.srcLink(h.r.src) }));
    if (CH.REDUCE) g.style("opacity", 1);
    else g.transition().delay(900 + i * 140).duration(350).style("opacity", 1);
  });

  nodes.forEach(n => CH.drill(n.el, () => n.d));
  cas.style("opacity", 0);
  CH.enter(host, () => cas.transition().duration(600).style("opacity", 1));
  if (CH.REDUCE) cas.style("opacity", 1);

  // ── walkthrough registration (map of where the heat goes) ──
  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.walk["heat-chart"] = {
    title: "Where the heat goes, step by step",
    steps: [
      { el: nodes[0].el, label: "Gross reaction heat — 16.1 MW of heat",
        cap: "Oxidizing the feed releases 16.1 MW of heat — the energy content of the waste itself, arriving free with every cubic meter processed." },
      { el: nodes[2].el, label: "Preheat takes its cut — 6.5 MW of heat",
        cap: "First the plant pays itself: 6.5 MW recirculates to preheat incoming feed toward 400 °C. That is the price of operation that makes its own heat from the waste — about 60% of gross heat never leaves the plant." },
      { el: nodes[1].el, label: "Exportable surplus — 9.6 MW of heat",
        cap: "What remains is 9.6 MW of exportable surplus (6.4–11.2 across the 70–85% heat-recovery band). Only this slice can earn revenue." },
      { el: nodes[3].el, label: "The turbine split",
        cap: "An extraction turbine skims the hottest slice for power; the remaining 8.2 MW at 150–180 °C is ideal duty for a heat-powered ammonia chiller." },
      { els: [nodes[4].el, nodes[5].el], label: "Outputs: power + cooling + water",
        cap: "Out the gate: 1.4 MW of electricity, 4.9 MW of cooling (~1,392 refrigeration tons), and ~900 m³/day of distilled water — a displacement stack sold across the fence." },
      { el: nodes[6].el, label: "What the cascade is worth — ≈$1.15M/yr",
        cap: "Dispatched this way the cascade earns ≈$1.15M/yr at 8,000 operating hours, versus $0.79M/yr if all surplus went to cooling. The value stack must be engineered into the operating strategy, not assumed." },
    ],
  };
})();
