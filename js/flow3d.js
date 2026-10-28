// ═══ 3D process flow — "Follow the waste through the plant" (Three.js, vendored r147) ═══
// Stylized HCSP plant with material/energy flows:
//   influent wastewater → [electrolyzer → combustion → SCWO reactor → separator]
//   → distilled water + inert solids + heat; heat splits to power (turbine),
//   ammonia closed-loop cooling (chiller), and hot-water reuse.
// Click any component or flow → drill-style info panel (one plain-English
// sentence + the key numbers). EXPLODE toggle separates components vertically.
// "WALK ME THROUGH IT" steps through the four stages with a plain caption each.
// Render-on-demand (dirty flag); reading mode = static assembled frame;
// rendering pauses offscreen via IntersectionObserver.
// Integration: <div id="flow3d"></div> after vendor/three.min.js + vendor/OrbitControls.js.
(function () {
  const wrap = document.getElementById("flow3d");
  if (!wrap || !window.THREE) return;
  wrap.classList.add("flow3d-wrap");
  const READER = () => document.documentElement.classList.contains("reader");

  // ── key numbers — same figures as js/data.js (RPT.spec / RPT.energy_scenarios[0]) ──
  const spec = (k, fb) => {
    try { const r = (window.RPT.spec || []).find(x => x.k === k); return r ? r.v : fb; }
    catch (e) { return fb; }
  };
  const scA = () => { try { return window.RPT.energy_scenarios[0].diagram; } catch (e) { return {}; } };
  const NUM = {
    cond: spec("Operating conditions", "380–420 °C · ~25 MPa (250 bar)"),
    water: spec("Water recovery", "85–95% to distillate; <10 µS/cm"),
    h2: spec("H₂ fuel loop (as briefed)", "~30–40 kg/day by on-demand electrolysis"),
    load: spec("Electrical load (startup/auxiliary)", "~75–95 kW"),
    thru: spec("Throughput", "10 m³/day (~2,640 gal/day)"),
    power: scA().power || "1.4 MW of electricity",
    cooling: scA().cooling || "4.9 MW of cooling (≈1,392 refrigeration tons)",
  };

  // ── one plain-English sentence + key numbers per clickable thing ──
  const INFO = {
    influent: { name: "Influent — the waste arrives",
      specs: "Example plant: 1,000 m³/day of strong waste (100 g/L COD) · module: " + NUM.thru,
      role: "Concentrated wastewater — the kind that is expensive to haul or illegal to dump — enters the plant here, and destroying it is the core paid service." },
    electrolyzer: { name: "Electrolyzer — makes the fuel",
      specs: NUM.h2 + " · self-fueling hydrogen loop per manufacturer",
      role: "It splits a trickle of the process water into hydrogen fuel on demand, so the plant carries no fuel tank and buys no fuel once it is running." },
    combustor: { name: "Combustion chamber",
      specs: "H₂ flame >3,000 °F (≈1,650 °C) · grid power only for the " + NUM.load + " startup/auxiliary load",
      role: "It burns the electrolyzer's hydrogen to heat the system, which is why the manufacturer calls the loop self-fueling after startup." },
    reactor: { name: "SCWO reactor — where destruction happens",
      specs: NUM.cond + " · just above water's critical point (374 °C, 22.1 MPa)",
      role: "At this heat and pressure water turns supercritical — neither liquid nor gas — and the organic waste mixed into it burns up completely in seconds." },
    separator: { name: "Separator / condenser",
      specs: "Splits the reactor output into water, solids, and heat · the only exhaust is water vapor (no air permit claimed)",
      role: "It cools and depressurizes what leaves the reactor and sorts it into the three things the plant hands back: clean water, inert solids, and usable heat." },
    waterOut: { name: "Distilled water out",
      specs: NUM.water + " · ≈900 m³/day at the example plant",
      role: "Most of the water that carried the waste comes back distilled-quality — purer than tap water — ready for reuse or discharge." },
    solidsOut: { name: "Inert solids out",
      specs: "Contained, fully broken-down salts/oxides · a small fraction of the feed volume",
      role: "Whatever could not be destroyed leaves as a small amount of inert, contained solid — a disposal task, not a hazard." },
    heatHub: { name: "Surplus heat — the energy the waste paid for",
      specs: "Example plant: 16.1 MW released → 9.6 MW surplus after the plant preheats its own feed",
      role: "Destroying strong waste releases more heat than the process needs, and this hub is where that spare heat is sent out to earn money." },
    turbine: { name: "Power generation — small steam turbine",
      specs: NUM.power + " ≈ $1.12M/yr at the example plant (illustrative)",
      role: "A small turbine turns part of the spare heat into electricity that can be used on site or sold to a neighbor." },
    chiller: { name: "Ammonia closed-loop cooling",
      specs: NUM.cooling + " at the example plant · closed loop — the ammonia never touches the product",
      role: "A heat-driven ammonia chiller turns spare heat into deep cold for freezers and cold stores, replacing most of their electric-compressor run time." },
    heatReuse: { name: "Hot-water / heat reuse",
      specs: "Hot water at 150–180 °C available · heat sells at $10–30 per MWh where networks exist",
      role: "The rest of the spare heat leaves as hot water or steam for a host that already burns fuel to make it — the simplest energy sale on the menu." },
    // flows (pipes)
    fWasteIn: { name: "Flow — waste in",
      specs: "Strong enough to make spare heat: above ~35–60 g/L COD; the example uses 100 g/L",
      role: "This pipe carries the concentrated waste into the plant; below the strength threshold the plant heats itself and has nothing left to sell." },
    fH2: { name: "Flow — hydrogen fuel",
      specs: NUM.h2,
      role: "Hydrogen made minutes ago from the plant's own water travels here to be burned for heat — made on demand, never stored." },
    fHot: { name: "Flow — preheat into the reactor",
      specs: NUM.cond,
      role: "Combustion heat rides this line into the reactor, taking the feed past the critical point so destruction can begin." },
    fReactOut: { name: "Flow — reactor output",
      specs: "Hot, pressurized, and clean: the waste is already destroyed by this point",
      role: "What leaves the reactor is hot water carrying broken-down minerals — the destruction is done; only sorting remains." },
    fWater: { name: "Flow — distilled water",
      specs: NUM.water,
      role: "This line carries the recovered distilled-quality water to storage or straight to a buyer." },
    fSolids: { name: "Flow — inert solids",
      specs: "Contained sludge of broken-down salts and oxides",
      role: "A trickle of inert solids drops out here — fully broken down, contained, and ready for ordinary disposal." },
    fHeat: { name: "Flow — surplus heat",
      specs: "9.6 MW of surplus heat at the 1,000 m³/day example plant",
      role: "This is the pipe that turns a waste bill into an energy business — spare heat on its way to power, cooling, or hot water." },
    fPower: { name: "Flow — heat to power",
      specs: NUM.power + " at the example plant",
      role: "Part of the spare heat drives the turbine and leaves as electricity." },
    fCool: { name: "Flow — heat to cooling",
      specs: NUM.cooling + " at the example plant",
      role: "Part of the spare heat drives the closed-loop ammonia chiller and leaves as cold." },
    fReuse: { name: "Flow — heat to hot water",
      specs: "Hot water at 150–180 °C",
      role: "The simplest destination: heat piped straight to someone who would otherwise burn fuel for it." },
    fVapor: { name: "The only exhaust — water vapor",
      specs: "Sealed system; no air permit claimed (manufacturer)",
      role: "Because the waste burns inside water in a sealed system, the only thing vented is water vapor — no smokestack, no combustion exhaust." },
  };

  // ── DOM: canvas + controls (integration supplies only the host div) ──
  const canvas = document.createElement("canvas");
  canvas.className = "flow3d-stage"; canvas.id = "flow3d-canvas";
  canvas.setAttribute("aria-label", "Interactive 3D diagram of the HCSP process flow: waste in, destruction, water, solids, and energy out");
  wrap.appendChild(canvas);
  const ui = document.createElement("div");
  ui.className = "flow3d-ui";
  ui.innerHTML = `<button type="button" id="flow3d-explode">EXPLODE ⇕</button>
    <button type="button" id="flow3d-walk">WALK ME THROUGH IT →</button>`;
  wrap.appendChild(ui);
  const hint = document.createElement("p");
  hint.className = "flow3d-hint";
  hint.textContent = "DRAG TO ORBIT · SCROLL OR PINCH TO ZOOM · CLICK A COMPONENT OR PIPE";
  wrap.appendChild(hint);
  const cap = document.createElement("div");
  cap.className = "flow3d-caption";
  cap.innerHTML = `<span class="fc-step"></span><span class="fc-text"></span>
    <span class="fc-btns"><button type="button" class="fc-next">NEXT →</button><button type="button" class="fc-skip">SKIP ✕</button></span>`;
  wrap.appendChild(cap);

  // ── renderer ──
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    wrap.innerHTML = "<p style='padding:40px;font-family:var(--mono,Menlo,monospace);font-size:13px'>WebGL is unavailable in this browser — the 3D flow diagram cannot start.</p>";
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 200);
  camera.position.set(2.5, 7.5, 15.5);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
  const sun = new THREE.DirectionalLight(0xffffff, 0.75);
  sun.position.set(6, 12, 8);
  scene.add(sun);

  // palette — ink family + #2251ff accent; semantic red only for waste; copper = heat; green = cooling
  const MAT = {
    frame:  new THREE.MeshStandardMaterial({ color: 0x5d7186, roughness: 0.6, metalness: 0.35 }),
    vessel: new THREE.MeshStandardMaterial({ color: 0xc9d5e1, roughness: 0.35, metalness: 0.55 }),
    dark:   new THREE.MeshStandardMaterial({ color: 0x42566a, roughness: 0.45, metalness: 0.5 }),
    box:    new THREE.MeshStandardMaterial({ color: 0xeef1f5, roughness: 0.8, metalness: 0.1 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x2251ff, roughness: 0.4, metalness: 0.2 }),
    heat:   new THREE.MeshStandardMaterial({ color: 0xb07a10, roughness: 0.5, metalness: 0.3, emissive: 0x2a1a04 }),
    cool:   new THREE.MeshStandardMaterial({ color: 0x008a6d, roughness: 0.5, metalness: 0.2 }),
    waste:  new THREE.MeshStandardMaterial({ color: 0xc22f4e, roughness: 0.55, metalness: 0.2 }),
    waterM: new THREE.MeshStandardMaterial({ color: 0x7d9bff, roughness: 0.3, metalness: 0.3 }),
  };
  const PIPE_MAT = {
    waste: MAT.waste, h2: MAT.accent, hot: MAT.heat, water: MAT.waterM,
    solids: MAT.dark, cool: MAT.cool, vapor: new THREE.MeshStandardMaterial({ color: 0xb9c6d4, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 0.75 }),
  };

  const clickable = [];
  const components = []; // { group } with userData.key / userData.lift
  function comp(key, lift) {
    const g = new THREE.Group();
    g.userData.key = key; g.userData.lift = lift;
    components.push(g); scene.add(g);
    return g;
  }
  function mesh(g, geo, mat, x, y, z) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); g.add(m);
    return m;
  }
  function tube(g, x1, y1, z1, x2, y2, z2, r, mat, flowKey) {
    const a = new THREE.Vector3(x1, y1, z1), b = new THREE.Vector3(x2, y2, z2);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), 12), mat);
    m.position.copy(a).lerp(b, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    g.add(m);
    if (flowKey) {
      m.userData.key = flowKey; clickable.push(m);
      flows.push({ a, b, mesh: m, key: flowKey, markers: [] });
    }
    return m;
  }
  const flows = []; // animated flow markers travel along these

  // ══ components ══
  // influent tank (left)
  const influent = comp("influent", 0);
  mesh(influent, new THREE.BoxGeometry(1.5, 1.7, 1.7), MAT.dark, -7.6, 1.0, 0);
  mesh(influent, new THREE.CylinderGeometry(0.86, 0.86, 0.18, 24), MAT.frame, -7.6, 1.94, 0);
  [-8.1, -7.1].forEach(x => mesh(influent, new THREE.BoxGeometry(0.14, 0.35, 1.5), MAT.frame, x, 0.17, 0));

  // base skid platform
  const skid = comp("skid", 0);
  mesh(skid, new THREE.BoxGeometry(7.8, 0.2, 3.4), MAT.frame, -1.6, 0.1, 0);

  // electrolyzer (self-fueling H₂ loop)
  const elec = comp("electrolyzer", 1.1);
  mesh(elec, new THREE.BoxGeometry(1.05, 1.3, 1.05), MAT.accent, -4.4, 0.85, 1.0);
  mesh(elec, new THREE.BoxGeometry(0.72, 0.16, 0.72), MAT.vessel, -4.4, 1.58, 1.0);

  // combustion chamber (horizontal)
  const comb = comp("combustor", 2.0);
  const combBody = mesh(comb, new THREE.CylinderGeometry(0.4, 0.4, 1.5, 24), MAT.heat, -2.5, 0.85, 1.0);
  combBody.rotation.z = Math.PI / 2;

  // SCWO reactor (pressure vessel)
  const reac = comp("reactor", 2.2);
  mesh(reac, new THREE.CylinderGeometry(0.6, 0.6, 2.4, 28), MAT.dark, -0.5, 1.5, 0);
  mesh(reac, new THREE.SphereGeometry(0.6, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), MAT.dark, -0.5, 2.7, 0);
  mesh(reac, new THREE.SphereGeometry(0.6, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MAT.dark, -0.5, 0.3, 0);
  [0.95, 1.55, 2.15].forEach(yy => {
    const t = mesh(reac, new THREE.TorusGeometry(0.63, 0.045, 10, 32), MAT.vessel, -0.5, yy, 0);
    t.rotation.x = Math.PI / 2;
  });

  // separator / condenser (horizontal drum + vapor column)
  const sepa = comp("separator", 3.2);
  const drum = mesh(sepa, new THREE.CylinderGeometry(0.5, 0.5, 1.7, 24), MAT.vessel, 1.6, 0.95, -0.9);
  drum.rotation.z = Math.PI / 2;
  mesh(sepa, new THREE.CylinderGeometry(0.26, 0.26, 1.2, 20), MAT.box, 2.6, 1.1, -0.9);

  // distilled-water tank
  const waterOut = comp("waterOut", 0.6);
  mesh(waterOut, new THREE.CylinderGeometry(0.72, 0.72, 1.35, 26), MAT.waterM, 4.3, 0.68, -2.5);
  mesh(waterOut, new THREE.SphereGeometry(0.72, 26, 12, 0, Math.PI * 2, 0, Math.PI / 2), MAT.waterM, 4.3, 1.35, -2.5);

  // inert-solids bin
  const solidsOut = comp("solidsOut", 0.5);
  mesh(solidsOut, new THREE.BoxGeometry(1.0, 0.85, 1.0), MAT.dark, 4.7, 0.43, -0.6);
  mesh(solidsOut, new THREE.BoxGeometry(1.12, 0.1, 1.12), MAT.frame, 4.7, 0.9, -0.6);

  // heat hub (splitter node)
  const heatHub = comp("heatHub", 2.2);
  mesh(heatHub, new THREE.SphereGeometry(0.42, 24, 16), MAT.heat, 3.4, 1.5, 1.2);
  mesh(heatHub, new THREE.CylinderGeometry(0.1, 0.14, 1.15, 12), MAT.dark, 3.4, 0.58, 1.2);

  // turbine (power generation)
  const turbine = comp("turbine", 1.4);
  mesh(turbine, new THREE.BoxGeometry(1.25, 0.95, 0.95), MAT.accent, 6.3, 0.48, 0.2);
  const shaft = mesh(turbine, new THREE.CylinderGeometry(0.16, 0.16, 1.5, 16), MAT.vessel, 6.3, 1.05, 0.2);
  shaft.rotation.z = Math.PI / 2;
  mesh(turbine, new THREE.CylinderGeometry(0.42, 0.42, 0.16, 24), MAT.vessel, 5.6, 1.05, 0.2).rotation.z = Math.PI / 2;
  mesh(turbine, new THREE.BoxGeometry(0.5, 1.3, 0.5), MAT.box, 7.15, 0.65, 0.2);

  // ammonia closed-loop chiller
  const chiller = comp("chiller", 1.35);
  mesh(chiller, new THREE.BoxGeometry(1.3, 1.15, 0.95), MAT.cool, 6.3, 0.58, 1.9);
  mesh(chiller, new THREE.CylinderGeometry(0.3, 0.3, 0.5, 20), MAT.vessel, 6.3, 1.4, 1.9);
  const loop = mesh(chiller, new THREE.TorusGeometry(0.34, 0.05, 10, 28), MAT.cool, 6.3, 1.62, 1.9);
  loop.rotation.x = Math.PI / 2;

  // hot-water / heat reuse block
  const heatReuse = comp("heatReuse", 3.5);
  mesh(heatReuse, new THREE.BoxGeometry(1.3, 1.3, 1.1), MAT.box, 6.3, 0.65, 3.5);
  const roof = mesh(heatReuse, new THREE.CylinderGeometry(0.68, 0.68, 1.3, 3, 1), MAT.heat, 6.3, 1.55, 3.5);
  roof.rotation.y = Math.PI / 6; roof.scale.set(1, 0.55, 1);

  // ══ flows (clickable pipes + animated markers) ══
  const pipeG = comp("piping", 1.6);
  tube(pipeG, -7.0, 0.9, 0, -5.6, 0.55, 0.35, 0.11, PIPE_MAT.waste, "fWasteIn");   // tank → skid
  tube(pipeG, -5.6, 0.55, 0.35, -0.9, 0.55, 0.25, 0.11, PIPE_MAT.waste, "fWasteIn"); // along skid → reactor
  tube(pipeG, -4.4, 1.6, 1.0, -3.3, 0.9, 1.0, 0.08, PIPE_MAT.h2, "fH2");          // electrolyzer → combustor
  tube(pipeG, -1.75, 0.85, 1.0, -0.9, 1.35, 0.35, 0.1, PIPE_MAT.hot, "fHot");     // combustor → reactor
  tube(pipeG, -0.5, 2.95, 0, 0.6, 1.4, -0.9, 0.11, PIPE_MAT.hot, "fReactOut");    // reactor → separator
  tube(pipeG, 0.75, 0.95, -0.9, 3.7, 0.75, -2.2, 0.1, PIPE_MAT.water, "fWater");  // separator → water tank
  tube(pipeG, 2.45, 0.85, -0.9, 4.25, 0.6, -0.65, 0.09, PIPE_MAT.solids, "fSolids"); // separator → solids bin
  tube(pipeG, 1.9, 1.35, -0.7, 3.15, 1.5, 0.95, 0.12, PIPE_MAT.hot, "fHeat");     // reactor/separator → heat hub
  tube(pipeG, 3.8, 1.45, 1.25, 5.65, 1.0, 0.35, 0.09, PIPE_MAT.hot, "fPower");    // hub → turbine
  tube(pipeG, 3.75, 1.55, 1.45, 5.7, 0.95, 1.85, 0.09, PIPE_MAT.hot, "fCool");    // hub → chiller
  tube(pipeG, 3.6, 1.7, 1.5, 5.75, 0.95, 3.35, 0.09, PIPE_MAT.hot, "fReuse");     // hub → hot-water reuse
  tube(pipeG, 2.6, 1.7, -0.9, 2.6, 3.1, -0.9, 0.06, PIPE_MAT.vapor, "fVapor");    // vapor vent up
  // short output stubs (visual, not clickable)
  tube(pipeG, 6.85, 1.05, 0.2, 7.7, 1.05, 0.2, 0.06, MAT.accent, null);           // electricity out
  tube(pipeG, 6.3, 1.05, 2.38, 6.3, 1.05, 2.95, 0.07, MAT.cool, null);            // cold out

  // flow markers (small spheres riding each clickable pipe; static in reading mode)
  flows.forEach(f => {
    const n = f.a.distanceTo(f.b) > 2.6 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8),
        new THREE.MeshBasicMaterial({ color: f.mesh.material.color }));
      s.userData.t = (i + 0.5) / n;
      pipeG.add(s); f.markers.push(s);
    }
  });
  function placeMarkers() {
    flows.forEach(f => f.markers.forEach(s => {
      s.position.copy(f.a).lerp(f.b, s.userData.t);
    }));
  }
  placeMarkers();

  // ground
  const ground = new THREE.Mesh(new THREE.CircleGeometry(11.5, 56),
    new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.8 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12;
  scene.add(ground);

  // ══ labels (HTML chips, projected; ≥12px, AA pairs, offsets tuned to never overlap) ══
  // per label: [key, text, class, anchor, dx px, dy px, dyExploded px (extra offset when exploded)]
  const LABELS = [
    ["influent",  "INFLUENT — WASTE IN", "waste", new THREE.Vector3(-7.6, 2.15, 0), 0, 0, 0],
    ["electrolyzer", "ELECTROLYZER · H₂ FUEL", "accent", new THREE.Vector3(-4.4, 2.4, 1.0), -50, -40, 0],
    ["combustor", "COMBUSTION · >3,000 °F", "heat", new THREE.Vector3(-2.5, 1.4, 1.3), 0, 0, 0],
    ["reactor",   "SCWO REACTOR · 380–420 °C · 250 BAR", "", new THREE.Vector3(-0.5, 3.6, 0), 0, 0, 46],
    ["separator", "SEPARATOR", "", new THREE.Vector3(1.6, 1.7, -0.9), -40, 34, 0],
    ["waterOut",  "DISTILLED WATER · 85–95%", "accent", new THREE.Vector3(4.3, 1.9, -2.5), 30, -45, -8],
    ["solidsOut", "INERT SOLIDS", "", new THREE.Vector3(4.7, 1.15, -0.6), -60, 0, 0],
    ["heatHub",   "SURPLUS HEAT · 9.6 MW", "heat", new THREE.Vector3(3.4, 2.8, 1.2), 0, -9, -40],
    ["turbine",   "TURBINE — ≈1.4 MW ELECTRICITY", "accent", new THREE.Vector3(6.3, 2.0, 0.2), 0, -12, 0],
    ["chiller",   "NH₃ CHILLER — ≈4.9 MW COOLING", "cool", new THREE.Vector3(6.3, 2.15, 1.9), 0, 2, 0],
    ["heatReuse", "HOT WATER · 150–180 °C", "heat", new THREE.Vector3(6.3, 2.3, 3.5), -40, 0, 0],
  ].map(([key, text, cls, v, dx, dy, dyx]) => {
    const el = document.createElement("div");
    el.className = "flow3d-label" + (cls ? " " + cls : "");
    el.textContent = text;
    el.style.transform = "translate(-50%,-120%)";
    wrap.appendChild(el);
    return { key, el, v, dx, dy, dyx };
  });

  // register component meshes as clickable
  components.forEach(g => g.traverse(o => {
    if (o.isMesh && !o.userData.key && o.parent === g) { o.userData.key = g.userData.key; clickable.push(o); }
  }));

  // ── controls ──
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.autoRotate = false;
  controls.target.set(0.2, 1.2, 0.4);
  controls.minDistance = 5; controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI * 0.52;

  // ── EXPLODE toggle (components separate vertically) ──
  let exploded = false, explodeT = 0, dirty = true, inView = false, raf = 0;
  const exBtn = ui.querySelector("#flow3d-explode");
  exBtn.addEventListener("click", () => {
    exploded = !exploded;
    exBtn.classList.toggle("on", exploded);
    exBtn.textContent = exploded ? "ASSEMBLE ⇓" : "EXPLODE ⇕";
    dirty = true; poke();
  });

  // ── walkthrough: four stages, one plain caption each ──
  const STEPS = [
    { key: "electrolyzer", caption: "First, the plant makes its own fuel: the electrolyzer splits a little of the process water into hydrogen, on demand — nothing is stored or trucked in." },
    { key: "combustor", caption: "Next, that hydrogen burns at over 3,000 °F. The flame supplies the heat; after startup the loop fuels itself, per the manufacturer." },
    { key: "reactor", caption: "Then the waste meets water heated to 380–420 °C at 250 bar — a state where organics and oxygen mix completely, and the waste is destroyed in seconds." },
    { key: "separator", caption: "Finally, the separator sorts what comes out: distilled water, a little inert solid, and heat that can become power, cooling, or hot water." },
  ];
  let walkIdx = -1; // -1 = off
  const walkBtn = ui.querySelector("#flow3d-walk");
  const capStep = cap.querySelector(".fc-step"), capText = cap.querySelector(".fc-text");
  const capNext = cap.querySelector(".fc-next"), capSkip = cap.querySelector(".fc-skip");
  const hl = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.05, 10, 48),
    new THREE.MeshBasicMaterial({ color: 0x2251ff }));
  hl.rotation.x = Math.PI / 2; hl.visible = false;
  scene.add(hl);
  function walkTo(i) {
    walkIdx = i;
    if (i < 0 || i >= STEPS.length) {
      walkIdx = -1; hl.visible = false; cap.classList.remove("on");
      walkBtn.classList.remove("on"); walkBtn.textContent = "WALK ME THROUGH IT →";
      dirty = true; poke(); return;
    }
    const g = components.find(c => c.userData.key === STEPS[i].key);
    if (g) {
      const box = new THREE.Box3().setFromObject(g);
      const c = box.getCenter(new THREE.Vector3());
      hl.position.set(c.x, Math.max(0.16, box.min.y + 0.06), c.z);
      const s = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / 2 + 0.35;
      hl.scale.set(s / 1.15, s / 1.15, 1);
      hl.visible = true;
    }
    capStep.textContent = "STEP " + (i + 1) + " OF " + STEPS.length;
    capText.textContent = STEPS[i].caption;
    capNext.textContent = i === STEPS.length - 1 ? "DONE ✓" : "NEXT →";
    cap.classList.add("on");
    walkBtn.classList.add("on"); walkBtn.textContent = "WALKING… STEP " + (i + 1) + "/4";
    dirty = true; poke();
  }
  walkBtn.addEventListener("click", () => walkTo(walkIdx < 0 ? 0 : -1));
  capNext.addEventListener("click", () => walkTo(walkIdx + 1));
  capSkip.addEventListener("click", () => walkTo(-1));

  // ── info panel (drill-card pattern, self-contained) ──
  let info = null;
  function showInfo(key) {
    const d = INFO[key];
    if (!d) return;
    if (!info) { info = document.createElement("div"); info.className = "flow3d-info"; wrap.appendChild(info); }
    info.innerHTML = `<button class="fi-close" aria-label="Close">✕</button><h4>${d.name}</h4>
      <p class="fi-specs">${d.specs}</p><p class="fi-role">${d.role}</p>`;
    info.querySelector(".fi-close").onclick = () => { info.remove(); info = null; };
  }
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
  function poke() { if (READER() && inView && !raf) raf = requestAnimationFrame(frame); }
  controls.addEventListener("change", () => { dirty = true; poke(); });
  function resize() {
    const w = wrap.clientWidth, h = canvas.clientHeight || 560;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    dirty = true; poke();
  }
  addEventListener("resize", resize, { passive: true });
  let lastT = 0;
  function frame(t) {
    raf = 0;
    if (!inView) return;
    // explode animation (instant, static frame in reading mode)
    const tgt = exploded ? 1 : 0;
    if (READER()) {
      if (explodeT !== tgt) {
        explodeT = tgt;
        components.forEach(g => { g.position.y = g.userData.lift * explodeT; });
        placeMarkers(); dirty = true;
      }
    } else if (Math.abs(explodeT - tgt) > 0.01) {
      explodeT += (tgt - explodeT) * 0.18;
      components.forEach(g => { g.position.y = g.userData.lift * explodeT; });
      dirty = true;
    } else if (explodeT !== tgt) {
      explodeT = tgt;
      components.forEach(g => { g.position.y = g.userData.lift * explodeT; });
      dirty = true;
    }
    // flow markers ride the pipes (frozen in reading mode)
    if (!READER() && t != null) {
      const dt = Math.min(0.05, (t - lastT) / 1000 || 0);
      lastT = t;
      flows.forEach(f => f.markers.forEach(s => {
        s.userData.t = (s.userData.t + dt * 0.22) % 1;
        s.position.copy(f.a).lerp(f.b, s.userData.t);
      }));
      if (hl.visible) hl.rotation.z += dt * 0.8;
      dirty = true;
    }
    if (controls.enableDamping) controls.update();
    if (dirty || !READER()) {
      renderer.render(scene, camera);
      const w = wrap.clientWidth, h = canvas.clientHeight || 560;
      LABELS.forEach(L => {
        const p = L.v.clone();
        const g = components.find(c => c.userData.key === L.key);
        if (g) p.y += g.position.y;
        p.project(camera);
        const behind = p.z > 1;
        L.el.style.display = behind ? "none" : "";
        // clamp inside the canvas so chips never clip at the edges
        const halfW = L.el.offsetWidth / 2 || 60;
        const px = Math.max(halfW + 4, Math.min(w - halfW - 4, (p.x * 0.5 + 0.5) * w + L.dx));
        L.el.style.left = px + "px";
        L.el.style.top = ((-p.y * 0.5 + 0.5) * h + L.dy + explodeT * L.dyx) + "px";
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
  resize();
})();
