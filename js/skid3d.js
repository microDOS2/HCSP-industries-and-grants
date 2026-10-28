// ═══ §2B · "Inside the HCSP" — interactive 3D skid explorer (Three.js, vendored) ═══
// Stylized but recognizable: base frame, HP pump, electrolyzer (self-fueling H₂ loop),
// combustion chamber, SCWO reactor (pressure vessel), separator/condenser, piping.
// Orbit/zoom (mouse + touch) · EXPLODE toggle · clickable components → info panel.
// Render-on-demand (dirty flag) — reading mode gets a static assembled frame;
// rendering pauses offscreen via IntersectionObserver.
(function () {
  const wrap = document.getElementById("skid3d");
  if (!wrap || !window.THREE) return;
  const canvas = wrap.querySelector("canvas");
  const READER = () => document.documentElement.classList.contains("reader");

  const INFO = {
    reactor: {
      name: "SCWO reactor — pressure vessel",
      specs: "380–420 °C · 25 MPa (250 bar) · just above the critical point",
      role: "The core: above 374 °C and 22.1 MPa, water enters a state that is neither liquid nor gas, in which organic waste and oxygen mix completely and the waste burns up in seconds to minutes. Hydrogen burns above 3,000 °F directly in the reactor, so salt deposition never starts — the manufacturer reports no salt issues.",
    },
    electrolyzer: {
      name: "Electrolyzer — self-fueling H₂ loop",
      specs: "~30–40 kg H₂/day, generated on demand from process water",
      role: "Per the manufacturer briefing, a portion of the process water is electrolyzed on demand; the clean H₂/O₂ is combusted for process heat. Fuel is made as needed — never purchased or stored — at negligible net energy cost once started.",
    },
    combustor: {
      name: "Combustion chamber",
      specs: "H₂/O₂ flame >3,000 °F (≈1,650 °C) · drives SCWO preheat",
      role: "Burns the electrolyzer's hydrogen to preheat the reactor. Grid electricity covers only the 75–95 kW startup power spec — the loop is self-fueling in operation per the manufacturer.",
    },
    separator: {
      name: "Separator / condenser",
      specs: "Outputs: 85–95% distilled water (<10 µS/cm conductivity — purer than tap water) · inert sludge",
      role: "Cools and depressurizes the reactor output. Distilled-quality water and a contained, fully broken-down sludge leave here; on concentrated feeds the train also exports power and cooling. The only gaseous stream is vented water vapor — no air permit.",
    },
    pump: {
      name: "High-pressure feed pump",
      specs: "10 m³/day (~2,640 gal/day) · pressurizes to 250 bar",
      role: "The first of two energy inputs: concentrated feed (≥60–150 g/L COD — a measure of how much organic waste is in the water — or an upstream concentrate) is pressurized so the water cannot boil on its way past the critical point.",
    },
    skid: {
      name: "Base frame — container-class skid",
      specs: "8–10 m² footprint · under 3 m tall · quieter than 75 dB at 1 m",
      role: "Indoor-sited and deployable at the point of waste generation, not at a central plant. Module purchase cost is TBD — manufacturer cost model pending; the AirSCWO 6's $5.2M contract is the market reference point, not an HCSP price.",
    },
    piping: {
      name: "High-pressure piping train",
      specs: "250 bar rated · heat-recovery loop",
      role: "Connects pump → preheat → reactor → separator. A well-designed heat-recovery train recovers 70–85% of the reaction heat — 6.5 MW of a hub's gross heat is spoken for before anything can be sold.",
    },
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    wrap.innerHTML = "<p style='padding:40px;font-family:var(--mono);font-size:13px'>WebGL is unavailable in this browser — the 3D explorer cannot start. The machine section above covers the same components in 2D.</p>";
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 100);
  camera.position.set(7.5, 5.2, 9.5);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
  const sun = new THREE.DirectionalLight(0xffffff, 0.75);
  sun.position.set(6, 10, 7);
  scene.add(sun);

  const MAT = {
    frame: new THREE.MeshStandardMaterial({ color: 0x5d7186, roughness: 0.6, metalness: 0.35 }),
    vessel: new THREE.MeshStandardMaterial({ color: 0xc9d5e1, roughness: 0.35, metalness: 0.55 }),
    reactor: new THREE.MeshStandardMaterial({ color: 0x9fb4c8, roughness: 0.3, metalness: 0.6 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x2251ff, roughness: 0.4, metalness: 0.2 }),
    hot: new THREE.MeshStandardMaterial({ color: 0xc9752f, roughness: 0.5, metalness: 0.3, emissive: 0x3a1a05 }),
    pipe: new THREE.MeshStandardMaterial({ color: 0x42566a, roughness: 0.45, metalness: 0.5 }),
    box: new THREE.MeshStandardMaterial({ color: 0xeef1f5, roughness: 0.8, metalness: 0.1 }),
  };

  const clickable = [];
  const components = []; // { group, baseY, lift }
  function comp(key, lift) {
    const g = new THREE.Group();
    g.userData.key = key;
    g.userData.lift = lift;
    components.push(g);
    scene.add(g);
    return g;
  }
  function registerClickables() {
    components.forEach(g => g.traverse(o => {
      if (o.isMesh) { o.userData.key = g.userData.key; clickable.push(o); }
    }));
  }
  function mesh(geo, mat, x, y, z) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    return m;
  }

  // ── base skid frame ──
  const skid = comp("skid", 0);
  skid.add(mesh(new THREE.BoxGeometry(6.4, 0.22, 2.8), MAT.frame, 0, 0.11, 0));
  [-2.2, 0, 2.2].forEach(rx => skid.add(mesh(new THREE.BoxGeometry(0.5, 0.22, 2.9), MAT.frame, rx, -0.02, 0)));

  // ── HP pump block ──
  const pump = comp("pump", 0.9);
  pump.add(mesh(new THREE.BoxGeometry(0.9, 0.7, 0.9), MAT.box, -2.55, 0.57, 0.6));
  pump.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 20), MAT.pipe, -2.55, 1.05, 0.6));

  // ── electrolyzer (self-fueling loop) ──
  const elec = comp("electrolyzer", 2.1);
  elec.add(mesh(new THREE.BoxGeometry(1.0, 1.25, 1.0), MAT.accent, -0.9, 0.85, 0.75));
  elec.add(mesh(new THREE.BoxGeometry(0.7, 0.18, 0.7), MAT.vessel, -0.9, 1.56, 0.75));

  // ── combustion chamber (horizontal) ──
  const comb = comp("combustor", 3.1);
  comb.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.5, 24), MAT.hot, 0.55, 0.75, 0.75));
  comb.children[0].rotation.z = Math.PI / 2;

  // ── SCWO reactor (pressure vessel) ──
  const reac = comp("reactor", 4.3);
  const vessel = mesh(new THREE.CylinderGeometry(0.62, 0.62, 2.5, 28), MAT.reactor, 1.9, 1.55, 0);
  reac.add(vessel);
  reac.add(mesh(new THREE.SphereGeometry(0.62, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), MAT.reactor, 1.9, 2.8, 0));
  reac.add(mesh(new THREE.SphereGeometry(0.62, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MAT.reactor, 1.9, 0.3, 0));
  [0.9, 1.55, 2.2].forEach(yy => reac.add(mesh(new THREE.TorusGeometry(0.65, 0.045, 10, 32), MAT.pipe, 1.9, yy, 0)));
  reac.children.slice(3).forEach(t => { t.rotation.x = Math.PI / 2; });

  // ── separator / condenser (horizontal drum + condenser column) ──
  const sepa = comp("separator", 5.4);
  const drum = mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.7, 24), MAT.vessel, 0.9, 0.9, -0.85);
  drum.rotation.z = Math.PI / 2;
  sepa.add(drum);
  sepa.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.1, 20), MAT.box, 2.2, 1.0, -0.85));

  // ── piping (segments along the process path) ──
  const pipe = comp("piping", 1.5);
  function tube(x1, y1, z1, x2, y2, z2, r) {
    const a = new THREE.Vector3(x1, y1, z1), b = new THREE.Vector3(x2, y2, z2);
    const len = a.distanceTo(b);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), MAT.pipe);
    m.position.copy(a).lerp(b, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return m;
  }
  pipe.add(tube(-2.55, 1.3, 0.6, -0.9, 1.5, 0.75, 0.09));   // pump → electrolyzer takeoff
  pipe.add(tube(-0.9, 1.62, 0.75, 0.0, 0.75, 0.75, 0.09));   // electrolyzer → combustor (H₂)
  pipe.add(tube(1.3, 0.75, 0.75, 1.9, 1.4, 0.1, 0.11));      // combustor → reactor
  pipe.add(tube(1.9, 0.5, -0.3, 1.4, 0.9, -0.85, 0.11));     // reactor → separator
  pipe.add(tube(2.2, 1.55, -0.85, 2.2, 2.2, -0.85, 0.07));   // vapor vent up

  // ground grid shadow-catcher plane (visual only)
  const ground = new THREE.Mesh(new THREE.CircleGeometry(6.5, 48),
    new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.8 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.16;
  scene.add(ground);

  // ── labels (HTML overlay, projected) ──
  const LABELS = [
    ["reactor", "SCWO REACTOR · 380–420 °C · 250 BAR", new THREE.Vector3(1.9, 3.1, 0)],
    ["electrolyzer", "ELECTROLYZER · SELF-FUELING H₂ LOOP", new THREE.Vector3(-0.9, 1.95, 0.75)],
    ["combustor", "COMBUSTION CHAMBER · >3,000 °F", new THREE.Vector3(0.55, 1.35, 0.75)],
    ["separator", "SEPARATOR / CONDENSER", new THREE.Vector3(0.9, 1.65, -0.85)],
    ["pump", "HIGH-PRESSURE FEED PUMP · 250 BAR", new THREE.Vector3(-2.55, 1.5, 0.6)],
    ["skid", "CONTAINER-CLASS SKID · 8–10 M²", new THREE.Vector3(-1.2, 0.3, -1.4)],
  ].map(([key, text, v]) => {
    const el = document.createElement("div");
    el.className = "skid3d-label"; el.textContent = text;
    el.style.position = "absolute"; el.style.transform = "translate(-50%,-120%)";
    wrap.appendChild(el);
    return { key, el, v };
  });

  registerClickables();

  // ── controls ──
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.autoRotate = false;                    // static assembled frame; no auto-rotation
  controls.target.set(0.3, 1.3, 0);
  controls.minDistance = 4; controls.maxDistance = 22;
  controls.maxPolarAngle = Math.PI * 0.52;

  // explode state
  let exploded = false, explodeT = 0;
  const exBtn = document.getElementById("skid3d-explode");
  exBtn.addEventListener("click", () => {
    exploded = !exploded;
    exBtn.classList.toggle("on", exploded);
    exBtn.textContent = exploded ? "ASSEMBLE ⇓" : "EXPLODE ⇕";
    dirty = true;
    if (READER() && inView && !raf) raf = requestAnimationFrame(frame);
  });

  // info panel
  let info = null;
  function showInfo(key) {
    const d = INFO[key];
    if (!d) return;
    if (!info) {
      info = document.createElement("div");
      info.className = "skid3d-info";
      wrap.appendChild(info);
    }
    info.innerHTML = `<button class="si-close">✕</button><h4>${d.name}</h4>
      <p class="si-specs">${d.specs}</p><p class="si-role">${d.role}</p>`;
    info.querySelector(".si-close").onclick = () => { info.remove(); info = null; };
  }
  // click (not drag) → pick component
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

  // ── render-on-demand loop (pauses offscreen; static in reading mode) ──
  let dirty = true, inView = false, raf = 0;
  controls.addEventListener("change", () => {
    dirty = true;
    if (READER() && inView && !raf) raf = requestAnimationFrame(frame);
  });
  function resize() {
    const w = wrap.clientWidth, h = canvas.clientHeight || 560;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    dirty = true;
    if (READER() && inView && !raf) raf = requestAnimationFrame(frame);
  }
  addEventListener("resize", resize, { passive: true });
  function frame() {
    raf = 0;
    if (!inView) return;
    // explode animation (vertical separation); instant (static frame) in reading mode
    const tgt = exploded ? 1 : 0;
    if (READER()) {
      if (explodeT !== tgt) { explodeT = tgt; components.forEach(g => { g.position.y = g.userData.lift * explodeT; }); dirty = true; }
    } else if (Math.abs(explodeT - tgt) > 0.002) {
      explodeT += (tgt - explodeT) * 0.12;
      components.forEach(g => { g.position.y = g.userData.lift * explodeT; });
      dirty = true;
    }
    if (controls.enableDamping) controls.update();
    if (dirty || !READER()) {
      renderer.render(scene, camera);
      // project labels
      const w = wrap.clientWidth, h = canvas.clientHeight || 560;
      LABELS.forEach(L => {
        const p = L.v.clone();
        const g = components.find(c => c.userData.key === L.key);
        if (g) p.y += g.position.y;
        p.project(camera);
        const behind = p.z > 1;
        L.el.style.display = behind ? "none" : "";
        L.el.style.left = ((p.x * 0.5 + 0.5) * w) + "px";
        L.el.style.top = ((-p.y * 0.5 + 0.5) * h) + "px";
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
