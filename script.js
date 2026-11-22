let bagCount = 0;
let wishlistCount = 0;

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const searchValue = searchInput.value.toLowerCase().trim();
        const products = document.querySelectorAll(".product-card");

        products.forEach(function (product) {
            const productText = product.textContent.toLowerCase();

            product.style.display = productText.includes(searchValue) ? "" : "none";
        });
    });
}

const shopNowBtn = document.getElementById("shopNowBtn");

if (shopNowBtn) {
    shopNowBtn.addEventListener("click", function () {
        document.getElementById("trending").scrollIntoView({
            behavior: "smooth"
        });
    });
}

const offerBtn = document.getElementById("offerBtn");

if (offerBtn) {
    offerBtn.addEventListener("click", function () {
        document.getElementById("featured").scrollIntoView({
            behavior: "smooth"
        });
    });
}

const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach(function (card) {
    card.addEventListener("click", function () {
        const category = card.dataset.category;
        const products = document.querySelectorAll(".product-card");

        products.forEach(function (product) {
            const productText = product.textContent.toLowerCase();
            const categoryText = category.toLowerCase();

            product.style.display = productText.includes(categoryText) ? "" : "none";
        });

        document.getElementById("trending").scrollIntoView({
            behavior: "smooth"
        });
    });
});

const viewCategoriesBtn = document.getElementById("viewCategoriesBtn");

if (viewCategoriesBtn) {
    viewCategoriesBtn.addEventListener("click", function () {
        document.querySelector(".categories-section").scrollIntoView({
            behavior: "smooth"
        });
    });
}

const viewTrendingBtn = document.getElementById("viewTrendingBtn");

if (viewTrendingBtn) {
    viewTrendingBtn.addEventListener("click", function () {
        document.getElementById("trending").scrollIntoView({
            behavior: "smooth"
        });
    });
}

const featuredViewAll = document.getElementById("featuredViewAll");

if (featuredViewAll) {
    featuredViewAll.addEventListener("click", function () {
        document.getElementById("featured").scrollIntoView({
            behavior: "smooth"
        });
    });
}

const heartButtons = document.querySelectorAll(".product-heart");

heartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const icon = button.querySelector("i");

        button.classList.toggle("active");

        if (button.classList.contains("active")) {
            wishlistCount++;
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else {
            wishlistCount--;
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }

        updateWishlistCount();
    });
});

function updateWishlistCount() {
    const wishlistCountElement = document.querySelector(".wishlist-count");

    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlistCount;
    }
}

const bagButtons = document.querySelectorAll(".add-bag-btn");

bagButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        bagCount++;
        updateBagCount();

        const originalText = button.innerHTML;

        button.innerHTML = '<i class="fa-solid fa-check"></i> Added to Bag';
        button.style.background = "#287a3e";

        setTimeout(function () {
            button.innerHTML = originalText;
            button.style.background = "";
        }, 1200);
    });
});

function updateBagCount() {
    const bagCountElement = document.querySelector(".bag-count");

    if (bagCountElement) {
        bagCountElement.textContent = bagCount;
    }
}

const profileBtn = document.getElementById("profileBtn");

if (profileBtn) {
    profileBtn.addEventListener("click", function () {
        alert("Profile login page will open here.");
    });
}

const wishlistBtn = document.getElementById("wishlistBtn");

if (wishlistBtn) {
    wishlistBtn.addEventListener("click", function () {
        if (wishlistCount === 0) {
            alert("Your wishlist is empty.");
        } else {
            alert(`You have ${wishlistCount} item(s) in your wishlist.`);
        }
    });
}

const bagBtn = document.getElementById("bagBtn");

if (bagBtn) {
    bagBtn.addEventListener("click", function () {
        if (bagCount === 0) {
            alert("Your bag is empty.");
        } else {
            alert(`You have ${bagCount} item(s) in your bag.`);
        }
    });
}

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const target = link.getAttribute("href");

        if (target && target.startsWith("#")) {
            const section = document.querySelector(target);

            if (section) {
                event.preventDefault();

                section.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});

const quickViewButtons = document.querySelectorAll(".quick-view-btn");

quickViewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const productCard = button.closest(".product-card");

        const productName =
            productCard.querySelector("h3")?.textContent || "Product";

        const brand =
            productCard.querySelector(".brand")?.textContent || "Myntra";

        const productPrice =
            productCard.querySelector(".price")?.textContent || "Price not available";

        const productImage =
            productCard.querySelector("img")?.src || "";

        const description =
            productCard.querySelector(".product-description")?.textContent ||
            "Premium fashion product.";

        const rating =
            productCard.querySelector(".rating")?.textContent.trim() ||
            "4.5 ★";

        const ratingCount =
            productCard.querySelector(".rating-count")?.textContent.trim() ||
            "1k Ratings";

        const modal = document.createElement("div");

        modal.className = "quick-view-modal active";

        modal.innerHTML = `
            <div class="quick-view-content">
                <button class="close-modal">&times;</button>

                <img src="${productImage}" alt="${productName}">

                <div class="quick-view-details">
                    <p class="brand">${brand}</p>

                    <h2>${productName}</h2>

                    <div class="quick-view-rating">
                        <span class="rating">
                            ${rating}
                        </span>

                        <span class="rating-count">
                            ${ratingCount}
                        </span>
                    </div>

                    <p>${description}</p>

                    <div class="quick-view-price">
                        ${productPrice}
                    </div>

                    <button class="add-bag-btn modal-bag-btn">
                        <i class="fa-solid fa-bag-shopping"></i>
                        Add to Bag
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeButton = modal.querySelector(".close-modal");

        closeButton.addEventListener("click", function () {
            modal.remove();
        });

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.remove();
            }
        });

        const modalBagButton = modal.querySelector(".modal-bag-btn");

        modalBagButton.addEventListener("click", function () {
            bagCount++;
            updateBagCount();

            modalBagButton.innerHTML =
                '<i class="fa-solid fa-check"></i> Added to Bag';

            modalBagButton.style.background = "#287a3e";

            setTimeout(function () {
                modal.remove();
            }, 800);
        });
    });
});

const featuredShopBtn = document.getElementById("featuredShopBtn");

if (featuredShopBtn) {
    featuredShopBtn.addEventListener("click", function () {
        document.getElementById("trending").scrollIntoView({
            behavior: "smooth"
        });
    });
}

const offerShopBtn = document.getElementById("offerShopBtn");

if (offerShopBtn) {
    offerShopBtn.addEventListener("click", function () {
        document.getElementById("trending").scrollIntoView({
            behavior: "smooth"
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Myntra Clone loaded successfully.");
});