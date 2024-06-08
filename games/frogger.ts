
// Frogger Game in TypeScript

class FroggerGame {
  // Game variables
  private grid: string[][];
  private frogRow: number;
  private frogCol: number;
  private gameInProgress: boolean;

  constructor() {
    // Initialize the game grid
    this.grid = [
      ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ];
    this.frogRow = 9;
    this.frogCol = 5;
    this.gameInProgress = true;
  }

  // Render the game grid
  render() {
    for (let row = 0; row < this.grid.length; row++) {
      let rowStr = '';
      for (let col = 0; col < this.grid[row].length; col++) {
        if (row === this.frogRow && col === this.frogCol) {
          rowStr += 'F';
        } else {
          rowStr += this.grid[row][col];
        }
        if (col < this.grid[row].length - 1) {
          rowStr += ' ';
        }
      }
      console.log(rowStr);
    }
  }

  // Handle user input
  handleInput(key: string) {
    if (this.gameInProgress) {
      switch (key.toLowerCase()) {
        case 'w':
          this.moveFrog(-1, 0);
          break;
        case 'a':
          this.moveFrog(0, -1);
          break;
        case 's':
          this.moveFrog(1, 0);
          break;
        case 'd':
          this.moveFrog(0, 1);
          break;
      }
    }
  }

  // Move the frog
  moveFrog(rowOffset: number, colOffset: number) {
    const newRow = this.frogRow + rowOffset;
    const newCol = this.frogCol + colOffset;

    if (newRow >= 0 && newRow < this.grid.length && newCol >= 0 && newCol < this.grid[0].length) {
      this.frogRow = newRow;
      this.frogCol = newCol;

      if (this.grid[newRow][newCol] === '#') {
        this.gameInProgress = false;
        console.log('Oh no! You got hit by a car!');
      } else if (newRow === 0) {
        this.gameInProgress = false;
        console.log('Congratulations! You made it across the road!');
      }
    } else {
      console.log('Invalid move!');
    }
  }
}

// Main game loop
function main() {
  const game = new FroggerGame();
  while (game.gameInProgress) {
    game.render();
    const input = prompt('Enter move (WASD): ');
    if (input) {
      game.handleInput(input);
    }
  }
}

// Start the game
main();
