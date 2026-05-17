// Text-to-speech and speech-recognition helpers.
window.AppAudio = (() => {
  const synth = window.speechSynthesis;
  let voices = [];
  let preferredVoice = null;

  function loadVoices() {
    voices = synth ? synth.getVoices() : [];
    // Prefer good-quality English voices
    const candidates = [
      "Google UK English Female",
      "Google UK English Male",
      "Google US English",
      "Microsoft Aria Online (Natural) - English (United States)",
      "Microsoft Jenny Online (Natural) - English (United States)",
      "Samantha",
      "Daniel"
    ];
    for (const name of candidates) {
      const v = voices.find(x => x.name === name);
      if (v) { preferredVoice = v; return; }
    }
    preferredVoice = voices.find(v => v.lang && v.lang.startsWith("en")) || voices[0] || null;
  }

  if (synth) {
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }

  function listEnglishVoices() {
    return voices.filter(v => v.lang && v.lang.startsWith("en"));
  }

  function speak(text, opts = {}) {
    if (!synth) {
      window.AppApp && AppApp.toast("Your browser doesn't support speech.", "error");
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (opts.voice) u.voice = opts.voice;
    else if (preferredVoice) u.voice = preferredVoice;
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1;
    u.lang = opts.lang || (u.voice && u.voice.lang) || "en-US";
    if (opts.onend) u.onend = opts.onend;
    if (opts.onstart) u.onstart = opts.onstart;
    synth.speak(u);
    return u;
  }

  function stop() { if (synth) synth.cancel(); }

  // Speech recognition (pronunciation check)
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function isRecognitionSupported() { return !!SR; }

  function listen({ lang = "en-US", onResult, onError, onEnd } = {}) {
    if (!SR) {
      onError && onError("Speech recognition not supported in this browser. Try Chrome on desktop or Android.");
      return null;
    }
    const r = new SR();
    r.lang = lang;
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 3;
    r.onresult = (e) => {
      const alts = [];
      for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
      onResult && onResult(alts);
    };
    r.onerror = (e) => onError && onError(e.error || "error");
    r.onend = () => onEnd && onEnd();
    r.start();
    return r;
  }

  // Simple similarity score 0..1 between two strings (normalized).
  function similarity(a, b) {
    const norm = s => s.toLowerCase().replace(/[^\w\s']/g, "").replace(/\s+/g, " ").trim();
    a = norm(a); b = norm(b);
    if (!a || !b) return 0;
    if (a === b) return 1;
    // word overlap ratio + character Levenshtein bonus
    const wa = a.split(" "); const wb = b.split(" ");
    const setB = new Set(wb);
    const overlap = wa.filter(w => setB.has(w)).length;
    const wordScore = overlap / Math.max(wa.length, wb.length);
    return Math.max(wordScore, 1 - levenshtein(a, b) / Math.max(a.length, b.length));
  }

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
      }
    }
    return dp[m][n];
  }

  return { speak, stop, listen, isRecognitionSupported, listEnglishVoices, similarity, get voice() { return preferredVoice; }, setVoice(v) { preferredVoice = v; } };
})();
