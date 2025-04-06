document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".has-submenu");

  function closeAllSubmenus() {
    menuItems.forEach((item) => {
      item.classList.remove("active");
    });
  }

  menuItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      const mainLink = this.querySelector("a:not([href]), a[href='']");
      if (event.target === mainLink || event.target === this) {
        event.preventDefault();
        const isActive = this.classList.contains("active");
        closeAllSubmenus();
        if (!isActive) {
          this.classList.add("active");
        }
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".has-submenu")) {
      closeAllSubmenus();
    }
  });
});
