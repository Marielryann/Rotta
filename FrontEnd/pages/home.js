"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.home = ({ state, ui }) => {
  const { icon, modeOptions, navLink, pageHeader, mapPlaceholder } = ui;

  return `
    <section class="screen" data-screen="home">
      <div class="home-heading">
        <div>${pageHeader("SEU RECIFE, NO SEU RITMO", "Bom dia!", "Planeje seu deslocamento e veja os recursos disponíveis na prévia do Rotta.")}</div>
        <form id="home-search-form" class="quick-search" role="search">
          <label class="visually-hidden" for="home-destination">Para onde vamos?</label>
          ${icon("search")}
          <input id="home-destination" name="destination" type="search" placeholder="Para onde vamos?" autocomplete="off">
          <button class="button button-primary" type="submit">Buscar</button>
        </form>
      </div>

      <div class="home-grid">
        <div class="home-main-column">
          <section class="panel map-card" aria-labelledby="home-map-title">
            <div class="section-heading">
              <div><p class="section-kicker">SEU MAPA</p><h2 id="home-map-title">Visualização do trajeto</h2></div>
              <span class="status-pill">Aguardando API</span>
            </div>
            ${mapPlaceholder("Mapa do início")}
          </section>
          <section class="transport-section" aria-labelledby="home-modes-title">
            <div class="section-heading">
              <div><p class="section-kicker">SEU JEITO DE IR</p><h2 id="home-modes-title">Meios de transporte</h2></div>
              <span class="section-hint">Preferências para a busca</span>
            </div>
            <div class="mode-options" role="group" aria-label="Preferências de transporte">${modeOptions(state.route.modes)}</div>
          </section>
        </div>

        <aside class="home-side-column" aria-label="Recursos do Rotta">
          <section class="panel balance-card">
            <p class="section-kicker">CARTEIRA ROTTA</p>
            <p class="balance-value">—</p>
            <p class="muted-copy">Seu saldo será consultado pela API.</p>
            ${navLink("wallet", "Abrir carteira →", "text-link")}
          </section>
          <section class="panel shortcut-card">
            <p class="section-kicker">ATALHOS</p>
            <h2>O que você precisa?</h2>
            <div class="shortcut-list">
              ${navLink("destination", `${icon("route")}<span>Buscar um trajeto</span><span aria-hidden="true">→</span>`, "shortcut-link")}
              ${navLink("incidents", `${icon("alert")}<span>Ocorrências próximas</span><span aria-hidden="true">→</span>`, "shortcut-link")}
              ${navLink("profile", `${icon("user")}<span>Perfil e impacto</span><span aria-hidden="true">→</span>`, "shortcut-link")}
            </div>
          </section>
          <p class="notice-copy">Rotas e dados pessoais não são simulados nesta prévia.</p>
        </aside>
      </div>
    </section>`;
};
