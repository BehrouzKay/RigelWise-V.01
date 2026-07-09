/* ==========================================================================
   RIGELWISE — featured-work.js
   Progressive enhancement for the homepage "Selected work" grid
   (#rw-work-grid). Fetches /featured.json (a small array of post URLs
   maintained via the CMS "Manage Sections" module), fetches each post
   page, and pulls out its cover image / sector / title / year / summary
   with DOMParser to build the two homepage cards.

   If featured.json is missing, empty, or any post can't be parsed, this
   script does nothing and the hand-written fallback cards already in
   index.html stay exactly as they are — nothing is ever left blank.

   Requires the page to be served over http(s) (fetch of local files is
   blocked under file://), which is already the case on rigelwise.com.
   ========================================================================== */

(function () {
  "use strict";

  var grid = document.getElementById("rw-work-grid");
  if (!grid) return;

  fetch("featured.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("featured.json not found (" + r.status + ")");
      return r.json();
    })
    .then(function (urls) {
      if (!Array.isArray(urls) || !urls.length) throw new Error("featured.json is empty");
      return Promise.all(urls.map(fetchPost));
    })
    .then(function (cards) {
      var valid = cards.filter(Boolean);
      if (!valid.length) throw new Error("no posts could be read");
      grid.innerHTML = valid.map(renderCard).join("\n");
    })
    .catch(function (err) {
      // Leave the static fallback cards already in the HTML untouched.
      if (window.console && console.debug) {
        console.debug("featured-work.js: keeping static fallback — " + err.message);
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
        return null; // skip posts that fail to load or parse rather than breaking the whole grid
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
      '<a class="rw-card" href="' + esc(d.url) + '" style="text-decoration: none; color: inherit; display: block;">' +
      '<div style="overflow: hidden; border-radius: 4px; border: 1px solid var(--rw-border);">' +
      '<div class="rw-card-media" style="aspect-ratio: 4/3; overflow: hidden; background: var(--rw-bg2);">' +
      '<img src="' + d.cover + '" alt="' + esc(d.title) + '" style="width:100%; height:100%; object-fit:cover; display:block;">' +
      "</div>" +
      "</div>" +
      '<div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 20px;">' +
      "<div>" +
      '<p style="font-family: \'IBM Plex Mono\', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--rw-accent); margin: 0 0 8px;">' +
      esc(d.sector) +
      "</p>" +
      '<h3 style="font-family: \'Cormorant Garamond\', serif; font-weight: 500; font-size: clamp(22px,2.4vw,30px); margin: 0; color: var(--rw-ink);">' +
      esc(d.title) +
      "</h3>" +
      "</div>" +
      (d.year
        ? '<span style="font-family: \'IBM Plex Mono\', monospace; font-size: 12px; color: var(--rw-muted); white-space: nowrap;">' +
          esc(d.year) +
          "</span>"
        : "") +
      "</div>" +
      '<p style="margin: 12px 0 0; font-size: 14.5px; color: var(--rw-muted); line-height: 1.6; max-width: 90%;">' +
      esc(d.summary) +
      "</p>" +
      "</a>"
    );
  }
})();
