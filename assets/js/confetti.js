/* Bloom — soft, feminine confetti for PR celebrations.
   Lightweight canvas particle system. */
const Confetti = (function () {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let parts = [];
  let raf = null;
  let lastTs = 0;

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const colors = ['#f78cb1','#c4a3f0','#ffd28c','#ffb8d2','#d2b8ff','#ffd2b8','#fff7e0'];

  function burst(opts = {}) {
    const cx = opts.x ?? window.innerWidth / 2;
    const cy = opts.y ?? window.innerHeight / 3;
    const count = opts.count ?? 80;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 4 + Math.random() * 6;
      parts.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        life: 0,
        ttl: 90 + Math.random() * 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() < 0.4 ? 'heart' : 'rect',
      });
    }
    if (!raf) loop(performance.now());
  }

  function loop(ts) {
    const dt = lastTs ? (ts - lastTs) / 16 : 1;
    lastTs = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts = parts.filter(p => p.life < p.ttl);
    parts.forEach(p => {
      p.vy += 0.18 * dt;
      p.vx *= 0.995;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.life += dt;
      const alpha = Math.max(0, 1 - p.life / p.ttl);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.6);
      } else {
        // heart
        const s = p.size / 6;
        ctx.beginPath();
        ctx.moveTo(0, 1.5 * s);
        ctx.bezierCurveTo(0, 0, -3 * s, 0, -3 * s, 2 * s);
        ctx.bezierCurveTo(-3 * s, 4 * s, 0, 5 * s, 0, 7 * s);
        ctx.bezierCurveTo(0, 5 * s, 3 * s, 4 * s, 3 * s, 2 * s);
        ctx.bezierCurveTo(3 * s, 0, 0, 0, 0, 1.5 * s);
        ctx.fill();
      }
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = null; lastTs = 0; }
  }

  function celebrate() {
    burst({ x: window.innerWidth * 0.3, y: window.innerHeight * 0.3, count: 60 });
    setTimeout(() => burst({ x: window.innerWidth * 0.7, y: window.innerHeight * 0.35, count: 60 }), 150);
    setTimeout(() => burst({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.25, count: 80 }), 300);
  }

  return { burst, celebrate };
})();
