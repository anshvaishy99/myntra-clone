/* ==========================================
   MYNTRA CLONE - DAY 1 JAVASCRIPT
========================================== */


/* ==========================================
   SEARCH
========================================== */

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keyup", function (event) {

        const searchValue = event.target.value.toLowerCase().trim();

        if (event.key === "Enter" && searchValue !== "") {
            alert(`Searching for: ${searchValue}`);
        }

    });
}


/* ==========================================
   WISHLIST
========================================== */

const wishlistButtons = document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const icon = button.querySelector("i");

        if (icon.classList.contains("fa-regular")) {

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            button.style.color = "#ff3f6c";

        } else {

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            button.style.color = "#282c3f";

        }

    });

});


/* ==========================================
   SHOP NOW BUTTON
========================================== */

const shopButton = document.querySelector(".shop-btn");

if (shopButton) {

    shopButton.addEventListener("click", function () {

        const trendingSection =
            document.querySelector(".trending-section");

        if (trendingSection) {

            trendingSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


/* ==========================================
   CATEGORY CARDS
========================================== */

const categoryCards =
    document.querySelectorAll(".category-card");

categoryCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const categoryName =
            card.querySelector("h3").textContent;

        alert(`Opening ${categoryName} collection`);

    });

});


/* ==========================================
   PROFILE / WISHLIST / BAG
========================================== */

const navActions =
    document.querySelectorAll(".nav-action");

navActions.forEach(function (action) {

    action.addEventListener("click", function () {

        const actionName =
            action.querySelector("span").textContent;

        if (actionName === "Profile") {

            alert("Profile section coming soon!");

        } else if (actionName === "Wishlist") {

            alert("Your wishlist will appear here.");

        } else if (actionName === "Bag") {

            alert("Your shopping bag is currently empty.");

        }

    });

});


/* ==========================================
   VIEW ALL BUTTON
========================================== */

const viewAllButtons =
    document.querySelectorAll(".view-all");

viewAllButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();

        alert("More products will be available soon!");

    });

});


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Myntra Clone loaded successfully.");

});