const hamburgerTab = document.getElementById("hamburger-tab");
const closeSidebarButton = document.querySelector(".close-tab-item");

const sidebar = document.querySelector(".sidebar__links");

// const headerHeight = document.querySelector(".header").get

function openCloseSidebar() {
  sidebar.classList.toggle("sidebar--active");
}

hamburgerTab.addEventListener("click", openCloseSidebar);
closeSidebarButton.addEventListener("click", openCloseSidebar);
