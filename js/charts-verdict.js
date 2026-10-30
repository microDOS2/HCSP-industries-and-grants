// ═══ §5 verdict: plain-language decision board + regulatory catalyst horizon (P3 wall chart) ═══

/* ────────────────────────────────────────────────────────────
   10 · The bottom line — what to do, in what order.
   A plain decision board: three groups, one sentence per market,
   every score/condition drillable to its dated K-source.
   (Replaces the old balance-scale graphic; scores and sources unchanged.)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("verdict-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The bottom line: start with three markets, prove reliability, then expand.",
    sub: "A PLAIN DECISION BOARD · SCORE OUT OF 10 FROM THE FIFTEEN-INDUSTRY RANKING · CLICK ANY ROW FOR THE FULL EVIDENCE AND ITS DATED SOURCES",
    src: "Research compilation — report Ch. 10 synthesis (2026-09); every score and condition traces to a K anchor",
  });

  const byKey = {};
  RPT.league.forEach(d => { byKey[d.key] = d; });

  // Board content: plain-English names, one-sentence whys, and "what has to
  // happen first" conditions — all drawn from the existing ranking data (RPT.league).
  const GROUPS = [
    {
      cls: "go", head: "1 · GO NOW — strongest fit",
      note: "Enter these three markets directly, selling a destruction service priced well under what disposal costs today.",
      rows: [
        { key: "pfas", name: "PFAS destruction & landfill leachate",
          why: "Regulation forces the cleanup, federally witnessed tests show 99.9993% destruction, and today's disposal costs $1–28 per gallon." },
        { key: "defense", name: "Defense, maritime & remote sites",
          why: "The Defense Department alone owes more than $9.3B of PFAS cleanup across 718 installations, and remote sites pay 2–5× normal prices." },
        { key: "textile", name: "Textile & dyeing clusters — India",
          why: "Courts already force these clusters to run zero-discharge plants that still cannot destroy the leftover brine and sludge." },
      ],
    },
    {
      cls: "next", head: "2 · GO NEXT — after prototypes and pilot results",
      note: "Strong scores, but the money waits until working prototypes and published pilot data prove the machines run reliably.",
      rows: [
        { key: "chem", name: "Chemical & hazardous waste",
          why: "Getting rid of halogenated solvents costs $15–50+ per gallon, and the existing incinerators are running almost full." },
        { key: "pharma", name: "Pharma & biotech",
          why: "Solvent and drug-ingredient disposal costs $1.5–15 per gallon, and new rules make proven destruction worth paying for." },
        { key: "distill", name: "Distillery & ethanol vinasse",
          why: "Spent wash is strong enough to power its own treatment and export electricity, and India is forcing about 270 distilleries to comply." },
        { key: "semi", name: "Semiconductor side-streams",
          why: "New fabs face PFAS permit fights and pay $1.8–4 per gallon to get rid of solvent and polishing side-streams.",
          first: "Side-streams only — the fabs' bulk wastewater is far too dilute to pay." },
        { key: "bio", name: "Municipal biosolids — crisis regions",
          why: "US cities spend $4.8B a year on sludge disposal, and PFAS worries are closing the cheap routes.",
          first: "Only where disposal costs are already high — the Northeast, Florida, California." },
        { key: "fnb", name: "Food & beverage side-streams",
          why: "Concentrated side-streams already cost $45–120 per 1,000 gallons to haul away.",
          first: "Stick to concentrated side-streams; digesters own the bulk wastewater." },
        { key: "islands", name: "Islands & resorts",
          why: "The only market where power, water, and cooling all sell at near world-maximum prices.",
          first: "The waste arrives too weak — fats, oil, and food waste must be blended in." },
      ],
    },
    {
      cls: "cond", head: "3 · ONLY IF CONDITIONS ARE RIGHT",
      note: "No revenue plan by default — pursue only where the stated condition holds.",
      rows: [
        { key: "og", name: "Produced water — Marcellus hub niche",
          why: "Real only where trucking disposal costs $3–15 a barrel (the Marcellus region); cheap Permian pipelines kill the idea elsewhere.",
          first: "Only large 50–100K barrel-a-day hub projects in the Marcellus region qualify." },
        { key: "cea", name: "Indoor agriculture (CEA)",
          why: "The wastewater is 99.8% water — too weak to power the process — and most customers are short of cash.",
          first: "A regulatory showcase under California's zero-waste invitation — never count on it for revenue." },
        { key: "cafo", name: "Factory-farm manure (CAFO)",
          why: "Manure is 85–92% water, and subsidized digesters already monetize the same story better.",
          first: "Only where spreading land runs out — crowded dairy belts." },
        { key: "mining", name: "Mining & remote camps",
          why: "Remote sites pay high prices per unit, but each site is small and buys on the commodity cycle.",
          first: "Opportunistic only — take the work when a site comes to you." },
        { key: "dc", name: "Data centers — as an energy customer, not a host",
          why: "Their on-site waste cannot be treated by this process — but they wait 4–7 years for a grid connection.",
          first: "Build the plant next door at a waste-rich site and sell them power, cooling, and water across the fence." },
      ],
    },
  ];

  const board = document.createElement("div");
  board.className = "vboard";

  GROUPS.forEach(g => {
    const gEl = document.createElement("div");
    gEl.className = "vb-group vb-" + g.cls;
    const h = document.createElement("h3");
    h.className = "vb-head"; h.textContent = g.head;
    const n = document.createElement("p");
    n.className = "vb-note"; n.textContent = g.note;
    gEl.appendChild(h); gEl.appendChild(n);

    g.rows.forEach(r => {
      const d = byKey[r.key];
      if (!d) return;
      const row = document.createElement("div");
      row.className = "vb-row";
      row.setAttribute("data-drill-keep", "");
      const score = document.createElement("span");
      score.className = "vb-score";
      score.textContent = Number.isInteger(d.score) ? d.score.toFixed(1) : String(d.score);
      const txt = document.createElement("span");
      txt.className = "vb-body";
      const nm = document.createElement("span");
      nm.className = "vb-name"; nm.textContent = r.name;
      const wy = document.createElement("span");
      wy.className = "vb-why"; wy.textContent = r.why;
      txt.appendChild(nm); txt.appendChild(wy);
      if (r.first) {
        const f = document.createElement("span");
        f.className = "vb-first"; f.textContent = "First: " + r.first;
        txt.appendChild(f);
      }
      row.appendChild(score); row.appendChild(txt);
      row.addEventListener("click", e => {
        e.stopPropagation();
        U.showDrill({
          title: r.name.toUpperCase(),
          value: d.score + " / 10 · " + g.head.replace(/^\d · /, ""),
          sub: r.why + (r.first ? " What has to happen first: " + r.first : "")
            + " Full rationale: " + d.why + " " + RPT.tiers[d.tier - 1].posture,
          source: CH.srcLink(d.src), x: e.clientX, y: e.clientY,
        });
      });
      gEl.appendChild(row);
    });
    board.appendChild(gEl);
  });

  // ── boxed plain list: what would change this advice ──
  const box = document.createElement("div");
  box.className = "vb-change";
  const bh = document.createElement("h3");
  bh.className = "vb-change-h"; bh.textContent = "What would change this advice";
  box.appendChild(bh);
  const ul = document.createElement("ul");
  RPT.verdict.changes.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c.t;
    li.setAttribute("data-drill-keep", "");
    li.addEventListener("click", e => {
      e.stopPropagation();
      U.showDrill({
        title: "WHAT WOULD CHANGE THIS ADVICE", value: "Tripwire",
        sub: c.t, source: CH.srcLink(c.src), x: e.clientX, y: e.clientY,
      });
    });
    ul.appendChild(li);
  });
  box.appendChild(ul);
  board.appendChild(box);

  body.appendChild(board);

  /* ── tiered standard: the same board as a downloadable data table ── */
  if (window.ViewStd) {
    const tWrap = document.createElement("div");
    tWrap.className = "table-scroll"; tWrap.hidden = true;
    const tbl = document.createElement("table");
    tbl.className = "dt"; tbl.id = "verdict-table";
    const cap = document.createElement("caption");
    cap.textContent = "The decision board as a plain table — the same scores, whys and conditions, sortable and downloadable.";
    tbl.appendChild(cap);
    tbl.innerHTML = "<thead><tr><th>Group</th><th>Industry</th><th>Score /10</th><th>Why</th><th>What has to happen first</th><th>Sources</th></tr></thead>";
    const tb = document.createElement("tbody");
    GROUPS.forEach(g => g.rows.forEach(r => {
      const d = byKey[r.key];
      if (!d) return;
      const tr = document.createElement("tr");
      [g.head.replace(/^\d · /, ""), r.name, String(d.score), r.why, r.first || "—", (d.src || []).join(" · ")].forEach((v, ci) => {
        const c = document.createElement("td");
        if (ci === 2) c.className = "num";
        if (ci === 1) { const b = document.createElement("b"); b.textContent = v; c.appendChild(b); }
        else c.textContent = v;
        tr.appendChild(c);
      });
      tr.style.cursor = "pointer";
      tr.setAttribute("data-drill-keep", "");
      tr.onclick = e => U.showDrill({
        title: r.name.toUpperCase(),
        value: d.score + " / 10 · " + g.head.replace(/^\d · /, ""),
        sub: r.why + (r.first ? " What has to happen first: " + r.first : "")
          + " Full rationale: " + d.why + " " + RPT.tiers[d.tier - 1].posture,
        source: CH.srcLink(d.src), x: e.clientX, y: e.clientY,
      });
      tb.appendChild(tr);
    }));
    tbl.appendChild(tb);
    tWrap.appendChild(tbl);
    body.insertBefore(tWrap, null);
    const vt = ViewStd.makeToggle({
      label: "VIEW",
      views: [["board", "Board"], ["table", "Table"]],
      current: "board",
      onPick: v => {
        const tab = v === "table";
        board.hidden = tab;
        tWrap.hidden = !tab;
      },
    });
    body.insertBefore(vt, board);
  }
})();

/* ────────────────────────────────────────────────────────────
   11 · Key dates ahead — and what they mean for you
   A plain vertical timeline in date order (replaces the wall chart):
   CLOSED items first in muted styling, then every dated catalyst and
   funding deadline grouped by year. Every row drills to its dated K-source.
   Pure DOM — static in every mode, ≥13px body text, AA contrast.
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("horizon-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Key dates ahead — and what they mean for you",
    sub: "EVERY DATED EVENT FROM THE REPORT, IN DATE ORDER · CLOSED ITEMS SHOWN FIRST, MUTED · CLICK ANY ROW FOR THE DETAIL AND ITS DATED SOURCES",
    src: "Industry & official — US EPA, GAO, Defense Dept, WHO, EU wastewater directive 2024/3019, India's pollution board · dates as published",
  });

  const TAG = { policy: "POLICY", demand: "DEMAND", risk: "RISK / COMPETITION", fund: "FUNDING DEADLINE" };

  // Merge the two dated datasets into one event list.
  const events = RPT.catalysts.map(c => ({
    y: c.y, date: c.date, label: c.label, mean: c.mean || c.ev, act: c.act || null,
    cls: c.cls, closed: false, ev: c.ev, src: c.src,
  }));
  RPT.funding_calendar.forEach(c => {
    events.push({
      y: c.y, date: c.date, label: c.label, mean: c.ev, act: null,
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
      value: e.closed ? "CLOSED — ALREADY PASSED" : TAG[e.cls],
      sub: (e.closed ? "" : (e.mean ? e.mean + " " : "")) + e.ev + "." + (e.act ? " What to do: " + e.act : ""),
      source: CH.srcLink(e.src), x, y,
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

  // CLOSED items first — honest about what has already passed
  if (closed.length) {
    const h = document.createElement("h4");
    h.className = "tl-group tl-group-closed";
    h.textContent = "Already passed — closed";
    tl.appendChild(h);
    closed.forEach(e => tl.appendChild(addRow(e)));
  }

  // then everything open, grouped by year
  let lastYear = null;
  open.forEach(e => {
    const yr = Math.floor(e.y);
    if (yr !== lastYear) {
      lastYear = yr;
      const h = document.createElement("h4");
      h.className = "tl-group";
      h.textContent = yr;
      tl.appendChild(h);
    }
    tl.appendChild(addRow(e));
  });

  body.appendChild(tl);

  /* ── tiered standard: the same timeline as a downloadable data table ── */
  if (window.ViewStd) {
    const tWrap = document.createElement("div");
    tWrap.className = "table-scroll"; tWrap.hidden = true;
    const tbl = document.createElement("table");
    tbl.className = "dt"; tbl.id = "horizon-table";
    const cap = document.createElement("caption");
    cap.textContent = "The timeline as a plain table — every dated event, sortable and downloadable.";
    tbl.appendChild(cap);
    tbl.innerHTML = "<thead><tr><th>Date</th><th>Event</th><th>Type</th><th>What it means</th><th>What to do</th><th>Sources</th></tr></thead>";
    const tb = document.createElement("tbody");
    closed.concat(open).forEach(e => {
      const tr = document.createElement("tr");
      if (e.closed) tr.className = "tl-closed";
      [e.date, e.label, e.closed ? "CLOSED" : TAG[e.cls], e.mean || "—", e.act || "—", (e.src || []).join(" · ")].forEach((v, ci) => {
        const c = document.createElement("td");
        if (ci === 1) { const b = document.createElement("b"); b.textContent = v; c.appendChild(b); }
        else c.textContent = v;
        tr.appendChild(c);
      });
      tr.style.cursor = "pointer";
      tr.setAttribute("data-drill-keep", "");
      tr.onclick = ev => {
        ev.stopPropagation();
        U.showDrill({
          title: `${e.date} · ${e.label.toUpperCase()}`,
          value: e.closed ? "CLOSED — ALREADY PASSED" : TAG[e.cls],
          sub: (e.closed ? "" : (e.mean ? e.mean + " " : "")) + e.ev + "." + (e.act ? " What to do: " + e.act : ""),
          source: CH.srcLink(e.src), x: ev.clientX, y: ev.clientY,
        });
      };
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);
    tWrap.appendChild(tbl);
    body.appendChild(tWrap);
    const vt = ViewStd.makeToggle({
      label: "VIEW",
      views: [["timeline", "Timeline"], ["table", "Table"]],
      current: "timeline",
      onPick: v => {
        const tab = v === "table";
        tl.hidden = tab;
        tWrap.hidden = !tab;
      },
    });
    body.insertBefore(vt, tl);
  }
})();
