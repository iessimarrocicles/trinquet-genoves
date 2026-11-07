// Marcador col·lectiu: tota la classe juga una partida contra un objectiu comú.
// Cada joc es compta com a la pilota: 15, 30, val i joc!
import { QUARTS_JOC } from '../data/barem.js';
import { useClasse } from '../state/classStore.jsx';
import Pilota from './Pilota.jsx';

export default function MarcadorPartida({ compacte = false }) {
  const { estat, dispatch } = useClasse();
  const { quinzes, quinzesPerJoc, jocsObjectiu, premi, guanyades } = estat.partida;
  const objectiu = quinzesPerJoc * jocsObjectiu;
  const percent = Math.min(1, quinzes / objectiu);
  const jocs = Math.min(jocsObjectiu, Math.floor(quinzes / quinzesPerJoc));
  const guanyada = quinzes >= objectiu;
  const dinsJoc = guanyada ? quinzesPerJoc : quinzes % quinzesPerJoc;
  const quart = guanyada ? 4 : Math.floor((dinsJoc / quinzesPerJoc) * 4); // 0..3 → 15, 30, val, joc

  return (
    <section aria-label="Partida de la classe" className="rounded-3xl bg-trinquet-fosc p-4 text-white shadow-lg sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-200">La Partida de la classe</p>
          <h2 className="font-titol text-2xl font-extrabold leading-tight sm:text-3xl">
            {guanyada ? '🏆 Partida guanyada!' : `Joc ${jocs} de ${jocsObjectiu}`}
          </h2>
        </div>

        {/* Comptador tradicional del joc en curs */}
        {!compacte && (
          <div className="flex gap-1.5" aria-label="Punts del joc en curs">
            {QUARTS_JOC.map((q, i) => (
              <span key={q} className={`flex h-12 min-w-12 items-center justify-center rounded-xl px-2 font-titol text-lg font-extrabold transition ${i < quart ? 'bg-or-400 text-trinquet-fosc' : 'bg-white/10 text-white/50'}`}>{q}</span>
            ))}
          </div>
        )}

        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Premi</p>
          <p className="max-w-[16rem] font-titol text-lg font-bold leading-tight">{premi}</p>
        </div>
      </div>

      {/* Paret del trinquet amb la pilota que avança */}
      <div className="relative mt-4 h-10 rounded-full bg-trinquet-paret/90">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blau-500 via-violet-500 to-roig-500 transition-all duration-1000" style={{ width: `${percent * 100}%` }} />
        {Array.from({ length: jocsObjectiu - 1 }).map((_, i) => (
          <span key={i} className="absolute inset-y-1 w-0.5 bg-trinquet-fosc/20" style={{ left: `${((i + 1) / jocsObjectiu) * 100}%` }} />
        ))}
        <span className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-transparent shadow-lg transition-all duration-1000" style={{ left: `${Math.min(96, Math.max(4, percent * 100))}%` }} aria-hidden>
          <Pilota mida={36} />
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl" aria-hidden>🏁</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-white/80">
        <span><b className="text-white">{quinzes}</b> / {objectiu} quinzes · {guanyades.length} partides guanyades</span>
        {guanyada && (
          <button onClick={() => dispatch({ type: 'PARTIDA_NOVA' })} className="rounded-full bg-or-400 px-4 py-2 font-bold text-trinquet-fosc hover:bg-or-500">
            Nova partida ▶
          </button>
        )}
      </div>
    </section>
  );
}
