AOS.init();

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
    });
}

const slides = document.querySelectorAll("#bannerSlider > div");
let currentSlide = 0;
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.opacity = i === index ? "1" : "0";
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

if (totalSlides > 0) {
    setInterval(nextSlide, 1500);
    showSlide(currentSlide);
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();
        const errorMsg = document.getElementById("errorMsg");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneDigits = phone.replace(/\D/g, "");

        if (name.length < 2) {
            e.preventDefault();
            errorMsg.innerText = "Please enter a valid name.";
            return;
        }

        if (!emailPattern.test(email)) {
            e.preventDefault();
            errorMsg.innerText = "Please enter a valid email address.";
            return;
        }

        if (phoneDigits.length < 10) {
            e.preventDefault();
            errorMsg.innerText = "Please enter a valid phone number.";
            return;
        }

        if (message.length < 10) {
            e.preventDefault();
            errorMsg.innerText = "Message should be at least 10 characters.";
            return;
        }

        e.preventDefault();
        errorMsg.innerText = "";

        const savedLeads = localStorage.getItem("contactLeads");
        let leads = [];
        try {
            const parsed = savedLeads ? JSON.parse(savedLeads) : [];
            leads = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            leads = [];
        }
        leads.unshift({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: name,
            email: email,
            phone: phoneDigits,
            message: message,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem("contactLeads", JSON.stringify(leads));

        window.location.href = "success.html";
    });
}




const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");

if (reviewForm && reviewList) {
    const reviewName = document.getElementById("reviewName");
    const reviewMessage = document.getElementById("reviewMessage");
    const reviewRating = document.getElementById("reviewRating");
    const reviewError = document.getElementById("reviewError");
    const storageKey = "customerReviews";

    function escapeHtml(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizeRating(value) {
        const num = Number(value);
        if (Number.isNaN(num)) {
            return 5;
        }
        return Math.min(5, Math.max(1, num));
    }

    function getStarsHtml(rating) {
        const safeRating = normalizeRating(rating);
        let stars = "";
        for (let i = 1; i <= 5; i += 1) {
            const starClass = i <= safeRating ? "text-orange-400" : "text-gray-300";
            stars += `<i class="fa-solid fa-star ${starClass}"></i>`;
        }
        return stars;
    }

    function createReviewCard(review) {
        const card = document.createElement("div");
        card.className = "bg-white p-8 rounded-xl shadow-xl transition";
        card.dataset.reviewId = review.id;
        card.innerHTML = `
            <div class="text-orange-400 text-xl mb-3">
                ${getStarsHtml(review.rating)}
            </div>
            <p class="text-gray-600">${escapeHtml(review.message)}</p>
            <div class="mt-4 flex items-center justify-between gap-3">
                <h3 class="font-semibold text-blue-900">- ${escapeHtml(review.name)}</h3>
                <button type="button" data-delete-review="${review.id}" class="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition">
                    Delete
                </button>
            </div>
        `;
        return card;
    }

    function getSavedReviews() {
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
            return [];
        }
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                return [];
            }

            const normalized = parsed
                .filter((item) => item && item.name && item.message)
                .map((item, index) => ({
                    id: item.id || `${Date.now()}-${index}`,
                    name: item.name,
                    message: item.message,
                    rating: normalizeRating(item.rating)
                }));

            localStorage.setItem(storageKey, JSON.stringify(normalized));
            return normalized;
        } catch (error) {
            return [];
        }
    }

    function saveReviews(reviews) {
        localStorage.setItem(storageKey, JSON.stringify(reviews));
    }

    function renderSavedReviews() {
        const reviews = getSavedReviews();
        reviews.forEach((review) => {
            reviewList.appendChild(createReviewCard(review));
        });
    }

    renderSavedReviews();

    reviewForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = reviewName.value.trim();
        const message = reviewMessage.value.trim();
        const rating = Number(reviewRating.value);

        if (name === "" || message === "" || Number.isNaN(rating)) {
            reviewError.textContent = "Please enter name, review and star rating.";
            reviewError.classList.remove("hidden");
            return;
        }

        reviewError.classList.add("hidden");

        const reviews = getSavedReviews();
        const newReview = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: name,
            message: message,
            rating: normalizeRating(rating)
        };

        reviews.unshift(newReview);
        saveReviews(reviews);

        reviewList.insertBefore(createReviewCard(newReview), reviewList.firstChild);
        reviewForm.reset();
    });

    reviewList.addEventListener("click", function (event) {
        const deleteButton = event.target.closest("[data-delete-review]");
        if (!deleteButton) {
            return;
        }

        const reviewId = deleteButton.getAttribute("data-delete-review");
        const reviews = getSavedReviews().filter((review) => review.id !== reviewId);
        saveReviews(reviews);

        const card = deleteButton.closest("[data-review-id]");
        if (card) {
            card.remove();
        }
    });
}

