document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('movie-screenings');
  if (!container) return;

  const movieId = window.location.pathname.split('/').pop();

  try {
    const res = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings?filters[movie]=${movieId}&populate=movie`);
    const data = await res.json();
    const screenings = data.data || [];

    // Filtrera ut screenings med giltigt datum
    const validScreenings = screenings.filter(s => {
      const t = s.attributes.time;
      return t && !isNaN(new Date(t));
    });

    if (!validScreenings.length) {
      container.innerHTML = '<p class="text-muted">Inga visningar för denna film.</p>';
      return;
    }

    container.innerHTML = `
      <ul class="list-group">
        ${validScreenings.map(s => {
          const d = new Date(s.attributes.time);
          const formatted = d.toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
          return `<li class="list-group-item">${formatted}</li>`;
        }).join('')}
      </ul>
    `;
  } catch {
    container.innerHTML = '<p class="text-muted">Kunde inte ladda visningar.</p>';
  }
});