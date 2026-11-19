"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.wallet = ({ ui }) => {
  const { emptyState, icon, pageHeader } = ui;

  return `
    <section class="screen" data-screen="wallet">
      ${pageHeader("SEUS CRÉDITOS", "Carteira Rotta", "Saldo e movimentações serão carregados pela API após a autenticação.")}
      <div class="wallet-grid">
        <section class="balance-card balance-card-large">
          <div class="balance-card-top"><p class="section-kicker">SALDO DISPONÍVEL</p>${icon("wallet-light")}</div>
          <p class="balance-value">—</p>
          <p>O saldo será informado quando a conta estiver conectada.</p>
        </section>
        <section class="panel transaction-panel">
          <div class="section-heading"><div><p class="section-kicker">ATIVIDADE</p><h2>Movimentações recentes</h2></div></div>
          ${emptyState("Sem movimentações", "As transações reais aparecerão aqui quando forem disponibilizadas pelo backend.", "history")}
        </section>
      </div>
      <p class="integration-note">Créditos e benefícios não são simulados nesta prévia.</p>
    </section>`;
};
