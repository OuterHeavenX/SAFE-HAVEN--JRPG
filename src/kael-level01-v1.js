'use strict';
(() => {
  // Proper Kael system using the real Idle / Walk / Attack sheets
  // assets/kael/sprites/Swordsman_lvl1_*.png

  const FRAME = 64;
  const DIRS = { down: 0, left: 1, right: 2, up: 3 };

  const sheets = {
    idle:   { img: null, cols: 12, ready: false },
    walk:   { img: null, cols: 6,  ready: false },
    attack: { img: null, cols: 8,  ready: false }
  };

  let readyCount = 0;
  const TOTAL = 3;

  function loadSheet(key, url, cols) {
    const img = new Image();
    img.onload = () => {
      sheets[key].img = img;
      sheets[key].cols = cols;
      sheets[key].ready = true;
      readyCount++;
      if (readyCount === TOTAL) {
        console.log('[Kael] Idle + Walk + Attack sheets ready');
      }
    };
    img.onerror = () => {
      console.warn('[Kael] Failed to load', url);
      sheets[key].ready = false;
    };
    img.src = url + '?v=20260813-real';
  }

  // Load the real sheets
  loadSheet('idle',   'assets/kael/sprites/Swordsman_lvl1_Idle_with_shadow.png', 12);
  loadSheet('walk',   'assets/kael/sprites/Swordsman_lvl1_Walk_with_shadow.png', 6);
  loadSheet('attack', 'assets/kael/sprites/Swordsman_lvl1_attack_with_shadow.png', 8);

  /**
   * Draw Kael
   * opts.state: 'idle' | 'walk' | 'attack'
   * opts.facing: 'down' | 'left' | 'right' | 'up'
   * opts.moving: boolean (only used for walk)
   * opts.frame: optional forced frame
   * opts.scale, opts.bob, opts.time
   */
  function draw(ctx, x, y, opts = {}) {
    const state  = opts.state || (opts.moving ? 'walk' : 'idle');
    const facing = opts.facing || 'down';
    const scale  = opts.scale != null ? opts.scale : 1.25;
    const bob    = opts.bob || 0;
    const time   = opts.time != null ? opts.time : performance.now();

    const sheet = sheets[state] || sheets.idle;
    const img = sheet.img;

    if (!sheet.ready || !img || !img.complete || img.naturalWidth === 0) {
      // very simple fallback
      ctx.fillStyle = '#d9a66b';
      ctx.fillRect(x - 10, y - 30, 20, 30);
      return false;
    }

    const cols = sheet.cols;
    const row = DIRS[facing] != null ? DIRS[facing] : 0;
    let frame;

    if (opts.frame != null) {
      frame = opts.frame % cols;
    } else if (state === 'idle') {
      // slow gentle idle cycle
      frame = Math.floor(time / 180) % cols;
    } else if (state === 'walk') {
      frame = Math.floor(time / 95) % cols;
    } else if (state === 'attack') {
      frame = Math.floor(time / 70) % cols;
    } else {
      frame = 0;
    }

    const dw = Math.round(FRAME * scale * 1.28);
    const dh = Math.round(FRAME * scale * 1.28);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      img,
      frame * FRAME, row * FRAME, FRAME, FRAME,
      Math.round(x - dw / 2),
      Math.round(y - dh * 0.72 + bob),
      dw, dh
    );

    ctx.restore();
    return true;
  }

  // Public API
  window.KaelLevel01 = {
    sheets,
    draw,
    // helpers
    isReady: () => readyCount >= 2, // at least idle+walk
    playAttack: false // can be set true temporarily for attack anim
  };
})();