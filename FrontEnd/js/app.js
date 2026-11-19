"use strict";

const SCREEN_IDS = Object.freeze([
  "welcome",
  "auth",
  "home",
  "destination",
  "comparison",
  "route-details",
  "tracking",
  "incidents",
  "incident-form",
  "incident-sent",
  "community-incident",
  "wallet",
  "profile"
]);

const PAGE_RENDERERS = Object.freeze({
  welcome: "welcome",
  auth: "auth",
  home: "home",
  destination: "destination",
  comparison: "comparison",
  "route-details": "routeDetails",
  tracking: "tracking",
  incidents: "incidents",
  "incident-form": "incidentForm",
  "incident-sent": "incidentSent",
  "community-incident": "communityIncident",
  wallet: "wallet",
  profile: "profile"
});

const SCREEN_TITLES = Object.freeze({
  welcome: "Boas-vindas",
  auth: "Entrada e cadastro",
  home: "Início",
  destination: "Busca de destino",
  comparison: "Comparação de rotas",
  "route-details": "Detalhes da rota",
  tracking: "Acompanhamento da viagem",
  incidents: "Ocorrências próximas",
  "incident-form": "Registro de ocorrência",
  "incident-sent": "Detalhes do registro enviado",
  "community-incident": "Ocorrência da comunidade",
  wallet: "Carteira de créditos",
  profile: "Perfil e impacto"
});

const state = {
  authMode: "login",
  route: { origin: "", destination: "", modes: ["onibus"], priority: "balanced" },
  incidentDraft: null
};

const screenRoot = document.querySelector("#screen-root");
const appLayout = document.querySelector("#app-layout");
const toast = document.querySelector("#toast");
let toastTimer;

function currentScreen() {
  const requested = window.location.hash.slice(1);
  return SCREEN_IDS.includes(requested) ? requested : "welcome";
}

function render() {
  const screen = currentScreen();
  const renderer = window.RottaPages?.[PAGE_RENDERERS[screen]];

  if (typeof renderer !== "function" || !window.RottaUI) {
    throw new Error(`Tela ou utilitários não carregados para: ${screen}`);
  }

  screenRoot.innerHTML = renderer({ state, ui: window.RottaUI });
  appLayout.classList.toggle("is-public", screen === "welcome" || screen === "auth");
  document.title = `${SCREEN_TITLES[screen]} — Rotta`;

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active = link.dataset.nav === screen;
    link.classList.toggle("is-current", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function navigate(screen) {
  if (!SCREEN_IDS.includes(screen)) return;
  if (window.location.hash === `#${screen}`) render();
  else window.location.hash = screen;
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4500);
}

function selectedModes(form) {
  return [...form.querySelectorAll('input[name="mode"]:checked')].map((input) => input.value);
}

function handleNavigation(event) {
  const link = event.target.closest("[data-nav]");
  if (!link) return;
  event.preventDefault();
  navigate(link.dataset.nav);
}

function handleSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.id === "auth-form") {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.elements.password.value = "";
    announce("Autenticação ainda não conectada; nenhum dado foi enviado.");
    return;
  }

  if (form.id === "home-search-form") {
    event.preventDefault();
    state.route.destination = form.elements.destination.value.trim();
    if (!state.route.destination) {
      announce("Informe um destino para continuar.");
      form.elements.destination.focus();
      return;
    }
    navigate("destination");
    return;
  }

  if (form.id === "route-search-form") {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const modes = selectedModes(form);
    if (!modes.length) {
      announce("Selecione pelo menos um meio de transporte.");
      form.querySelector('input[name="mode"]')?.focus();
      return;
    }

    state.route = {
      origin: form.elements.origin.value.trim(),
      destination: form.elements.destination.value.trim(),
      modes,
      priority: form.elements.priority.value
    };
    navigate("comparison");
    return;
  }

  if (form.id === "incident-form") {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const type = form.elements.type;
    state.incidentDraft = {
      typeLabel: type.options[type.selectedIndex].text,
      location: form.elements.location.value.trim(),
      description: form.elements.description.value.trim(),
      photoName: form.elements.photo.files[0]?.name || ""
    };
    navigate("incident-sent");
  }
}

function handleClick(event) {
  const tab = event.target.closest("[data-auth-mode]");
  if (!tab) return;
  state.authMode = tab.dataset.authMode;
  render();
}

function handleChange(event) {
  if (event.target.matches('input[name="mode"]')) {
    state.route.modes = selectedModes(event.target.form || screenRoot);
  }

  if (event.target.id === "incident-photo") {
    const label = screenRoot.querySelector("#photo-name");
    const file = event.target.files[0];
    if (label) {
      label.textContent = file
        ? `${file.name} — ficará apenas nesta sessão.`
        : "O arquivo ficará apenas nesta sessão; o envio não está ativo.";
    }
  }
}

screenRoot.addEventListener("click", handleNavigation);
screenRoot.addEventListener("click", handleClick);
screenRoot.addEventListener("submit", handleSubmit);
screenRoot.addEventListener("change", handleChange);
document.querySelector(".sidebar-nav").addEventListener("click", handleNavigation);
document.querySelector(".bottom-nav").addEventListener("click", handleNavigation);
document.querySelector(".topbar").addEventListener("click", handleNavigation);
window.addEventListener("hashchange", render);

window.RottaApp = Object.freeze({
  currentScreen,
  navigate,
  pageModules: Object.freeze(Object.keys(window.RottaPages || {})),
  screenIds: SCREEN_IDS
});

render();
