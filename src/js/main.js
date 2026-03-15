(function(){
  // theme: по умолчанию системная, переключение только light <-> dark
  var STORAGE_KEY = 'coop-theme';
  function getSystemTheme(){ return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
  function getEffectiveTheme(){ return localStorage.getItem(STORAGE_KEY) || getSystemTheme(); }
  function applyTheme(t){
    var theme = t !== undefined ? t : (localStorage.getItem(STORAGE_KEY) || null);
    document.documentElement.removeAttribute('data-theme');
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    var effective = theme || getSystemTheme();
    var icon = document.querySelector('#theme-toggle .theme-icon');
    if (icon) {
      icon.className = 'theme-icon theme-icon-' + effective;
      icon.closest('button').setAttribute('title', effective === 'light' ? 'Тема: светлая' : 'Тема: тёмная');
    }
  }
  function cycleTheme(){
    var current = getEffectiveTheme();
    var next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }
  var toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', cycleTheme);
  applyTheme();
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(){ if (!localStorage.getItem(STORAGE_KEY)) applyTheme(); });

  // reveal
  function rv(){
    document.querySelectorAll('.r:not(.v)').forEach(function(el){
      if(el.getBoundingClientRect().top < window.innerHeight - 44) el.classList.add('v');
    });
  }
  window.addEventListener('scroll', rv, {passive:true});
  rv();

  // nav
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, {passive:true});
  }

  // smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
    });
  });

  // calculator
  var BASE=3500, UNION_MONTHLY=1000, IQ_M=50, IQ_D=50, PR_M=20, PR_D=10;
  function calc(){
    var cm = document.getElementById('cm');
    var cd = document.getElementById('cd');
    if (!cm || !cd) return;
    var m = Math.max(0, parseInt(cm.value)||0);
    var d = Math.max(0, parseInt(cd.value)||0);
    var union = UNION_MONTHLY;
    var eM = Math.max(0, m - IQ_M) * PR_M;
    var eD = Math.max(0, d - IQ_D) * PR_D;
    var total = Math.max(BASE, BASE + eM + eD) + union;
    var bd = ['базовый пакет ' + BASE.toLocaleString('ru') + ' ₽'];
    if(union > 0) bd.push('+ ' + union.toLocaleString('ru') + ' ₽ членство в союзе');
    if(eM > 0) bd.push('+' + eM + ' ₽ новые пайщики');
    if(eD > 0) bd.push('+' + eD + ' ₽ пакеты документов');
    var totalEl = document.getElementById('calc-total');
    var bdEl = document.getElementById('calc-bd');
    if (totalEl) totalEl.textContent = total.toLocaleString('ru') + ' ₽';
    if (bdEl) bdEl.innerHTML = bd.join('<br>');
  }
  var cmEl = document.getElementById('cm');
  var cdEl = document.getElementById('cd');
  if (cmEl) cmEl.addEventListener('input', calc);
  if (cdEl) cdEl.addEventListener('input', calc);
  calc();

  // demo copy buttons
  document.querySelectorAll('.demo-copy-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var val = btn.getAttribute('data-copy') || btn.previousElementSibling?.value || '';
      if (!val) return;
      navigator.clipboard.writeText(val).then(function(){
        var t = btn.textContent;
        btn.textContent = 'Скопировано';
        btn.classList.add('copied');
        setTimeout(function(){ btn.textContent = t; btn.classList.remove('copied'); }, 1500);
      });
    });
  });
})();
