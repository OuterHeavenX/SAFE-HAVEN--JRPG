'use strict';
(() => {
  const asset = {
    walk: null,
    ready: false,
    failed: false,
    frameW: 64,
    frameH: 64,
    cols: 6,
    rows: 4,
    directions: { down: 0, left: 1, right: 2, up: 3 }
  };

  function markReady(img) {
    asset.walk = img;
    asset.ready = true;
    asset.failed = false;
  }

  function markFailed(reason) {
    asset.failed = true;
    asset.ready = false;
    console.warn('[KaelLevel01]', reason);
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load ' + src));
      img.src = src;
    });
  }

  async function loadBase64Sheet() {
    try {
      const res = await fetch('assets/sprites/kael/level-01/walk-base64.txt?v=20260813-kael2');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const b64 = (await res.text()).trim();
      if (!b64 || b64.length < 100) throw new Error('Empty or invalid base64 payload');
      const img = await loadImage('data:image/png;base64,' + b64);
      markReady(img);
    } catch (err) {
      markFailed('Base64 sprite load failed: ' + err.message);
    }
  }

  async function init() {
    try {
      const png = await loadImage('assets/sprites/kael/level-01/walk.png?v=20260813-kael2');
      markReady(png);
      return;
    } catch (_) {}
    await loadBase64Sheet();
  }

  /**
   * Shared draw helper
   * - No extra shadow (sprite already has one)
   * - When not moving → always frame 0 (idle)
   */
  function draw(ctx, x, y, opts = {}) {
    const facing = opts.facing || 'down';
    const moving = !!opts.moving;
    const scale  = opts.scale != null ? opts.scale : 1.25;
    const bob    = opts.bob || 0;
    const time   = opts.time != null ? opts.time : performance.now();

    const img = asset.walk;
    const ready = asset.ready && img && img.complete && img.naturalWidth > 0;

    if (ready) {
      const fw = asset.frameW;
      const fh = asset.frameH;
      const cols = asset.cols;
      const row = (asset.directions[facing] != null) ? asset.directions[facing] : 0;

      // Idle = frame 0, walk = cycle
      const frame = moving ? (Math.floor(time / 95) % cols) : 0;

      const dw = Math.round(82 * scale);
      const dh = Math.round(82 * scale);

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      // NOTE: No extra shadow — the sprite already contains one

      ctx.drawImage(
        img,
        frame * fw, row * fh, fw, fh,
        Math.round(x - dw / 2),
        Math.round(y - dh * 0.55 + bob),
        dw, dh
      );
      ctx.restore();
      return true;
    }

    // Procedural fallback (only if sprite fails)
    const s = scale;
    const b = bob;
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(x, y + 14 * s, 12 * s, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const px = (px, py, w, h, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(px), Math.round(py), Math.round(w), Math.round(h));
    };
    px(x - 6*s, y - 8*s + b, 12*s, 12*s, '#d9a66b');
    px(x - 7*s, y - 9*s + b, 14*s,  5*s, '#39273b');
    px(x - 8*s, y + 3*s + b, 16*s, 13*s, '#44658c');
    px(x - 7*s, y +16*s + b,  6*s,  8*s, '#6d3d2f');
    px(x + 1*s, y +16*s + b,  6*s,  8*s, '#6d3d2f');
    px(x - 4*s, y - 2*s + b,  2*s,  2*s, '#24181a');
    px(x + 2*s, y - 2*s + b,  2*s,  2*s, '#24181a');
    return false;
  }

  window.KaelLevel01 = asset;
  window.KaelLevel01.draw = draw;
  window.KaelLevel01.reload = init;

  init();
})();