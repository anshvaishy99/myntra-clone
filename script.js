let bagCount = 0;

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const searchValue = searchInput.value.trim();

            if (searchValue === "") {
                alert("Please enter something to search.");
            } else {
                alert(`Searching for "${searchValue}"...`);
            }
        }
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
        alert(`Opening ${category} collection...`);
    });
});

const viewCategoriesBtn = document.getElementById("viewCategoriesBtn");

if (viewCategoriesBtn) {
    viewCategoriesBtn.addEventListener("click", function () {
        alert("More categories will be available soon!");
    });
}

const viewTrendingBtn = document.getElementById("viewTrendingBtn");

if (viewTrendingBtn) {
    viewTrendingBtn.addEventListener("click", function () {
        alert("Showing all trending products...");
    });
}

const featuredViewAll = document.getElementById("featuredViewAll");

if (featuredViewAll) {
    featuredViewAll.addEventListener("click", function () {
        alert("Showing all featured products...");
    });
}

const heartButtons = document.querySelectorAll(".product-heart");

heartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const icon = button.querySelector("i");

        button.classList.toggle("active");

        if (button.classList.contains("active")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }
    });
});

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
        alert("Your wishlist will appear here.");
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

document.addEventListener("DOMContentLoaded", function () {
    console.log("Myntra Clone loaded successfully.");
});