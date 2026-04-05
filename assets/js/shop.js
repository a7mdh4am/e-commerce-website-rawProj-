function displayShopProducts(products, filteredProducts = null) {
  const productsContainer = document.querySelector(".shop__items");
  productsContainer.innerHTML = ""; // Clear previous products

  const productsToDisplay = filteredProducts || products;

  if (productsToDisplay.length === 0) {
    productsContainer.innerHTML =
      "<p style='grid-column: 1/-1; text-align: center; padding: 2rem;'>No products match your filters</p>";
    return;
  }

  productsToDisplay.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("shop__item");
    if (product.sale_price) {
      productElement.classList.add("sale");
    }

    productElement.innerHTML = `
     <a href="./product.html?id=${product.id}">
            <div class="img">
              <img src="${product.images[0]}" alt="${product.name}" />
            </div>
          </a>
          <div class="content">
            <h5>${product.name}</h5>
            <p>${product.sale_price ? `${product.price} ${product.currency} <span class="sale-price">${product.sale_price} ${product.currency}</span> ` : `${product.price} L.E`}</p>
            <h6 class="size">
              ${product.variants[0].sizes
                .map((size) => {
                  if (size.stock > 0) {
                    return `<span>${size.size}</span>`;
                  } else {
                    return `<span class="out-of-stock">${size.size}</span>`;
                  }
                })
                .join("")}
            </h6>
          </div>
    `;
    productsContainer.appendChild(productElement);
  });
}

// Store all products globally
let allProducts = [];

// Fetch products and display them
(async () => {
  allProducts = await fetchProducts();
  displayShopProducts(allProducts);
})();

const filterContainer = document.getElementById("filter-container");
const sortSelect = document.getElementById("sort");
const colorCheckboxes = document.querySelectorAll('input[name="color"]');
const sizeCheckboxes = document.querySelectorAll('input[name="size"]');
const categoriesNavLinks = document
  .querySelector("#cat_nv_lnks")
  .querySelectorAll("a");

function toggleHoveredLink(link) {
  categoriesNavLinks.forEach((lnk) => lnk.classList.remove("hovered"));
  link.classList.add("hovered");
}

function toggleActiveLink(link) {
  categoriesNavLinks.forEach((lnk) => lnk.classList.remove("active"));
  link.classList.add("active");
  applyFilters();
}

categoriesNavLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    toggleHoveredLink(link);
    toggleActiveLink(link);
    activeLink = link;
  });
  link.addEventListener("mouseover", (e) => {
    e.preventDefault();
    toggleHoveredLink(link);
  });
  link.addEventListener("mouseleave", (e) => {
    e.preventDefault();
    toggleHoveredLink(activeLink);
  });
});

// Filter functionality
function applyFilters() {
  let filtered = [...allProducts];

  const selectedCategory = document.querySelector("#cat_nv_lnks a.active")
    .dataset.val;

  if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
    filtered = filtered.filter(
      (product) =>
        product.category &&
        product.category.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase(),
        ),
    );
  }
  // filter colors
  const selectedColors = Array.from(colorCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  // filter sizes
  const selectedSizes = Array.from(sizeCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  // Filter by color if any colors are selected
  if (selectedColors.length > 0) {
    filtered = filtered.filter(
      (product) =>
        product.color && selectedColors.includes(product.color.toLowerCase()),
    );
  }

  // Filter by size if any sizes are selected
  // Only include products that have the selected size with stock > 0
  if (selectedSizes.length > 0) {
    filtered = filtered.filter((product) =>
      product.variants[0].sizes.some(
        (size) =>
          selectedSizes.includes(size.size.toLowerCase()) && size.stock > 0,
      ),
    );
  }

  // Apply sorting
  applySorting(filtered, sortSelect.value);

  // Display filtered products
  displayShopProducts(allProducts, filtered);
}

// Sorting functionality
function applySorting(products, sortBy) {
  switch (sortBy) {
    case "priceLowHigh":
      products.sort((a, b) => a.price - b.price);
      break;
    case "priceHighLow":
      products.sort((a, b) => b.price - a.price);
      break;
    default:
      products.sort((a, b) => a.id - b.id);
      break;
  }
}

// Add event listeners to checkboxes
colorCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    applyFilters();
  });
});

sizeCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    applyFilters();
  });
});

// Add event listener to sort select
sortSelect.addEventListener("change", () => {
  applyFilters();
});

// Handle filter label toggle for mobile
filterContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("label")) {
    filterContainer.classList.toggle("open");
  }
});

const filterButton = document.querySelector(".filter__button");
const filterBody = document.querySelector("#filter-container");

filterButton.addEventListener("click", () => {
  filterBody.classList.toggle("open");
  if (filterBody.classList.contains("open")) {
    filterBody.style.height = filterBody.scrollHeight + "px";
    filterBody.style.opacity = "1";
    filterButton.querySelector("span").style.transform = "rotate(45deg)";
  } else {
    filterBody.style.height = "0";
    filterBody.style.opacity = "0";
    filterButton.querySelector("span").style.transform = "rotate(0deg)";
  }
});
