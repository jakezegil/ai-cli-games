
// Space Invaders game written in TypeScript

import * as readline from 'readline';

// Define constants
const ROWS = 10;
const COLS = 20;
const PLAYER_START_ROW = 9;
const PLAYER_START_COL = 10;
const INVADER_ROW = 1;
const INVADER_START_COL = 10;
const PLAYER_CHAR = 'P';
const INVADER_CHAR = 'X';
const BULLET_CHAR = '|';
const BLANK_CHAR = ' ';

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize game state
let gameOver = false;
let playerRow = PLAYER_START_ROW;
let playerCol = PLAYER_START_COL;
let invaderCol = INVADER_START_COL;
let bulletRow = 0;
let bulletCol = 0;

// Function to render the game board
function renderGameBoard(): void {
  let gameBoard = '';

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (row === playerRow && col === playerCol) {
        gameBoard += PLAYER_CHAR;
      } else if (row === INVADER_ROW && col === invaderCol) {
        gameBoard += INVADER_CHAR;
      } else if (row === bulletRow && col === bulletCol) {
        gameBoard += BULLET_CHAR;
      } else {
        gameBoard += BLANK_CHAR;
      }
    }
    gameBoard += '\n';
  }

  console.clear();
  console.log(gameBoard);
}

// Function to handle player input
function handleInput(input: string): void {
  if (input === 'q') {
    gameOver = true;
  } else if (input === 'a') {
    playerCol = Math.max(0, playerCol - 1);
  } else if (input === 'd') {
    playerCol = Math.min(COLS - 1, playerCol + 1);
  } else if (input === ' ') {
    if (bulletRow === 0) {
      bulletRow = playerRow - 1;
      bulletCol = playerCol;
    }
  }
}

// Function to update game state
function updateGameState(): void {
  if (bulletRow > 0) {
    bulletRow--;
    if (bulletRow === INVADER_ROW && bulletCol === invaderCol) {
      invaderCol = Math.floor(Math.random() * COLS);
      bulletRow = 0;
      bulletCol = 0;
    }
  }
}

// Main game loop
function gameLoop(): void {
  if (!gameOver) {
    renderGameBoard();
    rl.question('Move left (a), Move right (d), Shoot (space), Quit (q): ', (input) => {
      handleInput(input);
      updateGameState();
      gameLoop();
    });
  } else {
    rl.close();
    console.log('Game over!');
  }
}

// Start the game
gameLoop();
