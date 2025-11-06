// Mobile Navigation JavaScript - Add to your existing JS files or in a script tag

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const toggleButton = document.querySelector('.mobile-nav-toggle');
    
    navMenu.classList.toggle('active');
    
    // Change hamburger icon when menu is open
    if (navMenu.classList.contains('active')) {
        toggleButton.innerHTML = '✕';
    } else {
        toggleButton.innerHTML = '☰';
    }
}

// Close menu when clicking on a navigation link
function setupMobileMenuClosing() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('navMenu');
            const toggleButton = document.querySelector('.mobile-nav-toggle');
            
            navMenu.classList.remove('active');
            toggleButton.innerHTML = '☰';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('navMenu');
        const toggleButton = document.querySelector('.mobile-nav-toggle');
        
        if (!navMenu.contains(e.target) && !toggleButton.contains(e.target)) {
            navMenu.classList.remove('active');
            toggleButton.innerHTML = '☰';
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', setupMobileMenuClosing);

// Alternative: If you don't want to modify existing files, add this to any page:
/*
<script>
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const toggleButton = document.querySelector('.mobile-nav-toggle');
    
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
        toggleButton.innerHTML = '✕';
    } else {
        toggleButton.innerHTML = '☰';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('navMenu');
            const toggleButton = document.querySelector('.mobile-nav-toggle');
            
            navMenu.classList.remove('active');
            toggleButton.innerHTML = '☰';
        });
    });

    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('navMenu');
        const toggleButton = document.querySelector('.mobile-nav-toggle');
        
        if (!navMenu.contains(e.target) && !toggleButton.contains(e.target)) {
            navMenu.classList.remove('active');
            toggleButton.innerHTML = '☰';
        }
    });
});
</script>
*/
