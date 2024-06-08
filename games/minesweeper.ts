
class Minesweeper {
  private board: number[][];
  private revealedBoard: boolean[][];
  private numRows: number;
  private numCols: number;
  private numMines: number;
  private numRevealed: number;

  constructor(numRows: number, numCols: number, numMines: number) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.numMines = numMines;
    this.numRevealed = 0;

    this.board = [];
    this.revealedBoard = [];

    for (let i = 0; i < numRows; i++) {
      this.board[i] = new Array(numCols).fill(0);
      this.revealedBoard[i] = new Array(numCols).fill(false);
    }

    this.placeMines();
  }

  private placeMines() {
    for (let i = 0; i < this.numMines; i++) {
      let row = Math.floor(Math.random() * this.numRows);
      let col = Math.floor(Math.random() * this.numCols);
      while (this.board[row][col] === -1) {
        row = Math.floor(Math.random() * this.numRows);
        col = Math.floor(Math.random() * this.numCols);
      }
      this.board[row][col] = -1;
    }
  }

  private countAdjacentMines(row: number, col: number): number {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < this.numRows && j >= 0 && j < this.numCols) {
          if (this.board[i][j] === -1) {
            count++;
          }
        }
      }
    }
    return count;
  }

  private revealCell(row: number, col: number) {
    if (row < 0 || row >= this.numRows || col < 0 || col >= this.numCols) {
      return;
    }
    if (this.revealedBoard[row][col]) {
      return;
    }
    this.revealedBoard[row][col] = true;
    this.numRevealed++;

    if (this.board[row][col] === 0) {
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          this.revealCell(i, j);
        }
      }
    }
  }

  public isGameOver(): boolean {
    return this.numRevealed === this.numRows * this.numCols - this.numMines;
  }

  public renderBoard() {
    let output = '';
    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        if (this.revealedBoard[i][j]) {
          if (this.board[i][j] === -1) {
            output += '* ';
          } else {
            let adjacentMines = this.countAdjacentMines(i, j);
            output += adjacentMines + ' ';
          }
        } else {
          output += '. ';
        }
      }
      output += '\n';
    }
    console.log(output);
  }

  public handleInput(row: number, col: number) {
    if (this.revealedBoard[row][col]) {
      console.log('Cell already revealed!');
      return;
    }
    this.revealCell(row, col);
    if (this.board[row][col] === -1) {
      console.log('Game Over!');
      this.revealedBoard.forEach(row => row.fill(true));
      this.renderBoard();
    } else {
      this.renderBoard();
      if (this.isGameOver()) {
        console.log('You Win!');
      }
    }
  }
}

// To use the Minesweeper class:
const game = new Minesweeper(5, 5, 5);
game.renderBoard();
game.handleInput(2, 2);
game.handleInput(3, 3);
