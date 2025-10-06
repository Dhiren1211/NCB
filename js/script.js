// Enhanced JavaScript with better functionality and error handling
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer with error handling
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Enhanced Mobile Navigation - FIXED: Using 'menu-open' class
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navInner = document.querySelector('.nav-inner');
    const body = document.body;
    const hasSubMenus = document.querySelectorAll('.has-sub');

    if (mobileNavToggle && navInner) {
        // Mobile menu toggle with enhanced functionality - FIXED CLASS NAME
        mobileNavToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const isOpening = !navInner.classList.contains('menu-open');
            
            navInner.classList.toggle('menu-open'); // CHANGED: 'menu-open' instead of 'open'
            this.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            const isOpen = navInner.classList.contains('menu-open'); // CHANGED: 'menu-open' instead of 'open'
            this.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
            this.setAttribute('aria-expanded', isOpen);

            // Close all submenus when closing mobile menu
            if (!isOpen) {
                hasSubMenus.forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });

        // Mobile submenu functionality
        hasSubMenus.forEach(menu => {
            const link = menu.querySelector('a');
            if (link) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Close other open submenus
                        hasSubMenus.forEach(otherMenu => {
                            if (otherMenu !== menu && otherMenu.classList.contains('active')) {
                                otherMenu.classList.remove('active');
                            }
                        });
                        
                        // Toggle current submenu
                        menu.classList.toggle('active');
                    }
                });
            }
        });
    }

    // Enhanced Search Functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn && searchInput) {
        const performSearch = () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Enhanced search with loading state
                searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                searchBtn.disabled = true;
                
                setTimeout(() => {
                    alert(`Searching for: ${searchTerm}`);
                    // In a real implementation, you would submit a form or make an API call
                    searchBtn.innerHTML = 'Search';
                    searchBtn.disabled = false;
                }, 500);
            } else {
                searchInput.focus();
                searchInput.setAttribute('placeholder', 'Please enter a search term...');
                setTimeout(() => {
                    searchInput.setAttribute('placeholder', 'Search...');
                }, 2000);
            }
        };

        searchBtn.addEventListener('click', performSearch);

        // Enhanced Enter key search with debounce
        let searchTimeout;
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(performSearch, 100);
            }
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.blur();
            }
        });
    }

    // Enhanced Hero Slider Functionality
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevBtn = document.querySelector('.slider-controls .prev');
    const nextBtn = document.querySelector('.slider-controls .next');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        let isPaused = false;

        function showSlide(index) {
            // Wrap around if at the beginning or end
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }
            
            // Hide all slides with transition
            slides.forEach((slide, i) => {
                slide.style.transition = 'opacity 0.5s ease';
                slide.classList.remove('active');
            });
            
            // Show current slide
            setTimeout(() => {
                slides[currentSlide].classList.add('active');
            }, 50);

            // Update ARIA attributes for accessibility
            slides.forEach((slide, i) => {
                slide.setAttribute('aria-hidden', i !== currentSlide);
            });
        }

        function nextSlide() {
            if (!isPaused) {
                showSlide(currentSlide + 1);
            }
        }

        function prevSlide() {
            if (!isPaused) {
                showSlide(currentSlide - 1);
            }
        }

        // Enhanced slider controls with error handling
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                resetAutoAdvance();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                resetAutoAdvance();
            });
        }

        // Auto-advance slides with pause/resume functionality
        function startSlider() {
            if (!isPaused) {
                slideInterval = setInterval(nextSlide, 5000);
            }
        }

        function resetAutoAdvance() {
            clearInterval(slideInterval);
            startSlider();
        }

        function pauseSlider() {
            isPaused = true;
            clearInterval(slideInterval);
        }

        function resumeSlider() {
            isPaused = false;
            startSlider();
        }

        // Enhanced slider interactions
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', pauseSlider);
            heroSlider.addEventListener('mouseleave', resumeSlider);
            heroSlider.addEventListener('touchstart', pauseSlider);
            heroSlider.addEventListener('touchend', () => {
                setTimeout(resumeSlider, 3000);
            });
        }

        // Keyboard navigation for slider
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoAdvance();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoAdvance();
            } else if (e.key === ' ') {
                isPaused ? resumeSlider() : pauseSlider();
            }
        });

        // Initialize slider
        showSlide(0);
        startSlider();
    }

    // Enhanced Tab Functionality
    const tabs = document.querySelectorAll('.tab');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (tabs.length > 0 && tabPanels.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                
                if (!targetId) return;
                
                // Update active tab with smooth transition
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                    t.style.transition = 'all 0.3s ease';
                });
                
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Show corresponding panel with fade effect
                tabPanels.forEach(panel => {
                    panel.style.opacity = '0';
                    panel.style.transition = 'opacity 0.3s ease';
                    
                    setTimeout(() => {
                        panel.classList.remove('active');
                        if (panel.id === targetId) {
                            panel.classList.add('active');
                        }
                        
                        setTimeout(() => {
                            panel.style.opacity = '1';
                        }, 50);
                    }, 150);
                });
            });
        });
    }

    // Enhanced Card Hover Effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Touch device support
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-4px) scale(1.01)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced Mobile Menu Close Functionality - FIXED: Using 'menu-open' class
    function closeMobileMenu() {
        if (navInner && mobileNavToggle) {
            navInner.classList.remove('menu-open'); // CHANGED: 'menu-open' instead of 'open'
            mobileNavToggle.classList.remove('active');
            body.classList.remove('menu-open');
            mobileNavToggle.setAttribute('aria-label', 'Open navigation');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            
            // Close all submenus
            hasSubMenus.forEach(menu => {
                menu.classList.remove('active');
            });
        }
    }

    // Close mobile menu when clicking outside - FIXED: Using 'menu-open' class
    document.addEventListener('click', function(event) {
        if (navInner && navInner.classList.contains('menu-open')) { // CHANGED: 'menu-open' instead of 'open'
            const isClickInsideNav = navInner.contains(event.target);
            const isClickOnToggle = mobileNavToggle && mobileNavToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle) {
                closeMobileMenu();
            }
        }
    });

    // Close mobile menu when clicking on a nav link (except submenu triggers)
    const navLinks = document.querySelectorAll('.nav-left a, .nav-right a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024 && !this.parentElement.classList.contains('has-sub')) {
                closeMobileMenu();
            }
        });
    });

    // Enhanced Window Resize Handler - FIXED: Using 'menu-open' class
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (window.innerWidth > 1024 && navInner && navInner.classList.contains('menu-open')) { // CHANGED: 'menu-open' instead of 'open'
                closeMobileMenu();
            }
            
            // Update mobile submenu behavior based on screen size
            hasSubMenus.forEach(menu => {
                if (window.innerWidth > 1024) {
                    menu.classList.remove('active');
                }
            });
        }, 250);
    });

    // Add loading state to buttons
    const buttons = document.querySelectorAll('button:not(.mobile-nav-toggle)');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('loading')) {
                e.preventDefault();
                return;
            }
            
            // Add loading state for buttons that might trigger async actions
            if (this.id !== 'search-btn' && !this.classList.contains('rsvp')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1500);
            }
        });
    });

    // Enhanced RSVP button functionality
    const rsvpButtons = document.querySelectorAll('.rsvp');
    rsvpButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventTitle = this.closest('.event-card').querySelector('h4').textContent;
            const originalText = this.textContent;
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                alert(`Thank you for RSVPing to: ${eventTitle}`);
                this.textContent = 'RSVP Confirmed!';
                this.style.background = '#28a745';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.background = '';
                }, 3000);
            }, 1000);
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observe elements for animation
        document.querySelectorAll('.card, .event-card, .news-item, .program-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
});

// Add CSS for loading states
const style = document.createElement('style');
style.textContent = `
    button.loading {
        position: relative;
        color: transparent !important;
    }
    button.loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin: -8px 0 0 -8px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
