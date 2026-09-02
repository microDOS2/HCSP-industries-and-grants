// ═══ Scroll engine: section observation, rail visibility, entrance classes ═══
(function () {
  const cover = document.getElementById("cover");
  const bands = document.querySelectorAll(".band");
  const sources = document.getElementById("sec-sources");

  // section observation → live state + rail sync (single in-flight latch via IO)
  // reading-zone observation: fires when a band crosses the upper-middle of the viewport —
  // robust for bands far taller than the viewport (a fixed 0.22 threshold never fires there)
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("live");
      const win = e.target.dataset.win;
      if (win && window.DASH) DASH.setSection(win);
    });
  }, { threshold: 0, rootMargin: "-18% 0px -60% 0px" });
  bands.forEach(b => io.observe(b));
  if (sources) io.observe(sources);

  // rail visibility: only after the cover scrolls out
  function onScroll() {
    if (!window.DASH || !cover) return;
    const past = scrollY > cover.offsetHeight * 0.55;
    DASH.show(past);
  }
  let tick = false;
  addEventListener("scroll", () => {
    if (!tick) { tick = true; requestAnimationFrame(() => { onScroll(); tick = false; }); }
  }, { passive: true });
  onScroll();
})();
