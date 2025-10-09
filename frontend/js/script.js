// Utility functions
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setCurrentYear();
    initNavigation();
    initSearch();
    initHeroSlider();
    initTabs();
    initCardEffects();
    initRSVPButtons();
    initSmoothScrolling();
    initAnimations();
    initReadMore();
    initGallery();
    initGallerySlider();
    addLoadingStyles();
}

// Core functionality
function setCurrentYear() {
    const yearElement = $('#year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
}

function initNavigation() {
    const mobileToggle = $('.mobile-nav-toggle');
    const navMenu = $('.nav-menu');
    const subMenus = $$('.has-sub > a');

    mobileToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('active');
    });

    subMenus.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });
}

function initSearch() {
    const searchBtn = $('#search-btn');
    const searchInput = $('#search-input');
    
    if (!searchBtn || !searchInput) return;

    const performSearch = () => {
        const term = searchInput.value.trim();
        if (!term) {
            handleEmptySearch(searchInput);
            return;
        }
        executeSearch(searchBtn, term);
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch());
    searchInput.addEventListener('keydown', (e) => e.key === 'Escape' && clearSearch(searchInput));
}

function handleEmptySearch(input) {
    input.setAttribute('placeholder', 'Please enter a search term...');
    input.focus();
    setTimeout(() => input.setAttribute('placeholder', 'Search...'), 2000);
}

function executeSearch(button, term) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    setTimeout(() => {
        alert(`Searching for: ${term}`);
        button.innerHTML = 'Search';
        button.disabled = false;
    }, 500);
}

function clearSearch(input) {
    input.value = '';
    input.blur();
}

// Hero Slider
function initHeroSlider() {
    const slides = $$('.hero-slider .slide');
    if (!slides.length) return;

    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 5000);
    let isPaused = false;

    const showSlide = (index) => {
        currentSlide = (index + slides.length) % slides.length;
        
        slides.forEach((slide, i) => {
            const isActive = i === currentSlide;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', !isActive);
            slide.style.transition = 'opacity 0.5s ease';
        });
    };

    const nextSlide = () => !isPaused && showSlide(currentSlide + 1);
    const prevSlide = () => !isPaused && showSlide(currentSlide - 1);
    
    const resetAutoAdvance = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    };

    // Navigation controls
    $$('.slider-controls .prev, .slider-controls .next').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            index ? nextSlide() : prevSlide();
            resetAutoAdvance();
        });
    });

    // Auto-slide controls
    const heroSlider = $('.hero-slider');
    if (heroSlider) {
        const pauseSlider = () => {
            isPaused = true;
            clearInterval(slideInterval);
        };
        
        const resumeSlider = () => {
            isPaused = false;
            resetAutoAdvance();
        };

        heroSlider.addEventListener('mouseenter', pauseSlider);
        heroSlider.addEventListener('mouseleave', resumeSlider);
        heroSlider.addEventListener('touchstart', pauseSlider);
        heroSlider.addEventListener('touchend', () => setTimeout(resumeSlider, 3000));
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const keyActions = {
            'ArrowLeft': () => { prevSlide(); resetAutoAdvance(); },
            'ArrowRight': () => { nextSlide(); resetAutoAdvance(); },
            ' ': () => { 
                isPaused = !isPaused; 
                isPaused ? clearInterval(slideInterval) : resetAutoAdvance(); 
            }
        };
        
        keyActions[e.key]?.();
    });

    showSlide(0);
}

// Gallery Slider
const images = [
    "./assests/uploads/img1.jpg",
    "./assests/uploads/img2.jpg",
    "./assests/uploads/img3.jpg",
    "./assests/uploads/img6.jpg",
    "./assests/uploads/img7.jpg",
    "./assests/uploads/img8.jpg",
    "./assests/uploads/img9.jpg",
    "./assests/uploads/img10.jpg",
    "./assests/uploads/img11.jpg",
    "./assests/uploads/img12.jpg",
    "./assests/uploads/img13.jpg",
    "./assests/uploads/img14.jpg",
    "./assests/uploads/img15.jpg",
    "./assests/uploads/img16.jpg",
    "./assests/uploads/img17.jpg",
    "./assests/uploads/img18.jpg",
    "./assests/uploads/img19.jpg",
];

function initGallerySlider() {
    const slidesContainer = $(".slides");
    const dotsContainer = $(".dots");
    const prevBtn = $(".prev");
    const nextBtn = $(".next");
    const playPauseBtn = $(".play-pause");

    if (!slidesContainer || !dotsContainer) return;

    let currentIndex = 0;
    let autoSlide = true;
    let interval;

    // Create slides and dots
    images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        if (index === 0) img.classList.add("active");
        slidesContainer.appendChild(img);

        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => showSlide(index));
     
    });

    const slides = $$(".slides img");
    const dots = $$(".dots span");

    const showSlide = (index) => {
        slides[currentIndex]?.classList.remove("active");
        dots[currentIndex]?.classList.remove("active");

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex]?.classList.add("active");
        dots[currentIndex]?.classList.add("active");
    };

    const nextSlide = () => showSlide(currentIndex + 1);
    const prevSlideFunc = () => showSlide(currentIndex - 1);

    const startAutoSlide = () => interval = setInterval(nextSlide, 3000);
    const stopAutoSlide = () => clearInterval(interval);

    const toggleAutoSlide = () => {
        autoSlide = !autoSlide;
        playPauseBtn.textContent = autoSlide ? "⏸" : "▶";
        autoSlide ? startAutoSlide() : stopAutoSlide();
    };

    // Event listeners
    prevBtn?.addEventListener("click", prevSlideFunc);
    nextBtn?.addEventListener("click", nextSlide);
    playPauseBtn?.addEventListener("click", toggleAutoSlide);

    startAutoSlide();
}

// Additional components
function initTabs() {
    const tabs = $$('.tab');
    if (!tabs.length) return;

    $('.tabs')?.addEventListener('click', (e) => {
        const tab = e.target.closest('.tab');
        if (!tab?.dataset.target) return;

        const targetId = tab.dataset.target;

        tabs.forEach(t => {
            const isActive = t === tab;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', isActive);
            t.style.transition = 'all 0.3s ease';
        });

        $$('.tab-panel').forEach(panel => {
            panel.style.transition = 'opacity 0.3s ease';
            panel.style.opacity = '0';
            
            setTimeout(() => {
                panel.classList.toggle('active', panel.id === targetId);
                setTimeout(() => panel.style.opacity = '1', 50);
            }, 150);
        });
    });
}

function initCardEffects() {
    $$('.card').forEach(card => {
        const activateCard = (event) => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = event.type === 'mouseenter' 
                ? 'translateY(-8px) scale(1.02)' 
                : 'translateY(-4px) scale(1.01)';
        };

        const deactivateCard = () => {
            card.style.transform = 'translateY(0) scale(1)';
        };

        card.addEventListener('mouseenter', activateCard);
        card.addEventListener('touchstart', activateCard);
        card.addEventListener('mouseleave', deactivateCard);
        card.addEventListener('touchend', deactivateCard);
    });
}

function initRSVPButtons() {
    $$('.rsvp').forEach(button => {
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
}

function initSmoothScrolling() {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            $(anchor.getAttribute('href'))?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });
}

function initAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    $$('.card, .event-card, .news-item, .program-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function initReadMore() {
    const readMoreBtn = $('.read-more-btn');
    const messageContainer = $('.message-container');

    if (readMoreBtn && messageContainer) {
        readMoreBtn.addEventListener('click', () => {
            const isExpanded = messageContainer.classList.toggle('expanded');
            readMoreBtn.textContent = isExpanded ? 'Read Less' : 'Read More';
        });
    }
}

// Image Gallery with Pagination and Lightbox
const Galimages = [
    { src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", title: "Dashain Celebration", desc: "Community gathering for Dashain festival" },
    { src: "https://images.unsplash.com/photo-1521334884684-d80222895322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", title: "Cultural Performance", desc: "Traditional Nepali dance performance" },
    { src: "./assests/uploads/img1.jpg",  title: "Community Event", desc: "NCB community gathering" },
    { src: "./assests/uploads/img2.jpg",   title: "Cultural Festival", desc: "Traditional celebration" },
    { src: "./assests/uploads/img3.jpg",   title: "Student Meetup", desc: "Student community event" },
    { src: "./assests/uploads/img6.jpg",   title: "Sports Day", desc: "Annual sports competition" },
    { src: "./assests/uploads/img7.jpg",   title: "Workshop", desc: "Educational workshop session" },
    { src: "./assests/uploads/img8.jpg",   title: "Food Festival", desc: "Nepali cuisine showcase" },
    { src: "./assests/uploads/img9.jpg",   title: "Volunteering", desc: "Community service activity" },
    { src: "./assests/uploads/img10.jpg",   title: "Leadership Summit", desc: "Youth leadership program" },
    { src: "./assests/uploads/img11.jpg",   title: "Cultural Dance", desc: "Traditional dance performance" },
    { src: "./assests/uploads/img12.jpg",   title: "Annual Meeting", desc: "NCB annual general meeting" },
    { src: "./assests/uploads/img13.jpg",   title: "Holiday Celebration", desc: "Festive holiday event" },
    { src: "./assests/uploads/img14.jpg",   title: "Art Exhibition", desc: "Local art showcase" },
    { src: "./assests/uploads/img15.jpg",   title: "Music Night", desc: "Cultural music performance" },
    { src: "./assests/uploads/img16.jpg",   title: "Community Dinner", desc: "Shared meal gathering" },
    { src: "./assests/uploads/img17.jpg",   title: "Sports Tournament", desc: "Friendly competition" },
    { src: "./assests/uploads/img18.jpg",   title: "Educational Seminar", desc: "Learning and development" },
    { src: "./assests/uploads/img19.jpg",   title: "Cultural Exchange", desc: "Cross-cultural event" }
];

// Pagination state
let currentPage = 1;
let imagesPerPage = 9;
let currentLightboxIndex = 0;

function initGallery() {
    const container = $('.images-container');
    if (!container) return;

    // Create gallery controls if they don't exist
    createGalleryControls(container);
    
    // Create lightbox modal
    createLightboxModal();
    
    // Initialize pagination
    updateGallery();
    setupGalleryEventListeners();
}

function createGalleryControls(container) {
    // Check if controls already exist
    if ($('.gallery-controls')) return;

    const gallerySection = container.closest('#Gallery');
    if (!gallerySection) return;

    const controlsHTML = `
        <div class="gallery-controls">
            <div class="images-per-page">
                <label for="per-page">Images per page:</label>
                <select id="per-page">
                    <option value="6">6</option>
                    <option value="9" selected>9</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                </select>
            </div>
        </div>
        <div class="pagination">
            <button id="first-page" class="page-btn">«</button>
            <button id="prev-page" class="page-btn">‹</button>
            <div class="page-numbers" id="page-numbers"></div>
            <button id="next-page" class="page-btn">›</button>
            <button id="last-page" class="page-btn">»</button>
        </div>
        <div class="page-info" id="page-info"></div>
    `;

    // Insert controls before the images container
    container.insertAdjacentHTML('afterend', controlsHTML);
}

function createLightboxModal() {
    // Check if lightbox already exists
    if ($('#lightbox-modal')) return;

    const lightboxHTML = `
        <div id="lightbox-modal" class="lightbox">
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <button class="lightbox-nav lightbox-prev">‹</button>
                <div class="lightbox-image-container">
                    <img id="lightbox-image" src="" alt="">
                    <div class="lightbox-info">
                        <h3 id="lightbox-title"></h3>
                        <p id="lightbox-desc"></p>
                        <div class="lightbox-counter">
                            <span id="lightbox-counter">1 of ${Galimages.length}</span>
                        </div>
                    </div>
                </div>
                <button class="lightbox-nav lightbox-next">›</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    setupLightboxEventListeners();
}

function setupLightboxEventListeners() {
    const lightbox = $('#lightbox-modal');
    const closeBtn = $('.lightbox-close');
    const prevBtn = $('.lightbox-prev');
    const nextBtn = $('.lightbox-next');

    // Close lightbox
    closeBtn?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation
    prevBtn?.addEventListener('click', showPrevImage);
    nextBtn?.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyboard);
}

function handleLightboxKeyboard(e) {
    const lightbox = $('#lightbox-modal');
    if (!lightbox || !lightbox.classList.contains('active')) return;

    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
}

function openLightbox(imageIndex) {
    const lightbox = $('#lightbox-modal');
    const lightboxImage = $('#lightbox-image');
    const lightboxTitle = $('#lightbox-title');
    const lightboxDesc = $('#lightbox-desc');
    const lightboxCounter = $('#lightbox-counter');

    if (!lightbox || !lightboxImage) return;

    currentLightboxIndex = imageIndex;
    const image = Galimages[imageIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.title;
    lightboxTitle.textContent = image.title;
    lightboxDesc.textContent = image.desc;
    lightboxCounter.textContent = `${imageIndex + 1} of ${Galimages.length}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    const lightbox = $('#lightbox-modal');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % Galimages.length;
    openLightbox(currentLightboxIndex);
}

function showPrevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + Galimages.length) % Galimages.length;
    openLightbox(currentLightboxIndex);
}

function setupGalleryEventListeners() {
    const perPageSelect = $('#per-page');
    const prevPageBtn = $('#prev-page');
    const nextPageBtn = $('#next-page');
    const firstPageBtn = $('#first-page');
    const lastPageBtn = $('#last-page');

    if (perPageSelect) {
        perPageSelect.addEventListener('change', (e) => {
            imagesPerPage = parseInt(e.target.value);
            currentPage = 1;
            updateGallery();
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateGallery();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < getTotalPages()) {
                currentPage++;
                updateGallery();
            }
        });
    }

    if (firstPageBtn) {
        firstPageBtn.addEventListener('click', () => {
            currentPage = 1;
            updateGallery();
        });
    }

    if (lastPageBtn) {
        lastPageBtn.addEventListener('click', () => {
            currentPage = getTotalPages();
            updateGallery();
        });
    }
}

function getTotalPages() {
    return Math.ceil(Galimages.length / imagesPerPage);
}

function getCurrentPageImages() {
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    return Galimages.slice(startIndex, endIndex);
}

function updateGallery() {
    const container = $('.images-container');
    if (!container) return;

    // Clear current images
    container.innerHTML = '';
    
    // Get images for current page
    const currentImages = getCurrentPageImages();
    const startIndex = (currentPage - 1) * imagesPerPage;
    
    // Display images
    currentImages.forEach((image, index) => {
        const globalIndex = startIndex + index;
        const card = createImageCard(image, globalIndex);
        container.appendChild(card);
    });
    
    // Update pagination controls
    updatePagination();
    
    // Update page info
    updatePageInfo();
}

function createImageCard(image, globalIndex) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.style.cursor = 'pointer'; // Show it's clickable

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.title;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    const title = document.createElement('div');
    title.className = 'image-title';
    title.textContent = image.title;

    const desc = document.createElement('div');
    desc.className = 'image-desc';
    desc.textContent = image.desc;

    overlay.appendChild(title);
    overlay.appendChild(desc);
    card.appendChild(img);
    card.appendChild(overlay);

    // Add click event to open lightbox
    card.addEventListener('click', () => {
        openLightbox(globalIndex);
    });

    return card;
}

function updatePagination() {
    const totalPages = getTotalPages();
    const pageNumbersContainer = $('#page-numbers');
    
    if (!pageNumbersContainer) return;
    
    // Clear current page numbers
    pageNumbersContainer.innerHTML = '';
    
    // Generate page number buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page button if needed
    if (startPage > 1) {
        const firstBtn = createPageButton(1);
        pageNumbersContainer.appendChild(firstBtn);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'page-ellipsis';
            pageNumbersContainer.appendChild(ellipsis);
        }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageButton(i);
        pageNumbersContainer.appendChild(pageBtn);
    }
    
    // Last page button if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'page-ellipsis';
            pageNumbersContainer.appendChild(ellipsis);
        }
        const lastBtn = createPageButton(totalPages);
        pageNumbersContainer.appendChild(lastBtn);
    }
    
    // Update button states
    updatePaginationButtonStates(totalPages);
}

function createPageButton(pageNumber) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'page-btn';
    pageBtn.textContent = pageNumber;
    pageBtn.classList.toggle('active', pageNumber === currentPage);
    
    pageBtn.addEventListener('click', () => {
        currentPage = pageNumber;
        updateGallery();
    });
    
    return pageBtn;
}

function updatePaginationButtonStates(totalPages) {
    const prevPageBtn = $('#prev-page');
    const nextPageBtn = $('#next-page');
    const firstPageBtn = $('#first-page');
    const lastPageBtn = $('#last-page');
    
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
    if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
    if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;
}

function updatePageInfo() {
    const pageInfo = $('#page-info');
    if (!pageInfo) return;
    
    const totalPages = getTotalPages();
    const startIndex = (currentPage - 1) * imagesPerPage + 1;
    const endIndex = Math.min(currentPage * imagesPerPage, Galimages.length);
    
    pageInfo.textContent = `Showing ${startIndex}-${endIndex} of ${Galimages.length} images (Page ${currentPage} of ${totalPages})`;
}

function addLoadingStyles() {
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
        
        /* Gallery Pagination Styles */
        .gallery-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 0 20px;
        }
        
        .images-per-page {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .images-per-page select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 30px;
            gap: 10px;
        }
        
        .pagination button {
            padding: 8px 16px;
            border: 1px solid #ddd;
            background-color: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .pagination button:hover:not(:disabled) {
            background-color: #e63946;
            color: white;
            border-color: #e63946;
        }
        
        .pagination button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .pagination .page-numbers {
            display: flex;
            gap: 5px;
        }
        
        .pagination .page-btn {
            min-width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .pagination .page-btn.active {
            background-color: #e63946;
            color: white;
            border-color: #e63946;
        }
        
        .page-ellipsis {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            height: 40px;
            color: #666;
        }
        
        .page-info {
            text-align: center;
            margin-top: 10px;
            color: #666;
        }
        
        /* Images container styles */
        .images-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
            min-height: 600px;
        }
        
        .image-card {
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            aspect-ratio: 1 / 1;
            background-color: #fff;
        }
        
        .image-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
        
        .image-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.5s ease;
        }
        
        .image-card:hover img {
            transform: scale(1.05);
        }
        
        .image-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            color: white;
            padding: 20px 15px 15px;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        }
        
        .image-card:hover .image-overlay {
            transform: translateY(0);
        }
        
        .image-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .image-desc {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        /* Lightbox Styles */
        .lightbox {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            animation: fadeIn 0.3s ease;
        }
        
        .lightbox.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
            z-index: 1001;
        }
        
        .lightbox-close:hover {
            color: #e63946;
        }
        
        .lightbox-nav {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 24px;
            padding: 15px;
            cursor: pointer;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .lightbox-nav:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .lightbox-image-container {
            position: relative;
            max-width: 800px;
            max-height: 80vh;
        }
        
        #lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .lightbox-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            padding: 20px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        
        #lightbox-title {
            margin: 0 0 8px 0;
            font-size: 1.4rem;
        }
        
        #lightbox-desc {
            margin: 0 0 10px 0;
            opacity: 0.9;
        }
        
        .lightbox-counter {
            text-align: center;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .images-container {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                padding: 10px;
            }
            
            .gallery-controls {
                flex-direction: column;
                gap: 15px;
            }
            
            .pagination {
                flex-wrap: wrap;
            }
            
            .lightbox-content {
                flex-direction: column;
                gap: 10px;
            }
            
            .lightbox-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .lightbox-prev {
                left: 10px;
            }
            
            .lightbox-next {
                right: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .images-container {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }
            
            .lightbox-nav {
                width: 40px;
                height: 40px;
                font-size: 20px;
            }
        }
    `;
    document.head.appendChild(style);
}