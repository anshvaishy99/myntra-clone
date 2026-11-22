const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const productGrid = document.getElementById("productGrid");
const productResultCount = document.getElementById("productResultCount");
const emptyProducts = document.getElementById("emptyProducts");
const sortProducts = document.getElementById("sortProducts");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const quickModal = document.getElementById("quickModal");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalBrand = document.getElementById("modalBrand");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalSizes = document.getElementById("modalSizes");
const modalQty = document.getElementById("modalQty");
const modalMinus = document.getElementById("modalMinus");
const modalPlus = document.getElementById("modalPlus");
const modalAdd = document.getElementById("modalAdd");

const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartClose = document.getElementById("cartClose");
const cartBody = document.getElementById("cartBody");
const cartFooter = document.getElementById("cartFooter");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartDelivery = document.getElementById("cartDelivery");
const cartItemCount = document.getElementById("cartItemCount");
const checkoutBtn = document.getElementById("checkoutBtn");

const wishlistCount = document.getElementById("wishlistCount");
const bagCount = document.getElementById("bagCount");
const mobileWishlistCount = document.getElementById("mobileWishlistCount");
const mobileBagCount = document.getElementById("mobileBagCount");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

let wishlist = JSON.parse(localStorage.getItem("myntraWishlist")) || [];
let bag = JSON.parse(localStorage.getItem("myntraBag")) || [];

let activeCategory = "all";
let modalProduct = null;
let modalSelectedSize = "";

const products = [...document.querySelectorAll(".product-card")];

function formatPrice(price) {
    return `₹${Number(price).toLocaleString("en-IN")}`;
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function saveData() {
    localStorage.setItem("myntraWishlist", JSON.stringify(wishlist));
    localStorage.setItem("myntraBag", JSON.stringify(bag));
}

function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
    mobileWishlistCount.textContent = wishlist.length;
}

function updateBagCount() {
    const total = bag.reduce((sum, item) => sum + item.quantity, 0);

    bagCount.textContent = total;
    mobileBagCount.textContent = total;
    cartItemCount.textContent = total;
}

function updateWishlistUI() {
    products.forEach(product => {
        const button = product.querySelector(".wishlist-product");
        const icon = button.querySelector("i");
        const name = product.dataset.name;

        if (wishlist.includes(name)) {
            button.classList.add("active");
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else {
            button.classList.remove("active");
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }
    });
}

function updateProductResults() {
    const query = searchInput.value.trim().toLowerCase();

    clearSearch.classList.toggle("show", query.length > 0);

    let visibleProducts = products.filter(product => {
        const name = product.dataset.name.toLowerCase();
        const brand = product.dataset.brand.toLowerCase();
        const category = product.dataset.category;

        const matchesSearch =
            name.includes(query) ||
            brand.includes(query);

        const matchesCategory =
            activeCategory === "all" ||
            category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const sortValue = sortProducts.value;

    visibleProducts.sort((a, b) => {
        if (sortValue === "low") {
            return Number(a.dataset.price) - Number(b.dataset.price);
        }

        if (sortValue === "high") {
            return Number(b.dataset.price) - Number(a.dataset.price);
        }

        if (sortValue === "rating") {
            return Number(b.dataset.rating) - Number(a.dataset.rating);
        }

        if (sortValue === "discount") {
            return Number(b.dataset.discount) - Number(a.dataset.discount);
        }

        return products.indexOf(a) - products.indexOf(b);
    });

    productGrid.classList.add("sorting");

    setTimeout(() => {
        products.forEach(product => {
            product.style.display = "none";
        });

        visibleProducts.forEach(product => {
            product.style.display = "";
            productGrid.appendChild(product);
        });

        productGrid.classList.remove("sorting");

        productResultCount.textContent =
            `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;

        emptyProducts.style.display =
            visibleProducts.length ? "none" : "block";
    }, 120);
}

function setCategory(category) {
    activeCategory = category;

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    document.querySelectorAll(".category-card").forEach(card => {
        card.classList.toggle(
            "active",
            card.dataset.categoryCard === category
        );
    });

    updateProductResults();
}

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        setCategory(button.dataset.category);
    });
});

document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        setCategory(card.dataset.categoryCard);

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });
    });
});

document.querySelectorAll("[data-nav-category]").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        setCategory(link.dataset.navCategory);

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });

        mobileMenu.classList.remove("open");
    });
});

searchInput.addEventListener("input", updateProductResults);

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    updateProductResults();
    searchInput.focus();
});

sortProducts.addEventListener("change", updateProductResults);

products.forEach(product => {
    const sizeButtons = product.querySelectorAll(".size-row button");

    sizeButtons.forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            sizeButtons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
        });
    });

    product.querySelector(".qty-minus").addEventListener("click", event => {
        event.preventDefault();

        const value = product.querySelector(".qty-value");

        value.textContent = Math.max(
            1,
            Number(value.textContent) - 1
        );
    });

    product.querySelector(".qty-plus").addEventListener("click", event => {
        event.preventDefault();

        const value = product.querySelector(".qty-value");

        value.textContent = Math.min(
            10,
            Number(value.textContent) + 1
        );
    });

    product.querySelector(".wishlist-product").addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        const name = product.dataset.name;

        if (wishlist.includes(name)) {
            wishlist = wishlist.filter(item => item !== name);
            showToast("Removed from wishlist");
        } else {
            wishlist.push(name);
            showToast("Added to wishlist");
        }

        saveData();
        updateWishlistCount();
        updateWishlistUI();
    });

    product.querySelector(".add-bag").addEventListener("click", event => {
        event.preventDefault();

        const selectedSize =
            product.querySelector(".size-row button.selected");

        if (!selectedSize) {
            showToast("Please select a size");
            return;
        }

        const quantity =
            Number(product.querySelector(".qty-value").textContent);

        addToBag({
            name: product.dataset.name,
            brand: product.dataset.brand,
            price: Number(product.dataset.price),
            image: product.dataset.image,
            size: selectedSize.textContent,
            quantity
        });
    });

    product.querySelector(".quick-view").addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        openQuickView(product);
    });
});

function openQuickView(product) {
    modalProduct = product;
    modalSelectedSize = "";

    modalImage.src = product.dataset.image;
    modalImage.alt = product.dataset.name;
    modalBrand.textContent = product.dataset.brand;
    modalName.textContent = product.dataset.name;
    modalDescription.textContent =
        product.querySelector(".product-info > p").textContent;
    modalPrice.textContent =
        formatPrice(product.dataset.price);

    modalQty.textContent = "1";

    modalSizes.innerHTML = "";

    const productSizes =
        [...product.querySelectorAll(".size-row button")];

    productSizes.forEach(sizeButton => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = sizeButton.textContent;

        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            modalSizes
                .querySelectorAll("button")
                .forEach(item => {
                    item.classList.remove("selected");
                });

            button.classList.add("selected");
            modalSelectedSize = button.textContent;
        });

        modalSizes.appendChild(button);
    });

    quickModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeQuickView() {
    quickModal.classList.remove("show");
    document.body.style.overflow = "";
    modalProduct = null;
    modalSelectedSize = "";
}

modalClose.addEventListener("click", closeQuickView);

quickModal.addEventListener("click", event => {
    if (event.target === quickModal) {
        closeQuickView();
    }
});

modalMinus.addEventListener("click", () => {
    modalQty.textContent = Math.max(
        1,
        Number(modalQty.textContent) - 1
    );
});

modalPlus.addEventListener("click", () => {
    modalQty.textContent = Math.min(
        10,
        Number(modalQty.textContent) + 1
    );
});

modalAdd.addEventListener("click", () => {
    if (!modalProduct) {
        return;
    }

    if (!modalSelectedSize) {
        showToast("Please select a size");
        return;
    }

    addToBag({
        name: modalProduct.dataset.name,
        brand: modalProduct.dataset.brand,
        price: Number(modalProduct.dataset.price),
        image: modalProduct.dataset.image,
        size: modalSelectedSize,
        quantity: Number(modalQty.textContent)
    });

    closeQuickView();
});

function addToBag(item) {
    const existing = bag.find(
        product =>
            product.name === item.name &&
            product.size === item.size
    );

    if (existing) {
        existing.quantity = Math.min(
            10,
            existing.quantity + item.quantity
        );
    } else {
        bag.push(item);
    }

    saveData();
    updateBagCount();
    renderCart();
    showToast("Added to bag");
    openCart();
}

function renderCart() {
    if (!bag.length) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-bag-shopping"></i>
                <h3>Your bag is empty</h3>
                <p>Looks like you haven't added anything yet.</p>
                <button type="button" id="continueShopping">
                    Continue Shopping
                </button>
            </div>
        `;

        cartFooter.style.display = "none";

        document
            .getElementById("continueShopping")
            .addEventListener("click", closeCart);

        return;
    }

    cartFooter.style.display = "block";

    cartBody.innerHTML = bag.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div>
                <div class="cart-item-brand">${item.brand}</div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-meta">Size: ${item.size}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>

                <div class="cart-item-controls">
                    <button type="button" class="cart-minus" data-index="${index}">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="cart-plus" data-index="${index}">+</button>
                </div>
            </div>

            <button type="button" class="cart-remove" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join("");

    cartBody.querySelectorAll(".cart-minus").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            bag[index].quantity--;

            if (bag[index].quantity <= 0) {
                bag.splice(index, 1);
            }

            saveData();
            updateBagCount();
            renderCart();
        });
    });

    cartBody.querySelectorAll(".cart-plus").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            bag[index].quantity =
                Math.min(
                    10,
                    bag[index].quantity + 1
                );

            saveData();
            updateBagCount();
            renderCart();
        });
    });

    cartBody.querySelectorAll(".cart-remove").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            bag.splice(index, 1);

            saveData();
            updateBagCount();
            renderCart();

            showToast("Item removed");
        });
    });

    const subtotal = bag.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    cartSubtotal.textContent = formatPrice(subtotal);

    cartDelivery.textContent =
        subtotal >= 999 ? "FREE" : "₹99";
}

function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("show");
    document.body.style.overflow = "";
}

document.getElementById("bagBtn").addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("wishlistBtn").addEventListener("click", () => {
    showToast(
        wishlist.length
            ? `${wishlist.length} item${wishlist.length > 1 ? "s" : ""} in wishlist`
            : "Your wishlist is empty"
    );
});

document.getElementById("profileBtn").addEventListener("click", () => {
    showToast("Profile feature coming soon");
});

checkoutBtn.addEventListener("click", () => {
    if (!bag.length) {
        showToast("Your bag is empty");
        return;
    }

    showToast("Checkout demo — payment coming soon");
});

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");

    const icon = mobileMenuBtn.querySelector("i");

    if (mobileMenu.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});

document.getElementById("mobileHomeBtn").addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.getElementById("mobileSearchBtn").addEventListener("click", () => {
    searchInput.focus();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.getElementById("mobileWishlistBtn").addEventListener("click", () => {
    showToast(
        wishlist.length
            ? `${wishlist.length} item${wishlist.length > 1 ? "s" : ""} in wishlist`
            : "Your wishlist is empty"
    );
});

document.getElementById("mobileBagBtn").addEventListener("click", openCart);

document.querySelectorAll(".occasion-card").forEach(card => {
    card.addEventListener("click", () => {
        showToast(
            `${card.dataset.occasion.charAt(0).toUpperCase()}${card.dataset.occasion.slice(1)} collection selected`
        );
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeQuickView();
        closeCart();
        mobileMenu.classList.remove("open");
    }
});

updateWishlistCount();
updateBagCount();
updateWishlistUI();
renderCart();
updateProductResults();