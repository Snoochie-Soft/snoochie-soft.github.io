// Snoochie Soft label: language menu (every page), crate + desk + contact copy (home).
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var $ = function (id) { return document.getElementById(id); };

  /* ---- theme: auto -> light -> dark ---- */
  var root = document.documentElement;
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    var order = ["auto", "light", "dark"];
    function apply(mode) {
      if (mode === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", mode);
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
        m.setAttribute("content", mode === "auto" ? m.getAttribute(m.media.indexOf("dark") > -1 ? "data-dark" : "data-light") : m.getAttribute("data-" + mode));
      });
      btn.setAttribute("aria-label", btn.getAttribute("data-" + mode));
      btn.title = btn.getAttribute("data-" + mode);
      btn.querySelector(".theme-label").textContent = btn.getAttribute("data-" + mode + "-short");
    }
    var cur = root.getAttribute("data-theme") || "auto";
    apply(cur);
    btn.hidden = false;
    btn.addEventListener("click", function () {
      cur = order[(order.indexOf(cur) + 1) % order.length];
      apply(cur);
      try { if (cur === "auto") localStorage.removeItem("theme"); else localStorage.setItem("theme", cur); } catch (e) {}
    });
  });

  /* ---- language menu ---- */
  document.querySelectorAll("[data-lang]").forEach(function (box) {
    var btn = box.querySelector("button"), list = box.querySelector("ul");
    var items = function () { return Array.prototype.slice.call(list.querySelectorAll("a")); };
    function set(open, focusFirst) {
      list.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      if (open && focusFirst) { var cur = list.querySelector("[aria-current]") || items()[0]; if (cur) cur.focus(); }
    }
    btn.addEventListener("click", function () { set(list.hidden, true); });
    box.addEventListener("keydown", function (e) {
      var all = items(), k = all.indexOf(document.activeElement);
      if (e.key === "Escape" && !list.hidden) { set(false); btn.focus(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (list.hidden) set(true, true); else if (k > -1) all[(k + 1) % all.length].focus(); }
      else if (e.key === "ArrowUp" && k > -1) { e.preventDefault(); all[(k - 1 + all.length) % all.length].focus(); }
    });
    document.addEventListener("click", function (e) { if (!box.contains(e.target)) set(false); });
    box.addEventListener("focusout", function (e) { if (!box.contains(e.relatedTarget)) set(false); });
  });

  /* ---- contact: copy address ---- */
  var copyBtn = $("copyAddr");
  if (copyBtn && navigator.clipboard && window.isSecureContext) {
    copyBtn.hidden = false;
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText($("addr").textContent.trim()).then(function () {
        $("copyStatus").textContent = copyBtn.getAttribute("data-done");
      });
    });
  }

  /* ---- home: crate and desk ---- */
  var rack = $("rack");
  if (!rack) return;
  var card = $("sleeve3d"), front = $("faceFront"), rear = $("faceRear"), now = $("now");
  var flipBtn = $("flip"), flipLabel = $("flipLabel"), desk = document.querySelector(".stage"), status = $("deskStatus");
  // progressive enhancement: sleeves and ribbon numbers are links to the app pages
  // in the HTML; with JS they become buttons that pull a release onto the desk.
  function upgrade(a, pressed) {
    var b = document.createElement("button");
    b.type = "button";
    if (a.className) b.className = a.className;
    b.setAttribute("data-i", a.getAttribute("data-i"));
    b.setAttribute("aria-label", a.getAttribute("data-label"));
    if (a.getAttribute("style")) b.setAttribute("style", a.getAttribute("style"));
    if (pressed !== undefined) b.setAttribute("aria-pressed", String(pressed));
    while (a.firstChild) b.appendChild(a.firstChild);
    a.replaceWith(b);
    return b;
  }
  rack.querySelectorAll("a.slv").forEach(function (a, k) { upgrade(a, k === 0); });
  $("scrubList").querySelectorAll("a[data-i]").forEach(function (a) { upgrade(a); });
  flipBtn.hidden = false; $("arrows").hidden = false;
  var sleeves = Array.prototype.slice.call(rack.querySelectorAll(".slv"));
  var buttons = sleeves.filter(function (s) { return s.tagName === "BUTTON"; });
  var cur = 0, busy = false, queued = null;

  function showBack(on) {
    card.classList.toggle("back", on);
    front.setAttribute("aria-hidden", on ? "true" : "false");
    rear.setAttribute("aria-hidden", on ? "false" : "true");
    flipLabel.textContent = flipLabel.getAttribute(on ? "data-cover" : "data-screens");
    flipBtn.title = flipLabel.textContent;
  }
  flipBtn.addEventListener("click", function () { showBack(!card.classList.contains("back")); });

  function fill(i) {
    var tpl = $("desk-" + i).content;
    now.innerHTML = tpl.querySelector('[data-slot="now"]').innerHTML;
    front.innerHTML = tpl.querySelector('[data-slot="front"]').innerHTML;
    rear.innerHTML = tpl.querySelector('[data-slot="rear"]').innerHTML;
    now.querySelector(".actions").appendChild(flipBtn);
    status.textContent = $("desk-" + i).getAttribute("data-status");
  }
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function pull(i) {
    if (i >= buttons.length || isNaN(i)) return;
    if (busy) { queued = i; return; }
    if (i === cur) return;
    cur = i;
    buttons.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); });
    if (reduce.matches) { fill(i); showBack(true); return; }
    busy = true;
    card.classList.add("out");
    wait(320).then(function () {
      card.classList.add("instant"); fill(i); showBack(false); void card.offsetWidth; card.classList.remove("instant");
      card.classList.remove("out");
      return wait(420);
    }).then(function () { showBack(true); return wait(300); }).then(function () {
      busy = false;
      if (queued !== null) { var q = queued; queued = null; pull(q); }
    });
  }

  function padLeft() { return parseFloat(getComputedStyle(rack).paddingLeft) || 0; }
  function scrollToSleeve(j) {
    var s = sleeves[j]; if (!s) return;
    rack.scrollTo({ left: s.offsetLeft - padLeft(), behavior: reduce.matches ? "auto" : "smooth" });
  }

  var moved = false;
  rack.addEventListener("click", function (e) {
    var b = e.target.closest("button.slv"); if (!b || moved) return;
    pull(+b.getAttribute("data-i"));
    var top = (document.querySelector(".now") || desk).getBoundingClientRect().top;
    if (top < 0) document.getElementById("h1").scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" });
  });
  rack.addEventListener("keydown", function (e) {
    var i = buttons.indexOf(document.activeElement); if (i < 0) return;
    var j = null;
    if (e.key === "ArrowRight") j = Math.min(buttons.length - 1, i + 1);
    else if (e.key === "ArrowLeft") j = Math.max(0, i - 1);
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = buttons.length - 1;
    if (j === null) return;
    e.preventDefault(); buttons[j].focus({ preventScroll: true }); scrollToSleeve(j);
  });
  // roving tabindex: one stop in the tab order, arrows move along the crate
  function rove() { buttons.forEach(function (b, k) { b.tabIndex = k === (buttons.indexOf(document.activeElement) > -1 ? buttons.indexOf(document.activeElement) : cur) ? 0 : -1; }); }
  rack.addEventListener("focusin", rove);
  rack.addEventListener("focusout", function () { setTimeout(rove, 0); });
  rove();

  // mouse drag
  var down = false, sx = 0, sl = 0;
  rack.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse" || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = rack.scrollLeft; });
  window.addEventListener("pointermove", function (e) {
    if (!down) return; var dx = e.clientX - sx;
    if (!moved && Math.abs(dx) > 5) { moved = true; rack.classList.add("dragging"); }
    if (moved) rack.scrollLeft = sl - dx;
  });
  window.addEventListener("pointerup", function () {
    if (!down) return; down = false;
    if (moved) { var keep = rack.scrollLeft; rack.classList.remove("dragging"); rack.scrollLeft = keep; scrollToSleeve(nearest()); setTimeout(function () { moved = false; }, 0); }
  });
  function nearest() {
    var best = 0, bd = 1e9, p = padLeft();
    sleeves.forEach(function (s, k) { var d = Math.abs(s.offsetLeft - p - rack.scrollLeft); if (d < bd) { bd = d; best = k; } });
    return best;
  }
  var prev = $("prev"), next = $("next");
  prev.addEventListener("click", function () { rack.scrollBy({ left: -rack.clientWidth * 0.6, behavior: reduce.matches ? "auto" : "smooth" }); });
  next.addEventListener("click", function () { rack.scrollBy({ left: rack.clientWidth * 0.6, behavior: reduce.matches ? "auto" : "smooth" }); });

  /* ---- number ribbon ---- */
  var list = $("scrubList"), win = $("win");
  var ribbon = Array.prototype.slice.call(list.querySelectorAll("button"));
  list.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var i = +b.getAttribute("data-i"); scrollToSleeve(i); pull(i);
  });
  function sync() {
    var max = rack.scrollWidth, w = list.scrollWidth;
    win.style.left = (rack.scrollLeft / max * w) + "px";
    win.style.width = Math.max(24, rack.clientWidth / max * w) + "px";
    var first = nearest();
    ribbon.forEach(function (b, k) { b.setAttribute("aria-current", String(k === first)); });
    var room = rack.scrollWidth - rack.clientWidth;
    prev.disabled = rack.scrollLeft <= 2; next.disabled = rack.scrollLeft >= room - 2;
  }
  rack.addEventListener("scroll", function () { requestAnimationFrame(sync); }, { passive: true });
  window.addEventListener("resize", sync);
  sync();
})();
