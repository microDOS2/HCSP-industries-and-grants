// ═══ Cover variant C · blueprint wireframe (same geometry as B) + four-state switcher ═══
(function () {
  const PAL = U.PAL, TAU = U.TAU;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = U.clamp;

  // Mirror of the B layer table (kept in sync by construction — same physical object)
  const LAYERS = [
    { id: "skid", x: 0, y: 0, w: 22, d: 10, h: 1.1, z: 0, sep: 0, col: "#42566a", head: "STEEL SKID" },
    { id: "ely", x: -7.2, y: 0, w: 6.4, d: 7.6, h: 3.1, z: 1.1, sep: 3.2, col: PAL.neg, head: "ELECTROLYZER" },
    { id: "pre", x: -1.4, y: 0, w: 5.2, d: 8.0, h: 2.5, z: 1.1, sep: 7.0, col: PAL.inkMd, head: "PREHEATER" },
    { id: "rx", x: 3.6, y: 0, w: 5.4, d: 5.4, h: 6.8, z: 1.1, sep: 11.4, col: PAL.red, cyl: true, head: "SCWO REACTOR" },
    { id: "sep", x: 8.6, y: 0, w: 6.2, d: 3.6, h: 3.6, z: 1.1, sep: 16.2, col: PAL.redHi, drum: true, head: "SEPARATOR" },
  ];

  const canvas = document.getElementById("cover-canvas-w");
  let view = null, raf = 0, active = false, tt = 0, last = 0;
  const mouse = { x: 0 };
  addEventListener("pointermove", e => { mouse.x = (e.clientX / innerWidth - 0.5); });

  function makeCam(W, H) {
    const leftBound = 0.585 * W, right = W - 332;
    let u = Math.min((right - leftBound) / 34, H * 0.0162), rr = right;
    if (u < 5.6) { rr = W - 40; u = Math.min((rr - leftBound) / 34, H * 0.0162); }
    return { u: Math.max(4, u), cx: ((0.585 * W) + rr) / 2, cy: 0.53 * H, labelX: rr + 18 };
  }
  function pt(cam, yaw, x, y, z) {
    const rx = x * Math.cos(yaw) - y * Math.sin(yaw);
    const ry = x * Math.sin(yaw) + y * Math.cos(yaw);
    return { x: cam.cx + rx * cam.u, y: cam.cy + ry * cam.u * 0.5 - z * cam.u, d: ry };
  }
  function wireBox(ctx, cam, yaw, L, zl) {
    const z0 = L.z + zl, x0 = L.x - L.w / 2, x1 = L.x + L.w / 2, y0 = L.y - L.d / 2, y1 = L.y + L.d / 2;
    const corners = [];
    [z0, z0 + L.h].forEach(zz => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].forEach(([xx, yy]) => corners.push(pt(cam, yaw, xx, yy, zz))));
    const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    // X-ray: no hidden-line removal — farthest edges faint, near edges solid
    edges.forEach(([a, b]) => {
      const dd = (corners[a].d + corners[b].d) / 2;
      const al = clamp(0.55 - dd * 0.055, 0.16, 0.72);
      ctx.strokeStyle = hexA(L.col, al); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(corners[a].x, corners[a].y); ctx.lineTo(corners[b].x, corners[b].y); ctx.stroke();
    });
    // top face heaviest + white veil for front-back layering
    ctx.fillStyle = "rgba(255,255,255,.62)";
    ctx.beginPath();
    [4, 5, 6, 7].forEach((i, n) => n ? ctx.lineTo(corners[i].x, corners[i].y) : ctx.moveTo(corners[i].x, corners[i].y));
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = hexA(L.col, 0.85); ctx.lineWidth = 1.6;
    ctx.beginPath();
    [4, 5, 6, 7, 4].forEach((i, n) => n ? ctx.lineTo(corners[i].x, corners[i].y) : ctx.moveTo(corners[i].x, corners[i].y));
    ctx.stroke();
  }
  function wireCyl(ctx, cam, yaw, L, zl, horizontal) {
    const N = 12, z0 = L.z + zl;
    ctx.strokeStyle = hexA(L.col, 0.7); ctx.lineWidth = 1;
    if (!horizontal) {
      const r = L.w / 2;
      [z0, z0 + L.h * 0.5, z0 + L.h].forEach((zz, ri) => {
        ctx.strokeStyle = hexA(L.col, ri === 2 ? 0.9 : 0.5);
        ctx.lineWidth = ri === 2 ? 1.6 : 1;
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * TAU, p = pt(cam, yaw, L.x + r * Math.cos(a), L.y + r * Math.sin(a), zz);
          i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
        }
        ctx.stroke();
      });
      ctx.strokeStyle = hexA(L.col, 0.45); ctx.lineWidth = 1;
      for (let i = 0; i < N; i += 2) {
        const a = (i / N) * TAU;
        const b0 = pt(cam, yaw, L.x + r * Math.cos(a), L.y + r * Math.sin(a), z0);
        const b1 = pt(cam, yaw, L.x + r * Math.cos(a), L.y + r * Math.sin(a), z0 + L.h);
        ctx.beginPath(); ctx.moveTo(b0.x, b0.y); ctx.lineTo(b1.x, b1.y); ctx.stroke();
      }
    } else {
      const r = L.d / 2, zc = z0 + L.h / 2;
      [L.x - L.w / 2, L.x + L.w / 2].forEach(rx => {
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * TAU, p = pt(cam, yaw, rx, L.y + r * Math.cos(a), zc + r * Math.sin(a));
          i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
        }
        ctx.stroke();
      });
      for (let i = 0; i < N; i += 3) {
        const a = (i / N) * TAU;
        const b0 = pt(cam, yaw, L.x - L.w / 2, L.y + r * Math.cos(a), zc + r * Math.sin(a));
        const b1 = pt(cam, yaw, L.x + L.w / 2, L.y + r * Math.cos(a), zc + r * Math.sin(a));
        ctx.beginPath(); ctx.moveTo(b0.x, b0.y); ctx.lineTo(b1.x, b1.y); ctx.stroke();
      }
    }
  }
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function draw(ts) {
    if (!active) return;
    const r = canvas.getBoundingClientRect();
    if (Math.abs(r.width - (view.w || 0)) > 2 || Math.abs(r.height - (view.h || 0)) > 2) {
      const v = view.fit(); view.w = v.w; view.h = v.h;
    }
    const ctx = view.ctx, W = view.w || r.width, H = view.h || r.height;
    const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016); last = ts;
    if (!REDUCE) tt += dt;
    const yaw = Math.PI / 4 + (REDUCE ? 0 : 0.14 * Math.sin(tt * 0.6)) + mouse.x * 0.22;
    const cam = makeCam(W, H);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);

    // cross-grid base (52px)
    ctx.strokeStyle = "rgba(5,28,44,.05)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 52) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 52) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // layers (k fixed at 1 for the blueprint — the drawing is always "finished")
    const labelRows = [];
    LAYERS.forEach((L, i) => {
      const zl = L.sep + (REDUCE ? 0 : Math.sin(tt * 0.9 + i * 1.7) * 0.1);
      if (L.cyl || L.drum) wireCyl(ctx, cam, yaw, L, zl, !!L.drum);
      else wireBox(ctx, cam, yaw, L, zl);
      // hollow circle leader endpoints + name (collision-spaced)
      const a = pt(cam, yaw, L.x + L.w / 2, L.y - L.d / 2, L.z + zl + L.h);
      labelRows.push({ L, i, ax: a.x, ay: a.y, ty: a.y });
    });
    labelRows.sort((p, q) => p.ty - q.ty);
    for (let i = 1; i < labelRows.length; i++) if (labelRows[i].ty - labelRows[i - 1].ty < 20) labelRows[i].ty = labelRows[i - 1].ty + 20;
    labelRows.forEach(r => {
      ctx.strokeStyle = hexA(r.L.col, 0.8); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(r.ax, r.ay, 3.4, 0, TAU); ctx.stroke();
      if (Math.abs(r.ty - r.ay) > 6) {
        ctx.strokeStyle = hexA(r.L.col, 0.4); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(r.ax + 5, r.ay); ctx.lineTo(r.ax + 5, r.ty); ctx.stroke();
      }
      ctx.font = '700 10px Menlo, Consolas, monospace'; ctx.textAlign = "left";
      ctx.fillStyle = r.L.col;
      ctx.fillText(`0${r.i + 1} · ${r.L.head}`, r.ax + 9, r.ty + 3);
    });

    // four-corner registration marks (electric blue)
    ctx.strokeStyle = PAL.red; ctx.lineWidth = 1.6;
    [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y); ctx.moveTo(x, y - 9); ctx.lineTo(x, y + 9); ctx.stroke();
    });

    // signature strip
    ctx.font = '700 11px Menlo, Consolas, monospace'; ctx.textAlign = "right";
    ctx.fillStyle = PAL.inkLo;
    ctx.fillText("FIG. C · 5 COMPONENTS · SCALE NTS", W - 26, H - 46);
    ctx.fillStyle = PAL.inkMd;
    ctx.fillText("X-RAY WIREFRAME — NO HIDDEN-LINE REMOVAL", W - 26, H - 28);

    // left wash
    const grad = ctx.createLinearGradient(0, 0, W * 0.64, 0);
    grad.addColorStop(0, "rgba(255,255,255,.97)");
    grad.addColorStop(0.55, "rgba(255,255,255,.88)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W * 0.64, H);

    if (!REDUCE) raf = requestAnimationFrame(draw);
  }

  view = U.bindCanvas(canvas);

  // ── Four-state switcher (lives here, loads last) ──
  const cvA = document.getElementById("cover-canvas");
  const cvX = canvas;
  const cvB = document.getElementById("cover-canvas-x");
  const modes = { a: cvA, b: cvB, c: cvX };
  let cur = "a";

  function setMode(m, opts = {}) {
    if (!modes[m === "d" ? "b" : m]) m = "a";
    cur = m;
    document.querySelectorAll("#cover-mode button").forEach(b => b.classList.toggle("on", b.dataset.mode === m));
    Object.entries(modes).forEach(([key, cv]) => { cv.style.display = "none"; });
    const useX = (m === "b" || m === "d");
    const cv = useX ? cvB : modes[m];
    cv.style.display = "";
    try { localStorage.setItem("hcsp-cover", m); } catch (e) {}
    if (useX) {
      COVER_X.setMode(m);
      COVER_X.setActive(false);
      COVER_X.setActive(true, { intro: m === "d" });
      if (m === "b") { /* settled exploded state animates open via k target */ }
    } else {
      COVER_X.setActive(false);
      if (m === "a") COVER_A.setActive(true);
      else if (m === "c") { active = true; cancelAnimationFrame(raf);
        if (REDUCE) requestAnimationFrame(() => requestAnimationFrame(() => { const v = view.fit(); view.w = v.w; view.h = v.h; draw(16); }));
        else { const v = view.fit(); view.w = v.w; view.h = v.h; raf = requestAnimationFrame(draw); } }
      if (m !== "a") COVER_A.setActive(false);
    }
    // stop the others
    if (useX) { COVER_A.setActive(false); active = false; cancelAnimationFrame(raf); }
  }

  document.querySelectorAll("#cover-mode button").forEach(b => {
    b.addEventListener("click", () => setMode(b.dataset.mode));
  });

  // direct links: ?cover=a|b|c|d  (+ legacy x/w aliases)
  const q = new URLSearchParams(location.search).get("cover");
  const alias = { x: "b", w: "c" };
  let initial = alias[q] || q;
  if (!initial) { try { initial = localStorage.getItem("hcsp-cover"); } catch (e) {} }
  if (!["a", "b", "c", "d"].includes(initial)) initial = "a";
  setMode(initial);

  // chips: smooth scroll
  document.querySelectorAll("[data-goto]").forEach(b => {
    b.addEventListener("click", () => {
      const el = document.querySelector(b.dataset.goto);
      if (el) el.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth" });
    });
  });
})();
