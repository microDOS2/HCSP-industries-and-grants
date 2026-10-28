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

  const ALL_SECTIONS = [
    { id: "exec", no: "§0", name: "Key findings" },
    { id: "concepts", no: "§1", name: "Three facts" },
    { id: "mech", no: "§2", name: "The machine" },
    { id: "state", no: "§3", name: "The economics" },
    { id: "scale", no: "§3B", name: "Scale & energy" },
    { id: "energy", no: "§3C", name: "The energy advantage" },
    { id: "players", no: "§4", name: "The field" },
    { id: "deepdive", no: "§4B", name: "The field, up close" },
    { id: "customers", no: "§4C", name: "Customers & footprint" },
    { id: "verdict", no: "§5", name: "The verdict" },
    { id: "appendix", no: "§7", name: "Appendix" },
    { id: "funding", no: "§8", name: "Funding landscape" },
    { id: "register", no: "§9", name: "Grant register" },
    { id: "pursuits", no: "§10", name: "Top-15 pursuits" },
  ];
  // Per-page rail: a page may declare window.DASH_SECTIONS before this module
  // loads to show only the sections that live on that page.
  const SECTIONS = Array.isArray(window.DASH_SECTIONS)
    ? ALL_SECTIONS.filter(s => window.DASH_SECTIONS.includes(s.id))
    : ALL_SECTIONS;
  // countdown to the next OPEN hard funding deadline (compiled 2026-09; computed live).
  // closed:true marks deadlines that passed in Sep 2026 — they are skipped regardless of clock.
  const NEXT_D = [["2026-09-29T16:00:00-06:00", "Bureau of Reclamation proposals due (Sep 29, 4pm MT)", true], ["2026-09-30T23:59:00-04:00", "Navy research call N0001425SB001 closes", true], ["2026-11-02T23:59:00-05:00", "North Carolina rolling grant window closes"], ["2026-12-15T23:59:00-05:00", "Imagine H2O 2027 applications (Nov–Dec 2026)"], ["2027-03-15T23:59:00-04:00", "Defense research FY28 pre-proposals (~Mar 2027)"]]
    .map(([iso, lab, closed]) => ({ t: new Date(iso).getTime(), lab, closed: !!closed }))
    .find(d => !d.closed && d.t > Date.now());
  const COUNTDOWN = NEXT_D ? Math.ceil((NEXT_D.t - Date.now()) / 864e5) + " DAYS" : "IN FLIGHT";
  const STATS = {
    exec: [
      { v: "8.0 /10", k: "Top score — PFAS destruction & landfill liquid (leachate) (15 industries)", d: { title: "TOP OF THE RANKING", value: "8.0/10", sub: "Regulation-protected destruction demand vs. $1–28/gal existing waste-hauling suppliers; 99.9993% of the chemical destroyed, federally validated. The ranking covers fifteen industries.", source: CH.srcLink(["K8", "K2"]) } },
      { v: "$9–20B", k: "Consolidated reachable demand /yr", d: { title: "REACHABLE MARKET, COMBINED", value: "~$9–20B/yr", sub: "The core industries plus distillery $2–5B, factory farms $1–3B, islands $0.5–1.5B, mining $0.3–0.8B — with produced water sized to a niche in the Marcellus shale region. Overlap pushes the true pool toward the lower half.", source: CH.srcLink(["K53", "K64"]) } },
      { v: "7.0 /10", k: "Distillery vinasse — the standout entrant", d: { title: "STANDOUT ENTRANT", value: "7.0/10 · Tier 2", sub: "100–160 g/L COD feed strong enough to make its own heat plus an Indian pollution-board mandate that no wastewater leaves the site, on ~270 Indian molasses distilleries — the wedge that exports power instead of importing it.", source: CH.srcLink(["K61", "K62"]) } },
      { v: "$215,037", k: "Listed leader FY2025 revenue (vs $21.0M loss)", d: { title: "FIRST-MOVER FRAGILITY", value: "$215,037 vs −$21.0M", sub: "374Water FY2025 annual report (10-K): $3.2M cash, ~$49.9M accumulated deficit, auditors warn it may run out of money.", source: CH.srcLink(["K52"]) } },
    ],
    concepts: [
      { v: "≥120–150", k: "g/L COD — the threshold where it makes its own heat from the waste", d: { title: "THRESHOLD WHERE IT MAKES ITS OWN HEAT FROM THE WASTE", value: "~120–150 g/L COD", sub: "≥2 MJ/kg feed energy; below it, SCWO is an energy sink. Practical point near ~30 g/L with heat integration.", source: CH.srcLink(["K58", "K59"]) } },
      { v: "24", k: "Licensed US hazardous-waste incinerators (RCRA), 88–92% utilized", d: { title: "THE PERMITTING WALL", value: "24 combustors", sub: "One new unit permitted in three decades; 5–7%/yr price escalation.", source: CH.srcLink(["K34"]) } },
      { v: "Self-fueling", k: "H₂ loop: fuel on demand from process water, negligible net energy", d: { title: "SELF-FUELING H₂ LOOP", value: "Negligible net energy", sub: "Per the manufacturer briefing: on-demand splitting of process water into hydrogen and oxygen → clean combustion → reactor heat. Negligible net energy cost once started; a working prototype exists.", source: CH.srcLink(["K1"]) } },
      { v: "Prototype", k: "Working prototype exists (manufacturer briefing)", d: { title: "TECHNOLOGY READINESS", value: "Working prototype", sub: "Per the manufacturer briefing, a working prototype of the self-fueling HCSP exists; peer SCWO hardware operates commercially at AirSCWO and SuperOx installations. Publishing prototype energy-balance data is the cheapest way to make it safer to invest.", source: CH.srcLink(["K1", "K19"]) } },
    ],
    mech: [
      { v: "374 °C", k: "Critical point of water (with 22.1 MPa)", d: { title: "CRITICAL POINT", value: "374 °C · 22.1 MPa", sub: "Above it, organic waste and oxygen mix completely and the waste burns up entirely in seconds to minutes.", source: CH.srcLink(["K1"]) } },
      { v: "99.9993%", k: "PFAS destroyed, US Army Corps lab test", d: { title: "VALIDATED DESTRUCTION", value: "99.9993% destroyed & removed", sub: "AirSCWO 6 on firefighting foam; fluorine leaving the stack 0.0005 g/hr vs 16.6 g/hr fed in.", source: CH.srcLink(["K2"]) } },
      { v: "<100 mg/L", k: "Salt solubility in supercritical water", d: { title: "THE MATERIALS CONSTRAINT", value: "salts precipitate", sub: "Plugging, heat-transfer loss, under-deposit corrosion — the documented failure mode of conventional SCWO designs. HCSP's answer: >3,000 °F (≈1,650 °C) in-reactor hydrogen combustion prevents salt deposition by design; the manufacturer reports no salt issues, consistent with published research on flames burning inside hot pressurized water. Residual item: published prototype long-run data on salty feeds.", source: CH.srcLink(["K20", "K1"]) } },
      { v: "85–95%", k: "Water recovery as distilled water (<10 µS/cm conductivity — purer than tap water)", d: { title: "DISTILLED OUTPUT", value: "85–95%", sub: "Qualifies as high-purity reuse water — a byproduct credit, never the product.", source: CH.srcLink(["K1"]) } },
    ],
    state: [
      { v: "$15–50+", k: "Top of the savings ladder: halogenated solvents $/gal (manufacturer pricing TBD)", d: { title: "THE SAVINGS LENS", value: "$15–50+/gal existing suppliers vs HCSP cost TBD", sub: "The same industries, re-ranked by what existing suppliers charge to clean up each gallon — the pool of savings before our costs are known. HCSP is self-fueling once started (negligible net energy per manufacturer), but no cost model is published, so no $/gal is attached to HCSP — hazardous materials #1, firefighting foam #2, PFAS top-3 under both lenses; distillery/textiles demoted (regulation + energy plays). Margin × volume = pool; manufacturer cost inputs pending.", source: CH.srcLink(["K150", "K33", "K22"]) } },
      { v: "5×", k: "Grid-price spread: $10.8 (Middle East) vs $55.7 (Germany) /m³-equiv", d: { title: "THE GRID-PRICE SPREAD", value: "$10.8–55.7/m³-equiv", sub: "Context, not an operating-cost floor — HCSP operating energy is negligible per the manufacturer (self-fueling loop). The spread prices the startup power draw and the value of each exported kilowatt-hour; EU export value is contingent on the heat-integrated variant.", source: CH.srcLink(["K25", "K29"]) } },
      { v: "$3.5", k: "Recovered-water value per m³ (US avg)", d: { title: "WATER VALUE", value: "≈$3.53/m³", sub: "US average commercial water + sewer tariffs (EPA WaterSense 2024 data).", source: CH.srcLink(["K31"]) } },
      { v: "PENDING", k: "Net time to earn back the cost — halogenated solvents (savings before our costs are known)", d: { title: "NET TIME TO EARN BACK THE COST PENDING", value: "TBD — manufacturer cost model", sub: "Savings before our costs are known basis: the displaced baseline is $5–20/gal hauled and incinerated, to $50+/gal for special wastes. Net time to earn back the cost cannot be stated until the manufacturer publishes a cost model.", source: CH.srcLink(["K33"]) } },
      { v: "~1,800+", k: "Skid-equivalents of consolidated reachable market (low case)", d: { title: "THE MARKET IN MACHINES", value: "1,800–3,200 skids", sub: "Pharma ~1,050; textile 500–1,500; PFAS 200–500; hazmat 40–150; refinery ~41.", source: CH.srcLink(["K53"]) } },
    ],
    players: [
      { v: "4", k: "Verifiable commercial SCWO operators today", d: { title: "THE OPERATING FIELD", value: "4 organizations", sub: "374Water, General Atomics PERSES, Aquarden, Revive Environmental.", source: CH.srcLink(["K52", "K17", "K19", "K16"]) } },
      { v: "~6", k: "Commercial SCWO plants worldwide (2021)", d: { title: "THE GRAVEYARD", value: "~6 plants", sub: "A 2019 review found all commercially constructed plants except two had closed — corrosion, plugging, economics.", source: CH.srcLink(["K49"]) } },
      { v: ">6M gal", k: "Destroyed by General Atomics PERSES across ~200 waste types", d: { title: "THE EXISTING SUPPLIER", value: ">6M gal · >99.99%", sub: "Commercial since ~2012; EPA-verified; Tooele unit sidelined on reliability.", source: CH.srcLink(["K17"]) } },
      { v: "$5.2M", k: "OC San AirSCWO-6 contract (in $7.9M project)", d: { title: "THE MARKET REFERENCE", value: "$5,207,595", sub: "The only verifiable commercial SCWO transaction of this class — the market reference point while HCSP module pricing is TBD pending the manufacturer cost model.", source: CH.srcLink(["K18"]) } },
    ],
    deepdive: [
      { v: "$215K", k: "374Water FY2025 revenue vs $21.0M net loss — auditors warn it may run out of money", d: { title: "THE LISTED SPECIALIST", value: "$215K vs −$21.0M (FY2025)", sub: "Cash $1.78M and accumulated deficit $57.2M at June 30 2026; auditors warn it may run out of money in both recent filings; the $50M stock-sale facility is capped by SEC small-issuer rules at ~$1.14M sellable.", source: CH.srcLink(["K52", "K151", "K152"]) } },
      { v: "−DKK 30.9M", k: "Aquarden equity (2025) — 11 employees, owner-debt funded", d: { title: "THE EU BENCHMARK'S BALANCE SHEET", value: "−DKK 30.9M equity", sub: "Negative equity every year since at least 2021; 2025 net loss −DKK 13.0M; cash DKK 2.7M; ~DKK 77M of growing other debt; headcount 11, down from 18 in 2016.", source: CH.srcLink(["K159"]) } },
      { v: "≈$4.9M", k: "Smallest evidenced capital sale in the field (374Water AS6, Olathe)", d: { title: "THE FIELD'S PRICE FLOOR", value: "≈$4.9M smallest deal", sub: "374Water AS6 at Olathe: $4.88M firm fixed price. General Atomics' 3 gal/min container is program-scale only (pricing undisclosed); Aquarden's 5 t/d reactor ~$2–10M; Revive sells centralized service, never equipment.", source: CH.srcLink(["K151", "K156", "K160", "K163"]) } },
      { v: "<$1M", k: "The unshaded zone — no competitor sells equipment here", d: { title: "HCSP'S OPENING", value: "Sub-$1M = unshaded", sub: "Below ≈$1M there is no product to buy and no service door: the four survivors start at ≈$4.9M, program-scale, ~$2M, and state-aggregated service respectively — while small facilities pay >6× per pound for remove-and-destroy (Minnesota data) and 95% of US water systems serve <10,000 customers.", source: CH.srcLink(["K166"]) } },
    ],
    customers: [
      { v: "$4.88M / $600K", k: "Largest order (Olathe KS) · smallest disclosed (St. Cloud MN) — 374Water", d: { title: "THE DISCLOSED SPREAD · 374WATER", value: "$4.88M vs $600K", sub: "Olathe KS (via Garney): $4,880,000 firm fixed price — largest equipment order in company history. St. Cloud MN: $600,000 mobile pilot — smallest disclosed contract. A ~8× band with nothing above $5M booked; federal demos carry no disclosed values.", source: CH.srcLink(["K179", "K180"]) } },
      { v: "$16.6M*", k: "Largest program served (NJ, Revive) — appropriation; contract share undisclosed", d: { title: "THE PRECISION CAVEAT · REVIVE", value: "$16.6M ≠ contract value", sub: "New Jersey's $16.6M is the state appropriation for a ~150,000-gal, 400+ department program; Revive's contract value is undisclosed. Largest fully documented Revive award: Ohio Round 1, $3M (Monsanto). Smallest documented: New Hampshire $668,258. Ohio Round 2 >$13M directed, not yet awarded.", source: CH.srcLink(["K195"]) } },
      { v: "6 countries", k: "GA's realized footprint — every current US deployment government-funded", d: { title: "FOOTPRINT VS FUNDING · GA", value: "6 countries, government-carried", sub: "US (7 states) + Japan (historical joint venture) + China (2018, unverified) + Kyrgyzstan/Tajikistan (UN environmental aid, $44.18M). No PERSES-specific overseas sales channel; 'freely exportable under US rules' is posture, not a channel.", source: CH.srcLink(["K191", "K190"]) } },
      { v: "2 sites", k: "Revive's entire destruction capacity: Columbus OH + Grand Rapids MI", d: { title: "CENTRALIZED SERVICE · REVIVE", value: "2 Midwest nodes", sub: "All waste is freighted to Columbus OH (5 units, fully permitted 2026) or Grand Rapids/Wyoming MI (300K gal/day). US-only; Canada is a '4never' marketing claim with no documented customer; Colorado lost to Aquagga.", source: CH.srcLink(["K196"]) } },
    ],
    verdict: [
      { v: "OCT 2026", k: "Legal firefighting-foam phase-out deadline", d: { title: "FIREFIGHTING-FOAM DEADLINE", value: "2026-10-01", sub: "~1,000 facilities, >6,000 mobile assets, >$2.1B initial cost — foam and rinse-water destruction demand.", source: CH.srcLink(["K14", "K15"]) } },
      { v: "2026–28", k: "Landfill wastewater-rule window (federal ELG)", d: { title: "THE PENDING CATALYST", value: "ELG 2026–28", sub: "Finalizing the rule converts ~2,600 municipal landfills from optional to mandatory buyers of treatment for PFAS in landfill drainage liquid.", source: CH.srcLink(["K7"]) } },
      { v: "2031", k: "PFOA/PFOS drinking-water limit deadline", d: { title: "DRINKING-WATER COMPLIANCE", value: "2031", sub: "Extended from 2029; all six legal drinking-water limits stay in effect meanwhile after the D.C. Circuit's January 2026 denial.", source: CH.srcLink(["K5"]) } },
      { v: "4", k: "Things that would change this advice", d: { title: "WHAT WOULD CHANGE THIS ADVICE", value: "4 tripwires", sub: "Publishing prototype long-run data moves the 'go next' markets up; independent salt tests refuting the no-deposition combustion design, no self-fueling run at 100 m³/day within 36 months, or a rollback of PFAS rules would break the case.", source: CH.srcLink(["K1", "K20", "K70", "K5"]) } },
    ],
    scale: [
      { v: "35–88", k: "kWh/m³ net energy at hub scale (dilute feed)", d: { title: "THE LADDER'S BOTTOM RUNG", value: "35–88 kWh/m³", sub: "At 1,900 m³/day the module's 130–250 kWh/m³ collapses — but only on estimated design economics; nothing above 306 t/d has ever operated.", source: CH.srcLink(["K70", "K76"]) } },
      { v: "~35–40", k: "g/L COD — the net-zero energy point", d: { title: "THE POINT WHERE THE SYSTEM POWERS ITSELF", value: "net-zero ~35–40 g/L", sub: "Los Alamos lab model: net electricity falls from +18 kWh/m³ imported to −60 exported at 150 g/L COD with a steam power-recovery cycle.", source: CH.srcLink(["K73"]) } },
      { v: "9.6 MW", k: "Exportable heat at 1,000 m³/d @ 100 g/L", d: { title: "MAKING THREE USEFUL THINGS AT ONCE — CLEAN WATER, POWER, AND COOLING SURPLUS", value: "9.6 MW of heat (6.4–11.2)", sub: "60% of gross reaction heat is spoken for by preheat; the surplus cascades to 1.4 MW of power + 4.9 MW of cooling ≈ $1.15M/yr.", source: CH.srcLink(["K80", "K83"]) } },
      { v: "LFP", k: "Default standby battery on every unit", d: { title: "STORAGE VERDICT", value: "LFP default", sub: "Nickel-iron's 20–30%/month charge loss rules it out for standby; LFP packs at $70/kWh win every deciding row.", source: CH.srcLink(["K87", "K88"]) } },
    ],
    energy: [
      { v: "1.4 + 4.9 MW", k: "Power + cooling from one 1,000 m³/day example plant at 100 g/L COD", d: { title: "THE ENERGY ADVANTAGE IN ONE PLANT", value: "1.4 MW power + 4.9 MW cooling", sub: "A 1,000 m³/day plant on distillery-strength waste (100 g/L COD) exports ≈1,392 refrigeration tons of cooling plus 1.4 MW of electricity — on top of the destruction fees. Illustrative, from engineering studies.", source: CH.srcLink(["K80", "K83"]) } },
      { v: "≈$1.15M/yr", k: "Illustrative energy value stacked on destruction fees", d: { title: "THE THIRD REVENUE STREAM", value: "≈$1.15M/yr illustrative", sub: "Power at $15–20 per MWh of heat plus cooling at ~$10 (up to $30–48 as retail chilled water) — one waste stream earning as destruction fees + clean water + energy. No competitor sells the energy.", source: CH.srcLink(["K83", "K202"]) } },
      { v: "≥500 RT", k: "Steady cooling load a signed buyer must have before any chiller is built", d: { title: "THE VISIBLE GUARDRAIL", value: "≥500 refrigeration tons", sub: "Surplus heat exists only above ~35–60 g/L COD and at scale; heat-driven chillers want steady loads of 500+ refrigeration tons with electric backup always installed; ammonia equipment sits away from occupied buildings.", source: CH.srcLink(["K85", "K73"]) } },
    ],
    appendix: [
      { v: "9", k: "Variants on one reactor platform", d: { title: "MODELS BY INDUSTRY", value: "9 variants", sub: "HCSP-PFAS/RX/FAB/HAZ/BIO/AG plus VIN (vinasse zero-discharge retrofit), TRI (making three useful things at once — clean water, power, and cooling) and ISL (island micro-utility). Six of nine depend on a pre-module concentrator — the front end does the economic heavy lifting.", source: CH.srcLink(["K53", "K61", "K84"]) } },
      { v: "11", k: "Risks that govern the investment case", d: { title: "WHAT COULD GO WRONG", value: "11 risks", sub: "The risks include scale-up beyond the 306 t/d demonstrated envelope, dependence on a single nickel-iron supplier, and the need for independent documentation of the self-fueling energy balance (publish prototype data). Different in kind: demand-side risks shrink the market; scale-up and supply-chain risks can invalidate the unit itself. Salt/corrosion — the historical killer of conventional designs — is answered by HCSP's >3,000 °F in-reactor combustion (manufacturer); publishing prototype data is the residual.", source: CH.srcLink(["K20", "K96", "K1"]) } },
      { v: "0.6 mm/yr", k: "Inconel 625 corrosion at 600 °C/25 MPa", d: { title: "THE METALLURGY ANSWER", value: "0.6 mm/yr", sub: "On real pesticide wastewater with 99.42% COD removal — 25–40× better than the Hastelloy failure case.", source: CH.srcLink(["K57"]) } },
      { v: "K1–K202", k: "Dated source anchors behind every number", d: { title: "SOURCE DISCIPLINE", value: "197 anchors", sub: "Four classes, each dated: company primary, industry & official, broker relay, research compilation [derived]. The anchors cover the industry chapters, the scale, self-powering, three-in-one output, and storage chapters, 45 funding anchors, the competitor deep-dive and international/NGO funding layer (K151–K178), and 6 energy-scenario anchors (K197–K202).", source: "This site's Sources section" } },
    ],
    funding: [
      { v: "$37.33B", k: "Known addressable pools across the 92-program register", d: { title: "KNOWN POOLS", value: "$37.33B", sub: "Sum of disclosed award pools — grants, forgivable state loan-fund installments, federal WIFIA loan capacity, settlement funds — across the register. Not exhaustive; the twelve-program international & NGO layer (G-081–G-092) adds channels rather than pooled dollars.", source: CH.srcLink(["K149"]) } },
      { v: "−$11.3B", k: "DOE demonstration awards terminated in 2025", d: { title: "CONTRACTING SIDE", value: "~$11.3B terminated", sub: "DOE's clean-energy demonstrations office abolished Nov 2025 after the May (~$3.7B) and October (~$7.56B) termination waves; no successor office. Plus 781 EPA environmental-justice grants cancelled by the July 2025 budget law.", source: CH.srcLink(["K106", "K105"]) } },
      { v: "$12.75B+", k: "PFAS settlement funds in flight to water systems", d: { title: "EXPANDING SIDE", value: "$12.75B+ settlements", sub: "3M $10.5–12.5B (>$3.5B paid, installments to 2033–36) + DuPont/Chemours/Corteva $1.185B + Tyco $750M + BASF $316.5M. No vendor list exists — sell downstream of the checks.", source: CH.srcLink(["K111"]) } },
      { v: "$795M", k: "NJ PFAS Abatement Fund, court-approved 2026-08-07", d: { title: "NEWEST POOL", value: "$795M · ≥$150M to sewage treatment plants", sub: "Routed through the NJ Water Bank; program design forming now — engage the New Jersey environmental agency while the pipeline forms.", source: CH.srcLink(["K112"]) } },
    ],
    register: [
      { v: "92", k: "Programs screened — dead ones kept on record", d: { title: "THE REGISTER", value: "92 programs", sub: "66 active, 1 open-deadline, 19 on watch, 1 paused, 3 dead, 2 closed after the September 2026 federal deadlines (the Reclamation grant round and the Navy research call) — including the twelve-program international & NGO layer (G-081–G-092) added September 2026. Filter and sort the full table in §9.", source: CH.srcLink(["K149"]) } },
      { v: "40/35/25", k: "Pursuit-effort split across the three access modes", d: { title: "ACCESS ARCHITECTURE", value: "40/35/25", sub: "~90% of relevant dollars flow to utilities and public systems: 40% named-technology-in-partner-application, 35% direct-apply, 25% vendor-to-prime. The direct applications generate credibility; the partnerships generate dollars.", source: CH.srcLink(["K114", "K133"]) } },
      { v: "8 / 15", k: "Top-15 pursuits that are direct-apply — all 5 largest pools are reachable only through partners", d: { title: "THE SPLIT", value: "8 direct · 7 partner", sub: "Rows 1–4 are sub-$1M credibility plays; rows 6, 9, 10, 12 are large-dollar, long-cycle infrastructure plays. Almost nothing worth pursuing in the middle.", source: CH.srcLink(["K149"]) } },
      { v: "0.8→5", k: "$M — the Orlando conversion: grant → license → hub", d: { title: "THE ORLANDO TEMPLATE", value: "$0.8M → $3–5M", sub: "State clean-water fund grant (Feb 2024) → 5-yr waste-destruction license (Mar 2026) → full-scale PFAS hub (Jun 2026). One anchor utility per state program, then replicate.", source: CH.srcLink(["K114", "K115"]) } },
    ],
    pursuits: [
      { v: COUNTDOWN, k: NEXT_D ? "To " + NEXT_D.lab : "All 2026 hard deadlines have passed — Q1 2027 cycle in flight", d: { title: "NEXT HARD DEADLINE", value: COUNTDOWN, sub: NEXT_D ? NEXT_D.lab + ". Missing a clustered deadline costs a full annual cycle." : "The calendar rolls to ESTCP FY28 pre-proposals (~Mar 2027) and the Q2 2027 state entries.", source: CH.srcLink(["K116", "K117"]) } },
      { v: "CLOSED", k: "Reclamation research-grant round closed Sep 29 2026 — annual cycle, track FY2027", d: { title: "PURSUIT #1 · CLOSED", value: "≤$800K pilot of $5.7M", sub: "The best-matched direct federal grant closed Sep 29 2026 (4:00 pm MT). For-profits apply directly; produced water and municipal wastewater are named source waters. Annual cycle — prepare the pilot proposal for the FY2027 round.", source: CH.srcLink(["K116"]) } },
      { v: "$185.9M", k: "Defense environmental research (SERDP + ESTCP) FY2027 budgets, fully funded", d: { title: "PURSUIT #3", value: "$60.8M + $125.1M", sub: "FY28 solicitations expected Oct–Nov 2026 (SERDP) and ~Dec 2026 with Mar 2027 pre-proposals (ESTCP). SCWO precedents ER20-5350 and ER23-7939. Line up a military base to host in Q4.", source: CH.srcLink(["K118", "K119"]) } },
      { v: "$500K–5M", k: "Elemental Impact data-center initiative per project — flagship private fit, rolling through 2027", d: { title: "PURSUIT #11", value: "$500K–$5M · ≤10 startups", sub: "Philanthropy-funded investment with Amazon/Google/Meta/Microsoft as collaborators — the water+cooling+power story. Structured as investment, not a pure grant.", source: CH.srcLink(["K131"]) } },
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

    // mini ranking (15 industries)
    let y = 168;
    ctx.font = '700 9px Menlo, Consolas, monospace';
    ctx.fillStyle = PAL.inkLo;
    ctx.fillText("THE RANKING · 15 INDUSTRIES · SCORE /10", L, y);
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
        title: `RANK ${d.rank} · ${nm.slice(0, 34)}`, value: d.score + " / 10", sub: d.why, source: CH.srcLink(d.src) } });
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
