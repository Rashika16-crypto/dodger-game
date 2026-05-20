const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  width: canvas.width,
  height: canvas.height,
  keys: { left: false, right: false },
  player: { x: 185, y: 500, width: 30, height: 30, speed: 5 },
  obstacles: [],
  score: 0,
  highScore: 0,
  frame: 0,
  gameOver: false,
};

function resetGame() {
  state.obstacles = [];
  state.score = 0;
  state.frame = 0;
  state.gameOver = false;
  state.player.x = (state.width - state.player.width) / 2;
}

function spawnObstacle() {
  const size = 24 + Math.random() * 24;
  const x = Math.random() * (state.width - size);
  state.obstacles.push({
    x,
    y: -size,
    width: size,
    height: size,
    speed: 2 + state.score * 0.04,
    color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
  });
}

function update() {
  if (state.gameOver) return;

  state.frame += 1;
  if (state.keys.left) {
    state.player.x -= state.player.speed;
  }
  if (state.keys.right) {
    state.player.x += state.player.speed;
  }

  state.player.x = Math.max(0, Math.min(state.player.x, state.width - state.player.width));

  if (state.frame % 28 === 0) {
    spawnObstacle();
  }

  state.obstacles.forEach(obstacle => {
    obstacle.y += obstacle.speed;
  });

  state.obstacles = state.obstacles.filter(obstacle => obstacle.y < state.height + obstacle.height);

  for (const obstacle of state.obstacles) {
    if (
      state.player.x < obstacle.x + obstacle.width &&
      state.player.x + state.player.width > obstacle.x &&
      state.player.y < obstacle.y + obstacle.height &&
      state.player.height + state.player.y > obstacle.y
    ) {
      state.gameOver = true;
      state.highScore = Math.max(state.highScore, state.score);
      break;
    }
  }

  if (!state.gameOver) {
    state.score += 1;
  }
}

function draw() {
  ctx.clearRect(0, 0, state.width, state.height);

  ctx.fillStyle = '#0af';
  ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);

  state.obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  ctx.fillStyle = '#fff';
  ctx.font = '18px Arial';
  ctx.fillText(`Score: ${state.score}`, 14, 28);
  ctx.fillText(`High Score: ${state.highScore}`, 14, 54);

  if (state.gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, state.width, state.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', state.width / 2, state.height / 2 - 20);
    ctx.font = '18px Arial';
    ctx.fillText('Press Restart to play again', state.width / 2, state.height / 2 + 20);
    ctx.textAlign = 'start';
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', event => {
  if (event.code === 'ArrowLeft') {
    state.keys.left = true;
  }
  if (event.code === 'ArrowRight') {
    state.keys.right = true;
  }
});

window.addEventListener('keyup', event => {
  if (event.code === 'ArrowLeft') {
    state.keys.left = false;
  }
  if (event.code === 'ArrowRight') {
    state.keys.right = false;
  }
});

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const restartBtn = document.getElementById('restartBtn');

function stopMovement() {
  state.keys.left = false;
  state.keys.right = false;
}

leftBtn.addEventListener('mousedown', () => { state.keys.left = true; });
leftBtn.addEventListener('mouseup', stopMovement);
leftBtn.addEventListener('mouseleave', stopMovement);
leftBtn.addEventListener('touchstart', event => { event.preventDefault(); state.keys.left = true; });
leftBtn.addEventListener('touchend', stopMovement);

rightBtn.addEventListener('mousedown', () => { state.keys.right = true; });
rightBtn.addEventListener('mouseup', stopMovement);
rightBtn.addEventListener('mouseleave', stopMovement);
rightBtn.addEventListener('touchstart', event => { event.preventDefault(); state.keys.right = true; });
rightBtn.addEventListener('touchend', stopMovement);

restartBtn.addEventListener('click', () => {
  resetGame();
});

window.addEventListener('blur', stopMovement);

canvas.addEventListener('click', () => canvas.focus());

resetGame();
loop();