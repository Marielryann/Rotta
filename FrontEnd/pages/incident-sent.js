"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.incidentSent = ({ state, ui }) => {
  const { emptyState, escapeHtml, icon, navLink, pageHeader } = ui;
  const draft = state.incidentDraft;
  const summary = draft
    ? `<dl class="summary-list"><div><dt>Tipo</dt><dd>${escapeHtml(draft.typeLabel)}</dd></div><div><dt>Local</dt><dd>${escapeHtml(draft.location)}</dd></div><div><dt>Descrição</dt><dd>${escapeHtml(draft.description)}</dd></div>${draft.photoName ? `<div><dt>Arquivo selecionado</dt><dd>${escapeHtml(draft.photoName)}</dd></div>` : ""}</dl>`
    : emptyState("Nenhum registro em rascunho", "Preencha o formulário de ocorrência para visualizar os dados nesta tela.", "alert-muted");

  return `
    <section class="screen" data-screen="incident-sent">
      ${pageHeader("REVISÃO DO RELATO", "Detalhes do registro enviado", "Esta tela mostra apenas o rascunho local; ele ainda não foi enviado ao servidor.")}
      <section class="panel sent-panel">
        <div class="sent-heading"><span class="status-pill status-pending">Rascunho local · não enviado</span>${icon("check-circle")}</div>
        ${summary}
        <p class="notice-block">A confirmação definitiva e o número de protocolo serão fornecidos pelo backend após o envio.</p>
        <div class="form-actions">${navLink("incident-form", "Editar rascunho", "button button-secondary")} ${navLink("incidents", "Voltar às ocorrências", "button button-primary")}</div>
      </section>
    </section>`;
};
