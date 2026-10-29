/* ═══ 3D Chart 2 — "Cost towers": disposal cost per gallon vs the HCSP energy floor ═══
   window.Chart3DSavings = { render(hostEl) }
   Self-contained IIFE. Requires: vendor/three.min.js, vendor/OrbitControls.js,
   js/data.js (window.RPT), js/sources.js (window.SRCS / window.K), css/c3.css.
   Continuous motion on load: camera drift + particles flowing from the costly
   incumbents down to the HCSP energy-floor band. Pause button; Reading Mode via
   prefers-reduced-motion; rendering pauses offscreen (IntersectionObserver). */
(function () {
  "use strict";
  if (!window.RPT) { console.warn("Chart3DSavings: window.RPT missing — load js/data.js first."); return; }
  var RPT = window.RPT;

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function uniq(a) { var seen = {}, out = []; a.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } }); return out; }
  function fv(v) { return String(parseFloat(v.toFixed(3))); }
  function band(s) { return "$" + fv(s.lo) + "–" + fv(s.hi) + (s.plus ? "+" : "") + "/gal"; }
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
  function cleanNote(n) {
    return String(n || "")
      .replace(/;?\s*sparse data — LOW CONFIDENCE flag\.?/i, " (sparse data — low confidence).")
      .replace("..", ".");
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

  var SHORT = {
    pfas: "PFAS concentrates", defense: "Defense foam", textile: "Textile ZLD",
    chem: "Chemical & haz.", pharma: "Pharma solvents", distill: "Distillery vinasse",
    semi: "Chip-fab streams", bio: "Sewage sludge", fnb: "F&B side-streams", islands: "Islands",
    og: "Produced water", cea: "Indoor farming", cafo: "Manure", mining: "Mining camps", dc: "Data centers"
  };
  var LOGMIN = 0.005, LOGMAX = 100;
  function yOf(v) { return 0.3 + (Math.log10(v) - Math.log10(LOGMIN)) / (Math.log10(LOGMAX) - Math.log10(LOGMIN)) * 7; }

  function render(hostEl) {
    if (!hostEl) return;
    if (!window.THREE || !THREE.OrbitControls) {
      hostEl.insertAdjacentHTML("beforeend", '<div class="c3-nogl">The 3D library did not load.</div>');
      return;
    }
    var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var meta = RPT.savings_meta || {};
    var DATA = (RPT.savings_ladder || []).slice();

    var root = document.createElement("div");
    root.className = "c3-root c3-savings";
    root.innerHTML =
      '<div class="c3-head">' +
        '<h3 class="c3-title">Cost towers — what cleanup costs today, against the HCSP energy floor</h3>' +
        '<p class="c3-sub">Each tower is what existing suppliers charge to dispose of one gallon of that industry\u2019s waste ' +
        '(log scale — each grid ring is ten times the one below). The glowing red band near the bottom is the energy the HCSP ' +
        'process itself needs, a spec-derived conservative bound of ~$0.07–0.09/gal — not a price. ' +
        'Watch the particles: value drains from the tall towers toward that floor. Hover for the exact range; click a tower for the story.</p>' +
      '</div>' +
      '<div class="c3-stage">' +
        '<div class="c3-ui">' +
          '<button type="button" class="c3-btn" data-act="pause" aria-pressed="false">⏸ Pause</button>' +
          '<button type="button" class="c3-btn" data-act="orbit" aria-pressed="true">🔁 Camera drift: on</button>' +
          '<button type="button" class="c3-btn" data-act="table" aria-pressed="false">▦ Table view</button>' +
        '</div>' +
        '<div class="c3-hint">drag to orbit · scroll to zoom · click a tower</div>' +
        '<div class="c3-legend">' +
          '<span><i class="sw" style="background:#b23b3b"></i>HCSP energy floor ~$0.07–0.09/gal (spec-derived bound, not pricing)</span>' +
          '<span><i class="sw" style="background:#2251ff"></i>Field SCWO service benchmark $1.63–4.88/gal</span>' +
          '<span><i class="sw" style="background:#8b95a5"></i>Typical range (top = high end)</span>' +
        '</div>' +
        '<div class="c3-tip"></div>' +
      '</div>' +
      '<div class="c3-detail"></div>' +
      '<div class="c3-tablewrap"></div>' +
      '<p class="c3-foot">' + esc(meta.qualifier || "") + ' ' + esc(meta.floor_note || "") +
      ' Manufacturer HCSP pricing is TBD (early phase): towers show only what existing suppliers charge today. Sources: ' +
      srcDated(["K150", "K54"]) + '.</p>';
    hostEl.appendChild(root);

    var stage = root.querySelector(".c3-stage");
    var tip = root.querySelector(".c3-tip");
    var detail = root.querySelector(".c3-detail");
    var tablewrap = root.querySelector(".c3-tablewrap");

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { renderer = null; }
    if (!renderer) {
      stage.innerHTML = '<div class="c3-nogl">WebGL is not available in this browser — open the table view for the same data.</div>';
    }
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 2, 0.1, 200);
    camera.position.set(0, 8.5, 19);
    var controls = renderer ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.target.set(0, 3.4, 0);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.minDistance = 8; controls.maxDistance = 40;
      controls.maxPolarAngle = Math.PI * 0.52;
      controls.autoRotate = true; controls.autoRotateSpeed = 0.55;
    }
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c4d0, 0.95));
    var sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(8, 16, 10); scene.add(sun);

    /* base + log-scale rings */
    var base = new THREE.Mesh(
      new THREE.CylinderGeometry(11.2, 11.6, 0.35, 72),
      new THREE.MeshLambertMaterial({ color: 0xe8eef5 })
    );
    base.position.y = -0.18; scene.add(base);
    var ticks = [0.01, 0.1, 1, 10, 50];
    ticks.forEach(function (v) {
      var y = yOf(v);
      var pts = [];
      for (var i = 0; i <= 90; i++) {
        var a = i / 90 * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * 11.2, y, Math.sin(a) * 11.2));
      }
      var ring = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0xc3cfdb, transparent: true, opacity: 0.9 })
      );
      scene.add(ring);
      var lab = makeLabel("$" + fv(v) + "/gal", { worldH: 0.42, bg: "rgba(255,255,255,0.85)", fg: "#42566a", size: 26 });
      lab.position.set(-11.9, y, 0); scene.add(lab);
    });

    /* HCSP energy-floor band ~$0.07–0.09/gal (spec-derived conservative bound) */
    var floorY0 = yOf(0.07), floorY1 = yOf(0.09);
    var floor = new THREE.Mesh(
      new THREE.CylinderGeometry(11.2, 11.2, Math.max(floorY1 - floorY0, 0.06), 72, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xd43d3d, transparent: true, opacity: 0.30, side: THREE.DoubleSide, depthWrite: false })
    );
    floor.position.y = (floorY0 + floorY1) / 2; scene.add(floor);
    var floorDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(6.4, 6.4, 0.04, 72),
      new THREE.MeshBasicMaterial({ color: 0xd43d3d, transparent: true, opacity: 0.22, depthWrite: false })
    );
    floorDisc.position.y = floorY0; scene.add(floorDisc);
    var floorLab = makeLabel("HCSP energy floor ≈ $0.07–0.09/gal · spec-derived bound, not pricing", { worldH: 0.46, bg: "rgba(212,61,61,0.92)", fg: "#ffffff", size: 27, depthTest: false });
    floorLab.renderOrder = 10;
    floorLab.position.set(0, floorY1 + 0.34, 5.6); scene.add(floorLab);

    /* field SCWO benchmark band $1.63–4.88/gal */
    var fbY0 = yOf(1.63), fbY1 = yOf(4.88);
    var fband = new THREE.Mesh(
      new THREE.CylinderGeometry(11.2, 11.2, fbY1 - fbY0, 72, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x2251ff, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false })
    );
    fband.position.y = (fbY0 + fbY1) / 2; scene.add(fband);
    var fbLab = makeLabel("field SCWO services today: $1.63–4.88/gal", { worldH: 0.42, bg: "rgba(34,81,255,0.88)", fg: "#ffffff", size: 26, depthTest: false });
    fbLab.renderOrder = 10;
    fbLab.position.set(0, fbY1 + 0.42, -9.6); scene.add(fbLab);

    /* towers on an arc */
    var towers = [];
    var byKey = {};
    var ARC_R = 8.6, ARC0 = -1.35, ARC1 = 1.35;
    var geo = new THREE.BoxGeometry(1.15, 1, 1.15);
    geo.translate(0, 0.5, 0);
    DATA.forEach(function (s, i) {
      var a = ARC0 + (ARC1 - ARC0) * (DATA.length > 1 ? i / (DATA.length - 1) : 0.5);
      var x = Math.sin(a) * ARC_R, z = -Math.cos(a) * ARC_R + 2.2;
      var loH = s.na || s.lo == null ? 0 : yOf(s.lo);
      var hiH = s.na || s.hi == null ? 0.3 : yOf(s.hi);
      var col = s.na ? 0x9aa5b1 : new THREE.Color().setHSL(0.62 - 0.52 * Math.min(i / 14, 1), 0.62, 0.52).getHex();
      var mLo = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: col, emissive: 0x000000 }));
      mLo.position.set(x, 0, z);
      mLo.scale.set(1, Math.max(loH, 0.03), 1);
      mLo.userData.key = s.key;
      scene.add(mLo);
      var mHi = null;
      if (hiH > loH + 0.02) {
        mHi = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: col, transparent: true, opacity: 0.45, emissive: 0x000000 }));
        mHi.position.set(x, loH, z);
        mHi.scale.set(1, hiH - loH, 1);
        mHi.userData.key = s.key;
        scene.add(mHi);
      }
      var nameSpr = makeLabel(SHORT[s.key] || s.vertical, { worldH: 0.5, bg: "rgba(255,255,255,0.88)", fg: "#051c2c", size: 28, depthTest: false });
      nameSpr.renderOrder = 10;
      nameSpr.position.set(x, Math.max(hiH - 0.4, 0.5), z);
      scene.add(nameSpr);
      var valSpr = makeLabel(s.na ? "N/A" : band(s), { worldH: 0.44, bg: "rgba(5,28,44,0.88)", fg: "#ffffff", size: 26, weight: 700, depthTest: false });
      valSpr.renderOrder = 10;
      valSpr.position.set(x, hiH + 0.4, z);
      scene.add(valSpr);
      var tw = { s: s, x: x, z: z, loH: loH, hiH: hiH, meshes: [mLo].concat(mHi ? [mHi] : []), val: valSpr, lift: 0, born: -i * 0.12 };
      towers.push(tw); byKey[s.key] = tw;
    });

    /* ── particle flow: towers → floor ── */
    var N = 260;
    var pGeo = new THREE.BufferGeometry();
    var pPos = new Float32Array(N * 3);
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    var pMat = new THREE.PointsMaterial({
      color: 0xff6a3d, size: 0.22, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    var points = new THREE.Points(pGeo, pMat);
    scene.add(points);
    var parts = [];
    var flowTowers = towers.filter(function (t) { return !t.s.na && t.s.hi != null; });
    var weights = flowTowers.map(function (t) { return t.hiH; });
    var wSum = weights.reduce(function (a, b) { return a + b; }, 0);
    function pickTower() {
      var r = Math.random() * wSum;
      for (var i = 0; i < flowTowers.length; i++) { r -= weights[i]; if (r <= 0) return flowTowers[i]; }
      return flowTowers[flowTowers.length - 1];
    }
    function spawn(p, stagger) {
      var t = pickTower();
      var ex = (Math.random() - 0.5) * 8, ez = (Math.random() - 0.5) * 8;
      p.p0 = new THREE.Vector3(t.x, t.hiH, t.z);
      p.p2 = new THREE.Vector3(ex, (floorY0 + floorY1) / 2, ez);
      p.p1 = new THREE.Vector3((t.x + ex) / 2, Math.max(t.hiH, 3) + 1.6 + Math.random() * 1.6, (t.z + ez) / 2);
      p.t = stagger ? Math.random() : 0;
      p.speed = 0.14 + Math.random() * 0.16;
    }
    for (var i = 0; i < N; i++) { var p = {}; spawn(p, true); parts.push(p); }
    var tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
    function stepParticles(dt) {
      for (var i = 0; i < N; i++) {
        var p = parts[i];
        p.t += dt * p.speed;
        if (p.t >= 1) spawn(p, false);
        var t = p.t, u = 1 - t;
        tmpA.copy(p.p0).multiplyScalar(u * u).addScaledVector(p.p1, 2 * u * t).addScaledVector(p.p2, t * t);
        pPos[i * 3] = tmpA.x; pPos[i * 3 + 1] = tmpA.y; pPos[i * 3 + 2] = tmpA.z;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    /* label de-overlap (value chips) */
    var proj = new THREE.Vector3();
    function deOverlap() {
      /* pixel-exact, deterministic: recompute lifts from scratch each render so
         a frozen camera yields a frozen frame (pause = pixel-static) */
      var clientW = stage.clientWidth, clientH = stage.clientHeight;
      var tanF = Math.tan(camera.fov * Math.PI / 360);
      towers.forEach(function (t) { t.lift = 0; });
      for (var pass = 0; pass < 6; pass++) {
        var items = towers.map(function (t) {
          var pos = new THREE.Vector3(t.val.position.x, t.hiH + 0.4 + t.lift, t.val.position.z);
          var d = camera.position.distanceTo(pos);
          var wpp = 2 * d * tanF / clientH;
          proj.copy(pos).project(camera);
          return { t: t, cx: proj.x * clientW / 2, cy: proj.y * clientH / 2,
                   hw: t.val.scale.x / 2 / wpp, hh: t.val.scale.y / 2 / wpp, wpp: wpp };
        }).sort(function (p, q) { return q.cy - p.cy; });
        var moved = false;
        for (var i = 1; i < items.length; i++) {
          var a = items[i - 1], c = items[i];
          if (Math.abs(a.cx - c.cx) < a.hw + c.hw + 2 && a.cy - c.cy < a.hh + c.hh + 2) {
            var needPx = (a.hh + c.hh + 2) - (a.cy - c.cy);
            a.t.lift = Math.min(a.t.lift + needPx * a.wpp, 2.4);
            a.cy += needPx;
            moved = true;
          }
        }
        if (!moved) break;
      }
      towers.forEach(function (t) { t.val.position.y = t.hiH + 0.4 + t.lift; });
    }

    /* grow-in */
    var growT = 0;

    /* picking */
    var ray = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var hovered = null, selected = null;
    var allMeshes = [];
    towers.forEach(function (t) { allMeshes.push.apply(allMeshes, t.meshes); });
    function pick(ev) {
      var r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      var hits = ray.intersectObjects(allMeshes);
      return hits.length ? byKey[hits[0].object.userData.key] : null;
    }
    function setGlow(tw, on) {
      tw.meshes.forEach(function (m) { m.material.emissive.setHex(on ? 0x223a66 : 0x000000); });
    }
    function detailHTML(s) {
      var srcs = uniq([].concat(s.src || [], ["K150"]));
      var pay = s.na
        ? "Nothing — there is no remediation stream here. Data centers buy the output (power, cooling, reclaimed water) made at waste-rich hosts."
        : "<b>" + esc(band(s)) + "</b> — " + esc(cleanNote(s.note));
      return '<button type="button" class="c3-close">✕ Close</button>' +
        "<h4>#" + s.srank + " · " + esc(s.vertical) + "</h4>" +
        '<div class="c3-detail-grid">' +
          '<div class="full"><h5>What customers pay today</h5><p>' + pay + "</p></div>" +
          "<div><h5>Against the floor</h5><p>The HCSP process is specified to run on the waste\u2019s own energy; " +
          "the red band marks a spec-derived conservative energy bound of ~$0.07–0.09/gal — not a price. " +
          esc(meta.floor_note || "") + "</p></div>" +
          "<div><h5>Keep in mind</h5><p>" + esc(meta.qualifier || "") + "</p></div>" +
        "</div>" +
        '<div class="c3-srcs"><b>Sources:</b> ' + srcDated(srcs) + "</div>";
    }
    function select(tw) {
      if (selected) setGlow(selected, false);
      selected = tw;
      if (tw) {
        setGlow(tw, true);
        detail.innerHTML = detailHTML(tw.s);
        detail.classList.add("show");
        detail.querySelector(".c3-close").addEventListener("click", function () { select(null); });
        detail.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "nearest" });
      } else {
        detail.classList.remove("show");
      }
    }
    if (renderer) {
      renderer.domElement.addEventListener("pointermove", function (ev) {
        var tw = pick(ev);
        if (hovered && hovered !== selected) setGlow(hovered, false);
        hovered = tw;
        if (tw) {
          if (tw !== selected) setGlow(tw, true);
          var s = tw.s;
          tip.innerHTML = "<b>" + esc(s.vertical) + "</b><br>" +
            (s.na ? "No remediation stream — buys the output instead." : "Disposal today: <b>" + esc(band(s)) + "</b>") +
            (s.lowConf ? "<br>(sparse data — low confidence)" : "") +
            '<span class="c3-tip-src">Click for detail + sources</span>';
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
      renderer.domElement.addEventListener("pointerleave", function () {
        tip.classList.remove("show");
        if (hovered && hovered !== selected) setGlow(hovered, false);
        hovered = null;
      });
      renderer.domElement.addEventListener("click", function (ev) {
        var tw = pick(ev);
        if (tw) select(tw === selected ? null : tw);
      });
    }

    /* table view */
    var tableBuilt = false;
    function buildTable() {
      var rows = DATA.map(function (s) {
        return "<tr><td>" + s.srank + "</td><td><b>" + esc(s.vertical) + "</b></td><td>" +
          (s.na ? "N/A" : band(s)) + (s.lowConf ? " *" : "") + "</td><td>" + esc(cleanNote(s.note)) + "</td><td>" +
          srcDated(s.src) + "</td></tr>";
      }).join("");
      tablewrap.innerHTML = "<table><caption>The same data as a plain table. * sparse data — low confidence. " +
        "The HCSP energy floor (~$0.07–0.09/gal) is a spec-derived conservative bound, not pricing — the manufacturer cost model is pending.</caption>" +
        "<thead><tr><th>Rank</th><th>Industry stream</th><th>Disposal $/gal</th><th>What sits behind the number</th><th>Sources</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
      tableBuilt = true;
    }

    /* buttons */
    var paused = REDUCE;
    var orbitOn = true;
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
    tableBtn.addEventListener("click", function () {
      if (!tableBuilt) buildTable();
      var show = !tablewrap.classList.contains("show");
      tablewrap.classList.toggle("show", show);
      tableBtn.setAttribute("aria-pressed", String(show));
    });
    if (REDUCE) setPaused(true);

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
      /* grow-in */
      if (growT < 1) {
        growT = Math.min(growT + dt * 0.9, 1);
        towers.forEach(function (t) {
          var local = Math.min(Math.max((growT * 1.4 - Math.max(-t.born, 0) * 0.3), 0), 1);
          var e = 1 - Math.pow(1 - local, 3);
          t.meshes[0].scale.y = Math.max(t.loH * e, 0.03);
          if (t.meshes[1]) t.meshes[1].scale.y = Math.max((t.hiH - t.loH) * e, 0.02);
        });
      }
      stepParticles(dt);
      if (controls) {
        controls.update();
        /* gentle vertical drift on top of the auto-orbit */
        controls.target.y = 3.4 + Math.sin(now / 2600) * 0.35;
      }
      /* floor band pulse */
      floor.material.opacity = 0.24 + 0.10 * Math.sin(now / 700);
      deOverlap();
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

    /* QA hook: screen-space rects of tower labels */
    function labelRects() {
      var out = [];
      if (!renderer) return out;
      var rect = renderer.domElement.getBoundingClientRect();
      var e = camera.matrixWorld.elements;
      var right = new THREE.Vector3(e[0], e[1], e[2]);
      var up = new THREE.Vector3(e[4], e[5], e[6]);
      towers.forEach(function (t) {
        [t.val].forEach(function (spr) {
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
      });
      return out;
    }

    root.c3 = { pause: setPaused, selectByKey: function (k) { select(byKey[k] || null); }, labelRects: labelRects };
  }

  window.Chart3DSavings = { render: render };
})();
