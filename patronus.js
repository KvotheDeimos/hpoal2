/* ═══════════════════════════════════════════════════════════
   patronus.js — Lógica completa del Patronus v5 (EXPANDIDA)
   ═══════════════════════════════════════════════════════════
   PRINCIPIOS DE DISEÑO (documentados para mantenimiento):
   1. El enemigo no es el monstruo: es la voz que devalúa tu felicidad.
   2. Un recuerdo genérico produce luz genérica; uno sensorial, corpórea.
   3. Ninguna forma es un test de personalidad: todas nacen de la FORMA
      del recuerdo (qué hizo por ti), no de quién eres.
   4. El progreso se siente, no se numera: nunca hay barra de vida visible.
   5. La privacidad es parte del diseño: la tarjeta solo muestra 3 palabras.
   ═══════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ═══ CLAVES DE ALMACENAMIENTO ═══ */
var KEY='hpoal_patronus_v5';
var BURNED_KEY='hpoal_patronus_burned';
var CHKEY='hpoal_book3_chapter';
var NAME_KEY='hpoal_user_name';

/* ═══ REFERENCIAS DOM ═══ */
var page=document.getElementById('pPage');
var frost=document.getElementById('frostOverlay');
var rift=document.getElementById('dementorRift');
var holdGlow=document.getElementById('holdGlow');
var waiting=document.getElementById('waitingPatronus');

/* ═══ ESTADO PERSISTIDO ═══ */
var saved=null; try{ saved=JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){}
var hasBurned=false; try{ hasBurned=localStorage.getItem(BURNED_KEY)==='1'; }catch(e){}
var house=null; try{ house=localStorage.getItem('hpoal_ceremony_house')||localStorage.getItem('hogwarts_user_house')||localStorage.getItem('hpoal_house')||null; }catch(e){}
var b3ch=0; try{ b3ch=parseInt(localStorage.getItem(CHKEY)||'0',10)||0; }catch(e){}
var sessionMet=false;
var REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════════════════════════
   POOLS DE TEXTO DE LUPIN (variaciones por contexto)
   Cada margen tiene 2-4 variantes para que nunca se repita igual.
   ═══════════════════════════════════════════════════════════ */
var LUPIN={
  intro:[
    'No te pediré valentía. Te pediré algo más difícil: precisión. Los Dementores no se alimentan de tu miedo, se alimentan de lo borroso. Dale contorno a lo que amas y no tendrán dónde morder.',
    'Antes de empezar, una advertencia honesta: esto no va a salir bien a la primera. Casi nadie lo logra a la primera. Yo tardé tres años y una guerra en tener un Patronus con cuerpo. No estás solo en el fracaso.',
    'He enseñado este hechizo a muchos. Los que lo logran no son los más fuertes: son los que recuerdan con más detalle. La fuerza no sirve de nada aquí. La memoria lo es todo.'
  ],
  introReturning:[
    'Te recuerdo. El miedo también. Entra: la segunda vez siempre duele un poco menos y enseña un poco más.',
    'Has vuelto. Bien. Los que vuelven son los que entendieron que esto no se termina nunca: se practica.',
    'Otra vez tú. No te preguntaré cómo estás: lo sé por cómo sostienes la puerta.'
  ],
  breath:[
    'Bien. Ahora la mente está lo bastante quieta para abrir algo que no se abre todos los días.',
    'Nota cómo baja el pulso. Ese es el primer hechizo que aprendí, y no tiene palabras: tiene ritmo.',
    'La calma no es ausencia de miedo. Es miedo que ha decidido esperar su turno.'
  ],
  doors:[
    'Catorce puertas. Ninguna es la correcta: es la tuya o no es. No elijas la que suena mejor: elige la que duele un poco al tocarla.',
    'Verás puertas que no quieres abrir. Eso es normal. Las que no quieres abrir suelen ser las que guardan más luz.',
    'No hay prisa. Un Dementor no espera, pero tú sí puedes: esa es tu única ventaja sobre él.'
  ],
  anchors:[
    'Bien. Ahora no me lo cuentes bonito: cuéntamelo cierto. Los detalles son los que muerden.',
    'Los detalles son lo único que los Dementores no pueden imitar. Pueden robarte la alegría: no pueden robarte el olor de la cocina de tu abuela.',
    'Piensa en concreto. "Fue bonito" no invoca nada. "Olía a pan y a lluvia" invoca un ejército.'
  ],
  anchorSlow:[
    'No hace falta que sea bonito. Hace falta que sea tuyo.',
    'Escribes rápido porque te da miedo releerlo. Releerlo es exactamente el punto.',
    'La prisa delata miedo: el miedo es lo que el Dementor busca. Ve despacio.'
  ],
  silence:[
    'Sosténlo. No lo digas todavía. Solo sosténlo.',
    'Este es el momento que nadie enseña: el de antes del conjuro. Aquí es donde se decide todo.',
    'Diez segundos. Parece nada. Es lo más largo que vas a sentir hoy.'
  ],
  combat:[
    'No se le gana con razones, se le gana con presencia. Vuelve a sostenerlo. Más cerca.',
    'Ya te lo dije una vez. Las razones son comida para él. Sostén.',
    'Escucha: no te está diciendo la verdad. Te está diciendo lo que más te duele oír. Son cosas distintas.',
    'Si te rindes ahora, no pasa nada grave. Solo que él gana. Y él siempre cuenta las victorias.'
  ],
  holdPost:{
    callar:[
      'Bien. A veces el silencio no es rendirse: es apretar los dientes de otro modo.',
      'No dijiste nada. Fue lo más fuerte que hiciste hoy.'
    ],
    apretar:[
      'Lo apretaste bien. Lo pequeño se convierte en escudo si no lo sueltas nunca.',
      'Apretar no es esconder. Apretar es guardar calor.'
    ],
    nombrar:[
      'Lo nombraste. Los Dementores no soportan las palabras que no se pueden desdecir.',
      'Un nombre es un clavo: fija lo que el viento quiere llevarse.'
    ],
    compartir:[
      'Lo compartiste. Un recuerdo compartido pesa la mitad: es una de las leyes no escritas.',
      'Al decirlo en voz alta lo sacaste de su escondite. Ahora ya no es solo suyo: es tuyo y de quien lo oyó.'
    ],
    reir:[
      'Te reíste. La risa es lo que los Dementores no pueden imitar: les falta la memoria del juego.',
      'Reírse de lo propio no es burla: es cariño con distancia.'
    ],
    llorar:[
      'Lloraste. Eso no es rendirse: es abrir una puerta para que entre un poco más de luz.',
      'Las lágrimas no apagan la vela: la limpian.'
    ],
    asombrar:[
      'Te asombraste dos veces del mismo milagro. Pocos pueden: requiere humildad.',
      'El asombro repetido no se gasta: se afila.'
    ],
    pregunta:[
      'Guardaste la pregunta. Las preguntas son más resistentes que las respuestas: nunca se oxidan.',
      'Una pregunta sin respuesta es una puerta sin cerrar. Eso también es luz.'
    ]
  },
  haste:[
    'La prisa es miedo con otro nombre. El conjuro no se escribe: se respira.',
    'Corriste. Él lo nota. Vuelve a escribirlo como si tuvieras todo el tiempo del mundo: porque, aquí dentro, lo tienes.'
  ],
  reduced:[
    'Para ti la calma no será un reto: será un regalo. Escribe como puedas: yo pondré el pulso.',
    'No hay prisa. Nunca hay prisa con un Patronus.'
  ],
  face:[
    'Eso no lo había visto hacer a ningún Patronus. Creo que no era tu luz: era un recado.',
    'He visto muchos Patronus. Este es el primero que me ha hecho callar.'
  ],
  seed:[
    'No todos los Patronus nacen con cuerpo. El tuyo nació con intención. Volverá con forma cuando el recuerdo madure.',
    'Una semilla no es un fracaso de árbol. Es un árbol con paciencia.'
  ],
  notready:[
    'Hay recuerdos que no se abren bajo presión. No es un fracaso: es pudor. Vuelve cuando haga menos frío.',
    'La vela no se apaga: se guarda. Guardar también es una forma de cuidar.'
  ],
  waiting:[
    'Tu Patronus te esperaba. No se fue nunca: los Patronus no se van, se quedan cerca por si acaso.',
    'Míralo. Lleva aquí desde la última vez. No se mueve mucho: no hace falta.'
  ]
};

function lupinPick(pool){
  if(typeof pool==='string')return pool;
  return pool[Math.floor(Math.random()*pool.length)];
}

/* ═══════════════════════════════════════════════════════════
   TAXONOMÍA DE 28 FORMAS (3 FAMILIAS)
   ═══════════════════════════════════════════════════════════ */
var TAXONOMY={
  nutria:{name:'Nutria',fam:'animal',famLabel:'Animal del Mundo',svg:'otter',aff:['vivacity','warmth'],why:'Tu recuerdo no era un lugar: era un juego sostenido en el cuerpo que nadie ganó. Por eso tu luz juega.'},
  liebre:{name:'Liebre',fam:'animal',famLabel:'Animal del Mundo',svg:'hare',aff:['vivacity','clarity'],why:'Tu recuerdo era libertad breve: correr sabiendo exactamente que se acaba, y correr igual.'},
  ciervo:{name:'Ciervo',fam:'animal',famLabel:'Animal del Mundo',svg:'stag',aff:['steadiness','depth'],why:'Tu memoria era amparo: algo que se interpuso con nobleza entre tú y un daño inminente.'},
  cierva:{name:'Cierva',fam:'animal',famLabel:'Animal del Mundo',svg:'doe',aff:['warmth','depth'],why:'Un amor desinteresado que no pidió nada a cambio, ni siquiera reconocimiento.'},
  lobo:{name:'Lobo',fam:'animal',famLabel:'Animal del Mundo',svg:'wolf',aff:['steadiness','warmth'],why:'El instante sagrado en que fuiste elegido por una manada y supiste que nunca volverías a estar solo.'},
  zorro:{name:'Zorro',fam:'animal',famLabel:'Animal del Mundo',svg:'fox',aff:['clarity','vivacity'],why:'Un ingenio pequeño y discreto que te salvó de la oscuridad cuando las fuerzas flaqueaban.'},
  garza:{name:'Garza',fam:'animal',famLabel:'Animal del Mundo',svg:'heron',aff:['steadiness','clarity'],why:'Una espera larga, silenciosa y paciente que por fin dio su fruto más dorado.'},
  buho:{name:'Búho',fam:'animal',famLabel:'Animal del Mundo',svg:'owl',aff:['clarity','depth'],why:'Una verdad honda vista de noche, a solas, cuando nadie más tenía el valor de mirar.'},
  cisne:{name:'Cisne',fam:'animal',famLabel:'Animal del Mundo',svg:'swan',aff:['steadiness','depth'],why:'Gracia y dignidad sostenidas sin temblar sobre aguas heladas.'},
  tejon:{name:'Tejón',fam:'animal',famLabel:'Animal del Mundo',svg:'badger',aff:['constancy','warmth'],why:'Defensa feroz y tierna de un hogar pequeño, modesto y verdadero.'},
  foca:{name:'Foca',fam:'animal',famLabel:'Animal del Mundo',svg:'seal',aff:['warmth','vivacity'],why:'Alegría serena dentro de algo infinitamente más grande y profundo que tú.'},
  elefante:{name:'Elefante',fam:'animal',famLabel:'Animal del Mundo',svg:'elephant',aff:['constancy','depth'],why:'Una memoria sagrada que se negó a olvidar lo que otros dejaron atrás.'},
  caballo:{name:'Caballo',fam:'animal',famLabel:'Animal del Mundo',svg:'horse',aff:['vivacity','steadiness'],why:'Partir, llegar, o las dos cosas a la vez con el viento azotándote la frente.'},
  gato:{name:'Gato',fam:'animal',famLabel:'Animal del Mundo',svg:'cat',aff:['clarity','constancy'],why:'Un autorescate impecable disfrazado de misteriosa independencia.'},
  perro:{name:'Perro',fam:'animal',famLabel:'Animal del Mundo',svg:'dog',aff:['warmth','constancy'],why:'Un regreso incondicional: la fidelidad que te esperaba en la puerta sin juzgarte jamás.'},
  gorrion:{name:'Gorrión',fam:'animal',famLabel:'Animal del Mundo',svg:'sparrow',aff:['vivacity','warmth'],why:'Un recuerdo minúsculo y casi invisible que, sin embargo, lo sostuvo todo.'},
  golondrina:{name:'Golondrina',fam:'animal',famLabel:'Animal del Mundo',svg:'swallow',aff:['constancy','vivacity'],why:'Volver, año tras año, al mismo nido a pesar de las peores tormentas.'},
  erizo:{name:'Erizo',fam:'animal',famLabel:'Animal del Mundo',svg:'hedgehog',aff:['warmth','constancy'],why:'Una ternura secreta que solo se deja ver cuando te sientes plenamente a salvo.'},
  leon:{name:'León Dorado',fam:'house',houseKey:'G',famLabel:'Emblema de Gryffindor',svg:'lion',aff:['steadiness','depth'],why:'El momento en que te pusiste delante de alguien para protegerlo sin que nadie te lo pidiera.'},
  serpiente:{name:'Serpiente de Plata',fam:'house',houseKey:'S',famLabel:'Emblema de Slytherin',svg:'serpent',aff:['clarity','vivacity'],why:'El momento en que elegiste tu propio camino contra el consejo de todos, y tenías toda la razón.'},
  aguila:{name:'Águila de Bronce',fam:'house',houseKey:'R',famLabel:'Emblema de Ravenclaw',svg:'eagle',aff:['clarity','depth','wonder'],why:'El momento en que una idea brillante te elevó la cabeza y entendiste algo antes que el resto del mundo.'},
  tejonCasa:{name:'Tejón Fiel',fam:'house',houseKey:'H',famLabel:'Emblema de Hufflepuff',svg:'badger_crest',aff:['constancy','warmth'],why:'El momento en que decidiste quedarte cuando huir era más fácil, y nadie se enteró jamás.'},
  unicornio:{name:'Unicornio',fam:'creature',famLabel:'Criatura Mágica',svg:'unicorn',aff:['wonder','clarity'],why:'Tu memoria roza la pureza de lo incorruptible: la luz de aquello que brillaba sin pedir perdón.'},
  dragon:{name:'Dragón Plateado',fam:'creature',famLabel:'Criatura Mágica',svg:'dragon',aff:['wonder','steadiness'],why:'La fuerza de haber caminado por las llamas sin que el fuego te consumiera el corazón.'},
  thestral:{name:'Thestral',fam:'creature',famLabel:'Criatura Mágica',svg:'thestral',aff:['wonder','depth'],why:'Tu luz tiene la forma de lo que pocos ven: no porque mires raro, sino porque estuviste allí cuando había que mirar.'},
  fenix:{name:'Fénix',fam:'creature',famLabel:'Criatura Mágica',svg:'phoenix',aff:['wonder','depth','constancy'],why:'Una esperanza que renació entera de las cenizas de un mundo que creías destruido.'},
  hipogrifo:{name:'Hipogrifo',fam:'creature',famLabel:'Criatura Mágica',svg:'hippogriff',aff:['wonder','steadiness'],why:'Un pacto silencioso de orgullo y respeto: la reverencia que se inclinó de vuelta.'},
  bowtruckle:{name:'Bowtruckle',fam:'creature',famLabel:'Criatura Mágica',svg:'bowtruckle',aff:['wonder','constancy','warmth'],why:'Una devoción diminuta y terca por la vida que se negó a quebrarse bajo el peso de la tormenta.'}
};

/* ═══ SVGs DETALLADOS (28 siluetas) ═══ */
var SVG_SHAPES={
  stag:'<path d="M50 86 L50 48 M50 48 Q50 34 42 26 M50 48 Q50 34 58 26 M42 26 Q30 14 24 20 M42 26 Q32 26 28 34 M58 26 Q70 14 76 20 M58 26 Q68 26 72 34" stroke="{c}" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="50" cy="46" r="5" fill="#ffffff"/><circle cx="50" cy="46" r="14" fill="{c}" opacity=".35"/>',
  doe:'<path d="M50 86 L50 50 Q50 38 45 30 Q40 22 46 16 Q52 22 50 32 Q56 22 62 26" stroke="{c}" stroke-width="2.8" stroke-linecap="round" fill="none"/><circle cx="48" cy="24" r="4" fill="#ffffff"/><circle cx="48" cy="24" r="12" fill="{c}" opacity=".35"/>',
  otter:'<path d="M30 65 Q40 35 55 42 Q68 48 72 65 Q62 76 42 74 Z M68 50 Q78 45 82 52" stroke="{c}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="72" cy="52" r="3.5" fill="#ffffff"/>',
  hare:'<path d="M36 78 Q42 55 52 50 Q58 35 54 20 M52 50 Q66 32 68 18 Q62 44 65 55 L75 75" stroke="{c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="58" cy="42" r="3.5" fill="#ffffff"/>',
  wolf:'<path d="M28 78 Q36 55 50 50 L65 30 L62 45 L76 38 L68 56 Q75 68 76 80" stroke="{c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="60" cy="45" r="3.8" fill="#ffffff"/>',
  fox:'<path d="M30 76 Q42 58 52 54 L64 36 L62 48 L74 44 L66 58 Q78 72 74 82" stroke="{c}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="62" cy="48" r="3.5" fill="#ffffff"/>',
  heron:'<path d="M48 84 L48 50 Q48 30 54 22 L72 18 Q58 28 50 38 M30 52 Q46 44 66 50" stroke="{c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="58" cy="24" r="3.5" fill="#ffffff"/>',
  owl:'<ellipse cx="50" cy="55" rx="18" ry="24" stroke="{c}" stroke-width="2.5" fill="none"/><circle cx="43" cy="46" r="4.5" fill="#ffffff"/><circle cx="57" cy="46" r="4.5" fill="#ffffff"/><path d="M48 53 L50 58 L52 53 Z" fill="{c}"/>',
  swan:'<path d="M32 72 Q48 68 62 70 Q70 70 74 65 Q66 48 54 36 Q46 25 52 18 Q58 22 55 30 Q65 42 70 54" stroke="{c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="51" cy="22" r="3.5" fill="#ffffff"/>',
  badger:'<path d="M32 78 L38 52 Q48 48 58 48 L68 52 L72 78 M42 48 L46 32 L54 32 L58 48" stroke="{c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="50" cy="40" r="3.5" fill="#ffffff"/>',
  badger_crest:'<path d="M32 78 L38 52 Q48 48 58 48 L68 52 L72 78 M42 48 L46 32 L54 32 L58 48" stroke="{c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><polygon points="50,14 62,26 38,26" fill="#ffd700"/>',
  seal:'<path d="M28 72 Q38 50 56 46 Q70 44 76 54 Q64 74 38 78 Z" stroke="{c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="66" cy="50" r="3.5" fill="#ffffff"/>',
  elephant:'<path d="M36 78 Q36 45 52 42 Q66 42 72 55 L72 78 M56 45 Q64 36 70 28 L72 38" stroke="{c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="62" cy="48" r="4" fill="#ffffff"/>',
  horse:'<path d="M30 82 Q42 56 50 48 Q56 34 60 22 L68 28 L64 42 Q72 56 74 82" stroke="{c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="62" cy="32" r="3.8" fill="#ffffff"/>',
  cat:'<path d="M36 78 Q42 54 52 50 Q56 42 54 30 L60 38 L68 32 L66 45 Q74 58 72 78" stroke="{c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="60" cy="44" r="3.5" fill="#ffffff"/>',
  dog:'<path d="M34 80 Q42 56 54 52 Q58 40 56 28 L66 35 L62 48 Q72 62 70 80" stroke="{c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="58" cy="40" r="3.8" fill="#ffffff"/>',
  sparrow:'<path d="M32 64 Q46 48 60 50 Q72 52 76 60 Q62 68 44 68 Z M58 46 L68 38 L64 50" stroke="{c}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="66" cy="52" r="3" fill="#ffffff"/>',
  swallow:'<path d="M50 78 L50 46 M32 38 Q50 48 68 38 M44 70 L50 82 L56 70" stroke="{c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="50" cy="40" r="3.5" fill="#ffffff"/>',
  hedgehog:'<ellipse cx="50" cy="60" rx="20" ry="14" stroke="{c}" stroke-width="2.5" fill="none"/><path d="M35 50 L38 42 M45 48 L48 38 M55 48 L58 38 M65 52 L70 42" stroke="{c}" stroke-width="2"/><circle cx="62" cy="60" r="3" fill="#ffffff"/>',
  lion:'<path d="M32 80 Q44 52 52 46 Q54 30 64 26 Q72 34 68 46 L76 52 Q76 72 72 80 M52 38 Q60 22 72 26" stroke="{c}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="62" cy="38" r="4.2" fill="#ffd700"/>',
  serpent:'<path d="M30 76 Q22 62 28 48 Q34 34 50 36 Q64 38 66 52 Q68 66 54 72 Q42 76 38 64" stroke="{c}" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="64" cy="44" r="3.5" fill="#ffffff"/>',
  eagle:'<path d="M50 78 L50 48 M22 42 Q50 30 78 42 M38 52 L50 36 L62 52" stroke="{c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="50" cy="34" r="4" fill="#68a6ff"/>',
  unicorn:'<path d="M34 82 Q44 56 52 48 Q56 34 60 22 L68 28 L64 42 Q72 56 74 82 M60 22 L76 8" stroke="{c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><polygon points="60,22 76,8 65,24" fill="#ffe5f9"/><circle cx="62" cy="32" r="4" fill="#ffffff"/>',
  dragon:'<path d="M26 78 Q42 62 48 52 Q56 36 68 32 L78 26 L72 38 Q82 52 74 78 M48 52 L36 34 L54 44" stroke="{c}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="70" cy="32" r="4" fill="#ffd700"/>',
  thestral:'<path d="M30 82 Q42 56 50 46 L58 26 L66 32 L62 44 Q74 60 72 82 M48 48 L32 28 L54 40" stroke="{c}" stroke-width="2.2" stroke-dasharray="4 2" fill="none" stroke-linecap="round"/><circle cx="60" cy="32" r="3.5" fill="#ffffff" opacity=".8"/>',
  phoenix:'<path d="M50 84 L50 44 M26 40 Q50 20 74 40 M38 60 Q50 74 62 60 M50 24 L50 14" stroke="{c}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="50" cy="32" r="5" fill="#ffec99"/><circle cx="50" cy="32" r="14" fill="#ff7640" opacity=".35"/>',
  hippogriff:'<path d="M32 82 Q44 58 50 48 Q56 34 62 24 L74 20 L66 38 Q76 56 72 82 M48 48 L28 30 L52 40" stroke="{c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="64" cy="28" r="4" fill="#ffe8a3"/>',
  bowtruckle:'<path d="M50 84 L50 38 M44 52 L34 38 M56 52 L66 38 M48 38 L42 24 M52 38 L58 24" stroke="{c}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="50" cy="34" r="3.5" fill="#a8ffb2"/>'
};

/* ═══════════════════════════════════════════════════════════
   14 PUERTAS CON MICRO-ESCENAS EXTENDIDAS (2-3 líneas c/u)
   ═══════════════════════════════════════════════════════════ */
var DOORS=[
  {id:1,ico:'🍞',t:'Un olor de la infancia',d:'Pan recién horneado, lluvia en polvo, el jersey de alguien.',p:'«Hay olores que guardan casas enteras en una sola molécula de aire.»',
   sc:['Lupin no dice nada. Solo acerca una taza imaginaria y espera a que el olor haga el trabajo.','Hay olores que son direcciones: te llevan a una casa que ya no existe en ningún mapa.'],
   tags:['joy','safe'],forms:['elefante','gato','gorrion','nutria'],house:null,
   tintT:[{id:2,label:'El olor mismo, calentándose'}]},
  {id:2,ico:'🎭',t:'Una risa que ya no escuchas',d:'O que sí, y por eso vuelve con toda su fuerza.',p:'«La risa es lo último que se apaga y lo primero que rescata.»',
   sc:['Hay risas que no se guardan: se quedan viviendo en una habitación concreta. Entra despacio.','Si aún la escuchas, esta puerta duele menos. Si ya no, duele el doble: por eso está aquí.'],
   tags:['loss','joy'],forms:['perro','cisne','golondrina','cierva'],house:null},
  {id:3,ico:'🚪',t:'Un lugar al que no puedes volver',d:'Una casa demolida, un pueblo remoto, una cocina en calma.',p:'«Los lugares perdidos solo existen si los habitas por dentro.»',
   sc:['El lugar sigue existiendo en ti con muebles que ya no existen fuera. Lupin te deja pasar primero.','Dentro todavía hay luz de una hora concreta del día. Tú sabes cuál.'],
   tags:['loss','safe'],forms:['elefante','golondrina','gato'],house:'H'},
  {id:4,ico:'🏅',t:'Una victoria pequeña que nadie vio',d:'Y que por eso es un triunfo solo tuyo.',p:'«Lo que nadie aplaudió fue lo que más costó defender.»',
   sc:['Nadie aplaudió. Por eso nadie puede quitártela. Sosténla donde estaba: a solas.','Las victorias sin testigos son las únicas que no se pueden falsificar.'],
   tags:['joy','self'],forms:['zorro','liebre','caballo'],house:'S'},
  {id:5,ico:'🕯️',t:'La primera vez que te sentiste a salvo',d:'Aunque fuera durante apenas cinco minutos.',p:'«Cinco minutos de paz limpia pueden sostener un invierno entero.»',
   sc:['Cinco minutos de seguridad en una infancia entera son un continente. Lupin lo sabe: no te mete prisa.','Recuerda dónde estaban tus hombros ese día. Bajados, por fin.'],
   tags:['safe'],forms:['cierva','gato','erizo'],house:'H',
   tintT:[{id:4,label:'Calor de radiador ajeno'}]},
  {id:6,ico:'🚉',t:'Una despedida que también fue comienzo',d:'Andenes de tren, mudanzas, últimos días de verano.',p:'«Cerrar una puerta con gratitud es una forma secreta de luz.»',
   sc:['Las despedidas buenas duelen dos veces: al irse y al entender, años después, que eran una puerta.','Alguien dijo "cuídate" y lo dijo en serio. Eso también cuenta.'],
   tags:['loss'],forms:['golondrina','caballo','liebre'],house:'G'},
  {id:7,ico:'🐾',t:'Un animal que te quiso',d:'Sin condiciones, sin juicios y sin palabras.',p:'«Ellos saben mirarte a los ojos sin pedirte nunca que seas otro.»',
   sc:['Nadie te quiso nunca con tan poca necesidad de explicaciones. Recuerda cómo olía su cuello.','Los animales no saben mentir: por eso su cariño es el único que no deja dudas.'],
   tags:['joy','love'],forms:['perro','gato','nutria'],house:null,
   tintS:[{id:2,label:'Respiración de animal dormido'}]},
  {id:8,ico:'🎶',t:'Una canción que fue tuya',d:'Y que al sonar te devuelve entero al camino.',p:'«Tres acordes bastan para reconstruir una vida entera.»',
   sc:['Hay canciones que no se escuchan: se suben. Deja que suene el primer acorde antes de escribir.','Todavía sabes la letra entera. Eso no es memoria: es lealtad.'],
   tags:['joy','self'],forms:['gorrion','golondrina','nutria'],house:'R',
   tintS:[{id:5,label:'El primer acorde, afinando'}]},
  {id:9,ico:'🤝',t:'Una mano que sostuvo la tuya',d:'En un hospital, en un cine, en un adiós.',p:'«La piel recuerda con precisión lo que las palabras callaron.»',
   sc:['No apretaba fuerte. Apretaba justo. Esa diferencia es la que tu luz recuerda.','Hay manos que no dicen nada y lo dicen todo.'],
   tags:['love','safe'],forms:['cierva','perro','foca'],house:null},
  {id:10,ico:'😂',t:'Una noche de risa hasta el dolor',d:'De aquellas que duelen placenteramente en los costados.',p:'«Reír hasta doler es la única herida que sana el alma.»',
   sc:['Risa de la que no se puede explicar al día siguiente sin que se muera un poco. No la expliques: sostenla.','Alguien dijo una tontería y el mundo se volvió habitable durante dos horas.'],
   tags:['joy','laughter'],forms:['nutria','liebre','perro'],house:null,
   tintT:[{id:5,label:'Frío de calle a medianoche'}]},
  {id:11,ico:'🛠️',t:'Algo que hiciste con tus manos',d:'Y que existió únicamente porque tú existías.',p:'«Darle contorno a la materia es un conjuro sin varita.»',
   sc:['Torcido, quizá. Imperfecto, seguro. Pero nadie más en el mundo podría haberlo hecho exactamente así.','Tus manos sabían algo que tu cabeza aún no entendía.'],
   tags:['self','care'],forms:['zorro','gorrion','elefante'],house:'H'},
  {id:12,ico:'💛',t:'El instante exacto en que te quisieron',d:'No lo sospechaste: lo entendiste con total certeza.',p:'«No hubo cálculo ni duda: solo una certeza nítida y caliente.»',
   sc:['Suele ser un detalle tonto: un plato guardado, un abrigo prestado. Los detalles tontos son los que sostienen.','No fue un discurso. Fue un gesto de dos segundos. Y cambió todo.'],
   tags:['love'],forms:['cierva','ciervo','perro'],house:null},
  {id:13,ico:'✨',t:'Lo imposible pareció posible',d:'Un cielo abierto, un escenario, un libro que te abrió la cabeza.',p:'«Lo imposible no se busca: se deja encontrar cuando dejas de temerlo.»',
   sc:['Aquí no se recuerda un hecho: se recuerda el instante exacto en que el mundo se hizo más grande de golpe.','Algo se encendió esa noche y no se ha apagado del todo. Por eso estás aquí.'],
   tags:['wonder'],forms:['unicornio','dragon','thestral','fenix','hipogrifo','bowtruckle'],house:'R'},
  {id:14,ico:'🌱',t:'Algo que cuidaste y sobrevivió',d:'Una planta, un animal, un hermano, un proyecto propio.',p:'«Hay recuerdos que no se guardan: se custodian con devoción.»',
   sc:['Nadie vio las noches. Solo se ve lo que vive ahora. Pero tú sabes cuántas veces casi no.','Cuidar es la forma más silenciosa de decir "quédate".'],
   tags:['care','loss'],forms:['tejon','bowtruckle','cisne','elefante'],house:'G',
   tintS:[{id:4,label:'Silencio de invernadero'}]}
];

/* ═══ ANCLAJES ═══ */
var TEMP_OPTIONS=[
  {id:0,text:'Calor de cocina en invierno',hue:'#e69d45',tone:'ámbar',note:523.25},
  {id:1,text:'Sol de mediodía en los brazos',hue:'#fff8e7',tone:'blanco solar',note:783.99},
  {id:2,text:'Frescor de sábana limpia',hue:'#8ec5fc',tone:'azul sábana',note:880.00},
  {id:3,text:'Fuego bajo, de estufa',hue:'#f37032',tone:'naranja brasa',note:587.33},
  {id:4,text:'Tibio, de mano sostenida',hue:'#e8a598',tone:'rosa piel',note:659.25},
  {id:5,text:'Frío que no molestaba, de noche buena',hue:'#c0d4ec',tone:'plata nocturna',note:698.46}
];
var SOUND_OPTIONS=[
  {id:0,text:'Voces en otra habitación',pace:'quieto y firme'},
  {id:1,text:'Lluvia contra el cristal',pace:'ondulante'},
  {id:2,text:'Respiración de alguien dormido',pace:'lento y sosegado'},
  {id:3,text:'Cucharas, platos, vida',pace:'vivaz'},
  {id:4,text:'Silencio bueno, de los que abrigan',pace:'sereno y envolvente'},
  {id:5,text:'Una radio lejana',pace:'errante y etéreo'}
];
var OBJECT_OPTIONS=[
  {id:0,text:'Una manta',size:'envolvente'},
  {id:1,text:'Una taza',size:'pequeño y constante'},
  {id:2,text:'Un umbral, una puerta',size:'majestuoso'},
  {id:3,text:'Una ventana',size:'translúcido'},
  {id:4,text:'Un juguete roto pero querido',size:'ágil'},
  {id:5,text:'Nada: solo una persona',size:'humano',isPerson:true}
];
var WHO_BASE=[
  {id:'reia',label:'El que reía',attr:'vivacity'},
  {id:'cuidaba',label:'El que cuidaba',attr:'warmth'},
  {id:'miraba',label:'El que miraba desde fuera',attr:'clarity'},
  {id:'nosabia',label:'El que no sabía que era feliz',attr:'depth'},
  {id:'volvia',label:'El que volvía',attr:'constancy'},
  {id:'sequedaba',label:'El que se quedaba',attr:'steadiness'}
];
var WHO_EXTRA={
  loss:[{id:'despedia',label:'El que se despedía sin decirlo',attr:'depth'}],
  joy:[{id:'gritaba',label:'El que gritaba primero',attr:'vivacity'}],
  wonder:[{id:'creia',label:'El que creía todo',attr:'wonder'}],
  safe:[{id:'respiraba',label:'El que por fin respiraba',attr:'steadiness'}],
  love:[{id:'confiaba',label:'El que confiaba entero',attr:'warmth'}],
  self:[{id:'podia',label:'El que descubría que podía',attr:'clarity'}],
  care:[{id:'sostenia',label:'El que sostenía algo vivo',attr:'constancy'}],
  laughter:[{id:'reia2',label:'El que reía primero',attr:'vivacity'}]
};
var WONDER_QUESTIONS=[
  {text:'Por qué brillaba tanto',creature:'unicornio'},
  {text:'Por qué no me quemó',creature:'dragon'},
  {text:'Por qué yo lo vi y otros no',creature:'thestral'},
  {text:'Por qué volvió',creature:'fenix'},
  {text:'Por qué se dejó acercar',creature:'hipogrifo'},
  {text:'Por qué siguió vivo',creature:'bowtruckle'}
];

/* ═══ ATRIBUTOS Y COMBINACIONES (12 combos) ═══ */
var ATTR_WHY={
  steadiness:'Tu luz no brilla más fuerte: brilla más quieta. Eso es lo que no se apaga.',
  clarity:'Tu luz mira de frente. Recuerda porque entiende, y entiende porque no apartó la vista.',
  warmth:'Tu luz calienta sin tocar. Es la forma que tiene el cuidado cuando sobrevive.',
  vivacity:'Tu luz se mueve primero y pregunta después. Así era tu alegría: con prisa buena.',
  depth:'Tu luz tiene fondo. Se le nota el peso justo de lo que sí importó.',
  constancy:'Tu luz vuelve. No sabe irse: aprendió a quedarse.',
  wonder:'Tu luz todavía pregunta. Por eso no envejece.'
};
var ATTR_NAME={steadiness:'firme',clarity:'clara',warmth:'cálida',vivacity:'viva',depth:'profunda',constancy:'constante',wonder:'asombrada'};
var COMBO_LINES=[
  {a:'steadiness',b:'depth',txt:'Tu luz tiene la cualidad rara de sostenerse mientras profundiza: la mayoría de las luces solo hacen una cosa a la vez.'},
  {a:'warmth',b:'vivacity',txt:'Tu luz es cálida y rápida a la vez: algo muy raro. Normalmente la calidez es lenta y la vivacidad es fría.'},
  {a:'clarity',b:'wonder',txt:'Tu luz mira y se asombra al mismo tiempo: es lo que hace que veas cosas que otros dejan pasar.'},
  {a:'constancy',b:'vivacity',txt:'Tu luz vuelve rápido y se queda: esa combinación no es común. La mayoría de las luces constantes son lentas.'},
  {a:'depth',b:'warmth',txt:'Tu luz calienta en profundidad: no se nota a primera vista, pero se nota después, en sueños.'},
  {a:'clarity',b:'steadiness',txt:'Tu luz mira quieto. Eso es lo que hacen las luces que duran décadas.'},
  {a:'wonder',b:'depth',txt:'Tu luz pregunta hondo: por eso sus respuestas tardan, y por eso valen la espera.'},
  {a:'warmth',b:'constancy',txt:'Tu luz se queda caliente: no se enfría cuando te vas. Eso es lo que hace que los tuyos vuelvan.'},
  {a:'vivacity',b:'clarity',txt:'Tu luz piensa rápido y bien: una combinación peligrosa en el buen sentido.'},
  {a:'steadiness',b:'warmth',txt:'Tu luz es un hogar firme: no tiembla, pero abriga.'},
  {a:'depth',b:'constancy',txt:'Tu luz recuerda hondo y no olvida: por eso pesa, y por eso sirve.'},
  {a:'wonder',b:'vivacity',txt:'Tu luz corre hacia lo que no entiende: por eso encuentra lo que otros ni buscan.'}
];

/* ═══ INVALIDACIONES (12+ por categoría) ═══ */
var INVALID={
  general:[
    'Fue pequeño. Nada de eso importó.',
    'Lo recuerdas mal. No era tan cálido.',
    'No lo merecías entonces. No lo mereces ahora.',
    'La felicidad es prestada. Siempre viene a cobrarse.',
    'Nadie más lo recuerda. Eso no es amor: es soledad con testigo único.',
    'Si fuera tan feliz, no lo habrías guardado tanto tiempo en silencio.',
    'Fue suerte. Cualquiera habría sido feliz ahí.',
    'Ya lo superaste. Soltarlo es madurar.',
    'Eso no era alegría: era ignorancia de lo que venía.',
    'Lo bonito se acaba. Lo tuyo se acabó primero.',
    'No era amor: era costumbre con buen clima.',
    'Guardas eso porque no tienes nada mejor.'
  ],
  loss:[
    'Ya no existe. Eso que sostienes es un hueco con forma.',
    'Esa persona no volvería por ti. La luz tampoco.',
    'Lloras por lo que fue, no por lo que es: eso no es amor, es archivo.',
    'El tiempo no cura: distrae. Y tú te dejaste distraer demasiado pronto.'
  ],
  wonder:[
    'Fue suerte. El asombro no es mérito: es no haber mirado bien.',
    'Lo imposible no existió. Existió tu edad.',
    'Ese brillo era un reflejo falso. Nada dura tanto tiempo.',
    'Te maravillaste porque no sabías lo suficiente. Ahora sabes: ya no brilla.'
  ],
  laughter:[
    'Fue ridículo. Nada de eso importó de verdad.',
    'La risa es un anestésico barato para olvidar lo que falta.',
    'Reíste porque no supiste hacer otra cosa con el miedo.',
    'Esa risa no era alegría: era nervios con público.'
  ]
};

/* ═══ SOSTENES ═══ */
var HOLDS=[
  {id:'apretar',tag:'Apretarlo',txt:'«Fue pequeño. Lo pequeño me mantuvo vivo.»',attr:'steadiness'},
  {id:'nombrar',tag:'Nombrarlo',txt:'«Tiene nombre. Las cosas con nombre no se borran.»',attr:'clarity'},
  {id:'compartir',tag:'Compartirlo',txt:'«No lo recuerdo solo: lo recuerdo siendo querido.»',attr:'warmth'},
  {id:'reir',tag:'Reír con él',txt:'«Sí, fue ridículo. Por eso fue mío.»',attr:'vivacity'},
  {id:'llorar',tag:'Llorarlo',txt:'«Duele porque fue real. No cambio real por cómodo.»',attr:'depth'},
  {id:'callar',tag:'Guardar silencio',txt:'(No responder. Acercar la vela un paso.)',attr:'constancy'},
  {id:'asombrar',tag:'Asombrarte de nuevo',txt:'«Tenía mi edad. Y tenía razón.»',attr:'wonder',only:'wonder'},
  {id:'pregunta',tag:'Guardar la pregunta',txt:'«No la contesté nunca. Por eso sigue viva.»',attr:'depth',only:'wonder'}
];

var JOKE_NAMES=['karla','aregash','aragash','dani'];

/* ═══════════════════════════════════════════════════════════
   AUDIO PROCEDURAL
   ═══════════════════════════════════════════════════════════ */
var audioCtx=null,droneOsc1=null,droneOsc2=null,droneGain=null,lowpassFilter=null;
var isAudioActive=false,creakTimer=null;

function initAudio(){
  if(audioCtx){ if(audioCtx.state==='suspended')audioCtx.resume(); return; }
  try{
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    audioCtx=new AC();
    droneOsc1=audioCtx.createOscillator();droneOsc1.type='triangle';droneOsc1.frequency.setValueAtTime(55,audioCtx.currentTime);
    droneOsc2=audioCtx.createOscillator();droneOsc2.type='sine';droneOsc2.frequency.setValueAtTime(110,audioCtx.currentTime);
    lowpassFilter=audioCtx.createBiquadFilter();lowpassFilter.type='lowpass';lowpassFilter.frequency.setValueAtTime(260,audioCtx.currentTime);
    droneGain=audioCtx.createGain();droneGain.gain.setValueAtTime(0.045,audioCtx.currentTime);
    droneOsc1.connect(lowpassFilter);droneOsc2.connect(lowpassFilter);
    lowpassFilter.connect(droneGain);droneGain.connect(audioCtx.destination);
    droneOsc1.start();droneOsc2.start();
    isAudioActive=true;updateSoundUI(true);
  }catch(e){}
}
function playHeartbeat(bpm){
  if(!audioCtx||!isAudioActive)return;
  try{
    var t=audioCtx.currentTime;
    var o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type='sine';o.frequency.setValueAtTime(60,t);o.frequency.exponentialRampToValueAtTime(35,t+0.12);
    g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);
    o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+0.15);
    setTimeout(function(){
      if(!audioCtx||!isAudioActive)return;
      var t2=audioCtx.currentTime;
      var o2=audioCtx.createOscillator(),g2=audioCtx.createGain();
      o2.type='sine';o2.frequency.setValueAtTime(50,t2);o2.frequency.exponentialRampToValueAtTime(30,t2+0.15);
      g2.gain.setValueAtTime(0.09,t2);g2.gain.exponentialRampToValueAtTime(0.001,t2+0.16);
      o2.connect(g2);g2.connect(audioCtx.destination);o2.start(t2);o2.stop(t2+0.17);
    },140);
  }catch(e){}
}
function playPatronusChime(freq){
  if(!audioCtx||!isAudioActive)return;
  try{
    freq=freq||523.25;
    [freq,freq*1.25,freq*1.5,freq*2].forEach(function(f,idx){
      setTimeout(function(){
        if(!audioCtx)return;
        var t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
        o.type='sine';o.frequency.setValueAtTime(f,t);
        g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.12,t+0.05);g.gain.exponentialRampToValueAtTime(0.0001,t+2.4);
        o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+2.5);
      },idx*160);
    });
  }catch(e){}
}
function setDementorSuction(active){
  if(!lowpassFilter||!audioCtx)return;
  try{
    var t=audioCtx.currentTime;
    if(active)lowpassFilter.frequency.exponentialRampToValueAtTime(110,t+0.6);
    else lowpassFilter.frequency.exponentialRampToValueAtTime(320,t+0.8);
  }catch(e){}
}
function playBlowSound(){
  if(!audioCtx)return;
  try{
    var t=audioCtx.currentTime,len=1.5;
    var buf=audioCtx.createBuffer(1,audioCtx.sampleRate*len,audioCtx.sampleRate);
    var d=buf.getChannelData(0);
    for(var i=0;i<buf.length;i++)d[i]=Math.random()*2-1;
    var src=audioCtx.createBufferSource();src.buffer=buf;
    var f=audioCtx.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(800,t);f.frequency.exponentialRampToValueAtTime(100,t+1.4);
    var g=audioCtx.createGain();g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.0001,t+1.5);
    src.connect(f);f.connect(g);g.connect(audioCtx.destination);src.start(t);
  }catch(e){}
}
function aCreak(on){
  clearInterval(creakTimer);
  if(!on||!audioCtx||!isAudioActive)return;
  creakTimer=setInterval(function(){
    try{
      var t=audioCtx.currentTime,len=.05;
      var buf=audioCtx.createBuffer(1,audioCtx.sampleRate*len,audioCtx.sampleRate);
      var d=buf.getChannelData(0);
      for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*.3));
      var s=audioCtx.createBufferSource();s.buffer=buf;
      var f=audioCtx.createBiquadFilter();f.type='bandpass';f.frequency.value=2600+Math.random()*900;f.Q.value=4;
      var g=audioCtx.createGain();g.gain.value=.02;
      s.connect(f);f.connect(g);g.connect(audioCtx.destination);s.start(t);
    }catch(e){}
  },240+Math.random()*420);
}
function updateSoundUI(active){
  var i=document.getElementById('soundIcon'),l=document.getElementById('soundLabel');
  if(i)i.textContent=active?'🔔':'🔕';
  if(l)l.textContent=active?'Mágico':'Silencio';
}

/* ═══════════════════════════════════════════════════════════
   ESTADO DE SESIÓN
   ═══════════════════════════════════════════════════════════ */
var S={
  selectedDoor:null,temperature:TEMP_OPTIONS[0],sound:SOUND_OPTIONS[0],object:OBJECT_OPTIONS[0],
  wonderQuestion:null,who:null,memoryPhrase:'',userName:'',
  frostStage:6,combatRound:0,candleHealth:3,
  chosenPatronus:null,isRareEnding:false,isJokeTriggered:false,
  lastHoldId:null,rhythmOk:true,times:[],discussed:0,holds:[],invals:[]
};
var attrs={steadiness:0,clarity:0,warmth:0,vivacity:0,depth:0,constancy:0,wonder:0};

function addAttr(a){ if(attrs[a]!==undefined)attrs[a]++; }
function dominant(){ var b='steadiness',bv=-1; for(var k in attrs){if(attrs[k]>bv){bv=attrs[k];b=k;}} return b; }
function dominantPair(){
  var s=[];for(var k in attrs){if(attrs[k]>0)s.push({k:k,v:attrs[k]});}
  s.sort(function(a,b){return b.v-a.v});
  if(s.length>=2)return[s[0].k,s[1].k];
  if(s.length===1)return[s[0].k,null];
  return[null,null];
}
function findComboLine(){
  var p=dominantPair();if(!p[0]||!p[1])return null;
  for(var i=0;i<COMBO_LINES.length;i++){var c=COMBO_LINES[i];
    if((c.a===p[0]&&c.b===p[1])||(c.a===p[1]&&c.b===p[0]))return c.txt;}
  return null;
}

/* ═══ ESCENA ═══ */
function showPhase(n){
  var ids=['panePhase1','panePhase2','panePhase3','panePhase3b','panePhase4','panePhase5','panePhase6','panePhase7','panePhase8'];
  ids.forEach(function(id){var e=document.getElementById(id);if(e)e.classList.remove('active');});
  var map={1:'panePhase1',2:'panePhase2',3:'panePhase3','3b':'panePhase3b',4:'panePhase4',5:'panePhase5',6:'panePhase6',7:'panePhase7',8:'panePhase8'};
  var pane=document.getElementById(map[n]);
  if(pane)pane.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  page.classList.remove('stage-hielo','stage-gris','stage-neutro','stage-tibio','stage-oro');
  if(n===1||n===2)page.classList.add('stage-hielo');
  else if(n===3||n==='3b'||n===4)page.classList.add('stage-gris');
  else if(n===5)page.classList.add('stage-neutro');
  else if(n===6)page.classList.add('stage-tibio');
  else page.classList.add('stage-oro');
}
function setFrost(n){ frost.className='frost-overlay f-stage-'+n; S.frostStage=n; }
function riftState(s){ rift.className='dementor-rift'+(s?' '+s:''); }
function holdGlowSet(mode){ holdGlow.className='hold-glow'+(mode?' '+mode:''); }
function candleGlow(flame,level){
  if(!flame)return;
  flame.classList.remove('glow','glow2','dim');
  if(level==='dim')flame.classList.add('dim');
  else if(level===2)flame.classList.add('glow2');
  else if(level===1)flame.classList.add('glow');
}
function candlePhraseBright(el,on){ if(el)el.classList.toggle('bright',!!on); }
function getSVG(key,hex){ hex=hex||'#c2dbff'; return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+(SVG_SHAPES[key]||SVG_SHAPES.stag).replace(/\{c\}/g,hex)+'</svg>'; }
function wait(ms,fn){ setTimeout(fn,REDUCED?Math.min(ms,400):ms); }
function showLupinMargin(txt){
  var el=document.getElementById('lupinCombatNote');
  if(el){el.style.display='block';el.innerHTML=txt;}
}
function hideLupinMargin(){
  var el=document.getElementById('lupinCombatNote');
  if(el)el.style.display='none';
}

/* ═══════════════════════════════════════════════════════════
   FASE 1 · ANTESALA
   ═══════════════════════════════════════════════════════════ */
function f1(){
  setFrost(6);riftState('');
  var rb=document.getElementById('returningBanner');
  var bb=document.getElementById('burnedBanner');
  var gn=document.getElementById('gateNote');
  var skip=document.getElementById('btnGateSkip');
  var lup=document.getElementById('lupinIntro');

  if(hasBurned){
    if(bb)bb.style.display='block';
    if(rb)rb.style.display='none';
  }else if(saved&&saved.form){
    if(rb){rb.style.display='block';rb.innerHTML='✦ '+lupinPick(['Tu luz te estaba esperando. Guarda memoria de tu visita anterior.','Algo tuyo sigue encendido aquí dentro. No se apagó cuando te fuiste.']);}
  }else if(saved&&saved.seed){
    if(rb){rb.style.display='block';rb.innerHTML='✦ Dejaste una semilla sembrada en una puerta. Si vuelves a abrirla y el recuerdo ha madurado, saldrá con forma.';}
  }

  if(b3ch<20){ if(gn)gn.style.display='block'; if(skip)skip.style.display='inline-flex'; }

  if(lup){
    lup.innerHTML='«'+(sessionMet?lupinPick(LUPIN.introReturning):lupinPick(LUPIN.intro))+'»';
  }
}

/* ═══ FASE 2 · RESPIRACIÓN ═══ */
var breathTimer=null;
function f2(){
  showPhase(2);
  var circle=document.getElementById('breathCircle');
  var text=document.getElementById('breathText');
  var count=document.getElementById('breathSeconds');
  var note=document.getElementById('breathNote');
  var btn=document.getElementById('btnDoors');
  var step=0,remaining=4,cycles=0;
  function tick(){
    count.textContent=remaining+' s';
    playHeartbeat(cycles===0?68:56);
    if(remaining>1)remaining--;
    else{
      step=(step+1)%3;
      if(step===0){cycles++;remaining=4;circle.className='breath-circle inhale';text.textContent='Inhala profundamente…';}
      else if(step===1){remaining=4;circle.className='breath-circle hold';text.textContent='Sostén el aire…';}
      else{remaining=6;circle.className='breath-circle exhale';text.textContent='Exhala con lentitud…';}
    }
    if(cycles>=2&&step===2&&remaining<=2){
      clearInterval(breathTimer);
      text.textContent='Calma asentada.';count.textContent='✓';
      if(note){note.style.display='block';note.innerHTML='«'+lupinPick(LUPIN.breath)+'»';}
      if(btn)btn.style.display='inline-flex';
    }
  }
  circle.className='breath-circle inhale';text.textContent='Inhala profundamente…';remaining=4;
  tick();breathTimer=setInterval(tick,1000);
}

/* ═══ FASE 3 · PUERTAS ═══ */
function f3(){
  showPhase(3);
  riftState('approaching');setDementorSuction(true);
  var lead=document.getElementById('doorsLead');
  if(lead)lead.textContent=lupinPick(LUPIN.doors);
  var grid=document.getElementById('doorsGrid');
  grid.innerHTML=DOORS.map(function(d){
    return '<div class="door-card" data-id="'+d.id+'">'
      +'<div class="door-num">Puerta '+d.id+'</div>'
      +'<div class="door-title">'+d.t+'</div>'
      +'<div class="door-desc">'+d.d+'</div>'
      +'<div class="door-poem">'+d.p+'</div>'
      +'</div>';
  }).join('');
  Array.prototype.forEach.call(grid.querySelectorAll('.door-card'),function(card){
    card.addEventListener('click',function(){
      Array.prototype.forEach.call(grid.querySelectorAll('.door-card'),function(c){c.classList.remove('selected')});
      card.classList.add('selected');
      S.selectedDoor=DOORS.filter(function(x){return x.id==card.dataset.id})[0];
      var b=document.getElementById('btnAnchors');
      if(b){b.removeAttribute('disabled');b.style.opacity='1';b.style.cursor='pointer';}
    });
  });
}

/* ═══ FASE 3b · MICRO-ESCENA ═══ */
function f3b(){
  showPhase('3b');
  var d=S.selectedDoor;
  document.getElementById('sceneKicker').textContent='Puerta '+d.id+' de 14';
  document.getElementById('sceneTitle').textContent=d.t;
  document.getElementById('sceneText').innerHTML=d.sc.map(function(l){return '<p>'+l+'</p>';}).join('');
}

/* ═══ FASE 4 · ANCLAJES ═══ */
function f4(){
  showPhase(4);
  var lead=document.getElementById('anchorsLead');
  if(lead)lead.textContent=lupinPick(LUPIN.anchors);
  var door=S.selectedDoor||{tags:[],tintT:[],tintS:[]};

  function renderGroup(gridId,baseOpts,tinted,onPick){
    var grid=document.getElementById(gridId);
    var opts=baseOpts.concat(tinted||[]);
    grid.innerHTML=opts.map(function(o,i){
      return '<button type="button" class="option-btn'+(o.tint?' tint':'')+(i===0&&!o.tint?' selected':'')+'" data-idx="'+i+'">'+o.text+'</button>';
    }).join('');
    Array.prototype.forEach.call(grid.querySelectorAll('.option-btn'),function(b){
      b.addEventListener('click',function(){
        Array.prototype.forEach.call(grid.querySelectorAll('.option-btn'),function(x){x.classList.remove('selected')});
        b.classList.add('selected');
        onPick(opts[+b.dataset.idx]);
      });
    });
  }

  renderGroup('tempGrid',TEMP_OPTIONS,(door.tintT||[]).map(function(t){
    var base=TEMP_OPTIONS[t.id];
    return {id:t.id,text:t.label,hue:base.hue,tone:base.tone,note:base.note,tint:true};
  }),function(p){S.temperature=p;updateAtmosphere(p.hue);});

  renderGroup('soundGrid',SOUND_OPTIONS,(door.tintS||[]).map(function(t){
    var base=SOUND_OPTIONS[t.id];
    return {id:t.id,text:t.label,pace:base.pace,tint:true};
  }),function(p){S.sound=p;checkWonder();});

  renderGroup('objectGrid',OBJECT_OPTIONS,null,function(p){S.object=p;checkWonder();});

  var extras=[];
  (door.tags||[]).forEach(function(tg){if(WHO_EXTRA[tg])extras=extras.concat(WHO_EXTRA[tg]);});
  renderGroup('whoGrid',WHO_BASE.concat(extras),null,function(p){S.who=p;addAttr(p.attr);});

  renderGroup('wonderGrid',WONDER_QUESTIONS.map(function(w){return {text:'«'+w.text+'»',creature:w.creature};}),null,function(p){S.wonderQuestion=p;});

  updateAtmosphere(S.temperature.hue);
  checkWonder();

  var freeInput=document.getElementById('freeMemoryText');
  var lupinSlow=document.getElementById('lupinSlow');
  var idle=null,fast=0,last=0;
  freeInput.oninput=function(){
    clearTimeout(idle);
    var now=Date.now();
    if(now-last<90)fast++;else fast=Math.max(0,fast-1);
    last=now;
    if(fast>14){fast=0;lupinSlow.style.display='block';lupinSlow.innerHTML='«'+lupinPick(LUPIN.anchorSlow)+'»';}
    idle=setTimeout(function(){
      if(freeInput.value.trim().length>0){lupinSlow.style.display='block';lupinSlow.innerHTML='«'+lupinPick(LUPIN.anchorSlow)+'»';}
    },18000);
  };
}
function checkWonder(){
  var sec=document.getElementById('wonderSection');
  var isDoor13=S.selectedDoor&&S.selectedDoor.id===13;
  var isPure=S.sound&&S.sound.text.indexOf('Silencio bueno')!==-1&&S.object&&S.object.isPerson;
  if(isDoor13||isPure){sec.style.display='block';if(!S.wonderQuestion)S.wonderQuestion=WONDER_QUESTIONS[0];}
  else{sec.style.display='none';S.wonderQuestion=null;}
}
function updateAtmosphere(hex){document.documentElement.style.setProperty('--pat-glow-color',hex);}

/* ═══ FASE 5 · SILENCIO ═══ */
function f5(){
  showPhase(5);
  var phraseEl=document.getElementById('silencePhrase');
  if(phraseEl)phraseEl.textContent='«'+S.memoryPhrase+'»';
  var instr=document.getElementById('silenceInstruction');
  if(instr)instr.textContent=lupinPick(LUPIN.silence);
  aCreak(true);
  riftState('approaching');setDementorSuction(true);
  var clock=document.getElementById('silenceClock');
  var remaining=REDUCED?3:10;
  clock.textContent=remaining+' s';
  var t=setInterval(function(){
    remaining--;clock.textContent=remaining+' s';
    if(remaining<=0){clearInterval(t);aCreak(false);f6start();}
  },1000);
}

/* ═══ FASE 6 · COMBATE ═══ */
function pickInvals(){
  var door=S.selectedDoor||{};var tag='general';
  (door.tags||[]).forEach(function(t){
    if(t==='loss')tag='loss';else if(t==='wonder')tag='wonder';else if(t==='laughter')tag='laughter';
  });
  var pool=(INVALID[tag]||INVALID.general).slice();
  var genPool=INVALID.general.slice();
  var out=[];
  for(var i=0;i<3;i++){
    var src=(i===0&&pool.length)?pool:((pool.length&&Math.random()<0.6)?pool:genPool);
    if(!src.length)src=genPool;
    out.push(src.splice(Math.floor(Math.random()*src.length),1)[0]);
  }
  return out;
}
function f6start(){
  S.combatRound=1;S.candleHealth=3;S.invals=pickInvals();
  showPhase(6);
  var phraseEl=document.getElementById('combatPhrase');
  if(phraseEl)phraseEl.textContent='«'+S.memoryPhrase+'»';
  candleGlow(document.getElementById('combatFlame'),1);
  if(sessionMet){
    riftState('hesitant');
    showLupinMargin('«Te recuerda. Se detiene un paso antes. Bien: el miedo también debe tener memoria.»');
    wait(2400,function(){riftState('approaching');hideLupinMargin();renderRound();});
  }else{
    riftState('approaching');renderRound();
  }
  sessionMet=true;
}
function renderRound(){
  var rl=document.getElementById('combatRoundLabel');
  if(rl)rl.textContent='Asalto '+S.combatRound+' de 3';
  setDementorSuction(true);
  var msg=S.invals[(S.combatRound-1)%S.invals.length];
  var w=document.getElementById('dementorWhisper');
  if(w){w.classList.add('distorted');w.textContent='«'+msg+'»';}
  var isWonder=INVALID.wonder.indexOf(msg)!==-1;
  var objName=(S.object&&S.object.text)?S.object.text.toLowerCase():'eso';
  var sustains=HOLDS.filter(function(h){return h.only?(isWonder&&h.only==='wonder'):true;}).map(function(h){
    var txt=h.txt;
    if(h.id==='nombrar')txt='«Se llama '+objName+'. Las cosas con nombre no se borran.»';
    return {id:h.id,tag:h.tag,txt:txt};
  });
  sustains.push({id:'trap',tag:'Discutirle',txt:'«¡Te equivocas! ¡Fue importante porque yo lo digo!»',trap:true});
  var grid=document.getElementById('sustainGrid');
  grid.innerHTML=sustains.map(function(s){
    return '<button class="sustain-btn'+(s.trap?' btn-trap':'')+'" data-id="'+s.id+'" data-trap="'+(s.trap?'1':'0')+'">'
      +'<span class="action-tag">'+s.tag+'</span><span class="action-phrase">'+s.txt+'</span></button>';
  }).join('');
  Array.prototype.forEach.call(grid.querySelectorAll('.sustain-btn'),function(b){
    b.addEventListener('click',function(){resolveHold(b.dataset.trap==='1',b.dataset.id);});
  });
}
function resolveHold(isTrap,holdId){
  var flame=document.getElementById('combatFlame');
  var phraseEl=document.getElementById('combatPhrase');
  var health=document.getElementById('combatHealth');

  if(isTrap){
    S.discussed++;
    candleGlow(flame,'dim');
    candlePhraseBright(phraseEl,false);
    holdGlowSet('');
    riftState('approaching');setDementorSuction(true);
    S.candleHealth=Math.max(1,S.candleHealth-1);
    if(health)health.textContent='Vela: Parpadea, no se apaga';
    showLupinMargin('«'+lupinPick(LUPIN.combat)+'»');
    S.combatRound++;
    wait(1800,function(){hideLupinMargin();if(S.combatRound<=3)renderRound();else endCombat();});
    return;
  }

  var hold=HOLDS.filter(function(h){return h.id===holdId})[0]||HOLDS[0];
  addAttr(hold.attr);
  S.holds.push(holdId);S.lastHoldId=holdId;
  holdGlowSet(S.holds.length>=3?'strong':'on');
  setDementorSuction(false);
  setFrost(Math.max(0,6-S.holds.length*2));
  candleGlow(flame,S.holds.length>=3?2:1);
  candlePhraseBright(phraseEl,S.holds.length>=2);
  if(health){
    health.textContent=S.candleHealth===3?'Vela: Viva y encendida':(S.candleHealth===2?'Vela: Arde con fuerza':'Vela: Parpadea, no se apaga');
  }
  var post=LUPIN.holdPost[holdId];
  showLupinMargin('«'+lupinPick(post||['Bien sostenido.'])+'»');

  var delay=holdId==='callar'?2400:1600;
  wait(delay,function(){
    holdGlowSet('');hideLupinMargin();
    S.combatRound++;
    if(S.combatRound<=3)renderRound();else endCombat();
  });
}
function endCombat(){riftState('retreating');wait(900,f7);}

/* ═══ FASE 7 · INVOCACIÓN ═══ */
function f7(){
  showPhase(7);
  var phraseEl=document.getElementById('incantPhrase');
  if(phraseEl)phraseEl.textContent='«'+S.memoryPhrase+'»';
  setDementorSuction(true);
  var input=document.getElementById('incantInput');
  var btn=document.getElementById('btnCast');
  var noteEl=document.getElementById('incantNote');
  S.times=[];
  input.value='';input.focus();
  if(noteEl)noteEl.textContent=REDUCED?lupinPick(LUPIN.reduced):'Pulso de calma: medido';
  input.addEventListener('keydown',function(){S.times.push(Date.now());});
  input.addEventListener('input',function(){
    if(input.value.trim().toUpperCase()==='EXPECTO PATRONUM'){
      var ok=true;
      if(!REDUCED&&S.times.length>3){
        var ivs=[];for(var i=1;i<S.times.length;i++)ivs.push(S.times[i]-S.times[i-1]);
        ivs.sort(function(a,b){return a-b});
        var med=ivs[Math.floor(ivs.length/2)];
        ok=med>=240&&med<=950;
      }
      S.rhythmOk=ok;
      input.classList.add('lit');
      if(noteEl)noteEl.textContent=ok?'Pulso de calma: sereno':lupinPick(LUPIN.haste);
      if(btn){btn.removeAttribute('disabled');btn.style.opacity='1';btn.style.cursor='pointer';}
    }
  });
  var clean=(S.userName||'').toLowerCase().trim();
  S.isJokeTriggered=JOKE_NAMES.some(function(n){return clean.indexOf(n)!==-1});
}

/* ═══ CÁLCULO DE FORMA ═══ */
function calculatePatronus(){
  if(S.wonderQuestion&&S.wonderQuestion.creature)return TAXONOMY[S.wonderQuestion.creature];
  var door=S.selectedDoor;
  if(!door)return TAXONOMY.ciervo;
  var houseMap={G:'leon',S:'serpiente',R:'aguila',H:'tejonCasa'};
  var need={G:['steadiness','depth'],S:['clarity','vivacity'],R:['clarity','depth','wonder'],H:['warmth','constancy']};
  if(door.house){
    var sc=0;need[door.house].forEach(function(a){sc+=attrs[a]||0;});
    if(sc>=1)return TAXONOMY[houseMap[door.house]];
  }
  var best=null,bestS=-1;
  door.forms.forEach(function(id){
    var f=TAXONOMY[id];if(!f)return;
    var s=0;(f.aff||[]).forEach(function(a){s+=(attrs[a]||0)*2;});
    s+=Math.random();
    if(s>bestS){bestS=s;best=id;}
  });
  return TAXONOMY[best]||TAXONOMY.ciervo;
}

/* ═══ REVELACIÓN (4 FINALES + BROMA) ═══ */
function revealFinal(){
  S.chosenPatronus=calculatePatronus();

  // Broma para Karla, Aragash o Dani
  if(S.isJokeTriggered){
    var jokeBox=document.getElementById('jokePanel');
    var incantBox=document.getElementById('incantBox');
    var castBtn=document.getElementById('btnCast');
    if(incantBox)incantBox.style.display='none';
    if(castBtn)castBtn.style.display='none';
    if(jokeBox)jokeBox.style.display='block';
    return;
  }

  var sensory=(S.temperature?1:0)+(S.sound?1:0)+(S.object?1:0);
  var isPerson=S.object&&S.object.isPerson;
  var isLossDoor=S.selectedDoor&&(S.selectedDoor.id===2||S.selectedDoor.id===6||S.selectedDoor.id===9);
  S.isRareEnding=isPerson&&isLossDoor;
  var fam=S.chosenPatronus.fam;

  var final;
  if(S.discussed>=2||sensory<2)final='notready';
  else if(fam==='creature'&&!(attrs.wonder>0||attrs.constancy>0))final='seed';
  else if(!S.rhythmOk)final='seed';
  else if(S.isRareEnding)final='face';
  else final='corporeal';

  if(final==='seed'&&saved&&saved.seed&&saved.seed.door===(S.selectedDoor&&S.selectedDoor.id))final='corporeal';

  setDementorSuction(false);riftState('retreating');

  if(final==='notready'){
    var nr=document.getElementById('notReadyNote');
    if(nr){nr.style.display='block';nr.querySelector('p').textContent=lupinPick(LUPIN.notready);}
    document.getElementById('incantBox').style.display='none';
    document.getElementById('btnCast').style.display='none';
    persist({seed:{door:S.selectedDoor.id},firstWords:firstWords(),burned:false});
    return;
  }
  if(final==='seed'){
    var sn=document.getElementById('seedNote');
    if(sn){sn.style.display='block';sn.querySelector('p').textContent=lupinPick(LUPIN.seed);}
    document.getElementById('incantBox').style.display='none';
    document.getElementById('btnCast').style.display='none';
    playPatronusChime(S.temperature.note);
    persist({seed:{door:S.selectedDoor.id,form:keyOf(S.chosenPatronus)},firstWords:firstWords(),burned:false});
    return;
  }
  if(final==='face'){
    var rf=document.getElementById('rareFace');
    if(rf){rf.style.display='block';rf.querySelector('p').textContent='«'+lupinPick(LUPIN.face)+'»';}
    playPatronusChime(S.temperature.note);
    wait(2600,function(){proceedToCard('face');});
    return;
  }
  proceedToCard('corporeal');
}
function keyOf(pat){for(var k in TAXONOMY){if(TAXONOMY[k]===pat)return k;}return 'ciervo';}
function firstWords(){return (S.memoryPhrase||'').trim().split(/\s+/).slice(0,3).join(' ');}

/* ═══ FASE 8 · TARJETA ═══ */
function proceedToCard(mode){
  showPhase(8);
  playPatronusChime(S.temperature.note||523.25);
  if(window.fireGoldenSparks)window.fireGoldenSparks();
  setFrost(0);

  var pat=S.chosenPatronus||TAXONOMY.ciervo;
  var dom=dominant();
  var words=firstWords();
  var combo=findComboLine();
  var sigName=S.userName||'Lector de la Sucursal';

  document.getElementById('cardName').textContent=pat.name;
  var famEl=document.getElementById('cardFamily');
  famEl.textContent=pat.famLabel;
  famEl.className='patronus-card-family '+pat.fam;
  document.getElementById('cardSvg').innerHTML=getSVG(pat.svg,S.temperature.hue);
  document.getElementById('cardQuote').textContent='«'+pat.why+' '+ATTR_WHY[dom]+'»';
  document.getElementById('cardWick').textContent=words?'«'+words+'…»':'«La luz que no se apaga…»';
  document.getElementById('cardAnchors').innerHTML='<span>'+S.temperature.text+'</span><span>·</span><span>'+S.sound.text+'</span><span>·</span><span>'+S.object.text+'</span>';
  var whoEl=document.getElementById('cardWho');
  whoEl.innerHTML=S.who?'En ese recuerdo eras '+S.who.label.toLowerCase()+'. Tu luz es '+ATTR_NAME[dom]+'.':'';

  var comboEl=document.getElementById('cardCombo');
  if(combo){comboEl.style.display='block';comboEl.innerHTML='<b style="color:#c2dbff;display:block;margin-bottom:6px;font-style:normal">Combinación rara:</b>'+combo;}

  var lupEl=document.getElementById('cardLupin');
  var msgs=[];
  if(S.lastHoldId&&LUPIN.holdPost[S.lastHoldId])msgs.push(lupinPick(LUPIN.holdPost[S.lastHoldId]));
  var houseMsg=houseNote(pat,sigName);
  if(houseMsg)msgs.push(houseMsg);
  if(mode==='face')msgs.push(lupinPick(LUPIN.face));
  if(msgs.length){lupEl.style.display='block';lupEl.innerHTML=msgs.map(function(m){return '«'+m+'»';}).join('<br>');}

  document.getElementById('cardSignature').textContent='Invocado por '+sigName+' · Club Olor a Libros';

  persist({
    form:keyOf(pat),fam:pat.fam,corporeal:true,seed:null,
    firstWords:words,who:S.who&&S.who.label,dom:dom,combo:combo,
    sensory:[S.temperature.hue,S.sound.text,S.object.text],
    lastHold:S.lastHoldId,userName:sigName,burned:false,
    date:new Date().toISOString()
  });
}
function houseNote(pat,sigName){
  if(!house)return '';
  var hShort=house.charAt(0).toUpperCase();
  if(pat.fam==='house'&&(pat.houseKey===house||pat.houseKey===hShort)){
    return 'Curioso: tu luz lleva el mismo emblema que tu casa, '+sigName+'. No es que la casa te diera el recuerdo, aprendiz. Es que el recuerdo ya era de esa casa mucho antes de que tú lo supieras.';
  }
  if(pat.fam==='house'){
    return 'Tu casa te dio techo en Hogwarts. Tu recuerdo te dio forma ante el Dementor. No siempre son la misma habitación, y eso es exactamente lo que te hace entero.';
  }
  return '';
}

/* ═══ PERSISTENCIA ═══ */
function persist(o){
  var base=saved||{};for(var k in o)base[k]=o[k];saved=base;
  try{localStorage.setItem(KEY,JSON.stringify(base));}catch(e){}
  try{localStorage.removeItem(BURNED_KEY);}catch(e){}
}

/* ═══ REENCUENTRO ═══ */
function reencounter(){
  var pat=TAXONOMY[saved.form]||TAXONOMY.ciervo;
  var hex=(saved.sensory&&saved.sensory[0])||'#c2dbff';
  waiting.innerHTML=getSVG(pat.svg,hex);
  waiting.className='waiting-patronus on wink';
  showPhase(8);
  S.temperature={text:(saved.sensory&&saved.sensory[1])||'—',hue:hex,note:523.25};
  S.sound={text:(saved.sensory&&saved.sensory[2])||'—'};
  S.object={text:'—'};
  S.memoryPhrase=saved.firstWords||'';
  S.userName=saved.userName||'';
  S.who=saved.who?{label:saved.who}:null;
  if(saved.dom)attrs[saved.dom]=3;
  S.lastHoldId=saved.lastHold||null;
  S.chosenPatronus=pat;
  proceedToCardRe(saved);
}
function proceedToCardRe(sv){
  var pat=TAXONOMY[sv.form]||TAXONOMY.ciervo;
  document.getElementById('cardName').textContent=pat.name;
  var famEl=document.getElementById('cardFamily');
  famEl.textContent=pat.famLabel;famEl.className='patronus-card-family '+pat.fam;
  document.getElementById('cardSvg').innerHTML=getSVG(pat.svg,(sv.sensory&&sv.sensory[0])||'#c2dbff');
  document.getElementById('cardQuote').textContent='«'+pat.why+' '+(ATTR_WHY[sv.dom]||ATTR_WHY.steadiness)+'»';
  document.getElementById('cardWick').textContent=sv.firstWords?'«'+sv.firstWords+'…»':'«La luz que no se apaga…»';
  document.getElementById('cardAnchors').innerHTML='<span>'+((sv.sensory&&sv.sensory[1])||'—')+'</span><span>·</span><span>'+((sv.sensory&&sv.sensory[2])||'—')+'</span>';
  var whoEl=document.getElementById('cardWho');
  whoEl.innerHTML=sv.who?'En ese recuerdo eras '+sv.who.toLowerCase()+'. Tu luz es '+ATTR_NAME[sv.dom||'steadiness']+'.':'';
  var comboEl=document.getElementById('cardCombo');
  if(sv.combo){comboEl.style.display='block';comboEl.innerHTML='<b style="color:#c2dbff;display:block;margin-bottom:6px;font-style:normal">Combinación rara:</b>'+sv.combo;}
  var lupEl=document.getElementById('cardLupin');
  var msgs=[lupinPick(LUPIN.waiting)];
  if(sv.lastHold&&LUPIN.holdPost[sv.lastHold])msgs.push(lupinPick(LUPIN.holdPost[sv.lastHold]));
  lupEl.style.display='block';
  lupEl.innerHTML=msgs.map(function(m){return '«'+m+'»';}).join('<br>');
  document.getElementById('cardSignature').textContent='Invocado por '+(sv.userName||'Lector de la Sucursal')+' · Club Olor a Libros';
}

/* ═══ COPIAR / QUEMAR ═══ */
function copyTestimony(){
  var pat=S.chosenPatronus||TAXONOMY.ciervo;
  var dom=dominant();
  var combo=findComboLine();
  var words=firstWords();
  var txt='✦ Mi Patronus en Olor a Libros: '+pat.name+' ('+pat.famLabel+')\n'
    +'«'+pat.why+' '+ATTR_WHY[dom]+'»\n'
    +'Mecha del recuerdo: «'+words+'…»\n'
    +'Anclajes: '+S.temperature.text+' · '+S.sound.text+' · '+S.object.text+'\n'
    +(combo?'Combinación rara: '+combo+'\n':'')
    +'— Sucursal de Hogwarts · Libro III';
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){if(window.toastMsg)window.toastMsg('✨ Testimonio copiado');else alert('¡Testimonio copiado al portapapeles!');}).catch(function(){alert(txt);});
  }else{
    var ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');if(window.toastMsg)window.toastMsg('✨ Testimonio copiado');else alert('¡Testimonio copiado!');}catch(e){}
    document.body.removeChild(ta);
  }
}
function burnMemory(){
  if(!confirm('¿Deseas quemar este recuerdo? Se borrará todo rastro íntimo del navegador con un soplido ritual, respetando tu privacidad.'))return;
  try{localStorage.removeItem(KEY);localStorage.setItem(BURNED_KEY,'1');}catch(e){}
  playBlowSound();
  alert('Tu recuerdo ha sido consumido por la ceniza. Queda guardado únicamente donde nadie más puede tocarlo: en tu memoria.');
  window.location.reload();
}

/* ═══ ARRANQUE ═══ */
document.addEventListener('DOMContentLoaded',function(){
  f1();

  var nameInp=document.getElementById('inputUserName');
  var prevName=null;try{prevName=localStorage.getItem(NAME_KEY)||localStorage.getItem('hpoal_user_name');}catch(e){}
  if(prevName&&nameInp)nameInp.value=prevName;

  document.getElementById('btnStart').addEventListener('click',function(){initAudio();f2();});
  document.getElementById('btnGateSkip').addEventListener('click',function(){initAudio();f2();});
  document.getElementById('btnDoors').addEventListener('click',function(){f3();});
  document.getElementById('btnAnchors').addEventListener('click',function(){f3b();});
  document.getElementById('btnSceneGo').addEventListener('click',function(){f4();});
  document.getElementById('btnSilence').addEventListener('click',function(){
    var raw=(document.getElementById('freeMemoryText').value||'').trim();
    if(!raw){alert('Por favor escribe al menos una frase para darle mecha a tu recuerdo.');return;}
    S.memoryPhrase=raw;
    if(nameInp&&nameInp.value.trim()){S.userName=nameInp.value.trim();try{localStorage.setItem(NAME_KEY,S.userName);}catch(e){}}
    f5();
  });
  document.getElementById('btnCast').addEventListener('click',function(){revealFinal();});
  document.getElementById('btnCopy').addEventListener('click',copyTestimony);
  document.getElementById('btnBurn').addEventListener('click',burnMemory);
  document.getElementById('btnRevealJoke').addEventListener('click',function(){
    playPatronusChime(783.99);
    var jokeBox=document.getElementById('jokePanel');
    if(jokeBox){
      jokeBox.innerHTML='<div style="font-size:2rem;margin-bottom:8px">✨⚡</div><div class="lupin-margin" style="border-left-color:#fcedba;color:#fff">«¡Ah! Ya comprendo... Al parecer tienes la mente inclinada hacia ese sentido... pero la niebla se disipa: tu verdadero Patronus es este:»</div>';
    }
    wait(2000,function(){proceedToCard('corporeal');});
  });

  var sndBtn=document.getElementById('soundToggleBtn');
  sndBtn.addEventListener('click',function(){
    if(!audioCtx)initAudio();
    else{
      isAudioActive=!isAudioActive;
      if(droneGain)droneGain.gain.setValueAtTime(isAudioActive?0.045:0.0001,audioCtx.currentTime);
      updateSoundUI(isAudioActive);
    }
  });

  if(saved&&saved.form&&!saved.burned){reencounter();}
});

})();
