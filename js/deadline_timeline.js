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
// Toggle: "TIMELINE (READABLE)" (default) ⇄ "3D WALL" — the 3D wall renders
// HERE, in place of the timeline inside this section (js/fund3d.js wall-only
// instance); no jump to the §9 register explorer, and exactly one of the two
// views is visible at a time.
(function () {
  "use strict";
  const host = document.getElementById("deadline-timeline");
  if (!host) return;

  const body = U.frame(host, {
    title: null,
    sub: null,
    src: "Industry & official — agency grant-notice pages, settlement administrators, state program bulletins, US EPA, Defense Dept, EU wastewater directive 2024/3019, India's pollution board · dates as published (K116–K132, K5–K63)",
  });

  /* ── view toggle: readable rail-list calendar (default) ⇄ the 3D wall,
        rendered in place inside this section ── */
  const bar = document.createElement("div");
  bar.className = "dlt-bar";
  bar.setAttribute("role", "tablist");
  bar.setAttribute("aria-label", "Deadline views");
  bar.innerHTML =
    '<button type="button" class="dlt-btn on" data-view="timeline" role="tab" aria-selected="true">TIMELINE (READABLE)</button>' +
    '<button type="button" class="dlt-btn" data-view="wall" role="tab" aria-selected="false">3D WALL</button>';
  body.appendChild(bar);

  /* ── the preview's rail-list calendar, exactly as specified ── */
  const otHost = document.createElement("div");
  otHost.className = "dlt-timeline";
  body.appendChild(otHost);
  if (window.ChartOther) {
    window.ChartOther.render(otHost, { panels: ["calendar"] });
  } else {
    const p = document.createElement("p");
    p.className = "ot-empty";
    p.textContent = "The calendar component (js/chart_other.js) did not load.";
    otHost.appendChild(p);
  }

  /* the 3D wall lives in this section, in the timeline's own slot */
  const wallHost = document.createElement("div");
  wallHost.className = "dlt-wall";
  wallHost.hidden = true;
  body.appendChild(wallHost);

  let wallStarted = false;
  function showWall() {
    otHost.hidden = true;
    wallHost.hidden = false;
    if (wallStarted) return;
    wallStarted = true;
    if (window.Fund3D && Fund3D.renderWall) {
      Fund3D.renderWall(wallHost).catch(function (err) {
        console.warn(err);
        wallHost.innerHTML = '<div class="f3d-nogl">The 3D library did not load — the readable timeline is one click away (TIMELINE).</div>';
      });
    } else {
      wallHost.innerHTML = '<div class="f3d-nogl">The 3D wall module (js/fund3d.js) did not load — the readable timeline is one click away (TIMELINE).</div>';
    }
  }
  function showTimeline() {
    wallHost.hidden = true;
    otHost.hidden = false;
  }
  bar.querySelectorAll(".dlt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      bar.querySelectorAll(".dlt-btn").forEach(b => {
        const on = b === btn;
        b.classList.toggle("on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      /* no scrolling: the wall replaces the timeline exactly where it stood */
      if (btn.dataset.view === "wall") showWall(); else showTimeline();
    });
  });
})();
