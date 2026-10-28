// ═══ §3C The energy advantage — interactive scenario selector ═══
// Six plain-language scenario cards (A–F) → detail panel with a heat-flow SVG,
// three revenue streams, illustrative economics, "what you need first", and
// source drill-downs. Fully static DOM/SVG — no animation, so reading mode is
// identical to interactive mode.
(function () {
  const host = document.getElementById("energy-scenarios");
  if (!host || !window.RPT || !RPT.energy_scenarios) return;
  const SC = RPT.energy_scenarios;
  const GUARD = RPT.energy_guardrails || [];
  const PAL = U.PAL;

  // ── shared guardrails block (prose host further up the section) ──
  const gHost = document.getElementById("energy-guardrails");
  if (gHost) {
    gHost.innerHTML = GUARD.map((g, i) => `
      <article class="term es-guard" tabindex="0" data-gi="${i}">
        <h3 class="t-abbr es-guard-t">${g.t}</h3>
        <p class="t-gist">${g.d}</p>
        <p class="t-hint es-guard-src">Source · ${KLINK(g.src)}</p>
      </article>`).join("");
    gHost.querySelectorAll(".es-guard").forEach(el => {
      const g = GUARD[+el.dataset.gi];
      el.addEventListener("click", e => {
        if (e.target.closest("a")) return;
        U.showDrill({ title: "GUARDRAIL · " + g.t.toUpperCase(), value: "Read first", sub: g.d, source: KLINK(g.src), x: e.clientX, y: e.clientY });
      });
    });
  }

  // ── selector cards ──
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  host.innerHTML = `
    <div class="es-grid" role="tablist" aria-label="Energy scenarios">
      ${SC.map((s, i) => `
        <button type="button" class="es-card" role="tab" aria-selected="false" data-sc="${i}">
          <span class="es-letter">${s.id}</span>
          <span class="es-name">${esc(s.name)}</span>
          <span class="es-tag">${esc(s.tag)}</span>
          <span class="es-card-txt">${esc(s.card)}</span>
          <span class="es-open">OPEN SCENARIO →</span>
        </button>`).join("")}
    </div>
    <div class="es-detail" id="es-detail" aria-live="polite"></div>`;

  const detail = host.querySelector("#es-detail");

  // ── SVG helpers: wrap text into tspans at ≥12px ──
  function wrapSvg(text, x, y, maxChars, lh, cls) {
    const words = String(text).split(" ");
    let lines = [], line = "";
    for (const w of words) {
      if ((line + " " + w).trim().length > maxChars && line) { lines.push(line); line = w; }
      else line = line ? line + " " + w : w;
    }
    if (line) lines.push(line);
    return `<text class="${cls}" x="${x}" y="${y}">` +
      lines.map((l, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join("") + `</text>`;
  }

  function diagram(s) {
    const d = s.diagram;
    const muted = v => /^not\b/i.test(v);
    const outBox = (y, label, val, accent) => `
      <g>
        <rect x="600" y="${y}" width="360" height="86" rx="4"
          fill="${muted(val) ? "#f7f9fc" : "#ffffff"}" stroke="${muted(val) ? PAL.line : accent}" stroke-width="${muted(val) ? 1 : 1.6}"/>
        <text class="es-svg-lab" x="616" y="${y + 22}" fill="${muted(val) ? PAL.inkLo : accent}">${label}</text>
        ${wrapSvg(val, 616, y + 42, 44, 15, "es-svg-val")}
        <path d="M530 ${y + 43} H596" stroke="${muted(val) ? PAL.line : PAL.inkMd}" stroke-width="1.6" fill="none" marker-end="url(#es-arr)"/>
      </g>`;
    return `
    <svg class="es-svg" viewBox="0 0 980 348" role="img"
      aria-label="Heat-flow diagram: waste in, HCSP plant, heat split to power, cooling and heating, distilled water out">
      <defs>
        <marker id="es-arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="${PAL.inkMd}"/>
        </marker>
      </defs>
      <g>
        <rect x="16" y="128" width="216" height="100" rx="4" fill="${PAL.ink}"/>
        <text class="es-svg-lab" x="32" y="152" fill="#9fb0c0">WASTE IN</text>
        ${wrapSvg(d.feed, 32, 172, 26, 15, "es-svg-feed")}
        <path d="M236 178 H286" stroke="${PAL.neg}" stroke-width="2.4" marker-end="url(#es-arr)"/>
      </g>
      <g>
        <rect x="290" y="118" width="240" height="120" rx="6" fill="#ffffff" stroke="${PAL.red}" stroke-width="2.4"/>
        <text class="es-svg-lab" x="306" y="142" fill="${PAL.red}">HCSP PLANT</text>
        ${wrapSvg("Runs 24/7 — a firm heat source none of the four SCWO rivals sells", 306, 164, 30, 16, "es-svg-val")}
      </g>
      ${outBox(20, "POWER OUT", d.power, PAL.red)}
      ${outBox(136, "COOLING OUT", d.cooling, PAL.red)}
      ${outBox(252, "HEAT OUT", d.heat, PAL.red)}
      <path d="M410 240 V292" stroke="${PAL.green}" stroke-width="2" marker-end="url(#es-arr)"/>
      <g>
        <rect x="290" y="298" width="300" height="44" rx="4" fill="#f2fbf8" stroke="${PAL.green}" stroke-width="1.6"/>
        <text class="es-svg-lab" x="304" y="316" fill="${PAL.green}">CLEAN WATER OUT</text>
        <text class="es-svg-val" x="304" y="333">${esc(d.water)}</text>
      </g>
    </svg>
    <p class="es-svg-cap">Indicative figures for this scenario — illustrative, from engineering studies. Boxes in grey are not used in this scenario.</p>`;
  }

  function renderDetail(i) {
    const s = SC[i];
    detail.innerHTML = `
      <div class="es-d-head">
        <span class="es-letter big">${s.id}</span>
        <div>
          <h3 class="es-d-name">${esc(s.name)}</h3>
          <p class="es-d-tag">${esc(s.tag)}</p>
        </div>
      </div>

      <p class="es-h">Where the waste heat goes</p>
      <div class="es-diagram">${diagram(s)}</div>

      <p class="es-h">Three ways this plant earns money</p>
      <div class="es-earns">
        ${s.earns.map((e, j) => `
          <div class="es-earn" data-e="${j}" role="button" tabindex="0">
            <span class="es-earn-t">${esc(e.t)}</span>
            <span class="es-earn-d">${esc(e.d)}</span>
            <span class="es-earn-src">${KLINK(e.src)}</span>
          </div>`).join("")}
      </div>

      <p class="es-h">Indicative economics <span class="es-ill">— ALL FIGURES ILLUSTRATIVE, FROM ENGINEERING STUDIES · CLICK A ROW FOR ITS SOURCE</span></p>
      <div class="table-scroll"><table class="dt es-econ">
        <tbody>
          ${s.econ.map((r, j) => `<tr data-r="${j}" class="es-econ-row"><td>${esc(r.lab)}</td><td class="num">${esc(r.val)}</td></tr>`).join("")}
        </tbody>
      </table></div>

      <p class="es-h">What you need first</p>
      <ul class="laws es-needs">
        ${s.needs.map(n => `<li>${esc(n)}</li>`).join("")}
      </ul>

      <p class="es-h">Source drill-downs <span class="es-ill">— DARK CARDS WITH DATED SOURCES</span></p>
      <div class="es-drills">
        ${s.drills.map((d, j) => `<button type="button" class="chip es-drill" data-d="${j}">${esc(d.title)} ↗</button>`).join("")}
      </div>
      <p class="chart-src">Sources · ${KLINK(s.src)}</p>`;

    detail.querySelectorAll(".es-earn").forEach(el => {
      const e = s.earns[+el.dataset.e];
      const open = ev => {
        if (ev.target && ev.target.closest && ev.target.closest("a")) return;
        const r = el.getBoundingClientRect();
        U.showDrill({ title: "REVENUE STREAM · " + e.t.toUpperCase(), value: s.name, sub: e.d, source: KLINK(e.src), x: ev.clientX ?? (r.left + 40), y: ev.clientY ?? (r.top + 40) });
      };
      el.addEventListener("click", open);
      el.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(ev); } });
    });
    detail.querySelectorAll(".es-econ-row").forEach(el => {
      const r = s.econ[+el.dataset.r];
      el.addEventListener("click", ev => {
        U.showDrill({ title: "ILLUSTRATIVE ECONOMICS · " + s.name.toUpperCase(), value: r.val, sub: r.lab + " — illustrative figure from engineering studies, not a quote or a guarantee.", source: KLINK(r.src), x: ev.clientX, y: ev.clientY });
      });
    });
    detail.querySelectorAll(".es-drill").forEach(el => {
      const d = s.drills[+el.dataset.d];
      el.addEventListener("click", ev => {
        U.showDrill({ title: d.title, value: d.value, sub: d.sub, source: KLINK(d.src), x: ev.clientX, y: ev.clientY });
      });
    });
    detail.classList.add("on");
  }

  const cards = host.querySelectorAll(".es-card");
  cards.forEach(btn => btn.addEventListener("click", () => {
    const i = +btn.dataset.sc;
    const wasOpen = btn.getAttribute("aria-selected") === "true";
    cards.forEach(b => b.setAttribute("aria-selected", "false"));
    if (wasOpen) { detail.classList.remove("on"); detail.innerHTML = ""; return; }
    btn.setAttribute("aria-selected", "true");
    renderDetail(i);
    if (window.innerWidth < 900) detail.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  // deep-link: #sec-energy-B opens scenario B
  const m = (location.hash || "").match(/^#sec-energy-([A-F])$/);
  if (m) {
    const idx = SC.findIndex(s => s.id === m[1]);
    if (idx >= 0) cards[idx].click();
  }
})();
