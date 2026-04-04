const form = document.getElementById('candidate-form');
const card = document.getElementById('candidate-card');

const starterCandidate = {
  name: 'Carlos Álvarez',
  party: 'País para Todos',
  photoDataUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
  pdfDataUrl: 'https://mpesije.jne.gob.pe/docs/76291ee3-eba2-4c88-adef-2530f2d70bb8.pdf',
  summary: `1) Eje central del plan: seguridad como condición para todo.
Propone "orden y autoridad" para enfrentar extorsión, crimen organizado y corrupción, con enfoque de mano firme dentro del Estado de derecho.

2) Prioridades país 2026-2031:
• Recuperar la seguridad ciudadana.
• Reactivar la economía con empleo formal y productividad.
• Lucha frontal anticorrupción con transparencia y simplificación del Estado.
• Inversión social efectiva para cerrar brechas.

3) Enfoques transversales:
• Seguridad habilitadora del desarrollo.
• Derechos y legalidad democrática.
• Equidad e igualdad de oportunidades para población vulnerable.
• Enfoque territorial (soluciones por región y realidad local).
• Gestión con evidencia, indicadores y metas medibles.

4) Primera dimensión social destacada:
Anemia infantil e inseguridad alimentaria como urgencia nacional, con meta de reducir al menos 5 puntos porcentuales por año en anemia infantil y mejorar tamizaje/suplementación.

5) Visión 2031:
Un Perú sin miedo, con trabajo digno, servicios públicos que funcionen, y un Estado más eficiente, íntegro y con capacidad de ejecución.`
};

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(data) {
  const safePhoto = data.photoDataUrl || starterCandidate.photoDataUrl;
  const safePdf   = data.pdfDataUrl   || starterCandidate.pdfDataUrl;

  card.classList.remove('empty');
  card.innerHTML = `
    <div class="card-hero">
      <div class="card-hero-content">
        <img class="card-photo" src="${safePhoto}" alt="Foto de ${escHtml(data.name)}" />
        <div class="card-hero-text">
          <h3 class="card-name">${escHtml(data.name)}</h3>
          <span class="card-badge">
            <span class="material-icons-round">account_balance</span>
            ${escHtml(data.party)}
          </span>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-cta">
        <div class="card-cta-text">
          <h4>Plan de Gobierno</h4>
          <p>Documento completo en PDF</p>
        </div>
        <a class="btn-pdf" href="${safePdf}" target="_blank" rel="noopener">
          <span class="material-icons-round">picture_as_pdf</span>
          Ver / Descargar
        </a>
      </div>
      <div class="card-section">
        <div class="section-label">
          <span class="material-icons-round">summarize</span>
          Resumen ejecutivo
        </div>
        <div class="summary-text">${escHtml(data.summary)}</div>
      </div>
    </div>
  `;
}

// Update file input labels on selection
document.getElementById('photo').addEventListener('change', (e) => {
  const label = document.getElementById('photo-label');
  if (e.target.files[0]) label.textContent = e.target.files[0].name;
});
document.getElementById('plan').addEventListener('change', (e) => {
  const label = document.getElementById('plan-label');
  if (e.target.files[0]) label.textContent = e.target.files[0].name;
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const party   = document.getElementById('party').value.trim();
  const summary = document.getElementById('summary').value.trim();
  const photo   = document.getElementById('photo').files[0];
  const plan    = document.getElementById('plan').files[0];

  if (!photo || !plan) return;

  const [photoDataUrl, pdfDataUrl] = await Promise.all([
    readAsDataURL(photo),
    readAsDataURL(plan),
  ]);

  const payload = { name, party, summary, photoDataUrl, pdfDataUrl };
  localStorage.setItem('elecciones:lastCandidate', JSON.stringify(payload));
  render(payload);
});

const saved = localStorage.getItem('elecciones:lastCandidate');
if (saved) {
  try {
    render(JSON.parse(saved));
  } catch (_) {
    render(starterCandidate);
  }
} else {
  render(starterCandidate);
}
