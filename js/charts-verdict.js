// ═══ §5 verdict: balance scale (P18) + regulatory catalyst horizon (P3 wall chart) ═══

/* ────────────────────────────────────────────────────────────
   10 · Verdict scale — the two cases, weighed
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("verdict-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The scale tips toward pursuit — staged, and gated on reliability",
    sub: "EVIDENCE WEIGHTS ON BOTH PANS · DASHED WEIGHTS = UPGRADE TRIGGERS NOT YET MET · HATCHED SEAL = SHARED FALSIFICATION · QUALITATIVE, NOT A SCORE · CLICK EVERYTHING",
    src: "Research compilation — report Ch. 10 synthesis (2026-09); every weight traces to a K anchor",
  });
  const W = 880, H = 580;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkMd = "#42566a", inkLo = "#8595a6", blue = "#2251ff", neg = "#c22f4e";
  const CX = 440, beamY = 128, BL = 210, tilt = 0.075;
  const endY = s => beamY + Math.sin(tilt) * BL * s; // s=-1 left (bear, up), +1 right (bull, down)

  // short weight labels (full text in drill-down)
  const bullShort = ["99.9993% DRE VALIDATED", "$5–28/GAL UMBRELLA", "NO-AIR-PERMIT MOAT", "DATED DEMAND CLOCKS", ">$9.3B DOD LIABILITY", "ENERGY INVERTS AT SCALE"];
  const bearShort = ["30-YR GRAVEYARD", "$215K REV VS $21M LOSS", "EBJ DOWNGRADE −43%", "INCINERATION RE-OPENED", "WATER VALUE CAN'T CARRY IT", "SCALE-UP UNPROVEN >306 T/D"];
  const upShort = ["PILOT ENERGY DATA", "EPA GUIDANCE REVISION", "LANDFILL ELG FINAL"];

  const root = svg.append("g");

  // ── falsification seal (bottom) ──
  const seal = root.append("g");
  seal.append("rect").attr("x", 120).attr("y", 536).attr("width", 640).attr("height", 30).attr("fill", "rgba(194,47,78,.10)");
  for (let hx = 120; hx < 760; hx += 14)
    seal.append("line").attr("x1", hx).attr("y1", 566).attr("x2", hx + 8).attr("y2", 536).attr("stroke", neg).attr("stroke-width", 0.8).attr("opacity", 0.5);
  const falsShort = ["LINER LIFE COLLAPSES ON SALTY FEEDS", "CERCLA / 4 PPT MCLS VACATED", "INCINERATOR BUILD-OUT KILLS THE UMBRELLA"];
  falsShort.forEach((f, i) => {
    const wX = 150 + i * 205;
    const st = seal.append("g");
    st.append("rect").attr("x", wX).attr("y", 541).attr("width", 190).attr("height", 20).attr("fill", "#fff").attr("stroke", neg).attr("stroke-width", 1);
    st.append("text").attr("x", wX + 95).attr("y", 554).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 7.6).attr("font-weight", 700).attr("fill", neg).text(f);
    CH.drill(st, () => ({
      title: "FALSIFICATION LINE " + (i + 3 - 2), value: f,
      sub: RPT.verdict.falsifiers[i].t + " — if this happens, the verdict flips regardless of demand-side evidence.",
      source: CH.srcStr(RPT.verdict.falsifiers[i].src),
    }));
  });
  seal.append("text").attr("x", 120).attr("y", 530).attr("font-family", CH.MONO).attr("font-size", 8.5)
    .attr("fill", neg).attr("font-weight", 700).text("SHARED FALSIFICATION — EITHER CASE DIES IF THESE BREAK");

  // ── pillar + base ──
  root.append("rect").attr("x", CX - 9).attr("y", beamY).attr("width", 18).attr("height", 396).attr("fill", "#eef1f5").attr("stroke", ink).attr("stroke-width", 1.4);
  root.append("path").attr("d", `M${CX - 60},524 L${CX + 60},524 L${CX + 34},500 L${CX - 34},500 Z`).attr("fill", "#e3e9f0").attr("stroke", ink).attr("stroke-width", 1.4);

  // ── fulcrum dial: three zones + needle (stops inside the bull zone) ──
  const dial = root.append("g");
  dial.append("path").attr("d", `M${CX - 44},${beamY} A44,44 0 0 1 ${CX + 44},${beamY}`).attr("fill", "#fff").attr("stroke", ink).attr("stroke-width", 1.4);
  for (let i = 0; i <= 6; i++) {
    const a = Math.PI - (i / 6) * Math.PI;
    const x1 = CX + Math.cos(a) * 36, y1 = beamY - Math.sin(a) * 36;
    const x2 = CX + Math.cos(a) * 44, y2 = beamY - Math.sin(a) * 44;
    dial.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke", inkMd).attr("stroke-width", 1);
  }
  const na = Math.PI - 0.68 * Math.PI; // needle into the right (bull) zone
  dial.append("line").attr("x1", CX).attr("y1", beamY).attr("x2", CX + Math.cos(na) * 38).attr("y2", beamY - Math.sin(na) * 38)
    .attr("stroke", blue).attr("stroke-width", 2.4).attr("stroke-linecap", "round");
  dial.append("circle").attr("cx", CX).attr("cy", beamY).attr("r", 4.5).attr("fill", blue);
  dial.append("text").attr("x", CX - 52).attr("y", beamY + 16).attr("text-anchor", "end").attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkLo).text("WALK AWAY");
  dial.append("text").attr("x", CX + 52).attr("y", beamY + 16).attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", blue).text("PURSUE");

  // ── beam (drawn tilted; hanging assemblies translate, not rotate) ──
  const beam = root.append("g");
  beam.append("line").attr("x1", CX - BL).attr("y1", endY(-1)).attr("x2", CX + BL).attr("y2", endY(1))
    .attr("stroke", ink).attr("stroke-width", 5).attr("stroke-linecap", "round");
  beam.append("circle").attr("cx", CX).attr("cy", beamY).attr("r", 7).attr("fill", ink);

  // ── pans + weights ──
  function pan(side, items, col, srcList) {
    const ex = CX + BL * side, ey = endY(side);
    const g = root.append("g");
    const panY = ey + 150;
    // chains
    [-46, 0, 46].forEach(dx => {
      g.append("line").attr("x1", ex + dx * 0.2).attr("y1", ey + 4).attr("x2", ex + dx).attr("y2", panY - 8)
        .attr("stroke", inkMd).attr("stroke-width", 1.2);
    });
    // pan bowl
    g.append("path").attr("d", `M${ex - 96},${panY} A96,26 0 0 0 ${ex + 96},${panY}`).attr("fill", "#eef1f5").attr("stroke", ink).attr("stroke-width", 1.4);
    g.append("line").attr("x1", ex - 96).attr("x2", ex + 96).attr("y1", panY).attr("y2", panY).attr("stroke", ink).attr("stroke-width", 1.4);
    // weight stack (solid trapezoids, bottom-up; 22px pitch so six clear the beam)
    items.forEach((t, i) => {
      const wy = panY - (i + 1) * 22;
      const wg = g.append("g").style("opacity", 0);
      const ww = 158 - i * 4;
      wg.append("path").attr("d", `M${ex - ww / 2 + 8},${wy} L${ex + ww / 2 - 8},${wy} L${ex + ww / 2},${wy + 22} L${ex - ww / 2},${wy + 22} Z`)
        .attr("fill", col).attr("stroke", ink).attr("stroke-width", 1.1);
      wg.append("circle").attr("cx", ex).attr("cy", wy - 3.5).attr("r", 3.2).attr("fill", col).attr("stroke", ink).attr("stroke-width", 1);
      const wt = wg.append("text").attr("x", ex).attr("y", wy + 14.5).attr("text-anchor", "middle")
        .attr("font-family", CH.MONO).attr("font-size", 7.2).attr("font-weight", 700).attr("fill", "#fff").text(t);
      CH.drill(wg, () => ({
        title: (side > 0 ? "BULL EVIDENCE" : "BEAR EVIDENCE"), value: t,
        sub: srcList[i].t, source: CH.srcStr(srcList[i].src),
      }));
      if (CH.REDUCE) wg.style("opacity", 1);
      else wg.transition().delay(500 + i * 160 + (side > 0 ? 80 : 0)).duration(300).style("opacity", 1);
    });
    // case label
    g.append("text").attr("x", ex).attr("y", panY + 44).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 10).attr("font-weight", 700).attr("fill", col)
      .text(side > 0 ? "THE BULL CASE" : "THE BEAR CASE");
    return g;
  }
  pan(-1, bearShort, inkMd, RPT.verdict.bear);
  pan(1, bullShort, blue, RPT.verdict.bull);

  // ── upgrade triggers: dashed hollow weights hovering above the bull pan ──
  const upX = CX + BL, upBaseY = 152;
  RPT.verdict.upgrades.forEach((u, i) => {
    const wy = upBaseY - i * 30;
    const g = root.append("g").style("opacity", 0);
    g.append("path").attr("d", `M${upX - 72},${wy} L${upX + 72},${wy} L${upX + 80},${wy + 25} L${upX - 80},${wy + 25} Z`)
      .attr("fill", "rgba(255,255,255,.75)").attr("stroke", blue).attr("stroke-width", 1.2).attr("stroke-dasharray", "5 4");
    g.append("text").attr("x", upX).attr("y", wy + 16.5).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 7.8).attr("font-weight", 700).attr("fill", blue).text(upShort[i]);
    // dashed arrow down toward the pan
    g.append("path").attr("d", `M${upX + 88},${wy + 12} q18,10 4,26`).attr("fill", "none")
      .attr("stroke", blue).attr("stroke-width", 1).attr("stroke-dasharray", "3 3");
    CH.drill(g, () => ({
      title: "UPGRADE TRIGGER — NOT YET MET", value: upShort[i],
      sub: u.t + ". The reading upgrades only when all three land on the pan.",
      source: CH.srcStr(u.src),
    }));
    if (CH.REDUCE) g.style("opacity", 1);
    else g.transition().delay(1600 + i * 200).duration(350).style("opacity", 1);
  });
  const upNote = root.append("text").attr("x", upX).attr("y", upBaseY - 3 * 30 - 12).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", blue).text("READING UPGRADES ONLY WHEN ALL LAND ON THE PAN");
  CH.halo(upNote);

  // ── readout plaque on the pillar ──
  const rd = root.append("g");
  rd.append("rect").attr("x", CX - 118).attr("y", 300).attr("width", 236).attr("height", 56).attr("fill", "#fff").attr("stroke", ink).attr("stroke-width", 1.6);
  rd.append("text").attr("x", CX).attr("y", 322).attr("text-anchor", "middle").attr("font-family", CH.SERIF)
    .attr("font-weight", 700).attr("font-size", 14).attr("fill", ink).text("Pursue, staged — Tier 1 first.");
  rd.append("text").attr("x", CX).attr("y", 342).attr("text-anchor", "middle").attr("font-family", CH.MONO)
    .attr("font-size", 8.5).attr("fill", inkMd).text("RELIABILITY, NOT DEMAND, IS THE GATE");
  CH.drill(rd, () => ({
    title: "CURRENT VERDICT", value: "Pursue, staged",
    sub: "The opportunity is real but not yet banked: ~$9–20B/yr consolidated serviceable demand across fifteen industries, contingent on proving unattended reliability on salty feeds — and, new in v2, on scaling in parallel trains rather than unproven giant vessels. Qualitative reading, not a score.",
    source: CH.srcStr(["K53", "K20", "K70"]),
  }));

  root.style("opacity", 0);
  CH.enter(host, () => root.transition().duration(500).style("opacity", 1));
  if (CH.REDUCE) root.style("opacity", 1);
})();

/* ────────────────────────────────────────────────────────────
   11 · The demand clock — dated regulatory catalysts, 2023–2045
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("horizon-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The demand clock: several of the risks are dated, and therefore tradeable",
    sub: "WALL-CHART TIMELINE 2023–2045 · INK = POLICY FRAMEWORK · BLUE = DEMAND CATALYST · RED FRAME = RISK/COMPETITION EVENT · 2026 = CURRENT WINDOW · CLICK PLAQUES",
    src: "Industry & official — EPA, GAO, DoD, WHO, EU 2024/3019, CPCB/NGT · dates as published",
  });
  const W = 880, H = 380, axisY = 316;
  // piecewise-linear time scale: dense recent decade expanded, long horizon compressed
  const x = v => v <= 2028 ? 56 + (v - 2022.5) / 5.5 * 500 : 556 + (v - 2028) / 18 * 268;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkLo = "#8595a6", blue = "#2251ff", neg = "#c22f4e";
  const clsCol = { policy: ink, demand: blue, risk: neg };

  // current window band (2026)
  svg.append("rect").attr("x", x(2026)).attr("y", 30).attr("width", x(2027) - x(2026)).attr("height", axisY - 26)
    .attr("fill", "rgba(34,81,255,.06)");
  svg.append("text").attr("x", (x(2026) + x(2027)) / 2).attr("y", 24).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", blue).text("NOW");

  // double-line axis
  svg.append("line").attr("x1", 40).attr("x2", W - 16).attr("y1", axisY).attr("y2", axisY).attr("stroke", ink).attr("stroke-width", 1.6);
  svg.append("line").attr("x1", 40).attr("x2", W - 16).attr("y1", axisY + 4).attr("y2", axisY + 4).attr("stroke", ink).attr("stroke-width", 1);
  [2025, 2030, 2035, 2040, 2045].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", axisY - 4).attr("y2", axisY + 9).attr("stroke", ink);
    svg.append("text").attr("x", x(v)).attr("y", axisY + 24).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", inkLo).text(v);
  });

  // greedy layering of plaques
  const layers = []; // each: last x-end
  const placed = RPT.catalysts.map(c => {
    const wpx = Math.max(64, c.label.length * 6.35 + 18);
    const cx = x(c.y);
    let li = 0;
    for (;;) {
      if (!layers[li] || cx - wpx / 2 > layers[li] + 8) { layers[li] = cx + wpx / 2; break; }
      li++;
    }
    return { ...c, wpx, cx, li };
  });
  const layerY = li => 262 - li * 54;
  const stemG = svg.append("g");   // stems first (never pierce plaque text)
  const plqG = svg.append("g");    // plaques after

  placed.forEach((p, i) => {
    const py = layerY(p.li), col = clsCol[p.cls];
    stemG.append("line").attr("x1", p.cx).attr("x2", p.cx).attr("y1", py + 20).attr("y2", axisY - 2)
      .attr("stroke", col).attr("stroke-width", 0.9).attr("opacity", 0.55);
    stemG.append("circle").attr("cx", p.cx).attr("cy", axisY).attr("r", 2.6).attr("fill", col);
    const g = plqG.append("g").style("opacity", 0);
    g.append("rect").attr("x", p.cx - p.wpx / 2).attr("y", py - 12).attr("width", p.wpx).attr("height", 34)
      .attr("rx", 2).attr("fill", "#fff").attr("stroke", col).attr("stroke-width", p.cls === "demand" ? 1.8 : 1.2)
      .attr("stroke-dasharray", p.cls === "risk" ? "5 3" : null);
    const yr = Math.floor(p.y);
    g.append("text").attr("x", p.cx - p.wpx / 2 + 7).attr("y", py + 1)
      .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", col).text(yr);
    g.append("text").attr("x", p.cx - p.wpx / 2 + 7).attr("y", py + 15)
      .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 10.5).attr("fill", ink).text(p.label);
    CH.drill(g, () => ({
      title: `${yr} · ${p.label.toUpperCase()}`, value: p.cls === "risk" ? "RISK EVENT" : p.cls === "demand" ? "DEMAND CATALYST" : "POLICY FRAMEWORK",
      sub: p.ev + ".", source: CH.srcStr(p.src),
    }));
    if (CH.REDUCE) g.style("opacity", 1);
    else g.transition().delay(i * 110).duration(350).style("opacity", 1);
  });

  svg.append("text").attr("x", 56).attr("y", axisY + 42)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo)
    .text("SCENARIO-TRIGGERED DEPLOYMENT: CAPITAL FOLLOWS DATED CLOCKS, NOT BLIND STAGING · EU UWWTD BUILD-OUT RUNS TO 2045 (DIRECTIVE TIMETABLE)");
})();
