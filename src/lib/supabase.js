// ─────────────────────────────────────────────────────────────
//  ADAPTADOR SUPABASE (opcional)
//  Guarda una instantània de l'aula (JSONB) a la taula `aules`.
//  Esquema i polítiques RLS: /supabase/schema.sql
// ─────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

let client = null;

/** Client únic (null si no hi ha variables d'entorn configurades). */
export function obtenirClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } });
  return client;
}

// ── Compte del mestre/a ──────────────────────────────────────
const MISSATGES = {
  'Invalid login credentials': 'Correu o contrasenya incorrectes.',
  'Email not confirmed': 'Encara no has confirmat el correu. Revisa la safata d’entrada (i el correu brossa).',
  'User already registered': 'Ja hi ha un compte amb aquest correu. Prova a entrar.',
};
const traduir = (e) => (e ? MISSATGES[e.message] ?? e.message : null);

export async function sessioActual() {
  const sb = obtenirClient();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

export async function entrar(email, contrasenya) {
  const { error } = await obtenirClient().auth.signInWithPassword({ email, password: contrasenya });
  return traduir(error);
}

export async function crearCompte(email, contrasenya) {
  const { data, error } = await obtenirClient().auth.signUp({
    email,
    password: contrasenya,
    options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL },
  });
  if (error) return { error: traduir(error) };
  return { necessitaConfirmar: !data.session };
}

export async function eixir() {
  await obtenirClient()?.auth.signOut();
}

// ── Emmagatzematge ───────────────────────────────────────────
export async function crearStorageSupabase(copiaLocal) {
  const sb = obtenirClient();
  const sessio = await sessioActual();
  if (!sb || !sessio) {
    console.info('[supabase] Cap sessió iniciada: mode local.');
    return copiaLocal;
  }
  const mestreId = sessio.user.id;
  let aulaId = null;
  let temporitzador = null;
  let pendent = null;

  const pujar = async () => {
    const estat = pendent;
    pendent = null;
    if (!estat) return;
    const fila = { mestre_id: mestreId, nom: estat.aula.nom, estat, updated_at: new Date().toISOString() };
    if (aulaId) {
      const { error } = await sb.from('aules').update(fila).eq('id', aulaId);
      if (error) console.error('[supabase] Error en desar:', error.message);
    } else {
      const { data, error } = await sb.from('aules').insert(fila).select('id').single();
      if (error) console.error('[supabase] Error en crear l’aula:', error.message);
      aulaId = data?.id ?? null;
    }
  };

  // Si es tanca la pestanya amb canvis pendents, intentem desar-los.
  window.addEventListener('beforeunload', () => { if (pendent) pujar(); });

  return {
    mode: 'supabase',
    email: sessio.user.email,
    async carregar() {
      const { data, error } = await sb.from('aules').select('id, estat').eq('mestre_id', mestreId).order('created_at').limit(1).maybeSingle();
      if (error) throw error;
      if (!data) return copiaLocal.carregar(); // primera vegada: pugem el que hi haja al navegador
      aulaId = data.id;
      return data.estat;
    },
    async guardar(estat) {
      copiaLocal.guardar(estat); // còpia immediata per si cau la connexió
      pendent = estat;
      clearTimeout(temporitzador);
      temporitzador = setTimeout(pujar, 800); // agrupa canvis ràpids (p. ex. «Tota la classe»)
    },
  };
}
