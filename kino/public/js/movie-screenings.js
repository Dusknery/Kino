document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('movie-screenings');
  if (!container) return;

  const movieId = window.location.pathname.split('/').pop();

  try {
    // Hämta visningar för denna film direkt från CMS-API:et
    const res = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings?filters[movie]=${movieId}&populate=movie`);
    const data = await res.json();
    const screenings = data.data || [];

    if (!screenings.length) {
      container.innerHTML = '<p class="text-muted">Inga visningar för denna film.</p>';
      return;
    }

    container.innerHTML = `
      <ul class="list-group">
        ${screenings.map(s => `
          <li class="list-group-item">
            ${new Date(s.attributes.time).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })}
          </li>
        `).join('')}
      </ul>
    `;
  } catch {
    container.innerHTML = '<p class="text-muted">Kunde inte ladda visningar.</p>';
  }
});