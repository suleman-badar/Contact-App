const sidebarBtnDesktop = document.querySelector("#sidebarBtn-desktop");
const sidebarBtnMobile = document.querySelector("#sidebarBtn-mobile");
const main = document.querySelector(".main");
const selectAll = document.getElementById('selectAll');
const deleteBtn = document.querySelector("#deleteBtn");
const checkboxes = document.querySelectorAll(".contact-checkbox");

sidebarBtnDesktop.addEventListener("click", function() {
    sidebar.classList.toggle("hidden");
    main.classList.toggle("shifted");
});


document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Uncheck all checkboxes
        checkboxes.forEach(cb => {
            cb.checked = false;
            const row = cb.closest('.ind-contact');
            row.classList.remove('selected');
        });

        // Uncheck selectAll checkbox
        selectAll.checked = false;

        // Hide delete button
        deleteBtn.style.display = 'none';
    }
});

checkboxes.forEach(cb => {
    cb.addEventListener('change', function() {
        toggleDeleteBtn(this)
    });

});


function toggleDeleteBtn(checkbox) {
    // Check if at least one checkbox is checked
    const anyChecked = [...checkboxes].some(cb => cb.checked);
    deleteBtn.style.display = anyChecked ? 'inline-block' : 'none';
    const row = checkbox.closest('.ind-contact');
    if (checkbox.checked) {
        row.classList.add('selected');
    } else {
        row.classList.remove('selected');
    }
}


selectAll.addEventListener('change', () => {
    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
        toggleDeleteBtn(cb);
    });

});