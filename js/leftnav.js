// ═══ Left-hand section navigator — ☰ hamburger menu + scrollspy ═══
// A hamburger button fixed at the top-left (just under the top nav) opens a
// slide-in panel from the left with the page's section list, a close ✕, and a
// back-to-top button. The panel auto-closes on selection. Active section is
// tracked with an IntersectionObserver on each band (same reading zone as the
// main scroll engine). Visible from page load (navigation, not decoration) and
// kept available in reading mode — only the panel's slide animation is stilled
// there by the global html.reader transition rule. The same hamburger serves
// narrow screens (≤900px).
(function () {
  const FALLBACK = {
    "sec-exec": "§0 · Executive summary",
    "sec-concepts": "§1 · Three facts that decide everything",
    "sec-mech": "§2 · The machine",
    "sec-flow3d": "§2C · Inside the plant",
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
  handle.setAttribute("aria-label", "Open section menu");
  handle.title = "Sections";
  handle.innerHTML = '<span class="ln-glyph" aria-hidden="true">☰</span>';
  nav.appendChild(handle);

  const panel = document.createElement("div");
  panel.id = "ln-panel";

  const head = document.createElement("div");
  head.className = "ln-head";
  head.innerHTML = '<span class="ln-title">SECTIONS</span>';
  const closeBtn = document.createElement("button");
  closeBtn.className = "ln-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close section menu");
  closeBtn.textContent = "✕";
  head.appendChild(closeBtn);
  panel.appendChild(head);

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
      setOpen(false); // auto-close on selection
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
    setOpen(false);
  });
  panel.appendChild(top);
  nav.appendChild(panel);
  document.body.appendChild(nav);

  // ── open / close (hamburger toggle, ✕, Escape, or click outside) ──
  function setOpen(open) {
    nav.classList.toggle("open", open);
    handle.setAttribute("aria-expanded", open ? "true" : "false");
    handle.setAttribute("aria-label", open ? "Close section menu" : "Open section menu");
  }
  handle.addEventListener("click", e => { e.stopPropagation(); setOpen(!nav.classList.contains("open")); });
  closeBtn.addEventListener("click", () => setOpen(false));
  document.addEventListener("click", e => {
    if (nav.classList.contains("open") && !nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && nav.classList.contains("open")) setOpen(false);
  });

  // ── visible from page load on every page (navigation, not decoration) ──
  nav.classList.add("on");

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
