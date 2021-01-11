const hamburgerTab = document.getElementById("hamburger-tab");
const closeSidebarButton = document.querySelector(".close-tab-item");

const sidebar = document.querySelector(".sidebar__links");
const sidebarItems = document.querySelectorAll(".sidebar-item");
const navLinks = document.querySelectorAll(".header__nav-links li a");

// const headerHeight = document.querySelector(".header").get

function openCloseSidebar() {
  sidebar.classList.toggle("sidebar--active");
}

hamburgerTab.addEventListener("click", openCloseSidebar);
closeSidebarButton.addEventListener("click", openCloseSidebar);

navLinks.forEach((element) => {
  const navLink = element.getAttribute("href");
  if (navLink == window.location.pathname) {
    element.parentElement.classList.add("navlink--active");
  } else {
    element.parentElement.classList.remove("navlink--active");
  }
});

sidebarItems.forEach((element) => {
  const navLink = element.getAttribute("href");
  if (navLink == window.location.pathname) {
    element.classList.add("sidebar-item-active");
  } else {
    element.classList.remove("sidebar-item-active");
  }
});