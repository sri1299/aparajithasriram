// --- 1. SEED AND INITIALIZE BLESSING WALL DATA ---
const INITIAL_BLESSINGS = [
  {
    id: "blessing-1",
    guestName: "Sundaresan & Alamelu",
    guestCount: 2,
    isAttending: "yes",
    side: "groom",
    message: "Wishing the divine couple Vijay and Rashmika a lifetime of abundance, sound health, and pure spiritual joy! Om Namah Shivaya.",
    createdAt: "2026-05-24T10:00:00Z"
  },
  {
    id: "blessing-2",
    guestName: "Karthik & Janani",
    guestCount: 3,
    isAttending: "yes",
    side: "bride",
    message: "So incredibly happy to see Rashmika marrying her prince! Can't wait to witness the magnificent wedding in Mylapore!",
    createdAt: "2026-05-24T12:30:00Z"
  },
  {
    id: "blessing-3",
    guestName: "Dr. R. Venkatraman",
    guestCount: 2,
    isAttending: "yes",
    side: "general",
    message: "May Ganesha clear all obstacles from your path as you begin this beautiful new chapter of family life together.",
    createdAt: "2026-05-24T14:15:00Z"
  }
];

function initBlessings() {
  if (!localStorage.getItem("weddingBlessings")) {
    localStorage.setItem("weddingBlessings", JSON.stringify(INITIAL_BLESSINGS));
  }
}

// --- 2. AUDIO PLAYBACK & CONTROL MODULE ---
const musicBtn = document.getElementById("music-btn");
const bgMusic = document.getElementById("bg-music");
let isMusicPlaying = false;

function toggleMusic() {
  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    musicBtn.innerHTML = '<i data-lucide="volume-x"></i>';
    musicBtn.style.animation = 'none';
  } else {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      musicBtn.innerHTML = '<i data-lucide="volume-2"></i>';
      musicBtn.style.animation = 'spin 8s linear infinite';
    }).catch(err => {
      console.warn("Autoplay blocked by browser. Music will play on user tap.", err);
    });
  }
  lucide.createIcons();
}

musicBtn.addEventListener("click", toggleMusic);

// --- 3. INTRO SCREEN TRANSITION MODULE ---
const introScreen = document.getElementById("intro-screen");
const mainSite = document.getElementById("main-site");

introScreen.addEventListener("click", () => {
  // Play music immediately on first click
  bgMusic.play().then(() => {
    isMusicPlaying = true;
    musicBtn.innerHTML = '<i data-lucide="volume-2"></i>';
    musicBtn.style.animation = 'spin 8s linear infinite';
    lucide.createIcons();
  }).catch(err => console.log("Audio play deferred:", err));

  // Visual Fade Out / Dismissal Transition
  introScreen.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  introScreen.style.opacity = "0";
  introScreen.style.transform = "scale(1.05)";

  setTimeout(() => {
    introScreen.style.display = "none";
    mainSite.classList.remove("hidden");
    musicBtn.style.display = "flex";

    // Trigger scroll reveals and start scratch card initialization
    initScratchCards();
    initScrollReveal();
  }, 600);
});

// --- 4. FLOATING PETALS / SPARKLES CANVAS ENGINE ---
const pCanvas = document.getElementById("particles-canvas");
const pCtx = pCanvas.getContext("2d");
let particles = [];
let maxParticles = window.innerWidth < 768 ? 15 : 30;

function resizeParticlesCanvas() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
  maxParticles = window.innerWidth < 768 ? 15 : 30;
}
window.addEventListener("resize", resizeParticlesCanvas);
resizeParticlesCanvas();

// Particle Class Definition (Hearts, Flowers, Gold Sparkles)
class WeddingParticle {
  constructor() {
    this.reset();
    // Randomize initial vertical position to scatter them
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

    // Choose Particle Type (0 = pink flower petal, 1 = red heart, 2 = gold star petal, 3 = cream sparkle)
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

    // Recycle particle when it goes off screen
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
      // Draw smooth micro heart shape
      pCtx.beginPath();
      pCtx.moveTo(0, -this.size / 4);
      pCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size / 1.2);
      pCtx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, -this.size / 4);
      pCtx.fill();
    } else if (this.type === "petal") {
      // Draw organic petal shape
      pCtx.beginPath();
      pCtx.ellipse(0, 0, this.size / 1.8, this.size, 0, 0, Math.PI * 2);
      pCtx.fill();
    } else if (this.type === "gold") {
      // Draw dynamic gold diamond particle
      pCtx.beginPath();
      pCtx.moveTo(0, -this.size / 1.5);
      pCtx.lineTo(this.size / 2, 0);
      pCtx.lineTo(0, this.size / 1.5);
      pCtx.lineTo(-this.size / 2, 0);
      pCtx.closePath();
      pCtx.fill();
    } else {
      // Draw tiny circular micro-light sparkle
      pCtx.beginPath();
      pCtx.arc(0, 0, this.size / 3.5, 0, Math.PI * 2);
      pCtx.fill();
    }

    pCtx.restore();
  }
}

// Particle Engine Loop
function animateParticles() {
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

// --- 5. WEDDING COUNTDOWN TIMER MODULE ---
// Target Ceremony Date: Saturday, August 22, 2026, 9:00 AM IST (UTC+5:30 -> 3:30 AM UTC)
const TARGET_WEDDING_TIME = new Date("2026-08-22T09:00:00+05:30").getTime();

const daysVal = document.getElementById("days-val");
const hoursVal = document.getElementById("hours-val");
const minutesVal = document.getElementById("minutes-val");
const secondsVal = document.getElementById("seconds-val");

function updateCountdown() {
  const now = new Date().getTime();
  const diff = TARGET_WEDDING_TIME - now;

  if (diff <= 0) {
    daysVal.textContent = "00";
    hoursVal.textContent = "00";
    minutesVal.textContent = "00";
    secondsVal.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  daysVal.textContent = days.toString().padStart(2, "0");
  hoursVal.textContent = hours.toString().padStart(2, "0");
  minutesVal.textContent = minutes.toString().padStart(2, "0");
  secondsVal.textContent = seconds.toString().padStart(2, "0");
}
setInterval(updateCountdown, 1000);
updateCountdown(); // Execute immediately

// --- 6. CANVAS FOIL SCRATCH CARD LOGIC ---
const scratchCanvases = [
  { id: "days", canvas: document.getElementById("canvas-days") },
  { id: "hours", canvas: document.getElementById("canvas-hours") },
  { id: "minutes", canvas: document.getElementById("canvas-minutes") },
  { id: "seconds", canvas: document.getElementById("canvas-seconds") }
];

let activeScratchCards = {};

function initScratchCards() {
  scratchCanvases.forEach(item => {
    const c = item.canvas;
    if (!c) return;

    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Reset sizes to 180x180 resolution inside
    const R = 180;
    c.width = R;
    c.height = R;

    // Draw Gold Foil on the Canvas
    ctx.save();
    ctx.beginPath();
    ctx.arc(R / 2, R / 2, R / 2 - 2, 0, Math.PI * 2);
    ctx.clip();

    // Custom Radial Shimmer Metallic Gold Gradient
    const goldGrad = ctx.createRadialGradient(R / 2 - 15, R / 2 - 15, 8, R / 2, R / 2, R / 2);
    goldGrad.addColorStop(0, "#fffdf5");
    goldGrad.addColorStop(0.2, "#fbf5df");
    goldGrad.addColorStop(0.5, "#dfb15b");
    goldGrad.addColorStop(0.85, "#b88c32");
    goldGrad.addColorStop(1, "#8e6b1e");
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, R, R);

    // Gold Dust / Metallic Flakes Sparkle Layer 1
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * R;
      const ry = Math.random() * R;
      const size = Math.random() * 2 + 0.8;
      ctx.beginPath();
      ctx.arc(rx, ry, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gold Dust Flakes Sparkle Layer 2
    ctx.fillStyle = "rgba(251, 245, 223, 0.6)";
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * R;
      const ry = Math.random() * R;
      const size = Math.random() * 2.5 + 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shadow Gold Sparkles Layer 3
    ctx.fillStyle = "rgba(184, 140, 50, 0.4)";
    for (let i = 0; i < 30; i++) {
      const rx = Math.random() * R;
      const ry = Math.random() * R;
      const size = Math.random() * 2.5 + 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Custom Sparkle Cross-Line Overlays
    for (let i = 0; i < 15; i++) {
      const rx = Math.random() * R;
      const ry = Math.random() * R;
      const len = Math.random() * 4 + 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(rx - len, ry);
      ctx.lineTo(rx + len, ry);
      ctx.moveTo(rx, ry - len);
      ctx.lineTo(rx, ry + len);
      ctx.stroke();
    }

    ctx.restore();

    // Event Listeners Setup
    let isDrawing = false;
    let strokesCount = 0;

    function getMouseOrTouchPos(e) {
      const rect = c.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * c.width,
        y: ((clientY - rect.top) / rect.height) * c.height
      };
    }

    function startErase(e) {
      if (activeScratchCards[item.id]) return;
      isDrawing = true;
      eraseAtPos(e);
    }

    function doErase(e) {
      if (!isDrawing || activeScratchCards[item.id]) return;
      if (e.cancelable) e.preventDefault();
      eraseAtPos(e);
    }

    function eraseAtPos(e) {
      const pos = getMouseOrTouchPos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2); // 18px erase circle radius
      ctx.fill();

      strokesCount++;
      if (strokesCount % 10 === 0) {
        checkFoilPercentage();
      }
    }

    function stopErase() {
      if (isDrawing) {
        isDrawing = false;
        checkFoilPercentage();
      }
    }

    // Optimization: Sample every 16th pixel to see if transparent (alpha === 0)
    function checkFoilPercentage() {
      if (activeScratchCards[item.id]) return;
      try {
        const imgData = ctx.getImageData(0, 0, c.width, c.height).data;
        let total = 0;
        let erased = 0;
        for (let i = 3; i < imgData.length; i += 16) {
          total++;
          if (imgData[i] === 0) {
            erased++;
          }
        }

        // If scratched more than 30%, trigger a smooth fadeout reveal!
        if (erased / total > 0.3) {
          revealCountdownCard(item.id);
        }
      } catch (err) {
        console.warn("Foil check failed (CORS or canvas issue)", err);
      }
    }

    // Desktop mouse events
    c.addEventListener("mousedown", startErase);
    c.addEventListener("mousemove", doErase);
    c.addEventListener("mouseup", stopErase);
    c.addEventListener("mouseleave", stopErase);

    // Mobile touch events
    c.addEventListener("touchstart", (e) => { startErase(e); }, { passive: false });
    c.addEventListener("touchmove", (e) => { doErase(e); }, { passive: false });
    c.addEventListener("touchend", stopErase, { passive: true });
  });
}

function revealCountdownCard(id) {
  if (activeScratchCards[id]) return;
  activeScratchCards[id] = true;

  const canvas = document.getElementById(`canvas-${id}`);
  if (canvas) {
    canvas.style.transition = "opacity 0.45s ease, transform 0.45s ease";
    canvas.style.opacity = "0";
    canvas.style.transform = "scale(0.8) translateY(15px)";
    setTimeout(() => {
      canvas.style.display = "none";
    }, 450);
  }
}

// Reveal All Button action
document.getElementById("reveal-all-btn").addEventListener("click", () => {
  scratchCanvases.forEach(item => {
    revealCountdownCard(item.id);
  });
});

// --- 7. RSVP FORM SUBMISSION & LOCALSTORAGE DATABASE MODULE ---
const rsvpForm = document.getElementById("rsvp-form");
const submitBtn = document.getElementById("submit-btn");
const submitSuccess = document.getElementById("submit-success");

// Set up Custom Radio buttons active classes
function initRadioButtons() {
  const groups = ["attending-group", "side-group"];
  groups.forEach(gId => {
    const container = document.getElementById(gId);
    if (!container) return;
    const buttons = container.querySelectorAll(".radio-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });
}
initRadioButtons();

rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const count = parseInt(document.getElementById("guestCount").value, 10);

  // Find custom active values from radio groups
  const attendingGroup = document.getElementById("attending-group");
  const sideGroup = document.getElementById("side-group");

  const attending = attendingGroup.querySelector(".radio-btn.active").getAttribute("data-value");
  const side = sideGroup.querySelector(".radio-btn.active").getAttribute("data-value");
  const msg = document.getElementById("message").value.trim();

  if (!name || !msg) return;

  const newBlessing = {
    id: "blessing-" + Date.now(),
    guestName: name,
    guestCount: count,
    isAttending: attending,
    side: side,
    message: msg,
    createdAt: new Date().toISOString()
  };

  // Write into LocalStorage
  const allBlessings = JSON.parse(localStorage.getItem("weddingBlessings")) || [];
  allBlessings.unshift(newBlessing); // Put it at the top
  localStorage.setItem("weddingBlessings", JSON.stringify(allBlessings));

  // Visual success feedback
  rsvpForm.reset();

  // Reset custom radios to default active state
  attendingGroup.querySelectorAll(".radio-btn").forEach(b => b.classList.remove("active"));
  attendingGroup.querySelector('[data-value="yes"]').classList.add("active");
  sideGroup.querySelectorAll(".radio-btn").forEach(b => b.classList.remove("active"));
  sideGroup.querySelector('[data-value="groom"]').classList.add("active");

  submitBtn.style.display = "none";
  submitSuccess.style.display = "block";

  // Re-render Blessing Wall cards
  renderBlessingWall();

  setTimeout(() => {
    submitSuccess.style.display = "none";
    submitBtn.style.display = "block";
  }, 4000);
});

// Render Blessing Wall Cards Dynamically
const blessingCardsContainer = document.getElementById("blessing-cards-container");

function renderBlessingWall() {
  if (!blessingCardsContainer) return;
  blessingCardsContainer.innerHTML = "";

  const blessings = JSON.parse(localStorage.getItem("weddingBlessings")) || [];

  blessings.forEach(b => {
    const card = document.createElement("div");
    card.className = "blessing-card reveal";

    // Choose beautiful background styling depending on selected side
    let badgeText = "Both / General";
    let badgeClass = "side-general";
    if (b.side === "groom") {
      badgeText = "Groom's Side";
      badgeClass = "side-groom";
    } else if (b.side === "bride") {
      badgeText = "Bride's Side";
      badgeClass = "side-bride";
    }

    const formattedDate = new Date(b.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    card.innerHTML = `
      <div class="blessing-guest">${escapeHTML(b.guestName)}</div>
      <div class="blessing-side-badge ${badgeClass}">${badgeText}</div>
      <p class="blessing-msg">“${escapeHTML(b.message)}”</p>
      <div class="blessing-date">${formattedDate}</div>
    `;

    blessingCardsContainer.appendChild(card);
  });

  // Retrigger observer to observe newly generated DOM nodes
  initScrollReveal();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// --- 8. SMOOTH VIEWPORT SCROLL REVEAL MODULE ---
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const observerOptions = {
    root: null,
    threshold: 0.12, // Trigger early when card begins entering viewport
    rootMargin: "0px"
  };

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        self.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

// --- 9. APP LAUNCH & ENGINE RUN ---
document.addEventListener("DOMContentLoaded", () => {
  initBlessings();
  renderBlessingWall();
  lucide.createIcons();
});
