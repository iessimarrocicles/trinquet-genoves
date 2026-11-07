// ─────────────────────────────────────────────────────────────
//  PANTALLA PRINCIPAL DEL MESTRE/A — «El Trinquet Virtual»
// ─────────────────────────────────────────────────────────────
import { useMemo, useRef, useState } from 'react';
import TargetaAlumne from './components/TargetaAlumne.jsx';
import MarcadorPartida from './components/MarcadorPartida.jsx';
import ModalPunts from './components/ModalPunts.jsx';
import Celebracio from './components/Celebracio.jsx';
import PanellConfig from './components/PanellConfig.jsx';
import Informes from './components/Informes.jsx';
import VistaAlumne from './components/VistaAlumne.jsx';
import { useClasse } from './state/classStore.jsx';
import { sons } from './lib/so.js';
import Pilota from './components/Pilota.jsx';

const esHui = (iso) => new Date(iso).toDateString() === new Date().toDateString();

function BotoBarra({ children, onClick, actiu, color = 'bg-white text-trinquet-fosc', ...rest }) {
  return (
    <button onClick={onClick} {...rest}
      className={`flex min-h-[56px] items-center gap-2 rounded-2xl px-4 font-titol text-lg font-bold shadow-sm ring-2 transition hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:hover:translate-y-0 ${actiu ? 'bg-or-400 text-trinquet-fosc ring-or-500' : `${color} ring-black/5`}`}>
      {children}
    </button>
  );
}

export default function App() {
  const { estat, dispatch, carregat, modeStorage } = useClasse();
  const [vista, setVista] = useState('mestre');
  const [destinataris, setDestinataris] = useState(null); // { ids, titol }
  const [modeSeleccio, setModeSeleccio] = useState(false);
  const [seleccionats, setSeleccionats] = useState([]);
  const [destacat, setDestacat] = useState(null);
  const [rifant, setRifant] = useState(false);
  const [config, setConfig] = useState(false);
  const [informes, setInformes] = useState(false);
  const rifaRef = useRef(null);

  const presents = estat.alumnes.filter((a) => !a.absent);
  const ordenats = useMemo(() => {
    const l = [...estat.alumnes];
    if (estat.config.ordre === 'quinzes') l.sort((a, b) => b.quinzes - a.quinzes || a.nom.localeCompare(b.nom, 'ca'));
    else l.sort((a, b) => a.nom.localeCompare(b.nom, 'ca'));
    return l;
  }, [estat.alumnes, estat.config.ordre]);

  const avisosAvui = useMemo(() => {
    const m = {};
    estat.historial.forEach((e) => { if (e.avis && esHui(e.data)) m[e.alumneId] = (m[e.alumneId] ?? 0) + 1; });
    return m;
  }, [estat.historial]);

  const darrerLot = estat.historial.at(-1);
  const darreraCat = darrerLot && estat.categories.find((c) => c.id === darrerLot.categoriaId);

  const clicTargeta = (a) => {
    if (modeSeleccio) {
      setSeleccionats((s) => (s.includes(a.id) ? s.filter((x) => x !== a.id) : [...s, a.id]));
    } else {
      setDestinataris({ ids: [a.id], titol: a.nom });
    }
  };

  /** La rifa de la pilota: la pilota bota de targeta en targeta i s'atura en algú a l'atzar. */
  const ferRifa = () => {
    if (rifant || presents.length === 0) return;
    setRifant(true);
    const guanyador = presents[Math.floor(Math.random() * presents.length)];
    let pas = 0;
    const total = 16 + Math.floor(Math.random() * 6);
    const salta = () => {
      pas += 1;
      const actual = pas >= total ? guanyador : presents[Math.floor(Math.random() * presents.length)];
      setDestacat(actual.id);
      if (estat.config.so) sons.rifa();
      if (pas < total) {
        rifaRef.current = setTimeout(salta, 50 + pas * pas * 1.1); // cada vegada més lent
      } else {
        setTimeout(() => {
          setRifant(false);
          setDestinataris({ ids: [guanyador.id], titol: `⚪ La rifa de la pilota: ${guanyador.nom}!` });
          setTimeout(() => setDestacat(null), 2500);
        }, 700);
      }
    };
    salta();
  };

  if (!carregat) {
    return <div className="flex min-h-screen items-center justify-center font-titol text-3xl text-trinquet-fosc"><Pilota mida={80} className="animate-bounce" /></div>;
  }

  if (vista === 'alumne') {
    return (<div className="min-h-screen fons-trinquet"><VistaAlumne onEixir={() => setVista('mestre')} /><Celebracio /></div>);
  }

  return (
    <div className="min-h-screen fons-trinquet">
      {/* ── Capçalera ── */}
      <header className="sticky top-0 z-30 border-b-4 border-roig-500 bg-blau-600 text-white shadow-lg">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-white text-3xl shadow-inner" aria-hidden><Pilota mida={40} /></span>
            <div>
              <h1 className="font-titol text-2xl font-extrabold leading-none sm:text-3xl">El Trinquet de 3r</h1>
              <p className="text-sm text-blau-100">{estat.aula.nom} · {estat.aula.centre}</p>
            </div>
          </div>
          <span className="flex-1" />
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold" title={modeStorage === 'supabase' ? 'Es guarda al núvol (Supabase)' : 'Es guarda en aquest navegador'}>
            {modeStorage === 'supabase' ? '☁️ Al núvol' : '💻 Local'}
          </span>
          <button onClick={() => dispatch({ type: 'CONFIG', canvis: { so: !estat.config.so } })} className="boto-rodo bg-white/15 hover:bg-white/25" title="So" aria-label={estat.config.so ? 'Silencia els sons' : 'Activa els sons'}>{estat.config.so ? '🔊' : '🔇'}</button>
          <button onClick={() => dispatch({ type: 'CONFIG', canvis: { veu: !estat.config.veu } })} className={`boto-rodo hover:bg-white/25 ${estat.config.veu ? 'bg-white/15' : 'bg-white/5 opacity-60'}`} title="Veu en valencià" aria-label={estat.config.veu ? 'Desactiva la veu' : 'Activa la veu'}>🗣️</button>
          <button onClick={() => setVista('alumne')} className="rounded-full bg-white/15 px-4 py-3 font-bold hover:bg-white/25">👧 Vista alumnat</button>
          <button onClick={() => setInformes(true)} className="rounded-full bg-white/15 px-4 py-3 font-bold hover:bg-white/25">📊 Informes</button>
          <button onClick={() => setConfig(true)} className="rounded-full bg-white px-4 py-3 font-bold text-blau-700 hover:bg-blau-50">⚙️ Configuració</button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4">
        <MarcadorPartida />

        {/* ── Botons ràpids ── */}
        <div className="flex flex-wrap items-center gap-2">
          <BotoBarra onClick={() => setDestinataris({ ids: presents.map((a) => a.id), titol: `🙌 Tota la classe (${presents.length})` })} color="bg-emerald-500 text-white" disabled={!presents.length}>
            🙌 Tota la classe
          </BotoBarra>
          <BotoBarra onClick={ferRifa} disabled={rifant || !presents.length} color="bg-roig-500 text-white">
            <Pilota mida={26} className={rifant ? 'animate-bounce' : ''} /> {rifant ? 'La pilota bota…' : 'La rifa de la pilota'}
          </BotoBarra>
          <BotoBarra actiu={modeSeleccio} onClick={() => { setModeSeleccio((m) => !m); setSeleccionats([]); }}>
            ☑️ {modeSeleccio ? 'Ix de la selecció' : 'Selecció múltiple'}
          </BotoBarra>
          {modeSeleccio && (
            <>
              <BotoBarra onClick={() => setSeleccionats(presents.map((a) => a.id))}>Tots</BotoBarra>
              <BotoBarra onClick={() => setSeleccionats([])}>Cap</BotoBarra>
              <BotoBarra color="bg-blau-600 text-white" disabled={!seleccionats.length}
                onClick={() => setDestinataris({ ids: seleccionats, titol: `👥 ${seleccionats.length} pilotaris seleccionats` })}>
                ▶ Donar quinzes ({seleccionats.length})
              </BotoBarra>
            </>
          )}
          <span className="flex-1" />
          <BotoBarra onClick={() => dispatch({ type: 'DESFER' })} disabled={!darrerLot} title={darreraCat ? `Desfés: ${darreraCat.nom}` : 'Res a desfer'}>
            ↩️ Desfés{darreraCat ? ` «${darreraCat.nom}»` : ''}
          </BotoBarra>
          <select value={estat.config.ordre} onChange={(e) => dispatch({ type: 'CONFIG', canvis: { ordre: e.target.value } })}
            className="min-h-[56px] rounded-2xl bg-white px-3 font-bold shadow-sm ring-2 ring-black/5" aria-label="Ordena per">
            <option value="nom">🔤 Per nom</option>
            <option value="quinzes">🔢 Per quinzes</option>
          </select>
        </div>

        {/* ── El Trinquet Virtual: graella d'alumnes ── */}
        <section aria-label="El Trinquet Virtual" className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {ordenats.map((a) => (
            <TargetaAlumne key={a.id} alumne={a} modeSeleccio={modeSeleccio} seleccionat={seleccionats.includes(a.id)}
              destacat={destacat === a.id} avisosAvui={avisosAvui[a.id]} onClick={() => clicTargeta(a)} />
          ))}
          <button onClick={() => setConfig(true)} className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-4 border-dashed border-trinquet-linia text-trinquet-linia hover:bg-white/50">
            <span className="text-5xl">＋</span><span className="font-bold">Afegir pilotari</span>
          </button>
        </section>

        <footer className="pb-6 pt-2 text-center text-sm text-trinquet-fosc/60">
          ⚪ Al Genovés, terra de pilotaris: juguem net, sumem quinzes i guanyem la partida entre tots i totes.
        </footer>
      </main>

      <ModalPunts destinataris={destinataris} onTancar={() => { setDestinataris(null); if (modeSeleccio) { setSeleccionats([]); setModeSeleccio(false); } }} />
      <PanellConfig obert={config} onTancar={() => setConfig(false)} />
      <Informes obert={informes} onTancar={() => setInformes(false)} />
      <Celebracio />
    </div>
  );
}
