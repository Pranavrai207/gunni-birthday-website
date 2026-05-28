/* ==========================================================================
   GUNNI'S BIRTHDAY WEBSITE - INTERACTIVE ENGINE
   ========================================================================== */

// --- Global State ---
let audioCtx = null;
let musicPlaying = false;
let sequenceTimer = null;
let currentTempo = 110; // BPM
let currentNoteIndex = 0;
let isCakeComplete = false;
let mousePos = { x: 0, y: 0 };
let activeLightboxIndex = 0;
let musicAutoStopTimeout = null;

// --- Assets Array: 36 Images with Custom Titles, Categories, and Descriptions ---
const galleryItems = [
  { src: "assets/IMG-20220104-WA0009.jpg", title: "Vintage Vibes", category: "memories", desc: "A gorgeous flashback that brings back sweet memories." },
  { src: "assets/IMG-20231126-WA0154.jpg", title: "Pretty in Pink", category: "portraits", desc: "Radiating pure elegance and style in every frame." },
  { src: "assets/IMG-20231126-WA0167.jpg", title: "Sparkling Joy", category: "candids", desc: "That genuine, priceless smile that lights up the room." },
  { src: "assets/IMG20210318203219.jpg", title: "Throwback Charm", category: "memories", desc: "Time flies, but these special moments stay forever." },
  { src: "assets/IMG_20250227_232827.jpg", title: "Candid Perfection", category: "candids", desc: "Caught in the moment, looking absolutely adorable." },
  { src: "assets/IMG_20250302_215154.jpg", title: "Sunny Day Out", category: "candids", desc: "Enjoying the sun, spreading warmth and happiness." },
  { src: "assets/Screenshot 2026-05-29 011237.png", title: "Digital Keepsake", category: "memories", desc: "A screenshot of a special conversation or memory shared." },
  { src: "assets/Screenshot_2025-02-18-10-30-50-352_com.miui.gallery.jpg", title: "Sweet Snapshot", category: "memories", desc: "A cozy moment captured straight from the camera roll." },
  { src: "assets/WhatsApp Image 2026-05-29 at 11.44.27 AM.jpeg", title: "Gorgeous Portrait", category: "portraits", desc: "Slaying the camera angles with effortless confidence." },
  { src: "assets/WhatsApp Image 2026-05-29 at 11.44.42 AM.jpeg", title: "Beautiful Pose", category: "portraits", desc: "Looking like an absolute queen, ready to conquer." },
  { src: "assets/WhatsApp Image 2026-05-29 at 11.44.43 AM (1).jpeg", title: "Sweetest Sister", category: "memories", desc: "The perfect bond, built on laughter, secrets, and love." },
  { src: "assets/WhatsApp Image 2026-05-29 at 11.44.43 AM.jpeg", title: "Charming Day", category: "candids", desc: "A look of pure bliss and peaceful happy moments." },
  { src: "assets/WhatsApp Image 2026-05-29 at 11.44.44 AM.jpeg", title: "Stunning Outfit", category: "portraits", desc: "A beautiful combination of style, grace, and attitude." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.25.58 PM.jpeg", title: "Starry Night", category: "portraits", desc: "Shining brighter than the night stars in this gorgeous shot." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.25.59 PM.jpeg", title: "Happy Glow", category: "candids", desc: "That special birthday-season glow that suits you so well." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.00 PM (1).jpeg", title: "Laughter & Fun", category: "candids", desc: "Creating endless memories filled with happy giggles." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.00 PM.jpeg", title: "Chic & Stylish", category: "portraits", desc: "A modern, high-fashion statement from the birthday girl." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.01 PM.jpeg", title: "Glow & Grow", category: "portraits", desc: "Stronger, wiser, and more beautiful with each passing year." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.02 PM (1).jpeg", title: "Dreamer", category: "candids", desc: "Looking off into a bright, wonderful future ahead." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.02 PM.jpeg", title: "Delightful Pose", category: "portraits", desc: "Capturing the light perfectly, framing a beautiful soul." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.03 PM (1).jpeg", title: "Happy Hour", category: "candids", desc: "Having the best time, making every second count." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.03 PM.jpeg", title: "Elegance Restored", category: "portraits", desc: "A stunning close-up showcasing classic beauty." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.04 PM.jpeg", title: "Warm Smile", category: "candids", desc: "A smile that spreads warmth straight to the heart." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.05 PM.jpeg", title: "Pure Grace", category: "portraits", desc: "Carrying yourself with absolute dignity, style, and grace." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.06 PM (1).jpeg", title: "Perfect Selfie", category: "portraits", desc: "A cute, sparkling selfie showcasing your awesome vibe." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.06 PM.jpeg", title: "Golden Hours", category: "candids", desc: "Basking in the golden sunlight, looking absolutely magical." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.07 PM (1).jpeg", title: "Charming Portrait", category: "portraits", desc: "A highly artistic, beautiful capture of a precious face." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.07 PM (2).jpeg", title: "Lovely Stare", category: "portraits", desc: "Captivating eyes that tell a story of confidence and charm." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.07 PM.jpeg", title: "Sisterly Bonding", category: "memories", desc: "A sweet memory card capturing our beautiful moments together." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.08 PM (1).jpeg", title: "Celebration Mood", category: "candids", desc: "Ready to celebrate, laugh, dance, and eat delicious cake." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.08 PM (2).jpeg", title: "Sweet & Cozy", category: "memories", desc: "A sweet warm snapshot of cozy, happy family times." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.08 PM.jpeg", title: "Shine Bright", category: "portraits", desc: "May you always continue to shine as bright as a diamond." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.09 PM (1).jpeg", title: "Timeless Portrait", category: "portraits", desc: "A premium portrait that stands the test of time." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.09 PM.jpeg", title: "Laughter Canvas", category: "candids", desc: "Smiling and laughing are your best accessories!" },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.10 PM (1).jpeg", title: "Joyous Memory", category: "memories", desc: "A lovely day filled with wonderful talks and memories." },
  { src: "assets/WhatsApp Image 2026-05-29 at 12.26.10 PM.jpeg", title: "Queen Gunni", category: "portraits", desc: "All hail the birthday queen! Slaying as always." }
];

// --- 1. Audio Engine: Web Audio API Music Box ---
const melodyNotes = [
  { pitch: "G4", type: 4 }, { pitch: "G4", type: 4 }, { pitch: "A4", type: 2 }, { pitch: "G4", type: 2 }, { pitch: "C5", type: 2 }, { pitch: "B4", type: 1 }, 
  { pitch: "rest", type: 2 },
  { pitch: "G4", type: 4 }, { pitch: "G4", type: 4 }, { pitch: "A4", type: 2 }, { pitch: "G4", type: 2 }, { pitch: "D5", type: 2 }, { pitch: "C5", type: 1 },
  { pitch: "rest", type: 2 },
  { pitch: "G4", type: 4 }, { pitch: "G4", type: 4 }, { pitch: "G5", type: 2 }, { pitch: "E5", type: 2 }, { pitch: "C5", type: 2 }, { pitch: "B4", type: 2 }, { pitch: "A4", type: 1 },
  { pitch: "rest", type: 2 },
  { pitch: "F5", type: 4 }, { pitch: "F5", type: 4 }, { pitch: "E5", type: 2 }, { pitch: "C5", type: 2 }, { pitch: "D5", type: 2 }, { pitch: "C5", type: 1 }
];

const noteFreqs = {
  "G4": 392.00, "A4": 440.00, "B4": 493.88, "C5": 523.25, 
  "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99,
  "rest": 0
};

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playMusicBoxTine(freq, time, duration) {
  if (!audioCtx || freq === 0) return;

  // Primary Oscillator (Triangle)
  const osc1 = audioCtx.createOscillator();
  const gainNode1 = audioCtx.createGain();
  osc1.type = "triangle";
  osc1.frequency.setValueAtTime(freq, time);

  // Secondary Overtone (Sine) for bell-like music box chime
  const osc2 = audioCtx.createOscillator();
  const gainNode2 = audioCtx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(freq * 2, time); // Octave higher
  osc2.detune.setValueAtTime(5, time); // Slightly detuned

  // Amplitude Envelope: Instant pluck, exponential decay
  gainNode1.gain.setValueAtTime(0.001, time);
  gainNode1.gain.exponentialRampToValueAtTime(0.25, time + 0.02);
  gainNode1.gain.exponentialRampToValueAtTime(0.001, time + duration);

  gainNode2.gain.setValueAtTime(0.001, time);
  gainNode2.gain.exponentialRampToValueAtTime(0.12, time + 0.02);
  gainNode2.gain.exponentialRampToValueAtTime(0.001, time + duration);

  // Connect together
  osc1.connect(gainNode1);
  osc2.connect(gainNode2);
  
  gainNode1.connect(audioCtx.destination);
  gainNode2.connect(audioCtx.destination);

  osc1.start(time);
  osc1.stop(time + duration);
  osc2.start(time);
  osc2.stop(time + duration);
}

function playSynthesizedPopSound() {
  initAudio();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = "sine";
  const startTime = audioCtx.currentTime;
  
  // Frequency sweep downwards to sound like a pop
  osc.frequency.setValueAtTime(800, startTime);
  osc.frequency.exponentialRampToValueAtTime(80, startTime + 0.12);
  
  gainNode.gain.setValueAtTime(0.2, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + 0.12);
}

function startMusicSequence() {
  if (sequenceTimer) return;
  
  let time = audioCtx.currentTime;
  
  function scheduler() {
    // If the scheduled time falls behind the audio clock (e.g. page load/lag/tab blur), catch up
    if (time < audioCtx.currentTime) {
      time = audioCtx.currentTime;
    }
    
    while (time < audioCtx.currentTime + 0.2) {
      const note = melodyNotes[currentNoteIndex];
      const beatLen = 60 / currentTempo;
      
      // Calculate note duration
      let noteLen = beatLen;
      if (note.type === 4) noteLen = beatLen * 0.5; // Eighth note
      if (note.type === 2) noteLen = beatLen;       // Quarter note
      if (note.type === 1) noteLen = beatLen * 2.0; // Half note
      
      if (note.pitch !== "rest") {
        const freq = noteFreqs[note.pitch];
        playMusicBoxTine(freq, time, noteLen * 0.95);
        
        // Visual trigger (pulse the music widget button)
        triggerVisualNoteBeat();
      }
      
      time += noteLen;
      currentNoteIndex = (currentNoteIndex + 1) % melodyNotes.length;
    }
    sequenceTimer = setTimeout(scheduler, 50);
  }
  
  scheduler();
}

function stopMusicSequence() {
  if (sequenceTimer) {
    clearTimeout(sequenceTimer);
    sequenceTimer = null;
  }
}

function toggleMusic() {
  initAudio();
  const musicBtn = document.getElementById("music-toggle-btn");
  
  if (musicPlaying) {
    stopMusicSequence();
    musicPlaying = false;
    if (musicBtn) {
      musicBtn.classList.remove("playing");
      musicBtn.innerHTML = `
        <svg class="music-note" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <div style="position:absolute; width:100%; height:2px; background:currentColor; transform:rotate(-45deg);"></div>
      `;
    }
    if (musicAutoStopTimeout) {
      clearTimeout(musicAutoStopTimeout);
      musicAutoStopTimeout = null;
    }
  } else {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    startMusicSequence();
    musicPlaying = true;
    if (musicBtn) {
      musicBtn.classList.add("playing");
      musicBtn.innerHTML = `
        <svg class="music-note" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      `;
    }

    if (musicAutoStopTimeout) {
      clearTimeout(musicAutoStopTimeout);
    }
    musicAutoStopTimeout = setTimeout(() => {
      if (musicPlaying) {
        toggleMusic(); // stop music automatically after 30s
      }
    }, 30000);
  }
}

function triggerVisualNoteBeat() {
  const musicBtn = document.getElementById("music-toggle-btn");
  if (musicBtn) {
    musicBtn.style.transform = "scale(1.15)";
    setTimeout(() => {
      if (musicPlaying) {
        musicBtn.style.transform = "scale(1.08)";
      } else {
        musicBtn.style.transform = "scale(1)";
      }
    }, 150);
  }
}


// --- 2. Confetti Particle System ---
class ConfettiParticle {
  constructor(canvasWidth, canvasHeight, colors, options = {}) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = options.x !== undefined ? options.x : Math.random() * canvasWidth;
    this.y = options.y !== undefined ? options.y : Math.random() * -canvasHeight - 20;
    
    // Physical attributes
    this.size = Math.random() * 8 + 6;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
    
    // Velocities
    this.vx = options.vx !== undefined ? options.vx : Math.random() * 4 - 2;
    this.vy = options.vy !== undefined ? options.vy : Math.random() * 5 + 3;
    this.gravity = 0.15;
    this.drag = 0.98;
    this.opacity = 1;
    this.decay = options.decay !== undefined ? options.decay : 0;
  }

  update() {
    this.vy += this.gravity;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    
    if (this.decay > 0) {
      this.opacity -= this.decay;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    
    // Draw rectangles/ribbons
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }

  isDead() {
    return this.y > this.canvasHeight + 20 || this.opacity <= 0 || this.x < -20 || this.x > this.canvasWidth + 20;
  }
}

const confettiColors = ["#db2777", "#f472b6", "#fbcfe8", "#ca8a04", "#fef08a", "#ec4899", "#f43f5e"];
let confettiParticles = [];
let confettiCanvas, confettiCtx;
let confettiActive = false;

function initConfetti() {
  confettiCanvas = document.getElementById("confetti-canvas");
  confettiCtx = confettiCanvas.getContext("2d");
  resizeConfettiCanvas();
  window.addEventListener("resize", resizeConfettiCanvas);
  requestAnimationFrame(updateConfetti);
}

function resizeConfettiCanvas() {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
}

function spawnBurstConfetti(x, y, count = 50) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 4;
    confettiParticles.push(
      new ConfettiParticle(
        confettiCanvas.width,
        confettiCanvas.height,
        confettiColors,
        {
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // Slight upward bias
          decay: Math.random() * 0.015 + 0.005
        }
      )
    );
  }
}

function startCelebrationConfettiShower() {
  confettiActive = true;
  let showerCount = 0;
  
  function spawnLoop() {
    if (!confettiActive) return;
    
    // Spawn particles along the top edge
    for (let i = 0; i < 4; i++) {
      confettiParticles.push(
        new ConfettiParticle(
          confettiCanvas.width,
          confettiCanvas.height,
          confettiColors
        )
      );
    }
    
    showerCount++;
    if (showerCount < 80) { // Stop spawning after 8 seconds
      setTimeout(spawnLoop, 100);
    } else {
      confettiActive = false;
    }
  }
  
  spawnLoop();
}

function updateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.update();
    p.draw(confettiCtx);
    
    if (p.isDead()) {
      confettiParticles.splice(i, 1);
    }
  }
  
  requestAnimationFrame(updateConfetti);
}


// --- 3. Custom Sparkle Cursor Trail ---
function initCursorSparkles() {
  const container = document.getElementById("cursor-sparkles");
  const sparkleCharacters = ["✦", "✧", "❤", "💖", "✨", "🌸"];
  const sparkleColors = ["#db2777", "#f472b6", "#fbcfe8", "#ca8a04", "#fef08a"];
  
  window.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    
    // Spawn rate limiter (only 12% chance to spawn on move to keep it elegant)
    if (Math.random() < 0.15) {
      createSparkle(e.clientX, e.clientY);
    }
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      mousePos.x = touch.clientX;
      mousePos.y = touch.clientY;
      if (Math.random() < 0.2) {
        createSparkle(touch.clientX, touch.clientY);
      }
    }
  });

  function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle-particle";
    sparkle.textContent = sparkleCharacters[Math.floor(Math.random() * sparkleCharacters.length)];
    sparkle.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    sparkle.style.left = `${x + (Math.random() * 12 - 6)}px`;
    sparkle.style.top = `${y + (Math.random() * 12 - 6)}px`;
    
    // Random sizes
    const size = Math.random() * 12 + 10;
    sparkle.style.fontSize = `${size}px`;
    
    container.appendChild(sparkle);
    
    // Self-destruct after animation completes
    setTimeout(() => {
      sparkle.remove();
    }, 800);
  }
}


// --- 4. 3D-Like Balloon Emitters ---
function spawnBalloons() {
  const container = document.querySelector(".decorations-container");
  const colors = [
    "rgba(219, 39, 119, 0.7)",   // Primary Pink
    "rgba(244, 114, 182, 0.7)",  // Soft Pink
    "rgba(251, 207, 232, 0.7)",  // Light Pink
    "rgba(253, 242, 248, 0.7)",  // Off White/Pink
    "rgba(202, 138, 4, 0.5)"     // Soft gold
  ];

  // Spawn 10 floating balloons at startup
  for (let i = 0; i < 15; i++) {
    createBalloon(true);
  }

  // Continuously spawn balloons every 2.5 seconds
  setInterval(() => {
    createBalloon(false);
  }, 2500);

  function createBalloon(initialSetup) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    
    const string = document.createElement("div");
    string.className = "balloon-string";
    balloon.appendChild(string);

    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.color = color;
    balloon.style.backgroundColor = color;
    
    const sizeWidth = Math.random() * 15 + 40; // 40-55px
    const sizeHeight = sizeWidth * 1.3;
    balloon.style.width = `${sizeWidth}px`;
    balloon.style.height = `${sizeHeight}px`;
    
    balloon.style.left = `${Math.random() * 90 + 5}%`;
    
    // Animation attributes
    const duration = Math.random() * 8 + 12; // 12-20s
    balloon.style.animationDuration = `${duration}s`;
    
    if (initialSetup) {
      // Offset initial setup balloons randomly upwards
      const verticalDelay = Math.random() * -18;
      balloon.style.animationDelay = `${verticalDelay}s`;
    }

    container.appendChild(balloon);

    // Clean up
    setTimeout(() => {
      balloon.remove();
    }, duration * 1000);
  }
}


// --- 5. Celebration Entry Gate Confirmation ---
function setupCelebrationGate() {
  const gate = document.getElementById("celebration-gate");
  const input = document.getElementById("gate-name-input");
  const button = document.getElementById("gate-submit-btn");

  // Allow pressing Enter key to submit
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      enterCelebration();
    }
  });

  button.addEventListener("click", enterCelebration);

  function enterCelebration() {
    const entered = input.value.trim().toLowerCase();
    
    // Cute greeting check - responds to 'gunni' or anything!
    let outputGreeting = "Beautiful Cousin Sister, Gunni";
    if (entered.length > 0) {
      outputGreeting = input.value.trim();
    }
    
    // Update name in hero card
    document.getElementById("greeting-recipient-name").textContent = outputGreeting;

    // Fade out gate
    gate.classList.add("hidden");
    
    // Start audio & confetti
    initAudio();
    toggleMusic();
    initConfetti();
    spawnBurstConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
    startCelebrationConfettiShower();
    
    // Fire background balloon sequence
    spawnBalloons();
  }
}





// --- 7. Photo Gallery Layout & Lightbox ---
function setupGallery() {
  const grid = document.getElementById("gallery-grid");
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  
  // Populate items
  renderGallery(galleryItems);

  // Filter click handlers
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filter = btn.getAttribute("data-filter");
      if (filter === "all") {
        renderGallery(galleryItems);
      } else {
        const filtered = galleryItems.filter(item => item.category === filter);
        renderGallery(filtered);
      }
    });
  });

  function renderGallery(items) {
    grid.innerHTML = "";
    items.forEach((item, index) => {
      const card = document.createElement("div");
      
      // Give masonry classes based on indexes to create an interesting visual rhythm
      let masonryClass = "";
      if (index % 7 === 0) masonryClass = "tall";
      else if (index % 11 === 0) masonryClass = "wide";
      
      card.className = `gallery-item ${masonryClass}`;
      
      // Generate standard lazy loading img
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.title;
      img.loading = "lazy";
      
      const overlay = document.createElement("div");
      overlay.className = "gallery-item-overlay";
      overlay.innerHTML = `
        <h4 class="gallery-item-title">${item.title}</h4>
        <p class="gallery-item-desc">${item.desc}</p>
      `;
      
      card.appendChild(img);
      card.appendChild(overlay);
      
      // Lightbox click trigger
      card.addEventListener("click", () => {
        // Find index of this item in the global items list for navigation
        const globalIndex = galleryItems.findIndex(gItem => gItem.src === item.src);
        openLightbox(globalIndex);
      });
      
      grid.appendChild(card);
    });
  }
}

// Lightbox modal logic
function openLightbox(index) {
  activeLightboxIndex = index;
  const modal = document.getElementById("lightbox-modal");
  const lImg = document.getElementById("lightbox-img");
  const lTitle = document.getElementById("lightbox-title");
  const lDesc = document.getElementById("lightbox-desc");
  
  const item = galleryItems[index];
  lImg.src = item.src;
  lTitle.textContent = item.title;
  lDesc.textContent = item.desc;
  
  modal.classList.add("active");
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  modal.classList.remove("active");
}

function navigateLightbox(dir) {
  activeLightboxIndex = (activeLightboxIndex + dir + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeLightboxIndex];
  
  const lImg = document.getElementById("lightbox-img");
  const lTitle = document.getElementById("lightbox-title");
  const lDesc = document.getElementById("lightbox-desc");
  
  // Smooth transition opacity sweep
  lImg.style.opacity = 0;
  setTimeout(() => {
    lImg.src = item.src;
    lTitle.textContent = item.title;
    lDesc.textContent = item.desc;
    lImg.style.opacity = 1;
  }, 150);
}

function setupLightboxControls() {
  const modal = document.getElementById("lightbox-modal");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => navigateLightbox(-1));
  nextBtn.addEventListener("click", () => navigateLightbox(1));
  
  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}


// --- 8. Birthday Cake Candle Blowing Logic ---
function setupCakeBlow() {
  const candles = document.querySelectorAll(".candle-container");
  const micBtn = document.getElementById("cake-mic-btn");
  const unlockedCard = document.getElementById("cake-wish-unlocked");
  
  let candlesRemaining = candles.length;
  let blowLoop = null;

  candles.forEach(candle => {
    candle.addEventListener("click", () => {
      extinguishCandle(candle);
    });
  });

  if (micBtn) {
    micBtn.addEventListener("click", startMicrophoneBlowing);
  }

  function extinguishCandle(candleNode) {
    if (candleNode.classList.contains("extinguished")) return;
    
    candleNode.classList.add("extinguished", "just-blown");
    candlesRemaining--;
    
    // Synthesize pop/puff chime
    playSynthesizedPopSound();
    
    // Confetti spark on candle
    const rect = candleNode.getBoundingClientRect();
    spawnBurstConfetti(rect.left + rect.width / 2, rect.top, 10);
    
    // Clean up "just blown" class after smoke animation finishes
    setTimeout(() => {
      candleNode.classList.remove("just-blown");
    }, 1500);

    // All candles blown check
    if (candlesRemaining === 0) {
      completeCakeCelebration();
    }
  }

  function completeCakeCelebration() {
    if (isCakeComplete) return;
    isCakeComplete = true;
    
    // Stop mic check
    if (blowLoop) {
      cancelAnimationFrame(blowLoop);
      blowLoop = null;
    }
    
    // Add celebrate class to cake for burst animation
    const cakeElement = document.querySelector(".cake");
    if (cakeElement) {
      cakeElement.classList.add("celebrate");
    }
    
    // Massive confetti burst
    const cakeRect = document.querySelector(".cake").getBoundingClientRect();
    spawnBurstConfetti(cakeRect.left + cakeRect.width / 2, cakeRect.top, 150);
    
    // Reveal unlocked wish panel
    unlockedCard.style.display = "block";
    
    // Change mic button description
    if (micBtn) {
      micBtn.innerHTML = `<span>✨ Wishes Sent! ✨</span>`;
      micBtn.disabled = true;
    }
  }

  async function startMicrophoneBlowing() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      initAudio();
      
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      if (micBtn) {
        micBtn.innerHTML = `<span>🎙 Listening to your blow...</span>`;
        micBtn.style.background = "var(--primary)";
      }
      
      let blowCooldown = 0;

      function checkBlow() {
        if (isCakeComplete) {
          // Release stream track
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average amplitude (volume level)
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // If average volume is very high (blowing/clapping sound)
        if (average > 65 && blowCooldown <= 0) {
          // Extinguish one active candle
          const activeCandles = Array.from(candles).filter(c => !c.classList.contains("extinguished"));
          if (activeCandles.length > 0) {
            // Extinguish random active candle
            const randomCandle = activeCandles[Math.floor(Math.random() * activeCandles.length)];
            extinguishCandle(randomCandle);
            blowCooldown = 8; // Prevent extinguishing everything instantly
          }
        }
        
        if (blowCooldown > 0) blowCooldown--;
        blowLoop = requestAnimationFrame(checkBlow);
      }
      
      checkBlow();
    } catch (err) {
      console.warn("Microphone access declined or unavailable. Falling back to click blowing.");
      if (micBtn) {
        micBtn.innerHTML = `<span>⚠ Mic unavailable. Please click candles!</span>`;
        setTimeout(() => {
          micBtn.innerHTML = `<span>🎙 Blow candles via Mic</span>`;
        }, 3000);
      }
    }
  }
}


// --- 9. Magic Gift Boxes Drawer Logic ---
function setupGifts() {
  const gifts = document.querySelectorAll(".gift-box");
  const drawers = document.querySelectorAll(".gift-drawer");

  gifts.forEach(gift => {
    gift.addEventListener("click", () => {
      if (gift.classList.contains("opened")) return;
      
      const giftId = gift.getAttribute("data-gift-id");
      
      // Mark as opened
      gift.classList.add("opened");
      
      // Play pop sound & burst confetti
      playSynthesizedPopSound();
      const rect = gift.getBoundingClientRect();
      spawnBurstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
      
      // Delay and fade in the corresponding drawer
      setTimeout(() => {
        // Hide all drawers first to prevent stacking clutters
        drawers.forEach(drawer => drawer.style.display = "none");
        
        // Show specific drawer
        const targetDrawer = document.getElementById(`gift-drawer-${giftId}`);
        targetDrawer.style.display = "block";
        
        // Smooth scroll to target drawer
        targetDrawer.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    });
  });
}


// --- 10. Wishes Carousel Navigation Slider ---
function setupWishesCarousel() {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  
  let currentOffset = 0;
  
  // Dynamic offset calculation based on slide width + gaps
  function getSlideWidth() {
    const firstSlide = track.querySelector(".carousel-slide");
    if (!firstSlide) return 380; // Default fallback
    return firstSlide.getBoundingClientRect().width + 30; // Slide width + gap
  }

  nextBtn.addEventListener("click", () => {
    const maxOffset = track.scrollWidth - track.parentElement.clientWidth;
    currentOffset += getSlideWidth();
    
    if (currentOffset > maxOffset) {
      currentOffset = maxOffset; // Lock to end
    }
    track.style.transform = `translateX(-${currentOffset}px)`;
  });

  prevBtn.addEventListener("click", () => {
    currentOffset -= getSlideWidth();
    if (currentOffset < 0) {
      currentOffset = 0; // Lock to start
    }
    track.style.transform = `translateX(-${currentOffset}px)`;
  });

  // Handle resizing reset
  window.addEventListener("resize", () => {
    currentOffset = 0;
    track.style.transform = "translateX(0px)";
  });
}


// --- 11. Sensory Bubble Pop Game ---
function setupBubblePop() {
  const grid = document.getElementById("bubble-grid");
  const board = document.getElementById("bubble-board");
  
  const sweetMessages = [
    "You are awesome! 💖",
    "Stay sweet! 🎂",
    "Slay today! 👑",
    "Infinite love! ✨",
    "Be happy always! 🌸",
    "Super Sister! 🦸‍♀️",
    "You're a star! 🌟",
    "Sparkle on! 💫",
    "Hugs & Kisses! 💋",
    "Keep smiling! 😊",
    "Love you lots! 💕",
    "Cousin Goals! 👭",
    "Sweetest soul! 😇",
    "Rock on! 🎸",
    "Absolute Queen! 👑"
  ];
  
  const emojis = ["💖", "🎂", "🎉", "👑", "✨", "🌸", "🦄", "💝", "🎁", "🎈"];

  // Generate 24 bubbles
  for (let i = 0; i < 24; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    
    // Pop trigger
    bubble.addEventListener("click", () => {
      if (bubble.classList.contains("popped")) return;
      
      bubble.classList.add("popped");
      
      // Synthesize pop sound
      playSynthesizedPopSound();
      
      // Insert random emoji inside popped bubble
      bubble.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      // Update message board
      const msg = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
      board.innerHTML = `<span>${msg}</span>`;
      
      // Floating score/confetti spark on bubble
      const rect = bubble.getBoundingClientRect();
      spawnBurstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
    });
    
    grid.appendChild(bubble);
  }
}


// --- 12. Floating Nav active indicator on Scroll ---
function setupScrollNavActiveState() {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");

  window.addEventListener("scroll", () => {
    let current = "";
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });
}


// --- Initialization Event Listener ---
document.addEventListener("DOMContentLoaded", () => {
  setupCelebrationGate();
  initCursorSparkles();
  setupGallery();
  setupLightboxControls();
  setupCakeBlow();
  setupGifts();
  setupWishesCarousel();
  setupBubblePop();
  setupScrollNavActiveState();
  
  // Wire up main music trigger button
  const musicToggleBtn = document.getElementById("music-toggle-btn");
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", toggleMusic);
  }

  // Global user gesture unlocker for Web Audio API
  const unlockAudio = () => {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };
  document.addEventListener("click", unlockAudio, { once: true });
  document.addEventListener("touchstart", unlockAudio, { once: true });
});
