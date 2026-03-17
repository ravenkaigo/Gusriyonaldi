/* ─────────────────────────────────────────────────────────────
   main.js — Gusri Yonaldi Portfolio
   ───────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  /* ── 1. Scroll Progress Bar ──────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ── 2. Animate-in (Intersection Observer) ───────────────── */
  const animateEls = document.querySelectorAll('.animate-in');
  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.animate-in'))
          : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        animObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  animateEls.forEach(el => animObserver.observe(el));

  /* ── 3. Nav: hide on down-scroll, show on up-scroll ─────── */
  const nav = document.querySelector('nav');
  let lastScroll = 0;
  function handleNavScroll() {
    const curr = window.scrollY;
    if (nav) {
      nav.style.transform = (curr > 80 && curr > lastScroll)
        ? 'translateY(-100%)'
        : 'translateY(0)';
      nav.style.transition = 'transform 0.3s ease';
      nav.classList.toggle('scrolled', curr > 60);
    }
    lastScroll = curr;
  }

  /* ── 4. Active nav link on scroll ───────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ── 5. Parallax doodles ─────────────────────────────────── */
  const parallaxEls = document.querySelectorAll('.parallax-doodle');
  function handleParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach((el, i) => {
      const speed = 0.04 + (i % 4) * 0.025;
      const dir   = i % 2 === 0 ? 1 : -1;
      el.style.transform = `translateY(${scrollY * speed * dir}px)`;
    });
  }

  /* ── 6. Back-to-top button ───────────────────────────────── */
  const btt = document.getElementById('back-to-top');
  function handleBtt() {
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  }
  if (btt) {
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 7. Scroll event aggregator ─────────────────────────── */
  window.addEventListener('scroll', () => {
    updateProgress();
    handleNavScroll();
    highlightNav();
    handleParallax();
    handleBtt();
  }, { passive: true });

  /* ── 8. Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        const mobile = document.getElementById('nav-mobile');
        if (mobile) mobile.classList.remove('open');
        const burger = document.getElementById('nav-hamburger');
        if (burger) burger.classList.remove('open');
      }
    });
  });

  /* ── 9. Mobile hamburger menu ────────────────────────────── */
  const burger  = document.getElementById('nav-hamburger');
  const mobile  = document.getElementById('nav-mobile');
  const mClose  = document.getElementById('nav-mobile-close');

  function openMobile() {
    if (mobile) mobile.classList.add('open');
    if (burger) burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    if (mobile) mobile.classList.remove('open');
    if (burger) burger.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (burger) burger.addEventListener('click', openMobile);
  if (mClose) mClose.addEventListener('click', closeMobile);

  /* ── 10. Typewriter effect (hero subtitle) ───────────────── */
  const typeTarget = document.getElementById('typewriter-text');
  const phrases = [
    'Graphic Designer',
    'Social Media Specialist',
    'IT Specialist',
    'Junior Web Developer',
    'AI Tools Enthusiast',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function typeStep() {
    if (!typeTarget) return;
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      typeTarget.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(typeStep, 2000);
        return;
      }
      setTimeout(typeStep, 75);
    } else {
      typeTarget.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeStep, 400);
        return;
      }
      setTimeout(typeStep, 40);
    }
  }
  typeStep();

  /* ── 11. Animated stat counters ──────────────────────────── */
  const statEls = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const duration = 1400;
        const step = Math.ceil(duration / end);
        const timer = setInterval(() => {
          start += 1;
          el.textContent = start + suffix;
          if (start >= end) { el.textContent = end + suffix; clearInterval(timer); }
        }, step);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach(el => countObserver.observe(el));

  /* ── 12. Cursor sparkle effect ───────────────────────────── */
  const sparkleChars = ['♛', '✦', '★', '→', '↗', '✏', '◆', '⬟'];
  let sparkleTimer;
  document.addEventListener('mousemove', (e) => {
    clearTimeout(sparkleTimer);
    sparkleTimer = setTimeout(() => {
      if (Math.random() > 0.82) {
        const spark = document.createElement('span');
        spark.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
        spark.style.cssText = `
          position:fixed;
          left:${e.clientX + 10}px;
          top:${e.clientY - 10}px;
          font-family:'Caveat',cursive;
          font-size:${0.7 + Math.random() * 0.7}rem;
          color:rgba(244,208,63,0.8);
          pointer-events:none;
          z-index:9999;
          transition:opacity 0.6s,transform 0.6s;
          opacity:1;
          user-select:none;
        `;
        document.body.appendChild(spark);
        requestAnimationFrame(() => {
          spark.style.opacity = '0';
          spark.style.transform = `translateY(-${20 + Math.random() * 20}px)`;
        });
        setTimeout(() => spark.remove(), 680);
      }
    }, 25);
  });

  /* ── 13. Toast helper ────────────────────────────────────── */
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }
  window.showToast = showToast; // expose for inline handlers

  /* ── 14. Copy email on click ─────────────────────────────── */
  const emailLink = document.querySelector('a[href^="mailto:"]');
  if (emailLink) {
    emailLink.addEventListener('click', (e) => {
      e.preventDefault();
      const addr = emailLink.getAttribute('href').replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(addr).then(() => {
          showToast('📋 Email copied to clipboard!');
        });
      } else {
        window.location.href = emailLink.href;
      }
    });
  }

  /* ── 15. Skill card tilt on mouse move ───────────────────── */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 16. Timeline item description toggle ────────────────── */
  document.querySelectorAll('.timeline-item').forEach(item => {
    const desc = item.querySelector('.timeline-desc');
    if (!desc) return;

    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const isOpen = desc.classList.contains('desc-open');
      desc.classList.toggle('desc-open', !isOpen);
      item.classList.toggle('expanded', !isOpen);
    });
  });

})();
