/* Canvas Animation - Particle Network */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.fillStyle = 'rgba(0, 245, 212, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(width * 0.1, 100); // Responsive count
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, index) => {
    p.update();
    p.draw();

    // Connect particles
    for (let i = index + 1; i < particles.length; i++) {
      const p2 = particles[i];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.strokeStyle = `rgba(0, 245, 212, ${0.1 - dist / 1500})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
  initParticles();
});
resize();
initParticles();
animate();

/* Puzzle Logic */
const unlockBtn = document.getElementById('unlock-btn');
const puzzleWrapper = document.getElementById('puzzle-wrapper');
const puzzleGrid = document.querySelector('.puzzle-grid');
const puzzleStatus = document.getElementById('puzzle-status');
const heroSection = document.getElementById('hero');
const contentSections = document.querySelectorAll('.content-section');

const SEQUENCE = ['1', '3', '5', '7', '9']; // Simpler sequence
let userSequence = [];

if (unlockBtn) {
  unlockBtn.addEventListener('click', () => {
    puzzleWrapper.classList.remove('hidden');
    unlockBtn.style.display = 'none';
    generateGrid();
  });
}

function generateGrid() {
  puzzleGrid.innerHTML = '';
  for (let i = 1; i <= 9; i++) {
    const item = document.createElement('div');
    item.classList.add('grid-item');
    item.dataset.index = i;
    item.addEventListener('click', handleGridClick);
    puzzleGrid.appendChild(item);
  }
}

function handleGridClick(e) {
  const item = e.target;
  const index = item.dataset.index;

  if (item.classList.contains('active')) return;

  item.classList.add('active');
  userSequence.push(index);

  checkSequence();
}

function checkSequence() {
  // Check match so far
  const currentIndex = userSequence.length - 1;
  if (userSequence[currentIndex] !== SEQUENCE[currentIndex]) {
    // Wrong click
    puzzleStatus.textContent = "Access Denied. Resetting...";
    shakeGrid();
    setTimeout(resetPuzzle, 1000);
    return;
  }

  if (userSequence.length === SEQUENCE.length) {
    puzzleStatus.textContent = "Access Granted.";
    setTimeout(revealPortfolio, 800);
  } else {
    puzzleStatus.textContent = `Decrypting... ${Math.round((userSequence.length / SEQUENCE.length) * 100)}%`;
  }
}

function resetPuzzle() {
  userSequence = [];
  document.querySelectorAll('.grid-item').forEach(el => el.classList.remove('active'));
  puzzleStatus.textContent = "Decrypting...";
}

function shakeGrid() {
  puzzleGrid.style.transform = "translateX(5px)";
  setTimeout(() => puzzleGrid.style.transform = "translateX(-5px)", 50);
  setTimeout(() => puzzleGrid.style.transform = "translateX(5px)", 100);
  setTimeout(() => puzzleGrid.style.transform = "translateX(0)", 150);
}

function revealPortfolio() {
  heroSection.style.display = 'none'; // Or animate out
  // Actually, let's just push the hero up or hide it and show content
  // For now, simple transition

  contentSections.forEach((section, index) => {
    section.classList.remove('hidden-section');
    section.classList.add('revealed');
    section.style.animationDelay = `${index * 0.2}s`;
  });

  // Also show nav links on mobile if we hid them? (kept simple for now)
}

/* Easter Eggs */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  // Konami
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      triggerEasterEgg("Zombie Mode Activated! (Imagine zombies here)");
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function triggerEasterEgg(msg) {
  const modal = document.getElementById('easter-egg-modal');
  const content = document.getElementById('egg-content-area');
  content.textContent = msg;
  modal.classList.add('active');

  document.querySelector('.close-modal').onclick = () => {
    modal.classList.remove('active');
  };

  // Auto close
  setTimeout(() => modal.classList.remove('active'), 3000);
}

// Title Click
const title = document.querySelector('.glitch-text');
if (title) {
  title.addEventListener('click', () => {
    triggerEasterEgg("System Status: Operational. Welcome, Traveller.");
  });
}
