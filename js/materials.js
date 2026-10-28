// ═══ §3C add-on — Materials recovery roadmap block (RPT.materials_recovery) ═══
// A plainly-worded, fully static table of six candidate recovery streams:
// substance / source stream / how it could be recovered / who buys it / honest note.
// Every row drills to its evidence and dated sources. Clearly badged as a roadmap /
// R&D direction — NOT a shipping feature. No animation: reading mode is identical.
(function () {
  const host = document.getElementById("materials-recovery");
  if (!host || !window.RPT || !RPT.materials_recovery) return;
  const MR = RPT.materials_recovery;
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  // intro paragraph (prose host above the table)
  const iHost = document.getElementById("materials-intro");
  if (iHost) iHost.innerHTML = `<p>${esc(MR.intro)}</p>`;

  // roadmap badge + table
  host.innerHTML = `
    <p class="mr-badge" role="note">${esc(MR.status)}</p>
    <div class="table-scroll"><table class="dt mr-table">
      <thead><tr>
        <th>What could be recovered</th>
        <th>Where it comes from</th>
        <th>How it could be recovered</th>
        <th>Who buys it</th>
        <th>The honest note</th>
      </tr></thead>
      <tbody>
        ${MR.rows.map((r, i) => `
          <tr class="mr-row" data-r="${i}" tabindex="0" role="button"
            aria-label="${esc(r.sub)} — open the detail and sources">
            <td class="mr-sub">${esc(r.sub)}</td>
            <td>${esc(r.source)}</td>
            <td>${esc(r.path)}</td>
            <td>${esc(r.buyer)}</td>
            <td class="mr-note">${esc(r.note)}</td>
          </tr>`).join("")}
      </tbody>
    </table></div>
    <p class="chart-src">Click any row for the full detail and the dated sources behind it.</p>`;

  host.querySelectorAll(".mr-row").forEach(el => {
    const r = MR.rows[+el.dataset.r];
    const open = ev => {
      if (ev.target && ev.target.closest && ev.target.closest("a")) return;
      const rc = el.getBoundingClientRect();
      U.showDrill({
        title: "MATERIALS RECOVERY · " + MR.status,
        value: r.sub,
        sub: "Source stream: " + r.source + ". Recovery path: " + r.path + " Buyers: " + r.buyer + ". Honest note: " + r.note,
        source: KLINK(r.src),
        x: ev.clientX ?? (rc.left + 40), y: ev.clientY ?? (rc.top + 40),
      });
    };
    el.addEventListener("click", open);
    el.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(ev); } });
  });

  // the honest rule (prose note-box below the table)
  const rHost = document.getElementById("materials-rule");
  if (rHost) rHost.innerHTML = `<p><b>${esc(MR.rule.split(":")[0])}:</b>${esc(MR.rule.slice(MR.rule.indexOf(":") + 1))}</p>`;
})();
