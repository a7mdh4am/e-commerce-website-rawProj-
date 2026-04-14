const cartBtn = document.querySelectorAll("#bag_btn");
const cartCount = document.querySelectorAll("#bag_count");
const cart = document.querySelector(".cart__container");
const body = document.body;
const navBar = document.querySelector(".navbar__container");
const shopNow = document.querySelector("#shopNow");
const mostSellingContainer = document.querySelector("#most-selling-container");
let activeLink = document.querySelector(".categories__navlinks a.active");

// Fetch products from JSON
async function fetchProducts() {
  try {
    const response = await fetch("./products.json");
    if (!response.ok) {
      console.log("Failed to fetch products:", response.status);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.log("Error fetching products:", error);
    return [];
  }
}

let a = navBar.querySelectorAll("a");
let li = navBar.querySelectorAll("li");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    navBar.style.backgroundColor = "var(--background-color)";
    a.forEach((value) => {
      value.style.color = "#000";
    });
    li.forEach((value) => {
      value.style.color = "#000";
    });
  } else {
    navBar.style.backgroundColor = "transparent";
    a.forEach((value) => {
      value.style.color = "";
    });
    li.forEach((value) => {
      value.style.color = "";
    });
  }
});

function toggleCart() {
  cart.classList.toggle("open");
  body.classList.toggle("no-scroll");
}

cartBtn.forEach((e) => {
  e.addEventListener("click", () => {
    toggleCart();
  });
});

shopNow.addEventListener("mouseover", () => {
  shopNow.querySelector(".categories__container").style.display = "block";
  shopNow.querySelector("span").style.transform = "rotate(45deg)";
});
shopNow.addEventListener("mouseleave", () => {
  shopNow.querySelector(".categories__container").style.display = "none";
  shopNow.querySelector("span").style.transform = "rotate(0deg)";
  console.log(shopNow.querySelector("span"));
});

function addToCart(product, size, e) {
  const cartBtn = e.querySelector("#add-to-cart-btn");
  cartBtn.disabled = true;
  cartBtn.innerHTML = `<div class="loader"></div>`;
  setTimeout(() => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id == product.id && item.size == size,
    );

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1, size: size });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    displayCartItems();

    cartBtn.textContent = "ADDED TO BAG!";
    setTimeout(() => {
      toggleCart();
    }, 500);
    setTimeout(() => {
      cartBtn.textContent = "ADD TO BAG";
      cartBtn.disabled = false;
    }, 500);
  }, 1000);
}

function handlerQuantity(product, size, operation) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const itemIndex = cartItems.findIndex(
    (item) => item.id == product.id && item.size == size,
  );

  // If item not found, stop safely
  if (itemIndex === -1) return;

  if (operation === "add") {
    cartItems[itemIndex].quantity += 1;
  } else if (operation === "sub") {
    cartItems[itemIndex].quantity -= 1;

    // Remove item if quantity reaches 0
    if (cartItems[itemIndex].quantity <= 0) {
      cartItems.splice(itemIndex, 1);
    }
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  displayCartItems();
}

function removeItemFromCart(productId, size) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const itemIndex = cartItems.findIndex(
    (item) => item.id == productId && item.size == size,
  );

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    displayCartItems();
  }
}

function displayCartItems() {
  const cartItemsContainer = document.querySelector(".cart__items");
  cartItemsContainer.innerHTML = "";
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || null;
  cartCount.forEach((e) => {
    e.textContent = cartItems.length;
  });

  let totalPrice = 0;

  cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart__item");
    cartItem.innerHTML = `
      <div class="img">
            <img src="${item.images[0]}" alt="${item.name}" />
          </div>
          <div class="content">
            <h5>${item.name}</h5>
            <p>${item.price} ${item.currency}</p>
            <h6 class="price">Size: <span>${item.size}</span></h6>
            <div class="quantity">
              <h6>Qty:</h6>
              <button class="sub qty-btn" data-id="${item.id}" data-size="${item.size}">-</button>
              <h6>${item.quantity}</h6>
              <button class="add qty-btn" data-id="${item.id}" data-size="${item.size}">+</button>
            </div>
            <h6 class="remove-btn" data-id="${item.id}"data-size="${item.size}">Remove</h6>
          </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  document.querySelector("#cart__total").textContent =
    `${totalPrice} ${cartItems[0]?.currency || ""}`;
}

// Display cart items on page load
displayCartItems();

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("qty-btn")) {
    const productId = e.target.dataset.id;
    const size = e.target.dataset.size;
    const operation = e.target.classList.contains("add") ? "add" : "sub";

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const product = cartItems.find(
      (item) => item.id == productId && item.size == size,
    );

    if (product) {
      handlerQuantity(product, size, operation);
    }
  }

  if (e.target.classList.contains("remove-btn")) {
    const productId = e.target.dataset.id;
    const size = e.target.dataset.size;

    removeItemFromCart(productId, size);
  }
});

async function fetchMostSellingProduts(limit) {
  let mostSellingProducts = "";
  const allProducts = await fetchProducts();

  const limitedProducts = allProducts.slice(0, limit);

  limitedProducts.forEach((product) => {
    mostSellingProducts += `<div class="most__selling__item">
          <a href="./product.html?id=${product.id}">
            <div class="img">
              <img src="${product.images[0]}" alt="${product.name}" />
            </div>
          </a>
          <h4>${product.name}</h4>
          <p>${product.price} ${product.currency}</p>
        </div>
        `;
  });

  if (mostSellingContainer) {
    mostSellingContainer.innerHTML = mostSellingProducts;
  }
}
