(() => {
  const THEME_KEY = 'localmate_theme';
  const USER_KEY = 'localmate_user_';
  const SESSION_KEY = 'localmate_loggedInUser';

  /* ===================== THEME ===================== */
  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  /* ===================== MOBILE MENU ===================== */
  function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileBtn?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
    });
  }

  /* ===================== AUTH TABS ===================== */
  function initAuthTabs() {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const panelLogin = document.getElementById('panelLogin');
    const panelRegister = document.getElementById('panelRegister');

    tabLogin?.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      panelLogin.classList.remove('hidden');
      panelRegister.classList.add('hidden');
    });

    tabRegister?.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      panelRegister.classList.remove('hidden');
      panelLogin.classList.add('hidden');
    });

    // In-form buttons that should switch panels
    document.getElementById('toRegister')?.addEventListener('click', (e) => {
      e.preventDefault();
      tabRegister?.click();
    });

    document.getElementById('toLogin')?.addEventListener('click', (e) => {
      e.preventDefault();
      tabLogin?.click();
    });
  }

  /* ===================== REGISTER ===================== */
  function initRegister() {
    const btn = document.getElementById('registerBtn');

    btn?.addEventListener('click', () => {
      const role = document.getElementById('regRole').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();

      if (!role || !email || !password) {
        alert('Fill all fields');
        return;
      }

      const key = USER_KEY + email;
      if (localStorage.getItem(key)) {
        alert('User already exists');
        return;
      }

      localStorage.setItem(key, JSON.stringify({ role, email, password }));
      alert('Registered successfully');
      document.getElementById('tabLogin')?.click();
    });
  }

  /* ===================== LOGIN ===================== */
  function initLogin() {
    const btn = document.getElementById('loginBtn');

    btn?.addEventListener('click', () => {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      const key = USER_KEY + email;
      const user = JSON.parse(localStorage.getItem(key) || '{}');

      if (!user.email) {
        alert('User not found');
        return;
      }

      if (user.password !== password) {
        alert('Invalid credentials');
        return;
      }

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ email, role: user.role })
      );

      window.location.href = 'dashboard.html';
    });
  }

  /* ===================== INIT ===================== */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();        // ✅ Dark mode applies to ENTIRE site
    initMobileMenu();  // ✅ Mobile nav works
    initAuthTabs();    // ✅ Login/Register toggle works
    initRegister();    // ✅ Register works
    initLogin();       // ✅ Login works
  });

})();
