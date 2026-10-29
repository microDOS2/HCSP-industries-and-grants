// ═══ §4 · Competitive intelligence in 3D — window.Comp3D.render(hostEl) ═══
// One module, four views (tabs): 3D timeline of who survived/failed, the
// deal-size landscape with the sub-$1M zone, interactive vendor panels, and
// the 3D customer map with a verified-vs-marketing coverage matrix.
// Data: js/data.js (RPT.players / scalegap / comp_profiles / comp_matrix /
// cust_tables / geo_matrix), sources: js/sources.js (window.K / KLINK).
// Continuous animation on load (auto-orbit + traveling markers + ambient
// particles) · PAUSE button · Reading Mode = static frame · rendering pauses
// offscreen (IntersectionObserver) · TABLE VIEW button swaps the canvas for a
// DOM data-table alternative of the same view. Click anything for the detail
// with dated source links.
// Integration: host <div id="comp3d"></div> after vendor/three.min.js,
// vendor/OrbitControls.js, js/data.js, js/sources.js, js/utils.js,
// js/charts-core.js; styles css/flow3d.css (.sc3d-* shared + .c3d-* block).
window.Comp3D = (() => {
  "use strict";

  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const KLINK = ids => (window.KLINK ? window.KLINK(ids) : (ids || []).join(", "));
  const READER = () => document.documentElement.classList.contains("reader");
  const COMP_COLOR = { w374: 0x2251ff, ga: 0x42566a, aq: 0x008a6d, rv: 0xb07a10 };
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
  const MAP_REGIONS = { "United States": [-100, 44], "Europe": [8, 52], "China": [106, 33], "Japan": [138, 38], "Central Asia": [68, 43], "Canada / other": [-106, 56] };
  // region chips can float away from the tile cluster when the anchor is
  // crowded with pins (the US anchor sits under the St. Cloud / Olathe pins);
  // entry: [lon, lat, dy px]
  const MAP_REGION_LAB = { "United States": [-125, 64, 0], "Europe": [8, 52, -38], "Canada / other": [-70, 64, 0] };
  // The US pins all sit in one screen column — their chips get an explicit
  // vertical ladder (extra px dy per pin, keys = cust_tables id:row).
  const PIN_LADDER = { "w374:2": -60, "w374:3": -37, "ga:0": -16, "ga:5": 50, "ga:6": 82, "rv:0": -77, "rv:3": 3, "rv:5": 66 };
  const PIN_LADDER_X = { "ga:6": 92 }; // extra dy for an ✕ status chip on a flagged pin
  const PIN_LAB_DX = { "aq:0": 30 };   // Seveso chip clears the Skævinge chip + ladder

  function shortLoc(loc) {
    let s = String(loc).split(";")[0].split("(destruction")[0].split("(processing")[0].trim();
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
    G.label("TODAY · 2026", "accent", tlX(2026), 0.15, 4.3);
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
  const PANEL_FLOOR = { w374: 4.9, ga: 5, aq: 2, rv: 0.67 };
  const TONE_C = { bad: 0xc22f4e, mid: 0xb07a10, ok: 0x008a6d, verdict: 0x2251ff };
  const TONE_TXT = { bad: "WEAK BALANCE SHEET", mid: "MIXED RECORD", ok: "STRONG BALANCE SHEET" };

  function buildPanels(G) {
    const profs = RPT.comp_profiles || [];
    G.ground(26, 8);
    profs.forEach((p, i) => {
      const x = (i - 1.5) * 5.1;
      const floor = PANEL_FLOOR[p.id] || 2;
      const podH = Math.max(0.3, 0.5 + Math.log10(floor) * 0.9);
      const fin = p.rows[0] || {};
      const tone = TONE_C[fin.tone] || 0x42566a;
      const g = new THREE.Group(); g.position.x = x; G.view.add(g);

      // podium = where this vendor's smallest offering starts on the deal axis
      const pod = new THREE.Mesh(new THREE.BoxGeometry(3.3, podH, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x8fa0b3, roughness: 0.7, metalness: 0.15 }));
      pod.position.y = podH / 2; g.add(pod);
      G.label("FLOOR ≈ $" + floor + "M", "", x, podH + 0.32, 1.5);

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
      const PANEL_SHORT = { ga: "GA PERSES", rv: "REVIVE" };
      G.label(PANEL_SHORT[p.id] || p.name.toUpperCase(), "", x, podH + 3.85, 0, 0, -16);
      G.label(TONE_TXT[fin.tone] || "PROFILE", fin.tone === "bad" ? "neg" : fin.tone === "ok" ? "cool" : "heat",
        x, podH + 3.4, 0, (i % 2) * 30, 14);
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

  /* ════════════════════════ VIEW 4 · 3D CUSTOMER MAP ════════════════════════ */
  // equirectangular plane: lon [-130, 150] → x [-11.5, 11.5], lat [14, 64] → z
  // (the 23-wide span keeps the US pin cluster inside the horizontal frustum
  // at narrow stage widths instead of piling chips onto the left edge clamp)
  const mapX = lon => ((lon + 130) / 280) * 23 - 11.5;
  const mapZ = lat => ((64 - lat) / 50) * 14 - 7;

  function buildMap(G) {
    // base plane + graticule
    const base = new THREE.Mesh(new THREE.BoxGeometry(26.4, 0.12, 14.4),
      new THREE.MeshStandardMaterial({ color: 0xeef1f6, roughness: 0.9 }));
    base.position.y = -0.06; G.view.add(base);
    const grid = [];
    for (let lon = -120; lon <= 140; lon += 20) grid.push(mapX(lon), 0.01, -7, mapX(lon), 0.01, 7);
    for (let lat = 20; lat <= 60; lat += 10) grid.push(-13, 0.01, mapZ(lat), 13, 0.01, mapZ(lat));
    const gg = new THREE.BufferGeometry();
    gg.setAttribute("position", new THREE.Float32BufferAttribute(grid, 3));
    G.view.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: 0xdbe2ea })));

    // region labels + coverage tiles (geo_matrix: verified presence vs marketing claims)
    const GM = RPT.geo_matrix;
    const compIds = ["w374", "ga", "aq", "rv"];
    GM.cols.forEach((colName, ci) => {
      const ll = MAP_REGIONS[colName]; if (!ll) return;
      const lab = MAP_REGION_LAB[colName] || [ll[0], ll[1], 0];
      const x = mapX(ll[0]), z = mapZ(ll[1]);
      G.label(colName.toUpperCase(), "accent", mapX(lab[0]), 0.9, mapZ(lab[1]) - 0.9, 0, lab[2]);
      compIds.forEach((cid, ri) => {
        const cell = GM.rows[ri] && GM.rows[ri].cells[ci];
        if (!cell || cell.m === "no") return;
        const col3 = GEO_MARKER[cell.m] ? GEO_MARKER[cell.m][0] : "#5b6f82";
        const tile = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.52),
          new THREE.MeshStandardMaterial({ color: new THREE.Color(col3),
            transparent: cell.m === "mkt" || cell.m === "ann", opacity: cell.m === "mkt" ? 0.35 : cell.m === "ann" ? 0.6 : 1 }));
        tile.position.set(x - 0.9 + ri * 0.62, 0.05, z + 0.35);
        G.view.add(tile); G.mark(tile, "gm:" + ri + ":" + ci);
      });
    });
    // legend — rows INSIDE the map's front edge (z 8.3/9.5 used to hang past
    // the base and pile onto the hint + region chips); x spread sized so the
    // chips keep clear of each other and of the left edge clamp
    G.label("■ VERIFIED OPERATING", "cool", -8.5, 0.4, 6.55);
    G.label("■ DEMO / TEST", "heat", -4.2, 0.4, 6.55);
    G.label("■ ANNOUNCED", "accent", -0.55, 0.4, 6.55);
    G.label("□ MARKETING CLAIM ONLY", "", 3.55, 0.4, 6.55);
    // (tile-row order note lives in the view hint — as a chip it collided
    // with the bottom of the pin ladder)

    // customer pins
    (RPT.cust_tables || []).forEach(tbl => {
      const pins = MAP_PINS[tbl.id] || {};
      tbl.rows.forEach((r, ri) => {
        const ll = pins[ri]; if (!ll) return;
        const x = mapX(ll[0]), z = mapZ(ll[1]);
        const xs = X_STATUS[tbl.id] && X_STATUS[tbl.id][ri];
        const col = xs ? 0x9aa8b5 : COMP_COLOR[tbl.id];
        const pinH = r.flag === "largest" ? 2.0 : r.flag === "smallest" ? 0.75 : 1.2;
        const g = new THREE.Group(); g.position.set(x, 0, z); G.view.add(g);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, pinH, 10),
          new THREE.MeshStandardMaterial({ color: col, roughness: 0.5, metalness: 0.2 }));
        stem.position.y = pinH / 2; g.add(stem);
        const head = new THREE.Mesh(new THREE.SphereGeometry(r.flag ? 0.26 : 0.18, 14, 10),
          new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 }));
        head.position.y = pinH + 0.14; g.add(head);
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.42, 24),
          new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
        ring.rotation.x = -Math.PI / 2; ring.position.y = 0.02; g.add(ring);
        G.animated.push({ obj: ring, tick: t => {
          const f = (t * 0.6 + ri * 0.23) % 1;
          ring.scale.setScalar(1 + f * 1.1); ring.material.opacity = 0.5 * (1 - f);
        } });
        G.mark(g, "pin:" + tbl.id + ":" + ri);
        // flag/status chips for neighbouring pins (Olathe vs St. Cloud,
        // NJ vs NH …) share screen space — lift largest, drop smallest,
        // then apply the per-pin ladder offset
        const ld = PIN_LADDER[tbl.id + ":" + ri] || 0;
        const lx = PIN_LAB_DX[tbl.id + ":" + ri] || 0;
        if (r.flag === "largest") G.label("▲ LARGEST · " + shortLoc(r.loc).toUpperCase(), "accent", x, pinH + 0.75, z, lx, -12 + ld);
        if (r.flag === "smallest") G.label("▽ SMALLEST · " + shortLoc(r.loc).toUpperCase(), "", x, pinH + 0.62, z, lx, 8 + ld);
        // a pin can carry both a flag and an ✕ status (e.g. Camp Minden) —
        // stack the status chip one chip-height above the flag chip
        if (xs) G.label("✕ " + xs + " · " + shortLoc(r.loc).toUpperCase(), "neg", x, pinH + 0.62, z, 0, (r.flag ? -28 : 0) + (PIN_LADDER_X[tbl.id + ":" + ri] || ld));
      });
    });
    // hub markers — same screen column as the pin chips, so they join the ladder
    G.label("DESTRUCTION HUB — COLUMBUS OH", "", mapX(-83.0), 0.32, mapZ(39.96), 0, 71);
    G.label("HUB — GRAND RAPIDS MI", "", mapX(-85.7), 0.32, mapZ(42.75) - 0.6, 0, 25);
    G.label("WDS HUB — ORLANDO FL", "", mapX(-81.4), 0.32, mapZ(28.4) + 0.7, 0, 47);
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

  function mapTable() {
    let out = "<h3 class='c3d-th'>Named customers, hosts, and programs</h3>";
    (RPT.cust_tables || []).forEach(tbl => {
      out += "<h4 class='c3d-th2'>" + esc(tbl.company) + "</h4>" + tableHtml(
        ["Customer / program", "Location", "Value", "Status", "Sources"],
        tbl.rows.map(r => [esc(r.cust) + (r.flag === "largest" ? " <b>· largest</b>" : r.flag === "smallest" ? " <b>· smallest</b>" : ""),
          esc(r.loc), esc(r.value), esc(r.status), KLINK(r.src)]),
        KLINK(tbl.src));
    });
    const GM = RPT.geo_matrix;
    out += "<h3 class='c3d-th'>Region coverage — verified presence vs marketing claims</h3>" + tableHtml(
      ["Company", ...GM.cols],
      GM.rows.map(row => [`<b>${esc(row.co)}</b>`,
        ...row.cells.map(c => {
          const m = GEO_MARKER[c.m] || ["#5b6f82", c.m];
          return `<span class="c3d-mcell" style="border-left:4px solid ${m[0]}"><b>${m[1]}</b> — ${esc(c.txt)}</span>`;
        })]),
      esc(GM.note) + " · " + KLINK(GM.src));
    return out;
  }

  /* ════════════════════════ shared DOM table helper ════════════════════════ */
  function tableHtml(cols, rows, foot) {
    return `<div class="table-scroll"><table class="dt c3d-dt"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      ${foot ? `<p class="chart-src c3d-tfoot">${foot}</p>` : ""}`;
  }

  /* ════════════════════════ view registry ════════════════════════ */
  const VIEWS = {
    timeline: { tab: "WHO SURVIVED · 3D TIMELINE", hint: "DRAG TO ORBIT · SCROLL TO ZOOM · CLICK A PILLAR FOR ITS FATE + LESSON",
      build: buildTimeline, drill: tlDrill, table: timelineTable,
      cam: [0, 8.5, 21], tgt: [0, 0.9, 0],
      foot: "RPT.players · field census " + "— sources " },
    scale: { tab: "THE SCALE GAP · DEAL SIZES", hint: "DRAG TO ORBIT · SCROLL TO ZOOM · CLICK A LANE OR THE BLUE ZONE",
      build: buildScale, drill: sgDrill, table: scaleTable,
      cam: [0, 9, 18.5], tgt: [0, 0.5, 0], foot: "" },
    panels: { tab: "VENDOR PANELS", hint: "DRAG TO ORBIT · CLICK A PANEL FOR THE FULL PROFILE · CLICK A SLAT FOR ONE RECORD",
      build: buildPanels, drill: vpDrill, table: panelsTable,
      cam: [0, 6.5, 14.5], tgt: [0, 2.0, 0], foot: "" },
    map: { tab: "CUSTOMER MAP", hint: "DRAG TO ORBIT · CLICK A PIN FOR THE ENGAGEMENT · CLICK A TILE FOR THE REGION VERDICT · TILE ROWS: 374WATER · GA · AQUARDEN · REVIVE",
      build: buildMap, drill: (G, k) => k.indexOf("pin:") === 0 ? pinDrill(G, k) : gmDrill(G, k),
      table: mapTable, cam: [0, 25, 18.5], tgt: [0, 0, 0.5], foot: "" },
  };

  /* ════════════════════════ render(hostEl) ════════════════════════ */
  function render(hostEl) {
    if (!hostEl) return null;
    if (!window.RPT || !window.THREE) { console.warn("Comp3D: needs js/data.js + vendor/three.min.js first"); return null; }
    hostEl.classList.add("sc3d-wrap", "c3d-wrap");

    // ── DOM: tab bar + stage + table container ──
    const tabs = document.createElement("div");
    tabs.className = "c3d-tabs"; tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Competitive intelligence 3D views");
    tabs.innerHTML = Object.keys(VIEWS).map(k =>
      `<button type="button" role="tab" data-v="${k}" aria-selected="false">${VIEWS[k].tab}</button>`).join("") +
      `<span class="c3d-spacer"></span>
       <button type="button" class="c3d-ctl" data-ctl="pause" aria-pressed="false">❚❚ PAUSE</button>
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
    const tableBox = document.createElement("div");
    tableBox.className = "c3d-table"; tableBox.hidden = true; hostEl.appendChild(tableBox);

    // ── renderer ──
    let renderer = null, webglDead = false;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (e) { webglDead = true; }
    if (!renderer || !renderer.getContext()) webglDead = true;
    if (webglDead) {
      // No WebGL: the table alternative becomes the primary presentation.
      stageCol.innerHTML = "<p class='c3d-nowebgl'>WebGL is unavailable in this browser — showing the data tables instead.</p>";
      tableBox.hidden = false;
      tableBox.innerHTML = VIEWS.timeline.table();
      tabs.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
        tabs.querySelectorAll("[data-v]").forEach(x => x.setAttribute("aria-selected", "false"));
        b.setAttribute("aria-selected", "true");
        tableBox.innerHTML = VIEWS[b.dataset.v].table();
      }));
      const pb = tabs.querySelector('[data-ctl="pause"]'); if (pb) pb.remove();
      const tb = tabs.querySelector('[data-ctl="table"]'); if (tb) tb.remove();
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

    let curView = null, paused = false, tableMode = false;
    function showView(name) {
      if (!VIEWS[name]) name = "timeline";
      curView = name;
      const V = VIEWS[name];
      clearView();
      viewG = new THREE.Group(); scene.add(viewG);
      G.view = viewG;
      V.build(G);
      camera.position.set.apply(camera.position, V.cam);
      controls.target.set.apply(controls.target, V.tgt);
      controls.update();
      hint.textContent = V.hint;
      tabs.querySelectorAll("[data-v]").forEach(b => {
        const on = b.dataset.v === name;
        b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on));
      });
      if (tableMode) tableBox.innerHTML = V.table();
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

    // ── controls: tabs, pause, table toggle ──
    tabs.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
      if (window.U && U.hideDrill) U.hideDrill();
      showView(b.dataset.v);
    }));
    const pauseBtn = tabs.querySelector('[data-ctl="pause"]');
    pauseBtn.addEventListener("click", () => {
      paused = !paused;
      pauseBtn.innerHTML = paused ? "▶ RESUME" : "❚❚ PAUSE";
      pauseBtn.setAttribute("aria-pressed", String(paused));
      dirty = true; poke();
    });
    const tableBtn = tabs.querySelector('[data-ctl="table"]');
    tableBtn.addEventListener("click", () => {
      tableMode = !tableMode;
      tableBtn.innerHTML = tableMode ? "▲ 3D VIEW" : "▦ TABLE VIEW";
      tableBtn.setAttribute("aria-pressed", String(tableMode));
      tableBox.hidden = !tableMode;
      stageCol.style.display = tableMode ? "none" : "";
      if (tableMode) tableBox.innerHTML = VIEWS[curView].table();
      dirty = true; poke();
    });

    // ── render loop: continuous unless paused / reading mode / offscreen / table ──
    let dirty = true, inView = false, raf = 0, lastT = 0, t0 = 0;
    const UP = new THREE.Vector3(0, 1, 0);
    function running() { return !READER() && !paused && !tableMode; }
    function poke() { if (inView && !raf) raf = requestAnimationFrame(frame); }
    // watchdog: if the rAF chain ever dies (transient error, throttled
    // callback while the tab was hidden, …) restart it — otherwise labels
    // freeze mid-view-swap in an unpositioned pile
    setInterval(() => { if (inView && !raf && !document.hidden) { dirty = true; raf = requestAnimationFrame(frame); } }, 800);
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
      if (!inView) return;
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
        labels.forEach(L => {
          const p = L.v.clone(); p.project(camera);
          L.el.style.display = (p.z > 1 || tableMode) ? "none" : "";
          const halfW = L.el.offsetWidth / 2 || 60;
          const px = Math.max(halfW + 4, Math.min(w - halfW - 4, (p.x * 0.5 + 0.5) * w + L.dx));
          L.el.style.left = px + "px";
          L.el.style.top = ((-p.y * 0.5 + 0.5) * h + L.dy) + "px";
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
