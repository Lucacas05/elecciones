import { QUESTIONS, buildCandidates, calculateCandidateScore, isQuestionnaireComplete } from './quiz-core.js';

const QUESTION_KEY = 'elecciones:questionnaireAnswers';
const CANDIDATES = buildCandidates(window.__CANDIDATOS_DATA__ || []);

// ── DOM References ────────────────────────────────────────────────────────────

const form = document.getElementById('questionnaire-form');
const topMatch = document.getElementById('top-match');
const resultsList = document.getElementById('results-list');
const issueBreakdown = document.getElementById('issue-breakdown');
const answersCount = document.getElementById('answers-count');
const previousButton = document.getElementById('previous-button');
const submitButton = document.getElementById('submit-button');
const resetButton = document.getElementById('reset-button');
const questionProgressLabel = document.getElementById('question-progress-label');
const questionProgressHelper = document.getElementById('question-progress-helper');
const quizProgressBar = document.getElementById('quiz-progress-bar');
const polymarketBoard = document.getElementById('polymarket-board');
const polymarketMeta = document.getElementById('polymarket-meta');
const polymarketStatus = document.getElementById('polymarket-status');
const polymarketRefreshButton = document.getElementById('polymarket-refresh');

// ── Polymarket Live Market ───────────────────────────────────────────────────

const POLYMARKET_API_URL = '/api/polymarket/peru-election.json';
const POLYMARKET_WS_URL = 'wss://ws-subscriptions-clob.polymarket.com/ws/market';
const POLYMARKET_POLL_INTERVAL_MS = 120000;
const compactUsdFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const usdFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const percentFormatter = new Intl.NumberFormat('es-PE', {
  style: 'percent',
  maximumFractionDigits: 1,
});
const numberFormatter = new Intl.NumberFormat('es-PE', {
  maximumFractionDigits: 1,
});
const dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

let polymarketSnapshot = null;
let polymarketSocket = null;
let polymarketReconnectTimer = null;
let polymarketPollTimer = null;
let polymarketRenderTimer = null;
let polymarketHeartbeatTimer = null;
const POLYMARKET_MAX_MIDPOINT_SPREAD = 0.1;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatUsd(value, compact = false) {
  const amount = Number(value ?? 0);
  return compact ? compactUsdFormatter.format(amount) : usdFormatter.format(amount);
}

function formatProbability(value) {
  return percentFormatter.format((Number(value ?? 0)) / 100);
}

function formatChange(value) {
  const amount = Number(value ?? 0);
  const sign = amount > 0 ? '+' : '';
  return `${sign}${numberFormatter.format(amount)} pp`;
}

function formatSnapshotDate(value) {
  if (!value) return 'sin hora disponible';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'sin hora disponible';
  return dateTimeFormatter.format(date);
}

function getPolymarketSourceState(snapshot = polymarketSnapshot) {
  switch (snapshot?.servedFrom) {
    case 'cache':
      return {
        label: 'Último dato válido',
        tone: 'sync',
        bannerTitle: 'Mostrando último dato válido guardado',
        bannerBody: 'Polymarket no respondió en este intento. Conservamos el snapshot persistido más reciente para que el Top 3 siga visible.',
      };
    case 'seed':
      return {
        label: 'Respaldo',
        tone: 'error',
        bannerTitle: 'Mostrando respaldo temporal',
        bannerBody: 'Estamos usando un respaldo local mientras vuelve la conexión con Polymarket. Los valores pueden no reflejar el mercado actual.',
      };
    default:
      return {
        label: 'En vivo',
        tone: 'live',
        bannerTitle: '',
        bannerBody: '',
      };
  }
}

function setPolymarketStatus(label, tone = 'idle') {
  if (!polymarketStatus) return;

  const toneClass =
    tone === 'live'
      ? 'bg-emerald-500'
      : tone === 'error'
        ? 'bg-rose-500'
        : 'bg-amber-500';

  polymarketStatus.innerHTML = `
    <span class="h-2 w-2 rounded-full ${toneClass}"></span>
    ${escapeHtml(label)}
  `;
}

function setPolymarketStatusFromSnapshot(snapshot = polymarketSnapshot) {
  const sourceState = getPolymarketSourceState(snapshot);
  setPolymarketStatus(sourceState.label, sourceState.tone);
}

function sortPolymarketCandidates() {
  if (!polymarketSnapshot) return;
  polymarketSnapshot.candidates.sort((a, b) => {
    if (b.probability !== a.probability) return b.probability - a.probability;
    if (b.volume24h !== a.volume24h) return b.volume24h - a.volume24h;
    return a.name.localeCompare(b.name, 'es');
  });
}

function schedulePolymarketRender() {
  if (polymarketRenderTimer || !polymarketSnapshot) return;

  polymarketRenderTimer = window.setTimeout(() => {
    polymarketRenderTimer = null;
    renderPolymarketBoard();
  }, 120);
}

function renderPolymarketBoard() {
  if (!polymarketBoard || !polymarketSnapshot) return;

  sortPolymarketCandidates();
  const podium = polymarketSnapshot.candidates.slice(0, 3);
  const leader = podium[0];
  const sourceState = getPolymarketSourceState();

  if (!leader) {
    polymarketBoard.innerHTML = `
      <article class="rounded-[1.75rem] border border-outline-variant/10 bg-surface p-6 md:p-7">
        <p class="text-lg font-bold text-primary">No hay datos activos de Polymarket para este mercado.</p>
      </article>
    `;
    return;
  }

  const podiumMarkup = podium
    .map((candidate, index) => `
      <article class="rounded-xl border border-outline-variant/10 bg-surface-container-low px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <span class="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-surface px-2.5 text-sm font-bold text-primary">
              ${index + 1}
            </span>
            <div class="min-w-0">
              <h3 class="truncate text-base font-semibold leading-tight text-primary md:text-lg">
                ${escapeHtml(candidate.name)}
              </h3>
            </div>
          </div>
          <span class="text-xl font-semibold tabular-nums text-primary md:text-2xl">
            ${formatProbability(candidate.probability)}
          </span>
        </div>
      </article>
    `)
    .join('');

  const fallbackNotice = polymarketSnapshot.stale
    ? `
      <div class="rounded-[1.5rem] border ${polymarketSnapshot.servedFrom === 'seed' ? 'border-amber-200 bg-amber-50' : 'border-sky-200 bg-sky-50'} px-5 py-4">
        <p class="text-sm font-bold text-primary">${escapeHtml(sourceState.bannerTitle)}</p>
        <p class="mt-1 text-sm leading-6 text-on-surface-variant">${escapeHtml(sourceState.bannerBody)}</p>
      </div>
    `
    : '';

  polymarketBoard.innerHTML = `
    <article class="rounded-[1.5rem] border border-outline-variant/10 bg-surface px-5 py-6 md:px-6">
      <div class="flex flex-col gap-5">
        ${fallbackNotice}
        <div class="border-b border-outline-variant/10 pb-4">
          <div class="space-y-1">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary/55">Top 3</p>
            <h3 class="text-lg font-semibold text-primary">
              ${escapeHtml(leader.name)} lidera
            </h3>
          </div>
        </div>

        <div class="space-y-3">
          ${podiumMarkup}
        </div>
      </div>
    </article>
  `;
}

function parseMarketPrice(value) {
  const parsed = Number(value ?? NaN);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 0 || parsed > 1) return null;
  return parsed;
}

function getSpread(bestBid, bestAsk) {
  const bid = parseMarketPrice(bestBid);
  const ask = parseMarketPrice(bestAsk);
  if (bid === null || ask === null || ask < bid) return null;
  return ask - bid;
}

function resolveDisplayProbability({ bestBid, bestAsk, lastTradePrice, fallbackProbability = null } = {}) {
  const bid = parseMarketPrice(bestBid);
  const ask = parseMarketPrice(bestAsk);
  const last = parseMarketPrice(lastTradePrice);
  const spread = getSpread(bestBid, bestAsk);

  if (bid !== null && ask !== null && spread !== null && spread <= POLYMARKET_MAX_MIDPOINT_SPREAD) {
    return ((bid + ask) / 2) * 100;
  }

  if (last !== null) {
    return last * 100;
  }

  return Number.isFinite(fallbackProbability) ? fallbackProbability : null;
}

function updatePolymarketCandidate(assetId, nextValues = {}) {
  if (!polymarketSnapshot) return;

  const candidate = polymarketSnapshot.candidates.find((item) => item.yesTokenId === assetId);
  if (!candidate) return;

  const nextProbability = Number(nextValues.probability);
  const nextBestBid = parseMarketPrice(nextValues.bestBid);
  const nextBestAsk = parseMarketPrice(nextValues.bestAsk);
  const nextLastTradePrice = parseMarketPrice(nextValues.lastTradePrice);
  let didChange = false;

  if (Number.isFinite(nextProbability)) {
    const boundedProbability = Math.max(0, Math.min(100, nextProbability));
    if (candidate.probability !== boundedProbability) {
      candidate.probability = boundedProbability;
      didChange = true;
    }
  }

  if (nextBestBid !== null && candidate.bestBid !== nextBestBid * 100) {
    candidate.bestBid = nextBestBid * 100;
    didChange = true;
  }

  if (nextBestAsk !== null && candidate.bestAsk !== nextBestAsk * 100) {
    candidate.bestAsk = nextBestAsk * 100;
    didChange = true;
  }

  if (nextLastTradePrice !== null && candidate.lastTradePrice !== nextLastTradePrice * 100) {
    candidate.lastTradePrice = nextLastTradePrice * 100;
    didChange = true;
  }

  if (!didChange) return;

  if (polymarketSnapshot.servedFrom !== 'live') {
    polymarketSnapshot.servedFrom = 'live';
    polymarketSnapshot.stale = false;
    polymarketSnapshot.staleReason = 'none';
    polymarketSnapshot.fetchedAt = new Date().toISOString();
    setPolymarketStatus('En vivo', 'live');
  }

  polymarketSnapshot.updatedAt = new Date().toISOString();
  schedulePolymarketRender();
}

function handlePolymarketMessage(message) {
  if (!message || typeof message !== 'object') return;

  if (message.event_type === 'best_bid_ask') {
    const spread = getSpread(message.best_bid, message.best_ask);
    if (spread === null || spread > POLYMARKET_MAX_MIDPOINT_SPREAD) return;

    const nextProbability = resolveDisplayProbability({
      bestBid: message.best_bid,
      bestAsk: message.best_ask,
    });

    if (nextProbability !== null) {
      updatePolymarketCandidate(message.asset_id, {
        probability: nextProbability,
        bestBid: message.best_bid,
        bestAsk: message.best_ask,
      });
    }
    return;
  }

  if (message.event_type === 'last_trade_price') {
    const nextLastTradePrice = parseMarketPrice(message.price);
    if (nextLastTradePrice === null) return;

    updatePolymarketCandidate(message.asset_id, {
      probability: nextLastTradePrice * 100,
      lastTradePrice: message.price,
    });
    return;
  }

  if (message.event_type === 'book') {
    const bestBid = Array.isArray(message.bids) && message.bids.length ? message.bids[0]?.price : 0;
    const bestAsk = Array.isArray(message.asks) && message.asks.length ? message.asks[0]?.price : 0;

    updatePolymarketCandidate(message.asset_id, {
      bestBid,
      bestAsk,
      lastTradePrice: message.last_trade_price,
    });

    return;
  }

  if (message.event_type === 'price_change' && Array.isArray(message.price_changes)) {
    message.price_changes.forEach((change) => {
      const nextProbability = resolveDisplayProbability({
        bestBid: change.best_bid,
        bestAsk: change.best_ask,
        lastTradePrice: change.price,
      });

      if (nextProbability === null) return;

      updatePolymarketCandidate(change.asset_id, {
        probability: nextProbability,
        bestBid: change.best_bid,
        bestAsk: change.best_ask,
        lastTradePrice: change.price,
      });
    });
  }
}

function clearPolymarketSocketState() {
  window.clearInterval(polymarketHeartbeatTimer);
  polymarketHeartbeatTimer = null;
}

function connectPolymarketSocket() {
  if (!polymarketSnapshot?.candidates?.length || !('WebSocket' in window)) return;
  if (polymarketSocket && (polymarketSocket.readyState === WebSocket.OPEN || polymarketSocket.readyState === WebSocket.CONNECTING)) return;

  const assetIds = polymarketSnapshot.candidates.map((candidate) => candidate.yesTokenId);
  polymarketSocket = new WebSocket(POLYMARKET_WS_URL);

  polymarketSocket.addEventListener('open', () => {
    setPolymarketStatusFromSnapshot();
    polymarketSocket?.send(
      JSON.stringify({
        assets_ids: assetIds,
        type: 'market',
        custom_feature_enabled: true,
      }),
    );

    clearPolymarketSocketState();
    polymarketHeartbeatTimer = window.setInterval(() => {
      if (polymarketSocket?.readyState === WebSocket.OPEN) {
        polymarketSocket.send('PING');
      }
    }, 10000);
  });

  polymarketSocket.addEventListener('message', (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload === 'PONG' || payload === 'PING') return;
      if (Array.isArray(payload)) {
        payload.forEach(handlePolymarketMessage);
      } else {
        handlePolymarketMessage(payload);
      }
    } catch (_) {
      // noop
    }
  });

  polymarketSocket.addEventListener('error', () => {
    if (polymarketSnapshot?.servedFrom === 'live') {
      setPolymarketStatus('Reconectando', 'sync');
    }
  });

  polymarketSocket.addEventListener('close', () => {
    polymarketSocket = null;
    clearPolymarketSocketState();
    if (polymarketSnapshot?.servedFrom === 'live') {
      setPolymarketStatus('Reconectando', 'sync');
    } else {
      setPolymarketStatusFromSnapshot();
    }

    window.clearTimeout(polymarketReconnectTimer);
    polymarketReconnectTimer = window.setTimeout(() => {
      connectPolymarketSocket();
    }, 3000);
  });
}

async function loadPolymarketData({ silent = false } = {}) {
  if (!polymarketBoard) return;

  if (!silent) setPolymarketStatus('Actualizando', 'sync');

  try {
    const response = await fetch(POLYMARKET_API_URL, { cache: 'no-store' });
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('La ruta /api/polymarket no existe en este entorno. Ejecuta la app con Astro/Node (npm run dev) o despliega en Vercel, no como sitio estático.');
      }
      throw new Error(payload?.message || 'No se pudo cargar Polymarket.');
    }

    if (!payload) {
      throw new Error('El endpoint de Polymarket no devolvió JSON. Revisa que la app esté corriendo con Astro y no desde un servidor estático.');
    }

    polymarketSnapshot = payload;
    renderPolymarketBoard();
    connectPolymarketSocket();
    setPolymarketStatusFromSnapshot();
  } catch (error) {
    if (polymarketSnapshot) {
      setPolymarketStatusFromSnapshot();
      if (polymarketMeta) {
        polymarketMeta.textContent = error?.message || 'No fue posible actualizar el mercado en este momento.';
      }
      return;
    }

    setPolymarketStatus('Sin datos', 'error');

    if (polymarketBoard) {
      polymarketBoard.innerHTML = `
        <article class="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 md:p-7 lg:col-span-2">
          <p class="font-headline text-2xl font-extrabold text-primary">No pudimos conectar con Polymarket</p>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">${escapeHtml(error?.message || 'Vuelve a intentar en unos segundos.')}</p>
          <a href="https://polymarket.com/es/event/peru-presidential-election-winner" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4">Abrir el mercado original<span class="material-symbols-outlined text-base">open_in_new</span></a>
        </article>
      `;
    }

    if (polymarketMeta) {
      polymarketMeta.textContent = error?.message || 'No fue posible actualizar el mercado en este momento.';
    }
  }
}

polymarketRefreshButton?.addEventListener('click', () => {
  loadPolymarketData();
});

loadPolymarketData();
polymarketPollTimer = window.setInterval(() => loadPolymarketData({ silent: true }), POLYMARKET_POLL_INTERVAL_MS);

// ── Answer State ──────────────────────────────────────────────────────────────

function getDefaultAnswers() {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, null]));
}

function clampAnswer(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return Math.max(1, Math.min(3, parsed));
}

function loadAnswers() {
  const defaults = getDefaultAnswers();
  const saved = localStorage.getItem(QUESTION_KEY);
  if (!saved) return defaults;

  try {
    const parsed = JSON.parse(saved);
    return QUESTIONS.reduce((acc, q) => {
      const val = parsed[q.id];
      acc[q.id] = val != null ? clampAnswer(val) : null;
      return acc;
    }, {});
  } catch (_) {
    return defaults;
  }
}

let currentAnswers = loadAnswers();
let currentQuestionIndex = getInitialQuestionIndex();

function persistAnswers() {
  localStorage.setItem(QUESTION_KEY, JSON.stringify(currentAnswers));
}

function answerLabel(question, value) {
  if (value === null) return 'Sin responder';
  const option = question.options.find((o) => o.value === value);
  return option ? option.label : 'Sin responder';
}

function getFirstUnansweredIndex(answers = currentAnswers) {
  const index = QUESTIONS.findIndex((question) => answers[question.id] === null);
  return index === -1 ? QUESTIONS.length - 1 : index;
}

function getInitialQuestionIndex() {
  return getFirstUnansweredIndex();
}

function clampQuestionIndex(index) {
  return Math.min(Math.max(index, 0), QUESTIONS.length - 1);
}

function setCurrentQuestionIndex(index) {
  currentQuestionIndex = clampQuestionIndex(index);
}

function focusCurrentQuestion() {
  if (!form) return;
  const input =
    form.querySelector('input[type="radio"]:checked') ??
    form.querySelector('input[type="radio"]');

  if (input instanceof HTMLInputElement) {
    input.focus({ preventScroll: true });
  }
}

// ── Quiz Rendering ────────────────────────────────────────────────────────────

function buildQuestionMarkup(question, value, index) {
  const optionsHtml = question.options
    .map(
      (option) => `
        <label class="quiz-option ${value === option.value ? 'is-selected' : ''}">
          <input
            class="sr-only"
            type="radio"
            name="${question.id}"
            value="${option.value}"
            ${value === option.value ? 'checked' : ''}
          />
          <span class="quiz-radio" aria-hidden="true"></span>
          <span class="quiz-option-label">${option.label}</span>
        </label>
      `,
    )
    .join('');

  return `
    <fieldset class="quiz-card">
      <div class="quiz-card-header">
        <span class="quiz-card-number">${index + 1}</span>
        <div class="quiz-card-meta">
          <p class="quiz-card-title">${question.title}</p>
          <p class="quiz-card-prompt">${question.prompt}</p>
        </div>
        ${value !== null ? '<span class="quiz-card-check"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3 4.3a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L6.6 9.6l5.3-5.3a1 1 0 0 1 1.4 0Z" fill="currentColor"/></svg></span>' : ''}
      </div>
      <div class="quiz-options-list">${optionsHtml}</div>
    </fieldset>
  `;
}

function countAnswered() {
  return QUESTIONS.filter((q) => currentAnswers[q.id] !== null).length;
}

function updateQuizStatus() {
  const complete = isQuestionnaireComplete(currentAnswers);
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentAnswer = currentAnswers[currentQuestion.id];

  if (answersCount) {
    answersCount.textContent = `${countAnswered()}/${QUESTIONS.length}`;
  }

  if (questionProgressLabel) {
    questionProgressLabel.textContent = `Pregunta ${currentQuestionIndex + 1} de ${QUESTIONS.length}`;
  }

  if (questionProgressHelper) {
    questionProgressHelper.textContent = complete
      ? 'Ya terminaste. Puedes revisar respuestas, volver atrás o ver tus resultados.'
      : currentAnswer === null
        ? currentQuestionIndex === QUESTIONS.length - 1
          ? 'Última pregunta: al responderla podrás ver tus resultados.'
          : 'Elige una opción y pasarás automáticamente a la siguiente.'
        : currentQuestionIndex === 0
          ? 'Respuesta guardada. Puedes cambiarla cuando quieras y seguir respondiendo.'
          : 'Respuesta guardada. Puedes volver a la anterior si quieres ajustar algo.';
  }

  if (quizProgressBar) {
    quizProgressBar.style.width = `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%`;
  }

  if (previousButton) {
    const canGoBack = currentQuestionIndex > 0;
    previousButton.disabled = !canGoBack;
    previousButton.setAttribute('aria-disabled', String(!canGoBack));
  }

  if (submitButton) {
    submitButton.disabled = !complete;
    submitButton.setAttribute('aria-disabled', String(!complete));
  }
}

function renderQuestions() {
  if (!form) return;
  const question = QUESTIONS[currentQuestionIndex];
  form.innerHTML = buildQuestionMarkup(question, currentAnswers[question.id], currentQuestionIndex);
  updateQuizStatus();
}

// ── Results Rendering ─────────────────────────────────────────────────────────

function renderTopMatch(ranking) {
  if (!topMatch || !ranking.length) return;

  const best = ranking[0];
  const next = ranking[1];
  const gap = next ? best.score - next.score : 0;

  topMatch.innerHTML = `
    <div class="relative z-10 space-y-6">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div class="space-y-3">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-white/70">Resultado principal</p>
          <div class="flex items-center gap-4">
            <img
              src="${best.photo}"
              alt="${best.name}"
              class="w-16 h-16 rounded-full object-cover border-2 border-white/30 bg-white/10"
              onerror="this.style.display='none'"
            />
            <div>
              <h2 class="font-headline text-3xl md:text-4xl font-extrabold tracking-tight">${best.name}</h2>
              <p class="text-white/80 text-sm mt-1">${best.party}</p>
            </div>
          </div>
          <p class="text-sm md:text-base leading-7 text-white/82 max-w-2xl">${best.profession} · ${best.experience}</p>
        </div>
        <div class="score-orb shrink-0">
          <span class="score-orb__value">${best.score}%</span>
          <span class="score-orb__label">afinidad</span>
        </div>
      </div>

      <div class="grid md:grid-cols-[1.2fr_0.8fr] gap-4 items-start">
        <div class="bg-white/8 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-3">Coincidencias más fuertes</p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${best.strongestMatches
              .map(
                (issue) =>
                  `<span class="px-3 py-2 rounded-full bg-white/12 text-sm font-semibold">${issue.question.title} · ${issue.affinity}%</span>`,
              )
              .join('')}
          </div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-2 mt-4">Propuestas clave</p>
          <ul class="space-y-1.5">
            ${best.proposals
              .map(
                (p) =>
                  `<li class="text-sm text-white/80 leading-6 flex gap-2"><span class="text-white/40 shrink-0">→</span>${p}</li>`,
              )
              .join('')}
          </ul>
        </div>

        <div class="bg-white text-primary rounded-2xl p-5">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-2">Lectura rápida</p>
          <p class="font-headline text-xl font-extrabold mb-2">${gap > 0 ? `${gap} puntos por encima del segundo lugar` : 'Empate técnico entre primeros puestos'}</p>
          <p class="text-sm text-on-surface-variant leading-6">
            Tu perfil actual se acerca más a esta candidatura según los diez ejes analizados.
          </p>
          <p class="text-xs text-on-surface-variant mt-3">${best.keyFact}</p>
        </div>
      </div>
    </div>
  `;
}

function renderResultsList(ranking) {
  if (!resultsList) return;

  const INITIAL_VISIBLE = 10;
  const hasMore = ranking.length > INITIAL_VISIBLE;

  const cardHtml = ranking
    .map((candidate, index) => {
      const isTop3 = index < 3;
      const isHidden = index >= INITIAL_VISIBLE;

      if (isTop3) {
        return `
          <article class="result-card rounded-2xl border border-outline-variant/10 bg-surface-container-low p-5 ${isHidden ? 'hidden ranking-extra' : ''}">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div class="space-y-3">
                <div class="flex items-center flex-wrap gap-3">
                  <span class="inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-full bg-white text-primary font-headline font-extrabold">${index + 1}</span>
                  <img
                    src="${candidate.photo}"
                    alt="${candidate.name}"
                    class="w-10 h-10 rounded-full object-cover border border-outline-variant/20 bg-surface-container"
                    onerror="this.style.display='none'"
                  />
                  <div>
                    <h3 class="font-headline text-xl font-extrabold text-primary">${candidate.name}</h3>
                    <p class="text-sm text-on-surface-variant">${candidate.party}</p>
                  </div>
                </div>
                <p class="text-sm text-on-surface-variant leading-6 max-w-2xl">${candidate.profession} · ${candidate.experience}</p>
                <div class="flex flex-wrap gap-2">
                  ${candidate.strongestMatches
                    .map(
                      (m) =>
                        `<span class="px-3 py-1.5 rounded-full bg-white text-primary text-[11px] font-bold uppercase tracking-[0.18em]">${m.question.title} ${m.affinity}%</span>`,
                    )
                    .join('')}
                </div>
              </div>

              <div class="md:w-56 shrink-0 space-y-3">
                <div class="flex items-center justify-between text-sm font-semibold text-primary">
                  <span>Afinidad</span>
                  <span>${candidate.score}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-track__fill" style="width:${candidate.score}%"></div>
                </div>
                <p class="text-xs text-on-surface-variant">${candidate.exactMatches} coincidencia${candidate.exactMatches !== 1 ? 's' : ''} exacta${candidate.exactMatches !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </article>
        `;
      }

      return `
        <div class="flex items-center gap-4 py-3 border-b border-outline-variant/8 ${isHidden ? 'hidden ranking-extra' : ''}" data-ranking-row>
          <span class="w-8 text-center font-bold text-sm text-on-surface-variant shrink-0">${index + 1}</span>
          <img
            src="${candidate.photo}"
            alt="${candidate.name}"
            class="w-8 h-8 rounded-full object-cover border border-outline-variant/20 bg-surface-container shrink-0"
            onerror="this.style.display='none'"
          />
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-primary text-sm truncate">${candidate.name}</h4>
            <p class="text-xs text-on-surface-variant truncate">${candidate.party}</p>
          </div>
          <div class="w-36 flex items-center gap-2 shrink-0">
            <div class="progress-track progress-track--compact flex-1">
              <div class="progress-track__fill" style="width:${candidate.score}%"></div>
            </div>
            <span class="text-sm font-bold text-primary w-10 text-right">${candidate.score}%</span>
          </div>
        </div>
      `;
    })
    .join('');

  const toggleBtn = hasMore
    ? `<button
        id="toggle-ranking"
        class="mt-4 w-full text-center py-3 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        onclick="document.querySelectorAll('.ranking-extra').forEach(el=>el.classList.toggle('hidden'));this.textContent=this.textContent.includes('Ver')? 'Ocultar candidatos':'Ver todos los candidatos (${ranking.length})';"
      >Ver todos los candidatos (${ranking.length})</button>`
    : '';

  resultsList.innerHTML = cardHtml + toggleBtn;
}

function renderIssueBreakdown(ranking) {
  if (!issueBreakdown) return;

  const topThree = ranking.slice(0, 3);

  issueBreakdown.innerHTML = QUESTIONS.map((question) => {
    const answer = currentAnswers[question.id];
    const comparisons = topThree
      .map((candidate) => {
        const issue = candidate.issueScores.find((entry) => entry.question.id === question.id);
        return `
          <div class="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
            <div class="flex items-center justify-between gap-3 mb-2">
              <span class="font-headline font-bold text-primary text-sm">${candidate.name}</span>
              <span class="text-sm font-bold text-primary">${issue.affinity}%</span>
            </div>
            <div class="progress-track progress-track--compact mb-2">
              <div class="progress-track__fill" style="width:${issue.affinity}%"></div>
            </div>
            <p class="text-xs text-on-surface-variant">Posición: ${answerLabel(question, issue.candidateValue)}</p>
          </div>
        `;
      })
      .join('');

    return `
      <section class="question-card bg-white rounded-2xl p-5 border border-outline-variant/10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1">${question.title}</p>
            <p class="text-sm text-on-surface-variant">Tu respuesta: ${answerLabel(question, answer)}</p>
          </div>
          <span class="question-badge text-[11px] font-bold uppercase tracking-[0.18em] text-primary bg-surface-container-low px-3 py-2 rounded-full">✓ Respondida</span>
        </div>
        <div class="grid gap-3 md:grid-cols-3">${comparisons}</div>
      </section>
    `;
  }).join('');
}

// ── Results Visibility ────────────────────────────────────────────────────────

let resultsRevealed = false;
const resultsSections = document.querySelectorAll('[data-results-section]');

function clearRenderedResults() {
  if (topMatch) topMatch.innerHTML = '';
  if (resultsList) resultsList.innerHTML = '';
  if (issueBreakdown) issueBreakdown.innerHTML = '';
}

function showResultsSections() {
  if (resultsRevealed) return;
  resultsRevealed = true;
  resultsSections.forEach((section) => section.classList.remove('hidden'));
}

function hideResultsSections() {
  if (!resultsRevealed) return;
  resultsRevealed = false;
  resultsSections.forEach((section) => section.classList.add('hidden'));
}

// ── Update & Sort with Tiebreaking ────────────────────────────────────────────

function updateResults() {
  if (!isQuestionnaireComplete(currentAnswers)) {
    hideResultsSections();
    clearRenderedResults();
    return;
  }

  const ranking = CANDIDATES.map((candidate) => calculateCandidateScore(candidate, currentAnswers)).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.exactMatches !== a.exactMatches) return b.exactMatches - a.exactMatches;
    if (b.evidenceAlignment !== a.evidenceAlignment) return b.evidenceAlignment - a.evidenceAlignment;
    return a.name.localeCompare(b.name, 'es');
  });

  showResultsSections();
  renderTopMatch(ranking);
  renderResultsList(ranking);
  renderIssueBreakdown(ranking);
}

// ── Event Handlers ────────────────────────────────────────────────────────────

if (form) {
  form.addEventListener('change', (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    const questionIndex = QUESTIONS.findIndex((question) => question.id === event.target.name);
    currentAnswers[event.target.name] = clampAnswer(event.target.value);
    persistAnswers();
    updateResults();

    if (questionIndex === -1) {
      renderQuestions();
      return;
    }

    if (questionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(questionIndex + 1);
      renderQuestions();
      focusCurrentQuestion();
      return;
    }

    setCurrentQuestionIndex(questionIndex);
    renderQuestions();
    focusCurrentQuestion();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!isQuestionnaireComplete(currentAnswers)) return;
    updateResults();
    document.getElementById('tu-resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

previousButton?.addEventListener('click', () => {
  setCurrentQuestionIndex(currentQuestionIndex - 1);
  renderQuestions();
  focusCurrentQuestion();
});

resetButton?.addEventListener('click', () => {
  currentAnswers = getDefaultAnswers();
  setCurrentQuestionIndex(0);
  persistAnswers();
  renderQuestions();
  focusCurrentQuestion();
  hideResultsSections();
  clearRenderedResults();
});

// ── Init ──────────────────────────────────────────────────────────────────────

if (form) {
  renderQuestions();

  if (isQuestionnaireComplete(currentAnswers)) {
    updateResults();
  } else {
    hideResultsSections();
    clearRenderedResults();
  }
}

window.addEventListener('beforeunload', () => {
  window.clearInterval(polymarketPollTimer);
  clearPolymarketSocketState();
  polymarketSocket?.close();
});
