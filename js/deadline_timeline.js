// ═══ §10 · Key dates ahead — a clean, readable vertical timeline ═══
// Replaces the old SVG deadline wall chart. All 25 dated events:
// RPT.funding_calendar (12) + RPT.catalysts (13). CLOSED items (DWPR
// 2026-09-29, ONR 2026-09-30) sit at the top in muted semantic red, struck
// through and marked CLOSED; everything else is grouped by year
// (already in force · 2026 · 2027 and beyond). Every row drills to its dated
// K-source. Pure DOM: static in every mode (including reading mode),
// ≥13px text, AA contrast, no canvas/SVG overflow risk.
// Toggle: "Timeline (readable)" (default) ⇄ "3D wall" (switches the
// js/fund3d.js explorer in §9 to its wall view and scrolls to it).
(function () {
  "use strict";
  const host = document.getElementById("deadline-timeline");
  if (!host) return;

  /* ── plain-English "what to do" per dated funding event (mirrors the
     §10 immediate-actions prose; catalysts carry their own `act` field) ── */
  const WALL_ACT = {
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

  const TAG = { policy: "POLICY", demand: "DEMAND", risk: "RISK / COMPETITION", fund: "FUNDING DEADLINE" };

  /* dated source links for the drill-down (K# · publisher (date) ↗) */
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function uniq(a) { const seen = {}, out = []; a.forEach(x => { if (!seen[x]) { seen[x] = 1; out.push(x); } }); return out; }
  function srcDated(ids) {
    return uniq(ids || []).map(id => {
      const s = window.K ? window.K(id) : null;
      if (!s) return esc(id);
      const label = String(s.cite || "").split(",")[0].split("(")[0].trim();
      const date = s.date ? " (" + esc(s.date) + ")" : "";
      if (s.url) {
        return '<a class="src-link" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
          esc(s.k) + " · " + esc(label) + " ↗</a>" + date;
      }
      return '<span class="src-derived">' + esc(s.k) + " · " + esc(label) + date + " — derived analysis</span>";
    }).join(" · ");
  }

  const body = U.frame(host, {
    title: null,
    sub: null,
    src: "Industry & official — agency grant-notice pages, settlement administrators, state program bulletins, US EPA, Defense Dept, EU wastewater directive 2024/3019, India's pollution board · dates as published (K116–K132, K5–K63)",
  });

  /* ── view toggle: readable timeline (default) ⇄ the 3D wall in §9 ── */
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

  /* ── merge the two dated datasets into one 25-event list ── */
  const events = RPT.catalysts.map(c => ({
    y: c.y, date: c.date, label: c.label, mean: c.mean || c.ev, act: c.act || null,
    cls: c.cls, closed: false, ev: c.ev, src: c.src,
  }));
  RPT.funding_calendar.forEach(c => {
    events.push({
      y: c.y, date: c.date, label: c.label, mean: c.ev, act: WALL_ACT[c.label] || null,
      cls: "fund", closed: !!c.closed, ev: c.ev, src: c.src,
    });
  });

  const closed = events.filter(e => e.closed).sort((a, b) => a.y - b.y);
  const open = events.filter(e => !e.closed).sort((a, b) => a.y - b.y);

  const tl = document.createElement("div");
  tl.className = "tl";

  function addRow(e) {
    const row = document.createElement("div");
    row.className = "tl-row tl-" + e.cls + (e.closed ? " tl-closed" : "");
    row.setAttribute("data-drill-keep", "");
    row.setAttribute("tabindex", "0");

    const when = document.createElement("div");
    when.className = "tl-when";
    const dt = document.createElement("span");
    dt.className = "tl-date"; dt.textContent = e.date;
    when.appendChild(dt);
    const tag = document.createElement("span");
    tag.className = "tl-tag"; tag.textContent = e.closed ? "CLOSED" : TAG[e.cls];
    when.appendChild(tag);

    const main = document.createElement("div");
    main.className = "tl-main";
    const nm = document.createElement("p");
    nm.className = "tl-name"; nm.textContent = e.label;
    const mn = document.createElement("p");
    mn.className = "tl-mean"; mn.textContent = e.mean;
    main.appendChild(nm); main.appendChild(mn);
    if (e.act) {
      const act = document.createElement("p");
      act.className = "tl-act";
      const lab = document.createElement("b");
      lab.textContent = "What to do: ";
      act.appendChild(lab);
      act.appendChild(document.createTextNode(e.act));
      main.appendChild(act);
    }

    row.appendChild(when); row.appendChild(main);
    const drillArgs = (x, y) => ({
      title: `${e.date} · ${e.label.toUpperCase()}`,
      value: e.closed ? "CLOSED — DEADLINE PASSED SEP 2026" : TAG[e.cls],
      sub: (e.closed ? "" : (e.mean && e.mean !== e.ev ? e.mean + " " : "")) + e.ev + (e.act ? " What to do: " + e.act : ""),
      source: srcDated(e.src), x, y,
    });
    row.addEventListener("click", ev => {
      ev.stopPropagation();
      U.showDrill(drillArgs(ev.clientX, ev.clientY));
    });
    row.addEventListener("keydown", ev => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault(); ev.stopPropagation();
        const r = row.getBoundingClientRect();
        U.showDrill(drillArgs(r.left + r.width / 2, r.top + r.height / 2));
      }
    });
    return row;
  }

  function groupHead(txt, cls) {
    const h = document.createElement("h4");
    h.className = "tl-group" + (cls ? " " + cls : "");
    h.textContent = txt;
    tl.appendChild(h);
  }

  // CLOSED items first — honest about what has already passed
  if (closed.length) {
    groupHead("Closed — deadlines already passed", "tl-group-closed");
    closed.forEach(e => tl.appendChild(addRow(e)));
  }

  // then everything open: already-in-force history, then by year (2026 / 2027+)
  const buckets = [
    { test: e => e.y < 2026, head: "2023–2025 · already in force" },
    { test: e => e.y >= 2026 && e.y < 2027, head: "2026" },
    { test: e => e.y >= 2027, head: "2027 and beyond" },
  ];
  buckets.forEach(b => {
    const rows = open.filter(b.test);
    if (!rows.length) return;
    groupHead(b.head);
    rows.forEach(e => tl.appendChild(addRow(e)));
  });

  body.appendChild(tl);
})();
