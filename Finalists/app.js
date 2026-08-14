const CONFIG_PATH = "data_2/config/config.json";
const LOCALE_MANIFEST_PATH = "data_2/locale/index.json";
const LOCALE_DIRECTORY = "data_2/locale/";
const ASSET_VERSION_STORAGE_KEY = "siteAssetVersion";

const state = {
  config: null,
  locale: null,
  locales: [],
  activeTile: null,
  activeRenderIndex: 0,
  timerInterval: null,
};

const els = {
  pageTitle: document.querySelector("#pageTitle"),
  languageLabel: document.querySelector("#languageLabel"),
  languageSelect: document.querySelector("#languageSelect"),
  discordButton: document.querySelector("#discordButton"),
  votingTimer: document.querySelector("#votingTimer"),
  countdownDisplay: document.querySelector("#countdownDisplay"),
  votingStatus: document.querySelector("#votingStatus"),
  tileGrid: document.querySelector("#tileGrid"),
  renderModal: document.querySelector("#renderModal"),
  modalBackdrop: document.querySelector("#modalBackdrop"),
  modalTitle: document.querySelector("#modalTitle"),
  closeModalButton: document.querySelector("#closeModalButton"),
  renderImage: document.querySelector("#renderImage"),
  previousRenderButton: document.querySelector("#previousRenderButton"),
  nextRenderButton: document.querySelector("#nextRenderButton"),
  renderCounter: document.querySelector("#renderCounter"),
};

function updateVisualViewportHeight() {
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty("--visual-viewport-height", `${Math.floor(viewportHeight)}px`);
}

updateVisualViewportHeight();
window.addEventListener("resize", updateVisualViewportHeight);
window.visualViewport?.addEventListener("resize", updateVisualViewportHeight);
window.visualViewport?.addEventListener("scroll", updateVisualViewportHeight);

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${path}`);
  return response.json();
}

function getVersionedAssetUrl(path) {
  return `${path}?v=${encodeURIComponent(state.config.version)}`;
}

function syncAssetVersion() {
  const currentVersion = String(state.config.version);
  const cachedVersion = localStorage.getItem(ASSET_VERSION_STORAGE_KEY);

  if (cachedVersion !== currentVersion) {
    localStorage.setItem(ASSET_VERSION_STORAGE_KEY, currentVersion);
    return true;
  }

  return false;
}

async function loadLocaleList() {
  // Browsers cannot list a static directory by themselves.
  // The supplied data_2/locale/index.json is the portable locale manifest.
  // If your web server exposes directory listing as JSON, replace this loader.
  const manifest = await fetchJson(LOCALE_MANIFEST_PATH);
  return manifest.locales || [];
}

function chooseInitialLanguage() {
  const saved = localStorage.getItem("siteLanguage");
  if (saved && state.locales.includes(saved)) return saved;

  const browserCodes = navigator.languages || [navigator.language || "en"];
  for (const raw of browserCodes) {
    const exact = raw.toLowerCase();
    const base = exact.split("-")[0];
    if (state.locales.includes(exact)) return exact;
    if (state.locales.includes(base)) return base;
  }

  return state.locales.includes("en") ? "en" : state.locales[0];
}

function t(key, fallback = key) {
  return state.locale?.[key] ?? fallback;
}

async function setLanguage(language) {
  state.locale = await fetchJson(`${LOCALE_DIRECTORY}${language}.json`);
  localStorage.setItem("siteLanguage", language);
  document.documentElement.lang = language;
  els.languageSelect.value = language;
  renderLocalizedText();
  renderTiles();
  updateModal();
}

function renderLocalizedText() {
  document.title = t("siteTitle", "Camo Selector");
  els.pageTitle.textContent = t("pageTitle", "Camo Selector");
  els.languageLabel.textContent = t("language", "Language");
  els.discordButton.textContent = t("discordButton", "Discord");
  els.discordButton.href = t("discordUrl", "#");
  els.discordButton.setAttribute("aria-label", t("discordButton", "Discord"));
  els.previousRenderButton.textContent = t("previous", "Previous");
  els.nextRenderButton.textContent = t("next", "Next");
  els.closeModalButton.setAttribute("aria-label", t("close", "Close"));
  els.modalBackdrop.setAttribute("aria-label", t("close", "Close"));
  updateVotingTimer();
}

function buildLanguageSwitcher() {
  els.languageSelect.innerHTML = "";
  for (const code of state.locales) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code.toUpperCase();
    els.languageSelect.append(option);
  }
}


function formatCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return days > 0 ? `${days}:${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
}

function updateVotingTimer() {
  if (!state.config || !state.locale) return;

  const timerConfig = state.config.votingTimer || {};
  const option = timerConfig.option;

  if (option === 1) {
    els.countdownDisplay.hidden = false;
    els.countdownDisplay.textContent = "00:00:00";
    els.votingStatus.textContent = t("votingNotStarted", "Voting has not started yet");
    return;
  }

  if (option === 2) {
    const endTime = Date.parse(timerConfig.endTime);

    if (!Number.isFinite(endTime)) {
      els.countdownDisplay.hidden = false;
      els.countdownDisplay.textContent = "00:00:00";
      els.votingStatus.textContent = t("votingNotStarted", "Voting has not started yet");
      return;
    }

    const remaining = endTime - Date.now();

    if (remaining <= 0) {
      els.countdownDisplay.hidden = true;
      els.votingStatus.textContent = t("votingEnded", "Voting has ended.");
      return;
    }

    els.countdownDisplay.hidden = false;
    els.countdownDisplay.textContent = formatCountdown(remaining);
    els.votingStatus.textContent = t("votingActive", "Voting has begun, vote in the discord server!");
  }
}

function startVotingTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }

  updateVotingTimer();

  if (state.config?.votingTimer?.option === 2) {
    state.timerInterval = setInterval(updateVotingTimer, 1000);
  }
}

function renderTiles() {
  els.tileGrid.innerHTML = "";

  for (const tile of state.config.tiles) {
    const card = document.createElement("article");
    card.className = "tile-card";

    const imageButton = document.createElement("button");
    imageButton.type = "button";
    imageButton.className = "tile-image-button";
    imageButton.setAttribute("aria-label", `${t("viewRenders", "View renders")}: ${tile.name}`);
    imageButton.addEventListener("click", () => openModal(tile));

    const image = document.createElement("img");
    image.src = getVersionedAssetUrl(`data_2/tile/${tile.tileImage}`);
    image.alt = tile.name;
    image.loading = "lazy";
    imageButton.append(image);

    const info = document.createElement("div");
    info.className = "tile-info";
    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = tile.name;

    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.className = "tile-view-button";
    viewButton.textContent = t("view", "View");
    viewButton.setAttribute("aria-label", `${t("viewRenders", "View renders")}: ${tile.name}`);
    viewButton.addEventListener("click", () => openModal(tile));

    info.append(name, viewButton);
    card.append(imageButton, info);
    els.tileGrid.append(card);
  }
}

function openModal(tile) {
  state.activeTile = tile;
  state.activeRenderIndex = 0;
  els.renderModal.hidden = false;
  document.body.style.overflow = "hidden";
  updateModal();
  els.closeModalButton.focus();
}

function closeModal() {
  els.renderModal.hidden = true;
  document.body.style.overflow = "";
  state.activeTile = null;
}

function updateModal() {
  if (!state.activeTile || els.renderModal.hidden) return;

  const renders = state.activeTile.renders;
  const count = renders.length;
  state.activeRenderIndex = ((state.activeRenderIndex % count) + count) % count;

  els.modalTitle.textContent = state.activeTile.name;
  els.renderImage.src = getVersionedAssetUrl(`data_2/render/${renders[state.activeRenderIndex]}`);
  els.renderImage.alt = `${state.activeTile.name} ${t("render", "render")} ${state.activeRenderIndex + 1}`;
  els.renderCounter.textContent = `${state.activeRenderIndex + 1} / ${count}`;
  els.previousRenderButton.disabled = count < 2;
  els.nextRenderButton.disabled = count < 2;
}

function changeRender(delta) {
  if (!state.activeTile) return;
  state.activeRenderIndex += delta;
  updateModal();
}

function validateConfig(config) {
  if (typeof config.version !== "number" || !Number.isFinite(config.version)) {
    throw new Error("config.version must be a number.");
  }
  if (!config.votingTimer || ![1, 2].includes(config.votingTimer.option)) {
    throw new Error("config.votingTimer.option must be 1 or 2.");
  }
  if (config.votingTimer.option === 2 && !Number.isFinite(Date.parse(config.votingTimer.endTime))) {
    throw new Error("config.votingTimer.endTime must be a valid date/time when option is 2.");
  }
  if (!Array.isArray(config.tiles)) throw new Error("config.tiles must be an array.");
  for (const tile of config.tiles) {
    if (!tile.name || !tile.tileImage || !Array.isArray(tile.renders)) {
      throw new Error("Every tile needs name, tileImage, and renders.");
    }
    if (tile.renders.length !== 2) {
      throw new Error(`Tile ${tile.id} must have exactly two render images.`);
    }
  }
}

async function init() {
  try {
    const [config, locales] = await Promise.all([
      fetchJson(CONFIG_PATH),
      loadLocaleList(),
    ]);

    validateConfig(config);
    state.config = config;
    syncAssetVersion();
    state.locales = locales;

    if (!state.locales.length) throw new Error("No locale files are listed in data_2/locale/index.json.");

    buildLanguageSwitcher();
    await setLanguage(chooseInitialLanguage());
    startVotingTimer();
  } catch (error) {
    console.error(error);
    els.tileGrid.innerHTML = `<div class="error-message">${error.message}</div>`;
  }
}

els.languageSelect.addEventListener("change", event => setLanguage(event.target.value));
els.modalBackdrop.addEventListener("click", closeModal);
els.closeModalButton.addEventListener("click", closeModal);
els.previousRenderButton.addEventListener("click", () => changeRender(-1));
els.nextRenderButton.addEventListener("click", () => changeRender(1));

document.addEventListener("keydown", event => {
  if (els.renderModal.hidden) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") changeRender(-1);
  if (event.key === "ArrowRight") changeRender(1);
});

init();
