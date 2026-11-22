const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const bagCount = document.getElementById("bagCount");
const wishlistCount = document.getElementById("wishlistCount");
const toast = document.getElementById("toast");

let bagItems = 0;
let wishlistItems = 0;
let cartItems = [];
let currentProduct = null;
let modalQuantity = 1;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function updateBagCount() {
    bagItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    bagCount.textContent = bagItems;
}

function updateWishlist() {
    wishlistCount.textContent = wishlistItems;
}

function getProductData(card, size, quantity) {
    return {
        id: card.dataset.name,
        brand: card.querySelector("h3").textContent,
        name: card.querySelector(".product-name").textContent,
        image: card.querySelector("img").src,
        price: card.querySelector(".price").textContent.split("₹")[1].split(" ")[0],
        size: size,
        quantity: quantity
    };
}

function renderCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <h3>Your bag is empty</h3>
                <p>Add something you love!</p>
            </div>
        `;

        cartTotal.textContent = "₹0";
        return;
    }

    let total = 0;

    cartItemsContainer.innerHTML = cartItems.map((item, index) => {
        const price = Number(item.price.replace(/,/g, ""));
        total += price * item.quantity;

        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>

                <div class="cart-item-info">
                    <h3>${item.brand}</h3>
                    <p>${item.name}</p>
                    <p>Size: ${item.size}</p>
                    <div class="cart-item-price">₹${price.toLocaleString("en-IN")}</div>

                    <div class="cart-item-controls">
                        <button class="cart-minus" data-index="${index}">−</button>
                        <span>${item.quantity}</span>
                        <button class="cart-plus" data-index="${index}">+</button>
                        <button class="remove-cart-item" data-index="${index}">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    cartTotal.textContent = "₹" + total.toLocaleString("en-IN");

    document.querySelectorAll(".cart-minus").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
            } else {
                cartItems.splice(index, 1);
            }

            updateBagCount();
            renderCart();
        });
    });

    document.querySelectorAll(".cart-plus").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            if (cartItems[index].quantity < 10) {
                cartItems[index].quantity++;
            }

            updateBagCount();
            renderCart();
        });
    });

    document.querySelectorAll(".remove-cart-item").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            cartItems.splice(index, 1);
            updateBagCount();
            renderCart();
            showToast("Item removed from bag");
        });
    });
}

function openCart() {
    document.getElementById("cartDrawer").classList.add("show");
    document.getElementById("cartOverlay").classList.add("show");
    renderCart();
}

function closeCart() {
    document.getElementById("cartDrawer").classList.remove("show");
    document.getElementById("cartOverlay").classList.remove("show");
}

document.querySelectorAll(".size-btn").forEach(button => {
    button.addEventListener("click", () => {
        const parent = button.closest(".size-row");

        parent.querySelectorAll(".size-btn").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});

document.querySelectorAll(".qty-plus").forEach(button => {
    button.addEventListener("click", () => {
        const row = button.closest(".quantity-row");
        const quantity = row.querySelector(".quantity");
        let value = Number(quantity.textContent);

        if (value < 10) {
            value++;
            quantity.textContent = value;
        }
    });
});

document.querySelectorAll(".qty-minus").forEach(button => {
    button.addEventListener("click", () => {
        const row = button.closest(".quantity-row");
        const quantity = row.querySelector(".quantity");
        let value = Number(quantity.textContent);

        if (value > 1) {
            value--;
            quantity.textContent = value;
        }
    });
});

document.querySelectorAll(".add-bag").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const selectedSize = card.querySelector(".size-btn.selected");
        const quantity = Number(card.querySelector(".quantity").textContent);

        if (!selectedSize) {
            showToast("Please select a size");
            return;
        }

        const product = getProductData(card, selectedSize.textContent, quantity);

        const existingItem = cartItems.find(item =>
            item.id === product.id && item.size === product.size
        );

        if (existingItem) {
            existingItem.quantity = Math.min(
                existingItem.quantity + quantity,
                10
            );
        } else {
            cartItems.push(product);
        }

        updateBagCount();
        renderCart();
        showToast(quantity + " item added to bag");
    });
});

document.querySelectorAll(".wishlist-btn").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");

        const icon = button.querySelector("i");

        if (button.classList.contains("active")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            wishlistItems++;
            showToast("Added to wishlist");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
            wishlistItems--;
            showToast("Removed from wishlist");
        }

        updateWishlist();
    });
});

searchInput.addEventListener("input", () => {
    const search = searchInput.value.toLowerCase().trim();

    document.querySelectorAll(".product-card").forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        card.style.display =
            name.includes(search) || category.includes(search)
                ? ""
                : "none";
    });
});

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;

        document.querySelectorAll(".product-card").forEach(card => {
            card.style.display =
                card.dataset.category === category
                    ? ""
                    : "none";
        });

        document.getElementById("trending").scrollIntoView({
            behavior: "smooth"
        });

        showToast(category + " products");
    });
});

document.getElementById("viewAllBtn").addEventListener("click", () => {
    document.querySelectorAll(".product-card").forEach(card => {
        card.style.display = "";
    });

    searchInput.value = "";
    showToast("Showing all products");
});

document.getElementById("shopNowBtn").addEventListener("click", () => {
    document.getElementById("trending").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("featuredBtn").addEventListener("click", () => {
    document.getElementById("trending").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("offerBtn").addEventListener("click", () => {
    document.getElementById("trending").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("profileBtn").addEventListener("click", () => {
    showToast("Profile feature coming soon");
});

document.getElementById("wishlistBtn").addEventListener("click", () => {
    showToast("Wishlist: " + wishlistItems + " item(s)");
});

document.getElementById("bagBtn").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

document.getElementById("cartOverlay").addEventListener("click", closeCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cartItems.length === 0) {
        showToast("Your bag is empty");
        return;
    }

    showToast("Order process started");
});

const modal = document.getElementById("quickViewModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalBrand = document.getElementById("modalBrand");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalRating = document.getElementById("modalRating");
const modalPrice = document.getElementById("modalPrice");
const modalQuantityElement = document.getElementById("modalQuantity");

document.querySelectorAll(".quick-view").forEach(button => {
    button.addEventListener("click", () => {
        currentProduct = button.closest(".product-card");

        modalImage.src = currentProduct.querySelector("img").src;
        modalBrand.textContent = currentProduct.querySelector("h3").textContent;
        modalName.textContent = currentProduct.querySelector(".product-name").textContent;
        modalDescription.textContent = "Premium fashion product designed for everyday style and comfort.";
        modalRating.textContent = currentProduct.querySelector(".rating").textContent;
        modalPrice.textContent = currentProduct.querySelector(".price").textContent;

        modalQuantity = 1;
        modalQuantityElement.textContent = "1";

        document.querySelectorAll(".modal-size").forEach(button => {
            button.classList.remove("selected");
        });

        modal.classList.add("show");
    });
});

document.querySelectorAll(".modal-size").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".modal-size").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});

document.getElementById("modalPlus").addEventListener("click", () => {
    if (modalQuantity < 10) {
        modalQuantity++;
        modalQuantityElement.textContent = modalQuantity;
    }
});

document.getElementById("modalMinus").addEventListener("click", () => {
    if (modalQuantity > 1) {
        modalQuantity--;
        modalQuantityElement.textContent = modalQuantity;
    }
});

document.getElementById("modalAddBag").addEventListener("click", () => {
    const selectedSize = document.querySelector(".modal-size.selected");

    if (!selectedSize) {
        showToast("Please select a size");
        return;
    }

    const priceText = currentProduct.querySelector(".price").textContent;
    const price = priceText.split("₹")[1].split(" ")[0];

    const product = {
        id: currentProduct.dataset.name,
        brand: currentProduct.querySelector("h3").textContent,
        name: currentProduct.querySelector(".product-name").textContent,
        image: currentProduct.querySelector("img").src,
        price: price,
        size: selectedSize.textContent,
        quantity: modalQuantity
    };

    const existingItem = cartItems.find(item =>
        item.id === product.id && item.size === product.size
    );

    if (existingItem) {
        existingItem.quantity = Math.min(
            existingItem.quantity + product.quantity,
            10
        );
    } else {
        cartItems.push(product);
    }

    updateBagCount();
    renderCart();
    modal.classList.remove("show");
    showToast(product.quantity + " item added to bag");
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        modal.classList.remove("show");
        closeCart();
    }
});