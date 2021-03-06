// html
let score = -10;
let level = 1;
const { innerWidth, innerHeight } = window;
const size = Math.min(400, innerWidth * 0.9, innerHeight * 0.9);
const width = size;
const height = size;

const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const button = document.createElement('button');
button.textContent = 'Play';
document.body.appendChild(button);

// canvas
const context = canvas.getContext('2d');
context.translate(width / 2, height / 2);
const lineWidth = 15;
const radius = width / 2 - lineWidth / 2;
context.lineWidth = lineWidth;
context.fillStyle = 'hsl(128, 40%, 45%)';

const ball = {
  x: 0,
  y: 0,
  r: 20,
};

// physics
const physics = {
  direction: [0, 1],
  force: 0,
  gravity: 0,
  angle: 0,
};
const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const angles = [0, Math.PI, (Math.PI / 2) * 3, Math.PI / 2];

// draw
function draw() {
  context.clearRect(-width / 2, -height / 2, width, height);

  context.beginPath();
  context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  context.fill();
  context.closePath();

  context.strokeStyle = 'hsl(30, 15%, 90%)';
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.stroke();
  context.closePath();

  context.save();
  context.rotate(physics.angle);
  context.strokeStyle = 'hsl(128, 40%, 45%)';
  context.beginPath();
  context.arc(0, 0, radius, Math.PI / 4, (Math.PI / 4) * 3);
  context.stroke();
  context.closePath();
  context.restore();
}

// animation loop
function animate() {
  draw();
  const { gravity, force, direction } = physics;
  const [dX, dY] = direction;
  ball.x += (gravity - force) * dX;
  ball.y += (gravity - force) * dY;

  physics.gravity += 0.2;
  if (force >= 0) {
    physics.force -= 0.2;
  }

  const d = Math.sqrt(ball.x ** 2 + ball.y ** 2);
  
  if (d < radius - ball.r) {
    requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animate);
    score =-10;
    level=1;
    button.style.visibility = 'visible';
    button.focus();
  }
}

// reset
function start() {
    // score=0;
    // level=1;
    document.getElementById("level").innerHTML = "Level: " + $('.odometer').html(level);
    document.getElementById("score").innerHTML = "Score: " + 0;
    ball.x = 0;
    ball.y = 0;
    physics.force = 0;
    physics.gravity = 0;

    animate();
    button.style.visibility = 'hidden';
}

// jump
function jump() {
    physics.gravity = 0;
    physics.force += 5;

    const changeDirection = Math.random() < 0.25;
    if (changeDirection) {
        const index = Math.floor(Math.random() * directions.length);
        physics.direction = directions[index];
        physics.angle = angles[index];
    }

    score += 10;
    if(score%100==0 && score!=0)
    {
      level=level+1;
      physics.force+=5;
    }
    document.getElementById("level").innerHTML = "Level: " + level;
    document.getElementById("score").innerHTML = "Score: " + score;
}

// immediately draw the canvas
draw();

// start when clicking the button
button.addEventListener('click', () => start());

// jump when clicking the window/pressing the space bar
window.addEventListener('click', () => jump());
window.addEventListener('keydown', ({ keyCode }) => {
  if (keyCode === 32) {
    jump();
  }
});
