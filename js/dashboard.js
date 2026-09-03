// ═══ Persistent right-rail dashboard (P14) — scroll-synced section context ═══
(function () {
  const rail = document.getElementById("dash-rail");
  const canvas = document.getElementById("dash-canvas");
  if (!rail || !canvas) return;
  const PAL = U.PAL;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const view = U.bindCanvas(canvas);
  let W = 0, H = 0, cur = "exec", shown = false, t0 = null, raf = 0;
  const hits = [];

  const SECTIONS = [
    { id: "exec", no: "§0", name: "Key findings" },
    { id: "concepts", no: "§1", name: "Three facts" },
    { id: "mech", no: "§2", name: "The machine" },
    { id: "state", no: "§3", name: "The economics" },
    { id: "scale", no: "§3B", name: "Scale & energy" },
    { id: "players", no: "§4", name: "The field" },
    { id: "verdict", no: "§5", name: "The verdict" },
    { id: "appendix", no: "§7", name: "Appendix" },
    { id: "funding", no: "§8", name: "Funding landscape" },
    { id: "register", no: "§9", name: "Grant register" },
    { id: "pursuits", no: "§10", name: "Top-15 pursuits" },
  ];
  // countdown to the next hard funding deadline (compiled 2026-09; computed live)
  const NEXT_D = [["2026-09-29T16:00:00-06:00", "DWPR proposals due (Sep 29, 4pm MT)"], ["2026-09-30T23:59:00-04:00", "ONR BAA N0001425SB001 closes"], ["2026-11-02T23:59:00-05:00", "NC DEQ rolling window closes"], ["2027-03-15T23:59:00-04:00", "ESTCP FY28 pre-proposals (~Mar 2027)"]]
    .map(([iso, lab]) => ({ t: new Date(iso).getTime(), lab })).find(d => d.t > Date.now());
  const COUNTDOWN = NEXT_D ? Math.ceil((NEXT_D.t - Date.now()) / 864e5) + " DAYS" : "IN FLIGHT";
  const STATS = {
    exec: [
      { v: "8.0 /10", k: "Top score — PFAS destruction & leachate (15 industries)", d: { title: "TOP OF THE LEAGUE", value: "8.0/10", sub: "Regulation-protected destruction demand vs. $1–28/gal relocation incumbents; 99.9993% federally validated DRE. v2 extends the ranking from ten industries to fifteen.", source: CH.srcStr(["K8", "K2"]) } },
      { v: "$9–20B", k: "Consolidated serviceable demand /yr (v2)", d: { title: "CONSOLIDATED SAM (V2)", value: "~$9–20B/yr", sub: "v1 verticals plus distillery $2–5B, CAFO $1–3B, islands $0.5–1.5B, mining $0.3–0.8B — with produced water sized to the Marcellus-hub niche. Overlap pushes the true pool toward the lower half.", source: CH.srcStr(["K53", "K64"]) } },
      { v: "7.0 /10", k: "Distillery vinasse — the standout v2 entrant", d: { title: "V2 ENTRANT", value: "7.0/10 · Tier 2", sub: "100–160 g/L COD autothermal feed plus a CPCB ZLD mandate on ~270 Indian molasses distilleries — the wedge that exports power instead of importing it.", source: CH.srcStr(["K61", "K62"]) } },
      { v: "$215,037", k: "Listed leader FY2025 revenue (vs $21.0M loss)", d: { title: "FIRST-MOVER FRAGILITY", value: "$215,037 vs −$21.0M", sub: "374Water FY2025 10-K: $3.2M cash, ~$49.9M accumulated deficit, going-concern language.", source: CH.srcStr(["K52"]) } },
    ],
    concepts: [
      { v: "≥120–150", k: "g/L COD — the autothermal threshold", d: { title: "AUTOTHERMAL THRESHOLD", value: "~120–150 g/L COD", sub: "≥2 MJ/kg feed energy; below it, SCWO is an energy sink. Practical point near ~30 g/L with heat integration.", source: CH.srcStr(["K58", "K59"]) } },
      { v: "24", k: "Permitted US RCRA combustors, 88–92% utilized", d: { title: "THE PERMITTING WALL", value: "24 combustors", sub: "One new unit permitted in three decades; 5–7%/yr price escalation.", source: CH.srcStr(["K34"]) } },
      { v: "Self-fueling", k: "H₂ loop: fuel on demand from process water, negligible net energy", d: { title: "SELF-FUELING H₂ LOOP", value: "Negligible net energy", sub: "Per the manufacturer briefing: on-demand electrolysis of process water → clean H₂/O₂ combustion → SCWO heat. Negligible net energy cost once started; a working prototype exists.", source: CH.srcStr(["K1"]) } },
      { v: "Prototype", k: "Working prototype exists (manufacturer briefing)", d: { title: "TECHNOLOGY READINESS", value: "Working prototype", sub: "Per the manufacturer briefing, a working prototype of the self-fueling HCSP exists; peer SCWO hardware operates commercially at AirSCWO and SuperOx installations. Publishing prototype energy-balance data is the cheapest de-risking step.", source: CH.srcStr(["K1", "K19"]) } },
    ],
    mech: [
      { v: "374 °C", k: "Critical point of water (with 22.1 MPa)", d: { title: "CRITICAL POINT", value: "374 °C · 22.1 MPa", sub: "Above it, organics and oxygen are fully miscible and oxidize completely in seconds to minutes.", source: CH.srcStr(["K1"]) } },
      { v: "99.9993%", k: "PFAS destruction & removal, USACE ERDC", d: { title: "VALIDATED DESTRUCTION", value: "99.9993% DRE", sub: "AirSCWO 6 on AFFF; stack fluorinated emissions 0.0005 g/hr vs 16.6 g/hr fed.", source: CH.srcStr(["K2"]) } },
      { v: "<100 mg/L", k: "Salt solubility in supercritical water", d: { title: "THE MATERIALS CONSTRAINT", value: "salts precipitate", sub: "Plugging, heat-transfer loss, under-deposit corrosion — the documented failure mode of conventional SCWO designs. HCSP's answer: >3,000 °F (≈1,650 °C) in-reactor hydrogen combustion prevents salt deposition by design; the manufacturer reports no salt issues, consistent with in-reactor hydrothermal-flame research. Residual item: published prototype long-run data on salty feeds.", source: CH.srcStr(["K20", "K1"]) } },
      { v: "85–95%", k: "Water recovery to distillate (<10 µS/cm)", d: { title: "DISTILLED OUTPUT", value: "85–95%", sub: "Qualifies as high-purity reuse water — a byproduct credit, never the product.", source: CH.srcStr(["K1"]) } },
    ],
    state: [
      { v: "$15–50+", k: "Top of the savings ladder: halogenated solvents $/gal (mfr pricing TBD)", d: { title: "THE SAVINGS LENS", value: "$15–50+/gal incumbents vs HCSP cost TBD", sub: "v3 addendum: verticals re-ranked by incumbent remediation cost per gallon — the gross addressable savings pool. HCSP is self-fueling once started (negligible net energy per manufacturer), but no cost model is published, so no $/gal is attached to HCSP — hazmat #1, AFFF #2, PFAS top-3 under both lenses; distillery/textiles demoted (regulation + energy plays). Margin × volume = pool; manufacturer cost inputs pending.", source: CH.srcStr(["K150", "K33", "K22"]) } },
      { v: "5×", k: "Grid-price spread: $10.8 (MEA) vs $55.7 (Germany) /m³-equiv", d: { title: "THE GRID-PRICE SPREAD", value: "$10.8–55.7/m³-equiv", sub: "Context, not an operating-cost floor — HCSP operating energy is negligible per the manufacturer (self-fueling loop). The spread prices startup/auxiliary draw and the value of exported kWh; EU export value is contingent on the heat-integrated variant.", source: CH.srcStr(["K25", "K29"]) } },
      { v: "$3.5", k: "Recovered-water value per m³ (US avg)", d: { title: "WATER VALUE", value: "≈$3.53/m³", sub: "US average commercial water + sewer tariffs (EPA WaterSense 2024 data).", source: CH.srcStr(["K31"]) } },
      { v: "PENDING", k: "Net payback — halogenated solvents (gross savings basis)", d: { title: "NET PAYBACK PENDING", value: "TBD — mfr cost model", sub: "Gross addressable savings basis: the displaced baseline is $5–20/gal hauled and incinerated, to $50+/gal for special wastes. Net payback cannot be stated until the manufacturer publishes a cost model.", source: CH.srcStr(["K33"]) } },
      { v: "~1,800+", k: "Skid-equivalents of consolidated SAM (low case)", d: { title: "THE MARKET IN MACHINES", value: "1,800–3,200 skids", sub: "Pharma ~1,050; textile 500–1,500; PFAS 200–500; hazmat 40–150; refinery ~41.", source: CH.srcStr(["K53"]) } },
    ],
    players: [
      { v: "4", k: "Verifiable commercial SCWO operators today", d: { title: "THE OPERATING FIELD", value: "4 organizations", sub: "374Water, General Atomics PERSES, Aquarden, Revive Environmental.", source: CH.srcStr(["K52", "K17", "K19", "K16"]) } },
      { v: "~6", k: "Commercial SCWO plants worldwide (2021)", d: { title: "THE GRAVEYARD", value: "~6 plants", sub: "A 2019 review found all commercially constructed plants except two had closed — corrosion, plugging, economics.", source: CH.srcStr(["K49"]) } },
      { v: ">6M gal", k: "Destroyed by GA PERSES across ~200 waste types", d: { title: "THE INCUMBENT", value: ">6M gal · >99.99%", sub: "Commercial since ~2012; EPA-verified; Tooele unit sidelined on reliability.", source: CH.srcStr(["K17"]) } },
      { v: "$5.2M", k: "OC San AirSCWO-6 contract (in $7.9M project)", d: { title: "THE MARKET REFERENCE", value: "$5,207,595", sub: "The only verifiable commercial SCWO transaction of this class — the market reference point while HCSP module pricing is TBD pending the manufacturer cost model.", source: CH.srcStr(["K18"]) } },
    ],
    verdict: [
      { v: "OCT 2026", k: "Statutory AFFF transition deadline", d: { title: "AFFF DEADLINE", value: "2026-10-01", sub: "~1,000 facilities, >6,000 mobile assets, >$2.1B initial cost — foam and rinsate destruction demand.", source: CH.srcStr(["K14", "K15"]) } },
      { v: "2026–28", k: "Landfill ELG rulemaking window", d: { title: "THE PENDING CATALYST", value: "ELG 2026–28", sub: "Finalization converts ~2,600 MSW landfills from optional to mandatory buyers of leachate PFAS treatment.", source: CH.srcStr(["K7"]) } },
      { v: "2031", k: "PFOA/PFOS MCL compliance deadline", d: { title: "MCL COMPLIANCE", value: "2031", sub: "Extended from 2029; all six MCLs legally in effect meanwhile after the D.C. Circuit's January 2026 denial.", source: CH.srcStr(["K5"]) } },
      { v: "3", k: "Falsification lines that would flip the verdict", d: { title: "FALSIFICATION", value: "3 tripwires", sub: "Third-party long-run salt data refutes the manufacturer's no-deposition combustion design; CERCLA/MCLs vacated; an incinerator build-out that kills the umbrella.", source: CH.srcStr(["K20", "K5", "K34"]) } },
    ],
    scale: [
      { v: "35–88", k: "kWh/m³ net energy at hub scale (dilute feed)", d: { title: "THE LADDER'S BOTTOM RUNG", value: "35–88 kWh/m³", sub: "At 1,900 m³/day the module's 130–250 kWh/m³ collapses — but only on interpolated design economics; nothing above 306 t/d has ever operated.", source: CH.srcStr(["K70", "K76"]) } },
      { v: "~35–40", k: "g/L COD — the net-zero crossover", d: { title: "ENERGY CROSSOVER", value: "net-zero ~35–40 g/L", sub: "LANL model: net electricity falls from +18 kWhₑ/m³ imported to −60 exported at 150 g/L COD with a Rankine bottoming cycle.", source: CH.srcStr(["K73"]) } },
      { v: "9.6 MW", k: "Exportable heat at 1,000 m³/d @ 100 g/L", d: { title: "TRIGENERATION SURPLUS", value: "9.6 MW_th (6.4–11.2)", sub: "60% of gross reaction heat is spoken for by preheat; the surplus cascades to 1.4 MWₑ power + 4.9 MW_c cooling ≈ $1.15M/yr.", source: CH.srcStr(["K80", "K83"]) } },
      { v: "LFP", k: "Default standby battery on every unit", d: { title: "STORAGE VERDICT", value: "LFP default", sub: "NiFe's 20–30%/month self-discharge is disqualifying for standby; LFP packs at $70/kWh win every governing row.", source: CH.srcStr(["K87", "K88"]) } },
    ],
    appendix: [
      { v: "9", k: "Variants on one reactor platform (v2 adds VIN/TRI/ISL)", d: { title: "VARIANT PORTFOLIO", value: "9 variants", sub: "HCSP-PFAS/RX/FAB/HAZ/BIO/AG plus v2's VIN (vinasse ZLD), TRI (trigeneration) and ISL (island micro-utility). Six of nine depend on a pre-module concentrator — the front end does the economic heavy lifting.", source: CH.srcStr(["K53", "K61", "K84"]) } },
      { v: "11", k: "Risks that govern the investment case", d: { title: "RISK REGISTER", value: "11 risks", sub: "v2 adds scale-up beyond the 306 t/d envelope and NiFe supply-chain sole-sourcing; v3 adds independent documentation of the self-fueling energy balance (publish prototype data). Asymmetric in kind: demand-side risks compress the market; scale-up and supply-chain risks can invalidate the unit itself. Salt/corrosion — the historical killer of conventional designs — is answered by HCSP's >3,000 °F in-reactor combustion (manufacturer); publishing prototype data is the residual.", source: CH.srcStr(["K20", "K96", "K1"]) } },
      { v: "0.6 mm/yr", k: "Inconel 625 corrosion at 600 °C/25 MPa", d: { title: "THE METALLURGY ANSWER", value: "0.6 mm/yr", sub: "On real pesticide wastewater with 99.42% COD removal — 25–40× better than the Hastelloy failure case.", source: CH.srcStr(["K57"]) } },
      { v: "K1–K150", k: "Dated source anchors behind every number", d: { title: "SOURCE DISCIPLINE", value: "145 anchors", sub: "Four classes, each dated: company primary, industry & official, broker relay, research compilation [derived]. v2 adds 39 anchors for the scale, crossover, trigeneration, and storage chapters; Part III adds 45 funding anchors; v3 adds the cost-savings-lens addendum anchor.", source: "This site's Sources section" } },
    ],
    funding: [
      { v: "$37.33B", k: "Known addressable pools across the 80-program register", d: { title: "KNOWN POOLS", value: "$37.33B", sub: "Sum of disclosed award pools — grants, forgivable SRF tranches, WIFIA credit capacity, settlement funds — across the register. Not exhaustive.", source: CH.srcStr(["K149"]) } },
      { v: "−$11.3B", k: "DOE demonstration awards terminated in 2025", d: { title: "CONTRACTING SIDE", value: "~$11.3B terminated", sub: "OCED abolished Nov 2025 after the May (~$3.7B) and October (~$7.56B) termination waves; no successor office. Plus 781 EPA EJ grants rescinded under OBBBA.", source: CH.srcStr(["K106", "K105"]) } },
      { v: "$12.75B+", k: "PFAS settlement funds in flight to water systems", d: { title: "EXPANDING SIDE", value: "$12.75B+ settlements", sub: "3M $10.5–12.5B (>$3.5B paid, installments to 2033–36) + DuPont/Chemours/Corteva $1.185B + Tyco $750M + BASF $316.5M. No vendor list exists — sell downstream of the checks.", source: CH.srcStr(["K111"]) } },
      { v: "$795M", k: "NJ PFAS Abatement Fund, court-approved 2026-08-07", d: { title: "NEWEST POOL", value: "$795M · ≥$150M to POTWs", sub: "Routed through the NJ Water Bank; program design forming now — engage NJDEP while pipelines form.", source: CH.srcStr(["K112"]) } },
    ],
    register: [
      { v: "80", k: "Programs screened — dead ones kept on record", d: { title: "THE REGISTER", value: "80 programs", sub: "57 active, 2 with open deadlines, 17 on watch, 1 paused, 3 dead. Filter and sort the full table in §9.", source: CH.srcStr(["K149"]) } },
      { v: "40/35/25", k: "Pursuit-effort split across the three access modes", d: { title: "ACCESS ARCHITECTURE", value: "40/35/25", sub: "~90% of relevant dollars flow to utilities and public systems: 40% named-technology-in-partner-application, 35% direct-apply, 25% vendor-to-prime. The direct applications generate credibility; the partnerships generate dollars.", source: CH.srcStr(["K114", "K133"]) } },
      { v: "8 / 15", k: "Top-15 pursuits that are direct-apply — all 5 largest pools are partner-mediated", d: { title: "THE BARBELL", value: "8 direct · 7 partner", sub: "Rows 1–4 are sub-$1M credibility plays; rows 6, 9, 10, 12 are large-dollar, long-cycle infrastructure plays. Almost nothing worth pursuing in the middle.", source: CH.srcStr(["K149"]) } },
      { v: "0.8→5", k: "$M — the Orlando conversion: grant → license → hub", d: { title: "THE ORLANDO TEMPLATE", value: "$0.8M → $3–5M", sub: "CWSRF-BIL grant (Feb 2024) → 5-yr waste-destruction license (Mar 2026) → full-scale PFAS hub (Jun 2026). One anchor utility per state program, then replicate.", source: CH.srcStr(["K114", "K115"]) } },
    ],
    pursuits: [
      { v: COUNTDOWN, k: NEXT_D ? "To " + NEXT_D.lab : "All 2026 hard deadlines have passed — Q1 2027 cycle in flight", d: { title: "NEXT HARD DEADLINE", value: COUNTDOWN, sub: NEXT_D ? NEXT_D.lab + ". Missing a clustered deadline costs a full annual cycle." : "The calendar rolls to ESTCP FY28 pre-proposals (~Mar 2027) and the Q2 2027 state entries.", source: CH.srcStr(["K116", "K117"]) } },
      { v: "$5.7M", k: "DWPR FY2026 NOFO — the best-matched direct federal grant", d: { title: "PURSUIT #1", value: "≤$800K pilot of $5.7M", sub: "For-profits apply directly; produced water and municipal wastewater are named source waters. Due Sep 29 2026, 4:00 pm MT.", source: CH.srcStr(["K116"]) } },
      { v: "$185.9M", k: "SERDP + ESTCP FY2027 budgets, fully funded", d: { title: "PURSUIT #3", value: "$60.8M + $125.1M", sub: "FY28 solicitations expected Oct–Nov 2026 (SERDP) and ~Dec 2026 with Mar 2027 pre-proposals (ESTCP). SCWO precedents ER20-5350 and ER23-7939. Line up a DoD installation host in Q4.", source: CH.srcStr(["K118", "K119"]) } },
      { v: "$500K–5M", k: "Elemental DCII per project — flagship private fit, rolling through 2027", d: { title: "PURSUIT #11", value: "$500K–$5M · ≤10 startups", sub: "Philanthropy-funded catalytic investment with Amazon/Google/Meta/Microsoft as collaborators — the water+cooling+power story. Structured as investment, not a pure grant.", source: CH.srcStr(["K131"]) } },
    ],
  };

  function fit() { const v = view.fit(); W = v.w; H = v.h; }

  function drawStatic() {
    fit();
    const ctx = view.ctx;
    ctx.clearRect(0, 0, W, H);
    hits.length = 0;
    const sec = SECTIONS.find(s => s.id === cur) || SECTIONS[0];
    const L = 46, Rw = W - L - 40;

    // window badge + title
    ctx.font = '700 10px Menlo, Consolas, monospace';
    ctx.fillStyle = PAL.red;
    ctx.fillText("HCSP · CROSS-INDUSTRY VALUE", L, 52);
    ctx.fillStyle = PAL.inkLo;
    ctx.fillText("COMPILED 2026-09", L, 68);
    ctx.font = '700 26px "et-book", Palatino, Georgia, serif';
    ctx.fillStyle = PAL.ink;
    ctx.fillText(sec.no + " · " + sec.name, L, 104);

    // phase bar
    const bw = Rw / SECTIONS.length;
    SECTIONS.forEach((s, i) => {
      const x0 = L + i * bw;
      ctx.fillStyle = s.id === cur ? PAL.red : PAL.line;
      ctx.fillRect(x0 + 1, 122, bw - 3, s.id === cur ? 5 : 3);
      ctx.font = '8px Menlo, Consolas, monospace';
      ctx.fillStyle = s.id === cur ? PAL.red : PAL.inkLo;
      ctx.fillText(s.no, x0 + 2, 140);
    });

    // mini league table (15 industries, v2)
    let y = 168;
    ctx.font = '700 9px Menlo, Consolas, monospace';
    ctx.fillStyle = PAL.inkLo;
    ctx.fillText("THE LEAGUE TABLE · 15 INDUSTRIES · SCORE /10", L, y);
    y += 14;
    const tierCol = { 1: PAL.red, 2: PAL.redHi, 3: PAL.inkMd, 4: PAL.inkLo };
    RPT.league.forEach((d, i) => {
      const by = y + i * 19;
      const bwMax = Rw * 0.52, bwV = (d.score / 10) * bwMax;
      ctx.font = '9px Menlo, Consolas, monospace';
      ctx.fillStyle = PAL.inkMd;
      const nm = d.name.toUpperCase();
      ctx.fillText(nm.length > 26 ? nm.slice(0, 25) + "…" : nm, L, by + 8);
      ctx.fillStyle = tierCol[d.tier];
      ctx.fillRect(L + Rw - bwMax - 34, by, bwV, 9);
      ctx.font = '700 9.5px Menlo, Consolas, monospace';
      ctx.fillStyle = tierCol[d.tier];
      ctx.fillText(String(d.score), L + Rw - 28, by + 8);
      hits.push({ x0: L + Rw - bwMax - 34, y0: by - 4, x1: L + Rw, y1: by + 13, d: {
        title: `RANK ${d.rank} · ${nm.slice(0, 34)}`, value: d.score + " / 10", sub: d.why, source: CH.srcStr(d.src) } });
    });
    y += RPT.league.length * 19 + 22;

    // stat blocks (2×2)
    ctx.font = '700 9px Menlo, Consolas, monospace';
    ctx.fillStyle = PAL.inkLo;
    ctx.fillText("THIS SECTION · KEY READOUTS", L, y);
    y += 12;
    const stats = STATS[cur] || [];
    stats.forEach((s, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const sx = L + col * (Rw / 2), sy = y + row * 74;
      ctx.strokeStyle = PAL.lineLo; ctx.lineWidth = 1;
      ctx.strokeRect(sx, sy, Rw / 2 - 10, 64);
      ctx.font = '700 17px Menlo, Consolas, monospace';
      ctx.fillStyle = PAL.red;
      ctx.fillText(s.v, sx + 10, sy + 26);
      ctx.font = '9.5px Menlo, Consolas, monospace';
      ctx.fillStyle = PAL.inkMd;
      wrapText(ctx, s.k.toUpperCase(), sx + 10, sy + 42, Rw / 2 - 30, 11);
      hits.push({ x0: sx, y0: sy, x1: sx + Rw / 2 - 10, y1: sy + 64, d: s.d });
    });
    y += Math.ceil(stats.length / 2) * 74 + 20;

    // footer
    ctx.font = '8.5px Menlo, Consolas, monospace';
    ctx.fillStyle = PAL.inkLo;
    ctx.fillText("CLICK ANY READOUT → DRILL-DOWN WITH DATED SOURCE", L, Math.min(y + 8, H - 20));
  }

  function wrapText(ctx, text, x0, y0, maxW, lh) {
    const words = text.split(" "); let line = "", yy = y0;
    for (const w of words) {
      if (ctx.measureText(line + " " + w).width > maxW && line) { ctx.fillText(line, x0, yy); yy += lh; line = w; }
      else line = line ? line + " " + w : w;
    }
    if (line) ctx.fillText(line, x0, yy);
  }

  function draw(ts) {
    drawStatic();
    if (!REDUCE && shown) raf = requestAnimationFrame(draw); // cheap: static content, but keeps entrance subtle
    else cancelAnimationFrame(raf);
  }

  // entrance pulse: one fade-in is enough — draw once, then stop (content is static)
  function render() { cancelAnimationFrame(raf); drawStatic(); }

  canvas.addEventListener("click", e => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const hit = hits.find(h => mx >= h.x0 && mx <= h.x1 && my >= h.y0 && my <= h.y1);
    if (hit) U.showDrill({ ...hit.d, x: e.clientX, y: e.clientY });
  });

  window.DASH = {
    setSection(id) { if (id !== cur && STATS[id]) { cur = id; if (shown) render(); } },
    show(on) {
      if (on === shown) return;
      shown = on;
      rail.classList.toggle("on", on);
      if (on) requestAnimationFrame(() => requestAnimationFrame(render)); // refit after slide-in
    },
    refresh: render,
  };
  addEventListener("resize", () => { if (shown) render(); });
})();
