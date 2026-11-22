const products = [...document.querySelectorAll(".product-card")];
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const categoryCards = [...document.querySelectorAll(".category-card")];

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const wishlistCount = document.getElementById("wishlistCount");
const bagCount = document.getElementById("bagCount");
const mobileBagCount = document.getElementById("mobileBagCount");

const quickModal = document.getElementById("quickModal");
const modalImage = document.getElementById("modalImage");
const modalBrand = document.getElementById("modalBrand");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalSizes = document.getElementById("modalSizes");
const modalQty = document.getElementById("modalQty");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartFooter = document.getElementById("cartFooter");

let wishlist = JSON.parse(localStorage.getItem("myntraWishlist") || "[]");
let bag = JSON.parse(localStorage.getItem("myntraBag") || "[]");

let activeCategory = "all";
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
}

function updateBagCount() {
    const total = bag.reduce((sum, item) => sum + item.quantity, 0);

    bagCount.textContent = total;
    mobileBagCount.textContent = total;
    document.getElementById("cartItemCount").textContent = total;
}

function updateWishlistUI() {
    products.forEach(product => {
        const button = product.querySelector(".wishlist-product");
        const icon = button.querySelector("i");

        const active = wishlist.includes(product.dataset.name);

        button.classList.toggle("active", active);

        icon.className = active
            ? "fa-solid fa-heart"
            : "fa-regular fa-heart";
    });
}

function setCategory(category) {
    activeCategory = category;

    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    categoryCards.forEach(card => {
        card.classList.toggle(
            "active",
            card.dataset.category === category
        );
    });

    filterProducts();
}

function filterProducts() {
    const search = searchInput.value.trim().toLowerCase();
    let visible = 0;

    products.forEach(product => {
        const categoryMatch =
            activeCategory === "all" ||
            product.dataset.category === activeCategory;

        const searchText =
            `${product.dataset.name} ${product.dataset.brand}`.toLowerCase();

        const searchMatch =
            search === "" || searchText.includes(search);

        const show = categoryMatch && searchMatch;

        product.style.display = show ? "" : "none";

        if (show) {
            visible++;
        }
    });

    document.getElementById("emptyProducts").style.display =
        visible ? "none" : "block";
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        setCategory(button.dataset.category);

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });
    });
});

categoryCards.forEach(card => {
    card.addEventListener("click", () => {
        setCategory(card.dataset.category);

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

        document.getElementById("mobileMenu").classList.remove("open");
    });
});

searchInput.addEventListener("input", filterProducts);

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    filterProducts();
    searchInput.focus();
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
            event.stopPropagation();

            modalSizes
                .querySelectorAll("button")
                .forEach(item => item.classList.remove("selected"));

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

    if (!cartDrawer.classList.contains("open")) {
        document.body.style.overflow = "";
    }
}

document.getElementById("modalClose").addEventListener(
    "click",
    closeQuickView
);

quickModal.addEventListener("click", event => {
    if (event.target === quickModal) {
        closeQuickView();
    }
});

document.getElementById("modalMinus").addEventListener("click", () => {
    modalQty.textContent = Math.max(
        1,
        Number(modalQty.textContent) - 1
    );
});

document.getElementById("modalPlus").addEventListener("click", () => {
    modalQty.textContent = Math.min(
        10,
        Number(modalQty.textContent) + 1
    );
});

document.getElementById("modalAdd").addEventListener("click", () => {

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

                <div class="cart-item-brand">
                    ${item.brand}
                </div>

                <div class="cart-item-name">
                    ${item.name}
                </div>

                <div class="cart-item-meta">
                    Size: ${item.size}
                </div>

                <div class="cart-item-price">
                    ${formatPrice(item.price)}
                </div>

                <div class="cart-item-controls">

                    <button
                        type="button"
                        class="cart-minus"
                        data-index="${index}">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="cart-plus"
                        data-index="${index}">
                        +
                    </button>

                </div>

            </div>

            <button
                type="button"
                class="cart-remove"
                data-index="${index}">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
    `).join("");

    cartBody
        .querySelectorAll(".cart-minus")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                bag[index].quantity--;

                if (bag[index].quantity <= 0) {
                    bag.splice(index, 1);
                }

                saveData();
                updateBagCount();
                renderCart();
            });
        });

    cartBody
        .querySelectorAll(".cart-plus")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

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

    cartBody
        .querySelectorAll(".cart-remove")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                bag.splice(index, 1);

                saveData();
                updateBagCount();
                renderCart();

                showToast("Item removed");
            });
        });

    const subtotal =
        bag.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

    document.getElementById("cartSubtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("cartDelivery").textContent =
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

    if (!quickModal.classList.contains("show")) {
        document.body.style.overflow = "";
    }
}

document.getElementById("bagBtn").addEventListener(
    "click",
    openCart
);

document.getElementById("mobileBag").addEventListener(
    "click",
    openCart
);

document.getElementById("cartClose").addEventListener(
    "click",
    closeCart
);

cartOverlay.addEventListener(
    "click",
    closeCart
);

document.getElementById("checkoutBtn").addEventListener(
    "click",
    () => {
        if (!bag.length) {
            showToast("Your bag is empty");
            return;
        }

        showToast("Checkout is ready for integration");
    }
);

document.getElementById("profileBtn").addEventListener(
    "click",
    () => showToast("Profile login coming soon")
);

document.getElementById("wishlistBtn").addEventListener(
    "click",
    () => showToast(`${wishlist.length} item(s) in wishlist`)
);

document.getElementById("mobileWishlist").addEventListener(
    "click",
    () => showToast(`${wishlist.length} item(s) in wishlist`)
);

document.getElementById("mobileHome").addEventListener(
    "click",
    () => window.scrollTo({
        top:0,
        behavior:"smooth"
    })
);

document.getElementById("mobileSearch").addEventListener(
    "click",
    () => {
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

        setTimeout(() => {
            searchInput.focus();
        }, 300);
    }
);

document.getElementById("mobileMenuBtn").addEventListener(
    "click",
    () => {
        document
            .getElementById("mobileMenu")
            .classList.toggle("open");
    }
);

document.getElementById("exploreBtn").addEventListener(
    "click",
    () => {
        document
            .getElementById("products")
            .scrollIntoView({
                behavior:"smooth"
            });
    }
);

document.getElementById("editorialBtn").addEventListener(
    "click",
    () => {
        document
            .getElementById("products")
            .scrollIntoView({
                behavior:"smooth"
            });
    }
);

document.getElementById("offerBtn").addEventListener(
    "click",
    () => {
        document
            .getElementById("products")
            .scrollIntoView({
                behavior:"smooth"
            });
    }
);

document.querySelectorAll(".occasion-card").forEach(card => {

    card.addEventListener("click", () => {

        document
            .getElementById("products")
            .scrollIntoView({
                behavior:"smooth"
            });

    });

});

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeQuickView();
        closeCart();

        document
            .getElementById("mobileMenu")
            .classList.remove("open");
    }

});

updateWishlistCount();
updateBagCount();
updateWishlistUI();
renderCart();
filterProducts();