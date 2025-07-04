document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('upcoming-screenings');
  if (!container) return;

  try {
    const res = await fetch('/api/screenings/upcoming');
    const screenings = await res.json();

    if (!screenings.length) {
      container.innerHTML = '<p class="text-muted">Inga visningar de kommande dagarna.</p>';
      return;
    }

    container.innerHTML = `
      <ul class="list-group">
        ${screenings.map(s => `
          <li class="list-group-item">
            <strong>${s.attributes.movie.data.attributes.title}</strong>
            <br>
            ${new Date(s.attributes.time).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })}
          </li>
        `).join('')}
      </ul>
    `;
  } catch {
    container.innerHTML = '<p class="text-muted">Kunde inte ladda visningar.</p>';
  }
});