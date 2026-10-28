// ═══ Lazy 3D loader + single-active-scene controller ═══
// The three heavy Three.js scenes (flow3d / skid3d / scenarios3d) are NOT
// loaded at page load: their scripts (and the three.js vendor bundle) are
// injected only when the section approaches the viewport (rootMargin 300px).
// Once several scenes are initialized, only ONE renders at a time:
// window.HCSP3D_ACTIVE names the owner; each module's frame loop returns
// early when it is not the owner, and resumes on the "hcsp3d:active" event.
// Each module announces a successful init with a "hcsp3d:ready" event.
(function () {
  const SCENES = [
    { name: "flow3d",      host: document.getElementById("flow3d"),      src: "js/flow3d.js" },
    { name: "skid3d",      host: document.getElementById("skid3d"),      src: "js/skid3d.js" },
    { name: "scenarios3d", host: document.getElementById("scenarios3d"), src: "js/scenarios3d.js" },
  ].filter(s => s.host);
  if (!SCENES.length || !("IntersectionObserver" in window)) return;

  // ── sequential script injection with per-URL caching ──
  const loaded = {};
  function loadScript(src) {
    if (loaded[src]) return loaded[src];
    loaded[src] = new Promise((res, rej) => {
      // Offline single-file bundles: use inlined script text when available.
      if (window.HCSP_INLINE_SCRIPTS && window.HCSP_INLINE_SCRIPTS[src]) {
        try {
          const el = document.createElement("script");
          el.textContent = window.HCSP_INLINE_SCRIPTS[src];
          document.head.appendChild(el);
          res();
        } catch (e) { rej(e); }
        return;
      }
      const el = document.createElement("script");
      el.src = src;
      el.onload = () => res();
      el.onerror = () => rej(new Error("lazy3d: failed to load " + src));
      document.body.appendChild(el);
    });
    return loaded[src];
  }
  let vendorP = null;
  function loadVendor() {
    if (!vendorP) {
      vendorP = loadScript("vendor/three.min.js")
        .then(() => loadScript("vendor/OrbitControls.js"));
    }
    return vendorP;
  }

  // ── single-active-scene controller ──
  const ready = new Set();   // scenes whose module reported a successful init
  const ratios = {};         // name → latest intersectionRatio of its host
  function elect() {
    const cur = window.HCSP3D_ACTIVE || null;
    let best = null, bestR = 0;
    SCENES.forEach(s => {
      const r = ratios[s.name] || 0;
      if (ready.has(s.name) && r > bestR) { best = s.name; bestR = r; }
    });
    // hysteresis: keep the current owner while it is still visible, unless a
    // rival is clearly more visible — prevents flip-flopping at boundaries
    let next = best;
    if (cur && ready.has(cur) && (ratios[cur] || 0) > 0 && bestR < (ratios[cur] || 0) + 0.15) {
      next = cur;
    }
    if (next !== cur) {
      window.HCSP3D_ACTIVE = next;
      dispatchEvent(new CustomEvent("hcsp3d:active", { detail: next }));
    }
  }
  const visIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const s = SCENES.find(x => x.host === e.target);
      if (s) ratios[s.name] = e.intersectionRatio;
    });
    elect();
  }, { threshold: [0, 0.05, 0.25, 0.5, 0.75, 1] });

  addEventListener("hcsp3d:ready", e => {
    if (!e || !e.detail) return;
    ready.add(e.detail);
    const s = SCENES.find(x => x.name === e.detail);
    if (s) visIO.observe(s.host);
  });

  // ── lazy init: inject the scene script when its section nears the viewport ──
  const initIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const s = SCENES.find(x => x.host === e.target);
      if (!s || s.started) return;
      s.started = true;
      initIO.unobserve(s.host);
      loadVendor()
        .then(() => loadScript(s.src))
        .catch(err => console.warn(err));
    });
  }, { threshold: 0, rootMargin: "300px 0px 300px 0px" });
  SCENES.forEach(s => initIO.observe(s.host));
})();
