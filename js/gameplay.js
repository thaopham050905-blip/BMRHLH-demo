const player = document.getElementById("player");
const shadow = document.getElementById("character-shadow");
const stageLabel = document.getElementById("stage-label");

const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const jumpBtn = document.getElementById("jump-btn");
const backBtn = document.getElementById("back-level");

const playerImg = player?.querySelector("img");

const runAsset = "assets/animation DaiTrang/dai-trang-run.svg";

// =========================
// STAGE
// =========================

const stage =
  document.getElementById("game")?.dataset.stage || "1";

const stageImages = {
  "1": "assets/images/stage1.svg",
  "2": "assets/images/stage2.svg",
  "3": "assets/images/stage3.svg"
};

const background =
  document.getElementById("game-background");

const selectedStageImage =
  stageImages[stage] || stageImages["1"];

if (background) {
  background.src = selectedStageImage;

  background.addEventListener(
    "load",
    () => {
      background.style.opacity = "1";
    },
    { once: true }
  );

  if (background.complete) {
    background.style.opacity = "1";
  }
}

if (stageLabel) {
  stageLabel.textContent = `LEVEL ${stage}`;
}


// =========================
// PLAYER
// =========================

let x = 12;
let direction = 1;

let leftHeld = false;
let rightHeld = false;

let jumping = false;
let jumpStart = 0;


// =========================
// SETTINGS
// =========================

const speed = 0.3;

const jumpDuration = 450;
const jumpHeight = 120;

const jumpDistance = 0.3;

const MIN_X = 0;
const MAX_X = 92;


// =========================
// RENDER
// =========================

function render(jumpY = 0) {

  if (!player) return;

  // Nhân vật
  player.style.left = `${x}%`;

  // run.svg mặc định quay mặt sang phải
  const flip =
    direction === 1 ? 1 : -1;

  player.style.transform =
    `translateY(${-jumpY}px) scaleX(${flip})`;


  // BÓNG
  if (shadow) {

    // Bóng bám theo chân nhân vật
    shadow.style.left =
      `calc(${x}% + clamp(25px, 3.2vw, 42px))`;

    // Không translateX(-50%)
    // để tránh bóng bị lệch
    shadow.style.transform =
      jumping
        ? "scaleX(0.82)"
        : "scaleX(1)";
  }
}


// =========================
// MOVE
// =========================

function move(amount) {

  x += amount;

  x = Math.max(
    MIN_X,
    Math.min(MAX_X, x)
  );

  if (amount < 0) {
    direction = -1;
  }

  if (amount > 0) {
    direction = 1;
  }

  render();
}


// =========================
// JUMP
// =========================

function jump() {

  if (jumping) return;

  jumping = true;

  jumpStart =
    performance.now();
}


// =========================
// GAME LOOP
// =========================

function loop(now) {

  // =======================
  // MOVEMENT
  // =======================

  if (leftHeld !== rightHeld) {

    const amount =
      leftHeld
        ? -speed
        : speed;

    x += amount;

    x = Math.max(
      MIN_X,
      Math.min(MAX_X, x)
    );

    direction =
      leftHeld
        ? -1
        : 1;
  }


  // =======================
  // JUMP
  // =======================

  let jumpY = 0;

  if (jumping) {

    const elapsed =
      now - jumpStart;

    const progress =
      Math.min(
        1,
        elapsed / jumpDuration
      );


    // Lên → đỉnh → xuống
    jumpY =
      Math.sin(
        progress * Math.PI
      ) * jumpHeight;


    // =====================
    // JUMP FORWARD
    // =====================

    // ↑ = nhảy tại chỗ
    // ← + ↑ = nhảy sang trái
    // → + ↑ = nhảy sang phải

    if (leftHeld !== rightHeld) {

      const jumpDirection =
        leftHeld
          ? -1
          : 1;

      x +=
        jumpDirection *
        jumpDistance;

      x = Math.max(
        MIN_X,
        Math.min(MAX_X, x)
      );

      direction =
        jumpDirection;
    }


    // Kết thúc jump
    if (progress >= 1) {

      jumping = false;

      jumpY = 0;
    }
  }


  // =======================
  // RENDER
  // =======================

  render(jumpY);

  requestAnimationFrame(loop);
}


// =========================
// MOBILE JUMP
// =========================

function bindJumpButton(button) {

  if (!button) return;

  button.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      try {
        button.setPointerCapture(
          event.pointerId
        );
      } catch (_) {}

      jump();
    },
    { passive: false }
  );
}

bindJumpButton(jumpBtn);


// =========================
// MOBILE MOVEMENT
// =========================

function holdMove(button, amount) {

  if (!button) return;


  function setHeld(
    event,
    held
  ) {

    event?.preventDefault();

    if (amount < 0) {
      leftHeld = held;
    } else {
      rightHeld = held;
    }

    if (held) {
      direction =
        amount < 0
          ? -1
          : 1;
    }
  }


  button.addEventListener(
    "pointerdown",
    event => {

      setHeld(event, true);

      try {
        button.setPointerCapture(
          event.pointerId
        );
      } catch (_) {}
    },
    { passive: false }
  );


  button.addEventListener(
    "pointerup",
    event => {
      setHeld(event, false);
    },
    { passive: false }
  );


  button.addEventListener(
    "pointercancel",
    event => {
      setHeld(event, false);
    },
    { passive: false }
  );


  button.addEventListener(
    "lostpointercapture",
    event => {
      setHeld(event, false);
    },
    { passive: false }
  );
}

holdMove(leftBtn, -1);
holdMove(rightBtn, 1);


// =========================
// KEYBOARD
// =========================

window.addEventListener(
  "keydown",
  event => {

    const key =
      event.key.toLowerCase();


    // LEFT
    if (
      key === "a" ||
      event.key === "ArrowLeft"
    ) {

      event.preventDefault();

      leftHeld = true;
      direction = -1;
    }


    // RIGHT
    else if (
      key === "d" ||
      event.key === "ArrowRight"
    ) {

      event.preventDefault();

      rightHeld = true;
      direction = 1;
    }


    // JUMP
    else if (
      key === "w" ||
      event.key === "ArrowUp"
    ) {

      event.preventDefault();

      if (!event.repeat) {
        jump();
      }
    }
  },
  { passive: false }
);


// =========================
// KEY RELEASE
// =========================

window.addEventListener(
  "keyup",
  event => {

    const key =
      event.key.toLowerCase();


    if (
      key === "a" ||
      event.key === "ArrowLeft"
    ) {

      leftHeld = false;
    }


    else if (
      key === "d" ||
      event.key === "ArrowRight"
    ) {

      rightHeld = false;
    }
  },
  { passive: false }
);


// =========================
// BLUR
// =========================

window.addEventListener(
  "blur",
  () => {

    leftHeld = false;
    rightHeld = false;
  }
);


// =========================
// BACK
// =========================

if (backBtn) {

  backBtn.addEventListener(
    "click",
    () => {
      window.location.href =
        "stage select.html";
    }
  );
}


// =========================
// RUN ASSET
// =========================

if (playerImg) {
  playerImg.src = runAsset;
}


// =========================
// START
// =========================

render();

requestAnimationFrame(loop);