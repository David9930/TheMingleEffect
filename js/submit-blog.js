// Submit Blog Article JavaScript with Google Sheets Integration

// Configuration - Replace with your actual Google Apps Script web app URL
const BLOG_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwq0kM1yM7VzdgVIZ4gVZLcYnxIEEVi3z-wxzOOy5gN33IxGUJecB4y3y3jJ1S8VBFJow/exec';

// Debug flag
const DEBUG_MODE = true;

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogForm();
});

function initializeBlogForm() {
    // Setup character counters
    setupCharacterCounters();
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup form clearing
    setupFormClear();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup file handling
    setupFileHandling();
    
    // Setup terms modal
    setupTermsModal();
    
    // Setup auto-save (optional)
    setupAutoSave();
}

function setupCharacterCounters() {
    const fields = [
        { id: 'authorBio', counterId: 'bioCharCounter', maxLength: 300 },
        { id: 'articleSubtitle', counterId: 'subtitleCharCounter', maxLength: 200 },
        { id: 'articleContent', counterId: 'contentCharCounter', maxLength: 8000 }
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        const counter = document.getElementById(field.counterId);
        
        if (element && counter) {
            element.addEventListener('input', function() {
                updateCharCounter(this, counter, field.maxLength);
            });
            updateCharCounter(element, counter, field.maxLength);
        }
    });
}

function updateCharCounter(field, counter, maxLength) {
    const length = field.value.length;
    counter.textContent = `${length} / ${maxLength}`;
    
    counter.className = 'char-counter';
    if (length > maxLength * 0.9) {
        counter.className += ' danger';
    } else if (length > maxLength * 0.7) {
        counter.className += ' warning';
    }
}

function setupFormSubmission() {
    const form = document.getElementById('blogForm');
    form.addEventListener('submit', handleBlogSubmit);
}

function setupFormClear() {
    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
            clearForm();
        }
    });
}

function setupFormValidation() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function setupFileHandling() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateFileInput(this);
        });
    });
}

function setupTermsModal() {
    const termsLink = document.querySelector('a[onclick="showTerms()"]');
    const modal = document.getElementById('termsModal');
    const closeBtn = modal.querySelector('.close');
    
    // Remove inline onclick and use event listener
    if (termsLink) {
        termsLink.removeAttribute('onclick');
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showTerms();
        });
    }
    
    closeBtn.addEventListener('click', closeTerms);
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeTerms();
        }
    });
}

function showTerms() {
    document.getElementById('termsModal').style.display = 'block';
}

function closeTerms() {
    document.getElementById('termsModal').style.display = 'none';
}

// Make closeTerms globally available
window.showTerms = showTerms;
window.closeTerms = closeTerms;

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    if (field.type === 'email' && field.value.trim()) {
        if (!isValidEmail(field.value)) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }
    
    if (field.type === 'url' && field.value.trim()) {
        if (!isValidUrl(field.value)) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }
    
    field.style.borderColor = '#e1e5e9';
    return true;
}

function validateFileInput(input) {
    const files = Array.from(input.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg'];
    
    let isValid = true;
    
    files.forEach(file => {
        if (file.size > maxSize) {
            showStatus(`File "${file.name}" is too large. Maximum size is 5MB.`, 'error');
            isValid = false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showStatus(`File "${file.name}" is not a valid format. Only JPG files are allowed.`, 'error');
            isValid = false;
        }
    });
    
    if (!isValid) {
        input.value = '';
        input.style.borderColor = '#e74c3c';
    } else {
        input.style.borderColor = '#e1e5e9';
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

async function handleBlogSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = getFormData();
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    setFormLoading(true);
    showStatus('Submitting your article...', 'loading');
    
    try {
        // Send to Google Sheets
        const success = await sendBlogToSheets(formData);
        
        if (success) {
            showStatus('🎉 Thank you! Your article has been submitted successfully. We\'ll review it and contact you within 5-7 business days!', 'success');
            clearForm();
            clearSavedFormData();
            
            // Optional: redirect after delay
            setTimeout(() => {
                window.location.href = 'blog.html';
            }, 4000);
        } else {
            throw new Error('Failed to submit article');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        showStatus('Sorry, there was an error submitting your article. Please try again or contact us directly.', 'error');
    } finally {
        setFormLoading(false);
    }
}

function getFormData() {
    return {
        // Author Information
        authorName: document.getElementById('authorName').value.trim(),
        authorEmail: document.getElementById('authorEmail').value.trim(),
        authorBio: document.getElementById('authorBio').value.trim(),
        authorWebsite: document.getElementById('authorWebsite').value.trim(),
        
        // Article Details
        articleTitle: document.getElementById('articleTitle').value.trim(),
        articleCategory: document.getElementById('articleCategory').value,
        readingTime: document.getElementById('readingTime').value,
        articleSubtitle: document.getElementById('articleSubtitle').value.trim(),
        
        // Content
        articleContent: document.getElementById('articleContent').value.trim(),
        articleTags: document.getElementById('articleTags').value.trim(),
        
        // Preferences
        allowEditing: document.getElementById('allowEditing').checked ? 'Yes' : 'No',
        allowContact: document.getElementById('allowContact').checked ? 'Yes' : 'No',
        futureArticles: document.getElementById('futureArticles').checked ? 'Yes' : 'No',
        agreeTerms: document.getElementById('agreeTerms').checked ? 'Yes' : 'No',
        
        // Metadata
        timestamp: new Date().toLocaleString(),
        source: 'The Mingle Effect - Blog Submission',
        wordCount: document.getElementById('articleContent').value.trim().split(/\s+/).length
    };
}

function validateForm(data) {
    let isValid = true;
    const errors = [];
    
    // Required fields validation
    const requiredFields = [
        { field: 'authorName', name: 'Author Name', element: 'authorName' },
        { field: 'authorEmail', name: 'Author Email', element: 'authorEmail' },
        { field: 'articleTitle', name: 'Article Title', element: 'articleTitle' },
        { field: 'articleCategory', name: 'Article Category', element: 'articleCategory' },
        { field: 'readingTime', name: 'Reading Time', element: 'readingTime' },
        { field: 'articleSubtitle', name: 'Article Subtitle', element: 'articleSubtitle' },
        { field: 'articleContent', name: 'Article Content', element: 'articleContent' }
    ];
    
    requiredFields.forEach(field => {
        if (!data[field.field]) {
            errors.push(`${field.name} is required`);
            document.getElementById(field.element).style.borderColor = '#e74c3c';
            isValid = false;
        }
    });
    
    // Email validation
    if (data.authorEmail && !isValidEmail(data.authorEmail)) {
        errors.push('Valid email is required');
        document.getElementById('authorEmail').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    // URL validation
    if (data.authorWebsite && !isValidUrl(data.authorWebsite)) {
        errors.push('Valid website URL is required');
        document.getElementById('authorWebsite').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    // Terms agreement
    if (data.agreeTerms !== 'Yes') {
        errors.push('You must agree to the submission terms');
        isValid = false;
    }
    
    // Content length validation
    if (data.articleContent.length < 500) {
        errors.push('Article content must be at least 500 characters');
        document.getElementById('articleContent').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!isValid) {
        showStatus('Please fix the following errors: ' + errors.join(', '), 'error');
    }
    
    return isValid;
}

async function sendBlogToSheets(blogData) {
    try {
        if (DEBUG_MODE) {
            console.log('=== SENDING BLOG ARTICLE TO SHEETS ===');
            console.log('URL:', BLOG_SCRIPT_URL);
            console.log('Data being sent:', blogData);
        }
        
        // Prepare data for Google Sheets
        const submissionData = {
            action: 'addBlogArticle',
            ...blogData
        };
        
        if (DEBUG_MODE) {
            console.log('Formatted submission data:', submissionData);
        }
        
        // Use form submission method (same as contact form)
        return await sendViaForm(submissionData);
        
    } catch (error) {
        console.error('Error sending to sheets:', error);
        if (DEBUG_MODE) {
            console.log('=== SUBMISSION FAILED ===');
            console.error('Full error details:', error);
        }
        return false;
    }
}

function sendViaForm(data) {
    return new Promise((resolve) => {
        try {
            if (DEBUG_MODE) {
                console.log('=== USING FORM SUBMISSION METHOD ===');
                console.log('Creating hidden form for submission...');
            }
            
            const form = document.createElement('form');
            form.action = BLOG_SCRIPT_URL;
            form.method = 'POST';
            form.target = 'hiddenFrame';
            form.style.display = 'none';
            
            const dataField = document.createElement('input');
            dataField.type = 'hidden';
            dataField.name = 'data';
            dataField.value = JSON.stringify(data);
            form.appendChild(dataField);
            
            if (DEBUG_MODE) {
                console.log('Form data field value:', dataField.value);
            }
            
            // Create hidden iframe for submission
            let iframe = document.getElementById('hiddenFrame');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'hiddenFrame';
                iframe.name = 'hiddenFrame';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                if (DEBUG_MODE) {
                    console.log('Created hidden iframe for submission');
                }
            }
            
            document.body.appendChild(form);
            
            if (DEBUG_MODE) {
                console.log('Submitting form to:', form.action);
                console.log('Form target iframe:', form.target);
            }
            
            form.submit();
            
            // Clean up the form after submission
            setTimeout(() => {
                if (form.parentNode) {
                    document.body.removeChild(form);
                    if (DEBUG_MODE) {
                        console.log('Form cleanup completed');
                    }
                }
                if (DEBUG_MODE) {
                    console.log('=== FORM SUBMISSION COMPLETED ===');
                }
                resolve(true);
            }, 1000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            if (DEBUG_MODE) {
                console.log('=== FORM SUBMISSION FAILED ===');
                console.error('Full form error details:', error);
            }
            resolve(false);
        }
    });
}

function setFormLoading(loading) {
    const submitButton = document.getElementById('submitButton');
    const form = document.getElementById('blogForm');
    const inputs = form.querySelectorAll('input, select, textarea, button');
    
    if (loading) {
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        inputs.forEach(input => input.disabled = true);
    } else {
        submitButton.textContent = 'Submit Article for Review';
        submitButton.disabled = false;
        inputs.forEach(input => input.disabled = false);
    }
}

function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide success messages after 6 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 6000);
    }
    
    // Scroll to status message
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearForm() {
    const form = document.getElementById('blogForm');
    form.reset();
    
    // Reset character counters
    const counters = [
        { id: 'bioCharCounter', max: '300' },
        { id: 'subtitleCharCounter', max: '200' },
        { id: 'contentCharCounter', max: '8000' }
    ];
    
    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element) element.textContent = `0 / ${counter.max}`;
    });
    
    // Reset field borders
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '#e1e5e9';
    });
    
    // Hide status message
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.style.display = 'none';
}

// Auto-save functionality
function setupAutoSave() {
    const form = document.getElementById('blogForm');
    const saveKey = 'mingle-blog-draft';
    
    // Load saved data
    const savedData = localStorage.getItem(saveKey);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = document.getElementById(key);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = data[key];
                    } else {
                        field.value = data[key];
                    }
                }
            });
            
            // Update character counters after loading
            setupCharacterCounters();
            
        } catch (e) {
            console.log('Error loading saved form data');
        }
    }
    
    // Save data on input
    const saveFormData = () => {
        const formData = {};
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (field.type === 'checkbox') {
                formData[field.id] = field.checked;
            } else if (field.type !== 'file') {
                formData[field.id] = field.value;
            }
        });
        localStorage.setItem(saveKey, JSON.stringify(formData));
    };
    
    // Debounced save function
    let saveTimeout;
    const debouncedSave = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveFormData, 2000);
    };
    
    // Add listeners to all form fields except file inputs
    const fields = form.querySelectorAll('input:not([type="file"]), select, textarea');
    fields.forEach(field => {
        field.addEventListener('input', debouncedSave);
        field.addEventListener('change', debouncedSave);
    });
}

// Clear saved data function
function clearSavedFormData() {
    localStorage.removeItem('mingle-blog-draft');
}

// Word count display
function setupWordCount() {
    const contentField = document.getElementById('articleContent');
    const wordCountDisplay = document.createElement('div');
    wordCountDisplay.className = 'word-count';
    wordCountDisplay.style.cssText = `
        text-align: right;
        font-size: 0.85rem;
        color: #666;
        margin-top: 5px;
    `;
    
    function updateWordCount() {
        const words = contentField.value.trim().split(/\s+/).filter(word => word.length > 0).length;
        wordCountDisplay.textContent = `${words} words`;
    }
    
    contentField.addEventListener('input', updateWordCount);
    contentField.parentNode.appendChild(wordCountDisplay);
    updateWordCount();
}

// Initialize word count when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupWordCount, 500);
});

// Initialize auto-save
setTimeout(setupAutoSave, 1000);
