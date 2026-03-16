/**
 * Hero hex background — едва заметный паттерн
 * Plain script (no modules) — работает при file://
 */
function initHeroHex() {
  var bg = document.getElementById('hero-bg');
  if (!bg) return;

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  bg.appendChild(canvas);

  var width, height, hexPoints = [], size = 48;
  var driftYAmp = (0.015 + Math.random() * 0.02) * (bg.offsetHeight || 400);
  var driftYPeriod = 25 + Math.random() * 20;

  function resize() {
    width = bg.offsetWidth;
    height = bg.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function drawHex(t) {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 0.8;
    var r = size;
    var driftX = (t * 12) % (size * 2);
    var driftY = driftYAmp * Math.sin(t * (2 * Math.PI / driftYPeriod));
    hexPoints.forEach(function (p) {
      var radius = r * 0.5 * p.scale;
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var angle = Math.PI / 6 + (Math.PI / 3) * i;
        var x = p.x - driftX + radius * Math.cos(angle);
        var y = p.y + driftY + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      var theme = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      ctx.strokeStyle = theme === 'dark' ? "rgba(255,252,240,0.1)" : "rgba(14,13,10,0.07)";
      ctx.stroke();
    });
  }

  function buildGrid() {
    hexPoints = [];
    var rows = Math.ceil(height / (size * 0.86)) + 6;
    var cols = Math.ceil(width / size) + 6;
    var offsetY = -2 * size * 0.86;
    var offsetX = -2 * size;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var offset = y % 2 ? size / 2 : 0;
        hexPoints.push({
          x: offsetX + x * size + offset,
          y: offsetY + y * size * 0.86,
          scale: 1,
          phase: Math.random()
        });
      }
    }
  }

  function startAnim() {
    window._hexStart = performance.now();
    var startTime = window._hexStart;
    function tick() {
      var t = (performance.now() - startTime) / 1000;
      hexPoints.forEach(function (p) {
        var cycle = (t / 4.5 + p.phase) % 1;
        p.scale = 1 + 0.25 * Math.sin(cycle * Math.PI);
      });
      drawHex(t);
      requestAnimationFrame(tick);
    }
    tick();
  }

  function onResize() {
    var prevW = width, prevH = height;
    resize();
    if (width !== prevW || height !== prevH) {
      driftYAmp = (0.015 + Math.random() * 0.02) * (height || 400);
      driftYPeriod = 25 + Math.random() * 20;
      buildGrid();
    }
  }
  resize();
  window.addEventListener('resize', onResize);
  window.addEventListener('load', onResize);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(onResize).observe(bg);
  }
  if (!width || !height) {
    requestAnimationFrame(function () {
      onResize();
      if (width && height) { buildGrid(); startAnim(); }
    });
    return;
  }
  buildGrid();
  startAnim();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroHex);
} else {
  initHeroHex();
}
