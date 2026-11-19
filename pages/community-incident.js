"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.communityIncident = ({ ui }) => {
  const { emptyState, navLink, pageHeader } = ui;

  return `
    <section class="screen" data-screen="community-incident">
      ${pageHeader("COMUNIDADE ROTTA", "Ocorrência da comunidade", "A ficha será preenchida a partir de um relato real selecionado na lista.")}
      <section class="panel detail-card">
        <span class="status-pill">Aguardando dados da API</span>
        ${emptyState("Nenhuma ocorrência selecionada", "Quando houver relatos disponíveis, o local, a descrição, o horário e as atualizações aparecerão aqui.", "alert-muted")}
        ${navLink("incidents", "Voltar às ocorrências", "button button-secondary")}
      </section>
    </section>`;
};
