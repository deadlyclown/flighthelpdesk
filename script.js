/**
 * Flight Help Desk - Enhanced JavaScript
 * Weather animations, carousel, and interactions
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
    const floatingBtn = document.getElementById('floatingBtn');
    const animatedElements = document.querySelectorAll('[data-animate]');
    const rain = document.getElementById('rain');
    const lightning = document.getElementById('lightning');
    const bolt1 = document.getElementById('bolt1');
    const bolt2 = document.getElementById('bolt2');
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewsNav = document.getElementById('reviewsNav');

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    }

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function toggleMobileMenu() {
        navbarToggle.classList.toggle('navbar__toggle--active');
        mobileMenu.classList.toggle('mobile-menu--active');
        document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navbarToggle.classList.remove('navbar__toggle--active');
        mobileMenu.classList.remove('mobile-menu--active');
        document.body.style.overflow = '';
    }

    // ============================================
    // Floating Button Visibility
    // ============================================
    function handleFloatingButton() {
        const heroSection = document.querySelector('.hero');
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        
        if (heroBottom < 0) {
            floatingBtn.classList.add('floating-btn--visible');
        } else {
            floatingBtn.classList.remove('floating-btn--visible');
        }
    }

    // ============================================
    // Rain Animation - Create Drops
    // ============================================
    function createRainDrops() {
        if (!rain) return;
        
        const dropCount = 80;
        
        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            // Random positioning and timing
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = 0.6 + Math.random() * 0.5;
            const opacity = 0.3 + Math.random() * 0.4;
            
            drop.style.left = `${left}%`;
            drop.style.animationDelay = `${delay}s`;
            drop.style.animationDuration = `${duration}s`;
            drop.style.opacity = opacity;
            
            rain.appendChild(drop);
        }
    }

    // ============================================
    // Lightning Effect - Enhanced with Bolts
    // ============================================
    function triggerLightning() {
        if (!lightning) return;
        
        // Flash overlay
        lightning.classList.add('lightning--flash');
        
        // Randomly show lightning bolts
        if (Math.random() > 0.5 && bolt1) {
            setTimeout(() => {
                bolt1.classList.add('lightning-bolt--flash');
                setTimeout(() => {
                    bolt1.classList.remove('lightning-bolt--flash');
                }, 300);
            }, 50);
        }
        
        if (Math.random() > 0.6 && bolt2) {
            setTimeout(() => {
                bolt2.classList.add('lightning-bolt--flash');
                setTimeout(() => {
                    bolt2.classList.remove('lightning-bolt--flash');
                }, 300);
            }, 150);
        }
        
        setTimeout(() => {
            lightning.classList.remove('lightning--flash');
        }, 400);
    }

    function scheduleLightning() {
        // Random interval between 4-10 seconds
        const interval = Math.random() * 6000 + 4000;
        
        setTimeout(() => {
            triggerLightning();
            scheduleLightning();
        }, interval);
    }

    // ============================================
    // Reviews Carousel
    // ============================================
    let currentSlide = 0;
    let autoSlideInterval;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    function initCarousel() {
        if (!reviewsTrack || !reviewsNav) return;

        const dots = reviewsNav.querySelectorAll('.reviews__dot');
        const cards = reviewsTrack.querySelectorAll('.review-card');
        const totalSlides = cards.length;

        function goToSlide(index) {
            currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('reviews__dot--active', i === currentSlide);
            });

            // Scroll to card
            const cardWidth = cards[0].offsetWidth + 32;
            reviewsTrack.scrollTo({
                left: cardWidth * currentSlide,
                behavior: 'smooth'
            });
        }

        function nextSlide() {
            const next = (currentSlide + 1) % totalSlides;
            goToSlide(next);
        }

        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
        });

        // Auto slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Drag to scroll
        reviewsTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - reviewsTrack.offsetLeft;
            scrollLeft = reviewsTrack.scrollLeft;
            reviewsTrack.style.cursor = 'grabbing';
        });

        reviewsTrack.addEventListener('mouseleave', () => {
            isDragging = false;
            reviewsTrack.style.cursor = 'grab';
        });

        reviewsTrack.addEventListener('mouseup', () => {
            isDragging = false;
            reviewsTrack.style.cursor = 'grab';
            
            // Snap to nearest slide
            const cardWidth = cards[0].offsetWidth + 32;
            const nearestSlide = Math.round(reviewsTrack.scrollLeft / cardWidth);
            goToSlide(Math.min(nearestSlide, totalSlides - 1));
            resetAutoSlide();
        });

        reviewsTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - reviewsTrack.offsetLeft;
            const walk = (x - startX) * 1.5;
            reviewsTrack.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        reviewsTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - reviewsTrack.offsetLeft;
            scrollLeft = reviewsTrack.scrollLeft;
        }, { passive: true });

        reviewsTrack.addEventListener('touchend', () => {
            const cardWidth = cards[0].offsetWidth + 32;
            const nearestSlide = Math.round(reviewsTrack.scrollLeft / cardWidth);
            goToSlide(Math.min(nearestSlide, totalSlides - 1));
            resetAutoSlide();
        });

        reviewsTrack.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - reviewsTrack.offsetLeft;
            const walk = (x - startX) * 1.5;
            reviewsTrack.scrollLeft = scrollLeft - walk;
        }, { passive: true });

        // Start auto slide
        startAutoSlide();

        // Pause on hover
        reviewsTrack.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        reviewsTrack.addEventListener('mouseleave', () => {
            if (!isDragging) startAutoSlide();
        });
    }

    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    function initScrollAnimations() {
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function handleSmoothScroll(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        closeMobileMenu();
    }

    // ============================================
    // Call Button Feedback
    // ============================================
    function trackCallClick(e) {
        const link = e.target.closest('a[href^="tel:"]');
        if (!link) return;

        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
        }, 150);
    }

    // ============================================
    // Throttle Function
    // ============================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        // Create rain drops
        createRainDrops();

        // Event listeners
        window.addEventListener('scroll', throttle(() => {
            handleNavbarScroll();
            handleFloatingButton();
        }, 16), { passive: true });

        // Navbar toggle
        if (navbarToggle) {
            navbarToggle.addEventListener('click', toggleMobileMenu);
        }

        // Mobile menu links
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Smooth scroll
        document.addEventListener('click', handleSmoothScroll);

        // Call button feedback
        document.addEventListener('click', trackCallClick);

        // Scroll animations
        initScrollAnimations();

        // Lightning effect
        scheduleLightning();

        // Carousel
        initCarousel();

        // Initial states
        handleNavbarScroll();
        handleFloatingButton();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
