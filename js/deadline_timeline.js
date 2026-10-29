// ═══ §10 · Key dates ahead — the clean rail-list deadline calendar ═══
// Replaces both the old SVG deadline wall chart and the previous hand-rolled
// DOM list. The presentation is the Chart Lab component from js/chart_other.js
// (window.ChartOther, panel "calendar"): all 25 dated events —
// RPT.funding_calendar (12) + RPT.catalysts (13) — in time order on one rail,
// with All / Open / Closed filter chips, kind filters, hover tooltips and
// click-for-detail (meaning, what to do, dated K-source links). CLOSED items
// (DWPR 2026-09-29, ONR 2026-09-30) are struck through and marked CLOSED.
// A CHART/TABLE toggle inside the panel gives the same data as a sortable
// table. Pure DOM: no canvas/SVG overflow risk.
// Toggle: "TIMELINE (READABLE)" (default) ⇄ "3D WALL" (switches the
// js/fund3d.js explorer in §9 to its wall view and scrolls to it).
(function () {
  "use strict";
  const host = document.getElementById("deadline-timeline");
  if (!host) return;

  const body = U.frame(host, {
    title: null,
    sub: null,
    src: "Industry & official — agency grant-notice pages, settlement administrators, state program bulletins, US EPA, Defense Dept, EU wastewater directive 2024/3019, India's pollution board · dates as published (K116–K132, K5–K63)",
  });

  /* ── view toggle: readable rail-list calendar (default) ⇄ the 3D wall in §9 ── */
  const bar = document.createElement("div");
  bar.className = "dlt-bar";
  bar.setAttribute("role", "tablist");
  bar.setAttribute("aria-label", "Deadline views");
  bar.innerHTML =
    '<button type="button" class="dlt-btn on" data-view="timeline" role="tab" aria-selected="true">TIMELINE (READABLE)</button>' +
    '<button type="button" class="dlt-btn" data-view="wall" role="tab" aria-selected="false">3D WALL</button>';
  body.appendChild(bar);
  const note = document.createElement("p");
  note.className = "dlt-note";
  note.hidden = true;
  note.textContent = "Showing the interactive 3D wall in the §9 register explorer above — the same 25 dates as a 3D scene. Choose “Timeline (readable)” to come back to this list.";
  body.appendChild(note);

  function fund3dRoot() { return document.querySelector("#fund3d .f3d-root"); }
  function openWall() {
    const target = document.getElementById("fund3d");
    const go = () => {
      const r = fund3dRoot();
      if (r && r.f3d) r.f3d.setView("wall");
    };
    // fund3d boots lazily near the viewport: scroll first, then switch view
    // once it reports ready (or immediately if it already booted).
    if (fund3dRoot() && fund3dRoot().f3d) go();
    else window.addEventListener("hcsp3d:ready", function onReady(e) {
      if (e.detail !== "fund3d") return;
      window.removeEventListener("hcsp3d:ready", onReady);
      go();
    });
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  bar.querySelectorAll(".dlt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      bar.querySelectorAll(".dlt-btn").forEach(b => {
        const on = b === btn;
        b.classList.toggle("on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      if (btn.dataset.view === "wall") {
        note.hidden = false;
        openWall();
      } else {
        note.hidden = true;
        host.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ── the preview's rail-list calendar, exactly as specified ── */
  const otHost = document.createElement("div");
  body.appendChild(otHost);
  if (window.ChartOther) {
    window.ChartOther.render(otHost, { panels: ["calendar"] });
  } else {
    const p = document.createElement("p");
    p.className = "ot-empty";
    p.textContent = "The calendar component (js/chart_other.js) did not load.";
    otHost.appendChild(p);
  }
})();
