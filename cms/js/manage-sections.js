/* ==========================================================================
   RIGELWISE CMS — manage-sections.js
   Lets an editor pick which posts (already generated via Create Post,
   sitting in /posts/) should be featured in the homepage "Selected work"
   grid and/or the Portfolio page, choose their order, and download
   featured.json / portfolio.json manifests.

   IMPORTANT: this page has no memory of its own between visits. On load
   it fetches the CURRENTLY LIVE featured.json / portfolio.json (relative
   to the project root, same-origin, so this only works once the CMS
   itself is deployed) and re-parses each post already listed there, so
   previously-published posts stay in the list by default. Without this,
   generating a new config after loading only the newest post would wipe
   out every post published before it — which is exactly what happened
   the first time this tool was used two posts in a row.

   No server, no directory listing beyond that — new posts are still
   loaded from the editor's computer so we can read title, sector, year,
   summary and cover image straight out of the markup.
   ========================================================================== */

(function () {
  "use strict";

  var posts = []; // { filename, url, title, sector, year, summary, cover, featured, inPortfolio }

  var loadBox = document.getElementById("loadBox");
  var loadHint = document.getElementById("loadHint");
  var fileInput = document.getElementById("postsFileInput");
  var pickerCard = document.getElementById("pickerCard");
  var pickerRows = document.getElementById("pickerRows");
  var generateBtn = document.getElementById("generateConfigBtn");
  var reloadBtn = document.getElementById("reloadExistingBtn");
  var existingStatus = document.getElementById("existingStatus");

  loadBox.addEventListener("click", function () {
    fileInput.click();
  });
  ["dragover", "dragenter"].forEach(function (evt) {
    loadBox.addEventListener(evt, function (e) {
      e.preventDefault();
      loadBox.style.borderColor = "var(--brand)";
    });
  });
  ["dragleave", "drop"].forEach(function (evt) {
    loadBox.addEventListener(evt, function (e) {
      e.preventDefault();
      loadBox.style.borderColor = "";
    });
  });
  loadBox.addEventListener("drop", function (e) {
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      loadFiles(e.dataTransfer.files);
    }
  });
  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files.length) loadFiles(fileInput.files);
    fileInput.value = ""; // allow re-selecting the same file later
  });

  function loadFiles(fileList) {
    Array.prototype.forEach.call(fileList, function (file) {
      if (!/\.html?$/i.test(file.name)) return;
      var url = "posts/" + file.name;
      if (posts.some(function (p) { return p.url === url; })) return; // already loaded

      var reader = new FileReader();
      reader.onload = function (e) {
        var record = buildPostRecord(e.target.result, url, { featured: true, inPortfolio: true });
        if (!record) {
          console.warn("manage-sections: could not read post data from " + file.name);
          return;
        }
        posts.push(record);
        renderRows();
      };
      reader.readAsText(file);
    });
  }

  function buildPostRecord(html, url, flags) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var img = doc.querySelector(".p-cover-wrap img");
    var titleEl = doc.querySelector(".p-title");
    if (!img || !titleEl) return null;

    var sectorEl = doc.querySelector(".p-cover-label .sector");
    var yearMeta = doc.querySelector('meta[name="rw-year"]');
    var summaryMeta = doc.querySelector('meta[name="rw-summary"]');
    var firstPara = doc.querySelector(".p-body p");

    return {
      filename: url.split("/").pop(),
      url: url,
      title: titleEl.textContent.trim(),
      sector: sectorEl ? sectorEl.textContent.trim() : "",
      year: yearMeta ? (yearMeta.getAttribute("content") || "").trim() : "",
      summary: summaryMeta
        ? (summaryMeta.getAttribute("content") || "").trim()
        : firstPara
        ? firstPara.textContent.trim()
        : "",
      cover: img.getAttribute("src") || "",
      featured: !!flags.featured,
      inPortfolio: !!flags.inPortfolio,
    };
  }

  // -------------------------------------------------------------------
  // Load whatever is currently live, so a new post gets ADDED to the
  // existing lineup instead of replacing it. Runs automatically on page
  // load; also re-triggerable via the "Reload" button.
  // -------------------------------------------------------------------
  function loadExisting() {
    if (existingStatus) existingStatus.textContent = "Checking what's currently live…";

    Promise.all([
      fetch("../../featured.json", { cache: "no-store" }).then(okJsonOrEmpty),
      fetch("../../portfolio.json", { cache: "no-store" }).then(okJsonOrEmpty),
    ]).then(function (results) {
      var featuredUrls = results[0];
      var portfolioUrls = results[1];

      // Merge, preserving featured.json's order first, then any
      // portfolio-only extras, deduped by url.
      var seen = {};
      var merged = [];
      featuredUrls.concat(portfolioUrls).forEach(function (u) {
        if (!seen[u]) {
          seen[u] = true;
          merged.push(u);
        }
      });

      if (!merged.length) {
        if (existingStatus) existingStatus.textContent = "Nothing live yet — this looks like the first post.";
        return;
      }

      var toFetch = merged.filter(function (u) {
        return !posts.some(function (p) { return p.url === u; });
      });

      Promise.all(
        toFetch.map(function (u) {
          return fetch("../../" + u, { cache: "no-store" })
            .then(function (r) { return r.ok ? r.text() : null; })
            .then(function (html) {
              if (!html) return null;
              return buildPostRecord(html, u, {
                featured: featuredUrls.indexOf(u) > -1,
                inPortfolio: portfolioUrls.indexOf(u) > -1,
              });
            })
            .catch(function () { return null; });
        })
      ).then(function (records) {
        var added = 0;
        records.forEach(function (r) {
          if (r) {
            posts.push(r);
            added++;
          }
        });
        renderRows();
        if (existingStatus) {
          existingStatus.textContent = added
            ? "Loaded " + added + " already-published post" + (added === 1 ? "" : "s") + " — add your new one below, it won't replace these."
            : "Couldn't read the currently-live posts (site may not be deployed yet, or files 404). Load files manually below.";
        }
      });
    });
  }

  function okJsonOrEmpty(r) {
    if (!r.ok) return [];
    return r.json().then(function (arr) { return Array.isArray(arr) ? arr : []; }).catch(function () { return []; });
  }

  if (reloadBtn) reloadBtn.addEventListener("click", loadExisting);
  loadExisting();

  function renderRows() {
    pickerCard.style.display = posts.length ? "block" : "none";
    loadHint.innerHTML = posts.length
      ? "<strong>" + posts.length + " post" + (posts.length === 1 ? "" : "s") + " loaded.</strong> Click or drag to load more."
      : "<strong>Click to select</strong> one or more <code>.html</code> files from your <code>/posts/</code> folder, or drag them here.";

    pickerRows.innerHTML = "";
    posts.forEach(function (post, i) {
      var row = document.createElement("div");
      row.className = "repeat-row";
      row.innerHTML =
        '<div style="display:flex; align-items:center; gap:14px;">' +
        '<img src="' + post.cover + '" alt="" style="width:64px; height:48px; object-fit:cover; border-radius:3px; border:1px solid var(--border); flex-shrink:0;">' +
        '<label style="display:flex; align-items:center; gap:6px; flex-shrink:0;">' +
        '<input type="checkbox" class="feat-check" ' + (post.featured ? "checked" : "") + '>' +
        "<span style=\"font-size:12px; color:var(--muted);\">Homepage</span>" +
        "</label>" +
        '<label style="display:flex; align-items:center; gap:6px; flex-shrink:0;">' +
        '<input type="checkbox" class="portfolio-check" ' + (post.inPortfolio ? "checked" : "") + '>' +
        "<span style=\"font-size:12px; color:var(--muted);\">Portfolio</span>" +
        "</label>" +
        '<div style="flex:1 1 auto; min-width:0;">' +
        '<p style="margin:0; font-family:\'Cormorant Garamond\',serif; font-size:17px; color:var(--ink);">' + escapeHtml(post.title) + "</p>" +
        '<p style="margin:2px 0 0; font-size:11.5px; color:var(--muted); font-family:\'IBM Plex Mono\',monospace;">' +
        escapeHtml(post.sector || "No sector set") + (post.year ? " &middot; " + escapeHtml(post.year) : "") +
        "</p>" +
        "</div>" +
        '<div style="display:flex; flex-direction:column; gap:4px;">' +
        '<button type="button" class="btn btn-ghost btn-sm move-up" title="Move up" ' + (i === 0 ? "disabled" : "") + '>&uarr;</button>' +
        '<button type="button" class="btn btn-ghost btn-sm move-down" title="Move down" ' + (i === posts.length - 1 ? "disabled" : "") + '>&darr;</button>' +
        "</div>" +
        '<button type="button" class="btn btn-ghost btn-sm remove-row" title="Remove from this list">Remove</button>' +
        "</div>" +
        '<div class="field" style="margin:12px 0 0;">' +
        '<label style="font-size:11px;">Link (relative URL)</label>' +
        '<input type="text" class="url-input" value="' + escapeAttr(post.url) + '">' +
        "</div>";

      row.querySelector(".feat-check").addEventListener("change", function (e) {
        posts[i].featured = e.target.checked;
        updateGenerateState();
      });
      row.querySelector(".portfolio-check").addEventListener("change", function (e) {
        posts[i].inPortfolio = e.target.checked;
        updateGenerateState();
      });
      row.querySelector(".url-input").addEventListener("input", function (e) {
        posts[i].url = e.target.value.trim();
      });
      row.querySelector(".move-up").addEventListener("click", function () {
        if (i > 0) {
          var tmp = posts[i - 1];
          posts[i - 1] = posts[i];
          posts[i] = tmp;
          renderRows();
        }
      });
      row.querySelector(".move-down").addEventListener("click", function () {
        if (i < posts.length - 1) {
          var tmp = posts[i + 1];
          posts[i + 1] = posts[i];
          posts[i] = tmp;
          renderRows();
        }
      });
      row.querySelector(".remove-row").addEventListener("click", function () {
        posts.splice(i, 1);
        renderRows();
      });

      pickerRows.appendChild(row);
    });

    updateGenerateState();
  }

  function updateGenerateState() {
    generateBtn.disabled = !posts.some(function (p) { return p.featured || p.inPortfolio; });
  }

  function downloadJson(filename, urls) {
    var json = JSON.stringify(urls, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generateBtn.addEventListener("click", function () {
    var homeUrls = posts.filter(function (p) { return p.featured; }).map(function (p) { return p.url; });
    var portfolioUrls = posts.filter(function (p) { return p.inPortfolio; }).map(function (p) { return p.url; });

    var downloaded = [];
    // Both downloads fire synchronously, back-to-back, inside this same
    // click handler. A setTimeout-delayed second download runs outside the
    // browser's "this came from a real click" window and can get silently
    // blocked (no error, it just never lands in Downloads) — which is the
    // likeliest reason one of the two files has gone missing before.
    if (homeUrls.length) {
      downloadJson("featured.json", homeUrls);
      downloaded.push("featured.json");
    }
    if (portfolioUrls.length) {
      downloadJson("portfolio.json", portfolioUrls);
      downloaded.push("portfolio.json");
    }

    showToast(
      downloaded.length
        ? "Downloaded " + downloaded.join(" and ") + " — check your Downloads folder for BOTH, then upload BOTH plus the post's own .html file. Missing any one of these is the #1 cause of posts not showing up."
        : "Nothing ticked — check Homepage or Portfolio for at least one post first."
    );
  });

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  function showToast(message) {
    var toast = document.getElementById("cmsToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.id = "cmsToast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.setAttribute("data-visible", "true");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.setAttribute("data-visible", "false");
    }, 4500);
  }
})();
