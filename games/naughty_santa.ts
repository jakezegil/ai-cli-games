
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

let santaX = Math.floor(Math.random() * GRID_SIZE);
let santaY = Math.floor(Math.random() * GRID_SIZE);
let presentX = Math.floor(Math.random() * GRID_SIZE);
let presentY = Math.floor(Math.random() * GRID_SIZE);

let coalLocations: { x: number; y: number }[] = [];
for (let i = 0; i < GRID_SIZE; i++) {
  let x = Math.floor(Math.random() * GRID_SIZE);
  let y = Math.floor(Math.random() * GRID_SIZE);
  coalLocations.push({ x, y });
}

let gameOver = false;

function renderGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    let row = "";
    for (let x = 0; x < GRID_SIZE; x++) {
      if (x === santaX && y === santaY) {
        row += SANTA;
      } else if (x === presentX && y === presentY) {
        row += PRESENT;
      } else if (
        coalLocations.some((coord) => coord.x === x && coord.y === y)
      ) {
        row += COAL;
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
  if (santaX === presentX && santaY === presentY) {
    console.log("Congratulations! You found the present! Naughty Santa has turned nice!");
    gameOver = true;
  }
  if (coalLocations.some((coord) => coord.x === santaX && coord.y === santaY)) {
    console.log("Oh no! Santa got stuck in a chimney! Game over.");
    gameOver = true;
  }
  if (santaX < 0 || santaX >= GRID_SIZE || santaY < 0 || santaY >= GRID_SIZE) {
    console.log("Santa fell off the roof! Game over.");
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

console.log("Welcome to the Naughty Santa game! Try to find the present without landing in the chimneys!");
renderGrid();
rl.question("Which direction will Naughty Santa move? (w/a/s/d)", handleInput);
