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
    <!-- Card Hero -->
    <div class="card-hero">
      <div class="relative flex items-start gap-5 z-10">
        <img
          class="w-20 h-20 object-cover rounded-xl border-[3px] border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex-shrink-0"
          src="${safePhoto}"
          alt="Foto de ${escHtml(data.name)}"
        />
        <div class="pt-1">
          <h3 class="font-headline font-extrabold text-xl text-white tracking-tight leading-tight mb-3">
            ${escHtml(data.name)}
          </h3>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.12] border border-white/20 rounded-[2rem] text-white/90 text-xs font-semibold backdrop-blur-sm">
            <span class="material-symbols-outlined text-sm">account_balance</span>
            ${escHtml(data.party)}
          </span>
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-6 -mt-4 relative z-10 space-y-4">
      <!-- PDF CTA -->
      <div class="flex items-center justify-between p-5 bg-gradient-to-r from-surface-container-low to-surface-container rounded-2xl border border-outline-variant/10 shadow-[0_2px_12px_rgba(0,27,68,0.06)]">
        <div>
          <h4 class="font-headline font-bold text-sm text-primary mb-0.5">Plan de Gobierno</h4>
          <p class="text-xs text-on-surface-variant">Documento completo en PDF</p>
        </div>
        <a
          class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm"
          href="${safePdf}"
          target="_blank"
          rel="noopener"
        >
          <span class="material-symbols-outlined text-sm">description</span>
          Ver PDF
        </a>
      </div>

      <!-- Summary Section -->
      <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-sm text-primary">summarize</span>
          <span class="text-[0.7rem] font-bold uppercase tracking-widest text-primary">Resumen ejecutivo</span>
        </div>
        <div class="summary-text text-sm text-on-surface-variant font-body">${escHtml(data.summary)}</div>
      </div>

      <!-- Key Metrics Row -->
      <div class="grid grid-cols-3 gap-3">
        <div class="p-4 bg-surface-container rounded-xl text-center">
          <span class="material-symbols-outlined text-primary mb-1 text-xl">shield</span>
          <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Seguridad</p>
        </div>
        <div class="p-4 bg-surface-container rounded-xl text-center">
          <span class="material-symbols-outlined text-primary mb-1 text-xl">payments</span>
          <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Economía</p>
        </div>
        <div class="p-4 bg-surface-container rounded-xl text-center">
          <span class="material-symbols-outlined text-primary mb-1 text-xl">groups</span>
          <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Social</p>
        </div>
      </div>
    </div>
  `;
}

// Update file input labels on selection
document.getElementById('photo').addEventListener('change', (e) => {
  const label = document.getElementById('photo-label');
  if (e.target.files[0]) {
    label.textContent = e.target.files[0].name;
    label.closest('.file-input-ui').classList.add('border-primary', 'text-primary', 'bg-primary-fixed/20');
    label.closest('.file-input-ui').classList.remove('border-outline-variant/40');
  }
});
document.getElementById('plan').addEventListener('change', (e) => {
  const label = document.getElementById('plan-label');
  if (e.target.files[0]) {
    label.textContent = e.target.files[0].name;
    label.closest('.file-input-ui').classList.add('border-primary', 'text-primary', 'bg-primary-fixed/20');
    label.closest('.file-input-ui').classList.remove('border-outline-variant/40');
  }
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
