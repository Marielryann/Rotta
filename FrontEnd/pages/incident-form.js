"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.incidentForm = ({ ui }) => {
  const { icon, navLink, pageHeader } = ui;

  return `
    <section class="screen" data-screen="incident-form">
      ${pageHeader("CONTRIBUA COM A COMUNIDADE", "Registrar ocorrência", "Descreva o que aconteceu. O envio real só será feito quando a API estiver conectada.")}
      <section class="panel form-panel incident-form-panel">
        <form id="incident-form" class="stacked-form">
          <label for="incident-type">Tipo de ocorrência
            <select id="incident-type" name="type" required>
              <option value="">Selecione uma opção</option>
              <option value="atraso">Atraso ou interrupção</option>
              <option value="acessibilidade">Acessibilidade</option>
              <option value="seguranca">Segurança</option>
              <option value="estrutura">Condição da parada ou estação</option>
              <option value="outro">Outro</option>
            </select>
          </label>
          <label for="incident-location">Local da ocorrência<input id="incident-location" name="location" type="text" required placeholder="Rua, parada ou estação"></label>
          <label for="incident-description">Descrição<textarea id="incident-description" name="description" rows="5" required maxlength="800" placeholder="Conte os detalhes relevantes"></textarea></label>
          <label for="incident-photo">Foto (opcional)<input id="incident-photo" name="photo" type="file" accept="image/*"><span class="field-help" id="photo-name">O arquivo ficará apenas nesta sessão; o envio não está ativo.</span></label>
          <div class="form-actions">${navLink("incidents", "Cancelar", "button button-secondary")}<button class="button button-primary" type="submit">Revisar registro</button></div>
        </form>
        <p class="integration-note">${icon("shield-soft")} Não inclua dados pessoais sensíveis. Este formulário não envia arquivos nem relatos.</p>
      </section>
    </section>`;
};
