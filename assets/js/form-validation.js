document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('[type="submit"]');
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Validate form
    let isValid = true;
    
    const showError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.style.color = '#dc3545';
        errorEl.style.fontSize = '0.8rem';
        errorEl.style.marginTop = '5px';
        field.parentNode.appendChild(errorEl);
        isValid = false;
    };
    
    // Validate each field
    if (!formData.get('first-name').trim()) showError('first-name', 'First Name is required');
    if (!formData.get('last-name').trim()) showError('last-name', 'Last Name is required');
    
    const email = formData.get('email').trim();
    if (!email) {
        showError('email', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Invalid email format');
    }
    
    if (!formData.get('message').trim()) showError('message', 'Message is required');
    if (!form.elements['terms'].checked) showError('terms', 'You must accept the terms');
    
    if (!isValid) return;
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    
    try {
        const response = await fetch('/php/form-handler.php', {
            method: 'POST',
            body: formData
        });
        
        // First check if we got any response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Then verify content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned invalid format');
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.errors?.join(', ') || 'Submission failed');
        }
        
        // Success - reset form
        form.reset();
        showSuccessMessage('Form submitted successfully!');
        
    } catch (error) {
        console.error('Submission error:', error);
        showError('form', error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});

function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.textContent = message;
    alertDiv.style.marginTop = '20px';
    
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(alertDiv, form.nextSibling);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 600);
    }, 3000);
}