"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.comparison = ({ state, ui }) => {
  const { emptyState, escapeHtml, navLink, pageHeader } = ui;
  const { origin, destination } = state.route;

  return `
    <section class="screen" data-screen="comparison">
      ${pageHeader("OPÇÕES DE TRAJETO", "Compare rotas", "A busca foi registrada nesta sessão; resultados oficiais dependem do backend de transporte.")}
      <section class="panel query-summary" aria-label="Busca atual">
        <div><span class="field-caption">ORIGEM</span><strong>${escapeHtml(origin || "Não informada")}</strong></div>
        <span class="query-arrow" aria-hidden="true">→</span>
        <div><span class="field-caption">DESTINO</span><strong>${escapeHtml(destination || "Não informado")}</strong></div>
        ${navLink("destination", "Editar busca", "button button-secondary")}
      </section>
      <section class="panel results-panel">
        ${emptyState("Nenhuma rota carregada", "A integração com a API ainda não está disponível. Para não apresentar linhas, tarifas ou horários fictícios, esta área permanece vazia.", "route-line")}
        <div class="preview-path-links">
          <p>As próximas telas estão disponíveis para revisão visual:</p>
          ${navLink("route-details", "Ver estrutura dos detalhes", "button button-secondary")}
        </div>
      </section>
    </section>`;
};
