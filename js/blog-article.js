// Blog Article Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeArticle();
});

function initializeArticle() {
    // Setup reading progress indicator
    setupReadingProgress();
    
    // Setup smooth scrolling for internal links
    setupSmoothScrolling();
    
    // Setup social sharing
    setupSocialSharing();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup article interactions
    setupArticleInteractions();
    
    // Setup print functionality
    setupPrintFunctionality();
}

// Reading Progress Indicator
function setupReadingProgress() {
    const progressBar = createProgressBar();
    const article = document.querySelector('.article-content');
    
    if (article) {
        window.addEventListener('scroll', throttle(updateReadingProgress, 10));
    }
}

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    return progressBar;
}

function updateReadingProgress() {
    const article = document.querySelector('.article-content');
    const progressBar = document.getElementById('reading-progress');
    
    if (!article || !progressBar) return;
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    
    const progress = Math.min(
        Math.max((scrollTop - articleTop + windowHeight * 0.3) / articleHeight, 0),
        1
    );
    
    progressBar.style.width = (progress * 100) + '%';
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Social Sharing
function setupSocialSharing() {
    // Get current page info
    const pageUrl = window.location.href;
    const pageTitle = document.querySelector('.article-title').textContent;
    
    // Setup share button event listeners
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList.contains('facebook') ? 'facebook' :
                           this.classList.contains('twitter') ? 'twitter' :
                           this.classList.contains('linkedin') ? 'linkedin' :
                           this.classList.contains('email') ? 'email' : null;
            
            if (platform) {
                shareArticle(platform, pageUrl, pageTitle);
            }
        });
    });
}

function shareArticle(platform, url, title) {
    let shareUrl;
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'email':
            const subject = encodeURIComponent(`Check out: ${title}`);
            const body = encodeURIComponent(`I thought you might find this article interesting:\n\n${title}\n${url}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, `${platform}-share`, 'width=580,height=400');
    }
}

// Global share functions for onclick handlers
window.shareOnFacebook = function() {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    shareArticle('facebook', url, title);
};

window.shareOnTwitter = function() {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    shareArticle('twitter', url, title);
};

window.shareOnLinkedIn = function() {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    shareArticle('linkedin', url, title);
};

window.shareViaEmail = function() {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    shareArticle('email', url, title);
};

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
    
    // Animate article sections
    const sections = document.querySelectorAll('.author-bio, .related-articles, .comments-section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });
    
    // Animate related posts
    const relatedPosts = document.querySelectorAll('.related-post');
    relatedPosts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateX(-20px)';
        post.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
        observer.observe(post);
    });
}

// Article Interactions
function setupArticleInteractions() {
    // Add copy link functionality
    addCopyLinkButton();
    
    // Add reading time calculator
    calculateReadingTime();
    
    // Add table of contents if article is long
    addTableOfContents();
    
    // Add image zoom functionality
    setupImageZoom();
}

function addCopyLinkButton() {
    const shareButtons = document.querySelector('.share-buttons');
    if (shareButtons) {
        const copyButton = document.createElement('a');
        copyButton.href = '#';
        copyButton.className = 'share-btn copy';
        copyButton.textContent = 'Copy Link';
        copyButton.style.background = '#6c757d';
        copyButton.style.color = 'white';
        
        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(window.location.href).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            });
        });
        
        shareButtons.appendChild(copyButton);
    }
}

function calculateReadingTime() {
    const content = document.querySelector('.article-content');
    const readingTimeElement = document.querySelector('.article-reading-time');
    
    if (content && readingTimeElement) {
        const text = content.textContent;
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);
        
        readingTimeElement.textContent = `${readingTime} min read`;
    }
}

function addTableOfContents() {
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    
    if (headings.length > 3) {
        const toc = createTableOfContents(headings);
        const articleContent = document.querySelector('.article-content');
        
        if (articleContent && toc) {
            articleContent.insertBefore(toc, articleContent.firstChild);
        }
    }
}

function createTableOfContents(headings) {
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.style.cssText = `
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #667eea;
        margin-bottom: 30px;
    `;
    
    const tocTitle = document.createElement('h4');
    tocTitle.textContent = 'Table of Contents';
    tocTitle.style.marginBottom = '15px';
    tocContainer.appendChild(tocTitle);
    
    const tocList = document.createElement('ul');
    tocList.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
    `;
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const listItem = document.createElement('li');
        listItem.style.marginBottom = '8px';
        
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.style.cssText = `
            color: #667eea;
            text-decoration: none;
            font-size: 0.9rem;
            padding-left: ${heading.tagName === 'H3' ? '20px' : '0'};
        `;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocList);
    return tocContainer;
}

function setupImageZoom() {
    const images = document.querySelectorAll('.article-content img, .article-img');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Print Functionality
function setupPrintFunctionality() {
    // Add print button
    const articleFooter = document.querySelector('.article-footer');
    if (articleFooter) {
        const printButton = document.createElement('button');
        printButton.textContent = '🖨️ Print Article';
        printButton.className = 'btn-print';
        printButton.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-left: 10px;
        `;
        
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        const shareButtons = articleFooter.querySelector('.share-buttons');
        if (shareButtons) {
            shareButtons.appendChild(printButton);
        }
    }
}

// Utility Functions
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

// Font size adjustment
function setupFontSizeControls() {
    const controls = document.createElement('div');
    controls.className = 'font-controls';
    controls.style.cssText = `
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        padding: 10px;
        border-radius: 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
        gap: 5px;
        z-index: 100;
    `;
    
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = 'A+';
    increaseBtn.onclick = () => adjustFontSize(1.1);
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = 'A-';
    decreaseBtn.onclick = () => adjustFontSize(0.9);
    
    [increaseBtn, decreaseBtn].forEach(btn => {
        btn.style.cssText = `
            border: none;
            background: #f8f9fa;
            padding: 5px 8px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 0.8rem;
        `;
    });
    
    controls.appendChild(increaseBtn);
    controls.appendChild(decreaseBtn);
    document.body.appendChild(controls);
}

function adjustFontSize(multiplier) {
    const content = document.querySelector('.article-content');
    const currentSize = parseFloat(getComputedStyle(content).fontSize);
    content.style.fontSize = (currentSize * multiplier) + 'px';
}

// Initialize font controls
setTimeout(setupFontSizeControls, 1000);

// Back to top functionality
function addBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #667eea;
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 100;
    `;
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize back to top
addBackToTop();
