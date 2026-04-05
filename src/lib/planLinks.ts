export function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const aliases: Record<string, string[]> = {
  'alianza para el progreso': ['app'],
  'ahora nacion': ['ahora nacion'],
  'avanza pais': ['avanza pais'],
  'cooperacion popular': ['cooperacion popular'],
  'fe en el peru': ['fe en el peru'],
  'frente de la esperanza': ['frente de la esperanza'],
  'fuerza popular': ['fuerza popular'],
  'fuerza y libertad': ['fuerza y libertad'],
  'integridad democratica': ['integridad democratica'],
  'juntos por el peru': ['jp'],
  'libertad popular': ['libertad popular'],
  'pais para todos': ['pais para todos'],
  'partido democrata unido peru': ['partido democrata unido', 'unido peru'],
  'partido del buen gobierno': ['pbg'],
  'partido morado': ['partido morado'],
  'partido patriotico del peru': ['ppp'],
  'peru accion': ['peru accion'],
  'peru libre': ['peru libre'],
  'peru moderno': ['peru moderno'],
  'peru primero': ['peru primero'],
  'podemos peru': ['podemos peru'],
  'prin': ['prin'],
  'progresemos': ['progresamos'],
  'pte': ['pte'],
  'renovacion popular': ['renovacion popular'],
  'salvemos al peru': ['salvemos al peru'],
  'si creo': ['sicreo'],
  'somos peru': ['somos peru'],
  'un camino diferente': ['un camino diferente'],
  'unidad nacional': ['unidad nacional'],
  'venceremos': ['venceremos'],
};

const pdfFiles = [
  'APP.pdf',
  'APRA.pdf',
  'Ahora Nacion.pdf',
  'Avanza Pais.pdf',
  'Cooperacion Popular.pdf',
  'Democrata Verde.pdf',
  'Fe en el Peru.pdf',
  'Frente de la Esperanza.pdf',
  'Fuerza Popular.pdf',
  'Fuerza y Libertad.pdf',
  'Integridad Democratica.pdf',
  'JP.pdf',
  'Libertad Popular.pdf',
  'PBG.pdf',
  'PPP.pdf',
  'PRIN.pdf',
  'PTE.pdf',
  'Pais para Todos.pdf',
  'Partido Civico.pdf',
  'Partido Democrata Unido.pdf',
  'Partido Morado.pdf',
  'Peru Accion.pdf',
  'Peru Libre.pdf',
  'Peru Moderno.pdf',
  'Peru Primero.pdf',
  'Podemos Peru.pdf',
  'Progresamos.pdf',
  'Renovacion Popular.pdf',
  'Salvemos al Peru.pdf',
  'SiCreo.pdf',
  'Somos Peru.pdf',
  'Un Camino Diferente.pdf',
  'Unidad Nacional.pdf',
  'Unido Peru.pdf',
  'Venceremos.pdf',
] as const;

const pdfIndex = new Map(pdfFiles.map((file) => [normalizeKey(file.replace(/\.pdf$/i, '')), file]));

export function getPlanPdfHref(party: string) {
  const normalizedParty = normalizeKey(party);
  const candidates = [normalizedParty, ...(aliases[normalizedParty] ?? [])];

  for (const candidate of candidates) {
    const match = pdfIndex.get(candidate);
    if (match) {
      return `/planes-gobierno/${encodeURIComponent(match)}`;
    }
  }

  return `/planes-de-gobierno?partido=${encodeURIComponent(party)}`;
}

export function getAllPlanPdfs() {
  return pdfFiles
    .slice()
    .sort((a, b) => a.localeCompare(b, 'es'))
    .map((file) => ({
      file,
      label: file.replace(/\.pdf$/i, ''),
      href: `/planes-gobierno/${encodeURIComponent(file)}`,
      key: normalizeKey(file.replace(/\.pdf$/i, '')),
    }));
}
