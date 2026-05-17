/* Bloom — auth screen wiring (signup / login) */
const BloomAuth = (function () {
  function init() {
    // tab switching
    document.querySelectorAll('.auth-tab').forEach(t => {
      t.addEventListener('click', () => switchTab(t.dataset.tab));
    });

    // language toggles
    document.querySelectorAll('.auth-lang-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.auth-lang-btn').forEach(x => x.classList.toggle('active', x === b));
        i18n.set(b.dataset.lang);
        BloomStore.setLang(b.dataset.lang);
      });
    });

    // login
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      try {
        BloomStore.login(data.get('email'), data.get('password'));
        BloomApp.afterLogin();
      } catch (err) {
        document.getElementById('login-error').textContent = err.message;
      }
    });

    // signup
    document.getElementById('signup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      try {
        BloomStore.signup(data.get('name'), data.get('email'), data.get('password'));
        BloomApp.afterSignup();
      } catch (err) {
        document.getElementById('signup-error').textContent = err.message;
      }
    });
  }

  function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(tab + '-form').classList.add('active');
    document.getElementById('login-error').textContent = '';
    document.getElementById('signup-error').textContent = '';
  }

  function show() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('onboard-screen').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
    // reflect language
    const l = BloomStore.getLang();
    document.querySelectorAll('.auth-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  }
  function hide() {
    document.getElementById('auth-screen').classList.add('hidden');
  }

  return { init, show, hide };
})();
