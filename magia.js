/* ═══════════════════════════════════════════════════════════
   magia.js — Capa sensorial y mágica de la Sucursal de Hogwarts
   Audio procedural orquestado, estela de varita, chispas doradas,
   revelación cinematográfica, modo Lumos/Nox y utilidades
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Helpers globales ── */
  window.$ = window.$ || function (s) { return document.querySelector(s); };
  window.$$ = window.$$ || function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  window.REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Estado de sonido global ── */
  var SOUND_KEY = 'hogwarts_magic_sound_v2';
  var soundEnabled = localStorage.getItem(SOUND_KEY) === 'true';

  /* ── Toast Mágico ── */
  window.toastMsg = function (t) {
    var el = window.$('#toast'); if (!el) return;
    el.innerHTML = '<span class="toast-rune">✦</span> ' + t;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 3600);
  };

  /* ═══ SINTETIZADOR DE AUDIO MÁGICO (Web Audio API) ═══ */
  var _ctx = null;
  function getAudioContext() {
    if (!_ctx) {
      try {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) _ctx = new AudioCtx();
      } catch (e) {}
    }
    if (_ctx && _ctx.state === 'suspended') {
      _ctx.resume().catch(function () {});
    }
    return _ctx;
  }

  // Tono con envolvente suave y calidez analógica
  function playNote(freq, dur, type, vol, detune, delay) {
    if (!soundEnabled) return;
    var c = getAudioContext();
    if (!c) return;
    delay = delay || 0;
    setTimeout(function () {
      try {
        var t = c.currentTime;
        var osc = c.createOscillator();
        var gain = c.createGain();
        var filter = c.createBiquadFilter();

        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, t);
        if (detune) osc.detune.setValueAtTime(detune, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(Math.min(freq * 3.5, 4800), t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(c.destination);

        osc.start(t);
        osc.stop(t + dur + 0.05);
      } catch (e) {}
    }, delay);
  }

  window.SucursalSound = {
    isEnabled: function () { return soundEnabled; },
    toggle: function () {
      soundEnabled = !soundEnabled;
      localStorage.setItem(SOUND_KEY, soundEnabled ? 'true' : 'false');
      updateSoundUI();
      if (soundEnabled) {
        getAudioContext();
        window.SucursalSound.chime();
        window.toastMsg('🔔 Sonido mágico activado');
      } else {
        window.toastMsg('🔕 Sonido silenciado');
      }
      return soundEnabled;
    },
    chime: function () {
      // Campanillas arpegiadas de celesta
      playNote(523.25, 0.6, 'sine', 0.1, 0, 0);       // C5
      playNote(659.25, 0.7, 'sine', 0.09, 4, 80);     // E5
      playNote(783.99, 0.8, 'sine', 0.08, -3, 160);   // G5
      playNote(1046.50, 1.1, 'sine', 0.07, 2, 240);   // C6
    },
    bell: function () {
      // Campana de bronce catedralicia
      playNote(440, 1.4, 'triangle', 0.14, 0, 0);
      playNote(880, 1.0, 'sine', 0.08, 5, 10);
      playNote(1320, 0.6, 'sine', 0.04, -8, 20);
    },
    glass: function () {
      // Tintineo de rubíes o esmeraldas en el reloj de arena
      playNote(1760, 0.4, 'sine', 0.09, 3, 0);
      playNote(2637, 0.35, 'sine', 0.07, -4, 45);
      playNote(3135, 0.3, 'sine', 0.04, 2, 90);
    },
    spark: function () {
      // Chispas de varita mágica
      playNote(1396.91, 0.25, 'sine', 0.08, 0, 0);
      playNote(2093.00, 0.28, 'sine', 0.06, 6, 40);
      playNote(2793.83, 0.32, 'sine', 0.04, -5, 80);
    },
    wand: function () {
      // Vuelo sutil + destello armónico
      window.SucursalSound.whoosh();
      setTimeout(function () {
        playNote(987.77, 0.7, 'sine', 0.09, 0, 0);
        playNote(1318.51, 0.9, 'sine', 0.07, 3, 60);
      }, 100);
    },
    secret: function () {
      // Acorde menor misterioso de la Cámara o el Espejo
      playNote(220, 1.6, 'triangle', 0.12, 0, 0);    // A3
      playNote(261.63, 1.4, 'sine', 0.08, 2, 40);    // C4
      playNote(329.63, 1.5, 'sine', 0.08, -3, 80);   // E4
      playNote(415.30, 1.6, 'sine', 0.06, 4, 120);   // G#4
    },
    page: function () {
      // Roce suave de pergamino antiguo
      if (!soundEnabled) return;
      var c = getAudioContext();
      if (!c) return;
      try {
        var t = c.currentTime;
        var bufLen = Math.floor(c.sampleRate * 0.18);
        var buf = c.createBuffer(1, bufLen, c.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0; i < bufLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 1.8);
        }
        var src = c.createBufferSource();
        src.buffer = buf;
        var flt = c.createBiquadFilter();
        flt.type = 'bandpass';
        flt.frequency.setValueAtTime(1400, t);
        flt.Q.setValueAtTime(1.8, t);
        var g = c.createGain();
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
        src.connect(flt).connect(g).connect(c.destination);
        src.start(t);
      } catch (e) {}
    },
    whoosh: function () {
      if (!soundEnabled) return;
      var c = getAudioContext();
      if (!c) return;
      try {
        var t = c.currentTime;
        var dur = 0.35;
        var b = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
        var d = b.getChannelData(0);
        for (var i = 0; i < d.length; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.sin((i / d.length) * Math.PI);
        }
        var s = c.createBufferSource();
        s.buffer = b;
        var f = c.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.setValueAtTime(320, t);
        f.frequency.exponentialRampToValueAtTime(1800, t + dur * 0.6);
        f.frequency.exponentialRampToValueAtTime(450, t + dur);
        var g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.09, t + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        s.connect(f).connect(g).connect(c.destination);
        s.start(t);
      } catch (e) {}
    }
  };

  function updateSoundUI() {
    var btns = document.querySelectorAll('.sound-toggle');
    btns.forEach(function (btn) {
      if (soundEnabled) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Silenciar sonido');
        btn.innerHTML = '<span class="icon-bell">🔔</span><span class="lbl-sound">Sonido</span>';
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Activar sonido mágico');
        btn.innerHTML = '<span class="icon-bell">🔕</span><span class="lbl-sound">Silencio</span>';
      }
    });
  }

  /* ═══ ESTELA MÁGICA DE VARITA (Wand Trail) ═══ */
  var lastTrailTime = 0;
  function initWandTrail() {
    if (window.REDUCED) return;
    // Solo en desktop o dispositivos con puntero fino para cuidar rendimiento
    if (window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('mousemove', function (e) {
      var now = performance.now();
      if (now - lastTrailTime < 35) return; // limitamos a ~30 partículas/segundo
      lastTrailTime = now;

      var spark = document.createElement('span');
      spark.className = 'wand-stardust';
      var size = (2 + Math.random() * 3.5).toFixed(1);
      spark.style.cssText =
        'position:fixed;pointer-events:none;z-index:999;' +
        'left:' + (e.clientX + (Math.random() * 8 - 4)) + 'px;' +
        'top:' + (e.clientY + (Math.random() * 8 - 4)) + 'px;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'border-radius:50%;' +
        'background:radial-gradient(circle, #fff7d6 0%, #ffd88a 55%, rgba(217,169,78,0) 100%);' +
        'box-shadow:0 0 ' + (size * 2) + 'px rgba(252,237,186,.7);' +
        'opacity:0.85;';
      document.body.appendChild(spark);

      var driftX = (Math.random() - 0.5) * 16;
      var driftY = 8 + Math.random() * 18;
      var dur = 400 + Math.random() * 300;

      spark.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 0.85 },
        { transform: 'translate(' + driftX + 'px, ' + driftY + 'px) scale(0.2)', opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' }).onfinish = function () {
        spark.remove();
      };
    }, { passive: true });
  }

  /* ═══ CHISPAS DORADAS AL HACER CLIC ═══ */
  window.fireGoldenSparks = function (x, y) {
    if (window.REDUCED) return;
    x = x != null ? x : window.innerWidth / 2;
    y = y != null ? y : window.innerHeight / 2;

    var count = 20;
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      var size = Math.floor(3 + Math.random() * 4);
      s.className = 'golden-spark';
      s.style.cssText =
        'position:fixed;z-index:9999;pointer-events:none;border-radius:50%;' +
        'background:radial-gradient(circle,#ffffff 10%, #ffe9a8 45%, #d9a94e 90%);' +
        'box-shadow:0 0 10px rgba(255,220,140,0.9), 0 0 4px #ffd269;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + x + 'px;top:' + y + 'px;';
      document.body.appendChild(s);

      var angle = Math.random() * Math.PI * 2;
      var dist = 35 + Math.random() * 85;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist + (Math.random() * 20); // caída gravitatoria

      s.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.1)', opacity: 0 }
      ], {
        duration: 550 + Math.random() * 450,
        easing: 'cubic-bezier(0.15, 0.85, 0.35, 1)'
      }).onfinish = function () {
        this.effect.target.remove();
      };
    }
  };

  /* ═══ REVELACIÓN CON INTERSECTION OBSERVER ═══ */
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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  };

  /* ── CountUp para números y pergaminos ── */
  window.countUp = function (el) {
    var target = +el.dataset.target;
    if (isNaN(target)) return;
    if (window.REDUCED) {
      el.textContent = target.toLocaleString('es-ES');
      return;
    }
    var startTime = performance.now();
    var duration = 1400;
    (function frame(now) {
      var progress = Math.min(1, (now - startTime) / duration);
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * ease).toLocaleString('es-ES');
      if (progress < 1) requestAnimationFrame(frame);
    })(startTime);
  };

  /* ═══ MODO LUMOS / NOX (Ambient Lighting) ═══ */
  function toggleLumos(state) {
    var isLumos = state !== undefined ? state : !document.body.classList.contains('lumos');
    if (isLumos) {
      document.body.classList.add('lumos');
      window.toastMsg('✨ Lumos: La cálida luz del castillo te ilumina');
      window.SucursalSound.spark();
    } else {
      document.body.classList.remove('lumos');
      window.toastMsg('🌑 Nox: La penumbra de las mazmorras regresa');
      window.SucursalSound.page();
    }
    var lumosBtns = document.querySelectorAll('.lumos-toggle');
    lumosBtns.forEach(function (btn) {
      btn.innerHTML = isLumos
        ? '<span class="icon-candle">🕯️</span><span class="lbl-lumos">Nox</span>'
        : '<span class="icon-candle">🕯️</span><span class="lbl-lumos">Lumos</span>';
      btn.title = isLumos ? 'Apagar la luz (Nox)' : 'Encender la luz (Lumos)';
      btn.classList.toggle('active', isLumos);
    });
  }
  window.toggleLumos = toggleLumos;

  /* Teclado: escribir "lumos" o "nox" */
  var keyBuf = '';
  window.addEventListener('keydown', function (e) {
    if (!e.key || e.key.length !== 1) return;
    keyBuf = (keyBuf + e.key.toLowerCase()).slice(-8);
    if (keyBuf.endsWith('lumos')) {
      toggleLumos(true);
    } else if (keyBuf.endsWith('nox')) {
      toggleLumos(false);
    }
  });

  /* Sonido en clics interactivos (puertas, botones, insignias) */
  function bindInteractiveAesthetics() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('button, .btn, .gdoor, .hgcard, .mus-card, .mus-mini, .opt, .banner, .seal-btn');
      if (btn) {
        // Reproducir sonido sutil si procede
        if (btn.classList.contains('sound-toggle')) {
          // El botón de sonido maneja su propio click
          return;
        }
        if (btn.classList.contains('lumos-toggle')) {
          toggleLumos();
          return;
        }
        if (btn.classList.contains('gdoor') || btn.classList.contains('seal-btn')) {
          window.SucursalSound.bell();
          window.fireGoldenSparks(e.clientX, e.clientY);
        } else if (btn.classList.contains('hgcard')) {
          window.SucursalSound.glass();
        } else if (btn.classList.contains('opt')) {
          window.SucursalSound.page();
        } else {
          window.SucursalSound.spark();
        }
      }
    });

    // Iniciar contexto de audio en primer toque de pantalla o clic
    var resumeAudio = function () {
      getAudioContext();
      window.removeEventListener('pointerdown', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
    };
    window.addEventListener('pointerdown', resumeAudio, { once: true });
    window.addEventListener('keydown', resumeAudio, { once: true });
  }

  /* ═══ INICIALIZACIÓN ═══ */
  function init() {
    var yearEl = window.$('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    updateSoundUI();
    initWandTrail();
    bindInteractiveAesthetics();
    window.observeReveals(document);

    // Conectar botones de sonido y lumos existentes
    document.querySelectorAll('.sound-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.SucursalSound.toggle();
      });
    });
    document.querySelectorAll('.lumos-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleLumos();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
