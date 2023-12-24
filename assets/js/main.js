// Get the canvas and its 2D context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Load the Flappy Bird image
const img = new Image();
img.src = "assets/images/flappy-bird-set.png";

document.getElementById('rulesButton').addEventListener('click', openRulesPopup);

function openRulesPopup() {
    event.stopPropagation();
    document.getElementById('rulesPopup').style.display = 'block';
}

function closeRulesPopup() {
    event.stopPropagation();
    document.getElementById('rulesPopup').style.display = 'none';
}

// Game variables
let gamePlaying = false;
let isPaused = false;
const gravity = 0.5;
const speed = 3;
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;

let index = 0;
let bestScore = 0;
let flight, flyHeight, currentScore, pipes;

// Event listener for key presses
const handleKeyPress = (event) => {
  if (['Space', 'KeyW', 'ArrowUp'].includes(event.code)) {
    // Start the game or make the bird jump
    if (!gamePlaying) {
      gamePlaying = true;
    } else {
      flight = jump;
    }
  }

  if (['KeyP', 'Escape'].includes(event.code)) {
    // Toggle pause/resume on "P" or "Escape" key press
    togglePause();
  }
};

// Function to toggle pause state
const togglePause = () => {
  isPaused = !isPaused;
  if (isPaused) {
    // Pause the game and display 'PAUSE'
    cancelAnimationFrame(animationId);
    ctx.fillText('PAUSE', 150, 300);
  } else {
    // Resume the game
    animationId = window.requestAnimationFrame(render);
  }
};

// Add event listener for key presses
document.addEventListener('keydown', handleKeyPress);

// Pipe variables
const pipeWidth = 78;
const pipeGap = 270;

// Function to generate random pipe location
const pipeLoc = () => Math.random() * (canvas.height - (pipeGap + pipeWidth)) - pipeWidth + pipeWidth;

// Initialize game setup
const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = (canvas.height / 2) - (size[1] / 2);
  pipes = Array(3).fill().map((_, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
};

// Animation ID variable
let animationId;

// Function to render the game
const render = () => {
  index++;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background images
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);

  // Game logic for playing and not paused
  if (gamePlaying && !isPaused) {
    pipes.forEach(pipe => {
      pipe[0] -= speed;
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      if (pipe[0] <= -pipeWidth) {
        // Increase score and generate a new pipe
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);
        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }

      if ([pipe[0] <= cTenth + size[0], pipe[0] + pipeWidth >= cTenth, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]].every(elem => elem)) {
        // Game over, reset setup
        gamePlaying = false;
        setup();
      }
    });
  }

  // Game logic for playing and not paused
  if (gamePlaying && !isPaused) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    // Display game over screen
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  // Update score display
  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // Request next animation frame
  animationId = window.requestAnimationFrame(render);
};

// Initialize game setup
setup();

// Load the Flappy Bird image and start the game rendering
img.onload = render;

// Event listener for mouse click to start the game
document.addEventListener('click', () => gamePlaying = true);

// Event listener for mouse click to make the bird jump
window.onclick = () => flight = jump;