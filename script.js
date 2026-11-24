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
const cartTotal = document.getElementById("cartTotal");

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

const wishlistOverlay = document.getElementById("wishlistOverlay");
const wishlistDrawer = document.getElementById("wishlistDrawer");
const wishlistClose = document.getElementById("wishlistClose");
const wishlistBody = document.getElementById("wishlistBody");
const wishlistFooter = document.getElementById("wishlistFooter");
const wishlistItemCount = document.getElementById("wishlistItemCount");
const wishlistShopBtn = document.getElementById("wishlistShopBtn");

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

function formatPrice(value) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
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
    wishlistItemCount.textContent = wishlist.length;
}

function updateWishlistUI() {
    products.forEach(product => {
        const name = product.dataset.name;
        const button = product.querySelector(".wishlist-product");

        if (!button) {
            return;
        }

        if (wishlist.includes(name)) {
            button.classList.add("active");
            button.innerHTML = '<i class="fa-solid fa-heart"></i>';
        } else {
            button.classList.remove("active");
            button.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
    });
}

function removeFromWishlist(name) {
    wishlist = wishlist.filter(item => item !== name);

    saveData();
    updateWishlistCount();
    updateWishlistUI();
    renderWishlist();

    showToast("Removed from wishlist");
}

function renderWishlist() {
    wishlistItemCount.textContent = wishlist.length;

    if (!wishlist.length) {
        wishlistBody.innerHTML = `
            <div class="wishlist-empty">
                <div class="wishlist-empty-icon">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <h3>Your wishlist is empty</h3>
                <p>
                    Save your favourite styles here and come back whenever you're ready.
                </p>
                <button type="button" id="emptyWishlistShop">
                    Explore Products
                </button>
            </div>
        `;

        wishlistFooter.style.display = "none";

        document
            .getElementById("emptyWishlistShop")
            .addEventListener("click", closeWishlist);

        return;
    }

    wishlistFooter.style.display = "block";

    const wishlistProducts = products.filter(product =>
        wishlist.includes(product.dataset.name)
    );

    wishlistBody.innerHTML = wishlistProducts.map(product => `
        <div class="wishlist-item">
            <div class="wishlist-item-image">
                <img src="${product.dataset.image}" alt="${product.dataset.name}">
            </div>

            <div>
                <div class="wishlist-item-brand">${product.dataset.brand}</div>

                <div class="wishlist-item-name">
                    ${product.dataset.name}
                </div>

                <div class="wishlist-item-price">
                    ${formatPrice(product.dataset.price)}
                </div>

                <div class="wishlist-item-rating">
                    ${product.dataset.rating}
                    <i class="fa-solid fa-star"></i>
                    Rating
                </div>

                <div class="wishlist-item-actions">
                    <button
                        type="button"
                        class="wishlist-bag-btn"
                        data-name="${product.dataset.name}"
                    >
                        Add to Bag
                    </button>

                    <button
                        type="button"
                        class="wishlist-remove-btn"
                        data-name="${product.dataset.name}"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>

            <button
                type="button"
                class="wishlist-remove-top"
                data-name="${product.dataset.name}"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join("");

    wishlistBody
        .querySelectorAll(".wishlist-remove-btn, .wishlist-remove-top")
        .forEach(button => {
            button.addEventListener("click", () => {
                removeFromWishlist(button.dataset.name);
            });
        });

    wishlistBody
        .querySelectorAll(".wishlist-bag-btn")
        .forEach(button => {
            button.addEventListener("click", () => {
                const product = products.find(
                    item => item.dataset.name === button.dataset.name
                );

                if (!product) {
                    return;
                }

                const firstSize = product.querySelector(".size-row button");

                if (!firstSize) {
                    showToast("Size not available");
                    return;
                }

                addToBag({
                    name: product.dataset.name,
                    brand: product.dataset.brand,
                    price: Number(product.dataset.price),
                    image: product.dataset.image,
                    size: firstSize.textContent,
                    quantity: 1
                });

                removeFromWishlist(product.dataset.name);
            });
        });
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
        !quickModal.classList.contains("show")
    ) {
        document.body.style.overflow = "";
    }
}

function updateBagCount() {
    const total = bag.reduce((sum, item) => sum + item.quantity, 0);

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

    const subtotal = bag.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartSubtotal.textContent = formatPrice(subtotal);
    cartDelivery.textContent = subtotal >= 999 ? "FREE" : "₹99";
    cartTotal.textContent = formatPrice(
        subtotal >= 999 ? subtotal : subtotal + 99
    );

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
}

function openCart() {
    closeWishlist();

    cartOverlay.classList.add("show");
    cartDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartOverlay.classList.remove("show");
    cartDrawer.classList.remove("open");

    if (!quickModal.classList.contains("show")) {
        document.body.style.overflow = "";
    }
}

function openQuickView(product) {
    modalProduct = product;
    modalSelectedSize = "";

    modalImage.src = product.dataset.image;
    modalBrand.textContent = product.dataset.brand;
    modalName.textContent = product.dataset.name;
    modalDescription.textContent =
        "A premium fashion pick designed for effortless everyday styling.";
    modalPrice.textContent = formatPrice(product.dataset.price);
    modalQty.textContent = "1";

    modalSizes.innerHTML = "";

    product
        .querySelectorAll(".size-row button")
        .forEach(sizeButton => {
            const button = document.createElement("button");

            button.type = "button";
            button.textContent = sizeButton.textContent;

            button.addEventListener("click", () => {
                modalSizes
                    .querySelectorAll("button")
                    .forEach(item => item.classList.remove("active"));

                button.classList.add("active");
                modalSelectedSize = button.textContent;
            });

            modalSizes.appendChild(button);
        });

    quickModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeQuickView() {
    quickModal.classList.remove("show");

    if (
        !cartDrawer.classList.contains("open") &&
        !wishlistDrawer.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    let visibleProducts = [...products];

    visibleProducts.forEach(product => {
        const name = product.dataset.name.toLowerCase();
        const brand = product.dataset.brand.toLowerCase();
        const category = product.dataset.category;
        const price = Number(product.dataset.price);
        const rating = Number(product.dataset.rating);
        const discount = Number(product.dataset.discount);

        const matchesSearch =
            !query ||
            name.includes(query) ||
            brand.includes(query);

        const matchesCategory =
            filters.category === "all" ||
            category === filters.category;

        const matchesPrice =
            filters.price === "all" ||
            (filters.price === "under1000" && price < 1000) ||
            (filters.price === "1000-2000" && price >= 1000 && price <= 2000) ||
            (filters.price === "above2000" && price > 2000);

        const matchesRating =
            filters.rating === "all" ||
            rating >= Number(filters.rating);

        const matchesDiscount =
            filters.discount === "all" ||
            discount >= Number(filters.discount);

        product.style.display =
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesRating &&
            matchesDiscount
                ? ""
                : "none";
    });

    visibleProducts.sort((a, b) => {
        const sort = sortSelect.value;

        if (sort === "price-low") {
            return Number(a.dataset.price) - Number(b.dataset.price);
        }

        if (sort === "price-high") {
            return Number(b.dataset.price) - Number(a.dataset.price);
        }

        if (sort === "rating") {
            return Number(b.dataset.rating) - Number(a.dataset.rating);
        }

        if (sort === "discount") {
            return Number(b.dataset.discount) - Number(a.dataset.discount);
        }

        return 0;
    });

    visibleProducts.forEach(product => {
        productsGrid.appendChild(product);
    });

    const visibleCount = visibleProducts.filter(
        product => product.style.display !== "none"
    ).length;

    resultCount.textContent = visibleCount;

    noResults.classList.toggle("show", visibleCount === 0);

    renderActiveFilters();
}

function renderActiveFilters() {
    activeFilters.innerHTML = "";

    const labels = {
        category: {
            men: "Men",
            women: "Women",
            kids: "Kids",
            beauty: "Beauty"
        },
        price: {
            under1000: "Under ₹1,000",
            "1000-2000": "₹1,000 - ₹2,000",
            above2000: "Above ₹2,000"
        },
        rating: {
            4: "4+ Rating",
            4.5: "4.5+ Rating"
        },
        discount: {
            20: "20%+ Discount",
            30: "30%+ Discount",
            40: "40%+ Discount"
        }
    };

    let count = 0;

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") {
            count++;

            const chip = document.createElement("div");
            chip.className = "filter-chip";

            chip.innerHTML = `
                ${labels[key][value]}
                <button type="button" data-filter="${key}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            chip.querySelector("button").addEventListener("click", () => {
                filters[key] = "all";
                syncFilterButtons();
                applyFilters();
            });

            activeFilters.appendChild(chip);
        }
    });

    filterCount.textContent = count;
}

function syncFilterButtons() {
    document.querySelectorAll(".filter-option").forEach(button => {
        const key = button.dataset.filter;
        const value = button.dataset.value;

        button.classList.toggle(
            "active",
            filters[key] === value
        );
    });
}

function resetAllFilters() {
    filters.category = "all";
    filters.price = "all";
    filters.rating = "all";
    filters.discount = "all";
    searchInput.value = "";
    sortSelect.value = "relevance";

    syncFilterButtons();
    applyFilters();

    clearSearch.style.display = "none";
}

products.forEach(product => {
    const wishlistButton = product.querySelector(".wishlist-product");
    const quickButton = product.querySelector(".quick-view");
    const addButton = product.querySelector(".add-bag");
    const minusButton = product.querySelector(".qty-minus");
    const plusButton = product.querySelector(".qty-plus");
    const qtyValue = product.querySelector(".qty-value");
    const sizeButtons = product.querySelectorAll(".size-row button");

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

    quickButton.addEventListener("click", () => {
        openQuickView(product);
    });

    sizeButtons.forEach(button => {
        button.addEventListener("click", () => {
            sizeButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");
        });
    });

    minusButton.addEventListener("click", () => {
        let value = Number(qtyValue.textContent);

        if (value > 1) {
            value--;
            qtyValue.textContent = value;
        }
    });

    plusButton.addEventListener("click", () => {
        let value = Number(qtyValue.textContent);

        if (value < 10) {
            value++;
            qtyValue.textContent = value;
        }
    });

    addButton.addEventListener("click", () => {
        const selectedSize = product.querySelector(".size-row button.active");

        if (!selectedSize) {
            showToast("Please select a size");
            return;
        }

        addToBag({
            name: product.dataset.name,
            brand: product.dataset.brand,
            price: Number(product.dataset.price),
            image: product.dataset.image,
            size: selectedSize.textContent,
            quantity: Number(qtyValue.textContent)
        });
    });
});

searchInput.addEventListener("input", () => {
    clearSearch.style.display =
        searchInput.value ? "block" : "none";

    applyFilters();
});

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    applyFilters();
});

sortSelect.addEventListener("change", applyFilters);

filterToggle.addEventListener("click", () => {
    filterPanel.classList.toggle("open");
});

document.querySelectorAll(".filter-option").forEach(button => {
    button.addEventListener("click", () => {
        const key = button.dataset.filter;
        const value = button.dataset.value;

        filters[key] = value;

        syncFilterButtons();
        applyFilters();
    });
});

resetFilters.addEventListener("click", resetAllFilters);
noResultsReset.addEventListener("click", resetAllFilters);

document.querySelectorAll("[data-category-nav]").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        filters.category = link.dataset.categoryNav;

        syncFilterButtons();
        applyFilters();

        document
            .getElementById("products")
            .scrollIntoView({ behavior: "smooth" });

        mobileMenu.classList.remove("open");
    });
});

document.querySelectorAll("[data-vibe]").forEach(card => {
    card.addEventListener("click", event => {
        event.preventDefault();

        filters.category = card.dataset.vibe;

        syncFilterButtons();
        applyFilters();

        document
            .getElementById("products")
            .scrollIntoView({ behavior: "smooth" });
    });
});

modalClose.addEventListener("click", closeQuickView);

quickModal.addEventListener("click", event => {
    if (event.target === quickModal) {
        closeQuickView();
    }
});

modalMinus.addEventListener("click", () => {
    let value = Number(modalQty.textContent);

    if (value > 1) {
        value--;
        modalQty.textContent = value;
    }
});

modalPlus.addEventListener("click", () => {
    let value = Number(modalQty.textContent);

    if (value < 10) {
        value++;
        modalQty.textContent = value;
    }
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

bagBtn.addEventListener("click", openCart);

cartClose.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

wishlistBtn.addEventListener("click", openWishlist);

mobileWishlistBtn.addEventListener("click", openWishlist);

wishlistClose.addEventListener("click", closeWishlist);

wishlistOverlay.addEventListener("click", closeWishlist);

wishlistShopBtn.addEventListener("click", closeWishlist);

mobileBagBtn.addEventListener("click", openCart);

mobileHomeBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

profileBtn.addEventListener("click", () => {
    showToast("Profile login coming soon");
});

mobileProfileBtn.addEventListener("click", () => {
    showToast("Profile login coming soon");
});

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

document.getElementById("homeLogo").addEventListener("click", event => {
    event.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.querySelectorAll(".footer a, .socials a").forEach(link => {
    link.addEventListener("click", event => {
        if (link.getAttribute("href") === "#") {
            event.preventDefault();
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeQuickView();
        closeCart();
        closeWishlist();
        mobileMenu.classList.remove("open");
    }
});

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: .12
    }
);

document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
});

const productsGrid = document.getElementById("productsGrid");

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("pageLoader").classList.add("hide");
    }, 700);

    updateWishlistCount();
    updateBagCount();
    updateWishlistUI();
    syncFilterButtons();
    applyFilters();
    renderCart();
    renderWishlist();
});