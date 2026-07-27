// Theme toggle, scroll reveal, the night starfield, and the reading-progress bar.
// Shared across the home page and every post.

// expected read duration: computed from the post's own word count
(function () {
  var el = document.getElementById('read-time');
  var body = document.querySelector('.body');
  if (!el || !body) return;
  var clone = body.cloneNode(true);
  var end = clone.querySelector('.endnote');   // don't count the footer/next-card
  if (end) end.remove();
  clone.querySelectorAll('svg').forEach(function (s) { s.remove(); });  // diagrams aren't reading
  var text = (clone.textContent || '').trim();
  var words = text ? text.split(/\s+/).length : 0;
  var mins = Math.max(1, Math.round(words / 230));   // ~230 wpm, technical prose
  el.textContent = mins + ' min read';
})();

// reading progress: how far down the page you've scrolled
(function () {
  var bar = document.getElementById('reading-progress');
  if (!bar) return;
  function update() {
    var doc = document.documentElement;
    var scrollTop = window.pageYOffset || doc.scrollTop || document.body.scrollTop || 0;
    var max = doc.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? scrollTop / max : 0;
    if (ratio < 0) ratio = 0; if (ratio > 1) ratio = 1;
    bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

(function () {
  var btn = document.getElementById('themeToggle');
  var root = document.documentElement;
  if (!btn) return;
  btn.addEventListener('click', function () {
    // Dark is the default, so an unset theme counts as dark.
    var cur = root.getAttribute('data-theme') || 'dark';
    root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
    drawStars();
  });
})();

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.rise').forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rise').forEach(function (el) { io.observe(el); });
})();

var canvas = document.getElementById('stars');
var ctx = canvas ? canvas.getContext('2d') : null;
var stars = [];
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function isDark() {
  // Default theme is dark; only an explicit light toggle turns stars off.
  return document.documentElement.getAttribute('data-theme') !== 'light';
}
function seed() {
  if (!canvas) return;
  stars = [];
  var n = Math.min(120, Math.floor(window.innerWidth * window.innerHeight / 16000));
  for (var i = 0; i < n; i++) stars.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.0 + 0.2, base: Math.random() * 0.45 + 0.18,
    ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.5 + 0.15,
    red: Math.random() < 0.17   // a scatter of blood-red stars in the void
  });
}
function drawStars(t) {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!isDark()) return;
  for (var i = 0; i < stars.length; i++) {
    var s = stars[i], a = s.base;
    if (!reduce && t) a = s.base + Math.sin(t / 1000 * s.sp + s.ph) * 0.16;
    if (a < 0.04) a = 0.04;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = (s.red ? 'rgba(216,49,63,' : 'rgba(210,220,235,') + a.toFixed(3) + ')';
    ctx.fill();
  }
}
function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
  seed(); drawStars();
}
if (canvas) {
  window.addEventListener('resize', resize);
  resize();
  if (!reduce) (function loop(t){ drawStars(t); requestAnimationFrame(loop); })();
}

// scorecard tables: cap at 25 rows and page the overflow. Table-only; the
// pager appears just below a table only when it has more than 25 body rows.
(function () {
  var PER = 25;
  document.querySelectorAll('table.sc').forEach(function (table) {
    var tbody = table.tBodies[0];
    if (!tbody) return;
    var rows = Array.prototype.slice.call(tbody.rows);
    if (rows.length <= PER) return;   // small table: no pagination
    var pages = Math.ceil(rows.length / PER);
    var wrap = table.closest('.sc-table-wrap') || table.parentNode;
    var pager = document.createElement('nav');
    pager.className = 'sc-pager';
    pager.setAttribute('aria-label', 'Table pages');
    var btns = [];
    function show(p) {
      rows.forEach(function (r, i) {
        r.style.display = (i >= (p - 1) * PER && i < p * PER) ? '' : 'none';
      });
      btns.forEach(function (b, idx) {
        var on = idx === (p - 1);
        b.classList.toggle('active', on);
        if (on) { b.setAttribute('aria-current', 'page'); } else { b.removeAttribute('aria-current'); }
      });
    }
    for (var p = 1; p <= pages; p++) {
      (function (pp) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = pp;
        b.addEventListener('click', function () { show(pp); });
        pager.appendChild(b);
        btns.push(b);
      })(p);
    }
    wrap.parentNode.insertBefore(pager, wrap.nextSibling);
    show(1);
  });
})();
