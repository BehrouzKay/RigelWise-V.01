/* ==========================================================================
   RIGELWISE CMS — manage-sections.js
   Lets an editor pick which posts (already generated via Create Post,
   sitting in /posts/) should be featured in the homepage "Selected work"
   grid, choose their order, and download a featured.json manifest that
   featured-work.js (loaded on index.html) reads at page load.

   No server, no directory listing — the editor loads the actual post
   .html files from their computer so we can read each one's title,
   sector, year, summary and cover image straight out of the markup.
   ========================================================================== */

(function () {
  "use strict";

  var posts = []; // { filename, url, title, sector, year, summary, cover, featured }

  var loadBox = document.getElementById("loadBox");
  var loadHint = document.getElementById("loadHint");
  var fileInput = document.getElementById("postsFileInput");
  var pickerCard = document.getElementById("pickerCard");
  var pickerRows = document.getElementById("pickerRows");
  var generateBtn = document.getElementById("generateConfigBtn");

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
      if (posts.some(function (p) { return p.filename === file.name; })) return; // already loaded

      var reader = new FileReader();
      reader.onload = function (e) {
        var parsed = parsePost(e.target.result, file.name);
        if (!parsed) {
          console.warn("manage-sections: could not read post data from " + file.name);
          return;
        }
        posts.push(parsed);
        renderRows();
      };
      reader.readAsText(file);
    });
  }

  function parsePost(html, filename) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var img = doc.querySelector(".p-cover-wrap img");
    var titleEl = doc.querySelector(".p-title");
    if (!img || !titleEl) return null;

    var sectorEl = doc.querySelector(".p-cover-label .sector");
    var yearMeta = doc.querySelector('meta[name="rw-year"]');
    var summaryMeta = doc.querySelector('meta[name="rw-summary"]');
    var firstPara = doc.querySelector(".p-body p");

    return {
      filename: filename,
      url: "posts/" + filename,
      title: titleEl.textContent.trim(),
      sector: sectorEl ? sectorEl.textContent.trim() : "",
      year: yearMeta ? (yearMeta.getAttribute("content") || "").trim() : "",
      summary: summaryMeta
        ? (summaryMeta.getAttribute("content") || "").trim()
        : firstPara
        ? firstPara.textContent.trim()
        : "",
      cover: img.getAttribute("src") || "",
      featured: true,
    };
  }

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
        '<label style="display:flex; align-items:center; gap:8px; flex-shrink:0;">' +
        '<input type="checkbox" class="feat-check" ' + (post.featured ? "checked" : "") + '>' +
        "<span style=\"font-size:12px; color:var(--muted);\">Feature</span>" +
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
        '<label style="font-size:11px;">Homepage link (relative URL)</label>' +
        '<input type="text" class="url-input" value="' + escapeAttr(post.url) + '">' +
        "</div>";

      row.querySelector(".feat-check").addEventListener("change", function (e) {
        posts[i].featured = e.target.checked;
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
    generateBtn.disabled = !posts.some(function (p) { return p.featured; });
  }

  generateBtn.addEventListener("click", function () {
    var urls = posts
      .filter(function (p) { return p.featured; })
      .map(function (p) { return p.url; });

    var json = JSON.stringify(urls, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "featured.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Downloaded featured.json — drop it into the project root, next to index.html.");
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
