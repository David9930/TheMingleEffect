// Idea Generator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize idea generator functionality
    initializeIdeaGenerator();
});

function initializeIdeaGenerator() {
    // Add smooth scrolling for internal links
    setupSmoothScrolling();
    
    // Add interactive effects to idea cards
    setupIdeaCardEffects();
    
    // Setup form handling if contact form exists
    setupFormHandling();
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Interactive effects for idea cards
function setupIdeaCardEffects() {
    const ideaCards = document.querySelectorAll('.idea-card');
    
    ideaCards.forEach(card => {
        // Add entrance animation when scrolled into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(card);
        
        // Add click tracking for analytics (if needed)
        card.addEventListener('click', function() {
            const ideaNumber = this.getAttribute('data-idea');
            console.log(`Idea ${ideaNumber} card clicked`);
            // Add analytics tracking here if needed
        });
    });
}

// Form handling for idea submissions
function setupFormHandling() {
    const submitButtons = document.querySelectorAll('.btn-submit-idea');
    
    submitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add any pre-submission logic here
            console.log('Idea submission clicked');
            // Could add form validation, analytics, etc.
        });
    });
}

// Utility function for creating animations
function animateElement(element, animation) {
    element.style.animation = animation;
    
    element.addEventListener('animationend', function() {
        element.style.animation = '';
    }, { once: true });
}

// Add parallax effect to hero section (optional)
function setupParallaxEffect() {
    const hero = document.querySelector('.generator-hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialize parallax if desired
// setupParallaxEffect();
