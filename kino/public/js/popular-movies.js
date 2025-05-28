document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('popular-movies');
  if (!container) return;

  try {
    const res = await fetch('/api/popular-movies');
    const movies = await res.json();

    if (movies.length === 0) {
      container.innerHTML = '<p>Inga populära filmer just nu.</p>';
      return;
    }

    container.innerHTML = `
      <h2>Mest populära filmer (senaste 30 dagar)</h2>
      <ul class="list-group">
        ${movies.map(m => `
          <li class="list-group-item">
            <strong>${m.title}</strong> – Betyg: ${m.avgRating.toFixed(2)}
          </li>
        `).join('')}
      </ul>
    `;
  } catch (err) {
    container.innerHTML = '<p>Kunde inte ladda populära filmer.</p>';
  }
});