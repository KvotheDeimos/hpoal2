/* ═══════════════════════════════════════════════════════════
   js/data.js — Constantes globales de datos del sitio
   Se carga primero (antes que ui.js, copa.js, etc.)
   ═══════════════════════════════════════════════════════════ */

/* ─── URL de la Google Sheet con los puntos de la Copa ─── */
const PUNTOS_URL = 'https://script.google.com/macros/s/AKfycbyKgLTOHvqb_AD2Phj8rsMGjpS7-MG3wTfucsAindhq5TGUwXKTxmDDEM6mrJcgoK6I/exec';

/* ─── Relojes de arena de la Copa de las Casas ─── */
const GEMS = {
  Gryffindor: {gem:'Rubíes de Godric',pri:'#c9182b',bord:'#ff4d61',top:'#ff3b52',bot:'#4a040b',fac:['#ff8594','#d11529','#8a0613','#ffa8b4'],gg:'rgba(217,24,43,.28)',rays:'#ff6b7d',crest:'🦁'},
  Slytherin:  {gem:'Esmeraldas de Salazar',pri:'#118c47',bord:'#3de882',top:'#2fe877',bot:'#033b19',fac:['#6cf5a1','#129c4f','#065c2b','#b3ffd0'],gg:'rgba(17,160,78,.28)',rays:'#4ae88c',crest:'🐍'},
  Ravenclaw:  {gem:'Zafiros de Rowena',pri:'#1a60d1',bord:'#609efc',top:'#5498fc',bot:'#0a2a69',fac:['#8dbbfa','#1c66df','#0e3a8a','#c7ddff'],gg:'rgba(35,115,240,.28)',rays:'#68a6ff',crest:'🦅'},
  Hufflepuff: {gem:'Diamantes de Helga',pri:'#d69e1c',bord:'#ffe066',top:'#ffe37a',bot:'#5c4004',fac:['#fff0a3','#dca31f','#8f6505','#fff9d6'],gg:'rgba(240,180,35,.28)',rays:'#ffe073',crest:'🦡'}
};
const KEYS = Object.keys(GEMS);

/* ─── Temas de color para puertas (se aplican como variables CSS) ─── */
const THEMES = {
  gold:    {gc:'#caa96a',gg:'rgba(235,185,75,.5)',gr:'#fcedba',oak1:'#29180c',oak2:'#140a04',gt:'#fcedba',gt2:'#fce4a6',gbg:'linear-gradient(90deg,#2e1d0b,#473014,#2e1d0b)',gb2:'rgba(212,175,55,.7)',gm:'rgba(235,185,75,.35)',gh:'#e5b83b',sb:'#8a6c38',rune:'ᚠ · SAPIENTIA · ᛟ'},
  amber:   {gc:'#995624',gg:'rgba(230,126,34,.5)',gr:'#ffa347',oak1:'#271206',oak2:'#120602',gt:'#ffd8a8',gt2:'#ffbe76',gbg:'linear-gradient(90deg,#2c1508,#4a220c,#2c1508)',gb2:'rgba(224,122,34,.7)',gm:'rgba(230,126,34,.35)',gh:'#f39c12',sb:'#995624',rune:'ᚨ · FABER · ᛏ'},
  silver:  {gc:'#5b769c',gg:'rgba(147,185,235,.5)',gr:'#c2dbff',oak1:'#151d29',oak2:'#090d14',gt:'#d6e7ff',gt2:'#e0edff',gbg:'linear-gradient(90deg,#0d1829,#1a2e4f,#0d1829)',gb2:'rgba(122,158,199,.7)',gm:'rgba(147,185,235,.35)',gh:'#9fc4f5',sb:'#5b769c',rune:'ᛁ · VERITAS · ᛗ'},
  emerald: {gc:'#3d7d4f',gg:'rgba(64,182,97,.5)',gr:'#96f2a8',oak1:'#122417',oak2:'#06120b',gt:'#c6f8d0',gt2:'#a3f0b4',gbg:'linear-gradient(90deg,#091f12,#123821,#091f12)',gb2:'rgba(72,166,98,.7)',gm:'rgba(64,182,97,.35)',gh:'#55d475',sb:'#3d7d4f',rune:'ᛉ · SILVA · ᛜ'}
};

/* ─── SVG de emblemas (medals de puertas + modales) ─── */
const EMBLEMS = {
  hat: '<svg viewBox="0 0 100 100"><path d="M50,14 C42,12 36,22 42,28 C48,32 54,34 50,42" fill="none" stroke="#2e1d0c" stroke-width="6" stroke-linecap="round"/><path d="M40,16 C48,15 54,20 52,30 C50,38 68,54 72,72 L28,72 C32,54 42,38 40,16 Z" fill="#4f3317" stroke="#1c1106" stroke-width="1.8"/><path d="M38,50 Q45,45 52,50 M56,50 Q63,45 70,50" fill="none" stroke="#1c1005" stroke-width="2.5" stroke-linecap="round"/><path d="M38,62 Q54,70 68,61" fill="none" stroke="#120a02" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="50" cy="74" rx="38" ry="11" fill="#38220e" stroke="#caa96a" stroke-width="1.5"/></svg>',
  wand: '<svg viewBox="0 0 100 100"><rect x="15" y="44" width="70" height="14" rx="2" fill="#24140a" stroke="#caa96a" stroke-width="1.2"/><line x1="16" y1="16" x2="84" y2="84" stroke="#b37424" stroke-width="4" stroke-linecap="round"/><circle cx="84" cy="84" r="4.5" fill="#caa96a"/><line x1="84" y1="16" x2="16" y2="84" stroke="#7a5499" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="84" r="4" fill="#caa96a"/><circle cx="50" cy="50" r="6" fill="#fff5cc" opacity=".75"/><circle cx="50" cy="50" r="3.5" fill="#ffec99"/></svg>',
  mirror: '<svg viewBox="0 0 100 100"><path d="M24,90 L24,46 A26,26 0 0,1 50,16 A26,26 0 0,1 76,46 L76,90 Z" fill="#caa96a" stroke="#3a270d" stroke-width="2"/><path d="M29,86 L29,48 A21,21 0 0,1 50,22 A21,21 0 0,1 71,48 L71,86 Z" fill="#4a6899" stroke="#162338" stroke-width="1.2"/><path d="M50,44 C44,36 36,44 42,54 L50,64 L58,54 C64,44 56,36 50,44 Z" fill="none" stroke="#fff" stroke-width="1.2" opacity=".8"/><polygon points="50,8 55,16 45,16" fill="#ffd700" stroke="#3a270d" stroke-width=".8"/></svg>',
  forest: '<svg viewBox="0 0 100 100"><circle cx="68" cy="26" r="14" fill="#e3f9ea" opacity=".85"/><circle cx="64" cy="24" r="12" fill="#0c1a10"/><path d="M28,88 L28,68 L20,68 L26,52 L21,52 L28,36 L35,52 L30,52 L36,68 L30,68 L30,88 Z" fill="#13331c"/><path d="M50,88 L50,60 L40,60 L48,42 L42,42 L50,22 L58,42 L52,42 L60,60 L52,60 L52,88 Z" fill="#0d2614" stroke="#276137" stroke-width="1.2"/><path d="M72,88 L72,70 L65,70 L71,54 L66,54 L72,38 L78,54 L73,54 L79,70 L74,70 L74,88 Z" fill="#13331c"/><polygon points="50,74 53,84 47,84" fill="#fff" stroke="#c6f8d0" stroke-width=".8"/></svg>',
  cauldron: '<svg viewBox="0 0 100 100"><path d="M38,36 Q34,22 42,12 M50,36 Q54,20 46,8 M62,36 Q68,22 60,12" stroke="#58d68d" stroke-width="2" stroke-linecap="round" opacity=".75" fill="none"/><ellipse cx="50" cy="62" rx="36" ry="26" fill="#2d3748" stroke="#1a202c" stroke-width="2"/><rect x="22" y="38" width="56" height="8" rx="3" fill="#4a5568"/><ellipse cx="50" cy="42" rx="26" ry="5" fill="#27ae60"/><path d="M26,82 L20,94 L28,94 Z M74,82 L80,94 L72,94 Z" fill="#2d3748"/></svg>',
  snake: '<svg viewBox="0 0 100 100"><path d="M30,70 Q20,60 24,48 Q28,36 42,34 Q56,32 62,44 Q64,56 58,66 Q48,76 30,70 Z" fill="none" stroke="#1e824c" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M30,70 Q20,60 24,48 Q28,36 42,34 Q56,32 62,44 Q64,56 58,66 Q48,76 30,70" fill="none" stroke="#b0bec5" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3" opacity=".85"/><path d="M68,26 C74,25 82,22 84,18 C86,24 82,32 74,32 Z" fill="#27ae60" stroke="#0e3d1f" stroke-width="1.5"/><circle cx="77" cy="22" r="2.2" fill="#ffd700" stroke="#000" stroke-width=".8"/><path d="M84,20 L92,18 M92,18 L96,15 M92,18 L96,22" stroke="#ff4757" stroke-width="1.5" stroke-linecap="round"/><polygon points="46,82 50,92 54,82" fill="#e8f5e9" stroke="#1b5e20" stroke-width=".8"/></svg>',
  diary: '<svg viewBox="0 0 100 100"><rect x="22" y="16" width="56" height="68" rx="4" fill="#14110e" stroke="#caa96a" stroke-width="2"/><line x1="30" y1="16" x2="30" y2="84" stroke="#8a6c38" stroke-width="2"/><path d="M42,34 L66,34 M42,46 L66,46 M42,58 L58,58" stroke="#caa96a" stroke-width="1.8" stroke-linecap="round" opacity=".7"/><circle cx="50" cy="72" r="3" fill="#99182b"/></svg>'
};

/* ─── Puertas principales del portal (hero) ─── */
const MAIN_DOORS = [
  {href:'ceremonia.html',badge:'18 preguntas',title:'La Ceremonia de Selección',sub:'El Sombrero te lee la mente.',emb:'hat',theme:'gold',cta:'Entrar'},
  {href:'varita.html',badge:'14 mediciones',title:'El Taller de Ollivander',sub:'La varita elige al mago.',emb:'wand',theme:'amber',cta:'Entrar'},
  {href:'espejo.html',badge:'10 preguntas',title:'El Espejo de Oesed',sub:'Tu deseo más profundo.',emb:'mirror',theme:'silver',cta:'Entrar'},
  {href:'bosque.html',badge:'cap. 15',title:'El Bosque Prohibido',sub:'Una noche entre los árboles.',emb:'forest',theme:'emerald',cta:'Entrar'}
];

/* ─── Libros y sus dinámicas (Cámara a la DERECHA de Multijugos) ─── */
const BOOKS = [
  {n:1,r:'I',t:'La Piedra Filosofal',tag:'Todo empieza con una carta que nadie pudo detener.',d:'El andén 9¾, el Sombrero y la primera noche en las mazmorras. La puerta que lo abrió todo.',st:'active',theme:'gold',sym:'💎',
   dyn:[
     {href:'ceremonia.html',badge:'18 preguntas',title:'La Ceremonia de Selección',sub:'El Sombrero te lee la mente.',emb:'hat',theme:'gold',cta:'Entrar'},
     {href:'varita.html',badge:'14 mediciones',title:'El Taller de Ollivander',sub:'La varita elige al mago.',emb:'wand',theme:'amber',cta:'Entrar'},
     {href:'espejo.html',badge:'10 preguntas',title:'El Espejo de Oesed',sub:'Tu deseo más profundo.',emb:'mirror',theme:'silver',cta:'Entrar'},
     {href:'bosque.html',badge:'cap. 15',title:'El Bosque Prohibido',sub:'Una noche entre los árboles.',emb:'forest',theme:'emerald',cta:'Entrar'}
   ]},
  {n:2,r:'II',t:'La Cámara Secreta',tag:'Una voz susurra entre las paredes… y la tinta guarda memoria.',d:'El diario, la cámara y la poción que permite ser otra persona durante un mes.',st:'current',theme:'emerald',sym:'🐍',
   dyn:[
     {href:'multijugos.html',badge:'Una hora',title:'Poción Multijugos',sub:'Un mes siendo otra persona.',emb:'cauldron',theme:'emerald',cta:'Entrar'},
     {href:'camara.html',badge:'Puzle de lenguas',title:'La Cámara de los Secretos',sub:'Dile la palabra correcta… en la lengua correcta.',emb:'snake',theme:'emerald',cta:'Hablar a la puerta',cls:'camara'},
     {href:'diario.html',badge:'Tinta viva',title:'El Diario de Tom Riddle',sub:'Escribe… la tinta guarda memoria.',emb:'diary',theme:'silver',cta:'Abrir el diario'}
   ]},
  {n:3,r:'III',t:'El Prisionero de Azkaban',tag:'Algo se escapa de Azkaban… y el tiempo se dobla.',d:'Sellado con encantamiento fidelio hasta culminar la Cámara Secreta.',st:'sealed',theme:'silver',sym:'⏳',dyn:[]},
  {n:4,r:'IV',t:'El Cáliz de Fuego',tag:'Un nombre escupido por las llamas que nadie escribió.',d:'Sellado con encantamiento fidelio hasta su turno.',st:'sealed',theme:'amber',sym:'🔥',dyn:[]},
  {n:5,r:'V',t:'La Orden del Fénix',tag:'Cuando el Ministerio niega lo que todos vieron.',d:'Sellado con encantamiento fidelio hasta su turno.',st:'sealed',theme:'gold',sym:'🐦',dyn:[]},
  {n:6,r:'VI',t:'El Misterio del Príncipe',tag:'Un libro usado con anotaciones que no son tuyas.',d:'Sellado con encantamiento fidelio hasta su turno.',st:'sealed',theme:'emerald',sym:'📖',dyn:[]},
  {n:7,r:'VII',t:'Las Reliquias de la Muerte',tag:'Tres hermanos, tres regalos, una despedida.',d:'Sellado con encantamiento fidelio hasta su turno.',st:'sealed',theme:'silver',sym:'⚡',dyn:[]}
];

/* ─── Casas de Hogwarts ─── */
const HOUSES = {
  Gryffindor: {ha:'#7f0909',hb:'#ffc500',tag:'Casa I · Fuego',founder:'Godric Gryffindor',q:'Coraje · Osadía · Caballerosidad',ghost:'Nick Casi Decapitado',common:'Torre de Gryffindor, tras la Dama Gorda',relic:'La espada de rubíes',desc:'El estandarte escarlata ondea donde hace falta valentía y un punto de temeridad.',note:'Nota de Olor a Libros: leen los capítulos de batalla en voz alta y con voces.',members:'Harry Potter · Hermione Granger · Albus Dumbledore · Minerva McGonagall'},
  Slytherin:  {ha:'#0f3d2a',hb:'#b8cdc2',tag:'Casa II · Agua',founder:'Salazar Slytherin',q:'Ambición · Astucia · Autonomía · Determinación',ghost:'El Barón Sanguinario',common:'Mazmorras, bajo el Lago Negro',relic:'El guardapelo de plata',desc:'Aquí se forjan los que saben exactamente lo que quieren y trazan el camino para conseguirlo.',note:'Nota de Olor a Libros: ya subrayaron las mejores frases del libro. Con bolígrafo verde.',members:'Merlín · Horace Slughorn · Severus Snape · Regulus Black'},
  Ravenclaw:  {ha:'#0e1a40',hb:'#c9a86a',tag:'Casa III · Aire',founder:'Rowena Ravenclaw',q:'Inteligencia · Ingenio · Pensamiento independiente',ghost:'La Dama Gris',common:'Torre oeste, tras la puerta-águila',relic:'La diadema perdida',desc:'El nido de las mentes despiertas: curiosidad, creatividad y pensamiento independiente.',note:'Nota de Olor a Libros: hicieron una tabla de teorías que nadie pidió. La leímos todos. Dos veces.',members:'Filius Flitwick · Luna Lovegood · Garrick Ollivander'},
  Hufflepuff: {ha:'#8a6d00',hb:'#ffd95e',tag:'Casa IV · Tierra',founder:'Helga Hufflepuff',q:'Lealtad · Justicia · Esfuerzo honesto',ghost:'El Fray Gordito',common:'Junto a las cocinas, tras el bodegón',relic:'La copa de oro',desc:'El corazón más justo del castillo: paciencia, trabajo honesto y lealtad inquebrantable.',note:'Nota de Olor a Libros: traen el picoteo a las quedadas de lectura. La historia los recordará.',members:'Newt Scamander · Nymphadora Tonks · Cedric Diggory · Pomona Sprout'}
};

/* ─── SVG de reliquias de casas (crest en sección de casas) ─── */
const RELICS = {
  G: '<svg viewBox="0 0 64 64"><path d="M32 3 L36 10 L34 40 L32 46 L30 40 L28 10 Z" fill="currentColor"/><path d="M20 40 H44 L41 45 H23 Z" fill="currentColor"/><rect x="30" y="45" width="4" height="9" rx="1.5" fill="currentColor"/><circle cx="32" cy="57" r="3.4" fill="currentColor"/><circle cx="32" cy="42.4" r="2.1" fill="#b3232a"/></svg>',
  S: '<svg viewBox="0 0 64 64"><path d="M40 10c11 2 13 11 4 16-9 6-25 4-25 13 0 8 13 11 21 7 7-4 7-10 3-12" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="41" cy="9" r="5" fill="currentColor"/><circle cx="42.6" cy="8" r="1.1" fill="#0b0a14"/><path d="M46 9l7-2M46 9l6 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  R: '<svg viewBox="0 0 64 64"><path d="M8 46 Q32 32 56 46" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M15 44 L19 27 L25 42 M39 42 L45 27 L49 44" stroke="currentColor" stroke-width="3.6" fill="none" stroke-linejoin="round"/><path d="M32 38 L26 21 L32 8 L38 21 Z" fill="currentColor"/><circle cx="32" cy="43" r="5" fill="currentColor"/><circle cx="32" cy="43" r="2.3" fill="#274b9d"/></svg>',
  H: '<svg viewBox="0 0 64 64"><path d="M18 11 H46 L44 29 Q42 40 32 40 Q22 40 20 29 Z" fill="currentColor"/><path d="M18 14 Q6 16 10 26 Q13 32 20 30" stroke="currentColor" stroke-width="3.5" fill="none"/><path d="M46 14 Q58 16 54 26 Q51 32 44 30" stroke="currentColor" stroke-width="3.5" fill="none"/><rect x="29.5" y="40" width="5" height="8" fill="currentColor"/><path d="M21 53 H43 L39 48 H25 Z" fill="currentColor"/></svg>'
};

/* ─── Datos del puzle políglota de la Cámara (lo usa camara.html) ─── */
const CAMARA_PUZZLE = {
  validLangs: [
    {word:'abrete',   lang:'Castellano'},
    {word:'open',     lang:'Inglés'},
    {word:'openup',   lang:'Inglés'},
    {word:'ouvretoi', lang:'Francés'},
    {word:'ouvre',    lang:'Francés'},
    {word:'apriti',   lang:'Italiano'},
    {word:'aperire',  lang:'Latín'}
  ],
  decoys: {
    abracadabra:  'Bostezo. Eso es de otro cuento… y de otro autor.',
    abretesesamo: 'Sésamo se mudó hace siglos. Aquí solo cuela sisear o pedir en una lengua de esta casa.',
    porfavor:     'La educación abre corazones, no cerraduras. Pero me has caído bien: prueba en una lengua de esta casa.',
    alohomora:    'Ese abre cerraduras normales. Esta cerradura no es normal.'
  },
  hints: [
    'No entiendo esa lengua. Pista: la selló alguien que hablaba con serpientes… pero también fue alumno de esta casa.',
    'Sigo sin entenderte. Pista: empieza por la lengua en la que está escrito tu libro.',
    'Tercera vez. Casi te lo deletreo: en español, seis letras, empieza por A y termina por E.',
    'Última pista y luego me callo: si no sabes decírmelo… siséamelo.'
  ],
  successNormal: 'La piedra cede. Una rendija verde se dibuja en el centro. La puerta te deja pasar.',
  successParsel: 'La serpiente tallada se desenrosca. Sus ojos de esmeralda se abren un instante y se cierran de nuevo. La puerta se abre del todo.'
};

/* ─── Grageas Bertie Bott (Museo) ─── */
const BEANS = [
  ['Cera de Oído',        '#c49a45','👂','«Dumbledore tenía razón en 1991: desconfía de las grageas doradas.»'],
  ['Caramelo de Toffee',  '#a86527','🍬','¡Deliciosa! Dulce como el primer viaje en el Expreso.'],
  ['Moco de Troll',       '#4d7840','🧌','Viscosa y con regusto a mazmorras. Ten una poción a mano.'],
  ['Manzana Verde',       '#5ec43f','🍏','Fresca y crujiente. La favorita de Ravenclaw mientras leen.'],
  ['Pimienta Negra',      '#2b2a29','🌶️','¡Pica tanto que casi conjuras fuego por la nariz!'],
  ['Césped Recién Cortado','#32a852','🌱','Huele a la primera clase de vuelo de Madame Hooch.'],
  ['Tostada Quemada',     '#3d2b1f','🍞','Sabor a desayuno apresurado antes del examen de pociones.'],
  ['Chocolate con Menta', '#2b5247','🍫','¡Premio gordo! Suaviza cualquier encuentro con un boggart.']
];

/* ─── Retratos parlantes: SVGs de los lienzos ─── */
const PAINT = {
  fat_lady: `<svg viewBox="0 0 160 160"><defs><radialGradient id="ls" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#d94b72"/><stop offset="60%" stop-color="#9e2347"/><stop offset="100%" stop-color="#5e0f25"/></radialGradient><linearGradient id="gc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#caa96a"/><stop offset="50%" stop-color="#ffefc2"/><stop offset="100%" stop-color="#8a6833"/></linearGradient></defs><path d="M0,0 L160,0 L160,160 L0,160 Z" fill="#29111c"/><path d="M0,0 C40,30 50,110 30,160 L0,160 Z" fill="#421427" opacity=".6"/><path d="M160,0 C120,30 110,110 130,160 L160,160 Z" fill="#421427" opacity=".6"/><path d="M52,58 C45,30 115,30 108,58 C122,65 116,92 104,95 C100,105 60,105 56,95 C44,92 38,65 52,58 Z" fill="#4a2c20"/><circle cx="56" cy="65" r="8" fill="#5c3829"/><circle cx="104" cy="65" r="8" fill="#5c3829"/><circle cx="80" cy="42" r="10" fill="#5c3829"/><path d="M64,46 Q80,42 96,46" fill="none" stroke="#fcedba" stroke-width="2"/><circle cx="70" cy="44" r="2" fill="#fff"/><circle cx="80" cy="42" r="2.5" fill="#fff"/><circle cx="90" cy="44" r="2" fill="#fff"/><ellipse cx="80" cy="74" rx="22" ry="24" fill="#fadcce" stroke="#cf9988"/><circle cx="68" cy="80" r="5" fill="#f0889b" opacity=".5"/><circle cx="92" cy="80" r="5" fill="#f0889b" opacity=".5"/><ellipse cx="72" cy="70" rx="3.5" ry="2.5" fill="#382119"/><circle cx="73" cy="69" r="1" fill="#fff"/><ellipse cx="88" cy="70" rx="3.5" ry="2.5" fill="#382119"/><circle cx="89" cy="69" r="1" fill="#fff"/><path d="M66,66 Q72,63 78,66 M82,66 Q88,63 94,66" fill="none" stroke="#6b4232" stroke-width="1.2"/><path d="M75,87 Q80,90 85,87 Q80,93 75,87" fill="#b82343"/><path d="M68,98 Q80,105 92,98" fill="none" stroke="#fcedba" stroke-width="2.5" stroke-dasharray="3 1"/><path d="M52,106 C36,118 20,135 16,160 L144,160 C140,135 124,118 108,106 C96,116 64,116 52,106 Z" fill="url(#ls)"/><path d="M60,112 Q80,122 100,112" fill="none" stroke="#fff1f5" stroke-width="2.5" stroke-dasharray="4 2"/><circle cx="120" cy="116" r="5" fill="#fadcce"/><path d="M112,96 Q120,94 128,96 L128,108 Q120,115 112,108 Z" fill="url(#gc)"/><path d="M114,99 Q120,98 126,99 L126,106 Q120,111 114,106 Z" fill="#8f0f29"/><line x1="120" y1="112" x2="120" y2="124" stroke="url(#gc)" stroke-width="2.5"/><ellipse cx="120" cy="124" rx="7" ry="2.5" fill="url(#gc)"/></svg>`,
  sir_cadogan: `<svg viewBox="0 0 160 160"><defs><linearGradient id="as" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="50%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#475569"/></linearGradient><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#64748b"/></linearGradient></defs><path d="M0,0 L160,0 L160,160 L0,160 Z" fill="#1b2a38"/><path d="M0,105 Q80,85 160,105 L160,160 L0,160 Z" fill="#1d3d24"/><ellipse cx="44" cy="116" rx="22" ry="15" fill="#d1d5db"/><circle cx="38" cy="112" r="2.5" fill="#9ca3af" opacity=".6"/><circle cx="48" cy="115" r="3" fill="#9ca3af" opacity=".6"/><ellipse cx="22" cy="126" rx="8" ry="11" fill="#d1d5db"/><path d="M22,118 L18,114 L20,122 Z" fill="#6b7280"/><circle cx="16" cy="132" r="1.5" fill="#ffd700"/><path d="M104,36 C96,18 78,16 72,24 C68,32 78,38 88,38 Z" fill="#e11d48"/><path d="M82,36 C72,36 68,48 68,60 L112,60 C112,48 108,36 98,36 Z" fill="url(#as)" stroke="#caa96a" stroke-width="1.2"/><rect x="74" y="52" width="32" height="7" rx="1" fill="#180e04" stroke="#caa96a" stroke-width=".8"/><circle cx="82" cy="55.5" r="1.5" fill="#ffec99"/><circle cx="98" cy="55.5" r="1.5" fill="#ffec99"/><path d="M80,62 Q90,68 100,62" fill="none" stroke="#d4d4d8" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="64" cy="84" rx="11" ry="8" fill="url(#as)"/><ellipse cx="116" cy="84" rx="11" ry="8" fill="url(#as)"/><path d="M72,74 L108,74 L104,124 L76,124 Z" fill="url(#as)" stroke="#caa96a" stroke-width="1.2"/><polygon points="90,86 94,94 86,94" fill="#caa96a"/><circle cx="90" cy="84" r="2.5" fill="#caa96a"/><g><polygon points="128,14 133,18 131,88 125,88" fill="url(#bg2)"/><line x1="129" y1="16" x2="128" y2="88" stroke="#fff" stroke-width="1"/><rect x="118" y="88" width="22" height="4" rx="1" fill="#caa96a"/><rect x="127" y="92" width="4" height="12" fill="#713f12"/><circle cx="129" cy="106" r="3.5" fill="#caa96a"/></g></svg>`,
  alchemist: `<svg viewBox="0 0 160 160"><defs><linearGradient id="ar" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="50%" stop-color="#172554"/><stop offset="100%" stop-color="#090d1f"/></linearGradient></defs><path d="M0,0 L160,0 L160,160 L0,160 Z" fill="#0c1322"/><rect x="8" y="15" width="42" height="130" fill="#1e130a"/><rect x="12" y="25" width="34" height="14" fill="#7f1d1d"/><rect x="12" y="42" width="34" height="14" fill="#14532d"/><rect x="12" y="60" width="34" height="14" fill="#1e3a8a"/><rect x="12" y="78" width="34" height="14" fill="#581c87"/><path d="M52,48 C65,30 95,30 108,48 L132,160 L40,160 Z" fill="url(#ar)" stroke="#caa96a" stroke-width="1"/><polygon points="68,90 70,94 74,94 71,97 72,101 68,99 64,101 65,97 62,94 66,94" fill="#fcedba" opacity=".85"/><polygon points="98,110 100,114 104,114 101,117 102,121 98,119 94,121 95,117 92,114 96,114" fill="#fcedba" opacity=".85"/><ellipse cx="80" cy="62" rx="16" ry="18" fill="#fed7aa" stroke="#ca8a04" stroke-width=".8"/><circle cx="73" cy="60" r="4.5" fill="none" stroke="#ffd700" stroke-width="1"/><circle cx="87" cy="60" r="4.5" fill="none" stroke="#ffd700" stroke-width="1"/><line x1="77.5" y1="60" x2="82.5" y2="60" stroke="#ffd700" stroke-width="1"/><circle cx="73" cy="60" r="1.5" fill="#1e3a8a"/><circle cx="87" cy="60" r="1.5" fill="#1e3a8a"/><path d="M66,70 C62,100 70,126 80,138 C90,126 98,100 94,70 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/><rect x="115" y="80" width="38" height="8" rx="1" fill="#78350f"/><ellipse cx="132" cy="64" rx="11" ry="16" fill="#fff" stroke="#cbd5e1" stroke-width="1"/><circle cx="127" cy="55" r="3" fill="#f59e0b"/><circle cx="136" cy="55" r="3" fill="#f59e0b"/><polygon points="131,58 133,62 130,62" fill="#334155"/><circle cx="80" cy="116" r="12" fill="none" stroke="#fcedba" stroke-width="1.2"/><ellipse cx="80" cy="116" rx="12" ry="5" fill="none" stroke="#fcedba" stroke-width="1"/><circle cx="80" cy="116" r="2.5" fill="#fde047"/></svg>`,
  empty_frame: `<svg viewBox="0 0 160 160"><defs><linearGradient id="ev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#15803d"/><stop offset="50%" stop-color="#14532d"/><stop offset="100%" stop-color="#052e16"/></linearGradient><radialGradient id="hf" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(255,170,50,.45)"/><stop offset="70%" stop-color="rgba(255,120,30,.15)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><path d="M0,0 L160,0 L160,160 L0,160 Z" fill="#140d07"/><circle cx="80" cy="80" r="70" fill="url(#hf)"/><rect x="10" y="135" width="140" height="25" fill="#291b10"/><path d="M40,35 C32,55 24,70 30,105 L130,105 C136,70 128,55 120,35 C105,25 55,25 40,35 Z" fill="url(#ev)" stroke="#ca8a04" stroke-width="1.2"/><path d="M28,102 C28,95 132,95 132,102 L136,128 C136,134 24,134 24,128 Z" fill="#166534" stroke="#ca8a04" stroke-width="1.5"/><ellipse cx="80" cy="116" rx="26" ry="15" fill="#1c1917" stroke="#44403c"/><path d="M64,110 Q75,108 72,118 Q62,120 64,110 Z" fill="#b45309"/><path d="M85,112 Q95,110 94,120 Q82,122 85,112 Z" fill="#b45309"/><circle cx="62" cy="115" r="11" fill="#1c1917" stroke="#44403c" stroke-width=".8"/><polygon points="56,106 52,96 62,102" fill="#292524"/><polygon points="66,105 72,96 70,105" fill="#292524"/><path d="M56,115 Q58,118 61,115 M64,115 Q66,118 69,115" fill="none" stroke="#78716c" stroke-width="1.2"/><ellipse cx="76" cy="125" rx="5" ry="3" fill="#fafaf9"/><path d="M104,120 C114,122 120,128 116,134 C112,138 106,134 108,128" fill="none" stroke="#1c1917" stroke-width="5" stroke-linecap="round"/></svg>`
};

/* ─── Datos de retratos parlantes (bio + diálogos) ─── */
const PORTRAITS = [
  {id:'fat_lady',name:'La Señora Gorda',title:'Guardiana de la Torre de Gryffindor',mood:'Vigilante y melodramática',bio:'Vestido de seda rosa, tiara de perlas y una copa de vino que nunca se vacía.',q0:'«¿Contraseña? No me mires con esa cara: sin la palabra de paso nadie sube a los dormitorios.»',dlg:[
    ['¿Cuál es la contraseña de esta semana?','«¡Caput Draconis! …Aunque en el club también acepto "Olor a Libros". Pero date prisa, se me enfría el oporto.»'],
    ['¿Nos cantas una nota alta?','«¡Ajem! MIIIIII-LAAAAAA-SOOOOOOOL-DOOOOOO! 🎶 (El marco tiembla y los retratos vecinos se tapan los oídos).»'],
    ['¿Quién va retrasado con la relectura?','«Vi a tres personas anoche prometiendo leer el capítulo 10 y se quedaron dormidos con la pantalla encendida. ¡No engañáis a nadie!»']
  ]},
  {id:'sir_cadogan',name:'Sir Cadogan',title:'Caballero Errante del Pasillo Séptimo',mood:'Bravucón y retador',bio:'Armadura abollada que rechina a cada paso y un poni gordo que come flores.',q0:'«¡Deteneos, bellacos! ¡Desenvainad vuestro marcapáginas y batíos en singular combate contra el invencible Sir Cadogan!»',dlg:[
    ['¡Acepto el duelo de preguntas!','«¡Ja! ¿Cómo se llama el gato de la señora Figg que casi atropella a Harry con la moto voladora? ¡Responded o reconoced la superioridad de mi espada!»'],
    ['¿Dónde está tu poni hoy?','«Ese noble corcel se ha colado en el huerto de Hagrid a comer calabazas gigantes. ¡Volverá cuando tenga hambre de gloria!»'],
    ['Dame indicaciones al Gran Comedor','«¡Fácil! Subid cinco tramos, girad donde el tapiz del duende bizco, saltad el escalón tramposo y atravesad el cuadro del pastel de carne. ¡A la carga!»']
  ]},
  {id:'alchemist',name:'El Erudito Alquimista',title:'Conservador de Runas y Secretos',mood:'Lleno de sabiduría libresca',bio:'Túnica azul noche cuajada de constelaciones y una lechuza que no parpadea.',q0:'«Quien relee un libro nunca encuentra el mismo texto: las palabras esperan a que tú hayas vivido para revelar su verdadero peso.»',dlg:[
    ['¿Qué detalle pasamos por alto en la Piedra?','«La primera frase de Snape: asfódelo y ajenjo. En el lenguaje victoriano de las flores: "Lamento amargamente la muerte de Lily". Todo estaba escrito.»'],
    ['¿Un hechizo para leer más rápido?','«La lectura no es una carrera de escobas, joven mago. Paladea cada línea como zumo de calabaza en una mañana de otoño.»'],
    ['¿Qué opina tu lechuza del grupo?','«Ulula de desconcierto. Dice que mandar mensajes a las tres de la mañana sobre Voldemort perturba el sueño de las aves nobles.»']
  ]},
  {id:'empty_frame',name:'Marco de la Conserjería',title:'Sillón de Terciopelo con Gata Residente',mood:'Somnolienta pero atenta',bio:'Un sillón de orejas frente a una chimenea crepitante donde duerme una gata atigrada.',q0:'«Prrrrr… (Abre un ojo dorado, inspecciona tu marcapáginas y bosteza con desgana aristocrática).»',dlg:[
    ['Acariciar detrás de las orejas','«PRRRRRRR… (Ronronea como una caldera y amasa el cojín de terciopelo). Has ganado su aprobación temporal.»'],
    ['Ofrecerle una rana de chocolate','«¡Fsshh! Mira la rana con sospecha felina. Prefiere una esquina de página crujiente para masticar.»'],
    ['¿Quién era el dueño original?','«Se fue en 1742 a buscar galletas de jengibre a las cocinas y nunca regresó. El gato se quedó con la propiedad del lienzo por derecho de siesta.»']
  ]}
];

/* ─── Exponer explícitamente a window para compatibilidad global ─── */
if (typeof window !== 'undefined') {
  window.PUNTOS_URL = PUNTOS_URL;
  window.GEMS = GEMS;
  window.KEYS = KEYS;
  window.THEMES = THEMES;
  window.EMBLEMS = EMBLEMS;
  window.MAIN_DOORS = MAIN_DOORS;
  window.BOOKS = BOOKS;
  window.HOUSES = HOUSES;
  window.RELICS = RELICS;
  window.CAMARA_PUZZLE = CAMARA_PUZZLE;
  window.BEANS = BEANS;
  window.PAINT = PAINT;
  window.PORTRAITS = PORTRAITS;
}
