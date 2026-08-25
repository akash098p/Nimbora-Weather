(() => {
  const $ = (s) => document.querySelector(s);
  function init() {
    const form = $("#searchForm");
    if (!form || form.dataset.searchFixReady) return;
    form.dataset.searchFixReady = "1";
    form.addEventListener("submit", () => {
      const input = $("#searchInput");
      const query = input?.value.trim();
      if (!query || query.length < 2) return;
      let attempts = 0;
      const waitForResult = () => {
        const first = $("#searchResults .result-button");
        const status = $("#searchStatus");
        if (first) {
          first.click();
          return;
        }
        if (++attempts < 60) {
          window.setTimeout(waitForResult, 100);
          return;
        }
        if (status && /Searching/i.test(status.textContent)) {
          status.textContent = "No locations found. Try another city.";
        }
      };
      window.setTimeout(waitForResult, 100);
    });
    $("#searchInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  }
  window.meghdootSearchFix = { init };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
