// Contact Page JavaScript with Google Sheets Integration

// Configuration - Using the same Google Apps Script URL as your Rebecca site
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

async function handleContactSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = getContactFormData();
    
    // Validate form
    if (!validateContactForm(formData)) {
        return;
    }
    
    // Show loading state
    setFormLoading(true);
    showStatus('Sending your message...', 'loading');
    
    try {
        // Send to Google Sheets
        const success = await sendContactToSheets(formData);
        
        if (success) {
            showStatus('✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon!', 'success');
            clearForm();
        } else {
            throw new Error('Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact submission error:', error);
        showStatus('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    } finally {
        setFormLoading(false);
    }
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

async function sendContactToSheets(contactData) {
    try {
        // Prepare data for Google Sheets
        const submissionData = {
            action: 'addContact', // This will help distinguish from other submissions
            type: 'contact_message',
            name: contactData.name,
            email: contactData.email,
            subject: contactData.subject,
            message: contactData.message,
            newsletter: contactData.newsletter,
            timestamp: contactData.timestamp,
            source: contactData.source
        };
        
        // Send using the same method as your Rebecca site
        return await sendViaForm(submissionData);
        
    } catch (error) {
        console.error('Error sending to sheets:', error);
        return false;
    }
}

function sendViaForm(data) {
    return new Promise((resolve) => {
        try {
            const form = document.createElement('form');
            form.action = CONTACT_SCRIPT_URL;
            form.method = 'POST';
            form.target = 'contactSubmissionFrame';
            form.style.display = 'none';
            
            const dataField = document.createElement('input');
            dataField.type = 'hidden';
            dataField.name = 'data';
            dataField.value = JSON.stringify(data);
            form.appendChild(dataField);
            
            // Create hidden iframe for submission
            let iframe = document.getElementById('contactSubmissionFrame');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'contactSubmissionFrame';
                iframe.name = 'contactSubmissionFrame';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            
            document.body.appendChild(form);
            form.submit();
            
            // Clean up the form after submission
            setTimeout(() => {
                if (form.parentNode) {
                    document.body.removeChild(form);
                }
                resolve(true);
            }, 2000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            resolve(false);
        }
    });
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

// Auto-save form data to localStorage (optional feature)
function setupAutoSave() {
    const form = document.getElementById('contactForm');
    const saveKey = 'mingle-contact-draft';
    
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
            
            // Update character counter after loading
            const messageField = document.getElementById('contactMessage');
            if (messageField) {
                updateCharCounter(messageField, document.getElementById('charCounter'), 1500);
            }
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
            } else {
                formData[field.id] = field.value;
            }
        });
        localStorage.setItem(saveKey, JSON.stringify(formData));
    };
    
    // Debounced save function
    let saveTimeout;
    const debouncedSave = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveFormData, 1000);
    };
    
    // Add listeners to all form fields
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('input', debouncedSave);
        field.addEventListener('change', debouncedSave);
    });
    
    // Clear saved data when form is successfully submitted
    window.clearSavedContactData = () => {
        localStorage.removeItem(saveKey);
    };
}

// Uncomment to enable auto-save feature
// setupAutoSave();
