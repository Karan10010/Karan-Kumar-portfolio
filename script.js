     // ============================================
// Lab 06 — JavaScript Interactive Portfolio
// ============================================


// ─── Feature 9: Preloader ───────────────────
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => { preloader.style.display = "none"; }, 600);
    }
});


// ─── Feature 2: Dark Mode / Light Mode ──────
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        if (document.body.classList.contains("light-mode")) {
            themeToggle.textContent = "🌙 Dark Mode";
        } else {
            themeToggle.textContent = "☀️ Light Mode";
        }
    });
}


// ─── Feature 3: Typing Animation ────────────
const typingTexts = [
    "Software Engineer",
    "Frontend Developer",
    "React.js Developer",
    "UI/UX Enthusiast"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const typingEl = document.querySelector(".typing-text");
    if (!typingEl) return;

    const currentText = typingTexts[textIndex];

    if (!isDeleting) {
        typingEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        typingEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
        }
    }
    setTimeout(typeEffect, isDeleting ? 60 : 100);
}

typeEffect();


// ─── Feature 4: Scroll Reveal Animation ─────
window.addEventListener("scroll", reveal);

function reveal() {
    const sections = document.querySelectorAll(".reveal");

    sections.forEach(section => {
        const windowHeight = window.innerHeight;
        const sectionTop = section.getBoundingClientRect().top;
        const revealPoint = 150;

        if (sectionTop < windowHeight - revealPoint) {
            section.classList.add("active");
        }
    });
}

// Run once on load
reveal();


// ─── Feature 5: Active Navigation Highlight ─
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");
const navCollapse = document.querySelector(".navbar-collapse");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (navCollapse && navCollapse.classList.contains("show") && typeof bootstrap !== "undefined") {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
            bsCollapse.hide();
        }
    });
});

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") && link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});


// ─── Feature 6: Project Filtering System ────
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        // Active button style
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        projectCards.forEach(card => {
            if (filter === "all" || card.classList.contains(filter)) {
                card.style.display = "block";
                card.style.animation = "fadeInUp 0.4s ease";
            } else {
                card.style.display = "none";
            }
        });
    });
});


// ─── Feature 7: Contact Form Validation ─────
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.querySelector("#contactName").value.trim();
        const email = document.querySelector("#contactEmail").value.trim();
        const subject = document.querySelector("#contactSubject").value;
        const message = document.querySelector("#contactMessage").value.trim();

        if (name === "" || email === "" || message === "") {
            formStatus.textContent = "Please fill in all required fields.";
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formStatus.textContent = "Please enter a valid email address.";
            return;
        }

        formStatus.textContent = "Sending your message...";

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            if (!response.ok) {
                throw new Error('Unable to send message.');
            }

            formStatus.textContent = "Message sent! Thank you — I will review your submission shortly.";
            formStatus.classList.add('success');
            contactForm.reset();
        } catch (error) {
            formStatus.textContent = "Something went wrong. Please try again later.";
            formStatus.classList.remove('success');
            console.error(error);
        }
    });
}


// ─── Feature 8: Scroll To Top Button ────────
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
});

if (topBtn) {
    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// ─── Navbar scroll effect ────────────────────
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar-ultra");
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.background = "rgba(10, 10, 10, 0.98)";
        } else {
            nav.style.background = "";
        }
    }
});


// ─── Animate skill & experience cards ────────
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll(".skill-card, .timeline-content, .project-card").forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
});


// ─── Footer year ─────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const items = [
        document.querySelector(".footer-logo"),
        document.querySelector(".footer-social"),
        document.querySelector(".footer-bottom")
    ];
    items.forEach((el, i) => {
        if (el) setTimeout(() => el.classList.add("animate__fadeInUp"), i * 300);
    });
});