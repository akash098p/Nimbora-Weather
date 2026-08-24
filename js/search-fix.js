(() => {
  const API = "https://geocoding-api.open-meteo.com/v1/search";
  const $ = (s) => document.querySelector(s);

  async function submitSearch(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const input = $("#searchInput");
    const status = $("#searchStatus");
    const results = $("#searchResults");
    const query = input?.value.trim();
    if (!query || query.length < 2) {
      if (status) status.textContent = "Enter at least 2 characters.";
      input?.focus();
      return;
    }

    if (status) status.textContent = "Searching…";
    if (results) results.innerHTML = "";

    try {
      const url = API + "?" + new URLSearchParams({
        name: query,
        count: "8",
        language: "en",
        format: "json",
      });
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Geocoding request failed");
      const data = await response.json();
      const places = Array.isArray(data.results) ? data.results : [];

      if (!places.length) {
        if (status) status.textContent = "No locations found. Try another city.";
        return;
      }

      if (status) status.textContent = `${places.length} locations found`;
      if (!results) return;

      results.innerHTML = places.map((x, i) => {
        const detail = [x.admin1, x.country].filter(Boolean).join(", ");
        return `<button type="button" class="result-button" data-search-result="${i}">
          <span class="result-pin" aria-hidden="true">⌖</span>
          <span><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(detail)}</small></span>
          <b aria-hidden="true">›</b>
        </button>`;
      }).join("");

      results.querySelectorAll("[data-search-result]").forEach((button) => {
        button.addEventListener("click", () => {
          const p = places[Number(button.dataset.searchResult)];
          if (!p || typeof window.nimboraLoad !== "function") {
            if (status) status.textContent = "Unable to load this location.";
            return;
          }
          window.nimboraLoad({
            name: p.name,
            latitude: p.latitude,
            longitude: p.longitude,
            timezone: p.timezone || "auto",
            country: p.country || "",
            admin1: p.admin1 || "",
          });
          const overlay = $("#searchOverlay");
          if (overlay) overlay.hidden = true;
        }, { once: true });
      });
    } catch (error) {
      console.error("Nimbora search error:", error);
      if (status) status.textContent = "Search failed. Check your connection and try again.";
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>\"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
    })[m]);
  }

  function init() {
    const form = $("#searchForm");
    if (!form || form.dataset.searchFixReady) return;
    form.dataset.searchFixReady = "1";
    form.addEventListener("submit", submitSearch, true);
  }

  window.nimboraSearchFix = { init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
