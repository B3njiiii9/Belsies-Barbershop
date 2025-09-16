// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Belsies Barbershop website loaded");

  // --- Hero Text Animation ---
  const heroText = document.querySelector(".hero-text h1");
  if (heroText) {
    heroText.style.opacity = "0";
    setTimeout(() => {
      heroText.style.transition = "opacity 1.5s ease";
      heroText.style.opacity = "1";
    }, 500);
  }

  // --- About Section Animation ---
  const aboutSection = document.querySelector(".about");
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutSection.classList.add("fade-in-up");
        }
      });
    }, { threshold: 0.3 });
    observer.observe(aboutSection);
  }

  // --- Animate Sections on Load ---
  const sections = document.querySelectorAll('.about, .stats, .team');
  sections.forEach(el => {
    el.animate(
      [
        { opacity: 0, transform: 'translateY(30px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 800, easing: 'ease-out', fill: 'forwards' }
    );
  });

  // --- MENU TOGGLE ---
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector("nav ul"); // Use your nav UL directly

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      const icon = menuToggle.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

});
