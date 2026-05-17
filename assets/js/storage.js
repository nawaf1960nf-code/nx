/* Bloom — localStorage persistence layer
   Multi-account: each user has their own isolated state.
   Schema versioning kept simple. */

const BloomStore = (function () {
  const ROOT = 'bloom.v1';

  function readRoot() {
    try { return JSON.parse(localStorage.getItem(ROOT)) || defaultRoot(); }
    catch { return defaultRoot(); }
  }
  function writeRoot(r) { localStorage.setItem(ROOT, JSON.stringify(r)); }
  function defaultRoot() {
    return {
      currentUser: null,           // email of active user
      users: {},                   // map: email -> user obj
      ui: { lang: 'en', theme: 'light' }
    };
  }

  function defaultUser(email, name) {
    return {
      email, name,
      password: '',
      createdAt: Date.now(),
      onboarded: false,
      profile: {
        age: null, weight: null, height: null,
        goal: null,        // tone, build_muscle, lose_fat, strength
        level: null,       // beginner, intermediate, advanced
        units: 'kg',
        equipment: 'gym',  // gym, home, both
        focusAreas: [],    // glutes, back, etc
        daysPerWeek: 5,
      },
      program: null,       // copy of DEFAULT_PROGRAM, editable
      week: {              // current week tracking
        startTs: null,     // start of week timestamp
        completed: {}      // dayId -> { date, sessionId }
      },
      sessions: [],        // log of finished workouts
      records: {},         // exId -> { bestWeight, bestReps, bestVolume, history: [] }
      moodLogs: [],        // [{ ts, mood, energy, sleep, motivation }]
      bodyLogs: [],        // [{ ts, weight, waist, hips, bust }]
      water: {},           // dateKey -> glasses
      nutri: {},           // dateKey -> { protein, calories }
      xp: 0,
      streak: 0,
      lastWorkoutDate: null,
      unlockedBadges: [],
      prefs: {
        soundOn: true,
        notifications: false,
        autoProgression: true,
        restDefault: 60,
      },
      ai: {
        memory: [],        // [{ ts, type, note }]  long-term notes
        likes: [],         // exercise ids the user likes
        dislikes: [],      // exercise ids the user dislikes (skipped often)
      }
    };
  }

  // ── public api ──
  const api = {
    _root: null,
    init() { this._root = readRoot(); return this; },
    save() { writeRoot(this._root); },

    // language + theme
    setLang(lang) { this._root.ui.lang = lang; this.save(); },
    getLang() { return this._root.ui.lang; },
    setTheme(t) { this._root.ui.theme = t; this.save(); },
    getTheme() { return this._root.ui.theme; },

    // accounts
    users() { return this._root.users; },
    currentUserEmail() { return this._root.currentUser; },
    currentUser() {
      const e = this._root.currentUser;
      return e ? this._root.users[e] : null;
    },
    signup(name, email, password) {
      email = (email || '').toLowerCase().trim();
      if (!email || !password || !name) throw new Error('Missing fields');
      if (this._root.users[email]) throw new Error('Account exists');
      const u = defaultUser(email, name);
      u.password = password;
      // assign default program (deep clone so each user gets their own)
      u.program = JSON.parse(JSON.stringify(BLOOM_DATA.DEFAULT_PROGRAM));
      this._root.users[email] = u;
      this._root.currentUser = email;
      this.save();
      return u;
    },
    login(email, password) {
      email = (email || '').toLowerCase().trim();
      const u = this._root.users[email];
      if (!u) throw new Error('No account with that email');
      if (u.password !== password) throw new Error('Wrong password');
      this._root.currentUser = email;
      this.save();
      return u;
    },
    logout() { this._root.currentUser = null; this.save(); },

    // patch helpers
    update(fn) {
      const u = this.currentUser();
      if (!u) return;
      fn(u);
      this.save();
    },

    // sessions
    addSession(session) {
      this.update(u => {
        u.sessions.unshift(session);
        // cap stored sessions to last 200
        if (u.sessions.length > 200) u.sessions.length = 200;
      });
    },
    // mark a workout day as completed in current week
    markDayDone(dayId, sessionId) {
      this.update(u => {
        u.week.completed[dayId] = { date: Date.now(), sessionId };
      });
    },
    isDayDone(dayId) {
      const u = this.currentUser();
      return !!(u && u.week.completed[dayId]);
    },
    // weekly reset: at the start of a new week, clear completed map
    ensureWeekFresh() {
      const u = this.currentUser();
      if (!u) return;
      const now = new Date();
      const monday = startOfWeek(now);
      if (!u.week.startTs || u.week.startTs < monday.getTime()) {
        u.week.startTs = monday.getTime();
        u.week.completed = {};
        this.save();
      }
    },

    // PRs / records
    updateRecord(exId, set) {
      this.update(u => {
        if (!u.records[exId]) u.records[exId] = { bestWeight: 0, bestReps: 0, bestVolume: 0, history: [] };
        const r = u.records[exId];
        r.history.push({ ts: Date.now(), weight: set.weight, reps: set.reps, difficulty: set.difficulty });
        if (r.history.length > 80) r.history.shift();
        let isPR = false;
        const vol = (set.weight || 0) * (set.reps || 0);
        if ((set.weight || 0) > r.bestWeight) { r.bestWeight = set.weight; isPR = true; }
        if ((set.reps || 0) > r.bestReps && (set.weight || 0) >= r.bestWeight * 0.9) { r.bestReps = set.reps; }
        if (vol > r.bestVolume) { r.bestVolume = vol; }
        return isPR;
      });
      // re-read to return PR flag
      const u = this.currentUser();
      const r = u.records[exId];
      const last = r.history[r.history.length - 1];
      const prevBest = r.history.slice(0, -1).reduce((m, h) => Math.max(m, h.weight || 0), 0);
      return (last.weight || 0) > prevBest && last.weight > 0;
    },

    // stats for badges
    stats() {
      const u = this.currentUser();
      if (!u) return {};
      let totalVolume = 0;
      let totalPRs = 0;
      u.sessions.forEach(s => {
        s.exercises.forEach(ex => ex.sets.forEach(set => {
          totalVolume += (set.weight || 0) * (set.reps || 0);
          if (set.isPR) totalPRs++;
        }));
      });
      return {
        totalWorkouts: u.sessions.length,
        totalVolume,
        totalPRs,
        streak: u.streak,
        moodLogs: u.moodLogs.length,
      };
    },

    // streak update
    bumpStreak() {
      this.update(u => {
        const today = dateKey(new Date());
        const last = u.lastWorkoutDate;
        if (last === today) return; // same day, no bump
        const yesterday = dateKey(new Date(Date.now() - 86400000));
        if (last === yesterday) u.streak += 1;
        else u.streak = 1;
        u.lastWorkoutDate = today;
      });
    },

    // xp
    addXp(amount) {
      this.update(u => { u.xp += amount; });
    },

    // mood
    logMood(payload) {
      this.update(u => {
        u.moodLogs.unshift({ ts: Date.now(), ...payload });
        if (u.moodLogs.length > 200) u.moodLogs.length = 200;
      });
    },
    todayMood() {
      const u = this.currentUser();
      if (!u) return null;
      const today = dateKey(new Date());
      return u.moodLogs.find(m => dateKey(new Date(m.ts)) === today) || null;
    },

    // body
    logBody(payload) {
      this.update(u => {
        u.bodyLogs.unshift({ ts: Date.now(), ...payload });
        if (u.bodyLogs.length > 200) u.bodyLogs.length = 200;
      });
    },

    // water
    todayWater() {
      const u = this.currentUser();
      if (!u) return 0;
      return u.water[dateKey(new Date())] || 0;
    },
    setWater(n) {
      this.update(u => { u.water[dateKey(new Date())] = n; });
    },

    // nutri
    todayNutri() {
      const u = this.currentUser();
      if (!u) return { protein: 0, calories: 0 };
      return u.nutri[dateKey(new Date())] || { protein: 0, calories: 0 };
    },
    setNutri(payload) {
      this.update(u => {
        const key = dateKey(new Date());
        u.nutri[key] = { ...(u.nutri[key] || {}), ...payload };
      });
    },

    // ai memory
    addMemory(note, type='general') {
      this.update(u => {
        u.ai.memory.unshift({ ts: Date.now(), type, note });
        if (u.ai.memory.length > 50) u.ai.memory.length = 50;
      });
    },
  };

  return api;

  // helpers
  function startOfWeek(d) {
    const dt = new Date(d);
    dt.setHours(0,0,0,0);
    const day = dt.getDay(); // 0 Sun .. 6 Sat
    // Monday-based week (women's training programs commonly start Mon)
    const diff = (day === 0 ? 6 : day - 1);
    dt.setDate(dt.getDate() - diff);
    return dt;
  }
  function dateKey(d) { return d.toISOString().slice(0, 10); }
})();

// expose helpers
function dateKey(d) { return d.toISOString().slice(0, 10); }
function startOfWeek(d) {
  const dt = new Date(d); dt.setHours(0,0,0,0);
  const day = dt.getDay();
  const diff = (day === 0 ? 6 : day - 1);
  dt.setDate(dt.getDate() - diff);
  return dt;
}
