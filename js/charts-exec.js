// ═══ §0/§2/§3 executive charts: evidence object (P17), mechanism P–T path, market-in-machines (P1) ═══

/* ────────────────────────────────────────────────────────────
   5 · Evidence object — the HCSP skid with the report's hardest
   numbers hung on the parts that actually carry them
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("evidence-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "One skid, seven numbers — each hung where the machine actually carries it",
    sub: "THE 10 M³/DAY HCSP MODULE, SIDE ELEVATION · EVERY PLAQUE IS CLICKABLE → VALUE + BASIS + DATED SOURCE",
    src: "Company disclosure — HCSP technical briefing (2025-08) · Industry & official — EIA/EPA WaterSense/OC San · Research compilation [derived]",
  });
  body.insertBefore(CH.plainLine("What this shows: the machine's key numbers, each placed on the part of the skid it belongs to. Items marked TBD are waiting on manufacturer data."), body.firstChild);
  const W = 880, H = 470;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkMd = "#42566a", inkLo = "#42566a", blue = "#2251ff", neg = "#c22f4e";

  const root = svg.append("g");
  // ground line
  root.append("line").attr("x1", 50).attr("x2", 830).attr("y1", 402).attr("y2", 402).attr("stroke", ink).attr("stroke-width", 1.6);

  const skid = root.append("g").attr("class", "skid");
  // ── skid base: rails + deck + forklift pockets ──
  skid.append("rect").attr("x", 180).attr("y", 372).attr("width", 520).attr("height", 14).attr("fill", "#9fb0bf").attr("stroke", ink).attr("stroke-width", 1.2);
  [230, 440, 650].forEach(rx => {
    skid.append("rect").attr("x", rx - 14).attr("y", 386).attr("width", 28).attr("height", 14).attr("fill", "#5d7186").attr("stroke", ink).attr("stroke-width", 1);
  });
  // ── container enclosure (corrugated) ──
  skid.append("rect").attr("x", 210).attr("y", 236).attr("width", 200).attr("height", 136).attr("fill", "#eef1f5").attr("stroke", ink).attr("stroke-width", 1.6);
  for (let i = 1; i < 10; i++)
    skid.append("line").attr("x1", 210 + i * 20).attr("x2", 210 + i * 20).attr("y1", 238).attr("y2", 370).attr("stroke", "#c3cdd8").attr("stroke-width", 1);
  // door + nameplate
  skid.append("rect").attr("x", 366).attr("y", 258).attr("width", 40).attr("height", 114).attr("fill", "#e3e9f0").attr("stroke", inkMd).attr("stroke-width", 1.2);
  skid.append("rect").attr("x", 240).attr("y", 262).attr("width", 76).attr("height", 30).attr("fill", "#fff").attr("stroke", ink).attr("stroke-width", 1.2);
  // ── reactor vessel (vertical cylinder, dome cap, hoops) ──
  skid.append("rect").attr("x", 468).attr("y", 176).attr("width", 64).attr("height", 196).attr("fill", "#dbe3ec").attr("stroke", ink).attr("stroke-width", 1.6);
  skid.append("path").attr("d", "M468,176 a32,20 0 0 1 64,0").attr("fill", "#cdd8e2").attr("stroke", ink).attr("stroke-width", 1.6);
  [220, 268, 316].forEach(yy => skid.append("line").attr("x1", 468).attr("x2", 532).attr("y1", yy).attr("y2", yy).attr("stroke", inkMd).attr("stroke-width", 1.2));
  skid.append("rect").attr("x", 492).attr("y", 156).attr("width", 16).attr("height", 20).attr("fill", "#c3ccd6").attr("stroke", ink).attr("stroke-width", 1.2);
  // pressure gauge
  skid.append("line").attr("x1", 532).attr("x2", 552).attr("y1", 210).attr("y2", 200).attr("stroke", inkMd).attr("stroke-width", 2);
  skid.append("circle").attr("cx", 560).attr("cy", 196).attr("r", 14).attr("fill", "#fff").attr("stroke", ink).attr("stroke-width", 1.6);
  skid.append("line").attr("x1", 560).attr("x2", 568).attr("y1", 196).attr("y2", 188).attr("stroke", neg).attr("stroke-width", 1.8);
  // ── preheater / pump block with fins ──
  skid.append("rect").attr("x", 560).attr("y", 306).attr("width", 84).attr("height", 66).attr("fill", "#dfe7ef").attr("stroke", ink).attr("stroke-width", 1.4);
  for (let i = 1; i <= 4; i++)
    skid.append("line").attr("x1", 562).attr("x2", 642).attr("y1", 306 + i * 13).attr("y2", 306 + i * 13).attr("stroke", inkLo).attr("stroke-width", 1);
  skid.append("circle").attr("cx", 584).attr("cy", 352).attr("r", 9).attr("fill", inkMd); // pump motor
  // ── separator drum (horizontal) ──
  skid.append("rect").attr("x", 560).attr("y", 244).attr("width", 106).attr("height", 40).attr("fill", "#d3dce6").attr("stroke", ink).attr("stroke-width", 1.4);
  skid.append("ellipse").attr("cx", 666).attr("cy", 264).attr("rx", 12).attr("ry", 20).attr("fill", "#e2e8ef").attr("stroke", ink).attr("stroke-width", 1.4);
  skid.append("ellipse").attr("cx", 560).attr("cy", 264).attr("rx", 8).attr("ry", 20).attr("fill", "#c3ccd6").attr("stroke", inkMd).attr("stroke-width", 1);
  // ── process pipe reactor → separator (electric blue) ──
  skid.append("path").attr("d", "M532,200 C560,196 566,220 578,244").attr("fill", "none").attr("stroke", blue).attr("stroke-width", 3);
  // ── vent stack + vapor wisps (the no-air-permit claim) ──
  skid.append("rect").attr("x", 428).attr("y", 190).attr("width", 8).attr("height", 46).attr("fill", "#c3ccd6").attr("stroke", ink).attr("stroke-width", 1.2);
  [0, 1, 2].forEach(i => skid.append("path")
    .attr("d", `M${424 + i * 8},${186 - i * 2} q6,-14 -2,-26 q-6,-10 2,-22`)
    .attr("fill", "none").attr("stroke", "#7d9bff").attr("stroke-width", 1.4).attr("opacity", 0.75 - i * 0.18));
  // ── electrolyzer unit (as briefed — the self-fueling fuel loop) ──
  skid.append("rect").attr("x", 438).attr("y", 326).attr("width", 26).attr("height", 46).attr("fill", "#eef1f5").attr("stroke", blue).attr("stroke-width", 1.4).attr("stroke-dasharray", "4 3");
  // ── water outlet tap + droplet ──
  skid.append("path").attr("d", "M666,272 L690,272 L690,296").attr("fill", "none").attr("stroke", inkMd).attr("stroke-width", 3);
  skid.append("path").attr("d", "M690,302 c5,7 5,12 0,15 c-5,-3 -5,-8 0,-15").attr("fill", blue);
  // ── footprint dimension line ──
  skid.append("line").attr("x1", 180).attr("x2", 700).attr("y1", 424).attr("y2", 424).attr("stroke", inkLo).attr("stroke-width", 1);
  skid.append("line").attr("x1", 180).attr("x2", 180).attr("y1", 418).attr("y2", 430).attr("stroke", inkLo).attr("stroke-width", 1);
  skid.append("line").attr("x1", 700).attr("x2", 700).attr("y1", 418).attr("y2", 430).attr("stroke", inkLo).attr("stroke-width", 1);

  // ── semantic-site plaques (each clickable → drill) ──
  const sites = [
    { sx: 278, sy: 277, px: 96, py: 226, anchor: "start", head: "10 M³/DAY", sub: "≈0.925M GAL/YR THROUGHPUT",
      val: "10 m³/day", basis: "Rated throughput (~2,640 gal/day); ~0.9M gal/yr at 90% utilization — sized to a mid-size industrial site's generation rate.", src: ["K1"] },
    { sx: 560, sy: 196, px: 602, py: 128, anchor: "start", head: "380–420 °C · 25 MPA", sub: "JUST ABOVE THE CRITICAL POINT",
      val: "380–420 °C · 25 MPa", basis: "Water above 374 °C and 22.1 MPa enters a state that is neither liquid nor gas, in which organic waste and oxygen mix completely and oxidize in seconds to minutes.", src: ["K1"] },
    { sx: 602, sy: 320, px: 700, py: 210, anchor: "start", head: "75–95 KW", sub: "STARTUP POWER SPEC",
      val: "75–95 kW", basis: "Startup/auxiliary power draw spec (180–228 kilowatt-hours per cubic meter × 8.62 ¢/kWh US industrial ≈ $15–20/m³-equivalent). Operating energy itself is negligible per the manufacturer — the self-fueling hydrogen loop generates fuel on demand from process water; grid price values the startup draw and every exported kilowatt-hour.", src: ["K23", "K1"] },
    { sx: 690, sy: 306, px: 636, py: 366, anchor: "start", head: "≈$3.5/M³", sub: "RECOVERED-WATER VALUE",
      val: "≈ $3.53/m³", basis: "85–95% distilled recovery at <10 µS/cm earns a credit worth roughly US average commercial water + sewer tariffs — valuable, never sufficient to carry the economics.", src: ["K31", "K1"] },
    { sx: 500, sy: 150, px: 300, py: 96, anchor: "middle", head: "PRICING TBD", sub: "VS $5–28/GAL DOCUMENTED EXISTING SUPPLIERS",
      val: "TBD — pending", basis: "HCSP service pricing is TBD — manufacturer cost model pending. The documented existing suppliers it would undercut: incineration $5–10/gal, existing SCWO service $6–10/gal, hazardous landfilling of AFFF at $28/gal (Michigan 2020).", src: ["K21", "K10"] },
    { sx: 196, sy: 379, px: 60, py: 336, anchor: "start", head: "PURCHASE COST TBD", sub: "MANUFACTURER COST MODEL PENDING",
      val: "TBD — pending", basis: "HCSP module purchase cost is TBD — manufacturer cost model pending. The market reference point is the only verifiable commercial SCWO transaction of this class: the AirSCWO 6's $5.2M equipment-plus-operation contract inside a $7.9M OC San project.", src: ["K18"] },
    { sx: 432, sy: 172, px: 120, py: 132, anchor: "start", head: "NO AIR PERMIT", sub: "SEALED SYSTEM VENTS WATER VAPOR",
      val: "The hidden permitting advantage", basis: "~24 federally licensed US hazardous-waste incinerators (RCRA combustors) run at 88–92% utilization with one new unit in three decades; a sealed system bypasses the multi-year air-permitting gauntlet.", src: ["K1", "K34"] },
    { sx: 440, sy: 424, px: 440, py: 446, anchor: "middle", head: "8–10 M² FOOTPRINT", sub: "CONTAINER CLASS · UNDER 3 M TALL · QUIET (<75 DB)",
      val: "8–10 m²", basis: "Indoor-sited, container-class footprint — deployable at the point of waste generation, not at a central plant.", src: ["K1"] },
  ];
  const siteG = root.append("g").attr("class", "sites");
  const siteEls = sites.map(s => {
    const g = siteG.append("g").style("opacity", 0).attr("transform", "translate(0,-8)");
    // transparent hit plate so the whole plaque is clickable
    const hw = Math.max(s.head.length, s.sub.length) * 8.6 + 14;
    const hx = s.anchor === "middle" ? s.px - hw / 2 : s.anchor === "start" ? s.px - 6 : s.px - hw + 6;
    g.append("rect").attr("x", hx).attr("y", s.py - 16).attr("width", hw).attr("height", 42)
      .attr("fill", "rgba(255,255,255,0)");
    g.append("line").attr("x1", s.sx).attr("y1", s.sy).attr("x2", s.anchor === "middle" ? s.px : s.px + (s.anchor === "start" ? -4 : 4)).attr("y2", s.py + 12)
      .attr("stroke", inkLo).attr("stroke-width", 1);
    g.append("circle").attr("cx", s.sx).attr("cy", s.sy).attr("r", 3.2).attr("fill", blue).attr("stroke", "#fff").attr("stroke-width", 1.4);
    const h = g.append("text").attr("x", s.px).attr("y", s.py).attr("text-anchor", s.anchor)
      .attr("font-family", CH.MONO).attr("font-size", 11.5).attr("font-weight", 700).attr("fill", ink).text(s.head);
    CH.halo(h);
    const u = g.append("text").attr("x", s.px).attr("y", s.py + 16).attr("text-anchor", s.anchor)
      .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", inkMd).text(s.sub);
    CH.halo(u);
    CH.drill(g, () => ({ title: s.head, value: s.val, sub: s.basis, source: CH.srcLink(s.src) }));
    return g;
  });

  CH.enter(host, () => {
    siteEls.forEach((g, i) => g.transition().delay(260 + i * 130).duration(420).style("opacity", 1).attr("transform", "translate(0,0)"));
  });
  if (CH.REDUCE) siteEls.forEach(g => g.style("opacity", 1).attr("transform", "translate(0,0)"));
  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.table["evidence-chart"] = {
    cols: ["Plaque", "Value", "Basis"],
    rows: sites.map(s => [s.head + " · " + s.sub, s.val, s.basis]),
  };
})();

/* ────────────────────────────────────────────────────────────
   6 · Mechanism — the process as a path through the P–T plane
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("mechanism-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Pressurize, heat past 374 °C, oxidize, separate — the whole machine on one pressure–temperature map",
    sub: "PRESSURE (MPA) × TEMPERATURE (°C) · NUMBERED NODES = THE FOUR STAGES · DASHED = THE SELF-FUELING H₂ LOOP (FUEL ON DEMAND FROM PROCESS WATER) · CLICK NODES",
    src: "Company disclosure — HCSP technical briefing (2025-08) · Industry & official — ITRC Enviro Wiki (rev. 2026), Energies/MDPI (2024)",
  });
  body.insertBefore(CH.plainLine("What this shows: the four steps of the process — pump, heat, react, separate — drawn as one path through pressure and temperature."), body.firstChild);
  const W = 880, H = 500;
  const svg = CH.svg(body, W, H);
  const x = d3.scaleLinear().domain([0, 600]).range([86, W - 60]);
  const y = d3.scaleLinear().domain([0, 30]).range([H - 86, 60]);
  const ink = "#051c2c", inkLo = "#42566a", blue = "#2251ff", neg = "#c22f4e";

  // axes
  svg.append("line").attr("x1", 86).attr("x2", W - 60).attr("y1", H - 70).attr("y2", H - 70).attr("stroke", ink).attr("stroke-width", 1.4);
  svg.append("line").attr("x1", 86).attr("x2", 86).attr("y1", 60).attr("y2", H - 70).attr("stroke", ink).attr("stroke-width", 1.4);
  [0, 100, 200, 300, 374, 400, 500, 600].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", H - 70).attr("y2", H - 64).attr("stroke", inkLo);
    svg.append("text").attr("x", x(v)).attr("y", H - 52).attr("text-anchor", "middle").attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", inkLo).text(v);
  });
  [0, 5, 10, 15, 20, 22.1, 25, 30].forEach(v => {
    svg.append("line").attr("x1", 80).attr("x2", 86).attr("y1", y(v)).attr("y2", y(v)).attr("stroke", inkLo);
    svg.append("text").attr("x", 74).attr("y", y(v) + 3).attr("text-anchor", "end").attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", inkLo).text(v);
  });
  const xl = svg.append("text").attr("x", (86 + W - 60) / 2).attr("y", H - 30).attr("text-anchor", "middle").attr("font-family", CH.MONO).attr("font-size", 10).attr("fill", "#42566a").text("TEMPERATURE · °C");
  const yl = svg.append("text").attr("x", 20).attr("y", (60 + H - 70) / 2).attr("text-anchor", "middle").attr("font-family", CH.MONO).attr("font-size", 10).attr("fill", "#42566a")
    .attr("transform", `rotate(-90 20 ${(60 + H - 70) / 2})`).text("PRESSURE · MPA");

  // supercritical region
  const sc = svg.append("g");
  sc.append("rect").attr("x", x(374)).attr("y", y(30)).attr("width", x(600) - x(374)).attr("height", y(22.1) - y(30))
    .attr("fill", "rgba(34,81,255,.06)");
  sc.append("line").attr("x1", x(374)).attr("x2", x(374)).attr("y1", y(22.1)).attr("y2", y(30)).attr("stroke", blue).attr("stroke-dasharray", "4 4").attr("stroke-width", 1);
  sc.append("line").attr("x1", x(374)).attr("x2", x(600)).attr("y1", y(22.1)).attr("y2", y(22.1)).attr("stroke", blue).attr("stroke-dasharray", "4 4").attr("stroke-width", 1);
  const scl = sc.append("text").attr("x", x(487)).attr("y", y(28.4)).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", blue).text("SUPERCRITICAL REGION");
  CH.halo(scl);
  const scl2 = sc.append("text").attr("x", x(487)).attr("y", y(28.4) + 13).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", blue).text("WASTE + OXYGEN MIX COMPLETELY");
  CH.halo(scl2);
  // critical point
  svg.append("circle").attr("cx", x(374)).attr("cy", y(22.1)).attr("r", 4).attr("fill", blue).attr("stroke", "#fff").attr("stroke-width", 1.6);
  svg.append("line").attr("x1", x(374) + 4).attr("y1", y(22.1) + 4).attr("x2", x(386) + 8).attr("y2", y(20.6) - 4)
    .attr("stroke", blue).attr("stroke-width", 0.9).attr("opacity", 0.6);
  const cpl = svg.append("text").attr("x", x(386) + 12).attr("y", y(20.6)).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", blue).text("CRITICAL POINT 374 °C · 22.1 MPA");
  CH.halo(cpl);

  // reactor operating band
  svg.append("rect").attr("x", x(380)).attr("y", y(25.4)).attr("width", x(420) - x(380)).attr("height", y(24.6) - y(25.4))
    .attr("fill", "rgba(34,81,255,.28)").attr("stroke", blue).attr("stroke-width", 1.2);

  // ── the process path ──
  const path = [
    [25, 0.1], [25, 25],          // 1 · pump
    [300, 25],                     // 2 · preheat
    [400, 25],                     // 3 · reactor
    [455, 25], [455, 24],          // exit reactor
  ];
  const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));
  const main = svg.append("path").attr("d", line(path))
    .attr("fill", "none").attr("stroke", ink).attr("stroke-width", 2.6).attr("stroke-linecap", "round");
  // cool-down + letdown curve to separator
  const cool = svg.append("path")
    .attr("d", `M${x(455)},${y(24)} C ${x(300)},${y(24)} ${x(200)},${y(22)} ${x(120)},${y(20)} L ${x(90)},${y(0.6)}`)
    .attr("fill", "none").attr("stroke", ink).attr("stroke-width", 2.6).attr("stroke-linecap", "round");
  // arrowheads
  [[25, 12, -90], [170, 25, 0], [345, 25, 0], [250, 23.2, 24], [105, 10, -66]].forEach(([tx, ty, rot]) => {
    svg.append("path").attr("d", "M-5,-4 L5,0 L-5,4 Z").attr("fill", ink)
      .attr("transform", `translate(${x(tx)},${y(ty)}) rotate(${rot})`);
  });

  // Self-fueling H₂ loop branch (as briefed)
  const h2 = svg.append("g");
  h2.append("path").attr("d", `M${x(150)},${y(25)} C ${x(120)},${y(20)} ${x(105)},${y(14)} ${x(105)},${y(9)}`)
    .attr("fill", "none").attr("stroke", blue).attr("stroke-width", 1.6).attr("stroke-dasharray", "5 4");
  h2.append("rect").attr("x", x(105) - 34).attr("y", y(9) - 14).attr("width", 68).attr("height", 26)
    .attr("fill", "none").attr("stroke", blue).attr("stroke-width", 1.4).attr("stroke-dasharray", "4 3");
  const h2t = h2.append("text").attr("x", x(105)).attr("y", y(9) + 3).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", blue).text("SELF-FUELING H₂ LOOP");
  CH.halo(h2t);
  const h2s = h2.append("text").attr("x", x(105)).attr("y", y(6.6)).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", blue).text("FUEL ON DEMAND FROM PROCESS WATER");
  CH.halo(h2s);
  CH.drill(h2, () => ({
    title: "THE SELF-FUELING H₂ LOOP", value: "Negligible net energy in operation",
    sub: "Per the manufacturer briefing: a portion of the process water is electrolyzed on demand and the clean H₂/O₂ is combusted for SCWO process heat — fuel is generated as needed, never purchased or stored in bulk, at negligible net energy cost once started. A working prototype exists; grid power covers only startup/auxiliary draw (75–95 kW spec).",
    source: CH.srcLink(["K1", "K60"]),
  }));

  // stage nodes
  const stages = [
    { n: 1, t: 25, p: 0.6, dx: 16, dy: -18, name: "HIGH-PRESSURE PUMP", note: "250 BAR",
      sub: "Feed arrives concentrated (≥60–150 g/L COD — COD measures how much organic waste is in the water — or an upstream concentrate). Pressurization to 250 bar is the first of two energy inputs.", src: ["K58", "K1"] },
    { n: 2, t: 290, p: 25, dx: -10, dy: -34, name: "PREHEAT — H₂/O₂ COMBUSTION", note: "SELF-FUELING LOOP · 75–95 KW STARTUP/AUX SPEC",
      sub: "Per the briefing: on-demand electrolysis of a portion of the process water → clean H₂/O₂ combustion supplies the preheat. Self-fueling once started, negligible net energy cost in operation; the 75–95 kW grid spec covers startup and auxiliary draw. Feeds strong enough to make their own heat (>~30 g/L organics) carry more of the duty themselves.", src: ["K1", "K59"] },
    { n: 3, t: 400, p: 25, dx: 26, dy: -12, name: "SCWO REACTOR", note: "ORGANICS → CO₂ + H₂O · SECONDS",
      sub: "Complete destruction in seconds to minutes: 99.9993% of the PFAS destroyed and removed, federally validated in a US Army Corps of Engineers lab test. Salts precipitate in supercritical water — the failure mode that killed conventional preheater designs — but HCSP combusts hydrogen above 3,000 °F (≈1,650 °C) directly in the reactor, a design intended to prevent salt deposition (manufacturer-stated; independent long-run data pending), consistent with published research on flames burning inside hot pressurized water.", src: ["K2", "K20", "K1"] },
    { n: 4, t: 90, p: 0.8, dx: 160, dy: -20, lead: [14, -6, 148, -18], name: "SEPARATOR + POLISH", note: "85–95% DISTILLED WATER + INERT SLUDGE OUT",
      sub: "Cool, separate, let down. The distilled-quality output (conductivity <10 µS/cm — purer than tap water) earns a ~$3.5/m³ byproduct credit; the contained inert sludge is the fully broken-down residue.", src: ["K1", "K31"] },
  ];
  const nodes = svg.append("g");
  const stageEls = [];
  stages.forEach(s => {
    const g = nodes.append("g").style("opacity", 0);
    stageEls.push(g);
    g.append("circle").attr("cx", x(s.t)).attr("cy", y(s.p)).attr("r", 11).attr("fill", "#fff").attr("stroke", ink).attr("stroke-width", 2);
    g.append("text").attr("x", x(s.t)).attr("y", y(s.p) + 4).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 11).attr("font-weight", 700).attr("fill", ink).text(s.n);
    if (s.lead) g.append("line").attr("x1", x(s.t) + s.lead[0]).attr("y1", y(s.p) + s.lead[1])
      .attr("x2", x(s.t) + s.lead[2]).attr("y2", y(s.p) + s.lead[3])
      .attr("stroke", ink).attr("stroke-width", 0.8).attr("opacity", 0.5);
    const t1 = g.append("text").attr("x", x(s.t) + s.dx).attr("y", y(s.p) + s.dy)
      .attr("text-anchor", s.n === 2 ? "end" : s.n === 3 ? "start" : "start")
      .attr("font-family", CH.MONO).attr("font-size", 10.5).attr("font-weight", 700).attr("fill", ink).text(s.n + " · " + s.name);
    CH.halo(t1);
    const t2 = g.append("text").attr("x", x(s.t) + s.dx).attr("y", y(s.p) + s.dy + 14)
      .attr("text-anchor", s.n === 2 ? "end" : "start")
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#42566a").text(s.note);
    CH.halo(t2);
    CH.drill(g, () => ({ title: `STAGE ${s.n} · ${s.name}`, value: s.note, sub: s.sub, source: CH.srcLink(s.src) }));
  });

  // feed label
  const fl = svg.append("text").attr("x", x(25) + 16).attr("y", y(0.6) + 16).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", "#42566a").text("CONCENTRATED FEED IN · 10 M³/DAY");
  CH.halo(fl);

  CH.enter(host, () => {
    [main, cool].forEach((p, pi) => {
      const len = p.node().getTotalLength();
      p.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
        .transition().delay(pi * 600).duration(1400).ease(d3.easeCubicInOut).attr("stroke-dashoffset", 0)
        .on("end", function () { d3.select(this).attr("stroke-dasharray", null); });
    });
    nodes.selectAll("g").transition().delay((d, i) => 500 + i * 380).duration(350).style("opacity", 1);
  });
  if (CH.REDUCE) nodes.selectAll("g").style("opacity", 1);

  // ── walkthrough + modal table registration ──
  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.walk["mechanism-chart"] = {
    title: "The four stages, in plain language",
    steps: [
      { el: stageEls[0], label: "Stage 1 · HP pump",
        cap: "The feed — a concentrated liquid waste stream — is pumped to 250 bar, roughly 2,500× atmospheric pressure. Pressure is what keeps the water from boiling in the next step." },
      { el: stageEls[1], label: "Stage 2 · Preheat (self-fueling H₂ loop)",
        cap: "The pressurized stream is heated toward 400 °C. Per the manufacturer, the heat comes from combusting hydrogen generated on demand from the process water itself — so grid power covers only startup and auxiliary draw." },
      { el: stageEls[2], label: "Stage 3 · SCWO reactor",
        cap: "Past 374 °C and 22.1 MPa, water turns supercritical: organic waste and oxygen mix completely and the waste burns up in seconds. PFAS, solvents, and sludge are completely broken down to CO₂, water, and inert salts." },
      { el: stageEls[3], label: "Stage 4 · Separator + polish",
        cap: "The stream cools and depressurizes. What leaves is distilled-quality water (85–95% recovery), CO₂, and a contained inert sludge — nothing but water vapor vents, so no air permit is needed." },
    ],
  };
  CXT.table["mechanism-chart"] = {
    cols: ["Stage", "Name", "Position on the pressure–temperature path", "What happens"],
    rows: stages.map(s => [String(s.n), s.name, `${s.t} °C · ${s.p} MPa`, s.sub]),
  };
})();

/* ────────────────────────────────────────────────────────────
   7 · The market in machines — reachable market as skid-equivalent arrays (P1)
   1 skid glyph = 50 module-equivalents; solid = low case, hollow dashed = upside
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("sizing-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The reachable market, counted in machines: ~1,800–3,200 skid-equivalents",
    sub: "1 SKID = 50 MODULE-EQUIVALENTS (10 M³/DAY EACH) · SOLID = MODELED LOW CASE · HOLLOW DASHED = UPSIDE · CLIPPED = FRACTIONAL · MANUFACTURER COST INPUTS PENDING — ADDRESSABLE-SAVINGS BASIS · CLICK ROWS",
    src: "Research compilation — report Ch. 8.1 total market / reachable market consolidation (2026-09); per-industry assumptions in drill-downs",
  });
  body.insertBefore(CH.plainLine("What this shows: the reachable market expressed as a number of machines — a model estimate, not a forecast. Manufacturer cost inputs are still pending."), body.firstChild);
  const W = 880, rowH = 66, padT = 56, H = padT + rowH * RPT.sizing.length + 64;
  const mL = 216;
  const svg = CH.svg(body, W, H);
  const GW = 15, GH = 13, GAP = 5; // glyph size + spacing

  // mini skid glyph (side elevation: container + vessel + rail)
  function glyph(g, x0, y0, solid, frac) {
    const col = solid ? "#2251ff" : "none";
    const st = solid ? "#1233b8" : "#42566a";
    const grp = g.append("g").attr("transform", `translate(${x0},${y0})`);
    if (solid && frac < 1) {
      const id = "clip" + Math.round(x0) + "_" + Math.round(y0);
      grp.append("clipPath").attr("id", id).append("rect").attr("x", 0).attr("y", 0).attr("width", GW * frac).attr("height", GH + 2);
      const inner = grp.append("g").attr("clip-path", `url(#${id})`);
      drawGlyphBody(inner, "#2251ff", "#1233b8", null);
      drawGlyphBody(grp, "none", "#42566a", "3 2");
    } else {
      drawGlyphBody(grp, col, st, solid ? null : "3 2");
    }
  }
  function drawGlyphBody(grp, fill, stroke, dash) {
    grp.append("rect").attr("x", 0).attr("y", GH - 2.5).attr("width", GW).attr("height", 2.5)
      .attr("fill", fill === "none" ? "none" : "#42566a").attr("stroke", stroke).attr("stroke-width", 0.9)
      .attr("stroke-dasharray", dash || null);
    grp.append("rect").attr("x", 0.8).attr("y", 2.5).attr("width", GW * 0.58).attr("height", GH - 5)
      .attr("fill", fill).attr("stroke", stroke).attr("stroke-width", 0.9).attr("stroke-dasharray", dash || null);
    grp.append("rect").attr("x", GW * 0.62).attr("y", 0.5).attr("width", GW * 0.3).attr("height", GH - 3)
      .attr("fill", fill).attr("stroke", stroke).attr("stroke-width", 0.9).attr("stroke-dasharray", dash || null)
      .attr("rx", 2);
  }

  // legend
  const lg = svg.append("g").attr("transform", `translate(${mL},14)`);
  glyph(lg, 0, 0, true, 1);
  lg.append("text").attr("x", 24).attr("y", 11).attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", "#42566a")
    .text("= 50 MODULES · MODELED LOW CASE");
  glyph(lg, 268, 0, false, 1);
  lg.append("text").attr("x", 292).attr("y", 11).attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", "#42566a")
    .text("= UPSIDE TO HIGH CASE");

  RPT.sizing.forEach((d, ri) => {
    const g = svg.append("g").attr("transform", `translate(0,${padT + ri * rowH})`);
    g.append("text").attr("x", mL - 12).attr("y", 10).attr("text-anchor", "end")
      .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5).attr("fill", "#051c2c")
      .each(function () { CH.wrap2(d3.select(this), d.name, 22); });
    g.append("text").attr("x", mL - 12).attr("y", 42).attr("text-anchor", "end")
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#42566a")
      .text(d.mod_lo === d.mod_hi ? `${d.mod_lo.toLocaleString("en-US")} MODULES` : `${d.mod_lo.toLocaleString("en-US")}–${d.mod_hi.toLocaleString("en-US")} MODULES`);
    const field = g.append("g");
    const nSolid = Math.floor(d.mod_lo / d.unit), fracSolid = (d.mod_lo % d.unit) / d.unit;
    const nUp = Math.round((d.mod_hi - d.mod_lo) / d.unit);
    let gx = mL;
    for (let i = 0; i < nSolid; i++) { glyph(field, gx, 2, true, 1); gx += GW + GAP; }
    if (fracSolid > 0.05) { glyph(field, gx, 2, true, fracSolid); gx += GW + GAP; }
    for (let i = 0; i < nUp; i++) { glyph(field, gx, 2, false, 1); gx += GW + GAP; }
    const samTxt = "reachable market " + d.sam + " · total market " + d.tam;
    const sam = g.append("text").attr("x", mL).attr("y", 48)
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#42566a");
    CH.wrapN(sam, samTxt, 78, 2);
    CH.halo(sam);
    CH.drill(field, () => ({
      title: d.name.toUpperCase(),
      value: d.mod_lo === d.mod_hi ? `≈${d.mod_lo.toLocaleString("en-US")} module-equiv.` : `${d.mod_lo.toLocaleString("en-US")}–${d.mod_hi.toLocaleString("en-US")} module-equiv.`,
      sub: "Reachable market: " + d.sam + ". Total market: " + d.tam + ". " + d.note + ".",
      source: CH.srcLink(d.src),
    }));
    if (!CH.REDUCE) {
      field.attr("opacity", 0);
      field.transition().delay(ri * 160).duration(500).attr("opacity", 1);
    }
  });

  // consolidated note
  const nt = svg.append("text").attr("x", mL).attr("y", H - 30)
    .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", "#051c2c").attr("font-weight", 700)
    .text("CONSOLIDATED REACHABLE DEMAND ≈ $9–20B PER YEAR · 15 INDUSTRIES");
  CH.halo(nt);
  const nt2 = svg.append("text").attr("x", mL).attr("y", H - 15)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", "#42566a")
    .text("PLUS DISTILLERY $2–5B · FACTORY FARMS $1–3B · ISLANDS $0.5–1.5B (ESTIMATE)");
  CH.halo(nt2);
  CH.drill(nt, () => ({
    title: "CONSOLIDATED REACHABLE MARKET", value: "~$9–20B /yr",
    sub: RPT.market_meta.sam_note + " " + RPT.market_meta.scwo_note,
    source: CH.srcLink(["K53", "K8", "K64"]),
  }));
})();
