import { NIVELLS, COSMETICS } from '../data/barem.js';

export function nivellDe(record) {
  let actual = NIVELLS[0];
  for (const n of NIVELLS) if (record >= n.min) actual = n;
  return actual;
}

export function nomNivell(nivell, genere = 'x') {
  return nivell[genere] ?? nivell.x;
}

/** Progrés (0-1) cap al nivell següent i quinzes que falten. */
export function progresNivell(record) {
  const actual = nivellDe(record);
  const seguent = NIVELLS.find((n) => n.n === actual.n + 1);
  if (!seguent) return { percent: 1, falten: 0, seguent: null };
  const tram = seguent.min - actual.min;
  return { percent: (record - actual.min) / tram, falten: seguent.min - record, seguent };
}

export function cosmeticsDesbloquejats(record) {
  return COSMETICS.filter((c) => record >= c.min).map((c) => c.id);
}
