// ═══ Left-hand section navigator — slim collapsible index + scrollspy ═══
// Builds a "≡ SECTIONS" tab on the left edge (mid-height) that expands into the
// page's section list. Active section tracked with an IntersectionObserver on
// each band (same reading zone as the main scroll engine). Hidden in reading
// mode (html.reader) and reduced to a hamburger tab on narrow screens (≤900px).
(function () {
  if (document.documentElement.classList.contains("reader")) return; // reading mode: no nav

  const FALLBACK = {
    "sec-exec": "§0 · Executive summary",
    "sec-concepts": "§1 · Three facts that decide everything",
    "sec-mech": "§2 · The machine",
    "sec-flow3d": "§2C · Inside the plant",
    "sec-inside": "§2B · The skid in 3D",
    "sec-state": "§3 · The economics",
    "sec-scale": "§3B · Scale & energy",
    "sec-energy": "§3C · The energy advantage",
    "sec-verdict": "§5 · The verdict",
    "sec-appendix": "§7 · Appendix",
    "sec-sources": "Sources & method",
    "sec-players": "§4 · The field",
    "sec-deepdive": "§4B · The field, up close",
    "sec-customers": "§4C · Customers & footprint",
    "sec-funding": "§8 · Funding landscape",
    "sec-register": "§9 · The grant register",
    "sec-pursuits": "§10 · The Top-15 pursuits",
  };

  // sections in page order: every band plus the sources footer
  const sections = Array.from(document.querySelectorAll("section.band[id]"));
  const sources = document.getElementById("sec-sources");
  if (sources) sections.push(sources);
  if (!sections.length) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function labelFor(sec) {
    const no = sec.querySelector(".sec-no");
    if (no && no.textContent.trim()) return no.textContent.trim();
    const h = sec.querySelector("h2, h3");
    if (h && h.textContent.trim()) return h.textContent.trim();
    return FALLBACK[sec.id] || sec.id.replace(/^sec-/, "").replace(/-/g, " ");
  }

  // ── DOM ──
  const nav = document.createElement("nav");
  nav.id = "leftnav";
  nav.setAttribute("aria-label", "Section index");

  const handle = document.createElement("button");
  handle.id = "ln-handle";
  handle.type = "button";
  handle.setAttribute("aria-expanded", "false");
  handle.setAttribute("aria-controls", "ln-panel");
  handle.title = "Section index";
  handle.innerHTML = '<span class="ln-glyph" aria-hidden="true">≡</span><span class="ln-handle-label">SECTIONS</span>';
  nav.appendChild(handle);

  const panel = document.createElement("div");
  panel.id = "ln-panel";
  const list = document.createElement("ol");
  list.className = "ln-list";
  const links = new Map();
  sections.forEach(sec => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + sec.id;
    a.textContent = labelFor(sec);
    a.addEventListener("click", ev => {
      ev.preventDefault();
      sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      setActive(sec.id);
      pinned = false;
      setOpen(false); // collapses when not in use
    });
    li.appendChild(a);
    list.appendChild(li);
    links.set(sec.id, a);
  });
  panel.appendChild(list);

  const top = document.createElement("button");
  top.className = "ln-top";
  top.type = "button";
  top.textContent = "↑ Back to top";
  top.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    pinned = false;
    setOpen(false);
  });
  panel.appendChild(top);
  nav.appendChild(panel);
  document.body.appendChild(nav);

  // ── expand / collapse (explicit toggle; hover expands on pointer devices) ──
  let pinned = false;
  function setOpen(open) {
    nav.classList.toggle("open", open);
    handle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  handle.addEventListener("click", () => { pinned = !pinned; setOpen(pinned); });
  nav.addEventListener("mouseenter", () => setOpen(true));
  nav.addEventListener("mouseleave", () => { if (!pinned) setOpen(false); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && nav.classList.contains("open")) { pinned = false; setOpen(false); }
  });

  // ── visibility gate: appear once the cover / page hero scrolls out ──
  // (same rule the dashboard rail uses, so the nav never floats over the cover)
  const gate = document.getElementById("cover") || document.querySelector(".page-hero");
  function onScroll() {
    const past = !gate || scrollY > gate.offsetHeight * 0.55;
    nav.classList.toggle("on", past);
  }
  let tick = false;
  addEventListener("scroll", () => {
    if (!tick) { tick = true; requestAnimationFrame(() => { onScroll(); tick = false; }); }
  }, { passive: true });
  onScroll();

  // ── scrollspy: highlight the section in the reading zone ──
  let current = null;
  function setActive(id) {
    if (current === id) return;
    current = id;
    links.forEach((a, k) => a.classList.toggle("active", k === id));
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { threshold: 0, rootMargin: "-18% 0px -60% 0px" });
  sections.forEach(s => io.observe(s));
})();
