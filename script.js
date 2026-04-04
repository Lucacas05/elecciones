const form = document.getElementById('candidate-form');
const card = document.getElementById('candidate-card');

const starterCandidate = {
  name: 'Carlos Álvarez',
  party: 'País para Todos',
  photoDataUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
  pdfDataUrl: 'https://mpesije.jne.gob.pe/docs/76291ee3-eba2-4c88-adef-2530f2d70bb8.pdf',
  summary: `1) Eje central del plan: seguridad como condición para todo.
Propone “orden y autoridad” para enfrentar extorsión, crimen organizado y corrupción, con enfoque de mano firme dentro del Estado de derecho.

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

function render(data) {
  const safePhoto = data.photoDataUrl || starterCandidate.photoDataUrl;
  const safePdf = data.pdfDataUrl || starterCandidate.pdfDataUrl;

  card.classList.remove('empty');
  card.innerHTML = `
    <img src="${safePhoto}" alt="Foto de ${data.name}" />
    <div class="candidate-meta">
      <h3>${data.name}</h3>
      <p>${data.party}</p>
    </div>
    <h4>Resumen ejecutivo</h4>
    <div class="summary">${data.summary}</div>
    <div class="actions">
      <a href="${safePdf}" target="_blank" rel="noopener">Ver/Descargar plan (PDF)</a>
    </div>
  `;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const party = document.getElementById('party').value.trim();
  const summary = document.getElementById('summary').value.trim();
  const photo = document.getElementById('photo').files[0];
  const plan = document.getElementById('plan').files[0];

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
