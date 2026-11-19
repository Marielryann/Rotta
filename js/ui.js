"use strict";

(() => {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function icon(file, className = "") {
    const classAttribute = className ? ` class="${className}"` : "";
    return `<img${classAttribute} src="assets/${file}.svg" alt="" aria-hidden="true">`;
  }

  function navLink(screen, label, className = "button button-secondary") {
    return `<a class="${className}" href="#${screen}" data-nav="${screen}">${label}</a>`;
  }

  function pageHeader(kicker, title, description = "") {
    return `
      <header class="page-heading">
        <p class="eyebrow">${kicker}</p>
        <h1>${title}</h1>
        ${description ? `<p class="page-description">${description}</p>` : ""}
      </header>`;
  }

  function mapPlaceholder(label = "Mapa") {
    return `
      <div class="map-slot" data-map-container role="region" aria-label="${label}, área reservada para integração futura">
        <p class="map-slot-title">Área reservada para o mapa</p>
        <p class="map-slot-copy">Este espaço será preenchido pela API de mapas.</p>
      </div>`;
  }

  function modeOptions(selected = ["onibus"]) {
    const modes = [
      ["onibus", "Ônibus", "bus"],
      ["metro", "Metrô", "train"],
      ["brt", "BRT", "bus-field"],
      ["bicicleta", "Bicicleta", "bike"]
    ];

    return modes.map(([value, label, image]) => `
      <label class="mode-option">
        <input type="checkbox" name="mode" value="${value}"${selected.includes(value) ? " checked" : ""}>
        ${icon(image)}
        <span>${label}</span>
        <span class="mode-check" aria-hidden="true"></span>
      </label>`).join("");
  }

  function emptyState(title, copy, iconName = "search") {
    return `
      <div class="empty-state">
        <span class="empty-state-icon">${icon(iconName)}</span>
        <h2>${title}</h2>
        <p>${copy}</p>
      </div>`;
  }

  window.RottaUI = Object.freeze({
    emptyState,
    escapeHtml,
    icon,
    mapPlaceholder,
    modeOptions,
    navLink,
    pageHeader
  });
})();
