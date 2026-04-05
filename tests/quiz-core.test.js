import { describe, expect, it } from 'vitest';
import {
  QUESTIONS,
  FIELD_MAP,
  POSITION_MAP,
  QUESTION_COMPATIBILITY,
  buildCandidates,
  calculateCandidateScore,
  isQuestionnaireComplete,
} from '../public/quiz-core.js';

function makeAnswers(value = 1) {
  return Object.fromEntries(QUESTIONS.map((question) => [question.id, value]));
}

function makeCandidate(overrides = {}) {
  return {
    name: overrides.name ?? 'Candidatura de prueba',
    party: overrides.party ?? 'Partido Demo',
    logo: overrides.logo ?? '/logo.png',
    photo: overrides.photo ?? '/photo.png',
    age: overrides.age ?? 50,
    profession: overrides.profession ?? 'Profesional',
    experience: overrides.experience ?? 'Experiencia pública',
    proposals: overrides.proposals ?? ['Gestión pública'],
    keyFact: overrides.keyFact ?? 'Dato clave',
    ideology: overrides.ideology ?? 'Centro',
    planUrl: overrides.planUrl ?? 'https://example.com/plan',
    cvUrl: overrides.cvUrl ?? 'https://example.com/cv',
    proposalText: overrides.proposalText ?? (overrides.proposals ?? ['Gestión pública']).join(' '),
    positions: overrides.positions ?? Object.fromEntries(QUESTIONS.map((question) => [question.id, 1])),
  };
}

function compareRanking(a, b) {
  if (b.score !== a.score) return b.score - a.score;
  if (b.exactMatches !== a.exactMatches) return b.exactMatches - a.exactMatches;
  if (b.evidenceAlignment !== a.evidenceAlignment) return b.evidenceAlignment - a.evidenceAlignment;
  return a.name.localeCompare(b.name, 'es');
}

describe('quiz-core', () => {
  it('expone 10 preguntas y mapeos de 10 ejes', () => {
    expect(QUESTIONS).toHaveLength(10);
    expect(Object.keys(FIELD_MAP)).toHaveLength(10);
    expect(Object.keys(POSITION_MAP)).toHaveLength(10);
    expect(FIELD_MAP.institutions).toBe('instituciones');
    expect(FIELD_MAP.employment).toBe('empleo_formalizacion');
  });

  it('detecta completitud solo con 10/10 respuestas', () => {
    const completeAnswers = makeAnswers(1);
    const partialAnswers = { ...completeAnswers, employment: null };

    expect(isQuestionnaireComplete(partialAnswers)).toBe(false);
    expect(isQuestionnaireComplete(completeAnswers)).toBe(true);
  });

  it('no convierte respuestas null a 2 al calcular score', () => {
    const answers = { ...makeAnswers(1), employment: null };
    const candidate = makeCandidate();
    const result = calculateCandidateScore(candidate, answers);
    const employmentIssue = result.issueScores.find((issue) => issue.question.id === 'employment');

    expect(result.score).toBeNull();
    expect(employmentIssue.userValue).toBeNull();
    expect(employmentIssue.affinity).toBeNull();
  });

  it('usa matrices categóricas de compatibilidad', () => {
    expect(QUESTION_COMPATIBILITY.economy[1][3]).toBeGreaterThan(QUESTION_COMPATIBILITY.economy[1][2]);
    expect(QUESTION_COMPATIBILITY.corruption[1][2]).toBeGreaterThan(QUESTION_COMPATIBILITY.corruption[2][3]);
    expect(QUESTION_COMPATIBILITY.corruption[2][3]).toBeGreaterThan(QUESTION_COMPATIBILITY.corruption[1][3]);
    expect(QUESTION_COMPATIBILITY.institutions[2][3]).toBeGreaterThan(QUESTION_COMPATIBILITY.institutions[1][3]);
  });

  it('mantiene el score principal aunque el NLP contradiga la posición curada', () => {
    const answers = makeAnswers(1);
    const positions = Object.fromEntries(QUESTIONS.map((question) => [question.id, 1]));

    const withoutEvidence = makeCandidate({
      name: 'Sin evidencia',
      positions,
      proposalText: '',
    });

    const withContradiction = makeCandidate({
      name: 'Con contradicción',
      positions,
      proposalText: 'intervencion estatal control de precios transparencia control ciudadano',
    });

    const baseline = calculateCandidateScore(withoutEvidence, answers);
    const contradicted = calculateCandidateScore(withContradiction, answers);

    expect(baseline.score).toBe(100);
    expect(contradicted.score).toBe(100);
    expect(contradicted.evidenceAlignment).toBeLessThanOrEqual(baseline.evidenceAlignment);
  });

  it('desempata primero por exactMatches y luego por evidenceAlignment', () => {
    const answers = makeAnswers(1);

    const moreExact = makeCandidate({
      name: 'Más exacta',
      positions: {
        ...makeAnswers(1),
        security: 2,
        institutions: 2,
      },
      proposalText: 'orden interno reforma del estado',
    });

    const fewerExact = makeCandidate({
      name: 'Menos exacta',
      positions: {
        ...makeAnswers(1),
        economy: 3,
        corruption: 2,
        employment: 3,
      },
      proposalText: 'libre mercado educacion tecnica',
    });

    const rankedByExactMatches = [
      calculateCandidateScore(fewerExact, answers),
      calculateCandidateScore(moreExact, answers),
    ].sort(compareRanking);

    expect(rankedByExactMatches[0].score).toBe(rankedByExactMatches[1].score);
    expect(rankedByExactMatches[0].exactMatches).toBeGreaterThan(rankedByExactMatches[1].exactMatches);
    expect(rankedByExactMatches[0].name).toBe('Más exacta');

    const highEvidence = makeCandidate({
      name: 'Alta evidencia',
      positions: Object.fromEntries(QUESTIONS.map((question) => [question.id, 1])),
      proposalText: 'orden interno libre mercado educacion privada salud privada pena de muerte inversion minera gobierno central bonos inversion privada autoridad',
    });

    const lowEvidence = makeCandidate({
      name: 'Baja evidencia',
      positions: Object.fromEntries(QUESTIONS.map((question) => [question.id, 1])),
      proposalText: '',
    });

    const rankedByEvidence = [
      calculateCandidateScore(lowEvidence, answers),
      calculateCandidateScore(highEvidence, answers),
    ].sort(compareRanking);

    expect(rankedByEvidence[0].score).toBe(rankedByEvidence[1].score);
    expect(rankedByEvidence[0].exactMatches).toBe(rankedByEvidence[1].exactMatches);
    expect(rankedByEvidence[0].evidenceAlignment).toBeGreaterThan(rankedByEvidence[1].evidenceAlignment);
    expect(rankedByEvidence[0].name).toBe('Alta evidencia');
  });

  it('mapea correctamente los nuevos ejes desde datos editoriales', () => {
    const [candidate] = buildCandidates([
      {
        nombre: 'Test',
        partido: 'Partido Test',
        logo_partido: '/logo.png',
        foto: '/foto.png',
        edad: 45,
        profesion: 'Analista',
        experiencia_politica: 'Experiencia demo',
        propuestas: ['Reforma del Estado', 'Capacitación técnica'],
        dato_clave: 'Control ciudadano y formalización',
        partido_ideologia: 'Centro',
        plan_gobierno_url: 'https://example.com/plan',
        hoja_vida_url: 'https://example.com/cv',
        quiz_posiciones: {
          seguridad: 'reforma_institucional',
          economia: 'mixta',
          educacion: 'mixta',
          salud: 'mixto',
          corrupcion: 'reforma_judicial',
          mineria: 'regulacion_estricta',
          descentralizacion: 'gradual',
          politica_social: 'educacion_tecnica',
          instituciones: 'transparencia_control',
          empleo_formalizacion: 'capacitacion_formalizacion',
        },
      },
    ]);

    expect(candidate.positions.institutions).toBe(3);
    expect(candidate.positions.employment).toBe(3);
  });
});
