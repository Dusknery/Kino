document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('movie-search');
  const movieCards = document.querySelectorAll('.movie-card');

  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    movieCards.forEach(card => {
      const title = card.querySelector('h5').textContent.toLowerCase();
      card.style.display = title.includes(query) ? '' : 'none';
    });
  });
});