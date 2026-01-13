import { login, isLoggedIn } from '../data/auth.js';

// Redirect if already logged in
if (isLoggedIn()) {
    window.location.href = 'index.html';
}

const loginForm = document.getElementById('login-form');
const errorMessage = document.querySelector('.js-error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = login(email, password);

    if (result.success) {
        // Redirect to home page
        window.location.href = 'index.html';
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
