// --- Hämta filmer och visa dem på startsidan --- //
const filmListElement = document.getElementById("filmList");

if (filmListElement) {
  fetch("https://plankton-app-xhkom.ondigitalocean.app/api/movies")
    .then(response => response.json())
    .then(data => {
      const movies = data.data;

      movies.forEach(movie => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-3";

        const img = document.createElement("img");
        img.src = movie.attributes.image.url;
        img.alt = movie.attributes.title;
        img.className = "film-poster";

        // Gör bilden klickbar → länk till SSR-sida
        const link = document.createElement("a");
        link.href = `/movies/${movie.id}`;
        link.appendChild(img);

        col.appendChild(link);
        filmListElement.appendChild(col);
      });
    })
    .catch(error => {
      console.error("Fel vid hämtning av filmer:", error);
    });
}

// --- Hantera registreringsformulär --- //
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const signupButton = document.getElementById('signupButton');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const username = document.getElementById('username');
  const fullname = document.getElementById('fullname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  function containsCode(str) {
    // Tillåt endast bokstäver, siffror, mellanslag, punkt, bindestreck och understreck
    return /[<>\/\\{}[\];:"'=|`~]/.test(str);
  }

  function checkForm() {
    if (
      username.value.trim() &&
      fullname.value.trim() &&
      email.value.trim() &&
      password.value.trim() &&
      termsCheckbox.checked &&
      !containsCode(username.value) &&
      !containsCode(fullname.value) &&
      !containsCode(email.value) &&
      !containsCode(password.value)
    ) {
      signupButton.disabled = false;
    } else {
      signupButton.disabled = true;
    }
  }

  [username, fullname, email, password, termsCheckbox].forEach(el => {
    el.addEventListener('input', checkForm);
    el.addEventListener('change', checkForm);
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hämta värden
    const usernameVal = username.value.trim();
    const passwordVal = password.value.trim();

    // Skicka till backend
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameVal, password: passwordVal })
    });

    const data = await res.json();
    const successDiv = document.getElementById('signupSuccess');

    if (res.ok) {
      successDiv.textContent = 'Ditt konto har skapats! Du skickas nu till inloggningen...';
      successDiv.classList.remove('d-none');
      signupForm.reset();
      signupButton.disabled = true;
      setTimeout(() => {
        window.location.href = '/log-in.html';
      }, 2000); // Vänta 2 sekunder innan redirect
    } else {
      successDiv.textContent = data.error || 'Något gick fel vid registrering.';
      successDiv.classList.remove('d-none');
      successDiv.classList.replace('alert-success', 'alert-danger');
    }
  });
});



