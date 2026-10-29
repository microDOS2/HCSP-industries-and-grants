// ═══ Data layer · window.RPT (compiled from HCSP_Industry_Value_Report.agent.final.md) ═══
// Every figure traces to a source anchor in js/sources.js (K-numbers).
window.RPT = {

  // ── League table: fifteen industries, six-criterion weighted scores, /10 ──
  // league_fit maps the internal score bands to plain-English group names.
  league_fit: { 1: "Strongest fit", 2: "Good fit with conditions", 3: "Good fit with conditions", 4: "Weak fit" },
  league: [
    { rank: 1, key: "pfas",    name: "PFAS destruction & landfill drainage", score: 8.0,  tier: 1, payback: "Pending — manufacturer cost model",
      plain: "Regulation now requires PFAS to be destroyed, existing disposal costs $1–28 per gallon, and a federal lab test confirmed 99.9993% destruction.",
      why: "Regulation-protected destruction demand vs. $1–28/gal existing waste-hauling suppliers; federally validated 99.9993% destruction evidence.",
      src: ["K8", "K2"] },
    { rank: 2, key: "defense", name: "Defense / maritime / remote", score: 7.5,  tier: 1, payback: "Not modeled — gated by the buying process",
      plain: "The Defense Department owes more than $9.3B in PFAS cleanup across 718 sites and must phase out its firefighting foam by law; remote sites pay 2–5× normal prices.",
      why: "The Defense Department (DoD) carries >$9.3B of future PFAS cleanup across 718 installations plus a legally mandated firefighting-foam (AFFF) phase-out; 2–5× remote pricing premium.",
      src: ["K13", "K15"] },
    { rank: 3, key: "textile", name: "Textile/dyeing clusters (India)", score: 7.4, tier: 1, payback: "Pending — manufacturer cost model",
      plain: "Indian courts require zero liquid discharge, but the leftover brine and sludge still have nowhere to go — one town spent about $120M on 18 treatment plants and still cannot destroy the waste.",
      why: "Court-enforced zero liquid discharge with unsolved brine/sludge disposal; Tirupur built 18 zero liquid discharge (ZLD) plants (~$120M) and still lacks destruction.",
      src: ["K42", "K39"] },
    { rank: 4, key: "chem",    name: "Chemical & hazardous waste", score: 7.0,  tier: 2, payback: "Pending — manufacturer cost model",
      plain: "Disposing of halogenated solvents costs $15–50+ per gallon, and only about 24 licensed hazardous-waste incinerators serve the whole US, running nearly full.",
      why: "Halogenated solvents pay $15–50+/gal against ~24 federally licensed hazardous-waste incinerators (RCRA combustors) at 88–92% utilization — the widest spread between what existing suppliers charge and HCSP's negligible energy cost in the portfolio.",
      src: ["K33", "K34"] },
    { rank: 5, key: "pharma",  name: "Pharma & biotech", score: 7.0,  tier: 2, payback: "Pending — manufacturer cost model",
      plain: "Solvent and drug-ingredient disposal costs $1.50–15 per gallon, and antibiotic-resistance and EU producer-responsibility rules push drug makers toward destruction.",
      why: "$1.5–15/gal solvent and drug-ingredient disposal plus antibiotic-resistance and EU producer-responsibility mandates monetize destruction.",
      src: ["K37", "K38"] },
    { rank: 6, key: "distill", name: "Distillery / ethanol vinasse", score: 7.0, tier: 2, payback: "Pending — manufacturer cost model",
      plain: "Distillery spent wash is strong enough to make its own heat and export power, and India's pollution board forces about 270 distilleries into energy-hungry evaporation that this technology replaces.",
      why: "The standout entrant: molasses spent wash at 100–160 g/L COD makes its own heat from the waste and exports power, and India's pollution board (CPCB) forces ~270 molasses distilleries into energy-consuming thermal zero liquid discharge (ZLD) that HCSP replaces while exporting power. Reachable market $2–5B (India + Brazil, analyst build-up).",
      src: ["K61", "K62", "K64"] },
    { rank: 7, key: "semi",    name: "Semiconductor side-streams", score: 6.75, tier: 2, payback: "Pending — manufacturer cost model",
      plain: "New chip fabs face PFAS permit fights, and their solvent and polishing side-streams cost $1.80–4 per gallon to dispose of.",
      why: "PFAS permit fights on new fabs; solvent/polishing/concentrate side-streams at $1.8–4/gal. Bulk fab outgoing wastewater is a 2/10 fit.",
      src: ["K40"] },
    { rank: 8, key: "bio",     name: "Municipal sewage sludge (crisis regions)", score: 6.6, tier: 2, payback: "Pending — manufacturer cost model",
      plain: "US sewage-sludge disposal costs $4.8B a year and PFAS rules are closing the old disposal routes — but utilities take 3–7 years to buy.",
      why: "$4.8B/yr US disposal bill and PFAS-driven pathway collapse; scale and power export improve economics modestly — but bimodal economics and 3–7-year buying process.",
      src: ["K43", "K44", "K73"] },
    { rank: 9, key: "fnb",     name: "Food & beverage (side-streams only)", score: 6.3, tier: 3, payback: "Pending — manufacturer cost model",
      plain: "Digesters already handle the bulk wastewater cheaply, but concentrated side-streams cost $45–120 per 1,000 gallons to haul away.",
      why: "Anaerobic digestion owns bulk outgoing wastewater; concentrated side-streams hauled at $45–120/1,000 gal pencil, and the cooling co-product slots into existing ammonia refrigeration.",
      src: ["K46", "K84"] },
    { rank: 10, key: "islands", name: "Islands / resorts / coastal towns", score: 6.0, tier: 3, payback: "Pending — manufacturer cost model",
      plain: "Islands pay top prices for both power and water, but the waste is too watery on its own — grease and food waste must be blended in.",
      why: "The only industry where all three outputs price near global maximums — power $0.30–0.52/kWh, water priced like desalination at $2–5/m³ — but feed is dilute and needs fats/oils/grease and food waste blended in.",
      src: ["K65"] },
    { rank: 11, key: "og",     name: "Produced water (an honest niche)", score: 4.75, tier: 3, payback: "Pending — manufacturer cost model",
      plain: "Workable only in a few shale-region hubs where saltwater trucking costs $3–15 per barrel; cheap pipeline disposal elsewhere rules out a wider play.",
      why: "Real only as 50–100K barrels/day salt-first hubs in the Marcellus/Utica shale region ($3–15 per barrel trucking) or earthquake-constrained Permian pockets; Permian pipeline disposal at $0.55–1.81 per barrel forecloses any basin-scale play. Niche viability pending the manufacturer cost model.",
      src: ["K93", "K94", "K100"] },
    { rank: 12, key: "cea",    name: "Indoor agriculture (original target)", score: 4.2, tier: 4, payback: "Service model only",
      plain: "The waste stream is 99.8% water — far too weak to power the process — and only 27.3% of US cannabis operators were profitable in 2024.",
      why: "~99.8%-water stream far below the threshold where it makes its own heat from the waste, sold to distressed customers; only 27.3% of US cannabis operators profitable (2024). Cooling/water co-benefits help only at the margin.",
      src: ["K36", "K35"] },
    { rank: 13, key: "cafo",   name: "Factory-farm manure", score: 4.0, tier: 4, payback: "Not modeled — existing supplier credits win",
      plain: "Manure is 85–92% water, and government credits already pay digesters generously to handle the same waste.",
      why: "1.4B t/yr of feedstock but 85–92% water; digesters stacked with California low-carbon and federal renewable-fuel credits (>$50 per million BTU) monetize the same story better. Wedge: digestate elimination in land-constrained dairy belts (~0.8 ha/cow).",
      src: ["K66"] },
    { rank: 14, key: "mining", name: "Mining / remote camps", score: 4.0, tier: 4, payback: "Opportunistic only",
      plain: "Remote sites pay high prices for power and hauling, but each site is small and buys only when commodity prices allow.",
      why: "High value per unit — diesel at $0.30–1.10/kWh, haul avoidance, water scarcity — but small organic volumes per site and bespoke, commodity-cycle buying process.",
      src: ["K67"] },
    { rank: 15, key: "dc",     name: "Data centers, direct feed", score: 3.0, tier: 4, payback: "Buys the output, not the machine",
      plain: "Data-center waste water is the wrong kind for this process; the real play is selling them power, cooling, and reclaimed water made elsewhere.",
      why: "On-site waste is inorganic cooling-tower blowdown — not SCWO feed. The credible play is inverted: HCSP plants sited at waste-rich hosts sell power, cooling, and reclaimed water to data centers facing 4–7-year grid queues.",
      src: ["K68", "K69"] },
  ],
  tiers: [
    { tier: 1, band: "≥ 7.4", name: "Pursue now", posture: "Direct entry via concentrate-and-destroy trains; per-gallon service pricing well under what existing suppliers charge." },
    { tier: 2, band: "6.5–7.4", name: "Develop", posture: "Feed-disciplined selling into premium streams; for distillery, lead with energy-export economics against thermal zero liquid discharge (ZLD) existing suppliers." },
    { tier: 3, band: "4.5–6.4", name: "Conditional / regional", posture: "First markets to enter, where the condition holds (Caribbean/Hawaii, Marcellus hubs, behind a concentrator); partner, don't blanket-market." },
    { tier: 4, band: "< 4.5", name: "Weak fit", posture: "No revenue plan; indoor farming as a regulatory showcase, data centers as a buyer-of-the-output strategy, nickel-iron-style niche options only." },
  ],

  // ── The cost-savings lens — what existing suppliers charge to clean it up per gallon, by industry ──
  // Canonical dataset: research/hcsp_v3_savings_ladder.md. Manufacturer HCSP pricing TBD (early phase);
  // the reference contrast is qualitative only — HCSP: self-fueling loop, cost model pending — against
  // field SCWO service benchmarks ($1.63–4.88/gal, 374Water AirSCWO 6).
  savings_ladder: [
    { srank: 1,  key: "chem",    vertical: "Chemical & hazardous — halogenated solvents", lo: 15, hi: 50, plus: true,
      note: "Halogenated solvents $15–20+/gal, specialty streams to $50+/gal; lab packs $7–11/gal. The widest spread between what existing suppliers charge and HCSP's negligible energy cost in the portfolio.",
      src: ["K33"] },
    { srank: 2,  key: "defense", vertical: "Defense — firefighting foam (AFFF) concentrate", lo: 5, hi: 28,
      note: "Haz-waste landfill $28/gal (Michigan 2020); incineration $5–10/gal — both capacity-constrained, and landfilling leaves the US Superfund cleanup law (CERCLA) liability attached.",
      src: ["K9", "K10"] },
    { srank: 3,  key: "pfas",    vertical: "PFAS concentrates (foamate / ion-exchange brine)", lo: 1.83, hi: 10,
      note: "Existing SCWO services $6–10/gal; field-measured $1.63–4.88/gal (AirSCWO 6, Minnesota 3M-settlement project). Top-3 under BOTH lenses — the most robust finding.",
      src: ["K21", "K54"] },
    { srank: 4,  key: "pharma",  vertical: "Pharma & biotech solvent/drug-ingredient waste", lo: 1.5, hi: 15,
      note: "Solvent/API disposal $1.50–3/gal standard, $5–15/gal hazardous-rated; halogenated streams reach $15–50+/gal.",
      src: ["K37"] },
    { srank: 5,  key: "semi",    vertical: "Semiconductor side-streams (solvents, slurry, PFAS)", lo: 1.9, hi: 7.6,
      note: "Wafer-polishing slurry $0.5–2/L (≈$1.9–7.6/gal); fab solvents $2–4/gal; resin PFAS concentrate $1.83–4.88/gal.",
      src: ["K40", "K54"] },
    { srank: 6,  key: "cea",     vertical: "Indoor-farming sites that must haul waste away", lo: 0.40, hi: 2.50,
      note: "Where sewer discharge is restricted, nutrient runoff trucks out at $0.40–2.50/gal — the hauling-captive niche the composite lens ranks twelfth.",
      src: ["K36", "K35"] },
    { srank: 7,  key: "islands", vertical: "Islands / remote disposal", lo: 0.5, hi: 1.25,
      note: "Disposal ≥$300/wet t ≈ $1.25/gal-equivalent, binding where diesel ≥$0.35/kWh coincides.",
      src: ["K65"] },
    { srank: 8,  key: "bio",     vertical: "Municipal sewage sludge — crisis regions", lo: 0.79, hi: 1.04,
      note: "Crisis-corridor cake disposal $190–250/wet t ÷ ~240 gal/t; land application collapses under PFAS scrutiny.",
      src: ["K43"] },
    { srank: 9,  key: "mining",  vertical: "Mining / remote camps", lo: 0.5, hi: 2.0, lowConf: true,
      note: "Haul premiums 2–4× invoice at remote camps; sparse data — LOW CONFIDENCE flag.",
      src: ["K67"] },
    { srank: 10, key: "cafo",    vertical: "Factory-farm manure / digester leftovers", lo: 0.1, hi: 0.5, lowConf: true,
      note: "Spreading/haul equivalents; sparse data — LOW CONFIDENCE flag. Digester credit stacking (California's Low Carbon Fuel Standard and federal Renewable Identification Number credits, LCFS/RIN, historically >$50 per million BTU of energy) monetizes the same story better.",
      src: ["K66"] },
    { srank: 11, key: "og",      vertical: "Produced water — Marcellus niche", lo: 0.07, hi: 0.36,
      note: "$3–15/bbl trucking in the Marcellus/Utica corridor; Permian pipeline disposal ($0.55–1.81/bbl) leaves no room for any oxidation play — HCSP cost model pending.",
      src: ["K94", "K93"] },
    { srank: 12, key: "fnb",     vertical: "F&B side-streams", lo: 0.045, hi: 0.12,
      note: "Concentrated side-streams hauled at $45–120/1,000 gal; anaerobic digestion owns bulk outgoing wastewater.",
      src: ["K46"] },
    { srank: 13, key: "distill", vertical: "Distillery vinasse — evaporation route", lo: 0.007, hi: 0.010,
      note: "Multi-effect evaporation + boiler incineration operating-cost benchmark $1.8–2.6/m³ (~1¢/gal) — a regulation + energy-export play, NOT a $/gal savings play.",
      src: ["K62", "K64"] },
    { srank: 14, key: "textile", vertical: "Textile zero liquid discharge (ZLD) clusters", lo: 0.007, hi: 0.010,
      note: "Zero liquid discharge (ZLD) train operating costs $1.8–2.6/m³ (₹180–350/m³) — court-enforced compulsion drives the composite score; the existing supplier stream costs ~1¢/gal.",
      src: ["K42"] },
    { srank: 15, key: "dc",      vertical: "Data centers, direct feed", lo: null, hi: null, na: true,
      note: "N/A — buyer of the output, no remediation stream. On-site waste is inorganic cooling-tower blowdown, not SCWO feed.",
      src: ["K68"] },
  ],
  savings_meta: {
    floor: null, // HCSP cost reference band removed — no $/gal attached to HCSP; cost model pending
    floor_note: "HCSP: self-fueling loop · manufacturer cost model pending — no $/gal attached",
    field_band: "$1.63–4.88/gal field SCWO service benchmark (374Water AirSCWO 6)",
    field_src: ["K54"],
    qualifier: "margin × volume = pool — $50/gal on a tiny stream can be a smaller prize than $5/gal on a ubiquitous one",
    pending: "Manufacturer HCSP pricing is TBD (early phase): all cost-per-unit panels are ranked by addressable savings against existing supplier cost, not by manufacturer margin.",
    lenses: "The two lenses answer different questions — 'where is the margin over what existing suppliers charge?' (savings) vs. 'where do all forces align?' (composite).",
    src: ["K150"],
  },

  // ── Ch.8.3 savings before our costs are known by industry — displaced existing supplier baselines, US cost basis ──
  // Net time to earn back the cost is deliberately NOT stated: it requires HCSP cost/price inputs, and the
  // manufacturer cost model is pending. Bars were removed; existing supplier baselines are market data.
  payback: [
    { key: "haz",    name: "Hazardous solvents (halogenated)", basis: "Displaced baseline $5–20/gal (to $50+ special)", kind: "destruction", src: ["K33"] },
    { key: "pfas",   name: "PFAS concentrates",                basis: "vs. $5–10/gal incineration, $6–10/gal existing SCWO suppliers", kind: "destruction", src: ["K21", "K22"] },
    { key: "pharma", name: "Pharma / biotech high-strength",   basis: "$1.5–3/gal baseline, $5–15/gal hazardous-rated", kind: "destruction", src: ["K37"] },
    { key: "semi",   name: "Semiconductor side-streams",       basis: "$1.5–4/gal blended; multi-stream aggregation required", kind: "destruction", src: ["K40"] },
    { key: "ref",    name: "Refinery residuals (K-listed — a federal list of named hazardous wastes)",    basis: "$500/t mid-point baseline; $700–1,000/t service benchmark", kind: "disposal", src: ["K47"] },
    { key: "bio",    name: "Sewage sludge (biosolids) — crisis zones only",    basis: "$350–500/wet t crisis pricing", kind: "disposal", src: ["K43", "K44"] },
    { key: "tex",    name: "Textile clusters — India zero liquid discharge (ZLD)",     basis: "zero liquid discharge (ZLD) train ₹180–350/m³ + sludge disposal", kind: "disposal", src: ["K42"] },
    { key: "fnb",    name: "Food & beverage concentrated side-streams",    basis: "Hauling $45–120/1,000 gal + dewatering savings", kind: "disposal", src: ["K46"] },
    { key: "distill", name: "Distillery spent wash — India", basis: "Displaces mandated evaporation + incineration; ~$1.3–2.7M/yr per site", kind: "disposal", src: ["K62", "K64", "K61"] },
    { key: "islands", name: "Islands / resorts (diesel)", basis: "Addressable only where disposal ≥$300/wet t and diesel ≥$0.35/kWh coincide", kind: "disposal", src: ["K65"] },
    { key: "cea",    name: "Indoor agriculture / CEA",         basis: "No standalone equipment case — the dilute stream's value cannot cover operating costs; service model only", kind: "gap", src: ["K35", "K36"] },
  ],

  // ── Ch.1.2.3 / 8.4 grid power price context ($/m³-equivalent on the 75–95 kW startup/auxiliary spec) vs water value ──
  energy_floor: [
    { region: "MEA (Saudi/UAE industrial)", lo: 10.8, hi: 13.7, idx: 21, note: "$10–15/MWh solar power-purchase agreements (PPAs); Vision 2030 70% reuse target", src: ["K25", "K28"] },
    { region: "US Gulf / Texas",                     lo: 11.9, hi: 15.1, idx: 21, note: "TX industrial power ~6.6 ¢/kWh; produced-water reuse opening", src: ["K24"] },
    { region: "US average",                          lo: 15.5, hi: 19.7, idx: null, note: "US industrial 8.62 ¢/kWh × 180–228 kWh/m³", src: ["K23"] },
    { region: "China industrial parks",              lo: 15.8, hi: 26.4, idx: 21, note: "25%/35% reuse mandates; localization required (score adjusted for it)", src: ["K26"] },
    { region: "India ZLD clusters",                  lo: 19.4, hi: 24.6, idx: 20, note: "India's pollution board (CPCB)/India's green tribunal (NGT) mandates with 30–45-day closure enforcement", src: ["K27", "K39"] },
    { region: "EU average",                          lo: 35.7, hi: 45.2, idx: 19, note: "Viable only with heat recovery or Nordic power", src: ["K29"] },
    { region: "Germany",                             lo: 44.0, hi: 55.7, idx: null, note: "€22.64/100 kWh — grid price alone exceeds EU water+sewer tariffs", src: ["K29", "K30"] },
  ],
  water_value: { v: 3.5, note: "US average commercial water + sewer, ~$3.53/m³ combined (EPA WaterSense 2024 data)", src: ["K31"] },

  // ── Ch.4.1.2 / 8.2 what existing destruction suppliers charge umbrella ($/gal) ──
  umbrella: [
    { name: "HCSP power cost",             tbd: true, cls: "hcsp",  note: "Operating energy is negligible per the manufacturer (self-fueling loop); no $/gal figure is attached to HCSP until the manufacturer publishes a cost model.", src: ["K22", "K1"] },
    { name: "HCSP fully loaded cost",      tbd: true, cls: "hcsp",  note: "Earlier figures cited here came from SCWO industry literature and are not HCSP's costs.", src: ["K22", "K18"] },
    { name: "Deep-well injection",         lo: 1.0,  hi: 2.0,  cls: "inc",   note: "Relocation, not destruction; 'rarely available' — capacity-constrained", src: ["K9", "K10"] },
    { name: "HCSP service pricing",        tbd: true, cls: "hcsp2", note: "The $2–5/gal 'viable band' in SCWO industry literature describes 374Water's WDS service economics, not HCSP pricing.", src: ["K21"] },
    { name: "PFAS incineration",           lo: 5.0,  hi: 10.0, cls: "inc",   note: "Cheapest destructive existing supplier; air-permit gauntlet, capacity-constrained", src: ["K9", "K10"] },
    { name: "Existing SCWO service",      lo: 6.0,  hi: 10.0, cls: "inc",   note: "374Water Waste Destruction Services (WDS) benchmark; claimed 1.5–2.5-yr time to earn back the cost at $4.5–6.0M site capital", src: ["K21"] },
    { name: "Hazardous-waste landfill",    lo: 6.0,  hi: 28.0, cls: "inc",   note: "firefighting foam (AFFF) landfilled at $28/gal (Michigan 2020); the US Superfund cleanup law (CERCLA) liability persists", src: ["K10"] },
    { name: "Halogenated-solvent disposal", lo: 15.0, hi: 50.0, cls: "inc",  note: "$15–20+/gal halogenated; specialty streams to $50+/gal", src: ["K33"] },
  ],

  // ── Ch.8.1 total market / reachable market by industry (reachable market expressed in 10 m³/day module-equivalents) ──
  sizing: [
    { key: "pharma", name: "Pharma & biotech",      mod_lo: 1050, mod_hi: 1050, unit: 50, sam: "$2.1–3.2B US one-time equipment", tam: "~$3.8B/yr global pharma wastewater (2030)",
      sam_lo: 2.1, sam_hi: 3.2, sam_lab: "$2.1–3.2B", basis: "US one-time equipment pool", basis_tag: "ONE-TIME EQUIPMENT POOL",
      note: "~35% of 2,010 US establishments × 1.5 skids", src: ["K41", "K37"] },
    { key: "tex",    name: "Textile clusters (India/China)", mod_lo: 500, mod_hi: 1500, unit: 50, sam: "$0.6–3.3B cumulative equipment over 10 yr", tam: "$2–2.5B/yr sector treatment spend",
      sam_lo: 0.6, sam_hi: 3.3, sam_lab: "$0.6–3.3B", basis: "Cumulative equipment over 10 yr", basis_tag: "CUMULATIVE · 10 YR",
      note: "Only 1–3% of outgoing wastewater volume is concentrate/sludge; low-medium confidence (top-down)", src: ["K42"] },
    { key: "pfas",   name: "PFAS concentrates",      mod_lo: 200,  mod_hi: 500,  unit: 50, sam: "$300M–1.6B/yr by 2030", tam: "$1.5–4B/yr US destruction-addressable by 2030",
      sam_lo: 0.3, sam_hi: 1.6, sam_lab: "$300M–1.6B/yr", basis: "Per-year market by 2030", basis_tag: "PER-YEAR · BY 2030",
      note: "20–40% of the 2030 destruction market; $2–5/gal viable vs $5–10/gal incineration", src: ["K21", "K8"] },
    { key: "haz",    name: "Hazardous organic liquids", mod_lo: 40, mod_hi: 150, unit: 50, sam: "$2–4B/yr (NA+EU)", tam: "$17–22B/yr global, →$35–45B by 2035",
      sam_lo: 2, sam_hi: 4, sam_lab: "$2–4B/yr", basis: "Per-year market, NA+EU", basis_tag: "PER-YEAR · NA+EU",
      note: "40–150 modules ≈ $110–550M/yr service revenue for an entrant", src: ["K33"] },
    { key: "ref",    name: "Refinery residuals",     mod_lo: 41,   mod_hi: 41,   unit: 50, sam: "$95–136M/yr", tam: "$447–638M/yr technical total market (1995 DOE/API basis — dated)",
      sam_lo: 0.095, sam_hi: 0.136, sam_lab: "$95–136M/yr", basis: "Per-year market (1995 DOE/API basis — dated)", basis_tag: "PER-YEAR · 1995 BASIS, DATED",
      note: "~41 module-equivalents; treatment + direct-disposal streams only", src: ["K47"] },
  ],

  // ── The remaining ten of the consolidated fifteen industries (the five core
  // sizing rows above + these ten = the "≈$9–20B/yr · 15 industries" envelope):
  // four from report Ch. 8.1 (semiconductor, municipal sludge, food & beverage,
  // indoor agriculture) and six from the scale-expansion edition (distillery,
  // factory farms, islands, mining, produced water, data centers). Ranges are
  // the documented figures; bases differ per row and are stated. `mod_lab` is
  // the documented machine/facility count where one exists, else "Not counted".
  // Powers the §3 sizing chart's "show all 15" 3D option.
  sizing_plus: [
    { key: "distill", name: "Distillery / ethanol vinasse", sam_lo: 2, sam_hi: 5, sam_lab: "$2–5B",
      sam: "$2–5B (India + Brazil)", tam: null,
      basis: "Cumulative pool (analyst build-up)", basis_tag: "CUMULATIVE · ESTIMATE",
      note: "Molasses spent wash at 100–160 g/L COD makes its own heat and exports power; India's pollution board (CPCB) forces ~270 molasses distilleries into energy-consuming thermal zero liquid discharge (ZLD) that HCSP replaces",
      mod_lab: "~270 candidate distilleries (India)", src: ["K61", "K62", "K64"] },
    { key: "cafo", name: "Factory-farm manure", sam_lo: 1, sam_hi: 3, sam_lab: "$1–3B",
      sam: "$1–3B", tam: "1.4B t/yr of feedstock, 85–92% water",
      basis: "Cumulative pool (estimate)", basis_tag: "CUMULATIVE · ESTIMATE",
      note: "Digesters stacked with California low-carbon and federal renewable-fuel credits monetize the same story; the wedge is digestate elimination in land-constrained dairy belts",
      mod_lab: "Not counted", src: ["K66"] },
    { key: "islands", name: "Islands / resorts / coastal towns", sam_lo: 0.5, sam_hi: 1.5, sam_lab: "$0.5–1.5B",
      sam: "$0.5–1.5B", tam: null,
      basis: "Cumulative pool (estimate)", basis_tag: "CUMULATIVE · ESTIMATE",
      note: "The only industry where all three outputs price near global maximums — power $0.30–0.52/kWh, water priced like desalination at $2–5/m³ — but the feed is dilute and needs fats/oils/grease blended in",
      mod_lab: "Not counted", src: ["K65"] },
    { key: "mining", name: "Mining / remote camps", sam_lo: 0.3, sam_hi: 0.8, sam_lab: "$0.3–0.8B",
      sam: "$0.3–0.8B", tam: null,
      basis: "Cumulative pool (estimate)", basis_tag: "CUMULATIVE · ESTIMATE",
      note: "High value per unit — diesel at $0.30–1.10/kWh, haul avoidance, water scarcity — but small organic volumes per site and bespoke, commodity-cycle buying",
      mod_lab: "Not counted", src: ["K67"] },
    { key: "fnb", name: "Food & beverage side-streams", sam_lo: 0.2, sam_hi: 0.6, sam_lab: "$200–600M/yr",
      sam: "$200–600M/yr US annualized equipment (global $500M–1.5B/yr)", tam: "$20.2B (2024) → $44.3B (2035) F&B wastewater/recovery market",
      basis: "Per-year market, US annualized equipment", basis_tag: "PER-YEAR · US",
      note: "Digesters own the bulk wastewater; only concentrated side-streams at 2,000–4,000 candidate US plants (too small or remote for digestion) pencil",
      mod_lab: "2,000–4,000 candidate US plants", src: ["K46", "K84"] },
    { key: "semi", name: "Semiconductor side-streams", sam_lo: 0.3, sam_hi: 0.5, sam_lab: "$300–500M/yr",
      sam: "$300–500M/yr", tam: "$2.9–3.1B (2025) → $4.8–7.3B (2030–34) fab wastewater treatment",
      basis: "Per-year market (70–110 adopting fabs × $1–3M/yr)", basis_tag: "PER-YEAR",
      note: "PFAS permit fights on new fabs; solvent/polishing/concentrate side-streams at $1.8–4/gal; multi-stream aggregation required to reach $1–3M/yr per site",
      mod_lab: "70–110 adopting fabs", src: ["K40"] },
    { key: "bio", name: "Municipal sewage sludge (crisis regions)", sam_lo: 0.15, sam_hi: 0.5, sam_lab: "$150–500M/yr",
      sam: "$150–500M/yr", tam: "$4.8B/yr US management spend; destruction-addressable slice $2.0–3.0B/yr",
      basis: "Per-year market (5–15% of 2026–35 crisis-corridor spend)", basis_tag: "PER-YEAR",
      note: "PFAS rules are closing the old disposal routes; ~2,800 mid-size treatment plants fit the module scale, but utilities take 3–7 years to buy",
      mod_lab: "~2,800 mid-size plants fit module scale", src: ["K43", "K44", "K73"] },
    { key: "og", name: "Produced water (shale hubs)", sam_lo: 0.05, sam_hi: 0.2, sam_lab: "$50–200M/yr",
      sam: "$50–200M/yr", tam: null,
      basis: "Per-year niche (Marcellus/Utica shale hubs)", basis_tag: "PER-YEAR · NICHE",
      note: "Real only as 50–100K barrels/day salt-first hubs where trucking costs $3–15/barrel; Permian pipeline disposal at $0.55–1.81/barrel forecloses any basin-scale play",
      mod_lab: "Not counted", src: ["K93", "K94", "K100"] },
    { key: "cea", name: "Indoor agriculture", sam_lo: 0.06, sam_hi: 0.18, sam_lab: "$60–180M/yr",
      sam: "$60–180M/yr, treatment-as-a-service only", tam: "~200–600 US serviceable facilities",
      basis: "Per-year market, service model only", basis_tag: "PER-YEAR · SERVICE ONLY",
      note: "The waste stream is ~99.8% water — far too weak to power the process — and only 27.3% of US cannabis operators were profitable in 2024",
      mod_lab: "~200–600 US facilities", src: ["K36", "K35"] },
    { key: "dc", name: "Data centers (as buyers of output)", sam_lo: 0.05, sam_hi: 0.15, sam_lab: "$50–150M",
      sam: "$50–150M", tam: null,
      basis: "Cumulative pool (estimate)", basis_tag: "CUMULATIVE · ESTIMATE",
      note: "On-site waste is inorganic cooling-tower blowdown — not process feed; the credible play is HCSP plants at waste-rich hosts selling power, cooling, and reclaimed water to data centers",
      mod_lab: "Not counted — buys the output, not the machine", src: ["K68", "K69"] },
  ],
  market_meta: {
    sam_total: "~$9–20B/yr",
    sam_note: "The core industries (~$4.6–10.4B/yr) plus distillery $2–5B, factory farms $1–3B, islands $0.5–1.5B, mining $0.3–0.8B, the produced-water niche $0.05–0.2B/yr, and data centers $0.05–0.15B sum to $8.5–21B/yr, rounded. Decade-horizon annualized envelope; overlap pushes the non-overlapping pool toward the lower half.",
    scwo_equipment: "$120–460M (2025)",
    scwo_note: "Resolved from a $120M–1.13B spread across research houses on taxonomy grounds; $1.13B outlier discarded as low-authority aggregation.",
    pfas_treatment: "$2.1–3.4B/yr",
    ebj: { now: 132, was: 230, note: "Industry analyst EBJ (Environmental Business Journal) cut its 30-year PFAS market estimate 43%, from $230B (2024) to $132B (2025), explicitly on federal deregulation.", src: ["K12"] },
  },

  // ── Ch.1.1.1 HCSP specification (per the technical briefing) ──
  spec: [
    { k: "Throughput", v: "10 m³/day (~2,640 gal/day)", note: "~0.9 M gal/yr at 90% utilization", src: "K1" },
    { k: "Core technology", v: "Evaporative distillation + high-heat thermal oxidation", note: "Distillation first, then gas-phase combustion — continuous, fully automated; not a pressurized SCWO system", src: "K207" },
    { k: "Operating conditions", v: "High heat · atmospheric pressure", note: "Boil-off distillation + high-heat incineration — no pressurization, no pressure vessels (owner process description)", src: "K207", feat: true },
    { k: "Water recovery", v: "85–95% to distillate; <10 µS/cm", note: "Distilled-quality output", src: "K1" },
    { k: "Solid residual", v: "Contained, inert sludge", note: "Completely broken-down salts/oxides", src: "K1" },
    { k: "Electrical load (startup/auxiliary)", v: "~75–95 kW", note: "180–228 kWh/m³-equivalent spec; operating energy self-fueled once started", src: "K1" },
    { k: "H₂ fuel loop (as briefed)", v: "~30–40 kg/day by on-demand electrolysis", note: "Self-fueling once started — fuel generated on demand from process water; see §1", src: "K1", feat: true },
    { k: "Footprint", v: "~8–10 m² · ≤3 m height · <75 dBA at 1 m", note: "Indoor-sited, container class", src: "K1" },
    { k: "Air permitting", v: "None claimed — sealed system vents water vapor", note: "The hidden permitting advantage", src: "K1" },
  ],

  // ── Ch.8.2 per-module cost stack — HCSP has NO published cost benchmark ──
  // All $ figures are TBD pending the manufacturer cost model; the rows keep only the
  // qualitative structure of the stack. SCWO industry-literature figures are the technology
  // class's, not HCSP's, and are labeled as such where cited.
  cost_stack: [
    { el: "Electricity", basis: "Operating energy negligible per manufacturer (self-fueling loop); grid power covers only the 75–95 kW startup/auxiliary spec", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K23", "K24"] },
    { el: "Labor", basis: "Staffing for a 240-bar automated system — level pending manufacturer data", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K53"] },
    { el: "Maintenance & materials", basis: "Corrosion/salt management was the historical industry risk of conventional preheater designs; HCSP's >3,000 °F in-reactor H₂ combustion is designed to prevent salt deposition (manufacturer-stated; independent long-run data pending) — rate pending manufacturer data", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K20", "K1"] },
    { el: "Oxidant, residue disposal, misc.", basis: "No chemicals claimed; mineral residue off-take — pending manufacturer data", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K53"] },
    { el: "Cash running cost subtotal", basis: "", yr: "TBD", gal: "TBD", m3: "TBD", bold: true, src: ["K53"] },
    { el: "Purchase cost amortization", basis: "The only verifiable market reference is the AirSCWO 6's $5.2M equipment-plus-operation contract (OC San)", yr: "TBD", gal: "TBD", m3: "TBD", src: ["K18"] },
    { el: "Fully loaded cost stack", basis: "Sum of the rows above — not yet published by the manufacturer", yr: "TBD", gal: "TBD", m3: "TBD", bold: true, src: ["K53"] },
  ],

  // ── Ch.1.4 / 5.1 SCWO field · who survived and who failed (birth → outcome) ──
  players: [
    { name: "MODAR", cohort: "Failed or exited", from: 1980, to: 1996, outcome: "dead", out: "Exited",
      note: "1980s SCWO pioneer; pharma-waste destruction published 1988; the process never survived commercial scale-up.", src: ["K48"], graded: "derived" },
    { name: "Chematur / AquaCat", cohort: "Failed or exited", from: 1998, to: 2008, outcome: "sold", out: "Technology sold",
      note: "World's largest SCWO unit (3,000 L/h) operated only ~5 years before the technology was sold.", src: ["K49"], graded: "derived" },
    { name: "HydroProcessing (Harlingen, TX)", cohort: "Failed or exited", from: 2001, to: 2005, outcome: "dead", out: "Failed",
      note: "First US sewage-sludge SCWO plant; failed after ~4 years on pump durability, salt precipitation, corrosion, plugging.", src: ["K50"] },
    { name: "Blue Grass program (US Army)", cohort: "Failed or exited", from: 2003, to: 2015, outcome: "dead", out: "Rejected at full scale",
      note: ">99.9999% share of the chemical destroyed and removed over ~5,800 hot hours — but titanium/Hastelloy liner life of ~110 h implied 12 liner changes per campaign.", src: ["K51"], graded: "derived" },
    { name: "Innoveox", cohort: "Failed or exited", from: 2011, to: 2020, outcome: "dead", out: "Closed",
      note: "Listed on Euronext 2014; now closed.", src: ["K49"], graded: "derived" },
    { name: "Hanwha (Korea)", cohort: "Failed or exited", from: 2012, to: 2022, outcome: "dead", out: "Both plants idle",
      note: "Built two full-scale Korean plants; neither still operating.", src: ["K49"], graded: "derived" },
    { name: "General Atomics PERSES (iSCWO)", cohort: "Operating field", from: 2012, to: 2026, outcome: "operating", out: "Established operator",
      note: "Commercial since ~2012; >6M gallons across ~200 waste types at >99.99%, EPA-verified; Tooele unit sidelined on reliability.", src: ["K17"] },
    { name: "Battelle PFAS Annihilator", cohort: "Operating field", from: 2015, to: 2023, outcome: "licensed", out: "Licensed to Revive",
      note: "≥99.9% destruction across three firefighting foam (AFFF) formulations; fluoride mass balance confirms complete destruction.", src: ["K16"], graded: "derived" },
    { name: "374Water (NASDAQ: SCWO)", cohort: "Operating field", from: 2018, to: 2026, outcome: "operating", out: "Listed, pre-scale",
      note: "FY2025 revenue $215,037 against a $21.0M net loss; auditors warn it may run out of money — first-mover risk is real.", src: ["K52"], graded: "derived" },
    { name: "Aquarden (SuperOx)", cohort: "Operating field", from: 2016, to: 2026, outcome: "operating", out: "Operating",
      note: "All-electric 5 t/day modular units in Denmark and France, incl. ArianeGroup explosives/PFAS.", src: ["K19"], graded: "derived" },
    { name: "Revive Environmental", cohort: "Operating field", from: 2022, to: 2026, outcome: "operating", out: "First permitted SCWO PFAS service",
      note: "Operates the Annihilator as a per-gallon service — North America's first fully permitted commercial-scale SCWO PFAS system.", src: ["K16"], graded: "derived" },
  ],
  field_stats: { plants_2021: "~6", closed_2019: "all but 2", note: "As of 2021 only ~6 commercial SCWO plants operated worldwide; a 2019 review found all commercially constructed plants except two had closed.", src: ["K49"] },

  // ── Vendor benchmark small multiples (Ch.1.4.2) — five operators: the four
  //    verifiable incumbents, then HCSP (as briefed) as the fifth panel ──
  vendors: [
    { name: "374Water AirSCWO 6", scale: "6 wet t/d", trl: [7, 8], energy: "~294 kWh/m³ + IPA co-fuel", energy_kwh: [294, 294], cost: "$1.63–4.88/gal PFAS concentrate (field)", constraint: "Pre-scale finances", src: ["K54", "K52"] },
    { name: "GA PERSES (iSCWO)", scale: "t/h-class transportable", trl: [8, 9], energy: "compressed-air oxidant; 650 °C/3,400 psi", energy_kwh: null, cost: "service-based", constraint: "Tooele reliability record", src: ["K17"] },
    { name: "Aquarden SuperOx", scale: "5 t/d modular", trl: [7, 8], energy: "100% electric", energy_kwh: null, cost: "service / system sale", constraint: "EU energy prices", src: ["K19"] },
    { name: "Revive Annihilator", scale: "~500 gal/d centralized service", trl: [8, 9], energy: "centralized SCWO; energy use not disclosed", energy_kwh: null, cost: "≈$67/gal all-in (NH program, documented)", constraint: "Freight + hard-to-get permits", src: ["K16", "K163", "K195"] },
    { name: "HCSP (as briefed)", scale: "10 m³/day skid", trl: [6, 7], energy: "Self-fueling loop; atmospheric-pressure distillation first", energy_kwh: [180, 500], cost: "TBD — manufacturer cost model pending", constraint: "Prototype data pending; no commercial installations yet", src: ["K1", "K22", "K54", "K207"] },
  ],

  // ── §4B competitive deep-dive: per-company profiles (research/comp_*.md, verified Sept 2026) ──
  // Each row of each profile is drillable; row.src carries the dated K-anchors.
  comp_profiles: [
  { id: "hcsp", name: "HCSP (owner technology)", form: "Distillation + high-heat incineration · atmospheric pressure · prototype stage · pricing TBD",
    rows: [
      { lab: "Financial health", txt: "Owner-reported: working prototype built; cost model and pricing TBD", tone: "verdict", src: ["K1", "K207"],
        drill: { title: "HCSP · FINANCIAL HEALTH", value: "Prototype built; pricing TBD", sub: "Manufacturer-reported working prototype. CapEx, operating cost, and service pricing are all TBD — no invented figures.", source: "K1" } },
      { lab: "Real vs pipeline", txt: "No commercial customers yet — pilot stage", tone: "mid", src: ["K1"],
        drill: { title: "HCSP · CUSTOMERS", value: "Pilot stage", sub: "No disclosed commercial deployments. First customers to be won from the streams the four operators leave unserved.", source: "K1" } },
      { lab: "Smallest offering", txt: "10 m³/day module (briefing); scale variants planned", tone: "verdict", src: ["K1", "K207"],
        drill: { title: "HCSP · SMALLEST OFFERING", value: "10 m³/day module", sub: "Base module per the briefing; larger scale variants are planned. No pressure vessels at any size.", source: "K207" } },
      { lab: "Target customers", txt: "PFAS concentrates, hazardous liquids, distillery, islands, small facilities", tone: "verdict", src: ["K1"],
        drill: { title: "HCSP · TARGET CUSTOMERS", value: "Small and mid-size generators", sub: "The sub-$1M, on-site segment the four SCWO operators do not serve.", source: "K1" } },
      { lab: "Scale-gap verdict", txt: "Built for the sub-$1M segment the other four do not serve", tone: "verdict", src: ["K1"],
        drill: { title: "HCSP · THE OPENING", value: "Sub-$1M on-site niche", sub: "Positioned where 374Water ($4.9M floor), GA (3 gpm), Aquarden (5 t/d), and Revive (centralized freight) do not compete.", source: "K1" } }
    ] },

    {
      id: "w374", name: "374Water", form: "NASDAQ: SCWO · Durham/Morrisville NC · ~48 employees · AirSCWO",
      rows: [
        { lab: "Financial health", tone: "bad",
          txt: "FY2025 revenue $215,037 against a $21.0M net loss; auditors warn it may run out of money in both the FY2025 10-K and the Q2 2026 10-Q; cash $1.78M at June 30 2026 vs $57.2M accumulated deficit. The $50M ATM (at-the-market share-sale program) is mostly decorative — 'baby-shelf' rules (SEC caps on how much a small public company can sell) on a ~$27M float (the shares available to trade) leave ~$1.14M sellable.",
          drill: { title: "374WATER · FINANCIAL HEALTH", value: "$215K revenue · −$21.0M (FY2025)",
            sub: "Q2 2026 10-Q (filed Aug 14 2026): cash $1,776,259, accumulated deficit $57.2M, H1 net loss $7.27M — 'substantial doubt regarding our ability to continue as a going concern.' Capital is distress-flavored: 10% convertible notes ($860K), a ~$630K secured note, and an ATM capped by baby-shelf rules at ~$1.14M despite the $50M headline. 1-for-10 reverse split Dec 2025 cured the Nasdaq bid-price deficiency." },
          src: ["K52", "K151", "K152"] },
        { lab: "Real vs pipeline customers", tone: "mid",
          txt: "Real: Orlando WDS hub ($812K demo → 5-yr license, the only recurring site), Orange County CA AS6 (factory acceptance test passed Jun 2026 after ~4 years; loss-making contract, $1.6M provision), St. Cloud $600K grant-funded pilot (completed Sep 2026), Olathe $4.88M PO. Pipeline: Defense Department demos (a Defense Innovation Unit success memo earned Aug 2026), Crystal Clean, Arcadis MOU — claimed '$1.8B identified demand' is not booked orders.",
          drill: { title: "374WATER · REAL VS PIPELINE", value: "4 real contracts · the rest is pipeline",
            sub: "Every signed deal is a municipal utility, state program, or federal agency — typically grant-funded and multi-year. OC San: 2022 contract, Oct 2026 delivery, loss-making. St. Cloud: $600K mobile pilot, funded by Minnesota's legislative environment commission (LCCMR) and environment trust fund (ENRTF), completed Sep 15 2026. Orlando: the only recurring-revenue hub, ramping but not yet at the claimed $3–5M/yr. Defense Department and Defense Innovation Unit demos and MOUs are evaluations, not standing contracts." },
          src: ["K154", "K115", "K158"] },
        { lab: "Smallest offering & deal", tone: "bad",
          txt: "Only AS1 and AS6 exist as hardware. The AS1 (1 t/d) is kept in the company's own service fleet for crew-operated $0.5M+ municipal pilots — it is not sold. The smallest capital sale evidenced anywhere is the AS6: $3.0M unit inside a $4.88M project (Olathe, 11 M gal/day plant).",
          drill: { title: "374WATER · SMALLEST OFFERING", value: "AS1 service-only · smallest deal ≈$4.9M",
            sub: "The AS1 targets 0.25–0.5 M gal/day plants as a company-operated service, never a product; the AS30 is in development (first manufacturing late 2026) and AS100+ is a bespoke concept. Management's own pairing aims even the small unit at towns of ~2,500–5,000+; there is no sub-$1.5M offering of any kind." },
          src: ["K153", "K151"] },
        { lab: "Target-customer attributes", tone: "mid",
          txt: "Large municipal sewage treatment plants (Orange County CA 180 M gal/day, Orlando 40 M gal/day, Olathe 11 M gal/day), federal/defense programs (the Defense Innovation Unit (DIU), the defense environmental research program (ESTCP), Navy, USAF subcontract), and licensed hazardous-waste facility (TSDF) hosts (Clean Earth, Crystal Clean). Deals are $0.5–1M pilots → $3–5M+ systems, multi-year cycles, riding state/federal grant money — US-only to date.",
          drill: { title: "374WATER · WHO BUYS", value: "Utilities, the Defense Department (DoD), licensed hazardous-waste facility (TSDF) hosts",
            sub: "No named private industrial, agricultural, or small-community customer exists anywhere in the filings or press record. Funding rides on state grants (Minnesota's legislative environment commission and environment trust fund), state firefighting-foam programs (NC), and federal Defense Department (DoD) programs — not private operating budgets." },
          src: ["K154", "K153"] },
        { lab: "Scale-gap verdict", tone: "verdict",
          txt: "Structurally locked out of the low end: 48 employees, one Orlando factory, two AS systems in existence at YE2025, a auditors-warn-it-may-run-out-of-money balance sheet, and customer-financed builds (50% at signing at Olathe). It cannot service a long tail of small sites even if it wanted to — the gap is capital structure, not marketing choice.",
          drill: { title: "374WATER · SCALE-GAP VERDICT", value: "Locked out below ~$4.9M",
            sub: "Milestone-funded manufacturing, one-at-a-time production, and a service-heavy model structurally prevent competing for a sub-$1M, self-operated, small-site buyer. The residual risk to HCSP is at the top: the Sept 2026 strategy targets regional centralized sewage sludge (biosolids) hubs ($500–1,000/dry-ton displacement)." },
          src: ["K151", "K152", "K153"] },
      ],
    },
    {
      id: "ga", name: "General Atomics PERSES", form: "Private (Blue family) · GA-EMS (General Atomics Electromagnetic Systems) division · iSCWO line since the 1990s",
      rows: [
        { lab: "Financial health", tone: "ok",
          txt: "The strongest balance sheet in the field — a ~$3.2B-revenue private defense prime (~15,000 employees, $41.5B cumulative federal obligations) — but PERSES is a marginal, business-development-led niche line inside GA-EMS; SCWO revenue is too small to matter (de minimis) and never broken out. The risk to customers is deprioritization, not bankruptcy.",
          drill: { title: "GENERAL ATOMICS · FINANCIAL HEALTH", value: "~$3.2B private prime · niche product line",
            sub: "~$250M cumulative SCWO development over 22 years (mostly the Defense Department (DoD)-underwritten), 15+ systems built, 35,000+ operating hours. One named strategic-development director carries the public-facing line; PERSES trademark registered only Jan 2026; marketing concentrates at defense conferences (NDIA), not commercial waste channels." },
          src: ["K155", "K156"] },
        { lab: "Real vs pipeline customers", tone: "mid",
          txt: "Real: the San Diego test facility, two government-funded field demos (Clean Earth Charlotte NC, six PFAS streams Aug–Sep 2025; Lake Elmo MN via Bay West and the Army Corps of Engineers' research lab (ERDC)), 'first two systems still in use' (unnamed, 2012–14), UN-environment-fund DDT destruction in Central Asia. No publicly verifiable permanent commercial US installation at a paying customer — every 2024–26 US deployment is a government demonstration.",
          drill: { title: "GENERAL ATOMICS · REAL VS PIPELINE", value: "Demo-funded, not customer-funded",
            sub: "Deployment history is checkered: Tooele iSCWO abandoned ('lack of capacity and reliability… offsite more cost effective', EPA 2019); Blue Grass SCWO built then rejected (Aug 2020, hydrolysate trucked to Veolia); Camp Minden collapsed with the customer's bankruptcy; Tianjin (3 units, 2018) follow-through unknown. Watch: a Defense Innovation Unit (DIU) Success Memo for Charlotte would unlock sole-source-style Defense Department scaling — none public as of Sep 2026." },
          src: ["K157", "K158"] },
        { lab: "Smallest offering & deal", tone: "bad",
          txt: "The baseline is a 3 gal/min (~4,300 gal/day hydraulic) containerized skid — 25×8×9.5 ft, ~20,800 lb — scaling only by parallel modules ('x 3 gal/min'). No sub-3-gpm product, no published pricing, no trailerized rapid-deployment commercial service; realized deployments need federally permitted hazardous-waste hosts (RCRA permits) or government sponsorship.",
          drill: { title: "GENERAL ATOMICS · SMALLEST OFFERING", value: "3 gal/min container — nothing smaller",
            sub: "GA positions PERSES explicitly against 'lab and prototype systems' — it competes on industrial scale and maturity, the opposite end from small facilities. Industry SCWO cost estimates run $12–90/ton (purchase cost+running cost), and Tooele lost on cost to offsite disposal." },
          src: ["K156", "K157"] },
        { lab: "Target-customer attributes", tone: "mid",
          txt: "Defense Department environmental programs (ESTCP, the Defense Innovation Unit, demil depots), the Army Corps of Engineers' research lab (ERDC) via primes (Bay West), large licensed hazardous-waste facilities as hosts (Clean Earth — demonstrating at, not selling to), UN environmental-fund cleanups abroad, occasional industrial (China). Multi-year, grant-anchored government capture; no commercial sales force.",
          drill: { title: "GENERAL ATOMICS · WHO BUYS", value: "Government programs & licensed hazardous-waste facility hosts",
            sub: "Absent segments: municipal utilities buying directly, small industrial generators, landfill operators, airports (test feeds only), any service/throughput-pricing model, any financed or leased offering, any sub-$10M-scale packaged product." },
          src: ["K158", "K156"] },
        { lab: "Scale-gap verdict", tone: "verdict",
          txt: "Not a competitor below program scale — a marginal product line inside a defense prime will not out-iterate a focused competitor on cost-down, containerized small units, or commercial service models. Dangerous only at the top: EPA-verified pedigree + balance sheet make it the default 'safe' existing supplier for big government programs.",
          drill: { title: "GENERAL ATOMICS · SCALE-GAP VERDICT", value: "Government/national-program business only",
            sub: "For small/modular commercial business GA is presently not an effective competitor, and its structure makes that durable. Watch items: a Defense Innovation Unit (DIU) Success Memo for Charlotte; the announced Minnesota/Georgia on-site installs; a named commercial hazardous-waste facility purchase (e.g., Clean Earth converting host to buyer)." },
          src: ["K158", "K155", "K157"] },
      ],
    },
    {
      id: "aq", name: "Aquarden", form: "Aquarden Technologies ApS (Danish company registry no. 29151911) · Skævinge, Denmark · family-owned · SuperOx",
      rows: [
        { lab: "Financial health", tone: "bad",
          txt: "Negative equity every year since at least 2021, reaching −DKK 30.9M (≈ −€4.1M) at end-2025; 2025 net loss −DKK 13.0M (five-year cumulative ≈ −DKK 49.5M); DKK 2.7M cash against DKK 7.3M payroll; 11 employees, down from 18 in 2016. Carried by ~DKK 77M of growing owner/related-party debt — no equity round has ever been reported.",
          drill: { title: "AQUARDEN · FINANCIAL HEALTH", value: "Equity −DKK 30.9M · 11 employees",
            sub: "Technically insolvent on equity and wholly dependent on owner/related-party funding plus grants (Danish environmental-technology program (MUDP), French state aid via ArianeGroup, EU-originated research). Trade press flagged it in 2021 as a 'deficit-hit cleantech company.' No bankruptcy filing found — but months of runway absent new owner injections or orders." },
          src: ["K159"] },
        { lab: "Real vs pipeline customers", tone: "mid",
          txt: "Real: two industrial SuperOx units at ArianeGroup (France, 2018 explosives/propellants; 2024 PFAS) plus Aquarden's own Danish plant — the entire verifiable operating fleet. Tests/pilots: Stockholm Arlanda firefighting foam (AFFF), Sörab landfill leachate (the liquid that drains out of landfills), the 2021 EPA-directed AFFF test (run at 1 L/h lab scale in Denmark, highest residual PFOS of three vendors), Royal Copenhagen hospital wastewater. 'Deployed in five+ countries' conflates test campaigns with installations.",
          drill: { title: "AQUARDEN · REAL VS PIPELINE", value: "2 industrial units + own demo plant",
            sub: "ArianeGroup is essentially the only named industrial customer — and now markets ELIXIR™ as its own commercial service (fixed/mobile, purchase or leasing), a channel-capture risk for Aquarden. Municipal/utility customers are reached only indirectly via grant projects and treatment-train partners (ECT2, Puraffinity)." },
          src: ["K160", "K161"] },
        { lab: "Smallest offering & deal", tone: "bad",
          txt: "One unit size: 5 t/d (≤12 m³/d) per reactor, scaling by parallelization only; all-electric at 80–300 kWh/m³. Third-party estimates put a unit at ~$2–10M purchase cost. There is no small-format or low-purchase-cost product — small sites are reached only as waste generators shipping concentrate to a hub.",
          drill: { title: "AQUARDEN · SMALLEST OFFERING", value: "5 t/d per reactor — nothing smaller",
            sub: "The Danish EPA's own PFAS-inator final report names the constraint: 'the main obstacle now for onsite implementation is the capacity and throughput.' Aquarden is structurally a concentrate-polishing technology — the last step of a treatment train, positioned there because it is 'expensive.'" },
          src: ["K160"] },
        { lab: "Target-customer attributes", tone: "mid",
          txt: "Large European defense/aerospace industrials (ArianeGroup anchor), plus airports, fire services, military sites, and industrial facilities for firefighting foam (AFFF)/foamate/GAC-IX destruction — all EU-focused. No US presence or installation ('in talks', 2023); Japan entry via a licensing introducer (PFAS Busters, 2026).",
          drill: { title: "AQUARDEN · WHO BUYS", value: "EU defense/aerospace + PFAS stockholders",
            sub: "Commercialization is explicitly delegated: 'via select partners in France and North America – partnership with ArianeGroup.' With ~11 staff, negative equity, and no service network, Aquarden cannot independently sell, install, and service fleets internationally." },
          src: ["K161", "K159"] },
        { lab: "Scale-gap verdict", tone: "verdict",
          txt: "No direct product at the low end, by design: one industrial unit size aimed at large sites and centralized hubs, financed by owner debt and grants, commercialized through a prime that is capturing the channel. A smaller, cheaper, truly decentralized competitor faces no Aquarden product below ~$2M.",
          drill: { title: "AQUARDEN · SCALE-GAP VERDICT", value: "Nothing below ~$2M · EU only",
            sub: "Financial fragility (five consecutive loss years, negative equity) makes Aquarden vulnerable to any disruption of the ArianeGroup relationship or grant pipeline — and unable to finance customer-facing models (leasing, build-own-operate) at scale. Technology validation is real but qualified: the only like-for-like EPA comparison showed its outgoing wastewater PFOS residual highest of three vendors." },
          src: ["K159", "K160", "K161"] },
      ],
    },
    {
      id: "rv", name: "Revive Environmental", form: "Battelle + Viking Global Investors joint venture (2022 spinout) · Columbus OH · PFAS Annihilator service",
      rows: [
        { lab: "Financial health", tone: "mid",
          txt: "Deep-pocketed owners (Battelle + Viking Global) but no disclosed external raise since the 2023 launch; revenue undisclosed — contract anchors ($668K NH; $3M Ohio; $16.6M NJ program) imply a low-to-mid tens-of-$M services business. Founding CEO David Trueba stepped down March 6, 2026; CCO Rick Gillespie named CEO; Battelle's EVP chairs the board.",
          drill: { title: "REVIVE · FINANCIAL HEALTH", value: "Battelle+Viking JV · CEO change Mar 2026",
            sub: "Cautionary signals: revenue concentration in episodic, government-grant-funded takeback programs (Ohio's $3M was one-time Monsanto settlement money; Ohio EPA is publicly seeking funds for remaining stockpiles); single-technology dependence; a CEO transition during scale-up. BlueTech classifies it 'early revenue'." },
          src: ["K162", "K163"] },
        { lab: "Real vs pipeline customers", tone: "ok",
          txt: "Real: four state firefighting foam (AFFF) takebacks (NH, OH, NC, NJ), the 4never™ landfill-leachate service (leachate = the liquid that drains out of landfills) at Grand Rapids (300–500 gal/day of concentrate from 100–160K gal/day raw leachate), Defense Department demo programs (the ESTCP environmental research program and the Defense Innovation Unit), airport foam-transition work — and two fully permitted fixed facilities (Columbus ×5 units; Grand Rapids). Lost Colorado to Aquagga (HALT) at a $40/gal program payment.",
          drill: { title: "REVIVE · REAL VS PIPELINE", value: "4 state programs · 2 permitted sites",
            sub: "Ohio Round 1 complete Aug 2026: 13,500+ gal destroyed from 120 fire departments/airports. NJ (Mar 2026): ~150,000 gal from 400+ departments under a $16.6M appropriation. NC Phase 1 completed Jan 2026 with third-party verified destruction. Pipeline: the Defense Department (DoD) firefighting foam (AFFF) divestment wave (>2M gal stockpiles + ~1.5M gal rinsate, Oct 1 2026 phase-out) — but DoD's Feb 2026 guidance lists SCWO among 'emerging options to monitor.'" },
          src: ["K163", "K164", "K165"] },
        { lab: "Smallest offering & deal", tone: "bad",
          txt: "Not an equipment vendor: destruction is centralized at two permitted fixed sites (~500 gal/day concentrate per Annihilator), and everyone else concentrates on-site and ships to Ohio/Michigan. The smallest real door is a state-aggregated program (NH: $668K for 10,000 gal ≈ $67/gal all-in); small generators are limited to <1,000 gal per owner per collection event.",
          drill: { title: "REVIVE · SMALLEST OFFERING", value: "~500 gal/day centralized · service only",
            sub: "Units are containerized ('fits inside a pair of shipping containers') and historically called mobile, but commercial destruction happens under facility permits — permitting is the geographic bottleneck (the second site took until 2026). No published minimum batch, but freight, chain-of-custody, and program overhead impose an unofficial but real minimum economic volume." },
          src: ["K163"] },
        { lab: "Target-customer attributes", tone: "mid",
          txt: "State environmental agencies/fire marshals as prime contractor (OH, NH, NC, NJ), landfill operators via the 4never consortium, airports, the Defense Department (DoD) demonstrations, and claimed Fortune-500 industrials/municipal utilities. Service contracts at a fixed cost per gallon — not equipment sales.",
          drill: { title: "REVIVE · WHO BUYS", value: "States, landfills, airports, the Defense Department (DoD) demos",
            sub: "Freight-weighted to the Midwest/East (NH foam trucked to Michigan; NJ foam to Columbus); New England via the NEPS partnership; no West Coast presence until the GAC Renew expansion planned 2027. Small wastewater facilities face per-pound costs >6× large facilities under remove-and-destroy economics (Minnesota PCA)." },
          src: ["K163", "K166"] },
        { lab: "Scale-gap verdict", tone: "verdict",
          txt: "Centralized, protected by hard-to-get permits, government/large-volume oriented: the open flank is on-site destruction for small/remote/continuous generators who cannot economically aggregate or ship concentrate to the Midwest. The catch: third-party Certificates of Annihilation (EPA Method 1633) are now the unofficial but real buying requirement — HCSP must match that documentation to enter.",
          drill: { title: "REVIVE · SCALE-GAP VERDICT", value: "On-site small generators left open — with a documentation bar",
            sub: "Caveats: Revive is not static — containerized units can deploy on-site (the Detroit Defense Department (DoD) demo) and Viking capital could contest the niche from above. And the niche is contested anyway: Aquagga (HALT) took Colorado at $40/gal; Claros and electrochemical/plasma players crowd the small end. The gap is real but not empty." },
          src: ["K163", "K164", "K165"] },
      ],
    },
  ],

  // ── §4B cross-company comparison matrix: rows = dimensions, cols = the four operators ──
  comp_matrix: {
    cols: ["374Water", "GA PERSES", "Aquarden", "Revive Environmental"],
    rows: [
      { dim: "Financial health",
        cells: [
          { txt: "Auditors warn it may run out of money · $215K FY2025 revenue vs −$21.0M loss · cash $1.78M (Jun 2026)", src: ["K52", "K151", "K152"] },
          { txt: "~$3.2B private defense prime; PERSES a marginal niche line", src: ["K155"] },
          { txt: "Negative equity −DKK 30.9M (2025) · 11 employees · owner-debt funded", src: ["K159"] },
          { txt: "Battelle + Viking joint venture; undisclosed revenue; CEO replaced Mar 2026", src: ["K162"] } ] },
      { dim: "Smallest offering / deal",
        cells: [
          { txt: "AS1 service-only (never sold); smallest capital deal ≈$4.9M (AS6, Olathe)", src: ["K153", "K151"] },
          { txt: "3 gal/min container baseline; no smaller product; pricing undisclosed", src: ["K156"] },
          { txt: "5 t/d per reactor, parallel only; ~$2–10M/unit (third-party est.)", src: ["K160"] },
          { txt: "~500 gal/day centralized service; small generators via state aggregation only", src: ["K163"] } ] },
      { dim: "Customer types",
        cells: [
          { txt: "Municipal sewage treatment plants, Defense Department programs, licensed hazardous-waste facility hosts — all grant/government funded", src: ["K154"] },
          { txt: "Defense Department / Energy Department / Army Corps of Engineers programs, defense primes, licensed hazardous-waste facility hosts, UN Global Environment Facility cleanups", src: ["K158", "K156"] },
          { txt: "EU defense/aerospace (ArianeGroup), airports, fire services — partner-delivered", src: ["K161", "K160"] },
          { txt: "State firefighting foam (AFFF) takebacks, landfill consortia, airports, Defense Department demos", src: ["K163"] } ] },
      { dim: "Segments NOT served",
        cells: [
          { txt: "Sub-$1M buyers, small industrial/agricultural/private on-site, anything self-operated", src: ["K153", "K166"] },
          { txt: "Municipal direct sales, small generators, service pricing, rapid commercial deployment", src: ["K156", "K157"] },
          { txt: "Small facilities, US market, bulk soil/sediment, direct municipal treatment", src: ["K160", "K159"] },
          { txt: "On-site equipment ownership, dispersed small/remote generators, sewage sludge", src: ["K163", "K166"] } ] },
    ],
    note: "Every cell drills to its dated source. The shared pattern is the finding: four survivors, four different balance sheets, and not one product or service door below ≈$1M that a small facility can walk through on its own.",
    src: ["K166"],
  },

  // ── §4B scale-gap axis lanes: smallest evidenced entry per competitor, on a deal-size (log) axis ──
  scalegap: {
    domain: [0.08, 120], // $M, log
    zoneMax: 1.0,        // the unshaded-by-competitors zone: sub-$1M deals
    lanes: [
      { id: "w374", name: "374Water", kind: "split",
        ghost: { from: 0.6, to: 4.9, lab: "service pilots only" },
        bar: { from: 4.9, to: 20, lab: "equipment $4.9M+ · hubs to $10M" },
        src: ["K151", "K153", "K154"],
        drill: { title: "374WATER ON THE AXIS", value: "Floor ≈ $4.9M equipment · $0.6M service-only pilots",
          sub: "The dashed span is not a product: AS1 mobile pilots are company-crewed services at municipal/federal hosts ($600K St. Cloud). The smallest capital transaction is the Olathe AS6 at $4.88M firm fixed price. Nothing is sold below that — and the balance sheet cannot support a long tail." } },
      { id: "ga", name: "GA PERSES", kind: "hatch",
        bar: { from: 5, to: 100, lab: "3 gal/min container · program-scale only" },
        src: ["K156", "K157", "K158"],
        drill: { title: "GA PERSES ON THE AXIS", value: "Program-scale only — no published price",
          sub: "Start position is indicative, not priced: every realized 3-gal/min-container deployment is a government-funded program or a demo hosted at a licensed hazardous-waste facility; there is no smaller product, no list price, and no commercial service model. Hatched span = government/national-program business." } },
      { id: "aq", name: "Aquarden", kind: "solid",
        bar: { from: 2, to: 10, lab: "5 t/d reactor · ~$2–10M/unit est." },
        src: ["K160", "K159"],
        drill: { title: "AQUARDEN ON THE AXIS", value: "Floor ≈ $2M — one industrial unit size",
          sub: "A single 5 t/d reactor multiplied; sold or leased through ArianeGroup's ELIXIR channel in Europe. No small-format product, no US presence, and a negative-equity balance sheet that cannot finance small-facility offers." } },
      { id: "rv", name: "Revive", kind: "hollow",
        bar: { from: 0.67, to: 16.6, lab: "centralized service $0.67M→$16.6M — not equipment" },
        src: ["K163", "K164"],
        drill: { title: "REVIVE ON THE AXIS", value: "Service programs $0.67M–16.6M — never a sold unit",
          sub: "The hollow span is service contracts, not equipment: destruction happens at two permitted fixed sites; small generators enter only through state aggregation (<1,000 gal per owner per event). On-site equipment ownership is not offered." } },
      { id: "hcsp", name: "HCSP opening", kind: "hcsp",
        bar: { from: 0.1, to: 1.0, lab: "sold & self-operated — the opening" },
        src: ["K166", "K1"],
        drill: { title: "THE SCALE GAP", value: "Sub-$1M deals: no competitor serves them",
          sub: "Below ≈$1M there is no product to buy and no service door to walk through: 374Water's smallest sale is ≈$4.9M, GA sells to governments only, Aquarden starts near $2M, and Revive is centralized service. Meanwhile Minnesota's pollution agency (MPCA) finds small facilities pay >6× per pound for remove-and-destroy, and 95% of US water systems serve <10,000 customers. That unshaded zone is HCSP's opening." } },
    ],
  },

  // ── §4B watch items — events that would redraw the axis ──
  comp_watch: [
    { item: "A Defense Innovation Unit (DIU) Success Memo for General Atomics", txt: "374Water earned its memo in August 2026 — a federal buying pathway. GA's Charlotte demo memo is not yet public; if it lands, sole-source-style Defense Department scaling could follow and the existing supplier becomes dangerous at the top of the market.", src: ["K158"] },
    { item: "ArianeGroup ELIXIR goes merchant", txt: "The 2026 ELIXIR datasheet sells fixed or mobile SCWO facilities, direct purchase or leasing, as ArianeGroup's own service — Toulouse next. The European channel is being captured by the prime, not the SCWO vendor.", src: ["K161"] },
    { item: "Revive's containerized pivot", txt: "Annihilator units fit in a pair of shipping containers and can deploy on-site (Detroit Defense Department demo, 2025). A well-capitalized Revive — Viking Global behind it — could contest the on-site niche from above before HCSP occupies it.", src: ["K163"] },
    { item: "Aquagga HALT keeps winning the small end", txt: "Colorado chose Aquagga over Revive at a $40/gal program payment. The gap below $1M is real but contested — Aquagga, Claros, and electrochemical/plasma players crowd it even though the four SCWO existing suppliers don't serve it.", src: ["K165"] },
    { item: "The Certificate of Annihilation becomes the buying requirement", txt: "Third-party verified destruction to EPA Method 1633 is now the unofficial but real bid requirement (Revive's NC Phase 1, Jan 2026). To win customers, grants, and regulators, you must publish independent test results from the working prototype. That evidence is the price of admission — not an optional extra.", src: ["K164"] },
  ],

  // ── §4C customers & global footprint: per-company customer tables (research/cust_*.md, verified late 2026) ──
  // flag: "largest" | "smallest" marks the disclosed-value extremes; caveat carries the precision note
  // (e.g., NJ appropriation ≠ Revive contract value; GA's Blue Grass figure is program context, not revenue).
  cust_tables: [
    {
      id: "w374", company: "374Water · AirSCWO",
      geo: "US-only — 8 states (FL, CA, KS, MN, MI, CO, NC, OH-planned); no international sales or partners",
      note: "Every dollar of booked revenue traces to a government entity — a municipal utility, a state program, or a federal agency such as the Defense Department. Federal demos carry no disclosed values and are excluded from the largest/smallest ranking.",
      src: ["K184", "K151"],
      rows: [
        { cust: "City of Orlando — Iron Bridge WRF", loc: "Orlando, FL", type: "Municipal utility · WDS license host", value: "$812K demo → 5-yr license",
          status: "Operating — licensed WDS hub since Mar 2026; $3–5M/yr initial target, ramping below it",
          caveat: "The only recurring-revenue site: Mar 2024 demo ($812,000) → 5-yr WDS license (Mar 2026) → Jun 2026 amended license targeting $3–5M/yr, with a Sep 2026 expansion ambition of $10–14M/yr.",
          src: ["K115", "K154"] },
        { cust: "Orange County Sanitation District — Plant No. 1", loc: "Fountain Valley, CA", type: "Municipal utility · equipment sale", value: "~$4.6M implied to 374Water",
          status: "Delayed ~4 years — FAT passed Jun 2026; delivery planned Oct 2026, not publicly confirmed completed",
          caveat: "Signed 2022; $8.7M all-in district budget. Loss-making for 374Water ($1.6M accrued loss provision).",
          src: ["K181", "K154"] },
        { cust: "City of Olathe — Cedar Creek sewage treatment plant (WWTP) (via Garney Construction)", loc: "Olathe, KS", type: "Municipal utility · equipment + services", value: "$4,880,000 firm fixed price",
          status: "Contracted — in fabrication in Orlando", flag: "largest",
          caveat: "Largest single equipment order in company history: $3.0M AS6 + $1.14M pretreatment skids + fees/warranty; $2.2M milestone payment received Q1 2026.",
          src: ["K179", "K151"] },
        { cust: "City of St. Cloud — NEW Recovery Facility (w/ Barr Engineering)", loc: "St. Cloud, MN", type: "Municipal utility · mobile WDS pilot, state grant-funded", value: "$600,000",
          status: "Completed Sep 15, 2026 — four phases, no operational issues; PFAS results pending", flag: "smallest",
          caveat: "Smallest disclosed contract (Minnesota's legislative environment commission (LCCMR)/Minnesota's environment trust fund (ENRTF) grant-funded). Federal demos carry no disclosed values and may be smaller, but cannot be ranked on figures.",
          src: ["K180", "K154"] },
        { cust: "Defense Department demo (Defense Innovation Unit / ESTCP environmental research program) at the Clean Earth hazardous-waste facility (Arcadis prime)", loc: "Detroit, MI", type: "Federal demo at industrial licensed hazardous-waste facility (TSDF)", value: "Undisclosed",
          status: "Completed Jul–Sep 2025; the Army Corps of Engineers the Corps' research lab (ERDC) TR-26-19 validation; the Defense Innovation Unit (DIU) Success Memo Aug 2026",
          caveat: "Six PFAS waste streams, ~900 gal over 80 runtime hours; >99.9% destruction-and-removal in liquids. The Success Memo opens a prototype contract (OTA) buying pathway.",
          src: ["K182"] },
        { cust: "Defense Department ESTCP environmental research program / Colorado School of Mines", loc: "Peterson SFB, Colorado Springs, CO", type: "Federal demo + academic evaluation", value: "Undisclosed",
          status: "Completed 2025 — SAFF foam fractionate from PFAS-impacted sediment",
          caveat: "Mobile AirSCWO lab (AS1-class) comparative technology evaluation.",
          src: ["K185"] },
        { cust: "State of North Carolina / UNC Chapel Hill Collaboratory — firefighting foam (AFFF) take-back", loc: "North Carolina (processing at Orlando, FL hub)", type: "State government program · WDS service", value: "~$1M initial; >$5M multi-phase potential",
          status: "Operating — Phase 1 (1,000 gal) begun Nov 4, 2025; Phase 2 (up to 28,000 gal more) selection pending",
          caveat: "H370 Responsible Firefighting Foam Management Act program; 60,000-gal state initiative. The >$5M figure is unawarded potential, not a booked contract.",
          src: ["K183"] },
        { cust: "Crystal Clean (Heritage-Crystal Clean) — licensed hazardous-waste facility (TSDF) hosting", loc: "Oregon, OH", type: "Industrial haz-waste infrastructure partner", value: "Undisclosed; no revenue to date",
          status: "Announced Sep 8, 2025 — no plant built or permitted yet",
          caveat: "The press release projects $3–5M/yr recurring potential (company estimate, not booked).",
          src: ["K186"] },
        { cust: "Arcadis U.S. — strategic partnership memorandum", loc: "US (federal practice)", type: "Engineering / prime-contractor partner", value: "None — memorandum of understanding, Jul 16, 2026",
          status: "Memorandum only; no joint awards announced",
          caveat: "Arcadis to hold prime contracts where appropriate; Orlando designated the reference hub. Partner, not a customer.",
          src: ["K186"] },
      ],
    },
    {
      id: "ga", company: "General Atomics · PERSES / iSCWO",
      geo: "Realized footprint 6 countries — US (7 states) + Japan, China, Kyrgyzstan, Tajikistan; every current US deployment is government-funded",
      note: "GA's SCWO engagement values are mostly undisclosed (Defense Innovation Unit (DIU) prototype contracts, teaming subcontracts); ranking is by program context. No PERSES-specific overseas sales channel exists — international business runs through UN/GEF programs and one-off foreign sales.",
      src: ["K191", "K187"],
      rows: [
        { cust: "PEO ACWA / Bechtel-Parsons team — BGCAPP (GA = SCWO subcontractor)", loc: "Blue Grass Army Depot, Richmond, KY", type: "US Army chemical-weapons program", value: "$5.3B JV program context; GA share undisclosed",
          status: "Built, rejected Aug 2020 — hydrolysate trucked to Veolia, Port Arthur TX", flag: "largest",
          caveat: "Largest engagement by program context: $5.3B Bechtel-Parsons joint venture ($2B+ cumulative construction by 2023, incl. a purpose-built SCWO building). GA's subcontract value is undisclosed — this is not GA revenue. Largest GA-attributable programs: GEF Central Asia $44.18M and Bay West / Army Corps of Engineers research lab (ERDC) $9,999,105.",
          src: ["K187"] },
        { cust: "Army Corps of Engineers research lab (ERDC) via Bay West LLC (prime)", loc: "Lake Elmo, MN", type: "Army Corps of Engineers-funded demo · environmental prime + municipal host", value: "$9,999,105 Bay West prime award",
          status: "Demo completed May–Jun 2025 (~4 weeks, 3 streams); site prep for continued full-scale demo into 2026; the Corps' research lab (ERDC) validation Feb 2026",
          caveat: "USASpending award W912HZ23C0037 'PFAS DESTRUCTION RESEACH', 2023–2026; GA subcontracted.",
          src: ["K188"] },
        { cust: "UNEP/GEF ID 9421 — Central Asia DDT project", loc: "Suzak-A/B, Jalalabad (Kyrgyzstan) · Vakhsh, Oykamar, Khujand, Kanibadam (Tajikistan)", type: "Foreign governments via UN/GEF multilateral aid", value: "$44.18M total ($15.12M GEF grant + $29.06M co-financing)",
          status: "In implementation 2020–2027 — iSCWO the designated destruction technology; 5,000 t DDT target still ramping",
          caveat: "Basel Convention technical guidelines name transportable iSCWO as the destruction technology in use; UNGM notices show phased vendor demos as of 2025–26.",
          src: ["K190"] },
        { cust: "Tianjin Saipeng Environmental Protection Technology Co.", loc: "Binhai New Area, Tianjin, China", type: "Foreign commercial haz-waste operator", value: "3 iSCWO systems; value undisclosed",
          status: "Sold Apr 2018 — largest unit sale; commissioning never publicly verified",
          caveat: "No confirmation of operation or follow-on orders located through late 2026; corporate identity unconfirmed in public registries.",
          src: ["K189"] },
        { cust: "Defense Innovation Unit / defense research program demo at Clean Earth, Charlotte", loc: "Charlotte, NC", type: "Defense Dept demo hosted at a licensed commercial hazardous-waste facility", value: "Undisclosed (Defense Innovation Unit prototype contract)",
          status: "Demo completed Aug–Sep 2025 — six PFAS waste streams; validation report pending",
          caveat: "No public the Defense Innovation Unit (DIU) Success Memo for GA located as of late 2026 (374Water earned one, Aug 2026).",
          src: ["K158", "K191"] },
        { cust: "US Army — Tooele Army Depot", loc: "Tooele, UT", type: "US Army demilitarization depot", value: "Undisclosed (sub-scale unit)",
          status: "Abandoned — 'lack of capacity and reliability issues; offsite treatment more cost effective' (EPA 2019)",
          caveat: "Parent hydrolysis line ceased operation 2016; iSCWO bolt-on never used.",
          src: ["K157", "K191"] },
        { cust: "Explo Systems Inc. (on Army contract)", loc: "Camp Minden, LA", type: "Commercial demil contractor", value: "3 gal/min + 10 gpm units on site", flag: "smallest",
          status: "Collapsed — Explo bankruptcy/indictments; 3 gal/min unit stranded; 10 gpm redirected to McAlester AAP, OK (operation unconfirmed)",
          caveat: "Smallest named deployment: a stranded 3 gal/min skid that ran only limited testing. Sub-scale paid test campaigns (e.g., AxNano, NC) are smaller still but carry no values.",
          src: ["K191"] },
        { cust: "Kurita Water Industries / Komatsu JV", loc: "Japan", type: "Foreign industrial JV demo", value: "2 gal/min demo; >1,000 h at ~1 t/day",
          status: "Historical (early 2000s), completed",
          caveat: "Separate from JESCO's Japanese PCB SCWO plants; no Japanese follow-on found.",
          src: ["K191"] },
        { cust: "GA-EMS San Diego full-scale test facility", loc: "San Diego, CA", type: "Vendor-owned; hosts customer-paid test campaigns", value: ">6M gal cumulative; 200+ waste streams",
          status: "Operating — incl. sewage sludge (biosolids)/firefighting foam (AFFF) tests for two unnamed Southern California waste-management firms (2023)",
          caveat: "The credibility anchor (>99.99% destruction-and-removal, EPA-verified) — a test facility, not a customer installation.",
          src: ["K17", "K191"] },
      ],
    },
    {
      id: "aq", company: "Aquarden · SuperOx",
      geo: "Verified operating industrial systems in France only (2, both ArianeGroup) + Aquarden's own Danish test plant; '5+ countries deployed' is unsupported marketing",
      note: "The only multi-million-euro engagement is mediated by (and booked to) ArianeGroup; Aquarden's direct engagements are grant-funded consortia and small treatability tests. Values are project values, not Aquarden contract revenue.",
      src: ["K194", "K192"],
      rows: [
        { cust: "ArianeGroup — ELIXIR Unit 2 (PFAS)", loc: "Toulouse (île d'Empalot, Seveso site), France", type: "Defense/aerospace + commercial PFAS destruction hub", value: "€5.03M project / €1.59M French state aid",
          status: "Operating — delivered Jun 2024; prefecture authorization summer 2025", flag: "largest",
          caveat: "Largest documented engagement — but €5.03M is ArianeGroup's ELIXIR project value (France 2030/Innov'Eau), not Aquarden's contract revenue (undisclosed; unit purchase cost class est. $2–10M).",
          src: ["K192", "K161"] },
        { cust: "ArianeGroup — ELIXIR Unit 1 (energetics)", loc: "Saint-Médard-en-Jalles (Issac), Gironde, France", type: "Defense/aerospace energetics destruction service", value: "Undisclosed (unit est. $2–10M class)",
          status: "Operating industrial system since 2018 — 100–200 t/yr pyrotechnics per reactor",
          caveat: "Processes third-party defense waste (ROXEL, EURENCO, SNPE Remédiation) — a commercial destruction service, not just internal use.",
          src: ["K192", "K160"] },
        { cust: "SDIS 16 & 17 fire services (via ArianeGroup ELIXIR + Curium)", loc: "Charente & Charente-Maritime, France", type: "Municipal fire services — indirect (ArianeGroup's customer)", value: "Undisclosed (Fonds Innov'Achats funded)",
          status: "In execution 2025–26 — 23 firefighting vehicles decontaminated; rinse waste destroyed in the Toulouse ELIXIR reactor",
          caveat: "Clearest evidence of Aquarden technology reaching municipal customers — indirectly, through ArianeGroup's service wrapper.",
          src: ["K193"] },
        { cust: "Stockholm Arlanda Airport / Swedavia", loc: "Stockholm, Sweden", type: "State-owned airport operator", value: "Undisclosed (test scale)",
          status: "Completed test 2020 (679 µg/L PFOS → <0.01 µg/L) — no install; 2025 full-scale contract went to Mellifiq (capture tech)",
          caveat: "The follow-on 20,000 m³/yr water-treatment award going to a capture competitor confirms Aquarden's airport engagement stayed a one-off destruction test.",
          src: ["K194"] },
        { cust: "Sörab (Söderhälls Renhållningsverk AB) — landfill drainage-liquid test", loc: "Vallentuna / N. Stockholm region, Sweden", type: "Municipally owned waste company", value: "Undisclosed (treatability test)",
          status: "Completed 2019–20 — landfill drainage liquid with 3.7 µg/L total PFAS → <0.035 µg/L; no on-site unit installed",
          caveat: "Samples shipped to Aquarden's Danish plant — test campaign, not a deployment.",
          src: ["K194"] },
        { cust: "US EPA ORD firefighting foam (AFFF) demonstration (Krause et al. 2022)", loc: "Run at Skævinge, Denmark (lab)", type: "US government research program", value: "Undisclosed — 1 L/h bench test, single outgoing wastewater sample", flag: "smallest",
          status: "Completed 2021 — highest residual PFOS of the three vendors tested; no US follow-on",
          caveat: "Smallest documented engagement: a single-sample bench demonstration at 1 L/h. Aquarden's US status remains 'in talks' (2023) — no US installation.",
          src: ["K194"] },
        { cust: "Danish EPA environmental-technology (MUDP) 'PFAS-inator' consortium (11 partners)", loc: "Denmark (+ Norway partner)", type: "Government grant program", value: "DKK 4.85M budget / DKK 2.8M grant",
          status: "Completed Dec 2023 — >99.999% ΣPFAS-22 destruction on firefighting foam (AFFF)/GAC/IX feeds at the Skævinge plant",
          caveat: "Korsør Brandskole case was tested on Aquarden's own plant; Danish EPA: no commercial SCWO receiving plant exists in Denmark.",
          src: ["K160", "K194"] },
        { cust: "PFAS Busters LLC (Dr. Hiroshi Tomimasu)", loc: "Tokyo, Japan", type: "Market-entry / introduction partner", value: "None",
          status: "Announced Jan 2026 (nano tech/InterAqua debut) — no installation, no named end customer",
          caveat: "The same seminar claims SuperOx 'deployed in more than five countries in Europe' — a marketing statement conflating test campaigns with installations.",
          src: ["K194"] },
      ],
    },
    {
      id: "rv", company: "Revive Environmental · PFAS Annihilator (service)",
      geo: "US-only — destruction centralized at Columbus OH + Grand Rapids/Wyoming MI; programs in OH, NH, NC, NJ; Canada is a 4never marketing claim only",
      note: "Service contracts, not equipment sales. $16.6M (NJ) is the state appropriation — Revive's contract share is undisclosed; among fully documented Revive-attributable dollars the range is $668,258 (NH) → $3M (OH Round 1), with OH Round 2 ($13M+) directed but not yet awarded.",
      src: ["K195", "K196"],
      rows: [
        { cust: "New Jersey firefighting foam (AFFF) program (New Jersey's environmental agency (NJDEP) + DCA)", loc: "NJ statewide (Hunterdon Co. north, Burlington Co. south); destruction Columbus OH", type: "State environmental agency", value: "$16.6M appropriation — Revive share undisclosed",
          status: "In execution — >150,000 gal collected from 400+ departments by Jul 2026; Republic Services logistics", flag: "largest",
          caveat: "Largest program Revive serves — but $16.6M is the state appropriation, NOT Revive's contract value (undisclosed). Largest fully documented Revive-attributable award: Ohio Round 1, $3M.",
          src: ["K195"] },
        { cust: "Ohio firefighting foam (AFFF) Takeback — Round 1", loc: "Ohio statewide (10 drop-off sites); destruction Columbus OH", type: "State environmental agency (via Battelle)", value: "$3M (Monsanto settlement)",
          status: "Complete Aug 2026 — 13,500+ gal destroyed from 118 fire departments + 2 municipal airports",
          caveat: "Largest fully documented Revive-attributable award; funded from one-time settlement money.",
          src: ["K195", "K163"] },
        { cust: "Ohio firefighting foam (AFFF) Takeback — Round 2", loc: "Ohio statewide", type: "State environmental agency", value: ">$13M directed (DuPont settlement)",
          status: "Funded — registration closed Sep 4, 2026; collection anticipated Nov 2026 (≥60,000 gal estimated remaining)",
          caveat: "Round 2 vendor award structure not yet published; Battelle/Revive are the existing suppliers.",
          src: ["K195"] },
        { cust: "New Hampshire NHDES firefighting foam (AFFF) Takeback (first-in-nation)", loc: "New Hampshire (10 county events); destruction Columbus OH", type: "State environmental agency", value: "$668,258 (~10–12k gal, ~$67/gal all-in)", flag: "smallest",
          status: "Complete Aug 2024 — 125+ fire departments, ~250 foam formulations; Certificates of Processing issued",
          caveat: "Smallest documented contract in actual dollars. NC Phase 1 is smaller by volume (1,000 gal) but its value is undisclosed.",
          src: ["K195"] },
        { cust: "North Carolina firefighting foam (AFFF) Take-Back (NC Collaboratory / OSFM / NCDEQ)", loc: "North Carolina; destruction Columbus OH", type: "State-academic program", value: "Undisclosed; Phase 1 = 1,000 gal (scalable to 60,000)",
          status: "Phase 1 verified-complete Jan 22, 2026 — first provider with third-party lab verification; later phases pending",
          caveat: "Selection required prior >1,000-gal destruction experience and ≤4 parts per trillion outgoing wastewater — the documentation bar now gates bids.",
          src: ["K164", "K196"] },
        { cust: "Colorado PFAS Takeback (CDPHE)", loc: "Colorado statewide", type: "State environmental agency", value: "— (lost)",
          status: "LOST to Aquagga (HALT), ~May 2026 — 3-yr, ~40,000 gal, through fall 2028",
          caveat: "Revive's fifth-state opportunity went to a sub-scale on-site competitor at a $40/gal participant payment — the only West-of-the-Mississippi contest observed.",
          src: ["K165", "K196"] },
        { cust: "4never™ landfill-leachate consortium (Crystal Clean · Allonnia · EPOC)", loc: "Hub: Wyoming/Grand Rapids, MI; feedstock from ≥3 unnamed Michigan landfills + rail/truck multi-state", type: "Private landfill operators / industrial", value: "Fixed $/gal service; $0.15–0.40/gal raw leachate (the liquid that drains out of landfills)",
          status: "Operating continuously since May 2023 — expanded Nov 2024 to 300,000 gpd capacity",
          caveat: "300–500 gal/day of concentrate from 100–160K gal/day raw landfill drainage liquid; no landfill customer is publicly named.",
          src: ["K163", "K196"] },
        { cust: "Defense Dept research-program field demo at Clean Earth", loc: "Detroit, MI", type: "Defense Dept demonstration (defense research programs / Air Force / Navy cohort)", value: "Undisclosed",
          status: "Executed 2025 — 'it did the job we were expecting it to' (reporting phase); Wurtsmith AFB deployment planned, unconfirmed",
          caveat: "Not yet a default Defense Department disposal pathway — Feb 2026 Defense Department guidance lists SCWO among 'emerging options to monitor.'",
          src: ["K133", "K196"] },
        { cust: "Fort Wayne International Airport — aircraft firefighting-foam transition", loc: "Fort Wayne, IN", type: "Airport", value: "Undisclosed (~950 gal foam/shell water case entry)",
          status: "Complete late 2024 — two Oshkosh Stryker ARFF vehicles transitioned; third-party verified Certificate of Processing",
          caveat: "Pipeline: 30+ airports engaged at the 2025 ARFF Symposium; Revive markets against the FAA's $350M/5-yr fluorine-free transition grants.",
          src: ["K196"] },
      ],
    },
  ],

  // ── §4C geographic coverage matrix: verified presence vs marketing claims ──
  // m: op (operating, verified) · demo (demo/test only) · ann (announced/unverified) · mkt (marketing claim, unsupported) · no (no presence)
  geo_matrix: {
    cols: ["United States", "Europe", "China", "Japan", "Central Asia", "Canada / other"],
    rows: [
      { co: "374Water", cells: [
        { m: "op", txt: "FL · CA · KS · MN · MI · CO · NC · OH*", note: "8 states: Orlando FL operating WDS hub + HQ/manufacturing; OC San CA (delivery planned Oct 2026); Olathe KS ($4.88M, in fabrication); St. Cloud MN (completed); Detroit MI and Peterson SFB CO (demos); NC firefighting foam (AFFF) program (processed in FL); *Crystal Clean Oregon OH announced, unbuilt. Indiana historical only.", src: ["K184", "K179"] },
        { m: "no", txt: "—", note: "No European sales, deployments, or partners found.", src: ["K184"] },
        { m: "no", txt: "—", note: "No China presence found.", src: ["K184"] },
        { m: "no", txt: "—", note: "No Japan presence found.", src: ["K184"] },
        { m: "no", txt: "—", note: "No Central Asia presence found.", src: ["K184"] },
        { m: "mkt", txt: "Aspiration only", note: "Australia/Europe/Asia named as aspiration (Oct 2025 CEO interview); the Sep 2026 strategy makes international its 'third horizon' with no country, partner, or timeline commitments. Only non-US footprint: a Frankfurt stock listing (FRA:8LL) — a trading venue, not an operation.", src: ["K184"] },
      ]},
      { co: "GA PERSES", cells: [
        { m: "demo", txt: "CA · MN · NC · UT ✕ · KY ✕ · LA ✕ · OK", note: "San Diego CA vendor-owned test facility (operating); Lake Elmo MN and Charlotte NC government-funded demos; Tooele UT abandoned, Blue Grass KY built-then-rejected, Camp Minden LA collapsed (✕ = failed sites); McAlester OK unit shipped, operation unconfirmed. Every current US field deployment is government-funded.", src: ["K191", "K188", "K187"] },
        { m: "mkt", txt: "Corporate offices only", note: "GA-EMS enterprise offices (London, Abu Dhabi, New Delhi, Tokyo; GA-Synopta Switzerland) and 'products in 68 countries' are corporate-wide claims — no PERSES deployment or dedicated overseas channel in Europe.", src: ["K191"] },
        { m: "ann", txt: "Tianjin (3 units, 2018)", note: "Tianjin Saipeng sale announced Apr 2018 — build/test/ship contracted; commissioning and follow-through never publicly verified.", src: ["K189"] },
        { m: "demo", txt: "Historical JV", note: "Kurita/Komatsu 2 gal/min joint-development demo, early 2000s; >1,000 operating hours at ~1 t/day. No recent Japanese activity found.", src: ["K191"] },
        { m: "op", txt: "Kyrgyzstan · Tajikistan", note: "UN Environment Programme / Global Environment Facility project 9421 ($44.18M total): transportable iSCWO designated/in use for 5,000 t DDT destruction at Suzak (KG) and Vakhsh (TJ); in implementation through 2027 per Basel Convention guidelines.", src: ["K190"] },
        { m: "no", txt: "—", note: "No Canada/other presence found for the PERSES/iSCWO line.", src: ["K191"] },
      ]},
      { co: "Aquarden", cells: [
        { m: "no", txt: "—", note: "No US installation: the 2021 EPA-directed firefighting foam (AFFF) test ran on Aquarden's lab reactor in Denmark; CEO (Dec 2023) says 'in talks with U.S. companies' — pipeline only.", src: ["K194"] },
        { m: "op", txt: "FR ×2 · DK own plant · SE tests", note: "France: 2 operating industrial units (ArianeGroup Saint-Médard-en-Jalles 2018 energetics; Toulouse 2024 PFAS). Denmark: own Skævinge test/treatment plant — Danish EPA confirms no commercial SCWO receiving plant exists in Denmark. Sweden: Arlanda/Sörab test campaigns only; Norway: project-level (MUDP consortium).", src: ["K194", "K192"] },
        { m: "no", txt: "—", note: "No China presence found.", src: ["K194"] },
        { m: "ann", txt: "Partner announced", note: "PFAS Busters LLC introduction partner announced Jan 2026 — no installation, no named end customer.", src: ["K194"] },
        { m: "no", txt: "—", note: "No Central Asia presence found.", src: ["K194"] },
        { m: "mkt", txt: "'5+ countries' unsupported", note: "The partner seminar claim 'deployed in more than five countries in Europe' and the IFAT deck's 'Denmark, Singapore' are marketing reach: verifiable operating industrial systems exist only in France (2) plus Aquarden's own Danish plant. No Singapore entity, installation, or customer evidenced.", src: ["K194"] },
      ]},
      { co: "Revive", cells: [
        { m: "op", txt: "OH · MI · NH · NC · NJ · IN · CO ✕", note: "Destruction centralized at Columbus OH (5 units, fully permitted 2026) + the Grand Rapids/Wyoming MI hub (300k gal/day of landfill drainage liquid). Programs: OH, NH, NC, NJ takebacks; Defense Department demos Detroit MI (Wurtsmith planned); Fort Wayne IN airport. CO lost to Aquagga (✕). No West Coast presence; GAC RENEW west expansion planned 2027.", src: ["K196", "K195"] },
        { m: "no", txt: "—", note: "No European or other overseas destruction activity found; no non-US permits.", src: ["K196"] },
        { m: "no", txt: "—", note: "No China presence found.", src: ["K196"] },
        { m: "no", txt: "—", note: "No Japan presence found.", src: ["K196"] },
        { m: "no", txt: "—", note: "No Central Asia presence found.", src: ["K196"] },
        { m: "mkt", txt: "Canada claim only", note: "4never is marketed as 'available to the landfill and industrial waste management markets in the United States and parts of Canada' (EPOC Enviro) — a market-availability claim; no documented Canadian customer, deployment, or permit found.", src: ["K196"] },
      ]},
    ],
    note: "Verified-presence discipline: operating = a system running at a customer/host site; demo/test = time-boxed campaign; announced = contracted/partnered but not built or unverified; marketing claim = asserted footprint with no named installation behind it.",
    src: ["K184", "K191", "K194", "K196"],
  },

  // ── §4C largest/smallest metadata (drives the chips, the rail stat, and the analytical note) ──
  cust_extremes: {
    w374: { largest: "Olathe KS — $4.88M firm fixed price (largest equipment order in company history)", smallest: "St. Cloud MN — $600,000 mobile pilot (smallest disclosed)", spread: "~8× spread; no contract above $5M booked" },
    ga: { largest: "Blue Grass KY — $5.3B joint-venture program context (GA share undisclosed)", smallest: "Camp Minden LA — stranded 3 gal/min skid (smallest named deployment)", spread: "Values mostly undisclosed (Defense Innovation Unit prototype contracts, teaming subcontracts)" },
    aq: { largest: "ArianeGroup Toulouse — €5.03M project / €1.59M aid (project value, not Aquarden revenue)", smallest: "US EPA bench test — 1 L/h lab reactor, single sample (sub-€100K class)", spread: "Only multi-million engagement is booked to the prime, not the vendor" },
    rv: { largest: "New Jersey — $16.6M appropriation (Revive share undisclosed); largest documented award OH R1 $3M", smallest: "New Hampshire — $668,258 actual contract", spread: "Documented-dollar range $668K → $3M; $13M+ OH R2 directed, not yet awarded" },
    rail: "Largest order: $4.88M Olathe · Smallest: $600K St. Cloud",
  },

  // ── Regulatory catalyst horizon ──
  catalysts: [
    { y: 2023.0, label: "EPA commits to landfill PFAS rules", date: "2023", ev: "EPA commits to revising the landfill federal wastewater limits (ELG) — the first PFAS ELG", cls: "policy", src: ["K7"],
      mean: "EPA put in writing that the wastewater limits for landfills will be rewritten to cover PFAS — the rule that later makes treatment mandatory." },
    { y: 2023.55, label: "India orders ~270 distilleries to zero discharge", date: "JAN 2023", ev: "India's pollution board (CPCB) directions (19 Jan 2023) mandate zero liquid discharge for ~270 molasses distilleries — concentrate-and-incinerate route, land application disallowed, closure orders for non-compliance. The mandate that makes vinasse the standout opening", cls: "demand", src: ["K62", "K63"],
      mean: "About 270 Indian distilleries must run zero-discharge plants under threat of closure — a market created by order, already in force.",
      act: "Sell into it now — the distillery-vinasse model (HCSP-VIN) is built for exactly this mandate." },
    { y: 2024.3, label: "First US drinking-water PFAS limits", date: "2024", ev: "First federal drinking-water limits: 4.0 parts per trillion PFOA/PFOS", cls: "policy", src: ["K5"],
      mean: "The first federal limits (4 parts per trillion for PFOA/PFOS) made PFAS removal a legal duty for every US water utility." },
    { y: 2024.5, label: "PFAS becomes a hazardous substance", date: "2024", ev: "PFOA/PFOS designated hazardous substances — liability attaches to every handoff", cls: "policy", src: ["K6"],
      mean: "PFOA and PFOS were designated hazardous substances under the Superfund law (CERCLA) — anyone holding PFAS waste carries legal liability until it is destroyed." },
    { y: 2024.7, label: "WHO issues antibiotic-waste guidance", date: "2024", ev: "First global guidance on antibiotic-manufacturing waste", cls: "policy", src: ["K45"],
      mean: "The first global guidance on antibiotic-factory waste points pharma toward proven destruction of its strongest waste streams." },
    { y: 2025.7, label: "US keeps the hazardous-substance rule", date: "2025", ev: "EPA announces it will retain and defend the designation; upheld by D.C. Circuit 2026", cls: "policy", src: ["K6"],
      mean: "EPA confirmed it will keep and defend the hazardous-substance designation (upheld by the D.C. Circuit in 2026) — the liability driver survives the change of administration." },
    { y: 2026.2, label: "Defense Department re-opens PFAS incineration", date: "EARLY 2026", ev: "PFAS incineration re-opens under a permit-based framework — competition and volume validation", cls: "risk", src: ["K11"],
      mean: "The Defense Department's incineration moratorium was lifted — a competing disposal route is back, but it also confirms how much PFAS material exists.",
      act: "Compete on permitting speed, no air permit, and on-site destruction — not on price alone." },
    { y: 2026.3, label: "EPA still calls SCWO 'unproven at scale'", date: "APR 2026", ev: "Interim guidance still calls SCWO 'commercially unproven at scale' — revision is a dated event that makes it safer to invest", cls: "risk", src: ["K55"],
      mean: "EPA's April 2026 interim guidance still classes SCWO as commercially unproven at scale — permits stay harder until the next revision.",
      act: "Treat the guidance revision as a dated trigger: publish prototype long-run data so the revision lands in HCSP's favor." },
    { y: 2026.75, label: "Firefighting foam (AFFF) must be phased out", date: "OCT 2026", ev: "Statutory foam transition: ~1,000 facilities, >6,000 mobile assets, >$2.1B initial cost", cls: "demand", src: ["K14", "K15"] ,
      mean: "By law, about 1,000 facilities and more than 6,000 mobile firefighting units must switch off PFAS foam — the old foam stockpiles must be destroyed.",
      act: "Approach the Defense Department and state foam take-back programs now — they become buyers the moment the deadline hits." },
    { y: 2027.0, label: "Netherlands near-zero nitrogen rule", date: "2027", ev: "Netherlands mandates near-zero nitrogen discharge in the world's most advanced greenhouse sector", cls: "policy", src: ["K35"],
      mean: "The Netherlands will require near-zero nitrogen discharge from the world's most advanced greenhouse sector.",
      act: "Watch as a showcase niche only — the wastewater itself is too weak to pay for treatment." },
    { y: 2027.4, label: "Landfill PFAS limits expected to finalize", date: "2026–2028", ev: "Proposed rulemaking anticipated 2026 → realistic finalization window 2026–2028; ~2,600 municipal solid waste (MSW) landfills become mandatory buyers", cls: "demand", src: ["K7"],
      mean: "Federal limits on PFAS in landfill wastewater are expected to finalize in 2026–2028 — roughly 2,600 municipal landfills become mandatory buyers.",
      act: "Build landfill-owner relationships before the rule lands — pilots run now become contracts then." },
    { y: 2031.0, label: "Drinking-water compliance deadline", date: "2031", ev: "PFOA/PFOS drinking-water compliance deadline, extended from 2029", cls: "demand", src: ["K5"],
      mean: "Every US water utility must meet the PFAS drinking-water limits by 2031 — their filters and resins concentrate the PFAS, and that concentrated waste needs destruction.",
      act: "Position HCSP as the destruction step behind the utilities' carbon and resin systems." },
    { y: 2045.0, label: "EU wastewater build-out runs to 2045", date: "2045", ev: "Recast directive (EU 2024/3019): quaternary micropollutant treatment with ≥80% producer-responsibility rules (EPR) funding by pharma/cosmetics", cls: "policy", src: ["K38", "K56"],
      mean: "The EU's recast wastewater directive phases in micropollutant treatment, funded at ≥80% by drug and cosmetics makers — a legal timetable running to 2045.",
      act: "Long-term demand — no action needed this year; track it as the European build-out." },
  ],

  // ── Ch.9.2 models by industry ──
  variants: [
    { v: "HCSP-PFAS", stream: "Leachate foam fractionate; firefighting foam (AFFF) stockpiles; IX regenerant brines", pre: "Foam fractionation (0.5–2% of feed volume, up to 100,000× concentration)", mat: "Inconel 625 core; HF-tolerant trims", model: "Mobile destruction service (we run it for you), $2–5/gal", first: "Landfill operators, the Defense Department (DoD) installations, airport foam take-back", src: ["K8"] },
    { v: "HCSP-RX", stream: "Pharma mother liquors, solvent-recovery bottoms, API concentrates (COD 2,000–80,000 mg/L)", pre: "Solvent segregation; none required for strong streams", mat: "Inconel 625; corrosion allowance for pH 2–12 feeds", model: "Equipment sale + validation documentation (GMP-adjacent)", first: "API plants in Indian clusters; US/EU pharma under AMR standards", src: ["K37"] },
    { v: "HCSP-FAB", stream: "Fab solvents/strippers, TMAH developer concentrate, RO/NF PFAS concentrate", pre: "Fab-native segregation; concentrate take-off at point of origin", mat: "Titanium-lined or HF-rated reactor; CaF₂-compatible polish", model: "Point-of-origin service at 30–70% of off-site disposal cost", first: "New AZ/TX/NY fabs under PFAS permit scrutiny", src: ["K40"] },
    { v: "HCSP-HAZ", stream: "Halogenated solvents, pesticide/POPs waste, chlorinated concentrates", pre: "None (streams arrive concentrated); chloride pre-screening", mat: "Inconel 625 at 600 °C (0.6 mm/yr demonstrated); titanium liner option", model: "Premium destruction service vs. $15–50+/gal incineration", first: "Agrochemical complexes, POPs stockpile programs, chemical parks", src: ["K33", "K57"] },
    { v: "HCSP-BIO", stream: "Dewatered municipal sewage sludge (biosolids)/sludge cake (≥20–25% solids)", pre: "Screw-press/belt dewatering to a cake that makes its own heat", mat: "Standard Inconel core; grit/salt management package", model: "Regional destruction service (we run it for you) hub + mobile units; grant-funded demos", first: "Crisis-priced Northeast/Florida/California utilities", src: ["K43"] },
    { v: "HCSP-AG", stream: "CEA nutrient runoff, RO reject, pesticide/CIP side streams", pre: "None economical at 1,000–1,500 mg/L TDS; destruction for pesticide side-streams", mat: "Standard core", model: "Service/lease only (customer base cannot fund purchase cost)", first: "California cultivators in sewer-restricted jurisdictions", src: ["K36"] },
    { v: "HCSP-VIN", stream: "Distillery/ethanol vinasse (spent wash), COD 100,000–160,000 mg/L; grain-ethanol thin stillage", pre: "None — the stream arrives strong enough to make its own heat; optional potash-from-solids recovery using the route India's pollution board (CPCB) already accepts", mat: "Standard Inconel 625 core; high-salt (potash-bearing) solids-management package", model: "zero liquid discharge (ZLD) compliance retrofit displacing MEE + boiler incineration; steam/power export credited against the distillery utility bill", first: "~270 Indian molasses distilleries under the mandate of India's pollution board (CPCB); Brazilian cane mills second", src: ["K61", "K62", "K63"] },
    { v: "HCSP-TRI", stream: "Any concentrated feed (≥80–100 g/L COD) at hosts with continuous cooling demand: F&B, cold storage, district cooling", pre: "Host-dependent concentration train; feed blending to hold the threshold where it makes its own heat from the waste", mat: "Standard core + back-pressure/extraction turbine; lithium-bromide (LiBr) chiller for ≥5 °C chilled water (COP — units of cooling per unit of heat — 0.7–0.8) or NH₃–H₂O for sub-zero duty (COP 0.4–0.6)", model: "Energy-services contract: distilled water + power + chilled water sold to an anchor load; viable only at ≥500 RT continuous cooling load", first: "F&B and cold-storage complexes; district-cooling networks with metered tariffs", src: ["K84", "K85", "K83"] },
    { v: "HCSP-ISL", stream: "Island/remote sewage sludge blended with FOG and food waste; remote-camp oily wastes", pre: "Dewatering plus FOG/food-waste blending to reach feed strength that makes its own heat", mat: "Standard core, marinized enclosure; diesel-genset integration", model: "Build-own-operate micro-utility selling water, power, cooling at diesel/desal parity ($0.30–0.52/kWh; $2–5/m³); daily-cycled storage option", first: "Caribbean/USVI/Hawaii resort clusters and coastal municipalities; remote mine camps at $0.30–1.10/kWh diesel", src: ["K65", "K67"] },
  ],

  // ── Ch.10.2 what could go wrong ──
  risks: [
    { r: "Regulatory rollback slows the PFAS demand clock", like: "Medium-High", impact: "High", mit: "Anchor on the US Superfund cleanup law (CERCLA) liability and state action (11+ states on firefighting foam (AFFF)), not federal deadlines", ev: "EBJ cut its 30-yr PFAS market estimate 43%, $230B → $132B (2025)", src: ["K12"] },
    { r: "EPA guidance lag blocks permits", like: "Medium", impact: "Medium-High", mit: "State-level permits and the defense environmental research programs (ESTCP) and the Defense Innovation Unit (DIU) validation; guidance cycle as a dated trigger that makes it safer to invest", ev: "April 2026 interim guidance: 'commercially unproven at scale' — while Revive operates a permitted system", src: ["K55", "K16"] },
    { r: "Historical SCWO salt/corrosion failures (other designs)", like: "Low", impact: "Medium (residual: validation, not physics)", mit: "HCSP distills the water out first at atmospheric pressure — salts stay behind in the still as a managed residue instead of scaling inside a high-pressure reactor, and unpressurized equipment can use standard refractory linings or high-temperature stainless steel (owner process description, K207); residual item = third-party publication of prototype long-run data", ev: "Corrosion and salt plugging — not chemistry — killed prior conventional-preheater plants (HydroProcessing, Hanwha); 16–26 mm/yr in lesser alloys", src: ["K20", "K57", "K50", "K207"] },
    { r: "First-mover fragility / capital intensity", like: "High", impact: "High", mit: "Asset-light service entry; milestone-gated purchase cost; underwrite the 374Water trajectory, not its deck", ev: "$215,037 FY2025 revenue vs. $21.0M net loss; auditors warn it may run out of money", src: ["K52"] },
    { r: "Incineration re-opening erodes the PFAS niche", like: "Medium (occurred)", impact: "Medium", mit: "Compete on permitting speed, community-opposition risk, on-site liability elimination", ev: "the Defense Department (DoD) lifted the moratorium Feb 20–Mar 3, 2026 — because waste overflowed storage", src: ["K11"] },
    { r: "Customer capital constraints", like: "High", impact: "Medium", mit: "Destruction service (we run it for you) and lease structures; grant-funded demonstrations", ev: "~27% of cannabis operators profitable; 14 CEA bankruptcies in 2025; municipal buying process 3–7 years", src: ["K36", "K44"] },
    { r: "Feed-dependence of all economics", like: "Medium", impact: "High", mit: "Gate every sale on COD screening (≥60–150 g/L or upstream concentrate)", ev: "Making its own heat from the waste needs ~120–150 g/L COD; near-zero net power only above ~30 g/L organics", src: ["K58", "K59"] },
    { r: "Regional grid-price exposure (auxiliary draw & export value)", like: "Medium", impact: "Medium", mit: "Sequence by grid price (TX/MEA first); EU export value contingent on the heat-integrated variant", ev: "US industrial power spans ~6.6 ¢ (TX) to ~24 ¢ (CA commercial) — tripling what auxiliary draw costs and exported kWh earn", src: ["K23", "K24"] },
    { r: "Independent documentation of the self-fueling energy balance", like: "Medium", impact: "Medium", mit: "Publish prototype data — the on-demand hydrogen loop is manufacturer-stated and prototype-backed; independent verification converts the claim into a diligence asset", ev: "Per the manufacturer briefing: fuel generated on demand from process water, negligible net energy cost once started; a working prototype exists", src: ["K1"] },
    { r: "Scale-up beyond the demonstrated envelope", like: "High", impact: "High", mit: "Build the ladder as parallel trains (effective exponent n ≈ 0.85), never giant single vessels; stage-gate each rung on availability data from the rung below", ev: "No SCWO plant above 306 t/d has ever operated; the two largest ever built are both defunct; the LANL 5,000 m³/day design anchoring hub economics is a study, not a plant", src: ["K76", "K96", "K72"] },
    { r: "Storage/supply-chain sole-sourcing — NiFe", like: "Medium", impact: "Medium", mit: "Default to LFP for backup power and dead-site restart (black-start) on every unit; dual-source NiFe (Chinese TN-series) only for daily-cycled remote variants; track the UCLA nanostructured revival as a 5–10-yr option", ev: "The dominant US NiFe vendor went bankrupt June 2023 leaving a Chinese-only supply base; NiFe self-discharges 20–30%/month and costs ~$400–1,000/kWh against $70/kWh LFP packs", src: ["K91", "K87", "K88"] },
  ],

  // ── The bottom line (§5 decision board) — the tripwires that would change the advice ──
  verdict: {
    changes: [
      { t: "HCSP publishes its prototype long-run test data — independent proof behind the self-fueling design turns a claim into a diligence asset and moves every 'go next' market up.", src: ["K1", "K59"] },
      { t: "Independent long-run tests on salty feeds contradict the manufacturer's no-salt-deposition combustion design (>3,000 °F in-reactor hydrogen) — the core technical answer fails and the advice flips regardless of demand.", src: ["K20", "K1"] },
      { t: "The system fails to show self-fueling operation at 100 m³/day or more within 36 months — reliability stays unproven and the 'go next' expansion stalls.", src: ["K70", "K73"] },
      { t: "PFAS rules are rolled back — the Superfund (CERCLA) designation or the 4 parts-per-trillion drinking-water limits thrown out on appeal — and the demand clock slows.", src: ["K5", "K6", "K12"] },
    ],
  },

  // ── Destruction evidence record ──
  evidence: [
    { v: "99.9993%", what: "Total PFAS destroyed & removed from firefighting foam (AFFF) — AirSCWO 6, US Army Corps of Engineers research-lab evaluation", src: ["K2"] },
    { v: ">99.9%", what: "All four concentrated liquid PFAS streams — Defense Innovation Unit / defense research program (DIU/ESTCP) demonstration (Apr 2026)", src: ["K3"] },
    { v: "≥99.9%", what: "Three commercial firefighting foam (AFFF) formulations — Battelle PFAS Annihilator, peer-reviewed field work", src: ["K16"] },
    { v: ">99.9999%", what: "Chemical-weapons hydrolysate over ~5,800 h — NRC-reviewed (Blue Grass)", src: ["K51"] },
    { v: ">6M gal", what: "Destroyed across ~200 waste types at >99.99% — GA PERSES, EPA-verified", src: ["K17"] },
    { v: "99.42%", what: "COD removal on real pesticide wastewater, 600 °C/25 MPa (Inconel 625, 0.6 mm/yr)", src: ["K57"] },
  ],

  // ── Ch.11.2 scale ladder: four rungs on dilute aqueous feed (COD 5–20 g/L, non-autothermal base) ──
  // Cost and purchase cost figures were removed: they came from a modeled stack, not from the
  // manufacturer — HCSP cost model pending. Net-energy (kWh/m³) ranges are kept as
  // energy-balance model outputs, not costs.
  scale_ladder: [
    { m3d: 10,   name: "Module",        kwh: [130, 250],
      note: "130–250 kWh/m³ brackets the 294 kWh/m³ AirSCWO 6 field point on weak concentrate. Market reference for module cost: the AirSCWO 6's $5.2M equipment-plus-operation contract at OC San.", src: ["K70", "K18", "K54"] },
    { m3d: 100,  name: "Industrial hub", kwh: [80, 160],
      note: "The rung where HCSP crosses into treatment-market territory — overlaps hazardous/sewage sludge (biosolids) disposal bands; matches the vendor's ~$50/wet t projection at 30 t/d.", src: ["K70", "K71"] },
    { m3d: 1000, name: "Plant",         kwh: [45, 110],
      note: "First rung where a self-fueling operation plus a vapor power cycle pays; the Los Alamos lab base case of 55.8 kWh of electricity/m³ at 5,000 m³/d brackets the low end.", src: ["K70", "K72"] },
    { m3d: 1900, name: "Regional hub (500k gpd)", kwh: [35, 88],
      note: "No train above ~306 t/d has ever operated; the Los Alamos lab's 5,000 m³/day design is a study, not a plant — its $2–3/m³ is a design bound for a system that makes its own heat for the technology class, not an HCSP price.", src: ["K70", "K76", "K72"] },
  ],
  scale_meta: {
    exponent: "purchase cost scales at n ≈ 0.5–0.7 per train (DOE/national-lab basis); modular parallelization blends the plant-level exponent toward 0.85 — every case above ~100 m³/day is priced on the pessimistic branch.",
    physics: "Gross duty is scale-invariant at ~866 kWh_th/m³ (25→400 °C at 25 MPa) plus ~9 kWh of electricity/m³ pumping; what scale buys is heat-exchanger area.",
    limit: "The largest single-train SCWO plant ever reported processed 306 t/d; every larger concept — including the Los Alamos lab's 5,000 m³/day design — is a study, not a plant.",
    src: ["K74", "K75", "K76", "K79"],
  },

  // ── Ch.11.3 energy crossover: net electricity vs feed COD (hub with power recovery) ──
  crossover: {
    // LANL integrated SCWO-desalination model: +18 → −60 kWhₑ/m³ as feed rises 0 → ~160 g/L COD (0→53 g/L hydrocarbon), Rankine 37.8% η
    hub_line: [[0, 18], [160, -60]],
    module_band: [[5, 250, 130], [30, 120, 60], [60, 55, 18], [100, 30, 4], [150, 25, 0]], // [COD, hi, lo] — approaches zero, does not cross
    net_zero: 37.5,      // ~35–40 g/L COD
    export_from: 60,     // meaningful export ≥10 kWhₑ/m³
    streams: [
      { name: "Brewery wastewater", cod: [2, 6], side: "below", note: "2–6 g/L — structurally below the line; digestion owns this stream.", src: ["K103"] },
      { name: "Fab bulk wastewater", cod: [0.5, 5], side: "below", note: "12,000–23,000 m³/day per fab of dilute stream treated conventionally at $0.5–2/m³ — a 100–400× cost gap no SCWO configuration closes.", src: ["K40"] },
      { name: "Corn-ethanol stillage", cod: [27, 27], side: "below", note: "~27 g/L — just under the line; needs blending or mild concentration.", src: ["K103"] },
      { name: "Produced water", cod: [1, 20], side: "below", note: "Organic loading in most basins is far below the national-lab design assumption; salinity is an inorganic problem SCWO does not solve.", src: ["K72", "K59"] },
      { name: "Dewatered sewage sludge", cod: [70, 90], side: "above", note: "Sludge COD >70 g/L (Ringsjöverket operated with heat from the waste itself) — crosses into export territory.", src: ["K78"] },
      { name: "Brazilian raw vinasse", cod: [77, 77], side: "above", note: "Independently measured 77 g/L total COD.", src: ["K102"] },
      { name: "Molasses vinasse", cod: [100, 160], side: "above", note: "100–160 g/L — the strongest SCWO-native feed in the industry scan; squarely in the export band.", src: ["K61"] },
      { name: "Pharma mother liquors", cod: [80, 200], side: "above", note: "Segregated strong streams well above the 2–80 g/L bulk-outgoing wastewater range.", src: ["K37"] },
    ],
    ceiling: "Sludge-fed plants corroborate the export ceiling: SCWO at 10% dry solids is a net energy producer with 3.0–3.5 MWh/tDS recoverable (WSAA 2025).",
    src: ["K73", "K77"],
  },

  // ── Ch.12 trigeneration: map of where the heat goes, 1,000 m³/day @ 100 g/L COD, 80% heat recovery ──
  trigen: {
    basis: "1,000 m³/day plant, 100 g/L COD feed, 80% heat recovery, 8,000 operating hours/yr",
    gross: 16.1,       // MW_th reaction heat (13.88 kJ/g COD)
    preheat: 6.5,      // MW_th internal preheat duty — the price of operation that makes its own heat from the waste (~60% of gross)
    surplus: 9.6,      // MW_th exportable
    surplus_range: [6.4, 11.2],  // heat-recovery efficiency 70–85%
    power: 1.4,        // MW_e via back-pressure/extraction turbine (high-temperature slice)
    cooling_heat: 8.2, // MW_th at 150–180 °C into absorption generator
    cooling: 4.9,      // MW_c ≈ 1,392 RT (NH₃–H₂O at COP 0.6)
    water: "~900 m³/day recovered distilled water",
    value: "$1.15M/yr",       // optimal cascade at 8,000 h
    value_cooling_only: "$0.79M/yr", // if the entire surplus were committed to cooling alone
    hierarchy: [
      { form: "Power (small steam turbine, 15–20% η)", val: "$15–20", per: "MWh_th", note: "0.15–0.20 MWhₑ per megawatt-hour of heat at $0.10/kWh industrial.", src: ["K83"] },
      { form: "Absorption cooling (COP 0.6)", val: "~$10", per: "MWh_th", note: "Avoids ~0.10 MWh of electric-chiller consumption (modern chillers 0.5–0.6 kW/RT) — half to two-thirds the power rate.", src: ["K83"] },
      { form: "District chilled water, sold retail", val: "$30–48", per: "MWh_th", note: "The decisive exception: Singapore Marina Bay / Dubai Empower metered-utility tariffs make cooling leapfrog power.", src: ["K83"] },
    ],
    chillers: [
      { chem: "LiBr–H₂O (lithium-bromide/water, single-effect)", cop: "0.7–0.8", drive: "70–120 °C hot water", floor: "Above freezing only (~5 °C)", duty: "HVAC, data halls, campuses, district cooling", safety: "Non-toxic; building-safe", scale: "50 RT to >3,300 RT catalogue machines", src: ["K84"] },
      { chem: "NH₃–H₂O (single-effect)", cop: "0.4–0.6 literature; 0.6–0.75 design guide", drive: "95–180 °C (min ~82 °C / ~20 psig steam)", floor: "Sub-zero to −60 °C", duty: "Cold storage, ice plants, food/dairy process refrigeration", safety: "Toxic (IDLH 300 parts per million); OSHA PSM / EPA RMP >10,000 lb", scale: "~17–750 kW engineered-to-order", src: ["K84", "K85"] },
    ],
    limits: "Underwrite cooling at the conservative end: field-measured ammonia-absorption COP on waste heat came in at 0.28–0.45 (vs 0.6 design); ≥500 RT continuous load minimum; absorption is a displacement layer — full electric backup is built regardless.",
    src: ["K80", "K81", "K82", "K86"],
  },

  // ── Ch.13 backup-power storage comparison ──
  storage: [
    { chem: "NiFe (Edison)", cycles: "2,000–4,000 commodity (vendor claims 11–15k)", calendar: "30–50 yr (electrolyte refresh ~10 yr)", selfdis: "20–30%/mo", rte: "60–75%", cost: "$400–1,000/kWh", density: "19–25 Wh/kg",
      verdict: "NICHE — daily-cycled, extreme-temperature, multi-decade remote deployments only", role: "niche",
      note: "Durability verified (century-old Edison cells function; MIT and the Defense Department cite ~30 yr). But 20–30%/mo self-discharge is disqualifying for standby: a dark site for 6–8 weeks arrives at the emergency flat. Continuous H₂ gassing mandates ventilated enclosures; US leader Iron Edison bankrupt June 2023 — supply base now Chinese (IEC 60623). UCLA nanostructured NiFe (Feb 2026) is a 5–10-yr watch item.", src: ["K87", "K91", "K92"] },
    { chem: "LFP lithium", cycles: "4,000–6,000 @ 80–100% depth of discharge (how much of the battery is used each cycle)", calendar: "10–15 yr", selfdis: "~1–3%/mo", rte: "90–95%", cost: "$70–81/kWh pack ($200–400 small installed)", density: "90–160 Wh/kg",
      verdict: "DEFAULT — standard battery for backup power (UPS) and restarting a dead site (black-start) on every HCSP unit", role: "default",
      note: "Wins every row that governs standby duty, most by an order of magnitude: NiFe loses in 30 days roughly what LFP loses in a year. Weaknesses — thermal-runaway onset ~270 °C (lowest-risk Li-ion) and no sub-0 °C charging — are manageable inside a conditioned skid. Dominant, oversupplied supply chain (BNEF Dec 2025).", src: ["K88", "K89"] },
    { chem: "Lead-acid (VRLA — valve-regulated lead-acid, the sealed kind)", cycles: "300–800 @ 80% depth of discharge", calendar: "3–5 yr real UPS life", selfdis: "~2–4%/mo", rte: "75–85%", cost: "~$150–200/kWh", density: "30–50 Wh/kg",
      verdict: "FALSE ECONOMY — cheapest credible standby, but 3–5-yr replacement cadence on a 20-yr plant", role: "default today",
      note: "The established UPS choice: low self-discharge, no thermal runaway. But real-world life is 3–5 years regardless of 10-yr design ratings, only 30–50% of a lead-acid battery's capacity is safely usable, and life halves every 8–10 °C above 25 °C — multiplying logistics cost at exactly the remote sites where NiFe is attractive.", src: ["K89"] },
    { chem: "Vanadium redox flow", cycles: ">10,000 (effectively unlimited)", calendar: "~12–25 yr (stack ~12 yr)", selfdis: "Near-zero in tanks", rte: "~65–75%", cost: "~$300–750/kWh installed", density: "16–35 Wh/L (very bulky)",
      verdict: "EXCLUDED — a utility-storage answer, not a skid-mounted backup answer", role: "excluded",
      note: "Unlimited cycle life and no thermal runaway, but far too bulky for a containerized skid, the narrowest temperature window (10–40 °C electrolyte), and economics that only close at multi-hour utility-scale durations a 95 kW module does not need.", src: ["K90"] },
  ],
  storage_rule: "Specify LFP as the standard battery for backup power (UPS) and restarting a dead site (black-start) on every unit — default bill of materials, not a site option. NiFe only when most of: daily-cycled off-grid (self-discharge irrelevant); ambient extremes (<−20 °C or >45 °C sustained); replacement logistics dominate lifecycle cost; buyer accepts Chinese-sourced IEC 60623 hardware verified against the 2,000–4,000-cycle benchmark. Where NiFe qualifies, the architecture is hybrid — a small LFP string for instant black-start.",
  storage_src: ["K87", "K88"],

};
// ═══ Funding (compiled from HCSP_Grants_Database.xlsx + HCSP_Grants_Strategy.md, 2026-09) ═══
Object.assign(window.RPT, {
  grants_register: [
  {
    "id": "G-001",
    "program": "Clean Water State Revolving Fund (CWSRF) incl. 2021 infrastructure law (IIJA) Emerging Contaminants supplement",
    "level": "Federal",
    "agency": "EPA Office of Water -> state clean-water loan funds (SRFs)",
    "type": "Sub-grant via partner",
    "award": "State-set; FY26 ~$746M state allotments + $2.6B infrastructure-law money + $225M emerging-contaminants tranche (final infrastructure-law year)",
    "access": "No—via utility partner",
    "fit": "Water; Power; PFAS destruction",
    "vertical": "Municipal sewage sludge (biosolids); PFAS concentrate; wastewater reuse",
    "status": "ACTIVE",
    "deadline": "Rolling; annual state funding priority lists (IUPs) (summer-fall)",
    "match": 4,
    "notes": "FY2026 is the final infrastructure-law supplemental year (incl. a $225M clean-water emerging-contaminants tranche); the FY27 House proposal cuts ~16%; the WRDA 2026 water bill would add emerging-contaminants eligibility. Access via a sewage treatment plant/utility partner on the state funding priority list (IUP).",
    "url": "https://www.epa.gov/cwsrf",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-002",
    "program": "Drinking Water State Revolving Fund (DWSRF) incl. $4B PFAS/emerging-contaminants funds",
    "level": "Federal",
    "agency": "EPA Office of Water -> state clean-water loan funds (SRFs)",
    "type": "Sub-grant via partner",
    "award": "FY26 ~$411M state allotments + ~$3.4B infrastructure-law money; $4B for PFAS/emerging contaminants over 5 yrs",
    "access": "No—via utility partner",
    "fit": "Water; PFAS destruction",
    "vertical": "Drinking-water PFAS compliance; small/disadvantaged systems",
    "status": "ACTIVE",
    "deadline": "Rolling; annual state funding priority lists (IUPs)",
    "match": 4,
    "notes": "$4B of drinking-water state loan fund (DWSRF) dedicated to PFAS/emerging contaminants; destruction slots in as management of the concentrated leftovers from best-available filters (carbon/resin/reverse-osmosis); the WRDA 2026 water bill would add explicit PFAS eligibility to the drinking-water fund.",
    "url": "https://www.epa.gov/dwsrf",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-003",
    "program": "EPA grants for Emerging Contaminants in Small or Disadvantaged Communities (EC-SDC)",
    "level": "Federal",
    "agency": "EPA -> states/territories",
    "type": "Sub-grant via partner",
    "award": "$5B FY2022-26 total; final $1B announced May 2026",
    "access": "No—via utility partner",
    "fit": "PFAS destruction; Water",
    "vertical": "Small/disadvantaged community water systems",
    "status": "ACTIVE",
    "deadline": "State-driven; final the 2021 infrastructure law (BIL) allotment year 2026",
    "match": 4,
    "notes": "Final $1B year announced May 19 2026 (CA $77.3M, NY $40.5M, NJ $33.6M, AZ $20M); EPA framed the round as supporting innovation in destruction and disposal technologies; company participates as vendor to the water system.",
    "url": "https://www.epa.gov/dwcapacity",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-004",
    "program": "the federal WIFIA water-loan program + its state variant (SWIFIA)",
    "level": "Federal",
    "agency": "EPA",
    "type": "Loan",
    "award": "Loans up to 49% of project costs; $20M min project ($5M small communities); ~$11B credit capacity available",
    "access": "Yes",
    "fit": "Water; Power; PFAS destruction",
    "vertical": "Water reuse; desalination; sewage sludge (biosolids)-to-energy; alternative supply",
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
    "vertical": "Desalination; brine/zero liquid discharge (ZLD); alternative supply",
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
    "deadline": "FY26 deadline May 13 2026 (closed); watch FY27 grant application notice (NOFO)",
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
    "program": "Desalination & Water Purification Research (Reclamation's water-treatment research program (DWPR)) grant application notice (NOFO)",
    "level": "Federal",
    "agency": "Bureau of Reclamation R&D Office",
    "type": "Grant",
    "award": "Lab-scale up to $300K federal; pilot-scale up to $800K federal; $5.7M total FY26",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Produced water; municipal wastewater; impaired waters",
    "status": "CLOSED",
    "deadline": "CLOSED — was due 4:00 p.m. MT September 29 2026 (posted Jul 29 2026)",
    "match": 5,
    "notes": "Best-matched direct-apply federal grant: for-profit firms eligible directly; produced water and municipal wastewater are named eligible source waters; ~75% non-federal cost share for pilots. The FY2026 deadline passed Sep 29 2026 — CLOSED; Reclamation's water-treatment research program (DWPR) is an annual cycle, so track the FY2027 grant application notice (NOFO) and the companion Pitch-to-Pilot NOFO (last issued FY2024).",
    "url": "https://www.usbr.gov/research/dwpr/index.html",
    "src": [
      "K116"
    ]
  },
  {
    "id": "G-010",
    "program": "EPA small-business research grants (SBIR) (Phase I/II contracts)",
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
    "notes": "Reauthorized Apr 13 2026 (S. 3971) through Sept 30 2031 after 6.5-month lapse; recurring water topics include PFAS destruction in wastewater sludge/sewage sludge (biosolids); join EPA small-business research grants (SBIR) listserv and pre-position proposal.",
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
    "vertical": "Stormwater/water reuse; sewage-sludge-to-energy; alternative supply",
    "status": "WATCH",
    "deadline": "Periodic grant application notices (NOFOs); Wastewater Efficiency authorization lapses after FY26 (watch WRDA 2026); Alternative Water Source first solicitation anticipated",
    "match": 3,
    "notes": "Municipalities/sewage treatment plants/water authorities only - company as technology vendor; Wastewater Efficiency Grant Pilot (DWWIA 50202) fits sewage sludge (biosolids)-to-power but is minimally funded; Alternative Water Source (DWWIA 50203) received first-ever $2M FY26 appropriation.",
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
    "vertical": "PFAS in landfills/landfill drainage liquid; sewage sludge; water reuse research",
    "status": "WATCH",
    "deadline": "No open RFAs as of Aug 2026; RFAs intermittent",
    "match": 2,
    "notes": "For-profits not eligible as prime; participate as subcontractor on university-led proposals; closed RFAs (PFAS destruction in landfills/leachates, sewage sludge (biosolids), reuse) indicate recurring topics.",
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
    "deadline": "Terminated 2025; unobligated the Inflation Reduction Act (IRA) funds rescinded by the July 2025 budget law (OBBBA); litigation ongoing",
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
    "notes": "Not grant programs - market channels: PFAS OUT (launched Apr 14 2026) drives PFOA/PFOS drinking-water limit (MCL) compliance demand; EPA PFAS destruction technology event (May 2026) is a direct demand signal for destruction tech; engage as technology vendor.",
    "url": "https://www.epa.gov/aboutepa/epa-racking-massive-environmental-accomplishments-under-trump-administration",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-015",
    "program": "DOE's applied energy offices: Alternative Fuels & Feedstocks and Hydropower & Hydrokinetic",
    "level": "Federal",
    "agency": "DOE CMEI (AFFO / H2O)",
    "type": "Grant",
    "award": "the fuels office historically $500K-$2M+ per award (FY26 $245M); the water office FY26 $220M",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Wet wastes (sludge, manure, food waste) to energy/fuels",
    "status": "WATCH",
    "deadline": "No open AFFO grant application notice (NOFO) as of Jul 2 2026; NOFO-driven; monitor CMEI eXCHANGE",
    "match": 2,
    "notes": "AFFO funded but quiet ('no current open bioenergy funding opportunities'); emphasis shifted to fuels/SAF - good fit if a wet-waste grant application notice (NOFO) opens. H2O scoped to hydro/marine energy: poor fit. Companion Waste-to-Energy TA targets governments (pull-through route).",
    "url": "https://www.energy.gov/cmei/fuels/bioenergy-technologies-funding-opportunities",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-016",
    "program": "DOE Industrial Efficiency & Decarbonization Office (IEDO) grant application notices (NOFOs) / Onsite Energy TAPs / prizes",
    "level": "Federal",
    "agency": "DOE CMEI - IEDO",
    "type": "Grant",
    "award": "Technical-assistance awards $900K-$8M; funding calls to $100M+ total; FY26 $390M advanced manufacturing/industrial lines",
    "access": "Yes",
    "fit": "Power; PFAS destruction",
    "vertical": "Industrial wastewater at food/beverage, chemical, dairy plants",
    "status": "WATCH",
    "deadline": "No large open grant application notice (NOFO) confirmed as of Aug 2026; monitor eXCHANGE",
    "match": 3,
    "notes": "Frame HCSP as decarbonizing wastewater treatment with onsite power at industrial hosts; cost share typically 20-50% for demos; IEDO remains an active DOE small-business research grants (SBIR) topic owner (C60-09).",
    "url": "https://www.energy.gov/eere/iedo",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-017",
    "program": "US Department of Energy's clean-energy demonstrations office (OCED) — clean energy demonstrations (incl. ERA rural/remote energy, $1B)",
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
    "notes": "24 awards ($3.7B) terminated May 2025 plus ~$7.56B more Oct 2025; the July 2025 budget law (OBBBA) rescinded unobligated balances; FY26 budget request $0; ERA no longer available (GAO-26-107997). Do not build a plan around revival.",
    "url": "https://files.gao.gov/reports/GAO-26-107997/index.html",
    "src": [
      "K106"
    ]
  },
  {
    "id": "G-018",
    "program": "DOE US small-business research grant programs (SBIR/STTR) (Office of Technology Commercialization)",
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
    "program": "Programs at ARPA-E, DOE's high-risk research agency (RECOVER successors, SCALEUP Ready, IGNIITE 2026)",
    "level": "Federal",
    "agency": "DOE ARPA-E",
    "type": "Grant",
    "award": "Typically $1M-$10M; IGNIITE up to $500K (+$250K Director's Award); cost share 5-20%",
    "access": "Yes",
    "fit": "Power; Water",
    "vertical": "Energy/resource recovery from wastewater; produced water",
    "status": "ACTIVE",
    "deadline": "Rolling grant application notices (NOFOs) on eXCHANGE; IGNIITE full applications closed Aug 26 2026",
    "match": 3,
    "notes": "RECOVER ($36M awarded; full apps closed Aug 2025) targeted ammonia/critical-metals recovery from municipal/feedlot/produced/mining waters - watch for successor grant application notices (NOFOs); SCALEUP Ready (DE-FOA-0003467, rolling) only after an ARPA-E award.",
    "url": "https://arpa-e-foa.energy.gov/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-020",
    "program": "DOE Title 17 energy loans (Office of Energy Dominance Financing)",
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
    "notes": "Realistic only at >=$50-100M purchase cost given diligence costs; GHG-reduction requirement removed by the July 2025 budget law (OBBBA); waste-to-power adding firm capacity can fit 'output increase / grid reliability' categories; SEFI co-support lowers thresholds; borrower-paid subsidy possible but expensive.",
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
    "deadline": "No FY26 grant grant application notice (NOFO); rule rewrite (7 CFR 4280 Subpart B) under EO 14315; Oct 2024 notice to be rescinded - applicants must reapply",
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
    "notes": "OPEN now; biodigester/indoor-farming carve-out paused through Dec 31 2026, but SCWO is not an anaerobic biodigester under USDA's own definition - get written confirmation from the state energy coordinator early.",
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
    "notes": "Tax credits, not grants. SCWO eligibility uncertain: WERP (waste-heat-to-power at host industrial sites) is the most defensible route; combustion/gasification alternative-fate methane case untested - engage tax counsel before marketing credit monetization; 45Z only if a transportation-fuel co-product; 48C capped at $10B by the July 2025 budget law (OBBBA), no Round 3 expected.",
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
    "award": "FY26 enacted $66M formula (Congress restored vs. $0 request); residual $500M the 2021 infrastructure law (BIL) infusion in state pipelines",
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
    "program": "the defense environmental research program (SERDP) Core open research call (BAA) (Strategic Environmental Research and Development Program)",
    "level": "Federal",
    "agency": "OUSD(R&E) / the defense environmental research programs (SERDP/ESTCP) program office",
    "type": "Grant",
    "award": "~$1M-$3M over 3-4 yrs (core); SEED exploratory <=$250K/1 yr",
    "access": "Yes",
    "fit": "PFAS destruction; Water; Power",
    "vertical": "PFAS/firefighting foam (AFFF) destruction; installation energy & water",
    "status": "WATCH",
    "deadline": "FY28 solicitation expected ~Oct-Nov 2026 (FY27 pre-proposals closed Jan 13 2026)",
    "match": 4,
    "notes": "All sectors eligible via annual open research call (BAA); direct SCWO precedents (ER20-5350, ER22-3384, ER22-7338); FY27 topic notices had no PFAS destruction topic - target FY28 Environmental Restoration SON; FY27 budget $60.8M.",
    "url": "https://www.serdp-estcp.org/work-with-us",
    "src": [
      "K118"
    ]
  },
  {
    "id": "G-028",
    "program": "the defense environmental research program (ESTCP) demonstration/validation (Installation Energy & Water; Environmental Restoration)",
    "level": "Federal",
    "agency": "ODASD (Energy Resilience & Optimization)",
    "type": "Grant",
    "award": "~$0.5M-$3M+ per demonstration (~3 yrs)",
    "access": "Yes",
    "fit": "PFAS destruction; Water; Power",
    "vertical": "the Defense Department (DoD) installation water resilience; firefighting foam (AFFF)/PFAS demos; energy resilience",
    "status": "ACTIVE",
    "deadline": "FY28 solicitations expected ~Dec 2026-Jan 2027, pre-proposals ~Mar 2027 (FY27 in selection Sept 2026)",
    "match": 5,
    "notes": "Best overall near-term defense target: TRL 5–7 (mid-stage proof) demos at Defense Department sites - exactly HCSP's maturation stage; SCWO precedent ER23-7939 (foam fractionation + SCWO); FY27 topics included Water Resilience and Energy Resilience; FY27 budget $125.1M; Oct 2026 firefighting foam (AFFF) transition deadline drives FY28 demand.",
    "url": "https://www.serdp-estcp.org/Funding-Opportunities/ESTCP-Solicitations",
    "src": [
      "K119"
    ]
  },
  {
    "id": "G-029",
    "program": "the Defense Innovation Unit (DIU) Commercial Solutions Opening (prototype Other Transaction)",
    "level": "Federal",
    "agency": "Defense Innovation Unit",
    "type": "Grant",
    "award": "~$500K-$5M negotiated prototypes; follow-on production sole-source (4022(f))",
    "access": "Yes",
    "fit": "Power; Water; Cooling",
    "vertical": "Distributed energy resilience; logistics-burden water production",
    "status": "WATCH",
    "deadline": "Rolling Areas of Interest; none open mid-2026 - register on the Defense Innovation Unit (DIU) portal and monitor weekly",
    "match": 3,
    "notes": "Fastest defense path (award ~60-120 days) but requires a mature commercial solution; energy precedents HyTEC, PRISM, ANPI, Finance First; 10 USC 4022 OT authority; no small-business status required.",
    "url": "https://www.diu.mil/work-with-us",
    "src": [
      "K121"
    ]
  },
  {
    "id": "G-030",
    "program": "the Defense Department US small-business research grant programs (SBIR/STTR) FY27 releases (all components via the DoD submission portal, DSIP; incl. Army Applied SBIR)",
    "level": "Federal",
    "agency": "the Defense Department (defensesolutions.gov) / Army Futures Command",
    "type": "Grant",
    "award": "Phase I ~$250K (Navy up to $315K); Phase II $1.7M-$2.0M; Phase III uncapped (non-small-business research grants (SBIR) funds)",
    "access": "Yes",
    "fit": "PFAS destruction; Water; Power",
    "vertical": "Expeditionary water; PFAS; contested logistics; microgrids",
    "status": "ACTIVE",
    "deadline": "FY27 Release 1 pre-release expected ~Oct 2026; quarterly closes (FY26 R4 closed Aug 19 2026); Army runs 3 windows/FY",
    "match": 4,
    "notes": "Reauthorized Apr 13 2026; monthly pre-release / quarterly close cadence; watch the Navy facilities command (NAVFAC)/Army water & PFAS topics; Army Contested Logistics & Advanced Energy Generation interest areas fit expeditionary water/waste-to-energy; per-firm submission caps and foreign-risk screening apply.",
    "url": "https://www.defensesolutions.gov/",
    "src": [
      "K120"
    ]
  },
  {
    "id": "G-031",
    "program": "Navy small-business research grants (SBIR) topic lineage N254-123 (expeditionary greywater reuse) / N233-117 (PFAS defluorination)",
    "level": "Federal",
    "agency": "NAVFAC EXWC",
    "type": "Grant",
    "award": "Phase I <=$315K; Phase II ~$1.7M; Phase III follow-on buyers named (Air Force civil engineers / US Army Corps of Engineers)",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Expeditionary greywater; firefighting foam (AFFF) concentrate; sewage sludge (biosolids); GAC/IX residuals",
    "status": "WATCH",
    "deadline": "N254-123 closed Sep 24 2025 - Phase II / Direct-to-Phase-II pathway now; watch FY27 the Navy facilities command (NAVFAC) topics",
    "match": 3,
    "notes": "Direct-fit precedents: autonomous treatment to TB MED 577 reuse standards (N254-123); firefighting foam (AFFF) concentrate destruction confirmed eligible (N233-117); pursue D2P2 eligibility, Open Topics, or Phase III teaming with current awardees.",
    "url": "https://www.navysbir.com/n25_411/N254-123.htm",
    "src": [
      "K120"
    ]
  },
  {
    "id": "G-032",
    "program": "the Air Force innovation arm (AFWERX)/SpaceWERX Open Topic small-business research grants (SBIR) (TACFI/STRATFI follow-ons)",
    "level": "Federal",
    "agency": "USAF AFWERX",
    "type": "Grant",
    "award": "Phase I $75K (small-business research grants (SBIR))/$110K (small-business tech-transfer grants (STTR)); Phase II up to $2M; Direct-to-Phase-II $1.25M; TACFI $375K-$2M; STRATFI $3M-$15M",
    "access": "Yes",
    "fit": "PFAS destruction; Water; Power",
    "vertical": "Contested logistics; the Air Force civil engineers (AFCEC) firefighting foam (AFFF) cleanout wastewater (hangar rinse-out, F3 transition)",
    "status": "ACTIVE",
    "deadline": "Rolling Open Topic submissions",
    "match": 4,
    "notes": "Requires a Customer Memorandum - cultivate the Air Force civil engineers (AFCEC) as end user; Open Topic rolling post-reauthorization; Agile Combat & Readiness / Contested Logistics is a named area of interest.",
    "url": "https://www.afwerx.com/",
    "src": [
      "K122"
    ]
  },
  {
    "id": "G-033",
    "program": "Watch: Homeland Security's research arm (DHS S&T) small-business research grants & DARPA (the defense research agency) open calls",
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
    "award": "Up to $150M per award; 75/25 cost share; $1B combined FY24-25 grant application notice (NOFO)",
    "access": "No—via utility partner",
    "fit": "Water; Power",
    "vertical": "Water-resilience and PFAS-mitigation infrastructure",
    "status": "WATCH",
    "deadline": "FY24-25 grant application notice (NOFO) closed Jul 23 2026; FY25/26 grant application notices (NOFOs) expected",
    "match": 2,
    "notes": "Court-ordered restart after Apr 2025 cancellation (Dec 11 2025 permanent injunction; Mar 6 2026 enforcement order); states/tribes/locals only - company as vendor/subrecipient partner; administration intent to replace the program remains a risk; HMGP active post-disaster.",
    "url": "https://www.fema.gov/grants/mitigation/building-resilient-infrastructure-communities",
    "src": [
      "K107"
    ]
  },
  {
    "id": "G-035",
    "program": "US Army Corps of Engineers research-lab (ERDC) partnerships (cooperative R&D agreements; open call for unsolicited proposals)",
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
    "notes": "Partnership route (not a grant): Sept 2025 CRADAs with Genesis Systems and AirJoule on tactical-generator waste-heat water generation - CERL's operational-water team explicitly seeks logistics-burden reduction; on-ramp to the defense environmental research program (ESTCP) demos; N233-117 Phase III names the Army Corps of Engineers as transition partner.",
    "url": "https://www.erdc.usace.army.mil/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-036",
    "program": "the Office of Naval Research (ONR) Long-Range open research call (BAA) N0001425SB001 (Navy & Marine Corps research)",
    "level": "Federal",
    "agency": "Office of Naval Research",
    "type": "Grant",
    "award": "~$300K-$1M+/yr per effort, negotiated",
    "access": "Yes",
    "fit": "Water; Power",
    "vertical": "Shipboard/expeditionary water treatment; waste-to-energy S&T",
    "status": "CLOSED",
    "deadline": "CLOSED — full proposals were accepted through September 30 2026",
    "match": 5,
    "notes": "CLOSED Sep 30 2026 - for-profits were eligible; the waste-heat SCWO water-production white-paper angle (sea platforms & environmental quality codes) carries over to the successor Long-Range open research call (BAA) — the Office of Naval Research (ONR) reissues it roughly every 1-2 years; verify the current BAA before applying.",
    "url": "https://www.grants.gov/search-results-detail/356605",
    "src": [
      "K117"
    ]
  },
  {
    "id": "G-037",
    "program": "NDCEE demonstration contracts + installation firefighting foam (AFFF) stockpile destruction",
    "level": "Federal",
    "agency": "National Defense Center for Energy & Environment / the Defense Department (DoD) installations",
    "type": "Sub-grant via partner",
    "award": "Contract vehicles; per-base awards (e.g. Wright-Patterson removal ~$370K)",
    "access": "Yes",
    "fit": "PFAS destruction",
    "vertical": "firefighting foam (AFFF) stockpiles (~1,000 facilities); investigation-derived waste",
    "status": "ACTIVE",
    "deadline": "firefighting foam (AFFF) phase-out deadline Oct 1 2026 drives near-term contracts; incineration pause lifted 2026",
    "match": 4,
    "notes": "374Water AirSCWO Navy demo precedent via NDCEE (2023); the Defense Department (DoD) 2024-25 demo series (10 vendors incl. Revive SCWO Annihilator, 374Water/Arcadis) concluded on-site destruction wins on cost/logistics; bid as sub to prime environmental contractors; leverage the Corps' research lab (ERDC)-verified 99.9993% share of the chemical destroyed (DRE) evidence.",
    "url": "https://www.remediation-technology.com/articles/90-navy-selects-374water-for-joint-ndcee-pfas-project",
    "src": [
      "K133"
    ]
  },
  {
    "id": "G-038",
    "program": "CA SWRCB DFA: clean-water state loan fund (CWSRF) / Water Recycling Funding Program / PFAS-emerging contaminants funding",
    "level": "State",
    "agency": "CA State Water Resources Control Board",
    "type": "Sub-grant via partner",
    "award": "No state water-infrastructure loan fund (SRF) maximum; ~$12.5M Prop 1 recycling grants proposed FY26-27; $20M stormwater principal-forgiveness cap",
    "access": "No—via utility partner",
    "fit": "Water; PFAS destruction; Power",
    "vertical": "Sewage sludge (biosolids)/PFAS destruction at sewage treatment plants; recycled water",
    "status": "ACTIVE",
    "deadline": "Rolling/annual state funding priority list (IUP); applications via FAAST portal",
    "match": 4,
    "notes": "Vendor route = partner with a sewage treatment plant applicant; WRFP fits the distilled-water output; emerging-contaminants state funding priority list (IUP) supplements fit PFAS destruction.",
    "url": "https://www.waterboards.ca.gov/water_issues/programs/grants_loans/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-039",
    "program": "California Energy Commission EPIC cost-share for federal clean-energy funding calls",
    "level": "State",
    "agency": "California Energy Commission",
    "type": "Grant",
    "award": "Varies; matches DOE awards; agreements up to 48 months",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Clean-energy demonstration at CA host sites",
    "status": "ACTIVE",
    "deadline": "Rolling two-phase process tied to federal funding-call timelines; addenda posted through 2026",
    "match": 3,
    "notes": "Open to public AND private entities (except publicly owned utilities); projects in CA, demos in PG&E/SCE/SDG&E territory; best paired with a DOE FOA application.",
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
    "vertical": "Food/green waste co-processing (NOT sewage sludge (biosolids))",
    "status": "WATCH",
    "deadline": "Intermittent rounds dependent on Cap-and-Invest/GGRF allocations",
    "match": 1,
    "notes": "CRITICAL CAVEAT: sewage sludge (biosolids) are explicitly NOT an eligible feedstock - projects composting/digesting only sewage sludge are ineligible; pursue only if framed around landfill-diverted food/green waste co-processing. Low fit for core HCSP.",
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
    "program": "Texas water board's SWIFT fund + Texas clean-water state loan fund (CWSRF)",
    "level": "State",
    "agency": "Texas Water Development Board",
    "type": "Loan",
    "award": "Multi-$M low-interest loans; >=20% of SWIFT historically reserved for conservation/reuse",
    "access": "No—via utility partner",
    "fit": "Water",
    "vertical": "Reuse/new-supply strategies; municipal wastewater",
    "status": "ACTIVE",
    "deadline": "SWIFT 2026 abridged apps closed Feb 2 2026 (next cycle early 2027); clean-water state loan fund (CWSRF) SFY27 PIFs closed Mar 6 2026 (next SFY28)",
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
    "program": "Arizona's water finance authority (WIFA) Long-Term Water Augmentation Fund - In-State Water Augmentation cycle",
    "level": "State",
    "agency": "Arizona Water Infrastructure Finance Authority",
    "type": "Sub-grant via partner",
    "award": "Fund balance ~$376M (post FY26 clawback); awards >$50M require Joint Legislative Water Committee review",
    "access": "Yes",
    "fit": "Water",
    "vertical": "Wastewater reclamation to potable/distilled; fab/data-center buyers of the output",
    "status": "ACTIVE",
    "deadline": "In-State Water Augmentation funding cycle OPEN since Nov 17 2025",
    "match": 5,
    "notes": "Excellent fit: private project developers can propose within project teams - Arizona's water finance authority (WIFA) selected seven Phase-1 proposals from companies (incl. desal and wastewater-to-drinking-water) and funds Phase-2 feasibility (18-24 months, underway 2026).",
    "url": "https://wifa.az.gov/",
    "src": [
      "K125"
    ]
  },
  {
    "id": "G-047",
    "program": "Arizona's water finance authority (WIFA) Water Conservation Grant Fund (winding down) & the water-supply development fund (WSDRF) / state loan funds (SRFs)",
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
    "program": "FL clean-water state loan fund (CWSRF) + the 2021 infrastructure law (BIL) emerging-contaminants grants (Orlando/374Water template)",
    "level": "State",
    "agency": "Florida DEP",
    "type": "Sub-grant via partner",
    "award": "~$800K demo precedent; full-scale follow-ons $3M-$5M",
    "access": "No—via utility partner",
    "fit": "PFAS destruction; Water",
    "vertical": "Sewage sludge (biosolids)/PFAS destruction at water reclamation facilities",
    "status": "ACTIVE",
    "deadline": "Rolling/annual via FL DEP",
    "match": 5,
    "notes": "THE template transaction: Orlando's Florida clean-water state loan fund (CWSRF) / 2021 infrastructure law (BIL) grant (Feb 2024, ~$800K+) funded the AirSCWO demo at Iron Bridge -> 5-year waste-destruction license (Mar 2026) -> $3M-$5M full-scale PFAS destruction & manufacturing hub (Jun 2026). Replicate with FL utilities.",
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
    "vertical": "Nutrient/HAB destruction pilots; sewage sludge (biosolids)/PFAS angle post-Orlando",
    "status": "ACTIVE",
    "deadline": "FY 2026-27 portal openings rolling (several close ~Sep 1)",
    "match": 3,
    "notes": "Nonstate entities can participate; utilities typically lead; FL HB 1019 (signed Jun 17 2026) creating firefighting foam (AFFF) inventory adds a PFAS-destruction demand signal.",
    "url": "https://floridadep.gov/comm/comm/content/dep-funding-opportunities",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-050",
    "program": "New York's energy agency (NYSERDA) Waste-to-Low-Carbon-Fuels Pilot & Demonstration (+ July 2026 $8M alternative-fuels round)",
    "level": "State",
    "agency": "NYSERDA",
    "type": "Grant",
    "award": "~$8M solicitations; >=50% non-New York's energy agency (NYSERDA) cost share; 3-phase pilot->demo structure",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Wastewater sludge to fuels (SAF, RNG, renewable diesel, methanol, e-fuels)",
    "status": "ACTIVE",
    "deadline": "2025 solicitation (Aug 2025) + $8M round announced Jul 21 2026 under PSC Innovation & Research Order",
    "match": 4,
    "notes": "Best direct-access NY program: private technology providers eligible as project leads (with a construction partner + host-site/feedstock/end-user letters); wastewater sludge explicitly eligible feedstock; biogas/hydrogen excluded as end fuels - align product carefully; $24M grid modernization solicitation (Jun 2026) is the alternative track for power/cooling.",
    "url": "https://www.nyserda.ny.gov/",
    "src": [
      "K123"
    ]
  },
  {
    "id": "G-051",
    "program": "New York Environmental Facilities Corporation programs (water-infrastructure grants WIIA/IMG, EPG, clean-water state loan fund (CWSRF) incl. infrastructure-law emerging-contaminants landfill-leachate (the liquid that drains out of landfills) awards)",
    "level": "State",
    "agency": "NY Environmental Facilities Corporation",
    "type": "Sub-grant via partner",
    "award": "WIIA ~$200M expected over next 3 SFYs ($453M awarded Dec 19 2025); EPG $50K/$100K; 0% hardship clean-water state loan fund (CWSRF) loans",
    "access": "No—via utility partner",
    "fit": "PFAS destruction; Water",
    "vertical": "Landfill leachate (the liquid that drains out of landfills) pretreatment; regional sewage sludge (biosolids) hubs",
    "status": "ACTIVE",
    "deadline": "Annual rounds (WIIA historically closes ~September; EPG/GIGP closed Jun 12 2026)",
    "match": 4,
    "notes": "Proven leachate (the liquid that drains out of landfills) precedents under clean-water state loan fund (CWSRF)-EC: Steuben County $25.3M, Malone $14.5M, Hurley $1.3M, DANC $1.4M; IMG favors multi-municipal shared projects - fits the regional SCWO hub model; municipalities only.",
    "url": "https://efc.ny.gov/wiia",
    "src": [
      "K127"
    ]
  },
  {
    "id": "G-052",
    "program": "New Jersey's environmental agency (NJDEP) EPA's disadvantaged-communities grant program (EC-SDC) Emerging Contaminants grant ($33.6M for NJ)",
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
    "notes": "Vendor via public water system partner; part of the final $1B national EPA's disadvantaged-communities grant program (EC-SDC) year - engage NJ systems while funds allot.",
    "url": "https://dep.nj.gov/grantandloanprograms/ecsdc/",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-053",
    "program": "NJ PFAS Abatement Fund ($795M) via NJ Water Bank",
    "level": "State",
    "agency": "New Jersey's environmental agency (NJDEP) / NJ Water Bank",
    "type": "Settlement fund",
    "award": "$795M fund; >=$150M to Water Bank for sewage treatment plants; >=$90M to counties for firefighting foam (AFFF) sites; SFY26 state funding priority lists (IUPs) ~$900M clean-water + ~$790M drinking-water baseline",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "sewage treatment plant PFAS capital upgrades; firefighting foam (AFFF) sites (fire academies, airports)",
    "status": "ACTIVE",
    "deadline": "Program design rolling out post court approval (Aug 7 2026) - engage now",
    "match": 5,
    "notes": "Time-sensitive: ~$2.5B DuPont/3M settlements approved Aug 7 2026; no/low-interest loans + principal forgiveness for sewage treatment plant PFAS capital upgrades; firefighting foam (AFFF)-destruction services fit the Orlando hub model; shape project pipelines while the program forms.",
    "url": "https://dep.nj.gov/3m/",
    "src": [
      "K112"
    ]
  },
  {
    "id": "G-054",
    "program": "Pennsylvania's water fund (PENNVEST) (incl. Growing Greener / Act 13 WRPP as secondary channels)",
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
    "vertical": "Sewage sludge (biosolids)/sludge PFAS destruction at sewage treatment plants",
    "status": "WATCH",
    "deadline": "Bond vote expected by May 2026 - OUTCOME UNCONFIRMED, verify before relying",
    "match": 4,
    "notes": "A Maine environmental-agency / water-association study explicitly recommends funding PFAS destruction pilot studies; York Sewer District pursuing a 2028 modular SCWO pilot; Anson Madison regional PFAS center seeking funds; IIJA EC clean-water state loan fund (CWSRF) overlay available to ME sewage treatment plants.",
    "url": "https://www.maine.gov/dep/spills/topics/pfas/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-056",
    "program": "CT/MA sewage sludge (biosolids)-ban-driven PFAS programs (CT EPA's disadvantaged-communities grant program (EC-SDC) $9.46M; MA MassDEP PFAS grants; MA Trust Fund pending)",
    "level": "State",
    "agency": "CT DEEP / MassDEP",
    "type": "Sub-grant via partner",
    "award": "CT $9.457M EPA's disadvantaged-communities grant program (EC-SDC) (May 2026); MA Ipswich River round ~$900K across five communities",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Sewage sludge (biosolids) (CT ban drives destruction demand); drinking-water PFAS pilots",
    "status": "ACTIVE",
    "deadline": "Rolling (CT); periodic (MA); MA 2026 state funding priority lists (IUPs) discontinued 0% PFAS loans - shift to loan forgiveness",
    "match": 3,
    "notes": "CT banned PFAS-containing sewage sludge (biosolids) from use/sale (Oct 2024) and extended to fertilizers with PFAS-free certification (Jul 2025) - a direct destruction-demand driver; MA PFAS Remediation Trust Fund bill pending (not enacted as of Sept 2026); route via municipal WPCFs.",
    "url": "https://www.epa.gov/newsreleases/epa-announces-95-million-connecticut-address-pfas-drinking-water",
    "src": [
      "K109"
    ]
  },
  {
    "id": "G-057",
    "program": "Islands: HI (USDA rural decentralized-water grants; the NELHA energy-lab testbed) & USVI/PR (state loan-fund infrastructure-law money ~$21M, SmaRT, the federal WIFIA water-loan program territories)",
    "level": "State",
    "agency": "USDA RD / NELHA / EPA-territories",
    "type": "Sub-grant via partner",
    "award": "USVI ~$21M infrastructure-law money (majority as grants/forgivable loans); SmaRT FY26 USVI $176K / PR $524K; the federal WIFIA water-loan program >=$5M ($1M small communities)",
    "access": "No—via utility partner",
    "fit": "Water; Power",
    "vertical": "Island water+power microgrids; decentralized water systems",
    "status": "ACTIVE",
    "deadline": "USDA decentralized water applications open Jul 28 - Sep 30 2026; state water-infrastructure loan fund (SRF) rolling",
    "match": 3,
    "notes": "Island deployments (power + distilled water from wastewater) fit the federal WIFIA water-loan program + state water-infrastructure loan fund (SRF) via territorial utilities (VIWAPA/WMA); NELHA is a proven federal-award demonstration venue (Trevi $2M DOE SETO); USDA window LIVE NOW via nonprofits.",
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
    "vertical": "Sewage sludge (biosolids)/PFAS solutions at a 190-M gal/day utility",
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
    "program": "MWD of Southern California innovation programs (bewaterwise.com)",
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
    "url": "https://bewaterwise.com/innovative-conservation-program",
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
    "notes": "Businesses of any size eligible; funded by Fund for Lake Michigan, MMSD, Wells Fargo; MMSD pilot->demo->buying pathway proven (Tomorrow Water Proteus advanced to 2.25-M gal/day commercial demo, Mar 2026).",
    "url": "https://www.mmsd.com/about-us/news/funding-available-for-pilot-program",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-061",
    "program": "Minnesota's legislative environment commission (LCCMR) / Environment & Natural Resources Trust Fund (state SCWO funding precedent)",
    "level": "State",
    "agency": "State of Minnesota Minnesota's legislative environment commission (LCCMR)",
    "type": "Grant",
    "award": "Project-scale awards",
    "access": "Yes",
    "fit": "PFAS destruction",
    "vertical": "Sewage sludge (biosolids) PFAS destruction",
    "status": "ACTIVE",
    "deadline": "374Water award announced Dec 30 2025; project starts Apr 2026; watch next Minnesota's environment trust fund (ENRTF) cycles",
    "match": 3,
    "notes": "Proof that state trust/legacy funds directly sponsor SCWO sewage sludge (biosolids) destruction (374Water + Barr Engineering + U. St. Thomas + MnTAP + City of St. Cloud); analogous trust/legacy vehicles exist in other states.",
    "url": "https://www.globenewswire.com/news-release/2025/12/30/3211393/0/en/374water-awarded-waste-destruction-services-funding-from-the-state-of-minnesota-for-pfas-destruction-in-biosolids.html",
    "src": [
      "K143"
    ]
  },
  {
    "id": "G-062",
    "program": "3M Public Water System settlement (firefighting foam (AFFF) MDL 2873)",
    "level": "Private-foundation",
    "agency": "Settlement Claims Administrator (pfaswatersettlement.com)",
    "type": "Settlement fund",
    "award": "$10.5B-$12.5B over 13 yrs; >$3.5B paid to Phase 1 claimants",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Drinking-water treatment residuals (carbon-, resin-, and reverse-osmosis concentrates; firefighting foam)",
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
    "program": "DuPont/Chemours/Corteva ($1.185B) + Tyco ($750M) + BASF ($316.5M) public-water-system settlements",
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
    "award": "Community/municipal PFAS grants (~20% match); Airport & Industrial Possessor grants; landfill leachate (the liquid that drains out of landfills)/sewage sludge (biosolids) treatment grants; well compensation",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Landfill leachate (the liquid that drains out of landfills); sewage sludge (biosolids) disposal; on-site treatment systems",
    "status": "ACTIVE",
    "deadline": "Launching summer 2026 - winter 2026 (sampling grants first)",
    "match": 5,
    "notes": "Most direct state-level door for a leachate (the liquid that drains out of landfills) vendor: grants to municipalities AND privately owned landfills to dispose of PFAS-containing sewage sludge (biosolids)/leachate OR purchase and install on-site treatment systems (up to 20% match); DNR also directed to study destruction/disposal methods.",
    "url": "https://content.govdelivery.com/accounts/WIDNR/bulletins/411b1f6",
    "src": [
      "K113"
    ]
  },
  {
    "id": "G-065",
    "program": "North Carolina environmental agency (DEQ) emerging-contaminants/PFAS funding (+ MI EPA's disadvantaged-communities grant program (EC-SDC)/Michigan's environmental agency (EGLE) as parallel channel)",
    "level": "State",
    "agency": "NC DEQ (parallel: EGLE/MI)",
    "type": "Sub-grant via partner",
    "award": "NC: $55M state budget + ~$35M Cape Fear (Mar 2026) + the 2021 infrastructure law (BIL) state water-infrastructure loan fund (SRF)-EC at 100% principal forgiveness; MI: $22.07M EPA's disadvantaged-communities grant program (EC-SDC) + ~$20M/yr EGLE CCRR",
    "access": "No—via utility partner",
    "fit": "PFAS destruction",
    "vertical": "Drinking water, wastewater AND landfill leachate (the liquid that drains out of landfills) construction",
    "status": "ACTIVE",
    "deadline": "NC rolling deadlines through Nov 2 2026; MI rolling via state",
    "match": 4,
    "notes": "NC: construction & planning grants for PFAS incl. leachate (the liquid that drains out of landfills); publicly owned landfills eligible for clean-water state loan fund (CWSRF)-EC; pending bills (HB 569 polluter liability; SB 666 $56M utility reimbursement fund) could add more. MI caveat: state drinking-water limits (MCLs) in litigation limbo (Supreme Court vacated/remanded Mar 2025).",
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
    "vertical": "Landfill leachate (the liquid that drains out of landfills) treatment/destruction",
    "status": "ACTIVE",
    "deadline": "Rolling pre-proposals",
    "match": 3,
    "notes": "Small dollars but unmatched industry visibility: Emerging Contaminants (leachate (the liquid that drains out of landfills) disposal/treatment) is a stated research priority; propose an SCWO leachate demonstration with a member landfill - direct channel to Waste Management/Republic-type operators ahead of the landfill PFAS federal wastewater limits (ELG) (proposed rule ~Mar 2027, final ~Mar 2029).",
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
    "award": "Zero-equity; ~$25K award that gives up no ownership + mentorship/network",
    "access": "Yes",
    "fit": "Water; PFAS destruction; Power; Cooling",
    "vertical": "PFAS destruction; sewage sludge (biosolids); industrial reuse; data-center water",
    "status": "ACTIVE",
    "deadline": "2027 cohort applications open November 2026, close December 2026; program Apr-Nov 2027",
    "match": 5,
    "notes": "The best-aligned water-sector accelerator; 2026 cohort explicitly featured PFAS detection/destruction and sludge-destruction startups (AxNano, Beyond the Dome) - HCSP's category confirmed in-scope; eligibility: incorporated <7 yrs, revenue <$5M, equity raised <$10M; Asia track relevant to distillery/island industries.",
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
    "vertical": "Paid pilots with utility/industrial early adopters (sewage sludge (biosolids), distillery, dairy)",
    "status": "ACTIVE",
    "deadline": "Rolling",
    "match": 5,
    "notes": "Recoverable grants (repayable on commercial success; still money that gives up no ownership) purpose-built to co-fund exactly the paid pilot HCSP needs; claims 10x follow-on capital mobilized; open to water startups with pilot-ready tech beyond the accelerator pipeline.",
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
    "vertical": "Utility-sponsored technology evaluation (sewage sludge (biosolids)/PFAS)",
    "status": "ACTIVE",
    "deadline": "2026 pre-proposals closed Mar 17 2026; next cycle expected ~Q1 2027; eight open research projects announced Jul 2026",
    "match": 4,
    "notes": "Projects must be sponsored by a WRF-subscribing utility; HCSP participates as technology/research partner; results published sector-wide - makes it much safer to invest in the municipal market; also Emerging Opportunities Program for urgent PFAS issues.",
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
    "notes": "Flagship 2026-27 private program for the 'clean water + cooling + power for data centers' story; philanthropy-anchored first-of-a-kind (Breakthrough Energy Discovery, Builders Vision, Salesforce, Stolte Family Foundation); investment structure case-by-case (equity/debt/hybrid) - catalytic, not pure grant; core Project Track funds first-of-a-kind deployments.",
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
    "vertical": "Capital-intensive first-of-a-kind climate hardware",
    "status": "ACTIVE",
    "deadline": "Relationship-based, rolling",
    "match": 4,
    "notes": "Charitable capital (recoverable = repayable on success; gives up little or no ownership) for hard-to-fund climate hardware - SCWO first-of-a-kind plants with an additionality story fit the thesis exactly; backers incl. MacArthur, Packard, Sierra Club Foundation; expanding Prime-Facilitated platform in 2026.",
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
    "program": "Hyperscaler water-replenishment programs (Google 120% by 2030; Amazon / Meta / Microsoft water-positive 2030)",
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
    "vertical": "Factory-farm manure/wastewater destruction + energy recovery",
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
    "program": "Market-access platforms (Isle Utilities' TAG forum; the water sector's LIFT vetting program; the Water Council's BREW 2.0 accelerator)",
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
    "notes": "No direct funding but high-value validation: TAG pitches vetted technologies (TRL 7+) to curated utility groups (e.g. Western US Wastewater TAG at OC San); LIFT evaluations make utility buying safer; PFAS-destruction hardware precedent (Aquagga is a BREW alumnus).",
    "url": "https://isleutilities.com/technology-approval-group-tag/",
    "src": [
      "K149"
    ]
  },
  {
    "id": "G-079",
    "program": "India distillery zero liquid discharge (ZLD) interest subvention (ethanol scheme)",
    "level": "Federal",
    "agency": "Government of India (access via Indian distilleries)",
    "type": "Loan",
    "award": "~6% p.a. interest subvention (or 50% of bank rate) for 5 yrs on loans incl. India's pollution board (CPCB)-approved zero liquid discharge (ZLD) methods",
    "access": "No—via other partner",
    "fit": "Water",
    "vertical": "Distillery zero-liquid-discharge (India)",
    "status": "ACTIVE",
    "deadline": "Indian government scheme; distillery must supply >=75% of ethanol output to OMCs and hold India's pollution board (CPCB) zero liquid discharge (ZLD) certificate",
    "match": 2,
    "notes": "Not accessible to a US vendor directly - the subvention lowers an Indian distillery customer's cost of capital for zero liquid discharge (ZLD), making an HCSP sale (or Indian JV with a local distillery/EPC) more financeable; a local partner is effectively mandatory; Imagine H2O Asia is the adjacent accessible route.",
    "url": "https://apps.fas.usda.gov/newgainapi/api/Report/DownloadReportByFileName?fileName=Indian%20Government%20Approves%20Interest%20Subvention%20Scheme%20for%20Ethanol%20Distilleries_New%20Delhi_India_01-03-2021",
    "src": [
      "K146"
    ]
  },
  {
    "id": "G-080",
    "program": "Breakthrough Energy (Fellows grant; Catalyst first-of-a-kind finance; BEV equity)",
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
  },

  // ── International & NGO layer (G-081–G-092): research/grants_ngo.md, verified September 2026 ──
  {
    "id": "G-081",
    "program": "ADB Technology Innovation Challenge (TIC)",
    "level": "International/NGO",
    "agency": "Asian Development Bank",
    "type": "Grant",
    "award": "Up to $450K per pilot; 10% co-financing required",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Islands/remote (Pacific); industrial wastewater in ADB developing member countries",
    "status": "ACTIVE",
    "deadline": "Challenge-based calls on specific themes; monitor challenges.adb.org",
    "match": 5,
    "notes": "The cleanest true grant for a for-profit SCWO vendor: technology providers apply directly for pilots in ADB developing member countries, including Pacific island states. Top pick for the islands industry — distilled water + destruction + power export is a strong pilot narrative.",
    "url": "https://challenges.adb.org/en/challenges/tic",
    "src": [
      "K167"
    ]
  },
  {
    "id": "G-082",
    "program": "AB InBev 100+ Accelerator (with Coca-Cola, Colgate-Palmolive, Danone, Mondelēz, Unilever)",
    "level": "Corporate",
    "agency": "AB InBev + beverage/CPG majors",
    "type": "Accelerator",
    "award": "Up to $100K per pilot + 6-month program and demo day",
    "access": "Yes",
    "fit": "Water",
    "vertical": "Distillery/brewery wastewater destruction + process-water reuse",
    "status": "ACTIVE",
    "deadline": "Annual cohort; applications historically open ~Mar-Apr",
    "match": 5,
    "notes": "Built for for-profit startups; 'Every Single Drop' water-stewardship challenge; >240 companies accelerated in 40+ countries and >50% of early-cohort startups won commercial deals. Distilled-water output is directly usable in beverage plants — pitch stillage destruction + reuse.",
    "url": "https://www.100accelerator.com",
    "src": [
      "K168"
    ]
  },
  {
    "id": "G-083",
    "program": "WaterEquity Water & Climate Resilience Fund",
    "level": "Private-foundation",
    "agency": "WaterEquity (asset manager; Microsoft anchor; Starbucks/Xylem strategic)",
    "type": "Equity-not-grant",
    "award": "$2-15M tickets, equity/mezzanine, minority stakes, 5-7-yr holds; >$100M raised of $200M target",
    "access": "Yes",
    "fit": "Water",
    "vertical": "C&I wastewater treatment/reuse project SPVs in Brazil, India, Indonesia, Kenya, Mexico, Peru, Philippines, South Africa",
    "status": "ACTIVE",
    "deadline": "Rolling application (waterequity.com/infrafunding); WaterConnect project-prep if below criteria",
    "match": 3,
    "notes": "EQUITY, NOT A GRANT - patient minority capital for infrastructure projects and growth companies; route to the capital-raise track, not the proposal team. Strong fit if an emerging-market project SPV exists. The Everspring Fund (household WASH lending) is a poor fit for SCWO hardware.",
    "url": "https://waterequity.com/infrafunding/",
    "src": [
      "K169"
    ]
  },
  {
    "id": "G-084",
    "program": "GEF Challenge Program for Adaptation Innovation",
    "level": "International/NGO",
    "agency": "Global Environment Facility (LDCF/SCCF)",
    "type": "Grant",
    "award": "~$10M per call; >$40M committed across 32 projects; ~$40M more planned through 2026",
    "access": "Yes",
    "fit": "Water; PFAS destruction",
    "vertical": "Islands/remote climate-resilient water supply in GEF-eligible countries (SIDS)",
    "status": "WATCH",
    "deadline": "Periodic calls (latest tranches announced at COP29, Nov 2024); prepare a SIDS distilled-water concept for the next call",
    "match": 4,
    "notes": "The one GEF window that invites private-sector innovators to apply directly; winners implement with one of GEF's 18 agency partners. Projects must deliver adaptation benefits in developing countries - a US-only deployment does not qualify.",
    "url": "https://www.thegef.org/what-we-do/topics/challenge-program-adaptation-innovation",
    "src": [
      "K170"
    ]
  },
  {
    "id": "G-085",
    "program": "Water-AI Nexus Center of Excellence (The Water Center at Penn)",
    "level": "University",
    "agency": "University of Pennsylvania + AWS, WEF, Leading Utilities of the World",
    "type": "Research consortium",
    "award": "Project-negotiated cost-share pilots (industry collaborators co-fund)",
    "access": "Yes",
    "fit": "Water; Power; Cooling",
    "vertical": "Data-center water footprint - cooling-blowdown destruction + distilled-water reuse + power export",
    "status": "ACTIVE",
    "deadline": "Rolling - join research consortia and co-fund pilots",
    "match": 4,
    "notes": "Launched Climate Week NYC (Sept/Oct 2025) targeting the water footprint of AI/data-center infrastructure and AI-for-water. The strongest entry into the data-center industry among money that gives up no ownership; also a utility pilot-hosting channel.",
    "url": "https://watercenter.sas.upenn.edu",
    "src": [
      "K171"
    ]
  },
  {
    "id": "G-086",
    "program": "WEF/WRF LIFT Technology Scans",
    "level": "International/NGO",
    "agency": "Water Environment Federation + The Water Research Foundation",
    "type": "Consortium (non-cash)",
    "award": "Non-cash: expert-panel vetting + matchmaking to ~300 participating utilities",
    "access": "Yes",
    "fit": "PFAS destruction; Water",
    "vertical": "Sewage sludge (biosolids)/resource recovery, PFAS destruction, industrial wastewater",
    "status": "ACTIVE",
    "deadline": "Rolling Tech Scan submissions; annual challenge cycles",
    "match": 4,
    "notes": "Free/low-cost to technology providers - the 'funding' is utility adoption risk-sharing and visibility, not cash. Pairs with WRF Tailored Collaboration (1:1 match <=$150K) where utilities cost-share pilots.",
    "url": "https://www.wef.org",
    "src": [
      "K172"
    ]
  },
  {
    "id": "G-087",
    "program": "EREF research grants (leachate (the liquid that drains out of landfills)/PFAS co-proposal)",
    "level": "Private-foundation",
    "agency": "Environmental Research & Education Foundation",
    "type": "Grant",
    "award": "Typical <=$300K over ~2 yrs (justification needed above that)",
    "access": "No—via other partner",
    "fit": "PFAS destruction",
    "vertical": "Landfill-leachate (the liquid that drains out of landfills) destruction (emerging contaminants priority)",
    "status": "ACTIVE",
    "deadline": "RFA cycles (2024 cycle deadline was Dec 1); rolling pre-proposals",
    "match": 3,
    "notes": "Research grants are conventionally awarded to academic/nonprofit PIs - a vendor participates as industry partner, site host, and in-kind/cash co-funder. Realistic play: co-propose an SCWO leachate (the liquid that drains out of landfills)/PFAS-destruction demonstration with a university PI.",
    "url": "https://erefdn.org",
    "src": [
      "K173"
    ]
  },
  {
    "id": "G-088",
    "program": "Breakthrough Energy Discovery (Explorer grants / Innovator Fellows)",
    "level": "Private-foundation",
    "agency": "Breakthrough Energy",
    "type": "Grant",
    "award": "Explorer $50-250K true grants (TRL 0–2 (the earliest, least-proven stage), university/lab-based); Innovator Fellows up to $500K as a SAFE (dilutive)",
    "access": "Yes",
    "fit": "Power",
    "vertical": "Pre-venture climate tech - sewage sludge (biosolids)/landfill-methane avoidance + fossil-displacing power export angle",
    "status": "OPEN-DEADLINE",
    "deadline": "Next concept-paper deadline Nov 2, 2026 (annual)",
    "match": 2,
    "notes": "Hard screen: technology must credibly cut/remove >=500 Mt CO2e/yr at scale - a genuine fit risk for a water/PFAS-destruction story. Explorer grants are TRL 0–2 (the earliest, least-proven stage) (lab stage; holders may keep academic posts); the Innovator Fellow SAFE is dilutive, not a grant.",
    "url": "https://www.breakthroughenergy.org",
    "src": [
      "K174"
    ]
  },
  {
    "id": "G-089",
    "program": "GCF Simplified Approval Process (SAP) via Accredited Entity",
    "level": "International/NGO",
    "agency": "Green Climate Fund - Private Sector Facility",
    "type": "Sub-grant via partner",
    "award": "Up to $25M of GCF financing per project under SAP; private-sector portfolio >$29B incl. co-finance",
    "access": "No—via other partner",
    "fit": "Water; Power",
    "vertical": "SIDS wastewater + distilled water + power export (adaptation/mitigation narrative)",
    "status": "ACTIVE",
    "deadline": "Rolling via Accredited Entities; SAP designed to be faster; watch for new RFPs (MSME pilot RFP closed)",
    "match": 4,
    "notes": "Funds flow through Accredited Entities (MDBs, UN agencies, national entities) to projects in developing countries - a US vendor cannot receive GCF funds directly but can be the named technology supplier/JV partner in an AE-submitted island wastewater/reuse proposal.",
    "url": "https://www.greenclimate.fund/access-funding",
    "src": [
      "K175"
    ]
  },
  {
    "id": "G-090",
    "program": "IDB Lab / IDB Invest (Latin America & Caribbean)",
    "level": "International/NGO",
    "agency": "Inter-American Development Bank Group",
    "type": "Grant",
    "award": "IDB Lab ~$100M/yr across ~124 operations (innovation grants/early-stage instruments); IDB Invest deals $5-100M",
    "access": "Yes",
    "fit": "Water",
    "vertical": "LAC industrial wastewater; Caribbean islands tourism water/wastewater; rum distilleries",
    "status": "ACTIVE",
    "deadline": "Rolling; pilots typically with local partners",
    "match": 3,
    "notes": "IDB Lab funds innovation pilots with entrepreneurs (often via local partners); IDB Invest finances LAC-based private projects directly. Blue-bond proceeds target sustainable water management across LAC - the Caribbean distillery and islands industries fit.",
    "url": "https://bidlab.org/en",
    "src": [
      "K176"
    ]
  },
  {
    "id": "G-091",
    "program": "Caribbean Development Bank (supplier route)",
    "level": "International/NGO",
    "agency": "Caribbean Development Bank",
    "type": "Sub-grant via partner",
    "award": "Sovereign loans/grants to borrowing member countries; debt-for-climate-resilience swaps (with EIB/IDB guarantees) freeing fiscal space for water security",
    "access": "No—via other partner",
    "fit": "Water; Power",
    "vertical": "Caribbean islands - water scarcity + tourism + distillery wastewater",
    "status": "WATCH",
    "deadline": "No direct company window identified; access is as supplier/EPC partner on CDB-financed water and wastewater projects",
    "match": 3,
    "notes": "Buying process route: HCSP is the supplier/EPC partner to a government borrower on CDB-financed island water projects - high strategic relevance to the islands industry, zero proposal-writing leverage.",
    "url": "https://www.caribank.org",
    "src": [
      "K177"
    ]
  },
  {
    "id": "G-092",
    "program": "Rotary Foundation Global Grants (water & sanitation)",
    "level": "International/NGO",
    "agency": "The Rotary Foundation (host + international club sponsors)",
    "type": "Grant",
    "award": "Minimum project budget $30K; World Fund match $15-200K (DDF matched 100%, cash 50%)",
    "access": "No—via other partner",
    "fit": "Water",
    "vertical": "Islands/remote small-community safe water (demo scale)",
    "status": "ACTIVE",
    "deadline": "Rolling year-round; club-hosted application required",
    "match": 2,
    "notes": "For-profits cannot be grantees but routinely serve as equipment suppliers/technical partners to club-hosted projects. Viable only at small/demo scale - good for visibility and field reference sites, not core funding.",
    "url": "https://my.rotary.org/en/take-action/apply-grants",
    "src": [
      "K178"
    ]
  }
],

  grants_top15: [
  {
    "rank": 1,
    "id": "G-009",
    "program": "Desalination & Water Purification Research (Reclamation's water-treatment research program (DWPR)) grant application notice (NOFO)",
    "type": "Grant",
    "award": "Lab-scale up to $300K federal; pilot-scale up to $800K federal; $5.7M total FY26",
    "status": "CLOSED",
    "deadline": "CLOSED — was due 4:00 p.m. MT September 29 2026 (posted Jul 29 2026)",
    "match": 5,
    "why": "CLOSED Sep 29 2026. The best-matched direct-apply federal grant - for-profits eligible, produced water and municipal wastewater named source waters, pilot-scale up to $800K. Annual cycle: pre-position the produced-water/PFAS-concentrate pilot proposal for the FY2027 grant application notice (NOFO).",
    "access": "Yes",
    "src": [
      "K116"
    ]
  },
  {
    "rank": 2,
    "id": "G-036",
    "program": "the Office of Naval Research (ONR) Long-Range open research call (BAA) N0001425SB001 (Navy & Marine Corps research)",
    "type": "Grant",
    "award": "~$300K-$1M+/yr per effort, negotiated",
    "status": "CLOSED",
    "deadline": "CLOSED — full proposals were accepted through September 30 2026",
    "match": 5,
    "why": "CLOSED Sep 30 2026. The open research call N0001425SB001 has ended; the waste-heat SCWO water-production white paper remains valid positioning for the successor the Office of Naval Research (ONR) Long-Range BAA — verify the current BAA number before submitting.",
    "access": "Yes",
    "src": [
      "K117"
    ]
  },
  {
    "rank": 3,
    "id": "G-028",
    "program": "the defense environmental research program (ESTCP) demonstration/validation (Installation Energy & Water; Environmental Restoration)",
    "type": "Grant",
    "award": "~$0.5M-$3M+ per demonstration (~3 yrs)",
    "status": "ACTIVE",
    "deadline": "FY28 solicitations expected ~Dec 2026-Jan 2027, pre-proposals ~Mar 2027 (FY27 in selection Sept 2026)",
    "match": 5,
    "why": "the defense environmental research program (ESTCP) FY28 solicitation expected ~Dec 2026-Mar 2027; FY27 topics already named Water Resilience and Energy Resilience - direct HCSP fits; SCWO precedent ER23-7939; line up a Defense Department installation demo host now.",
    "access": "Yes",
    "src": [
      "K119"
    ]
  },
  {
    "rank": 4,
    "id": "G-027",
    "program": "the defense environmental research program (SERDP) Core open research call (BAA) (Strategic Environmental Research and Development Program)",
    "type": "Grant",
    "award": "~$1M-$3M over 3-4 yrs (core); SEED exploratory <=$250K/1 yr",
    "status": "WATCH",
    "deadline": "FY28 solicitation expected ~Oct-Nov 2026 (FY27 pre-proposals closed Jan 13 2026)",
    "match": 4,
    "why": "the defense environmental research program (SERDP) FY28 Core open research call (BAA) expected ~Oct-Nov 2026; direct SCWO PFAS-destruction precedents (ER20-5350, ER22-7338); pre-position for a FY28 Environmental Restoration SON.",
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
    "award": "$795M fund; >=$150M to Water Bank for sewage treatment plants; >=$90M to counties for firefighting foam (AFFF) sites; SFY26 state funding priority lists (IUPs) ~$900M clean-water + ~$790M drinking-water baseline",
    "status": "ACTIVE",
    "deadline": "Program design rolling out post court approval (Aug 7 2026) - engage now",
    "match": 5,
    "why": "NJ $795M PFAS Abatement Fund approved Aug 7 2026 - program design forming NOW; >=$150M routed to sewage treatment plants via the Water Bank; engage New Jersey's environmental agency (NJDEP)/Water Bank while project pipelines form.",
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
    "award": "Community/municipal PFAS grants (~20% match); Airport & Industrial Possessor grants; landfill leachate (the liquid that drains out of landfills)/sewage sludge (biosolids) treatment grants; well compensation",
    "status": "ACTIVE",
    "deadline": "Launching summer 2026 - winter 2026 (sampling grants first)",
    "match": 5,
    "why": "WI Acts 200/201 (>$130M, signed Jun 2026) include grants to municipalities AND privately owned landfills for on-site leachate (the liquid that drains out of landfills)/sewage sludge (biosolids) treatment - launching summer-fall 2026; most direct state door for a leachate vendor.",
    "access": "No—via utility partner",
    "src": [
      "K113"
    ]
  },
  {
    "rank": 7,
    "id": "G-050",
    "program": "New York's energy agency (NYSERDA) Waste-to-Low-Carbon-Fuels Pilot & Demonstration (+ July 2026 $8M alternative-fuels round)",
    "type": "Grant",
    "award": "~$8M solicitations; >=50% non-New York's energy agency (NYSERDA) cost share; 3-phase pilot->demo structure",
    "status": "ACTIVE",
    "deadline": "2025 solicitation (Aug 2025) + $8M round announced Jul 21 2026 under PSC Innovation & Research Order",
    "match": 4,
    "why": "New York's energy agency (NYSERDA) waste-to-low-carbon-fuels: $8M round announced Jul 21 2026; wastewater sludge is an explicitly eligible feedstock; private technology providers can lead; >=50% cost share required.",
    "access": "Yes",
    "src": [
      "K123"
    ]
  },
  {
    "rank": 8,
    "id": "G-046",
    "program": "Arizona's water finance authority (WIFA) Long-Term Water Augmentation Fund - In-State Water Augmentation cycle",
    "type": "Sub-grant via partner",
    "award": "Fund balance ~$376M (post FY26 clawback); awards >$50M require Joint Legislative Water Committee review",
    "status": "ACTIVE",
    "deadline": "In-State Water Augmentation funding cycle OPEN since Nov 17 2025",
    "match": 5,
    "why": "Arizona's water finance authority (WIFA) In-State Water Augmentation cycle OPEN since Nov 17 2025; private developers can propose within project teams (wastewater-to-drinking-water precedent already selected into Phase-2 funding).",
    "access": "Yes",
    "src": [
      "K125"
    ]
  },
  {
    "rank": 9,
    "id": "G-054",
    "program": "Pennsylvania's water fund (PENNVEST) (incl. Growing Greener / Act 13 WRPP as secondary channels)",
    "type": "Loan",
    "award": "Up to $11M/project ($20M multi-municipality; board can exceed for regional consolidation); grant + 1.7-2.2% loan blends",
    "status": "ACTIVE",
    "deadline": "Rolling applications; quarterly board-meeting cutoffs",
    "match": 5,
    "why": "Pennsylvania's water fund (PENNVEST): rare DIRECT private eligibility (owner/operators), rolling with quarterly board cutoffs; reuse/energy-efficiency/emerging-contaminants tracks all fit.",
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
    "award": "Zero-equity; ~$25K award that gives up no ownership + mentorship/network",
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
    "program": "EPA grants for Emerging Contaminants in Small or Disadvantaged Communities (EC-SDC)",
    "type": "Sub-grant via partner",
    "award": "$5B FY2022-26 total; final $1B announced May 2026",
    "status": "ACTIVE",
    "deadline": "State-driven; final the 2021 infrastructure law (BIL) allotment year 2026",
    "match": 4,
    "why": "EPA's disadvantaged-communities grant program (EC-SDC) final $1B the 2021 infrastructure law (BIL) year (May 2026 allotments) - last call to ride BIL emerging-contaminant money via small/disadvantaged water-system partners before the FY27 drop-off.",
    "access": "No—via utility partner",
    "src": [
      "K109"
    ]
  },
  {
    "rank": 13,
    "id": "G-004",
    "program": "the federal WIFIA water-loan program + its state variant (SWIFIA)",
    "type": "Loan",
    "award": "Loans up to 49% of project costs; $20M min project ($5M small communities); ~$11B credit capacity available",
    "status": "ACTIVE",
    "deadline": "Rolling Letters of Interest, year-round",
    "match": 5,
    "why": "the federal WIFIA water-loan program: ~$11B credit capacity, rolling LOIs, direct corporate borrowers allowed with public sponsorship, FY26-27 fee waivers - the deployment-scale financing vehicle.",
    "access": "Yes",
    "src": [
      "K128"
    ]
  },
  {
    "rank": 14,
    "id": "G-048",
    "program": "FL clean-water state loan fund (CWSRF) + the 2021 infrastructure law (BIL) emerging-contaminants grants (Orlando/374Water template)",
    "type": "Sub-grant via partner",
    "award": "~$800K demo precedent; full-scale follow-ons $3M-$5M",
    "status": "ACTIVE",
    "deadline": "Rolling/annual via FL DEP",
    "match": 5,
    "why": "FL clean-water state loan fund (CWSRF) / 2021 infrastructure law (BIL) emerging-contaminant money: the proven Orlando template (utility grant -> demo -> 5-yr license -> $3-5M PFAS hub); replicate now with FL utilities via rolling state water-infrastructure loan fund (SRF).",
    "access": "No—via utility partner",
    "src": [
      "K114",
      "K115"
    ]
  },
  {
    "rank": 15,
    "id": "G-030",
    "program": "the Defense Department US small-business research grant programs (SBIR/STTR) FY27 releases (all components via the DoD submission portal, DSIP; incl. Army Applied SBIR)",
    "type": "Grant",
    "award": "Phase I ~$250K (Navy up to $315K); Phase II $1.7M-$2.0M; Phase III uncapped (non-small-business research grants (SBIR) funds)",
    "status": "ACTIVE",
    "deadline": "FY27 Release 1 pre-release expected ~Oct 2026; quarterly closes (FY26 R4 closed Aug 19 2026); Army runs 3 windows/FY",
    "match": 4,
    "why": "the Defense Department small-business research grants (SBIR) FY27 Release 1 pre-release expected ~Oct 2026; quarterly cadence restarted post-reauthorization; watch the Navy facilities command (NAVFAC) water/PFAS topics - N254-123/N233-117 lineage gives a Phase II/D2P2 entry.",
    "access": "Yes",
    "src": [
      "K120"
    ]
  }
],
});

// ── §8 funding landscape: the 2026 fate board (survived / restored / died / expanding) ──
Object.assign(window.RPT, {
  funding_landscape: [
    { fate: "died", name: "EPA environmental justice grants", amount: "~$2.2B+ rescinded", note: "781 EJ grants terminated; the Office of Environmental Justice closed; unobligated the Inflation Reduction Act (IRA) climate-justice funds rescinded by the July 2025 budget law (OBBBA) (Public Law 119-21, Jul 4 2025). Never a fit for a for-profit vendor anyway.", src: ["K105"] },
    { fate: "died", name: "DOE Office of Clean Energy Demonstrations", amount: "~$11.3B terminated", note: "24 awards (~$3.7B) terminated May 2025, ~$7.56B more across DOE in Oct 2025; office abolished in the Nov 2025 reorganization. No successor; FY2026 request was $0.", src: ["K106"] },
    { fate: "died", name: "48C Advanced Energy Project Credit", amount: "$10B fully allocated", note: "Both rounds allocated; the July 2025 budget law (OBBBA) capped the program with no Round 3 expected.", src: ["K139"] },
    { fate: "died", name: "USDA REAP grants", amount: "PAUSED", note: "No FY2026 grant application notice (NOFO); no grant awards until regulations are rewritten under EO 14315; prior applicants without executed agreements must reapply. Guaranteed loans remain open.", src: ["K110"] },
    { fate: "died", name: "XPRIZE Water Scarcity ($119M)", amount: "CLOSED to entrants", note: "Registration shut; 37 semifinalists named May 2026; scope is seawater desalination, not wastewater destruction.", src: ["K140"] },
    { fate: "restored", name: "small-business research grants (SBIR) / small-business tech-transfer grants (STTR) (all agencies)", amount: "Reauthorized to 2031", note: "Lapsed 6.5 months, reauthorized Apr 13 2026 (S. 3971) through Sep 30 2031 — higher ceilings and a new 'Strategic Breakthrough' Phase II worth up to $30M at large agencies. The most reliable direct-apply channel is fully restarted.", src: ["K108"] },
    { fate: "restored", name: "FEMA BRIC", amount: "$1B grant application notice (NOFO) (closed Jul 23 2026)", note: "Cancelled April 2025, court-restored; combined FY2024–25 grant application notice (NOFO). Funds states and localities — HCSP is at most an indirect vendor partner.", src: ["K107"] },
    { fate: "expanding", name: "3M public-water-system settlement (MDL 2873)", amount: "$10.5–12.5B · >$3.5B paid", note: "Installments run through 2033–2036; >6,600 water systems registered claims. The administrator pays utilities, not vendors — sell downstream of the checks.", src: ["K111"] },
    { fate: "expanding", name: "Tyco + BASF settlements", amount: "$1.07B · payouts began 2026", note: "$750M Tyco and $316.5M BASF payments began Mar–Apr 2026; DuPont/Chemours/Corteva $1.185B distributing since Oct 2025.", src: ["K111"] },
    { fate: "expanding", name: "the 2021 infrastructure law (BIL) PFAS water money — final year", amount: "$5B EPA's disadvantaged-communities grant program (EC-SDC) · $4B drinking-water state loan fund (DWSRF) · $1B clean-water state loan fund (CWSRF)-EC", note: "EPA announced the last $1B EPA's disadvantaged-communities grant program (EC-SDC) year in May 2026 and reaffirmed $4B of drinking-water state loan fund (DWSRF) PFAS money; the clean-water state loan fund (CWSRF) Emerging Contaminants supplement ($225M FY26) covers landfill leachate (the liquid that drains out of landfills) at 100% forgiveness. FY2026 is the last allotment year.", src: ["K109", "K127"] },
    { fate: "expanding", name: "NJ PFAS Abatement Fund", amount: "$795M (≥$150M to sewage treatment plants)", note: "Court-approved Aug 7 2026; routed through the NJ Water Bank. Program design is forming now — engage New Jersey's environmental agency (NJDEP) while the pipeline forms.", src: ["K112"] },
    { fate: "expanding", name: "WI Acts 200/201", amount: ">$130M", note: "Signed June 2026; grants to municipalities AND privately owned landfills for on-site leachate (the liquid that drains out of landfills)/sewage sludge (biosolids) treatment, ≤20% match — the most direct state door a destruction vendor has had.", src: ["K113"] },
    { fate: "expanding", name: "TX Water Fund / Prop 4", amount: "up to $20B (2027–2047)", note: "Sales-tax dedication with produced-water treatment explicitly named; 2026 is the rulemaking and positioning year.", src: ["K126"] },
    { fate: "expanding", name: "NC DEQ PFAS funding", amount: "$90M+", note: "$55M state budget + ~$35M Cape Fear (Mar 2026) + the 2021 infrastructure law (BIL) state water-infrastructure loan fund (SRF)-EC; funds construction in drinking water, wastewater, and landfill leachate (the liquid that drains out of landfills) — rolling through Nov 2 2026.", src: ["K132"] },
  ],

  // ── §10 12-month deadline calendar: y = decimal year; cls hard/window/forming ──
  funding_calendar: [
    { y: 2026.66, label: "TX Prop 4 rulemaking", date: "2026 (interim year)", cls: "forming", ev: "2026 is the rulemaking and positioning year for the up-to-$20B sales-tax dedication (2027–2047); produced-water treatment is explicitly named. Low effort now, very high payoff later.", src: ["K126"] },
    { y: 2026.71, label: "Wisconsin PFAS grant rounds", date: "summer–fall 2026", cls: "window", ev: "Sampling grants launch summer/fall 2026; treatment grants (incl. privately owned landfills, ≤20% match) follow. The most direct state door for a leachate (the liquid that drains out of landfills)-destruction vendor.", src: ["K113"] },
    { y: 2026.74, label: "DWPR proposals due", date: "2026-09-29 · 4:00 pm MT", cls: "hard", closed: true, ev: "CLOSED — Reclamation's water-treatment research program (DWPR) FY2026 grant application notice (NOFO) proposals were due Sep 29 2026: $5.7M total; lab ≤$300K / pilot ≤$800K federal; for-profits apply directly; produced water and municipal wastewater are named source waters. Annual cycle — prepare the proposal for the FY2027 round.", src: ["K116"] },
    { y: 2026.75, label: "Navy research call closes", date: "2026-09-30", cls: "hard", closed: true, ev: "CLOSED — the Office of Naval Research (ONR) Long-Range open research call (BAA) N0001425SB001 stopped accepting full proposals Sep 30 2026. The waste-heat-driven SCWO white paper (expeditionary/shipboard water and waste destruction) carries over to the successor BAA — verify the current solicitation before submitting.", src: ["K117"] },
    { y: 2026.79, label: "SERDP FY28 call opens", date: "~Oct–Nov 2026", cls: "window", ev: "the defense environmental research program (SERDP) FY28 solicitation expected ~Oct–Nov 2026; FY2027 budget fully funded at $60.8M; direct SCWO precedents (ER20-5350). Pre-position for an Environmental Restoration SON.", src: ["K118"] },
    { y: 2026.81, label: "NJ fund pipeline forms", date: "post Aug 7 2026", cls: "forming", ev: "NJ $795M PFAS Abatement Fund court-approved Aug 7 2026; ≥$150M to sewage treatment plants via the Water Bank. Engage New Jersey's environmental agency (NJDEP) while program design and project pipelines form.", src: ["K112"] },
    { y: 2026.83, label: "Defense SBIR FY27 R1", date: "~Oct 2026 pre-release", cls: "window", ev: "Watch for the Navy facilities command (NAVFAC) water/PFAS topics succeeding N254-123 (expeditionary greywater reuse) and N233-117 (PFAS defluorination; the Air Force civil engineers (AFCEC) and the Army Corps of Engineers named as Phase III transition partners).", src: ["K120"] },
    { y: 2026.87, label: "NC rolling close", date: "through Nov 2 2026", cls: "hard", ev: "NC DEQ funds PFAS construction in drinking water, wastewater, and landfill leachate (the liquid that drains out of landfills); rolling quarterly deadlines through Nov 2 2026.", src: ["K132"] },
    { y: 2026.92, label: "Imagine H2O 2027 apps", date: "Nov–Dec 2026", cls: "hard", ev: "Zero-equity accelerator applications for the 2027 cohort; PFAS and sludge destruction are named cohort themes; ~$25K award plus the Water Innovation Pilot Fund (~$50–150K recoverable pilot grants).", src: ["K130"] },
    { y: 2026.96, label: "Water-loan PFAS funds end", date: "FY2026 close-out", cls: "window", ev: "The final 2021 infrastructure law (BIL) allotment year: $225M clean-water state loan fund (CWSRF)-EC FY26 tranche, EPA's disadvantaged-communities grant program (EC-SDC)'s last $1B, $4B drinking-water state loan fund (DWSRF) PFAS. Projects awarded in 2026 procure equipment through 2027–2030 — get specified into state funding priority lists (IUPs) this cycle.", src: ["K109", "K127"] },
    { y: 2027.18, label: "ESTCP FY28 pre-proposals", date: "~Dec 2026–Mar 2027", cls: "hard", ev: "The defense environmental research program (ESTCP) FY28 cycle with 'Water Resilience on the Defense Department Installations' and energy-resilience topics — both direct HCSP fits; FY2027 budget $125.1M; SCWO precedent ER23-7939. The pre-proposal is the gate; line up a Defense Department host in Q4 2026.", src: ["K119"] },
    { y: 2027.55, label: "Elemental DCII window", date: "rolling through 2027", cls: "forming", ev: "Elemental Impact Data Center Innovation Initiative: $500K–$5M per project, ≤10 startups, with Amazon/Google/Meta/Microsoft as collaborators — the flagship private fit for the water+cooling+power story.", src: ["K131"] },
  ],

  // ── §9 access architecture: three modes + the Orlando template ──
  access_modes: [
    { mode: "b", name: "Named technology in a partner's application", effort: 40, tone: "lead",
      gist: "Where the big money is. ~90% of the relevant dollar volume flows to utilities, municipalities, and public systems — not vendors. The utility writes the proposal; HCSP supplies the engineering package, cost data, and performance evidence that make it winnable.",
      template: "Orlando clean-water state loan fund (CWSRF) grant ~$800K (Feb 2024) → 374Water demo at Iron Bridge → 5-yr waste-destruction license (Mar 2026) → $3–5M PFAS destruction hub (Jun 2026). Repeating at OC San (RISE, 6 t/d) and Minnesota (Minnesota's environment trust fund (ENRTF), Dec 2025).",
      src: ["K114", "K115", "K144", "K143"] },
    { mode: "a", name: "Direct-apply programs", effort: 35, tone: "base",
      gist: "Fewer but actionable: the defense environmental research programs (SERDP/ESTCP), the federal small-business research grants (SBIR/STTR), New York's energy agency (NYSERDA) waste-to-fuels, Pennsylvania's water fund (PENNVEST) (private owner/operators eligible), Arizona's water finance authority (WIFA) project teams, USDA business loan guarantees, and the federal WIFIA water-loan program (corporations eligible with public sponsorship) — plus the FY2027 rounds of Reclamation's water-treatment research program (DWPR) and the Office of Naval Research open call, both of which closed in September 2026.",
      template: "Eight of the Top 15 are direct-apply — small-dollar, high-probability credibility plays that generate the evidence the partnerships consume.",
      src: ["K116", "K117", "K118", "K124"] },
    { mode: "c", name: "Supplier or subcontractor to prime contractors", effort: 25, tone: "base",
      gist: "Monetizes demand HCSP cannot touch directly. The Defense Department's firefighting foam (AFFF) stockpile disposal runs through installation-level contracts with prime environmental contractors; the 2024–25 Defense demonstration series field-tested ~10 vendors and concluded on-site destruction beats off-site disposal.",
      template: "A revenue channel disguised as a grants channel: subcontract under the primes executing the Oct 1 2026 firefighting foam phase-out across ~1,000 facilities.",
      src: ["K133"] },
  ],
});

// ═══ §3C The energy advantage — six plain-language scenarios (RPT.energy_scenarios) ═══
// Every figure is illustrative, from the engineering chapters (trigeneration,
// V2D3 new industries, V2D4 storage); K-refs point at the dated anchors in sources.js.
Object.assign(window.RPT, {
  energy_scenarios: [
    {
      id: "A",
      name: "Anchor-host micro-utility",
      tag: "Build at the waste · sell energy next door",
      card: "Put the plant where the strong waste already is — a distillery, a sewage treatment plant, a food factory. Charge for destroying the waste, then pipe electricity and chilled water to a neighbor that needs them: a data center, a cold-storage warehouse, a greenhouse.",
      diagram: {
        feed: "1,000 m³/day of strong waste (100 g/L COD — distillery-strength)",
        power: "1.4 MW of electricity",
        cooling: "4.9 MW of cooling (≈1,392 refrigeration tons)",
        heat: "Hot water at 150–180 °C available",
        water: "≈900 m³/day of distilled water",
      },
      earns: [
        { t: "Destruction fees", d: "The core business: the host pays to make a regulated waste problem disappear. This revenue exists with or without the energy sales.", src: ["K22", "K33"] },
        { t: "Clean water", d: "Roughly 900 m³/day of distilled water, worth about $1–5/m³ depending on the site — a real credit, never the main product.", src: ["K31", "K1"] },
        { t: "Energy", d: "About $1.15M a year of electricity plus cooling (illustrative, from engineering studies) — stacked on top of the destruction fees, not instead of them.", src: ["K83", "K80"] },
      ],
      econ: [
        { lab: "Heat released by destroying the waste", val: "16.1 MW of heat", src: ["K80"] },
        { lab: "Left over after the plant preheats its own feed", val: "9.6 MW of surplus heat", src: ["K81", "K82"] },
        { lab: "Turned into electricity by a small steam turbine", val: "1.4 MW ≈ $1.12M/yr", src: ["K83"] },
        { lab: "Remaining heat drives chillers", val: "4.9 MW cooling ≈ $0.66M/yr of avoided electricity — up to $2.0M/yr if sold as chilled water", src: ["K83", "K86"] },
        { lab: "Combined energy value", val: "≈ $1.15M/yr — on top of destruction fees", src: ["K83"] },
      ],
      needs: [
        "Waste strong enough to make spare heat — above ~35–60 g/L COD (a measure of how much organic waste is in the water); the example uses 100 g/L.",
        "Real scale — the example plant is 1,000 m³/day, about a hundred 10 m³/day modules working together.",
        "A signed buyer within piping distance using at least 500 refrigeration tons (about 1.8 MW) of steady cooling.",
        "Normal electric chillers stay installed as backup — the heat-driven system is a money-saving layer, not the only source of cold.",
      ],
      drills: [
        { title: "WHERE THE HEAT GOES", value: "16.1 → 9.6 MW", sub: "Destroying the waste releases 16.1 MW of heat, but about 60% is spent preheating the incoming feed — that is the price of a self-heating process. The 9.6 MW left over is what can be sold. A real pilot plant in Cádiz recovered 71% of feed energy, so the arithmetic is not optimistic.", src: ["K80", "K81", "K82"] },
        { title: "WHAT THE ENERGY IS WORTH", value: "$1.15M/yr illustrative", sub: "Power earns $15–20 per MWh of heat; cooling only ~$10 as avoided electricity — unless chilled water is sold at district tariffs of $30–48, in which case cooling outearns power. Combined illustrative value ≈ $1.15M/yr at $0.10/kWh and 8,000 operating hours.", src: ["K83"] },
        { title: "THE COOLING ISLAND'S PRICE", value: "$2.8–5.4M installed", sub: "1,400–1,650 refrigeration tons of heat-driven chiller plant at $1,600–6,000 per ton installed (US DOE fact sheet), plus a cooling tower about twice the electric-chiller size. The energy module pays only because the heat is free.", src: ["K199"] },
      ],
      src: ["K80", "K83", "K61"],
    },
    {
      id: "B",
      name: "Cold-chain industrial park",
      tag: "Heat in, deep cold out — on the refrigerant industry already trusts",
      card: "Dairies, breweries, and cold-storage parks already keep things frozen with ammonia refrigeration driven by electric compressors. An HCSP plant next door makes the same cold from its spare heat instead — in a closed ammonia loop that never touches the product — and the electric compressors drop to backup duty.",
      diagram: {
        feed: "Food, dairy, or brewery waste at hub scale (≥60–100 g/L COD)",
        power: "Not used here — all spare heat goes to cooling",
        cooling: "≈4.9 MW of sub-zero cooling for freezers and cold stores",
        heat: "Not sold here",
        water: "Distilled water for the food plants",
      },
      earns: [
        { t: "Destruction fees", d: "The park's concentrated food and dairy waste is destroyed on site instead of hauled or digested.", src: ["K46"] },
        { t: "Clean water", d: "Distilled water goes back to the food plants, where washdown and process water are always in demand.", src: ["K1"] },
        { t: "Energy (as cold)", d: "Cold is the product: electricity is 9–18% of a cold store's operating cost, and over 95% of US refrigerated warehouses already run ammonia — the heat-driven chiller slots into infrastructure that exists.", src: ["K197", "K85"] },
      ],
      econ: [
        { lab: "Cooling from 9.6 MW of spare heat (design efficiency)", val: "≈5.8 MW of cooling (1,637 refrigeration tons)", src: ["K84"] },
        { lab: "Same, at field-measured efficiency — the honest number", val: "≈4.3 MW (1,220 tons) — plan on this", src: ["K86"] },
        { lab: "What a MWh of heat is worth as cooling", val: "~$10 of avoided electricity", src: ["K83"] },
        { lab: "Installed cost of the chiller plant", val: "$2.8–5.4M (1,400–1,650 tons)", src: ["K199"] },
      ],
      needs: [
        "A steady, year-round freezing or cold-storage load of at least 500 refrigeration tons right next door.",
        "Strong waste at scale — this only works at hub-scale plants (hundreds of m³/day), not a single small module.",
        "Room to site the ammonia equipment away from occupied buildings — ammonia is toxic, and big charges trigger federal safety rules (OSHA PSM / EPA RMP above 10,000 lb).",
        "The existing electric compressors stay as backup — cooling loads run 24/7 and the waste plant does not.",
      ],
      drills: [
        { title: "WHY AMMONIA FITS HERE", value: ">95% of US cold warehouses", sub: "Ammonia is already the industry's refrigerant: 42% of the industrial refrigeration market and over 95% of US refrigerated warehouses. The HCSP chiller is a closed ammonia loop driven by heat at 95–180 °C — no new refrigerant risk profile for the park, and it reaches the sub-zero temperatures lithium-bromide machines cannot.", src: ["K85", "K84"] },
        { title: "THE HONEST EFFICIENCY", value: "COP 0.28–0.45 measured", sub: "Design sheets claim 0.6 units of cooling per unit of heat; the only published field measurement on waste heat (a refinery unit) came in at 0.28–0.37. Underwrite cold-chain deals at the measured band, never the brochure.", src: ["K86"] },
        { title: "THE LOAD IT DISPLACES", value: "9–18% of cold-store opex", sub: "A typical 500-tonne cold store burns 400,000–500,000 kWh/yr; a modern automated −21 °C warehouse runs a 353-ton ammonia plant at 4.54 kWh/m³/yr. That purchased electricity is what free heat replaces.", src: ["K197"] },
      ],
      src: ["K85", "K86", "K197"],
    },
    {
      id: "C",
      name: "Data-center energy campus",
      tag: "The data center buys the energy — its neighbor owns the plant",
      card: "Data centers spend 30–40% of their electricity on cooling and wait 4–7 years for a grid connection. They make almost no organic waste of their own, so the plant sits at the waste-rich neighbor — a sewage works, distillery, or food complex — and sells the data center power and chilled water under 10–20-year energy-services agreements.",
      diagram: {
        feed: "The neighbor's strong waste (a data center's own waste is mostly salty water — not fuel)",
        power: "1.4 MW sold to the campus (per example plant)",
        cooling: "Chilled water for the data halls — 30–40% of their electric bill",
        heat: "Optional: heat-reuse sales where the law rewards it",
        water: "Reclaimed water for cooling-tower makeup",
      },
      earns: [
        { t: "Destruction fees", d: "Paid by the waste host — the data center never touches this side of the business.", src: ["K68"] },
        { t: "Clean water", d: "A 1 MW data center on evaporative cooling uses ~6.75M gallons of water a year; reclaimed water on site cuts that bill and eases permitting in dry states.", src: ["K69", "K142"] },
        { t: "Energy", d: "A 10–20-year contract for power plus chilled water from a creditworthy tenant is exactly what project lenders want to see before they fund the plant.", src: ["K69", "K83"] },
      ],
      econ: [
        { lab: "Cooling share of a data center's electricity", val: "30–40%", src: ["K69"] },
        { lab: "Wait for a new grid connection", val: "4–7 years (Northern Virginia; Texas queue 410 GW)", src: ["K69"] },
        { lab: "Heat-driven chilling vs electric chilling", val: "2 MW of cooling on ~25 kW of electricity instead of >500 kW (vendor design guide)", src: ["K201"] },
        { lab: "Chilled water sold retail where networks exist", val: "$30–48 per MWh of heat — outearns making power", src: ["K83"] },
      ],
      needs: [
        "An adjacent host with strong waste — the data center itself cannot feed the plant; its waste water is salty, not organic.",
        "A signed 10–20-year energy-services agreement before construction — the contract, not the machine, is what gets financed.",
        "Full electric backup cooling — data halls need cold every second of every day (the industry standard is called N+1), so the heat-driven chillers are a displacement layer.",
        "The configuration note: lithium-bromide (LiBr) chillers for the data hall's above-freezing chilled water (they are more efficient there and non-toxic), and the closed ammonia loop only where sub-zero duty is wanted. These are options on a menu, not a conflict.",
      ],
      drills: [
        { title: "WHY DATA CENTERS ARE BUYERS, NOT HOSTS", value: "Fit score 3/10 as a waste customer", sub: "A data center's liquid waste is cooling-tower blowdown — salt and minerals, which this machine does not destroy. So the report inverts the model: the plant sits at the waste and the data center signs as the energy buyer. Microsoft's Cheyenne 'Data Plant' ran the same trick in reverse on digester gas in 2014.", src: ["K68"] },
        { title: "THE GRID QUEUE IS THE PITCH", value: "4–7 years", sub: "Northern Virginia interconnection waits run 4–7 years; Texas's large-load queue hit 410 GW, 87% of it data centers. A campus that can buy power and cooling across the fence does not wait.", src: ["K69"] },
        { title: "TWO CHILLERS, TWO JOBS", value: "LiBr above 0 °C · ammonia below", sub: "LiBr machines run on gentle 70–120 °C hot water at better efficiency (0.7–0.8 units of cooling per unit of heat) and are a non-toxic salt solution — the right match for data-hall chilled water. Ammonia reaches −60 °C but needs siting distance from occupied buildings. Offered as options, not a conflict.", src: ["K84", "K85"] },
      ],
      src: ["K69", "K68", "K201"],
    },
    {
      id: "D",
      name: "Island microgrid",
      tag: "The one place where water, power, and cold all cost the most",
      card: "On islands, everything the plant makes is expensive: diesel power runs $0.30–0.52 per kWh, desalinated water $2–5 per cubic meter, and there is nowhere to send sewage sludge. One plant turns the island's waste into fresh water, power, and ice for the fishing fleet, resorts, and cold storage.",
      diagram: {
        feed: "Sewage sludge blended with grease-trap and food waste (blending is what makes it strong enough)",
        power: "Power that displaces diesel at $0.30–0.52/kWh",
        cooling: "Ice for fisheries + air conditioning for resorts",
        heat: "Hot water for kitchens and laundries",
        water: "Fresh water at desalination parity ($2–5/m³)",
      },
      earns: [
        { t: "Destruction fees", d: "Islands have no cheap sludge outlet: no farmland to spread it on, scarce landfill space, tightening ocean-discharge rules. Destruction on site removes the problem entirely.", src: ["K65"] },
        { t: "Clean water", d: "Small-scale desalination costs $2–5/m³ on islands; the plant's distilled water prices against that, not against cheap mainland water.", src: ["K65"] },
        { t: "Energy", d: "Power replaces diesel at $0.30–0.52/kWh — three to five times mainland prices — and heat-driven ice plants serve the fishing fleet; making a tonne of ice takes ~94 kWh of electricity today.", src: ["K65", "K200"] },
      ],
      econ: [
        { lab: "Island electricity price (diesel-based)", val: "$0.30–0.52/kWh (Hawaii, US Virgin Islands)", src: ["K65"] },
        { lab: "Island small-scale desalination price", val: "$2–5/m³", src: ["K65"] },
        { lab: "Electricity to make a tonne of ice today", val: "59–133 kWh (average ~94)", src: ["K200"] },
        { lab: "Ride-through battery for cloudy weeks and restarts", val: "Lithium iron phosphate (LFP) default; nickel-iron only for daily-cycled off-grid sites", src: ["K88", "K87"] },
      ],
      needs: [
        "Blending, not just sewage: island sludge is too watery on its own, so grease-trap waste and food waste are mixed in to reach the strength where spare heat exists (~35–60 g/L COD and up).",
        "A cluster of buyers — resort strip, fishing port, cold store — so water, power, and ice all sell within a few kilometers.",
        "Backup power sized for a dead site: LFP batteries by default because they hold their charge for months; nickel-iron only where the battery is cycled daily and replacements are hard to ship.",
        "Patience with public buying — islands buy through municipal and utility processes, which are slow.",
      ],
      drills: [
        { title: "WHY ISLANDS PRICE ALL THREE OUTPUTS AT THE TOP", value: "$0.52/kWh · $5/m³", sub: "Hawaii residential power reached 52¢/kWh in May 2026; US Virgin Islands commercial power runs $0.40–0.47/kWh on imported diesel; small-scale desalination costs $2–5/m³. No mainland market prices all three outputs this high at once.", src: ["K65"] },
        { title: "ICE IS THE SELLABLE FORM OF COLD", value: "~94 kWh/tonne today", sub: "Thai government data puts ice making at 59–133 kWh per tonne by electric machine, and ammonia ice plants are the standard across South and Southeast Asia. A heat-driven ice plant converts spare heat directly into a product fishing fleets already buy.", src: ["K200"] },
        { title: "THE BATTERY DECISION, SETTLED", value: "LFP by default", sub: "Nickel-iron batteries lose 20–30% of their charge per month sitting idle — disqualifying for backup duty. LFP packs at ~$70/kWh hold charge and win every backup row; nickel-iron survives only as an option for daily-cycled off-grid sites, and even then as a hybrid.", src: ["K87", "K88"] },
      ],
      src: ["K65", "K200", "K88"],
    },
    {
      id: "E",
      name: "Seasonal dual-mode",
      tag: "Cooling in summer, heating in winter — the heat sells all year",
      card: "Cooling sells in summer and sits idle in winter. This scenario swaps the outlet with the season: summer heat drives chillers, winter heat becomes hot water for district heating, factories, or greenhouses. Selling the heat year-round is what actually pays for the energy module.",
      diagram: {
        feed: "The same strong waste stream, all year",
        power: "Optional turbine, run when it pays",
        cooling: "SUMMER: chilled water for buildings and cold stores",
        heat: "WINTER: hot water for district heating or greenhouses",
        water: "Distilled water, every season",
      },
      earns: [
        { t: "Destruction fees", d: "Unchanged — the waste arrives and is destroyed in every season.", src: ["K22"] },
        { t: "Clean water", d: "Unchanged — distilled water sells in every season.", src: ["K1"] },
        { t: "Energy, twice a year", d: "Summer: cooling worth ~$10 per MWh of heat as avoided electricity, or $30–48 where chilled water retails. Winter: heat sold at $10–30 per MWh into heating networks that already buy exactly this.", src: ["K83", "K198"] },
      ],
      econ: [
        { lab: "Summer outlet — heat-driven cooling", val: "~$10/MWh of heat avoided electricity; $30–48 as retail chilled water", src: ["K83"] },
        { lab: "Winter outlet — heat sold as heat", val: "$10–30/MWh of heat (district and process heat)", src: ["K83", "K198"] },
        { lab: "Proof the winter market exists", val: "Meta's Danish data center sells ~100,000 MWh/yr of heat — enough to warm ~7,000 homes", src: ["K198"] },
        { lab: "Why dual-mode matters", val: "The chiller and piping are paid off by 12 months of revenue, not 4", src: ["K202"] },
      ],
      needs: [
        "Both kinds of neighbor: a cooling buyer for summer and a heating buyer (district network, factory, greenhouse) for winter, close enough to pipe to.",
        "Heat metered like a utility, so buyers pay for what they take in either mode.",
        "A climate with real winters and real summers — heating-dominated and cooling-dominated regions each favor one mode; dual-mode earns its keep between them.",
        "The same guardrails as every scenario: strong feed, hub scale, backup electric chilling.",
      ],
      drills: [
        { title: "THE WINTER MARKET IS PROVEN", value: "~7,000 homes warmed", sub: "Stockholm's district network has bought data-center waste heat since 2014; Meta's Odense facility supplies ~100,000 MWh/yr; Germany now requires heat reuse from new data centers above 1 MW. Winter heat sales are a signed-contract reality, not a theory.", src: ["K198"] },
        { title: "GEOGRAPHY SETS THE MIX", value: "Heat $10–30 vs cooling $10–48 /MWh", sub: "In heating-dominated climates, district-heat sales outcompete cooling for the same surplus; in cooling-dominated climates (US Southwest, Gulf, Southeast Asia), cooling is the right polarity. Dual-mode is the answer for the temperate middle.", src: ["K83", "K198"] },
        { title: "THE PAYOFF LOGIC", value: "2 seasons of revenue", sub: "Trigeneration economics are dispatch- and tariff-sensitive: the literature warns cooling-and-power mode can underperform unless the plant follows a proper dispatch strategy. Switching outlets with the season is that strategy, stated plainly.", src: ["K202", "K83"] },
      ],
      src: ["K198", "K83", "K202"],
    },
    {
      id: "F",
      name: "The steam ladder",
      tag: "Four price points on one plant — buy a rung, not the whole campus",
      card: "Nobody has to buy the full energy campus on day one. The ladder has four separately sellable levels: start by selling steam to the host, add a chiller when a cooling buyer signs, add a turbine when power has a buyer, and top out at full power-cooling-heat under long-term contracts. Each rung is its own price point.",
      diagram: {
        feed: "Any strong waste stream at hub scale",
        power: "LEVEL 3 — a turbine turns steam into power ($15–20/MWh of heat)",
        cooling: "LEVEL 2 — a chiller turns heat into cold (~$10/MWh of heat)",
        heat: "LEVEL 1 — steam sold straight to the host ($10–30/MWh of heat)",
        water: "Distilled water at every level",
      },
      earns: [
        { t: "Destruction fees", d: "The base business at every rung — the ladder only stacks on a plant that already earns from destruction.", src: ["K22"] },
        { t: "Clean water", d: "The base credit at every rung.", src: ["K31"] },
        { t: "Energy, rung by rung", d: "Each level adds a revenue line and its own equipment: steam sales (simplest), then the chiller, then the turbine, then the full three-output contract. The illustrative full stack at the 1,000 m³/day example is ~$2.1–4.8M/yr vs $0.3–1.6M/yr for water alone.", src: ["K202", "K83"] },
      ],
      econ: [
        { lab: "Level 1 — steam sales to the host (simplest)", val: "$10–30 per MWh of heat", src: ["K83", "K202"] },
        { lab: "Level 2 — + heat-driven chiller", val: "~$10/MWh of heat avoided electricity; $30–48 as retail chilled water", src: ["K83"] },
        { lab: "Level 3 — + steam turbine for power", val: "$15–20 per MWh of heat", src: ["K83"] },
        { lab: "Level 4 — full power + cooling + heat under offtake contracts", val: "~$2.1–4.8M/yr illustrative stack at the example plant", src: ["K202"] },
      ],
      needs: [
        "Rung 1 needs only a host that already burns fuel to make steam — the simplest sale on the ladder.",
        "Rung 2 needs a signed cooling buyer of at least 500 refrigeration tons and siting room for ammonia equipment (or a lithium-bromide machine for above-freezing duty).",
        "Rung 3 needs a power buyer or export permission — power earns the most per unit of heat but adds the most machinery.",
        "Rung 4 needs all buyers signed under 10–20-year contracts — that is what lenders finance against. Nobody is forced to climb past the rung that pays.",
      ],
      drills: [
        { title: "THE VALUE LADDER PER UNIT OF HEAT", value: "$10 → $48 /MWh of heat", sub: "Power $15–20, cooling ~$10 as avoided electricity, chilled water sold retail $30–48, heat $10–30. The ranking decides which rung to add next — and retail chilled water is the exception that leapfrogs power.", src: ["K83"] },
        { title: "EACH RUNG IS A SEPARATE PRICE POINT", value: "L1 · L2 · L3 · L4", sub: "The four levels are quoted and sold independently: steam first, chiller when the cooling buyer signs, turbine when power has a buyer, full contract stack last. The illustrative full stack at the 1,000 m³/day example plant is ~$2.1–4.8M/yr against $0.3–1.6M/yr for water alone — but each rung must pay for itself.", src: ["K202"] },
        { title: "WHAT THE TOP RUNG COSTS TO BUILD", value: "$2.8–5.4M cooling island", sub: "The chiller plant for the example is $2.8–5.4M installed before the turbine; the ladder exists so that money is only spent after the corresponding revenue is under contract.", src: ["K199"] },
      ],
      src: ["K202", "K83", "K199"],
    },
  ],

  // Shared guardrails — shown once for the whole §3C section, never hidden in footnotes.
  energy_guardrails: [
    { t: "Spare heat is not automatic", d: "Surplus heat only exists when the waste is strong enough — above roughly 35–60 g/L COD (a measure of how much organic waste is in the water) — and when the plant is big enough. Below that line the plant heats itself and has nothing left to sell. Every scenario on this page assumes that line is cleared.", src: ["K73", "K80"] },
    { t: "Chillers want big, steady cold customers", d: "Heat-driven chillers make economic sense at steady loads of at least 500 refrigeration tons (about 1.8 MW of cooling). And because the waste plant follows waste deliveries and maintenance, full electric backup chillers are always still needed — the heat-driven system saves money; it is never the only source of cold.", src: ["K85"] },
    { t: "Ammonia needs distance", d: "Ammonia is the industry's standard refrigerant, but it is toxic: charges above 10,000 lb trigger federal safety programs (OSHA PSM / EPA RMP), and the equipment is sited away from occupied buildings. For above-freezing cooling next to people, the lithium-bromide option avoids this entirely.", src: ["K85", "K84"] },
  ],
});

// ═══ §3C add-on — Materials recovery: the future second revenue stream (RPT.materials_recovery) ═══
// Roadmap / R&D direction only — NOT a shipping feature. Anchors: K203 potash (CPCB route),
// K204 Smackover DLE, K205 ARPA-E RECOVER, K206 derived nutrient/mixed-salt findings.
Object.assign(window.RPT, {
  materials_recovery: {
    status: "ROADMAP — not a shipping feature",
    intro: "Today's HCSP produces three things: clean water, energy, and a small amount of inert solid. Future versions would add separation steps — distillation, crystallization, and selective precipitation — that pull valuable substances out of the waste before or after the rest is destroyed, and sell them. That turns a disposal cost into a product: a second revenue stream on top of the destruction fees. Treat this as the manufacturer's roadmap and research direction, not a shipping feature — every stream below first has to pass a purity test and a market test.",
    rows: [
      {
        sub: "Potash — potassium salts (sold as K2O fertilizer)",
        source: "Distillery waste (vinasse / spent wash)",
        path: "Evaporate and crystallize the mineral fraction left after the organics are destroyed — the route India's pollution board (CPCB) already accepts for distilleries.",
        buyer: "Fertilizer blenders",
        note: "One of the best-documented cases: India already accepts potash recovery from distillery waste, and reference plants exist with under-3-year payback.",
        src: ["K203", "K61", "K62"],
      },
      {
        sub: "Lithium",
        source: "Oilfield produced-water and geothermal-type brines",
        path: "Not inside the HCSP itself — a separate direct-lithium-extraction (DLE) plant next door, on the model of the Smackover project in Arkansas.",
        buyer: "Battery-chemical makers",
        note: "A long-term option, not an HCSP output by default: the one fully costed project needed $1.45 billion of its own plant to make the numbers work.",
        src: ["K204", "K93"],
      },
      {
        sub: "Nitrogen & phosphorus — ammonium sulfate, struvite",
        source: "Factory-farm manure, sewage sludge, indoor-farm runoff",
        path: "Strip the ammonia out of the stream and settle the phosphorus out as struvite before the organics are fully destroyed.",
        buyer: "Fertilizer makers",
        note: "Pays only if the nitrogen and phosphorus are kept in a recoverable form — fully destroyed, they leave as plain gas and inert solids worth nothing. The US energy department already funds exactly this kind of recovery.",
        src: ["K205", "K206"],
      },
      {
        sub: "Industrial salts — sodium chloride, calcium chloride",
        source: "Very salty industrial wastewater (textile dyeing, chemical plants)",
        path: "Fractional crystallization — boil the brine down and harvest each salt as it drops out, one at a time.",
        buyer: "Chemical-feedstock users: chlor-alkali plants, dyers, road deicing",
        note: "Salt is cheap as a commodity. This pays only when the site already needs the salt, or when disposing of it is expensive.",
        src: ["K42", "K206"],
      },
      {
        sub: "Specialty metals — nickel, copper, zinc, cobalt",
        source: "Metal-finishing, plating and electronics waste",
        path: "Leach the metals out of the solid residue with acid, then precipitate them one by one.",
        buyer: "Metal recyclers and refiners",
        note: "Works only on metal-rich feeds — a mixed sludge from many sources is not worth picking apart.",
        src: ["K205", "K206"],
      },
      {
        sub: "Silica — CMP slurry solids",
        source: "Semiconductor polishing waste (chemical-mechanical polishing)",
        path: "Recover the silica solids from the waste and clean them for reuse in abrasives or cement.",
        buyer: "Materials suppliers",
        note: "Buyers demand a purity certificate — no certificate, no sale.",
        src: ["K206"],
      },
    ],
    rule: "The honest rule: recovery only pays when you know exactly what is in the feed and can prove the recovered material is pure enough to sell. Otherwise the solids go to standard disposal — no one writes a check for 'sludge' as a generic product.",
  },
});

