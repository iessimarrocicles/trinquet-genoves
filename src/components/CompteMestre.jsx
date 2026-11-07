// Compte del mestre/a al núvol (Supabase): entrar, crear compte i eixir.
// En entrar, l'app es recarrega i, si no hi havia cap aula al núvol, puja la del navegador.
import { useState } from 'react';
import { useClasse } from '../state/classStore.jsx';

const hiHaNuvol = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function CompteMestre() {
  const { modeStorage, emailMestre } = useClasse();
  const [email, setEmail] = useState('');
  const [contrasenya, setContrasenya] = useState('');
  const [missatge, setMissatge] = useState(null); // { tipus: 'error' | 'ok', text }
  const [ocupat, setOcupat] = useState(false);

  if (!hiHaNuvol) {
    return <p className="rounded-2xl bg-slate-50 p-3 text-slate-600">El núvol no està configurat (falta <code>.env.local</code>). L'app funciona en local.</p>;
  }

  if (modeStorage === 'supabase') {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
        <span className="text-2xl">☁️</span>
        <p className="flex-1">Connectat/da com a <b>{emailMestre}</b>. Tots els canvis es guarden al núvol automàticament.</p>
        <button
          onClick={async () => { const { eixir } = await import('../lib/supabase.js'); await eixir(); window.location.reload(); }}
          className="rounded-full bg-white px-5 py-3 font-bold text-emerald-800 ring-2 ring-emerald-200"
        >Eixir</button>
      </div>
    );
  }

  const accio = async (tipus) => {
    if (!email.includes('@') || contrasenya.length < 6) {
      setMissatge({ tipus: 'error', text: 'Escriu un correu vàlid i una contrasenya de 6 caràcters com a mínim.' });
      return;
    }
    setOcupat(true);
    setMissatge(null);
    const sb = await import('../lib/supabase.js');
    if (tipus === 'entrar') {
      const error = await sb.entrar(email.trim(), contrasenya);
      if (error) setMissatge({ tipus: 'error', text: error });
      else window.location.reload();
    } else {
      const r = await sb.crearCompte(email.trim(), contrasenya);
      if (r.error) setMissatge({ tipus: 'error', text: r.error });
      else if (r.necessitaConfirmar) setMissatge({ tipus: 'ok', text: 'Compte creat! T’hem enviat un correu: prem l’enllaç per a confirmar-lo i després torna ací i prem «Entrar».' });
      else window.location.reload();
    }
    setOcupat(false);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); accio('entrar'); }} className="space-y-3 rounded-2xl bg-blau-50 p-4">
      <p className="font-bold text-blau-700">☁️ Guarda l'aula al núvol per a no perdre res i obrir-la des de qualsevol ordinador.</p>
      <div className="flex flex-wrap gap-2">
        <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correu@edu.gva.es" className="camp min-w-[220px] flex-1" aria-label="Correu" />
        <input type="password" autoComplete="current-password" value={contrasenya} onChange={(e) => setContrasenya(e.target.value)} placeholder="Contrasenya" className="camp min-w-[180px] flex-1" aria-label="Contrasenya" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={ocupat} className="boto-primari disabled:opacity-50">Entrar</button>
        <button type="button" disabled={ocupat} onClick={() => accio('crear')} className="rounded-full bg-white px-5 py-3 font-bold text-blau-700 ring-2 ring-blau-100 disabled:opacity-50">Crear compte</button>
      </div>
      {missatge && <p className={`rounded-xl p-3 ${missatge.tipus === 'error' ? 'bg-roig-50 text-roig-700' : 'bg-emerald-50 text-emerald-800'}`}>{missatge.text}</p>}
      <p className="text-xs text-slate-500">La primera vegada que entres, l'aula que tens en aquest navegador es copiarà al núvol.</p>
    </form>
  );
}
