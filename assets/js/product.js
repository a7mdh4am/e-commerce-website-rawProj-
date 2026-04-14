const productDesctiption = document.querySelectorAll("#product-description");

// Get query parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Display product details
function displayProductDetails(product) {
  const productContainers = document.querySelectorAll("#prodCont");
  productContainers.forEach((e) => {
    const productSectionMetadata = e.querySelector(
      ".product__section.metadata",
    );
    const productImagesContainer = e.querySelector(".product__images");
    const addToCartBtn = e.querySelector("#add-to-cart-btn");
    addToCartBtn.addEventListener("click", () => {
      addToCart(product, e.querySelector(".option.active").textContent, e);
    });

    // Inject Product Data :/
    productSectionMetadata.querySelector(".name").textContent = product.name;
    productSectionMetadata.querySelector(".price").innerHTML =
      product.sale_price
        ? `${product.price} ${product.currency} <span class="sale-price">${product.sale_price} ${product.currency}</span>`
        : `${product.price} ${product.currency}`;

    let productImages = "";
    product.images.forEach((image) => {
      productImages += `<img src="${image}" alt="${product.name}">`;
    });

    productImagesContainer.innerHTML = productImages;
  });
}

// Size options buttons
const sizesOptionsContainer = document.querySelectorAll("#sizseContainer");
sizesOptionsContainer.forEach((e) => {
  const sizesOptions = e.querySelectorAll("div.option");

  sizesOptions.forEach((e) => {
    e.addEventListener("click", () => {
      sizesOptions.forEach((e) => e.classList.remove("active"));
      e.classList.toggle("active");
    });
  });
});
// Add click handlers to description sections
productDesctiption.forEach((e) => {
  e.querySelectorAll(".row").forEach((value) => {
    value.addEventListener("click", () => {
      value.querySelector(".title span").style.transform = value
        .querySelector(".description")
        .classList.contains("active")
        ? "rotate(0deg)"
        : "rotate(45deg)";
      value.querySelector(".description").classList.toggle("active");
    });
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
