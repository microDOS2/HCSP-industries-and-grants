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
   7 · The reachable market in dollars — one sizing dataset, three
   switchable views: light 3D bars (Three.js, built lazily on first
   use), a bubble chart (D3, the default — cheapest to render), and
   the sortable DOM table. Choice remembered per session.
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("sizing-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The reachable market in dollars",
    sub: "EACH INDUSTRY'S DOCUMENTED LOW–HIGH RANGE · BASES DIFFER PER INDUSTRY (ONE-TIME POOL VS PER-YEAR — SEE BASIS) · MANUFACTURER COST INPUTS PENDING — ADDRESSABLE-SAVINGS BASIS · EVERY VIEW CLICKABLE FOR DETAIL + DATED SOURCES",
    src: "Research compilation — report Ch. 8.1 total market / reachable market consolidation (2026-09); per-industry assumptions in drill-downs",
  });
  body.appendChild(CH.plainLine("What this shows: each core industry's reachable market in dollars, drawn as its documented low–high range. The bases differ — some pools are one-time equipment, others per-year; the basis note says which. Toggle between 3D bars and bubbles, or open the table — the figures are identical in every view. A model estimate, not a forecast — manufacturer cost inputs are still pending."));

  const ink = "#051c2c", inkMd = "#42566a", blue = "#2251ff", blueLo = "#b9c9ff";
  const modTxt = d => d.mod_lo === d.mod_hi
    ? `≈${d.mod_lo.toLocaleString("en-US")} MODULE-EQUIV.`
    : `${d.mod_lo.toLocaleString("en-US")}–${d.mod_hi.toLocaleString("en-US")} MODULE-EQUIV.`;
  const datesOf = d => d.src.map(id => { const s = window.K && K(id); return s ? s.date : ""; }).filter(Boolean).join(", ");
  function drillFor(d, extra) {
    return {
      title: d.name.toUpperCase(),
      value: d.sam,
      sub: "Reachable market: " + d.sam + ". Total market: " + d.tam + ". Basis: " + d.basis + ". Machine-equivalents: " + modTxt(d).toLowerCase() + ". " + d.note + "." + (extra ? " " + extra : ""),
      source: CH.srcLink(d.src) + (datesOf(d) ? " · dated " + datesOf(d) : ""),
    };
  }

  /* ── what existing suppliers charge to dispose of it ($/gal), per industry.
     Pulled from the canonical savings-ladder figures where the industry
     appears there; refinery residuals have no per-gallon ladder entry, so the
     cost is derived from the $/t service benchmark and flagged as derived. ── */
  const SAV_KEY = { pharma: "pharma", tex: "textile", pfas: "pfas", haz: "chem" };
  const fv = v => v < 0.1 ? v.toFixed(3) : v < 1 ? v.toFixed(2) : String(v);
  function costOf(d) {
    const k = SAV_KEY[d.key];
    if (k) {
      const s = RPT.savings_ladder.find(x => x.key === k);
      return { lo: s.lo, hi: s.hi,
        lab: "$" + fv(s.lo) + "–" + fv(s.hi) + (s.plus ? "+" : "") + "/gal",
        derived: false, src: s.src };
    }
    return { lo: 2, hi: 4,
      lab: "≈$2–4/gal-equivalent (derived)",
      derived: true, src: ["K47"],
      note: "Derived from the $500–1,000/t refinery-residual service benchmark at ~250 gal/t — not a quoted per-gallon price." };
  }

  /* ══ view toggle: 3D BARS | BUBBLES | TABLE (default bubbles — cheapest
        to render; the 3D scene is built only on first use) ══ */
  let view = "bubbles";
  try { view = sessionStorage.getItem("hcsp-sizing-view") || "bubbles"; } catch (e) {}
  if (!["3d", "bubbles", "table"].includes(view)) view = "bubbles";
  const tg = document.createElement("div");
  tg.className = "unit-toggle";
  tg.setAttribute("aria-label", "Sizing view");
  tg.innerHTML = `<span class="ut-lab">VIEW</span>
    <button type="button" data-view="3d">3D BARS</button>
    <button type="button" data-view="bubbles">BUBBLES</button>
    <button type="button" data-view="table">TABLE</button>`;
  body.appendChild(tg);

  const v3d = document.createElement("div");
  v3d.className = "sizing3d-wrap";
  v3d.setAttribute("data-drill-keep", ""); // canvas/orbit-button/label clicks are interactions, never the frame's explore-modal trigger
  const vBub = document.createElement("div");
  const vTab = document.createElement("div");
  body.append(v3d, vBub, vTab);

  /* ══ VIEW D — bubble chart (D3): x = what existing suppliers charge to
     dispose of the waste ($/gal, log), y + bubble size = reachable market
     ($B, log). Hover for the exact figures; click for the full profile
     with dated sources. ══ */
  (function buildBubbles() {
    const W = 880, H = 520, mL = 74, mR = 36, padT = 46, padB = 62;
    const svg = CH.svg(vBub, W, H);
    const x = d3.scaleLog().domain([0.004, 80]).range([mL, W - mR]);
    const y = d3.scaleLog().domain([0.05, 6]).range([H - padB, padT]);
    const r = d3.scaleSqrt().domain([0, 4]).range([9, 44]);
    const mid = (a, b) => Math.sqrt(a * b); // geometric mid on log axes

    // axes
    [0.01, 0.1, 1, 10, 50].forEach(v => {
      svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 8).attr("y2", H - padB)
        .attr("stroke", "#eef1f6");
      const t = svg.append("text").attr("x", x(v)).attr("y", H - padB + 18).attr("text-anchor", "middle")
        .attr("font-family", CH.MONO).attr("font-size", 10).attr("fill", inkMd).text("$" + fv(v));
      CH.halo(t);
    });
    [0.1, 0.3, 1, 3].forEach(v => {
      svg.append("line").attr("x1", mL).attr("x2", W - mR).attr("y1", y(v)).attr("y2", y(v))
        .attr("stroke", "#eef1f6");
      const t = svg.append("text").attr("x", mL - 10).attr("y", y(v) + 4).attr("text-anchor", "end")
        .attr("font-family", CH.MONO).attr("font-size", 10).attr("fill", inkMd).text("$" + fv(v) + "B");
      CH.halo(t);
    });
    const xc = svg.append("text").attr("x", W - mR).attr("y", H - padB + 38).attr("text-anchor", "end")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", inkMd)
      .text("WHAT EXISTING SUPPLIERS CHARGE TO DISPOSE OF IT ($/GAL · LOG)");
    CH.halo(xc);
    const yc = svg.append("text").attr("x", mL).attr("y", padT - 26).attr("text-anchor", "start")
      .attr("font-family", CH.MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", inkMd)
      .text("REACHABLE MARKET ($B · LOG) — BUBBLE SIZE = MARKET SIZE");
    CH.halo(yc);

    // hand-tuned label placement (name · $B) per industry
    const LAB = {
      haz:    { anchor: "middle", dx: 0,   dy: -62 },
      pharma: { anchor: "middle", dx: 0,   dy: 56 },
      tex:    { anchor: "start",  dx: 46,  dy: 4 },
      pfas:   { anchor: "end",    dx: -40, dy: 4 },
      ref:    { anchor: "start",  dx: 24,  dy: 4 },
    };

    RPT.sizing.forEach(d => {
      const c = costOf(d);
      const cx = x(mid(c.lo, c.hi)), cy = y(mid(d.sam_lo, d.sam_hi));
      const g = svg.append("g");
      // outer dashed ring = documented high end; solid core = documented low end
      g.append("circle").attr("cx", cx).attr("cy", cy).attr("r", r(d.sam_hi))
        .attr("fill", "rgba(34,81,255,.12)").attr("stroke", blue)
        .attr("stroke-width", 1).attr("stroke-dasharray", "4 3");
      g.append("circle").attr("cx", cx).attr("cy", cy).attr("r", Math.max(4, r(d.sam_lo)))
        .attr("fill", "rgba(34,81,255,.75)").attr("stroke", blue).attr("stroke-width", 1.2);
      const L = LAB[d.key] || { anchor: "start", dx: r(d.sam_hi) + 10, dy: 4 };
      const t1 = g.append("text").attr("x", cx + L.dx).attr("y", cy + L.dy).attr("text-anchor", L.anchor)
        .attr("font-family", CH.MONO).attr("font-size", 11).attr("font-weight", 700).attr("fill", ink)
        .text(d.name.toUpperCase());
      CH.halo(t1);
      const t2 = g.append("text").attr("x", cx + L.dx).attr("y", cy + L.dy + 14).attr("text-anchor", L.anchor)
        .attr("font-family", CH.MONO).attr("font-size", 10).attr("font-weight", 700).attr("fill", blue)
        .text(d.sam_lab.toUpperCase() + (c.derived ? " · COST DERIVED" : ""));
      CH.halo(t2);
      // hover → exact figures; click → full profile + dated sources
      g.style("cursor", "pointer").attr("data-drill-keep", "");
      g.on("mousemove", e => U.showTip(
        `<b>${d.name}</b><br>Market: ${d.sam}<br>Existing disposal cost: ${c.lab}<br>Machine-equivalents: ${modTxt(d).toLowerCase()}`,
        e.clientX, e.clientY));
      g.on("mouseleave", () => U.hideTip());
      g.on("click", e => {
        e.stopPropagation(); U.hideTip();
        const dsrc = c.src.filter(k => !d.src.includes(k));
        U.showDrill({ ...drillFor(d,
          "Existing disposal cost " + c.lab + (c.note ? " — " + c.note : "") + "."),
          source: CH.srcLink(d.src.concat(dsrc)) + (datesOf(d) ? " · dated " + datesOf(d) : ""),
          x: e.clientX, y: e.clientY });
      });
    });
  })();

  /* ══ VIEW C — light 3D bars (Three.js, vendored; built lazily on first
     use). Bar height = market size in dollars: solid segment up to the
     documented low end, translucent cap for the range to the high end.
     11 meshes total (5 bars × 2 segments + ground) ≤ 15 · DPR capped at
     1.5 · auto-orbit OFF by default with a pause/resume button · static
     single frame in reading mode · no rendering while offscreen. ══ */
  let init3d = false;
  function build3D() {
    if (init3d) return;
    init3d = true;
    v3d.innerHTML = `<canvas class="sizing3d-stage" aria-label="3D bars: market size in dollars by industry"></canvas>
      <div class="sizing3d-ui"><button type="button" id="sizing3d-orbit" aria-pressed="false">AUTO-ORBIT ▶</button></div>
      <p class="sizing3d-hint">DRAG TO ORBIT · CLICK A BAR FOR DETAIL + SOURCES</p>`;
    const canvas = v3d.querySelector("canvas");
    canvas.setAttribute("data-drill-keep", ""); // bar clicks resolve on pointerup — don't let the trailing click event hide the drill
    const READER = () => document.documentElement.classList.contains("reader");
    if (!window.THREE) {
      v3d.insertAdjacentHTML("beforeend", "<p style='padding:40px;font-family:var(--mono);font-size:13px'>The 3D library did not load — use the bubbles or table view; the figures are identical.</p>");
      return;
    }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (e) {
      v3d.insertAdjacentHTML("beforeend", "<p style='padding:40px;font-family:var(--mono);font-size:13px'>WebGL is unavailable in this browser — use the bubbles or table view; the figures are identical.</p>");
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.HCSP_DPR_CAP || 1.5, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 100);
    camera.position.set(7.2, 5.8, 10.2);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
    const sun = new THREE.DirectionalLight(0xffffff, 0.7);
    sun.position.set(6, 10, 7);
    scene.add(sun);

    const MAT_LO = new THREE.MeshStandardMaterial({ color: 0x2251ff, roughness: 0.45, metalness: 0.15 });
    const MAT_HI = new THREE.MeshStandardMaterial({ color: 0x7d9bff, roughness: 0.5, metalness: 0.1, transparent: true, opacity: 0.5 });
    const H_PER_B = 1.15; // world units per $B — honest linear scale
    const clickable = [];
    const labels = [];
    RPT.sizing.forEach((d, i) => {
      const bx = (i - (RPT.sizing.length - 1) / 2) * 2.3;
      const hLo = Math.max(0.12, d.sam_lo * H_PER_B);
      const hHi = Math.max(hLo + 0.05, d.sam_hi * H_PER_B);
      const lo = new THREE.Mesh(new THREE.BoxGeometry(1.35, hLo, 1.35), MAT_LO);
      lo.position.set(bx, hLo / 2, 0);
      const hi = new THREE.Mesh(new THREE.BoxGeometry(1.35, hHi - hLo, 1.35), MAT_HI);
      hi.position.set(bx, hLo + (hHi - hLo) / 2, 0);
      lo.userData.idx = i; hi.userData.idx = i;
      scene.add(lo); scene.add(hi);
      clickable.push(lo, hi);
      const el = document.createElement("div");
      el.className = "sizing3d-label";
      el.innerHTML = `<b>${d.name}</b><span>${d.sam_lab}</span>`;
      el.setAttribute("data-drill-keep", "");
      el.addEventListener("click", e => {
        e.stopPropagation();
        U.showDrill({ ...drillFor(d), x: e.clientX, y: e.clientY });
      });
      v3d.appendChild(el);
      labels.push({ el, v: new THREE.Vector3(bx, hHi + 0.42, 0) });
    });
    // ground shadow-catcher (visual only) — 11 meshes total
    const ground = new THREE.Mesh(new THREE.CircleGeometry(8.5, 48),
      new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.8 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02;
    scene.add(ground);

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = !READER(); controls.dampingFactor = 0.08;
    controls.autoRotate = false;                    // off by default (battery)
    controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 1.7, 0);
    controls.minDistance = 5; controls.maxDistance = 26;
    controls.maxPolarAngle = Math.PI * 0.52;

    // auto-orbit pause/resume button (off by default)
    const orbitBtn = v3d.querySelector("#sizing3d-orbit");
    let orbit = false;
    orbitBtn.addEventListener("click", () => {
      orbit = !orbit;
      controls.autoRotate = orbit && !READER();
      orbitBtn.setAttribute("aria-pressed", orbit ? "true" : "false");
      orbitBtn.classList.toggle("on", orbit);
      orbitBtn.textContent = orbit ? "❚❚ PAUSE ORBIT" : "AUTO-ORBIT ▶";
      dirty = true; poke();
    });

    // click (not drag) → drill with the full profile incl. machine-equivalents
    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
    let downAt = null;
    canvas.addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY]; });
    canvas.addEventListener("pointerup", e => {
      if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) { downAt = null; return; }
      downAt = null;
      const rct = canvas.getBoundingClientRect();
      ptr.x = ((e.clientX - rct.left) / rct.width) * 2 - 1;
      ptr.y = -((e.clientY - rct.top) / rct.height) * 2 + 1;
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(clickable, false)[0];
      if (hit) {
        const d = RPT.sizing[hit.object.userData.idx];
        U.showDrill({ ...drillFor(d), x: e.clientX, y: e.clientY });
      }
    });

    // QA hooks: mesh budget + world→screen projection for automated tests
    canvas._meshCount = clickable.length + 1; // 5 bars × 2 segments + ground = 11 ≤ 15
    canvas._project = function (X, Y, Z) {
      const rct = canvas.getBoundingClientRect();
      const v = new THREE.Vector3(X, Y, Z).project(camera);
      return { x: rct.left + (v.x * 0.5 + 0.5) * rct.width, y: rct.top + (-v.y * 0.5 + 0.5) * rct.height, behind: v.z > 1 };
    };

    function placeLabels() {
      const w = v3d.clientWidth, h = canvas.clientHeight || 460;
      const items = [];
      labels.forEach(L => {
        const p = L.v.clone().project(camera);
        if (p.z > 1) { L.el.style.display = "none"; return; }
        L.el.style.display = "";
        const hw = L.el.offsetWidth / 2 || 60, hh = L.el.offsetHeight || 18;
        items.push({
          L, hw, hh,
          x: U.clamp((p.x * 0.5 + 0.5) * w, hw + 4, w - hw - 4),
          y: U.clamp((-p.y * 0.5 + 0.5) * h, hh + 2, h - hh - 2),
        });
      });
      // collision pass: nudge the lower chip down until no two chips overlap
      items.sort((a, b) => a.y - b.y);
      for (let i = 1; i < items.length; i++) {
        for (let j = 0; j < i; j++) {
          const a = items[j], b = items[i];
          if (Math.abs(a.x - b.x) < a.hw + b.hw + 4 && b.y - b.hh < a.y + a.hh + 3) {
            b.y = a.y + a.hh + b.hh + 6;
          }
        }
      }
      items.forEach(it => {
        it.L.el.style.left = it.x + "px";
        it.L.el.style.top = it.y + "px";
      });
    }

    // render-on-demand loop: a frame renders only when something changed;
    // the loop itself runs only while auto-orbiting or while a drag settles —
    // never in reading mode (static frame), never while offscreen
    let dirty = true, inView = false, raf = 0, settleUntil = 0;
    function poke() { if (inView && !raf) raf = requestAnimationFrame(frame); }
    controls.addEventListener("change", () => { dirty = true; poke(); });
    controls.addEventListener("start", () => { settleUntil = Infinity; poke(); });
    controls.addEventListener("end", () => { settleUntil = performance.now() + 350; poke(); });
    function resize() {
      const w = v3d.clientWidth, h = canvas.clientHeight || 460;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      dirty = true; poke();
    }
    addEventListener("resize", resize, { passive: true });
    function frame() {
      raf = 0;
      if (!inView) return;
      if (controls.enableDamping) controls.update();
      if (controls.autoRotate) dirty = true;
      if (dirty) {
        renderer.render(scene, camera);
        placeLabels();
        (window.__HCSP3D_RENDERED = window.__HCSP3D_RENDERED || {}).sizing3d = (window.__HCSP3D_RENDERED.sizing3d || 0) + 1;
        dirty = false;
      }
      if (READER()) return; // static frame
      if (!raf && (controls.autoRotate || performance.now() < settleUntil)) raf = requestAnimationFrame(frame);
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
      inView = e.isIntersecting;
      if (inView) { dirty = true; poke(); }
    }), { threshold: 0.05 });
    io.observe(v3d);
    resize();
  }

  /* ══ VIEW T — the sortable DOM table (enhanced by the shared table layer) ══ */
  vTab.className = "table-scroll";
  vTab.style.marginTop = "14px";
  vTab.innerHTML = `<table class="dt" id="sizing-table">
    <thead><tr><th>Industry</th><th>Market size $B</th><th>Machine-equivalents</th><th>Basis</th></tr></thead>
    <tbody>${RPT.sizing.map((d, i) => `<tr data-r="${i}">
      <td><b>${d.name}</b></td><td class="num">${d.sam}</td>
      <td class="num">${d.mod_lo === d.mod_hi ? "≈" + d.mod_lo.toLocaleString("en-US") : d.mod_lo.toLocaleString("en-US") + "–" + d.mod_hi.toLocaleString("en-US")}</td>
      <td>${d.basis} · ${d.note}</td></tr>`).join("")}</tbody></table>`;
  vTab.querySelectorAll("tr[data-r]").forEach(tr => {
    const d = RPT.sizing[+tr.dataset.r];
    tr.style.cursor = "pointer";
    tr.setAttribute("data-drill-keep", "");
    tr.onclick = e => {
      e.stopPropagation();
      U.showDrill({
        title: d.name.toUpperCase(), value: d.sam,
        sub: "Total market: " + d.tam + ". Basis: " + d.basis + ". Machine-equivalents: " + modTxt(d).toLowerCase() + ". " + d.note + ".",
        source: CH.srcLink(d.src) + (datesOf(d) ? " · dated " + datesOf(d) : ""), x: e.clientX, y: e.clientY,
      });
    };
  });

  // consolidated note, shown under every view (drillable)
  const note = document.createElement("p");
  note.className = "sizing-note";
  note.setAttribute("data-drill-keep", "");
  note.innerHTML = "<b>CONSOLIDATED REACHABLE DEMAND ≈ $9–20B PER YEAR · 15 INDUSTRIES</b> — PLUS DISTILLERY $2–5B · FACTORY FARMS $1–3B · ISLANDS $0.5–1.5B (ESTIMATE)";
  note.onclick = e => {
    e.stopPropagation();
    U.showDrill({
      title: "CONSOLIDATED REACHABLE MARKET", value: "~$9–20B /yr",
      sub: RPT.market_meta.sam_note + " " + RPT.market_meta.scwo_note,
      source: CH.srcLink(["K53", "K8", "K64"]), x: e.clientX, y: e.clientY,
    });
  };
  body.appendChild(note);

  /* ── view switching ── */
  function show() {
    tg.querySelectorAll("button[data-view]").forEach(b => b.classList.toggle("on", b.dataset.view === view));
    v3d.hidden = view !== "3d";
    vBub.hidden = view !== "bubbles";
    vTab.hidden = view !== "table";
    if (view === "3d") build3D();
    try { sessionStorage.setItem("hcsp-sizing-view", view); } catch (e) {}
  }
  tg.querySelectorAll("button[data-view]").forEach(b => b.addEventListener("click", () => {
    view = b.dataset.view; show();
  }));
  show();

  window.CXT = window.CXT || { table: {}, walk: {} };
  CXT.table["sizing-chart"] = {
    cols: ["Industry", "Market size $B", "Machine-equivalents", "Basis"],
    rows: RPT.sizing.map(d => [d.name, d.sam,
      d.mod_lo === d.mod_hi ? "≈" + d.mod_lo.toLocaleString("en-US") : d.mod_lo.toLocaleString("en-US") + "–" + d.mod_hi.toLocaleString("en-US"),
      d.basis + " · " + d.note]),
  };
})();
