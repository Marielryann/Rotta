"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.profile = ({ ui }) => {
  const { emptyState, navLink, pageHeader } = ui;

  return `
    <section class="screen" data-screen="profile">
      ${pageHeader("SUA CONTA", "Perfil e impacto", "Entre para consultar informações pessoais e contribuições confirmadas.")}
      <div class="profile-grid">
        <section class="panel profile-card">
          <div class="profile-avatar" aria-hidden="true">?</div>
          <div><p class="section-kicker">PERFIL DE VISITANTE</p><h2>Conta não conectada</h2><p class="muted-copy">Seu nome e suas preferências serão carregados pela API.</p></div>
          ${navLink("auth", "Entrar ou criar conta", "button button-primary")}
        </section>
        <section class="panel impact-card">
          <p class="section-kicker">IMPACTO</p>
          <h2>Seus dados de mobilidade</h2>
          ${emptyState("Ainda sem dados", "Contribuições e impacto ambiental serão apresentados quando houver dados reais associados à conta.", "leaf")}
        </section>
      </div>
      <div class="profile-links">${navLink("wallet", "Abrir carteira", "button button-secondary")}${navLink("incidents", "Minhas ocorrências", "button button-secondary")}</div>
    </section>`;
};
