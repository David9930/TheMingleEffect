// Blog Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
});

function initializeBlog() {
    // Setup category filtering
    setupCategoryFiltering();
    
    // Setup load more functionality
    setupLoadMore();
    
    // Setup newsletter form
    setupNewsletterForm();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup tag interactions
    setupTagInteractions();
}

// Category Filtering
function setupCategoryFiltering() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.getAttribute('data-category');
            
            // Update active category
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            filterPosts(category, blogPosts);
        });
    });
}

function filterPosts(category, posts) {
    posts.forEach(post => {
        const postCategory = post.querySelector('.post-category');
        
        if (category === 'all') {
            post.style.display = 'block';
            animateIn(post);
        } else {
            const postCategoryText = postCategory ? postCategory.textContent.toLowerCase() : '';
            
            if (postCategoryText.includes(category.toLowerCase())) {
                post.style.display = 'block';
                animateIn(post);
            } else {
                post.style.display = 'none';
            }
        }
    });
}

function animateIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.5s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

// Load More Functionality
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles();
        });
    }
}

function loadMoreArticles() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const blogPosts = document.querySelector('.blog-posts');
    
    // Show loading state
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more articles (replace with actual API call)
    setTimeout(() => {
        const newArticles = createMoreArticles();
        
        newArticles.forEach(article => {
            blogPosts.insertBefore(article, loadMoreBtn.parentElement);
        });
        
        // Reset button
        loadMoreBtn.textContent = 'Load More Articles';
        loadMoreBtn.disabled = false;
        
        // Animate new articles
        newArticles.forEach((article, index) => {
            setTimeout(() => {
                animateIn(article);
            }, index * 100);
        });
        
    }, 1000);
}

function createMoreArticles() {
    // Sample additional articles (in a real app, this would come from an API)
    const additionalArticles = [
        {
            category: 'Community',
            title: 'The Power of Neighborhood Gatherings',
            excerpt: 'How simple block parties and community events can transform isolated neighborhoods into thriving, connected communities...',
            author: 'Sarah Johnson',
            date: 'April 20, 2024',
            readTime: '4 min read',
            image: 'images/blog-pic-4.jpg'
        },
        {
            category: 'Mental Health',
            title: 'Breaking the Isolation Cycle',
            excerpt: 'Understanding the mental health impacts of social isolation and practical steps to rebuild meaningful connections...',
            author: 'Dr. Michael Chen',
            date: 'April 15, 2024',
            readTime: '6 min read',
            image: 'images/blog-pic-5.jpg'
        }
    ];
    
    return additionalArticles.map(article => createArticleElement(article));
}

function createArticleElement(articleData) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    article.style.opacity = '0';
    article.style.transform = 'translateY(30px)';
    
    article.innerHTML = `
        <div class="post-image">
            <img src="${articleData.image}" alt="${articleData.title}" class="post-img">
            <div class="post-category">${articleData.category}</div>
        </div>
        <div class="post-content">
            <div class="post-meta">
                <span class="post-author">${articleData.author}</span>
                <span class="post-date">${articleData.date}</span>
                <span class="post-reading-time">${articleData.readTime}</span>
            </div>
            <h2 class="post-title">
                <a href="#">${articleData.title}</a>
            </h2>
            <p class="post-excerpt">${articleData.excerpt}</p>
            <a href="#" class="read-more">Read Full Article →</a>
        </div>
    `;
    
    return article;
}

// Newsletter Form
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSignup(this);
        });
    }
}

function handleNewsletterSignup(form) {
    const email = form.querySelector('input[type="email"]').value;
    const submitBtn = form.querySelector('.btn-newsletter');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNewsletterSuccess(form);
        
        // Reset form
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

function showNewsletterSuccess(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'newsletter-success';
    successMessage.innerHTML = '✓ Successfully subscribed!';
    successMessage.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 10px;
        border-radius: 6px;
        text-align: center;
        margin-top: 10px;
        font-weight: 600;
    `;
    
    form.appendChild(successMessage);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
        }
    }, 3000);
}

// Scroll Animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Animate blog posts
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        post.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(post);
    });
    
    // Animate sidebar widgets
    const sidebarWidgets = document.querySelectorAll('.sidebar-widget');
    sidebarWidgets.forEach((widget, index) => {
        widget.style.opacity = '0';
        widget.style.transform = 'translateX(30px)';
        widget.style.transition = `opacity 0.6s ease ${index * 0.1 + 0.3}s, transform 0.6s ease ${index * 0.1 + 0.3}s`;
        observer.observe(widget);
    });
}

// Tag Interactions
function setupTagInteractions() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add ripple effect
            addRippleEffect(this, e);
            
            // Handle tag filtering (could be implemented)
            const tagText = this.textContent;
            console.log('Filtering by tag:', tagText);
        });
    });
}

function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Search Functionality (basic implementation)
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const blogPosts = document.querySelectorAll('.blog-post');
            
            blogPosts.forEach(post => {
                const title = post.querySelector('.post-title a').textContent.toLowerCase();
                const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
                const category = post.querySelector('.post-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                    post.style.display = 'block';
                    animateIn(post);
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }
}

// Social Sharing Functions
function shareOnFacebook(url, title) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, 'facebook-share', 'width=580,height=296');
}

function shareOnTwitter(url, title) {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, 'twitter-share', 'width=580,height=296');
}

function shareOnLinkedIn(url, title) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, 'linkedin-share', 'width=580,height=296');
}

function shareViaEmail(url, title) {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Check out this article: ${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization for scroll events
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-based animations or lazy loading here
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize search if search input exists
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
});

// Export functions for use in other scripts
window.blogUtils = {
    shareOnFacebook,
    shareOnTwitter,
    shareOnLinkedIn,
    shareViaEmail,
    animateIn,
    addRippleEffect
};
