import { useEffect } from 'react';

/** Finestra modal accessible i gran (apta per a PDI). */
export default function Modal({ obert, onTancar, titol, children, ample = 'max-w-3xl' }) {
  useEffect(() => {
    if (!obert) return;
    const tecla = (e) => e.key === 'Escape' && onTancar?.();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [obert, onTancar]);

  if (!obert) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-trinquet-fosc/60 p-3 sm:p-6" onClick={onTancar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titol}
        className={`w-full ${ample} max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-apareix`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <h2 className="font-titol text-2xl font-extrabold text-trinquet-fosc sm:text-3xl">{titol}</h2>
          <button onClick={onTancar} className="boto-rodo bg-slate-100 text-2xl text-slate-600 hover:bg-slate-200" aria-label="Tanca">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
