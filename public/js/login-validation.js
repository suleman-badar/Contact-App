document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form[action="/login"]');

    if (!loginForm) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Email validation
    emailInput.addEventListener('input', () => {
        emailInput.classList.remove('is-valid', 'is-invalid');
        if (/\S+@\S+\.\S+/.test(emailInput.value)) {
            emailInput.classList.add('is-valid');
        } else {
            emailInput.classList.add('is-invalid');
        }
    });

    // Password validation
    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('is-valid', 'is-invalid');
        if (passwordInput.value.length >= 6) {
            passwordInput.classList.add('is-valid');
        } else {
            passwordInput.classList.add('is-invalid');
        }
    });

    // Prevent form submission if invalid
    loginForm.addEventListener('submit', (e) => {
        if (!emailInput.checkValidity() || passwordInput.value.length < 6) {
            e.preventDefault();
            emailInput.classList.add('is-invalid');
            passwordInput.classList.add('is-invalid');
        }
    });
});

function togglePassword(icon, fieldId) {
    const input = document.getElementById(fieldId);
    const isVisible = input.type === "text";

    input.type = isVisible ? "password" : "text";

    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
}