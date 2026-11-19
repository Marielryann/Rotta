"use strict";

window.RottaPages = window.RottaPages || {};
window.RottaPages.auth = ({ state, ui }) => {
  const { icon, navLink, pageHeader } = ui;
  const isLogin = state.authMode === "login";

  return `
    <section class="screen screen-public" data-screen="auth">
      ${pageHeader("ENTRADA E CADASTRO", isLogin ? "Entre na sua conta" : "Crie sua conta", "A tela visual está pronta; a autenticação será ativada pelo backend.")}
      <section class="panel form-panel auth-panel" id="auth-panel" role="tabpanel" aria-labelledby="auth-title">
        <div class="tab-list" role="tablist" aria-label="Tipo de acesso">
          <button id="tab-login" type="button" role="tab" aria-controls="auth-panel" aria-selected="${isLogin}" class="tab-button${isLogin ? " is-active" : ""}" data-auth-mode="login">Entrar</button>
          <button id="tab-signup" type="button" role="tab" aria-controls="auth-panel" aria-selected="${!isLogin}" class="tab-button${!isLogin ? " is-active" : ""}" data-auth-mode="signup">Criar conta</button>
        </div>
        <h2 id="auth-title">${isLogin ? "Bom ter você por aqui." : "Vamos criar sua conta."}</h2>
        <p class="form-intro">${isLogin ? "Acesse para acompanhar seus trajetos e informações." : "Preencha seus dados para continuar quando a API estiver disponível."}</p>
        <form id="auth-form" class="stacked-form" novalidate>
          ${!isLogin ? `<label>Nome completo<input name="name" type="text" autocomplete="name" required placeholder="Seu nome"></label>` : ""}
          <label>E-mail<input name="email" type="email" autocomplete="email" required placeholder="voce@exemplo.com"></label>
          <label>Senha<input name="password" type="password" autocomplete="${isLogin ? "current-password" : "new-password"}" required minlength="8" placeholder="Mínimo de 8 caracteres"></label>
          <button class="button button-primary button-wide" type="submit">${isLogin ? "Entrar" : "Criar conta"}</button>
        </form>
        <p class="integration-note">${icon("shield-soft")} Nenhum dado será enviado ou armazenado nesta versão sem backend.</p>
        ${navLink("welcome", "Voltar", "text-link")}
      </section>
    </section>`;
};
