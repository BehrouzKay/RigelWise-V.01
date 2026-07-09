/* ==========================================================================
   RIGELWISE CMS — auth-guard.js
   Include this on every protected page, after auth.js. Redirects to the
   login screen if there's no active session. This is a soft UI gate
   (see auth.js header comment) — it stops casual navigation, not a
   determined visitor with dev tools open.
   ========================================================================== */

(function () {
  "use strict";

  function loginPath() {
    // Works whether the current page is /cms/dashboard.html (depth 1)
    // or /cms/modules/create-post.html (depth 2).
    var depth = window.location.pathname.split("/cms/")[1];
    return depth && depth.indexOf("/") > -1 ? "../login.html" : "login.html";
  }

  var session = window.RWAuth && window.RWAuth.getSession();
  if (!session) {
    window.location.replace(loginPath());
  } else {
    window.__RW_CURRENT_USER__ = session.user;
  }
})();
