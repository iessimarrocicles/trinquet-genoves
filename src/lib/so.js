// ─────────────────────────────────────────────────────────────
//  SONS (Web Audio, sense fitxers externs) + VEU EN VALENCIÀ
// ─────────────────────────────────────────────────────────────
let ctx = null;
const audio = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function to(freq, inici, durada, tipus = 'sine', volum = 0.25) {
  const c = audio();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = tipus;
  osc.frequency.setValueAtTime(freq, c.currentTime + inici);
  g.gain.setValueAtTime(0.0001, c.currentTime + inici);
  g.gain.exponentialRampToValueAtTime(volum, c.currentTime + inici + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + inici + durada);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + inici);
  osc.stop(c.currentTime + inici + durada + 0.05);
}

/** «Toc» sec de la pilota contra la paret del trinquet. */
function colp(inici = 0) {
  const c = audio();
  const buf = c.createBuffer(1, c.sampleRate * 0.08, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 6);
  const src = c.createBufferSource();
  const filtre = c.createBiquadFilter();
  filtre.type = 'bandpass';
  filtre.frequency.value = 1100;
  const g = c.createGain();
  g.gain.value = 0.9;
  src.buffer = buf;
  src.connect(filtre).connect(g).connect(c.destination);
  src.start(c.currentTime + inici);
}

export const sons = {
  quinze() { colp(0); colp(0.18); to(660, 0.05, 0.15, 'triangle'); to(880, 0.15, 0.25, 'triangle'); },
  doble() { colp(0); to(523, 0.05, 0.12, 'triangle'); to(659, 0.15, 0.12, 'triangle'); to(784, 0.25, 0.12, 'triangle'); to(1047, 0.35, 0.35, 'triangle'); },
  millora() { to(392, 0, 0.18, 'sine', 0.18); to(330, 0.18, 0.3, 'sine', 0.15); },
  avis() { to(520, 0, 0.12, 'sine', 0.12); },
  rifa() { colp(0); },
  nivell() { [523, 659, 784, 1047, 1319].forEach((f, i) => to(f, i * 0.11, 0.3, 'square', 0.12)); },
  partida() { [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => to(f, i * 0.14, 0.32, 'triangle', 0.22)); },
};

// Veu sintètica: busca una veu catalana/valenciana del sistema (ca-ES / ca-ES-valencia).
let veuCatalana = null;
function carregarVeu() {
  const veus = window.speechSynthesis?.getVoices?.() ?? [];
  veuCatalana = veus.find((v) => /valenci/i.test(v.name) || /ca-ES-valencia/i.test(v.lang)) ?? veus.find((v) => v.lang?.toLowerCase().startsWith('ca')) ?? null;
}
if (typeof window !== 'undefined' && window.speechSynthesis) {
  carregarVeu();
  window.speechSynthesis.onvoiceschanged = carregarVeu;
}

export function parla(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = veuCatalana?.lang ?? 'ca-ES';
  if (veuCatalana) u.voice = veuCatalana;
  u.rate = 1.0;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

export const hiHaVeuCatalana = () => !!veuCatalana;
