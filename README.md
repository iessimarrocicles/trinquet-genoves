# El Trinquet de 3r — Gamificació d'aula amb la pilota valenciana

Una aplicació web tipus ClassDojo per a l'alumnat de **3r de Primària del Genovés (la Costera)**, amb la **pilota valenciana** com a eix. Tota la interfície està en valencià.
El disseny complet és a [docs/DISSENY-UI-UX.md](docs/DISSENY-UI-UX.md).

## Posar-la en marxa
```bash
npm install
npm run dev        # http://localhost:5173 (i a la IP de l'ordinador, per a la PDI o les tauletes)
npm run build      # versió per a publicar, a dist/
```
Sense configurar res, funciona en **mode local**: les dades es guarden al navegador. Fes còpies de seguretat des de ⚙️ → 💾 Dades.

### Núvol (Supabase)
Ja està configurat: el projecte **trinquet-genoves** (regió de París) té les taules i les polítiques RLS de `supabase/schema.sql`, i `.env.local` conté l'adreça i la clau publicable.
1. A ⚙️ → ☁️ Compte i dades → **Crear compte**, amb el teu correu i una contrasenya.
2. Confirma el correu que t'envia Supabase i després prem **Entrar**.
3. L'etiqueta de la capçalera passa a dir «☁️ Al núvol». La primera vegada, l'aula del navegador es copia al núvol.

Perquè l'enllaç de confirmació torne a l'app, a Supabase → Authentication → URL Configuration posa la *Site URL* `http://localhost:5173` (o l'adreça on publiques l'app).

## Estructura
```
gamificacio/
├─ index.html                 · lang="ca-valencia", tipografies
├─ tailwind.config.js         · paleta del trinquet i animacions (puja, bot, sacseja, cau…)
├─ docs/DISSENY-UI-UX.md      · principis, wireframe, fluxos i full de ruta
├─ supabase/schema.sql        · taules + RLS
└─ src/
   ├─ main.jsx                · arrel + <ClasseProvider>
   ├─ App.jsx                 · PANTALLA DEL MESTRE: capçalera, marcador, botons ràpids, graella
   ├─ index.css               · fons de trinquet, classes base
   ├─ data/
   │  ├─ barem.js             · categories (quinzes), nivells, equipament, frases
   │  └─ alumnesDemo.js       · alumnat de mostra + generador d'avatars
   ├─ state/classStore.jsx    · reducer (sumar, desfer, alumnat, barem, partida) + efectes + desament
   ├─ lib/
   │  ├─ nivells.js           · nivell, progrés i desbloquejos a partir del rècord
   │  ├─ so.js                · sons sintetitzats (Web Audio) + veu en valencià (speechSynthesis)
   │  ├─ storage.js           · capa local / Supabase
   │  └─ supabase.js          · adaptador del núvol
   └─ components/
      ├─ TargetaAlumne.jsx    · targeta del Trinquet Virtual
      ├─ AvatarPilotari.jsx   · avatar SVG personalitzable
      ├─ Pilota.jsx           · icona de pilota valenciana
      ├─ MarcadorPartida.jsx  · Partida de la classe (15 · 30 · Val · Joc!)
      ├─ ModalPunts.jsx       · triar la categoria (individual, selecció o tota la classe)
      ├─ Celebracio.jsx       · pujada de nivell i partida guanyada
      ├─ PanellConfig.jsx     · alumnat, barem, partida, dades
      ├─ Informes.jsx         · informes de grup i individuals, CSV, impressió
      ├─ EditorAvatar.jsx     · vestidor
      └─ VistaAlumne.jsx      · vista per a l'alumnat
```

## Barem per defecte
| Categoria | Quinzes |
|---|---|
| 🎯 Bon traure | +1 |
| 🤝 Joc net | +1 |
| 👂 Atenció a la canxa | +1 |
| 👥 Treball d'equip | +2 |
| ⭐ Quinze directe | +2 |
| 💭 Falta al traure | avís (o −1) |
| 📣 Pilota a la galeria | avís (o −1) |

Tot es pot editar a ⚙️ → 🎯 Barem.

## Nota sobre la veu
La veu fa servir les veus del sistema. A Windows, instal·la el paquet de veu **Català** (Configuració → Hora i idioma → Veu) perquè pronuncie bé. Si no n'hi ha cap, es pot desactivar amb el botó 🗣️.
