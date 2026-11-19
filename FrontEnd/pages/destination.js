"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.destination = ({ state, ui }) => {
  const { escapeHtml, icon, mapPlaceholder, modeOptions, pageHeader } = ui;

  return `
    <section class="screen" data-screen="destination">
      ${pageHeader("PLANEJE SEU CAMINHO", "Encontre seu destino", "Informe os pontos e escolha os modais. A busca será encaminhada à API quando o backend estiver conectado.")}
      <div class="destination-layout">
        <section class="panel form-panel">
          <form id="route-search-form" class="stacked-form">
            <label for="origin">Origem<input id="origin" name="origin" type="text" required autocomplete="street-address" placeholder="Informe o ponto de partida" value="${escapeHtml(state.route.origin)}"></label>
            <label for="destination-input">Destino<input id="destination-input" name="destination" type="text" required autocomplete="off" placeholder="Para onde vamos?" value="${escapeHtml(state.route.destination)}"></label>
            <fieldset class="mode-fieldset">
              <legend>Meios de transporte</legend>
              <div class="mode-options">${modeOptions(state.route.modes)}</div>
            </fieldset>
            <label class="select-label" for="route-order">Priorizar</label>
            <select id="route-order" name="priority">
              <option value="balanced"${state.route.priority === "balanced" ? " selected" : ""}>Menor tempo e custo</option>
              <option value="time"${state.route.priority === "time" ? " selected" : ""}>Menor tempo</option>
              <option value="cost"${state.route.priority === "cost" ? " selected" : ""}>Menor custo</option>
              <option value="sustainable"${state.route.priority === "sustainable" ? " selected" : ""}>Menor impacto ambiental</option>
            </select>
            <button class="button button-primary button-wide" type="submit">Buscar opções de trajeto</button>
          </form>
          <p class="integration-note">${icon("shield-soft")} Nenhuma estimativa será exibida até a integração com dados reais.</p>
        </section>
        <aside class="destination-aside panel">
          <p class="section-kicker">BUSCA DE DESTINO</p>
          <h2>Você escolhe o caminho.</h2>
          <p class="muted-copy">As sugestões de locais, os horários e os valores dependem da fonte de transporte conectada ao projeto.</p>
          ${mapPlaceholder("Mapa da busca de destino")}
        </aside>
      </div>
    </section>`;
};
