/* ==========================================================================
   RIGELWISE CMS — create-post.js
   Handles the Create Post form: tags, cover image, repeatable flow
   steps, repeatable internal links, and generating the final
   self-contained post HTML on submit.
   ========================================================================== */

(function () {
  "use strict";

  /* -----------------------------------------------------------------
     State
  ----------------------------------------------------------------- */
  var tags = [];
  var coverDataUrl = "";
  var flowRowCount = 0;
  var linkRowCount = 0;

  /* -----------------------------------------------------------------
     Tags
  ----------------------------------------------------------------- */
  var tagInput = document.getElementById("tagInput");
  var tagsList = document.getElementById("tagsList");

  function renderTags() {
    tagsList.innerHTML = "";
    tags.forEach(function (tag, i) {
      var pill = document.createElement("span");
      pill.className = "tag-pill";
      pill.innerHTML = "#" + escapeHtml(tag) + ' <button type="button" aria-label="Remove tag">&times;</button>';
      pill.querySelector("button").addEventListener("click", function () {
        tags.splice(i, 1);
        renderTags();
      });
      tagsList.appendChild(pill);
    });
  }

  function addTagFromInput() {
    // Split on commas AND whitespace, and strip any leading '#' from each
    // piece. This matters because people naturally type "#one #two #three"
    // or "one, two three" in a single go rather than pressing Enter after
    // every word — without this the whole string became one garbled tag.
    var pieces = tagInput.value
      .split(/[,\s]+/)
      .map(function (piece) {
        return piece.trim().replace(/^#+/, "");
      })
      .filter(Boolean);

    pieces.forEach(function (raw) {
      if (tags.indexOf(raw) === -1) tags.push(raw);
    });
    if (pieces.length) renderTags();
    tagInput.value = "";
  }

  tagInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTagFromInput();
    } else if (e.key === "Backspace" && tagInput.value === "" && tags.length) {
      tags.pop();
      renderTags();
    }
  });
  tagInput.addEventListener("blur", function () {
    if (tagInput.value.trim()) addTagFromInput();
  });

  /* -----------------------------------------------------------------
     Cover image
  ----------------------------------------------------------------- */
  var uploadBox = document.getElementById("uploadBox");
  var coverInput = document.getElementById("coverImageInput");
  var coverPreview = document.getElementById("coverPreview");
  var uploadHint = document.getElementById("uploadHint");

  uploadBox.addEventListener("click", function () {
    coverInput.click();
  });

  ["dragover", "dragenter"].forEach(function (evt) {
    uploadBox.addEventListener(evt, function (e) {
      e.preventDefault();
      uploadBox.style.borderColor = "var(--brand)";
    });
  });
  ["dragleave", "drop"].forEach(function (evt) {
    uploadBox.addEventListener(evt, function (e) {
      e.preventDefault();
      uploadBox.style.borderColor = "";
    });
  });
  uploadBox.addEventListener("drop", function (e) {
    var file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleCoverFile(file);
  });

  coverInput.addEventListener("change", function () {
    var file = coverInput.files && coverInput.files[0];
    if (file) handleCoverFile(file);
  });

  function handleCoverFile(file) {
    if (!/^image\//.test(file.type)) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      coverDataUrl = e.target.result;
      coverPreview.src = coverDataUrl;
      coverPreview.style.display = "block";
      uploadHint.style.display = "none";
      uploadBox.classList.add("has-image");
    };
    reader.readAsDataURL(file);
  }

  /* -----------------------------------------------------------------
     Flow steps (repeatable)
  ----------------------------------------------------------------- */
  var flowRows = document.getElementById("flowRows");

  function addFlowRow(titleValue, descValue, descPlaceholder) {
    flowRowCount++;
    var id = "flow-" + flowRowCount;
    var row = document.createElement("div");
    row.className = "repeat-row";
    row.dataset.rowId = id;
    row.innerHTML =
      '<div class="row-head">' +
      '<span class="row-label">Step ' + flowRowCount + '</span>' +
      '<button type="button" class="remove-row">Remove</button>' +
      "</div>" +
      '<div class="field" style="margin-bottom:10px;">' +
      '<input type="text" class="flow-title" placeholder="e.g. Starting point" value="' + escapeAttr(titleValue || "") + '">' +
      "</div>" +
      '<div class="field" style="margin-bottom:0;">' +
      '<textarea class="flow-desc" style="min-height:70px;" placeholder="' + escapeAttr(descPlaceholder || "Describe this stage of the project…") + '">' + escapeHtml(descValue || "") + "</textarea>" +
      "</div>";
    row.querySelector(".remove-row").addEventListener("click", function () {
      row.remove();
      renumberFlowRows();
    });
    flowRows.appendChild(row);
  }

  function renumberFlowRows() {
    var rows = flowRows.querySelectorAll(".repeat-row");
    rows.forEach(function (row, i) {
      row.querySelector(".row-label").textContent = "Step " + (i + 1);
    });
  }

  document.getElementById("addFlowRow").addEventListener("click", function () {
    addFlowRow("", "");
  });

  // Seed with the three stage titles called out in the brief — editable,
  // and more can be added or removed freely. The description fields are
  // left blank with a placeholder hint only, so an unedited row doesn't
  // silently ship generic-sounding filler text as if it were real content.
  addFlowRow("Starting point", "", "Where did the project begin, and what did the client need?");
  addFlowRow("Services delivered", "", "Which Rigelwise service lines were engaged for this project?");
  addFlowRow("Methods used", "", "How was the work approached and delivered?");

  /* -----------------------------------------------------------------
     Internal links (repeatable)
  ----------------------------------------------------------------- */
  var linksRows = document.getElementById("linksRows");

  function addLinkRow(labelValue, urlValue) {
    linkRowCount++;
    var row = document.createElement("div");
    row.className = "repeat-row";
    row.innerHTML =
      '<div class="row-head">' +
      '<span class="row-label">Link ' + linkRowCount + '</span>' +
      '<button type="button" class="remove-row">Remove</button>' +
      "</div>" +
      '<div class="row-grid">' +
      '<input type="text" class="link-label" placeholder="Link text, e.g. Meridian Clinics — UK expansion" value="' + escapeAttr(labelValue || "") + '">' +
      '<input type="text" class="link-url" placeholder="Relative URL, e.g. meridian-clinics.html" value="' + escapeAttr(urlValue || "") + '">' +
      "</div>";
    row.querySelector(".remove-row").addEventListener("click", function () {
      row.remove();
      renumberLinkRows();
    });
    linksRows.appendChild(row);
  }

  function renumberLinkRows() {
    var rows = linksRows.querySelectorAll(".repeat-row");
    rows.forEach(function (row, i) {
      row.querySelector(".row-label").textContent = "Link " + (i + 1);
    });
  }

  document.getElementById("addLinkRow").addEventListener("click", function () {
    addLinkRow("", "");
  });

  /* -----------------------------------------------------------------
     Helpers
  ----------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }
  function slugify(str) {
    return String(str || "post")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post";
  }
  function nl2p(str) {
    return String(str || "")
      .split(/\n{2,}/)
      .map(function (para) {
        return "<p>" + escapeHtml(para).replace(/\n/g, "<br>") + "</p>";
      })
      .join("\n        ");
  }

  /* -----------------------------------------------------------------
     Build the final post HTML
     Section order per spec: cover image -> cover label -> tags ->
     overview -> flow -> internal links.
  ----------------------------------------------------------------- */
  function buildPostHtml(data) {
    var tagsHtml = data.tags
      .map(function (t) {
        return '<span class="p-tag">#' + escapeHtml(t) + "</span>";
      })
      .join("\n          ");

    var flowHtml = data.flow
      .map(function (step, i) {
        return (
          '<div class="p-flow-step">' +
          '<span class="p-flow-num">' + String(i + 1).padStart(2, "0") + "</span>" +
          "<div>" +
          "<h4>" + escapeHtml(step.title) + "</h4>" +
          "<p>" + escapeHtml(step.desc) + "</p>" +
          "</div>" +
          "</div>"
        );
      })
      .join("\n        ");

    var linksHtml = data.links.length
      ? data.links
          .map(function (l) {
            return '<a class="p-link" href="' + escapeAttr(l.url) + '">' + escapeHtml(l.label) +
              ' <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 13L13 3M13 3H5M13 3V11"/></svg></a>';
          })
          .join("\n          ")
      : "";

    var linksSection = data.links.length
      ? '<section class="p-section">\n        <p class="p-eyebrow">Related</p>\n        <div class="p-links">\n          ' +
        linksHtml +
        "\n        </div>\n      </section>"
      : "";

    return (
      "<!DOCTYPE html>\n" +
      '<html lang="en">\n' +
      "<head>\n" +
      '<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      "<title>" + escapeHtml(data.title) + " | Rigelwise Solutions</title>\n" +
      '<meta name="description" content="' + escapeAttr((data.summary || data.overview).slice(0, 160)) + '">\n' +
      (data.year ? '<meta name="rw-year" content="' + escapeAttr(data.year) + '">\n' : "") +
      (data.summary ? '<meta name="rw-summary" content="' + escapeAttr(data.summary) + '">\n' : "") +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">\n' +
      "<style>\n" +
      "  :root{--bg:#F6F4EF;--bg2:#ECE8E1;--ink:#091A22;--brand:#0F3B4A;--accent:#A57A3F;--text:#18252B;--muted:#6B7478;--border:#D8D4CC;--surface:#FFFFFF;}\n" +
      "  *{box-sizing:border-box;}\n" +
      "  body{margin:0;background:var(--bg);color:var(--text);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;}\n" +
      "  a{color:var(--brand);}\n" +
      "  .p-back{display:block;padding:18px clamp(20px,5vw,60px);font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);text-decoration:none;}\n" +
      "  .p-back:hover{color:var(--brand);}\n" +
      "  .p-cover-wrap{position:relative;width:100%;aspect-ratio:16/9;max-height:620px;overflow:hidden;background:var(--ink);}\n" +
      "  .p-cover-wrap img{width:100%;height:100%;object-fit:cover;display:block;}\n" +
      "  .p-cover-label{position:absolute;top:28px;left:28px;background:var(--surface);border-radius:4px;padding:12px 18px;box-shadow:0 16px 40px -20px rgba(9,26,34,.45);}\n" +
      "  .p-cover-label .client{font-family:'Cormorant Garamond',serif;font-size:17px;color:var(--ink);line-height:1.2;}\n" +
      "  .p-cover-label .sector{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:3px;}\n" +
      "  .p-container{max-width:760px;margin:0 auto;padding:0 clamp(20px,5vw,40px);}\n" +
      "  .p-section{padding-top:clamp(36px,5vw,56px);}\n" +
      "  .p-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:8px;margin:0 0 16px;}\n" +
      "  .p-eyebrow::before{content:'';width:18px;height:1px;background:var(--accent);display:inline-block;}\n" +
      "  .p-title{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(30px,4vw,44px);line-height:1.1;color:var(--ink);margin:20px 0 0;}\n" +
      "  .p-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}\n" +
      "  .p-tag{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--brand);background:var(--bg2);border:1px solid var(--border);border-radius:999px;padding:5px 12px;}\n" +
      "  .p-body p{font-size:15.5px;line-height:1.75;color:var(--text);margin:0 0 16px;}\n" +
      "  .p-body p:last-child{margin-bottom:0;}\n" +
      "  .p-flow{position:relative;padding-left:8px;}\n" +
      "  .p-flow-step{display:flex;gap:18px;padding-bottom:28px;position:relative;}\n" +
      "  .p-flow-step:last-child{padding-bottom:0;}\n" +
      "  .p-flow-step::before{content:'';position:absolute;left:13px;top:26px;bottom:-2px;width:1px;background:var(--border);}\n" +
      "  .p-flow-step:last-child::before{display:none;}\n" +
      "  .p-flow-num{flex-shrink:0;width:27px;height:27px;border-radius:50%;background:var(--brand);color:var(--bg);font-family:'IBM Plex Mono',monospace;font-size:11px;display:flex;align-items:center;justify-content:center;}\n" +
      "  .p-flow-step h4{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:18px;color:var(--ink);margin:2px 0 5px;}\n" +
      "  .p-flow-step p{font-size:14px;line-height:1.6;color:var(--muted);margin:0;}\n" +
      "  .p-links{display:flex;flex-direction:column;gap:10px;}\n" +
      "  .p-link{display:flex;align-items:center;gap:8px;font-size:14.5px;padding:12px 14px;border:1px solid var(--border);border-radius:4px;text-decoration:none;}\n" +
      "  .p-link:hover{border-color:var(--brand);}\n" +
      "  .p-foot{margin-top:clamp(56px,7vw,90px);border-top:1px solid var(--border);padding:22px clamp(20px,5vw,40px) 40px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);}\n" +
      "</style>\n" +
      "</head>\n" +
      "<body>\n" +
      '  <a class="p-back" href="../index.html">&larr; Rigelwise Solutions</a>\n\n' +
      '  <div class="p-cover-wrap">\n' +
      '    <img src="' + data.cover + '" alt="' + escapeAttr(data.title) + '">\n' +
      '    <div class="p-cover-label">\n' +
      '      <p class="client">' + escapeHtml(data.client || "Client name") + "</p>\n" +
      '      <p class="sector">' + escapeHtml(data.sector || "Business sector") + "</p>\n" +
      "    </div>\n" +
      "  </div>\n\n" +
      '  <div class="p-container">\n' +
      '    <section class="p-section">\n' +
      '      <p class="p-eyebrow">Case study' + (data.year ? " &middot; " + escapeHtml(data.year) : "") + "</p>\n" +
      '      <h1 class="p-title">' + escapeHtml(data.title) + "</h1>\n" +
      (tagsHtml ? '      <div class="p-tags">\n          ' + tagsHtml + "\n      </div>\n" : "") +
      "    </section>\n\n" +
      '    <section class="p-section">\n' +
      '      <p class="p-eyebrow">Overview</p>\n' +
      '      <div class="p-body">\n        ' + nl2p(data.overview) + "\n      </div>\n" +
      "    </section>\n\n" +
      '    <section class="p-section">\n' +
      '      <p class="p-eyebrow">Flow</p>\n' +
      '      <div class="p-flow">\n        ' + flowHtml + "\n      </div>\n" +
      "    </section>\n\n" +
      linksSection + "\n" +
      "  </div>\n\n" +
      '  <div class="p-foot">Rigelwise Solutions Ltd</div>\n' +
      "</body>\n" +
      "</html>\n"
    );
  }

  /* -----------------------------------------------------------------
     Submit
  ----------------------------------------------------------------- */
  var form = document.getElementById("postForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var title = document.getElementById("postTitle").value.trim();
    if (!title) {
      alert("Give the post a title first.");
      return;
    }
    if (!coverDataUrl) {
      alert("Add a cover image first.");
      return;
    }

    var flowSteps = [];
    flowRows.querySelectorAll(".repeat-row").forEach(function (row) {
      var t = row.querySelector(".flow-title").value.trim();
      var d = row.querySelector(".flow-desc").value.trim();
      if (t || d) flowSteps.push({ title: t || "Untitled step", desc: d });
    });

    var links = [];
    linksRows.querySelectorAll(".repeat-row").forEach(function (row) {
      var label = row.querySelector(".link-label").value.trim();
      var url = row.querySelector(".link-url").value.trim();
      if (label && url) links.push({ label: label, url: url });
    });

    var data = {
      title: title,
      cover: coverDataUrl,
      client: document.getElementById("clientName").value.trim(),
      sector: document.getElementById("businessSector").value.trim(),
      year: document.getElementById("postYear").value.trim(),
      summary: document.getElementById("cardSummary").value.trim(),
      tags: tags.slice(),
      overview: document.getElementById("overviewText").value.trim(),
      flow: flowSteps,
      links: links,
    };

    var html = buildPostHtml(data);
    var filename = slugify(title) + ".html";

    var blob = new Blob([html], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Downloaded " + filename + " — move it into /posts/ to publish.");
  });

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
    }, 4000);
  }
})();
