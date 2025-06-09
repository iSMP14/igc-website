document.addEventListener("DOMContentLoaded", function () {
  // Navegación suave al hacer scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset =
          document.getElementById("mainHeader")?.offsetHeight || 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Menú móvil
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileMenuBtn.textContent = mobileMenu.classList.contains("hidden")
        ? "☰"
        : "✕";
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenuBtn.textContent = "☰";
      });
    });
  }

  // Efecto scroll en el header
  const header = document.getElementById("mainHeader");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  // Animación de aparición
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // SwiperJS - Carrusel de testimonios
  const testimonialSwiper = new Swiper(".testimonial-swiper-container", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

  // Año actual en el footer
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Canvas animado de fondo
  const canvas = document.getElementById("heroBackgroundCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particlesArray = [];

  function resizeCanvas() {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
  }

  class Particle {
    constructor(x, y, dx, dy, size, color) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      if (this.x + this.size > canvas.width || this.x - this.size < 0)
        this.dx *= -1;
      if (this.y + this.size > canvas.height || this.y - this.size < 0)
        this.dy *= -1;
      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    const count = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const dx = Math.random() * 0.4 - 0.2;
      const dy = Math.random() * 0.4 - 0.2;
      const color = "rgba(170, 170, 170, 0.3)";
      particlesArray.push(new Particle(x, y, dx, dy, size, color));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((p) => p.update());
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = dx * dx + dy * dy;

        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
          const opacity = 1 - distance / 20000;
          ctx.strokeStyle = `rgba(140, 140, 140, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function setupHeroAnimation() {
    resizeCanvas();
    initParticles();
    animateParticles();
  }

  window.addEventListener("resize", () => {
    setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 100);
  });

  setupHeroAnimation();
});
