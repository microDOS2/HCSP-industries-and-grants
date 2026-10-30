// ═══ §4 · Competitive intelligence — window.Comp3D.render(hostEl) ═══
// One module, four views (tabs). WHO SURVIVED and THE SCALE GAP default to the
// clean DOM components from js/chart_other.js (window.ChartOther — clickable
// fates with lessons + dated sources; log-scale deal-size chart with the blue
// sub-$1M zone); each keeps its 3D scene behind a "◈ 3D VIEW" toggle. VENDOR
// PANELS remains 3D. CUSTOMER MAP is a real geographic map: a vendored
// Natural Earth world atlas (topojson, vendor/world-110m.js +
// vendor/topojson-client.min.js) with pins projected from true lon/lat,
// largest/smallest flags, a verified-vs-marketing coverage matrix, and a
// sortable DOM table alternative behind "▦ TABLE VIEW".
// Data: js/data.js (RPT.players / scalegap / comp_profiles / comp_matrix /
// cust_tables / geo_matrix), sources: js/sources.js (window.K / KLINK / SRCS).
// Continuous animation on load for 3D views (auto-orbit + traveling markers +
// ambient particles) · PAUSE button · Reading Mode = static frame · rendering
// pauses offscreen (IntersectionObserver) and in DOM views · TABLE VIEW button
// swaps the 3D canvas for a DOM data-table alternative of the same view.
// Click anything for the detail with dated source links.
// Integration: host <div id="comp3d"></div> after vendor/three.min.js,
// vendor/OrbitControls.js, vendor/echarts.min.js (scale-gap chart only),
// vendor/topojson-client.min.js, vendor/world-110m.js (customer map),
// js/data.js, js/sources.js, js/utils.js, js/charts-core.js, js/chart_other.js;
// styles css/flow3d.css (.sc3d-* shared + .c3d-* block) + css/other.css (.ot-*)
// + css/style.css (.geomap-*).
window.Comp3D = (() => {
  "use strict";

  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const KLINK = ids => (window.KLINK ? window.KLINK(ids) : (ids || []).join(", "));
  // dated variant: links plus the publication date of each source
  const KLINKD = ids => {
    const dates = (ids || []).map(id => { const s = window.K && K(id); return s ? s.date : ""; }).filter(Boolean).join(", ");
    return KLINK(ids) + (dates ? ` <span class="src-date">(dated ${dates})</span>` : "");
  };
  const READER = () => document.documentElement.classList.contains("reader");
  const COMP_CSS = { w374: "#2251ff", ga: "#42566a", aq: "#008a6d", rv: "#b07a10" };
  const GEO_MARKER = { op: ["#00674f", "OPERATING"], demo: ["#8a5f0a", "DEMO / TEST"], ann: ["#2251ff", "ANNOUNCED"], mkt: ["#5b6f82", "MARKETING CLAIM"], no: ["#9aa8b5", "NO PRESENCE"] };

  // Pins for the map view, keyed by company id + cust_tables row index.
  // [lon, lat]; failed/lost sites get an ✕ chip. Rows with no verifiable
  // point location stay table-only by design.
  const MAP_PINS = {
    w374: { 0: [-81.4, 28.4], 1: [-117.9, 33.7], 2: [-94.8, 38.9], 3: [-94.2, 45.6],
            4: [-83.0, 42.3], 5: [-104.8, 38.8], 6: [-79.0, 35.5], 7: [-83.4, 41.7] },
    ga:   { 0: [-84.3, 37.7], 1: [-92.9, 45.0], 2: [72.5, 40.5], 3: [117.7, 39.0],
            4: [-80.8, 35.2], 5: [-112.3, 40.5], 6: [-93.4, 32.6], 7: [139.0, 36.0], 8: [-117.2, 32.7] },
    aq:   { 0: [1.35, 43.55], 1: [-0.7, 44.9], 2: [0.2, 45.7], 3: [18.1, 59.3],
            4: [18.4, 59.55], 5: [12.15, 55.95], 6: [11.95, 55.75], 7: [139.7, 35.7] },
    rv:   { 0: [-74.7, 40.2], 1: [-82.75, 40.45], 2: [-83.05, 40.1], 3: [-71.6, 43.7],
            4: [-79.0, 35.5], 5: [-105.5, 39.0], 6: [-85.7, 42.9], 7: [-83.1, 42.35], 8: [-85.1, 41.1] },
  };
  const X_STATUS = { ga: { 5: "FAILED", 6: "COLLAPSED" }, rv: { 5: "LOST" } };
  // Region coverage-tile anchors [lon, lat] — placed just off the pin
  // clusters so tiles never sit on top of pins.
  const MAP_REGIONS = { "United States": [-100, 31], "Europe": [10, 35], "China": [106, 33], "Japan": [142, 32], "Central Asia": [62, 38], "Canada / other": [-106, 56] };
  // 2D label placement, absolute px in the 1000×540 viewBox (hand-laddered to
  // keep the dense US cluster readable; leader lines run back to each pin).
  const REG_LAB = { "United States": [255, 312], "Europe": [452, 66], "China": [778, 238],
    "Japan": [864, 234], "Central Asia": [671, 146], "Canada / other": [330, 58] };
  const PIN_LAB2D = {              // keyed "company:row" → [x, y] label anchor
    "w374:2": [120, 134],  // ▲ LARGEST · OLATHE, KS        (pin 257,182)
    "w374:3": [132, 180],  // ▽ SMALLEST · ST. CLOUD, MN    (pin 266,161)
    "ga:0":   [430, 170],  // ▲ LARGEST · RICHMOND, KY      (pin ~283,186)
    "ga:5":   [150, 218],  // ✕ FAILED · TOOELE, UT         (pin 214,177)
    "ga:6":   [240, 250],  // ▽ SMALLEST · CAMP MINDEN, LA  (pin 255,202)
    "ga:6x":  [240, 267],  // ✕ COLLAPSED · CAMP MINDEN, LA
    "aq:0":   [503, 200],  // ▲ LARGEST · TOULOUSE, FRANCE  (pin 503,167)
    "aq:5":   [642, 82],   // ▽ SMALLEST · SKÆVINGE, DK     (pin 528,129)
    "rv:0":   [352, 84],   // ▲ LARGEST · NJ STATEWIDE      (pin 310,178)
    "rv:3":   [438, 104],  // ▽ SMALLEST · NEW HAMPSHIRE    (pin 320,167)
    "rv:5":   [150, 290],  // ✕ LOST · COLORADO             (pin 230,182)
  };
  const HUBS = [
    { lon: -83.0, lat: 39.96, x: 420, y: 148, lab: "DESTRUCTION HUB — COLUMBUS OH" },
    { lon: -85.7, lat: 42.75, x: 425, y: 128, lab: "HUB — GRAND RAPIDS MI" },
    { lon: -81.4, lat: 28.4, x: 400, y: 240, lab: "WDS HUB — ORLANDO FL" },
  ];

  function shortLoc(loc) {
    let s = String(loc).split(";")[0].replace(/\s*\([^)]*\)/g, "").trim();
    const parts = s.split(",").map(p => p.trim()).filter(Boolean);
    if (parts.length > 2) s = parts.slice(-2).join(", ");
    return s.length > 26 ? s.slice(0, 24) + "…" : s;
  }

  /* ════════════════════════ VIEW 1 · 3D TIMELINE ════════════════════════ */
  const tlX = y => ((y - 1978) / 50) * 26 - 13;

  function buildTimeline(G) {
    const rows = RPT.players || [];
    const OUT_H = { dead: 1.0, sold: 1.5, licensed: 1.9, operating: 2.6 };
    const OUT_C = { dead: 0x6b7f92, sold: 0xb07a10, licensed: 0x008a6d, operating: 0x2251ff };
    const SHORT = { "MODAR": "MODAR", "Chematur / AquaCat": "CHEMATUR", "HydroProcessing (Harlingen, TX)": "HYDROPROC. TX",
      "Blue Grass program (US Army)": "BLUE GRASS", "Innoveox": "INNOVEOX", "Hanwha (Korea)": "HANWHA",
      "General Atomics PERSES (iSCWO)": "GA PERSES", "Battelle PFAS Annihilator": "BATTELLE",
      "374Water (NASDAQ: SCWO)": "374WATER", "Aquarden (SuperOx)": "AQUARDEN", "Revive Environmental": "REVIVE" };
    const rowsZ = { "Failed or exited": 2.7, "Operating field": -2.7 };
    G.ground(30, 11);
    // cohort chips at floor level, clear of the pillar names above
    // cohort chips: FAILED sits at the left end of the front (casualty) row,
    // nudged up off the year ticks; STILL OPERATING labels the empty left end
    // of the back row so it clears the staggered pillar names above
    G.label("FAILED OR EXITED — THE CASUALTY LIST", "neg", tlX(1983), 0.15, 4.1, 0, -44);
    G.label("STILL OPERATING TODAY", "accent", tlX(1986), 0.15, -2.7, 0, 14);
    Object.keys(rowsZ).forEach(co => {
      const z = rowsZ[co];
      const line = new THREE.Mesh(new THREE.BoxGeometry(26.4, 0.05, 0.05),
        new THREE.MeshBasicMaterial({ color: 0xdbe2ea }));
      line.position.set(0, 0.03, z); G.view.add(line);
    });
    // year ticks along the front edge + the TODAY marker
    // (a 1980 tick clamps onto the left edge at narrow widths and hits 1990)
    [1990, 2000, 2010, 2020].forEach(y => G.label(String(y), "", tlX(y), 0.12, 5.5));
    const today = new THREE.Mesh(new THREE.BoxGeometry(0.07, 3.4, 7.4),
      new THREE.MeshBasicMaterial({ color: 0x2251ff, transparent: true, opacity: 0.22 }));
    today.position.set(tlX(2026), 1.7, 0); G.view.add(today);
    G.animated.push({ obj: today, tick: t => { today.material.opacity = 0.16 + 0.08 * Math.sin(t * 2.2); } });
    G.label("TODAY · 2026", "accent", tlX(2026), 0.15, 4.3, 0, -36);
    // pillars
    rows.forEach((p, i) => {
      const z = rowsZ[p.cohort] || 0;
      const x0 = tlX(p.from), x1 = tlX(Math.min(p.to, 2026));
      const h = OUT_H[p.outcome] || 1.2;
      const col = OUT_C[p.outcome] || 0x6b7f92;
      const g = new THREE.Group(); G.view.add(g);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.35, x1 - x0), h, 1.15),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.55, metalness: 0.15,
          transparent: p.outcome === "dead", opacity: p.outcome === "dead" ? 0.75 : 1 }));
      bar.position.set((x0 + x1) / 2, h / 2, z); g.add(bar);
      if (p.outcome === "dead" || p.outcome === "sold") {
        const x = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 10),
          new THREE.MeshBasicMaterial({ color: 0xc22f4e }));
        x.position.set(x1, h + 0.2, z); g.add(x);
      }
      // traveling year marker along the active span
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff }));
      g.add(dot);
      G.animated.push({ obj: dot, tick: t => {
        const f = (t * 0.12 + i * 0.37) % 1;
        dot.position.set(x0 + (x1 - x0) * f, h + 0.14, z);
      } });
      G.mark(g, "tl:" + i);
      // one chip per entity: short name + active years. All chips in a cohort
      // share one anchor height and stagger in whole chip heights (28 px), so
      // different pillar heights can never cancel the stagger; the operating
      // row has 5 entities, so it needs 5 slots. Both rows anchor names at
      // the bar START (left end) so long bars cannot push chips into each other.
      // Assign slots by rank along x
      // (not cohort order) so pillars standing side by side never sit in
      // adjacent slots. Operating bars all end at "today", so anchor names at
      // the bar START there.
      const op = p.cohort === "Operating field";
      const slot = rows.map((q, qi) => [q, qi]).filter(([q]) => q.cohort === p.cohort)
        .sort((a, b) => tlX(a[0].from) - tlX(b[0].from))
        .findIndex(([, qi]) => qi === i) % (op ? 5 : 3);
      const yr = (p.graded ? "≈" : "") + `${p.from}–${p.to === 2026 ? "today" : p.to}`;
      G.label((SHORT[p.name] || p.name.toUpperCase()) + " · " + yr, p.outcome === "operating" ? "accent" : "",
        x0 - 0.1, op ? 3.25 : 2.35, z, 0, -slot * (op ? 32 : 36));
    });
  }

  function tlDrill(G, key) {
    const p = (RPT.players || [])[+String(key).split(":")[1]];
    if (!p) return null;
    return { title: p.name.toUpperCase(),
      value: `${p.from}–${p.to === 2026 ? "today" : p.to} · ${p.out}`,
      sub: p.note, source: KLINK(p.src) };
  }

  function timelineTable() {
    return tableHtml(["Entity", "Active", "Outcome", "The lesson", "Sources"],
      (RPT.players || []).map(p => [
        `<b>${esc(p.name)}</b>${p.graded ? " <span class='c3d-graded'>dates graded</span>" : ""}`,
        `${p.from}–${p.to === 2026 ? "today" : p.to}`, esc(p.out), esc(p.note), KLINK(p.src)]),
      "RPT.players · field census " + KLINK(RPT.field_stats ? RPT.field_stats.src : []));
  }

  /* ════════════════════════ VIEW 2 · DEAL-SIZE LANDSCAPE ════════════════════════ */
  const SG_DOM = () => RPT.scalegap.domain;
  const sgX = v => {
    const d = SG_DOM();
    return ((Math.log10(v) - Math.log10(d[0])) / (Math.log10(d[1]) - Math.log10(d[0]))) * 26 - 13;
  };

  function buildScale(G) {
    const SG = RPT.scalegap;
    G.ground(30, 14);
    // ── the blue zone: sub-$1M, no SCWO competitor sells here ──
    const zx0 = sgX(SG.domain[0]), zx1 = sgX(SG.zoneMax);
    const zone = new THREE.Mesh(new THREE.BoxGeometry(zx1 - zx0, 2.3, 11.6),
      new THREE.MeshBasicMaterial({ color: 0x2251ff, transparent: true, opacity: 0.10, depthWrite: false }));
    zone.position.set((zx0 + zx1) / 2, 1.15, 0); G.view.add(zone);
    G.mark(zone, "sg:zone");
    G.animated.push({ obj: zone, tick: t => { zone.material.opacity = 0.08 + 0.05 * Math.sin(t * 1.8); } });
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.6, 11.6),
      new THREE.MeshBasicMaterial({ color: 0x2251ff }));
    edge.position.set(zx1, 1.3, 0); G.view.add(edge);
    G.label("NO SCWO COMPETITOR SELLS HERE — THE SUB-$1M ZONE", "accent", (zx0 + zx1) / 2, 3.4, -1.5);

    const SHORT_LAB = { w374: "EQUIPMENT $4.9M+", ga: "3 GAL/MIN · PROGRAM SCALE", aq: "5 T/D · ~$2–10M", rv: "SERVICE $0.67–16.6M", hcsp: "SOLD & SELF-OPERATED" };
    // ── lanes ──
    SG.lanes.forEach((lane, li) => {
      const z = (li - 2) * 2.35;
      const guide = new THREE.Mesh(new THREE.BoxGeometry(26.4, 0.04, 0.04),
        new THREE.MeshBasicMaterial({ color: 0xe3e9f0 }));
      guide.position.set(0, 0.02, z); G.view.add(guide);
      G.label(lane.name.toUpperCase(), lane.kind === "hcsp" ? "accent" : "", -13.2, 1.0, z);

      if (lane.ghost) {
        const gh = new THREE.Mesh(new THREE.BoxGeometry(sgX(lane.ghost.to) - sgX(lane.ghost.from), 0.5, 1.15),
          new THREE.MeshStandardMaterial({ color: 0x8fa0b3, transparent: true, opacity: 0.3, roughness: 0.8 }));
        gh.position.set((sgX(lane.ghost.from) + sgX(lane.ghost.to)) / 2, 0.25, z);
        G.view.add(gh); G.mark(gh, "sg:" + li);
        G.label("PILOTS ONLY (SERVICE)", "", sgX(lane.ghost.to) - 1.63, 0.85, z, 0, -32);
      }
      const b = lane.bar;
      const w = sgX(b.to) - sgX(b.from);
      let bar;
      if (lane.kind === "hollow") {
        bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.55, 1.15),
          new THREE.MeshStandardMaterial({ color: 0xb07a10, transparent: true, opacity: 0.16, roughness: 0.7 }));
        const eg = new THREE.LineSegments(new THREE.EdgesGeometry(bar.geometry),
          new THREE.LineBasicMaterial({ color: 0xb07a10 }));
        bar.add(eg);
      } else if (lane.kind === "hatch") {
        bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.55, 1.15),
          new THREE.MeshStandardMaterial({ color: 0x42566a, transparent: true, opacity: 0.55, roughness: 0.7 }));
        const wire = new THREE.Mesh(bar.geometry,
          new THREE.MeshBasicMaterial({ color: 0x42566a, wireframe: true, transparent: true, opacity: 0.5 }));
        bar.add(wire);
      } else {
        bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.55, 1.15),
          new THREE.MeshStandardMaterial({ color: lane.kind === "hcsp" ? 0x2251ff : 0x42566a, roughness: 0.5, metalness: 0.2 }));
      }
      bar.position.set((sgX(b.from) + sgX(b.to)) / 2, 0.28, z);
      G.view.add(bar); G.mark(bar, "sg:" + li);
      if (lane.kind !== "hcsp") {
        // adjacent lanes sit ~11 px apart on screen — alternate the bar chips
        // above/below the lane line so neighbours can never touch
        G.label((SHORT_LAB[lane.id] || b.lab).toUpperCase(), "", (sgX(b.from) + sgX(b.to)) / 2, 0.95, z, 0, li % 2 ? 20 : -20);
        // moving marker along the served span
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff }));
        G.view.add(dot);
        G.animated.push({ obj: dot, tick: t => {
          const f = (t * 0.1 + li * 0.29) % 1;
          dot.position.set(sgX(b.from) + w * f, 0.66, z);
        } });
      } else {
        G.label(SHORT_LAB.hcsp, "accent", (sgX(b.from) + sgX(b.to)) / 2, 0.95, z, 0, 40);
      }
    });

    // ── axis ticks along the front; facility landmarks along the back ──
    [[0.1, "$0.1M"], [1, "$1M"], [10, "$10M"], [100, "$100M"]].forEach(([v, t]) =>
      G.label(t, v === 1 ? "accent" : "", sgX(v), 0.14, 6.4));
    [[0.2, "SMALL FARM", -30], [1.8, "MID INDUSTRIAL", -52], [18, "MUNICIPAL UTILITY", 0], [70, "NATIONAL PROGRAM", -36]]
      .forEach(([v, t, dy]) => G.label(t, "", sgX(v), 2.5, -5.8, 0, dy));
    G.label("DEAL SIZE, $M · LOG SCALE →", "", 0, 0.12, 8.8);
  }

  function sgDrill(G, key) {
    const SG = RPT.scalegap;
    const id = String(key).split(":")[1];
    const lane = id === "zone" ? SG.lanes.find(l => l.kind === "hcsp") : SG.lanes[+id];
    if (!lane || !lane.drill) return null;
    return { title: lane.drill.title, value: lane.drill.value, sub: lane.drill.sub, source: KLINK(lane.src) };
  }

  function scaleTable() {
    const SG = RPT.scalegap;
    const kindTxt = { split: "Equipment sale + crewed service pilots (dashed)", hatch: "Government / national-program business (hatched)", solid: "Industrial unit, sold or leased", hollow: "Centralized service — never a sold unit", hcsp: "Sold & self-operated — the opening" };
    const rows = SG.lanes.map(l => [
      `<b>${esc(l.name)}</b>`, esc(kindTxt[l.kind] || l.kind),
      esc(l.bar.lab + (l.ghost ? " · pilots: " + l.ghost.lab : "")),
      `$${l.bar.from}M – $${l.bar.to}M`, KLINK(l.src)]);
    rows.push(["<b>Sub-$1M zone</b>", "Unserved by all four SCWO operators",
      "No product to buy and no service door below ≈$1M", "$0 – $1M", KLINK(["K166"])]);
    return tableHtml(["Competitor", "Offering type", "Smallest evidenced offering", "Deal-size range", "Sources"], rows,
      "RPT.scalegap · " + KLINK(["K151", "K153", "K156", "K160", "K163", "K166"]));
  }

  /* ════════════════════════ VIEW 3 · 3D VENDOR PANELS ════════════════════════ */
  const PANEL_FLOOR = { w374: 4.9, ga: 5, aq: 2, rv: 0.67, hcsp: 0 };
  const TONE_C = { bad: 0xc22f4e, mid: 0xb07a10, ok: 0x008a6d, verdict: 0x2251ff };
  const TONE_TXT = { bad: "WEAK BALANCE SHEET", mid: "MIXED RECORD", ok: "STRONG BALANCE SHEET" };

  function buildPanels(G) {
    const profs = RPT.comp_profiles || [];
    G.ground(26, 8);
    profs.forEach((p, i) => {
      const x = (i - (profs.length - 1) / 2) * 5.1;
      const floor = PANEL_FLOOR[p.id] || 2;
      const podH = Math.max(0.3, 0.5 + Math.log10(floor) * 0.9);
      const fin = p.rows[0] || {};
      const tone = TONE_C[fin.tone] || 0x42566a;
      const g = new THREE.Group(); g.position.x = x; G.view.add(g);

      // podium = where this vendor's smallest offering starts on the deal axis
      const pod = new THREE.Mesh(new THREE.BoxGeometry(3.3, podH, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x8fa0b3, roughness: 0.7, metalness: 0.15 }));
      pod.position.y = podH / 2; g.add(pod);
      // floor chips alternate between two heights (whole-chip stagger) so
      // neighbouring podiums can never throw their chips into each other
      G.label("FLOOR ≈ $" + floor + "M", "", x, podH + 0.32, 1.5, 0, (i % 2) ? -26 : 0);

      // the panel itself, gently bobbing
      const card = new THREE.Group(); card.position.y = podH; g.add(card);
      const bodyM = new THREE.Mesh(new THREE.BoxGeometry(3.1, 3.0, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xf2f5f9, roughness: 0.55, metalness: 0.1 }));
      bodyM.position.y = 1.9; card.add(bodyM);
      const band = new THREE.Mesh(new THREE.BoxGeometry(3.14, 0.5, 0.54),
        new THREE.MeshStandardMaterial({ color: tone, roughness: 0.45, metalness: 0.2 }));
      band.position.y = 3.15; card.add(band);
      // five record rows as stacked slats on the panel face
      p.rows.forEach((r, ri) => {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.34, 0.1),
          new THREE.MeshStandardMaterial({ color: TONE_C[r.tone] || 0x42566a, roughness: 0.6 }));
        slat.position.set(0, 2.62 - ri * 0.44, 0.3); card.add(slat);
        G.mark(slat, "vp:" + i + ":" + ri);
      });
      G.mark(bodyM, "vp:" + i); G.mark(band, "vp:" + i);
      G.animated.push({ obj: card, tick: t => {
        card.position.y = podH + 0.12 + 0.1 * Math.sin(t * 0.9 + i * 1.7);
        card.rotation.y = 0.06 * Math.sin(t * 0.5 + i);
      } });

      // name chip rides above the tone chip with px clearance (their world
      // anchors are only ~0.45 apart ≈ half a chip height); short forms match
      // the timeline chips so neighbouring panels cannot collide
      const PANEL_SHORT = { ga: "GA PERSES", rv: "REVIVE", hcsp: "HCSP" };
      G.label(PANEL_SHORT[p.id] || p.name.toUpperCase(), "", x, podH + 3.85, 0, 0, -28);
      // tone chips ride low (clear of the name chips above) and alternate
      // between two heights so adjacent panels' chips stay separated too
      G.label(TONE_TXT[fin.tone] || "PROFILE", fin.tone === "bad" ? "neg" : fin.tone === "ok" ? "cool" : "heat",
        x, podH + 3.4, 0, (i % 2) * 30, 18 + (i % 2) * 24);
    });
    G.label("PANEL HEIGHT OFF THE FLOOR = WHERE THEIR SMALLEST OFFERING STARTS", "", 0, 0.12, 4.4);
  }

  function vpDrill(G, key) {
    const parts = key.split(":");
    const p = RPT.comp_profiles[+parts[1]];
    if (!p) return null;
    if (parts.length === 3) {
      const r = p.rows[+parts[2]];
      return { title: r.drill.title, value: r.drill.value, sub: r.drill.sub, source: KLINK(r.src) };
    }
    return { title: p.name.toUpperCase(), value: p.form,
      sub: p.rows.map(r => r.lab + ": " + r.txt).join("  ·  "),
      source: KLINK(p.rows[0].src) };
  }

  function panelsTable() {
    const rows = [];
    (RPT.comp_profiles || []).forEach(p => p.rows.forEach(r =>
      rows.push([`<b>${esc(p.name)}</b>`, esc(r.lab), esc(r.txt), KLINK(r.src)])));
    return tableHtml(["Company", "Dimension", "What the record shows", "Sources"], rows,
      "RPT.comp_profiles · " + KLINK(["K151", "K155", "K159", "K162"]));
  }

  /* ════════════════════════ VIEW 4 · CUSTOMER MAP — REAL GEOGRAPHY ════════════════════════ */
  // 2D geographic map on the vendored Natural Earth world atlas (topojson).
  // Pins are projected from true [lon, lat] coordinates — no floating pins,
  // no 3D plane. Largest/smallest chips, ✕ failed/lost sites, region coverage
  // tiles (verified vs marketing claims) + the coverage matrix below the map,
  // and a sortable DOM table behind ▦ TABLE VIEW.

  function coverageMatrixHtml() {
    const GM = RPT.geo_matrix;
    return `<h3 class='c3d-th'>Region coverage — verified presence vs marketing claims</h3>
      <div class="table-scroll"><table class="dt c3d-dt c3d-geo"><thead><tr><th>Company</th>${GM.cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${GM.rows.map((row, ri) => `<tr><td><b>${esc(row.co)}</b></td>${row.cells.map((c, ci) => {
        const m = GEO_MARKER[c.m] || ["#5b6f82", c.m];
        return `<td data-r="${ri}" data-c="${ci}"><span class="c3d-mcell" style="border-left:4px solid ${m[0]}"><b>${m[1]}</b> — ${esc(c.txt)}</span></td>`;
      }).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="chart-src c3d-tfoot">${esc(GM.note)} · ${KLINKD(GM.src)}</p>`;
  }

  function wireGeoMatrix(scope) {
    scope.querySelectorAll(".c3d-geo td[data-r]").forEach(td => {
      td.style.cursor = "pointer";
      td.setAttribute("data-drill-keep", "");
      td.tabIndex = 0;
      td.addEventListener("click", e => {
        const d = gmDrill(null, "gm:" + td.dataset.r + ":" + td.dataset.c);
        if (d && window.U && U.showDrill) U.showDrill({ ...d, x: e.clientX, y: e.clientY });
      });
    });
  }

  function renderGeoMap(box) {
    box.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "geomap";
    box.appendChild(wrap);
    if (!window.d3 || !window.topojson || !window.WORLD110) {
      wrap.innerHTML = "<p class='c3d-nowebgl'>The geographic library did not load — the same data is available behind the ▦ TABLE VIEW button.</p>";
      return;
    }
    const W = 1000, H = 540;
    const svg = d3.select(wrap).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("role", "img")
      .attr("aria-label", "World map with the verified customer locations of the four SCWO operators plotted at their true coordinates");
    const world = window.WORLD110;
    const countries = topojson.feature(world, world.objects.countries);
    // drop Antarctica (id 010) so the frame tightens on the inhabited world
    countries.features = countries.features.filter(f => String(f.id) !== "010");
    const proj = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], countries);
    const path = d3.geoPath(proj);
    svg.append("path").attr("class", "geomap-grat").attr("d", path(d3.geoGraticule10()));
    svg.append("path").attr("class", "geomap-land").attr("d", path(countries));
    svg.append("path").attr("class", "geomap-frame").attr("d", path({ type: "Sphere" }));
    const P = ll => proj(ll);

    // ── region labels + verified-vs-marketing coverage tiles ──
    const compIds = ["w374", "ga", "aq", "rv"];
    const GM = RPT.geo_matrix;
    GM.cols.forEach((colName, ci) => {
      const ll = MAP_REGIONS[colName]; if (!ll) return;
      const lab = REG_LAB[colName] || P(ll);
      svg.append("text").attr("class", "geomap-lab region")
        .attr("x", lab[0]).attr("y", lab[1]).attr("text-anchor", "middle")
        .text(colName.toUpperCase());
      const [x, y] = P(ll);
      compIds.forEach((cid, ri) => {
        const cell = GM.rows[ri] && GM.rows[ri].cells[ci];
        if (!cell || cell.m === "no") return;
        const col = GEO_MARKER[cell.m] ? GEO_MARKER[cell.m][0] : "#5b6f82";
        svg.append("rect")
          .attr("class", "geomap-tile")
          .attr("x", x - 22 + ri * 12).attr("y", y + 8)
          .attr("width", 10).attr("height", 10).attr("rx", 2)
          .attr("fill", col)
          .attr("opacity", cell.m === "mkt" ? 0.35 : cell.m === "ann" ? 0.6 : 1)
          .on("click", e => {
            const d = gmDrill(null, "gm:" + ri + ":" + ci);
            if (d && window.U && U.showDrill) U.showDrill({ ...d, x: e.clientX, y: e.clientY });
          });
      });
    });

    // ── customer pins at true coordinates ──
    const pinLayer = svg.append("g");
    const labLayer = svg.append("g");
    const flagged = [];
    (RPT.cust_tables || []).forEach(tbl => {
      const pins = MAP_PINS[tbl.id] || {};
      tbl.rows.forEach((r, ri) => {
        const ll = pins[ri]; if (!ll) return; // no verifiable point → table-only
        const [x, y] = P(ll);
        const xs = X_STATUS[tbl.id] && X_STATUS[tbl.id][ri];
        const col = xs ? "#9aa8b5" : COMP_CSS[tbl.id];
        const rad = r.flag === "largest" ? 6.5 : r.flag === "smallest" ? 5.5 : 4.5;
        pinLayer.append("circle")
          .attr("class", "geomap-pin" + (xs ? " dead" : ""))
          .attr("cx", x).attr("cy", y).attr("r", rad)
          .attr("fill", col)
          .attr("stroke", r.flag ? "#051c2c" : "#fff")
          .attr("stroke-width", r.flag ? 1.8 : 1.2)
          .on("click", e => {
            const d = pinDrill(null, "pin:" + tbl.id + ":" + ri);
            if (d && window.U && U.showDrill) U.showDrill({ ...d, x: e.clientX, y: e.clientY });
          });
        if (xs) labLayer.append("text").attr("class", "geomap-x")
          .attr("x", x + 6).attr("y", y - 6).text("✕");
        if (r.flag || xs) flagged.push({ tbl, r, ri, x, y, xs });
      });
    });
    function addLab(x, y, txt, cls) {
      labLayer.append("text").attr("class", "geomap-lab " + cls)
        .attr("x", x).attr("y", y).attr("text-anchor", "middle").text(txt);
    }
    function addLeader(px, py, lx, ly) {
      labLayer.append("line")
        .attr("x1", px).attr("y1", py).attr("x2", lx).attr("y2", ly + 4)
        .attr("stroke", "#8ea2b5").attr("stroke-width", 0.8).attr("opacity", 0.85)
        // leader lines are decoration only — dead-center clicks on a flagged
        // pin must hit the pin, not the line drawn from the pin to its flag
        .attr("pointer-events", "none");
    }
    // largest / smallest flags + failed-or-lost status chips, hand-placed in
    // the empty ocean margins (PIN_LAB2D) with leader lines back to the pins
    flagged.forEach(p => {
      const key = p.tbl.id + ":" + p.ri;
      const fl = PIN_LAB2D[key];
      if (p.r.flag && fl) {
        addLeader(p.x, p.y, fl[0], fl[1]);
        addLab(fl[0], fl[1],
          (p.r.flag === "largest" ? "▲ LARGEST · " : "▽ SMALLEST · ") + shortLoc(p.r.loc).toUpperCase(),
          p.r.flag === "largest" ? "flag-hi" : "flag-lo");
      }
      if (p.xs) {
        const xl = PIN_LAB2D[key + "x"] || (!p.r.flag ? fl : null);
        if (xl) {
          addLeader(p.x, p.y, xl[0], xl[1]);
          addLab(xl[0], xl[1], "✕ " + p.xs + " · " + shortLoc(p.r.loc).toUpperCase(), "dead");
        }
      }
    });
    // hub markers
    HUBS.forEach(h => {
      const [px, py] = P([h.lon, h.lat]);
      addLeader(px, py, h.x, h.y);
      addLab(h.x, h.y, h.lab, "flag-lo");
    });

    // ── legend + hint + coverage matrix ──
    const legend = document.createElement("p");
    legend.className = "geomap-legend";
    legend.innerHTML = compIds.map(id => {
      const t = (RPT.cust_tables || []).find(t => t.id === id);
      return `<span><b style="color:${COMP_CSS[id]}">●</b> ${esc(t ? t.company : id)}</span>`;
    }).join("")
      + `<span><b class="geomap-lab flag-hi">▲</b>/<b>▽</b> largest / smallest disclosed</span>`
      + `<span><b style="color:#c22f4e">✕</b> failed / lost site</span>`
      + `<span><b>■</b> region tiles = coverage: solid verified operating · demo · announced · faint = marketing claim (rows: 374Water · GA · Aquarden · Revive)</span>`;
    wrap.appendChild(legend);
    const hint = document.createElement("p");
    hint.className = "geomap-hint chart-sub";
    hint.textContent = "REAL GEOGRAPHY — VENDORED NATURAL EARTH WORLD ATLAS · CLICK A PIN FOR THE ENGAGEMENT · CLICK A TILE FOR THE REGION VERDICT · ROWS WITH NO VERIFIABLE POINT LOCATION STAY TABLE-ONLY (▦ TABLE VIEW)";
    wrap.appendChild(hint);
    const mx = document.createElement("div");
    mx.innerHTML = coverageMatrixHtml();
    wrap.appendChild(mx);
    wireGeoMatrix(mx);
  }

  // ── sortable DOM table alternative: one combined register across operators ──
  function mapTable() {
    const rows = [];
    (RPT.cust_tables || []).forEach(tbl => tbl.rows.forEach(r => rows.push({ tbl, r })));
    let out = "<h3 class='c3d-th'>Named customers, hosts, and programs — click a header to sort</h3>"
      + `<div class="table-scroll"><table class="dt c3d-dt c3d-sort" id="c3d-cust-table"><thead><tr>${["Company", "Customer / program", "Location", "Type", "Value", "Status", "Sources"].map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>`
      + rows.map(({ tbl, r }, i) => `<tr data-i="${i}">
          <td><b>${esc(tbl.company)}</b></td>
          <td>${esc(r.cust)}${r.flag ? ` <span class="flag-chip ${r.flag}">${r.flag === "largest" ? "LARGEST" : "SMALLEST"}</span>` : ""}</td>
          <td>${esc(r.loc)}</td><td>${esc(r.type)}</td><td>${esc(r.value)}</td><td>${esc(r.status)}</td>
          <td>${KLINKD(r.src)}</td></tr>`).join("")
      + `</tbody></table></div>
      <p class="chart-src c3d-tfoot">Rows with no verifiable point location appear here only, by design · click a row for the full engagement with dated sources</p>`;
    out += coverageMatrixHtml();
    return out;
  }

  function wireMapTable(scope) {
    wireGeoMatrix(scope);
    const table = scope.querySelector("#c3d-cust-table");
    if (!table) return;
    const rows = [];
    (RPT.cust_tables || []).forEach(tbl => tbl.rows.forEach(r => rows.push({ tbl, r })));
    // row drills (with dated source links)
    table.querySelectorAll("tbody tr[data-i]").forEach(tr => {
      const { tbl, r } = rows[+tr.dataset.i];
      tr.style.cursor = "pointer";
      tr.setAttribute("data-drill-keep", "");
      tr.tabIndex = 0;
      tr.addEventListener("click", e => {
        if (!window.U || !U.showDrill) return;
        U.showDrill({
          title: (tbl.company + " — " + shortLoc(r.loc)).toUpperCase(),
          value: r.value + (r.flag === "largest" ? " · largest disclosed" : r.flag === "smallest" ? " · smallest disclosed" : ""),
          sub: r.cust + " · " + r.loc + ". Status: " + r.status + ". " + r.caveat,
          source: KLINK(r.src), x: e.clientX, y: e.clientY,
        });
      });
    });
    // click-to-sort (numeric-aware: $4,880,000 · $812K · $16.6M)
    const keyOf = td => {
      const t = (td.textContent || "").replace(/\s+/g, " ").trim();
      if (!t || t === "—" || t === "–") return { o: 2, v: "" };
      const m = t.replace(/,/g, "").match(/\d+(?:\.\d+)?\s*([KMB])\b/i) || t.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
      if (m) {
        let v = parseFloat(m[0]);
        const u = (m[1] || "").toUpperCase();
        v *= u === "K" ? 1e3 : u === "M" ? 1e6 : u === "B" ? 1e9 : 1;
        return { o: 0, v };
      }
      return { o: 1, v: t.toLowerCase() };
    };
    let sortCol = -1, sortDir = 1;
    table.querySelectorAll("thead th").forEach((th, ci) => {
      th.tabIndex = 0;
      th.setAttribute("aria-sort", "none");
      const arrow = document.createElement("span");
      arrow.className = "c3d-arrow"; arrow.setAttribute("aria-hidden", "true");
      th.appendChild(arrow);
      const act = () => {
        if (sortCol === ci) sortDir *= -1; else { sortCol = ci; sortDir = 1; }
        const body = table.tBodies[0];
        const rs = [...body.rows].map((tr, i) => ({ tr, i, k: keyOf(tr.cells[ci]) }));
        rs.sort((a, b) => {
          const A = a.k, B = b.k;
          const c = A.o !== B.o ? A.o - B.o : A.o === 0 ? A.v - B.v : String(A.v).localeCompare(String(B.v), undefined, { numeric: true });
          return c * sortDir || a.i - b.i;
        });
        const frag = document.createDocumentFragment();
        rs.forEach(r => frag.appendChild(r.tr));
        body.appendChild(frag);
        table.querySelectorAll("thead th").forEach((h, i) => {
          h.setAttribute("aria-sort", i === ci ? (sortDir > 0 ? "ascending" : "descending") : "none");
          const a = h.querySelector(".c3d-arrow");
          if (a) a.textContent = i === ci ? (sortDir > 0 ? "▲" : "▼") : "";
        });
      };
      th.addEventListener("click", act);
      th.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
    });
  }

  function pinDrill(G, key) {
    const [, cid, ri] = key.split(":");
    const tbl = (RPT.cust_tables || []).find(t => t.id === cid);
    const r = tbl && tbl.rows[+ri];
    if (!r) return null;
    return { title: (tbl.company + " — " + shortLoc(r.loc)).toUpperCase(),
      value: r.value + (r.flag === "largest" ? " · largest disclosed" : r.flag === "smallest" ? " · smallest disclosed" : ""),
      sub: r.cust + " · " + r.loc + ". Status: " + r.status + ". " + r.caveat,
      source: KLINK(r.src) };
  }

  function gmDrill(G, key) {
    const [, ri, ci] = key.split(":");
    const GM = RPT.geo_matrix;
    const row = GM.rows[+ri], cell = row && row.cells[+ci];
    if (!cell) return null;
    const m = GEO_MARKER[cell.m] || ["#5b6f82", cell.m.toUpperCase()];
    return { title: (row.co + " · " + GM.cols[+ci]).toUpperCase(),
      value: m[1] + (cell.txt && cell.txt !== "—" ? " · " + cell.txt : ""),
      sub: cell.note, source: KLINK(cell.src) };
  }

  /* ════════════════════════ shared DOM table helper ════════════════════════ */
  function tableHtml(cols, rows, foot) {
    return `<div class="table-scroll"><table class="dt c3d-dt"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      ${foot ? `<p class="chart-src c3d-tfoot">${foot}</p>` : ""}`;
  }

  /* ════════════════════════ view registry ════════════════════════
     Views with `dom` default to the clean js/chart_other.js component; the
     3D scene stays available behind the "◈ 3D VIEW" toggle. */
  const VIEWS = {
    timeline: { tab: "WHO SURVIVED · TIMELINE", hint: "DRAG TO ORBIT · SCROLL TO ZOOM · CLICK A PILLAR FOR ITS FATE + LESSON",
      build: buildTimeline, drill: tlDrill, table: timelineTable,
      dom: "destiny",
      cam: [0, 8.5, 21], tgt: [0, 0.9, 0],
      foot: "RPT.players · field census " + "— sources " },
    scale: { tab: "THE SCALE GAP · DEAL SIZES", hint: "DRAG TO ORBIT · SCROLL TO ZOOM · CLICK A LANE OR THE BLUE ZONE",
      build: buildScale, drill: sgDrill, table: scaleTable,
      dom: "scalegap",
      cam: [0, 9, 18.5], tgt: [0, 0.5, 0], foot: "" },
    panels: { tab: "VENDOR PANELS", hint: "DRAG TO ORBIT · CLICK A PANEL FOR THE FULL PROFILE · CLICK A SLAT FOR ONE RECORD",
      build: buildPanels, drill: vpDrill, table: panelsTable,
      cam: [0, 6.5, 14.5], tgt: [0, 2.0, 0], foot: "" },
    map: { tab: "CUSTOMER MAP", hint: "",
      domFn: renderGeoMap, table: mapTable, wireTable: wireMapTable, foot: "" },
  };

  /* ════════════════════════ render(hostEl) ════════════════════════ */
  function render(hostEl) {
    if (!hostEl) return null;
    // 3D is optional for the two DOM-default views: with ChartOther present the
    // module still works (clean timeline / scale-gap + tables) without THREE.
    if (!window.RPT || (!window.THREE && !window.ChartOther)) { console.warn("Comp3D: needs js/data.js + vendor/three.min.js or js/chart_other.js first"); return null; }
    hostEl.classList.add("sc3d-wrap", "c3d-wrap");

    // ── DOM: tab bar + stage + clean-component container + table container ──
    const tabs = document.createElement("div");
    tabs.className = "c3d-tabs"; tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Competitive intelligence views");
    tabs.innerHTML = Object.keys(VIEWS).map(k =>
      `<button type="button" role="tab" data-v="${k}" aria-selected="false">${VIEWS[k].tab}</button>`).join("") +
      `<span class="c3d-spacer"></span>
       <button type="button" class="c3d-ctl" data-ctl="view3d" aria-pressed="false" hidden>◈ 3D VIEW</button>
       <button type="button" class="c3d-ctl" data-ctl="pause" aria-pressed="true">▶ PLAY</button>
       <button type="button" class="c3d-ctl" data-ctl="table" aria-pressed="false">▦ TABLE VIEW</button>`;
    hostEl.appendChild(tabs);

    const stageCol = document.createElement("div");
    stageCol.className = "sc3d-stage-col c3d-stage-col";
    hostEl.appendChild(stageCol);
    const canvas = document.createElement("canvas");
    canvas.className = "sc3d-stage c3d-stage";
    canvas.setAttribute("aria-label", "Interactive 3D competitive-intelligence view. Use the TABLE VIEW button for the same data as a table.");
    stageCol.appendChild(canvas);
    const hint = document.createElement("p");
    hint.className = "sc3d-hint"; stageCol.appendChild(hint);
    const domBox = document.createElement("div");
    domBox.className = "c3d-dom"; domBox.hidden = true; hostEl.appendChild(domBox);
    const tableBox = document.createElement("div");
    tableBox.className = "c3d-table"; tableBox.hidden = true; hostEl.appendChild(tableBox);

    // ── renderer ──
    let renderer = null, webglDead = false;
    if (!window.THREE) webglDead = true;
    else {
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch (e) { webglDead = true; }
      if (!renderer || !renderer.getContext()) webglDead = true;
    }
    if (webglDead) {
      // No WebGL: clean DOM components where available, tables otherwise.
      stageCol.innerHTML = "<p class='c3d-nowebgl'>WebGL is unavailable in this browser — showing the clean views and data tables instead.</p>";
      tableBox.hidden = false;
      function fallbackShow(k) {
        const V = VIEWS[k] || VIEWS.timeline;
        tableBox.innerHTML = "";
        if (V.domFn) { const d = document.createElement("div"); tableBox.appendChild(d); V.domFn(d); }
        else if (V.dom && window.ChartOther) window.ChartOther.render(tableBox, { panels: [V.dom] });
        else { tableBox.innerHTML = V.table(); if (V.wireTable) V.wireTable(tableBox); }
      }
      fallbackShow("timeline");
      tabs.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
        tabs.querySelectorAll("[data-v]").forEach(x => x.setAttribute("aria-selected", "false"));
        b.setAttribute("aria-selected", "true");
        fallbackShow(b.dataset.v);
      }));
      tabs.querySelectorAll('[data-ctl]').forEach(b => b.remove());
      tabs.querySelector("[data-v]").setAttribute("aria-selected", "true");
      tabs.querySelector("[data-v]").classList.add("on");
      return { view: () => "table-fallback" };
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.HCSP_DPR_CAP || 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
    const sun = new THREE.DirectionalLight(0xffffff, 0.75);
    sun.position.set(6, 12, 8); scene.add(sun);
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    // (orbit speed 0.55 applied time-based in frame(), not via autoRotate)
    controls.minDistance = 5; controls.maxDistance = 42;
    controls.maxPolarAngle = Math.PI * 0.52;

    // ambient particle field (continuous motion, all views)
    const P = 140, pGeo = new THREE.BufferGeometry(), pArr = new Float32Array(P * 3);
    for (let i = 0; i < P; i++) {
      pArr[i * 3] = (Math.random() - 0.5) * 30;
      pArr[i * 3 + 1] = 0.3 + Math.random() * 6.5;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0x8fa0b3, size: 0.07, transparent: true, opacity: 0.55 }));
    scene.add(particles);

    // ── per-view state + group helpers ──
    let viewG = null, labels = [], clickable = [], animated = [];
    const G = {
      view: null, animated,
      ground(w, d) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d),
          new THREE.MeshStandardMaterial({ color: 0xf7f9fc, roughness: 0.95 }));
        m.position.y = -0.07; G.view.add(m);
        const rim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 0.05, d + 0.5),
          new THREE.MeshStandardMaterial({ color: 0xdbe2ea, roughness: 0.9 }));
        rim.position.y = -0.12; G.view.add(rim);
      },
      mark(obj, key) { obj.traverse(o => { if (o.isMesh || o.isLine) { o.userData.c3k = key; if (o.isMesh) clickable.push(o); } }); },
      label(text, cls, x, y, z, dx, dy) {
        const el = document.createElement("div");
        el.className = "sc3d-label c3d-label" + (cls ? " " + cls : "");
        el.textContent = text;
        el.style.transform = "translate(-50%,-115%)";
        stageCol.appendChild(el);
        labels.push({ el, v: new THREE.Vector3(x, y, z), dx: dx || 0, dy: dy || 0 });
      },
    };

    function clearView() {
      if (viewG) { scene.remove(viewG); viewG = null; }
      labels.forEach(L => L.el.remove()); labels = [];
      clickable = []; animated.length = 0;
      G.animated = animated;
    }

    let curView = null, paused = true, tableMode = false, domMode = false; // paused on load per owner directive — static frame until ▶ PLAY
    const domBoxes = {};   // view name → its own container (ChartOther.render clears its host)
    const domPref = {};    // view name → false once the owner picks the 3D scene
    const pauseBtn = tabs.querySelector('[data-ctl="pause"]');
    const tableBtn = tabs.querySelector('[data-ctl="table"]');
    const view3dBtn = tabs.querySelector('[data-ctl="view3d"]');
    function showView(name) {
      if (!VIEWS[name]) name = "timeline";
      curView = name;
      const V = VIEWS[name];
      domMode = !!((V.domFn || (V.dom && window.ChartOther)) && domPref[name] !== false);
      // reset the table swap when entering a clean DOM view (the component
      // carries its own Chart/Table toggle)
      if (domMode && tableMode) {
        tableMode = false;
        tableBtn.innerHTML = "▦ TABLE VIEW";
        tableBtn.setAttribute("aria-pressed", "false");
        tableBox.hidden = true;
      }
      tabs.querySelectorAll("[data-v]").forEach(b => {
        const on = b.dataset.v === name;
        b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on));
      });
      view3dBtn.hidden = !(V.dom && window.ChartOther);
      if (domMode) {
        clearView();
        stageCol.style.display = "none";
        pauseBtn.style.display = "none";
        tableBtn.style.display = V.table ? "" : "none";   // map keeps its sortable-table alternative
        view3dBtn.innerHTML = "◈ 3D VIEW";
        view3dBtn.setAttribute("aria-pressed", "false");
        domBox.hidden = tableMode;                        // table toggle swaps map ↔ table
        Object.keys(domBoxes).forEach(k => { domBoxes[k].hidden = k !== name; });
        if (!domBoxes[name]) {
          const box = document.createElement("div");
          domBox.appendChild(box);
          if (V.domFn) V.domFn(box);
          else window.ChartOther.render(box, { panels: [V.dom] });
          domBoxes[name] = box;
        }
        dirty = false;
        return; // no 3D scene to animate in this view
      }
      domBox.hidden = true;
      stageCol.style.display = "";
      pauseBtn.style.display = ""; tableBtn.style.display = "";
      if (V.dom && window.ChartOther) {
        view3dBtn.innerHTML = "▲ CLEAN VIEW";
        view3dBtn.setAttribute("aria-pressed", "true");
      }
      clearView();
      viewG = new THREE.Group(); scene.add(viewG);
      G.view = viewG;
      V.build(G);
      camera.position.set.apply(camera.position, V.cam);
      controls.target.set.apply(controls.target, V.tgt);
      controls.update();
      hint.textContent = V.hint;
      if (tableMode) { tableBox.innerHTML = V.table(); if (V.wireTable) V.wireTable(tableBox); }
      dirty = true; poke();
    }

    // ── click-for-detail (click, not drag) ──
    // NB: this must run on "click", not "pointerup": utils.js hides the drill
    // card from a capture-phase document click listener, so a card opened on
    // pointerup would be closed again by the very same user click. On click,
    // the capture hide runs first and this show wins.
    const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2();
    let downAt = null;
    canvas.addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY]; });
    canvas.addEventListener("click", e => {
      if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) { downAt = null; return; }
      downAt = null;
      const r = canvas.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(clickable, false)[0];
      if (!hit || hit.object.userData.c3k == null) return;
      let d = null;
      try { d = VIEWS[curView].drill(G, hit.object.userData.c3k); } catch (err) { d = null; }
      if (d && window.U && U.showDrill)
        U.showDrill({ title: d.title, value: d.value, sub: d.sub, source: d.source, x: e.clientX, y: e.clientY });
    });

    // ── controls: tabs, 3D toggle, pause, table toggle ──
    tabs.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
      if (window.U && U.hideDrill) U.hideDrill();
      showView(b.dataset.v);
    }));
    view3dBtn.addEventListener("click", () => {
      domPref[curView] = !domMode; // DOM → 3D scene, 3D scene → clean DOM
      showView(curView);
    });
    pauseBtn.addEventListener("click", () => {
      paused = !paused;
      pauseBtn.innerHTML = paused ? "▶ RESUME" : "❚❚ PAUSE";
      pauseBtn.setAttribute("aria-pressed", String(paused));
      dirty = true; poke();
    });
    tableBtn.addEventListener("click", () => {
      tableMode = !tableMode;
      tableBtn.innerHTML = tableMode ? (domMode ? "▲ MAP VIEW" : "▲ 3D VIEW") : "▦ TABLE VIEW";
      tableBtn.setAttribute("aria-pressed", String(tableMode));
      tableBox.hidden = !tableMode;
      if (domMode) domBox.hidden = tableMode;
      else stageCol.style.display = tableMode ? "none" : "";
      if (tableMode) {
        tableBox.innerHTML = VIEWS[curView].table();
        if (VIEWS[curView].wireTable) VIEWS[curView].wireTable(tableBox);
      }
      dirty = true; poke();
    });

    // ── render loop: continuous unless paused / reading mode / offscreen / table ──
    let dirty = true, inView = false, raf = 0, lastT = 0, t0 = 0;
    const UP = new THREE.Vector3(0, 1, 0);
    function running() { return !READER() && !paused && !tableMode && !domMode; }
    function poke() { if (inView && !raf) raf = requestAnimationFrame(frame); }
    // watchdog: if the rAF chain ever dies (transient error, throttled
    // callback while the tab was hidden, …) restart it — otherwise labels
    // freeze mid-view-swap in an unpositioned pile
    setInterval(() => { if (inView && !raf && !document.hidden && !domMode && (running() || dirty)) { dirty = true; raf = requestAnimationFrame(frame); } }, 800);
    controls.addEventListener("change", () => { dirty = true; poke(); });
    function resize() {
      const w = stageCol.clientWidth || 800, h = canvas.clientHeight || 600;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      dirty = true; poke();
    }
    addEventListener("resize", resize, { passive: true });
    function frame(t) {
      raf = 0;
      if (!inView || domMode) return;
      if (window.HCSP3D_ACTIVE && window.HCSP3D_ACTIVE !== "comp3d") return;
      if (t0 === 0) t0 = t || 0;
      const tt = ((t || 0) - t0) / 1000;
      if (running() && t != null) {
        const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
        lastT = t;
        particles.rotation.y = tt * 0.02;
        animated.forEach(a => a.tick(tt, dt));
        // time-based orbit: OrbitControls.autoRotate assumes 60fps and would
        // spin ~3x too fast on unthrottled/high-refresh renderers
        const off = camera.position.clone().sub(controls.target);
        off.applyAxisAngle(UP, dt * (2 * Math.PI / 60) * 0.55);
        camera.position.copy(controls.target).add(off);
        dirty = true;
      }
      if (controls.enableDamping) controls.update();
      if (dirty || running()) {
        renderer.render(scene, camera);
        (window.__HCSP3D_RENDERED = window.__HCSP3D_RENDERED || {}).comp3d = (window.__HCSP3D_RENDERED.comp3d || 0) + 1;
        const w = stageCol.clientWidth || 800, h = canvas.clientHeight || 600;
        /* project every chip, then run a screen-space de-collision sweep:
           chips that would overlap are nudged straight down until clear.
           Positions are recomputed from scratch every frame, so chips never
           drift — they only move while they would actually collide. */
        const vis = [];
        labels.forEach(L => {
          const p = L.v.clone(); p.project(camera);
          if (p.z > 1 || tableMode) { L.el.style.display = "none"; return; }
          L.el.style.display = "";
          if (!L.cw) { L.cw = L.el.offsetWidth || 120; L.ch = L.el.offsetHeight || 20; }
          const halfW = L.cw / 2;
          const px = Math.max(halfW + 4, Math.min(w - halfW - 4, (p.x * 0.5 + 0.5) * w + L.dx));
          vis.push({ L, px, top: (-p.y * 0.5 + 0.5) * h + L.dy });
        });
        vis.sort((a, b) => a.top - b.top);
        /* chips carry transform:translate(-50%,-115%), so a chip at "top"
           spans [top-1.15·ch, top-0.15·ch] vertically */
        for (let pass = 0; pass < 3; pass++) {
          let moved = false;
          for (let i = 0; i < vis.length; i++) {
            const A = vis[i];
            const ax0 = A.px - A.L.cw / 2, ax1 = A.px + A.L.cw / 2;
            const atop = A.top - 1.15 * A.L.ch, abot = A.top - 0.15 * A.L.ch;
            for (let j = i + 1; j < vis.length; j++) {
              const B = vis[j];
              const bx0 = B.px - B.L.cw / 2, bx1 = B.px + B.L.cw / 2;
              if (ax1 <= bx0 + 2 || bx1 <= ax0 + 2) continue;   // clear horizontally
              const btop = B.top - 1.15 * B.L.ch, bbot = B.top - 0.15 * B.L.ch;
              const oy = Math.min(abot, bbot) - Math.max(atop, btop);
              if (oy > 2) { B.top += oy + 3; moved = true; }   // the lower chip slides clear
            }
          }
          if (!moved) break;
        }
        vis.forEach(({ L, px, top }) => {
          L.el.style.left = px + "px";
          L.el.style.top = Math.min(top, h - 6) + "px";
        });
        dirty = false;
      }
      if (running()) raf = requestAnimationFrame(frame);
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
      inView = e.isIntersecting;
      if (inView && !raf) { dirty = true; raf = requestAnimationFrame(frame); }
    }), { threshold: 0.05 });
    io.observe(hostEl);

    // re-render when reading mode flips (shell.js reloads, but cover the toggle anyway)
    const mo = new MutationObserver(() => { dirty = true; poke(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    showView("timeline");
    resize();
    // re-render once webfonts settle: label chip metrics (L.cw/L.ch) are cached
    // per chip, so invalidate them or a paused scene freezes first-paint metrics
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
      labels.forEach(L => { L.cw = 0; }); dirty = true; poke();
    });

    addEventListener("hcsp3d:active", e => {
      if (e.detail === "comp3d" && inView && !raf) { dirty = true; raf = requestAnimationFrame(frame); }
    });
    window.dispatchEvent(new CustomEvent("hcsp3d:ready", { detail: "comp3d" }));
    return { showView, views: Object.keys(VIEWS) };
  }

  return { render };
})();

// auto-boot on the production page
(function () {
  const host = document.getElementById("comp3d");
  if (host && window.Comp3D) window.Comp3D.render(host);
})();
