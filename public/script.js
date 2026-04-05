const QUESTION_KEY = 'elecciones:questionnaireAnswers';

const QUESTIONS = [
  {
    id: 'security',
    title: 'Seguridad ciudadana',
    prompt: '¿Qué enfoque debería priorizar el próximo gobierno frente a la inseguridad?',
    leftLabel: 'Prevención y trabajo comunitario',
    rightLabel: 'Control, sanción y presencia policial',
  },
  {
    id: 'economy',
    title: 'Economía familiar',
    prompt: '¿Qué pesa más para ti en la reactivación económica?',
    leftLabel: 'Protección social y alivio del costo de vida',
    rightLabel: 'Inversión privada y crecimiento rápido',
  },
  {
    id: 'state',
    title: 'Reforma del Estado',
    prompt: '¿Cómo debería mejorar el Estado?',
    leftLabel: 'Más servicios, acompañamiento y capacidades públicas',
    rightLabel: 'Menos trabas, menos burocracia y gestión por resultados',
  },
  {
    id: 'regions',
    title: 'Regiones y descentralización',
    prompt: '¿Qué tipo de relación debería tener Lima con las regiones?',
    leftLabel: 'Más autonomía y presupuesto regional',
    rightLabel: 'Mayor coordinación y control desde el gobierno central',
  },
  {
    id: 'rights',
    title: 'Agenda social',
    prompt: 'En temas sociales, ¿qué postura te representa más?',
    leftLabel: 'Mayor énfasis en derechos, inclusión y protección social',
    rightLabel: 'Mayor énfasis en orden, valores tradicionales y gradualismo',
  },
  {
    id: 'integrity',
    title: 'Corrupción y transparencia',
    prompt: '¿Qué tipo de respuesta esperas frente a la corrupción?',
    leftLabel: 'Control ciudadano y transparencia radical',
    rightLabel: 'Sanciones severas y autoridades con más poder de intervención',
  },
];

// Añade aquí tus candidatos reales desde VS Code.
// Los visitantes ya no pueden crear candidatos desde la web.
const CANDIDATES = [
  {
    name: 'Candidatura Horizonte',
    party: 'Movimiento Horizonte',
    summary: 'Perfil más orientado a reformas graduales, agenda social amplia y fortalecimiento de servicios públicos.',
    highlights: ['Servicios públicos', 'Inclusión', 'Descentralización'],
    positions: {
      security: 2,
      economy: 2,
      state: 2,
      regions: 1,
      rights: 1,
      integrity: 2,
    },
  },
  {
    name: 'Candidatura Orden',
    party: 'Alianza Orden y Futuro',
    summary: 'Perfil con énfasis en seguridad, autoridad estatal, inversión y control más centralizado.',
    highlights: ['Seguridad', 'Inversión', 'Gestión ejecutiva'],
    positions: {
      security: 5,
      economy: 5,
      state: 4,
      regions: 4,
      rights: 5,
      integrity: 4,
    },
  },
  {
    name: 'Candidatura Equilibrio',
    party: 'Acuerdo Nacional Ciudadano',
    summary: 'Perfil intermedio con foco en consensos, institucionalidad y balance entre crecimiento y protección social.',
    highlights: ['Institucionalidad', 'Consenso', 'Reactivación'],
    positions: {
      security: 3,
      economy: 3,
      state: 3,
      regions: 3,
      rights: 3,
      integrity: 3,
    },
  },
  {
    name: 'Candidatura Cambio',
    party: 'Frente Cambio País',
    summary: 'Perfil que prioriza descentralización, vigilancia ciudadana y cambios más intensos en distribución del poder.',
    highlights: ['Regiones', 'Transparencia', 'Participación'],
    positions: {
      security: 2,
      economy: 1,
      state: 2,
      regions: 1,
      rights: 2,
      integrity: 1,
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
  return Object.fromEntries(QUESTIONS.map((question) => [question.id, 3]));
}

function clampAnswer(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 3;
  return Math.max(1, Math.min(5, parsed));
}

function loadAnswers() {
  const defaults = getDefaultAnswers();
  const saved = localStorage.getItem(QUESTION_KEY);

  if (!saved) return defaults;

  try {
    const parsed = JSON.parse(saved);
    return QUESTIONS.reduce((acc, question) => {
      acc[question.id] = clampAnswer(parsed[question.id] ?? defaults[question.id]);
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

function answerTone(value) {
  if (value <= 2) return 'Más cerca del primer enfoque';
  if (value === 3) return 'Punto medio';
  return 'Más cerca del segundo enfoque';
}

function answerLabel(question, value) {
  if (value === 1) return question.leftLabel;
  if (value === 2) return `Más cerca de: ${question.leftLabel}`;
  if (value === 3) return 'Punto medio';
  if (value === 4) return `Más cerca de: ${question.rightLabel}`;
  return question.rightLabel;
}

function buildQuestionMarkup(question, value) {
  const options = [1, 2, 3, 4, 5]
    .map(
      (option) => `
        <label class="option-pill ${value === option ? 'is-selected' : ''}">
          <input
            class="sr-only"
            type="radio"
            name="${question.id}"
            value="${option}"
            ${value === option ? 'checked' : ''}
          />
          <span class="text-sm font-semibold">${option}</span>
        </label>
      `,
    )
    .join('');

  return `
    <fieldset class="question-card bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1">${question.title}</p>
          <p class="text-sm text-on-surface leading-6">${question.prompt}</p>
        </div>
        <span class="question-badge text-[11px] font-bold uppercase tracking-[0.18em] text-primary bg-white px-3 py-2 rounded-full whitespace-nowrap">${answerTone(value)}</span>
      </div>

      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[11px] text-on-surface-variant font-semibold mb-3">
        <span>${question.leftLabel}</span>
        <span class="text-primary/50">↔</span>
        <span class="text-right">${question.rightLabel}</span>
      </div>

      <div class="grid grid-cols-5 gap-2">${options}</div>
    </fieldset>
  `;
}

function renderQuestions() {
  form.innerHTML = QUESTIONS.map((question) => buildQuestionMarkup(question, currentAnswers[question.id])).join('');
  answersCount.textContent = `${QUESTIONS.length}/${QUESTIONS.length}`;
}

function calculateCandidateScore(candidate) {
  const issueScores = QUESTIONS.map((question) => {
    const userValue = currentAnswers[question.id];
    const candidateValue = clampAnswer(candidate.positions[question.id]);
    const distance = Math.abs(userValue - candidateValue);
    const affinity = Math.round((1 - distance / 4) * 100);

    return {
      question,
      userValue,
      candidateValue,
      affinity,
    };
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
                (highlight) => `<span class="px-3 py-1.5 rounded-full bg-primary-fixed/20 text-xs font-bold uppercase tracking-[0.18em] text-white">${highlight}</span>`,
              )
              .join('')}
          </div>
        </div>

        <div class="bg-white text-primary rounded-2xl p-5">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-2">Lectura rápida</p>
          <p class="font-headline text-xl font-extrabold mb-2">${gap > 0 ? `${gap} puntos por encima del segundo lugar` : 'Empate técnico entre primeros puestos'}</p>
          <p class="text-sm text-on-surface-variant leading-6">
            Tu perfil actual se acerca más a esta candidatura según los seis ejes analizados. Conviene revisar también el segundo y tercer lugar antes de cerrar una conclusión.
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
                    (highlight) => `<span class="px-3 py-1.5 rounded-full bg-white text-primary text-[11px] font-bold uppercase tracking-[0.18em]">${highlight}</span>`,
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
        const issue = candidate.issueScores.find((entry) => entry.question.id === question.id);
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
          <span class="question-badge text-[11px] font-bold uppercase tracking-[0.18em] text-primary bg-surface-container-low px-3 py-2 rounded-full">${answerTone(answer)}</span>
        </div>
        <div class="grid gap-3 md:grid-cols-3">${comparisons}</div>
      </section>
    `;
  }).join('');
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
  updateResults();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateResults();
  document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

resetButton.addEventListener('click', () => {
  currentAnswers = getDefaultAnswers();
  persistAnswers();
  renderQuestions();
  updateResults();
});

renderQuestions();
updateResults();
