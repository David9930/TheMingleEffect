// Submit Idea JavaScript with Google Sheets Integration

// Configuration - Replace with your actual Google Apps Script web app URL
const IDEA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwq0kM1yM7VzdgVIZ4gVZLcYnxIEEVi3z-wxzOOy5gN33IxGUJecB4y3y3jJ1S8VBFJow/exec';

// Debug flag - set to true to see detailed console logs
const DEBUG_MODE = true;

document.addEventListener('DOMContentLoaded', function() {
    initializeIdeaForm();
});

function initializeIdeaForm() {
    // Setup character counters
    setupCharacterCounters();
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup form clearing
    setupFormClear();
    
    // Setup form validation
    setupFormValidation();
}

function setupCharacterCounters() {
    const descriptionField = document.getElementById('ideaDescription');
    const implementationField = document.getElementById('ideaImplementation');
    const charCounter = document.getElementById('charCounter');
    const implCharCounter = document.getElementById('implCharCounter');
    
    if (descriptionField && charCounter) {
        descriptionField.addEventListener('input', function() {
            updateCharCounter(this, charCounter, 2000);
        });
        updateCharCounter(descriptionField, charCounter, 2000);
    }
    
    if (implementationField && implCharCounter) {
        implementationField.addEventListener('input', function() {
            updateCharCounter(this, implCharCounter, 1000);
        });
        updateCharCounter(implementationField, implCharCounter, 1000);
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
    const form = document.getElementById('ideaForm');
    form.addEventListener('submit', handleIdeaSubmit);
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

async function handleIdeaSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = getFormData();
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    setFormLoading(true);
    showStatus('Submitting your idea...', 'loading');
    
    try {
        // Send to Google Sheets
        const success = await sendIdeaToSheets(formData);
        
        if (success) {
            showStatus('🎉 Thank you! Your idea has been submitted successfully. We\'ll review it and may contact you soon!', 'success');
            clearForm();
            
            // Optional: redirect after delay
            setTimeout(() => {
                window.location.href = 'idea-generator.html';
            }, 3000);
        } else {
            throw new Error('Failed to submit idea');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        showStatus('Sorry, there was an error submitting your idea. Please try again or contact us directly.', 'error');
    } finally {
        setFormLoading(false);
    }
}

function getFormData() {
    return {
        name: document.getElementById('ideaName').value.trim(),
        email: document.getElementById('ideaEmail').value.trim(),
        category: document.getElementById('ideaCategory').value,
        title: document.getElementById('ideaTitle').value.trim(),
        description: document.getElementById('ideaDescription').value.trim(),
        implementation: document.getElementById('ideaImplementation').value.trim(),
        contact: document.getElementById('ideaContact').checked ? 'Yes' : 'No',
        newsletter: document.getElementById('ideaNewsletter').checked ? 'Yes' : 'No',
        timestamp: new Date().toLocaleString(),
        source: 'The Mingle Effect - Idea Generator'
    };
}

function validateForm(data) {
    let isValid = true;
    const errors = [];
    
    // Check required fields
    if (!data.name) {
        errors.push('Name is required');
        document.getElementById('ideaName').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!data.email) {
        errors.push('Email is required');
        document.getElementById('ideaEmail').style.borderColor = '#e74c3c';
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        errors.push('Valid email is required');
        document.getElementById('ideaEmail').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!data.category) {
        errors.push('Category is required');
        document.getElementById('ideaCategory').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!data.title) {
        errors.push('Idea title is required');
        document.getElementById('ideaTitle').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!data.description) {
        errors.push('Idea description is required');
        document.getElementById('ideaDescription').style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (!isValid) {
        showStatus('Please fill in all required fields: ' + errors.join(', '), 'error');
    }
    
    return isValid;
}

async function sendIdeaToSheets(ideaData) {
    try {
        if (DEBUG_MODE) {
            console.log('=== SENDING IDEA TO SHEETS ===');
            console.log('URL:', IDEA_SCRIPT_URL);
            console.log('Data being sent:', ideaData);
        }
        
        // Prepare data for Google Sheets - exactly like Rebecca system
        const submissionData = {
            action: 'addIdea',
            name: ideaData.name,
            email: ideaData.email,
            category: ideaData.category,
            title: ideaData.title,
            description: ideaData.description,
            implementation: ideaData.implementation,
            contact: ideaData.contact,
            newsletter: ideaData.newsletter,
            timestamp: ideaData.timestamp,
            source: ideaData.source
        };
        
        if (DEBUG_MODE) {
            console.log('Formatted submission data:', submissionData);
        }
        
        // Use only the form submission method (exactly like Rebecca system)
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
            form.action = IDEA_SCRIPT_URL;
            form.method = 'POST';
            form.target = 'hiddenFrame'; // Changed to match Rebecca system exactly
            form.style.display = 'none';
            
            const dataField = document.createElement('input');
            dataField.type = 'hidden';
            dataField.name = 'data';
            dataField.value = JSON.stringify(data);
            form.appendChild(dataField);
            
            if (DEBUG_MODE) {
                console.log('Form data field value:', dataField.value);
            }
            
            // Create hidden iframe for submission - using exact same name as Rebecca system
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
            
            // Clean up the form after submission - using same timing as Rebecca system
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
            }, 1000); // Changed back to 1000ms to match Rebecca system
            
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
    const form = document.getElementById('ideaForm');
    const inputs = form.querySelectorAll('input, select, textarea, button');
    
    if (loading) {
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        inputs.forEach(input => input.disabled = true);
    } else {
        submitButton.textContent = 'Submit My Idea';
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
    const form = document.getElementById('ideaForm');
    form.reset();
    
    // Reset character counters
    const charCounter = document.getElementById('charCounter');
    const implCharCounter = document.getElementById('implCharCounter');
    
    if (charCounter) charCounter.textContent = '0 / 2000';
    if (implCharCounter) implCharCounter.textContent = '0 / 1000';
    
    // Reset field borders
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '#e1e5e9';
    });
    
    // Hide status message
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.style.display = 'none';
}

// Utility function to animate elements when they come into view
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Animate inspiration cards
    const inspirationCards = document.querySelectorAll('.inspiration-card');
    inspirationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Initialize scroll animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupScrollAnimations, 500);
});

// Auto-save form data to localStorage (optional feature)
function setupAutoSave() {
    const form = document.getElementById('ideaForm');
    const saveKey = 'mingle-idea-draft';
    
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
            const descriptionField = document.getElementById('ideaDescription');
            const implementationField = document.getElementById('ideaImplementation');
            if (descriptionField) {
                updateCharCounter(descriptionField, document.getElementById('charCounter'), 2000);
            }
            if (implementationField) {
                updateCharCounter(implementationField, document.getElementById('implCharCounter'), 1000);
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
    window.clearSavedFormData = () => {
        localStorage.removeItem(saveKey);
    };
}

// Uncomment to enable auto-save feature
// setupAutoSave();
