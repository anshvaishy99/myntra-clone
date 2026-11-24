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

const tabLogin = $("#tabLogin");
const tabRegister = $("#tabRegister");
const authLabel = $("#authLabel");
const authTitle = $("#authTitle");
const authSubtitle = $("#authSubtitle");
const registerForm = $("#registerForm");
const regName = $("#regName");
const regMobile = $("#regMobile");
const regEmail = $("#regEmail");
const regPassword = $("#regPassword");
const regConfirm = $("#regConfirm");
const registerMessage = $("#registerMessage");
const registerSubmit = $("#registerSubmit");

const accountOverlay = $("#accountOverlay");
const accountDrawer = $("#accountDrawer");
const accountClose = $("#accountClose");
const accountAvatar = $("#accountAvatar");
const accountHeadName = $("#accountHeadName");
const accountHeadEmail = $("#accountHeadEmail");
const accStatOrders = $("#accStatOrders");
const accStatWishlist = $("#accStatWishlist");
const accStatBag = $("#accStatBag");
const accountForm = $("#accountForm");
const accountName = $("#accountName");
const accountMobile = $("#accountMobile");
const accountEmail = $("#accountEmail");
const accountMessage = $("#accountMessage");
const accountGender = $("#accountGender");
const accountDob = $("#accountDob");
const accountOrdersBtn = $("#accountOrdersBtn");
const accountWishlistBtn = $("#accountWishlistBtn");
const accountBagBtn = $("#accountBagBtn");
const accountLogoutBtn = $("#accountLogoutBtn");
const modalRatingBox = $("#modalRatingBox");
const modalRatingNote = $("#modalRatingNote");

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
let users = JSON.parse(localStorage.getItem("myntraUsers")) || [];

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

function bump(...elements) {
    elements.forEach(element => {
        element.classList.remove("bump");
        void element.offsetWidth;
        element.classList.add("bump");
    });
}

function flyToBag(source) {
    if (!source || !source.getBoundingClientRect || typeof source.animate !== "function") {
        return;
    }

    const target = bagBtn.offsetWidth ? bagBtn : mobileBagBtn;
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();

    if (!from.width || !to.width) {
        return;
    }

    const ghost = document.createElement("img");
    const size = 90;

    ghost.src = source.currentSrc || source.src;
    ghost.className = "fly-ghost";
    ghost.style.width = `${size}px`;
    ghost.style.height = `${size}px`;
    ghost.style.left = `${from.left + from.width / 2 - size / 2}px`;
    ghost.style.top = `${from.top + from.height / 2 - size / 2}px`;
    document.body.appendChild(ghost);

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    const animation = ghost.animate([
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx * 0.55}px,${dy * 0.35 - 60}px) scale(.7)`, opacity: .95, offset: .55 },
        { transform: `translate(${dx}px,${dy}px) scale(.1)`, opacity: .2 }
    ], { duration: 750, easing: "cubic-bezier(.55,.05,.35,1)" });

    animation.onfinish = () => {
        ghost.remove();
        bump(target);
    };
}

function money(value) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
}

function saveBag() {
    localStorage.setItem("myntraBag", JSON.stringify(bag));
}

function saveWishlist() {
    localStorage.setItem("myntraWishlist", JSON.stringify(wishlist));
}

function saveUsers() {
    localStorage.setItem("myntraUsers", JSON.stringify(users));
}

function saveSession() {
    localStorage.setItem("myntraUser", JSON.stringify(currentUser));
}

function hashPassword(value) {
    let hash = 5381;

    for (let i = 0; i < value.length; i++) {
        hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
    }

    return `h${hash}`;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    const previousBag = Number(bagCount.textContent) || 0;
    const previousWishlist = Number(wishlistCount.textContent) || 0;
    const bagTotal = bag.reduce((sum, item) => sum + item.quantity, 0);

    bagCount.textContent = bagTotal;
    wishlistCount.textContent = wishlist.length;
    mobileBagCount.textContent = bagTotal;
    mobileWishlistCount.textContent = wishlist.length;

    bagCount.style.display = bagTotal ? "grid" : "none";
    wishlistCount.style.display = wishlist.length ? "grid" : "none";
    mobileBagCount.style.display = bagTotal ? "grid" : "none";
    mobileWishlistCount.style.display = wishlist.length ? "grid" : "none";

    if (bagTotal !== previousBag) {
        bump(bagCount, mobileBagCount);
    }

    if (wishlist.length !== previousWishlist) {
        bump(wishlistCount, mobileWishlistCount);
    }
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

function showAuthTab(mode) {
    const isRegister = mode === "register";

    tabLogin.classList.toggle("active", !isRegister);
    tabRegister.classList.toggle("active", isRegister);

    loginForm.hidden = isRegister;
    registerForm.hidden = !isRegister;

    authLabel.textContent = isRegister ? "JOIN MYNTRA" : "WELCOME BACK";
    authTitle.textContent = isRegister ? "Create your account" : "Sign in to continue";
    authSubtitle.textContent = isRegister
        ? "Create an account to save your details and place orders."
        : "Login is required before placing an order.";

    loginMessage.textContent = "";
    registerMessage.textContent = "";

    setTimeout(() => (isRegister ? regName : loginEmail).focus(), 100);
}

function openLogin(showCheckout = false, mode = "login") {
    pendingCheckout = showCheckout;
    loginMessage.textContent = "";
    registerMessage.textContent = "";
    showAuthTab(mode);
    loginModal.classList.add("open");
    loginOverlay.classList.add("show");
    document.body.style.overflow = "hidden";

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

function startSession(user, message) {
    currentUser = {
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        address: user.address || "",
        city: user.city || "",
        pin: user.pin || "",
        photo: user.photo || "",
        gender: user.gender || "",
        dob: user.dob || "",
        joinedAt: user.joinedAt || null,
        addresses: Array.isArray(user.addresses) ? user.addresses : undefined,
        prefs: user.prefs || { orders: true, offers: false }
    };

    saveSession();
    updateLoginUI();
    closeLogin();

    if (pendingCheckout) {
        pendingCheckout = false;
        setTimeout(openCheckout, 200);
    } else {
        showToast(message);
    }
}

function loginUser() {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email) {
        loginMessage.textContent = "Please enter your email.";
        return;
    }

    if (!isValidEmail(email)) {
        loginMessage.textContent = "Please enter a valid email.";
        return;
    }

    if (password.length < 6) {
        loginMessage.textContent = "Password must contain at least 6 characters.";
        return;
    }

    const user = users.find(item => item.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        loginMessage.textContent = "No account found with this email. Please create an account.";
        return;
    }

    if (user.password !== hashPassword(password)) {
        loginMessage.textContent = "Incorrect password. Please try again.";
        return;
    }

    loginSubmit.disabled = true;
    loginSubmit.querySelector("span").textContent = "Signing in...";

    setTimeout(() => {
        loginSubmit.disabled = false;
        loginSubmit.querySelector("span").textContent = "Login & Continue";

        loginEmail.value = "";
        loginPassword.value = "";

        startSession(user, `Welcome back, ${user.name.split(" ")[0]}`);
    }, 600);
}

function registerUser() {
    const name = regName.value.trim();
    const mobile = regMobile.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value;
    const confirm = regConfirm.value;

    if (name.length < 2) {
        registerMessage.textContent = "Please enter your full name.";
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        registerMessage.textContent = "Enter a valid 10-digit mobile number.";
        return;
    }

    if (!isValidEmail(email)) {
        registerMessage.textContent = "Please enter a valid email.";
        return;
    }

    if (password.length < 6) {
        registerMessage.textContent = "Password must contain at least 6 characters.";
        return;
    }

    if (password !== confirm) {
        registerMessage.textContent = "Passwords do not match.";
        return;
    }

    if (users.some(item => item.email.toLowerCase() === email.toLowerCase())) {
        registerMessage.textContent = "An account with this email already exists. Please login.";
        return;
    }

    registerSubmit.disabled = true;
    registerSubmit.querySelector("span").textContent = "Creating account...";

    setTimeout(() => {
        const user = {
            name,
            mobile,
            email,
            password: hashPassword(password),
            address: "",
            city: "",
            pin: "",
            photo: "",
            gender: "",
            dob: "",
            joinedAt: Date.now(),
            addresses: [],
            prefs: { orders: true, offers: false }
        };

        users.push(user);
        saveUsers();

        registerSubmit.disabled = false;
        registerSubmit.querySelector("span").textContent = "Create Account";

        registerForm.reset();

        startSession(user, `Account created. Welcome, ${name.split(" ")[0]}`);
    }, 600);
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem("myntraUser");
    closeOrderHistory();
    closeAccount();
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

        const card = $$(".product-card").find(item => item.dataset.name === product.name);
        const heart = card ? card.querySelector(".wishlist-product") : null;

        if (heart) {
            heart.classList.remove("pop");
            void heart.offsetWidth;
            heart.classList.add("pop");
        }
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

function getFirstSize(name) {
    const card = $$(".product-card").find(item => item.dataset.name === name);
    const button = card ? card.querySelector(".size-row button") : null;
    return button ? button.textContent : "M";
}

function addWishlistToBag(index) {
    const item = wishlist[index];
    addToBag(item, getFirstSize(item.name), 1);
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
    modalRatingBox.innerHTML = `${quickProduct.rating} <i class="fa-solid fa-star"></i>`;
    modalRatingNote.textContent = quickProduct.discount ? `${quickProduct.discount}% off · Highly rated` : "Highly rated product";

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
    prefillCheckout();

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
        placedAt: Date.now(),
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
    rememberAddress(order.customer);

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

function getUserOrders() {
    if (!currentUser) {
        return [];
    }

    return orderHistory.filter(order => !order.userEmail || order.userEmail === currentUser.email);
}

function getUserRecord() {
    if (!currentUser) {
        return null;
    }

    return users.find(item => item.email.toLowerCase() === currentUser.email.toLowerCase()) || null;
}

function updateProfile(patch) {
    currentUser = { ...currentUser, ...patch };
    saveSession();

    const record = getUserRecord();

    if (record) {
        Object.assign(record, patch);
        saveUsers();
    }
}

function getAddresses() {
    if (!currentUser) {
        return [];
    }

    if (Array.isArray(currentUser.addresses)) {
        return currentUser.addresses;
    }

    if (currentUser.address) {
        return [{
            id: "ADRLEGACY",
            label: "Home",
            name: currentUser.name || "",
            mobile: currentUser.mobile || "",
            pin: currentUser.pin || "",
            city: currentUser.city || "",
            address: currentUser.address,
            isDefault: true
        }];
    }

    return [];
}

function saveAddresses(list) {
    if (list.length && !list.some(item => item.isDefault)) {
        list[0].isDefault = true;
    }

    const main = list.find(item => item.isDefault) || list[0];

    updateProfile({
        addresses: list,
        address: main ? main.address : "",
        city: main ? main.city : "",
        pin: main ? main.pin : ""
    });
}

function showAccountTab(tab) {
    $$(".account-tab").forEach(button => {
        button.classList.toggle("active", button.dataset.accountTab === tab);
    });

    $$(".account-panel").forEach(panel => {
        panel.hidden = panel.dataset.accountPanel !== tab;
    });

    $(".account-body").scrollTop = 0;
}

function renderAccount() {
    if (!currentUser) {
        return;
    }

    const name = currentUser.name || currentUser.email.split("@")[0];
    const orders = getUserOrders();
    const addresses = getAddresses();
    const avatar = $("#accountAvatar");

    if (currentUser.photo) {
        avatar.style.backgroundImage = `url(${currentUser.photo})`;
        avatar.textContent = "";
        avatar.classList.add("has-photo");
    } else {
        avatar.style.backgroundImage = "";
        avatar.textContent = name.trim().charAt(0).toUpperCase();
        avatar.classList.remove("has-photo");
    }

    $("#avatarRemove").hidden = !currentUser.photo;
    accountHeadName.textContent = name;
    accountHeadEmail.textContent = currentUser.email;

    $("#accountMember").textContent = currentUser.joinedAt
        ? `Member since ${new Date(currentUser.joinedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
        : "Valued customer";

    accStatOrders.textContent = orders.length;
    accStatWishlist.textContent = wishlist.length;
    accStatBag.textContent = bag.reduce((sum, item) => sum + item.quantity, 0);
    $("#accStatSpent").textContent = money(orders.reduce((sum, order) => sum + order.total, 0));

    const checks = [
        ["profile photo", !!currentUser.photo],
        ["mobile number", !!currentUser.mobile],
        ["date of birth", !!currentUser.dob],
        ["gender", !!currentUser.gender],
        ["a saved address", addresses.length > 0]
    ];
    const missing = checks.filter(item => !item[1]).map(item => item[0]);
    const percent = Math.round(((2 + checks.length - missing.length) / (2 + checks.length)) * 100);

    $("#profilePercent").textContent = `${percent}%`;
    $("#profileBar").style.width = `${percent}%`;
    $("#profileMissing").textContent = missing.length
        ? `Add ${missing.join(", ")} to complete your profile.`
        : "Your profile is complete.";

    const recent = $("#accountRecent");

    recent.innerHTML = orders.length
        ? orders.slice(0, 3).map(order => {
            const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return `
                <button type="button" class="recent-order" data-open-orders>
                    <div>
                        <strong>${escapeHtml(order.id)}</strong>
                        <span>${escapeHtml(order.date)} · ${count} item${count === 1 ? "" : "s"}</span>
                    </div>
                    <div>
                        <b>${money(order.total)}</b>
                        <em>Confirmed</em>
                    </div>
                </button>
            `;
        }).join("")
        : `<p class="acc-empty">You have not placed any orders yet.</p>`;

    accountName.value = name;
    accountMobile.value = currentUser.mobile || "";
    accountEmail.value = currentUser.email;
    accountGender.value = currentUser.gender || "";
    accountDob.value = currentUser.dob || "";
    accountMessage.textContent = "";

    const prefs = currentUser.prefs || { orders: true, offers: false };

    $("#prefOrders").checked = !!prefs.orders;
    $("#prefOffers").checked = !!prefs.offers;

    renderAddresses();
}

function openAccount(tab) {
    if (!currentUser) {
        openLogin(false);
        return;
    }

    renderAccount();
    showAccountTab(typeof tab === "string" ? tab : "overview");
    closeAddressForm();
    accountOverlay.classList.add("show");
    accountDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeAccount() {
    accountOverlay.classList.remove("show");
    accountDrawer.classList.remove("open");

    if (
        !cartDrawer.classList.contains("open") &&
        !wishlistDrawer.classList.contains("open") &&
        !checkoutModal.classList.contains("open") &&
        !loginModal.classList.contains("open") &&
        !orderHistoryDrawer.classList.contains("open") &&
        !quickModal.classList.contains("show")
    ) {
        document.body.style.overflow = "";
    }
}

function saveAccount() {
    const name = accountName.value.trim();
    const mobile = accountMobile.value.trim();
    const dob = accountDob.value;

    accountMessage.style.color = "#e33";

    if (name.length < 2) {
        accountMessage.textContent = "Please enter your full name.";
        return;
    }

    if (mobile && !/^\d{10}$/.test(mobile)) {
        accountMessage.textContent = "Enter a valid 10-digit mobile number.";
        return;
    }

    if (dob && new Date(dob) > new Date()) {
        accountMessage.textContent = "Date of birth cannot be in the future.";
        return;
    }

    updateProfile({ name, mobile, gender: accountGender.value, dob });

    renderAccount();
    accountMessage.style.color = "#168d35";
    accountMessage.textContent = "Your details have been saved.";
    showToast("Profile updated");
}

function renderAddresses() {
    const list = getAddresses();
    const container = $("#addressList");

    if (!list.length) {
        container.innerHTML = `<p class="acc-empty">No saved addresses yet. Add one to speed up checkout.</p>`;
        return;
    }

    container.innerHTML = list.map(item => `
        <div class="address-card${item.isDefault ? " default" : ""}">
            <div class="address-top">
                <span class="address-tag">${escapeHtml(item.label)}</span>
                ${item.isDefault ? `<span class="address-default">DEFAULT</span>` : ""}
            </div>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.address)}, ${escapeHtml(item.city)} - ${escapeHtml(item.pin)}</p>
            <span>Mobile: ${escapeHtml(item.mobile)}</span>
            <div class="address-actions">
                <button type="button" data-addr-action="edit" data-id="${escapeHtml(item.id)}">Edit</button>
                ${item.isDefault ? "" : `<button type="button" data-addr-action="default" data-id="${escapeHtml(item.id)}">Set as default</button>`}
                <button type="button" data-addr-action="delete" data-id="${escapeHtml(item.id)}">Delete</button>
            </div>
        </div>
    `).join("");
}

function openAddressForm(id) {
    const list = getAddresses();
    const item = id ? list.find(entry => entry.id === id) : null;

    $("#addrId").value = item ? item.id : "";
    $("#addrLabel").value = item ? item.label : "Home";
    $("#addrName").value = item ? item.name : (currentUser.name || "");
    $("#addrMobile").value = item ? item.mobile : (currentUser.mobile || "");
    $("#addrPin").value = item ? item.pin : "";
    $("#addrCity").value = item ? item.city : "";
    $("#addrText").value = item ? item.address : "";
    $("#addrDefault").checked = item ? item.isDefault : list.length === 0;
    $("#addressMessage").textContent = "";

    $("#addressForm").hidden = false;
    $("#addrName").focus();
}

function closeAddressForm() {
    $("#addressForm").hidden = true;
}

function saveAddress() {
    const message = $("#addressMessage");
    const id = $("#addrId").value;
    const entry = {
        id: id || `ADR${Date.now()}`,
        label: $("#addrLabel").value,
        name: $("#addrName").value.trim(),
        mobile: $("#addrMobile").value.trim(),
        pin: $("#addrPin").value.trim(),
        city: $("#addrCity").value.trim(),
        address: $("#addrText").value.trim(),
        isDefault: $("#addrDefault").checked
    };

    message.style.color = "#e33";

    if (entry.name.length < 2) {
        message.textContent = "Please enter the receiver's name.";
        return;
    }

    if (!/^\d{10}$/.test(entry.mobile)) {
        message.textContent = "Enter a valid 10-digit mobile number.";
        return;
    }

    if (!/^\d{6}$/.test(entry.pin)) {
        message.textContent = "Enter a valid 6-digit PIN code.";
        return;
    }

    if (!entry.city) {
        message.textContent = "Please enter the city.";
        return;
    }

    if (entry.address.length < 5) {
        message.textContent = "Please enter the complete address.";
        return;
    }

    let list = getAddresses().map(item => ({ ...item }));

    if (entry.isDefault) {
        list.forEach(item => {
            item.isDefault = false;
        });
    }

    const index = list.findIndex(item => item.id === entry.id);

    if (index >= 0) {
        list[index] = entry;
    } else {
        list.push(entry);
    }

    saveAddresses(list);
    closeAddressForm();
    renderAccount();
    showToast(index >= 0 ? "Address updated" : "Address saved");
}

function handleAddressAction(action, id) {
    let list = getAddresses().map(item => ({ ...item }));

    if (action === "edit") {
        openAddressForm(id);
        return;
    }

    if (action === "default") {
        list.forEach(item => {
            item.isDefault = item.id === id;
        });
        saveAddresses(list);
        renderAccount();
        showToast("Default address updated");
        return;
    }

    if (action === "delete") {
        if (!window.confirm("Delete this address?")) {
            return;
        }

        list = list.filter(item => item.id !== id);
        saveAddresses(list);
        renderAccount();
        showToast("Address deleted");
    }
}

function changePassword() {
    const message = $("#passMessage");
    const record = getUserRecord();
    const current = $("#curPass").value;
    const next = $("#newPass").value;
    const confirm = $("#confirmPass").value;

    message.style.color = "#e33";

    if (!record) {
        message.textContent = "Password change is available for accounts created with Create Account.";
        return;
    }

    if (record.password !== hashPassword(current)) {
        message.textContent = "Current password is incorrect.";
        return;
    }

    if (next.length < 6) {
        message.textContent = "New password must contain at least 6 characters.";
        return;
    }

    if (next === current) {
        message.textContent = "New password must be different from the current one.";
        return;
    }

    if (next !== confirm) {
        message.textContent = "New passwords do not match.";
        return;
    }

    record.password = hashPassword(next);
    saveUsers();

    $("#passwordForm").reset();
    message.style.color = "#168d35";
    message.textContent = "Your password has been updated.";
    showToast("Password updated");
}

function savePreferences() {
    updateProfile({
        prefs: {
            orders: $("#prefOrders").checked,
            offers: $("#prefOffers").checked
        }
    });

    showToast("Preferences saved");
}

function deleteAccount() {
    const message = $("#deleteMessage");
    const record = getUserRecord();

    message.style.color = "#e33";

    if (record && record.password !== hashPassword($("#deletePass").value)) {
        message.textContent = "Password is incorrect.";
        return;
    }

    const email = currentUser.email.toLowerCase();

    users = users.filter(item => item.email.toLowerCase() !== email);
    saveUsers();

    orderHistory = orderHistory.filter(order => !order.userEmail || order.userEmail.toLowerCase() !== email);
    saveOrders();

    returnRequests = returnRequests.filter(item => item.userEmail.toLowerCase() !== email);
    saveReturns();

    tickets = tickets.filter(item => item.email.toLowerCase() !== email);
    saveTickets();

    $("#deleteBox").hidden = true;
    $("#deletePass").value = "";

    logoutUser();
    showToast("Your account has been deleted");
}

function processAvatar(file) {
    if (!file || !file.type.startsWith("image/")) {
        showToast("Please choose an image file");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast("Image must be under 5 MB");
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement("canvas");
            const size = 200;
            const side = Math.min(image.width, image.height);

            canvas.width = size;
            canvas.height = size;

            canvas.getContext("2d").drawImage(
                image,
                (image.width - side) / 2,
                (image.height - side) / 2,
                side,
                side,
                0,
                0,
                size,
                size
            );

            updateProfile({ photo: canvas.toDataURL("image/jpeg", 0.85) });
            renderAccount();
            showToast("Profile photo updated");
        };

        image.onerror = () => showToast("Could not read this image");
        image.src = reader.result;
    };

    reader.readAsDataURL(file);
}

function fillCheckoutFields(address) {
    checkoutName.value = address.name || (currentUser && currentUser.name) || "";
    checkoutMobile.value = address.mobile || (currentUser && currentUser.mobile) || "";
    checkoutAddress.value = address.address || "";
    checkoutCity.value = address.city || "";
    checkoutPin.value = address.pin || "";
}

function prefillCheckout() {
    if (!currentUser) {
        return;
    }

    const list = getAddresses();
    const select = $("#checkoutSaved");
    const main = list.find(item => item.isDefault) || list[0];

    $("#checkoutSavedWrap").hidden = !list.length;

    select.innerHTML = `<option value="">Enter a new address</option>` + list.map(item =>
        `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)} · ${escapeHtml(item.city)} - ${escapeHtml(item.pin)}${item.isDefault ? " (Default)" : ""}</option>`
    ).join("");

    if (main) {
        select.value = main.id;
        fillCheckoutFields(main);
    } else {
        fillCheckoutFields({});
    }
}

function rememberAddress(customer) {
    const list = getAddresses().map(item => ({ ...item }));

    const exists = list.some(item =>
        item.pin === customer.pin &&
        item.address.toLowerCase() === customer.address.toLowerCase()
    );

    if (!exists) {
        list.push({
            id: `ADR${Date.now()}`,
            label: "Home",
            name: customer.name,
            mobile: customer.mobile,
            pin: customer.pin,
            city: customer.city,
            address: customer.address,
            isDefault: list.length === 0
        });
    }

    saveAddresses(list);

    if (!currentUser.mobile) {
        updateProfile({ mobile: customer.mobile });
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

        const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();

        if (search && !searchable.includes(search)) {
            visible = false;
        }

        const wasHidden = card.style.display === "none";

        card.style.display = visible ? "" : "none";

        if (visible && wasHidden) {
            card.classList.remove("refresh");
            void card.offsetWidth;
            card.classList.add("refresh");
        }
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

    activeFilters.innerHTML = Object.entries(currentFilters)
        .filter(([, value]) => value !== "all")
        .map(([type, value]) => {
            const option = document.querySelector(`.filter-option[data-filter="${type}"][data-value="${value}"]`);
            return `<span>${option ? option.textContent.trim() : value}</span>`;
        })
        .join("");
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

        return Number(a.dataset.order) - Number(b.dataset.order);
    });

    productsGrid.classList.remove("regrid");
    void productsGrid.offsetWidth;
    productsGrid.classList.add("regrid");

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

    sortProducts();
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

$$(".desktop-nav a, .mobile-menu a, .vibe-card, .occasion-card, .footer a[data-category]").forEach(link => {
    link.addEventListener("click", event => {
        const category = link.dataset.category;

        if (category) {
            currentFilters.category = category;
            applyFilters();
        }

        mobileMenu.classList.remove("show");
    });
});

$$(".product-card").forEach((card, position) => {
    card.dataset.order = position;

    const firstSize = card.querySelector(".size-row button");

    if (firstSize) {
        firstSize.classList.add("active");
    }

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

        flyToBag(card.querySelector(".product-image img"));
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

    flyToBag(modalImage);
    addToBag(quickProduct, quickSelectedSize, quickQuantity);
    closeQuickView();
});

profileBtn.addEventListener("click", openAccount);
mobileProfileBtn.addEventListener("click", openAccount);

accountClose.addEventListener("click", closeAccount);
accountOverlay.addEventListener("click", closeAccount);
accountLogoutBtn.addEventListener("click", logoutUser);

accountOrdersBtn.addEventListener("click", () => {
    closeAccount();
    openOrderHistory();
});

accountWishlistBtn.addEventListener("click", () => {
    closeAccount();
    openWishlist();
});

accountBagBtn.addEventListener("click", () => {
    closeAccount();
    openCart();
});

accountForm.addEventListener("submit", event => {
    event.preventDefault();
    saveAccount();
});

tabLogin.addEventListener("click", () => showAuthTab("login"));
tabRegister.addEventListener("click", () => showAuthTab("register"));

registerForm.addEventListener("submit", event => {
    event.preventDefault();
    registerUser();
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
    mobileMenu.style.top = `${Math.max(0, document.querySelector(".navbar").getBoundingClientRect().bottom)}px`;
    mobileMenu.classList.toggle("show");
});

document.addEventListener("click", event => {
    if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        mobileMenu.classList.remove("show");
    }
});

window.addEventListener("scroll", () => {
    mobileMenu.classList.remove("show");
}, { passive: true });

[regMobile, accountMobile, checkoutMobile, checkoutPin].forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeLogin();
        closeAccount();
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
    let step = 0;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;

            if (target.classList.contains("product-card")) {
                target.style.transitionDelay = `${step * 90}ms`;
                step++;
                setTimeout(() => {
                    target.style.transitionDelay = "";
                }, 1400);
            }

            target.classList.add("visible");
            observer.unobserve(target);
        }
    });
}, {
    threshold:.08
});

$$(".reveal").forEach(element => observer.observe(element));

document.body.addEventListener("animationend", event => {
    if (event.animationName === "badgeBump" || event.animationName === "heartPop") {
        event.target.classList.remove("bump", "pop");
    }

    if (event.animationName === "cardRefresh") {
        event.target.classList.remove("refresh");
    }
});

const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
document.body.appendChild(scrollProgress);

const navbarElement = $(".navbar");

function updateScrollEffects() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;

    scrollProgress.style.transform = `scaleX(${ratio})`;
    navbarElement.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();

function runCountUp() {
    $$(".hero-stats strong").forEach(element => {
        const match = element.textContent.trim().match(/^([\d.]+)(.*)$/);

        if (!match) {
            return;
        }

        const end = parseFloat(match[1]);
        const suffix = match[2];
        const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
        const duration = 1400;
        const startTime = performance.now();

        function frame(now) {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);

            element.textContent = `${(end * eased).toFixed(decimals)}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }

        requestAnimationFrame(frame);
    });
}

window.addEventListener("load", () => {
    setTimeout(runCountUp, 1000);
});

const helpOverlay = $("#helpOverlay");
const helpModal = $("#helpModal");
const helpClose = $("#helpClose");
const helpTitle = $("#helpTitle");
const helpTitles = { contact: "Contact Us", returns: "Returns", shipping: "Shipping", faq: "FAQ" };

let tickets = JSON.parse(localStorage.getItem("myntraTickets")) || [];
let returnRequests = JSON.parse(localStorage.getItem("myntraReturns")) || [];

function saveTickets() {
    localStorage.setItem("myntraTickets", JSON.stringify(tickets));
}

function saveReturns() {
    localStorage.setItem("myntraReturns", JSON.stringify(returnRequests));
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

function setHelpMessage(element, text, success) {
    element.textContent = text;
    element.style.color = success ? "#168d35" : "#e33";
}

function formatShortDate(date) {
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" });
}

function showHelpTab(tab) {
    const name = helpTitles[tab] ? tab : "contact";

    helpTitle.textContent = helpTitles[name];

    $$(".help-tab").forEach(button => {
        button.classList.toggle("active", button.dataset.helpTab === name);
    });

    $$(".help-panel").forEach(panel => {
        panel.hidden = panel.dataset.helpPanel !== name;
    });

    if (name === "contact") {
        prepareContact();
    }

    if (name === "returns") {
        prepareReturns();
    }

    $(".help-body").scrollTop = 0;
}

function openHelp(tab) {
    showHelpTab(tab);
    helpOverlay.classList.add("show");
    helpModal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeHelp() {
    helpOverlay.classList.remove("show");
    helpModal.classList.remove("open");

    if (
        !cartDrawer.classList.contains("open") &&
        !wishlistDrawer.classList.contains("open") &&
        !checkoutModal.classList.contains("open") &&
        !loginModal.classList.contains("open") &&
        !accountDrawer.classList.contains("open") &&
        !orderHistoryDrawer.classList.contains("open") &&
        !quickModal.classList.contains("show")
    ) {
        document.body.style.overflow = "";
    }
}

function prepareContact() {
    const name = $("#contactName");
    const email = $("#contactEmail");

    if (currentUser) {
        if (!name.value) {
            name.value = currentUser.name || "";
        }

        if (!email.value) {
            email.value = currentUser.email || "";
        }
    }

    renderTickets();
}

function renderTickets() {
    const list = $("#ticketList");
    const mine = currentUser ? tickets.filter(item => item.email.toLowerCase() === currentUser.email.toLowerCase()) : [];

    if (!mine.length) {
        list.innerHTML = "";
        return;
    }

    list.innerHTML = `
        <h3>Your recent requests</h3>
        ${mine.slice(0, 5).map(item => `
            <div class="help-list-item">
                <div>
                    <strong>${escapeHtml(item.id)} · ${escapeHtml(item.topic)}</strong>
                    <span>${escapeHtml(item.date)}</span>
                </div>
                <em>${escapeHtml(item.status)}</em>
            </div>
        `).join("")}
    `;
}

function submitContact() {
    const name = $("#contactName").value.trim();
    const email = $("#contactEmail").value.trim();
    const topic = $("#contactTopic").value;
    const orderId = $("#contactOrder").value.trim().toUpperCase();
    const text = $("#contactText").value.trim();
    const message = $("#contactMessage");

    if (name.length < 2) {
        setHelpMessage(message, "Please enter your name.", false);
        return;
    }

    if (!isValidEmail(email)) {
        setHelpMessage(message, "Please enter a valid email.", false);
        return;
    }

    if (!topic) {
        setHelpMessage(message, "Please select a topic.", false);
        return;
    }

    if (text.length < 10) {
        setHelpMessage(message, "Please describe your issue in at least 10 characters.", false);
        return;
    }

    const ticket = {
        id: `TKT${Date.now().toString().slice(-7)}`,
        name,
        email,
        topic,
        orderId,
        message: text,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Open"
    };

    tickets.unshift(ticket);
    saveTickets();

    $("#contactTopic").value = "";
    $("#contactOrder").value = "";
    $("#contactText").value = "";

    setHelpMessage(message, `Thanks ${name.split(" ")[0]}. Your request ${ticket.id} has been received. We will reply within 24 hours.`, true);
    renderTickets();
}

function getReturnableOrders() {
    if (!currentUser) {
        return [];
    }

    const limit = 7 * 24 * 60 * 60 * 1000;

    return orderHistory.filter(order =>
        (!order.userEmail || order.userEmail === currentUser.email) &&
        (!order.placedAt || Date.now() - order.placedAt <= limit)
    );
}

function prepareReturns() {
    const loginNote = $("#returnLoginNote");
    const form = $("#returnForm");

    loginNote.hidden = !!currentUser;
    form.hidden = !currentUser;

    if (!currentUser) {
        $("#returnList").innerHTML = "";
        return;
    }

    const orders = getReturnableOrders();
    const orderSelect = $("#returnOrder");

    if (!orders.length) {
        orderSelect.innerHTML = `<option value="">No eligible orders</option>`;
        $("#returnItem").innerHTML = `<option value="">No items available</option>`;
    } else {
        orderSelect.innerHTML = orders.map(order =>
            `<option value="${escapeHtml(order.id)}">${escapeHtml(order.id)} · ${escapeHtml(order.date)} · ${money(order.total)}</option>`
        ).join("");
        fillReturnItems();
    }

    renderReturns();
}

function fillReturnItems() {
    const order = orderHistory.find(item => item.id === $("#returnOrder").value);
    const itemSelect = $("#returnItem");

    if (!order) {
        itemSelect.innerHTML = `<option value="">No items available</option>`;
        return;
    }

    itemSelect.innerHTML = order.items.map((item, index) =>
        `<option value="${index}">${escapeHtml(item.brand)} ${escapeHtml(item.name)} · Size ${escapeHtml(item.size)} · Qty ${item.quantity}</option>`
    ).join("");
}

function renderReturns() {
    const list = $("#returnList");
    const mine = currentUser ? returnRequests.filter(item => item.userEmail === currentUser.email) : [];

    if (!mine.length) {
        list.innerHTML = "";
        return;
    }

    list.innerHTML = `
        <h3>Your return requests</h3>
        ${mine.slice(0, 5).map(item => `
            <div class="help-list-item">
                <div>
                    <strong>${escapeHtml(item.id)} · ${escapeHtml(item.itemName)}</strong>
                    <span>Order ${escapeHtml(item.orderId)} · ${escapeHtml(item.reason)}</span>
                </div>
                <em>${escapeHtml(item.status)}</em>
            </div>
        `).join("")}
    `;
}

function submitReturn() {
    const message = $("#returnMessage");
    const order = orderHistory.find(item => item.id === $("#returnOrder").value);
    const reason = $("#returnReason").value;

    if (!order) {
        setHelpMessage(message, "You have no eligible orders to return.", false);
        return;
    }

    const item = order.items[Number($("#returnItem").value)];

    if (!item) {
        setHelpMessage(message, "Please select an item.", false);
        return;
    }

    if (!reason) {
        setHelpMessage(message, "Please select a reason.", false);
        return;
    }

    const duplicate = returnRequests.some(entry =>
        entry.userEmail === currentUser.email &&
        entry.orderId === order.id &&
        entry.itemName === `${item.brand} ${item.name}` &&
        entry.size === item.size
    );

    if (duplicate) {
        setHelpMessage(message, "A return has already been requested for this item.", false);
        return;
    }

    const request = {
        id: `RET${Date.now().toString().slice(-7)}`,
        orderId: order.id,
        itemName: `${item.brand} ${item.name}`,
        size: item.size,
        quantity: item.quantity,
        reason,
        note: $("#returnNote").value.trim(),
        userEmail: currentUser.email,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Requested"
    };

    returnRequests.unshift(request);
    saveReturns();

    $("#returnReason").value = "";
    $("#returnNote").value = "";

    setHelpMessage(message, `Return ${request.id} requested. Pickup will be arranged within 2 days.`, true);
    renderReturns();
}

function checkDelivery() {
    const pin = $("#shipPin").value.trim();
    const result = $("#shipResult");

    if (!/^\d{6}$/.test(pin)) {
        setHelpMessage(result, "Enter a valid 6-digit PIN code.", false);
        return;
    }

    if (pin.startsWith("0")) {
        setHelpMessage(result, "Sorry, we do not deliver to this PIN code yet.", false);
        return;
    }

    const from = new Date();
    const to = new Date();

    from.setDate(from.getDate() + 3);
    to.setDate(to.getDate() + 5);

    setHelpMessage(result, `Delivery available to ${pin}. Expected between ${formatShortDate(from)} and ${formatShortDate(to)}.`, true);
}

function trackOrderById() {
    const id = $("#trackId").value.trim().toUpperCase();
    const result = $("#trackResult");

    result.style.color = "#e33";

    if (!id) {
        result.textContent = "Enter your order ID.";
        return;
    }

    if (!currentUser) {
        result.innerHTML = `Please login to track your order. <button type="button" class="help-inline-btn" id="trackLoginBtn">Login</button>`;
        $("#trackLoginBtn").addEventListener("click", () => {
            closeHelp();
            openLogin(false);
        });
        return;
    }

    const order = orderHistory.find(item =>
        item.id === id && (!item.userEmail || item.userEmail === currentUser.email)
    );

    if (!order) {
        result.textContent = "No order found with this ID on your account.";
        return;
    }

    const placed = order.placedAt ? new Date(order.placedAt) : null;
    let expected = "within 3–5 business days";

    if (placed) {
        const from = new Date(placed);
        const to = new Date(placed);

        from.setDate(from.getDate() + 3);
        to.setDate(to.getDate() + 5);
        expected = `${formatShortDate(from)} – ${formatShortDate(to)}`;
    }

    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

    result.style.color = "";
    result.innerHTML = `
        <div class="track-card">
            <div><strong>${escapeHtml(order.id)}</strong><span>Placed on ${escapeHtml(order.date)}</span></div>
            <div><strong>Status</strong><span>Confirmed · Preparing for dispatch</span></div>
            <div><strong>Items</strong><span>${count} item${count === 1 ? "" : "s"} · ${money(order.total)}</span></div>
            <div><strong>Expected delivery</strong><span>${expected}</span></div>
        </div>
    `;
}

function filterFaq() {
    const query = $("#faqSearch").value.trim().toLowerCase();
    let visible = 0;

    $$(".faq-item").forEach(item => {
        const match = !query || item.textContent.toLowerCase().includes(query);

        item.hidden = !match;

        if (match) {
            visible++;
        }
    });

    $("#faqEmpty").hidden = visible > 0;
}

$$("[data-help]").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        openHelp(link.dataset.help);
    });
});

$$(".help-tab").forEach(button => {
    button.addEventListener("click", () => showHelpTab(button.dataset.helpTab));
});

helpClose.addEventListener("click", closeHelp);
helpOverlay.addEventListener("click", closeHelp);

$("#contactForm").addEventListener("submit", event => {
    event.preventDefault();
    submitContact();
});

$("#returnForm").addEventListener("submit", event => {
    event.preventDefault();
    submitReturn();
});

$("#returnOrder").addEventListener("change", fillReturnItems);

$("#returnLoginBtn").addEventListener("click", () => {
    closeHelp();
    openLogin(false);
});

$("#shipCheck").addEventListener("click", checkDelivery);
$("#trackCheck").addEventListener("click", trackOrderById);

$("#shipPin").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        checkDelivery();
    }
});

$("#shipPin").addEventListener("input", event => {
    event.target.value = event.target.value.replace(/\D/g, "");
});

$("#trackId").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        trackOrderById();
    }
});

$("#faqSearch").addEventListener("input", filterFaq);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeHelp();
    }
});

$$(".account-tab").forEach(button => {
    button.addEventListener("click", () => showAccountTab(button.dataset.accountTab));
});

$("#avatarEdit").addEventListener("click", () => $("#avatarInput").click());

$("#avatarInput").addEventListener("change", event => {
    processAvatar(event.target.files[0]);
    event.target.value = "";
});

$("#avatarRemove").addEventListener("click", () => {
    updateProfile({ photo: "" });
    renderAccount();
    showToast("Profile photo removed");
});

$("#accountViewOrders").addEventListener("click", () => {
    closeAccount();
    openOrderHistory();
});

$("#accountRecent").addEventListener("click", event => {
    if (event.target.closest("[data-open-orders]")) {
        closeAccount();
        openOrderHistory();
    }
});

$$("[data-acc-help]").forEach(button => {
    button.addEventListener("click", () => {
        closeAccount();
        openHelp(button.dataset.accHelp);
    });
});

$("#addAddressBtn").addEventListener("click", () => openAddressForm(""));
$("#addressCancel").addEventListener("click", closeAddressForm);

$("#addressForm").addEventListener("submit", event => {
    event.preventDefault();
    saveAddress();
});

$("#addressList").addEventListener("click", event => {
    const button = event.target.closest("[data-addr-action]");

    if (button) {
        handleAddressAction(button.dataset.addrAction, button.dataset.id);
    }
});

$("#passwordForm").addEventListener("submit", event => {
    event.preventDefault();
    changePassword();
});

$("#prefOrders").addEventListener("change", savePreferences);
$("#prefOffers").addEventListener("change", savePreferences);

$("#deleteAccountBtn").addEventListener("click", () => {
    $("#deleteBox").hidden = false;
    $("#deletePass").focus();
});

$("#cancelDelete").addEventListener("click", () => {
    $("#deleteBox").hidden = true;
    $("#deletePass").value = "";
    $("#deleteMessage").textContent = "";
});

$("#confirmDelete").addEventListener("click", deleteAccount);

$("#checkoutSaved").addEventListener("change", event => {
    const item = getAddresses().find(entry => entry.id === event.target.value);
    fillCheckoutFields(item || {});
});

[$("#addrMobile"), $("#addrPin")].forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
    });
});