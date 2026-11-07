// Targeta d'un/a alumne/a dins del Trinquet Virtual.
import AvatarPilotari from './AvatarPilotari.jsx';
import { nivellDe, nomNivell, progresNivell } from '../lib/nivells.js';
import { useClasse } from '../state/classStore.jsx';

export default function TargetaAlumne({ alumne, seleccionat, modeSeleccio, destacat, avisosAvui = 0, onClick }) {
  const { efectes, dispatch } = useClasse();
  const nivell = nivellDe(alumne.record);
  const { percent, falten, seguent } = progresNivell(alumne.record);
  const meus = efectes.filter((e) => e.alumneId === alumne.id);
  const animant = meus.length > 0;
  const positiu = meus.some((e) => e.tipus === 'positiu');
  const vora = alumne.avatar.samarreta === 'roig' ? 'from-roig-500 to-roig-600' : 'from-blau-500 to-blau-600';

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={alumne.absent && !modeSeleccio}
        aria-pressed={modeSeleccio ? seleccionat : undefined}
        aria-label={`${alumne.nom}, ${alumne.quinzes} quinzes, nivell ${nomNivell(nivell, alumne.genere)}`}
        className={[
          'group relative flex w-full flex-col items-center overflow-hidden rounded-3xl bg-white pb-3 shadow-md ring-4 transition',
          'hover:-translate-y-1 hover:shadow-xl active:scale-95 focus:outline-none focus-visible:ring-or-400',
          seleccionat ? 'ring-or-400' : 'ring-transparent',
          destacat ? 'animate-brilla ring-or-400 scale-105' : '',
          animant && !positiu ? 'animate-sacseja' : '',
          alumne.absent ? 'opacity-40 grayscale' : '',
        ].join(' ')}
      >
        {/* Franja superior amb el color de la samarreta */}
        <div className={`h-10 w-full bg-gradient-to-r ${vora}`} />
        <div className="-mt-8">
          <AvatarPilotari avatar={alumne.avatar} record={alumne.record} mida={82} animat={animant && positiu} />
        </div>
        <span className="mt-1 max-w-full truncate px-2 font-titol text-xl font-extrabold leading-tight text-trinquet-fosc">{alumne.nom}</span>
        <span className="mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: nivell.color }}>
          {nivell.icona} {nomNivell(nivell, alumne.genere)}
        </span>
        {/* Barra cap al nivell següent */}
        <div className="mt-2 h-2 w-4/5 overflow-hidden rounded-full bg-slate-100" title={seguent ? `Falten ${falten} quinzes per a ${nomNivell(seguent, alumne.genere)}` : 'Nivell màxim!'}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.round(percent * 100)}%`, background: nivell.color }} />
        </div>

        {/* Marcador de quinzes (forma de pilota) */}
        <div className={`absolute right-2 top-2 flex h-12 w-12 flex-col items-center justify-center rounded-full border-[3px] border-trinquet-fosc bg-white shadow ${animant && positiu ? 'scale-125' : ''} transition`}>
          <span className="font-titol text-xl font-extrabold leading-none text-trinquet-fosc">{alumne.quinzes}</span>
        </div>

        {avisosAvui > 0 && (
          <span className="absolute left-2 top-12 flex gap-0.5" title={`${avisosAvui} avís/avisos hui`}>
            {Array.from({ length: Math.min(avisosAvui, 3) }).map((_, i) => <span key={i} className="h-3 w-3 rounded-full border-2 border-white bg-amber-400" />)}
          </span>
        )}
        {modeSeleccio && (
          <span className={`absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 text-lg font-bold ${seleccionat ? 'border-or-500 bg-or-400 text-white' : 'border-slate-300 bg-white'}`}>{seleccionat ? '✓' : ''}</span>
        )}
      </button>

      {/* Botó d'absència */}
      {!modeSeleccio && (
        <button
          onClick={() => dispatch({ type: 'ALUMNE_ABSENT', id: alumne.id })}
          className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-slate-500 opacity-70 hover:opacity-100"
          title={alumne.absent ? 'Marca com a present' : 'Marca com a absent'}
        >
          {alumne.absent ? 'Absent' : '🙋'}
        </button>
      )}

      {/* Etiquetes flotants «+1» */}
      {meus.map((e) => (
        <span
          key={e.id}
          className={`pointer-events-none absolute left-1/2 top-1/3 z-20 -translate-x-1/2 animate-puja whitespace-nowrap rounded-full px-3 py-1 font-titol text-3xl font-extrabold shadow-lg ${e.tipus === 'positiu' ? 'bg-emerald-500 text-white' : 'bg-amber-300 text-amber-900'}`}
        >
          {e.text}
        </span>
      ))}
    </div>
  );
}
