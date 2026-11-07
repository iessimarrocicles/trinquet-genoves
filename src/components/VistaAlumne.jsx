// Vista de l'alumnat: cada xiquet/a tria el seu nom, veu el seu avatar, els seus quinzes,
// la Partida de la classe i l'equipament que pot desbloquejar.
import { useState } from 'react';
import AvatarPilotari from './AvatarPilotari.jsx';
import EditorAvatar from './EditorAvatar.jsx';
import MarcadorPartida from './MarcadorPartida.jsx';
import { COSMETICS } from '../data/barem.js';
import { nivellDe, nomNivell, progresNivell } from '../lib/nivells.js';
import { useClasse } from '../state/classStore.jsx';

export default function VistaAlumne({ onEixir }) {
  const { estat } = useClasse();
  const [id, setId] = useState(null);
  const [vestidor, setVestidor] = useState(false);
  const alumne = estat.alumnes.find((a) => a.id === id);

  if (!alumne) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-titol text-3xl font-extrabold text-trinquet-fosc">Qui eres? Toca el teu nom 👇</h1>
          <button onClick={onEixir} className="rounded-full bg-white px-5 py-3 font-bold shadow">← Mestre/a</button>
        </div>
        <MarcadorPartida />
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {estat.alumnes.map((a) => (
            <button key={a.id} onClick={() => setId(a.id)} className="flex flex-col items-center rounded-3xl bg-white p-3 shadow hover:-translate-y-1 hover:shadow-lg">
              <AvatarPilotari avatar={a.avatar} record={a.record} mida={70} />
              <span className="font-titol text-xl font-extrabold">{a.nom}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const nivell = nivellDe(alumne.record);
  const { percent, falten, seguent } = progresNivell(alumne.record);
  const proper = COSMETICS.find((c) => c.min > alumne.record);

  return (
    <div className="mx-auto max-w-5xl p-4">
      <button onClick={() => { setId(null); setVestidor(false); }} className="mb-4 rounded-full bg-white px-5 py-3 font-bold shadow">← Canviar de pilotari</button>
      {vestidor ? (
        <div className="rounded-3xl bg-white p-5 shadow">
          <h2 className="mb-4 font-titol text-3xl font-extrabold">👕 El meu vestidor</h2>
          <EditorAvatar alumne={alumne} />
          <button onClick={() => setVestidor(false)} className="boto-primari mt-4">Fet! ✓</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1fr,1.2fr]">
          <div className="flex flex-col items-center rounded-3xl bg-white p-6 shadow">
            <AvatarPilotari avatar={alumne.avatar} record={alumne.record} mida={200} animat />
            <h2 className="font-titol text-4xl font-extrabold">{alumne.nom}</h2>
            <span className="mt-1 rounded-full px-4 py-1 text-lg font-bold text-white" style={{ background: nivell.color }}>{nivell.icona} {nomNivell(nivell, alumne.genere)}</span>
            <button onClick={() => setVestidor(true)} className="boto-primari mt-4">👕 Canviar l'equipament</button>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 text-center shadow">
              <p className="font-bold uppercase tracking-widest text-slate-500">Els meus quinzes</p>
              <p className="font-titol text-8xl font-extrabold text-blau-600">{alumne.quinzes}</p>
              <div className="mx-auto mt-2 h-5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full" style={{ width: `${percent * 100}%`, background: nivell.color }} />
              </div>
              <p className="mt-2 text-lg">{seguent ? <>Et falten <b>{falten}</b> quinzes per a ser <b>{nomNivell(seguent, alumne.genere)}</b> {seguent.icona}</> : 'Ets el màxim nivell! 🏆'}</p>
              {proper && <p className="mt-1 text-slate-600">Pròxim premi: {proper.icona} <b>{proper.nom}</b> amb {proper.min} quinzes</p>}
            </div>
            <MarcadorPartida compacte />
          </div>
        </div>
      )}
    </div>
  );
}
