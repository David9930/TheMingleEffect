// Main JavaScript for The Mingle Effect Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    init();
});

function init() {
    // Set up audio players
    setupAudioPlayers();
    
    // Set up navigation
    setupNavigation();
    
    // Add smooth scrolling
    addSmoothScrolling();
}

// Audio Player Enhancement
function setupAudioPlayers() {
    const audioElements = document.querySelectorAll('.audio-control');
    
    audioElements.forEach(audio => {
        // Add loading event listener
        audio.addEventListener('loadedmetadata', function() {
            console.log('Audio loaded:', this.src);
        });
        
        // Add error handling
        audio.addEventListener('error', function() {
            console.log('Audio failed to load:', this.src);
            // You could add user-friendly error messages here
        });
        
        // Add play/pause analytics (optional)
        audio.addEventListener('play', function() {
            console.log('Audio started playing:', this.src);
        });
        
        audio.addEventListener('pause', function() {
            console.log('Audio paused:', this.src);
        });
    });
}

// Navigation Enhancement
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

// Smooth Scrolling for Internal Links
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility function to pause all audio when one starts playing
function pauseOtherAudio(currentAudio) {
    const allAudio = document.querySelectorAll('.audio-control');
    
    allAudio.forEach(audio => {
        if (audio !== currentAudio && !audio.paused) {
            audio.pause();
        }
    });
}

// Add event listeners to pause other audio when one starts
document.addEventListener('play', function(e) {
    if (e.target.classList.contains('audio-control')) {
        pauseOtherAudio(e.target);
    }
}, true);

// Simple fade-in animation for main content
function fadeInContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease-in-out';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 100);
    }
}

// Call fade-in on load
window.addEventListener('load', fadeInContent);
