// ═══ Chart 5 — "The scale ladder" — size comparison with a 3D / explorer toggle ═══
// RPT.scale_ladder — four plant sizes (10 / 100 / 1,000 / 1,900 m³/day).
// TWO views, chosen by a radio toggle at the top (remembered via sessionStorage):
//   · "Scale explorer" (DEFAULT — DOM only, no 3D engine, cannot hang):
//     interactive size cards with capacity, energy range, best-fit industries
//     and the scale-up caution.
//   · "3D scene" (light Three.js): each plant size drawn next to the real-world
//     object it matches in footprint — small building / warehouse / utility
//     block / regional facility. Few meshes, no particle systems, pixel ratio
//     capped at 1.5, auto-orbit OFF by default. Click a facility for detail.
// A sortable data table is always available as a text alternative.
// Honors Lite Mode / Reading Mode (html.reader) and prefers-reduced-motion:
// the 3D scene renders one static assembled frame (no auto-motion).
// Self-contained IIFE: exposes window.ScaleExplorer.render(hostEl) and keeps
// window.C3Scale as an alias for older harnesses. Injects its own CSS.
// Integration: js/data.js + js/sources.js must load first; vendor/three.min.js
// + vendor/OrbitControls.js are needed only for the 3D view; host is an empty
// element (e.g. #host-scale-3d). Dispatches "hcsp:scene-active" when its 3D
// view opens so the page can pause the previously running scene
// (one-active-3D-scene rule), and exposes root.c3 = { pause } for the same.
(function () {
  "use strict";

  /* ── injected styles (namespaced .c3s-*, shared with the other c3 modules) ── */
  var CSS = `
.c3s-root{--ink:#10222f;--ink-md:#42566a;--ink-lo:#6b7f92;--line:#dbe2ea;--bg:#fff;--bg-soft:#f5f7fa;
--blue:#2251ff;--green:#0d8a5f;--red:#c22f4e;--amber:#b57a00;
--mono:"SFMono-Regular",ui-monospace,"Roboto Mono",Menlo,Consolas,monospace;
font-family:"Helvetica Neue",Arial,"Segoe UI",sans-serif;color:var(--ink);max-width:1180px;margin:0 auto;container-type:inline-size}
.c3s-sec{background:var(--bg);border:1px solid var(--line);border-radius:8px;margin:0 0 28px;padding:18px 20px 16px;box-sizing:border-box}
.c3s-kicker{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-lo);margin:0 0 4px}
.c3s-title{font-size:19px;line-height:1.3;font-weight:700;margin:0 0 6px}
.c3s-howto{font-size:13px;line-height:1.5;color:var(--ink-md);margin:0 0 6px;max-width:72ch}
.c3s-srcline{font-family:var(--mono);font-size:10.5px;line-height:1.6;color:var(--ink-lo);margin:0 0 8px;word-wrap:break-word}
.c3s-k{display:inline-block;border:1px solid var(--line);border-radius:3px;padding:0 4px;margin:0 2px 2px 0;background:var(--bg-soft);white-space:nowrap}
a.c3s-k{background:#eef2ff;border-color:#c8d4ff;color:var(--blue);text-decoration:none}
a.c3s-k:hover{text-decoration:underline}
.c3s-tools{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px;align-items:center}
.c3s-btn{font-family:var(--mono);font-size:12px;padding:5px 12px;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--ink-md);cursor:pointer}
.c3s-btn:hover{border-color:var(--blue);color:var(--blue)}
.c3s-btn[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.c3s-btn.c3s-pause{border-color:var(--amber);color:var(--amber);min-width:92px}
.c3s-btn.c3s-pause[aria-pressed="true"]{background:var(--amber);border-color:var(--amber);color:#fff}
.c3s-chip{font-size:12px;padding:5px 10px;border:1px solid var(--line);border-radius:14px;background:var(--bg-soft);color:var(--ink-md);cursor:pointer}
.c3s-chip[aria-pressed="true"]{background:#eef2ff;border-color:var(--blue);color:var(--blue);font-weight:600}
.c3s-viewtoggle{display:flex;flex-wrap:wrap;gap:0;margin:0 0 12px;border:1px solid var(--line);border-radius:8px;overflow:hidden;width:max-content;max-width:100%}
.c3s-viewtoggle label{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:12px;padding:7px 14px;background:#fff;color:var(--ink-md);cursor:pointer;border-right:1px solid var(--line);margin:0}
.c3s-viewtoggle label:last-child{border-right:0}
.c3s-viewtoggle label:hover{color:var(--blue)}
.c3s-viewtoggle label.c3s-vt-on{background:var(--blue);color:#fff;font-weight:600}
.c3s-viewtoggle input{accent-color:var(--blue);margin:0}
.c3s-viewtoggle label.c3s-vt-on input{accent-color:#fff}
.c3s-vt-note{font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--ink-lo);text-transform:uppercase;margin:-6px 0 12px}
.c3s-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0 0 12px}
.c3s-card{border:1px solid var(--line);border-radius:8px;background:var(--bg-soft);padding:14px 14px 12px;cursor:pointer;text-align:left;font:inherit;color:inherit;display:block;width:100%}
.c3s-card:hover{border-color:var(--blue)}
.c3s-card[aria-pressed="true"]{border-color:var(--blue);background:#eef2ff;box-shadow:0 0 0 1px var(--blue)}
.c3s-card-k{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-lo);margin:0 0 4px}
.c3s-card-cap{font-size:26px;font-weight:700;color:var(--ink);margin:0 0 2px;line-height:1.1}
.c3s-card-cap span{font-size:12px;font-weight:400;color:var(--ink-md)}
.c3s-card-bar{height:8px;border-radius:4px;background:#e4eaf1;margin:8px 0 6px;overflow:hidden}
.c3s-card-bar i{display:block;height:100%;background:linear-gradient(90deg,#7f9bff,#2251ff);border-radius:4px}
.c3s-card-ref{font-size:12px;color:var(--ink-md);margin:0 0 8px;line-height:1.45}
.c3s-card-e{display:inline-block;font-family:var(--mono);font-size:12px;font-weight:700;border:1px solid #c8d4ff;background:#eef2ff;color:var(--blue);border-radius:4px;padding:2px 7px;margin:0 0 8px}
.c3s-card-fit{font-size:12.5px;color:var(--ink-md);line-height:1.5;margin:0 0 8px}
.c3s-card-study{display:inline-block;font-size:11px;font-weight:700;border:1px solid #f2c7d0;color:var(--red);border-radius:4px;padding:2px 7px;margin:0 0 8px;background:#fdf3f5}
.c3s-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:14px}
.c3s-stage-col{position:relative;min-height:560px}
.c3s-stage{width:100%;height:560px;display:block;border:1px solid var(--line);border-radius:8px;background:linear-gradient(#fbfcfe,#eef2f7);cursor:grab;touch-action:none}
.c3s-stage:active{cursor:grabbing}
.c3s-hint{font-family:var(--mono);font-size:10px;letter-spacing:.12em;color:var(--ink-lo);margin:6px 2px 0;text-transform:uppercase}
.c3s-label{position:absolute;left:-999px;top:-999px;transform:translate(-50%,-120%);font-size:12px;font-weight:600;color:var(--ink-md);
background:rgba(255,255,255,.92);border:1px solid var(--line);border-radius:4px;padding:2px 7px;white-space:nowrap;pointer-events:none;box-shadow:0 1px 3px rgba(16,34,47,.08)}
.c3s-label.c3s-lb-big{font-size:13px;font-weight:700;color:var(--ink)}
.c3s-label.c3s-lb-blue{color:var(--blue);border-color:#c8d4ff;background:rgba(238,242,255,.94)}
.c3s-label.c3s-lb-red{color:var(--red);border-color:#f2c7d0;background:rgba(255,255,255,.94)}
.c3s-label.c3s-lb-dim{font-weight:400;color:var(--ink-lo)}
.c3s-panel{border:1px solid var(--line);border-radius:8px;background:var(--bg-soft);padding:14px 16px;font-size:13px;line-height:1.55;color:var(--ink-md);overflow-y:auto;max-height:560px}
.c3s-panel h3{font-size:16px;margin:0 0 4px;color:var(--ink)}
.c3s-panel h4{font-size:12px;font-family:var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-lo);margin:14px 0 4px}
.c3s-panel p{margin:0 0 8px}
.c3s-panel ul{margin:0 0 8px;padding-left:18px}
.c3s-stat{display:inline-block;font-family:var(--mono);font-size:12px;border:1px solid var(--line);border-radius:4px;padding:2px 7px;margin:0 4px 6px 0;background:#fff;color:var(--ink)}
.c3s-tag-tbd{display:inline-block;font-size:11px;font-weight:700;border:1px dashed var(--amber);color:var(--amber);border-radius:4px;padding:2px 7px;margin:0 4px 6px 0;background:#fffaf0}
.c3s-warn{border-left:3px solid var(--red);background:#fdf3f5;padding:7px 10px;border-radius:0 6px 6px 0;margin:8px 0}
.c3s-table-wrap{margin-top:12px;overflow-x:auto}
.c3s-table{border-collapse:collapse;width:100%;font-size:12.5px}
.c3s-table th{font-family:var(--mono);font-size:11px;letter-spacing:.05em;text-align:left;color:var(--ink-lo);border-bottom:2px solid var(--line);padding:6px 8px;cursor:pointer;user-select:none;white-space:nowrap}
.c3s-table th:hover{color:var(--blue)}
.c3s-table td{border-bottom:1px solid #eef1f6;padding:6px 8px;vertical-align:top;color:var(--ink-md)}
.c3s-table tr:hover td{background:#f7f9fc}
.c3s-table td.c3s-num{font-family:var(--mono);text-align:right}
.c3s-foot{font-size:11.5px;color:var(--ink-lo);margin:10px 0 0;line-height:1.5}
@media (max-width:980px){.c3s-grid{grid-template-columns:1fr}.c3s-panel{max-height:none}.c3s-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* narrow host column (the main site's dashboard rail narrows the page):
   stack stage above panel so the 3D stage keeps a usable width */
@container (max-width:820px){.c3s-grid{grid-template-columns:1fr}.c3s-panel{max-height:none}}
@media (max-width:640px){.c3s-cards{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.c3s-root *{animation:none!important;transition:none!important}}
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
      if (!s) return '<span class="c3s-k">' + esc(k) + "</span>";
      var lab = esc(k) + (s.date ? " · " + esc(s.date) : "");
      var title = esc(s.cite || "") + (s.fact ? " — " + esc(s.fact) : "");
      if (s.url) return '<a class="c3s-k" href="' + esc(s.url) + '" target="_blank" rel="noopener" title="' + title + '">' + lab + "</a>";
      return '<span class="c3s-k" title="' + title + '">' + lab + "</span>";
    }).join(" ");
  }

  // qualitative best-fit summary derived from each rung's note + scale_meta
  // (same mapping the 2D energy module uses)
  var SCALE_FIT = {
    10:   "Pilot and demonstration sites; small concentrate generators (the AirSCWO 6 field unit is this class).",
    100:  "Industrial hubs and biosolids (sewage sludge) — the rung where the technology enters treatment-market price territory.",
    1000: "Plant-scale, self-fueling sites where a vapor power cycle pays: refinery residuals, distillery spent wash, large biosolids.",
    1900: "Regional-hub concept only (500k gpd). No single train above ~306 t/day has ever operated — this rung is a study, not a plant."
  };
  // real-world reference object each plant size is drawn next to (3D view)
  // and compared against in words (explorer view)
  var REALWORLD = {
    10:   { ref: "a small building",      dims: [2.6, 2.2, 2.4], stack: false, annex: false },
    100:  { ref: "a warehouse",           dims: [5.4, 2.6, 3.2], stack: false, annex: false },
    1000: { ref: "a utility block",       dims: [6.0, 3.8, 3.6], stack: true,  annex: false },
    1900: { ref: "a regional facility",   dims: [7.6, 4.6, 4.4], stack: true,  annex: true  }
  };

  var VIEW_KEY = "hcsp-scale-view"; // sessionStorage: "explorer" | "3d"

  function render(host) {
    if (!host) return;
    if (!window.RPT || !RPT.scale_ladder) {
      host.innerHTML = "<p style='padding:24px;font-size:13px'>Scale explorer unavailable — report data not loaded.</p>";
      return;
    }
    if (!document.getElementById("c3s-style")) {
      var st = document.createElement("style"); st.id = "c3s-style"; st.textContent = CSS;
      document.head.appendChild(st);
    }
    var D = RPT.scale_ladder, M = RPT.scale_meta || {};
    var REDUCED = false;
    try { REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    function stillMode() { return REDUCED || document.documentElement.classList.contains("reader"); }

    /* ── DOM scaffold ── */
    var root = document.createElement("div"); root.className = "c3s-root";
    var sec = document.createElement("section"); sec.className = "c3s-sec";
    root.appendChild(sec); host.appendChild(root);
    sec.innerHTML =
      '<div class="c3s-head">' +
        '<p class="c3s-kicker">Chart 5 · The scale ladder · size comparison</p>' +
        '<h3 class="c3s-title">Four sizes of the same machine — see each one next to a building you know</h3>' +
        '<p class="c3s-howto">What this shows: the same treatment machine built at four sizes — 10, 100, 1,000 and 1,900 cubic meters of waste a day. ' +
        'Bigger plants need less electricity per cubic meter (the blue band on each), but the top size has never been built: the largest single train ever operated is about 306 tonnes a day. ' +
        'Pick <b>Scale explorer</b> for simple cards, or <b>3D scene</b> to see each plant next to a familiar building. Click any size for the full story.</p>' +
        '<p class="c3s-srcline">Sources: ' + srcLinks(["K70", "K18", "K71", "K72", "K76"]) + "</p>" +
      "</div>";

    /* ── view toggle (radio): Scale explorer (default) vs Bubbles vs 3D scene ── */
    var has3D = !!(window.THREE && THREE.OrbitControls);
    var saved = "explorer";
    try {
      var sv = sessionStorage.getItem(VIEW_KEY);
      if (sv === "3d" || sv === "bubbles") saved = sv;
    } catch (e) {}
    if (!has3D && saved === "3d") saved = "explorer";
    var vt = document.createElement("div");
    vt.className = "c3s-viewtoggle"; vt.setAttribute("role", "radiogroup");
    vt.setAttribute("aria-label", "Choose how to view the scale ladder");
    vt.innerHTML =
      '<label data-v="explorer"><input type="radio" name="c3s-view" value="explorer"> Scale explorer</label>' +
      '<label data-v="bubbles"><input type="radio" name="c3s-view" value="bubbles"> Bubbles</label>' +
      '<label data-v="3d"><input type="radio" name="c3s-view" value="3d"' + (has3D ? "" : " disabled") + '> 3D scene</label>';
    sec.appendChild(vt);
    var vtNote = document.createElement("p"); vtNote.className = "c3s-vt-note";
    vtNote.textContent = has3D
      ? "Scale explorer is the fast default — no 3D engine · Bubbles plots capacity against energy per m³ · your choice is remembered for this session"
      : "3D engine not available in this browser — Scale explorer shown";
    sec.appendChild(vtNote);
    var vtLabels = vt.querySelectorAll("label"), vtInputs = vt.querySelectorAll("input");
    vtInputs.forEach(function (inp) {
      inp.addEventListener("change", function () { if (inp.checked) setView(inp.value, true); });
    });

    /* ── tools row ── */
    var tools = document.createElement("div"); tools.className = "c3s-tools"; sec.appendChild(tools);
    var pauseBtn = document.createElement("button");
    pauseBtn.type = "button"; pauseBtn.className = "c3s-btn c3s-pause";
    pauseBtn.setAttribute("aria-pressed", "false"); pauseBtn.textContent = "❚❚ Pause";
    tools.appendChild(pauseBtn);
    var orbitBtn = document.createElement("button");
    orbitBtn.type = "button"; orbitBtn.className = "c3s-btn";
    orbitBtn.setAttribute("aria-pressed", "false"); orbitBtn.textContent = "Auto-orbit: off";
    tools.appendChild(orbitBtn);
    var tableBtn = document.createElement("button");
    tableBtn.type = "button"; tableBtn.className = "c3s-btn";
    tableBtn.setAttribute("aria-pressed", "false"); tableBtn.textContent = "Table view";
    tools.appendChild(tableBtn);
    var chipBtns = D.map(function (d, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "c3s-chip";
      b.textContent = d.name + " · " + d.m3d.toLocaleString("en-US") + " m³/day";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { select(i); });
      tools.appendChild(b);
      return b;
    });

    /* ── View B: Scale explorer — pure DOM size cards (no 3D engine, cannot hang) ── */
    var viewExp = document.createElement("div"); sec.appendChild(viewExp);
    var cardsWrap = document.createElement("div"); cardsWrap.className = "c3s-cards";
    viewExp.appendChild(cardsWrap);
    var maxCube = Math.cbrt(D[D.length - 1].m3d);
    var cardEls = D.map(function (d, i) {
      var c = document.createElement("button");
      c.type = "button"; c.className = "c3s-card"; c.setAttribute("aria-pressed", "false");
      var pct = Math.max(6, Math.round(Math.cbrt(d.m3d) / maxCube * 100));
      c.innerHTML =
        '<p class="c3s-card-k">' + esc(d.name) + "</p>" +
        '<p class="c3s-card-cap">' + d.m3d.toLocaleString("en-US") + " <span>m³/day</span></p>" +
        '<div class="c3s-card-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
        '<p class="c3s-card-ref">Footprint comparable to <b>' + esc(REALWORLD[d.m3d].ref) + "</b></p>" +
        '<p class="c3s-card-e">' + d.kwh[0] + "–" + d.kwh[1] + " kWh/m³</p>" +
        '<p class="c3s-card-fit">' + esc(SCALE_FIT[d.m3d] || "—") + "</p>" +
        (d.m3d === D[D.length - 1].m3d ? '<span class="c3s-card-study">Study, not a plant — largest train ever run ≈ 306 t/day</span>' : "") +
        "<p>" + srcLinks(d.src) + "</p>";
      c.addEventListener("click", function () { select(i); });
      cardsWrap.appendChild(c);
      return c;
    });
    var expWarn = document.createElement("div"); expWarn.className = "c3s-warn";
    expWarn.style.maxWidth = "72ch";
    expWarn.textContent = "Scale-up caution: " + (M.limit || "");
    viewExp.appendChild(expWarn);

    /* ── View C: Bubbles — the same four rungs as a 2-variable chart
       (capacity against energy per m³; tiered standard: bubbles for
       2-variable charts). The detail panel slides in below the chart. ── */
    var viewBub = document.createElement("div"); viewBub.style.display = "none"; sec.appendChild(viewBub);
    var bubChartWrap = document.createElement("div"); viewBub.appendChild(bubChartWrap);
    var bubPanelWrap = document.createElement("div"); viewBub.appendChild(bubPanelWrap);
    var bubBuilt = false;
    function buildBubbles() {
      if (!window.ViewStd) return;
      var pts = D.map(function (d, i) {
        return {
          name: d.name,
          x: d.m3d,
          y: (d.kwh[0] + d.kwh[1]) / 2,
          yLo: d.kwh[0], yHi: d.kwh[1],
          r: Math.cbrt(d.m3d),
          color: "#2251ff",
          lab: d.m3d.toLocaleString("en-US") + " m³/day · " + d.kwh[0] + "–" + d.kwh[1] + " kWh/m³",
          tip: "<b>" + esc(d.name) + "</b><br>" + d.m3d.toLocaleString("en-US") + " m³/day<br>" +
            d.kwh[0] + "–" + d.kwh[1] + " kWh/m³<br>Footprint: " + esc(REALWORLD[d.m3d].ref) + "<br>Click for the full story",
          onClick: function () { select(i); },
        };
      });
      ViewStd.bubbles(bubChartWrap, {
        points: pts,
        xLog: true, xDomain: [6, 3000], yDomain: [0, 270],
        xTicks: [10, 100, 1000, 1900],
        xFmt: function (v) { return v.toLocaleString("en-US") + " m³/day"; },
        yTicks: [0, 65, 130, 195, 260],
        yFmt: function (v) { return v + ""; },
        xLabel: "CAPACITY, M³/DAY (LOG)",
        yLabel: "ENERGY INTENSITY, KWH/M³",
        rDomain: [0, Math.cbrt(1900)], rRange: [14, 38],
        ariaLabel: "Bubble chart: plant capacity against energy per cubic meter for the four sizes of the machine",
        note: "The same four rungs as the cards, the 3D scene and the table. Each bubble sits at the middle of its documented energy band (the whisker shows the full band); bubble size follows capacity. The 1,900 m³/day rung is a study, not a plant.",
      });
      bubBuilt = true;
    }

    /* ── View A: 3D scene container (renderer created lazily, destroyed on exit) ── */
    var view3d = document.createElement("div"); view3d.style.display = "none"; sec.appendChild(view3d);
    var grid = document.createElement("div"); grid.className = "c3s-grid"; view3d.appendChild(grid);
    var stageCol = document.createElement("div"); stageCol.className = "c3s-stage-col"; grid.appendChild(stageCol);
    var panel = document.createElement("aside"); panel.className = "c3s-panel";
    panel.setAttribute("aria-live", "polite");
    var panelWrap = document.createElement("div"); panelWrap.appendChild(panel);
    grid.appendChild(panelWrap);

    /* explorer view also shows the detail panel beneath the cards */
    var expPanelWrap = document.createElement("div"); viewExp.appendChild(expPanelWrap);

    var tableWrap = document.createElement("div"); tableWrap.className = "c3s-table-wrap";
    tableWrap.style.display = "none"; sec.appendChild(tableWrap);
    var foot = document.createElement("p"); foot.className = "c3s-foot";
    foot.textContent = "Energy figures are energy-balance model outputs, not bills. Building comparisons are illustrative footprints, not engineering layouts. Capital cost is withheld: earlier figures came from a modeled industry stack, not the manufacturer — the HCSP cost model is pending (TBD).";
    sec.appendChild(foot);

    /* ── shared detail panel (used by both views) ── */
    var selected = -1;
    function highlight() {
      chipBtns.forEach(function (b, j) { b.setAttribute("aria-pressed", j === selected ? "true" : "false"); });
      cardEls.forEach(function (c, j) { c.setAttribute("aria-pressed", j === selected ? "true" : "false"); });
      if (built) {
        facMeshes.forEach(function (m, j) { m.material = j === selected ? MAT.facHi : MAT.fac; });
        bands.forEach(function (b, j) { b.material = j === selected ? MAT.bandHi : MAT.band; });
        dirty = true; poke();
      }
    }
    function select(i) {
      selected = i;
      var d = D[i];
      panel.innerHTML =
        "<h3>" + esc(d.name) + " — " + d.m3d.toLocaleString("en-US") + " m³/day</h3>" +
        '<span class="c3s-stat">Energy ' + d.kwh[0] + "–" + d.kwh[1] + " kWh/m³</span>" +
        '<span class="c3s-stat">Footprint ≈ ' + esc(REALWORLD[d.m3d].ref) + "</span>" +
        '<span class="c3s-tag-tbd">Capital cost withheld — TBD (manufacturer cost model pending)</span>' +
        "<h4>What this size means</h4><p>" + esc(d.note) + "</p>" +
        "<h4>Best-fit industries</h4><p>" + esc(SCALE_FIT[d.m3d] || "—") + "</p>" +
        "<h4>Scale-up caution</h4><div class='c3s-warn'>" + esc(M.limit || "") + "</div>" +
        "<h4>Why scale helps</h4><p>" + esc(M.physics || "") + "</p>" +
        "<p>" + srcLinks((d.src || []).concat(M.src || [])) + "</p>";
      highlight();
    }
    function overview() {
      selected = -1;
      panel.innerHTML =
        "<h3>How to read the four sizes</h3>" +
        "<p>Each size is the same machine built bigger. The electricity needed to treat one cubic meter of waste water falls from up to 250 kWh/m³ at the smallest size to as low as 35 kWh/m³ at the largest.</p>" +
        "<h4>Capital cost</h4><p><span class='c3s-tag-tbd'>Withheld — TBD</span> Earlier cost figures came from a modeled industry stack, not the manufacturer. The HCSP cost model is pending.</p>" +
        "<h4>Scale-up caution</h4><div class='c3s-warn'>" + esc(M.limit || "") + "</div>" +
        "<h4>Cost-scaling basis (not HCSP pricing)</h4><p>" + esc(M.exponent || "") + "</p>" +
        "<p>Click a card, a chip, or a facility in the 3D scene for its detail.</p>" +
        "<p>" + srcLinks(M.src || []) + "</p>";
      highlight();
    }

    /* ── sortable table view (always available) ── */
    var tableBuilt = false;
    function buildTable() {
      var cols = [
        { lab: "Class", key: function (r) { return r.name; }, cell: function (r) { return "<b>" + esc(r.name) + "</b>"; } },
        { lab: "Capacity (m³/day)", num: true, key: function (r) { return r.m3d; }, cell: function (r) { return r.m3d.toLocaleString("en-US"); } },
        { lab: "kWh/m³ low", num: true, key: function (r) { return r.kwh[0]; }, cell: function (r) { return r.kwh[0]; } },
        { lab: "kWh/m³ high", num: true, key: function (r) { return r.kwh[1]; }, cell: function (r) { return r.kwh[1]; } },
        { lab: "Real-world footprint", key: function (r) { return REALWORLD[r.m3d].ref; }, cell: function (r) { return esc(REALWORLD[r.m3d].ref); } },
        { lab: "Capital cost", key: function () { return ""; }, cell: function () { return '<span class="c3s-tag-tbd">Withheld — TBD</span>'; } },
        { lab: "Best-fit industries", key: function (r) { return SCALE_FIT[r.m3d] || ""; }, cell: function (r) { return esc(SCALE_FIT[r.m3d] || "—"); } },
        { lab: "Note", key: function (r) { return r.note; }, cell: function (r) { return esc(r.note); } },
        { lab: "Sources", key: function (r) { return r.src.join(""); }, cell: function (r) { return srcLinks(r.src); } }
      ];
      var sortI = 1, sortDir = 1;
      var tbl = document.createElement("table"); tbl.className = "c3s-table";
      function draw() {
        var rows = D.slice().sort(function (a, b) {
          var va = cols[sortI].key(a), vb = cols[sortI].key(b);
          return (va < vb ? -1 : va > vb ? 1 : 0) * sortDir;
        });
        tbl.innerHTML = "<thead><tr>" + cols.map(function (c, i) {
          return "<th data-i='" + i + "'>" + esc(c.lab) + (i === sortI ? (sortDir > 0 ? " ▲" : " ▼") : "") + "</th>";
        }).join("") + "</tr></thead><tbody>" + rows.map(function (r) {
          return "<tr data-m3d='" + r.m3d + "'>" + cols.map(function (c) {
            return "<td class='" + (c.num ? "c3s-num" : "") + "'>" + c.cell(r) + "</td>";
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
            var i = D.findIndex(function (r) { return String(r.m3d) === tr.dataset.m3d; });
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

    /* ══ View A internals — light 3D scene (created on demand, destroyed on exit) ══ */
    var built = false, renderer = null, scene = null, camera = null, controls = null;
    var MAT = null, facMeshes = [], bands = [], clickable = [], labels = [];
    var paused = false, orbitOn = false, dirty = true, inView = false, raf = 0;
    var io3d = null, canvas = null, hintEl = null, pokeFrame = null;
    var QA_THROTTLE = /[?&]qa=1\b/.test(location.search), lastRender = 0, lastInteract = 0;

    pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    function setPaused(p) {
      paused = p;
      pauseBtn.setAttribute("aria-pressed", p ? "true" : "false");
      pauseBtn.textContent = p ? "▶ Resume" : "❚❚ Pause";
      dirty = true; poke();
    }
    orbitBtn.addEventListener("click", function () { setOrbit(!orbitOn); });
    function setOrbit(on) {
      orbitOn = on;
      orbitBtn.setAttribute("aria-pressed", on ? "true" : "false");
      orbitBtn.textContent = "Auto-orbit: " + (on ? "on" : "off");
      if (built) { controls.autoRotate = on && !paused && !stillMode(); dirty = true; poke(); }
    }

    function resize3d() {
      if (!built) return;
      var w = stageCol.clientWidth, h = canvas.clientHeight || 560;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      dirty = true; poke();
    }

    function label(text, cls, x, y, z, dx, dy) {
      var el = document.createElement("div");
      el.className = "c3s-label" + (cls ? " " + cls : "");
      el.textContent = text;
      stageCol.appendChild(el);
      labels.push({ el: el, v: new THREE.Vector3(x, y, z), dx: dx || 0, dy: dy || 0 });
    }

    function placeLabels() {
      var w = stageCol.clientWidth, h = canvas.clientHeight || 560;
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

    function init3D() {
      if (built) return;
      stageCol.innerHTML = "";
      labels = []; facMeshes = []; bands = []; clickable = [];
      canvas = document.createElement("canvas"); canvas.className = "c3s-stage";
      canvas.setAttribute("aria-label", "Interactive 3D scene: four plant sizes of 10, 100, 1000 and 1900 cubic meters per day, each drawn next to a real-world reference building");
      stageCol.appendChild(canvas);
      hintEl = document.createElement("p"); hintEl.className = "c3s-hint";
      hintEl.textContent = "Static by default · drag to orbit · scroll to zoom · click a facility · Auto-orbit button adds slow motion";
      stageCol.appendChild(hintEl);

      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true,
          preserveDrawingBuffer: QA_THROTTLE /* QA frame capture */ });
      } catch (e) {
        stageCol.innerHTML = "<p style='padding:40px;font-size:13px'>WebGL is unavailable in this browser — use the Scale explorer view instead.</p>";
        return;
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.HCSP_DPR_CAP || 1.5)); // capped: light scene
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xf2f5f9, 40, 110);
      camera = new THREE.PerspectiveCamera(40, 2, 0.1, 220);
      camera.position.set(0, 14, 36);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xdde4ec, 0.95));
      var sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(8, 14, 10); scene.add(sun);

      MAT = {
        fac:    new THREE.MeshStandardMaterial({ color: 0x2251ff, roughness: 0.5, metalness: 0.2 }),
        facHi:  new THREE.MeshStandardMaterial({ color: 0x5d7dff, roughness: 0.4, metalness: 0.25 }),
        ref:    new THREE.MeshStandardMaterial({ color: 0xd8cfc4, roughness: 0.85, metalness: 0.05 }),
        refRoof:new THREE.MeshStandardMaterial({ color: 0xb5a48f, roughness: 0.85, metalness: 0.05 }),
        stack:  new THREE.MeshStandardMaterial({ color: 0x9aa7b5, roughness: 0.7, metalness: 0.15 }),
        band:   new THREE.MeshStandardMaterial({ color: 0x2251ff, roughness: 0.35, metalness: 0.1, transparent: true, opacity: 0.34 }),
        bandHi: new THREE.MeshStandardMaterial({ color: 0x2251ff, roughness: 0.35, metalness: 0.1, transparent: true, opacity: 0.62 }),
        edge:   new THREE.LineBasicMaterial({ color: 0x2251ff }),
        ground: new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.85 })
      };

      var group = new THREE.Group(); scene.add(group);
      var ground = new THREE.Mesh(new THREE.CircleGeometry(34, 48), MAT.ground);
      ground.rotation.x = -Math.PI / 2; ground.position.y = -0.06; group.add(ground);
      var gridH = new THREE.GridHelper(72, 36, 0xd8dfe9, 0xe8edf4);
      gridH.position.y = -0.05; group.add(gridH);

      // layout: four groups left→right; facility in front, reference building behind
      var X0 = -16.5, DX = 11;
      var KMAX = 260;
      function ky(kwh) { return (kwh / KMAX) * 4.6; } // energy-band height span

      D.forEach(function (d, i) {
        var x = X0 + i * DX;
        var g = new THREE.Group(); g.position.set(x, 0, 0); group.add(g);
        var RW = REALWORLD[d.m3d];

        // reference real-world object (behind): plain building block + optional stack/annex
        var rw = RW.dims;
        var refB = new THREE.Mesh(new THREE.BoxGeometry(rw[0], rw[1], rw[2]), MAT.ref);
        refB.position.set(0, rw[1] / 2, -2.6); g.add(refB);
        var roof = new THREE.Mesh(new THREE.BoxGeometry(rw[0] + 0.15, 0.18, rw[2] + 0.15), MAT.refRoof);
        roof.position.set(0, rw[1] + 0.09, -2.6); g.add(roof);
        var refTop = rw[1] + 0.18;
        if (RW.stack) {
          var stk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 2.2, 10), MAT.stack);
          stk.position.set(rw[0] / 2 - 0.8, rw[1] + 1.1, -2.6); g.add(stk);
          refTop = rw[1] + 2.2;
        }
        if (RW.annex) {
          var anx = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.6, 3.0), MAT.ref);
          anx.position.set(-(rw[0] / 2) - 1.2, 1.3, -2.4); g.add(anx);
        }

        // the plant itself (front): footprint grows with the cube root of capacity —
        // an honest volume scale, not an abstract rising podium
        var s = 1.15 * Math.cbrt(d.m3d / 10);            // 1.15 → 6.6 across the four rungs
        var hf = 0.55 * s + 0.4;
        var fac = new THREE.Mesh(new THREE.BoxGeometry(s, hf, s * 0.85), MAT.fac);
        fac.position.set(0, hf / 2, 2.2); g.add(fac);
        var facRoof = new THREE.Mesh(new THREE.BoxGeometry(s + 0.12, 0.14, s * 0.85 + 0.12), MAT.stack);
        facRoof.position.set(0, hf + 0.07, 2.2); g.add(facRoof);
        fac.userData.idx = i; facRoof.userData.idx = i;
        clickable.push(fac, facRoof); facMeshes.push(fac);

        // energy-range band floating above the plant: lo→hi kWh/m³
        var yLo = hf + 0.5 + ky(d.kwh[0]), yHi = hf + 0.5 + ky(d.kwh[1]);
        var bh = Math.max(0.3, yHi - yLo);
        var band = new THREE.Mesh(new THREE.BoxGeometry(Math.min(s, 2.2), bh, Math.min(s, 2.2)), MAT.band.clone());
        band.position.set(0, (yLo + yHi) / 2, 2.2); g.add(band);
        band.add(new THREE.LineSegments(new THREE.EdgesGeometry(band.geometry), MAT.edge));
        bands.push(band);
        var stem = new THREE.Mesh(new THREE.BoxGeometry(0.16, Math.max(0.05, yLo - hf), 0.16),
          new THREE.MeshBasicMaterial({ color: 0x9db4ff, transparent: true, opacity: 0.4 }));
        stem.position.set(0, hf + (yLo - hf) / 2, 2.2); g.add(stem);

        // labels
        var topY = Math.max(yHi, refTop, hf) + 1.15;
        label(d.name + " — " + d.m3d.toLocaleString("en-US") + " m³/day", "c3s-lb-big", x, topY, 0);
        label(d.kwh[0] + "–" + d.kwh[1] + " kWh/m³", "c3s-lb-blue", x, yHi + 0.42, 2.2);
        label("the plant", "c3s-lb-blue", x, hf + 0.32, 2.2, 0, 26);
        label("reference: " + RW.ref, "c3s-lb-dim", x, refTop + 0.4, -2.6);
      });

      // scale-up caution over the largest rung
      var lastX = X0 + (D.length - 1) * DX;
      label("Caution: largest single train ever operated ≈ 306 t/day — the 1,900 m³/day size is a study, not a plant",
        "c3s-lb-red", lastX, 11.4, 0);

      controls = new THREE.OrbitControls(camera, canvas);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.target.set(0, 3.2, 0);
      controls.minDistance = 8; controls.maxDistance = 60;
      controls.maxPolarAngle = Math.PI * 0.52;
      controls.autoRotate = false; // auto-orbit optional, OFF by default (battery)
      controls.addEventListener("start", function () { lastInteract = performance.now(); poke(); });
      controls.addEventListener("change", function () { dirty = true; lastInteract = performance.now(); poke(); });

      // QA hook: world→screen projection for automated click tests
      canvas._project = function (x, y, z) {
        var r = canvas.getBoundingClientRect();
        var v = new THREE.Vector3(x, y, z).project(camera);
        return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height, behind: v.z > 1 };
      };

      // click (not drag) → select facility
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

      /* render loop: static unless auto-orbit is on; sleeps when paused /
         reading mode / lite mode / offscreen; brief settle after drags */
      function pokeLocal() { if (inView && !raf) raf = requestAnimationFrame(frame); }
      pokeFrame = pokeLocal; // so the outer poke() reaches the live frame loop
      function frame(t) {
        raf = 0;
        if (!inView || !built) return;
        if (QA_THROTTLE && t != null && t - lastRender < 80) { raf = requestAnimationFrame(frame); return; }
        lastRender = t || 0;
        var autoMotion = !paused && !stillMode() && orbitOn;
        controls.autoRotate = autoMotion;
        controls.update();
        if (dirty || autoMotion) {
          renderer.render(scene, camera);
          placeLabels();
          dirty = false;
        }
        var settling = performance.now() - lastInteract < 400;
        if (autoMotion || settling) raf = requestAnimationFrame(frame);
      }
      io3d = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          inView = e.isIntersecting;
          if (inView) { dirty = true; pokeLocal(); }
        });
      }, { threshold: 0.05 });
      io3d.observe(root);
      addEventListener("resize", resize3d, { passive: true });

      built = true;
      // one-active-3D-scene rule: tell the page a new scene just came alive
      try {
        document.dispatchEvent(new CustomEvent("hcsp:scene-active", { detail: { el: host } }));
      } catch (e) {}
      // expose a pause handle so the page-level scene manager can stop this scene
      root.c3 = { pause: setPaused };
      resize3d();
      highlight();
    }

    function dispose3D() {
      if (!built && !renderer) return;
      built = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (io3d) { io3d.disconnect(); io3d = null; }
      removeEventListener("resize", resize3d);
      inView = false;
      try { if (controls) controls.dispose(); } catch (e) {}
      try { if (renderer) { renderer.dispose(); renderer.forceContextLoss(); } } catch (e) {}
      renderer = null; scene = null; camera = null; controls = null; canvas = null;
      pokeFrame = null;
      labels = []; facMeshes = []; bands = []; clickable = [];
      stageCol.innerHTML = "";
      root.c3 = null;
    }

    // outer poke(): reaches the active frame loop if the 3D view is built
    function poke() { if (built && pokeFrame) pokeFrame(); }

    /* ── view switching ── */
    function setView(v, save) {
      if (v === "3d" && !has3D) v = "explorer";
      try { if (save) sessionStorage.setItem(VIEW_KEY, v); } catch (e) {}
      vtInputs.forEach(function (inp) { inp.checked = inp.value === v; });
      vtLabels.forEach(function (l) { l.classList.toggle("c3s-vt-on", l.getAttribute("data-v") === v); });
      var show3d = v === "3d";
      var showBub = v === "bubbles";
      viewExp.style.display = (show3d || showBub) ? "none" : "";
      viewBub.style.display = showBub ? "" : "none";
      view3d.style.display = show3d ? "" : "none";
      pauseBtn.style.display = show3d ? "" : "none";
      orbitBtn.style.display = show3d ? "" : "none";
      // the detail panel lives beside the 3D stage, beneath the chart in the
      // bubbles view, beneath the cards in explorer
      (show3d ? panelWrap : showBub ? bubPanelWrap : expPanelWrap).appendChild(panel);
      if (show3d) {
        init3D();
      } else {
        dispose3D(); // hand the GL context back — the explorer must be hang-proof
        if (showBub && !bubBuilt) buildBubbles();
      }
    }

    overview();
    setView(saved, false);
  }

  window.ScaleExplorer = { render: render };
  window.C3Scale = window.ScaleExplorer; // backward-compatible alias
})();
