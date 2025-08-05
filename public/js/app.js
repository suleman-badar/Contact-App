document.addEventListener('DOMContentLoaded', () => {
    const selectAll = document.querySelector('.selectAll');
    const deleteBtn = document.querySelector(".showBtn");
    const deleteForm = document.getElementById('deleteSelectedForm');
    const checkboxes = document.querySelectorAll(".contact-checkbox");
    const toggleBtn = document.getElementById('themeToggle');
    const toggleBtnMobile = document.getElementById('themeToggleMobile');
    const themeIcon = document.getElementById('themeIcon');
    const forms = document.querySelectorAll('.needs-validation');

    // Real-time form validation
    Array.from(forms).forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid', 'is-valid');

                if (input.checkValidity()) {
                    input.classList.add('is-valid');
                } else {
                    input.classList.add('is-invalid');
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

    // Theme handling
    function applyTheme(theme) {
        document.body.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            if (toggleBtn) toggleBtn.classList.replace('btn-outline-light', 'btn-outline-secondary');
            themeIcon.style.color = 'white';
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            if (toggleBtn) toggleBtn.classList.replace('btn-outline-secondary', 'btn-outline-light');
            themeIcon.style.color = 'black';
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    [toggleBtn, toggleBtnMobile].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-bs-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                applyTheme(newTheme);
            });
        }
    });

    // Delete contact logic
    function toggleDeleteBtn() {
        const anyChecked = [...checkboxes].some(cb => cb.checked);
        if (deleteBtn) deleteBtn.classList.toggle('d-none', !anyChecked);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            checkboxes.forEach(cb => {
                cb.checked = false;
                const row = cb.closest('.contact-row');
                if (row) row.classList.remove('selected');
            });

            if (selectAll) selectAll.checked = false;
            toggleDeleteBtn();
        }
    });

    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            if (deleteForm) deleteForm.submit();
        });
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const row = cb.closest('.contact-row');
            if (row) row.classList.toggle('selected', cb.checked);
            toggleDeleteBtn();
        });
    });

    if (selectAll) {
        selectAll.addEventListener('change', () => {
            const isChecked = selectAll.checked;
            checkboxes.forEach(cb => {
                cb.checked = isChecked;
                const row = cb.closest('.contact-row');
                if (row) row.classList.toggle('selected', isChecked);
            });
            toggleDeleteBtn();
        });
    }
});