
class Connect4 {
  grid: string[][];
  currentPlayer: string;

  constructor() {
    this.grid = [];
    for (let i = 0; i < 6; i++) {
      this.grid.push([" ", " ", " ", " ", " ", " ", " "]);
    }
    this.currentPlayer = "X";
  }

  displayGrid() {
    for (let row of this.grid) {
      console.log(row.join("|"));
    }
    console.log("---------------");
  }

  dropDisc(col: number) {
    for (let i = 5; i >= 0; i--) {
      if (this.grid[i][col] === " ") {
        this.grid[i][col] = this.currentPlayer;
        return true;
      }
    }
    return false;
  }

  checkWin(row: number, col: number) {
    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ];

    for (let dir of directions) {
      let count = 1;
      let r = row + dir[0];
      let c = col + dir[1];
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.grid[r][c] === this.currentPlayer) {
        count++;
        r += dir[0];
        c += dir[1];
      }

      r = row - dir[0];
      c = col - dir[1];
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.grid[r][c] === this.currentPlayer) {
        count++;
        r -= dir[0];
        c -= dir[1];
      }

      if (count >= 4) {
        return true;
      }
    }

    return false;
  }

  playGame() {
    let gameOver = false;
    while (!gameOver) {
      this.displayGrid();
      let validMove = false;
      while (!validMove) {
        // Simulate input for simplicity
        const col = Math.floor(Math.random() * 7);
        validMove = this.dropDisc(col);
      }

      if (this.checkWin(5, col)) {
        this.displayGrid();
        console.log(`Player ${this.currentPlayer} wins!`);
        gameOver = true;
      } else {
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      }
    }
  }
}

const game = new Connect4();
game.playGame();
