/* ═══ 3D Chart 1 — "The 3D bar city": industry fit ranking ═══
   window.Chart3DRanking = { render(hostEl) }
   Self-contained IIFE. Requires, loaded beforehand:
     vendor/three.min.js, vendor/OrbitControls.js, js/data.js (window.RPT),
     js/sources.js (window.SRCS / window.K / window.KLINK), css/c3.css.
   Builds its own canvas + UI inside hostEl. Continuous motion on load
   (auto-orbit + grow-in); Pause button, Reading Mode via
   prefers-reduced-motion; rendering pauses offscreen (IntersectionObserver). */
(function () {
  "use strict";
  if (!window.RPT) { console.warn("Chart3DRanking: window.RPT missing — load js/data.js first."); return; }
  var RPT = window.RPT;

  /* ── shared helpers ── */
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
      .replace("..", ".")
      .replace("Top-3 under BOTH lenses — the most robust finding.", "Top-3 under both rankings.")
      .replace("NOT a $/gal savings play", "not a per-gallon savings play");
  }

  /* ── data ── */
  var TIERS = {};
  (RPT.tiers || []).forEach(function (t) { TIERS[t.tier] = t; });
  var savByKey = {};
  (RPT.savings_ladder || []).forEach(function (s) { savByKey[s.key] = s; });
  var varByName = {};
  (RPT.variants || []).forEach(function (v) { varByName[v.v] = v; });
  var RECS = (RPT.league || []).map(function (l) { return Object.assign({}, l, { sav: savByKey[l.key] || null }); });
  var ORDER = {
    composite: RECS.map(function (r) { return r.key; }),
    savings: (RPT.savings_ladder || []).map(function (s) { return s.key; })
  };
  var SHORT = {
    pfas: "PFAS destruction", defense: "Defense / remote", textile: "Textile clusters",
    chem: "Chemical & haz.", pharma: "Pharma & biotech", distill: "Distillery vinasse",
    semi: "Chip fabs", bio: "Sewage sludge", fnb: "Food & beverage", islands: "Islands / resorts",
    og: "Produced water", cea: "Indoor farming", cafo: "Farm manure", mining: "Mining camps", dc: "Data centers"
  };
  var TIERCOL = { 1: 0x0e9f6e, 2: 0x2251ff, 3: 0xd97706, 4: 0x94a3b8 };
  var REG = {
    pfas: [
      { t: "2024 — the first federal drinking-water limits (4 parts per trillion) made PFAS removal a legal duty for every US water utility.", src: ["K5"] },
      { t: "2024 — PFAS became a designated hazardous substance under the Superfund law: anyone holding the waste stays liable until it is destroyed.", src: ["K6"] },
      { t: "2026–2028 — federal limits on PFAS in landfill wastewater are expected to finalize, making ~2,600 landfills mandatory buyers.", src: ["K7"] }
    ],
    defense: [
      { t: "Oct 2026 — federal law phases out PFAS firefighting foam across ~1,000 facilities and 6,000+ vehicles; the old stockpiles must be destroyed.", src: ["K14", "K15"] },
      { t: "The Defense Department owes more than $9.3B of PFAS cleanup across 718 installations.", src: ["K13"] }
    ],
    textile: [{ t: "Indian courts enforce zero liquid discharge; Tirupur built 18 treatment plants (~$120M) and still has no way to destroy the leftover brine and sludge.", src: ["K42", "K39"] }],
    chem: [
      { t: "Only ~24 federally licensed hazardous-waste incinerators serve the whole US, running at 88–92% of capacity.", src: ["K34"] },
      { t: "Halogenated solvents carry the strictest disposal rules — and the highest prices, $15–50+/gal.", src: ["K33"] }
    ],
    pharma: [
      { t: "2024 — the first global (WHO) guidance on antibiotic-factory waste pushes drug makers toward proven destruction.", src: ["K45"] },
      { t: "EU rules make drug and cosmetics makers pay at least 80% of micropollutant treatment, phasing in to 2045.", src: ["K38"] }
    ],
    distill: [{ t: "Jan 2023 — India's pollution board ordered ~270 molasses distilleries to run zero-discharge plants under threat of closure.", src: ["K62", "K63"] }],
    semi: [{ t: "New US chip fabs face PFAS permit fights — every side-stream needs a documented destruction route.", src: ["K40"] }],
    bio: [{ t: "PFAS scrutiny is closing land application — the cheapest historical disposal route for sewage sludge.", src: ["K43", "K44"] }],
    fnb: [{ t: "No mandate drives this stream — it is economics only: hauling concentrated side-streams costs $45–120 per 1,000 gallons.", src: ["K46"] }],
    islands: [{ t: "No mandate — purely economics: diesel power at $0.30–0.52/kWh and water priced like desalination.", src: ["K65"] }],
    og: [{ t: "Earthquake limits on injection wells constrain Permian disposal; the Marcellus/Utica trucking corridor ($3–15/barrel) is the real opening.", src: ["K93", "K94"] }],
    cea: [
      { t: "2027 — the Netherlands mandates near-zero nitrogen discharge in the world's most advanced greenhouse sector.", src: ["K35"] },
      { t: "Sewer-discharge restrictions already force hauling in parts of California.", src: ["K36"] }
    ],
    cafo: [{ t: "Government credits (California's low-carbon standard, federal renewable-fuel credits) already pay digesters generously for the same waste.", src: ["K66"] }],
    mining: [{ t: "No mandate — sites buy when commodity prices allow; diesel ($0.30–1.10/kWh) and hauling premiums set the value.", src: ["K67"] }],
    dc: [{ t: "4–7-year grid connection queues make on-site power, cooling, and reclaimed water valuable — but the waste itself is the wrong kind.", src: ["K68", "K69"] }]
  };
  var VARMAP = {
    pfas: "HCSP-PFAS", defense: "HCSP-PFAS", pharma: "HCSP-RX", semi: "HCSP-FAB",
    chem: "HCSP-HAZ", bio: "HCSP-BIO", cea: "HCSP-AG", distill: "HCSP-VIN",
    fnb: "HCSP-TRI", islands: "HCSP-ISL", mining: "HCSP-ISL"
  };
  var VARNONE = {
    textile: "No dedicated variant yet — a standard concentrate-and-destroy train bolted behind the zero-discharge plants the courts already require.",
    og: "No dedicated variant — standard core only, in salt-first shale-region hubs; a niche pending the manufacturer's cost model.",
    cafo: "No dedicated variant — the wedge is eliminating digester leftovers in land-constrained dairy belts, not replacing digesters.",
    dc: "None — data centers buy the output (power, cooling, reclaimed water), not the machine. The plant sits at a waste-rich host across the fence."
  };

  /* ── billboard text sprite ── */
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
    var h = o.worldH || 0.62;
    spr.scale.set(h * cv.width / cv.height, h, 1);
    if (o.depthTest === false) spr.renderOrder = 10;
    spr.userData.aspect = cv.width / cv.height;
    return spr;
  }
  function setLabelText(spr, text, o) {
    var old = spr.material.map;
    var fresh = makeLabel(text, o);
    spr.material.map = fresh.material.map;
    spr.scale.copy(fresh.scale);
    spr.userData.aspect = fresh.userData.aspect;
    if (old) old.dispose();
  }

  /* ═══ render(hostEl) ═══ */
  function render(hostEl) {
    if (!hostEl) return;
    if (!window.THREE || !THREE.OrbitControls) {
      hostEl.insertAdjacentHTML("beforeend", '<div class="c3-nogl">The 3D library did not load — see the table view of the same data below.</div>');
      return;
    }
    var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    /* ── DOM skeleton ── */
    var root = document.createElement("div");
    root.className = "c3-root c3-ranking";
    root.innerHTML =
      '<div class="c3-head">' +
        '<h3 class="c3-title">The 3D bar city — which industries fit HCSP best?</h3>' +
        '<p class="c3-sub">Each tower is one of 15 industries; its height is the overall fit score out of 10 (taller = better fit). ' +
        'Switch to the money view and the towers physically move and regrow to show what disposal costs per gallon today. ' +
        'Click any tower for the full story with dated sources.</p>' +
      '</div>' +
      '<div class="c3-stage">' +
        '<div class="c3-ui">' +
          '<button type="button" class="c3-btn" data-act="pause" aria-pressed="true">▶ Play</button>' +
          '<button type="button" class="c3-btn" data-act="orbit" aria-pressed="false">🔁 Auto-orbit: off</button>' +
          '<button type="button" class="c3-btn" data-act="lens" aria-pressed="false">＄ Switch to $/gal view</button>' +
          '<button type="button" class="c3-btn" data-act="bars" aria-pressed="false">＄ Dollar bars</button>' +
          '<button type="button" class="c3-btn" data-act="table" aria-pressed="false">▦ Table view</button>' +
        '</div>' +
        '<div class="c3-hint">drag to orbit · scroll to zoom · click a tower</div>' +
        '<div class="c3-legend">' +
          '<span><i class="sw" style="background:#0e9f6e"></i>Pursue now (≥7.4)</span>' +
          '<span><i class="sw" style="background:#2251ff"></i>Develop (6.5–7.4)</span>' +
          '<span><i class="sw" style="background:#d97706"></i>Conditional (4.5–6.4)</span>' +
          '<span><i class="sw" style="background:#94a3b8"></i>Weak fit (&lt;4.5)</span>' +
        '</div>' +
        '<div class="c3-tip"></div>' +
      '</div>' +
      '<div class="c3-detail"></div>' +
      '<div class="c3-tablewrap"></div>' +
      '<p class="c3-foot">Scores combine six tests — regulation, disposal price, waste strength, market size, buying speed, and proof — from the report\u2019s industry studies. ' +
      'In the money view, tower height is the top of today\u2019s per-gallon disposal range on a log scale; HCSP\u2019s own price per gallon is not set (manufacturer cost model pending). Sources: ' + srcDated(["K150"]) + '.</p>';
    hostEl.appendChild(root);

    var stage = root.querySelector(".c3-stage");
    var tip = root.querySelector(".c3-tip");
    var detail = root.querySelector(".c3-detail");
    var tablewrap = root.querySelector(".c3-tablewrap");
    var tablewrapNext = tablewrap.nextSibling; // restore point — the table moves into the stage in table view
    /* tiered standard: 2D dollar-bars view lives inside the stage, beside the canvas */
    var barsWrap = document.createElement("div");
    barsWrap.className = "c3-2d"; barsWrap.hidden = true;
    stage.appendChild(barsWrap);

    /* ── renderer / scene ── */
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch (e) { renderer = null; }
    if (!renderer) {
      stage.innerHTML = '<div class="c3-nogl">WebGL is not available in this browser — the 3D scene cannot start. Open the table view for the same data.</div>';
    }
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 2, 0.1, 200);
    camera.position.set(0, 10.5, 17.5);
    var controls = renderer ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.target.set(0, 2.6, 0);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.minDistance = 7; controls.maxDistance = 38;
      controls.maxPolarAngle = Math.PI * 0.52;
      controls.autoRotate = false; controls.autoRotateSpeed = 0.7; // orbit stays off until the visitor opts in
    }
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c4d0, 0.95));
    var sun = new THREE.DirectionalLight(0xffffff, 0.65);
    sun.position.set(8, 16, 10); scene.add(sun);

    var LOGMIN = 0.005, LOGMAX = 100;
    function hComposite(r) { return 0.35 + r.score * 0.82; }            // 8.0 → ~6.9
    function hSavings(r) {
      var s = r.sav;
      if (!s || s.na || s.lo == null) return 0.28;                      // data centers: no stream
      return 0.35 + (Math.log10(s.hi) - Math.log10(LOGMIN)) / (Math.log10(LOGMAX) - Math.log10(LOGMIN)) * 6.6;
    }
    var LENS = { name: "composite", hFn: hComposite };

    /* base plane */
    var base = new THREE.Mesh(
      new THREE.CylinderGeometry(9.8, 10.2, 0.35, 72),
      new THREE.MeshLambertMaterial({ color: 0xe8eef5 })
    );
    base.position.y = -0.18; scene.add(base);
    var grid = new THREE.GridHelper(19.6, 14, 0xc9d5e0, 0xdde6ee);
    grid.position.y = 0.005; scene.add(grid);

    /* bars */
    var COLS = 5, SPX = 3.0, SPZ = 3.2;
    function slotPos(orderIdx) {
      var c = orderIdx % COLS, r = Math.floor(orderIdx / COLS);
      return { x: (c - (COLS - 1) / 2) * SPX, z: (r - 1) * SPZ };
    }
    var barGeo = new THREE.BoxGeometry(1.25, 1, 1.25);
    barGeo.translate(0, 0.5, 0);
    var bars = [];
    var byKey = {};
    RECS.forEach(function (rec) {
      var mat = new THREE.MeshLambertMaterial({ color: TIERCOL[rec.tier] || 0x94a3b8, emissive: 0x000000 });
      var m = new THREE.Mesh(barGeo, mat);
      var p = slotPos(ORDER.composite.indexOf(rec.key));
      m.position.set(p.x, 0, p.z);
      m.scale.set(1, 0.01, 1);
      m.userData.key = rec.key;
      scene.add(m);
      var nameSpr = makeLabel(SHORT[rec.key] || rec.name, { worldH: 0.52, bg: "rgba(255,255,255,0.88)", fg: "#051c2c", size: 30, depthTest: false });
      var valSpr = makeLabel("", { worldH: 0.5, bg: "rgba(5,28,44,0.88)", fg: "#ffffff", size: 32, weight: 700, depthTest: false });
      scene.add(nameSpr); scene.add(valSpr);
      var bar = { rec: rec, mesh: m, name: nameSpr, val: valSpr, anim: null, baseOff: 0, lift: 0 };
      bars.push(bar); byKey[rec.key] = bar;
    });

    function valueText(rec) {
      if (LENS.name === "composite") return rec.score.toFixed(1) + " / 10";
      var s = rec.sav;
      if (!s || s.na || s.lo == null) return "N/A";
      return band(s);
    }
    function refreshValueLabels() { bars.forEach(function (b) { setLabelText(b.val, valueText(b.rec), { worldH: 0.5, bg: "rgba(5,28,44,0.88)", fg: "#ffffff", size: 32, weight: 700, depthTest: false }); }); }
    refreshValueLabels();

    /* ── tweens (grow-in + lens re-order) ── */
    var tweens = [];
    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function tweenTo(bar, toX, toZ, toH, delay, dur, ease) {
      bar.anim = {
        fx: bar.mesh.position.x, fz: bar.mesh.position.z, fh: bar.mesh.scale.y,
        tx: toX, tz: toZ, th: toH, t: -(delay || 0), dur: dur || 1, ease: ease || easeInOut
      };
    }
    /* grow-in on load */
    bars.forEach(function (b, i) {
      tweenTo(b, b.mesh.position.x, b.mesh.position.z, LENS.hFn(b.rec), 0.15 + i * 0.07, 1.0, easeOut);
    });
    function applyLens(name) {
      LENS.name = name;
      LENS.hFn = name === "composite" ? hComposite : hSavings;
      var order = ORDER[name];
      bars.forEach(function (b, i) {
        var idx = order.indexOf(b.rec.key);
        var p = slotPos(idx < 0 ? i : idx);
        tweenTo(b, p.x, p.z, LENS.hFn(b.rec), 0, 1.15, easeInOut);
      });
      refreshValueLabels();
      if (paused) { // no motion in reading mode: jump straight to the new arrangement
        bars.forEach(function (b) {
          if (b.anim) {
            b.mesh.position.x = b.anim.tx; b.mesh.position.z = b.anim.tz;
            b.mesh.scale.y = Math.max(b.anim.th, 0.01); b.anim = null;
          }
        });
        renderFrame(performance.now());
      }
    }

    /* ── label placement + screen-space de-overlap ── */
    var proj = new THREE.Vector3();
    function placeLabels() {
      bars.forEach(function (b) {
        var h = b.mesh.scale.y;
        b.name.position.set(b.mesh.position.x, Math.max(h - 0.42, 0.55), b.mesh.position.z);
        b.val.position.set(b.mesh.position.x, h + 0.42 + b.lift, b.mesh.position.z);
      });
    }
    function deOverlap() {
      /* pixel-exact, deterministic: recompute lifts from scratch each render so
         a frozen camera yields a frozen frame (pause = pixel-static) */
      var clientW = stage.clientWidth, clientH = stage.clientHeight;
      var tanF = Math.tan(camera.fov * Math.PI / 360);
      bars.forEach(function (b) { b.lift = 0; });
      for (var pass = 0; pass < 6; pass++) {
        var items = bars.map(function (b) {
          var pos = new THREE.Vector3(b.mesh.position.x, b.mesh.scale.y + 0.42 + b.lift, b.mesh.position.z);
          var d = camera.position.distanceTo(pos);
          var wpp = 2 * d * tanF / clientH; // world units per pixel
          proj.copy(pos).project(camera);
          return { b: b, cx: proj.x * clientW / 2, cy: proj.y * clientH / 2,
                   hw: b.val.scale.x / 2 / wpp, hh: b.val.scale.y / 2 / wpp, wpp: wpp };
        }).sort(function (p, q) { return q.cy - p.cy; });
        var moved = false;
        for (var i = 1; i < items.length; i++) {
          var a = items[i - 1], c = items[i];
          if (Math.abs(a.cx - c.cx) < a.hw + c.hw + 2 && a.cy - c.cy < a.hh + c.hh + 2) {
            /* raise the HIGHER label — keeps stacking order, converges like a stack */
            var needPx = (a.hh + c.hh + 2) - (a.cy - c.cy);
            a.b.lift = Math.min(a.b.lift + needPx * a.wpp, 2.0);
            a.cy += needPx;
            moved = true;
          }
        }
        if (!moved) break;
      }
      bars.forEach(function (b) { b.val.position.y = b.mesh.scale.y + 0.42 + b.lift; });
    }

    /* ── picking ── */
    var ray = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var hovered = null, selected = null;
    function pick(ev) {
      var r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      var hits = ray.intersectObjects(bars.map(function (b) { return b.mesh; }));
      return hits.length ? byKey[hits[0].object.userData.key] : null;
    }
    function detailHTML(rec) {
      var s = rec.sav;
      var tier = TIERS[rec.tier];
      var vname = VARMAP[rec.key];
      var v = vname ? varByName[vname] : null;
      var reg = REG[rec.key] || [];
      var srcs = uniq([].concat(rec.src || [], s ? s.src : [],
        reg.reduce(function (a, g) { return a.concat(g.src || []); }, []),
        v ? v.src : []));
      var pay;
      if (!s) pay = "Not assessed in the cost ranking.";
      else if (s.na) pay = "Nothing — there is no waste stream to destroy here. The opportunity is inverted: sell the data center power, cooling, and reclaimed water made at waste-rich sites.";
      else pay = "<b>" + esc(band(s)) + "</b> — " + esc(cleanNote(s.note));
      var variant = v
        ? "<b>" + esc(v.v) + "</b> — " + esc(v.model) + ". First buyers: " + esc(v.first) + "."
        : esc(VARNONE[rec.key] || "No dedicated variant.");
      return '<button type="button" class="c3-close">✕ Close</button>' +
        '<h4>#' + rec.rank + " · " + esc(rec.name) + ' — fit score ' + rec.score.toFixed(1) + ' / 10' +
        (tier ? ' · <span style="color:#5b6f82">' + esc(tier.name) + "</span>" : "") + "</h4>" +
        '<div class="c3-detail-grid">' +
          '<div class="full"><h5>Why this rank</h5><p>' + esc(rec.why) + "</p></div>" +
          "<div><h5>What customers pay today</h5><p>" + pay + "</p></div>" +
          "<div><h5>HCSP variant</h5><p>" + variant + "</p></div>" +
          '<div class="full"><h5>Regulatory drivers</h5><ul>' +
            reg.map(function (g) { return "<li>" + esc(g.t) + "</li>"; }).join("") + "</ul></div>" +
        "</div>" +
        '<div class="c3-srcs"><b>Sources:</b> ' + srcDated(srcs) + "</div>";
    }
    function select(bar) {
      if (selected) selected.mesh.material.emissive.setHex(0x000000);
      selected = bar;
      if (bar) {
        bar.mesh.material.emissive.setHex(0x223a66);
        detail.innerHTML = detailHTML(bar.rec);
        detail.classList.add("show");
        detail.querySelector(".c3-close").addEventListener("click", function () { select(null); detail.classList.remove("show"); });
        detail.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "nearest" });
      } else {
        detail.classList.remove("show");
      }
    }

    if (renderer) {
      renderer.domElement.addEventListener("pointermove", function (ev) {
        var b = pick(ev);
        var hoverChanged = b !== hovered;
        if (hovered && hovered !== selected) hovered.mesh.material.emissive.setHex(0x000000);
        hovered = b;
        if (b) {
          if (b !== selected) b.mesh.material.emissive.setHex(0x1a2c4d);
          var s = b.rec.sav;
          tip.innerHTML = "<b>" + esc(b.rec.name) + "</b><br>Fit score: " + b.rec.score.toFixed(1) + " / 10" +
            (s && !s.na && s.lo != null ? "<br>Disposal today: " + esc(band(s)) : "") +
            '<span class="c3-tip-src">Click for the full story + sources</span>';
          tip.classList.add("show");
          var r2 = stage.getBoundingClientRect();
          tip.style.left = Math.min(ev.clientX - r2.left + 14, r2.width - 240) + "px";
          tip.style.top = Math.max(ev.clientY - r2.top - 10, 8) + "px";
          stage.style.cursor = "pointer";
        } else {
          tip.classList.remove("show");
          stage.style.cursor = "";
        }
        if (paused && hoverChanged) renderFrame(performance.now()); // repaint the highlight without motion
      });
      renderer.domElement.addEventListener("pointerleave", function () {
        var had = hovered;
        tip.classList.remove("show");
        if (hovered && hovered !== selected) hovered.mesh.material.emissive.setHex(0x000000);
        hovered = null;
        if (paused && had) renderFrame(performance.now());
      });
      renderer.domElement.addEventListener("click", function (ev) {
        var b = pick(ev);
        if (b) select(b === selected ? null : b);
        if (paused && b) renderFrame(performance.now());
      });
    }

    /* ── table view ── */
    var tableBuilt = false;
    function buildTable() {
      var rows = RECS.map(function (r) {
        var s = r.sav;
        return "<tr><td>" + r.rank + "</td><td><b>" + esc(r.name) + "</b></td><td>" + r.score.toFixed(1) +
          "</td><td>" + esc(TIERS[r.tier] ? TIERS[r.tier].name : "") + "</td><td>" +
          (s ? (s.na ? "N/A — buys the output" : band(s)) : "—") + "</td><td>" + esc(r.plain) + "</td><td>" +
          srcDated(r.src) + "</td></tr>";
      }).join("");
      tablewrap.innerHTML = "<table><caption>The same 15 industries as a plain table — composite fit score and what disposal costs today.</caption>" +
        "<thead><tr><th>Rank</th><th>Industry</th><th>Fit /10</th><th>Group</th><th>Disposal $/gal</th><th>In plain English</th><th>Sources</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
      tableBuilt = true;
    }

    /* ── buttons ── */
    var paused = true; // owner directive: every 3D scene starts paused — static assembled frame until Play
    var orbitOn = false;
    var pauseBtn = root.querySelector('[data-act="pause"]');
    var orbitBtn = root.querySelector('[data-act="orbit"]');
    var lensBtn = root.querySelector('[data-act="lens"]');
    var tableBtn = root.querySelector('[data-act="table"]');
    function setPaused(p) {
      paused = p;
      if (!p && !orbitOn) { // Play must start visible motion — auto-orbit is this scene's ambient motion
        orbitOn = true;
        orbitBtn.setAttribute("aria-pressed", "true");
        orbitBtn.textContent = "🔁 Auto-orbit: on";
      }
      if (controls) {
        controls.autoRotate = orbitOn && !p; // paused frame must stay pixel-static
        controls.enableDamping = !p;         // flush leftover inertia in one final paused render
      }
      pauseBtn.setAttribute("aria-pressed", String(p));
      pauseBtn.textContent = p ? "▶ Resume" : "⏸ Pause";
      if (!p) kick();
      else renderFrame(performance.now()); // leave a static assembled frame
    }
    pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    orbitBtn.addEventListener("click", function () {
      if (!controls) return;
      orbitOn = !orbitOn;
      controls.autoRotate = orbitOn && !paused;
      orbitBtn.setAttribute("aria-pressed", String(orbitOn));
      orbitBtn.textContent = orbitOn ? "🔁 Auto-orbit: on" : "🔁 Auto-orbit: off";
    });
    lensBtn.addEventListener("click", function () {
      var toMoney = LENS.name === "composite";
      applyLens(toMoney ? "savings" : "composite");
      lensBtn.setAttribute("aria-pressed", String(toMoney));
      lensBtn.textContent = toMoney ? "▲ Switch to fit-score view" : "＄ Switch to $/gal view";
      kick();
    });
    var tableOn = false, tableWasPaused = false;
    function setTableView(on) {
      if (on && !tableBuilt) buildTable();
      tableOn = on;
      tablewrap.classList.toggle("show", on);
      tableBtn.setAttribute("aria-pressed", String(on));
      tableBtn.textContent = on ? "▲ Back to chart" : "▦ Table view";
      // REPLACE the chart with the table (not append below it): the table moves
      // INTO the stage and fills the chart's exact frame; the stage keeps its
      // position and height so no empty chart-sized gap is left above the table.
      var lg = root.querySelector(".c3-legend"), ht = root.querySelector(".c3-hint");
      if (on) {
        tableWasPaused = paused;
        if (!paused) setPaused(true);
        stage.classList.add("c3-table-on");
        stage.appendChild(tablewrap);
        if (renderer) renderer.domElement.style.display = "none";
        barsWrap.style.display = "none"; // covers an open 2D bars view too
        if (lg) lg.style.display = "none";
        if (ht) ht.style.display = "none";
        detail.style.display = "none";
        tip.classList.remove("show");
      } else {
        stage.classList.remove("c3-table-on");
        root.insertBefore(tablewrap, tablewrapNext); // back to its place below the stage
        var barsOpen = !barsWrap.hidden;
        if (renderer) renderer.domElement.style.display = barsOpen ? "none" : "";
        barsWrap.style.display = "";
        if (lg) lg.style.display = barsOpen ? "none" : "";
        if (ht) ht.style.display = barsOpen ? "none" : "";
        detail.style.display = "";
        if (!tableWasPaused) setPaused(false);
      }
    }
    tableBtn.addEventListener("click", function () { setTableView(!tableOn); });

    /* ── 2D dollar bars (tiered standard: dollar bars for comparisons) — the
       same $/gal disposal ranges as the money lens, as a clean ranked 2D chart ── */
    var barsBuilt = false, barsWasPaused = false;
    var barsBtn = root.querySelector('[data-act="bars"]');
    function buildBars() {
      if (!window.ViewStd) return;
      var rows = RECS.map(function (r) {
        var s = r.sav;
        return {
          name: r.name,
          lo: s && !s.na ? s.lo : null, hi: s && !s.na ? s.hi : null,
          na: !s || s.na, lowConf: !!(s && s.lowConf),
          lab: s ? (s.na ? "N/A — buys the output" : band(s)) : "—",
          sub: r.plain,
          tip: "<b>" + esc(r.name) + "</b><br>Fit score: " + r.score.toFixed(1) + "/10 · " +
            (s ? (s.na ? "no disposal bill to save — buys the plant\u2019s output" : "existing disposal " + band(s)) : "no per-gallon figure"),
          onClick: function (e) {
            U.showDrill({
              title: r.name.toUpperCase(),
              value: r.score.toFixed(1) + " / 10 · " + (s ? (s.na ? "N/A — output buyer" : band(s)) : "—"),
              sub: r.plain + " " + (TIERS[r.tier] && TIERS[r.tier].posture ? TIERS[r.tier].posture : ""),
              source: srcDated(uniq((r.src || []).concat(s && s.src ? s.src : []))),
              x: e.clientX, y: e.clientY,
            });
          },
        };
      }).sort(function (a, b) { return (b.hi || 0) - (a.hi || 0); });
      ViewStd.dollarBars(barsWrap, {
        rows: rows, log: true, domain: [0.005, 100],
        ticks: [0.01, 0.1, 1, 10, 50],
        tickFmt: function (v) { return "$" + fv(v); },
        axisLabel: "WHAT EXISTING SUPPLIERS CHARGE TO DISPOSE OF IT ($/GAL · LOG)",
        ariaLabel: "Dollar bars: what existing suppliers charge per gallon to dispose of each industry's waste",
        note: "The same figures as the 3D money view and the table — each bar is the documented existing-supplier price range for that industry\u2019s waste, on a log scale. HCSP\u2019s own price is TBD (manufacturer cost model pending).",
      });
      barsBuilt = true;
    }
    function setBarsView(on) {
      if (on && tableOn) setTableView(false); // one view at a time — never stacked
      if (on && !barsBuilt) buildBars();
      if (!barsBuilt) return;
      stage.classList.toggle("c3-2d-on", !!on);
      if (on) { barsWasPaused = paused; if (!paused) setPaused(true); }
      else if (!barsWasPaused) setPaused(false);
      barsWrap.hidden = !on;
      if (renderer) renderer.domElement.style.display = on ? "none" : "";
      var lg = root.querySelector(".c3-legend"), ht = root.querySelector(".c3-hint");
      if (lg) lg.style.display = on ? "none" : "";
      if (ht) ht.style.display = on ? "none" : "";
      barsBtn.setAttribute("aria-pressed", String(on));
      barsBtn.textContent = on ? "▲ Back to 3D towers" : "＄ Dollar bars";
    }
    barsBtn.addEventListener("click", function () { setBarsView(barsWrap.hidden); });
    setPaused(true); // default: render one static assembled frame; motion only after the visitor presses Play

    /* ── sizing ── */
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

    /* ── animation loop with offscreen pause ── */
    var raf = null, inView = true, t0 = performance.now();
    function stepTweens(now) {
      var any = false;
      bars.forEach(function (b) {
        var a = b.anim;
        if (!a) return;
        if (paused) { // paused: snap straight to the assembled frame — no motion on load
          b.mesh.position.x = a.tx; b.mesh.position.z = a.tz;
          b.mesh.scale.y = Math.max(a.th, 0.01); b.anim = null; return;
        }
        any = true;
        a.t += (now - (a.last || now)) / 1000; a.last = now;
        var p = Math.min(Math.max(a.t / a.dur, 0), 1);
        var e = a.ease(p);
        b.mesh.position.x = a.fx + (a.tx - a.fx) * e;
        b.mesh.position.z = a.fz + (a.tz - a.fz) * e;
        b.mesh.scale.y = Math.max(a.fh + (a.th - a.fh) * e, 0.01);
        if (p >= 1) { b.anim = null; }
      });
      return any;
    }
    function renderFrame(now) {
      if (!renderer) return;
      root.c3Frames = (root.c3Frames || 0) + 1;
      stepTweens(now);
      if (controls) controls.update();
      placeLabels();
      deOverlap();
      renderer.render(scene, camera);
    }
    function loop(now) {
      raf = null;
      if (paused || !inView) return;
      renderFrame(now);
      raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && !paused && inView) raf = requestAnimationFrame(loop); }
    if (renderer) {
      if (window.IntersectionObserver) {
        new IntersectionObserver(function (entries) {
          inView = entries[0].isIntersecting;
          if (inView) kick();
        }, { threshold: 0.05 }).observe(stage);
      }
      kick();
    }

    /* QA hook: screen-space rects of all billboard labels */
    function labelRects() {
      var out = [];
      if (!renderer) return out;
      var rect = renderer.domElement.getBoundingClientRect();
      var e = camera.matrixWorld.elements;
      var right = new THREE.Vector3(e[0], e[1], e[2]);
      var up = new THREE.Vector3(e[4], e[5], e[6]);
      bars.forEach(function (b) {
        [b.name, b.val].forEach(function (spr) {
          var hw = spr.scale.x / 2, hh = spr.scale.y / 2;
          var p0 = spr.position.clone().addScaledVector(right, -hw).addScaledVector(up, -hh).project(camera);
          var p1 = spr.position.clone().addScaledVector(right, hw).addScaledVector(up, hh).project(camera);
          if (p0.z > 1 || p1.z > 1) return; // behind camera
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

    /* expose a tiny API for QA/integration */
    root.c3 = { pause: setPaused, applyLens: applyLens, selectByKey: function (k) { select(byKey[k] || null); }, labelRects: labelRects };
  }

  window.Chart3DRanking = { render: render };
})();
