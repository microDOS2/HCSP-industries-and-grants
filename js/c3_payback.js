// ═══ Chart 6 — "Savings bars with counters" (real 3D, Three.js r147 vendored) ═══
// RPT.payback — one 3D bar per industry. Each bar is the cost range that industry
// already pays existing disposal suppliers (the gross-savings ceiling): a faint
// floor column up to the low end, a bright range block from low to high. Animated
// DOM counters count up to each industry's savings ceiling on load.
// Plain-words honesty: NET PAYBACK IS NOT CALCULATED YET — manufacturer cost
// model pending. Click a bar → incumbent baseline + dated sources. Table view
// for readers. Continuous animation on load (slow orbit + rising particles);
// PAUSE button · Reading Mode / prefers-reduced-motion → static assembled frame ·
// offscreen rendering paused (IntersectionObserver).
// Self-contained IIFE: window.C3Payback.render(hostEl). Injects its own CSS.
// Integration: vendor/three.min.js + vendor/OrbitControls.js + js/data.js +
// js/sources.js first; host is an empty element (e.g. #host-payback-3d).
(function () {
  "use strict";

  var CSS = `
.c3p-root{--ink:#10222f;--ink-md:#42566a;--ink-lo:#6b7f92;--line:#dbe2ea;--bg:#fff;--bg-soft:#f5f7fa;
--blue:#2251ff;--green:#0d8a5f;--red:#c22f4e;--amber:#b57a00;
--mono:"SFMono-Regular",ui-monospace,"Roboto Mono",Menlo,Consolas,monospace;
font-family:"Helvetica Neue",Arial,"Segoe UI",sans-serif;color:var(--ink);max-width:1180px;margin:0 auto}
.c3p-sec{background:var(--bg);border:1px solid var(--line);border-radius:8px;margin:0 0 28px;padding:18px 20px 16px;box-sizing:border-box}
.c3p-kicker{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-lo);margin:0 0 4px}
.c3p-title{font-size:19px;line-height:1.3;font-weight:700;margin:0 0 6px}
.c3p-howto{font-size:13px;line-height:1.5;color:var(--ink-md);margin:0 0 6px;max-width:72ch}
.c3p-srcline{font-family:var(--mono);font-size:10.5px;line-height:1.6;color:var(--ink-lo);margin:0 0 8px;word-wrap:break-word}
.c3p-k{display:inline-block;border:1px solid var(--line);border-radius:3px;padding:0 4px;margin:0 2px 2px 0;background:var(--bg-soft);white-space:nowrap}
a.c3p-k{background:#eef2ff;border-color:#c8d4ff;color:var(--blue);text-decoration:none}
a.c3p-k:hover{text-decoration:underline}
.c3p-tools{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px;align-items:center}
.c3p-btn{font-family:var(--mono);font-size:12px;padding:5px 12px;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--ink-md);cursor:pointer}
.c3p-btn:hover{border-color:var(--blue);color:var(--blue)}
.c3p-btn[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.c3p-btn.c3p-pause{border-color:var(--amber);color:var(--amber);min-width:92px}
.c3p-btn.c3p-pause[aria-pressed="true"]{background:var(--amber);border-color:var(--amber);color:#fff}
.c3p-counter{font-family:var(--mono);font-size:12.5px;color:var(--ink);border:1px solid var(--line);border-radius:6px;padding:5px 10px;background:var(--bg-soft)}
.c3p-counter b{color:var(--blue);font-size:14px}
.c3p-notebar{display:flex;gap:8px;align-items:flex-start;border-left:3px solid var(--amber);background:#fffaf0;border-radius:0 6px 6px 0;padding:7px 10px;font-size:12.5px;color:var(--ink-md);margin:0 0 10px;max-width:900px}
.c3p-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:14px}
.c3p-stage-col{position:relative;min-height:560px}
.c3p-stage{width:100%;height:560px;display:block;border:1px solid var(--line);border-radius:8px;background:linear-gradient(#fbfcfe,#eef2f7);cursor:grab;touch-action:none}
.c3p-stage:active{cursor:grabbing}
.c3p-hint{font-family:var(--mono);font-size:10px;letter-spacing:.12em;color:var(--ink-lo);margin:6px 2px 0;text-transform:uppercase}
.c3p-label{position:absolute;left:-999px;top:-999px;transform:translate(-50%,-120%);font-size:12px;font-weight:600;color:var(--ink-md);
background:rgba(255,255,255,.92);border:1px solid var(--line);border-radius:4px;padding:2px 7px;white-space:nowrap;pointer-events:none;box-shadow:0 1px 3px rgba(16,34,47,.08)}
.c3p-label.c3p-lb-count{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--blue)}
.c3p-label.c3p-lb-name{font-weight:400;color:var(--ink-lo);transform:translate(-50%,8px)}
.c3p-label.c3p-lb-dim{font-weight:400;color:var(--ink-lo)}
.c3p-panel{border:1px solid var(--line);border-radius:8px;background:var(--bg-soft);padding:14px 16px;font-size:13px;line-height:1.55;color:var(--ink-md);overflow-y:auto;max-height:560px}
.c3p-panel h3{font-size:16px;margin:0 0 4px;color:var(--ink)}
.c3p-panel h4{font-size:12px;font-family:var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-lo);margin:14px 0 4px}
.c3p-panel p{margin:0 0 8px}
.c3p-stat{display:inline-block;font-family:var(--mono);font-size:12px;border:1px solid var(--line);border-radius:4px;padding:2px 7px;margin:0 4px 6px 0;background:#fff;color:var(--ink)}
.c3p-tag{display:inline-block;font-size:11px;font-weight:700;border-radius:4px;padding:2px 7px;margin:0 4px 6px 0}
.c3p-tag-des{background:#eef2ff;color:var(--blue);border:1px solid #c8d4ff}
.c3p-tag-dis{background:#eaf6f1;color:var(--green);border:1px solid #bfe3d4}
.c3p-tag-gap{background:#f1f3f6;color:var(--ink-lo);border:1px solid var(--line)}
.c3p-tag-tbd{background:#fffaf0;color:var(--amber);border:1px dashed var(--amber)}
.c3p-table-wrap{margin-top:12px;overflow-x:auto}
.c3p-table{border-collapse:collapse;width:100%;font-size:12.5px}
.c3p-table th{font-family:var(--mono);font-size:11px;letter-spacing:.05em;text-align:left;color:var(--ink-lo);border-bottom:2px solid var(--line);padding:6px 8px;cursor:pointer;user-select:none;white-space:nowrap}
.c3p-table th:hover{color:var(--blue)}
.c3p-table td{border-bottom:1px solid #eef1f6;padding:6px 8px;vertical-align:top;color:var(--ink-md)}
.c3p-table tr:hover td{background:#f7f9fc}
.c3p-table td.c3p-num{font-family:var(--mono);text-align:right}
.c3p-foot{font-size:11.5px;color:var(--ink-lo);margin:10px 0 0;line-height:1.5}
@media (max-width:980px){.c3p-grid{grid-template-columns:1fr}.c3p-panel{max-height:none}}
@media (prefers-reduced-motion:reduce){.c3p-root *{animation:none!important;transition:none!important}}
`;

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  var SRC_MAP = {};
  (window.SRCS || []).forEach(function (s) { SRC_MAP[s.k] = s; });
  function srcLinks(ks) {
    if (!ks || !ks.length) return "";
    return ks.map(function (k) {
      var s = SRC_MAP[k];
      if (!s) return '<span class="c3p-k">' + esc(k) + "</span>";
      var lab = esc(k) + (s.date ? " · " + esc(s.date) : "");
      var title = esc(s.cite || "") + (s.fact ? " — " + esc(s.fact) : "");
      if (s.url) return '<a class="c3p-k" href="' + esc(s.url) + '" target="_blank" rel="noopener" title="' + title + '">' + lab + "</a>";
      return '<span class="c3p-k" title="' + title + '">' + lab + "</span>";
    }).join(" ");
  }

  // Native units → rough $/m³ for one shared 3D axis (derived, flagged in the UI).
  // Same conversions as the 2D module: 1 m³ = 264.172 US gal · 1 wet tonne ≈ 1 m³ · ₹83.5 ≈ $1.
  var GAL = 264.172, INR = 83.5;
  var CONV = [
    { key: "haz",    lo: 5 * GAL,         hi: 20 * GAL,        short: "Hazardous solvents",    native: "$5–20/gal (to $50+ specialty)" },
    { key: "pharma", lo: 1.5 * GAL,       hi: 15 * GAL,        short: "Pharma / biotech",      native: "$1.5–3/gal baseline · $5–15/gal hazardous-rated" },
    { key: "pfas",   lo: 5 * GAL,         hi: 10 * GAL,        short: "PFAS concentrates",     native: "$5–10/gal incineration · $6–10/gal existing SCWO" },
    { key: "ref",    lo: 500,             hi: 1000,            short: "Refinery residuals",    native: "$500/t mid-point · $700–1,000/t service" },
    { key: "semi",   lo: 1.5 * GAL,       hi: 4 * GAL,         short: "Semiconductor streams", native: "$1.5–4/gal blended" },
    { key: "bio",    lo: 350,             hi: 500,             short: "Sewage sludge",         native: "$350–500/wet t (crisis zones)" },
    { key: "islands", lo: 300,            hi: null,            short: "Islands / resorts",     native: "≥$300/wet t threshold (plus diesel ≥$0.35/kWh)" },
    { key: "fnb",    lo: 45 * GAL / 1000, hi: 120 * GAL / 1000, short: "Food & beverage",      native: "$45–120 per 1,000 gal hauled" },
    { key: "tex",    lo: 180 / INR,       hi: 350 / INR,       short: "Textile — India ZLD",   native: "₹180–350/m³ (zero-liquid-discharge train)" },
    { key: "distill", lo: null,           hi: null,            short: "Distillery — India",    native: "~$1.3–2.7M/yr per site (not a per-volume price)" },
    { key: "cea",    lo: null,            hi: null,            short: "Indoor agriculture",    native: "No standalone equipment case — service model only" }
  ];
  var KIND_LABEL = { destruction: "Destruction service", disposal: "Disposal service", gap: "No standalone case" };

  function fmtM3(v) {
    if (v == null) return "—";
    if (v >= 1000) return "$" + (v / 1000).toFixed(1).replace(/\.0$/, "") + "k/m³";
    if (v >= 100) return "$" + Math.round(v) + "/m³";
    return "$" + v.toFixed(1).replace(/\.0$/, "") + "/m³";
  }
  function fmtM3full(v) {
    if (v == null) return "—";
    return "$" + Math.round(v).toLocaleString("en-US") + "/m³";
  }

  function render(host) {
    if (!host) return;
    if (!window.THREE || !window.RPT || !RPT.payback) {
      host.innerHTML = "<p style='padding:24px;font-size:13px'>3D savings bars unavailable — Three.js or report data not loaded.</p>";
      return;
    }
    if (!document.getElementById("c3p-style")) {
      var st = document.createElement("style"); st.id = "c3p-style"; st.textContent = CSS;
      document.head.appendChild(st);
    }
    var byKey = {};
    RPT.payback.forEach(function (d) { byKey[d.key] = d; });
    var ROWS = CONV.filter(function (c) { return byKey[c.key]; }).map(function (c) {
      var r = byKey[c.key];
      return { key: c.key, name: r.name, short: c.short, basis: r.basis, kind: r.kind, src: r.src,
               lo: c.lo, hi: c.hi, native: c.native };
    });
    var maxHi = 0;
    ROWS.forEach(function (r) { if (r.hi != null && r.hi > maxHi) maxHi = r.hi; });

    var REDUCED = false;
    try { REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    function stillMode() { return REDUCED || document.documentElement.classList.contains("reader"); }

    /* ── DOM scaffold ── */
    var root = document.createElement("div"); root.className = "c3p-root";
    var sec = document.createElement("section"); sec.className = "c3p-sec";
    root.appendChild(sec); host.appendChild(root);
    sec.innerHTML =
      '<div class="c3p-head">' +
        '<p class="c3p-kicker">Chart 6 · Gross savings by industry · real 3D</p>' +
        '<h3 class="c3p-title">What each industry already pays to make its waste go away — that is the savings ceiling</h3>' +
        '<p class="c3p-howto">What this shows: each 3D bar is one industry. The bar spans the price range that industry pays ' +
        'existing suppliers today to destroy or dispose of its waste — that whole bill is what a cheaper process could save ' +
        '(the gross addressable savings). Numbers count up when the chart loads. Units differ by industry, so bars are converted ' +
        'to rough US dollars per cubic meter on a shared scale; each bar keeps its native units in the detail panel.</p>' +
        '<p class="c3p-srcline">Sources: ' + srcLinks(["K33", "K21", "K37", "K40", "K47", "K43", "K42", "K46", "K61", "K65", "K35"]) + "</p>" +
      "</div>";

    var notebar = document.createElement("div"); notebar.className = "c3p-notebar";
    notebar.innerHTML = "<b>In plain words:</b>&nbsp;net payback is not calculated yet — the manufacturer's cost model is pending, " +
      "so these bars show only what industries pay today (the most that could be saved), never how fast HCSP earns its cost back.";
    sec.appendChild(notebar);

    var tools = document.createElement("div"); tools.className = "c3p-tools"; sec.appendChild(tools);
    var pauseBtn = document.createElement("button");
    pauseBtn.type = "button"; pauseBtn.className = "c3p-btn c3p-pause";
    pauseBtn.setAttribute("aria-pressed", "false"); pauseBtn.textContent = "❚❚ Pause";
    tools.appendChild(pauseBtn);
    var replayBtn = document.createElement("button");
    replayBtn.type = "button"; replayBtn.className = "c3p-btn"; replayBtn.textContent = "↻ Replay counters";
    tools.appendChild(replayBtn);
    var tableBtn = document.createElement("button");
    tableBtn.type = "button"; tableBtn.className = "c3p-btn";
    tableBtn.setAttribute("aria-pressed", "false"); tableBtn.textContent = "Table view";
    tools.appendChild(tableBtn);
    /* tiered standard: dollar bars for comparisons — a clean 2D alternative */
    var barsBtn = document.createElement("button");
    barsBtn.type = "button"; barsBtn.className = "c3p-btn";
    barsBtn.setAttribute("aria-pressed", "false"); barsBtn.textContent = "＄ Dollar bars";
    tools.appendChild(barsBtn);
    var topCounter = document.createElement("span"); topCounter.className = "c3p-counter";
    topCounter.innerHTML = "Top savings ceiling: <b>$0/m³</b>";
    tools.appendChild(topCounter);

    var grid = document.createElement("div"); grid.className = "c3p-grid"; sec.appendChild(grid);
    var stageCol = document.createElement("div"); stageCol.className = "c3p-stage-col"; grid.appendChild(stageCol);
    var canvas = document.createElement("canvas"); canvas.className = "c3p-stage";
    canvas.setAttribute("aria-label", "Interactive 3D bar chart: one floating range bar per industry showing the cost it pays existing waste-disposal suppliers today");
    stageCol.appendChild(canvas);
    var hint = document.createElement("p"); hint.className = "c3p-hint";
    hint.textContent = "Scene orbits slowly · drag to look around · scroll to zoom · click a bar for its baseline";
    stageCol.appendChild(hint);
    var panel = document.createElement("aside"); panel.className = "c3p-panel";
    panel.setAttribute("aria-live", "polite"); grid.appendChild(panel);
    var tableWrap = document.createElement("div"); tableWrap.className = "c3p-table-wrap";
    tableWrap.style.display = "none"; sec.appendChild(tableWrap);
    var foot = document.createElement("p"); foot.className = "c3p-foot";
    foot.textContent = "Conversions for one shared 3D axis (derived, flagged): 1 m³ = 264.172 US gal · 1 wet tonne ≈ 1 m³ · ₹83.5 ≈ $1. " +
      "Bars are ordered tallest-first by the top of each range. Two industries have no per-volume price — they appear as flat outline markers.";
    sec.appendChild(foot);

    /* ── three.js scene ── */
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true,
        preserveDrawingBuffer: /[?&]qa=1\b/.test(location.search) /* QA frame capture */ });
    var QA_THROTTLE = /[?&]qa=1\b/.test(location.search), lastRender = 0;
    } catch (e) {
      stageCol.innerHTML = "<p style='padding:40px;font-size:13px'>WebGL is unavailable in this browser — the 3D savings bars cannot start.</p>";
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.HCSP_DPR_CAP || 2));
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf2f5f9, 40, 95);
    var camera = new THREE.PerspectiveCamera(40, 2, 0.1, 200);
    camera.position.set(0, 11, 29.5);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
    var sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(8, 14, 10); scene.add(sun);

    var KIND_COLOR = { destruction: 0x2251ff, disposal: 0x0d8a5f, gap: 0x8a99a8 };
    var group = new THREE.Group(); scene.add(group);
    var ground = new THREE.Mesh(new THREE.CircleGeometry(26, 64),
      new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.85 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.06; group.add(ground);
    var gridH = new THREE.GridHelper(56, 28, 0xd8dfe9, 0xe8edf4);
    gridH.position.y = -0.05; group.add(gridH);

    // log-ish height scale so $2/m³ and $5,283/m³ share one readable axis
    var HMAX = 10;
    function hy(v) { return 0.35 + (Math.log(v) / Math.log(maxHi)) * (HMAX - 0.7); }

    // order tallest-first for the classic "savings ladder" read
    var bars = ROWS.slice().sort(function (a, b) { return (b.hi || 0) - (a.hi || 0); });
    var labels = [], clickable = [], particles = [], barObjs = [], counterEls = [];
    var N = bars.length, SP = 2.7, X0 = -(N - 1) * SP / 2;

    bars.forEach(function (r, i) {
      var x = X0 + i * SP;
      var col = KIND_COLOR[r.kind] || 0x2251ff;
      var g = new THREE.Group(); g.position.set(x, 0, 0); group.add(g);

      if (r.lo != null) {
        var yLo = hy(r.lo), yHi = hy(r.hi || r.lo);
        // faint floor column below the range
        var floorH = Math.max(0.05, yLo - 0.12);
        var floor = new THREE.Mesh(new THREE.BoxGeometry(1.05, floorH, 1.05),
          new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.16, roughness: 0.6 }));
        floor.position.y = floorH / 2; g.add(floor);
        // the range block itself
        var bh = Math.max(0.25, yHi - yLo);
        var block = new THREE.Mesh(new THREE.BoxGeometry(1.3, bh, 1.3),
          new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.55, roughness: 0.4, metalness: 0.1 }));
        block.position.y = (yLo + yHi) / 2; g.add(block);
        block.add(new THREE.LineSegments(new THREE.EdgesGeometry(block.geometry),
          new THREE.LineBasicMaterial({ color: col })));
        block.userData.idx = i; floor.userData.idx = i;
        clickable.push(block, floor);
        barObjs.push({ mesh: block, baseY: block.position.y });
        // rising "$" particles above the bar — the money on the table
        for (var p = 0; p < 4; p++) {
          var s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6),
            new THREE.MeshBasicMaterial({ color: col }));
          s.userData = { t: p / 4, yLo: yHi + 0.25, span: 1.6 };
          g.add(s); particles.push(s);
        }
        var cnt = label(r.hi != null ? "$0/m³" : "≥$0/m³", "c3p-lb-count", x, yHi + 2.15, 0);
        counterEls.push({ el: cnt.el, row: r });
        label(r.short, "c3p-lb-name", x, 0.02, 1.35);
      } else {
        // no per-volume price → flat dashed-outline marker on the floor
        var plate = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.14, 1.3),
          new THREE.MeshStandardMaterial({ color: 0x8a99a8, transparent: true, opacity: 0.25, roughness: 0.7 }));
        plate.position.y = 0.07; g.add(plate);
        var edges = new THREE.LineSegments(new THREE.EdgesGeometry(plate.geometry),
          new THREE.LineDashedMaterial({ color: 0x8a99a8, dashSize: 0.14, gapSize: 0.1 }));
        edges.computeLineDistances(); plate.add(edges);
        plate.userData.idx = i; clickable.push(plate);
        barObjs.push({ mesh: plate, baseY: plate.position.y });
        var cnt2 = label("no $/m³ price", "c3p-lb-count", x, 2.35, 0);
        counterEls.push({ el: cnt2.el, row: r });
        label(r.short, "c3p-lb-name", x, 0.02, 1.35);
      }
    });

    // axis pole (log scale) at the left end
    var axX = X0 - 2.4;
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, HMAX + 0.5, 8),
      new THREE.MeshBasicMaterial({ color: 0x6b7f92 }));
    pole.position.set(axX, (HMAX + 0.5) / 2, 0); group.add(pole);
    [2, 20, 200, 2000].forEach(function (v) {
      if (v > maxHi) return;
      var tick = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.045, 0.045),
        new THREE.MeshBasicMaterial({ color: 0x6b7f92 }));
      tick.position.set(axX + 0.25, hy(v), 0); group.add(tick);
      label(fmtM3(v), "c3p-lb-dim", axX + 0.35, hy(v) + 0.18, 0, 26, 0);
    });
    label("log scale — equal steps = equal multiples", "c3p-lb-dim", axX + 0.3, HMAX + 0.85, 0, 40, 0);

    function label(text, cls, x, y, z, dx, dy) {
      var el = document.createElement("div");
      el.className = "c3p-label" + (cls ? " " + cls : "");
      el.textContent = text;
      stageCol.appendChild(el);
      labels.push({ el: el, v: new THREE.Vector3(x, y, z), dx: dx || 0, dy: dy || 0 });
      return { el: el };
    }

    /* ── count-up counters (gross addressable savings) ── */
    var countStart = -1, COUNT_MS = 1900;
    function setCounters(u) { // u in [0,1]
      var e = 1 - Math.pow(1 - u, 3); // ease-out cubic
      counterEls.forEach(function (c) {
        if (c.row.hi != null) c.el.textContent = fmtM3full(c.row.hi * e);
        else if (c.row.lo != null) c.el.textContent = "≥" + fmtM3full(c.row.lo * e); // threshold-only rows (islands)
      });
      topCounter.innerHTML = "Top savings ceiling: <b>" + fmtM3full(maxHi * e) + "</b>";
    }
    function startCounters() {
      if (stillMode() || paused) { countStart = -2; setCounters(1); }
      else { countStart = -1; setCounters(0); poke(); }
    }
    replayBtn.addEventListener("click", function () { startCounters(); });

    /* ── detail panel ── */
    function overviewPanel() {
      panel.innerHTML =
        "<h3>How to read the savings bars</h3>" +
        "<p>Each bar is the range of prices an industry pays existing suppliers today to make its waste problem disappear. " +
        "That whole bill is the most a cheaper process could save — the gross addressable savings.</p>" +
        "<h4>What is deliberately missing</h4>" +
        "<p><span class='c3p-tag-tbd'>Net payback — not calculated yet</span> Earning-back time needs HCSP's own cost and price, " +
        "and the manufacturer cost model is pending. No bar here implies an HCSP price.</p>" +
        "<h4>Colors</h4>" +
        "<p><span class='c3p-tag c3p-tag-des'>Destruction service</span> <span class='c3p-tag c3p-tag-dis'>Disposal service</span> " +
        "<span class='c3p-tag c3p-tag-gap'>No standalone case</span></p>" +
        "<p>Click a bar for the incumbent baseline it displaces, with sources.</p>" +
        "<p>" + srcLinks(["K22"]) + "</p>";
    }
    function select(i) {
      var r = bars[i];
      barObjs.forEach(function (b, j) {
        b.mesh.material.opacity = (j === i) ? 0.9 : (r.lo != null && bars[j].lo != null ? 0.55 : 0.25);
      });
      var tagCls = r.kind === "destruction" ? "c3p-tag-des" : r.kind === "disposal" ? "c3p-tag-dis" : "c3p-tag-gap";
      panel.innerHTML =
        "<h3>" + esc(r.name) + "</h3>" +
        "<span class='c3p-tag " + tagCls + "'>" + esc(KIND_LABEL[r.kind] || r.kind) + "</span>" +
        (r.lo != null ? '<span class="c3p-stat">≈ ' + fmtM3full(r.lo) + " – " + fmtM3full(r.hi || r.lo) + " today</span>" : "") +
        '<span class="c3p-tag-tbd">Net payback: not calculated — manufacturer cost model pending</span>' +
        "<h4>Incumbent baseline this displaces</h4><p>" + esc(r.basis) + "</p>" +
        "<h4>Native pricing units</h4><p>" + esc(r.native) + "</p>" +
        (r.lo != null ? "<h4>On the shared axis</h4><p>≈ " + fmtM3full(r.lo) + " – " + fmtM3full(r.hi || r.lo) +
          " per cubic meter (derived conversion — native units above are the real figures).</p>" : "") +
        "<h4>Sources</h4><p>" + srcLinks(r.src) + "</p>";
      dirty = true; poke();
    }

    /* ── sortable table view ── */
    var tableBuilt = false;
    function buildTable() {
      var cols = [
        { lab: "Industry", key: function (r) { return r.name; }, cell: function (r) { return "<b>" + esc(r.name) + "</b>"; } },
        { lab: "Kind", key: function (r) { return r.kind; }, cell: function (r) {
            var c = r.kind === "destruction" ? "c3p-tag-des" : r.kind === "disposal" ? "c3p-tag-dis" : "c3p-tag-gap";
            return "<span class='c3p-tag " + c + "'>" + esc(KIND_LABEL[r.kind] || r.kind) + "</span>"; } },
        { lab: "Incumbent baseline (native units)", key: function (r) { return r.basis; }, cell: function (r) { return esc(r.basis); } },
        { lab: "≈ $/m³ low", num: true, key: function (r) { return r.lo == null ? -1 : r.lo; }, cell: function (r) { return fmtM3full(r.lo); } },
        { lab: "≈ $/m³ high", num: true, key: function (r) { return r.hi == null ? -1 : r.hi; }, cell: function (r) { return fmtM3full(r.hi); } },
        { lab: "Net payback", key: function () { return ""; }, cell: function () { return '<span class="c3p-tag-tbd">Not calculated — cost model pending</span>'; } },
        { lab: "Sources", key: function (r) { return r.src.join(""); }, cell: function (r) { return srcLinks(r.src); } }
      ];
      var sortI = 4, sortDir = -1;
      var tbl = document.createElement("table"); tbl.className = "c3p-table";
      function draw() {
        var rows = ROWS.slice().sort(function (a, b) {
          var va = cols[sortI].key(a), vb = cols[sortI].key(b);
          return (va < vb ? -1 : va > vb ? 1 : 0) * sortDir;
        });
        tbl.innerHTML = "<thead><tr>" + cols.map(function (c, i) {
          return "<th data-i='" + i + "'>" + esc(c.lab) + (i === sortI ? (sortDir > 0 ? " ▲" : " ▼") : "") + "</th>";
        }).join("") + "</tr></thead><tbody>" + rows.map(function (r) {
          return "<tr data-key='" + esc(r.key) + "'>" + cols.map(function (c) {
            return "<td class='" + (c.num ? "c3p-num" : "") + "'>" + c.cell(r) + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody>";
        tbl.querySelectorAll("th").forEach(function (th) {
          th.addEventListener("click", function () {
            var i = +th.dataset.i;
            if (i === sortI) sortDir *= -1; else { sortI = i; sortDir = 1; }
            draw();
          });
        });
        tbl.querySelectorAll("tbody tr").forEach(function (tr) {
          tr.addEventListener("click", function () {
            var i = bars.findIndex(function (b) { return b.key === tr.dataset.key; });
            if (i >= 0) select(i);
          });
        });
      }
      draw();
      tableWrap.innerHTML = ""; tableWrap.appendChild(tbl);
      tableBuilt = true;
    }
    tableBtn.addEventListener("click", function () {
      var show = tableWrap.style.display === "none";
      tableWrap.style.display = show ? "" : "none";
      tableBtn.setAttribute("aria-pressed", show ? "true" : "false");
      if (show && !tableBuilt) buildTable();
    });

    /* ── 2D dollar bars (tiered standard) — the same per-industry savings
       ceilings as the 3D bars, on one clean ranked 2D chart ── */
    var barsWrap = document.createElement("div");
    barsWrap.className = "c3p-2d"; barsWrap.style.display = "none";
    stageCol.appendChild(barsWrap);
    var barsBuilt = false;
    function buildBars() {
      if (!window.ViewStd) return;
      var rows = ROWS.map(function (r) {
        return {
          name: r.name,
          lo: r.lo, hi: r.hi == null ? r.lo : r.hi, na: r.lo == null,
          lab: r.lo == null ? "No per-volume price" : (r.hi == null ? "≥" + fmtM3full(r.lo) : fmtM3full(r.lo) + "–" + fmtM3full(r.hi).replace("$", "")),
          sub: KIND_LABEL[r.kind] || r.kind,
          tip: "<b>" + esc(r.name) + "</b><br>" + esc(r.native) + "<br>Net payback: not calculated — manufacturer cost model pending",
          onClick: function () {
            var bi = bars.findIndex(function (b) { return b.key === r.key; });
            if (bi >= 0) select(bi);
          },
        };
      }).sort(function (a, b) { return (b.hi || 0) - (a.hi || 0); });
      ViewStd.dollarBars(barsWrap, {
        rows: rows, log: true, domain: [5, 8000],
        ticks: [10, 100, 1000, 5000],
        tickFmt: function (v) { return "$" + (v >= 1000 ? (v / 1000) + "k" : v); },
        axisLabel: "WHAT EXISTING SUPPLIERS CHARGE TODAY (≈ $/M³ · LOG · DERIVED CONVERSION)",
        ariaLabel: "Dollar bars: the savings ceiling per industry — what existing suppliers charge, converted to rough dollars per cubic meter",
        note: "The same figures as the 3D bars and the table. Native units differ per industry (per gallon, per wet tonne, per 1,000 gallons) and are converted for one shared axis (derived, flagged); each industry's detail panel keeps the native units. Net payback is not calculated — manufacturer cost model pending.",
      });
      barsBuilt = true;
    }
    barsBtn.addEventListener("click", function () {
      var show = barsWrap.style.display === "none";
      if (show && !barsBuilt) buildBars();
      if (!barsBuilt) return;
      barsWrap.style.display = show ? "" : "none";
      canvas.style.display = show ? "none" : "";
      hint.style.display = show ? "none" : "";
      stageCol.classList.toggle("c3-2d-on", show);
      stageCol.querySelectorAll(".c3p-label").forEach(function (el) { el.style.display = show ? "none" : ""; });
      if (show && !paused) { paused = true; applyMotionState(); }
      barsBtn.setAttribute("aria-pressed", show ? "true" : "false");
      barsBtn.textContent = show ? "▲ Back to 3D bars" : "＄ Dollar bars";
    });

    /* ── controls / interaction ── */
    var controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.autoRotate = true; controls.autoRotateSpeed = 0.7;
    controls.target.set(0, 4, 0);
    controls.minDistance = 8; controls.maxDistance = 55;
    controls.maxPolarAngle = Math.PI * 0.52;

    // QA hook: world→screen projection for automated click tests
    canvas._project = function (x, y, z) {
      var r = canvas.getBoundingClientRect();
      var v = new THREE.Vector3(x, y, z).project(camera);
      return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height, behind: v.z > 1 };
    };

    var paused = false;
    function applyMotionState() {
      controls.autoRotate = !paused && !stillMode();
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.textContent = paused ? "▶ Resume" : "❚❚ Pause";
      poke();
    }
    pauseBtn.addEventListener("click", function () { paused = !paused; applyMotionState(); });

    var ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), downAt = null;
    canvas.addEventListener("pointerdown", function (e) { downAt = [e.clientX, e.clientY]; });
    canvas.addEventListener("pointerup", function (e) {
      if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) { downAt = null; return; }
      downAt = null;
      var r = canvas.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ptr, camera);
      var hit = ray.intersectObjects(clickable, false)[0];
      if (hit && hit.object.userData.idx != null) select(hit.object.userData.idx);
    });

    /* ── render loop: continuous unless paused / reading mode / offscreen ── */
    var dirty = true, inView = false, raf = 0, lastT = 0, counted = false;
    function poke() { if (inView && !raf) raf = requestAnimationFrame(frame); }
    controls.addEventListener("change", function () { dirty = true; poke(); });
    function resize() {
      var w = stageCol.clientWidth, h = canvas.clientHeight || 560;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      dirty = true; poke();
    }
    addEventListener("resize", resize, { passive: true });

    function animate(t) {
      var dt = Math.min(0.05, (t - lastT) / 1000 || 0); lastT = t;
      particles.forEach(function (s) {
        var u = s.userData;
        u.t = (u.t + dt * 0.3) % 1;
        s.position.set(Math.sin(u.t * 9.4) * 0.4, u.yLo + u.t * u.span, Math.cos(u.t * 9.4) * 0.4);
        s.material.opacity = 1 - u.t; s.material.transparent = true;
      });
      barObjs.forEach(function (b, i) {
        b.mesh.position.y = b.baseY + Math.sin(t * 0.0012 + i * 0.9) * 0.04;
      });
      if (countStart >= 0 || countStart === -1) {
        if (countStart === -1) countStart = t;
        var u = Math.min(1, (t - countStart) / COUNT_MS);
        setCounters(u);
        if (u >= 1) countStart = -2; // done
      }
      dirty = true;
    }

    function placeLabels() {
      var w = stageCol.clientWidth, h = canvas.clientHeight || 560;
      // project all labels, then resolve overlaps top-to-bottom (and back up
      // if the stack hits the canvas floor) so no two labels ever collide
      var items = [];
      labels.forEach(function (L) {
        var p = L.v.clone(); p.project(camera);
        if (p.z > 1) { L.el.style.display = "none"; return; }
        L.el.style.display = "";
        var halfW = L.el.offsetWidth / 2 || 50, halfH = L.el.offsetHeight || 16;
        var px = Math.max(halfW + 4, Math.min(w - halfW - 4, (p.x * 0.5 + 0.5) * w + L.dx));
        var py = Math.max(halfH + 2, Math.min(h - halfH - 2, (-p.y * 0.5 + 0.5) * h + L.dy));
        items.push({ L: L, x: px, y: py, hw: halfW, hh: halfH });
      });
      function hits(a, b) {
        return (Math.min(a.x + a.hw, b.x + b.hw) - Math.max(a.x - a.hw, b.x - b.hw) > 2) &&
               (Math.min(a.y + a.hh, b.y + b.hh) - Math.max(a.y - a.hh, b.y - b.hh) > 2);
      }
      items.sort(function (a, b) { return a.y - b.y; });
      for (var pass = 0; pass < 4; pass++) {           // push down
        for (var i = 1; i < items.length; i++) {
          for (var j = 0; j < i; j++) {
            if (hits(items[i], items[j])) items[i].y = items[j].y + items[j].hh + items[i].hh + 4;
          }
        }
      }
      for (var pass2 = 0; pass2 < 4; pass2++) {        // push back up if past the floor
        for (var i2 = items.length - 2; i2 >= 0; i2--) {
          if (items[i2 + 1].y + items[i2 + 1].hh > h - 2) items[i2 + 1].y = h - 2 - items[i2 + 1].hh;
          if (hits(items[i2], items[i2 + 1]) && items[i2 + 1].y + items[i2 + 1].hh >= h - 2) {
            items[i2].y = items[i2 + 1].y - items[i2 + 1].hh - items[i2].hh - 4;
          }
          if (items[i2].y - items[i2].hh < 2) items[i2].y = 2 + items[i2].hh;
        }
      }
      items.forEach(function (it) {
        it.L.el.style.left = it.x + "px"; it.L.el.style.top = it.y + "px";
      });
    }

    function frame(t) {
      raf = 0;
      if (!inView) return;
      if (QA_THROTTLE && t != null && t - lastRender < 80) { raf = requestAnimationFrame(frame); return; }
      lastRender = t || 0;
      var animating = !paused && !stillMode();
      if (animating && t != null) animate(t);
      else if (!counted) { counted = true; setCounters(1); }
      if (controls.enableDamping) controls.update();
      if (dirty || animating) {
        renderer.render(scene, camera);
        placeLabels();
        dirty = false;
      }
      if (animating) raf = requestAnimationFrame(frame);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        inView = e.isIntersecting;
        if (inView) { dirty = true; poke(); }
      });
    }, { threshold: 0.05 });
    io.observe(root);

    overviewPanel();
    resize();
    applyMotionState();
    if (stillMode()) { countStart = -2; counted = true; setCounters(1); } // reduced-motion: final values, no count-up
  }

  window.C3Payback = { render: render };
})();
