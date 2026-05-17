/* Bloom — main app controller. */
const BloomApp = (function () {

  let currentView = 'home';

  // SHA-256 of the access password. Stored as a hash so the plain password
  // never appears in source. Change this by computing a new SHA-256 hex.
  const GATE_HASH = '1e7d1e772929d39c523f48a45c0c07f9c2dcae5b41f591672e025367692de91a';
  const GATE_KEY  = 'bloom.gate.unlocked';

  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function init() {
    BloomStore.init();
    i18n.set(BloomStore.getLang());
    applyTheme(BloomStore.getTheme());
    bindUi();

    // Gate first — if already unlocked on this device, skip
    if (localStorage.getItem(GATE_KEY) === GATE_HASH) {
      proceedAfterGate();
    } else {
      showGate();
    }
  }

  function showGate() {
    const gate = document.getElementById('gate-screen');
    const form = document.getElementById('gate-form');
    const input = document.getElementById('gate-pass');
    const error = document.getElementById('gate-error');
    const card = gate.querySelector('.gate-card');

    gate.style.display = 'flex';
    setTimeout(() => input.focus(), 100);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = input.value || '';
      error.textContent = '';
      const h = await sha256(v);
      if (h === GATE_HASH) {
        localStorage.setItem(GATE_KEY, GATE_HASH);
        gate.style.transition = 'opacity 0.4s';
        gate.style.opacity = '0';
        setTimeout(() => { gate.style.display = 'none'; proceedAfterGate(); }, 400);
      } else {
        card.classList.remove('gate-shake');
        void card.offsetWidth;
        card.classList.add('gate-shake');
        error.textContent = i18n.t('Wrong password', 'كلمة سر خاطئة');
        input.value = ''; input.focus();
      }
    });
  }

  function proceedAfterGate() {
    BloomAuth.init();

    // Show splash, then enter normal flow
    const splash = document.getElementById('splash');
    if (splash) splash.classList.remove('hidden');

    setTimeout(() => {
      if (splash) splash.style.display = 'none';
      const user = BloomStore.currentUser();
      if (!user) {
        BloomAuth.show();
      } else if (!user.onboarded) {
        BloomOnboard.start();
      } else {
        enterApp();
      }
    }, 2200);
  }

  function bindUi() {
    // Bottom nav
    document.querySelectorAll('.bn-item').forEach(b => {
      b.addEventListener('click', () => go(b.dataset.view));
    });

    // Topbar language + theme
    document.getElementById('lang-btn').addEventListener('click', toggleLang);
    document.getElementById('theme-btn').addEventListener('click', toggleTheme);

    // Modal close on backdrop
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  }

  function enterApp() {
    BloomStore.ensureWeekFresh();
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('onboard-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    refreshTopbar();
    go('home');
  }

  function refreshTopbar() {
    const u = BloomStore.currentUser();
    if (!u) return;
    const initial = (u.name || 'B').slice(0, 1).toUpperCase();
    document.getElementById('topbar-avatar').textContent = initial;
    document.getElementById('topbar-name').textContent = u.name;
    document.getElementById('topbar-hello').textContent = i18n.t('Hi,', 'مرحباً،');
    document.getElementById('theme-btn').textContent = BloomStore.getTheme() === 'dark' ? '☀️' : '🌙';
  }

  function go(view) {
    currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');

    document.querySelectorAll('.bn-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));

    // hide bottom nav + topbar for session
    const hideChrome = (view === 'session');
    document.querySelector('.bottom-nav').style.display = hideChrome ? 'none' : '';
    document.querySelector('.topbar').style.display = hideChrome ? 'none' : '';

    // route
    switch (view) {
      case 'home':         BloomViews.renderHome(); break;
      case 'workouts':     BloomViews.renderWorkouts(); break;
      case 'progress':     BloomViews.renderProgress(); break;
      case 'coach':        BloomViews.renderCoach(); break;
      case 'profile':      BloomViews.renderProfile(); break;
      case 'library':      BloomViews.renderLibrary(); break;
      case 'nutrition':    BloomViews.renderNutrition(); break;
      case 'achievements': BloomViews.renderAchievements(); break;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function afterLogin() {
    const u = BloomStore.currentUser();
    if (!u.onboarded) BloomOnboard.start();
    else enterApp();
  }
  function afterSignup() {
    BloomOnboard.start();
  }
  function logout() {
    BloomStore.logout();
    location.reload();
  }

  function toggleLang() {
    const cur = i18n.get();
    const next = cur === 'en' ? 'ar' : 'en';
    i18n.set(next);
    BloomStore.setLang(next);
    refreshTopbar();
    go(currentView);
  }
  function toggleTheme() {
    const cur = BloomStore.getTheme();
    const next = cur === 'light' ? 'dark' : 'light';
    BloomStore.setTheme(next);
    applyTheme(next);
    refreshTopbar();
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#14101a' : '#f7c8d8');
  }

  // Modal
  function openModal() {
    document.getElementById('modal').classList.remove('hidden');
  }
  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal').classList.remove('center');
  }

  // Toast
  let toastTo = null;
  function toast(msg, tone = '') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast ' + tone;
    el.classList.remove('hidden');
    if (toastTo) clearTimeout(toastTo);
    toastTo = setTimeout(() => el.classList.add('hidden'), 2200);
  }

  return {
    init, enterApp, afterLogin, afterSignup, go, logout,
    toggleLang, toggleTheme, refreshTopbar,
    openModal, closeModal, toast,
  };
})();

window.addEventListener('DOMContentLoaded', BloomApp.init);
