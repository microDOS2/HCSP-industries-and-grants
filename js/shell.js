// ═══ Shared shell — sticky nav, reading mode, back-to-top ═══
// MUST load before any chart/cover module: it patches matchMedia so that
// reader mode (or prefers-reduced-motion) is seen as REDUCE by every module.
(function () {
  const LS_KEY = "hcsp-reader";
  const SCROLL_KEY = "hcsp-reader-scroll";

  // ── 1 · Reading mode state ──
  let stored = null;
  try { stored = localStorage.getItem(LS_KEY); } catch (e) {}
  const sysReduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // default: honor prefers-reduced-motion
  const readerOn = stored == null ? sysReduce : stored === "1";

  if (readerOn) {
    document.documentElement.classList.add("reader");
    // Every module captures matchMedia("(prefers-reduced-motion: reduce)").matches
    // at load time → make that query answer true for this page load.
    const orig = window.matchMedia.bind(window);
    window.matchMedia = q => {
      if (typeof q === "string" && /prefers-reduced-motion/.test(q) && /reduce/.test(q)) {
        const m = orig(q);
        return {
          matches: true, media: q, onchange: null,
          addListener: () => {}, removeListener: () => {},
          addEventListener: () => {}, removeEventListener: () => {},
          dispatchEvent: () => false,
        };
      }
      return orig(q);
    };
  }

  // Restore scroll position after a reader-mode toggle reload
  try {
    const y = sessionStorage.getItem(SCROLL_KEY);
    if (y != null) {
      sessionStorage.removeItem(SCROLL_KEY);
      addEventListener("load", () => setTimeout(() => scrollTo(0, +y), 30));
    }
  } catch (e) {}

  // ── 2 · Nav + controls (scripts load at end of body — DOM is ready) ──
  const nav = document.getElementById("topnav");
  if (nav) {
    // active-page indicator
    const here = (location.pathname.split("/").pop() || "index.html");
    nav.querySelectorAll(".tn-links a").forEach(a => {
      const target = a.getAttribute("href").split("#")[0];
      if (target === here) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    // burger
    const burger = document.getElementById("tn-burger");
    if (burger) burger.addEventListener("click", () => {
      const open = nav.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".tn-links a").forEach(a =>
      a.addEventListener("click", () => nav.classList.remove("nav-open")));
  }

  // reading-mode toggle: persist, then reload so every canvas/SVG module
  // re-initializes under REDUCE (static frames, frozen animation)
  const rt = document.getElementById("reader-toggle");
  if (rt) {
    rt.setAttribute("aria-pressed", readerOn ? "true" : "false");
    rt.querySelector(".rt-state").textContent = readerOn ? "ON" : "OFF";
    rt.addEventListener("click", () => {
      try {
        localStorage.setItem(LS_KEY, readerOn ? "0" : "1");
        sessionStorage.setItem(SCROLL_KEY, String(scrollY));
      } catch (e) {}
      location.reload();
    });
  }

  // ── 2b · In-page jump chips (cover chips, hero chips) ──
  document.querySelectorAll("[data-goto]").forEach(b => {
    b.addEventListener("click", () => {
      const el = document.querySelector(b.dataset.goto);
      if (el) el.scrollIntoView({ behavior: readerOn ? "auto" : "smooth" });
    });
  });

  // ── 3 · Back to top ──
  const toTop = document.getElementById("to-top");
  if (toTop) {
    let tick = false;
    const onScroll = () => toTop.classList.toggle("on", scrollY > 600);
    addEventListener("scroll", () => {
      if (!tick) { tick = true; requestAnimationFrame(() => { onScroll(); tick = false; }); }
    }, { passive: true });
    onScroll();
    toTop.addEventListener("click", () =>
      scrollTo({ top: 0, behavior: readerOn ? "auto" : "smooth" }));
  }
})();
