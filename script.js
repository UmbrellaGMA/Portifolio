// ===== CINEMATOGRAPHIC INTRO & HERO ANIMATION =====
window.addEventListener('DOMContentLoaded', () => {
  const introCurtain = id('introCurtain');
  const hero = id('hero');
  const heroTitleGiant = id('heroTitleGiant');
  
  // Stagger letters transition delay for "PORTFÓLIO"
  if (heroTitleGiant) {
    const letters = heroTitleGiant.querySelectorAll('.word-mask span');
    letters.forEach((letter, idx) => {
      letter.style.transitionDelay = `${0.35 + idx * 0.05}s`;
    });
  }

  // Entrance Sequence (1.5 - 2.2 seconds)
  setTimeout(() => {
    if (introCurtain) introCurtain.classList.add('loaded');
    if (hero) hero.classList.add('loaded');
  }, 1100);
});

function id(name) { return document.getElementById(name); }

// ===== DISCRETE AUDIOVISUAL CUSTOM CURSOR =====
const cursor = id('customCursor');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

if (cursor && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states on interactive elements
  const hoverables = document.querySelectorAll('a, button, .proj-card, .spec-card, .reel-wrapper, .tool-card');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

// ===== MULTI-LAYER MOUSE PARALLAX (DESKTOP) =====
const heroTypoWrap = id('heroTypoWrap');
const heroTopBar = document.querySelector('.hero-top-bar');
const heroBottomBar = document.querySelector('.hero-bottom-bar');

if (window.matchMedia('(min-width: 769px)').matches) {
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const normX = (e.clientX - cx) / cx; // -1 to 1
    const normY = (e.clientY - cy) / cy; // -1 to 1

    // Giant PORTFÓLIO text parallax
    if (heroTypoWrap) {
      heroTypoWrap.style.transform = `translate(calc(-50% + ${normX * -20}px), calc(-50% + ${normY * -12}px))`;
    }

    // UI elements parallax
    if (heroTopBar) {
      heroTopBar.style.transform = `translate(${normX * 8}px, ${normY * 6}px)`;
    }
    if (heroBottomBar) {
      heroBottomBar.style.transform = `translate(${normX * 8}px, ${normY * 6}px)`;
    }
  });
}

// ===== SCROLL PARALLAX & CINEMATIC HERO EXIT =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroHeight = window.innerHeight;

  if (scrolled <= heroHeight) {
    const ratio = scrolled / heroHeight;
    
    // Giant PORTFÓLIO text horizontal slide & fade out
    if (heroTypoWrap) {
      heroTypoWrap.style.transform = `translate(calc(-50% + ${scrolled * 0.35}px), calc(-50% + ${scrolled * 0.15}px))`;
      heroTypoWrap.style.opacity = `${1 - ratio * 1.2}`;
    }
  }

  // Nav bar scroll state
  const nav = document.querySelector('.nav');
  if (nav) {
    nav.classList.toggle('scrolled', scrolled > 60);
  }
});

// ===== MOBILE MENU =====
const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ===== STATS COUNTER =====
const statNums = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const counter = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(counter); }
        el.textContent = current + suffix;
      }, 30);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => countObserver.observe(el));

// ===== PROJECT FILTER =====
const cats = document.querySelectorAll('.proj-cat');
const cards = document.querySelectorAll('.proj-card');
cats.forEach(cat => {
  cat.addEventListener('click', () => {
    cats.forEach(c => c.classList.remove('active'));
    cat.classList.add('active');
    const filter = cat.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.style.display = '';
        setTimeout(() => card.style.opacity = '1', 50);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 400);
      }
    });
  });
});

// ===== SMOOTH ANCHOR =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== VERTICAL VIDEO FILTER & LIGHTBOX MODAL =====
const vFilterBtns = document.querySelectorAll('.v-filter-btn');
const vCards = document.querySelectorAll('.vertical-card');
const vModal = id('videoModal');
const vModalBackdrop = id('vModalBackdrop');
const vModalClose = id('vModalClose');
const vModalVideo = id('vModalVideo');
const vModalBadge = id('vModalBadge');
const vModalTitle = id('vModalTitle');
const vModalSub = id('vModalSub');

// Filtering
vFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    vFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    vCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.style.display = '';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// Card Interaction: Hover preview & Lightbox Modal trigger
vCards.forEach(card => {
  const video = card.querySelector('video');

  card.addEventListener('mouseenter', () => {
    if (video && video.querySelector('source')) {
      video.play().catch(() => {});
    }
  });

  card.addEventListener('mouseleave', () => {
    if (video && video.querySelector('source')) {
      video.pause();
      video.currentTime = 0;
    }
  });

  card.addEventListener('click', () => {
    const title = card.dataset.title || 'Vídeo Vertical';
    const sub = card.dataset.sub || '';
    const badge = card.querySelector('.v-badge')?.textContent || 'VÍDEO';
    const sourceEl = video?.querySelector('source');
    const rawSrc = sourceEl?.src || card.dataset.video || '';
    const videoSrc = rawSrc.split('#')[0];

    if (vModalTitle) vModalTitle.textContent = title;
    if (vModalSub) vModalSub.textContent = sub;
    if (vModalBadge) vModalBadge.textContent = badge;

    if (vModalVideo) {
      if (videoSrc) {
        vModalVideo.removeAttribute('poster');
        vModalVideo.src = videoSrc;
        vModalVideo.load();
        vModalVideo.play().catch(() => {});
      } else {
        vModalVideo.removeAttribute('src');
      }
    }

    if (vModal) vModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Close Modal
function closeVModal() {
  if (vModal) vModal.classList.remove('active');
  if (vModalVideo) {
    vModalVideo.pause();
    vModalVideo.currentTime = 0;
  }
  document.body.style.overflow = '';
}

if (vModalClose) vModalClose.addEventListener('click', closeVModal);
if (vModalBackdrop) vModalBackdrop.addEventListener('click', closeVModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && vModal?.classList.contains('active')) {
    closeVModal();
  }
});

