// Informes senzills de progrés: grupal i individual. Exportació a CSV i impressió.
import { useMemo, useState } from 'react';
import Modal from './Modal.jsx';
import AvatarPilotari from './AvatarPilotari.jsx';
import { nivellDe, nomNivell } from '../lib/nivells.js';
import { useClasse } from '../state/classStore.jsx';

const PERIODES = [['7', 'Última setmana'], ['30', 'Últim mes'], ['tot', 'Tot el curs']];
const dataCurta = (iso) => new Date(iso).toLocaleString('ca-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

function Barra({ valor, max, color }) {
  return (
    <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full" style={{ width: `${max ? (valor / max) * 100 : 0}%`, background: color }} />
    </div>
  );
}

export default function Informes({ obert, onTancar }) {
  const { estat } = useClasse();
  const [periode, setPeriode] = useState('7');
  const [alumneId, setAlumneId] = useState('grup');

  const events = useMemo(() => {
    if (periode === 'tot') return estat.historial;
    const des = Date.now() - Number(periode) * 86400000;
    return estat.historial.filter((e) => new Date(e.data).getTime() >= des);
  }, [estat.historial, periode]);

  const filtrats = alumneId === 'grup' ? events : events.filter((e) => e.alumneId === alumneId);
  const perCategoria = estat.categories.map((c) => ({ c, n: filtrats.filter((e) => e.categoriaId === c.id).length }));
  const maxCat = Math.max(1, ...perCategoria.map((x) => x.n));
  const positius = filtrats.filter((e) => e.delta > 0).reduce((s, e) => s + e.delta, 0);
  const millores = filtrats.filter((e) => e.delta < 0 || e.avis).length;

  const perAlumne = estat.alumnes.map((a) => ({
    a,
    guanyats: events.filter((e) => e.alumneId === a.id && e.delta > 0).reduce((s, e) => s + e.delta, 0),
    millores: events.filter((e) => e.alumneId === a.id && (e.delta < 0 || e.avis)).length,
  })).sort((x, y) => x.a.nom.localeCompare(y.a.nom, 'ca'));
  const maxAl = Math.max(1, ...perAlumne.map((x) => x.guanyats));

  const exportarCSV = () => {
    const cats = estat.categories;
    const capcalera = ['Alumne/a', 'Quinzes actuals', 'Rècord', 'Nivell', ...cats.map((c) => c.nom)];
    const files = estat.alumnes.map((a) => [
      a.nom, a.quinzes, a.record, nomNivell(nivellDe(a.record), a.genere),
      ...cats.map((c) => events.filter((e) => e.alumneId === a.id && e.categoriaId === c.id).length),
    ]);
    const csv = [capcalera, ...files].map((f) => f.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `informe-trinquet-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const alumne = estat.alumnes.find((a) => a.id === alumneId);
  const nomCat = (id) => estat.categories.find((c) => c.id === id);

  return (
    <Modal obert={obert} onTancar={onTancar} titol="📊 Informes de progrés" ample="max-w-5xl">
      <div className="mb-5 flex flex-wrap items-center gap-2 print:hidden">
        <select value={alumneId} onChange={(e) => setAlumneId(e.target.value)} className="camp" aria-label="Alumne/a">
          <option value="grup">👥 Tot el grup</option>
          {estat.alumnes.map((a) => <option key={a.id} value={a.id}>{a.nom}</option>)}
        </select>
        {PERIODES.map(([v, n]) => (
          <button key={v} onClick={() => setPeriode(v)} className={`rounded-full px-4 py-2 font-bold ${periode === v ? 'bg-trinquet-fosc text-white' : 'bg-slate-100'}`}>{n}</button>
        ))}
        <span className="flex-1" />
        <button onClick={exportarCSV} className="rounded-full bg-emerald-100 px-4 py-2 font-bold text-emerald-800">⬇️ CSV</button>
        <button onClick={() => window.print()} className="rounded-full bg-slate-100 px-4 py-2 font-bold">🖨️ Imprimir</button>
      </div>

      {alumne && (
        <div className="mb-5 flex items-center gap-4 rounded-3xl bg-trinquet-paret p-4">
          <AvatarPilotari avatar={alumne.avatar} record={alumne.record} mida={80} />
          <div>
            <p className="font-titol text-3xl font-extrabold">{alumne.nom}</p>
            <p className="text-slate-600">{alumne.quinzes} quinzes · rècord {alumne.record} · {nivellDe(alumne.record).icona} {nomNivell(nivellDe(alumne.record), alumne.genere)}</p>
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-emerald-50 p-4"><p className="font-titol text-4xl font-extrabold text-emerald-700">+{positius}</p><p className="text-sm text-emerald-800">quinzes guanyats</p></div>
        <div className="rounded-2xl bg-amber-50 p-4"><p className="font-titol text-4xl font-extrabold text-amber-700">{millores}</p><p className="text-sm text-amber-800">aspectes a millorar</p></div>
        <div className="rounded-2xl bg-blau-50 p-4"><p className="font-titol text-4xl font-extrabold text-blau-700">{filtrats.length ? Math.round((filtrats.filter((e) => e.delta > 0).length / filtrats.length) * 100) : 0}%</p><p className="text-sm text-blau-700">accions positives</p></div>
      </div>

      <h3 className="mb-2 font-titol text-xl font-extrabold">Per categories</h3>
      <div className="mb-6 space-y-2">
        {perCategoria.map(({ c, n }) => (
          <div key={c.id} className="flex items-center gap-3">
            <span className="w-48 truncate font-bold">{c.icona} {c.nom}</span>
            <Barra valor={n} max={maxCat} color={c.tipus === 'positiu' ? '#10b981' : '#f59e0b'} />
            <span className="w-8 text-right font-bold">{n}</span>
          </div>
        ))}
      </div>

      {alumneId === 'grup' ? (
        <>
          <h3 className="mb-2 font-titol text-xl font-extrabold">Quinzes guanyats per alumne/a</h3>
          <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {perAlumne.map(({ a, guanyats, millores: m }) => (
              <button key={a.id} onClick={() => setAlumneId(a.id)} className="flex items-center gap-2 rounded-lg px-1 text-left hover:bg-slate-50">
                <span className="w-24 truncate font-bold">{a.nom}</span>
                <Barra valor={guanyats} max={maxAl} color={a.avatar.samarreta === 'roig' ? '#dc2626' : '#2563eb'} />
                <span className="w-10 text-right font-bold">{guanyats}</span>
                <span className="w-8 text-right text-sm text-amber-700">{m ? `⚠${m}` : ''}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 className="mb-2 font-titol text-xl font-extrabold">Últimes accions</h3>
          <ul className="divide-y divide-slate-100 rounded-2xl ring-1 ring-slate-200">
            {filtrats.slice(-25).reverse().map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-3 py-2">
                <span className="text-xl">{nomCat(e.categoriaId)?.icona ?? '•'}</span>
                <span className="flex-1">{nomCat(e.categoriaId)?.nom ?? 'Categoria eliminada'}</span>
                <span className={`font-bold ${e.delta > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{e.avis ? 'avís' : e.delta > 0 ? `+${e.delta}` : e.delta}</span>
                <span className="w-28 text-right text-sm text-slate-500">{dataCurta(e.data)}</span>
              </li>
            ))}
            {filtrats.length === 0 && <li className="p-4 text-center text-slate-500">Encara no hi ha accions en aquest període.</li>}
          </ul>
        </>
      )}
    </Modal>
  );
}
