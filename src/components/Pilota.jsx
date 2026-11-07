// Pilota valenciana (blanca, de vaqueta) en SVG: l'emoji 🎾 és de tennis i no ens representa.
export default function Pilota({ mida = 24, className = '' }) {
  return (
    <svg viewBox="0 0 64 64" width={mida} height={mida} className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#fff" stroke="#3b3226" strokeWidth="4" />
      <path d="M10 26c12 6 32 6 44 0M10 38c12-6 32-6 44 0" fill="none" stroke="#dc2626" strokeWidth="3" />
      <ellipse cx="23" cy="20" rx="6" ry="3.5" fill="#fff" opacity=".9" transform="rotate(-25 23 20)" />
    </svg>
  );
}
