const musicBtn = document.getElementById("music-btn");
const bgMusic = document.getElementById("bg-music");
let isMusicPlaying = false;

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function toggleMusic() {
  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    musicBtn.innerHTML = '<i data-lucide="volume-x"></i>';
    musicBtn.style.animation = "none";
  } else {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      musicBtn.innerHTML = '<i data-lucide="volume-2"></i>';
      musicBtn.style.animation = "spin 8s linear infinite";
      renderIcons();
    }).catch(err => {
      console.warn("Autoplay blocked by browser. Music will play on user tap.", err);
    });
  }
  renderIcons();
}

if (musicBtn && bgMusic) {
  musicBtn.addEventListener("click", toggleMusic);
}

const introScreen = document.getElementById("intro-screen");
const loadingScreen = document.getElementById("loading-screen");
const mainSite = document.getElementById("main-site");
let hasOpenedInvite = false;

if (introScreen && loadingScreen && mainSite) {
  introScreen.addEventListener("click", () => {
    if (hasOpenedInvite) return;
    hasOpenedInvite = true;

    if (bgMusic && musicBtn) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicBtn.innerHTML = '<i data-lucide="volume-2"></i>';
        musicBtn.style.animation = "spin 8s linear infinite";
        renderIcons();
      }).catch(err => console.log("Audio play deferred:", err));
    }

    introScreen.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    introScreen.style.opacity = "0";
    introScreen.style.transform = "scale(1.05)";
    loadingScreen.classList.remove("hidden");

    setTimeout(() => {
      introScreen.style.display = "none";
    }, 600);

    setTimeout(() => {
      mainSite.classList.remove("hidden");
      loadingScreen.classList.add("loading-fade-out");
      if (musicBtn) {
        musicBtn.style.display = "flex";
      }
      initScrollReveal();
    }, 3200);

    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      loadingScreen.classList.remove("loading-fade-out");
    }, 3650);
  });
}

const pCanvas = document.getElementById("particles-canvas");
const pCtx = pCanvas ? pCanvas.getContext("2d") : null;
let particles = [];
let maxParticles = window.innerWidth < 768 ? 15 : 30;

function resizeParticlesCanvas() {
  if (!pCanvas) return;
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
  maxParticles = window.innerWidth < 768 ? 15 : 30;
}

window.addEventListener("resize", resizeParticlesCanvas);
resizeParticlesCanvas();

class WeddingParticle {
  constructor() {
    this.reset();
    this.y = Math.random() * pCanvas.height;
  }

  reset() {
    this.x = Math.random() * pCanvas.width;
    this.y = -20;
    this.size = Math.random() * 8 + 6;
    this.speedY = Math.random() * 1.2 + 0.8;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.02 - 0.01;
    this.opacity = Math.random() * 0.6 + 0.4;

    const rand = Math.random();
    if (rand < 0.35) {
      this.type = "petal";
      this.color = `rgba(255, ${150 + Math.floor(Math.random() * 50)}, ${170 + Math.floor(Math.random() * 40)}, ${this.opacity})`;
    } else if (rand < 0.6) {
      this.type = "heart";
      this.color = `rgba(220, 40, 60, ${this.opacity * 0.85})`;
    } else if (rand < 0.85) {
      this.type = "gold";
      this.color = `rgba(223, 177, 91, ${this.opacity})`;
    } else {
      this.type = "cream";
      this.color = `rgba(251, 245, 223, ${this.opacity * 0.7})`;
    }
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y / 30) * 0.2;
    this.rotation += this.rotationSpeed;

    if (this.y > pCanvas.height + 20 || this.x < -20 || this.x > pCanvas.width + 20) {
      this.reset();
    }
  }

  draw() {
    pCtx.save();
    pCtx.translate(this.x, this.y);
    pCtx.rotate(this.rotation);
    pCtx.fillStyle = this.color;

    if (this.type === "heart") {
      pCtx.beginPath();
      pCtx.moveTo(0, -this.size / 4);
      pCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size / 1.2);
      pCtx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, -this.size / 4);
      pCtx.fill();
    } else if (this.type === "petal") {
      pCtx.beginPath();
      pCtx.ellipse(0, 0, this.size / 1.8, this.size, 0, 0, Math.PI * 2);
      pCtx.fill();
    } else if (this.type === "gold") {
      pCtx.beginPath();
      pCtx.moveTo(0, -this.size / 1.5);
      pCtx.lineTo(this.size / 2, 0);
      pCtx.lineTo(0, this.size / 1.5);
      pCtx.lineTo(-this.size / 2, 0);
      pCtx.closePath();
      pCtx.fill();
    } else {
      pCtx.beginPath();
      pCtx.arc(0, 0, this.size / 3.5, 0, Math.PI * 2);
      pCtx.fill();
    }

    pCtx.restore();
  }
}

function animateParticles() {
  if (!pCanvas || !pCtx) return;
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

  if (particles.length < maxParticles && Math.random() < 0.08) {
    particles.push(new WeddingParticle());
  }

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateParticles);
}

requestAnimationFrame(animateParticles);

const TARGET_WEDDING_TIME = new Date("2026-08-23T10:00:00+05:30").getTime();
const daysVal = document.getElementById("days-val");
const hoursVal = document.getElementById("hours-val");
const minutesVal = document.getElementById("minutes-val");
const secondsVal = document.getElementById("seconds-val");

function updateCountdown() {
  const diff = TARGET_WEDDING_TIME - Date.now();
  const remaining = Math.max(diff, 0);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  daysVal.textContent = days.toString().padStart(2, "0");
  hoursVal.textContent = hours.toString().padStart(2, "0");
  minutesVal.textContent = minutes.toString().padStart(2, "0");
  secondsVal.textContent = seconds.toString().padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        self.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: "0px"
  });

  revealElements.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  renderIcons();
});
