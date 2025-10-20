// Contact Page JavaScript with Google Sheets Integration

// Configuration - Make sure this matches your actual Google Apps Script URL
const CONTACT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwq0kM1yM7VzdgVIZ4gVZLcYnxIEEVi3z-wxzOOy5gN33IxGUJecB4y3y3jJ1S8VBFJow/exec';

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

function initializeContactForm() {
    // Setup character counter
    setupCharacterCounter();
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup form clearing
    setupFormClear();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup scroll animations
    setupScrollAnimations();
}

function setupCharacterCounter() {
    const messageField = document.getElementById('contactMessage');
    const charCounter = document.getElementById('charCounter');
    
    if (messageField && charCounter) {
        messageField.addEventListener('input', function() {
            updateCharCounter(this, charCounter, 1500);
        });
        updateCharCounter(messageField, charCounter, 1500);
    }
}

function updateCharCounter(field, counter, maxLength) {
    const length = field.value.length;
    counter.textContent = `${length} / ${maxLength}`;
    
    // Update counter styling based on character count
    counter.className = 'char-counter';
    if (length > maxLength * 0.9) {
        counter.className += ' danger';
    } else if (length > maxLength * 0.7) {
        counter.className += ' warning';
    }
}

function setupFormSubmission() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', handleContactSubmit);
}

function setupFormClear() {
    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all form data?')) {
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
    
    field.style.borderColor = '#e1e5e9';
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = getContactFormData();
    
    // Validate form
    if (!validateContactForm(formData)) {
        return;
    }
    
    // Send to Google Sheets with improved handling
    setFormLoading(true);
    showStatus('Sending your message...', 'loading');
    
    // Try fetch first (more reliable), fall back to form submission
    submitWithFetch(formData)
        .then(() => {
            showStatus('Your message was successfully sent to Derek! He will get back to you soon.', 'success');
            clearForm();
        })
        .catch(() => {
            // Fallback to iframe method
            console.log('Fetch failed, trying iframe method...');
            submitWithIframe(formData);
        })
        .finally(() => {
            setFormLoading(false);
        });
}

function submitWithFetch(formData) {
    const submissionData = {
        action: 'addContact',
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        newsletter: formData.newsletter,
        timestamp: formData.timestamp,
        source: formData.source
    };

    return fetch(CONTACT_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
    })
    .then(response => {
        // With no-cors, we can't read the response, so we assume success
        // if no error was thrown
        return Promise.resolve();
    });
}

function submitWithIframe(formData) {
    return new Promise((resolve, reject) => {
        const submissionData = {
            action: 'addContact',
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            newsletter: formData.newsletter,
            timestamp: formData.timestamp,
            source: formData.source
        };
        
        // Create and submit form
        const form = document.createElement('form');
        form.action = CONTACT_SCRIPT_URL;
        form.method = 'POST';
        form.target = 'hiddenFrame';
        form.style.display = 'none';
        
        const dataField = document.createElement('input');
        dataField.type = 'hidden';
        dataField.name = 'data';
        dataField.value = JSON.stringify(submissionData);
        form.appendChild(dataField);
        
        // Create iframe if needed
        let iframe = document.getElementById('hiddenFrame');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'hiddenFrame';
            iframe.name = 'hiddenFrame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        
        // Set up iframe load listener
        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error('Submission timeout'));
        }, 10000); // 10 second timeout
        
        function cleanup() {
            clearTimeout(timeoutId);
            if (form.parentNode) {
                document.body.removeChild(form);
            }
            iframe.onload = null;
        }
        
        iframe.onload = function() {
            cleanup();
            // Wait a bit more to ensure processing
            setTimeout(() => {
                showStatus('Your message was successfully sent to Derek! He will get back to you soon.', 'success');
                clearForm();
                resolve();
            }, 1000);
        };
        
        document.body.appendChild(form);
        form.submit();
    });
}

function getContactFormData() {
    return {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value.trim(),
        newsletter: document.getElementById('contactNewsletter').checked ? 'Yes' : 'No',
        timestamp: new Date().toLocaleString(),
        source: 'The Mingle Effect - Contact Form'
    };
}

function validateContactForm(data) {
    let isValid = true;
    const errors = [];
    
    // Check required fields
    if (!data.name) {
        errors.push('Name is required');
        document.getElementById('contactName').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!data.email) {
        errors.push('Email is required');
        document.getElementById('contactEmail').style.borderColor = '#e74c3c';
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        errors.push('Valid email is required');
        document.getElementById('contactEmail').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!data.subject) {
        errors.push('Subject is required');
        document.getElementById('contactSubject').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!data.message) {
        errors.push('Message is required');
        document.getElementById('contactMessage').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!isValid) {
        showStatus('Please fill in all required fields: ' + errors.join(', '), 'error');
    }
    
    return isValid;
}

function setFormLoading(loading) {
    const submitButton = document.getElementById('submitButton');
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea, button');
    
    if (loading) {
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        inputs.forEach(input => input.disabled = true);
    } else {
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
        inputs.forEach(input => input.disabled = false);
    }
}

function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
    
    // Scroll to status message
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearForm() {
    const form = document.getElementById('contactForm');
    form.reset();
    
    // Reset character counter
    const charCounter = document.getElementById('charCounter');
    if (charCounter) charCounter.textContent = '0 / 1500';
    
    // Reset field borders
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '#e1e5e9';
    });
    
    // Hide status message
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.style.display = 'none';
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Animate info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}
