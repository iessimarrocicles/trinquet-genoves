// Celebració a pantalla completa: pujada de nivell o partida guanyada.
import { useEffect, useMemo } from 'react';
import AvatarPilotari from './AvatarPilotari.jsx';
import { useClasse } from '../state/classStore.jsx';

function PlujaPilotes() {
  const peces = useMemo(
    () => Array.from({ length: 36 }).map((_, i) => ({
      i, left: Math.random() * 100, delay: Math.random() * 1.2, mida: 18 + Math.random() * 22,
      emoji: ['⚪', '⭐', '🔵', '🔴', '✨'][i % 5],
    })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {peces.map((p) => (
        <span key={p.i} className="absolute top-0 animate-cau" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, fontSize: p.mida }}>{p.emoji}</span>
      ))}
    </div>
  );
}

export default function Celebracio() {
  const { celebracio, setCelebracio } = useClasse();

  useEffect(() => {
    if (!celebracio) return;
    const t = setTimeout(() => setCelebracio(null), celebracio.tipus === 'partida' ? 9000 : 5000);
    return () => clearTimeout(t);
  }, [celebracio, setCelebracio]);

  if (!celebracio) return null;
  const tancar = () => setCelebracio(null);

  return (
    <>
      <PlujaPilotes />
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-trinquet-fosc/70 p-4" onClick={tancar}>
        <div className="w-full max-w-xl animate-apareix rounded-[2rem] bg-white p-6 text-center shadow-2xl">
          {celebracio.tipus === 'partida' && (
            <>
              <p className="text-7xl">🏆</p>
              <h2 className="mt-2 font-titol text-4xl font-extrabold text-trinquet-fosc">Partida guanyada!</h2>
              <p className="mt-2 text-lg text-slate-600">Tota la classe ha jugat com un equip de campions i campiones.</p>
              <p className="mt-4 rounded-2xl bg-or-400/30 p-4 font-titol text-2xl font-extrabold text-trinquet-fosc">🎁 {celebracio.premi}</p>
            </>
          )}
          {celebracio.pujades?.length > 0 && (
            <>
              <h2 className={`font-titol font-extrabold text-trinquet-fosc ${celebracio.tipus === 'partida' ? 'mt-5 text-2xl' : 'text-4xl'}`}>
                {celebracio.pujades.length === 1 ? 'Puja de nivell!' : `${celebracio.pujades.length} pilotaris pugen de nivell!`}
              </h2>
              <div className="mt-4 flex max-h-[40vh] flex-wrap justify-center gap-4 overflow-y-auto">
                {celebracio.pujades.map(({ alumne, nivell, nom }) => (
                  <div key={alumne.id} className="flex flex-col items-center">
                    <AvatarPilotari avatar={alumne.avatar} record={nivell.min} mida={celebracio.pujades.length > 3 ? 56 : 110} animat />
                    <p className={`font-titol font-extrabold ${celebracio.pujades.length > 3 ? 'text-base' : 'text-2xl'}`}>{alumne.nom}</p>
                    <p className="rounded-full px-3 py-0.5 text-sm font-bold text-white" style={{ background: nivell.color }}>{nivell.icona} {nom}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <button onClick={tancar} className="mt-6 rounded-full bg-blau-600 px-8 py-3 font-titol text-xl font-bold text-white hover:bg-blau-700">Som-hi! ▶</button>
        </div>
      </div>
    </>
  );
}
