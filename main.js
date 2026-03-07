/* =========================================
   BAC. — Main JavaScript
   Premium Interactions & Animations
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     NAVIGATION: SCROLL & MOBILE
  ========================================= */
  const nav = document.querySelector('.site-nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileOverlay = document.querySelector('.nav-mobile-overlay');
  let isMenuOpen = false;

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      mobileOverlay.classList.toggle('open', isMenuOpen);
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
      
      const spans = hamburger.querySelectorAll('span');
      if (isMenuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  /* =========================================
     SCROLL REVEAL
  ========================================= */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Reveal groups (staggered children)
  document.querySelectorAll('.reveal-group').forEach(el => revealObserver.observe(el));

  /* =========================================
     COUNTER ANIMATION
  ========================================= */
  const counters = document.querySelectorAll('.counter');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        const duration = 2200;
        const start = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.round(eased * target);
          
          if (progress < 1) requestAnimationFrame(updateCounter);
          else el.textContent = target;
        }
        
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* =========================================
     HERO IMAGE LOAD
  ========================================= */
  const heroImg = document.querySelector('.hero-image-main');
  if (heroImg) {
    if (heroImg.complete) heroImg.classList.add('loaded');
    else heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  }

  /* =========================================
     PARALLAX ON SCROLL (subtle)
  ========================================= */
  const parallaxTargets = document.querySelectorAll('[data-parallax]');
  
  if (parallaxTargets.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxTargets.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  /* =========================================
     SERVICES TILE TILT EFFECT
  ========================================= */
  const tiles = document.querySelectorAll('.service-tile');
  
  tiles.forEach(tile => {
    tile.addEventListener('mousemove', (e) => {
      const rect = tile.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tile.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateZ(4px)`;
    });
    
    tile.addEventListener('mouseleave', () => {
      tile.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  /* =========================================
     MARQUEE DUPLICATE (for seamless loop)
  ========================================= */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const content = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = content + content;
  }

  /* =========================================
     CONTACT FORM
  ========================================= */
  const contactForm = document.getElementById('bac-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
      };

      try {
        const response = await fetch('http://127.0.0.1:8000/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          formStatus.className = 'form-status success';
          formStatus.style.display = 'block';
          formStatus.textContent = 'Message received. We will be in touch shortly.';
          contactForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (error) {
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
        formStatus.textContent = 'Connection failed. Ensure the backend server is running.';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        setTimeout(() => { formStatus.style.display = 'none'; }, 6000);
      }
    });
  }

  /* =========================================
     SMOOTH ANCHOR SCROLLING
  ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});