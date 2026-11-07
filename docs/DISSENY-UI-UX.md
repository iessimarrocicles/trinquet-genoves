# El Trinquet de 3r — Disseny UI/UX

## 1. Principis
| Principi | Com s'aplica |
|---|---|
| **Pensat per a la PDI** | Botons de 48–56 px com a mínim, text gran (Baloo 2 / Nunito), cap acció amb «hover» obligatori, `touch-action: manipulation` per evitar el zoom amb doble toc. |
| **Dos tocs per a sumar** | Toque la targeta → toque la categoria. Ni formularis ni confirmacions. |
| **Error sense por** | Botó **↩️ Desfés** sempre visible (desfà l'última acció, també «Tota la classe»). |
| **Reforç positiu** | Les categories positives ocupen la part de dalt i van en color. Les «de millora» són grises, van davall i per defecte només anoten un **avís** (no resten). Mai no es baixa de nivell: el nivell es calcula amb el *rècord*. |
| **Cooperació > competició** | La *Partida de la classe* és l'objectiu principal en pantalla. La graella s'ordena per nom per defecte; l'ordre per quinzes és opcional. |
| **Accessibilitat** | `aria-label` a les targetes, contrast alt, i es respecta `prefers-reduced-motion`. |

## 2. Identitat visual
- **Paleta**: blau `#2563eb` i roig `#dc2626` (els colors dels equips), paret de trinquet `#f5efe3`, línia de la *corda* `#c8b89a`, fosc `#3b3226` per al marcador i or `#facc15` per als èxits.
- **Fons**: la paret del trinquet, amb la línia horitzontal de la corda i els panys verticals.
- **Pilota**: SVG propi (pilota blanca amb costures roges). No fem servir l'emoji de tennis.
- **Avatar**: un pilotari amb samarreta blava o roja, pantaló blanc, faixa i didals. Es pot personalitzar la pell, el cabell i el pentinat, i es desbloquegen el mocador, el guant, la faixa daurada, la medalla i la corona.

## 3. Pantalla del mestre/a (wireframe)
```
┌──────────────────────────────────────────────────────────────────────┐
│ (pilota) El Trinquet de 3r          🔊  🗣️  👧Alumnat 📊Informes ⚙️  │  ← capçalera blava, vora roja
├──────────────────────────────────────────────────────────────────────┤
│ LA PARTIDA DE LA CLASSE   [15][30][Val][Joc!]        PREMI: 30' pati │
│ Joc 7 de 12   ███████████████(pilota)·········· 🏁   106/180 quinzes │  ← marcador col·lectiu
├──────────────────────────────────────────────────────────────────────┤
│ [🙌 Tota la classe] [(pilota) La rifa] [☑️ Selecció]   [↩️ Desfés][Ordre]│  ← botons ràpids
├──────────────────────────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │▀▀▀▀(8)│ │▀▀▀▀(5)│ │ …    │ │      │ │      │ │  ＋  │                │  ← EL TRINQUET VIRTUAL
│ │ avatar│ │ avatar│ │      │ │      │ │      │ │Afegir│                │    graella responsive
│ │ Aitana│ │ Pau   │ │      │ │      │ │      │ │      │                │    2→8 columnes
│ │Marxad.│ │Aficio.│ │      │ │      │ │      │ │      │                │
│ │▬▬▬▬░░ │ │▬▬░░░░ │ │      │ │      │ │      │ │      │                │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                │
└──────────────────────────────────────────────────────────────────────┘
```
**Targeta d'alumne/a**: una franja amb el color de la samarreta, l'avatar, el nom, una etiqueta de nivell, una barra cap al nivell següent i el marcador de quinzes en forma de pilota. Dalt a l'esquerra hi ha 🙋/Absent, i davall els punts grocs dels avisos d'avui.

## 4. Flux de puntuació
1. **Individual**: toque la targeta → s'obri un modal amb les categories → la toque.
2. **Tota la classe**: toque el botó verd → mateix modal → s'aplica a tot l'alumnat present (els absents en queden fora).
3. **La rifa de la pilota**: la pilota «bota» de targeta en targeta, cada vegada més lenta, i s'atura en algú a l'atzar. Després s'obri el modal amb aquell nom.
4. **Selecció múltiple**: marque diverses targetes → «Donar quinzes (n)».

**Retroacció**: un «+1/+2» flotant i l'avatar que bota, el so de la pilota contra la paret amb notes ascendents i una veu en valencià («Quin quinze! Bon traure, Aitana!»). Amb una millora, la targeta tremola suaument i sona un to suau.
**Celebracions**: una pujada de nivell o la partida guanyada obrin una finestra amb una pluja de pilotes i estreles. Si passen alhora, es mostren juntes.

## 5. Gamificació
| Element | Regla |
|---|---|
| Quinzes | Punts individuals, mai per davall de 0. |
| Rècord | El màxim de quinzes assolit. Determina el nivell i l'equipament (que no es perden). |
| Nivells | Aficionat/da (0) · Marxador/a (10) · Punter/a (25) · Mitger/a (45) · Rest (70) · Campió/ona del Genovés (100). |
| Equipament | Didals (0) · Faixa (5) · Mocador (15) · Guant (30) · Faixa daurada (55) · Medalla (80) · Corona (100). |
| Partida | Suma tots els quinzes positius de la classe. Cada joc té N quinzes (per defecte 15) i el comptador mostra 15-30-Val-Joc. Es guanya amb J jocs (per defecte 12) i dona el premi configurat. |
| Millores | «Falta al traure» i «Pilota a la galeria». Per defecte són un *avís* (0 punts), però es poden configurar perquè resten −1. No resten mai de la partida col·lectiva. |

## 6. Vista alumnat
L'alumne/a toca el seu nom (pensat per a projectar-ho o per a una tauleta d'aula) i veu el seu avatar, els quinzes, quants li'n falten per al nivell següent, el pròxim premi i la partida. Al **Vestidor** es pot posar l'equipament desbloquejat.

## 7. Full de ruta
- **Fase 2**: inici de sessió del mestre (Supabase Auth, *magic link*); accés de l'alumnat amb un codi QR; diverses aules.
- **Fase 3**: àudios gravats per veus del poble (narrador de trinquet); fitxes de figures històriques de la pilota de la Costera; mode «Raspall / Escala i corda / Llargues» com a temporades.
- **Fase 4**: PWA *offline* per a les tauletes, i informes en PDF per a les famílies.
