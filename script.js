/* =========================================================
   CONTEÚDO — edite aqui
   ========================================================= */

// Vídeos (aparecem na faixa do topo e em "Trabalhos")
const VIDEOS = [
  { title: 'Corretor Leandro Ramos', cat: 'imobiliario', label: 'Imobiliário', poster: 'assets/posters/leandro.jpg', src: 'videos/imob/Corretor Leadro ramos.mp4' },
  { title: 'Orion Locações', cat: 'publicidade', label: 'Publicidade', poster: 'assets/posters/orion.jpg', src: 'videos/Orion Locações - Video promocional.mp4' },
  { title: 'Ellen — GranDoces', cat: 'culinario', label: 'Culinário', poster: 'assets/posters/ellen.jpg', src: 'videos/Ellen - GranDoces.mp4' },
  { title: 'Áttila — Al Mare', cat: 'imobiliario', label: 'Imobiliário', poster: 'assets/posters/attila.jpg', src: 'videos/imob/Corretor Attila.mp4' },
  { title: 'BM Outlet', cat: 'publicidade', label: 'Publicidade', poster: 'assets/posters/bm.jpg', src: 'videos/BM Outlet - Video promocional.mp4' },
  { title: 'Corretor Luiz Jr', cat: 'imobiliario', label: 'Imobiliário', poster: 'assets/posters/luiz.jpg', src: 'videos/imob/Corretor Luiz Jr.mp4' },
  { title: 'Serelepe & Cia — Arraiá da Marcela', cat: 'publicidade', label: 'Publicidade', poster: 'assets/posters/selepe.jpg', src: 'videos/Selepe & Cia - Arraia Marcela.mp4' },
  { title: 'Brincadeira de Criança — Arraiá da Marcela', cat: 'publicidade', label: 'Publicidade', poster: 'assets/posters/brincadeira.jpg', src: 'videos/Brincadeira de Criança - Arraia Marcela.mp4' },
];

// Sites (imagem = print da página inteira, 1200px de largura)
const SITES = [
  { nome: 'Eloah Make Up', url: 'https://eloahmakeup.com/', tipo: 'Loja virtual de maquiagem', imagem: 'assets/sites/eloah.jpg' },
  { nome: 'Imports Original', url: 'https://www.importsoriginal.com/', tipo: 'Catálogo de eletrônicos', imagem: 'assets/sites/imports.jpg' },
  { nome: 'Cine Company', url: 'https://www.revendacinecompany.com/', tipo: 'Landing page de revenda', imagem: 'assets/sites/cine.jpg' },
];

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  let vh = innerHeight;
  let soundOn = false;

  /* ---------- Render: faixa e grade ---------- */
  const stripTrack = $('#stripTrack');
  const worksGrid = $('#worksGrid');

  const clipHTML = (v, i, hidden) => `
    <button class="clip" data-i="${i}" ${hidden ? 'aria-hidden="true" tabindex="-1"' : `aria-label="Assistir: ${esc(v.title)}"`}>
      <img src="${v.poster}" alt="" loading="lazy">
      <video muted loop playsinline preload="none"></video>
      <span class="clip-label">${esc(v.title)}</span>
    </button>`;

  stripTrack.innerHTML = VIDEOS.map((v, i) => clipHTML(v, i, false)).join('') +
    VIDEOS.map((v, i) => clipHTML(v, i, true)).join('');

  worksGrid.innerHTML = VIDEOS.map((v, i) => `
    <button class="work" data-i="${i}" data-cat="${v.cat}" aria-label="Assistir: ${esc(v.title)}">
      <img src="${v.poster}" alt="" loading="lazy">
      <video muted loop playsinline preload="none"></video>
      <span class="work-play">${playIcon}</span>
      <span class="work-meta"><small>${v.label}</small><strong>${esc(v.title)}</strong></span>
    </button>`).join('');

  // Prévia ao passar o mouse + abrir player ao clicar
  $$('.clip, .work').forEach((el) => {
    const v = VIDEOS[el.dataset.i];
    const video = $('video', el);
    if (finePointer) {
      el.addEventListener('mouseenter', () => {
        if (!video.getAttribute('src')) video.src = v.src;
        video.muted = !soundOn;
        video.play().then(() => el.classList.add('is-playing')).catch(() => {});
      });
      el.addEventListener('mouseleave', () => {
        el.classList.remove('is-playing');
        video.pause();
      });
    }
    el.addEventListener('click', () => openTheater(v.src, v.title, v.label));
  });

  /* ---------- Filtros ---------- */
  $$('.chip[data-filter]').forEach((chip) => {
    chip.addEventListener('click', () => {
      $$('.chip[data-filter]').forEach((c) => c.classList.toggle('is-active', c === chip));
      const f = chip.dataset.filter;
      $$('.work').forEach((w) => w.classList.toggle('is-out', f !== 'all' && w.dataset.cat !== f));
    });
  });

  /* ---------- Som ---------- */
  const soundBtn = $('#soundBtn');
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    $$('.clip video, .work video').forEach((v) => { v.muted = !soundOn; });
  });

  /* ---------- Player ---------- */
  const theater = $('#theater');
  const tVideo = $('#theaterVideo');
  let lastFocus = null;

  function openTheater(src, title, label) {
    lastFocus = document.activeElement;
    $('#theaterTitle').textContent = title;
    $('#theaterSub').textContent = label;
    $$('.clip video, .work video').forEach((v) => v.pause());
    tVideo.src = src;
    tVideo.muted = false;
    theater.hidden = false;
    document.body.style.overflow = 'hidden';
    tVideo.play().catch(() => {});
    $('.theater-info .pill', theater).focus({ preventScroll: true });
  }

  function closeTheater() {
    if (theater.hidden) return;
    tVideo.pause();
    tVideo.removeAttribute('src');
    tVideo.load();
    theater.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus({ preventScroll: true });
  }

  $$('[data-close]', theater).forEach((el) => el.addEventListener('click', closeTheater));
  $('#reelBadge').addEventListener('click', () => openTheater('videos/reel/reel.mp4', 'Showreel', 'Trechos de 8 projetos'));

  /* ---------- Sites ---------- */
  const sitesGrid = $('#sitesGrid');
  const domainOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } };

  sitesGrid.innerHTML = SITES.map((s) => `
    <article class="site">
      <a class="site-frame" href="${s.url}" target="_blank" rel="noopener" aria-label="Abrir ${esc(s.nome)}">
        <div class="site-bar"><i></i><i></i><i></i><span>${domainOf(s.url)}</span></div>
        <div class="site-screen"><img src="${s.imagem}" alt="Página do site ${esc(s.nome)}" loading="lazy"></div>
      </a>
      <div class="site-meta">
        <div><h3>${esc(s.nome)}</h3><p>${esc(s.tipo)}</p></div>
        <a href="${s.url}" target="_blank" rel="noopener">Visitar ↗</a>
      </div>
    </article>`).join('');

  $$('.site-screen img').forEach((img) => {
    const measure = () => {
      const screen = img.parentElement;
      const travel = Math.max(0, img.offsetHeight - screen.offsetHeight);
      screen.style.setProperty('--pan', `${-travel}px`);
      screen.style.setProperty('--pan-t', `${Math.max(2, travel / 420).toFixed(2)}s`);
    };
    img.complete ? measure() : img.addEventListener('load', measure);
    addEventListener('resize', measure);
  });

  // Em telas de toque, a página rola sozinha quando o card aparece.
  if (!finePointer && !reduce) {
    const autoObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-auto', e.isIntersecting));
    }, { threshold: 0.6 });
    $$('.site').forEach((s) => autoObs.observe(s));
  }

  /* ---------- Marcas: duplica para o loop ---------- */
  const brands = $('#brandsTrack');
  brands.insertAdjacentHTML('beforeend', brands.innerHTML.replace(/<span>/g, '<span aria-hidden="true">'));

  /* ---------- Estrelas do hero ---------- */
  const canvas = $('#stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let heroVisible = true;

  function sizeStars() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((canvas.offsetWidth * canvas.offsetHeight) / 22000);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight * 0.7,
      r: Math.random() * 1.3 + 0.3,
      s: Math.random() * 0.8 + 0.2,
      o: Math.random() * Math.PI * 2,
    }));
  }

  function drawStars(t) {
    if (heroVisible) {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const st of stars) {
        const a = reduce ? 0.5 : 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t / 1000 * st.s + st.o));
        ctx.globalAlpha = a;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(st.x, (st.y - (reduce ? 0 : t / 400 * st.s) % canvas.offsetHeight + canvas.offsetHeight) % canvas.offsetHeight, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (!reduce) requestAnimationFrame(drawStars);
  }

  sizeStars();
  requestAnimationFrame(drawStars);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe($('#inicio'));

  /* ---------- Teste no celular ---------- */
  const test = $('#teste');
  const steps = $$('#steps li');
  const punch = $('#testPunch');
  const phoneVideo = $('#phoneVideo');
  const phoneProgress = $('#phoneProgress');
  const phoneImg = document.createElement('img');
  phoneImg.alt = '';
  phoneImg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .25s,transform .35s cubic-bezier(.16,1,.3,1)';
  phoneVideo.after(phoneImg);

  const PHONE_SRC = ['videos/reel/reel.mp4', null, VIDEOS[0].src];
  let currentStep = -1;
  let swipeTimer = null;
  let swipeI = 0;

  function setStep(i) {
    if (i === currentStep) return;
    currentStep = i;
    steps.forEach((li, n) => li.classList.toggle('is-active', n === i));
    clearInterval(swipeTimer);

    if (i === 1) {
      // "conta quantos você pula": vídeos passando rápido
      phoneVideo.pause();
      phoneImg.style.opacity = '1';
      const swipe = () => {
        phoneImg.style.transition = 'none';
        phoneImg.style.transform = 'translateY(12%)';
        phoneImg.src = VIDEOS[swipeI++ % VIDEOS.length].poster;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          phoneImg.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1)';
          phoneImg.style.transform = 'none';
        }));
      };
      swipe();
      swipeTimer = setInterval(swipe, 700);
      return;
    }

    phoneImg.style.opacity = '0';
    const src = PHONE_SRC[i];
    if (phoneVideo.getAttribute('src') !== src) {
      phoneVideo.classList.add('is-swapping');
      setTimeout(() => {
        phoneVideo.src = src;
        phoneVideo.play().catch(() => {});
        phoneVideo.classList.remove('is-swapping');
      }, 300);
    } else {
      phoneVideo.play().catch(() => {});
    }
  }

  phoneVideo.addEventListener('timeupdate', () => {
    if (phoneVideo.duration) phoneProgress.style.width = `${(phoneVideo.currentTime / phoneVideo.duration) * 100}%`;
  });

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (currentStep !== 1) phoneVideo.play().catch(() => {}); }
    else { phoneVideo.pause(); clearInterval(swipeTimer); currentStep = -1; }
  }).observe(test);

  /* ---------- Assinatura ---------- */
  const sign = $('#contato');
  const sigText = $('#sigText');
  const maskPath = $('#sigMaskPath');
  const flourish = $('#sigFlourish');
  const nib = $('#sigNib');
  const contact = $('#contact');
  let maskLen = 0;
  let flLen = 0;
  let sigBand = [0, 0];

  function buildSignature() {
    const b = sigText.getBBox();
    const x0 = b.x - 24;
    const x1 = b.x + b.width + 24;
    const top = b.y + 4;
    const bot = b.y + b.height - 4;
    const step = 34;
    sigBand = [b.y + b.height * 0.4, b.y + b.height * 0.72];

    // Traço em ziguezague que "escreve" da esquerda para a direita.
    let d = `M ${x0} ${top}`;
    let down = true;
    for (let x = x0 + step / 2; x <= x1 + step / 2; x += step / 2) {
      d += ` L ${x.toFixed(1)} ${down ? bot : top}`;
      down = !down;
    }
    maskPath.setAttribute('d', d);
    maskLen = maskPath.getTotalLength();
    maskPath.style.strokeDasharray = `${maskLen} ${maskLen}`;

    const w = b.width;
    const y = b.y + b.height * 0.86;
    flourish.setAttribute('d',
      `M ${b.x + w * 0.12} ${y + 8} C ${b.x + w * 0.38} ${y - 10}, ${b.x + w * 0.66} ${y + 22}, ${b.x + w * 1.02} ${y - 18}`);
    flLen = flourish.getTotalLength();
    flourish.style.strokeDasharray = `${flLen} ${flLen}`;

    const fb = flourish.getBBox();
    const vx = Math.min(b.x, fb.x) - 30;
    const vy = b.y - 16;
    const vw = Math.max(b.x + b.width, fb.x + fb.width) - vx + 30;
    const vhh = Math.max(b.y + b.height, fb.y + fb.height) - vy + 16;
    $('#sig').setAttribute('viewBox', `${vx.toFixed(0)} ${vy.toFixed(0)} ${vw.toFixed(0)} ${vhh.toFixed(0)}`);
    update();
  }

  function drawSignature(p) {
    const sp = range(p, 0.04, 0.56);
    const fp = range(p, 0.54, 0.68);
    const cp = range(p, 0.64, 0.86);
    sign.style.setProperty('--sp', sp.toFixed(3));
    sign.style.setProperty('--cp', cp.toFixed(3));

    if (maskLen) {
      maskPath.style.strokeDashoffset = maskLen * (1 - sp);
      const drawing = sp > 0 && sp < 1;
      nib.classList.toggle('is-on', drawing || (fp > 0 && fp < 1));
      if (drawing) {
        const pt = maskPath.getPointAtLength(maskLen * sp);
        nib.setAttribute('cx', pt.x);
        nib.setAttribute('cy', clamp(pt.y, sigBand[0], sigBand[1]));
      }
    }
    if (flLen) {
      flourish.style.strokeDashoffset = flLen * (1 - fp);
      if (fp > 0 && fp < 1) {
        const pt = flourish.getPointAtLength(flLen * fp);
        nib.setAttribute('cx', pt.x);
        nib.setAttribute('cy', pt.y);
      }
    }
    contact.classList.toggle('is-live', cp > 0.5);
  }

  /* ---------- Loop de rolagem ---------- */
  const nav = $('#nav');
  const menu = $('#menu');
  let lastY = scrollY;
  let ticking = false;

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function update() {
    ticking = false;
    const y = scrollY;

    nav.classList.toggle('is-scrolled', y > 30);
    if (!menu.classList.contains('is-open')) {
      if (y > vh * 0.8 && y > lastY + 4) nav.classList.add('is-hidden');
      else if (y < lastY - 4 || y < vh * 0.8) nav.classList.remove('is-hidden');
    }
    lastY = y;

    // Teste no celular
    if (reduce) {
      steps.forEach((li) => li.classList.add('is-active'));
    } else {
      const r = test.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = range(-r.top, 0, test.offsetHeight - vh);
        setStep(p < 0.3 ? 0 : p < 0.62 ? 1 : 2);
        punch.classList.toggle('is-on', p > 0.72);
      }
    }

    // Assinatura
    if (reduce) drawSignature(1);
    else {
      const r = sign.getBoundingClientRect();
      drawSignature(range(-r.top, 0, sign.offsetHeight - vh));
    }
  }

  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', () => { vh = innerHeight; sizeStars(); requestUpdate(); });

  /* ---------- Menu ---------- */
  const burger = $('#burger');

  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) return closeMenu();
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    nav.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
  });

  addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeTheater(); closeMenu(); } });

  /* ---------- Âncoras ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 ? $(id) : null;
      if (!target) return;
      e.preventDefault();
      closeMenu();
      // "Contato" vai direto ao fim da assinatura, onde o contato já está visível.
      const top = target === sign && !reduce
        ? sign.offsetTop + sign.offsetHeight - vh
        : target.getBoundingClientRect().top + scrollY;
      scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Revelação ---------- */
  if (!reduce) {
    const targets = $$('.head, .work, .svc, .focus, .site, .about-photo, .about-text > *');
    targets.forEach((el) => el.classList.add('rv'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    targets.forEach((el) => obs.observe(el));
  }

  /* ---------- Início ---------- */
  update();
  (document.fonts?.ready || Promise.resolve()).then(buildSignature);

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    html.classList.remove('is-loading');
  };
  if (document.readyState === 'complete') setTimeout(start, 150);
  else addEventListener('load', () => setTimeout(start, 150), { once: true });
  setTimeout(start, 1800);
})();
