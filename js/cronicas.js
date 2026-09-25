/* ═══════════════════════════════════════════════════════════
   js/cronicas.js — Crónicas por Libros
   Dependencias: js/data.js (MAIN_DOORS, BOOKS, THEMES, EMBLEMS)
                 js/ui.js ($, $$, chime, whoosh)
   Carga: defer, después de data.js y ui.js
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = (typeof window !== 'undefined' && window.$) ? window.$ : function (s) { return document.querySelector(s); };
  var BOOKS_DATA = (typeof window !== 'undefined' && window.BOOKS) ? window.BOOKS : ((typeof BOOKS !== 'undefined') ? BOOKS : []);
  var THEMES_DATA = (typeof window !== 'undefined' && window.THEMES) ? window.THEMES : ((typeof THEMES !== 'undefined') ? THEMES : {});
  var EMBLEMS_DATA = (typeof window !== 'undefined' && window.EMBLEMS) ? window.EMBLEMS : ((typeof EMBLEMS !== 'undefined') ? EMBLEMS : {});

  function safeGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function safeSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }
  function safeRemove(k) {
    try { localStorage.removeItem(k); } catch (e) {}
  }

  /* ── SVG del arco gótico de sillería (dovelas + arquivoltas) ── */
  function archSVG(v) {
    return '<svg viewBox="0 0 300 175" preserveAspectRatio="none">'
      + '<path d="M10,175 L10,95 A140,140 0 0,1 150,5 A140,140 0 0,1 290,95 L290,175" fill="none" stroke="#2c2114" stroke-width="20"/>'
      + '<path d="M18,175 L18,95 A132,132 0 0,1 150,15 A132,132 0 0,1 282,95 L282,175" fill="none" stroke="' + v.sb + '" stroke-width="2.5" stroke-dasharray="16 4"/>'
      + '<path d="M32,175 L32,95 A118,118 0 0,1 150,30 A118,118 0 0,1 268,95 L268,175" fill="none" stroke="#120c08" stroke-width="12"/>'
      + '<path d="M46,175 L46,105 C46,75 80,50 115,65 C130,45 170,45 185,65 C220,50 254,75 254,105 L254,175" fill="none" stroke="' + v.gc + '" stroke-width="3" opacity=".75"/>'
      + '<polygon points="150,0 164,18 150,28 136,18" fill="#caa96a" stroke="#3d2a0d" stroke-width="1.5"/><circle cx="150" cy="18" r="3.5" fill="#ffeaa7"/>'
      + '</svg>';
  }

  /* ── Bisagra de forja (herraje) ── */
  var HINGE = '<svg viewBox="0 0 110 26"><path d="M0,13 L75,13 C86,13 96,4 103,8 C110,13 103,22 94,20 C87,18 89,13 95,13" fill="none" stroke="currentColor" stroke-width="2.8"/><circle cx="16" cy="13" r="2.5" fill="#caa96a"/><circle cx="40" cy="13" r="2.5" fill="#caa96a"/><circle cx="64" cy="13" r="2.5" fill="#caa96a"/></svg>';

  /* ── Constructor de puerta gótica (compartido) ── */
  function doorHTML(o) {
    var v = (THEMES_DATA && THEMES_DATA[o.theme]) ? THEMES_DATA[o.theme] : { gc:'#caa96a',gg:'rgba(235,185,75,.5)',gr:'#fcedba',oak1:'#29180c',oak2:'#140a04',gt:'#fcedba',gt2:'#fce4a6',gbg:'linear-gradient(90deg,#2e1d0b,#473014,#2e1d0b)',gb2:'rgba(212,175,55,.7)',gm:'rgba(235,185,75,.35)',gh:'#e5b83b',sb:'#8a6c38',rune:'ᚠ · SAPIENTIA · ᛟ' };
    var tag = o.href ? 'a' : 'button';
    var hrefAttr = o.href ? ' href="' + o.href + '"' : '';
    var nAttr = (o.n != null) ? ' data-n="' + o.n + '"' : '';
    var disAttr = o.disabled ? ' disabled' : '';
    var cls = 'gdoor ' + (o.size || '') + (o.disabled ? ' locked' : '') + (o.cls ? (' ' + o.cls) : '');
    return '<' + tag + hrefAttr + nAttr + disAttr + ' class="' + cls + '" style="--gc:' + v.gc + ';--gg:' + v.gg + ';--gr:' + v.gr + ';--oak1:' + v.oak1 + ';--oak2:' + v.oak2 + ';--gt:' + v.gt + ';--gt2:' + v.gt2 + ';--gbg:' + v.gbg + ';--gb2:' + v.gb2 + ';--gm:' + v.gm + ';--gh:' + v.gh + '">'
      + '<div class="gd-arch">' + archSVG(v) + '<span class="gd-rune">' + v.rune + '</span><span class="gd-lantern"><i></i></span></div>'
      + '<div class="gd-leaves"><div class="gd-leaf l"></div><div class="gd-leaf r"></div><div class="gd-light"></div>'
      + '<span class="gd-hinge top" style="color:' + v.gh + '">' + HINGE + '</span><span class="gd-hinge bot" style="color:' + v.gh + '">' + HINGE + '</span>'
      + '<div class="gd-mid"><span class="gd-badge">✦ ' + o.badge + ' ✦</span>'
      + '<span class="gd-medal">' + (o.emb ? (EMBLEMS_DATA[o.emb] || '') : '<span class="sym">' + (o.sym || '📖') + '</span>') + '</span>'
      + '<span class="gd-knob"><i></i></span><span class="gd-knocker"></span>'
      + '<span class="gd-title">' + o.title + '</span><span class="gd-sub">' + o.sub + '</span>'
      + '<span class="gd-cta">' + (o.cta || 'Entrar') + ' <span>➔</span></span></div>'
      + '<div class="gd-mist"></div></div>'
      + '<div class="gd-step"><i></i>' + (o.step || 'Hogwarts') + '<i></i></div>'
      + '</' + tag + '>';
  }

  /* ── Estantería de los 7 libros + panel de dinámicas ── */
  var selBook = 2;

  function renderBooks() {
    var shelf = document.getElementById('bookShelf');
    if (!shelf) return;
    var books = BOOKS_DATA.length ? BOOKS_DATA : ((typeof window !== 'undefined' && window.BOOKS) ? window.BOOKS : []);
    shelf.innerHTML = books.map(function (b) {
      return doorHTML({
        n: b.n,
        badge: 'Vol. ' + b.r,
        title: b.t.replace('Harry Potter y ', ''),
        sub: (b.st === 'sealed' ? 'Sellado hasta su turno' : (b.st === 'current' ? 'Lectura actual' : 'Completado')),
        sym: b.sym,
        theme: b.theme,
        size: 'sm',
        disabled: (b.st === 'sealed'),
        cta: (b.st === 'sealed' ? '🔒 Sellado' : 'Abrir tomo'),
        step: 'Libro ' + b.r + ' de VII'
      });
    }).join('');
    Array.prototype.forEach.call(shelf.querySelectorAll('.gdoor'), function (d) {
      d.addEventListener('click', function () {
        if (d.disabled) return;
        selBook = +d.dataset.n;
        renderBooks();
        renderDyn();
        if (typeof chime === 'function') chime();
      });
    });
  }

  function renderDyn() {
    var wrap = document.getElementById('dynWrap');
    if (!wrap) return;
    var books = BOOKS_DATA.length ? BOOKS_DATA : ((typeof window !== 'undefined' && window.BOOKS) ? window.BOOKS : []);
    var b = books.filter(function (x) { return x.n === selBook; })[0] || books[0];
    if (!b) { wrap.innerHTML = ''; return; }

    if (!b.dyn || !b.dyn.length) {
      wrap.className = 'dynwrap';
      wrap.innerHTML = '<h3>' + b.t + '</h3><p class="tagline">«' + b.tag + '»</p><p class="desc">' + b.d + '</p>'
        + '<div class="sealed-note">🔒 <span>Este tomo está sellado con encantamiento fidelio. Sus dinámicas y secretos se revelarán exactamente cuando el club culmine el libro anterior.</span></div>';
      return;
    }

    wrap.className = 'dynwrap' + (b.dyn.length <= 2 ? ' has-few' : '');
    wrap.innerHTML = '<h3>' + b.t + '</h3><p class="tagline">«' + b.tag + '»</p><p class="desc">' + b.d + '</p>'
      + '<div class="dyngrid">' + b.dyn.map(function (d) {
        return doorHTML(Object.assign({ size: 'sm', step: 'Libro ' + b.r }, d));
      }).join('') + '</div>';

    Array.prototype.forEach.call(wrap.querySelectorAll('.gdoor.camara'), function (d) {
      if (safeGet('camara_abierta') === '1') {
        d.classList.add('open');
        if (safeGet('camara_sello') === '1') d.classList.add('sello');
        var cta = d.querySelector('.gd-cta');
        if (cta) cta.innerHTML = 'Entrar <span>➔</span>';
      }
    });

    if (b.n === 2 && safeGet('camara_abierta') === '1') {
      wrap.insertAdjacentHTML('beforeend',
        '<div style="text-align:center;margin-top:14px"><button id="resetCamara" style="padding:8px 16px;font-size:.75rem;background:transparent;color:#caa96a;border:1px solid rgba(202,169,106,.4);border-radius:6px;cursor:pointer">🔒 Cerrar la puerta de nuevo (pruebas)</button></div>');
      var rb = document.getElementById('resetCamara');
      if (rb) rb.addEventListener('click', function () {
        safeRemove('camara_abierta');
        safeRemove('camara_sello');
        renderDyn();
      });
    }
  }

  renderBooks();
  renderDyn();

})();