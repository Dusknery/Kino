document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('movie-reviews');
  if (!container) return;

  let page = 1;
  const pageSize = 5;
  const movieId = window.location.pathname.split('/').pop();

  async function loadReviews() {
    try {
      const res = await fetch(`/api/reviews?movieId=${movieId}&page=${page}`);
      const data = await res.json();
      const reviews = data.data || [];
      const meta = data.meta?.pagination || {};

      if (!reviews.length) {
        container.innerHTML = '<p class="text-muted fst-italic">Inga recensioner än.</p>';
        return;
      }

      container.innerHTML = `
        <ul class="list-group mb-3">
          ${reviews.map(r => `
            <li class="list-group-item">
              <strong>${r.attributes.author || 'Anonym'}</strong>
              – <span class="text-warning">${'★'.repeat(r.attributes.rating)}</span>
              <br>
              <span class="fst-italic">${r.attributes.comment}</span>
            </li>
          `).join('')}
        </ul>
        <div class="d-flex justify-content-between">
          <button id="prev-reviews" class="btn btn-outline-secondary" ${page <= 1 ? 'disabled' : ''}>Föregående</button>
          <span>Sida ${meta.page || page} av ${meta.pageCount || '?'}</span>
          <button id="next-reviews" class="btn btn-outline-secondary" ${meta.page >= meta.pageCount ? 'disabled' : ''}>Nästa</button>
        </div>
      `;

      // Event listeners för pagineringsknappar
      document.getElementById('prev-reviews').onclick = () => {
        if (page > 1) {
          page--;
          loadReviews();
        }
      };
      document.getElementById('next-reviews').onclick = () => {
        if (meta.page < meta.pageCount) {
          page++;
          loadReviews();
        }
      };
    } catch (err) {
      container.innerHTML = '<p class="text-muted">Kunde inte ladda recensioner.</p>';
    }
  }

  loadReviews();

  // --- Kräv inloggning för att visa formuläret ---
  const reviewForm = document.getElementById('review-form');
  const showBtn = document.getElementById('show-review-form');
  const reviewMessage = document.getElementById('review-message');
  const loginPopup = document.getElementById('review-login-popup');
  const username = localStorage.getItem('username');



  // --- Visa/dölj formulär ---
  if (showBtn && reviewForm) {
    showBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (!username) {
        loginPopup.textContent = 'Du måste vara inloggad för att lämna en recension.';
        loginPopup.classList.remove('d-none');
        setTimeout(() => {
          loginPopup.classList.add('d-none');
        }, 2000);
      } else {
        reviewForm.classList.toggle('d-none');
        loginPopup.classList.add('d-none');
      }
    });
  }

  // --- Klickbara stjärnor ---
  const stars = document.querySelectorAll('#star-rating i');
  const ratingInput = document.getElementById('review-rating');
  let currentRating = 0;

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      highlightStars(parseInt(star.getAttribute('data-value')));
    });
    star.addEventListener('mouseleave', () => {
      highlightStars(currentRating);
    });
    star.addEventListener('click', () => {
      currentRating = parseInt(star.getAttribute('data-value'));
      ratingInput.value = currentRating;
      highlightStars(currentRating);
    });
  });

  function highlightStars(rating) {
    stars.forEach(star => {
      if (parseInt(star.getAttribute('data-value')) <= rating) {
        star.classList.remove('text-secondary');
        star.classList.add('text-light');
      } else {
        star.classList.add('text-secondary');
        star.classList.remove('text-light');
      }
    });
  }

  // --- Skicka recension ---
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const author = document.getElementById('review-author').value;
      const rating = document.getElementById('review-rating').value;
      const comment = document.getElementById('review-comment').value;

      if (!rating || rating < 1 || rating > 5) {
        document.getElementById('review-message').textContent = 'Välj ett betyg (1-5 stjärnor).';
        return;
      }

      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId, author, rating, comment })
        });
        if (res.ok) {
          document.getElementById('review-message').textContent = 'Tack för din recension!';
          form.reset();
          currentRating = 0;
          highlightStars(0);
          page = 1; // Gå till första sidan efter ny recension
          loadReviews();
        } else {
          document.getElementById('review-message').textContent = 'Kunde inte spara recension.';
        }
      } catch {
        document.getElementById('review-message').textContent = 'Kunde inte spara recension.';
      }
    });
  }

  function containsCode(str) {
    // Tillåt endast bokstäver, siffror, mellanslag, punkt, bindestreck och understreck
    return /[<>\/\\{}[\];:"'=|`~]/.test(str);
  }

  // --- Validera recensionformulär ---
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      const author = document.getElementById('review-author').value;
      const comment = document.getElementById('review-comment').value;
      const message = document.getElementById('review-message');

      if (containsCode(author) || containsCode(comment)) {
        e.preventDefault();
        message.textContent = 'Du får inte använda otillåtna tecken i namn eller kommentar.';
        message.className = 'text-danger mt-2';
        return false;
      }
    });
  }
});
