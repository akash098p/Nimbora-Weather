(() => {
  const icon = {
    search:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.8"/><path d="m16 16 5 5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg>',
    crosshair:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>',
  };
  function enhance() {
    document.body.classList.add("search-ui-enhanced");
    const form = document.querySelector("#searchForm");
    if (form && !form.querySelector(".search-icon")) {
      const i = document.createElement("span");
      i.className = "search-icon";
      i.innerHTML = icon.search;
      form.insertBefore(i, form.firstElementChild);
    }
    const input = document.querySelector("#searchInput");
    if (input) input.placeholder = "Search city, town, postcode or country…";
    const loc = document.querySelector("#useLocation");
    if (loc && !loc.querySelector("svg"))
      loc.innerHTML = icon.crosshair + "<span>Use my current location</span>";
    const status = document.querySelector("#searchStatus");
    if (status && !status.dataset.ready) status.dataset.ready = "1";
  }
  const observer = new MutationObserver(enhance);
  document.addEventListener("DOMContentLoaded", () => {
    enhance();
    const overlay = document.querySelector("#searchOverlay");
    if (overlay) observer.observe(overlay, { childList: true, subtree: true });
  });
  window.meghdootSearchIcons = icon;
})();
