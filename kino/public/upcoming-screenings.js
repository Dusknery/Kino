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
      <h2>Kommande visningar</h2>
      <ul class="list-group">
        ${screenings.map(s => `
          <li class="list-group-item">
            <strong>${s.attributes.movie.data.attributes.title}</strong>
            <br>
            ${new Date(s.attributes.time).toLocaleString('sv-SE')}
            <br>
            Salong: ${s.attributes.salon || 'Okänd'}
          </li>
        `).join('')}
      </ul>
    `;
  } catch (err) {
    container.innerHTML = '<p>Kunde inte ladda visningar.</p>';
  }
});