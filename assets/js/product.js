const productDesctiption = document.querySelector("#product-description");
const sizesOptionsContainer = document.querySelector("#sizseContainer");
const sizesOptions = sizesOptionsContainer.querySelectorAll("div.option");

// Get query parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Display product details
function displayProductDetails(product) {
  const productSectionMetadata = document.querySelector(
    ".product__section.metadata",
  );
  const addToCartBtn = document.querySelector("#add-to-cart-btn");
  addToCartBtn.addEventListener("click", () => {
    addToCart(
      product,
      sizesOptionsContainer.querySelector(".option.active").textContent,
    );
  });

  // Inject Product Data :/
  productSectionMetadata.querySelector(".name").textContent = product.name;
  productSectionMetadata.querySelector(".price").innerHTML = product.sale_price
    ? `${product.sale_price} ${product.currency} <span class="sale-price">${product.price} ${product.currency}</span>`
    : `${product.price} ${product.currency}`;

  let productImages = "";
  product.images.forEach((image) => {
    productImages += `<img src="${image}" alt="${product.name}">`;
  });
  document.querySelector(".product__images").innerHTML = productImages;
}

// Size options buttons
sizesOptions.forEach((e) => {
  e.addEventListener("click", () => {
    sizesOptions.forEach((e) => e.classList.remove("active"));
    e.classList.toggle("active");
  });
});

// Add click handlers to description sections
productDesctiption.querySelectorAll(".row").forEach((value) => {
  value.addEventListener("click", () => {
    value.querySelector(".title span").style.transform = value
      .querySelector(".description")
      .classList.contains("active")
      ? "rotate(0deg)"
      : "rotate(45deg)";
    value.querySelector(".description").classList.toggle("active");
  });
});

// Fetch products and display the selected one
(async () => {
  const products = await fetchProducts();
  const productId = parseInt(getQueryParam("id"));
  const product = products.find((p) => p.id === productId);

  if (product) {
    displayProductDetails(product);
  } else {
    console.error("Product not found");
  }
})();
