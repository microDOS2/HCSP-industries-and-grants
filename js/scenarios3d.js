// ═══ 3D scenario explorer — six approved energy scenarios (RPT.energy_scenarios) ═══
// A simple host site (blocks for host + neighbor buyer), the HCSP unit, and
// visible flows to destruction / water / energy outputs. The A–F selector
// rebuilds the scene, re-routes the flow paths, and rewrites the side panel
// (three ways the plant earns money · indicative economics — labeled
// "illustrative" · what you need first · the guardrails in plain words).
// Every figure comes from js/data.js (RPT.energy_scenarios / energy_guardrails).
// Reading mode = static frame; rendering pauses offscreen (IntersectionObserver).
// Integration: <div id="scenarios3d"></div> after js/data.js + vendor/three.min.js
// + vendor/OrbitControls.js.
(function () {
  const wrap = document.getElementById("scenarios3d");
  if (!wrap || !window.THREE || !window.RPT || !RPT.energy_scenarios) return;
  wrap.classList.add("sc3d-wrap");
  const READER = () => document.documentElement.classList.contains("reader");
  const SC = RPT.energy_scenarios;
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  // ── per-scenario 3D scene layout (visuals only — every word/figure is from data.js) ──
  const SCENES = {
    A: {
      hostLabel: "HOST — DISTILLERY / SEWAGE / FOOD",
      hostSub: "distillery · sewage works · food factory",
      hostBlurb: "The host's strong waste is the fuel: " + SC[0].diagram.feed + ".",
      buyers: [{ name: "NEIGHBOR BUYER", sub: "data center · cold store · greenhouse", kind: "generic", x: 5.4, z: 0,
        blurb: "A neighbor within piping distance buys the electricity and chilled water — the energy sale is stacked on top of the destruction fees, never instead of them." }],
      pipes: [{ kind: "power", to: 0 }, { kind: "cool", to: 0 }],
      note: "Hot water at 150–180 °C is also available at this plant.",
    },
    B: {
      hostLabel: "HOST — FOOD · DAIRY · BREWERY",
      hostSub: "dairies · breweries · food plants",
      hostBlurb: "The park's concentrated food and dairy waste is destroyed on site instead of hauled or digested.",
      buyers: [{ name: "COLD-CHAIN PARK", sub: "freezers · cold stores", kind: "cold", x: 5.4, z: 0,
        blurb: "Over 95% of US refrigerated warehouses already run ammonia refrigeration — the heat-driven chiller slots into infrastructure that exists, and the electric compressors drop to backup duty." }],
      pipes: [{ kind: "cool", to: 0 }],
      note: "All spare heat goes to cooling here — no turbine in this scenario.",
    },
    C: {
      hostLabel: "HOST — WASTE-RICH NEIGHBOR",
      hostSub: "sewage works · distillery · food complex",
      hostBlurb: "The neighbor supplies the strong waste — a data center's own waste water is salty, not organic, so it cannot feed the plant.",
      buyers: [{ name: "DATA-CENTER CAMPUS", sub: "buys power + chilled water", kind: "dc", x: 5.4, z: 0,
        blurb: "Cooling is 30–40% of a data center's electric bill and grid connections take 4–7 years — so it signs a 10–20-year agreement for power and chilled water from next door." }],
      pipes: [{ kind: "power", to: 0 }, { kind: "cool", to: 0 }, { kind: "waterBuy", to: 0 }],
      note: "Reclaimed water also goes to the campus for cooling-tower makeup.",
    },
    D: {
      hostLabel: "HOST — ISLAND WASTE BLEND",
      hostSub: "sewage sludge + grease-trap + food waste",
      hostBlurb: "Island sludge is too watery on its own — grease-trap and food waste are blended in to reach the strength where spare heat exists.",
      buyers: [{ name: "RESORTS · PORT · COLD STORE", sub: "power · ice · AC · fresh water", kind: "island", x: 5.4, z: 0,
        blurb: "On an island every output prices near its global maximum: diesel power $0.30–0.52/kWh, desalinated water $2–5/m³, and ice for the fishing fleet." }],
      pipes: [{ kind: "power", to: 0 }, { kind: "cool", to: 0 }, { kind: "heat", to: 0, lt: 0.4, ly: 2.6 }],
      sea: true,
      note: "One plant sells water, power, and ice within a few kilometers.",
    },
    E: {
      hostLabel: "HOST — SAME WASTE ALL YEAR",
      hostSub: "the same strong waste stream, all year",
      hostBlurb: "The waste arrives and is destroyed in every season — only the energy outlet swaps.",
      buyers: [
        { name: "SUMMER — COOLING BUYER", sub: "buildings · cold stores", kind: "cold", x: 5.4, z: -2.3,
          blurb: "Summer: spare heat drives chillers — worth about $10 per MWh of heat as avoided electricity, or $30–48 where chilled water retails." },
        { name: "WINTER — HEAT BUYER", sub: "district heating · greenhouses", kind: "heat", x: 5.4, z: 2.3,
          blurb: "Winter: the same heat is sold as hot water at $10–30 per MWh into heating networks that already buy exactly this." },
      ],
      pipes: [{ kind: "cool", to: 0 }, { kind: "heat", to: 1, lt: 0.7, ly: 0.9 }],
      note: "Selling the heat year-round is what pays for the energy module.",
    },
    F: {
      hostLabel: "HOST — BUYS THE STEAM",
      hostSub: "any strong waste stream at hub scale",
      hostBlurb: "The host already burns fuel to make steam — Level 1 replaces that fuel, the simplest sale on the ladder.",
      buyers: [],
      ladder: true,
      pipes: [{ kind: "steam", to: "host" }],
      note: "Each rung is added only after its revenue is under contract.",
    },
  };

  // guardrails — condensed plain words, same facts as RPT.energy_guardrails
  const GUARDS = [
    ["Spare heat is not automatic", "Surplus heat exists only when the waste is strong enough — above roughly 35–60 g/L COD — and the plant is big enough. Below that line the plant heats itself and has nothing left to sell."],
    ["Chillers want big, steady cold customers", "Heat-driven chillers pay at steady loads of at least 500 refrigeration tons (about 1.8 MW of cooling) — and full electric backup chillers always stay installed, because the waste plant is never the only source of cold."],
    ["Ammonia needs distance", "Ammonia is the industry's standard refrigerant but toxic: the equipment is sited away from occupied buildings, and big charges trigger federal safety rules. For cooling next to people, the lithium-bromide option avoids this entirely."],
  ];

  // ── DOM: picker + canvas + side panel (integration supplies only the host div) ──
  const picker = document.createElement("div");
  picker.className = "sc3d-picker";
  picker.setAttribute("role", "tablist");
  picker.setAttribute("aria-label", "Energy scenarios A to F");
  picker.innerHTML = SC.map((s, i) =>
    `<button type="button" role="tab" data-i="${i}" aria-selected="false" title="${esc(s.name)}">${s.id}</button>`).join("");
  wrap.appendChild(picker);

  const grid = document.createElement("div");
  grid.className = "sc3d-grid";
  wrap.appendChild(grid);
  const stageCol = document.createElement("div");
  stageCol.className = "sc3d-stage-col";
  grid.appendChild(stageCol);
  const canvas = document.createElement("canvas");
  canvas.className = "sc3d-stage"; canvas.id = "scenarios3d-canvas";
  canvas.setAttribute("aria-label", "Interactive 3D scene of the selected energy scenario: host site, HCSP plant, buyer, and the flows between them");
  stageCol.appendChild(canvas);
  const hint = document.createElement("p");
  hint.className = "sc3d-hint";
  hint.textContent = "DRAG TO ORBIT · SCROLL OR PINCH TO ZOOM · CLICK A BUILDING OR PIPE";
  stageCol.appendChild(hint);
  const panel = document.createElement("aside");
  panel.className = "sc3d-panel";
  panel.setAttribute("aria-live", "polite");
  grid.appendChild(panel);

  // ── renderer / scene ──
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    stageCol.innerHTML = "<p style='padding:40px;font-family:var(--mono,Menlo,monospace);font-size:13px'>WebGL is unavailable in this browser — the 3D scenario explorer cannot start.</p>";
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.HCSP_DPR_CAP || 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 200);
  camera.position.set(1.2, 8.0, 15.0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
  const sun = new THREE.DirectionalLight(0xffffff, 0.75);
  sun.position.set(6, 12, 8);
  scene.add(sun);

  const MAT = {
    frame:  new THREE.MeshStandardMaterial({ color: 0x5d7186, roughness: 0.6, metalness: 0.35 }),
    vessel: new THREE.MeshStandardMaterial({ color: 0xc9d5e1, roughness: 0.35, metalness: 0.55 }),
    dark:   new THREE.MeshStandardMaterial({ color: 0x42566a, roughness: 0.45, metalness: 0.5 }),
    bld:    new THREE.MeshStandardMaterial({ color: 0xdde4ec, roughness: 0.75, metalness: 0.12 }),
    bldHi:  new THREE.MeshStandardMaterial({ color: 0xc2cedb, roughness: 0.75, metalness: 0.12 }),
    roof:   new THREE.MeshStandardMaterial({ color: 0x8fa0b3, roughness: 0.7, metalness: 0.2 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x2251ff, roughness: 0.4, metalness: 0.2 }),
    waterM: new THREE.MeshStandardMaterial({ color: 0x7d9bff, roughness: 0.3, metalness: 0.3 }),
    heat:   new THREE.MeshStandardMaterial({ color: 0xb07a10, roughness: 0.5, metalness: 0.3, emissive: 0x2a1a04 }),
    cool:   new THREE.MeshStandardMaterial({ color: 0x008a6d, roughness: 0.5, metalness: 0.2 }),
    waste:  new THREE.MeshStandardMaterial({ color: 0xc22f4e, roughness: 0.55, metalness: 0.2 }),
    sea:    new THREE.MeshStandardMaterial({ color: 0x9fc2e8, roughness: 0.35, metalness: 0.1 }),
  };
  const PIPE = { power: MAT.accent, cool: MAT.cool, heat: MAT.heat, steam: MAT.heat, waterBuy: MAT.waterM, waste: MAT.waste, water: MAT.waterM, solids: MAT.dark };

  // flow info — one plain sentence + the numbers (generic per flow kind)
  const FLOW_INFO = {
    waste:  { name: "Flow — waste in", specs: "Strong enough to make spare heat: above ~35–60 g/L COD", role: "The host's concentrated waste flows into the plant here — destroying it is the core paid service in every scenario." },
    water:  { name: "Flow — distilled water", specs: "85–95% water recovery · <10 µS/cm", role: "Most of the water that carried the waste comes back distilled-quality and is stored or sold." },
    waterBuy: { name: "Flow — reclaimed water to the buyer", specs: "A 1 MW data center on evaporative cooling uses ~6.75M gallons of water a year", role: "In this scenario the recovered water is piped to the campus for cooling-tower makeup, cutting its water bill." },
    solids: { name: "Flow — inert solids", specs: "Contained, fully broken-down salts/oxides", role: "A small amount of inert solid is the only residue of destruction — an ordinary disposal task." },
    power:  { name: "Flow — electricity", specs: "1.4 MW at the 1,000 m³/day example plant", role: "A small turbine turns spare heat into electricity that the buyer takes under contract." },
    cool:   { name: "Flow — cooling", specs: "4.9 MW of cooling (≈1,392 refrigeration tons) at the example plant", role: "A heat-driven chiller turns spare heat into cold — the buyer's electric chillers drop to backup duty." },
    heat:   { name: "Flow — heat / hot water", specs: "$10–30 per MWh of heat where heating networks exist", role: "Hot water at 150–180 °C is piped to a buyer who would otherwise burn fuel to make it." },
    steam:  { name: "Flow — steam, Level 1", specs: "$10–30 per MWh of heat", role: "The first rung of the ladder: steam sold straight to the host, who already burns fuel to make it." },
  };

  // ── builders ──
  let siteG = null, flows = [], clickable = [], labels = [];
  function clearSite() {
    if (siteG) { scene.remove(siteG); siteG = null; }
    labels.forEach(L => L.el.remove()); labels = [];
    flows = []; clickable = [];
  }
  function box(g, w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); g.add(m); return m;
  }
  function cyl(g, r1, r2, h, mat, x, y, z, seg) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg || 20), mat);
    m.position.set(x, y, z); g.add(m); return m;
  }
  function mark(g, key) {
    g.traverse(o => { if (o.isMesh) { o.userData.key = key; clickable.push(o); } });
  }
  // polyline pipe: segments + traveling markers; clickable under flowKey
  function pipe(g, pts, r, mat, flowKey) {
    const v = pts.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const segs = []; let total = 0;
    for (let i = 0; i < v.length - 1; i++) {
      const a = v[i], b = v[i + 1], len = a.distanceTo(b);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
      m.position.copy(a).lerp(b, 0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      g.add(m); segs.push({ a, b, len }); total += len;
      if (flowKey) { m.userData.key = flowKey; clickable.push(m); }
    }
    if (flowKey) {
      const n = Math.max(1, Math.round(total / 3.2));
      const f = { segs, total, markers: [] };
      for (let i = 0; i < n; i++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8),
          new THREE.MeshBasicMaterial({ color: mat.color }));
        s.userData.t = (i + 0.5) / n;
        g.add(s); f.markers.push(s);
      }
      flows.push(f);
    }
  }
  function placeMarkers() {
    flows.forEach(f => f.markers.forEach(s => {
      let d = s.userData.t * f.total;
      for (const sg of f.segs) {
        if (d <= sg.len) { s.position.copy(sg.a).lerp(sg.b, d / sg.len); return; }
        d -= sg.len;
      }
      const last = f.segs[f.segs.length - 1];
      s.position.copy(last.b);
    }));
  }
  function label(text, cls, x, y, z, dx, dy) {
    const el = document.createElement("div");
    el.className = "sc3d-label" + (cls ? " " + cls : "");
    el.textContent = text;
    el.style.transform = "translate(-50%,-120%)";
    stageCol.appendChild(el);
    labels.push({ el, v: new THREE.Vector3(x, y, z), dx: dx || 0, dy: dy || 0 });
  }
  // a simple site building; trim color band on top
  function building(g, x, z, w, h, d, trim) {
    box(g, w, h, d, MAT.bld, x, h / 2, z);
    box(g, w + 0.06, 0.12, d + 0.06, trim || MAT.roof, x, h + 0.06, z);
  }

  // ══ scene assembly per scenario ══
  let cur = -1;
  function buildScene(i) {
    cur = i;
    clearSite();
    const S = SC[i], C = SCENES[S.id];
    siteG = new THREE.Group(); scene.add(siteG);

    // ground + site pad
    const ground = new THREE.Mesh(new THREE.CircleGeometry(13, 56),
      new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.8 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12;
    siteG.add(ground);
    if (C.sea) {
      const sea = new THREE.Mesh(new THREE.CircleGeometry(7, 40), MAT.sea);
      sea.rotation.x = -Math.PI / 2; sea.position.set(10.5, -0.1, 0);
      siteG.add(sea);
      label("EVERYTHING HERE IS EXPENSIVE", "accent", 5.0, 0.3, 4.2);
    }

    // ── host site (left): a waste-source block cluster ──
    const host = new THREE.Group(); siteG.add(host);
    building(host, -5.6, -1.2, 2.2, 1.7, 1.8);
    building(host, -5.9, 1.1, 1.6, 1.15, 1.5, MAT.bldHi);
    cyl(host, 0.5, 0.5, 1.9, MAT.bldHi, -4.2, 0.95, -1.5, 22); // silo/tank
    cyl(host, 0.52, 0.52, 0.1, MAT.roof, -4.2, 1.95, -1.5, 22);
    mark(host, "host");
    label(C.hostLabel, "waste", -5.0, 2.6, -0.2);

    // ── HCSP unit (center) ──
    const hcsp = new THREE.Group(); siteG.add(hcsp);
    box(hcsp, 3.1, 0.18, 2.2, MAT.frame, 0, 0.09, 0);                       // skid
    box(hcsp, 0.85, 1.05, 0.85, MAT.accent, -0.95, 0.7, 0.55);              // electrolyzer
    const comb = cyl(hcsp, 0.32, 0.32, 1.1, MAT.heat, 0.15, 0.65, 0.62); comb.rotation.z = Math.PI / 2;
    cyl(hcsp, 0.5, 0.5, 1.9, MAT.dark, 0.55, 1.15, -0.35, 26);              // reactor vessel
    const capT = new THREE.Mesh(new THREE.SphereGeometry(0.5, 26, 12, 0, Math.PI * 2, 0, Math.PI / 2), MAT.dark);
    capT.position.set(0.55, 2.1, -0.35); hcsp.add(capT);
    box(hcsp, 1.05, 0.62, 0.7, MAT.vessel, -0.7, 0.49, -0.75);              // separator
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), MAT.heat); // surplus-heat node
    hub.position.set(1.55, 1.35, 0.15); hcsp.add(hub);
    mark(hcsp, "hcsp");
    label("HCSP PLANT", "accent", 0, 2.75, 0);

    // ── outputs: water tank + solids bin (destruction/water outputs, always visible) ──
    const water = new THREE.Group(); siteG.add(water);
    cyl(water, 0.58, 0.58, 1.1, MAT.waterM, 2.5, 0.55, -2.3, 24);
    const wcap = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), MAT.waterM);
    wcap.position.set(2.5, 1.1, -2.3); water.add(wcap);
    mark(water, "water");
    label("DISTILLED WATER", "accent", 2.5, 1.4, -2.3, -110, 24);
    const solids = new THREE.Group(); siteG.add(solids);
    box(solids, 0.85, 0.7, 0.85, MAT.dark, 2.7, 0.35, -1.0);
    mark(solids, "solids");
    label("INERT SOLIDS", "", 2.7, 1.15, -1.0);

    // waste in: host → HCSP (semantic red — the only red flow)
    pipe(siteG, [[-4.6, 0.7, 0.4], [-2.2, 0.7, 0.3], [-1.15, 0.75, 0.2]], 0.1, PIPE.waste, "waste");
    label("WASTE IN", "waste", -3.4, 1.15, 0.35);
    // water + solids out
    pipe(siteG, [[-0.2, 0.65, -0.85], [1.6, 0.6, -1.9], [2.15, 0.6, -2.25]], 0.08, PIPE.water, "water");
    pipe(siteG, [[0.35, 0.5, -0.8], [2.25, 0.45, -1.0]], 0.07, PIPE.solids, "solids");

    // ── buyers (right) ──
    C.buyers.forEach((B, bi) => {
      const g = new THREE.Group(); siteG.add(g);
      if (B.kind === "dc") {
        box(g, 2.4, 2.3, 1.9, MAT.bld, B.x, 1.15, B.z);
        box(g, 2.46, 0.1, 1.96, MAT.roof, B.x, 2.35, B.z);
        [-0.7, 0, 0.7].forEach(dx => box(g, 0.42, 0.3, 0.5, MAT.bldHi, B.x + dx, 2.55, B.z)); // roof cooling units
      } else if (B.kind === "cold") {
        box(g, 2.6, 1.5, 2.0, MAT.bld, B.x, 0.75, B.z);
        box(g, 2.66, 0.14, 2.06, MAT.cool, B.x, 1.57, B.z);                 // green trim = cold
        box(g, 0.6, 0.5, 0.6, MAT.cool, B.x - 0.8, 1.85, B.z + 0.5);        // chiller unit
      } else if (B.kind === "heat") {
        box(g, 2.2, 1.4, 1.8, MAT.bld, B.x, 0.7, B.z);
        box(g, 2.26, 0.14, 1.86, MAT.heat, B.x, 1.47, B.z);                 // copper trim = heat
        cyl(g, 0.16, 0.16, 0.9, MAT.dark, B.x + 0.7, 1.9, B.z - 0.5, 14);   // flue/stack
      } else if (B.kind === "island") {
        box(g, 1.5, 1.3, 1.4, MAT.bld, B.x - 0.8, 0.65, B.z - 0.9);         // resort block
        box(g, 1.1, 0.9, 1.1, MAT.bldHi, B.x + 0.9, 0.45, B.z + 0.4);       // cold store
        box(g, 1.16, 0.12, 1.16, MAT.cool, B.x + 0.9, 0.96, B.z + 0.4);
        cyl(g, 0.45, 0.45, 0.55, MAT.waterM, B.x + 0.2, 0.28, B.z + 1.3, 20); // ice tank
      } else {
        box(g, 2.2, 1.6, 1.8, MAT.bld, B.x, 0.8, B.z);
        box(g, 2.26, 0.12, 1.86, MAT.roof, B.x, 1.66, B.z);
      }
      mark(g, "buyer" + bi);
      label(B.name, "", B.x, (B.kind === "dc" ? 3.05 : B.kind === "cold" ? 2.75 : B.kind === "island" ? 2.9 : 2.35), B.z);
    });

    // ── energy flows from the surplus-heat node ──
    C.pipes.forEach(P => {
      const from = [1.55, 1.35, 0.15];
      if (P.to === "host") { // steam back to the host (Ladder level 1)
        pipe(siteG, [from, [0.2, 1.6, 0.9], [-3.2, 1.4, 0.9], [-4.3, 1.2, 0.5]], 0.09, PIPE.steam, "steam");
        label("STEAM — LEVEL 1", "heat", -1.6, 2.0, 0.9, -46, 0);
      } else {
        const B = C.buyers[P.to];
        const ty = B.kind === "dc" ? 2.5 : 1.6;
        const lane = P.kind === "power" ? -0.45 : P.kind === "cool" ? 0 : 0.45; // separate parallel pipes
        const from3 = [1.55, 1.35, 0.15], to3 = [B.x - 0.6, ty, B.z + lane];
        pipe(siteG, [from3, [2.6, 1.6, B.z * 0.4 + lane], [B.x - 1.3, ty + 0.35, B.z + lane], to3],
          0.08, PIPE[P.kind], P.kind);
        // staggered label spots so parallel flow labels never collide
        const LT = { power: [0.22, 1.5], cool: [0.45, 0.75], heat: [0.80, 1.35], waterBuy: null };
        const spot = LT[P.kind] ? [P.lt != null ? P.lt : LT[P.kind][0], P.ly != null ? P.ly : LT[P.kind][1]] : null;
        if (spot) {
          const [lt, ly] = spot;
          const mid = [from3[0] + (to3[0] - from3[0]) * lt, from3[1] + (to3[1] - from3[1]) * lt + ly,
                       from3[2] + (to3[2] - from3[2]) * lt];
          const flab = P.kind === "power" ? "POWER ≈1.4 MW" : P.kind === "cool" ? "COOLING ≈4.9 MW" : "HEAT";
          label(flab, P.kind === "power" ? "accent" : P.kind === "cool" ? "cool" : "heat", mid[0], mid[1], mid[2]);
        }
      }
    });

    // ── the steam ladder (scenario F): four separately sellable rungs ──
    if (C.ladder) {
      const lad = new THREE.Group(); siteG.add(lad);
      const rungs = [
        ["L1 · STEAM SALES", MAT.heat, 0.0],
        ["L2 · + CHILLER", MAT.cool, 0.62],
        ["L3 · + TURBINE", MAT.accent, 1.24],
        ["L4 · FULL CONTRACT", MAT.dark, 1.86],
      ];
      rungs.forEach(([nm, m, y], ri) => {
        const b = box(lad, 1.7, 0.56, 1.0, MAT.bld, 4.6, y + 0.28, 0.6);
        box(lad, 1.76, 0.1, 1.06, m, 4.6, y + 0.61, 0.6);
        b.userData.key = "rung" + ri; clickable.push(b);
        label(nm, ri === 0 ? "heat" : ri === 1 ? "cool" : ri === 2 ? "accent" : "", 4.6, y + 0.78, 1.75);
      });
      // pipes: L1 fed by the hub; visual risers between rungs
      pipe(siteG, [[1.55, 1.35, 0.15], [2.8, 1.1, 0.6], [3.6, 0.7, 0.6]], 0.09, PIPE.heat, "heat");
      [[0.62, MAT.cool], [1.24, MAT.accent], [1.86, MAT.dark]].forEach(([y, m]) => {
        const r = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.62, 10), m);
        r.position.set(3.6, y + 0.28, 0.6); lad.add(r);
      });
      label("THE LADDER — BUY A RUNG, NOT THE CAMPUS", "", 4.6, 2.85, 0.6);
    }

    placeMarkers();
    updatePanel(i);
    dirty = true; poke();
  }

  // ── side panel: earns · indicative economics · what you need first · guardrails ──
  function updatePanel(i) {
    const S = SC[i], C = SCENES[S.id];
    panel.innerHTML = `
      <span class="sp-letter">${S.id}</span>
      <h3 class="sp-name">${esc(S.name)}</h3>
      <p class="sp-tag">${esc(S.tag)}</p>
      <p class="sp-card">${esc(S.card)}</p>
      <p class="sp-h">Three ways the plant earns money</p>
      ${S.earns.map(e => `<div class="sc3d-earn"><span class="se-t">${esc(e.t)}</span><span class="se-d">${esc(e.d)}</span></div>`).join("")}
      <p class="sp-h">Indicative economics <span class="sp-ill">— illustrative</span></p>
      <ul class="sc3d-econ">${S.econ.map(e => `<li><span class="ec-lab">${esc(e.lab)}</span><span class="ec-val">${esc(e.val)}</span></li>`).join("")}</ul>
      <p class="sp-h">What you need first</p>
      <ul class="sc3d-needs">${S.needs.map(n => `<li>${esc(n)}</li>`).join("")}</ul>
      <div class="sc3d-guard">
        <div class="sg-h">Guardrails — read first</div>
        ${GUARDS.map(g => `<p><b>${esc(g[0])}.</b> ${esc(g[1])}</p>`).join("")}
      </div>
      <p class="sc3d-src">Source · ${S.src.join(", ")} · guardrails K73, K80, K85, K84</p>`;
  }

  // ── info panel (drill-card pattern, self-contained) ──
  let info = null;
  function showInfo(key) {
    const S = SC[cur], C = SCENES[S.id];
    let d = FLOW_INFO[key];
    if (!d) {
      if (key === "host") d = { name: "The host — where the waste is", specs: S.diagram.feed, role: C.hostBlurb };
      else if (key === "hcsp") d = { name: "The HCSP plant", specs: "Distillation + high-heat oxidation · atmospheric pressure · 85–95% water recovery · self-fueling hydrogen loop (per manufacturer)", role: "It destroys the host's waste completely and hands back distilled water, a little inert solid, and heat — the pipes leaving it are what this scenario sells." };
      else if (key === "water") d = { name: "Distilled water", specs: S.diagram.water, role: "85–95% of the water that carried the waste comes back distilled-quality — a real credit, never the main product." };
      else if (key === "solids") d = { name: "Inert solids", specs: "Contained, fully broken-down salts/oxides", role: "The small solid residue of complete destruction — contained and inert." };
      else if (/^buyer(\d)$/.test(key)) { const B = C.buyers[+key.slice(5)]; d = { name: B.name, specs: B.sub, role: B.blurb }; }
      else if (/^rung\d$/.test(key)) {
        const R = SC[5].econ[+key.slice(4)];
        d = { name: "The steam ladder — rung " + (+key.slice(4) + 1), specs: R.val, role: R.lab + ". Each rung is its own price point — added only after its revenue is signed." };
      }
    }
    if (!d) return;
    if (!info) { info = document.createElement("div"); info.className = "sc3d-info"; stageCol.appendChild(info); }
    info.innerHTML = `<button class="fi-close" aria-label="Close">✕</button><h4>${esc(d.name)}</h4>
      <p class="fi-specs">${esc(d.specs)}</p><p class="fi-role">${esc(d.role)}</p>`;
    info.querySelector(".fi-close").onclick = () => { info.remove(); info = null; };
  }

  // ── controls ──
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.autoRotate = false;
  controls.target.set(0.4, 1.1, 0);
  controls.minDistance = 5; controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI * 0.52;

  // picker
  picker.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    picker.querySelectorAll("button").forEach(x => { x.classList.remove("on"); x.setAttribute("aria-selected", "false"); });
    b.classList.add("on"); b.setAttribute("aria-selected", "true");
    if (info) { info.remove(); info = null; }
    buildScene(+b.dataset.i);
  }));

  // click-to-info (click, not drag)
  const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2();
  let downAt = null;
  canvas.addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener("pointerup", e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) { downAt = null; return; }
    downAt = null;
    const r = canvas.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(clickable, false)[0];
    if (hit) showInfo(hit.object.userData.key);
  });

  // ── render loop: on-demand; static in reading mode; paused offscreen ──
  let dirty = true, inView = false, raf = 0, lastT = 0;
  function poke() { if (READER() && inView && !raf) raf = requestAnimationFrame(frame); }
  controls.addEventListener("change", () => { dirty = true; poke(); });
  function resize() {
    const w = stageCol.clientWidth, h = canvas.clientHeight || 620;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    dirty = true; poke();
  }
  addEventListener("resize", resize, { passive: true });
  function frame(t) {
    raf = 0;
    if (!inView) return;
    // single-active-scene gate (js/lazy3d.js): another 3D scene owns the renderer
    if (window.HCSP3D_ACTIVE && window.HCSP3D_ACTIVE !== "scenarios3d") return;
    if (!READER() && t != null) {
      const dt = Math.min(0.05, (t - lastT) / 1000 || 0);
      lastT = t;
      flows.forEach(f => f.markers.forEach(s => { s.userData.t = (s.userData.t + dt * 0.2) % 1; }));
      placeMarkers();
      dirty = true;
    }
    if (controls.enableDamping) controls.update();
    if (dirty || !READER()) {
      renderer.render(scene, camera);
      (window.__HCSP3D_RENDERED = window.__HCSP3D_RENDERED || {}).scenarios3d = (window.__HCSP3D_RENDERED.scenarios3d || 0) + 1;
      const w = stageCol.clientWidth, h = canvas.clientHeight || 620;
      labels.forEach(L => {
        const p = L.v.clone(); p.project(camera);
        L.el.style.display = p.z > 1 ? "none" : "";
        // clamp inside the canvas so chips never clip at the edges
        const halfW = L.el.offsetWidth / 2 || 60;
        const px = Math.max(halfW + 4, Math.min(w - halfW - 4, (p.x * 0.5 + 0.5) * w + L.dx));
        L.el.style.left = px + "px";
        L.el.style.top = ((-p.y * 0.5 + 0.5) * h + L.dy) + "px";
      });
      dirty = false;
    }
    if (!READER()) raf = requestAnimationFrame(frame);
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    inView = e.isIntersecting;
    if (inView && !raf) { dirty = true; raf = requestAnimationFrame(frame); }
  }), { threshold: 0.05 });
  io.observe(wrap);

  // init: scenario A selected
  picker.querySelector("button").classList.add("on");
  picker.querySelector("button").setAttribute("aria-selected", "true");
  buildScene(0);
  resize();

  // ── lazy3d controller hooks: resume when granted the active slot, announce init ──
  addEventListener("hcsp3d:active", e => {
    if (e.detail === "scenarios3d" && inView && !raf) { dirty = true; raf = requestAnimationFrame(frame); }
  });
  window.dispatchEvent(new CustomEvent("hcsp3d:ready", { detail: "scenarios3d" }));
})();
