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
