/* ═══════════════════════════════════════════════════════════
   magia.js — capa viva de la Sucursal de Hogwarts
   Helpers, sonido, chispas, reveals, toasts, lumos/nox
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Helpers globales ── */
  window.$ = window.$ || function (s) { return document.querySelector(s); };
  window.$$ = window.$$ || function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  window.REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Toast ── */
  window.toastMsg = function (t) {
    var el = window.$('#toast'); if (!el) return;
    el.textContent = t; el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 3200);
  };

  /* ═══ SONIDO (WebAudio, OFF por defecto) ═══ */
  var _ctx = null;
  function ctx() {
    if (!_ctx) { try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } }
    if (_ctx && _ctx.state === 'suspended') { _ctx.resume(); }
    return _ctx;
  }
  function tone(freq, dur, type, vol) {
    var c = ctx(); if (!c) return;
    var t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  window.SucursalSound = {
    chime: function () { tone(880, .5, 'sine', .1); setTimeout(function () { tone(1320, .6, 'sine', .08); }, 90); },
    bell: function () { tone(660, .8, 'triangle', .12); setTimeout(function () { tone(990, .9, 'triangle', .08); }, 110); },
    glass: function () { tone(1960, .35, 'sine', .09); setTimeout(function () { tone(2637, .3, 'sine', .06); }, 60); },
    whoosh: function () {
      var c = ctx(); if (!c) return;
      var t = c.currentTime, b = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var s = c.createBufferSource(); s.buffer = b;
      var f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(2000, t + .4);
      var g = c.createGain(); g.gain.setValueAtTime(.1, t); g.gain.exponentialRampToValueAtTime(.0001, t + .5);
      s.connect(f).connect(g).connect(c.destination); s.start(t);
    },
    spark: function () { tone(1568, .25, 'sine', .07); setTimeout(function () { tone(2093, .2, 'sine', .05); }, 50); },
    page: function () { tone(523, .3, 'sine', .08); }
  };

  /* ═══ CHISPAS DORADAS ═══ */
  window.fireGoldenSparks = function (x, y) {
    if (window.REDUCED) return;
    x = x != null ? x : window.innerWidth / 2;
    y = y != null ? y : window.innerHeight / 2;
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('span');
      s.style.cssText = 'position:fixed;z-index:200;pointer-events:none;border-radius:50%;' +
        'background:radial-gradient(circle,#fff3cf,#f2cd7b);box-shadow:0 0 8px rgba(242,205,123,.85);' +
        'width:5px;height:5px;left:' + x + 'px;top:' + y + 'px;';
      document.body.appendChild(s);
      var ang = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 60;
      var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
      s.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.2)', opacity: 0 }
      ], { duration: 500 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.2,1)' }).onfinish = function () { this.effect.target.remove(); };
    }
  };

  /* ═══ REVEALS (IntersectionObserver) ═══ */
  window.observeReveals = function (scope) {
    var els = (scope || document).querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add('in');
        io.unobserve(x.target);
      });
    }, { threshold: .15 });
    els.forEach(function (el) { io.observe(el); });
  };

  /* ── CountUp para ledger ── */
  window.countUp = function (el) {
    var t = +el.dataset.target;
    if (window.REDUCED) { el.textContent = t.toLocaleString('es-ES'); return; }
    var st = performance.now();
    (function f(n) {
      var p = Math.min(1, (n - st) / 1500);
      el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))).toLocaleString('es-ES');
      if (p < 1) requestAnimationFrame(f);
    })(st);
  };

  /* ═══ LUMOS / NOX (easter egg) ═══ */
  var _buf = '';
  window.addEventListener('keydown', function (e) {
    if (!e.key || e.key.length !== 1) return;
    _buf = (_buf + e.key.toLowerCase()).slice(-8);
    if (_buf.endsWith('lumos')) {
      document.body.classList.add('lumos');
      window.toastMsg('✨ Lumos: la luz te acompaña.');
    } else if (_buf.endsWith('nox')) {
      document.body.classList.remove('lumos');
      window.toastMsg('🌑 Nox: la luz se apaga.');
    }
  });

  /* ═══ INIT ═══ */
  function init() {
    var y = window.$('#year'); if (y) y.textContent = new Date().getFullYear();
    window.observeReveals(document);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();