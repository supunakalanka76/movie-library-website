// Form Validation
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const terms = document.getElementById('terms').checked;
    
    if (!firstName || !lastName || !email || !message || !terms) {
        alert('Please fill all required fields');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // If validation passes, submit the form
    this.submit();
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}