"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.tracking = ({ ui }) => {
  const { emptyState, navLink, pageHeader } = ui;

  return `
    <section class="screen" data-screen="tracking">
      ${pageHeader("ACOMPANHAMENTO", "Acompanhe sua viagem", "O acompanhamento começa quando a API fornecer uma rota ativa e atualizações reais.")}
      <div class="tracking-grid">
        <section class="panel tracking-status-card">
          <span class="status-pill">Nenhuma viagem ativa</span>
          ${emptyState("Pronto para acompanhar", "Quando uma rota válida for selecionada, o status, as paradas e os avisos aparecerão nesta tela.", "compass")}
          <div class="tracking-actions">${navLink("destination", "Buscar trajeto", "button button-primary")}${navLink("incidents", "Ver ocorrências", "button button-secondary")}</div>
        </section>
        <section class="panel map-panel"><p class="section-kicker">MAPA DA VIAGEM</p>${ui.mapPlaceholder("Mapa do acompanhamento")}</section>
      </div>
    </section>`;
};
