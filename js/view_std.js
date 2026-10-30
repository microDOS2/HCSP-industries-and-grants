// ═══ Tiered viewing standard — shared 2D view builders ═══
// The owner's house rule: every chart has a table + download; dollar bars for
// comparisons; bubbles for 2-variable charts; 3D for physical objects; cards
// for profiles. This module provides the reusable pieces so each chart module
// can add its missing views without rewriting the working ones:
//   ViewStd.makeToggle({label, views, current, onPick})  — .unit-toggle switch
//   ViewStd.dollarBars(host, cfg)  — ranked dollar range bars (D3, SVG)
//   ViewStd.bubbles(host, cfg)     — 2-variable bubble chart (D3, SVG)
//   ViewStd.storyCards(host, cards)— one clean card per item (big figure,
//                                    one plain-English reason, small print)
// All views keep the site's conventions: hover tooltip, click → U.showDrill,
// AA-safe ink/blue palette, mono labels, no animation in reading mode.
// Requires vendor/d3.min.js + js/utils.js (U) — both load on every page.
(function () {
  "use strict";

  var INK = "#051c2c", INKMD = "#42566a", INKLO = "#6b7f92", BLUE = "#2251ff",
      BLUELO = "#b9c9ff", GREEN = "#0f7a4c", RED = "#c22f4e", GRID = "#eef1f6";
  var MONO = (window.CH && CH.MONO) || "ui-monospace, 'Roboto Mono', Menlo, Consolas, monospace";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function ensureCss() {
    if (document.getElementById("vs-style")) return;
    var st = document.createElement("style");
    st.id = "vs-style";
    st.textContent =
      ".vs-panel{width:100%;padding:4px 0 2px;box-sizing:border-box}" +
      ".vs-panel svg{width:100%;height:auto;display:block}" +
      /* a 2D tiered-standard view may be opened before a lazily-initialized
         3D scene creates its canvas — the class keeps the canvas hidden either way;
         it also frees the fixed-height 3D stage so tall 2D views are not clipped */
      ".c3-2d-on > canvas{display:none!important}" +
      ".c3-2d-on{height:auto!important;min-height:0!important}" +
      /* the payback module re-projects its 3D labels every frame — only a
         class rule can keep them hidden while the 2D view is up */
      ".c3-2d-on .c3p-label{display:none!important}" +
      ".c3-2d{padding-top:56px}" +  /* clear the floating .c3-ui button bar */
      ".vs-note{font-family:" + MONO + ";font-size:10.5px;color:" + INKLO + ";margin:8px 2px 0;line-height:1.5}";
    document.head.appendChild(st);
  }

  /* wrap a D3 <text> selection into ≤maxLines lines of ~maxChars characters */
  function wrapText(tSel, text, maxChars, maxLines, lineH) {
    var words = String(text).split(/\s+/), line = "", lines = [];
    words.forEach(function (w) {
      var t = line ? line + " " + w : w;
      if (t.length > maxChars && line) { lines.push(line); line = w; }
      else line = t;
    });
    if (line) lines.push(line);
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s+\S*$/, "") + " …";
    }
    tSel.text("");
    lines.forEach(function (ln, i) {
      tSel.append("tspan").attr("x", tSel.attr("x")).attr("dy", i ? lineH : 0).text(ln);
    });
    return lines.length;
  }

  /* ── view toggle, same visual language as the sizing chart's .unit-toggle ── */
  function makeToggle(cfg) {
    var tg = document.createElement("div");
    tg.className = "unit-toggle";
    tg.setAttribute("aria-label", cfg.label || "View");
    tg.innerHTML = '<span class="ut-lab">' + esc(cfg.label || "VIEW") + "</span>" +
      cfg.views.map(function (v) { return '<button type="button" data-view="' + esc(v[0]) + '">' + esc(v[1]) + "</button>"; }).join("");
    function paint(cur) {
      tg.querySelectorAll("button[data-view]").forEach(function (b) {
        b.classList.toggle("on", b.dataset.view === cur);
        b.setAttribute("aria-pressed", String(b.dataset.view === cur));
      });
    }
    tg.querySelectorAll("button[data-view]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        if (cfg.onPick) cfg.onPick(b.dataset.view);
        paint(b.dataset.view);
      });
    });
    paint(cfg.current);
    return tg;
  }

  /* ══ dollar bars — one ranked row per item: the dollar range as a solid
        block from low to high, the range restated as a big label, one plain
        line under each name. `na` rows get a hollow outline marker. ══ */
  function dollarBars(host, cfg) {
    ensureCss();
    var rows = cfg.rows.slice();
    var W = cfg.width || 940, ROW = cfg.rowH || 66, padT = 14, padB = 52;
    var mL = cfg.labelW || 292, mR = 150;
    var H = padT + rows.length * ROW + padB;
    var panel = document.createElement("div");
    panel.className = "vs-panel";
    host.appendChild(panel);
    var svg = d3.select(panel).append("svg")
      .attr("viewBox", "0 0 " + W + " " + H)
      .attr("role", "img")
      .attr("aria-label", cfg.ariaLabel || "Ranked dollar bar chart");
    var x = (cfg.log ? d3.scaleLog() : d3.scaleLinear())
      .domain(cfg.domain).range([mL, W - mR]).clamp(true);

    // gridlines + axis ticks
    (cfg.ticks || []).forEach(function (v) {
      svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 4).attr("y2", H - padB)
        .attr("stroke", GRID);
      svg.append("text").attr("x", x(v)).attr("y", H - padB + 18).attr("text-anchor", "middle")
        .attr("font-family", MONO).attr("font-size", 10).attr("fill", INKMD)
        .text(cfg.tickFmt ? cfg.tickFmt(v) : String(v));
    });
    svg.append("text").attr("x", W - mR).attr("y", H - padB + 38).attr("text-anchor", "end")
      .attr("font-family", MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", INKMD)
      .text(cfg.axisLabel || "");

    rows.forEach(function (d, i) {
      var y0 = padT + i * ROW, barH = 24, barY = y0 + ROW - barH - 6;
      var g = svg.append("g").style("cursor", "pointer").attr("data-drill-keep", "").attr("tabindex", 0);
      // rank + name (≤2 lines) + one plain line
      var tn = svg.append("text").attr("x", 8).attr("y", y0 + 14)
        .attr("font-family", MONO).attr("font-size", 11.5).attr("font-weight", 700).attr("fill", INK);
      var used = wrapText(tn, (i + 1) + " · " + d.name, 40, 2, 14);
      if (d.sub) {
        var tp = svg.append("text").attr("x", 8).attr("y", y0 + 14 + used * 14 + 2)
          .attr("font-family", MONO).attr("font-size", 9.5).attr("fill", INKMD);
        wrapText(tp, d.sub, 52, 2, 12);
      }
      if (d.na || d.lo == null || d.hi == null) {
        // no per-unit price: hollow outline marker, never a fake bar
        g.append("rect").attr("x", mL).attr("y", barY).attr("width", 64).attr("height", barH)
          .attr("fill", "rgba(66,86,106,.05)").attr("stroke", INKLO)
          .attr("stroke-width", 1.2).attr("stroke-dasharray", "4 3");
        g.append("text").attr("x", mL + 74).attr("y", barY + barH / 2 + 4)
          .attr("font-family", MONO).attr("font-size", 10).attr("fill", INKLO)
          .text(d.lab || "N/A");
      } else {
        var x0 = x(d.lo), x1 = x(d.hi);
        // faint floor up to the low end, bright range block low → high
        g.append("rect").attr("x", mL).attr("y", barY + barH / 2 - 1).attr("width", Math.max(0, x0 - mL)).attr("height", 2)
          .attr("fill", BLUELO);
        g.append("rect").attr("x", x0).attr("y", barY).attr("width", Math.max(4, x1 - x0)).attr("height", barH)
          .attr("fill", BLUE).attr("opacity", 0.88);
        g.append("rect").attr("x", x0).attr("y", barY).attr("width", Math.max(4, x1 - x0)).attr("height", barH)
          .attr("fill", "none").attr("stroke", BLUE).attr("stroke-width", 1.2);
        var tv = g.append("text").attr("x", Math.min(x1 + 10, W - mR + 4)).attr("y", barY + barH / 2 + 6)
          .attr("text-anchor", "start").attr("font-family", MONO).attr("font-size", 15)
          .attr("font-weight", 700).attr("fill", BLUE).text(d.lab || "");
        if (d.lowConf) {
          g.append("text").attr("x", Math.min(x1 + 10, W - mR + 4)).attr("y", barY + barH / 2 + 20)
            .attr("font-family", MONO).attr("font-size", 8).attr("fill", "#8f6300").text("LOW CONFIDENCE");
        }
        // keep the big label inside the frame
        try {
          var bb = tv.node().getBBox();
          if (bb.x + bb.width > W - 4) tv.attr("x", Math.max(mL + 4, x0 - 10)).attr("text-anchor", "end");
        } catch (e) {}
      }
      if (d.tip && window.U) {
        g.on("mousemove", function (e) { U.showTip(d.tip, e.clientX, e.clientY); });
        g.on("mouseleave", function () { U.hideTip(); });
      }
      if (d.onClick) g.on("click", function (e) { e.stopPropagation(); if (window.U) U.hideTip(); d.onClick(e, d); });
    });
    if (cfg.note) {
      var p = document.createElement("p");
      p.className = "vs-note"; p.textContent = cfg.note;
      panel.appendChild(p);
    }
    return panel;
  }

  /* ══ bubbles — a 2-variable chart: x and y carry the two variables, bubble
        size a third (optional), dashed ring = the documented range (optional),
        whisker = the y band (optional). Labels never overlap: a small
        iterative resolver pushes colliding chips apart and clamps them inside
        the frame. ══ */
  function bubbles(host, cfg) {
    ensureCss();
    var W = cfg.width || 940, H = cfg.height || 540;
    var mL = 84, mR = 40, padT = 46, padB = 64;
    var panel = document.createElement("div");
    panel.className = "vs-panel";
    host.appendChild(panel);
    var svg = d3.select(panel).append("svg")
      .attr("viewBox", "0 0 " + W + " " + H)
      .attr("role", "img")
      .attr("aria-label", cfg.ariaLabel || "Bubble chart");
    var x = (cfg.xLog ? d3.scaleLog() : d3.scaleLinear()).domain(cfg.xDomain).range([mL, W - mR]).clamp(true);
    var y = d3.scaleLinear().domain(cfg.yDomain).range([H - padB, padT]).clamp(true);
    var r = d3.scaleSqrt().domain(cfg.rDomain || [0, 1]).range(cfg.rRange || [12, 34]);

    (cfg.xTicks || []).forEach(function (v) {
      svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", padT - 8).attr("y2", H - padB).attr("stroke", GRID);
      svg.append("text").attr("x", x(v)).attr("y", H - padB + 18).attr("text-anchor", "middle")
        .attr("font-family", MONO).attr("font-size", 10).attr("fill", INKMD)
        .text(cfg.xFmt ? cfg.xFmt(v) : String(v));
    });
    (cfg.yTicks || []).forEach(function (v) {
      svg.append("line").attr("x1", mL).attr("x2", W - mR).attr("y1", y(v)).attr("y2", y(v)).attr("stroke", GRID);
      svg.append("text").attr("x", mL - 10).attr("y", y(v) + 4).attr("text-anchor", "end")
        .attr("font-family", MONO).attr("font-size", 10).attr("fill", INKMD)
        .text(cfg.yFmt ? cfg.yFmt(v) : String(v));
    });
    svg.append("text").attr("x", W - mR).attr("y", H - padB + 40).attr("text-anchor", "end")
      .attr("font-family", MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", INKMD)
      .text(cfg.xLabel || "");
    svg.append("text").attr("x", mL).attr("y", padT - 28).attr("text-anchor", "start")
      .attr("font-family", MONO).attr("font-size", 9.5).attr("font-weight", 700).attr("fill", INKMD)
      .text(cfg.yLabel || "");

    // emphasized zero line when the y axis straddles it
    if (cfg.zeroY && cfg.yDomain[0] < 0 && cfg.yDomain[1] > 0) {
      svg.append("line").attr("x1", mL).attr("x2", W - mR).attr("y1", y(0)).attr("y2", y(0))
        .attr("stroke", INK).attr("stroke-width", 1.6);
      svg.append("text").attr("x", mL + 6).attr("y", y(0) - 6).attr("text-anchor", "start")
        .attr("font-family", MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", INK)
        .text(cfg.zeroLabel || "NET ZERO — THE SYSTEM POWERS ITSELF");
    }
    // vertical reference lines (e.g. the net-zero wall) — labels staggered so
    // adjacent lines never print on top of each other
    (cfg.vLines || []).forEach(function (vl, vi) {
      svg.append("line").attr("x1", x(vl.x)).attr("x2", x(vl.x)).attr("y1", padT - 8).attr("y2", H - padB)
        .attr("stroke", vl.color || "#8f6300").attr("stroke-width", 1.4).attr("stroke-dasharray", "5 4");
      svg.append("text").attr("x", x(vl.x) + (vi % 2 ? 8 : 0)).attr("y", padT - 14 - (vi % 2) * 13)
        .attr("text-anchor", vi % 2 ? "start" : "middle")
        .attr("font-family", MONO).attr("font-size", 9).attr("font-weight", 700).attr("fill", vl.color || "#8f6300")
        .text(vl.label || "");
    });

    var chips = [];
    cfg.points.forEach(function (d) {
      var cx = x(d.x), cy = y(d.y), rr = r(d.r == null ? 0.5 : d.r);
      var col = d.color || BLUE;
      var g = svg.append("g").style("cursor", "pointer").attr("data-drill-keep", "").attr("tabindex", 0);
      // whisker: the documented y band behind the bubble
      if (d.yLo != null && d.yHi != null && d.yHi !== d.yLo) {
        g.append("line").attr("x1", cx).attr("x2", cx).attr("y1", y(d.yLo)).attr("y2", y(d.yHi))
          .attr("stroke", col).attr("stroke-width", 2).attr("opacity", 0.35);
      }
      // dashed outer ring = documented x range
      var rw = 0;
      if (d.xLo != null && d.xHi != null && d.xHi !== d.xLo) {
        rw = Math.max(2, Math.abs(x(d.xHi) - x(d.xLo)) / 2);
        g.append("ellipse").attr("cx", cx).attr("cy", cy).attr("rx", rr + rw).attr("ry", rr + 5)
          .attr("fill", "none").attr("stroke", col).attr("stroke-width", 1).attr("stroke-dasharray", "4 3").attr("opacity", 0.6);
      }
      g.append("circle").attr("cx", cx).attr("cy", cy).attr("r", rr)
        .attr("fill", col).attr("opacity", 0.28);
      g.append("circle").attr("cx", cx).attr("cy", cy).attr("r", rr * 0.55)
        .attr("fill", col).attr("opacity", 0.85);
      // label starts clear of the bubble AND its dashed range ring
      var lx = cx + rr + rw + 8;
      var t1 = g.append("text").attr("x", lx).attr("y", cy - 2)
        .attr("font-family", MONO).attr("font-size", 11).attr("font-weight", 700).attr("fill", INK)
        .text(d.name);
      var t2 = g.append("text").attr("x", lx).attr("y", cy + 12)
        .attr("font-family", MONO).attr("font-size", 10).attr("font-weight", 700).attr("fill", col)
        .text(d.lab || "");
      chips.push({ t1: t1, t2: t2, x: lx, y: cy, bl: cx - rr - rw - 8, w: 0, h: 26 });
      if (d.tip && window.U) {
        g.on("mousemove", function (e) { U.showTip(d.tip, e.clientX, e.clientY); });
        g.on("mouseleave", function () { U.hideTip(); });
      }
      if (d.onClick) g.on("click", function (e) { e.stopPropagation(); if (window.U) U.hideTip(); d.onClick(e, d); });
    });

    // label collision pass: measure, flip left if no room on the right, then
    // push colliding chips apart and clamp them inside the frame
    requestAnimationFrame(function () {
      try {
        chips.forEach(function (c) {
          var bb = c.t1.node().getBBox();
          var bb2 = c.t2.node().getBBox();
          c.w = Math.max(bb.width, bb2.width); c.h = 26;
          c.flip = c.x + c.w > W - mR;
          if (c.flip) { c.t1.attr("text-anchor", "end"); c.t2.attr("text-anchor", "end"); }
          c.x0 = c.flip ? c.bl - c.w : c.x;
        });
        chips.sort(function (a, b) { return a.y - b.y; });
        for (var iter = 0; iter < 40; iter++) {
          var moved = false;
          for (var i = 1; i < chips.length; i++) {
            for (var j = 0; j < i; j++) {
              var a = chips[j], b = chips[i];
              var ox = Math.min(a.x0 + a.w, b.x0 + b.w) - Math.max(a.x0, b.x0);
              var oy = Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2);
              if (ox > 2 && oy > 2) { b.y = a.y + a.h / 2 + b.h / 2 + 4; moved = true; }
            }
          }
          if (!moved) break;
        }
        chips.forEach(function (c) {
          var x0 = Math.max(mL + 2, Math.min(c.x0, W - mR - c.w - 2));
          c.y = Math.max(padT + c.h / 2, Math.min(c.y, H - padB - c.h / 2));
          var tx = c.flip ? x0 + c.w : x0;
          c.t1.attr("x", tx).attr("y", c.y - 2);
          c.t2.attr("x", tx).attr("y", c.y + 12);
        });
      } catch (e) {}
    });
    if (cfg.note) {
      var p = document.createElement("p");
      p.className = "vs-note"; p.textContent = cfg.note;
      panel.appendChild(p);
    }
    return panel;
  }

  /* ══ story cards — one clean card per item: big figure, one plain-English
        reason, small-print details. Reuses the sizing chart's .sz-card skin. ══ */
  function storyCards(host, cards) {
    var grid = document.createElement("div");
    grid.className = "sizing-cards";
    cards.forEach(function (c) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "sz-card";
      card.setAttribute("data-drill-keep", "");
      card.innerHTML = '<span class="sz-name">' + esc(c.name) + "</span>" +
        '<span class="sz-amt">' + esc(c.big) + "</span>" +
        '<span class="sz-why">' + esc(c.reason) + "</span>" +
        '<span class="sz-mod">' + esc(c.small) + "</span>";
      if (c.onClick) card.addEventListener("click", function (e) { e.stopPropagation(); c.onClick(e, c); });
      grid.appendChild(card);
    });
    host.appendChild(grid);
    return grid;
  }

  window.ViewStd = { makeToggle, dollarBars, bubbles, storyCards, esc };
})();
