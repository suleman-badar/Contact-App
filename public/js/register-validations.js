document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[action="/register"]');
    const nameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPassInput = document.getElementById('confirmPass');

    function validateField(input, conditionFn, errorMessage) {
        input.classList.remove('is-valid', 'is-invalid');

        if (conditionFn(input.value)) {
            input.classList.add('is-valid');
            input.setCustomValidity('');
        } else {
            input.classList.add('is-invalid');
            input.setCustomValidity(errorMessage);
        }
    }

    nameInput.addEventListener('input', () => {
        validateField(nameInput, val => val.trim().length >= 2, "Name must be at least 2 characters long");
    });

    emailInput.addEventListener('input', () => {
        validateField(emailInput, val => /\S+@\S+\.\S+/.test(val), "Invalid email format");
    });

    passwordInput.addEventListener('input', () => {
        validateField(passwordInput, val => val.length >= 8, "Password must be at least 8 characters");
        validatePasswordsMatch();
    });

    confirmPassInput.addEventListener('input', () => {
        validatePasswordsMatch();
    });

    function validatePasswordsMatch() {
        const match = passwordInput.value === confirmPassInput.value && confirmPassInput.value !== "";
        confirmPassInput.classList.remove('is-valid', 'is-invalid');
        if (match) {
            confirmPassInput.classList.add('is-valid');
            confirmPassInput.setCustomValidity('');
        } else {
            confirmPassInput.classList.add('is-invalid');
            confirmPassInput.setCustomValidity('Passwords do not match');
        }
    }

    // Prevent form submission if invalid
    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            form.classList.add('was-validated');
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