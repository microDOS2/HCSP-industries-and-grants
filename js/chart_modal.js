// ═══ Click-to-explore: full-screen chart modal (zoom/pan + explainer + table)
//     + "Walk me through it" guided overlays for the process diagrams ═══
// Registry: window.CXT = { table: {chartId: {cols, rows}}, walk: {chartId: {title, steps}} }
// Chart modules may add entries; this file provides central fallbacks from RPT.
(function () {
  const CXT = window.CXT = window.CXT || { table: {}, walk: {} };

  /* ────────────────────────────────────────────────────────────
     Central explainer + table builders (data from js/data.js)
  ──────────────────────────────────────────────────────────── */
  const usd = v => "$" + v;
  const EXPLAIN = {
    "league-chart": {
      take: "Fifteen industries ranked by overall fit, each with one plain sentence on why; the toggle re-ranks them by what existing cleanup suppliers charge per gallon.",
      axes: "A plain ranked list, not a bar chart: rank, industry, score out of 10, and the reason. Earn-back time is not calculated yet — the manufacturer's cost model is not set.",
      table: () => ({ cols: ["Rank", "Industry", "Score /10", "Fit", "Why"],
        rows: RPT.league.map(d => ["#" + d.rank, d.name, String(d.score), (RPT.league_fit || {})[d.tier] || "", d.plain || d.why]) }),
    },
    "energy-chart": {
      take: "Grid power price swings the value of the startup/auxiliary draw and of exported energy 5× across regions — but operating energy itself is negligible per the manufacturer (self-fueling loop).",
      axes: "Bars are regional grid-price context in $/m³-equivalent (75–95 kW spec × regional power price). The dashed blue line is the recovered-water value (~$3.5/m³) — the red band is the gap water sales cannot close.",
      table: () => ({ cols: ["Region", "$/m³-equiv (lo–hi)", "Attractiveness score", "Note"],
        rows: RPT.energy_floor.map(d => [d.region, `$${d.lo}–${d.hi}`, d.idx ? d.idx + "/25" : "—", d.note]) }),
    },
    "umbrella-chart": {
      take: "What existing suppliers charge for destruction and disposal runs $1–2/gal to $15–50+/gal — all public market data; HCSP's own cost and pricing are TBD until the manufacturer publishes a cost model.",
      axes: "Log-scale $/gal bands. Ink bands are existing supplier pathways; blue hatched bands are HCSP — deliberately empty (TBD). The red marker is the $28/gal Michigan firefighting-foam panic-buying ceiling.",
      table: () => ({ cols: ["Pathway", "$/gal", "Basis"],
        rows: RPT.umbrella.map(d => [d.name, d.tbd ? "TBD — manufacturer cost model pending" : `$${d.lo}–${d.hi}${d.hi >= 50 ? "+" : ""}`, d.note]) }),
    },
    "payback-chart": {
      take: "Destruction-priced baselines leave the widest room for savings before our costs are known; disposal-priced baselines depend on compulsion or crisis. Earn-back time in years is not stated anywhere — the manufacturer cost model is not set.",
      axes: "Each row is an industry; the chip states the shared status (time to earn back the cost: pending) and the text gives the displaced existing-supplier baseline. Blue rows are destruction-priced, ink rows disposal-priced.",
      table: () => ({ cols: ["Industry", "Displaced existing supplier baseline", "Baseline type"],
        rows: RPT.payback.map(d => [d.name, d.basis, d.kind]) }),
    },
    "savings-chart": {
      take: "Ranked by what existing suppliers charge per gallon to clean up each stream, halogenated solvents and defense firefighting foam lead; PFAS concentrates are top-3 under both this lens and the composite score.",
      axes: "Bars are what existing suppliers charge to clean it up per gallon on a log axis (toggle $/m³ or a linear axis on the chart). Dashed outline = low-confidence data; the blue note is the HCSP reference — no $/gal attached.",
    },
    // "evidence-chart" intentionally removed: the flat skid diagram is gone —
    // §0 now carries the interactive 3D skid explorer with a DOM spec table.
    "mechanism-chart": {
      take: "The whole machine runs at ordinary atmospheric pressure: boil the water off the waste, burn the concentrated residues and gases at high heat, condense the steam back to pure water — with the self-fueling hydrogen loop supplying the process heat.",
      axes: "Four stages left→right (try the walkthrough); the dashed blue box is the self-fueling H₂ loop; nothing on the chart is pressurized.",
    },
    "sizing-chart": {
      take: "The reachable market in dollars: each core industry's pool drawn as its documented low–high $B range — consolidated reachable demand ≈ $9–20B/yr across fifteen industries.",
      axes: "X axis is market size in $B. Each bar spans the documented low–high range (solid = low case, light = upside to the high case); the big label restates the range in its source units. Bases differ per industry — one-time equipment pools vs per-year markets; the basis note sits under each industry name.",
      table: () => ({ cols: ["Industry", "Market size $B", "Machine-equivalents", "Basis"],
        rows: RPT.sizing.map(d => [d.name, d.sam,
          d.mod_lo === d.mod_hi ? "≈" + d.mod_lo.toLocaleString("en-US") : d.mod_lo.toLocaleString("en-US") + "–" + d.mod_hi.toLocaleString("en-US"),
          d.basis + " · " + d.note]) }),
    },
    "scale-chart": {
      take: "Scale fixes energy first — net demand collapses from 130–250 to 35–88 kWh/m³ across four rungs — while cost stays withheld (manufacturer cost model pending), and nothing above 306 t/d has ever operated.",
      axes: "Log capacity axis (m³/day — toggle gallons/day on the chart). Top panel: net energy band per rung. Bottom panel: deliberately hatched TBD — no $/m³ is attached to HCSP.",
      table: () => ({ cols: ["Rung", "Capacity", "Net energy kWh/m³", "Cost", "Note"],
        rows: RPT.scale_ladder.map(d => [d.name, d.m3d.toLocaleString("en-US") + " m³/day (" + Math.round(d.m3d * 264.172).toLocaleString("en-US") + " gal/day)", `${d.kwh[0]}–${d.kwh[1]}`, "TBD — manufacturer cost model pending", d.note]) }),
    },
    "crossover-chart": {
      take: "Net-zero sits near ~35–40 g/L COD with a power cycle; from ~60 g/L the plant exports electricity — feed strength, not scale, decides which industries pay.",
      axes: "X = feed strength (COD, g/L — how much organic waste is in the water), Y = net electricity kWh/m³ (positive = imported, negative = exported). The blue line is the US national-lab hub model with steam power recovery; the dashed band is a 10 m³/day module without a power cycle; the rail lists measured stream strengths.",
      table: () => ({ cols: ["Stream", "COD g/L", "Position vs. the self-powering point", "Note"],
        rows: RPT.crossover.streams.map(s => [s.name, s.cod[0] === s.cod[1] ? String(s.cod[0]) : s.cod[0] + "–" + s.cod[1], s.side === "above" ? "Above (exports)" : "Below (rejected)", s.note]) }),
    },
    "heat-chart": {
      take: "60% of the 16.1 MW of reaction heat never leaves the plant — it preheats the feed. The 9.6 MW surplus cascades into 1.4 MW of power and 4.9 MW of cooling, worth ≈$1.15M/yr when run correctly.",
      axes: "Flow width is proportional to MW of heat. Nodes left→right: gross reaction heat → exportable surplus → extraction turbine → power and cooling outputs. Bottom panel: what one megawatt-hour of surplus heat is worth in each form.",
      table: () => ({ cols: ["Quantity", "Value", "Reading"],
        rows: [
          ["Gross reaction heat", RPT.trigen.gross + " MW of heat", "13.88 kJ per gram of COD at 1,000 m³/day, 100 g/L"],
          ["Internal preheat duty", RPT.trigen.preheat + " MW of heat", "The price of a process that makes its own heat from the waste (~60% of gross)"],
          ["Exportable surplus", RPT.trigen.surplus + " MW of heat", "Range " + RPT.trigen.surplus_range.join("–") + " across 70–85% recovery"],
          ["Power output", RPT.trigen.power + " MW of electricity", "Extraction turbine takes the hottest slice"],
          ["Cooling output", RPT.trigen.cooling + " MW of cooling", "≈1,392 refrigeration tons via a heat-powered ammonia chiller (0.6 units of cooling per unit of heat)"],
          ["Recovered water", RPT.trigen.water, "Distilled byproduct"],
          ["Cascade value", RPT.trigen.value, "vs " + RPT.trigen.value_cooling_only + " all-cooling — " + RPT.trigen.basis],
        ].concat(RPT.trigen.hierarchy.map(h => ["Value of 1 megawatt-hour of heat as " + h.form, h.val + " /" + h.per, h.note])) }),
    },
    // "verdict-chart" intentionally has no entry: it is a DOM decision board
    // (no SVG), so the explorer never opens for it.
    // "horizon-chart" intentionally has no entry: it is now a DOM vertical
    // timeline (no SVG), so the explorer never opens for it.
    "destiny-chart": {
      take: "Forty years of commercial SCWO: a long record of failed or exited ventures for context, four verifiable survivors as the evidence — try the walkthrough for the guided version.",
      axes: "Each line is an entity's lifespan (dashed span = graded date estimate); ✕ marks an exit; hairline ribbons flow to outcome plaques (deal sizes undisclosed).",
    },
    "vendor-chart": {
      take: "Five operators on a shared TRL (how proven the technology is) axis — the four verifiable incumbents plus HCSP as briefed — throughput classes are different bases, shown for class and never divided into each other.",
      axes: "Each panel: scale class, readiness (TRL) range on the 1–9 axis, energy posture, cost benchmark, and the key constraint.",
      table: () => ({ cols: ["Vendor", "Scale", "TRL (readiness, 1–9)", "Energy", "Cost benchmark", "Key constraint"],
        rows: RPT.vendors.map(v => [v.name, v.scale, `${v.trl[0]}–${v.trl[1]}`, v.energy, v.cost, v.constraint]) }),
    },
    "scalegap-chart": {
      take: "Below ≈$1M there is no competitor product to buy and no service door to walk through — that unshaded zone is HCSP's opening.",
      axes: "X = deal size ($M, log). Solid bars = equipment a customer can buy; dashed/hollow = services and pilots, not sold units; the blue zone marks deals no competitor serves.",
      table: () => ({ cols: ["Player", "Offer type", "Span", "Caption"],
        rows: RPT.scalegap.lanes.map(l => [l.name, l.kind, `$${l.bar.from}M–$${l.bar.to}M`, l.bar.lab + (l.ghost ? " · pilot-only: " + l.ghost.lab : "")]) }),
    },
    "access-chart": {
      take: "Pursuit effort splits 40/35/25 across hosted utility applications, direct applications, and settlement-adjacent channels — and the Orlando chain shows how a grant converts to service revenue.",
      axes: "Lane width = share of pursuit effort (%). The lower band is the Orlando template; node area is proportional to dollars.",
      table: () => ({ cols: ["Mode", "Effort", "Channel", "Gist"],
        rows: RPT.access_modes.map(m => [m.mode, m.effort + "%", m.name, m.gist]) }),
    },
    // "fundwall-chart" intentionally removed: the old SVG wall chart is gone —
    // §10 deadlines are now a DOM timeline (#deadline-timeline), so the
    // explorer never opens for it.
  };

  /* ────────────────────────────────────────────────────────────
     Modal
  ──────────────────────────────────────────────────────────── */
  const overlay = document.createElement("div");
  overlay.className = "cxm-overlay"; overlay.hidden = true;
  overlay.innerHTML = `
    <div class="cxm-box" role="dialog" aria-modal="true" aria-label="Chart explorer">
      <div class="cxm-toolbar">
        <span class="cxm-title"></span>
        <span class="cxm-spacer"></span>
        <button type="button" class="cxm-btn" data-z="out" aria-label="Zoom out">−</button>
        <button type="button" class="cxm-btn" data-z="in" aria-label="Zoom in">+</button>
        <button type="button" class="cxm-btn" data-z="reset">RESET</button>
        <button type="button" class="cxm-btn cxm-table-btn">VIEW AS TABLE</button>
        <button type="button" class="cxm-btn cxm-close">✕ CLOSE</button>
      </div>
      <div class="cxm-main">
        <div class="cxm-stage"><div class="cxm-zoom"></div></div>
        <aside class="cxm-side"></aside>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const stage = overlay.querySelector(".cxm-stage");
  const zoomBox = overlay.querySelector(".cxm-zoom");
  const side = overlay.querySelector(".cxm-side");
  let zoom = 2.2, baseW = 880, tableOn = false, openId = null;

  function applyZoom() {
    zoomBox.style.width = Math.round(baseW * zoom) + "px";
  }
  overlay.querySelectorAll("[data-z]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.z === "in") zoom = Math.min(4, zoom * 1.25);
    else if (b.dataset.z === "out") zoom = Math.max(1.2, zoom / 1.25);
    else zoom = 2.2;
    applyZoom();
  }));
  // drag-to-pan on the scroll stage
  let drag = null;
  stage.addEventListener("pointerdown", e => {
    drag = { x: e.clientX, y: e.clientY, sl: stage.scrollLeft, st: stage.scrollTop };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", e => {
    if (!drag) return;
    stage.scrollLeft = drag.sl - (e.clientX - drag.x);
    stage.scrollTop = drag.st - (e.clientY - drag.y);
  });
  ["pointerup", "pointercancel"].forEach(ev => stage.addEventListener(ev, () => { drag = null; }));

  function renderSide(id, host) {
    const ex = EXPLAIN[id] || {};
    const title = host.querySelector(".chart-title")?.textContent || "Chart";
    const sub = host.querySelector(".chart-sub")?.textContent || "";
    const src = host.querySelector(".chart-src")?.innerHTML || "";
    if (tableOn) {
      const t = (CXT.table[id]) || (ex.table && ex.table());
      if (!t) { side.innerHTML = `<p class="cxm-take"><b>No tabular dataset.</b> This figure is illustrative; its values are in the explainer.</p>`; return; }
      side.innerHTML = `<p class="cxm-side-h">UNDERLYING DATA</p>
        <div class="cxm-table-wrap"><table class="dt cxm-dt"><thead><tr>${t.cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>
        <tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        <p class="cxm-src">${src}</p>`;
      return;
    }
    side.innerHTML = `
      <p class="cxm-side-h">TAKEAWAY</p>
      <p class="cxm-take">${ex.take || title}</p>
      <p class="cxm-side-h">HOW TO READ IT</p>
      <p class="cxm-axes">${ex.axes || sub}</p>
      <p class="cxm-side-h">SOURCE BASIS</p>
      <p class="cxm-src">${src}</p>
      <p class="cxm-hint">Drag the chart to pan · +/− to zoom · every data point's drill-down is available on the live chart behind this panel.</p>`;
  }

  function openModal(id, host) {
    const svgEl = host.querySelector("svg");
    if (!svgEl) return;
    openId = id; tableOn = false;
    overlay.querySelector(".cxm-table-btn").textContent = "VIEW AS TABLE";
    overlay.querySelector(".cxm-title").textContent = (host.querySelector(".chart-title")?.textContent || "CHART").toUpperCase();
    zoomBox.innerHTML = "";
    const clone = svgEl.cloneNode(true);
    clone.style.width = "100%"; clone.style.height = "auto";
    zoomBox.appendChild(clone);
    const vb = (svgEl.getAttribute("viewBox") || "0 0 880 500").split(/\s+/);
    baseW = +vb[2] || 880; zoom = 2.2; applyZoom();
    renderSide(id, host);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    U.hideDrill();
  }
  function closeModal() {
    overlay.hidden = true; openId = null;
    document.body.style.overflow = "";
  }
  overlay.querySelector(".cxm-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) closeModal(); });
  overlay.querySelector(".cxm-table-btn").addEventListener("click", () => {
    tableOn = !tableOn;
    overlay.querySelector(".cxm-table-btn").textContent = tableOn ? "VIEW EXPLAINER" : "VIEW AS TABLE";
    const host = document.getElementById(openId);
    if (host) renderSide(openId, host);
  });

  /* ────────────────────────────────────────────────────────────
     Walkthroughs
  ──────────────────────────────────────────────────────────── */
  function forceFinal(svgSel) {
    svgSel.selectAll("*").style("opacity", 1);
    svgSel.selectAll("line[data-x1]").attr("x2", function () { return d3.select(this).attr("data-x1"); });
    svgSel.selectAll("path").each(function () {
      const p = d3.select(this);
      if (p.attr("stroke-dashoffset") && +p.attr("stroke-dashoffset") !== 0) {
        p.attr("stroke-dashoffset", 0).attr("stroke-dasharray", null);
      }
    });
  }

  function startWalk(id, host, cfg) {
    if (host.querySelector(".walk-bar")) return;
    const svgSel = d3.select(host.querySelector("svg"));
    forceFinal(svgSel);
    const top = Array.from(host.querySelector("svg").childNodes).filter(n => n.nodeType === 1);
    let step = -1;
    const bar = document.createElement("div");
    bar.className = "walk-bar";
    bar.innerHTML = `
      <div class="walk-head"><span class="walk-title">${cfg.title}</span><span class="walk-prog"></span></div>
      <p class="walk-cap"></p>
      <div class="walk-ctl">
        <button type="button" data-w="prev">← PREV</button>
        <button type="button" data-w="next">NEXT →</button>
        <button type="button" data-w="done">DONE ✕</button>
      </div>`;
    host.appendChild(bar);
    host.classList.add("walking");
    const ring = svgSel.append("rect").attr("class", "walk-ring").style("display", "none");
    function elsOf(s) { return (s.els || [s.el]).filter(Boolean); }
    function show(i) {
      step = U.clamp(i, 0, cfg.steps.length - 1);
      const s = cfg.steps[step];
      top.forEach(n => { n.style.opacity = 0.16; });
      elsOf(s).forEach(sel => {
        let node = sel.node();
        while (node && node.parentNode && node.parentNode.tagName !== "svg") node = node.parentNode;
        if (node) node.style.opacity = 1;
      });
      // spotlight ring around the union bbox of the highlighted elements
      try {
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        elsOf(s).forEach(sel => {
          const b = sel.node().getBBox();
          x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y);
          x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
        });
        ring.attr("x", x0 - 10).attr("y", y0 - 10).attr("width", x1 - x0 + 20).attr("height", y1 - y0 + 20).style("display", null);
        ring.node().parentNode.style.opacity = 1;
      } catch (e) { ring.style("display", "none"); }
      bar.querySelector(".walk-cap").textContent = s.cap;
      bar.querySelector(".walk-prog").textContent = "STEP " + (step + 1) + " / " + cfg.steps.length + " · " + s.label;
      bar.querySelector('[data-w="prev"]').disabled = step === 0;
      bar.querySelector('[data-w="next"]').disabled = step === cfg.steps.length - 1;
    }
    function end() {
      top.forEach(n => { n.style.opacity = ""; });
      ring.remove(); bar.remove();
      host.classList.remove("walking");
    }
    bar.querySelector('[data-w="prev"]').addEventListener("click", () => show(step - 1));
    bar.querySelector('[data-w="next"]').addEventListener("click", () => show(step + 1));
    bar.querySelector('[data-w="done"]').addEventListener("click", end);
    show(0);
  }

  /* ────────────────────────────────────────────────────────────
     Wire every chart frame: EXPLORE affordance + frame click + walk button
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll(".chart-frame").forEach(host => {
    if (!host.querySelector("svg")) return;
    const id = host.id;
    const tools = document.createElement("div");
    tools.className = "chart-tools";
    const exBtn = document.createElement("button");
    exBtn.type = "button"; exBtn.className = "explore-btn";
    exBtn.textContent = "EXPLORE CHART ⤢";
    exBtn.addEventListener("click", e => { e.stopPropagation(); openModal(id, host); });
    tools.appendChild(exBtn);
    if (CXT.walk[id]) {
      const wBtn = document.createElement("button");
      wBtn.type = "button"; wBtn.className = "walk-btn";
      wBtn.textContent = "WALK ME THROUGH IT";
      wBtn.addEventListener("click", e => { e.stopPropagation(); startWalk(id, host, CXT.walk[id]); });
      tools.appendChild(wBtn);
    }
    host.appendChild(tools);
    // single click on the chart frame background → modal (data points keep drill-downs)
    host.addEventListener("click", e => {
      if (e.target.closest("[data-drill-keep]") || e.target.closest(".chart-tools")
        || e.target.closest(".walk-bar") || e.target.closest(".unit-toggle")) return;
      openModal(id, host);
    });
  });
})();
