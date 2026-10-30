// ═══ §2 exhibit — small animated distillation diagram (plain SVG + CSS keyframes) ═══
// Water boils off → pure water condenses → residues burn. No WebGL, no rAF loop:
// particles are CSS-animated SVG circles; play/pause toggles animation-play-state.
// Reading mode (html.reader, patched matchMedia in shell.js) = static frame: the
// html.reader CSS kills the keyframes and every particle rests at its mid-path base
// position; the play/pause control is hidden.
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

  const svg = el("svg", { viewBox: "0 0 400 292", "aria-hidden": "true" }, host);

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
  // flame under the still (animated flicker)
  el("path", { class: "dst-anim dst-flame", d: "M66 234 C60 243 59 250 66 256 C73 250 72 243 66 234 Z", style: "fill:var(--red);opacity:.85" });
  // residue line: still bottom → burner
  el("path", { d: "M108 214 L322 214", fill: "none", style: "stroke:var(--ink-lo);stroke-width:2;stroke-dasharray:5 4" });
  el("path", { d: "M308 209 L320 214 L308 219 Z", style: "fill:var(--ink-lo)" }); // arrowhead
  // high-heat burner + flame + inert solids out
  el("rect", { x: 322, y: 186, width: 56, height: 48, rx: 4, fill: "none", style: "stroke:var(--ink);stroke-width:2.5" });
  el("path", { class: "dst-anim dst-flame", d: "M350 196 C344 206 343 214 350 221 C357 214 356 206 350 196 Z", style: "fill:var(--red);opacity:.85" });
  el("rect", { x: 336, y: 240, width: 9, height: 9, style: "fill:var(--ink-lo)" });
  el("rect", { x: 352, y: 241, width: 8, height: 8, style: "fill:var(--ink-lo)" });

  // ── animated particles (base cx/cy = mid-path position → static reading-mode frame) ──
  const parts = [
    // steam bubbles rising through the still water
    { cls: "dst-steam", x: 42, y: 206, r: 3, d: "0s", fill: "var(--red)" },
    { cls: "dst-steam", x: 62, y: 196, r: 2.6, d: "-0.9s", fill: "var(--red)" },
    { cls: "dst-steam", x: 86, y: 208, r: 3.2, d: "-1.7s", fill: "var(--red)" },
    // vapor riding the steam pipe into the condenser
    { cls: "dst-vapor", x: 80, y: 64, r: 3.5, d: "0s", fill: "var(--red)" },
    { cls: "dst-vapor", x: 116, y: 64, r: 3.5, d: "-1.1s", fill: "var(--red)" },
    { cls: "dst-vapor", x: 152, y: 64, r: 3.5, d: "-2.2s", fill: "var(--red)" },
    // condensate drops falling into the beaker
    { cls: "dst-drip", x: 230, y: 148, r: 3.5, d: "0s", fill: "var(--blue)" },
    { cls: "dst-drip", x: 230, y: 166, r: 3, d: "-1.1s", fill: "var(--blue)" },
    // heavy residues left behind, carried to the burner
    { cls: "dst-residue", x: 132, y: 214, r: 3, d: "0s", fill: "var(--ink-md)" },
    { cls: "dst-residue", x: 176, y: 214, r: 3, d: "-1.3s", fill: "var(--ink-md)" },
    { cls: "dst-residue", x: 220, y: 214, r: 3, d: "-2.6s", fill: "var(--ink-md)" },
  ];
  parts.forEach(p => {
    el("circle", { class: "dst-anim " + p.cls, cx: p.x, cy: p.y, r: p.r,
      style: "fill:" + p.fill + ";animation-delay:" + p.d });
  });

  // ── plain-English stage captions (staggered onto two rows so nothing overlaps) ──
  txt(74, 266, "1 · Water boils off", "dst-stage");
  txt(396, 266, "3 · Residues burn", "dst-stage", "end");
  txt(224, 284, "2 · Pure water condenses", "dst-stage");
  txt(232, 34, "condenser");
  txt(350, 180, "high heat");

  // ── play / pause control (hidden in reading mode by CSS) ──
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
