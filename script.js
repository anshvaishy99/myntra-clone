const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const products = [...document.querySelectorAll(".product-card")];
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const vibeCards = [...document.querySelectorAll(".vibe-card")];
const occasionCards = [...document.querySelectorAll(".occasion-card")];
const navCategoryLinks = [...document.querySelectorAll("[data-category]")];

const wishlistCount = document.getElementById("wishlistCount");
const bagCount = document.getElementById("bagCount");
const mobileWishlistCount = document.getElementById("mobileWishlistCount");
const mobileBagCount = document.getElementById("mobileBagCount");

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
const cartItemCount = document.getElementById("cartItemCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartDelivery = document.getElementById("cartDelivery");
const checkoutBtn = document.getElementById("checkoutBtn");

const profileBtn = document.getElementById("profileBtn");
const wishlistBtn = document.getElementById("wishlistBtn");
const bagBtn = document.getElementById("bagBtn");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileHome = document.getElementById("mobileHome");
const mobileWishlist = document.getElementById("mobileWishlist");
const mobileBag = document.getElementById("mobileBag");

let wishlist = JSON.parse(localStorage.getItem("myntraWishlist")) || [];
let bag = JSON.parse(localStorage.getItem("myntraBag")) || [];

let activeFilter = "all";
let modalProduct = null;
let modalSelectedSize = "";

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
        const name = product.dataset.name;
        const button = product.querySelector(".wishlist-product");
        const icon = button.querySelector("i");

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

function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleProducts = 0;

    products.forEach(product => {
        const category = product.dataset.category;
        const name = product.dataset.name.toLowerCase();
        const brand = product.dataset.brand.toLowerCase();

        const categoryMatch =
            activeFilter === "all" || category === activeFilter;

        const searchMatch =
            !query ||
            name.includes(query) ||
            brand.includes(query) ||
            category.includes(query);

        if (categoryMatch && searchMatch) {
            product.style.display = "";
            visibleProducts++;
        } else {
            product.style.display = "none";
        }
    });

    document.getElementById("emptyProducts").classList.toggle(
        "show",
        visibleProducts === 0
    );
}

function setFilter(category) {
    activeFilter = category;

    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === category
        );
    });

    filterProducts();
}

searchInput.addEventListener("input", filterProducts);

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    filterProducts();
    searchInput.focus();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        setFilter(button.dataset.filter);
    });
});

vibeCards.forEach(card => {
    card.addEventListener("click", () => {
        setFilter(card.dataset.category);

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });
    });
});

occasionCards.forEach(card => {
    card.addEventListener("click", () => {
        setFilter(card.dataset.category);

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });
    });
});

navCategoryLinks.forEach(link => {
    link.addEventListener("click", event => {
        const category = link.dataset.category;

        if (!category) {
            return;
        }

        event.preventDefault();

        setFilter(category);

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });

        mobileMenu.classList.remove("active");
    });
});

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

function openCart() {
    cartDrawer.classList.add("show");
    cartOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartDrawer.classList.remove("show");
    cartOverlay.classList.remove("show");

    if (!quickModal.classList.contains("show")) {
        document.body.style.overflow = "";
    }
}

bagBtn.addEventListener("click", openCart);

mobileBag.addEventListener("click", openCart);

cartClose.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

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

profileBtn.addEventListener("click", () => {
    showToast("Profile feature coming soon");
});

wishlistBtn.addEventListener("click", () => {
    if (!wishlist.length) {
        showToast("Your wishlist is empty");
        return;
    }

    showToast(`${wishlist.length} item${wishlist.length > 1 ? "s" : ""} in wishlist`);
});

mobileWishlist.addEventListener("click", () => {
    if (!wishlist.length) {
        showToast("Your wishlist is empty");
        return;
    }

    showToast(`${wishlist.length} item${wishlist.length > 1 ? "s" : ""} in wishlist`);
});

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");

    const icon = mobileMenuBtn.querySelector("i");

    if (mobileMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});

mobileHome.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

checkoutBtn.addEventListener("click", () => {
    if (!bag.length) {
        showToast("Your bag is empty");
        return;
    }

    showToast("Checkout feature coming soon");
});

document.getElementById("logo").addEventListener("click", event => {
    event.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeQuickView();
        closeCart();
        mobileMenu.classList.remove("active");

        const icon = mobileMenuBtn.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});

updateWishlistCount();
updateBagCount();
updateWishlistUI();
renderCart();
filterProducts();