// ═══ Cover variants B (exploded skid) + D (unboxing opener) — shared engine ═══
// The physical atom: a containerized SCWO module on a steel skid.
// Layers bottom→top: skid · electrolyzer (as-briefed) · preheater/pump · reactor · separator.
(function () {
  const canvas = document.getElementById("cover-canvas-x");
  if (!canvas) return;
  const PAL = U.PAL, TAU = U.TAU;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = U.clamp, lerp = U.lerp;

  // ── Layer definitions: mounted plan position (x,y), footprint (w,d), height, mounted z ──
  const LAYERS = [
    { id: "skid",  x: 0, y: 0, w: 22, d: 10, h: 1.1, z: 0,    sep: 0,
      head: "STEEL SKID", sub: "8–10 m² · container class · no air permit", col: "#42566a", k: "K1" },
    { id: "ely",   x: -7.2, y: 0, w: 6.4, d: 7.6, h: 3.1, z: 1.1, sep: 3.2,
      head: "ELECTROLYZER (AS BRIEFED)", sub: "H₂ loop: fuel on demand from process water · self-fueling", col: PAL.inkMd, k: "K1" },
    { id: "pre",   x: -1.4, y: 0, w: 5.2, d: 8.0, h: 2.5, z: 1.1, sep: 7.0,
      head: "HP PUMP + ELECTRIC PREHEATER", sub: "75–95 kW · 180–228 kWh/m³ gross", col: PAL.inkMd, k: "K23" },
    { id: "rx",    x: 3.6, y: 0, w: 5.4, d: 5.4, h: 6.8, z: 1.1, sep: 11.4, cyl: true,
      head: "SCWO REACTOR", sub: "380–420 °C · 25 MPa · 99.9993% DRE ✓", col: PAL.red, k: "K2" },
    { id: "sep",   x: 8.6, y: 0, w: 6.2, d: 3.6, h: 3.6, z: 1.1, sep: 16.2, drum: true,
      head: "SEPARATOR + POLISH", sub: "85–95% water, sludge · power/cooling export", col: PAL.redHi, k: "K1" },
  ];

  // ── Seeded material textures ──
  function brushed() {
    const c = document.createElement("canvas"); c.width = 256; c.height = 64;
    const x = c.getContext("2d"), rnd = U.makeRng(7);
    for (let i = 0; i < 340; i++) {
      const y = rnd() * 64, g = 150 + rnd() * 90;
      x.strokeStyle = `rgba(${g},${g + 6},${g + 14},${0.16 + rnd() * 0.2})`;
      x.lineWidth = 0.8;
      x.beginPath(); x.moveTo(0, y); x.lineTo(256, y + (rnd() - 0.5) * 3); x.stroke();
    }
    return c;
  }
  function wood() {
    const c = document.createElement("canvas"); c.width = 256; c.height = 256;
    const x = c.getContext("2d"), rnd = U.makeRng(21);
    x.fillStyle = "#c9a06b"; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 60; i++) {
      const y = rnd() * 256;
      x.strokeStyle = `rgba(122,84,44,${0.10 + rnd() * 0.22})`; x.lineWidth = 1 + rnd() * 2.2;
      x.beginPath(); x.moveTo(0, y);
      for (let px = 0; px <= 256; px += 32) x.lineTo(px, y + Math.sin(px * 0.05 + i) * 3 + (rnd() - 0.5) * 3);
      x.stroke();
    }
    x.strokeStyle = "rgba(90,60,30,.5)"; x.lineWidth = 2;
    for (let px = 0; px <= 256; px += 64) { x.beginPath(); x.moveTo(px, 0); x.lineTo(px, 256); x.stroke(); }
    return c;
  }
  let texMetal = null, texWood = null, patMetal = null, patWood = null;

  // ── State ──
  let view = null, raf = 0, active = false;
  let k = 1, kTgt = 1, last = 0, tt = 0;             // explosion master (1 = exploded)
  let yawExtra = 0;
  const mouse = { x: 0 };
  addEventListener("pointermove", e => { mouse.x = (e.clientX / innerWidth - 0.5); });

  // Unboxing (D) state
  const INTRO = { on: false, t: 0, dur: 3.0 };
  let shakeAmp = 0, uK = 1, particles = [], rings = [];
  let lid = null, wallsA = 0; // crate lid flight state, wall alpha

  function startIntro() {
    INTRO.on = true; INTRO.t = 0; k = 0; uK = 1.34; yawExtra = 0.55;
    shakeAmp = 0; particles = []; rings = [];
    lid = { fly: false, x: 0, y: 0, rot: 0, a: 1 };
    wallsA = 1;
  }
  function finishIntro() {
    INTRO.on = false; k = 1; uK = 1; yawExtra = 0; shakeAmp = 0; particles = []; rings = []; wallsA = 0;
    if (lid) lid.a = 0;
  }

  function spawnDust(cx, cy, n, up) {
    const rnd = U.makeRng(Math.floor(tt * 1000) + n);
    for (let i = 0; i < n; i++) {
      const a = rnd() * TAU, sp = 40 + rnd() * 130;
      particles.push({
        x: cx + (rnd() - 0.5) * 120, y: cy + (rnd() - 0.5) * 30,
        vx: Math.cos(a) * sp, vy: up ? -(60 + rnd() * 200) : -rnd() * 40,
        life: 1, size: 1.5 + rnd() * 3,
        col: rnd() > 0.5 ? "#b08b57" : "#8c98a6",
      });
    }
  }

  // ── Geometry ──
  // Projection per COVER.md: rx=x·cosYaw−y·sinYaw; ry=x·sinYaw+y·cosYaw → {cx+rx·u, cy+ry·u·0.5 − z·u}
  function makeCam(W, H) {
    const leftBound = 0.585 * W, right = W - 332;
    let u = Math.min((right - leftBound) / 34, H * 0.0162);
    let cx = (leftBound + right) / 2, cy = 0.53 * H, rr = right;
    if (u < 5.6) { rr = W - 40; u = Math.min((rr - leftBound) / 34, H * 0.0162); cx = (leftBound + rr) / 2; }
    return { u: Math.max(4, u) * uK, cx, cy, labelX: rr + 18, small: u < 5.6 };
  }
  function pt(cam, yaw, x, y, z) {
    const rx = x * Math.cos(yaw) - y * Math.sin(yaw);
    const ry = x * Math.sin(yaw) + y * Math.cos(yaw);
    return { x: cam.cx + rx * cam.u, y: cam.cy + ry * cam.u * 0.5 - z * cam.u, d: ry };
  }
  function poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  // Axonometric box at layer position; zLift = explosion offset. Faces painter-sorted far→near.
  function drawBox(ctx, cam, yaw, L, zLift, opts = {}) {
    const z0 = L.z + zLift, x0 = L.x - L.w / 2, x1 = L.x + L.w / 2, y0 = L.y - L.d / 2, y1 = L.y + L.d / 2;
    const c = {
      bfl: pt(cam, yaw, x0, y0, z0), bfr: pt(cam, yaw, x1, y0, z0),
      bbl: pt(cam, yaw, x0, y1, z0), bbr: pt(cam, yaw, x1, y1, z0),
      tfl: pt(cam, yaw, x0, y0, z0 + L.h), tfr: pt(cam, yaw, x1, y0, z0 + L.h),
      tbl: pt(cam, yaw, x0, y1, z0 + L.h), tbr: pt(cam, yaw, x1, y1, z0 + L.h),
    };
    const sides = [
      { p: [c.bfl, c.bfr, c.tfr, c.tfl], d: (c.bfl.d + c.bfr.d) / 2, n: "f" },
      { p: [c.bfr, c.bbr, c.tbr, c.tfr], d: (c.bfr.d + c.bbr.d) / 2, n: "r" },
      { p: [c.bbr, c.bbl, c.tbl, c.tbr], d: (c.bbr.d + c.bbl.d) / 2, n: "b" },
      { p: [c.bbl, c.bfl, c.tfl, c.tbl], d: (c.bbl.d + c.bfl.d) / 2, n: "l" },
    ].sort((a, b) => b.d - a.d);
    const base = opts.fill || "#c3ccd6";
    for (const s of sides) {
      const g = ctx.createLinearGradient(0, Math.min(...s.p.map(p => p.y)), 0, Math.max(...s.p.map(p => p.y)));
      g.addColorStop(0, "rgba(255,255,255,.30)");
      g.addColorStop(0.5, "rgba(255,255,255,0)");
      g.addColorStop(1, "rgba(5,28,44,.10)");
      poly(ctx, s.p, base, null);
      if (patMetal && !opts.noTex) { poly(ctx, s.p, patMetal, null); }
      poly(ctx, s.p, g, "rgba(5,28,44,.28)", 1);
    }
    // top face + bevel
    const top = [c.tfl, c.tfr, c.tbr, c.tbl];
    const tg = ctx.createLinearGradient(c.tbl.x, c.tbl.y, c.tfr.x, c.tfr.y);
    tg.addColorStop(0, "rgba(255,255,255,.38)"); tg.addColorStop(1, "rgba(5,28,44,.05)");
    poly(ctx, top, opts.top || "#dde4ec", null);
    poly(ctx, top, tg, "rgba(255,255,255,.7)", 1.4);
    return c;
  }
  // Vertical cylinder (reactor) / horizontal drum (separator), 14-gon
  function drawCyl(ctx, cam, yaw, L, zLift, horizontal) {
    const N = 14, r = horizontal ? L.d / 2 : L.w / 2;
    const z0 = L.z + zLift;
    if (!horizontal) {
      const pts = [];
      for (let i = 0; i < N; i++) {
        const a = (i / N) * TAU;
        pts.push({ b: pt(cam, yaw, L.x + r * Math.cos(a), L.y + r * Math.sin(a), z0),
                   t: pt(cam, yaw, L.x + r * Math.cos(a), L.y + r * Math.sin(a), z0 + L.h) });
      }
      for (let i = 0; i < N; i++) {
        const q = [pts[i].b, pts[(i + 1) % N].b, pts[(i + 1) % N].t, pts[i].t];
        const dd = (pts[i].b.d + pts[(i + 1) % N].b.d) / 2;
        const shade = clamp(0.5 + dd * 0.06, 0.15, 1);
        const g = Math.round(120 + shade * 105);
        poly(ctx, q, `rgb(${g - 14},${g - 4},${g + 8})`, "rgba(5,28,44,.25)", 0.8);
      }
      poly(ctx, pts.map(p => p.t), "#e6ebf1", "rgba(5,28,44,.35)", 1.2);
      // band rings (identity: vessel hoops)
      ctx.strokeStyle = "rgba(5,28,44,.4)"; ctx.lineWidth = 1.1;
      [0.3, 0.62, 0.9].forEach(f => {
        ctx.beginPath();
        pts.forEach((p, i) => {
          const q = pt(cam, yaw, L.x + r * Math.cos((i / N) * TAU), L.y + r * Math.sin((i / N) * TAU), z0 + L.h * f);
          i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
        });
        ctx.closePath(); ctx.stroke();
      });
    } else {
      // horizontal drum along x
      const len = L.w, zc = z0 + L.h / 2;
      const ringsX = [L.x - len / 2, L.x + len / 2];
      const rp = ringsX.map(rx => {
        const arr = [];
        for (let i = 0; i < N; i++) {
          const a = (i / N) * TAU;
          arr.push(pt(cam, yaw, rx, L.y + r * Math.cos(a), zc + r * Math.sin(a)));
        }
        return arr;
      });
      for (let i = 0; i < N; i++) {
        const q = [rp[0][i], rp[0][(i + 1) % N], rp[1][(i + 1) % N], rp[1][i]];
        const shade = clamp(0.55 + Math.sin((i / N) * TAU) * 0.45, 0.1, 1);
        const g = Math.round(125 + shade * 100);
        poly(ctx, q, `rgb(${g - 16},${g - 6},${g + 6})`, "rgba(5,28,44,.22)", 0.8);
      }
      poly(ctx, rp[1], "#e2e8ef", "rgba(5,28,44,.35)", 1.2);
      poly(ctx, rp[0], "#cfd8e1", "rgba(5,28,44,.3)", 1.1);
    }
  }

  // ── Crate (D) ──
  function drawCrate(ctx, cam, yaw) {
    // four walls around the assembled footprint + a lid; wood material
    const W2 = 24 / 2, D2 = 12 / 2, H = 9.5, th = 0.55;
    const walls = [
      { x: 0, y: -D2, w: 24, d: th, h: H, z: 0 },
      { x: 0, y: D2 - th, w: 24, d: th, h: H, z: 0 },
      { x: -W2, y: 0, w: th, d: 12, h: H, z: 0 },
      { x: W2 - th, y: 0, w: th, d: 12, h: H, z: 0 },
    ];
    ctx.save(); ctx.globalAlpha = wallsA;
    walls.forEach(wl => {
      const L = { x: wl.x, y: wl.y, w: wl.w, d: wl.d, h: wl.h, z: 0 };
      drawBox(ctx, cam, yaw, L, 0, { fill: "#c9a06b", top: "#d8b57f", noTex: true });
      // plank seams
    });
    ctx.restore();
    // stencil on the near wall (upright mono, never rotated with the face)
    if (wallsA > 0.05) {
      ctx.save(); ctx.globalAlpha = wallsA * 0.85;
      ctx.font = '700 13px Menlo, Consolas, monospace'; ctx.textAlign = "center";
      ctx.fillStyle = "rgba(60,40,20,.8)";
      const p = pt(cam, yaw, 0, D2, H * 0.45);
      ctx.fillText("FRAGILE · THIS SIDE UP ↑", p.x, p.y);
      ctx.fillText("HCSP SKID · 10 M³/DAY", p.x, p.y + 18);
      ctx.restore();
    }
    // lid
    if (lid && lid.a > 0.02) {
      ctx.save(); ctx.globalAlpha = lid.a;
      ctx.translate(lid.x, lid.y); ctx.rotate(lid.rot);
      const L = { x: 0, y: 0, w: 24, d: 12, h: 0.8, z: H };
      drawBox(ctx, cam, yaw, L, 0, { fill: "#c9a06b", top: "#dbba86", noTex: true });
      ctx.restore();
    }
  }

  // ── Labels ──
  function drawLabels(ctx, cam, yaw, W, H, la) {
    if (cam.small || la <= 0.01) return;
    ctx.save(); ctx.globalAlpha = la;
    const rows = [];
    LAYERS.forEach((L, i) => {
      const layI = clamp(k * 1.55 - i * 0.17, 0, 1);
      const zl = L.sep * layI + Math.sin(tt * 0.9 + i * 1.7) * 0.12 * layI;
      // rightmost projected anchor of the layer's top rim
      const cands = [
        pt(cam, yaw, L.x + L.w / 2, L.y - L.d / 2, L.z + zl + L.h),
        pt(cam, yaw, L.x + L.w / 2, L.y + L.d / 2, L.z + zl + L.h),
        pt(cam, yaw, L.x - L.w / 2, L.y + L.d / 2, L.z + zl + L.h * 0.5),
        pt(cam, yaw, L.x + L.w / 2, L.y, L.z + zl),
      ];
      const a = cands.reduce((m, p) => (p.x > m.x ? p : m), cands[0]);
      rows.push({ L, ax: a.x, ay: a.y, ty: a.y });
    });
    rows.sort((p, q) => p.ty - q.ty);
    for (let i = 1; i < rows.length; i++) if (rows[i].ty - rows[i - 1].ty < 34) rows[i].ty = rows[i - 1].ty + 34;
    rows.forEach(r => {
      const lx = cam.labelX, maxW = W - lx - 26;
      ctx.strokeStyle = "rgba(5,28,44,.4)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(r.ax + 4, r.ay); ctx.lineTo(lx - 8, r.ty + 4); ctx.lineTo(lx - 2, r.ty + 4); ctx.stroke();
      ctx.fillStyle = r.L.col;
      ctx.beginPath(); ctx.arc(r.ax, r.ay, 2.6, 0, TAU); ctx.fill();
      // measure-truncated mono lines
      ctx.textAlign = "left";
      ctx.font = '700 10.5px Menlo, Consolas, monospace';
      let head = r.L.head;
      while (ctx.measureText(head).width > maxW && head.length > 4) head = head.slice(0, -2);
      ctx.fillStyle = r.L.col === PAL.neg ? PAL.neg : PAL.ink;
      ctx.fillText(head, lx, r.ty + 4);
      ctx.font = '10px Menlo, Consolas, monospace';
      let sub = r.L.sub;
      while (ctx.measureText(sub).width > maxW && sub.length > 4) sub = sub.slice(0, -2);
      ctx.fillStyle = r.L.col === PAL.neg ? "rgba(194,47,78,.85)" : PAL.inkMd;
      ctx.fillText(sub, lx, r.ty + 19);
    });
    ctx.restore();
  }

  // ── Main draw ──
  function draw(ts) {
    if (!active) return;
    const r = canvas.getBoundingClientRect();
    if (Math.abs(r.width - (view.w || 0)) > 2 || Math.abs(r.height - (view.h || 0)) > 2) {
      const v = view.fit(); view.w = v.w; view.h = v.h;
      patMetal = view.ctx.createPattern(texMetal, "repeat");
      patWood = view.ctx.createPattern(texWood, "repeat");
    }
    const ctx = view.ctx, W = view.w || r.width, H = view.h || r.height;
    const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016); last = ts;
    if (!REDUCE) tt += dt;

    // intro timeline (D)
    if (INTRO.on) {
      INTRO.t += dt; const t = INTRO.t;
      if (t < 0.5) { shakeAmp = 1.2 + 1.2 * Math.abs(Math.sin(t * 34)); }
      if (t >= 0.5 && lid && !lid.fly) { lid.fly = true; shakeAmp = 15; spawnDust(camCache.cx, camCache.cy - 60, 26, true); rings.push({ x: camCache.cx, y: camCache.cy - 40, r: 10, a: 0.5 }); }
      if (lid && lid.fly && lid.a > 0) {
        const e = 1 - Math.pow(1 - clamp((t - 0.5) / 0.85, 0, 1), 3);
        lid.x = -150 * e; lid.y = -40 * e - 60 * e; lid.rot = -0.85 * e; lid.a = 1 - clamp((t - 0.9) / 0.45, 0, 1);
      }
      if (t >= 0.55) {
        const wa = clamp(1 - (t - 0.55) / 0.45, 0, 1);
        if (wallsA === 1 && wa < 1) { rings.push({ x: camCache.cx, y: camCache.cy + 30, r: 16, a: 0.4 }); spawnDust(camCache.cx, camCache.cy + 40, 20, false); }
        wallsA = wa;
      }
      if (t >= 0.6) {
        const p = clamp((t - 0.6) / 1.4, 0, 1);
        const back = 3.1; // harder overshoot for the unbox
        k = 1 + (back + 1) * Math.pow(p - 1, 3) + back * Math.pow(p - 1, 2); // backOut
        k = clamp(k, 0, 1.08);
      }
      uK = lerp(1.34, 1, clamp((t - 0.55) / 1.55, 0, 1));
      yawExtra = lerp(0.55, 0, clamp((t - 0.55) / 1.55, 0, 1));
      if (t >= 2.95) finishIntro();
    } else if (!REDUCE) {
      k = U.ease(k, kTgt, dt, 0.28);
    }
    shakeAmp *= Math.exp(-dt * 5.5);

    const yaw = Math.PI / 4 + (REDUCE ? 0 : 0.14 * Math.sin(tt * 0.6)) + yawExtra + mouse.x * 0.22;
    const cam = makeCam(W, H); camCache = cam;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);

    ctx.save();
    if (shakeAmp > 0.05) ctx.translate(Math.sin(tt * 96) * shakeAmp, Math.cos(tt * 81) * shakeAmp * 0.7);

    // ground shadow
    const gs = pt(cam, yaw, 0, 0, 0);
    const rg = ctx.createRadialGradient(gs.x, gs.y + 14, 4, gs.x, gs.y + 14, 15 * cam.u);
    rg.addColorStop(0, "rgba(5,28,44,.16)"); rg.addColorStop(1, "rgba(5,28,44,0)");
    ctx.fillStyle = rg;
    ctx.save(); ctx.translate(gs.x, gs.y + 14); ctx.scale(1, 0.42); ctx.translate(-gs.x, -(gs.y + 14));
    ctx.beginPath(); ctx.arc(gs.x, gs.y + 14, 15 * cam.u, 0, TAU); ctx.fill(); ctx.restore();

    // layers bottom-up with inter-layer plate shadows
    LAYERS.forEach((L, i) => {
      const layI = INTRO.on ? clamp(k * 1.55 - i * 0.17, 0, 1.1) : clamp(k * 1.55 - i * 0.17, 0, 1);
      const zl = L.sep * layI + (REDUCE ? 0 : Math.sin(tt * 0.9 + i * 1.7) * 0.12 * layI);
      if (i > 0 && layI > 0.02) {
        // soft ellipse shadow cast on the layer below
        const below = pt(cam, yaw, L.x, L.y, L.z + zl * 0.0 + LAYERS[i - 1].z + LAYERS[i - 1].h + 0.02);
        const aS = clamp(0.20 - (zl) * 0.012, 0.04, 0.2);
        ctx.fillStyle = `rgba(5,28,44,${aS.toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(below.x, below.y, L.w * 0.42 * cam.u * 0.5, L.d * 0.42 * cam.u * 0.25, 0, 0, TAU); ctx.fill();
      }
      const special = L.cyl || L.drum;
      if (special) drawCyl(ctx, cam, yaw, L, zl, !!L.drum);
      else {
        drawBox(ctx, cam, yaw, L, zl, { fill: L.id === "skid" ? "#9fb0bf" : "#c3ccd6" });
        // identity details
        if (L.id === "skid") {
          // rail channels + forklift pockets on the slab top
          const z0 = L.z + zl + L.h;
          [-3.2, 3.2].forEach(yy => {
            const a = pt(cam, yaw, L.x - L.w / 2 + 0.6, L.y + yy - 0.35, z0), b = pt(cam, yaw, L.x + L.w / 2 - 0.6, L.y + yy - 0.35, z0);
            const c2 = pt(cam, yaw, L.x + L.w / 2 - 0.6, L.y + yy + 0.35, z0), d2 = pt(cam, yaw, L.x - L.w / 2 + 0.6, L.y + yy + 0.35, z0);
            poly(ctx, [a, b, c2, d2], "#5d7186", null);
          });
        }
        if (L.id === "ely") {
          // vent grille on top
          const z0 = L.z + zl + L.h;
          ctx.strokeStyle = "rgba(5,28,44,.35)"; ctx.lineWidth = 0.8;
          for (let gi = 1; gi <= 5; gi++) {
            const a = pt(cam, yaw, L.x - L.w / 2 + 0.4, L.y - L.d / 2 + gi * (L.d - 0.8) / 6, z0);
            const b = pt(cam, yaw, L.x + L.w / 2 - 0.4, L.y - L.d / 2 + gi * (L.d - 0.8) / 6, z0);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (L.id === "pre") {
          // coil fins on the side face
          const z0 = L.z + zl;
          ctx.strokeStyle = "rgba(5,28,44,.4)"; ctx.lineWidth = 0.9;
          for (let gi = 1; gi <= 4; gi++) {
            const a = pt(cam, yaw, L.x - L.w / 2, L.y - L.d / 2 + 0.3, z0 + gi * L.h / 5);
            const b = pt(cam, yaw, L.x + L.w / 2, L.y - L.d / 2 + 0.3, z0 + gi * L.h / 5);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
    });

    // process pipe: reactor top → separator (electric blue, only when mostly assembled/exploded)
    if (k > 0.35 && !INTRO.on) {
      const lay = i => clamp(k * 1.55 - i * 0.17, 0, 1);
      const rxL = LAYERS[3], spL = LAYERS[4];
      const a = pt(cam, yaw, rxL.x + 1.2, rxL.y, rxL.z + rxL.sep * lay(3) + rxL.h + 0.4);
      const b = pt(cam, yaw, spL.x - spL.w / 2, spL.y, spL.z + spL.sep * lay(4) + spL.h * 0.75);
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 2.2; ctx.globalAlpha = clamp((k - 0.35) * 2, 0, 1);
      ctx.beginPath(); ctx.moveTo(a.x, a.y);
      ctx.bezierCurveTo(a.x + 30, a.y - 26, b.x - 30, b.y - 20, b.x, b.y);
      ctx.stroke(); ctx.globalAlpha = 1;
    }

    // crate + particles (D intro)
    if (INTRO.on) {
      drawCrate(ctx, cam, yaw);
      rings.forEach(rg2 => {
        rg2.r += dt * 260; rg2.a *= Math.exp(-dt * 3.2);
        ctx.save(); ctx.translate(rg2.x, rg2.y); ctx.scale(1, 0.5);
        ctx.strokeStyle = `rgba(34,81,255,${clamp(rg2.a, 0, 1).toFixed(3)})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, rg2.r, 0, TAU); ctx.stroke(); ctx.restore();
      });
      particles.forEach(p => {
        p.vy += 320 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 0.9;
        if (p.life <= 0) return;
        ctx.fillStyle = p.col; ctx.globalAlpha = clamp(p.life, 0, 1);
        ctx.fillRect(p.x, p.y, p.size, p.size * 0.7); ctx.globalAlpha = 1;
      });
      particles = particles.filter(p => p.life > 0);
    }
    ctx.restore();

    // labels (fade with k in B; timeline-driven in D)
    const la = INTRO.on ? clamp((INTRO.t - 1.9) / 0.9, 0, 1) : clamp((k - 0.45) * 2.4, 0, 1);
    drawLabels(ctx, cam, yaw, W, H, la);

    // caption bottom-right, switches with state
    ctx.font = '700 11px Menlo, Consolas, monospace'; ctx.textAlign = "right";
    ctx.fillStyle = PAL.inkLo;
    const state = INTRO.on ? "UNBOXING" : (k > 0.5 ? "EXPLODED" : "ASSEMBLED");
    ctx.fillText(`FIG. ${INTRO.on ? "D" : "B"} · ${state} · SCALE NTS`, W - 26, H - 46);
    ctx.fillStyle = PAL.inkMd;
    ctx.fillText(INTRO.on ? "THE SKID, DELIVERED" : (k > 0.5 ? "CLICK TO ASSEMBLE" : "CLICK TO EXPLODE"), W - 26, H - 28);

    // left wash for the text column
    const grad = ctx.createLinearGradient(0, 0, W * 0.64, 0);
    grad.addColorStop(0, "rgba(255,255,255,.97)");
    grad.addColorStop(0.55, "rgba(255,255,255,.88)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W * 0.64, H);

    if (!REDUCE) raf = requestAnimationFrame(draw);
  }
  let camCache = { cx: 0, cy: 0 };

  // click blank area toggles assemble/explode; dblclick replays intro in D
  canvas.addEventListener("click", e => {
    if (INTRO.on) return;
    if (e.target.closest("button") || e.target.closest("a")) return;
    kTgt = kTgt > 0.5 ? 0 : 1;
  });
  canvas.addEventListener("dblclick", () => { if (mode === "d" && !REDUCE) startIntro(); });

  let mode = "b";
  texMetal = brushed(); texWood = wood();
  view = U.bindCanvas(canvas);

  window.COVER_X = {
    setActive(on, opts = {}) {
      active = on; cancelAnimationFrame(raf);
      if (on) {
        const v = view.fit(); view.w = v.w; view.h = v.h;
        patMetal = view.ctx.createPattern(texMetal, "repeat");
        patWood = view.ctx.createPattern(texWood, "repeat");
        if (opts.intro && !REDUCE) { startIntro(); raf = requestAnimationFrame(draw); }
        else if (REDUCE) {
          finishIntro(); k = 1; kTgt = 1;
          // defer the one-shot frame until after layout reflow (0×0 pitfall)
          requestAnimationFrame(() => requestAnimationFrame(() => { const v2 = view.fit(); view.w = v2.w; view.h = v2.h; draw(16); }));
        } else { if (mode === "d" && !opts.intro) { /* D without intro: settled state */ } last = 0; raf = requestAnimationFrame(draw); }
      }
    },
    setMode(m) { mode = m; },
    playIntro() { if (!REDUCE) { startIntro(); last = 0; } },
  };
})();
