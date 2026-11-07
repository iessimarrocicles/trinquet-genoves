// Personalització de l'avatar. Els complements es desbloquegen amb els quinzes.
import AvatarPilotari from './AvatarPilotari.jsx';
import { COSMETICS } from '../data/barem.js';
import { OPCIONS_AVATAR } from '../data/alumnesDemo.js';
import { useClasse } from '../state/classStore.jsx';

const NOMS_PENTINAT = { curt: 'Curt', llarg: 'Llarg', cua: 'Cua', arrissat: 'Arrissat', rapat: 'Rapat' };

function Fila({ titol, children }) {
  return (
    <div className="mb-4">
      <p className="mb-2 font-bold text-slate-600">{titol}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function EditorAvatar({ alumne, permetreNom = false }) {
  const { dispatch } = useClasse();
  const av = alumne.avatar;
  const canvia = (canvis) => dispatch({ type: 'ALUMNE_EDITAR', id: alumne.id, canvis: { avatar: { ...av, ...canvis } } });
  const commuta = (id) => canvia({ complements: av.complements.includes(id) ? av.complements.filter((c) => c !== id) : [...av.complements, id] });
  const opcio = (actiu) => `rounded-2xl px-4 py-3 font-bold ring-2 transition active:scale-95 ${actiu ? 'bg-or-400/30 ring-or-500' : 'bg-white ring-slate-200 hover:ring-slate-300'}`;

  return (
    <div className="grid gap-6 md:grid-cols-[220px,1fr]">
      <div className="flex flex-col items-center rounded-3xl bg-trinquet-paret p-4">
        <AvatarPilotari avatar={av} record={alumne.record} mida={180} />
        <p className="mt-2 font-titol text-2xl font-extrabold">{alumne.nom}</p>
        <p className="text-slate-600">{alumne.record} quinzes de rècord</p>
      </div>
      <div>
        {permetreNom && (
          <Fila titol="Nom i gènere (per al nom del nivell)">
            <input value={alumne.nom} onChange={(e) => dispatch({ type: 'ALUMNE_EDITAR', id: alumne.id, canvis: { nom: e.target.value } })} className="camp flex-1" aria-label="Nom" />
            <select value={alumne.genere} onChange={(e) => dispatch({ type: 'ALUMNE_EDITAR', id: alumne.id, canvis: { genere: e.target.value } })} className="camp" aria-label="Gènere">
              <option value="o">Xiquet (Campió)</option><option value="a">Xiqueta (Campiona)</option><option value="x">Sense especificar</option>
            </select>
          </Fila>
        )}
        <Fila titol="Samarreta">
          <button className={opcio(av.samarreta === 'blau')} onClick={() => canvia({ samarreta: 'blau' })}>🔵 Blava</button>
          <button className={opcio(av.samarreta === 'roig')} onClick={() => canvia({ samarreta: 'roig' })}>🔴 Roja</button>
        </Fila>
        <Fila titol="Pell">
          {OPCIONS_AVATAR.PELLS.map((p) => (
            <button key={p} onClick={() => canvia({ pell: p })} className={`h-12 w-12 rounded-full ring-4 ${av.pell === p ? 'ring-or-500' : 'ring-transparent'}`} style={{ background: p }} aria-label="Color de pell" />
          ))}
        </Fila>
        <Fila titol="Cabell">
          {OPCIONS_AVATAR.CABELLS.map((c) => (
            <button key={c} onClick={() => canvia({ cabell: c })} className={`h-12 w-12 rounded-full ring-4 ${av.cabell === c ? 'ring-or-500' : 'ring-transparent'}`} style={{ background: c }} aria-label="Color de cabell" />
          ))}
        </Fila>
        <Fila titol="Pentinat">
          {OPCIONS_AVATAR.PENTINATS.map((p) => <button key={p} className={opcio(av.pentinat === p)} onClick={() => canvia({ pentinat: p })}>{NOMS_PENTINAT[p]}</button>)}
        </Fila>
        <Fila titol="Equipament de pilotari (es desbloqueja amb quinzes)">
          {COSMETICS.map((c) => {
            const obert = alumne.record >= c.min;
            const posat = av.complements.includes(c.id);
            return (
              <button key={c.id} disabled={!obert} onClick={() => commuta(c.id)} title={c.descripcio}
                className={`${opcio(posat && obert)} ${obert ? '' : 'cursor-not-allowed opacity-50'} flex items-center gap-2`}>
                <span className="text-2xl">{obert ? c.icona : '🔒'}</span>
                <span className="text-left leading-tight">{c.nom}<br /><small className="font-normal text-slate-500">{obert ? (posat ? 'Posat ✓' : 'Toca per a posar') : `Amb ${c.min} quinzes`}</small></span>
              </button>
            );
          })}
        </Fila>
      </div>
    </div>
  );
}
