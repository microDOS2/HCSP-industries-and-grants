/* ═══ 3D Chart 3 — "The energy surface": net electricity vs feed strength ═══
   window.Chart3DCrossover = { render(hostEl) }
   Self-contained IIFE. Requires: vendor/three.min.js, vendor/OrbitControls.js,
   js/data.js (window.RPT), js/sources.js (window.SRCS / window.K), css/c3.css.
   Continuous motion on load: slow orbit + a pulse travelling the curve.
   Play/pause for the auto-rotation; Reading Mode via prefers-reduced-motion;
   rendering pauses offscreen (IntersectionObserver). */
(function () {
  "use strict";
  if (!window.RPT) { console.warn("Chart3DCrossover: window.RPT missing — load js/data.js first."); return; }
  var RPT = window.RPT;
  var CX = RPT.crossover || {};

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

  /* model: LANL hub line +18 → −60 kWh/m³ over 0 → 160 g/L COD */
  var XK = 0.1, YK = 0.085, DEPTH = 7;
  function hubKwh(cod) { return 18 - (78 / 160) * cod; }
  function bandAt(cod) { // linear interp of module_band [COD, hi, lo]
    var b = CX.module_band || [];
    if (!b.length) return [0, 0];
    if (cod <= b[0][0]) return [b[0][1], b[0][2]];
    for (var i = 1; i < b.length; i++) {
      if (cod <= b[i][0]) {
        var t = (cod - b[i - 1][0]) / (b[i][0] - b[i - 1][0]);
        return [b[i - 1][1] + (b[i][1] - b[i - 1][1]) * t, b[i - 1][2] + (b[i][2] - b[i - 1][2]) * t];
      }
    }
    var l = b[b.length - 1]; return [l[1], l[2]];
  }
  function wx(cod) { return cod * XK - 8; }
  function wy(kwh) { return kwh * YK; }

  function render(hostEl) {
    if (!hostEl) return;
    if (!window.THREE || !THREE.OrbitControls) {
      hostEl.insertAdjacentHTML("beforeend", '<div class="c3-nogl">The 3D library did not load.</div>');
      return;
    }
    var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var root = document.createElement("div");
    root.className = "c3-root c3-crossover";
    root.innerHTML =
      '<div class="c3-head">' +
        '<h3 class="c3-title">The energy surface — which waste streams make their own power</h3>' +
        '<p class="c3-sub">The ridge is a full-scale hub plant: left of the amber wall (~35–40 g/L COD, a measure of how much ' +
        'energy-rich material the water carries) it burns electricity; past the green wall (60 g/L) it exports power. ' +
        'The amber ribbon is a small standalone module — it never quite breaks even (its top is clipped at +23 kWh/m³ for display). ' +
        'The pins are real waste streams: green pins export energy, red pins consume it. Click a pin for its story.</p>' +
      '</div>' +
      '<div class="c3-stage">' +
        '<div class="c3-ui">' +
          '<button type="button" class="c3-btn" data-act="pause" aria-pressed="true">▶ Play</button>' +
          '<button type="button" class="c3-btn" data-act="orbit" aria-pressed="false">🔁 Auto-rotation: off</button>' +
          '<button type="button" class="c3-btn" data-act="table" aria-pressed="false">▦ Table view</button>' +
          '<button type="button" class="c3-btn" data-act="bubbles" aria-pressed="false">◦ Bubbles</button>' +
        '</div>' +
        '<div class="c3-hint">drag to orbit · scroll to zoom · click a pin</div>' +
        '<div class="c3-legend">' +
          '<span><i class="sw" style="background:#0e9f6e"></i>stream exports power</span>' +
          '<span><i class="sw" style="background:#d43d3d"></i>stream consumes power</span>' +
          '<span><i class="sw" style="background:#f0b429"></i>net-zero wall ≈ 35–40 g/L</span>' +
          '<span><i class="sw" style="background:#0e9f6e;opacity:.5"></i>export zone ≥ 60 g/L</span>' +
        '</div>' +
        '<div class="c3-tip"></div>' +
      '</div>' +
      '<div class="c3-detail"></div>' +
      '<div class="c3-tablewrap"></div>' +
      '<p class="c3-foot">Hub line from the Los Alamos lab\u2019s integrated model (+18 kWh/m³ at clean water falling to −60 kWh/m³ ' +
      'at 160 g/L COD; negative = power out). ' + esc(CX.ceiling || "") + ' Sources: ' + srcDated(CX.src || ["K73", "K77"]) + '.</p>';
    hostEl.appendChild(root);

    var stage = root.querySelector(".c3-stage");
    var tip = root.querySelector(".c3-tip");
    var detail = root.querySelector(".c3-detail");
    var tablewrap = root.querySelector(".c3-tablewrap");
    /* tiered standard: 2D bubble view (2-variable chart) inside the stage */
    var bubWrap = document.createElement("div");
    bubWrap.className = "c3-2d"; bubWrap.hidden = true;
    stage.appendChild(bubWrap);

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { renderer = null; }
    if (!renderer) {
      stage.innerHTML = '<div class="c3-nogl">WebGL is not available in this browser — open the table view for the same data.</div>';
    }
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 2, 0.1, 200);
    camera.position.set(-4, 8.2, 17.5);
    var controls = renderer ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.target.set(0, -1.25, 0);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.minDistance = 7; controls.maxDistance = 40;
      controls.maxPolarAngle = Math.PI * 0.55;
      controls.autoRotate = false; controls.autoRotateSpeed = 0.6; // rotation stays off until the visitor opts in
    }
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb0bdcb, 1.0));
    var sun = new THREE.DirectionalLight(0xffffff, 0.55);
    sun.position.set(6, 14, 8); scene.add(sun);

    /* ── the surface: a curtain with the hub line as its ridge ── */
    var NX = 64, NZ = 12;
    var sPos = [], sCol = [], sIdx = [];
    var cRed = new THREE.Color(0xd4594a), cGreen = new THREE.Color(0x0e9f6e), cMid = new THREE.Color(0xdfe6ec);
    for (var j = 0; j <= NZ; j++) {
      var u = j / NZ;
      var z = (u - 0.5) * DEPTH;
      var drop = 1.5 * Math.abs(u - 0.5) * 2;
      for (var i = 0; i <= NX; i++) {
        var cod = i / NX * 160;
        var yv = hubKwh(cod);
        sPos.push(wx(cod), wy(yv) - drop, z);
        var c = cMid.clone();
        if (yv > 0) c.lerp(cRed, Math.min(yv / 22, 1));
        else c.lerp(cGreen, Math.min(-yv / 60, 1));
        sCol.push(c.r, c.g, c.b);
      }
    }
    for (j = 0; j < NZ; j++) {
      for (i = 0; i < NX; i++) {
        var a = j * (NX + 1) + i, b = a + 1, c2 = a + NX + 1, d = c2 + 1;
        sIdx.push(a, c2, b, b, c2, d);
      }
    }
    var sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.Float32BufferAttribute(sPos, 3));
    sGeo.setAttribute("color", new THREE.Float32BufferAttribute(sCol, 3));
    sGeo.setIndex(sIdx);
    sGeo.computeVertexNormals();
    var surface = new THREE.Mesh(sGeo, new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
    scene.add(surface);

    /* ridge tube: the hub line itself */
    var ridgePts = [];
    for (i = 0; i <= 80; i++) {
      var cd = i / 80 * 160;
      ridgePts.push(new THREE.Vector3(wx(cd), wy(hubKwh(cd)) + 0.02, 0));
    }
    var ridge = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ridgePts), 80, 0.055, 8, false),
      new THREE.MeshBasicMaterial({ color: 0x051c2c })
    );
    scene.add(ridge);

    /* module band ribbon (amber, never crosses zero) */
    var bPos = [], bIdx = [];
    var NB = 40;
    for (i = 0; i <= NB; i++) {
      var bc = i / NB * 150;
      var hl = bandAt(bc);
      bPos.push(wx(bc), Math.min(wy(hl[0]), wy(23)), -1.3, wx(bc), wy(Math.min(hl[1], 23)), -1.3);
    }
    for (i = 0; i < NB; i++) {
      var q = i * 2;
      bIdx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2);
    }
    var bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute("position", new THREE.Float32BufferAttribute(bPos, 3));
    bGeo.setIndex(bIdx);
    bGeo.computeVertexNormals();
    var band = new THREE.Mesh(bGeo, new THREE.MeshBasicMaterial({
      color: 0xf0b429, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false
    }));
    scene.add(band);
    var bandLab = makeLabel("small standalone module — never breaks even", { worldH: 0.42, bg: "rgba(240,180,41,0.92)", fg: "#051c2c", size: 26, depthTest: false });
    bandLab.renderOrder = 10;
    bandLab.position.set(wx(88), wy(Math.min(bandAt(88)[0], 23)) + 0.55, -1.3);
    scene.add(bandLab);

    /* net-zero plane y=0 + walls */
    var zero = new THREE.Mesh(
      new THREE.PlaneGeometry(16, DEPTH),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false })
    );
    zero.rotation.x = -Math.PI / 2; zero.position.set(0, 0, 0); scene.add(zero);
    var zeroGrid = new THREE.GridHelper(16, 16, 0x9fb0c0, 0xc9d5e0);
    zeroGrid.scale.z = DEPTH / 16; zeroGrid.position.set(0, 0.005, 0); scene.add(zeroGrid);
    var zeroLab = makeLabel("net zero — breaks even", { worldH: 0.4, bg: "rgba(255,255,255,0.88)", fg: "#42566a", size: 26, depthTest: false });
    zeroLab.renderOrder = 10;
    zeroLab.position.set(-7.6, 0.34, -DEPTH / 2 + 0.4); scene.add(zeroLab);

    function wall(xWorld, color, labelText, labY) {
      var w = new THREE.Mesh(
        new THREE.PlaneGeometry(DEPTH, 8.4),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
      );
      w.rotation.y = Math.PI / 2;
      w.position.set(xWorld, wy(18) - 4.2 + 1.2, 0);
      scene.add(w);
      var edge = new THREE.Mesh(
        new THREE.PlaneGeometry(DEPTH, 0.06),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
      );
      edge.rotation.y = Math.PI / 2; edge.position.set(xWorld, wy(18) + 1.25, 0);
      scene.add(edge);
      var lab = makeLabel(labelText, { worldH: 0.46, bg: "rgba(5,28,44,0.88)", fg: "#ffffff", size: 26, weight: 700 });
      lab.position.set(xWorld, labY, 0);
      scene.add(lab);
    }
    wall(wx(CX.net_zero || 37.5), 0xf0b429, "net zero ≈ 35–40 g/L", wy(18) + 1.85);
    wall(wx(CX.export_from || 60), 0x0e9f6e, "export zone ≥ 60 g/L", wy(18) + 1.0);

    /* axes */
    var axisMat = new THREE.LineBasicMaterial({ color: 0x5b6f82 });
    var xAxis = new THREE.Line(new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(-8, wy(-55), DEPTH / 2), new THREE.Vector3(8, wy(-55), DEPTH / 2)]), axisMat);
    scene.add(xAxis);
    [0, 40, 80, 120, 160].forEach(function (v) {
      var lab = makeLabel(v + " g/L", { worldH: 0.36, bg: "rgba(255,255,255,0.85)", fg: "#42566a", size: 24, depthTest: false });
      lab.position.set(wx(v), wy(-55) - 0.38, DEPTH / 2);
      scene.add(lab);
    });
    var xTitle = makeLabel("feed strength (COD, g/L) →", { worldH: 0.4, fg: "#051c2c", bg: "rgba(255,255,255,0.85)", size: 26, weight: 700, depthTest: false });
    xTitle.renderOrder = 10;
    xTitle.position.set(0, wy(-55) - 0.85, DEPTH / 2 - 1.2); scene.add(xTitle);
    [20, 0, -20, -40, -60].forEach(function (v) {
      var lab = makeLabel((v > 0 ? "+" : "") + v, { worldH: 0.36, bg: "rgba(255,255,255,0.85)", fg: "#42566a", size: 24, depthTest: false });
      lab.position.set(wx(0) - 0.85, wy(v), DEPTH / 2);
      scene.add(lab);
    });
    var yTitle = makeLabel("net kWh per m³ (− = power out)", { worldH: 0.4, fg: "#051c2c", bg: "rgba(255,255,255,0.85)", size: 26, weight: 700, depthTest: false });
    yTitle.renderOrder = 10;
    yTitle.position.set(wx(0) - 0.85, wy(24.5), DEPTH / 2); scene.add(yTitle);

    /* stream pins — labels staggered into lanes so clustered streams never overlap */
    var pins = [];
    var pinMeshes = [];
    var laneX = []; // last x used per lane
    (CX.streams || []).slice().sort(function (a, b) {
      return ((a.cod[0] + a.cod[1]) - (b.cod[0] + b.cod[1]));
    }).forEach(function (st) {
      var codMid = (st.cod[0] + st.cod[1]) / 2;
      var x = wx(codMid), y = wy(hubKwh(codMid));
      var lane = 0;
      while (laneX[lane] != null && Math.abs(x - laneX[lane]) < 3.6) lane++;
      laneX[lane] = x;
      var green = st.side === "above";
      var baseY = y + 0.2;
      var labY = y + 1.45 + lane * 1.05;
      var m = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 20, 16),
        new THREE.MeshLambertMaterial({ color: green ? 0x0e9f6e : 0xd43d3d, emissive: green ? 0x04371f : 0x3d0f0f })
      );
      m.position.set(x, baseY, 0);
      m.userData.idx = pins.length;
      scene.add(m);
      var poleGeo = new THREE.BufferGeometry().setFromPoints(
        [new THREE.Vector3(x, baseY, 0), new THREE.Vector3(x, labY - 0.3, 0)]);
      scene.add(new THREE.Line(poleGeo, new THREE.LineBasicMaterial({ color: 0x5b6f82 })));
      var codTxt = st.cod[0] === st.cod[1] ? st.cod[0] + " g/L" : st.cod[0] + "–" + st.cod[1] + " g/L";
      var lab = makeLabel(st.name + " · " + codTxt, { worldH: 0.42, bg: green ? "rgba(14,159,110,0.92)" : "rgba(212,61,61,0.92)", fg: "#ffffff", size: 25 });
      lab.position.set(x, labY, 0);
      scene.add(lab);
      pins.push({ st: st, mesh: m, lab: lab, baseY: baseY, labY: labY, phase: pins.length * 0.9 });
      pinMeshes.push(m);
    });

    /* pulse travelling the ridge */
    var pulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd166 })
    );
    scene.add(pulse);

    /* picking */
    var ray = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var selected = null;
    function pick(ev) {
      var r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      var hits = ray.intersectObjects(pinMeshes);
      return hits.length ? pins[hits[0].object.userData.idx] : null;
    }
    function detailHTML(st) {
      var green = st.side === "above";
      var srcs = uniq([].concat(st.src || [], CX.src || []));
      return '<button type="button" class="c3-close">✕ Close</button>' +
        "<h4>" + esc(st.name) + " — " + (st.cod[0] === st.cod[1] ? st.cod[0] : st.cod[0] + "–" + st.cod[1]) + " g/L COD</h4>" +
        '<div class="c3-detail-grid">' +
          "<div><h5>Which side of the wall</h5><p>" + (green
            ? "<b>Above the line:</b> strong enough that the process makes its own heat from the waste and exports power."
            : "<b>Below the line:</b> too weak to power the process — it would burn electricity instead of making it.") + "</p></div>" +
          "<div><h5>The story</h5><p>" + esc(st.note) + "</p></div>" +
        "</div>" +
        '<div class="c3-srcs"><b>Sources:</b> ' + srcDated(srcs) + "</div>";
    }
    function select(pin) {
      if (selected) selected.mesh.scale.set(1, 1, 1);
      selected = pin;
      if (pin) {
        pin.mesh.scale.set(1.5, 1.5, 1.5);
        detail.innerHTML = detailHTML(pin.st);
        detail.classList.add("show");
        detail.querySelector(".c3-close").addEventListener("click", function () { select(null); });
        detail.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "nearest" });
      } else {
        detail.classList.remove("show");
      }
    }
    if (renderer) {
      renderer.domElement.addEventListener("pointermove", function (ev) {
        var pin = pick(ev);
        if (pin) {
          tip.innerHTML = "<b>" + esc(pin.st.name) + "</b><br>" +
            (pin.st.cod[0] === pin.st.cod[1] ? pin.st.cod[0] : pin.st.cod[0] + "–" + pin.st.cod[1]) + " g/L COD · " +
            (pin.st.side === "above" ? "exports power" : "consumes power") +
            '<span class="c3-tip-src">Click for the story + sources</span>';
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
        var pin = pick(ev);
        if (pin) select(pin === selected ? null : pin);
        if (paused && pin) renderFrame(performance.now()); // repaint the selection without motion
      });
    }

    /* table view */
    var tableBuilt = false;
    function buildTable() {
      var rows = (CX.streams || []).map(function (st) {
        return "<tr><td><b>" + esc(st.name) + "</b></td><td>" +
          (st.cod[0] === st.cod[1] ? st.cod[0] : st.cod[0] + "–" + st.cod[1]) + "</td><td>" +
          (st.side === "above" ? "Exports power" : "Consumes power") + "</td><td>" + esc(st.note) + "</td><td>" +
          srcDated(st.src) + "</td></tr>";
      }).join("");
      tablewrap.innerHTML = "<table><caption>The same streams as a plain table. Net-zero ≈ " +
        esc(CX.net_zero) + " g/L COD; meaningful export from " + esc(CX.export_from) + " g/L.</caption>" +
        "<thead><tr><th>Waste stream</th><th>COD g/L</th><th>Side of the wall</th><th>Why</th><th>Sources</th></tr></thead>" +
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
      orbitBtn.textContent = orbitOn ? "🔁 Auto-rotation: on" : "🔁 Auto-rotation: off";
    });
    tableBtn.addEventListener("click", function () {
      if (!tableBuilt) buildTable();
      var show = !tablewrap.classList.contains("show");
      tablewrap.classList.toggle("show", show);
      tableBtn.setAttribute("aria-pressed", String(show));
    });

    /* ── 2D bubbles (tiered standard: bubbles for 2-variable charts) — feed
       strength (COD) against net energy for the same streams, straight 2D ── */
    var bubBuilt = false, bubWasPaused = false;
    var bubBtn = root.querySelector('[data-act="bubbles"]');
    function buildBubbles() {
      if (!window.ViewStd) return;
      var pts = (CX.streams || []).map(function (st) {
        var mid = Math.sqrt(st.cod[0] * st.cod[1]);
        var yv = hubKwh(mid);
        var green = st.side === "above";
        var codTxt = st.cod[0] === st.cod[1] ? st.cod[0] + "" : st.cod[0] + "–" + st.cod[1];
        return {
          name: st.name, x: mid, y: yv,
          xLo: st.cod[0] !== st.cod[1] ? st.cod[0] : null,
          xHi: st.cod[0] !== st.cod[1] ? st.cod[1] : null,
          r: green ? 0.75 : 0.5,
          color: green ? "#0e9f6e" : "#c22f4e",
          lab: codTxt + " g/L · " + (yv > 0 ? "+" : "") + Math.round(yv) + " kWh/m³",
          tip: "<b>" + esc(st.name) + "</b><br>" + codTxt + " g/L COD · " + (yv > 0 ? "+" : "") + Math.round(yv) + " kWh/m³ net<br>" +
            (green ? "Above the wall — exports power" : "Below the wall — consumes power") + "<br>Click for the story",
          onClick: function (e) {
            U.showDrill({
              title: st.name.toUpperCase() + " — " + codTxt + " G/L COD",
              value: (yv > 0 ? "+" : "") + Math.round(yv) + " kWh/m³",
              sub: esc(st.note) + " Hub line from the Los Alamos lab\u2019s integrated model; " + esc(CX.ceiling || ""),
              source: srcDated(uniq([].concat(st.src || [], CX.src || []))),
              x: e.clientX, y: e.clientY,
            });
          },
        };
      });
      ViewStd.bubbles(bubWrap, {
        points: pts,
        xLog: true, xDomain: [0.4, 320], yDomain: [-70, 25],
        xTicks: [0.5, 1, 2, 5, 10, 20, 50, 100, 200],
        xFmt: function (v) { return v + " g/L"; },
        yTicks: [-60, -40, -20, 0, 20],
        yFmt: function (v) { return (v > 0 ? "+" : "") + v; },
        zeroY: true,
        vLines: [
          { x: 37.5, label: "NET-ZERO WALL ≈ 35–40 G/L", color: "#b57a00" },
          { x: 60, label: "EXPORT ZONE ≥ 60 G/L", color: "#0e9f6e" },
        ],
        xLabel: "FEED STRENGTH — COD, G/L (LOG)",
        yLabel: "NET ELECTRICITY, KWH/M³ (− = POWER OUT)",
        ariaLabel: "Bubble chart: feed strength (COD) against net energy for the studied waste streams",
        note: "The same streams as the 3D pins and the table. Dashed rings span each stream\u2019s documented COD range; the net-energy figure is the lab\u2019s model value at the middle of that range.",
      });
      bubBuilt = true;
    }
    function setBubView(on) {
      if (on && !bubBuilt) buildBubbles();
      if (!bubBuilt) return;
      stage.classList.toggle("c3-2d-on", !!on);
      if (on) { bubWasPaused = paused; if (!paused) setPaused(true); }
      else if (!bubWasPaused) setPaused(false);
      bubWrap.hidden = !on;
      if (renderer) renderer.domElement.style.display = on ? "none" : "";
      var lg = root.querySelector(".c3-legend"), ht = root.querySelector(".c3-hint");
      if (lg) lg.style.display = on ? "none" : "";
      if (ht) ht.style.display = on ? "none" : "";
      if (on) tip.classList.remove("show");
      bubBtn.setAttribute("aria-pressed", String(on));
      bubBtn.textContent = on ? "▲ Back to 3D pins" : "◦ Bubbles";
    }
    bubBtn.addEventListener("click", function () { setBubView(bubWrap.hidden); });
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
      /* travelling pulse along the ridge */
      var pt = (t % 14) / 14;
      var pc = pt * 160;
      pulse.position.set(wx(pc), wy(hubKwh(pc)) + 0.18, 0);
      var s = 1 + 0.35 * Math.sin(t * 5);
      pulse.scale.set(s, s, s);
      /* pins bob gently; band breathes */
      pins.forEach(function (p) {
        var dy = Math.sin(t * 1.4 + p.phase) * 0.07;
        p.mesh.position.y = p.baseY + dy;
        p.lab.position.y = p.labY + dy;
      });
      band.material.opacity = 0.32 + 0.1 * Math.sin(t * 1.1);
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

    /* QA hook: screen-space rects of pin labels */
    function labelRects() {
      var out = [];
      if (!renderer) return out;
      var rect = renderer.domElement.getBoundingClientRect();
      var e = camera.matrixWorld.elements;
      var right = new THREE.Vector3(e[0], e[1], e[2]);
      var up = new THREE.Vector3(e[4], e[5], e[6]);
      pins.forEach(function (p) {
        var spr = p.lab;
        var hw = spr.scale.x / 2, hh = spr.scale.y / 2;
        var p0 = spr.position.clone().addScaledVector(right, -hw).addScaledVector(up, -hh).project(camera);
        var p1 = spr.position.clone().addScaledVector(right, hw).addScaledVector(up, hh).project(camera);
        if (p0.z > 1 || p1.z > 1) return;
        out.push({
          x0: Math.min(p0.x, p1.x) * 0.5 * rect.width + rect.width / 2,
          x1: Math.max(p0.x, p1.x) * 0.5 * rect.width + rect.width / 2,
          y0: rect.height / 2 - Math.max(p0.y, p1.y) * 0.5 * rect.height,
          y1: rect.height / 2 - Math.min(p0.y, p1.y) * 0.5 * rect.height
        });
      });
      return out;
    }

    root.c3 = { pause: setPaused, labelRects: labelRects, selectByName: function (n) {
      for (var i = 0; i < pins.length; i++) if (pins[i].st.name === n) { select(pins[i]); return; }
      select(null);
    } };
  }

  window.Chart3DCrossover = { render: render };
})();
