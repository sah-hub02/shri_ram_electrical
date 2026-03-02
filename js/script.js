AOS.init();

document.getElementById("menuBtn").addEventListener("click", function () {
    document.getElementById("mobileMenu").classList.toggle("hidden");
});

 const slides = document.querySelectorAll('#bannerSlider > div');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Auto Slide every 5 seconds
    setInterval(nextSlide, 1500);

    // Initial display
    showSlide(currentSlide);



document.getElementById("contactForm").addEventListener("submit", function (e) {

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let message = document.getElementById("message").value.trim();
    let errorMsg = document.getElementById("errorMsg");

    if (name === "" || email === "" || phone === "" || message === "") {
        e.preventDefault();
        errorMsg.innerText = "⚠ Please fill all fields before submitting!";
    } else {
        errorMsg.innerText = "";
        alert("✅ Message Submitted Successfully!");
    }

});



