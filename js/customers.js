// ═══ §4C — Customers & global footprint: per-company customer tables + geographic coverage matrix ═══
// Data: RPT.cust_tables / geo_matrix / cust_extremes (data.js), sources K179–K196 (sources.js).
// Readability system: ≥12px labels, AA contrast, dark drill-down cards on every figure, static (no motion).

/* ── Per-company customer tables — largest/smallest flagged, every row drills ── */
(function () {
  const host = document.getElementById("cust-tables");
  if (!host) return;
  host.innerHTML = RPT.cust_tables.map(t => `
    <div class="cust-block">
      <div class="cust-head">
        <h3 class="sub-h">${t.company}</h3>
        <p class="cust-geo">${t.geo}</p>
      </div>
      <div class="table-scroll"><table class="dt cust-dt" data-t="${t.id}">
        <thead><tr><th>Customer / site</th><th>Location</th><th>Type</th><th>Value</th><th>Status (late 2026)</th></tr></thead>
        <tbody>${t.rows.map((r, ri) => `
          <tr data-r="${ri}" class="${r.flag === "largest" ? "hl" : ""}" data-drill-keep="" tabindex="0">
            <td><b>${r.cust}</b>${r.flag ? `<span class="flag-chip ${r.flag}">${r.flag === "largest" ? "LARGEST" : "SMALLEST"}</span>` : ""}</td>
            <td>${r.loc}</td><td>${r.type}</td><td class="num">${r.value}</td><td>${r.status}</td>
          </tr>`).join("")}
        </tbody>
      </table></div>
      <p class="chart-src">Source · ${CH.srcLink(t.src)} — ${t.note}</p>
    </div>`).join("");
  RPT.cust_tables.forEach(t => {
    host.querySelectorAll(`table[data-t="${t.id}"] tr[data-r]`).forEach(tr => {
      const r = t.rows[+tr.dataset.r];
      tr.style.cursor = "pointer";
      tr.onclick = e => U.showDrill({
        title: t.company.toUpperCase() + (r.flag ? " · " + r.flag.toUpperCase() : "") + " · " + r.cust.toUpperCase().slice(0, 44),
        value: r.value,
        sub: (r.caveat ? r.caveat + " " : "") + r.status + ".",
        source: CH.srcLink(r.src), x: e.clientX, y: e.clientY,
      });
    });
  });
})();

/* ── Geographic coverage matrix — verified presence vs marketing claims, every cell drills ── */
(function () {
  const table = document.getElementById("geo-table");
  if (!table) return;
  const G = RPT.geo_matrix;
  const MARKS = {
    op:   ["●", "OPERATING", "gm-op"],
    demo: ["◐", "DEMO / TRIAL", "gm-demo"],
    ann:  ["○", "ANNOUNCED", "gm-ann"],
    mkt:  ["✕", "MARKETING CLAIM", "gm-mkt"],
    no:   ["—", "", "gm-no"],
  };
  // legend strip above the matrix
  const legend = document.createElement("p");
  legend.className = "gm-legend";
  legend.innerHTML = ["op", "demo", "ann", "mkt", "no"]
    .map(k => `<span class="gm ${MARKS[k][2]}">${MARKS[k][0]} ${MARKS[k][1] || "NO PRESENCE"}</span>`).join("");
  table.parentElement.insertBefore(legend, table);

  table.innerHTML = `
    <thead><tr><th class="cmp-dim"></th>${G.cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>
      ${G.rows.map((row, ri) => `<tr>
        <td class="cmp-dim"><b>${row.co}</b></td>
        ${row.cells.map((cell, ci) => {
          const mk = MARKS[cell.m];
          return `<td class="gm-cell" data-r="${ri}" data-c="${ci}" data-drill-keep="" tabindex="0">
            <span class="gm ${mk[2]}">${mk[0]}${mk[1] ? " " + mk[1] : ""}</span>${cell.txt !== "—" ? `<span class="gm-txt">${cell.txt}</span>` : ""}
          </td>`;
        }).join("")}
      </tr>`).join("")}
    </tbody>`;
  table.querySelectorAll(".gm-cell").forEach(td => {
    const row = G.rows[+td.dataset.r], cell = row.cells[+td.dataset.c];
    td.style.cursor = "pointer";
    td.onclick = e => U.showDrill({
      title: row.co.toUpperCase() + " · " + G.cols[+td.dataset.c].toUpperCase(),
      value: MARKS[cell.m][1] || "No presence",
      sub: cell.note,
      source: CH.srcLink(cell.src), x: e.clientX, y: e.clientY,
    });
  });
  const note = document.createElement("p");
  note.className = "chart-src";
  note.innerHTML = "Source · " + CH.srcLink(G.src) + " — " + G.note;
  table.parentElement.appendChild(note);
})();
