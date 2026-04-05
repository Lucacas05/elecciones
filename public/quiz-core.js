export const QUESTIONS = [
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
  {
    id: 'institutions',
    title: 'Instituciones',
    prompt: '¿Qué debería priorizar el próximo gobierno para que el Estado funcione mejor?',
    options: [
      { value: 1, label: 'Un Ejecutivo con más autoridad para ordenar el país y destrabar decisiones.' },
      { value: 2, label: 'Reforma del Estado con meritocracia, digitalización y mejores servicios.' },
      { value: 3, label: 'Más controles, transparencia y vigilancia ciudadana sobre el poder.' },
    ],
  },
  {
    id: 'employment',
    title: 'Empleo',
    prompt: '¿Cuál debería ser la principal estrategia para crear empleo formal?',
    options: [
      { value: 1, label: 'Menos trabas e incentivos para inversión privada y contratación.' },
      { value: 2, label: 'Programas públicos de empleo, obras y apoyo directo desde el Estado.' },
      { value: 3, label: 'Capacitación técnica, apoyo a MYPEs y formalización gradual.' },
    ],
  },
];

export const FIELD_MAP = {
  security: 'seguridad',
  economy: 'economia',
  education: 'educacion',
  health: 'salud',
  corruption: 'corrupcion',
  mining: 'mineria',
  decentralization: 'descentralizacion',
  social_policy: 'politica_social',
  institutions: 'instituciones',
  employment: 'empleo_formalizacion',
};

export const POSITION_MAP = {
  security: { mano_dura: 1, reforma_institucional: 2, prevencion: 3 },
  economy: { libre_mercado: 1, intervencion_estatal: 2, mixta: 3 },
  education: { publica_prioridad: 1, privada_incentivo: 2, mixta: 3 },
  health: { sistema_universal: 1, privado_complementario: 2, mixto: 3 },
  corruption: { pena_muerte: 1, cadena_perpetua: 2, reforma_judicial: 3 },
  mining: { pro_mineria: 1, regulacion_estricta: 2, consulta_previa: 3 },
  decentralization: { mas_poder_regiones: 1, gobierno_central: 2, gradual: 3 },
  social_policy: { bonos_directos: 1, programas_empleo: 2, educacion_tecnica: 3 },
  institutions: { autoridad_ejecutiva: 1, reforma_estado: 2, transparencia_control: 3 },
  employment: { inversion_privada: 1, empleo_publico: 2, capacitacion_formalizacion: 3 },
};

export const QUESTION_COMPATIBILITY = {
  security: {
    1: { 1: 1, 2: 0.45, 3: 0.1 },
    2: { 1: 0.45, 2: 1, 3: 0.55 },
    3: { 1: 0.1, 2: 0.55, 3: 1 },
  },
  economy: {
    1: { 1: 1, 2: 0.1, 3: 0.7 },
    2: { 1: 0.1, 2: 1, 3: 0.7 },
    3: { 1: 0.7, 2: 0.7, 3: 1 },
  },
  education: {
    1: { 1: 1, 2: 0.1, 3: 0.7 },
    2: { 1: 0.1, 2: 1, 3: 0.7 },
    3: { 1: 0.7, 2: 0.7, 3: 1 },
  },
  health: {
    1: { 1: 1, 2: 0.15, 3: 0.7 },
    2: { 1: 0.15, 2: 1, 3: 0.7 },
    3: { 1: 0.7, 2: 0.7, 3: 1 },
  },
  corruption: {
    1: { 1: 1, 2: 0.7, 3: 0.1 },
    2: { 1: 0.7, 2: 1, 3: 0.25 },
    3: { 1: 0.1, 2: 0.25, 3: 1 },
  },
  mining: {
    1: { 1: 1, 2: 0.2, 3: 0.35 },
    2: { 1: 0.2, 2: 1, 3: 0.6 },
    3: { 1: 0.35, 2: 0.6, 3: 1 },
  },
  decentralization: {
    1: { 1: 1, 2: 0.1, 3: 0.7 },
    2: { 1: 0.1, 2: 1, 3: 0.45 },
    3: { 1: 0.7, 2: 0.45, 3: 1 },
  },
  social_policy: {
    1: { 1: 1, 2: 0.55, 3: 0.2 },
    2: { 1: 0.55, 2: 1, 3: 0.55 },
    3: { 1: 0.2, 2: 0.55, 3: 1 },
  },
  institutions: {
    1: { 1: 1, 2: 0.55, 3: 0.15 },
    2: { 1: 0.55, 2: 1, 3: 0.65 },
    3: { 1: 0.15, 2: 0.65, 3: 1 },
  },
  employment: {
    1: { 1: 1, 2: 0.15, 3: 0.6 },
    2: { 1: 0.15, 2: 1, 3: 0.5 },
    3: { 1: 0.6, 2: 0.5, 3: 1 },
  },
};

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
      { keyword: 'asistencia tecnica', weight: 2.2 },
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
  institutions: {
    autoridad_ejecutiva: [
      { keyword: 'orden interno', weight: 2.5 },
      { keyword: 'estado de emergencia', weight: 2.5 },
      { keyword: 'sanciones severas', weight: 2.2 },
      { keyword: 'mando fuerte', weight: 2.2 },
      { keyword: 'autoridad', weight: 1.8 },
    ],
    reforma_estado: [
      { keyword: 'reforma del estado', weight: 3.0 },
      { keyword: 'reforma institucional', weight: 2.7 },
      { keyword: 'digitalizar tramites', weight: 2.5 },
      { keyword: 'gestion publica', weight: 2.1 },
      { keyword: 'meritocracia', weight: 2.1 },
      { keyword: 'modernizacion estatal', weight: 2.3 },
      { keyword: 'agilizar servicios', weight: 2.3 },
    ],
    transparencia_control: [
      { keyword: 'transparencia', weight: 2.6 },
      { keyword: 'rendicion de cuentas', weight: 2.6 },
      { keyword: 'control ciudadano', weight: 2.8 },
      { keyword: 'control fiscal', weight: 2.5 },
      { keyword: 'fiscalias especializadas', weight: 2.7 },
      { keyword: 'fiscalizacion', weight: 2.4 },
    ],
  },
  employment: {
    inversion_privada: [
      { keyword: 'inversion privada', weight: 3.0 },
      { keyword: 'simplificacion', weight: 2.3 },
      { keyword: 'desregulacion', weight: 2.5 },
      { keyword: 'emprendimiento', weight: 2.1 },
      { keyword: 'reducir barreras', weight: 2.4 },
      { keyword: 'liberalizacion economica', weight: 2.6 },
    ],
    empleo_publico: [
      { keyword: 'empleo temporal', weight: 3.0 },
      { keyword: 'obras locales', weight: 2.7 },
      { keyword: 'obras publicas', weight: 2.7 },
      { keyword: 'inversion publica', weight: 2.4 },
      { keyword: 'viviendas sociales', weight: 2.5 },
      { keyword: 'infraestructura regional', weight: 2.1 },
    ],
    capacitacion_formalizacion: [
      { keyword: 'educacion tecnica', weight: 3.0 },
      { keyword: 'capacitacion tecnica', weight: 2.8 },
      { keyword: 'insercion laboral', weight: 2.7 },
      { keyword: 'formalizacion', weight: 2.6 },
      { keyword: 'pymes', weight: 2.0 },
      { keyword: 'microempresa', weight: 2.0 },
      { keyword: 'empleo juvenil', weight: 2.1 },
    ],
  },
};

function normalizeText(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeAnswer(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return Math.max(1, Math.min(3, parsed));
}

function getCompatibility(questionId, leftValue, rightValue) {
  const left = normalizeAnswer(leftValue);
  const right = normalizeAnswer(rightValue);
  if (left === null || right === null) return null;
  return QUESTION_COMPATIBILITY[questionId]?.[left]?.[right] ?? null;
}

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
    numericValue: POSITION_MAP[questionId]?.[dominantPosition] ?? null,
    confidence: dominantScore / totalScore,
  };
}

export function buildCandidates(rawData = []) {
  return rawData.map((candidate) => {
    const positions = {};

    for (const question of QUESTIONS) {
      const yamlKey = FIELD_MAP[question.id];
      const stringValue = candidate.quiz_posiciones?.[yamlKey];
      positions[question.id] = POSITION_MAP[question.id]?.[stringValue] ?? null;
    }

    const proposalText = [...(candidate.propuestas ?? []), candidate.dato_clave ?? ''].join(' ');

    return {
      name: candidate.nombre,
      party: candidate.partido,
      logo: candidate.logo_partido,
      photo: candidate.foto,
      age: candidate.edad,
      profession: candidate.profesion,
      experience: candidate.experiencia_politica,
      proposals: candidate.propuestas ?? [],
      keyFact: candidate.dato_clave,
      ideology: candidate.partido_ideologia,
      planUrl: candidate.plan_gobierno_url,
      cvUrl: candidate.hoja_vida_url,
      positions,
      proposalText,
    };
  });
}

export function isQuestionnaireComplete(answers = {}) {
  return QUESTIONS.every((question) => normalizeAnswer(answers[question.id]) !== null);
}

export function calculateCandidateScore(candidate, answers = {}) {
  const issueScores = QUESTIONS.map((question) => {
    const userValue = normalizeAnswer(answers[question.id]);
    const candidateValue = normalizeAnswer(candidate.positions?.[question.id]);
    const similarity = getCompatibility(question.id, userValue, candidateValue);
    const affinity = similarity === null ? null : Math.round(similarity * 100);

    return {
      question,
      userValue,
      candidateValue,
      affinity,
    };
  });

  let evidenceAlignment = 0;
  for (const question of QUESTIONS) {
    const partyContext = analyzePartyContext(candidate.proposalText, question.id);
    const candidateValue = normalizeAnswer(candidate.positions?.[question.id]);

    if (partyContext && candidateValue !== null && partyContext.numericValue === candidateValue) {
      evidenceAlignment += partyContext.confidence;
    }
  }

  const complete = isQuestionnaireComplete(answers);
  const answeredScores = issueScores.filter((issue) => issue.affinity !== null);

  const score = complete
    ? Math.round(answeredScores.reduce((sum, issue) => sum + issue.affinity, 0) / QUESTIONS.length)
    : null;

  const exactMatches = complete ? answeredScores.filter((issue) => issue.affinity === 100).length : 0;

  return {
    ...candidate,
    score,
    exactMatches,
    evidenceAlignment: Number(evidenceAlignment.toFixed(3)),
    issueScores,
    strongestMatches: complete
      ? issueScores
          .slice()
          .sort((a, b) => (b.affinity ?? -1) - (a.affinity ?? -1))
          .slice(0, 3)
      : [],
  };
}
