document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, select');
    const emailInput = document.getElementById('email');

    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid', 'is-valid');

            if (input.checkValidity()) {
                input.classList.add('is-valid');
            } else {
                input.classList.add('is-invalid');
            }

            // Handle email domain validation
            if (input === emailInput) {
                const emailValue = input.value.trim();
                const domain = emailValue.split("@")[1];
                const oldWarning = document.getElementById("email-warning");
                if (oldWarning) oldWarning.remove();

                if (domain && !allowedDomains.includes(domain)) {
                    const warning = document.createElement("p");
                    warning.textContent = "Only Gmail, Yahoo, Hotmail, and Outlook emails are accepted.";
                    warning.style.color = "red";
                    warning.style.fontSize = "0.9em";
                    warning.id = "email-warning";
                    emailInput.insertAdjacentElement("afterend", warning);
                    input.classList.add('is-invalid');
                }
            }
        });

        input.addEventListener('blur', () => {
            if (input.value !== "") {
                input.classList.remove('is-invalid', 'is-valid');
                if (input.checkValidity()) {
                    input.classList.add('is-valid');
                } else {
                    input.classList.add('is-invalid');
                }
            }
        });
    });
});