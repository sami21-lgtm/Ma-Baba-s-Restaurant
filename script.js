document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Dynamic Intelligent Scroll Tracking System
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // 2. High-Performance Multi-Cuisine Menu Filtering Engine
    const tabButtons = document.querySelectorAll(".tab-btn");
    const menuCards = document.querySelectorAll(".menu-card");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Shift UI Active Indicator state
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const targetCategory = button.getAttribute("data-target");

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");
                if (targetCategory === "all" || cardCategory === targetCategory) {
                    card.style.display = "block";
                    card.style.animation = "fadeIn 0.4s ease forwards";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // 3. Automated Glassmorphic Reservation Form System
    const reservationForm = document.getElementById("resForm");
    const formFeedback = document.getElementById("formFeedback");

    reservationForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Intercept real reload path

        const name = document.getElementById("name").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const guests = document.getElementById("guests").value;
        const seating = document.querySelector('input[name="seating"]:checked').value;

        // Render virtual pipeline response
        formFeedback.classList.remove("hidden");
        formFeedback.innerHTML = `
            <strong>Perfect!</strong> Table reservation request processed for <strong>${name}</strong>.<br>
            Allocated: ${guests} Guest(s) on ${date} at ${time} inside the <strong>${seating} Section</strong>.
        `;
        formFeedback.classList.add("success");

        // Flash target clear down execution
        reservationForm.reset();
    });
});
