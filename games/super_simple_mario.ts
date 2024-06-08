
// Import readline to handle user input
import * as readline from 'readline';

// Set up readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the game state
let playerPosition = 0;

// Render function to display the game state
function render() {
  let world = '';
  for (let i = 0; i < 10; i++) {
    if (i === playerPosition) {
      world += 'M';
    } else {
      world += '-';
    }
  }
  console.log(world);
}

// Main game loop
function gameLoop() {
  render();
  rl.question('Move left or right (l/r)? ', (input) => {
    if (input.toLowerCase() === 'l') {
      playerPosition = Math.max(0, playerPosition - 1);
    } else if (input.toLowerCase() === 'r') {
      playerPosition = Math.min(9, playerPosition + 1);
    }
    gameLoop();
  });
}

// Start the game loop
gameLoop();
