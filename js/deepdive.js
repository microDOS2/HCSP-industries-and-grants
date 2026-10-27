// ═══ §4B — The field, up close: per-company profiles · cross-company matrix · scale-gap axis · watch items ═══
// Data: RPT.comp_profiles / comp_matrix / scalegap / comp_watch (data.js), sources K151–K166 (sources.js).

/* ────────────────────────────────────────────────────────────
   §4B · Per-company profile blocks — every row drills to dated K-anchors
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("comp-profiles");
  if (!host) return;
  host.className = "cp-grid";
  host.innerHTML = RPT.comp_profiles.map((p, pi) => `
    <article class="comp-prof">
      <p class="cp-name">${p.name}</p>
      <p class="cp-form">${p.form}</p>
      <div class="cp-rows">
        ${p.rows.map((r, ri) => `
          <div class="cp-row" data-p="${pi}" data-r="${ri}" data-drill-keep="">
            <p class="cp-lab">${r.lab.toUpperCase()}<span class="cp-arrow"> →</span></p>
            <p class="cp-txt${r.tone === "bad" ? " tone-bad" : r.tone === "verdict" ? " tone-verdict" : ""}">${r.txt}</p>
          </div>`).join("")}
      </div>
    </article>`).join("");
  host.querySelectorAll(".cp-row").forEach(el => {
    const r = RPT.comp_profiles[+el.dataset.p].rows[+el.dataset.r];
    el.onclick = e => U.showDrill({
      title: r.drill.title, value: r.drill.value, sub: r.drill.sub,
      source: CH.srcStr(r.src), x: e.clientX, y: e.clientY,
    });
  });
})();

/* ────────────────────────────────────────────────────────────
   §4B · Cross-company comparison matrix — every cell drills
──────────────────────────────────────────────────────────── */
(function () {
  const table = document.getElementById("comp-table");
  if (!table) return;
  const M = RPT.comp_matrix;
  table.innerHTML = `
    <thead><tr><th class="cmp-dim"></th>${M.cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>
      ${M.rows.map((row, ri) => `<tr>
        <td class="cmp-dim"><b>${row.dim}</b></td>
        ${row.cells.map((cell, ci) => `<td class="cmp-cell" data-r="${ri}" data-c="${ci}" data-drill-keep="">${cell.txt}</td>`).join("")}
      </tr>`).join("")}
    </tbody>`;
  table.querySelectorAll(".cmp-cell").forEach(td => {
    const row = M.rows[+td.dataset.r], cell = row.cells[+td.dataset.c];
    td.onclick = e => U.showDrill({
      title: M.cols[+td.dataset.c].toUpperCase() + " · " + row.dim.toUpperCase(),
      value: row.dim, sub: cell.txt,
      source: CH.srcStr(cell.src), x: e.clientX, y: e.clientY,
    });
  });
  const note = document.createElement("p");
  note.className = "chart-src";
  note.textContent = "Source · " + CH.srcStr(M.src) + " — " + M.note;
  table.parentElement.appendChild(note);
})();

/* ────────────────────────────────────────────────────────────
   §4B · The scale gap, drawn — deal-size (log) axis against facility size;
         each lane begins where that competitor's smallest evidenced offering starts.
         The blue zone below ≈$1M is unshaded by any competitor = HCSP's opening.
──────────────────────────────────────────────────────────── */
(function () {
  const host = document.getElementById("scalegap-chart");
  if (!host) return;
  const SG = RPT.scalegap;
  const body = U.frame(host, {
    title: "The scale gap: where each competitor's offering begins",
    sub: "X = DEAL SIZE, $M, LOG SCALE · SOLID = EQUIPMENT A CUSTOMER CAN BUY · DASHED/HOLLOW = SERVICES & PILOTS, NOT SOLD UNITS · BLUE = SUB-$1M ZONE NO COMPETITOR SERVES · CLICK ANY LANE",
    src: "Company primary + registry + synthesis — 374Water 10-Q/424B5/deck, GA-EMS deck & EPA record, Danish CVR & EPA MUDP, state takeback records (K151–K166)",
  });

  const W = 1000, H = 452;
  const L = 128, R = 26, TOP = 84, BOT = 40;
  const lanes = SG.lanes;
  const laneH = (H - TOP - BOT) / lanes.length;
  const x = d3.scaleLog().domain(SG.domain).range([L, W - R]);
  const INK = "#051c2c", INKMD = "#42566a", INKLO = "#8595a6", ACC = "#2251ff", LINE = "#dbe2ea";

  const svg = CH.svg(body, W, H);

  // hatch pattern for government-program spans
  const defs = svg.append("defs");
  const pat = defs.append("pattern").attr("id", "sg-hatch").attr("width", 6).attr("height", 6)
    .attr("patternUnits", "userSpaceOnUse").attr("patternTransform", "rotate(45)");
  pat.append("rect").attr("width", 6).attr("height", 6).attr("fill", "#ffffff");
  pat.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 6)
    .attr("stroke", INKMD).attr("stroke-width", 1.4);

  // ── blue opening zone: everything below ≈$1M ──
  const zx0 = x(SG.domain[0]), zx1 = x(SG.zoneMax);
  svg.append("rect").attr("x", zx0).attr("y", TOP - 26).attr("width", zx1 - zx0)
    .attr("height", H - TOP - BOT + 26).attr("fill", ACC).attr("opacity", 0.07);
  svg.append("line").attr("x1", zx1).attr("x2", zx1).attr("y1", TOP - 26).attr("y2", H - BOT)
    .attr("stroke", ACC).attr("stroke-dasharray", "4 3").attr("stroke-width", 1.2);
  const zoneLab = CH.halo(svg.append("text")
    .attr("x", (zx0 + zx1) / 2).attr("y", TOP - 34).attr("text-anchor", "middle")
    .attr("font-size", 11).attr("font-weight", 700).attr("fill", ACC)
    .text("NO COMPETITOR SELLS HERE"), 3.5);
  CH.drill(zoneLab, () => lanes.find(l => l.kind === "hcsp").drill && {
    ...lanes.find(l => l.kind === "hcsp").drill, source: CH.srcStr(lanes.find(l => l.kind === "hcsp").src),
  });

  // ── facility-size landmark labels + gridlines ──
  const landmarks = [
    { v: 0.2, t: "SMALL FARM · FAB · REMOTE" },
    { v: 1.8, t: "MID INDUSTRIAL PLANT" },
    { v: 18, t: "MUNICIPAL UTILITY" },
    { v: 70, t: "NATIONAL PROGRAM / DEFENSE" },
  ];
  landmarks.forEach(m => {
    CH.halo(svg.append("text").attr("x", x(m.v)).attr("y", TOP - 12)
      .attr("text-anchor", "middle").attr("font-size", 9.5).attr("fill", INKLO).text(m.t), 3);
  });
  [0.1, 1, 10, 100].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", TOP - 6).attr("y2", H - BOT)
      .attr("stroke", v === 1 ? ACC : LINE).attr("stroke-dasharray", v === 1 ? "4 3" : "2 4")
      .attr("stroke-width", v === 1 ? 1.2 : 1);
    svg.append("text").attr("x", x(v)).attr("y", H - BOT + 18).attr("text-anchor", "middle")
      .attr("font-size", 10.5).attr("fill", v === 1 ? ACC : INKMD)
      .attr("font-weight", v === 1 ? 700 : 400)
      .text(v === 0.1 ? "$0.1M" : v === 1 ? "$1M" : v === 10 ? "$10M" : "$100M");
  });
  svg.append("text").attr("x", L).attr("y", H - 8).attr("font-size", 9).attr("fill", INKLO)
    .text("DEAL SIZE ($M, LOG) — READ AGAINST FACILITY SIZE ABOVE");

  // ── lanes ──
  lanes.forEach((ln, i) => {
    const cy = TOP + laneH * i + laneH / 2;
    const barH = 14, labY = cy - barH / 2 - 7;
    if (i > 0) svg.append("line").attr("x1", L).attr("x2", W - R).attr("y1", TOP + laneH * i).attr("y2", TOP + laneH * i)
      .attr("stroke", "#eef1f6").attr("stroke-width", 1);

    // lane name
    const nm = svg.append("text").attr("x", L - 12).attr("y", cy + 3.5).attr("text-anchor", "end")
      .attr("font-size", 11.5).attr("font-weight", 700)
      .attr("fill", ln.kind === "hcsp" ? ACC : INK).text(ln.name);
    CH.drill(nm, () => ({ ...ln.drill, source: CH.srcStr(ln.src) }));

    const drill = g => CH.drill(g, () => ({ ...ln.drill, source: CH.srcStr(ln.src) }));

    // ghost span (service pilots only — 374Water)
    if (ln.ghost) {
      const gx0 = x(ln.ghost.from), gx1 = x(ln.ghost.to);
      const g = svg.append("line").attr("x1", gx0).attr("x2", gx1).attr("y1", cy).attr("y2", cy)
        .attr("stroke", INKLO).attr("stroke-width", barH * 0.55).attr("stroke-dasharray", "3 4")
        .attr("stroke-linecap", "butt").attr("opacity", 0.85);
      drill(g);
      const gl = CH.halo(svg.append("text").attr("x", (gx0 + gx1) / 2).attr("y", cy + barH / 2 + 15)
        .attr("text-anchor", "middle").attr("font-size", 9.5).attr("fill", INKLO).text(ln.ghost.lab), 3);
      drill(gl);
      svg.append("circle").attr("cx", gx0).attr("cy", cy).attr("r", 3).attr("fill", INKLO);
    }

    // main bar
    const bx0 = x(ln.bar.from), bx1 = x(Math.min(ln.bar.to, SG.domain[1]));
    let rect;
    if (ln.kind === "hatch") {
      rect = svg.append("rect").attr("x", bx0).attr("y", cy - barH / 2).attr("width", bx1 - bx0).attr("height", barH)
        .attr("fill", "url(#sg-hatch)").attr("stroke", INKMD).attr("stroke-width", 1);
    } else if (ln.kind === "hollow") {
      rect = svg.append("rect").attr("x", bx0).attr("y", cy - barH / 2).attr("width", bx1 - bx0).attr("height", barH)
        .attr("fill", "#ffffff").attr("stroke", INK).attr("stroke-width", 1.4).attr("stroke-dasharray", "5 3");
    } else if (ln.kind === "hcsp") {
      rect = svg.append("rect").attr("x", bx0).attr("y", cy - barH / 2 - 2).attr("width", bx1 - bx0).attr("height", barH + 4)
        .attr("fill", ACC);
    } else {
      rect = svg.append("rect").attr("x", bx0).attr("y", cy - barH / 2).attr("width", bx1 - bx0).attr("height", barH)
        .attr("fill", INK);
    }
    drill(rect);

    // bar caption
    const cap = CH.halo(svg.append("text")
      .attr("x", ln.kind === "hcsp" ? (bx0 + bx1) / 2 : Math.min((bx0 + bx1) / 2, W - R - 8))
      .attr("y", labY).attr("text-anchor", "middle").attr("font-size", 9.5)
      .attr("fill", ln.kind === "hcsp" ? ACC : INKMD).text(ln.bar.lab), 3);
    drill(cap);

    // start marker + value under the bar start
    const mk = svg.append("line").attr("x1", bx0).attr("x2", bx0).attr("y1", cy - barH / 2 - 2).attr("y2", cy + barH / 2 + 2)
      .attr("stroke", ln.kind === "hcsp" ? ACC : INK).attr("stroke-width", 1.6);
    drill(mk);
    const startLab = { w374: "$4.9M", ga: "3 gpm", aq: "$2M", rv: "$0.67M", hcsp: "$0.1M" }[ln.id];
    const vl = svg.append("text").attr("x", bx0).attr("y", cy + barH / 2 + 15).attr("text-anchor", "middle")
      .attr("font-size", 9.5).attr("font-weight", 700).attr("fill", ln.kind === "hcsp" ? ACC : INK).text(startLab);
    drill(vl);
  });
})();

/* ────────────────────────────────────────────────────────────
   §4B · Watch items — events that would redraw the axis
──────────────────────────────────────────────────────────── */
(function () {
  const list = document.getElementById("watch-list");
  if (!list) return;
  list.innerHTML = RPT.comp_watch.map((w, i) =>
    `<li data-i="${i}" data-drill-keep=""><b>${w.item}.</b> ${w.txt}</li>`).join("");
  list.querySelectorAll("li").forEach(li => {
    const w = RPT.comp_watch[+li.dataset.i];
    li.style.cursor = "pointer";
    li.onclick = e => U.showDrill({
      title: "WATCH ITEM · " + w.item.toUpperCase(), value: "Track",
      sub: w.txt, source: CH.srcStr(w.src), x: e.clientX, y: e.clientY,
    });
  });
})();
