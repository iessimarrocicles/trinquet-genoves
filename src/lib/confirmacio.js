// ─────────────────────────────────────────────────────────────
//  TORNADA DES DEL CORREU DE CONFIRMACIÓ
//  Supabase torna a l'app amb el resultat a l'URL (#access_token=… o #error=…).
//  supabase-js esborra aquest fragment en iniciar-se, així que el llegim
//  ací, abans que res més, per a poder mostrar un avís a la mestra/e.
// ─────────────────────────────────────────────────────────────
function llegir() {
  if (typeof window === 'undefined') return null;
  const brut = `${window.location.hash.replace(/^#/, '')}&${window.location.search.replace(/^\?/, '')}`;
  const p = new URLSearchParams(brut);
  if (p.get('error') || p.get('error_code')) {
    const codi = p.get('error_code') || p.get('error');
    return {
      tipus: 'error',
      text:
        codi === 'otp_expired'
          ? 'L’enllaç de confirmació ha caducat o ja s’havia fet servir. Torna a ⚙️ Configuració → ☁️ Compte i dades i prem «Reenviar el correu».'
          : 'No s’ha pogut confirmar el correu. Torna-ho a provar des de ⚙️ Configuració → ☁️ Compte i dades.',
    };
  }
  const tipus = p.get('type');
  if (p.get('access_token') && (tipus === 'signup' || tipus === 'email' || tipus === 'magiclink')) {
    return { tipus: 'ok', text: 'Correu confirmat! Ja has entrat amb el teu compte i l’aula es guardarà al núvol.' };
  }
  return null;
}

export const resultatConfirmacio = llegir();

// Si hi ha hagut un error, netegem l'URL perquè no es quede l'avís en recarregar.
if (resultatConfirmacio?.tipus === 'error') {
  window.history.replaceState(null, '', window.location.pathname);
}
