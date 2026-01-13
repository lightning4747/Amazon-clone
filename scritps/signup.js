import { signup, isLoggedIn } from '../data/auth.js';

// Redirect if already logged in
if (isLoggedIn()) {
    window.location.href = 'amazon.html';
}

const signupForm = document.getElementById('signup-form');
const errorMessage = document.querySelector('.js-error-message');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        errorMessage.classList.add('visible');
        return;
    }

    const result = signup(name, email, password);

    if (result.success) {
        // Redirect to home page
        window.location.href = 'amazon.html';
    } else {
        // Show error message
        errorMessage.textContent = result.message;
        errorMessage.classList.add('visible');
    }
});

// Hide error message when user starts typing
document.querySelectorAll('.auth-form input').forEach(input => {
    input.addEventListener('input', () => {
        errorMessage.classList.remove('visible');
    });
});
