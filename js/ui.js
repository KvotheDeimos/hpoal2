/* ═══════════════════════════════════════════════════════════
   js/ui.js — Utilidades globales + chrome ligero del index
   Dependencias: js/data.js (HOUSES, RELICS)
   Carga: defer, después de data.js y antes de copa/cronicas/etc.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Helpers globales (no pisan nada si ya existen) ── */
  window.$ = window.$ || function (s) { return document.querySelector(s); };
  window.$$ = window.$$ || function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  window.REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Sonido: delega en magia.js si está cargado ── */
  window.chime = function () { var s = window.SucursalSound; if (s && s.chime) s.chime(); };
  window.whoosh = function () { var s = window.SucursalSound; if (s && s.whoosh) s.whoosh(); };

  /* ── Toast global ── */
  window.toastMsg = function (t) {
    var el = $('#toast'); if (!el) return;
    el.textContent = t; el.classList.add('show');
    setTimeout(function () { el.classList.remove('show'); }, 3200);
  };

  /* ── Datos de data.js con guardas ── */
  var HOUSES_D = (typeof HOUSES !== 'undefined') ? HOUSES : null;
  var RELICS_D = (typeof RELICS !== 'undefined') ? RELICS : null;

  /* ── Año del footer ── */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ── Cinta (ribbon) ── */
  var rt = $('#ribbonTrack');
  if (rt) {
    var seg = '<span>✦ DRACO DORMIENS NUNQUAM TITILLANDUS&nbsp;</span><span>✦ OLOR A LIBROS · SUCURSAL DE HOGWARTS · RELEER ES VIVIR&nbsp;</span>';
    rt.innerHTML = seg + seg;
  }

  /* ── Menú móvil ── */
  (function () {
    var bar = $('#topline'), btn = $('#menuBtn'); if (!bar || !btn) return;
    btn.addEventListener('click', function () {
      var o = bar.classList.toggle('open');
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      btn.textContent = o ? '✕' : '☰';
    });
    var nav = bar.querySelector('nav');
    if (nav) nav.addEventListener('click', function (e) {
      if (e.target.matches('a')) { bar.classList.remove('open'); btn.textContent = '☰'; btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('click', function (e) {
      if (!bar.contains(e.target)) { bar.classList.remove('open'); btn.textContent = '☰'; btn.setAttribute('aria-expanded', 'false'); }
    });
  })();

  /* ── Cuenta atrás del edicto (se autolimpia al expirar) ── */
  (function () {
    var d = $('#cd-d'), h = $('#cd-h'), m = $('#cd-m'), s = $('#cd-s'), wrap = $('#countdown');
    if (!d || !wrap) return;
    var target = new Date(2026, 8, 13, 23, 59, 59);
    function pad(n) { return String(n).padStart(2, '0'); }
    var iv = setInterval(tick, 1000);
    function tick() {
      var df = target - Date.now();
      if (df <= 0) {
        clearInterval(iv);
        wrap.outerHTML = '<p class="edict-expired">⏳ ¡Se acabó el plazo! La Piedra queda cerrada… y el Sombrero ya tiene las voces calentando.</p>';
        return;
      }
      d.textContent = Math.floor(df / 864e5);
      h.textContent = pad(Math.floor(df / 36e5) % 24);
      m.textContent = pad(Math.floor(df / 6e4) % 60);
      s.textContent = pad(Math.floor(df / 1e3) % 60);
    }
    tick();
  })();

  /* ── Contadores del ledger ── */
  function countUp(el) {
    var t = +el.dataset.target;
    if (window.REDUCED) { el.textContent = t.toLocaleString('es-ES'); return; }
    var st = performance.now();
    (function f(n) {
      var p = Math.min(1, (n - st) / 1500);
      el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))).toLocaleString('es-ES');
      if (p < 1) requestAnimationFrame(f);
    })(st);
  }

  /* ── Reveals (IntersectionObserver) ── */
  function observeReveals(scope) {
    var els = (scope || document).querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add('in');
        if (x.target.classList.contains('ledger-item')) {
          var n = x.target.querySelector('.ledger-num');
          if (n && !n.dataset.done) { n.dataset.done = 1; countUp(n); }
        }
        io.unobserve(x.target);
      });
    }, { threshold: .15 });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }
  window.observeReveals = observeReveals;
  observeReveals(document);

  /* ── Estrellas y velas del portal ── */
  (function () {
    var stars = $('#stars');
    if (stars) {
      for (var i = 0; i < 60; i++) {
        var s = document.createElement('span');
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 70 + '%';
        s.style.setProperty('--tw', (2 + Math.random() * 4) + 's');
        s.style.setProperty('--td', (Math.random() * 4) + 's');
        if (Math.random() < .2) { s.style.width = '3px'; s.style.height = '3px'; }
        stars.appendChild(s);
      }
    }
    var candles = $('#candles');
    if (candles) {
      for (var j = 0; j < 10; j++) {
        var c = document.createElement('div');
        c.className = 'candle';
        c.style.left = (2 + Math.random() * 94) + '%';
        c.style.top = (4 + Math.random() * 36) + '%';
        c.style.setProperty('--dur', (8 + Math.random() * 8) + 's');
        c.style.setProperty('--del', (-Math.random() * 8) + 's');
        c.style.setProperty('--tilt', (1.5 + Math.random() * 3.5) + 'deg');
        c.innerHTML = '<div class="candle-in" style="--s:' + (.7 + Math.random() * .6).toFixed(2) + '"><span class="glow"></span><span class="flame"></span><span class="wax"></span></div>';
        candles.appendChild(c);
      }
    }
  })();

  /* ── Reliquias en banners ([data-relic]) ── */
  function fillRelics(scope) {
    if (!RELICS_D) return;
    (scope || document).querySelectorAll('[data-relic]').forEach(function (el) {
      if (!el.innerHTML) el.innerHTML = RELICS_D[el.dataset.relic] || '';
    });
  }
  fillRelics(document);

  /* ── Sección Las Casas (#casas) ── */
  (function () {
    var grid = $('#housesGrid'); if (!grid || !HOUSES_D) return;
    var totems = { Gryffindor: '🦁', Slytherin: '🐍', Ravenclaw: '🦅', Hufflepuff: '🦡' };
    grid.innerHTML = Object.keys(HOUSES_D).map(function (k, i) {
      var h = HOUSES_D[k];
      var totem = totems[k] || '✨';
      return '<article class="house-card reveal" style="--ha:' + h.ha + ';--hb:' + h.hb + ';--rd:' + (i * .12) + 's">'
        + '<div class="house-tag">' + h.tag + '</div>'
        + '<div class="house-emblem" data-relic="' + k[0] + '" title="' + k + '"></div>'
        + '<div class="house-title-wrap">'
        +   '<h3>' + k + ' <span class="house-totem">' + totem + '</span></h3>'
        +   '<p class="motto">«' + h.q + '»</p>'
        + '</div>'
        + '<p class="house-desc">' + h.desc + '</p>'
        + '<div class="house-details">'
        +   '<div><b>Fundador:</b> ' + h.founder + '</div>'
        +   '<div><b>Reliquia:</b> ' + h.relic + '</div>'
        +   '<div><b>Sala Común:</b> ' + h.common + '</div>'
        +   '<div><b>Fantasma:</b> ' + h.ghost + '</div>'
        + '</div>'
        + '<div class="house-note">' + h.note + '</div>'
        + '<div class="house-members"><b>Miembros célebres:</b> ' + h.members + '</div>'
        + '</article>';
    }).join('');
    fillRelics(grid);
    observeReveals(grid);
  })();

  /* ── Tren: pilares del viaducto + silbato al clic ── */
  (function () {
    var v = $('#tbViaduct');
    if (v) { var html = ''; for (var i = 0; i < 12; i++) html += '<div class="tb-pillar"></div>'; v.innerHTML = html; }
    var train = $('#tbTrain'); if (!train) return;
    train.addEventListener('click', function () {
      whoosh();
      var tip = $('#tbTip'); if (tip) { tip.classList.add('on'); setTimeout(function () { tip.classList.remove('on'); }, 3200); }
      var st = $('#tbSteam'); if (st) { st.classList.add('big'); setTimeout(function () { st.classList.remove('big'); }, 1600); }
      $$('#tbTrain .tb-wheel').forEach(function (w) { w.classList.add('fast'); setTimeout(function () { w.classList.remove('fast'); }, 1600); });
    });
  })();

})();