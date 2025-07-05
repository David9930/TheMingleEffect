// Derek Page Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initDerekPage();
});

function initDerekPage() {
    // Parallax effect for hero section
    setupParallax();
    
    // Intersection Observer for timeline animations
    setupTimelineAnimations();
    
    // Smooth scrolling for scroll indicator
    setupSmoothScroll();
    
    // Interactive hover effects
    setupInteractiveEffects();
    
    // Typing effect for hero subtitle
    setupTypingEffect();
}

// Parallax Effect
function setupParallax() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Timeline Intersection Observer
function setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                
                // Add special effect for featured card
                if (entry.target.querySelector('.featured')) {
                    setTimeout(() => {
                        entry.target.querySelector('.timeline-dot').classList.add('active');
                    }, 500);
                }
            }
        });
    }, observerOptions);
