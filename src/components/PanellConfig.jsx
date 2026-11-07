// Configuració del mestre/a: alumnat, categories del barem, partida i dades.
import { useRef, useState } from 'react';
import Modal from './Modal.jsx';
import EditorAvatar from './EditorAvatar.jsx';
import AvatarPilotari from './AvatarPilotari.jsx';
import CompteMestre from './CompteMestre.jsx';
import { COLORS_CATEGORIA } from '../data/barem.js';
import { useClasse } from '../state/classStore.jsx';

const PESTANYES = [['alumnat', '👧👦 Alumnat'], ['barem', '🎯 Barem'], ['partida', '🏆 Partida'], ['dades', '☁️ Compte i dades']];

function Alumnat() {
  const { estat, dispatch } = useClasse();
  const [nom, setNom] = useState('');
  const [genere, setGenere] = useState('x');
  const [editant, setEditant] = useState(null);
  const [llista, setLlista] = useState('');
  const alumneEditant = estat.alumnes.find((a) => a.id === editant);

  const afegir = (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    dispatch({ type: 'ALUMNE_AFEGIR', nom: nom.trim(), genere });
    setNom('');
  };
  const afegirLlista = () => {
    llista.split('\n').map((n) => n.trim()).filter(Boolean).forEach((n) => dispatch({ type: 'ALUMNE_AFEGIR', nom: n, genere: 'x' }));
    setLlista('');
  };

  if (alumneEditant) {
    return (
      <div>
        <button onClick={() => setEditant(null)} className="mb-4 rounded-full bg-slate-100 px-4 py-2 font-bold">← Tornar a la llista</button>
        <EditorAvatar alumne={alumneEditant} permetreNom />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={afegir} className="flex flex-wrap gap-2">
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom de l'alumne/a" className="camp flex-1" aria-label="Nom" />
        <select value={genere} onChange={(e) => setGenere(e.target.value)} className="camp" aria-label="Gènere">
          <option value="o">Xiquet</option><option value="a">Xiqueta</option><option value="x">Sense especificar</option>
        </select>
        <button className="boto-primari">+ Afegir</button>
      </form>
      <details className="rounded-2xl bg-slate-50 p-3">
        <summary className="cursor-pointer font-bold text-slate-600">Afegir una llista sencera (un nom per línia)</summary>
        <textarea value={llista} onChange={(e) => setLlista(e.target.value)} rows={5} className="camp mt-2 w-full" placeholder={'Aitana\nPau\nNeus'} />
        <button onClick={afegirLlista} className="boto-primari mt-2">Afegir la llista</button>
      </details>
      <ul className="grid gap-2 sm:grid-cols-2">
        {estat.alumnes.map((a) => (
          <li key={a.id} className="flex items-center gap-3 rounded-2xl bg-white p-2 ring-1 ring-slate-200">
            <AvatarPilotari avatar={a.avatar} record={a.record} mida={40} />
            <span className="flex-1 font-bold">{a.nom} <small className="font-normal text-slate-500">· {a.quinzes} quinzes</small></span>
            <button onClick={() => setEditant(a.id)} className="rounded-full bg-blau-50 px-3 py-2 text-sm font-bold text-blau-700">✏️ Editar</button>
            <button onClick={() => confirm(`Segur que vols eliminar ${a.nom}? Es perdran els seus quinzes.`) && dispatch({ type: 'ALUMNE_ELIMINAR', id: a.id })} className="rounded-full bg-roig-50 px-3 py-2 text-sm font-bold text-roig-700" aria-label={`Elimina ${a.nom}`}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Barem() {
  const { estat, dispatch } = useClasse();
  const edita = (id, canvis) => dispatch({ type: 'CATEGORIA_EDITAR', id, canvis });
  const nova = (tipus) => dispatch({
    type: 'CATEGORIA_AFEGIR',
    categoria: tipus === 'positiu'
      ? { tipus, nom: 'Nova categoria', descripcio: '', punts: 1, icona: '⚪', color: 'blau' }
      : { tipus, nom: 'Nova millora', descripcio: '', punts: -1, mode: 'avis', icona: '🌱', color: 'gris' },
  });

  const fila = (c) => (
    <div key={c.id} className="grid grid-cols-[56px,1fr] gap-2 rounded-2xl bg-white p-3 ring-1 ring-slate-200 sm:grid-cols-[56px,1fr,1.4fr,auto,auto,auto]">
      <input value={c.icona} onChange={(e) => edita(c.id, { icona: e.target.value })} className="camp text-center text-2xl" aria-label="Icona" />
      <input value={c.nom} onChange={(e) => edita(c.id, { nom: e.target.value })} className="camp font-bold" aria-label="Nom" />
      <input value={c.descripcio} onChange={(e) => edita(c.id, { descripcio: e.target.value })} className="camp col-span-2 sm:col-span-1" placeholder="Descripció" aria-label="Descripció" />
      <select value={c.punts} onChange={(e) => edita(c.id, { punts: Number(e.target.value) })} className="camp" aria-label="Punts">
        {(c.tipus === 'positiu' ? [1, 2, 3, 5] : [-1, -2]).map((p) => <option key={p} value={p}>{p > 0 ? `+${p}` : p}</option>)}
      </select>
      {c.tipus === 'millora' ? (
        <select value={c.mode} onChange={(e) => edita(c.id, { mode: e.target.value })} className="camp" aria-label="Mode">
          <option value="avis">Només avís</option><option value="resta">Resta quinzes</option>
        </select>
      ) : (
        <select value={c.color} onChange={(e) => edita(c.id, { color: e.target.value })} className="camp" aria-label="Color">
          {Object.keys(COLORS_CATEGORIA).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      )}
      <button onClick={() => confirm(`Eliminar «${c.nom}»?`) && dispatch({ type: 'CATEGORIA_ELIMINAR', id: c.id })} className="rounded-xl bg-roig-50 px-3 font-bold text-roig-700" aria-label={`Elimina ${c.nom}`}>🗑️</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 font-titol text-xl font-extrabold text-emerald-700">Sumar quinzes</h3>
        <div className="space-y-2">{estat.categories.filter((c) => c.tipus === 'positiu').map(fila)}</div>
        <button onClick={() => nova('positiu')} className="boto-primari mt-2">+ Nova categoria positiva</button>
      </section>
      <section>
        <h3 className="mb-2 font-titol text-xl font-extrabold text-amber-700">Per a millorar</h3>
        <div className="space-y-2">{estat.categories.filter((c) => c.tipus === 'millora').map(fila)}</div>
        <button onClick={() => nova('millora')} className="mt-2 rounded-full bg-amber-100 px-5 py-3 font-bold text-amber-800">+ Nova categoria de millora</button>
      </section>
    </div>
  );
}

function Partida() {
  const { estat, dispatch } = useClasse();
  const p = estat.partida;
  const set = (canvis) => dispatch({ type: 'PARTIDA_CONFIG', canvis });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block"><span className="font-bold text-slate-600">Nom de l'aula</span>
        <input value={estat.aula.nom} onChange={(e) => dispatch({ type: 'AULA_EDITAR', canvis: { nom: e.target.value } })} className="camp mt-1 w-full" /></label>
      <label className="block"><span className="font-bold text-slate-600">Premi de la partida</span>
        <input value={p.premi} onChange={(e) => set({ premi: e.target.value })} className="camp mt-1 w-full" /></label>
      <label className="block"><span className="font-bold text-slate-600">Quinzes per joc</span>
        <input type="number" min={1} value={p.quinzesPerJoc} onChange={(e) => set({ quinzesPerJoc: Math.max(1, Number(e.target.value)) })} className="camp mt-1 w-full" /></label>
      <label className="block"><span className="font-bold text-slate-600">Jocs per a guanyar la partida</span>
        <input type="number" min={1} max={30} value={p.jocsObjectiu} onChange={(e) => set({ jocsObjectiu: Math.min(30, Math.max(1, Number(e.target.value))) })} className="camp mt-1 w-full" /></label>
      <p className="rounded-2xl bg-trinquet-paret p-3 text-slate-700 sm:col-span-2">
        Objectiu actual: <b>{p.quinzesPerJoc * p.jocsObjectiu} quinzes</b> entre tota la classe. Amb {estat.alumnes.length} alumnes, «Tota la classe +1» suma {estat.alumnes.length} quinzes a la partida.
      </p>
      <button onClick={() => confirm('Començar una partida nova des de zero?') && dispatch({ type: 'PARTIDA_NOVA' })} className="rounded-full bg-slate-100 px-5 py-3 font-bold sm:col-span-2">🔄 Nova partida</button>
    </div>
  );
}

function Dades() {
  const { estat, dispatch, modeStorage } = useClasse();
  const fitxer = useRef(null);
  const exportar = () => {
    const blob = new Blob([JSON.stringify(estat, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `trinquet-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importar = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const dades = JSON.parse(await f.text());
      if (!Array.isArray(dades.alumnes)) throw new Error('format');
      dispatch({ type: 'CARREGAR', estat: dades });
      alert('Còpia de seguretat recuperada!');
    } catch {
      alert("El fitxer no és una còpia vàlida d'El Trinquet.");
    }
  };
  return (
    <div className="space-y-3">
      <CompteMestre />
      <p className="rounded-2xl bg-blau-50 p-3 text-blau-700">
        Emmagatzematge: <b>{modeStorage === 'supabase' ? 'Núvol (Supabase)' : 'Aquest navegador (local)'}</b>. Fes còpies de seguretat sovint si treballes en local.
      </p>
      <div className="flex flex-wrap gap-2">
        <button onClick={exportar} className="boto-primari">⬇️ Descarregar còpia</button>
        <button onClick={() => fitxer.current?.click()} className="rounded-full bg-slate-100 px-5 py-3 font-bold">⬆️ Recuperar còpia</button>
        <input ref={fitxer} type="file" accept="application/json" className="hidden" onChange={importar} />
      </div>
      <hr />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => confirm('Posar els quinzes de tot l’alumnat a 0? (Els nivells i l’equipament desbloquejat es mantenen)') && dispatch({ type: 'QUINZES_REINICIAR' })} className="rounded-full bg-amber-100 px-5 py-3 font-bold text-amber-800">🗓️ Nou trimestre (quinzes a 0)</button>
        <button onClick={() => confirm('ATENCIÓ: s’esborrarà tot i tornarà l’alumnat de demostració. Continuar?') && dispatch({ type: 'TOT_REINICIAR' })} className="rounded-full bg-roig-50 px-5 py-3 font-bold text-roig-700">⚠️ Reiniciar-ho tot</button>
      </div>
    </div>
  );
}

export default function PanellConfig({ obert, onTancar }) {
  const [pestanya, setPestanya] = useState('alumnat');
  return (
    <Modal obert={obert} onTancar={onTancar} titol="⚙️ Configuració" ample="max-w-5xl">
      <div className="mb-5 flex flex-wrap gap-2" role="tablist">
        {PESTANYES.map(([id, nom]) => (
          <button key={id} role="tab" aria-selected={pestanya === id} onClick={() => setPestanya(id)}
            className={`rounded-full px-5 py-3 font-bold transition ${pestanya === id ? 'bg-trinquet-fosc text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{nom}</button>
        ))}
      </div>
      {pestanya === 'alumnat' && <Alumnat />}
      {pestanya === 'barem' && <Barem />}
      {pestanya === 'partida' && <Partida />}
      {pestanya === 'dades' && <Dades />}
    </Modal>
  );
}
