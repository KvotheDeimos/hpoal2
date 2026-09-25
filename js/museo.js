/* ═══════════════════════════════════════════════════════════
   js/museo.js — Museo de la Relectura (Snitch + 4 vitrinas)
   Dependencias: js/data.js (BEANS) y js/ui.js ($, $$, chime, toastMsg)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var domeUp = false, caught = false, flyT = null;

  function snd(name) {
    var s = window.SucursalSound;
    if (s && typeof s[name] === 'function') { s[name](); }
    else if (s && typeof s.chime === 'function') { s.chime(); }
  }

  /* Keyframes de aleteo (una sola vez) */
  if (!document.getElementById('mus-kf')) {
    var st = document.createElement('style');
    st.id = 'mus-kf';
    st.textContent = '@keyframes flapL{from{transform:rotate(16deg)}to{transform:rotate(-20deg)}}@keyframes flapR{from{transform:rotate(-16deg)}to{transform:rotate(20deg)}}';
    document.head.appendChild(st);
  }

  /* ── SVG de la varita doblada (sustituye al emoji 🪄 que no se renderiza) ── */
  var WAND_BENT = '<svg viewBox="0 0 64 64" style="width:70%;height:70%;display:block;margin:auto;filter:drop-shadow(0 2px 4px rgba(0,0,0,.7))">'
    + '<path d="M15 52 L36 30 Q43 42 47 27 L54 12" stroke="#b38a5a" stroke-width="7" stroke-linecap="round" fill="none"/>'
    + '<path d="M15 52 L36 30 Q43 42 47 27 L54 12" stroke="#8a6833" stroke-width="3" stroke-linecap="round" fill="none" opacity=".5"/>'
    + '<circle cx="54" cy="12" r="3" fill="#ffd700"/>'
    + '<circle cx="59" cy="7" r="1.8" fill="#ffd700" opacity=".9"/>'
    + '<circle cx="47" cy="5" r="1.5" fill="#ffd700" opacity=".85"/>'
    + '<circle cx="60" cy="19" r="1.4" fill="#ffd700" opacity=".7"/>'
    + '<circle cx="42" cy="8" r="1.2" fill="#ffec99" opacity=".6"/>'
    + '</svg>';

  /* ── SVG de la Snitch (alas más rápidas si está agitada/volando) ── */
  function SNITCH(ag) {
    var d = ag ? '.09s' : '.28s';
    return '<svg viewBox="0 0 240 120" style="width:100%;height:100%;overflow:visible">'
      + '<defs><radialGradient id="sg" cx="35%" cy="35%" r="65%"><stop offset="0%" stop-color="#fff"/><stop offset="25%" stop-color="#fff2a1"/><stop offset="55%" stop-color="#d49b20"/><stop offset="85%" stop-color="#875608"/><stop offset="100%" stop-color="#4a2a02"/></radialGradient>'
      + '<linearGradient id="ws" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,.95)"/><stop offset="60%" stop-color="rgba(240,245,255,.7)"/><stop offset="100%" stop-color="rgba(255,255,255,.1)"/></linearGradient></defs>'
      + '<g style="transform-origin:105px 60px;animation:flapL ' + d + ' ease-in-out infinite alternate"><path d="M105,60 C85,35 45,20 8,30 C35,42 65,48 105,60 Z" fill="url(#ws)" stroke="#fff"/><path d="M105,60 C88,48 55,42 24,52 C48,60 75,62 105,60 Z" fill="url(#ws)" stroke="#fff" stroke-width=".8"/><circle cx="105" cy="60" r="3.5" fill="#caa96a"/></g>'
      + '<g style="transform-origin:135px 60px;animation:flapR ' + d + ' ease-in-out infinite alternate"><path d="M135,60 C155,35 195,20 232,30 C205,42 175,48 135,60 Z" fill="url(#ws)" stroke="#fff"/><path d="M135,60 C152,48 185,42 216,52 C192,60 165,62 135,60 Z" fill="url(#ws)" stroke="#fff" stroke-width=".8"/><circle cx="135" cy="60" r="3.5" fill="#caa96a"/></g>'
      + '<circle cx="120" cy="60" r="22" fill="url(#sg)" stroke="#ffefba" stroke-width="1.2"/>'
      + '<path d="M104,50 Q120,40 136,50 Q120,60 104,70" fill="none" stroke="#593707" stroke-width="1.2" opacity=".8"/>'
      + '<path d="M102,60 Q120,74 138,60" fill="none" stroke="#593707" stroke-width="1.2" opacity=".8"/>'
      + '<circle cx="120" cy="56" r="3" fill="#ffeaa7"/><circle cx="112" cy="50" r="3.5" fill="#fff" opacity=".85"/></svg>';
  }

  /* ── Pieza central: la Snitch bajo campana ── */
  function renderMain() {
    var host = document.getElementById('musMain'); if (!host) return;
    stopFly();
    host.innerHTML = '<div class="mus-stage">'
      + '<div class="mus-warn" id="musWarn">⚠️ ¡Por favor, no golpee el cristal! Perturba a la Snitch.</div>'
      + (!domeUp
        ? '<div class="mus-dome" id="musDome" title="Toca la campana para verla aletear">' + SNITCH(false) + '<div class="mus-cushion"><i></i><i></i><i></i><i></i></div></div><div class="mus-plinth"><b>Snitch dorada · 1991</b></div>'
        : (caught
          ? '<div class="mus-caught"><div style="font-size:2rem">🏆</div><h4>¡HAS ATRAPADO LA SNITCH!</h4><p>«Me abro al término»</p><p style="font:italic .78rem \'EB Garamond\',serif;color:#c8bfb0;margin-top:8px">¡150 puntos simbólicos para el Club de Relectura! Tus reflejos son dignos de la primera victoria de Gryffindor en 1991.</p><button class="mus-btn" id="musReturn" style="margin-top:14px">Devolver a la vitrina</button></div>'
          : '<div class="mus-fly"><span class="lab">✨ ¡LA SNITCH ESTÁ LIBRE! ¡HAZ CLIC PARA ATRAPARLA! ✨</span><div class="mus-flysnitch" id="musFlyS" style="left:50%;top:50%">' + SNITCH(true) + '</div></div>'))
      + '</div>'
      + '<div class="mus-info"><h3>La Snitch Dorada</h3>'
      + '<span class="mus-tag">Modelo con memoria táctil original</span>'
      + '<p>Fabricada por Bowman Wright en el siglo XIV. No fue tocada con piel humana antes de su primer partido, para que recordara para siempre al primer buscador que la atrapara con la boca en su debut.</p>'
      + '<div class="mus-quote">«Me abro al término. Si levantas la campana de cristal, la Snitch saldrá volando y tendrás que poner a prueba tus reflejos.»</div>'
      + '<button class="mus-btn" id="musLift">' + (domeUp && !caught ? 'Regresar la Snitch a la Vitrina' : 'Levantar la Cúpula de Cristal') + '</button></div>';

    var dome = document.getElementById('musDome');
    if (dome) dome.addEventListener('click', tapGlass);
    document.getElementById('musLift').addEventListener('click', toggleDome);
    var ret = document.getElementById('musReturn'); if (ret) ret.addEventListener('click', toggleDome);
    var fs = document.getElementById('musFlyS'); if (fs) fs.addEventListener('click', catchSnitch);
    if (domeUp && !caught) startFly();
  }

  function tapGlass() {
    if (domeUp) return;
    snd('glass');
    var d = document.getElementById('musDome');
    if (d) { d.classList.add('hit'); setTimeout(function () { d.classList.remove('hit'); }, 1400); }
    var w = document.getElementById('musWarn');
    if (w) { w.classList.add('on'); setTimeout(function () { w.classList.remove('on'); }, 3200); }
  }
  function toggleDome() { snd('chime'); domeUp = !domeUp; caught = false; renderMain(); }
  function catchSnitch() { snd('bell'); caught = true; renderMain(); if (window.fireGoldenSparks) window.fireGoldenSparks(); }
  function startFly() {
    stopFly();
    flyT = setInterval(function () {
      var fs = document.getElementById('musFlyS'); if (!fs) return;
      fs.style.left = (15 + Math.random() * 70) + '%';
      fs.style.top = (20 + Math.random() * 60) + '%';
    }, 1800);
  }
  function stopFly() { if (flyT) { clearInterval(flyT); flyT = null; } }

  /* ── Las 4 vitrinas secundarias (con la varita doblada ya dibujada como SVG) ── */
  function renderGrid() {
    var g = document.getElementById('musGrid'); if (!g) return;
    g.innerHTML =
      '<div class="mus-card"><div><div class="mus-ico">🍬</div><h4>Grageas Bertie Bott</h4><p>Un riesgo en cada bocado. ¿Te atreves a sacar una?</p><div id="beanOut"></div></div><button class="mus-mini" id="beanBtn">Probar una gragea →</button></div>'
      + '<div class="mus-card"><div><div class="mus-ico" style="background:#3d3318">🍋</div><h4>Exhibición A: El Limón</h4><p>Del célebre incidente en la tienda de varitas. Prohibido exprimir.</p><div id="lemonOut"></div></div><button class="mus-mini" id="lemonBtn" style="background:#3a301c">Tocar con cuidado →</button></div>'
      + '<div class="mus-card"><div><div class="mus-ico" style="background:#2a1c38">' + WAND_BENT + '</div><h4>La Varita Doblada</h4><p>Agitada como sartén en el capítulo 5. Ollivander aún no lo supera.</p><div class="mus-out" style="animation:none;border-color:rgba(138,104,51,.4);color:#a79bb5">Madera de espino · núcleo de dragón chamuscado</div></div><span class="mus-mini" style="opacity:.5;cursor:default">No se toca · orden de Ollivander</span></div>'
      + '<div class="mus-card"><div><div class="mus-ico" style="background:#1b2b38">📖</div><h4>El Ejemplar de 1999</h4><p>347 subrayados, lomo de celofán y 12 esquinas dobladas con orgullo.</p></div><button class="mus-mini" id="bookBtn" style="background:#1e2f3d">Abrir dedicatoria →</button></div>';

    document.getElementById('beanBtn').addEventListener('click', function () {
      snd('spark');
      var beans = (typeof window !== 'undefined' && window.BEANS) ? window.BEANS : ((typeof BEANS !== 'undefined') ? BEANS : []);
      if (!beans.length) return;
      var b = beans[Math.floor(Math.random() * beans.length)];
      document.getElementById('beanOut').innerHTML = '<div class="mus-out">' + b[2] + ' <b style="color:#fcedba">Sabor: ' + b[0] + '</b><br>' + b[3] + '</div>';
    });
    document.getElementById('lemonBtn').addEventListener('click', function () {
      snd('spark');
      var o = document.getElementById('lemonOut');
      o.innerHTML = '<div class="mus-out" style="border-color:#f59e0b;color:#fde68a">⚡ ¡Chisporroteo ácido! Una nubecita de humo amarillo sale de la vitrina.</div>';
      setTimeout(function () { o.innerHTML = ''; }, 2200);
    });
    document.getElementById('bookBtn').addEventListener('click', function () {
      snd('chime');
      var m = document.getElementById('bmodal'); if (m) m.classList.add('on');
    });
  }

  /* ── Cierre del modal del libro ── */
  (function () {
    var m = document.getElementById('bmodal'); if (!m) return;
    var x = document.getElementById('bmodalX');
    if (x) x.addEventListener('click', function () { m.classList.remove('on'); });
    m.addEventListener('click', function (e) { if (e.target === m) m.classList.remove('on'); });
  })();

  renderMain();
  renderGrid();
})();