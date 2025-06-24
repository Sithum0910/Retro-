window.onload = () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const W = canvas.width;
  const H = canvas.height;

  const player = {
    x: W / 2 - 15,
    y: H - 60,
    width: 30,
    height: 30,
    speed: 5,
  };

  let bullets = [];
  let enemies = [];
  let score = 0;
  let gameOver = false;

  let keys = {};
  document.addEventListener("keydown", (e) => (keys[e.code] = true));
  document.addEventListener("keyup", (e) => (keys[e.code] = false));

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !gameOver) {
      bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, speed: 8 });
    }
  });

  function spawnEnemies() {
    if (Math.random() < 0.02) {
      enemies.push({
        x: Math.random() * (W - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: 2 + Math.random() * 1.5,
      });
    }
  }

  function detectCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + (a.width || 4) > b.x &&
      a.y < b.y + b.height &&
      a.y + (a.height || 10) > b.y
    );
  }

  function update() {
    if (gameOver) return;

    // Player movement
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < W - player.width) player.x += player.speed;

    // Update bullets
    bullets = bullets.filter((b) => b.y > -10);
    bullets.forEach((b) => (b.y -= b.speed));

    // Spawn enemies
    spawnEnemies();

    // Update enemies
    enemies.forEach((e, ei) => {
      e.y += e.speed;

      // Bullet collision
      bullets.forEach((b, bi) => {
        if (detectCollision(b, e)) {
          bullets.splice(bi, 1);
          enemies.splice(ei, 1);
          score += 10;
        }
      });

      // Player collision
      if (detectCollision(player, e)) {
        gameOver = true;
      }
    });

    // Remove off-screen enemies
    enemies = enemies.filter((e) => e.y < H);
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
      ctx.fillRect(b.x, b.y, 4, 10);
    });

    // Enemies
    ctx.fillStyle = "white";
    enemies.forEach((e) => {
      ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    // Score
    ctx.fillStyle = "white";
    ctx.font = "18px monospace";
    ctx.fillText("Score: " + score, 10, 25);

    // Game Over
    if (gameOver) {
      ctx.fillStyle = "red";
      ctx.font = "30px monospace";
      ctx.fillText("GAME OVER", W / 2 - 90, H / 2);
    }
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
};
