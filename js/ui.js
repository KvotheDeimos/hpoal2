/* ═══════════════════════════════════════════════════════════
   js/ui.js — Utilidades globales + chrome ligero del index
   Dependencias: js/data.js (HOUSES, RELICS)
   Carga: defer, después de data.js y antes de copa/cronicas/etc.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Helpers globales (no pisan nada si ya existen) ── */
  var $ = (typeof window !== 'undefined' && window.$) ? window.$ : function (s) { return document.querySelector(s); };
  var $$ = (typeof window !== 'undefined' && window.$$) ? window.$$ : function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  if (typeof window !== 'undefined') {
    window.$ = $;
    window.$$ = $$;
    window.REDUCED = (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)') && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;
  }

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
  var HOUSES_D = (typeof window !== 'undefined' && window.HOUSES) ? window.HOUSES : ((typeof HOUSES !== 'undefined') ? HOUSES : null);
  var RELICS_D = (typeof window !== 'undefined' && window.RELICS) ? window.RELICS : ((typeof RELICS !== 'undefined') ? RELICS : null);

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
    if (!els.length) return;
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
    }, { threshold: 0.05 });
    Array.prototype.forEach.call(els, function (el) {
      var rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      if (rect && rect.top < (window.innerHeight || 800) + 120) {
        el.classList.add('in');
        if (el.classList.contains('ledger-item')) {
          var n = el.querySelector('.ledger-num');
          if (n && !n.dataset.done) { n.dataset.done = 1; countUp(n); }
        }
      } else {
        io.observe(el);
      }
    });
  }
  window.observeReveals = observeReveals;
  observeReveals(document);
  setTimeout(function () {
    var pending = document.querySelectorAll('.reveal:not(.in)');
    Array.prototype.forEach.call(pending, function (el) { el.classList.add('in'); });
  }, 1000);

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

  /* ── Sección Las Casas (#casas) — Formato Estandarte / Marcapáginas Editorial ── */
  (function () {
    var grid = $('#housesGrid'); if (!grid) return;
    // Si ya tiene los estandartes estáticos en index.html, no los reescribe
    if (!grid.children || grid.children.length === 0) {
      if (!HOUSES_D) return;
      var relics = RELICS_D || ((typeof window !== 'undefined' && window.RELICS) ? window.RELICS : {});
      grid.innerHTML = Object.keys(HOUSES_D).map(function (k, i) {
        var h = HOUSES_D[k];
        var relicSvg = (relics && relics[k[0]]) ? relics[k[0]] : '';
        return '<article class="house-banner reveal" data-house="' + k + '" style="--ha:' + h.ha + ';--hb:' + h.hb + ';--rd:' + (i * .12) + 's">'
          + '<div class="banner-frame">'
          +   '<div class="banner-eyelet" aria-hidden="true"></div>'
          +   '<div class="banner-art" aria-hidden="true">' + relicSvg + '</div>'
          +   '<div class="banner-kicker">' + h.tag + '</div>'
          +   '<div class="banner-title-row">'
          +     '<span class="banner-badge" aria-hidden="true">' + relicSvg + '</span>'
          +     '<h3 class="banner-name">' + k.toUpperCase() + '</h3>'
          +   '</div>'
          +   '<p class="banner-motto">«' + h.q + '»</p>'
          +   '<div class="banner-specs">'
          +     '<div class="spec-row"><span class="spec-lbl">FUNDADOR</span><span class="spec-val">' + h.founder + '</span></div>'
          +     '<div class="spec-row"><span class="spec-lbl">CUALIDADES</span><span class="spec-val">' + h.q + '</span></div>'
          +     '<div class="spec-row"><span class="spec-lbl">FANTASMA</span><span class="spec-val">' + h.ghost + '</span></div>'
          +     '<div class="spec-row"><span class="spec-lbl">SALA COMÚN</span><span class="spec-val">' + h.common + '</span></div>'
          +     '<div class="spec-row"><span class="spec-lbl">RELIQUIA</span><span class="spec-val">' + h.relic + '</span></div>'
          +   '</div>'
          +   '<p class="banner-desc">' + h.desc + '</p>'
          +   '<div class="banner-sep" aria-hidden="true"></div>'
          +   '<p class="banner-note">' + h.note + '</p>'
          +   '<p class="banner-members"><b>Miembros célebres:</b> <i>' + h.members + '</i></p>'
          + '</div>'
          + '</article>';
      }).join('');
    }
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
