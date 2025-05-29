document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('popular-movies');
  if (!container) return;

  try {
    const res = await fetch('/api/popular-movies');
    const movies = await res.json();

    if (!movies.length) {
      container.innerHTML = '<p class="text-muted">Inga populära filmer just nu.</p>';
      return;
    }

    container.innerHTML = `
      <ul class="list-group">
        ${movies.map(m => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${m.title}</span>
            <span class="badge bg-warning text-dark">${m.avgRating.toFixed(1)} ★</span>
          </li>
        `).join('')}
      </ul>
    `;
  } catch {
    container.innerHTML = '<p class="text-muted">Kunde inte ladda populära filmer.</p>';
  }
});