/* Snoochie Soft: "copy address" button. Without JS the address is plain, selectable text. */
(function () {
  "use strict";
  var btn = document.querySelector("[data-copy]");
  var status = document.querySelector(".copy-status");
  if (!btn || !navigator.clipboard) return;
  btn.hidden = false;
  var t;
  btn.addEventListener("click", function () {
    navigator.clipboard.writeText(btn.getAttribute("data-copy")).then(function () {
      btn.textContent = "Skopiowano";
      btn.classList.add("done");
      if (status) status.textContent = "Adres skopiowany do schowka.";
      clearTimeout(t);
      t = setTimeout(function () {
        btn.textContent = "Kopiuj adres";
        btn.classList.remove("done");
        if (status) status.textContent = "";
      }, 2200);
    });
  });
})();
