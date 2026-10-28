// ═══ §4 players: who survived and who failed (P2) + vendor small multiples (P9-style panel) ═══

/* ────────────────────────────────────────────────────────────
   8 · Who survived and who failed — forty years of SCWO, flowing to outcomes
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("destiny-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The graveyard is the context; the four survivors are the evidence",
    sub: "COMMERCIAL SCWO ENTITIES 1980–2026 · DASHED SPAN = GRADED DATE ESTIMATE · ✕ = EXITED · RIBBON = OUTCOME · CLICK LINES AND PLAQUES",
    src: "Industry & official — SCWO literature reviews (2019/2021), US National Research Council (2002), US EPA waste office · Company disclosure — vendor press releases, SEC filings",
  });
  const W = 880, padT = 46, rowH = 40;
  const rows = RPT.players;
  const H = padT + rows.length * rowH + 52;
  const rowEls = [];
  const mL = 196, tX0 = 214, tX1 = 636, pX = 706; // timeline + plaque column
  const x = d3.scaleLinear().domain([1980, 2027]).range([tX0, tX1]);
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkMd = "#42566a", inkLo = "#42566a", blue = "#2251ff", neg = "#c22f4e";

  // axis
  [1980, 1990, 2000, 2010, 2020, 2027].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 10).attr("y2", H - 46).attr("stroke", "#eef1f6");
    svg.append("text").attr("x", x(v)).attr("y", padT - 16).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", inkLo).text(v);
  });
  // 2021 census marker
  const cen = svg.append("g");
  cen.append("line").attr("x1", x(2021)).attr("x2", x(2021)).attr("y1", padT - 10).attr("y2", H - 46)
    .attr("stroke", neg).attr("stroke-width", 1).attr("stroke-dasharray", "2 3");
  const cenT = cen.append("text").attr("x", x(2021)).attr("y", H - 36).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", neg)
    .text("2021: ~6 COMMERCIAL PLANTS LEFT WORLDWIDE");
  CH.halo(cenT);
  CH.drill(cenT, () => ({
    title: "THE GRAVEYARD CENSUS", value: "~6 plants (2021)",
    sub: RPT.field_stats.note + " — mainly corrosion, plugging, and economics.",
    source: CH.srcLink(RPT.field_stats.src),
  }));

  // cohort kickers
  svg.append("text").attr("x", 6).attr("y", padT - 4)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo).attr("letter-spacing", ".12em")
    .text("THE GRAVEYARD ↓");
  svg.append("text").attr("x", 6).attr("y", padT + 6 * rowH + 2)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", blue).attr("letter-spacing", ".12em")
    .text("THE OPERATING FIELD ↓");

  // outcome plaques
  const outcomes = [
    { id: "dead", label: "EXITED / CLOSED ✕", col: neg },
    { id: "sold", label: "TECHNOLOGY SOLD", col: inkMd },
    { id: "licensed", label: "LICENSED → REVIVE", col: inkMd },
    { id: "operating", label: "OPERATING TODAY", col: blue },
  ];
  // plaque y = mean of inflow rows (sorted to reduce crossings)
  const plaqueY = {};
  outcomes.forEach(o => {
    const idxs = rows.map((r, i) => r.outcome === o.id ? i : -1).filter(i => i >= 0);
    plaqueY[o.id] = idxs.length ? padT + (idxs.reduce((a, b) => a + b, 0) / idxs.length) * rowH + rowH / 2 : padT;
  });
  const plaqueEls = {};
  outcomes.forEach(o => {
    const y = plaqueY[o.id];
    const g = svg.append("g").style("opacity", 0).attr("class", "plaque");
    g.append("rect").attr("x", pX).attr("y", y - 12).attr("width", W - pX - 8).attr("height", 24).attr("rx", 3)
      .attr("fill", "#fff").attr("stroke", o.col).attr("stroke-width", 1.4);
    g.append("rect").attr("x", pX).attr("y", y - 12).attr("width", 3).attr("height", 24).attr("fill", o.col);
    g.append("text").attr("x", pX + 12).attr("y", y + 4).attr("font-family", CH.MONO)
      .attr("font-size", 9.5).attr("font-weight", 700).attr("fill", o.col).text(o.label);
    plaqueEls[o.id] = g;
    CH.drill(g, () => ({
      title: "OUTCOME · " + o.label, value: rows.filter(r => r.outcome === o.id).length + " entities",
      sub: rows.filter(r => r.outcome === o.id).map(r => r.name).join(" · "),
      source: CH.srcLink(["K49"]),
    }));
  });

  // entity rows
  rows.forEach((r, i) => {
    const yy = padT + i * rowH + rowH / 2;
    const g = svg.append("g");
    rowEls.push(g);
    // name (left column, serif)
    const nm = g.append("text").attr("x", mL - 12).attr("y", yy - 5).attr("text-anchor", "end")
      .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5)
      .attr("fill", r.cohort === "The graveyard" ? inkMd : ink);
    CH.wrap2(nm, r.name, 20);
    CH.halo(nm);
    // birth label
    g.append("text").attr("x", x(r.from) - 4).attr("y", yy + 17).attr("text-anchor", "start")
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkLo).text(r.from + (r.graded ? "*" : ""));
    // lifeline
    const alive = r.outcome === "operating";
    const line = g.append("line").attr("x1", x(r.from)).attr("x2", x(r.from)).attr("y1", yy).attr("y2", yy)
      .attr("stroke", alive ? blue : inkMd).attr("stroke-width", alive ? 4 : 3).attr("stroke-linecap", "round")
      .attr("stroke-dasharray", r.graded ? "5 4" : null)
      .attr("data-x1", x(r.to));
    // dead endpoint ✕
    let end = null;
    if (r.outcome === "dead") {
      end = g.append("text").attr("x", x(r.to)).attr("y", yy + 5).attr("text-anchor", "middle")
        .attr("font-family", CH.MONO).attr("font-size", 13).attr("font-weight", 700).attr("fill", neg)
        .style("opacity", 0).attr("class", "deadx").text("✕");
      CH.halo(end, 3);
    }
    // ribbon to plaque (hairline — deal sizes undisclosed)
    const py = plaqueY[r.outcome];
    const rb = g.append("path")
      .attr("d", `M${x(r.to)},${yy} C ${x(r.to) + 30},${yy} ${pX - 34},${py} ${pX - 6},${py}`)
      .attr("fill", "none").attr("stroke", alive ? blue : inkLo).attr("stroke-width", alive ? 1.6 : 1)
      .attr("opacity", alive ? 0.8 : 0.55).style("opacity", 0).attr("class", "ribbon");
    CH.drill(line, () => ({
      title: r.name.toUpperCase() + (r.graded ? " · DATES GRADED [DERIVED]" : ""),
      value: `${r.from}–${r.to === 2026 ? "today" : r.to} → ${r.out}`,
      sub: r.note, source: CH.srcLink(r.src),
    }));
    if (end) CH.drill(end, () => ({
      title: r.name.toUpperCase(), value: "✕ " + r.out, sub: r.note, source: CH.srcLink(r.src),
    }));
  });

  // footnote
  svg.append("text").attr("x", tX0).attr("y", H - 30)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo)
    .text("* GRADED DATE ESTIMATE [DERIVED]");
  svg.append("text").attr("x", tX0).attr("y", H - 14)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo)
    .text("ALL RIBBONS HAIRLINE-THIN — DEAL SIZES ARE UNDISCLOSED");

  CH.enter(host, () => {
    svg.selectAll("line[data-x1]").transition().duration(700).delay((d, i) => i * 45)
      .attr("x2", function () { return +d3.select(this).attr("data-x1"); });
    svg.selectAll(".deadx").transition().delay(750).duration(300).style("opacity", 1);
    svg.selectAll(".ribbon").transition().delay(600).duration(600).style("opacity", null);
    svg.selectAll(".plaque").transition().delay(1000).duration(400).style("opacity", 1);
  });
  if (CH.REDUCE) {
    svg.selectAll("line[data-x1]").attr("x2", function () { return +d3.select(this).attr("data-x1"); });
    svg.selectAll(".deadx").style("opacity", 1);
    svg.selectAll(".ribbon").style("opacity", null);
    svg.selectAll(".plaque").style("opacity", 1);
  }

  // ── walkthrough registration (the who survived and who failed) ──
  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.walk["destiny-chart"] = {
    title: "Forty years of SCWO, in four moves",
    steps: [
      { els: rows.map((r, i) => r.cohort === "The graveyard" ? rowEls[i] : null).filter(Boolean),
        label: "The graveyard",
        cap: "Most commercial SCWO ventures died. Corrosion and salt plugging in conventional preheater designs — plus weak economics — ended every one of these lifelines." },
      { el: cen, label: "The 2021 census",
        cap: "By 2021 only ~6 commercial SCWO plants were left worldwide. The technology worked chemically; the industry failed on reliability and cost." },
      { els: rows.map((r, i) => r.outcome === "operating" ? rowEls[i] : null).filter(Boolean),
        label: "The operating field",
        cap: "Four survivors still operate today — 374Water, General Atomics, Aquarden, and Revive Environmental — each with verifiable plants or programs. They are the evidence base, not the graveyard." },
      { els: Object.values(plaqueEls), label: "Where entities end up",
        cap: "Every lifeline flows to one of four outcomes: exited, technology sold, licensed into a revival, or still operating. Ribbons are hairlines because deal sizes are undisclosed." },
    ],
  };
  CXT.table["destiny-chart"] = {
    cols: ["Entity", "Active", "Outcome", "Notes"],
    rows: rows.map(r => [r.name + (r.graded ? " *" : ""), `${r.from}–${r.to === 2026 ? "today" : r.to}`, r.out, r.note]),
  };
})();

/* ────────────────────────────────────────────────────────────
   9 · Vendor benchmark — four verifiable operators, shared TRL (how proven the technology is) axis
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("vendor-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Four verifiable operators — and the benchmark the HCSP must beat",
    sub: "SHARED TRL (HOW PROVEN THE TECHNOLOGY IS) AXIS (1–9) · THROUGHPUT CLASSES ARE DIFFERENT BASES — SHOWN FOR CLASS, NEVER DIVIDED · CLICK PANELS",
    src: "Company disclosure — 374Water 10-K (2026-03-31), General Atomics, Aquarden (2024–25) · Industry & official — EPA interim guidance, third release (2026-04)",
  });
  const W = 880, H = 344, padT = 22, padB = 8;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkMd = "#42566a", inkLo = "#42566a", blue = "#2251ff";
  const cols = 4, cw = (W - 40) / cols;
  const trlX = d3.scaleLinear().domain([1, 9]).range([0, cw - 44]);

  RPT.vendors.forEach((v, i) => {
    const x0 = 20 + i * cw;
    const g = svg.append("g").attr("transform", `translate(${x0},${padT})`).style("opacity", 0);
    const main = i === 0;
    if (i > 0) g.append("line").attr("x1", -8).attr("x2", -8).attr("y1", 0).attr("y2", H - padT - padB).attr("stroke", "#eef1f6");
    // name + scale
    g.append("text").attr("x", 0).attr("y", 14).attr("font-family", CH.SERIF).attr("font-weight", 700)
      .attr("font-size", 14.5).attr("fill", main ? blue : ink).text(v.name);
    g.append("text").attr("x", 0).attr("y", 31).attr("font-family", CH.MONO).attr("font-size", 8.5)
      .attr("fill", inkLo).each(function () { CH.wrap2(d3.select(this), ("SCALE " + v.scale).toUpperCase(), 22); });
    // TRL (how proven the technology is) range
    g.append("text").attr("x", 0).attr("y", 66).attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkMd)
      .text("TECHNOLOGY READINESS");
    g.append("line").attr("x1", trlX(1)).attr("x2", trlX(9)).attr("y1", 84).attr("y2", 84).attr("stroke", "#dbe2ea").attr("stroke-width", 3).attr("stroke-linecap", "round");
    [1, 3, 5, 7, 9].forEach(tick => g.append("text").attr("x", trlX(tick)).attr("y", 104).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkLo).text(tick));
    const rb = g.append("rect").attr("x", trlX(v.trl[0])).attr("y", 79).attr("height", 10).attr("rx", 3)
      .attr("fill", main ? blue : inkMd).attr("width", 0).attr("data-w", trlX(v.trl[1]) - trlX(v.trl[0]));
    g.append("text").attr("x", trlX(v.trl[0]) - 6).attr("y", 86).attr("text-anchor", "end").attr("font-family", CH.MONO).attr("font-size", 9.5)
      .attr("font-weight", 700).attr("fill", main ? blue : ink).text(`TRL ${v.trl[0]}–${v.trl[1]}`);
    // energy + cost
    g.append("text").attr("x", 0).attr("y", 128).attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkMd)
      .text("ENERGY");
    wrap(g, v.energy.toUpperCase(), 0, 146, cw - 30, 9.5, ink, CH.MONO, 700);
    g.append("text").attr("x", 0).attr("y", 206).attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkMd)
      .text("COST BENCHMARK");
    wrap(g, v.cost.toUpperCase(), 0, 224, cw - 30, 9.5, ink, CH.MONO, 700);
    g.append("text").attr("x", 0).attr("y", 270).attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkMd)
      .text("KEY CONSTRAINT");
    wrap(g, v.constraint.toUpperCase(), 0, 288, cw - 30, 9.5, inkMd, CH.MONO, 400);
    CH.drill(g, () => ({
      title: v.name.toUpperCase(), value: `TRL ${v.trl[0]}–${v.trl[1]} (how proven the technology is, 1–9)`,
      sub: `Scale: ${v.scale}. Energy: ${v.energy}. Cost: ${v.cost}. Constraint: ${v.constraint}.`,
      source: CH.srcLink(v.src),
    }));
    if (CH.REDUCE) { g.style("opacity", 1); rb.attr("width", rb.attr("data-w")); }
    else {
      g.transition().delay(i * 140).duration(400).style("opacity", 1);
      rb.transition().delay(300 + i * 140).duration(500).attr("width", rb.attr("data-w"));
    }
  });

  function wrap(g, text, x0, y0, maxW, fs, fill, fam, fw) {
    // word-boundary two-line wrap (sized for the ≥12px readability floor)
    const per = Math.max(8, Math.floor(maxW / 8.2));
    let t1 = text, t2 = "", t3 = "";
    if (text.length > per) {
      const lines = [""];
      text.split(" ").forEach(w => {
        const cand = (lines[lines.length - 1] + " " + w).trim();
        if (cand.length <= per) lines[lines.length - 1] = cand;
        else if (lines.length < 3) lines.push(w);
        else lines[2] = (lines[2] + " " + w).trim();
      });
      if (lines[2] && lines[2].length > per) lines[2] = lines[2].slice(0, per - 1).replace(/[ ,;–—(/-]+$/, "") + " …";
      t1 = lines[0]; t2 = lines[1] || ""; t3 = lines[2] || "";
    }
    const t = g.append("text").attr("x", x0).attr("y", y0).attr("font-family", fam).attr("font-size", fs).attr("font-weight", fw).attr("fill", fill).text(t1);
    if (t2) t.append("tspan").attr("x", x0).attr("dy", "1.35em").text(t2);
    if (t3) t.append("tspan").attr("x", x0).attr("dy", "1.35em").text(t3);
  }
})();
