
        // Set current year in footer
        document.getElementById('year').textContent = new Date().getFullYear();

        // Mobile navigation toggle
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const navInner = document.querySelector('.nav-inner');
        const body = document.body;
        
        mobileNavToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to document
            navInner.classList.toggle('open');
            body.classList.toggle('menu-open'); // Prevent body scroll
            const isOpen = navInner.classList.contains('open');
            this.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        });

        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                alert(`Searching for: ${searchTerm}`);
                // In a real implementation, you would submit a form or make an API call
            } else {
                alert('Please enter a search term');
                searchInput.focus();
            }
        });

        // Allow pressing Enter to search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });

        // Hero slider functionality
        const slides = document.querySelectorAll('.hero-slider .slide');
        const prevBtn = document.querySelector('.slider-controls .prev');
        const nextBtn = document.querySelector('.slider-controls .next');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            // Wrap around if at the beginning or end
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }
            
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Show current slide
            slides[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        // Set up event listeners for slider controls
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Auto-advance slides every 5 seconds
        function startSlider() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Pause auto-advance when user interacts with slider
        const heroSlider = document.querySelector('.hero-slider');
        heroSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        heroSlider.addEventListener('mouseleave', startSlider);

        // Start the slider
        startSlider();

        // Tab functionality
        const tabs = document.querySelectorAll('.tab');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                
                // Update active tab
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Show corresponding panel
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetId) {
                        panel.classList.add('active');
                    }
                });
            });
        });

        // Add hover effects to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Close mobile menu when clicking outside or on a link
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navInner.contains(event.target);
            const isClickOnToggle = mobileNavToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navInner.classList.contains('open')) {
                navInner.classList.remove('open');
                body.classList.remove('menu-open');
                mobileNavToggle.setAttribute('aria-label', 'Open navigation');
            }
        });

        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-left a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 899) {
                    navInner.classList.remove('open');
                    body.classList.remove('menu-open');
                    mobileNavToggle.setAttribute('aria-label', 'Open navigation');
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 899 && navInner.classList.contains('open')) {
                navInner.classList.remove('open');
                body.classList.remove('menu-open');
                mobileNavToggle.setAttribute('aria-label', 'Open navigation');
            }
        });
    