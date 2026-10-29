// ═══ §0/§2/§3 executive charts: skid spec table (P17), mechanism P–T path, market-in-dollars (P1) ═══

/* ────────────────────────────────────────────────────────────
   5 · One skid, seven numbers — the DOM spec-table alternative
   that sits beside the interactive 3D skid explorer (skid3d.js).
   Every row: the number, what it is, its basis — click for the
   drill-down with dated sources.
──────────────────────────────────────────────────────────── */
(function () {
  const table = document.getElementById("skid-spec-table");
  if (!table) return;
  const ROWS = [
    { head: "10 m³/day", what: "Rated throughput · ≈0.9M gal/yr",
      val: "10 m³/day", basis: "Rated throughput (~2,640 gal/day); ~0.9M gal/yr at 90% utilization — sized to a mid-size industrial site's generation rate.", src: ["K1"] },
    { head: "Atmospheric pressure", what: "Distill + high-heat oxidize — no pressure vessels",
      val: "No pressurization", basis: "Per the owner's process description, the HCSP boils the water off the waste and condenses the steam into distilled water, then burns the separated toxic residues and gases at high temperature in a dry environment — all at ordinary atmospheric pressure, with no heavy pressure vessels.", src: ["K207"] },
    { head: "75–95 kW", what: "Startup power spec",
      val: "75–95 kW", basis: "Startup/auxiliary power draw spec (180–228 kilowatt-hours per cubic meter × 8.62 ¢/kWh US industrial ≈ $15–20/m³-equivalent). Operating energy itself is negligible per the manufacturer — the self-fueling hydrogen loop generates fuel on demand from process water; grid price values the startup draw and every exported kilowatt-hour.", src: ["K23", "K1"] },
    { head: "≈$3.5/m³", what: "Recovered-water value",
      val: "≈ $3.53/m³", basis: "85–95% distilled recovery at <10 µS/cm earns a credit worth roughly US average commercial water + sewer tariffs — valuable, never sufficient to carry the economics.", src: ["K31", "K1"] },
    { head: "Pricing TBD", what: "vs $5–28/gal documented existing suppliers",
      val: "TBD — pending", basis: "HCSP service pricing is TBD — manufacturer cost model pending. The documented existing suppliers it would undercut: incineration $5–10/gal, existing SCWO service $6–10/gal, hazardous landfilling of AFFF at $28/gal (Michigan 2020).", src: ["K21", "K10"] },
    { head: "Purchase cost TBD", what: "Manufacturer cost model pending",
      val: "TBD — pending", basis: "HCSP module purchase cost is TBD — manufacturer cost model pending. The market reference point is the only verifiable commercial SCWO transaction of this class: the AirSCWO 6's $5.2M equipment-plus-operation contract inside a $7.9M OC San project.", src: ["K18"] },
    { head: "No air permit", what: "Sealed system vents water vapor",
      val: "The hidden permitting advantage", basis: "~24 federally licensed US hazardous-waste incinerators (RCRA combustors) run at 88–92% utilization with one new unit in three decades; a sealed system bypasses the multi-year air-permitting gauntlet.", src: ["K1", "K34"] },
    { head: "8–10 m² footprint", what: "Container class · under 3 m tall · quiet (<75 dB)",
      val: "8–10 m²", basis: "Indoor-sited, container-class footprint — deployable at the point of waste generation, not at a central plant.", src: ["K1"] },
  ];
  table.innerHTML = `<thead><tr><th>Number</th><th>What it is</th><th>Basis</th></tr></thead>
    <tbody>${ROWS.map((r, i) => `<tr data-r="${i}">
      <td class="sk-v">${r.head}</td><td>${r.what}</td><td>${r.basis}</td>
    </tr>`).join("")}</tbody>`;
  table.querySelectorAll("tr[data-r]").forEach(tr => {
    const r = ROWS[+tr.dataset.r];
    tr.style.cursor = "pointer";
    tr.setAttribute("data-drill-keep", "");
    const dates = r.src.map(id => { const s = window.K && K(id); return s ? s.date : ""; }).filter(Boolean).join(", ");
    tr.onclick = e => {
      e.stopPropagation();
      U.showDrill({ title: r.head.toUpperCase(), value: r.val, sub: r.basis, source: CH.srcLink(r.src) + (dates ? " · dated " + dates : ""), x: e.clientX, y: e.clientY });
    };
  });
  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.table["skid-spec-table"] = {
    cols: ["Number", "What it is", "Basis"],
    rows: ROWS.map(r => [r.head, r.what, r.basis]),
  };
})();

/* ────────────────────────────────────────────────────────────
   6 · Mechanism — the process as a left-to-right flow, all at
   atmospheric pressure (owner process description, K207)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("mechanism-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Distill, oxidize, condense — the whole machine at ordinary atmospheric pressure",
    sub: "FOUR STAGES LEFT→RIGHT · DASHED = THE SELF-FUELING H₂ LOOP (FUEL ON DEMAND FROM PROCESS WATER) · NO PRESSURE VESSELS · CLICK NODES",
    src: "Company disclosure — HCSP technical briefing (2025-08) + owner-provided process description, Process Step.docx (K207) · Industry & official — ITRC Enviro Wiki (rev. 2026), Energies/MDPI (2024)",
  });
  body.insertBefore(CH.plainLine("What this shows: the four steps of the process — feed in, distill, oxidize, condense — drawn left to right. Nothing on this chart is pressurized."), body.firstChild);
  const W = 880, H = 500;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkLo = "#42566a", blue = "#2251ff", neg = "#c22f4e";

  // atmospheric banner
  const ban = svg.append("text").attr("x", W / 2).attr("y", 46).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 11).attr("font-weight", 700).attr("fill", blue)
    .text("ATMOSPHERIC PRESSURE THROUGHOUT — NO PRESSURE VESSELS, NO 250-BAR PLUMBING");
  CH.halo(ban);

  // ── four stage boxes, left → right ──
  const BW = 160, BH = 108, BY = 150, GAP = 30;
  const xs = [50, 240, 430, 620]; // boxes end at 780; outputs stub 784→856
  const stages = [
    { n: 1, name: "FEED IN", lines: ["CONCENTRATED WASTE", "10 M³/DAY, NO PRESSURE"],
      sub: "Concentrated feed (≥60–150 g/L COD — COD measures how much organic waste is in the water — or an upstream concentrate) is metered in at ordinary atmospheric pressure. There is no high-pressure pump: nothing in the process is pressurized.", src: ["K58", "K207"] },
    { n: 2, name: "DISTILL", lines: ["BOIL THE WATER OFF", "CONTAMINANTS STAY"],
      sub: "Phase change: the feed is boiled, the water rises as steam, and the heavy contaminants and salts stay behind in the still. Separating the water out first is what makes salt management simple — the scaling and plugging that killed conventional SCWO plants never gets a chance to start (owner process description).", src: ["K207", "K20"] },
    { n: 3, name: "OXIDIZE", lines: ["HIGH-HEAT COMBUSTION", "GAS-PHASE, >3,000 °F"],
      sub: "The separated toxic residues and volatile gases are burned at high temperature in a dry environment — gas-phase combustion, the thermal-oxidizer half of the machine. The technology class's destruction record runs to 99.9993% destroyed and removed, federally validated in a US Army Corps of Engineers lab test.", src: ["K207", "K2"] },
    { n: 4, name: "CONDENSE", lines: ["STEAM → DISTILLED H₂O", "85–95% + SOLIDS OUT"],
      sub: "The steam is condensed back into distilled-quality water (85–95% recovery, <10 µS/cm — purer than tap water), earning a ~$3.5/m³ byproduct credit; the contained inert solids are the fully broken-down residue.", src: ["K1", "K31"] },
  ];
  const flowG = svg.append("g");
  // connecting arrows (drawn first, behind boxes)
  for (let i = 0; i < 3; i++) {
    const ax1 = xs[i] + BW + 4, ax2 = xs[i + 1] - 6, ay = BY + BH / 2;
    flowG.append("line").attr("x1", ax1).attr("y1", ay).attr("x2", ax2).attr("y2", ay)
      .attr("stroke", ink).attr("stroke-width", 2.4);
    flowG.append("path").attr("d", "M-5,-5 L6,0 L-5,5 Z").attr("fill", ink)
      .attr("transform", `translate(${ax2},${ay})`);
  }
  // outputs stub after stage 4
  flowG.append("line").attr("x1", xs[3] + BW + 4).attr("y1", BY + BH / 2).attr("x2", W - 24).attr("y2", BY + BH / 2)
    .attr("stroke", ink).attr("stroke-width", 2.4);
  flowG.append("path").attr("d", "M-5,-5 L6,0 L-5,5 Z").attr("fill", ink)
    .attr("transform", `translate(${W - 24},${BY + BH / 2})`);
  const outl = svg.append("text").attr("x", xs[3] + BW / 2).attr("y", BY + BH + 38).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkLo).text("OUT: DISTILLED WATER · INERT SOLIDS · HEAT");
  CH.halo(outl);

  const stageEls = [];
  stages.forEach((s, i) => {
    const g = svg.append("g").style("opacity", 0);
    stageEls.push(g);
    const bx = xs[i];
    g.append("rect").attr("x", bx).attr("y", BY).attr("width", BW).attr("height", BH)
      .attr("fill", "#fff").attr("stroke", ink).attr("stroke-width", 1.8);
    // numbered badge
    g.append("circle").attr("cx", bx + 18).attr("cy", BY + 18).attr("r", 11).attr("fill", "#fff").attr("stroke", ink).attr("stroke-width", 2);
    g.append("text").attr("x", bx + 18).attr("y", BY + 22).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 11).attr("font-weight", 700).attr("fill", ink).text(s.n);
    const t1 = g.append("text").attr("x", bx + 36).attr("y", BY + 22).attr("text-anchor", "start")
      .attr("font-family", CH.MONO).attr("font-size", 11.5).attr("font-weight", 700).attr("fill", ink).text(s.n + " · " + s.name);
    CH.halo(t1);
    s.lines.forEach((ln, li) => {
      const t2 = g.append("text").attr("x", bx + BW / 2).attr("y", BY + 52 + li * 14).attr("text-anchor", "middle")
        .attr("font-family", CH.MONO).attr("font-size", 7.5).attr("fill", inkLo).text(ln);
      CH.halo(t2);
    });
    CH.drill(g, () => ({ title: `STAGE ${s.n} · ${s.name}`, value: s.lines.join(" · "), sub: s.sub, source: CH.srcLink(s.src) }));
    g.attr("data-drill-keep", "");
  });

  // ── self-fueling H₂ loop (dashed branch feeding heat to stages 2–3) ──
  const h2 = svg.append("g");
  const hbx = 180, hbw = 470, hby = BY + BH + 66, hbh = 54;
  h2.append("rect").attr("x", hbx).attr("y", hby).attr("width", hbw).attr("height", hbh)
    .attr("fill", "none").attr("stroke", blue).attr("stroke-width", 1.4).attr("stroke-dasharray", "5 4");
  const h2t = h2.append("text").attr("x", hbx + hbw / 2).attr("y", hby + 22).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", blue).text("SELF-FUELING H₂ LOOP — ELECTROLYZER + COMBUSTOR");
  CH.halo(h2t);
  const h2s = h2.append("text").attr("x", hbx + hbw / 2).attr("y", hby + 38).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", blue).text("FUEL ON DEMAND FROM PROCESS WATER · GRID COVERS 75–95 KW STARTUP");
  CH.halo(h2s);
  // dashed heat risers up into the distill + oxidize boxes
  [xs[1] + BW / 2, xs[2] + BW / 2].forEach(cx => {
    h2.append("line").attr("x1", cx).attr("y1", hby).attr("x2", cx).attr("y2", BY + BH + 6)
      .attr("stroke", blue).attr("stroke-width", 1.4).attr("stroke-dasharray", "4 3");
    h2.append("path").attr("d", "M-4,5 L0,-4 L4,5 Z").attr("fill", blue)
      .attr("transform", `translate(${cx},${BY + BH + 7})`);
  });
  const h2lab = h2.append("text").attr("x", xs[2] + BW + 14).attr("y", BY + BH + 16).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", blue).text("PROCESS HEAT");
  CH.halo(h2lab);
  CH.drill(h2, () => ({
    title: "THE SELF-FUELING H₂ LOOP", value: "Negligible net energy in operation",
    sub: "Per the manufacturer briefing: a portion of the process water is electrolyzed on demand and the clean H₂/O₂ is combusted to supply the process heat that boils the still and fires the oxidizer — fuel is generated as needed, never purchased or stored in bulk, at negligible net energy cost once started. A working prototype exists; grid power covers only startup/auxiliary draw (75–95 kW spec).",
    source: CH.srcLink(["K1", "K60"]),
  }));
  h2.attr("data-drill-keep", "");

  // feed-in label
  const fl = svg.append("text").attr("x", xs[0]).attr("y", BY - 16).attr("text-anchor", "start")
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", inkLo).text("CONCENTRATED FEED IN · 10 M³/DAY");
  CH.halo(fl);

  // comparison strip: what this replaces
  const cmp = svg.append("g");
  cmp.append("rect").attr("x", 50).attr("y", H - 92).attr("width", W - 100).attr("height", 56)
    .attr("fill", "rgba(34,81,255,.05)").attr("stroke", inkLo).attr("stroke-width", 1).attr("stroke-dasharray", "3 3");
  const c1 = cmp.append("text").attr("x", 66).attr("y", H - 70)
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("font-weight", 700).attr("fill", ink).text("VS CONVENTIONAL SCWO: 374 °C+ · >3,200 PSI · PRESSURE VESSELS — HCSP RUNS UNPRESSURIZED");
  CH.halo(c1);
  const c2 = cmp.append("text").attr("x", 66).attr("y", H - 52)
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkLo).text("DISTILL FIRST → SALTS STAY IN THE STILL · UNPRESSURIZED → NO SUPERCRITICAL CORROSION");
  CH.halo(c2);
  CH.drill(cmp, () => ({
    title: "WHY ATMOSPHERIC PRESSURE MATTERS", value: "The two big SCWO problems, avoided",
    sub: "Salt precipitation: SCWO cannot hold dissolved inorganic salts, so they scale and plug the pipes; HCSP distills the water out first, so salt management is simple. Supercritical corrosion: SCWO's aggressive environment destroys titanium and nickel-alloy pipes; an unpressurized system can use standard refractory linings or high-temperature stainless steel. (Owner-provided process description, Process Step.docx.)",
    source: CH.srcLink(["K207", "K20", "K57"]),
  }));
  cmp.attr("data-drill-keep", "");

  CH.enter(host, () => {
    stageEls.forEach((g, i) => g.transition().delay(300 + i * 380).duration(350).style("opacity", 1));
  });
  if (CH.REDUCE) stageEls.forEach(g => g.style("opacity", 1));

  // ── walkthrough + modal table registration ──
  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.walk["mechanism-chart"] = {
    title: "The four stages, in plain language",
    steps: [
      { el: stageEls[0], label: "Stage 1 · Feed in",
        cap: "Concentrated waste arrives and is metered in at ordinary atmospheric pressure — no pressure pumps, no pressure vessels anywhere in the plant." },
      { el: stageEls[1], label: "Stage 2 · Distill (self-fueling H₂ heat)",
        cap: "The feed is boiled: the water leaves as steam and the heavy contaminants stay behind. Per the manufacturer the heat comes from combusting hydrogen generated on demand from the process water itself — so grid power covers only startup and auxiliary draw." },
      { el: stageEls[2], label: "Stage 3 · Oxidize",
        cap: "The concentrated residues and gases that stayed behind are burned at high temperature in a dry environment — a thermal oxidizer, not a pressurized reactor." },
      { el: stageEls[3], label: "Stage 4 · Condense",
        cap: "The steam is condensed back into distilled-quality water (85–95% recovery); a small contained solid residue and usable heat are the other outputs — nothing but water vapor vents, so no air permit is needed." },
    ],
  };
  CXT.table["mechanism-chart"] = {
    cols: ["Stage", "Name", "What it does", "Detail"],
    rows: stages.map(s => [String(s.n), s.name, s.lines.join(" · "), s.sub]),
  };
})();

/* ────────────────────────────────────────────────────────────
   7 · The reachable market in dollars — clean $B range bars per
   industry (big labels, no icon grid) + a sortable DOM table
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("sizing-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The reachable market in dollars: core pools by industry",
    sub: "$B MARKET SIZE · EACH BAR IS THE DOCUMENTED LOW–HIGH RANGE · BASES DIFFER PER INDUSTRY (ONE-TIME POOL VS PER-YEAR — SEE BASIS) · MANUFACTURER COST INPUTS PENDING — ADDRESSABLE-SAVINGS BASIS · CLICK A BAR",
    src: "Research compilation — report Ch. 8.1 total market / reachable market consolidation (2026-09); per-industry assumptions in drill-downs",
  });
  body.insertBefore(CH.plainLine("What this shows: each core industry's reachable market in dollars, drawn as its documented low–high range. The bases differ — some pools are one-time equipment, others per-year; the basis note under each name says which. A model estimate, not a forecast — manufacturer cost inputs are still pending."), body.firstChild);
  const ink = "#051c2c", inkMd = "#42566a", blue = "#2251ff", blueLo = "#b9c9ff";
  const W = 880, rowH = 72, padT = 40, H = padT + rowH * RPT.sizing.length + 84;
  const mL = 236, mR = 132;
  const svg = CH.svg(body, W, H);
  const xMax = 4.4;
  const X = v => mL + (v / xMax) * (W - mL - mR);
  const modTxt = d => d.mod_lo === d.mod_hi
    ? `≈${d.mod_lo.toLocaleString("en-US")} MODULE-EQUIV.`
    : `${d.mod_lo.toLocaleString("en-US")}–${d.mod_hi.toLocaleString("en-US")} MODULE-EQUIV.`;

  // ── axis: dollar gridlines + tick labels ──
  const ax = svg.append("g");
  [0, 1, 2, 3, 4].forEach(v => {
    ax.append("line").attr("x1", X(v)).attr("x2", X(v)).attr("y1", padT - 6).attr("y2", H - 84)
      .attr("stroke", v === 0 ? ink : "#dbe2ea").attr("stroke-width", v === 0 ? 1.4 : 1);
    const t = ax.append("text").attr("x", X(v)).attr("y", padT - 12).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("fill", inkMd).text(v === 0 ? "$0" : "$" + v + "B");
    CH.halo(t);
  });

  // ── one range bar per industry ──
  RPT.sizing.forEach((d, ri) => {
    const y = padT + ri * rowH + 18, bh = 26;
    const g = svg.append("g");
    const nm = g.append("text").attr("x", mL - 14).attr("y", y + 4).attr("text-anchor", "end")
      .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 12.5).attr("fill", ink);
    CH.wrap2(nm, d.name, 26);
    const bs = g.append("text").attr("x", mL - 14).attr("y", y + 38).attr("text-anchor", "end")
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkMd).text(d.basis_tag || d.basis.toUpperCase());
    CH.halo(bs);
    // full low→high range (light) with the low case solid — solid fills only
    g.append("rect").attr("x", X(0)).attr("y", y).attr("width", Math.max(3, X(d.sam_hi) - X(0))).attr("height", bh)
      .attr("fill", blueLo).attr("stroke", blue).attr("stroke-width", 1).attr("rx", 2);
    g.append("rect").attr("x", X(0)).attr("y", y).attr("width", Math.max(3, X(d.sam_lo) - X(0))).attr("height", bh)
      .attr("fill", blue).attr("rx", 2);
    // range caps
    [d.sam_lo, d.sam_hi].forEach(v => g.append("line")
      .attr("x1", X(v)).attr("x2", X(v)).attr("y1", y - 3).attr("y2", y + bh + 3)
      .attr("stroke", ink).attr("stroke-width", 1.6));
    // big dollar label at the bar end
    const lab = g.append("text").attr("x", X(d.sam_hi) + 10).attr("y", y + bh / 2 + 5)
      .attr("font-family", CH.MONO).attr("font-size", 13).attr("font-weight", 700).attr("fill", ink).text(d.sam_lab);
    CH.halo(lab);
    const md = g.append("text").attr("x", X(d.sam_hi) + 10).attr("y", y + bh / 2 + 19)
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkMd).text(modTxt(d));
    CH.halo(md);
    CH.drill(g, () => ({
      title: d.name.toUpperCase(),
      value: d.sam,
      sub: "Reachable market: " + d.sam + ". Total market: " + d.tam + ". Basis: " + d.basis + ". Machine-equivalents: " + modTxt(d).toLowerCase() + ". " + d.note + ".",
      source: CH.srcLink(d.src),
    }));
    g.attr("data-drill-keep", "");
  });
  // no entrance transition: bars render in final state (robust on slow/software-GL
  // machines where rAF-driven transitions can lag)

  // consolidated note
  const nt = svg.append("text").attr("x", mL).attr("y", H - 46)
    .attr("font-family", CH.MONO).attr("font-size", 10).attr("fill", ink).attr("font-weight", 700)
    .text("CONSOLIDATED REACHABLE DEMAND ≈ $9–20B PER YEAR · 15 INDUSTRIES");
  CH.halo(nt);
  const nt2 = svg.append("text").attr("x", mL).attr("y", H - 30)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkMd)
    .text("PLUS DISTILLERY $2–5B · FACTORY FARMS $1–3B · ISLANDS $0.5–1.5B (ESTIMATE)");
  CH.halo(nt2);
  CH.drill(nt, () => ({
    title: "CONSOLIDATED REACHABLE MARKET", value: "~$9–20B /yr",
    sub: RPT.market_meta.sam_note + " " + RPT.market_meta.scwo_note,
    source: CH.srcLink(["K53", "K8", "K64"]),
  }));
  nt.attr("data-drill-keep", "");

  // ── sortable DOM table alternative (auto-sorted by the shared table layer) ──
  const wrap = document.createElement("div");
  wrap.className = "table-scroll";
  wrap.style.marginTop = "14px";
  wrap.innerHTML = `<table class="dt" id="sizing-table">
    <thead><tr><th>Industry</th><th>Market size $B</th><th>Machine-equivalents</th><th>Basis</th></tr></thead>
    <tbody>${RPT.sizing.map((d, i) => `<tr data-r="${i}">
      <td><b>${d.name}</b></td><td class="num">${d.sam}</td>
      <td class="num">${d.mod_lo === d.mod_hi ? "≈" + d.mod_lo.toLocaleString("en-US") : d.mod_lo.toLocaleString("en-US") + "–" + d.mod_hi.toLocaleString("en-US")}</td>
      <td>${d.basis} · ${d.note}</td></tr>`).join("")}</tbody></table>`;
  body.appendChild(wrap);
  wrap.querySelectorAll("tr[data-r]").forEach(tr => {
    const d = RPT.sizing[+tr.dataset.r];
    tr.style.cursor = "pointer";
    tr.setAttribute("data-drill-keep", "");
    const dates = d.src.map(id => { const s = window.K && K(id); return s ? s.date : ""; }).filter(Boolean).join(", ");
    tr.onclick = e => {
      e.stopPropagation();
      U.showDrill({
        title: d.name.toUpperCase(), value: d.sam,
        sub: "Total market: " + d.tam + ". Basis: " + d.basis + ". " + d.note + ".",
        source: CH.srcLink(d.src) + (dates ? " · dated " + dates : ""), x: e.clientX, y: e.clientY,
      });
    };
  });

  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.table["sizing-chart"] = {
    cols: ["Industry", "Market size $B", "Machine-equivalents", "Basis"],
    rows: RPT.sizing.map(d => [d.name, d.sam,
      d.mod_lo === d.mod_hi ? "≈" + d.mod_lo.toLocaleString("en-US") : d.mod_lo.toLocaleString("en-US") + "–" + d.mod_hi.toLocaleString("en-US"),
      d.basis + " · " + d.note]),
  };
})();
