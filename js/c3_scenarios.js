// ═══ Chart 10 — "The living site + materials separation" (real 3D, r147 vendored) ═══
// Part A — THE LIVING SITE: the six energy scenarios (RPT.energy_scenarios A–F)
//   as a working 3D site: host blocks, the HCSP unit, buyer buildings, and
//   CONTINUOUS animated flows (particles travel the waste / water / energy pipes).
//   The scenario picker rebuilds the scene; the panel lists the three revenue
//   streams, illustrative economics, and what the site needs first.
// Part B — MATERIALS SEPARATION: a 3D exploded view of materials recovery
//   (RPT.materials_recovery): waste enters a separator and six labeled chips
//   lift out (potash, lithium, N&P, salts, metals, silica). Roadmap honesty:
//   not a shipping feature; every stream needs a purity test. Click a chip for
//   detail + dated sources.
// Continuous animation on load · visible PAUSE buttons · Reading Mode /
// prefers-reduced-motion → static assembled frame · offscreen rendering paused.
// Self-contained IIFE: window.C3Scenarios.render(hostEl). Injects its own CSS.
// Integration: vendor/three.min.js + vendor/OrbitControls.js + js/data.js +
// js/sources.js first; host is an empty element (e.g. #host-scenarios-3d).
(function () {
  "use strict";

  var CSS = `
.c3x-root{--ink:#10222f;--ink-md:#42566a;--ink-lo:#6b7f92;--line:#dbe2ea;--bg:#fff;--bg-soft:#f5f7fa;
--blue:#2251ff;--green:#00806a;--red:#c22f4e;--amber:#8f6300;--copper:#b07a10;
--mono:"SFMono-Regular",ui-monospace,"Roboto Mono",Menlo,Consolas,monospace;
font-family:"Helvetica Neue",Arial,"Segoe UI",sans-serif;color:var(--ink);max-width:1180px;margin:0 auto;container-type:inline-size}
.c3x-sec{background:var(--bg);border:1px solid var(--line);border-radius:8px;margin:0 0 28px;padding:18px 20px 16px;box-sizing:border-box}
.c3x-kicker{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-lo);margin:0 0 4px}
.c3x-title{font-size:19px;line-height:1.3;font-weight:700;margin:0 0 6px}
.c3x-howto{font-size:13px;line-height:1.5;color:var(--ink-md);margin:0 0 6px;max-width:72ch}
.c3x-srcline{font-family:var(--mono);font-size:10.5px;line-height:1.6;color:var(--ink-lo);margin:0 0 8px;word-wrap:break-word}
.c3x-k{display:inline-block;border:1px solid var(--line);border-radius:3px;padding:0 4px;margin:0 2px 2px 0;background:var(--bg-soft);white-space:nowrap}
a.c3x-k{background:#eef2ff;border-color:#c8d4ff;color:var(--blue);text-decoration:none}
a.c3x-k:hover{text-decoration:underline}
.c3x-tools{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px;align-items:center}
.c3x-btn{font-family:var(--mono);font-size:12px;padding:5px 12px;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--ink-md);cursor:pointer}
.c3x-btn:hover{border-color:var(--blue);color:var(--blue)}
.c3x-btn[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.c3x-btn.c3x-pause{border-color:var(--amber);color:var(--amber);min-width:92px}
.c3x-btn.c3x-pause[aria-pressed="true"]{background:var(--amber);border-color:var(--amber);color:#fff}
.c3x-chip{font-size:12px;padding:5px 10px;border:1px solid var(--line);border-radius:14px;background:var(--bg-soft);color:var(--ink-md);cursor:pointer}
.c3x-chip[aria-pressed="true"]{background:#eef2ff;border-color:var(--blue);color:var(--blue);font-weight:600}
.c3x-grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:14px}
.c3x-stage-col{position:relative;min-height:540px}
.c3x-stage{width:100%;height:540px;display:block;border:1px solid var(--line);border-radius:8px;background:linear-gradient(#fbfcfe,#eef2f7);cursor:grab;touch-action:none}
.c3x-stage:active{cursor:grabbing}
.c3x-hint{font-family:var(--mono);font-size:10px;letter-spacing:.12em;color:var(--ink-lo);margin:6px 2px 0;text-transform:uppercase}
.c3x-label{position:absolute;left:-999px;top:-999px;transform:translate(-50%,-120%);font-size:12px;font-weight:600;color:var(--ink-md);
background:rgba(255,255,255,.92);border:1px solid var(--line);border-radius:4px;padding:2px 7px;white-space:nowrap;pointer-events:none;box-shadow:0 1px 3px rgba(16,34,47,.08)}
.c3x-label.c3x-lb-big{font-size:13px;font-weight:700;color:var(--ink)}
.c3x-label.c3x-lb-blue{color:var(--blue);border-color:#c8d4ff;background:rgba(238,242,255,.94)}
.c3x-label.c3x-lb-red{color:var(--red);border-color:#f2c7d0;background:rgba(255,255,255,.94)}
.c3x-label.c3x-lb-green{color:var(--green);border-color:#bfe3d4;background:rgba(255,255,255,.94)}
.c3x-label.c3x-lb-amber{color:var(--copper);border-color:#ecd9ac;background:rgba(255,255,255,.94)}
.c3x-label.c3x-lb-dim{font-weight:400;color:var(--ink-lo)}
.c3x-panel{border:1px solid var(--line);border-radius:8px;background:var(--bg-soft);padding:14px 16px;font-size:13px;line-height:1.55;color:var(--ink-md);overflow-y:auto;max-height:540px}
.c3x-panel h3{font-size:16px;margin:0 0 4px;color:var(--ink)}
.c3x-panel h4{font-size:12px;font-family:var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-lo);margin:14px 0 4px}
.c3x-panel p{margin:0 0 8px}
.c3x-panel ul{margin:0 0 8px;padding-left:18px}
.c3x-letter{display:inline-block;font-family:var(--mono);font-weight:700;font-size:15px;color:#fff;background:var(--blue);border-radius:6px;padding:1px 9px;margin-right:6px}
.c3x-tag{font-style:italic;color:var(--ink-lo)}
.c3x-earn{border:1px solid var(--line);border-radius:6px;background:#fff;padding:7px 9px;margin:0 0 6px}
.c3x-earn b{display:block;color:var(--ink);margin-bottom:2px}
.c3x-econ li{margin-bottom:5px}
.c3x-econ .c3x-ev{font-family:var(--mono);font-size:12px;color:var(--ink)}
.c3x-ill{font-size:11px;font-weight:700;color:var(--amber)}
.c3x-warn{border-left:3px solid var(--amber);background:#fffaf0;padding:7px 10px;border-radius:0 6px 6px 0;margin:8px 0}
.c3x-status{display:inline-block;font-size:11px;font-weight:700;color:var(--amber);border:1px dashed var(--amber);border-radius:4px;padding:2px 8px;background:#fffaf0;margin:0 0 8px}
.c3x-table-wrap{margin-top:12px;overflow-x:auto}
.c3x-table{border-collapse:collapse;width:100%;font-size:12.5px}
.c3x-table th{font-family:var(--mono);font-size:11px;letter-spacing:.05em;text-align:left;color:var(--ink-lo);border-bottom:2px solid var(--line);padding:6px 8px;cursor:pointer;user-select:none;white-space:nowrap}
.c3x-table th:hover{color:var(--blue)}
.c3x-table td{border-bottom:1px solid #eef1f6;padding:6px 8px;vertical-align:top;color:var(--ink-md)}
.c3x-table tr:hover td{background:#f7f9fc}
.c3x-foot{font-size:11.5px;color:var(--ink-lo);margin:10px 0 0;line-height:1.5}
@media (max-width:980px){.c3x-grid{grid-template-columns:1fr}.c3x-panel{max-height:none}}
/* narrow host column (e.g. the main site's dashboard rail narrows the page):
   stack stage above panel so the 3D stage keeps a usable width */
@container (max-width:820px){.c3x-grid{grid-template-columns:1fr}.c3x-panel{max-height:none}}
@media (prefers-reduced-motion:reduce){.c3x-root *{animation:none!important;transition:none!important}}
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
      if (!s) return '<span class="c3x-k">' + esc(k) + "</span>";
      var lab = esc(k) + (s.date ? " · " + esc(s.date) : "");
      var title = esc(s.cite || "") + (s.fact ? " — " + esc(s.fact) : "");
      if (s.url) return '<a class="c3x-k" href="' + esc(s.url) + '" target="_blank" rel="noopener" title="' + title + '">' + lab + "</a>";
      return '<span class="c3x-k" title="' + title + '">' + lab + "</span>";
    }).join(" ");
  }

  // guardrails — condensed plain words, same facts as the scenario data chapters
  var GUARDS = [
    ["Spare heat is not automatic", "Surplus heat exists only when the waste is strong enough — above roughly 35–60 g/L COD — and the plant is big enough. Below that line the plant heats itself and has nothing left to sell."],
    ["Chillers want big, steady cold customers", "Heat-driven chillers pay at steady loads of at least 500 refrigeration tons (about 1.8 MW of cooling) — and full electric backup chillers always stay installed, because the waste plant is never the only source of cold."],
    ["Ammonia needs distance", "Ammonia is the industry's standard refrigerant but toxic: the equipment is sited away from occupied buildings, and big charges trigger federal safety rules. For cooling next to people, the lithium-bromide option avoids this entirely."]
  ];

  /* ════════════════════════════ PART A — THE LIVING SITE ════════════════════════════ */
  function renderSite(host) {
    var SC = RPT.energy_scenarios;
    if (!SC || !SC.length) return;

    // per-scenario 3D layout (visuals only — every word/figure is from data.js)
    var SCENES = {
      A: { hostLabel: "HOST — DISTILLERY / SEWAGE / FOOD", hostSub: "distillery · sewage works · food factory",
        hostBlurb: "The host's strong waste is the fuel: " + SC[0].diagram.feed + ".",
        buyers: [{ name: "NEIGHBOR BUYER", sub: "data center · cold store · greenhouse", kind: "generic", x: 5.4, z: 0,
          blurb: "A neighbor within piping distance buys the electricity and chilled water — the energy sale is stacked on top of the destruction fees, never instead of them." }],
        pipes: [{ kind: "power", to: 0 }, { kind: "cool", to: 0 }],
        note: "Hot water at 150–180 °C is also available at this plant." },
      B: { hostLabel: "HOST — FOOD · DAIRY · BREWERY", hostSub: "dairies · breweries · food plants",
        hostBlurb: "The park's concentrated food and dairy waste is destroyed on site instead of hauled or digested.",
        buyers: [{ name: "COLD-CHAIN PARK", sub: "freezers · cold stores", kind: "cold", x: 5.4, z: 0,
          blurb: "Over 95% of US refrigerated warehouses already run ammonia refrigeration — the heat-driven chiller slots into infrastructure that exists, and the electric compressors drop to backup duty." }],
        pipes: [{ kind: "cool", to: 0 }],
        note: "All spare heat goes to cooling here — no turbine in this scenario." },
      C: { hostLabel: "HOST — WASTE-RICH NEIGHBOR", hostSub: "sewage works · distillery · food complex",
        hostBlurb: "The neighbor supplies the strong waste — a data center's own waste water is salty, not organic, so it cannot feed the plant.",
        buyers: [{ name: "DATA-CENTER CAMPUS", sub: "buys power + chilled water", kind: "dc", x: 5.4, z: 0,
          blurb: "Cooling is 30–40% of a data center's electric bill and grid connections take 4–7 years — so it signs a 10–20-year agreement for power and chilled water from next door." }],
        pipes: [{ kind: "power", to: 0 }, { kind: "cool", to: 0 }, { kind: "waterBuy", to: 0 }],
        note: "Reclaimed water also goes to the campus for cooling-tower makeup." },
      D: { hostLabel: "HOST — ISLAND WASTE BLEND", hostSub: "sewage sludge + grease-trap + food waste",
        hostBlurb: "Island sludge is too watery on its own — grease-trap and food waste are blended in to reach the strength where spare heat exists.",
        buyers: [{ name: "RESORTS · PORT · COLD STORE", sub: "power · ice · AC · fresh water", kind: "island", x: 5.4, z: 0,
          blurb: "On an island every output prices near its global maximum: diesel power $0.30–0.52/kWh, desalinated water $2–5/m³, and ice for the fishing fleet." }],
        pipes: [{ kind: "power", to: 0 }, { kind: "cool", to: 0 }, { kind: "heat", to: 0, lt: 0.4, ly: 2.6 }],
        sea: true, note: "One plant sells water, power, and ice within a few kilometers." },
      E: { hostLabel: "HOST — SAME WASTE ALL YEAR", hostSub: "the same strong waste stream, all year",
        hostBlurb: "The waste arrives and is destroyed in every season — only the energy outlet swaps.",
        buyers: [
          { name: "SUMMER — COOLING BUYER", sub: "buildings · cold stores", kind: "cold", x: 5.4, z: -2.3,
            blurb: "Summer: spare heat drives chillers — worth about $10 per MWh of heat as avoided electricity, or $30–48 where chilled water retails." },
          { name: "WINTER — HEAT BUYER", sub: "district heating · greenhouses", kind: "heat", x: 5.4, z: 2.3,
            blurb: "Winter: the same heat is sold as hot water at $10–30 per MWh into heating networks that already buy exactly this." }],
        pipes: [{ kind: "cool", to: 0 }, { kind: "heat", to: 1, lt: 0.7, ly: 0.9 }],
        note: "Selling the heat year-round is what pays for the energy module." },
      F: { hostLabel: "HOST — BUYS THE STEAM", hostSub: "any strong waste stream at hub scale",
        hostBlurb: "The host already burns fuel to make steam — Level 1 replaces that fuel, the simplest sale on the ladder.",
        buyers: [], ladder: true,
        pipes: [{ kind: "steam", to: "host" }],
        note: "Each rung is added only after its revenue is under contract." }
    };

    var FLOW_INFO = {
      waste:  { name: "Flow — waste in", specs: "Strong enough to make spare heat: above ~35–60 g/L COD", role: "The host's concentrated waste flows into the plant here — destroying it is the core paid service in every scenario." },
      water:  { name: "Flow — distilled water", specs: "85–95% water recovery · <10 µS/cm", role: "Most of the water that carried the waste comes back distilled-quality and is stored or sold." },
      waterBuy: { name: "Flow — reclaimed water to the buyer", specs: "A 1 MW data center on evaporative cooling uses ~6.75M gallons of water a year", role: "In this scenario the recovered water is piped to the campus for cooling-tower makeup, cutting its water bill." },
      solids: { name: "Flow — inert solids", specs: "Contained, fully broken-down salts/oxides", role: "A small amount of inert solid is the only residue of destruction — an ordinary disposal task." },
      power:  { name: "Flow — electricity", specs: "1.4 MW at the 1,000 m³/day example plant", role: "A small turbine turns spare heat into electricity that the buyer takes under contract." },
      cool:   { name: "Flow — cooling", specs: "4.9 MW of cooling (≈1,392 refrigeration tons) at the example plant", role: "A heat-driven chiller turns spare heat into cold — the buyer's electric chillers drop to backup duty." },
      heat:   { name: "Flow — heat / hot water", specs: "$10–30 per MWh of heat where heating networks exist", role: "Hot water at 150–180 °C is piped to a buyer who would otherwise burn fuel to make it." },
      steam:  { name: "Flow — steam, Level 1", specs: "$10–30 per MWh of heat", role: "The first rung of the ladder: steam sold straight to the host, who already burns fuel to make it." }
    };

    /* ── DOM ── */
    var sec = document.createElement("section"); sec.className = "c3x-sec"; host.appendChild(sec);
    sec.innerHTML =
      '<p class="c3x-kicker">Chart 10 · Part A — the living site · real 3D</p>' +
      '<h3 class="c3x-title">Six ways one waste plant pays for itself — pick a scenario and watch the site run</h3>' +
      '<p class="c3x-howto">What this shows: a working site in 3D. The host (left) sends its strong waste into the HCSP plant ' +
      '(center); clean water, inert solids, and energy flow out continuously — the moving dots are the actual flows. ' +
      'Pick scenario A–F to rebuild the site; click any building or pipe for its story.</p>' +
      '<p class="c3x-srcline">Sources: ' + srcLinks(["K80", "K83", "K85", "K61", "K69"]) + "</p>";

    var tools = document.createElement("div"); tools.className = "c3x-tools"; sec.appendChild(tools);
    var pauseBtn = document.createElement("button");
    pauseBtn.type = "button"; pauseBtn.className = "c3x-btn c3x-pause";
    pauseBtn.setAttribute("aria-pressed", "true"); pauseBtn.textContent = "▶ Play";
    tools.appendChild(pauseBtn);
    var tableBtn = document.createElement("button");
    tableBtn.type = "button"; tableBtn.className = "c3x-btn";
    tableBtn.setAttribute("aria-pressed", "false"); tableBtn.textContent = "Table view";
    tools.appendChild(tableBtn);
    var orbitBtn = document.createElement("button");
    orbitBtn.type = "button"; orbitBtn.className = "c3x-btn";
    orbitBtn.setAttribute("aria-pressed", "false");
    orbitBtn.textContent = "⟳ Auto-orbit: off";
    orbitBtn.title = "Gently rotate the camera so the site's motion is easy to see — turn off to hold the view still";
    tools.appendChild(orbitBtn);
    var pickerBtns = SC.map(function (s, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "c3x-chip"; b.textContent = s.id + " · " + s.name;
      b.title = s.tag; b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () { buildScene(i); });
      tools.appendChild(b);
      return b;
    });

    var grid = document.createElement("div"); grid.className = "c3x-grid"; sec.appendChild(grid);
    var stageCol = document.createElement("div"); stageCol.className = "c3x-stage-col"; grid.appendChild(stageCol);
    var canvas = document.createElement("canvas"); canvas.className = "c3x-stage";
    canvas.setAttribute("aria-label", "Interactive 3D scene of the selected energy scenario: host site, HCSP plant, buyer buildings, and animated flows between them");
    stageCol.appendChild(canvas);
    var hint = document.createElement("p"); hint.className = "c3x-hint";
    hint.textContent = "Flows run continuously · drag to orbit · scroll to zoom · click a building or pipe";
    stageCol.appendChild(hint);
    var panel = document.createElement("aside"); panel.className = "c3x-panel";
    panel.setAttribute("aria-live", "polite"); grid.appendChild(panel);
    var tableWrap = document.createElement("div"); tableWrap.className = "c3x-table-wrap";
    tableWrap.style.display = "none"; sec.appendChild(tableWrap);
    var foot = document.createElement("p"); foot.className = "c3x-foot";
    foot.textContent = "All economics in the panel are illustrative — they come from engineering-chapter studies, not from an HCSP price list. Every scenario keeps the destruction fees as the core business; energy and water are stacked on top, never instead.";
    sec.appendChild(foot);

    /* ── three.js scene ── */
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true,
        preserveDrawingBuffer: /[?&]qa=1\b/.test(location.search) /* QA frame capture */ });
    var QA_THROTTLE = /[?&]qa=1\b/.test(location.search), lastRender = 0;
    } catch (e) {
      stageCol.innerHTML = "<p style='padding:40px;font-size:13px'>WebGL is unavailable in this browser — the 3D site cannot start.</p>";
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.HCSP_DPR_CAP || 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 2, 0.1, 200);
    camera.position.set(1.2, 8.0, 15.0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
    var sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(6, 12, 8); scene.add(sun);

    var MAT = {
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
      sea:    new THREE.MeshStandardMaterial({ color: 0x9fc2e8, roughness: 0.35, metalness: 0.1 })
    };
    var PIPE = { power: MAT.accent, cool: MAT.cool, heat: MAT.heat, steam: MAT.heat, waterBuy: MAT.waterM, waste: MAT.waste, water: MAT.waterM, solids: MAT.dark };

    var siteG = null, flows = [], clickable = [], labels = [], spinners = [];
    function clearSite() {
      if (siteG) { scene.remove(siteG); siteG = null; }
      labels.forEach(function (L) { L.el.remove(); }); labels = [];
      flows = []; clickable = []; spinners = [];
    }
    function box(g, w, h, d, mat, x, y, z) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); g.add(m); return m;
    }
    function cyl(g, r1, r2, h, mat, x, y, z, seg) {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg || 20), mat);
      m.position.set(x, y, z); g.add(m); return m;
    }
    function mark(g, key) {
      g.traverse(function (o) { if (o.isMesh) { o.userData.key = key; clickable.push(o); } });
    }
    function pipe(g, pts, r, mat, flowKey) {
      var v = pts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
      var segs = [], total = 0;
      for (var i = 0; i < v.length - 1; i++) {
        var a = v[i], b = v[i + 1], len = a.distanceTo(b);
        var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
        m.position.copy(a).lerp(b, 0.5);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        g.add(m); segs.push({ a: a, b: b, len: len }); total += len;
        if (flowKey) { m.userData.key = flowKey; clickable.push(m); }
      }
      if (flowKey) {
        var n = Math.max(1, Math.round(total / 1.7));
        var f = { segs: segs, total: total, markers: [] };
        for (var j = 0; j < n; j++) {
          var s = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10),
            new THREE.MeshBasicMaterial({ color: mat.color }));
          s.userData.t = (j + 0.5) / n;
          g.add(s); f.markers.push(s);
        }
        flows.push(f);
      }
    }
    function placeMarkers() {
      flows.forEach(function (f) {
        f.markers.forEach(function (s) {
          var d = s.userData.t * f.total;
          for (var k = 0; k < f.segs.length; k++) {
            var sg = f.segs[k];
            if (d <= sg.len) { s.position.copy(sg.a).lerp(sg.b, d / sg.len); return; }
            d -= sg.len;
          }
          var last = f.segs[f.segs.length - 1];
          s.position.copy(last.b);
        });
      });
    }
    function label(text, cls, x, y, z, dx, dy) {
      var el = document.createElement("div");
      el.className = "c3x-label" + (cls ? " " + cls : "");
      el.textContent = text;
      stageCol.appendChild(el);
      labels.push({ el: el, v: new THREE.Vector3(x, y, z), dx: dx || 0, dy: dy || 0 });
    }
    function building(g, x, z, w, h, d, trim) {
      box(g, w, h, d, MAT.bld, x, h / 2, z);
      box(g, w + 0.06, 0.12, d + 0.06, trim || MAT.roof, x, h + 0.06, z);
    }

    var cur = -1;
    function buildScene(i) {
      cur = i;
      clearSite();
      var S = SC[i], C = SCENES[S.id];
      siteG = new THREE.Group(); scene.add(siteG);
      pickerBtns.forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });

      var ground = new THREE.Mesh(new THREE.CircleGeometry(13, 56),
        new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.8 }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12;
      siteG.add(ground);
      if (C.sea) {
        var sea = new THREE.Mesh(new THREE.CircleGeometry(7, 40), MAT.sea);
        sea.rotation.x = -Math.PI / 2; sea.position.set(10.5, -0.1, 0);
        siteG.add(sea);
        label("EVERYTHING HERE IS EXPENSIVE", "c3x-lb-blue", 5.0, 0.3, 4.2);
      }

      // host site (left)
      var hostG = new THREE.Group(); siteG.add(hostG);
      building(hostG, -5.6, -1.2, 2.2, 1.7, 1.8);
      building(hostG, -5.9, 1.1, 1.6, 1.15, 1.5, MAT.bldHi);
      cyl(hostG, 0.5, 0.5, 1.9, MAT.bldHi, -4.2, 0.95, -1.5, 22);
      cyl(hostG, 0.52, 0.52, 0.1, MAT.roof, -4.2, 1.95, -1.5, 22);
      mark(hostG, "host");
      label(C.hostLabel, "c3x-lb-red", -5.0, 2.6, -0.2);
      label(C.hostSub, "c3x-lb-dim", -5.0, 2.25, -0.2);

      // HCSP unit (center)
      var hcsp = new THREE.Group(); siteG.add(hcsp);
      box(hcsp, 3.1, 0.18, 2.2, MAT.frame, 0, 0.09, 0);
      box(hcsp, 0.85, 1.05, 0.85, MAT.accent, -0.95, 0.7, 0.55);
      var comb = cyl(hcsp, 0.32, 0.32, 1.1, MAT.heat, 0.15, 0.65, 0.62); comb.rotation.z = Math.PI / 2;
      cyl(hcsp, 0.5, 0.5, 1.9, MAT.dark, 0.55, 1.15, -0.35, 26);
      var capT = new THREE.Mesh(new THREE.SphereGeometry(0.5, 26, 12, 0, Math.PI * 2, 0, Math.PI / 2), MAT.dark);
      capT.position.set(0.55, 2.1, -0.35); hcsp.add(capT);
      box(hcsp, 1.05, 0.62, 0.7, MAT.vessel, -0.7, 0.49, -0.75);
      var hub = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), MAT.heat);
      hub.position.set(1.55, 1.35, 0.15); hcsp.add(hub);
      spinners.push(hub); // the heat hub pulses — the plant is alive
      mark(hcsp, "hcsp");
      label("HCSP PLANT", "c3x-lb-blue", 0, 2.75, 0);

      // water tank + solids bin
      var water = new THREE.Group(); siteG.add(water);
      cyl(water, 0.58, 0.58, 1.1, MAT.waterM, 2.5, 0.55, -2.3, 24);
      var wcap = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), MAT.waterM);
      wcap.position.set(2.5, 1.1, -2.3); water.add(wcap);
      mark(water, "water");
      label("DISTILLED WATER", "c3x-lb-blue", 2.5, 1.4, -2.3, -110, 24);
      var solids = new THREE.Group(); siteG.add(solids);
      box(solids, 0.85, 0.7, 0.85, MAT.dark, 2.7, 0.35, -1.0);
      mark(solids, "solids");
      label("INERT SOLIDS", "c3x-lb-dim", 2.7, 1.15, -1.0);

      // waste in + water/solids out (continuous flows)
      pipe(siteG, [[-4.6, 0.7, 0.4], [-2.2, 0.7, 0.3], [-1.15, 0.75, 0.2]], 0.1, PIPE.waste, "waste");
      label("WASTE IN", "c3x-lb-red", -3.4, 1.15, 0.35);
      pipe(siteG, [[-0.2, 0.65, -0.85], [1.6, 0.6, -1.9], [2.15, 0.6, -2.25]], 0.08, PIPE.water, "water");
      pipe(siteG, [[0.35, 0.5, -0.8], [2.25, 0.45, -1.0]], 0.07, PIPE.solids, "solids");

      // buyers (right)
      C.buyers.forEach(function (B, bi) {
        var g = new THREE.Group(); siteG.add(g);
        if (B.kind === "dc") {
          box(g, 2.4, 2.3, 1.9, MAT.bld, B.x, 1.15, B.z);
          box(g, 2.46, 0.1, 1.96, MAT.roof, B.x, 2.35, B.z);
          [-0.7, 0, 0.7].forEach(function (dx) { box(g, 0.42, 0.3, 0.5, MAT.bldHi, B.x + dx, 2.55, B.z); });
        } else if (B.kind === "cold") {
          box(g, 2.6, 1.5, 2.0, MAT.bld, B.x, 0.75, B.z);
          box(g, 2.66, 0.14, 2.06, MAT.cool, B.x, 1.57, B.z);
          box(g, 0.6, 0.5, 0.6, MAT.cool, B.x - 0.8, 1.85, B.z + 0.5);
        } else if (B.kind === "heat") {
          box(g, 2.2, 1.4, 1.8, MAT.bld, B.x, 0.7, B.z);
          box(g, 2.26, 0.14, 1.86, MAT.heat, B.x, 1.47, B.z);
          cyl(g, 0.16, 0.16, 0.9, MAT.dark, B.x + 0.7, 1.9, B.z - 0.5, 14);
        } else if (B.kind === "island") {
          box(g, 1.5, 1.3, 1.4, MAT.bld, B.x - 0.8, 0.65, B.z - 0.9);
          box(g, 1.1, 0.9, 1.1, MAT.bldHi, B.x + 0.9, 0.45, B.z + 0.4);
          box(g, 1.16, 0.12, 1.16, MAT.cool, B.x + 0.9, 0.96, B.z + 0.4);
          cyl(g, 0.45, 0.45, 0.55, MAT.waterM, B.x + 0.2, 0.28, B.z + 1.3, 20);
        } else {
          box(g, 2.2, 1.6, 1.8, MAT.bld, B.x, 0.8, B.z);
          box(g, 2.26, 0.12, 1.86, MAT.roof, B.x, 1.66, B.z);
        }
        mark(g, "buyer" + bi);
        label(B.name, "c3x-lb-big", B.x, (B.kind === "dc" ? 3.05 : B.kind === "cold" ? 2.75 : B.kind === "island" ? 2.9 : 2.35), B.z);
      });

      // energy flows from the surplus-heat node
      C.pipes.forEach(function (P) {
        var from = [1.55, 1.35, 0.15];
        if (P.to === "host") {
          pipe(siteG, [from, [0.2, 1.6, 0.9], [-3.2, 1.4, 0.9], [-4.3, 1.2, 0.5]], 0.09, PIPE.steam, "steam");
          label("STEAM — LEVEL 1", "c3x-lb-amber", -1.6, 2.0, 0.9, -46, 0);
        } else {
          var B = C.buyers[P.to];
          var ty = B.kind === "dc" ? 2.5 : 1.6;
          var lane = P.kind === "power" ? -0.45 : P.kind === "cool" ? 0 : 0.45;
          var from3 = [1.55, 1.35, 0.15], to3 = [B.x - 0.6, ty, B.z + lane];
          pipe(siteG, [from3, [2.6, 1.6, B.z * 0.4 + lane], [B.x - 1.3, ty + 0.35, B.z + lane], to3],
            0.08, PIPE[P.kind], P.kind);
          var LT = { power: [0.22, 1.5], cool: [0.45, 0.75], heat: [0.80, 1.35], waterBuy: null };
          var spot = LT[P.kind] ? [P.lt != null ? P.lt : LT[P.kind][0], P.ly != null ? P.ly : LT[P.kind][1]] : null;
          if (spot) {
            var mid = [from3[0] + (to3[0] - from3[0]) * spot[0], from3[1] + (to3[1] - from3[1]) * spot[0] + spot[1],
                       from3[2] + (to3[2] - from3[2]) * spot[0]];
            var flab = P.kind === "power" ? "POWER ≈1.4 MW" : P.kind === "cool" ? "COOLING ≈4.9 MW" : "HEAT";
            label(flab, P.kind === "power" ? "c3x-lb-blue" : P.kind === "cool" ? "c3x-lb-green" : "c3x-lb-amber", mid[0], mid[1], mid[2]);
          }
        }
      });

      // scenario F — the steam ladder: four separately sellable rungs
      if (C.ladder) {
        var lad = new THREE.Group(); siteG.add(lad);
        var rungs = [
          ["L1 · STEAM SALES", MAT.heat, 0.0],
          ["L2 · + CHILLER", MAT.cool, 0.62],
          ["L3 · + TURBINE", MAT.accent, 1.24],
          ["L4 · FULL CONTRACT", MAT.dark, 1.86]
        ];
        rungs.forEach(function (rr, ri) {
          var b = box(lad, 1.7, 0.56, 1.0, MAT.bld, 4.6, rr[2] + 0.28, 0.6);
          box(lad, 1.76, 0.1, 1.06, rr[1], 4.6, rr[2] + 0.61, 0.6);
          b.userData.key = "rung" + ri; clickable.push(b);
          label(rr[0], ri === 0 ? "c3x-lb-amber" : ri === 1 ? "c3x-lb-green" : ri === 2 ? "c3x-lb-blue" : "c3x-lb-dim", 4.6, rr[2] + 0.78, 1.75);
        });
        pipe(siteG, [[1.55, 1.35, 0.15], [2.8, 1.1, 0.6], [3.6, 0.7, 0.6]], 0.09, PIPE.heat, "heat");
        [[0.62, MAT.cool], [1.24, MAT.accent], [1.86, MAT.dark]].forEach(function (yr) {
          var r = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.62, 10), yr[1]);
          r.position.set(3.6, yr[0] + 0.28, 0.6); lad.add(r);
        });
        label("THE LADDER — BUY A RUNG, NOT THE CAMPUS", "c3x-lb-big", 4.6, 2.85, 0.6);
      }

      placeMarkers();
      updatePanel(i);
      dirty = true; poke();
    }

    function updatePanel(i) {
      var S = SC[i];
      panel.innerHTML =
        '<span class="c3x-letter">' + S.id + "</span>" +
        "<h3 style='display:inline'>" + esc(S.name) + "</h3>" +
        '<p class="c3x-tag">' + esc(S.tag) + "</p>" +
        "<p>" + esc(S.card) + "</p>" +
        "<h4>Three ways the plant earns money</h4>" +
        S.earns.map(function (e) {
          return '<div class="c3x-earn"><b>' + esc(e.t) + "</b><span>" + esc(e.d) + "</span> " + srcLinks(e.src) + "</div>";
        }).join("") +
        '<h4>Illustrative economics <span class="c3x-ill">— illustrative, from engineering studies</span></h4>' +
        '<ul class="c3x-econ">' + S.econ.map(function (e) {
          return "<li>" + esc(e.lab) + ': <span class="c3x-ev">' + esc(e.val) + "</span> " + srcLinks(e.src) + "</li>";
        }).join("") + "</ul>" +
        "<h4>What the site needs first</h4>" +
        "<ul>" + S.needs.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" +
        '<div class="c3x-warn"><b>Guardrails — read first.</b> ' +
        GUARDS.map(function (g) { return "<b>" + esc(g[0]) + ":</b> " + esc(g[1]); }).join(" ") + "</div>" +
        "<p>" + srcLinks(S.src) + "</p>";
    }

    // click-to-detail on scene objects
    var info = null;
    function showInfo(key) {
      var S = SC[cur], C = SCENES[S.id], d = FLOW_INFO[key];
      if (!d) {
        if (key === "host") d = { name: "The host — where the waste is", specs: S.diagram.feed, role: C.hostBlurb };
        else if (key === "hcsp") d = { name: "The HCSP plant", specs: "Distillation + high-heat oxidation · atmospheric pressure · 85–95% water recovery · self-fueling hydrogen loop (per manufacturer)", role: "It destroys the host's waste completely and hands back distilled water, a little inert solid, and heat — the pipes leaving it are what this scenario sells." };
        else if (key === "water") d = { name: "Distilled water", specs: S.diagram.water, role: "85–95% of the water that carried the waste comes back distilled-quality — a real credit, never the main product." };
        else if (key === "solids") d = { name: "Inert solids", specs: "Contained, fully broken-down salts/oxides", role: "The small solid residue of complete destruction — contained and inert." };
        else if (/^buyer(\d)$/.test(key)) { var B = C.buyers[+key.slice(5)]; d = { name: B.name, specs: B.sub, role: B.blurb }; }
        else if (/^rung\d$/.test(key)) {
          var RR = SC[5].econ[+key.slice(4)];
          d = { name: "The steam ladder — rung " + (+key.slice(4) + 1), specs: RR.val, role: RR.lab + ". Each rung is its own price point — added only after its revenue is signed." };
        }
      }
      if (!d) return;
      // selection also routes into the side panel (single source of truth)
      panel.innerHTML = "<h3>" + esc(d.name) + "</h3>" +
        '<p class="c3x-tag">' + esc(d.specs) + "</p><p>" + esc(d.role) + "</p>" +
        '<p><button type="button" class="c3x-btn c3x-back">← Back to scenario ' + S.id + "</button></p>";
      panel.querySelector(".c3x-back").addEventListener("click", function () { updatePanel(cur); });
    }

    /* ── sortable table view (all six scenarios) ── */
    var tableBuilt = false;
    function buildTable() {
      var cols = [
        { lab: "Scenario", key: function (r) { return r.id; }, cell: function (r) { return '<span class="c3x-letter">' + r.id + "</span> <b>" + esc(r.name) + "</b>"; } },
        { lab: "In one line", key: function (r) { return r.tag; }, cell: function (r) { return esc(r.tag); } },
        { lab: "Three revenue streams", key: function (r) { return r.earns.map(function (e) { return e.t; }).join(""); },
          cell: function (r) { return r.earns.map(function (e) { return esc(e.t); }).join(" · "); } },
        { lab: "Headline economics (illustrative)", key: function (r) { return r.econ.map(function (e) { return e.val; }).join(""); },
          cell: function (r) { return r.econ.slice(0, 3).map(function (e) { return esc(e.lab) + ": <b>" + esc(e.val) + "</b>"; }).join("<br>"); } },
        { lab: "Sources", key: function (r) { return r.src.join(""); }, cell: function (r) { return srcLinks(r.src); } }
      ];
      var sortI = 0, sortDir = 1;
      var tbl = document.createElement("table"); tbl.className = "c3x-table";
      function draw() {
        var rows = SC.slice().sort(function (a, b) {
          var va = cols[sortI].key(a), vb = cols[sortI].key(b);
          return (va < vb ? -1 : va > vb ? 1 : 0) * sortDir;
        });
        tbl.innerHTML = "<thead><tr>" + cols.map(function (c, i) {
          return "<th data-i='" + i + "'>" + esc(c.lab) + (i === sortI ? (sortDir > 0 ? " ▲" : " ▼") : "") + "</th>";
        }).join("") + "</tr></thead><tbody>" + rows.map(function (r) {
          return "<tr data-id='" + r.id + "'>" + cols.map(function (c) { return "<td>" + c.cell(r) + "</td>"; }).join("") + "</tr>";
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
            var i = SC.findIndex(function (s) { return s.id === tr.dataset.id; });
            if (i >= 0) buildScene(i);
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

    /* ── controls / motion ── */
    var controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.autoRotate = false; controls.autoRotateSpeed = 1.2;
    controls.target.set(0.4, 1.1, 0);
    controls.minDistance = 5; controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI * 0.52;

    // QA hook: world→screen projection for automated click tests
    canvas._project = function (x, y, z) {
      var r = canvas.getBoundingClientRect();
      var v = new THREE.Vector3(x, y, z).project(camera);
      return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height, behind: v.z > 1 };
    };

    var REDUCED = false;
    try { REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    function stillMode() { return REDUCED || document.documentElement.classList.contains("reader"); }
    var paused = true, orbitOn = false; // owner directive: static frame on load; motion + orbit only after the visitor opts in
    function applyMotionState() {
      controls.autoRotate = orbitOn && !paused && !stillMode();
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.textContent = paused ? "▶ Resume" : "❚❚ Pause";
      dirty = true; poke();
    }
    pauseBtn.addEventListener("click", function () { paused = !paused; applyMotionState(); });
    orbitBtn.addEventListener("click", function () {
      orbitOn = !orbitOn;
      orbitBtn.setAttribute("aria-pressed", orbitOn ? "true" : "false");
      orbitBtn.textContent = "⟳ Auto-orbit: " + (orbitOn ? "on" : "off");
      applyMotionState();
    });

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
      if (hit) showInfo(hit.object.userData.key);
    });

    var dirty = true, inView = false, raf = 0, lastT = 0;
    function poke() { if (inView && !raf) raf = requestAnimationFrame(frame); }
    controls.addEventListener("change", function () { dirty = true; poke(); });
    function resize() {
      var w = stageCol.clientWidth, h = canvas.clientHeight || 540;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      dirty = true; poke();
    }
    addEventListener("resize", resize, { passive: true });

    function animate(t) {
      var dt = Math.min(0.05, (t - lastT) / 1000 || 0); lastT = t;
      flows.forEach(function (f) {
        f.markers.forEach(function (s) { s.userData.t = (s.userData.t + dt * 0.55) % 1; });
      });
      placeMarkers();
      spinners.forEach(function (s) {
        var k = 1 + Math.sin(t * 0.004) * 0.28;
        s.scale.set(k, k, k);
      });
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
      // the label CSS anchors each box at translate(-50%,-120%): the painted
      // box runs from y-1.2*hh to y-0.2*hh — model that exactly so collisions
      // are resolved against the true painted rectangles
      function topOf(it) { return it.y - 1.2 * it.hh; }
      function botOf(it) { return it.y - 0.2 * it.hh; }
      function hits(a, b) {
        return (Math.min(a.x + a.hw, b.x + b.hw) - Math.max(a.x - a.hw, b.x - b.hw) > 2) &&
               (Math.min(botOf(a), botOf(b)) - Math.max(topOf(a), topOf(b)) > 2);
      }
      items.sort(function (a, b) { return a.y - b.y; });
      // clamp every label into the stage first (true box bounds)
      items.forEach(function (it) {
        it.y = Math.max(2 + 1.2 * it.hh, Math.min(h - 2 - 0.2 * it.hh, it.y));
      });
      // iterate: push the lower label below the collision; if the stage floor
      // blocks that, push the upper label above it instead — repeat until no
      // two labels collide (bounded passes; converges for these small sets)
      for (var iter = 0; iter < 60; iter++) {
        var moved = false;
        for (var i = 1; i < items.length; i++) {
          for (var j = 0; j < i; j++) {
            if (!hits(items[i], items[j])) continue;
            var downY = botOf(items[j]) + 4 + 1.2 * items[i].hh; // i's top just below j's bottom
            if (downY - 0.2 * items[i].hh <= h - 2) {
              items[i].y = downY;
            } else {
              // j's bottom just above i's top
              items[j].y = Math.max(2 + 1.2 * items[j].hh, topOf(items[i]) - 4 + 0.2 * items[j].hh);
            }
            moved = true;
          }
        }
        if (!moved) break;
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
    io.observe(sec);

    buildScene(0);
    resize();
    applyMotionState();
    // re-render once webfonts settle: label metrics change, and a paused scene
    // would otherwise freeze first-paint label positions
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { dirty = true; poke(); });
  }

  /* ════════════════════════ PART B — MATERIALS SEPARATION (EXPLODED 3D) ════════════════════════ */
  function renderMaterials(host) {
    var MR = RPT.materials_recovery;
    if (!MR || !MR.rows || !MR.rows.length) return;

    var CHIP_COLORS = [0xb57a00, 0x2251ff, 0x0d8a5f, 0x8a99a8, 0xb07a10, 0x5aa9e6];
    var CHIP_CLS = ["c3x-lb-amber", "c3x-lb-blue", "c3x-lb-green", "c3x-lb-dim", "c3x-lb-amber", "c3x-lb-blue"];

    var sec = document.createElement("section"); sec.className = "c3x-sec"; host.appendChild(sec);
    sec.innerHTML =
      '<p class="c3x-kicker">Chart 10 · Part B — materials separation · real 3D</p>' +
      '<h3 class="c3x-title">The future second business: pulling valuable materials out of the waste before it is destroyed</h3>' +
      '<p class="c3x-howto">What this shows: the waste stream (red pipe, left) enters a separator; six valuable substances ' +
      'lift out as labeled chips — potash, lithium, nitrogen &amp; phosphorus, industrial salts, specialty metals, silica — each with a buyer. ' +
      'Click a chip for how it would be recovered, who buys it, and the honest caveats.</p>' +
      '<p class="c3x-srcline">Sources: ' + srcLinks(["K203", "K204", "K205", "K206"]) + "</p>";

    var status = document.createElement("div");
    status.innerHTML = '<span class="c3x-status">' + esc(MR.status) + "</span>";
    sec.appendChild(status);
    var intro = document.createElement("p"); intro.className = "c3x-howto";
    intro.textContent = MR.intro;
    sec.appendChild(intro);

    var tools = document.createElement("div"); tools.className = "c3x-tools"; sec.appendChild(tools);
    var pauseBtn = document.createElement("button");
    pauseBtn.type = "button"; pauseBtn.className = "c3x-btn c3x-pause";
    pauseBtn.setAttribute("aria-pressed", "true"); pauseBtn.textContent = "▶ Play";
    tools.appendChild(pauseBtn);
    var tableBtn = document.createElement("button");
    tableBtn.type = "button"; tableBtn.className = "c3x-btn";
    tableBtn.setAttribute("aria-pressed", "false"); tableBtn.textContent = "Table view";
    tools.appendChild(tableBtn);
    var orbitBtn = document.createElement("button");
    orbitBtn.type = "button"; orbitBtn.className = "c3x-btn";
    orbitBtn.setAttribute("aria-pressed", "false");
    orbitBtn.textContent = "⟳ Auto-orbit: off";
    orbitBtn.title = "Gently rotate the camera so the motion is easy to see — turn off to hold the view still";
    tools.appendChild(orbitBtn);

    var grid = document.createElement("div"); grid.className = "c3x-grid"; sec.appendChild(grid);
    var stageCol = document.createElement("div"); stageCol.className = "c3x-stage-col"; grid.appendChild(stageCol);
    var canvas = document.createElement("canvas"); canvas.className = "c3x-stage";
    canvas.setAttribute("aria-label", "Interactive 3D exploded view: waste enters a separator vessel and six labeled material chips lift out above it");
    stageCol.appendChild(canvas);
    var hint = document.createElement("p"); hint.className = "c3x-hint";
    hint.textContent = "Chips float and bob · drag to orbit · scroll to zoom · click a chip";
    stageCol.appendChild(hint);
    var panel = document.createElement("aside"); panel.className = "c3x-panel";
    panel.setAttribute("aria-live", "polite"); grid.appendChild(panel);
    var tableWrap = document.createElement("div"); tableWrap.className = "c3x-table-wrap";
    tableWrap.style.display = "none"; sec.appendChild(tableWrap);
    var foot = document.createElement("p"); foot.className = "c3x-foot";
    foot.textContent = MR.rule;
    sec.appendChild(foot);

    /* ── three.js scene ── */
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true,
        preserveDrawingBuffer: /[?&]qa=1\b/.test(location.search) /* QA frame capture */ });
    var QA_THROTTLE = /[?&]qa=1\b/.test(location.search), lastRender = 0;
    } catch (e) {
      stageCol.innerHTML = "<p style='padding:40px;font-size:13px'>WebGL is unavailable in this browser — the 3D separation view cannot start.</p>";
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.HCSP_DPR_CAP || 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 2, 0.1, 200);
    camera.position.set(0.5, 6.2, 17.5);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
    var sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(6, 12, 8); scene.add(sun);

    var MAT = {
      waste:  new THREE.MeshStandardMaterial({ color: 0xc22f4e, roughness: 0.55, metalness: 0.2 }),
      water:  new THREE.MeshStandardMaterial({ color: 0x7d9bff, roughness: 0.3, metalness: 0.3 }),
      dark:   new THREE.MeshStandardMaterial({ color: 0x42566a, roughness: 0.45, metalness: 0.5 }),
      vessel: new THREE.MeshStandardMaterial({ color: 0xc9d5e1, roughness: 0.35, metalness: 0.55 }),
      glass:  new THREE.MeshStandardMaterial({ color: 0x9fc2e8, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.32 }),
      line:   new THREE.LineBasicMaterial({ color: 0x8a99a8, transparent: true, opacity: 0.7 })
    };

    var group = new THREE.Group(); scene.add(group);
    var ground = new THREE.Mesh(new THREE.CircleGeometry(15, 56),
      new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.8 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12; group.add(ground);
    var gridH = new THREE.GridHelper(30, 15, 0xd8dfe9, 0xe8edf4);
    gridH.position.y = -0.11; group.add(gridH);

    var clickable = [], labels = [], flows = [], chips = [], swirls = [];

    // waste feed pipe (left → separator)
    function pipe(g, pts, r, mat, flowKey, clickableKey) {
      var v = pts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
      var segs = [], total = 0;
      for (var i = 0; i < v.length - 1; i++) {
        var a = v[i], b = v[i + 1], len = a.distanceTo(b);
        var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
        m.position.copy(a).lerp(b, 0.5);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        g.add(m); segs.push({ a: a, b: b, len: len }); total += len;
        if (clickableKey) { m.userData.key = clickableKey; clickable.push(m); }
      }
      if (flowKey) {
        var n = Math.max(1, Math.round(total / 1.7));
        var f = { segs: segs, total: total, markers: [] };
        for (var j = 0; j < n; j++) {
          var s = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10),
            new THREE.MeshBasicMaterial({ color: mat.color }));
          s.userData.t = (j + 0.5) / n;
          g.add(s); f.markers.push(s);
        }
        flows.push(f);
      }
      return { segs: segs, total: total };
    }

    // feed stock tank + waste pipe in
    var tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.4, 24), MAT.waste);
    tank.position.set(-7.2, 1.2, 0); group.add(tank);
    tank.userData.key = "feed"; clickable.push(tank);
    label("WASTE STREAM IN", "c3x-lb-red", -7.2, 2.75, 0);
    label("the feed decides what can be recovered", "c3x-lb-dim", -7.2, 2.35, 0);
    pipe(group, [[-6.1, 1.3, 0], [-3.4, 1.3, 0], [-1.15, 1.5, 0]], 0.14, MAT.waste, true, "feedPipe");

    // separator vessel (center) — transparent so the rising swirl shows
    var sep = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.45, 3.4, 28), MAT.glass);
    sep.position.set(0, 1.7, 0); group.add(sep);
    var sepCap = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.28, 0.22, 28), MAT.vessel);
    sepCap.position.set(0, 3.5, 0); group.add(sepCap);
    var sepBase = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.7, 0.3, 28), MAT.vessel);
    sepBase.position.set(0, 0.15, 0); group.add(sepBase);
    [sep, sepCap, sepBase].forEach(function (m) { m.userData.key = "sep"; clickable.push(m); });
    label("SEPARATOR (roadmap)", "c3x-lb-big", 0, 4.1, 0);
    label("distillation · crystallization · selective precipitation", "c3x-lb-dim", 0, 3.72, 0);

    // swirling particles rising inside the separator
    for (var sw = 0; sw < 14; sw++) {
      var p = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0xc22f4e }));
      p.userData = { t: sw / 14, a: sw * 2.4 };
      group.add(p); swirls.push(p);
    }

    // clean water out (right, low) + inert residue bin
    pipe(group, [[1.15, 0.9, 0.4], [3.6, 0.8, 1.6], [5.6, 0.8, 2.1]], 0.12, MAT.water, true, "waterPipe");
    var wtank = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 1.7, 24), MAT.water);
    wtank.position.set(6.7, 0.85, 2.3); group.add(wtank);
    wtank.userData.key = "waterOut"; clickable.push(wtank);
    label("CLEAN WATER OUT", "c3x-lb-blue", 6.7, 1.95, 2.3);
    var bin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 1.1), MAT.dark);
    bin.position.set(5.6, 0.4, -1.6); group.add(bin);
    bin.userData.key = "residue"; clickable.push(bin);
    pipe(group, [[1.1, 0.6, -0.4], [3.4, 0.5, -1.3], [5.0, 0.5, -1.6]], 0.1, MAT.dark, true, "residuePipe");
    label("WHAT CANNOT BE SOLD → ORDINARY DISPOSAL", "c3x-lb-dim", 5.6, 1.15, -1.6);

    // ── the six chips, exploded in an arc above the separator ──
    var R_TOP = new THREE.Vector3(0, 3.6, 0);
    var N = MR.rows.length;
    MR.rows.forEach(function (row, i) {
      var ang = (-105 + i * (210 / (N - 1))) * Math.PI / 180; // fan left→right
      var rad = 6.4;
      var cx = Math.sin(ang) * rad;
      var cz = Math.cos(ang) * rad * 0.42; // pull the arc toward the camera plane
      var cy = 5.6 + (i % 2) * 1.15;       // stagger two heights to keep labels apart
      var col = CHIP_COLORS[i % CHIP_COLORS.length];
      var chip = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.5),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.45, metalness: 0.15, transparent: true, opacity: 0.92 }));
      chip.position.set(cx, cy, cz);
      chip.userData.key = "chip" + i;
      group.add(chip); clickable.push(chip);
      chip.add(new THREE.LineSegments(new THREE.EdgesGeometry(chip.geometry),
        new THREE.LineBasicMaterial({ color: col })));
      chips.push({ mesh: chip, baseY: cy, phase: i * 1.1 });

      // connector line from the separator cap to the chip (the "lift-out" path)
      var lg = new THREE.BufferGeometry().setFromPoints([R_TOP, new THREE.Vector3(cx, cy - 0.5, cz)]);
      group.add(new THREE.Line(lg, MAT.line));
      // rising particles along the connector — the substance lifting out
      var lift = { segs: [{ a: R_TOP.clone(), b: new THREE.Vector3(cx, cy - 0.5, cz), len: R_TOP.distanceTo(new THREE.Vector3(cx, cy - 0.5, cz)) }], markers: [] };
      lift.total = lift.segs[0].len;
      for (var k = 0; k < 2; k++) {
        var mk = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 8), new THREE.MeshBasicMaterial({ color: col }));
        mk.userData.t = k / 2;
        group.add(mk); lift.markers.push(mk);
      }
      flows.push(lift);

      var short = row.sub.split(" — ")[0];
      label(short, CHIP_CLS[i % CHIP_CLS.length], cx, cy + 0.75, cz);
      label("buyer: " + row.buyer.split(":")[0].split(",")[0], "c3x-lb-dim", cx, cy - 0.62, cz);
    });
    label("ROADMAP — NOT A SHIPPING FEATURE", "c3x-lb-red", 0, 7.6, 0);

    // place flow markers + feed swirl once so the paused first frame is fully
    // assembled (animate() owns their motion once the visitor presses Play)
    placeMarkers();
    swirls.forEach(function (p) {
      var u = p.userData;
      var rr = 0.9 * (1 - u.t * 0.45);
      p.position.set(Math.sin(u.a + u.t * 9) * rr, 0.5 + u.t * 2.7, Math.cos(u.a + u.t * 9) * rr);
    });

    function label(text, cls, x, y, z, dx, dy) {
      var el = document.createElement("div");
      el.className = "c3x-label" + (cls ? " " + cls : "");
      el.textContent = text;
      stageCol.appendChild(el);
      labels.push({ el: el, v: new THREE.Vector3(x, y, z), dx: dx || 0, dy: dy || 0 });
    }
    function placeMarkers() {
      flows.forEach(function (f) {
        f.markers.forEach(function (s) {
          var d = s.userData.t * f.total;
          for (var k = 0; k < f.segs.length; k++) {
            var sg = f.segs[k];
            if (d <= sg.len) { s.position.copy(sg.a).lerp(sg.b, d / sg.len); return; }
            d -= sg.len;
          }
          s.position.copy(f.segs[f.segs.length - 1].b);
        });
      });
    }

    /* ── detail panel ── */
    var SCENE_INFO = {
      feed: { name: "The waste stream", specs: "The feed decides what can be recovered", role: "Recovery only pays when you know exactly what is in the feed — a mixed mystery sludge is worth nothing as a product." },
      feedPipe: { name: "Flow — waste in", specs: "Continuous feed into the separator", role: "The same stream the HCSP destroys today; future versions would divert the valuable fraction before or after destruction." },
      sep: { name: "The separator — roadmap equipment", specs: MR.status, role: "Distillation, crystallization, and selective precipitation steps that pull valuable substances out of the stream. This is the manufacturer's roadmap and research direction — not a shipping feature." },
      waterPipe: { name: "Flow — clean water out", specs: "85–95% water recovery to distillate (HCSP spec)", role: "The main product today, unchanged: most of the water that carried the waste comes back distilled-quality." },
      waterOut: { name: "Clean water tank", specs: "Distilled-quality output", role: "Today's reliable credit — the material chips above are the future upside." },
      residuePipe: { name: "Flow — unsellable residue", specs: "Standard disposal", role: "Whatever cannot be proven pure enough to sell goes to ordinary disposal — nobody writes a check for generic 'sludge'." },
      residue: { name: "Residue bin", specs: "Contained, inert solids", role: "The honest fallback for every stream that fails the purity test or the market test." }
    };
    function overviewPanel() {
      panel.innerHTML =
        "<h3>Materials recovery — the honest version</h3>" +
        '<span class="c3x-status">' + esc(MR.status) + "</span>" +
        "<p>" + esc(MR.intro) + "</p>" +
        '<div class="c3x-warn"><b>The honest rule.</b> ' + esc(MR.rule) + "</div>" +
        "<p>Click a chip for its source stream, recovery path, buyer, and caveats.</p>" +
        "<p>" + srcLinks(["K203", "K204", "K205", "K206"]) + "</p>";
    }
    function showChip(i) {
      var row = MR.rows[i];
      chips.forEach(function (c, j) { c.mesh.material.opacity = j === i ? 1.0 : 0.35; });
      panel.innerHTML =
        "<h3>" + esc(row.sub) + "</h3>" +
        '<span class="c3x-status">Roadmap — purity test needed before any sale</span>' +
        "<h4>Where it comes from</h4><p>" + esc(row.source) + "</p>" +
        "<h4>How it would be recovered</h4><p>" + esc(row.path) + "</p>" +
        "<h4>Who buys it</h4><p>" + esc(row.buyer) + "</p>" +
        "<h4>The honest note</h4><p>" + esc(row.note) + "</p>" +
        "<h4>Sources</h4><p>" + srcLinks(row.src) + "</p>" +
        '<p><button type="button" class="c3x-btn c3x-back">← All materials</button></p>';
      panel.querySelector(".c3x-back").addEventListener("click", function () {
        chips.forEach(function (c) { c.mesh.material.opacity = 0.92; });
        overviewPanel();
      });
      dirty = true; poke();
    }
    function showScene(key) {
      var d = SCENE_INFO[key];
      if (!d) return;
      panel.innerHTML = "<h3>" + esc(d.name) + "</h3>" +
        '<p class="c3x-tag">' + esc(d.specs) + "</p><p>" + esc(d.role) + "</p>" +
        '<p><button type="button" class="c3x-btn c3x-back">← All materials</button></p>';
      panel.querySelector(".c3x-back").addEventListener("click", overviewPanel);
    }

    /* ── sortable table view ── */
    var tableBuilt = false;
    function buildTable() {
      var cols = [
        { lab: "Substance", key: function (r) { return r.sub; }, cell: function (r) { return "<b>" + esc(r.sub) + "</b>"; } },
        { lab: "Source stream", key: function (r) { return r.source; }, cell: function (r) { return esc(r.source); } },
        { lab: "Recovery path", key: function (r) { return r.path; }, cell: function (r) { return esc(r.path); } },
        { lab: "Buyer", key: function (r) { return r.buyer; }, cell: function (r) { return esc(r.buyer); } },
        { lab: "Honest note", key: function (r) { return r.note; }, cell: function (r) { return esc(r.note); } },
        { lab: "Sources", key: function (r) { return r.src.join(""); }, cell: function (r) { return srcLinks(r.src); } }
      ];
      var sortI = 0, sortDir = 1;
      var tbl = document.createElement("table"); tbl.className = "c3x-table";
      function draw() {
        var rows = MR.rows.slice().sort(function (a, b) {
          var va = cols[sortI].key(a), vb = cols[sortI].key(b);
          return (va < vb ? -1 : va > vb ? 1 : 0) * sortDir;
        });
        tbl.innerHTML = "<thead><tr>" + cols.map(function (c, i) {
          return "<th data-i='" + i + "'>" + esc(c.lab) + (i === sortI ? (sortDir > 0 ? " ▲" : " ▼") : "") + "</th>";
        }).join("") + "</tr></thead><tbody>" + rows.map(function (r) {
          return "<tr data-sub='" + esc(r.sub) + "'>" + cols.map(function (c) { return "<td>" + c.cell(r) + "</td>"; }).join("") + "</tr>";
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
            var i = MR.rows.findIndex(function (r) { return r.sub === tr.dataset.sub; });
            if (i >= 0) showChip(i);
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

    /* ── controls / motion ── */
    var controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.autoRotate = false; controls.autoRotateSpeed = 1.0;
    controls.target.set(0, 3.4, 0);
    controls.minDistance = 6; controls.maxDistance = 34;
    controls.maxPolarAngle = Math.PI * 0.55;

    // QA hook: world→screen projection for automated click tests
    canvas._project = function (x, y, z) {
      var r = canvas.getBoundingClientRect();
      var v = new THREE.Vector3(x, y, z).project(camera);
      return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height, behind: v.z > 1 };
    };

    var REDUCED = false;
    try { REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    function stillMode() { return REDUCED || document.documentElement.classList.contains("reader"); }
    var paused = true, orbitOn = false; // owner directive: static frame on load; motion + orbit only after the visitor opts in
    function applyMotionState() {
      controls.autoRotate = orbitOn && !paused && !stillMode();
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.textContent = paused ? "▶ Resume" : "❚❚ Pause";
      dirty = true; poke();
    }
    pauseBtn.addEventListener("click", function () { paused = !paused; applyMotionState(); });
    orbitBtn.addEventListener("click", function () {
      orbitOn = !orbitOn;
      orbitBtn.setAttribute("aria-pressed", orbitOn ? "true" : "false");
      orbitBtn.textContent = "⟳ Auto-orbit: " + (orbitOn ? "on" : "off");
      applyMotionState();
    });

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
      if (hit) {
        var key = hit.object.userData.key;
        if (/^chip\d$/.test(key)) showChip(+key.slice(4));
        else showScene(key);
      }
    });

    var dirty = true, inView = false, raf = 0, lastT = 0;
    function poke() { if (inView && !raf) raf = requestAnimationFrame(frame); }
    controls.addEventListener("change", function () { dirty = true; poke(); });
    function resize() {
      var w = stageCol.clientWidth, h = canvas.clientHeight || 540;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      dirty = true; poke();
    }
    addEventListener("resize", resize, { passive: true });

    function animate(t) {
      var dt = Math.min(0.05, (t - lastT) / 1000 || 0); lastT = t;
      // particles along all pipes and lift-out paths
      flows.forEach(function (f) {
        f.markers.forEach(function (s) { s.userData.t = (s.userData.t + dt * 0.45) % 1; });
      });
      placeMarkers();
      // swirling red feed rising inside the separator
      swirls.forEach(function (p) {
        var u = p.userData;
        u.t = (u.t + dt * 0.34) % 1;
        var rr = 0.9 * (1 - u.t * 0.45);
        p.position.set(Math.sin(u.a + u.t * 9) * rr, 0.5 + u.t * 2.7, Math.cos(u.a + u.t * 9) * rr);
      });
      // chips bob gently
      chips.forEach(function (c) {
        c.mesh.position.y = c.baseY + Math.sin(t * 0.0016 + c.phase) * 0.3;
        c.mesh.rotation.y = Math.sin(t * 0.0009 + c.phase) * 0.35;
      });
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
      // the label CSS anchors each box at translate(-50%,-120%): the painted
      // box runs from y-1.2*hh to y-0.2*hh — model that exactly so collisions
      // are resolved against the true painted rectangles
      function topOf(it) { return it.y - 1.2 * it.hh; }
      function botOf(it) { return it.y - 0.2 * it.hh; }
      function hits(a, b) {
        return (Math.min(a.x + a.hw, b.x + b.hw) - Math.max(a.x - a.hw, b.x - b.hw) > 2) &&
               (Math.min(botOf(a), botOf(b)) - Math.max(topOf(a), topOf(b)) > 2);
      }
      items.sort(function (a, b) { return a.y - b.y; });
      // clamp every label into the stage first (true box bounds)
      items.forEach(function (it) {
        it.y = Math.max(2 + 1.2 * it.hh, Math.min(h - 2 - 0.2 * it.hh, it.y));
      });
      // iterate: push the lower label below the collision; if the stage floor
      // blocks that, push the upper label above it instead — repeat until no
      // two labels collide (bounded passes; converges for these small sets)
      for (var iter = 0; iter < 60; iter++) {
        var moved = false;
        for (var i = 1; i < items.length; i++) {
          for (var j = 0; j < i; j++) {
            if (!hits(items[i], items[j])) continue;
            var downY = botOf(items[j]) + 4 + 1.2 * items[i].hh; // i's top just below j's bottom
            if (downY - 0.2 * items[i].hh <= h - 2) {
              items[i].y = downY;
            } else {
              // j's bottom just above i's top
              items[j].y = Math.max(2 + 1.2 * items[j].hh, topOf(items[i]) - 4 + 0.2 * items[j].hh);
            }
            moved = true;
          }
        }
        if (!moved) break;
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
    io.observe(sec);

    overviewPanel();
    resize();
    applyMotionState();
    // re-render once webfonts settle: label metrics change, and a paused scene
    // would otherwise freeze first-paint label positions
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { dirty = true; poke(); });
  }

  /* ── module entry ── */
  function render(hostEl) {
    if (!hostEl) return;
    if (!window.THREE || !window.RPT) {
      hostEl.innerHTML = "<p style='padding:24px;font-size:13px'>3D scenarios unavailable — Three.js or report data not loaded.</p>";
      return;
    }
    if (!document.getElementById("c3x-style")) {
      var st = document.createElement("style"); st.id = "c3x-style"; st.textContent = CSS;
      document.head.appendChild(st);
    }
    var root = document.createElement("div"); root.className = "c3x-root";
    hostEl.appendChild(root);
    renderSite(root);
    renderMaterials(root);
  }

  window.C3Scenarios = { render: render };
})();
