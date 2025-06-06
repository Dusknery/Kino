document.addEventListener('DOMContentLoaded', () => {
  const userStatus = document.getElementById('userStatus');
  const username = localStorage.getItem('username');

  if (userStatus) {
    if (username) {
      userStatus.innerHTML = `
        <div class="user-dropdown" style="position: relative; display: inline-block;">
          <button id="userBtn" type="button" class="btn btn-outline-light rounded-pill">
            <i class="bi bi-person me-2"></i> ${username}
          </button>
          <div id="userMenu" class="dropdown-menu" style="display:none; position:absolute; right:0; top:110%; min-width:150px; background:#fff; border:1px solid #ccc; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); z-index:1000;">
            <button id="logoutBtn" class="dropdown-item" style="width:100%; text-align:left; border:none; background:none; padding:10px 16px;">Logga ut</button>
          </div>
        </div>
      `;

      const userBtn = document.getElementById('userBtn');
      const userMenu = document.getElementById('userMenu');
      const logoutBtn = document.getElementById('logoutBtn');

      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
      });

      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        window.location.reload();
      });

      // Stäng menyn om man klickar utanför
      document.addEventListener('click', () => {
        userMenu.style.display = 'none';
      });
    } else {
      userStatus.innerHTML = `
        <a href="/log-in.html" class="btn btn-outline-light rounded-pill">
          <i class="bi bi-person me-2"></i> Logga in
        </a>
      `;
    }
  }

  // Inloggning
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('username', username);
        window.location.href = '/';
      } else {
        const loginError = document.getElementById('loginError');
        if (loginError) {
          loginError.textContent = data.error || 'Fel vid inloggning';
          loginError.classList.remove('d-none');
        }
      }
    });
  }

  // Registrering
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('signup-username').value;
      const password = document.getElementById('signup-password').value;

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('username', username);
        window.location.href = '/';
      } else {
        const signupError = document.getElementById('signupError');
        if (signupError) {
          signupError.textContent = data.error || 'Fel vid registrering';
          signupError.classList.remove('d-none');
        }
      }
    });
  }
});