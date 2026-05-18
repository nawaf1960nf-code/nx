"use client";

// راوي صوتي يستخدم Web Speech API (مجاني، مدمج في المتصفح)

let arabicVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;

  // ابحث عن صوت عربي
  arabicVoice =
    voices.find((v) => v.lang.startsWith("ar")) ||
    voices.find((v) => v.lang === "ar-SA") ||
    voices.find((v) => v.lang === "ar-EG") ||
    null;

  voicesLoaded = true;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function speak(
  text: string,
  options: { rate?: number; pitch?: number; volume?: number } = {},
) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // أوقف أي صوت سابق
  window.speechSynthesis.cancel();

  if (!voicesLoaded) loadVoices();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = options.rate ?? 0.95;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

  if (arabicVoice) utterance.voice = arabicVoice;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function isSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
