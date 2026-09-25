/* ═══════════════════════════════════════════════════════════
   js/retratos.js — Galería de Retratos Parlantes
   Dependencias: js/data.js (PORTRAITS, PAINT) y js/ui.js ($, $$, chime, toastMsg, observeReveals)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PORTR = (typeof window !== 'undefined' && window.PORTRAITS) ? window.PORTRAITS : ((typeof PORTRAITS !== 'undefined') ? PORTRAITS : []);
  var PAINTS = (typeof window !== 'undefined' && window.PAINT) ? window.PAINT : ((typeof PAINT !== 'undefined') ? PAINT : {});

  function snd(name) {
    var s = window.SucursalSound;
    if (s && typeof s[name] === 'function') { s[name](); }
    else if (s && typeof s.chime === 'function') { s.chime(); }
  }
  function reactSound(txt) {
    if (/🎶/.test(txt)) snd('bell');
    else if (/PRRR|superioridad|asfódelo/.test(txt)) snd('spark');
    else snd('chime');
  }

  /* ── Render de la galería ── */
  function renderGrid() {
    var grid = document.getElementById('portGrid');
    if (!grid) return;
    grid.innerHTML = PORTR.map(function (p, i) {
      return '<div class="port reveal" style="--rd:' + (i * .08) + 's" data-id="' + p.id + '">'
        + '<div class="port-frame">'
        + '<div class="port-top"><span class="port-mood">✦ ' + p.mood + '</span>'
        + '<button class="port-pet" data-pet="' + p.id + '" title="Acariciar el lienzo">✨ Interactuar</button></div>'
        + '<div class="port-canvas">' + (PAINTS[p.id] || '') + '<span class="port-eye"><i></i>Atento</span></div>'
        + '<p class="port-bio">' + p.bio + '</p>'
        + '<div class="port-plate"><b>' + p.name + '</b><small>' + p.title + '</small></div>'
        + '<span class="port-hint">💬 Haz clic en el marco para hablar</span>'
        + '</div></div>';
    }).join('');
    if (typeof observeReveals === 'function') observeReveals(grid);

    /* Clic: acariciar o abrir conversación */
    grid.addEventListener('click', function (e) {
      var pet = e.target.closest('.port-pet');
      if (pet) { e.stopPropagation(); quickPet(pet.dataset.pet); return; }
      var card = e.target.closest('.port');
      if (card) openModal(card.dataset.id);
    });

    /* Hover: el ojo indicador cambia */
    grid.addEventListener('mouseover', function (e) {
      var card = e.target.closest('.port'); if (!card) return;
      var eye = card.querySelector('.port-eye'); if (eye) eye.innerHTML = '<i></i>Observándote';
    });
    grid.addEventListener('mouseout', function (e) {
      var card = e.target.closest('.port'); if (!card) return;
      var eye = card.querySelector('.port-eye'); if (eye) eye.innerHTML = '<i></i>Atento';
    });
  }

  /* ── Reacción rápida al acariciar (♥) ── */
  function quickPet(id) {
    if (id === 'empty_frame') { snd('spark'); toastMsg('¡Prrrrr! Amasando el terciopelo…'); }
    else if (id === 'fat_lady') { snd('bell'); toastMsg('«¡Cuidado con mi copa de oporto!»'); }
    else if (id === 'sir_cadogan') { snd('spark'); toastMsg('«¡En guardia, bribón!»'); }
    else { snd('chime'); toastMsg('La lechuza parpadea con sabiduría'); }
  }

  /* ── Modal de conversación ── */
  function openModal(id) {
    var p = PORTR.filter(function (x) { return x.id === id; })[0];
    var m = document.getElementById('pmodal');
    if (!p || !m) return;
    document.getElementById('pmThumb').innerHTML = PAINTS[p.id] || '';
    document.getElementById('pmName').textContent = p.name;
    document.getElementById('pmTitle').textContent = p.title + ' · ' + p.mood;
    document.getElementById('pmSay').textContent = p.q0;
    var qs = document.getElementById('pmQs');
    qs.innerHTML = p.dlg.map(function (d, i) {
      return '<button class="pmodal-q" data-i="' + i + '"><span>💬 «' + d[0] + '»</span><span>Preguntar →</span></button>';
    }).join('');
    Array.prototype.forEach.call(qs.querySelectorAll('.pmodal-q'), function (b) {
      b.addEventListener('click', function () {
        var d = p.dlg[+b.dataset.i];
        document.getElementById('pmSay').textContent = d[1];
        reactSound(d[1]);
      });
    });
    m.classList.add('on');
    snd('chime');
  }

  /* ── Cierre del modal ── */
  (function () {
    var m = document.getElementById('pmodal'); if (!m) return;
    var x = document.getElementById('pmodalX');
    if (x) x.addEventListener('click', function () { m.classList.remove('on'); });
    m.addEventListener('click', function (e) { if (e.target === m) m.classList.remove('on'); });
  })();

  renderGrid();
})();