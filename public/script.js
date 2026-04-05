const QUESTION_KEY = 'elecciones:questionnaireAnswers';

const QUESTIONS = [
  {
    id: 'security',
    title: 'Seguridad',
    prompt: '¿Cómo combatirías la inseguridad ciudadana?',
    options: [
      { value: 1, label: 'Mano dura: penas más severas, incluida la pena de muerte' },
      { value: 2, label: 'Reformar la policía, fiscalía y el poder judicial' },
      { value: 3, label: 'Más inversión en educación y prevención social' },
    ],
  },
  {
    id: 'economy',
    title: 'Economía',
    prompt: '¿Cómo debería manejarse la economía del país?',
    options: [
      { value: 1, label: 'Libre mercado: menos impuestos, menos regulación' },
      { value: 2, label: 'El Estado debe intervenir más y controlar precios' },
      { value: 3, label: 'Un equilibrio entre mercado libre y regulación estatal' },
    ],
  },
  {
    id: 'education',
    title: 'Educación',
    prompt: '¿Qué priorizarías en educación?',
    options: [
      { value: 1, label: 'Invertir fuerte en educación pública y gratuita' },
      { value: 2, label: 'Dar incentivos para que crezca la educación privada' },
      { value: 3, label: 'Mejorar ambas: pública de calidad y privada accesible' },
    ],
  },
  {
    id: 'health',
    title: 'Salud',
    prompt: '¿Cómo mejorarías el sistema de salud?',
    options: [
      { value: 1, label: 'Un sistema de salud universal gratuito para todos' },
      { value: 2, label: 'Fortalecer el sector privado como complemento del público' },
      { value: 3, label: 'Integrar SIS, EsSalud y clínicas en un solo sistema' },
    ],
  },
  {
    id: 'corruption',
    title: 'Corrupción',
    prompt: '¿Cómo combatirías la corrupción?',
    options: [
      { value: 1, label: 'Pena de muerte o cadena perpetua para corruptos' },
      { value: 2, label: 'Cadena perpetua e inhabilitación de por vida' },
      { value: 3, label: 'Reformar el sistema judicial y fortalecer la fiscalía' },
    ],
  },
  {
    id: 'mining',
    title: 'Minería',
    prompt: '¿Qué posición debería tener el país sobre la minería?',
    options: [
      { value: 1, label: 'Promover la inversión minera, genera empleo y riqueza' },
      { value: 2, label: 'Regularla fuertemente para proteger el medio ambiente' },
      { value: 3, label: 'Solo con consulta previa a las comunidades afectadas' },
    ],
  },
  {
    id: 'decentralization',
    title: 'Descentralización',
    prompt: '¿Cómo debería gobernarse el interior del país?',
    options: [
      { value: 1, label: 'Dar más poder y presupuesto a los gobiernos regionales' },
      { value: 2, label: 'Un gobierno central fuerte que dirija desde Lima' },
      { value: 3, label: 'Descentralizar gradualmente con capacitación técnica' },
    ],
  },
  {
    id: 'social_policy',
    title: 'Política Social',
    prompt: '¿Cómo ayudarías a los que menos tienen?',
    options: [
      { value: 1, label: 'Bonos y transferencias directas de dinero' },
      { value: 2, label: 'Crear programas de empleo temporal del Estado' },
      { value: 3, label: 'Invertir en educación técnica y capacitación laboral' },
    ],
  },
];

// ── Data Mapping ──────────────────────────────────────────────────────────────

const FIELD_MAP = {
  security: 'seguridad',
  economy: 'economia',
  education: 'educacion',
  health: 'salud',
  corruption: 'corrupcion',
  mining: 'mineria',
  decentralization: 'descentralizacion',
  social_policy: 'politica_social',
};

const POSITION_MAP = {
  security: { mano_dura: 1, reforma_institucional: 2, prevencion: 3 },
  economy: { libre_mercado: 1, intervencion_estatal: 2, mixta: 3 },
  education: { publica_prioridad: 1, privada_incentivo: 2, mixta: 3 },
  health: { sistema_universal: 1, privado_complementario: 2, mixto: 3 },
  corruption: { pena_muerte: 1, cadena_perpetua: 2, reforma_judicial: 3 },
  mining: { pro_mineria: 1, regulacion_estricta: 2, consulta_previa: 3 },
  decentralization: { mas_poder_regiones: 1, gobierno_central: 2, gradual: 3 },
  social_policy: { bonos_directos: 1, programas_empleo: 2, educacion_tecnica: 3 },
};

// ── NLP Keyword Dictionaries ──────────────────────────────────────────────────
// Cada dimensión tiene 3 posiciones; cada posición tiene palabras clave con peso.
// Se usan para analizar el texto de propuestas como proxy del plan de gobierno.

const NLP_KEYWORDS = {
  security: {
    mano_dura: [
      { keyword: 'mano dura', weight: 3.0 },
      { keyword: 'mano de hierro', weight: 3.0 },
      { keyword: 'orden interno', weight: 2.0 },
      { keyword: 'extorsion', weight: 1.8 },
      { keyword: 'pena de muerte', weight: 2.5 },
      { keyword: 'tolerancia cero', weight: 2.2 },
      { keyword: 'estado de emergencia', weight: 2.0 },
      { keyword: 'castigo severo', weight: 1.8 },
      { keyword: 'sicarios', weight: 1.8 },
    ],
    reforma_institucional: [
      { keyword: 'reforma institucional', weight: 2.4 },
      { keyword: 'fortalecimiento institucional', weight: 2.2 },
      { keyword: 'estado de derecho', weight: 1.8 },
      { keyword: 'reforma policial', weight: 2.3 },
      { keyword: 'reforma judicial', weight: 2.0 },
      { keyword: 'coordinacion policial', weight: 2.0 },
      { keyword: 'fiscalia', weight: 1.8 },
      { keyword: 'serenazgo', weight: 1.6 },
    ],
    prevencion: [
      { keyword: 'prevencion de violencia', weight: 2.3 },
      { keyword: 'prevencion social', weight: 2.3 },
      { keyword: 'enfoque comunitario', weight: 2.2 },
      { keyword: 'derechos humanos', weight: 1.8 },
      { keyword: 'reinsercion', weight: 2.0 },
      { keyword: 'educacion y prevencion', weight: 2.2 },
      { keyword: 'politicas preventivas', weight: 2.0 },
    ],
  },
  economy: {
    libre_mercado: [
      { keyword: 'libre mercado', weight: 3.0 },
      { keyword: 'inversion privada', weight: 2.5 },
      { keyword: 'reduccion de impuestos', weight: 2.3 },
      { keyword: 'desregulacion', weight: 2.2 },
      { keyword: 'competitividad', weight: 1.8 },
      { keyword: 'menos regulacion', weight: 2.0 },
      { keyword: 'apertura comercial', weight: 1.8 },
      { keyword: 'emprendimiento', weight: 1.5 },
      { keyword: 'igv', weight: 1.5 },
    ],
    intervencion_estatal: [
      { keyword: 'intervencion estatal', weight: 3.0 },
      { keyword: 'control de precios', weight: 2.5 },
      { keyword: 'nacionalizacion', weight: 2.5 },
      { keyword: 'empresa publica', weight: 2.3 },
      { keyword: 'rol del estado', weight: 2.2 },
      { keyword: 'planificacion economica', weight: 2.0 },
      { keyword: 'sectores estrategicos', weight: 2.0 },
      { keyword: 'mayor rol del estado', weight: 2.5 },
    ],
    mixta: [
      { keyword: 'economia social de mercado', weight: 2.5 },
      { keyword: 'equilibrio', weight: 2.0 },
      { keyword: 'regulacion inteligente', weight: 2.2 },
      { keyword: 'alianzas publico-privadas', weight: 2.2 },
      { keyword: 'inversion publica', weight: 1.8 },
      { keyword: 'reactivacion', weight: 1.8 },
      { keyword: 'formalizacion', weight: 1.6 },
    ],
  },
  education: {
    publica_prioridad: [
      { keyword: 'educacion publica', weight: 3.0 },
      { keyword: 'gratuidad', weight: 2.5 },
      { keyword: 'presupuesto educativo', weight: 2.3 },
      { keyword: 'universidades publicas', weight: 2.0 },
      { keyword: 'inversion en educacion', weight: 2.0 },
      { keyword: 'infraestructura educativa', weight: 1.8 },
    ],
    privada_incentivo: [
      { keyword: 'educacion privada', weight: 3.0 },
      { keyword: 'vouchers educativos', weight: 2.5 },
      { keyword: 'libertad de ensenanza', weight: 2.2 },
      { keyword: 'becas privadas', weight: 2.0 },
      { keyword: 'competencia educativa', weight: 1.8 },
    ],
    mixta: [
      { keyword: 'calidad educativa', weight: 2.5 },
      { keyword: 'mejora educativa', weight: 2.2 },
      { keyword: 'modernizacion educativa', weight: 2.0 },
      { keyword: 'evaluacion docente', weight: 2.0 },
      { keyword: 'acreditacion', weight: 1.8 },
      { keyword: 'ciencia y tecnologia', weight: 1.8 },
      { keyword: 'mantenimiento escolar', weight: 1.6 },
    ],
  },
  health: {
    sistema_universal: [
      { keyword: 'salud universal', weight: 3.0 },
      { keyword: 'cobertura universal', weight: 2.8 },
      { keyword: 'sistema unico de salud', weight: 2.5 },
      { keyword: 'salud gratuita', weight: 2.3 },
      { keyword: 'derecho a la salud', weight: 2.0 },
      { keyword: 'servicios publicos universales', weight: 2.2 },
    ],
    privado_complementario: [
      { keyword: 'salud privada', weight: 3.0 },
      { keyword: 'clinicas', weight: 2.0 },
      { keyword: 'seguro privado', weight: 2.5 },
      { keyword: 'sector privado', weight: 1.8 },
      { keyword: 'eficiencia sanitaria', weight: 1.8 },
    ],
    mixto: [
      { keyword: 'sistema integrado', weight: 2.5 },
      { keyword: 'sis', weight: 2.0 },
      { keyword: 'essalud', weight: 2.0 },
      { keyword: 'integracion de salud', weight: 2.3 },
      { keyword: 'articulacion sanitaria', weight: 2.2 },
      { keyword: 'sistema de salud integrado', weight: 2.8 },
    ],
  },
  corruption: {
    pena_muerte: [
      { keyword: 'pena de muerte', weight: 3.0 },
      { keyword: 'maxima sancion', weight: 2.5 },
      { keyword: 'castigo ejemplar', weight: 2.0 },
      { keyword: 'fusilamiento', weight: 2.5 },
    ],
    cadena_perpetua: [
      { keyword: 'cadena perpetua', weight: 3.0 },
      { keyword: 'inhabilitacion', weight: 2.5 },
      { keyword: 'carcel', weight: 2.0 },
      { keyword: 'sancion severa', weight: 2.2 },
      { keyword: 'prision', weight: 1.8 },
      { keyword: 'inhabilitacion de por vida', weight: 2.5 },
    ],
    reforma_judicial: [
      { keyword: 'reforma judicial', weight: 3.0 },
      { keyword: 'fiscalia', weight: 2.5 },
      { keyword: 'fortalecimiento institucional', weight: 2.3 },
      { keyword: 'transparencia', weight: 2.2 },
      { keyword: 'control ciudadano', weight: 2.0 },
      { keyword: 'rendicion de cuentas', weight: 1.8 },
      { keyword: 'anticorrupcion', weight: 2.5 },
      { keyword: 'lucha anticorrupcion', weight: 2.8 },
      { keyword: 'fiscalias especializadas', weight: 2.5 },
    ],
  },
  mining: {
    pro_mineria: [
      { keyword: 'inversion minera', weight: 3.0 },
      { keyword: 'empleo minero', weight: 2.5 },
      { keyword: 'exportaciones mineras', weight: 2.3 },
      { keyword: 'desarrollo minero', weight: 2.2 },
      { keyword: 'riqueza mineral', weight: 2.0 },
      { keyword: 'promover la mineria', weight: 2.5 },
    ],
    regulacion_estricta: [
      { keyword: 'regulacion ambiental', weight: 3.0 },
      { keyword: 'medio ambiente', weight: 2.5 },
      { keyword: 'impacto ambiental', weight: 2.3 },
      { keyword: 'proteccion ambiental', weight: 2.2 },
      { keyword: 'sostenibilidad', weight: 2.0 },
      { keyword: 'regulacion estricta', weight: 2.5 },
    ],
    consulta_previa: [
      { keyword: 'consulta previa', weight: 3.0 },
      { keyword: 'comunidades', weight: 2.0 },
      { keyword: 'pueblos indigenas', weight: 2.3 },
      { keyword: 'participacion comunal', weight: 2.2 },
      { keyword: 'licencia social', weight: 2.5 },
    ],
  },
  decentralization: {
    mas_poder_regiones: [
      { keyword: 'poder regional', weight: 3.0 },
      { keyword: 'gobiernos regionales', weight: 2.5 },
      { keyword: 'autonomia regional', weight: 2.3 },
      { keyword: 'presupuesto regional', weight: 2.2 },
      { keyword: 'transferencias regionales', weight: 2.5 },
      { keyword: 'mas poder', weight: 2.0 },
    ],
    gobierno_central: [
      { keyword: 'gobierno central', weight: 3.0 },
      { keyword: 'centralizacion', weight: 2.5 },
      { keyword: 'direccion nacional', weight: 2.0 },
      { keyword: 'eficiencia centralizada', weight: 2.2 },
      { keyword: 'desde lima', weight: 1.8 },
    ],
    gradual: [
      { keyword: 'descentralizacion gradual', weight: 3.0 },
      { keyword: 'capacitacion tecnica', weight: 2.5 },
      { keyword: 'fortalecimiento de capacidades', weight: 2.3 },
      { keyword: 'gobernanza', weight: 2.0 },
      { keyword: 'transferencia progresiva', weight: 2.2 },
      { keyword: 'desarrollo territorial', weight: 2.0 },
    ],
  },
  social_policy: {
    bonos_directos: [
      { keyword: 'bonos', weight: 3.0 },
      { keyword: 'transferencias directas', weight: 2.8 },
      { keyword: 'subsidios', weight: 2.5 },
      { keyword: 'apoyo economico directo', weight: 2.3 },
      { keyword: 'programa social', weight: 2.0 },
      { keyword: 'viviendas sociales', weight: 1.8 },
    ],
    programas_empleo: [
      { keyword: 'empleo temporal', weight: 3.0 },
      { keyword: 'programas de empleo', weight: 2.8 },
      { keyword: 'trabajo garantizado', weight: 2.5 },
      { keyword: 'obras publicas', weight: 2.2 },
      { keyword: 'empleo estatal', weight: 2.0 },
      { keyword: 'simplificacion de tramites', weight: 1.8 },
    ],
    educacion_tecnica: [
      { keyword: 'educacion tecnica', weight: 3.0 },
      { keyword: 'capacitacion laboral', weight: 2.8 },
      { keyword: 'formacion profesional', weight: 2.5 },
      { keyword: 'habilidades laborales', weight: 2.3 },
      { keyword: 'emprendimiento', weight: 2.0 },
      { keyword: 'formalizacion laboral', weight: 2.0 },
    ],
  },
};

// ── Text Normalization ────────────────────────────────────────────────────────

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ── NLP Party Context Analysis ────────────────────────────────────────────────
// Analiza el texto de propuestas buscando coincidencias con palabras clave.
// Retorna la posición dominante y su nivel de confianza, o null si no hay data.

function analyzePartyContext(text, questionId) {
  const keywords = NLP_KEYWORDS[questionId];
  if (!keywords || !text) return null;

  const normalized = normalizeText(text);
  const scores = {};
  let totalScore = 0;

  for (const [position, words] of Object.entries(keywords)) {
    let posScore = 0;
    for (const { keyword, weight } of words) {
      if (normalized.includes(normalizeText(keyword))) {
        posScore += weight;
      }
    }
    scores[position] = posScore;
    totalScore += posScore;
  }

  if (totalScore === 0) return null;

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [dominantPosition, dominantScore] = sorted[0];

  if (dominantScore === 0) return null;

  return {
    position: dominantPosition,
    numericValue: POSITION_MAP[questionId][dominantPosition],
    confidence: dominantScore / totalScore,
  };
}

// ── Build Candidates from Injected Data ───────────────────────────────────────

function buildCandidates(rawData) {
  return rawData.map((c) => {
    const positions = {};
    for (const q of QUESTIONS) {
      const yamlKey = FIELD_MAP[q.id];
      const stringValue = c.quiz_posiciones[yamlKey];
      positions[q.id] = POSITION_MAP[q.id][stringValue] ?? 2;
    }

    const proposalText = [...c.propuestas, c.dato_clave].join(' ');

    return {
      name: c.nombre,
      party: c.partido,
      logo: c.logo_partido,
      photo: c.foto,
      age: c.edad,
      profession: c.profesion,
      experience: c.experiencia_politica,
      proposals: c.propuestas,
      keyFact: c.dato_clave,
      ideology: c.partido_ideologia,
      planUrl: c.plan_gobierno_url,
      cvUrl: c.hoja_vida_url,
      positions,
      proposalText,
    };
  });
}

const CANDIDATES = buildCandidates(window.__CANDIDATOS_DATA__ || []);

// ── DOM References ────────────────────────────────────────────────────────────

const form = document.getElementById('questionnaire-form');
const topMatch = document.getElementById('top-match');
const resultsList = document.getElementById('results-list');
const issueBreakdown = document.getElementById('issue-breakdown');
const answersCount = document.getElementById('answers-count');
const resetButton = document.getElementById('reset-button');
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
      <article class="rounded-[1.5rem] border border-outline-variant/10 bg-surface-container-low px-5 py-5">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-white px-3 text-sm font-extrabold text-primary">
              ${index + 1}
            </span>
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/55">
                ${index === 0 ? 'Favorito' : `Puesto ${index + 1}`}
              </p>
              <h3 class="mt-1 font-headline text-lg font-extrabold leading-tight text-primary">
                ${escapeHtml(candidate.name)}
              </h3>
            </div>
          </div>
          <span class="text-2xl font-extrabold tabular-nums text-primary">
            ${formatProbability(candidate.probability)}
          </span>
        </div>
      </article>
    `)
    .join('');

  polymarketBoard.innerHTML = `
    <article class="rounded-[1.75rem] border border-outline-variant/10 bg-surface p-6 md:p-8">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-3">
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-primary/55">Top 3 de Polymarket</p>
            <h3 class="font-headline text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              ${escapeHtml(leader.name)} lidera ahora mismo
            </h3>
            <p class="max-w-2xl text-sm leading-6 text-on-surface-variant">
              Solo te mostramos los tres primeros puestos con su porcentaje actual.
              Si quieres ver el mercado completo, abre Polymarket.
            </p>
          </div>
          <div class="rounded-[1.5rem] bg-primary px-6 py-5 text-white shadow-[0_18px_40px_rgba(0,27,68,0.18)]">
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">1.er lugar</p>
            <p class="mt-2 font-headline text-4xl font-extrabold tabular-nums">${formatProbability(leader.probability)}</p>
            <p class="mt-2 text-sm text-white/72">${escapeHtml(leader.name)}</p>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          ${podiumMarkup}
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-outline-variant/10 bg-surface-container-low px-5 py-4">
          <p class="text-sm text-on-surface-variant">
            Actualizado ${formatSnapshotDate(polymarketSnapshot.updatedAt)}
          </p>
          <span class="rounded-full bg-primary/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            ${polymarketSnapshot.active && !polymarketSnapshot.closed ? 'Mercado abierto' : 'Mercado cerrado'}
          </span>
        </div>
      </div>
    </article>
  `;

  if (polymarketMeta) {
    const eventState = polymarketSnapshot.active && !polymarketSnapshot.closed ? 'mercado abierto' : 'mercado cerrado';
    polymarketMeta.textContent = `Actualizado ${formatSnapshotDate(polymarketSnapshot.updatedAt)} · ${eventState} · volumen total ${formatUsd(polymarketSnapshot.volume, true)}.`;
  }
}

function computeLiveProbability(priceA, priceB) {
  const first = Number(priceA ?? 0);
  const second = Number(priceB ?? 0);

  if (first > 0 && second > 0) return ((first + second) / 2) * 100;
  if (first > 0) return first * 100;
  if (second > 0) return second * 100;
  return null;
}

function updatePolymarketCandidate(assetId, nextProbability) {
  if (!polymarketSnapshot) return;

  const candidate = polymarketSnapshot.candidates.find((item) => item.yesTokenId === assetId);
  if (!candidate || !Number.isFinite(nextProbability)) return;

  candidate.probability = Math.max(0, Math.min(100, nextProbability));
  polymarketSnapshot.updatedAt = new Date().toISOString();
  schedulePolymarketRender();
}

function handlePolymarketMessage(message) {
  if (!message || typeof message !== 'object') return;

  if (message.event_type === 'best_bid_ask') {
    const nextProbability = computeLiveProbability(message.best_bid, message.best_ask);
    if (nextProbability !== null) updatePolymarketCandidate(message.asset_id, nextProbability);
    return;
  }

  if (message.event_type === 'last_trade_price') {
    updatePolymarketCandidate(message.asset_id, Number(message.price) * 100);
    return;
  }

  if (message.event_type === 'book') {
    const bestBid = Array.isArray(message.bids) && message.bids.length ? message.bids[0]?.price : 0;
    const bestAsk = Array.isArray(message.asks) && message.asks.length ? message.asks[0]?.price : 0;
    const nextProbability = computeLiveProbability(bestBid, bestAsk);
    if (nextProbability !== null) updatePolymarketCandidate(message.asset_id, nextProbability);
    return;
  }

  if (message.event_type === 'price_change' && Array.isArray(message.price_changes)) {
    message.price_changes.forEach((change) => {
      const nextProbability = computeLiveProbability(change.best_bid, change.best_ask) ?? Number(change.price) * 100;
      updatePolymarketCandidate(change.asset_id, nextProbability);
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
    setPolymarketStatus('En vivo', 'live');
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
    setPolymarketStatus('Reconectando', 'sync');
  });

  polymarketSocket.addEventListener('close', () => {
    polymarketSocket = null;
    clearPolymarketSocketState();
    setPolymarketStatus('Reconectando', 'sync');

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
        throw new Error('La ruta /api/polymarket no existe en este entorno. Ejecuta la app con Astro/Node (npm run dev o npm run preview), no como sitio estático.');
      }
      throw new Error(payload?.message || 'No se pudo cargar Polymarket.');
    }

    if (!payload) {
      throw new Error('El endpoint de Polymarket no devolvió JSON. Revisa que la app esté corriendo con Astro y no desde un servidor estático.');
    }

    polymarketSnapshot = payload;
    renderPolymarketBoard();
    connectPolymarketSocket();
    setPolymarketStatus('En vivo', 'live');
  } catch (error) {
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
      polymarketMeta.textContent = 'No fue posible actualizar el mercado en este momento.';
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
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 2;
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

function persistAnswers() {
  localStorage.setItem(QUESTION_KEY, JSON.stringify(currentAnswers));
}

function answerLabel(question, value) {
  if (value === null) return 'Sin responder';
  const option = question.options.find((o) => o.value === value);
  return option ? option.label : 'Sin responder';
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

function renderQuestions() {
  form.innerHTML = QUESTIONS.map((q, i) => buildQuestionMarkup(q, currentAnswers[q.id], i)).join('');
  answersCount.textContent = `${countAnswered()}/${QUESTIONS.length}`;
}

// ── Core Affinity Algorithm ───────────────────────────────────────────────────

function calculateSimilarity(userValue, candidateValue) {
  const distance = Math.abs(userValue - candidateValue);
  return 1 - distance / 2;
}

function calculateCandidateScore(candidate) {
  const issueScores = QUESTIONS.map((question) => {
    const userValue = currentAnswers[question.id] ?? 2;
    const candidateValue = clampAnswer(candidate.positions[question.id]);

    const baseSimilarity = calculateSimilarity(userValue, candidateValue);

    const partyContext = analyzePartyContext(candidate.proposalText, question.id);

    let finalSimilarity;
    if (partyContext) {
      const partySimilarity = calculateSimilarity(userValue, partyContext.numericValue);
      const partyWeight = 0.28 * partyContext.confidence;
      finalSimilarity =
        (baseSimilarity * 0.72 + partySimilarity * partyWeight) / (0.72 + partyWeight);
    } else {
      finalSimilarity = baseSimilarity;
    }

    const affinity = Math.round(finalSimilarity * 100);

    return { question, userValue, candidateValue, affinity };
  });

  const score = Math.round(
    issueScores.reduce((sum, issue) => sum + issue.affinity, 0) / issueScores.length,
  );

  const exactMatches = issueScores.filter((issue) => issue.affinity === 100).length;

  return {
    ...candidate,
    score,
    exactMatches,
    issueScores,
    strongestMatches: issueScores
      .slice()
      .sort((a, b) => b.affinity - a.affinity)
      .slice(0, 3),
  };
}

// ── Results Rendering ─────────────────────────────────────────────────────────

function renderTopMatch(ranking) {
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
            Tu perfil actual se acerca más a esta candidatura según los ocho ejes analizados.
          </p>
          <p class="text-xs text-on-surface-variant mt-3">${best.keyFact}</p>
        </div>
      </div>
    </div>
  `;
}

function renderResultsList(ranking) {
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
  const topThree = ranking.slice(0, 3);

  issueBreakdown.innerHTML = QUESTIONS.map((question) => {
    const answer = currentAnswers[question.id];
    const comparisons = topThree
      .map((candidate) => {
        const issue = candidate.issueScores.find((e) => e.question.id === question.id);
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
          <span class="question-badge text-[11px] font-bold uppercase tracking-[0.18em] text-primary bg-surface-container-low px-3 py-2 rounded-full">${answer !== null ? '✓ Respondida' : 'Sin responder'}</span>
        </div>
        <div class="grid gap-3 md:grid-cols-3">${comparisons}</div>
      </section>
    `;
  }).join('');
}

// ── Results Visibility ────────────────────────────────────────────────────────

let resultsRevealed = false;
const resultsSections = document.querySelectorAll('[data-results-section]');

function showResultsSections() {
  if (resultsRevealed) return;
  resultsRevealed = true;
  resultsSections.forEach((s) => s.classList.remove('hidden'));
}

// ── Update & Sort with Tiebreaking ────────────────────────────────────────────

function updateResults() {
  const ranking = CANDIDATES.map((c) => calculateCandidateScore(c)).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.exactMatches !== a.exactMatches) return b.exactMatches - a.exactMatches;
    return a.name.localeCompare(b.name);
  });

  renderTopMatch(ranking);
  renderResultsList(ranking);
  renderIssueBreakdown(ranking);
}

// ── Event Handlers ────────────────────────────────────────────────────────────

form.addEventListener('change', (event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  currentAnswers[event.target.name] = clampAnswer(event.target.value);
  persistAnswers();
  renderQuestions();
  showResultsSections();
  updateResults();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  showResultsSections();
  updateResults();
  document.getElementById('tu-resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

resetButton.addEventListener('click', () => {
  currentAnswers = getDefaultAnswers();
  persistAnswers();
  renderQuestions();
  showResultsSections();
  updateResults();
});

// ── Init ──────────────────────────────────────────────────────────────────────

const hasSavedAnswers = localStorage.getItem(QUESTION_KEY) !== null;

renderQuestions();

if (hasSavedAnswers) {
  showResultsSections();
  updateResults();
}

window.addEventListener('beforeunload', () => {
  window.clearInterval(polymarketPollTimer);
  clearPolymarketSocketState();
  polymarketSocket?.close();
});
