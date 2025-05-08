document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Clear previous errors
    clearErrors();
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="spinner"></span> Submitting...
    `;
    
    try {
        const response = await fetch('php/form-handler.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.errors?.join(', ') || 'Submission failed');
        }
        
        // Success
        form.reset();
        showSuccess('Form submitted successfully!');
        
    } catch (error) {
        showFormError(error.message);
        console.error('Submission error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});

// Helper functions
function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('first-name').trim()) errors.push({ field: 'first-name', message: 'First Name is required' });
    if (!formData.get('last-name').trim()) errors.push({ field: 'last-name', message: 'Last Name is required' });
    
    const email = formData.get('email').trim();
    if (!email) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    }
    
    if (!formData.get('message').trim()) errors.push({ field: 'message', message: 'Message is required' });
    if (!document.getElementById('terms').checked) errors.push({ field: 'terms', message: 'You must accept the terms' });
    
    return errors;
}

function showErrors(errors) {
    errors.forEach(error => {
        const field = document.getElementById(error.field);
        if (!field) return;
        
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = error.message;
        errorEl.style.color = 'red';
        errorEl.style.fontSize = '0.8rem';
        errorEl.style.marginTop = '5px';
        
        // For checkbox, insert after parent
        if (error.field === 'terms') {
            field.closest('.form-group').appendChild(errorEl);
        } else {
            field.insertAdjacentElement('afterend', errorEl);
        }
    });
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

function showFormError(message) {
    const errorContainer = document.getElementById('form-errors') || createErrorContainer();
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

function showSuccess(message) {
    const successEl = document.createElement('div');
    successEl.className = 'success-message';
    successEl.textContent = message;
    successEl.style.color = 'green';
    successEl.style.margin = '20px 0';
    document.getElementById('contact-form').prepend(successEl);
    
    setTimeout(() => {
        successEl.remove();
    }, 5000);
}

function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'form-errors';
    container.style.color = 'red';
    container.style.marginBottom = '20px';
    document.getElementById('contact-form').prepend(container);
    return container;
}