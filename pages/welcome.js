"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.welcome = ({ ui }) => {
  const { navLink } = ui;

  return `
    <section class="screen screen-public" data-screen="welcome">
      <div class="welcome-layout">
        <div class="welcome-copy">
          <p class="eyebrow">SEU RECIFE, NO SEU RITMO</p>
          <h1>Seus caminhos pela cidade começam aqui.</h1>
          <p class="page-description">Encontre as telas de busca, acompanhamento e comunidade do Rotta. As informações reais aparecem quando a API de transporte estiver conectada.</p>
          <div class="welcome-actions">
            ${navLink("auth", "Entrar ou criar conta", "button button-primary")}
            ${navLink("home", "Explorar a prévia", "button button-secondary")}
          </div>
        </div>
        <div class="welcome-panel panel">
          <span class="welcome-mark" aria-hidden="true">R</span>
          <p class="eyebrow">MOBILIDADE PARA O RECIFE</p>
          <h2>Mais clareza para planejar o próximo passo.</h2>
          <p>Rotas, ocorrências e créditos serão carregados de fontes conectadas. Esta prévia não inventa horários nem trajetos.</p>
        </div>
      </div>
    </section>`;
};
