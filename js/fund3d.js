/* ═══ Funding & Grants 3D — "the deadline wall + the grant field" ═══
   window.Fund3D = { render(hostEl) }
   One module, two 3D views on a shared renderer (toggle in the view bar):
     1) GRANT FIELD — all 92 programs of RPT.grants_register as an interactive
        3D field of cards, clustered by level (Federal / State / Municipal /
        Private / Corporate / International / University), card color = 2026
        status, card height = HCSP match score (1–5). Instant search + filters
        (level / type / status / direct access / match). Click a card for the
        full record (agency, award, access, fit, deadline, notes, program URL,
        dated source links).
     2) DEADLINE WALL — RPT.funding_calendar + the in-window RPT.catalysts as
        3D plaques along a Sep 2026 → Q3 2027 timeline. CLOSED events (DWPR
        2026-09-29, ONR 2026-09-30) in semantic red, future events in ink/blue,
        regulatory catalysts as demand/policy markers. Animated camera drift,
        a moving NOW marker, a travelling scan beam, drifting particles.
        Click a plaque for what it means for HCSP + what to do + dated sources.
   Plus a one-click FAST TABLE fallback: the existing sortable/filterable
   register table (js/funding.js, #grant-table inside #grant-table-block)
   stays fully functional and is revealed by the TABLE view.
   Continuous motion on load (auto-orbit / drift / particles); Pause button;
   Reading Mode (html.reader / prefers-reduced-motion) = static assembled
   frame; rendering pauses offscreen (IntersectionObserver) and while the
   table view is up. All HTML labels ≥12px, cached-measure de-overlap.
   Vendor (three.min.js + OrbitControls) is injected lazily on first approach
   of the host — the page pays no WebGL cost above the fold.
   Integration: <div id="fund3d"></div> anywhere after js/data.js +
   js/sources.js; the module self-boots on #fund3d when it nears the viewport. */
(function () {
  "use strict";

  /* ── self-contained styles (no external CSS dependency) ── */
  var CSS = `
.f3d-host{min-height:200px}
.wide.xxl{max-width:1280px}
.f3d-root{position:relative;border:1px solid var(--line,#dbe2ea);border-radius:10px;overflow:hidden;
  background:linear-gradient(#fdfdfe,var(--paper-hi,#f7f9fc));
  box-shadow:var(--shadow,0 1px 2px rgba(5,28,44,.05),0 8px 28px rgba(5,28,44,.07))}
.f3d-head{padding:14px 16px 0}
.f3d-title{margin:0;font-family:var(--serif,Georgia,serif);font-weight:700;font-size:19px;color:var(--ink,#051c2c)}
.f3d-sub{margin:4px 0 0;font-size:13px;line-height:1.55;color:var(--ink-md,#42566a);max-width:72em}
.f3d-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 14px 0}
.f3d-bar::before{content:"VIEW";font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;
  letter-spacing:.2em;color:var(--ink-lo,#5b6f82);margin-right:2px}
.f3d-btn{font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;font-weight:700;letter-spacing:.08em;
  color:var(--ink-md,#42566a);background:var(--paper,#fff);border:1.5px solid var(--line,#dbe2ea);
  border-radius:999px;padding:6px 14px;cursor:pointer;transition:border-color .15s,color .15s}
.f3d-btn:hover{border-color:var(--ink,#051c2c);color:var(--ink,#051c2c)}
.f3d-btn.on{border-color:var(--red,#2251ff);color:#fff;background:var(--red,#2251ff)}
.f3d-btn:focus-visible{outline:2px solid var(--red,#2251ff);outline-offset:2px}
.f3d-bar .f3d-spacer{flex:1}
.f3d-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 14px 0}
.f3d-tools input,.f3d-tools select{font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;
  letter-spacing:.04em;color:var(--ink,#051c2c);background:var(--paper,#fff);
  border:1px solid var(--line,#dbe2ea);border-radius:3px;padding:6px 9px;outline:none}
.f3d-tools input{min-width:220px}
.f3d-tools input:focus,.f3d-tools select:focus{border-color:var(--red,#2251ff)}
.f3d-count{font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;letter-spacing:.08em;
  color:var(--ink-md,#42566a);margin-left:auto}
.f3d-stage{position:relative;height:620px;margin-top:10px}
@media (max-width:1100px){.f3d-stage{height:520px}}
@media (max-width:860px){.f3d-stage{height:430px}}
.f3d-stage canvas{display:block;width:100%;height:100%;touch-action:none}
html.reader .f3d-stage canvas{touch-action:auto}
.f3d-chips{position:absolute;inset:0;pointer-events:none;z-index:3;overflow:hidden}
.f3d-chip{position:absolute;font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;font-weight:700;
  letter-spacing:.03em;color:var(--ink,#051c2c);background:rgba(255,255,255,.92);
  border:1px solid var(--line,#dbe2ea);border-radius:4px;padding:1px 7px;white-space:nowrap;
  transform:translate(-50%,-100%)}
.f3d-chip.hard{color:var(--red,#2251ff);border-color:rgba(34,81,255,.4)}
.f3d-chip.closed{color:var(--neg,#c22f4e);border-color:rgba(194,47,78,.45);text-decoration:line-through}
.f3d-chip.demand{color:#00674f;border-color:rgba(0,138,109,.45)}
.f3d-chip.risk{color:#8a5f0a;border-color:rgba(176,122,16,.45)}
.f3d-chip.now{color:#fff;background:var(--red,#2251ff);border-color:var(--red,#2251ff)}
.f3d-chip.tick{font-weight:400;color:var(--ink-lo,#5b6f82);background:rgba(255,255,255,.8);
  transform:translate(-50%,0)}
.f3d-chip.grp{color:var(--ink,#051c2c);border-color:var(--ink,#051c2c);background:rgba(255,255,255,.94)}
.f3d-hint{position:absolute;bottom:10px;left:14px;z-index:4;font-family:var(--mono,Menlo,Consolas,monospace);
  font-size:12px;letter-spacing:.08em;color:var(--ink-md,#42566a);
  background:rgba(255,255,255,.88);padding:2px 8px;border-radius:4px}
.f3d-legend{position:absolute;bottom:10px;right:14px;z-index:4;display:flex;gap:10px;flex-wrap:wrap;
  max-width:60%;justify-content:flex-end;font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;
  color:var(--ink-md,#42566a);background:rgba(255,255,255,.88);padding:3px 10px;border-radius:4px}
.f3d-legend .sw{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:-1px}
.f3d-tip{position:absolute;z-index:5;display:none;max-width:300px;pointer-events:none;
  background:var(--ink,#051c2c);color:#eef2f6;border-radius:6px;border-top:3px solid var(--red,#2251ff);
  padding:8px 12px;font-size:12.5px;line-height:1.5;box-shadow:0 12px 40px rgba(5,28,44,.4)}
.f3d-tip.show{display:block}
.f3d-tip .ft-id{font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;font-weight:700;color:#9fd0ff}
.f3d-tip .ft-sub{color:#c6d1db;font-size:12px}
.f3d-detail{display:none;margin:0 14px 14px;border:1px solid var(--line,#dbe2ea);border-radius:10px;
  padding:14px 16px;background:var(--paper,#fff)}
.f3d-detail.show{display:block}
.f3d-detail h4{margin:0 0 6px;font-size:15.5px;color:var(--ink,#051c2c);line-height:1.35}
.f3d-detail .f3d-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 22px;font-size:13.5px;
  line-height:1.55;color:var(--ink,#051c2c)}
@media (max-width:860px){.f3d-detail .f3d-grid{grid-template-columns:1fr}}
.f3d-detail .f3d-grid .full{grid-column:1/-1}
.f3d-detail h5{margin:0 0 3px;font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;color:var(--ink-md,#42566a)}
.f3d-detail p{margin:0}
.f3d-detail .f3d-srcs{margin-top:12px;padding-top:10px;border-top:1px solid var(--line-lo,#eef1f6);
  font-size:12.5px;color:var(--ink-md,#42566a);line-height:1.9}
.f3d-detail .f3d-srcs a,.f3d-detail .f3d-progurl{color:var(--red,#2251ff)}
.f3d-detail .f3d-match{font-family:var(--mono,Menlo,Consolas,monospace);letter-spacing:.1em;color:var(--red,#2251ff)}
.f3d-close{float:right;font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;font-weight:700;
  letter-spacing:.08em;color:var(--ink-md,#42566a);background:none;border:1.5px solid var(--line,#dbe2ea);
  border-radius:999px;padding:4px 12px;cursor:pointer}
.f3d-close:hover{border-color:var(--ink,#051c2c);color:var(--ink,#051c2c)}
.f3d-nogl{padding:60px 20px;text-align:center;font-family:var(--mono,Menlo,Consolas,monospace);
  font-size:13px;color:var(--ink-md,#42566a)}
.f3d-stbadge{display:inline-block;font-family:var(--mono,Menlo,Consolas,monospace);font-size:12px;
  font-weight:700;letter-spacing:.08em;border-radius:3px;padding:1px 8px;vertical-align:1px}
`;
  function injectCSS() {
    if (document.getElementById("f3d-css")) return;
    var st = document.createElement("style");
    st.id = "f3d-css"; st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ── small helpers (same conventions as the c3 modules) ── */
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
        return '<a class="src-link" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
          esc(s.k) + " · " + esc(label) + " ↗</a>" + date;
      }
      return '<span class="src-derived">' + esc(s.k) + " · " + esc(label) + date + " — derived analysis</span>";
    }).join(" · ");
  }

  /* ── lazy vendor injection (dist bundles inline the scripts into
     window.HCSP_INLINE_SCRIPTS via bundle.py — used when present) ── */
  var loadedScripts = {};
  function loadScript(src) {
    if (loadedScripts[src]) return loadedScripts[src];
    loadedScripts[src] = new Promise(function (res, rej) {
      if (window.HCSP_INLINE_SCRIPTS && window.HCSP_INLINE_SCRIPTS[src]) {
        try {
          var el = document.createElement("script");
          el.textContent = window.HCSP_INLINE_SCRIPTS[src];
          document.head.appendChild(el); res();
        } catch (e) { rej(e); }
        return;
      }
      var el = document.createElement("script");
      el.src = src; el.onload = function () { res(); };
      el.onerror = function () { rej(new Error("fund3d: failed to load " + src)); };
      document.body.appendChild(el);
    });
    return loadedScripts[src];
  }
  var vendorP = null;
  function ensureVendor() {
    if (!vendorP) {
      vendorP = (window.THREE ? Promise.resolve() : loadScript("vendor/three.min.js"))
        .then(function () {
          return (window.THREE && THREE.OrbitControls) ? Promise.resolve() : loadScript("vendor/OrbitControls.js");
        });
    }
    return vendorP;
  }

  /* ── data ── */
  function grants() { return (window.RPT && RPT.grants_register) || []; }
  function calendar() { return (window.RPT && RPT.funding_calendar) || []; }
  function catalystsInWindow() {
    return (window.RPT && RPT.catalysts) || [];
  }

  /* What to do next — one plain-English action per dated wall event, taken from
     the §10 "immediate actions" prose of the funding page. Catalysts carry their
     own `act` field in RPT.catalysts. */
  var WALL_ACT = {
    "DWPR proposals due": "The FY2026 window has closed — pre-position the pilot proposal (produced water or PFAS-laden concentrate) now for the FY2027 round; the program runs on an annual cycle.",
    "Navy research call closes": "Carry the waste-heat-driven water-treatment white paper (shipboard water and waste destruction) over to the successor call — verify the current solicitation number before submitting.",
    "SERDP FY28 call opens": "Begin lining up a military base to host a demonstration now — the pre-proposal is the gate, and funded precedents already exist (ER20-5350).",
    "NJ fund pipeline forms": "Engage New Jersey's environmental agency while the $795M PFAS Abatement Fund's rules and project pipelines are being designed — at least $150M is routed to sewage treatment plants.",
    "Defense SBIR FY27 R1": "Watch for Navy facilities water/PFAS topics succeeding N254-123 and N233-117; seek an endorsement letter from the Air Force's civil engineers, the named follow-on buyer.",
    "NC rolling close": "File before the rolling quarterly window closes November 2, 2026 — North Carolina funds PFAS construction in drinking water, wastewater, and landfill drainage. Missing a hard gate costs a full annual cycle.",
    "Imagine H2O 2027 apps": "File the zero-equity accelerator application in the Nov–Dec 2026 window; PFAS and sludge destruction are named cohort themes, with ~$50–150K recoverable pilot grants behind it.",
    "Water-loan PFAS funds end": "Get HCSP specified into state funding priority lists this cycle — projects awarded in the final infrastructure-law year procure equipment through 2027–2030.",
    "ESTCP FY28 pre-proposals": "Line up a Defense Department host site in Q4 2026; the FY28 pre-proposal (~March 2027) is the gate, and the 'Water Resilience on Installations' topic maps directly to HCSP.",
    "Elemental DCII window": "Apply to the Data Center Innovation Initiative ($500K–$5M per project) — the flagship private fit for the water + cooling + power story.",
    "TX Prop 4 rulemaking": "Low effort now, very high payoff later: track the 2026 rulemaking for the up-to-$20B sales-tax dedication (2027–2047) — produced-water treatment is explicitly named.",
    "Wisconsin PFAS grant rounds": "Engage Wisconsin's environmental agency while the treatment-grant rounds are designed — unusually direct for a state program because private landfills themselves are grantees (≤20% match)."
  };

  /* ═══ render(hostEl) ═══ */
  function render(hostEl) {
    if (!hostEl || hostEl._f3d) return;
    hostEl._f3d = true;
    injectCSS();

    var ROWS = grants();
    var CAL = calendar();
    var CATS = catalystsInWindow();
    var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      || document.documentElement.classList.contains("reader");
    var tableBlock = document.getElementById("grant-table-block");

    /* status palette — semantic red only for CLOSED/DEAD */
    var ST_COL = {
      "ACTIVE": 0x2251ff, "OPEN-DEADLINE": 0x0e9f6e, "WATCH": 0xb07a10,
      "PAUSED": 0x94a3b8, "CLOSED": 0xc22f4e, "DEAD": 0x8f2438
    };
    var ST_CSS = {
      "ACTIVE": "#2251ff", "OPEN-DEADLINE": "#0e9f6e", "WATCH": "#b07a10",
      "PAUSED": "#94a3b8", "CLOSED": "#c22f4e", "DEAD": "#8f2438"
    };
    var LEVELS = ["Federal", "State", "Municipal-utility", "Private-foundation", "Corporate", "International/NGO", "University"];
    var LEVEL_SHORT = {
      "Federal": "FEDERAL", "State": "STATE", "Municipal-utility": "MUNICIPAL / UTILITY",
      "Private-foundation": "PRIVATE / FOUNDATION", "Corporate": "CORPORATE",
      "International/NGO": "INTERNATIONAL / NGO", "University": "UNIVERSITY"
    };
    var AC_SHORT = { "Yes": "DIRECT", "No—via utility partner": "VIA UTILITY", "No—via other partner": "VIA PARTNER", "No": "CLOSED" };

    /* ── DOM skeleton ── */
    var root = document.createElement("div");
    root.className = "f3d-root";
    root.innerHTML =
      '<div class="f3d-head">' +
        '<h3 class="f3d-title">The register in 3D — 92 programs as a field, twelve months as a wall</h3>' +
        '<p class="f3d-sub">The 3D field groups every screened program by level; card color is the 2026 status and card height is the HCSP match score (taller = better fit). ' +
        'The deadline wall lays the dated pursuits along a timeline — the two September federal plaques are CLOSED in red. ' +
        'Search and filters reshape the field instantly; click any card or plaque for the full record with dated sources. ' +
        'Ninety-two programs are often easier as a table — the fast table is one click away.</p>' +
      '</div>' +
      '<div class="f3d-bar" role="tablist" aria-label="Funding views">' +
        '<button type="button" class="f3d-btn on" data-view="register" role="tab" aria-selected="true">◆ 3D GRANT FIELD</button>' +
        '<button type="button" class="f3d-btn" data-view="wall" role="tab" aria-selected="false">▮▮ 3D DEADLINE WALL</button>' +
        '<button type="button" class="f3d-btn" data-view="table" role="tab" aria-selected="false">▦ FAST TABLE</button>' +
        '<span class="f3d-spacer"></span>' +
        '<button type="button" class="f3d-btn" data-act="orbit" aria-pressed="true">🔁 Auto-orbit: on</button>' +
        '<button type="button" class="f3d-btn" data-act="pause" aria-pressed="false">⏸ Pause</button>' +
      '</div>' +
      '<div class="f3d-tools">' +
        '<input type="search" class="f3d-q" placeholder="Search program, agency, notes…" aria-label="Search the 3D register">' +
        '<select class="f3d-f" data-f="level" aria-label="Filter by level"><option value="">LEVEL · ALL</option></select>' +
        '<select class="f3d-f" data-f="type" aria-label="Filter by type"><option value="">TYPE · ALL</option></select>' +
        '<select class="f3d-f" data-f="status" aria-label="Filter by status"><option value="">STATUS · ALL</option>' +
          ['ACTIVE', 'OPEN-DEADLINE', 'WATCH', 'PAUSED', 'CLOSED', 'DEAD'].map(function (v) { return "<option>" + v + "</option>"; }).join("") + '</select>' +
        '<select class="f3d-f" data-f="access" aria-label="Filter by access"><option value="">ACCESS · ALL</option>' +
          ["Yes", "No—via utility partner", "No—via other partner", "No"].map(function (v) { return '<option value="' + esc(v) + '">' + AC_SHORT[v] + "</option>"; }).join("") + '</select>' +
        '<select class="f3d-f" data-f="match" aria-label="Filter by match score"><option value="0">MATCH · ALL</option><option value="5">5 ONLY</option><option value="4">≥ 4</option><option value="3">≥ 3</option></select>' +
        '<span class="f3d-count"></span>' +
      '</div>' +
      '<div class="f3d-stage">' +
        '<div class="f3d-chips"></div>' +
        '<div class="f3d-legend"></div>' +
        '<div class="f3d-hint">drag to orbit · scroll to zoom · click a card or plaque</div>' +
        '<div class="f3d-tip"></div>' +
      '</div>' +
      '<div class="f3d-detail"></div>';
    hostEl.appendChild(root);

    var stage = root.querySelector(".f3d-stage");
    var chipsLayer = root.querySelector(".f3d-chips");
    var legend = root.querySelector(".f3d-legend");
    var tip = root.querySelector(".f3d-tip");
    var detail = root.querySelector(".f3d-detail");
    var tools = root.querySelector(".f3d-tools");
    var countEl = root.querySelector(".f3d-count");

    /* populate level/type filter options from the data */
    ["level", "type"].forEach(function (f) {
      var sel = tools.querySelector('[data-f="' + f + '"]');
      uniq(ROWS.map(function (r) { return r[f]; })).forEach(function (v) {
        var o = document.createElement("option"); o.value = v; o.textContent = v; sel.appendChild(o);
      });
    });

    /* ── renderer / camera / controls (shared by both views) ── */
    var renderer = null;
    if (window.THREE && THREE.OrbitControls) {
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
      catch (e) { renderer = null; }
    }
    if (!renderer) {
      stage.innerHTML = '<div class="f3d-nogl">WebGL is not available in this browser — the 3D views cannot start. ' +
        'The full register is in the fast table below.</div>';
      if (tableBlock) tableBlock.style.display = "";
      root.querySelector('[data-view="table"]').classList.add("on");
      root.querySelector('[data-view="register"]').classList.remove("on");
      tools.style.display = "none";
      root.querySelector('[data-act="pause"]').style.display = "none";
      root.querySelector('[data-act="orbit"]').style.display = "none";
      root.querySelector('[data-view="table"]').addEventListener("click", function () {
        if (tableBlock) { tableBlock.style.display = ""; tableBlock.scrollIntoView({ block: "start" }); }
      });
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.HCSP_DPR_CAP || 1.75));
    stage.insertBefore(renderer.domElement, stage.firstChild);
    renderer.domElement.setAttribute("aria-label",
      "Interactive 3D views of the HCSP grant register and funding deadline calendar");

    var camera = new THREE.PerspectiveCamera(40, 2, 0.1, 300);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;

    var CAM = {
      register: {
        pos: new THREE.Vector3(0, 14.5, 23), tgt: new THREE.Vector3(0, 0.6, 0),
        min: 9, max: 46, polarMax: Math.PI * 0.52, polarMin: Math.PI * 0.12,
        azMin: -Infinity, azMax: Infinity, auto: true
      },
      wall: {
        pos: new THREE.Vector3(-1.5, 6.6, 20), tgt: new THREE.Vector3(-1.5, 3.3, 0),
        min: 9, max: 36, polarMax: Math.PI * 0.56, polarMin: Math.PI * 0.26,
        azMin: -0.85, azMax: 0.85, auto: false
      }
    };

    /* ═══ VIEW 1 — the grant field (92 cards clustered by level) ═══ */
    var sceneReg = new THREE.Scene();
    sceneReg.add(new THREE.HemisphereLight(0xffffff, 0xb8c4d0, 0.95));
    var sunR = new THREE.DirectionalLight(0xffffff, 0.6);
    sunR.position.set(10, 18, 12); sceneReg.add(sunR);

    var base = new THREE.Mesh(
      new THREE.CylinderGeometry(13.4, 13.8, 0.35, 72),
      new THREE.MeshLambertMaterial({ color: 0xe8eef5 })
    );
    base.position.y = -0.18; sceneReg.add(base);
    var grid = new THREE.GridHelper(26.8, 20, 0xc9d5e0, 0xdde6ee);
    grid.position.y = 0.005; sceneReg.add(grid);

    var cards = [];           // { rec, mesh, homeY, cluster }
    var byId = {};
    var cardGeo = new THREE.BoxGeometry(0.9, 1, 0.62);
    cardGeo.translate(0, 0.5, 0);
    var clusterChips = [];
    var R_CLUSTER = 9.7;
    var liveLevels = LEVELS.filter(function (L) { return ROWS.some(function (r) { return r.level === L; }); });
    liveLevels.forEach(function (level, li) {
      var members = ROWS.filter(function (r) { return r.level === level; });
      var th = Math.PI / 2 + li * (Math.PI * 2 / liveLevels.length);
      var cx = R_CLUSTER * Math.cos(th), cz = R_CLUSTER * Math.sin(th);
      var grp = new THREE.Group();
      grp.position.set(cx, 0, cz);
      grp.rotation.y = Math.atan2(cx, cz); // local +z faces outward
      sceneReg.add(grp);
      /* cluster pad */
      var cols = Math.ceil(Math.sqrt(members.length * 1.45));
      var rowsN = Math.ceil(members.length / cols);
      var padW = cols * 1.12 + 0.8, padD = rowsN * 0.98 + 0.8;
      var pad = new THREE.Mesh(new THREE.BoxGeometry(padW, 0.14, padD),
        new THREE.MeshLambertMaterial({ color: 0xf3f6fa }));
      pad.position.y = 0.07; grp.add(pad);
      var maxH = 0;
      members.forEach(function (rec, i) {
        var h = 0.35 + rec.match * 0.34;
        maxH = Math.max(maxH, h);
        var mat = new THREE.MeshLambertMaterial({
          color: ST_COL[rec.status] || 0x94a3b8, transparent: true, opacity: 1
        });
        var m = new THREE.Mesh(cardGeo, mat);
        var c = i % cols, r = Math.floor(i / cols);
        m.position.set((c - (cols - 1) / 2) * 1.12, 0.14, (r - (rowsN - 1) / 2) * 0.98);
        m.scale.set(1, REDUCE ? h : 0.02, 1);
        m.userData.id = rec.id;
        grp.add(m);
        var card = { rec: rec, mesh: m, h: h, shown: true };
        cards.push(card); byId[rec.id] = card;
      });
      /* group label anchor (HTML chip, projected per frame) */
      var anchor = new THREE.Vector3(0, maxH + 1.35, 0);
      grp.updateMatrixWorld(true);
      clusterChips.push({
        text: (LEVEL_SHORT[level] || level.toUpperCase()) + " · " + members.length,
        cls: "grp", anchorObj: grp, anchorLocal: anchor
      });
    });

    /* particle drift — shared builder (continuous ambient motion) */
    function makeParticles(scene, n, box) {
      var pos = new Float32Array(n * 3);
      var spd = new Float32Array(n);
      for (var i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * box.x;
        pos[i * 3 + 1] = Math.random() * box.y;
        pos[i * 3 + 2] = (Math.random() - 0.5) * box.z;
        spd[i] = 0.12 + Math.random() * 0.3;
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      var p = new THREE.Points(g, new THREE.PointsMaterial({
        color: 0x7d9bff, size: 0.09, transparent: true, opacity: 0.5, depthWrite: false
      }));
      scene.add(p);
      return { pts: p, pos: pos, spd: spd, h: box.y };
    }
    var regParticles = makeParticles(sceneReg, 200, { x: 30, y: 10, z: 30 });

    /* ═══ VIEW 2 — the deadline wall (funding_calendar + in-window catalysts) ═══ */
    var sceneWall = new THREE.Scene();
    sceneWall.add(new THREE.HemisphereLight(0xffffff, 0xb8c4d0, 0.95));
    var sunW = new THREE.DirectionalLight(0xffffff, 0.6);
    sunW.position.set(6, 14, 12); sceneWall.add(sunW);

    var wallGroup = new THREE.Group();   // sways gently = the animated camera drift
    sceneWall.add(wallGroup);

    /* piecewise time → world x (same shape as the 2D wall chart, with the
       Sep 2026 – Feb 2027 pile-up expanded so plaque labels clear each other) */
    function wx(v) {
      return v <= 2027.15 ? -11 + (v - 2026.6) / 0.55 * 17 : 6 + (v - 2027.15) / 0.65 * 4;
    }
    var NOW_Y = 2026.75; // compiled September 2026
    var WALL_X0 = wx(2026.62), WALL_X1 = wx(2027.6);

    /* backdrop + timeline rail */
    var floorW = new THREE.Mesh(new THREE.CircleGeometry(19, 56),
      new THREE.MeshBasicMaterial({ color: 0xeef1f6, transparent: true, opacity: 0.85 }));
    floorW.rotation.x = -Math.PI / 2; floorW.position.y = -0.12;
    wallGroup.add(floorW);
    var rail = new THREE.Mesh(new THREE.BoxGeometry(WALL_X1 - WALL_X0 + 6.4, 0.1, 0.1),
      new THREE.MeshLambertMaterial({ color: 0x051c2c }));
    rail.position.set((WALL_X0 + WALL_X1) / 2 + 1.4, 0.05, 0);
    wallGroup.add(rail);

    /* month ticks */
    var TICKS = [[2026.75, "OCT 26"], [2026.92, "DEC 26"], [2027.05, "JAN 27"],
                 [2027.2, "MAR 27"], [2027.45, "JUN 27"]];
    var tickChips = [];
    TICKS.forEach(function (tk) {
      var tx = wx(tk[0]);
      var t = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.05),
        new THREE.MeshLambertMaterial({ color: 0x42566a }));
      t.position.set(tx, 0.2, 0); wallGroup.add(t);
      tickChips.push({ text: tk[1], cls: "tick", pos: new THREE.Vector3(tx, -0.1, 0), dy: 30 });
    });

    /* wall plaques: 12 calendar events + in-window catalysts, packed onto rows */
    var WALL_ITEMS = [];
    CAL.forEach(function (c) {
      WALL_ITEMS.push({
        kind: "cal", y: c.y, label: c.label, date: c.date, cls: c.cls,
        closed: !!c.closed, urgent: !!c.urgent, ev: c.ev, src: c.src,
        mean: c.ev, act: WALL_ACT[c.label] || null
      });
    });
    CATS.forEach(function (c) {
      WALL_ITEMS.push({
        kind: "cat", y: c.y, label: c.label, date: c.date, cls: c.cls,
        closed: false, urgent: false, ev: c.ev, src: c.src, mean: c.mean || c.ev, act: c.act || null
      });
    });
    WALL_ITEMS.sort(function (a, b) { return a.y - b.y; });

    var WALL_COL = {
      hard: 0x2251ff, window: 0x42566a, forming: 0x7a8ea3,
      demand: 0x008a6d, policy: 0x42566a, risk: 0xb07a10
    };
    var CLOSED_COL = 0xc22f4e;
    var ROW_H = 1.55, ROW_Y0 = 1.2, N_ROWS = 6;
    /* Short single-line chip text per wall event (full date + label live in the
       hover tooltip and the click drill-down). Keyed by the data label. */
    var WALL_SHORT = {
      "TX Prop 4 rulemaking": "2026 · TX PROP 4",
      "Wisconsin PFAS grant rounds": "SUM 26 · WI PFAS",
      "DWPR proposals due": "CLOSED · SEP 29 · DWPR",
      "Navy research call closes": "CLOSED · SEP 30 · ONR",
      "SERDP FY28 call opens": "OCT–NOV 26 · SERDP",
      "NJ fund pipeline forms": "AUG 7+ · NJ FUND",
      "Defense SBIR FY27 R1": "OCT 26 · DOD SBIR",
      "NC rolling close": "NOV 2 · NC WINDOW",
      "Imagine H2O 2027 apps": "NOV–DEC · IH2O 2027",
      "Water-loan PFAS funds end": "FY26 · SRF PFAS END",
      "ESTCP FY28 pre-proposals": "DEC–MAR · ESTCP",
      "Elemental DCII window": "2027 · ELEMENTAL",
      "Firefighting foam (AFFF) must be phased out": "OCT 26 · FOAM BAN",
      "Netherlands near-zero nitrogen rule": "2027 · NL NITROGEN BAN",
      "Landfill PFAS limits expected to finalize": "26–28 · LANDFILL ELG"
    };
    /* width-aware row packing with horizontal nudge slots (the same idea as the
       2D wall's lead lines): a plaque may sit off its true date, with a slanted
       stem back to the rail dot at the true x. Packing runs from the MEASURED
       chip pixel widths converted to world units at the current wall-camera
       distance, and re-runs on resize — labels cannot overlap at any width. */
    var DXS = [0, 0.95, -0.95, 1.9, -1.9, 2.85, -2.85, 3.8, -3.8];
    var plaques = [];
    var plaqueChips = [];
    WALL_ITEMS.forEach(function (it) {
      var xTrue = wx(it.y);
      var line1 = WALL_SHORT[it.label] || String(it.label).toUpperCase().slice(0, 20);
      var col = it.closed ? CLOSED_COL : (WALL_COL[it.cls] || 0x42566a);
      var g = new THREE.Group();
      wallGroup.add(g);
      /* rail dot at the TRUE date x; slanted stem up to the (possibly nudged) plaque */
      var dot = new THREE.Mesh(new THREE.SphereGeometry(it.cls === "hard" ? 0.11 : 0.085, 12, 10),
        new THREE.MeshLambertMaterial({ color: col }));
      dot.position.set(xTrue, 0.1, 0); g.add(dot);
      var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1, 6),
        new THREE.MeshLambertMaterial({ color: col, transparent: true, opacity: it.closed ? 0.45 : 0.7 }));
      g.add(stem);
      /* plaque body — calendar events are slabs; catalysts are octahedra */
      var pm, face = null;
      if (it.kind === "cat") {
        pm = new THREE.Mesh(new THREE.OctahedronGeometry(0.42),
          new THREE.MeshLambertMaterial({ color: col }));
        pm.scale.set(1.5, 1, 0.55);
      } else {
        pm = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.78, 0.14),
          new THREE.MeshLambertMaterial({ color: col }));
        /* inset face — tinted red for CLOSED so the whole plaque reads red */
        face = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.6, 0.02),
          new THREE.MeshLambertMaterial({ color: it.closed ? 0xf0ccd4 : 0xffffff }));
        g.add(face);
      }
      pm.userData.wall = it; g.add(pm);
      var chipCls = it.closed ? "closed" : it.kind === "cat" ? (it.cls === "demand" ? "demand" : it.cls === "risk" ? "risk" : "") : (it.cls === "hard" ? "hard" : "");
      var P = {
        it: it, mesh: pm, group: g, stem: stem, face: face, xTrue: xTrue,
        line1: line1, chipObj: null, chipPos: new THREE.Vector3(xTrue, ROW_Y0 + 0.62, 0),
        baseY: ROW_Y0, phase: Math.random() * 6.28
      };
      plaques.push(P);
      plaqueChips.push({ text: line1, cls: chipCls, pos: P.chipPos });
    });
    var stemA = new THREE.Vector3(), stemB = new THREE.Vector3(), stemUp = new THREE.Vector3(0, 1, 0);
    function layStem(stem, x0, x1, py) {
      stemA.set(x0, 0.14, 0); stemB.set(x1, py - 0.4, 0);
      var len = stemA.distanceTo(stemB);
      stem.position.copy(stemA).lerp(stemB, 0.5);
      stem.scale.set(1, len, 1);
      stem.quaternion.setFromUnitVectors(stemUp, stemB.sub(stemA).normalize());
    }
    function relayoutWall() {
      var h = stage.clientHeight || 620;
      var halfV = wallHalfV(); // same fit as fitWallCamera
      var dist = halfV / Math.tan(camera.fov * Math.PI / 360);
      var worldPerPx = 2 * dist * Math.tan(camera.fov * Math.PI / 360) / h;
      var rowBoxes = [];
      plaques.forEach(function (P) {
        var pxW = (P.chipObj && P.chipObj.w) || (P.line1.length * 8.4 + 18);
        var half = pxW * worldPerPx / 2 + 0.3;
        var pick = null;
        for (var r = 0; r < N_ROWS && !pick; r++) {
          for (var di = 0; di < DXS.length; di++) {
            var x = P.xTrue + DXS[di], boxes = rowBoxes[r] || [], free = true;
            for (var bi = 0; bi < boxes.length; bi++) {
              if (x - half < boxes[bi][1] + 0.35 && x + half > boxes[bi][0] - 0.35) { free = false; break; }
            }
            if (free) { pick = { row: r, x: x }; break; }
          }
        }
        if (!pick) pick = { row: N_ROWS - 1, x: P.xTrue }; /* overflow — the de-overlap pass catches it */
        pick.x = Math.max(WALL_X0 + 1.5, Math.min(WALL_X1 + 2.4, pick.x));
        (rowBoxes[pick.row] = rowBoxes[pick.row] || []).push([pick.x - half, pick.x + half]);
        var py = ROW_Y0 + pick.row * ROW_H;
        P.baseY = py;
        P.mesh.position.set(pick.x, py, 0);
        if (P.face) P.face.position.set(pick.x, py, 0.08);
        layStem(P.stem, P.xTrue, pick.x, py);
        P.chipPos.set(pick.x, py + 0.62, 0);
      });
    }

    /* frame the whole wall (rail span + nudge room + top-row chips) for any
       stage aspect — narrow stages pull the camera back instead of clipping */
    function wallHalfV() {
      var w = stage.clientWidth || 1200, h = stage.clientHeight || 620;
      return Math.max(5.9, 15.0 / (w / h));
    }
    function fitWallCamera() {
      var halfV = wallHalfV();
      var dist = halfV / Math.tan(camera.fov * Math.PI / 360);
      camera.position.set(-1.0, 4.9 + dist * 0.2, dist * 0.98);
      controls.target.set(-1.0, 4.4, 0);
      controls.update();
    }

    /* NOW marker — a moving beacon at September 2026 */
    var nowX = wx(NOW_Y);
    var nowG = new THREE.Group();
    nowG.position.set(nowX, 0, 0);
    wallGroup.add(nowG);
    var beamMat = new THREE.MeshBasicMaterial({ color: 0x2251ff, transparent: true, opacity: 0.3 });
    var beam = new THREE.Mesh(new THREE.BoxGeometry(0.09, 11, 0.09), beamMat);
    beam.position.y = 5.5; nowG.add(beam);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 10, 40),
      new THREE.MeshBasicMaterial({ color: 0x2251ff }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.08; nowG.add(ring);
    var nowChip = { text: "NOW · SEP 2026", cls: "now tick", obj: nowG, localTop: new THREE.Vector3(0, -0.1, 0) };

    /* scan beam — a light sheet that continuously sweeps the wall */
    var scanMat = new THREE.MeshBasicMaterial({ color: 0x2251ff, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    var scan = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 10.6), scanMat);
    scan.position.set(WALL_X0, 5.3, 0.4);
    wallGroup.add(scan);

    var wallParticles = makeParticles(sceneWall, 160, { x: 30, y: 11, z: 12 });

    /* ═══ HTML chip labels (≥12px, cached measure, per-frame projection + de-overlap) ═══ */
    var chips = [];
    function addChip(o) {
      var el = document.createElement("div");
      el.className = "f3d-chip" + (o.cls ? " " + o.cls : "");
      el.innerHTML = o.sub
        ? esc(o.text) + '<br><span style="font-weight:400;font-size:12px">' + esc(o.sub) + "</span>"
        : esc(o.text);
      el.style.display = "none";
      chipsLayer.appendChild(el);
      var c = {
        el: el, view: o.view, cls: o.cls || "",
        w: 60, h: 20, ox: o.dx || 0, oy: o.dy || 0, push: 0,
        world: function (out) {
          if (o.obj) { out.copy(o.localTop || o.pos || new THREE.Vector3()); return o.obj.localToWorld(out); }
          if (o.anchorObj) { out.copy(o.anchorLocal); return o.anchorObj.localToWorld(out); }
          out.copy(o.pos);
          return wallGroup.localToWorld(out);
        }
      };
      chips.push(c);
      return c;
    }
    clusterChips.forEach(function (cc) {
      cc.chip = addChip({ text: cc.text, cls: "grp", view: "register", anchorObj: cc.anchorObj, anchorLocal: cc.anchorLocal, dy: -6 });
    });
    plaqueChips.forEach(function (pc, i) {
      pc.chip = addChip({ text: pc.text, cls: pc.cls, view: "wall", pos: pc.pos, dy: -8 });
      plaques[i].chipObj = pc.chip;
    });
    tickChips.forEach(function (tc) {
      tc.chip = addChip({ text: tc.text, cls: "tick", view: "wall", pos: tc.pos, dy: tc.dy });
    });
    nowChip.chip = addChip({ text: nowChip.text, cls: nowChip.cls, view: "wall", obj: nowChip.obj, localTop: nowChip.localTop, dy: 62 });

    function measureChips() {
      chips.forEach(function (c) {
        var vis = c.el.style.display !== "none";
        if (!vis) c.el.style.display = "";
        c.w = c.el.offsetWidth || 60; c.h = c.el.offsetHeight || 20;
        if (!vis) c.el.style.display = "none";
      });
    }

    var projV = new THREE.Vector3();
    function updateChips() {
      var W = stage.clientWidth, H = stage.clientHeight;
      var act = chips.filter(function (c) { return c.view === view; });
      act.forEach(function (c) { c.push = 0; });
      /* base screen positions */
      act.forEach(function (c) {
        c.world(projV); projV.project(camera);
        c.behind = projV.z > 1;
        c.px = (projV.x * 0.5 + 0.5) * W + c.ox;
        c.py = (-projV.y * 0.5 + 0.5) * H + c.oy;
      });
      /* deterministic screen-space de-overlap (push-down, from scratch each frame) */
      for (var pass = 0; pass < 8; pass++) {
        var moved = false;
        var sorted = act.filter(function (c) { return !c.behind; })
          .sort(function (a, b) { return (a.py + a.push) - (b.py + b.push); });
        for (var i = 1; i < sorted.length; i++) {
          var a = sorted[i - 1], b = sorted[i];
          var ax = a.px, ay = a.py + a.push, bx = b.px, by = b.py + b.push;
          var overlapX = Math.abs(ax - bx) < (a.w + b.w) / 2 + 6;
          /* chips are anchored translate(-50%,-100%): the box extends UP from py.
             tick-class chips extend DOWN (translate(-50%,0)). Compare boxes explicitly. */
          var aTick = a.cls.indexOf("tick") !== -1, bTick = b.cls.indexOf("tick") !== -1;
          var aTop = aTick ? ay : ay - a.h, aBot = aTick ? ay + a.h : ay;
          var bTop = bTick ? by : by - b.h, bBot = bTick ? by + b.h : by;
          if (overlapX && bTop < aBot + 4 && bBot > aTop - 4) {
            var need = (aBot + 4) - bTop;
            b.push += need; moved = true;
          }
        }
        if (!moved) break;
      }
      act.forEach(function (c) {
        if (c.behind) { c.el.style.display = "none"; return; }
        var halfW = c.w / 2;
        var px = Math.max(halfW + 6, Math.min(W - halfW - 6, c.px));
        var py = Math.max(c.h + 6, Math.min(H - 6, c.py + c.push));
        c.el.style.display = "";
        c.el.style.left = px + "px";
        c.el.style.top = py + "px";
        c.sx = px; c.sy = py; /* last drawn anchor (QA) */
      });
      /* hide chips of the inactive view */
      chips.forEach(function (c) { if (c.view !== view) c.el.style.display = "none"; });
    }

    /* legends per view */
    var LEGEND = {
      register: Object.keys(ST_CSS).map(function (s) {
        return '<span><i class="sw" style="background:' + ST_CSS[s] + '"></i>' + s + "</span>";
      }).join("") + '<span style="margin-left:6px">height = HCSP match 1–5</span>',
      wall:
        '<span><i class="sw" style="background:#c22f4e"></i>CLOSED (Sep 2026)</span>' +
        '<span><i class="sw" style="background:#2251ff"></i>HARD DEADLINE</span>' +
        '<span><i class="sw" style="background:#42566a"></i>EXPECTED CYCLE</span>' +
        '<span><i class="sw" style="background:#7a8ea3"></i>FORMING</span>' +
        '<span><i class="sw" style="background:#008a6d"></i>RULE → BUYERS</span>'
    };

    /* ═══ search + filters (same semantics as the fast table in js/funding.js) ═══ */
    var F = { q: "", level: "", type: "", status: "", access: "", match: 0 };
    function matchFn(r) {
      var q = F.q;
      return (!q || (r.id + " " + r.program + " " + r.agency + " " + r.notes + " " + r.fit + " " + r.vertical).toLowerCase().indexOf(q) !== -1)
        && (!F.level || r.level === F.level) && (!F.type || r.type === F.type)
        && (!F.status || r.status === F.status) && (!F.access || r.access === F.access)
        && (!F.match || (F.match === 5 ? r.match === 5 : r.match >= F.match));
    }
    function applyFilters(instant) {
      var n = 0;
      cards.forEach(function (c) {
        c.shown = matchFn(c.rec);
        if (c.shown) n++;
        c.tS = c.shown ? c.h : Math.max(0.03, c.h * 0.1);
        c.tO = c.shown ? 1 : 0.1;
        if (instant || paused) {
          c.mesh.scale.y = c.tS; c.mesh.material.opacity = c.tO;
        }
      });
      countEl.textContent = n + " OF " + ROWS.length + " PROGRAMS";
      if (paused) poke();
    }
    tools.querySelector(".f3d-q").addEventListener("input", function () {
      F.q = this.value.toLowerCase().trim(); applyFilters();
    });
    tools.querySelectorAll("select.f3d-f").forEach(function (sel) {
      sel.addEventListener("input", function () {
        F[sel.dataset.f] = sel.dataset.f === "match" ? +sel.value : sel.value;
        applyFilters();
      });
    });

    /* ═══ detail panels (click-through drill-downs with dated sources) ═══ */
    function dots(n) { return "●".repeat(n) + "○".repeat(5 - n); }
    function grantDetail(r) {
      return '<button type="button" class="f3d-close">✕ CLOSE</button>' +
        "<h4>" + esc(r.id) + " · " + esc(r.program) + "</h4>" +
        '<div class="f3d-grid">' +
          '<div><h5>Agency</h5><p>' + (r.url
            ? '<a class="src-link" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.agency) + " ↗</a>"
            : esc(r.agency)) + "</p></div>" +
          "<div><h5>Level · Type</h5><p>" + esc(r.level) + " · " + esc(r.type) + "</p></div>" +
          "<div><h5>Award size</h5><p>" + esc(r.award) + "</p></div>" +
          '<div><h5>Access</h5><p><span class="f3d-stbadge" style="background:' +
            (r.access === "Yes" ? "#2251ff" : "#42566a") + ';color:#fff">' + esc(AC_SHORT[r.access] || r.access) +
            "</span> " + esc(r.access) + "</p></div>" +
          '<div><h5>2026 status</h5><p><span class="f3d-stbadge" style="background:' +
            (ST_CSS[r.status] || "#42566a") + ';color:#fff">' + esc(r.status) + "</span></p></div>" +
          '<div><h5>HCSP match</h5><p><span class="f3d-match">' + dots(r.match) + "</span> " + r.match + " / 5</p></div>" +
          "<div><h5>HCSP fit</h5><p>" + esc(r.fit) + "</p></div>" +
          "<div><h5>Industry vertical</h5><p>" + esc(r.vertical) + "</p></div>" +
          '<div class="full"><h5>Deadline / cycle</h5><p>' + esc(r.deadline) + "</p></div>" +
          '<div class="full"><h5>Notes</h5><p>' + esc(r.notes) + "</p></div>" +
        "</div>" +
        '<div class="f3d-srcs"><b>Sources (dated):</b> ' + srcDated(r.src) +
          (r.url ? ' · <a class="f3d-progurl" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">Program page ↗</a>' : "") +
        "</div>";
    }
    function wallDetail(it) {
      var statusLine = it.closed ? "CLOSED — DEADLINE PASSED SEP 2026"
        : it.urgent ? "⚑ HARD DEADLINE — MISSING IT COSTS A FULL ANNUAL CYCLE"
        : it.kind === "cat" ? (it.cls === "demand" ? "REGULATION → MANDATORY BUYERS" : it.cls === "risk" ? "RISK / COMPETITION EVENT" : "POLICY MARKER")
        : it.cls === "hard" ? "HARD DEADLINE"
        : it.cls === "forming" ? "PROGRAM STILL FORMING — ENGAGE NOW" : "EXPECTED CYCLE";
      var badgeCol = it.closed ? "#c22f4e" : it.kind === "cat"
        ? (it.cls === "demand" ? "#008a6d" : it.cls === "risk" ? "#b07a10" : "#42566a")
        : it.cls === "hard" ? "#2251ff" : "#42566a";
      return '<button type="button" class="f3d-close">✕ CLOSE</button>' +
        "<h4>" + esc(String(it.date).toUpperCase()) + " · " + esc(it.label) + "</h4>" +
        '<div class="f3d-grid">' +
          '<div class="full"><h5>Status</h5><p><span class="f3d-stbadge" style="background:' + badgeCol + ';color:#fff">' +
            esc(statusLine) + "</span></p></div>" +
          '<div class="full"><h5>What it means for HCSP</h5><p>' + esc(it.mean || it.ev) + "</p></div>" +
          '<div class="full"><h5>What to do</h5><p>' +
            esc(it.act || "Track the cycle — application dates shift; verify the current grant notice at the agency page before applying.") +
            "</p></div>" +
        "</div>" +
        '<div class="f3d-srcs"><b>Sources (dated):</b> ' + srcDated(it.src) + "</div>";
    }
    function showDetail(html) {
      detail.innerHTML = html;
      detail.classList.add("show");
      detail.querySelector(".f3d-close").addEventListener("click", function () {
        detail.classList.remove("show"); selectCard(null); selectPlaque(null);
      });
      detail.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "nearest" });
    }

    /* ═══ picking (click = select; hover = tooltip + highlight) ═══ */
    var ray = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var hoverCard = null, selCard = null, selPlaque = null;
    function pickTargets() {
      if (view === "register") return cards.filter(function (c) { return c.shown; }).map(function (c) { return c.mesh; });
      return plaques.map(function (p) { return p.mesh; });
    }
    function pick(ev) {
      var r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      var hits = ray.intersectObjects(pickTargets(), false);
      return hits.length ? hits[0].object : null;
    }
    function selectCard(c) {
      if (selCard) selCard.mesh.material.emissive.setHex(0x000000);
      selCard = c;
      if (c) c.mesh.material.emissive.setHex(0x223a66);
      if (paused) poke();
    }
    function selectPlaque(p) {
      if (selPlaque) selPlaque.mesh.material.emissive.setHex(0x000000);
      selPlaque = p;
      if (p && p.mesh.material.emissive) p.mesh.material.emissive.setHex(0x223a66);
      if (paused) poke();
    }
    var downAt = null;
    renderer.domElement.addEventListener("pointerdown", function (e) { downAt = [e.clientX, e.clientY]; });
    renderer.domElement.addEventListener("pointerup", function (e) {
      if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) { downAt = null; return; }
      downAt = null;
      var m = pick(e);
      if (!m) return;
      if (view === "register") {
        var c = byId[m.userData.id];
        if (!c) return;
        selectPlaque(null);
        selectCard(c === selCard ? null : c);
        if (selCard) showDetail(grantDetail(selCard.rec)); else detail.classList.remove("show");
      } else {
        var p = plaques.filter(function (pp) { return pp.mesh === m; })[0];
        if (!p) return;
        selectCard(null);
        selectPlaque(p === selPlaque ? null : p);
        if (selPlaque) showDetail(wallDetail(selPlaque.it)); else detail.classList.remove("show");
      }
    });
    renderer.domElement.addEventListener("pointermove", function (e) {
      var m = pick(e);
      if (view === "register") {
        var c = m ? byId[m.userData.id] : null;
        if (hoverCard && hoverCard !== selCard) hoverCard.mesh.material.emissive.setHex(0x000000);
        hoverCard = c;
        if (c) {
          if (c !== selCard) c.mesh.material.emissive.setHex(0x1a2c4d);
          tip.innerHTML = '<span class="ft-id">' + esc(c.rec.id) + " · " + esc(c.rec.status) + "</span><br><b>" +
            esc(c.rec.program) + '</b><br><span class="ft-sub">' + esc(c.rec.agency.split("->")[0].trim()) +
            " · match " + c.rec.match + "/5 · click for the full record</span>";
          positionTip(e);
        } else tip.classList.remove("show");
        stage.style.cursor = c ? "pointer" : "";
      } else {
        var p = m ? plaques.filter(function (pp) { return pp.mesh === m; })[0] : null;
        if (p) {
          tip.innerHTML = '<span class="ft-id">' + esc(String(p.it.date).toUpperCase()) +
            (p.it.closed ? " · CLOSED" : "") + "</span><br><b>" + esc(p.it.label) +
            '</b><br><span class="ft-sub">click for what it means + what to do</span>';
          positionTip(e);
        } else tip.classList.remove("show");
        stage.style.cursor = p ? "pointer" : "";
      }
    });
    renderer.domElement.addEventListener("pointerleave", function () {
      tip.classList.remove("show");
      if (hoverCard && hoverCard !== selCard) hoverCard.mesh.material.emissive.setHex(0x000000);
      hoverCard = null;
    });
    function positionTip(e) {
      var r2 = stage.getBoundingClientRect();
      tip.classList.add("show");
      tip.style.left = Math.min(e.clientX - r2.left + 14, r2.width - 310) + "px";
      tip.style.top = Math.max(e.clientY - r2.top - 12, 8) + "px";
    }

    /* ═══ views, pause, orbit ═══ */
    var view = "register";
    var paused = false, orbitOn = true;
    var viewBtns = root.querySelectorAll("[data-view]");
    var pauseBtn = root.querySelector('[data-act="pause"]');
    var orbitBtn = root.querySelector('[data-act="orbit"]');

    function setView(v) {
      view = v;
      viewBtns.forEach(function (b) {
        var on = b.dataset.view === v;
        b.classList.toggle("on", on);
        b.setAttribute("aria-selected", String(on));
      });
      var isTable = v === "table";
      stage.style.display = isTable ? "none" : "";
      tools.style.display = v === "register" ? "" : "none";
      if (tableBlock) tableBlock.style.display = isTable ? "" : "none";
      if (isTable) {
        detail.classList.remove("show");
        if (tableBlock) tableBlock.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
        return; /* loop stops: table view draws no frames */
      }
      legend.innerHTML = LEGEND[v] || "";
      orbitBtn.style.display = v === "register" ? "" : "none";
      var cm = CAM[v];
      camera.position.copy(cm.pos);
      controls.target.copy(cm.tgt);
      controls.minDistance = cm.min; controls.maxDistance = cm.max;
      controls.minPolarAngle = cm.polarMin; controls.maxPolarAngle = cm.polarMax;
      controls.minAzimuthAngle = cm.azMin; controls.maxAzimuthAngle = cm.azMax;
      controls.autoRotate = cm.auto && orbitOn && !paused;
      controls.update();
      if (v === "wall") { fitWallCamera(); relayoutWall(); }
      detail.classList.remove("show"); selectCard(null); selectPlaque(null);
      tip.classList.remove("show");
      if (paused) poke(); else kick();
    }
    viewBtns.forEach(function (b) {
      b.addEventListener("click", function () { setView(b.dataset.view); });
    });

    function setPaused(p) {
      paused = p;
      controls.autoRotate = !p && orbitOn && CAM[view] && CAM[view].auto;
      controls.enableDamping = !p;
      pauseBtn.setAttribute("aria-pressed", String(p));
      pauseBtn.textContent = p ? "▶ Resume" : "⏸ Pause";
      if (!p) kick(); else poke();
    }
    pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    orbitBtn.addEventListener("click", function () {
      orbitOn = !orbitOn;
      controls.autoRotate = orbitOn && !paused && view === "register";
      orbitBtn.setAttribute("aria-pressed", String(orbitOn));
      orbitBtn.textContent = orbitOn ? "🔁 Auto-orbit: on" : "🔁 Auto-orbit: off";
      orbitBtn.style.display = view === "register" ? "" : "none";
    });

    /* ═══ sizing ═══ */
    function resize() {
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (view === "wall") { fitWallCamera(); relayoutWall(); }
      if (paused) poke();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
    window.addEventListener("resize", resize);

    /* ═══ animation loop — continuous motion; frozen in Reading Mode;
       paused offscreen (IntersectionObserver) and in table view ═══ */
    var raf = null, inView = false, simT = 0, last = 0, frames = 0, inFrame = false;
    function stepParticles(P, dt) {
      var pos = P.pos;
      for (var i = 0; i < P.spd.length; i++) {
        pos[i * 3 + 1] += P.spd[i] * dt;
        if (pos[i * 3 + 1] > P.h) pos[i * 3 + 1] = 0;
      }
      P.pts.geometry.attributes.position.needsUpdate = true;
    }
    function frame(now) {
      if (inFrame) return; /* re-entry guard: controls 'change' fires inside controls.update() */
      inFrame = true;
      frames++;
      var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      if (!paused) simT += dt;
      if (view === "register") {
        cards.forEach(function (c) {
          var m = c.mesh;
          if (Math.abs(m.scale.y - c.tS) > 0.005) {
            m.scale.y += (c.tS - m.scale.y) * (paused ? 1 : 0.12);
          }
          if (Math.abs(m.material.opacity - c.tO) > 0.01) {
            m.material.opacity += (c.tO - m.material.opacity) * (paused ? 1 : 0.15);
          }
        });
        if (!paused) stepParticles(regParticles, dt);
        controls.autoRotate = orbitOn && !paused;
      } else if (view === "wall") {
        var t = simT;
        wallGroup.rotation.y = Math.sin(t * 0.16) * 0.055;
        wallGroup.position.y = Math.sin(t * 0.4) * 0.05;
        nowG.position.x = nowX + Math.sin(t * 0.45) * 0.55;
        beamMat.opacity = 0.2 + 0.16 * Math.sin(t * 2.4);
        var rs = 1 + 0.25 * Math.sin(t * 2.4);
        ring.scale.set(rs, rs, 1);
        var span = WALL_X1 - WALL_X0 + 3;
        scan.position.x = WALL_X0 - 1.5 + ((t * 1.15) % span);
        scanMat.opacity = 0.07 + 0.05 * Math.sin(t * 2.4);
        for (var pi = 0; pi < plaques.length; pi++) {
          var pl = plaques[pi];
          pl.mesh.position.y = pl.baseY + Math.sin(t * 0.85 + pl.phase) * 0.045;
        }
        if (!paused) stepParticles(wallParticles, dt);
        controls.autoRotate = false;
      }
      controls.update();
      renderer.render(view === "wall" ? sceneWall : sceneReg, camera);
      updateChips();
      inFrame = false;
    }
    function loop(now) {
      raf = null;
      if (paused || !inView || view === "table") return;
      frame(now);
      raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && !paused && inView && view !== "table") raf = requestAnimationFrame(loop); }
    function poke() { /* single static frame with frozen simT */
      if (view === "table") return;
      frame(performance.now());
    }
    controls.addEventListener("change", function () { if (paused && inView && view !== "table") poke(); });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) { if (paused) poke(); else kick(); }
      }, { threshold: 0.05 }).observe(stage);
    } else { inView = true; }

    /* ═══ boot ═══ */
    if (tableBlock) tableBlock.style.display = "none"; // 3D explorer is the primary visual
    applyFilters(true);
    setView("register");
    measureChips();
    relayoutWall();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
      measureChips(); relayoutWall(); if (paused) poke();
    });
    resize();
    if (REDUCE) setPaused(true); else kick();
    /* grow-in for the field (instant in reading mode) */
    if (!REDUCE) cards.forEach(function (c) { c.mesh.scale.y = 0.02; });

    /* ── QA / integration hooks ── */
    function labelRects() {
      return chips.filter(function (c) { return c.view === view && c.el.style.display !== "none"; })
        .map(function (c) {
          var isTick = c.cls.indexOf("tick") !== -1;
          var top = isTick ? c.sy : c.sy - c.h;
          var bot = isTick ? c.sy + c.h : c.sy;
          return { text: c.el.textContent.slice(0, 24), x0: c.sx - c.w / 2, x1: c.sx + c.w / 2, y0: top, y1: bot };
        });
    }
    root.f3d = {
      setView: setView,
      setPaused: setPaused,
      search: function (q) {
        var inp = tools.querySelector(".f3d-q");
        inp.value = q; F.q = String(q).toLowerCase().trim(); applyFilters();
      },
      setFilter: function (k, v) {
        var sel = tools.querySelector('[data-f="' + k + '"]');
        if (sel) { sel.value = v; F[k] = k === "match" ? +v : v; applyFilters(); }
      },
      count: function () { return cards.filter(function (c) { return c.shown; }).length; },
      select: function (id) {
        var c = byId[id];
        if (c) { setView("register"); selectCard(c); showDetail(grantDetail(c.rec)); }
      },
      selectWall: function (i) {
        var p = plaques[i];
        if (p) { setView("wall"); selectPlaque(p); showDetail(wallDetail(p.it)); }
      },
      labelRects: labelRects,
      frames: function () { return frames; },
      view: function () { return view; },
      wallCount: plaques.length
    };
  }

  window.Fund3D = { render: render };

  /* ── self-boot: lazy vendor + render when #fund3d approaches the viewport ── */
  (function boot() {
    var host = document.getElementById("fund3d");
    if (!host) return;
    function start() {
      ensureVendor()
        .then(function () { render(host); window.dispatchEvent(new CustomEvent("hcsp3d:ready", { detail: "fund3d" })); })
        .catch(function (err) {
          console.warn(err);
          host.innerHTML = '<div class="f3d-nogl">The 3D library did not load — the full register is in the fast table below.</div>';
          var tb = document.getElementById("grant-table-block");
          if (tb) tb.style.display = "";
        });
    }
    if (!("IntersectionObserver" in window)) { start(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        start();
      });
    }, { threshold: 0, rootMargin: "450px 0px 450px 0px" });
    io.observe(host);
  })();
})();
