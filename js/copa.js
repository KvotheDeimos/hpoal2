/* ═══════════════════════════════════════════════════════════
   js/copa.js — Relojes de arena de la Copa de las Casas
   Dependencias: js/data.js (PUNTOS_URL, GEMS, KEYS) y js/ui.js ($, $$, chime, toastMsg)
   Carga: defer, después de data.js y ui.js
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = (typeof window !== 'undefined' && window.$) ? window.$ : function (s) { return document.querySelector(s); };
  var GEMS_DATA = (typeof window !== 'undefined' && window.GEMS) ? window.GEMS : ((typeof GEMS !== 'undefined') ? GEMS : {});
  var KEYS_DATA = (typeof window !== 'undefined' && window.KEYS) ? window.KEYS : (Object.keys(GEMS_DATA).length ? Object.keys(GEMS_DATA) : ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff']);
  var P_URL = (typeof window !== 'undefined' && window.PUNTOS_URL) ? window.PUNTOS_URL : ((typeof PUNTOS_URL !== 'undefined') ? PUNTOS_URL : '');

  /* ── SVG de un reloj de arena con gemas ── */
  function hourglassSVG(k, pts, fill) {
    var g = GEMS_DATA[k] || { pri: '#ffd700', bord: '#b8860b', gem: 'Gemas' }, u = 'hg' + k;
    var gemH = (fill / 100) * 148, gy = 380 - gemH;

    var up = '';
    for (var i = 0; i < 22; i++) {
      var gx = 70 + (i % 6) * 18 + ((i * 7) % 11), yy = 80 + Math.floor(i / 6) * 22 + ((i * 5) % 9);
      up += '<polygon points="' + gx + ',' + (yy - 4) + ' ' + (gx + 4) + ',' + yy + ' ' + gx + ',' + (yy + 4) + ' ' + (gx - 4) + ',' + yy + '" fill="' + g.pri + '" stroke="' + g.bord + '" stroke-width=".5" opacity=".8"/>';
    }

    var low = '';
    if (pts > 0) {
      low += '<path d="M30 390 L30 ' + (gy + 14).toFixed(1) + ' Q120 ' + (gy - 12).toFixed(1) + ' 210 ' + (gy + 14).toFixed(1) + ' L210 390 Z" fill="url(#vol-' + u + ')"/>';
      [-38, -22, -8, 8, 22, 38].forEach(function (o) {
        low += '<polygon points="' + (120 + o) + ',' + (gy - 4 + Math.abs(o) * .2) + ' ' + (120 + o + 5) + ',' + (gy + Math.abs(o) * .2) + ' ' + (120 + o) + ',' + (gy + 4 + Math.abs(o) * .2) + ' ' + (120 + o - 5) + ',' + (gy + Math.abs(o) * .2) + '" fill="#fff" stroke="' + g.bord + '" stroke-width=".8" class="hg-tw"/>';
      });
      for (var gi = 0; gi < 28; gi++) {
        var col = gi % 7, row = Math.floor(gi / 7), px = 55 + col * 18 + ((gi * 9) % 12), py = gy + 16 + row * 22;
        if (py > 380) continue;
        low += '<polygon points="' + px + ',' + (py - 5) + ' ' + (px + 5) + ',' + py + ' ' + px + ',' + (py + 5) + ' ' + (px - 5) + ',' + py + '" fill="' + g.fac[gi % 4] + '" stroke="rgba(255,255,255,.6)" stroke-width=".6"/>';
        if (gi % 3 === 0) low += '<circle cx="' + px + '" cy="' + py + '" r="1.5" fill="#fff"/>';
      }
      low += '<text x="110" y="' + (gy + 12) + '" fill="#fff" font-size="11" font-family="serif" class="hg-tw">✦</text>';
      low += '<text x="75" y="' + (gy + 28) + '" fill="#fff" font-size="9" font-family="serif" class="hg-tw">✦</text>';
      low += '<text x="150" y="' + (gy + 26) + '" fill="#fff" font-size="9" font-family="serif" class="hg-tw">✦</text>';
    } else {
      low += '<path d="M40 380 Q120 376 200 380 L200 384 L40 384 Z" fill="#1a110a"/>';
      low += '<text x="120" y="345" fill="#8c7860" font-size="10" font-style="italic" text-anchor="middle">' + (pts < 0 ? ('Bajo cero · ' + pts + ' pts') : 'Vacío · 0 pts') + '</text>';
    }

    var tr = '';
    if (pts > 0) {
      tr = '<line x1="120" y1="190" x2="120" y2="' + Math.min(370, gy + 15) + '" stroke="' + g.rays + '" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 3" class="hg-tw"/>'
        + '<circle cx="120" cy="208" r="2.5" fill="#fff"/><circle cx="120" cy="216" r="2" fill="' + g.top + '"/>'
        + '<circle cx="119" cy="235" r="2" fill="#fff"/><circle cx="121" cy="255" r="2.5" fill="' + g.bord + '"/>';
    }

    var mk = [[240, '500'], [270, '400'], [300, '300'], [335, '200'], [365, '100']].map(function (m) {
      return '<line x1="188" y1="' + m[0] + '" x2="194" y2="' + m[0] + '" stroke="#ffd966" stroke-width="1.2"/>'
        + '<text x="185" y="' + (m[0] + 2.5) + '" fill="#fcedba" font-size="6.5" font-family="monospace" font-weight="bold" text-anchor="end">' + m[1] + '</text>';
    }).join('');

    return '<svg viewBox="0 0 240 440" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>'
      + '<linearGradient id="br-' + u + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#694d1f"/><stop offset=".25" stop-color="#caa96a"/><stop offset=".5" stop-color="#fff2c2"/><stop offset=".75" stop-color="#c09a56"/><stop offset="1" stop-color="#4f3813"/></linearGradient>'
      + '<linearGradient id="mh-' + u + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#190e06"/><stop offset=".4" stop-color="#3b2010"/><stop offset=".7" stop-color="#4a2814"/><stop offset="1" stop-color="#140b04"/></linearGradient>'
      + '<linearGradient id="vol-' + u + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="' + g.bot + '"/><stop offset=".6" stop-color="' + g.pri + '"/><stop offset=".92" stop-color="' + g.top + '"/><stop offset="1" stop-color="#fff"/></linearGradient>'
      + '<clipPath id="clip-' + u + '"><path d="M64 64 C40 98,42 135,42 135 C42 178,92 198,106 208 L106 218 C92 230,34 262,34 326 C34 372,70 384,120 384 C170 384,206 372,206 326 C206 262,148 230,134 218 L134 208 C148 198,198 178,198 135 C198 98,176 64,176 64 Z"/></clipPath></defs>'
      + '<rect x="22" y="56" width="16" height="324" rx="3" fill="url(#mh-' + u + ')" stroke="#694d1f" stroke-width=".8"/><line x1="26" y1="58" x2="26" y2="378" stroke="#caa96a" stroke-width="1" stroke-opacity=".6"/>'
      + '<rect x="202" y="56" width="16" height="324" rx="3" fill="url(#mh-' + u + ')" stroke="#694d1f" stroke-width=".8"/><line x1="206" y1="58" x2="206" y2="378" stroke="#caa96a" stroke-width="1" stroke-opacity=".6"/>'
      + '<rect x="20" y="54" width="20" height="6" rx="1" fill="url(#br-' + u + ')"/><rect x="20" y="210" width="20" height="6" rx="1" fill="url(#br-' + u + ')"/><rect x="20" y="376" width="20" height="6" rx="1" fill="url(#br-' + u + ')"/>'
      + '<rect x="200" y="54" width="20" height="6" rx="1" fill="url(#br-' + u + ')"/><rect x="200" y="210" width="20" height="6" rx="1" fill="url(#br-' + u + ')"/><rect x="200" y="376" width="20" height="6" rx="1" fill="url(#br-' + u + ')"/>'
      + '<path d="M40 213 L106 213 M134 213 L200 213" stroke="url(#br-' + u + ')" stroke-width="4" stroke-linecap="round"/><circle cx="106" cy="213" r="3.5" fill="#caa96a"/><circle cx="134" cy="213" r="3.5" fill="#caa96a"/>'
      + '<g clip-path="url(#clip-' + u + ')"><rect x="30" y="50" width="180" height="340" fill="#0d0805"/><g opacity=".65">' + up + '</g>' + tr + low + '</g>'
      + '<path d="M64 64 C40 98,42 135,42 135 C42 178,92 198,106 208 L106 218 C92 230,34 262,34 326 C34 372,70 384,120 384 C170 384,206 372,206 326 C206 262,148 230,134 218 L134 208 C148 198,198 178,198 135 C198 98,176 64,176 64 Z" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2.2"/>'
      + '<path d="M54 90 C48 115,52 145,66 170" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3" stroke-linecap="round"/>'
      + '<path d="M46 280 C40 318,50 354,76 374" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3.5" stroke-linecap="round"/>'
      + '<path d="M194 285 C200 320,190 355,168 374" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2" stroke-linecap="round"/>'
      + '<g opacity=".75" pointer-events="none"><line x1="194" y1="230" x2="194" y2="370" stroke="#ffd966" stroke-width="1" stroke-dasharray="1 1"/>' + mk + '</g>'
      + '<rect x="16" y="38" width="208" height="14" rx="2" fill="url(#mh-' + u + ')" stroke="#694d1f" stroke-width="1"/><rect x="26" y="48" width="188" height="8" rx="1" fill="url(#br-' + u + ')"/>'
      + '<polygon points="120,6 128,26 120,38 112,26" fill="url(#br-' + u + ')" stroke="#4f3813" stroke-width="1"/><circle cx="120" cy="24" r="3" fill="#fff"/>'
      + '<circle cx="30" cy="30" r="5" fill="url(#br-' + u + ')" stroke="#4f3813" stroke-width="1"/><circle cx="210" cy="30" r="5" fill="url(#br-' + u + ')" stroke="#4f3813" stroke-width="1"/>'
      + '<rect x="26" y="384" width="188" height="8" rx="1" fill="url(#br-' + u + ')"/><rect x="16" y="392" width="208" height="28" rx="3" fill="url(#mh-' + u + ')" stroke="#694d1f" stroke-width="1"/>'
      + '<rect x="24" y="420" width="20" height="6" rx="2" fill="url(#br-' + u + ')"/><rect x="196" y="420" width="20" height="6" rx="2" fill="url(#br-' + u + ')"/>'
      + '<rect x="36" y="396" width="168" height="22" rx="3" fill="#1b1108" stroke="url(#br-' + u + ')" stroke-width="1.5"/><circle cx="43" cy="407" r="2" fill="#caa96a"/><circle cx="197" cy="407" r="2" fill="#caa96a"/>'
      + '<text x="120" y="411" fill="#fcedba" font-size="10.5" font-family="\'Cinzel Decorative\',serif" font-weight="bold" letter-spacing="1.2" text-anchor="middle">' + k.toUpperCase() + ' · ' + pts + ' PTS</text>'
      + '</svg>';
  }

  /* ── Render de los 4 relojes + placa de líder ── */
  function renderCopa(points) {
    var relojesEl = $('#relojes'), leaderEl = $('#copaLeader');
    if (!relojesEl || !leaderEl) return;
    function pts(k) { return Number(points[k]) || 0; }
    var list = KEYS_DATA.map(pts);
    var total = list.reduce(function (a, b) { return a + b; }, 0);
    var max = Math.max.apply(null, [100].concat(list));
    var sorted = KEYS_DATA.slice().sort(function (a, b) { return pts(b) - pts(a); });
    var tied = total === 0 || pts(sorted[0]) === pts(sorted[1]);

    leaderEl.innerHTML = tied
      ? '⚔️ <b>Empate en la cumbre:</b> la disputa por la Copa está más reñida que nunca.'
      : '👑 Liderando la Copa: <b>' + sorted[0] + '</b> con <b>' + pts(sorted[0]).toLocaleString('es-ES') + '</b> puntos';

    relojesEl.innerHTML = KEYS_DATA.map(function (k) {
      var p = pts(k), g = GEMS_DATA[k] || { pri: '#ffd700', bord: '#b8860b', gem: 'Gemas', gg: 'rgba(255,215,0,.3)', crest: '✨' };
      var fill = p > 0 ? Math.max(8, Math.min(100, Math.round(p / max * 92))) : 0;
      var rank = sorted.indexOf(k) + 1;
      var lead = p > 0 && rank === 1 && !tied;
      var relics = (typeof window !== 'undefined' && window.RELICS) ? window.RELICS : ((typeof RELICS !== 'undefined') ? RELICS : null);
      var relicSvg = (relics && relics[k[0]]) ? relics[k[0]] : g.crest;
      return '<article class="hgcard" style="--gg:' + g.gg + ';--gb:' + g.bord + ';--ha:' + g.pri + '" title="Toca el reloj: las gemas tintinean">'
        + '<div class="hg-head">'
        +   '<div class="hg-id">'
        +     '<span class="hg-crest" aria-label="' + k + '">' + relicSvg + '</span>'
        +     '<div class="hg-meta">'
        +       '<div class="hg-name-row"><span class="hg-name">' + k + '</span><span class="hg-crest-badge">' + g.crest + '</span></div>'
        +       '<span class="hg-gemname">' + g.gem + '</span>'
        +     '</div>'
        +   '</div>'
        +   '<span class="hg-rank' + (lead ? ' lead' : '') + '">' + (lead ? '👑' : '#' + rank) + '</span>'
        + '</div>'
        + '<div class="hg-stage">' + hourglassSVG(k, p, fill) + '</div>'
        + '<div class="hg-read"><span class="num">' + p.toLocaleString('es-ES') + '</span><span class="lbl">Puntos Oficiales</span></div>'
        + '<p class="hg-lore">«' + g.gem + '»</p></article>';
    }).join('');
  }

  /* ── Init: cache local → render → fetch silencioso → poll cada 30s ── */
  if ($('#relojes')) {
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem('hogwarts_copa_puntos') || 'null'); } catch (e) { }
    renderCopa(cached || { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 });

    function sync() {
      if (typeof fetch !== 'function' || !P_URL) return;
      fetch(P_URL)
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (d) {
          var p = (d && d.houses) || null;
          if (p) {
            try { localStorage.setItem('hogwarts_copa_puntos', JSON.stringify(p)); } catch (e) { }
            renderCopa(p);
          }
        })
        .catch(function () { });
    }
    sync();
    setInterval(sync, 30000);

    /* clic delegado una sola vez (no se duplica en cada render) */
    $('#relojes').addEventListener('click', function (e) {
      var c = e.target.closest('.hgcard');
      if (c) { chime(); toastMsg('🔔 Las gemas tintinean: el sonido oficial de la Copa.'); }
    });
  }

})();