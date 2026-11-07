// ─────────────────────────────────────────────────────────────
//  CAPA D'EMMAGATZEMATGE
//  · Mode local (per defecte): localStorage del navegador de la PDI.
//  · Mode núvol: Supabase, si hi ha VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY.
//  Tots dos exposen la mateixa interfície: carregar() i guardar(estat).
// ─────────────────────────────────────────────────────────────
const CLAU = 'trinquet-genoves:v1';

export const storageLocal = {
  mode: 'local',
  async carregar() {
    try {
      const brut = localStorage.getItem(CLAU);
      return brut ? JSON.parse(brut) : null;
    } catch {
      return null;
    }
  },
  async guardar(estat) {
    try {
      localStorage.setItem(CLAU, JSON.stringify(estat));
    } catch {
      /* navegador en mode privat o sense espai: l'app continua funcionant en memòria */
    }
  },
};

export async function crearStorage() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return storageLocal;
  try {
    const { crearStorageSupabase } = await import('./supabase.js');
    return await crearStorageSupabase(storageLocal);
  } catch (e) {
    console.warn('[storage] Supabase no disponible, use el mode local.', e);
    return storageLocal;
  }
}
