// ─────────────────────────────────────────────────────────────
//  BAREM DE QUINZES, NIVELLS I ELEMENTS COSMÈTICS
//  Tot el vocabulari està en valencià i inspirat en la pilota.
// ─────────────────────────────────────────────────────────────

/**
 * Categories de comportament per defecte.
 * tipus: 'positiu' (suma) | 'millora' (resta o avís)
 * mode (només millora): 'avis' → no resta, només anota | 'resta' → resta els punts
 */
export const CATEGORIES_INICIALS = [
  { id: 'bon-traure', tipus: 'positiu', nom: 'Bon traure', descripcio: 'Fer les tasques a temps i amb cura', punts: 1, icona: '🎯', color: 'blau' },
  { id: 'joc-net', tipus: 'positiu', nom: 'Joc net', descripcio: 'Cavallerositat: respectar, ajudar i saber compartir', punts: 1, icona: '🤝', color: 'verd' },
  { id: 'atencio-canxa', tipus: 'positiu', nom: 'Atenció a la canxa', descripcio: 'Escoltar activament i fer silenci quan toca', punts: 1, icona: '👂', color: 'lila' },
  { id: 'treball-equip', tipus: 'positiu', nom: "Treball d'equip", descripcio: 'Col·laborar correctament en grup', punts: 2, icona: '👥', color: 'taronja' },
  { id: 'quinze-directe', tipus: 'positiu', nom: 'Quinze directe', descripcio: 'Superar un repte o fer un esforç destacat', punts: 2, icona: '⭐', color: 'or' },
  { id: 'falta-traure', tipus: 'millora', nom: 'Falta al traure', descripcio: 'Distracció recurrent', punts: -1, mode: 'avis', icona: '💭', color: 'gris' },
  { id: 'pilota-galeria', tipus: 'millora', nom: 'Pilota a la galeria', descripcio: 'Cridar o no respectar el torn de paraula', punts: -1, mode: 'avis', icona: '📣', color: 'gris' },
];

/** Nivells de progrés. `min` = quinzes de rècord necessaris. */
export const NIVELLS = [
  { n: 1, min: 0, o: 'Aficionat', a: 'Aficionada', x: 'Aficionat/da', icona: '⚪', color: '#94a3b8' },
  { n: 2, min: 10, o: 'Marxador', a: 'Marxadora', x: 'Marxador/a', icona: '🥉', color: '#22c55e' },
  { n: 3, min: 25, o: 'Punter', a: 'Puntera', x: 'Punter/a', icona: '🥈', color: '#3b82f6' },
  { n: 4, min: 45, o: 'Mitger', a: 'Mitgera', x: 'Mitger/a', icona: '🥇', color: '#a855f7' },
  { n: 5, min: 70, o: 'Rest', a: 'Rest', x: 'Rest', icona: '🏅', color: '#f97316' },
  { n: 6, min: 100, o: 'Campió del Genovés', a: 'Campiona del Genovés', x: 'Campió/ona del Genovés', icona: '🏆', color: '#eab308' },
];

/**
 * Elements cosmètics desbloquejables per a l'avatar.
 * Es desbloquegen amb el rècord de quinzes (mai es perden).
 */
export const COSMETICS = [
  { id: 'didals', nom: 'Didals', descripcio: 'Protecció dels dits, com els professionals', min: 0, icona: '🩹' },
  { id: 'faixa', nom: 'Faixa de color', descripcio: 'La faixa del pilotari', min: 5, icona: '🎗️' },
  { id: 'mocador', nom: 'Mocador al cap', descripcio: 'Per a les vesprades de calor al trinquet', min: 15, icona: '🧣' },
  { id: 'guant', nom: 'Guant de pilota', descripcio: 'El guant de la modalitat de llargues', min: 30, icona: '🧤' },
  { id: 'faixa-or', nom: 'Faixa daurada', descripcio: 'Només per a les figures', min: 55, icona: '✨' },
  { id: 'medalla', nom: 'Medalla del trinquet', descripcio: 'Reconeixement de la galeria', min: 80, icona: '🏅' },
  { id: 'corona', nom: 'Corona de campió/ona', descripcio: 'Campió/ona del Genovés!', min: 100, icona: '👑' },
];

export const COLORS_CATEGORIA = {
  blau: 'bg-blau-500',
  verd: 'bg-emerald-500',
  lila: 'bg-violet-500',
  taronja: 'bg-orange-500',
  or: 'bg-amber-400',
  gris: 'bg-slate-400',
  roig: 'bg-roig-500',
};

/** Missatges d'ànim (es trien a l'atzar en cada quinze). */
export const FRASES_ANIM = [
  'Quin quinze!', 'Bona pilotada!', 'Ben jugada!', 'Això és pilota!', 'Al rebot!', 'Tanto net!', 'Quina volea!', 'Ole, ole!',
];

export const FRASES_MILLORA = [
  'Tu pots, a la pròxima!', 'Respira i torna a la canxa', 'Concentració, pilotari!', 'Escoltem i juguem net',
];

/** Comptador tradicional dins d'un joc: 15, 30, val i joc. */
export const QUARTS_JOC = ['15', '30', 'Val', 'Joc!'];
