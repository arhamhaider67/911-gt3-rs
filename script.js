/* ═══════════════════════════════════════════════
   PORSCHE 911 GT3 RS — PREMIUM WEBSITE SCRIPTS
   ═══════════════════════════════════════════════ */

'use strict';

// ── UTILITY: Debounce ──
function debounce(fn, wait) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); };
}

// ── UTILITY: Wait for DOM ──
document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════
     1. NAVBAR — Scroll & Hamburger
  ═══════════════════════════════════════════════ */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('nav-menu');
  const navLinks   = document.querySelectorAll('.nav-link, .nav-cta');

  const updateNavbar = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) closeMenu();
  });

  // ESC key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
  });


  /* ═══════════════════════════════════════════════
     2. HERO — Parallax + Image Load Animation
  ═══════════════════════════════════════════════ */
  const heroImg = document.getElementById('hero-img');
  const heroBg  = document.getElementById('hero-bg');

  if (heroImg) {
    heroImg.addEventListener('load', () => {
      heroImg.classList.add('loaded');
    });
    if (heroImg.complete) heroImg.classList.add('loaded');
  }

  // Subtle parallax on scroll
  const handleParallax = () => {
    const scrollY = window.scrollY;
    if (heroBg && scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  };

  window.addEventListener('scroll', handleParallax, { passive: true });

  // Smooth active nav link highlighting
  const sections = document.querySelectorAll('section[id], footer[id]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
          link.style.color = '#E31E24';
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ═══════════════════════════════════════════════
     3. SCROLL ANIMATIONS — IntersectionObserver
  ═══════════════════════════════════════════════ */
  const animatedEls = document.querySelectorAll('[data-animate]');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => {
          el.classList.add('animated');
        }, delay);
        animObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(el => animObserver.observe(el));


  /* ═══════════════════════════════════════════════
     4. COUNTER ANIMATION — About Section
  ═══════════════════════════════════════════════ */
  const counters = document.querySelectorAll('.counter-num');
  let countersAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target   = parseInt(counter.dataset.target, 10);
      const duration = 1800;
      const start    = performance.now();

      const tick = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease     = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(ease * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else counter.textContent = target.toLocaleString();
      };

      requestAnimationFrame(tick);
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersAnimated) {
      countersAnimated = true;
      animateCounters();
    }
  }, { threshold: 0.5 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) counterObserver.observe(aboutSection);


  /* ═══════════════════════════════════════════════
     5. PERFORMANCE BARS ANIMATION
  ═══════════════════════════════════════════════ */
  const perfBars = document.querySelectorAll('.perf-bar-fill');
  let barsAnimated = false;

  const animateBars = () => {
    perfBars.forEach((bar, i) => {
      const targetWidth = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = targetWidth + '%';
      }, i * 150);
    });
  };

  const barObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !barsAnimated) {
      barsAnimated = true;
      animateBars();
    }
  }, { threshold: 0.3 });

  const perfSection = document.getElementById('performance');
  if (perfSection) barObserver.observe(perfSection);


  /* ═══════════════════════════════════════════════
     6. GALLERY LIGHTBOX
  ═══════════════════════════════════════════════ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxCap  = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const images = [
    { src: 'assets/images/gt3rs-front-face.jpg', alt: 'Porsche 911 GT3 RS front view golden hour', caption: 'Front View · Golden Hour · Road' },
    { src: 'assets/images/gt3rs-rear-flames.jpg', alt: 'GT3 RS rear with exhaust flames at sunset', caption: 'Raw Power · Exhaust Flames · Sunset' },
    { src: 'assets/images/gt3rs-rear-clean.jpg', alt: 'GT3 RS rear view California plate', caption: 'Rear View · Swan Wing · California' },
    { src: 'assets/images/gt3rs-side-front.jpg', alt: 'GT3 RS side front angle red wheels', caption: 'Side View · Red Rims · Weissach #99' },
    { src: 'assets/images/gt3rs-side-low.jpg', alt: 'GT3 RS low angle side sunset', caption: 'Low Profile · Sunset · Race Livery' },
  ];

  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const img = images[index];
    lightboxImg.src  = img.src;
    lightboxImg.alt  = img.alt;
    lightboxCap.textContent = img.caption;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    galleryItems[currentIndex]?.focus();
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });


  /* ═══════════════════════════════════════════════
     7. FAQ ACCORDION
  ═══════════════════════════════════════════════ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', !isOpen);
    });
  });


  /* ═══════════════════════════════════════════════
     8. COLOR CARD — Selection Highlight
  ═══════════════════════════════════════════════ */
  const colorCards = document.querySelectorAll('.color-card');

  colorCards.forEach(card => {
    card.addEventListener('click', () => {
      colorCards.forEach(c => {
        c.style.borderColor = '';
        c.style.transform   = '';
      });
      card.style.borderColor = '#E31E24';
      card.style.transform   = 'translateY(-6px) scale(1.02)';
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });


  /* ═══════════════════════════════════════════════
     9. BACK TO TOP BUTTON
  ═══════════════════════════════════════════════ */
  const backToTop = document.getElementById('back-to-top');

  const updateBTT = () => {
    backToTop.hidden = window.scrollY < 400;
  };

  window.addEventListener('scroll', updateBTT, { passive: true });
  updateBTT();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ═══════════════════════════════════════════════
     10. SMOOTH SCROLL for anchor links
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id  = anchor.getAttribute('href');
      const el  = document.querySelector(id);
      if (!el) return;
      e.preventDefault();

      const navH   = navbar.offsetHeight;
      const top    = el.offsetTop - navH - 20;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });


  /* ═══════════════════════════════════════════════
     11. IMAGE LAZY LOAD — Intersection-based
  ═══════════════════════════════════════════════ */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.transition = 'opacity 0.5s ease';
          img.style.opacity    = '1';
          imgObserver.unobserve(img);
        }
      });
    }, { threshold: 0.1 });

    lazyImages.forEach(img => {
      img.style.opacity = '0';
      imgObserver.observe(img);
    });
  }


  /* ═══════════════════════════════════════════════
     12. CURSOR GLOW EFFECT (desktop only)
  ═══════════════════════════════════════════════ */
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 1.5px solid rgba(227,30,36,0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
      mix-blend-mode: difference;
      opacity: 0;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });

    // Smooth cursor movement
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top  = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Expand on interactive elements
    const interactives = document.querySelectorAll('a, button, .gallery-item, .color-card, .faq-question, .spec-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '44px';
        cursor.style.height = '44px';
        cursor.style.borderColor = 'rgba(227,30,36,0.9)';
        cursor.style.background  = 'rgba(227,30,36,0.08)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '20px';
        cursor.style.height = '20px';
        cursor.style.borderColor = 'rgba(227,30,36,0.6)';
        cursor.style.background  = 'transparent';
      });
    });
  }


  /* ═══════════════════════════════════════════════
     13. PERFORMANCE: Reduced Motion
  ═══════════════════════════════════════════════ */
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (mediaQuery.matches) {
    document.documentElement.style.setProperty('--transition', '0.1s ease');
    document.documentElement.style.setProperty('--transition-slow', '0.1s ease');

    // Skip counter animation — just show final values
    counters.forEach(c => {
      c.textContent = parseInt(c.dataset.target, 10).toLocaleString();
    });

    // Skip bar animation — just show final widths
    perfBars.forEach(b => { b.style.width = b.dataset.width + '%'; });

    // Skip scroll animations — just show all
    animatedEls.forEach(el => el.classList.add('animated'));
  }


  /* ═══════════════════════════════════════════════
     14. SPECS CARD — Hover Number Glow
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('.spec-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelectorAll('.spec-val.accent').forEach(v => {
        v.style.textShadow = '0 0 20px rgba(227,30,36,0.5)';
      });
    });
    card.addEventListener('mouseleave', () => {
      card.querySelectorAll('.spec-val.accent').forEach(v => {
        v.style.textShadow = '';
      });
    });
  });


  /* ═══════════════════════════════════════════════
     15. HERO STAT COUNTERS (on page load)
  ═══════════════════════════════════════════════ */
  // Already static in HTML — just add entrance animation class
  const heroStats = document.querySelectorAll('.hero-stat');
  heroStats.forEach((s, i) => {
    s.style.animationDelay = `${1.2 + i * 0.1}s`;
  });

}); // END DOMContentLoaded
