const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const productCards = [...document.querySelectorAll(".product-card")];
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const categoryCards = [...document.querySelectorAll(".category-card")];

let bagCount = Number(localStorage.getItem("myntraBagCount") || 0);
let wishlistCount = Number(localStorage.getItem("myntraWishlistCount") || 0);
let selectedProduct = null;
let modalQuantity = 1;

const bagCountEl = document.getElementById("bagCount");
const wishlistCountEl = document.getElementById("wishlistCount");

function updateCounters() {
    bagCountEl.textContent = bagCount;
    wishlistCountEl.textContent = wishlistCount;
    localStorage.setItem("myntraBagCount", bagCount);
    localStorage.setItem("myntraWishlistCount", wishlistCount);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    const text = toast.querySelector("span");
    text.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function filterProducts(category = "all", searchTerm = "") {
    let visible = 0;

    productCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardName = card.dataset.name.toLowerCase();
        const matchesCategory = category === "all" || cardCategory === category;
        const matchesSearch = cardName.includes(searchTerm.toLowerCase());

        if (matchesCategory && matchesSearch) {
            card.style.display = "";
            visible++;
        } else {
            card.style.display = "none";
        }
    });

    emptyState.classList.toggle("show", visible === 0);
}

function setActiveFilter(category) {
    filterButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.filter === category);
    });

    categoryCards.forEach(card => {
        card.classList.toggle("active", card.dataset.category === category);
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.filter;
        setActiveFilter(category);
        filterProducts(category, searchInput.value.trim());

        document.getElementById("products").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

categoryCards.forEach(card => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;

        setActiveFilter(category);
        filterProducts(category, searchInput.value.trim());

        document.getElementById("products").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

searchInput.addEventListener("input", () => {
    clearSearch.style.display = searchInput.value ? "block" : "none";
    filterProducts(
        document.querySelector(".filter-btn.active")?.dataset.filter || "all",
        searchInput.value.trim()
    );
});

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    filterProducts(
        document.querySelector(".filter-btn.active")?.dataset.filter || "all",
        ""
    );
    searchInput.focus();
});

document.querySelectorAll(".sizes button").forEach(button => {
    button.addEventListener("click", () => {
        const parent = button.closest(".sizes");

        parent.querySelectorAll("button").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});

document.querySelectorAll(".wishlist-toggle").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");

        if (button.classList.contains("active")) {
            wishlistCount++;
            showToast("Added to wishlist");
        } else {
            wishlistCount = Math.max(0, wishlistCount - 1);
            showToast("Removed from wishlist");
        }

        updateCounters();
    });
});

document.querySelectorAll(".qty-minus").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.parentElement.querySelector(".qty-value");
        let quantity = Number(value.textContent);

        if (quantity > 1) {
            quantity--;
            value.textContent = quantity;
        }
    });
});

document.querySelectorAll(".qty-plus").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.parentElement.querySelector(".qty-value");
        let quantity = Number(value.textContent);

        if (quantity < 10) {
            quantity++;
            value.textContent = quantity;
        }
    });
});

document.querySelectorAll(".add-bag").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const selectedSize = card.querySelector(".sizes button.selected");
        const quantity = Number(card.querySelector(".qty-value").textContent);

        if (!selectedSize) {
            showToast("Please select a size first");
            return;
        }

        bagCount += quantity;
        updateCounters();

        button.innerHTML = '<i class="fa-solid fa-check"></i> Added';

        setTimeout(() => {
            button.innerHTML = 'Add to Bag <i class="fa-solid fa-bag-shopping"></i>';
        }, 1200);

        showToast(`${quantity} item${quantity > 1 ? "s" : ""} added to bag`);
    });
});

const modal = document.getElementById("quickViewModal");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalBrand = document.getElementById("modalBrand");
const modalName = document.getElementById("modalName");
const modalRating = document.getElementById("modalRating");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalOldPrice = document.getElementById("modalOldPrice");
const modalDiscount = document.getElementById("modalDiscount");
const modalSizes = document.getElementById("modalSizes");
const modalQty = document.getElementById("modalQty");

function openQuickView(card) {
    selectedProduct = card;
    modalQuantity = 1;

    const image = card.querySelector(".product-image-wrap img");
    const brand = card.querySelector(".product-brand");
    const name = card.querySelector("h3");
    const rating = card.querySelector(".rating");
    const description = card.querySelector(".product-details > p");
    const price = card.querySelector(".price-row strong");
    const oldPrice = card.querySelector(".price-row del");
    const discount = card.querySelector(".price-row span");
    const sizes = card.querySelectorAll(".sizes button");

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalBrand.textContent = brand.textContent;
    modalName.textContent = name.textContent;
    modalRating.textContent = rating.textContent;
    modalDescription.textContent = description.textContent;
    modalPrice.textContent = price.textContent;
    modalOldPrice.textContent = oldPrice.textContent;
    modalDiscount.textContent = discount.textContent;
    modalQty.textContent = modalQuantity;

    modalSizes.innerHTML = "";

    sizes.forEach(size => {
        const button = document.createElement("button");
        button.textContent = size.textContent;

        button.addEventListener("click", () => {
            modalSizes.querySelectorAll("button").forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
        });

        modalSizes.appendChild(button);
    });

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

document.querySelectorAll(".quick-view").forEach(button => {
    button.addEventListener("click", () => {
        openQuickView(button.closest(".product-card"));
    });
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

document.getElementById("modalMinus").addEventListener("click", () => {
    if (modalQuantity > 1) {
        modalQuantity--;
        modalQty.textContent = modalQuantity;
    }
});

document.getElementById("modalPlus").addEventListener("click", () => {
    if (modalQuantity < 10) {
        modalQuantity++;
        modalQty.textContent = modalQuantity;
    }
});

document.getElementById("modalAdd").addEventListener("click", () => {
    const selectedSize = modalSizes.querySelector(".selected");

    if (!selectedSize) {
        showToast("Please select a size first");
        return;
    }

    bagCount += modalQuantity;
    updateCounters();

    closeModal();
    showToast(`${modalQuantity} item${modalQuantity > 1 ? "s" : ""} added to bag`);
});

document.getElementById("shopNowBtn").addEventListener("click", () => {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("exploreBtn").addEventListener("click", () => {
    document.getElementById("trending").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("editorialBtn").addEventListener("click", () => {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("offerBtn").addEventListener("click", () => {
    showToast("Exclusive offers unlocked");
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("viewAllCategories").addEventListener("click", () => {
    setActiveFilter("all");
    filterProducts("all", "");
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("profileBtn").addEventListener("click", () => {
    showToast("Profile feature coming soon");
});

document.getElementById("wishlistBtn").addEventListener("click", () => {
    showToast(`${wishlistCount} item${wishlistCount === 1 ? "" : "s"} in wishlist`);
});

document.getElementById("bagBtn").addEventListener("click", () => {
    showToast(`${bagCount} item${bagCount === 1 ? "" : "s"} in your bag`);
});

document.getElementById("mobileWishlist").addEventListener("click", () => {
    showToast(`${wishlistCount} item${wishlistCount === 1 ? "" : "s"} in wishlist`);
});

document.getElementById("mobileBag").addEventListener("click", () => {
    showToast(`${bagCount} item${bagCount === 1 ? "" : "s"} in your bag`);
});

const mobileMenu = document.getElementById("mobileMenu");
const mobileNav = document.getElementById("mobileNav");

mobileMenu.addEventListener("click", () => {
    mobileNav.classList.toggle("show");

    const icon = mobileMenu.querySelector("i");

    if (mobileNav.classList.contains("show")) {
        icon.className = "fa-solid fa-xmark";
    } else {
        icon.className = "fa-solid fa-bars";
    }
});

mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mobileNav.classList.remove("show");
        mobileMenu.querySelector("i").className = "fa-solid fa-bars";
    });
});

document.querySelectorAll(".occasion-card").forEach(card => {
    card.addEventListener("click", () => {
        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });

        showToast("Showing styles for this occasion");
    });
});

const revealElements = document.querySelectorAll(
    ".category-card, .product-card, .editorial, .occasion-card, .offer-section, .trust-strip > div"
);

revealElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "opacity 0.7s ease, transform 0.7s ease";
});

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();

        if (mobileNav.classList.contains("show")) {
            mobileNav.classList.remove("show");
            mobileMenu.querySelector("i").className = "fa-solid fa-bars";
        }
    }
});

updateCounters();
filterProducts("all", "");