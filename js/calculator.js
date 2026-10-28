// ═══ §3 · Interactive savings calculator — savings before our costs are known from the
//     savings_ladder benchmark ranges. No HCSP cost figures: net time to earn back the cost is pending
//     the manufacturer cost model, and the panel says so. ═══
(function () {
  const host = document.getElementById("savings-calculator");
  if (!host) return;
  const GAL2M3 = 264.172;
  const streams = RPT.savings_ladder.filter(d => !d.na);
  const money = v => "$" + (v >= 1e6 ? (v / 1e6).toFixed(2) + "M" : Math.round(v).toLocaleString("en-US"));

  host.innerHTML = `
  <div class="calc">
    <div class="calc-head">
      <p class="calc-title">Savings calculator — what does your stream cost to make disappear today?</p>
      <p class="calc-sub">SAVINGS BEFORE OUR COSTS ARE KNOWN — NET TIME TO EARN BACK THE COST PENDING MANUFACTURER COST MODEL</p>
    </div>
    <div class="calc-grid">
      <div>
        <label for="calc-stream">Benchmark stream (from the savings ladder)</label>
        <select id="calc-stream">
          ${streams.map((d, i) => `<option value="${i}">${d.vertical} — $${d.lo}–${d.hi}${d.plus ? "+" : ""}/gal</option>`).join("")}
          <option value="-1">Custom stream (enter your own cost)</option>
        </select>
        <label for="calc-cost">Current disposal cost · $/gal</label>
        <input id="calc-cost" type="number" min="0" step="0.01" value="15">
        <label for="calc-vol">Volume · gal/yr</label>
        <input id="calc-vol" type="number" min="0" step="1000" value="925000">
        <div class="calc-presets">
          <button type="button" data-preset="halo">PRESET · HALOGENATED SOLVENTS</button>
          <button type="button" data-preset="pfas">PRESET · PFAS CONCENTRATE</button>
        </div>
      </div>
      <div class="calc-out">
        <p class="calc-big-lab">Savings before our costs are known / year</p>
        <p class="calc-big" id="calc-big">—</p>
        <p class="calc-bench" id="calc-bench"></p>
        <div class="calc-bench" id="calc-barbox">
          <div class="cb-bar"><div class="cb-range" id="calc-range"></div><div class="cb-dot" id="calc-dot"></div></div>
          <div class="cb-lab"><span id="calc-lo"></span><span>STREAM BENCHMARK RANGE (LOG SCALE)</span><span id="calc-hi"></span></div>
        </div>
        <p class="calc-note">Savings before our costs are known — net time to earn back the cost pending manufacturer cost model · benchmark ranges are documented existing supplier costs from the savings ladder (dated sources in the chart drill-downs) · no HCSP cost or pricing figure is stated or implied</p>
      </div>
    </div>
  </div>`;

  const sel = host.querySelector("#calc-stream");
  const costI = host.querySelector("#calc-cost");
  const volI = host.querySelector("#calc-vol");
  const big = host.querySelector("#calc-big");
  const bench = host.querySelector("#calc-bench");
  const rangeEl = host.querySelector("#calc-range");
  const dotEl = host.querySelector("#calc-dot");
  const loLab = host.querySelector("#calc-lo"), hiLab = host.querySelector("#calc-hi");

  // log-scale bar geometry over the ladder's full span
  const D0 = 0.005, D1 = 100;
  const pos = v => Math.max(0, Math.min(1, Math.log10(Math.max(v, D0) / D0) / Math.log10(D1 / D0)));

  function cur() {
    const i = +sel.value;
    return i >= 0 ? streams[i] : null;
  }
  function update() {
    const s = cur();
    const cost = Math.max(0, +costI.value || 0);
    const vol = Math.max(0, +volI.value || 0);
    const gross = cost * vol;
    big.textContent = money(gross) + " /yr";
    if (s) {
      const lo = s.lo, hi = s.hi;
      loLab.textContent = "$" + lo + "/gal"; hiLab.textContent = "$" + hi + (s.plus ? "+" : "") + "/gal";
      rangeEl.style.left = (pos(lo) * 100) + "%";
      rangeEl.style.width = ((pos(hi) - pos(lo)) * 100) + "%";
      dotEl.style.display = "";
      dotEl.style.left = "calc(" + (pos(cost) * 100) + "% - 2px)";
      const rel = cost < lo ? "below" : cost > hi ? (s.plus ? "inside" : "above") : "inside";
      bench.innerHTML = `At <b>$${cost.toLocaleString("en-US")}/gal</b> you sit <b>${rel}</b> the documented
        <b>$${lo}–${hi}${s.plus ? "+" : ""}/gal</b> range for <b>${s.vertical}</b>
        (≈ $${(cost * GAL2M3).toLocaleString("en-US", { maximumFractionDigits: 0 })}/m³ × ${(vol / GAL2M3).toLocaleString("en-US", { maximumFractionDigits: 0 })} m³/yr).`;
    } else {
      loLab.textContent = ""; hiLab.textContent = "";
      rangeEl.style.left = "0%"; rangeEl.style.width = "0%";
      dotEl.style.display = "none";
      bench.innerHTML = `Custom basis: <b>$${cost.toLocaleString("en-US")}/gal</b> × <b>${vol.toLocaleString("en-US")} gal/yr</b>
        (≈ $${(cost * GAL2M3).toLocaleString("en-US", { maximumFractionDigits: 0 })}/m³ × ${(vol / GAL2M3).toLocaleString("en-US", { maximumFractionDigits: 0 })} m³/yr).
        Select a benchmark stream above to compare against its documented range.`;
    }
  }
  sel.addEventListener("input", () => {
    const s = cur();
    if (s) costI.value = s.lo; // conservative end of the documented range
    update();
  });
  costI.addEventListener("input", update);
  volI.addEventListener("input", update);
  host.querySelectorAll("[data-preset]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.preset === "halo") {
      // halogenated solvents: documented $15–50+/gal · one module-year (~0.9M gal)
      sel.value = String(streams.findIndex(d => d.key === "chem"));
      costI.value = 15; volI.value = 925000;
    } else {
      // PFAS concentrate: conservative $5/gal (vs $5–10/gal incineration) · one module-year
      sel.value = String(streams.findIndex(d => d.key === "pfas"));
      costI.value = 5; volI.value = 925000;
    }
    update();
  }));
  sel.value = String(streams.findIndex(d => d.key === "chem"));
  update();
})();
