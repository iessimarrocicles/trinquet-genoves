// Avatar SVG d'un/a pilotari/a: samarreta blava o roja, pantaló blanc, faixa, didals o guant.
import { cosmeticsDesbloquejats } from '../lib/nivells.js';

const SAMARRETES = {
  blau: { base: '#2563eb', ombra: '#1e40af', fons: '#dbeafe' },
  roig: { base: '#dc2626', ombra: '#991b1b', fons: '#fee2e2' },
};

function Cabell({ pentinat, color }) {
  switch (pentinat) {
    case 'llarg':
      return (<>
        <path d="M34 50 Q32 92 44 98 L44 56 Z M86 50 Q88 92 76 98 L76 56 Z" fill={color} />
        <path d="M34 52 Q36 24 60 24 Q84 24 86 52 Q74 38 60 40 Q46 38 34 52 Z" fill={color} />
      </>);
    case 'cua':
      return (<>
        <path d="M84 40 Q102 46 96 74 Q92 60 82 54 Z" fill={color} />
        <path d="M34 52 Q36 24 60 24 Q84 24 86 52 Q74 38 60 40 Q46 38 34 52 Z" fill={color} />
        <circle cx="84" cy="42" r="4" fill="#f472b6" />
      </>);
    case 'arrissat':
      return (<g fill={color}>
        {[[38, 40], [46, 30], [57, 26], [68, 28], [78, 33], [84, 44], [36, 50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" />)}
      </g>);
    case 'rapat':
      return <path d="M36 48 Q38 28 60 28 Q82 28 84 48 Q72 40 60 40 Q48 40 36 48 Z" fill={color} opacity=".85" />;
    default: // curt
      return <path d="M34 52 Q34 24 60 24 Q86 24 86 52 Q80 40 70 38 Q62 44 50 40 Q40 42 34 52 Z" fill={color} />;
  }
}

export default function AvatarPilotari({ avatar, record = 0, mida = 96, animat = false, className = '' }) {
  const s = SAMARRETES[avatar.samarreta] ?? SAMARRETES.blau;
  const oberts = cosmeticsDesbloquejats(record);
  const te = (id) => avatar.complements?.includes(id) && oberts.includes(id);
  const faixa = te('faixa-or') ? '#eab308' : te('faixa') ? (avatar.samarreta === 'blau' ? '#dc2626' : '#2563eb') : null;

  return (
    <svg viewBox="0 0 120 140" width={mida} height={mida * 1.166} className={`${animat ? 'animate-bot' : ''} ${className}`} role="img" aria-label="Avatar de pilotari">
      <ellipse cx="60" cy="134" rx="34" ry="5" fill="#000" opacity=".12" />
      {/* Cames i pantaló blanc */}
      <rect x="44" y="104" width="13" height="26" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
      <rect x="63" y="104" width="13" height="26" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
      <rect x="42" y="126" width="16" height="7" rx="3" fill="#f8fafc" stroke="#94a3b8" />
      <rect x="62" y="126" width="16" height="7" rx="3" fill="#f8fafc" stroke="#94a3b8" />
      {/* Cos: samarreta */}
      <path d="M38 78 Q40 66 60 66 Q80 66 82 78 L84 108 L36 108 Z" fill={s.base} />
      <path d="M52 66 L60 76 L68 66" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {/* Faixa */}
      {faixa && <rect x="36" y="98" width="48" height="9" rx="3" fill={faixa} stroke="#00000022" />}
      {faixa && <path d="M78 104 l8 14 l-6 1 z" fill={faixa} />}
      {/* Braços */}
      <path d="M38 76 Q26 88 28 100" stroke={s.ombra} strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M82 76 Q94 88 92 100" stroke={s.ombra} strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* Mans: didals (esparadrap) o guant */}
      <circle cx="28" cy="103" r="7" fill={avatar.pell} />
      {te('guant') ? (
        <g><circle cx="92" cy="103" r="9" fill="#a16207" /><path d="M85 100 h14 M85 104 h14" stroke="#fde68a" strokeWidth="1.5" /></g>
      ) : (
        <circle cx="92" cy="103" r="7" fill={avatar.pell} />
      )}
      {te('didals') && (<g fill="#fff" stroke="#cbd5e1" strokeWidth=".8">
        <rect x="22" y="99" width="12" height="3.5" rx="1.5" /><rect x="22" y="104" width="12" height="3.5" rx="1.5" />
        {!te('guant') && (<><rect x="86" y="99" width="12" height="3.5" rx="1.5" /><rect x="86" y="104" width="12" height="3.5" rx="1.5" /></>)}
      </g>)}
      {/* Cap */}
      <rect x="54" y="58" width="12" height="10" fill={avatar.pell} />
      <circle cx="60" cy="48" r="23" fill={avatar.pell} />
      <Cabell pentinat={avatar.pentinat} color={avatar.cabell} />
      {te('mocador') && (<g>
        <path d="M36 44 Q60 30 84 44 L84 38 Q60 22 36 38 Z" fill="#ef4444" />
        <g fill="#fff">{[44, 52, 60, 68, 76].map((x) => <circle key={x} cx={x} cy={37 - Math.abs(60 - x) * 0.12} r="1.4" />)}</g>
        <path d="M84 40 l9 -4 l-2 9 z" fill="#ef4444" />
      </g>)}
      {/* Cara */}
      <circle cx="51" cy="50" r="3" fill="#1f2937" /><circle cx="69" cy="50" r="3" fill="#1f2937" />
      <circle cx="52" cy="49" r="1" fill="#fff" /><circle cx="70" cy="49" r="1" fill="#fff" />
      <circle cx="46" cy="57" r="3.5" fill="#fb7185" opacity=".35" /><circle cx="74" cy="57" r="3.5" fill="#fb7185" opacity=".35" />
      <path d="M53 59 Q60 65 67 59" fill="none" stroke="#1f2937" strokeWidth="2.2" strokeLinecap="round" />
      {/* Complements de prestigi */}
      {te('medalla') && (<g><path d="M55 66 L60 80 L65 66" fill="none" stroke="#2563eb" strokeWidth="2.5" /><circle cx="60" cy="84" r="6" fill="#facc15" stroke="#a16207" /><text x="60" y="87" fontSize="7" textAnchor="middle" fill="#a16207">★</text></g>)}
      {te('corona') && <path d="M44 28 L48 14 L54 24 L60 10 L66 24 L72 14 L76 28 Z" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />}
      {/* Pilota a la mà */}
      <g transform="translate(18 112)"><circle r="6" fill="#fff" stroke="#3b3226" strokeWidth="1.4" /><path d="M-5 -2 Q0 0 5 -2 M-5 2 Q0 0 5 2" stroke="#dc2626" strokeWidth="1" fill="none" /></g>
    </svg>
  );
}

export { SAMARRETES };
