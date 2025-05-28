// --- SIGN UP --- //

const signupForm = document.getElementById("signupForm");
const signupButton = document.getElementById("signupButton");

const usernameInput = document.getElementById("username");
const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const termsCheckbox = document.getElementById("termsCheckbox");

const emailFeedback = document.getElementById("emailFeedback");
const strengthText = document.getElementById("strengthText");

// --- Lösenordsstyrka --- //
if (passwordInput && strengthText) {
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;

    if (val.length < 6) {
      strengthText.textContent = "Svagt";
      strengthText.style.color = "red";
    } else if (val.length < 10) {
      strengthText.textContent = "Okej";
      strengthText.style.color = "orange";
    } else {
      strengthText.textContent = "Starkt";
      strengthText.style.color = "lightgreen";
    }

    checkSignupFormValidity();
  });
}

// --- Aktivera/Inaktivera knapp --- //
function checkSignupFormValidity() {
  if (!signupButton) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const username = usernameInput.value.trim();
  const fullname = fullnameInput.value.trim();
  const termsChecked = termsCheckbox.checked;

  const validEmail = /^[^\s@]+@[^\s@]+\.(com|se|net|org|edu|gov|info|biz|io)$/i.test(email);

  const allValid = email && validEmail && password && username && fullname && termsChecked;
  signupButton.disabled = !allValid;
}

// --- Lyssna på fält --- //
if (signupForm) {
  [emailInput, passwordInput, usernameInput, fullnameInput, termsCheckbox].forEach(input => {
    input.addEventListener("input", checkSignupFormValidity);
    input.addEventListener("change", checkSignupFormValidity);
  });

  // ---Submit--- //
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = usernameInput.value;
    const fullname = fullnameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const validEmail = /^[^\s@]+@[^\s@]+\.(com|se|net|org|edu|gov|info|biz|io)$/i.test(email);

    if (!validEmail) {
      emailFeedback.textContent = "Detta är inte en giltig e-postadress.";
      emailFeedback.classList.remove("d-none");
      return;
    } else {
      emailFeedback.classList.add("d-none");
    }

    if (!termsCheckbox.checked) {
      alert("Du måste godkänna villkoren för att gå vidare.");
      return;
    }

    const user = { fullname, email, password };
    localStorage.setItem(username, JSON.stringify(user));
    localStorage.setItem("loggedInUser", username);

    alert("Konto skapat!");
    window.location.href = "start.html";
  });
}

// --- LOG IN --- //

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const savedUser = JSON.parse(localStorage.getItem(username));

    if (savedUser && savedUser.password === password) {
      localStorage.setItem("loggedInUser", username);
      alert("Inloggning lyckades!");
      window.location.href = "start.html";
    } else {
      alert("Fel användarnamn eller lösenord.");
    }
  });
}

// ---- Visa användarnamn i header om inloggad----//
const userStatus = document.getElementById("userStatus");
const loggedInUser = localStorage.getItem("loggedInUser");

if (userStatus && loggedInUser) {
  userStatus.innerHTML = `
    <a href="profil.html" class="btn btn-outline-light rounded-pill">
      <i class="bi bi-person me-2"></i> ${loggedInUser}
    </a>
  `;
}

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