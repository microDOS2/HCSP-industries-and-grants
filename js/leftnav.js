// ═══ Left-hand section navigator — ☰ hamburger menu + scrollspy ═══
// A hamburger button fixed at the top-left (just under the top nav) opens a
// slide-in panel from the left with two tabs — "Sections" (the page's section
// list) and "Charts" (a searchable index of every chart on the site) — plus a
// close ✕ and a back-to-top button. The panel auto-closes on selection.
// Active section is tracked with an IntersectionObserver on each band (same
// reading zone as the main scroll engine). Visible from page load (navigation,
// not decoration) and kept available in reading mode — only the panel's slide
// animation is stilled there by the global html.reader transition rule. The
// same hamburger serves narrow screens (≤900px).
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

  /* ── chart index: every chart on the site, with the page it lives on, the
     element to scroll to, and (for multi-view explorers) the view to select ── */
  const CHARTS = [
    { name: "Ranking",          page: "index.html",       id: "host-c3-ranking",   sec: "§0 · Executive summary" },
    { name: "Savings Ladder",   page: "index.html",       id: "host-c3-savings",   sec: "§3 · The economics" },
    { name: "Energy Crossover", page: "index.html",       id: "host-c3-crossover", sec: "§3B · Scale & energy" },
    { name: "Heat Flow",        page: "index.html",       id: "host-c3-heat",      sec: "§3B · Scale & energy" },
    { name: "Scale Ladder",     page: "index.html",       id: "host-scale-3d",     sec: "§3B · Scale & energy" },
    { name: "Market Size",      page: "index.html",       id: "sizing-chart",      sec: "§3 · The economics" },
    { name: "Verdict",          page: "index.html",       id: "verdict-chart",     sec: "§5 · The verdict" },
    { name: "Deadline Calendar", page: "funding.html",    id: "deadline-timeline", sec: "§10 · The Top-15 pursuits" },
    { name: "Destiny",          page: "competitors.html", id: "comp3d", view: "timeline", sec: "§4 · The field" },
    { name: "Scale Gap",        page: "competitors.html", id: "comp3d", view: "scale",    sec: "§4 · The field" },
    { name: "Vendor Panels",    page: "competitors.html", id: "comp3d", view: "panels",   sec: "§4 · The field" },
    { name: "Customer Map",     page: "competitors.html", id: "comp3d", view: "map",      sec: "§4C · Customers & footprint" },
    { name: "Grant Register",   page: "funding.html",     id: "grant-table-block", sec: "§9 · The grant register" },
    { name: "Sources",          page: "index.html",       id: "sec-sources",       sec: "Sources & method" },
  ];
  const PAGE_FILE = (location.pathname.split("/").pop() || "index.html");
  const DIST = PAGE_FILE.indexOf("dist-") === 0;

  // select a chart's view where the target chart has one (the §4 explorer tabs)
  function applyChartView(c) {
    if (!c.view) return;
    const btn = document.querySelector("#" + c.id + ' [data-v="' + c.view + '"]');
    if (btn) btn.click();
  }

  function gotoChart(c) {
    const el = document.getElementById(c.id);
    if (el) {
      // same page: set the view (if any), scroll straight to the chart
      applyChartView(c);
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      setOpen(false); // auto-close on selection
    } else {
      // different page: hand the jump over via sessionStorage, then navigate
      try { sessionStorage.setItem("hcsp-goto-chart", JSON.stringify({ id: c.id, view: c.view || null })); } catch (e) {}
      location.href = (DIST ? "dist-" : "") + c.page + "#" + c.id;
    }
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

  // head: Sections | Charts tab bar + close ✕
  const head = document.createElement("div");
  head.className = "ln-head";
  const tabs = document.createElement("div");
  tabs.className = "ln-tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Navigator views");
  tabs.innerHTML = '<button type="button" role="tab" class="ln-tab on" data-tab="sections" aria-selected="true">Sections</button>' +
    '<button type="button" role="tab" class="ln-tab" data-tab="charts" aria-selected="false">Charts</button>';
  head.appendChild(tabs);
  const closeBtn = document.createElement("button");
  closeBtn.className = "ln-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close section menu");
  closeBtn.textContent = "✕";
  head.appendChild(closeBtn);
  panel.appendChild(head);

  // ── pane 1: Sections (the current section list, unchanged) ──
  const paneSections = document.createElement("div");
  paneSections.className = "ln-pane ln-pane-sections";
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
  paneSections.appendChild(list);
  panel.appendChild(paneSections);

  // ── pane 2: Charts (search box + filterable chart index) ──
  const paneCharts = document.createElement("div");
  paneCharts.className = "ln-pane ln-pane-charts";
  paneCharts.hidden = true;
  const search = document.createElement("input");
  search.type = "search";
  search.className = "ln-search";
  search.placeholder = "Search charts…";
  search.setAttribute("aria-label", "Search charts by name");
  paneCharts.appendChild(search);
  const clist = document.createElement("ol");
  clist.className = "ln-list ln-clist";
  CHARTS.forEach(c => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = (DIST ? "dist-" : "") + c.page + "#" + c.id;
    a.innerHTML = '<span class="ln-cname"></span><span class="ln-csec"></span>';
    a.querySelector(".ln-cname").textContent = c.name;
    a.querySelector(".ln-csec").textContent = c.sec;
    a.addEventListener("click", ev => {
      ev.preventDefault();
      gotoChart(c);
    });
    li.appendChild(a);
    clist.appendChild(li);
  });
  paneCharts.appendChild(clist);
  const noHit = document.createElement("p");
  noHit.className = "ln-nohit";
  noHit.textContent = "No chart matches.";
  noHit.hidden = true;
  paneCharts.appendChild(noHit);
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    clist.querySelectorAll("li").forEach((li, i) => {
      const c = CHARTS[i];
      const on = !q || c.name.toLowerCase().includes(q) || c.sec.toLowerCase().includes(q);
      li.style.display = on ? "" : "none";
      if (on) shown++;
    });
    noHit.hidden = shown > 0;
  });
  panel.appendChild(paneCharts);

  // tab switching
  tabs.querySelectorAll(".ln-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.tab;
      tabs.querySelectorAll(".ln-tab").forEach(b => {
        b.classList.toggle("on", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      paneSections.hidden = t !== "sections";
      paneCharts.hidden = t !== "charts";
      if (t === "charts") search.focus();
    });
  });

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

  // ── a chart jump handed over from another page: set its view, scroll to it ──
  let pending = null;
  try {
    pending = JSON.parse(sessionStorage.getItem("hcsp-goto-chart") || "null");
    sessionStorage.removeItem("hcsp-goto-chart");
  } catch (e) {}
  if (pending && pending.id) {
    setTimeout(() => {
      const el = document.getElementById(pending.id);
      if (!el) return;
      applyChartView(pending);
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }, 400);
  }

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
