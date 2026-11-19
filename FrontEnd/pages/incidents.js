"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.incidents = ({ ui }) => {
  const { emptyState, icon, navLink, pageHeader } = ui;

  return `
    <section class="screen" data-screen="incidents">
      ${pageHeader("COMUNIDADE ROTTA", "Ocorrências próximas", "Avisos enviados pela comunidade serão listados após a conexão com o backend.")}
      <div class="incident-toolbar">
        <label class="search-field">${icon("search")}<span class="visually-hidden">Buscar ocorrências</span><input type="search" id="incident-filter" placeholder="Buscar por local ou tipo" disabled aria-describedby="incident-filter-note"></label>
        <button class="button button-primary" type="button" data-nav="incident-form">Registrar ocorrência</button>
      </div>
      <p class="integration-note" id="incident-filter-note">A busca será habilitada quando as ocorrências reais estiverem disponíveis.</p>
      <section class="panel incident-list-panel">
        ${emptyState("Ainda não há ocorrências para exibir", "A lista será preenchida com relatos da comunidade após a integração. Nenhum aviso está sendo inventado.", "alert-muted")}
        <div class="preview-path-links"><p>Prévia da tela de detalhes:</p>${navLink("community-incident", "Abrir detalhes da comunidade", "button button-secondary")}</div>
      </section>
    </section>`;
};
