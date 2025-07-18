const sidebarBtnDesktop = document.querySelector("#sidebarBtn-desktop");
const sidebarBtnMobile = document.querySelector("#sidebarBtn-mobile");
const main = document.querySelector(".main");


sidebarBtnDesktop.addEventListener("click", function() {
    sidebar.classList.toggle("hidden");
    main.classList.toggle("shifted");
});