const SITE_PASSWORD = "cody2026";
const AUTH_KEY = "cc-site-access-granted";

const body = document.body;
const loginForm = document.getElementById("login-form");
const passwordInput = document.getElementById("site-password");
const togglePasswordBtn = document.getElementById("toggle-password");
const loginError = document.getElementById("login-error");
const navToggleBtn = document.getElementById("nav-toggle");
const topNav = document.querySelector(".top-nav");
const navLinks = document.querySelectorAll(".nav-link");
const revealSections = document.querySelectorAll(".reveal");
const progressBar = document.getElementById("scroll-progress");
const tiltCards = document.querySelectorAll(".tilt-card");

function unlockSite({ saveSession = true } = {}) {
  body.classList.add("site-unlocked");
  if (saveSession) {
    sessionStorage.setItem(AUTH_KEY, "1");
  }
}

function lockSite() {
  body.classList.remove("site-unlocked");
  sessionStorage.removeItem(AUTH_KEY);
}

if (sessionStorage.getItem(AUTH_KEY) === "1") {
  unlockSite({ saveSession: false });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const entered = passwordInput.value.trim();

    if (entered === SITE_PASSWORD) {
      loginError.textContent = "";
      unlockSite();
      passwordInput.value = "";
      return;
    }

    lockSite();
    loginError.textContent = "Incorrect password. Please try again.";
    passwordInput.select();
  });
}

if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener("click", () => {
    const show = passwordInput.type === "password";
    passwordInput.type = show ? "text" : "password";
    togglePasswordBtn.textContent = show ? "Hide" : "Show";
  });
}

if (navToggleBtn && topNav) {
  navToggleBtn.addEventListener("click", () => {
    const isOpen = topNav.classList.toggle("nav-open");
    navToggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      topNav.classList.remove("nav-open");
      navToggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealSections.forEach((section) => sectionObserver.observe(section));

const trackedSections = [...document.querySelectorAll("main section[id]")];

function updateActiveNav() {
  const viewportProbe = window.scrollY + window.innerHeight * 0.35;
  let currentSection = "hero";

  trackedSections.forEach((section) => {
    if (viewportProbe >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const active = link.dataset.section === currentSection;
    link.classList.toggle("active", active);
  });
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;
  progressBar.style.transform = `scaleX(${ratio})`;
}

window.addEventListener("scroll", () => {
  updateActiveNav();
  updateScrollProgress();
});

updateActiveNav();
updateScrollProgress();

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const relX = (event.clientX - bounds.left) / bounds.width;
    const relY = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (relX - 0.5) * 8;
    const rotateX = (0.5 - relY) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  });
});

const canvas = document.getElementById("bg-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let width = 0;
let height = 0;
let particles = [];

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * height;
  }

  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * height;
    this.size = Math.random() * 2.2 + 0.8;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = -Math.random() * 0.55 - 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y < -10 || this.x < -20 || this.x > width + 20) {
      this.reset();
      this.y = height + Math.random() * 40;
    }
  }

  draw() {
    ctx.fillStyle = "rgba(59, 227, 186, 0.45)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function resizeCanvas() {
  if (!canvas || !ctx) {
    return;
  }

  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  const count = Math.min(120, Math.max(35, Math.floor(width / 14)));
  particles = Array.from({ length: count }, () => new Particle());
}

function renderCanvas() {
  if (!canvas || !ctx) {
    return;
  }

  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();

    for (let i = index + 1; i < particles.length; i += 1) {
      const other = particles[i];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 110) {
        ctx.strokeStyle = `rgba(255, 209, 115, ${0.15 - dist / 850})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(renderCanvas);
}

if (canvas && ctx) {
  resizeCanvas();
  renderCanvas();
  window.addEventListener("resize", resizeCanvas);
}
