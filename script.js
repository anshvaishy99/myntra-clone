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

function updateActiveFilters() {
    activeFilters.innerHTML = "";

    const labels = {
        category: {
            men: "Men",
            women: "Women",
            kids: "Kids",
            beauty: "Beauty"
        },
        price: {
            "under-1000": "Under ₹1,000",
            "1000-2000": "₹1,000–₹2,000",
            "above-2000": "Above ₹2,000"
        },
        rating: {
            "4": "4★+",
            "4.5": "4.5★+"
        },
        discount: {
            "20": "20%+ Off",
            "30": "30%+ Off",
            "40": "40%+ Off"
        }
    };

    let count = 0;

    Object.keys(filters).forEach(key => {
        const value = filters[key];

        if (value !== "all") {
            count++;

            const chip = document.createElement("div");
            chip.className = "active-filter";

            chip.innerHTML = `
                <span>${labels[key][value]}</span>
                <button type="button" data-remove="${key}">×</button>
            `;

            activeFilters.appendChild(chip);
        }
    });

    filterCount.textContent = count;

    if (count) {
        filterCount.classList.add("show");
    } else {
        filterCount.classList.remove("show");
    }

    activeFilters.querySelectorAll("[data-remove]").forEach(button => {
        button.addEventListener("click", () => {
            filters[button.dataset.remove] = "all";
            syncFilterButtons();
            applyFilters();
        });
    });
}

function syncFilterButtons() {
    document.querySelectorAll(".filter-option").forEach(button => {
        button.classList.remove("active");
    });

    document
        .querySelector(`[data-filter-category="${filters.category}"]`)
        ?.classList.add("active");

    document
        .querySelector(`[data-price="${filters.price}"]`)
        ?.classList.add("active");

    document
        .querySelector(`[data-rating="${filters.rating}"]`)
        ?.classList.add("active");

    document
        .querySelector(`[data-discount="${filters.discount}"]`)
        ?.classList.add("active");
}

function productMatches(product) {
    const category = product.dataset.category;
    const price = Number(product.dataset.price);
    const rating = Number(product.dataset.rating);
    const discount = Number(product.dataset.discount);

    if (
        filters.category !== "all" &&
        category !== filters.category
    ) {
        return false;
    }

    if (filters.price === "under-1000" && price >= 1000) {
        return false;
    }

    if (
        filters.price === "1000-2000" &&
        (price < 1000 || price > 2000)
    ) {
        return false;
    }

    if (filters.price === "above-2000" && price <= 2000) {
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

    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue) {
        const searchableText = `
            ${product.dataset.name}
            ${product.dataset.brand}
            ${product.dataset.category}
            ${product.querySelector(".product-info > p").textContent}
        `.toLowerCase();

        if (!searchableText.includes(searchValue)) {
            return false;
        }
    }

    return true;
}

function applyFilters() {
    const matchedProducts = products.filter(productMatches);
    const sortValue = sortSelect.value;

    const sortedProducts = [...matchedProducts].sort((a, b) => {
        if (sortValue === "price-low") {
            return Number(a.dataset.price) - Number(b.dataset.price);
        }

        if (sortValue === "price-high") {
            return Number(b.dataset.price) - Number(a.dataset.price);
        }

        if (sortValue === "rating") {
            return Number(b.dataset.rating) - Number(a.dataset.rating);
        }

        if (sortValue === "discount") {
            return Number(b.dataset.discount) - Number(a.dataset.discount);
        }

        return 0;
    });

    const grid = document.getElementById("productGrid");

    sortedProducts.forEach(product => {
        grid.appendChild(product);
    });

    products.forEach(product => {
        product.style.display = matchedProducts.includes(product)
            ? ""
            : "none";
    });

    resultCount.textContent =
        `${matchedProducts.length} ${matchedProducts.length === 1 ? "style" : "styles"} found`;

    if (!matchedProducts.length) {
        noResults.classList.add("show");
    } else {
        noResults.classList.remove("show");
    }

    updateActiveFilters();
}

document.querySelectorAll("[data-filter-category]").forEach(button => {
    button.addEventListener("click", () => {
        filters.category = button.dataset.filterCategory;
        syncFilterButtons();
        applyFilters();
    });
});

document.querySelectorAll("[data-price]").forEach(button => {
    button.addEventListener("click", () => {
        filters.price = button.dataset.price;
        syncFilterButtons();
        applyFilters();
    });
});

document.querySelectorAll("[data-rating]").forEach(button => {
    button.addEventListener("click", () => {
        filters.rating = button.dataset.rating;
        syncFilterButtons();
        applyFilters();
    });
});

document.querySelectorAll("[data-discount]").forEach(button => {
    button.addEventListener("click", () => {
        filters.discount = button.dataset.discount;
        syncFilterButtons();
        applyFilters();
    });
});

sortSelect.addEventListener("change", applyFilters);

filterToggle.addEventListener("click", () => {
    filterPanel.classList.toggle("open");
});

resetFilters.addEventListener("click", () => {
    filters.category = "all";
    filters.price = "all";
    filters.rating = "all";
    filters.discount = "all";

    searchInput.value = "";
    sortSelect.value = "relevance";

    syncFilterButtons();
    applyFilters();
    showToast("All filters reset");
});

noResultsReset.addEventListener("click", () => {
    resetFilters.click();
});

searchInput.addEventListener("input", () => {
    clearSearch.style.display = searchInput.value ? "block" : "none";
    applyFilters();
});

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    applyFilters();
    searchInput.focus();
});

document.querySelectorAll(".vibe-card").forEach(card => {
    card.addEventListener("click", () => {
        filters.category = card.dataset.category;
        syncFilterButtons();
        applyFilters();

        document
            .getElementById("products")
            .scrollIntoView({ behavior: "smooth" });
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

        const selectedSize = product.querySelector(".size-row button.selected");

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
    modalPrice.textContent = formatPrice(product.dataset.price);
    modalQty.textContent = "1";

    modalSizes.innerHTML = "";

    const productSizes = [
        ...product.querySelectorAll(".size-row button")
    ];

    productSizes.forEach(sizeButton => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = sizeButton.textContent;

        button.addEventListener("click", event => {
            event.preventDefault();

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

function openCart() {
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

bagBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

profileBtn.addEventListener("click", () => {
    showToast("Profile section coming soon");
});

wishlistBtn.addEventListener("click", () => {
    showToast(
        wishlist.length
            ? `${wishlist.length} item(s) in wishlist`
            : "Your wishlist is empty"
    );
});

mobileWishlistBtn.addEventListener("click", () => {
    wishlistBtn.click();
});

mobileBagBtn.addEventListener("click", openCart);

mobileProfileBtn.addEventListener("click", () => {
    profileBtn.click();
});

mobileHomeBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
    });
});

document.querySelectorAll(".occasion-card").forEach(card => {
    card.addEventListener("click", () => {
        showToast(card.dataset.message);
    });
});

document.getElementById("copyOffer").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText("STYLE20");
        showToast("STYLE20 copied");
    } catch {
        showToast("Code: STYLE20");
    }
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!bag.length) {
        showToast("Your bag is empty");
        return;
    }

    showToast("Checkout demo opened");
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeQuickView();
        closeCart();
        mobileMenu.classList.remove("open");
    }
});

function startPageReveal() {
    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-card"
    );

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });

        return;
    }

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
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

const pageLoader = document.getElementById("pageLoader");

window.addEventListener("load", () => {
    setTimeout(() => {
        pageLoader.classList.add("loaded");

        document
            .querySelector(".reveal-hero")
            ?.classList.add("visible");

        startPageReveal();
    }, 700);
});

updateWishlistCount();
updateBagCount();
updateWishlistUI();
syncFilterButtons();
applyFilters();
renderCart();