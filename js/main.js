// Set default theme to dark
document.body.setAttribute('data-theme', 'dark');

// Create and append theme toggle button
function createThemeToggle() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.innerHTML = '<i class="fas fa-sun"></i>';
    button.setAttribute('aria-label', 'Toggle theme');
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        button.innerHTML = `<i class="fas fa-${newTheme === 'dark' ? 'sun' : 'moon'}"></i>`;
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    });
}

// Check for saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = `<i class="fas fa-${savedTheme === 'dark' ? 'sun' : 'moon'}"></i>`;
    }
}

// Setup animations using Intersection Observer
function setupAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    document.querySelectorAll('.project-card, .skill-category, .highlight-item, .contact-item').forEach(el => {
        el.classList.add('animation-ready');
        observer.observe(el);
    });
}

// Smooth scrolling for navigation
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

// Active navigation highlighting
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Performance optimization for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Loading screen handler
function handleLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    
    // Show loading screen for at least 1.5 seconds
    const minimumLoadTime = 1500;
    const startTime = Date.now();

    function hideLoading() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);

        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            mainContent.classList.remove('content-hidden');
            mainContent.classList.add('content-visible');
            setupAnimations();
        }, remainingTime);
    }

    window.addEventListener('load', hideLoading);
    setTimeout(hideLoading, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleLoading();
    createThemeToggle();
    loadThemePreference();
});

// Add scroll event listener with debouncing
window.addEventListener('scroll', debounce(updateActiveNav, 100));
