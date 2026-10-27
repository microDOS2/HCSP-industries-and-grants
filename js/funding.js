// ═══ Part III — Funding: §8 landscape fate board · §9 grant register + access architecture · §10 pursuits + deadline wall ═══

/* ────────────────────────────────────────────────────────────
   §8 · 2026 fate board — contracting climate-era money vs expanding PFAS pools
──────────────────────────────────────────────────────────── */
(function () {
  const strip = document.getElementById("fate-strip");
  if (strip) {
    const M = [
      { v: "$11.3B", neg: true, l: "DOE demonstration awards terminated (2025)", d: "24 OCED awards (~$3.7B) terminated May 2025, ~$7.56B more across DOE offices in Oct 2025; the office itself was abolished in November.", src: ["K106"] },
      { v: "781", neg: true, l: "EPA environmental-justice grants terminated", d: "OBBBA (P.L. 119-21) rescinded unobligated IRA climate-justice appropriations; the Office of Environmental Justice is closed. Dead money — never a fit for a for-profit vendor.", src: ["K105"] },
      { v: "$37.33B", l: "Known addressable pools across the register", d: "Sum of disclosed award pools — grants, forgivable SRF tranches, WIFIA credit capacity, and settlement funds — across the 80-program register. Not exhaustive; loans and settlements included.", src: ["K149"] },
      { v: "$12.75B+", l: "Settlement funds in flight to water systems", d: "3M $10.5–12.5B over 13 years (>$3.5B already paid) plus DuPont/Chemours/Corteva $1.185B, Tyco $750M, BASF $316.5M. Administrators pay utilities, not vendors — sell downstream of the checks.", src: ["K111"] },
    ];
    strip.innerHTML = M.map((m, i) => `<div class="m" data-i="${i}"><div class="v"${m.neg ? ' style="color:var(--neg)"' : ""}>${m.v}</div><div class="k">${m.l}</div></div>`).join("");
    strip.querySelectorAll(".m").forEach(el => {
      const m = M[+el.dataset.i];
      el.style.cursor = "pointer"; el.setAttribute("data-drill-keep", "");
      el.onclick = e => U.showDrill({ title: "THE 2026 LANDSCAPE", value: m.v, sub: m.d, source: CH.srcStr(m.src), x: e.clientX, y: e.clientY });
    });
  }

  const board = document.getElementById("fate-board");
  if (!board) return;
  const groups = [
    { key: "died", head: "DIED · PAUSED · CLOSED", cls: "fate-died", sum: "the strategic error is writing proposals to dead programs" },
    { key: "restored", head: "INTERRUPTED → RESTORED", cls: "fate-restored", sum: "court- and Congress-driven revivals" },
    { key: "expanding", head: "EXPANDING — THE PFAS POOLS", cls: "fate-expanding", sum: "counter-cyclical: destruction is moving from pilot novelty to funded line item" },
  ];
  board.innerHTML = groups.map(g => {
    const items = RPT.funding_landscape.filter(f => f.fate === g.key);
    return `<div class="fate-col ${g.cls}">
      <p class="fate-head">${g.head} <span class="fate-n">${items.length}</span></p>
      ${items.map((f, i) => `<div class="fate-item" data-g="${g.key}" data-i="${i}" data-drill-keep="">
        <p class="f-name">${f.name}</p>
        <p class="f-amt">${f.amount}</p>
      </div>`).join("")}
      <p class="fate-sum">${g.sum}</p>
    </div>`;
  }).join("");
  board.querySelectorAll(".fate-item").forEach(el => {
    const f = RPT.funding_landscape.filter(x => x.fate === el.dataset.g)[+el.dataset.i];
    el.onclick = e => U.showDrill({
      title: f.name.toUpperCase(), value: f.amount,
      sub: f.note, source: CH.srcStr(f.src), x: e.clientX, y: e.clientY,
    });
  });
})();

/* ────────────────────────────────────────────────────────────
   §9 · Access architecture — three modes, sized by pursuit-effort allocation,
        anchored on the Orlando CWSRF → 374Water conversion chain
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("access-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "The access architecture: 40/35/25, and the Orlando template to replicate",
    sub: "LANE WIDTH = SHARE OF PURSUIT EFFORT (%) · ORLANDO CHAIN NODE AREA ∝ DOLLARS · CLICK EVERY LANE AND NODE",
    src: "Industry & official — Orlando/FL DEP award records, OC San RISE, MN LCCMR, DoD AFFF program (K114, K115, K143, K144, K133)",
  });
  const W = 880, H = 470;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkMd = "#42566a", inkLo = "#8595a6", blue = "#2251ff", lineLo = "#eef1f6";

  // ── upper flow: 100% pursuit effort → three access modes ──
  const LX = 40, LW = 150, MX = 560, MW = 280; // left bar / mode nodes
  const laneTotal = 240, top0 = 46;
  const modes = RPT.access_modes; // b(40) a(35) c(25) — display order: b, a, c
  let acc = 0;
  const lanes = modes.map(m => {
    const h = laneTotal * m.effort / 100;
    const L = { ...m, y0: top0 + acc, h };
    acc += h;
    return L;
  });

  // source bar
  svg.append("rect").attr("x", LX).attr("y", top0).attr("width", 26).attr("height", laneTotal)
    .attr("fill", "#fff").attr("stroke", ink).attr("stroke-width", 1.4);
  svg.append("text").attr("x", LX + 13).attr("y", top0 + laneTotal / 2).attr("text-anchor", "middle")
    .attr("transform", `rotate(-90 ${LX + 13} ${top0 + laneTotal / 2})`)
    .attr("font-family", CH.MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", inkMd)
    .text("100% OF PURSUIT EFFORT");
  svg.append("text").attr("x", LX).attr("y", top0 - 10)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo)
    .text("~90% OF THE DOLLARS FLOW TO UTILITIES & PUBLIC SYSTEMS, NOT VENDORS");

  lanes.forEach((L, i) => {
    const col = L.tone === "lead" ? blue : inkMd;
    const my = L.y0, mh = L.h - 8, nyc = my + mh / 2;
    // lane: trapezoid from source bar to node
    const laneG = svg.append("g").style("opacity", 0);
    laneG.append("path")
      .attr("d", `M${LX + 26},${my} L${MX},${my} L${MX},${my + mh} L${LX + 26},${my + mh} Z`)
      .attr("fill", L.tone === "lead" ? "rgba(34,81,255,.07)" : "rgba(66,86,106,.05)")
      .attr("stroke", col).attr("stroke-width", 1).attr("stroke-dasharray", L.tone === "lead" ? null : "4 3");
    laneG.append("text").attr("x", (LX + 26 + MX) / 2 - 90).attr("y", nyc + 3)
      .attr("font-family", CH.MONO).attr("font-size", 13).attr("font-weight", 700).attr("fill", col)
      .text(L.effort + "%");
    // mode node
    const node = svg.append("g").style("opacity", 0);
    node.append("rect").attr("x", MX).attr("y", my).attr("width", MW).attr("height", mh)
      .attr("fill", "#fff").attr("stroke", col).attr("stroke-width", L.tone === "lead" ? 1.8 : 1.1);
    const tall = mh > 62;
    node.append("text").attr("x", MX + 12).attr("y", my + (tall ? 19 : 14))
      .attr("font-family", CH.MONO).attr("font-size", tall ? 9 : 7.6).attr("font-weight", 700).attr("fill", col)
      .text("MODE (" + L.mode + ") · " + L.effort + "% OF EFFORT");
    // wrapped name (max ~2 lines)
    const words = L.name.split(" "); let l1 = "", l2 = "";
    words.forEach(w => { if ((l1 + " " + w).trim().length <= (tall ? 34 : 30) && !l2) l1 = (l1 + " " + w).trim(); else l2 = (l2 + " " + w).trim(); });
    const nf = tall ? 13.5 : 11.5;
    node.append("text").attr("x", MX + 12).attr("y", my + (tall ? 38 : 30))
      .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", nf).attr("fill", ink).text(l1);
    if (l2) node.append("text").attr("x", MX + 12).attr("y", my + (tall ? 53 : 43))
      .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", nf).attr("fill", ink).text(l2);
    if (tall) {
      const tag = { b: "WHERE THE BIG MONEY IS — THE UTILITY WRITES THE PROPOSAL", a: "CREDIBILITY PLAYS — DIRECT APPLICATIONS, ACTIONABLE NOW", c: "A REVENUE CHANNEL DISGUISED AS A GRANTS CHANNEL" }[L.mode];
      node.append("text").attr("x", MX + 12).attr("y", my + mh - 9)
        .attr("font-family", CH.MONO).attr("font-size", 7.6).attr("fill", inkLo).text(tag);
    }
    const drillData = () => ({
      title: "ACCESS MODE (" + L.mode + ") — " + L.effort + "% OF EFFORT", value: L.name,
      sub: L.gist + " " + L.template, source: CH.srcStr(L.src),
    });
    CH.drill(laneG, drillData); CH.drill(node, drillData);
    if (CH.REDUCE) { laneG.style("opacity", 1); node.style("opacity", 1); }
    else { laneG.transition().delay(200 + i * 180).duration(400).style("opacity", 1); node.transition().delay(300 + i * 180).duration(400).style("opacity", 1); }
  });

  // ── lower band: the Orlando conversion chain (node area ∝ dollars) ──
  const cy = 372;
  svg.append("text").attr("x", LX).attr("y", 318)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", blue)
    .text("THE ORLANDO TEMPLATE — ONE ANCHOR UTILITY PER STATE PROGRAM, THEN REPLICATE");
  svg.append("line").attr("x1", LX).attr("x2", W - 40).attr("y1", 326).attr("y2", 326).attr("stroke", lineLo);

  const chain = [
    { lab: "CWSRF-BIL GRANT", val: "~$0.8M", date: "FEB 2024", r: Math.sqrt(0.8) * 26,
      sub: "The City of Orlando secured a federal BIL grant through Florida's CWSRF (~$800K, February 2024) to fund an SCWO demonstration by 374Water at its Iron Bridge facility. The utility wrote the proposal; the vendor supplied the engineering package.", src: ["K114"] },
    { lab: "WDS SERVICE LICENSE", val: "5 YEARS", date: "MAR 2026", r: Math.sqrt(2.5) * 26,
      sub: "The funded demonstration converted into a five-year waste-destruction-services license (March 2026) — grant-funded proof converting into recurring service revenue.", src: ["K115"] },
    { lab: "FULL-SCALE PFAS HUB", val: "$3–5M", date: "JUN 2026", r: Math.sqrt(4) * 26,
      sub: "Then a $3M–$5M full-scale PFAS destruction hub (June 2026). The pattern repeats: OC San's 6-ton/day RISE demonstration and Minnesota's ENRTF-funded SCWO biosolids project (Dec 2025).", src: ["K115", "K144", "K143"] },
  ];
  const xs = [200, 470, 740];
  chain.forEach((c, i) => {
    const g = svg.append("g").style("opacity", 0);
    g.append("circle").attr("cx", xs[i]).attr("cy", cy).attr("r", c.r)
      .attr("fill", i === 2 ? "rgba(34,81,255,.10)" : "#fff").attr("stroke", blue).attr("stroke-width", 1.6);
    g.append("text").attr("x", xs[i]).attr("y", cy - 3).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 11).attr("font-weight", 700).attr("fill", blue).text(c.val);
    g.append("text").attr("x", xs[i]).attr("y", cy + 11).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkMd).text(c.date);
    const lt = g.append("text").attr("x", xs[i]).attr("y", cy + c.r + 16).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("font-weight", 700).attr("fill", ink).text(c.lab);
    CH.halo(lt);
    if (i < 2) {
      g.append("line").attr("x1", xs[i] + c.r + 6).attr("x2", xs[i + 1] - chain[i + 1].r - 14).attr("y1", cy).attr("y2", cy)
        .attr("stroke", inkMd).attr("stroke-width", 1.2);
      g.append("path").attr("d", `M${xs[i + 1] - chain[i + 1].r - 14},${cy - 4} L${xs[i + 1] - chain[i + 1].r - 6},${cy} L${xs[i + 1] - chain[i + 1].r - 14},${cy + 4} Z`)
        .attr("fill", inkMd);
    }
    CH.drill(g, () => ({ title: "ORLANDO TEMPLATE · " + c.lab, value: c.val + " · " + c.date, sub: c.sub, source: CH.srcStr(c.src) }));
    if (CH.REDUCE) g.style("opacity", 1);
    else g.transition().delay(900 + i * 220).duration(400).style("opacity", 1);
  });
  svg.append("text").attr("x", LX).attr("y", 452)
    .attr("font-family", CH.MONO).attr("font-size", 8).attr("fill", inkLo)
    .text("FUNDED DEMONSTRATION → SERVICE LICENSE → HUB · THE GRANT PROPOSAL IS WRITTEN BY THE UTILITY; THE VENDOR SUPPLIES THE WINNING EVIDENCE");
})();

/* ────────────────────────────────────────────────────────────
   §9 · The Grant Register — 80 programs, searchable / filterable / sortable
──────────────────────────────────────────────────────────── */
(function () {
  const table = document.getElementById("grant-table");
  const tools = document.getElementById("grant-tools");
  if (!table || !tools) return;
  const rows = RPT.grants_register;

  const ST_SHORT = { "ACTIVE": "ACTIVE", "OPEN-DEADLINE": "OPEN · DUE", "WATCH": "WATCH", "PAUSED": "PAUSED", "CLOSED": "CLOSED", "DEAD": "DEAD" };
  const AC_SHORT = { "Yes": "DIRECT", "No—via utility partner": "VIA UTILITY", "No—via other partner": "VIA PARTNER", "No": "CLOSED" };
  const uniq = k => [...new Set(rows.map(r => r[k]))];

  tools.innerHTML = `
    <input type="search" id="gq" placeholder="Search program, agency, notes…" aria-label="Search the register">
    <select id="gf-level" aria-label="Filter by level"><option value="">LEVEL · ALL</option>${uniq("level").map(v => `<option>${v}</option>`).join("")}</select>
    <select id="gf-type" aria-label="Filter by type"><option value="">TYPE · ALL</option>${uniq("type").map(v => `<option>${v}</option>`).join("")}</select>
    <select id="gf-status" aria-label="Filter by status"><option value="">STATUS · ALL</option>${["ACTIVE", "OPEN-DEADLINE", "WATCH", "PAUSED", "CLOSED", "DEAD"].map(v => `<option>${v}</option>`).join("")}</select>
    <select id="gf-access" aria-label="Filter by access"><option value="">ACCESS · ALL</option>${["Yes", "No—via utility partner", "No—via other partner", "No"].map(v => `<option value="${v}">${AC_SHORT[v]}</option>`).join("")}</select>
    <select id="gf-match" aria-label="Filter by match score"><option value="0">MATCH · ALL</option><option value="5">5 ONLY</option><option value="4">≥ 4</option><option value="3">≥ 3</option></select>
    <span class="grant-count" id="grant-count"></span>`;

  const COLS = [
    { k: "id", lab: "ID", num: true }, { k: "program", lab: "Program" }, { k: "level", lab: "Level" },
    { k: "type", lab: "Type" }, { k: "award", lab: "Award size" }, { k: "access", lab: "Access" },
    { k: "status", lab: "2026 status" }, { k: "deadline", lab: "Deadline / cycle" }, { k: "match", lab: "Match", num: true },
  ];
  let sortK = "match", sortDir = -1;
  table.innerHTML = "<thead><tr>" + COLS.map(c =>
    `<th class="sortable" data-k="${c.k}">${c.lab} <span class="sort-ind"></span></th>`).join("") + "</tr></thead><tbody></tbody>";

  function view() {
    const q = (document.getElementById("gq").value || "").toLowerCase();
    const fl = document.getElementById("gf-level").value, ft = document.getElementById("gf-type").value,
      fs = document.getElementById("gf-status").value, fa = document.getElementById("gf-access").value,
      fm = +document.getElementById("gf-match").value;
    let out = rows.filter(r =>
      (!q || (r.id + " " + r.program + " " + r.agency + " " + r.notes + " " + r.fit + " " + r.vertical).toLowerCase().includes(q)) &&
      (!fl || r.level === fl) && (!ft || r.type === ft) && (!fs || r.status === fs) && (!fa || r.access === fa) &&
      (!fm || (fm === 5 ? r.match === 5 : r.match >= fm)));
    out.sort((a, b) => {
      const va = a[sortK], vb = b[sortK];
      return (typeof va === "number" ? va - vb : String(va).localeCompare(String(vb))) * sortDir;
    });
    return out;
  }

  function render() {
    const out = view();
    table.querySelector("tbody").innerHTML = out.map(r =>
      `<tr data-id="${r.id}" class="${r.status === "DEAD" || r.status === "CLOSED" ? "bad" : r.match === 5 && (r.status === "ACTIVE" || r.status === "OPEN-DEADLINE") ? "hl" : ""}" data-drill-keep="" style="cursor:pointer">
        <td class="num">${r.id}</td>
        <td><b>${r.program}</b><br><span class="g-ag">${r.agency}</span></td>
        <td>${r.level}</td>
        <td>${r.type}</td>
        <td class="num g-award">${r.award}</td>
        <td><span class="g-ac g-ac-${r.access === "Yes" ? "y" : "n"}">${AC_SHORT[r.access] || r.access}</span></td>
        <td class="num"><span class="st-dot st-${r.status}"></span>${ST_SHORT[r.status]}</td>
        <td class="g-dl">${r.deadline}</td>
        <td class="num"><span class="match-dots">${"●".repeat(r.match)}${"○".repeat(5 - r.match)}</span></td>
      </tr>`).join("");
    document.getElementById("grant-count").textContent = out.length + " OF " + rows.length + " PROGRAMS";
    table.querySelectorAll("th.sortable").forEach(th => {
      th.querySelector(".sort-ind").textContent = th.dataset.k === sortK ? (sortDir > 0 ? "▲" : "▼") : "";
    });
    table.querySelectorAll("tbody tr").forEach(tr => {
      const r = rows.find(x => x.id === tr.dataset.id);
      tr.onclick = e => U.showDrill({
        title: r.id + " · " + r.program.toUpperCase(),
        value: r.award,
        sub: r.notes + " · Access: " + r.access + ". Fit: " + r.fit + " — " + r.vertical + ". Next: " + r.deadline + ".",
        source: CH.srcStr(r.src) + (r.url ? " · " + r.url : ""),
        x: e.clientX, y: e.clientY,
      });
    });
  }

  tools.querySelectorAll("input,select").forEach(el => el.addEventListener("input", render));
  table.querySelectorAll("th.sortable").forEach(th => th.onclick = () => {
    if (sortK === th.dataset.k) sortDir *= -1; else { sortK = th.dataset.k; sortDir = th.dataset.k === "match" ? -1 : 1; }
    render();
  });
  render();
})();

/* ────────────────────────────────────────────────────────────
   §10 · Top-15 pursuits board
──────────────────────────────────────────────────────────── */
(function () {
  const t = document.getElementById("top15-table");
  if (!t) return;
  const AC_SHORT = { "Yes": "DIRECT", "No—via utility partner": "VIA UTILITY", "No—via other partner": "VIA PARTNER", "No": "CLOSED" };
  t.innerHTML = `<thead><tr><th>#</th><th>Program</th><th>Award size</th><th>Access</th><th>Deadline / cycle</th><th>Match</th><th>Why now</th></tr></thead>` +
    "<tbody>" + RPT.grants_top15.map((r, i) =>
      `<tr data-i="${i}" class="${r.rank <= 2 ? "hl" : ""}" data-drill-keep="" style="cursor:pointer">
        <td class="num t15-rank">${r.rank}</td>
        <td><b>${r.program}</b><br><span class="g-ag">${r.type} · ${r.status}</span></td>
        <td class="num g-award">${r.award}</td>
        <td><span class="g-ac g-ac-${r.access === "Yes" ? "y" : "n"}">${AC_SHORT[r.access] || r.access}</span></td>
        <td class="g-dl">${r.deadline}</td>
        <td class="num"><span class="match-dots">${"●".repeat(r.match)}${"○".repeat(5 - r.match)}</span></td>
        <td class="g-why">${r.why}</td>
      </tr>`).join("") + "</tbody>";
  t.querySelectorAll("tr[data-i]").forEach(tr => {
    const r = RPT.grants_top15[+tr.dataset.i];
    tr.onclick = e => U.showDrill({
      title: "PURSUIT #" + r.rank + " · " + r.program.toUpperCase(),
      value: r.award,
      sub: r.why + " · Type: " + r.type + ". Access: " + r.access + ". Status: " + r.status + ". Next: " + r.deadline + ". Match " + r.match + "/5.",
      source: CH.srcStr(r.src), x: e.clientX, y: e.clientY,
    });
  });
})();

/* ────────────────────────────────────────────────────────────
   §10 · The 12-month deadline wall (piecewise time scale, urgent flags)
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("fundwall-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Twelve months of dated pursuits — rolling federal cycles through 2027",
    sub: "WALL-CHART TIMELINE SEP 2026 – Q3 2027 · SOLID BLUE = HARD DEADLINE · INK = EXPECTED CYCLE · DASHED = PROGRAM STILL FORMING · MUTED RED, STRUCK = CLOSED (DEADLINE PASSED SEP 2026) · ⚑ = MISSING IT COSTS A FULL ANNUAL CYCLE · CLICK PLAQUES",
    src: "Industry & official — agency NOFO pages, settlement administrators, state program bulletins · dates as published (K116–K132)",
  });
  const W = 880, H = 420, axisY = 342;
  // piecewise scale: Sep 2026–Feb 2027 expanded (deadline cluster), Mar–Sep 2027 compressed
  const x = v => v <= 2027.15 ? 56 + (v - 2026.6) / 0.55 * 560 : 616 + (v - 2027.15) / 0.65 * 208;
  const svg = CH.svg(body, W, H);
  const ink = "#051c2c", inkLo = "#8595a6", blue = "#2251ff", closedCol = "#c22f4e";
  const clsCol = { hard: blue, window: ink, forming: inkLo };

  // "now" marker (compiled September 2026)
  svg.append("rect").attr("x", x(2026.7)).attr("y", 26).attr("width", x(2026.78) - x(2026.7)).attr("height", axisY - 22)
    .attr("fill", "rgba(34,81,255,.06)");
  svg.append("text").attr("x", (x(2026.7) + x(2026.78)) / 2).attr("y", 20).attr("text-anchor", "middle")
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("font-weight", 700).attr("fill", blue).text("NOW · SEP 2026");

  // axis
  svg.append("line").attr("x1", 40).attr("x2", W - 16).attr("y1", axisY).attr("y2", axisY).attr("stroke", ink).attr("stroke-width", 1.6);
  svg.append("line").attr("x1", 40).attr("x2", W - 16).attr("y1", axisY + 4).attr("y2", axisY + 4).attr("stroke", ink).attr("stroke-width", 1);
  const ticks = [[2026.75, "OCT 26"], [2026.92, "DEC 26"], [2027.05, "JAN 27"], [2027.2, "MAR 27"], [2027.45, "JUN 27"], [2027.7, "SEP 27"]];
  ticks.forEach(([v, lab]) => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", axisY - 4).attr("y2", axisY + 9).attr("stroke", ink);
    svg.append("text").attr("x", x(v)).attr("y", axisY + 24).attr("text-anchor", "middle")
      .attr("font-family", CH.MONO).attr("font-size", 9).attr("fill", inkLo).text(lab);
  });

  // greedy plaque layering
  const layers = [];
  const placed = RPT.funding_calendar.map(c => {
    const wpx = Math.max(76, c.label.length * 6.6 + 20);
    const cx = U.clamp(x(c.y), 40 + wpx / 2, W - 16 - wpx / 2);
    let li = 0;
    for (;;) {
      if (!layers[li] || cx - wpx / 2 > layers[li] + 10) { layers[li] = cx + wpx / 2; break; }
      li++;
    }
    return { ...c, wpx, cx, li };
  });
  const layerY = li => 288 - li * 56;
  const stemG = svg.append("g"), plqG = svg.append("g");

  placed.forEach((p, i) => {
    const py = layerY(p.li), col = p.closed ? closedCol : clsCol[p.cls];
    stemG.append("line").attr("x1", p.cx).attr("x2", p.cx).attr("y1", py + 22).attr("y2", axisY - 2)
      .attr("stroke", col).attr("stroke-width", 0.9).attr("opacity", p.closed ? 0.35 : 0.55);
    stemG.append("circle").attr("cx", p.cx).attr("cy", axisY).attr("r", p.cls === "hard" ? 3.4 : 2.6)
      .attr("fill", p.closed ? "none" : col).attr("stroke", p.closed ? col : null).attr("stroke-width", p.closed ? 1.4 : null);
    const g = plqG.append("g").style("opacity", 0);
    g.append("rect").attr("x", p.cx - p.wpx / 2).attr("y", py - 14).attr("width", p.wpx).attr("height", 38)
      .attr("rx", 2).attr("fill", "#fff").attr("stroke", col)
      .attr("stroke-width", p.cls === "hard" && !p.closed ? 1.8 : 1.1)
      .attr("stroke-dasharray", p.cls === "forming" ? "5 3" : p.closed ? "3 3" : null);
    g.append("text").attr("x", p.cx - p.wpx / 2 + 7).attr("y", py - 1)
      .attr("font-family", CH.MONO).attr("font-size", 8).attr("font-weight", 700).attr("fill", col)
      .text(p.closed ? "CLOSED · " + p.date.toUpperCase() : (p.urgent ? "⚑ " : "") + p.date.toUpperCase());
    g.append("text").attr("x", p.cx - p.wpx / 2 + 7).attr("y", py + 14)
      .attr("font-family", CH.SERIF).attr("font-weight", 700).attr("font-size", 10.5).attr("fill", p.closed ? inkLo : ink)
      .attr("text-decoration", p.closed ? "line-through" : null).text(p.label);
    CH.drill(g, () => ({
      title: p.date.toUpperCase() + " · " + p.label.toUpperCase(),
      value: p.closed ? "CLOSED — DEADLINE PASSED SEP 2026" : p.urgent ? "⚑ HARD DEADLINE — ANNUAL CYCLE" : p.cls === "hard" ? "HARD DEADLINE" : p.cls === "forming" ? "PROGRAM FORMING — ENGAGE NOW" : "EXPECTED CYCLE",
      sub: p.ev, source: CH.srcStr(p.src),
    }));
    if (CH.REDUCE) g.style("opacity", 1);
    else g.transition().delay(i * 100).duration(350).style("opacity", 1);
  });

  svg.append("text").attr("x", 56).attr("y", axisY + 42)
    .attr("font-family", CH.MONO).attr("font-size", 8.5).attr("fill", inkLo)
    .text("RULE 1: DWPR + ONR BAA CLOSED SEP 2026 (ANNUAL CYCLES — TRACK FY2027) · SEQUENCE Q4→Q3 PER THE STACKING CALENDAR · ONE ANCHOR UTILITY PER STATE PROGRAM");
})();
