const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const bagCount = document.getElementById("bagCount");
const wishlistCount = document.getElementById("wishlistCount");
const toast = document.getElementById("toast");

let bagItems = 0;
let wishlistItems = 0;
let currentProduct = null;
let modalQuantity = 1;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function updateBag(count) {
    bagItems += count;
    bagCount.textContent = bagItems;
}

function updateWishlist() {
    wishlistCount.textContent = wishlistItems;
}

document.querySelectorAll(".size-btn").forEach(button => {
    button.addEventListener("click", () => {
        const parent = button.closest(".size-row");

        parent.querySelectorAll(".size-btn").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});

document.querySelectorAll(".qty-plus").forEach(button => {
    button.addEventListener("click", () => {
        const row = button.closest(".quantity-row");
        const quantity = row.querySelector(".quantity");
        let value = Number(quantity.textContent);

        if (value < 10) {
            value++;
            quantity.textContent = value;
        }
    });
});

document.querySelectorAll(".qty-minus").forEach(button => {
    button.addEventListener("click", () => {
        const row = button.closest(".quantity-row");
        const quantity = row.querySelector(".quantity");
        let value = Number(quantity.textContent);

        if (value > 1) {
            value--;
            quantity.textContent = value;
        }
    });
});

document.querySelectorAll(".add-bag").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const selectedSize = card.querySelector(".size-btn.selected");
        const quantity = Number(card.querySelector(".quantity").textContent);

        if (!selectedSize) {
            showToast("Please select a size");
            return;
        }

        updateBag(quantity);
        showToast(quantity + " item added to bag");
    });
});

document.querySelectorAll(".wishlist-btn").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");

        const icon = button.querySelector("i");

        if (button.classList.contains("active")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            wishlistItems++;
            showToast("Added to wishlist");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
            wishlistItems--;
            showToast("Removed from wishlist");
        }

        updateWishlist();
    });
});

searchInput.addEventListener("input", () => {
    const search = searchInput.value.toLowerCase().trim();

    document.querySelectorAll(".product-card").forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        if (name.includes(search) || category.includes(search)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;

        document.querySelectorAll(".product-card").forEach(card => {
            if (card.dataset.category === category) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });

        document.getElementById("trending").scrollIntoView({
            behavior: "smooth"
        });

        showToast(category + " products");
    });
});

document.getElementById("viewAllBtn").addEventListener("click", () => {
    document.querySelectorAll(".product-card").forEach(card => {
        card.style.display = "";
    });

    searchInput.value = "";

    showToast("Showing all products");
});

document.getElementById("shopNowBtn").addEventListener("click", () => {
    document.getElementById("trending").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("featuredBtn").addEventListener("click", () => {
    document.getElementById("trending").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("offerBtn").addEventListener("click", () => {
    document.getElementById("trending").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("profileBtn").addEventListener("click", () => {
    showToast("Profile feature coming soon");
});

document.getElementById("wishlistBtn").addEventListener("click", () => {
    showToast("Wishlist: " + wishlistItems + " item(s)");
});

document.getElementById("bagBtn").addEventListener("click", () => {
    showToast("Bag contains " + bagItems + " item(s)");
});

const modal = document.getElementById("quickViewModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalBrand = document.getElementById("modalBrand");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalRating = document.getElementById("modalRating");
const modalPrice = document.getElementById("modalPrice");
const modalQuantityElement = document.getElementById("modalQuantity");

document.querySelectorAll(".quick-view").forEach(button => {
    button.addEventListener("click", () => {
        currentProduct = button.closest(".product-card");

        modalImage.src = currentProduct.querySelector("img").src;
        modalBrand.textContent = currentProduct.querySelector("h3").textContent;
        modalName.textContent = currentProduct.querySelector(".product-name").textContent;
        modalDescription.textContent = "Premium fashion product designed for everyday style and comfort.";
        modalRating.textContent = currentProduct.querySelector(".rating").textContent;
        modalPrice.textContent = currentProduct.querySelector(".price").textContent;

        modalQuantity = 1;
        modalQuantityElement.textContent = "1";

        document.querySelectorAll(".modal-size").forEach(button => {
            button.classList.remove("selected");
        });

        modal.classList.add("show");
    });
});

document.querySelectorAll(".modal-size").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".modal-size").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});

document.getElementById("modalPlus").addEventListener("click", () => {
    if (modalQuantity < 10) {
        modalQuantity++;
        modalQuantityElement.textContent = modalQuantity;
    }
});

document.getElementById("modalMinus").addEventListener("click", () => {
    if (modalQuantity > 1) {
        modalQuantity--;
        modalQuantityElement.textContent = modalQuantity;
    }
});

document.getElementById("modalAddBag").addEventListener("click", () => {
    const selectedSize = document.querySelector(".modal-size.selected");

    if (!selectedSize) {
        showToast("Please select a size");
        return;
    }

    updateBag(modalQuantity);
    showToast(modalQuantity + " item added to bag");
    modal.classList.remove("show");
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        modal.classList.remove("show");
    }
});