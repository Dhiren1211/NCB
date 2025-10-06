document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Mobile navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navInner = document.querySelector('.nav-inner');
  const body = document.body;

  if (mobileNavToggle && navInner) {
    // Toggle mobile menu
    mobileNavToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = !navInner.classList.toggle('menu-open');
      mobileNavToggle.classList.toggle('active');
      body.classList.toggle('menu-open');
      mobileNavToggle.setAttribute('aria-expanded', !isOpen);
      mobileNavToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');

      if (isOpen) document.querySelectorAll('.has-sub.active').forEach(menu => menu.classList.remove('active'));
    });

    // Submenu toggling with event delegation
    navInner.addEventListener('click', (e) => {
      if (window.innerWidth > 1024) return;
      const link = e.target.closest('.has-sub > a');
      if (!link) return;
      e.preventDefault();
      const menu = link.parentElement;
      document.querySelectorAll('.has-sub.active').forEach(other => {
        if (other !== menu) other.classList.remove('active');
      });
      menu.classList.toggle('active');
    });

    // Close menu on nav link click (non-submenu)
    navInner.addEventListener('click', (e) => {
      if (window.innerWidth > 1024 || e.target.closest('.has-sub')) return;
      if (e.target.closest('.nav-left a, .nav-right a')) closeMobileMenu();
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navInner.classList.contains('menu-open') || navInner.contains(e.target) || mobileNavToggle.contains(e.target)) return;
      closeMobileMenu();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 1024 && navInner.classList.contains('menu-open')) closeMobileMenu();
      }, 250);
    });

    function closeMobileMenu() {
      navInner.classList.remove('menu-open');
      mobileNavToggle.classList.remove('active');
      body.classList.remove('menu-open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavToggle.setAttribute('aria-label', 'Open navigation');
      document.querySelectorAll('.has-sub.active').forEach(menu => menu.classList.remove('active'));
    }
  }

  // Search functionality
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  if (searchBtn && searchInput) {
    const performSearch = () => {
      const term = searchInput.value.trim();
      if (!term) {
        searchInput.setAttribute('placeholder', 'Please enter a search term...');
        searchInput.focus();
        setTimeout(() => searchInput.setAttribute('placeholder', 'Search...'), 2000);
        return;
      }
      searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      searchBtn.disabled = true;
      setTimeout(() => {
        alert(`Searching for: ${term}`);
        searchBtn.innerHTML = 'Search';
        searchBtn.disabled = false;
      }, 500);
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchInput.blur();
      }
    });
  }

  // Hero slider
  const slides = document.querySelectorAll('.hero-slider .slide');
  if (slides.length) {
    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 5000);
    let isPaused = false;

    function showSlide(index) {
      currentSlide = index >= slides.length ? 0 : index < 0 ? slides.length - 1 : index;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
        slide.setAttribute('aria-hidden', i !== currentSlide);
        slide.style.transition = 'opacity 0.5s ease';
      });
    }

    function nextSlide() { if (!isPaused) showSlide(currentSlide + 1); }
    function prevSlide() { if (!isPaused) showSlide(currentSlide - 1); }
    function resetAutoAdvance() { clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 5000); }

    ['prev', 'next'].forEach((dir, i) => {
      const btn = document.querySelector(`.slider-controls .${dir}`);
      if (btn) btn.addEventListener('click', () => { (i ? nextSlide : prevSlide)(); resetAutoAdvance(); });
    });

    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
      heroSlider.addEventListener('mouseenter', () => { isPaused = true; clearInterval(slideInterval); });
      heroSlider.addEventListener('mouseleave', () => { isPaused = false; resetAutoAdvance(); });
      heroSlider.addEventListener('touchstart', () => { isPaused = true; clearInterval(slideInterval); });
      heroSlider.addEventListener('touchend', () => setTimeout(() => { isPaused = false; resetAutoAdvance(); }, 3000));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prevSlide(); resetAutoAdvance(); }
      else if (e.key === 'ArrowRight') { nextSlide(); resetAutoAdvance(); }
      else if (e.key === ' ') { isPaused = !isPaused; isPaused ? clearInterval(slideInterval) : resetAutoAdvance(); }
    });

    showSlide(0);
  }

  // Tabs
  const tabs = document.querySelectorAll('.tab');
  if (tabs.length) {
    document.querySelector('.tabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      const targetId = tab.dataset.target;
      if (!targetId) return;

      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab);
        t.style.transition = 'all 0.3s ease';
      });

      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.style.transition = 'opacity 0.3s ease';
        panel.style.opacity = '0';
        setTimeout(() => {
          panel.classList.toggle('active', panel.id === targetId);
          setTimeout(() => panel.style.opacity = '1', 50);
        }, 150);
      });
    });
  }

  // Card hover effects
  document.querySelectorAll('.card').forEach(card => {
    ['mouseenter', 'touchstart'].forEach(event => card.addEventListener(event, () => {
      card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = event === 'mouseenter' ? 'translateY(-8px) scale(1.02)' : 'translateY(-4px) scale(1.01)';
    }));
    ['mouseleave', 'touchend'].forEach(event => card.addEventListener(event, () => {
      card.style.transform = 'translateY(0) scale(1)';
    }));
  });

  // RSVP buttons
  document.querySelectorAll('.rsvp').forEach(button => {
    button.addEventListener('click', () => {
      const eventTitle = button.closest('.event-card').querySelector('h4').textContent;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      button.disabled = true;
      setTimeout(() => {
        alert(`Thank you for RSVPing to: ${eventTitle}`);
        button.textContent = 'RSVP Confirmed!';
        button.style.background = '#28a745';
        setTimeout(() => {
          button.textContent = 'RSVP';
          button.disabled = false;
          button.style.background = '';
        }, 3000);
      }, 1000);
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Intersection observer for animations
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 }).observeAll(document.querySelectorAll('.card, .event-card, .news-item, .program-card'), el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
    });
  }

  // Add loading state styles
  const style = document.createElement('style');
  style.textContent = `
    button.loading { position: relative; color: transparent !important; }
    button.loading::after {
      content: ''; position: absolute; width: 16px; height: 16px; top: 50%; left: 50%;
      margin: -8px 0 0 -8px; border: 2px solid transparent; border-top: 2px solid currentColor;
      border-radius: 50%; animation: spin 1s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
});