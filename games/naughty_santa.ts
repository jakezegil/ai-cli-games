//generated with gpt-4o-mini


import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const GRID_SIZE = 10;
const SANTA = "S";
const COAL = "C";
const PRESENT = "P";
const EMPTY = ".";
const POWER_UP = "U";

let santaX = Math.floor(Math.random() * GRID_SIZE);
let santaY = Math.floor(Math.random() * GRID_SIZE);
let presents: { x: number; y: number }[] = [];
let coalLocations: { x: number; y: number }[] = [];
let powerUps: { x: number; y: number }[] = [];

let gameOver = false;
let score = 0;
let inventory: string[] = [];

// Initialize game objects
function initializeObjects() {
  for (let i = 0; i < 3; i++) {
    presents.push({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
  }

  for (let i = 0; i < 5; i++) {
    coalLocations.push({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
  }

  for (let i = 0; i < 2; i++) {
    powerUps.push({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
  }
}

function renderGrid() {
  console.clear(); // Clear console for better rendering
  console.log(`Score: ${score}`);
  console.log(`Inventory: ${inventory.join(", ")}`);
  console.log("--------------------");

  for (let y = 0; y < GRID_SIZE; y++) {
    let row = "";
    for (let x = 0; x < GRID_SIZE; x++) {
      if (x === santaX && y === santaY) {
        row += SANTA;
      } else if (presents.some((p) => p.x === x && p.y === y)) {
        row += PRESENT;
      } else if (coalLocations.some((c) => c.x === x && c.y === y)) {
        row += COAL;
      } else if (powerUps.some((p) => p.x === x && p.y === y)) {
        row += POWER_UP;
      } else {
        row += EMPTY;
      }
      row += " ";
    }
    console.log(row);
  }
}

function moveSanta(dx: number, dy: number) {
  santaX += dx;
  santaY += dy;

  // Check for presents
  presents = presents.filter((present) => {
    if (present.x === santaX && present.y === santaY) {
      score += 10;
      console.log("Congratulations! You found a present!");
      return false; // Remove this present
    }
    return true; // Keep this present
  });

  // Check for coal
  if (coalLocations.some((coord) => coord.x === santaX && coord.y === santaY)) {
    console.log("Oh no! Santa got stuck in a chimney! Game over.");
    gameOver = true;
  }

  // Check for power-ups
  powerUps = powerUps.filter((powerUp) => {
    if (powerUp.x === santaX && powerUp.y === santaY) {
      inventory.push("Power-Up!");
      console.log("You found a Power-Up! It will help you avoid pitfalls.");
      return false; // Remove this power-up
    }
    return true; // Keep this power-up
  });

  // Check for boundaries
  if (santaX < 0 || santaX >= GRID_SIZE || santaY < 0 || santaY >= GRID_SIZE) {
    console.log("Santa fell off the roof! Game over.");
    gameOver = true;
  }

  if (presents.length === 0) {
    console.log("You've collected all the presents! You win!");
    gameOver = true;
  }
}

function handleInput(input: string) {
  if (input === "w") {
    moveSanta(0, -1); // Move up
  } else if (input === "a") {
    moveSanta(-1, 0); // Move left
  } else if (input === "s") {
    moveSanta(0, 1); // Move down
  } else if (input === "d") {
    moveSanta(1, 0); // Move right
  }

  if (!gameOver) {
    renderGrid();
    rl.question("Which direction will Naughty Santa move? (w/a/s/d)", handleInput);
  } else {
    rl.close();
  }
}

// Initialize the game objects once
initializeObjects();
console.log("Welcome to the Naughty Santa game! Try to collect all the presents while avoiding coal and gathering power-ups!");
renderGrid();
rl.question("Which direction will Naughty Santa move? (w/a/s/d)", handleInput);
