import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const projectRoot = process.cwd();
const plansDir = join(projectRoot, "public", "planes-gobierno");
function normalizeKey(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}
const aliases = {
  "alianza para el progreso": ["app"],
  "ahora nacion": ["ahora nacion"],
  "avanza pais": ["avanza pais"],
  "cooperacion popular": ["cooperacion popular"],
  "fe en el peru": ["fe en el peru"],
  "frente de la esperanza": ["frente de la esperanza"],
  "fuerza popular": ["fuerza popular"],
  "fuerza y libertad": ["fuerza y libertad"],
  "integridad democratica": ["integridad democratica"],
  "juntos por el peru": ["jp"],
  "libertad popular": ["libertad popular"],
  "pais para todos": ["pais para todos"],
  "partido democrata unido peru": ["partido democrata unido", "unido peru"],
  "partido del buen gobierno": ["pbg"],
  "partido morado": ["partido morado"],
  "partido patriotico del peru": ["ppp"],
  "peru accion": ["peru accion"],
  "peru libre": ["peru libre"],
  "peru moderno": ["peru moderno"],
  "peru primero": ["peru primero"],
  "podemos peru": ["podemos peru"],
  "prin": ["prin"],
  "progresemos": ["progresamos"],
  "pte": ["pte"],
  "renovacion popular": ["renovacion popular"],
  "salvemos al peru": ["salvemos al peru"],
  "si creo": ["sicreo"],
  "somos peru": ["somos peru"],
  "un camino diferente": ["un camino diferente"],
  "unidad nacional": ["unidad nacional"],
  "venceremos": ["venceremos"]
};
const pdfFiles = existsSync(plansDir) ? readdirSync(plansDir).filter((file) => file.toLowerCase().endsWith(".pdf")) : [];
const pdfIndex = new Map(pdfFiles.map((file) => [normalizeKey(file.replace(/\.pdf$/i, "")), file]));
function getPlanPdfHref(party) {
  const normalizedParty = normalizeKey(party);
  const candidates = [normalizedParty, ...aliases[normalizedParty] ?? []];
  for (const candidate of candidates) {
    const match = pdfIndex.get(candidate);
    if (match) {
      return `/planes-gobierno/${encodeURIComponent(match)}`;
    }
  }
  return `/planes-de-gobierno?partido=${encodeURIComponent(party)}`;
}
function getAllPlanPdfs() {
  return pdfFiles.slice().sort((a, b) => a.localeCompare(b, "es")).map((file) => ({
    file,
    label: file.replace(/\.pdf$/i, ""),
    href: `/planes-gobierno/${encodeURIComponent(file)}`,
    key: normalizeKey(file.replace(/\.pdf$/i, ""))
  }));
}

export { getAllPlanPdfs as a, getPlanPdfHref as g, normalizeKey as n };
