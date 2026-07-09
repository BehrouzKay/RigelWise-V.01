/* ==========================================================================
   RIGELWISE CMS — auth.js
   Front-end-only authentication. This is a UI gate, not real security:
   these credentials live in this file and are readable by anyone who
   opens dev tools. It is intentionally structured so the single
   `authenticate()` function is the only thing that needs to change when
   this is upgraded to a real backend (see the note below).
   ========================================================================== */

(function () {
  "use strict";

  /* -----------------------------------------------------------------
     PLACEHOLDER CREDENTIAL STORE
     Replace these before relying on this for anything real. Two users
     as requested — swap in real usernames/passwords whenever ready.
  ----------------------------------------------------------------- */
  var USERS = [
    { username: "admin", password: "admin123", displayName: "Admin" },
    { username: "editor", password: "editor123", displayName: "Editor" },
  ];

  var SESSION_KEY = "rw_cms_session";

  /* -----------------------------------------------------------------
     authenticate(username, password) -> { ok, user } | { ok: false }

     UPGRADE PATH: to move to a real backend, replace the body of this
     function with a fetch() to your login endpoint, e.g.:

       return fetch('/api/login', { method:'POST', body: JSON.stringify({username,password}) })
         .then(r => r.json());

     Everything that calls authenticate() already treats it as
     returning { ok, user }, so no other file needs to change.
  ----------------------------------------------------------------- */
  function authenticate(username, password) {
    var match = USERS.find(function (u) {
      return u.username === username && u.password === password;
    });
    if (match) {
      return { ok: true, user: { username: match.username, displayName: match.displayName } };
    }
    return { ok: false };
  }

  function startSession(user) {
    var session = { user: user, startedAt: Date.now() };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function getSession() {
    var raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function endSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  // Exposed as a small global namespace so other pages can use it
  // without a bundler or module system.
  window.RWAuth = {
    authenticate: authenticate,
    startSession: startSession,
    getSession: getSession,
    endSession: endSession,
  };
})();
