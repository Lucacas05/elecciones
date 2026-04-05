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

const CANDIDATES = [
  {
    name: 'Candidatura Horizonte',
    party: 'Movimiento Horizonte',
    summary: 'Perfil orientado a reformas graduales, agenda social amplia y fortalecimiento de servicios públicos.',
    highlights: ['Servicios públicos', 'Inclusión', 'Descentralización'],
    positions: {
      security: 3,
      economy: 2,
      education: 1,
      health: 1,
      corruption: 3,
      mining: 2,
      decentralization: 1,
      social_policy: 3,
    },
  },
  {
    name: 'Candidatura Orden',
    party: 'Alianza Orden y Futuro',
    summary: 'Perfil con énfasis en seguridad, autoridad estatal, inversión privada y control centralizado.',
    highlights: ['Seguridad', 'Inversión', 'Gestión ejecutiva'],
    positions: {
      security: 1,
      economy: 1,
      education: 2,
      health: 2,
      corruption: 1,
      mining: 1,
      decentralization: 2,
      social_policy: 1,
    },
  },
  {
    name: 'Candidatura Equilibrio',
    party: 'Acuerdo Nacional Ciudadano',
    summary: 'Perfil intermedio con foco en consensos, institucionalidad y balance entre crecimiento y protección social.',
    highlights: ['Institucionalidad', 'Consenso', 'Reactivación'],
    positions: {
      security: 2,
      economy: 3,
      education: 3,
      health: 3,
      corruption: 2,
      mining: 3,
      decentralization: 3,
      social_policy: 2,
    },
  },
  {
    name: 'Candidatura Cambio',
    party: 'Frente Cambio País',
    summary: 'Perfil que prioriza descentralización, vigilancia ciudadana y cambios intensos en distribución del poder.',
    highlights: ['Regiones', 'Transparencia', 'Participación'],
    positions: {
      security: 3,
      economy: 2,
      education: 1,
      health: 1,
      corruption: 3,
      mining: 3,
      decentralization: 1,
      social_policy: 3,
    },
  },
];

const form = document.getElementById('questionnaire-form');
const topMatch = document.getElementById('top-match');
const resultsList = document.getElementById('results-list');
const issueBreakdown = document.getElementById('issue-breakdown');
const answersCount = document.getElementById('answers-count');
const resetButton = document.getElementById('reset-button');

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

function calculateCandidateScore(candidate) {
  const issueScores = QUESTIONS.map((question) => {
    const userValue = currentAnswers[question.id] ?? 2;
    const candidateValue = clampAnswer(candidate.positions[question.id]);
    const distance = Math.abs(userValue - candidateValue);
    const affinity = Math.round((1 - distance / 2) * 100);

    return { question, userValue, candidateValue, affinity };
  });

  const score = Math.round(
    issueScores.reduce((sum, issue) => sum + issue.affinity, 0) / issueScores.length,
  );

  return {
    ...candidate,
    score,
    issueScores,
    strongestMatches: issueScores
      .slice()
      .sort((a, b) => b.affinity - a.affinity)
      .slice(0, 3),
  };
}

function renderTopMatch(ranking) {
  const best = ranking[0];
  const next = ranking[1];
  const gap = next ? best.score - next.score : 0;

  topMatch.innerHTML = `
    <div class="relative z-10 space-y-6">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div class="space-y-3">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-white/70">Resultado principal</p>
          <div>
            <h2 class="font-headline text-3xl md:text-4xl font-extrabold tracking-tight">${best.name}</h2>
            <p class="text-white/80 text-sm mt-2">${best.party}</p>
          </div>
          <p class="text-sm md:text-base leading-7 text-white/82 max-w-2xl">${best.summary}</p>
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
                (issue) => `<span class="px-3 py-2 rounded-full bg-white/12 text-sm font-semibold">${issue.question.title} · ${issue.affinity}%</span>`,
              )
              .join('')}
          </div>
          <div class="flex flex-wrap gap-2">
            ${best.highlights
              .map(
                (h) => `<span class="px-3 py-1.5 rounded-full bg-primary-fixed/20 text-xs font-bold uppercase tracking-[0.18em] text-white">${h}</span>`,
              )
              .join('')}
          </div>
        </div>

        <div class="bg-white text-primary rounded-2xl p-5">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-2">Lectura rápida</p>
          <p class="font-headline text-xl font-extrabold mb-2">${gap > 0 ? `${gap} puntos por encima del segundo lugar` : 'Empate técnico entre primeros puestos'}</p>
          <p class="text-sm text-on-surface-variant leading-6">
            Tu perfil actual se acerca más a esta candidatura según los ocho ejes analizados. Conviene revisar también el segundo y tercer lugar antes de cerrar una conclusión.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderResultsList(ranking) {
  resultsList.innerHTML = ranking
    .map(
      (candidate, index) => `
        <article class="result-card rounded-2xl border border-outline-variant/10 bg-surface-container-low p-5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div class="space-y-3">
              <div class="flex items-center flex-wrap gap-3">
                <span class="inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-full bg-white text-primary font-headline font-extrabold">${index + 1}</span>
                <div>
                  <h3 class="font-headline text-xl font-extrabold text-primary">${candidate.name}</h3>
                  <p class="text-sm text-on-surface-variant">${candidate.party}</p>
                </div>
              </div>
              <p class="text-sm text-on-surface-variant leading-6 max-w-2xl">${candidate.summary}</p>
              <div class="flex flex-wrap gap-2">
                ${candidate.highlights
                  .map(
                    (h) => `<span class="px-3 py-1.5 rounded-full bg-white text-primary text-[11px] font-bold uppercase tracking-[0.18em]">${h}</span>`,
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
              <p class="text-xs text-on-surface-variant">Mejores coincidencias: ${candidate.strongestMatches.map((issue) => issue.question.title).join(' · ')}</p>
            </div>
          </div>
        </article>
      `,
    )
    .join('');
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
              <span class="font-headline font-bold text-primary">${candidate.name}</span>
              <span class="text-sm font-bold text-primary">${issue.affinity}%</span>
            </div>
            <div class="progress-track progress-track--compact mb-2">
              <div class="progress-track__fill" style="width:${issue.affinity}%"></div>
            </div>
            <p class="text-xs text-on-surface-variant">Posición del perfil: ${answerLabel(question, issue.candidateValue)}</p>
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

let resultsRevealed = false;
const resultsSections = document.querySelectorAll('[data-results-section]');

function showResultsSections() {
  if (resultsRevealed) return;
  resultsRevealed = true;
  resultsSections.forEach((s) => s.classList.remove('hidden'));
}

function updateResults() {
  const ranking = CANDIDATES.map(calculateCandidateScore).sort((a, b) => b.score - a.score);
  renderTopMatch(ranking);
  renderResultsList(ranking);
  renderIssueBreakdown(ranking);
}

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
  document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

resetButton.addEventListener('click', () => {
  currentAnswers = getDefaultAnswers();
  persistAnswers();
  renderQuestions();
  showResultsSections();
  updateResults();
});

const hasSavedAnswers = localStorage.getItem(QUESTION_KEY) !== null;

renderQuestions();

if (hasSavedAnswers) {
  showResultsSections();
  updateResults();
}
