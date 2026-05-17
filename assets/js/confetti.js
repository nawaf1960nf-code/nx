// Lightweight canvas confetti — no dependencies.
window.AppConfetti = (() => {
  function fire({ duration = 2500, count = 120 } = {}) {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:5000;";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const colors = ["#6c8cff","#8b66ff","#34d399","#fbbf24","#f87171","#22d3ee","#ec4899"];
    const parts = [];
    for (let i = 0; i < count; i++) {
      parts.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 18 - 6,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.4,
        opacity: 1
      });
    }
    const start = performance.now();
    function step(t) {
      const elapsed = t - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(p => {
        p.vy += 0.45;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.opacity = Math.max(0, 1 - elapsed / duration);
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (elapsed < duration) requestAnimationFrame(step);
      else canvas.remove();
    }
    requestAnimationFrame(step);
  }
  return { fire };
})();
