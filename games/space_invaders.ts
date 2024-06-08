
// Define the player spaceship
class Player {
  public x: number;
  public y: number;

  constructor() {
    this.x = 40;
    this.y = 60;
  }

  moveLeft() {
    if (this.x > 0) this.x -= 10;
  }

  moveRight() {
    if (this.x < 80) this.x += 10;
  }
}

// Define the enemy invaders
class Invader {
  public x: number;
  public y: number;
  public isDestroyed: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.isDestroyed = false;
  }
}

// Create the game board
const board: string[][] = [];

for (let i = 0; i < 10; i++) {
  board[i] = [];
  for (let j = 0; j < 10; j++) {
    board[i][j] = " ";
  }
}

// Initialize player and invader
const player = new Player();
const invader = new Invader(40, 10);

// Game loop
while (true) {
  // Update the game board
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i === player.y && j === player.x) {
        board[i][j] = "P";
      } else if (i === invader.y && j === invader.x && !invader.isDestroyed) {
        board[i][j] = "I";
      } else {
        board[i][j] = " ";
      }
    }
  }

  // Render the game board
  let output = "";
  for (let row of board) {
    output += row.join("") + "\n";
  }
  console.clear();
  console.log(output);

  // Handle player input
  const input = prompt("Use 'a' and 'd' to move, press 'x' to shoot").toLowerCase();
  if (input === "a") {
    player.moveLeft();
  } else if (input === "d") {
    player.moveRight();
  } else if (input === "x") {
    // Implement shooting logic here
  }

  // Update invader position
  if (!invader.isDestroyed) {
    invader.y++;
    if (invader.y > 9) {
      console.log("Game over!");
      break;
    }
  }
}
