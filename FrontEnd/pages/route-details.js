"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.routeDetails = ({ state, ui }) => {
  const { emptyState, escapeHtml, icon, navLink, pageHeader } = ui;

  return `
    <section class="screen" data-screen="route-details">
      ${pageHeader("DETALHES DO TRAJETO", "Detalhes da rota", "Os dados do percurso serão preenchidos após a integração com a API.")}
      <div class="route-detail-grid">
        <section class="panel detail-card">
          <div class="detail-status"><span class="status-pill">Prévia sem dados reais</span>${navLink("comparison", "Voltar às opções", "text-link")}</div>
          <div class="route-endpoints">
            <div><span class="endpoint-dot origin-dot"></span><span><small>ORIGEM</small><strong>${escapeHtml(state.route.origin || "Aguardando API")}</strong></span></div>
            <div class="endpoint-line" aria-hidden="true"></div>
            <div><span class="endpoint-dot destination-dot"></span><span><small>DESTINO</small><strong>${escapeHtml(state.route.destination || "Aguardando API")}</strong></span></div>
          </div>
          ${emptyState("Itinerário indisponível", "Linhas, paradas, tempo e tarifa serão exibidos aqui quando forem retornados por uma fonte oficial.", "bus-soft")}
          <button class="button button-primary button-wide" type="button" data-nav="tracking">Abrir acompanhamento (prévia)</button>
        </section>
        <aside class="panel map-panel">
          <p class="section-kicker">MAPA DO PERCURSO</p>
          ${ui.mapPlaceholder("Mapa dos detalhes da rota")}
        </aside>
      </div>
    </section>`;
};
