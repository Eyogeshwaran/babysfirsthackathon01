const pipButton = document.querySelector("#pipButton");
const pipMessage = document.querySelector("#pipMessage");
const themeToggle = document.querySelector("#themeToggle");
const soundToggle = document.querySelector("#soundToggle");
const celebration = document.querySelector("#celebration");

// 1. Pip reacts to visitors and reveals a hidden surprise.
let pipClicks = 0;

pipButton.addEventListener("click", () => {
  pipClicks++;

  const messages = [
    "Pip says hello! ♡",
    "Pip found a sleepy star. ✦",
    "Pip is making you a tiny dream.",
    "Pip giggles and waves at you!"
  ];

  pipMessage.textContent =
    messages[(pipClicks - 1) % messages.length];

  if (pipClicks === 5) {
    celebration.hidden = false;
    celebration.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
    playChime();
  }
});

// 2. Day/night dream-mode toggle.
themeToggle.addEventListener("click", () => {
  const isDreamMode =
    document.body.classList.toggle("dream-mode");

  themeToggle.setAttribute("aria-pressed", isDreamMode);
  themeToggle.textContent = isDreamMode
    ? "☀️ Wake-up mode"
    : "☾ Dream mode";
});

// 3. Accessible sound toggle.
// Audio stays off until the visitor turns it on.
let soundEnabled = false;
let audioContext;

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  soundToggle.setAttribute("aria-pressed", soundEnabled);
  soundToggle.textContent = soundEnabled
    ? "Sound: On"
    : "Sound: Off";

  if (soundEnabled) playChime();
});

function playChime() {
  if (!soundEnabled) return;

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(
    660, audioContext.currentTime
  );
  oscillator.frequency.exponentialRampToValueAtTime(
    880, audioContext.currentTime + 0.12
  );

  gain.gain.setValueAtTime(
    0.0001, audioContext.currentTime
  );
  gain.gain.exponentialRampToValueAtTime(
    0.12, audioContext.currentTime + 0.02
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001, audioContext.currentTime + 0.3
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.31);
}

// 4. A tiny working dream-delivery interaction.
const routeButton = document.querySelector("#routeButton");
const routeMessage = document.querySelector("#routeMessage");

routeButton.addEventListener("click", () => {
  routeMessage.textContent =
    "Dream delivered! Rooftop destination: Moon Cottage ✦";
  playChime();
});

// 5. Add optional sparkle celebration when the secret is found.
pipButton.addEventListener("click", () => {
  if (pipClicks === 5) {
    launchSparkles();
  }
});

function launchSparkles() {
  // Simple no-dependency fallback.
  const symbols = ["✦", "✧", "♡", "⋆"];

  for (let i = 0; i < 16; i++) {
    const sparkle = document.createElement("span");
    sparkle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    sparkle.style.cssText = `
      position: fixed;
      z-index: 30;
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 75}vh;
      color: #a34063;
      font-size: ${16 + Math.random() * 20}px;
      pointer-events: none;
      animation: float 1.5s ease-out forwards;
    `;

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1600);
  }
}
const pupils = document.querySelectorAll(".pupil");

document.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;

  pupils.forEach((pupil) => {
    const face = pupil.parentElement.getBoundingClientRect();
    const centerX = face.left + face.width / 2;
    const centerY = face.top + face.height / 2;

    const dx = (event.clientX - centerX) / 30;
    const dy = (event.clientY - centerY) / 30;

    pupil.style.transform =
      `translate(${Math.max(-4, Math.min(4, dx))}px,
                  ${Math.max(-4, Math.min(4, dy))}px)`;
  });
});
const nightlightButton = document.getElementById("nightlightButton");
const nightlightMessage = document.getElementById("nightlightMessage");

if (nightlightButton && nightlightMessage) {
  nightlightButton.addEventListener("click", () => {
    nightlightMessage.textContent =
      "🌙 Pip's nightlights turn bedtime into a tiny adventure!";
  });
}
const lullabyButton = document.getElementById("lullabyButton");
const lullabyMessage = document.getElementById("lullabyMessage");

let lullabyAudio = null;

if (lullabyButton && lullabyMessage) {
  lullabyButton.addEventListener("click", async () => {
    // Stop the melody if it is already playing.
    if (lullabyAudio && !lullabyAudio.paused) {
      lullabyAudio.pause();
      lullabyAudio.currentTime = 0;
      lullabyButton.textContent = "▶️ Play a tiny chime ♫";
      lullabyMessage.textContent = "🌙 Sweet dreams, Pip!";
      return;
    }

    try {
      // Play a short melody using the browser's Web Audio API.
      const AudioClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioClass) {
        lullabyMessage.textContent =
          "Audio isn't supported in this browser.";
        return;
      }

      const audio = new AudioClass();
      await audio.resume();

      const notes = [523.25, 659.25, 783.99, 659.25];
      const start = audio.currentTime;

      notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const time = start + index * 0.35;

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.04);
        gain.gain.linearRampToValueAtTime(0.001, time + 0.3);

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start(time);
        oscillator.stop(time + 0.32);
      });

      lullabyButton.textContent = "♫ Playing...";
      lullabyMessage.textContent = "✨ A tiny melody for sleepy dreams!";

      window.setTimeout(() => {
        audio.close();
        lullabyButton.textContent = "▶️ Play a tiny chime ♫";
      }, 1600);

    } catch (error) {
      lullabyMessage.textContent = "Couldn't play the chime. Try again!";
    }
  });
}