// ═══ §2 exhibit — small animated distillation diagram (plain SVG + CSS keyframes) ═══
// Water boils off → pure water condenses → residues burn. No WebGL, no rAF loop:
// particles are CSS-animated SVG circles; play/pause toggles animation-play-state.
// Owner directive: the animation keeps playing in Reading Mode — the CSS restores
// the real keyframe durations against the global html.reader animation kill, and
// the play/pause control stays available so the reader can still stop the motion.
(function () {
  const host = document.getElementById("distill-mini");
  if (!host) return;
  const NS = "http://www.w3.org/2000/svg";

  function el(n, attrs, parent) {
    const e = document.createElementNS(NS, n);
    for (const k in attrs) {
      if (k === "style") e.style.cssText = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (parent || svg).appendChild(e);
    return e;
  }
  function txt(x, y, str, cls, anchor) {
    const t = el("text", { x, y, "text-anchor": anchor || "middle" });
    if (cls) t.setAttribute("class", cls);
    t.textContent = str;
    return t;
  }

  const svg = el("svg", { viewBox: "0 0 400 302", "aria-hidden": "true" }, host);

  // ── static geometry ──
  // steam pipe: still top → up → right into the condenser jacket
  el("path", { d: "M66 150 L66 64 L192 64", fill: "none", style: "stroke:var(--ink-md);stroke-width:2.5" });
  el("path", { d: "M178 59 L190 64 L178 69 Z", style: "fill:var(--ink-md)" }); // arrowhead
  // condenser jacket + cooling coil
  el("rect", { x: 192, y: 40, width: 80, height: 100, rx: 6, fill: "none", style: "stroke:var(--ink-md);stroke-width:2" });
  el("path", { d: "M192 64 L254 64 L208 84 L254 84 L208 104 L254 104 L230 134", fill: "none", style: "stroke:var(--blue-soft);stroke-width:2.5" });
  // condensate line from coil to beaker
  el("path", { d: "M230 134 L230 192", fill: "none", style: "stroke:var(--ink-md);stroke-width:2" });
  // beaker (open top) + condensed pure water
  el("path", { d: "M206 192 L206 234 L254 234 L254 192", fill: "none", style: "stroke:var(--ink-md);stroke-width:2.5" });
  el("rect", { x: 209, y: 212, width: 42, height: 19, style: "fill:rgba(34,81,255,.18)" });
  // still (boiler tank) + water inside
  el("rect", { x: 24, y: 150, width: 84, height: 80, rx: 6, fill: "none", style: "stroke:var(--ink);stroke-width:2.5" });
  el("rect", { x: 27.5, y: 178, width: 77, height: 48.5, style: "fill:rgba(34,81,255,.16)" });
  el("path", { d: "M27.5 178 q10 -5 19.25 0 t19.25 0 t19.25 0 t19.25 0", fill: "none", style: "stroke:var(--red);stroke-width:1.6" });
  // flame under the still (two layered tongues, flickering out of phase)
  el("path", { class: "dst-anim dst-flame", d: "M66 233 C57 245 55 256 66 264 C77 256 75 245 66 233 Z", style: "fill:#e8590c;opacity:.9" });
  el("path", { class: "dst-anim dst-flame", d: "M66 242 C61 250 60 257 66 262 C72 257 71 250 66 242 Z", style: "fill:#ffb03c;opacity:.95;animation-delay:-.38s;--dur:.72s" });
  // residue line: still bottom → burner
  el("path", { d: "M108 214 L322 214", fill: "none", style: "stroke:var(--ink-lo);stroke-width:2;stroke-dasharray:5 4" });
  el("path", { d: "M308 209 L320 214 L308 219 Z", style: "fill:var(--ink-lo)" }); // arrowhead
  // high-heat burner + flame + inert solids out
  el("rect", { x: 322, y: 186, width: 56, height: 48, rx: 4, fill: "none", style: "stroke:var(--ink);stroke-width:2.5" });
  el("path", { class: "dst-anim dst-flame", d: "M350 192 C342 206 341 219 350 227 C359 219 358 206 350 192 Z", style: "fill:#e8590c;opacity:.9" });
  el("path", { class: "dst-anim dst-flame", d: "M350 202 C345 211 344 219 350 224 C356 219 355 211 350 202 Z", style: "fill:#ffb03c;opacity:.95;animation-delay:-.29s;--dur:.64s" });
  el("rect", { x: 336, y: 240, width: 9, height: 9, style: "fill:var(--ink-lo)" });
  el("rect", { x: 352, y: 241, width: 8, height: 8, style: "fill:var(--ink-lo)" });

  // ── animated particles ──
  // Base cx/cy = the START of each particle's path; the CSS keyframes carry it
  // along the full route (boil → rise → condense → drip / residue → burn).
  const parts = [
    // boiling: bubbles rise through the still water and pop at the surface
    { cls: "dst-boil", x: 36, y: 222, r: 3.2, d: "0s",     fill: "var(--blue-soft)" },
    { cls: "dst-boil", x: 46, y: 224, r: 4.2, d: "-0.6s",  fill: "var(--blue-soft)" },
    { cls: "dst-boil", x: 58, y: 221, r: 2.8, d: "-1.2s",  fill: "var(--blue-soft)" },
    { cls: "dst-boil", x: 70, y: 223, r: 4.4, d: "-0.3s",  fill: "var(--blue-soft)" },
    { cls: "dst-boil", x: 80, y: 222, r: 3.4, d: "-1.5s",  fill: "var(--blue-soft)" },
    { cls: "dst-boil", x: 90, y: 224, r: 2.6, d: "-0.9s",  fill: "var(--blue-soft)" },
    { cls: "dst-boil", x: 99, y: 221, r: 3.8, d: "-1.8s",  fill: "var(--blue-soft)" },
    // steam: up the riser from the still top, then right along the pipe into
    // the condenser, drifting slightly and fading as it reaches the coil
    { cls: "dst-flow", x: 66, y: 148, r: 4.6, d: "0s",     fill: "var(--blue-soft)" },
    { cls: "dst-flow", x: 66, y: 148, r: 3.8, d: "-0.5s",  fill: "var(--blue-soft)" },
    { cls: "dst-flow", x: 66, y: 148, r: 5.0, d: "-1.0s",  fill: "var(--blue-soft)" },
    { cls: "dst-flow", x: 66, y: 148, r: 4.0, d: "-1.5s",  fill: "var(--blue-soft)" },
    { cls: "dst-flow", x: 66, y: 148, r: 4.8, d: "-2.0s",  fill: "var(--blue-soft)" },
    { cls: "dst-flow", x: 66, y: 148, r: 3.6, d: "-2.5s",  fill: "var(--blue-soft)" },
    // condensation: droplets form on the cooling coil, grow, and slide down
    { cls: "dst-cond", x: 222, y: 68,  r: 3.0, d: "0s",     fill: "var(--blue)" },
    { cls: "dst-cond", x: 240, y: 88,  r: 3.4, d: "-0.8s",  fill: "var(--blue)" },
    { cls: "dst-cond", x: 220, y: 106, r: 2.8, d: "-1.6s",  fill: "var(--blue)" },
    { cls: "dst-cond", x: 244, y: 108, r: 3.2, d: "-0.4s",  fill: "var(--blue)" },
    // pure water: drops fall from the coil tip down the condensate line
    // into the beaker
    { cls: "dst-drip", x: 230, y: 138, r: 3.6, d: "0s",     fill: "var(--blue)" },
    { cls: "dst-drip", x: 230, y: 138, r: 3.0, d: "-0.55s", fill: "var(--blue)" },
    { cls: "dst-drip", x: 230, y: 138, r: 4.0, d: "-1.1s",  fill: "var(--blue)" },
    // heavy residues left behind, carried along the line to the burner
    { cls: "dst-residue", x: 112, y: 214, r: 4.2, d: "0s",     fill: "var(--ink-md)" },
    { cls: "dst-residue", x: 112, y: 214, r: 3.4, d: "-1.05s", fill: "var(--ink-md)" },
    { cls: "dst-residue", x: 112, y: 214, r: 4.6, d: "-2.1s",  fill: "var(--ink-md)" },
    { cls: "dst-residue", x: 112, y: 214, r: 3.0, d: "-3.15s", fill: "var(--ink-md)" },
    // embers lifting off the residue burner
    { cls: "dst-ember", x: 344, y: 194, r: 2.2, d: "0s",     fill: "#e8590c" },
    { cls: "dst-ember", x: 350, y: 196, r: 2.6, d: "-0.65s", fill: "#ffb03c" },
    { cls: "dst-ember", x: 357, y: 194, r: 1.9, d: "-1.3s",  fill: "#e8590c" },
  ];
  parts.forEach(p => {
    el("circle", { class: "dst-anim " + p.cls, cx: p.x, cy: p.y, r: p.r,
      style: "fill:" + p.fill + ";animation-delay:" + p.d });
  });

  // ── plain-English stage captions (staggered onto two rows so nothing overlaps) ──
  txt(74, 278, "1 · Water boils off", "dst-stage");
  txt(396, 278, "3 · Residues burn", "dst-stage", "end");
  txt(224, 296, "2 · Pure water condenses", "dst-stage");
  txt(232, 34, "condenser");
  txt(350, 180, "high heat");

  // ── play / pause control (kept available in reading mode) ──
  const ui = document.createElement("div");
  ui.className = "dst-ui";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "dst-toggle";
  function setPaused(p) {
    host.classList.toggle("paused", p);
    btn.textContent = p ? "▶ PLAY" : "⏸ PAUSE";
    btn.setAttribute("aria-pressed", p ? "true" : "false");
    btn.setAttribute("aria-label", p ? "Play distillation diagram animation" : "Pause distillation diagram animation");
  }
  btn.addEventListener("click", () => setPaused(!host.classList.contains("paused")));
  ui.appendChild(btn);
  host.appendChild(ui);
  // Owner directive: animation plays regardless of Reading Mode.
  // Pause only happens when the user explicitly presses the pause button.
  setPaused(false);
})();
