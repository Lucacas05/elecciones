const form = document.getElementById('candidate-form');
const card = document.getElementById('candidate-card');

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function render(data) {
  card.classList.remove('empty');
  card.innerHTML = `
    <img src="${data.photoDataUrl}" alt="Foto de ${data.name}" />
    <div class="candidate-meta">
      <h3>${data.name}</h3>
      <p>${data.party}</p>
    </div>
    <h4>Resumen ejecutivo</h4>
    <div class="summary">${data.summary}</div>
    <div class="actions">
      <a href="${data.pdfDataUrl}" download="plan-${data.name.toLowerCase().replaceAll(' ', '-')}.pdf">Descargar plan (PDF)</a>
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
  try { render(JSON.parse(saved)); } catch (_) {}
}
