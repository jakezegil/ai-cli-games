//generated with gpt-4o-mini


// Import readline to handle user input
import * as readline from 'readline';

// Set up readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the game state
const WIDTH = 20;
const HEIGHT = 10;
let playerPosition = 2;
let playerJumping = false;
let jumpHeight = 0;
let obstaclePosition = WIDTH - 5; // Initial position of the obstacle
let score = 0;

// Render function to display the game state
function render() {
  let world = '';

  for (let y = 0; y < HEIGHT; y++) {
    if (y === HEIGHT - 1) { // Ground level
      for (let x = 0; x < WIDTH; x++) {
        if (x === playerPosition && jumpHeight === 0) {
          world += 'M'; // Player
        } else if (x === obstaclePosition && y === HEIGHT - 1) {
          world += 'X'; // Obstacle
        } else {
          world += '-'; // Ground
        }
      }
    } else if (y === HEIGHT - jumpHeight - 2 && playerPosition === playerPosition) {
      world += 'M'; // Player while jumping
    } else {
      world += new Array(WIDTH).fill(' ').join(''); // Empty space
    }
    world += '\n';
  }

  // Score Display
  world += `Score: ${score}\n`;
  console.clear();
  console.log(world);
}

// Handle player controls
function handleInput(input: string) {
  if (input.toLowerCase() === 'l') {
    playerPosition = Math.max(0, playerPosition - 1);
  } else if (input.toLowerCase() === 'r') {
    playerPosition = Math.min(WIDTH - 1, playerPosition + 1);
  } else if (input.toLowerCase() === 'j' && !playerJumping) {
    playerJumping = true;
    jumpHeight = 0;
  }
}

// Update game state
function update() {
  if (playerJumping) {
    jumpHeight++;
    if (jumpHeight > 5) {
      playerJumping = false;
      jumpHeight = 0;
    }
  }

  // Check for collision with the obstacle
  if (playerPosition === obstaclePosition && jumpHeight === 0) {
    console.log('Game Over! Your score: ' + score);
    rl.close();
    return;
  }

  // Increase score over time
  score++;
  obstaclePosition--; // Move the obstacle towards the player
  if (obstaclePosition < 0) {
    obstaclePosition = WIDTH - 1; // Reset obstacle position
  }
}

// Main game loop
function gameLoop() {
  render();
  update();

  rl.question('Move left (l), right (r) or jump (j)? ', (input) => {
    handleInput(input);
    gameLoop();
  });
}

// Start the game loop
gameLoop();
