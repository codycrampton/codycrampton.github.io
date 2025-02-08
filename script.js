document.addEventListener("DOMContentLoaded", function () {
    /* === PUZZLE LOGIC === */
    const correctSequence = ["1", "3", "5", "7", "9"];
    let userSequence = [];
    const gridItems = document.querySelectorAll(".grid-item");
    const puzzleMessage = document.getElementById("puzzle-message");
    const puzzleContainer = document.getElementById("puzzle-container");
    const portfolioContainer = document.getElementById("portfolio-container");
  
    gridItems.forEach((item) => {
      item.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        if (this.classList.contains("active")) return;
        this.classList.add("active");
        userSequence.push(index);
        if (userSequence.length === correctSequence.length) {
          if (userSequence.join("") === correctSequence.join("")) {
            puzzleMessage.textContent = "Puzzle solved! Welcome.";
            setTimeout(() => {
              puzzleContainer.style.display = "none";
              portfolioContainer.style.display = "block";
            }, 1000);
          } else {
            puzzleMessage.textContent = "Incorrect sequence. Try again.";
            setTimeout(() => {
              userSequence = [];
              gridItems.forEach((item) => item.classList.remove("active"));
              puzzleMessage.textContent = "";
            }, 1000);
          }
        }
      });
    });
  
    /* === EASTER EGG TRACKER === */
    const discoveredEasterEggs = new Set();
    function updateEasterEggTracker() {
      document.getElementById("egg-count").textContent = discoveredEasterEggs.size;
    }
    function triggerEasterEgg(id, callback) {
      if (!discoveredEasterEggs.has(id)) {
        discoveredEasterEggs.add(id);
        updateEasterEggTracker();
      }
      if (callback) callback();
    }
  
    /* === KONAMI CODE (ZOMBIE MODE) === */
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    document.addEventListener("keydown", function (e) {
      if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerEasterEgg("zombie", function () {
            const zombieOverlay = document.getElementById("easter-egg");
            zombieOverlay.style.display = "flex";
            setTimeout(function () {
              zombieOverlay.style.display = "none";
            }, 5000);
          });
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  
    /* === CUSTOM MODAL FOR MESSAGES === */
    const customModal = document.getElementById("custom-modal");
    const modalMessage = document.getElementById("modal-message");
    const modalClose = document.getElementById("modal-close");
    function showModal(message, duration = 3000) {
      modalMessage.textContent = message;
      customModal.style.display = "flex";
      if (duration > 0) {
        setTimeout(() => {
          customModal.style.display = "none";
        }, duration);
      }
    }
    modalClose.addEventListener("click", function () {
      customModal.style.display = "none";
    });
  
    /* === TITLE CLICK EASTER EGG === */
    const siteTitle = document.getElementById("site-title");
    siteTitle.addEventListener("click", function () {
      triggerEasterEgg("title", function () {
        showModal("Secret of the Cramptons: A hidden history revealed!", 4000);
      });
    });
  
    /* === ABOUT SECTION HOVER / TOUCH EASTER EGG === */
    let aboutTimer;
    const aboutSection = document.getElementById("about");
    aboutSection.addEventListener("mouseover", function () {
      aboutTimer = setTimeout(function () {
        triggerEasterEgg("about-hover", function () {
          showModal("A mysterious whisper: 'Knowledge is power!'", 4000);
        });
      }, 3000);
    });
    aboutSection.addEventListener("mouseout", function () {
      clearTimeout(aboutTimer);
    });
    aboutSection.addEventListener("touchstart", function () {
      aboutTimer = setTimeout(function () {
        triggerEasterEgg("about-hover-touch", function () {
          showModal("A mysterious whisper: 'Knowledge is power!'", 4000);
        });
      }, 3000);
    });
    aboutSection.addEventListener("touchend", function () {
      clearTimeout(aboutTimer);
    });
  
    /* === PROJECTS HEADING CLICK (MEME EASTER EGG) === */
    const projectsHeading = document.querySelector("#projects h2");
    if (projectsHeading) {
      projectsHeading.addEventListener("click", function () {
        triggerEasterEgg("projects", function () {
          const memeOverlay = document.getElementById("meme-overlay");
          memeOverlay.style.display = "flex";
          setTimeout(function () {
            memeOverlay.style.display = "none";
          }, 5000);
        });
      });
    }
  
    /* === FOOTER SCROLL EASTER EGG === */
    let footerTriggered = false;
    window.addEventListener("scroll", function () {
      const footer = document.getElementById("footer");
      if (
        !footerTriggered &&
        footer &&
        footer.getBoundingClientRect().top < window.innerHeight
      ) {
        footerTriggered = true;
        triggerEasterEgg("footer", function () {
          showModal("You've discovered the secret of the footer!", 4000);
        });
      }
    });
  
    /* === KEYBOARD SEQUENCE: "easter" & "game" === */
    let typedBuffer = "";
    document.addEventListener("keydown", function (e) {
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        typedBuffer += e.key.toLowerCase();
        if (typedBuffer.endsWith("easter")) {
          triggerEasterEgg("keyboard", function () {
            showModal("The Easter incantation has been spoken!", 4000);
          });
          typedBuffer = "";
        }
        if (typedBuffer.endsWith("game")) {
          triggerCanvasMiniGame();
          triggerEasterEgg("canvas-mini", function () {});
          typedBuffer = "";
        }
        if (typedBuffer.length > 20) {
          typedBuffer = typedBuffer.slice(-20);
        }
      }
    });
  
    /* === CANVAS MINI-GAME === */
    const miniGameOverlay = document.getElementById("mini-game-overlay");
    const miniGameCanvas = document.getElementById("mini-game-canvas");
    const miniGameClose = document.getElementById("mini-game-close");
    const ctx = miniGameCanvas.getContext("2d");
  
    function resizeCanvas() {
      miniGameCanvas.width = window.innerWidth * 0.9;
      miniGameCanvas.height = window.innerHeight * 0.7;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  
    let gameActive = false;
    let gameScore = 0;
    let circle = { x: 0, y: 0, radius: 30 };
  
    function repositionCircle() {
      const padding = circle.radius + 10;
      circle.x =
        Math.random() * (miniGameCanvas.width - 2 * padding) + padding;
      circle.y =
        Math.random() * (miniGameCanvas.height - 2 * padding) + padding;
    }
  
    function startMiniGame() {
      gameActive = true;
      gameScore = 0;
      repositionCircle();
      miniGameOverlay.style.display = "flex";
      setTimeout(function () {
        if (gameActive) {
          endMiniGame();
        }
      }, 10000);
      drawMiniGame();
    }
  
    function endMiniGame() {
      gameActive = false;
      miniGameOverlay.style.display = "none";
      showModal("Mini-Game Over! Your score: " + gameScore, 4000);
    }
  
    function drawMiniGame() {
      if (!gameActive) return;
      ctx.clearRect(0, 0, miniGameCanvas.width, miniGameCanvas.height);
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#6c6";
      ctx.fill();
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + gameScore, 10, 30);
      requestAnimationFrame(drawMiniGame);
    }
  
    miniGameCanvas.addEventListener("click", function (e) {
      if (!gameActive) return;
      const rect = miniGameCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const distance = Math.sqrt(
        (clickX - circle.x) ** 2 + (clickY - circle.y) ** 2
      );
      if (distance <= circle.radius) {
        gameScore++;
        repositionCircle();
      }
    });
  
    miniGameClose.addEventListener("click", function () {
      if (gameActive) {
        endMiniGame();
      }
    });
  
    function triggerCanvasMiniGame() {
      startMiniGame();
    }
  });
  
