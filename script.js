<script>
/* =========================================================
   SCRIPT TAMBAHAN — LAGU ULANG TAHUN PAS TIUP LILIN
   Versi HP-friendly (ada log di layar)
   ========================================================= */

(function() {
  'use strict';

  const NAMA_FILE_LAGU = 'birthday song.mp3';
  const VOLUME_MAKSIMAL = 0.8;
  const DURASI_FADE_MS = 100;
  const STEP_FADE = 0.05;

  // ==== KOTAK LOG DI LAYAR ====
  function buatKotakLog() {
    if (document.getElementById('logLagu')) return;
    const box = document.createElement('div');
    box.id = 'logLagu';
    box.style.cssText = [
      'position:fixed',
      'bottom:8px',
      'left:8px',
      'right:8px',
      'max-height:120px',
      'overflow:auto',
      'background:rgba(0,0,0,0.75)',
      'color:#0f0',
      'font-family:monospace',
      'font-size:10px',
      'padding:6px 8px',
      'border-radius:8px',
      'z-index:99999',
      'line-height:1.4',
      'pointer-events:none'
    ].join(';');
    box.innerHTML = '<b>🎵 Log Lagu:</b><br>';
    document.body.appendChild(box);
  }

  function log(msg) {
    console.log(msg);
    buatKotakLog();
    const box = document.getElementById('logLagu');
    if (box) {
      box.innerHTML += '• ' + msg + '<br>';
      box.scrollTop = box.scrollHeight;
    }
  }

  // ==== BUAT ELEMEN AUDIO ====
  function siapkanAudio() {
    if (document.getElementById('laguUlangTahun')) return;
    const audio = document.createElement('audio');
    audio.id = 'laguUlangTahun';
    audio.src = NAMA_FILE_LAGU;
    audio.loop = true;
    audio.preload = 'auto';

    // Event listener buat tau statusnya
    audio.addEventListener('canplay', function() {
      log('Lagu berhasil dimuat ✅');
    });
    audio.addEventListener('error', function() {
      log('❌ Lagu GAGAL dimuat!');
      log('Cek: nama file & folder');
    });
    audio.addEventListener('play', function() {
      log('▶️ Lagu mulai muter');
    });
    audio.addEventListener('pause', function() {
      log('⏸️ Lagu pause');
    });

    document.body.appendChild(audio);
    log('Elemen audio dibuat');
  }

  // ==== FADE OUT ====
  function fadeOut(audio, callback) {
    if (!audio || audio.paused) {
      if (callback) callback();
      return;
    }
    let vol = audio.volume;
    const timer = setInterval(function() {
      vol -= STEP_FADE;
      if (vol <= 0) {
        vol = 0;
        clearInterval(timer);
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        if (callback) callback();
      } else {
        audio.volume = vol;
      }
    }, DURASI_FADE_MS);
  }

  // ==== FADE IN ====
  function fadeIn(audio) {
    if (!audio) return;
    audio.volume = 0;
    audio.play().then(function() {
      log('Fade in lagu baru...');
      let vol = 0;
      const timer = setInterval(function() {
        vol += STEP_FADE;
        if (vol >= VOLUME_MAKSIMAL) {
          vol = VOLUME_MAKSIMAL;
          clearInterval(timer);
        }
        audio.volume = vol;
      }, DURASI_FADE_MS);
    }).catch(function(err) {
      log('⚠️ Autoplay diblokir');
      log('Coba tap lagi tombolnya');
      audio.volume = VOLUME_MAKSIMAL;
      audio.play().catch(function(e) {
        log('❌ Masih gagal: ' + e.name);
      });
    });
  }

  // ==== FUNGSI UTAMA ====
  window.putarLaguUlangTahun = function() {
    log('=== TIUP LILIN DIKLIK ===');
    siapkanAudio();
    const laguBaru = document.getElementById('laguUlangTahun');
    const laguLama = document.getElementById('linkmp3');
    if (laguLama && !laguLama.paused) {
      log('Fade out lagu lama...');
    }
    fadeOut(laguLama, function() {
      fadeIn(laguBaru);
    });
  };

  // ==== AUTO OVERRIDE TOMBOL ====
  window.addEventListener('load', function() {
    log('Halaman siap, cari tombol tiup...');
    const semuaTombol = document.querySelectorAll('button');
    let tombolTiup = null;
    semuaTombol.forEach(function(btn) {
      const oc = btn.getAttribute('onclick');
      if (oc && oc.indexOf('tiupLilin') !== -1) {
        tombolTiup = btn;
      }
    });
    if (tombolTiup) {
      const onclickLama = tombolTiup.getAttribute('onclick');
      tombolTiup.setAttribute(
        'onclick',
        onclickLama + '; window.putarLaguUlangTahun();'
      );
      log('Tombol tiup OK ✅');
    } else {
      log('⚠️ Tombol tiup ga ketemu');
    }
    siapkanAudio();
  });

})();
</script>