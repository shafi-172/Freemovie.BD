/* ========================================
   MAIN JAVASCRIPT - Freemovie.BD Movie Platform
   ======================================== */

// ========================================
// DOM ELEMENTS
// ========================================

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moviesGrid = document.getElementById('moviesGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const modal = document.getElementById('movieModal');
const closeModal = document.querySelector('.close');
const newsletterForm = document.getElementById('newsletterForm');

// ========================================
// STATE MANAGEMENT
// ========================================

let currentFilter = 'all';
let currentCategory = 'all';
let filteredMovies = [...moviesDatabase];

// ========================================
// INITIALIZATION
// ========================================

// Debounced scroll handler
const debouncedScroll = debounce(handleScroll, 10);

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    renderMovies(moviesDatabase);
    addScrollAnimations();
});

// ========================================
// EVENT LISTENERS
// ========================================

function initializeEventListeners() {
    // Hamburger Menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
            }
        });
    });

    // Search
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            filterAndRenderMovies();
        });
    });

    // Category Cards
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.getAttribute('data-filter');
            filterAndRenderMovies();
            scrollToSection('movies');
        });
    });

    // Modal Close
    closeModal.addEventListener('click', closeMovieModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMovieModal();
        }
    });

    // Newsletter Form
    newsletterForm.addEventListener('submit', handleNewsletterSignup);

    // Scroll Events - with passive listener and debouncing for better performance
    window.addEventListener('scroll', debouncedScroll, { passive: true });
}

// ========================================
// NAVIGATION FUNCTIONS
// ========================================

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        filteredMovies = [...moviesDatabase];
    } else {
        filteredMovies = moviesDatabase.filter(movie =>
            movie.title.toLowerCase().includes(query) ||
            movie.genre.some(g => g.toLowerCase().includes(query)) ||
            movie.director.toLowerCase().includes(query)
        );
    }
    
    currentFilter = 'all';
    updateFilterButtons();
    renderMovies(filteredMovies);
    scrollToSection('movies');
    
    if (filteredMovies.length === 0) {
        showNotification(`No movies found for "${query}"`, 'warning');
    }
}

// ========================================
// FILTER FUNCTIONALITY
// ========================================

function filterAndRenderMovies() {
    let result = [...moviesDatabase];

    // Apply category filter
    if (currentCategory !== 'all') {
        const genreMap = {
            action: 'Action',
            comedy: 'Comedy',
            drama: 'Drama',
            horror: 'Horror',
            scifi: 'Sci-Fi',
            romance: 'Romance'
        };
        const genreFilter = genreMap[currentCategory];
        result = result.filter(movie => movie.genre.includes(genreFilter));
    }

    // Apply time filter
    if (currentFilter === 'recent') {
        result = result.filter(movie => movie.year === 2024).sort((a, b) => {
            return new Date(b.releaseDate) - new Date(a.releaseDate);
        });
    } else if (currentFilter === 'trending') {
        result = result.filter(movie => movie.category === 'trending').sort((a, b) => b.votes - a.votes);
    } else if (currentFilter === 'top') {
        result = result.sort((a, b) => b.rating - a.rating);
    } else {
        result = result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }

    renderMovies(result);
}

function updateFilterButtons() {
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
        }
    });
}

// ========================================
// RENDER FUNCTIONS
// ========================================

function renderMovies(movies) {
    moviesGrid.innerHTML = '';
    
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No movies found</p>';
        return;
    }

    // Use requestAnimationFrame for batch DOM updates
    const fragment = document.createDocumentFragment();
    movies.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        fragment.appendChild(movieCard);
    });
    moviesGrid.appendChild(fragment);
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card hover-lift';
    
    const ratingStars = generateStars(movie.rating);
    const badge = movie.rating >= 9 ? 'Must Watch' : movie.rating >= 8 ? 'Recommended' : 'Popular';
    
    card.innerHTML = `
        <div class="movie-poster">
            <img src="${movie.image}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/400x600?text=${encodeURIComponent(movie.title)}'">
            <span class="movie-badge">${badge}</span>
            <div class="play-overlay">
                <div class="play-btn">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        </div>
        <div class="movie-info">
            <div>
                <h4 class="movie-title">${movie.title}</h4>
                <p class="movie-year">${movie.year}</p>
                <div class="movie-rating">
                    <span>${ratingStars}</span>
                    <span>${movie.rating.toFixed(1)}/10</span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => openMovieModal(movie));
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating % 2) >= 1;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '★';
        } else if (i === fullStars && hasHalfStar) {
            stars += '◆';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

// ========================================
// MODAL FUNCTIONS
// ========================================

function openMovieModal(movie) {
    const modalBody = document.getElementById('modalBody');
    const ratingStars = generateStars(movie.rating);
    
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
            <div>
                <img src="${movie.image}" alt="${movie.title}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem;" onerror="this.src='https://via.placeholder.com/400x600?text=${encodeURIComponent(movie.title)}'">
                <button class="btn btn-primary" style="width: 100%; justify-content: center;">
                    <i class="fas fa-play"></i> Watch Now
                </button>
            </div>
            <div>
                <h2>${movie.title}</h2>
                <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Rating</p>
                        <p style="color: #FFD700; font-weight: 700;">${ratingStars} ${movie.rating.toFixed(1)}/10</p>
                    </div>
                    <div>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Year</p>
                        <p style="font-weight: 700;">${movie.year}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Duration</p>
                        <p style="font-weight: 700;">${movie.duration}</p>
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">Genre</p>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${movie.genre.map(g => `<span style="background: rgba(255, 107, 53, 0.2); color: var(--primary-color); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem;">${g}</span>`).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">Description</p>
                    <p>${movie.description}</p>
                </div>

                <div style="background: rgba(255, 107, 53, 0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">Director</p>
                    <p style="margin-bottom: 1rem;">${movie.director}</p>
                    
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">Cast</p>
                    <p style="margin-bottom: 1rem;">${movie.cast.join(', ')}</p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.85rem;">Budget</p>
                            <p style="font-weight: 700;">${movie.budget}</p>
                        </div>
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.85rem;">Box Office</p>
                            <p style="font-weight: 700;">${movie.boxOffice}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeMovieModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ========================================
// NEWSLETTER SIGNUP
// ========================================

function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (validateEmail(email)) {
        showNotification('✓ Successfully subscribed to our newsletter!', 'success');
        newsletterForm.reset();
    } else {
        showNotification('✗ Please enter a valid email address', 'error');
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// NOTIFICATIONS
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#1abc9c' : type === 'error' ? '#e74c3c' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        animation: slideInBottom 0.3s ease-out;
        z-index: 3000;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeInUp 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all movie cards and sections
    document.querySelectorAll('.featured-card, .category-card, .section-title').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // Close modal with Escape
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeMovieModal();
    }
    
    // Search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ========================================
// LOCAL STORAGE FOR FAVORITES
// ========================================

function saveFavorite(movieId) {
    let favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        localStorage.setItem('movieFavorites', JSON.stringify(favorites));
        showNotification('♡ Added to favorites!', 'success');
    }
}

function removeFavorite(movieId) {
    let favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    favorites = favorites.filter(id => id !== movieId);
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    showNotification('Removed from favorites', 'info');
}

function isFavorited(movieId) {
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    return favorites.includes(movieId);
}

// ========================================
// PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

console.log('Freemovie.BD Movie Platform initialized successfully! 🎬');
