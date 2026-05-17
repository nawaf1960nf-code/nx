// Web Audio API sound effects — no external files.
window.AppSounds = (() => {
  let ctx = null;
  let enabled = localStorage.getItem("enc1_sound") !== "off";

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, duration, type = "sine", vol = 0.12) {
    if (!enabled) return;
    const c = ensure(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + duration);
  }

  function correct() { tone(660, 0.12); setTimeout(() => tone(990, 0.16), 90); }
  function wrong()   { tone(180, 0.25, "sawtooth", 0.08); }
  function win()     { [523, 659, 784, 1047].forEach((f,i) => setTimeout(() => tone(f, 0.18, "sine", 0.15), i*110)); }
  function lose()    { [400, 320, 240].forEach((f,i) => setTimeout(() => tone(f, 0.25, "triangle", 0.1), i*150)); }
  function tick()    { tone(720, 0.04, "square", 0.04); }
  function pop()     { tone(900, 0.05, "triangle", 0.06); }
  function chime()   { [1318, 1568, 2093].forEach((f,i) => setTimeout(() => tone(f, 0.2, "sine", 0.1), i*80)); }
  function levelUp() { [523, 659, 784, 1047, 1319].forEach((f,i) => setTimeout(() => tone(f, 0.18, "sine", 0.13), i*100)); }

  function setEnabled(v) { enabled = !!v; localStorage.setItem("enc1_sound", v ? "on" : "off"); }
  function isEnabled() { return enabled; }

  return { correct, wrong, win, lose, tick, pop, chime, levelUp, setEnabled, isEnabled };
})();
