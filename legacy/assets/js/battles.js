// Async multiplayer battles. Friends play the same questions/text
// (deterministic from code), then exchange result links.
window.AppBattles = (() => {
  const STORE = "enc1_battles";

  function newCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  function getAll() { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; } }
  function saveAll(o) { localStorage.setItem(STORE, JSON.stringify(o)); }

  function get(code) { return getAll()[String(code).toUpperCase()] || null; }

  function save(b) {
    const all = getAll();
    all[b.code] = b;
    saveAll(all);
    return b;
  }

  function create({ type, creatorName, creatorEmail }) {
    const code = newCode();
    const battle = {
      code, type,
      created: Date.now(),
      creator: { name: creatorName, email: creatorEmail || "" },
      players: {}
    };
    return save(battle);
  }

  function recordResult(code, result) {
    let b = get(code);
    if (!b) b = { code: String(code).toUpperCase(), type: result.type, created: Date.now(), creator: { name: result.name }, players: {} };
    b.players[result.name] = { ...result, at: Date.now() };
    return save(b);
  }

  function seedFromCode(code) {
    let h = 0;
    for (let i = 0; i < code.length; i++) h = ((h << 5) - h) + code.charCodeAt(i) | 0;
    return Math.abs(h);
  }

  function rng(seed) {
    let a = seed | 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function quizQuestionsForCode(code, count = 20) {
    const r = rng(seedFromCode(code));
    const bank = AppData.challengeBank.slice();
    for (let i = bank.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [bank[i], bank[j]] = [bank[j], bank[i]];
    }
    return bank.slice(0, count);
  }

  function typingTextForCode(code) {
    return AppData.typingTexts[seedFromCode(code) % AppData.typingTexts.length];
  }

  function shareInviteUrl(code, type) {
    const u = new URL(window.location.href);
    u.search = "";
    u.hash = "battle=" + btoa(JSON.stringify({ code, type, invite: true }));
    return u.toString();
  }

  function shareResultUrl(code, result) {
    const u = new URL(window.location.href);
    u.search = "";
    u.hash = "battle=" + btoa(JSON.stringify({ code, result }));
    return u.toString();
  }

  function importFromHash(b64) {
    try {
      const obj = JSON.parse(atob(b64));
      if (!obj.code) return null;
      if (obj.invite) {
        // Just ensure the battle entry exists locally
        let b = get(obj.code);
        if (!b) b = save({ code: obj.code, type: obj.type, created: Date.now(), creator: { name: "Friend" }, players: {} });
        return { kind: "invite", battle: b };
      }
      if (obj.result) {
        const b = recordResult(obj.code, obj.result);
        return { kind: "result", battle: b, result: obj.result };
      }
      return null;
    } catch { return null; }
  }

  function rankings(code) {
    const b = get(code);
    if (!b) return [];
    const players = Object.values(b.players);
    if (b.type === "typing") {
      return players.sort((a, b) => (b.wpm - a.wpm) || (b.acc - a.acc));
    }
    return players.sort((a, b) => (b.score - a.score) || (a.timeSec - b.timeSec));
  }

  function recentBattles(limit = 6) {
    const all = getAll();
    return Object.values(all).sort((a, b) => b.created - a.created).slice(0, limit);
  }

  return {
    create, get, recordResult, seedFromCode, quizQuestionsForCode,
    typingTextForCode, shareInviteUrl, shareResultUrl, importFromHash,
    rankings, recentBattles, newCode
  };
})();
