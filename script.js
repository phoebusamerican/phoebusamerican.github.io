// ── NAV SCROLL BEHAVIOR ──────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  if (!navbar) return;
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    // Only remove scrolled on homepage (hero pages)
    if (!navbar.classList.contains('force-scrolled')) {
      navbar.classList.remove('scrolled');
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── MOBILE MENU ───────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    const open = navLinksEl.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ── HERO VIDEO CYCLE ─────────────────────────────────────────
const videos = document.querySelectorAll('.hero-video');
const dots = document.querySelectorAll('.hero-dot');
const appTextEl = document.getElementById('appText');
const appLabels = ['Mobility', 'Industry', 'Agriculture'];

if (videos.length > 0) {
  let current = 0;
  let timer = null;

  function goTo(index) {
    // Fade out current
    videos[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');

    current = index;

    // Fade in next
    videos[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');

    // Play the video
    videos[current].currentTime = 0;
    videos[current].play().catch(() => {});

    // Update label
    if (appTextEl) {
      appTextEl.style.opacity = '0';
      setTimeout(() => {
        appTextEl.textContent = appLabels[current] || '';
        appTextEl.style.opacity = '1';
      }, 200);
    }
  }

  function next() {
    goTo((current + 1) % videos.length);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 7000);
  }

  // Dot click controls
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index, 10);
      goTo(index);
      startTimer();
    });
  });

  // Start cycling — wait for first video to play
  videos[0].addEventListener('canplay', () => {
    videos[0].play().catch(() => {});
    startTimer();
  }, { once: true });

  // Fallback: start timer anyway after 2s in case canplay already fired
  setTimeout(startTimer, 2000);
}

// ── CONTACT FORM ─────────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Message sent';
    btn.disabled = true;
    btn.style.opacity = '0.6';
  });
}