/**
 * Flight Help Desk - Enhanced JavaScript
 * Premium animations, carousel, and interactions
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
    const airplane = document.getElementById('airplane');
    const lightning = document.getElementById('lightning');
    const rain = document.getElementById('rain');
    const animatedElements = document.querySelectorAll('[data-animate]');
    const clouds = document.querySelectorAll('.cloud');
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewsNav = document.getElementById('reviewsNav');

    // ============================================
    // Navbar Scroll Effect - Enhanced
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
    // Parallax Cloud Animation
    // ============================================
    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollPercent = scrollY / (docHeight - windowHeight);

        // Animate airplane - diagonal movement
        if (airplane) {
            const startX = -120;
            const endX = window.innerWidth + 120;
            const startY = 12; // percentage
            const endY = 75; // percentage
            
            // Calculate position based on scroll
            const scrollProgress = Math.min(scrollY / (docHeight * 0.5), 1);
            const currentX = startX + (scrollProgress * (endX - startX));
            const currentY = startY + (scrollProgress * (endY - startY));
            
            airplane.style.left = `${currentX}px`;
            airplane.style.top = `${currentY}%`;
            airplane.style.transform = `rotate(${12 + scrollProgress * 8}deg)`;
        }

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // ============================================
    // Rain Animation
    // ============================================
    function createRainDrops() {
        if (!rain) return;
        
        const dropCount = 60;
        
        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            // Random positioning and timing
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = 0.8 + Math.random() * 0.6;
            const opacity = 0.3 + Math.random() * 0.4;
            
            drop.style.left = `${left}%`;
            drop.style.animationDelay = `${delay}s`;
            drop.style.animationDuration = `${duration}s`;
            drop.style.opacity = opacity;
            
            rain.appendChild(drop);
        }
    }

    // ============================================
    // Lightning Effect - Enhanced
    // ============================================
    function triggerLightning() {
        if (!lightning) return;
        
        lightning.classList.add('lightning--flash');
        
        setTimeout(() => {
            lightning.classList.remove('lightning--flash');
        }, 400);
    }

    function scheduleLightning() {
        // Random interval between 5-12 seconds
        const interval = Math.random() * 7000 + 5000;
        
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
            currentSlide = index;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('reviews__dot--active', i === index);
            });

            // Scroll to card
            const cardWidth = cards[0].offsetWidth + 32; // Including gap
            reviewsTrack.scrollTo({
                left: cardWidth * index,
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

        // Close mobile menu if open
        closeMobileMenu();
    }

    // ============================================
    // Call Button Feedback
    // ============================================
    function trackCallClick(e) {
        const link = e.target.closest('a[href^="tel:"]');
        if (!link) return;

        // Add click feedback animation
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
        // Initial parallax position
        updateParallax();

        // Create rain drops
        createRainDrops();

        // Event listeners
        window.addEventListener('scroll', throttle(() => {
            handleNavbarScroll();
            handleFloatingButton();
            requestParallaxUpdate();
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

        // Initial navbar state
        handleNavbarScroll();

        // Initial floating button state
        handleFloatingButton();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle resize
    window.addEventListener('resize', throttle(() => {
        updateParallax();
    }, 100));

})();
