// ─────────────────────────────────────────────────────────────
//  ESTAT GLOBAL DE L'AULA (React Context + useReducer)
//  Persistència automàtica amb la capa de storage (local o Supabase).
// ─────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { CATEGORIES_INICIALS, FRASES_ANIM, FRASES_MILLORA } from '../data/barem.js';
import { ALUMNES_DEMO, crearAlumne } from '../data/alumnesDemo.js';
import { nivellDe, nomNivell } from '../lib/nivells.js';
import { crearStorage, storageLocal } from '../lib/storage.js';
import { sons, parla } from '../lib/so.js';

const MAX_HISTORIAL = 5000;
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const triar = (llista) => llista[Math.floor(Math.random() * llista.length)];

export const estatInicial = () => ({
  versio: 1,
  aula: { nom: '3r A · Els pilotaris del Genovés', centre: 'CEIP del Genovés', curs: '2026-2027' },
  alumnes: ALUMNES_DEMO,
  categories: CATEGORIES_INICIALS,
  partida: { quinzes: 0, quinzesPerJoc: 15, jocsObjectiu: 12, premi: '30 minuts extra de pati 🌞', guanyades: [] },
  historial: [],
  config: { so: true, veu: true, ordre: 'nom' },
});

// ── Reducer pur ──────────────────────────────────────────────
function reducer(estat, accio) {
  switch (accio.type) {
    case 'CARREGAR':
      return { ...estatInicial(), ...accio.estat, config: { ...estatInicial().config, ...accio.estat.config } };

    case 'ATORGAR': {
      const { alumneIds, categoriaId, lot, data } = accio;
      const cat = estat.categories.find((c) => c.id === categoriaId);
      if (!cat) return estat;
      const esAvis = cat.tipus === 'millora' && cat.mode === 'avis';
      const nousEvents = [];
      let sumaPartida = 0;
      const alumnes = estat.alumnes.map((a) => {
        if (!alumneIds.includes(a.id)) return a;
        const desitjat = esAvis ? 0 : cat.punts;
        const quinzes = Math.max(0, a.quinzes + desitjat);
        const delta = quinzes - a.quinzes; // delta realment aplicat (mai per davall de 0)
        const partidaDelta = delta > 0 ? delta : 0; // la partida col·lectiva només suma
        sumaPartida += partidaDelta;
        nousEvents.push({ id: uid(), lot, data, alumneId: a.id, categoriaId, delta, partidaDelta, avis: esAvis, recordAbans: a.record });
        return { ...a, quinzes, record: Math.max(a.record, quinzes) };
      });
      return {
        ...estat,
        alumnes,
        partida: { ...estat.partida, quinzes: estat.partida.quinzes + sumaPartida },
        historial: [...estat.historial, ...nousEvents].slice(-MAX_HISTORIAL),
      };
    }

    case 'DESFER': {
      const darrer = estat.historial.at(-1);
      if (!darrer) return estat;
      const events = estat.historial.filter((e) => e.lot === darrer.lot);
      let restaPartida = 0;
      const alumnes = estat.alumnes.map((a) => {
        const ev = events.find((e) => e.alumneId === a.id);
        if (!ev) return a;
        restaPartida += ev.partidaDelta;
        return { ...a, quinzes: Math.max(0, a.quinzes - ev.delta), record: ev.recordAbans ?? a.record };
      });
      return {
        ...estat,
        alumnes,
        partida: { ...estat.partida, quinzes: Math.max(0, estat.partida.quinzes - restaPartida) },
        historial: estat.historial.filter((e) => e.lot !== darrer.lot),
      };
    }

    case 'ALUMNE_AFEGIR':
      return { ...estat, alumnes: [...estat.alumnes, crearAlumne(accio.nom, accio.genere, estat.alumnes.length)] };
    case 'ALUMNE_EDITAR':
      return { ...estat, alumnes: estat.alumnes.map((a) => (a.id === accio.id ? { ...a, ...accio.canvis } : a)) };
    case 'ALUMNE_ELIMINAR':
      return { ...estat, alumnes: estat.alumnes.filter((a) => a.id !== accio.id), historial: estat.historial.filter((e) => e.alumneId !== accio.id) };
    case 'ALUMNE_ABSENT':
      return { ...estat, alumnes: estat.alumnes.map((a) => (a.id === accio.id ? { ...a, absent: !a.absent } : a)) };
    case 'ABSENCIES_NETEJAR':
      return { ...estat, alumnes: estat.alumnes.map((a) => ({ ...a, absent: false })) };

    case 'CATEGORIA_AFEGIR':
      return { ...estat, categories: [...estat.categories, { id: `cat-${uid()}`, ...accio.categoria }] };
    case 'CATEGORIA_EDITAR':
      return { ...estat, categories: estat.categories.map((c) => (c.id === accio.id ? { ...c, ...accio.canvis } : c)) };
    case 'CATEGORIA_ELIMINAR':
      return { ...estat, categories: estat.categories.filter((c) => c.id !== accio.id) };

    case 'PARTIDA_CONFIG':
      return { ...estat, partida: { ...estat.partida, ...accio.canvis } };
    case 'PARTIDA_NOVA':
      return {
        ...estat,
        partida: {
          ...estat.partida,
          quinzes: 0,
          guanyades: [...estat.partida.guanyades, { data: new Date().toISOString(), premi: estat.partida.premi, quinzes: estat.partida.quinzes }],
        },
      };

    case 'AULA_EDITAR':
      return { ...estat, aula: { ...estat.aula, ...accio.canvis } };
    case 'CONFIG':
      return { ...estat, config: { ...estat.config, ...accio.canvis } };
    case 'QUINZES_REINICIAR': // p. ex. canvi de trimestre: els nivells (rècord) es mantenen
      return { ...estat, alumnes: estat.alumnes.map((a) => ({ ...a, quinzes: 0 })), historial: [] };
    case 'TOT_REINICIAR':
      return estatInicial();
    default:
      return estat;
  }
}

// ── Context ──────────────────────────────────────────────────
const ClasseCtx = createContext(null);

export function ClasseProvider({ children }) {
  const [estat, dispatch] = useReducer(reducer, null, estatInicial);
  const [carregat, setCarregat] = useState(false);
  const [modeStorage, setModeStorage] = useState('local');
  const [emailMestre, setEmailMestre] = useState(null);
  const [efectes, setEfectes] = useState([]); // etiquetes flotants «+1» sobre les targetes
  const [celebracio, setCelebracio] = useState(null); // { tipus: 'nivell' | 'partida', ... }
  const storageRef = useRef(null);
  const estatRef = useRef(estat);
  estatRef.current = estat;

  // Càrrega inicial
  useEffect(() => {
    let viu = true;
    (async () => {
      let st = await crearStorage();
      let guardat;
      try {
        guardat = await st.carregar();
      } catch (e) {
        // Sense connexió amb el núvol: treballem en local per no crear una aula duplicada.
        console.error('[storage] No s’ha pogut llegir del núvol, mode local.', e);
        st = storageLocal;
        guardat = await st.carregar();
      }
      if (!viu) return;
      storageRef.current = st;
      if (guardat) dispatch({ type: 'CARREGAR', estat: guardat });
      setModeStorage(st.mode);
      setEmailMestre(st.email ?? null);
      setCarregat(true);
    })();
    return () => { viu = false; };
  }, []);

  // Desament automàtic
  useEffect(() => {
    if (carregat) storageRef.current?.guardar(estat);
  }, [estat, carregat]);

  const afegirEfecte = useCallback((alumneId, text, tipus) => {
    const id = uid();
    setEfectes((e) => [...e, { id, alumneId, text, tipus }]);
    setTimeout(() => setEfectes((e) => e.filter((x) => x.id !== id)), 1400);
  }, []);

  /** Atorga una categoria a un o diversos alumnes, amb animació, so i veu. */
  const atorgar = useCallback((alumneIds, categoriaId) => {
    const abans = estatRef.current;
    const cat = abans.categories.find((c) => c.id === categoriaId);
    if (!cat || alumneIds.length === 0) return;
    const esAvis = cat.tipus === 'millora' && cat.mode === 'avis';
    const positiu = cat.tipus === 'positiu';

    dispatch({ type: 'ATORGAR', alumneIds, categoriaId, lot: uid(), data: new Date().toISOString() });

    // Efectes visuals per alumne
    alumneIds.forEach((id) => {
      const text = positiu ? `+${cat.punts}` : esAvis ? 'Avís' : `${cat.punts}`;
      afegirEfecte(id, text, positiu ? 'positiu' : 'millora');
    });

    // So i veu
    const { so, veu } = abans.config;
    if (so) positiu ? (cat.punts >= 2 ? sons.doble() : sons.quinze()) : esAvis ? sons.avis() : sons.millora();
    if (veu) {
      const qui = alumneIds.length === 1 ? abans.alumnes.find((a) => a.id === alumneIds[0])?.nom : 'Tota la classe';
      parla(positiu ? `${triar(FRASES_ANIM)} ${cat.nom}, ${qui}!` : `${qui}: ${cat.nom}. ${triar(FRASES_MILLORA)}`);
    }

    // Pujades de nivell i victòria de la partida (es calculen sobre l'estat previ)
    if (positiu) {
      const pujades = abans.alumnes
        .filter((a) => alumneIds.includes(a.id))
        .map((a) => ({ a, nou: Math.max(a.record, a.quinzes + cat.punts) }))
        .filter(({ a, nou }) => nivellDe(nou).n > nivellDe(a.record).n)
        .map(({ a, nou }) => ({ alumne: a, nivell: nivellDe(nou), nom: nomNivell(nivellDe(nou), a.genere) }));

      const p = abans.partida;
      const objectiu = p.quinzesPerJoc * p.jocsObjectiu;
      const guanyada = p.quinzes < objectiu && p.quinzes + cat.punts * alumneIds.length >= objectiu;

      setTimeout(() => {
        if (guanyada) {
          if (so) sons.partida();
          if (veu) parla(`Partida guanyada! Premi per a tota la classe: ${p.premi}`);
          setCelebracio({ tipus: 'partida', premi: p.premi, pujades });
        } else if (pujades.length) {
          if (so) sons.nivell();
          if (veu) parla(pujades.length === 1 ? `${pujades[0].alumne.nom} puja de nivell! Ara és ${pujades[0].nom}!` : 'Pugen de nivell!');
          setCelebracio({ tipus: 'nivell', pujades });
        }
      }, 650);
    }
  }, [afegirEfecte]);

  const valor = useMemo(
    () => ({ estat, dispatch, atorgar, efectes, celebracio, setCelebracio, carregat, modeStorage, emailMestre }),
    [estat, atorgar, efectes, celebracio, carregat, modeStorage, emailMestre],
  );
  return <ClasseCtx.Provider value={valor}>{children}</ClasseCtx.Provider>;
}

export const useClasse = () => {
  const ctx = useContext(ClasseCtx);
  if (!ctx) throw new Error('useClasse ha d’usar-se dins de <ClasseProvider>');
  return ctx;
};
