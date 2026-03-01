const SITE_PASSWORD = "cody2026";
const AUTH_KEY = "cc-site-access-granted";

const body = document.body;
const loginScreen = document.getElementById("login-screen");
const siteShell = document.getElementById("site-shell");
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

function setAuthState(unlocked, { persist = false } = {}) {
  body.classList.toggle("site-unlocked", unlocked);
  body.classList.toggle("site-locked", !unlocked);

  if (siteShell) {
    siteShell.setAttribute("aria-hidden", unlocked ? "false" : "true");
  }
  if (loginScreen) {
    loginScreen.setAttribute("aria-hidden", unlocked ? "true" : "false");
  }

  if (persist) {
    if (unlocked) {
      sessionStorage.setItem(AUTH_KEY, "1");
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  }
}

setAuthState(sessionStorage.getItem(AUTH_KEY) === "1");

if (passwordInput && body.classList.contains("site-locked")) {
  setTimeout(() => passwordInput.focus(), 80);
}

if (loginForm && passwordInput) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === SITE_PASSWORD) {
      loginError.textContent = "";
      setAuthState(true, { persist: true });
      passwordInput.value = "";
      return;
    }

    setAuthState(false, { persist: true });
    loginError.textContent = "Incorrect password. Please try again.";
    passwordInput.select();
  });
}

if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener("click", () => {
    const reveal = passwordInput.type === "password";
    passwordInput.type = reveal ? "text" : "password";
    togglePasswordBtn.textContent = reveal ? "Hide" : "Show";
  });
}

if (navToggleBtn && topNav) {
  navToggleBtn.addEventListener("click", () => {
    const menuOpen = topNav.classList.toggle("nav-open");
    navToggleBtn.setAttribute("aria-expanded", String(menuOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      topNav.classList.remove("nav-open");
      navToggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && topNav?.classList.contains("nav-open")) {
    topNav.classList.remove("nav-open");
    navToggleBtn?.setAttribute("aria-expanded", "false");
  }
});

if (revealSections.length > 0) {
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
}

const trackedSections = [...document.querySelectorAll("main section[id]")];

function updateActiveNav() {
  if (trackedSections.length === 0) {
    return;
  }

  const viewportProbe = window.scrollY + window.innerHeight * 0.35;
  let currentSectionId = trackedSections[0].id;

  trackedSections.forEach((section) => {
    if (viewportProbe >= section.offsetTop) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const active = link.dataset.section === currentSectionId;
    link.classList.toggle("active", active);
  });
}

function updateScrollProgress() {
  if (!progressBar) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
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
    const rotateY = (relX - 0.5) * 7;
    const rotateX = (0.5 - relY) * 7;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
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
    this.size = Math.random() * 2 + 0.7;
    this.vx = (Math.random() - 0.5) * 0.18;
    this.vy = -Math.random() * 0.5 - 0.18;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y < -20 || this.x < -20 || this.x > width + 20) {
      this.reset();
      this.y = height + Math.random() * 30;
    }
  }

  draw() {
    ctx.fillStyle = "rgba(23, 231, 212, 0.45)";
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

  const particleCount = Math.min(130, Math.max(40, Math.floor(width / 14)));
  particles = Array.from({ length: particleCount }, () => new Particle());
}

function animateCanvas() {
  if (!canvas || !ctx) {
    return;
  }

  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();

    for (let i = index + 1; i < particles.length; i += 1) {
      const peer = particles[i];
      const dx = particle.x - peer.x;
      const dy = particle.y - peer.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 120) {
        ctx.strokeStyle = `rgba(134, 251, 255, ${0.14 - distance / 900})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(peer.x, peer.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animateCanvas);
}

if (canvas && ctx) {
  resizeCanvas();
  animateCanvas();
  window.addEventListener("resize", resizeCanvas);
}
