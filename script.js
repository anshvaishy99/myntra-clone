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
    const sizes = [...product.querySelectorAll(".size-row button")].map(button => button.textContent.trim());

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
        !quickModal.classList.contains("show")
    ) {
        document.body.style.overflow = "";
    }
}

function renderWishlist() {
    updateWishlistCount();

    if (!wishlist.length) {
        wishlistBody.innerHTML = `
            <div class="wishlist-empty">
                <i class="fa-regular fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save your favourite styles here and shop them later.</p>
                <button type="button" id="continueWishlistShopping">
                    Continue Shopping
                </button>
            </div>
        `;

        document
            .getElementById("continueWishlistShopping")
            .addEventListener("click", closeWishlist);

        return;
    }

    wishlistBody.innerHTML = wishlist.map((name, index) => {
        const product = getProductByName(name);

        if (!product) {
            return "";
        }

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
                            <button type="button" data-size="${size}" data-index="${index}">
                                ${size}
                            </button>
                        `).join("")}
                    </div>

                    <button
                        type="button"
                        class="wishlist-add"
                        data-index="${index}"
                    >
                        ADD TO BAG
                    </button>
                </div>

                <button
                    type="button"
                    class="wishlist-remove"
                    data-index="${index}"
                    aria-label="Remove from wishlist"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    }).join("");

    wishlistBody.querySelectorAll(".wishlist-size-row button").forEach(button => {
        button.addEventListener("click", () => {
            const parent = button.parentElement;

            parent.querySelectorAll("button").forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
        });
    });

    wishlistBody.querySelectorAll(".wishlist-remove").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);
            wishlist.splice(index, 1);

            saveData();
            updateWishlistCount();
            updateWishlistUI();
            renderWishlist();

            showToast("Removed from wishlist");
        });
    });

    wishlistBody.querySelectorAll(".wishlist-add").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);
            const item = wishlist[index];
            const sizeRow = button.parentElement.querySelector(".wishlist-size-row");
            const selected = sizeRow.querySelector(".selected");

            if (!selected) {
                showToast("Please select a size");
                return;
            }

            const product = getProductByName(item);

            if (!product) {
                showToast("Product unavailable");
                return;
            }

            const data = getProductData(product);

            addToBag({
                name: data.name,
                brand: data.brand,
                price: data.price,
                image: data.image,
                size: selected.dataset.size,
                quantity: 1
            });

            closeWishlist();
        });
    });
}

function toggleWishlist(name) {
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
        (sum, item) => sum + item.price * item.quantity,
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
        !quickModal.classList.contains("show")
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

    const sizes = [...product.querySelectorAll(".size-row button")];

    modalSizes.innerHTML = sizes.map(button => `
        <button type="button" data-size="${button.textContent.trim()}">
            ${button.textContent.trim()}
        </button>
    `).join("");

    modalSizes.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            modalSizes.querySelectorAll("button").forEach(item => {
                item.classList.remove("selected");
            });

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
        !wishlistDrawer.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function applyFilters() {
    const search = searchInput.value.trim().toLowerCase();

    let visibleProducts = products.filter(product => {
        const name = product.dataset.name.toLowerCase();
        const brand = product.dataset.brand.toLowerCase();
        const category = product.dataset.category;
        const price = Number(product.dataset.price);
        const rating = Number(product.dataset.rating);
        const discount = Number(product.dataset.discount);

        const searchMatch =
            !search ||
            name.includes(search) ||
            brand.includes(search);

        let categoryMatch = true;
        let priceMatch = true;
        let ratingMatch = true;
        let discountMatch = true;

        if (filters.category !== "all") {
            categoryMatch = category === filters.category;
        }

        if (filters.price === "under1000") {
            priceMatch = price < 1000;
        }

        if (filters.price === "1000-2000") {
            priceMatch = price >= 1000 && price <= 2000;
        }

        if (filters.price === "above2000") {
            priceMatch = price > 2000;
        }

        if (filters.rating === "4") {
            ratingMatch = rating >= 4;
        }

        if (filters.rating === "4.5") {
            ratingMatch = rating >= 4.5;
        }

        if (filters.discount === "20") {
            discountMatch = discount >= 20;
        }

        if (filters.discount === "30") {
            discountMatch = discount >= 30;
        }

        if (filters.discount === "40") {
            discountMatch = discount >= 40;
        }

        return (
            searchMatch &&
            categoryMatch &&
            priceMatch &&
            ratingMatch &&
            discountMatch
        );
    });

    products.forEach(product => {
        product.style.display = "none";
    });

    const sortValue = sortSelect.value;

    visibleProducts.sort((a, b) => {
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

    visibleProducts.forEach(product => {
        product.style.display = "";
        document.getElementById("productsGrid").appendChild(product);
    });

    resultCount.textContent = visibleProducts.length;

    noResults.classList.toggle(
        "show",
        visibleProducts.length === 0
    );

    updateActiveFilters();
}

function updateActiveFilters() {
    const active = Object.entries(filters).filter(
        ([, value]) => value !== "all"
    );

    filterCount.textContent = active.length;

    const labels = {
        category: {
            men: "Men",
            women: "Women",
            kids: "Kids",
            beauty: "Beauty"
        },
        price: {
            under1000: "Under ₹1,000",
            "1000-2000": "₹1,000–₹2,000",
            above2000: "Above ₹2,000"
        },
        rating: {
            4: "4★ & above",
            4.5: "4.5★ & above"
        },
        discount: {
            20: "20% & above",
            30: "30% & above",
            40: "40% & above"
        }
    };

    activeFilters.innerHTML = active.map(([type, value]) => `
        <span class="active-filter-chip">
            ${labels[type][value]}
        </span>
    `).join("");

    document.querySelectorAll(".filter-option").forEach(button => {
        const type = button.dataset.filter;
        const value = button.dataset.value;

        button.classList.toggle(
            "active",
            filters[type] === value
        );
    });
}

document.querySelectorAll(".wishlist-product").forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        const product = button.closest(".product-card");
        toggleWishlist(product.dataset.name);
    });
});

document.querySelectorAll(".size-row button").forEach(button => {
    button.addEventListener("click", () => {
        const row = button.parentElement;

        row.querySelectorAll("button").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});

document.querySelectorAll(".qty-minus").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.parentElement.querySelector(".qty-value");
        let quantity = Number(value.textContent);

        quantity = Math.max(1, quantity - 1);
        value.textContent = quantity;
    });
});

document.querySelectorAll(".qty-plus").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.parentElement.querySelector(".qty-value");
        let quantity = Number(value.textContent);

        quantity = Math.min(10, quantity + 1);
        value.textContent = quantity;
    });
});

document.querySelectorAll(".add-bag").forEach(button => {
    button.addEventListener("click", () => {
        const product = button.closest(".product-card");
        const selectedSize = product.querySelector(".size-row .selected");
        const quantity = Number(
            product.querySelector(".qty-value").textContent
        );

        if (!selectedSize) {
            showToast("Please select a size");
            return;
        }

        addToBag({
            name: product.dataset.name,
            brand: product.dataset.brand,
            price: Number(product.dataset.price),
            image: product.dataset.image,
            size: selectedSize.textContent.trim(),
            quantity
        });
    });
});

document.querySelectorAll(".quick-view").forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        openQuickView(
            button.closest(".product-card")
        );
    });
});

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

profileBtn.addEventListener("click", () => {
    showToast("Profile feature coming soon");
});

mobileProfileBtn.addEventListener("click", () => {
    showToast("Profile feature coming soon");
});

mobileHomeBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
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
        applyFilters();
    });
});

function resetAllFilters() {
    filters.category = "all";
    filters.price = "all";
    filters.rating = "all";
    filters.discount = "all";

    sortSelect.value = "relevance";
    searchInput.value = "";
    clearSearch.style.display = "none";

    applyFilters();
}

resetFilters.addEventListener("click", resetAllFilters);
noResultsReset.addEventListener("click", resetAllFilters);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeQuickView();
        closeCart();
        closeWishlist();
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

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("pageLoader").classList.add("hide");
    }, 700);

    updateWishlistCount();
    updateWishlistUI();
    updateBagCount();
    renderCart();
    applyFilters();
});