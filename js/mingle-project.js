// Mingle Project Page Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initMingleProject();
});

function initMingleProject() {
    // Animated statistics counter
    setupStatsAnimation();
    
    // Smooth scrolling for navigation
    setupSmoothScrolling();
    
    // Interactive hover effects
    setupInteractiveElements();
    
    // Parallax effects
    setupParallaxEffects();
    
    // Connection diagram animation
    setupConnectionAnimation();
    
    // Scroll-triggered animations
    setupScrollAnimations();
    
    // City cards interactive effect
    setupCityCardsEffect();
}

// Animated Statistics Counter
function setupStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, 0, target, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (element.getAttribute('data-target') === '6.7') {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
        
        if (current >= end) {
            if (element.getAttribute('data-target') === '6.7') {
                element.textContent = end.toFixed(1);
            } else {
                element.textContent = end;
            }
            clearInterval(timer);
            
            // Add completion animation
            element.style.transform = 'scale(1.2)';
            element.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }, 16);
}

// Smooth Scrolling
function setupSmoothScrolling() {
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const crisisSection = document.querySelector('.crisis-section');
            if (crisisSection) {
                crisisSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Take action button scrolling
    const takeActionButtons = document.querySelectorAll('a[href="#take-action"]');
    takeActionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector('#take-action');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Interactive Elements
function setupInteractiveElements() {
    // Stat cards hover effect
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Feature cards interactive effect
    const featureCards = document.querySelectorAll('.feature');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Action cards pulse effect
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.action-icon');
            if (icon) {
                icon.style.animation = 'pulse 1s ease-in-out infinite';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.action-icon');
            if (icon) {
                icon.style.animation = 'none';
            }
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.transition = 'all 0.3s ease';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
}

// Parallax Effects
function setupParallaxEffects() {
    const heroBackground = document.querySelector('.hero-background');
    const floatingIcons = document.querySelectorAll('.floating-icons .icon');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.2;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        // Individual icon movement
        floatingIcons.forEach((icon, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            const rotation = scrolled * 0.02;
            icon.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        });
    });
}

// Connection Diagram Animation
function setupConnectionAnimation() {
    const connectionDiagram = document.querySelector('.connection-diagram');
    
    if (connectionDiagram) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateConnections();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(connectionDiagram);
    }
}

function animateConnections() {
    const lines = document.querySelectorAll('.line');
    const persons = document.querySelectorAll('.person');
    
    // Animate persons appearing
    persons.forEach((person, index) => {
        setTimeout(() => {
            person.style.opacity = '0';
            person.style.transform += ' scale(0)';
            person.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                person.style.opacity = '1';
                person.style.transform = person.style.transform.replace('scale(0)', 'scale(1)');
            }, 100);
        }, index * 200);
    });
    
    // Animate connection lines
    lines.forEach((line, index) => {
        setTimeout(() => {
            const originalWidth = line.style.width || '106px';
            line.style.width = '0';
            line.style.transition = 'width 0.8s ease-out';
            
            setTimeout(() => {
                line.style.width = originalWidth;
            }, 100);
        }, 1000 + (index * 150));
    });
}

// Scroll-triggered Animations
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.timeline-item, .point, .feature, .action-card, .resource-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// City cards interactive effect
function setupCityCardsEffect() {
    const cityCards = document.querySelectorAll('.city-card');
    
    cityCards.forEach(card => {
        card.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Advanced scroll effects with throttling
let ticking = false;

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    
    // Header background change on scroll
    const header = document.querySelector('.header');
    if (header && scrolled > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        header.style.transition = 'all 0.3s ease';
    } else if (header) {
        header.style.background = 'rgba(255, 255, 255, 1)';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'none';
    }
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate);

// Easter Egg: Konami Code for special animation
function setupEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (userInput.join(',') === konamiCode.join(',')) {
            triggerMingleMagic();
            userInput = [];
        }
    });
}

function triggerMingleMagic() {
    // Create magical connection animation
    const connectButton = document.createElement('div');
    connectButton.innerHTML = '🤝';
    connectButton.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5rem;
        z-index: 9999;
        animation: magicPulse 2s ease-in-out;
        pointer-events: none;
    `;
    
    document.body.appendChild(connectButton);
    
    // Add magic animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes magicPulse {
            0%, 100% { 
                transform: translate(-50%, -50%) scale(1); 
                opacity: 1; 
            }
            50% { 
                transform: translate(-50%, -50%) scale(2); 
                opacity: 0.8; 
            }
        }
    `;
    document.head.appendChild(style);
    
    // Show message
    setTimeout(() => {
        alert('🤝 Magic activated! The Mingle Project spreads connection wherever you go! 🌟');
        connectButton.remove();
        style.remove();
    }, 2000);
    
    // Add temporary sparkle effects
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 200);
    }
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        z-index: 9998;
        animation: sparkleFloat 3s ease-out forwards;
    `;
    
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(sparkleStyle);
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
        sparkleStyle.remove();
    }, 3000);
}

// Initialize easter egg
setupEasterEgg();

// Performance optimization: Intersection Observer for heavy animations
function optimizeAnimations() {
    const heavyAnimationElements = document.querySelectorAll('.connection-diagram, .michael-img');
    
    const performanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Enable animations when visible
                entry.target.style.animationPlayState = 'running';
            } else {
                // Pause animations when not visible
                entry.target.style.animationPlayState = 'paused';
            }
        });
    }, { threshold: 0.1 });
    
    heavyAnimationElements.forEach(element => {
        performanceObserver.observe(element);
    });
}

// Initialize performance optimizations
optimizeAnimations();
