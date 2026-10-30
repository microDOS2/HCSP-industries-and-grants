// ═══ DOM tables: spec sheet, cost stack, per-industry call, variants, what could go wrong + K-register ═══

/* spec table (§1) */
(function () {
  const t = document.getElementById("spec-table");
  if (!t) return;
  const sp = document.getElementById("spec-src");
  if (sp) { const b = document.createElement("button"); b.className = "src"; b.textContent = "◆"; b.setAttribute("data-drill-keep", ""); b.setAttribute("aria-label", "Open source details");
    b.onclick = e => { e.stopPropagation(); U.showDrill({ title: "SOURCE OF THE SPECIFICATION", value: "HCSP technical briefing + owner process description", sub: "Briefing submitted to the California State Water Resources Control Board; initially positioned for indoor-agriculture wastewater. Process description (distillation + high-heat incineration at atmospheric pressure, no pressurization) per the owner-provided Process Step.docx.", source: CH.srcLink(["K1", "K207"]), x: e.clientX, y: e.clientY }); };
    sp.appendChild(b); }
  t.innerHTML = `<thead><tr><th>Parameter</th><th>Value (per briefing)</th><th>Analyst note</th></tr></thead>` +
    "<tbody>" + RPT.spec.map(r => `<tr data-k="${r.src}"${r.feat ? ' class="feat"' : ""}><td><b>${r.k}</b></td><td class="num">${r.v}</td><td>${r.note}</td></tr>`).join("") + "</tbody>";
  t.querySelectorAll("tr[data-k]").forEach(tr => {
    const r = RPT.spec.find(s => s.k === tr.cells[0].textContent);
    tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", ""); tr.setAttribute("tabindex", "0");
    tr.onclick = e => U.showDrill({ title: r.k.toUpperCase(), value: r.v, sub: r.note + ".", source: CH.srcLink([r.src]), x: e.clientX, y: e.clientY });
  });
})();

/* §2 exhibit — "Why HCSP is different": drill-down source links (K1 briefing + K207 process step doc) */
(function () {
  const ex = document.getElementById("ex-src");
  if (!ex) return;
  const b = document.createElement("button");
  b.className = "src"; b.textContent = "◆"; b.setAttribute("data-drill-keep", ""); b.setAttribute("aria-label", "Open source details");
  b.onclick = e => { e.stopPropagation(); U.showDrill({
    title: "WHY HCSP IS DIFFERENT — SOURCES",
    value: "HCSP technical briefing + owner process description",
    sub: "Separation strategy, destruction method and pressure management per the owner-provided Process Step.docx (K207). The no-air-permit contrast with conventional incineration per the HCSP technical briefing submitted to the California State Water Resources Control Board (K1): a sealed water-vapor system whose only gaseous stream is vented excess oxygen.",
    source: CH.srcLink(["K1", "K207"]), x: e.clientX, y: e.clientY }); };
  ex.appendChild(b);
})();

/* cost stack table (§3) */
(function () {
  const t = document.getElementById("cost-table");
  if (!t) return;
  t.innerHTML = `<thead><tr><th>Cost element</th><th>Basis</th><th>$/yr</th><th>$/gal</th><th>$/m³</th></tr></thead>` +
    "<tbody>" + RPT.cost_stack.map((r, i) =>
      `<tr class="${r.bold ? "hl" : ""}" data-i="${i}"><td>${r.bold ? "<b>" + r.el + "</b>" : r.el}</td><td style="font-size:12px;color:var(--ink-md)">${r.basis}</td><td class="num">${r.yr}</td><td class="num">${r.gal}</td><td class="num">${r.m3}</td></tr>`).join("") + "</tbody>";
  t.querySelectorAll("tr[data-i]").forEach(tr => {
    const r = RPT.cost_stack[+tr.dataset.i];
    tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", ""); tr.setAttribute("tabindex", "0");
    tr.onclick = e => U.showDrill({
      title: r.el.toUpperCase(), value: r.gal === "TBD" ? "TBD — pending" : r.gal + " /gal",
      sub: (r.basis ? r.basis + ". " : "") + "Per-module stack on ~0.9M gal/yr throughput. HCSP has no published cost benchmark — every $ figure is TBD pending the manufacturer cost model. The SCWO industry literature's calibration points ($0.04–0.37/gal large scale; $0.5–2.0/gal skid scale) describe the technology class, not HCSP.",
      source: CH.srcLink(r.src), x: e.clientX, y: e.clientY,
    });
  });
})();

/* per-industry call table (§5) */
(function () {
  const t = document.getElementById("call-table");
  if (!t) return;
  const calls = { 1: "GO — direct entry, service pricing", 2: "GO, DISCIPLINED — premium streams only", 3: "HOLD — regional/crisis-gated first markets", 4: "NO-GO for revenue — option value only" };
  t.innerHTML = `<thead><tr><th>#</th><th>Industry</th><th>Score /10</th><th>Tier</th><th>The call</th><th>Net time to earn back the cost (pending)</th></tr></thead>` +
    "<tbody>" + RPT.league.map((d, i) =>
      `<tr data-i="${i}" class="${d.tier === 1 ? "hl" : ""}"><td class="num">${d.rank}</td><td><b>${d.name}</b></td><td class="num">${d.score}</td><td class="num">${d.tier}</td><td>${calls[d.tier]}</td><td class="num">${d.payback}</td></tr>`).join("") + "</tbody>";
  t.querySelectorAll("tr[data-i]").forEach(tr => {
    const d = RPT.league[+tr.dataset.i];
    tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", ""); tr.setAttribute("tabindex", "0");
    tr.onclick = e => U.showDrill({ title: d.name.toUpperCase(), value: d.score + " / 10", sub: d.why + " " + RPT.tiers[d.tier - 1].posture, source: CH.srcLink(d.src), x: e.clientX, y: e.clientY });
  });
})();

/* models by industry table (§6) */
(function () {
  const t = document.getElementById("variant-table");
  if (!t) return;
  t.innerHTML = `<thead><tr><th>Model</th><th>Target stream</th><th>Pre-module</th><th>Materials / wetted parts</th><th>Business model</th><th>First customers</th></tr></thead>` +
    "<tbody>" + RPT.variants.map((r, i) =>
      `<tr data-i="${i}"><td><b>${r.v}</b></td><td>${r.stream}</td><td>${r.pre}</td><td>${r.mat}</td><td>${r.model}</td><td>${r.first}</td></tr>`).join("") + "</tbody>";
  t.querySelectorAll("tr[data-i]").forEach(tr => {
    const r = RPT.variants[+tr.dataset.i];
    tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", ""); tr.setAttribute("tabindex", "0");
    tr.onclick = e => U.showDrill({ title: r.v, value: r.model, sub: r.stream + ". Pre-module: " + r.pre + ". Materials: " + r.mat + ". First customers: " + r.first + ".", source: CH.srcLink(r.src), x: e.clientX, y: e.clientY });
  });
})();

/* what could go wrong table (§6) */
(function () {
  const t = document.getElementById("risk-table");
  if (!t) return;
  t.innerHTML = `<thead><tr><th>Risk</th><th>Likelihood</th><th>Impact</th><th>Mitigation</th><th>Evidence</th></tr></thead>` +
    "<tbody>" + RPT.risks.map((r, i) => {
      const hot = /existential|Very High/.test(r.impact);
      return `<tr data-i="${i}" ${hot ? 'class="hl"' : ""}><td><b>${r.r}</b></td><td class="num">${r.like}</td><td class="num" style="${hot ? "color:var(--neg);font-weight:700" : ""}">${r.impact}</td><td>${r.mit}</td><td style="font-size:12px;color:var(--ink-md)">${r.ev}</td></tr>`;
    }).join("") + "</tbody>";
  t.querySelectorAll("tr[data-i]").forEach(tr => {
    const r = RPT.risks[+tr.dataset.i];
    tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", ""); tr.setAttribute("tabindex", "0");
    tr.onclick = e => U.showDrill({ title: "WHAT COULD GO WRONG", value: r.like + " · " + r.impact, sub: r.r + ". Mitigation: " + r.mit + ". Evidence: " + r.ev + ".", source: CH.srcLink(r.src), x: e.clientX, y: e.clientY });
  });
})();

/* K-register (sources footer) */
(function () {
  const host = document.getElementById("source-list");
  if (!host) return;
  const catName = { company: "Company disclosure", industry: "Industry & official", broker: "Broker & market research", kimi: "Research compilation" };
  window.SRCS.forEach(s => {
    const el = document.createElement("span");
    el.className = "src-row";
    const citeHtml = s.url
      ? `<a class="src-link" href="${s.url}" target="_blank" rel="noopener noreferrer">${s.cite} ↗</a>`
      : `<span class="src-derived">${s.cite} — derived analysis (no external source)</span>`;
    el.innerHTML = `<span class="s-fact"><b>${s.k}</b> · ${s.fact}</span>
      <span class="s-cite"><span class="src-cat ${s.cat}">${catName[s.cat]}</span>${citeHtml} · ${s.date} · report ref ${s.ref}</span>`;
    el.setAttribute("data-drill-keep", "");
    el.setAttribute("tabindex", "0");
    el.style.cursor = "pointer";
    const a = el.querySelector("a.src-link");
    if (a) a.onclick = ev => ev.stopPropagation();
    el.onclick = e => U.showDrill({
      title: `${s.k} · ${catName[s.cat].toUpperCase()}`, value: s.date,
      sub: s.fact, source: citeHtml + " · report ref " + s.ref, x: e.clientX, y: e.clientY,
    });
    host.appendChild(el);
  });
})();

/* ── backup-power storage comparison (§3B) ── */
(function () {
  const t = document.getElementById("storage-table");
  if (!t) return;
  const roleCls = { niche: "", default: "hl", "default today": "", incumbent: "", excluded: "" };
  t.innerHTML = `<thead><tr><th>Chemistry</th><th>Cycle life</th><th>Calendar life</th><th>Self-discharge</th><th>Round-trip</th><th>Cost $/kWh</th><th>Verdict for HCSP duty</th></tr></thead>` +
    "<tbody>" + RPT.storage.map((r, i) =>
      `<tr data-i="${i}" class="${roleCls[r.role]}"><td><b>${r.chem}</b></td><td style="font-size:12px">${r.cycles}</td><td style="font-size:12px">${r.calendar}</td><td class="num">${r.role === "niche" ? '<span class="vc-contra">' + r.selfdis + "</span>" : r.selfdis}</td><td class="num">${r.rte}</td><td class="num">${r.cost}</td><td style="font-size:12px">${r.verdict}</td></tr>`).join("") + "</tbody>";
  t.querySelectorAll("tr[data-i]").forEach(tr => {
    const r = RPT.storage[+tr.dataset.i];
    tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", ""); tr.setAttribute("tabindex", "0");
    tr.onclick = e => U.showDrill({ title: r.chem.toUpperCase(), value: r.verdict.split("—")[0].trim(), sub: r.note, source: CH.srcLink(r.src), x: e.clientX, y: e.clientY });
  });
  const rule = document.getElementById("storage-rule-src");
  if (rule) {
    const b = document.createElement("button"); b.className = "src"; b.textContent = "◆"; b.setAttribute("data-drill-keep", ""); b.setAttribute("aria-label", "Open source details");
    b.onclick = e => { e.stopPropagation(); U.showDrill({ title: "THE DECISION RULE", value: "LFP by default", sub: RPT.storage_rule, source: CH.srcLink(RPT.storage_src), x: e.clientX, y: e.clientY }); };
    rule.appendChild(b);
  }
})();

/* ── dual-lens ranking (§3): composite attractiveness ⇄ what existing suppliers charge to clean it up $/gal ── */
(function () {
  const t = document.getElementById("league-lens-table");
  const tog = document.getElementById("lens-toggle");
  if (!t || !tog) return;
  const compByKey = {};
  RPT.league.forEach(d => { compByKey[d.key] = d; });
  const merged = RPT.savings_ladder.map(s => ({ s, c: compByKey[s.key] })).filter(m => m.c);
  const fv = v => v < 0.1 ? v.toFixed(3) : v < 1 ? v.toFixed(2) : String(v);
  const band = s => s.na ? '<span class="vc-contra">N/A — buyer of the output</span>' : "$" + fv(s.lo) + "–" + fv(s.hi) + (s.plus ? "+" : "") + (s.lowConf ? ' <span class="lc-flag">LOW CONFIDENCE</span>' : "");
  let lens = "savings"; // savings lens is the primary ordering (manufacturer pricing TBD)

  const MODES = [
    { id: "savings", label: "What existing suppliers charge to clean it up ($/gal)" },
    { id: "composite", label: "Composite attractiveness" },
  ];
  tog.innerHTML = MODES.map(m => `<button data-lens="${m.id}">${m.label}</button>`).join("");
  const btns = [...tog.querySelectorAll("button")];

  function render() {
    btns.forEach(b => b.classList.toggle("on", b.dataset.lens === lens));
    const rows = merged.slice().sort((a, b) => lens === "savings" ? a.s.srank - b.s.srank : a.c.rank - b.c.rank);
    const head = lens === "savings"
      ? `<thead><tr><th>#</th><th>Vertical / stream</th><th>Existing supplier cost $/gal</th><th>Composite rank</th><th>Basis</th></tr></thead>`
      : `<thead><tr><th>#</th><th>Industry</th><th>Score /10</th><th>Fit</th><th>Savings-lens rank</th><th>Earn-back time</th></tr></thead>`;
    t.innerHTML = head + "<tbody>" + rows.map(m => {
      const s = m.s, c = m.c, i = merged.indexOf(m);
      if (lens === "savings") {
        const dv = c.rank - s.srank;
        const delta = s.na ? "—" : (dv > 0 ? "▲" + dv : dv < 0 ? "▼" + (-dv) : "=");
        return `<tr data-i="${i}" class="${s.srank <= 3 ? "hl" : ""}"><td class="num">${s.srank}</td><td><b>${s.vertical}</b></td><td class="num">${band(s)}</td><td class="num">#${c.rank} ${delta}</td><td style="font-size:12px;color:var(--ink-md)">${s.note}</td></tr>`;
      }
      return `<tr data-i="${i}" class="${c.tier === 1 ? "hl" : ""}"><td class="num">${c.rank}</td><td><b>${c.name}</b></td><td class="num">${c.score}</td><td>${RPT.league_fit[c.tier]}</td><td class="num">#${s.srank} · ${s.na ? "N/A" : band(s)}</td><td class="num">${c.payback}</td></tr>`;
    }).join("") + "</tbody>";
    t.querySelectorAll("tr[data-i]").forEach(tr => {
      const m = merged[+tr.dataset.i], s = m.s, c = m.c;
      tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", ""); tr.setAttribute("tabindex", "0");
      tr.onclick = e => U.showDrill({
        title: (lens === "savings" ? "SAVINGS #" + s.srank : "RANK " + c.rank) + " · " + s.vertical.toUpperCase(),
        value: s.na ? "N/A — buyer of the output" : band(s).replace(/<[^>]+>/g, "").replace("LOW CONFIDENCE", "(low confidence)") + " /gal",
        sub: s.note + " Composite lens: #" + c.rank + " (" + c.score + "/10 — " + RPT.league_fit[c.tier] + "). " + c.why + " " + RPT.savings_meta.qualifier + ".",
        source: CH.srcLink(s.src.concat(c.src.filter(k => !s.src.includes(k))).concat(["K150"])),
        x: e.clientX, y: e.clientY,
      });
    });
  }
  btns.forEach(b => b.onclick = () => { lens = b.dataset.lens; render(); });
  render();

  /* ── tiered standard: story cards for the industry league — one clean card
     per industry (big figure, one plain-English reason, small print with the
     machine count), as a view toggle alongside the existing table ── */
  if (window.ViewStd) {
    const fmtNum = n => n.toLocaleString("en-US");
    const modKey = { pharma: "pharma", textile: "tex", pfas: "pfas", chem: "haz" };
    const machineTxt = k => {
      const core = (RPT.sizing || []).find(x => x.key === (modKey[k] || k));
      if (core && core.mod_lo != null)
        return "Machines: " + (core.mod_lo === core.mod_hi ? fmtNum(core.mod_lo) : fmtNum(core.mod_lo) + "–" + fmtNum(core.mod_hi)) + " × 50 m³/day modules";
      const plus = (RPT.sizing_plus || []).find(x => x.key === k);
      if (plus && plus.mod_lab) return "Machines: " + plus.mod_lab;
      return "";
    };
    const bandTxt = s => s.na ? "N/A — buyer of the output" : "$" + fv(s.lo) + "–" + fv(s.hi) + (s.plus ? "+" : "") + "/gal";
    const cardsHost = document.createElement("div");
    cardsHost.hidden = true;
    const scroll = t.closest(".table-scroll");
    (scroll || t).parentElement.insertBefore(cardsHost, (scroll || t).nextSibling);
    function renderCards() {
      cardsHost.innerHTML = "";
      const rows = merged.slice().sort((a, b) => lens === "savings" ? a.s.srank - b.s.srank : a.c.rank - b.c.rank);
      ViewStd.storyCards(cardsHost, rows.map(m => {
        const s = m.s, c = m.c, bits = [];
        const mt = machineTxt(c.key);
        if (mt) bits.push(mt);
        bits.push("Composite fit #" + c.rank + " · savings #" + s.srank + (s.lowConf ? " · low confidence" : ""));
        return {
          name: s.vertical,
          big: lens === "savings" ? bandTxt(s) : c.score + " / 10",
          reason: c.plain || c.why || s.note,
          small: bits.join(" · "),
          onClick: e => U.showDrill({
            title: (lens === "savings" ? "SAVINGS #" + s.srank : "RANK " + c.rank) + " · " + s.vertical.toUpperCase(),
            value: s.na ? "N/A — buyer of the output" : bandTxt(s),
            sub: s.note + " Composite lens: #" + c.rank + " (" + c.score + "/10 — " + RPT.league_fit[c.tier] + "). " + c.why + " " + RPT.savings_meta.qualifier + ".",
            source: CH.srcLink(s.src.concat(c.src.filter(k => !s.src.includes(k))).concat(["K150"])),
            x: e.clientX, y: e.clientY,
          }),
        };
      }));
    }
    const vt = ViewStd.makeToggle({
      label: "VIEW",
      views: [["table", "Table"], ["cards", "Cards"]],
      current: "table",
      onPick: v => {
        const cards = v === "cards";
        if (scroll) scroll.hidden = cards; else t.hidden = cards;
        cardsHost.hidden = !cards;
        if (cards) renderCards();
      },
    });
    tog.after(vt);
    btns.forEach(b => b.addEventListener("click", () => { if (!cardsHost.hidden) renderCards(); }));
  }
})();
