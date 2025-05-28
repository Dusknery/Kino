document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('upcoming-screenings');
  if (!container) return;

  try {
    const res = await fetch('/api/screenings/upcoming');
    const screenings = await res.json();

    if (screenings.length === 0) {
      container.innerHTML = '<p>Inga kommande visningar.</p>';
      return;
    }

    container.innerHTML = `
      <ul class="list-group list-group-flush">
        ${screenings.map(s => `
          <li class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <strong>${s.attributes.movie.data.attributes.title}</strong>
              <div class="text-muted small">${new Date(s.attributes.time).toLocaleString('sv-SE')}</div>
            </div>
            <span class="badge bg-secondary mt-2 mt-md-0">Salong: ${s.attributes.salon || 'Okänd'}</span>
          </li>
        `).join('')}
      </ul>
    `;
  } catch (err) {
    container.innerHTML = '<p>Kunde inte ladda visningar.</p>';
  }
});