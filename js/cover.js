// ═══ Cover variant A · "The array" — infinite self-similar recursion of the HCSP skid ═══
// What recurses is the object itself: one recognizable SCWO skid zooms out until it is
// one cell of a 5×5 array of identical skids — a deployment map across industries.
(function () {
  const canvas = document.getElementById("cover-canvas");
  if (!canvas) return;
  const PAL = U.PAL;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = 5, T = 12000; // grid order, ms per recursion layer

  // ── Skid pictogram tile (plan view): pre-rendered offscreen, 8 seeded variants ──
  // Identity details: steel skid rails, container block, reactor vessel (concentric
  // circles = vertical vessel seen from above), electrolyzer box, separator drum, pipe runs.
  function makeTile(seed, deep) {
    const s = 240, c = document.createElement("canvas");
    c.width = c.height = s;
    const x = c.getContext("2d"), rnd = U.makeRng(seed);
    // skid base: steel pad + two rail channels
    x.fillStyle = "#c7d0da"; x.fillRect(14, 14, s - 28, s - 28);
    x.fillStyle = "#8ea0b2";
    x.fillRect(14, 14, s - 28, 12); x.fillRect(14, s - 26, s - 28, 12);
    x.fillStyle = "#aab8c6";
    x.fillRect(14, 30, s - 28, 5); x.fillRect(14, s - 35, s - 28, 5);
    // forklift pockets
    x.fillStyle = "#5d7186";
    x.fillRect(60, 14, 26, 12); x.fillRect(154, 14, 26, 12);
    x.fillRect(60, s - 26, 26, 12); x.fillRect(154, s - 26, 26, 12);
    if (!deep) {
    // container block (main enclosure)
    x.fillStyle = "#eef1f5"; x.strokeStyle = PAL.inkMd; x.lineWidth = 2;
    x.fillRect(36, 44, 108, 152); x.strokeRect(36, 44, 108, 152);
    // corrugation lines
    x.strokeStyle = "#c3cdd8"; x.lineWidth = 1;
    for (let i = 1; i < 7; i++) { x.beginPath(); x.moveTo(36 + i * 15, 46); x.lineTo(36 + i * 15, 194); x.stroke(); }
    // reactor vessel — vertical cylinder from above: concentric rings
    const vx = 90, vy = 100;
    x.fillStyle = "#dbe3ec"; x.strokeStyle = PAL.ink; x.lineWidth = 2.4;
    x.beginPath(); x.arc(vx, vy, 34, 0, U.TAU); x.fill(); x.stroke();
    x.strokeStyle = PAL.inkMd; x.lineWidth = 1.2;
    x.beginPath(); x.arc(vx, vy, 24, 0, U.TAU); x.stroke();
    x.beginPath(); x.arc(vx, vy, 13, 0, U.TAU); x.stroke();
    x.fillStyle = PAL.red; // electric-blue core dot: the supercritical zone
    x.beginPath(); x.arc(vx, vy, 5.5, 0, U.TAU); x.fill();
    // electrolyzer box (as-briefed H₂ unit) — lower-left
    x.fillStyle = "#dfe7ef"; x.strokeStyle = PAL.inkMd; x.lineWidth = 1.6;
    x.fillRect(46, 148, 44, 36); x.strokeRect(46, 148, 44, 36);
    x.strokeStyle = PAL.inkLo; x.lineWidth = 1;
    for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(46 + i * 11, 150); x.lineTo(46 + i * 11, 182); x.stroke(); }
    // separator drum — right side horizontal cylinder end
    x.fillStyle = "#d3dce6"; x.strokeStyle = PAL.inkMd; x.lineWidth = 1.8;
    x.fillRect(158, 60, 56, 44); x.strokeRect(158, 60, 56, 44);
    x.beginPath(); x.ellipse(214, 82, 10, 22, 0, 0, U.TAU); x.fill(); x.stroke();
    x.strokeStyle = PAL.inkLo; x.lineWidth = 1;
    x.beginPath(); x.moveTo(158, 74); x.lineTo(214, 74); x.stroke();
    x.beginPath(); x.moveTo(158, 90); x.lineTo(214, 90); x.stroke();
    // pump skid — bottom right
    x.fillStyle = "#cdd7e1"; x.strokeStyle = PAL.inkMd; x.lineWidth = 1.6;
    x.fillRect(158, 128, 56, 40); x.strokeRect(158, 128, 56, 40);
    x.fillStyle = PAL.inkMd;
    x.beginPath(); x.arc(176, 148, 9, 0, U.TAU); x.fill();
    x.beginPath(); x.arc(198, 148, 9, 0, U.TAU); x.fill();
    // pipe runs (electric blue process line: vessel → separator)
    x.strokeStyle = PAL.red; x.lineWidth = 3;
    x.beginPath(); x.moveTo(124, 100); x.lineTo(158, 88); x.stroke();
    x.lineWidth = 2; x.strokeStyle = PAL.inkMd;
    x.beginPath(); x.moveTo(90, 134); x.lineTo(90, 148); x.stroke(); // vessel → electrolyzer utility
    x.beginPath(); x.moveTo(176, 157); x.lineTo(176, 168); x.lineTo(144, 168); x.stroke(); // pump → container
    }
    // speckle (material noise, seeded)
    x.fillStyle = "rgba(5,28,44,.05)";
    for (let i = 0; i < 90; i++) x.fillRect(20 + rnd() * 200, 20 + rnd() * 200, 1.4, 1.4);
    if (deep) {
      // recursion motif: the deck carries a 5×5 array of micro-skids —
      // the tile reads as "one cell of a deployed fleet" at every scale
      x.fillStyle = "#eef1f5"; x.strokeStyle = PAL.inkMd; x.lineWidth = 1.6;
      x.fillRect(30, 36, 180, 168); x.strokeRect(30, 36, 180, 168);
      const gx0 = 38, gy0 = 44, cw = 33;
      for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) {
        const mx = gx0 + i * cw, my = gy0 + j * cw;
        x.fillStyle = "#f6f8fb"; x.strokeStyle = "rgba(5,28,44,.45)"; x.lineWidth = 0.8;
        x.fillRect(mx, my, 27, 27); x.strokeRect(mx, my, 27, 27);
        x.fillStyle = "#9fb0bf"; x.fillRect(mx, my + 22, 27, 4);            // rail
        x.fillStyle = "#dbe3ec"; x.strokeStyle = "rgba(5,28,44,.5)";
        x.fillRect(mx + 3, my + 4, 13, 17); x.strokeRect(mx + 3, my + 4, 13, 17); // container
        x.beginPath(); x.arc(mx + 20.5, my + 11, 5.5, 0, U.TAU);           // vessel
        x.fillStyle = "#d3dce6"; x.fill(); x.stroke();
        x.fillStyle = PAL.red; x.beginPath(); x.arc(mx + 20.5, my + 11, 2, 0, U.TAU); x.fill();
      }
    }
    return c;
  }
  const tiles = [], deepTiles = [];
  for (let i = 0; i < 8; i++) { tiles.push(makeTile(101 + i * 17, false)); deepTiles.push(makeTile(301 + i * 13, true)); }

  // ── Camera / recursion state ──
  let view = null, t0 = null, raf = 0, active = false;
  const mouse = { x: 0 };
  addEventListener("pointermove", e => { mouse.x = (e.clientX / innerWidth - 0.5); });

  // BFS birth times for the 24 non-center cells of a 5×5 array (center stays the zooming atom)
  const birth = [];
  (function () {
    const cells = [];
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      if (i === 2 && j === 2) continue;
      const d = Math.max(Math.abs(i - 2), Math.abs(j - 2));
      cells.push({ i, j, d, a: Math.atan2(j - 2, i - 2) });
    }
    cells.sort((p, q) => p.d - q.d || p.a - q.a);
    cells.forEach((c, n) => birth.push({ i: c.i, j: c.j, b: 0.08 + 0.80 * (n / (cells.length - 1)) }));
  })();

  function drawTile(cx, cy, size, seedIdx, deep) {
    const set = deep && size > 130 ? deepTiles : tiles;
    const t = set[seedIdx % set.length];
    view.ctx.drawImage(t, cx - size / 2, cy - size / 2, size, size);
  }

  // Two visible layers of the same nested world: a 5×5 array of skid cells,
  // each cell's deck carrying the same 5×5 motif (baked into the tile).
  function drawArray(cx, cy, cell, phase, gateBirth) {
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      const isCenter = i === 2 && j === 2;
      const px = cx + (i - 2) * cell, py = cy + (j - 2) * cell;
      if (px < -cell / 2 || px > view.w + cell / 2 || py < -cell / 2 || py > view.h + cell / 2) continue;
      if (gateBirth && !isCenter) {
        const B = birth.find(b => b.i === i && b.j === j);
        if (B && phase < B.b) continue; // not born yet
        if (B && phase < B.b + 0.10) {
          const f = 1 - (phase - B.b) / 0.10;
          drawTile(px, py, cell * 0.96, Math.abs(i * 3 + j * 5), true);
          view.ctx.fillStyle = `rgba(34,81,255,${(f * 0.18).toFixed(3)})`;
          view.ctx.fillRect(px - cell / 2, py - cell / 2, cell, cell);
          continue;
        }
      }
      drawTile(px, py, cell * 0.96, Math.abs(i * 3 + j * 5), true);
    }
  }

  function draw(ts) {
    if (!active) return;
    if (t0 == null) t0 = ts;
    const r = canvas.getBoundingClientRect();
    if (Math.abs(r.width - (view.w || 0)) > 2 || Math.abs(r.height - (view.h || 0)) > 2) {
      const v = view.fit(); view.w = v.w; view.h = v.h;
    }
    const ctx = view.ctx, w = view.w || r.width, h = view.h || r.height;
    const elapsed = (ts - t0) / T;
    const z = REDUCE ? 0.92 : (elapsed % 1);          // zoom phase within layer (static: settled array)
    const u = Math.min(w, h) * 0.92;                    // atom size at z=0
    const driftX = REDUCE ? 0 : mouse.x * 14;
    const cx = w / 2 + driftX, cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, w, h);

    // Cell size: at z=0 one skid pictogram fills the frame; at z→1 the 5×5 array
    // of skids fills the frame. The tiles carry the array motif on their decks,
    // so the wrap reads as the same object one level up — scale, all the way up.
    const cell = u * Math.pow(G, -z);
    drawArray(cx, cy, cell, z, true);

    // Viewfinder: blue corner brackets framing the shrinking center atom (phase-faded, never flickers)
    const a = u * Math.pow(G, -z) / 2;
    const vfA = 0.85 - 0.55 * z;
    ctx.strokeStyle = PAL.red; ctx.globalAlpha = vfA; ctx.lineWidth = 2;
    const L = Math.max(10, a * 0.22);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
      const x0 = cx + sx * a, y0 = cy + sy * a;
      ctx.beginPath();
      ctx.moveTo(x0 - sx * L * 0, y0 - sy * L); ctx.lineTo(x0, y0); ctx.lineTo(x0 - sx * L, y0);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // caption (switches with phase)
    ctx.font = '700 11px Menlo, Consolas, monospace';
    ctx.textAlign = "right";
    ctx.fillStyle = PAL.inkLo;
    const msg = z < 0.33 ? "ONE SKID · 10 M³/DAY"
      : z < 0.72 ? "ONE CELL OF A DEPLOYED ARRAY"
      : "EVERY SKID IS ONE CELL ON A LARGER DEPLOYMENT MAP";
    ctx.fillText(msg, w - 26, h - 46);
    ctx.fillStyle = PAL.inkMd;
    ctx.fillText("SCALE, ALL THE WAY UP — FIG. A", w - 26, h - 28);

    // left wash for the text column
    const grad = ctx.createLinearGradient(0, 0, w * 0.64, 0);
    grad.addColorStop(0, "rgba(255,255,255,.97)");
    grad.addColorStop(0.55, "rgba(255,255,255,.88)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w * 0.64, h);

    if (!REDUCE) raf = requestAnimationFrame(draw);
  }

  view = U.bindCanvas(canvas);
  window.COVER_A = {
    setActive(on) {
      active = on;
      cancelAnimationFrame(raf);
      if (on) {
        view.fit();
        if (REDUCE) { t0 = null; requestAnimationFrame(ts => { requestAnimationFrame(() => draw(ts || 16)); }); }
        else raf = requestAnimationFrame(draw);
      }
    },
  };
})();
