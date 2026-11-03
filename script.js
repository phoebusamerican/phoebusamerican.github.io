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
const appLabels = ['Mobility', 'Metallurgy', 'Energy', 'Manufacturing'];
const MIN_DISPLAY_MS = 3500; // minimum time before advancing, even on short clips

if (videos.length > 0) {
  let current = 0;
  let minTimer = null;
  let minElapsed = false;
  let videoEnded = false;

  function updateLabel(index) {
    if (!appTextEl) return;
    appTextEl.style.opacity = '0';
    setTimeout(() => {
      appTextEl.textContent = appLabels[index] || '';
      appTextEl.style.opacity = '1';
    }, 200);
  }

  function goTo(index) {
    videos[current].classList.remove('active');
    videos[current].pause();
    dots[current] && dots[current].classList.remove('active');

    current = index;
    minElapsed = false;
    videoEnded = false;

    videos[current].currentTime = 0;
    videos[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
    videos[current].play().catch(() => {});
    updateLabel(current);

    // Start minimum display timer
    clearTimeout(minTimer);
    minTimer = setTimeout(() => {
      minElapsed = true;
      if (videoEnded) advance();
    }, MIN_DISPLAY_MS);
  }

  function advance() {
    goTo((current + 1) % videos.length);
  }

  // Attach ended listener to every video
  videos.forEach((vid, i) => {
    // Remove loop attribute programmatically in case it's set in HTML
    vid.removeAttribute('loop');

    vid.addEventListener('ended', () => {
      if (i !== current) return;
      videoEnded = true;
      if (minElapsed) advance();
    });
  });

  // Dot click controls
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearTimeout(minTimer);
      goTo(parseInt(dot.dataset.index, 10));
    });
  });

  // Kick off first video
  function startFirst() {
    videos[0].currentTime = 0;
    videos[0].play().catch(() => {});
    updateLabel(0);
    minTimer = setTimeout(() => {
      minElapsed = true;
      if (videoEnded) advance();
    }, MIN_DISPLAY_MS);
  }

  if (videos[0].readyState >= 3) {
    startFirst();
  } else {
    videos[0].addEventListener('canplay', startFirst, { once: true });
    // Fallback if canplay never fires (e.g. no video files yet)
    setTimeout(startFirst, 1500);
  }
}

// ── CONTACT FORM ─────────────────────────────────────────────
// Submits to the Formspree endpoint in the form's action attribute.
// (Previously this handler called preventDefault() and only changed the
// button text, so no message was ever actually sent.)
const form = document.getElementById('contactForm');
if (form) {
  const btn = form.querySelector('button[type="submit"]');
  const status = document.createElement('p');
  status.className = 'form-note';
  status.setAttribute('role', 'status');
  status.hidden = true;
  form.appendChild(status);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.hidden = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Request failed: ' + res.status);

      btn.textContent = 'Message sent';
      btn.style.opacity = '0.6';
      form.reset();
      status.textContent = 'Thanks! We\u2019ll be in touch soon.';
      status.hidden = false;
    } catch (err) {
      btn.disabled = false;
      btn.textContent = originalLabel;
      status.textContent = 'Something went wrong sending your message. Please try again, or email info@phoebusamerican.us.';
      status.hidden = false;
    }
  });
}