// Multi-account auth with PBKDF2-hashed passwords (Web Crypto).
// Multiple users per browser; each has their own progress.
window.AppAuth = (() => {
  const STORE = "enc1_accounts_v2";
  const CURRENT = "enc1_current_email";

  async function pbkdf2(password, salt) {
    const enc = new TextEncoder();
    const km = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: enc.encode(salt), iterations: 120000, hash: "SHA-256" },
      km, 256
    );
    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2,"0")).join("");
  }

  function getAccounts() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
    catch { return {}; }
  }
  function saveAccounts(a) { localStorage.setItem(STORE, JSON.stringify(a)); }

  function defaultProgress() {
    return {
      currentLevel: "B1",
      xp: 0,
      streak: 0,
      lastActiveDay: null,
      completedLessons: [],
      knownWords: [],
      quizScores: {},
      pronAttempts: [],
      achievements: [],
      activity: [],
      missions: {},
      bestWpm: 0,
      bestQuiz: 0,
      battlesWon: 0,
      battlesPlayed: 0,
      bonusLang: false,
      bonusShared: false
    };
  }

  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  async function signup({ name, email, password, lang }) {
    if (!name || name.trim().length < 2) throw new Error("Name must be at least 2 characters.");
    if (!validEmail(email)) throw new Error("Please enter a valid email (real or fake).");
    if (!password || password.length < 4) throw new Error("Password must be at least 4 characters.");
    const accounts = getAccounts();
    const key = email.toLowerCase().trim();
    if (accounts[key]) throw new Error("This email is already registered. Use login.");
    const salt = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => b.toString(16).padStart(2,"0")).join("");
    const hash = await pbkdf2(password, salt);
    accounts[key] = {
      email: key, name: name.trim(), lang: lang || "en",
      passwordHash: hash, salt,
      createdAt: Date.now(),
      progress: defaultProgress()
    };
    saveAccounts(accounts);
    setCurrent(key);
    return accounts[key];
  }

  async function login({ email, password }) {
    const accounts = getAccounts();
    const key = email.toLowerCase().trim();
    const acc = accounts[key];
    if (!acc) throw new Error("Account not found. Please sign up first.");
    const hash = await pbkdf2(password, acc.salt);
    if (hash !== acc.passwordHash) throw new Error("Wrong password.");
    setCurrent(key);
    return acc;
  }

  function logout() { localStorage.removeItem(CURRENT); }
  function setCurrent(email) { localStorage.setItem(CURRENT, email); }

  function current() {
    const email = localStorage.getItem(CURRENT);
    if (!email) return null;
    return getAccounts()[email] || null;
  }

  function updateCurrent(patch) {
    const email = localStorage.getItem(CURRENT);
    if (!email) return null;
    const accounts = getAccounts();
    if (!accounts[email]) return null;
    accounts[email] = { ...accounts[email], ...patch };
    saveAccounts(accounts);
    return accounts[email];
  }

  function updateProgress(updater) {
    const cur = current();
    if (!cur) return null;
    const newProg = typeof updater === "function" ? updater({ ...cur.progress }) : { ...cur.progress, ...updater };
    return updateCurrent({ progress: newProg });
  }

  function listAccountsForLeaderboard() {
    const all = getAccounts();
    return Object.values(all).map(a => ({
      email: a.email, name: a.name, xp: a.progress?.xp || 0,
      level: a.progress?.currentLevel || "B1",
      bestWpm: a.progress?.bestWpm || 0,
      bestQuiz: a.progress?.bestQuiz || 0,
      streak: a.progress?.streak || 0
    }));
  }

  return { signup, login, logout, current, updateCurrent, updateProgress, defaultProgress, getAccounts, listAccountsForLeaderboard, setCurrent };
})();
