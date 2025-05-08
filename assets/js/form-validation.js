document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Clear previous messages
    clearMessages();

    // Validate
    const errors = validateForm(formData);
    if (errors.length) {
        showErrors(errors);
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="spinner"></span> Processing...
    `;

    try {
        const response = await fetch('php/form-handler.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.join(', ') || 'Submission failed');
        }

        form.reset();
        showSuccess(data.message || 'Success!');

    } catch (error) {
        showError(error.message);
        console.error('Submission error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('first-name').trim()) {
        errors.push({ field: 'first-name', message: 'First name is required' });
    }
    
    if (!formData.get('last-name').trim()) {
        errors.push({ field: 'last-name', message: 'Last name is required' });
    }
    
    const email = formData.get('email').trim();
    if (!email) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    }
    
    if (!formData.get('message').trim()) {
        errors.push({ field: 'message', message: 'Message is required' });
    }
    
    if (!document.getElementById('terms').checked) {
        errors.push({ field: 'terms', message: 'You must accept the terms' });
    }
    
    return errors;
}

function showErrors(errors) {
    errors.forEach(error => {
        const field = document.getElementById(error.field);
        if (!field) return;
        
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = error.message;
        
        if (error.field === 'terms') {
            field.closest('.form-group').appendChild(errorEl);
        } else {
            field.insertAdjacentElement('afterend', errorEl);
        }
    });
}

function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.color = '#dc3545';
    form.prepend(errorEl);
}

function showSuccess(message) {
    const successEl = document.createElement('div');
    successEl.className = 'success-message';
    successEl.textContent = message;
    successEl.style.color = '#28a745';
    form.prepend(successEl);
    
    setTimeout(() => successEl.remove(), 5000);
}