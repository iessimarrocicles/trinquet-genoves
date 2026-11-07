// Finestra per a sumar (o anotar millores) a un alumne, a una selecció o a tota la classe.
import Modal from './Modal.jsx';
import AvatarPilotari from './AvatarPilotari.jsx';
import { COLORS_CATEGORIA } from '../data/barem.js';
import { useClasse } from '../state/classStore.jsx';

function BotoCategoria({ cat, onClick }) {
  const positiu = cat.tipus === 'positiu';
  const etiqueta = positiu ? `+${cat.punts}` : cat.mode === 'avis' ? 'Avís' : `${cat.punts}`;
  return (
    <button
      onClick={onClick}
      className={`group flex min-h-[110px] flex-col items-center justify-center gap-1 rounded-2xl p-3 text-center shadow-sm ring-2 transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${positiu ? 'bg-white ring-emerald-100 hover:ring-emerald-300' : 'bg-slate-50 ring-slate-200 hover:ring-amber-300'}`}
    >
      <span className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl ${COLORS_CATEGORIA[cat.color] ?? 'bg-slate-300'} bg-opacity-90 shadow-inner`}>{cat.icona}</span>
      <span className="font-titol text-lg font-extrabold leading-tight text-trinquet-fosc">{cat.nom}</span>
      <span className="text-xs leading-tight text-slate-500">{cat.descripcio}</span>
      <span className={`mt-1 rounded-full px-3 py-0.5 text-sm font-extrabold ${positiu ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-900'}`}>{etiqueta}</span>
    </button>
  );
}

export default function ModalPunts({ destinataris, onTancar }) {
  const { estat, atorgar } = useClasse();
  if (!destinataris) return null;
  const { ids, titol } = destinataris;
  const alumnes = estat.alumnes.filter((a) => ids.includes(a.id));
  const positives = estat.categories.filter((c) => c.tipus === 'positiu');
  const millores = estat.categories.filter((c) => c.tipus === 'millora');

  const triar = (cat) => {
    atorgar(ids, cat.id);
    onTancar();
  };

  return (
    <Modal obert onTancar={onTancar} titol={titol} ample="max-w-4xl">
      {alumnes.length === 1 ? (
        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-trinquet-paret p-3">
          <AvatarPilotari avatar={alumnes[0].avatar} record={alumnes[0].record} mida={64} />
          <div>
            <p className="font-titol text-2xl font-extrabold text-trinquet-fosc">{alumnes[0].nom}</p>
            <p className="text-slate-600">Té <b>{alumnes[0].quinzes}</b> quinzes</p>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex -space-x-4 overflow-hidden rounded-2xl bg-trinquet-paret p-3">
          {alumnes.slice(0, 14).map((a) => <AvatarPilotari key={a.id} avatar={a.avatar} record={a.record} mida={44} />)}
          {alumnes.length > 14 && <span className="ml-6 self-center font-bold text-slate-600">+{alumnes.length - 14}</span>}
        </div>
      )}

      <h3 className="mb-2 font-titol text-xl font-extrabold text-emerald-700">⚪ Sumar quinzes</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {positives.map((c) => <BotoCategoria key={c.id} cat={c} onClick={() => triar(c)} />)}
      </div>

      {millores.length > 0 && (
        <>
          <h3 className="mb-2 mt-6 font-titol text-xl font-extrabold text-amber-700">🌱 Per a millorar</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {millores.map((c) => <BotoCategoria key={c.id} cat={c} onClick={() => triar(c)} />)}
          </div>
          <p className="mt-2 text-xs text-slate-500">Els «avisos» no resten quinzes: només queden anotats a l'informe. Ho pots canviar a ⚙️ Configuració.</p>
        </>
      )}
    </Modal>
  );
}
