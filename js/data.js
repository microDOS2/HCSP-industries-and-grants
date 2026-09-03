// ═══ Data layer · window.RPT (compiled from HCSP_Industry_Value_Report.agent.final.md) ═══
// Every figure traces to a source anchor in js/sources.js (K-numbers).
window.RPT = {

  // ── Ch.3 v2 league table: fifteen industries, six-criterion weighted scores, /10 ──
  league: [
    { rank: 1, key: "pfas",    name: "PFAS destruction & landfill leachate", score: 8.0,  tier: 1, payback: "Pending — mfr cost model",
      why: "Regulation-protected destruction demand vs. $1–28/gal relocation incumbents; federally validated 99.9993% destruction evidence.",
      src: ["K8", "K2"] },
    { rank: 2, key: "defense", name: "Defense / maritime / remote", score: 7.5,  tier: 1, payback: "Not modeled — procurement-gated",
      why: "DoD carries >$9.3B future PFAS cleanup across 718 installations plus a statutory AFFF transition; 2–5× remote pricing premium.",
      src: ["K13", "K15"] },
    { rank: 3, key: "textile", name: "Textile/dyeing clusters (India ZLD wedge)", score: 7.4, tier: 1, payback: "Pending — mfr cost model",
      why: "Court-enforced zero liquid discharge with unsolved brine/sludge disposal; Tirupur built 18 ZLD plants (~$120M) and still lacks destruction.",
      src: ["K42", "K39"] },
    { rank: 4, key: "chem",    name: "Chemical & hazardous waste", score: 7.0,  tier: 2, payback: "Pending — mfr cost model",
      why: "Halogenated solvents pay $15–50+/gal against ~24 RCRA combustors at 88–92% utilization — the widest umbrella in the portfolio.",
      src: ["K33", "K34"] },
    { rank: 5, key: "pharma",  name: "Pharma & biotech", score: 7.0,  tier: 2, payback: "Pending — mfr cost model",
      why: "$1.5–15/gal solvent/API disposal plus AMR and EU producer-responsibility mandates monetize destruction.",
      src: ["K37", "K38"] },
    { rank: 6, key: "distill", name: "Distillery / ethanol vinasse (NEW in v2)", score: 7.0, tier: 2, payback: "Pending — mfr cost model",
      why: "The standout v2 entrant: molasses spent wash at 100–160 g/L COD is autothermal, power-exporting feed, and India's CPCB forces ~270 molasses distilleries into energy-consuming thermal ZLD that HCSP replaces while exporting power. SAM $2–5B (India + Brazil, analyst build-up).",
      src: ["K61", "K62", "K64"] },
    { rank: 7, key: "semi",    name: "Semiconductor side-streams", score: 6.75, tier: 2, payback: "Pending — mfr cost model",
      why: "PFAS permit fights on new fabs; solvent/CMP/concentrate side-streams at $1.8–4/gal. Bulk fab effluent is a 2/10 fit.",
      src: ["K40"] },
    { rank: 8, key: "bio",     name: "Municipal biosolids (crisis regions only)", score: 6.6, tier: 2, payback: "Pending — mfr cost model",
      why: "$4.8B/yr US disposal bill and PFAS-driven pathway collapse; scale and power export improve economics modestly — but bimodal economics and 3–7-year procurement.",
      src: ["K43", "K44", "K73"] },
    { rank: 9, key: "fnb",     name: "Food & beverage (side-streams only)", score: 6.3, tier: 3, payback: "Pending — mfr cost model",
      why: "Anaerobic digestion owns bulk effluent; concentrated side-streams hauled at $45–120/1,000 gal pencil, and trigeneration cooling slots into existing ammonia refrigeration.",
      src: ["K46", "K84"] },
    { rank: 10, key: "islands", name: "Islands / resorts / coastal municipalities (NEW)", score: 6.0, tier: 3, payback: "Pending — mfr cost model",
      why: "The only vertical where all three outputs price near global maximums — power $0.30–0.52/kWh, desal-parity water $2–5/m³ — but feed is dilute and needs FOG/food-waste blending.",
      src: ["K65"] },
    { rank: 11, key: "og",     name: "Produced water (revised ↑, honest niche)", score: 4.75, tier: 3, payback: "Pending — mfr cost model",
      why: "Real only as 50–100k bbl/day salt-first hubs in Marcellus/Utica ($3–15/bbl trucking) or seismicity-constrained Permian pockets; Permian pipeline disposal at $0.55–1.81/bbl forecloses any basin-scale oxidation play. Niche viability pending the manufacturer cost model.",
      src: ["K93", "K94", "K100"] },
    { rank: 12, key: "cea",    name: "Indoor agriculture / CEA (briefing anchor)", score: 4.2, tier: 4, payback: "Service model only",
      why: "~99.8%-water stream far below the autothermal threshold, sold to distressed customers; only 27.3% of US cannabis operators profitable (2024). Cooling/water co-benefits help only at the margin.",
      src: ["K36", "K35"] },
    { rank: 13, key: "cafo",   name: "CAFO manure (NEW)", score: 4.0, tier: 4, payback: "Not modeled — incumbent credits win",
      why: "1.4B t/yr of feedstock but 85–92% water; digesters stacked with LCFS/RIN credits (>$50/MMBtu) monetize the same story better. Wedge: digestate elimination in land-constrained dairy belts (~0.8 ha/cow).",
      src: ["K66"] },
    { rank: 14, key: "mining", name: "Mining / remote camps (NEW)", score: 4.0, tier: 4, payback: "Opportunistic only",
      why: "High value per unit — diesel at $0.30–1.10/kWh, haul avoidance, water scarcity — but small organic volumes per site and bespoke, commodity-cycle procurement.",
      src: ["K67"] },
    { rank: 15, key: "dc",     name: "Data centers, direct feed (NEW)", score: 3.0, tier: 4, payback: "Offtaker, not buyer",
      why: "On-site waste is inorganic cooling-tower blowdown — not SCWO feed. The credible play is inverted: HCSP plants sited at waste-rich hosts sell power, cooling, and reclaimed water to data centers facing 4–7-year grid queues.",
      src: ["K68", "K69"] },
  ],
  tiers: [
    { tier: 1, band: "≥ 7.4", name: "Pursue now", posture: "Direct entry via concentrate-and-destroy trains; per-gallon service pricing under a wide umbrella." },
    { tier: 2, band: "6.5–7.4", name: "Develop", posture: "Feed-disciplined selling into premium streams; for distillery, lead with energy-export economics against thermal ZLD incumbents." },
    { tier: 3, band: "4.5–6.4", name: "Conditional / regional", posture: "Beachheads where the condition holds (Caribbean/Hawaii, Marcellus hubs, behind a concentrator); partner, don't blanket-market." },
    { tier: 4, band: "< 4.5", name: "Weak fit", posture: "No revenue plan; CEA as a regulatory showcase, data centers as an offtaker strategy, NiFe-style niche options only." },
  ],

  // ── v3 addendum: the cost-savings lens — incumbent remediation cost per gallon, by vertical ──
  // Canonical dataset: research/hcsp_v3_savings_ladder.md. Manufacturer HCSP pricing TBD (early phase);
  // the reference contrast is qualitative only — HCSP: self-fueling loop, cost model pending — against
  // field SCWO service benchmarks ($1.63–4.88/gal, 374Water AirSCWO 6).
  savings_ladder: [
    { srank: 1,  key: "chem",    vertical: "Chemical & hazardous — halogenated solvents", lo: 15, hi: 50, plus: true,
      note: "Halogenated solvents $15–20+/gal, specialty streams to $50+/gal; lab packs $7–11/gal. The widest umbrella in the portfolio.",
      src: ["K33"] },
    { srank: 2,  key: "defense", vertical: "Defense — AFFF concentrate", lo: 5, hi: 28,
      note: "Haz-waste landfill $28/gal (Michigan 2020); incineration $5–10/gal — both capacity-constrained, and landfilling leaves CERCLA liability attached.",
      src: ["K9", "K10"] },
    { srank: 3,  key: "pfas",    vertical: "PFAS concentrates (leachate foamate / IX brine)", lo: 1.83, hi: 10,
      note: "Incumbent SCWO services $6–10/gal; field-measured $1.63–4.88/gal (AirSCWO 6, Minnesota 3M-settlement project). Top-3 under BOTH lenses — the most robust finding.",
      src: ["K21", "K54"] },
    { srank: 4,  key: "pharma",  vertical: "Pharma & biotech solvent/API waste", lo: 1.5, hi: 15,
      note: "Solvent/API disposal $1.50–3/gal standard, $5–15/gal hazardous-rated; halogenated streams reach $15–50+/gal.",
      src: ["K37"] },
    { srank: 5,  key: "semi",    vertical: "Semiconductor side-streams (solvents, CMP, PFAS concentrate)", lo: 1.9, hi: 7.6,
      note: "CMP slurry $0.5–2/L (≈$1.9–7.6/gal); fab solvents $2–4/gal; IX PFAS concentrate $1.83–4.88/gal.",
      src: ["K40", "K54"] },
    { srank: 6,  key: "cea",     vertical: "CEA hauling-captive sites", lo: 0.40, hi: 2.50,
      note: "Where sewer discharge is restricted, nutrient runoff trucks out at $0.40–2.50/gal — the hauling-captive niche the composite lens ranks twelfth.",
      src: ["K36", "K35"] },
    { srank: 7,  key: "islands", vertical: "Islands / remote disposal", lo: 0.5, hi: 1.25,
      note: "Disposal ≥$300/wet t ≈ $1.25/gal-equivalent, binding where diesel ≥$0.35/kWh coincides.",
      src: ["K65"] },
    { srank: 8,  key: "bio",     vertical: "Municipal biosolids — crisis regions", lo: 0.79, hi: 1.04,
      note: "Crisis-corridor cake disposal $190–250/wet t ÷ ~240 gal/t; land application collapses under PFAS scrutiny.",
      src: ["K43"] },
    { srank: 9,  key: "mining",  vertical: "Mining / remote camps", lo: 0.5, hi: 2.0, lowConf: true,
      note: "Haul premiums 2–4× invoice at remote camps; sparse data — LOW CONFIDENCE flag.",
      src: ["K67"] },
    { srank: 10, key: "cafo",    vertical: "CAFO manure / digestate", lo: 0.1, hi: 0.5, lowConf: true,
      note: "Spreading/haul equivalents; sparse data — LOW CONFIDENCE flag. Digester credit stacking (LCFS/RIN >$50/MMBtu) monetizes the same story better.",
      src: ["K66"] },
    { srank: 11, key: "og",      vertical: "Produced water — Marcellus niche", lo: 0.07, hi: 0.36,
      note: "$3–15/bbl trucking in the Marcellus/Utica corridor; Permian pipeline disposal ($0.55–1.81/bbl) leaves no room for any oxidation play — HCSP cost model pending.",
      src: ["K94", "K93"] },
    { srank: 12, key: "fnb",     vertical: "F&B side-streams", lo: 0.045, hi: 0.12,
      note: "Concentrated side-streams hauled at $45–120/1,000 gal; anaerobic digestion owns bulk effluent.",
      src: ["K46"] },
    { srank: 13, key: "distill", vertical: "Distillery vinasse (ZLD thermal incumbent)", lo: 0.007, hi: 0.010,
      note: "MEE + boiler incineration O&M benchmark $1.8–2.6/m³ (~1¢/gal) — a regulation + energy-export play, NOT a $/gal savings play.",
      src: ["K62", "K64"] },
    { srank: 14, key: "textile", vertical: "Textile ZLD clusters", lo: 0.007, hi: 0.010,
      note: "ZLD train O&M $1.8–2.6/m³ (₹180–350/m³) — court-enforced compulsion drives the composite score; the incumbent stream costs ~1¢/gal.",
      src: ["K42"] },
    { srank: 15, key: "dc",      vertical: "Data centers, direct feed", lo: null, hi: null, na: true,
      note: "N/A — offtaker, no remediation stream. On-site waste is inorganic cooling-tower blowdown, not SCWO feed.",
      src: ["K68"] },
  ],
  savings_meta: {
    floor: null, // HCSP cost reference band removed — no $/gal attached to HCSP; cost model pending
    floor_note: "HCSP: self-fueling loop · manufacturer cost model pending — no $/gal attached",
    field_band: "$1.63–4.88/gal field SCWO service benchmark (374Water AirSCWO 6)",
    field_src: ["K54"],
    qualifier: "margin × volume = pool — $50/gal on a tiny stream can be a smaller prize than $5/gal on a ubiquitous one",
    pending: "Manufacturer HCSP pricing is TBD (early phase): all unit-economics panels are ranked by addressable savings against incumbent cost, not by manufacturer margin.",
    lenses: "The two lenses answer different questions — 'where is the margin umbrella?' (savings) vs. 'where do all forces align?' (composite).",
    src: ["K150"],
  },

  // ── Ch.8.3 gross addressable savings by vertical — displaced incumbent baselines, US cost basis ──
  // Net payback is deliberately NOT stated: it requires HCSP cost/price inputs, and the
  // manufacturer cost model is pending. Bars were removed; incumbent baselines are market data.
  payback: [
    { key: "haz",    name: "Hazardous solvents (halogenated)", basis: "Displaced baseline $5–20/gal (to $50+ special)", kind: "destruction", src: ["K33"] },
    { key: "pfas",   name: "PFAS concentrates",                basis: "vs. $5–10/gal incineration, $6–10/gal incumbent SCWO", kind: "destruction", src: ["K21", "K22"] },
    { key: "pharma", name: "Pharma / biotech high-strength",   basis: "$1.5–3/gal baseline, $5–15/gal hazardous-rated", kind: "destruction", src: ["K37"] },
    { key: "semi",   name: "Semiconductor side-streams",       basis: "$1.5–4/gal blended; multi-stream aggregation required", kind: "destruction", src: ["K40"] },
    { key: "ref",    name: "Refinery residuals (K-listed)",    basis: "$500/t mid-point baseline; $700–1,000/t service benchmark", kind: "disposal", src: ["K47"] },
    { key: "bio",    name: "Biosolids — crisis zones only",    basis: "$350–500/wet t crisis pricing", kind: "disposal", src: ["K43", "K44"] },
    { key: "tex",    name: "Textile clusters — India ZLD",     basis: "ZLD train ₹180–350/m³ + sludge disposal", kind: "disposal", src: ["K42"] },
    { key: "fnb",    name: "F&B concentrated side-streams",    basis: "Hauling $45–120/1,000 gal + dewatering savings", kind: "disposal", src: ["K46"] },
    { key: "distill", name: "Distillery spent wash — India", basis: "Displaces CPCB-mandated MEE + boiler incineration; ~$1.3–2.7M/yr per 60 KLPD site incl. power export", kind: "disposal", src: ["K62", "K64", "K61"] },
    { key: "islands", name: "Islands / resorts (diesel)", basis: "Addressable only where disposal ≥$300/wet t and diesel ≥$0.35/kWh coincide", kind: "disposal", src: ["K65"] },
    { key: "cea",    name: "Indoor agriculture / CEA",         basis: "No standalone equipment case — the dilute stream's value cannot cover operating costs; service model only", kind: "gap", src: ["K35", "K36"] },
  ],

  // ── Ch.1.2.3 / 8.4 grid power price context ($/m³-equivalent on the 75–95 kW startup/auxiliary spec) vs water value ──
  energy_floor: [
    { region: "MEA (Saudi/UAE industrial)", lo: 10.8, hi: 13.7, idx: 21, note: "$10–15/MWh solar PPAs; Vision 2030 70% reuse target", src: ["K25", "K28"] },
    { region: "US Gulf / Texas",                     lo: 11.9, hi: 15.1, idx: 21, note: "TX industrial power ~6.6 ¢/kWh; produced-water reuse opening", src: ["K24"] },
    { region: "US average",                          lo: 15.5, hi: 19.7, idx: null, note: "US industrial 8.62 ¢/kWh × 180–228 kWh/m³", src: ["K23"] },
    { region: "China industrial parks",              lo: 15.8, hi: 26.4, idx: 21, note: "25%/35% reuse mandates; localization required (*scoring adj.)", src: ["K26"] },
    { region: "India ZLD clusters",                  lo: 19.4, hi: 24.6, idx: 20, note: "CPCB/NGT mandates with 30–45-day closure enforcement", src: ["K27", "K39"] },
    { region: "EU average",                          lo: 35.7, hi: 45.2, idx: 19, note: "Viable only with heat recovery or Nordic power", src: ["K29"] },
    { region: "Germany",                             lo: 44.0, hi: 55.7, idx: null, note: "€22.64/100 kWh — grid price alone exceeds EU water+sewer tariffs", src: ["K29", "K30"] },
  ],
  water_value: { v: 3.5, note: "US average commercial water + sewer, ~$3.53/m³ combined (EPA WaterSense 2024 data)", src: ["K31"] },

  // ── Ch.4.1.2 / 8.2 incumbent destruction pricing umbrella ($/gal) ──
  umbrella: [
    { name: "HCSP power cost",             tbd: true, cls: "hcsp",  note: "TBD — manufacturer cost model pending. Operating energy is negligible per the manufacturer (self-fueling loop); no $/gal figure is attached to HCSP until the manufacturer publishes a cost model.", src: ["K22", "K1"] },
    { name: "HCSP fully loaded cost",      tbd: true, cls: "hcsp",  note: "TBD — manufacturer cost model pending. Earlier figures cited here came from SCWO industry literature and are not HCSP's costs.", src: ["K22", "K18"] },
    { name: "Deep-well injection",         lo: 1.0,  hi: 2.0,  cls: "inc",   note: "Relocation, not destruction; 'rarely available' — capacity-constrained", src: ["K9", "K10"] },
    { name: "HCSP service pricing",        tbd: true, cls: "hcsp2", note: "TBD — manufacturer cost model pending. The $2–5/gal 'viable band' in SCWO industry literature describes 374Water's WDS service economics, not HCSP pricing.", src: ["K21"] },
    { name: "PFAS incineration",           lo: 5.0,  hi: 10.0, cls: "inc",   note: "Cheapest destructive incumbent; air-permit gauntlet, capacity-constrained", src: ["K9", "K10"] },
    { name: "Incumbent SCWO service",      lo: 6.0,  hi: 10.0, cls: "inc",   note: "374Water WDS benchmark; claimed 1.5–2.5-yr payback at $4.5–6.0M site capital", src: ["K21"] },
    { name: "Hazardous-waste landfill",    lo: 6.0,  hi: 28.0, cls: "inc",   note: "AFFF landfilled at $28/gal (Michigan 2020); CERCLA liability persists", src: ["K10"] },
    { name: "Halogenated-solvent disposal", lo: 15.0, hi: 50.0, cls: "inc",  note: "$15–20+/gal halogenated; specialty streams to $50+/gal", src: ["K33"] },
  ],

  // ── Ch.8.1 TAM/SAM by vertical (SAM expressed in 10 m³/day module-equivalents) ──
  sizing: [
    { key: "pharma", name: "Pharma & biotech",      mod_lo: 1050, mod_hi: 1050, unit: 50, sam: "$2.1–3.2B US one-time equipment", tam: "~$3.8B/yr global pharma wastewater (2030)",
      note: "~35% of 2,010 US establishments × 1.5 skids", src: ["K41", "K37"] },
    { key: "tex",    name: "Textile clusters (India/China)", mod_lo: 500, mod_hi: 1500, unit: 50, sam: "$0.6–3.3B cumulative equipment over 10 yr", tam: "$2–2.5B/yr sector treatment spend",
      note: "Only 1–3% of effluent volume is concentrate/sludge; low-medium confidence (top-down)", src: ["K42"] },
    { key: "pfas",   name: "PFAS concentrates",      mod_lo: 200,  mod_hi: 500,  unit: 50, sam: "$300M–1.6B/yr by 2030", tam: "$1.5–4B/yr US destruction-addressable by 2030",
      note: "20–40% of the 2030 destruction market; $2–5/gal viable vs $5–10/gal incineration", src: ["K21", "K8"] },
    { key: "haz",    name: "Hazardous organic liquids", mod_lo: 40, mod_hi: 150, unit: 50, sam: "$2–4B/yr (NA+EU)", tam: "$17–22B/yr global, →$35–45B by 2035",
      note: "40–150 modules ≈ $110–550M/yr service revenue for an entrant", src: ["K33"] },
    { key: "ref",    name: "Refinery residuals",     mod_lo: 41,   mod_hi: 41,   unit: 50, sam: "$95–136M/yr", tam: "$447–638M/yr technical TAM (1995 DOE/API basis — dated)",
      note: "~41 module-equivalents; treatment + direct-disposal streams only", src: ["K47"] },
  ],
  market_meta: {
    sam_total: "~$9–20B/yr",
    sam_note: "v1 verticals (~$4.6–10.4B/yr) plus the v2 additions — distillery $2–5B, CAFO $1–3B, islands $0.5–1.5B, mining $0.3–0.8B, produced-water niche $0.05–0.2B/yr, data centers $0.05–0.15B — sum to $8.5–21B/yr, rounded. Decade-horizon annualized envelope; overlap pushes the non-overlapping pool toward the lower half.",
    scwo_equipment: "$120–460M (2025)",
    scwo_note: "Resolved from a $120M–1.13B spread across research houses on taxonomy grounds; $1.13B outlier discarded as low-authority aggregation.",
    pfas_treatment: "$2.1–3.4B/yr",
    ebj: { now: 132, was: 230, note: "EBJ cut its 30-year PFAS market estimate 43%, from $230B (2024) to $132B (2025), explicitly on federal deregulation.", src: ["K12"] },
  },

  // ── Ch.1.1.1 HCSP specification (per the technical briefing) ──
  spec: [
    { k: "Throughput", v: "10 m³/day (~2,640 gal/day)", note: "~0.9 M gal/yr at 90% utilization", src: "K1" },
    { k: "Core technology", v: "Supercritical water oxidation", note: "Continuous, fully automated", src: "K1" },
    { k: "Operating conditions", v: "380–420 °C · ~25 MPa (250 bar)", note: "Just above the critical point (374 °C, 22.1 MPa)", src: "K1" },
    { k: "Water recovery", v: "85–95% to distillate; <10 µS/cm", note: "Distilled-quality output", src: "K1" },
    { k: "Solid residual", v: "Contained, inert sludge", note: "Mineralized salts/oxides", src: "K1" },
    { k: "Electrical load (startup/auxiliary)", v: "~75–95 kW", note: "180–228 kWh/m³-equivalent spec; operating energy self-fueled once started", src: "K1" },
    { k: "H₂ fuel loop (as briefed)", v: "~30–40 kg/day by on-demand electrolysis", note: "Self-fueling once started — fuel generated on demand from process water; see §1", src: "K1" },
    { k: "Footprint", v: "~8–10 m² · ≤3 m height · <75 dBA at 1 m", note: "Indoor-sited, container class", src: "K1" },
    { k: "Air permitting", v: "None claimed — sealed system vents water vapor", note: "The hidden economic moat", src: "K1" },
  ],

  // ── Ch.8.2 per-module cost stack — HCSP has NO published cost benchmark ──
  // All $ figures are TBD pending the manufacturer cost model; the rows keep only the
  // qualitative structure of the stack. SCWO industry-literature figures are the technology
  // class's, not HCSP's, and are labeled as such where cited.
  cost_stack: [
    { el: "Electricity", basis: "Operating energy negligible per manufacturer (self-fueling loop); grid power covers only the 75–95 kW startup/auxiliary spec", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K23", "K24"] },
    { el: "Labor", basis: "Staffing for a 240-bar automated system — level pending manufacturer data", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K53"] },
    { el: "Maintenance & materials", basis: "Corrosion/salt management was the historical industry risk of conventional preheater designs; HCSP's >3,000 °F in-reactor H₂ combustion eliminates salt deposition by design (manufacturer) — rate pending manufacturer data", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K20", "K1"] },
    { el: "Oxidant, residue disposal, misc.", basis: "No chemicals claimed; mineral residue off-take — pending manufacturer data", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K53"] },
    { el: "Cash OpEx subtotal", basis: "", yr: "TBD", gal: "TBD", m3: "TBD", bold: true, src: ["K53"] },
    { el: "CapEx amortization", basis: "Module CapEx TBD — the only verifiable market reference is the AirSCWO 6's $5.2M equipment-plus-operation contract (OC San)", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K18"] },
    { el: "Fully loaded cost stack", basis: "TBD — manufacturer cost model pending; no $/gal or $/m³ is attached to HCSP", yr: "TBD", gal: "TBD", m3: "TBD", bold: true, src: ["K53"] },
  ],

  // ── Ch.1.4 / 5.1 SCWO field · destiny flow (birth → outcome) ──
  players: [
    { name: "MODAR", cohort: "The graveyard", from: 1980, to: 1996, outcome: "dead", out: "Exited",
      note: "1980s SCWO pioneer; pharma-waste destruction published 1988; the process never survived commercial scale-up.", src: ["K48"], graded: "derived" },
    { name: "Chematur / AquaCat", cohort: "The graveyard", from: 1998, to: 2008, outcome: "sold", out: "Technology sold",
      note: "World's largest SCWO unit (3,000 L/h) operated only ~5 years before the technology was sold.", src: ["K49"], graded: "derived" },
    { name: "HydroProcessing (Harlingen, TX)", cohort: "The graveyard", from: 2001, to: 2005, outcome: "dead", out: "Failed",
      note: "First US sewage-sludge SCWO plant; failed after ~4 years on pump durability, salt precipitation, corrosion, plugging.", src: ["K50"] },
    { name: "Blue Grass program (US Army)", cohort: "The graveyard", from: 2003, to: 2015, outcome: "dead", out: "Rejected at full scale",
      note: ">99.9999% DRE over ~5,800 hot hours — but titanium/Hastelloy liner life of ~110 h implied 12 liner changes per campaign.", src: ["K51"], graded: "derived" },
    { name: "Innoveox", cohort: "The graveyard", from: 2011, to: 2020, outcome: "dead", out: "Closed",
      note: "Listed on Euronext 2014; now closed.", src: ["K49"], graded: "derived" },
    { name: "Hanwha (Korea)", cohort: "The graveyard", from: 2012, to: 2022, outcome: "dead", out: "Both plants idle",
      note: "Built two full-scale Korean plants; neither still operating.", src: ["K49"], graded: "derived" },
    { name: "General Atomics PERSES (iSCWO)", cohort: "Operating field", from: 2012, to: 2026, outcome: "operating", out: "Incumbent",
      note: "Commercial since ~2012; >6M gallons across ~200 waste types at >99.99%, EPA-verified; Tooele unit sidelined on reliability.", src: ["K17"] },
    { name: "Battelle PFAS Annihilator", cohort: "Operating field", from: 2015, to: 2023, outcome: "licensed", out: "Licensed to Revive",
      note: "≥99.9% destruction across three AFFF formulations; fluoride mass balance confirms mineralization.", src: ["K16"], graded: "derived" },
    { name: "374Water (NASDAQ: SCWO)", cohort: "Operating field", from: 2018, to: 2026, outcome: "operating", out: "Listed, pre-scale",
      note: "FY2025 revenue $215,037 against a $21.0M net loss; going-concern language — first-mover risk is real.", src: ["K52"], graded: "derived" },
    { name: "Aquarden (SuperOx)", cohort: "Operating field", from: 2016, to: 2026, outcome: "operating", out: "Operating",
      note: "All-electric 5 t/day modular units in Denmark and France, incl. ArianeGroup explosives/PFAS.", src: ["K19"], graded: "derived" },
    { name: "Revive Environmental", cohort: "Operating field", from: 2022, to: 2026, outcome: "operating", out: "First permitted SCWO PFAS service",
      note: "Operates the Annihilator as a per-gallon service — North America's first fully permitted commercial-scale SCWO PFAS system.", src: ["K16"], graded: "derived" },
  ],
  field_stats: { plants_2021: "~6", closed_2019: "all but 2", note: "As of 2021 only ~6 commercial SCWO plants operated worldwide; a 2019 review found all commercially constructed plants except two had closed.", src: ["K49"] },

  // ── Vendor benchmark small multiples (Ch.1.4.2) ──
  vendors: [
    { name: "HCSP (as briefed)", scale: "10 m³/day skid", trl: [6, 7], energy: "Self-fueling loop; 75–95 kW startup/aux spec", energy_kwh: [180, 500], cost: "TBD — manufacturer cost model pending", constraint: "None — >3,000 °F H₂ combustion design (manufacturer); prototype data publication pending", src: ["K22", "K54", "K1"] },
    { name: "374Water AirSCWO 6", scale: "6 wet t/d", trl: [7, 8], energy: "~294 kWh/m³ + IPA co-fuel", energy_kwh: [294, 294], cost: "$1.63–4.88/gal PFAS concentrate (field)", constraint: "Pre-scale finances", src: ["K54", "K52"] },
    { name: "GA PERSES (iSCWO)", scale: "t/h-class transportable", trl: [8, 9], energy: "compressed-air oxidant; 650 °C/3,400 psia", energy_kwh: null, cost: "service-based", constraint: "Tooele reliability record", src: ["K17"] },
    { name: "Aquarden SuperOx", scale: "5 t/d modular", trl: [7, 8], energy: "100% electric", energy_kwh: null, cost: "service / system sale", constraint: "EU energy prices", src: ["K19"] },
  ],

  // ── Regulatory catalyst horizon ──
  catalysts: [
    { y: 2023.0, label: "ELG Plan 15", ev: "EPA commits to revising the landfill ELG — the first PFAS ELG", cls: "policy", src: ["K7"] },
    { y: 2023.55, label: "CPCB distillery ZLD", ev: "India's CPCB directions (19 Jan 2023) mandate zero liquid discharge for ~270 molasses distilleries — concentrate-and-incinerate route, land application disallowed, closure orders for non-compliance. The mandate that makes vinasse the standout v2 wedge", cls: "demand", src: ["K62", "K63"] },
    { y: 2024.3, label: "PFAS MCLs", ev: "First federal drinking-water limits: 4.0 ppt PFOA/PFOS", cls: "policy", src: ["K5"] },
    { y: 2024.5, label: "CERCLA designation", ev: "PFOA/PFOS designated hazardous substances — liability attaches to every handoff", cls: "policy", src: ["K6"] },
    { y: 2024.7, label: "WHO AMR guidance", ev: "First global guidance on antibiotic-manufacturing waste", cls: "policy", src: ["K45"] },
    { y: 2025.7, label: "CERCLA retained", ev: "EPA announces it will retain and defend the designation; upheld by D.C. Circuit 2026", cls: "policy", src: ["K6"] },
    { y: 2026.2, label: "DoD moratorium lifted", ev: "PFAS incineration re-opens under a permit-based framework — competition and volume validation", cls: "risk", src: ["K11"] },
    { y: 2026.3, label: "EPA guidance v3", ev: "Interim guidance still calls SCWO 'commercially unproven at scale' — revision is a dated de-risking event", cls: "risk", src: ["K55"] },
    { y: 2026.75, label: "AFFF deadline", ev: "Statutory foam transition: ~1,000 facilities, >6,000 mobile assets, >$2.1B initial cost", cls: "demand", src: ["K14", "K15"] },
    { y: 2027.0, label: "NL near-zero N", ev: "Netherlands mandates near-zero nitrogen discharge in the world's most advanced greenhouse sector", cls: "policy", src: ["K35"] },
    { y: 2027.4, label: "Landfill ELG window", ev: "Proposed rulemaking anticipated 2026 → realistic finalization window 2026–2028; ~2,600 MSW landfills become mandatory buyers", cls: "demand", src: ["K7"] },
    { y: 2031.0, label: "MCL compliance", ev: "PFOA/PFOS drinking-water compliance deadline, extended from 2029", cls: "demand", src: ["K5"] },
    { y: 2045.0, label: "EU UWWTD horizon", ev: "Recast directive (EU 2024/3019): quaternary micropollutant treatment with ≥80% EPR funding by pharma/cosmetics", cls: "policy", src: ["K38", "K56"] },
  ],

  // ── Ch.9.2 variant portfolio ──
  variants: [
    { v: "HCSP-PFAS", stream: "Leachate foam fractionate; AFFF stockpiles; IX regenerant brines", pre: "Foam fractionation (0.5–2% of feed volume, up to 100,000× concentration)", mat: "Inconel 625 core; HF-tolerant trims", model: "Mobile WDaaS, $2–5/gal", first: "Landfill operators, DoD installations, airport foam take-back", src: ["K8"] },
    { v: "HCSP-RX", stream: "Pharma mother liquors, solvent-recovery bottoms, API concentrates (COD 2,000–80,000 mg/L)", pre: "Solvent segregation; none required for strong streams", mat: "Inconel 625; corrosion allowance for pH 2–12 feeds", model: "Equipment sale + validation documentation (GMP-adjacent)", first: "API plants in Indian clusters; US/EU pharma under AMR standards", src: ["K37"] },
    { v: "HCSP-FAB", stream: "Fab solvents/strippers, TMAH developer concentrate, RO/NF PFAS concentrate", pre: "Fab-native segregation; concentrate take-off at point of origin", mat: "Titanium-lined or HF-rated reactor; CaF₂-compatible polish", model: "Point-of-origin service at 30–70% of off-site disposal cost", first: "New AZ/TX/NY fabs under PFAS permit scrutiny", src: ["K40"] },
    { v: "HCSP-HAZ", stream: "Halogenated solvents, pesticide/POPs waste, chlorinated concentrates", pre: "None (streams arrive concentrated); chloride pre-screening", mat: "Inconel 625 at 600 °C (0.6 mm/yr demonstrated); titanium liner option", model: "Premium destruction service vs. $15–50+/gal incineration", first: "Agrochemical complexes, POPs stockpile programs, chemical parks", src: ["K33", "K57"] },
    { v: "HCSP-BIO", stream: "Dewatered municipal biosolids/sludge cake (≥20–25% solids)", pre: "Screw-press/belt dewatering to autothermal cake", mat: "Standard Inconel core; grit/salt management package", model: "Regional WDaaS hub + mobile units; grant-funded demos", first: "Crisis-priced Northeast/Florida/California utilities", src: ["K43"] },
    { v: "HCSP-AG", stream: "CEA nutrient runoff, RO reject, pesticide/CIP side streams", pre: "None economical at 1,000–1,500 mg/L TDS; destruction for pesticide side-streams", mat: "Standard core", model: "Service/lease only (customer base cannot fund CapEx)", first: "California cultivators in sewer-restricted jurisdictions", src: ["K36"] },
    { v: "HCSP-VIN (v2)", stream: "Distillery/ethanol vinasse (spent wash), COD 100,000–160,000 mg/L; grain-ethanol thin stillage", pre: "None — the stream arrives autothermal; optional potash-from-solids recovery per the CPCB-accepted route", mat: "Standard Inconel 625 core; high-salt (potash-bearing) solids-management package", model: "ZLD compliance retrofit displacing MEE + boiler incineration; steam/power export credited against the distillery utility bill", first: "~270 Indian molasses distilleries under the CPCB mandate; Brazilian cane mills second", src: ["K61", "K62", "K63"] },
    { v: "HCSP-TRI (v2)", stream: "Any concentrated feed (≥80–100 g/L COD) at hosts with continuous cooling demand: F&B, cold storage, district cooling", pre: "Host-dependent concentration train; feed blending to hold the autothermal threshold", mat: "Standard core + back-pressure/extraction turbine; LiBr chiller for ≥5 °C chilled water (COP 0.7–0.8) or NH₃–H₂O for sub-zero duty (COP 0.4–0.6)", model: "Energy-services contract: distilled water + power + chilled water sold to an anchor load; viable only at ≥500 RT continuous cooling load", first: "F&B and cold-storage complexes; district-cooling networks with metered tariffs", src: ["K84", "K85", "K83"] },
    { v: "HCSP-ISL (v2)", stream: "Island/remote sewage sludge blended with FOG and food waste; remote-camp oily wastes", pre: "Dewatering plus FOG/food-waste blending to reach autothermal feed strength", mat: "Standard core, marinized enclosure; diesel-genset integration", model: "Build-own-operate micro-utility selling water, power, cooling at diesel/desal parity ($0.30–0.52/kWh; $2–5/m³); daily-cycled storage option", first: "Caribbean/USVI/Hawaii resort clusters and coastal municipalities; remote mine camps at $0.30–1.10/kWh diesel", src: ["K65", "K67"] },
  ],

  // ── Ch.10.2 risk register ──
  risks: [
    { r: "Regulatory rollback slows the PFAS demand clock", like: "Medium-High", impact: "High", mit: "Anchor on CERCLA liability and state action (11+ states on AFFF), not federal deadlines", ev: "EBJ cut its 30-yr PFAS market estimate 43%, $230B → $132B (2025)", src: ["K12"] },
    { r: "EPA guidance lag blocks permits", like: "Medium", impact: "Medium-High", mit: "State-level permits and ESTCP/DIU validation; guidance cycle as dated de-risking trigger", ev: "April 2026 interim guidance: 'commercially unproven at scale' — while Revive operates a permitted system", src: ["K55", "K16"] },
    { r: "Historical SCWO salt/corrosion failures (other designs)", like: "Low", impact: "Medium (residual: validation, not physics)", mit: "HCSP's >3,000 °F (≈1,650 °C) in-reactor hydrogen combustion prevents salt deposition by design (manufacturer reports no salt issues) — consistent with in-reactor hydrothermal-flame salt-management research; residual item = third-party publication of prototype long-run data on salty feeds", ev: "Corrosion and salt plugging — not chemistry — killed prior conventional-preheater plants (HydroProcessing, Hanwha); 16–26 mm/yr in lesser alloys", src: ["K20", "K57", "K50", "K1"] },
    { r: "First-mover fragility / capital intensity", like: "High", impact: "High", mit: "Asset-light service entry; milestone-gated CapEx; underwrite the 374Water trajectory, not its deck", ev: "$215,037 FY2025 revenue vs. $21.0M net loss; going-concern language", src: ["K52"] },
    { r: "Incineration re-opening erodes the PFAS niche", like: "Medium (occurred)", impact: "Medium", mit: "Compete on permitting speed, community-opposition risk, on-site liability elimination", ev: "DoD lifted the moratorium Feb 20–Mar 3, 2026 — because waste overflowed storage", src: ["K11"] },
    { r: "Customer capital constraints", like: "High", impact: "Medium", mit: "WDaaS and lease structures; grant-funded demonstrations", ev: "~27% of cannabis operators profitable; 14 CEA bankruptcies in 2025; municipal procurement 3–7 years", src: ["K36", "K44"] },
    { r: "Feed-dependence of all economics", like: "Medium", impact: "High", mit: "Gate every sale on COD screening (≥60–150 g/L or upstream concentrate)", ev: "Autothermal needs ~120–150 g/L COD; near-zero net power only above ~30 g/L organics", src: ["K58", "K59"] },
    { r: "Regional grid-price exposure (auxiliary draw & export value)", like: "Medium", impact: "Medium", mit: "Sequence by grid price (TX/MEA first); EU export value contingent on the heat-integrated variant", ev: "US industrial power spans ~6.6 ¢ (TX) to ~24 ¢ (CA commercial) — tripling what auxiliary draw costs and exported kWh earn", src: ["K23", "K24"] },
    { r: "Independent documentation of the self-fueling energy balance", like: "Medium", impact: "Medium", mit: "Publish prototype data — the on-demand hydrogen loop is manufacturer-stated and prototype-backed; independent verification converts the claim into a diligence asset", ev: "Per the manufacturer briefing: fuel generated on demand from process water, negligible net energy cost once started; a working prototype exists", src: ["K1"] },
    { r: "Scale-up beyond the demonstrated envelope (new in v2)", like: "High", impact: "High", mit: "Build the ladder as parallel trains (effective exponent n ≈ 0.85), never giant single vessels; stage-gate each rung on availability data from the rung below", ev: "No SCWO plant above 306 t/d has ever operated; the two largest ever built are both defunct; the LANL 5,000 m³/day design anchoring hub economics is a study, not a plant", src: ["K76", "K96", "K72"] },
    { r: "Storage/supply-chain sole-sourcing — NiFe (new in v2)", like: "Medium", impact: "Medium", mit: "Default to LFP for standby/black-start on every unit; dual-source NiFe (Chinese TN-series) only for daily-cycled remote variants; track the UCLA nanostructured revival as a 5–10-yr option", ev: "The dominant US NiFe vendor went bankrupt June 2023 leaving a Chinese-only supply base; NiFe self-discharges 20–30%/month and costs ~$400–1,000/kWh against $70/kWh LFP packs", src: ["K91", "K87", "K88"] },
  ],

  // ── Verdict scale evidence (P18) — v2: fifteen industries, scale & crossover added ──
  verdict: {
    bull: [
      { t: "Federally validated destruction: 99.9993% DRE on AFFF (USACE ERDC)", src: ["K2"] },
      { t: "Incumbent umbrella $5–28/gal vs. an HCSP that is self-fueling once started (cost model pending)", src: ["K9", "K10", "K22"] },
      { t: "No-air-permit moat: sealed system vs. 24 combustors at 88–92% utilization", src: ["K34", "K1"] },
      { t: "Dated demand clocks: AFFF Oct-2026, landfill ELG 2026–28, CPCB distillery ZLD, MCL 2031", src: ["K14", "K7", "K62"] },
      { t: "DoD liability >$9.3B across 718 installations", src: ["K13"] },
      { t: "Scale + feed strength invert the energy line: net-zero ~35–40 g/L COD, −60 kWhₑ/m³ export at 150 g/L, $9–20B/yr consolidated SAM", src: ["K73", "K70"] },
    ],
    bear: [
      { t: "30-year graveyard: corrosion and salt plugging, not chemistry, killed conventional designs — HCSP's documented design answer (>3,000 °F in-reactor combustion; no salt issues reported) still needs published prototype data", src: ["K49", "K50", "K1"] },
      { t: "Listed leader: $215k revenue vs. $21.0M loss, going-concern language", src: ["K52"] },
      { t: "EBJ downgraded the 30-yr PFAS pool 43% on deregulation", src: ["K12"] },
      { t: "DoD re-opened the incineration pathway (Feb–Mar 2026)", src: ["K11"] },
      { t: "Water value ~$3.5/m³ cannot carry module economics — the business must be priced as destruction, with energy export above ~35–60 g/L COD", src: ["K23", "K31"] },
      { t: "Scale is unproven: no SCWO train above 306 t/d has ever operated; hub economics are interpolated design studies", src: ["K76", "K96"] },
    ],
    upgrades: [
      { t: "Pilot-verified net energy with heat recovery (near-zero >30 g/L organics)", src: ["K59"] },
      { t: "EPA guidance revision recognizing commercial SCWO operations", src: ["K55"] },
      { t: "Landfill ELG finalized — ~2,600 MSW landfills become mandatory buyers", src: ["K7"] },
    ],
    falsifiers: [
      { t: "Third-party long-run data on salty feeds contradicts the manufacturer's no-salt-deposition design answer (>3,000 °F in-reactor combustion)", src: ["K20", "K1"] },
      { t: "CERCLA designation or 4 ppt MCLs vacated on appeal", src: ["K5", "K6"] },
      { t: "A permitted incineration build-out collapses the $5–28/gal umbrella", src: ["K34"] },
    ],
  },

  // ── Destruction evidence record ──
  evidence: [
    { v: "99.9993%", what: "Total PFAS destruction & removal on AFFF — AirSCWO 6, USACE ERDC evaluation", src: ["K2"] },
    { v: ">99.9%", what: "All four concentrated liquid PFAS streams — DIU/ESTCP demonstration (Apr 2026)", src: ["K3"] },
    { v: "≥99.9%", what: "Three commercial AFFF formulations — Battelle PFAS Annihilator, peer-reviewed field work", src: ["K16"] },
    { v: ">99.9999%", what: "Chemical-weapons hydrolysate over ~5,800 h — NRC-reviewed (Blue Grass)", src: ["K51"] },
    { v: ">6M gal", what: "Destroyed across ~200 waste types at >99.99% — GA PERSES, EPA-verified", src: ["K17"] },
    { v: "99.42%", what: "COD removal on real pesticide wastewater, 600 °C/25 MPa (Inconel 625, 0.6 mm/yr)", src: ["K57"] },
  ],

  // ── Ch.11.2 v2 scale ladder: four rungs on dilute aqueous feed (COD 5–20 g/L, non-autothermal base) ──
  // Cost and CapEx figures were removed: they came from a modeled stack, not from the
  // manufacturer — HCSP cost model pending. Net-energy (kWh/m³) ranges are kept as
  // energy-balance model outputs, not costs.
  scale_ladder: [
    { m3d: 10,   name: "Module",        kwh: [130, 250],
      note: "130–250 kWh/m³ brackets the 294 kWh/m³ AirSCWO 6 field point on weak concentrate. Module CapEx and $/m³ cost: TBD — manufacturer cost model pending (market reference: AirSCWO 6's $5.2M equipment-plus-operation contract at OC San).", src: ["K70", "K18", "K54"] },
    { m3d: 100,  name: "Industrial hub", kwh: [80, 160],
      note: "The rung where HCSP crosses into treatment-market territory — overlaps hazardous/biosolids disposal bands; matches the vendor's ~$50/wet t projection at 30 t/d. Cost: TBD — manufacturer cost model pending.", src: ["K70", "K71"] },
    { m3d: 1000, name: "Plant",         kwh: [45, 110],
      note: "First rung where autothermal operation + ORC bottoming pays; LANL base case 55.8 kWhₑ/m³ at 5,000 m³/d brackets the low end. Cost: TBD — manufacturer cost model pending.", src: ["K70", "K72"] },
    { m3d: 1900, name: "Regional hub (500k gpd)", kwh: [35, 88],
      note: "No train above ~306 t/d has ever operated; the LANL 5,000 m³/day design is a study, not a plant — its $2–3/m³ is an autothermal design bound for the technology class, not an HCSP price. HCSP cost: TBD — manufacturer cost model pending.", src: ["K70", "K76", "K72"] },
  ],
  scale_meta: {
    exponent: "CapEx scales at n ≈ 0.5–0.7 per train (NETL/LANL basis); modular parallelization blends the plant-level exponent toward 0.85 — every case above ~100 m³/day is priced on the pessimistic branch.",
    physics: "Gross duty is scale-invariant at ~866 kWh_th/m³ (25→400 °C at 25 MPa) plus ~9 kWhₑ/m³ pumping; what scale buys is heat-exchanger area.",
    limit: "The largest single-train SCWO plant ever reported processed 306 t/d; every larger concept — including the LANL 5,000 m³/day design — is a study, not a plant.",
    src: ["K74", "K75", "K76", "K79"],
  },

  // ── Ch.11.3 v2 energy crossover: net electricity vs feed COD (hub with power recovery) ──
  crossover: {
    // LANL integrated SCWO-desalination model: +18 → −60 kWhₑ/m³ as feed rises 0 → ~160 g/L COD (0→53 g/L hydrocarbon), Rankine 37.8% η
    hub_line: [[0, 18], [160, -60]],
    module_band: [[5, 250, 130], [30, 120, 60], [60, 55, 18], [100, 30, 4], [150, 25, 0]], // [COD, hi, lo] — approaches zero, does not cross
    net_zero: 37.5,      // ~35–40 g/L COD
    export_from: 60,     // meaningful export ≥10 kWhₑ/m³
    streams: [
      { name: "Brewery effluent", cod: [2, 6], side: "below", note: "2–6 g/L — structurally below the line; digestion owns this stream.", src: ["K103"] },
      { name: "Fab bulk effluent", cod: [0.5, 5], side: "below", note: "12,000–23,000 m³/day per fab of dilute stream treated conventionally at $0.5–2/m³ — a 100–400× cost gap no SCWO configuration closes.", src: ["K40"] },
      { name: "Corn-ethanol stillage", cod: [27, 27], side: "below", note: "~27 g/L — just under the line; needs blending or mild concentration.", src: ["K103"] },
      { name: "Produced water", cod: [1, 20], side: "below", note: "Organic loading in most basins far below the LANL design assumption; salinity is an inorganic problem SCWO does not solve.", src: ["K72", "K59"] },
      { name: "Dewatered biosolids", cod: [70, 90], side: "above", note: "Sludge COD >70 g/L (Ringsjöverket operated autothermally) — crosses into export territory.", src: ["K78"] },
      { name: "Brazilian raw vinasse", cod: [77, 77], side: "above", note: "Independently measured 77 g/L total COD.", src: ["K102"] },
      { name: "Molasses vinasse", cod: [100, 160], side: "above", note: "100–160 g/L — the strongest SCWO-native feed in the vertical scan; squarely in the export band.", src: ["K61"] },
      { name: "Pharma mother liquors", cod: [80, 200], side: "above", note: "Segregated strong streams well above the 2–80 g/L bulk-effluent range.", src: ["K37"] },
    ],
    ceiling: "Sludge-fed plants corroborate the export ceiling: SCWO at 10% dry solids is a net energy producer with 3.0–3.5 MWh/tDS recoverable (WSAA 2025).",
    src: ["K73", "K77"],
  },

  // ── Ch.12 v2 trigeneration: heat-allocation cascade, 1,000 m³/day @ 100 g/L COD, 80% heat recovery ──
  trigen: {
    basis: "1,000 m³/day plant, 100 g/L COD feed, 80% heat recovery, 8,000 operating h/yr",
    gross: 16.1,       // MW_th reaction heat (13.88 kJ/g COD)
    preheat: 6.5,      // MW_th internal preheat duty — the price of autothermal operation (~60% of gross)
    surplus: 9.6,      // MW_th exportable
    surplus_range: [6.4, 11.2],  // heat-recovery efficiency 70–85%
    power: 1.4,        // MW_e via back-pressure/extraction turbine (high-temperature slice)
    cooling_heat: 8.2, // MW_th at 150–180 °C into absorption generator
    cooling: 4.9,      // MW_c ≈ 1,392 RT (NH₃–H₂O at COP 0.6)
    water: "~900 m³/day recovered distilled water",
    value: "$1.15M/yr",       // optimal cascade at 8,000 h
    value_cooling_only: "$0.79M/yr", // if the entire surplus were committed to cooling alone
    hierarchy: [
      { form: "Power (small steam turbine, 15–20% η)", val: "$15–20", per: "MWh_th", note: "0.15–0.20 MWhₑ per MWh_th at $0.10/kWh industrial.", src: ["K83"] },
      { form: "Absorption cooling (COP 0.6)", val: "~$10", per: "MWh_th", note: "Avoids ~0.10 MWh of electric-chiller consumption (modern chillers 0.5–0.6 kW/RT) — half to two-thirds the power rate.", src: ["K83"] },
      { form: "District chilled water, sold retail", val: "$30–48", per: "MWh_th", note: "The decisive exception: Singapore Marina Bay / Dubai Empower metered-utility tariffs make cooling leapfrog power.", src: ["K83"] },
    ],
    chillers: [
      { chem: "LiBr–H₂O (single-effect)", cop: "0.7–0.8", drive: "70–120 °C hot water", floor: "Above freezing only (~5 °C)", duty: "HVAC, data halls, campuses, district cooling", safety: "Non-toxic; building-safe", scale: "50 RT to >3,300 RT catalogue machines", src: ["K84"] },
      { chem: "NH₃–H₂O (single-effect)", cop: "0.4–0.6 literature; 0.6–0.75 design guide", drive: "95–180 °C (min ~82 °C / ~20 psig steam)", floor: "Sub-zero to −60 °C", duty: "Cold storage, ice plants, food/dairy process refrigeration", safety: "Toxic (IDLH 300 ppm); OSHA PSM / EPA RMP >10,000 lb", scale: "~17–750 kW engineered-to-order", src: ["K84", "K85"] },
    ],
    limits: "Underwrite cooling at the conservative end: field-measured ammonia-absorption COP on waste heat came in at 0.28–0.45 (vs 0.6 design); ≥500 RT continuous load minimum; absorption is a displacement layer — full electric backup is built regardless.",
    src: ["K80", "K81", "K82", "K86"],
  },

  // ── Ch.13 v2 backup-power storage comparison ──
  storage: [
    { chem: "NiFe (Edison)", cycles: "2,000–4,000 commodity (vendor claims 11–15k)", calendar: "30–50 yr (electrolyte refresh ~10 yr)", selfdis: "20–30%/mo", rte: "60–75%", cost: "$400–1,000/kWh", density: "19–25 Wh/kg",
      verdict: "NICHE — daily-cycled, extreme-temperature, multi-decade remote deployments only", role: "niche",
      note: "Durability verified (century-old Edison cells function; MIT/DoD cites ~30 yr). But 20–30%/mo self-discharge is disqualifying for standby: a dark site for 6–8 weeks arrives at the emergency flat. Continuous H₂ gassing mandates ventilated enclosures; US leader Iron Edison bankrupt June 2023 — supply base now Chinese (IEC 60623). UCLA nanostructured NiFe (Feb 2026) is a 5–10-yr watch item.", src: ["K87", "K91", "K92"] },
    { chem: "LFP lithium", cycles: "4,000–6,000 @ 80–100% DoD", calendar: "10–15 yr", selfdis: "~1–3%/mo", rte: "90–95%", cost: "$70–81/kWh pack ($200–400 small installed)", density: "90–160 Wh/kg",
      verdict: "DEFAULT — standard UPS/black-start battery on every HCSP unit", role: "default",
      note: "Wins every row that governs standby duty, most by an order of magnitude: NiFe loses in 30 days roughly what LFP loses in a year. Weaknesses — thermal-runaway onset ~270 °C (lowest-risk Li-ion) and no sub-0 °C charging — are manageable inside a conditioned skid. Dominant, oversupplied supply chain (BNEF Dec 2025).", src: ["K88", "K89"] },
    { chem: "Lead-acid (VRLA)", cycles: "300–800 @ 80% DoD", calendar: "3–5 yr real UPS life", selfdis: "~2–4%/mo", rte: "75–85%", cost: "~$150–200/kWh", density: "30–50 Wh/kg",
      verdict: "FALSE ECONOMY — cheapest credible standby, but 3–5-yr replacement cadence on a 20-yr plant", role: "incumbent",
      note: "The UPS incumbent: low self-discharge, no thermal runaway. But real-world life is 3–5 years regardless of 10-yr design ratings, usable DoD only 30–50%, and life halves every 8–10 °C above 25 °C — multiplying logistics cost at exactly the remote sites where NiFe is attractive.", src: ["K89"] },
    { chem: "Vanadium redox flow", cycles: ">10,000 (effectively unlimited)", calendar: "~12–25 yr (stack ~12 yr)", selfdis: "Near-zero in tanks", rte: "~65–75%", cost: "~$300–750/kWh installed", density: "16–35 Wh/L (very bulky)",
      verdict: "EXCLUDED — a utility-storage answer, not a skid-mounted backup answer", role: "excluded",
      note: "Unlimited cycle life and no thermal runaway, but far too bulky for a containerized skid, the narrowest temperature window (10–40 °C electrolyte), and economics that only close at multi-hour utility-scale durations a 95 kW module does not need.", src: ["K90"] },
  ],
  storage_rule: "Specify LFP as the standard UPS/black-start battery on every unit — default bill of materials, not a site option. NiFe only when most of: daily-cycled off-grid (self-discharge irrelevant); ambient extremes (<−20 °C or >45 °C sustained); replacement logistics dominate lifecycle cost; buyer accepts Chinese-sourced IEC 60623 hardware verified against the 2,000–4,000-cycle benchmark. Where NiFe qualifies, the architecture is hybrid — a small LFP string for instant black-start.",
  storage_src: ["K87", "K88"],

};
// ═══ Part III — Funding (compiled from HCSP_Grants_Database.xlsx + HCSP_Grants_Strategy.md, 2026-09) ═══
Object.assign(window.RPT, {
  grants_register: [
  {
    "id": "G-001",
    "program": "Clean Water SRF (CWSRF) incl. IIJA Emerging Contaminants supplement",
    "level": "Federal",
    "agency": "EPA Office of Water -> state SRF programs",
    "type": "Sub-grant via partner",
    "award": "State-set; FY26 ~$746M state allotments + $2.6B IIJA + $225M EC tranche (final IIJA year)",
    "access": "No—via utility partner",
    "fit": "Water; Power; PFAS destruction",
    "vertical": "Municipal biosolids; PFAS concentrate; wastewater reuse",
    "status": "ACTIVE",
    "deadline": "Rolling; annual state IUPs (summer-fall)",
    "match": 4,
    "notes": "FY2026 is the final IIJA/BIL supplemental year (incl. $225M CWSRF emerging-contaminants tranche); FY27 House proposal ~16% cut; WRDA 2026 would add emerging-contaminants eligibility. Access via POTW/utility partner on state IUP.",
    "url": "https://www.epa.gov/cwsrf",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-002",
    "program": "Drinking Water SRF (DWSRF) incl. $4B PFAS/emerging-contaminants funds",
    "level": "Federal",
    "agency": "EPA Office of Water -> state SRF programs",
    "type": "Sub-grant via partner",
    "award": "FY26 ~$411M state allotments + ~$3.4B IIJA; $4B PFAS/EC over 5 yrs",
    "access": "No—via utility partner",
    "fit": "Water; PFAS destruction",
    "vertical": "Drinking-water PFAS compliance; small/disadvantaged systems",
    "status": "ACTIVE",
    "deadline": "Rolling; annual state IUPs",
    "match": 4,
    "notes": "$4B of DWSRF dedicated to PFAS/emerging contaminants; destruction slots in as residuals management of BAT (GAC/IX/RO) concentrate streams; WRDA 2026 would add explicit PFAS eligibility to DWSRF.",
    "url": "https://www.epa.gov/dwsrf",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-003",
    "program": "Emerging Contaminants in Small or Disadvantaged Communities (EC-SDC) grants",
    "level": "Federal",
    "agency": "EPA -> states/territories",
    "type": "Sub-grant via partner",
    "award": "$5B FY2022-26 total; final $1B announced May 2026",
    "access": "No—via utility partner",
    "fit": "PFAS destruction; Water",
    "vertical": "Small/disadvantaged community water systems",
    "status": "ACTIVE",
    "deadline": "State-driven; final BIL allotment year 2026",
    "match": 4,
    "notes": "Final $1B year announced May 19 2026 (CA $77.3M, NY $40.5M, NJ $33.6M, AZ $20M); EPA framed the round as supporting innovation in destruction and disposal technologies; company participates as vendor to the water system.",
    "url": "https://www.epa.gov/dwcapacity",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-004",
    "program": "WIFIA (Water Infrastructure Finance and Innovation Act) + SWIFIA",
    "level": "Federal",
    "agency": "EPA",
    "type": "Loan",
    "award": "Loans up to 49% of project costs; $20M min project ($5M small communities); ~$11B credit capacity available",
    "access": "Yes",
    "fit": "Water; Power; PFAS destruction",
    "vertical": "Water reuse; desalination; biosolids-to-energy; alternative supply",
    "status": "ACTIVE",
    "deadline": "Rolling Letters of Interest, year-round",
    "match": 5,
    "notes": "Direct private access unusually broad (corporations, JVs, trusts) but private projects need public sponsorship; FY26-27 small-community fee waivers ($25K application + ~$156K credit-processing); statutory authorization expires after FY2026 - WRDA 2026 would extend.",
    "url": "https://www.epa.gov/wifia",
    "src": [
      "K128"
    ]
  },
  {
    "id": "G-005",
    "program": "WaterSMART Title XVI Water Reclamation & Reuse (R26AS00079)",
    "level": "Federal",
    "agency": "Bureau of Reclamation",
    "type": "Grant",
    "award": "Ceiling $40M; 25% federal cost share; FY26 competitive pot cut to ~$10M",
    "access": "No—via utility partner",
    "fit": "Water",
    "vertical": "Western water reuse / recycled water",
    "status": "ACTIVE",
    "deadline": "Deadlines Aug 26 2026 and Aug 26 2027",
    "match": 3,
    "notes": "17 Western states only; applicant must have water or power delivery authority - company partners as technology provider; FY26 appropriations cut 58%, but ~$200M Colorado River Basin reuse investments announced (e.g. $179M Phoenix).",
    "url": "https://www.usbr.gov/watersmart/title/titlexvi.html",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-006",
    "program": "WaterSMART Desalination Construction Projects (R26AS00034)",
    "level": "Federal",
    "agency": "Bureau of Reclamation",
    "type": "Grant",
    "award": "Up to $120M per project",
    "access": "No—via utility partner",
    "fit": "Water; Power",
    "vertical": "Desalination; brine/ZLD; alternative supply",
    "status": "ACTIVE",
    "deadline": "Due Aug 26 2026 / Aug 26 2027",
    "match": 3,
    "notes": "Western states; partner with an eligible water authority; HCSP distilled-water output and energy co-production fit the desalination/purification framing.",
    "url": "https://www.usbr.gov/watersmart/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-007",
    "program": "WaterSMART Large-Scale Water Recycling Projects (R25AS00322)",
    "level": "Federal",
    "agency": "Bureau of Reclamation",
    "type": "Grant",
    "award": "25% federal share; projects >=$500M total cost",
    "access": "No—via utility partner",
    "fit": "Water",
    "vertical": "Municipal-scale water recycling",
    "status": "WATCH",
    "deadline": "FY26 deadline May 13 2026 (closed); watch FY27 NOFO",
    "match": 2,
    "notes": "Only for very large projects; track the FY27 cycle with a major Western utility partner.",
    "url": "https://www.usbr.gov/watersmart/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-008",
    "program": "WaterSMART small grants (WEEG, SWEP, Drought Resiliency, Applied Science, Enhancing Water Resources)",
    "level": "Federal",
    "agency": "Bureau of Reclamation",
    "type": "Grant",
    "award": "$100K-$5M tiers; 25-50% cost share; $38.9M WEEG awarded to 31 projects in 2026",
    "access": "No—via utility partner",
    "fit": "Water; Power",
    "vertical": "Water/energy efficiency at utilities",
    "status": "ACTIVE",
    "deadline": "Enhancing Water Resources due Sep 9 2026; others re-offer periodically",
    "match": 2,
    "notes": "WEEG up to $5M (50% cost share); several FY26 deadlines passed; marginal SCWO fit except via efficiency framing; nonprofits may co-apply with a Category A entity.",
    "url": "https://www.usbr.gov/watersmart/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-009",
    "program": "Desalination & Water Purification Research (DWPR) NOFO",
    "level": "Federal",
    "agency": "Bureau of Reclamation R&D Office",
    "type": "Grant",
    "award": "Lab-scale up to $300K federal; pilot-scale up to $800K federal; $5.7M total FY26",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Produced water; municipal wastewater; impaired waters",
    "status": "OPEN-DEADLINE",
    "deadline": "Due 4:00 p.m. MT September 29 2026 (posted Jul 29 2026)",
    "match": 5,
    "notes": "Best near-term direct-apply federal grant: for-profit firms eligible directly; produced water and municipal wastewater are named eligible source waters; ~75% non-federal cost share for pilots; also watch companion Pitch-to-Pilot NOFO (last issued FY2024).",
    "url": "https://www.usbr.gov/research/dwpr/index.html",
    "src": [
      "K116"
    ]
  },
  {
    "id": "G-010",
    "program": "EPA SBIR (Phase I/II contracts)",
    "level": "Federal",
    "agency": "EPA",
    "type": "Grant",
    "award": "Phase I ~$100K/6 mo; Phase II up to $400K + $100K commercialization option",
    "access": "Yes",
    "fit": "PFAS destruction; Water",
    "vertical": "PFAS in sludge/biosolids; water reuse; concentrate destruction",
    "status": "WATCH",
    "deadline": "No Phase I open as of Sept 2026; annual cadence historically Jun-Aug; Phase II (68HERC25R0203) closed Jul 14 2026",
    "match": 4,
    "notes": "Reauthorized Apr 13 2026 (S. 3971) through Sept 30 2031 after 6.5-month lapse; recurring water topics include PFAS destruction in wastewater sludge/biosolids; join EPA SBIR listserv and pre-position proposal.",
    "url": "https://www.epa.gov/sbir",
    "src": [
      "K108"
    ]
  },
  {
    "id": "G-011",
    "program": "EPA Office of Water competitive grant programs (OSG stormwater reuse; Midsize/Large DW Resilience; Wastewater Efficiency waste-to-energy; Alternative Water Source pilot)",
    "level": "Federal",
    "agency": "EPA Office of Water",
    "type": "Sub-grant via partner",
    "award": "OSG ~$280M/yr authorized; DW resilience first round $9.5M; Wastewater Efficiency <=$4M/recipient; Alternative Water Source $2M FY26 start-up",
    "access": "No—via utility partner",
    "fit": "Water; Power",
    "vertical": "Stormwater/water reuse; POTW biosolids-to-energy; alternative supply",
    "status": "WATCH",
    "deadline": "Periodic NOFOs; Wastewater Efficiency authorization lapses after FY26 (watch WRDA 2026); Alternative Water Source first solicitation anticipated",
    "match": 3,
    "notes": "Municipalities/POTWs/water authorities only - company as technology vendor; Wastewater Efficiency Grant Pilot (DWWIA 50202) fits biosolids-to-power but is minimally funded; Alternative Water Source (DWWIA 50203) received first-ever $2M FY26 appropriation.",
    "url": "https://www.epa.gov/cwsrf/sewer-overflow-and-stormwater-reuse-municipal-grants-program",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-012",
    "program": "EPA STAR / National Priorities research grants",
    "level": "Federal",
    "agency": "EPA ORD",
    "type": "Sub-grant via partner",
    "award": "Typically $500K-$1.5M to academic primes",
    "access": "No—via other partner",
    "fit": "PFAS destruction; Water",
    "vertical": "PFAS in landfills/leachates; biosolids; water reuse research",
    "status": "WATCH",
    "deadline": "No open RFAs as of Aug 2026; RFAs intermittent",
    "match": 2,
    "notes": "For-profits not eligible as prime; participate as subcontractor on university-led proposals; closed RFAs (PFAS destruction in landfills/leachates, biosolids, reuse) indicate recurring topics.",
    "url": "https://www.epa.gov/research-grants",
    "src": [
      "K147"
    ]
  },
  {
    "id": "G-013",
    "program": "EPA Environmental Justice grant programs (Community Change, Thriving Communities, EJCPS, EJG2G, EJ Small Grants)",
    "level": "Federal",
    "agency": "EPA",
    "type": "Grant",
    "award": "~$2.2B+ previously committed",
    "access": "No",
    "fit": "-",
    "vertical": "-",
    "status": "DEAD",
    "deadline": "Terminated 2025; unobligated IRA funds rescinded by OBBBA; litigation ongoing",
    "match": 1,
    "notes": "781 grants terminated; EJ offices closed; June 2025 court ruling against terminations under appeal; wrong applicant type regardless (community nonprofits). Do not pursue.",
    "url": "https://grantedai.com/blog/epa-environmental-justice-grants-2026-what-nonprofits-need-to-know",
    "src": [
      "K105"
    ]
  },
  {
    "id": "G-014",
    "program": "EPA technical-assistance initiatives (PFAS OUTreach, RealWaterTA, SWIFT)",
    "level": "Federal",
    "agency": "EPA",
    "type": "Sub-grant via partner",
    "award": "Technical assistance only (non-monetary)",
    "access": "No—via utility partner",
    "fit": "PFAS destruction; Water",
    "vertical": "Small/rural water systems; utility resilience",
    "status": "WATCH",
    "deadline": "Ongoing 2026 engagements",
    "match": 2,
    "notes": "Not grant programs - market channels: PFAS OUT (launched Apr 14 2026) drives PFOA/PFOS MCL compliance demand; EPA PFAS destruction technology event (May 2026) is a direct demand signal for destruction tech; engage as technology vendor.",
    "url": "https://www.epa.gov/aboutepa/epa-racking-massive-environmental-accomplishments-under-trump-administration",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-015",
    "program": "DOE CMEI applied offices: Alternative Fuels & Feedstocks (ex-BETO) and Hydropower & Hydrokinetic (ex-WPTO)",
    "level": "Federal",
    "agency": "DOE CMEI (AFFO / H2O)",
    "type": "Grant",
    "award": "AFFO historically $500K-$2M+ per award (FY26 $245M); H2O FY26 $220M",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Wet wastes (sludge, manure, food waste) to energy/fuels",
    "status": "WATCH",
    "deadline": "No open AFFO NOFO as of Jul 2 2026; NOFO-driven; monitor CMEI eXCHANGE",
    "match": 2,
    "notes": "AFFO funded but quiet ('no current open bioenergy funding opportunities'); emphasis shifted to fuels/SAF - good fit if a wet-waste NOFO opens. H2O scoped to hydro/marine energy: poor fit. Companion Waste-to-Energy TA targets governments (pull-through route).",
    "url": "https://www.energy.gov/cmei/fuels/bioenergy-technologies-funding-opportunities",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-016",
    "program": "DOE Industrial Efficiency & Decarbonization Office (IEDO) NOFOs / Onsite Energy TAPs / prizes",
    "level": "Federal",
    "agency": "DOE CMEI - IEDO",
    "type": "Grant",
    "award": "TAP awards $900K-$8M; FOAs to $100M+ total; FY26 $390M adv. manufacturing/industrial lines",
    "access": "Yes",
    "fit": "Power; PFAS destruction",
    "vertical": "Industrial wastewater at food/beverage, chemical, dairy plants",
    "status": "WATCH",
    "deadline": "No large open NOFO confirmed as of Aug 2026; monitor eXCHANGE",
    "match": 3,
    "notes": "Frame HCSP as decarbonizing wastewater treatment with onsite power at industrial hosts; cost share typically 20-50% for demos; IEDO remains an active DOE SBIR topic owner (C60-09).",
    "url": "https://www.energy.gov/eere/iedo",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-017",
    "program": "DOE OCED clean energy demonstrations (incl. ERA rural/remote energy, $1B)",
    "level": "Federal",
    "agency": "DOE OCED",
    "type": "Grant",
    "award": "$10M-$100M+ demonstration awards",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Rural distributed energy; industrial demonstrations",
    "status": "DEAD",
    "deadline": "Office abolished Nov 2025; awards terminated/under portfolio review",
    "match": 1,
    "notes": "24 awards ($3.7B) terminated May 2025 plus ~$7.56B more Oct 2025; OBBBA rescinded unobligated balances; FY26 budget request $0; ERA no longer available (GAO-26-107997). Do not build a plan around revival.",
    "url": "https://files.gao.gov/reports/GAO-26-107997/index.html",
    "src": [
      "K106"
    ]
  },
  {
    "id": "G-018",
    "program": "DOE SBIR/STTR (Office of Technology Commercialization)",
    "level": "Federal",
    "agency": "DOE OTC",
    "type": "Grant",
    "award": "Phase I <=$323K; Phase II <=$2.15M; Strategic Breakthrough Awards up to $30M",
    "access": "Yes",
    "fit": "Power; PFAS destruction",
    "vertical": "Waste-conversion subtopics (historically IEDO/bioenergy)",
    "status": "ACTIVE",
    "deadline": "FY26 Genesis Mission pitches due Sep 10 2026 (AI-centric topics); regular applied-office releases expected to normalize FY27",
    "match": 4,
    "notes": "Reauthorized through 2031; SCWO/hydrothermal firms funded historically via EERE/IEDO topics; LOI mandatory before full application; new foreign-risk screening and per-firm proposal caps.",
    "url": "https://www.energy.gov/technologycommercialization/doe-small-business-innovation-research-sbir-and-small-business",
    "src": [
      "K108"
    ]
  },
  {
    "id": "G-019",
    "program": "ARPA-E programs (RECOVER successors, SCALEUP Ready, IGNIITE 2026)",
    "level": "Federal",
    "agency": "DOE ARPA-E",
    "type": "Grant",
    "award": "Typically $1M-$10M; IGNIITE up to $500K (+$250K Director's Award); cost share 5-20%",
    "access": "Yes",
    "fit": "Power; Water",
    "vertical": "Energy/resource recovery from wastewater; produced water",
    "status": "ACTIVE",
    "deadline": "Rolling NOFOs on eXCHANGE; IGNIITE full applications closed Aug 26 2026",
    "match": 3,
    "notes": "RECOVER ($36M awarded; full apps closed Aug 2025) targeted ammonia/critical-metals recovery from municipal/feedlot/produced/mining waters - watch for successor NOFOs; SCALEUP Ready (DE-FOA-0003467, rolling) only after an ARPA-E award.",
    "url": "https://arpa-e-foa.energy.gov/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-020",
    "program": "DOE Title 17 Energy Financing (Office of Energy Dominance Financing, incl. EDFP / ex-1706 EIR)",
    "level": "Federal",
    "agency": "DOE EDF (ex-LPO)",
    "type": "Loan guarantee",
    "award": "Loan guarantees ~$100M into the $Bs; $1B new EDFP credit subsidy",
    "access": "Yes",
    "fit": "Power",
    "vertical": "First-of-a-kind commercial plant exporting power",
    "status": "ACTIVE",
    "deadline": "Rolling applications (Program Guidance issued May 13 2026); EDFP conditional-commitment authority to Sep 30 2028",
    "match": 3,
    "notes": "Realistic only at >=$50-100M capex given diligence costs; GHG-reduction requirement removed by OBBBA; waste-to-power adding firm capacity can fit 'output increase / grid reliability' categories; SEFI co-support lowers thresholds; borrower-paid subsidy possible but expensive.",
    "url": "https://www.energy.gov/documents/doe-edf-title-17-energy-financing-program-guidance-2026-05-13",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-021",
    "program": "USDA REAP grants (Rural Energy for America Program RES/EEI)",
    "level": "Federal",
    "agency": "USDA RD - Rural Business-Cooperative Service",
    "type": "Grant",
    "award": "Historically up to 25-50% of project cost; ~$1M grant ceiling (RES)",
    "access": "Yes",
    "fit": "Power",
    "vertical": "CAFO/dairy manure wastewater; rural industrial hosts",
    "status": "PAUSED",
    "deadline": "No FY26 grant NOFO; rule rewrite (7 CFR 4280 Subpart B) under EO 14315; Oct 2024 notice to be rescinded - applicants must reapply",
    "match": 3,
    "notes": "Rural host (ag producer >=50% ag income, or rural small business) applies with HCSP as vendor; grants paused per USDA Mar 31 2026 announcement; high fit when reopened.",
    "url": "https://www.rd.usda.gov/programs-services/energy-programs/rural-energy-america-program-renewable-energy-systems-energy-efficiency-improvement-guaranteed-loans",
    "src": [
      "K110"
    ]
  },
  {
    "id": "G-022",
    "program": "USDA REAP guaranteed loans",
    "level": "Federal",
    "agency": "USDA RD - Rural Business-Cooperative Service",
    "type": "Loan guarantee",
    "award": "Up to 75% of eligible project cost; guarantee max $25M (farm-bill draft would raise to $50M)",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Rural waste-to-energy deployments",
    "status": "ACTIVE",
    "deadline": "Rolling, year-round via OneRD framework",
    "match": 4,
    "notes": "OPEN now; biodigester/CEA carve-out paused through Dec 31 2026, but SCWO is not an anaerobic biodigester under USDA's own definition - get written confirmation from the state energy coordinator early.",
    "url": "https://www.rd.usda.gov/programs-services/energy-programs/rural-energy-america-program-renewable-energy-systems-energy-efficiency-improvement-guaranteed-loans",
    "src": [
      "K110"
    ]
  },
  {
    "id": "G-023",
    "program": "USDA RUS Water & Waste Disposal Loan & Grant Program",
    "level": "Federal",
    "agency": "USDA Rural Utilities Service",
    "type": "Loan",
    "award": "40-yr low-interest loans; grants up to ~75% of cost for lowest-income communities; guarantee variant to 50,000 pop.",
    "access": "No—via other partner",
    "fit": "Water",
    "vertical": "Rural (<=10,000 pop.) wastewater/septage destruction",
    "status": "ACTIVE",
    "deadline": "Rolling, year-round (Oct 1 - Sep 30) via RD Apply",
    "match": 3,
    "notes": "Public bodies, nonprofits, Tribes only; HCSP as technology partner to the rural community applicant; companion Predevelopment Planning / SEARCH grants can fund the host's front-end engineering. Base Farm Bill authority, untouched by 2025-26 cuts.",
    "url": "https://www.rd.usda.gov/programs-services/water-environmental-programs",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-024",
    "program": "USDA Business & Industry (B&I) Guaranteed Loans",
    "level": "Federal",
    "agency": "USDA RD - Rural Business-Cooperative Service",
    "type": "Loan guarantee",
    "award": "Guarantee raised to 85% for loans <$5M (all FY26 obligations); larger loans at lower percentages",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Rural manufacturing/assembly facility; demonstration plant",
    "status": "ACTIVE",
    "deadline": "Rolling, year-round",
    "match": 4,
    "notes": "Direct private access for rural (<50,000 pop.) projects; Feb 12 2026 RBCS guidance gives priority points to energy security / domestic manufacturing; biodigester/CEA pause applies across RBCS through Dec 31 2026 (SCWO not covered - confirm in writing).",
    "url": "https://www.rd.usda.gov/programs-services/business-programs/business-industry-loan-guarantees",
    "src": [
      "K129"
    ]
  },
  {
    "id": "G-025",
    "program": "Federal clean energy tax credits: 45Y PTC / 48E ITC / 45Z clean fuel (48C closed)",
    "level": "Federal",
    "agency": "IRS / Treasury",
    "type": "Grant",
    "award": "45Y 1.5c/kWh with PWA; 48E 30% ITC; 45Z up to $1.00/gal+ (manure feedstocks may claim negative emissions)",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Waste-heat-to-power (WERP); biogas C&G; fuel co-products",
    "status": "ACTIVE",
    "deadline": "45Y/48E in force for non-wind/solar (phaseout from 2032); 45Z fuels sold 2025-2029; 48C fully allocated - closed",
    "match": 2,
    "notes": "Tax credits, not grants. SCWO eligibility uncertain: WERP (waste-heat-to-power at host industrial sites) is the most defensible route; combustion/gasification alternative-fate methane case untested - engage tax counsel before marketing credit monetization; 45Z only if a transportation-fuel co-product; 48C capped at $10B by OBBBA, no Round 3 expected.",
    "url": "https://www.irs.gov/newsroom",
    "src": [
      "K139"
    ]
  },
  {
    "id": "G-026",
    "program": "DOE State Energy Program (SEP) via state energy offices",
    "level": "Federal",
    "agency": "DOE SCEP -> states",
    "type": "Sub-grant via partner",
    "award": "FY26 enacted $66M formula (Congress restored vs. $0 request); residual $500M BIL infusion in state pipelines",
    "access": "No—via other partner",
    "fit": "Power",
    "vertical": "State industrial decarbonization / rural energy sub-programs",
    "status": "ACTIVE",
    "deadline": "State-defined programs and cycles",
    "match": 2,
    "notes": "Indirect: states run demo grants, revolving loans, TA with SEP funds; SEP can support SEFI co-financing that unlocks Title 17 SEFI-supported project eligibility; target states with active industrial decarb or rural energy revolving funds.",
    "url": "https://www.energy.gov/scep/state-energy-program",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-027",
    "program": "SERDP Core BAA (Strategic Environmental Research and Development Program)",
    "level": "Federal",
    "agency": "OUSD(R&E) / SERDP-ESTCP program office",
    "type": "Grant",
    "award": "~$1M-$3M over 3-4 yrs (core); SEED exploratory <=$250K/1 yr",
    "access": "Yes",
    "fit": "PFAS destruction; Water; Power",
    "vertical": "PFAS/AFFF destruction; installation energy & water",
    "status": "WATCH",
    "deadline": "FY28 solicitation expected ~Oct-Nov 2026 (FY27 pre-proposals closed Jan 13 2026)",
    "match": 4,
    "notes": "All sectors eligible via annual BAA; direct SCWO precedents (ER20-5350, ER22-3384, ER22-7338); FY27 SONs had no PFAS destruction topic - target FY28 Environmental Restoration SON; FY27 budget $60.8M.",
    "url": "https://www.serdp-estcp.org/work-with-us",
    "src": [
      "K118"
    ]
  },
  {
    "id": "G-028",
    "program": "ESTCP demonstration/validation (Installation Energy & Water; Environmental Restoration)",
    "level": "Federal",
    "agency": "ODASD (Energy Resilience & Optimization)",
    "type": "Grant",
    "award": "~$0.5M-$3M+ per demonstration (~3 yrs)",
    "access": "Yes",
    "fit": "PFAS destruction; Water; Power",
    "vertical": "DoD installation water resilience; AFFF/PFAS demos; energy resilience",
    "status": "ACTIVE",
    "deadline": "FY28 solicitations expected ~Dec 2026-Jan 2027, pre-proposals ~Mar 2027 (FY27 in selection Sept 2026)",
    "match": 5,
    "notes": "Best overall near-term defense target: TRL 5-7 demos at DoD sites - exactly HCSP's maturation stage; SCWO precedent ER23-7939 (foam fractionation + SCWO); FY27 topics included Water Resilience and Energy Resilience; FY27 budget $125.1M; Oct 2026 AFFF transition deadline drives FY28 demand.",
    "url": "https://www.serdp-estcp.org/Funding-Opportunities/ESTCP-Solicitations",
    "src": [
      "K119"
    ]
  },
  {
    "id": "G-029",
    "program": "DIU Commercial Solutions Opening (prototype Other Transaction)",
    "level": "Federal",
    "agency": "Defense Innovation Unit",
    "type": "Grant",
    "award": "~$500K-$5M negotiated prototypes; follow-on production sole-source (4022(f))",
    "access": "Yes",
    "fit": "Power; Water; Cooling",
    "vertical": "Distributed energy resilience; logistics-burden water production",
    "status": "WATCH",
    "deadline": "Rolling Areas of Interest; none open mid-2026 - register on DIU portal and monitor weekly",
    "match": 3,
    "notes": "Fastest defense path (award ~60-120 days) but requires a mature commercial solution; energy precedents HyTEC, PRISM, ANPI, Finance First; 10 USC 4022 OT authority; no small-business status required.",
    "url": "https://www.diu.mil/work-with-us",
    "src": [
      "K121"
    ]
  },
  {
    "id": "G-030",
    "program": "DoW SBIR/STTR FY27 releases (all components via DSIP; incl. Army Applied SBIR)",
    "level": "Federal",
    "agency": "DoW (defensesolutions.gov) / Army Futures Command",
    "type": "Grant",
    "award": "Phase I ~$250K (Navy up to $315K); Phase II $1.7M-$2.0M; Phase III uncapped (non-SBIR funds)",
    "access": "Yes",
    "fit": "PFAS destruction; Water; Power",
    "vertical": "Expeditionary water; PFAS; contested logistics; microgrids",
    "status": "ACTIVE",
    "deadline": "FY27 Release 1 pre-release expected ~Oct 2026; quarterly closes (FY26 R4 closed Aug 19 2026); Army runs 3 windows/FY",
    "match": 4,
    "notes": "Reauthorized Apr 13 2026; monthly pre-release / quarterly close cadence; watch NAVFAC/Army water & PFAS topics; Army Contested Logistics & Advanced Energy Generation interest areas fit expeditionary water/waste-to-energy; per-firm submission caps and foreign-risk screening apply.",
    "url": "https://www.defensesolutions.gov/",
    "src": [
      "K120"
    ]
  },
  {
    "id": "G-031",
    "program": "Navy SBIR topic lineage N254-123 (expeditionary greywater reuse) / N233-117 (PFAS defluorination)",
    "level": "Federal",
    "agency": "NAVFAC EXWC",
    "type": "Grant",
    "award": "Phase I <=$315K; Phase II ~$1.7M; Phase III transition named (AFCEC/USACE)",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Expeditionary greywater; AFFF concentrate; biosolids; GAC/IX residuals",
    "status": "WATCH",
    "deadline": "N254-123 closed Sep 24 2025 - Phase II / Direct-to-Phase-II pathway now; watch FY27 NAVFAC topics",
    "match": 3,
    "notes": "Direct-fit precedents: autonomous treatment to TB MED 577 reuse standards (N254-123); AFFF concentrate destruction confirmed eligible (N233-117); pursue D2P2 eligibility, Open Topics, or Phase III teaming with current awardees.",
    "url": "https://www.navysbir.com/n25_411/N254-123.htm",
    "src": [
      "K120"
    ]
  },
  {
    "id": "G-032",
    "program": "AFWERX/SpaceWERX Open Topic SBIR (TACFI/STRATFI follow-ons)",
    "level": "Federal",
    "agency": "USAF AFWERX",
    "type": "Grant",
    "award": "Phase I $75K (SBIR)/$110K (STTR); Phase II up to $2M; Direct-to-Phase-II $1.25M; TACFI $375K-$2M; STRATFI $3M-$15M",
    "access": "Yes",
    "fit": "PFAS destruction; Water; Power",
    "vertical": "Contested logistics; AFCEC AFFF cleanout wastewater (hangar rinse-out, F3 transition)",
    "status": "ACTIVE",
    "deadline": "Rolling Open Topic submissions",
    "match": 4,
    "notes": "Requires a Customer Memorandum - cultivate AFCEC as end user; Open Topic rolling post-reauthorization; Agile Combat & Readiness / Contested Logistics is a named area of interest.",
    "url": "https://www.afwerx.com/",
    "src": [
      "K122"
    ]
  },
  {
    "id": "G-033",
    "program": "Watch: DHS S&T SBIR & DARPA BAAs",
    "level": "Federal",
    "agency": "DHS S&T / DARPA",
    "type": "Grant",
    "award": "DHS Phase I ~$150K-$200K, Phase II ~$1M; DARPA $0.5M-$5M+",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Water infrastructure resilience; disaster-site water treatment",
    "status": "WATCH",
    "deadline": "DHS 26.1 pre-solicitation expected ~Nov 2026 (one cycle/yr); DARPA rolling BAAs",
    "match": 2,
    "notes": "DHS last cycle (25.1, 5 topics, none water/PFAS) closed Jan 2025; DARPA AWE water program concluded (AIR2WATER IV&V Jan 2025); current DARPA topics biotech/AI-heavy - monitor for resource-self-sufficient-base BAAs.",
    "url": "https://www.dhs.gov/science-and-technology/sbir",
    "src": [
      "K147"
    ]
  },
  {
    "id": "G-034",
    "program": "FEMA BRIC (Building Resilient Infrastructure & Communities) + HMGP",
    "level": "Federal",
    "agency": "FEMA Hazard Mitigation Assistance",
    "type": "Sub-grant via partner",
    "award": "Up to $150M per award; 75/25 cost share; $1B combined FY24-25 NOFO",
    "access": "No—via utility partner",
    "fit": "Water; Power",
    "vertical": "Water-resilience and PFAS-mitigation infrastructure",
    "status": "WATCH",
    "deadline": "FY24-25 NOFO closed Jul 23 2026; FY25/26 NOFOs expected",
    "match": 2,
    "notes": "Court-ordered restart after Apr 2025 cancellation (Dec 11 2025 permanent injunction; Mar 6 2026 enforcement order); states/tribes/locals only - company as vendor/subrecipient partner; administration intent to replace the program remains a risk; HMGP active post-disaster.",
    "url": "https://www.fema.gov/grants/mitigation/building-resilient-infrastructure-communities",
    "src": [
      "K107"
    ]
  },
  {
    "id": "G-035",
    "program": "USACE ERDC partnerships (CRADAs; open BAA for unsolicited proposals)",
    "level": "Federal",
    "agency": "USACE ERDC-CERL",
    "type": "Grant",
    "award": "Negotiated cost-shared collaborations (~5-yr CRADAs typical)",
    "access": "Yes",
    "fit": "Water; Power",
    "vertical": "Waste-heat-driven water production; expeditionary destruction",
    "status": "ACTIVE",
    "deadline": "Continuous",
    "match": 4,
    "notes": "Partnership route (not a grant): Sept 2025 CRADAs with Genesis Systems and AirJoule on tactical-generator waste-heat water generation - CERL's operational-water team explicitly seeks logistics-burden reduction; on-ramp to ESTCP demos; N233-117 Phase III names USACE as transition partner.",
    "url": "https://www.erdc.usace.army.mil/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-036",
    "program": "ONR Long-Range BAA N0001425SB001 (Navy & Marine Corps S&T)",
    "level": "Federal",
    "agency": "Office of Naval Research",
    "type": "Grant",
    "award": "~$300K-$1M+/yr per effort, negotiated",
    "access": "Yes",
    "fit": "Water; Power",
    "vertical": "Shipboard/expeditionary water treatment; waste-to-energy S&T",
    "status": "OPEN-DEADLINE",
    "deadline": "Full proposals accepted through September 30 2026; white papers strongly encouraged first",
    "match": 5,
    "notes": "OPEN NOW - for-profits eligible; pitch a waste-heat SCWO water-production white paper to relevant ONR codes (sea platforms & environmental quality); slower and more research-oriented than SBIR/CSO but immediately actionable.",
    "url": "https://www.grants.gov/search-results-detail/356605",
    "src": [
      "K117"
    ]
  },
  {
    "id": "G-037",
    "program": "NDCEE demonstration contracts + installation AFFF stockpile destruction",
    "level": "Federal",
    "agency": "National Defense Center for Energy & Environment / DoD installations",
    "type": "Sub-grant via partner",
    "award": "Contract vehicles; per-base awards (e.g. Wright-Patterson removal ~$370K)",
    "access": "Yes",
    "fit": "PFAS destruction",
    "vertical": "AFFF stockpiles (~1,000 facilities); investigation-derived waste",
    "status": "ACTIVE",
    "deadline": "AFFF phase-out deadline Oct 1 2026 drives near-term contracts; incineration pause lifted 2026",
    "match": 4,
    "notes": "374Water AirSCWO Navy demo precedent via NDCEE (2023); DoD 2024-25 demo series (10 vendors incl. Revive SCWO Annihilator, 374Water/Arcadis) concluded on-site destruction wins on cost/logistics; bid as sub to prime environmental contractors; leverage ERDC-verified 99.9993% DRE evidence.",
    "url": "https://www.remediation-technology.com/articles/90-navy-selects-374water-for-joint-ndcee-pfas-project",
    "src": [
      "K133"
    ]
  },
  {
    "id": "G-038",
    "program": "CA SWRCB DFA: CWSRF / Water Recycling Funding Program / PFAS-emerging contaminants funding",
    "level": "State",
    "agency": "CA State Water Resources Control Board",
    "type": "Sub-grant via partner",
    "award": "No SRF maximum; ~$12.5M Prop 1 recycling grants proposed FY26-27; $20M stormwater principal-forgiveness cap",
    "access": "No—via utility partner",
    "fit": "Water; PFAS destruction; Power",
    "vertical": "Biosolids/PFAS destruction at POTWs; recycled water",
    "status": "ACTIVE",
    "deadline": "Rolling/annual IUP; applications via FAAST portal",
    "match": 4,
    "notes": "Vendor route = partner with a POTW applicant; WRFP fits the distilled-water output; emerging-contaminants IUP supplements fit PFAS destruction.",
    "url": "https://www.waterboards.ca.gov/water_issues/programs/grants_loans/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-039",
    "program": "CA CEC EPIC cost-share for federal clean energy FOAs",
    "level": "State",
    "agency": "California Energy Commission",
    "type": "Grant",
    "award": "Varies; matches DOE awards; agreements up to 48 months",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Clean-energy demonstration at CA host sites",
    "status": "ACTIVE",
    "deadline": "Rolling two-phase process tied to federal FOA timelines; addenda posted through 2026",
    "match": 3,
    "notes": "Open to public AND private entities (except POUs); projects in CA, demos in PG&E/SCE/SDG&E territory; best paired with a DOE FOA application.",
    "url": "https://www.grants.ca.gov/grants/cost-share-for-federal-clean-energy-funding-opportunities-epic-program/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-040",
    "program": "CA CEC Food Production Investment Program (FPIP)",
    "level": "State",
    "agency": "California Energy Commission",
    "type": "Grant",
    "award": "$500K-$5M per award (Tier I up to 65% of eligible costs; 35% match); ~$10.5M in 2025 round",
    "access": "Yes",
    "fit": "Power; Water",
    "vertical": "Food/beverage/dairy processing wastewater",
    "status": "WATCH",
    "deadline": "2025 round closed Sep 12 2025; next round expected 2026-27 (docket 23-ERDD-05)",
    "match": 3,
    "notes": "Direct private access for CA food processors; co-apply with a food/beverage/dairy host site (winery, brewery, dairy streams); dairy decarbonization precedent.",
    "url": "https://www.grants.ca.gov/grants/gfo-22-303-food-production-investment-program/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-041",
    "program": "CA CalRecycle Organics Grant Program (SB 1383)",
    "level": "State",
    "agency": "CalRecycle",
    "type": "Grant",
    "award": "~$100K-$10M+ per award",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Food/green waste co-processing (NOT biosolids)",
    "status": "WATCH",
    "deadline": "Intermittent rounds dependent on Cap-and-Invest/GGRF allocations",
    "match": 1,
    "notes": "CRITICAL CAVEAT: biosolids are explicitly NOT an eligible feedstock - projects composting/digesting only sewage sludge are ineligible; pursue only if framed around landfill-diverted food/green waste co-processing. Low fit for core HCSP.",
    "url": "https://calrecycle.ca.gov/funding/",
    "src": [
      "K145"
    ]
  },
  {
    "id": "G-042",
    "program": "CA DWR Sustainable Groundwater Management (SGM) grants (Prop 4)",
    "level": "State",
    "agency": "CA Dept. of Water Resources",
    "type": "Sub-grant via partner",
    "award": "~$386M Prop 4 pot (one round anticipated); small-GSA/TA tranches now",
    "access": "No—via other partner",
    "fit": "Water",
    "vertical": "Produced-water/wastewater treatment feeding groundwater recharge",
    "status": "ACTIVE",
    "deadline": "Draft guidelines comment thru Sep 30 2026; full solicitation ~summer 2027",
    "match": 2,
    "notes": "GSAs/public agencies/nonprofits/tribes only - partner with a GSA or member agency; project must be in an adopted GSP; distilled-water output supports recharge-quality projects.",
    "url": "https://water.ca.gov/sgmgrants",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-043",
    "program": "TX TWDB SWIFT + TX CWSRF",
    "level": "State",
    "agency": "Texas Water Development Board",
    "type": "Loan",
    "award": "Multi-$M low-interest loans; >=20% of SWIFT historically reserved for conservation/reuse",
    "access": "No—via utility partner",
    "fit": "Water",
    "vertical": "Reuse/new-supply strategies; municipal wastewater",
    "status": "ACTIVE",
    "deadline": "SWIFT 2026 abridged apps closed Feb 2 2026 (next cycle early 2027); CWSRF SFY27 PIFs closed Mar 6 2026 (next SFY28)",
    "match": 3,
    "notes": "Political subdivisions and nonprofit water supply corporations only; projects must be State Water Plan recommended strategies (2026 update finalizing); same municipal mechanism as the Orlando template.",
    "url": "https://www.twdb.texas.gov/financial/programs/swift/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-044",
    "program": "Texas Water Fund / New Water Supply for Texas Fund (Prop 6 2023; Prop 4 Nov 2025)",
    "level": "State",
    "agency": "Texas Water Development Board",
    "type": "Sub-grant via partner",
    "award": ">=$250M initial New Water Supply fund; Prop 4 dedicates up to $20B sales-tax revenue 2027-2047",
    "access": "No—via other partner",
    "fit": "Water",
    "vertical": "Oil & gas produced-water treatment; brackish desal; ASR",
    "status": "ACTIVE",
    "deadline": "2026 interim-year rulemaking/positioning; Prop 4 flows begin 2027",
    "match": 4,
    "notes": "Highest-priority TX strategic target: produced-water treatment projects explicitly eligible; 7M acre-ft new-supply target by 2033; vendor participates via project sponsor while TWDB updates rules in 2026.",
    "url": "https://www.twdb.texas.gov/",
    "src": [
      "K126"
    ]
  },
  {
    "id": "G-045",
    "program": "TX produced-water pilot ecosystem (TWDB Ag Water Conservation Grants; TX Produced Water Consortium)",
    "level": "State",
    "agency": "TWDB / Texas Tech et al.",
    "type": "Sub-grant via partner",
    "award": "Ag grants $29K-$500K ($1.5M awarded Jun 25 2026); consortium pilot-scale projects",
    "access": "No—via other partner",
    "fit": "Water",
    "vertical": "Permian/Delaware basin produced-water reuse pilots",
    "status": "ACTIVE",
    "deadline": "Annual ag-grant cycle (next ~mid-2027); consortium ongoing",
    "match": 3,
    "notes": "Sandy Land UWCD awarded $103,866 to evaluate treated produced water as supplemental irrigation supply; TXPWC recommended Delaware & Midland basin 50-bbl/day pilots - submit technology via groundwater district / university testbed partners.",
    "url": "https://www.twdb.texas.gov/financial/programs/agriculture/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-046",
    "program": "AZ WIFA Long-Term Water Augmentation Fund - In-State Water Augmentation cycle",
    "level": "State",
    "agency": "Arizona Water Infrastructure Finance Authority",
    "type": "Sub-grant via partner",
    "award": "Fund balance ~$376M (post FY26 clawback); awards >$50M require Joint Legislative Water Committee review",
    "access": "Yes",
    "fit": "Water",
    "vertical": "Wastewater reclamation to potable/distilled; fab/data-center offtakers",
    "status": "ACTIVE",
    "deadline": "In-State Water Augmentation funding cycle OPEN since Nov 17 2025",
    "match": 5,
    "notes": "Excellent fit: private project developers can propose within project teams - WIFA selected seven Phase-1 proposals from companies (incl. desal and wastewater-to-drinking-water) and funds Phase-2 feasibility (18-24 months, underway 2026).",
    "url": "https://wifa.az.gov/",
    "src": [
      "K125"
    ]
  },
  {
    "id": "G-047",
    "program": "AZ WIFA Water Conservation Grant Fund (winding down) & WSDRF / SRFs",
    "level": "State",
    "agency": "Arizona WIFA",
    "type": "Sub-grant via partner",
    "award": "WCGF $14.1M federal remainder (projects completable by Jun 30 2026); WSDRF balance ~$157.7M",
    "access": "No—via utility partner",
    "fit": "Water",
    "vertical": "Conservation; rural providers outside CAP Active Management Areas",
    "status": "WATCH",
    "deadline": "WCGF winding down; WSDRF rolling (SFY26 public review posted late 2025)",
    "match": 2,
    "notes": "WCGF is legacy only - watch for re-capitalization (FY26 added only $250K); NGOs may apply to WCGF if partnered with an eligible entity; WSDRF restricted to providers outside CAP AMAs.",
    "url": "https://www.azjlbc.gov/26AR/wifa.pdf",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-048",
    "program": "FL CWSRF + BIL emerging-contaminants grants (Orlando/374Water template)",
    "level": "State",
    "agency": "Florida DEP",
    "type": "Sub-grant via partner",
    "award": "~$800K demo precedent; full-scale follow-ons $3M-$5M",
    "access": "No—via utility partner",
    "fit": "PFAS destruction; Water",
    "vertical": "Biosolids/PFAS destruction at water reclamation facilities",
    "status": "ACTIVE",
    "deadline": "Rolling/annual via FL DEP",
    "match": 5,
    "notes": "THE template transaction: Orlando's FL CWSRF/BIL grant (Feb 2024, ~$800K+) funded the AirSCWO demo at Iron Bridge -> 5-year waste-destruction license (Mar 2026) -> $3M-$5M full-scale PFAS destruction & manufacturing hub (Jun 2026). Replicate with FL utilities.",
    "url": "https://floridadep.gov/wra",
    "src": [
      "K114",
      "K115"
    ]
  },
  {
    "id": "G-049",
    "program": "FL FDEP Water Restoration grant programs (incl. Innovative Technology for HABs)",
    "level": "State",
    "agency": "Florida DEP",
    "type": "Grant",
    "award": "Alternative Water Supply $500K-$10M+; HAB Innovative Technology $250K-$5M; Springs $500K-$8M+",
    "access": "No—via utility partner",
    "fit": "Water; PFAS destruction",
    "vertical": "Nutrient/HAB destruction pilots; biosolids/PFAS angle post-Orlando",
    "status": "ACTIVE",
    "deadline": "FY 2026-27 portal openings rolling (several close ~Sep 1)",
    "match": 3,
    "notes": "Nonstate entities can participate; utilities typically lead; FL HB 1019 (signed Jun 17 2026) creating AFFF inventory adds a PFAS-destruction demand signal.",
    "url": "https://floridadep.gov/comm/comm/content/dep-funding-opportunities",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-050",
    "program": "NYSERDA Waste-to-Low-Carbon-Fuels Pilot & Demonstration (+ July 2026 $8M alternative-fuels round)",
    "level": "State",
    "agency": "NYSERDA",
    "type": "Grant",
    "award": "~$8M solicitations; >=50% non-NYSERDA cost share; 3-phase pilot->demo structure",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Wastewater sludge to fuels (SAF, RNG, renewable diesel, methanol, e-fuels)",
    "status": "ACTIVE",
    "deadline": "2025 solicitation (Aug 2025) + $8M round announced Jul 21 2026 under PSC Innovation & Research Order",
    "match": 4,
    "notes": "Best direct-access NY program: private technology providers eligible as project leads (with EPC + host-site/feedstock/end-user letters); wastewater sludge explicitly eligible feedstock; biogas/hydrogen excluded as end fuels - align product carefully; $24M grid modernization solicitation (Jun 2026) is the alternative track for power/cooling.",
    "url": "https://www.nyserda.ny.gov/",
    "src": [
      "K123"
    ]
  },
  {
    "id": "G-051",
    "program": "NY EFC programs (WIIA/IMG, EPG, CWSRF incl. BIL-EC landfill leachate awards)",
    "level": "State",
    "agency": "NY Environmental Facilities Corporation",
    "type": "Sub-grant via partner",
    "award": "WIIA ~$200M expected over next 3 SFYs ($453M awarded Dec 19 2025); EPG $50K/$100K; 0% hardship CWSRF loans",
    "access": "No—via utility partner",
    "fit": "PFAS destruction; Water",
    "vertical": "Landfill leachate pretreatment; regional biosolids hubs",
    "status": "ACTIVE",
    "deadline": "Annual rounds (WIIA historically closes ~September; EPG/GIGP closed Jun 12 2026)",
    "match": 4,
    "notes": "Proven leachate precedents under CWSRF-EC: Steuben County $25.3M, Malone $14.5M, Hurley $1.3M, DANC $1.4M; IMG favors multi-municipal shared projects - fits the regional SCWO hub model; municipalities only.",
    "url": "https://efc.ny.gov/wiia",
    "src": [
      "K127"
    ]
  },
  {
    "id": "G-052",
    "program": "NJDEP EC-SDC Emerging Contaminants grant ($33.6M for NJ)",
    "level": "State",
    "agency": "NJDEP",
    "type": "Sub-grant via partner",
    "award": "$33.6M allotment announced May 19 2026",
    "access": "No—via utility partner",
    "fit": "PFAS destruction; Water",
    "vertical": "Small/disadvantaged NJ water systems",
    "status": "ACTIVE",
    "deadline": "Rolling application/notification",
    "match": 4,
    "notes": "Vendor via public water system partner; part of the final $1B national EC-SDC year - engage NJ systems while funds allot.",
    "url": "https://dep.nj.gov/grantandloanprograms/ecsdc/",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-053",
    "program": "NJ PFAS Abatement Fund ($795M) via NJ Water Bank",
    "level": "State",
    "agency": "NJDEP / NJ Water Bank",
    "type": "Settlement fund",
    "award": "$795M fund; >=$150M to Water Bank for POTWs; >=$90M to counties for AFFF sites; SFY26 IUPs ~$900M clean-water + ~$790M drinking-water baseline",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "POTW PFAS capital upgrades; AFFF sites (fire academies, airports)",
    "status": "ACTIVE",
    "deadline": "Program design rolling out post court approval (Aug 7 2026) - engage now",
    "match": 5,
    "notes": "Time-sensitive: ~$2.5B DuPont/3M settlements approved Aug 7 2026; no/low-interest loans + principal forgiveness for POTW PFAS capital upgrades; AFFF-destruction services fit the Orlando hub model; shape project pipelines while the program forms.",
    "url": "https://dep.nj.gov/3m/",
    "src": [
      "K112"
    ]
  },
  {
    "id": "G-054",
    "program": "PA PENNVEST (incl. Growing Greener / Act 13 WRPP as secondary channels)",
    "level": "State",
    "agency": "PENNVEST",
    "type": "Loan",
    "award": "Up to $11M/project ($20M multi-municipality; board can exceed for regional consolidation); grant + 1.7-2.2% loan blends",
    "access": "Yes",
    "fit": "Water; Power; PFAS destruction",
    "vertical": "Marcellus produced water; water reuse; energy efficiency; emerging contaminants",
    "status": "ACTIVE",
    "deadline": "Rolling applications; quarterly board-meeting cutoffs",
    "match": 5,
    "notes": "Best direct-access program in the Northeast: 'any municipality, authority or private entity that is an owner and/or operator' is eligible DIRECTLY; emerging-contaminants track funds PFAS treatment (a destruction proposal would be novel; reuse/energy tracks fit); precedent: $2.45M grant + $27.76M loan to PA American Water Silver Spring PFAS plant (Jul 2026).",
    "url": "https://dced.pa.gov/programs/pennsylvania-infrastructure-investment-authority-pennvest/",
    "src": [
      "K124"
    ]
  },
  {
    "id": "G-055",
    "program": "ME PFAS/sludge response ($50M bond request; utility pilots)",
    "level": "State",
    "agency": "Maine DEP / Legislature",
    "type": "Sub-grant via partner",
    "award": "$50M bond proposed; project-scale pilots",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Biosolids/sludge PFAS destruction at POTWs",
    "status": "WATCH",
    "deadline": "Bond vote expected by May 2026 - OUTCOME UNCONFIRMED, verify before relying",
    "match": 4,
    "notes": "DEP/MEWEA/Brown & Caldwell study explicitly recommends funding PFAS destruction pilot studies; York Sewer District pursuing a 2028 modular SCWO pilot; Anson Madison regional PFAS center seeking funds; IIJA EC CWSRF overlay available to ME POTWs.",
    "url": "https://www.maine.gov/dep/spills/topics/pfas/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-056",
    "program": "CT/MA biosolids-ban-driven PFAS programs (CT EC-SDC $9.46M; MA MassDEP PFAS grants; MA Trust Fund pending)",
    "level": "State",
    "agency": "CT DEEP / MassDEP",
    "type": "Sub-grant via partner",
    "award": "CT $9.457M EC-SDC (May 2026); MA Ipswich River round ~$900K across five communities",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Biosolids (CT ban drives destruction demand); drinking-water PFAS pilots",
    "status": "ACTIVE",
    "deadline": "Rolling (CT); periodic (MA); MA 2026 IUPs discontinued 0% PFAS loans - shift to loan forgiveness",
    "match": 3,
    "notes": "CT banned PFAS-containing biosolids from use/sale (Oct 2024) and extended to fertilizers with PFAS-free certification (Jul 2025) - a direct destruction-demand driver; MA PFAS Remediation Trust Fund bill pending (not enacted as of Sept 2026); route via municipal WPCFs.",
    "url": "https://www.epa.gov/newsreleases/epa-announces-95-million-connecticut-address-pfas-drinking-water",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-057",
    "program": "Islands: HI (USDA Rural Decentralized Water grants; NELHA testbed) & USVI/PR (SRF-IIJA ~$21M, SmaRT, WIFIA territories)",
    "level": "State",
    "agency": "USDA RD / NELHA / EPA-territories",
    "type": "Sub-grant via partner",
    "award": "USVI ~$21M IIJA (majority as grants/forgivable loans); SmaRT FY26 USVI $176K / PR $524K; WIFIA >=$5M ($1M small communities)",
    "access": "No—via utility partner",
    "fit": "Water; Power",
    "vertical": "Island water+power microgrids; decentralized water systems",
    "status": "ACTIVE",
    "deadline": "USDA decentralized water applications open Jul 28 - Sep 30 2026; SRF rolling",
    "match": 3,
    "notes": "Island deployments (power + distilled water from wastewater) fit WIFIA + SRF via territorial utilities (VIWAPA/WMA); NELHA is a proven federal-award demonstration venue (Trevi $2M DOE SETO); USDA window LIVE NOW via nonprofits.",
    "url": "https://www.rd.usda.gov/programs-services/water-environmental-programs/rural-decentralized-water-systems-grant-program-30",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-058",
    "program": "OC San RISE innovation program (Orange County, CA)",
    "level": "Municipal-utility",
    "agency": "Orange County Sanitation District",
    "type": "Sub-grant via partner",
    "award": "Pilot/demo-scale; in-kind + co-funding",
    "access": "Yes",
    "fit": "PFAS destruction; Water",
    "vertical": "Biosolids/PFAS solutions at a 190-MGD utility",
    "status": "ACTIVE",
    "deadline": "Rolling (standing innovation front door)",
    "match": 4,
    "notes": "Open vendor front door actively seeking PFAS/solids solutions (SCWO, deep-well injection); 6-ton/day AirSCWO Nix6 demo with 374Water underway - direct competitive precedent and partnership model.",
    "url": "https://ocsan.gov/RISE",
    "src": [
      "K144"
    ]
  },
  {
    "id": "G-059",
    "program": "MWD of Southern California innovation programs (mwdinnovates.com)",
    "level": "Municipal-utility",
    "agency": "Metropolitan Water District of Southern California",
    "type": "Grant",
    "award": "Innovative Conservation Program direct grants; Innovative Supplies Funding Program",
    "access": "Yes",
    "fit": "Water",
    "vertical": "New-supply & conservation technology; C&I water savings",
    "status": "ACTIVE",
    "deadline": "Rolling / annual programs",
    "match": 3,
    "notes": "Direct grant funding in partnership with member agencies; Technology Feedback Forum as pitch venue; EMWD CCRO pilot precedent shows CA utilities co-fund vendor pilots with state money.",
    "url": "http://www.mwdinnovates.com/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-060",
    "program": "The Water Council Pilot Program (Milwaukee, WI)",
    "level": "Municipal-utility",
    "agency": "The Water Council / MMSD / Fund for Lake Michigan",
    "type": "Grant",
    "award": "Pilot-scale; transfers prototypes to Wisconsin demonstration sites",
    "access": "Yes",
    "fit": "Water; Power",
    "vertical": "Nutrient removal & energy production pilots; dairy belt",
    "status": "ACTIVE",
    "deadline": "Rolling (membership required)",
    "match": 4,
    "notes": "Businesses of any size eligible; funded by Fund for Lake Michigan, MMSD, Wells Fargo; MMSD pilot->demo->procurement pathway proven (Tomorrow Water Proteus advanced to 2.25-MGD commercial demo, Mar 2026).",
    "url": "https://www.mmsd.com/about-us/news/funding-available-for-pilot-program",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-061",
    "program": "MN LCCMR / Environment & Natural Resources Trust Fund (state SCWO funding precedent)",
    "level": "State",
    "agency": "State of Minnesota LCCMR",
    "type": "Grant",
    "award": "Project-scale awards",
    "access": "Yes",
    "fit": "PFAS destruction",
    "vertical": "Biosolids PFAS destruction",
    "status": "ACTIVE",
    "deadline": "374Water award announced Dec 30 2025; project starts Apr 2026; watch next ENRTF cycles",
    "match": 3,
    "notes": "Proof that state trust/legacy funds directly sponsor SCWO biosolids destruction (374Water + Barr Engineering + U. St. Thomas + MnTAP + City of St. Cloud); analogous trust/legacy vehicles exist in other states.",
    "url": "https://www.globenewswire.com/news-release/2025/12/30/3211393/0/en/",
    "src": [
      "K143"
    ]
  },
  {
    "id": "G-062",
    "program": "3M Public Water System settlement (AFFF MDL 2873)",
    "level": "Private-foundation",
    "agency": "Settlement Claims Administrator (pfaswatersettlement.com)",
    "type": "Settlement fund",
    "award": "$10.5B-$12.5B over 13 yrs; >$3.5B paid to Phase 1 claimants",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Drinking-water treatment residuals (GAC/IX/RO concentrates, AFFF)",
    "status": "ACTIVE",
    "deadline": "Phase 2 Action Fund claims closed Jul 31 2026; Supplemental Fund claims open through Dec 31 2030",
    "match": 3,
    "notes": "No court-run vendor list - >6,600 claimant systems receive cash 2026-2033 and procure treatment; sell destruction as the residuals-management step; partner with engineering firms (AECOM, Jacobs, Tetra Tech, Brown and Caldwell) writing utility treatment plans.",
    "url": "https://www.pfaswatersettlement.com/3m-frequently-asked-questions/",
    "src": [
      "K111"
    ]
  },
  {
    "id": "G-063",
    "program": "DuPont/Chemours/Corteva ($1.185B) + Tyco ($750M) + BASF ($316.5M) PWS settlements",
    "level": "Private-foundation",
    "agency": "Settlement Claims Administrators",
    "type": "Settlement fund",
    "award": "$2.25B combined; DuPont distributing since Oct 2025; Tyco from Mar 2026; BASF from Apr 2026",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Drinking-water treatment residuals",
    "status": "ACTIVE",
    "deadline": "Distributing; Special Needs Fund (~$430M across settlements) oversubscribed - pro-rata cuts expected mid-2026",
    "match": 3,
    "notes": "~3,900 systems filed in Tyco/BASF settlements covering ~19,600 water sources; same downstream vendor play as the 3M settlement; only incurred out-of-pocket costs qualify for claims.",
    "url": "https://stagliuzza.com/news/pfas-public-water-system-settlement-update-april-2026/",
    "src": [
      "K111"
    ]
  },
  {
    "id": "G-064",
    "program": "WI Acts 200/201 PFAS grant programs (>$130M)",
    "level": "State",
    "agency": "Wisconsin DNR",
    "type": "Grant",
    "award": "Community/municipal PFAS grants (~20% match); Airport & Industrial Possessor grants; landfill leachate/biosolids treatment grants; well compensation",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Landfill leachate; biosolids disposal; on-site treatment systems",
    "status": "ACTIVE",
    "deadline": "Launching summer 2026 - winter 2026 (sampling grants first)",
    "match": 5,
    "notes": "Most direct state-level door for a leachate vendor: grants to municipalities AND privately owned landfills to dispose of PFAS-containing biosolids/leachate OR purchase and install on-site treatment systems (up to 20% match); DNR also directed to study destruction/disposal methods.",
    "url": "https://content.govdelivery.com/accounts/WIDNR/bulletins/411b1f6",
    "src": [
      "K113"
    ]
  },
  {
    "id": "G-065",
    "program": "NC DEQ Emerging Contaminants/PFAS funding (+ MI EC-SDC/EGLE as parallel channel)",
    "level": "State",
    "agency": "NC DEQ (parallel: EGLE/MI)",
    "type": "Sub-grant via partner",
    "award": "NC: $55M state budget + ~$35M Cape Fear (Mar 2026) + BIL SRF-EC at 100% principal forgiveness; MI: $22.07M EC-SDC + ~$20M/yr EGLE CCRR",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Drinking water, wastewater AND landfill leachate construction",
    "status": "ACTIVE",
    "deadline": "NC rolling deadlines through Nov 2 2026; MI rolling via state",
    "match": 4,
    "notes": "NC: construction & planning grants for PFAS incl. leachate; publicly owned landfills eligible for CWSRF-EC; pending bills (HB 569 polluter liability; SB 666 $56M utility reimbursement fund) could add more. MI caveat: state MCLs in litigation limbo (Supreme Court vacated/remanded Mar 2025).",
    "url": "https://www.deq.nc.gov/about/divisions/water-infrastructure/emerging-contaminants-pfas-funding",
    "src": [
      "K132"
    ]
  },
  {
    "id": "G-066",
    "program": "EREF (Environmental Research & Education Foundation) landfill research grants",
    "level": "Private-foundation",
    "agency": "EREF",
    "type": "Grant",
    "award": "~$100K-scale research grants",
    "access": "No—via other partner",
    "fit": "PFAS destruction",
    "vertical": "Landfill leachate treatment/destruction",
    "status": "ACTIVE",
    "deadline": "Rolling pre-proposals",
    "match": 3,
    "notes": "Small dollars but unmatched industry visibility: Emerging Contaminants (leachate disposal/treatment) is a stated research priority; propose an SCWO leachate demonstration with a member landfill - direct channel to Waste Management/Republic-type operators ahead of the landfill PFAS ELG (proposed rule ~Mar 2027, final ~Mar 2029).",
    "url": "https://erefdn.org/research/innovative-technologies-to-treat-per-and-polyfluoroalkyl-substances-pfas-in-landfill-leachate/",
    "src": [
      "K138"
    ]
  },
  {
    "id": "G-067",
    "program": "Imagine H2O Global Accelerator (incl. Asia track)",
    "level": "Private-foundation",
    "agency": "Imagine H2O",
    "type": "Accelerator",
    "award": "Zero-equity; ~$25K non-dilutive award + mentorship/network",
    "access": "Yes",
    "fit": "Water; PFAS destruction; Power; Cooling",
    "vertical": "PFAS destruction; biosolids; industrial reuse; data-center water",
    "status": "ACTIVE",
    "deadline": "2027 cohort applications open November 2026, close December 2026; program Apr-Nov 2027",
    "match": 5,
    "notes": "The best-aligned water-sector accelerator; 2026 cohort explicitly featured PFAS detection/destruction and sludge-destruction startups (AxNano, Beyond the Dome) - HCSP's category confirmed in-scope; eligibility: incorporated <7 yrs, revenue <$5M, equity raised <$10M; Asia track relevant to distillery/island verticals.",
    "url": "https://www.imagineh2o.org/apply/",
    "src": [
      "K130"
    ]
  },
  {
    "id": "G-068",
    "program": "Imagine H2O Water Innovation Pilot Fund",
    "level": "Private-foundation",
    "agency": "Imagine H2O (+ Oceankind, Coca-Cola Foundation)",
    "type": "Recoverable grant",
    "award": "~$50K-$150K per pilot ($3.2M committed across 33 pilots to date)",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Paid pilots with utility/industrial early adopters (biosolids, distillery, dairy)",
    "status": "ACTIVE",
    "deadline": "Rolling",
    "match": 5,
    "notes": "Recoverable grants (repayable on commercial success; still non-dilutive) purpose-built to co-fund exactly the paid pilot HCSP needs; claims 10x follow-on capital mobilized; open to water startups with pilot-ready tech beyond the accelerator pipeline.",
    "url": "https://www.imagineh2o.org/pilot-fund/",
    "src": [
      "K130"
    ]
  },
  {
    "id": "G-069",
    "program": "Water Research Foundation - Tailored Collaboration Program et al.",
    "level": "Private-foundation",
    "agency": "Water Research Foundation",
    "type": "Sub-grant via partner",
    "award": "1:1 cash match up to $150K per project",
    "access": "No—via other partner",
    "fit": "Water; PFAS destruction",
    "vertical": "Utility-sponsored technology evaluation (biosolids/PFAS)",
    "status": "ACTIVE",
    "deadline": "2026 pre-proposals closed Mar 17 2026; next cycle expected ~Q1 2027; eight open research projects announced Jul 2026",
    "match": 4,
    "notes": "Projects must be sponsored by a WRF-subscribing utility; HCSP participates as technology/research partner; results published sector-wide - strong de-risking for the municipal market; also Emerging Opportunities Program for urgent PFAS issues.",
    "url": "https://www.waterrf.org/research",
    "src": [
      "K134"
    ]
  },
  {
    "id": "G-070",
    "program": "Elemental Impact Data Center Innovation Initiative (DCII) + core Strategy/Project Tracks",
    "level": "Corporate",
    "agency": "Elemental Impact (with Amazon, Google, Meta, Microsoft)",
    "type": "Equity-not-grant",
    "award": "$500K-$5M per project; up to 10 startups through 2027 (DCII); core tracks case-by-case",
    "access": "Yes",
    "fit": "Cooling; Power; Water",
    "vertical": "Data-center cooling/water (30-80% WUE reduction or 20-40% cooling-energy target)",
    "status": "ACTIVE",
    "deadline": "Rolling through 2027",
    "match": 5,
    "notes": "Flagship 2026-27 private program for the 'clean water + cooling + power for data centers' story; philanthropy-anchored (Breakthrough Energy Discovery, Builders Vision, Salesforce, Stolte Family Foundation); investment structure case-by-case (equity/debt/hybrid) - catalytic, not pure grant; core Project Track funds FOAK deployments.",
    "url": "https://elementalimpact.com/data-center-innovation-initiative/",
    "src": [
      "K131"
    ]
  },
  {
    "id": "G-071",
    "program": "PRIME Coalition (Prime Impact Fund, $52M)",
    "level": "Private-foundation",
    "agency": "PRIME Coalition",
    "type": "Recoverable grant",
    "award": "Deal-specific recoverable grants / PRIs ($52M fund; $100M+ catalytic capital across vehicles)",
    "access": "Yes",
    "fit": "Power; PFAS destruction",
    "vertical": "Capital-intensive FOAK climate hardware",
    "status": "ACTIVE",
    "deadline": "Relationship-based, rolling",
    "match": 4,
    "notes": "Charitable capital (recoverable = repayable on success; non-dilutive or minimally dilutive) for hard-to-fund climate hardware - SCWO FOAK plants with an additionality story fit the thesis exactly; backers incl. MacArthur, Packard, Sierra Club Foundation; expanding Prime-Facilitated platform in 2026.",
    "url": "https://www.primecoalition.org/",
    "src": [
      "K135"
    ]
  },
  {
    "id": "G-072",
    "program": "Lab-embedded entrepreneurship fellowships (Activate/Cyclotron Road; Chain Reaction Innovations/Argonne; LEEP nodes) + small catalytic vehicles (NY Climate Exchange; Greentown ACCEL - verify dormancy)",
    "level": "Private-foundation",
    "agency": "Activate / DOE LEEP nodes / NY Climate Exchange / Greentown Labs",
    "type": "Grant",
    "award": ">$300K over 2 yrs (Activate); $115K/yr x 2 (CRI); $10K-$25K small vehicles; no equity",
    "access": "Yes",
    "fit": "Water; Power",
    "vertical": "Funds an individual technical founder, not the company",
    "status": "ACTIVE",
    "deadline": "Activate Cohort 2027 applications open Sep 15 2026; CRI applications open Sep 2026; NY Climate Exchange deadline Aug 1 2026 (annual)",
    "match": 3,
    "notes": "Only if a technical founder/CTO-level hire applies as an individual; Argonne's separations/water chemistry facilities are a strong technical match for SCWO R&D; part of DOE's Lab-Embedded Entrepreneurship Program (federal linkage, privately run); Greentown ACCEL possibly dormant - verify.",
    "url": "https://www.activate.org/",
    "src": [
      "K136"
    ]
  },
  {
    "id": "G-073",
    "program": "Hyperscaler water-replenishment programs (Google 120% by 2030; AWS / Meta / Microsoft water-positive 2030)",
    "level": "Corporate",
    "agency": "Google / AWS / Meta / Microsoft",
    "type": "Sub-grant via partner",
    "award": "Program-scale (e.g. Google $17M new US projects Jun 2026; AWS 50+ projects >21B L/yr); per-project contracts",
    "access": "No—via other partner",
    "fit": "Water; Cooling",
    "vertical": "Replenishment projects in stressed basins near data centers",
    "status": "ACTIVE",
    "deadline": "Rolling, watershed-specific",
    "match": 4,
    "notes": "Revenue/offtake channel, not grants: programs pay third parties to deliver verified replenishment volumes - an HCSP installation converting wastewater to distilled/reclaimed water in a stressed basin near a data center could be contracted as a replenishment project (PPA-like water offtake) or co-funded with the local utility; data-center operators also enter public-private cost-shares with municipalities on water infrastructure.",
    "url": "https://www.esgdive.com/news/google-commits-to-replenish-more-water-than-it-uses-by-2030/822021/",
    "src": [
      "K142"
    ]
  },
  {
    "id": "G-074",
    "program": "U.S. Dairy Net Zero Initiative (FFAR/DRI matching grants; on-farm pilots)",
    "level": "Corporate",
    "agency": "Innovation Center for U.S. Dairy / Newtrient / Dairy Research Institute / FFAR",
    "type": "Sub-grant via partner",
    "award": "$1.5M farm pilots; FFAR $10M matched to $23.2M; Nestle/Starbucks $10M each over 5 yrs",
    "access": "No—via other partner",
    "fit": "Power; Water",
    "vertical": "CAFO manure/wastewater destruction + energy recovery",
    "status": "ACTIVE",
    "deadline": "Relationship-driven; no open RFP",
    "match": 3,
    "notes": "Propose HCSP for a Dairy Scale for Good pilot farm or a Newtrient on-farm technology assessment, with FFAR/DRI as the matching-funds vehicle; NZI's stated technology interest (digesters, advanced nutrient recovery) matches manure-valorization SCWO.",
    "url": "https://www.usdairy.com/sustainability",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-075",
    "program": "XPRIZE Water Scarcity ($119M, Mohamed bin Zayed Water Initiative)",
    "level": "Private-foundation",
    "agency": "XPRIZE Foundation",
    "type": "Prize",
    "award": "$40M grand prize (Track A system-level desalination); $8M Track B materials/methods",
    "access": "No",
    "fit": "Water",
    "vertical": "Seawater desalination (not wastewater destruction)",
    "status": "DEAD",
    "deadline": "Registration closed; 37 semifinalists named May 2026; winners 2027-2028",
    "match": 1,
    "notes": "Closed to new entrants and off-scope (desalination); monitor future Mohamed bin Zayed Water Initiative competitions (e.g. Al Miyah Challenge, AED 8M, agricultural water, open internationally).",
    "url": "https://www.xprize.org/prizes/water-scarcity",
    "src": [
      "K140"
    ]
  },
  {
    "id": "G-076",
    "program": "Equity-not-grant channels (Microsoft Climate Innovation Fund; Burnt Island Ventures; S2G/Builders Vision)",
    "level": "Corporate",
    "agency": "Microsoft CIF / Burnt Island Ventures / S2G",
    "type": "Equity-not-grant",
    "award": "Microsoft CIF $1B commitment ($806M deployed to 67 investees); BIV Fund II $50M; S2G $2.5B AUM",
    "access": "Yes",
    "fit": "Water; Power",
    "vertical": "Water technology; climate hardware; food/ag",
    "status": "ACTIVE",
    "deadline": "Rolling",
    "match": 3,
    "notes": "NOT grant capital: equity and project finance only - relevant if raising; Burnt Island is the most active water-only VC (Xylem anchor LP); Microsoft CIF does not provide grants but funds project finance for data-center co-located deployments; S2G covers food/ag + water.",
    "url": "https://blogs.microsoft.com/blog/2026/02/18/a-milestone-achievement-in-our-journey-to-carbon-negative/",
    "src": [
      "K141"
    ]
  },
  {
    "id": "G-077",
    "program": "Major US environmental foundations (Gates WSH; Schmidt/11th Hour; Walton; Moore; Hewlett; Packard; Energy Foundation; Grantham)",
    "level": "Private-foundation",
    "agency": "Various",
    "type": "Grant",
    "award": "$50K-$750K typical; Grantham $67M/yr (FY2024); Moore $200M+/yr environment",
    "access": "No",
    "fit": "-",
    "vertical": "Nonprofit grantees only",
    "status": "WATCH",
    "deadline": "LOI/invitation-based; no unsolicited proposals at Moore, Schmidt, Grantham",
    "match": 1,
    "notes": "A for-profit SCWO company is rarely an eligible grantee - grants go to nonprofits/universities; realistic routes are the intermediaries they capitalize (Elemental, Activate, PRIME) or a watershed-reuse nonprofit partner; Gates WSH matters only for a Global-South fecal-sludge/island variant.",
    "url": "https://www.insidephilanthropy.com/find-a-grant/grants-m/gordon-and-betty-moore-foundation",
    "src": [
      "K148"
    ]
  },
  {
    "id": "G-078",
    "program": "Market-access platforms (Isle Utilities TAG; WEF/LIFT; Water Council BREW 2.0)",
    "level": "Private-foundation",
    "agency": "Isle Utilities / WEF / The Water Council",
    "type": "Accelerator",
    "award": "No cash (free platforms); BREW 2.0 includes 1-yr membership + pitch events",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Utility/industrial customer introductions and validation",
    "status": "ACTIVE",
    "deadline": "Rolling TAG scouting; BREW 2.0 2027 applications expected fall 2026",
    "match": 3,
    "notes": "No direct funding but high-value validation: TAG pitches vetted technologies (TRL 7+) to curated utility groups (e.g. Western US Wastewater TAG at OC San); LIFT evaluations de-risk utility procurement; PFAS-destruction hardware precedent (Aquagga is a BREW alumnus).",
    "url": "https://isleutilities.com/technology-approval-group-tag/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-079",
    "program": "India distillery ZLD interest subvention (ethanol scheme)",
    "level": "Federal",
    "agency": "Government of India (access via Indian distilleries)",
    "type": "Loan",
    "award": "~6% p.a. interest subvention (or 50% of bank rate) for 5 yrs on loans incl. CPCB-approved ZLD methods",
    "access": "No—via other partner",
    "fit": "Water",
    "vertical": "Distillery zero-liquid-discharge (India)",
    "status": "ACTIVE",
    "deadline": "Indian government scheme; distillery must supply >=75% of ethanol output to OMCs and hold CPCB ZLD certificate",
    "match": 2,
    "notes": "Not accessible to a US vendor directly - the subvention lowers an Indian distillery customer's cost of capital for ZLD, making an HCSP sale (or Indian JV with a local distillery/EPC) more financeable; a local partner is effectively mandatory; Imagine H2O Asia is the adjacent accessible route.",
    "url": "https://apps.fas.usda.gov/newgainapi/api/Report/DownloadReportByFileName?fileName=Indian%20Government%20Approves%20Interest%20Subvention%20Scheme%20for%20Ethanol%20Distilleries_New%20Delhi_India_01-03-2021",
    "src": [
      "K146"
    ]
  },
  {
    "id": "G-080",
    "program": "Breakthrough Energy (Fellows grant; Catalyst FOAK finance; BEV equity)",
    "level": "Private-foundation",
    "agency": "Breakthrough Energy",
    "type": "Grant",
    "award": "Innovator Fellowship up to ~$500K/1 yr (pre-venture, <$2M raised); Catalyst first-of-a-kind project scale",
    "access": "Yes",
    "fit": "Power; Water",
    "vertical": "Pre-venture climate tech; first commercial plants",
    "status": "ACTIVE",
    "deadline": "Annual Fellows cycle (2026 cohort started Sept 2026)",
    "match": 3,
    "notes": "Mixed instruments: Fellows = grant but only for pre-venture entities; Catalyst relevant later for a first commercial HCSP plant; BEV is equity, not grant; Breakthrough Energy Discovery also anchor-funds Elemental's DCII.",
    "url": "https://breakthroughenergy.org/",
    "src": [
      "K141"
    ]
  }
],

  grants_top15: [
  {
    "rank": 1,
    "id": "G-009",
    "program": "Desalination & Water Purification Research (DWPR) NOFO",
    "type": "Grant",
    "award": "Lab-scale up to $300K federal; pilot-scale up to $800K federal; $5.7M total FY26",
    "status": "OPEN-DEADLINE",
    "deadline": "Due 4:00 p.m. MT September 29 2026 (posted Jul 29 2026)",
    "match": 5,
    "why": "Urgency: proposals due 4:00 p.m. MT Sep 29 2026. The single best direct-apply federal grant - for-profits eligible, produced water and municipal wastewater are named source waters, pilot-scale up to $800K.",
    "access": "Yes",
    "src": [
      "K116"
    ]
  },
  {
    "rank": 2,
    "id": "G-036",
    "program": "ONR Long-Range BAA N0001425SB001 (Navy & Marine Corps S&T)",
    "type": "Grant",
    "award": "~$300K-$1M+/yr per effort, negotiated",
    "status": "OPEN-DEADLINE",
    "deadline": "Full proposals accepted through September 30 2026; white papers strongly encouraged first",
    "match": 5,
    "why": "Urgency: BAA N0001425SB001 closes Sep 30 2026. Submit a white paper now (strongly encouraged) on waste-heat SCWO water production; for-profits eligible.",
    "access": "Yes",
    "src": [
      "K117"
    ]
  },
  {
    "rank": 3,
    "id": "G-028",
    "program": "ESTCP demonstration/validation (Installation Energy & Water; Environmental Restoration)",
    "type": "Grant",
    "award": "~$0.5M-$3M+ per demonstration (~3 yrs)",
    "status": "ACTIVE",
    "deadline": "FY28 solicitations expected ~Dec 2026-Jan 2027, pre-proposals ~Mar 2027 (FY27 in selection Sept 2026)",
    "match": 5,
    "why": "ESTCP FY28 solicitation expected ~Dec 2026-Mar 2027; FY27 topics already named Water Resilience and Energy Resilience - direct HCSP fits; SCWO precedent ER23-7939; line up a DoD installation demo host now.",
    "access": "Yes",
    "src": [
      "K119"
    ]
  },
  {
    "rank": 4,
    "id": "G-027",
    "program": "SERDP Core BAA (Strategic Environmental Research and Development Program)",
    "type": "Grant",
    "award": "~$1M-$3M over 3-4 yrs (core); SEED exploratory <=$250K/1 yr",
    "status": "WATCH",
    "deadline": "FY28 solicitation expected ~Oct-Nov 2026 (FY27 pre-proposals closed Jan 13 2026)",
    "match": 4,
    "why": "SERDP FY28 Core BAA expected ~Oct-Nov 2026; direct SCWO PFAS-destruction precedents (ER20-5350, ER22-7338); pre-position for a FY28 Environmental Restoration SON.",
    "access": "Yes",
    "src": [
      "K118"
    ]
  },
  {
    "rank": 5,
    "id": "G-053",
    "program": "NJ PFAS Abatement Fund ($795M) via NJ Water Bank",
    "type": "Settlement fund",
    "award": "$795M fund; >=$150M to Water Bank for POTWs; >=$90M to counties for AFFF sites; SFY26 IUPs ~$900M clean-water + ~$790M drinking-water baseline",
    "status": "ACTIVE",
    "deadline": "Program design rolling out post court approval (Aug 7 2026) - engage now",
    "match": 5,
    "why": "NJ $795M PFAS Abatement Fund approved Aug 7 2026 - program design forming NOW; >=$150M routed to POTWs via the Water Bank; engage NJDEP/Water Bank while project pipelines form.",
    "access": "No—via utility partner",
    "src": [
      "K112"
    ]
  },
  {
    "rank": 6,
    "id": "G-064",
    "program": "WI Acts 200/201 PFAS grant programs (>$130M)",
    "type": "Grant",
    "award": "Community/municipal PFAS grants (~20% match); Airport & Industrial Possessor grants; landfill leachate/biosolids treatment grants; well compensation",
    "status": "ACTIVE",
    "deadline": "Launching summer 2026 - winter 2026 (sampling grants first)",
    "match": 5,
    "why": "WI Acts 200/201 (>$130M, signed Jun 2026) include grants to municipalities AND privately owned landfills for on-site leachate/biosolids treatment - launching summer-fall 2026; most direct state door for a leachate vendor.",
    "access": "No—via utility partner",
    "src": [
      "K113"
    ]
  },
  {
    "rank": 7,
    "id": "G-050",
    "program": "NYSERDA Waste-to-Low-Carbon-Fuels Pilot & Demonstration (+ July 2026 $8M alternative-fuels round)",
    "type": "Grant",
    "award": "~$8M solicitations; >=50% non-NYSERDA cost share; 3-phase pilot->demo structure",
    "status": "ACTIVE",
    "deadline": "2025 solicitation (Aug 2025) + $8M round announced Jul 21 2026 under PSC Innovation & Research Order",
    "match": 4,
    "why": "NYSERDA waste-to-low-carbon-fuels: $8M round announced Jul 21 2026; wastewater sludge is an explicitly eligible feedstock; private technology providers can lead; >=50% cost share required.",
    "access": "Yes",
    "src": [
      "K123"
    ]
  },
  {
    "rank": 8,
    "id": "G-046",
    "program": "AZ WIFA Long-Term Water Augmentation Fund - In-State Water Augmentation cycle",
    "type": "Sub-grant via partner",
    "award": "Fund balance ~$376M (post FY26 clawback); awards >$50M require Joint Legislative Water Committee review",
    "status": "ACTIVE",
    "deadline": "In-State Water Augmentation funding cycle OPEN since Nov 17 2025",
    "match": 5,
    "why": "AZ WIFA In-State Water Augmentation cycle OPEN since Nov 17 2025; private developers can propose within project teams (wastewater-to-drinking-water precedent already selected into Phase-2 funding).",
    "access": "Yes",
    "src": [
      "K125"
    ]
  },
  {
    "rank": 9,
    "id": "G-054",
    "program": "PA PENNVEST (incl. Growing Greener / Act 13 WRPP as secondary channels)",
    "type": "Loan",
    "award": "Up to $11M/project ($20M multi-municipality; board can exceed for regional consolidation); grant + 1.7-2.2% loan blends",
    "status": "ACTIVE",
    "deadline": "Rolling applications; quarterly board-meeting cutoffs",
    "match": 5,
    "why": "PA PENNVEST: rare DIRECT private eligibility (owner/operators), rolling with quarterly board cutoffs; reuse/energy-efficiency/emerging-contaminants tracks all fit.",
    "access": "Yes",
    "src": [
      "K124"
    ]
  },
  {
    "rank": 10,
    "id": "G-067",
    "program": "Imagine H2O Global Accelerator (incl. Asia track)",
    "type": "Accelerator",
    "award": "Zero-equity; ~$25K non-dilutive award + mentorship/network",
    "status": "ACTIVE",
    "deadline": "2027 cohort applications open November 2026, close December 2026; program Apr-Nov 2027",
    "match": 5,
    "why": "Imagine H2O 2027 accelerator applications open Nov-Dec 2026 - zero equity, ~$25K award, and the 2026 cohort confirmed PFAS/sludge-destruction startups in-scope.",
    "access": "Yes",
    "src": [
      "K130"
    ]
  },
  {
    "rank": 11,
    "id": "G-070",
    "program": "Elemental Impact Data Center Innovation Initiative (DCII) + core Strategy/Project Tracks",
    "type": "Equity-not-grant",
    "award": "$500K-$5M per project; up to 10 startups through 2027 (DCII); core tracks case-by-case",
    "status": "ACTIVE",
    "deadline": "Rolling through 2027",
    "match": 5,
    "why": "Elemental DCII invests $500K-$5M per project (up to 10 startups) through 2027 with Amazon/Google/Meta/Microsoft as collaborators - flagship vehicle for the data-center water+cooling+power story.",
    "access": "Yes",
    "src": [
      "K131"
    ]
  },
  {
    "rank": 12,
    "id": "G-003",
    "program": "Emerging Contaminants in Small or Disadvantaged Communities (EC-SDC) grants",
    "type": "Sub-grant via partner",
    "award": "$5B FY2022-26 total; final $1B announced May 2026",
    "status": "ACTIVE",
    "deadline": "State-driven; final BIL allotment year 2026",
    "match": 4,
    "why": "EC-SDC final $1B BIL year (May 2026 allotments) - last call to ride BIL emerging-contaminant money via small/disadvantaged water-system partners before the FY27 cliff.",
    "access": "No—via utility partner",
    "src": [
      "K109"
    ]
  },
  {
    "rank": 13,
    "id": "G-004",
    "program": "WIFIA (Water Infrastructure Finance and Innovation Act) + SWIFIA",
    "type": "Loan",
    "award": "Loans up to 49% of project costs; $20M min project ($5M small communities); ~$11B credit capacity available",
    "status": "ACTIVE",
    "deadline": "Rolling Letters of Interest, year-round",
    "match": 5,
    "why": "WIFIA: ~$11B credit capacity, rolling LOIs, direct corporate borrowers allowed with public sponsorship, FY26-27 fee waivers - the deployment-scale financing vehicle.",
    "access": "Yes",
    "src": [
      "K128"
    ]
  },
  {
    "rank": 14,
    "id": "G-048",
    "program": "FL CWSRF + BIL emerging-contaminants grants (Orlando/374Water template)",
    "type": "Sub-grant via partner",
    "award": "~$800K demo precedent; full-scale follow-ons $3M-$5M",
    "status": "ACTIVE",
    "deadline": "Rolling/annual via FL DEP",
    "match": 5,
    "why": "FL CWSRF/BIL-EC: the proven Orlando template (utility grant -> demo -> 5-yr license -> $3-5M PFAS hub); replicate now with FL utilities via rolling SRF.",
    "access": "No—via utility partner",
    "src": [
      "K114",
      "K115"
    ]
  },
  {
    "rank": 15,
    "id": "G-030",
    "program": "DoW SBIR/STTR FY27 releases (all components via DSIP; incl. Army Applied SBIR)",
    "type": "Grant",
    "award": "Phase I ~$250K (Navy up to $315K); Phase II $1.7M-$2.0M; Phase III uncapped (non-SBIR funds)",
    "status": "ACTIVE",
    "deadline": "FY27 Release 1 pre-release expected ~Oct 2026; quarterly closes (FY26 R4 closed Aug 19 2026); Army runs 3 windows/FY",
    "match": 4,
    "why": "DoW SBIR FY27 Release 1 pre-release expected ~Oct 2026; quarterly cadence restarted post-reauthorization; watch NAVFAC water/PFAS topics - N254-123/N233-117 lineage gives a Phase II/D2P2 entry.",
    "access": "Yes",
    "src": [
      "K120"
    ]
  }
],
});

// ── Part III · §8 funding landscape: the 2026 fate board (survived / restored / died / expanding) ──
Object.assign(window.RPT, {
  funding_landscape: [
    { fate: "died", name: "EPA environmental justice grants", amount: "~$2.2B+ rescinded", note: "781 EJ grants terminated; the Office of Environmental Justice closed; unobligated IRA climate-justice funds rescinded by OBBBA (P.L. 119-21, Jul 4 2025). Never a fit for a for-profit vendor anyway.", src: ["K105"] },
    { fate: "died", name: "DOE Office of Clean Energy Demonstrations", amount: "~$11.3B terminated", note: "24 awards (~$3.7B) terminated May 2025, ~$7.56B more across DOE in Oct 2025; office abolished in the Nov 2025 reorganization. No successor; FY2026 request was $0.", src: ["K106"] },
    { fate: "died", name: "48C Advanced Energy Project Credit", amount: "$10B fully allocated", note: "Both rounds allocated; OBBBA capped the program with no Round 3 expected.", src: ["K139"] },
    { fate: "died", name: "USDA REAP grants", amount: "PAUSED", note: "No FY2026 NOFO; no grant awards until regulations are rewritten under EO 14315; prior applicants without executed agreements must reapply. Guaranteed loans remain open.", src: ["K110"] },
    { fate: "died", name: "XPRIZE Water Scarcity ($119M)", amount: "CLOSED to entrants", note: "Registration shut; 37 semifinalists named May 2026; scope is seawater desalination, not wastewater destruction.", src: ["K140"] },
    { fate: "restored", name: "SBIR / STTR (all agencies)", amount: "Reauthorized to 2031", note: "Lapsed 6.5 months, reauthorized Apr 13 2026 (S. 3971) through Sep 30 2031 — higher ceilings and a new 'Strategic Breakthrough' Phase II worth up to $30M at large agencies. The most reliable direct-apply channel is fully restarted.", src: ["K108"] },
    { fate: "restored", name: "FEMA BRIC", amount: "$1B NOFO (closed Jul 23 2026)", note: "Cancelled April 2025, court-restored; combined FY2024–25 NOFO. Funds states and localities — HCSP is at most an indirect vendor partner.", src: ["K107"] },
    { fate: "expanding", name: "3M public-water-system settlement (MDL 2873)", amount: "$10.5–12.5B · >$3.5B paid", note: "Installments run through 2033–2036; >6,600 water systems registered claims. The administrator pays utilities, not vendors — sell downstream of the checks.", src: ["K111"] },
    { fate: "expanding", name: "Tyco + BASF settlements", amount: "$1.07B · payouts began 2026", note: "$750M Tyco and $316.5M BASF payments began Mar–Apr 2026; DuPont/Chemours/Corteva $1.185B distributing since Oct 2025.", src: ["K111"] },
    { fate: "expanding", name: "BIL PFAS water money — final year", amount: "$5B EC-SDC · $4B DWSRF · $1B CWSRF-EC", note: "EPA announced the last $1B EC-SDC year in May 2026 and reaffirmed $4B of DWSRF PFAS money; the CWSRF Emerging Contaminants supplement ($225M FY26) covers landfill leachate at 100% forgiveness. FY2026 is the last allotment year.", src: ["K109", "K127"] },
    { fate: "expanding", name: "NJ PFAS Abatement Fund", amount: "$795M (≥$150M to POTWs)", note: "Court-approved Aug 7 2026; routed through the NJ Water Bank. Program design is forming now — engage NJDEP while the pipeline forms.", src: ["K112"] },
    { fate: "expanding", name: "WI Acts 200/201", amount: ">$130M", note: "Signed June 2026; grants to municipalities AND privately owned landfills for on-site leachate/biosolids treatment, ≤20% match — the most direct state door a destruction vendor has had.", src: ["K113"] },
    { fate: "expanding", name: "TX Water Fund / Prop 4", amount: "up to $20B (2027–2047)", note: "Sales-tax dedication with produced-water treatment explicitly named; 2026 is the rulemaking and positioning year.", src: ["K126"] },
    { fate: "expanding", name: "NC DEQ PFAS funding", amount: "$90M+", note: "$55M state budget + ~$35M Cape Fear (Mar 2026) + BIL SRF-EC; funds construction in drinking water, wastewater, and landfill leachate — rolling through Nov 2 2026.", src: ["K132"] },
  ],

  // ── §10 12-month deadline wall: y = decimal year; cls hard/window/forming ──
  funding_calendar: [
    { y: 2026.66, label: "TX Prop 4 rulemaking", date: "2026 (interim year)", cls: "forming", ev: "2026 is the rulemaking and positioning year for the up-to-$20B sales-tax dedication (2027–2047); produced-water treatment is explicitly named. Low effort now, very high payoff later.", src: ["K126"] },
    { y: 2026.71, label: "WI Acts 200/201 rounds", date: "summer–fall 2026", cls: "window", ev: "Sampling grants launch summer/fall 2026; treatment grants (incl. privately owned landfills, ≤20% match) follow. The most direct state door for a leachate-destruction vendor.", src: ["K113"] },
    { y: 2026.74, label: "DWPR proposals due", date: "2026-09-29 · 4:00 pm MT", cls: "hard", urgent: true, ev: "Reclamation DWPR FY2026 NOFO: $5.7M total; lab ≤$300K / pilot ≤$800K federal; for-profits apply directly; produced water and municipal wastewater are named source waters. The single best-matched federal grant available today.", src: ["K116"] },
    { y: 2026.75, label: "ONR BAA closes", date: "2026-09-30", cls: "hard", urgent: true, ev: "ONR Long-Range BAA N0001425SB001: full proposals accepted through Sep 30 2026; submit a white paper first on waste-heat-driven SCWO for expeditionary/shipboard water and waste destruction.", src: ["K117"] },
    { y: 2026.79, label: "SERDP FY28 SON", date: "~Oct–Nov 2026", cls: "window", ev: "SERDP FY28 solicitation expected ~Oct–Nov 2026; FY2027 budget fully funded at $60.8M; direct SCWO precedents (ER20-5350). Pre-position for an Environmental Restoration SON.", src: ["K118"] },
    { y: 2026.81, label: "NJ fund pipeline forms", date: "post Aug 7 2026", cls: "forming", ev: "NJ $795M PFAS Abatement Fund court-approved Aug 7 2026; ≥$150M to POTWs via the Water Bank. Engage NJDEP while program design and project pipelines form.", src: ["K112"] },
    { y: 2026.83, label: "DoW SBIR FY27 R1", date: "~Oct 2026 pre-release", cls: "window", ev: "Watch for NAVFAC water/PFAS topics succeeding N254-123 (expeditionary greywater reuse) and N233-117 (PFAS defluorination; AFCEC/USACE named Phase III transition partners).", src: ["K120"] },
    { y: 2026.87, label: "NC rolling close", date: "through Nov 2 2026", cls: "hard", ev: "NC DEQ funds PFAS construction in drinking water, wastewater, and landfill leachate; rolling quarterly deadlines through Nov 2 2026.", src: ["K132"] },
    { y: 2026.92, label: "Imagine H2O 2027 apps", date: "Nov–Dec 2026", cls: "hard", ev: "Zero-equity accelerator applications for the 2027 cohort; PFAS and sludge destruction are named cohort themes; ~$25K award plus the Water Innovation Pilot Fund (~$50–150K recoverable pilot grants).", src: ["K130"] },
    { y: 2026.96, label: "EC-SRF final year ends", date: "FY2026 close-out", cls: "window", ev: "Final BIL allotment year: $225M CWSRF-EC FY26 tranche, EC-SDC's last $1B, $4B DWSRF PFAS. Projects awarded in 2026 procure equipment through 2027–2030 — get specified into state IUPs this cycle.", src: ["K109", "K127"] },
    { y: 2027.18, label: "ESTCP FY28 pre-proposals", date: "~Dec 2026–Mar 2027", cls: "hard", ev: "ESTCP FY28 cycle with 'Water Resilience on DoW Installations' and energy-resilience topics — both direct HCSP fits; FY2027 budget $125.1M; SCWO precedent ER23-7939. The pre-proposal is the gate; line up a DoD host in Q4 2026.", src: ["K119"] },
    { y: 2027.55, label: "Elemental DCII window", date: "rolling through 2027", cls: "forming", ev: "Elemental Impact Data Center Innovation Initiative: $500K–$5M per project, ≤10 startups, with Amazon/Google/Meta/Microsoft as collaborators — the flagship private fit for the water+cooling+power story.", src: ["K131"] },
  ],

  // ── §9 access architecture: three modes + the Orlando template ──
  access_modes: [
    { mode: "b", name: "Named technology in a partner's application", effort: 40, tone: "lead",
      gist: "Where the big money is. ~90% of the relevant dollar volume flows to utilities, municipalities, and public systems — not vendors. The utility writes the proposal; HCSP supplies the engineering package, cost data, and performance evidence that make it winnable.",
      template: "Orlando CWSRF grant ~$800K (Feb 2024) → 374Water demo at Iron Bridge → 5-yr waste-destruction license (Mar 2026) → $3–5M PFAS destruction hub (Jun 2026). Repeating at OC San (RISE, 6 t/d) and Minnesota (ENRTF, Dec 2025).",
      src: ["K114", "K115", "K144", "K143"] },
    { mode: "a", name: "Direct-apply programs", effort: 35, tone: "base",
      gist: "Fewer but actionable now: Reclamation DWPR, ONR Long-Range BAA, SERDP/ESTCP, all SBIR/STTR vehicles, NYSERDA waste-to-fuels, PA PENNVEST (private owner/operators eligible), AZ WIFA project teams, USDA B&I loan guarantees, WIFIA (corporations eligible with public sponsorship).",
      template: "Eight of the Top 15 are direct-apply — small-dollar, high-probability credibility plays that generate the evidence the partnerships consume.",
      src: ["K116", "K117", "K118", "K124"] },
    { mode: "c", name: "Vendor / subrecipient to prime contractors", effort: 25, tone: "base",
      gist: "Monetizes demand HCSP cannot touch directly. DoD's AFFF stockpile disposal runs through installation-level contracts with prime environmental contractors; the 2024–25 DoD demonstration series field-tested ~10 vendors and concluded on-site destruction beats off-site disposal.",
      template: "A revenue channel disguised as a grants channel: subcontract under the primes executing the Oct 1 2026 AFFF phase-out across ~1,000 facilities.",
      src: ["K133"] },
  ],
});
