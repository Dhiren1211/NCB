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
    addNewsModalStyles();
    newsExpandModal();
    initJoinNCBButton();
    addCertificateStyles();
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
    { src: "./assests/uploads/img1.jpg", title: "Community Event", desc: "NCB community gathering" },
    { src: "./assests/uploads/img2.jpg", title: "Cultural Festival", desc: "Traditional celebration" },
    { src: "./assests/uploads/img3.jpg", title: "Student Meetup", desc: "Student community event" },
    { src: "./assests/uploads/img6.jpg", title: "Sports Day", desc: "Annual sports competition" },
    { src: "./assests/uploads/img7.jpg", title: "Workshop", desc: "Educational workshop session" },
    { src: "./assests/uploads/img8.jpg", title: "Food Festival", desc: "Nepali cuisine showcase" },
    { src: "./assests/uploads/img9.jpg", title: "Volunteering", desc: "Community service activity" },
    { src: "./assests/uploads/img10.jpg", title: "Leadership Summit", desc: "Youth leadership program" },
    { src: "./assests/uploads/img11.jpg", title: "Cultural Dance", desc: "Traditional dance performance" },
    { src: "./assests/uploads/img12.jpg", title: "Annual Meeting", desc: "NCB annual general meeting" },
    { src: "./assests/uploads/img13.jpg", title: "Holiday Celebration", desc: "Festive holiday event" },
    { src: "./assests/uploads/img14.jpg", title: "Art Exhibition", desc: "Local art showcase" },
    { src: "./assests/uploads/img15.jpg", title: "Music Night", desc: "Cultural music performance" },
    { src: "./assests/uploads/img16.jpg", title: "Community Dinner", desc: "Shared meal gathering" },
    { src: "./assests/uploads/img17.jpg", title: "Sports Tournament", desc: "Friendly competition" },
    { src: "./assests/uploads/img18.jpg", title: "Educational Seminar", desc: "Learning and development" },
    { src: "./assests/uploads/img19.jpg", title: "Cultural Exchange", desc: "Cross-cultural event" }
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

    switch (e.key) {
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


function newsExpandModal() {
    // Check if modal already exists using vanilla JS
    if ($('#news-modal')) return;

    // Create modal structure
    const modalHTML = `
        <div id="news-modal" class="news-modal" style="display: none;">
            <div class="news-modal-overlay"></div>
            <div class="news-modal-content">
                <button class="news-modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="news-modal-header">
                    <h2 class="news-modal-title"></h2>
                    <p class="news-modal-date"></p>
                </div>
                <div class="news-modal-body">
                    <div class="news-modal-message"></div>
                </div>
                <div class="news-modal-footer">
                    <button class="btn-secondary" onclick="closeNewsModal()">Close</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add click handlers for "Read More" links
    const readMoreLinks = $$('.news-item a[href="#"]');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const newsItem = this.closest('.news-item');
            const title = newsItem.querySelector('h4').textContent;
            const date = newsItem.querySelector('.date').textContent;

            // Sample news content
            const newsContent = getNewsContent(title);

            openNewsModal(title, date, newsContent);
        });
    });

    // Close modal handlers
    const overlay = $('.news-modal-overlay');
    const closeBtn = $('.news-modal-close');

    if (overlay) overlay.addEventListener('click', closeNewsModal);
    if (closeBtn) closeBtn.addEventListener('click', closeNewsModal);

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeNewsModal();
        }
    });
}

function openNewsModal(title, date, content) {
    const modal = $('#news-modal');
    const modalTitle = $('.news-modal-title');
    const modalDate = $('.news-modal-date');
    const modalMessage = $('.news-modal-message');

    if (modalTitle) modalTitle.textContent = title;
    if (modalDate) modalDate.textContent = date;
    if (modalMessage) modalMessage.innerHTML = content;

    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeNewsModal() {
    const modal = $('#news-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Helper function to get news content
function getNewsContent(title) {
    const newsData = {
        "Teej Festivalue Announced": `
            <p>We are excited to announce the upcoming Teej Festival celebration in Busan! This year's event promises to be bigger and better than ever before.</p>
            <p><strong>Event Details:</strong></p>
            <ul>
                <li><strong>Date:</strong> September 15, 2024</li>
                <li><strong>Time:</strong> 10:00 AM - 6:00 PM</li>
                <li><strong>Location:</strong> Busan Cultural Center</li>
                <li><strong>Dress Code:</strong> Traditional Nepali attire encouraged</li>
            </ul>
            <p>The festival will feature traditional music, dance performances, delicious Nepali food, and various cultural activities. All community members are warmly invited to participate in this celebration of our rich cultural heritage.</p>
            <p>We look forward to seeing you there for a day filled with joy, tradition, and community bonding!</p>
        `,
        "Membership Renewal Deadline": `
            <p>Attention all NCB members! This is a friendly reminder that the membership renewal deadline is approaching.</p>
            <p><strong>Important Information:</strong></p>
            <ul>
                <li><strong>Renewal Deadline:</strong> April 30, 2024</li>
                <li><strong>Annual Membership Fee:</strong> ₩20,000</li>
                <li><strong>Payment Methods:</strong> Bank transfer, cash, or online payment</li>
            </ul>
            <p>Renewing your membership ensures you continue to receive all benefits including:</p>
            <ul>
                <li>Priority access to community events</li>
                <li>Voting rights in general meetings</li>
                <li>Access to member-only resources</li>
                <li>Emergency support services</li>
            </ul>
            <p>Please contact our membership coordinator if you have any questions or need assistance with the renewal process.</p>
        `,
        "Upcoming Dashain Event": `
            <p>Mark your calendars! The NCB is organizing a grand Dashain celebration for all Nepali community members in Busan.</p>
            <p><strong>Celebration Highlights:</strong></p>
            <ul>
                <li>Traditional Dashain puja and rituals</li>
                <li>Tika and jamara distribution</li>
                <li>Cultural programs and performances</li>
                <li>Traditional Nepali feast</li>
                <li>Games and activities for all ages</li>
            </ul>
            <p>This is one of our most important cultural events of the year, bringing together our community to celebrate our traditions and strengthen our bonds.</p>
            <p>More detailed information including exact date, venue, and registration process will be announced soon. Stay tuned for updates!</p>
        `
    };

    return newsData[title] || `<p>Content not available for this news item.</p>`;
}

// Add this CSS for the modal
function addNewsModalStyles() {
    const styles = `
        /* News Modal Styles */
        .news-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            font-family: 'Poppins', 'Noto Sans Devanagari', sans-serif;
        }

        .news-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }

        .news-modal-content {
            position: relative;
            background: white;
            margin: 2rem auto;
            width: 90%;
            max-width: 700px;
            max-height: 90vh;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .news-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #e63946;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        }

        .news-modal-close:hover {
            background: #c1121f;
        }

        .news-modal-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
        }

        .news-modal-title {
            color: #2b2d42;
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
            font-weight: 700;
        }

        .news-modal-date {
            color: #6c757d;
            margin: 0;
            font-size: 0.9rem;
        }

        .news-modal-body {
            padding: 2rem;
            flex: 1;
            overflow-y: auto;
        }

        .news-modal-message {
            line-height: 1.6;
            color: #495057;
        }

        .news-modal-message p {
            margin-bottom: 1rem;
        }

        .news-modal-message ul {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
        }

        .news-modal-message li {
            margin-bottom: 0.5rem;
        }

        .news-modal-message strong {
            color: #2b2d42;
            font-weight: 600;
        }

        .news-modal-footer {
            padding: 1rem 2rem;
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
            text-align: right;
        }

        /* Animation for modal */
        .news-modal-content {
            animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .news-modal-content {
                margin: 1rem auto;
                width: 95%;
                max-height: 95vh;
            }
            
            .news-modal-header,
            .news-modal-body,
            .news-modal-footer {
                padding: 1.5rem;
            }
            
            .news-modal-title {
                font-size: 1.25rem;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

function initJoinNCBButton() {
    // Add click handlers to all join buttons
    const joinButtons = $$('.join-btn, .join-today-btn');

    joinButtons.forEach(button => {
        button.addEventListener('click', function () {
            const originalText = button.textContent;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Form...';
            button.disabled = true;

            setTimeout(() => {
                showJoinForm();
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 1000);
            }, 500);
        });
    });
}

function showJoinForm() {
    // Create the join form modal
    const formHTML = `
        <div id="join-modal" class="modal-overlay" style="display: flex;">
            <div class="modal-content">
                <button class="modal-close" onclick="closeJoinModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <h3>Join NCB - Nepali Community in Busan</h3>
                </div>
                <form id="join-form">
                    <div class="form-group">
                        <label for="full-name">Full Name *</label>
                        <input type="text" id="full-name" placeholder="Enter your full name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" placeholder="Enter your email address" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Contact Number *</label>
                        <input type="tel" id="phone" placeholder="Enter your phone number" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="university">University/Institution</label>
                        <input type="text" id="university" placeholder="Which university do you attend?">
                    </div>
                    
                    <div class="form-group">
                        <label for="visa-type">Visa Type *</label>
                        <select id="visa-type" required>
                            <option value="">Select your visa type</option>
                            <option value="D-2">D-2 (Student Visa)</option>
                            <option value="D-4">D-4 (General Training Visa)</option>
                            <option value="E-7">E-7 (Professional Employment)</option>
                            <option value="F-2">F-2 (Resident)</option>
                            <option value="F-6">F-6 (Marriage Migrant)</option>
                            <option value="other">Other Visa Type</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="other-visa-container" style="display: none;">
                        <label for="other-visa">Please specify your visa type</label>
                        <input type="text" id="other-visa" placeholder="Enter your visa type">
                    </div>
                    
                    <div class="form-group">
                        <label for="arrival-date">Arrival Date in Korea</label>
                        <input type="date" id="arrival-date">
                    </div>
                    
                    <div class="form-group">
                        <label for="interests">Areas of Interest (Optional)</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="interests" value="cultural-events"> Cultural Events
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="interests" value="sports"> Sports Activities
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="interests" value="volunteering"> Volunteering
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="interests" value="student-support"> Student Support
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="interests" value="professional"> Professional Networking
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-footer">
                        <p class="required-note">* Required fields</p>
                        <button type="submit" class="btn-primary submit-btn">
                            <i class="fas fa-user-plus"></i> Join NCB Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = $('#join-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', formHTML);

    // Add form submit handler
    const form = $('#join-form');
    if (form) {
        form.addEventListener('submit', handleJoinFormSubmit);
    }

    // Add visa type change handler
    const visaTypeSelect = $('#visa-type');
    if (visaTypeSelect) {
        visaTypeSelect.addEventListener('change', function () {
            const otherVisaContainer = $('#other-visa-container');
            if (this.value === 'other') {
                otherVisaContainer.style.display = 'block';
            } else {
                otherVisaContainer.style.display = 'none';
            }
        });
    }

    // Add modal styles if not already added
    addModalStyles();
}

// Update the form submission handler to include certificate generation
function handleJoinFormSubmit(e) {
    e.preventDefault();

    const submitBtn = $('.submit-btn');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = {
        name: $('#full-name').value,
        email: $('#email').value,
        phone: $('#phone').value,
        university: $('#university').value,
        visaType: $('#visa-type').value,
        otherVisa: $('#other-visa').value,
        arrivalDate: $('#arrival-date').value
    };

    // Simulate form submission
    setTimeout(() => {
        // Generate certificate after successful registration
        generateCertificateAfterJoin(formData);

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Here you would typically send the data to your server
        console.log('Member registered:', formData);

    }, 2000);
}

function showSuccessMessage(name) {
    const form = $('#join-form');
    if (form) {
        form.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Welcome to NCB, ${name || 'Friend'}! 🎉</h3>
                <p>Thank you for joining the Nepali Community in Busan. Your membership has been registered successfully.</p>
                <div class="next-steps">
                    <h4>What's Next?</h4>
                    <ul>
                        <li>You'll receive a welcome email within 24 hours</li>
                        <li>Join our WhatsApp group for updates</li>
                        <li>Follow our social media for event announcements</li>
                        <li>Check your email for upcoming event details</li>
                    </ul>
                </div>
                <button class="btn-primary" onclick="closeJoinModal()">Close</button>
            </div>
        `;
    }
}

function closeJoinModal() {
    const modal = $('#join-modal');
    if (modal) {
        modal.remove();
    }
}

function addModalStyles() {
    if ($('#modal-styles')) return;

    const styles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #e63946;
            color: white;
            border: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-header {
            text-align: center;
            margin-bottom: 1.5rem;
        }
        
        .modal-header h3 {
            color: #2b2d42;
            margin-bottom: 0.5rem;
        }
        
        .membership-free {
            background: #d4edda;
            color: #155724;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            margin: 0;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #2b2d42;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #e63946;
        }
        
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: normal;
            cursor: pointer;
        }
        
        .checkbox-label input[type="checkbox"] {
            width: auto;
        }
        
        .form-footer {
            border-top: 1px solid #e9ecef;
            padding-top: 1.5rem;
            text-align: center;
        }
        
        .required-note {
            font-size: 0.8rem;
            color: #6c757d;
            margin-bottom: 1rem;
        }
        
        .submit-btn {
            width: 100%;
            padding: 1rem;
            font-size: 1.1rem;
        }
        
        .success-message {
            text-align: center;
            padding: 1rem 0;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 1rem;
        }
        
        .success-message h3 {
            color: #2b2d42;
            margin-bottom: 1rem;
        }
        
        .next-steps {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1.5rem 0;
            text-align: left;
        }
        
        .next-steps h4 {
            color: #2b2d42;
            margin-bottom: 1rem;
        }
        
        .next-steps ul {
            list-style: none;
            padding: 0;
        }
        
        .next-steps li {
            padding: 0.3rem 0;
            position: relative;
            padding-left: 1.5rem;
        }
        
        .next-steps li:before {
            content: "✓";
            color: #28a745;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                padding: 1.5rem;
                margin: 1rem;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'modal-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}
function generateMembershipCertificate(memberData) {
    // Create certificate canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size for A4 format (print quality)
    canvas.width = 2480; // 8.27 inches * 300 DPI
    canvas.height = 3508; // 11.69 inches * 300 DPI

    // Certificate design
    drawCertificate(ctx, canvas.width, canvas.height, memberData);

    // Convert to image and trigger download
    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `NCB_Membership_Certificate_${memberData.name.replace(/\s+/g, '_')}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    });
}

function drawCertificate(ctx, width, height, memberData) {
    // Background - elegant gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 15;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Inner border
    ctx.strokeStyle = '#2b2d42';
    ctx.lineWidth = 5;
    ctx.strokeRect(80, 80, width - 160, height - 160);

    // NCB Logo (you'll need to replace this with actual logo image loading)
    drawLogo(ctx, width);

    // Title
    ctx.fillStyle = '#2b2d42';
    ctx.font = 'bold 120px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MEMBERSHIP CERTIFICATE', width / 2, 400);

    // Subtitle
    ctx.fillStyle = '#e63946';
    ctx.font = 'italic 40px "Poppins", sans-serif';
    ctx.fillText('Nepali Community in Busan', width / 2, 480);

    // Main certificate text
    ctx.fillStyle = '#2b2d42';
    ctx.font = 'normal 36px "Poppins", sans-serif';
    ctx.fillText('This is to certify that', width / 2, 650);

    // Member Name (highlighted)
    ctx.fillStyle = '#e63946';
    ctx.font = 'bold 84px "Poppins", sans-serif';
    ctx.fillText(memberData.name.toUpperCase(), width / 2, 780);

    // Membership details
    ctx.fillStyle = '#2b2d42';
    ctx.font = 'normal 36px "Poppins", sans-serif';
    ctx.fillText('is a registered member of the Nepali Community in Busan', width / 2, 880);
    ctx.fillText('and is entitled to all privileges and benefits thereof.', width / 2, 940);

    // Membership ID
    ctx.font = 'bold 32px "Poppins", sans-serif';
    ctx.fillText(`Membership ID: NCB-${memberData.memberId}`, width / 2, 1050);

    // Date of joining
    ctx.font = 'normal 32px "Poppins", sans-serif';
    ctx.fillText(`Date of Joining: ${memberData.joinDate}`, width / 2, 1100);

    // Visa Type
    ctx.fillText(`Visa Type: ${memberData.visaType}`, width / 2, 1150);

    // Signatures section
    drawSignatures(ctx, width, height, memberData);

    // Decorative elements
    drawDecorations(ctx, width, height);
}

function drawLogo(ctx, width) {
    // Placeholder for NCB logo - replace with actual image loading
    ctx.fillStyle = '#e63946';
    ctx.font = 'bold 60px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NCB', width / 2, 200);
    ctx.fillStyle = '#2b2d42';
    ctx.font = 'normal 24px "Poppins", sans-serif';
    ctx.fillText('Nepali Community in Busan', width / 2, 240);

    // In a real implementation, you would load and draw an actual image:
    /*
    const logo = new Image();
    logo.onload = function() {
        ctx.drawImage(logo, width/2 - 100, 120, 200, 200);
    };
    logo.src = './assests/Images/NCB_logo.png';
    */
}

function drawSignatures(ctx, width, height, memberData) {
    const signatureY = height - 400;

    // President signature
    ctx.fillStyle = '#2b2d42';
    ctx.font = 'bold 48px "Poppins", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Ashok Acharya', 300, signatureY);

    ctx.font = 'normal 28px "Poppins", sans-serif';
    ctx.fillText('President', 300, signatureY + 50);
    ctx.fillText('Nepali Community in Busan', 300, signatureY + 90);

    // Member since date
    ctx.textAlign = 'right';
    ctx.font = 'normal 28px "Poppins", sans-serif';
    ctx.fillText(`Member Since: ${memberData.joinDate}`, width - 300, signatureY);
    ctx.fillText('Busan, South Korea', width - 300, signatureY + 40);

    // Signature lines
    ctx.strokeStyle = '#2b2d42';
    ctx.lineWidth = 2;

    // President signature line
    ctx.beginPath();
    ctx.moveTo(300, signatureY + 120);
    ctx.lineTo(600, signatureY + 120);
    ctx.stroke();

    // Date line
    ctx.beginPath();
    ctx.moveTo(width - 600, signatureY + 80);
    ctx.lineTo(width - 300, signatureY + 80);
    ctx.stroke();

    // In real implementation, load and draw actual signature image:
    /*
    const signature = new Image();
    signature.onload = function() {
        ctx.drawImage(signature, 300, signatureY - 50, 200, 100);
    };
    signature.src = './assests/signatures/president_signature.png';
    */
}

function drawDecorations(ctx, width, height) {
    // Nepali flag colors decoration
    const colors = ['#003893', '#DC143C', '#FFFFFF']; // Blue, Red, White

    // Top decoration
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(100 + i * 80, 120, 60, 15);
        ctx.fillRect(width - 160 - i * 80, 120, 60, 15);
    }

    // Bottom decoration
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(100 + i * 80, height - 135, 60, 15);
        ctx.fillRect(width - 160 - i * 80, height - 135, 60, 15);
    }

    // Corner decorations
    drawCornerDecoration(ctx, 100, 100);
    drawCornerDecoration(ctx, width - 200, 100);
    drawCornerDecoration(ctx, 100, height - 200);
    drawCornerDecoration(ctx, width - 200, height - 200);
}

function drawCornerDecoration(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(50, 0);
    ctx.moveTo(50, 0);
    ctx.lineTo(100, 50);
    ctx.moveTo(100, 50);
    ctx.lineTo(50, 100);
    ctx.moveTo(50, 100);
    ctx.lineTo(0, 50);
    ctx.stroke();

    ctx.restore();
}

// Function to generate certificate after form submission
function generateCertificateAfterJoin(memberData) {
    // Generate unique member ID
    const memberId = generateMemberId();
    const joinDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const certificateData = {
        name: memberData.name,
        memberId: memberId,
        joinDate: joinDate,
        visaType: memberData.visaType
    };

    // Show certificate generation option in success message
    showCertificateOption(certificateData);
}

function generateMemberId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}${random}`;
}

function showCertificateOption(certificateData) {
    const successHTML = `
        <div class="success-message">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Welcome to NCB, ${certificateData.name}! 🎉</h3>
            <p>Thank you for joining the Nepali Community in Busan.</p>
            <p><strong>Your Membership ID: NCB-${certificateData.memberId}</strong></p>
            
            <div class="certificate-option">
                <h4>Download Your Membership Certificate</h4>
                <p>Get your official NCB membership certificate with President's signature.</p>
                <button class="btn-primary download-certificate-btn" onclick="generateMembershipCertificate(${JSON.stringify(certificateData).replace(/"/g, '&quot;')})">
                    <i class="fas fa-download"></i> Download Certificate
                </button>
            </div>
            
            <div class="next-steps">
                <h4>What's Next?</h4>
                <ul>
                    <li>Save your Membership ID for future reference</li>
                    <li>You'll receive a welcome email within 24 hours</li>
                    <li>Join our WhatsApp group for updates</li>
                    <li>Follow our social media for event announcements</li>
                </ul>
            </div>
            <button class="btn-secondary" onclick="closeJoinModal()">Close</button>
        </div>
    `;

    const form = $('#join-form');
    if (form) {
        form.innerHTML = successHTML;
    }
}



// Add CSS for certificate download section
function addCertificateStyles() {
    const styles = `
        .certificate-option {
            background: linear-gradient(135deg, #e63946, #c1121f);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin: 1.5rem 0;
            text-align: center;
        }
        
        .certificate-option h4 {
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .download-certificate-btn {
            background: #2b2d42;
            color: white;
            border: 2px solid white;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }
        
        .download-certificate-btn:hover {
            background: white;
            color: #2b2d42;
            transform: translateY(-2px);
        }
        
        .success-message p strong {
            color: #e63946;
            font-size: 1.1rem;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize certificate styles when the app loads
