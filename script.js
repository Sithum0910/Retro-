const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

// Load assets (basic rectangles for retro feel)
const player = { x: W / 2 - 15, y: H - 50, width: 30, height: 30, speed: 5 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// Controls
let keys = {};
document.addEventListener("keydown", (e) => (keys[e.code] = true));
document.addEventListener("keyup", (e) => (keys[e.code] = false));

// Shoot
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bullets.push({ x: player.x + 12, y: player.y, speed: 7 });
  }
});

function spawnEnemies() {
  if (Math.random() < 0.02) {
    enemies.push({ x: Math.random() * (W - 30), y: -30, width: 30, height: 30, speed: 2 });
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function update() {
  if (gameOver) return;

  // Move player
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < W - player.width) player.x += player.speed;

  // Update bullets
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Spawn + update enemies
  spawnEnemies();
  enemies.forEach((e, i) => {
    e.y += e.speed;

    // Check collision with player
    if (detectCollision(player, e)) {
      gameOver = true;
    }

    // Check collision with bullets
    bullets.forEach((b, bi) => {
      if (detectCollision(b, e)) {
        enemies.splice(i, 1);
        bullets.splice(bi, 1);
        score += 10;
      }
    });

    // Remove enemies off-screen
    if (e.y > H) enemies.splice(i, 1);
  });
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, W, H);

  // Player
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Bullets
  ctx.fillStyle = "red";
  bullets.forEach((b) => {
    ctx.fillRect(b.x, b.y, 5, 10);
  });

  // Enemies
  ctx.fillStyle = "white";
  enemies.forEach((e) => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px monospace";
  ctx.fillText("Score: " + score, 10, 25);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px monospace";
    ctx.fillText("GAME OVER", W / 2 - 90, H / 2);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
