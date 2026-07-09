/* ==========================================================================
   RIGELWISE — portfolio-work.js
   Same pattern as featured-work.js, for the full Portfolio page instead of
   the homepage's 2-slot preview. Fetches /portfolio.json (maintained via
   the CMS "Manage Sections" module), fetches every listed post, and
   renders ALL of them into #rw-portfolio-grid — no 2-item cap.

   IMPORTANT: like the homepage, Portfolio.dc.html is rendered by a React
   runtime (support.js), and #rw-portfolio-grid is a React-managed node.
   This function must be called from componentDidMount() inside
   Portfolio.dc.html's own <script type="text/x-dc" data-dc-script> block
   — NOT from a plain deferred <script> tag — or React's own initial
   mount will silently reset the node back to its static fallback cards
   right after. (Confirmed the hard way on index.html.)

   If portfolio.json is missing, empty, or every post fails to parse,
   this does nothing and the hand-written fallback cards stay as-is.
   ========================================================================== */

window.RWRenderPortfolioWork = function () {
  "use strict";

  var grid = document.getElementById("rw-portfolio-grid");
  if (!grid) return;

  fetch("portfolio.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("portfolio.json not found (" + r.status + ")");
      return r.json();
    })
    .then(function (urls) {
      if (!Array.isArray(urls) || !urls.length) throw new Error("portfolio.json is empty");
      return Promise.all(urls.map(fetchPost));
    })
    .then(function (cards) {
      var valid = cards.filter(Boolean);
      if (!valid.length) throw new Error("no posts could be read");
      grid.innerHTML = valid.map(renderCard).join("\n");
    })
    .catch(function (err) {
      if (window.console && console.debug) {
        console.debug("portfolio-work.js: keeping static fallback — " + err.message);
      }
    });

  function fetchPost(url) {
    return fetch(url, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("404");
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var img = doc.querySelector(".p-cover-wrap img");
        var titleEl = doc.querySelector(".p-title");
        if (!img || !titleEl) return null;

        var sectorEl = doc.querySelector(".p-cover-label .sector");
        var yearMeta = doc.querySelector('meta[name="rw-year"]');
        var summaryMeta = doc.querySelector('meta[name="rw-summary"]');
        var firstPara = doc.querySelector(".p-body p");

        return {
          url: url,
          cover: img.getAttribute("src") || "",
          title: titleEl.textContent.trim(),
          sector: sectorEl ? sectorEl.textContent.trim() : "",
          year: yearMeta ? (yearMeta.getAttribute("content") || "").trim() : "",
          summary: summaryMeta
            ? (summaryMeta.getAttribute("content") || "").trim()
            : firstPara
            ? firstPara.textContent.trim()
            : "",
        };
      })
      .catch(function () {
        return null;
      });
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCard(d) {
    return (
      '<a class="rw-case" href="' + esc(d.url) + '" style="text-decoration: none; color: inherit; display: block;">' +
      '<div style="overflow: hidden; border-radius: 5px; border: 1px solid var(--rw-border);">' +
      '<div class="rw-case-media" style="aspect-ratio: 4/3; overflow: hidden; background: var(--rw-bg2);">' +
      '<img src="' + d.cover + '" alt="' + esc(d.title) + '" style="width:100%; height:100%; object-fit:cover; display:block;">' +
      "</div>" +
      "</div>" +
      '<div style="display:flex; justify-content:space-between; gap:16px; margin-top:20px;">' +
      "<div>" +
      '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--rw-accent); margin:0 0 8px;">' +
      esc(d.sector) +
      "</p>" +
      '<h2 class="rw-case-title" style="font-family:\'Cormorant Garamond\',serif; font-weight:500; font-size:clamp(24px,2.6vw,34px); margin:0; color:var(--rw-ink);">' +
      esc(d.title) +
      "</h2>" +
      "</div>" +
      (d.year
        ? '<span style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; color:var(--rw-muted); white-space:nowrap;">' +
          esc(d.year) +
          "</span>"
        : "") +
      "</div>" +
      '<p style="margin:12px 0 0; font-size:14.5px; color:var(--rw-muted); line-height:1.6; max-width:90%;">' +
      esc(d.summary) +
      "</p>" +
      "</a>"
    );
  }
};
