const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const pageLoader = $("#pageLoader");
const searchInput = $("#searchInput");
const clearSearch = $("#clearSearch");
const productsGrid = $("#productsGrid");
const resultCount = $("#resultCount");
const noResults = $("#noResults");
const noResultsReset = $("#noResultsReset");
const sortSelect = $("#sortSelect");
const filterToggle = $("#filterToggle");
const filterPanel = $("#filterPanel");
const filterCount = $("#filterCount");
const resetFilters = $("#resetFilters");
const activeFilters = $("#activeFilters");

const profileBtn = $("#profileBtn");
const wishlistBtn = $("#wishlistBtn");
const bagBtn = $("#bagBtn");

const wishlistCount = $("#wishlistCount");
const bagCount = $("#bagCount");
const mobileWishlistCount = $("#mobileWishlistCount");
const mobileBagCount = $("#mobileBagCount");

const cartOverlay = $("#cartOverlay");
const cartDrawer = $("#cartDrawer");
const cartClose = $("#cartClose");
const cartBody = $("#cartBody");
const cartSubtotal = $("#cartSubtotal");
const cartDelivery = $("#cartDelivery");
const cartTotal = $("#cartTotal");
const checkoutBtn = $("#checkoutBtn");

const wishlistOverlay = $("#wishlistOverlay");
const wishlistDrawer = $("#wishlistDrawer");
const wishlistClose = $("#wishlistClose");
const wishlistBody = $("#wishlistBody");

const quickModal = $("#quickModal");
const modalClose = $("#modalClose");
const modalImage = $("#modalImage");
const modalBrand = $("#modalBrand");
const modalName = $("#modalName");
const modalDescription = $("#modalDescription");
const modalPrice = $("#modalPrice");
const modalSizes = $("#modalSizes");
const modalQty = $("#modalQty");
const modalMinus = $("#modalMinus");
const modalPlus = $("#modalPlus");
const modalAdd = $("#modalAdd");

const checkoutOverlay = $("#checkoutOverlay");
const checkoutModal = $("#checkoutModal");
const checkoutClose = $("#checkoutClose");
const checkoutProducts = $("#checkoutProducts");
const checkoutItemsCount = $("#checkoutItemsCount");
const checkoutSubtotal = $("#checkoutSubtotal");
const checkoutDiscount = $("#checkoutDiscount");
const checkoutDelivery = $("#checkoutDelivery");
const checkoutTotal = $("#checkoutTotal");
const couponInput = $("#couponInput");
const applyCoupon = $("#applyCoupon");
const couponMessage = $("#couponMessage");
const placeOrderBtn = $("#placeOrderBtn");
const checkoutContent = $("#checkoutContent");
const checkoutSuccess = $("#checkoutSuccess");
const successOrderId = $("#successOrderId");
const continueShopping = $("#continueShopping");

const checkoutName = $("#checkoutName");
const checkoutMobile = $("#checkoutMobile");
const checkoutPin = $("#checkoutPin");
const checkoutCity = $("#checkoutCity");
const checkoutAddress = $("#checkoutAddress");

const loginOverlay = $("#loginOverlay");
const loginModal = $("#loginModal");
const loginClose = $("#loginClose");
const loginForm = $("#loginForm");
const loginEmail = $("#loginEmail");
const loginPassword = $("#loginPassword");
const loginMessage = $("#loginMessage");
const loginSubmit = $("#loginSubmit");
const togglePassword = $("#togglePassword");

const mobileMenuBtn = $("#mobileMenuBtn");
const mobileMenu = $("#mobileMenu");
const mobileHomeBtn = $("#mobileHomeBtn");
const mobileWishlistBtn = $("#mobileWishlistBtn");
const mobileBagBtn = $("#mobileBagBtn");
const mobileProfileBtn = $("#mobileProfileBtn");

let bag = JSON.parse(localStorage.getItem("myntraBag")) || [];
let wishlist = JSON.parse(localStorage.getItem("myntraWishlist")) || [];
let orderHistory = JSON.parse(localStorage.getItem("myntraOrders")) || [];
let currentUser = JSON.parse(localStorage.getItem("myntraUser")) || null;

let currentFilters = {
    category: "all",
    price: "all",
    rating: "all",
    discount: "all"
};

let appliedCoupon = "";
let checkoutDiscountValue = 0;
let quickProduct = null;
let quickSelectedSize = "";
let quickQuantity = 1;
let pendingCheckout = false;

function money(value) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
}

function saveBag() {
    localStorage.setItem("myntraBag", JSON.stringify(bag));
}

function saveWishlist() {
    localStorage.setItem("myntraWishlist", JSON.stringify(wishlist));
}

function saveOrders() {
    localStorage.setItem("myntraOrders", JSON.stringify(orderHistory));
}

function showToast(message) {
    const toast = $("#toast");
    const toastMessage = $("#toastMessage");

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function updateCounts() {
    const bagTotal = bag.reduce((sum, item) => sum + item.quantity, 0);

    bagCount.textContent = bagTotal;
    wishlistCount.textContent = wishlist.length;
    mobileBagCount.textContent = bagTotal;
    mobileWishlistCount.textContent = wishlist.length;

    bagCount.style.display = bagTotal ? "grid" : "none";
    wishlistCount.style.display = wishlist.length ? "grid" : "none";
    mobileBagCount.style.display = bagTotal ? "grid" : "none";
    mobileWishlistCount.style.display = wishlist.length ? "grid" : "none";
}

function updateLoginUI() {
    const label = profileBtn.querySelector("span");

    if (currentUser) {
        label.textContent = "Account";
        mobileProfileBtn.querySelector("span").textContent = "Account";
    } else {
        label.textContent = "Profile";
        mobileProfileBtn.querySelector("span").textContent = "Profile";
    }
}

function openLogin(showCheckout = false) {
    pendingCheckout = showCheckout;
    loginMessage.textContent = "";
    loginModal.classList.add("open");
    loginOverlay.classList.add("show");
    document.body.style.overflow = "hidden";

    setTimeout(() => loginEmail.focus(), 100);
}

function closeLogin() {
    loginModal.classList.remove("open");
    loginOverlay.classList.remove("show");

    if (
        !cartDrawer.classList.contains("open") &&
        !wishlistDrawer.classList.contains("open") &&
        !checkoutModal.classList.contains("open") &&
        !quickModal.classList.contains("show")
    ) {
        document.body.style.overflow = "";
    }
}

function loginUser() {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email) {
        loginMessage.textContent = "Please enter your email.";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        loginMessage.textContent = "Please enter a valid email.";
        return;
    }

    if (password.length < 6) {
        loginMessage.textContent = "Password must contain at least 6 characters.";
        return;
    }

    loginSubmit.disabled = true;
    loginSubmit.querySelector("span").textContent = "Signing in...";

    setTimeout(() => {
        currentUser = {
            email,
            name: email.split("@")[0]
        };

        localStorage.setItem("myntraUser", JSON.stringify(currentUser));

        loginSubmit.disabled = false;
        loginSubmit.querySelector("span").textContent = "Login & Continue";

        loginEmail.value = "";
        loginPassword.value = "";

        updateLoginUI();
        closeLogin();

        if (pendingCheckout) {
            pendingCheckout = false;
            setTimeout(openCheckout, 200);
        } else {
            showToast("Welcome back to Myntra");
        }
    }, 600);
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem("myntraUser");
    closeOrderHistory();
    updateLoginUI();
    showToast("You have been logged out");
}

function getProduct(card) {
    return {
        name: card.dataset.name,
        brand: card.dataset.brand,
        category: card.dataset.category,
        price: Number(card.dataset.price),
        rating: Number(card.dataset.rating),
        discount: Number(card.dataset.discount),
        image: card.dataset.image
    };
}

function getProductByName(name) {
    const card = $$(".product-card").find(item => item.dataset.name === name);
    return card ? getProduct(card) : null;
}

function addToBag(product, size = "M", quantity = 1) {
    const existing = bag.find(item => item.name === product.name && item.size === size);

    if (existing) {
        existing.quantity += quantity;
    } else {
        bag.push({
            ...product,
            size,
            quantity
        });
    }

    saveBag();
    updateCounts();
    renderCart();
    showToast(`${product.name} added to bag`);
}

function removeFromBag(index) {
    bag.splice(index, 1);
    saveBag();
    updateCounts();
    renderCart();
}

function changeBagQuantity(index, change) {
    bag[index].quantity += change;

    if (bag[index].quantity <= 0) {
        bag.splice(index, 1);
    }

    saveBag();
    updateCounts();
    renderCart();
}

function renderCart() {
    if (!bag.length) {
        cartBody.innerHTML = `
            <div class="empty-state">
                <div>
                    <i class="fa-solid fa-bag-shopping"></i>
                    <h3>Your bag is empty</h3>
                    <p>Add something beautiful to your bag.</p>
                </div>
            </div>
        `;

        cartSubtotal.textContent = "₹0";
        cartDelivery.textContent = "FREE";
        cartTotal.textContent = "₹0";
        return;
    }

    cartBody.innerHTML = bag.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div class="cart-item-content">
                <h3>${item.brand}</h3>
                <p>${item.name}</p>
                <p>Size: ${item.size}</p>
                <div class="cart-item-price">${money(item.price)}</div>

                <div class="cart-item-actions">
                    <button onclick="changeBagQuantity(${index},-1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeBagQuantity(${index},1)">+</button>
                    <button class="remove-item" onclick="removeFromBag(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    const subtotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal >= 999 ? 0 : 99;

    cartSubtotal.textContent = money(subtotal);
    cartDelivery.textContent = delivery ? money(delivery) : "FREE";
    cartTotal.textContent = money(subtotal + delivery);
}

function openCart() {
    renderCart();
    cartOverlay.classList.add("show");
    cartDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartOverlay.classList.remove("show");
    cartDrawer.classList.remove("open");

    if (
        !wishlistDrawer.classList.contains("open") &&
        !checkoutModal.classList.contains("open") &&
        !loginModal.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function toggleWishlist(product) {
    const index = wishlist.findIndex(item => item.name === product.name);

    if (index >= 0) {
        wishlist.splice(index, 1);
        showToast("Removed from wishlist");
    } else {
        wishlist.push(product);
        showToast("Added to wishlist");
    }

    saveWishlist();
    updateCounts();
    updateWishlistButtons();
    renderWishlist();
}

function updateWishlistButtons() {
    $$(".product-card").forEach(card => {
        const product = getProduct(card);
        const button = card.querySelector(".wishlist-product");
        const exists = wishlist.some(item => item.name === product.name);

        button.classList.toggle("active", exists);
        button.innerHTML = exists
            ? '<i class="fa-solid fa-heart"></i>'
            : '<i class="fa-regular fa-heart"></i>';
    });
}

function renderWishlist() {
    if (!wishlist.length) {
        wishlistBody.innerHTML = `
            <div class="empty-state">
                <div>
                    <i class="fa-regular fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save products you love for later.</p>
                </div>
            </div>
        `;
        return;
    }

    wishlistBody.innerHTML = wishlist.map((item, index) => `
        <div class="wishlist-item">
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div class="wishlist-item-content">
                <h3>${item.brand}</h3>
                <p>${item.name}</p>
                <strong>${money(item.price)}</strong>

                <div class="wishlist-actions">
                    <button onclick="addWishlistToBag(${index})">ADD TO BAG</button>
                    <button onclick="removeWishlist(${index})">REMOVE</button>
                </div>
            </div>
        </div>
    `).join("");
}

function addWishlistToBag(index) {
    addToBag(wishlist[index], "M", 1);
}

function removeWishlist(index) {
    wishlist.splice(index, 1);
    saveWishlist();
    updateCounts();
    updateWishlistButtons();
    renderWishlist();
    showToast("Removed from wishlist");
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
        !checkoutModal.classList.contains("open") &&
        !loginModal.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function openQuickView(card) {
    quickProduct = getProduct(card);
    quickQuantity = 1;
    quickSelectedSize = "";

    modalImage.src = quickProduct.image;
    modalBrand.textContent = quickProduct.brand;
    modalName.textContent = quickProduct.name;
    modalDescription.textContent = "Premium selected fashion piece designed for everyday comfort, style and effortless looks.";
    modalPrice.textContent = money(quickProduct.price);
    modalQty.textContent = "1";

    const sizes = [...card.querySelectorAll(".size-row button")].map(button => button.textContent);

    modalSizes.innerHTML = sizes.map(size => `
        <button onclick="selectQuickSize(this,'${size}')">${size}</button>
    `).join("");

    quickModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function selectQuickSize(button, size) {
    $$("#modalSizes button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    quickSelectedSize = size;
}

function closeQuickView() {
    quickModal.classList.remove("show");

    if (
        !cartDrawer.classList.contains("open") &&
        !wishlistDrawer.classList.contains("open") &&
        !checkoutModal.classList.contains("open") &&
        !loginModal.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function renderCheckout() {
    if (!bag.length) {
        checkoutProducts.innerHTML = "";
        return;
    }

    checkoutProducts.innerHTML = bag.map(item => `
        <div class="checkout-product">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <strong>${item.brand}</strong>
                <span>${item.name}</span>
                <span>Size ${item.size} · Qty ${item.quantity}</span>
            </div>
            <div class="checkout-product-price">${money(item.price * item.quantity)}</div>
        </div>
    `).join("");

    const itemCount = bag.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal >= 999 ? 0 : 99;

    checkoutItemsCount.textContent = `${itemCount} items`;
    checkoutSubtotal.textContent = money(subtotal);
    checkoutDiscount.textContent = checkoutDiscountValue ? `− ${money(checkoutDiscountValue)}` : "− ₹0";
    checkoutDelivery.textContent = delivery ? money(delivery) : "FREE";
    checkoutTotal.textContent = money(subtotal - checkoutDiscountValue + delivery);
}

function resetCheckout() {
    appliedCoupon = "";
    checkoutDiscountValue = 0;

    couponInput.value = "";
    couponMessage.textContent = "";

    checkoutSuccess.classList.remove("show");
    checkoutContent.style.display = "grid";

    $$("#checkoutModal input[name='paymentMethod']").forEach(input => {
        input.checked = false;
    });

    renderCheckout();
}

function openCheckout() {
    if (!bag.length) {
        showToast("Your bag is empty");
        return;
    }

    if (!currentUser) {
        closeCart();
        openLogin(true);
        return;
    }

    closeCart();
    resetCheckout();

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
        !loginModal.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function applyCouponCode() {
    const code = couponInput.value.trim().toUpperCase();

    if (code === "MYNTRA10") {
        const subtotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (subtotal < 500) {
            couponMessage.textContent = "Minimum order value is ₹500.";
            couponMessage.style.color = "#e33";
            return;
        }

        appliedCoupon = code;
        checkoutDiscountValue = Math.round(subtotal * 0.1);

        couponMessage.textContent = "10% discount applied successfully.";
        couponMessage.style.color = "#168d35";

        renderCheckout();
        return;
    }

    appliedCoupon = "";
    checkoutDiscountValue = 0;
    couponMessage.textContent = "Invalid coupon code.";
    couponMessage.style.color = "#e33";
    renderCheckout();
}

function validateCheckout() {
    if (!checkoutName.value.trim()) {
        showToast("Enter your full name");
        checkoutName.focus();
        return false;
    }

    if (!/^\d{10}$/.test(checkoutMobile.value.trim())) {
        showToast("Enter a valid 10-digit mobile number");
        checkoutMobile.focus();
        return false;
    }

    if (!/^\d{6}$/.test(checkoutPin.value.trim())) {
        showToast("Enter a valid 6-digit PIN code");
        checkoutPin.focus();
        return false;
    }

    if (!checkoutCity.value.trim()) {
        showToast("Enter your city");
        checkoutCity.focus();
        return false;
    }

    if (!checkoutAddress.value.trim()) {
        showToast("Enter your complete address");
        checkoutAddress.focus();
        return false;
    }

    const payment = document.querySelector("input[name='paymentMethod']:checked");

    if (!payment) {
        showToast("Select a payment method");
        return false;
    }

    return true;
}

function createOrderRecord() {
    const subtotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal >= 999 ? 0 : 99;
    const total = subtotal - checkoutDiscountValue + delivery;

    return {
        id: `MYN${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleDateString("en-IN", {
            day:"2-digit",
            month:"short",
            year:"numeric"
        }),
        userEmail: currentUser.email,
        items: JSON.parse(JSON.stringify(bag)),
        subtotal,
        discount: checkoutDiscountValue,
        delivery,
        total,
        payment: document.querySelector("input[name='paymentMethod']:checked").value,
        customer: {
            name: checkoutName.value.trim(),
            mobile: checkoutMobile.value.trim(),
            pin: checkoutPin.value.trim(),
            city: checkoutCity.value.trim(),
            address: checkoutAddress.value.trim()
        }
    };
}

function placeOrder() {
    if (!currentUser) {
        closeCheckout();
        openLogin(true);
        return;
    }

    if (!validateCheckout()) {
        return;
    }

    const order = createOrderRecord();

    orderHistory.unshift(order);
    saveOrders();

    successOrderId.textContent = order.id;

    bag = [];
    saveBag();
    updateCounts();
    renderCart();

    checkoutContent.style.display = "none";
    checkoutSuccess.classList.add("show");

    showToast("Order placed successfully");
}

function renderOrderHistory() {
    const visibleOrders = orderHistory.filter(order =>
        !order.userEmail || order.userEmail === currentUser.email
    );

    if (!visibleOrders.length) {
        orderHistoryBody.innerHTML = `
            <div class="empty-state">
                <div>
                    <i class="fa-solid fa-box-open"></i>
                    <h3>No orders yet</h3>
                    <p>Your placed orders will appear here.</p>
                </div>
            </div>
        `;
        return;
    }

    orderHistoryBody.innerHTML = visibleOrders.map((order, index) => `
        <article class="order-card">
            <div class="order-card-top">
                <div>
                    <div class="order-card-id">${order.id}</div>
                    <div class="order-card-date">${order.date}</div>
                </div>
                <span class="order-status">CONFIRMED</span>
            </div>

            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img class="order-item-image" src="${item.image}" alt="${item.name}">
                        <div>
                            <strong>${item.brand}</strong>
                            <span>${item.name}</span>
                            <span>Size ${item.size} · Qty ${item.quantity}</span>
                        </div>
                        <div class="order-item-price">${money(item.price * item.quantity)}</div>
                    </div>
                `).join("")}
            </div>

            <div class="order-meta">
                <div>
                    <span>Total</span>
                    <strong>${money(order.total)}</strong>
                </div>
                <div>
                    <span>Payment</span>
                    <strong>${order.payment}</strong>
                </div>
                <div>
                    <span>Delivery</span>
                    <strong>3–5 Days</strong>
                </div>
            </div>

            <button class="track-order-btn" data-order-index="${index}">
                TRACK ORDER
            </button>

            <div class="tracking" id="tracking-${index}">
                <div class="tracking-step completed">
                    <div class="tracking-dot"><i class="fa-solid fa-check"></i></div>
                    <div>
                        <strong>Order Confirmed</strong>
                        <span>Your order has been confirmed.</span>
                    </div>
                </div>

                <div class="tracking-step completed">
                    <div class="tracking-dot"><i class="fa-solid fa-box"></i></div>
                    <div>
                        <strong>Preparing for Dispatch</strong>
                        <span>Your items are being packed.</span>
                    </div>
                </div>

                <div class="tracking-step">
                    <div class="tracking-dot"><i class="fa-solid fa-truck"></i></div>
                    <div>
                        <strong>Out for Delivery</strong>
                        <span>Expected within 3–5 business days.</span>
                    </div>
                </div>

                <div class="tracking-step">
                    <div class="tracking-dot"><i class="fa-solid fa-house"></i></div>
                    <div>
                        <strong>Delivered</strong>
                        <span>Your order will arrive at your address.</span>
                    </div>
                </div>
            </div>
        </article>
    `).join("");

    $$(".track-order-btn").forEach(button => {
        button.addEventListener("click", () => {
            const tracking = document.getElementById(`tracking-${button.dataset.orderIndex}`);
            tracking.classList.toggle("show");
            button.textContent = tracking.classList.contains("show")
                ? "HIDE TRACKING"
                : "TRACK ORDER";
        });
    });
}

const orderHistoryOverlay = document.createElement("div");
orderHistoryOverlay.className = "order-history-overlay";
document.body.appendChild(orderHistoryOverlay);

const orderHistoryDrawer = document.createElement("aside");
orderHistoryDrawer.className = "order-history-drawer";

orderHistoryDrawer.innerHTML = `
    <div class="order-history-header">
        <div>
            <span class="section-label">YOUR SHOPPING JOURNEY</span>
            <h2>My Orders</h2>
        </div>

        <button class="order-logout" id="orderLogout">
            <i class="fa-solid fa-right-from-bracket"></i>
            Logout
        </button>

        <button class="order-history-close" id="orderHistoryClose">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <div class="order-history-body" id="orderHistoryBody"></div>
`;

document.body.appendChild(orderHistoryDrawer);

const orderHistoryClose = $("#orderHistoryClose");
const orderHistoryBody = $("#orderHistoryBody");
const orderLogout = $("#orderLogout");

function openOrderHistory() {
    if (!currentUser) {
        openLogin(false);
        return;
    }

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
        !checkoutModal.classList.contains("open") &&
        !loginModal.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function applyFilters() {
    const search = searchInput.value.trim().toLowerCase();

    let cards = $$(".product-card");

    cards.forEach(card => {
        const product = getProduct(card);

        let visible = true;

        if (
            currentFilters.category !== "all" &&
            product.category !== currentFilters.category
        ) {
            visible = false;
        }

        if (currentFilters.price === "under1000" && product.price >= 1000) {
            visible = false;
        }

        if (
            currentFilters.price === "1000-2000" &&
            (product.price < 1000 || product.price > 2000)
        ) {
            visible = false;
        }

        if (currentFilters.price === "above2000" && product.price <= 2000) {
            visible = false;
        }

        if (
            currentFilters.rating !== "all" &&
            product.rating < Number(currentFilters.rating)
        ) {
            visible = false;
        }

        if (
            currentFilters.discount !== "all" &&
            product.discount < Number(currentFilters.discount)
        ) {
            visible = false;
        }

        const searchable = `${product.name} ${product.brand}`.toLowerCase();

        if (search && !searchable.includes(search)) {
            visible = false;
        }

        card.style.display = visible ? "" : "none";
    });

    const visibleCards = cards.filter(card => card.style.display !== "none");

    resultCount.textContent = visibleCards.length;
    noResults.classList.toggle("show", visibleCards.length === 0);

    updateFilterUI();
}

function updateFilterUI() {
    const values = Object.values(currentFilters).filter(value => value !== "all");
    filterCount.textContent = values.length;

    $$(".filter-option").forEach(button => {
        const type = button.dataset.filter;
        const value = button.dataset.value;

        button.classList.toggle(
            "active",
            currentFilters[type] === value
        );
    });

    activeFilters.innerHTML = values.map(value => `
        <span>${value}</span>
    `).join("");
}

function sortProducts() {
    const cards = $$(".product-card");

    const sorted = [...cards].sort((a,b) => {
        const A = getProduct(a);
        const B = getProduct(b);

        if (sortSelect.value === "price-low") {
            return A.price - B.price;
        }

        if (sortSelect.value === "price-high") {
            return B.price - A.price;
        }

        if (sortSelect.value === "rating") {
            return B.rating - A.rating;
        }

        if (sortSelect.value === "discount") {
            return B.discount - A.discount;
        }

        return 0;
    });

    sorted.forEach(card => productsGrid.appendChild(card));
    applyFilters();
}

function resetAllFilters() {
    currentFilters = {
        category:"all",
        price:"all",
        rating:"all",
        discount:"all"
    };

    searchInput.value = "";
    sortSelect.value = "relevance";

    applyFilters();
}

$$(".filter-option").forEach(button => {
    button.addEventListener("click", () => {
        currentFilters[button.dataset.filter] = button.dataset.value;
        applyFilters();
    });
});

filterToggle.addEventListener("click", () => {
    filterPanel.classList.toggle("open");
});

resetFilters.addEventListener("click", resetAllFilters);
noResultsReset.addEventListener("click", resetAllFilters);

sortSelect.addEventListener("change", sortProducts);

searchInput.addEventListener("input", applyFilters);

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters();
    searchInput.focus();
});

$$(".desktop-nav a, .mobile-menu a, .vibe-card, .occasion-card").forEach(link => {
    link.addEventListener("click", event => {
        const category = link.dataset.category;

        if (category) {
            currentFilters.category = category;
            applyFilters();
        }

        mobileMenu.classList.remove("show");
    });
});

$$(".product-card").forEach(card => {
    card.querySelector(".wishlist-product").addEventListener("click", () => {
        toggleWishlist(getProduct(card));
    });

    card.querySelector(".quick-view").addEventListener("click", () => {
        openQuickView(card);
    });

    card.querySelectorAll(".size-row button").forEach(button => {
        button.addEventListener("click", () => {
            card.querySelectorAll(".size-row button").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
        });
    });

    const minus = card.querySelector(".qty-minus");
    const plus = card.querySelector(".qty-plus");
    const quantity = card.querySelector(".qty-value");

    minus.addEventListener("click", () => {
        const value = Math.max(1, Number(quantity.textContent) - 1);
        quantity.textContent = value;
    });

    plus.addEventListener("click", () => {
        quantity.textContent = Number(quantity.textContent) + 1;
    });

    card.querySelector(".add-bag").addEventListener("click", () => {
        const selectedSize = card.querySelector(".size-row button.active");
        const size = selectedSize ? selectedSize.textContent : card.querySelector(".size-row button").textContent;
        const quantityValue = Number(quantity.textContent);

        addToBag(getProduct(card), size, quantityValue);
        quantity.textContent = "1";
    });
});

wishlistBtn.addEventListener("click", openWishlist);
wishlistClose.addEventListener("click", closeWishlist);
wishlistOverlay.addEventListener("click", closeWishlist);

bagBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", closeCheckout);

applyCoupon.addEventListener("click", applyCouponCode);

couponInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        applyCouponCode();
    }
});

placeOrderBtn.addEventListener("click", placeOrder);

continueShopping.addEventListener("click", () => {
    closeCheckout();
    window.location.hash = "products";
});

modalClose.addEventListener("click", closeQuickView);

quickModal.addEventListener("click", event => {
    if (event.target === quickModal) {
        closeQuickView();
    }
});

modalMinus.addEventListener("click", () => {
    quickQuantity = Math.max(1, quickQuantity - 1);
    modalQty.textContent = quickQuantity;
});

modalPlus.addEventListener("click", () => {
    quickQuantity++;
    modalQty.textContent = quickQuantity;
});

modalAdd.addEventListener("click", () => {
    if (!quickSelectedSize) {
        showToast("Please select a size");
        return;
    }

    addToBag(quickProduct, quickSelectedSize, quickQuantity);
    closeQuickView();
});

profileBtn.addEventListener("click", () => {
    if (currentUser) {
        openOrderHistory();
    } else {
        openLogin(false);
    }
});

mobileProfileBtn.addEventListener("click", () => {
    if (currentUser) {
        openOrderHistory();
    } else {
        openLogin(false);
    }
});

mobileHomeBtn.addEventListener("click", () => {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});

mobileWishlistBtn.addEventListener("click", openWishlist);
mobileBagBtn.addEventListener("click", openCart);

loginClose.addEventListener("click", closeLogin);
loginOverlay.addEventListener("click", closeLogin);

loginForm.addEventListener("submit", event => {
    event.preventDefault();
    loginUser();
});

togglePassword.addEventListener("click", () => {
    const hidden = loginPassword.type === "password";

    loginPassword.type = hidden ? "text" : "password";

    togglePassword.innerHTML = hidden
        ? '<i class="fa-regular fa-eye-slash"></i>'
        : '<i class="fa-regular fa-eye"></i>';
});

orderLogout.addEventListener("click", logoutUser);
orderHistoryClose.addEventListener("click", closeOrderHistory);
orderHistoryOverlay.addEventListener("click", closeOrderHistory);

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeLogin();
        closeQuickView();
        closeCart();
        closeWishlist();
        closeCheckout();
        closeOrderHistory();
        mobileMenu.classList.remove("show");
    }
});

window.addEventListener("load", () => {
    setTimeout(() => {
        pageLoader.classList.add("hide");
    }, 700);

    updateCounts();
    updateLoginUI();
    updateWishlistButtons();
    renderCart();
    applyFilters();
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold:.08
});

$$(".reveal").forEach(element => observer.observe(element));