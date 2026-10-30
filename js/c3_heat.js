/* ═══ 3D Chart 4 — "Heat flow in 3D": the trigeneration cascade ═══
   window.Chart3DHeat = { render(hostEl) }
   Self-contained IIFE. Requires: vendor/three.min.js, vendor/OrbitControls.js,
   js/data.js (window.RPT), js/sources.js (window.SRCS / window.K), css/c3.css.
   Continuous motion on load: glowing particles flow along every pipe (thickness
   ∝ MW), the reactor pulses, and the camera drifts. Pause button; Reading Mode
   via prefers-reduced-motion; rendering pauses offscreen (IntersectionObserver). */
(function () {
  "use strict";
  if (!window.RPT) { console.warn("Chart3DHeat: window.RPT missing — load js/data.js first."); return; }
  var RPT = window.RPT;
  var TG = RPT.trigen || {};

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function uniq(a) { var seen = {}, out = []; a.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } }); return out; }
  function srcDated(ids) {
    return uniq(ids || []).map(function (id) {
      var s = window.K ? window.K(id) : null;
      if (!s) return esc(id);
      var label = String(s.cite || "").split(",")[0].split("(")[0].trim();
      var date = s.date ? " (" + esc(s.date) + ")" : "";
      if (s.url) {
        return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
          esc(s.k) + " · " + esc(label) + " ↗</a>" + date;
      }
      return '<span class="c3-src-derived">' + esc(s.k) + " · " + esc(label) + date + " — derived analysis</span>";
    }).join(" · ");
  }
  function makeLabel(text, o) {
    o = o || {};
    var size = o.size || 34, pad = o.pad == null ? 12 : o.pad;
    var cv = document.createElement("canvas");
    var ctx = cv.getContext("2d");
    var font = (o.weight || 600) + " " + size + "px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.font = font;
    var tw = ctx.measureText(text).width;
    cv.width = Math.ceil(tw + pad * 2); cv.height = Math.ceil(size * 1.25 + pad * 2);
    ctx = cv.getContext("2d"); ctx.font = font;
    if (o.bg) {
      ctx.fillStyle = o.bg;
      var r = Math.min(14, cv.height / 2);
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.arcTo(cv.width, 0, cv.width, cv.height, r);
      ctx.arcTo(cv.width, cv.height, 0, cv.height, r);
      ctx.arcTo(0, cv.height, 0, 0, r); ctx.arcTo(0, 0, cv.width, 0, r);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = o.fg || "#051c2c";
    ctx.textBaseline = "middle"; ctx.textAlign = "center";
    ctx.fillText(text, cv.width / 2, cv.height / 2 + 1);
    var tex = new THREE.CanvasTexture(cv);
    tex.encoding = THREE.sRGBEncoding; tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
    var spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: o.depthTest !== false }));
    var h = o.worldH || 0.55;
    spr.scale.set(h * cv.width / cv.height, h, 1);
    return spr;
  }

  /* stage explanations — what each box means and what its output is worth */
  function stages() {
    var h = TG.hierarchy || [];
    return {
      reactor: {
        title: "The reactor — gross heat " + TG.gross + " MW",
        mean: "Destroying the waste releases heat: " + TG.gross + " MW of thermal power from a " + esc(TG.basis || "") +
          ". The waste itself is the fuel — no outside energy is burned.",
        value: "This is the starting pot. Everything downstream is a decision about how to spend it.",
        src: TG.src || []
      },
      preheat: {
        title: "Feed preheat — " + TG.preheat + " MW recycled",
        mean: "About 60% of the gross heat goes straight back into warming the incoming waste to reaction temperature. " +
          "This is the price of operation that makes its own heat from the waste — it never leaves the plant.",
        value: "Recovered internally; without this loop the process would need an outside fuel supply.",
        src: TG.src || []
      },
      surplus: {
        title: "Exportable surplus — " + TG.surplus + " MW",
        mean: "What is left after preheat: " + TG.surplus + " MW of heat to sell or use on site " +
          "(range " + (TG.surplus_range || []).join("–") + " MW depending on 70–85% heat-recovery efficiency).",
        value: "The optimal cascade is worth <b>" + esc(TG.value || "") + "</b> at 8,000 operating hours a year; " +
          "committing the whole surplus to cooling alone would be worth " + esc(TG.value_cooling_only || "") + ".",
        src: TG.src || []
      },
      turbine: {
        title: "Steam turbine — " + TG.power + " MW of electricity",
        mean: "The hottest slice of the surplus drives a small back-pressure/extraction turbine. " +
          "Power is the most flexible output but the least valuable per unit of heat.",
        value: h[0] ? "<b>" + esc(h[0].val) + " per " + esc(h[0].per) + "</b> — " + esc(h[0].note) : "",
        src: (h[0] && h[0].src) || []
      },
      chiller: {
        title: "Absorption chiller — " + TG.cooling_heat + " MW heat in → " + TG.cooling + " MW cooling",
        mean: "The turbine's exhaust heat (150–180 °C) drives an ammonia–water absorption chiller instead of an electric chiller. " +
          "Cooling is the bigger prize where cold storage or process refrigeration runs all day.",
        value: (h[1] ? "<b>" + esc(h[1].val) + " per " + esc(h[1].per) + "</b> — " + esc(h[1].note) + " " : "") +
          "Caution: " + esc(TG.limits || ""),
        src: uniq([].concat((h[1] && h[1].src) || [], TG.src || []))
      },
      hotwater: {
        title: "District hot / chilled water — sold retail",
        mean: "Where a metered district-cooling utility exists, the same heat can be sold as chilled water at retail tariffs " +
          "instead of being converted on site.",
        value: h[2] ? "<b>" + esc(h[2].val) + " per " + esc(h[2].per) + "</b> — " + esc(h[2].note) : "",
        src: (h[2] && h[2].src) || []
      },
      water: {
        title: "Recovered distilled water — " + esc(TG.water || ""),
        mean: "The feed is mostly water; it leaves the plant as distilled water clean enough to reuse or sell.",
        value: "Priced like desalination ($2–5/m³) only where water is scarce; elsewhere a modest credit.",
        src: TG.src || []
      },
      grid: {
        title: "Power out — " + TG.power + " MWₑ",
        mean: "Electricity exported to the host or the grid. Small next to the heat flows, but electricity is the easiest output to sell anywhere.",
        value: h[0] ? "<b>" + esc(h[0].val) + " per " + esc(h[0].per) + "</b> of heat fed to the turbine." : "",
        src: (h[0] && h[0].src) || []
      },
      cold: {
        title: "Cooling out — " + TG.cooling + " MW (≈1,392 refrigeration tons)",
        mean: "Chilled water for cold storage, food plants, or data halls — displacing electric chillers that would otherwise draw grid power.",
        value: h[1] ? "<b>" + esc(h[1].val) + " per " + esc(h[1].per) + "</b> on site; <b>" +
          esc(h[2] ? h[2].val : "") + " per " + esc(h[2] ? h[2].per : "") + "</b> where district chilled water is sold retail." : "",
        src: uniq([].concat((h[1] && h[1].src) || [], (h[2] && h[2].src) || []))
      }
    };
  }

  function render(hostEl) {
    if (!hostEl) return;
    if (!window.THREE || !THREE.OrbitControls) {
      hostEl.insertAdjacentHTML("beforeend", '<div class="c3-nogl">The 3D library did not load.</div>');
      return;
    }
    var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var STAGES = stages();

    var root = document.createElement("div");
    root.className = "c3-root c3-heat";
    root.innerHTML =
      '<div class="c3-head">' +
        '<h3 class="c3-title">Heat flow in 3D — where ' + esc(TG.gross) + ' MW of waste heat goes</h3>' +
        '<p class="c3-sub">A ' + esc(TG.basis || "") + '. Pipe thickness is proportional to megawatts; ' +
        'the glowing particles show the heat moving. Most of the heat is recycled to preheat the feed; ' +
        'the surplus cascades through a turbine into an absorption chiller. Click any stage for what it means and what it is worth per MWh.</p>' +
      '</div>' +
      '<div class="c3-stage">' +
        '<div class="c3-ui">' +
          '<button type="button" class="c3-btn" data-act="pause" aria-pressed="true">▶ Play</button>' +
          '<button type="button" class="c3-btn" data-act="orbit" aria-pressed="false">🔁 Camera drift: off</button>' +
          '<button type="button" class="c3-btn" data-act="table" aria-pressed="false">▦ Table view</button>' +
        '</div>' +
        '<div class="c3-hint">drag to orbit · scroll to zoom · click a stage</div>' +
        '<div class="c3-legend">' +
          '<span><i class="sw" style="background:#e05a3a"></i>heat flow</span>' +
          '<span><i class="sw" style="background:#e8b93a"></i>electricity</span>' +
          '<span><i class="sw" style="background:#4a8fd5"></i>cooling</span>' +
          '<span><i class="sw" style="background:#4aa3c7"></i>water</span>' +
        '</div>' +
        '<div class="c3-tip"></div>' +
      '</div>' +
      '<div class="c3-detail"></div>' +
      '<div class="c3-tablewrap"></div>' +
      '<p class="c3-foot">' + esc(TG.limits || "") +
      ' Sources: ' + srcDated(uniq([].concat(TG.src || [], ["K83"]))) + '.</p>';
    hostEl.appendChild(root);

    var stage = root.querySelector(".c3-stage");
    var tip = root.querySelector(".c3-tip");
    var detail = root.querySelector(".c3-detail");
    var tablewrap = root.querySelector(".c3-tablewrap");
    var tablewrapNext = tablewrap.nextSibling; // restore point — the table moves into the stage in table view

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { renderer = null; }
    if (!renderer) {
      stage.innerHTML = '<div class="c3-nogl">WebGL is not available in this browser — open the table view for the same data.</div>';
    }
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 2, 0.1, 200);
    camera.position.set(0, 8.5, 17);
    var controls = renderer ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.target.set(0, 1.2, 0.4);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.minDistance = 7; controls.maxDistance = 36;
      controls.maxPolarAngle = Math.PI * 0.52;
      controls.autoRotate = false; controls.autoRotateSpeed = 0.5; // drift stays off until the visitor opts in
    }
    scene.add(new THREE.HemisphereLight(0xffffff, 0xaab8c6, 1.0));
    var sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(8, 16, 10); scene.add(sun);

    /* ground */
    var ground = new THREE.Mesh(
      new THREE.CylinderGeometry(11.5, 11.9, 0.3, 72),
      new THREE.MeshLambertMaterial({ color: 0xe8eef5 })
    );
    ground.position.y = -0.15; scene.add(ground);
    var grid = new THREE.GridHelper(22, 16, 0xc9d5e0, 0xdde6ee);
    grid.position.y = 0.005; scene.add(grid);

    /* ── nodes ── */
    var HEAT = 0xe05a3a, ELEC = 0xe8b93a, COLD = 0x4a8fd5, WATER = 0x4aa3c7;
    var nodeMeshes = {};
    function addNode(id, mesh, labelText, labY, labOpts) {
      mesh.userData.stage = id;
      scene.add(mesh);
      nodeMeshes[id] = mesh;
      var lo = labOpts || { worldH: 0.5, bg: "rgba(255,255,255,0.9)", fg: "#051c2c", size: 28 };
      lo.depthTest = false;
      var lab = makeLabel(labelText, lo);
      lab.renderOrder = 10;
      lab.position.set(mesh.position.x, labY, mesh.position.z);
      scene.add(lab);
      return mesh;
    }
    var reactorMat = new THREE.MeshLambertMaterial({ color: 0xc0392b, emissive: 0x521208 });
    addNode("reactor", (function () {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.55, 2.7, 32), reactorMat);
      m.position.set(-7, 1.35, 0); return m;
    })(), "Reactor — gross " + TG.gross + " MW heat", 3.35, { worldH: 0.52, bg: "rgba(192,57,43,0.92)", fg: "#fff", size: 28, weight: 700 });
    addNode("preheat", (function () {
      var m = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.3, 1.5), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
      m.position.set(-7, 0.65, 4.4); return m;
    })(), "Feed preheat — " + TG.preheat + " MW recycled", 1.95);
    addNode("surplus", (function () {
      var m = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 18), new THREE.MeshLambertMaterial({ color: HEAT }));
      m.position.set(-1.8, 1.0, 0); return m;
    })(), "Surplus " + TG.surplus + " MW", 2.35, { worldH: 0.5, bg: "rgba(224,90,58,0.92)", fg: "#fff", size: 28, weight: 700 });
    addNode("turbine", (function () {
      var m = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.5, 1.3), new THREE.MeshLambertMaterial({ color: 0x4a6fa5 }));
      m.position.set(3.1, 0.85, -3.3); return m;
    })(), "Turbine → " + TG.power + " MWₑ", 2.15);
    addNode("grid", (function () {
      var m = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.8, 4), new THREE.MeshLambertMaterial({ color: ELEC }));
      m.position.set(6.9, 0.9, -3.3); return m;
    })(), TG.power + " MW electricity out", 2.35, { worldH: 0.46, bg: "rgba(232,185,58,0.92)", fg: "#051c2c", size: 26, weight: 700 });
    addNode("chiller", (function () {
      var m = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 1.5), new THREE.MeshLambertMaterial({ color: COLD }));
      m.position.set(3.1, 0.9, 2.9); return m;
    })(), "Absorption chiller — " + TG.cooling_heat + " MW heat in", 2.35);
    addNode("cold", (function () {
      var m = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.3, 1.3), new THREE.MeshLambertMaterial({ color: 0x8fc1f5 }));
      m.position.set(7.0, 0.75, 2.9); return m;
    })(), TG.cooling + " MW cooling out (~1,392 RT)", 1.95, { worldH: 0.46, bg: "rgba(74,143,213,0.92)", fg: "#fff", size: 26, weight: 700 });
    addNode("hotwater", (function () {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.7, 24), new THREE.MeshLambertMaterial({ color: 0xe8863a }));
      m.position.set(1.6, 0.85, 5.4); return m;
    })(), "District hot / chilled water option", 2.35);
    addNode("water", (function () {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.5, 24), new THREE.MeshLambertMaterial({ color: WATER }));
      m.position.set(-3.6, 0.75, 4.6); return m;
    })(), "Distilled water out", 2.55);

    /* ── pipes: curves with glowing particle flow ── */
    function pipeCurve(a, b, arc, side) {
      var pa = nodeMeshes[a].position, pb = nodeMeshes[b].position;
      var mid = pa.clone().add(pb).multiplyScalar(0.5);
      mid.y = Math.max(pa.y, pb.y) + (arc == null ? 0.9 : arc);
      if (side) {
        var dir = pb.clone().sub(pa).normalize();
        var perp = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(side);
        mid.add(perp);
      }
      return new THREE.QuadraticBezierCurve3(pa.clone().add(new THREE.Vector3(0, 0.4, 0)), mid, pb.clone().add(new THREE.Vector3(0, 0.4, 0)));
    }
    var pipes = [];
    function addPipe(a, b, mw, color, o) {
      o = o || {};
      var curve = pipeCurve(a, b, o.arc, o.side);
      var radius = Math.max(0.07, 0.085 * Math.sqrt(mw));
      var tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 40, radius, 10, false),
        new THREE.MeshLambertMaterial({ color: color })
      );
      scene.add(tube);
      var n = Math.round(5 + mw * 2.2);
      var pos = new Float32Array(n * 3);
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      var pts = new THREE.Points(g, new THREE.PointsMaterial({
        color: o.pcolor || 0xffe08a, size: 0.17, transparent: true, opacity: 0.95,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      scene.add(pts);
      pipes.push({ curve: curve, n: n, pos: pos, geo: g, speed: 0.10 + Math.random() * 0.05, off: Math.random() });
      if (o.label) {
        var mid = curve.getPoint(0.5);
        var lab = makeLabel(o.label, { worldH: 0.36, bg: "rgba(5,28,44,0.85)", fg: "#ffffff", size: 24, depthTest: false });
        lab.renderOrder = 10;
        lab.position.set(mid.x, mid.y + 0.42, mid.z);
        scene.add(lab);
      }
    }
    addPipe("reactor", "preheat", TG.preheat, HEAT, { side: 0.7, label: TG.preheat + " MW to preheat" });
    addPipe("preheat", "reactor", TG.preheat, HEAT, { side: -0.7, arc: 0.4 });
    addPipe("reactor", "surplus", TG.surplus, HEAT, { label: TG.surplus + " MW surplus" });
    addPipe("surplus", "turbine", TG.surplus, HEAT, { arc: 1.2, label: "hot slice → turbine" });
    addPipe("turbine", "grid", TG.power, ELEC, { arc: 0.5, pcolor: 0xffe08a, label: TG.power + " MWₑ" });
    addPipe("turbine", "chiller", TG.cooling_heat, HEAT, { arc: 1.4, label: TG.cooling_heat + " MW heat" });
    addPipe("chiller", "cold", TG.cooling, COLD, { arc: 0.5, pcolor: 0xbfe0ff, label: TG.cooling + " MW cooling" });
    addPipe("surplus", "hotwater", 2.4, HEAT, { arc: 0.7, label: "district-water option" });
    addPipe("reactor", "water", 1.2, WATER, { arc: 0.6, pcolor: 0xbfe8ff, label: "~900 m³/day water" });

    /* ── picking ── */
    var ray = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var selected = null;
    var pickMeshes = Object.keys(nodeMeshes).map(function (k) { return nodeMeshes[k]; });
    function pick(ev) {
      var r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      var hits = ray.intersectObjects(pickMeshes);
      return hits.length ? hits[0].object.userData.stage : null;
    }
    function detailHTML(id) {
      var st = STAGES[id];
      if (!st) return "";
      return '<button type="button" class="c3-close">✕ Close</button>' +
        "<h4>" + esc(st.title) + "</h4>" +
        '<div class="c3-detail-grid">' +
          "<div><h5>What it means</h5><p>" + st.mean + "</p></div>" +
          "<div><h5>What it is worth</h5><p>" + st.value + "</p></div>" +
        "</div>" +
        '<div class="c3-srcs"><b>Sources:</b> ' + srcDated(st.src) + "</div>";
    }
    function select(id) {
      if (selected && nodeMeshes[selected]) {
        var m = nodeMeshes[selected];
        if (m !== nodeMeshes.reactor) m.material.emissive && m.material.emissive.setHex(0x000000);
      }
      selected = id;
      if (id && nodeMeshes[id]) {
        var mm = nodeMeshes[id];
        if (mm.material.emissive && id !== "reactor") mm.material.emissive.setHex(0x223a66);
        detail.innerHTML = detailHTML(id);
        detail.classList.add("show");
        detail.querySelector(".c3-close").addEventListener("click", function () { select(null); });
        detail.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "nearest" });
      } else {
        detail.classList.remove("show");
      }
    }
    if (renderer) {
      renderer.domElement.addEventListener("pointermove", function (ev) {
        var id = pick(ev);
        if (id && STAGES[id]) {
          tip.innerHTML = "<b>" + esc(STAGES[id].title) + "</b>" +
            '<span class="c3-tip-src">Click for what it means + value per MWh</span>';
          tip.classList.add("show");
          var r2 = stage.getBoundingClientRect();
          tip.style.left = Math.min(ev.clientX - r2.left + 14, r2.width - 250) + "px";
          tip.style.top = Math.max(ev.clientY - r2.top - 10, 8) + "px";
          stage.style.cursor = "pointer";
        } else {
          tip.classList.remove("show");
          stage.style.cursor = "";
        }
      });
      renderer.domElement.addEventListener("pointerleave", function () { tip.classList.remove("show"); });
      renderer.domElement.addEventListener("click", function (ev) {
        var id = pick(ev);
        if (id) select(id === selected ? null : id);
        if (paused && id) renderFrame(performance.now()); // repaint the selection without motion
      });
    }

    /* ── table view ── */
    var tableBuilt = false;
    function buildTable() {
      var h = TG.hierarchy || [];
      var rows = "";
      rows += "<tr><td>Gross reaction heat</td><td>" + esc(TG.gross) + " MW_th</td><td>The waste is the fuel (" + esc(TG.basis) + ")</td><td>" + srcDated(TG.src) + "</td></tr>";
      rows += "<tr><td>Feed preheat (recycled)</td><td>" + esc(TG.preheat) + " MW_th</td><td>~60% of gross — stays inside the plant</td><td>" + srcDated(TG.src) + "</td></tr>";
      rows += "<tr><td>Exportable surplus</td><td>" + esc(TG.surplus) + " MW_th (range " + esc((TG.surplus_range || []).join("–")) + ")</td><td>Optimal cascade worth " + esc(TG.value) + "/yr; cooling-only " + esc(TG.value_cooling_only) + "/yr</td><td>" + srcDated(TG.src) + "</td></tr>";
      rows += "<tr><td>Turbine power out</td><td>" + esc(TG.power) + " MWₑ</td><td>" + esc(h[0] ? h[0].val + " per " + h[0].per : "") + "</td><td>" + srcDated(h[0] ? h[0].src : []) + "</td></tr>";
      rows += "<tr><td>Absorption cooling out</td><td>" + esc(TG.cooling) + " MW_c (from " + esc(TG.cooling_heat) + " MW_th)</td><td>" + esc(h[1] ? h[1].val + " per " + h[1].per : "") + " on site</td><td>" + srcDated(h[1] ? h[1].src : []) + "</td></tr>";
      rows += "<tr><td>District chilled water resale</td><td>retail tariffs</td><td>" + esc(h[2] ? h[2].val + " per " + h[2].per : "") + "</td><td>" + srcDated(h[2] ? h[2].src : []) + "</td></tr>";
      rows += "<tr><td>Recovered distilled water</td><td>" + esc(TG.water) + "</td><td>Reuse or sale; desalination-parity only where water is scarce</td><td>" + srcDated(TG.src) + "</td></tr>";
      tablewrap.innerHTML = "<table><caption>The same heat map as a plain table — " + esc(TG.basis) + ".</caption>" +
        "<thead><tr><th>Stage</th><th>Amount</th><th>What it is worth / means</th><th>Sources</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
      tableBuilt = true;
    }

    /* buttons */
    var paused = true; // owner directive: static assembled frame on load; motion only after Play
    var orbitOn = false;
    var pausedAt = 0;
    var pauseBtn = root.querySelector('[data-act="pause"]');
    var orbitBtn = root.querySelector('[data-act="orbit"]');
    var tableBtn = root.querySelector('[data-act="table"]');
    function setPaused(p) {
      paused = p;
      if (p) pausedAt = performance.now();
      if (controls) {
        controls.autoRotate = orbitOn && !p; // paused frame must stay pixel-static
        controls.enableDamping = !p;         // flush leftover inertia in one final paused render
      }
      pauseBtn.setAttribute("aria-pressed", String(p));
      pauseBtn.textContent = p ? "▶ Resume" : "⏸ Pause";
      if (!p) kick(); else renderFrame(performance.now());
    }
    pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    orbitBtn.addEventListener("click", function () {
      if (!controls) return;
      orbitOn = !orbitOn;
      controls.autoRotate = orbitOn && !paused;
      orbitBtn.setAttribute("aria-pressed", String(orbitOn));
      orbitBtn.textContent = orbitOn ? "🔁 Camera drift: on" : "🔁 Camera drift: off";
    });
    var tableWasPaused = false;
    tableBtn.addEventListener("click", function () {
      if (!tableBuilt) buildTable();
      var show = !tablewrap.classList.contains("show");
      tablewrap.classList.toggle("show", show);
      tableBtn.setAttribute("aria-pressed", String(show));
      tableBtn.textContent = show ? "▲ Back to chart" : "▦ Table view";
      // REPLACE the chart with the table (not append below it): the table moves
      // INTO the stage and fills the chart's exact frame; the stage keeps its
      // position and height so no empty chart-sized gap is left above the table.
      var lg = root.querySelector(".c3-legend"), ht = root.querySelector(".c3-hint");
      if (show) {
        tableWasPaused = paused;
        if (!paused) setPaused(true);
        stage.classList.add("c3-table-on");
        stage.appendChild(tablewrap);
        if (renderer) renderer.domElement.style.display = "none";
        if (lg) lg.style.display = "none";
        if (ht) ht.style.display = "none";
        detail.style.display = "none";
        tip.classList.remove("show");
      } else {
        stage.classList.remove("c3-table-on");
        root.insertBefore(tablewrap, tablewrapNext); // back to its place below the stage
        if (renderer) renderer.domElement.style.display = "";
        if (lg) lg.style.display = "";
        if (ht) ht.style.display = "";
        detail.style.display = "";
        if (!tableWasPaused) setPaused(false);
      }
    });
    setPaused(true); // default: one static assembled frame; motion only after the visitor presses Play

    function resize() {
      if (!renderer) return;
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.HCSP_DPR_CAP || 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderFrame(performance.now());
    }
    if (renderer) {
      stage.insertBefore(renderer.domElement, stage.firstChild);
      if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
      window.addEventListener("resize", resize);
      resize();
    }

    var raf = null, inView = true, last = null;
    function renderFrame(now) {
      if (!renderer) return;
      if (paused) now = pausedAt; // frozen clock: identical static frame on any incidental re-render
      var dt = last == null ? 0.016 : Math.min((now - last) / 1000, 0.05);
      last = now;
      var t = now / 1000;
      /* particles flow along every pipe */
      for (var pi = 0; pi < pipes.length; pi++) {
        var p = pipes[pi];
        for (var i = 0; i < p.n; i++) {
          var tt = (t * p.speed + p.off + i / p.n) % 1;
          var v = p.curve.getPoint(tt);
          p.pos[i * 3] = v.x; p.pos[i * 3 + 1] = v.y; p.pos[i * 3 + 2] = v.z;
        }
        p.geo.attributes.position.needsUpdate = true;
      }
      /* reactor breathes */
      reactorMat.emissive.setHex(0x521208);
      var pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
      reactorMat.emissive.setRGB(0.32 + 0.25 * pulse, 0.07 + 0.05 * pulse, 0.03);
      if (controls) controls.update();
      renderer.render(scene, camera);
    }
    function loop(now) {
      raf = null;
      if (paused || !inView) { last = null; return; }
      renderFrame(now);
      raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && !paused && inView) { last = null; raf = requestAnimationFrame(loop); } }
    if (renderer) {
      if (window.IntersectionObserver) {
        new IntersectionObserver(function (entries) {
          inView = entries[0].isIntersecting;
          if (inView) kick();
        }, { threshold: 0.05 }).observe(stage);
      }
      kick();
    }

    root.c3 = { pause: setPaused, selectStage: select };
  }

  window.Chart3DHeat = { render: render };
})();
