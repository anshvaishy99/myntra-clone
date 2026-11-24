const products = [...document.querySelectorAll(".product-card")];
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const sortSelect = document.getElementById("sortSelect");
const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const resetFilters = document.getElementById("resetFilters");
const filterCount = document.getElementById("filterCount");
const activeFilters = document.getElementById("activeFilters");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");
const noResultsReset = document.getElementById("noResultsReset");

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

const wishlistOverlay = document.getElementById("wishlistOverlay");
const wishlistDrawer = document.getElementById("wishlistDrawer");
const wishlistClose = document.getElementById("wishlistClose");
const wishlistBody = document.getElementById("wishlistBody");
const wishlistItemCount = document.getElementById("wishlistItemCount");

const profileBtn = document.getElementById("profileBtn");
const wishlistBtn = document.getElementById("wishlistBtn");
const bagBtn = document.getElementById("bagBtn");

const mobileHomeBtn = document.getElementById("mobileHomeBtn");
const mobileWishlistBtn = document.getElementById("mobileWishlistBtn");
const mobileBagBtn = document.getElementById("mobileBagBtn");
const mobileProfileBtn = document.getElementById("mobileProfileBtn");

const wishlistCount = document.getElementById("wishlistCount");
const bagCount = document.getElementById("bagCount");
const mobileBagCount = document.getElementById("mobileBagCount");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

let wishlist = JSON.parse(localStorage.getItem("myntraWishlist")) || [];
let bag = JSON.parse(localStorage.getItem("myntraBag")) || [];
let modalProduct = null;
let modalSelectedSize = "";

const filters = {
    category: "all",
    price: "all",
    rating: "all",
    discount: "all"
};

let toastTimer;

function formatPrice(price) {
    return `₹${Number(price).toLocaleString("en-IN")}`;
}

function saveData() {
    localStorage.setItem("myntraWishlist", JSON.stringify(wishlist));
    localStorage.setItem("myntraBag", JSON.stringify(bag));
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
    wishlistItemCount.textContent = wishlist.length;
}

function updateWishlistUI() {
    products.forEach(product => {
        const name = product.dataset.name;
        const button = product.querySelector(".wishlist-product");

        if (wishlist.includes(name)) {
            button.classList.add("active");
            button.innerHTML = '<i class="fa-solid fa-heart"></i>';
        } else {
            button.classList.remove("active");
            button.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
    });
}

function getProductByName(name) {
    return products.find(product => product.dataset.name === name);
}

function getProductData(product) {
    const sizes = [...product.querySelectorAll(".size-row button")].map(
        button => button.textContent.trim()
    );

    return {
        name: product.dataset.name,
        brand: product.dataset.brand,
        price: Number(product.dataset.price),
        image: product.dataset.image,
        sizes
    };
}

function openWishlist() {
    renderWishlist();
    wishlistOverlay.classList.add("show");
    wishlistDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeWishlist() {
    wishlistOverlay.classList.remove("show");
    wishlistDrawer.classList.remove("open");

    if (
        !cartDrawer.classList.contains("open") &&
        !quickModal.classList.contains("show") &&
        !checkoutModal.classList.contains("open") &&
        !orderHistoryDrawer.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function renderWishlist() {
    const items = wishlist
        .map(name => getProductByName(name))
        .filter(Boolean);

    if (!items.length) {
        wishlistBody.innerHTML = `
            <div class="wishlist-empty">
                <div>
                    <i class="fa-regular fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save your favorite products here and come back anytime.</p>
                    <button type="button" id="startWishlistShopping">
                        START SHOPPING
                    </button>
                </div>
            </div>
        `;

        document
            .getElementById("startWishlistShopping")
            .addEventListener("click", closeWishlist);

        return;
    }

    wishlistBody.innerHTML = items.map(product => {
        const data = getProductData(product);

        return `
            <div class="wishlist-item">
                <div class="wishlist-item-image">
                    <img src="${data.image}" alt="${data.name}">
                </div>

                <div class="wishlist-item-content">
                    <div class="wishlist-item-brand">${data.brand}</div>
                    <div class="wishlist-item-name">${data.name}</div>

                    <div class="wishlist-item-price">
                        ${formatPrice(data.price)}
                    </div>

                    <span class="wishlist-size-label">Select Size</span>

                    <div class="wishlist-size-row">
                        ${data.sizes.map(size => `
                            <button type="button" data-size="${size}">
                                ${size}
                            </button>
                        `).join("")}
                    </div>

                    <button
                        type="button"
                        class="wishlist-add"
                        data-name="${data.name}"
                    >
                        ADD TO BAG
                    </button>
                </div>

                <button
                    type="button"
                    class="wishlist-remove"
                    data-name="${data.name}"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    }).join("");

    wishlistBody.querySelectorAll(".wishlist-size-row").forEach(row => {
        const buttons = row.querySelectorAll("button");

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                buttons.forEach(item => item.classList.remove("selected"));
                button.classList.add("selected");
            });
        });
    });

    wishlistBody.querySelectorAll(".wishlist-remove").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;

            wishlist = wishlist.filter(item => item !== name);

            saveData();
            updateWishlistCount();
            updateWishlistUI();
            renderWishlist();

            showToast("Removed from wishlist");
        });
    });

    wishlistBody.querySelectorAll(".wishlist-add").forEach(button => {
        button.addEventListener("click", () => {
            const item = button.closest(".wishlist-item");
            const selectedSize = item.querySelector(".wishlist-size-row .selected");

            if (!selectedSize) {
                showToast("Please select a size");
                return;
            }

            const product = getProductByName(button.dataset.name);
            const data = getProductData(product);

            addToBag({
                name: data.name,
                brand: data.brand,
                price: data.price,
                image: data.image,
                size: selectedSize.textContent.trim(),
                quantity: 1
            });
        });
    });
}

products.forEach(product => {
    const wishlistButton = product.querySelector(".wishlist-product");

    wishlistButton.addEventListener("click", event => {
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

        if (wishlistDrawer.classList.contains("open")) {
            renderWishlist();
        }
    });

    product.querySelectorAll(".size-row button").forEach(button => {
        button.addEventListener("click", () => {
            product
                .querySelectorAll(".size-row button")
                .forEach(item => item.classList.remove("selected"));

            button.classList.add("selected");
        });
    });

    product.querySelector(".qty-minus").addEventListener("click", () => {
        const value = product.querySelector(".qty-value");
        value.textContent = Math.max(1, Number(value.textContent) - 1);
    });

    product.querySelector(".qty-plus").addEventListener("click", () => {
        const value = product.querySelector(".qty-value");
        value.textContent = Math.min(10, Number(value.textContent) + 1);
    });

    product.querySelector(".add-bag").addEventListener("click", () => {
        const selectedSize = product.querySelector(".size-row .selected");

        if (!selectedSize) {
            showToast("Please select a size");
            return;
        }

        const quantity = Number(
            product.querySelector(".qty-value").textContent
        );

        addToBag({
            name: product.dataset.name,
            brand: product.dataset.brand,
            price: Number(product.dataset.price),
            image: product.dataset.image,
            size: selectedSize.textContent.trim(),
            quantity
        });
    });

    product.querySelector(".quick-view").addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openQuickView(product);
    });
});

function updateBagCount() {
    const total = bag.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    bagCount.textContent = total;
    mobileBagCount.textContent = total;
}

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
                <div>
                    <i class="fa-solid fa-bag-shopping"></i>
                    <h3>Your bag is empty</h3>
                    <p>Looks like you haven't added anything yet.</p>
                    <button type="button" id="continueShopping">
                        Continue Shopping
                    </button>
                </div>
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

            if (bag[index].quantity > 1) {
                bag[index].quantity--;
            } else {
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

            bag[index].quantity = Math.min(
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

            showToast("Removed from bag");
        });
    });

    const subtotal = bag.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    cartSubtotal.textContent = formatPrice(subtotal);
    cartDelivery.textContent = subtotal >= 999 ? "FREE" : "₹99";

    document.getElementById("cartTotal").textContent =
        formatPrice(subtotal >= 999 ? subtotal : subtotal + 99);
}

function openCart() {
    cartOverlay.classList.add("show");
    cartDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartOverlay.classList.remove("show");
    cartDrawer.classList.remove("open");

    if (
        !wishlistDrawer.classList.contains("open") &&
        !quickModal.classList.contains("show") &&
        !checkoutModal.classList.contains("open") &&
        !orderHistoryDrawer.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function openQuickView(product) {
    modalProduct = product;

    modalImage.src = product.dataset.image;
    modalBrand.textContent = product.dataset.brand;
    modalName.textContent = product.dataset.name;

    modalDescription.textContent =
        "A premium pick selected for your wardrobe. Designed for everyday styling with a modern, effortless finish.";

    modalPrice.textContent = formatPrice(product.dataset.price);

    modalQty.textContent = "1";
    modalSelectedSize = "";

    const sizes = [
        ...product.querySelectorAll(".size-row button")
    ];

    modalSizes.innerHTML = sizes.map(button => `
        <button type="button" data-size="${button.textContent.trim()}">
            ${button.textContent.trim()}
        </button>
    `).join("");

    modalSizes.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            modalSizes
                .querySelectorAll("button")
                .forEach(item => item.classList.remove("selected"));

            button.classList.add("selected");
            modalSelectedSize = button.dataset.size;
        });
    });

    quickModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeQuickView() {
    quickModal.classList.remove("show");

    if (
        !cartDrawer.classList.contains("open") &&
        !wishlistDrawer.classList.contains("open") &&
        !checkoutModal.classList.contains("open") &&
        !orderHistoryDrawer.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

modalMinus.addEventListener("click", () => {
    let quantity = Number(modalQty.textContent);
    quantity = Math.max(1, quantity - 1);
    modalQty.textContent = quantity;
});

modalPlus.addEventListener("click", () => {
    let quantity = Number(modalQty.textContent);
    quantity = Math.min(10, quantity + 1);
    modalQty.textContent = quantity;
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

modalClose.addEventListener("click", closeQuickView);

quickModal.addEventListener("click", event => {
    if (event.target === quickModal) {
        closeQuickView();
    }
});

wishlistBtn.addEventListener("click", openWishlist);
mobileWishlistBtn.addEventListener("click", openWishlist);
wishlistClose.addEventListener("click", closeWishlist);
wishlistOverlay.addEventListener("click", closeWishlist);

bagBtn.addEventListener("click", openCart);
mobileBagBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

profileBtn.addEventListener("click", openOrderHistory);
mobileProfileBtn.addEventListener("click", openOrderHistory);

mobileHomeBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
});

document.querySelectorAll("[data-category]").forEach(link => {
    link.addEventListener("click", event => {
        const category = link.dataset.category;

        if (!category) {
            return;
        }

        event.preventDefault();

        filters.category = category;

        document.querySelectorAll(".filter-option").forEach(button => {
            if (button.dataset.filter === "category") {
                button.classList.toggle(
                    "active",
                    button.dataset.value === category
                );
            }
        });

        applyFilters();

        document
            .getElementById("products")
            .scrollIntoView({
                behavior: "smooth"
            });

        mobileMenu.classList.remove("show");
    });
});

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    applyFilters();
});

searchInput.addEventListener("input", () => {
    clearSearch.style.display =
        searchInput.value ? "block" : "none";

    applyFilters();
});

sortSelect.addEventListener("change", applyFilters);

filterToggle.addEventListener("click", () => {
    filterPanel.classList.toggle("show");
});

document.querySelectorAll(".filter-option").forEach(button => {
    button.addEventListener("click", () => {
        const type = button.dataset.filter;
        const value = button.dataset.value;

        filters[type] = value;

        document
            .querySelectorAll(`.filter-option[data-filter="${type}"]`)
            .forEach(item => {
                item.classList.toggle(
                    "active",
                    item.dataset.value === value
                );
            });

        applyFilters();
    });
});

function matchesFilter(product) {
    const category = product.dataset.category;
    const price = Number(product.dataset.price);
    const rating = Number(product.dataset.rating);
    const discount = Number(product.dataset.discount);
    const search = searchInput.value.trim().toLowerCase();

    if (
        search &&
        !product.dataset.name.toLowerCase().includes(search) &&
        !product.dataset.brand.toLowerCase().includes(search) &&
        !category.toLowerCase().includes(search)
    ) {
        return false;
    }

    if (
        filters.category !== "all" &&
        category !== filters.category
    ) {
        return false;
    }

    if (
        filters.price === "under1000" &&
        price >= 1000
    ) {
        return false;
    }

    if (
        filters.price === "1000-2000" &&
        (price < 1000 || price > 2000)
    ) {
        return false;
    }

    if (
        filters.price === "above2000" &&
        price <= 2000
    ) {
        return false;
    }

    if (
        filters.rating !== "all" &&
        rating < Number(filters.rating)
    ) {
        return false;
    }

    if (
        filters.discount !== "all" &&
        discount < Number(filters.discount)
    ) {
        return false;
    }

    return true;
}

function applyFilters() {
    const visibleProducts = products.filter(matchesFilter);

    products.forEach(product => {
        product.style.display = visibleProducts.includes(product)
            ? ""
            : "none";
    });

    const sortValue = sortSelect.value;

    const sorted = [...visibleProducts].sort((a, b) => {
        const priceA = Number(a.dataset.price);
        const priceB = Number(b.dataset.price);
        const ratingA = Number(a.dataset.rating);
        const ratingB = Number(b.dataset.rating);
        const discountA = Number(a.dataset.discount);
        const discountB = Number(b.dataset.discount);

        if (sortValue === "price-low") {
            return priceA - priceB;
        }

        if (sortValue === "price-high") {
            return priceB - priceA;
        }

        if (sortValue === "rating") {
            return ratingB - ratingA;
        }

        if (sortValue === "discount") {
            return discountB - discountA;
        }

        return 0;
    });

    sorted.forEach(product => {
        document
            .getElementById("productsGrid")
            .appendChild(product);
    });

    resultCount.textContent = visibleProducts.length;

    noResults.classList.toggle(
        "show",
        visibleProducts.length === 0
    );

    let count = 0;

    Object.values(filters).forEach(value => {
        if (value !== "all") {
            count++;
        }
    });

    if (searchInput.value.trim()) {
        count++;
    }

    filterCount.textContent = count;

    activeFilters.innerHTML = "";

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") {
            const tag = document.createElement("span");
            tag.className = "active-filter";
            tag.textContent = `${key}: ${value}`;
            activeFilters.appendChild(tag);
        }
    });

    if (searchInput.value.trim()) {
        const tag = document.createElement("span");
        tag.className = "active-filter";
        tag.textContent = `Search: ${searchInput.value.trim()}`;
        activeFilters.appendChild(tag);
    }
}

function resetAllFilters() {
    filters.category = "all";
    filters.price = "all";
    filters.rating = "all";
    filters.discount = "all";

    sortSelect.value = "relevance";
    searchInput.value = "";
    clearSearch.style.display = "none";

    document.querySelectorAll(".filter-option").forEach(button => {
        if (button.dataset.value === "all") {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    applyFilters();
}

resetFilters.addEventListener("click", resetAllFilters);
noResultsReset.addEventListener("click", resetAllFilters);

const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutContent = document.getElementById("checkoutContent");
const checkoutSuccess = document.getElementById("checkoutSuccess");
const checkoutProducts = document.getElementById("checkoutProducts");
const checkoutItemsCount = document.getElementById("checkoutItemsCount");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutDiscount = document.getElementById("checkoutDiscount");
const checkoutDelivery = document.getElementById("checkoutDelivery");
const checkoutTotal = document.getElementById("checkoutTotal");
const couponInput = document.getElementById("couponInput");
const applyCoupon = document.getElementById("applyCoupon");
const couponMessage = document.getElementById("couponMessage");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const checkoutName = document.getElementById("checkoutName");
const checkoutMobile = document.getElementById("checkoutMobile");
const checkoutPin = document.getElementById("checkoutPin");
const checkoutCity = document.getElementById("checkoutCity");
const checkoutAddress = document.getElementById("checkoutAddress");
const continueShoppingAfterOrder = document.getElementById("continueShoppingAfterOrder");
const orderId = document.getElementById("orderId");
const checkoutBtn = document.getElementById("checkoutBtn");

let appliedCoupon = "";
let checkoutDiscountValue = 0;
let checkoutOrderSnapshot = [];
let orderHistory = JSON.parse(localStorage.getItem("myntraOrders")) || [];

function saveOrders() {
    localStorage.setItem(
        "myntraOrders",
        JSON.stringify(orderHistory)
    );
}

function calculateCheckoutTotals() {
    const subtotal = bag.reduce(
        (sum, item) =>
            sum + Number(item.price) * Number(item.quantity),
        0
    );

    checkoutDiscountValue =
        appliedCoupon === "MYNTRA10"
            ? Math.round(subtotal * .10)
            : 0;

    const delivery = subtotal >= 999 ? 0 : 99;

    const total =
        subtotal -
        checkoutDiscountValue +
        delivery;

    return {
        subtotal,
        discount: checkoutDiscountValue,
        delivery,
        total
    };
}

function renderCheckout() {
    if (!bag.length) {
        return;
    }

    checkoutOrderSnapshot = bag.map(item => ({
        ...item
    }));

    const totals = calculateCheckoutTotals();

    checkoutItemsCount.textContent =
        `${bag.reduce(
            (sum, item) => sum + Number(item.quantity),
            0
        )} items`;

    checkoutProducts.innerHTML = bag.map(item => `
        <div class="checkout-product">
            <div class="checkout-product-image">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div>
                <div class="checkout-product-brand">
                    ${item.brand}
                </div>

                <div class="checkout-product-name">
                    ${item.name}
                </div>

                <div class="checkout-product-meta">
                    Size: ${item.size} · Qty: ${item.quantity}
                </div>
            </div>

            <div class="checkout-product-price">
                ${formatPrice(
                    Number(item.price) * Number(item.quantity)
                )}
            </div>
        </div>
    `).join("");

    checkoutSubtotal.textContent =
        formatPrice(totals.subtotal);

    checkoutDiscount.textContent =
        `- ${formatPrice(totals.discount)}`;

    checkoutDelivery.textContent =
        totals.delivery === 0
            ? "FREE"
            : formatPrice(totals.delivery);

    checkoutTotal.textContent =
        formatPrice(totals.total);
}

function resetCheckout() {
    appliedCoupon = "";
    checkoutDiscountValue = 0;
    checkoutOrderSnapshot = [];

    checkoutContent.style.display = "grid";
    checkoutSuccess.classList.remove("show");

    couponInput.value = "";
    couponMessage.textContent = "";
    couponMessage.className = "";

    checkoutName.value = "";
    checkoutMobile.value = "";
    checkoutPin.value = "";
    checkoutCity.value = "";
    checkoutAddress.value = "";

    document
        .querySelectorAll('input[name="paymentMethod"]')
        .forEach(input => {
            input.checked = false;
        });

    placeOrderBtn.disabled = false;
    placeOrderBtn.querySelector("span").textContent =
        "Place Order";
}

function openCheckout() {
    if (!bag.length) {
        showToast("Your bag is empty");
        return;
    }

    closeCart();
    resetCheckout();
    renderCheckout();

    checkoutOverlay.classList.add("show");
    checkoutModal.classList.add("open");

    document.body.style.overflow = "hidden";
}

function closeCheckout() {
    checkoutOverlay.classList.remove("show");
    checkoutModal.classList.remove("open");

    if (
        !cartDrawer.classList.contains("open") &&
        !wishlistDrawer.classList.contains("open") &&
        !quickModal.classList.contains("show") &&
        !orderHistoryDrawer.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function applyCouponCode() {
    const code = couponInput.value
        .trim()
        .toUpperCase();

    if (appliedCoupon === "MYNTRA10") {
        couponMessage.textContent =
            "Coupon already applied";

        couponMessage.className = "error";
        return;
    }

    if (code !== "MYNTRA10") {
        couponMessage.textContent =
            "Invalid coupon code";

        couponMessage.className = "error";
        return;
    }

    appliedCoupon = "MYNTRA10";

    couponInput.value = "MYNTRA10";

    couponMessage.textContent =
        "10% discount applied";

    couponMessage.className = "success";

    renderCheckout();
}

function validateCheckoutForm() {
    const name = checkoutName.value.trim();
    const mobile = checkoutMobile.value.trim();
    const pin = checkoutPin.value.trim();
    const city = checkoutCity.value.trim();
    const address = checkoutAddress.value.trim();

    const payment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

    if (name.length < 2) {
        showToast("Please enter your full name");
        checkoutName.focus();
        return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        showToast(
            "Enter a valid 10-digit mobile number"
        );

        checkoutMobile.focus();
        return false;
    }

    if (!/^\d{6}$/.test(pin)) {
        showToast(
            "Enter a valid 6-digit PIN code"
        );

        checkoutPin.focus();
        return false;
    }

    if (city.length < 2) {
        showToast("Please enter your city");
        checkoutCity.focus();
        return false;
    }

    if (address.length < 8) {
        showToast(
            "Please enter your complete address"
        );

        checkoutAddress.focus();
        return false;
    }

    if (!payment) {
        showToast(
            "Please select a payment method"
        );

        return false;
    }

    return true;
}

function createOrderRecord() {
    const totals = calculateCheckoutTotals();

    return {
        id: `MYN${Date.now().toString().slice(-8)}`,
        date: new Date().toISOString(),
        status: "CONFIRMED",
        paymentMethod:
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            )?.value || "COD",

        customer: {
            name: checkoutName.value.trim(),
            mobile: checkoutMobile.value.trim(),
            pin: checkoutPin.value.trim(),
            city: checkoutCity.value.trim(),
            address: checkoutAddress.value.trim()
        },

        items: checkoutOrderSnapshot.map(item => ({
            name: item.name,
            brand: item.brand,
            price: Number(item.price),
            image: item.image,
            size: item.size,
            quantity: Number(item.quantity)
        })),

        subtotal: totals.subtotal,
        discount: totals.discount,
        delivery: totals.delivery,
        total: totals.total
    };
}

function placeOrder() {
    if (!validateCheckoutForm()) {
        return;
    }

    const order = createOrderRecord();

    placeOrderBtn.disabled = true;

    placeOrderBtn.querySelector("span").textContent =
        "Placing Order...";

    setTimeout(() => {
        orderHistory.unshift(order);

        saveOrders();

        bag = [];

        saveData();
        updateBagCount();
        renderCart();

        orderId.textContent = order.id;

        checkoutContent.style.display = "none";
        checkoutSuccess.classList.add("show");

        checkoutModal.scrollTop = 0;

        placeOrderBtn.disabled = false;

        placeOrderBtn.querySelector("span").textContent =
            "Place Order";

        showToast("Order placed successfully");
    }, 700);
}

function continueShoppingFromOrder() {
    checkoutSuccess.classList.remove("show");
    checkoutContent.style.display = "grid";

    closeCheckout();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function formatOrderDate(date) {
    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

function renderOrderHistory() {
    if (!orderHistory.length) {
        orderHistoryBody.innerHTML = `
            <div class="order-history-empty">
                <div class="order-history-empty-inner">
                    <i class="fa-solid fa-box-open"></i>
                    <h3>No orders yet</h3>
                    <p>
                        Your completed orders will appear here
                        with tracking details and order information.
                    </p>

                    <button
                        type="button"
                        id="startShoppingFromOrders"
                    >
                        START SHOPPING
                    </button>
                </div>
            </div>
        `;

        document
            .getElementById("startShoppingFromOrders")
            .addEventListener(
                "click",
                closeOrderHistory
            );

        return;
    }

    orderHistoryBody.innerHTML =
        orderHistory.map((order, index) => `
            <article class="order-card">

                <div class="order-card-top">
                    <div>
                        <div class="order-card-id">
                            ${order.id}
                        </div>

                        <div class="order-card-date">
                            ${formatOrderDate(order.date)}
                        </div>
                    </div>

                    <span class="order-status">
                        ${order.status}
                    </span>
                </div>

                <div class="order-items">

                    ${order.items.map(item => `
                        <div class="order-item">

                            <div class="order-item-image">
                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                >
                            </div>

                            <div>
                                <div class="order-item-brand">
                                    ${item.brand}
                                </div>

                                <div class="order-item-name">
                                    ${item.name}
                                </div>

                                <div class="order-item-meta">
                                    Size: ${item.size}
                                    · Qty: ${item.quantity}
                                </div>
                            </div>

                            <div class="order-item-price">
                                ${formatPrice(
                                    item.price *
                                    item.quantity
                                )}
                            </div>

                        </div>
                    `).join("")}

                </div>

                <div class="order-card-bottom">

                    <div>
                        <span class="order-total-label">
                            TOTAL PAID
                        </span>

                        <strong class="order-total">
                            ${formatPrice(order.total)}
                        </strong>
                    </div>

                    <button
                        type="button"
                        class="track-order-btn"
                        data-order-index="${index}"
                    >
                        TRACK ORDER
                    </button>

                </div>

                <div
                    class="order-tracking"
                    id="tracking-${index}"
                >

                    <div class="tracking-title">
                        Order Status
                    </div>

                    <div class="tracking-step completed">
                        <div class="tracking-dot">
                            <i class="fa-solid fa-check"></i>
                        </div>

                        <div>
                            <strong>
                                Order Confirmed
                            </strong>

                            <span>
                                Your order has been confirmed.
                            </span>
                        </div>
                    </div>

                    <div class="tracking-step completed">
                        <div class="tracking-dot">
                            <i class="fa-solid fa-check"></i>
                        </div>

                        <div>
                            <strong>
                                Preparing for Dispatch
                            </strong>

                            <span>
                                Your items are being packed.
                            </span>
                        </div>
                    </div>

                    <div class="tracking-step">
                        <div class="tracking-dot">
                            <i class="fa-solid fa-truck"></i>
                        </div>

                        <div>
                            <strong>
                                Out for Delivery
                            </strong>

                            <span>
                                Expected within 3–5 business days.
                            </span>
                        </div>
                    </div>

                    <div class="tracking-step">
                        <div class="tracking-dot">
                            <i class="fa-solid fa-house"></i>
                        </div>

                        <div>
                            <strong>
                                Delivered
                            </strong>

                            <span>
                                Your order will arrive at your address.
                            </span>
                        </div>
                    </div>

                </div>

            </article>
        `).join("");

    orderHistoryBody
        .querySelectorAll(".track-order-btn")
        .forEach(button => {

            button.addEventListener("click", () => {
                const tracking =
                    document.getElementById(
                        `tracking-${button.dataset.orderIndex}`
                    );

                tracking.classList.toggle("show");

                button.textContent =
                    tracking.classList.contains("show")
                        ? "HIDE TRACKING"
                        : "TRACK ORDER";
            });
        });
}

const orderHistoryOverlay =
    document.createElement("div");

orderHistoryOverlay.className =
    "order-history-overlay";

orderHistoryOverlay.id =
    "orderHistoryOverlay";

document.body.appendChild(
    orderHistoryOverlay
);

const orderHistoryDrawer =
    document.createElement("aside");

orderHistoryDrawer.className =
    "order-history-drawer";

orderHistoryDrawer.id =
    "orderHistoryDrawer";

orderHistoryDrawer.innerHTML = `
    <div class="order-history-header">

        <div>
            <span class="section-label">
                YOUR SHOPPING JOURNEY
            </span>

            <h2>My Orders</h2>
        </div>

        <button
            type="button"
            class="order-history-close"
            id="orderHistoryClose"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>

    </div>

    <div
        class="order-history-body"
        id="orderHistoryBody"
    ></div>
`;

document.body.appendChild(
    orderHistoryDrawer
);

const orderHistoryClose =
    document.getElementById(
        "orderHistoryClose"
    );

const orderHistoryBody =
    document.getElementById(
        "orderHistoryBody"
    );

function openOrderHistory() {
    renderOrderHistory();

    orderHistoryOverlay.classList.add("show");

    orderHistoryDrawer.classList.add("open");

    document.body.style.overflow = "hidden";
}

function closeOrderHistory() {
    orderHistoryOverlay.classList.remove("show");

    orderHistoryDrawer.classList.remove("open");

    if (
        !cartDrawer.classList.contains("open") &&
        !wishlistDrawer.classList.contains("open") &&
        !quickModal.classList.contains("show") &&
        !checkoutModal.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

checkoutBtn.addEventListener(
    "click",
    openCheckout
);

checkoutClose.addEventListener(
    "click",
    closeCheckout
);

checkoutOverlay.addEventListener(
    "click",
    closeCheckout
);

applyCoupon.addEventListener(
    "click",
    applyCouponCode
);

couponInput.addEventListener(
    "keydown",
    event => {
        if (event.key === "Enter") {
            applyCouponCode();
        }
    }
);

placeOrderBtn.addEventListener(
    "click",
    placeOrder
);

continueShoppingAfterOrder.addEventListener(
    "click",
    continueShoppingFromOrder
);

orderHistoryClose.addEventListener(
    "click",
    closeOrderHistory
);

orderHistoryOverlay.addEventListener(
    "click",
    closeOrderHistory
);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeQuickView();
        closeCart();
        closeWishlist();
        closeCheckout();
        closeOrderHistory();
        mobileMenu.classList.remove("show");
    }
});

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: .12
    }
);

document
    .querySelectorAll(".reveal")
    .forEach(element => {
        observer.observe(element);
    });

window.addEventListener("load", () => {
    setTimeout(() => {
        document
            .getElementById("pageLoader")
            .classList.add("hide");
    }, 700);

    updateWishlistCount();
    updateWishlistUI();
    updateBagCount();
    renderCart();
    applyFilters();
});