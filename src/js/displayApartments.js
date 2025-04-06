let currentPage = 1;
const initialItems = 4;
const itemsPerPage = 4;
let allProperties = [];
let currentSort = "price-asc";
let currentSearchTerm = "";
let paginationEnabled = false;
let originalProperties = [];
let currentFilters = {
  price: "all",
  rooms: "all",
  area: "all",
};
let currentPageType = "";

async function fetchProperties(propertyType, transactionType) {
  try {
    currentPageType = propertyType;

    const response = await fetch("../data/estate.json");
    const properties = await response.json();

    const filteredProperties = properties.filter((property) => {
      if (propertyType && transactionType) {
        return (
          property.propertyType === propertyType &&
          property.type === transactionType
        );
      } else if (propertyType) {
        return property.propertyType === propertyType;
      } else if (transactionType) {
        return property.type === transactionType;
      }
      return true;
    });

    allProperties = filteredProperties;

    setupDynamicFilters(propertyType);

    displayInitialProperties();

    const pagination = document.getElementById("pagination");
    if (pagination) {
      pagination.style.display = "none";
    }
    updateShowMoreButton();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function setupDynamicFilters(propertyType) {
  const priceFilter = document.getElementById("price-filter");
  const roomsFilter = document.getElementById("rooms-filter");
  const areaFilter = document.getElementById("area-filter");

  if (!priceFilter || !areaFilter) {
    return;
  }

  priceFilter.innerHTML = '<option value="all">All prices</option>';
  if (roomsFilter) {
    roomsFilter.innerHTML = '<option value="all">All</option>';
  }
  areaFilter.innerHTML = '<option value="all">All areas</option>';

  if (propertyType === "apartment") {
    priceFilter.innerHTML += `
      <option value="0-800000">0 - 800 000</option>
      <option value="800000-1500000">800 000 - 1 500 000</option>
      <option value="1500000+">Above 1 500 000</option>
    `;

    if (roomsFilter) {
      roomsFilter.innerHTML += `
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4+">4+</option>
      `;
    }

    areaFilter.innerHTML += `
      <option value="0-50">0 - 50 m²</option>
      <option value="50-100">50 - 100 m²</option>
      <option value="100+">Above 100 m²</option>
    `;
  } else if (propertyType === "house") {
    priceFilter.innerHTML += `
      <option value="0-1000000">0 - 1 000 000</option>
      <option value="1000000-3000000">1 000 000 - 3 000 000</option>
      <option value="3000000+">Above 3 000 000</option>
    `;

    if (roomsFilter) {
      roomsFilter.innerHTML += `
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6+">6+</option>
      `;
    }

    areaFilter.innerHTML += `
      <option value="0-150">0 - 150 m²</option>
      <option value="150-250">150 - 250 m²</option>
      <option value="250+">Above 250 m²</option>
    `;
  } else if (propertyType === "land") {
    priceFilter.innerHTML += `
      <option value="0-1000000">0 - 1 000 000</option>
      <option value="1000000-2500000">1 000 000 - 2 500 000</option>
      <option value="2500000+">Above 2 500 000</option>
    `;

    if (roomsFilter) {
      roomsFilter.parentNode.style.display = "none";
    }

    areaFilter.innerHTML += `
      <option value="0-1000">0 - 1 000 m²</option>
      <option value="1000-2000">1 000 - 2 000 m²</option>
      <option value="2000+">Above 2 000 m²</option>
    `;
  }
}

function displayInitialProperties() {
  const grid = document.getElementById("properties-grid");

  if (!grid) {
    console.error("No estate to match your filters");
    return;
  }

  grid.innerHTML = "";

  if (allProperties.length === 0) {
    grid.innerHTML =
      '<p class="no-results">No estate to match your filters</p>';
    return;
  }

  const propertiesToShow = allProperties.slice(0, initialItems);
  displayPropertyCards(propertiesToShow, grid);
}

function displayPage(page) {
  currentPage = page;
  const grid = document.getElementById("properties-grid");

  if (!grid) {
    console.error("No estate to match your filters");
    return;
  }

  grid.innerHTML = "";

  if (allProperties.length === 0) {
    grid.innerHTML =
      '<p class="no-results">No estate to match your filters</p>';
    return;
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allProperties.length);

  const propertiesToShow = allProperties.slice(startIndex, endIndex);
  displayPropertyCards(propertiesToShow, grid);
}

function displayPropertyCards(properties, container) {
  properties.forEach((property) => {
    const card = document.createElement("div");
    card.className = "property-card";
    card.dataset.type = property.type;
    card.dataset.propertyType = property.propertyType;
    card.setAttribute("data-searchable", "");

    const formattedPrice = new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(property.price);

    const rooms =
      property.rooms !== undefined
        ? `<span>${property.rooms} Rooms</span>`
        : "";

    card.innerHTML = `
      <div class="property-image">
        <img src="${property.image}" alt="${property.title}">
        <div class="property-badge">${
          property.type === "buy" ? "For sale" : "For rent"
        }</div>
      </div>
      <div class="property-content">
        <h3>${property.title}</h3>
        <p class="property-location">${property.location}</p>
        <p class="property-price">${formattedPrice}${
      property.type === "rent" ? "/month" : ""
    }</p>
        <div class="property-details">
          ${rooms}
          <span>${property.area} m²</span>
        </div>
        <p class="property-description">${property.description}</p>
        <button class="view-details-btn" data-id="${
          property.id
        }">Show details</button>
      </div>
    `;

    const viewButton = card.querySelector(".view-details-btn");
    viewButton.addEventListener("click", () => {
      viewPropertyDetails(property.id);
    });

    container.appendChild(card);
  });
}

function updateShowMoreButton() {
  const grid = document.getElementById("properties-grid");
  if (!grid) {
    console.error("Element properties-grid not found");
    return;
  }

  const container = grid.parentNode;
  let showMoreButton = document.getElementById("show-more-btn");
  if (!showMoreButton) {
    showMoreButton = document.createElement("button");
    showMoreButton.id = "show-more-btn";
    showMoreButton.className = "show-more-btn";
    showMoreButton.textContent = "Show more";

    showMoreButton.addEventListener("click", enablePagination);

    container.appendChild(showMoreButton);
  }

  if (allProperties.length > initialItems) {
    showMoreButton.style.display = "block";
  } else {
    showMoreButton.style.display = "none";
  }
}

function enablePagination() {
  paginationEnabled = true;

  const showMoreButton = document.getElementById("show-more-btn");
  if (showMoreButton) {
    showMoreButton.style.display = "none";
  }

  displayPage(1);
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.style.display = "flex";
    updatePagination();
  }
}

function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(allProperties.length / itemsPerPage);

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.className = "pagination-btn prev";
    prevButton.innerHTML = "« Prev";
    prevButton.addEventListener("click", () => {
      displayPage(currentPage - 1);
      updatePagination();
    });
    pagination.appendChild(prevButton);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.className =
      "pagination-btn" + (i === currentPage ? " active" : "");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      displayPage(i);
      updatePagination();
    });
    pagination.appendChild(pageButton);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.className = "pagination-btn next";
    nextButton.innerHTML = "Next »";
    nextButton.addEventListener("click", () => {
      displayPage(currentPage + 1);
      updatePagination();
    });
    pagination.appendChild(nextButton);
  }
}

function sortProperties() {
  allProperties.sort((a, b) => {
    switch (currentSort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "area-asc":
        return a.area - b.area;
      case "area-desc":
        return b.area - a.area;
      default:
        return 0;
    }
  });

  if (paginationEnabled) {
    displayPage(1);
    updatePagination();
  } else {
    displayInitialProperties();
  }
}

function setupSortMenu() {
  const sortBtn = document.getElementById("sort-btn");
  const sortMenu = document.getElementById("sort-menu");

  if (sortBtn && sortMenu) {
    sortBtn.addEventListener("click", (event) => {
      sortMenu.classList.toggle("show");
      const buttonRect = sortBtn.getBoundingClientRect();
      sortMenu.style.top = `${buttonRect.height}px`;
      sortMenu.style.left = "0";
      event.stopPropagation();
    });

    const sortOptions = sortMenu.querySelectorAll(".menu-item");
    sortOptions.forEach((option) => {
      option.addEventListener("click", function () {
        sortOptions.forEach((opt) => {
          opt.classList.remove("active");
        });
        this.classList.add("active");
        currentSort = this.dataset.sort;
        sortProperties();
        sortMenu.classList.remove("show");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        !event.target.closest("#sort-btn") &&
        !event.target.closest("#sort-menu")
      ) {
        sortMenu.classList.remove("show");
      }
    });
  }
}

function setupFilterMenu() {
  const filterBtn = document.getElementById("filter-btn");
  const filterMenu = document.getElementById("filter-menu");

  if (filterBtn && filterMenu) {
    filterBtn.addEventListener("click", (event) => {
      filterMenu.classList.toggle("show");
      const buttonRect = filterBtn.getBoundingClientRect();
      filterMenu.style.top = `${buttonRect.height}px`;
      filterMenu.style.left = "0";
      event.stopPropagation();
    });

    document.addEventListener("click", function (e) {
      if (
        !e.target.closest("#filter-btn") &&
        !e.target.closest("#filter-menu")
      ) {
        filterMenu.classList.remove("show");
      }
    });
  }
}

function filterByPrice(property, priceFilter) {
  if (priceFilter === "all") return true;
  const price = property.price;

  if (currentPageType === "apartment") {
    switch (priceFilter) {
      case "0-800000":
        return price >= 0 && price <= 800000;
      case "800000-1500000":
        return price > 800000 && price <= 1500000;
      case "1500000+":
        return price > 1500000;
      default:
        return true;
    }
  } else if (currentPageType === "house") {
    switch (priceFilter) {
      case "0-1000000":
        return price >= 0 && price <= 1000000;
      case "1000000-3000000":
        return price > 1000000 && price <= 3000000;
      case "3000000+":
        return price > 3000000;
      default:
        return true;
    }
  } else if (currentPageType === "land") {
    switch (priceFilter) {
      case "0-1000000":
        return price >= 0 && price <= 1000000;
      case "1000000-2500000":
        return price > 1000000 && price <= 2500000;
      case "2500000+":
        return price > 2500000;
      default:
        return true;
    }
  } else {
    switch (priceFilter) {
      case "0-500000":
        return price >= 0 && price <= 500000;
      case "500000-1000000":
        return price >= 500000 && price <= 1000000;
      case "1000000+":
        return price > 1000000;
      default:
        return true;
    }
  }
}

function filterByRooms(property, roomsFilter) {
  if (roomsFilter === "all") return true;
  if (!property.rooms) return false;

  if (currentPageType === "apartment") {
    if (roomsFilter === "4+") {
      return property.rooms >= 4;
    }
  } else if (currentPageType === "house") {
    if (roomsFilter === "6+") {
      return property.rooms >= 6;
    }
  }

  return property.rooms === parseInt(roomsFilter);
}

function filterByArea(property, areaFilter) {
  if (areaFilter === "all") return true;
  const area = property.area;

  if (currentPageType === "apartment") {
    switch (areaFilter) {
      case "0-50":
        return area > 0 && area <= 50;
      case "50-100":
        return area > 50 && area <= 100;
      case "100+":
        return area > 100;
      default:
        return true;
    }
  } else if (currentPageType === "house") {
    switch (areaFilter) {
      case "0-150":
        return area > 0 && area <= 150;
      case "150-250":
        return area > 150 && area <= 250;
      case "250+":
        return area > 250;
      default:
        return true;
    }
  } else if (currentPageType === "land") {
    switch (areaFilter) {
      case "0-1000":
        return area > 0 && area <= 1000;
      case "1000-2000":
        return area > 1000 && area <= 2000;
      case "2000+":
        return area > 2000;
      default:
        return true;
    }
  } else {
    switch (areaFilter) {
      case "0-50":
        return area > 0 && area <= 50;
      case "50-100":
        return area >= 50 && area <= 100;
      case "100+":
        return area > 100;
      default:
        return true;
    }
  }
}

function applyFilters() {
  const priceFilter = document.getElementById("price-filter").value;
  const roomsFilter = document.getElementById("rooms-filter")?.value || "all";
  const areaFilter = document.getElementById("area-filter").value;

  currentFilters = {
    price: priceFilter,
    rooms: roomsFilter,
    area: areaFilter,
  };

  if (originalProperties.length === 0) {
    originalProperties = [...allProperties];
  } else {
    allProperties = [...originalProperties];
  }

  allProperties = allProperties.filter((property) => {
    return (
      filterByPrice(property, priceFilter) &&
      filterByRooms(property, roomsFilter) &&
      filterByArea(property, areaFilter)
    );
  });

  sortProperties();

  currentPage = 1;
  if (paginationEnabled) {
    displayPage(1);
    updatePagination();
  } else {
    displayInitialProperties();
  }

  const menuBtn = document.getElementById("filter-menu");
  if (menuBtn) {
    menuBtn.classList.remove("show");
  }
}

function resetFilters() {
  const priceFilter = document.getElementById("price-filter");
  const roomsFilter = document.getElementById("rooms-filter");
  const areaFilter = document.getElementById("area-filter");

  if (priceFilter) priceFilter.value = "all";
  if (roomsFilter) roomsFilter.value = "all";
  if (areaFilter) areaFilter.value = "all";

  currentFilters = {
    price: "all",
    rooms: "all",
    area: "all",
  };

  if (originalProperties.length > 0) {
    allProperties = [...originalProperties];
  }

  sortProperties();
  currentPage = 1;
  if (paginationEnabled) {
    displayPage(1);
    updatePagination();
  } else {
    displayInitialProperties();
  }

  const menuBtn = document.getElementById("filter-menu");
  if (menuBtn) {
    menuBtn.classList.remove("show");
  }
}

function initializePage() {
  const path = window.location.pathname;
  console.log("Current path:", path);

  if (path.includes("apartments")) {
    fetchProperties("apartment", "buy");
  } else if (path.includes("houses")) {
    fetchProperties("house", "buy");
  } else if (path.includes("land")) {
    fetchProperties("land", "buy");
  } else {
    fetchProperties(null, "buy");
  }

  const applyFiltersBtn = document.getElementById("apply-filters");
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", applyFilters);
  }

  const resetFiltersBtn = document.getElementById("reset-filters");
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetFilters);
  }

  setupSortMenu();
  setupFilterMenu();
}

document.addEventListener("DOMContentLoaded", initializePage);
