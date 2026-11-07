// Alumnat de demostració (noms ficticis). Es pot substituir des de ⚙️ Configuració.
// genere: 'o' (xiquet) | 'a' (xiqueta) | 'x' (no especificat) → només afecta el nom del nivell.

const noms = [
  ['Pau', 'o'], ['Aitana', 'a'], ['Vicent', 'o'], ['Neus', 'a'], ['Jordi', 'o'], ['Carla', 'a'],
  ['Hèctor', 'o'], ['Martina', 'a'], ['Iker', 'o'], ['Lluna', 'a'], ['Àlex', 'x'], ['Mireia', 'a'],
  ['Biel', 'o'], ['Júlia', 'a'], ['Joan', 'o'], ['Noa', 'a'], ['Marc', 'o'], ['Paula', 'a'],
  ['Arnau', 'o'], ['Sara', 'a'], ['Nil', 'o'], ['Clara', 'a'],
];

const PELLS = ['#f5d0b5', '#e8b996', '#c98e66', '#8d5a3b', '#f1c9a5'];
const CABELLS = ['#2b1d14', '#5a3a22', '#a0662f', '#e0b04a', '#1a1a1a'];
const PENTINATS = ['curt', 'llarg', 'cua', 'arrissat', 'rapat'];

export function crearAlumne(nom, genere = 'x', i = Math.floor(Math.random() * 100)) {
  return {
    id: `al-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    nom,
    genere,
    quinzes: 0,
    record: 0, // màxim de quinzes assolit (els nivells i cosmètics mai baixen)
    absent: false,
    avatar: {
      samarreta: i % 2 === 0 ? 'blau' : 'roig',
      pell: PELLS[i % PELLS.length],
      cabell: CABELLS[(i * 3) % CABELLS.length],
      pentinat: PENTINATS[(i * 7) % PENTINATS.length],
      complements: ['didals'],
    },
  };
}

export const ALUMNES_DEMO = noms.map(([nom, g], i) => {
  const a = crearAlumne(nom, g, i);
  a.id = `demo-${i + 1}`;
  return a;
});

export const OPCIONS_AVATAR = { PELLS, CABELLS, PENTINATS };
