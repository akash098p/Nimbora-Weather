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
      window.setTimeout(() => {
        const first = $("#searchResults .result-button");
        const status = $("#searchStatus");
        if (first) first.click();
        else if (status && !status.textContent.trim()) status.textContent = "No locations found. Try another city.";
      }, 250);
    });
    $("#searchInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  }
  window.nimboraSearchFix = { init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
