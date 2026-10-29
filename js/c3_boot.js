// ═══ c3 scene boot — lazy init + single-active-scene manager for the
// chart_preview 3D modules (c3_ranking / c3_savings / c3_crossover / c3_heat /
// scale_explorer / c3_payback / c3_scenarios) ═══
// Same pattern as the approved preview page:
//   · each scene initializes only when its host approaches the viewport
//     (IntersectionObserver, rootMargin 450px; hosts carry min-height so the
//     page cannot hang or reflow while waiting);
//   · only ONE c3 scene animates at a time — activating a scene presses the
//     previous scene's own Pause button ("active" tag);
//   · scenes that drift far offscreen are heavy-paused ("far" tag) and
//     auto-resumed only if this manager paused them;
//   · scale_explorer's on-demand 3D view claims the active slot via the
//     "hcsp:scene-active" custom event.
// Lite/Reading mode is owned by js/shell.js (persist + reload → html.reader);
// every c3 module reads html.reader each frame, so nothing more is needed here.
// Bridge to js/lazy3d.js (flow3d / skid3d): when a c3 scene activates we
// dispatch "hcsp3d:active" with a name outside the old set so the old scenes
// yield; when an old scene takes over we heavy-pause the active c3 scene.
(function () {
  "use strict";

  var sceneEls = [], activeEl = null;
  function pauseBtnOf(el) {
    return el ? el.querySelector('[data-act="pause"], .c3s-pause, .c3p-pause, .c3x-pause') : null;
  }
  // heavy-pause: stop animation state (not just skip rendering). The tag records
  // WHO paused it ("far" scroll-away or "active" takeover) so we only auto-resume our own.
  function heavyPause(el, tag) {
    var b = pauseBtnOf(el);
    if (b && b.getAttribute("aria-pressed") !== "true") {
      b.click();
      el._hcspAutoPaused = tag;
    }
  }
  function heavyResume(el, tag) {
    var b = pauseBtnOf(el);
    if (b && el._hcspAutoPaused === tag && b.getAttribute("aria-pressed") === "true") b.click();
    if (el && el._hcspAutoPaused === tag) el._hcspAutoPaused = null;
  }

  function claimActive(el) {
    if (activeEl && activeEl !== el) heavyPause(activeEl, "active");
    activeEl = el;
    // ask the legacy lazy3d scenes (flow3d / skid3d) to yield the GPU — they
    // gate their frame loop on window.HCSP3D_ACTIVE
    window.HCSP3D_ACTIVE = "c3";
    window.dispatchEvent(new CustomEvent("hcsp3d:active", { detail: "c3" }));
  }
  // a legacy 3D scene (flow3d / skid3d) taking the single-active slot pauses
  // whichever c3 scene is currently running
  window.addEventListener("hcsp3d:active", function (ev) {
    if (ev.detail === "flow3d" || ev.detail === "skid3d" || ev.detail === "scenarios3d") {
      if (activeEl) heavyPause(activeEl, "active");
    }
  });
  // a scene coming alive outside lazy3D (the scale module's on-demand 3D view)
  // claims the single active slot
  document.addEventListener("hcsp:scene-active", function (ev) {
    var el = ev.detail && ev.detail.el;
    if (el) claimActive(el);
  });

  function lazy3D(id, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    sceneEls.push(el);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        claimActive(el);
        el._hcspInited = true;
        try { fn(el); } catch (err) { console.warn("3D init failed for", id, err); }
      });
    }, { rootMargin: "450px" });
    io.observe(el);
    // heavy-pause scenes that drift FAR offscreen (beyond each module's own
    // near-viewport render pause); resume only if we were the ones pausing.
    var farIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!el._hcspInited) return;
        if (!e.isIntersecting) heavyPause(el, "far");
        else heavyResume(el, "far");
      });
    }, { rootMargin: "1200px" });
    farIO.observe(el);
  }

  lazy3D("host-c3-ranking", function (el) { Chart3DRanking.render(el); });
  lazy3D("host-c3-savings", function (el) { Chart3DSavings.render(el); });
  lazy3D("host-c3-crossover", function (el) { Chart3DCrossover.render(el); });
  lazy3D("host-c3-heat", function (el) { Chart3DHeat.render(el); });
  lazy3D("host-scale-3d", function (el) { ScaleExplorer.render(el); });
  lazy3D("host-c3-payback", function (el) { C3Payback.render(el); });
  lazy3D("host-scenarios-3d", function (el) { C3Scenarios.render(el); });
})();
