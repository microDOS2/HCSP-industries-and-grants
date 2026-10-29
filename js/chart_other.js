/* ═══ Chart Lab · chart_other.js ═══
   Competitor & funding visuals: destiny flow, scale-gap, deadline calendar,
   energy scenarios + materials recovery.
   Self-contained IIFE → window.ChartOther = { render(hostEl, opts) }.
   Requires (loaded before this file): js/data.js (window.RPT),
   js/sources.js (window.SRCS), vendor/echarts.min.js (window.echarts, optional
   for the scale-gap panel only). Styles: css/other.css (.ot-*). */
window.ChartOther = (() => {
  "use strict";

  const REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const RPT = () => window.RPT || {};
  const $ = (sel, root) => (root || document).querySelector(sel);

  /* ── tiny DOM helper ── */
  function h(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  /* ── sources: K-number → entry, chip renderer ── */
  let srcIdx = null;
  function srcEntry(k) {
    if (!srcIdx) {
      srcIdx = {};
      (Array.isArray(window.SRCS) ? window.SRCS : []).forEach(s => { if (s && s.k) srcIdx[s.k] = s; });
    }
    return srcIdx[k] || null;
  }
  function srcChips(keys) {
    const wrap = h("div", "ot-srcs");
    wrap.appendChild(h("span", "ot-srcs-lab", "Sources"));
    (keys || []).forEach(k => {
      const e = srcEntry(k);
      const tipTxt = e ? `${e.cite || ""}${e.date ? " · " + e.date : ""}${e.ref ? " · ref " + e.ref : ""}` : k;
      let chip;
      if (e && e.url) {
        chip = h("a", "ot-src", k);
        chip.href = e.url;
        chip.target = "_blank";
        chip.rel = "noopener noreferrer";
      } else {
        chip = h("span", "ot-src ot-src-na", k);
      }
      chip.title = tipTxt;
      bindTip(chip, { title: k + (e && e.date ? " · " + e.date : ""), sub: (e && e.cite) || "Source anchor" });
      wrap.appendChild(chip);
    });
    return wrap;
  }

  /* ── hover tooltip (singleton, clamped to viewport) ── */
  let tipEl = null;
  function ensureTip() {
    if (!tipEl) {
      tipEl = h("div", "ot-tip");
      tipEl.setAttribute("role", "tooltip");
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }
  function showTip(d, x, y) {
    const t = ensureTip();
    t.innerHTML = "";
    if (d.title) t.appendChild(h("div", "ot-tip-t", d.title));
    if (d.sub) t.appendChild(h("div", "ot-tip-s", d.sub));
    t.classList.add("ot-on");
    const pad = 12;
    const r = t.getBoundingClientRect();
    let left = x + 14, top = y + 14;
    if (left + r.width + pad > window.innerWidth) left = x - r.width - 14;
    if (top + r.height + pad > window.innerHeight) top = y - r.height - 14;
    t.style.left = Math.max(pad, left) + "px";
    t.style.top = Math.max(pad, top) + "px";
  }
  function hideTip() { if (tipEl) tipEl.classList.remove("ot-on"); }
  function bindTip(el, dataFn) {
    el.addEventListener("mouseenter", ev => {
      const d = typeof dataFn === "function" ? dataFn() : dataFn;
      if (d) showTip(d, ev.clientX, ev.clientY);
    });
    el.addEventListener("mousemove", ev => {
      const d = typeof dataFn === "function" ? dataFn() : dataFn;
      if (d) showTip(d, ev.clientX, ev.clientY);
    });
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("focus", () => {
      const d = typeof dataFn === "function" ? dataFn() : dataFn;
      if (!d) return;
      const r = el.getBoundingClientRect();
      showTip(d, r.left + r.width / 2, r.top);
    });
    el.addEventListener("blur", hideTip);
  }

  /* ── side drawer (singleton) ── */
  let drawer = null, backdrop = null;
  function ensureDrawer() {
    if (drawer) return;
    backdrop = h("div", "ot-backdrop");
    drawer = h("aside", "ot-drawer");
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-label", "Detail panel");
    const hd = h("div", "ot-drawer-hd");
    hd.appendChild(h("p", "ot-dt-title", "Detail"));
    const x = h("button", "ot-drawer-x", "✕");
    x.setAttribute("aria-label", "Close detail panel");
    x.addEventListener("click", closeDrawer);
    hd.appendChild(x);
    drawer.appendChild(hd);
    drawer.appendChild(h("div", "ot-drawer-bd"));
    backdrop.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", ev => { if (ev.key === "Escape") closeDrawer(); });
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
  }
  function openDrawer(detail) {
    ensureDrawer();
    const bd = $(".ot-drawer-bd", drawer);
    bd.innerHTML = "";
    bd.appendChild(renderDetail(detail));
    requestAnimationFrame(() => { backdrop.classList.add("ot-on"); drawer.classList.add("ot-on"); });
  }
  function closeDrawer() {
    if (!drawer) return;
    backdrop.classList.remove("ot-on");
    drawer.classList.remove("ot-on");
  }

  /* ── detail model → DOM (shared by drawer + expand-below) ──
     detail = { kicker, name, badges:[{cls,label}], sections:[{h, text|list|node}], note, srcs } */
  function renderDetail(d) {
    const box = h("div", "ot-dt");
    if (d.kicker) box.appendChild(h("p", "ot-dt-title", d.kicker));
    box.appendChild(h("h3", "ot-dt-name", d.name || "Detail"));
    if (d.badges && d.badges.length) {
      const br = h("div");
      d.badges.forEach(b => { br.appendChild(h("span", "ot-badge " + (b.cls || ""), b.label)); br.appendChild(document.createTextNode(" ")); });
      box.appendChild(br);
    }
    (d.sections || []).forEach(s => {
      const sec = h("div", "ot-dt-sec");
      if (s.h) sec.appendChild(h("h5", null, s.h));
      if (s.text) sec.appendChild(h("p", null, s.text));
      if (s.list) {
        const ul = h("ul");
        s.list.forEach(li => ul.appendChild(h("li", null, li)));
        sec.appendChild(ul);
      }
      if (s.node) sec.appendChild(s.node);
      box.appendChild(sec);
    });
    if (d.note) box.appendChild(h("p", "ot-dt-note", d.note));
    if (d.srcs && d.srcs.length) box.appendChild(srcChips(d.srcs));
    return box;
  }

  /* ── expand-below region (one per panel) ── */
  function makeBelow(panel) {
    const below = h("div", "ot-below");
    below.hidden = true;
    panel.appendChild(below);
    return below;
  }
  function showBelow(below, detail) {
    below.innerHTML = "";
    const x = h("button", "ot-drawer-x", "✕");
    x.setAttribute("aria-label", "Close detail");
    x.addEventListener("click", () => { below.hidden = true; });
    below.appendChild(x);
    below.appendChild(renderDetail(detail));
    below.hidden = false;
  }

  /* ── panel shell with plain-English head ── */
  function panelShell({ id, kicker, title, howto }) {
    const panel = h("section", "ot-panel");
    panel.id = "ot-panel-" + id;
    const head = h("div", "ot-panel-head");
    const txt = h("div", "ot-panel-headtxt");
    txt.appendChild(h("p", "ot-kicker", kicker));
    txt.appendChild(h("h2", "ot-title", title));
    const hw = h("p", "ot-howto");
    hw.innerHTML = howto; // module-authored copy only
    txt.appendChild(hw);
    head.appendChild(txt);
    const controls = h("div", "ot-controls");
    head.appendChild(controls);
    panel.appendChild(head);
    const body = h("div", "ot-panel-body");
    panel.appendChild(body);
    return { panel, body, controls };
  }

  /* ── chart/table view toggle ── */
  function addViewToggle(ctx, chartWrap, tableWrap) {
    const seg = h("div", "ot-seg");
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Switch between chart and table view");
    const bC = h("button", null, "Chart");
    const bT = h("button", null, "Table");
    bC.setAttribute("aria-pressed", "true");
    bT.setAttribute("aria-pressed", "false");
    const set = chart => {
      chartWrap.hidden = !chart;
      tableWrap.hidden = chart;
      bC.setAttribute("aria-pressed", String(chart));
      bT.setAttribute("aria-pressed", String(!chart));
      if (chart && ctx.onChartShown) ctx.onChartShown();
    };
    bC.addEventListener("click", () => set(true));
    bT.addEventListener("click", () => set(false));
    seg.appendChild(bC); seg.appendChild(bT);
    tableWrap.hidden = true;
    return seg;
  }

  /* ── sortable table ──
     cols: [{ key, label, sort:(row)=>any, render:(row)=>string|Node }] */
  function makeSortableTable(cols, rows, onRow) {
    const wrap = h("div", "ot-tablewrap");
    const table = h("table", "ot-table");
    const thead = h("thead");
    const hr = h("tr");
    let sortKey = null, sortDir = 1;
    const tbody = h("tbody");

    function paintBody() {
      tbody.innerHTML = "";
      let rs = rows.slice();
      if (sortKey) {
        const col = cols.find(c => c.key === sortKey);
        rs.sort((a, b) => {
          const va = col.sort ? col.sort(a) : a[sortKey];
          const vb = col.sort ? col.sort(b) : b[sortKey];
          const cmp = (typeof va === "number" && typeof vb === "number")
            ? va - vb
            : String(va == null ? "" : va).localeCompare(String(vb == null ? "" : vb));
          return cmp * sortDir;
        });
      }
      rs.forEach(row => {
        const tr = h("tr");
        cols.forEach(c => {
          const td = h("td");
          const v = c.render ? c.render(row) : row[c.key];
          if (v instanceof Node) td.appendChild(v); else td.textContent = v == null ? "—" : v;
          tr.appendChild(td);
        });
        if (onRow) {
          tr.tabIndex = 0;
          tr.addEventListener("click", () => {
            tbody.querySelectorAll("tr").forEach(x => x.classList.remove("ot-sel"));
            tr.classList.add("ot-sel");
            onRow(row, tr);
          });
          tr.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); tr.click(); } });
        }
        tbody.appendChild(tr);
      });
    }

    cols.forEach(c => {
      const th = h("th", null, c.label);
      th.scope = "col";
      th.title = "Click to sort";
      th.addEventListener("click", () => {
        if (sortKey === c.key) sortDir *= -1; else { sortKey = c.key; sortDir = 1; }
        hr.querySelectorAll("th .ot-arrow").forEach(a => a.remove());
        th.appendChild(h("span", "ot-arrow", sortDir > 0 ? "▲" : "▼"));
        paintBody();
      });
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    table.appendChild(tbody);
    wrap.appendChild(table);
    paintBody();
    return wrap;
  }

  function fmtMoneyM(v) { // value in $M
    if (v == null) return "—";
    if (v < 1) return "$" + Math.round(v * 1000) + "K";
    return "$" + (v >= 10 ? Math.round(v) : +v.toFixed(1)) + "M";
  }

  const echartsPool = [];
  function bindResize() {
    let t = null;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(() => echartsPool.forEach(c => { try { c.resize(); } catch (e) { /* disposed */ } }), 120);
    });
  }

  /* ════════════ PANEL 1 · Destiny flow ════════════ */
  const FATE = {
    dead:     { cls: "ot-tl-f-dead",     badge: "ot-b-dead",     label: "Failed / closed" },
    sold:     { cls: "ot-tl-f-sold",     badge: "ot-b-sold",     label: "Technology sold" },
    operating:{ cls: "ot-tl-f-operating",badge: "ot-b-operating",label: "Still operating" },
    licensed: { cls: "ot-tl-f-licensed", badge: "ot-b-licensed", label: "Licensed on" },
  };
  const COHORT_ORDER = ["Failed or exited", "Operating field"];
  const TL_MIN = 1980, TL_MAX = 2026, TL_NOW = 2025;

  function destinyDetail(p) {
    const fate = FATE[p.outcome] || FATE.dead;
    return {
      kicker: "Commercial SCWO fate",
      name: p.name,
      badges: [{ cls: fate.badge, label: fate.label }, { cls: "", label: p.cohort }],
      sections: [
        { h: "Fate", text: `${p.out} · active ${p.from}–${p.to}.` },
        { h: "What happened — and the one-line lesson", text: p.note },
      ],
      srcs: p.src,
    };
  }

  function buildDestiny(root) {
    const players = (RPT().players || []).slice();
    const { panel, body, controls } = panelShell({
      id: "destiny",
      kicker: "Who survived · who failed",
      title: "Forty years of commercial SCWO: most attempts died, a few are still standing",
      howto: "How to read this: each bar is one company's commercial supercritical-water attempt, drawn from its first year to its last. " +
        "<b>Red</b> bars ended in failure or closure, <b>amber</b> means the technology was sold off, " +
        "<b>green</b> and <b>blue</b> are still in the field today. Hover a bar for the short version; click it for the full story and sources.",
    });
    if (!players.length) { body.appendChild(h("p", "ot-empty", "No competitor history data (RPT.players) was found.")); root.appendChild(panel); return; }

    /* legend */
    const legend = h("div", "ot-legend");
    Object.keys(FATE).forEach(k => {
      const s = h("span");
      const key = h("i", "ot-key " + FATE[k].cls);
      key.style.display = "inline-block";
      s.appendChild(key); s.appendChild(document.createTextNode(FATE[k].label));
      legend.appendChild(s);
    });
    body.appendChild(legend);

    /* chart view */
    const chartWrap = h("div", "ot-tl");
    const span = TL_MAX - TL_MIN;
    const pct = y => ((y - TL_MIN) / span) * 100;

    const axis = h("div", "ot-tl-axis");
    for (let y = TL_MIN; y <= TL_MAX; y += 10) {
      const tick = h("span", "ot-tl-tick", String(y));
      tick.style.left = pct(y) + "%";
      axis.appendChild(tick);
    }
    chartWrap.appendChild(axis);

    const barsByPlayer = new Map();
    COHORT_ORDER.forEach(cohort => {
      const group = players.filter(p => p.cohort === cohort);
      if (!group.length) return;
      chartWrap.appendChild(h("p", "ot-tl-group", cohort + " (" + group.length + ")"));
      group.forEach(p => {
        const row = h("div", "ot-tl-row");
        row.appendChild(h("div", "ot-tl-name", p.name));
        const track = h("div", "ot-tl-track");
        const fate = FATE[p.outcome] || FATE.dead;
        const bar = h("div", "ot-tl-bar " + fate.cls);
        bar.style.left = pct(p.from) + "%";
        bar.style.width = Math.max(1.2, pct(p.to) - pct(p.from)) + "%";
        bar.setAttribute("role", "button");
        bar.tabIndex = 0;
        bar.setAttribute("aria-label", `${p.name}: ${p.out}, ${p.from} to ${p.to}. Activate for detail.`);
        const years = `${p.from}–${String(p.to).slice(2)}`;
        bar.appendChild(h("span", "ot-tl-inlab", years));
        bindTip(bar, () => ({ title: `${p.name} · ${p.from}–${p.to}`, sub: `${p.out} — ${p.note}` }));
        const select = () => {
          barsByPlayer.forEach(b => b.classList.remove("ot-sel"));
          bar.classList.add("ot-sel");
          const d = destinyDetail(p);
          showBelow(below, d);
          openDrawer(d);
        };
        bar.addEventListener("click", select);
        bar.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select(); } });
        barsByPlayer.set(p, bar);
        track.appendChild(bar);
        /* outcome label right of the bar where it fits, else left of it */
        const outLab = h("span", "ot-tl-outlab", p.out);
        const endPct = pct(p.to);
        if (endPct < 78) outLab.style.left = "calc(" + endPct + "% + 8px)";
        else { outLab.style.right = "calc(" + (100 - pct(p.from)) + "% + 8px)"; }
        track.appendChild(outLab);
        /* "now" marker once per row is noise — added on the axis rows instead */
        row.appendChild(track);
        chartWrap.appendChild(row);
      });
    });
    /* dashed "now" marker row directly under the axis */
    const nowRow = h("div", "ot-tl-row");
    nowRow.appendChild(h("div", "ot-tl-name", ""));
    const nt = h("div", "ot-tl-track");
    nt.style.height = "8px";
    const nl = h("div", "ot-tl-today");
    nl.style.left = pct(TL_NOW) + "%";
    nl.appendChild(h("i", null, "now"));
    nt.appendChild(nl);
    nowRow.appendChild(nt);
    chartWrap.insertBefore(nowRow, chartWrap.children[1]);

    body.appendChild(chartWrap);

    /* table view */
    const tableWrap = makeSortableTable([
      { key: "name", label: "Company", render: r => r.name, sort: r => r.name },
      { key: "out", label: "Fate", render: r => { const b = h("span", "ot-badge " + ((FATE[r.outcome] || FATE.dead).badge), r.out); return b; }, sort: r => r.out },
      { key: "from", label: "First year", render: r => r.from, sort: r => r.from },
      { key: "to", label: "Last year", render: r => r.to, sort: r => r.to },
      { key: "cohort", label: "Group", render: r => r.cohort, sort: r => r.cohort },
      { key: "note", label: "What happened", render: r => r.note, sort: r => r.note },
    ], players, p => {
      const d = destinyDetail(p);
      showBelow(below, d);
      openDrawer(d);
    });
    body.appendChild(tableWrap);

    controls.appendChild(addViewToggle({}, chartWrap, tableWrap));
    const below = makeBelow(panel);
    root.appendChild(panel);
  }

  /* ════════════ PANEL 2 · Scale-gap ════════════ */
  function scalegapDetail(lane) {
    const secs = [];
    if (lane.drill) {
      secs.push({ h: "Smallest offering / starting position", text: lane.drill.value });
      secs.push({ h: "Customers, financial health and what the span really is", text: lane.drill.sub });
    }
    if (lane.bar) secs.push({ h: "On the axis", text: `${fmtMoneyM(lane.bar.from)} → ${fmtMoneyM(lane.bar.to)} · ${lane.bar.lab}` });
    if (lane.ghost) secs.push({ h: "Dashed span (not a product)", text: `${fmtMoneyM(lane.ghost.from)} → ${fmtMoneyM(lane.ghost.to)} · ${lane.ghost.lab}` });
    return {
      kicker: "The scale gap",
      name: lane.drill ? lane.drill.title : lane.name,
      badges: lane.id === "hcsp" ? [{ cls: "ot-b-open", label: "The opening" }] : [],
      sections: secs,
      srcs: lane.src,
    };
  }

  function buildScalegap(root) {
    const sg = RPT().scalegap;
    const { panel, body, controls } = panelShell({
      id: "scalegap",
      kicker: "Deal size vs. what competitors sell",
      title: "Nobody sells a sub-$1M answer — that empty blue band is the opening",
      howto: "How to read this: the horizontal axis is deal size in US dollars on a log scale (each step is 10×). " +
        "Each row is one competitor; the colored span shows the deal sizes their smallest offering actually covers. " +
        "The <b>blue band under $1M</b> is unserved — no equipment to buy, no service door to walk through. " +
        "Hover a span for the numbers; click it for smallest offering, customers, financial health and sources.",
    });
    if (!sg || !sg.lanes || !sg.lanes.length) {
      body.appendChild(h("p", "ot-empty", "No scale-gap data (RPT.scalegap) was found."));
      root.appendChild(panel);
      return;
    }

    const chartWrap = h("div");
    const chartEl = h("div", "ot-gap-chart");
    chartEl.setAttribute("role", "img");
    chartEl.setAttribute("aria-label", "Chart of competitor offerings by deal size, showing an unserved band below one million dollars.");
    chartWrap.appendChild(chartEl);
    const note = h("p", "ot-gap-note",
      "Solid span = equipment you can buy · hatched span = government-program business only · hollow span = centralized service contracts (never a sold unit) · dashed span = service-only pilots, not a product. Log scale: equal distances mean equal ratios.");
    chartWrap.appendChild(note);
    body.appendChild(chartWrap);

    const laneNames = sg.lanes.map(l => l.name);
    const COLORS = {
      solid: "#7a5af8",
      hatch: "#8b95a1",
      hollow: "#1f6feb",
      hcsp: "#1a9e5c",
      ghost: "#c3ccd6",
      split: "#d4453a",
    };
    const laneColor = l => l.kind === "hcsp" ? COLORS.hcsp : l.kind === "solid" ? COLORS.solid : l.kind === "hatch" ? COLORS.hatch : l.kind === "hollow" ? COLORS.hollow : COLORS.split;

    function hatchLines(api, x0, x1, y0, y1, color) {
      /* manual diagonal hatch: robust across renderers */
      const lines = [];
      const hgt = y1 - y0, step = 7;
      for (let x = x0 - hgt; x < x1; x += step) {
        const xa = Math.max(x, x0), xb = Math.min(x + hgt, x1);
        if (xb <= xa) continue;
        lines.push({
          type: "line",
          shape: { x1: xa, y1: y1 - (xa - x), x2: xb, y2: y1 - (xb - x) },
          style: { stroke: color, lineWidth: 1, opacity: .55 },
          silent: true,
        });
      }
      return lines;
    }

    const option = {
      animation: !REDUCED,
      grid: { left: 8, right: 26, top: 26, bottom: 34, containLabel: true },
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: p => {
          const lane = sg.lanes[p.dataIndex];
          if (!lane) return "";
          const bits = [`<b>${lane.name}</b>`];
          if (lane.ghost) bits.push(`Pilots only: ${fmtMoneyM(lane.ghost.from)}–${fmtMoneyM(lane.ghost.to)} — ${lane.ghost.lab}`);
          if (lane.bar) bits.push(`Offering span: ${fmtMoneyM(lane.bar.from)}–${fmtMoneyM(lane.bar.to)} — ${lane.bar.lab}`);
          bits.push("<i>Click for smallest offering, customers, financial health & sources</i>");
          return bits.join("<br>");
        },
      },
      xAxis: {
        type: "log",
        min: sg.domain[0],
        max: sg.domain[1],
        name: "Deal size (US$, log scale)",
        nameLocation: "middle",
        nameGap: 26,
        nameTextStyle: { fontSize: 11.5, color: "#5b6672" },
        axisLabel: {
          fontSize: 11.5, color: "#5b6672",
          formatter: v => (v < 1 ? "$" + Math.round(v * 1000) + "K" : "$" + (v >= 10 ? Math.round(v) : v) + "M"),
        },
        splitLine: { lineStyle: { color: "#eef1f5" } },
      },
      yAxis: {
        type: "category",
        data: laneNames,
        axisLabel: { fontSize: 12.5, fontWeight: 600, color: "#17202a", width: 92, overflow: "break" },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series: [{
        type: "custom",
        renderItem: (params, api) => {
          const lane = sg.lanes[params.dataIndex];
          const yC = api.coord([sg.domain[0], params.dataIndex])[1];
          const half = 13;
          const kids = [];
          const xOf = v => api.coord([v, params.dataIndex])[0];
          const color = laneColor(lane);

          /* sub-$1M zone shaded per-lane (band under the bars) — drawn once via markArea below instead */
          if (lane.ghost) {
            const x0 = xOf(lane.ghost.from), x1 = xOf(lane.ghost.to);
            kids.push({
              type: "rect",
              shape: { x: x0, y: yC - half, width: Math.max(2, x1 - x0), height: half * 2, r: 4 },
              style: { fill: "rgba(195,204,214,.18)", stroke: COLORS.ghost, lineWidth: 1.5, lineDash: [4, 3] },
            });
          }
          if (lane.bar) {
            const x0 = xOf(lane.bar.from), x1 = xOf(lane.bar.to);
            const w = Math.max(3, x1 - x0);
            if (lane.kind === "hollow") {
              kids.push({
                type: "rect",
                shape: { x: x0, y: yC - half, width: w, height: half * 2, r: 4 },
                style: { fill: "rgba(31,111,235,.07)", stroke: color, lineWidth: 2, lineDash: [6, 3] },
              });
            } else if (lane.kind === "hatch") {
              kids.push({
                type: "rect",
                shape: { x: x0, y: yC - half, width: w, height: half * 2, r: 4 },
                style: { fill: "rgba(139,149,161,.16)", stroke: color, lineWidth: 1.5 },
              });
              hatchLines(api, x0, x1, yC - half, yC + half, color).forEach(l => kids.push(l));
            } else {
              kids.push({
                type: "rect",
                shape: { x: x0, y: yC - half, width: w, height: half * 2, r: 4 },
                style: { fill: color, opacity: lane.kind === "hcsp" ? .92 : .82, stroke: color, lineWidth: 1 },
              });
            }
            /* bar label above-left of the span; truncated to chart width, never overlaps other lanes */
            kids.push({
              type: "text",
              x: x0,
              y: yC - half - 5,
              style: {
                text: lane.bar.lab,
                fontSize: 11,
                fontWeight: 600,
                fill: lane.kind === "hcsp" ? "#1a9e5c" : "#424c58",
                align: "left",
                verticalAlign: "bottom",
                overflow: "truncate",
                width: Math.max(60, params.coordSys.width - x0 + params.coordSys.x - 10),
              },
              silent: true,
            });
          }
          return { type: "group", children: kids };
        },
        data: sg.lanes.map((l, i) => ({ name: l.name, value: i })),
        markArea: {
          silent: true,
          itemStyle: { color: "rgba(31,111,235,.10)" },
          label: {
            show: true,
            position: "insideBottomLeft",
            distance: 6,
            fontSize: 11.5,
            fontWeight: 700,
            color: "#1f6feb",
            formatter: "sub-$1M zone —\nthe opening",
          },
          data: [[{ xAxis: sg.domain[0] }, { xAxis: sg.zoneMax }]],
        },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { color: "#1f6feb", type: "dashed", width: 1.5 },
          label: { show: false },
          data: [{ xAxis: sg.zoneMax }],
        },
      }],
    };

    let chart = null;
    function initChart() {
      if (chart || !window.echarts) return;
      chart = window.echarts.init(chartEl, null, { renderer: "canvas" });
      chartEl.__otChart = chart; /* exposed for QA/testing */
      chart.setOption(option);
      chart.on("click", p => {
        const lane = sg.lanes[p.dataIndex];
        if (!lane) return;
        const d = scalegapDetail(lane);
        showBelow(below, d);
        openDrawer(d);
      });
      echartsPool.push(chart);
    }
    if (!window.echarts) {
      chartWrap.appendChild(h("p", "ot-empty", "Chart library (ECharts) did not load — use the Table view for the same data."));
    } else {
      /* init after layout so the canvas has real dimensions */
      requestAnimationFrame(initChart);
    }

    /* table view */
    const kindLabel = { solid: "Equipment for sale", hatch: "Government programs only", hollow: "Centralized service (no unit sold)", split: "Service pilots + large equipment", hcsp: "Sold & self-operated — the opening" };
    const tableWrap = makeSortableTable([
      { key: "name", label: "Company", render: r => r.name, sort: r => r.name },
      { key: "from", label: "Smallest offering", render: r => fmtMoneyM(r.bar ? r.bar.from : null), sort: r => (r.bar ? r.bar.from : Infinity) },
      { key: "to", label: "Largest deal", render: r => fmtMoneyM(r.bar ? r.bar.to : null), sort: r => (r.bar ? r.bar.to : 0) },
      { key: "kind", label: "What the span is", render: r => kindLabel[r.kind] || r.kind, sort: r => kindLabel[r.kind] || r.kind },
      { key: "lab", label: "Detail", render: r => (r.bar ? r.bar.lab : "") + (r.ghost ? " · pilots: " + r.ghost.lab : ""), sort: r => r.bar ? r.bar.lab : "" },
    ], sg.lanes, lane => {
      const d = scalegapDetail(lane);
      showBelow(below, d);
      openDrawer(d);
    });
    body.appendChild(tableWrap);

    controls.appendChild(addViewToggle({ onChartShown: () => { initChart(); if (chart) chart.resize(); } }, chartWrap, tableWrap));
    const below = makeBelow(panel);
    root.appendChild(panel);
  }

  /* ════════════ PANEL 3 · Deadline calendar ════════════ */
  const CLS_META = {
    hard:    { badge: "ot-b-hard",    dot: "ot-d-hard",    label: "Hard deadline", advice: "Treat the date as fixed — submit before it, or prepare now for the next cycle of the same program." },
    window:  { badge: "ot-b-window",  dot: "ot-d-window",  label: "Open window",   advice: "This is a window, not a single day — engage early while the program is open, because funds and attention run out." },
    forming: { badge: "ot-b-forming", dot: "ot-d-forming", label: "Forming now",   advice: "The rules are being written now — engage while program design and project pipelines form, before positions harden." },
    policy:  { badge: "ot-b-policy",  dot: "ot-d-policy",  label: "Policy",        advice: "Track it — it changes the rules customers must follow, and rules create the buying duty." },
    demand:  { badge: "ot-b-demand",  dot: "ot-d-demand",  label: "Demand",        advice: "Sell into it — a dated legal duty means customers must buy a solution whether or not they want to." },
    risk:    { badge: "ot-b-risk",    dot: "ot-d-risk",    label: "Risk",          advice: "Plan around it — answer it directly in every proposal and customer conversation." },
  };

  function calendarItems() {
    const fc = (RPT().funding_calendar || []).map(e => ({
      y: e.y, label: e.label, date: e.date, cls: e.cls, closed: !!e.closed,
      ev: e.ev, mean: null, act: null, src: e.src, kind: "Funding program",
    }));
    const cat = (RPT().catalysts || []).map(e => ({
      y: e.y, label: e.label, date: e.date, cls: e.cls, closed: false,
      ev: e.ev, mean: e.mean || null, act: e.act || null, src: e.src, kind: "Market milestone",
    }));
    return fc.concat(cat).sort((a, b) => a.y - b.y);
  }

  function calendarDetail(it) {
    const meta = CLS_META[it.cls] || CLS_META.policy;
    const badges = [{ cls: meta.badge, label: meta.label }, { cls: "", label: it.kind }];
    if (it.closed) badges.unshift({ cls: "ot-b-closed", label: "CLOSED" });
    const sections = [];
    sections.push({ h: "When", text: it.date + (it.closed ? " — this deadline has passed." : ".") });
    if (it.mean) sections.push({ h: "What it means for HCSP", text: it.mean });
    if (it.ev) sections.push({ h: it.mean ? "Details" : "What it means for HCSP", text: it.ev });
    sections.push({ h: "What to do", text: it.act || meta.advice });
    return { kicker: it.kind, name: it.label, badges, sections, srcs: it.src };
  }

  function buildCalendar(root) {
    const items = calendarItems();
    const { panel, body, controls } = panelShell({
      id: "calendar",
      kicker: "Funding deadlines & market milestones",
      title: "The dated calendar: what's open, what's closing, what's already shut",
      howto: "How to read this: every dated funding deadline and market milestone, in time order, on one line. " +
        "<b>Red</b> dots are hard deadlines, <b>amber</b> are open windows, <b>blue</b> are programs still forming; " +
        "green/purple/red milestones are demand, policy and risk events. Struck-through items marked <b>CLOSED</b> have passed — " +
        "most recur, so they stay on the map. Filter with the buttons; click any item for what it means, what to do, and the source.",
    });
    if (!items.length) { body.appendChild(h("p", "ot-empty", "No calendar data (RPT.funding_calendar / RPT.catalysts) was found.")); root.appendChild(panel); return; }

    /* filter state */
    let statusFilter = "all";           // all | open | closed
    const kindOn = { "Funding program": true, "Market milestone": true };
    const pass = it =>
      (statusFilter === "all" || (statusFilter === "closed") === !!it.closed) && kindOn[it.kind];

    /* controls: status segmented */
    const seg = h("div", "ot-seg");
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Filter by status");
    [["all", "All"], ["open", "Open"], ["closed", "Closed"]].forEach(([v, lab], i) => {
      const b = h("button", null, lab);
      b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", () => {
        statusFilter = v;
        seg.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        paint();
      });
      seg.appendChild(b);
    });
    controls.appendChild(seg);
    /* kind chips */
    Object.keys(kindOn).forEach(k => {
      const b = h("button", "ot-chipbtn", k + "s");
      b.setAttribute("aria-pressed", "true");
      b.addEventListener("click", () => {
        kindOn[k] = !kindOn[k];
        b.setAttribute("aria-pressed", String(kindOn[k]));
        paint();
      });
      controls.appendChild(b);
    });

    /* chart view: chronological timeline list */
    const chartWrap = h("div");
    const list = h("ol", "ot-cal");
    chartWrap.appendChild(list);
    body.appendChild(chartWrap);

    const bodyByItem = new Map();
    function paint() {
      list.innerHTML = "";
      const shown = items.filter(pass);
      if (!shown.length) {
        list.appendChild(h("li", "ot-cal-empty", "Nothing matches this filter — try \"All\"."));
        return;
      }
      shown.forEach(it => {
        const meta = CLS_META[it.cls] || CLS_META.policy;
        const li = h("li", "ot-cal-item" + (it.closed ? " ot-is-closed" : ""));
        li.appendChild(h("div", "ot-cal-date", it.date));
        li.appendChild(h("span", "ot-cal-dot " + meta.dot));
        const bd = h("div", "ot-cal-body");
        bd.setAttribute("role", "button");
        bd.tabIndex = 0;
        bd.setAttribute("aria-label", `${it.label}, ${meta.label}, ${it.closed ? "closed" : "open"}. Activate for detail.`);
        const top = h("div", "ot-cal-top");
        top.appendChild(h("span", "ot-cal-label", it.label));
        if (it.closed) top.appendChild(h("span", "ot-badge ot-b-closed", "CLOSED"));
        top.appendChild(h("span", "ot-badge " + meta.badge, meta.label));
        bd.appendChild(top);
        bd.appendChild(h("p", "ot-cal-sum", it.mean || it.ev));
        bindTip(bd, () => ({
          title: `${it.date} · ${meta.label}${it.closed ? " · CLOSED" : ""}`,
          sub: (it.mean || it.ev || "").slice(0, 220),
        }));
        const select = () => {
          bodyByItem.forEach(x => x.classList.remove("ot-sel"));
          bd.classList.add("ot-sel");
          const d = calendarDetail(it);
          showBelow(below, d);
          openDrawer(d);
        };
        bd.addEventListener("click", select);
        bd.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select(); } });
        bodyByItem.set(it, bd);
        li.appendChild(bd);
        list.appendChild(li);
      });
    }
    paint();

    /* table view */
    const tableWrap = makeSortableTable([
      { key: "date", label: "Date", render: r => r.date, sort: r => r.y },
      { key: "label", label: "Event", render: r => r.label, sort: r => r.label },
      { key: "cls", label: "Type", render: r => h("span", "ot-badge " + (CLS_META[r.cls] || CLS_META.policy).badge, (CLS_META[r.cls] || CLS_META.policy).label), sort: r => r.cls },
      { key: "status", label: "Status", render: r => h("span", "ot-badge " + (r.closed ? "ot-b-closed" : "ot-b-open"), r.closed ? "CLOSED" : "Open"), sort: r => (r.closed ? 1 : 0) },
      { key: "mean", label: "What it means", render: r => r.mean || r.ev, sort: r => r.mean || r.ev || "" },
    ], items, it => {
      const d = calendarDetail(it);
      showBelow(below, d);
      openDrawer(d);
    });
    body.appendChild(tableWrap);

    controls.prepend(addViewToggle({}, chartWrap, tableWrap));
    const below = makeBelow(panel);
    root.appendChild(panel);
  }

  /* ════════════ PANEL 4 · Energy scenarios + materials recovery ════════════ */
  const DIAGRAM_LABELS = { feed: "Goes in", power: "Electricity out", cooling: "Cooling out", heat: "Heat out", water: "Clean water out" };

  function scenarioDetail(s) {
    const earns = h("div", "ot-scn-cols");
    (s.earns || []).forEach(e => {
      const col = h("div", "ot-scn-col");
      col.appendChild(h("h5", null, e.t));
      col.appendChild(h("p", null, e.d));
      if (e.src && e.src.length) col.appendChild(srcChips(e.src));
      earns.appendChild(col);
    });
    return {
      kicker: "Energy scenario " + s.id,
      name: s.name,
      badges: [{ cls: "ot-b-forming", label: s.tag }],
      sections: [
        { h: "The idea in plain words", text: s.card },
        { h: "The three revenue streams", node: earns },
        { h: "What has to be true", list: s.needs || [] },
      ],
      srcs: s.src,
    };
  }

  function scenarioBlock(s, openDrawerBtn) {
    const det = h("div", "ot-scn-detail");
    const nm = h("h3", null, "Scenario " + s.id + " · " + s.name);
    nm.style.cssText = "margin:0 0 4px;font-size:16px";
    det.appendChild(nm);
    det.appendChild(h("p", "ot-scn-lead", s.card));

    /* flow chips */
    const dia = h("div", "ot-scn-diagram");
    Object.keys(DIAGRAM_LABELS).forEach(k => {
      if (!s.diagram || !s.diagram[k]) return;
      const chip = h("div", "ot-scn-io");
      chip.appendChild(h("b", null, DIAGRAM_LABELS[k]));
      chip.appendChild(document.createTextNode(s.diagram[k]));
      bindTip(chip, () => ({ title: DIAGRAM_LABELS[k], sub: s.diagram[k] }));
      dia.appendChild(chip);
    });
    det.appendChild(dia);

    const cols = h("div", "ot-scn-cols");

    /* revenue streams */
    const cEarn = h("div", "ot-scn-col");
    cEarn.appendChild(h("h5", null, "Three revenue streams"));
    (s.earns || []).forEach((e, i) => {
      const p = h("p");
      p.appendChild(h("b", null, (i + 1) + ". " + e.t + " — "));
      p.appendChild(document.createTextNode(e.d));
      cEarn.appendChild(p);
    });
    cols.appendChild(cEarn);

    /* indicative economics */
    const cEcon = h("div", "ot-scn-col");
    cEcon.appendChild(h("h5", null, "Indicative economics"));
    cEcon.appendChild(h("span", "ot-illus", "Illustrative — from engineering studies, not a quote"));
    const et = h("table", "ot-econ");
    (s.econ || []).forEach(r => {
      const tr = h("tr");
      const td1 = h("td", null, r.lab);
      if (r.src && r.src.length) bindTip(td1, () => ({ title: "Source", sub: r.src.map(k => { const e = srcEntry(k); return k + (e ? " · " + (e.cite || "") : ""); }).join(" · ") }));
      tr.appendChild(td1);
      tr.appendChild(h("td", null, r.val));
      et.appendChild(tr);
    });
    cEcon.appendChild(et);
    cols.appendChild(cEcon);

    /* needs */
    const cNeed = h("div", "ot-scn-col");
    cNeed.appendChild(h("h5", null, "What has to be true"));
    const ul = h("ul");
    (s.needs || []).forEach(n => ul.appendChild(h("li", null, n)));
    cNeed.appendChild(ul);
    cols.appendChild(cNeed);

    det.appendChild(cols);

    /* drills (expandable) */
    if (s.drills && s.drills.length) {
      const dr = h("div", "ot-drills");
      dr.appendChild(h("h5", null, "Dig deeper"));
      dr.firstChild.style.cssText = "font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--ot-blue);margin:12px 0 4px";
      s.drills.forEach(d => {
        const el = h("details");
        const sum = h("summary", null, d.title);
        el.appendChild(sum);
        el.appendChild(h("p", "ot-drill-val", d.value));
        el.appendChild(h("p", "ot-drill-sub", d.sub));
        if (d.src && d.src.length) el.appendChild(srcChips(d.src));
        dr.appendChild(el);
      });
      det.appendChild(dr);
    }

    if (s.src && s.src.length) det.appendChild(srcChips(s.src));

    if (openDrawerBtn) {
      const btn = h("button", "ot-chipbtn", "Open in side panel ▸");
      btn.style.marginTop = "12px";
      btn.addEventListener("click", () => openDrawer(scenarioDetail(s)));
      det.appendChild(btn);
    }
    return det;
  }

  function buildScenarios(root) {
    const scenarios = RPT().energy_scenarios || [];
    const mat = RPT().materials_recovery || null;
    const { panel, body, controls } = panelShell({
      id: "scenarios",
      kicker: "Energy scenarios & materials recovery",
      title: "Six ways to sell the energy — and what else the waste could pay for",
      howto: "How to read this: pick one of the six scenarios (A–F) to see its three revenue streams, its indicative economics " +
        "(<b>illustrative</b> — from engineering studies, not a quote) and what must be true for it to work. " +
        "Below, the materials table lists what future versions could recover from the waste and sell; click a row for the honest caveat and sources.",
    });
    if (!scenarios.length) { body.appendChild(h("p", "ot-empty", "No energy-scenario data (RPT.energy_scenarios) was found.")); root.appendChild(panel); return; }

    /* ── scenario chart view ── */
    const chartWrap = h("div");
    const grid = h("div", "ot-scn-grid");
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", "Choose an energy scenario");
    const detailHost = h("div");
    const cards = new Map();

    function selectScenario(s, fromUser) {
      cards.forEach((c, k) => c.setAttribute("aria-pressed", String(k === s)));
      detailHost.innerHTML = "";
      detailHost.appendChild(scenarioBlock(s, true));
      if (fromUser) {
        const d = scenarioDetail(s);
        showBelow(below, d);
        openDrawer(d);
      }
    }
    scenarios.forEach(s => {
      const c = h("button", "ot-scn-card");
      c.setAttribute("aria-pressed", "false");
      c.appendChild(h("span", "ot-scn-id", s.id));
      c.appendChild(h("span", "ot-scn-name", s.name));
      c.appendChild(h("span", "ot-scn-tag", s.tag));
      bindTip(c, () => ({ title: `Scenario ${s.id} · ${s.name}`, sub: s.tag + " — click for revenue streams, economics and needs." }));
      c.addEventListener("click", () => selectScenario(s, true));
      cards.set(s, c);
      grid.appendChild(c);
    });
    chartWrap.appendChild(grid);
    chartWrap.appendChild(detailHost);
    body.appendChild(chartWrap);

    /* scenario table view */
    const scenTable = makeSortableTable([
      { key: "id", label: "#", render: r => r.id, sort: r => r.id },
      { key: "name", label: "Scenario", render: r => r.name, sort: r => r.name },
      { key: "feed", label: "Goes in", render: r => r.diagram.feed, sort: r => r.diagram.feed },
      { key: "power", label: "Electricity out", render: r => r.diagram.power, sort: r => r.diagram.power },
      { key: "cooling", label: "Cooling out", render: r => r.diagram.cooling, sort: r => r.diagram.cooling },
      { key: "water", label: "Water out", render: r => r.diagram.water, sort: r => r.diagram.water },
    ], scenarios, s => {
      const d = scenarioDetail(s);
      showBelow(below, d);
      openDrawer(d);
    });
    body.appendChild(scenTable);
    controls.appendChild(addViewToggle({}, chartWrap, scenTable));

    selectScenario(scenarios[0], false);

    /* ── materials recovery ── */
    if (mat) {
      const sh = h("h3", "ot-subhead", "Materials recovery: turning a disposal cost into a product");
      if (mat.status) {
        const badge = h("span", "ot-mat-status", mat.status.replace(/^ROADMAP\s*—\s*/i, "Roadmap · "));
        sh.appendChild(badge);
      }
      body.appendChild(sh);
      body.appendChild(h("p", "ot-mat-intro", mat.intro));

      const matTable = makeSortableTable([
        { key: "sub", label: "Material", render: r => r.sub, sort: r => r.sub },
        { key: "source", label: "Source waste", render: r => r.source, sort: r => r.source },
        { key: "path", label: "How it's recovered", render: r => r.path, sort: r => r.path },
        { key: "buyer", label: "Who buys it", render: r => r.buyer, sort: r => r.buyer },
      ], mat.rows || [], r => {
        const d = {
          kicker: "Materials recovery (roadmap)",
          name: r.sub,
          badges: [{ cls: "ot-b-policy", label: "Roadmap — not a shipping feature" }],
          sections: [
            { h: "Source waste", text: r.source },
            { h: "How it's recovered", text: r.path },
            { h: "Who buys it", text: r.buyer },
            { h: "The honest caveat", text: r.note },
          ],
          srcs: r.src,
        };
        showBelow(below, d);
        openDrawer(d);
      });
      matTable.querySelectorAll("tbody tr").forEach(tr => {
        bindTip(tr, () => ({ title: "Click to drill in", sub: "Buyer, recovery path, caveat and sources." }));
      });
      body.appendChild(matTable);
      if (mat.rule) body.appendChild(h("p", "ot-mat-rule", mat.rule));
    }

    const below = makeBelow(panel);
    root.appendChild(panel);
  }

  /* ════════════ render ════════════ */
  const BUILDERS = { destiny: buildDestiny, scalegap: buildScalegap, calendar: buildCalendar, scenarios: buildScenarios };
  const PANEL_TITLES = { destiny: "Competitor fates", scalegap: "The scale gap", calendar: "Deadlines", scenarios: "Energy & materials" };

  function render(hostEl, opts) {
    if (!hostEl) return;
    opts = opts || {};
    const which = (opts.panels && opts.panels.length ? opts.panels : Object.keys(BUILDERS)).filter(k => BUILDERS[k]);
    hostEl.classList.add("ot-root");
    hostEl.innerHTML = "";

    if (which.length > 1) {
      const nav = h("nav", "ot-controls");
      nav.style.margin = "0 0 18px";
      nav.setAttribute("aria-label", "Chart Lab sections");
      which.forEach(k => {
        const a = h("a", "ot-chipbtn", PANEL_TITLES[k] || k);
        a.href = "#ot-panel-" + k;
        a.style.textDecoration = "none";
        nav.appendChild(a);
      });
      hostEl.appendChild(nav);
    }
    which.forEach(k => { try { BUILDERS[k](hostEl); } catch (err) { console.error("[ChartOther] panel failed:", k, err); } });
    bindResize();
    return { panels: which };
  }

  return { render };
})();
