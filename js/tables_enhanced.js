// ═══ Shared table enhancement layer ═══
// One consistent, readable, interactive table system across all three pages:
//   · click/keyboard sorting with arrow + aria-sort on every table
//     (tables with their own sort — the grant register — are left untouched)
//   · live search on the large registers (customer tables, sources register;
//     the grant register keeps its existing search + dropdowns)
//   · per-table CSV export of the currently visible rows
//   · show/hide column toggles on tables with 6+ columns
//   · mobile card labels (data-label) so ≤768px CSS can render rows as cards
//   · generic drill-down (the site's existing U.showDrill card) on rows that
//     have no drill handler of their own
//   · sticky-header assist: .te-fits unlocks viewport pinning when a table
//     fits its scroll box horizontally
// Efficiency: sorting/filtering reorders or hides existing DOM rows — it never
// rebuilds innerHTML, so row drill handlers and state survive every operation.
(function () {
  "use strict";
  const CARD_MAX_COLS = 7;           // <8 columns → labeled cards on mobile
  const COL_TOGGLE_MIN = 6;          // ≥6 columns → show/hide column control
  const state = new WeakMap();       // table → { col, dir, hidden:Set }

  const txt = el => (el ? el.textContent || "" : "").replace(/\s+/g, " ").trim();
  /* header label without sort indicators (arrows live in child spans) */
  const headTxt = th => {
    let t = "";
    th.childNodes.forEach(n => {
      if (n.nodeType === 3) t += n.nodeValue;
      else if (n.nodeType === 1 && !n.classList.contains("te-arrow") && !n.classList.contains("sort-ind")) t += n.textContent;
    });
    return t.replace(/\s+/g, " ").trim();
  };

  /* ── sort key: numbers (incl. $1.2M, 1,200), match-dot counts, then text ── */
  function sortKey(td) {
    const t = txt(td);
    if (!t || t === "—" || t === "–") return { o: 2, v: "" };          // empty last
    const m = t.replace(/,/g, "").match(/-?\d+(?:\.\d+)?\s*([KMB])\b|-?\d+(?:\.\d+)?/i);
    if (m) {
      let v = parseFloat(m[0]);
      const u = (m[1] || "").toUpperCase();
      v *= u === "K" ? 1e3 : u === "M" ? 1e6 : u === "B" ? 1e9 : 1;
      return { o: 0, v };
    }
    const dots = t.match(/●/g);
    if (dots) return { o: 0, v: dots.length };
    return { o: 1, v: t.toLowerCase() };
  }
  function cmpKeys(a, b) {
    if (a.o !== b.o) return a.o - b.o;
    if (a.o === 0) return a.v - b.v;
    if (a.o === 1) return String(a.v).localeCompare(String(b.v), undefined, { numeric: true });
    return 0;
  }

  /* ── stable DOM-reorder sort: no re-creation, handlers preserved ── */
  function applySort(table, col, dir) {
    const tbody = table.tBodies[0];
    if (!tbody) return;
    const rows = [...tbody.rows].map((tr, i) => ({ tr, i, k: sortKey(tr.cells[col]) }));
    rows.sort((a, b) => cmpKeys(a.k, b.k) * dir || a.i - b.i);
    const frag = document.createDocumentFragment();
    rows.forEach(r => frag.appendChild(r.tr));
    tbody.appendChild(frag);
  }

  function decorateHeads(table) {
    const st = state.get(table) || {};
    [...(table.tHead ? table.tHead.rows[0].cells : [])].forEach((th, i) => {
      th.classList.add("te-sortable");
      if (!th.hasAttribute("tabindex")) th.tabIndex = 0;
      if (!th.hasAttribute("aria-sort")) th.setAttribute("aria-sort", st.col === i ? (st.dir > 0 ? "ascending" : "descending") : "none");
      if (!th.querySelector(".te-arrow")) {
        const s = document.createElement("span");
        s.className = "te-arrow"; s.setAttribute("aria-hidden", "true");
        s.textContent = st.col === i ? (st.dir > 0 ? "▲" : "▼") : "▲";
        th.appendChild(s);
      } else {
        th.querySelector(".te-arrow").textContent = st.col === i ? (st.dir > 0 ? "▲" : "▼") : "▲";
      }
    });
  }

  /* delegated so header re-renders (e.g. the dual-lens toggle) never unbind it */
  function enableSort(table) {
    state.set(table, { ...(state.get(table) || {}), col: -1, dir: 1 });
    decorateHeads(table);
    const activate = th => {
      const st = state.get(table);
      const col = th.cellIndex;
      if (st.col === col) st.dir *= -1; else { st.col = col; st.dir = 1; }
      applySort(table, col, st.dir);
      [...table.tHead.rows[0].cells].forEach((h, i) => {
        h.setAttribute("aria-sort", i === col ? (st.dir > 0 ? "ascending" : "descending") : "none");
        const a = h.querySelector(".te-arrow");
        if (a) a.textContent = i === col ? (st.dir > 0 ? "▲" : "▼") : "▲";
      });
    };
    table.addEventListener("click", e => {
      const th = e.target.closest("th");
      if (th && table.tHead && table.tHead.contains(th)) activate(th);
    });
    table.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const th = e.target.closest ? e.target.closest("th") : null;
      if (th && table.tHead && table.tHead.contains(th)) { e.preventDefault(); activate(th); }
    });
  }

  /* ── data-label on every td → mobile card layout (CSS, ≤768px) ── */
  function labelCells(table) {
    const heads = [...(table.tHead ? table.tHead.rows[0].cells : [])].map(h => txt(h) || "Column");
    table.querySelectorAll("tbody tr").forEach(tr => {
      [...tr.cells].forEach((td, i) => td.setAttribute("data-label", heads[i] || heads[heads.length - 1] || "Value"));
    });
  }

  /* ── shared flag chips: wrap bare TBD / CLOSED text in AA chip spans ── */
  function wrapChips(scope) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!/\b(TBD|CLOSED)\b/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || p.closest("a,button,.flag-chip,script,style")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const hits = [];
    while (walker.nextNode()) hits.push(walker.currentNode);
    hits.forEach(n => {
      const frag = document.createDocumentFragment();
      n.nodeValue.split(/\b(TBD|CLOSED)\b/).forEach(part => {
        if (part === "TBD" || part === "CLOSED") {
          const s = document.createElement("span");
          s.className = "flag-chip " + part.toLowerCase();
          s.textContent = part;
          frag.appendChild(s);
        } else if (part) frag.appendChild(document.createTextNode(part));
      });
      n.parentNode.replaceChild(frag, n);
    });
  }

  /* ── CSV export of the current (filtered) rows and visible columns ── */
  function exportCsv(table) {
    const head = [...table.tHead.rows[0].cells];
    const visCols = head.map((th, i) => ({ i, keep: th.style.display !== "none", lab: headTxt(th) }));
    const keep = visCols.filter(c => c.keep);
    const esc = v => (/[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v);
    const lines = [keep.map(c => esc(c.lab)).join(",")];
    [...table.tBodies[0].rows].forEach(tr => {
      if (tr.style.display === "none") return;
      lines.push(keep.map(c => esc(txt(tr.cells[c.i]))).join(","));
    });
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (table.id || "table") + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* ── show/hide column toggles (tables with COL_TOGGLE_MIN+ columns) ── */
  function colToggle(table) {
    const head = [...table.tHead.rows[0].cells];
    const det = document.createElement("details");
    det.className = "te-cols";
    const sum = document.createElement("summary");
    sum.textContent = "COLUMNS";
    sum.setAttribute("aria-label", "Show or hide columns");
    det.appendChild(sum);
    const menu = document.createElement("div");
    menu.className = "te-cols-menu";
    head.forEach((th, i) => {
      const lab = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = true;
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(headTxt(th) || "Column " + (i + 1)));
      cb.addEventListener("change", () => {
        const show = cb.checked;
        table.tHead.rows[0].cells[i].style.display = show ? "" : "none";
        table.querySelectorAll("tbody tr").forEach(tr => {
          if (tr.cells[i]) tr.cells[i].style.display = show ? "" : "none";
        });
        fitScrolls();
      });
      menu.appendChild(lab);
    });
    det.appendChild(menu);
    document.addEventListener("click", e => { if (det.open && !det.contains(e.target)) det.open = false; });
    return det;
  }

  function csvButton(table) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "te-csv"; b.textContent = "DOWNLOAD CSV";
    b.setAttribute("aria-label", "Download the currently visible rows as CSV");
    b.addEventListener("click", () => exportCsv(table));
    return b;
  }

  /* ── toolbar: optional live search + column toggles + CSV ── */
  function buildTools(table, { search = false, host = null } = {}) {
    const colCount = table.tHead ? table.tHead.rows[0].cells.length : 0;
    let bar = host;
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "te-tools";
      const wrap = table.closest(".table-scroll");
      (wrap || table).parentElement.insertBefore(bar, wrap || table);
    }
    if (search) {
      const inp = document.createElement("input");
      inp.type = "search"; inp.className = "te-search";
      inp.placeholder = "Search this table…";
      inp.setAttribute("aria-label", "Search this table");
      const count = document.createElement("span");
      count.className = "te-count";
      const apply = () => {
        const q = inp.value.trim().toLowerCase();
        let shown = 0, total = 0;
        table.querySelectorAll("tbody tr").forEach(tr => {
          const on = !q || txt(tr).toLowerCase().includes(q);
          tr.style.display = on ? "" : "none";
          total++; if (on) shown++;
        });
        count.textContent = q ? shown + " OF " + total : "";
      };
      inp.addEventListener("input", apply);
      bar.appendChild(inp); bar.appendChild(count);
    }
    const spacer = document.createElement("span");
    spacer.className = "te-spacer";
    bar.appendChild(spacer);
    if (colCount >= COL_TOGGLE_MIN) bar.appendChild(colToggle(table));
    bar.appendChild(csvButton(table));
  }

  /* ── generic drill: rows with no handler of their own open the site card ── */
  function enableGenericDrill(table) {
    if (table.querySelector("tbody td") && [...table.querySelectorAll("tbody td")].some(td => td.onclick)) return;
    const heads = [...table.tHead.rows[0].cells].map(h => headTxt(h));
    table.querySelectorAll("tbody tr").forEach(tr => {
      if (tr.onclick) return;
      tr.style.cursor = "pointer";
      tr.setAttribute("data-drill-keep", "");
      tr.tabIndex = 0;
      const open = e => {
        const cells = [...tr.cells];
        U.showDrill({
          title: (heads[0] ? heads[0] + " · " : "") + txt(cells[0]).toUpperCase().slice(0, 60),
          value: txt(cells[1] || cells[0]).slice(0, 80),
          sub: cells.slice(1).map((td, i) => heads[i + 1] ? `<b>${heads[i + 1]}:</b> ${txt(td)}` : txt(td)).join(" · "),
          x: e.clientX || (tr.getBoundingClientRect().left + 40),
          y: e.clientY || (tr.getBoundingClientRect().top + 20),
        });
      };
      tr.addEventListener("click", open);
      tr.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); }
      });
    });
  }

  /* ── sticky-header assist: unlock overflow when the table fits its box ── */
  function fitScrolls() {
    document.querySelectorAll(".table-scroll").forEach(box => {
      if (box.classList.contains("tall")) return;             // vertical registers keep their box
      const t = box.querySelector("table");
      if (!t) return;
      const wasFits = box.classList.contains("te-fits");
      if (wasFits) box.classList.remove("te-fits");           // measure in the constrained state
      const overflows = box.scrollWidth > box.clientWidth + 2;
      if (!overflows) box.classList.add("te-fits");
    });
  }

  /* ── sources register (#source-list): live search over the K-rows ── */
  function enhanceSources() {
    const host = document.getElementById("source-list");
    if (!host) return;
    const bar = document.createElement("div");
    bar.className = "te-tools";
    const inp = document.createElement("input");
    inp.type = "search"; inp.className = "te-search";
    inp.placeholder = "Search the source register (K1–K207)…";
    inp.setAttribute("aria-label", "Search the source register");
    const count = document.createElement("span");
    count.className = "te-count";
    inp.addEventListener("input", () => {
      const q = inp.value.trim().toLowerCase();
      let shown = 0, total = 0;
      host.querySelectorAll(".src-row").forEach(r => {
        const on = !q || txt(r).toLowerCase().includes(q);
        r.style.display = on ? "" : "none";
        total++; if (on) shown++;
      });
      count.textContent = q ? shown + " OF " + total + " SOURCES" : "";
    });
    bar.appendChild(inp); bar.appendChild(count);
    host.parentElement.insertBefore(bar, host);
  }

  /* ── enhance every data table ── */
  function enhanceTable(table) {
    if (table.dataset.teDone) return;
    table.dataset.teDone = "1";
    const colCount = table.tHead && table.tHead.rows[0] ? table.tHead.rows[0].cells.length : 0;
    if (!colCount || !table.tBodies.length) return;

    const customSort = !!table.querySelector("th.sortable");   // grant register sorts itself
    labelCells(table);
    wrapChips(table);
    if (colCount <= CARD_MAX_COLS) table.classList.add("te-cardify");
    if (!customSort) enableSort(table);
    if (table.id === "grant-table") {
      buildTools(table, { host: document.getElementById("grant-tools") });
    } else {
      buildTools(table, { search: table.classList.contains("cust-dt") });
      enableGenericDrill(table);
    }

    // builders that re-render their own tbody (dual-lens toggle, grant register
    // filters) get their labels/chips/header decor re-applied automatically
    const obs = new MutationObserver(() => {
      labelCells(table);
      wrapChips(table.tBodies[0]);
      if (!customSort && table.tHead && !table.tHead.querySelector("th.te-sortable")) decorateHeads(table);
    });
    obs.observe(table, { childList: true });                   // thead/tbody swaps only
  }

  function init() {
    document.querySelectorAll("table.dt").forEach(enhanceTable);
    enhanceSources();
    fitScrolls();
    let rT = 0;
    addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(fitScrolls, 150); }, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
